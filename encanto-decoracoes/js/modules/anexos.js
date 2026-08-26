/* ==========================================================================
   ENCANTO DECORAÇÕES — Módulo Anexos
   ========================================================================== */

import { supabase } from '../lib/supabase-client.js';

export async function listarAnexos(eventoId) {
  return supabase
    .from('anexos')
    .select('*')
    .eq('evento_id', eventoId)
    .order('created_at', { ascending: false });
}

/**
 * Sobe o arquivo para o bucket privado "anexos" e registra na tabela.
 * A categoria é inferida pelo tipo do arquivo (imagem = foto, resto = documento).
 */
export async function uploadAnexo(file, eventoId) {
  const categoria = file.type.startsWith('image/') ? 'foto' : 'documento';
  const extensao = file.name.split('.').pop();
  const caminho = `${eventoId}/${Date.now()}-${Math.round(Math.random() * 1e6)}.${extensao}`;

  const { error: erroUpload } = await supabase.storage.from('anexos').upload(caminho, file);
  if (erroUpload) throw erroUpload;

  const { data, error } = await supabase.from('anexos').insert({
    evento_id: eventoId,
    nome_arquivo: file.name,
    categoria,
    caminho,
    tamanho_bytes: file.size,
  }).select().single();

  if (error) throw error;
  return data;
}

export async function excluirAnexo(id, caminho) {
  await supabase.storage.from('anexos').remove([caminho]);
  return supabase.from('anexos').delete().eq('id', id);
}

export async function urlAnexo(caminho) {
  const { data } = await supabase.storage.from('anexos').createSignedUrl(caminho, 3600);
  return data?.signedUrl || null;
}

/**
 * Todos os anexos livres de todos os eventos de um cliente — usado na
 * aba "Arquivos" da página do cliente (Módulo 3), junto com os
 * contratos e comprovantes que já existem em seus respectivos módulos.
 */
export async function anexosDoCliente(clienteId) {
  return supabase
    .from('anexos')
    .select('id, nome_arquivo, categoria, caminho, created_at, eventos!inner(id, data, tipo_evento, cliente_id)')
    .eq('eventos.cliente_id', clienteId)
    .order('created_at', { ascending: false });
}
