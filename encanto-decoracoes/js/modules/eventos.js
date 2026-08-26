/* ==========================================================================
   ENCANTO DECORAÇÕES — Módulo Eventos
   ========================================================================== */

import { supabase, cabecalhoAutenticado } from '../lib/supabase-client.js';
import { registrarAuditoria } from './auditoria.js';
import { dataLocalISO } from '../lib/datas.js';

/**
 * Sincronização com o Google Agenda é best-effort: dispara e não espera.
 * Se a integração não estiver conectada (ou a chamada falhar), o salvamento
 * do evento no sistema não deve ser afetado de forma alguma.
 */
async function sincronizarGoogleAgenda(payload) {
  fetch('/api/google-agenda-sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await cabecalhoAutenticado()) },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

const CAMPOS_LISTA = `
  id, data, horario, tipo_evento, tema, pacote, status, valor_orcamento,
  cliente_id, clientes(nome)
`;

/**
 * Marca cada evento com `statusPagamento` ('quitado' ou 'pendente' — trata
 * "parcial" como pendente também, é uma leitura binária de propósito:
 * só é "pago" quando 100% do orçamento foi recebido) a partir da view
 * `v_eventos_financeiro`, para exibir o selo Pago/Pagamento pendente nas
 * listagens sem cada tela precisar calcular isso na mão.
 */
async function anexarStatusPagamento(eventos) {
  if (!eventos?.length) return eventos;
  const { data: saldos } = await supabase
    .from('v_eventos_financeiro')
    .select('evento_id, status_pagamento')
    .in('evento_id', eventos.map(ev => ev.id));

  const statusPorEvento = Object.fromEntries((saldos || []).map(s => [s.evento_id, s.status_pagamento]));
  return eventos.map(ev => ({
    ...ev,
    statusPagamento: statusPorEvento[ev.id] === 'quitado' ? 'quitado' : 'pendente',
  }));
}

/**
 * Lista eventos com filtros combináveis: termo (cliente/tema/endereço),
 * status e intervalo de datas.
 *
 * Sem busca por termo, mostra os `limite` eventos mais recentes por data
 * (10 por padrão) — com termo, o limite é ignorado porque a busca de
 * texto já é feita em memória sobre o conjunto completo (ver abaixo).
 *
 * Eventos "finalizado" (100% pagos) saem da lista por padrão — o histórico
 * deles passa a viver só no cadastro do cliente (js/modules/clientes.js
 * historicoEventos). Só aparecem aqui se `status` pedir "finalizado"
 * explicitamente (`status` aceita uma string ou um array, para o filtro
 * "Finalizados" da tela de Eventos poder pedir "concluido" + "finalizado"
 * de uma vez — todo evento que já aconteceu, pago ou não).
 */
export async function listarEventos({ termo = '', status = '', inicio = '', fim = '', limite = 10 } = {}) {
  let query = supabase
    .from('eventos')
    .select(CAMPOS_LISTA)
    .order('data', { ascending: false })
    .order('horario', { ascending: true });

  if (Array.isArray(status) && status.length) query = query.in('status', status);
  else if (status) query = query.eq('status', status);
  else query = query.neq('status', 'finalizado');
  if (inicio) query = query.gte('data', inicio);
  if (fim) query = query.lte('data', fim);
  if (!termo.trim() && limite) query = query.limit(limite);

  const { data, error } = await query;
  if (error) return { data, error };
  if (!termo.trim()) return { data: await anexarStatusPagamento(data), error: null };

  // Filtro por texto feito em memória (cliente, tema, endereço) porque
  // envolve uma tabela relacionada (clientes.nome) e o Supabase/PostgREST
  // não filtra facilmente por coluna de outra tabela + colunas locais numa
  // única chamada `.or()`.
  const t = termo.trim().toLowerCase();
  const filtrado = (data || []).filter(ev =>
    (ev.clientes?.nome || '').toLowerCase().includes(t) ||
    (ev.tema || '').toLowerCase().includes(t) ||
    (ev.tipo_evento || '').toLowerCase().includes(t)
  );
  return { data: await anexarStatusPagamento(filtrado), error: null };
}

export async function buscarEventoPorId(id) {
  return supabase
    .from('eventos')
    .select('*, clientes(id, nome, whatsapp, cpf, endereco)')
    .eq('id', id)
    .single();
}

export async function criarEvento(payload) {
  const resultado = await supabase.from('eventos').insert(payload).select().single();
  if (!resultado.error) {
    await registrarAuditoria('criar', 'eventos', resultado.data.id, null, resultado.data);
    sincronizarGoogleAgenda({ eventoId: resultado.data.id });
  }
  return resultado;
}

export async function atualizarEvento(id, payload) {
  const { data: antes } = await supabase.from('eventos').select('*').eq('id', id).single();
  const resultado = await supabase.from('eventos').update(payload).eq('id', id).select().single();
  if (!resultado.error) {
    // Cancelamento é tratado como uma ação própria na auditoria (mais fácil
    // de filtrar depois do que vasculhar todo "editar" procurando esse caso).
    const acao = (payload.status === 'cancelado' && antes?.status !== 'cancelado') ? 'cancelar' : 'editar';
    await registrarAuditoria(acao, 'eventos', id, antes, resultado.data);
    sincronizarGoogleAgenda({ eventoId: id });
  }
  return resultado;
}

export async function excluirEvento(id) {
  const { data: antes } = await supabase.from('eventos').select('*').eq('id', id).single();
  const resultado = await supabase.from('eventos').delete().eq('id', id);
  if (!resultado.error) {
    await registrarAuditoria('excluir', 'eventos', id, antes, null);
    if (antes?.google_event_id) sincronizarGoogleAgenda({ googleEventId: antes.google_event_id });
  }
  return resultado;
}

/**
 * Verifica se já existe outro evento (não cancelado) na mesma data e
 * horário. Usado antes de salvar, para avisar sobre choque de agenda.
 * @param {string} eventoIdAtual - excluído da checagem (edição do próprio evento)
 */
export async function verificarConflito({ data, horario, eventoIdAtual = null }) {
  if (!data || !horario) return [];

  let query = supabase
    .from('eventos')
    .select('id, tipo_evento, tema, horario, clientes(nome)')
    .eq('data', data)
    .eq('horario', horario)
    .neq('status', 'cancelado');

  if (eventoIdAtual) query = query.neq('id', eventoIdAtual);

  const { data: conflitos } = await query;
  return conflitos || [];
}

/**
 * Eventos do dia — usado pelo módulo de Produção (Roteiro do dia).
 */
export async function eventosDoDia(dataISO) {
  return supabase
    .from('eventos')
    .select('*, clientes(nome, whatsapp)')
    .eq('data', dataISO)
    .neq('status', 'cancelado')
    .order('horario', { ascending: true });
}

/**
 * Move para "concluido" todo evento "confirmado" cuja data já passou, e
 * promove para "finalizado" todo evento "concluido" que já está 100% pago.
 *
 * Não existe servidor rodando o tempo todo neste projeto (site estático +
 * Supabase), então essa checagem por data não pode ser um cron — é feita
 * aqui, chamada uma vez a cada carregamento de página autenticada (ver
 * js/modules/route-guard.js), best-effort: nunca deve travar a navegação.
 *
 * A segunda parte (concluido → finalizado) existe porque o gatilho de
 * `pagamentos` (sql/modulo26_status_financeiro.sql) só reage NO MOMENTO em
 * que um pagamento é inserido/alterado — e é muito comum o cliente pagar
 * 100% ANTES da data do evento, quando o evento ainda está "confirmado".
 * Nesse caso o gatilho não tem como saber que o evento ficaria "concluido"
 * mais tarde, e ele fica preso em "concluido" mesmo já quitado. Por isso
 * essa checagem sempre revê TODOS os eventos concluídos (não só os que
 * acabaram de vencer aqui), o que também autocorrige qualquer evento que já
 * tivesse ficado preso assim antes desta correção existir.
 */
export async function sincronizarEventosVencidos() {
  try {
    const hojeISO = dataLocalISO();
    const { data: vencidos } = await supabase
      .from('eventos')
      .select('id')
      .eq('status', 'confirmado')
      .lt('data', hojeISO);

    if (vencidos?.length) {
      await supabase.from('eventos').update({ status: 'concluido' }).in('id', vencidos.map(ev => ev.id));
    }

    const { data: financeiro } = await supabase
      .from('v_eventos_financeiro')
      .select('evento_id, valor_recebido, valor_orcamento')
      .eq('status', 'concluido');

    // Tolerância de 1 centavo, mesmo padrão usado no gatilho de saldo
    // devedor (sql/modulo24_regra_saldo_devedor.sql), para não deixar de
    // finalizar por causa de arredondamento de ponto flutuante.
    const quitados = (financeiro || [])
      .filter(e => Number(e.valor_orcamento) > 0 && Number(e.valor_recebido) + 0.01 >= Number(e.valor_orcamento))
      .map(e => e.evento_id);

    if (quitados.length) {
      await supabase.from('eventos').update({ status: 'finalizado' }).in('id', quitados);
    }
  } catch (err) {
    console.error('[Encanto Decorações] Não foi possível sincronizar eventos vencidos:', err);
  }
}