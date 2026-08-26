/* ==========================================================================
   ENCANTO DECORAÇÕES — Componente: Topbar
   Inclui a Pesquisa Global (Módulo 13): busca por cliente, WhatsApp, tema,
   pacote, evento, endereço, data e equipe, com resultados agrupados.

   Uso:
     import { renderTopbar } from '../components/topbar.js';
     renderTopbar('Dashboard');
   ========================================================================== */

import { getCurrentUser } from '../js/modules/auth.js';
import { buscarGlobal } from '../js/modules/busca-global.js';
import { alternarSidebar } from './sidebar.js';
import { escapeHtml } from '../js/lib/sanitize.js';

export async function renderTopbar(titulo = '', mountSelector = '#topbar-mount') {
  const mount = document.querySelector(mountSelector);
  if (!mount) return;

  const user = await getCurrentUser();
  const email = user?.email || '';
  const inicial = email.charAt(0).toUpperCase() || '?';

  mount.innerHTML = `
    <header class="topbar">
      <button class="topbar-menu-btn" id="btn-abrir-sidebar" aria-label="Abrir menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      <div class="topbar-search">
        <div class="input-group autocomplete">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input class="input" type="search" id="busca-global-input" placeholder="Pesquisar cliente, evento, WhatsApp, tema..." aria-label="Pesquisa global" autocomplete="off">
          <div class="autocomplete-results" id="busca-global-results"></div>
        </div>
      </div>
      <div class="topbar-user">
        <span>${escapeHtml(email)}</span>
        <div class="topbar-user-avatar">${escapeHtml(inicial)}</div>
      </div>
    </header>
  `;

  document.getElementById('btn-abrir-sidebar').addEventListener('click', alternarSidebar);

  ativarBuscaGlobal();
}

const LABEL_STATUS = {
  orcamento: 'Orçamento', confirmado: 'Confirmado',
  concluido: 'Concluído', finalizado: 'Finalizado', cancelado: 'Cancelado',
};

function ativarBuscaGlobal() {
  const input = document.getElementById('busca-global-input');
  const resultsBox = document.getElementById('busca-global-results');
  let debounceTimer;

  function fechar() { resultsBox.classList.remove('is-open'); }

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const termo = input.value.trim();
    if (!termo) { fechar(); return; }

    debounceTimer = setTimeout(async () => {
      const { clientes, eventos } = await buscarGlobal(termo);

      if (!clientes.length && !eventos.length) {
        resultsBox.innerHTML = `<div class="autocomplete-empty">Nenhum resultado para "${termo}".</div>`;
        resultsBox.classList.add('is-open');
        return;
      }

      let html = '';

      if (clientes.length) {
        html += `<div class="sidebar-group-label" style="color:var(--color-text-faint); padding: var(--sp-2) var(--sp-3)">Clientes</div>`;
        html += clientes.map(c => `
          <div class="autocomplete-item" data-href="cliente-detalhe.html?id=${c.id}">
            <strong>${escapeHtml(c.nome)}</strong>
            <div style="font-size:11px; color:var(--color-text-muted)">${escapeHtml(c.whatsapp || '')}</div>
          </div>
        `).join('');
      }

      if (eventos.length) {
        html += `<div class="sidebar-group-label" style="color:var(--color-text-faint); padding: var(--sp-2) var(--sp-3)">Eventos</div>`;
        html += eventos.map(ev => {
          const data = ev.data ? new Date(ev.data + 'T00:00:00').toLocaleDateString('pt-BR') : '';
          return `
            <div class="autocomplete-item" data-href="evento-detalhe.html?id=${ev.id}">
              <strong>${escapeHtml(ev.clientes?.nome || 'Cliente')} · ${escapeHtml(ev.tipo_evento || ev.tema || 'Evento')}</strong>
              <div style="font-size:11px; color:var(--color-text-muted)">${data}${ev.tema ? ' · ' + escapeHtml(ev.tema) : ''} · ${LABEL_STATUS[ev.status] || ev.status}</div>
            </div>
          `;
        }).join('');
      }

      resultsBox.innerHTML = html;
      resultsBox.classList.add('is-open');
    }, 300);
  });

  resultsBox.addEventListener('click', (e) => {
    const item = e.target.closest('.autocomplete-item');
    if (!item) return;
    window.location.href = item.dataset.href;
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.topbar-search')) fechar();
  });
  input.addEventListener('keydown', (e) => { if (e.key === 'Escape') fechar(); });
}