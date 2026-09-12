// ==========================================================================
// VOLVITECH HOSPITALITY OS — FRONT DESK QUEUE RESERVATIONS COMMAND CENTER
// OPERA PMS Feature Parity: Expedited Early Arrival Intake & Room Readiness
// Priority Queue Ranking, Housekeeping Rush Dispatch, Real-Time Wait Telemetry
// ==========================================================================

import { store } from '../../state/store.js';
import { Toast } from '../../components/Toast.js';
import { reservationsClient } from '../../api/reservationsClient.js';

export class QueueReservationsView {
  constructor() {
    this.container = null;
    this.activeModal = null;
    this.searchQuery = '';
    this.activeQuickFilter = 'ALL'; // 'ALL', 'READY', 'RUSHED', 'VIP', 'LONG_WAIT'

    // Persistent Queue State Sync with Central Store SSOT
    if (store.state.queueReservations && Array.isArray(store.state.queueReservations)) {
      this.queueItems = store.state.queueReservations.filter(
        item => !item.isCheckedIn && !store.isGuestOrRoomCheckedIn(item.id, item.resNumber, item.roomNumber)
      );
    } else {
      this.queueItems = this.generateInitialQueue();
      store.state.queueReservations = this.queueItems;
    }

    // Available clean rooms pool for instant room reassignment
    this.availableCleanRooms = this.generateCleanRoomsPool();

    // Audit trail for queue operations
    this.queueAuditTrail = [
      { id: 'q-aud-1', time: '11:15 AM', action: 'Harrison Forbes placed in Queue #1 (Rushed to Room 401)', user: 'Front Desk — Agent T01' },
      { id: 'q-aud-2', time: '11:28 AM', action: 'Room 305 turned CLEANED & INSPECTED by Maria Santos', user: 'Housekeeping QA' },
      { id: 'q-aud-3', time: '11:32 AM', action: 'SMS sent to Tanya Bhasin: Room 204 is Ready', user: 'Front Desk Dispatch' },
    ];
  }

