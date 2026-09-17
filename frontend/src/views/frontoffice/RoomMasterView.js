// ==========================================================================
// VOLVITECH HOSPITALITY OS — ROOM & INVENTORY MASTER CONFIGURATION SCREEN
// Single Source of Truth for Physical Rooms, Floors, Room Types & Matrix
// ==========================================================================
import { store } from '../../state/store.js';
import { reservationsClient } from '../../api/reservationsClient.js';

export class RoomMasterView {
  constructor() {
    this.container = null;
    this.isLoading = false;
    this.rooms = [];
    this.roomTypes = [];

    // Filter & View State
    this.activeTab = 'rooms'; // 'rooms' | 'types' | 'floors'
    this.searchQuery = '';
    this.filterFloor = 'ALL';
    this.filterType = 'ALL';
    this.filterStatus = 'ALL';
    this.viewMode = 'by_floor'; // 'by_floor' | 'grid'

    // Modal State
    this.activeModal = null; // null | 'ADD_ROOM' | 'EDIT_ROOM' | 'BATCH_ROOMS' | 'ADD_TYPE' | 'EDIT_TYPE'
    this.modalPayload = null;
  }

  render() {
    this.container = document.createElement('div');
    this.container.className = 'w-full space-y-6 pb-20';
    this.container.innerHTML = `
      <div class="flex items-center justify-center py-24">
        <div class="flex flex-col items-center gap-3 text-on-surface-variant">
          <span class="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
          <p class="text-sm font-medium">Loading Room Master & Inventory Configuration...</p>
        </div>
      </div>
    `;
    return this.container;
  }

  async loadData() {
    this.isLoading = true;
    try {
      const [roomsRes, typesRes] = await Promise.all([
        reservationsClient.getRoomsMaster().catch(() => ({ success: true, data: [] })),
        reservationsClient.getRoomTypesMaster().catch(() => ({ success: true, data: [] })),
      ]);

      this.rooms = roomsRes.data || [];
      this.roomTypes = typesRes.data || [];
    } catch (err) {
      console.error('[RoomMasterView] Failed to load room master data:', err);
      store.showToast('Failed to load room inventory: ' + err.message, 'error');
    } finally {
      this.isLoading = false;
    }
  }

  renderContent() {
    if (!this.container) return;

    // Derived Statistics
    const totalRooms = this.rooms.length;
    const activeRooms = this.rooms.filter((r) => r.is_active).length;
    const distinctFloors = [...new Set(this.rooms.map((r) => String(r.floor).trim()))].sort((a, b) => {
      const numA = parseInt(a, 10);
      const numB = parseInt(b, 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });
    const occupiedCount = this.rooms.filter((r) => r.operational_status === 'OCCUPIED').length;
    const vacantCleanCount = this.rooms.filter((r) => r.operational_status === 'VACANT_CLEAN').length;
    const vacantDirtyCount = this.rooms.filter((r) => r.operational_status === 'VACANT_DIRTY').length;
    const oooCount = this.rooms.filter((r) => r.operational_status === 'OUT_OF_ORDER').length;
    const inspectionCount = this.rooms.filter((r) => r.operational_status === 'INSPECTION_REQUIRED').length;

    // Filtered rooms
    const filteredRooms = this.rooms.filter((r) => {
      if (this.filterFloor !== 'ALL' && String(r.floor) !== String(this.filterFloor)) return false;
      if (this.filterType !== 'ALL' && r.room_type_id !== this.filterType) return false;
      if (this.filterStatus !== 'ALL' && r.operational_status !== this.filterStatus) return false;
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const matchesNum = String(r.room_number).toLowerCase().includes(q);
        const matchesType = (r.room_type_name || '').toLowerCase().includes(q) || (r.room_type_code || '').toLowerCase().includes(q);
        const matchesGuest = (r.occupant_name || '').toLowerCase().includes(q);
        if (!matchesNum && !matchesType && !matchesGuest) return false;
      }
      return true;
    });

    this.container.innerHTML = `
      <!-- ================================================================= -->
      <!-- TOP SCREEN HEADER — ROOM MASTER & INVENTORY SPECIFICATION         -->
      <!-- ================================================================= -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-outline-variant/60 pb-5">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-data-mono uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
              Master Data & Property Engine
            </span>
            <span class="text-xs text-on-surface-variant font-data-mono">SSOT • PostgreSQL 18</span>
          </div>
          <h1 class="text-2xl font-bold font-headline-sm text-on-surface tracking-tight flex items-center gap-2.5">
            <span class="material-symbols-outlined text-primary text-28px">meeting_room</span>
            Room Master & Floor Configuration
          </h1>
          <p class="text-xs text-on-surface-variant max-w-2xl">
            Configure hotel physical rooms, define room categories with bed capacities and base pricing, organize building floors, and perform bulk room operations.
          </p>
        </div>

        <!-- Master Action Buttons -->
        <div class="flex flex-wrap items-center gap-2.5">
          <button 
            id="btn-nav-to-house-status"
            class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/70 transition-all cursor-pointer shadow-2xs"
            title="Return to House Status Matrix"
          >
            <span class="material-symbols-outlined text-16px text-primary">grid_view</span>
            <span>House Status</span>
          </button>

          <button 
            id="btn-refresh-room-master"
            class="p-2 rounded-lg text-on-surface-variant hover:text-primary bg-surface-container hover:bg-surface-container-high border border-outline-variant/70 transition-all cursor-pointer"
            title="Reload latest room inventory"
          >
            <span class="material-symbols-outlined text-18px">refresh</span>
          </button>

          <button 
            id="btn-open-add-type"
            class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-surface-container-highest hover:bg-surface-container-high text-on-surface border border-outline-variant transition-all cursor-pointer shadow-xs"
          >
            <span class="material-symbols-outlined text-16px text-primary">category</span>
            <span>+ New Room Type</span>
          </button>

          <button 
            id="btn-open-batch-rooms"
            class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-secondary/15 hover:bg-secondary/25 text-secondary border border-secondary/30 transition-all cursor-pointer shadow-xs"
          >
            <span class="material-symbols-outlined text-16px">dynamic_feed</span>
            <span>+ Batch Generator</span>
          </button>

          <button 
            id="btn-open-add-room"
            class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-primary hover:bg-primary/90 text-on-primary shadow-sm active:scale-[0.98] transition-all cursor-pointer"
          >
            <span class="material-symbols-outlined text-17px">add_circle</span>
            <span>+ Add Room</span>
          </button>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- MASTER INVENTORY TELEMETRY RIBBON                                 -->
      <!-- ================================================================= -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <!-- 1. Total Rooms -->
        <div class="bg-surface-container-lowest border border-outline-variant/80 rounded-xl p-3.5 shadow-2xs">
          <div class="flex items-center justify-between text-on-surface-variant mb-1">
            <span class="text-[11px] font-medium tracking-wide uppercase font-label-caps">Total Rooms</span>
            <span class="material-symbols-outlined text-16px text-primary">door_front</span>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl font-bold font-data-mono text-on-surface">${totalRooms}</span>
            <span class="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded font-data-mono">
              ${activeRooms} Active
            </span>
          </div>
          <p class="text-[10px] text-on-surface-variant mt-1 truncate">Registered units in PMS</p>
        </div>

        <!-- 2. Distinct Floors -->
        <div class="bg-surface-container-lowest border border-outline-variant/80 rounded-xl p-3.5 shadow-2xs">
          <div class="flex items-center justify-between text-on-surface-variant mb-1">
            <span class="text-[11px] font-medium tracking-wide uppercase font-label-caps">Property Floors</span>
            <span class="material-symbols-outlined text-16px text-primary">apartment</span>
          </div>
          <div class="flex items-baseline gap-1.5">
            <span class="text-2xl font-bold font-data-mono text-on-surface">${distinctFloors.length}</span>
            <span class="text-[11px] text-on-surface-variant font-medium">Floors</span>
          </div>
          <p class="text-[10px] text-on-surface-variant mt-1 truncate">
            ${distinctFloors.length ? 'Fl ' + distinctFloors.join(', Fl ') : 'No floors yet'}
          </p>
        </div>

        <!-- 3. Room Categories -->
        <div class="bg-surface-container-lowest border border-outline-variant/80 rounded-xl p-3.5 shadow-2xs">
          <div class="flex items-center justify-between text-on-surface-variant mb-1">
            <span class="text-[11px] font-medium tracking-wide uppercase font-label-caps">Room Types</span>
            <span class="material-symbols-outlined text-16px text-primary">hotel</span>
          </div>
          <div class="flex items-baseline gap-1.5">
            <span class="text-2xl font-bold font-data-mono text-on-surface">${this.roomTypes.length}</span>
            <span class="text-[11px] text-on-surface-variant font-medium">Classifications</span>
          </div>
          <p class="text-[10px] text-on-surface-variant mt-1 truncate">Active pricing tiers</p>
        </div>

        <!-- 4. Vacant Clean -->
        <div class="bg-surface-container-lowest border border-outline-variant/80 rounded-xl p-3.5 shadow-2xs">
          <div class="flex items-center justify-between text-emerald-600 mb-1">
            <span class="text-[11px] font-medium tracking-wide uppercase font-label-caps">Vacant Clean</span>
            <span class="material-symbols-outlined text-16px">verified</span>
          </div>
          <div class="flex items-baseline gap-1.5">
            <span class="text-2xl font-bold font-data-mono text-emerald-600">${vacantCleanCount}</span>
            <span class="text-[10px] text-on-surface-variant">Ready</span>
          </div>
          <p class="text-[10px] text-on-surface-variant mt-1 truncate">Assignable immediately</p>
        </div>

        <!-- 5. Occupied -->
        <div class="bg-surface-container-lowest border border-outline-variant/80 rounded-xl p-3.5 shadow-2xs">
          <div class="flex items-center justify-between text-blue-600 mb-1">
            <span class="text-[11px] font-medium tracking-wide uppercase font-label-caps">Occupied</span>
            <span class="material-symbols-outlined text-16px">person_check</span>
          </div>
          <div class="flex items-baseline gap-1.5">
            <span class="text-2xl font-bold font-data-mono text-blue-600">${occupiedCount}</span>
            <span class="text-[10px] text-on-surface-variant">In-House</span>
          </div>
          <p class="text-[10px] text-on-surface-variant mt-1 truncate">Active guest reservations</p>
        </div>

        <!-- 6. Dirty / OOO / Inspection -->
        <div class="bg-surface-container-lowest border border-outline-variant/80 rounded-xl p-3.5 shadow-2xs">
          <div class="flex items-center justify-between text-amber-600 mb-1">
            <span class="text-[11px] font-medium tracking-wide uppercase font-label-caps">Needs Attention</span>
            <span class="material-symbols-outlined text-16px">cleaning_services</span>
          </div>
          <div class="flex items-baseline gap-1.5">
            <span class="text-2xl font-bold font-data-mono text-amber-600">${vacantDirtyCount + oooCount + inspectionCount}</span>
            <span class="text-[10px] text-on-surface-variant">Rooms</span>
          </div>
          <p class="text-[10px] text-on-surface-variant mt-1 truncate">
            ${vacantDirtyCount} Dirty • ${oooCount} OOO • ${inspectionCount} Insp
          </p>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- NAVIGATION TABS: PHYSICAL ROOMS | ROOM TYPES | FLOOR SUMMARY      -->
      <!-- ================================================================= -->
      <div class="flex items-center justify-between border-b border-outline-variant gap-4">
        <div class="flex items-center gap-1">
          <button 
            class="tab-btn px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              this.activeTab === 'rooms'
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }"
            data-tab="rooms"
          >
            <span class="material-symbols-outlined text-17px">grid_view</span>
            <span>Physical Rooms & Floors (${filteredRooms.length})</span>
          </button>

          <button 
            class="tab-btn px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              this.activeTab === 'types'
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }"
            data-tab="types"
          >
            <span class="material-symbols-outlined text-17px">category</span>
            <span>Room Types Master (${this.roomTypes.length})</span>
          </button>

          <button 
            class="tab-btn px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              this.activeTab === 'floors'
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }"
            data-tab="floors"
          >
            <span class="material-symbols-outlined text-17px">apartment</span>
            <span>Floor Distribution & Zoning</span>
          </button>
        </div>

        ${
          this.activeTab === 'rooms'
            ? `
          <div class="hidden sm:flex items-center gap-1 bg-surface-container p-0.5 rounded-lg border border-outline-variant/60">
            <button 
              class="btn-toggle-view px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                this.viewMode === 'by_floor'
                  ? 'bg-surface-container-lowest text-primary shadow-2xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }"
              data-mode="by_floor"
            >
              <span class="material-symbols-outlined text-15px">splitscreen</span>
              <span>By Floor</span>
            </button>
            <button 
              class="btn-toggle-view px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                this.viewMode === 'grid'
                  ? 'bg-surface-container-lowest text-primary shadow-2xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }"
              data-mode="grid"
            >
              <span class="material-symbols-outlined text-15px">table_rows</span>
              <span>All Rooms List</span>
            </button>
          </div>
        `
            : ''
        }
      </div>

      <!-- ================================================================= -->
      <!-- TAB 1: PHYSICAL ROOMS DIRECTORY                                   -->
      <!-- ================================================================= -->
      ${this.activeTab === 'rooms' ? this.renderRoomsTab(filteredRooms, distinctFloors) : ''}

      <!-- ================================================================= -->
      <!-- TAB 2: ROOM TYPES MASTER                                          -->
      <!-- ================================================================= -->
      ${this.activeTab === 'types' ? this.renderRoomTypesTab() : ''}

      <!-- ================================================================= -->
      <!-- TAB 3: FLOOR OVERVIEW                                             -->
      <!-- ================================================================= -->
      ${this.activeTab === 'floors' ? this.renderFloorsTab(distinctFloors) : ''}

      <!-- ================================================================= -->
      <!-- MODAL DIALOGS CONTAINER                                           -->
      <!-- ================================================================= -->
      ${this.renderModals()}
    `;

    this.bindEvents();
  }

