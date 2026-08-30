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
import { renderSupervisorRoomGridView, bindSupervisorRoomGridEvents } from './views/staff/SupervisorRoomGridView.js';
import { renderTaskQueueView, bindTaskQueueEvents } from './views/staff/TaskQueueView.js';
import { renderMaintenanceView, bindMaintenanceEvents } from './views/staff/MaintenanceView.js';
import { renderInventoryView, bindInventoryEvents } from './views/staff/InventoryView.js';
import { renderShiftScheduleView, bindShiftScheduleEvents } from './views/staff/ShiftScheduleView.js';
import { renderAdminManagerView, bindAdminManagerEvents } from './views/admin/AdminManagerView.js';

let isFrameFullscreen = false;

function renderApp() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  const state = store.state;
  const currentView = state.currentView;
  const currentMode = state.currentMode;

  let viewHtml = '';
  let bindViewEvents = () => {};

  if (currentMode === 'admin' || currentView.startsWith('admin-')) {
    viewHtml = renderAdminManagerView(state);
    bindViewEvents = bindAdminManagerEvents;
  } else {
    switch (currentView) {
      case 'guest-home':
        viewHtml = renderGuestHomeView(state);
        bindViewEvents = bindGuestHomeEvents;
        break;
      case 'dining':
        viewHtml = renderDiningMenuView(state);
        bindViewEvents = bindDiningMenuEvents;
        break;
      case 'checkout':
        viewHtml = renderCheckoutView(state);
        bindViewEvents = bindCheckoutEvents;
        break;
      case 'order-tracking':
        viewHtml = renderOrderTrackingView(state);
        bindViewEvents = bindOrderTrackingEvents;
        break;
      case 'schedule-service':
        viewHtml = renderScheduleServiceView(state);
        bindViewEvents = bindScheduleServiceEvents;
        break;
      case 'report-issue':
        viewHtml = renderReportIssueView(state);
        bindViewEvents = bindReportIssueEvents;
        break;
      case 'guest-requests':
        viewHtml = renderGuestRequestsView(state);
        bindViewEvents = bindGuestRequestsEvents;
        break;
      case 'staff-rooms':
        viewHtml = renderSupervisorRoomGridView(state);
        bindViewEvents = bindSupervisorRoomGridEvents;
        break;
      case 'staff-tasks':
        viewHtml = renderTaskQueueView(state);
        bindViewEvents = bindTaskQueueEvents;
        break;
      case 'staff-maintenance':
        viewHtml = renderMaintenanceView(state);
        bindViewEvents = bindMaintenanceEvents;
        break;
      case 'staff-inventory':
        viewHtml = renderInventoryView(state);
        bindViewEvents = bindInventoryEvents;
        break;
      case 'staff-shifts':
        viewHtml = renderShiftScheduleView(state);
        bindViewEvents = bindShiftScheduleEvents;
        break;
      default:
        viewHtml = renderGuestHomeView(state);
        bindViewEvents = bindGuestHomeEvents;
    }
  }

  appContainer.innerHTML = `
    <!-- Floating Frame / Preview Switcher for Desktop / Mobile -->
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

  // Bind frame switcher events
  const frameBtn = document.getElementById('toggle-frame-mode-btn');
  const fullBtn = document.getElementById('toggle-full-mode-btn');
  if (frameBtn) {
    frameBtn.addEventListener('click', () => {
      isFrameFullscreen = false;
      renderApp();
    });
  }
  if (fullBtn) {
    fullBtn.addEventListener('click', () => {
      isFrameFullscreen = true;
      renderApp();
    });
  }
}

// Initial mount & subscription
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  store.subscribe(() => {
    renderApp();
  });
});
