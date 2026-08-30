import { store } from '../../state/store.js';
import { showToast } from '../../components/Toast.js';

export function renderSupervisorRoomGridView(state) {
  const selectedFloor = state.selectedFloor || '4';
  const selectedFilter = state.selectedStatusFilter || 'All';
  const floors = ['4', '3', '2', '5'];
  const statusFilters = ['All', 'Clean', 'Dirty', 'Inspected', 'DND', 'In Progress'];

  let rooms = state.rooms.filter(r => r.floor === selectedFloor);
  if (selectedFilter !== 'All') {
    rooms = rooms.filter(r => r.status === selectedFilter);
  }

  // Summary Metrics
  const floorRooms = state.rooms.filter(r => r.floor === selectedFloor);
  const cleanCount = floorRooms.filter(r => r.status === 'Clean' || r.status === 'Inspected').length;
  const dirtyCount = floorRooms.filter(r => r.status === 'Dirty').length;
  const dndCount = floorRooms.filter(r => r.dnd || r.status === 'DND').length;

  return `
    <div class="app-content animate-fade-in" style="padding-bottom: 40px;">
      <!-- Title & Live Dispatch Bar -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div class="label-bold" style="color: var(--secondary);">Supervisor Command Center</div>
          <h2 class="display-title" style="font-size: 24px;">Room Operations</h2>
        </div>
        <div style="text-align: right;">
          <span class="badge badge-clean" style="font-size: 10px;">Live Sync Active</span>
          <div style="font-size: 11px; color: var(--on-surface-variant); margin-top: 2px;">Floor ${selectedFloor === '5' ? 'Penthouse' : selectedFloor}</div>
        </div>
      </div>

      <!-- Quick Metrics Counters -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
        <div class="glass-card" style="padding: 10px 12px; text-align: center;">
          <div class="label-bold" style="font-size: 9px; color: #1b5e20;">Ready / Clean</div>
          <div style="font-size: 20px; font-weight: 800; color: #1b5e20;">${cleanCount}</div>
        </div>
        <div class="glass-card" style="padding: 10px 12px; text-align: center;">
          <div class="label-bold" style="font-size: 9px; color: #c62828;">Turnaround</div>
          <div style="font-size: 20px; font-weight: 800; color: #c62828;">${dirtyCount}</div>
        </div>
        <div class="glass-card" style="padding: 10px 12px; text-align: center;">
          <div class="label-bold" style="font-size: 9px; color: #e65100;">DND Privacy</div>
          <div style="font-size: 20px; font-weight: 800; color: #e65100;">${dndCount}</div>
        </div>
      </div>

      <!-- Floor Selection Tabs -->
      <div>
        <div class="label-bold" style="margin-bottom: 6px;">Select Floor</div>
        <div style="display: flex; gap: 6px;">
          ${floors.map(fl => `
            <button class="btn-secondary floor-tab-btn ${fl === selectedFloor ? 'active' : ''}" data-floor="${fl}" style="flex: 1; padding: 8px 4px; font-size: 12px; font-weight: 700; ${fl === selectedFloor ? 'background: var(--primary); color: white; border-color: var(--primary);' : ''}">
              ${fl === '5' ? 'Penthouse' : `Floor ${fl}`}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Status Filter Chips -->
      <div class="category-pills-row">
        ${statusFilters.map(f => `
          <button class="category-pill status-filter-pill ${f === selectedFilter ? 'active' : ''}" data-filter="${f}" style="font-size: 11px; padding: 6px 12px;">
            ${f}
          </button>
        `).join('')}
      </div>

      <!-- Interactive Room Grid -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
        ${rooms.map(room => {
          const isDND = room.dnd || room.status === 'DND';
          const isInspected = room.status === 'Inspected';
          const isClean = room.status === 'Clean';
          const isDirty = room.status === 'Dirty';
          const isInProgress = room.status === 'In Progress';

          return `
            <div class="glass-card room-grid-card" data-room-id="${room.id}" style="padding: 14px; cursor: pointer; border-left: 4px solid ${
              isDND ? 'var(--error)' :
              isClean || isInspected ? '#2e7d32' :
              isDirty ? '#c62828' : '#7b1fa2'
            }; position: relative;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                <div style="font-family: var(--font-serif); font-size: 18px; font-weight: 800; color: var(--primary);">
                  ${room.id}
                </div>
                <span class="badge ${
                  isClean ? 'badge-clean' :
                  isInspected ? 'badge-inspected' :
                  isDirty ? 'badge-dirty' :
                  isDND ? 'badge-dnd' : 'badge-progress'
                }" style="font-size: 9px; padding: 2px 6px;">
                  ${room.status}
                </span>
              </div>

              <div style="font-size: 11px; font-weight: 600; color: var(--on-surface-variant); margin-bottom: 2px;">
                ${room.type}
              </div>

              <div style="font-size: 12px; font-weight: 700; color: var(--primary); margin: 6px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${room.guest}
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--surface-container-high); padding-top: 6px; font-size: 10px; color: var(--outline);">
                <span>👤 ${room.housekeeper.split(' ')[0]}</span>
                ${room.vip ? '<span class="badge badge-vip" style="font-size: 8px; padding: 1px 4px;">VIP</span>' : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Quick Supervisor Actions -->
      <div class="glass-card" style="padding: 14px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 700; font-size: 13px;">Floor Turnover Actions</div>
          <div class="body-sm">Auto-assign departure rooms to available team</div>
        </div>
        <button class="btn-primary" id="auto-assign-btn" style="padding: 8px 12px; font-size: 11px;">
          Auto-Assign
        </button>
      </div>
    </div>
  `;
}

export function bindSupervisorRoomGridEvents() {
  const floorBtns = document.querySelectorAll('.floor-tab-btn');
  floorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      store.setFloor(btn.dataset.floor);
    });
  });

  const filterPills = document.querySelectorAll('.status-filter-pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      store.state.selectedStatusFilter = pill.dataset.filter;
      store.notify();
    });
  });

  const roomCards = document.querySelectorAll('.room-grid-card');
  roomCards.forEach(card => {
    card.addEventListener('click', () => {
      const roomId = card.dataset.roomId;
      store.openModal('room-details', { roomId });
    });
  });

  const autoAssignBtn = document.getElementById('auto-assign-btn');
  if (autoAssignBtn) {
    autoAssignBtn.addEventListener('click', () => {
      showToast('Turnover Auto-Assigned', 'Dirty rooms distributed across on-duty housekeeping team.', 'done_all');
    });
  }
}
