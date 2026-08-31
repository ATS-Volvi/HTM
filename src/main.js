import { store } from './state/store.js';
import { renderHeader, bindHeaderEvents } from './components/Header.js';
import { renderBottomNav, bindBottomNavEvents } from './components/BottomNav.js';
import { renderModalSheet, bindModalEvents } from './components/ModalSheet.js';
import { renderGuestHomeView, bindGuestHomeEvents } from './views/guest/GuestHomeView.js';
import { renderDiningMenuView, bindDiningMenuEvents } from './views/guest/DiningMenuView.js';
import { renderCheckoutView, bindCheckoutEvents } from './views/guest/CheckoutView.js';
import { renderOrderTrackingView, bindOrderTrackingEvents } from './views/guest/OrderTrackingView.js';
import { renderScheduleServiceView, bindScheduleServiceEvents } from './views/guest/ScheduleServiceView.js';
import { renderReportIssueView, bindReportIssueEvents } from './views/guest/ReportIssueView.js';
import { renderGuestRequestsView, bindGuestRequestsEvents } from './views/guest/GuestRequestsView.js';
import { renderChatView, bindChatEvents } from './views/guest/ChatView.js';
// Staff — personal workspace only
import { renderStaffPersonalView, bindStaffPersonalEvents } from './views/staff/StaffPersonalView.js';
import { renderTaskQueueView, bindTaskQueueEvents } from './views/staff/TaskQueueView.js';
import { renderMaintenanceView, bindMaintenanceEvents } from './views/staff/MaintenanceView.js';
// Manager / Admin — full operations command center
import { renderAdminManagerView, bindAdminManagerEvents } from './views/admin/AdminManagerView.js';

let isFrameFullscreen = false;

function renderApp() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  const state       = store.state;
  const currentView = state.currentView;
  const currentMode = state.currentMode;

  let viewHtml      = '';
  let bindViewEvents = () => {};

  if (currentMode === 'admin' || currentView.startsWith('admin-')) {
    // ─── MANAGER / EXECUTIVE PORTAL ───────────────────
    viewHtml       = renderAdminManagerView(state);
    bindViewEvents = bindAdminManagerEvents;

  } else if (currentMode === 'staff') {
    // ─── STAFF PERSONAL WORKSPACE ─────────────────────
    switch (currentView) {
      case 'staff-tasks':
        viewHtml       = renderTaskQueueView(state);
        bindViewEvents = bindTaskQueueEvents;
        break;
      case 'staff-maintenance':
        viewHtml       = renderMaintenanceView(state);
        bindViewEvents = bindMaintenanceEvents;
        break;
      case 'staff-personal':
      default:
        viewHtml       = renderStaffPersonalView(state);
        bindViewEvents = bindStaffPersonalEvents;
    }

  } else {
    // ─── GUEST PORTAL ─────────────────────────────────
    switch (currentView) {
      case 'dining':
        viewHtml       = renderDiningMenuView(state);
        bindViewEvents = bindDiningMenuEvents;
        break;
      case 'checkout':
        viewHtml       = renderCheckoutView(state);
        bindViewEvents = bindCheckoutEvents;
        break;
      case 'order-tracking':
        viewHtml       = renderOrderTrackingView(state);
        bindViewEvents = bindOrderTrackingEvents;
        break;
      case 'chat':
        viewHtml       = renderChatView();
        bindViewEvents = bindChatEvents;
        break;
      case 'services':
      case 'schedule-service':
        viewHtml       = renderScheduleServiceView(state);
        bindViewEvents = bindScheduleServiceEvents;
        break;
      case 'report-issue':
        viewHtml       = renderReportIssueView(state);
        bindViewEvents = bindReportIssueEvents;
        break;
      case 'guest-requests':
        viewHtml       = renderGuestRequestsView(state);
        bindViewEvents = bindGuestRequestsEvents;
        break;
      case 'guest-home':
      default:
        viewHtml       = renderGuestHomeView(state);
        bindViewEvents = bindGuestHomeEvents;
    }
  }

  appContainer.innerHTML = `
    <!-- Preview Switcher Bar -->
    <div class="preview-control-bar">
      <button class="preview-pill-btn ${!isFrameFullscreen ? 'active' : ''}" id="toggle-frame-mode-btn">
        <span class="material-symbols-outlined" style="font-size: 16px;">smartphone</span>
        Mobile Frame
      </button>
      <button class="preview-pill-btn ${isFrameFullscreen ? 'active' : ''}" id="toggle-full-mode-btn">
        <span class="material-symbols-outlined" style="font-size: 16px;">fullscreen</span>
        Fluid View
      </button>
    </div>

    <div class="app-viewport-wrapper ${isFrameFullscreen ? 'frame-fullscreen' : ''}">
      <div class="mobile-device-frame">
        <!-- Phone Status Bar -->
        <div class="phone-status-bar">
          <span class="phone-status-time">9:41</span>
          <div class="device-notch"></div>
          <div class="phone-status-icons">
            <span class="material-symbols-outlined" style="font-size: 14px;">signal_cellular_alt</span>
            <span class="material-symbols-outlined" style="font-size: 14px;">wifi</span>
            <span class="material-symbols-outlined" style="font-size: 16px;">battery_full</span>
          </div>
        </div>
        ${renderHeader(state)}
        ${viewHtml}
        ${renderBottomNav(state)}
        ${renderModalSheet(state)}
      </div>
    </div>
  `;

  // Bind Events
  bindHeaderEvents();
  bindBottomNavEvents();
  bindModalEvents();
  bindViewEvents();

  // Frame toggle events
  const frameBtn = document.getElementById('toggle-frame-mode-btn');
  const fullBtn  = document.getElementById('toggle-full-mode-btn');
  if (frameBtn) frameBtn.addEventListener('click', () => { isFrameFullscreen = false; renderApp(); });
  if (fullBtn)  fullBtn.addEventListener('click',  () => { isFrameFullscreen = true;  renderApp(); });
}

// Initial mount & state subscription
document.addEventListener('DOMContentLoaded', () => {
  // Default staff landing page = personal duties
  if (store.state.currentMode === 'staff' && !['staff-personal','staff-tasks','staff-maintenance'].includes(store.state.currentView)) {
    store.state.currentView = 'staff-personal';
  }
  renderApp();
  store.subscribe(() => renderApp());
});
