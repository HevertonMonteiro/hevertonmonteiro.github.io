/* ==========================================================================
   ENCANTO DECORAÇÕES — Componente: Sidebar
   Reutilizado em toda página interna. Mantém os módulos ainda não
   construídos visíveis (com selo "em breve"), para o cliente acompanhar
   o roadmap sem links quebrados.

   Uso:
     import { renderSidebar } from '../components/sidebar.js';
     renderSidebar('dashboard'); // id da página ativa
   ========================================================================== */

import { escapeHtml } from '../js/lib/sanitize.js';

const ICONES = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
  clientes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5"/><circle cx="17.5" cy="8.5" r="2.8"/><path d="M15.5 13.5c2.9.3 5 2.9 5 6.5"/></svg>',
  eventos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9.5h18M8 3v3M16 3v3"/></svg>',
  importar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',
  agenda: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M3 9.5h18M8 3v3M16 3v3M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01"/></svg>',
  producao: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></svg>',
  financeiro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M15 9.5c0-1.4-1.3-2.5-3-2.5s-3 1-3 2.3c0 3 6 1.4 6 4.4 0 1.4-1.3 2.3-3 2.3s-3-1-3-2.4"/></svg>',
  contratos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 3h8l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M15 3v4h4M9 13h6M9 17h6M9 9h2"/></svg>',
  acervo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="m3 15 4.5-4.5a2 2 0 0 1 2.8 0L15 15m-1-2 1.6-1.6a2 2 0 0 1 2.8 0L21 14"/><circle cx="8" cy="8.5" r="1.4"/></svg>',
  relatorios: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20V10M12 20V4M20 20v-7"/></svg>',
  configuracoes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 13.5a7.9 7.9 0 0 0 0-3l2-1.6-2-3.4-2.4 1a8 8 0 0 0-2.6-1.5L14 2h-4l-.4 2.5a8 8 0 0 0-2.6 1.5l-2.4-1-2 3.4 2 1.6a7.9 7.9 0 0 0 0 3l-2 1.6 2 3.4 2.4-1a8 8 0 0 0 2.6 1.5L10 22h4l.4-2.5a8 8 0 0 0 2.6-1.5l2.4 1 2-3.4-2-1.6Z"/></svg>',
  usuarios: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>',
  auditoria: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>',
  pagamentos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20M6 15h4"/></svg>',
  funcionarios: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="8" r="3.2"/><circle cx="16.5" cy="9" r="2.6"/><path d="M2.5 20c0-3.4 2.6-6 5.5-6s5.5 2.6 5.5 6M14 20c0-2.6 1.8-4.7 4-4.7s4 2.1 4 4.7"/></svg>',
  sair: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
};

const ITENS = [
  { grupo: 'Visão geral', links: [
    { id: 'dashboard', label: 'Dashboard', href: 'dashboard.html', pronto: true },
  ]},
  { grupo: 'Operação', links: [
    { id: 'clientes', label: 'Clientes', href: 'clientes.html', pronto: true },
    { id: 'eventos', label: 'Eventos', href: 'eventos.html', pronto: true },
    { id: 'importar', label: 'Importar conversa', href: 'importar.html', pronto: true },
    { id: 'agenda', label: 'Agenda', href: 'agenda.html', pronto: true },
    { id: 'producao', label: 'Roteiro do dia', href: 'producao.html', pronto: true },
  ]},
  { grupo: 'Financeiro', links: [
    { id: 'pagamentos', label: 'Pagamentos', href: 'pagamentos.html', pronto: true },
    { id: 'financeiro', label: 'Simulador de Cartão', href: 'simulador-cartao.html', pronto: true },
    { id: 'contratos', label: 'Contratos', href: 'contratos.html', pronto: true },
  ]},
  { grupo: 'Recursos', links: [
    { id: 'acervo', label: 'Acervo', href: 'acervo.html', pronto: true },
    { id: 'relatorios', label: 'Relatórios', href: 'relatorios.html', pronto: true },
  ]},
  { grupo: 'Sistema', links: [
    { id: 'funcionarios', label: 'Funcionários', href: 'funcionarios.html', pronto: true },
    { id: 'usuarios', label: 'Usuários', href: 'usuarios.html', pronto: true },
    { id: 'auditoria', label: 'Centro de Auditoria', href: 'auditoria.html', pronto: true },
    { id: 'configuracoes', label: 'Configurações', href: 'configuracoes.html', pronto: true },
  ]},
];

