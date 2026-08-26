/* ==========================================================================
   CORRETORA DE MILHÕES — Sessão do painel (demo de portfólio)
   Nesta demonstração não existe usuário/senha real: qualquer e-mail e
   senha preenchidos abrem o painel. A sessão fica em sessionStorage,
   então some sozinha quando a aba/navegador é fechado.
   ========================================================================== */

const SESSION_KEY = 'cm_demo_sessao';

function login(email, senha) {
  if (!email || !senha) return false;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email, entrou_em: new Date().toISOString() }));
  } catch (e) { /* ignora */ }
  return true;
}
function logout() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* ignora */ }
}
function sessaoAtual() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch (e) { return null; }
}
/** Chamar no topo de toda página do painel (exceto login): redireciona se não houver sessão. */
function exigirLogin(caminhoLogin) {
  if (!sessaoAtual()) {
    window.location.href = caminhoLogin;
    return false;
  }
  return true;
}
