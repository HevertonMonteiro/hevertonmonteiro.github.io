/* ==========================================================================
   CORRETORA DE MILHÕES — Layout compartilhado (navbar, rodapé, botões
   flutuantes, menu mobile, animações de rolagem) + tour de boas-vindas
   da demonstração. Requer js/store.js carregado antes deste arquivo.
   ========================================================================== */

const ICONE_INSTAGRAM = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.25.07 1.62.07 4.81s-.01 3.56-.07 4.81c-.15 3.23-1.66 4.77-4.92 4.92-1.25.06-1.62.07-4.85.07s-3.6 0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.25-.07-1.62-.07-4.81s.01-3.56.07-4.81c.15-3.23 1.66-4.77 4.92-4.92C8.4 2.2 8.8 2.2 12 2.2zm0 3.15a6.65 6.65 0 100 13.3 6.65 6.65 0 000-13.3zm0 10.97a4.32 4.32 0 110-8.64 4.32 4.32 0 010 8.64zm6.9-11.24a1.55 1.55 0 11-3.1 0 1.55 1.55 0 013.1 0z"/></svg>';
const ICONE_FACEBOOK = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z"/></svg>';
const ICONE_WHATSAPP = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.33 5L2 22l5.2-1.36a9.94 9.94 0 004.84 1.23h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2zm5.84 14.24c-.25.7-1.24 1.29-2.02 1.45-.54.11-1.24.2-3.6-.77-3.02-1.25-4.96-4.32-5.11-4.52-.15-.2-1.22-1.62-1.22-3.09 0-1.47.77-2.19 1.05-2.49.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.68.53.25.6.86 2.08.94 2.23.08.15.13.33.03.53-.1.2-.15.33-.3.5-.15.18-.31.4-.45.54-.15.15-.3.31-.13.6.17.3.76 1.26 1.64 2.04 1.13 1 2.08 1.32 2.38 1.47.3.15.47.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.68-.15.28.1 1.77.83 2.07.98.3.15.5.23.57.35.08.13.08.72-.17 1.42z"/></svg>';

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function montarLayout({ painel = false, base = '', ativo = '' } = {}) {
  const perfil = getPerfil();
  montarNavbar(painel, base, ativo, perfil);
  montarFooter(base, perfil);
  montarSocialFloat(perfil);
  ativarMenuMobile();
  ativarReveal();
  ativarContadores();
  if (painel) ativarLogout(base);
  iniciarTourDemo(painel);
}

function montarNavbar(painel, base, ativo, perfil) {
  const mount = document.getElementById('navbar-mount');
  if (!mount) return;
  const nome = escapeHtml(perfil.nome ? `${perfil.nome} · Corretora de Milhões` : 'Corretora de Milhões');

  if (painel) {
    mount.innerHTML = `
      <header class="navbar navbar-painel container">
        <a href="dashboard.html" class="logo">${nome} <span class="navbar-tag">painel</span></a>
        <button class="nav-toggle" type="button" aria-label="Abrir menu" aria-expanded="false"><span></span></button>
        <nav>
          <a href="dashboard.html">Dashboard</a>
          <a href="imoveis.html">Imóveis</a>
          <a href="realizacao-nova.html">Negócio fechado</a>
          <a href="depoimentos.html">Depoimentos</a>
          <a href="leads.html">Leads</a>
          <a href="${base}index.html" target="_blank" rel="noopener" class="navbar-external">Ver site público ↗</a>
          <a href="#" id="btn-logout">Sair</a>
        </nav>
      </header>`;
  } else {
    const link = (href, id, label) => `<a href="${href}"${ativo === id ? ' style="color:var(--cor-rose-escuro)"' : ''}>${label}</a>`;
    mount.innerHTML = `
      <header class="navbar container">
        <a href="index.html" class="logo">${nome}</a>
        <button class="nav-toggle" type="button" aria-label="Abrir menu" aria-expanded="false"><span></span></button>
        <nav>
          ${link('imoveis.html', 'imoveis', 'Imóveis')}
          ${link('index.html#sobre', 'sobre', 'Sobre')}
          ${link('index.html#realizacoes', 'realizacoes', 'Realizações')}
          ${link('depoimento-novo.html', 'depoimento', 'Deixe seu depoimento')}
          ${link('contato.html', 'contato', 'Contato')}
        </nav>
      </header>`;
  }
}

