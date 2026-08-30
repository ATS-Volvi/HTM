import { store } from '../../state/store.js';
import { showToast } from '../../components/Toast.js';
import confetti from 'canvas-confetti';

// ──────────────────────────────────────────────
// Helper: render a single room card (manager view)
// ──────────────────────────────────────────────
function renderRoomCard(room) {
  const statusColorMap = {
    'Clean':       { border: '#2e7d32', badge: 'badge-clean' },
    'Inspected':   { border: '#0d47a1', badge: 'badge-inspected' },
    'Dirty':       { border: '#c62828', badge: 'badge-dirty' },
    'DND':         { border: '#e65100', badge: 'badge-dnd' },
    'In Progress': { border: '#6a1b9a', badge: 'badge-progress' },
  };
  const cfg = statusColorMap[room.status] || { border: 'var(--outline)', badge: 'badge-inspected' };

  return `
    <div class="glass-card room-card-mgr" data-room-id="${room.id}" style="padding: 12px 14px; border-left: 4px solid ${cfg.border}; cursor: pointer;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
        <div>
          <span style="font-size: 18px; font-weight: 800; color: var(--primary);">${room.id}</span>
          ${room.vip ? `<span class="badge badge-vip" style="font-size: 9px; margin-left: 6px;">VIP</span>` : ''}
          ${room.dnd ? `<span class="badge badge-dnd" style="font-size: 9px; margin-left: 4px;">DND</span>` : ''}
        </div>
        <span class="badge ${cfg.badge}" style="font-size: 9px;">${room.status}</span>
      </div>
      <div style="font-size: 11px; color: var(--on-surface-variant);">${room.type}</div>
      <div style="font-size: 12px; font-weight: 600; color: var(--primary); margin: 4px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${room.guest}</div>
      <div style="font-size: 10px; color: var(--outline); display: flex; align-items: center; gap: 4px;">
        <span class="material-symbols-outlined" style="font-size: 12px;">person</span>
        ${room.housekeeper}
      </div>
    </div>
  `;
}

