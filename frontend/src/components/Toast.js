// ==========================================================================
// VOLVITECH HOSPITALITY OS — ENTERPRISE TOAST NOTIFICATION COMPONENT
// ==========================================================================

import { store } from '../state/store.js';

export function renderToast(state) {
  if (!state.toast) return '';

  const { message, type } = state.toast;
  const iconMap = {
    success: { icon: 'check_circle', bg: '#065F46', border: '#10B981' },
    warning: { icon: 'warning', bg: '#92400E', border: '#F59E0B' },
    error: { icon: 'error', bg: '#991B1B', border: '#EF4444' },
    info: { icon: 'info', bg: '#1E40AF', border: '#3B82F6' }
  };

  const cfg = iconMap[type] || iconMap.info;

  return `
    <div style="position: fixed; bottom: 24px; right: 24px; z-index: 200; animation: slideLeft 0.2s ease-out;">
      <div style="background: #0F172A; border: 1px solid ${cfg.border}; border-left: 4px solid ${cfg.border}; color: #FFFFFF; padding: 12px 18px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 12px; max-width: 420px; font-size: 13px;">
        <span class="material-symbols-outlined" style="font-size: 20px; color: ${cfg.border};">${cfg.icon}</span>
        <span style="font-weight: 500;">${message}</span>
      </div>
    </div>
  `;
}

export function showToast(message, type = 'info') {
  store.showToast(message, type);
}

export const Toast = {
  show: ({ title, message, type = 'info' }) => {
    showToast(title ? `${title}: ${message}` : message, type);
  }
};
