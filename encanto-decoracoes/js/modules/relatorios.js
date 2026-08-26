/* ==========================================================================
   ENCANTO DECORAÇÕES — Módulo Relatórios (painel gerencial e financeiro)
   ========================================================================== */

import { supabase } from '../lib/supabase-client.js';
import { calcularPeriodo, navegarPeriodo } from './dashboard.js';
import { dataLocalISO, dataLocalDeISO } from '../lib/datas.js';

/**
 * Entradas (pagamentos recebidos) no período, com detalhamento por forma
 * de pagamento. Exclui pagamentos de eventos cancelados (mesma regra do
 * Dashboard, para os dois números baterem entre as telas).
 */
export async function buscarEntradas(inicio, fim) {
  const { data } = await supabase
    .from('pagamentos')
    .select('valor, forma_pagamento, eventos!inner(status)')
    .gte('data', inicio).lte('data', fim)
    .neq('eventos.status', 'cancelado');

  const porForma = { pix: 0, cartao: 0, dinheiro: 0, transferencia: 0, boleto: 0 };
  let total = 0;
  (data || []).forEach(p => {
    total += Number(p.valor);
    porForma[p.forma_pagamento] = (porForma[p.forma_pagamento] || 0) + Number(p.valor);
  });

  return { total, porForma, totalPagamentos: (data || []).length };
}

/**
 * Valor pendente (a receber) de eventos não cancelados com DATA DO EVENTO
 * no período selecionado (diferente do Dashboard, que mostra o total
 * geral independente do período — aqui o relatório é sempre por período).
 */
export async function buscarPendentes(inicio, fim) {
  const { data } = await supabase
    .from('v_eventos_financeiro')
    .select('valor_restante, status, data')
    .gte('data', inicio).lte('data', fim)
    .neq('status', 'cancelado')
    .gt('valor_restante', 0);

  const total = (data || []).reduce((soma, e) => soma + Number(e.valor_restante), 0);
  return { total, itens: data || [] };
}

/**
 * Eventos no período — já traz os campos necessários para todos os
 * outros relatórios (status, tipo, tema, pacote, valor, cliente), evitando
 * repetir a mesma consulta várias vezes.
 */
export async function buscarEventosPorPeriodo(inicio, fim) {
  const { data } = await supabase
    .from('eventos')
    .select('id, status, tema, pacote, tipo_evento, valor_orcamento, data, cliente_id')
    .gte('data', inicio).lte('data', fim);

  const porStatus = { orcamento: 0, confirmado: 0, concluido: 0, finalizado: 0, cancelado: 0 };
  (data || []).forEach(ev => { porStatus[ev.status] = (porStatus[ev.status] || 0) + 1; });

  return { total: (data || []).length, porStatus, eventos: data || [] };
}

/** Agrupa uma lista de eventos por um campo (tema, pacote, tipo_evento) — contagem. */
export function agruparPorCampo(eventos, campo) {
  const grupos = {};
  eventos.forEach(ev => {
    const chave = ev[campo] || 'Não informado';
    grupos[chave] = (grupos[chave] || 0) + 1;
  });
  return Object.entries(grupos).sort((a, b) => b[1] - a[1]);
}

/** Clientes cadastrados no período + total geral da base. */
export async function buscarClientesCadastrados(inicio, fim) {
  const [{ count: noPeriodo }, { count: totalGeral }] = await Promise.all([
    supabase.from('clientes').select('id', { count: 'exact', head: true })
      .gte('created_at', `${inicio}T00:00:00`).lte('created_at', `${fim}T23:59:59`),
    supabase.from('clientes').select('id', { count: 'exact', head: true }),
  ]);
  return { noPeriodo: noPeriodo || 0, totalGeral: totalGeral || 0 };
}

/**
 * Faturamento bruto (soma dos orçamentos de eventos não cancelados no
 * período), ticket médio, e médias de faturamento por dia/semana/mês —
 * calculadas a partir da lista de eventos já carregada (sem nova consulta).
 */
export function calcularFaturamento(eventos, inicio, fim) {
  const ativos = eventos.filter(ev => ev.status !== 'cancelado');
  const faturamentoBruto = ativos.reduce((soma, ev) => soma + Number(ev.valor_orcamento || 0), 0);
  const ticketMedio = ativos.length ? faturamentoBruto / ativos.length : 0;

  const dias = Math.max(1, Math.round((new Date(fim) - new Date(inicio)) / 86400000) + 1);
  const mediaDiaria = faturamentoBruto / dias;

  return {
    faturamentoBruto,
    ticketMedio,
    mediaDiaria,
    mediaSemanal: mediaDiaria * 7,
    mediaMensal: mediaDiaria * 30,
    totalEventosAtivos: ativos.length,
  };
}

/**
 * Clientes novos (primeira vez que aparecem com um evento na base, dentro
 * do período) vs clientes recorrentes (já tinham outro evento antes do
 * período) — a partir dos clientes que têm evento no período selecionado.
 */