  // ── RENDER ROOMS TAB ────────────────────────────────────────────────────────
  renderRoomsTab(filteredRooms, distinctFloors) {
    return `
      <div class="space-y-4">
        <!-- Search and Filter Bar -->
        <div class="bg-surface-container-lowest border border-outline-variant/80 rounded-xl p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
            <!-- Search Input -->
            <div class="relative flex-1 min-w-[180px] max-w-xs">
              <span class="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-18px text-on-surface-variant">search</span>
              <input 
                id="input-room-search"
                type="text" 
                placeholder="Search room #, guest, or type..." 
                value="${this.searchQuery}"
                class="w-full bg-surface-container pl-9 pr-3 py-1.5 rounded-lg text-xs text-on-surface border border-outline-variant/60 focus:outline-none focus:border-primary placeholder:text-on-surface-variant/60"
              />
            </div>

            <!-- Floor Selector -->
            <select 
              id="select-filter-floor"
              class="bg-surface-container text-xs text-on-surface px-2.5 py-1.5 rounded-lg border border-outline-variant/60 focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="ALL" ${this.filterFloor === 'ALL' ? 'selected' : ''}>All Floors (${this.rooms.length})</option>
              ${distinctFloors
                .map((fl) => {
                  const count = this.rooms.filter((r) => String(r.floor) === String(fl)).length;
                  return `<option value="${fl}" ${this.filterFloor === String(fl) ? 'selected' : ''}>Floor ${fl} (${count})</option>`;
                })
                .join('')}
            </select>

            <!-- Room Type Filter -->
            <select 
              id="select-filter-type"
              class="bg-surface-container text-xs text-on-surface px-2.5 py-1.5 rounded-lg border border-outline-variant/60 focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="ALL" ${this.filterType === 'ALL' ? 'selected' : ''}>All Room Types</option>
              ${this.roomTypes
                .map((rt) => {
                  const count = this.rooms.filter((r) => r.room_type_id === rt.id).length;
                  return `<option value="${rt.id}" ${this.filterType === rt.id ? 'selected' : ''}>${rt.name} (${count})</option>`;
                })
                .join('')}
            </select>

            <!-- Operational Status Filter -->
            <select 
              id="select-filter-status"
              class="bg-surface-container text-xs text-on-surface px-2.5 py-1.5 rounded-lg border border-outline-variant/60 focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="ALL" ${this.filterStatus === 'ALL' ? 'selected' : ''}>All Statuses</option>
              <option value="VACANT_CLEAN" ${this.filterStatus === 'VACANT_CLEAN' ? 'selected' : ''}>Vacant Clean</option>
              <option value="VACANT_DIRTY" ${this.filterStatus === 'VACANT_DIRTY' ? 'selected' : ''}>Vacant Dirty</option>
              <option value="OCCUPIED" ${this.filterStatus === 'OCCUPIED' ? 'selected' : ''}>Occupied</option>
              <option value="OUT_OF_ORDER" ${this.filterStatus === 'OUT_OF_ORDER' ? 'selected' : ''}>Out of Order (OOO)</option>
              <option value="INSPECTION_REQUIRED" ${this.filterStatus === 'INSPECTION_REQUIRED' ? 'selected' : ''}>Inspection Required</option>
            </select>

            ${
              this.filterFloor !== 'ALL' || this.filterType !== 'ALL' || this.filterStatus !== 'ALL' || this.searchQuery
                ? `
              <button 
                id="btn-clear-filters"
                class="text-[11px] font-semibold text-primary hover:underline px-2 py-1"
              >
                Reset Filters
              </button>
            `
                : ''
            }
          </div>

          <!-- Quick counts display -->
          <div class="text-[11px] text-on-surface-variant font-data-mono">
            Showing <strong class="text-on-surface">${filteredRooms.length}</strong> of ${this.rooms.length} rooms
          </div>
        </div>

        <!-- Content Fork: Grouped by Floor OR Flat Grid -->
        ${
          filteredRooms.length === 0
            ? `
          <div class="bg-surface-container-lowest border border-outline-variant/80 rounded-xl p-12 text-center space-y-3 shadow-2xs">
            <span class="material-symbols-outlined text-5xl text-on-surface-variant/40">room_preferences</span>
            <h3 class="text-base font-bold text-on-surface">No rooms found matching criteria</h3>
            <p class="text-xs text-on-surface-variant max-w-sm mx-auto">
              Try resetting your search filters, or click the buttons below to configure new rooms on your hotel's floors.
            </p>
            <div class="flex items-center justify-center gap-3 pt-2">
              <button id="btn-empty-add-room" class="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-primary text-on-primary shadow-xs">
                + Add Single Room
              </button>
              <button id="btn-empty-batch-rooms" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-secondary/15 text-secondary border border-secondary/30">
                + Batch Generator
              </button>
            </div>
          </div>
        `
            : this.viewMode === 'by_floor'
            ? this.renderRoomsGroupedByFloor(filteredRooms, distinctFloors)
            : this.renderRoomsFlatGrid(filteredRooms)
        }
      </div>
    `;
  }

