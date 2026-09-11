// ==========================================================================
// VOLVITECH HOSPITALITY OS — HOUSEKEEPING & OPERATIONS HUB
// Primary UI/UX Source: Google Stitch Screen 'Housekeeping Management Dashboard' (076af6e61c764dcc994a1bfcb6c2d6a4)
// Enhanced with Proline PMS Staff Assignment & Workload Balancing Engine
// ==========================================================================

import { store } from '../state/store.js';
import { Toast } from '../components/Toast.js';

export function renderHousekeepingView(state) {
  const rooms = state.rooms || [];
  const tasks = state.housekeepingTasks || [];
  const staff = state.housekeepingStaff || [
    { id: 'hk-staff-1', name: 'Maria Santos', role: 'Lead Attendant', initials: 'MS', primaryFloors: ['5', '4'], maxCredits: 14.0, onDuty: true },
    { id: 'hk-staff-2', name: 'Elena Gomez', role: 'Senior Attendant', initials: 'EG', primaryFloors: ['4'], maxCredits: 14.0, onDuty: true },
    { id: 'hk-staff-3', name: 'Fatima Zahra', role: 'Floor Attendant', initials: 'FZ', primaryFloors: ['3'], maxCredits: 14.0, onDuty: true },
    { id: 'hk-staff-4', name: 'Carlos Ruiz', role: 'Floor Attendant', initials: 'CR', primaryFloors: ['3', '4'], maxCredits: 14.0, onDuty: true },
    { id: 'hk-staff-5', name: 'David Kim', role: 'Floor Attendant', initials: 'DK', primaryFloors: ['2'], maxCredits: 14.0, onDuty: true },
    { id: 'hk-staff-6', name: 'Aisha Patel', role: 'Express Float Attendant', initials: 'AP', primaryFloors: ['2', '3'], maxCredits: 14.0, onDuty: true }
  ];
  const floors = ['5', '4', '3', '2'];

  const dirtyCount = rooms.filter((r) => r.status === 'Dirty').length;
  const inProgressCount = rooms.filter((r) => r.status === 'In Progress').length;
  const cleanCount = rooms.filter((r) => r.status === 'Clean').length;
  const inspectedCount = rooms.filter((r) => r.status === 'Inspected').length;

  // Calculate live attendant workloads
  const staffWithStats = staff.map(s => {
    const assignedTasks = tasks.filter(t => t.assignedTo === s.name && t.status !== 'Completed');
    const assignedRooms = rooms.filter(r => r.housekeeper === s.name);
    const credits = assignedTasks.reduce((acc, t) => acc + (Number(t.credits) || 2.0), 0);
    const maxCredits = s.maxCredits || 14.0;
    const loadPct = Math.min(100, Math.round((credits / maxCredits) * 100));
    return {
      ...s,
      assignedTasksCount: assignedTasks.length,
      assignedRoomsCount: assignedRooms.length,
      credits,
      maxCredits,
      loadPct
    };
  });

  return `
    <div class="space-y-6 animate-fadeIn text-xs">
      
      <!-- Top Section: Header & Actions -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-outline-variant pb-4">
        <div>
          <div class="flex items-center gap-2 text-on-surface-variant mb-1">
            <span class="material-symbols-outlined text-[16px] text-primary">cleaning_services</span>
            <span class="font-label-caps text-[11px] font-bold uppercase text-secondary">Operations &amp; Facilities</span>
            <span>/</span>
            <span class="font-label-caps text-[11px] font-bold text-primary uppercase">Housekeeping</span>
          </div>
          <h1 class="font-headline-lg text-2xl font-bold text-primary tracking-tight">Housekeeping Master Board &amp; Inspection QA</h1>
          <p class="text-on-surface-variant text-xs mt-0.5">Real-time room status management, cleaning credits dispatch, and supervisor inspection QA.</p>
        </div>

        <div class="flex items-center gap-2.5">
          <button id="btn-bulk-clean" class="bg-primary text-on-primary px-4 py-2.5 rounded-lg font-label-caps text-xs font-bold hover:bg-primary/90 transition-all shadow-sm flex items-center gap-2 active:scale-95 cursor-pointer" title="Auto-Assign Daily Turnaround Tasks">
            <span class="material-symbols-outlined text-[18px]">done_all</span>
            Auto-Assign Daily Tasks
          </button>
        </div>
      </div>

      <!-- Bento KPI Metrics Row (Google Stitch 076af6e6) -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <!-- Dirty Rooms -->
        <div class="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-status-dirty p-4 rounded-xl shadow-xs">
          <div class="flex items-center justify-between text-on-surface-variant font-label-caps text-[10px] font-bold uppercase">
            <span>Dirty Rooms (Pending)</span>
            <span class="material-symbols-outlined text-status-dirty text-[18px]">warning</span>
          </div>
          <div class="font-display-kpi text-3xl font-data-mono font-bold text-status-dirty mt-2">${dirtyCount}</div>
          <div class="text-[11px] text-on-surface-variant mt-0.5">Requires turnaround dispatch</div>
        </div>

        <!-- In Progress -->
        <div class="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-status-alert p-4 rounded-xl shadow-xs">
          <div class="flex items-center justify-between text-on-surface-variant font-label-caps text-[10px] font-bold uppercase">
            <span>In Progress (Cleaning)</span>
            <span class="material-symbols-outlined text-status-alert text-[18px]">autorenew</span>
          </div>
          <div class="font-display-kpi text-3xl font-data-mono font-bold text-status-alert mt-2">${inProgressCount}</div>
          <div class="text-[11px] text-on-surface-variant mt-0.5">Attendants on active floor duty</div>
        </div>

        <!-- Clean (Awaiting Inspection) -->
        <div class="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-status-clean p-4 rounded-xl shadow-xs">
          <div class="flex items-center justify-between text-on-surface-variant font-label-caps text-[10px] font-bold uppercase">
            <span>Clean (Awaiting QA)</span>
            <span class="material-symbols-outlined text-status-clean text-[18px]">check_circle</span>
          </div>
          <div class="font-display-kpi text-3xl font-data-mono font-bold text-status-clean mt-2">${cleanCount}</div>
          <div class="text-[11px] text-status-clean font-semibold mt-0.5">Ready for supervisor QA</div>
        </div>

        <!-- Inspected / Ready -->
        <div class="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-primary p-4 rounded-xl shadow-xs">
          <div class="flex items-center justify-between text-on-surface-variant font-label-caps text-[10px] font-bold uppercase">
            <span>Inspected / Ready</span>
            <span class="material-symbols-outlined text-primary text-[18px]">verified</span>
          </div>
          <div class="font-display-kpi text-3xl font-data-mono font-bold text-primary mt-2">${inspectedCount}</div>
          <div class="text-[11px] text-primary font-bold mt-0.5">Available for instant check-in</div>
        </div>

      </div>

      <!-- Attendants On-Duty & Credits Workload Bar (Proline PMS Feature) -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2.5 border-b border-outline-variant/60">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[18px]">badge</span>
            <span class="font-bold text-xs text-primary">On-Duty Housekeeping Attendants</span>
            <span class="px-2 py-0.5 rounded-full bg-primary-fixed/70 text-primary font-data-mono font-bold text-[10px]">
              ${staffWithStats.filter(s => s.onDuty).length} Active • 14.0 cr Shift Cap
            </span>
          </div>
          <div class="flex items-center gap-3 text-[10px] text-on-surface-variant font-data-mono">
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Balanced (&lt;10 cr)</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-500"></span> Moderate (10-14 cr)</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-rose-500"></span> Heavy (&gt;14 cr)</span>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          ${staffWithStats.map(s => {
            const barColor = s.credits > 14 ? 'bg-error' : s.credits >= 10 ? 'bg-secondary' : 'bg-primary';
            const badgeBg = s.credits > 14 ? 'text-error bg-error-container' : s.credits >= 10 ? 'text-secondary bg-secondary-fixed' : 'text-primary bg-primary-fixed';

            return `
              <div class="bg-surface-bright border border-outline-variant/80 rounded-lg p-2.5 flex flex-col justify-between hover:border-primary transition-all">
                <div class="flex items-center justify-between gap-1.5 mb-2">
                  <div class="flex items-center gap-1.5 truncate">
                    <div class="w-6 h-6 rounded-full bg-primary text-on-primary font-bold text-[10px] flex items-center justify-center shrink-0">
                      ${s.initials || s.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div class="truncate">
                      <div class="font-bold text-[11px] text-primary truncate">${s.name}</div>
                      <div class="text-[9px] text-on-surface-variant truncate">${s.role}</div>
                    </div>
                  </div>
                </div>

                <div class="space-y-1">
                  <div class="flex items-center justify-between text-[10px] font-data-mono">
                    <span class="text-on-surface-variant">${s.assignedRoomsCount} rooms</span>
                    <span class="font-bold ${badgeBg} px-1.5 py-0.2 rounded text-[9px]">${s.credits.toFixed(1)} / ${s.maxCredits} cr</span>
                  </div>
                  <div class="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                    <div class="${barColor} h-1.5 rounded-full transition-all duration-300" style="width: ${s.loadPct}%"></div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Active Turnaround Task Dispatch Queue -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xs overflow-hidden">
        <div class="p-4 bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
          <div class="flex items-center gap-2 font-bold text-xs text-primary">
            <span class="material-symbols-outlined text-[18px] text-primary">format_list_bulleted</span>
            <span>Active Turnaround Task Dispatch Queue</span>
          </div>
          <span class="px-2.5 py-0.5 rounded-full bg-primary-fixed text-primary font-data-mono font-bold text-[10px]">
            ${tasks.length} Assigned Tasks
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse font-body-sm">
            <thead>
              <tr class="border-b border-outline-variant bg-surface-container-lowest/80 text-[10px] font-label-caps font-bold text-on-surface-variant uppercase tracking-wider">
                <th class="py-3 px-4">Room &amp; Floor</th>
                <th class="py-3 px-4">Task Type</th>
                <th class="py-3 px-4">Priority</th>
                <th class="py-3 px-4">Attendant</th>
                <th class="py-3 px-4">Credits</th>
                <th class="py-3 px-4">Est. Time</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/60 font-data-mono text-xs">
              ${tasks.map((t) => {
                const priorityBadge =
                  t.priority === 'High' || t.priority === 'Urgent'
                    ? 'bg-status-dirty/15 text-status-dirty border-status-dirty/30'
                    : 'bg-surface-container-high text-on-surface-variant border-outline-variant';

                const statusBadge =
                  t.status === 'Completed' || t.status === 'Inspected'
                    ? 'bg-status-clean/15 text-status-clean border-status-clean/30'
                    : t.status === 'In Progress'
                    ? 'bg-status-alert/15 text-status-alert border-status-alert/30'
                    : 'bg-status-dirty/15 text-status-dirty border-status-dirty/30';

                return `
                  <tr class="hover:bg-surface-bright transition-colors">
                    <td class="py-3 px-4">
                      <div class="font-bold text-primary text-sm">Room #${t.roomNumber}</div>
                      <div class="text-[10px] text-on-surface-variant">Floor ${t.floor}</div>
                    </td>
                    <td class="py-3 px-4 font-body-sm text-on-surface font-medium">${t.type}</td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded text-[10px] font-label-caps font-bold border ${priorityBadge}">
                        ${t.priority}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-full bg-primary-fixed text-primary font-bold text-[10px] flex items-center justify-center shrink-0">
                          ${(t.assignedTo || 'UN').split(' ').map((n) => n[0]).join('')}
                        </div>
                        <select class="select-task-attendant bg-surface-lowest border border-outline-variant hover:border-primary rounded px-2 py-1 text-xs text-on-surface font-body-sm focus:outline-none focus:border-primary transition-colors cursor-pointer" data-task-id="${t.id}" data-room-number="${t.roomNumber}" title="Assign Staff to this Room">
                          <option value="Unassigned" ${!t.assignedTo || t.assignedTo === 'Unassigned' ? 'selected' : ''}>Unassigned</option>
                          ${staffWithStats.map(s => `
                            <option value="${s.name}" ${t.assignedTo === s.name ? 'selected' : ''}>
                              ${s.name} (${s.credits.toFixed(1)} cr)
                            </option>
                          `).join('')}
                        </select>
                      </div>
                    </td>
                    <td class="py-3 px-4 font-bold text-primary">${t.credits} cr</td>
                    <td class="py-3 px-4 text-on-surface-variant">${t.estimatedMin} mins</td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded text-[10px] font-label-caps font-bold border ${statusBadge}">
                        ${t.status}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <div class="flex items-center justify-end gap-1.5">
                        ${
                          t.status === 'Pending'
                            ? `
                          <button class="btn-start-clean px-2.5 py-1 bg-surface-container hover:bg-surface-container-high text-primary rounded font-label-caps text-[11px] font-bold border border-outline-variant transition-colors cursor-pointer" data-task-id="${t.id}">
                            Start Clean
                          </button>
                        `
                            : t.status === 'In Progress'
                            ? `
                          <button class="btn-finish-clean px-2.5 py-1 bg-status-clean text-white hover:opacity-90 rounded font-label-caps text-[11px] font-bold transition-all shadow-xs cursor-pointer" data-task-id="${t.id}">
                            Complete Clean
                          </button>
                        `
                            : t.status === 'Completed'
                            ? `
                          <button class="btn-inspect-modal-trigger px-2.5 py-1 bg-primary text-on-primary hover:bg-primary-container rounded font-label-caps text-[11px] font-bold transition-all shadow-xs cursor-pointer" data-room="${t.roomNumber}">
                            Inspect QA
                          </button>
                        `
                            : `
                          <span class="inline-flex items-center gap-1 text-status-clean font-bold text-[11px]">
                            <span class="material-symbols-outlined text-[14px]">verified</span> Verified
                          </span>
                        `
                        }
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Floor-by-Floor Visual Room Status Grid -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="font-headline-sm text-sm font-bold text-primary">Floor-by-Floor Physical Inventory Matrix</h2>
          <span class="text-[11px] font-data-mono text-on-surface-variant">Click staff chip to assign, or click tune to toggle room status</span>
        </div>

        ${floors.map((floorNum) => {
          const floorRooms = rooms.filter((r) => String(r.floor) === String(floorNum));
          return `
            <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-xs">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2 font-bold text-xs text-primary font-data-mono">
                  <span class="material-symbols-outlined text-secondary text-[16px]">stairs</span>
                  <span>Floor ${floorNum} (${floorNum === '5' ? 'VIP Penthouse Wing' : floorNum === '4' ? 'Executive Ocean Suites' : 'Superior Guest Rooms'})</span>
                </div>
                <span class="text-[10px] font-data-mono text-on-surface-variant">${floorRooms.length} rooms</span>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                ${floorRooms.map((r) => {
                  const borderTopColor =
                    r.status === 'Clean'
                      ? 'border-t-status-clean'
                      : r.status === 'Inspected'
                      ? 'border-t-primary'
                      : r.status === 'Dirty'
                      ? 'border-t-status-dirty'
                      : 'border-t-status-alert';

                  return `
                    <div 
                      class="card-room-inspect bg-surface-bright border border-outline-variant ${borderTopColor} border-t-4 rounded-lg p-3 hover:shadow-md transition-all flex flex-col justify-between"
                      data-room-inspect="${r.id}"
                    >
                      <div>
                        <div class="flex items-start justify-between">
                          <span class="font-data-mono font-bold text-base text-primary">#${r.id}</span>
                          <span class="px-1.5 py-0.2 rounded text-[9px] font-label-caps font-bold uppercase ${
                            r.status === 'Clean'
                              ? 'bg-status-clean/20 text-status-clean'
                              : r.status === 'Inspected'
                              ? 'bg-primary/20 text-primary'
                              : r.status === 'Dirty'
                              ? 'bg-status-dirty/20 text-status-dirty'
                              : 'bg-status-alert/20 text-status-alert'
                          }">
                            ${r.status}
                          </span>
                        </div>

                        <div class="text-[10px] text-on-surface-variant truncate mt-1">${r.type}</div>
                        
                        <div class="mt-2 text-[10px] text-on-surface-variant font-data-mono flex items-center justify-between">
                          <span class="truncate">${r.guest ? (r.guest.includes('Vacant') ? 'Vacant' : r.guest.split(' ').slice(-1)[0]) : 'Vacant'}</span>
                          <span class="text-[9px] px-1 py-0.2 rounded bg-surface-container font-medium text-on-surface-variant">${r.floor === '5' ? '4.5 cr' : r.floor === '4' ? '3.5 cr' : '2.5 cr'}</span>
                        </div>
                      </div>

                      <div class="mt-2.5 pt-2 border-t border-outline-variant/60 flex items-center justify-between gap-1">
                        <button class="btn-assign-room-staff flex items-center gap-1 text-[10px] font-medium text-primary hover:text-secondary bg-surface-container hover:bg-surface-container-high px-2 py-0.5 rounded transition-all truncate max-w-[110px] cursor-pointer" data-room-id="${r.id}" title="Assign Staff to Room #${r.id}">
                          <span class="material-symbols-outlined text-[13px] shrink-0">person</span>
                          <span class="truncate">${r.housekeeper || 'Assign Staff'}</span>
                        </button>
                        <button class="btn-room-status-toggle p-1 hover:bg-surface-container rounded text-secondary transition-colors cursor-pointer" data-room-id="${r.id}" title="Toggle Room Status (Dirty → Cleaning → Clean → Inspected)">
                          <span class="material-symbols-outlined text-[14px]">tune</span>
                        </button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}

// ── Room Staff Assignment Modal ─────────────────────────────────────────
function openAssignStaffModal(roomNumber, state) {
  const room = (state.rooms || []).find(r => String(r.id) === String(roomNumber));
  if (!room) return;
  const staff = state.housekeepingStaff || [];
  const tasks = state.housekeepingTasks || [];

  // Remove existing modal if any
  const existing = document.getElementById('modal-assign-staff');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'modal-assign-staff';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs animate-fadeIn p-4';
  
  modal.innerHTML = `
    <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl max-w-md w-full overflow-hidden text-xs animate-scaleIn">
      <div class="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-bright">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-[20px]">person_add</span>
          <div>
            <h3 class="font-bold text-sm text-primary">Assign Attendant — Room #${room.id}</h3>
            <p class="text-[11px] text-on-surface-variant font-data-mono">Floor ${room.floor} • ${room.type} • Status: ${room.status}</p>
          </div>
        </div>
        <button id="btn-close-assign-staff-modal" class="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      <div class="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
        <p class="text-on-surface-variant text-[11px]">Select an on-duty housekeeping attendant to assign to this room:</p>

        <div class="space-y-2">
          ${staff.map(s => {
            const isAssigned = room.housekeeper === s.name;
            const staffCredits = tasks
              .filter(tk => tk.assignedTo === s.name && tk.status !== 'Completed')
              .reduce((acc, cur) => acc + (Number(cur.credits) || 2.0), 0)
              .toFixed(1);

            return `
              <div 
                class="btn-select-staff-card p-3 border ${isAssigned ? 'border-primary bg-primary-fixed/20' : 'border-outline-variant bg-surface-bright hover:border-primary'} rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-98"
                data-staff-name="${s.name}"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full ${isAssigned ? 'bg-primary text-on-primary' : 'bg-primary-fixed text-primary'} font-bold text-xs flex items-center justify-center shrink-0">
                    ${s.initials || s.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div class="font-bold text-primary flex items-center gap-1.5">
                      <span>${s.name}</span>
                      ${isAssigned ? '<span class="px-1.5 py-0.2 rounded bg-primary text-on-primary text-[9px] font-bold uppercase">Assigned</span>' : ''}
                    </div>
                    <div class="text-[10px] text-on-surface-variant font-data-mono">
                      ${s.role} • Floors ${s.primaryFloors ? s.primaryFloors.join(', ') : 'All'}
                    </div>
                  </div>
                </div>

                <div class="text-right">
                  <div class="font-bold text-primary font-data-mono">${staffCredits} / ${s.maxCredits || 14} cr</div>
                  <div class="text-[9px] text-on-surface-variant font-data-mono">Workload</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="p-4 border-t border-outline-variant bg-surface-bright flex items-center justify-between">
        <button id="btn-unassign-room" class="px-3 py-1.5 border border-outline-variant hover:border-error hover:text-error rounded-lg font-label-caps text-xs font-semibold text-on-surface-variant transition-colors cursor-pointer">
          Unassign Room
        </button>
        <button id="btn-cancel-assign-staff" class="px-4 py-1.5 bg-surface-container hover:bg-surface-container-high text-primary rounded-lg font-label-caps text-xs font-semibold transition-colors cursor-pointer">
          Close
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => modal.remove();
  modal.querySelector('#btn-close-assign-staff-modal').onclick = closeModal;
  modal.querySelector('#btn-cancel-assign-staff').onclick = closeModal;

  modal.querySelectorAll('.btn-select-staff-card').forEach(btn => {
    btn.onclick = () => {
      const staffName = btn.dataset.staffName;
      store.assignStaffToRoom(room.id, staffName);
      closeModal();
    };
  });

  modal.querySelector('#btn-unassign-room').onclick = () => {
    store.assignStaffToRoom(room.id, 'Unassigned');
    closeModal();
  };
}

// ── Auto-Assign Daily Tasks Modal (Proline PMS Strategy Engine) ──────────
function openAutoAssignModal(state) {
  const staff = state.housekeepingStaff || [];
  const tasks = state.housekeepingTasks || [];
  const rooms = state.rooms || [];

  const pendingTasks = tasks.filter(t => t.status === 'Pending' || !t.assignedTo || t.assignedTo === 'Unassigned');
  const dirtyRooms = rooms.filter(r => r.status === 'Dirty');
  const totalTasksToDispatch = Math.max(pendingTasks.length, dirtyRooms.length);
  const totalCredits = pendingTasks.reduce((acc, t) => acc + (Number(t.credits) || 2.5), 0) || (totalTasksToDispatch * 3.0);

  // Remove existing modal if any
  const existing = document.getElementById('modal-auto-assign');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'modal-auto-assign';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs animate-fadeIn p-4';

  modal.innerHTML = `
    <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl max-w-lg w-full overflow-hidden text-xs animate-scaleIn">
      <div class="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-bright">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-[22px]">smart_toy</span>
          <div>
            <h3 class="font-bold text-sm text-primary">Auto-Assign Daily Tasks &amp; Workload Balancer</h3>
            <p class="text-[11px] text-on-surface-variant font-data-mono">Proline PMS Workload Distribution Engine</p>
          </div>
        </div>
        <button id="btn-close-auto-assign-modal" class="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      <div class="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
        <!-- Summary Banner -->
        <div class="bg-primary-fixed/30 border border-primary/20 rounded-xl p-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary text-[24px]">task</span>
            <div>
              <div class="font-bold text-primary text-xs">${totalTasksToDispatch} Rooms Require Turnover Dispatch</div>
              <div class="text-[11px] text-on-surface-variant font-data-mono">Total Workload: ${totalCredits.toFixed(1)} cleaning credits</div>
            </div>
          </div>
          <span class="px-2.5 py-1 rounded-full bg-primary text-on-primary font-bold text-[10px] font-data-mono">
            ~${(totalCredits / Math.max(1, staff.length)).toFixed(1)} cr/attendant
          </span>
        </div>

        <!-- Strategy Selection -->
        <div>
          <label class="font-bold text-xs text-primary mb-2 block font-label-caps uppercase">1. Distribution Strategy</label>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <label class="strategy-option border border-primary bg-primary-fixed/20 rounded-xl p-3 flex flex-col justify-between cursor-pointer hover:border-primary transition-all">
              <div class="flex items-center justify-between mb-1">
                <span class="font-bold text-primary text-[11px]">Balanced Credits</span>
                <input type="radio" name="auto-assign-strategy" value="balanced" checked class="text-primary focus:ring-primary h-3.5 w-3.5" />
              </div>
              <p class="text-[10px] text-on-surface-variant">Equalizes cleaning credits evenly across staff to avoid burnout.</p>
            </label>

            <label class="strategy-option border border-outline-variant rounded-xl p-3 flex flex-col justify-between cursor-pointer hover:border-primary transition-all bg-surface-bright">
              <div class="flex items-center justify-between mb-1">
                <span class="font-bold text-primary text-[11px]">Floor Zoning</span>
                <input type="radio" name="auto-assign-strategy" value="floor_zone" class="text-primary focus:ring-primary h-3.5 w-3.5" />
              </div>
              <p class="text-[10px] text-on-surface-variant">Clusters tasks by assigned floor wings to minimize transit time.</p>
            </label>

            <label class="strategy-option border border-outline-variant rounded-xl p-3 flex flex-col justify-between cursor-pointer hover:border-primary transition-all bg-surface-bright">
              <div class="flex items-center justify-between mb-1">
                <span class="font-bold text-primary text-[11px]">Priority / VIP</span>
                <input type="radio" name="auto-assign-strategy" value="priority_vip" class="text-primary focus:ring-primary h-3.5 w-3.5" />
              </div>
              <p class="text-[10px] text-on-surface-variant">Routes urgent departure turnarounds &amp; VIP penthouses first.</p>
            </label>
          </div>
        </div>

        <!-- Attendant Participation Checklist -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="font-bold text-xs text-primary font-label-caps uppercase">2. Participating Attendants On Duty</label>
            <span class="text-[10px] font-data-mono text-on-surface-variant">All selected by default</span>
          </div>
          <div class="space-y-1.5 border border-outline-variant rounded-xl p-2.5 bg-surface-bright">
            ${staff.map(s => {
              const currentCr = tasks
                .filter(tk => tk.assignedTo === s.name && tk.status !== 'Completed')
                .reduce((acc, cur) => acc + (Number(cur.credits) || 2.0), 0)
                .toFixed(1);

              return `
                <label class="flex items-center justify-between p-1.5 rounded hover:bg-surface-container transition-colors cursor-pointer text-xs">
                  <div class="flex items-center gap-2.5">
                    <input type="checkbox" value="${s.id}" checked class="staff-participate-checkbox text-primary rounded focus:ring-primary h-3.5 w-3.5" />
                    <div class="w-5 h-5 rounded-full bg-primary-fixed text-primary font-bold text-[9px] flex items-center justify-center shrink-0">
                      ${s.initials || s.name[0]}
                    </div>
                    <div>
                      <span class="font-bold text-primary text-[11px]">${s.name}</span>
                      <span class="text-[10px] text-on-surface-variant font-data-mono">(${s.role})</span>
                    </div>
                  </div>
                  <span class="font-data-mono text-[10px] text-on-surface-variant">
                    Current: <span class="font-bold text-primary">${currentCr} cr</span> / ${s.maxCredits || 14} cr
                  </span>
                </label>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="p-4 border-t border-outline-variant bg-surface-bright flex items-center justify-between">
        <button id="btn-cancel-auto-assign" class="px-4 py-2 border border-outline-variant rounded-lg font-label-caps text-xs font-semibold text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer">
          Cancel
        </button>
        <button id="btn-execute-auto-assign" class="px-5 py-2 bg-primary text-on-primary rounded-lg font-label-caps text-xs font-bold hover:bg-primary/90 transition-all shadow-sm flex items-center gap-2 active:scale-95 cursor-pointer">
          <span class="material-symbols-outlined text-[18px]">done_all</span>
          Execute Auto-Assignment
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => modal.remove();
  modal.querySelector('#btn-close-auto-assign-modal').onclick = closeModal;
  modal.querySelector('#btn-cancel-auto-assign').onclick = closeModal;

  // Radio button styling feedback
  modal.querySelectorAll('input[name="auto-assign-strategy"]').forEach(radio => {
    radio.onchange = () => {
      modal.querySelectorAll('.strategy-option').forEach(opt => {
        const isChecked = opt.querySelector('input').checked;
        if (isChecked) {
          opt.className = 'strategy-option border border-primary bg-primary-fixed/20 rounded-xl p-3 flex flex-col justify-between cursor-pointer hover:border-primary transition-all';
        } else {
          opt.className = 'strategy-option border border-outline-variant rounded-xl p-3 flex flex-col justify-between cursor-pointer hover:border-primary transition-all bg-surface-bright';
        }
      });
    };
  });

  modal.querySelector('#btn-execute-auto-assign').onclick = () => {
    const selectedStrategy = modal.querySelector('input[name="auto-assign-strategy"]:checked')?.value || 'balanced';
    const checkedStaffIds = Array.from(modal.querySelectorAll('.staff-participate-checkbox:checked')).map(cb => cb.value);

    store.autoAssignDailyTasks({
      strategy: selectedStrategy,
      selectedStaffIds: checkedStaffIds
    });
    closeModal();
  };
}

// ── Bind Housekeeping Event Listeners ────────────────────────────────────
export function bindHousekeepingEvents() {
  // Start Clean button
  document.querySelectorAll('.btn-start-clean').forEach((btn) => {
    btn.onclick = () => {
      const taskId = btn.dataset.taskId;
      const task = (store.state.housekeepingTasks || []).find((t) => t.id === taskId);
      if (task) {
        task.status = 'In Progress';
        store.updateRoomStatus(task.roomNumber, 'In Progress');
        Toast.show({ title: 'Cleaning Commenced', message: `Attendant began cleaning Room #${task.roomNumber}`, type: 'info' });
        store.notify();
      }
    };
  });

  // Finish Clean button
  document.querySelectorAll('.btn-finish-clean').forEach((btn) => {
    btn.onclick = () => {
      const taskId = btn.dataset.taskId;
      const task = (store.state.housekeepingTasks || []).find((t) => t.id === taskId);
      if (task) {
        task.status = 'Completed';
        store.updateRoomStatus(task.roomNumber, 'Clean');
        Toast.show({ title: 'Room Cleaned', message: `Room #${task.roomNumber} marked Clean. Awaiting Supervisor QA inspection.`, type: 'success' });
        store.notify();
      }
    };
  });

  // Supervisor QA Inspect Action
  document.querySelectorAll('.btn-inspect-modal-trigger').forEach((btn) => {
    btn.onclick = () => {
      const roomNum = btn.dataset.room;
      store.updateRoomStatus(roomNum, 'Inspected');
      const task = (store.state.housekeepingTasks || []).find((t) => String(t.roomNumber) === String(roomNum));
      if (task) task.status = 'Inspected';
      Toast.show({ title: 'QA Inspection Passed', message: `Room #${roomNum} marked Inspected and available for Front Desk check-in!`, type: 'success' });
      store.notify();
    };
  });

  // Attendant dropdown change directly in Active Turnaround Task Dispatch Queue
  document.querySelectorAll('.select-task-attendant').forEach((select) => {
    select.onchange = (e) => {
      const newStaff = e.target.value;
      const roomNumber = select.dataset.roomNumber;
      store.assignStaffToRoom(roomNumber, newStaff);
    };
  });

  // Assign staff button on room card
  document.querySelectorAll('.btn-assign-room-staff').forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const roomId = btn.dataset.roomId;
      openAssignStaffModal(roomId, store.state);
    };
  });

  // Room status toggle button on card
  document.querySelectorAll('.btn-room-status-toggle').forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const roomId = btn.dataset.roomId;
      const room = (store.state.rooms || []).find((r) => String(r.id) === String(roomId));
      if (!room) return;

      const nextStatusMap = {
        Dirty: 'In Progress',
        'In Progress': 'Clean',
        Clean: 'Inspected',
        Inspected: 'Dirty',
      };
      const nextStatus = nextStatusMap[room.status] || 'Clean';
      store.updateRoomStatus(roomId, nextStatus);
      Toast.show({ title: `Room #${roomId} Status Updated`, message: `Status transitioned to ${nextStatus}`, type: 'info' });
      store.notify();
    };
  });

  // Auto-Assign Daily Tasks button (header)
  const bulkBtn = document.getElementById('btn-bulk-clean');
  if (bulkBtn) {
    bulkBtn.onclick = () => {
      openAutoAssignModal(store.state);
    };
  }
}
