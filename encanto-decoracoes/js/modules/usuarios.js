/* ==========================================================================
   ENCANTO DECORAÇÕES — Módulo Usuários
   Completa o cadastro de cada pessoa que loga no sistema (o Supabase Auth
   só guarda e-mail/senha). Um perfil em branco é criado automaticamente
   pelo banco quando um novo usuário é cadastrado — aqui só editamos.
   ========================================================================== */

import { supabase } from '../lib/supabase-client.js';
import { getCurrentUser } from './auth.js';

export async function listarPerfis() {
  return supabase.from('perfis_usuario').select('*').order('nome_completo', { ascending: true, nullsFirst: false });
}

export async function buscarMeuPerfil() {
  const usuario = await getCurrentUser();
  if (!usuario) return { data: null, error: 'Sem sessão' };
  return supabase.from('perfis_usuario').select('*').eq('id', usuario.id).single();
}

export async function atualizarPerfil(id, payload) {
  return supabase.from('perfis_usuario').update(payload).eq('id', id).select().single();
}

/** Nome de exibição: usa o nome completo se já foi preenchido, senão o e-mail. */
export function nomeDeExibicao(perfil) {
  return perfil?.nome_completo || perfil?.email || 'Usuário';
}
