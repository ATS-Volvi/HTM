import { store } from '../../state/store.js';
import { showToast } from '../../components/Toast.js';

export function renderShiftScheduleView(state) {
  const staffMembers = [
    { name: 'Elena Gomez', role: 'Floor 4 Lead', shift: 'Morning (07:00 - 15:30)', score: '99.4%', roomsDone: 14, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', status: 'On Duty' },
    { name: 'Maria Santos', role: 'VIP Senior Butler', shift: 'Morning (07:00 - 15:30)', score: '98.8%', roomsDone: 11, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80', status: 'On Duty' },
    { name: 'Pierre Dubois', role: 'Head In-Room Butler', shift: 'All-Day (08:00 - 16:30)', score: '99.1%', roomsDone: 22, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', status: 'On Duty' },
    { name: 'Carlos Ruiz', role: 'Turnaround Specialist', shift: 'Evening (15:00 - 23:30)', score: '96.5%', roomsDone: 9, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', status: 'Upcoming' },
    { name: 'Fatima Zahra', role: 'Floor 3 Lead', shift: 'Morning (07:00 - 15:30)', score: '97.9%', roomsDone: 16, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80', status: 'On Duty' }
  ];

  return `
    <div class="app-content animate-fade-in" style="padding-bottom: 40px;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div class="label-bold" style="color: var(--secondary);">Hospitality Excellence</div>
          <h2 class="display-title" style="font-size: 24px;">Team & Shifts</h2>
        </div>
        <button class="btn-primary" id="submit-handover-btn" style="padding: 6px 12px; font-size: 11px;">
          + Shift Handover
        </button>
      </div>

      <!-- KPI Overview Cards -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
        <div class="glass-card" style="padding: 10px; text-align: center;">
          <div class="label-bold" style="font-size: 9px;">Turnaround</div>
          <div style="font-size: 18px; font-weight: 800; color: var(--primary); margin-top: 2px;">24 min</div>
          <div style="font-size: 9px; color: #2e7d32;">↑ 8% faster</div>
        </div>
        <div class="glass-card" style="padding: 10px; text-align: center;">
          <div class="label-bold" style="font-size: 9px;">Pass Rate</div>
          <div style="font-size: 18px; font-weight: 800; color: var(--primary); margin-top: 2px;">99.2%</div>
          <div style="font-size: 9px; color: #2e7d32;">5-Star Audited</div>
        </div>
        <div class="glass-card" style="padding: 10px; text-align: center;">
          <div class="label-bold" style="font-size: 9px;">Active Staff</div>
          <div style="font-size: 18px; font-weight: 800; color: var(--secondary); margin-top: 2px;">18 On Duty</div>
          <div style="font-size: 9px; color: var(--outline);">Wing A & B</div>
        </div>
      </div>

      <!-- Staff Roster & Leaderboard -->
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="label-bold">On-Duty Shift Roster (Aug 31)</div>
        ${staffMembers.map((staff, index) => `
          <div class="glass-card" style="padding: 12px 14px; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="position: relative;">
                <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 1.5px solid var(--primary-fixed-dim);">
                  <img src="${staff.avatar}" alt="${staff.name}" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
                ${index === 0 ? '<span style="position: absolute; bottom: -2px; right: -2px; font-size: 12px;">👑</span>' : ''}
              </div>
              <div>
                <div style="font-weight: 700; font-size: 13px; color: var(--primary);">${staff.name}</div>
                <div class="body-sm" style="font-size: 11px; color: var(--on-surface-variant);">${staff.role} • ${staff.shift}</div>
              </div>
            </div>

            <div style="text-align: right;">
              <span class="badge ${staff.status === 'On Duty' ? 'badge-clean' : 'badge-inspected'}" style="font-size: 9px;">
                ${staff.status}
              </span>
              <div style="font-size: 11px; font-weight: 700; color: var(--secondary); margin-top: 2px;">
                ${staff.roomsDone} rooms (${staff.score})
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Shift Handover Notes -->
      <div class="glass-card" style="padding: 16px;">
        <div class="label-bold" style="margin-bottom: 8px;">Supervisor Shift Handover Log</div>
        <div style="background: var(--surface-container-low); padding: 12px; border-radius: var(--radius-sm); font-size: 12px; line-height: 1.5; color: var(--on-surface);">
          <strong>07:00 AM - Morning Briefing:</strong><br />
          • Suite 501 (Presidential) requires vintage Champagne setup at 12:00 PM.<br />
          • Suite 402 (Mr. Harrison) requested extra plush towels and lavender mist.<br />
          • HVAC inspection ongoing for Room 303 thermostat sensor.
        </div>
      </div>
    </div>
  `;
}

export function bindShiftScheduleEvents() {
  const handoverBtn = document.getElementById('submit-handover-btn');
  if (handoverBtn) {
    handoverBtn.addEventListener('click', () => {
      showToast('Shift Handover Report', 'Handover notes synced to Duty Manager and Evening Supervisor.', 'note_add');
    });
  }
}
