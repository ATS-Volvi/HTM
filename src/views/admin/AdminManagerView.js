import { store } from '../../state/store.js';
import { showToast } from '../../components/Toast.js';
import confetti from 'canvas-confetti';

export function renderAdminManagerView(state) {
  const activeSubTab = state.adminSubTab || 'overview';
  const menu = state.menu;
  const staff = state.staffList;
  const complaints = state.complaints;
  const rooms = state.rooms;

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.guest !== 'Vacant / Ready' && r.guest !== 'Vacant / Departure').length;
  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);
  const dirtyCount = rooms.filter(r => r.status === 'Dirty').length;
  const openComplaints = complaints.filter(c => c.status !== 'Resolved').length;

  return `
    <div class="app-content animate-fade-in" style="padding-bottom: 50px;">
      <!-- Title & Manager Role Header -->
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

      <!-- Executive Sub-Tabs -->
      <div class="category-pills-row" id="admin-sub-tabs">
        <button class="category-pill admin-tab-btn ${activeSubTab === 'overview' ? 'active' : ''}" data-tab="overview">
          <span class="material-symbols-outlined" style="font-size: 14px; vertical-align: middle;">dashboard</span> Overview & Auto-Assign
        </button>
        <button class="category-pill admin-tab-btn ${activeSubTab === 'staff' ? 'active' : ''}" data-tab="staff">
          <span class="material-symbols-outlined" style="font-size: 14px; vertical-align: middle;">badge</span> Staff Allocation
        </button>
        <button class="category-pill admin-tab-btn ${activeSubTab === 'menu' ? 'active' : ''}" data-tab="menu">
          <span class="material-symbols-outlined" style="font-size: 14px; vertical-align: middle;">restaurant_menu</span> Menu Editor
        </button>
        <button class="category-pill admin-tab-btn ${activeSubTab === 'complaints' ? 'active' : ''}" data-tab="complaints">
          <span class="material-symbols-outlined" style="font-size: 14px; vertical-align: middle;">report_problem</span> Complaints (${openComplaints})
        </button>
      </div>

      <!-- TAB 1: OVERVIEW & INTELLIGENT AUTO-ASSIGN -->
      ${activeSubTab === 'overview' ? `
        <!-- High-Level Key Performance Indicators -->
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
            <div style="font-size: 10px; color: var(--on-surface-variant);">${dirtyCount > 0 ? 'Awaiting staff assignment' : 'All rooms serviced'}</div>
          </div>
          <div class="glass-card" style="padding: 12px 14px;">
            <div class="label-bold" style="font-size: 9px; color: ${openComplaints > 0 ? 'var(--warning)' : 'var(--success)'};">Open Escalations</div>
            <div style="font-size: 22px; font-weight: 800; color: ${openComplaints > 0 ? 'var(--warning)' : 'var(--primary)'}; margin: 2px 0;">${openComplaints} Tickets</div>
            <div style="font-size: 10px; color: var(--on-surface-variant);">Requires manager resolution</div>
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
                Automatically distributes dirty departure suites to on-duty housekeepers based on floor proximity, VIP priority, and staff workload balance.
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

        <!-- Floor Status Health Snapshot -->
        <div class="glass-card" style="padding: 16px;">
          <div class="label-bold" style="margin-bottom: 10px;">Floor Turnover Health</div>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px;">
            ${['4', '3', '2', '5'].map(fl => {
              const flRooms = rooms.filter(r => r.floor === fl);
              const flClean = flRooms.filter(r => r.status === 'Clean' || r.status === 'Inspected').length;
              const flPct = Math.round((flClean / flRooms.length) * 100);
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

      <!-- TAB 2: STAFF ALLOCATION & WORKLOAD -->
      ${activeSubTab === 'staff' ? `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <div class="label-bold">On-Duty Staff Deployment (${staff.length})</div>
          <span class="badge badge-clean" style="font-size: 10px;">6 Active Leads</span>
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
                      <div class="body-sm" style="font-size: 11px; color: var(--on-surface-variant);">${s.role} • Floor ${s.floor}</div>
                    </div>
                  </div>
                  <span class="badge ${s.activeRooms >= s.maxRooms ? 'badge-dirty' : 'badge-clean'}" style="font-size: 9px;">
                    ${s.activeRooms >= s.maxRooms ? 'At Capacity' : 'Available'}
                  </span>
                </div>

                <!-- Workload progress -->
                <div style="margin: 8px 0;">
                  <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                    <span>Assigned Suites: <strong>${s.activeRooms} / ${s.maxRooms}</strong></span>
                    <span style="color: var(--secondary); font-weight: 600;">Rating: ${s.score}</span>
                  </div>
                  <div style="width: 100%; height: 6px; background: var(--surface-container-high); border-radius: 3px; overflow: hidden;">
                    <div style="width: ${loadPct}%; height: 100%; background: ${loadPct >= 100 ? '#c62828' : loadPct >= 60 ? 'var(--secondary)' : '#2e7d32'};"></div>
                  </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--surface-container-high); padding-top: 8px; font-size: 11px;">
                  <span style="color: var(--outline);">Primary Zone: Floor ${s.floor}</span>
                  <button class="btn-secondary reassign-staff-btn" data-id="${s.id}" style="padding: 4px 10px; font-size: 11px;">
                    Assign Rooms →
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}

      <!-- TAB 3: MENU & GASTRONOMY EDITOR -->
      ${activeSubTab === 'menu' ? `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <div class="label-bold">Menu Items (${menu.length})</div>
          <button class="btn-primary" id="add-new-dish-btn" style="padding: 6px 12px; font-size: 11px;">
            + Add New Dish
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${menu.map(dish => `
            <div class="glass-card" style="padding: 14px 16px; display: flex; gap: 12px; align-items: center;">
              <div style="width: 60px; height: 60px; border-radius: var(--radius-sm); overflow: hidden; flex-shrink: 0; background: #333;">
                <img src="${dish.image}" alt="${dish.name}" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                  <h4 style="font-weight: 700; font-size: 14px; color: var(--primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${dish.name}
                  </h4>
                  <span style="font-weight: 800; font-size: 13px; color: var(--primary);">$${dish.price.toFixed(2)}</span>
                </div>
                <div style="font-size: 11px; color: var(--secondary); font-weight: 600; margin: 2px 0;">
                  ${dish.category} • ${dish.tag}
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px;">
                  <span class="badge ${dish.available !== false ? 'badge-clean' : 'badge-dirty'}" style="font-size: 9px;">
                    ${dish.available !== false ? 'In Stock' : 'Sold Out'}
                  </span>
                  <div style="display: flex; gap: 6px;">
                    <button class="btn-secondary toggle-dish-avail-btn" data-id="${dish.id}" style="padding: 3px 8px; font-size: 10px;">
                      ${dish.available !== false ? 'Mark Sold Out' : 'Mark In Stock'}
                    </button>
                    <button class="btn-secondary edit-dish-price-btn" data-id="${dish.id}" style="padding: 3px 8px; font-size: 10px;">
                      Edit Price
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- TAB 4: GUEST COMPLAINTS & ESCALATIONS -->
      ${activeSubTab === 'complaints' ? `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <div class="label-bold">Guest Service Escalations (${complaints.length})</div>
          <span class="badge badge-dirty" style="font-size: 10px;">${openComplaints} Pending Review</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${complaints.map(comp => {
            const isResolved = comp.status === 'Resolved';
            const isHigh = comp.severity === 'High';

            return `
              <div class="glass-card" style="padding: 16px; border-left: 4px solid ${
                isResolved ? 'var(--success)' : isHigh ? 'var(--error)' : 'var(--warning)'
              };">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                  <div>
                    <span class="badge ${isHigh ? 'badge-dirty' : 'badge-gold'}" style="font-size: 9px;">
                      ${comp.severity} Priority
                    </span>
                    <span class="badge badge-vip" style="font-size: 9px; margin-left: 4px;">
                      Room ${comp.room}
                    </span>
                  </div>
                  <span class="badge ${isResolved ? 'badge-clean' : 'badge-inspected'}" style="font-size: 9px;">
                    ${comp.status}
                  </span>
                </div>

                <h4 style="font-family: var(--font-serif); font-size: 15px; font-weight: 700; color: var(--primary); margin-bottom: 2px;">
                  ${comp.category} — ${comp.guest}
                </h4>
                <div style="font-size: 10px; color: var(--outline); margin-bottom: 6px;">
                  Reported: ${comp.reportedAt} • Assigned: ${comp.assignedStaff}
                </div>
                <p class="body-sm" style="color: var(--on-surface-variant); margin-bottom: 10px; line-height: 1.4;">
                  "${comp.description}"
                </p>

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
                  ` : `
                    <span style="font-size: 11px; color: #2e7d32; font-weight: 700;">✓ Resolved & Closed</span>
                  `}
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
  // Sub-Tab Switching
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      store.setAdminSubTab(btn.dataset.tab);
    });
  });

  // Intelligent Auto-Assign Button
  const autoAssignBtn = document.getElementById('manager-auto-assign-btn');
  if (autoAssignBtn) {
    autoAssignBtn.addEventListener('click', () => {
      const result = store.autoAssignRooms();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      showToast(
        'Intelligent Auto-Assign Complete',
        `${result.assignedCount} dirty departure rooms balanced across ${result.staffCount} on-duty staff.`,
        'auto_awesome'
      );
    });
  }

  // Add New Dish Modal Trigger
  const addDishBtn = document.getElementById('add-new-dish-btn');
  if (addDishBtn) {
    addDishBtn.addEventListener('click', () => {
      const name = prompt('Enter new gourmet dish name:');
      if (name) {
        const price = prompt('Enter price ($):', '36.00');
        const category = prompt('Enter category (Breakfast / Mains / Desserts / Beverages):', 'Mains');
        store.addMenuItem({ name, price, category, tag: "Chef's Special" });
        showToast('Dish Added to Menu', `${name} ($${price}) added to guest in-room dining menu.`, 'restaurant');
      }
    });
  }

  // Toggle Dish Availability
  const toggleAvailBtns = document.querySelectorAll('.toggle-dish-avail-btn');
  toggleAvailBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      store.toggleMenuItemAvailability(id);
      const dish = store.state.menu.find(d => d.id === id);
      showToast('Menu Availability Updated', `${dish.name} is now ${dish.available ? 'IN STOCK' : 'SOLD OUT'}`, 'inventory');
    });
  });

  // Edit Dish Price
  const editPriceBtns = document.querySelectorAll('.edit-dish-price-btn');
  editPriceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const dish = store.state.menu.find(d => d.id === id);
      const newPrice = prompt(`Enter new price for ${dish.name}:`, dish.price.toFixed(2));
      if (newPrice && !isNaN(parseFloat(newPrice))) {
        store.updateMenuItem(id, { price: parseFloat(newPrice) });
        showToast('Price Updated', `${dish.name} price updated to $${parseFloat(newPrice).toFixed(2)}`, 'price_change');
      }
    });
  });

  // Resolve Complaint & Grant Compensation Perk
  const resolveBtns = document.querySelectorAll('.resolve-complaint-btn');
  resolveBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const perk = prompt('Select or enter compensation perk for guest (e.g. Complimentary Champagne / $50 Dining Voucher / Late Checkout):', 'Complimentary Champagne & Fruit Basket');
      const notes = prompt('Enter resolution notes for the log:', 'Manager personally visited and granted compensation perk. Issue verified fixed.');
      store.resolveComplaint(id, notes, perk);
      showToast('Complaint Resolved', `Grievance #${id} resolved with ${perk}.`, 'verified');
    });
  });

  // Call Guest Action
  const callGuestBtns = document.querySelectorAll('.call-guest-btn');
  callGuestBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const room = btn.dataset.room;
      showToast('Connecting to Suite', `Dialing Room ${room} direct executive concierge phone line...`, 'ring_volume');
    });
  });
}
