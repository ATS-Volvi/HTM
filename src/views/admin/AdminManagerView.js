import { store } from '../../state/store.js';
import { showToast } from '../../components/Toast.js';
import confetti from 'canvas-confetti';

// ── Telemetry data (building systems) ──────────────────────────────────────
const telemetry = [
  { title: 'Chiller & HVAC Loop',    status: 'Optimal',         val: '21.4°C / 48% RH', icon: 'ac_unit',    color: 'var(--success)' },
  { title: 'Domestic Water Pumps',   status: 'Optimal',         val: '5.2 Bar Flow',     icon: 'water_drop', color: 'var(--success)' },
  { title: 'High-Speed Wi-Fi APs',   status: 'Active (99.8%)',  val: '64/64 Online',     icon: 'wifi',       color: 'var(--success)' },
  { title: 'Smart Lock Telemetry',   status: 'Low Battery',     val: 'Room 303 (12%)',   icon: 'lock_open',  color: 'var(--error)'   }
];

// ── Shift roster ─────────────────────────────────────────────────────────────
const shiftRoster = [
  { name: 'Elena Gomez',  role: 'Floor 4 Lead',       shift: 'Morning (07:00–15:30)', score: '99.4%', roomsDone: 14, status: 'On Duty',  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
  { name: 'Maria Santos', role: 'VIP Senior Butler',   shift: 'Morning (07:00–15:30)', score: '98.8%', roomsDone: 11, status: 'On Duty',  avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80' },
  { name: 'Pierre Dubois',role: 'Head In-Room Butler', shift: 'All-Day (08:00–16:30)', score: '99.1%', roomsDone: 22, status: 'On Duty',  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
  { name: 'Carlos Ruiz',  role: 'Turnaround Spec.',   shift: 'Evening (15:00–23:30)', score: '96.5%', roomsDone: 9,  status: 'Upcoming', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { name: 'Fatima Zahra', role: 'Floor 3 Lead',        shift: 'Morning (07:00–15:30)', score: '97.9%', roomsDone: 16, status: 'On Duty',  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' },
  { name: 'David Kim',    role: 'Floor 2 Lead',        shift: 'Morning (07:00–15:30)', score: '97.2%', roomsDone: 18, status: 'On Duty',  avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' }
];

// ── Small helper: room card ──────────────────────────────────────────────────
function roomCard(room) {
  const colorMap = {
    'Clean':       { border: '#2e7d32', badge: 'badge-clean'     },
    'Inspected':   { border: '#0d47a1', badge: 'badge-inspected' },
    'Dirty':       { border: '#c62828', badge: 'badge-dirty'     },
    'DND':         { border: '#e65100', badge: 'badge-dnd'       },
    'In Progress': { border: '#6a1b9a', badge: 'badge-progress'  },
  };
  const cfg = colorMap[room.status] || { border: 'var(--outline)', badge: 'badge-inspected' };
  return `
    <div class="glass-card room-card-mgr" data-room-id="${room.id}"
         style="padding: 12px 14px; border-left: 4px solid ${cfg.border}; cursor: pointer;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;">
        <div>
          <span style="font-size:18px;font-weight:800;color:var(--primary);">${room.id}</span>
          ${room.vip ? `<span class="badge badge-vip" style="font-size:9px;margin-left:6px;">VIP</span>` : ''}
          ${room.dnd ? `<span class="badge badge-dnd" style="font-size:9px;margin-left:4px;">DND</span>` : ''}
        </div>
        <span class="badge ${cfg.badge}" style="font-size:9px;">${room.status}</span>
      </div>
      <div style="font-size:11px;color:var(--on-surface-variant);">${room.type}</div>
      <div style="font-size:12px;font-weight:600;color:var(--primary);margin:4px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${room.guest}</div>
      <div style="font-size:10px;color:var(--outline);display:flex;align-items:center;gap:4px;">
        <span class="material-symbols-outlined" style="font-size:12px;">person</span>
        ${room.housekeeper}
      </div>
    </div>`;
}

// ═══════════════════════════════════════════════════════════════════════════
export function renderAdminManagerView(state) {
  const tab        = state.adminSubTab || 'overview';
  const menu       = state.menu;
  const staff      = state.staffList;
  const complaints = state.complaints;
  const rooms      = state.rooms;
  const tasks      = state.tasks;
  const inventory  = state.inventory;
  const floor      = state.selectedFloor || '4';

  const totalRooms    = rooms.length;
  const occupiedRooms = rooms.filter(r => r.guest !== 'Vacant / Ready' && r.guest !== 'Vacant / Departure').length;
  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);
  const dirtyCount    = rooms.filter(r => r.status === 'Dirty').length;
  const openComp      = complaints.filter(c => c.status !== 'Resolved').length;
  const urgentTasks   = tasks.filter(t => t.priority === 'Urgent' && t.status !== 'Completed').length;
  const criticalStock = inventory.filter(i => i.status === 'Critical' || i.status === 'Low Stock').length;
  const floorRooms    = rooms.filter(r => r.floor === floor);
  const maintTasks    = tasks.filter(t => t.category === 'Maintenance');

  return `
    <div class="app-content animate-fade-in" style="padding-bottom: 50px;">

      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <div class="label-bold" style="color:var(--secondary);">Executive Management Portal</div>
          <h2 class="display-title" style="font-size:24px;">General Manager</h2>
        </div>
        <div style="text-align:right;">
          <span class="badge badge-gold" style="font-size:10px;">Executive Command</span>
          <div style="font-size:11px;color:var(--on-surface-variant);margin-top:2px;">The Grand Astoria</div>
        </div>
      </div>

      <!-- ════════════════════════════════════════
           TAB 1 : OVERVIEW & INTELLIGENT AUTO-ASSIGN
           ════════════════════════════════════════ -->
      ${tab === 'overview' ? `
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
          <div class="glass-card" style="padding:12px 14px;">
            <div class="label-bold" style="font-size:9px;color:var(--secondary);">Occupancy Rate</div>
            <div style="font-size:22px;font-weight:800;color:var(--primary);margin:2px 0;">${occupancyRate}%</div>
            <div style="font-size:10px;color:#2e7d32;">${occupiedRooms} / ${totalRooms} Suites Active</div>
          </div>
          <div class="glass-card" style="padding:12px 14px;">
            <div class="label-bold" style="font-size:9px;color:var(--secondary);">Dining Revenue</div>
            <div style="font-size:22px;font-weight:800;color:var(--primary);margin:2px 0;">$3,420.50</div>
            <div style="font-size:10px;color:#2e7d32;">↑ 14% vs yesterday</div>
          </div>
          <div class="glass-card" style="padding:12px 14px;">
            <div class="label-bold" style="font-size:9px;color:${dirtyCount>0?'var(--error)':'var(--success)'};">Turnover Queue</div>
            <div style="font-size:22px;font-weight:800;color:${dirtyCount>0?'var(--error)':'var(--primary)'};margin:2px 0;">${dirtyCount} Rooms</div>
            <div style="font-size:10px;color:var(--on-surface-variant);">${dirtyCount>0?'Awaiting assignment':'All rooms serviced'}</div>
          </div>
          <div class="glass-card" style="padding:12px 14px;">
            <div class="label-bold" style="font-size:9px;color:${openComp>0?'var(--warning)':'var(--success)'};">Open Escalations</div>
            <div style="font-size:22px;font-weight:800;color:${openComp>0?'var(--warning)':'var(--primary)'};margin:2px 0;">${openComp} Tickets</div>
            <div style="font-size:10px;color:var(--on-surface-variant);">Requires resolution</div>
          </div>
        </div>

        <!-- Auto-Assign Card -->
        <div class="glass-card" style="padding:18px;border-left:4px solid var(--secondary);background:linear-gradient(135deg,#fff 0%,#fffdf8 100%);">
          <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;">
            <div style="width:42px;height:42px;border-radius:50%;background:var(--secondary-container);display:flex;align-items:center;justify-content:center;color:var(--on-secondary-container);flex-shrink:0;">
              <span class="material-symbols-outlined">auto_awesome</span>
            </div>
            <div>
              <h3 class="headline-md" style="font-size:17px;margin-bottom:2px;">Intelligent Turnover Auto-Assign</h3>
              <p class="body-sm" style="color:var(--on-surface-variant);line-height:1.4;">
                Distributes all dirty departure suites evenly across on-duty housekeepers by floor proximity, VIP priority, and workload balance.
              </p>
            </div>
          </div>
          <div style="background:var(--surface-container-low);padding:10px 14px;border-radius:var(--radius-sm);font-size:12px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;">
            <span>Unassigned Departure Rooms: <strong>${dirtyCount}</strong></span>
            <span class="badge ${dirtyCount>0?'badge-dirty':'badge-clean'}">${dirtyCount>0?'Action Needed':'Optimized'}</span>
          </div>
          <button class="btn-gold" id="manager-auto-assign-btn" style="width:100%;padding:14px;font-size:13px;font-weight:700;">
            <span class="material-symbols-outlined" style="font-size:18px;">bolt</span> Auto-Assign All Departure Rooms Now
          </button>
        </div>

        <!-- Floor Health -->
        <div class="glass-card" style="padding:16px;">
          <div class="label-bold" style="margin-bottom:10px;">Floor Turnover Health</div>
          <div style="display:flex;flex-direction:column;gap:8px;font-size:12px;">
            ${['4','3','2','5'].map(fl => {
              const flR  = rooms.filter(r => r.floor === fl);
              const ok   = flR.filter(r => r.status === 'Clean' || r.status === 'Inspected').length;
              const pct  = Math.round((ok / flR.length) * 100);
              return `
                <div>
                  <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                    <span style="font-weight:600;">Floor ${fl==='5'?'Penthouse (VIP)':fl}</span>
                    <span>${ok}/${flR.length} Ready (${pct}%)</span>
                  </div>
                  <div style="width:100%;height:6px;background:var(--surface-container-high);border-radius:3px;overflow:hidden;">
                    <div style="width:${pct}%;height:100%;background:${pct===100?'#2e7d32':pct>=50?'var(--secondary)':'#c62828'};"></div>
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <!-- ════════════════════════════════════════
           TAB 2 : ROOM GRID
           ════════════════════════════════════════ -->
      ${tab === 'rooms' ? `
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div class="label-bold">All Floors · ${rooms.length} Suites</div>
          <span class="badge badge-clean" style="font-size:9px;">Live Sync Active</span>
        </div>

        <div class="category-pills-row">
          ${['4','3','2','5'].map(fl => `
            <button class="category-pill floor-tab-btn ${floor===fl?'active':''}" data-floor="${fl}">
              ${fl==='5'?'Penthouse':'Floor '+fl}
            </button>`).join('')}
        </div>

        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;font-size:11px;">
          <div class="glass-card" style="padding:8px;text-align:center;">
            <div style="font-weight:800;font-size:18px;color:#2e7d32;">${floorRooms.filter(r=>r.status==='Clean'||r.status==='Inspected').length}</div>
            <div style="color:var(--outline);">Clean</div>
          </div>
          <div class="glass-card" style="padding:8px;text-align:center;">
            <div style="font-weight:800;font-size:18px;color:#c62828;">${floorRooms.filter(r=>r.status==='Dirty').length}</div>
            <div style="color:var(--outline);">Turnover</div>
          </div>
          <div class="glass-card" style="padding:8px;text-align:center;">
            <div style="font-weight:800;font-size:18px;color:#6a1b9a;">${floorRooms.filter(r=>r.status==='In Progress').length}</div>
            <div style="color:var(--outline);">In Progress</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
          ${floorRooms.map(r => roomCard(r)).join('')}
        </div>
      ` : ''}

      <!-- ════════════════════════════════════════
           TAB 3 : TASK QUEUE (all operations)
           ════════════════════════════════════════ -->
      ${tab === 'tasks' ? `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="label-bold">All Operations Tasks (${tasks.length})</div>
          <span class="badge badge-dirty" style="font-size:10px;">${urgentTasks} Urgent</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${tasks.map(task => {
            const done = task.status === 'Completed';
            return `
              <div class="glass-card" style="padding:14px 16px;border-left:4px solid ${done?'var(--success)':task.priority==='Urgent'?'var(--error)':'var(--primary)'};opacity:${done?'0.65':'1'};">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                  <span class="badge ${task.priority==='Urgent'?'badge-dirty':task.priority==='High'?'badge-gold':'badge-inspected'}" style="font-size:9px;">${task.priority}</span>
                  <span style="font-size:10px;color:var(--outline);">Due: ${task.timeDue}</span>
                </div>
                <h4 style="font-family:var(--font-serif);font-size:14px;font-weight:700;color:var(--primary);margin-bottom:2px;">${task.title}</h4>
                <div style="font-size:11px;color:var(--on-surface-variant);margin-bottom:6px;">
                  Assignee: <strong>${task.assignee}</strong> · Room ${task.room}
                </div>
                <p class="body-sm" style="color:var(--on-surface-variant);line-height:1.4;margin-bottom:10px;">${task.details}</p>
                <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--surface-container-high);padding-top:8px;">
                  <span class="badge ${done?'badge-clean':task.status==='In Progress'?'badge-progress':'badge-inspected'}" style="font-size:9px;">${task.status}</span>
                  ${!done?`
                    <button class="btn-primary mgr-advance-task-btn" data-id="${task.id}"
                      style="padding:5px 12px;font-size:11px;background:#2e7d32;">✓ Mark Complete</button>
                  `:`<span style="font-size:11px;color:#2e7d32;font-weight:700;">✓ Done</span>`}
                </div>
              </div>`;
          }).join('')}
        </div>
      ` : ''}

      <!-- ════════════════════════════════════════
           TAB 4 : MAINTENANCE (Engineering)
           ════════════════════════════════════════ -->
      ${tab === 'maintenance' ? `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div>
            <div class="label-bold" style="color:var(--error);">Engineering Operations</div>
            <h3 class="display-title" style="font-size:20px;">Maintenance Hub</h3>
          </div>
          <button class="btn-secondary" id="run-telemetry-btn" style="padding:4px 10px;font-size:11px;">↻ Diagnostics</button>
        </div>

        <!-- Building Telemetry -->
        <div class="glass-card" style="padding:16px;">
          <div class="label-bold" style="margin-bottom:12px;">Building System Telemetry</div>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">
            ${telemetry.map(item => `
              <div style="background:var(--surface-container-low);padding:10px 12px;border-radius:var(--radius-sm);border:1px solid var(--outline-variant);">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
                  <span class="material-symbols-outlined" style="font-size:18px;color:${item.color};">${item.icon}</span>
                  <span style="font-size:9px;font-weight:700;color:${item.color};">${item.status}</span>
                </div>
                <div style="font-weight:700;font-size:12px;color:var(--primary);">${item.title}</div>
                <div style="font-size:11px;color:var(--on-surface-variant);margin-top:2px;">${item.val}</div>
              </div>`).join('')}
          </div>
        </div>

        <!-- Active Maintenance Dispatches -->
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div class="label-bold">Active Repair Dispatches (${maintTasks.length})</div>
          ${maintTasks.length === 0 ? `
            <div class="glass-card" style="padding:20px;text-align:center;color:var(--on-surface-variant);">
              All facility systems operating nominally.
            </div>` : maintTasks.map(task => `
            <div class="glass-card" style="padding:16px;border-left:4px solid var(--error);">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <span class="badge badge-dirty" style="font-size:9px;">Room ${task.room}</span>
                <span style="font-size:11px;font-weight:600;color:var(--on-surface-variant);">${task.timeDue}</span>
              </div>
              <h4 style="font-family:var(--font-serif);font-size:15px;font-weight:700;color:var(--primary);">${task.title}</h4>
              <p class="body-sm" style="color:var(--on-surface-variant);margin:6px 0 10px 0;">${task.details}</p>
              <div style="display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--surface-container-high);padding-top:8px;">
                <span style="font-size:11px;color:var(--outline);">Technician: <strong>${task.assignee}</strong></span>
                <button class="btn-primary mgr-advance-task-btn" data-id="${task.id}"
                  style="padding:4px 10px;font-size:11px;background:var(--primary);">Sign Off & Close</button>
              </div>
            </div>`).join('')}
        </div>
      ` : ''}

      <!-- ════════════════════════════════════════
           TAB 5 : STAFF ALLOCATION & KPIs
           ════════════════════════════════════════ -->
      ${tab === 'staff' ? `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <div class="label-bold">On-Duty Staff Deployment (${shiftRoster.length})</div>
          <span class="badge badge-clean" style="font-size:10px;">${shiftRoster.filter(s=>s.status==='On Duty').length} Active</span>
        </div>

        <!-- KPI Summary Row -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
          <div class="glass-card" style="padding:10px;text-align:center;">
            <div class="label-bold" style="font-size:9px;">Turnaround</div>
            <div style="font-size:18px;font-weight:800;color:var(--primary);margin-top:2px;">24 min</div>
            <div style="font-size:9px;color:#2e7d32;">↑ 8% faster</div>
          </div>
          <div class="glass-card" style="padding:10px;text-align:center;">
            <div class="label-bold" style="font-size:9px;">Pass Rate</div>
            <div style="font-size:18px;font-weight:800;color:var(--primary);margin-top:2px;">99.2%</div>
            <div style="font-size:9px;color:#2e7d32;">5-Star Audited</div>
          </div>
          <div class="glass-card" style="padding:10px;text-align:center;">
            <div class="label-bold" style="font-size:9px;">Active Staff</div>
            <div style="font-size:18px;font-weight:800;color:var(--secondary);margin-top:2px;">${shiftRoster.filter(s=>s.status==='On Duty').length} On Duty</div>
            <div style="font-size:9px;color:var(--outline);">Wing A & B</div>
          </div>
        </div>

        <!-- Shift Roster Cards (with workload) -->
        <div class="label-bold">Shift Roster — Today (Aug 31)</div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          ${shiftRoster.map((s, idx) => {
            const storeStaff = staff.find(x => x.name === s.name) || { activeRooms: s.roomsDone, maxRooms: 20 };
            const loadPct = Math.min(100, Math.round((storeStaff.activeRooms / storeStaff.maxRooms) * 100));
            return `
              <div class="glass-card" style="padding:14px 16px;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                  <div style="display:flex;align-items:center;gap:12px;">
                    <div style="position:relative;">
                      <div style="width:40px;height:40px;border-radius:50%;overflow:hidden;border:1.5px solid var(--gold-accent);">
                        <img src="${s.avatar}" alt="${s.name}" style="width:100%;height:100%;object-fit:cover;" />
                      </div>
                      ${idx===0?'<span style="position:absolute;bottom:-2px;right:-2px;font-size:12px;">👑</span>':''}
                    </div>
                    <div>
                      <div style="font-weight:700;font-size:14px;color:var(--primary);">${s.name}</div>
                      <div class="body-sm" style="font-size:11px;color:var(--on-surface-variant);">${s.role} · ${s.shift}</div>
                    </div>
                  </div>
                  <div style="text-align:right;">
                    <span class="badge ${s.status==='On Duty'?'badge-clean':'badge-inspected'}" style="font-size:9px;">${s.status}</span>
                    <div style="font-size:11px;font-weight:700;color:var(--secondary);margin-top:2px;">${s.roomsDone} rooms · ${s.score}</div>
                  </div>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px;">
                  <span>Assigned: <strong>${storeStaff.activeRooms} / ${storeStaff.maxRooms}</strong></span>
                  <span style="color:${loadPct>=100?'#c62828':loadPct>=60?'var(--secondary)':'#2e7d32'};font-weight:700;">${loadPct>=100?'At Capacity':loadPct>=60?'Moderate':'Available'}</span>
                </div>
                <div style="width:100%;height:6px;background:var(--surface-container-high);border-radius:3px;overflow:hidden;">
                  <div style="width:${loadPct}%;height:100%;background:${loadPct>=100?'#c62828':loadPct>=60?'var(--secondary)':'#2e7d32'};"></div>
                </div>
                <div style="display:flex;justify-content:flex-end;padding-top:8px;">
                  <button class="btn-secondary reassign-staff-btn" data-name="${s.name}"
                    style="padding:4px 10px;font-size:11px;">Reassign →</button>
                </div>
              </div>`;
          }).join('')}
        </div>

        <!-- Shift Handover Log -->
        <div class="glass-card" style="padding:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <div class="label-bold">Supervisor Shift Handover Log</div>
            <button class="btn-secondary" id="submit-handover-btn" style="padding:4px 10px;font-size:11px;">+ Handover Note</button>
          </div>
          <div style="background:var(--surface-container-low);padding:12px;border-radius:var(--radius-sm);font-size:12px;line-height:1.6;color:var(--on-surface);">
            <strong>07:00 AM — Morning Briefing:</strong><br/>
            • Suite 501 (Presidential) requires vintage Champagne setup at 12:00 PM.<br/>
            • Suite 402 (Mr. Harrison) requested extra plush towels and lavender mist.<br/>
            • HVAC inspection ongoing for Room 303 thermostat sensor.
          </div>
        </div>
      ` : ''}

      <!-- ════════════════════════════════════════
           TAB 6 : INVENTORY & PAR STOCK CONTROL
           ════════════════════════════════════════ -->
      ${tab === 'inventory' ? `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <div class="label-bold">Par Stock Monitor (${inventory.length} Lines)</div>
          <span class="badge badge-dirty" style="font-size:10px;">${criticalStock} Alerts</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${inventory.map(item => {
            const sm = {
              'Optimal':      { color: '#2e7d32', bg: '#e8f5e9' },
              'Low Stock':    { color: '#f57f17', bg: '#fff8e1' },
              'Critical':     { color: '#c62828', bg: '#ffebee' },
              'Out of Stock': { color: '#b71c1c', bg: '#ffebee' }
            };
            const s   = sm[item.status] || sm['Optimal'];
            const pct = Math.min(100, Math.round((item.stock / (item.minThreshold * 3)) * 100));
            return `
              <div class="glass-card" style="padding:14px 16px;border-left:4px solid ${s.color};">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;">
                  <h4 style="font-weight:700;font-size:13px;color:var(--primary);line-height:1.3;max-width:190px;">${item.name}</h4>
                  <span style="font-size:10px;font-weight:700;color:${s.color};background:${s.bg};padding:2px 8px;border-radius:10px;">${item.status}</span>
                </div>
                <div style="font-size:11px;color:var(--outline);margin-bottom:8px;">${item.category} · ${item.location}</div>
                <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;">
                  <span>In Stock: <strong>${item.stock} ${item.unit}</strong></span>
                  <span style="color:var(--outline);">Min Par: ${item.minThreshold}</span>
                </div>
                <div style="width:100%;height:6px;background:var(--surface-container-high);border-radius:3px;overflow:hidden;margin-bottom:10px;">
                  <div style="width:${pct}%;height:100%;background:${s.color};transition:width 0.4s;"></div>
                </div>
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  ${(item.status==='Critical'||item.status==='Out of Stock') ? `
                    <button class="btn-secondary mgr-reorder-btn" data-id="${item.id}"
                      style="padding:4px 10px;font-size:11px;">
                      <span class="material-symbols-outlined" style="font-size:13px;vertical-align:-3px;">local_shipping</span> Create PO
                    </button>` : `<span></span>`}
                  <div style="display:flex;gap:6px;align-items:center;">
                    <button class="btn-secondary mgr-inv-adj-btn" data-id="${item.id}" data-delta="-5"
                      style="padding:0 8px;height:28px;font-size:12px;">−5</button>
                    <button class="btn-secondary mgr-inv-adj-btn" data-id="${item.id}" data-delta="-1"
                      style="padding:0 8px;height:28px;font-size:12px;">−1</button>
                    <span style="font-size:13px;font-weight:700;min-width:28px;text-align:center;">${item.stock}</span>
                    <button class="btn-secondary mgr-inv-adj-btn" data-id="${item.id}" data-delta="1"
                      style="padding:0 8px;height:28px;font-size:12px;">+1</button>
                    <button class="btn-secondary mgr-inv-adj-btn" data-id="${item.id}" data-delta="10"
                      style="padding:0 8px;height:28px;font-size:12px;">+10</button>
                  </div>
                </div>
              </div>`;
          }).join('')}
        </div>
      ` : ''}

      <!-- ════════════════════════════════════════
           TAB 7 : MENU EDITOR
           ════════════════════════════════════════ -->
      ${tab === 'menu' ? `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <div class="label-bold">In-Room Dining Menu (${menu.length} Items)</div>
          <button class="btn-primary" id="add-new-dish-btn" style="padding:6px 12px;font-size:11px;">+ Add Dish</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          ${menu.map(dish => `
            <div class="glass-card" style="padding:14px 16px;display:flex;gap:12px;align-items:center;">
              <div style="width:60px;height:60px;border-radius:var(--radius-sm);overflow:hidden;flex-shrink:0;background:#eee;">
                <img src="${dish.image}" alt="${dish.name}" style="width:100%;height:100%;object-fit:cover;" />
              </div>
              <div style="flex:1;min-width:0;">
                <div style="display:flex;justify-content:space-between;align-items:baseline;">
                  <h4 style="font-weight:700;font-size:13px;color:var(--primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px;">${dish.name}</h4>
                  <span style="font-weight:800;font-size:13px;color:var(--primary);">$${dish.price.toFixed(2)}</span>
                </div>
                <div style="font-size:11px;color:var(--secondary);font-weight:600;margin:2px 0;">${dish.category} · ${dish.tag}</div>
                <div style="display:flex;align-items:center;justify-content:space-between;margin-top:6px;">
                  <span class="badge ${dish.available!==false?'badge-clean':'badge-dirty'}" style="font-size:9px;">
                    ${dish.available!==false?'In Stock':'Sold Out'}
                  </span>
                  <div style="display:flex;gap:6px;">
                    <button class="btn-secondary toggle-dish-avail-btn" data-id="${dish.id}"
                      style="padding:3px 8px;font-size:10px;">${dish.available!==false?'Mark Sold Out':'Mark In Stock'}</button>
                    <button class="btn-secondary edit-dish-price-btn" data-id="${dish.id}"
                      style="padding:3px 8px;font-size:10px;">Edit Price</button>
                  </div>
                </div>
              </div>
            </div>`).join('')}
        </div>
      ` : ''}

      <!-- ════════════════════════════════════════
           TAB 8 : GUEST COMPLAINTS & ESCALATIONS
           ════════════════════════════════════════ -->
      ${tab === 'complaints' ? `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <div class="label-bold">Guest Service Escalations (${complaints.length})</div>
          <span class="badge badge-dirty" style="font-size:10px;">${openComp} Pending Review</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          ${complaints.map(comp => {
            const resolved = comp.status === 'Resolved';
            const high     = comp.severity === 'High';
            return `
              <div class="glass-card" style="padding:16px;border-left:4px solid ${resolved?'var(--success)':high?'var(--error)':'var(--warning)'};">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
                  <div>
                    <span class="badge ${high?'badge-dirty':'badge-gold'}" style="font-size:9px;">${comp.severity} Priority</span>
                    <span class="badge badge-vip" style="font-size:9px;margin-left:4px;">Room ${comp.room}</span>
                  </div>
                  <span class="badge ${resolved?'badge-clean':'badge-inspected'}" style="font-size:9px;">${comp.status}</span>
                </div>
                <h4 style="font-family:var(--font-serif);font-size:15px;font-weight:700;color:var(--primary);margin-bottom:2px;">
                  ${comp.category} — ${comp.guest}
                </h4>
                <div style="font-size:10px;color:var(--outline);margin-bottom:6px;">
                  Reported: ${comp.reportedAt} · Assigned: ${comp.assignedStaff}
                </div>
                <p class="body-sm" style="color:var(--on-surface-variant);margin-bottom:10px;line-height:1.4;">"${comp.description}"</p>
                ${comp.compensationPerk && comp.compensationPerk!=='None' ? `
                  <div style="background:var(--surface-container-low);padding:8px 12px;border-radius:var(--radius-sm);font-size:11px;margin-bottom:10px;color:var(--secondary);font-weight:600;">
                    🎁 Compensation Perk: ${comp.compensationPerk}
                  </div>` : ''}
                <div style="display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--surface-container-high);padding-top:10px;">
                  <button class="btn-secondary call-guest-btn" data-room="${comp.room}"
                    style="padding:4px 10px;font-size:11px;">
                    <span class="material-symbols-outlined" style="font-size:14px;">call</span> Call Guest
                  </button>
                  ${!resolved ? `
                    <button class="btn-primary resolve-complaint-btn" data-id="${comp.id}"
                      style="padding:4px 12px;font-size:11px;background:#2e7d32;">✓ Resolve & Grant Perk</button>
                  ` : `<span style="font-size:11px;color:#2e7d32;font-weight:700;">✓ Resolved & Closed</span>`}
                </div>
              </div>`;
          }).join('')}
        </div>
      ` : ''}

    </div>
  `;
}

// ═══════════════════════════════════════════════════════════════════════════
export function bindAdminManagerEvents() {
  // Auto-Assign
  const autoBtn = document.getElementById('manager-auto-assign-btn');
  if (autoBtn) {
    autoBtn.addEventListener('click', () => {
      const result = store.autoAssignRooms();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      showToast('Auto-Assign Complete', `${result.assignedCount} rooms assigned across ${result.staffCount} on-duty staff.`, 'auto_awesome');
    });
  }

  // Floor picker (Room Grid tab)
  document.querySelectorAll('.floor-tab-btn').forEach(btn =>
    btn.addEventListener('click', () => store.setFloor(btn.dataset.floor))
  );

  // Room card tap → toast
  document.querySelectorAll('.room-card-mgr').forEach(card =>
    card.addEventListener('click', () => {
      const room = store.state.rooms.find(r => r.id === card.dataset.roomId);
      if (room) showToast(`Room ${room.id} — ${room.status}`, `Guest: ${room.guest} · Staff: ${room.housekeeper}`, 'bed');
    })
  );

  // Mark Task / Maintenance Complete
  document.querySelectorAll('.mgr-advance-task-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      store.updateTaskStatus(btn.dataset.id, 'Completed');
      showToast('Task Completed', `Task #${btn.dataset.id} signed off by manager.`, 'check_circle');
    })
  );

  // Telemetry Diagnostics
  const diagBtn = document.getElementById('run-telemetry-btn');
  if (diagBtn) diagBtn.addEventListener('click', () =>
    showToast('Diagnostics Completed', 'All 12 BMS automation gateways responding in 4ms.', 'sensors')
  );

  // Staff Reassign
  document.querySelectorAll('.reassign-staff-btn').forEach(btn =>
    btn.addEventListener('click', () =>
      showToast('Reassignment Initiated', `${btn.dataset.name} reassignment flow would open here.`, 'swap_horiz')
    )
  );

  // Handover Note
  const handoverBtn = document.getElementById('submit-handover-btn');
  if (handoverBtn) handoverBtn.addEventListener('click', () =>
    showToast('Shift Handover Report', 'Handover notes synced to Duty Manager and Evening Supervisor.', 'note_add')
  );

  // Inventory Adjustments
  document.querySelectorAll('.mgr-inv-adj-btn').forEach(btn =>
    btn.addEventListener('click', () =>
      store.updateInventoryStock(btn.dataset.id, parseInt(btn.dataset.delta, 10))
    )
  );

  // Create PO
  document.querySelectorAll('.mgr-reorder-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      const item = store.state.inventory.find(i => i.id === btn.dataset.id);
      if (item) showToast('Purchase Order Created', `PO for ${item.name} submitted to procurement.`, 'local_shipping');
    })
  );

  // Add Dish
  const addDishBtn = document.getElementById('add-new-dish-btn');
  if (addDishBtn) {
    addDishBtn.addEventListener('click', () => {
      const name = prompt('New gourmet dish name:');
      if (name) {
        const price    = prompt('Price ($):', '36.00');
        const category = prompt('Category (Breakfast / Mains / Desserts / Beverages):', 'Mains');
        store.addMenuItem({ name, price, category, tag: "Chef's Special" });
        showToast('Dish Added', `${name} ($${price}) added to in-room dining menu.`, 'restaurant');
      }
    });
  }

  // Toggle Dish Availability
  document.querySelectorAll('.toggle-dish-avail-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      store.toggleMenuItemAvailability(btn.dataset.id);
      const dish = store.state.menu.find(d => d.id === btn.dataset.id);
      showToast('Menu Updated', `${dish.name} is now ${dish.available ? 'IN STOCK' : 'SOLD OUT'}.`, 'inventory');
    })
  );

  // Edit Dish Price
  document.querySelectorAll('.edit-dish-price-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      const dish = store.state.menu.find(d => d.id === btn.dataset.id);
      const p    = prompt(`New price for ${dish.name}:`, dish.price.toFixed(2));
      if (p && !isNaN(parseFloat(p))) {
        store.updateMenuItem(btn.dataset.id, { price: parseFloat(p) });
        showToast('Price Updated', `${dish.name} → $${parseFloat(p).toFixed(2)}.`, 'price_change');
      }
    })
  );

  // Resolve Complaint
  document.querySelectorAll('.resolve-complaint-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      const perk  = prompt('Compensation perk for guest:', 'Complimentary Champagne & Fruit Basket');
      const notes = prompt('Resolution notes:', 'Manager personally visited and resolved the issue.');
      store.resolveComplaint(btn.dataset.id, notes, perk);
      showToast('Complaint Resolved', `Grievance #${btn.dataset.id} resolved with "${perk}".`, 'verified');
    })
  );

  // Call Guest
  document.querySelectorAll('.call-guest-btn').forEach(btn =>
    btn.addEventListener('click', () =>
      showToast('Connecting to Suite', `Dialing Room ${btn.dataset.room} direct executive line...`, 'ring_volume')
    )
  );
}