function montarFooter(base, perfil) {
  const mount = document.getElementById('footer-mount');
  if (!mount) return;
  mount.innerHTML = `
    <footer>
      <div class="container">
        <p><strong>${escapeHtml(perfil.nome || 'Corretora de Milhões')}</strong>${perfil.creci ? ` · ${escapeHtml(perfil.creci)}` : ''}</p>
        ${perfil.regiao_atuacao ? `<p>Atuação: ${escapeHtml(perfil.regiao_atuacao)}</p>` : ''}
        <p class="social">
          ${perfil.instagram_url ? `<a href="${escapeHtml(perfil.instagram_url)}" target="_blank" rel="noopener">${ICONE_INSTAGRAM} Instagram</a>` : ''}
          ${perfil.facebook_url ? `<a href="${escapeHtml(perfil.facebook_url)}" target="_blank" rel="noopener">${ICONE_FACEBOOK} Facebook</a>` : ''}
          ${perfil.whatsapp ? `<a href="https://wa.me/${perfil.whatsapp}" target="_blank" rel="noopener">${ICONE_WHATSAPP} WhatsApp</a>` : ''}
        </p>
      </div>
    </footer>`;
}

function montarSocialFloat(perfil) {
  const mount = document.getElementById('social-float-mount');
  if (!mount || (!perfil.whatsapp && !perfil.facebook_url)) return;
  mount.innerHTML = `
    <div class="social-float">
      ${perfil.facebook_url ? `<a class="facebook-float" href="${escapeHtml(perfil.facebook_url)}" target="_blank" rel="noopener" aria-label="Facebook">${ICONE_FACEBOOK}</a>` : ''}
      ${perfil.whatsapp ? `<a class="whatsapp-float" href="https://wa.me/${perfil.whatsapp}" target="_blank" rel="noopener" aria-label="Falar no WhatsApp">${ICONE_WHATSAPP}<span>Falar no WhatsApp</span></a>` : ''}
    </div>`;
}

function ativarMenuMobile() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.navbar nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const aberto = nav.classList.toggle('aberto');
    toggle.setAttribute('aria-expanded', aberto ? 'true' : 'false');
  });
}

function ativarReveal() {
  const revelaveis = document.querySelectorAll('.reveal');
  if (!revelaveis.length) return;
  if (!('IntersectionObserver' in window)) {
    revelaveis.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('is-visible');
        observer.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });
  revelaveis.forEach((el) => observer.observe(el));
}

function ativarContadores() {
  const contadores = document.querySelectorAll('[data-contador]');
  if (!contadores.length || !('IntersectionObserver' in window)) return;
  const animar = (el) => {
    const alvo = parseInt(el.getAttribute('data-contador'), 10) || 0;
    const duracao = 1200;
    let inicio = null;
    const passo = (timestamp) => {
      if (!inicio) inicio = timestamp;
      const progresso = Math.min((timestamp - inicio) / duracao, 1);
      el.textContent = Math.floor(progresso * alvo);
      if (progresso < 1) requestAnimationFrame(passo);
      else el.textContent = alvo;
    };
    requestAnimationFrame(passo);
  };
  const observer = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) { animar(entrada.target); observer.unobserve(entrada.target); }
    });
  }, { threshold: 0.4 });
  contadores.forEach((el) => observer.observe(el));
}

function ativarLogout(base) {
  document.getElementById('btn-logout')?.addEventListener('click', (e) => {
    e.preventDefault();
    logout();
    window.location.href = 'login.html';
  });
}

/* ==========================================================================
   Tour de boas-vindas da demonstração
   ========================================================================== */
const CHAVE_TOUR_PUBLICO = 'cm_demo_tour_publico_visto';
const CHAVE_TOUR_PAINEL = 'cm_demo_tour_painel_visto';

