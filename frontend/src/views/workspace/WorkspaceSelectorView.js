// ==========================================================================
// VOLVITECH HOSPITALITY OS — ENTERPRISE WORKSPACE SELECTOR & LAUNCHER
// Primary UI/UX Source: Google Stitch Screen 'Enterprise Workspace Selector Portal' (b0b95a1d188847ffb515069e4268e242)
// ==========================================================================
import { store } from '../../state/store.js';
import { authClient } from '../../api/authClient.js';
import { Toast } from '../../components/Toast.js';

export class WorkspaceSelectorView {
  constructor() {
    this.container = null;
    this.isLoading = false;
  }

  async loadLatestWorkspaces() {
    const user = store.state.currentUser;
    if (!user) return;

    try {
      const res = await authClient.getWorkspaces(user.roleId);
      if (res.success && res.data) {
        store.state.authorizedWorkspaces = res.data;
        this.renderContent();
      }
    } catch (e) {
      console.warn('[WorkspaceSelectorView] Could not refresh live indicators:', e);
    }
  }

  render() {
    const el = document.createElement('div');
    el.className = 'min-h-screen bg-surface-bright flex flex-col text-on-surface relative overflow-x-hidden';
    this.container = el;

    this.renderContent();
    this.loadLatestWorkspaces();
    return el;
  }

