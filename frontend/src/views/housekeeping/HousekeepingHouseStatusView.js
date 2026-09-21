// ==========================================================================
// VOLVITECH HOSPITALITY OS — HOUSEKEEPING HOUSE STATUS & ROOM MATRIX
// Stitch Design System Architecture: 6-Column Room Matrix Grid + Dual Telemetry
// Unified Housekeeping Cleanliness & Engineering Work Orders with Slide-Over Drawer
// Structured Shift Time Slots: Morning (07:00-15:30), Evening (15:00-23:30), Night (23:00-07:30)
// ==========================================================================

import { store } from '../../state/store.js';
import { InRoomTabletModal } from './InRoomTabletModal.js';
import { RoomEntryProtocolModal } from './RoomEntryProtocolModal.js';

export class HousekeepingHouseStatusView {
  constructor() {
    this.container = null;
    this.unsubscribe = null;

    // Filters & Navigation State
    this.selectedFloor = 'ALL'; // 'ALL', '2', '3', '4', '5'
    this.selectedCategory = 'ALL'; // 'ALL', 'Classic King Room', 'Deluxe Ocean Suite', 'Executive Panoramic Suite', 'Presidential Royal Penthouse'
    this.selectedStatus = 'ALL'; // 'ALL', 'Inspected', 'Clean', 'In Progress', 'Dirty', 'Work Order Open', 'Out of Order'
    this.searchQuery = '';

    // Selected Room & Drawer
    this.selectedRoom = null;
    this.activeDrawerTab = 'turnover'; // 'turnover' | 'maintenance' | 'guest'
    
    // Checklist State for Selected Room
    this.roomChecklists = {};

    // Modals
    this.isHandoverModalOpen = false;
    this.isDefectModalOpen = false;
    this.selectedRoomForDefect = null;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER LIFECYCLE
  // ──────────────────────────────────────────────────────────────────────────
  render() {
    this.container = document.createElement('div');
    this.container.className = 'w-full space-y-5 animate-fadeIn pb-16 select-none';
    this.renderContent();

    // Subscribe to central reactive store
    if (this.unsubscribe) {
      try { this.unsubscribe(); } catch (_) {}
    }
    this.unsubscribe = store.subscribe(() => {
      this.renderContent();
    });

    return this.container;
  }

  destroy() {
    if (this.unsubscribe) {
      try { this.unsubscribe(); } catch (_) {}
      this.unsubscribe = null;
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // DATA ACCESSORS & METRICS
  // ──────────────────────────────────────────────────────────────────────────
  getRoomsTelemetry() {
    const rawRooms = store.state.rooms || [];
    return rawRooms.map(r => {
      const combined = store.getRoomCombinedStatus(r.id || r.roomNumber);
      return {
        ...r,
        number: String(r.roomNumber || r.id),
        category: r.type || 'Standard Room',
        ...combined
      };
    }).filter(Boolean);
  }

  calculateShiftProgress(shift) {
    if (!shift || !shift.startTime || !shift.endTime) {
      return { progressPct: 65, remainingText: '2h 45m remaining' };
    }
    try {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const [startH, startM] = shift.startTime.split(':').map(Number);
      const [endH, endM] = shift.endTime.split(':').map(Number);

      let startMin = startH * 60 + startM;
      let endMin = endH * 60 + endM;

      if (endMin < startMin) endMin += 24 * 60; // Night shift wraps midnight
      let curMinAdj = currentMinutes;
      if (curMinAdj < startMin && endMin > 24 * 60) curMinAdj += 24 * 60;

      const totalShiftMinutes = endMin - startMin;
      let elapsedMinutes = curMinAdj - startMin;
      if (elapsedMinutes < 0) elapsedMinutes = 0;
      if (elapsedMinutes > totalShiftMinutes) elapsedMinutes = totalShiftMinutes;

      const progressPct = Math.min(100, Math.max(0, Math.round((elapsedMinutes / totalShiftMinutes) * 100)));
      const remainingMinutes = Math.max(0, totalShiftMinutes - elapsedMinutes);
      const remH = Math.floor(remainingMinutes / 60);
      const remM = remainingMinutes % 60;

      return {
        progressPct: progressPct || 55,
        remainingText: `${remH}h ${remM}m remaining in slot`
      };
    } catch (_) {
      return { progressPct: 65, remainingText: '2h 45m remaining in slot' };
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MAIN HTML RENDERER
  // ──────────────────────────────────────────────────────────────────────────
  renderContent() {
    if (!this.container) return;

    const currentShift = store.getCurrentShift();
    const allShifts = store.getHousekeepingShiftTimeSlots();
    const shiftProgress = this.calculateShiftProgress(currentShift);
    const rooms = this.getRoomsTelemetry();

    // Re-bind selectedRoom reference if state changed
    if (this.selectedRoom) {
      this.selectedRoom = rooms.find(r => r.number === this.selectedRoom.number) || null;
    }

    // Counts for KPI Telemetry Ribbon & Legend
    const totalCount = rooms.length;
    const inspectedCount = rooms.filter(r => r.cleanlinessStatus === 'Inspected' && !r.isOOO).length;
    const cleanCount = rooms.filter(r => r.cleanlinessStatus === 'Clean' && !r.isOOO).length;
    const inProgressCount = rooms.filter(r => r.cleanlinessStatus === 'In Progress' && !r.isOOO).length;
    const dirtyCount = rooms.filter(r => r.cleanlinessStatus === 'Dirty' && !r.isOOO).length;
    const workOrderCount = rooms.filter(r => r.maintenanceStatus === 'Work Order Open' && !r.isOOO).length;
    const oooCount = rooms.filter(r => r.isOOO || r.cleanlinessStatus === 'Out of Order' || r.maintenanceStatus === 'Out of Order').length;
    
    const occupiedCount = rooms.filter(r => r.occupancy === 'Occupied').length;
    const vacantCount = rooms.filter(r => r.occupancy === 'Vacant').length;
    const readyCount = rooms.filter(r => r.isReadyForCheckIn).length;

    // Filter Rooms for 6-Column Grid
    const filteredRooms = rooms.filter(r => {
      // Floor filter
      if (this.selectedFloor !== 'ALL' && String(r.floor) !== String(this.selectedFloor)) {
        return false;
      }
      // Category filter
      if (this.selectedCategory !== 'ALL' && r.type !== this.selectedCategory) {
        return false;
      }
      // Status Legend Filter
      if (this.selectedStatus !== 'ALL') {
        if (this.selectedStatus === 'Inspected' && r.cleanlinessStatus !== 'Inspected') return false;
        if (this.selectedStatus === 'Clean' && r.cleanlinessStatus !== 'Clean') return false;
        if (this.selectedStatus === 'In Progress' && r.cleanlinessStatus !== 'In Progress') return false;
        if (this.selectedStatus === 'Dirty' && r.cleanlinessStatus !== 'Dirty') return false;
        if (this.selectedStatus === 'Work Order Open' && r.maintenanceStatus !== 'Work Order Open') return false;
        if (this.selectedStatus === 'Out of Order' && !r.isOOO) return false;
        if (this.selectedStatus === 'Ready' && !r.isReadyForCheckIn) return false;
      }
      // Search Query
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        const numMatch = String(r.number).toLowerCase().includes(q);
        const guestMatch = (r.guest || '').toLowerCase().includes(q);
        const hkMatch = (r.housekeeper || '').toLowerCase().includes(q);
        const typeMatch = (r.type || '').toLowerCase().includes(q);
        if (!numMatch && !guestMatch && !hkMatch && !typeMatch) return false;
      }
      return true;
    });

    const handoverNotes = store.state.shiftHandoverNotes || [];

    this.container.innerHTML = `
      <!-- ================================================================= -->
      <!-- 1. TOP SCREEN HEADER — HOUSEKEEPING HOUSE STATUS -->
      <!-- ================================================================= -->
      <header class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest border border-outline-variant/80 rounded-2xl p-4.5 shadow-xs">
        <!-- Left: Title + Workspace Indicator -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
            <span class="material-symbols-outlined text-[22px]">grid_view</span>
          </div>
          <div>
            <div class="flex items-center gap-2.5">
              <h1 class="font-headline-lg text-xl sm:text-2xl font-bold text-primary tracking-tight">House Status & Operations Board</h1>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                Housekeeping Matrix
              </span>
            </div>
            <p class="text-xs text-on-surface-variant font-medium mt-0.5">
              Physical room cleanliness pipelines, attendant zone turnover & real-time engineering work orders
            </p>
          </div>
        </div>

        <!-- Right: Actions (Shift Log + Report Defect) -->
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Readiness Telemetry Chip -->
          <div class="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-emerald-700 text-white shadow-xs border border-emerald-600">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse"></span>
            <div class="text-left">
              <div class="text-xs font-bold leading-none tracking-tight">${readyCount} Ready for Guest</div>
              <div class="text-[10px] text-emerald-100 leading-none mt-1 font-data-mono font-bold">${inspectedCount} Inspected · ${cleanCount} Clean</div>
            </div>
          </div>

          <!-- Shift Handover Log Button -->
          <button 
            id="btn-open-handover-log"
            class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant text-xs font-semibold text-on-surface hover:bg-surface-container hover:text-primary transition-all cursor-pointer shadow-2xs"
            title="View or record inter-shift briefing notes"
          >
            <span class="material-symbols-outlined text-[16px] text-primary">history_edu</span>
            <span>Shift Handover Log (${handoverNotes.length})</span>
          </button>

          <!-- Report Maintenance Defect Button -->
          <button 
            id="btn-report-maint-top"
            class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <span class="material-symbols-outlined text-[16px]">build</span>
            <span>Report Maintenance Defect</span>
          </button>
        </div>
      </header>

      <!-- ================================================================= -->
      <!-- 2. SHIFT TIME SLOT CONTROLLER RIBBON -->
      <!-- ================================================================= -->
      <section class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/80 shadow-xs space-y-3">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <span class="material-symbols-outlined text-[22px]">schedule</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[11px] font-label-caps uppercase text-on-surface-variant font-bold tracking-wider font-data-mono">
                  Active Housekeeping Shift
                </span>
                <span class="px-2 py-0.2 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  LIVE SLOT
                </span>
              </div>
              <h2 class="text-sm sm:text-base font-bold text-on-surface">
                ${currentShift ? currentShift.name : 'Morning Shift'} 
                <span class="text-xs font-semibold text-on-surface-variant font-data-mono">(${currentShift ? currentShift.startTime : '07:00'} – ${currentShift ? currentShift.endTime : '15:30'})</span>
                <span class="text-xs text-on-surface-variant font-normal hidden sm:inline">· Lead: <strong class="text-primary">${currentShift ? currentShift.activeLead : 'Victoria S.'}</strong></span>
              </h2>
            </div>
          </div>

          <!-- Shift Selector Tabs -->
          <div class="flex items-center bg-surface-container p-1 rounded-xl border border-outline-variant/60 gap-1 self-start md:self-center">
            ${allShifts.map(s => {
              const isActive = currentShift && currentShift.id === s.id;
              return `
                <button
                  class="btn-switch-shift px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive 
                      ? 'bg-primary text-on-primary shadow-xs' 
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  }"
                  data-shift-id="${s.id}"
                >
                  <span class="material-symbols-outlined text-[15px]">${s.id === 'shift-morning' ? 'wb_sunny' : s.id === 'shift-evening' ? 'wb_twilight' : 'bedtime'}</span>
                  <span>${s.name.replace(' Shift', '')}</span>
                  <span class="text-[10px] font-mono opacity-80">${s.startTime}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Shift Progress Bar -->
        <div>
          <div class="flex justify-between items-center text-[11px] font-data-mono text-on-surface-variant mb-1">
            <span>Shift Slot Elapsed: <strong class="text-on-surface">${shiftProgress.progressPct}%</strong></span>
            <span class="font-bold text-primary">${shiftProgress.remainingText}</span>
          </div>
          <div class="w-full h-1.5 rounded-full bg-surface-container overflow-hidden border border-outline-variant/30">
            <div 
              class="h-full bg-linear-to-r from-primary to-emerald-500 rounded-full transition-all duration-500" 
              style="width: ${shiftProgress.progressPct}%"
            ></div>
          </div>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- 3. KPI TELEMETRY RIBBON (7-CARD HIGH-VISIBILITY STRIP) -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-2.5 sm:gap-3">
        <!-- 1. Total Rooms -->
        <div class="btn-quick-filter-metric bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant flex flex-col justify-between shadow-xs hover:border-primary cursor-pointer transition-colors" data-filter-status="ALL">
          <div class="flex items-center justify-between">
            <span class="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase font-data-mono">All Units</span>
            <span class="material-symbols-outlined text-primary text-[17px]">domain</span>
          </div>
          <div class="mt-2 flex items-baseline justify-between">
            <span class="text-2xl font-black text-primary font-display-kpi leading-none">${totalCount}</span>
            <span class="text-[11px] font-semibold text-on-surface-variant font-data-mono">${occupiedCount} Occ · ${vacantCount} Vac</span>
          </div>
          <div class="mt-2.5 w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
            <div class="bg-primary h-1.5 rounded-full" style="width: 100%"></div>
          </div>
        </div>

        <!-- 2. Ready for Guest (Inspected & Operational) -->
        <div class="btn-quick-filter-metric bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-300 flex flex-col justify-between shadow-xs hover:border-emerald-500 cursor-pointer transition-colors" data-filter-status="Inspected">
          <div class="flex items-center justify-between">
            <span class="font-label-caps text-[10px] font-bold text-emerald-900 uppercase font-data-mono">Ready for Guest</span>
            <span class="material-symbols-outlined text-emerald-600 text-[17px]">verified</span>
          </div>
          <div class="mt-2 flex items-baseline justify-between">
            <span class="text-2xl font-black text-emerald-700 font-display-kpi leading-none">${inspectedCount}</span>
            <span class="text-[11px] font-semibold text-emerald-600 font-data-mono">${totalCount > 0 ? Math.round((inspectedCount/totalCount)*100) : 0}%</span>
          </div>
          <div class="mt-2.5 w-full bg-emerald-200 rounded-full h-1.5 overflow-hidden">
            <div class="bg-emerald-600 h-1.5 rounded-full" style="width: ${totalCount > 0 ? (inspectedCount/totalCount)*100 : 0}%"></div>
          </div>
        </div>

        <!-- 3. Clean (Pending Inspection) -->
        <div class="btn-quick-filter-metric bg-teal-50/70 p-3.5 rounded-xl border border-teal-300 flex flex-col justify-between shadow-xs hover:border-teal-500 cursor-pointer transition-colors" data-filter-status="Clean">
          <div class="flex items-center justify-between">
            <span class="font-label-caps text-[10px] font-bold text-teal-900 uppercase font-data-mono">Clean (QA)</span>
            <span class="material-symbols-outlined text-teal-600 text-[17px]">cleaning_services</span>
          </div>
          <div class="mt-2 flex items-baseline justify-between">
            <span class="text-2xl font-black text-teal-700 font-display-kpi leading-none">${cleanCount}</span>
            <span class="text-[11px] font-semibold text-teal-600 font-data-mono">${totalCount > 0 ? Math.round((cleanCount/totalCount)*100) : 0}%</span>
          </div>
          <div class="mt-2.5 w-full bg-teal-200 rounded-full h-1.5 overflow-hidden">
            <div class="bg-teal-600 h-1.5 rounded-full" style="width: ${totalCount > 0 ? (cleanCount/totalCount)*100 : 0}%"></div>
          </div>
        </div>

        <!-- 4. In Progress (Cleaning Active) -->
        <div class="btn-quick-filter-metric bg-amber-50/70 p-3.5 rounded-xl border border-amber-300 flex flex-col justify-between shadow-xs hover:border-amber-500 cursor-pointer transition-colors" data-filter-status="In Progress">
          <div class="flex items-center justify-between">
            <span class="font-label-caps text-[10px] font-bold text-amber-900 uppercase font-data-mono">In Progress</span>
            <span class="material-symbols-outlined text-amber-600 text-[17px]">hourglass_top</span>
          </div>
          <div class="mt-2 flex items-baseline justify-between">
            <span class="text-2xl font-black text-amber-700 font-display-kpi leading-none">${inProgressCount}</span>
            <span class="text-[11px] font-semibold text-amber-600 font-data-mono">${totalCount > 0 ? Math.round((inProgressCount/totalCount)*100) : 0}%</span>
          </div>
          <div class="mt-2.5 w-full bg-amber-200 rounded-full h-1.5 overflow-hidden">
            <div class="bg-amber-600 h-1.5 rounded-full" style="width: ${totalCount > 0 ? (inProgressCount/totalCount)*100 : 0}%"></div>
          </div>
        </div>

        <!-- 5. Dirty / Turnover -->
        <div class="btn-quick-filter-metric bg-red-50/70 p-3.5 rounded-xl border border-red-300 flex flex-col justify-between shadow-xs hover:border-red-500 cursor-pointer transition-colors" data-filter-status="Dirty">
          <div class="flex items-center justify-between">
            <span class="font-label-caps text-[10px] font-bold text-red-900 uppercase font-data-mono">Dirty / Turnover</span>
            <span class="material-symbols-outlined text-red-600 text-[17px]">dry_cleaning</span>
          </div>
          <div class="mt-2 flex items-baseline justify-between">
            <span class="text-2xl font-black text-red-700 font-display-kpi leading-none">${dirtyCount}</span>
            <span class="text-[11px] font-semibold text-red-600 font-data-mono">${totalCount > 0 ? Math.round((dirtyCount/totalCount)*100) : 0}%</span>
          </div>
          <div class="mt-2.5 w-full bg-red-200 rounded-full h-1.5 overflow-hidden">
            <div class="bg-red-600 h-1.5 rounded-full" style="width: ${totalCount > 0 ? (dirtyCount/totalCount)*100 : 0}%"></div>
          </div>
        </div>

        <!-- 6. Active Maintenance (Work Order) -->
        <div class="btn-quick-filter-metric bg-orange-50/70 p-3.5 rounded-xl border border-orange-300 flex flex-col justify-between shadow-xs hover:border-orange-500 cursor-pointer transition-colors" data-filter-status="Work Order Open">
          <div class="flex items-center justify-between">
            <span class="font-label-caps text-[10px] font-bold text-orange-900 uppercase font-data-mono">Active Maint</span>
            <span class="material-symbols-outlined text-orange-600 text-[17px]">engineering</span>
          </div>
          <div class="mt-2 flex items-baseline justify-between">
            <span class="text-2xl font-black text-orange-700 font-display-kpi leading-none">${workOrderCount}</span>
            <span class="text-[11px] font-semibold text-orange-600 font-data-mono">${totalCount > 0 ? Math.round((workOrderCount/totalCount)*100) : 0}%</span>
          </div>
          <div class="mt-2.5 w-full bg-orange-200 rounded-full h-1.5 overflow-hidden">
            <div class="bg-orange-600 h-1.5 rounded-full" style="width: ${totalCount > 0 ? (workOrderCount/totalCount)*100 : 0}%"></div>
          </div>
        </div>

        <!-- 7. Damaged / Out of Order -->
        <div class="btn-quick-filter-metric bg-slate-100 p-3.5 rounded-xl border border-slate-300 flex flex-col justify-between shadow-xs hover:border-slate-500 cursor-pointer transition-colors col-span-2 md:col-span-2 xl:col-span-1" data-filter-status="Out of Order">
          <div class="flex items-center justify-between">
            <span class="font-label-caps text-[10px] font-bold text-slate-800 uppercase font-data-mono">Damaged / OOO</span>
            <span class="material-symbols-outlined text-slate-700 text-[17px]">block</span>
          </div>
          <div class="mt-2 flex items-baseline justify-between">
            <span class="text-2xl font-black text-slate-900 font-display-kpi leading-none">${oooCount}</span>
            <span class="text-[11px] font-semibold text-slate-600 font-data-mono">${totalCount > 0 ? Math.round((oooCount/totalCount)*100) : 0}%</span>
          </div>
          <div class="mt-2.5 w-full bg-slate-300 rounded-full h-1.5 overflow-hidden">
            <div class="bg-slate-700 h-1.5 rounded-full" style="width: ${totalCount > 0 ? (oooCount/totalCount)*100 : 0}%"></div>
          </div>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- 4. FILTER TOOLBAR & LIVE STATUS LEGEND (STITCH TOOLBAR SYSTEM) -->
      <!-- ================================================================= -->
      <section class="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/80 space-y-3 shadow-xs">
        <!-- Row 1: Floor Tabs, Category Selector & Live Search -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <!-- Floor Selector Tabs -->
          <div class="flex items-center gap-1 bg-surface-container p-1 rounded-xl overflow-x-auto custom-scrollbar">
            ${[
              { id: 'ALL', label: `All Floors (${totalCount})` },
              { id: '2', label: 'Floor 2' },
              { id: '3', label: 'Floor 3 (Executive)' },
              { id: '4', label: 'Floor 4 (Suites)' },
              { id: '5', label: 'Floor 5 (Penthouse)' }
            ].map(fl => `
              <button class="btn-floor-tab px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                this.selectedFloor === fl.id
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-lowest'
              }" data-floor="${fl.id}">
                ${fl.label}
              </button>
            `).join('')}
          </div>

          <!-- Controls: Category Dropdown & Search -->
          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Category Dropdown -->
            <div class="relative">
              <select id="house-filter-category" class="appearance-none pl-3 pr-8 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs text-primary font-semibold hover:border-primary/50 cursor-pointer shadow-2xs focus:ring-2 focus:ring-primary/20 outline-hidden">
                <option value="ALL" ${this.selectedCategory === 'ALL' ? 'selected' : ''}>All Room Categories</option>
                <option value="Classic King Room" ${this.selectedCategory === 'Classic King Room' ? 'selected' : ''}>Classic King Room</option>
                <option value="Deluxe Ocean Suite" ${this.selectedCategory === 'Deluxe Ocean Suite' ? 'selected' : ''}>Deluxe Ocean Suite</option>
                <option value="Executive Panoramic Suite" ${this.selectedCategory === 'Executive Panoramic Suite' ? 'selected' : ''}>Executive Panoramic Suite</option>
                <option value="Presidential Royal Penthouse" ${this.selectedCategory === 'Presidential Royal Penthouse' ? 'selected' : ''}>Presidential Royal Penthouse</option>
              </select>
              <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[16px]">expand_more</span>
            </div>

            <!-- Instant Search Input -->
            <div class="relative w-48 sm:w-60">
              <span class="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">search</span>
              <input 
                type="text" 
                id="house-search-input" 
                value="${this.searchQuery}"
                placeholder="Search room, attendant, guest..." 
                class="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface placeholder:text-on-surface-variant/70 shadow-2xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-hidden"
              />
            </div>

            ${(this.selectedFloor !== 'ALL' || this.selectedCategory !== 'ALL' || this.selectedStatus !== 'ALL' || this.searchQuery) ? `
              <button id="btn-house-reset-filters" class="px-2.5 py-1.5 rounded-xl text-xs font-bold text-primary hover:bg-surface-container transition-colors flex items-center gap-1 cursor-pointer">
                <span class="material-symbols-outlined text-[15px]">restart_alt</span>
                <span>Reset</span>
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Row 2: Status Legend with Interactive Filter Counts -->
        <div class="flex flex-wrap items-center gap-2 pt-2.5 border-t border-outline-variant/40">
          <span class="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider font-data-mono mr-1">HOUSEKEEPING STATUS:</span>

          <!-- ALL PILL -->
          <button class="btn-house-legend-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            this.selectedStatus === 'ALL'
              ? 'bg-primary text-on-primary font-bold shadow-xs'
              : 'bg-surface-container-lowest border border-outline-variant text-on-surface hover:border-primary/50'
          }" data-status="ALL">
            <span class="w-2 h-2 rounded-full ${this.selectedStatus === 'ALL' ? 'bg-white' : 'bg-slate-400'}"></span>
            <span>All Units</span>
            <span class="font-data-mono font-bold text-[11px]">(${totalCount})</span>
          </button>

          <!-- INSPECTED / READY -->
          <button class="btn-house-legend-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            this.selectedStatus === 'Inspected'
              ? 'bg-[#10b981] text-white font-bold shadow-xs border-2 border-emerald-600'
              : 'bg-[#10b981] text-white hover:brightness-105 shadow-2xs'
          }" data-status="Inspected">
            <span class="w-2 h-2 rounded-full bg-white"></span>
            <span>Inspected</span>
            <span class="font-data-mono font-bold text-[11px] text-white/90">(${inspectedCount})</span>
          </button>

          <!-- CLEAN -->
          <button class="btn-house-legend-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            this.selectedStatus === 'Clean'
              ? 'bg-[#0d9488] text-white font-bold shadow-xs border-2 border-teal-600'
              : 'bg-[#0d9488] text-white hover:brightness-105 shadow-2xs'
          }" data-status="Clean">
            <span class="w-2 h-2 rounded-full bg-white"></span>
            <span>Clean (QA)</span>
            <span class="font-data-mono font-bold text-[11px] text-white/90">(${cleanCount})</span>
          </button>

          <!-- IN PROGRESS -->
          <button class="btn-house-legend-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            this.selectedStatus === 'In Progress'
              ? 'bg-[#f59e0b] text-white font-bold shadow-xs border-2 border-amber-600'
              : 'bg-[#f59e0b] text-white hover:brightness-105 shadow-2xs'
          }" data-status="In Progress">
            <span class="w-2 h-2 rounded-full bg-white"></span>
            <span>In Progress</span>
            <span class="font-data-mono font-bold text-[11px] text-white/90">(${inProgressCount})</span>
          </button>

          <!-- DIRTY / TURNOVER -->
          <button class="btn-house-legend-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            this.selectedStatus === 'Dirty'
              ? 'bg-[#f87171] text-white font-bold shadow-xs border-2 border-rose-600'
              : 'bg-[#f87171] text-white hover:brightness-105 shadow-2xs'
          }" data-status="Dirty">
            <span class="w-2 h-2 rounded-full bg-white"></span>
            <span>Dirty / Turnover</span>
            <span class="font-data-mono font-bold text-[11px] text-white/90">(${dirtyCount})</span>
          </button>

          <!-- WORK ORDER OPEN -->
          <button class="btn-house-legend-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            this.selectedStatus === 'Work Order Open'
              ? 'bg-[#ea580c] text-white font-bold shadow-xs border-2 border-orange-600'
              : 'bg-[#ea580c] text-white hover:brightness-105 shadow-2xs'
          }" data-status="Work Order Open">
            <span class="w-2 h-2 rounded-full bg-white"></span>
            <span>Work Order</span>
            <span class="font-data-mono font-bold text-[11px] text-white/90">(${workOrderCount})</span>
          </button>

          <!-- DAMAGED / OOO -->
          <button class="btn-house-legend-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            this.selectedStatus === 'Out of Order'
              ? 'bg-[#1e293b] text-white border-2 border-slate-900 font-bold shadow-xs'
              : 'bg-[#1e293b] text-white hover:brightness-105 shadow-2xs'
          }" data-status="Out of Order">
            <span class="w-2 h-2 rounded-full bg-white"></span>
            <span>Damaged / OOO</span>
            <span class="font-data-mono font-bold text-[11px] text-white/90">(${oooCount})</span>
          </button>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- 5. 6-COLUMN HOUSE STATUS ROOM MATRIX (MATCHING FRONT DESK MODULE) -->
      <!-- ================================================================= -->
      <main class="w-full space-y-3">
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-primary uppercase tracking-wider bg-surface-container px-2.5 py-0.5 rounded-lg font-data-mono">
              ${this.selectedFloor === 'ALL' ? 'Entire Property Matrix' : `Floor ${this.selectedFloor} Units`}
            </span>
            <span class="text-xs text-on-surface-variant font-medium">
              Showing ${filteredRooms.length} of ${totalCount} Units · Click room card to inspect & update
            </span>
          </div>
          <span class="text-[11px] font-data-mono text-on-surface-variant flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Housekeeping Telemetry Active
          </span>
        </div>

        ${filteredRooms.length === 0 ? `
          <div class="py-16 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant p-8 space-y-3 shadow-xs">
            <span class="material-symbols-outlined text-4xl text-on-surface-variant">search_off</span>
            <h4 class="text-base font-bold text-primary">No Units Match Filter</h4>
            <p class="text-xs text-on-surface-variant max-w-md mx-auto">No rooms were found for the selected housekeeping criteria. Reset filters to view all units.</p>
            <button id="btn-empty-house-reset" class="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold cursor-pointer">
              Reset All Filters
            </button>
          </div>
        ` : `
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-3.5">
            ${filteredRooms.map(room => this.renderRoomCard(room)).join('')}
          </div>
        `}
      </main>

      <!-- ================================================================= -->
      <!-- 6. SLIDE-OVER TELEMETRY & HOUSEKEEPING INSPECTION DRAWER -->
      <!-- ================================================================= -->
      <div id="house-drawer-backdrop" class="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 transition-opacity duration-300 ${
        this.selectedRoom ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }"></div>
      
      <aside id="house-detail-drawer" class="fixed top-0 right-0 h-full w-full max-w-xl bg-surface-container-lowest shadow-2xl z-50 border-l border-outline-variant flex flex-col transform transition-transform duration-300 ease-out select-none ${
        this.selectedRoom ? 'translate-x-0' : 'translate-x-full'
      }">
        ${this.renderDrawerContent()}
      </aside>

      <!-- 7. MODAL: SHIFT HANDOVER LOG (CONDITIONAL) -->
      ${this.isHandoverModalOpen ? this.renderHandoverModal(handoverNotes, currentShift) : ''}

      <!-- 8. MODAL: REPORT MAINTENANCE DEFECT (CONDITIONAL) -->
      ${this.isDefectModalOpen ? this.renderDefectModal(rooms) : ''}
    `;

    this.bindEvents();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ROOM CARD RENDERING (6-COLUMN MATRIX HIGH-END ELEVATION)
  // ──────────────────────────────────────────────────────────────────────────
  renderRoomCard(r) {
    const isSelected = this.selectedRoom && this.selectedRoom.number === r.number;

    let cardBg = '';
    let categoryText = '';
    let numberText = '';
    let bottomBadge = '';
    let topIcon = '';

    const isOOO = r.isOOO || r.cleanlinessStatus === 'Out of Order' || r.maintenanceStatus === 'Out of Order';
    const isWorkOrder = r.maintenanceStatus === 'Work Order Open' && !isOOO;

    if (isOOO) {
      cardBg = 'bg-[#1E293B] text-white shadow-xs hover:brightness-105 border border-slate-700/60';
      categoryText = 'text-slate-400';
      numberText = 'text-white';
      topIcon = `<span class="material-symbols-outlined text-[16px] text-rose-400">block</span>`;
      bottomBadge = `
        <div class="pt-2 border-t border-white/20 flex items-center justify-between">
          <span class="text-xs font-medium text-rose-300 flex items-center gap-1 truncate">
            <span class="material-symbols-outlined text-[13px] text-rose-400">warning</span>
            <span>Out of Order</span>
          </span>
          <span class="text-[10px] bg-rose-500/20 text-rose-200 px-1.5 py-0.5 rounded font-mono font-bold">Blocked</span>
        </div>
      `;
    } else if (isWorkOrder) {
      cardBg = 'bg-[#EA580C] text-white shadow-xs hover:brightness-105 border border-orange-400/40';
      categoryText = 'text-white/90';
      numberText = 'text-white';
      topIcon = `<span class="material-symbols-outlined text-[16px] text-white/90">build</span>`;
      bottomBadge = `
        <div class="pt-2 border-t border-white/25 flex items-center justify-between">
          <span class="text-xs font-bold text-white flex items-center gap-1 truncate mr-1">
            <span class="material-symbols-outlined text-[13px]">engineering</span>
            <span class="truncate">${r.primaryTicket ? r.primaryTicket.assetName : 'Work Order'}</span>
          </span>
          <span class="text-[10px] bg-black/20 px-1.5 py-0.5 rounded text-white font-data-mono font-bold">${r.primaryTicket ? r.primaryTicket.id : 'Maint'}</span>
        </div>
      `;
    } else {
      switch (r.cleanlinessStatus) {
        case 'Inspected':
          cardBg = 'bg-[#10B981] text-white shadow-xs hover:brightness-105 border border-emerald-400/40';
          categoryText = 'text-white/90';
          numberText = 'text-white';
          topIcon = `<span class="material-symbols-outlined text-[16px] text-white/90">verified</span>`;
          bottomBadge = `
            <div class="pt-2 border-t border-white/25 flex items-center justify-between">
              <span class="text-xs font-bold text-white flex items-center gap-1">
                <span class="material-symbols-outlined text-[13px]">check_circle</span>
                <span>Inspected</span>
              </span>
              <span class="text-[10px] bg-black/15 px-1.5 py-0.5 rounded text-white font-data-mono font-bold truncate max-w-[85px]">${r.housekeeper ? r.housekeeper.split(' ')[0] : 'Ready'}</span>
            </div>
          `;
          break;

        case 'Clean':
          cardBg = 'bg-[#0D9488] text-white shadow-xs hover:brightness-105 border border-teal-400/40';
          categoryText = 'text-white/90';
          numberText = 'text-white';
          topIcon = `<span class="material-symbols-outlined text-[16px] text-white/90">cleaning_services</span>`;
          bottomBadge = `
            <div class="pt-2 border-t border-white/25 flex items-center justify-between">
              <span class="text-xs font-bold text-white flex items-center gap-1">
                <span class="material-symbols-outlined text-[13px]">done</span>
                <span>Clean (QA)</span>
              </span>
              <span class="text-[10px] bg-black/15 px-1.5 py-0.5 rounded text-white font-data-mono font-bold truncate max-w-[85px]">${r.housekeeper ? r.housekeeper.split(' ')[0] : 'Team'}</span>
            </div>
          `;
          break;

        case 'In Progress':
          cardBg = 'bg-[#F59E0B] text-white shadow-xs hover:brightness-105 border border-amber-400/40';
          categoryText = 'text-white/90';
          numberText = 'text-white';
          topIcon = `<span class="material-symbols-outlined text-[16px] text-white/90">hourglass_top</span>`;
          bottomBadge = `
            <div class="pt-2 border-t border-white/25 flex items-center justify-between">
              <span class="text-xs font-bold text-white flex items-center gap-1">
                <span class="material-symbols-outlined text-[13px]">autorenew</span>
                <span>In Progress</span>
              </span>
              <span class="text-[10px] bg-black/15 px-1.5 py-0.5 rounded text-white font-data-mono font-bold truncate max-w-[85px]">${r.housekeeper ? r.housekeeper.split(' ')[0] : 'Active'}</span>
            </div>
          `;
          break;

        case 'Dirty':
        default:
          cardBg = 'bg-[#F87171] text-white shadow-xs hover:brightness-105 border border-red-300/40';
          categoryText = 'text-white/90';
          numberText = 'text-white';
          topIcon = `<span class="material-symbols-outlined text-[16px] text-white/90">dry_cleaning</span>`;
          bottomBadge = `
            <div class="pt-2 border-t border-white/25 flex items-center justify-between">
              <span class="text-xs font-bold text-white flex items-center gap-1">
                <span class="material-symbols-outlined text-[13px]">priority_high</span>
                <span>Turnover</span>
              </span>
              <span class="text-[10px] bg-black/15 px-1.5 py-0.5 rounded text-white font-data-mono font-bold">${r.occupancy === 'Occupied' ? 'Stayover' : 'Vacant'}</span>
            </div>
          `;
          break;
      }
    }

    const selectionRing = isSelected ? 'ring-4 ring-primary ring-offset-2 shadow-lg scale-[1.03]' : '';

    return `
      <div 
        class="house-room-card rounded-2xl p-3.5 flex flex-col justify-between h-36 cursor-pointer transition-all duration-200 select-none ${cardBg} ${selectionRing}" 
        data-room-number="${r.number}"
        data-housekeeping="${r.cleanlinessStatus}"
        data-engineering="${r.maintenanceStatus}"
        title="Room ${r.number} (${r.category}) — Housekeeping: ${r.cleanlinessStatus} | Engineering: ${r.maintenanceStatus}"
      >
        <!-- Top Row: Category, Privacy & Slot Badges, and Action Icons -->
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-1.5 flex-wrap">
              <p class="text-[11px] font-bold uppercase tracking-wider leading-tight ${categoryText}">${r.category.replace(' Suite', '').replace(' Room', '')}</p>
              ${r.dnd ? `<span class="px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-200 border border-rose-500/60 text-[9px] font-bold tracking-wide">DND</span>` : ''}
              ${r.cleaningSlot ? `<span class="px-1.5 py-0.2 rounded bg-black/30 text-amber-200 border border-amber-400/50 text-[9px] font-bold font-mono">Slot: ${r.cleaningSlot.startTime}</span>` : ''}
              ${r.lastAttemptNotice ? `<span class="px-1.5 py-0.2 rounded bg-orange-950/80 text-orange-200 border border-orange-500/60 text-[9px] font-bold">Knocked (Away)</span>` : ''}
            </div>
            <p class="text-2xl sm:text-3xl font-black tracking-tight font-display-kpi mt-0.5 ${numberText}">Room ${r.number}</p>
          </div>
          <div class="flex items-center gap-1">
            <button 
              class="btn-card-open-tablet p-1 rounded-full bg-black/15 hover:bg-black/40 text-white transition-colors cursor-pointer" 
              data-room-number="${r.number}"
              title="Open In-Room Guest Tablet for Room ${r.number}"
            >
              <span class="material-symbols-outlined text-[15px]">tablet_mac</span>
            </button>
            <div class="p-1 rounded-full bg-black/10 flex items-center justify-center">
              ${topIcon}
            </div>
          </div>
        </div>

        <!-- Bottom Row: Telemetry Badge -->
        ${bottomBadge}
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // COMPREHENSIVE HOUSEKEEPING & MAINTENANCE SLIDE-OVER DRAWER
  // ──────────────────────────────────────────────────────────────────────────
  renderDrawerContent() {
    if (!this.selectedRoom) {
      return `<div class="p-6 text-center text-on-surface-variant">No room selected.</div>`;
    }

    const r = this.selectedRoom;

    let badgeClass = 'bg-[#f87171] text-white';
    if (r.cleanlinessStatus === 'Inspected') badgeClass = 'bg-[#10b981] text-white';
    else if (r.cleanlinessStatus === 'Clean') badgeClass = 'bg-[#0d9488] text-white';
    else if (r.cleanlinessStatus === 'In Progress') badgeClass = 'bg-[#f59e0b] text-white';
    else if (r.maintenanceStatus === 'Work Order Open') badgeClass = 'bg-[#ea580c] text-white';
    else if (r.isOOO) badgeClass = 'bg-[#1e293b] text-white';

    const activeTickets = r.activeTickets || [];

    return `
      <!-- Drawer Top Bar -->
      <div class="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface-bright shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-xs ${badgeClass}">
            ${r.number}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-headline-sm text-base font-bold text-primary">Room ${r.number} · ${r.category}</h3>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeClass}">
                ${r.cleanlinessStatus}
              </span>
            </div>
            <p class="text-xs text-on-surface-variant font-medium mt-0.5">Floor ${r.floor} · ${r.occupancy} · Maint: <strong class="${r.isOOO ? 'text-rose-600' : r.maintenanceStatus === 'Work Order Open' ? 'text-amber-600' : 'text-emerald-600'}">${r.maintenanceStatus}</strong></p>
          </div>
        </div>
        <button id="btn-close-house-drawer" class="p-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <!-- Segmented Drawer Navigation Switcher -->
      <div class="px-6 pt-3 pb-2 bg-surface-bright border-b border-outline-variant/60 shrink-0">
        <div class="flex items-center gap-1 p-1 bg-surface-container rounded-xl border border-outline-variant/60">
          <button class="btn-drawer-nav-tab flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
            this.activeDrawerTab === 'turnover' ? 'bg-primary text-on-primary font-bold shadow-xs' : 'text-on-surface-variant hover:text-primary'
          }" data-drawer-tab="turnover">Turnover & QA</button>
          
          <button class="btn-drawer-nav-tab flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
            this.activeDrawerTab === 'maintenance' ? 'bg-primary text-on-primary font-bold shadow-xs' : 'text-on-surface-variant hover:text-primary'
          }" data-drawer-tab="maintenance">Maintenance (${activeTickets.length})</button>
          
          <button class="btn-drawer-nav-tab flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
            this.activeDrawerTab === 'guest' ? 'bg-primary text-on-primary font-bold shadow-xs' : 'text-on-surface-variant hover:text-primary'
          }" data-drawer-tab="guest">Guest & Stay</button>
        </div>
      </div>

      <!-- Drawer Tab Panels (Scrollable) -->
      <div class="p-6 overflow-y-auto flex-1 space-y-5 text-xs custom-scrollbar">
        ${
          this.activeDrawerTab === 'turnover'
            ? this.renderDrawerTurnoverTab(r)
            : this.activeDrawerTab === 'maintenance'
            ? this.renderDrawerMaintenanceTab(r)
            : this.renderDrawerGuestTab(r)
        }
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // DRAWER TAB 1: TURNOVER & QA INSPECTION
  // ──────────────────────────────────────────────────────────────────────────
  renderDrawerTurnoverTab(r) {
    const checklistItems = [
      { id: 'chk-1', label: 'Fresh Bedding & Premium Linen Restock' },
      { id: 'chk-2', label: 'Bathroom Sanitization & Fresh Towels' },
      { id: 'chk-3', label: 'Minibar & Complimentary Water Audit' },
      { id: 'chk-4', label: 'Surface Dusting & High-Touch Disinfection' },
      { id: 'chk-5', label: 'Vacuuming & Floor Polishing' },
      { id: 'chk-6', label: 'Guest Luxury Amenities & Toiletries' },
      { id: 'chk-7', label: 'Waste Clearance & Bin Liner Replacements' },
      { id: 'chk-8', label: 'Climate Control & Air Freshener Check' }
    ];

    const currentChecks = this.roomChecklists[r.number] || {};
    const checkedCount = Object.values(currentChecks).filter(Boolean).length;
    const staffList = store.getHousekeepingStaff ? store.getHousekeepingStaff() : [];

    return `
      <!-- Dual Status Card -->
      <div class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant shadow-xs space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-on-surface-variant uppercase font-data-mono">Cleanliness Lifecycle</span>
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold ${this.getHkStatusBadgeClass(r.cleanlinessStatus)}">
            ${r.cleanlinessStatus}
          </span>
        </div>

        <!-- Quick Lifecycle Controls -->
        <div class="grid grid-cols-2 gap-2 pt-1">
          <button 
            id="btn-drawer-mark-inprogress" 
            class="py-2 px-2.5 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 font-bold text-xs hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[16px]">hourglass_top</span>
            <span>Start Cleaning</span>
          </button>
          <button 
            id="btn-drawer-mark-clean" 
            class="py-2 px-2.5 rounded-xl border border-teal-300 bg-teal-50 dark:bg-teal-950/30 text-teal-800 dark:text-teal-200 font-bold text-xs hover:bg-teal-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[16px]">cleaning_services</span>
            <span>Mark Cleaned</span>
          </button>
          <button 
            id="btn-drawer-mark-inspected" 
            class="py-2 px-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs col-span-2 sm:col-span-1"
          >
            <span class="material-symbols-outlined text-[16px]">verified</span>
            <span>Pass QA Inspection</span>
          </button>
          <button 
            id="btn-drawer-mark-dirty" 
            class="py-2 px-2.5 rounded-xl border border-rose-300 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200 font-bold text-xs hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer col-span-2 sm:col-span-1"
          >
            <span class="material-symbols-outlined text-[16px]">priority_high</span>
            <span>Fail QA (Rework)</span>
          </button>
        </div>
      </div>

      <!-- Room Access & Guest Tablet Protocols Card -->
      <div class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant shadow-xs space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-on-surface-variant uppercase font-data-mono">Room Access & Privacy Protocol</span>
          ${r.dnd ? '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border border-rose-400">🛑 DND ACTIVE</span>' : '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-400">DND OFF</span>'}
        </div>

        <div class="grid grid-cols-2 gap-2 pt-0.5">
          <button 
            id="btn-drawer-open-entry-protocol"
            class="py-2.5 px-3 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span class="material-symbols-outlined text-[17px]">door_front</span>
            <span>Knock & Entry Protocol</span>
          </button>
          <button 
            id="btn-drawer-open-tablet"
            class="py-2.5 px-3 rounded-xl border border-primary/40 bg-primary/10 text-primary font-bold text-xs hover:bg-primary/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span class="material-symbols-outlined text-[17px]">tablet_mac</span>
            <span>In-Room Tablet</span>
          </button>
        </div>

        ${r.cleaningSlot ? `
          <div class="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-200 flex items-center justify-between">
            <span class="flex items-center gap-1.5 font-semibold">
              <span class="material-symbols-outlined text-[16px] text-amber-600">schedule</span>
              <span>Guest Preferred Slot: <strong>${r.cleaningSlot.startTime} – ${r.cleaningSlot.endTime}</strong></span>
            </span>
            <span class="text-[10px] font-mono opacity-80">${r.cleaningSlot.label}</span>
          </div>
        ` : ''}

        ${r.lastAttemptNotice ? `
          <div class="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-300 dark:border-orange-800 text-[11px] text-orange-800 dark:text-orange-200 flex items-start gap-1.5">
            <span class="material-symbols-outlined text-[16px] text-orange-600 shrink-0 mt-0.5">privacy_tip</span>
            <div>
              <strong class="font-bold">Service Attempted:</strong> Attendant knocked at ${r.lastAttemptNotice.time} with no response. Entry deferred to respect guest privacy.
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Attendant Assignment Card -->
      <div class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant shadow-xs space-y-2.5">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-on-surface-variant uppercase font-data-mono">Assigned Floor Attendant</span>
          <span class="text-xs font-bold text-primary">${r.housekeeper || 'Unassigned'}</span>
        </div>
        <div class="flex items-center gap-2">
          <select id="select-drawer-reassign-staff" class="flex-1 px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant text-xs text-on-surface font-medium focus:ring-1 focus:ring-primary focus:outline-hidden">
            <option value="">-- Reassign Attendant --</option>
            ${staffList.map(s => `
              <option value="${s.name}" ${r.housekeeper === s.name ? 'selected' : ''}>
                ${s.name} (${s.role}) · Floor ${s.primaryFloors ? s.primaryFloors.join(',') : s.floor || 'All'}
              </option>
            `).join('')}
          </select>
          <button id="btn-drawer-save-staff" class="px-3.5 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer">
            Assign
          </button>
        </div>
      </div>

      <!-- 8-Point Turnover Checklist -->
      <div class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant shadow-xs space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-on-surface-variant uppercase font-data-mono">Inspection Checklist</span>
          <span class="px-2 py-0.5 rounded-md bg-surface-container text-primary font-data-mono font-bold text-[10px]">
            ${checkedCount} / ${checklistItems.length} Verified
          </span>
        </div>

        <div class="space-y-1.5">
          ${checklistItems.map((item, idx) => {
            const isChecked = currentChecks[item.id] || false;
            return `
              <label class="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container/60 hover:bg-surface-container transition-colors cursor-pointer text-xs text-on-surface">
                <input 
                  type="checkbox" 
                  class="drawer-checklist-toggle w-4 h-4 rounded text-primary focus:ring-primary/20 accent-primary" 
                  data-chk-id="${item.id}"
                  ${isChecked ? 'checked' : ''}
                />
                <span class="${isChecked ? 'line-through text-on-surface-variant/70' : 'font-medium'}">${item.label}</span>
              </label>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // DRAWER TAB 2: MAINTENANCE & ENGINEERING DEFECTS
  // ──────────────────────────────────────────────────────────────────────────
  renderDrawerMaintenanceTab(r) {
    const activeTickets = r.activeTickets || [];

    return `
      <!-- Maintenance Status Banner -->
      <div class="p-4 rounded-2xl ${
        r.isOOO 
          ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-300' 
          : r.maintenanceStatus === 'Work Order Open'
          ? 'bg-orange-50 dark:bg-orange-950/40 border border-orange-300'
          : 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300'
      } flex items-center justify-between shadow-xs">
        <div>
          <span class="text-[10px] uppercase font-bold tracking-wider font-data-mono ${r.isOOO ? 'text-rose-700' : r.maintenanceStatus === 'Work Order Open' ? 'text-orange-700' : 'text-emerald-700'}">
            Engineering Telemetry
          </span>
          <h4 class="text-sm font-bold ${r.isOOO ? 'text-rose-900' : r.maintenanceStatus === 'Work Order Open' ? 'text-orange-900' : 'text-emerald-900'}">
            ${r.maintenanceStatus}
          </h4>
        </div>
        <span class="material-symbols-outlined text-2xl ${r.isOOO ? 'text-rose-600' : r.maintenanceStatus === 'Work Order Open' ? 'text-orange-600' : 'text-emerald-600'}">
          ${r.isOOO ? 'block' : r.maintenanceStatus === 'Work Order Open' ? 'engineering' : 'verified'}
        </span>
      </div>

      <!-- Active Work Orders List -->
      <div class="space-y-3">
        <h4 class="text-xs font-bold text-on-surface-variant uppercase font-data-mono">
          Active Engineering Tickets (${activeTickets.length})
        </h4>
        ${activeTickets.length === 0 ? `
          <div class="p-4 rounded-xl bg-surface-container border border-outline-variant/60 text-center text-on-surface-variant">
            <span class="material-symbols-outlined text-emerald-500 text-2xl mb-1">check_circle</span>
            <p class="font-bold text-xs text-on-surface">No Open Defects</p>
            <p class="text-[11px] text-on-surface-variant">All room fixtures, plumbing, and HVAC systems operational.</p>
          </div>
        ` : activeTickets.map(t => `
          <div class="p-3.5 rounded-xl bg-surface-container-lowest border border-orange-300 shadow-xs space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-orange-800 dark:text-orange-300 text-xs">${t.id}: ${t.assetName}</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono ${t.priority === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-orange-100 text-orange-800'}">
                ${t.priority} (${t.slaMinutesRemaining || 45}m SLA)
              </span>
            </div>
            <p class="text-xs text-on-surface leading-relaxed">${t.description}</p>
            <div class="pt-1.5 border-t border-outline-variant/40 flex items-center justify-between text-[11px] text-on-surface-variant font-mono">
              <span>Reported: ${t.reportedBy || 'Housekeeping'}</span>
              <span>Eng: ${t.assignedEngineer || 'On-Call'}</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Dispatch New Defect to Engineering Form -->
      <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs space-y-3">
        <h4 class="text-xs font-bold font-label-caps uppercase text-on-surface flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px] text-rose-600">build</span>
          Flag New Defect to Engineering
        </h4>

        <div>
          <label class="block text-[11px] font-semibold text-on-surface-variant mb-1">Defect Category:</label>
          <select id="select-inline-defect-category" class="w-full px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant text-xs text-on-surface font-medium focus:ring-1 focus:ring-primary focus:outline-hidden">
            <option value="HVAC & Climate">HVAC & Climate (AC, Heating, Air Vent)</option>
            <option value="Plumbing & Water">Plumbing & Water (Shower, Drain, Leak)</option>
            <option value="Electrical & Lighting">Electrical & Lighting (Bulb, Sockets)</option>
            <option value="Door Lock & RFID Access">Door Lock & Hardware (RFID Lock, Latch)</option>
            <option value="Furniture & Fixtures">Furniture, Fixtures & Equipment (FF&E)</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-on-surface-variant mb-1">Impact Level:</label>
          <select id="select-inline-defect-priority" class="w-full px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant text-xs text-on-surface font-medium focus:ring-1 focus:ring-primary focus:outline-hidden">
            <option value="High" selected>High (Urgent Attention · 90m SLA)</option>
            <option value="Critical">Critical (Mark Out of Order 🛑)</option>
            <option value="Normal">Normal (Routine Turnaround · 180m SLA)</option>
          </select>
        </div>

        <div>
          <label class="block text-[11px] font-semibold text-on-surface-variant mb-1">Defect Description:</label>
          <textarea 
            id="textarea-inline-defect-desc" 
            rows="2" 
            placeholder="e.g., Shower thermostatic mixer dripping constantly..."
            class="w-full px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant text-xs text-on-surface focus:ring-1 focus:ring-primary focus:outline-hidden resize-none"
          ></textarea>
        </div>

        <button 
          id="btn-inline-submit-defect"
          class="w-full py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-all shadow-xs cursor-pointer"
        >
          Dispatch Work Order to Engineering
        </button>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // DRAWER TAB 3: GUEST OCCUPANCY & SERVICE REQUESTS
  // ──────────────────────────────────────────────────────────────────────────
  renderDrawerGuestTab(r) {
    return `
      <!-- Guest Stay Summary -->
      <div class="bg-surface-container-lowest rounded-2xl p-4.5 border border-outline-variant shadow-xs space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-on-surface-variant uppercase font-data-mono">Occupancy Details</span>
          <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${r.occupancy === 'Occupied' ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'}">
            ${r.occupancy}
          </span>
        </div>

        ${r.occupancy === 'Occupied' ? `
          <div class="space-y-1.5 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-on-surface-variant">Guest Name:</span>
              <span class="font-bold text-primary">${r.guest || 'In-House Guest'}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-on-surface-variant">VIP Protocol:</span>
              <span class="font-bold text-amber-600">${r.vip ? '★ VIP Platinum' : 'Standard Guest'}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-on-surface-variant">Do Not Disturb (DND):</span>
              <span class="font-bold ${r.dnd ? 'text-rose-600' : 'text-emerald-600'}">${r.dnd ? 'Active (DND)' : 'No'}</span>
            </div>
          </div>
        ` : `
          <div class="p-3 text-center text-on-surface-variant italic">
            Room is currently vacant. No registered in-house guest.
          </div>
        `}
      </div>

      <!-- Quick Action: Rush Cleaning Request -->
      <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs space-y-2.5">
        <span class="text-xs font-bold text-on-surface-variant uppercase font-data-mono">Priority Turnover Dispatch</span>
        <p class="text-xs text-on-surface-variant">Flag this room for immediate priority turnover if an early arrival or VIP guest is waiting at Front Desk.</p>
        <button 
          id="btn-drawer-dispatch-rush"
          class="w-full py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer shadow-xs"
        >
          Flag Rush Turnover (Front Desk Priority)
        </button>
      </div>
    `;
  }

  getHkStatusBadgeClass(status) {
    switch (status) {
      case 'Inspected':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300/60';
      case 'Clean':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300 border border-teal-300/60';
      case 'In Progress':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-300/60';
      case 'Dirty':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-300/60';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MODAL: SHIFT HANDOVER LOGS
  // ──────────────────────────────────────────────────────────────────────────
  renderHandoverModal(notes, currentShift) {
    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
        <div class="bg-surface-bright rounded-2xl border border-outline-variant shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[85vh]">
          <!-- Modal Header -->
          <div class="px-5 py-4 border-b border-outline-variant flex items-center justify-between bg-surface-container">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-primary text-[24px]">history_edu</span>
              <div>
                <h3 class="text-base font-bold text-on-surface">Housekeeping Shift Handover Log</h3>
                <p class="text-xs text-on-surface-variant">Seamless handover notes between supervisors & leads across time slots</p>
              </div>
            </div>
            <button id="btn-close-handover-modal" class="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-5 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
            <!-- Add Handover Note Form -->
            <div class="p-4 rounded-xl bg-surface-container border border-outline-variant/80 space-y-3">
              <h4 class="text-xs font-bold font-label-caps uppercase text-on-surface flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px] text-primary">edit_note</span>
                Record Shift Handover Briefing
              </h4>
              <div>
                <label class="block text-[11px] font-semibold text-on-surface-variant mb-1">Author / Shift Lead:</label>
                <input 
                  type="text" 
                  id="input-handover-author" 
                  value="${currentShift ? currentShift.activeLead.split(' ')[0] + ' ' + (currentShift.activeLead.split(' ')[1] || '') : 'Victoria S.'}"
                  class="w-full px-3 py-1.5 rounded-lg bg-surface-bright border border-outline-variant text-xs text-on-surface focus:ring-1 focus:ring-primary focus:outline-hidden"
                />
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-on-surface-variant mb-1">Briefing Notes & Key Room Highlights:</label>
                <textarea 
                  id="input-handover-note" 
                  rows="3" 
                  placeholder="e.g., Floor 4 checkouts completed. Room 303 AC repaired by Tariq. Suite 501 VIP arrival at 16:30..."
                  class="w-full px-3 py-2 rounded-lg bg-surface-bright border border-outline-variant text-xs text-on-surface focus:ring-1 focus:ring-primary focus:outline-hidden resize-none"
                ></textarea>
              </div>
              <div class="flex justify-end">
                <button 
                  id="btn-save-handover-note"
                  class="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-all shadow-xs cursor-pointer"
                >
                  Save Handover Note
                </button>
              </div>
            </div>

            <!-- Notes Chronology -->
            <div>
              <h4 class="text-xs font-bold font-label-caps uppercase text-on-surface-variant mb-2.5">
                Previous Shift Handovers (${notes.length})
              </h4>
              <div class="space-y-2.5">
                ${notes.length === 0 ? `
                  <p class="text-xs text-on-surface-variant italic">No handover notes recorded yet today.</p>
                ` : notes.map(n => `
                  <div class="p-3.5 rounded-xl bg-surface-container border border-outline-variant/60 space-y-1">
                    <div class="flex items-center justify-between text-xs">
                      <span class="font-bold text-primary">${n.author}</span>
                      <span class="font-mono text-[10px] text-on-surface-variant">${n.date || 'Today'} • ${n.time}</span>
                    </div>
                    <p class="text-xs text-on-surface leading-relaxed">${n.note}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MODAL: REPORT MAINTENANCE DEFECT DIRECTLY FROM HOUSEKEEPING
  // ──────────────────────────────────────────────────────────────────────────
  renderDefectModal(rooms) {
    const defaultRoom = this.selectedRoomForDefect || (rooms[0] ? rooms[0].number : '303');
    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
        <div class="bg-surface-bright rounded-2xl border border-outline-variant shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
          <!-- Modal Header -->
          <div class="px-5 py-4 border-b border-outline-variant flex items-center justify-between bg-rose-50/50 dark:bg-rose-950/20">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-600 flex items-center justify-center">
                <span class="material-symbols-outlined text-[20px]">build</span>
              </div>
              <div>
                <h3 class="text-base font-bold text-on-surface">Report Maintenance Defect</h3>
                <p class="text-xs text-on-surface-variant">Instant dispatch to Engineering / Maintenance work order queue</p>
              </div>
            </div>
            <button id="btn-close-defect-modal" class="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Modal Form -->
          <div class="p-5 space-y-4 text-xs">
            <div>
              <label class="block font-semibold text-on-surface-variant mb-1">Target Room:</label>
              <select id="select-defect-room" class="w-full px-3 py-2 rounded-lg bg-surface-bright border border-outline-variant text-on-surface font-medium focus:ring-1 focus:ring-primary focus:outline-hidden">
                ${rooms.map(r => `
                  <option value="${r.number}" ${String(r.number) === String(defaultRoom) ? 'selected' : ''}>
                    Room ${r.number} (${r.category}) — Floor ${r.floor}
                  </option>
                `).join('')}
              </select>
            </div>

            <div>
              <label class="block font-semibold text-on-surface-variant mb-1">Defect Category:</label>
              <select id="select-defect-category" class="w-full px-3 py-2 rounded-lg bg-surface-bright border border-outline-variant text-on-surface font-medium focus:ring-1 focus:ring-primary focus:outline-hidden">
                <option value="HVAC & Climate">HVAC & Climate (AC, Heating, Ventilation)</option>
                <option value="Plumbing & Water">Plumbing & Water (Shower, Toilet, Leak, Drain)</option>
                <option value="Electrical & Lighting">Electrical & Lighting (Bulb, Sockets, Master Switch)</option>
                <option value="Door Lock & RFID Access">Door Lock & Hardware (RFID Reader, Latches)</option>
                <option value="Furniture & Fixtures">Furniture, Fixtures & Equipment (Bed, Table, Curtains)</option>
                <option value="In-Room Technology">In-Room Entertainment (Smart TV, IPTV, WiFi)</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-on-surface-variant mb-1">Priority / Impact on Readiness:</label>
              <select id="select-defect-priority" class="w-full px-3 py-2 rounded-lg bg-surface-bright border border-outline-variant text-on-surface font-medium focus:ring-1 focus:ring-primary focus:outline-hidden">
                <option value="Critical">Critical (Room Out of Order 🛑 — Check-in blocked)</option>
                <option value="High" selected>High (Urgent Attention ⚙️ — 90m SLA)</option>
                <option value="Normal">Normal (Routine Turnaround — 180m SLA)</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold text-on-surface-variant mb-1">Defect Details & Location:</label>
              <textarea 
                id="textarea-defect-desc" 
                rows="3" 
                placeholder="e.g., Shower thermostatic mixer dripping constantly. Chilled water valve noisy in ceiling..."
                class="w-full px-3 py-2 rounded-lg bg-surface-bright border border-outline-variant text-on-surface focus:ring-1 focus:ring-primary focus:outline-hidden resize-none"
              ></textarea>
            </div>

            <div class="flex justify-end gap-2.5 pt-2">
              <button 
                id="btn-cancel-defect-modal"
                class="px-4 py-2 rounded-lg bg-surface-container border border-outline-variant text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                id="btn-submit-defect-modal"
                class="px-5 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all shadow-sm cursor-pointer"
              >
                Dispatch to Engineering
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // EVENT BINDINGS
  // ──────────────────────────────────────────────────────────────────────────
  bindEvents() {
    if (!this.container) return;

    // Shift Switcher
    this.container.querySelectorAll('.btn-switch-shift').forEach(btn => {
      btn.onclick = () => {
        const shiftId = btn.dataset.shiftId;
        store.setCurrentShift(shiftId);
      };
    });

    // Quick Filter Metric Cards
    this.container.querySelectorAll('.btn-quick-filter-metric').forEach(card => {
      card.onclick = () => {
        const status = card.dataset.filterStatus;
        this.selectedStatus = status;
        this.renderContent();
      };
    });

    // Floor Selector Tabs
    this.container.querySelectorAll('.btn-floor-tab').forEach(btn => {
      btn.onclick = () => {
        this.selectedFloor = btn.dataset.floor;
        this.renderContent();
      };
    });

    // Category Selector
    const catSelect = this.container.querySelector('#house-filter-category');
    if (catSelect) {
      catSelect.onchange = (e) => {
        this.selectedCategory = e.target.value;
        this.renderContent();
      };
    }

    // Status Legend Pills
    this.container.querySelectorAll('.btn-house-legend-pill').forEach(pill => {
      pill.onclick = () => {
        this.selectedStatus = pill.dataset.status;
        this.renderContent();
      };
    });

    // Search Input
    const searchInput = this.container.querySelector('#house-search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        this.searchQuery = e.target.value;
        this.renderContent();
        const inputNow = this.container.querySelector('#house-search-input');
        if (inputNow) {
          inputNow.focus();
          inputNow.setSelectionRange(inputNow.value.length, inputNow.value.length);
        }
      };
    }

    // Reset Filters Buttons
    const resetBtn = this.container.querySelector('#btn-house-reset-filters') || this.container.querySelector('#btn-empty-house-reset');
    if (resetBtn) {
      resetBtn.onclick = () => {
        this.selectedFloor = 'ALL';
        this.selectedCategory = 'ALL';
        this.selectedStatus = 'ALL';
        this.searchQuery = '';
        this.renderContent();
      };
    }

    // In-Room Tablet Click on Room Card
    this.container.querySelectorAll('.btn-card-open-tablet').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const roomNum = btn.dataset.roomNumber;
        const modal = new InRoomTabletModal(roomNum, () => this.renderContent());
        document.body.appendChild(modal.render());
      };
    });

    // Room Card Click -> Selects Room & Opens Drawer
    this.container.querySelectorAll('.house-room-card').forEach(card => {
      card.onclick = () => {
        const roomNum = card.dataset.roomNumber;
        const rooms = this.getRoomsTelemetry();
        this.selectedRoom = rooms.find(r => r.number === roomNum) || null;
        this.activeDrawerTab = 'turnover';
        this.renderContent();
      };
    });

    // In-Drawer Tablet and Entry Protocol Triggers
    const drawerTabletBtn = this.container.querySelector('#btn-drawer-open-tablet');
    if (drawerTabletBtn && this.selectedRoom) {
      drawerTabletBtn.onclick = () => {
        const modal = new InRoomTabletModal(this.selectedRoom.number, () => this.renderContent());
        document.body.appendChild(modal.render());
      };
    }

    const drawerEntryProtocolBtn = this.container.querySelector('#btn-drawer-open-entry-protocol');
    if (drawerEntryProtocolBtn && this.selectedRoom) {
      drawerEntryProtocolBtn.onclick = () => {
        const modal = new RoomEntryProtocolModal(this.selectedRoom.number, () => this.renderContent());
        document.body.appendChild(modal.render());
      };
    }

    // Drawer Close Buttons
    const closeDrawerBtn = this.container.querySelector('#btn-close-house-drawer');
    const drawerBackdrop = this.container.querySelector('#house-drawer-backdrop');
    if (closeDrawerBtn) {
      closeDrawerBtn.onclick = () => {
        this.selectedRoom = null;
        this.renderContent();
      };
    }
    if (drawerBackdrop) {
      drawerBackdrop.onclick = () => {
        this.selectedRoom = null;
        this.renderContent();
      };
    }

    // Drawer Navigation Tabs
    this.container.querySelectorAll('.btn-drawer-nav-tab').forEach(tab => {
      tab.onclick = () => {
        this.activeDrawerTab = tab.dataset.drawerTab;
        this.renderContent();
      };
    });

    // Drawer Cleanliness Action Controls
    const markInProgressBtn = this.container.querySelector('#btn-drawer-mark-inprogress');
    const markCleanBtn = this.container.querySelector('#btn-drawer-mark-clean');
    const markInspectedBtn = this.container.querySelector('#btn-drawer-mark-inspected');
    const markDirtyBtn = this.container.querySelector('#btn-drawer-mark-dirty');

    if (this.selectedRoom) {
      const targetRoomId = this.selectedRoom.number;
      const targetRoom = (store.state.rooms || []).find(r => String(r.id) === String(targetRoomId) || String(r.roomNumber) === String(targetRoomId));

      if (markInProgressBtn && targetRoom) {
        markInProgressBtn.onclick = () => {
          targetRoom.status = 'In Progress';
          store.showToast(`Room ${targetRoomId} marked In Progress`, 'info');
          store.notify();
        };
      }
      if (markCleanBtn && targetRoom) {
        markCleanBtn.onclick = () => {
          targetRoom.status = 'Clean';
          store.showToast(`Room ${targetRoomId} marked Clean (Pending QA)`, 'info');
          store.notify();
        };
      }
      if (markInspectedBtn && targetRoom) {
        markInspectedBtn.onclick = () => {
          targetRoom.status = 'Inspected';
          store.showToast(`Room ${targetRoomId} QA Passed & Inspected`, 'success');
          store.notify();
        };
      }
      if (markDirtyBtn && targetRoom) {
        markDirtyBtn.onclick = () => {
          targetRoom.status = 'Dirty';
          store.showToast(`Room ${targetRoomId} flagged for rework (Dirty)`, 'warning');
          store.notify();
        };
      }

      // Drawer Reassign Attendant
      const saveStaffBtn = this.container.querySelector('#btn-drawer-save-staff');
      const staffSelect = this.container.querySelector('#select-drawer-reassign-staff');
      if (saveStaffBtn && staffSelect && targetRoom) {
        saveStaffBtn.onclick = () => {
          const newStaff = staffSelect.value;
          if (newStaff) {
            targetRoom.housekeeper = newStaff;
            store.showToast(`Room ${targetRoomId} assigned to ${newStaff}`, 'success');
            store.notify();
          }
        };
      }

      // Drawer Checklist Toggles
      this.container.querySelectorAll('.drawer-checklist-toggle').forEach(chk => {
        chk.onchange = (e) => {
          const chkId = chk.dataset.chkId;
          if (!this.roomChecklists[targetRoomId]) {
            this.roomChecklists[targetRoomId] = {};
          }
          this.roomChecklists[targetRoomId][chkId] = e.target.checked;
        };
      });

      // Inline Defect Submit from Drawer
      const inlineDefectBtn = this.container.querySelector('#btn-inline-submit-defect');
      if (inlineDefectBtn) {
        inlineDefectBtn.onclick = () => {
          const cat = this.container.querySelector('#select-inline-defect-category')?.value || 'General';
          const prio = this.container.querySelector('#select-inline-defect-priority')?.value || 'High';
          const desc = this.container.querySelector('#textarea-inline-defect-desc')?.value || `Defect flagged during housekeeping turnover in Room ${targetRoomId}`;

          store.reportRoomMaintenanceDefect({
            roomId: targetRoomId,
            issueType: cat,
            description: desc,
            priority: prio,
            reportedBy: 'Housekeeping Attendant'
          });

          this.renderContent();
        };
      }

      // Rush Cleaning Dispatch from Drawer
      const rushBtn = this.container.querySelector('#btn-drawer-dispatch-rush');
      if (rushBtn) {
        rushBtn.onclick = () => {
          if (typeof store.requestRushTurnover === 'function') {
            store.requestRushTurnover(targetRoomId, 'VIP Guest early arrival at Front Desk');
          } else {
            targetRoom.priority = 'Urgent';
            targetRoom.status = 'Dirty';
            store.showToast(`Rush turnover dispatched for Room ${targetRoomId}`, 'warning');
            store.notify();
          }
          this.renderContent();
        };
      }
    }

    // Shift Handover Modal Controls
    const openHandoverBtn = this.container.querySelector('#btn-open-handover-log');
    if (openHandoverBtn) {
      openHandoverBtn.onclick = () => {
        this.isHandoverModalOpen = true;
        this.renderContent();
      };
    }
    const closeHandoverBtn = this.container.querySelector('#btn-close-handover-modal');
    if (closeHandoverBtn) {
      closeHandoverBtn.onclick = () => {
        this.isHandoverModalOpen = false;
        this.renderContent();
      };
    }
    const saveHandoverBtn = this.container.querySelector('#btn-save-handover-note');
    if (saveHandoverBtn) {
      saveHandoverBtn.onclick = () => {
        const authorInput = this.container.querySelector('#input-handover-author');
        const noteInput = this.container.querySelector('#input-handover-note');
        if (!noteInput || !noteInput.value.trim()) {
          store.showToast('Please enter handover briefing text before saving', 'warning');
          return;
        }
        store.addShiftHandoverNote({
          shiftId: store.state.currentShiftId,
          author: authorInput ? authorInput.value.trim() : 'Supervisor',
          note: noteInput.value.trim()
        });
        this.isHandoverModalOpen = false;
        this.renderContent();
      };
    }

    // Report Maintenance Defect Modal Controls (Top Bar)
    const topMaintBtn = this.container.querySelector('#btn-report-maint-top');
    if (topMaintBtn) {
      topMaintBtn.onclick = () => {
        this.selectedRoomForDefect = null;
        this.isDefectModalOpen = true;
        this.renderContent();
      };
    }
    const closeDefectBtn = this.container.querySelector('#btn-close-defect-modal');
    const cancelDefectBtn = this.container.querySelector('#btn-cancel-defect-modal');
    if (closeDefectBtn) closeDefectBtn.onclick = () => { this.isDefectModalOpen = false; this.renderContent(); };
    if (cancelDefectBtn) cancelDefectBtn.onclick = () => { this.isDefectModalOpen = false; this.renderContent(); };

    const submitDefectBtn = this.container.querySelector('#btn-submit-defect-modal');
    if (submitDefectBtn) {
      submitDefectBtn.onclick = () => {
        const roomSelect = this.container.querySelector('#select-defect-room');
        const catSelect = this.container.querySelector('#select-defect-category');
        const prioSelect = this.container.querySelector('#select-defect-priority');
        const descArea = this.container.querySelector('#textarea-defect-desc');

        const roomId = roomSelect ? roomSelect.value : '303';
        const issueType = catSelect ? catSelect.value : 'General Maintenance';
        const priority = prioSelect ? prioSelect.value : 'High';
        const description = descArea && descArea.value.trim() ? descArea.value.trim() : `Defect flagged during housekeeping turnover in Room ${roomId}`;

        store.reportRoomMaintenanceDefect({
          roomId,
          issueType,
          description,
          priority,
          reportedBy: 'Housekeeping Attendant'
        });

        this.isDefectModalOpen = false;
        this.renderContent();
      };
    }
  }
}
