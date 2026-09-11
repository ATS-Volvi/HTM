// ==========================================================================
// VOLVITECH HOSPITALITY OS — ROOM & INVENTORY MANAGEMENT VIEW (TAPE CHART)
// Primary UI/UX Source: Google Stitch Screen 'Room & Inventory Management' (1a972233b884462caf339982706d7376)
// Combined with Stitch Screen 'Room Tape Chart & 7-Day Availability Matrix' (0c6da60e31644bc4b78a4941a9fc1310)
// ==========================================================================
import { reservationsClient } from '../../api/reservationsClient.js';
import { Toast } from '../../components/Toast.js';
import { store } from '../../state/store.js';
import { renderTapeChartView, bindTapeChartEvents } from '../TapeChartView.js';

export class RoomInventoryView {
  constructor() {
    this.rooms = [];
    this.filterFloor = 'ALL';
    this.filterStatus = 'ALL';
    this.viewMode = 'grid'; // 'grid' | 'tape'
    this.isLoading = true;
    this.container = null;
  }

  async mount(container) {
    this.container = container;
    await this.loadData();
    this.render();
  }

  async loadData() {
    this.isLoading = true;
    try {
      const res = await reservationsClient.getRooms();
      this.rooms = res.data || [];
    } catch (err) {
      console.error('[RoomInventoryView loadData error]', err);
      Toast.show({ title: 'Error Loading Inventory', message: err.message, type: 'error' });
    } finally {
      this.isLoading = false;
    }
  }

