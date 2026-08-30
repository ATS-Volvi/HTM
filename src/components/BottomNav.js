import { store } from '../state/store.js';

export function renderBottomNav(state) {
  const mode = state.currentMode; // 'guest' | 'staff' | 'admin'
  const currentView = state.currentView;
  const adminSubTab = state.adminSubTab || 'overview';

  if (mode === 'guest') {
    const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const activeRequestsCount = state.requests.filter(r => r.status !== 'Completed').length;

    return `
      <nav class="bottom-nav">
        <button class="nav-item ${currentView === 'guest-home' ? 'active' : ''}" data-view="guest-home">
          <span class="material-symbols-outlined">home</span>
          <span>Home</span>
        </button>
        <button class="nav-item ${currentView === 'dining' || currentView === 'checkout' || currentView === 'order-tracking' ? 'active' : ''}" data-view="dining">
          <span class="material-symbols-outlined">restaurant</span>
          <span>Dining</span>
          ${cartCount > 0 ? `<span class="nav-badge">${cartCount}</span>` : ''}
        </button>
        <button class="nav-item ${currentView === 'schedule-service' || currentView === 'report-issue' ? 'active' : ''}" data-view="schedule-service">
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
  } else if (mode === 'staff') {
    // Staff Hub Navigation
    const urgentTasks = state.tasks.filter(t => t.priority === 'Urgent' && t.status !== 'Completed').length;
    const criticalInventory = state.inventory.filter(i => i.status === 'Critical' || i.status === 'Low Stock').length;

    return `
      <nav class="bottom-nav" style="background: #ffffff;">
        <button class="nav-item ${currentView === 'staff-rooms' ? 'active' : ''}" data-view="staff-rooms">
          <span class="material-symbols-outlined">grid_view</span>
          <span>Rooms</span>
        </button>
        <button class="nav-item ${currentView === 'staff-tasks' ? 'active' : ''}" data-view="staff-tasks">
          <span class="material-symbols-outlined">assignment</span>
          <span>Tasks</span>
          ${urgentTasks > 0 ? `<span class="nav-badge">${urgentTasks}</span>` : ''}
        </button>
        <button class="nav-item ${currentView === 'staff-maintenance' ? 'active' : ''}" data-view="staff-maintenance">
          <span class="material-symbols-outlined">handyman</span>
          <span>Dispatch</span>
        </button>
        <button class="nav-item ${currentView === 'staff-inventory' ? 'active' : ''}" data-view="staff-inventory">
          <span class="material-symbols-outlined">inventory_2</span>
          <span>Stock</span>
          ${criticalInventory > 0 ? `<span class="nav-badge" style="background: var(--warning);">${criticalInventory}</span>` : ''}
        </button>
        <button class="nav-item ${currentView === 'staff-shifts' || currentView === 'staff-kpis' || currentView === 'staff-handover' ? 'active' : ''}" data-view="staff-shifts">
          <span class="material-symbols-outlined">groups</span>
          <span>Shifts</span>
        </button>
      </nav>
    `;
  } else {
    // General Manager / Admin Mode Navigation
    const openComplaintsCount = state.complaints.filter(c => c.status !== 'Resolved').length;

    return `
      <nav class="bottom-nav" style="background: #ffffff; border-top: 1.5px solid var(--secondary-fixed);">
        <button class="nav-item ${adminSubTab === 'overview' ? 'active' : ''}" data-admin-tab="overview">
          <span class="material-symbols-outlined">dashboard</span>
          <span>Overview</span>
        </button>
        <button class="nav-item ${adminSubTab === 'staff' ? 'active' : ''}" data-admin-tab="staff">
          <span class="material-symbols-outlined">badge</span>
          <span>Staff</span>
        </button>
        <button class="nav-item ${adminSubTab === 'menu' ? 'active' : ''}" data-admin-tab="menu">
          <span class="material-symbols-outlined">restaurant_menu</span>
          <span>Menu</span>
        </button>
        <button class="nav-item ${adminSubTab === 'complaints' ? 'active' : ''}" data-admin-tab="complaints">
          <span class="material-symbols-outlined">report_problem</span>
          <span>Complaints</span>
          ${openComplaintsCount > 0 ? `<span class="nav-badge" style="background: var(--error);">${openComplaintsCount}</span>` : ''}
        </button>
      </nav>
    `;
  }
}

export function bindBottomNavEvents() {
  const items = document.querySelectorAll('.nav-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      const view = item.dataset.view;
      const adminTab = item.dataset.adminTab;

      if (view) {
        store.setView(view);
      } else if (adminTab) {
        store.setAdminSubTab(adminTab);
      }
    });
  });
}
