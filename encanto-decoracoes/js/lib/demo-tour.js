/* ==========================================================================
   ENCANTO DECORAÇÕES — Tour de boas-vindas da demonstração
   Aparece uma vez por navegador (localStorage) assim que o painel interno
   carrega, e pode ser reaberto a qualquer momento pelo botão "?" no canto
   da tela. Incluído em todas as páginas internas (depois de protegerRota).
   ========================================================================== */

const CHAVE_TOUR = 'encanto_demo_tour_visto';

const PASSOS_TOUR = [
  {
    titulo: 'Bem-vindo(a) ao Encanto Decorações',
    texto: 'Este é o painel interno de uma empresa de decoração de eventos: clientes, agenda, contratos, financeiro e equipe em um só lugar. Tudo aqui roda com dados fictícios, direto no seu navegador.',
  },
  {
    titulo: 'Navegue pelo menu lateral',
    texto: 'Dashboard, Clientes, Eventos, Agenda, Financeiro, Contratos, Acervo e mais. Use o menu à esquerda para explorar cada área.',
  },
  {
    titulo: 'À vontade para editar',
    texto: 'Pode cadastrar clientes, criar eventos, lançar pagamentos e mexer nas configurações sem medo: nada sai do seu navegador, e dá pra restaurar os dados originais a qualquer momento (veja o link no rodapé do menu).',
  },
  {
    titulo: 'Integrações externas',
    texto: 'Recursos que dependem de serviços externos reais (pagamento por Mercado Pago, sincronização com Google Agenda, importação de conversa por IA) mostram um aviso explicando que estão desativados nesta demonstração.',
  },
];

function elementoTour() {
  let el = document.getElementById('demo-tour-root');
  if (!el) {
    el = document.createElement('div');
    el.id = 'demo-tour-root';
    document.body.appendChild(el);
  }
  return el;
}

let passoAtual = 0;

function renderizarPasso() {
  const passo = PASSOS_TOUR[passoAtual];
  const ultimo = passoAtual === PASSOS_TOUR.length - 1;
  const pontos = PASSOS_TOUR.map((_, i) => `<span class="${i === passoAtual ? 'active' : ''}"></span>`).join('');
  elementoTour().innerHTML = `
    <div class="demo-tour-overlay" data-fechar-tour>
      <div class="demo-tour-card">
        <span class="demo-tour-badge">Passo ${passoAtual + 1} de ${PASSOS_TOUR.length}</span>
        <h3>${passo.titulo}</h3>
        <p>${passo.texto}</p>
        <div class="demo-tour-dots">${pontos}</div>
        <div class="demo-tour-footer">
          <button type="button" class="demo-tour-skip" data-pular-tour>Pular tour</button>
          <button type="button" class="btn btn-primary btn-sm" data-avancar-tour>${ultimo ? 'Concluir' : 'Próximo'}</button>
        </div>
      </div>
    </div>`;

  elementoTour().querySelector('[data-fechar-tour]').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) fecharTour();
  });
  elementoTour().querySelector('[data-pular-tour]').addEventListener('click', fecharTour);
  elementoTour().querySelector('[data-avancar-tour]').addEventListener('click', () => {
    if (passoAtual < PASSOS_TOUR.length - 1) { passoAtual++; renderizarPasso(); }
    else fecharTour();
  });
}

export function abrirTour() {
  passoAtual = 0;
  renderizarPasso();
}

function fecharTour() {
  elementoTour().innerHTML = '';
  try { localStorage.setItem(CHAVE_TOUR, '1'); } catch (e) { /* ignora */ }
}

/** Monta o botão flutuante de ajuda e, na primeira visita, abre o tour automaticamente. */
export function iniciarTourDemo() {
  if (!document.getElementById('demo-help-fab')) {
    const fab = document.createElement('button');
    fab.id = 'demo-help-fab';
    fab.className = 'demo-help-fab';
    fab.type = 'button';
    fab.title = 'Ver tour de novo';
    fab.textContent = '?';
    fab.addEventListener('click', abrirTour);
    document.body.appendChild(fab);
  }

  let visto = null;
  try { visto = localStorage.getItem(CHAVE_TOUR); } catch (e) { /* ignora */ }
  if (!visto) abrirTour();
}