const PASSOS_TOUR_PUBLICO = [
  { titulo: 'Bem-vindo(a) à Corretora de Milhões', texto: 'Este é o site público de uma corretora de imóveis: vitrine com busca e filtros, ficha de cada imóvel, depoimentos e contato direto pelo WhatsApp. Tudo aqui roda com dados fictícios, no seu navegador.' },
  { titulo: 'Explore a vitrine', texto: 'Em "Imóveis" você pode filtrar por tipo de negócio, tipo de imóvel, cidade, bairro, quartos e faixa de valor.' },
  { titulo: 'Painel da corretora', texto: 'Quer ver o lado de quem administra o site? Acesse /painel/login.html. Nesta demo, qualquer e-mail e senha entram no painel.' },
];
const PASSOS_TOUR_PAINEL = [
  { titulo: 'Painel da corretora', texto: 'Aqui a corretora cadastra e edita imóveis, publica negócios fechados, modera depoimentos e acompanha os contatos recebidos.' },
  { titulo: 'À vontade para editar', texto: 'Pode criar, editar e excluir imóveis, aprovar depoimentos e tudo mais sem medo: nada sai do seu navegador, e dá pra restaurar os dados originais a qualquer momento (link no menu).' },
];

function elementoTour() {
  let el = document.getElementById('demo-tour-root');
  if (!el) { el = document.createElement('div'); el.id = 'demo-tour-root'; document.body.appendChild(el); }
  return el;
}
let _passos = [];
let _passoAtual = 0;
let _chaveTourAtual = '';

function renderizarPassoTour() {
  const passo = _passos[_passoAtual];
  const ultimo = _passoAtual === _passos.length - 1;
  const pontos = _passos.map((_, i) => `<span class="${i === _passoAtual ? 'active' : ''}"></span>`).join('');
  elementoTour().innerHTML = `
    <div class="demo-tour-overlay" data-fechar-tour>
      <div class="demo-tour-card">
        <span class="demo-tour-badge">Passo ${_passoAtual + 1} de ${_passos.length}</span>
        <h3>${escapeHtml(passo.titulo)}</h3>
        <p>${escapeHtml(passo.texto)}</p>
        <div class="demo-tour-dots">${pontos}</div>
        <div class="demo-tour-footer">
          <button type="button" class="demo-tour-skip" data-pular-tour>Pular tour</button>
          <button type="button" class="btn btn-primary btn-sm" data-avancar-tour>${ultimo ? 'Concluir' : 'Próximo'}</button>
        </div>
      </div>
    </div>`;
  elementoTour().querySelector('[data-fechar-tour]').addEventListener('click', (e) => { if (e.target === e.currentTarget) fecharTour(); });
  elementoTour().querySelector('[data-pular-tour]').addEventListener('click', fecharTour);
  elementoTour().querySelector('[data-avancar-tour]').addEventListener('click', () => {
    if (_passoAtual < _passos.length - 1) { _passoAtual++; renderizarPassoTour(); }
    else fecharTour();
  });
}
function fecharTour() {
  elementoTour().innerHTML = '';
  try { localStorage.setItem(_chaveTourAtual, '1'); } catch (e) { /* ignora */ }
}
function abrirTour(painel) {
  _passos = painel ? PASSOS_TOUR_PAINEL : PASSOS_TOUR_PUBLICO;
  _chaveTourAtual = painel ? CHAVE_TOUR_PAINEL : CHAVE_TOUR_PUBLICO;
  _passoAtual = 0;
  renderizarPassoTour();
}
function iniciarTourDemo(painel) {
  if (!document.getElementById('demo-help-fab')) {
    const fab = document.createElement('button');
    fab.id = 'demo-help-fab';
    fab.className = 'demo-help-fab';
    fab.type = 'button';
    fab.title = 'Ver tour de novo';
    fab.textContent = '?';
    fab.addEventListener('click', () => abrirTour(painel));
    document.body.appendChild(fab);
  }
  const chave = painel ? CHAVE_TOUR_PAINEL : CHAVE_TOUR_PUBLICO;
  let visto = null;
  try { visto = localStorage.getItem(chave); } catch (e) { /* ignora */ }
  if (!visto) abrirTour(painel);
}