  // ── RENDER ROOMS GROUPED BY FLOOR ───────────────────────────────────────────
  renderRoomsGroupedByFloor(filteredRooms, distinctFloors) {
    // Group rooms by floor
    const floorGroups = {};
    filteredRooms.forEach((r) => {
      const fl = String(r.floor).trim();
      if (!floorGroups[fl]) floorGroups[fl] = [];
      floorGroups[fl].push(r);
    });

    const activeFloors = Object.keys(floorGroups).sort((a, b) => {
      const numA = parseInt(a, 10);
      const numB = parseInt(b, 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });

    return `
      <div class="space-y-6">
        ${activeFloors
          .map((fl) => {
            const floorRooms = floorGroups[fl];
            const floorOccupied = floorRooms.filter((r) => r.operational_status === 'OCCUPIED').length;
            const floorClean = floorRooms.filter((r) => r.operational_status === 'VACANT_CLEAN').length;
            const floorDirty = floorRooms.filter((r) => r.operational_status === 'VACANT_DIRTY').length;
            const floorOOO = floorRooms.filter((r) => r.operational_status === 'OUT_OF_ORDER').length;
            const avgRate = (
              floorRooms.reduce((sum, r) => sum + (parseFloat(r.base_price) || 0), 0) / (floorRooms.length || 1)
            ).toFixed(0);

            return `
            <div class="bg-surface-container-lowest border border-outline-variant/80 rounded-xl overflow-hidden shadow-2xs">
              <!-- Floor Banner Header -->
              <div class="px-5 py-3.5 bg-surface-container-low border-b border-outline-variant/70 flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm font-data-mono">
                    ${fl}
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="text-sm font-bold text-on-surface">Floor ${fl}</h3>
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-data-mono">
                        ${floorRooms.length} ${floorRooms.length === 1 ? 'Room' : 'Rooms'}
                      </span>
                    </div>
                    <p class="text-[10px] text-on-surface-variant">
                      Avg Rate: $${avgRate}/nt • ${floorOccupied} Occupied • ${floorClean} Clean • ${floorDirty} Dirty
                      ${floorOOO ? ` • <span class="text-rose-600 font-semibold">${floorOOO} OOO</span>` : ''}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <button 
                    class="btn-quick-add-to-floor px-2.5 py-1 text-[11px] font-semibold bg-surface-container hover:bg-surface-container-high text-primary border border-primary/20 rounded-md transition-all cursor-pointer flex items-center gap-1"
                    data-floor="${fl}"
                  >
                    <span class="material-symbols-outlined text-14px">add</span>
                    <span>Add Room to Fl ${fl}</span>
                  </button>
                  <button 
                    class="btn-quick-batch-to-floor px-2.5 py-1 text-[11px] font-semibold bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20 rounded-md transition-all cursor-pointer flex items-center gap-1"
                    data-floor="${fl}"
                  >
                    <span class="material-symbols-outlined text-14px">dynamic_feed</span>
                    <span>Batch to Fl ${fl}</span>
                  </button>
                </div>
              </div>

              <!-- Floor Room Cards Grid -->
              <div class="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                ${floorRooms.map((room) => this.renderRoomCard(room)).join('')}
              </div>
            </div>
          `;
          })
          .join('')}
      </div>
    `;
  }

  // ── RENDER ROOMS FLAT GRID / TABLE ──────────────────────────────────────────
  renderRoomsFlatGrid(filteredRooms) {
    return `
      <div class="bg-surface-container-lowest border border-outline-variant/80 rounded-xl overflow-hidden shadow-2xs">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-surface-container-low border-b border-outline-variant text-[11px] font-bold text-on-surface-variant uppercase tracking-wider font-label-caps">
                <th class="px-4 py-3">Room #</th>
                <th class="px-4 py-3">Floor</th>
                <th class="px-4 py-3">Room Type</th>
                <th class="px-4 py-3">Beds</th>
                <th class="px-4 py-3">Capacity</th>
                <th class="px-4 py-3">Base Price</th>
                <th class="px-4 py-3">Operational Status</th>
                <th class="px-4 py-3">Current Occupancy</th>
                <th class="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/50">
              ${filteredRooms
                .map((room) => {
                  const statusMeta = this.getStatusMeta(room.operational_status);
                  const color = room.room_type_color || '#3b82f6';
                  return `
                  <tr class="hover:bg-surface-container-low/50 transition-colors group">
                    <!-- Room Number -->
                    <td class="px-4 py-3 font-bold font-data-mono text-sm text-on-surface">
                      ${room.room_number}
                    </td>

                    <!-- Floor -->
                    <td class="px-4 py-3">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant font-data-mono">
                        Floor ${room.floor}
                      </span>
                    </td>

                    <!-- Room Type -->
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${color}"></span>
                        <div class="overflow-hidden">
                          <p class="font-semibold text-on-surface truncate">${room.room_type_name || 'Standard'}</p>
                          <p class="text-[10px] font-data-mono text-on-surface-variant uppercase">${room.room_type_code || ''}</p>
                        </div>
                      </div>
                    </td>

                    <!-- Beds -->
                    <td class="px-4 py-3">
                      <span class="inline-flex items-center gap-1 font-data-mono text-[11px] font-bold text-on-surface">
                        <span class="material-symbols-outlined text-14px text-primary">bed</span>
                        ${room.bed_count || 1} ${room.bed_count === 1 ? 'Bed' : 'Beds'}
                      </span>
                    </td>

                    <!-- Capacity -->
                    <td class="px-4 py-3 text-on-surface-variant">
                      <span class="flex items-center gap-1 font-data-mono text-[11px]">
                        <span class="material-symbols-outlined text-14px">group</span>
                        ${room.base_occupancy || 2} Base / ${room.max_occupancy || 3} Max
                      </span>
                    </td>

                    <!-- Base Price -->
                    <td class="px-4 py-3 font-bold font-data-mono text-on-surface">
                      $${parseFloat(room.base_price || 0).toFixed(2)}
                      <span class="text-[10px] font-normal text-on-surface-variant">/nt</span>
                    </td>

                    <!-- Operational Status -->
                    <td class="px-4 py-3">
                      <div class="relative inline-block">
                        <select 
                          class="select-inline-status text-[11px] font-semibold px-2 py-1 rounded-md border appearance-none pr-6 cursor-pointer focus:outline-none transition-colors"
                          style="background-color: ${statusMeta.bg}; color: ${statusMeta.text}; border-color: ${statusMeta.border}"
                          data-room-id="${room.id}"
                        >
                          <option value="VACANT_CLEAN" ${room.operational_status === 'VACANT_CLEAN' ? 'selected' : ''}>Vacant Clean</option>
                          <option value="VACANT_DIRTY" ${room.operational_status === 'VACANT_DIRTY' ? 'selected' : ''}>Vacant Dirty</option>
                          <option value="OCCUPIED" ${room.operational_status === 'OCCUPIED' ? 'selected' : ''}>Occupied</option>
                          <option value="OUT_OF_ORDER" ${room.operational_status === 'OUT_OF_ORDER' ? 'selected' : ''}>Out of Order</option>
                          <option value="INSPECTION_REQUIRED" ${room.operational_status === 'INSPECTION_REQUIRED' ? 'selected' : ''}>Inspection Req</option>
                        </select>
                        <span class="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-14px pointer-events-none" style="color: ${statusMeta.text}">
                          expand_more
                        </span>
                      </div>
                    </td>

                    <!-- Current Occupancy -->
                    <td class="px-4 py-3">
                      ${
                        room.occupant_name
                          ? `
                        <div class="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold text-[11px]">
                          <span class="material-symbols-outlined text-14px">person</span>
                          <span class="truncate">${room.occupant_name}</span>
                          <span class="text-[10px] font-data-mono text-on-surface-variant font-normal">#${room.active_reservation_number || ''}</span>
                        </div>
                      `
                          : room.operational_status === 'OCCUPIED'
                          ? `<span class="text-[11px] text-blue-600 font-medium">Occupied (Allocated)</span>`
                          : `<span class="text-[11px] text-on-surface-variant">Vacant / Unoccupied</span>`
                      }
                    </td>

                    <!-- Actions -->
                    <td class="px-4 py-3 text-right space-x-1">
                      <button 
                        class="btn-edit-room p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-md transition-colors cursor-pointer"
                        title="Edit Room Details"
                        data-room-id="${room.id}"
                      >
                        <span class="material-symbols-outlined text-16px">edit</span>
                      </button>
                      <button 
                        class="btn-delete-room p-1.5 text-on-surface-variant hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors cursor-pointer"
                        title="Delete Room"
                        data-room-id="${room.id}"
                        data-room-num="${room.room_number}"
                      >
                        <span class="material-symbols-outlined text-16px">delete</span>
                      </button>
                    </td>
                  </tr>
                `;
                })
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ── RENDER ROOM CARD (FOR FLOOR VIEW) ───────────────────────────────────────
  renderRoomCard(room) {
    const statusMeta = this.getStatusMeta(room.operational_status);
    const typeColor = room.room_type_color || '#3b82f6';

    return `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-lg p-3 hover:border-primary/50 transition-all shadow-2xs flex flex-col justify-between gap-2.5 group relative">
        <!-- Card Top: Room #, Type Pill, and Actions -->
        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="flex items-center gap-1.5">
              <span class="text-base font-bold font-data-mono text-on-surface tracking-tight">${room.room_number}</span>
              <span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-surface-container text-on-surface-variant font-data-mono">
                Fl ${room.floor}
              </span>
              <span class="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-primary/10 text-primary border border-primary/20 font-data-mono">
                <span class="material-symbols-outlined text-11px">bed</span>
                ${room.bed_count || 1}
              </span>
            </div>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class="w-2 h-2 rounded-full shrink-0" style="background-color: ${typeColor}"></span>
              <span class="text-[11px] font-medium text-on-surface truncate" title="${room.room_type_name || ''}">
                ${room.room_type_name || 'Standard'}
              </span>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center opacity-80 group-hover:opacity-100 transition-opacity">
            <button 
              class="btn-edit-room p-1 text-on-surface-variant hover:text-primary rounded transition-colors cursor-pointer"
              title="Edit Room"
              data-room-id="${room.id}"
            >
              <span class="material-symbols-outlined text-15px">edit</span>
            </button>
            <button 
              class="btn-delete-room p-1 text-on-surface-variant hover:text-rose-600 rounded transition-colors cursor-pointer"
              title="Delete Room"
              data-room-id="${room.id}"
              data-room-num="${room.room_number}"
            >
              <span class="material-symbols-outlined text-15px">delete</span>
            </button>
          </div>
        </div>

        <!-- Occupancy or Guest Details -->
        <div class="text-[11px] min-h-[20px] flex items-center">
          ${
            room.occupant_name
              ? `
            <div class="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold truncate">
              <span class="material-symbols-outlined text-13px shrink-0">person</span>
              <span class="truncate">${room.occupant_name}</span>
            </div>
          `
              : room.operational_status === 'OCCUPIED'
              ? `<span class="text-blue-600 font-medium">Occupied</span>`
              : `<span class="text-on-surface-variant/70">Vacant</span>`
          }
        </div>

        <!-- Card Bottom: Status Pill + Pricing & Capacity -->
        <div class="pt-2 border-t border-outline-variant/50 flex items-center justify-between gap-2">
          <!-- Status Dropdown -->
          <div class="relative inline-block">
            <select 
              class="select-inline-status text-[10px] font-semibold px-2 py-0.5 rounded-md border appearance-none pr-5 cursor-pointer focus:outline-none"
              style="background-color: ${statusMeta.bg}; color: ${statusMeta.text}; border-color: ${statusMeta.border}"
              data-room-id="${room.id}"
            >
              <option value="VACANT_CLEAN" ${room.operational_status === 'VACANT_CLEAN' ? 'selected' : ''}>Clean</option>
              <option value="VACANT_DIRTY" ${room.operational_status === 'VACANT_DIRTY' ? 'selected' : ''}>Dirty</option>
              <option value="OCCUPIED" ${room.operational_status === 'OCCUPIED' ? 'selected' : ''}>Occupied</option>
              <option value="OUT_OF_ORDER" ${room.operational_status === 'OUT_OF_ORDER' ? 'selected' : ''}>OOO</option>
              <option value="INSPECTION_REQUIRED" ${room.operational_status === 'INSPECTION_REQUIRED' ? 'selected' : ''}>Inspect</option>
            </select>
            <span class="material-symbols-outlined absolute right-1 top-1/2 -translate-y-1/2 text-12px pointer-events-none" style="color: ${statusMeta.text}">
              expand_more
            </span>
          </div>

          <!-- Price & Capacity -->
          <div class="text-right font-data-mono">
            <span class="text-xs font-bold text-on-surface">$${parseFloat(room.base_price || 0).toFixed(0)}</span>
            <span class="text-[9px] text-on-surface-variant">/nt</span>
          </div>
        </div>
      </div>
    `;
  }

  // ── RENDER ROOM TYPES TAB ───────────────────────────────────────────────────
  renderRoomTypesTab() {
    return `
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-base font-bold text-on-surface">Room Classifications & Inventory Allocations</h2>
            <p class="text-xs text-on-surface-variant">Define rate plans, bedding configurations, and color styling for each room type.</p>
          </div>
          <button 
            id="btn-add-room-type-header"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-on-primary shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
          >
            <span class="material-symbols-outlined text-16px">add</span>
            <span>Add Room Type</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${this.roomTypes
            .map((rt) => {
              const assignedRooms = this.rooms.filter((r) => r.room_type_id === rt.id);
              const color = rt.color_code || '#2563eb';
              return `
              <div class="bg-surface-container-lowest border border-outline-variant/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between gap-4">
                <div class="space-y-2">
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex items-center gap-2">
                      <span class="w-4 h-4 rounded-full shrink-0 shadow-2xs border border-white/20" style="background-color: ${color}"></span>
                      <div>
                        <h3 class="text-sm font-bold text-on-surface">${rt.name}</h3>
                        <span class="text-[10px] font-bold font-data-mono text-on-surface-variant uppercase tracking-wider">${rt.code}</span>
                      </div>
                    </div>
                    
                    <div class="flex items-center gap-1">
                      <button 
                        class="btn-edit-room-type p-1 text-on-surface-variant hover:text-primary rounded cursor-pointer"
                        title="Edit Type"
                        data-type-id="${rt.id}"
                      >
                        <span class="material-symbols-outlined text-16px">edit</span>
                      </button>
                      <button 
                        class="btn-delete-room-type p-1 text-on-surface-variant hover:text-rose-600 rounded cursor-pointer"
                        title="Delete Type"
                        data-type-id="${rt.id}"
                        data-type-name="${rt.name}"
                        data-assigned-count="${assignedRooms.length}"
                      >
                        <span class="material-symbols-outlined text-16px">delete</span>
                      </button>
                    </div>
                  </div>

                  <p class="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    ${rt.description || 'No description provided.'}
                  </p>
                </div>

                <!-- Attributes Strip -->
                <div class="grid grid-cols-3 gap-2 py-2.5 px-3 bg-surface-container rounded-lg text-center font-data-mono">
                  <div>
                    <span class="text-[9px] text-on-surface-variant uppercase block">Base Price</span>
                    <strong class="text-xs text-on-surface">$${parseFloat(rt.base_price || 0).toFixed(0)}</strong>
                  </div>
                  <div>
                    <span class="text-[9px] text-on-surface-variant uppercase block">Occupancy</span>
                    <strong class="text-xs text-on-surface">${rt.base_occupancy} - ${rt.max_occupancy}</strong>
                  </div>
                  <div>
                    <span class="text-[9px] text-on-surface-variant uppercase block">Physical Units</span>
                    <strong class="text-xs text-primary font-bold">${assignedRooms.length}</strong>
                  </div>
                </div>

                <!-- Assigned Rooms Chips Preview -->
                <div class="space-y-1">
                  <span class="text-[10px] font-bold text-on-surface-variant uppercase font-label-caps">Assigned Rooms:</span>
                  <div class="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                    ${
                      assignedRooms.length
                        ? assignedRooms
                            .map(
                              (r) => `
                        <span class="px-1.5 py-0.5 rounded text-[10px] font-bold font-data-mono bg-surface-container-high text-on-surface border border-outline-variant/60">
                          ${r.room_number}
                        </span>
                      `
                            )
                            .join('')
                        : `<span class="text-[11px] text-on-surface-variant italic">No rooms mapped yet</span>`
                    }
                  </div>
                </div>
              </div>
            `;
            })
            .join('')}
        </div>
      </div>
    `;
  }

  // ── RENDER FLOORS DISTRIBUTION TAB ──────────────────────────────────────────
  renderFloorsTab(distinctFloors) {
    return `
      <div class="space-y-4">
        <div>
          <h2 class="text-base font-bold text-on-surface">Floor Distribution & Property Zoning</h2>
          <p class="text-xs text-on-surface-variant">Review total room counts, active categories, and inventory density by floor.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${distinctFloors
            .map((fl) => {
              const floorRooms = this.rooms.filter((r) => String(r.floor) === String(fl));
              const occupied = floorRooms.filter((r) => r.operational_status === 'OCCUPIED').length;
              const occRate = floorRooms.length ? Math.round((occupied / floorRooms.length) * 100) : 0;

              // Types present on this floor
              const typesOnFloor = {};
              floorRooms.forEach((r) => {
                const name = r.room_type_name || 'Standard';
                typesOnFloor[name] = (typesOnFloor[name] || 0) + 1;
              });

              return `
              <div class="bg-surface-container-lowest border border-outline-variant/80 rounded-xl p-4 shadow-2xs space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <div class="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-base font-data-mono shadow-xs">
                      ${fl}
                    </div>
                    <div>
                      <h3 class="text-sm font-bold text-on-surface">Floor ${fl}</h3>
                      <p class="text-[11px] text-on-surface-variant">${floorRooms.length} physical rooms</p>
                    </div>
                  </div>

                  <div class="text-right">
                    <span class="text-sm font-bold font-data-mono text-on-surface">${occRate}%</span>
                    <p class="text-[10px] text-on-surface-variant">Occupancy</p>
                  </div>
                </div>

                <!-- Progress Bar -->
                <div class="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div class="bg-primary h-full rounded-full transition-all duration-500" style="width: ${occRate}%"></div>
                </div>

                <!-- Breakdown of Types -->
                <div class="space-y-1.5">
                  <span class="text-[10px] font-bold text-on-surface-variant uppercase font-label-caps">Categories on Floor:</span>
                  <div class="space-y-1">
                    ${Object.entries(typesOnFloor)
                      .map(
                        ([typeName, count]) => `
                      <div class="flex items-center justify-between text-xs py-0.5 border-b border-outline-variant/30">
                        <span class="text-on-surface truncate">${typeName}</span>
                        <span class="font-data-mono font-bold text-on-surface-variant">${count}</span>
                      </div>
                    `
                      )
                      .join('')}
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2 pt-2">
                  <button 
                    class="btn-quick-add-to-floor flex-1 py-1.5 text-xs font-semibold bg-surface-container hover:bg-surface-container-high text-primary border border-primary/20 rounded-lg transition-colors cursor-pointer"
                    data-floor="${fl}"
                  >
                    + Add Room
                  </button>
                  <button 
                    class="btn-quick-batch-to-floor flex-1 py-1.5 text-xs font-semibold bg-secondary/15 hover:bg-secondary/25 text-secondary border border-secondary/30 rounded-lg transition-colors cursor-pointer"
                    data-floor="${fl}"
                  >
                    + Batch Generate
                  </button>
                </div>
              </div>
            `;
            })
            .join('')}
        </div>
      </div>
    `;
  }

  // ── RENDER MODALS ───────────────────────────────────────────────────────────
  renderModals() {
    if (!this.activeModal) return '';

    if (this.activeModal === 'ADD_ROOM' || this.activeModal === 'EDIT_ROOM') {
      const isEdit = this.activeModal === 'EDIT_ROOM';
      const room = this.modalPayload || {};
      const distinctFloors = [...new Set(this.rooms.map((r) => String(r.floor).trim()))];

      return `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div class="bg-surface-bright border border-outline-variant rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-0">
            <!-- Modal Header -->
            <div class="px-6 py-4 bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-primary text-22px">
                  ${isEdit ? 'edit_square' : 'add_circle'}
                </span>
                <h3 class="text-base font-bold text-on-surface">
                  ${isEdit ? `Edit Room #${room.room_number}` : 'Add Physical Room'}
                </h3>
              </div>
              <button class="btn-close-modal p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg cursor-pointer">
                <span class="material-symbols-outlined text-18px">close</span>
              </button>
            </div>

            <!-- Modal Form -->
            <form id="form-room" class="p-6 space-y-4">
              <!-- Room Number -->
              <div>
                <label class="block text-xs font-bold text-on-surface mb-1">Room Number *</label>
                <input 
                  type="text" 
                  name="room_number" 
                  required 
                  placeholder="e.g. 601, 102B" 
                  value="${room.room_number || ''}"
                  class="w-full bg-surface-container px-3 py-2 rounded-lg text-xs font-data-mono font-bold text-on-surface border border-outline-variant focus:outline-none focus:border-primary"
                />
              </div>

              <!-- Floor Input / Selector -->
              <div>
                <label class="block text-xs font-bold text-on-surface mb-1">Floor Designation *</label>
                <div class="flex gap-2">
                  <input 
                    type="text" 
                    id="input-floor-value"
                    name="floor" 
                    required 
                    placeholder="e.g. 2, 3, Penthouse" 
                    value="${room.floor || ''}"
                    class="flex-1 bg-surface-container px-3 py-2 rounded-lg text-xs font-bold text-on-surface border border-outline-variant focus:outline-none focus:border-primary"
                  />
                  <select 
                    id="select-existing-floors"
                    class="bg-surface-container text-xs text-on-surface px-2.5 py-2 rounded-lg border border-outline-variant cursor-pointer"
                  >
                    <option value="">Existing Floors</option>
                    ${distinctFloors.map((f) => `<option value="${f}">Floor ${f}</option>`).join('')}
                  </select>
                </div>
              </div>

              <!-- Room Type Selection -->
              <div>
                <label class="block text-xs font-bold text-on-surface mb-1">Room Type / Classification *</label>
                <select 
                  name="room_type_id" 
                  required
                  class="w-full bg-surface-container px-3 py-2 rounded-lg text-xs font-medium text-on-surface border border-outline-variant focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="">Select Room Type...</option>
                  ${this.roomTypes
                    .map(
                      (rt) => `
                    <option value="${rt.id}" ${room.room_type_id === rt.id ? 'selected' : ''}>
                      ${rt.name} (${rt.code}) — $${parseFloat(rt.base_price).toFixed(0)}/nt [Max Occ: ${rt.max_occupancy}]
                    </option>
                  `
                    )
                    .join('')}
                </select>
              </div>

              <!-- Number of Beds (Editable) -->
              <div>
                <label class="block text-xs font-bold text-on-surface mb-1 flex items-center justify-between">
                  <span>Number of Beds *</span>
                  <span class="text-[10px] text-on-surface-variant font-normal font-data-mono">Bed Count Configuration</span>
                </label>
                <div class="relative">
                  <input 
                    type="number" 
                    name="bed_count" 
                    min="1" 
                    max="10" 
                    required 
                    placeholder="e.g. 1, 2, 3" 
                    value="${room.bed_count !== undefined ? room.bed_count : 1}"
                    class="w-full bg-surface-container pl-9 pr-3 py-2 rounded-lg text-xs font-data-mono font-bold text-on-surface border border-outline-variant focus:outline-none focus:border-primary"
                  />
                  <span class="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-16px text-primary pointer-events-none">bed</span>
                </div>
                <p class="text-[10px] text-on-surface-variant mt-0.5">Physical bed count for this room unit</p>
              </div>

              <!-- Operational Status -->
              <div>
                <label class="block text-xs font-bold text-on-surface mb-1">Initial Operational Status</label>
                <select 
                  name="operational_status" 
                  class="w-full bg-surface-container px-3 py-2 rounded-lg text-xs font-medium text-on-surface border border-outline-variant focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="VACANT_CLEAN" ${(!room.operational_status || room.operational_status === 'VACANT_CLEAN') ? 'selected' : ''}>Vacant Clean</option>
                  <option value="VACANT_DIRTY" ${room.operational_status === 'VACANT_DIRTY' ? 'selected' : ''}>Vacant Dirty</option>
                  <option value="OCCUPIED" ${room.operational_status === 'OCCUPIED' ? 'selected' : ''}>Occupied</option>
                  <option value="OUT_OF_ORDER" ${room.operational_status === 'OUT_OF_ORDER' ? 'selected' : ''}>Out of Order (OOO)</option>
                  <option value="INSPECTION_REQUIRED" ${room.operational_status === 'INSPECTION_REQUIRED' ? 'selected' : ''}>Inspection Required</option>
                </select>
              </div>

              <!-- Action Buttons -->
              <div class="pt-3 flex items-center justify-end gap-2.5">
                <button 
                  type="button" 
                  class="btn-close-modal px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  id="btn-submit-room"
                  class="px-5 py-2 rounded-lg text-xs font-bold bg-primary text-on-primary hover:bg-primary/90 shadow-sm transition-all cursor-pointer"
                >
                  ${isEdit ? 'Save Changes' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      `;
    }

    if (this.activeModal === 'BATCH_ROOMS') {
      const defaultFloor = (this.modalPayload && this.modalPayload.floor) || '2';
      return `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div class="bg-surface-bright border border-outline-variant rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-0">
            <!-- Modal Header -->
            <div class="px-6 py-4 bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-secondary text-22px">dynamic_feed</span>
                <h3 class="text-base font-bold text-on-surface">Batch Room Generator</h3>
              </div>
              <button class="btn-close-modal p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg cursor-pointer">
                <span class="material-symbols-outlined text-18px">close</span>
              </button>
            </div>

            <!-- Batch Form -->
            <form id="form-batch-rooms" class="p-6 space-y-4">
              <p class="text-xs text-on-surface-variant leading-relaxed">
                Generate an entire corridor or floor of rooms in a single click. Specify the target floor and room range (e.g. 601 to 612).
              </p>

              <!-- Floor Input -->
              <div>
                <label class="block text-xs font-bold text-on-surface mb-1">Target Floor *</label>
                <input 
                  type="text" 
                  name="floor" 
                  required 
                  placeholder="e.g. 6" 
                  value="${defaultFloor}"
                  class="w-full bg-surface-container px-3 py-2 rounded-lg text-xs font-bold text-on-surface border border-outline-variant focus:outline-none focus:border-primary"
                />
              </div>

              <!-- Range Numbers -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-on-surface mb-1">Start Room Number *</label>
                  <input 
                    type="number" 
                    name="start_number" 
                    required 
                    placeholder="e.g. 601" 
                    value="${defaultFloor}01"
                    class="w-full bg-surface-container px-3 py-2 rounded-lg text-xs font-data-mono font-bold text-on-surface border border-outline-variant focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-on-surface mb-1">End Room Number *</label>
                  <input 
                    type="number" 
                    name="end_number" 
                    required 
                    placeholder="e.g. 612" 
                    value="${defaultFloor}10"
                    class="w-full bg-surface-container px-3 py-2 rounded-lg text-xs font-data-mono font-bold text-on-surface border border-outline-variant focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <!-- Room Type Selection -->
              <div>
                <label class="block text-xs font-bold text-on-surface mb-1">Assign Room Type *</label>
                <select 
                  name="room_type_id" 
                  required
                  class="w-full bg-surface-container px-3 py-2 rounded-lg text-xs font-medium text-on-surface border border-outline-variant focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="">Select Room Type for this batch...</option>
                  ${this.roomTypes
                    .map(
                      (rt) => `
                    <option value="${rt.id}">
                      ${rt.name} (${rt.code}) — $${parseFloat(rt.base_price).toFixed(0)}/nt
                    </option>
                  `
                    )
                    .join('')}
                </select>
              </div>

              <!-- Number of Beds per Room -->
              <div>
                <label class="block text-xs font-bold text-on-surface mb-1">Number of Beds per Room *</label>
                <div class="relative">
                  <input 
                    type="number" 
                    name="bed_count" 
                    min="1" 
                    max="10" 
                    required 
                    placeholder="e.g. 1 or 2" 
                    value="1"
                    class="w-full bg-surface-container pl-9 pr-3 py-2 rounded-lg text-xs font-data-mono font-bold text-on-surface border border-outline-variant focus:outline-none focus:border-primary"
                  />
                  <span class="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-16px text-secondary pointer-events-none">bed</span>
                </div>
              </div>

              <!-- Initial Status -->
              <div>
                <label class="block text-xs font-bold text-on-surface mb-1">Initial Status</label>
                <select 
                  name="operational_status" 
                  class="w-full bg-surface-container px-3 py-2 rounded-lg text-xs font-medium text-on-surface border border-outline-variant focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="VACANT_CLEAN" selected>Vacant Clean (Ready for occupancy)</option>
                  <option value="VACANT_DIRTY">Vacant Dirty</option>
                  <option value="OUT_OF_ORDER">Out of Order (OOO)</option>
                  <option value="INSPECTION_REQUIRED">Inspection Required</option>
                </select>
              </div>

              <!-- Action Buttons -->
              <div class="pt-3 flex items-center justify-end gap-2.5">
                <button 
                  type="button" 
                  class="btn-close-modal px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  id="btn-submit-batch-rooms"
                  class="px-5 py-2 rounded-lg text-xs font-bold bg-secondary text-on-secondary hover:bg-secondary/90 shadow-sm transition-all cursor-pointer"
                >
                  Generate Rooms
                </button>
              </div>
            </form>
          </div>
        </div>
      `;
    }

    if (this.activeModal === 'ADD_TYPE' || this.activeModal === 'EDIT_TYPE') {
      const isEdit = this.activeModal === 'EDIT_TYPE';
      const rt = this.modalPayload || {};
      const palette = ['#b7c8de', '#bcc7dd', '#fed65b', '#041627', '#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

      return `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div class="bg-surface-bright border border-outline-variant rounded-2xl w-full max-w-md overflow-hidden shadow-2xl space-y-0">
            <!-- Modal Header -->
            <div class="px-6 py-4 bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-primary text-22px">category</span>
                <h3 class="text-base font-bold text-on-surface">
                  ${isEdit ? `Edit Room Type: ${rt.name}` : 'New Room Type Classification'}
                </h3>
              </div>
              <button class="btn-close-modal p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg cursor-pointer">
                <span class="material-symbols-outlined text-18px">close</span>
              </button>
            </div>

            <!-- Form -->
            <form id="form-room-type" class="p-6 space-y-4">
              <!-- Code & Name -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-on-surface mb-1">Code *</label>
                  <input 
                    type="text" 
                    name="code" 
                    required 
                    placeholder="e.g. JR_STE" 
                    value="${rt.code || ''}"
                    class="w-full bg-surface-container px-3 py-2 rounded-lg text-xs font-data-mono font-bold uppercase text-on-surface border border-outline-variant focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-on-surface mb-1">Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    placeholder="e.g. Junior Suite" 
                    value="${rt.name || ''}"
                    class="w-full bg-surface-container px-3 py-2 rounded-lg text-xs font-bold text-on-surface border border-outline-variant focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <!-- Description -->
              <div>
                <label class="block text-xs font-bold text-on-surface mb-1">Description</label>
                <textarea 
                  name="description" 
                  rows="2"
                  placeholder="Describe bed configuration, view, and luxury amenities..."
                  class="w-full bg-surface-container px-3 py-2 rounded-lg text-xs text-on-surface border border-outline-variant focus:outline-none focus:border-primary resize-none"
                >${rt.description || ''}</textarea>
              </div>

              <!-- Base Price & Occupancy -->
              <div class="grid grid-cols-3 gap-3">
                <div>
                  <label class="block text-xs font-bold text-on-surface mb-1">Base Price ($) *</label>
                  <input 
                    type="number" 
                    name="base_price" 
                    step="0.01"
                    required 
                    placeholder="250.00" 
                    value="${rt.base_price || ''}"
                    class="w-full bg-surface-container px-3 py-2 rounded-lg text-xs font-data-mono font-bold text-on-surface border border-outline-variant focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-on-surface mb-1">Base Occ</label>
                  <input 
                    type="number" 
                    name="base_occupancy" 
                    min="1"
                    value="${rt.base_occupancy || 2}"
                    class="w-full bg-surface-container px-3 py-2 rounded-lg text-xs font-data-mono text-on-surface border border-outline-variant focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label class="block text-xs font-bold text-on-surface mb-1">Max Occ</label>
                  <input 
                    type="number" 
                    name="max_occupancy" 
                    min="1"
                    value="${rt.max_occupancy || 3}"
                    class="w-full bg-surface-container px-3 py-2 rounded-lg text-xs font-data-mono text-on-surface border border-outline-variant focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <!-- Color Picker Swatches -->
              <div>
                <label class="block text-xs font-bold text-on-surface mb-1.5">Color Badge</label>
                <div class="flex items-center gap-2 flex-wrap">
                  ${palette
                    .map(
                      (c) => `
                    <label class="cursor-pointer">
                      <input 
                        type="radio" 
                        name="color_code" 
                        value="${c}" 
                        ${(rt.color_code || '#2563eb') === c ? 'checked' : ''}
                        class="sr-only peer"
                      />
                      <span class="w-6 h-6 rounded-full block border-2 border-transparent peer-checked:border-primary peer-checked:scale-110 transition-all shadow-xs" style="background-color: ${c}"></span>
                    </label>
                  `
                    )
                    .join('')}
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="pt-3 flex items-center justify-end gap-2.5">
                <button 
                  type="button" 
                  class="btn-close-modal px-4 py-2 rounded-lg text-xs font-semibold text-on-surface-variant hover:bg-surface-container cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  id="btn-submit-room-type"
                  class="px-5 py-2 rounded-lg text-xs font-bold bg-primary text-on-primary hover:bg-primary/90 shadow-sm transition-all cursor-pointer"
                >
                  ${isEdit ? 'Save Changes' : 'Create Room Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      `;
    }

    return '';
  }

  // ── STATUS STYLING HELPER ───────────────────────────────────────────────────
  getStatusMeta(status) {
    switch (status) {
      case 'VACANT_CLEAN':
        return { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' };
      case 'VACANT_DIRTY':
        return { bg: '#fffbeb', text: '#d97706', border: '#fde68a' };
      case 'OCCUPIED':
        return { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' };
      case 'OUT_OF_ORDER':
        return { bg: '#fff1f2', text: '#e11d48', border: '#fecdd3' };
      case 'INSPECTION_REQUIRED':
        return { bg: '#faf5ff', text: '#9333ea', border: '#e9d5ff' };
      default:
        return { bg: '#f3f4f6', text: '#4b5563', border: '#e5e7eb' };
    }
  }

  // ── EVENT BINDINGS ──────────────────────────────────────────────────────────
  bindEvents() {
    if (!this.container) return;

    // 1. Navigation Tab Switching
    this.container.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.onclick = () => {
        this.activeTab = btn.dataset.tab;
        this.renderContent();
      };
    });

    // 2. View Mode Toggle (by_floor vs grid)
    this.container.querySelectorAll('.btn-toggle-view').forEach((btn) => {
      btn.onclick = () => {
        this.viewMode = btn.dataset.mode;
        this.renderContent();
      };
    });

    // 3. Jump to House Status
    const navHouseStatus = this.container.querySelector('#btn-nav-to-house-status');
    if (navHouseStatus) {
      navHouseStatus.onclick = () => {
        store.setNavTab('house_status');
      };
    }

    // 4. Refresh Button
    const refreshBtn = this.container.querySelector('#btn-refresh-room-master');
    if (refreshBtn) {
      refreshBtn.onclick = async () => {
        refreshBtn.classList.add('animate-spin');
        await this.loadData();
        refreshBtn.classList.remove('animate-spin');
        store.showToast('Room Master inventory synchronized.', 'success');
        this.renderContent();
      };
    }

    // 5. Search Input
    const searchInput = this.container.querySelector('#input-room-search');
    if (searchInput) {
      searchInput.oninput = (e) => {
        this.searchQuery = e.target.value.trim();
        this.renderContent();
        // Keep focus on input
        const reInput = this.container.querySelector('#input-room-search');
        if (reInput) {
          reInput.focus();
          reInput.setSelectionRange(reInput.value.length, reInput.value.length);
        }
      };
    }

    // 6. Filter Selectors
    const floorSelect = this.container.querySelector('#select-filter-floor');
    if (floorSelect) {
      floorSelect.onchange = (e) => {
        this.filterFloor = e.target.value;
        this.renderContent();
      };
    }

    const typeSelect = this.container.querySelector('#select-filter-type');
    if (typeSelect) {
      typeSelect.onchange = (e) => {
        this.filterType = e.target.value;
        this.renderContent();
      };
    }

    const statusSelect = this.container.querySelector('#select-filter-status');
    if (statusSelect) {
      statusSelect.onchange = (e) => {
        this.filterStatus = e.target.value;
        this.renderContent();
      };
    }

    // 7. Clear Filters
    const clearBtn = this.container.querySelector('#btn-clear-filters');
    if (clearBtn) {
      clearBtn.onclick = () => {
        this.filterFloor = 'ALL';
        this.filterType = 'ALL';
        this.filterStatus = 'ALL';
        this.searchQuery = '';
        this.renderContent();
      };
    }

    // 8. Open Add Room Modal
    const addRoomBtn = this.container.querySelector('#btn-open-add-room');
    if (addRoomBtn) {
      addRoomBtn.onclick = () => {
        this.activeModal = 'ADD_ROOM';
        this.modalPayload = null;
        this.renderContent();
      };
    }

    const emptyAddRoomBtn = this.container.querySelector('#btn-empty-add-room');
    if (emptyAddRoomBtn) {
      emptyAddRoomBtn.onclick = () => {
        this.activeModal = 'ADD_ROOM';
        this.modalPayload = null;
        this.renderContent();
      };
    }

    // 9. Open Batch Generator Modal
    const batchBtn = this.container.querySelector('#btn-open-batch-rooms');
    if (batchBtn) {
      batchBtn.onclick = () => {
        this.activeModal = 'BATCH_ROOMS';
        this.modalPayload = { floor: '2' };
        this.renderContent();
      };
    }

    const emptyBatchBtn = this.container.querySelector('#btn-empty-batch-rooms');
    if (emptyBatchBtn) {
      emptyBatchBtn.onclick = () => {
        this.activeModal = 'BATCH_ROOMS';
        this.modalPayload = { floor: '2' };
        this.renderContent();
      };
    }

    // 10. Quick Add / Batch to specific floor
    this.container.querySelectorAll('.btn-quick-add-to-floor').forEach((btn) => {
      btn.onclick = () => {
        const floor = btn.dataset.floor;
        this.activeModal = 'ADD_ROOM';
        this.modalPayload = { floor };
        this.renderContent();
      };
    });

    this.container.querySelectorAll('.btn-quick-batch-to-floor').forEach((btn) => {
      btn.onclick = () => {
        const floor = btn.dataset.floor;
        this.activeModal = 'BATCH_ROOMS';
        this.modalPayload = { floor };
        this.renderContent();
      };
    });

    // 11. Open Add Room Type Modal
    const addTypeBtn = this.container.querySelector('#btn-open-add-type');
    if (addTypeBtn) {
      addTypeBtn.onclick = () => {
        this.activeModal = 'ADD_TYPE';
        this.modalPayload = null;
        this.renderContent();
      };
    }

    const addTypeHeaderBtn = this.container.querySelector('#btn-add-room-type-header');
    if (addTypeHeaderBtn) {
      addTypeHeaderBtn.onclick = () => {
        this.activeModal = 'ADD_TYPE';
        this.modalPayload = null;
        this.renderContent();
      };
    }

    // 12. Edit Room Trigger
    this.container.querySelectorAll('.btn-edit-room').forEach((btn) => {
      btn.onclick = () => {
        const roomId = btn.dataset.roomId;
        const room = this.rooms.find((r) => r.id === roomId);
        if (room) {
          this.activeModal = 'EDIT_ROOM';
          this.modalPayload = { ...room };
          this.renderContent();
        }
      };
    });

    // 13. Delete Room Trigger
    this.container.querySelectorAll('.btn-delete-room').forEach((btn) => {
      btn.onclick = async () => {
        const roomId = btn.dataset.roomId;
        const roomNum = btn.dataset.roomNum;
        if (confirm(`Are you sure you want to delete Room #${roomNum}? This action cannot be undone.`)) {
          try {
            await reservationsClient.deleteRoom(roomId);
            store.showToast(`Room #${roomNum} deleted successfully.`, 'success');
            await this.loadData();
            this.renderContent();
          } catch (err) {
            store.showToast(err.message, 'error');
          }
        }
      };
    });

    // 14. Edit Room Type Trigger
    this.container.querySelectorAll('.btn-edit-room-type').forEach((btn) => {
      btn.onclick = () => {
        const typeId = btn.dataset.typeId;
        const rt = this.roomTypes.find((t) => t.id === typeId);
        if (rt) {
          this.activeModal = 'EDIT_TYPE';
          this.modalPayload = { ...rt };
          this.renderContent();
        }
      };
    });

    // 15. Delete Room Type Trigger
    this.container.querySelectorAll('.btn-delete-room-type').forEach((btn) => {
      btn.onclick = async () => {
        const typeId = btn.dataset.typeId;
        const typeName = btn.dataset.typeName;
        const count = parseInt(btn.dataset.assignedCount, 10);
        if (count > 0) {
          store.showToast(`Cannot delete "${typeName}": ${count} rooms are assigned to it. Reassign or delete those rooms first.`, 'warning');
          return;
        }

        if (confirm(`Delete room type "${typeName}"?`)) {
          try {
            await reservationsClient.deleteRoomType(typeId);
            store.showToast(`Room type "${typeName}" deleted.`, 'success');
            await this.loadData();
            this.renderContent();
          } catch (err) {
            store.showToast(err.message, 'error');
          }
        }
      };
    });

    // 16. Inline Operational Status Change
    this.container.querySelectorAll('.select-inline-status').forEach((select) => {
      select.onchange = async (e) => {
        const roomId = select.dataset.roomId;
        const newStatus = e.target.value;
        try {
          await reservationsClient.updateRoom(roomId, { operational_status: newStatus });
          store.showToast(`Room status updated to ${newStatus}`, 'success');
          // Update local state
          const target = this.rooms.find((r) => r.id === roomId);
          if (target) target.operational_status = newStatus;
          this.renderContent();
        } catch (err) {
          store.showToast(err.message, 'error');
          await this.loadData();
          this.renderContent();
        }
      };
    });

    // 17. Modal Close Buttons
    this.container.querySelectorAll('.btn-close-modal').forEach((btn) => {
      btn.onclick = () => {
        this.activeModal = null;
        this.modalPayload = null;
        this.renderContent();
      };
    });

    // 18. Floor Selector helper in Room Modal
    const selFloorHelper = this.container.querySelector('#select-existing-floors');
    const inputFloorVal = this.container.querySelector('#input-floor-value');
    if (selFloorHelper && inputFloorVal) {
      selFloorHelper.onchange = (e) => {
        if (e.target.value) {
          inputFloorVal.value = e.target.value;
        }
      };
    }

    // 19. Submit Room Form (Add or Edit)
    const formRoom = this.container.querySelector('#form-room');
    if (formRoom) {
      formRoom.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(formRoom);
        const roomNumber = formData.get('room_number').toString().trim();
        const floor = formData.get('floor').toString().trim();
        const roomTypeId = formData.get('room_type_id').toString();
        const bedCount = parseInt(formData.get('bed_count').toString(), 10) || 1;
        const operationalStatus = formData.get('operational_status').toString();

        const submitBtn = formRoom.querySelector('#btn-submit-room');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Saving...';
        }

        try {
          if (this.activeModal === 'EDIT_ROOM') {
            await reservationsClient.updateRoom(this.modalPayload.id, {
              room_number: roomNumber,
              floor,
              room_type_id: roomTypeId,
              bed_count: bedCount,
              operational_status: operationalStatus,
            });
            store.showToast(`Room #${roomNumber} updated with ${bedCount} bed(s).`, 'success');
          } else {
            await reservationsClient.createRoom({
              room_number: roomNumber,
              floor,
              room_type_id: roomTypeId,
              bed_count: bedCount,
              operational_status: operationalStatus,
            });
            store.showToast(`Room #${roomNumber} created with ${bedCount} bed(s)!`, 'success');
          }
          this.activeModal = null;
          this.modalPayload = null;
          await this.loadData();
          this.renderContent();
        } catch (err) {
          store.showToast(err.message, 'error');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = this.activeModal === 'EDIT_ROOM' ? 'Save Changes' : 'Create Room';
          }
        }
      };
    }

