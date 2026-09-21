// ==========================================================================
// VOLVITECH HOSPITALITY OS — EXECUTIVE HOUSEKEEPING DASHBOARD
// Primary Operational Command Center for Hotel Room Readiness & Cleanliness
// Real-Time Telemetry Integrating Front Desk Arrivals, Floor Attendants & QA
// ==========================================================================

import { store } from '../state/store.js';
import { Toast } from '../components/Toast.js';

export class HousekeepingDashboardView {
  constructor() {
    this.container = null;
    this.isLoading = false;
    this.mode = null; // can be explicitly 'front_desk' or 'housekeeping'
    this.activeRushModal = null; // room number or true
    this.activeServiceModal = null; // room number or true
    this.activeBroadcastModal = false; // broadcast announcement modal
    this.selectedFloorFilter = 'ALL'; // 'ALL', '1', '2', '3', '4', '5', '6'
    this.unsubscribe = null;

    // Default Attendant Shift Team
    this.staffList = [
      { id: 'stf-1', name: 'Aisha', initials: 'AI', role: 'Floor Attendant', floor: '4 & 2', roomsAssigned: 6, maxRooms: 7, onDuty: true, status: 'Active' },
      { id: 'stf-2', name: 'Rahul', initials: 'RH', role: 'Senior Attendant', floor: '5', roomsAssigned: 5, maxRooms: 7, onDuty: true, status: 'Active' },
      { id: 'stf-3', name: 'Priya', initials: 'PR', role: 'Suite Specialist', floor: '6 & 4', roomsAssigned: 4, maxRooms: 6, onDuty: true, status: 'Active' },
      { id: 'stf-4', name: 'Carlos', initials: 'CR', role: 'Floor Attendant', floor: '3', roomsAssigned: 3, maxRooms: 7, onDuty: true, status: 'Active' },
    ];

    this.guestRequests = this.generateInitialRequests();
    this.broadcastAnnouncements = [
      { id: 'ann-1', time: '10:30 AM', author: 'Victoria S. (Exec HK)', message: 'High priority VIP arrival in Suite 615 at 15:00. Royal suite standards apply.' },
      { id: 'ann-2', time: '09:00 AM', author: 'Front Desk Dispatch', message: 'Floors 2 & 4 checkouts are starting early. Please prioritize dirty turnovers.' }
    ];
  }

  get isFrontDeskMode() {
    return (store && store.state && store.state.activeWorkspace === 'FRONT_DESK') || this.mode === 'front_desk';
  }

  generateInitialRequests() {
    return [
      { id: 'req-1', roomNumber: '402', item: 'Extra Bath Towels & Face Cloths', guestName: 'Sarah Mitchell', time: '10:42 AM', assignedTo: 'Aisha', priority: 'NORMAL', status: 'In Delivery' },
      { id: 'req-2', roomNumber: '508', item: 'Extra Goose Down Pillow', guestName: 'John Smith', time: '11:02 AM', assignedTo: 'Rahul', priority: 'URGENT', status: 'Pending' },
      { id: 'req-3', roomNumber: '615', item: 'Baby Cot & Wooden Crib', guestName: 'Aisha Al-Mansoor', time: '11:15 AM', assignedTo: 'Priya', priority: 'HIGH', status: 'In Delivery' },
      { id: 'req-4', roomNumber: '304', item: 'Iron and Board', guestName: 'Sophia Laurent', time: '11:30 AM', assignedTo: 'Carlos', priority: 'NORMAL', status: 'Completed' },
      { id: 'req-5', roomNumber: '201', item: 'Toiletries Replenishment (L’Occitane)', guestName: 'Robert Lang', time: '11:45 AM', assignedTo: 'Aisha', priority: 'NORMAL', status: 'Pending' },
    ];
  }

  // ──────────────────────────────────────────────────────────────────────────
  // OPERATIONAL METRICS & TELEMETRY
  // ──────────────────────────────────────────────────────────────────────────
  getSummaryMetrics() {
    const rooms = store?.state?.rooms || [];
    const tasks = store?.getHousekeepingTasks ? store.getHousekeepingTasks() : (store?.state?.housekeepingTasks || []);

    const totalRooms = rooms.length || 24;
    const occupiedCount = rooms.filter(r => r.occupancy === 'Occupied' || r.status === 'Occupied').length;
    const vacantCount = totalRooms - occupiedCount;

    const readyCount = rooms.filter(r => r.status === 'Inspected').length;
    const cleanCount = rooms.filter(r => r.status === 'Clean').length;
    const cleaningCount = rooms.filter(r => r.status === 'In Progress' || r.status === 'Cleaning').length;
    const dirtyCount = rooms.filter(r => r.status === 'Dirty' || r.status === 'DIRTY').length;
    const failedCount = rooms.filter(r => r.status === 'Failed' || r.status === 'FAILED').length;
    const maintenanceCount = rooms.filter(r => r.status === 'Out of Order' || r.status === 'Maintenance').length;

    const urgentCount = tasks.filter(t => t.priority === 'URGENT' || t.priority === 'Urgent').length +
      rooms.filter(r => r.status === 'Dirty' && r.vip).length;

    const readyPercentage = totalRooms > 0 ? Math.round((readyCount / totalRooms) * 100) : 0;
    const turnoverPercentage = totalRooms > 0 ? Math.round(((readyCount + cleanCount) / totalRooms) * 100) : 0;

    return {
      totalRooms,
      occupiedCount,
      vacantCount,
      roomsToClean: dirtyCount,
      dirtyCount,
      cleaningCount,
      cleaning: cleaningCount,
      cleanCount,
      inspectionCount: cleanCount + failedCount,
      inspection: cleanCount + failedCount,
      readyCount,
      ready: readyCount,
      urgentCount: Math.max(urgentCount, 1),
      urgent: Math.max(urgentCount, 1),
      maintenanceCount,
      readyPercentage,
      turnoverPercentage,
    };
  }

