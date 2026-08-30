import { store } from '../state/store.js';
import { showToast } from './Toast.js';

export function renderHeader(state) {
  const isGuest = state.currentMode === 'guest';
  const pendingTasksCount = state.tasks.filter(t => t.status === 'Pending').length;

  return `
    <header class="app-header">
      <!-- Left: User Profile / Room Info -->
      <div class="header-left">
        <div class="header-avatar-circle">
          <img 
            src="${isGuest ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}" 
            alt="Profile Avatar" 
          />
        </div>
        <div class="header-user-info">
          <span class="header-room-pill">${isGuest ? 'Suite 402' : 'Floor 4 Lead'}</span>
          <span class="header-user-name">${isGuest ? 'Mr. Harrison' : 'Elena Gomez'}</span>
        </div>
      </div>

      <!-- Center: Luxury Brand Logo -->
      <div class="header-center">
        <h1 class="header-brand-title">LuxeStay</h1>
      </div>

      <!-- Right: Role Switcher & Notification Bell -->
      <div class="header-right">
        <div class="mode-badge-switch" id="header-mode-switcher">
          <button class="mode-tab ${isGuest ? 'active' : ''}" data-mode="guest" title="Switch to Guest View">
            <span class="material-symbols-outlined" style="font-size: 13px;">concierge</span>
            <span>Guest</span>
          </button>
          <button class="mode-tab ${!isGuest ? 'active' : ''}" data-mode="staff" title="Switch to Staff Operations Hub">
            <span class="material-symbols-outlined" style="font-size: 13px;">tune</span>
            <span>Staff</span>
          </button>
        </div>

        <button class="header-notif-btn" id="notification-btn" title="Notifications">
          <span class="material-symbols-outlined">notifications</span>
          ${isGuest && state.dndActive ? `
            <span class="notif-dot notif-dot-error"></span>
          ` : !isGuest && pendingTasksCount > 0 ? `
            <span class="notif-dot notif-dot-warn"></span>
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
      e.stopPropagation();
      const mode = tab.dataset.mode;
      store.setMode(mode);
      showToast(
        mode === 'guest' ? 'Guest Suite Mode' : 'Staff Operations Mode',
        mode === 'guest' ? 'Viewing Suite 402 guest portal' : 'Viewing supervisor command center & task dispatch',
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
          'Suite 402 Concierge Status',
          state.dndActive ? 'Privacy Mode is active (Do Not Disturb).' : 'All hotel services are actively available.',
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