    // 20. Submit Batch Generator Form
    const formBatch = this.container.querySelector('#form-batch-rooms');
    if (formBatch) {
      formBatch.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(formBatch);
        const floor = formData.get('floor').toString().trim();
        const startNumber = formData.get('start_number').toString();
        const endNumber = formData.get('end_number').toString();
        const roomTypeId = formData.get('room_type_id').toString();
        const bedCount = parseInt(formData.get('bed_count').toString(), 10) || 1;
        const operationalStatus = formData.get('operational_status').toString();

        const submitBtn = formBatch.querySelector('#btn-submit-batch-rooms');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Generating Rooms...';
        }

        try {
          const res = await reservationsClient.batchCreateRooms({
            floor,
            start_number: startNumber,
            end_number: endNumber,
            room_type_id: roomTypeId,
            bed_count: bedCount,
            operational_status: operationalStatus,
          });

          const createdCount = res.data?.created?.length || 0;
          const skipped = res.data?.skipped || [];
          let msg = `Created ${createdCount} rooms on Floor ${floor}!`;
          if (skipped.length > 0) {
            msg += ` (${skipped.length} skipped because they already exist: ${skipped.join(', ')})`;
          }

          store.showToast(msg, 'success');
          this.activeModal = null;
          this.modalPayload = null;
          await this.loadData();
          this.renderContent();
        } catch (err) {
          store.showToast(err.message, 'error');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Generate Rooms';
          }
        }
      };
    }

    // 21. Submit Room Type Form (Add or Edit)
    const formType = this.container.querySelector('#form-room-type');
    if (formType) {
      formType.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(formType);
        const code = formData.get('code').toString().trim();
        const name = formData.get('name').toString().trim();
        const description = (formData.get('description') || '').toString().trim();
        const basePrice = parseFloat(formData.get('base_price').toString());
        const baseOccupancy = parseInt(formData.get('base_occupancy').toString(), 10) || 2;
        const maxOccupancy = parseInt(formData.get('max_occupancy').toString(), 10) || 3;
        const colorCode = formData.get('color_code') ? formData.get('color_code').toString() : '#2563eb';

        const submitBtn = formType.querySelector('#btn-submit-room-type');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Saving...';
        }

        try {
          if (this.activeModal === 'EDIT_TYPE') {
            await reservationsClient.updateRoomType(this.modalPayload.id, {
              code,
              name,
              description,
              base_price: basePrice,
              base_occupancy: baseOccupancy,
              max_occupancy: maxOccupancy,
              color_code: colorCode,
            });
            store.showToast(`Room type "${name}" updated.`, 'success');
          } else {
            await reservationsClient.createRoomType({
              code,
              name,
              description,
              base_price: basePrice,
              base_occupancy: baseOccupancy,
              max_occupancy: maxOccupancy,
              color_code: colorCode,
            });
            store.showToast(`Room type "${name}" created!`, 'success');
          }
          this.activeModal = null;
          this.modalPayload = null;
          await this.loadData();
          this.renderContent();
        } catch (err) {
          store.showToast(err.message, 'error');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = this.activeModal === 'EDIT_TYPE' ? 'Save Changes' : 'Create Room Type';
          }
        }
      };
    }
  }
}
