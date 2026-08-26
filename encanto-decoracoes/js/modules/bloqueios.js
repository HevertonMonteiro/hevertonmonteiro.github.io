/* ==========================================================================
   ENCANTO DECORAÇÕES — Módulo Bloqueios de Agenda
   Bloqueio manual de dias inteiros (não de horários) na Agenda: férias,
   agenda cheia, feriado, compromisso pessoal, evento externo ou outro
   motivo livre.
   ========================================================================== */

import { supabase } from '../lib/supabase-client.js';
import { getCurrentUser } from './auth.js';
import { registrarAuditoria } from './auditoria.js';

export const MOTIVOS_BLOQUEIO = {
  agenda_cheia: 'Agenda cheia',
  ferias: 'Férias',
  feriado: 'Feriado',
  compromisso_pessoal: 'Compromisso pessoal',
  evento_externo: 'Evento externo / outro compromisso',
  outro: 'Outro',
};

export async function bloqueiosNoIntervalo(inicioISO, fimISO) {
  const { data } = await supabase
    .from('bloqueios_agenda')
    .select('id, data, motivo, observacao')
    .gte('data', inicioISO)
    .lte('data', fimISO)
    .order('data', { ascending: true });
  return data || [];
}

export async function buscarBloqueioPorData(dataISO) {
  const { data } = await supabase
    .from('bloqueios_agenda')
    .select('id, data, motivo, observacao')
    .eq('data', dataISO)
    .maybeSingle();
  return data || null;
}

export async function criarBloqueio({ data, motivo, observacao = null }) {
  const usuario = await getCurrentUser();
  const resultado = await supabase.from('bloqueios_agenda').insert({
    data, motivo, observacao,
    criado_por: usuario?.email || null,
  }).select().single();

  if (!resultado.error) {
    await registrarAuditoria('criar', 'bloqueios_agenda', resultado.data.id, null, resultado.data);
  }
  return resultado;
}

export async function removerBloqueio(id) {
  const { data: antes } = await supabase.from('bloqueios_agenda').select('*').eq('id', id).single();
  const resultado = await supabase.from('bloqueios_agenda').delete().eq('id', id);
  if (!resultado.error) {
    await registrarAuditoria('excluir', 'bloqueios_agenda', id, antes, null);
  }
  return resultado;
}
