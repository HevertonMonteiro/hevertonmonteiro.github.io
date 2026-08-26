/* ==========================================================================
   ENCANTO DECORAÇÕES — Módulo Agenda
   ========================================================================== */

import { supabase } from '../lib/supabase-client.js';
import { buscarBloqueioPorData } from './bloqueios.js';

const toISO = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/**
 * Busca eventos (não cancelados) dentro de um intervalo de datas,
 * já com o nome do cliente, para popular qualquer visão do calendário.
 */
export async function eventosNoIntervalo(inicioISO, fimISO) {
  return supabase
    .from('eventos')
    .select('id, data, horario, tipo_evento, tema, status, clientes(nome)')
    .gte('data', inicioISO)
    .lte('data', fimISO)
    .order('data', { ascending: true })
    .order('horario', { ascending: true });
}

/** Primeiro e último dia do mês da data de referência. */
export function limitesDoMes(referencia) {
  const inicio = new Date(referencia.getFullYear(), referencia.getMonth(), 1);
  const fim = new Date(referencia.getFullYear(), referencia.getMonth() + 1, 0);
  return { inicio, fim, inicioISO: toISO(inicio), fimISO: toISO(fim) };
}

/** Domingo e sábado da semana da data de referência. */
export function limitesDaSemana(referencia) {
  const diaSemana = referencia.getDay();
  const inicio = new Date(referencia);
  inicio.setDate(referencia.getDate() - diaSemana);
  const fim = new Date(inicio);
  fim.setDate(inicio.getDate() + 6);
  return { inicio, fim, inicioISO: toISO(inicio), fimISO: toISO(fim) };
}

export { toISO };

/**
 * Todos os eventos (não cancelados) de um dia — usado para mostrar a
 * agenda completa daquele dia na pesquisa de disponibilidade.
 */
export async function eventosDoDiaCompleto(dataISO) {
  const { data } = await supabase
    .from('eventos')
    .select('id, horario, tipo_evento, tema, clientes(nome)')
    .eq('data', dataISO)
    .neq('status', 'cancelado')
    .order('horario', { ascending: true });
  return data || [];
}

/**
 * Pesquisa de disponibilidade: a granularidade é o DIA inteiro, não mais
 * o horário — um dia está livre, ocupado (tem evento) ou bloqueado
 * manualmente (ver js/modules/bloqueios.js).
 */
export async function disponibilidadeDoDia(dataISO) {
  const [eventos, bloqueio] = await Promise.all([
    eventosDoDiaCompleto(dataISO),
    buscarBloqueioPorData(dataISO),
  ]);
  return { bloqueado: !!bloqueio, motivo: bloqueio?.motivo || null, eventos };
}