  renderContent() {
    if (!this.container) return;

    const state = store.state;
    const rawUser = state.currentUser || {
      fullName: 'Julian Croft',
      roleName: 'Front Desk Agent',
      avatarInitials: 'JC',
    };

    // Clean user full name (strip any duplicate role in parens)
    const displayName = rawUser.fullName.replace(/\s*\(.*?\)\s*/g, '').trim();

    const prop = state.currentProperty || {
      name: 'The Grand Astoria Palm & Resort',
      location: 'Palm Jumeirah, Dubai',
      code: 'GAP-DXB',
      stars: 5,
    };
    const properties = state.availableProperties || [prop];
    const workspaces = state.authorizedWorkspaces || [];

    // Category groupings
    const categoryMeta = {
      CORE_OPERATIONS: { label: 'Core Operations', icon: 'concierge' },
      FOOD_BEVERAGE: { label: 'Food & Beverage', icon: 'restaurant' },
      SUPPLY_CHAIN: { label: 'Supply Chain & Procurement', icon: 'inventory' },
      BUSINESS: { label: 'Business, CRM & Finance', icon: 'monitoring' },
      ADMINISTRATION: { label: 'Administration & Governance', icon: 'admin_panel_settings' },
    };

    const categoriesOrder = ['CORE_OPERATIONS', 'FOOD_BEVERAGE', 'SUPPLY_CHAIN', 'BUSINESS', 'ADMINISTRATION'];

    // Group available workspaces by category
    const groupedWorkspaces = {};
    categoriesOrder.forEach((cat) => {
      groupedWorkspaces[cat] = workspaces.filter((ws) => ws.category === cat);
    });

    let cardGlobalIndex = 0;

    this.container.innerHTML = `
      <!-- Ambient Luxury Mesh Background Layer -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,32,69,0.07),transparent)] pointer-events-none"></div>
      <div class="absolute inset-0 bg-[radial-gradient(#c4c6cf_1px,transparent_1px)] [background-size:28px_28px] opacity-20 pointer-events-none"></div>

      <!-- Top Enterprise Navigation Bar -->
      <nav class="w-full bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant px-6 py-3.5 flex flex-wrap justify-between items-center gap-4 relative z-30 shadow-xs">
        
        <!-- Brand Logo & Platform Badge -->
        <div class="flex items-center gap-3">
          <span class="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-base shadow-sm border border-outline-variant/50">V</span>
          <div>
            <div class="font-headline-sm text-sm font-bold text-primary leading-tight flex items-center gap-1.5">
              <span>VOLVITECH</span>
              <span class="text-[10px] text-secondary tracking-widest font-data-mono font-bold uppercase px-1.5 py-0.2 rounded bg-surface-container border border-outline-variant">OS</span>
            </div>
            <div class="text-[10px] text-on-surface-variant font-data-mono">Enterprise Hotel Operating Platform</div>
          </div>
        </div>

        <!-- Right Controls: Luxury Property Switcher + User Profile + Logout -->
        <div class="flex items-center gap-3">
          
          <!-- Property Selector Dropdown -->
          <div class="relative">
            <button id="btn-property-switch" class="flex items-center gap-2.5 px-3.5 py-2 bg-surface-container rounded-xl border border-outline-variant text-xs text-primary font-medium hover:bg-surface-container-high transition-all shadow-xs group">
              <span class="material-symbols-outlined text-[18px] text-secondary group-hover:scale-110 transition-transform">apartment</span>
              <div class="text-left">
                <div class="font-bold text-xs truncate max-w-[200px] leading-tight">${prop.name}</div>
                <div class="text-[9px] text-secondary font-data-mono flex items-center gap-1">
                  <span>${prop.code || 'GAP-DXB'}</span>
                  <span>•</span>
                  <span class="text-amber-600 font-bold">5★ Luxury Resort</span>
                </div>
              </div>
              <span class="material-symbols-outlined text-[16px] text-on-surface-variant ml-1">arrow_drop_down</span>
            </button>

            <!-- Dropdown Menu for Properties -->
            <div id="dropdown-properties" class="hidden absolute right-0 top-full mt-2 w-80 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl p-2.5 z-50 animate-fadeIn">
              <div class="text-[10px] font-label-caps font-bold text-on-surface-variant uppercase px-3 py-1.5 flex items-center justify-between border-b border-outline-variant/60 mb-1">
                <span>Authorized Properties</span>
                <span class="font-data-mono text-secondary">${properties.length} Available</span>
              </div>
              <div class="space-y-1">
                ${properties.map((p) => `
                  <button class="btn-select-property w-full text-left p-2.5 rounded-xl hover:bg-surface-container transition-colors flex items-center justify-between text-xs ${p.id === prop.id ? 'bg-primary-fixed/40 font-bold text-primary' : 'text-on-surface'}" data-propid="${p.id}">
                    <div>
                      <div class="font-semibold">${p.name}</div>
                      <div class="text-[10px] text-on-surface-variant font-data-mono mt-0.5">${p.location || 'Luxury Property'}</div>
                    </div>
                    ${p.id === prop.id ? `<span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>` : ''}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- User Badge Pill -->
          <div class="flex items-center gap-2.5 pl-3 border-l border-outline-variant">
            <div class="w-9 h-9 rounded-full bg-primary-fixed text-primary font-data-mono font-bold text-xs flex items-center justify-center border border-outline-variant/60 shadow-xs">
              ${rawUser.avatarInitials || 'US'}
            </div>
            <div class="hidden sm:block text-left">
              <div class="text-xs font-bold text-primary leading-tight">${displayName}</div>
              <div class="text-[10px] text-on-surface-variant font-data-mono font-medium">${rawUser.roleName}</div>
            </div>
          </div>

          <!-- Sign Out -->
          <button id="btn-user-logout" class="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-xl transition-colors flex items-center justify-center ml-1" title="Sign Out">
            <span class="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </nav>

      <!-- Main Workspace Selection Canvas -->
      <main class="flex-1 max-w-7xl mx-auto w-full px-6 py-10 flex flex-col justify-center relative z-10">
        
        <!-- Hero Header with Live Hotel Heartbeat Status (from Stitch) -->
        <header class="text-center max-w-3xl mx-auto mb-12 animate-fadeIn">
          
          <!-- Category / Live Pulse Chip -->
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high/80 border border-outline-variant shadow-xs mb-4">
            <span class="radar-ping-dot text-status-clean"></span>
            <span class="font-label-caps text-[11px] font-bold text-primary uppercase tracking-wider">
              Connected Operational Core
            </span>
          </div>

          <h2 class="font-headline-lg text-3xl md:text-4xl font-bold text-primary tracking-tight">
            Welcome back, ${displayName.split(' ')[0]}.
          </h2>
          
          <p class="font-body-md text-xs md:text-sm text-on-surface-variant mt-2 max-w-xl mx-auto leading-relaxed">
            Select an operational workspace to begin your shift. All departmental modules synchronize in real time through the central PostgreSQL spine.
          </p>

          <!-- Live Heartbeat Metric Bar (Stitch Screen b0b95a1d) -->
          <div class="mt-6 inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-5 py-2.5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-sm text-xs font-data-mono text-on-surface-variant">
            <div class="flex items-center gap-2 text-primary font-bold">
              <span class="material-symbols-outlined text-[18px] text-status-clean">hotel</span>
              <span>32 Keys Active</span>
            </div>
            <span class="w-1 h-1 rounded-full bg-outline-variant hidden sm:block"></span>
            <div class="flex items-center gap-2 text-primary font-bold">
              <span class="material-symbols-outlined text-[18px] text-secondary">trending_up</span>
              <span>96.8% Occupancy</span>
            </div>
            <span class="w-1 h-1 rounded-full bg-outline-variant hidden sm:block"></span>
            <div class="flex items-center gap-2 text-primary font-bold">
              <span class="material-symbols-outlined text-[18px] text-status-clean">check_circle</span>
              <span class="text-status-clean">All Systems Operational</span>
            </div>
          </div>

        </header>

        <!-- Workspaces Organized by Categories -->
        <div class="space-y-12">
          ${categoriesOrder.map((catKey) => {
            const items = groupedWorkspaces[catKey] || [];
            if (items.length === 0) return '';
            const meta = categoryMeta[catKey] || { label: catKey, icon: 'folder' };

            return `
              <div>
                <!-- Category Section Title -->
                <div class="flex items-center gap-3 mb-5">
                  <div class="flex items-center gap-2 font-label-caps text-xs font-bold uppercase tracking-wider text-secondary">
                    <span class="material-symbols-outlined text-[18px]">${meta.icon}</span>
                    <span>${meta.label}</span>
                  </div>
                  <div class="flex-1 h-[1px] bg-gradient-to-r from-outline-variant to-transparent"></div>
                  <span class="text-[11px] font-data-mono px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">
                    ${items.length} ${items.length === 1 ? 'workspace' : 'workspaces'}
                  </span>
                </div>

                <!-- Animated Workspace Cards Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  ${items.map((ws) => {
                    const delay = (cardGlobalIndex++) * 50;
                    const isFrontDesk = ws.id === 'FRONT_DESK';

                    return `
                      <div 
                        class="card-workspace animate-card-stagger group bg-surface-container-lowest/95 backdrop-blur-sm border border-outline-variant/80 hover:border-primary/80 rounded-2xl p-6 shadow-xs hover:shadow-[0_18px_35px_-10px_rgba(0,32,69,0.12)] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between relative overflow-hidden"
                        style="animation-delay: ${delay}ms;"
                        data-wsid="${ws.id}"
                      >
                        <!-- Top subtle accent bar on hover -->
                        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <!-- Card Top: Icon & Live Telemetry -->
                        <div>
                          <div class="flex items-start justify-between gap-3 mb-5">
                            
                            <!-- Glowing Icon Box -->
                            <div class="w-13 h-13 rounded-2xl bg-gradient-to-br from-surface-container-high to-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary group-hover:scale-105 transition-all duration-300 border border-outline-variant/60 shadow-xs p-3">
                              <span class="material-symbols-outlined text-[28px]">${ws.icon}</span>
                            </div>

                            <!-- Live Telemetry Pill & Status Chip -->
                            <div class="flex flex-col items-end gap-1.5">
                              ${
                                ws.liveBadge
                                  ? `
                                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/60 text-primary font-data-mono font-bold text-[10px] shadow-xs group-hover:border-primary/40 transition-colors">
                                  <span class="radar-ping-dot text-status-clean"></span>
                                  <span>${ws.liveBadge}</span>
                                </span>
                              `
                                  : ''
                              }
                              
                              ${
                                !ws.is_implemented
                                  ? `<span class="px-2 py-0.5 rounded text-[10px] font-label-caps font-semibold bg-surface-container-high text-on-surface-variant border border-outline-variant">
                                       Module In Setup
                                     </span>`
                                  : `<span class="px-2 py-0.5 rounded text-[10px] font-label-caps font-bold bg-status-clean/15 text-status-clean border border-status-clean/30">
                                       Active System
                                     </span>`
                              }
                            </div>
                          </div>

                          <!-- Workspace Title & Description -->
                          <h3 class="font-headline-sm text-lg font-bold text-primary group-hover:text-primary transition-colors tracking-tight">
                            ${ws.name}
                          </h3>
                          <p class="font-body-sm text-xs text-on-surface-variant mt-1.5 line-clamp-2 leading-relaxed">
                            ${ws.description}
                          </p>
                        </div>

                        <!-- Capabilities Tags & Bottom CTA -->
                        <div class="mt-6 pt-4 border-t border-outline-variant/60">
                          <div class="flex flex-wrap gap-1.5 mb-5">
                            ${(ws.functions || []).slice(0, 4).map((f) => `
                              <span class="px-2.5 py-1 rounded-md bg-surface-container/70 group-hover:bg-primary-fixed/40 group-hover:text-primary transition-colors text-[11px] font-body-sm text-on-surface-variant font-medium">
                                ${f}
                              </span>
                            `).join('')}
                          </div>

                          <div class="flex items-center justify-between text-xs font-label-caps font-bold text-primary group-hover:text-primary transition-colors">
                            <span>Enter Workspace</span>
                            <span class="material-symbols-outlined text-[18px] group-hover:translate-x-2 transition-transform duration-200">arrow_forward</span>
                          </div>
                        </div>

                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>

      </main>

      <!-- Bottom Global Footer -->
      <footer class="w-full border-t border-outline-variant/80 py-4 px-6 text-center text-[11px] font-data-mono text-on-surface-variant bg-surface-container-lowest/80 backdrop-blur-xs relative z-20">
        Volvitech Hospitality OS • Enterprise Multi-Property Core • Real-time PostgreSQL Spine
      </footer>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Workspace Cards Click
    this.container.querySelectorAll('.card-workspace').forEach((card) => {
      card.onclick = () => {
        const wsid = card.dataset.wsid;
        if (wsid === 'FRONT_DESK') {
          Toast.show({
            title: 'Entering Front Desk',
            message: 'Loading Front Office Reservation System...',
            type: 'info',
          });
          store.selectWorkspace('FRONT_DESK');
        } else {
          store.selectWorkspace(wsid);
        }
      };
    });

    // Property Dropdown Toggle
    const propBtn = this.container.querySelector('#btn-property-switch');
    const propDropdown = this.container.querySelector('#dropdown-properties');
    if (propBtn && propDropdown) {
      propBtn.onclick = (e) => {
        e.stopPropagation();
        propDropdown.classList.toggle('hidden');
      };

      document.addEventListener('click', () => {
        propDropdown.classList.add('hidden');
      });
    }

    // Property Selection
    this.container.querySelectorAll('.btn-select-property').forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const propId = btn.dataset.propid;
        store.switchProperty(propId);
        Toast.show({
          title: 'Property Context Changed',
          message: `Active property set to ${store.state.currentProperty.name}`,
          type: 'success',
        });
        if (propDropdown) propDropdown.classList.add('hidden');
        this.renderContent();
      };
    });

    // Logout Button
    const logoutBtn = this.container.querySelector('#btn-user-logout');
    if (logoutBtn) {
      logoutBtn.onclick = () => {
        store.logoutUser();
        Toast.show({
          title: 'Signed Out',
          message: 'Session closed successfully.',
          type: 'info',
        });
      };
    }
  }
}