  // Floor-by-floor breakdown
  getFloorPipelines() {
    const rooms = store?.state?.rooms || [];
    const floors = ['1', '2', '3', '4', '5', '6'];

    return floors.map(floorNum => {
      const floorRooms = rooms.filter(r => String(r.floor) === floorNum);
      const total = floorRooms.length || 4;
      const ready = floorRooms.filter(r => r.status === 'Inspected').length;
      const cleaning = floorRooms.filter(r => r.status === 'In Progress' || r.status === 'Cleaning').length;
      const dirty = floorRooms.filter(r => r.status === 'Dirty' || r.status === 'DIRTY').length;
      const clean = floorRooms.filter(r => r.status === 'Clean').length;
      const pct = total > 0 ? Math.round((ready / total) * 100) : 0;

      return {
        floor: floorNum,
        total,
        ready,
        cleaning,
        dirty,
        clean,
        pct,
        rooms: floorRooms
      };
    });
  }

  // Priority arrival queue
  getPriorityArrivals() {
    const rooms = store?.state?.rooms || [];
    const tasks = store?.getHousekeepingTasks ? store.getHousekeepingTasks() : (store?.state?.housekeepingTasks || []);

    // Pick top urgent or dirty rooms with arrivals
    return [
      {
        roomNumber: '508',
        type: 'Deluxe King',
        floor: '5',
        guest: 'John Smith',
        eta: 'In 40 mins (12:30 PM)',
        urgency: 'CRITICAL',
        status: 'Dirty',
        assignedTo: 'Rahul',
        vip: false,
        reason: 'Early Arrival at Front Desk',
      },
      {
        roomNumber: '615',
        type: 'Presidential Suite',
        floor: '6',
        guest: 'Aisha Al-Mansoor',
        eta: '15:00 PM',
        urgency: 'HIGH',
        status: 'In Progress',
        assignedTo: 'Priya',
        vip: true,
        vipTier: 'Royal VIP',
        reason: 'Royal VIP Suite Prep & Flower Setup',
      },
      {
        roomNumber: '402',
        type: 'Deluxe King',
        floor: '4',
        guest: 'Sarah Mitchell',
        eta: '16:00 PM',
        urgency: 'MODERATE',
        status: 'Dirty',
        assignedTo: 'Aisha',
        vip: true,
        vipTier: 'VIP',
        reason: 'Departure Turnover Required',
      },
      {
        roomNumber: '201',
        type: 'Classic King',
        floor: '2',
        guest: 'Robert Lang',
        eta: 'Stayover In-House',
        urgency: 'NORMAL',
        status: 'In Progress',
        assignedTo: 'Carlos',
        vip: false,
        reason: 'Daily Stayover Refresh',
      },
    ];
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MAIN RENDER
  // ──────────────────────────────────────────────────────────────────────────
  render() {
    const el = document.createElement('div');
    el.className = 'w-full flex flex-col gap-6 animate-fadeIn pb-16 max-w-7xl mx-auto';
    this.container = el;
    this.subscribeToStore();
    this.renderContent();
    return el;
  }

  renderContent() {
    if (!this.container) return;

    const metrics = this.getSummaryMetrics();
    const floorPipelines = this.getFloorPipelines();
    const priorityArrivals = this.getPriorityArrivals();
    const linenData = store.getDailyLinenConsumption ? store.getDailyLinenConsumption() : { totals: { totalTowels: 0, totalSheets: 0, totalAmenities: 0 } };
    const isFD = this.isFrontDeskMode;

    this.container.innerHTML = `
      <!-- ================================================================= -->
      <!-- 1. EXECUTIVE OPERATIONAL HEADER & SHIFT CONTEXT -->
      <!-- ================================================================= -->
      <section class="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-outline-variant/60">
        <div>
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant font-data-mono">VOLVITECH HOSPITALITY OS</span>
            <span class="text-on-surface-variant font-data-mono">→</span>
            <span class="text-xs font-semibold uppercase tracking-wider text-primary font-data-mono font-bold">
              ${isFD ? 'Front Desk Operations' : 'Housekeeping Command'}
            </span>
            <span class="text-on-surface-variant font-data-mono">•</span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
              isFD ? 'bg-blue-100 text-blue-900 border border-blue-200' : 'bg-primary/10 text-primary border border-primary/20'
            }">
              <span class="material-symbols-outlined text-[14px]">${isFD ? 'visibility' : 'cleaning_services'}</span>
              ${isFD ? 'Front Desk Telemetry & Requests' : 'Morning Shift Turnover • 07:00 – 15:30'}
            </span>
          </div>

          <h1 class="font-headline-lg text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            ${isFD ? 'Housekeeping Status &amp; Telemetry' : 'Executive Housekeeping Dashboard'}
          </h1>
          <p class="text-sm text-on-surface-variant mt-0.5">
            ${isFD
              ? 'Real-time room cleanliness, check-in readiness telemetry, and rush cleaning dispatch.'
              : 'Real-time property room health, floor turnover velocity, and supervisor quality assurance.'}
          </p>
        </div>

        <div class="flex items-center gap-2.5 flex-wrap">
          ${isFD ? `
            <button id="btn-fd-open-rush-modal" class="px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
              <span class="material-symbols-outlined text-[18px]">bolt</span>
              <span>Request Rush Clean</span>
            </button>

            <button id="btn-fd-open-service-modal" class="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/90 text-on-secondary font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
              <span class="material-symbols-outlined text-[18px]">room_service</span>
              <span>Request Guest Service</span>
            </button>
          ` : `
            <button id="btn-open-broadcast-modal" class="px-3.5 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container text-primary font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
              <span class="material-symbols-outlined text-[18px]">campaign</span>
              <span>Broadcast Notice</span>
            </button>

            <button id="btn-nav-to-assignments" class="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary/90 text-on-secondary font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
              <span class="material-symbols-outlined text-[18px]">assignment_ind</span>
              <span>Staff Assignments</span>
            </button>
          `}

          <button id="btn-refresh-dashboard" class="p-2.5 rounded-xl border border-outline-variant hover:bg-surface-container text-primary font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95" title="Refresh Live Telemetry">
            <span class="material-symbols-outlined text-[18px]">refresh</span>
          </button>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- 2. FRONT DESK TELEMETRY NOTICE BANNER (when in Front Desk Mode) -->
      <!-- ================================================================= -->
      ${isFD ? `
        <div class="p-4 rounded-2xl bg-blue-50/90 border border-blue-200 text-xs text-blue-950 flex items-center justify-between gap-4 shadow-xs animate-fadeIn">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[20px]">info</span>
            </div>
            <div>
              <div class="font-bold font-data-mono uppercase tracking-wider text-blue-900">Front Desk View-Only &amp; Service Request Mode</div>
              <div class="text-blue-800/90 mt-0.5">Room readiness is live and read-only. Staff assignment and attendant balancing are managed in the Housekeeping workspace.</div>
            </div>
          </div>
          <div class="hidden sm:flex items-center gap-2 shrink-0">
            <span class="px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-[11px] font-bold font-data-mono text-emerald-800">
              ✓ Ready for Check-In: <strong>${metrics.ready}</strong>
            </span>
            <span class="px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-[11px] font-bold font-data-mono text-rose-800">
              Dirty Rooms: <strong>${metrics.roomsToClean}</strong>
            </span>
          </div>
        </div>
      ` : ''}

      <!-- ================================================================= -->
      <!-- 3. CLEANLINESS & READINESS HERO KPI STRIP (Interactive Telemetry) -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        <!-- Ready for Check-In -->
        <div class="bg-surface-container-lowest p-4 rounded-2xl border border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer" data-filter="READY">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-900 font-data-mono">READY FOR CHECK-IN</span>
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div class="my-2">
            <div class="text-3xl font-black font-data-mono text-emerald-800 leading-none">${metrics.ready}</div>
            <div class="text-[11px] text-emerald-700 font-medium mt-1">${metrics.readyPercentage}% of property ready</div>
          </div>
          <div class="pt-2 border-t border-emerald-100 flex items-center justify-between text-[10px] font-data-mono text-emerald-800 font-bold">
            <span>QA Inspected</span>
            <span class="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
          </div>
        </div>

        <!-- In Turnover / Cleaning -->
        <div class="bg-surface-container-lowest p-4 rounded-2xl border border-blue-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer" data-filter="CLEANING">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-wider text-blue-900 font-data-mono">IN TURNOVER</span>
            <span class="material-symbols-outlined text-[16px] text-blue-600">sync</span>
          </div>
          <div class="my-2">
            <div class="text-3xl font-black font-data-mono text-blue-800 leading-none">${metrics.cleaning}</div>
            <div class="text-[11px] text-blue-700 font-medium mt-1">Attendants on floor</div>
          </div>
          <div class="pt-2 border-t border-blue-100 flex items-center justify-between text-[10px] font-data-mono text-blue-800 font-bold">
            <span>Avg 28m pace</span>
            <span class="material-symbols-outlined text-[16px] text-blue-600">timer</span>
          </div>
        </div>

        <!-- Dirty / Checkout Queue -->
        <div class="bg-surface-container-lowest p-4 rounded-2xl border border-rose-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer" data-filter="DIRTY">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-wider text-rose-900 font-data-mono">DIRTY QUEUE</span>
            <span class="material-symbols-outlined text-[16px] text-rose-600">hotel</span>
          </div>
          <div class="my-2">
            <div class="text-3xl font-black font-data-mono text-rose-800 leading-none">${metrics.roomsToClean}</div>
            <div class="text-[11px] text-rose-700 font-medium mt-1">Pending turnaround</div>
          </div>
          <div class="pt-2 border-t border-rose-100 flex items-center justify-between text-[10px] font-data-mono text-rose-800 font-bold">
            <span>Checkouts today</span>
            <span class="material-symbols-outlined text-[16px] text-rose-600">arrow_downward</span>
          </div>
        </div>

        <!-- QA Inspection Pending -->
        <div class="bg-surface-container-lowest p-4 rounded-2xl border border-purple-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer" data-filter="INSPECTION">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-wider text-purple-900 font-data-mono">QA PENDING</span>
            <span class="material-symbols-outlined text-[16px] text-purple-600">fact_check</span>
          </div>
          <div class="my-2">
            <div class="text-3xl font-black font-data-mono text-purple-800 leading-none">${metrics.inspection}</div>
            <div class="text-[11px] text-purple-700 font-medium mt-1">Cleaned, awaiting audit</div>
          </div>
          <div class="pt-2 border-t border-purple-100 flex items-center justify-between text-[10px] font-data-mono text-purple-800 font-bold">
            <span>Supervisor signoff</span>
            <span class="material-symbols-outlined text-[16px] text-purple-600">checklist</span>
          </div>
        </div>

        <!-- Urgent / VIP Turnovers -->
        <div class="bg-surface-container-lowest p-4 rounded-2xl border border-amber-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer" data-filter="URGENT">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-wider text-amber-900 font-data-mono">RUSH / VIP</span>
            <span class="material-symbols-outlined text-[16px] text-amber-600 animate-bounce">bolt</span>
          </div>
          <div class="my-2">
            <div class="text-3xl font-black font-data-mono text-amber-800 leading-none">${metrics.urgent}</div>
            <div class="text-[11px] text-amber-700 font-medium mt-1">Arrival in &lt; 1 hour</div>
          </div>
          <div class="pt-2 border-t border-amber-100 flex items-center justify-between text-[10px] font-data-mono text-amber-800 font-bold">
            <span>High priority</span>
            <span class="material-symbols-outlined text-[16px] text-amber-600">priority_high</span>
          </div>
        </div>

        <!-- Maintenance / Blocked -->
        <div class="bg-surface-container-lowest p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer" data-filter="MAINTENANCE">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-800 font-data-mono">OUT OF ORDER</span>
            <span class="material-symbols-outlined text-[16px] text-slate-500">engineering</span>
          </div>
          <div class="my-2">
            <div class="text-3xl font-black font-data-mono text-slate-800 leading-none">${metrics.maintenanceCount}</div>
            <div class="text-[11px] text-slate-600 font-medium mt-1">Active tickets</div>
          </div>
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-data-mono text-slate-700 font-bold">
            <span>Engineering hold</span>
            <span class="material-symbols-outlined text-[16px] text-slate-500">build</span>
          </div>
        </div>

      </section>

      <!-- ================================================================= -->
      <!-- 3.5 DAILY LINEN, LAUNDRY & CONSUMABLES TELEMETRY BANNER -->
      <!-- ================================================================= -->
      <section class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[22px]">local_laundry_service</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-xs text-primary">Daily Linen &amp; Amenities Turnover Telemetry</span>
              <span class="px-2 py-0.2 rounded-full text-[10px] font-bold font-data-mono bg-primary/10 text-primary">PAR AUDIT</span>
            </div>
            <div class="text-[11px] text-on-surface-variant mt-0.5">
              Live audit of towels changed, bedsheets laundered, and luxury bathroom consumables refilled across rooms.
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2.5 flex-wrap">
          <div class="px-3 py-1.5 rounded-xl border border-outline-variant bg-surface-bright flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px] text-sky-600">wash</span>
            <div class="text-xs font-data-mono font-bold text-primary">${linenData.totals.totalTowels} <span class="text-[10px] font-normal text-on-surface-variant">Towels Changed</span></div>
          </div>

          <div class="px-3 py-1.5 rounded-xl border border-outline-variant bg-surface-bright flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px] text-indigo-600">bed</span>
            <div class="text-xs font-data-mono font-bold text-primary">${linenData.totals.totalSheets} <span class="text-[10px] font-normal text-on-surface-variant">Sheets Changed</span></div>
          </div>

          <div class="px-3 py-1.5 rounded-xl border border-outline-variant bg-surface-bright flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px] text-emerald-600">sanitizer</span>
            <div class="text-xs font-data-mono font-bold text-primary">${linenData.totals.totalAmenities} <span class="text-[10px] font-normal text-on-surface-variant">Amenities Refilled</span></div>
          </div>

          <button id="btn-dashboard-open-linen" class="px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center gap-1 hover:bg-primary/90 cursor-pointer active:scale-95 transition-all shadow-xs">
            <span>Linen &amp; Laundry</span>
            <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- 4. MIDDLE SECTION: FLOOR PIPELINE & PRIORITY ARRIVAL RADAR -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <!-- Floor-by-Floor Pipeline Matrix (7 Cols) -->
        <div class="lg:col-span-7 bg-surface-container-lowest rounded-2xl border border-outline-variant/70 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-outline-variant/40 mb-4">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px] text-primary">apartment</span>
                <h3 class="font-headline-sm text-sm font-bold text-primary">Floor Turnover Pipeline</h3>
              </div>
              <span class="text-xs text-on-surface-variant font-data-mono">Floors 1 – 6 Overview</span>
            </div>

            <div class="space-y-3.5">
              ${floorPipelines.map(fp => `
                <div class="p-3 rounded-xl bg-surface-bright border border-outline-variant/40 hover:border-primary/50 transition-all flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                      <span class="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs font-data-mono">
                        F${fp.floor}
                      </span>
                      <div>
                        <span class="font-bold text-xs text-primary font-data-mono">Floor ${fp.floor}</span>
                        <span class="text-[10px] text-on-surface-variant font-data-mono ml-2">${fp.total} Total Rooms</span>
                      </div>
                    </div>

                    <div class="flex items-center gap-2 text-[10px] font-bold font-data-mono">
                      <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">${fp.ready} Ready</span>
                      ${fp.cleaning > 0 ? `<span class="px-2 py-0.5 rounded bg-blue-100 text-blue-900">${fp.cleaning} Cleaning</span>` : ''}
                      ${fp.dirty > 0 ? `<span class="px-2 py-0.5 rounded bg-rose-100 text-rose-900">${fp.dirty} Dirty</span>` : ''}
                      <span class="text-primary ml-1">${fp.pct}%</span>
                    </div>
                  </div>

                  <!-- Progress Bar -->
                  <div class="w-full h-2 rounded-full bg-surface-container-high overflow-hidden flex">
                    <div class="h-full bg-emerald-600 transition-all" style="width: ${fp.pct}%" title="Ready"></div>
                    <div class="h-full bg-blue-500 transition-all" style="width: ${(fp.cleaning / fp.total) * 100}%" title="Cleaning"></div>
                    <div class="h-full bg-rose-500 transition-all" style="width: ${(fp.dirty / fp.total) * 100}%" title="Dirty"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs text-on-surface-variant font-data-mono">
            <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Ready</span>
            <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-blue-500"></span> In Progress</span>
            <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-rose-500"></span> Dirty Departures</span>
            <span class="font-bold text-primary">Shift Target: 100% by 14:00</span>
          </div>
        </div>

        <!-- Priority Arrival & Turnover Radar (5 Cols) -->
        <div class="lg:col-span-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/70 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-outline-variant/40 mb-3">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px] text-amber-600">radar</span>
                <h3 class="font-headline-sm text-sm font-bold text-primary">Priority Arrival Radar</h3>
              </div>
              <span class="text-[11px] font-bold text-rose-700 font-data-mono animate-pulse">Live Queues</span>
            </div>

            <div class="space-y-2.5">
              ${priorityArrivals.map(pa => `
                <div class="p-3 rounded-xl border ${
                  pa.urgency === 'CRITICAL'
                    ? 'bg-rose-50/50 border-rose-300 ring-1 ring-rose-400/20'
                    : pa.vip
                    ? 'bg-amber-50/40 border-amber-300'
                    : 'bg-surface-bright border-outline-variant/40'
                } flex flex-col gap-1.5">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-black font-data-mono text-primary">ROOM ${pa.roomNumber}</span>
                      ${pa.vip ? `<span class="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase font-data-mono bg-amber-200 text-amber-900">⭐ ${pa.vipTier || 'VIP'}</span>` : ''}
                    </div>
                    <span class="text-[10px] font-bold font-data-mono ${
                      pa.urgency === 'CRITICAL' ? 'text-rose-700 animate-pulse' : 'text-amber-800'
                    }">${pa.eta}</span>
                  </div>

                  <div class="flex items-center justify-between text-xs">
                    <span class="text-on-surface-variant font-medium truncate max-w-[170px]">${pa.guest}</span>
                    <span class="font-data-mono text-[11px] font-bold ${
                      pa.status === 'Dirty' ? 'text-rose-700' : 'text-blue-700'
                    }">${pa.status} • Attendant: ${pa.assignedTo}</span>
                  </div>

                  <div class="flex items-center justify-between pt-1 border-t border-outline-variant/30 text-[10px]">
                    <span class="text-on-surface-variant italic truncate max-w-[200px]">${pa.reason}</span>
                    <button class="btn-radar-rush px-2 py-0.5 rounded bg-rose-700 hover:bg-rose-800 text-white font-bold text-[10px] cursor-pointer" data-room="${pa.roomNumber}">
                      Expedite
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between">
            <span class="text-xs text-on-surface-variant font-data-mono">Early Arrival Telemetry</span>
            <button id="btn-radar-view-all" class="text-xs font-bold text-primary hover:underline cursor-pointer">
              View All Inbound Arrivals →
            </button>
          </div>
        </div>

      </section>

      <!-- ================================================================= -->
      <!-- 5. LOWER SECTION: GUEST AMENITIES FEED & SHIFT BENCHMARKS -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-6">

        <!-- Live Housekeeping Service Requests & Amenities Feed (7 Cols) -->
        <div class="lg:col-span-7 bg-surface-container-lowest rounded-2xl border border-outline-variant/70 p-5 shadow-xs">
          <div class="flex items-center justify-between pb-3 border-b border-outline-variant/40 mb-3">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px] text-primary">room_service</span>
              <h3 class="font-headline-sm text-sm font-bold text-primary">Guest Amenity &amp; Service Requests</h3>
            </div>
            <button id="btn-dash-open-service-modal" class="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer">
              <span class="material-symbols-outlined text-[16px]">add_circle</span>
              <span>New Request</span>
            </button>
          </div>

          <div class="space-y-2.5">
            ${this.guestRequests.slice(0, 4).map(req => `
              <div class="p-3 rounded-xl border border-outline-variant/50 bg-surface-bright flex items-center justify-between text-xs gap-3">
                <div class="flex items-center gap-3">
                  <span class="w-8 h-8 rounded-lg bg-primary/10 text-primary font-black font-data-mono text-xs flex items-center justify-center shrink-0">
                    ${req.roomNumber}
                  </span>
                  <div>
                    <div class="font-bold text-primary">${req.item}</div>
                    <div class="text-[11px] text-on-surface-variant font-data-mono mt-0.5">
                      Guest: ${req.guestName} • ${req.time} • Attendant: <strong>${req.assignedTo}</strong>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold font-data-mono ${
                    req.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-900'
                      : req.status === 'In Delivery'
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-amber-100 text-amber-900'
                  }">${req.status}</span>
                  ${req.status !== 'Completed' ? `
                    <button class="btn-dash-complete-req px-2 py-1 rounded bg-primary text-on-primary text-[10px] font-bold cursor-pointer" data-id="${req.id}">
                      Done
                    </button>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Shift Quality & Operational Benchmarks (5 Cols) -->
        <div class="lg:col-span-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/70 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-outline-variant/40 mb-3">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px] text-primary">equalizer</span>
                <h3 class="font-headline-sm text-sm font-bold text-primary">Shift Quality &amp; Benchmarks</h3>
              </div>
              <span class="text-xs text-on-surface-variant font-data-mono">Live Telemetry</span>
            </div>

            <div class="grid grid-cols-2 gap-3 mb-3">
              <div class="p-3 rounded-xl bg-surface-bright border border-outline-variant/40">
                <span class="text-[10px] font-bold uppercase font-data-mono text-on-surface-variant block">Turnaround Velocity</span>
                <div class="text-xl font-black font-data-mono text-primary mt-1">26 mins</div>
                <span class="text-[10px] text-emerald-700 font-medium">9 mins ahead of target</span>
              </div>

              <div class="p-3 rounded-xl bg-surface-bright border border-outline-variant/40">
                <span class="text-[10px] font-bold uppercase font-data-mono text-on-surface-variant block">QA Pass Rate</span>
                <div class="text-xl font-black font-data-mono text-emerald-800 mt-1">96.8%</div>
                <span class="text-[10px] text-emerald-700 font-medium">First-time inspection</span>
              </div>
            </div>

            <!-- Floor Staff Coverage -->
            <div class="p-3 rounded-xl bg-surface-bright border border-outline-variant/40 space-y-2">
              <div class="flex justify-between items-center text-xs">
                <span class="font-bold text-primary">On-Duty Attendant Coverage</span>
                <span class="font-data-mono text-[11px] font-bold text-primary">${this.staffList.length} Active Floor Staff</span>
              </div>
              <div class="flex gap-2">
                ${this.staffList.map(s => `
                  <div class="flex-1 p-2 rounded-lg bg-surface-container text-center">
                    <span class="font-bold text-xs text-primary block">${s.name}</span>
                    <span class="text-[9px] text-on-surface-variant block font-data-mono">Fl. ${s.floor}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs">
            <span class="text-on-surface-variant font-data-mono">Linen &amp; Supplies: <strong class="text-emerald-700">Optimal</strong></span>
            <span class="text-on-surface-variant font-data-mono">Shift lead: <strong class="text-primary">Victoria S.</strong></span>
          </div>
        </div>

      </section>

      <!-- ================================================================= -->
      <!-- 6. MODALS: RUSH CLEAN, SERVICE REQUEST, BROADCAST -->
      <!-- ================================================================= -->
      ${this.renderRushTurnoverModal()}
      ${this.renderFrontDeskServiceModal()}
      ${this.renderBroadcastModal()}
    `;

    this.bindEvents();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MODALS
  // ──────────────────────────────────────────────────────────────────────────
  renderRushTurnoverModal() {
    if (this.activeRushModal === null) return '';
    const presetRoom = typeof this.activeRushModal === 'string' ? this.activeRushModal : '';
    const dirtyRooms = (store?.state?.rooms || []).filter(r => r.status === 'Dirty' || r.status === 'DIRTY');

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px] text-rose-700">bolt</span>
              <h3 class="font-headline-sm text-base font-bold text-primary">Request Rush Turnover</h3>
            </div>
            <button id="btn-close-rush-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-3.5 text-xs">
            <div class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-950">
              <span class="font-bold block mb-0.5 font-data-mono text-[11px] uppercase text-rose-900">Priority Cleaning Dispatch</span>
              <span class="text-[11px]">Dispatches an immediate high-priority turnover notification to Housekeeping supervisors for expedited cleaning.</span>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Room Number *</label>
              ${presetRoom
                ? `<input type="text" id="input-rush-room" value="${presetRoom}" readonly class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container text-xs text-primary font-bold font-data-mono outline-none" />`
                : `<select id="input-rush-room" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary font-bold font-data-mono outline-none cursor-pointer">
                    <option value="">-- Select a Dirty Room --</option>
                    ${dirtyRooms.map(r => `<option value="${r.id}">Room #${r.id} (${r.type || 'Room'} • Floor ${r.floor})</option>`).join('')}
                  </select>`
              }
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Rush Reason *</label>
              <select id="sel-rush-reason" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary outline-none cursor-pointer font-medium">
                <option value="Guest Arrived Early at Front Desk">Guest Arrived Early at Front Desk</option>
                <option value="VIP Royal Guest Inbound Arrival">VIP Royal Guest Inbound Arrival</option>
                <option value="Guest Waiting in Lobby Lounge">Guest Waiting in Lobby Lounge</option>
                <option value="Expedited Turnover for Check-in Queue">Expedited Turnover for Check-in Queue</option>
                <option value="Room Re-clean Required Immediately">Room Re-clean Required Immediately</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Additional Notes</label>
              <textarea id="input-rush-notes" rows="2" placeholder="Optional notes for housekeeping supervisor..." class="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none"></textarea>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-outline-variant bg-surface-bright flex items-center justify-end gap-2">
            <button id="btn-cancel-rush" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-submit-rush" class="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all">
              <span class="material-symbols-outlined text-[16px]">bolt</span>
              <span>Dispatch Rush Request</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderFrontDeskServiceModal() {
    if (this.activeServiceModal === null) return '';
    const presetRoom = typeof this.activeServiceModal === 'string' ? this.activeServiceModal : '';

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px] text-primary">room_service</span>
              <h3 class="font-headline-sm text-base font-bold text-primary">Request Guest Amenity / Service</h3>
            </div>
            <button id="btn-close-service-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-3.5 text-xs">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Room Number *</label>
              <input type="text" id="input-service-room" value="${presetRoom}" placeholder="e.g. 402" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary font-bold font-data-mono outline-none" />
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Service / Amenity Item *</label>
              <select id="sel-service-item" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary outline-none cursor-pointer font-medium">
                <option value="Extra Bath Towels & Face Cloths">Extra Bath Towels &amp; Face Cloths</option>
                <option value="Extra Goose Down Pillows">Extra Goose Down Pillows</option>
                <option value="Warm Cashmere Blanket">Warm Cashmere Blanket</option>
                <option value="L’Occitane Luxury Toiletries Set">L’Occitane Luxury Toiletries Set</option>
                <option value="Baby Cot & Wooden Crib">Baby Cot &amp; Wooden Crib</option>
                <option value="Iron & Ironing Board">Iron &amp; Ironing Board</option>
                <option value="Dyson Hair Dryer">Dyson Hair Dryer</option>
                <option value="Express Towel Swap & Trash Emptying">Express Towel Swap &amp; Trash Emptying</option>
                <option value="Laundry / Dry Cleaning Pickup">Laundry / Dry Cleaning Pickup</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Priority</label>
              <select id="sel-service-priority" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary outline-none cursor-pointer">
                <option value="NORMAL">Normal (Within 30 mins)</option>
                <option value="URGENT">Urgent (Immediate Guest Waiting)</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Special Instructions</label>
              <textarea id="input-service-notes" rows="2" placeholder="Guest requested delivery after 2 PM, etc..." class="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none"></textarea>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-outline-variant bg-surface-bright flex items-center justify-end gap-2">
            <button id="btn-cancel-service" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-submit-service" class="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all">
              <span>Submit Request</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  renderBroadcastModal() {
    if (!this.activeBroadcastModal) return '';

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px] text-primary">campaign</span>
              <h3 class="font-headline-sm text-base font-bold text-primary">Broadcast Floor Notice</h3>
            </div>
            <button id="btn-close-broadcast-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-3.5 text-xs">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Target Floor Attendants</label>
              <select id="sel-broadcast-target" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary font-bold outline-none cursor-pointer">
                <option value="ALL">All Floor Attendants (All Floors)</option>
                <option value="Floor 5 & 6">Floors 5 &amp; 6 (Executive &amp; Royal Suites)</option>
                <option value="Floor 3 & 4">Floors 3 &amp; 4 (Deluxe Floors)</option>
                <option value="Floor 1 & 2">Floors 1 &amp; 2 (Classic Rooms)</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Announcement Message *</label>
              <textarea id="input-broadcast-text" rows="3" placeholder="Enter instructions or priority announcements for floor staff..." class="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none"></textarea>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-outline-variant bg-surface-bright flex items-center justify-end gap-2">
            <button id="btn-cancel-broadcast" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-send-broadcast" class="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95 transition-all">
              <span class="material-symbols-outlined text-[16px]">send</span>
              <span>Send Broadcast</span>
            </button>
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

    // Refresh telemetry
    const btnRefresh = this.container.querySelector('#btn-refresh-dashboard');
    if (btnRefresh) {
      btnRefresh.onclick = () => {
        Toast.show({ title: 'Telemetry Synced', message: 'Live room cleanliness and floor progress refreshed.', type: 'info' });
        this.renderContent();
      };
    }

    // Front Desk: Open Rush Modal
    const btnOpenRush = this.container.querySelector('#btn-fd-open-rush-modal');
    if (btnOpenRush) {
      btnOpenRush.onclick = () => {
        this.activeRushModal = true;
        this.renderContent();
      };
    }

    // Front Desk: Open Service Modal
    const btnOpenService = this.container.querySelector('#btn-fd-open-service-modal, #btn-dash-open-service-modal');
    if (btnOpenService) {
      btnOpenService.onclick = () => {
        this.activeServiceModal = true;
        this.renderContent();
      };
    }

    // Housekeeping: Open Broadcast Modal
    const btnOpenBroadcast = this.container.querySelector('#btn-open-broadcast-modal');
    if (btnOpenBroadcast) {
      btnOpenBroadcast.onclick = () => {
        this.activeBroadcastModal = true;
        this.renderContent();
      };
    }

    // Housekeeping: Navigate to Staff Assignments
    const btnNavAssign = this.container.querySelector('#btn-nav-to-assignments');
    if (btnNavAssign) {
      btnNavAssign.onclick = () => {
        if (store && typeof store.setNavTab === 'function') {
          store.setNavTab('hk_assignments');
        }
      };
    }

    // Radar expedite buttons
    this.container.querySelectorAll('.btn-radar-rush').forEach(btn => {
      btn.onclick = () => {
        const rNum = btn.dataset.room;
        store.requestRushTurnover(rNum, 'Early arrival priority radar dispatch');
        this.renderContent();
      };
    });

    // Complete guest request
    this.container.querySelectorAll('.btn-dash-complete-req').forEach(btn => {
      btn.onclick = () => {
        const reqId = btn.dataset.id;
        const targetReq = this.guestRequests.find(r => r.id === reqId);
        if (targetReq) {
          targetReq.status = 'Completed';
          Toast.show({ title: 'Delivered', message: `Delivered ${targetReq.item} to Room ${targetReq.roomNumber}.`, type: 'success' });
          this.renderContent();
        }
      };
    });

    // Rush modal events
    const btnCloseRush = this.container.querySelector('#btn-close-rush-modal, #btn-cancel-rush');
    if (btnCloseRush) {
      btnCloseRush.onclick = () => {
        this.activeRushModal = null;
        this.renderContent();
      };
    }

    const btnSubmitRush = this.container.querySelector('#btn-submit-rush');
    if (btnSubmitRush) {
      btnSubmitRush.onclick = () => {
        const rNum = this.container.querySelector('#input-rush-room')?.value;
        const reason = this.container.querySelector('#sel-rush-reason')?.value || 'Expedited Front Desk Check-in';
        const notes = this.container.querySelector('#input-rush-notes')?.value || '';
        if (!rNum) {
          Toast.show({ title: 'Room Required', message: 'Please enter or select a room number for rush turnover.', type: 'error' });
          return;
        }
        store.requestRushTurnover(rNum, notes ? `${reason} — ${notes}` : reason);
        this.activeRushModal = null;
        this.renderContent();
      };
    }

    // Service modal events
    const btnCloseService = this.container.querySelector('#btn-close-service-modal, #btn-cancel-service');
    if (btnCloseService) {
      btnCloseService.onclick = () => {
        this.activeServiceModal = null;
        this.renderContent();
      };
    }

    const btnSubmitService = this.container.querySelector('#btn-submit-service');
    if (btnSubmitService) {
      btnSubmitService.onclick = () => {
        const rNum = this.container.querySelector('#input-service-room')?.value;
        const item = this.container.querySelector('#sel-service-item')?.value || 'Extra Towels';
        const priority = this.container.querySelector('#sel-service-priority')?.value || 'NORMAL';
        const notes = this.container.querySelector('#input-service-notes')?.value || '';
        if (!rNum) {
          Toast.show({ title: 'Room Required', message: 'Please enter a valid room number.', type: 'error' });
          return;
        }
        store.requestHousekeepingService({ roomId: rNum, requestItem: item, notes, priority });
        this.guestRequests.unshift({
          id: `req-${Date.now()}`,
          roomNumber: rNum,
          item,
          guestName: 'In-House Guest',
          time: 'Just now',
          assignedTo: 'Floor Dispatch',
          priority,
          status: 'Pending'
        });
        this.activeServiceModal = null;
        this.renderContent();
      };
    }

    // Broadcast modal events
    const btnCloseBroadcast = this.container.querySelector('#btn-close-broadcast-modal, #btn-cancel-broadcast');
    if (btnCloseBroadcast) {
      btnCloseBroadcast.onclick = () => {
        this.activeBroadcastModal = false;
        this.renderContent();
      };
    }

    const btnSendBroadcast = this.container.querySelector('#btn-send-broadcast');
    if (btnSendBroadcast) {
      btnSendBroadcast.onclick = () => {
        const msg = this.container.querySelector('#input-broadcast-text')?.value;
        if (!msg) {
          Toast.show({ title: 'Message Required', message: 'Please enter an announcement message.', type: 'error' });
          return;
        }
        this.broadcastAnnouncements.unshift({
          id: `ann-${Date.now()}`,
          time: 'Just now',
          author: 'Supervisor (Executive HK)',
          message: msg
        });
        this.activeBroadcastModal = false;
        Toast.show({ title: 'Broadcast Sent', message: 'Floor attendants notified on mobile devices.', type: 'success' });
        this.renderContent();
      };
    }

    // Open Linen & Laundry Module
    const btnLinen = this.container.querySelector('#btn-dashboard-open-linen');
    if (btnLinen) {
      btnLinen.onclick = () => {
        store.setNavTab('hk_linen');
      };
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // STORE SUBSCRIPTION & LIFECYCLE
  // ──────────────────────────────────────────────────────────────────────────
  subscribeToStore() {
    if (this.unsubscribe) return;
    if (store && typeof store.subscribe === 'function') {
      this.unsubscribe = store.subscribe(() => {
        if (this.container) {
          this.renderContent();
        }
      });
    }
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  async loadData() {
    this.isLoading = true;
    this.subscribeToStore();
    this.isLoading = false;
    this.renderContent();
  }
}

// ──────────────────────────────────────────────────────────────────────────
// BACKWARDS COMPATIBILITY EXPORTS FOR ActiveWorkspaceShell.js
// ──────────────────────────────────────────────────────────────────────────
let singletonInstance = null;

export function renderHousekeepingView(state) {
  if (!singletonInstance) {
    singletonInstance = new HousekeepingDashboardView();
  }
  const el = singletonInstance.render();
  return el.outerHTML;
}

export function bindHousekeepingEvents() {
  if (singletonInstance) {
    const mount = document.querySelector('#active-workspace-mount, #housekeeping-view-mount');
    if (mount) {
      singletonInstance.container = mount;
      singletonInstance.bindEvents();
    }
  }
}
