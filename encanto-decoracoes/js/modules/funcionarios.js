/* ==========================================================================
   ENCANTO DECORAÇÕES — Módulo Funcionários
   Tela de uso interno (só quem administra o sistema) para controlar quanto
   pagar a cada membro da equipe. NÃO aparece no Dashboard principal da
   empresa — módulo isolado, de propósito.

   Os lançamentos (funcionario_pagamentos) são um histórico imutável: não
   existe função de editar ou excluir aqui, e o banco (RLS) também não
   permite — se um lançamento estiver errado, corrige-se com um novo
   lançamento de ajuste, nunca apagando o anterior.
   ========================================================================== */

import { supabase } from '../lib/supabase-client.js';
import { getCurrentUser } from './auth.js';

export async function listarFuncionarios() {
  return supabase.from('funcionarios').select('*').order('nome', { ascending: true });
}

export async function criarFuncionario(payload) {
  return supabase.from('funcionarios').insert(payload).select().single();
}

export async function atualizarFuncionario(id, payload) {
  return supabase.from('funcionarios').update(payload).eq('id', id).select().single();
}

/** Histórico completo de lançamentos de um funcionário (mais recente primeiro). */
export async function listarLancamentos(funcionarioId) {
  return supabase
    .from('funcionario_pagamentos')
    .select('*')
    .eq('funcionario_id', funcionarioId)
    .order('data', { ascending: false })
    .order('created_at', { ascending: false });
}

/**
 * Registra um lançamento (pagamento, adiantamento, desconto ou bônus).
 * "Quem registrou" é preenchido automaticamente pela sessão logada.
 */
export async function criarLancamento(payload) {
  const usuario = await getCurrentUser();
  return supabase.from('funcionario_pagamentos').insert({
    ...payload,
    registrado_por: usuario?.email || null,
  }).select().single();
}

export async function uploadComprovanteFuncionario(file, funcionarioId) {
  const extensao = file.name.split('.').pop();
  const caminho = `${funcionarioId}/${Date.now()}.${extensao}`;
  const { error } = await supabase.storage.from('funcionarios').upload(caminho, file);
  if (error) throw error;
  return caminho;
}

export async function urlComprovanteFuncionario(caminho) {
  const { data } = await supabase.storage.from('funcionarios').createSignedUrl(caminho, 3600);
  return data?.signedUrl || null;
}

/**
 * Resumo do mês (ano-mês no formato YYYY-MM) para TODOS os funcionários:
 * total pago, adiantado, descontado e em bônus — usado na listagem
 * principal, para ver rapidamente "quanto paguei pra cada um esse mês".
 */
export async function resumoMensal(anoMes) {
  const inicio = `${anoMes}-01`;
  const fim = new Date(Number(anoMes.slice(0, 4)), Number(anoMes.slice(5, 7)), 0).toISOString().slice(0, 10);

  const { data } = await supabase
    .from('funcionario_pagamentos')
    .select('funcionario_id, tipo, valor')
    .gte('data', inicio)
    .lte('data', fim);

  const resumo = {};
  (data || []).forEach(l => {
    resumo[l.funcionario_id] ||= { pagamento: 0, adiantamento: 0, desconto: 0, bonus: 0, total: 0 };
    resumo[l.funcionario_id][l.tipo] += Number(l.valor);
    // "Total pago" no mês = pagamentos + adiantamentos + bônus - descontos.
    const sinal = l.tipo === 'desconto' ? -1 : 1;
    resumo[l.funcionario_id].total += sinal * Number(l.valor);
  });

  return resumo;
}