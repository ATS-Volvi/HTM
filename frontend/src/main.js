// ==========================================================================
// VOLVITECH HOSPITALITY OS — CORE APPLICATION CONTROLLER & WORKSPACE ROUTER
// Seamlessly coordinates Auth -> Workspace Selection -> Departmental Operations
// ==========================================================================

import { store } from './state/store.js';
import { renderHeader, bindHeaderEvents } from './components/Header.js';
import { renderSidebar, bindSidebarEvents } from './components/Sidebar.js';
import { renderToast } from './components/Toast.js';

// Auth & Workspace Selector Views
import { LoginView } from './views/auth/LoginView.js';
import { WorkspaceSelectorView } from './views/workspace/WorkspaceSelectorView.js';
import { renderActiveWorkspace } from './views/workspace/ActiveWorkspaceShell.js';

// Front Office Stitch Views
import { ReservationDashboardView } from './views/frontoffice/ReservationDashboardView.js';
import { ReservationsListView } from './views/frontoffice/ReservationsListView.js';
import { ArrivalsCheckInView } from './views/frontoffice/ArrivalsCheckInView.js';
import { InHouseGuestsView } from './views/frontoffice/InHouseGuestsView.js';
import { DeparturesCheckOutView } from './views/frontoffice/DeparturesCheckOutView.js';
import { GuestFolioView } from './views/frontoffice/GuestFolioView.js';
import { GroupBlockView } from './views/frontoffice/GroupBlockView.js';
import { GuestProfileCRMView } from './views/frontoffice/GuestProfileCRMView.js';
import { RoomInventoryView } from './views/frontoffice/RoomInventoryView.js';
import { RoomStatusView } from './views/frontoffice/RoomStatusView.js';
import { RoomBoardView } from './views/frontoffice/RoomBoardView.js';
import { RoomAssignmentView } from './views/frontoffice/RoomAssignmentView.js';
import { HouseStatusView } from './views/frontoffice/HouseStatusView.js';
import { AccountsView } from './views/frontoffice/AccountsView.js';
import { QueueReservationsView } from './views/frontoffice/QueueReservationsView.js';
import { KeyAccessView } from './views/frontoffice/KeyAccessView.js';
import { LostAndFoundView } from './views/frontoffice/LostAndFoundView.js';
import { HousekeepingDashboardView } from './views/HousekeepingView.js';
import { MaintenanceDashboardView } from './views/MaintenanceView.js';

let activeViewInstance = null;

