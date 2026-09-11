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

        <div class="flex items-center gap-1">
          <button class="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors relative flex items-center justify-center" title="Notifications">
            <span class="material-symbols-outlined text-[20px]">notifications</span>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <button id="btn-header-help" class="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors flex items-center justify-center" title="Terminal Guide">
            <span class="material-symbols-outlined text-[20px]">help</span>
          </button>
        </div>

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

  // Close all dropdowns on outside click
  document.addEventListener('click', () => {
    closeAllHeaderDropdowns();
  });

  function closeAllHeaderDropdowns() {
    if (wsDropdown) wsDropdown.classList.add('hidden');
    if (propDropdown) propDropdown.classList.add('hidden');
    if (userDropdown) userDropdown.classList.add('hidden');
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
