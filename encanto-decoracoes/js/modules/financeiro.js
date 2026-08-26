/* ==========================================================================
   ENCANTO DECORAÇÕES — Módulo Financeiro
   ========================================================================== */

import { supabase } from '../lib/supabase-client.js';
import { getCurrentUser } from './auth.js';
import { registrarAuditoria } from './auditoria.js';

export async function listarPagamentos(eventoId) {
  return supabase
    .from('pagamentos')
    .select('*')
    .eq('evento_id', eventoId)
    .order('data', { ascending: false })
    .order('horario', { ascending: false });
}

/**
 * Saldo do evento (recebido, restante, status), calculado pela view
 * v_eventos_financeiro criada no Módulo 2.
 */
export async function buscarSaldo(eventoId) {
  return supabase
    .from('v_eventos_financeiro')
    .select('*')
    .eq('evento_id', eventoId)
    .single();
}

/**
 * Registra um pagamento manual. Regras de negócio (obrigatórias, não são só
 * validação de tela): todo pagamento manual precisa de comprovante, e o
 * valor nunca pode ultrapassar o saldo devedor do evento — o sistema
 * recusa salvar sem isso. "Quem registrou" e "horário" são preenchidos
 * automaticamente a partir da sessão logada, nunca digitados.
 *
 * A checagem de saldo aqui é só para dar uma mensagem amigável antes de
 * tentar salvar — a garantia final é o gatilho `trg_pagamentos_verificar_saldo`
 * no banco (sql/modulo24_regra_saldo_devedor.sql), que recusa o insert
 * mesmo se essa checagem for contornada.
 */
export async function criarPagamento(payload) {
  if (!payload.comprovante_url) {
    throw new Error('É obrigatório anexar um comprovante para registrar o pagamento.');
  }

  const { data: saldo } = await buscarSaldo(payload.evento_id);
  if (saldo && Number(payload.valor) > Number(saldo.valor_restante) + 0.01) {
    throw new Error(
      `Esse valor excede o saldo devedor do evento (restam ${Number(saldo.valor_restante).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}).`
    );
  }

  const usuario = await getCurrentUser();

  const resultado = await supabase.from('pagamentos').insert({
    ...payload,
    origem: 'manual',
    horario: payload.horario || new Date().toTimeString().slice(0, 8),
    registrado_por: usuario?.email || null,
  }).select().single();

  if (!resultado.error) {
    await registrarAuditoria('pagamento_manual', 'financeiro', resultado.data.id, null, resultado.data);
  }
  return resultado;
}

export async function excluirPagamento(id) {
  const { data: antes } = await supabase.from('pagamentos').select('*').eq('id', id).single();
  const resultado = await supabase.from('pagamentos').delete().eq('id', id);
  if (!resultado.error) {
    await registrarAuditoria('excluir', 'financeiro', id, antes, null);
  }
  return resultado;
}

/**
 * Envia o comprovante para o Storage e retorna o caminho salvo.
 * O caminho (não a URL pública, já que o bucket é privado) fica gravado
 * em pagamentos.comprovante_url.
 */
export async function uploadComprovante(file, eventoId) {
  const extensao = file.name.split('.').pop();
  const caminho = `${eventoId}/${Date.now()}.${extensao}`;

  const { error } = await supabase.storage.from('comprovantes').upload(caminho, file);
  if (error) throw error;
  return caminho;
}

/**
 * Gera uma URL temporária (1 hora) para visualizar/baixar um comprovante,
 * já que o bucket é privado.
 */
export async function urlComprovante(caminho) {
  const { data } = await supabase.storage.from('comprovantes').createSignedUrl(caminho, 3600);
  return data?.signedUrl || null;
}