function renderApp() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  const state = store.state;

  // 1. SCREEN 1: UN-AUTHENTICATED STATE -> ENTERPRISE LOGIN VIEW
  if (!state.isAuthenticated) {
    appContainer.innerHTML = '';
    const loginView = new LoginView();
    appContainer.appendChild(loginView.render());
    const toastMount = document.createElement('div');
    toastMount.innerHTML = renderToast(state);
    appContainer.appendChild(toastMount);
    return;
  }

  // 2. SCREEN 2: AUTHENTICATED BUT NO ACTIVE WORKSPACE -> WORKSPACE SELECTOR
  if (!state.activeWorkspace) {
    appContainer.innerHTML = '';
    const selectorView = new WorkspaceSelectorView();
    appContainer.appendChild(selectorView.render());
    const toastMount = document.createElement('div');
    toastMount.innerHTML = renderToast(state);
    appContainer.appendChild(toastMount);
    return;
  }

  // 3. SCREEN 3A: OPERATIONAL WORKSPACES WITH ENTERPRISE SIDEBAR SHELL (FRONT DESK, HOUSEKEEPING, MAINTENANCE)
  if (state.activeWorkspace === 'FRONT_DESK' || state.activeWorkspace === 'HOUSEKEEPING' || state.activeWorkspace === 'MAINTENANCE') {
    const isHousekeeping = state.activeWorkspace === 'HOUSEKEEPING';
    const isMaintenance = state.activeWorkspace === 'MAINTENANCE';

    // Support direct hash or query parameter navigation (e.g., #room_assignment, ?view=room_assignment)
    let urlTab = null;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const rawHash = (window.location.hash || '').replace(/^#\/?/, '').replace(/-/g, '_').toLowerCase();
      const rawQuery = (urlParams.get('tab') || urlParams.get('view') || '').replace(/-/g, '_').toLowerCase();
      urlTab = rawQuery || rawHash || null;
    } catch (_) {}

    const validTabs = [
      'dashboard', 'arrivals', 'queue_reservations', 'inhouse', 'departures',
      'room_status', 'room_board', 'room_assignment', 'house_status',
      'crm', 'billing', 'messages', 'traces', 'wakeup_calls',
      'housekeeping', 'maintenance', 'inventory'
    ];
    const resolvedTab = (urlTab && validTabs.includes(urlTab)) ? urlTab : null;
    const activeTab = resolvedTab || state.activeNavTab || (isMaintenance ? 'maintenance' : (isHousekeeping ? 'housekeeping' : 'reservations'));

    appContainer.innerHTML = `
      <div class="min-h-screen bg-surface-bright text-on-surface font-body-sm">
        ${renderHeader(state)}
        <div class="flex min-h-screen">
          ${renderSidebar(state)}
          <main class="flex-1 md:ml-64 pt-20 px-6 max-w-7xl mx-auto w-full pb-12">
            <div id="frontoffice-view-mount" class="w-full"></div>
          </main>
        </div>
        ${renderToast(state)}
      </div>
    `;

    // Bind Topbar & Sidebar
    bindHeaderEvents();
    bindSidebarEvents();

    // Mount Active Front Office / Housekeeping View
    const mountPoint = document.getElementById('frontoffice-view-mount');
    if (!mountPoint) return;

    switch (activeTab) {
      case 'housekeeping':
      case 'hk_tasks':
      case 'hk_inspections':
      case 'hk_requests':
      case 'hk_lostfound':
        activeViewInstance = new HousekeepingDashboardView();
        mountPoint.appendChild(activeViewInstance.render());
        activeViewInstance.loadData().then(() => {
          if (activeTab === 'hk_inspections') {
            activeViewInstance.setQuickFilter('INSPECTION');
          } else if (activeTab === 'hk_requests') {
            const reqSec = document.getElementById('guest-requests-section');
            if (reqSec) reqSec.scrollIntoView({ behavior: 'smooth' });
          } else if (activeTab === 'hk_lostfound') {
            const lfSec = document.getElementById('lost-found-section');
            if (lfSec) lfSec.scrollIntoView({ behavior: 'smooth' });
          }
        });
        break;

      case 'arrivals':
        activeViewInstance = new ArrivalsCheckInView();
        mountPoint.appendChild(activeViewInstance.render());
        activeViewInstance.loadData().then(() => activeViewInstance.renderContent());
        break;

      case 'inhouse':
        activeViewInstance = new InHouseGuestsView();
        mountPoint.appendChild(activeViewInstance.render());
        activeViewInstance.loadData().then(() => activeViewInstance.renderContent());
        break;

      case 'billing':
      case 'guest_folios':
      case 'folios':
        activeViewInstance = new GuestFolioView();
        mountPoint.appendChild(activeViewInstance.render());
        activeViewInstance.loadData().then(() => activeViewInstance.renderContent());
        break;

      case 'departures':
        activeViewInstance = new DeparturesCheckOutView();
        mountPoint.appendChild(activeViewInstance.render());
        activeViewInstance.loadData().then(() => activeViewInstance.renderContent());
        break;

      case 'groups':
        activeViewInstance = new GroupBlockView();
        mountPoint.appendChild(activeViewInstance.render());
        break;

      case 'crm':
      case 'guests':
        activeViewInstance = new GuestProfileCRMView();
        mountPoint.appendChild(activeViewInstance.render());
        activeViewInstance.loadData().then(() => activeViewInstance.renderContent());
        break;

      case 'room_status':
        activeViewInstance = new RoomStatusView();
        mountPoint.appendChild(activeViewInstance.render());
        activeViewInstance.loadData().then(() => activeViewInstance.renderContent());
        break;

      case 'room_board':
      case 'inventory':
        activeViewInstance = new RoomBoardView();
        mountPoint.appendChild(activeViewInstance.render());
        activeViewInstance.loadData().then(() => activeViewInstance.renderContent());
        break;

      case 'house_status':
        activeViewInstance = new HouseStatusView();
        mountPoint.appendChild(activeViewInstance.render());
        break;

      case 'accounts':
      case 'house_accounts':
        activeViewInstance = new AccountsView();
        mountPoint.appendChild(activeViewInstance.render());
        break;

      case 'keycards':
        activeViewInstance = new KeyAccessView();
        activeViewInstance.mount(mountPoint);
        break;

      case 'lostfound':
        activeViewInstance = new LostAndFoundView();
        activeViewInstance.mount(mountPoint);
        break;

      case 'reservations_list':
        activeViewInstance = new ReservationsListView();
        mountPoint.appendChild(activeViewInstance.render());
        activeViewInstance.loadData().then(() => activeViewInstance.renderContent());
        break;

      case 'room_assignment':
        activeViewInstance = new RoomAssignmentView();
        mountPoint.appendChild(activeViewInstance.render());
        break;

      case 'queue_reservations':
        activeViewInstance = new QueueReservationsView();
        mountPoint.appendChild(activeViewInstance.render());
        break;

      case 'messages':
      case 'traces':
      case 'wakeup_calls': {
        const routeMeta = {
          messages: { title: 'Messages', desc: 'Guest incoming communications and department message logs.', icon: 'chat' },
          traces: { title: 'Traces & Follow-ups', desc: 'Time-sensitive guest traces, follow-ups, and operational action items.', icon: 'flag' },
          wakeup_calls: { title: 'Wake-up Calls', desc: 'Automated morning schedules and priority guest wake-up requests.', icon: 'alarm' }
        }[activeTab];

        mountPoint.innerHTML = `
          <div class="w-full flex flex-col gap-6 animate-fadeIn pb-12">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span class="font-label-caps text-[11px] font-bold uppercase text-secondary">Front Desk Operations</span>
                <h1 class="font-headline-lg text-2xl sm:text-3xl font-bold text-primary tracking-tight mt-0.5">${routeMeta.title}</h1>
                <p class="font-body-md text-xs text-on-surface-variant mt-1">${routeMeta.desc}</p>
              </div>
            </div>
            <div class="bg-surface-container-lowest rounded-2xl p-12 border border-outline-variant/70 shadow-xs flex flex-col items-center justify-center text-center my-6">
              <div class="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-xs">
                <span class="material-symbols-outlined text-[28px]">${routeMeta.icon}</span>
              </div>
              <h3 class="font-headline-sm text-base font-bold text-primary mb-1">${routeMeta.title} Workspace</h3>
              <p class="text-xs text-on-surface-variant max-w-md mb-5 leading-relaxed">
                This destination is maintained as an operational placeholder route in the Front Desk navigation hierarchy.
              </p>
              <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/60 text-on-surface-variant text-[11px] font-data-mono font-bold">
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Operational Module Placeholder Route</span>
              </div>
            </div>
          </div>
        `;
        break;
      }

      case 'maintenance':
      case 'maint_workorders':
      case 'maint_urgent':
      case 'maint_pm':
      case 'maint_assets':
      case 'maint_team':
        activeViewInstance = new MaintenanceDashboardView();
        mountPoint.appendChild(activeViewInstance.render());
        activeViewInstance.loadData().then(() => {
          if (activeTab === 'maint_urgent') {
            activeViewInstance.setQuickFilter('URGENT');
          } else if (activeTab === 'maint_pm') {
            activeViewInstance.workOrdersTab = 'preventive';
            activeViewInstance.renderContent();
          } else if (activeTab === 'maint_assets') {
            activeViewInstance.workOrdersTab = 'assets';
            activeViewInstance.renderContent();
          } else if (activeTab === 'maint_team') {
            activeViewInstance.workOrdersTab = 'technicians';
            activeViewInstance.renderContent();
          }
        });
        break;

      case 'reservations':
      case 'dashboard':
      default:
        if (isMaintenance) {
          activeViewInstance = new MaintenanceDashboardView();
          mountPoint.appendChild(activeViewInstance.render());
          activeViewInstance.loadData().then(() => activeViewInstance.bindEvents());
        } else if (isHousekeeping) {
          activeViewInstance = new HousekeepingDashboardView();
          mountPoint.appendChild(activeViewInstance.render());
          activeViewInstance.loadData().then(() => activeViewInstance.bindEvents());
        } else {
          activeViewInstance = new ReservationDashboardView();
          mountPoint.appendChild(activeViewInstance.render());
          activeViewInstance.loadData().then(() => activeViewInstance.renderContent());
        }
        break;
    }
    return;
  }

  // 4. SCREEN 3B: OPERATIONAL WORKSPACES OUTSIDE FRONT DESK (Housekeeping, F&B, Maintenance, Inventory, etc.)
  const activeWs = renderActiveWorkspace(state.activeWorkspace, state);

  appContainer.innerHTML = `
    <div class="min-h-screen bg-surface-bright text-on-surface font-body-sm">
      ${renderHeader(state)}
      <main class="pt-20 px-6 max-w-7xl mx-auto w-full pb-12">
        <div id="active-workspace-mount" class="w-full">
          ${activeWs.html}
        </div>
      </main>
      ${renderToast(state)}
    </div>
  `;

  bindHeaderEvents();
  if (typeof activeWs.bindEvents === 'function') {
    activeWs.bindEvents();
  }
}

// Initial mount & state subscription
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  store.subscribe(() => renderApp());
});

window.addEventListener('hashchange', () => {
  const hash = (window.location.hash || '').replace(/^#\/?/, '').replace(/-/g, '_').toLowerCase();
  const validTabs = [
    'dashboard', 'arrivals', 'queue_reservations', 'inhouse', 'departures',
    'room_status', 'room_board', 'room_assignment', 'house_status',
    'crm', 'billing', 'messages', 'traces', 'wakeup_calls',
    'housekeeping', 'maintenance', 'inventory'
  ];
  if (validTabs.includes(hash)) {
    store.setNavTab(hash);
  }
});


