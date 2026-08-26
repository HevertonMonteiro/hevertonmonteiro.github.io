/* ==========================================================================
   ENCANTO DECORAÇÕES — Módulo Pagamentos (visão por cliente)
   ========================================================================== */

import { supabase } from '../lib/supabase-client.js';

/**
 * Todos os clientes que têm algum evento com saldo pendente (não
 * cancelado) — usado para já mostrar quem está devendo assim que a tela
 * abre, sem precisar buscar por nome primeiro.
 */
export async function listarClientesComPendencia() {
  // Consulta direto na view, sem "embed" para outras tabelas (instável em
  // views) — a view já traz cliente_id, então buscamos os dados dos
  // clientes numa segunda consulta simples, por id.
  const { data: saldos, error } = await supabase
    .from('v_eventos_financeiro')
    .select('cliente_id, valor_restante, status')
    .neq('status', 'cancelado')
    .gt('valor_restante', 0);

  if (error || !saldos?.length) return { data: [], error };

  const clienteIds = [...new Set(saldos.map(s => s.cliente_id))];
  const { data: clientes } = await supabase
    .from('clientes')
    .select('id, nome, whatsapp')
    .in('id', clienteIds);

  const clientesPorId = Object.fromEntries((clientes || []).map(c => [c.id, c]));

  const porCliente = {};
  saldos.forEach(s => {
    const cliente = clientesPorId[s.cliente_id];
    if (!cliente) return;
    porCliente[cliente.id] ||= { ...cliente, totalPendente: 0, qtdEventos: 0 };
    porCliente[cliente.id].totalPendente += Number(s.valor_restante);
    porCliente[cliente.id].qtdEventos += 1;
  });

  return { data: Object.values(porCliente).sort((a, b) => b.totalPendente - a.totalPendente), error: null };
}

/**
 * Todos os pagamentos (manuais ou via Mercado Pago) recebidos num dia
 * específico, com cliente e evento já resolvidos — usado na aba
 * "Recebimentos do dia".
 */
export async function listarPagamentosDoDia(dataISO, limite = 10) {
  let query = supabase
    .from('pagamentos')
    .select('id, valor, horario, forma_pagamento, origem, observacao, eventos(id, tipo_evento, tema, clientes(nome))')
    .eq('data', dataISO)
    .order('horario', { ascending: false });

  if (limite) query = query.limit(limite);

  return query;
}

export async function listarEventosDoClienteComSaldo(clienteId) {
  const { data: eventos, error } = await supabase
    .from('eventos')
    .select('id, data, horario, tipo_evento, tema, pacote, status, valor_orcamento')
    .eq('cliente_id', clienteId)
    .order('data', { ascending: false });

  if (error || !eventos?.length) return { data: [], error };

  const { data: saldos } = await supabase
    .from('v_eventos_financeiro')
    .select('evento_id, valor_recebido, valor_restante, status_pagamento')
    .in('evento_id', eventos.map(e => e.id));

  const saldoPorEvento = Object.fromEntries((saldos || []).map(s => [s.evento_id, s]));

  return {
    data: eventos.map(ev => ({ ...ev, saldo: saldoPorEvento[ev.id] || null })),
    error: null,
  };
}