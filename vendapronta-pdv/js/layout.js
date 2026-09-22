/* ==========================================================================
   VENDAPRONTA PDV — topbar, abas do gestor e tour de boas-vindas,
   compartilhados entre as telas do Dono e do Gestor.
   ========================================================================== */

const ABAS_GESTOR = [
  { slug: 'catalogo', label: 'Catálogo', href: 'catalogo.html' },
  { slug: 'promocoes', label: 'Promoções', href: 'promocoes.html' },
  { slug: 'destaques', label: 'Destaques', href: 'destaques.html' },
  { slug: 'distribuidoras', label: 'Distribuidoras', href: 'distribuidoras.html' },
  { slug: 'observacoes', label: 'Observações', href: 'observacoes.html' },
  { slug: 'config', label: 'Configurações', href: 'config.html' },
];

/* Se a empresa do gestor está bloqueada, pendente ou com pagamento pendente,
   substitui a página inteira por um aviso e interrompe a execução do resto
   do script daquela tela (chamada logo no topo de cada página do gestor). */
function bloqueioGestor(empresa) {
  let motivo = null;
  if (empresa.acesso === 'pendente') motivo = 'Seu cadastro ainda está aguardando aprovação da plataforma.';
  else if (empresa.acesso === 'bloqueado') motivo = 'O acesso desta empresa foi bloqueado pela plataforma. Fale com o suporte para regularizar.';
  else if (empresa.pagamento === 'pendente') motivo = 'Existe um pagamento pendente para esta empresa. Regularize para voltar a usar o painel.';
  if (!motivo) return;
  document.body.innerHTML = `
    <div id="topbar-mount"></div>
    <div class="page narrow" style="padding-top:60px;">
      <div class="card" style="text-align:center;">
        <h2 style="margin-top:0;font-size:17px;color:var(--teal-900);">Acesso indisponível no momento</h2>
        <p style="color:var(--slate-600);font-size:14px;">${motivo}</p>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:10px;">
          <span class="pill ${empresa.acesso === 'ativo' ? 'pill-green' : empresa.acesso === 'pendente' ? 'pill-amber' : 'pill-red'}">${empresa.acesso === 'ativo' ? 'Ativo' : empresa.acesso === 'pendente' ? 'Pendente' : 'Bloqueado'}</span>
          <span class="pill ${empresa.pagamento === 'em_dia' ? 'pill-green' : 'pill-amber'}">${empresa.pagamento === 'em_dia' ? 'Pagamento em dia' : 'Pagamento pendente'}</span>
        </div>
      </div>
    </div>`;
  montarTopbar({ papel: 'gestor', base: '../', empresaNome: empresa.nome });
  throw new Error('Acesso do gestor bloqueado nesta empresa.');
}

function exigirSessao(papelEsperado, base) {
  const sessao = getSessao();
  if (!sessao || sessao.papel !== papelEsperado) {
    window.location.href = base + 'index.html';
    return null;
  }
  return sessao;
}

function montarTopbar({ papel, base, empresaNome }) {
  const mount = document.getElementById('topbar-mount');
  if (!mount) return;
  mount.innerHTML = `
    <div class="topbar">
      <div class="brand">
        <img src="${base}assets/icon-64.png" alt="" width="30" height="30">
        <b>VENDAPRONTA PDV</b>
        <span class="role-badge">${papel === 'dono' ? 'Dono' : 'Gestor'}</span>
        ${empresaNome ? `<span class="empresa-nome">${escapeHtml(empresaNome)}</span>` : ''}
      </div>
      <button type="button" class="btn-link" onclick="sair('${base}')">Sair</button>
    </div>`;
}
function sair(base) {
  limparSessao();
  window.location.href = base + 'index.html';
}

function montarAbasGestor(ativa, base) {
  const mount = document.getElementById('tabs-mount');
  if (!mount) return;
  mount.innerHTML = `
    <div class="tabs">
      ${ABAS_GESTOR.map((a) => `<a href="${a.href}" class="${a.slug === ativa ? 'active' : ''}">${a.label}</a>`).join('')}
    </div>`;
}

/* ---------- Tour de boas-vindas (por área: dono ou gestor) ---------- */
const TOUR_STEPS_BY_AREA = {
  dono: [
    { title: 'Painel do Dono', text: 'Aqui você vê todas as empresas clientes da plataforma, aprova cadastros novos e controla pagamento e funcionalidades liberadas para cada uma.' },
    { title: 'Aprovar e bloquear', text: 'Empresas pendentes aparecem em vermelho. Clique em "Entrar" numa empresa para aprovar o acesso, marcar o pagamento e ligar/desligar funcionalidades específicas dela.' },
  ],
  gestor: [
    { title: 'Painel do Gestor', text: 'Aqui você cadastra o catálogo, as distribuidoras, promoções e destaques que a equipe de vendas vê no aplicativo, e acompanha os preços que a concorrência está praticando.' },
    { title: 'Catálogo', text: 'Importe a planilha de preços mais recente sempre que o fornecedor enviar uma nova. Os vendedores só veem os produtos depois que você importa.' },
    { title: 'Código de acesso da equipe', text: 'Na aba Configurações fica o código de 6 dígitos que cada vendedor usa para entrar no aplicativo pelo celular, sem precisar de senha.' },
  ],
};
let _tourArea = 'gestor';
let _tourStepIdx = 0;
function maybeShowTour(area) {
  _tourArea = area;
  let seen = null;
  try { seen = localStorage.getItem('vp_tour_' + area); } catch (e) {}
  if (!seen) openTour(area);
}
function openTour(area) {
  _tourArea = area;
  _tourStepIdx = 0;
  renderTourStep();
}
function renderTourStep() {
  const steps = TOUR_STEPS_BY_AREA[_tourArea] || [];
  const step = steps[_tourStepIdx];
  if (!step) return;
  const isLast = _tourStepIdx === steps.length - 1;
  const dots = steps.map((_, i) => `<span class="${i === _tourStepIdx ? 'active' : ''}"></span>`).join('');
  let root = document.getElementById('tourRoot');
  if (!root) {
    root = document.createElement('div');
    root.id = 'tourRoot';
    document.body.appendChild(root);
  }
  root.innerHTML = `
    <div class="tour-overlay" onclick="if(event.target===this) closeTour()">
      <div class="tour-card">
        <span class="tour-badge">Passo ${_tourStepIdx + 1} de ${steps.length}</span>
        <h3>${escapeHtml(step.title)}</h3>
        <p>${escapeHtml(step.text)}</p>
        <div class="tour-dots">${dots}</div>
        <div class="tour-footer">
          <button class="tour-skip" onclick="closeTour()">Pular tour</button>
          <button class="btn btn-primary" onclick="advanceTour()">${isLast ? 'Concluir' : 'Próximo'}</button>
        </div>
      </div>
    </div>`;
  let fab = document.getElementById('helpFab');
  if (!fab) {
    fab = document.createElement('button');
    fab.id = 'helpFab';
    fab.className = 'help-fab';
    fab.title = 'Ver tour de novo';
    fab.textContent = '?';
    fab.onclick = () => openTour(_tourArea);
    document.body.appendChild(fab);
  }
}
function advanceTour() {
  const steps = TOUR_STEPS_BY_AREA[_tourArea] || [];
  if (_tourStepIdx < steps.length - 1) { _tourStepIdx++; renderTourStep(); }
  else closeTour();
}
function closeTour() {
  const root = document.getElementById('tourRoot');
  if (root) root.innerHTML = '';
  try { localStorage.setItem('vp_tour_' + _tourArea, '1'); } catch (e) {}
}
