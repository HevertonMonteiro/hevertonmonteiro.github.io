/* ==========================================================================
   ENCANTO DECORAÇÕES — Proteção de Rotas
   Incluir no <head> (como módulo) de TODA página interna do sistema
   (dashboard, clientes, eventos, agenda, financeiro, etc).

   Uso:
     <script type="module">
       import { protegerRota } from '../js/modules/route-guard.js';
       protegerRota();
     </script>
   ========================================================================== */

import { supabase } from '../lib/supabase-client.js';
import { logout } from './auth.js';
import { sincronizarEventosVencidos } from './eventos.js';
import { iniciarTourDemo } from '../lib/demo-tour.js';

// Segurança de sessão: desconecta automaticamente depois de um período sem
// nenhuma interação, mesmo que a pessoa esqueça de clicar em "Sair" —
// segue a recomendação da OWASP para sistemas com dados financeiros
// (o app é de uso interno/baixo-a-médio risco, então 20 min é um meio
// termo razoável entre segurança e não incomodar o dia a dia da equipe).
const TEMPO_INATIVIDADE_MS = 20 * 60 * 1000;
const TEMPO_AVISO_MS = 1 * 60 * 1000; // avisa 1 minuto antes de desconectar
const CHAVE_ULTIMA_ATIVIDADE = 'encanto_ultima_atividade';

let timerInatividade = null;
let timerAviso = null;

// A última atividade fica em sessionStorage (não só em memória) porque um
// `setTimeout` sozinho não é confiável em celular: o navegador pausa/atrasa
// temporizadores de aba em segundo plano (app minimizado, tela bloqueada),
// então os 20 minutos podem nunca "disparar" enquanto a pessoa está fora do
// app. Guardando o horário, dá pra conferir o tempo REAL decorrido assim
// que a aba volta a ficar visível ou a página é recarregada, em vez de
// confiar cegamente no timer ter sobrevivido.
let ultimaGravacaoMs = 0;

function registrarAtividade() {
  // Throttle: mousemove pode disparar dezenas de vezes por segundo, e
  // escrever em sessionStorage a cada evento seria desperdício — só grava
  // de novo se já fez pelo menos 3s desde a última gravação.
  const agora = Date.now();
  if (agora - ultimaGravacaoMs < 3000) return;
  ultimaGravacaoMs = agora;

  try {
    sessionStorage.setItem(CHAVE_ULTIMA_ATIVIDADE, String(agora));
  } catch {
    // Navegação privada/restrita pode bloquear sessionStorage — nesse caso
    // a checagem por timestamp vira no-op e sobra só o timer em memória.
  }
}

function tempoInativoMs() {
  try {
    const registrado = Number(sessionStorage.getItem(CHAVE_ULTIMA_ATIVIDADE));
    return registrado ? Date.now() - registrado : 0;
  } catch {
    return 0;
  }
}

function removerAvisoInatividade() {
  document.getElementById('aviso-inatividade')?.remove();
}

function mostrarAvisoInatividade() {
  removerAvisoInatividade();
  const aviso = document.createElement('div');
  aviso.id = 'aviso-inatividade';
  aviso.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#241F26;color:#fff;padding:12px 20px;border-radius:10px;font-family:sans-serif;font-size:14px;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,.25)';
  aviso.textContent = 'Por inatividade, sua sessão será encerrada em 1 minuto. Mova o mouse ou clique em algo para continuar conectado.';
  document.body.appendChild(aviso);
}

function reiniciarTemporizadorInatividade() {
  clearTimeout(timerInatividade);
  clearTimeout(timerAviso);
  removerAvisoInatividade();
  registrarAtividade();

  timerAviso = setTimeout(mostrarAvisoInatividade, TEMPO_INATIVIDADE_MS - TEMPO_AVISO_MS);
  timerInatividade = setTimeout(() => logout('inatividade'), TEMPO_INATIVIDADE_MS);
}

/**
 * Confere o tempo real decorrido (via sessionStorage) e desconecta na hora
 * se já passou do limite — chamada ao carregar a página e sempre que a aba
 * volta a ficar visível, justamente para cobrir o caso em que o timer não
 * disparou porque o app estava em segundo plano no celular.
 */
async function conferirInatividadeReal() {
  if (tempoInativoMs() > TEMPO_INATIVIDADE_MS) {
    await logout('inatividade');
    return true;
  }
  return false;
}

function ativarLogoutPorInatividade() {
  ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'].forEach(evento => {
    document.addEventListener(evento, reiniciarTemporizadorInatividade, { passive: true });
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      conferirInatividadeReal().then(desconectou => {
        if (!desconectou) reiniciarTemporizadorInatividade();
      });
    }
  });
  reiniciarTemporizadorInatividade();
}

/**
 * Verifica se existe sessão ativa. Caso não exista, redireciona para o login
 * preservando a URL de origem (para retorno após autenticação).
 */
export async function protegerRota() {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    const destino = encodeURIComponent(window.location.pathname);
    window.location.href = `login.html?redirect=${destino}`;
    return null;
  }

  // Confere o tempo real de inatividade ANTES de liberar a página: cobre o
  // caso de abrir o app depois de muito tempo em segundo plano no celular,
  // quando o temporizador da visita anterior pode não ter chegado a disparar.
  if (await conferirInatividadeReal()) return null;

  // Mantém a proteção reativa: se a sessão expirar/for encerrada em outra
  // aba, esta aba também é redirecionada automaticamente.
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      window.location.href = 'login.html';
    }
  });

  ativarLogoutPorInatividade();
  iniciarTourDemo();

  // Best-effort: nunca deve atrasar nem travar o carregamento da página.
  sincronizarEventosVencidos();

  return data.session;
}