export async function renderSidebar(activeId, mountSelector = '#sidebar-mount') {
  const mount = document.querySelector(mountSelector);
  if (!mount) return;

  const grupos = ITENS.map(grupo => {
    const links = grupo.links.map(link => {
      const classes = ['sidebar-link'];
      if (link.id === activeId) classes.push('is-active');
      if (!link.pronto) classes.push('is-disabled');
      return `
        <a class="${classes.join(' ')}" href="${link.pronto ? link.href : '#'}" ${!link.pronto ? 'aria-disabled="true" title="Módulo em desenvolvimento"' : ''}>
          <span class="icon">${ICONES[link.id] || ''}</span>
          <span>${link.label}</span>
          ${!link.pronto ? '<span class="soon">em breve</span>' : ''}
        </a>`;
    }).join('');
    return `<div class="sidebar-group-label">${grupo.grupo}</div>${links}`;
  }).join('');

  // Logo/nome da empresa: tenta buscar o cadastrado em Configurações; com
  // logo enviada, mostra foto + nome lado a lado; sem logo, só o nome
  // (ou "Encanto Decorações" se nada estiver cadastrado ainda).
  let logoHtml = 'Encanto Decorações';
  try {
    const { supabase } = await import('../js/lib/supabase-client.js');
    const { data } = await supabase.from('empresa_config').select('nome, logo_url').eq('id', 1).single();
    const nome = escapeHtml(data?.nome || 'Encanto Decorações');
    if (data?.logo_url) logoHtml = `<img src="${escapeHtml(data.logo_url)}" alt="${nome}"><span>${nome}</span>`;
    else if (data?.nome) logoHtml = nome;
  } catch {
    // Mantém o texto padrão se a busca falhar (ex: sem conexão)
  }

  mount.innerHTML = `
    <div class="sidebar-backdrop" id="sidebar-backdrop"></div>
    <aside class="sidebar" id="app-sidebar">
      <div class="sidebar-mobile-header">
        <div class="sidebar-logo">${logoHtml}</div>
        <button class="sidebar-close-btn" id="btn-fechar-sidebar" aria-label="Fechar menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 6-12 12M6 6l12 12"/></svg>
        </button>
      </div>
      <nav class="sidebar-nav">${grupos}</nav>
      <div class="sidebar-footer">
        <a class="sidebar-link" href="#" id="btn-logout">
          <span class="icon">${ICONES.sair}</span>
          <span>Sair</span>
        </a>
        <button type="button" class="demo-reset-link" id="btn-reset-demo">Reiniciar dados de demonstração</button>
      </div>
    </aside>
  `;

  mount.querySelector('#btn-logout').addEventListener('click', async (e) => {
    e.preventDefault();
    const { logout } = await import('../js/modules/auth.js');
    logout();
  });

  mount.querySelector('#btn-reset-demo').addEventListener('click', async () => {
    if (!confirm('Isso apaga todas as alterações feitas nesta demonstração (clientes, eventos, pagamentos etc.) e restaura os dados fictícios originais. Continuar?')) return;
    const { resetarDadosDemo } = await import('../js/lib/supabase-client.js');
    resetarDadosDemo();
    window.location.href = 'dashboard.html';
  });

  const sidebarEl = document.getElementById('app-sidebar');
  const backdropEl = document.getElementById('sidebar-backdrop');

  function fecharMenu() {
    sidebarEl.classList.remove('is-open');
    backdropEl.classList.remove('is-open');
  }

  document.getElementById('btn-fechar-sidebar').addEventListener('click', fecharMenu);
  backdropEl.addEventListener('click', fecharMenu);
}

/**
 * Abre/fecha o menu lateral no mobile — chamado pelo botão hambúrguer
 * da Topbar (components/topbar.js).
 */
export function alternarSidebar() {
  document.getElementById('app-sidebar')?.classList.toggle('is-open');
  document.getElementById('sidebar-backdrop')?.classList.toggle('is-open');
}