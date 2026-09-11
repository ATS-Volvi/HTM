// ==========================================================================
// VOLVITECH HOSPITALITY OS — STAFF MOBILE OPERATIONAL APP
// ==========================================================================

import { store } from '../state/store.js';

export function renderStaffAppView(state) {
  const currentRole = state.currentRole;
  const tasks = state.housekeepingTasks;
  const tickets = state.maintenanceTickets;

  return `
    <div class="mobile-simulator-wrapper animate-fade-in">
      <div class="mobile-phone-casing">
        <div class="phone-dynamic-island"></div>
        <div class="mobile-screen-viewport">
          <!-- Mobile Status Header -->
          <div style="background: #0D1524; color: #FFFFFF; padding: 36px 16px 16px 16px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 10px; font-weight: 700; color: #60A5FA; text-transform: uppercase;">Volvitech Staff App</div>
              <div style="font-size: 16px; font-weight: 700;">Elena Gomez (Floor 4 Lead)</div>
            </div>
            <span class="badge badge-clean" style="font-size: 9px;">On Shift • 07:00-15:30</span>
          </div>

          <!-- Mobile App Scroll Content -->
          <div class="mobile-app-content">
            <!-- Staff KPI Bar -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px;">
              <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px; text-align: center;">
                <div style="font-size: 9px; color: #64748B; font-weight: 700;">MY TASKS</div>
                <div style="font-size: 18px; font-weight: 800; color: #2563EB;">${tasks.length}</div>
              </div>
              <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px; text-align: center;">
                <div style="font-size: 9px; color: #64748B; font-weight: 700;">CREDITS</div>
                <div style="font-size: 18px; font-weight: 800; color: #10B981;">14.5</div>
              </div>
              <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px; text-align: center;">
                <div style="font-size: 9px; color: #64748B; font-weight: 700;">SLA MET</div>
                <div style="font-size: 18px; font-weight: 800; color: #F59E0B;">99%</div>
              </div>
            </div>

            <!-- Priority Housekeeping Task Feed -->
            <div style="font-size: 12px; font-weight: 700; color: #0F172A; margin-bottom: 8px; display: flex; justify-content: space-between;">
              <span>Assigned Room Turnarounds</span>
              <span style="color: #EF4444; font-size: 11px;">1 Priority Urgent</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
              ${tasks.map(t => `
                <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-left: 4px solid ${t.priority === 'Urgent' ? '#EF4444' : '#2563EB'}; border-radius: 8px; padding: 12px;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                      <span style="font-weight: 800; font-size: 15px; color: #0F172A;">Room ${t.roomNumber}</span>
                      <span class="badge badge-${t.priority.toLowerCase()}" style="font-size: 8px; margin-left: 4px;">${t.priority}</span>
                    </div>
                    <span class="badge badge-${t.status === 'In Progress' ? 'progress' : t.status === 'Completed' ? 'clean' : 'dirty'}" style="font-size: 9px;">${t.status}</span>
                  </div>

                  <div style="font-size: 11px; color: #475569; margin: 4px 0;">${t.type} • Floor ${t.floor}</div>

                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 8px; border-top: 1px solid #F1F5F9;">
                    <span style="font-size: 11px; font-weight: 600; color: #64748B;">${t.credits} Credits • ~${t.estimatedMin}m</span>
                    ${t.status === 'Pending' ? `
                      <button class="btn-primary btn-staff-start" style="padding: 4px 10px; font-size: 11px;" data-task-id="${t.id}">
                        Start Clean
                      </button>
                    ` : t.status === 'In Progress' ? `
                      <button class="btn-success btn-staff-done" style="padding: 4px 10px; font-size: 11px;" data-task-id="${t.id}">
                        Done Clean
                      </button>
                    ` : `
                      <span class="badge badge-clean">Completed</span>
                    `}
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Maintenance SLA Dispatch in Staff App -->
            <div style="font-size: 12px; font-weight: 700; color: #0F172A; margin-bottom: 8px;">
              Active Work Orders (Engineering)
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${tickets.slice(0, 2).map(tk => `
                <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px;">
                  <div style="display: flex; justify-content: space-between;">
                    <span style="font-weight: 700; font-size: 13px; color: #0F172A;">${tk.roomOrArea}</span>
                    <span class="badge badge-${tk.priority.toLowerCase()}" style="font-size: 8px;">${tk.priority}</span>
                  </div>
                  <div style="font-size: 11px; color: #64748B; margin-top: 2px;">${tk.assetName}</div>
                  <div style="font-size: 11px; color: #475569; margin: 4px 0;">${tk.description}</div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                    <span style="font-size: 10px; font-weight: 700; color: #EF4444;">⏱ ${tk.slaMinutesRemaining} mins remaining</span>
                    <button class="btn-secondary btn-staff-fix" style="padding: 3px 8px; font-size: 10px;" data-ticket-id="${tk.id}">
                      Resolve
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Mobile Bottom Navigation -->
          <div class="mobile-bottom-bar">
            <button class="mobile-nav-btn active">
              <span class="material-symbols-outlined" style="font-size: 20px;">checklist</span>
              <span>Tasks</span>
            </button>
            <button class="mobile-nav-btn" id="btn-staff-quick-defect">
              <span class="material-symbols-outlined" style="font-size: 20px;">report_problem</span>
              <span>Defect</span>
            </button>
            <button class="mobile-nav-btn" id="btn-staff-switch-web">
              <span class="material-symbols-outlined" style="font-size: 20px;">desktop_windows</span>
              <span>HMS Web</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindStaffAppEvents() {
  document.querySelectorAll('.btn-staff-start').forEach(btn => {
    btn.addEventListener('click', () => {
      const taskId = btn.dataset.taskId;
      store.updateHousekeepingTaskStatus(taskId, 'In Progress');
    });
  });

  document.querySelectorAll('.btn-staff-done').forEach(btn => {
    btn.addEventListener('click', () => {
      const taskId = btn.dataset.taskId;
      store.updateHousekeepingTaskStatus(taskId, 'Completed');
    });
  });

  document.querySelectorAll('.btn-staff-fix').forEach(btn => {
    btn.addEventListener('click', () => {
      const ticketId = btn.dataset.ticketId;
      store.resolveMaintenanceTicket(ticketId, 'Field technician resolved issue via mobile app.');
    });
  });

  const defectBtn = document.getElementById('btn-staff-quick-defect');
  if (defectBtn) {
    defectBtn.addEventListener('click', () => {
      store.setModal({ type: 'create_ticket', data: {} });
    });
  }

  const switchWebBtn = document.getElementById('btn-staff-switch-web');
  if (switchWebBtn) {
    switchWebBtn.addEventListener('click', () => {
      store.setInterfaceMode('web_hms');
    });
  }
}
