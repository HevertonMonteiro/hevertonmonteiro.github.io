/* ==========================================================================
   ENCANTO DECORAÇÕES — Módulo de Autenticação
   Centraliza toda a lógica de login/logout/recuperação de senha.
   Usado pelas páginas: login.html, recuperar-senha.html, redefinir-senha.html
   e pelo route-guard.js (proteção de rotas).
   ========================================================================== */

import { supabase } from '../lib/supabase-client.js';

/**
 * Autentica o usuário com e-mail e senha.
 * @returns {Promise<{data, error}>}
 */
export async function login(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

/**
 * Encerra a sessão atual e redireciona para o login.
 * @param {string} motivo - 'manual' (usuário clicou em Sair) ou 'inatividade' (timeout automático)
 */
export async function logout(motivo = 'manual') {
  await supabase.auth.signOut();
  const destino = motivo === 'inatividade'
    ? 'login.html?motivo=inatividade'
    : 'login.html';
  window.location.href = destino;
}

/**
 * Envia e-mail de recuperação de senha.
 * O link enviado pelo Supabase redireciona para redefinir-senha.html,
 * onde o usuário define a nova senha.
 */
export async function sendPasswordReset(email) {
  const redirectTo = `${window.location.origin}/pages/redefinir-senha.html`;
  return supabase.auth.resetPasswordForEmail(email, { redirectTo });
}

/**
 * Define uma nova senha (chamado a partir do link de recuperação,
 * quando o Supabase já autenticou uma sessão temporária de reset).
 */
export async function updatePassword(newPassword) {
  return supabase.auth.updateUser({ password: newPassword });
}

/**
 * Retorna a sessão ativa (ou null).
 */
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/**
 * Retorna o usuário autenticado (ou null).
 */
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

/**
 * Traduz mensagens de erro comuns do Supabase Auth para PT-BR,
 * mantendo a interface sempre no idioma do usuário.
 */
export function traduzirErroAuth(error) {
  if (!error) return '';
  const mapa = {
    'Invalid login credentials': 'E-mail ou senha incorretos.',
    'Email not confirmed': 'Confirme seu e-mail antes de entrar.',
    'User already registered': 'Este e-mail já está cadastrado.',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres.',
  };
  return mapa[error.message] || 'Ocorreu um erro. Tente novamente.';
}