// ==========================================================================
// VOLVITECH HOSPITALITY OS — UNIFIED ENTERPRISE TOPBAR & WORKSPACE SWITCHER
// Primary UI/UX Source: Google Stitch Project "Front Office Reservation System"
// ==========================================================================
import { store } from '../state/store.js';
import { NewBookingModal } from '../views/frontoffice/NewBookingModal.js';
import { Toast } from './Toast.js';

export function renderHeader(state) {
  const user = state.currentUser || {
    fullName: 'Julian Croft',
    roleName: 'Front Desk Agent',
    avatarInitials: 'JC',
  };

  const prop = state.currentProperty || {
    name: 'The Grand Meridian',
    location: 'Grand Meridian Boulevard',
  };
  const properties = state.availableProperties || [prop];

  const activeWsId = state.activeWorkspace || 'FRONT_DESK';
  const authorizedWs = state.authorizedWorkspaces || [];
  const currentWs = authorizedWs.find((w) => w.id === activeWsId) || {
    id: 'FRONT_DESK',
    name: 'Front Desk',
    icon: 'concierge',
  };

  return `
    <header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface-container-lowest border-b border-outline-variant shadow-xs">
      <!-- Left: Logo & Switchers -->
      <div class="flex items-center gap-4 lg:gap-6">
        <!-- Brand Logo -->
        <div class="flex items-center gap-2.5 cursor-pointer select-none" id="btn-brand-home" title="Return to Workspace Home">
          <span class="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-base shadow-sm">V</span>
          <div class="font-headline-sm text-lg font-bold text-primary tracking-tight">
            VOLVITECH <span class="text-[10px] text-secondary tracking-widest font-data-mono font-bold uppercase ml-0.5">OS</span>
          </div>
        </div>

        <div class="h-5 w-[1px] bg-outline-variant hidden sm:block"></div>

        <!-- 1. PERSISTENT WORKSPACE SWITCHER DROPDOWN -->
        <div class="relative">
          <button 
            id="btn-header-workspace-switch" 
            class="flex items-center gap-2 px-3 py-1.5 bg-surface-container-high hover:bg-surface-container rounded-lg border border-outline-variant text-xs text-primary font-semibold transition-all shadow-xs"
            title="Switch Operational Workspace"
          >
            <span class="material-symbols-outlined text-[18px] text-primary">${currentWs.icon || 'desktop_windows'}</span>
            <span class="font-bold text-xs tracking-tight">${currentWs.name}</span>
            <span class="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_drop_down</span>
          </button>

          <!-- Workspace Dropdown Menu -->
          <div 
            id="dropdown-header-workspaces" 
            class="hidden absolute left-0 top-full mt-1.5 w-72 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl p-2 z-50 animate-fadeIn"
          >
            <div class="px-2 py-1 text-[10px] font-label-caps font-bold text-on-surface-variant uppercase tracking-wider flex items-center justify-between">
              <span>Authorized Workspaces</span>
              <span class="font-data-mono text-secondary">${authorizedWs.length} active</span>
            </div>

            <div class="max-h-72 overflow-y-auto space-y-1 py-1">
              ${authorizedWs.map((ws) => `
                <button 
                  class="btn-select-hdr-ws w-full text-left p-2 rounded-lg hover:bg-surface-container transition-colors flex items-center justify-between text-xs ${ws.id === activeWsId ? 'bg-primary-fixed/40 font-bold text-primary' : 'text-on-surface'}" 
                  data-wsid="${ws.id}"
                >
                  <div class="flex items-center gap-2.5 truncate">
                    <span class="material-symbols-outlined text-[18px] ${ws.id === activeWsId ? 'text-primary' : 'text-on-surface-variant'}">${ws.icon || 'circle'}</span>
                    <div class="truncate">
                      <div class="truncate leading-tight">${ws.name}</div>
                      <div class="text-[10px] text-on-surface-variant font-data-mono truncate">${ws.category ? ws.category.replace('_', ' ') : ''}</div>
                    </div>
                  </div>
                  ${ws.id === activeWsId ? `<span class="material-symbols-outlined text-primary text-[16px]">check</span>` : ''}
                </button>
              `).join('')}
            </div>

            <div class="border-t border-outline-variant pt-1.5 mt-1">
              <button 
                id="btn-open-full-workspace-selector" 
                class="w-full text-left p-2 rounded-lg hover:bg-surface-container transition-colors flex items-center gap-2 text-xs font-label-caps font-bold text-primary"
              >
                <span class="material-symbols-outlined text-[18px]">grid_view</span>
                <span>Switch Workspace (All Modules)</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 2. GLOBAL PROPERTY CONTEXT DROPDOWN -->
        <div class="relative hidden md:block">
          <button 
            id="btn-header-property-switch" 
            class="flex items-center gap-2 px-3 py-1.5 bg-surface-container-high hover:bg-surface-container rounded-lg border border-outline-variant text-xs text-primary font-medium transition-all shadow-xs"
            title="Switch Operating Property"
          >
            <span class="material-symbols-outlined text-[16px] text-secondary">apartment</span>
            <span class="font-bold text-xs truncate max-w-[180px]">${prop.name}</span>
            <span class="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_drop_down</span>
          </button>

          <!-- Property Dropdown Menu -->
          <div 
            id="dropdown-header-properties" 
            class="hidden absolute left-0 top-full mt-1.5 w-72 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl p-2 z-50 animate-fadeIn"
          >
            <div class="text-[10px] font-label-caps font-bold text-on-surface-variant uppercase px-2 py-1">Operating Properties</div>
            <div class="space-y-1 py-1">
              ${properties.map((p) => `
                <button 
                  class="btn-select-hdr-prop w-full text-left p-2 rounded-lg hover:bg-surface-container transition-colors flex items-center justify-between text-xs ${p.id === prop.id ? 'bg-primary-fixed/40 font-bold text-primary' : 'text-on-surface'}" 
                  data-propid="${p.id}"
                >
                  <div>
                    <div class="font-medium">${p.name}</div>
                    <div class="text-[10px] text-on-surface-variant font-data-mono">${p.location || ''}</div>
                  </div>
                  ${p.id === prop.id ? `<span class="material-symbols-outlined text-primary text-[16px]">check</span>` : ''}
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Global Search Input -->
        <div class="hidden xl:flex items-center bg-surface-container-high rounded-full px-4 py-1.5 w-64 border border-outline-variant focus-within:border-primary transition-colors">
          <span class="material-symbols-outlined text-on-surface-variant mr-2 text-[18px]">search</span>
          <input 
            id="global-search-input" 
            class="bg-transparent border-none focus:ring-0 text-xs font-body-sm w-full p-0 text-on-surface placeholder:text-on-surface-variant" 
            placeholder="Search guests, reservations..." 
            type="text"
          />
        </div>
      </div>

      <!-- Right: Action CTA & Profile Dropdown -->
      <div class="flex items-center gap-3">
        ${
          activeWsId === 'FRONT_DESK'
            ? `
          <button id="btn-topbar-create-booking" class="hidden sm:flex items-center justify-center bg-primary text-on-primary px-3.5 py-1.5 rounded-lg font-label-caps text-xs font-bold hover:bg-primary-container transition-all shadow-sm">
            <span class="material-symbols-outlined mr-1 text-[16px]">add</span>
            Create Booking
          </button>
        `
            : ''
        }

        <!-- Real-Time Service & Arrival Triggers Notification Center -->
        <div class="relative">
          <button 
            id="btn-header-notifications" 
            class="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors relative flex items-center justify-center cursor-pointer" 
            title="Real-Time Triggers & Notifications"
          >
            <span class="material-symbols-outlined text-[20px]">notifications</span>
            ${(() => {
              const activeCount = store.getActiveTriggerCount ? store.getActiveTriggerCount() : 0;
              if (activeCount <= 0) return '';
              return `
                <span class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-error text-[10px] font-bold font-data-mono text-on-error rounded-full flex items-center justify-center shadow-xs animate-pulse">
                  ${activeCount}
                </span>
                <span class="absolute top-0 right-0 w-2.5 h-2.5 bg-error rounded-full animate-ping opacity-75"></span>
              `;
            })()}
          </button>

          <!-- Triggers Dropdown Menu -->
          <div 
            id="dropdown-header-notifications" 
            class="hidden absolute right-0 top-full mt-2 w-96 sm:w-[420px] bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl z-50 animate-fadeIn overflow-hidden flex flex-col"
          >
            <!-- Dropdown Header -->
            <div class="p-3.5 bg-surface-bright border-b border-outline-variant/70 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-[20px]">campaign</span>
                <div>
                  <h4 class="text-xs font-bold text-primary leading-tight">Live Service & Arrival Triggers</h4>
                  <p class="text-[10px] text-on-surface-variant font-medium">Immediate Alerts • Time-Sensitive</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button 
                  id="btn-header-test-chime" 
                  class="px-2 py-1 text-on-surface-variant hover:text-primary rounded-lg text-[10px] flex items-center gap-1 font-semibold hover:bg-surface-container transition-colors cursor-pointer"
                  title="Test Sound Chime"
                >
                  <span class="material-symbols-outlined text-[15px] text-primary">volume_up</span>
                  <span>Chime</span>
                </button>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold font-data-mono bg-amber-100 text-amber-900 border border-amber-300">
                  ${store.getActiveTriggerCount ? store.getActiveTriggerCount() : 0} Active
                </span>
              </div>
            </div>

            <!-- Triggers List -->
            <div class="max-h-[380px] overflow-y-auto divide-y divide-outline-variant/40" id="header-triggers-list">
              ${(() => {
                const triggers = store.getServiceTriggers ? store.getServiceTriggers() : [];
                if (!triggers || triggers.length === 0) {
                  return `
                    <div class="p-8 text-center text-xs text-on-surface-variant">
                      <span class="material-symbols-outlined text-3xl text-on-surface-variant/50 mb-1">notifications_off</span>
                      <p>No active service or arrival triggers right now.</p>
                    </div>
                  `;
                }

                return triggers.map(t => {
                  const isUrgent = t.alertUrgency === 'URGENT';
                  const isHigh = t.alertUrgency === 'HIGH';
                  const isPending = t.status === 'Pending';
                  const isTransport = t.triggerType === 'TRANSPORT';
                  const isLaundry = t.triggerType === 'LAUNDRY';
                  
                  const icon = t.triggerIcon || (isTransport ? 'directions_car' : (isLaundry ? 'local_laundry_service' : 'room_service'));
                  const colorClass = isUrgent ? 'text-rose-600 bg-rose-50 border-rose-200' : (isHigh ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-amber-600 bg-amber-50 border-amber-200');
                  const badgeClass = isUrgent ? 'bg-rose-100 text-rose-800' : (isHigh ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800');

                  return `
                    <div class="p-3 hover:bg-surface-container-low/80 transition-colors flex flex-col gap-2 relative ${t.triggerStatus === 'ACTIVE_TRIGGER' ? 'bg-surface-bright/70' : ''}">
                      <div class="flex items-start justify-between gap-2">
                        <div class="flex items-start gap-2.5">
                          <div class="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${colorClass}">
                            <span class="material-symbols-outlined text-[18px]">${icon}</span>
                          </div>
                          <div>
                            <div class="flex items-center gap-1.5 flex-wrap">
                              <span class="text-xs font-bold text-primary">${t.guestName}</span>
                              <span class="text-[10px] text-on-surface-variant font-data-mono font-semibold">
                                ${t.roomNumber ? `(Room #${t.roomNumber})` : ''}
                              </span>
                            </div>
                            <p class="text-[11px] text-on-surface font-medium mt-0.5 line-clamp-2">${t.details}</p>
                          </div>
                        </div>
                        <span class="px-2 py-0.5 rounded-full text-[9px] font-bold font-data-mono shrink-0 uppercase tracking-wider ${badgeClass}">
                          ${t.triggerBadge || t.alertUrgency}
                        </span>
                      </div>

                      <div class="flex items-center justify-between gap-2 pt-1 border-t border-outline-variant/30 text-[10px]">
                        <div class="flex items-center gap-1 text-primary font-bold">
                          <span class="material-symbols-outlined text-[14px] text-amber-600">schedule</span>
                          <span>${t.timingTrigger || t.allottedWindow}</span>
                        </div>

                        <div class="flex items-center gap-1.5">
                          ${t.triggerStatus === 'ACTIVE_TRIGGER' ? `
                            <button class="btn-hdr-ack-trigger px-2 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-[10px] cursor-pointer transition-colors" data-id="${t.id}">
                              Acknowledge
                            </button>
                          ` : ''}
                          ${isPending ? `
                            <button class="btn-hdr-dispatch-trigger px-2.5 py-1 rounded-md bg-primary hover:bg-primary/90 text-on-primary font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors" data-id="${t.id}">
                              <span class="material-symbols-outlined text-[12px]">send</span>
                              <span>Dispatch</span>
                            </button>
                          ` : `
                            <span class="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">In Progress</span>
                          `}
                        </div>
                      </div>
                    </div>
                  `;
                }).join('');
              })()}
            </div>

            <!-- Dropdown Footer -->
            <div class="p-2.5 bg-surface-bright/80 border-t border-outline-variant/70 flex items-center justify-between">
              <button 
                id="btn-simulate-header-trigger"
                class="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-[11px] font-semibold text-primary flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span class="material-symbols-outlined text-[15px] text-amber-600">electric_bolt</span>
                <span>Simulate Guest Trigger</span>
              </button>

              <button 
                id="btn-view-all-services-hdr"
                class="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-[11px] font-bold flex items-center gap-1 hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <span>Services Workspace</span>
                <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        <button id="btn-header-help" class="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors flex items-center justify-center cursor-pointer" title="Terminal Guide">
          <span class="material-symbols-outlined text-[20px]">help</span>
        </button>

        <!-- 3. USER PROFILE & LOGOUT DROPDOWN -->
        <div class="relative border-l border-outline-variant pl-3">
          <button 
            id="btn-header-user-profile" 
            class="flex items-center gap-2 hover:bg-surface-container p-1 rounded-lg transition-colors text-left"
          >
            <div class="h-8 w-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-xs font-data-mono border border-outline-variant shadow-sm">
              ${user.avatarInitials || 'US'}
            </div>
            <div class="hidden lg:block">
              <div class="text-xs font-bold text-primary leading-tight">${user.fullName}</div>
              <div class="text-[10px] text-on-surface-variant font-data-mono">${user.roleName}</div>
            </div>
            <span class="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_drop_down</span>
          </button>

          <!-- User Menu Dropdown -->
          <div 
            id="dropdown-header-user" 
            class="hidden absolute right-0 top-full mt-1.5 w-60 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-2xl p-2 z-50 animate-fadeIn"
          >
            <div class="px-3 py-2 border-b border-outline-variant mb-1">
              <div class="text-xs font-bold text-primary">${user.fullName}</div>
              <div class="text-[10px] text-on-surface-variant font-data-mono">${user.roleName}</div>
              <div class="text-[10px] text-secondary font-data-mono mt-0.5">Terminal 01 • Station Active</div>
            </div>

            <button 
              id="btn-user-menu-switch-workspace" 
              class="w-full text-left p-2 rounded-lg hover:bg-surface-container transition-colors flex items-center gap-2.5 text-xs text-on-surface"
            >
              <span class="material-symbols-outlined text-[18px] text-primary">apps</span>
              <span>All Workspaces</span>
            </button>

            <button 
              id="btn-user-menu-signout" 
              class="w-full text-left p-2 rounded-lg hover:bg-error-container/30 hover:text-error transition-colors flex items-center gap-2.5 text-xs text-on-surface mt-1"
            >
              <span class="material-symbols-outlined text-[18px] text-error">logout</span>
              <span class="text-error font-medium">Sign Out</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  `;
}

export function bindHeaderEvents() {
  // Brand Click -> Open Workspace Selector or go to Front Desk
  const brandBtn = document.getElementById('btn-brand-home');
  if (brandBtn) {
    brandBtn.addEventListener('click', () => {
      store.openWorkspaceSelector();
    });
  }

  // 1. Workspace Switcher Dropdown
  const wsBtn = document.getElementById('btn-header-workspace-switch');
  const wsDropdown = document.getElementById('dropdown-header-workspaces');
  if (wsBtn && wsDropdown) {
    wsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllHeaderDropdowns();
      wsDropdown.classList.toggle('hidden');
    });

    // Selecting a workspace
    document.querySelectorAll('.btn-select-hdr-ws').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const wsid = btn.dataset.wsid;
        wsDropdown.classList.add('hidden');
        store.selectWorkspace(wsid);
        Toast.show({
          title: 'Workspace Switched',
          message: `Switched to workspace: ${wsid}`,
          type: 'info',
        });
      });
    });

    // "Switch Workspace (All Modules)"
    const allWsBtn = document.getElementById('btn-open-full-workspace-selector');
    if (allWsBtn) {
      allWsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        wsDropdown.classList.add('hidden');
        store.openWorkspaceSelector();
      });
    }
  }

  // 2. Property Switcher Dropdown
  const propBtn = document.getElementById('btn-header-property-switch');
  const propDropdown = document.getElementById('dropdown-header-properties');
  if (propBtn && propDropdown) {
    propBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllHeaderDropdowns();
      propDropdown.classList.toggle('hidden');
    });

    // Selecting a property
    document.querySelectorAll('.btn-select-hdr-prop').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const propId = btn.dataset.propid;
        propDropdown.classList.add('hidden');
        store.switchProperty(propId);
        Toast.show({
          title: 'Operating Property Changed',
          message: `Switched context to ${store.state.currentProperty.name}`,
          type: 'success',
        });
      });
    });
  }

  // 3. User Profile Dropdown
  const userBtn = document.getElementById('btn-header-user-profile');
  const userDropdown = document.getElementById('dropdown-header-user');
  if (userBtn && userDropdown) {
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllHeaderDropdowns();
      userDropdown.classList.toggle('hidden');
    });

    const menuWsBtn = document.getElementById('btn-user-menu-switch-workspace');
    if (menuWsBtn) {
      menuWsBtn.addEventListener('click', () => {
        userDropdown.classList.add('hidden');
        store.openWorkspaceSelector();
      });
    }

    const signoutBtn = document.getElementById('btn-user-menu-signout');
    if (signoutBtn) {
      signoutBtn.addEventListener('click', () => {
        userDropdown.classList.add('hidden');
        store.logoutUser();
        Toast.show({
          title: 'Signed Out',
          message: 'Session terminated. Returned to login screen.',
          type: 'info',
        });
      });
    }
  }

  // 4. Notifications & Live Triggers Dropdown
  const notifBtn = document.getElementById('btn-header-notifications');
  const notifDropdown = document.getElementById('dropdown-header-notifications');
  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isCurrentlyHidden = notifDropdown.classList.contains('hidden');
      closeAllHeaderDropdowns();
      if (isCurrentlyHidden) {
        notifDropdown.classList.remove('hidden');
      } else {
        notifDropdown.classList.add('hidden');
      }
    });

    // Prevent clicks inside the dropdown from closing it
    notifDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Test sound chime
    const testChimeBtn = document.getElementById('btn-header-test-chime');
    if (testChimeBtn) {
      testChimeBtn.addEventListener('click', () => {
        store.playChime();
        Toast.show({
          title: 'Concierge Alert Chime',
          message: 'Audio alert signal tested successfully',
          type: 'info'
        });
      });
    }

    // Acknowledge trigger buttons
    notifDropdown.querySelectorAll('.btn-hdr-ack-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.dataset.id;
        store.acknowledgeServiceTrigger(id);
      });
    });

    // Dispatch trigger buttons
    notifDropdown.querySelectorAll('.btn-hdr-dispatch-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.dataset.id;
        store.dispatchServiceTrigger(id);
      });
    });

    // Simulate guest trigger button
    const simBtn = document.getElementById('btn-simulate-header-trigger');
    if (simBtn) {
      simBtn.addEventListener('click', () => {
        const sampleTypes = ['transport', 'laundry', 'fnb'];
        const randomChoice = sampleTypes[Math.floor(Math.random() * sampleTypes.length)];
        store.simulateNewServiceTrigger(randomChoice);
      });
    }

    // View All Services Workspace link
    const viewAllBtn = document.getElementById('btn-view-all-services-hdr');
    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', () => {
        notifDropdown.classList.add('hidden');
        store.selectWorkspace('FRONT_DESK');
        store.setNavTab('services');
      });
    }
  }

  // Close all dropdowns on outside click
  document.addEventListener('click', () => {
    closeAllHeaderDropdowns();
  });

  function closeAllHeaderDropdowns() {
    if (wsDropdown) wsDropdown.classList.add('hidden');
    if (propDropdown) propDropdown.classList.add('hidden');
    if (userDropdown) userDropdown.classList.add('hidden');
    if (notifDropdown) notifDropdown.classList.add('hidden');
  }

  // Create Booking CTA
  const createBtn = document.getElementById('btn-topbar-create-booking');
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      const modal = new NewBookingModal({
        onCreated: () => {
          store.notify();
        },
      });
      modal.init().then(() => {
        document.body.appendChild(modal.render());
      });
    });
  }

  // Global search input
  const searchInput = document.getElementById('global-search-input');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        store.selectWorkspace('FRONT_DESK');
        store.setNavTab('reservations');
      }
    });
  }
}