  saveQueueState() {
    store.state.queueReservations = this.queueItems;
    store.saveState();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 1. DATA INITIALIZATION
  // ──────────────────────────────────────────────────────────────────────────
  generateInitialQueue() {
    const rawQueue = [
      {
        id: 'q-101',
        resNumber: 'RES-10490',
        guestName: 'Harrison Forbes',
        vip: true,
        vipTier: 'VIP 1 (Presidential Club)',
        roomNumber: '401',
        roomType: 'Executive Suite',
        roomClass: 'SUITES',
        queuePriority: 1,
        timeEntered: '11:15 AM',
        waitMinutes: 28, // Long wait (>25m)
        guestLocation: 'Lobby Lounge (Near Piano)',
        guestPhone: '+1 415 882 9912',
        hkStatus: 'CLEANING', // CLEANING, DIRTY, INSPECTED
        hkAttendant: 'Maria Santos',
        estReadyTime: '10 min',
        isRushed: true,
        specialRequests: 'High floor, ocean view, welcome fruit platter',
        company: 'Forbes Venture Capital',
        adults: 2,
      },
      {
        id: 'q-102',
        resNumber: 'RES-10484',
        guestName: 'Tanya Bhasin',
        vip: false,
        vipTier: null,
        roomNumber: '204',
        roomType: 'Deluxe King',
        roomClass: 'DELUXE',
        queuePriority: 2,
        timeEntered: '11:25 AM',
        waitMinutes: 18,
        guestLocation: 'Coffee Shop (Veranda Cafe)',
        guestPhone: '+91 98201 44512',
        hkStatus: 'INSPECTED', // READY!
        hkAttendant: 'Carlos Ruiz',
        estReadyTime: 'Ready Now',
        isRushed: false,
        specialRequests: 'Corner quiet room, extra bath towels',
        company: 'Vanguard Health Group',
        adults: 1,
      },
      {
        id: 'q-103',
        resNumber: 'RES-10488',
        guestName: 'Siddharth Rao',
        vip: false,
        vipTier: null,
        roomNumber: '305',
        roomType: 'Classic King Room',
        roomClass: 'CLASSIC',
        queuePriority: 3,
        timeEntered: '11:35 AM',
        waitMinutes: 10,
        guestLocation: 'Business Center (Desk 4)',
        guestPhone: '+91 91234 56789',
        hkStatus: 'INSPECTED', // READY!
        hkAttendant: 'Elena Gomez',
        estReadyTime: 'Ready Now',
        isRushed: false,
        specialRequests: 'High-speed ethernet LAN cable requested',
        company: 'Infosys Tech Labs',
        adults: 1,
      },
      {
        id: 'q-104',
        resNumber: 'RES-10492',
        guestName: 'Elena Rostova',
        vip: true,
        vipTier: 'Gold VIP',
        roomNumber: '508',
        roomType: 'Deluxe King',
        roomClass: 'DELUXE',
        queuePriority: 4,
        timeEntered: '11:38 AM',
        waitMinutes: 7,
        guestLocation: 'Lobby Seating (Main Atrium)',
        guestPhone: '+44 7700 900123',
        hkStatus: 'DIRTY', // Rushed
        hkAttendant: 'Fatima Zahra',
        estReadyTime: '20 min',
        isRushed: true,
        specialRequests: 'Away from elevator, hypoallergenic foam pillows',
        company: 'Barclays International',
        adults: 2,
      },
      {
        id: 'q-105',
        resNumber: 'RES-10495',
        guestName: 'Marco Bellini',
        vip: false,
        vipTier: null,
        roomNumber: '203',
        roomType: 'Deluxe Ocean Suite',
        roomClass: 'SUITES',
        queuePriority: 5,
        timeEntered: '11:42 AM',
        waitMinutes: 3,
        guestLocation: 'Poolside Terrace Bar',
        guestPhone: '+39 02 8812 4410',
        hkStatus: 'DIRTY', // Rushed
        hkAttendant: 'David Kim',
        estReadyTime: '25 min',
        isRushed: true,
        specialRequests: 'Balcony deck chair, late checkout requested',
        company: 'Pirelli Tyre SpA',
        adults: 2,
      },
    ];
    return rawQueue.filter(
      item => !item.isCheckedIn && !store.isGuestOrRoomCheckedIn(item.id, item.resNumber, item.roomNumber)
    );
  }

  generateCleanRoomsPool() {
    return [
      { roomNumber: '205', floor: 2, type: 'Classic King Room', view: 'Courtyard View', bed: '1 King Bed', hkStatus: 'INSPECTED' },
      { roomNumber: '302', floor: 3, type: 'Deluxe King', view: 'City View', bed: '1 King Bed', hkStatus: 'INSPECTED' },
      { roomNumber: '402', floor: 4, type: 'Deluxe King', view: 'City View', bed: '1 King Bed', hkStatus: 'INSPECTED' },
      { roomNumber: '507', floor: 5, type: 'Deluxe King', view: 'Skyline City View', bed: '1 King Bed', hkStatus: 'INSPECTED' },
      { roomNumber: '408', floor: 4, type: 'Executive Suite', view: 'Panoramic Ocean View', bed: '1 King Bed + Lounge', hkStatus: 'INSPECTED' },
    ];
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 2. OPERATIONAL TELEMETRY CALCULATIONS
  // ──────────────────────────────────────────────────────────────────────────
  getOperationalTelemetry() {
    const activeItems = this.queueItems.filter(
      q => !q.isCheckedIn && !store.isGuestOrRoomCheckedIn(q.id, q.resNumber, q.roomNumber)
    );
    const totalInQueue = activeItems.length;
    const readyCount = activeItems.filter(q => q.hkStatus === 'INSPECTED').length;
    const rushedCount = activeItems.filter(q => q.isRushed).length;
    const vipCount = activeItems.filter(q => q.vip).length;
    const avgWait = totalInQueue > 0
      ? Math.round(activeItems.reduce((sum, q) => sum + q.waitMinutes, 0) / totalInQueue)
      : 0;

    return {
      totalInQueue,
      readyCount,
      rushedCount,
      vipCount,
      avgWait,
    };
  }

  getFilteredQueue() {
    return this.queueItems.filter(item => {
      // 0. Eliminate already checked-in guests
      if (item.isCheckedIn) return false;
      if (store.isGuestOrRoomCheckedIn(item.id, item.resNumber, item.roomNumber)) {
        item.isCheckedIn = true;
        return false;
      }

      // 1. Search Query
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.toLowerCase();
        const matchesName = item.guestName.toLowerCase().includes(q);
        const matchesRoom = item.roomNumber.toLowerCase().includes(q);
        const matchesRes = item.resNumber.toLowerCase().includes(q);
        const matchesLoc = item.guestLocation.toLowerCase().includes(q);
        if (!matchesName && !matchesRoom && !matchesRes && !matchesLoc) return false;
      }

      // 2. Quick Filter Tabs
      if (this.activeQuickFilter === 'READY') return item.hkStatus === 'INSPECTED';
      if (this.activeQuickFilter === 'RUSHED') return item.isRushed;
      if (this.activeQuickFilter === 'VIP') return item.vip;
      if (this.activeQuickFilter === 'LONG_WAIT') return item.waitMinutes >= 25;

      return true;
    }).sort((a, b) => a.queuePriority - b.queuePriority);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 3. MAIN RENDER METHOD
  // ──────────────────────────────────────────────────────────────────────────
  render() {
    const el = document.createElement('div');
    el.className = 'w-full flex flex-col gap-4 animate-fadeIn pb-16';
    this.container = el;

    this.renderContent();
    return el;
  }

  renderContent() {
    if (!this.container) return;

    const tel = this.getOperationalTelemetry();
    const queueList = this.getFilteredQueue();

    this.container.innerHTML = `
      <!-- ================================================================= -->
      <!-- 1. PAGE HEADER (OPERA Frontline Command Hierarchy) -->
      <!-- ================================================================= -->
      <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-outline-variant/60">
        <div>
          <div class="flex items-center gap-2">
            <span class="font-label-caps text-[11px] font-bold uppercase tracking-wider text-secondary">Front Desk Operations</span>
            <span class="text-outline-variant">•</span>
            <span class="font-data-mono text-[11px] text-on-surface-variant">OPERA Parity Expedited Intake</span>
          </div>
          <h1 class="font-headline-lg text-2xl sm:text-3xl font-bold text-primary tracking-tight mt-0.5">QUEUE RESERVATIONS</h1>
          <p class="font-body-md text-xs text-on-surface-variant mt-0.5">Expedited arrival queue, housekeeping rush tracking, and room readiness dispatch</p>
        </div>

        <div class="flex items-center gap-2.5">
          <!-- + Place in Queue Button -->
          <button 
            id="btn-place-in-queue"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer shadow-2xs"
            title="Place an arriving guest into the expedited queue"
          >
            <span class="material-symbols-outlined text-[16px]">hourglass_top</span>
            <span>+ Place in Queue</span>
          </button>

          <!-- Priority Rush All Button -->
          <button 
            id="btn-rush-all"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-500/20 transition-all cursor-pointer shadow-2xs"
            title="Dispatch emergency expedite signal to Housekeeping for all queue rooms"
          >
            <span class="material-symbols-outlined text-[16px]">bolt</span>
            <span>Priority Rush All</span>
          </button>

          <!-- Refresh Telemetry Button -->
          <button 
            id="btn-refresh-queue"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-outline-variant text-on-surface-variant hover:text-primary text-xs font-semibold hover:bg-surface-container transition-all cursor-pointer shadow-2xs"
            title="Sync live room readiness & wait timers"
          >
            <span class="material-symbols-outlined text-[16px]">refresh</span>
            <span>Refresh</span>
          </button>
        </div>
      </header>

      <!-- ================================================================= -->
      <!-- 2. SUMMARY STRIP (Compact OPERA Operational Indicators) -->
      <!-- ================================================================= -->
      <section class="flex flex-wrap items-center gap-2 sm:gap-6 py-2 px-3 rounded-xl bg-surface-container-low/60 border border-outline-variant/60 text-xs">
        <div class="flex items-center gap-2">
          <span class="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase">IN QUEUE:</span>
          <span class="font-data-mono font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">${tel.totalInQueue}</span>
        </div>
        <span class="text-outline-variant">|</span>

        <div class="flex items-center gap-2">
          <span class="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase">AVG WAIT TIME:</span>
          <span class="font-data-mono font-black ${tel.avgWait >= 20 ? 'text-amber-600 dark:text-amber-400' : 'text-primary'} bg-surface-container px-2 py-0.5 rounded-md">${tel.avgWait}m</span>
        </div>
        <span class="text-outline-variant">|</span>

        <div class="flex items-center gap-2">
          <span class="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase">ROOMS READY TO CHECK-IN:</span>
          <span class="font-data-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">${tel.readyCount}</span>
        </div>
        <span class="text-outline-variant">|</span>

        <div class="flex items-center gap-2">
          <span class="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase">HOUSEKEEPING RUSHED:</span>
          <span class="font-data-mono font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">${tel.rushedCount}</span>
        </div>
        <span class="text-outline-variant">|</span>

        <div class="flex items-center gap-2">
          <span class="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase">VIP IN QUEUE:</span>
          <span class="font-data-mono font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">${tel.vipCount}</span>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- 3. ACTIONABLE STATUS ALERTS (Live Attention Banners) -->
      <!-- ================================================================= -->
      <section class="flex flex-col gap-2">
        ${tel.readyCount > 0 ? `
          <div class="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs animate-pulse">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-emerald-600">verified</span>
              <span class="font-bold">✓ ${tel.readyCount} rooms just turned INSPECTED — ready for immediate check-in!</span>
            </div>
            <button id="alert-btn-show-ready" class="font-bold text-emerald-700 dark:text-emerald-300 hover:underline cursor-pointer">
              Show Ready Guests →
            </button>
          </div>
        ` : ''}

        <div class="flex flex-wrap items-center gap-2 text-xs">
          <div class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-semibold">
            <span class="material-symbols-outlined text-[15px]">timer</span>
            <span>⚠ 1 VIP guest (Harrison Forbes) waiting > 25 mins in Lobby Lounge</span>
          </div>

          <div class="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/5 border border-primary/20 text-primary font-semibold">
            <span class="material-symbols-outlined text-[15px]">cleaning_services</span>
            <span>⚡ 3 rooms currently flagged as RUSH on Housekeeping board</span>
          </div>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- 4. SEARCH & QUICK FILTER TABS -->
      <!-- ================================================================= -->
      <section class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 rounded-xl bg-surface-container-low/40 border border-outline-variant/60 text-xs">
        
        <!-- Search Input -->
        <div class="relative flex-1 max-w-md">
          <span class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">search</span>
          <input 
            type="text"
            id="queue-search-input"
            value="${this.searchQuery}"
            placeholder="Search guest name, room #, confirmation, or location..."
            class="w-full pl-9 pr-3 py-1.5 rounded-xl border border-outline-variant bg-surface-bright text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary shadow-2xs"
          />
        </div>

        <!-- Quick Filter Pills -->
        <div class="flex flex-wrap items-center gap-1.5">
          <button 
            class="q-filter-btn px-3 py-1.5 rounded-xl border font-semibold cursor-pointer transition-all ${this.activeQuickFilter === 'ALL' ? 'bg-primary text-on-primary border-primary font-bold' : 'border-outline-variant text-on-surface-variant hover:text-primary hover:bg-surface-container'}"
            data-filter="ALL"
          >
            All in Queue (${this.queueItems.length})
          </button>

          <button 
            class="q-filter-btn px-3 py-1.5 rounded-xl border font-semibold cursor-pointer transition-all ${this.activeQuickFilter === 'READY' ? 'bg-emerald-600 text-white border-emerald-600 font-bold' : 'border-outline-variant text-on-surface-variant hover:text-primary hover:bg-surface-container'}"
            data-filter="READY"
          >
            Ready for Check-In (${tel.readyCount})
          </button>

          <button 
            class="q-filter-btn px-3 py-1.5 rounded-xl border font-semibold cursor-pointer transition-all ${this.activeQuickFilter === 'RUSHED' ? 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border-amber-500/40 font-bold' : 'border-outline-variant text-on-surface-variant hover:text-primary hover:bg-surface-container'}"
            data-filter="RUSHED"
          >
            Rushed to HK (${tel.rushedCount})
          </button>

          <button 
            class="q-filter-btn px-3 py-1.5 rounded-xl border font-semibold cursor-pointer transition-all ${this.activeQuickFilter === 'VIP' ? 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border-amber-500/40 font-bold' : 'border-outline-variant text-on-surface-variant hover:text-primary hover:bg-surface-container'}"
            data-filter="VIP"
          >
            VIP Only (${tel.vipCount})
          </button>

          <button 
            class="q-filter-btn px-3 py-1.5 rounded-xl border font-semibold cursor-pointer transition-all ${this.activeQuickFilter === 'LONG_WAIT' ? 'bg-rose-500/20 text-rose-900 dark:text-rose-200 border-rose-500/40 font-bold' : 'border-outline-variant text-on-surface-variant hover:text-primary hover:bg-surface-container'}"
            data-filter="LONG_WAIT"
          >
            Long Wait &gt; 25m
          </button>
        </div>

      </section>

      <!-- ================================================================= -->
      <!-- 5. QUEUE DATA TABLE (Real-Time OPERA Intake Grid) -->
      <!-- ================================================================= -->
      <section class="rounded-2xl border border-outline-variant/80 bg-surface-container-lowest shadow-sm overflow-hidden">
        
        <div class="px-4 py-3 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/30">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px] text-primary">hourglass_bottom</span>
            <h2 class="font-headline-sm text-sm font-bold text-primary uppercase tracking-wider">ACTIVE ARRIVAL QUEUE</h2>
            <span class="text-on-surface-variant text-xs font-data-mono">(${queueList.length} guests waiting)</span>
          </div>

          <span class="text-xs text-on-surface-variant">Housekeeping board syncs priority rush signals in real-time</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead class="bg-surface-container-low text-on-surface-variant text-[11px] font-bold border-b border-outline-variant/60">
              <tr>
                <th class="py-2.5 px-3 text-center w-16">Priority</th>
                <th class="py-2.5 px-3">Guest & VIP</th>
                <th class="py-2.5 px-3">Assigned Room</th>
                <th class="py-2.5 px-3 text-center">Room HK Status</th>
                <th class="py-2.5 px-3">Queue In</th>
                <th class="py-2.5 px-3">Wait Duration</th>
                <th class="py-2.5 px-3">Guest Location & Phone</th>
                <th class="py-2.5 px-3">HK Attendant</th>
                <th class="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/40">
              ${queueList.length === 0 ? `
                <tr>
                  <td colspan="9" class="py-12 text-center text-on-surface-variant">
                    <span class="material-symbols-outlined text-4xl text-outline mb-2">check_circle</span>
                    <h4 class="font-bold text-sm text-primary">NO GUESTS CURRENTLY IN QUEUE</h4>
                    <p class="text-xs text-on-surface-variant mt-1">All arrived guests have been checked in or their rooms are inspected.</p>
                  </td>
                </tr>
              ` : queueList.map(item => {
                const isReady = item.hkStatus === 'INSPECTED';
                const isLongWait = item.waitMinutes >= 25;

                return `
                  <tr class="hover:bg-primary/5 transition-colors ${isReady ? 'bg-emerald-500/5' : ''}">
                    
                    <!-- Priority Order (Up/Down reordering) -->
                    <td class="py-3 px-3 text-center whitespace-nowrap">
                      <div class="inline-flex items-center gap-1">
                        <span class="w-6 h-6 rounded-full bg-surface-container text-primary font-bold font-data-mono text-xs flex items-center justify-center">
                          #${item.queuePriority}
                        </span>
                        <div class="flex flex-col">
                          <button class="btn-priority-up text-on-surface-variant hover:text-primary cursor-pointer leading-none" data-id="${item.id}" title="Increase priority">▲</button>
                          <button class="btn-priority-down text-on-surface-variant hover:text-primary cursor-pointer leading-none" data-id="${item.id}" title="Decrease priority">▼</button>
                        </div>
                      </div>
                    </td>

                    <!-- Guest & VIP Tier -->
                    <td class="py-3 px-3">
                      <div class="flex items-center gap-1.5">
                        <span class="font-bold text-primary text-sm">${item.guestName}</span>
                        ${item.vip ? `
                          <span class="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold text-[10px] uppercase">
                            ★ ${item.vipTier || 'VIP'}
                          </span>
                        ` : ''}
                      </div>
                      <span class="text-[10px] text-on-surface-variant font-data-mono">${item.resNumber} · ${item.company || 'Direct'}</span>
                    </td>

                    <!-- Assigned Room & Type -->
                    <td class="py-3 px-3 whitespace-nowrap">
                      <div class="flex items-center gap-1.5">
                        <span class="font-data-mono font-bold text-primary text-sm">Room ${item.roomNumber}</span>
                        <span class="text-[10px] text-on-surface-variant">(${item.roomType})</span>
                      </div>
                      ${item.specialRequests ? `<span class="text-[10px] text-on-surface-variant italic truncate block max-w-[180px]">"${item.specialRequests}"</span>` : ''}
                    </td>

                    <!-- Room HK Status -->
                    <td class="py-3 px-3 text-center whitespace-nowrap">
                      ${this.renderHousekeepingStatusBadge(item.hkStatus, item.estReadyTime, item.isRushed)}
                    </td>

                    <!-- Time Entered Queue -->
                    <td class="py-3 px-3 font-data-mono text-on-surface-variant whitespace-nowrap">
                      ${item.timeEntered}
                    </td>

                    <!-- Wait Duration -->
                    <td class="py-3 px-3 whitespace-nowrap">
                      <span class="px-2 py-0.5 rounded-md font-data-mono font-bold text-xs ${isLongWait ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400' : 'bg-surface-container text-primary'}">
                        ${item.waitMinutes} mins
                      </span>
                      ${isLongWait ? `<span class="text-[10px] text-rose-600 block font-bold">⚠ Long Wait</span>` : ''}
                    </td>

                    <!-- Guest Location & Phone -->
                    <td class="py-3 px-3">
                      <span class="text-on-surface font-semibold block">${item.guestLocation}</span>
                      <span class="text-[10px] text-on-surface-variant font-data-mono">${item.guestPhone}</span>
                    </td>

                    <!-- HK Attendant -->
                    <td class="py-3 px-3 whitespace-nowrap text-on-surface-variant">
                      <div class="flex items-center gap-1">
                        <span class="material-symbols-outlined text-[14px] text-secondary">person</span>
                        <span>${item.hkAttendant}</span>
                      </div>
                    </td>

                    <!-- Actions -->
                    <td class="py-3 px-3 text-right whitespace-nowrap">
                      <div class="flex items-center justify-end gap-1.5">
                        
                        ${item.isCheckedIn ? `
                          <!-- Checked In State Pill (Replaces Check In button) -->
                          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-xs border border-emerald-500/20">
                            <span class="material-symbols-outlined text-[15px]">check_circle</span>
                            <span>Checked In</span>
                          </span>
                        ` : `
                          <!-- Check In Button (Active if Inspected/Ready) -->
                          ${isReady ? `
                            <button 
                              class="btn-queue-checkin px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1"
                              data-id="${item.id}"
                              title="Room is inspected and ready. Issue keys now."
                            >
                              <span class="material-symbols-outlined text-[15px]">key</span>
                              <span>Check In</span>
                            </button>
                          ` : `
                            <button 
                              class="btn-queue-rush px-2.5 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-500/20 cursor-pointer flex items-center gap-1"
                              data-id="${item.id}"
                              title="Signal Housekeeping to expedite cleaning"
                            >
                              <span class="material-symbols-outlined text-[14px]">bolt</span>
                              <span>Rush HK</span>
                            </button>
                          `}

                          <!-- Reassign Room -->
                          <button 
                            class="btn-queue-reassign px-2.5 py-1.5 rounded-xl border border-outline-variant text-on-surface-variant hover:text-primary hover:bg-surface-container text-xs font-semibold cursor-pointer"
                            data-id="${item.id}"
                            title="Switch to another clean room immediately"
                          >
                            Reassign
                          </button>

                          <!-- Send SMS Notification -->
                          <button 
                            class="btn-queue-sms px-2 py-1.5 rounded-xl border border-outline-variant text-on-surface-variant hover:text-primary hover:bg-surface-container cursor-pointer"
                            data-id="${item.id}"
                            title="Send text message / notification to guest"
                          >
                            <span class="material-symbols-outlined text-[15px]">sms</span>
                          </button>

                          <!-- Remove from Queue -->
                          <button 
                            class="btn-queue-remove px-2 py-1.5 rounded-xl border border-outline-variant text-on-surface-variant hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                            data-id="${item.id}"
                            title="Remove from queue"
                          >
                            <span class="material-symbols-outlined text-[15px]">close</span>
                          </button>
                        `}

                      </div>
                    </td>

                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

      </section>
    `;

    this.bindEvents();
  }

  // Helper: Housekeeping Badge
  renderHousekeepingStatusBadge(status, estTime, isRushed) {
    if (status === 'INSPECTED') {
      return `
        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Inspected (Ready)</span>
        </span>
      `;
    } else if (status === 'CLEANING') {
      return `
        <div class="inline-flex flex-col items-center">
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-400 font-bold text-[11px]">
            <span class="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            <span>Cleaning (${estTime || '15m'})</span>
          </span>
          ${isRushed ? `<span class="text-[9px] text-amber-600 dark:text-amber-400 font-bold uppercase mt-0.5">⚡ Rushed</span>` : ''}
        </div>
      `;
    } else {
      return `
        <div class="inline-flex flex-col items-center">
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold text-[11px]">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>Dirty (${estTime || '20m'})</span>
          </span>
          ${isRushed ? `<span class="text-[9px] text-amber-600 dark:text-amber-400 font-bold uppercase mt-0.5">⚡ Rushed to Attendant</span>` : ''}
        </div>
      `;
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 4. EVENT BINDING & INTERACTION
  // ──────────────────────────────────────────────────────────────────────────
  bindEvents() {
    // 1. Place in Queue Button
    const btnPlace = this.container.querySelector('#btn-place-in-queue');
    if (btnPlace) btnPlace.onclick = () => this.openPlaceInQueueModal();

    // 2. Rush All Button
    const btnRushAll = this.container.querySelector('#btn-rush-all');
    if (btnRushAll) {
      btnRushAll.onclick = () => {
        this.queueItems.forEach(q => {
          if (q.hkStatus !== 'INSPECTED') q.isRushed = true;
        });
        this.renderContent();
        Toast.show('⚡ Emergency priority rush signal dispatched to all Housekeeping attendants!', 'success');
      };
    }

    // 3. Refresh Telemetry Button
    const btnRefresh = this.container.querySelector('#btn-refresh-queue');
    if (btnRefresh) {
      btnRefresh.onclick = () => {
        Toast.show('Syncing room readiness telemetry with Housekeeping...', 'info');
        setTimeout(() => {
          this.renderContent();
          Toast.show('Queue telemetry synced.', 'success');
        }, 200);
      };
    }

    // 4. Alert "Show Ready"
    const btnShowReady = this.container.querySelector('#alert-btn-show-ready');
    if (btnShowReady) {
      btnShowReady.onclick = () => {
        this.activeQuickFilter = 'READY';
        this.renderContent();
      };
    }

    // 5. Search Input
    const searchInput = this.container.querySelector('#queue-search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        this.searchQuery = e.target.value;
      };
      searchInput.onkeydown = (e) => {
        if (e.key === 'Enter') this.renderContent();
      };
    }

    // 6. Quick Filter Buttons
    const filterBtns = this.container.querySelectorAll('.q-filter-btn');
    filterBtns.forEach(btn => {
      btn.onclick = () => {
        this.activeQuickFilter = btn.dataset.filter;
        this.renderContent();
      };
    });

    // 7. Priority Reorder Buttons (Up/Down)
    const upBtns = this.container.querySelectorAll('.btn-priority-up');
    upBtns.forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        this.reorderPriority(id, -1);
      };
    });

    const downBtns = this.container.querySelectorAll('.btn-priority-down');
    downBtns.forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        this.reorderPriority(id, 1);
      };
    });

    // 8. Row Action: Check In
    const checkinBtns = this.container.querySelectorAll('.btn-queue-checkin');
    checkinBtns.forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        const item = this.queueItems.find(q => q.id === id);
        if (item) this.openDirectCheckInModal(item);
      };
    });

    // 9. Row Action: Rush HK
    const rushBtns = this.container.querySelectorAll('.btn-queue-rush');
    rushBtns.forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        const item = this.queueItems.find(q => q.id === id);
        if (item) {
          item.isRushed = true;
          this.renderContent();
          Toast.show(`⚡ Room ${item.roomNumber} rushed! Attendant (${item.hkAttendant}) notified.`, 'success');
        }
      };
    });

    // 10. Row Action: Reassign Room
    const reassignBtns = this.container.querySelectorAll('.btn-queue-reassign');
    reassignBtns.forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        const item = this.queueItems.find(q => q.id === id);
        if (item) this.openReassignRoomModal(item);
      };
    });

    // 11. Row Action: Send SMS
    const smsBtns = this.container.querySelectorAll('.btn-queue-sms');
    smsBtns.forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        const item = this.queueItems.find(q => q.id === id);
        if (item) this.openSendSMSModal(item);
      };
    });

    // 12. Row Action: Remove from Queue
    const removeBtns = this.container.querySelectorAll('.btn-queue-remove');
    removeBtns.forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        this.removeFromQueue(id);
      };
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 5. QUEUE BUSINESS LOGIC
  // ──────────────────────────────────────────────────────────────────────────
  reorderPriority(id, direction) {
    const idx = this.queueItems.findIndex(q => q.id === id);
    if (idx < 0) return;

    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= this.queueItems.length) return;

    // Swap priority numbers
    const tempP = this.queueItems[idx].queuePriority;
    this.queueItems[idx].queuePriority = this.queueItems[targetIdx].queuePriority;
    this.queueItems[targetIdx].queuePriority = tempP;

    // Re-sort array
    this.queueItems.sort((a, b) => a.queuePriority - b.queuePriority);
    this.saveQueueState();
    this.renderContent();
    Toast.show(`Priority updated for ${this.queueItems[targetIdx].guestName}`, 'info');
  }

  removeFromQueue(id) {
    const item = this.queueItems.find(q => q.id === id);
    if (!item) return;

    this.queueItems = this.queueItems.filter(q => q.id !== id);
    // Recalculate priorities
    this.queueItems.forEach((q, i) => q.queuePriority = i + 1);
    this.saveQueueState();

    this.renderContent();
    Toast.show(`Removed ${item.guestName} from queue.`, 'info');
  }

  async executeCheckInFromQueue(queueItem) {
    if (!queueItem) return;

    // 1. Mark checked in immediately and update queue list
    queueItem.isCheckedIn = true;
    this.queueItems = this.queueItems.filter(q => q.id !== queueItem.id);
    this.queueItems.forEach((q, i) => q.queuePriority = i + 1);
    this.saveQueueState();

    // 2. Log to audit trail
    this.queueAuditTrail.unshift({
      id: `q-aud-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: `${queueItem.guestName} checked into Room ${queueItem.roomNumber} (Keys issued, moved to In-House)`,
      user: 'Front Desk — Agent'
    });

    this.closeModal();

    // 3. Sync to Central Store SSOT (creates In-House stay & marks room Occupied Clean)
    store.checkInGuestLifecycle({
      id: queueItem.id,
      resNumber: queueItem.resNumber,
      guestName: queueItem.guestName,
      roomNumber: queueItem.roomNumber,
      roomType: queueItem.roomType,
      checkInDate: 'Today',
      checkOutDate: 'Sep 12',
      totalNights: 2,
      adults: queueItem.adults || 1,
      phone: queueItem.guestPhone,
      vip: queueItem.vip,
      vipTier: queueItem.vipTier,
      company: queueItem.company,
      specialRequests: queueItem.specialRequests,
      totalAmount: 1450,
      paidAmount: 1450,
      balanceDue: 0
    });

    // 4. Backend API Sync
    try {
      if (queueItem.isApiRecord || (queueItem.id && queueItem.id.length > 20)) {
        await reservationsClient.checkIn(queueItem.id, queueItem.roomNumber);
      }
    } catch (err) {
      console.warn('[QueueReservationsView] Backend check-in note:', err.message);
    }

    Toast.show({
      title: 'Check-In Complete',
      message: `✓ ${queueItem.guestName} checked into Room ${queueItem.roomNumber}. RFID keys encoded.`,
      type: 'success'
    });

    this.renderContent();
  }

