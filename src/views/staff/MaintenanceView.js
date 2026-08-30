import { store } from '../../state/store.js';
import { showToast } from '../../components/Toast.js';

export function renderMaintenanceView(state) {
  const telemetry = [
    { title: 'Chiller & HVAC Loop', status: 'Optimal', val: '21.4°C / 48% RH', icon: 'ac_unit', color: 'var(--success)' },
    { title: 'Domestic Water Pumps', status: 'Optimal', val: '5.2 Bar Flow', icon: 'water_drop', color: 'var(--success)' },
    { title: 'High-Speed Wi-Fi APs', status: 'Active (99.8%)', val: '64/64 Online', icon: 'wifi', color: 'var(--success)' },
    { title: 'Smart Lock Telemetry', status: 'Low Battery', val: 'Room 303 (12%)', icon: 'lock_open', color: 'var(--error)' }
  ];

  const maintenanceTasks = state.tasks.filter(t => t.category === 'Maintenance');

  return `
    <div class="app-content animate-fade-in" style="padding-bottom: 40px;">
      <!-- Title -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div class="label-bold" style="color: var(--error);">Engineering Operations</div>
          <h2 class="display-title" style="font-size: 24px;">Maintenance Hub</h2>
        </div>
        <button class="btn-secondary" id="run-telemetry-btn" style="padding: 4px 10px; font-size: 11px;">
          ↻ Diagnostics
        </button>
      </div>

      <!-- Live Building Telemetry -->
      <div class="glass-card" style="padding: 16px;">
        <div class="label-bold" style="margin-bottom: 12px;">Building System Telemetry</div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
          ${telemetry.map(item => `
            <div style="background: var(--surface-container-low); padding: 10px 12px; border-radius: var(--radius-sm); border: 1px solid var(--outline-variant);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <span class="material-symbols-outlined" style="font-size: 18px; color: ${item.color};">${item.icon}</span>
                <span style="font-size: 9px; font-weight: 700; color: ${item.color};">${item.status}</span>
              </div>
              <div style="font-weight: 700; font-size: 12px; color: var(--primary);">${item.title}</div>
              <div style="font-size: 11px; color: var(--on-surface-variant); margin-top: 2px;">${item.val}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Active Maintenance Dispatches -->
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="label-bold">Active Repair Dispatches (${maintenanceTasks.length})</div>
        ${maintenanceTasks.length === 0 ? `
          <div class="glass-card" style="padding: 20px; text-align: center; color: var(--on-surface-variant);">
            All facility systems operating nominally.
          </div>
        ` : maintenanceTasks.map(task => `
          <div class="glass-card" style="padding: 16px; border-left: 4px solid var(--error);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span class="badge badge-dirty" style="font-size: 9px;">Room ${task.room}</span>
              <span style="font-size: 11px; font-weight: 600; color: var(--on-surface-variant);">${task.timeDue}</span>
            </div>
            <h4 style="font-family: var(--font-serif); font-size: 15px; font-weight: 700; color: var(--primary);">
              ${task.title}
            </h4>
            <p class="body-sm" style="color: var(--on-surface-variant); margin: 6px 0 10px 0;">
              ${task.details}
            </p>
            <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--surface-container-high); padding-top: 8px;">
              <span style="font-size: 11px; color: var(--outline);">Technician: <strong>${task.assignee}</strong></span>
              <button class="btn-primary complete-maint-btn" data-id="${task.id}" style="padding: 4px 10px; font-size: 11px; background: var(--primary);">
                Sign Off & Close
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function bindMaintenanceEvents() {
  const diagBtn = document.getElementById('run-telemetry-btn');
  if (diagBtn) {
    diagBtn.addEventListener('click', () => {
      showToast('Diagnostics Completed', 'All 12 BMS automation gateways responding in 4ms.', 'sensors');
    });
  }

  const completeBtns = document.querySelectorAll('.complete-maint-btn');
  completeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      store.updateTaskStatus(id, 'Completed');
      showToast('Maintenance Sign-off', `Task #${id} marked as inspected and operational.`, 'check_circle');
    });
  });
}