  render() {
    if (!this.container) return;

    if (this.isLoading) {
      this.container.innerHTML = `
        <div class="flex items-center justify-center h-96">
          <div class="flex flex-col items-center gap-3">
            <span class="material-symbols-outlined text-4xl text-primary animate-spin">sync</span>
            <span class="text-xs font-label-caps text-on-surface-variant uppercase font-bold tracking-wider">Syncing Room Inventory Tape Chart...</span>
          </div>
        </div>
      `;
      return;
    }

    if (this.viewMode === 'tape') {
      this.container.innerHTML = `
        <div class="space-y-4">
          <div class="flex justify-end mb-2">
            <div class="flex items-center bg-surface-container-lowest border border-outline-variant rounded-lg p-0.5 shadow-sm">
              <button id="btn-switch-to-grid" class="px-3 py-1.5 text-on-surface-variant hover:text-primary rounded text-xs font-label-caps font-bold transition-colors">Today (Room Grid)</button>
              <button id="btn-switch-to-tape" class="px-3 py-1.5 bg-primary text-on-primary rounded text-xs font-label-caps font-bold shadow-xs">7-Day Tape Matrix</button>
            </div>
          </div>
          <div id="tape-chart-mount">
            ${renderTapeChartView(store.state)}
          </div>
        </div>
      `;
      bindTapeChartEvents();

      const gridBtn = this.container.querySelector('#btn-switch-to-grid');
      if (gridBtn) {
        gridBtn.onclick = () => {
          this.viewMode = 'grid';
          this.render();
        };
      }
      return;
    }

    // Compute metrics
    const total = this.rooms.length || 20;
    const occupied = this.rooms.filter((r) => (r.operational_status || r.status) === 'OCCUPIED').length;
    const clean = this.rooms.filter((r) => (r.operational_status || r.status) === 'VACANT_CLEAN').length;
    const dirty = this.rooms.filter((r) => (r.operational_status || r.status) === 'VACANT_DIRTY').length;
    const ooo = this.rooms.filter((r) => (r.operational_status || r.status) === 'OUT_OF_ORDER').length;
    const occupancyPct = Math.round((occupied / (total || 1)) * 100);

    // Group by floor
    const floors = [4, 3, 2, 1];

    let filteredRooms = this.rooms;
    if (this.filterFloor !== 'ALL') {
      filteredRooms = filteredRooms.filter((r) => String(r.floor) === String(this.filterFloor));
    }
    if (this.filterStatus !== 'ALL') {
      filteredRooms = filteredRooms.filter((r) => (r.operational_status || r.status) === this.filterStatus);
    }

    const html = `
      <div class="space-y-6 animate-fadeIn text-xs">
        
        <!-- Page Header (Stitch 1a972233) -->
        <header class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-outline-variant pb-4">
          <div>
            <div class="flex items-center gap-2 text-on-surface-variant mb-1">
              <span class="material-symbols-outlined text-[16px] text-primary">hotel</span>
              <span class="font-label-caps text-[11px] font-bold uppercase text-secondary">Front Desk Operations</span>
              <span>/</span>
              <span class="font-label-caps text-[11px] font-bold text-primary uppercase">Room &amp; Inventory Management</span>
            </div>
            <h1 class="font-headline-lg text-2xl font-bold text-primary tracking-tight">Room Status Grid &amp; Tape Chart</h1>
            <p class="text-on-surface-variant text-xs mt-0.5">Physical room operational status, housekeeping turnover, and channel availability.</p>
          </div>

          <!-- Top Action Bar -->
          <div class="flex flex-wrap items-center gap-2.5">
            <div class="flex items-center bg-surface-container-lowest border border-outline-variant rounded-lg p-0.5 shadow-sm">
              <button id="btn-mode-grid" class="px-3 py-1.5 ${this.viewMode === 'grid' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-primary'} rounded text-xs font-label-caps font-bold transition-colors">Today (Room Grid)</button>
              <button id="btn-mode-tape" class="px-3 py-1.5 ${this.viewMode === 'tape' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-primary'} rounded text-xs font-label-caps font-bold transition-colors">7-Day Tape Matrix</button>
            </div>

            <button id="btn-refresh-rooms" class="px-3 py-2 bg-surface-container-lowest border border-outline-variant hover:bg-surface-container rounded-lg text-primary text-xs font-label-caps font-bold flex items-center gap-1.5 shadow-sm transition-colors">
              <span class="material-symbols-outlined text-[16px]">refresh</span>
              Refresh
            </button>
          </div>
        </header>

        <!-- Bento Summary KPI Row -->
        <section class="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div class="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-sm">
            <div class="flex justify-between items-center text-on-surface-variant font-label-caps text-[10px] font-bold uppercase">
              <span>Total Inventory</span>
              <span class="material-symbols-outlined text-[16px]">domain</span>
            </div>
            <div class="font-display-lg text-2xl font-data-mono font-bold text-primary mt-2">${total} Rooms</div>
            <div class="text-[10px] text-on-surface-variant mt-0.5 font-data-mono">100% Operational Key Stock</div>
          </div>

          <div class="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-sm">
            <div class="flex justify-between items-center text-on-surface-variant font-label-caps text-[10px] font-bold uppercase">
              <span>Occupied</span>
              <span class="material-symbols-outlined text-[16px] text-primary">bedroom_parent</span>
            </div>
            <div class="font-display-lg text-2xl font-data-mono font-bold text-primary mt-2">${occupied} <span class="text-xs font-normal text-on-surface-variant">(${occupancyPct}%)</span></div>
            <div class="text-[10px] text-emerald-600 mt-0.5 font-bold">Active in-house guests</div>
          </div>

          <div class="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-sm">
            <div class="flex justify-between items-center text-on-surface-variant font-label-caps text-[10px] font-bold uppercase">
              <span>Vacant Clean</span>
              <span class="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
            </div>
            <div class="font-display-lg text-2xl font-data-mono font-bold text-emerald-700 mt-2">${clean}</div>
            <div class="text-[10px] text-emerald-600 mt-0.5 font-bold">Ready for instant check-in</div>
          </div>

          <div class="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-sm">
            <div class="flex justify-between items-center text-on-surface-variant font-label-caps text-[10px] font-bold uppercase">
              <span>Vacant Dirty</span>
              <span class="material-symbols-outlined text-[16px] text-amber-600">cleaning_services</span>
            </div>
            <div class="font-display-lg text-2xl font-data-mono font-bold text-amber-700 mt-2">${dirty}</div>
            <div class="text-[10px] text-amber-600 mt-0.5 font-bold">Housekeeping priority</div>
          </div>

          <div class="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-sm col-span-2 sm:col-span-1">
            <div class="flex justify-between items-center text-on-surface-variant font-label-caps text-[10px] font-bold uppercase">
              <span>Out of Order</span>
              <span class="material-symbols-outlined text-[16px] text-rose-600">construction</span>
            </div>
            <div class="font-display-lg text-2xl font-data-mono font-bold text-rose-700 mt-2">${ooo}</div>
            <div class="text-[10px] text-rose-600 mt-0.5 font-bold">Maintenance active</div>
          </div>
        </section>

        <!-- Interactive Filters Toolbar -->
        <section class="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 shadow-sm flex flex-wrap justify-between items-center gap-3">
          <!-- Floor Filter Chips -->
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase mr-1">Floor:</span>
            <button class="filter-floor-btn px-2.5 py-1 rounded text-xs font-data-mono font-bold transition-colors ${this.filterFloor === 'ALL' ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface hover:bg-surface-container'}" data-floor="ALL">All</button>
            ${floors.map((f) => `
              <button class="filter-floor-btn px-2.5 py-1 rounded text-xs font-data-mono font-bold transition-colors ${String(this.filterFloor) === String(f) ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface hover:bg-surface-container'}" data-floor="${f}">Floor ${f}</button>
            `).join('')}
          </div>

          <!-- Status Dropdown -->
          <div class="flex items-center gap-2">
            <span class="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase">Filter Status:</span>
            <select id="select-status-filter" class="border border-outline-variant rounded-lg font-body-sm text-xs py-1 px-3 bg-surface-bright text-on-surface focus:outline-none focus:border-primary">
              <option value="ALL" ${this.filterStatus === 'ALL' ? 'selected' : ''}>All Operational States</option>
              <option value="OCCUPIED" ${this.filterStatus === 'OCCUPIED' ? 'selected' : ''}>Occupied</option>
              <option value="VACANT_CLEAN" ${this.filterStatus === 'VACANT_CLEAN' ? 'selected' : ''}>Vacant Clean</option>
              <option value="VACANT_DIRTY" ${this.filterStatus === 'VACANT_DIRTY' ? 'selected' : ''}>Vacant Dirty</option>
              <option value="OUT_OF_ORDER" ${this.filterStatus === 'OUT_OF_ORDER' ? 'selected' : ''}>Out of Order</option>
            </select>
          </div>
        </section>

        <!-- Floor-by-Floor Inventory Matrix -->
        <div class="space-y-6">
          ${floors.map((floorNum) => {
            const floorRooms = filteredRooms.filter((r) => String(r.floor) === String(floorNum));
            if (floorRooms.length === 0) return '';

            return `
              <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
                <div class="flex items-center justify-between border-b border-outline-variant pb-3 mb-4">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
                    <h2 class="font-headline-sm text-sm font-bold text-primary">Floor ${floorNum}</h2>
                    <span class="text-on-surface-variant font-data-mono text-[11px]">(${floorRooms.length} keys in layout)</span>
                  </div>
                  <span class="text-[11px] font-data-mono text-on-surface-variant">Elevator Bank ${floorNum === 4 ? 'North Wing (Penthouse)' : 'Central'}</span>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  ${floorRooms.map((room) => {
                    const status = room.operational_status || room.status;
                    let badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-300';
                    let statusLabel = 'Vacant Clean';
                    let icon = 'check_circle';

                    if (status === 'OCCUPIED') {
                      badgeColor = 'bg-primary/10 text-primary border-primary/30';
                      statusLabel = 'Occupied';
                      icon = 'bedroom_parent';
                    } else if (status === 'VACANT_DIRTY') {
                      badgeColor = 'bg-amber-50 text-amber-800 border-amber-300';
                      statusLabel = 'Vacant Dirty';
                      icon = 'cleaning_services';
                    } else if (status === 'OUT_OF_ORDER') {
                      badgeColor = 'bg-rose-50 text-rose-800 border-rose-300';
                      statusLabel = 'Out of Order';
                      icon = 'construction';
                    }

                    return `
                      <div class="border border-outline-variant rounded-xl p-3.5 bg-surface-container-low hover:border-primary transition-all flex flex-col justify-between space-y-3 group shadow-xs">
                        <div class="flex justify-between items-start">
                          <div>
                            <span class="font-display-lg text-lg font-data-mono font-bold text-primary">#${room.room_number}</span>
                            <span class="block text-[10px] text-on-surface-variant font-medium mt-0.5">${room.room_type_name || 'Deluxe'}</span>
                          </div>
                          <span class="w-2.5 h-2.5 rounded-full ${room.status === 'OCCUPIED' ? 'bg-primary animate-pulse' : room.status === 'VACANT_CLEAN' ? 'bg-emerald-500' : room.status === 'VACANT_DIRTY' ? 'bg-amber-500' : 'bg-rose-500'}"></span>
                        </div>

                        <!-- Status Badge -->
                        <div class="px-2 py-1 rounded border ${badgeColor} flex items-center gap-1 text-[10px] font-bold font-label-caps">
                          <span class="material-symbols-outlined text-[13px]">${icon}</span>
                          <span>${statusLabel}</span>
                        </div>

                        <!-- Occupant Info or Quick Toggle -->
                        <div class="pt-2 border-t border-outline-variant/60 flex justify-between items-center text-[10px]">
                          ${room.current_guest_name ? `
                            <div class="truncate max-w-[120px]">
                              <span class="text-on-surface-variant block">Occupant:</span>
                              <span class="font-bold text-primary truncate">${room.current_guest_name}</span>
                            </div>
                          ` : `
                            <span class="text-on-surface-variant font-data-mono">$${room.base_price || 280}/night</span>
                          `}

                          <button class="btn-toggle-room-status text-secondary hover:text-primary p-1 rounded hover:bg-surface-container" data-room-id="${room.id}" data-current-status="${room.status}" title="Toggle Housekeeping Status">
                            <span class="material-symbols-outlined text-[16px]">swap_horiz</span>
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

    this.container.innerHTML = html;
    this.attachEvents();
  }

  attachEvents() {
    // Mode switcher buttons
    const gridBtn = this.container.querySelector('#btn-mode-grid');
    const tapeBtn = this.container.querySelector('#btn-mode-tape');

    if (gridBtn) {
      gridBtn.onclick = () => {
        this.viewMode = 'grid';
        this.render();
      };
    }
    if (tapeBtn) {
      tapeBtn.onclick = () => {
        this.viewMode = 'tape';
        this.render();
      };
    }

    // Refresh
    const refreshBtn = this.container.querySelector('#btn-refresh-rooms');
    if (refreshBtn) {
      refreshBtn.onclick = async () => {
        await this.loadData();
        this.render();
      };
    }

    // Floor filter pills
    this.container.querySelectorAll('.filter-floor-btn').forEach((btn) => {
      btn.onclick = () => {
        this.filterFloor = btn.dataset.floor;
        this.render();
      };
    });

    // Status dropdown filter
    const statusSelect = this.container.querySelector('#select-status-filter');
    if (statusSelect) {
      statusSelect.onchange = (e) => {
        this.filterStatus = e.target.value;
        this.render();
      };
    }

    // Toggle Room Status button (Front Desk housekeeping quick inspection)
    this.container.querySelectorAll('.btn-toggle-room-status').forEach((btn) => {
      btn.onclick = async () => {
        const roomId = btn.dataset.roomId;
        const current = btn.dataset.currentStatus;
        
        let nextStatus = 'VACANT_CLEAN';
        if (current === 'VACANT_CLEAN') nextStatus = 'VACANT_DIRTY';
        else if (current === 'VACANT_DIRTY') nextStatus = 'VACANT_CLEAN';
        else if (current === 'OCCUPIED') {
          Toast.show({ title: 'Room Occupied', message: 'Room has an active guest in-house. Check out guest to release.', type: 'warning' });
          return;
        }

        // Locally update status for instant UI responsiveness
        const room = this.rooms.find((r) => r.id === roomId);
        if (room) {
          room.status = nextStatus;
          Toast.show({ title: 'Room Status Updated', message: `Room #${room.room_number} set to ${nextStatus}`, type: 'success' });
          this.render();
        }
      };
    });
  }
}