export async function buscarClientesRecorrentes(eventosPeriodo) {
  const clienteIds = [...new Set(eventosPeriodo.map(ev => ev.cliente_id).filter(Boolean))];
  if (!clienteIds.length) return { novos: 0, recorrentes: 0 };

  const { data } = await supabase
    .from('eventos')
    .select('cliente_id, data')
    .in('cliente_id', clienteIds);

  // Para cada cliente do período, verifica se ele tem algum evento com
  // data ANTERIOR à menor data do período — se tiver, é recorrente.
  const menorDataPeriodo = eventosPeriodo.reduce((min, ev) => (ev.data < min ? ev.data : min), eventosPeriodo[0].data);
  const eventosPorCliente = {};
  (data || []).forEach(ev => { (eventosPorCliente[ev.cliente_id] ||= []).push(ev.data); });

  let recorrentes = 0;
  clienteIds.forEach(id => {
    const teveAntes = (eventosPorCliente[id] || []).some(d => d < menorDataPeriodo);
    if (teveAntes) recorrentes++;
  });

  return { novos: clienteIds.length - recorrentes, recorrentes };
}

/**
 * Evolução do faturamento, dos recebimentos e da quantidade de eventos ao
 * longo do período, em "baldes" (dia, se o período for curto; mês, se for
 * mais longo) — usado no gráfico de evolução.
 */
export async function buscarEvolucao(inicio, fim) {
  const dias = Math.round((new Date(fim) - new Date(inicio)) / 86400000) + 1;
  const granularidade = dias <= 62 ? 'dia' : 'mes';

  const [{ data: eventos }, { data: pagamentos }] = await Promise.all([
    supabase.from('eventos').select('data, valor_orcamento, status').gte('data', inicio).lte('data', fim),
    supabase.from('pagamentos').select('data, valor, eventos!inner(status)')
      .gte('data', inicio).lte('data', fim).neq('eventos.status', 'cancelado'),
  ]);

  const chave = (dataISO) => (granularidade === 'dia' ? dataISO : dataISO.slice(0, 7));

  const baldes = {};
  const registrarBalde = (k) => { if (!baldes[k]) baldes[k] = { faturamento: 0, recebido: 0, eventos: 0 }; return baldes[k]; };

  (eventos || []).filter(ev => ev.status !== 'cancelado').forEach(ev => {
    const b = registrarBalde(chave(ev.data));
    b.faturamento += Number(ev.valor_orcamento || 0);
    b.eventos += 1;
  });
  (pagamentos || []).forEach(p => {
    const b = registrarBalde(chave(p.data));
    b.recebido += Number(p.valor);
  });

  const chaves = Object.keys(baldes).sort();
  return {
    granularidade,
    labels: chaves,
    faturamento: chaves.map(k => baldes[k].faturamento),
    recebido: chaves.map(k => baldes[k].recebido),
    eventos: chaves.map(k => baldes[k].eventos),
  };
}

/**
 * Compara o período atual com o período imediatamente anterior de mesma
 * duração (ex: este mês vs mês passado), retornando a variação percentual
 * de faturamento, recebido e quantidade de eventos.
 */
export async function buscarComparacaoPeriodoAnterior(tipoPeriodo, referencia, personalizado, atual) {
  let inicioAnterior, fimAnterior;

  if (tipoPeriodo === 'personalizado' && personalizado) {
    // Para período personalizado, usa um intervalo anterior de mesma duração.
    // dataLocalDeISO (não `new Date(string)` puro) porque uma string
    // "YYYY-MM-DD" sem horário é interpretada pelo JS como meia-noite em
    // UTC, não local — no fuso do Brasil isso "voltava" a data em um dia.
    const diasIntervalo = Math.round((dataLocalDeISO(personalizado.fim) - dataLocalDeISO(personalizado.inicio)) / 86400000) + 1;
    const fimAnt = dataLocalDeISO(personalizado.inicio);
    fimAnt.setDate(fimAnt.getDate() - 1);
    const inicioAnt = new Date(fimAnt);
    inicioAnt.setDate(inicioAnt.getDate() - diasIntervalo + 1);
    inicioAnterior = dataLocalISO(inicioAnt);
    fimAnterior = dataLocalISO(fimAnt);
  } else {
    const refAnterior = navegarPeriodo(tipoPeriodo, referencia, 'anterior');
    const periodo = calcularPeriodo(tipoPeriodo, refAnterior, null);
    inicioAnterior = periodo.inicio;
    fimAnterior = periodo.fim;
  }

  const [entradasAnt, eventosAnt] = await Promise.all([
    buscarEntradas(inicioAnterior, fimAnterior),
    buscarEventosPorPeriodo(inicioAnterior, fimAnterior),
  ]);
  const faturamentoAnt = calcularFaturamento(eventosAnt.eventos, inicioAnterior, fimAnterior).faturamentoBruto;

  const variacao = (novo, antigo) => {
    if (!antigo) return novo > 0 ? 100 : 0;
    return ((novo - antigo) / antigo) * 100;
  };

  return {
    inicioAnterior,
    fimAnterior,
    faturamentoAnterior: faturamentoAnt,
    recebidoAnterior: entradasAnt.total,
    eventosAnterior: eventosAnt.total,
    variacaoFaturamento: variacao(atual.faturamentoBruto, faturamentoAnt),
    variacaoRecebido: variacao(atual.recebido, entradasAnt.total),
    variacaoEventos: variacao(atual.totalEventos, eventosAnt.total),
  };
}