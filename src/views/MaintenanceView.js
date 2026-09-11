// ==========================================================================
// VOLVITECH HOSPITALITY OS — MAINTENANCE & ENGINEERING OPERATIONS HUB
// Primary UI/UX Source: Google Stitch Screen 'Maintenance & Engineering Operations Hub' (090d19e66f664dc4a6ebf0d6d788dfcc)
// ==========================================================================

import { store } from '../state/store.js';
import { Toast } from '../components/Toast.js';

let activeMaintenanceTab = 'kanban'; // 'kanban' | 'table'

export function renderMaintenanceView(state) {
  const tickets = state.maintenanceTickets || [];
  const openTickets = tickets.filter((t) => t.status !== 'Resolved');
  const criticalTickets = tickets.filter((t) => t.priority === 'Urgent' || t.priority === 'High');

  return `
    <div class="space-y-6 animate-fadeIn text-xs">
      
      <!-- Top Section: Header & Actions -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-outline-variant pb-4">
        <div>
          <div class="flex items-center gap-2 text-on-surface-variant mb-1">
            <span class="material-symbols-outlined text-[16px] text-primary">engineering</span>
            <span class="font-label-caps text-[11px] font-bold uppercase text-secondary">Asset Care &amp; Facilities</span>
            <span>/</span>
            <span class="font-label-caps text-[11px] font-bold text-primary uppercase">Maintenance Hub</span>
          </div>
          <h1 class="font-headline-lg text-2xl font-bold text-primary tracking-tight">Maintenance &amp; Engineering Operations Hub</h1>
          <p class="text-on-surface-variant text-xs mt-0.5 flex items-center gap-2">
            <span class="material-symbols-outlined text-[14px] text-secondary">schedule</span>
            <span>Real-time SLA deadline monitoring, equipment uptime, and spare parts depletion</span>
          </p>
        </div>

        <button id="btn-create-maint-ticket" class="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-caps text-xs font-bold hover:bg-primary-container transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto">
          <span class="material-symbols-outlined text-[16px]">add</span>
          Log Work Order
        </button>
      </div>

      <!-- 4 Bento KPI Metric Cards (Google Stitch 090d19e6) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <!-- KPI 1: Active Work Orders -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col hover:border-primary transition-colors shadow-xs">
          <div class="flex justify-between items-start mb-2">
            <span class="font-body-md text-xs text-on-surface-variant font-medium">Active Work Orders</span>
            <div class="p-2 bg-primary-fixed text-primary rounded-lg">
              <span class="material-symbols-outlined text-[20px]">build</span>
            </div>
          </div>
          <div class="font-display-kpi text-3xl font-data-mono font-bold text-primary mt-auto">${openTickets.length}</div>
          <div class="text-[11px] text-on-surface-variant mt-1">Assigned to engineering duty</div>
        </div>

        <!-- KPI 2: Critical SLA (Urgent) -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col relative overflow-hidden group shadow-xs">
          <div class="absolute inset-x-0 top-0 h-1 bg-error"></div>
          <div class="flex justify-between items-start mb-2 mt-1">
            <span class="font-body-md text-xs text-on-surface-variant font-medium">Critical SLA Threats</span>
            <div class="p-2 bg-error-container text-error rounded-lg">
              <span class="material-symbols-outlined text-[20px]">warning</span>
            </div>
          </div>
          <div class="font-display-kpi text-3xl font-data-mono font-bold text-error">${criticalTickets.length}</div>
          <div class="font-body-sm text-[11px] text-error mt-1 flex items-center gap-1 font-bold">
            <span class="material-symbols-outlined text-[14px]">timer</span>
            <span>Room 303 HVAC: 34m remaining</span>
          </div>
        </div>

        <!-- KPI 3: Monthly SLA Compliance -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col hover:border-primary transition-colors shadow-xs">
          <div class="flex justify-between items-start mb-2">
            <span class="font-body-md text-xs text-on-surface-variant font-medium">Monthly SLA Compliance</span>
            <div class="p-2 bg-status-clean/15 text-status-clean rounded-lg">
              <span class="material-symbols-outlined text-[20px]">trending_up</span>
            </div>
          </div>
          <div class="font-display-kpi text-3xl font-data-mono font-bold text-status-clean mt-auto">98.4<span class="text-xl">%</span></div>
          <div class="font-body-sm text-[11px] text-status-clean mt-1 flex items-center gap-1 font-medium">
            <span class="material-symbols-outlined text-[14px]">arrow_upward</span>
            <span>Target exceeded (>95.0%)</span>
          </div>
        </div>

        <!-- KPI 4: Tracked Assets -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col hover:border-primary transition-colors shadow-xs">
          <div class="flex justify-between items-start mb-2">
            <span class="font-body-md text-xs text-on-surface-variant font-medium">Tracked Physical Assets</span>
            <div class="p-2 bg-surface-container text-secondary rounded-lg">
              <span class="material-symbols-outlined text-[20px]">precision_manufacturing</span>
            </div>
          </div>
          <div class="font-display-kpi text-3xl font-data-mono font-bold text-primary mt-auto">184</div>
          <div class="text-[11px] text-primary font-semibold mt-1 flex items-center gap-1">
            <span class="w-2 h-2 rounded-full bg-status-clean animate-pulse"></span>
            <span>100% Digital Telemetry</span>
          </div>
        </div>

      </div>

      <!-- Filter Bar & Dual View Toggle -->
      <div class="bg-surface-container-lowest p-3.5 border border-outline-variant rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        <div class="flex flex-wrap items-center gap-4">
          <!-- Priority Filter -->
          <div class="flex items-center gap-2">
            <label class="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Priority:</label>
            <select id="select-maint-priority" class="border border-outline-variant rounded-lg font-body-sm text-xs py-1 px-3 bg-surface-bright text-primary focus:outline-none focus:border-primary">
              <option value="ALL">All Priorities</option>
              <option value="Urgent">Urgent (P1)</option>
              <option value="High">High (P2)</option>
              <option value="Normal">Normal (P3)</option>
            </select>
          </div>

          <!-- Area Filter -->
          <div class="flex items-center gap-2">
            <label class="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Department:</label>
            <select id="select-maint-area" class="border border-outline-variant rounded-lg font-body-sm text-xs py-1 px-3 bg-surface-bright text-primary focus:outline-none focus:border-primary">
              <option value="ALL">All Departments</option>
              <option value="Rooms">Guest Rooms</option>
              <option value="Public">Public Areas</option>
              <option value="Kitchen">Kitchen &amp; F&amp;B</option>
              <option value="Facilities">Central Plant &amp; HVAC</option>
            </select>
          </div>
        </div>

        <!-- View Switcher (Kanban vs Table) -->
        <div class="flex items-center bg-surface-container-lowest border border-outline-variant rounded-lg p-0.5 shadow-sm">
          <button id="btn-view-kanban" class="px-3 py-1.5 rounded text-xs font-label-caps font-bold transition-all flex items-center gap-1.5 ${
            activeMaintenanceTab === 'kanban' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-primary'
          }">
            <span class="material-symbols-outlined text-[16px]">view_kanban</span>
            <span>Kanban Board</span>
          </button>
          <button id="btn-view-table" class="px-3 py-1.5 rounded text-xs font-label-caps font-bold transition-all flex items-center gap-1.5 ${
            activeMaintenanceTab === 'table' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-primary'
          }">
            <span class="material-symbols-outlined text-[16px]">table_rows</span>
            <span>SLA Tracker Table</span>
          </button>
        </div>

      </div>

      <!-- MAIN VIEW CONTENT: KANBAN OR TABLE -->
      ${
        activeMaintenanceTab === 'kanban'
          ? `
        <!-- KANBAN BOARD VIEW -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <!-- Column 1: Reported / Pending -->
          <div class="bg-surface-container-low/70 border border-outline-variant rounded-xl p-3 flex flex-col gap-3 min-h-[460px]">
            <div class="flex items-center justify-between pb-2 border-b border-outline-variant/80">
              <span class="font-label-caps text-xs font-bold text-primary uppercase">Pending / Logged</span>
              <span class="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-data-mono font-bold text-[10px]">
                ${tickets.filter((t) => t.status === 'Open').length}
              </span>
            </div>
            
            <div class="space-y-2.5">
              ${tickets
                .filter((t) => t.status === 'Open')
                .map((t) => renderKanbanCard(t))
                .join('')}
            </div>
          </div>

          <!-- Column 2: In Progress / Dispatched -->
          <div class="bg-surface-container-low/70 border border-outline-variant rounded-xl p-3 flex flex-col gap-3 min-h-[460px]">
            <div class="flex items-center justify-between pb-2 border-b border-outline-variant/80">
              <span class="font-label-caps text-xs font-bold text-status-alert uppercase">In Progress</span>
              <span class="px-2 py-0.5 rounded-full bg-status-alert/20 text-status-alert font-data-mono font-bold text-[10px]">
                ${tickets.filter((t) => t.status === 'In Progress').length}
              </span>
            </div>

            <div class="space-y-2.5">
              ${tickets
                .filter((t) => t.status === 'In Progress')
                .map((t) => renderKanbanCard(t))
                .join('')}
            </div>
          </div>

          <!-- Column 3: Parts / Hold -->
          <div class="bg-surface-container-low/70 border border-outline-variant rounded-xl p-3 flex flex-col gap-3 min-h-[460px]">
            <div class="flex items-center justify-between pb-2 border-b border-outline-variant/80">
              <span class="font-label-caps text-xs font-bold text-secondary uppercase">Parts / On Hold</span>
              <span class="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-data-mono font-bold text-[10px]">
                ${tickets.filter((t) => t.status === 'On Hold').length}
              </span>
            </div>

            <div class="space-y-2.5">
              ${tickets
                .filter((t) => t.status === 'On Hold')
                .map((t) => renderKanbanCard(t))
                .join('')}
            </div>
          </div>

          <!-- Column 4: Resolved & Tested -->
          <div class="bg-surface-container-low/70 border border-outline-variant rounded-xl p-3 flex flex-col gap-3 min-h-[460px]">
            <div class="flex items-center justify-between pb-2 border-b border-outline-variant/80">
              <span class="font-label-caps text-xs font-bold text-status-clean uppercase">Resolved</span>
              <span class="px-2 py-0.5 rounded-full bg-status-clean/20 text-status-clean font-data-mono font-bold text-[10px]">
                ${tickets.filter((t) => t.status === 'Resolved').length}
              </span>
            </div>

            <div class="space-y-2.5">
              ${tickets
                .filter((t) => t.status === 'Resolved')
                .map((t) => renderKanbanCard(t))
                .join('')}
            </div>
          </div>

        </div>
      `
          : `
        <!-- SLA TRACKER TABLE VIEW -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xs overflow-hidden">
          <div class="p-4 bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
            <span class="font-bold text-xs text-primary">Active Work Orders with SLA Countdowns</span>
            <span class="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-data-mono font-bold text-[10px]">
              ${tickets.length} Registered
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse font-body-sm">
              <thead>
                <tr class="border-b border-outline-variant bg-surface-container-lowest text-[10px] font-label-caps font-bold text-on-surface-variant uppercase tracking-wider">
                  <th class="py-3 px-4">Ticket ID</th>
                  <th class="py-3 px-4">Asset / Location</th>
                  <th class="py-3 px-4">Issue Description</th>
                  <th class="py-3 px-4">Priority</th>
                  <th class="py-3 px-4">Assigned Tech</th>
                  <th class="py-3 px-4">Parts Required</th>
                  <th class="py-3 px-4">SLA Countdown</th>
                  <th class="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/60 font-data-mono text-xs">
                ${tickets.map((t) => {
                  const priorityClass =
                    t.priority === 'Urgent'
                      ? 'bg-status-dirty/15 text-status-dirty border-status-dirty/30'
                      : t.priority === 'High'
                      ? 'bg-status-alert/15 text-status-alert border-status-alert/30'
                      : 'bg-surface-container-high text-on-surface-variant border-outline-variant';

                  return `
                    <tr class="hover:bg-surface-bright transition-colors">
                      <td class="py-3 px-4 font-bold text-primary">${t.id}</td>
                      <td class="py-3 px-4">
                        <div class="font-bold text-primary text-xs">${t.assetName || t.asset}</div>
                        <div class="text-[10px] text-on-surface-variant">Room #${t.roomNumber}</div>
                      </td>
                      <td class="py-3 px-4 font-body-sm text-on-surface max-w-xs truncate">${t.description}</td>
                      <td class="py-3 px-4">
                        <span class="px-2 py-0.5 rounded text-[10px] font-label-caps font-bold border ${priorityClass}">
                          ${t.priority}
                        </span>
                      </td>
                      <td class="py-3 px-4">
                        <div class="flex items-center gap-1.5">
                          <span class="material-symbols-outlined text-[14px] text-secondary">person</span>
                          <span class="text-on-surface">${t.assignedTo}</span>
                        </div>
                      </td>
                      <td class="py-3 px-4 text-on-surface-variant truncate">${t.partsRequired || 'None'}</td>
                      <td class="py-3 px-4">
                        <div class="flex items-center gap-2">
                          <div class="w-20 bg-surface-container-high h-2 rounded-full overflow-hidden">
                            <div class="bg-${t.priority === 'Urgent' ? 'error' : 'status-clean'} h-full" style="width: ${t.status === 'Resolved' ? '100%' : '65%'}"></div>
                          </div>
                          <span class="text-[10px] font-bold ${t.priority === 'Urgent' ? 'text-error' : 'text-on-surface-variant'}">
                            ${t.status === 'Resolved' ? 'Met' : t.remainingTime || '45m'}
                          </span>
                        </div>
                      </td>
                      <td class="py-3 px-4 text-right">
                        ${
                          t.status !== 'Resolved'
                            ? `
                          <button class="btn-resolve-ticket px-2.5 py-1 bg-status-clean text-white hover:opacity-90 rounded font-label-caps text-[11px] font-bold transition-all shadow-xs" data-ticket-id="${t.id}">
                            Resolve
                          </button>
                        `
                            : `
                          <span class="inline-flex items-center gap-1 text-status-clean font-bold text-[11px]">
                            <span class="material-symbols-outlined text-[14px]">check_circle</span> Closed
                          </span>
                        `
                        }
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `
      }

    </div>
  `;
}

function renderKanbanCard(t) {
  const priorityClass =
    t.priority === 'Urgent'
      ? 'bg-status-dirty/15 text-status-dirty border-status-dirty/30'
      : t.priority === 'High'
      ? 'bg-status-alert/15 text-status-alert border-status-alert/30'
      : 'bg-surface-container-high text-on-surface-variant border-outline-variant';

  return `
    <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-3.5 shadow-xs hover:shadow-md hover:border-primary transition-all flex flex-col justify-between group cursor-pointer" data-ticket-card="${t.id}">
      <div>
        <div class="flex items-start justify-between gap-2 mb-2">
          <span class="font-data-mono font-bold text-xs text-primary">${t.id}</span>
          <span class="px-1.5 py-0.2 rounded text-[9px] font-label-caps font-bold uppercase border ${priorityClass}">
            ${t.priority}
          </span>
        </div>

        <div class="font-bold text-xs text-primary group-hover:text-primary-container transition-colors">
          ${t.assetName || t.asset}
        </div>
        <div class="text-[11px] text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
          ${t.description}
        </div>
      </div>

      <div class="mt-3 pt-2.5 border-t border-outline-variant/60 flex items-center justify-between text-[10px] text-on-surface-variant font-data-mono">
        <span class="flex items-center gap-1">
          <span class="material-symbols-outlined text-[12px] text-secondary">room</span>
          <span>Room #${t.roomNumber}</span>
        </span>
        <span class="text-secondary font-medium">${t.assignedTo}</span>
      </div>
    </div>
  `;
}

export function bindMaintenanceEvents() {
  // Tab toggles
  const kanbanBtn = document.getElementById('btn-view-kanban');
  const tableBtn = document.getElementById('btn-view-table');

  if (kanbanBtn) {
    kanbanBtn.onclick = () => {
      activeMaintenanceTab = 'kanban';
      store.notify();
    };
  }
  if (tableBtn) {
    tableBtn.onclick = () => {
      activeMaintenanceTab = 'table';
      store.notify();
    };
  }

  // Resolve Ticket button
  document.querySelectorAll('.btn-resolve-ticket').forEach((btn) => {
    btn.onclick = () => {
      const ticketId = btn.dataset.ticketId;
      const t = (store.state.maintenanceTickets || []).find((tk) => tk.id === ticketId);
      if (t) {
        t.status = 'Resolved';
        Toast.show({ title: 'Work Order Resolved', message: `Ticket ${ticketId} marked completed & verified.`, type: 'success' });
        store.notify();
      }
    };
  });

  // Log Work Order CTA
  const createBtn = document.getElementById('btn-create-maint-ticket');
  if (createBtn) {
    createBtn.onclick = () => {
      const newTicket = {
        id: `WO-${Math.floor(1000 + Math.random() * 9000)}`,
        roomNumber: '403',
        asset: 'Water Pressure Sensor & Shower Valve',
        assetName: 'Kohler Hydro-Mix Valve',
        priority: 'Normal',
        status: 'Open',
        assignedTo: 'Carlos Ruiz',
        description: 'Scheduled gasket replacement and water flow calibration.',
        partsRequired: 'O-ring Seal Kit #402',
        remainingTime: '2h 15m',
      };
      store.state.maintenanceTickets.unshift(newTicket);
      Toast.show({ title: 'Work Order Logged', message: `Created ticket ${newTicket.id} for Room 403.`, type: 'success' });
      store.notify();
    };
  }
}
