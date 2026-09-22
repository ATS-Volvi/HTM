// ==========================================================================
// VOLVITECH HOSPITALITY OS — ACTIVE WORKSPACE SHELL
// Departmental Router for Authorized Modules Outside Front Desk
// ==========================================================================
import { store } from '../../state/store.js';
import { renderHousekeepingView, bindHousekeepingEvents } from '../HousekeepingView.js';
import { renderMaintenanceView, bindMaintenanceEvents } from '../MaintenanceView.js';
import { renderFBRecipeCostingView, bindFBRecipeCostingEvents } from '../FBRecipeCostingView.js';
import { renderInventoryProcurementView, bindInventoryProcurementEvents } from '../InventoryProcurementView.js';
import { renderExecutiveDashboardView, bindExecutiveDashboardEvents } from '../ExecutiveDashboardView.js';
import { FoodBeverageView } from '../fb/FoodBeverageView.js';

export function renderActiveWorkspace(workspaceId, state) {
  const currentWs = (state.authorizedWorkspaces || []).find((w) => w.id === workspaceId) || {
    id: workspaceId,
    name: workspaceId.replace(/_/g, ' '),
    category: 'OPERATIONS',
    icon: 'apps',
    description: 'Central Hotel Management Module',
    functions: ['Core Database Access', 'Telemetry Reporting'],
  };

  // Route to existing operational modules if implemented
  if (workspaceId === 'HOUSEKEEPING') {
    return {
      html: `<div class="max-w-7xl mx-auto py-4">${renderHousekeepingView(state)}</div>`,
      bindEvents: bindHousekeepingEvents,
    };
  }

  if (workspaceId === 'MAINTENANCE') {
    return {
      html: `<div class="max-w-7xl mx-auto py-4">${renderMaintenanceView(state)}</div>`,
      bindEvents: bindMaintenanceEvents,
    };
  }

  if (workspaceId === 'FOOD_BEVERAGE' || workspaceId === 'RESTAURANT_POS' || workspaceId === 'FB' || workspaceId === 'RECIPE_MGMT') {
    const fbView = new FoodBeverageView();
    const rendered = fbView.render();
    return {
      html: `<div class="max-w-7xl mx-auto py-4" id="fb-view-container">${rendered.innerHTML}</div>`,
      bindEvents: () => {
        fbView.container = document.getElementById('fb-view-container');
        fbView.bindEvents();
      },
    };
  }

  if (workspaceId === 'INVENTORY' || workspaceId === 'PROCUREMENT') {
    return {
      html: `<div class="max-w-7xl mx-auto py-4">${renderInventoryProcurementView(state)}</div>`,
      bindEvents: bindInventoryProcurementEvents,
    };
  }

  if (workspaceId === 'FINANCIAL_ACCOUNTING' || workspaceId === 'ADMINISTRATION') {
    return {
      html: `<div class="max-w-7xl mx-auto py-4">${renderExecutiveDashboardView(state)}</div>`,
      bindEvents: bindExecutiveDashboardEvents,
    };
  }

  // Generic Connected Module Hub for other authorized workspaces
  const prop = state.currentProperty || { name: 'The Grand Astoria Palm & Resort' };

  return {
    html: `
      <div class="max-w-5xl mx-auto py-12 px-4 animate-fadeIn">
        
        <!-- Breadcrumb & Top Bar -->
        <div class="flex items-center justify-between gap-4 mb-6">
          <div class="flex items-center gap-2 text-xs font-data-mono text-on-surface-variant">
            <button id="btn-shell-back-selector" class="hover:text-primary transition-colors flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>All Workspaces</span>
            </button>
            <span>/</span>
            <span class="text-primary font-bold">${currentWs.name}</span>
          </div>

          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-status-clean animate-pulse"></span>
            <span class="text-[11px] font-data-mono text-on-surface-variant font-medium">Spine Connected: ${prop.name}</span>
          </div>
        </div>

        <!-- Module Header Hero -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm relative overflow-hidden mb-8">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div class="flex items-start gap-4">
              <div class="w-16 h-16 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-md shrink-0">
                <span class="material-symbols-outlined text-[32px]">${currentWs.icon || 'apps'}</span>
              </div>
              <div>
                <div class="flex items-center gap-2.5">
                  <h1 class="font-headline-lg text-2xl font-bold text-primary tracking-tight">${currentWs.name}</h1>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-label-caps font-bold bg-primary-fixed text-primary">
                    ${currentWs.category || 'ENTERPRISE'}
                  </span>
                </div>
                <p class="font-body-md text-xs text-on-surface-variant mt-1.5 max-w-xl">
                  ${currentWs.description || 'Departmental enterprise operating interface connected to the unified PostgreSQL backend spine.'}
                </p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2.5">
              <button id="btn-shell-go-frontdesk" class="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-label-caps font-bold hover:bg-primary-container transition-all flex items-center gap-1.5 shadow-sm">
                <span class="material-symbols-outlined text-[16px]">concierge</span>
                <span>Open Front Desk</span>
              </button>
              <button id="btn-shell-open-selector" class="px-4 py-2 bg-surface-container rounded-lg text-xs font-label-caps font-bold text-on-surface hover:bg-surface-container-high border border-outline-variant transition-colors flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">grid_view</span>
                <span>Switch Workspace</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Module Telemetry & Functions -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs">
            <div class="text-[11px] font-label-caps font-bold text-secondary uppercase tracking-wider mb-2">Relational Spine Status</div>
            <div class="text-xl font-bold text-primary font-data-mono">LIVE CONNECTED</div>
            <div class="text-[11px] text-on-surface-variant mt-1">Shared schema with Front Office folios & reservations</div>
          </div>

          <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs">
            <div class="text-[11px] font-label-caps font-bold text-secondary uppercase tracking-wider mb-2">Operating Role</div>
            <div class="text-xl font-bold text-primary">${state.currentUser ? state.currentUser.roleName : 'Staff'}</div>
            <div class="text-[11px] text-on-surface-variant mt-1">Full departmental permissions authorized</div>
          </div>

          <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-xs">
            <div class="text-[11px] font-label-caps font-bold text-secondary uppercase tracking-wider mb-2">Property Scope</div>
            <div class="text-base font-bold text-primary truncate">${prop.name}</div>
            <div class="text-[11px] text-on-surface-variant mt-1">${prop.location || 'Central Domain'}</div>
          </div>
        </div>

        <!-- Departmental Functions Checklist -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-xs">
          <h2 class="font-headline-sm text-sm font-bold text-primary mb-3">Module Functional Scope</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${(currentWs.functions || []).map((f) => `
              <div class="flex items-center gap-2 p-2.5 rounded-lg bg-surface-bright border border-outline-variant text-xs text-on-surface">
                <span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                <span>${f}</span>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `,
    bindEvents: () => {
      const backBtn = document.getElementById('btn-shell-back-selector');
      if (backBtn) backBtn.onclick = () => store.openWorkspaceSelector();

      const openSelBtn = document.getElementById('btn-shell-open-selector');
      if (openSelBtn) openSelBtn.onclick = () => store.openWorkspaceSelector();

      const fdBtn = document.getElementById('btn-shell-go-frontdesk');
      if (fdBtn) fdBtn.onclick = () => store.selectWorkspace('FRONT_DESK');
    },
  };
}
