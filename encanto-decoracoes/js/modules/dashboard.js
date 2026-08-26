/* ==========================================================================
   ENCANTO DECORAÇÕES — Dashboard: dados e métricas
   ========================================================================== */

import { supabase } from '../lib/supabase-client.js';
import { dataLocalISO } from '../lib/datas.js';

/**
 * Calcula o intervalo [inicio, fim] (strings YYYY-MM-DD) para um tipo de
 * período, a partir de uma data de referência (para permitir navegação por
 * meses/semanas/anos anteriores e futuros).
 */
export function calcularPeriodo(tipo, referencia = new Date(), personalizado = null) {
  const ref = new Date(referencia);
  ref.setHours(0, 0, 0, 0);

  const toISO = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  if (tipo === 'personalizado' && personalizado?.inicio && personalizado?.fim) {
    return { inicio: personalizado.inicio, fim: personalizado.fim };
  }

  if (tipo === 'hoje') {
    return { inicio: toISO(ref), fim: toISO(ref) };
  }

  if (tipo === 'semana') {
    const diaSemana = ref.getDay(); // 0 = domingo
    const inicio = new Date(ref);
    inicio.setDate(ref.getDate() - diaSemana);
    const fim = new Date(inicio);
    fim.setDate(inicio.getDate() + 6);
    return { inicio: toISO(inicio), fim: toISO(fim) };
  }

  if (tipo === 'ano') {
    return { inicio: `${ref.getFullYear()}-01-01`, fim: `${ref.getFullYear()}-12-31` };
  }

  // 'mes' (padrão)
  const inicio = new Date(ref.getFullYear(), ref.getMonth(), 1);
  const fim = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);
  return { inicio: toISO(inicio), fim: toISO(fim) };
}

/**
 * Move a data de referência para o período anterior/próximo, respeitando
 * o tipo de período selecionado (dia, semana, mês ou ano).
 */
export function navegarPeriodo(tipo, referencia, direcao) {
  const ref = new Date(referencia);
  const passo = direcao === 'anterior' ? -1 : 1;

  if (tipo === 'hoje') ref.setDate(ref.getDate() + passo);
  else if (tipo === 'semana') ref.setDate(ref.getDate() + passo * 7);
  else if (tipo === 'ano') ref.setFullYear(ref.getFullYear() + passo);
  else ref.setMonth(ref.getMonth() + passo); // mes

  return ref;
}

/**
 * Busca todas as métricas do dashboard para o período informado.
 *
 * O financeiro tem UM número ligado ao período selecionado e dois números
 * que olham sempre pra frente (independem do período), porque respondem
 * perguntas diferentes — é a mesma separação "regime de caixa" que
 * qualquer contabilidade profissional usa entre "receita do período" e
 * "adiantamentos recebidos":
 *  - `recebidoEventosPeriodo`: de tudo que já recebi, quanto é referente
 *    a eventos que acontecem NESTE período (não importa em que mês o
 *    pagamento caiu — cobre "a festa é hoje, mas paguei mês passado").
 *  - `aReceberConfirmado` (ver buscarFinanceiroFuturo): de todos os
 *    eventos já confirmados (qualquer mês futuro), quanto ainda falta
 *    receber no total.
 *  - `recebidoEventosFuturos` (ver buscarFinanceiroFuturo): de todos os
 *    eventos futuros já confirmados, quanto já entrou de adiantamento —
 *    dinheiro em caixa que ainda não é "receita liberada" desse mês.
 */
export async function buscarMetricas({ inicio, fim }) {
  const hojeISO = dataLocalISO();

  const [
    eventosPeriodo,
    proximosEventos,
    financeiroPeriodo,
    orcadosSemPagamento,
    concluidosPendentes,
  ] = await Promise.all([
    // Só pra alimentar o gráfico "Eventos por status no período".
    supabase.from('eventos').select('id, status').gte('data', inicio).lte('data', fim),
    supabase.from('eventos')
      .select('id, data, horario, tipo_evento, tema, clientes(nome)')
      .gte('data', hojeISO)
      .not('status', 'in', '(cancelado,finalizado)')
      .order('data', { ascending: true })
      .order('horario', { ascending: true })
      .limit(5),
    // v_eventos_financeiro já traz valor_recebido somado e a data/status
    // do evento (redefinida em sql/modulo19_correcoes.sql).
    supabase.from('v_eventos_financeiro')
      .select('valor_recebido, status')
      .gte('data', inicio).lte('data', fim)
      .neq('status', 'cancelado'),
    // Orçados aguardando o primeiro pagamento (para confirmar) — não é
    // filtrado pelo período: é uma lista de ação, sempre olhando pra frente.
    supabase.from('eventos')
      .select('id, data, tipo_evento, tema, valor_orcamento, clientes(nome)')
      .eq('status', 'orcamento')
      .order('data', { ascending: true })
      .limit(8),
    // Concluídos (já aconteceram) aguardando 100% do pagamento.
    supabase.from('eventos')
      .select('id, data, tipo_evento, tema, valor_orcamento, clientes(nome)')
      .eq('status', 'concluido')
      .order('data', { ascending: false })
      .limit(8),
  ]);

  const contagemStatus = { orcamento: 0, confirmado: 0, concluido: 0, finalizado: 0, cancelado: 0 };
  (eventosPeriodo.data || []).forEach(ev => { contagemStatus[ev.status] = (contagemStatus[ev.status] || 0) + 1; });

  const recebidoEventosPeriodo = (financeiroPeriodo.data || [])
    .reduce((soma, e) => soma + Number(e.valor_recebido || 0), 0);

  return {
    contagemStatus,
    proximosEventos: proximosEventos.data || [],

    recebidoEventosPeriodo,

    orcadosSemPagamento: orcadosSemPagamento.data || [],
    concluidosPendentes: concluidosPendentes.data || [],
  };
}

/**
 * Financeiro que olha pra FRENTE, sem filtro de período — só dos eventos
 * já "confirmado" (por definição, no nosso fluxo de status, um evento
 * confirmado sempre tem data futura: assim que a data passa ele vira
 * "concluido" sozinho — ver sincronizarEventosVencidos em eventos.js):
 *  - quanto ainda falta receber no total (a receber futuramente);
 *  - quanto já entrou de adiantamento, no total, desses eventos futuros.
 *  - quanto já foi recebido HOJE (pela data do pagamento), independente
 *    do período selecionado no Dashboard — R$ 0,00 se nada foi registrado
 *    ainda hoje.
 */
export async function buscarFinanceiroFuturo() {
  const hojeISO = dataLocalISO();

  const [financeiroFuturo, pagamentosHoje] = await Promise.all([
    supabase.from('v_eventos_financeiro').select('valor_recebido, valor_restante').eq('status', 'confirmado'),
    supabase.from('pagamentos').select('valor, eventos!inner(status)').eq('data', hojeISO).neq('eventos.status', 'cancelado'),
  ]);

  const linhas = financeiroFuturo.data || [];
  const aReceberConfirmado = linhas.reduce((soma, e) => soma + Math.max(Number(e.valor_restante || 0), 0), 0);
  const recebidoEventosFuturos = linhas.reduce((soma, e) => soma + Number(e.valor_recebido || 0), 0);

  const recebidoHoje = (pagamentosHoje.data || []).reduce((soma, p) => soma + Number(p.valor), 0);

  return { aReceberConfirmado, recebidoEventosFuturos, recebidoHoje };
}