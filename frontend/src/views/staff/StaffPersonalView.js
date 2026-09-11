import { store } from '../../state/store.js';
import { showToast } from '../../components/Toast.js';

export function renderStaffPersonalView(state) {
  // Current logged in staff member (Elena Gomez)
  const currentStaffName = 'Elena Gomez';
  const myRooms = state.rooms.filter(r => r.housekeeper === currentStaffName || r.housekeeper.includes('Elena'));
  const myTasks = state.tasks.filter(t => t.assignee === currentStaffName || t.assignee.includes('Elena'));

  const pendingRooms = myRooms.filter(r => r.status === 'Dirty' || r.status === 'In Progress').length;
  const readyRooms = myRooms.filter(r => r.status === 'Clean' || r.status === 'Inspected').length;
  const pendingTasks = myTasks.filter(t => t.status !== 'Completed').length;

  return `
    <div class="app-content animate-fade-in" style="padding-bottom: 50px;">
      <!-- Title & My Shift Status Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div class="label-bold" style="color: var(--secondary);">Staff Workspace</div>
          <h2 class="display-title" style="font-size: 24px;">My Assigned Duties</h2>
        </div>
        <div style="text-align: right;">
          <span class="badge badge-clean" style="font-size: 10px;">On Duty (07:00 - 15:30)</span>
          <div style="font-size: 11px; color: var(--on-surface-variant); margin-top: 2px;">Elena Gomez • Floor 4 Lead</div>
        </div>
      </div>

      <!-- My Shift Progress KPI Cards -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
        <div class="glass-card" style="padding: 10px; text-align: center;">
          <div class="label-bold" style="font-size: 9px; color: #1b5e20;">Completed</div>
          <div style="font-size: 20px; font-weight: 800; color: #1b5e20; margin-top: 2px;">${readyRooms}</div>
          <div style="font-size: 9px; color: var(--outline);">Clean / Ready</div>
        </div>
        <div class="glass-card" style="padding: 10px; text-align: center;">
          <div class="label-bold" style="font-size: 9px; color: ${pendingRooms > 0 ? '#c62828' : 'var(--success)'};">Remaining</div>
          <div style="font-size: 20px; font-weight: 800; color: ${pendingRooms > 0 ? '#c62828' : 'var(--primary)'}; margin-top: 2px;">${pendingRooms}</div>
          <div style="font-size: 9px; color: var(--outline);">Suites To Clean</div>
        </div>
        <div class="glass-card" style="padding: 10px; text-align: center;">
          <div class="label-bold" style="font-size: 9px; color: var(--secondary);">Open Tasks</div>
          <div style="font-size: 20px; font-weight: 800; color: var(--secondary); margin-top: 2px;">${pendingTasks}</div>
          <div style="font-size: 9px; color: var(--outline);">Service Requests</div>
        </div>
      </div>

      <!-- Section: My Assigned Rooms -->
      <section style="display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div class="label-bold">My Assigned Rooms (${myRooms.length})</div>
          <span style="font-size: 11px; color: var(--on-surface-variant);">Assigned by Manager</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${myRooms.map(room => {
            const isClean = room.status === 'Clean' || room.status === 'Inspected';
            const isInProgress = room.status === 'In Progress';
            const isDirty = room.status === 'Dirty';
            const isDND = room.dnd || room.status === 'DND';

            return `
              <div class="glass-card" style="padding: 14px 16px; border-left: 4px solid ${
                isDND ? 'var(--error)' :
                isClean ? 'var(--success)' :
                isInProgress ? '#7b1fa2' : '#c62828'
              };">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                  <div>
                    <span class="badge badge-vip" style="font-size: 9px;">Room ${room.id}</span>
                    <span style="font-weight: 700; font-size: 14px; color: var(--primary); margin-left: 6px;">${room.type}</span>
                  </div>
                  <span class="badge ${
                    isClean ? 'badge-clean' :
                    isDND ? 'badge-dnd' :
                    isInProgress ? 'badge-progress' : 'badge-dirty'
                  }" style="font-size: 9px;">
                    ${room.status}
                  </span>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 12px; margin: 4px 0 10px 0;">
                  <span style="color: var(--primary); font-weight: 600;">Guest: ${room.guest}</span>
                  <span style="color: var(--outline); font-size: 11px;">Last serviced: ${room.lastCleaned}</span>
                </div>

                <!-- Staff Action Buttons -->
                <div style="display: flex; gap: 8px; justify-content: flex-end; border-top: 1px solid var(--surface-container-high); padding-top: 10px;">
                  ${isDirty ? `
                    <button class="btn-secondary start-clean-btn" data-room="${room.id}" style="padding: 6px 12px; font-size: 11px;">
                      <span class="material-symbols-outlined" style="font-size: 14px;">play_arrow</span> Start Turnover
                    </button>
                  ` : ''}

                  ${isInProgress ? `
                    <button class="btn-primary mark-clean-btn" data-room="${room.id}" style="padding: 6px 14px; font-size: 11px; background: #2e7d32;">
                      <span class="material-symbols-outlined" style="font-size: 14px;">check</span> Mark Clean & Inspected
                    </button>
                  ` : ''}

                  ${isClean ? `
                    <span style="font-size: 11px; color: #2e7d32; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                      <span class="material-symbols-outlined" style="font-size: 16px;">verified</span> Ready for Guest
                    </span>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Section: My Direct Service Tickets -->
      <section style="display: flex; flex-direction: column; gap: 10px;">
        <div class="label-bold">My Active Service Tickets (${myTasks.length})</div>
        ${myTasks.length === 0 ? `
          <div class="glass-card" style="padding: 20px; text-align: center; color: var(--on-surface-variant); font-size: 13px;">
            No pending tickets assigned to you right now.
          </div>
        ` : myTasks.map(task => {
          const isDone = task.status === 'Completed';
          return `
            <div class="glass-card" style="padding: 14px 16px; border-left: 4px solid ${isDone ? 'var(--success)' : 'var(--primary)'}; opacity: ${isDone ? '0.7' : '1'};">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                <span class="badge ${task.priority === 'Urgent' ? 'badge-dirty' : 'badge-gold'}" style="font-size: 9px;">${task.priority}</span>
                <span style="font-size: 11px; color: var(--on-surface-variant); font-weight: 600;">Due: ${task.timeDue}</span>
              </div>
              <h4 style="font-family: var(--font-serif); font-size: 14px; font-weight: 700; color: var(--primary);">${task.title}</h4>
              <p class="body-sm" style="color: var(--on-surface-variant); margin: 4px 0 10px 0;">${task.details}</p>
              <div style="display: flex; justify-content: flex-end; border-top: 1px solid var(--surface-container-high); padding-top: 8px;">
                ${!isDone ? `
                  <button class="btn-primary complete-my-task-btn" data-id="${task.id}" style="padding: 5px 12px; font-size: 11px; background: #2e7d32;">
                    ✓ Complete Ticket
                  </button>
                ` : `
                  <span style="font-size: 11px; color: #2e7d32; font-weight: 700;">Completed</span>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </section>

      <!-- Housekeeper Trolley Supply Check -->
      <div class="glass-card" style="padding: 14px 16px; background: linear-gradient(135deg, #ffffff 0%, #f4fbf3 100%); border: 1px solid #c8e6c9;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #e8f5e9; color: #1b5e20; display: flex; align-items: center; justify-content: center;">
              <span class="material-symbols-outlined">inventory</span>
            </div>
            <div>
              <div style="font-weight: 700; font-size: 13px; color: #1b5e20;">Housekeeping Cart #4</div>
              <div class="body-sm" style="font-size: 11px;">Restocked with 20 Egyptian Towels & Soaps</div>
            </div>
          </div>
          <button class="btn-secondary" id="request-trolley-restock-btn" style="padding: 6px 10px; font-size: 11px;">
            Request Supplies
          </button>
        </div>
      </div>
    </div>
  `;
}

export function bindStaffPersonalEvents() {
  const startBtns = document.querySelectorAll('.start-clean-btn');
  startBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const room = btn.dataset.room;
      store.updateRoomStatus(room, 'In Progress');
      showToast('Room Cleaning Started', `Room ${room} is now In Progress.`, 'hourglass_top');
    });
  });

  const cleanBtns = document.querySelectorAll('.mark-clean-btn');
  cleanBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const room = btn.dataset.room;
      store.updateRoomStatus(room, 'Inspected');
      showToast('Room Cleaned & Ready', `Room ${room} marked Clean & Inspected.`, 'verified');
    });
  });

  const completeTaskBtns = document.querySelectorAll('.complete-my-task-btn');
  completeTaskBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      store.updateTaskStatus(id, 'Completed');
      showToast('Ticket Completed', `Task #${id} marked finished and signed off.`, 'check_circle');
    });
  });

  const restockBtn = document.getElementById('request-trolley-restock-btn');
  if (restockBtn) {
    restockBtn.addEventListener('click', () => {
      showToast('Supply Request Sent', 'Central linen depot notified for Cart #4 refill.', 'local_shipping');
    });
  }
}