export function renderAdminManagerView(state) {
  const activeSubTab = state.adminSubTab || 'overview';
  const menu         = state.menu;
  const staff        = state.staffList;
  const complaints   = state.complaints;
  const rooms        = state.rooms;
  const tasks        = state.tasks;
  const inventory    = state.inventory;

  const totalRooms    = rooms.length;
  const occupiedRooms = rooms.filter(r => r.guest !== 'Vacant / Ready' && r.guest !== 'Vacant / Departure').length;
  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);
  const dirtyCount    = rooms.filter(r => r.status === 'Dirty').length;
  const openComplaints = complaints.filter(c => c.status !== 'Resolved').length;

  // For task sub-tab
  const urgentTasks = tasks.filter(t => t.priority === 'Urgent' && t.status !== 'Completed').length;
  const criticalInventory = inventory.filter(i => i.status === 'Critical' || i.status === 'Low Stock').length;

  // For room grid: group by selected floor
  const selectedFloor = state.selectedFloor || '4';
  const floorRooms = rooms.filter(r => r.floor === selectedFloor);

  return `
    <div class="app-content animate-fade-in" style="padding-bottom: 50px;">
      <!-- Manager Portal Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div class="label-bold" style="color: var(--secondary);">Executive Management Portal</div>
          <h2 class="display-title" style="font-size: 24px;">General Manager</h2>
        </div>
        <div style="text-align: right;">
          <span class="badge badge-gold" style="font-size: 10px;">Executive Command</span>
          <div style="font-size: 11px; color: var(--on-surface-variant); margin-top: 2px;">The Grand Astoria</div>
        </div>
      </div>

      <!-- Manager Bottom Nav mirrors sub-tabs — just a scrollable pill row at top -->
      <div class="category-pills-row" id="admin-sub-tabs" style="overflow-x: auto; white-space: nowrap; padding-bottom: 4px;">
        <button class="category-pill admin-tab-btn ${activeSubTab === 'overview'    ? 'active' : ''}" data-tab="overview">
          <span class="material-symbols-outlined" style="font-size: 13px; vertical-align: -3px;">dashboard</span> Overview
        </button>
        <button class="category-pill admin-tab-btn ${activeSubTab === 'rooms'      ? 'active' : ''}" data-tab="rooms">
          <span class="material-symbols-outlined" style="font-size: 13px; vertical-align: -3px;">grid_view</span> Room Grid
        </button>
        <button class="category-pill admin-tab-btn ${activeSubTab === 'tasks'      ? 'active' : ''}" data-tab="tasks">
          <span class="material-symbols-outlined" style="font-size: 13px; vertical-align: -3px;">assignment</span> Tasks ${urgentTasks > 0 ? `<span class="nav-badge" style="position:static;transform:none;margin-left:4px;">${urgentTasks}</span>` : ''}
        </button>
        <button class="category-pill admin-tab-btn ${activeSubTab === 'staff'      ? 'active' : ''}" data-tab="staff">
          <span class="material-symbols-outlined" style="font-size: 13px; vertical-align: -3px;">badge</span> Staff
        </button>
        <button class="category-pill admin-tab-btn ${activeSubTab === 'menu'       ? 'active' : ''}" data-tab="menu">
          <span class="material-symbols-outlined" style="font-size: 13px; vertical-align: -3px;">restaurant_menu</span> Menu
        </button>
        <button class="category-pill admin-tab-btn ${activeSubTab === 'inventory'  ? 'active' : ''}" data-tab="inventory">
          <span class="material-symbols-outlined" style="font-size: 13px; vertical-align: -3px;">inventory_2</span> Stock ${criticalInventory > 0 ? `<span class="nav-badge" style="position:static;transform:none;margin-left:4px;background:var(--warning);">${criticalInventory}</span>` : ''}
        </button>
        <button class="category-pill admin-tab-btn ${activeSubTab === 'complaints' ? 'active' : ''}" data-tab="complaints">
          <span class="material-symbols-outlined" style="font-size: 13px; vertical-align: -3px;">report_problem</span> Complaints ${openComplaints > 0 ? `<span class="nav-badge" style="position:static;transform:none;margin-left:4px;background:var(--error);">${openComplaints}</span>` : ''}
        </button>
      </div>

      <!-- ══════════════════════════════════
           TAB 1 : OVERVIEW & AUTO-ASSIGN
           ══════════════════════════════════ -->
      ${activeSubTab === 'overview' ? `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
          <div class="glass-card" style="padding: 12px 14px;">
            <div class="label-bold" style="font-size: 9px; color: var(--secondary);">Occupancy Rate</div>
            <div style="font-size: 22px; font-weight: 800; color: var(--primary); margin: 2px 0;">${occupancyRate}%</div>
            <div style="font-size: 10px; color: #2e7d32;">${occupiedRooms} / ${totalRooms} Suites Active</div>
          </div>
          <div class="glass-card" style="padding: 12px 14px;">
            <div class="label-bold" style="font-size: 9px; color: var(--secondary);">Dining Revenue</div>
            <div style="font-size: 22px; font-weight: 800; color: var(--primary); margin: 2px 0;">$3,420.50</div>
            <div style="font-size: 10px; color: #2e7d32;">↑ 14% vs yesterday</div>
          </div>
          <div class="glass-card" style="padding: 12px 14px;">
            <div class="label-bold" style="font-size: 9px; color: ${dirtyCount > 0 ? 'var(--error)' : 'var(--success)'};">Turnover Queue</div>
            <div style="font-size: 22px; font-weight: 800; color: ${dirtyCount > 0 ? 'var(--error)' : 'var(--primary)'}; margin: 2px 0;">${dirtyCount} Rooms</div>
            <div style="font-size: 10px; color: var(--on-surface-variant);">${dirtyCount > 0 ? 'Awaiting assignment' : 'All rooms serviced'}</div>
          </div>
          <div class="glass-card" style="padding: 12px 14px;">
            <div class="label-bold" style="font-size: 9px; color: ${openComplaints > 0 ? 'var(--warning)' : 'var(--success)'};">Open Escalations</div>
            <div style="font-size: 22px; font-weight: 800; color: ${openComplaints > 0 ? 'var(--warning)' : 'var(--primary)'}; margin: 2px 0;">${openComplaints} Tickets</div>
            <div style="font-size: 10px; color: var(--on-surface-variant);">Requires resolution</div>
          </div>
        </div>

        <!-- Intelligent Auto-Assign Section -->
        <div class="glass-card" style="padding: 18px; border-left: 4px solid var(--secondary); background: linear-gradient(135deg, #ffffff 0%, #fffdf8 100%);">
          <div style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px;">
            <div style="width: 42px; height: 42px; border-radius: 50%; background: var(--secondary-container); display: flex; align-items: center; justify-content: center; color: var(--on-secondary-container); flex-shrink: 0;">
              <span class="material-symbols-outlined">auto_awesome</span>
            </div>
            <div>
              <h3 class="headline-md" style="font-size: 17px; margin-bottom: 2px;">Intelligent Turnover Auto-Assign</h3>
              <p class="body-sm" style="color: var(--on-surface-variant); line-height: 1.4;">
                Distributes all dirty departure suites evenly across on-duty housekeepers by floor proximity, VIP priority, and workload balance.
              </p>
            </div>
          </div>
          <div style="background: var(--surface-container-low); padding: 10px 14px; border-radius: var(--radius-sm); font-size: 12px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
            <span>Unassigned Departure Rooms: <strong>${dirtyCount}</strong></span>
            <span class="badge ${dirtyCount > 0 ? 'badge-dirty' : 'badge-clean'}">${dirtyCount > 0 ? 'Action Needed' : 'Optimized'}</span>
          </div>
          <button class="btn-gold" id="manager-auto-assign-btn" style="width: 100%; padding: 14px; font-size: 13px; font-weight: 700;">
            <span class="material-symbols-outlined" style="font-size: 18px;">bolt</span> Auto-Assign All Departure Rooms Now
          </button>
        </div>

        <!-- Floor Health Gauges -->
        <div class="glass-card" style="padding: 16px;">
          <div class="label-bold" style="margin-bottom: 10px;">Floor Turnover Health</div>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
            ${['4', '3', '2', '5'].map(fl => {
              const flRooms = rooms.filter(r => r.floor === fl);
              const flClean = flRooms.filter(r => r.status === 'Clean' || r.status === 'Inspected').length;
              const flPct   = Math.round((flClean / flRooms.length) * 100);
              return `
                <div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="font-weight: 600;">Floor ${fl === '5' ? 'Penthouse (VIP)' : fl}</span>
                    <span>${flClean}/${flRooms.length} Ready (${flPct}%)</span>
                  </div>
                  <div style="width: 100%; height: 6px; background: var(--surface-container-high); border-radius: 3px; overflow: hidden;">
                    <div style="width: ${flPct}%; height: 100%; background: ${flPct === 100 ? '#2e7d32' : flPct >= 50 ? 'var(--secondary)' : '#c62828'};"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <!-- ══════════════════════════════════
           TAB 2 : ROOM GRID (Manager-only)
           ══════════════════════════════════ -->
      ${activeSubTab === 'rooms' ? `
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div class="label-bold">All Floors · ${rooms.length} Suites</div>
          <span class="badge badge-clean" style="font-size: 9px;">Live Sync Active</span>
        </div>

        <!-- Floor Picker -->
        <div class="category-pills-row">
          ${['4','3','2','5'].map(fl => `
            <button class="category-pill floor-tab-btn ${selectedFloor === fl ? 'active' : ''}" data-floor="${fl}">
              ${fl === '5' ? 'Penthouse' : 'Floor ' + fl}
            </button>
          `).join('')}
        </div>

        <!-- Quick Stats Row -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; font-size: 11px;">
          <div class="glass-card" style="padding: 8px; text-align: center;">
            <div style="font-weight: 800; font-size: 18px; color: #2e7d32;">${floorRooms.filter(r => r.status === 'Clean' || r.status === 'Inspected').length}</div>
            <div style="color: var(--outline);">Clean / Ready</div>
          </div>
          <div class="glass-card" style="padding: 8px; text-align: center;">
            <div style="font-weight: 800; font-size: 18px; color: #c62828;">${floorRooms.filter(r => r.status === 'Dirty').length}</div>
            <div style="color: var(--outline);">Turnover Due</div>
          </div>
          <div class="glass-card" style="padding: 8px; text-align: center;">
            <div style="font-weight: 800; font-size: 18px; color: '#7b1fa2';">${floorRooms.filter(r => r.status === 'In Progress').length}</div>
            <div style="color: var(--outline);">In Progress</div>
          </div>
        </div>

        <!-- Room Grid -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
          ${floorRooms.map(room => renderRoomCard(room)).join('')}
        </div>
      ` : ''}

      <!-- ══════════════════════════════════
           TAB 3 : OPERATIONS TASK QUEUE
           ══════════════════════════════════ -->
      ${activeSubTab === 'tasks' ? `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div class="label-bold">All Operations Tasks (${tasks.length})</div>
          <span class="badge badge-dirty" style="font-size: 10px;">${urgentTasks} Urgent</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${tasks.map(task => {
            const isDone = task.status === 'Completed';
            return `
              <div class="glass-card" style="padding: 14px 16px; border-left: 4px solid ${isDone ? 'var(--success)' : task.priority === 'Urgent' ? 'var(--error)' : 'var(--primary)'}; opacity: ${isDone ? '0.65' : '1'};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span class="badge ${task.priority === 'Urgent' ? 'badge-dirty' : task.priority === 'High' ? 'badge-gold' : 'badge-inspected'}" style="font-size: 9px;">${task.priority}</span>
                  <span style="font-size: 10px; color: var(--outline);">Due: ${task.timeDue}</span>
                </div>
                <h4 style="font-family: var(--font-serif); font-size: 14px; font-weight: 700; color: var(--primary); margin-bottom: 2px;">${task.title}</h4>
                <div style="font-size: 11px; color: var(--on-surface-variant); margin-bottom: 6px;">
                  Assignee: <strong>${task.assignee}</strong> · Room ${task.room}
                </div>
                <p class="body-sm" style="color: var(--on-surface-variant); line-height: 1.4; margin-bottom: 10px;">${task.details}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--surface-container-high); padding-top: 8px;">
                  <span class="badge ${isDone ? 'badge-clean' : task.status === 'In Progress' ? 'badge-progress' : 'badge-inspected'}" style="font-size: 9px;">${task.status}</span>
                  ${!isDone ? `
                    <button class="btn-primary mgr-advance-task-btn" data-id="${task.id}" style="padding: 5px 12px; font-size: 11px; background: #2e7d32;">
                      ✓ Mark Complete
                    </button>
                  ` : `<span style="font-size: 11px; color: #2e7d32; font-weight: 700;">✓ Done</span>`}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}

      <!-- ══════════════════════════════════
           TAB 4 : STAFF ALLOCATION
           ══════════════════════════════════ -->
      ${activeSubTab === 'staff' ? `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <div class="label-bold">On-Duty Staff Deployment (${staff.length})</div>
          <span class="badge badge-clean" style="font-size: 10px;">${staff.filter(s => s.status === 'On Duty').length} Active</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${staff.map(s => {
            const loadPct = Math.round((s.activeRooms / s.maxRooms) * 100);
            return `
              <div class="glass-card" style="padding: 14px 16px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 38px; height: 38px; border-radius: 50%; overflow: hidden; border: 1.5px solid var(--gold-accent);">
                      <img src="${s.avatar}" alt="${s.name}" style="width: 100%; height: 100%; object-fit: cover;" />
                    </div>
                    <div>
                      <div style="font-weight: 700; font-size: 14px; color: var(--primary);">${s.name}</div>
                      <div class="body-sm" style="font-size: 11px; color: var(--on-surface-variant);">${s.role} · Floor ${s.floor}</div>
                    </div>
                  </div>
                  <span class="badge ${s.activeRooms >= s.maxRooms ? 'badge-dirty' : 'badge-clean'}" style="font-size: 9px;">
                    ${s.activeRooms >= s.maxRooms ? 'At Capacity' : 'Available'}
                  </span>
                </div>
                <div style="margin: 8px 0;">
                  <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                    <span>Assigned: <strong>${s.activeRooms} / ${s.maxRooms}</strong></span>
                    <span style="color: var(--secondary); font-weight: 600;">Rating: ${s.score}</span>
                  </div>
                  <div style="width: 100%; height: 6px; background: var(--surface-container-high); border-radius: 3px; overflow: hidden;">
                    <div style="width: ${loadPct}%; height: 100%; background: ${loadPct >= 100 ? '#c62828' : loadPct >= 60 ? 'var(--secondary)' : '#2e7d32'};"></div>
                  </div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--surface-container-high); padding-top: 8px; font-size: 11px;">
                  <span style="color: var(--outline);">Primary Zone: Floor ${s.floor}</span>
                  <button class="btn-secondary reassign-staff-btn" data-id="${s.id}" style="padding: 4px 10px; font-size: 11px;">Reassign →</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}

      <!-- ══════════════════════════════════
           TAB 5 : MENU EDITOR
           ══════════════════════════════════ -->
      ${activeSubTab === 'menu' ? `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <div class="label-bold">Menu Items (${menu.length})</div>
          <button class="btn-primary" id="add-new-dish-btn" style="padding: 6px 12px; font-size: 11px;">+ Add New Dish</button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${menu.map(dish => `
            <div class="glass-card" style="padding: 14px 16px; display: flex; gap: 12px; align-items: center;">
              <div style="width: 60px; height: 60px; border-radius: var(--radius-sm); overflow: hidden; flex-shrink: 0; background: #333;">
                <img src="${dish.image}" alt="${dish.name}" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                  <h4 style="font-weight: 700; font-size: 13px; color: var(--primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px;">${dish.name}</h4>
                  <span style="font-weight: 800; font-size: 13px; color: var(--primary);">$${dish.price.toFixed(2)}</span>
                </div>
                <div style="font-size: 11px; color: var(--secondary); font-weight: 600; margin: 2px 0;">${dish.category} · ${dish.tag}</div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px;">
                  <span class="badge ${dish.available !== false ? 'badge-clean' : 'badge-dirty'}" style="font-size: 9px;">
                    ${dish.available !== false ? 'In Stock' : 'Sold Out'}
                  </span>
                  <div style="display: flex; gap: 6px;">
                    <button class="btn-secondary toggle-dish-avail-btn" data-id="${dish.id}" style="padding: 3px 8px; font-size: 10px;">
                      ${dish.available !== false ? 'Sell Out' : 'In Stock'}
                    </button>
                    <button class="btn-secondary edit-dish-price-btn" data-id="${dish.id}" style="padding: 3px 8px; font-size: 10px;">Edit Price</button>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- ══════════════════════════════════
           TAB 6 : INVENTORY / STOCK
           ══════════════════════════════════ -->
      ${activeSubTab === 'inventory' ? `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <div class="label-bold">Par Stock Monitor (${inventory.length} Lines)</div>
          <span class="badge badge-dirty" style="font-size: 10px;">${criticalInventory} Alerts</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${inventory.map(item => {
            const statusMap = {
              'Optimal':      { color: '#2e7d32', bg: '#e8f5e9' },
              'Low Stock':    { color: '#f57f17', bg: '#fff8e1' },
              'Critical':     { color: '#c62828', bg: '#ffebee' },
              'Out of Stock': { color: '#b71c1c', bg: '#ffebee' }
            };
            const s = statusMap[item.status] || statusMap['Optimal'];
            const pct = Math.min(100, Math.round((item.stock / (item.minThreshold * 3)) * 100));
            return `
              <div class="glass-card" style="padding: 14px 16px; border-left: 4px solid ${s.color};">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                  <h4 style="font-weight: 700; font-size: 13px; color: var(--primary); line-height: 1.3; max-width: 190px;">${item.name}</h4>
                  <span style="font-size: 10px; font-weight: 700; color: ${s.color}; background: ${s.bg}; padding: 2px 8px; border-radius: 10px;">${item.status}</span>
                </div>
                <div style="font-size: 11px; color: var(--outline); margin-bottom: 8px;">${item.category} · ${item.location}</div>
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
                  <span>In Stock: <strong>${item.stock} ${item.unit}</strong></span>
                  <span style="color: var(--outline);">Min Par: ${item.minThreshold}</span>
                </div>
                <div style="width: 100%; height: 6px; background: var(--surface-container-high); border-radius: 3px; overflow: hidden; margin-bottom: 10px;">
                  <div style="width: ${pct}%; height: 100%; background: ${s.color}; transition: width 0.4s;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  ${item.status === 'Critical' || item.status === 'Out of Stock' ? `
                    <button class="btn-secondary mgr-reorder-btn" data-id="${item.id}" style="padding: 4px 10px; font-size: 11px;">
                      <span class="material-symbols-outlined" style="font-size: 13px;">local_shipping</span> Create PO
                    </button>
                  ` : `<span></span>`}
                  <div style="display: flex; gap: 6px; align-items: center;">
                    <button class="btn-secondary mgr-inv-dec-btn" data-id="${item.id}" data-delta="-1" style="width: 28px; height: 28px; padding: 0; font-size: 16px; display: flex; align-items: center; justify-content: center;">−</button>
                    <span style="font-size: 13px; font-weight: 700; min-width: 28px; text-align: center;">${item.stock}</span>
                    <button class="btn-secondary mgr-inv-inc-btn" data-id="${item.id}" data-delta="1" style="width: 28px; height: 28px; padding: 0; font-size: 16px; display: flex; align-items: center; justify-content: center;">+</button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}

      <!-- ══════════════════════════════════
           TAB 7 : COMPLAINTS
           ══════════════════════════════════ -->
      ${activeSubTab === 'complaints' ? `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <div class="label-bold">Guest Service Escalations (${complaints.length})</div>
          <span class="badge badge-dirty" style="font-size: 10px;">${openComplaints} Pending Review</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${complaints.map(comp => {
            const isResolved = comp.status === 'Resolved';
            const isHigh     = comp.severity === 'High';
            return `
              <div class="glass-card" style="padding: 16px; border-left: 4px solid ${isResolved ? 'var(--success)' : isHigh ? 'var(--error)' : 'var(--warning)'};">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                  <div>
                    <span class="badge ${isHigh ? 'badge-dirty' : 'badge-gold'}" style="font-size: 9px;">${comp.severity} Priority</span>
                    <span class="badge badge-vip" style="font-size: 9px; margin-left: 4px;">Room ${comp.room}</span>
                  </div>
                  <span class="badge ${isResolved ? 'badge-clean' : 'badge-inspected'}" style="font-size: 9px;">${comp.status}</span>
                </div>
                <h4 style="font-family: var(--font-serif); font-size: 15px; font-weight: 700; color: var(--primary); margin-bottom: 2px;">
                  ${comp.category} — ${comp.guest}
                </h4>
                <div style="font-size: 10px; color: var(--outline); margin-bottom: 6px;">
                  Reported: ${comp.reportedAt} · Assigned: ${comp.assignedStaff}
                </div>
                <p class="body-sm" style="color: var(--on-surface-variant); margin-bottom: 10px; line-height: 1.4;">"${comp.description}"</p>
                ${comp.compensationPerk && comp.compensationPerk !== 'None' ? `
                  <div style="background: var(--surface-container-low); padding: 8px 12px; border-radius: var(--radius-sm); font-size: 11px; margin-bottom: 10px; color: var(--secondary); font-weight: 600;">
                    🎁 Compensation Perk: ${comp.compensationPerk}
                  </div>
                ` : ''}
                <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--surface-container-high); padding-top: 10px;">
                  <button class="btn-secondary call-guest-btn" data-room="${comp.room}" style="padding: 4px 10px; font-size: 11px;">
                    <span class="material-symbols-outlined" style="font-size: 14px;">call</span> Call Guest
                  </button>
                  ${!isResolved ? `
                    <button class="btn-primary resolve-complaint-btn" data-id="${comp.id}" style="padding: 4px 12px; font-size: 11px; background: #2e7d32;">
                      ✓ Resolve & Grant Perk
                    </button>
                  ` : `<span style="font-size: 11px; color: #2e7d32; font-weight: 700;">✓ Resolved & Closed</span>`}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

export function bindAdminManagerEvents() {
  // Sub-Tab Switching (pill row)
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => store.setAdminSubTab(btn.dataset.tab));
  });

  // Floor Picker (inside Room Grid tab)
  document.querySelectorAll('.floor-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => store.setFloor(btn.dataset.floor));
  });

  // Room Card → open room details (simple toast for now)
  document.querySelectorAll('.room-card-mgr').forEach(card => {
    card.addEventListener('click', () => {
      const id   = card.dataset.roomId;
      const room = store.state.rooms.find(r => r.id === id);
      if (!room) return;
      showToast(`Room ${id} — ${room.status}`, `Guest: ${room.guest} · Assigned to: ${room.housekeeper}`, 'bed');
    });
  });

  // Auto-Assign Button
  const autoAssignBtn = document.getElementById('manager-auto-assign-btn');
  if (autoAssignBtn) {
    autoAssignBtn.addEventListener('click', () => {
      const result = store.autoAssignRooms();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      showToast(
        'Auto-Assign Complete',
        `${result.assignedCount} rooms balanced across ${result.staffCount} on-duty staff.`,
        'auto_awesome'
      );
    });
  }

  // Mark Task Complete
  document.querySelectorAll('.mgr-advance-task-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      store.updateTaskStatus(btn.dataset.id, 'Completed');
      showToast('Task Completed', `Task #${btn.dataset.id} marked complete by manager.`, 'check_circle');
    });
  });

  // Staff Reassign
  document.querySelectorAll('.reassign-staff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = store.state.staffList.find(x => x.id === btn.dataset.id);
      if (s) showToast('Reassignment Initiated', `${s.name} reassignment flow would open here.`, 'swap_horiz');
    });
  });

  // Add Dish
  const addDishBtn = document.getElementById('add-new-dish-btn');
  if (addDishBtn) {
    addDishBtn.addEventListener('click', () => {
      const name = prompt('Enter new gourmet dish name:');
      if (name) {
        const price    = prompt('Enter price ($):', '36.00');
        const category = prompt('Category (Breakfast / Mains / Desserts / Beverages):', 'Mains');
        store.addMenuItem({ name, price, category, tag: "Chef's Special" });
        showToast('Dish Added', `${name} ($${price}) added to in-room dining menu.`, 'restaurant');
      }
    });
  }

  // Toggle Dish Availability
  document.querySelectorAll('.toggle-dish-avail-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      store.toggleMenuItemAvailability(btn.dataset.id);
      const dish = store.state.menu.find(d => d.id === btn.dataset.id);
      showToast('Menu Updated', `${dish.name} is now ${dish.available ? 'IN STOCK' : 'SOLD OUT'}.`, 'inventory');
    });
  });

  // Edit Dish Price
  document.querySelectorAll('.edit-dish-price-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dish     = store.state.menu.find(d => d.id === btn.dataset.id);
      const newPrice = prompt(`New price for ${dish.name}:`, dish.price.toFixed(2));
      if (newPrice && !isNaN(parseFloat(newPrice))) {
        store.updateMenuItem(btn.dataset.id, { price: parseFloat(newPrice) });
        showToast('Price Updated', `${dish.name} → $${parseFloat(newPrice).toFixed(2)}.`, 'price_change');
      }
    });
  });

  // Inventory Adjust
  document.querySelectorAll('.mgr-inv-dec-btn, .mgr-inv-inc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const delta = parseInt(btn.dataset.delta, 10);
      store.updateInventoryStock(btn.dataset.id, delta);
    });
  });

  // Inventory Create PO
  document.querySelectorAll('.mgr-reorder-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = store.state.inventory.find(i => i.id === btn.dataset.id);
      if (item) showToast('Purchase Order Created', `PO for ${item.name} submitted to procurement.`, 'local_shipping');
    });
  });

  // Resolve Complaint
  document.querySelectorAll('.resolve-complaint-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const perk  = prompt('Compensation perk for guest:', 'Complimentary Champagne & Fruit Basket');
      const notes = prompt('Resolution notes:', 'Manager personally visited and resolved the issue.');
      store.resolveComplaint(btn.dataset.id, notes, perk);
      showToast('Complaint Resolved', `Grievance #${btn.dataset.id} resolved with "${perk}".`, 'verified');
    });
  });

  // Call Guest
  document.querySelectorAll('.call-guest-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Connecting to Suite', `Dialing Room ${btn.dataset.room} direct executive line...`, 'ring_volume');
    });
  });
}
