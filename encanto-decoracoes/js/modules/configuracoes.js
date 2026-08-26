/* ==========================================================================
   ENCANTO DECORAÇÕES — Módulo Configurações
   ========================================================================== */

import { supabase } from '../lib/supabase-client.js';

// ---------- Empresa ----------
export async function buscarEmpresa() {
  return supabase.from('empresa_config').select('*').eq('id', 1).single();
}

export async function salvarEmpresa(payload) {
  return supabase.from('empresa_config').update(payload).eq('id', 1);
}

export async function uploadLogo(file) {
  const extensao = file.name.split('.').pop();
  const caminho = `logo-${Date.now()}.${extensao}`;
  const { error } = await supabase.storage.from('empresa').upload(caminho, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('empresa').getPublicUrl(caminho);
  return data.publicUrl;
}

// ---------- Equipe ----------
export async function listarEquipe() {
  return supabase.from('equipe_membros').select('*').order('nome', { ascending: true });
}

export async function adicionarMembroEquipe(nome) {
  return supabase.from('equipe_membros').insert({ nome }).select().single();
}

export async function removerMembroEquipe(id) {
  return supabase.from('equipe_membros').delete().eq('id', id);
}

// ---------- Tipos de evento ----------
export async function listarTiposEvento() {
  return supabase.from('tipos_evento').select('*').order('nome', { ascending: true });
}

export async function adicionarTipoEvento(nome) {
  return supabase.from('tipos_evento').insert({ nome }).select().single();
}

export async function removerTipoEvento(id) {
  return supabase.from('tipos_evento').delete().eq('id', id);
}

/** Nomes dos tipos de evento — usado como sugestão no formulário de Eventos. */
export async function nomesTiposEvento() {
  const { data } = await supabase.from('tipos_evento').select('nome').order('nome');
  return (data || []).map(t => t.nome);
}
