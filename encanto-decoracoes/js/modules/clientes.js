/* ==========================================================================
   ENCANTO DECORAÇÕES — Módulo Clientes
   Toda a lógica de acesso a dados de clientes fica centralizada aqui,
   para ser reutilizada pela listagem, pelo formulário, pela página de
   detalhe e futuramente pela Importação Inteligente e pela Pesquisa Global.
   ========================================================================== */

import { supabase } from '../lib/supabase-client.js';
import { registrarAuditoria } from './auditoria.js';

/**
 * Lista clientes, com busca opcional por nome ou WhatsApp.
 *
 * Sem busca, mostra os cadastrados mais recentes primeiro, limitados por
 * `limite` (10 por padrão) — evita carregar a base inteira sempre que a
 * tela abre. Uma busca por termo ignora o limite: quem está procurando
 * alguém específico precisa achar, mesmo que não esteja entre os recentes.
 */
export async function listarClientes(termo = '', limite = 10) {
  let query = supabase
    .from('clientes')
    .select('id, nome, whatsapp, instagram, created_at')
    .order('created_at', { ascending: false });

  const t = termo.trim();
  if (t) {
    query = query.or(`nome.ilike.%${t}%,whatsapp.ilike.%${t}%`);
  } else if (limite) {
    query = query.limit(limite);
  }

  return query;
}

export async function buscarClientePorId(id) {
  return supabase.from('clientes').select('*').eq('id', id).single();
}

export async function criarCliente(payload) {
  const resultado = await supabase.from('clientes').insert(payload).select().single();
  if (!resultado.error) {
    await registrarAuditoria('criar', 'clientes', resultado.data.id, null, resultado.data);
  }
  return resultado;
}

export async function atualizarCliente(id, payload) {
  const { data: antes } = await buscarClientePorId(id);
  const resultado = await supabase.from('clientes').update(payload).eq('id', id).select().single();
  if (!resultado.error) {
    await registrarAuditoria('editar', 'clientes', id, antes, resultado.data);
  }
  return resultado;
}

export async function excluirCliente(id) {
  const { data: antes } = await buscarClientePorId(id);
  const resultado = await supabase.from('clientes').delete().eq('id', id);
  if (!resultado.error) {
    await registrarAuditoria('excluir', 'clientes', id, antes, null);
  }
  return resultado;
}

/**
 * Histórico de eventos do cliente (mais recentes primeiro), já com
 * `statusPagamento` ('quitado' ou 'pendente') calculado — leitura binária
 * de propósito: só é "pago" quando 100% do orçamento foi recebido, mesmo
 * que já tenha entrado um pagamento parcial.
 */
export async function historicoEventos(clienteId) {
  const { data: eventos, error } = await supabase
    .from('eventos')
    .select('id, data, horario, tipo_evento, tema, pacote, status, valor_orcamento')
    .eq('cliente_id', clienteId)
    .order('data', { ascending: false });

  if (error || !eventos?.length) return { data: eventos, error };

  const { data: saldos } = await supabase
    .from('v_eventos_financeiro')
    .select('evento_id, status_pagamento')
    .in('evento_id', eventos.map(ev => ev.id));

  const statusPorEvento = Object.fromEntries((saldos || []).map(s => [s.evento_id, s.status_pagamento]));
  return {
    data: eventos.map(ev => ({
      ...ev,
      statusPagamento: statusPorEvento[ev.id] === 'quitado' ? 'quitado' : 'pendente',
    })),
    error: null,
  };
}

/**
 * Histórico financeiro do cliente: todos os pagamentos de todos os seus
 * eventos, com o nome/data do evento junto para dar contexto.
 */
export async function historicoFinanceiro(clienteId) {
  return supabase
    .from('pagamentos')
    .select('id, valor, data, forma_pagamento, observacao, comprovante_url, eventos!inner(id, data, tipo_evento, cliente_id)')
    .eq('eventos.cliente_id', clienteId)
    .order('data', { ascending: false });
}

/**
 * Contratos gerados para eventos do cliente.
 */
export async function historicoContratos(clienteId) {
  return supabase
    .from('contratos')
    .select('id, arquivo_url, codigo_curto, gerado_em, eventos!inner(id, data, tipo_evento, cliente_id)')
    .eq('eventos.cliente_id', clienteId)
    .order('gerado_em', { ascending: false });
}

/**
 * Impede a exclusão silenciosa de um cliente que já tem eventos —
 * evita perder o histórico por engano. A tela decide o que fazer com isso
 * (bloquear, ou pedir confirmação extra).
 */
export async function clientePossuiEventos(clienteId) {
  const { count } = await supabase
    .from('eventos')
    .select('id', { count: 'exact', head: true })
    .eq('cliente_id', clienteId);
  return (count || 0) > 0;
}