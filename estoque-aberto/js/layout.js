/* ==========================================================================
   ESTOQUE ABERTO — topbar, navegação do gestor e tour de boas-vindas.
   ========================================================================== */

const NAV_GESTOR = [
  { slug: 'faltas', label: 'Faltas', href: 'index.html' },
  { slug: 'lojas', label: 'Lojas', href: 'lojas.html' },
  { slug: 'equipe', label: 'Equipe', href: 'equipe.html' },
  { slug: 'assinatura', label: 'Assinatura', href: 'assinatura.html' },
];

/* window.location.href não interrompe a execução do script atual (a
   navegação só acontece de fato depois), então sem o "throw" o resto da
   página continuaria rodando com uma sessão inválida/nula por um instante.
   O "throw" pára a execução ali mesmo, o redirect já foi disparado. */
function exigirSessaoEA(papelEsperado, base) {
  const sessao = getSessaoEA();
  if (!sessao || sessao.papel !== papelEsperado) {
    window.location.href = base + (papelEsperado === 'loja' ? 'loja/entrar.html' : 'login.html');
    throw new Error('Sessão inválida para esta página.');
  }
  return sessao;
}

function montarTopbarEA({ papel, base, empresaNome, ativa }) {
  const mount = document.getElementById('topbar-mount');
  if (!mount) return;
  const roleLabel = { admin: 'Admin', gestor: 'Gestor', loja: 'Loja' }[papel];
  mount.innerHTML = `
    <div class="topbar">
      <div class="brand">
        <img src="${base}assets/icon-64.png" alt="" width="28" height="28">
        <b>Estoque Aberto</b>
        <span class="role-label">${roleLabel}</span>
        ${empresaNome ? `<span class="empresa-nome">${escapeHtmlEA(empresaNome)}</span>` : ''}
      </div>
      ${papel === 'gestor' ? `<nav>${NAV_GESTOR.map((n) => `<a href="${n.href}" class="${n.slug === ativa ? 'active' : ''}">${n.label}</a>`).join('')}</nav>` : ''}
      <button type="button" class="btn-link" onclick="sairEA('${base}')">Sair</button>
    </div>`;
}
function sairEA(base) {
  limparSessaoEA();
  window.location.href = base + 'index.html';
}

/* Faixa de aviso de trial/bloqueio, igual para gestor e loja (texto varia). */
function faixaAvisoEA(empresa, papel) {
  const dias = diasRestantes(empresa.trialTerminaEm);
  if (empresa.status === 'trial' && dias > 0) {
    return `<div class="warn-box">Período grátis: restam ${dias} dia(s)${papel === 'gestor' ? ' para assinar um plano' : ''}.</div>`;
  }
  if (empresa.status !== 'ativa') {
    const msg = papel === 'gestor'
      ? 'Período grátis encerrado. As lojas não conseguem lançar novas faltas até a assinatura ser confirmada. O histórico continua disponível abaixo.'
      : 'Período grátis encerrado. Peça ao gestor para regularizar o pagamento para voltar a lançar faltas.';
    return `<div class="error-box">${msg}</div>`;
  }
  return '';
}

/* ---------- Tour de boas-vindas (por área) ---------- */
const TOUR_STEPS_EA = {
  admin: [
    { title: 'Painel do Admin', text: 'Aqui você vê todas as empresas clientes da plataforma: status da assinatura, quantas lojas e gestores cada uma tem, e pode liberar acesso manualmente.' },
  ],
  gestor: [
    { title: 'Painel do Gestor', text: 'Acompanhe em tempo real o que está faltando em cada loja: falta comum, urgência (zerado) e encomendas de clientes, com filtro por loja e laboratório.' },
    { title: 'Lojas e equipe', text: 'Na aba Lojas você cadastra cada unidade e recebe um código de acesso para o balconista. Na aba Equipe você convida outros gestores por e-mail.' },
  ],
  loja: [
    { title: 'Tela do balconista', text: 'Registre rapidamente o que está prestes a faltar, o que já zerou, ou o que um cliente encomendou. O gestor acompanha tudo em tempo real.' },
  ],
};
let _tourAreaEA = 'gestor';
let _tourStepIdxEA = 0;
function maybeShowTourEA(area) {
  _tourAreaEA = area;
  let seen = null;
  try { seen = localStorage.getItem('ea_tour_' + area); } catch (e) {}
  if (!seen) openTourEA(area);
}
function openTourEA(area) {
  _tourAreaEA = area;
  _tourStepIdxEA = 0;
  renderTourStepEA();
}
function renderTourStepEA() {
  const steps = TOUR_STEPS_EA[_tourAreaEA] || [];
  const step = steps[_tourStepIdxEA];
  if (!step) return;
  const isLast = _tourStepIdxEA === steps.length - 1;
  const dots = steps.map((_, i) => `<span class="${i === _tourStepIdxEA ? 'active' : ''}"></span>`).join('');
  let root = document.getElementById('tourRoot');
  if (!root) { root = document.createElement('div'); root.id = 'tourRoot'; document.body.appendChild(root); }
  root.innerHTML = `
    <div class="tour-overlay" onclick="if(event.target===this) closeTourEA()">
      <div class="tour-card">
        <span class="tour-badge">Passo ${_tourStepIdxEA + 1} de ${steps.length}</span>
        <h3>${escapeHtmlEA(step.title)}</h3>
        <p>${escapeHtmlEA(step.text)}</p>
        <div class="tour-dots">${dots}</div>
        <div class="tour-footer">
          <button class="tour-skip" onclick="closeTourEA()">Pular tour</button>
          <button class="btn btn-primary" onclick="advanceTourEA()">${isLast ? 'Concluir' : 'Próximo'}</button>
        </div>
      </div>
    </div>`;
  let fab = document.getElementById('helpFab');
  if (!fab) {
    fab = document.createElement('button');
    fab.id = 'helpFab'; fab.className = 'help-fab'; fab.title = 'Ver tour de novo'; fab.textContent = '?';
    fab.onclick = () => openTourEA(_tourAreaEA);
    document.body.appendChild(fab);
  }
}
function advanceTourEA() {
  const steps = TOUR_STEPS_EA[_tourAreaEA] || [];
  if (_tourStepIdxEA < steps.length - 1) { _tourStepIdxEA++; renderTourStepEA(); }
  else closeTourEA();
}
function closeTourEA() {
  const root = document.getElementById('tourRoot');
  if (root) root.innerHTML = '';
  try { localStorage.setItem('ea_tour_' + _tourAreaEA, '1'); } catch (e) {}
}
