import { store } from '../state/store.js';

export function renderBottomNav(state) {
  const mode       = state.currentMode;      // 'guest' | 'staff' | 'admin'
  const currentView = state.currentView;
  const adminSubTab = state.adminSubTab || 'overview';

  // ── GUEST ─────────────────────────────────────────────
  if (mode === 'guest') {
    const cartCount          = state.cart.reduce((sum, i) => sum + i.quantity, 0);
    const activeRequestsCount = state.requests.filter(r => r.status !== 'Completed').length;

    return `
      <nav class="bottom-nav">
        <button class="nav-item ${currentView === 'guest-home' ? 'active' : ''}" data-view="guest-home">
          <span class="material-symbols-outlined">home</span>
          <span>Home</span>
        </button>
        <button class="nav-item ${['dining','checkout','order-tracking'].includes(currentView) ? 'active' : ''}" data-view="dining">
          <span class="material-symbols-outlined">restaurant</span>
          <span>Dining</span>
          ${cartCount > 0 ? `<span class="nav-badge">${cartCount}</span>` : ''}
        </button>
        <button class="nav-item ${['schedule-service','report-issue'].includes(currentView) ? 'active' : ''}" data-view="schedule-service">
          <span class="material-symbols-outlined">room_service</span>
          <span>Services</span>
        </button>
        <button class="nav-item ${currentView === 'guest-requests' ? 'active' : ''}" data-view="guest-requests">
          <span class="material-symbols-outlined">description</span>
          <span>Notes</span>
          ${activeRequestsCount > 0 ? `<span class="nav-badge" style="background: var(--primary);">${activeRequestsCount}</span>` : ''}
        </button>
      </nav>
    `;
  }

  // ── STAFF (Personal Dashboard only) ───────────────────
  if (mode === 'staff') {
    return `
      <nav class="bottom-nav" style="background: #ffffff;">
        <button class="nav-item ${currentView === 'staff-personal' ? 'active' : ''}" data-view="staff-personal">
          <span class="material-symbols-outlined">assignment_ind</span>
          <span>My Duties</span>
        </button>
        <button class="nav-item ${currentView === 'staff-tasks' ? 'active' : ''}" data-view="staff-tasks">
          <span class="material-symbols-outlined">checklist</span>
          <span>My Tasks</span>
        </button>
        <button class="nav-item ${currentView === 'staff-maintenance' ? 'active' : ''}" data-view="staff-maintenance">
          <span class="material-symbols-outlined">handyman</span>
          <span>Maintenance</span>
        </button>
      </nav>
    `;
  }

  // ── MANAGER / ADMIN ────────────────────────────────────
  const openComplaintsCount = state.complaints.filter(c => c.status !== 'Resolved').length;
  const urgentTasks         = state.tasks.filter(t => t.priority === 'Urgent' && t.status !== 'Completed').length;
  const criticalInventory   = state.inventory.filter(i => i.status === 'Critical' || i.status === 'Low Stock').length;

  return `
    <nav class="bottom-nav" style="background: #ffffff; border-top: 1.5px solid #d4af37;">
      <button class="nav-item ${adminSubTab === 'overview' ? 'active' : ''}" data-admin-tab="overview">
        <span class="material-symbols-outlined">dashboard</span>
        <span>Overview</span>
      </button>
      <button class="nav-item ${adminSubTab === 'rooms' ? 'active' : ''}" data-admin-tab="rooms">
        <span class="material-symbols-outlined">grid_view</span>
        <span>Rooms</span>
      </button>
      <button class="nav-item ${adminSubTab === 'tasks' ? 'active' : ''}" data-admin-tab="tasks">
        <span class="material-symbols-outlined">assignment</span>
        <span>Tasks</span>
        ${urgentTasks > 0 ? `<span class="nav-badge">${urgentTasks}</span>` : ''}
      </button>
      <button class="nav-item ${adminSubTab === 'staff' ? 'active' : ''}" data-admin-tab="staff">
        <span class="material-symbols-outlined">badge</span>
        <span>Staff</span>
      </button>
      <button class="nav-item ${adminSubTab === 'complaints' ? 'active' : ''}" data-admin-tab="complaints">
        <span class="material-symbols-outlined">report_problem</span>
        <span>Issues</span>
        ${openComplaintsCount > 0 ? `<span class="nav-badge" style="background: var(--error);">${openComplaintsCount}</span>` : ''}
      </button>
    </nav>
  `;
}

export function bindBottomNavEvents() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const view     = item.dataset.view;
      const adminTab = item.dataset.adminTab;
      if (view)     store.setView(view);
      else if (adminTab) store.setAdminSubTab(adminTab);
    });
  });
}
