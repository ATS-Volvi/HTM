import { store } from '../state/store.js';
import { showToast } from './Toast.js';

export function renderHeader(state) {
  const isGuest = state.currentMode === 'guest';
  const hasOrders = state.orders.length > 0;
  const pendingTasksCount = state.tasks.filter(t => t.status === 'Pending').length;

  return `
    <header class="app-header">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="width: 36px; height: 36px; border-radius: 50%; overflow: hidden; border: 1.5px solid var(--gold-accent); flex-shrink: 0; box-shadow: var(--shadow-sm);">
          <img 
            src="${isGuest ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}" 
            alt="Profile Avatar" 
            style="width: 100%; height: 100%; object-fit: cover;"
          />
        </div>
        <div>
          <div class="label-bold" style="color: var(--secondary); font-size: 10px;">
            ${isGuest ? 'Room 402 • Ocean View' : 'Duty Supervisor • Ops'}
          </div>
          <div style="font-family: var(--font-serif); font-size: 14px; font-weight: 700; color: var(--primary);">
            ${isGuest ? 'Mr. Harrison' : 'Elena Gomez'}
          </div>
        </div>
      </div>

      <!-- Mode Switcher -->
      <div class="mode-badge-switch" id="header-mode-switcher">
        <button class="mode-tab ${isGuest ? 'active' : ''}" data-mode="guest">
          <span class="material-symbols-outlined" style="font-size: 14px;">concierge</span>
          Guest
        </button>
        <button class="mode-tab ${!isGuest ? 'active' : ''}" data-mode="staff">
          <span class="material-symbols-outlined" style="font-size: 14px;">tune</span>
          Staff Ops
        </button>
      </div>

      <div style="display: flex; align-items: center; gap: 4px;">
        <button class="btn-icon" id="notification-btn" title="Notifications" style="position: relative;">
          <span class="material-symbols-outlined" style="color: var(--primary);">notifications</span>
          ${isGuest && state.dndActive ? `
            <span style="position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; background: var(--error); border-radius: 50%; border: 1.5px solid white;"></span>
          ` : !isGuest && pendingTasksCount > 0 ? `
            <span style="position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; background: var(--warning); border-radius: 50%; border: 1.5px solid white;"></span>
          ` : ''}
        </button>
      </div>
    </header>
  `;
}

export function bindHeaderEvents() {
  const switchers = document.querySelectorAll('.mode-tab');
  switchers.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const mode = tab.dataset.mode;
      store.setMode(mode);
      showToast(
        mode === 'guest' ? 'Switched to Guest Suite Portal' : 'Switched to Staff Operations Hub',
        mode === 'guest' ? 'Managing Room 402 experience' : 'Live hotel dispatch & supervisor tools active',
        mode === 'guest' ? 'bed' : 'admin_panel_settings'
      );
    });
  });

  const notifBtn = document.getElementById('notification-btn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      const state = store.state;
      if (state.currentMode === 'guest') {
        showToast(
          'Active Concierge Updates',
          state.dndActive ? 'Privacy mode enabled (Do Not Disturb)' : 'All hotel services are actively available for Room 402.',
          'notifications_active'
        );
      } else {
        const pending = state.tasks.filter(t => t.status === 'Pending').length;
        showToast(
          'Staff Dispatch Summary',
          `${pending} pending operations tasks in current queue.`,
          'assignment'
        );
      }
    });
  }
}
