/* ==========================================================================
   ENCANTO DECORAÇÕES — Toast (feedback de ações)
   Uso: import { showToast } from '../lib/toast.js';
        showToast('Cliente salvo com sucesso.', 'success');
   ========================================================================== */

function getRegion() {
  let region = document.getElementById('toast-region');
  if (!region) {
    region = document.createElement('div');
    region.id = 'toast-region';
    region.setAttribute('aria-live', 'polite');
    document.body.appendChild(region);
  }
  return region;
}

/**
 * Exibe uma notificação temporária no canto da tela.
 * @param {string} message
 * @param {'default'|'success'|'danger'} type
 * @param {number} duration em ms
 */
export function showToast(message, type = 'default', duration = 4000) {
  const region = getRegion();

  const toast = document.createElement('div');
  toast.className = `toast${type !== 'default' ? ` toast-${type}` : ''}`;
  toast.setAttribute('role', 'status');
  toast.textContent = message;

  region.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 200ms ease';
    setTimeout(() => toast.remove(), 200);
  }, duration);
}
