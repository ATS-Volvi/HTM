import { store } from '../state/store.js';
import { showToast } from './Toast.js';

export function renderHeader(state) {
  const mode = state.currentMode; // 'guest' | 'staff' | 'admin'
  const isGuest = mode === 'guest';
  const isStaff = mode === 'staff';
  const isAdmin = mode === 'admin';
  const pendingTasksCount = state.tasks.filter(t => t.status === 'Pending').length;
  const openComplaintsCount = state.complaints.filter(c => c.status !== 'Resolved').length;

  let avatarUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80';
  let pillText = 'Suite 402';
  let nameText = 'Mr. Harrison';

  if (isStaff) {
    avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
    pillText = 'Floor 4 Lead';
    nameText = 'Elena Gomez';
  } else if (isAdmin) {
    avatarUrl = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80';
    pillText = 'Executive GM';
    nameText = 'Arthur Pendelton';
  }

  return `
    <header class="app-header">
      <!-- Left: User Profile / Room Info -->
      <div class="header-left">
        <div class="header-avatar-circle">
          <img 
            src="${avatarUrl}" 
            alt="Profile Avatar" 
          />
        </div>
        <div class="header-user-info">
          <span class="header-room-pill">${pillText}</span>
          <span class="header-user-name">${nameText}</span>
        </div>
      </div>

      <!-- Center: Luxury Brand Logo -->
      <div class="header-center">
        <h1 class="header-brand-title">LuxeStay</h1>
      </div>

      <!-- Right: 3-Way Role Switcher & Notification Bell -->
      <div class="header-right">
        <div class="mode-badge-switch" id="header-mode-switcher">
          <button class="mode-tab ${isGuest ? 'active' : ''}" data-mode="guest" title="Guest Suite Portal">
            <span class="material-symbols-outlined" style="font-size: 13px;">concierge</span>
            <span>Guest</span>
          </button>
          <button class="mode-tab ${isStaff ? 'active' : ''}" data-mode="staff" title="Staff Dispatch & Tasks">
            <span class="material-symbols-outlined" style="font-size: 13px;">tune</span>
            <span>Staff</span>
          </button>
          <button class="mode-tab ${isAdmin ? 'active' : ''}" data-mode="admin" title="General Manager & Menu / Staff Auto-Assign">
            <span class="material-symbols-outlined" style="font-size: 13px;">admin_panel_settings</span>
            <span>Manager</span>
          </button>
        </div>

        <button class="header-notif-btn" id="notification-btn" title="Notifications">
          <span class="material-symbols-outlined">notifications</span>
          ${isGuest && state.dndActive ? `
            <span class="notif-dot notif-dot-error"></span>
          ` : isStaff && pendingTasksCount > 0 ? `
            <span class="notif-dot notif-dot-warn"></span>
          ` : isAdmin && openComplaintsCount > 0 ? `
            <span class="notif-dot notif-dot-error"></span>
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
        mode === 'guest' ? 'Guest Suite Mode' : mode === 'staff' ? 'Staff Operations Mode' : 'General Manager Portal',
        mode === 'guest' 
          ? 'Viewing Suite 402 guest portal' 
          : mode === 'staff' 
          ? 'Viewing supervisor floor grid & task queue' 
          : 'Viewing executive auto-assign, menu editor & complaints',
        mode === 'guest' ? 'bed' : mode === 'staff' ? 'tune' : 'admin_panel_settings'
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
      } else if (state.currentMode === 'staff') {
        const pending = state.tasks.filter(t => t.status === 'Pending').length;
        showToast(
          'Staff Dispatch Summary',
          `${pending} pending operations tasks in current queue.`,
          'assignment'
        );
      } else {
        const openC = state.complaints.filter(c => c.status !== 'Resolved').length;
        showToast(
          'Executive Escalation Center',
          `${openC} guest grievances awaiting manager resolution.`,
          'report_problem'
        );
      }
    });
  }
}