  closeModal() {
    if (this.activeModal) {
      this.activeModal.remove();
      this.activeModal = null;
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 6. OPERATIONAL MODALS
  // ──────────────────────────────────────────────────────────────────────────

  // Modal 1: Place in Queue Modal
  openPlaceInQueueModal() {
    this.closeModal();

    const arrivingCandidates = [
      { resNumber: 'RES-10499', guest: 'Pooja Verma', room: '304', type: 'Deluxe King', phone: '+91 99201 55678', vip: false },
      { resNumber: 'RES-10501', guest: 'Dr. Arthur Pendelton', room: '502', type: 'Executive Suite', phone: '+1 617 990 1212', vip: true },
      { resNumber: 'RES-10504', guest: 'Kenji Sato', room: '201', type: 'Classic King Room', phone: '+81 90 1234 5678', vip: false },
    ];

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn';
    modal.innerHTML = `
      <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/80 shadow-2xl w-full max-w-lg overflow-hidden animate-scaleUp">
        
        <div class="px-6 py-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/40">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px] text-primary">hourglass_top</span>
            <h3 class="font-headline-sm text-base font-bold text-primary uppercase">PLACE GUEST IN ARRIVAL QUEUE</h3>
          </div>
          <button id="pq-close-btn" class="text-on-surface-variant hover:text-primary cursor-pointer">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form id="form-place-queue" class="p-6 flex flex-col gap-4 text-xs">
          
          <div>
            <label class="font-bold text-on-surface-variant block mb-1">Select Arriving Reservation *</label>
            <select id="pq-res-select" class="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-bright text-xs font-semibold">
              ${arrivingCandidates.map(c => `
                <option value="${c.resNumber}" data-guest="${c.guest}" data-room="${c.room}" data-type="${c.type}" data-phone="${c.phone}" data-vip="${c.vip}">
                  ${c.guest} (${c.resNumber}) — Room ${c.room} [${c.type}] ${c.vip ? '★ VIP' : ''}
                </option>
              `).join('')}
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="font-bold text-on-surface-variant block mb-1">Guest Current Location *</label>
              <select id="pq-location" class="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-bright text-xs font-semibold">
                <option value="Lobby Lounge (Ground Floor)" selected>Lobby Lounge (Ground Floor)</option>
                <option value="Coffee Shop (Veranda Cafe)">Coffee Shop (Veranda Cafe)</option>
                <option value="Business Center">Business Center</option>
                <option value="Poolside Terrace">Poolside Terrace</option>
                <option value="Offsite (Exploring Area)">Offsite (Exploring Area)</option>
              </select>
            </div>

            <div>
              <label class="font-bold text-on-surface-variant block mb-1">Guest Mobile Phone *</label>
              <input type="text" id="pq-phone" value="+91 99201 55678" class="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-bright text-xs font-mono font-semibold" />
            </div>
          </div>

          <div>
            <label class="font-bold text-on-surface-variant block mb-1">Housekeeping Rush Note</label>
            <input type="text" id="pq-notes" placeholder="e.g. Guest has 14:00 Zoom meeting, needs room expedited immediately" class="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-bright text-xs" />
          </div>

          <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
            <div>
              <span class="font-bold text-amber-900 dark:text-amber-300 block">Dispatch Rush Signal to HK</span>
              <span class="text-[11px] text-amber-800 dark:text-amber-400">Pushes room to top of attendant's cleaning board</span>
            </div>
            <input type="checkbox" id="pq-rush-chk" checked class="w-4 h-4 rounded text-amber-600 cursor-pointer" />
          </div>

          <div class="pt-3 border-t border-outline-variant/60 flex items-center justify-end gap-3">
            <button type="button" id="pq-cancel-btn" class="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant hover:text-primary text-xs font-bold cursor-pointer">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 cursor-pointer shadow-xs active:scale-95">
              Confirm Placement
            </button>
          </div>

        </form>

      </div>
    `;

    document.body.appendChild(modal);
    this.activeModal = modal;

    modal.querySelector('#pq-close-btn').onclick = () => this.closeModal();
    modal.querySelector('#pq-cancel-btn').onclick = () => this.closeModal();

    const resSelect = modal.querySelector('#pq-res-select');
    resSelect.onchange = () => {
      const opt = resSelect.selectedOptions[0];
      modal.querySelector('#pq-phone').value = opt.dataset.phone || '';
    };

    modal.querySelector('#form-place-queue').onsubmit = (e) => {
      e.preventDefault();
      const opt = resSelect.selectedOptions[0];
      const newQueueItem = {
        id: `q-${Date.now()}`,
        resNumber: opt.value,
        guestName: opt.dataset.guest,
        vip: opt.dataset.vip === 'true',
        vipTier: opt.dataset.vip === 'true' ? 'Gold VIP' : null,
        roomNumber: opt.dataset.room,
        roomType: opt.dataset.type,
        roomClass: 'DELUXE',
        queuePriority: this.queueItems.length + 1,
        timeEntered: new Date().toTimeString().split(' ')[0].substring(0, 5) + ' AM',
        waitMinutes: 0,
        guestLocation: modal.querySelector('#pq-location').value,
        guestPhone: modal.querySelector('#pq-phone').value,
        hkStatus: 'DIRTY',
        hkAttendant: 'Floor Attendant Assigned',
        estReadyTime: '20 min',
        isRushed: modal.querySelector('#pq-rush-chk').checked,
        specialRequests: modal.querySelector('#pq-notes').value || 'Expedited arrival queue',
        company: 'Individual Booking',
        adults: 1,
      };

      this.queueItems.push(newQueueItem);
      this.closeModal();
      this.renderContent();
      Toast.show(`✓ ${newQueueItem.guestName} added to Queue (#${newQueueItem.queuePriority}) and rushed to Housekeeping!`, 'success');
    };
  }

  // Modal 2: Reassign Room Modal (Instant switch to clean room)
  openReassignRoomModal(queueItem) {
    this.closeModal();

    const cleanRooms = this.availableCleanRooms;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn';
    modal.innerHTML = `
      <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/80 shadow-2xl w-full max-w-lg overflow-hidden animate-scaleUp">
        
        <div class="px-6 py-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/40">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px] text-primary">swap_horiz</span>
            <h3 class="font-headline-sm text-base font-bold text-primary uppercase">INSTANT ROOM REASSIGNMENT</h3>
          </div>
          <button id="re-close-btn" class="text-on-surface-variant hover:text-primary cursor-pointer">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div class="p-6 flex flex-col gap-4 text-xs">
          
          <div class="p-3 rounded-xl bg-surface-container flex items-center justify-between">
            <div>
              <span class="text-[10px] text-on-surface-variant uppercase font-bold block">Waiting Guest</span>
              <span class="font-bold text-primary text-sm">${queueItem.guestName}</span>
              <span class="text-[10px] text-on-surface-variant">Currently assigned: Room ${queueItem.roomNumber} (${queueItem.roomType})</span>
            </div>
            <span class="px-2 py-1 rounded bg-rose-500/10 text-rose-700 font-bold font-data-mono text-xs">
              ${queueItem.hkStatus}
            </span>
          </div>

          <div>
            <span class="font-bold text-primary uppercase tracking-wider text-[11px] block mb-2">AVAILABLE INSPECTED ROOMS (NO WAIT)</span>
            <div class="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
              ${cleanRooms.map(r => `
                <label class="p-3 rounded-xl border border-outline-variant/70 hover:border-primary bg-surface-container-lowest hover:bg-primary/5 flex items-center justify-between cursor-pointer transition-all">
                  <div class="flex items-center gap-3">
                    <input type="radio" name="opt-clean-room" value="${r.roomNumber}" class="w-4 h-4 text-primary" />
                    <div>
                      <span class="font-data-mono font-bold text-sm text-primary">ROOM ${r.roomNumber}</span>
                      <span class="font-semibold text-on-surface ml-2">${r.type}</span>
                      <span class="text-[10px] text-on-surface-variant block">Floor ${r.floor} · ${r.view} · ${r.bed}</span>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-bold text-[10px]">
                    ✓ Inspected (Ready)
                  </span>
                </label>
              `).join('')}
            </div>
          </div>

          <div class="pt-3 border-t border-outline-variant/60 flex items-center justify-end gap-3">
            <button type="button" id="re-cancel-btn" class="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant hover:text-primary text-xs font-bold cursor-pointer">
              Cancel
            </button>
            <button type="button" id="re-confirm-btn" class="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 cursor-pointer shadow-xs active:scale-95">
              Reassign &amp; Mark Ready
            </button>
          </div>

        </div>

      </div>
    `;

    document.body.appendChild(modal);
    this.activeModal = modal;

    modal.querySelector('#re-close-btn').onclick = () => this.closeModal();
    modal.querySelector('#re-cancel-btn').onclick = () => this.closeModal();

    modal.querySelector('#re-confirm-btn').onclick = () => {
      const selected = modal.querySelector('input[name="opt-clean-room"]:checked');
      if (!selected) {
        Toast.show('Please select an available clean room.', 'warning');
        return;
      }

      const newRoomNum = selected.value;
      const targetRoom = cleanRooms.find(r => r.roomNumber === newRoomNum);

      queueItem.roomNumber = newRoomNum;
      if (targetRoom) queueItem.roomType = targetRoom.type;
      queueItem.hkStatus = 'INSPECTED';
      queueItem.estReadyTime = 'Ready Now';
      queueItem.isRushed = false;

      this.closeModal();
      this.renderContent();
      Toast.show(`✓ Reassigned ${queueItem.guestName} to Room ${newRoomNum}. Room is Inspected & Ready for Check-In!`, 'success');
    };
  }

  // Modal 3: Send SMS Notification Modal
  openSendSMSModal(queueItem) {
    this.closeModal();

    const isReady = queueItem.hkStatus === 'INSPECTED';
    const defaultMsg = isReady
      ? `Dear ${queueItem.guestName}, great news! Your ${queueItem.roomType} (Room ${queueItem.roomNumber}) is now inspected and ready for check-in. Please proceed to the Front Desk at your convenience to collect your room key.`
      : `Dear ${queueItem.guestName}, we are actively expediting Room ${queueItem.roomNumber} with Housekeeping. Our attendants are on priority duty and we estimate readiness within ${queueItem.estReadyTime}.`;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn';
    modal.innerHTML = `
      <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/80 shadow-2xl w-full max-w-md overflow-hidden animate-scaleUp">
        
        <div class="px-6 py-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/40">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px] text-primary">sms</span>
            <h3 class="font-headline-sm text-base font-bold text-primary uppercase">SEND GUEST NOTIFICATION</h3>
          </div>
          <button id="sms-close-btn" class="text-on-surface-variant hover:text-primary cursor-pointer">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form id="form-send-sms" class="p-6 flex flex-col gap-4 text-xs">
          
          <div>
            <label class="font-bold text-on-surface-variant block mb-1">Recipient Mobile Number</label>
            <input type="text" id="sms-phone" value="${queueItem.guestPhone}" class="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-bright text-xs font-mono font-bold" />
          </div>

          <div>
            <label class="font-bold text-on-surface-variant block mb-1">Notification Message</label>
            <textarea id="sms-body" rows="4" class="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-bright text-xs leading-relaxed">${defaultMsg}</textarea>
          </div>

          <div class="p-2.5 rounded-xl bg-surface-container text-[11px] text-on-surface-variant flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px] text-primary">cell_tower</span>
            <span>Automated SMS Gateway Dispatched via Twilio PMS Interface</span>
          </div>

          <div class="pt-3 border-t border-outline-variant/60 flex items-center justify-end gap-3">
            <button type="button" id="sms-cancel-btn" class="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant hover:text-primary text-xs font-bold cursor-pointer">
              Cancel
            </button>
            <button type="submit" class="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 cursor-pointer shadow-xs active:scale-95">
              Send SMS Notification
            </button>
          </div>

        </form>

      </div>
    `;

    document.body.appendChild(modal);
    this.activeModal = modal;

    modal.querySelector('#sms-close-btn').onclick = () => this.closeModal();
    modal.querySelector('#sms-cancel-btn').onclick = () => this.closeModal();

    modal.querySelector('#form-send-sms').onsubmit = (e) => {
      e.preventDefault();
      this.closeModal();
      Toast.show(`✓ SMS dispatched to ${queueItem.guestName} (${queueItem.guestPhone})!`, 'success');
    };
  }

  // Modal 4: Direct Check-In Modal & Key Activation
  openDirectCheckInModal(queueItem) {
    this.closeModal();

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn';
    modal.innerHTML = `
      <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/80 shadow-2xl w-full max-w-md overflow-hidden animate-scaleUp">
        
        <div class="px-6 py-4 border-b border-outline-variant/60 flex items-center justify-between bg-emerald-500/10">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px] text-emerald-600">key</span>
            <h3 class="font-headline-sm text-base font-bold text-emerald-800 dark:text-emerald-300 uppercase">CHECK IN FROM QUEUE</h3>
          </div>
          <button id="chk-close-btn" class="text-on-surface-variant hover:text-primary cursor-pointer">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div class="p-6 flex flex-col gap-4 text-xs">
          
          <div class="p-3 rounded-xl bg-surface-container flex flex-col gap-1.5">
            <div class="flex items-center justify-between">
              <span class="font-bold text-primary text-base">${queueItem.guestName}</span>
              <span class="font-data-mono font-black text-emerald-600 text-base">ROOM ${queueItem.roomNumber}</span>
            </div>
            <div class="text-[11px] text-on-surface-variant">
              ${queueItem.roomType} · ${queueItem.resNumber} · ${queueItem.company || 'Direct'}
            </div>
          </div>

          <div class="flex flex-col gap-2 p-3 rounded-xl bg-surface-container-low/40 border border-outline-variant/50">
            <div class="flex items-center justify-between">
              <span class="font-semibold">Room Condition:</span>
              <span class="font-bold text-emerald-600">✓ 100% Inspected & Ready</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-semibold">Total Wait Time:</span>
              <span class="font-data-mono font-bold">${queueItem.waitMinutes} mins</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-semibold">RFID Key Encoder:</span>
              <span class="font-bold text-primary">Encoder Port #1 (Front Desk Ready)</span>
            </div>
          </div>

          <div class="pt-3 border-t border-outline-variant/60 flex items-center justify-end gap-3">
            <button type="button" id="chk-cancel-btn" class="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant hover:text-primary text-xs font-bold cursor-pointer">
              Cancel
            </button>
            <button type="button" id="chk-confirm-btn" class="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Issue Keys &amp; Check In</span>
            </button>
          </div>

        </div>

      </div>
    `;

    document.body.appendChild(modal);
    this.activeModal = modal;

    modal.querySelector('#chk-close-btn').onclick = () => this.closeModal();
    modal.querySelector('#chk-cancel-btn').onclick = () => this.closeModal();

    modal.querySelector('#chk-confirm-btn').onclick = () => {
      this.executeCheckInFromQueue(queueItem);
    };
  }
}
