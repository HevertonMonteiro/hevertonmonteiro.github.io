/* ==========================================================================
   ENCANTO DECORAÇÕES — Módulo Acervo
   ========================================================================== */

import { supabase } from '../lib/supabase-client.js';

export async function listarItens(categoria = '') {
  let query = supabase.from('acervo_itens').select('*').order('nome', { ascending: true });
  if (categoria) query = query.eq('categoria', categoria);
  return query;
}

export async function buscarItemPorId(id) {
  return supabase.from('acervo_itens').select('*').eq('id', id).single();
}

export async function criarItem(payload) {
  return supabase.from('acervo_itens').insert(payload).select().single();
}

export async function atualizarItem(id, payload) {
  return supabase.from('acervo_itens').update(payload).eq('id', id).select().single();
}

export async function excluirItem(id) {
  return supabase.from('acervo_itens').delete().eq('id', id);
}

/**
 * Sobe uma foto para o bucket público "acervo" e devolve a URL pública
 * (o bucket é público, então não precisa de link assinado/temporário).
 */
export async function uploadFoto(file, itemId) {
  const extensao = file.name.split('.').pop();
  const caminho = `${itemId}/${Date.now()}-${Math.round(Math.random() * 1e6)}.${extensao}`;

  const { error } = await supabase.storage.from('acervo').upload(caminho, file);
  if (error) throw error;

  const { data } = supabase.storage.from('acervo').getPublicUrl(caminho);
  return { caminho, url: data.publicUrl };
}

export async function excluirFoto(caminho) {
  return supabase.storage.from('acervo').remove([caminho]);
}

/**
 * Busca um item do acervo pelo nome exato dentro de uma categoria —
 * usado para trazer os itens inclusos do pacote automaticamente para
 * dentro do contrato gerado (Módulo 9 + 15).
 */
export async function buscarItemPorNome(categoria, nome) {
  if (!nome) return null;
  const { data } = await supabase
    .from('acervo_itens')
    .select('nome, descricao, itens_inclusos')
    .eq('categoria', categoria)
    .eq('nome', nome)
    .maybeSingle();
  return data;
}

/**
 * Nomes de itens do acervo por categoria — usado para popular sugestões
 * de autocompletar nos campos de Tema e Pacote do formulário de Eventos.
 */
export async function nomesPorCategoria(categoria) {
  const { data } = await supabase.from('acervo_itens').select('nome').eq('categoria', categoria).order('nome');
  return (data || []).map(i => i.nome);
}