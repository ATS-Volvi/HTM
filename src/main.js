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
import { BookingsView } from './views/frontoffice/BookingsView.js';
import { ServicesRequestsView } from './views/frontoffice/ServicesRequestsView.js';
import { ReservationDashboardView } from './views/frontoffice/ReservationDashboardView.js';
import { ReservationsListView } from './views/frontoffice/ReservationsListView.js';
import { ArrivalsCheckInView } from './views/frontoffice/ArrivalsCheckInView.js';
import { DeparturesCheckOutView } from './views/frontoffice/DeparturesCheckOutView.js';
import { GuestFolioView } from './views/frontoffice/GuestFolioView.js';
import { GroupBlockView } from './views/frontoffice/GroupBlockView.js';
import { GuestProfileCRMView } from './views/frontoffice/GuestProfileCRMView.js';
import { RoomInventoryView } from './views/frontoffice/RoomInventoryView.js';
import { RoomGridView } from './views/frontoffice/RoomGridView.js';
import { RoomBoardView } from './views/frontoffice/RoomBoardView.js';
import { HouseStatusView } from './views/frontoffice/HouseStatusView.js';
import { RoomMasterView } from './views/frontoffice/RoomMasterView.js';
import { AccountsView } from './views/frontoffice/AccountsView.js';
import { QueueReservationsView } from './views/frontoffice/QueueReservationsView.js';
import { KeyAccessView } from './views/frontoffice/KeyAccessView.js';
import { LostAndFoundView } from './views/frontoffice/LostAndFoundView.js';
import { HousekeepingDashboardView } from './views/HousekeepingView.js';
import { LiveDispatchView } from './views/housekeeping/LiveDispatchView.js';
import { StaffMembersView } from './views/housekeeping/StaffMembersView.js';
import { HousekeepingHouseStatusView } from './views/housekeeping/HousekeepingHouseStatusView.js';
import { LinenAmenitiesView } from './views/housekeeping/LinenAmenitiesView.js';
import { MaintenanceDashboardView } from './views/MaintenanceView.js';
import { FoodBeverageView } from './views/fb/FoodBeverageView.js';

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

  // Auto-route direct URL hash to operational workspace
  const directHash = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase();
  if (['fb', 'food_beverage', 'fb_dashboard', 'fb_meals', 'fb_menu', 'fb_chefs', 'fb_ingredients', 'meals', 'menu', 'chefs', 'ingredients'].includes(directHash)) {
    state.activeWorkspace = 'FB';
  } else if (['maintenance', 'maint_dashboard', 'maint_requests', 'maint_preventive', 'preventive', 'maint_machines', 'maint_staff'].includes(directHash)) {
    state.activeWorkspace = 'MAINTENANCE';
  } else if (['housekeeping', 'hk_dispatch', 'hk_staff', 'hk_house_status', 'hk_linen'].includes(directHash)) {
    state.activeWorkspace = 'HOUSEKEEPING';
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

  // 3. SCREEN 3A: OPERATIONAL WORKSPACES WITH ENTERPRISE SIDEBAR SHELL (FRONT DESK, HOUSEKEEPING, MAINTENANCE, F&B)
  if (state.activeWorkspace === 'FRONT_DESK' || state.activeWorkspace === 'HOUSEKEEPING' || state.activeWorkspace === 'MAINTENANCE' || state.activeWorkspace === 'FB' || state.activeWorkspace === 'FOOD_BEVERAGE') {
    const isHousekeeping = state.activeWorkspace === 'HOUSEKEEPING';
    const isMaintenance = state.activeWorkspace === 'MAINTENANCE';
    const isFoodBeverage = state.activeWorkspace === 'FB' || state.activeWorkspace === 'FOOD_BEVERAGE';

    // Support direct hash or query parameter navigation (e.g., #room_assignment, ?view=room_assignment)
    let urlTab = null;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const rawHash = (window.location.hash || '').replace(/^#\/?/, '').replace(/-/g, '_').toLowerCase();
      const rawQuery = (urlParams.get('tab') || urlParams.get('view') || '').replace(/-/g, '_').toLowerCase();
      urlTab = rawQuery || rawHash || null;
    } catch (_) {}

    const validTabs = [
      'dashboard', 'bookings', 'profiles', 'arrivals', 'inhouse', 'room_grid', 'room_matrix', 'room_status',
      'crm', 'services', 'queue_reservations', 'departures',
      'room_board', 'house_status', 'room_master', 'room_configuration', 'billing', 'messages', 'traces', 'wakeup_calls',
      'housekeeping', 'hk_dispatch', 'dispatch', 'hk_staff', 'staff', 'hk_house_status', 'inventory',
      'maintenance', 'maint_dashboard', 'maint_requests', 'maint_preventive', 'maint_machines', 'maint_staff',
      'maint_workorders', 'maint_urgent', 'maint_pm', 'maint_assets', 'maint_team',
      'fb', 'fb_dashboard', 'fb_meals', 'fb_menu', 'fb_chefs', 'fb_ingredients', 'meals', 'menu', 'chefs', 'ingredients'
    ];
    const resolvedTab = (urlTab && validTabs.includes(urlTab)) ? urlTab : null;
    const activeTab = resolvedTab || state.activeNavTab || (isFoodBeverage ? 'fb_dashboard' : (isMaintenance ? 'maint_dashboard' : (isHousekeeping ? 'housekeeping' : 'reservations')));
    state.activeNavTab = activeTab;

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

      case 'hk_dispatch':
      case 'dispatch':
        activeViewInstance = new LiveDispatchView();
        mountPoint.appendChild(activeViewInstance.render());
        break;

      case 'hk_staff':
      case 'staff':
        activeViewInstance = new StaffMembersView();
        mountPoint.appendChild(activeViewInstance.render());
        break;

      case 'hk_house_status':
      case 'hk_house':
      case 'hk_room_status':
        activeViewInstance = new HousekeepingHouseStatusView();
        mountPoint.appendChild(activeViewInstance.render());
        break;

      case 'hk_linen':
      case 'hk_linen_inventory':
      case 'hk_laundry':
      case 'linen':
      case 'laundry':
        activeViewInstance = new LinenAmenitiesView();
        mountPoint.appendChild(activeViewInstance.render());
        break;

      case 'bookings':
      case 'reservations_list':
      case 'online_booking':
      case 'walkin_booking':
      case 'arrivals':
      case 'profiles':
      case 'inhouse':
        activeViewInstance = new BookingsView();
        activeViewInstance.activeMode = 'profiles';
        if (activeTab === 'walkin_booking') {
          activeViewInstance.profilesFilterStatus = 'WALK_IN';
        } else if (activeTab === 'online_booking') {
          activeViewInstance.profilesFilterStatus = 'ONLINE';
        } else if (activeTab === 'inhouse') {
          activeViewInstance.profilesFilterStatus = 'CHECKED_IN';
        } else {
          activeViewInstance.profilesFilterStatus = 'ALL';
        }
        mountPoint.appendChild(activeViewInstance.render());
        activeViewInstance.bindEvents();
        break;

      case 'services':
      case 'requests':
        activeViewInstance = new ServicesRequestsView();
        mountPoint.appendChild(activeViewInstance.render());
        activeViewInstance.bindEvents();
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

      case 'house_status':
      case 'room_grid':
      case 'room_matrix':
        activeViewInstance = new HouseStatusView();
        mountPoint.appendChild(activeViewInstance.render());
        activeViewInstance.loadData().then(() => activeViewInstance.renderContent());
        break;

      case 'room_status':
        activeViewInstance = new HouseStatusView();
        activeViewInstance.activePageTab = 'operations';
        mountPoint.appendChild(activeViewInstance.render());
        activeViewInstance.loadData().then(() => {
          activeViewInstance.renderContent();
          activeViewInstance._mountRoomOps();
        });
        break;

      case 'room_board':
      case 'inventory':
        activeViewInstance = new RoomBoardView();
        mountPoint.appendChild(activeViewInstance.render());
        activeViewInstance.loadData().then(() => activeViewInstance.renderContent());
        break;

      case 'room_master':
      case 'room_configuration':
        activeViewInstance = new RoomMasterView();
        mountPoint.appendChild(activeViewInstance.render());
        activeViewInstance.loadData().then(() => activeViewInstance.renderContent());
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
      case 'lost_and_found':
      case 'hk_lostfound':
        activeViewInstance = new LostAndFoundView();
        activeViewInstance.mount(mountPoint);
        break;

      case 'housekeeping':
      case 'hk_tasks':
      case 'hk_inspections':
      case 'hk_requests':
      case 'hk_assignments':
        activeViewInstance = new HousekeepingDashboardView();
        if (activeTab === 'hk_assignments') {
          activeViewInstance.activeSection = 'assignments';
        } else if (activeTab === 'hk_inspections') {
          activeViewInstance.activeQuickFilter = 'INSPECTION';
        } else if (activeTab === 'hk_requests') {
          activeViewInstance.activeQuickFilter = 'REQUESTS';
        }
        mountPoint.appendChild(activeViewInstance.render());
        activeViewInstance.loadData().then(() => activeViewInstance.bindEvents());
        break;

      case 'maint_dashboard':
      case 'maint_requests':
      case 'maint_preventive':
      case 'maint_machines':
      case 'maint_staff':
      case 'maintenance':
      case 'maint_workorders':
      case 'maint_urgent':
      case 'maint_pm':
      case 'maint_assets':
      case 'maint_team':
        activeViewInstance = new MaintenanceDashboardView();
        mountPoint.appendChild(activeViewInstance.render());
        activeViewInstance.loadData().then(() => {
          if (activeTab === 'maint_dashboard' || activeTab === 'maintenance') {
            activeViewInstance.workOrdersTab = 'dashboard';
            activeViewInstance.renderContent();
          } else if (activeTab === 'maint_requests' || activeTab === 'maint_workorders') {
            activeViewInstance.workOrdersTab = 'list';
            activeViewInstance.renderContent();
          } else if (activeTab === 'maint_urgent') {
            activeViewInstance.workOrdersTab = 'list';
            activeViewInstance.setQuickFilter('URGENT');
          } else if (activeTab === 'maint_preventive' || activeTab === 'maint_pm') {
            activeViewInstance.workOrdersTab = 'preventive';
            activeViewInstance.renderContent();
          } else if (activeTab === 'maint_machines' || activeTab === 'maint_assets') {
            activeViewInstance.workOrdersTab = 'assets';
            activeViewInstance.renderContent();
          } else if (activeTab === 'maint_staff' || activeTab === 'maint_team') {
            activeViewInstance.workOrdersTab = 'technicians';
            activeViewInstance.renderContent();
          } else {
            activeViewInstance.renderContent();
          }
        });
        break;

      case 'fb':
      case 'fb_dashboard':
      case 'fb_meals':
      case 'fb_menu':
      case 'fb_chefs':
      case 'fb_ingredients':
      case 'meals':
      case 'menu':
      case 'chefs':
      case 'ingredients':
        activeViewInstance = new FoodBeverageView();
        if (activeTab === 'fb_meals' || activeTab === 'meals') {
          activeViewInstance.activeTab = 'meals';
        } else if (activeTab === 'fb_menu' || activeTab === 'menu') {
          activeViewInstance.activeTab = 'menu';
        } else if (activeTab === 'fb_chefs' || activeTab === 'chefs') {
          activeViewInstance.activeTab = 'chefs';
        } else if (activeTab === 'fb_ingredients' || activeTab === 'ingredients') {
          activeViewInstance.activeTab = 'ingredients';
        } else {
          activeViewInstance.activeTab = 'dashboard';
        }
        mountPoint.appendChild(activeViewInstance.render());
        break;

      case 'reservations':
      case 'dashboard':
      default:
        if (isFoodBeverage) {
          activeViewInstance = new FoodBeverageView();
          mountPoint.appendChild(activeViewInstance.render());
        } else if (isMaintenance) {
          activeViewInstance = new MaintenanceDashboardView();
          mountPoint.appendChild(activeViewInstance.render());
          activeViewInstance.loadData().then(() => {
            activeViewInstance.workOrdersTab = 'dashboard';
            activeViewInstance.renderContent();
          });
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
    'dashboard', 'bookings', 'arrivals', 'inhouse', 'room_status',
    'room_assignment', 'crm', 'services', 'queue_reservations', 'departures',
    'room_board', 'house_status', 'billing', 'messages', 'traces', 'wakeup_calls',
    'housekeeping', 'maintenance', 'inventory'
  ];
  if (validTabs.includes(hash)) {
    store.setNavTab(hash);
  }
});


