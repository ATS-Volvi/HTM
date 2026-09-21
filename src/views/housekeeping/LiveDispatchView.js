// ==========================================================================
// VOLVITECH HOSPITALITY OS — LIVE HOUSEKEEPING DISPATCH & ASSIGNMENT QUEUE
// Real-Time Operations Console for Immediate Attendant Assignment of Front Desk Requests
// ==========================================================================

import { store } from '../../state/store.js';
import { Toast } from '../../components/Toast.js';

export class LiveDispatchView {
  constructor() {
    this.container = null;
    this.activeFilter = 'ALL'; // 'ALL', 'UNASSIGNED', 'RUSH', 'AMENITIES', 'IN_PROGRESS', 'COMPLETED'
    this.unsubscribe = null;

    // Floor Attendants Active Team
    this.attendants = [
      { id: 'stf-1', name: 'Aisha', initials: 'AI', primaryFloors: ['4', '2'], role: 'Floor Attendant', maxLoad: 7 },
      { id: 'stf-2', name: 'Rahul', initials: 'RH', primaryFloors: ['5'], role: 'Senior Attendant', maxLoad: 7 },
      { id: 'stf-3', name: 'Priya', initials: 'PR', primaryFloors: ['6', '4'], role: 'Suite Specialist', maxLoad: 6 },
      { id: 'stf-4', name: 'Carlos', initials: 'CR', primaryFloors: ['3', '1'], role: 'Floor Attendant', maxLoad: 7 },
    ];
  }

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER LIFECYCLE
  // ──────────────────────────────────────────────────────────────────────────
  render() {
    this.container = document.createElement('div');
    this.container.className = 'w-full space-y-6 animate-fadeIn pb-12';
    this.renderContent();

    // Subscribe to real-time store updates
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
  // DATA COMPUTATION
  // ──────────────────────────────────────────────────────────────────────────
  getRequestsData() {
    let requests = store.state.housekeepingRequests || [];

    // If empty, provide realistic baseline requests
    if (requests.length === 0) {
      requests = [
        {
          id: 'REQ-104',
          roomNumber: '402',
          type: 'RUSH_TURNOVER',
          item: 'Rush Cleaning: Early Arrival Guest Waiting in Lobby',
          priority: 'URGENT',
          requestedBy: 'Front Desk',
          guestName: 'Sarah Mitchell',
          vip: true,
          time: '10:45 AM',
          createdAt: new Date(Date.now() - 3 * 60000).toISOString(),
          status: 'Unassigned',
          assignedTo: 'Unassigned'
        },
        {
          id: 'SR-208',
          roomNumber: '508',
          type: 'HOUSEKEEPING',
          item: 'Extra Goose Down Pillows & Cashmere Blanket',
          priority: 'HIGH',
          requestedBy: 'Front Desk (Guest Call)',
          guestName: 'John Smith',
          vip: false,
          time: '11:05 AM',
          createdAt: new Date(Date.now() - 7 * 60000).toISOString(),
          status: 'Unassigned',
          assignedTo: 'Unassigned'
        },
        {
          id: 'REQ-105',
          roomNumber: '615',
          type: 'RUSH_TURNOVER',
          item: 'VIP Royal Suite Rush: Diplomatic Arrival at 14:00',
          priority: 'URGENT',
          requestedBy: 'Front Desk',
          guestName: 'Aisha Al-Mansoor',
          vip: true,
          time: '11:15 AM',
          createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
          status: 'Assigned',
          assignedTo: 'Priya'
        },
        {
          id: 'SR-209',
          roomNumber: '304',
          type: 'HOUSEKEEPING',
          item: 'Baby Cot & Wooden Crib Setup',
          priority: 'NORMAL',
          requestedBy: 'Front Desk',
          guestName: 'Sophia Laurent',
          vip: false,
          time: '11:30 AM',
          createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
          status: 'Assigned',
          assignedTo: 'Carlos'
        },
        {
          id: 'SR-207',
          roomNumber: '201',
          type: 'HOUSEKEEPING',
          item: 'Toiletries Replenishment (L’Occitane Bath Gel)',
          priority: 'NORMAL',
          requestedBy: 'Front Desk',
          guestName: 'Robert Lang',
          vip: false,
          time: '09:50 AM',
          createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
          status: 'Completed',
          assignedTo: 'Aisha'
        }
      ];
      store.state.housekeepingRequests = requests;
    }

    // Filter requests
    const unassigned = requests.filter(r => r.status === 'Unassigned' || r.status === 'Pending' || !r.assignedTo || r.assignedTo.includes('Unassigned'));
    const rushTurnovers = requests.filter(r => r.type === 'RUSH_TURNOVER');
    const guestAmenities = requests.filter(r => r.type === 'HOUSEKEEPING');
    const inProgress = requests.filter(r => (r.status === 'Assigned' || r.status === 'In-Progress' || r.status === 'In Progress') && r.status !== 'Completed');
    const completed = requests.filter(r => r.status === 'Completed');

    let displayList = requests;
    if (this.activeFilter === 'UNASSIGNED') displayList = unassigned;
    else if (this.activeFilter === 'RUSH') displayList = rushTurnovers;
    else if (this.activeFilter === 'AMENITIES') displayList = guestAmenities;
    else if (this.activeFilter === 'IN_PROGRESS') displayList = inProgress;
    else if (this.activeFilter === 'COMPLETED') displayList = completed;

    return {
      all: requests,
      displayList,
      unassignedCount: unassigned.length,
      rushCount: rushTurnovers.length,
      amenitiesCount: guestAmenities.length,
      inProgressCount: inProgress.length,
      completedCount: completed.length
    };
  }

  // Calculate attendant active tasks
  getAttendantWorkload() {
    const requests = store.state.housekeepingRequests || [];
    const rooms = store.state.rooms || [];

    return this.attendants.map(att => {
      const activeRequests = requests.filter(r => r.assignedTo === att.name && r.status !== 'Completed');
      const assignedRooms = rooms.filter(r => r.housekeeper === att.name);
      return {
        ...att,
        activeRequestsCount: activeRequests.length,
        assignedRoomsCount: assignedRooms.length,
        totalWorkload: activeRequests.length + assignedRooms.length
      };
    });
  }

  // Suggest best attendant based on room floor
  getRecommendedAttendant(roomNumber) {
    const room = (store?.state?.rooms || []).find(r => String(r.id) === String(roomNumber));
    const floor = room ? String(room.floor) : '4';
    const workloads = this.getAttendantWorkload();

    // First preference: attendant assigned to this floor
    const onFloor = workloads.find(w => w.primaryFloors.includes(floor));
    if (onFloor) return onFloor.name;

    // Second preference: lowest current workload
    const sorted = [...workloads].sort((a, b) => a.totalWorkload - b.totalWorkload);
    return sorted[0]?.name || 'Aisha';
  }

  getElapsedTime(isoString) {
    if (!isoString) return 'Just now';
    const ms = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(ms / 60000);
    if (mins < 1) return 'Just now';
    if (mins === 1) return '1 min ago';
    if (mins < 60) return `${mins} mins ago`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m ago`;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW RENDERER
  // ──────────────────────────────────────────────────────────────────────────
  renderContent() {
    if (!this.container) return;

    const data = this.getRequestsData();
    const attendantWorkloads = this.getAttendantWorkload();

    this.container.innerHTML = `
      <!-- ================================================================= -->
      <!-- 1. LIVE DISPATCH CONSOLE HEADER -->
      <!-- ================================================================= -->
      <section class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs">
        <div>
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-xs">
              <span class="material-symbols-outlined text-[24px]">bolt</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="font-headline-sm text-lg md:text-xl font-bold text-primary tracking-tight">Live Request Dispatch &amp; Floor Assignment</h1>
                ${data.unassignedCount > 0 ? `
                  <span class="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold font-data-mono animate-pulse border border-rose-300">
                    ● ${data.unassignedCount} Action Required
                  </span>
                ` : `
                  <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold font-data-mono border border-emerald-300">
                    ✓ All Dispatched
                  </span>
                `}
              </div>
              <p class="text-xs text-on-surface-variant mt-0.5">
                Immediate attendant allocation for Front Desk rush cleanups and guest amenity requests.
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2.5 flex-wrap">
          <button id="btn-auto-dispatch-all" class="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
            <span class="material-symbols-outlined text-[18px]">magic_button</span>
            <span>Auto-Dispatch All (${data.unassignedCount})</span>
          </button>

          <button id="btn-refresh-dispatch" class="p-2.5 rounded-xl border border-outline-variant hover:bg-surface-container text-primary font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95" title="Refresh Live Queue">
            <span class="material-symbols-outlined text-[18px]">refresh</span>
          </button>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- 2. TELEMETRY & ATTENDANT WORKLOAD STRIP -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <!-- Unassigned Card -->
        <div class="p-4 rounded-2xl bg-surface-container-lowest border ${data.unassignedCount > 0 ? 'border-rose-300 bg-rose-50/20' : 'border-outline-variant'} flex items-center justify-between shadow-xs">
          <div>
            <span class="text-[10px] font-bold uppercase font-data-mono text-rose-900 block">UNASSIGNED INBOUND</span>
            <div class="text-2xl font-black font-data-mono text-rose-700 leading-none mt-1">${data.unassignedCount}</div>
            <span class="text-[11px] text-on-surface-variant mt-0.5 block">Awaiting attendant dispatch</span>
          </div>
          <div class="w-10 h-10 rounded-xl ${data.unassignedCount > 0 ? 'bg-rose-100 text-rose-700 animate-bounce' : 'bg-surface-container text-on-surface-variant'} flex items-center justify-center">
            <span class="material-symbols-outlined text-[22px]">assignment_late</span>
          </div>
        </div>

        <!-- In Turnover Card -->
        <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant flex items-center justify-between shadow-xs">
          <div>
            <span class="text-[10px] font-bold uppercase font-data-mono text-blue-900 block">DISPATCHED ON FLOOR</span>
            <div class="text-2xl font-black font-data-mono text-blue-700 leading-none mt-1">${data.inProgressCount}</div>
            <span class="text-[11px] text-on-surface-variant mt-0.5 block">Attendants currently fulfilling</span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <span class="material-symbols-outlined text-[22px]">directions_walk</span>
          </div>
        </div>

        <!-- Average Velocity Card -->
        <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant flex items-center justify-between shadow-xs">
          <div>
            <span class="text-[10px] font-bold uppercase font-data-mono text-emerald-900 block">AVG DISPATCH SPEED</span>
            <div class="text-2xl font-black font-data-mono text-emerald-700 leading-none mt-1">&lt; 90s</div>
            <span class="text-[11px] text-emerald-800 font-medium mt-0.5 block">98% under SLA standard</span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <span class="material-symbols-outlined text-[22px]">timer</span>
          </div>
        </div>

        <!-- Completed Today Card -->
        <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant flex items-center justify-between shadow-xs">
          <div>
            <span class="text-[10px] font-bold uppercase font-data-mono text-purple-900 block">FULFILLED TODAY</span>
            <div class="text-2xl font-black font-data-mono text-purple-700 leading-none mt-1">${data.completedCount}</div>
            <span class="text-[11px] text-on-surface-variant mt-0.5 block">Delivered to guest rooms</span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <span class="material-symbols-outlined text-[22px]">task_alt</span>
          </div>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- 3. ACTIVE ON-DUTY FLOOR ATTENDANTS STRIP -->
      <!-- ================================================================= -->
      <section class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-primary">badge</span>
            <h3 class="text-xs font-bold text-primary uppercase tracking-wider font-data-mono">On-Duty Floor Attendant Capacity</h3>
          </div>
          <span class="text-[11px] text-on-surface-variant font-data-mono">4 Attendants Active • Real-Time Load</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          ${attendantWorkloads.map(att => `
            <div class="p-3 rounded-xl border border-outline-variant/60 bg-surface-bright flex flex-col justify-between">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg bg-primary text-on-primary font-bold font-data-mono text-[11px] flex items-center justify-center">
                    ${att.initials}
                  </div>
                  <div>
                    <span class="font-bold text-xs text-primary block leading-tight">${att.name}</span>
                    <span class="text-[10px] text-on-surface-variant font-data-mono">Floors ${att.primaryFloors.join(' & ')}</span>
                  </div>
                </div>
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>

              <div class="mt-2.5 pt-2 border-t border-outline-variant/40 flex items-center justify-between text-[10px] font-data-mono">
                <span class="text-on-surface-variant">Active Load:</span>
                <span class="font-bold text-primary">${att.totalWorkload} tasks</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- 4. FILTER PILLS BAR -->
      <!-- ================================================================= -->
      <section class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        ${[
          { id: 'ALL', label: 'All Requests', count: data.all.length },
          { id: 'UNASSIGNED', label: 'Needs Assignment', count: data.unassignedCount, highlight: true },
          { id: 'RUSH', label: 'Rush Turnovers', count: data.rushCount },
          { id: 'AMENITIES', label: 'Guest Amenities', count: data.amenitiesCount },
          { id: 'IN_PROGRESS', label: 'Dispatched & Active', count: data.inProgressCount },
          { id: 'COMPLETED', label: 'Fulfilled Today', count: data.completedCount }
        ].map(tab => `
          <button 
            class="btn-dispatch-filter px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              this.activeFilter === tab.id
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant border border-outline-variant'
            }"
            data-filter="${tab.id}"
          >
            <span>${tab.label}</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] font-data-mono ${
              this.activeFilter === tab.id
                ? 'bg-white/20 text-white'
                : tab.highlight && tab.count > 0 ? 'bg-rose-100 text-rose-800 font-bold' : 'bg-surface-container-high text-on-surface-variant'
            }">
              ${tab.count}
            </span>
          </button>
        `).join('')}
      </section>

      <!-- ================================================================= -->
      <!-- 5. REAL-TIME REQUESTS ASSIGNMENT QUEUE -->
      <!-- ================================================================= -->
      <section class="space-y-3">
        ${data.displayList.length === 0 ? `
          <div class="p-12 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant">
            <div class="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <span class="material-symbols-outlined text-[32px]">task_alt</span>
            </div>
            <h3 class="font-headline-sm text-base font-bold text-primary">All Inbound Requests Dispatched</h3>
            <p class="text-xs text-on-surface-variant max-w-md mx-auto mt-1">
              There are no pending requests in this filter. As soon as Front Desk submits an expedited turnover or guest amenity request, it will appear here immediately.
            </p>
          </div>
        ` : `
          <div class="grid grid-cols-1 gap-3.5">
            ${data.displayList.map(req => {
              const isUnassigned = req.status === 'Unassigned' || req.status === 'Pending' || !req.assignedTo || req.assignedTo.includes('Unassigned');
              const isRush = req.type === 'RUSH_TURNOVER';
              const recommendedAttendant = this.getRecommendedAttendant(req.roomNumber);
              const room = (store?.state?.rooms || []).find(r => String(r.id) === String(req.roomNumber));
              const floor = room ? room.floor : '4';
              const roomType = room ? room.type : 'Deluxe Room';

              return `
                <div class="p-4 rounded-2xl bg-surface-container-lowest border ${
                  isUnassigned
                    ? 'border-rose-300 ring-2 ring-rose-200/50 shadow-md'
                    : req.status === 'Completed'
                    ? 'border-outline-variant/60 opacity-80'
                    : 'border-outline-variant shadow-xs'
                } flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">

                  <!-- Request Details -->
                  <div class="flex items-start gap-3.5 flex-1 min-w-0">
                    <!-- Room Pill -->
                    <div class="flex flex-col items-center justify-center w-14 h-14 rounded-2xl ${
                      isRush ? 'bg-rose-50 text-rose-900 border border-rose-200' : 'bg-primary/10 text-primary border border-primary/20'
                    } shrink-0">
                      <span class="font-black font-data-mono text-sm leading-none">${req.roomNumber}</span>
                      <span class="text-[9px] font-bold font-data-mono uppercase tracking-wider text-on-surface-variant mt-0.5">Fl. ${floor}</span>
                    </div>

                    <!-- Description & Metadata -->
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-2 flex-wrap mb-1">
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold font-data-mono uppercase ${
                          isRush ? 'bg-rose-100 text-rose-900 border border-rose-200' : 'bg-blue-100 text-blue-900 border border-blue-200'
                        }">
                          ${isRush ? '⚡ Rush Turnover' : '🛎️ Guest Amenity'}
                        </span>

                        <span class="px-2 py-0.5 rounded text-[10px] font-bold font-data-mono uppercase ${
                          req.priority === 'URGENT' ? 'bg-rose-600 text-white' : req.priority === 'HIGH' ? 'bg-amber-500 text-white' : 'bg-surface-container-high text-on-surface-variant'
                        }">
                          ${req.priority}
                        </span>

                        <span class="text-[11px] text-on-surface-variant font-data-mono flex items-center gap-1">
                          <span class="material-symbols-outlined text-[14px]">schedule</span>
                          <span>${this.getElapsedTime(req.createdAt)} (${req.time || 'Today'})</span>
                        </span>

                        ${req.vip ? `
                          <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold font-data-mono text-[10px] border border-amber-300">
                            ★ VIP Guest
                          </span>
                        ` : ''}
                      </div>

                      <h4 class="font-bold text-sm text-primary leading-tight truncate">${req.item}</h4>
                      
                      <div class="text-[11px] text-on-surface-variant mt-1 flex items-center gap-2 flex-wrap">
                        <span>Room: <strong>${roomType}</strong></span>
                        <span>•</span>
                        <span>Source: <strong>${req.requestedBy || 'Front Desk'}</strong></span>
                        ${req.guestName ? `<span>• Guest: <strong>${req.guestName}</strong></span>` : ''}
                      </div>
                    </div>
                  </div>

                  <!-- Assignment Actions -->
                  <div class="shrink-0 flex flex-col md:items-end gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-outline-variant/50">
                    ${isUnassigned ? `
                      <div class="text-[11px] font-bold text-rose-800 font-data-mono flex items-center gap-1">
                        <span class="material-symbols-outlined text-[16px]">priority_high</span>
                        <span>Assign Attendant Immediately:</span>
                      </div>

                      <!-- Quick-Assign Attendant Chips -->
                      <div class="flex items-center gap-1.5 flex-wrap">
                        ${this.attendants.map(att => {
                          const isRec = att.name === recommendedAttendant;
                          return `
                            <button 
                              class="btn-quick-assign-attendant px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                                isRec 
                                  ? 'bg-primary text-on-primary border-primary shadow-xs' 
                                  : 'bg-surface-container-lowest hover:bg-surface-container text-primary border-outline-variant'
                              }"
                              data-req-id="${req.id}"
                              data-staff-name="${att.name}"
                              title="Assign to ${att.name} (Floors ${att.primaryFloors.join('/')})"
                            >
                              <span class="w-4 h-4 rounded-full bg-white/20 text-center font-data-mono text-[10px] leading-4 flex items-center justify-center">
                                ${att.initials}
                              </span>
                              <span>${att.name}</span>
                              ${isRec ? `<span class="text-[9px] bg-white text-primary px-1 rounded font-black font-data-mono">REC</span>` : ''}
                            </button>
                          `;
                        }).join('')}
                      </div>
                    ` : req.status === 'Completed' ? `
                      <div class="flex items-center gap-2">
                        <span class="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold font-data-mono flex items-center gap-1">
                          <span class="material-symbols-outlined text-[16px] text-emerald-700">task_alt</span>
                          <span>Completed by ${req.assignedTo}</span>
                        </span>
                      </div>
                    ` : `
                      <!-- Assigned State with Complete Action -->
                      <div class="flex items-center gap-2">
                        <div class="px-3 py-1 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold font-data-mono flex items-center gap-1.5">
                          <span class="material-symbols-outlined text-[16px] text-blue-700">directions_walk</span>
                          <span>Assigned: <strong>${req.assignedTo}</strong> (In Delivery)</span>
                        </div>

                        <button 
                          class="btn-complete-request px-3 py-1 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-1"
                          data-req-id="${req.id}"
                        >
                          <span class="material-symbols-outlined text-[16px]">check</span>
                          <span>Mark Done</span>
                        </button>
                      </div>
                    `}
                  </div>

                </div>
              `;
            }).join('')}
          </div>
        `}
      </section>
    `;

    this.bindEvents();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // EVENT BINDINGS
  // ──────────────────────────────────────────────────────────────────────────
  bindEvents() {
    if (!this.container) return;

    // Filter Buttons
    this.container.querySelectorAll('.btn-dispatch-filter').forEach(btn => {
      btn.onclick = () => {
        this.activeFilter = btn.dataset.filter;
        this.renderContent();
      };
    });

    // Quick Assign to Attendant Chips
    this.container.querySelectorAll('.btn-quick-assign-attendant').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const reqId = btn.dataset.reqId;
        const staffName = btn.dataset.staffName;
        store.assignHousekeepingRequest(reqId, staffName);
      };
    });

    // Mark Done Button
    this.container.querySelectorAll('.btn-complete-request').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const reqId = btn.dataset.reqId;
        store.completeHousekeepingRequest(reqId);
      };
    });

    // Auto-Dispatch All Button
    const btnAutoDispatch = this.container.querySelector('#btn-auto-dispatch-all');
    if (btnAutoDispatch) {
      btnAutoDispatch.onclick = () => {
        store.autoDispatchPendingRequests();
      };
    }

    // Refresh Queue Button
    const btnRefresh = this.container.querySelector('#btn-refresh-dispatch');
    if (btnRefresh) {
      btnRefresh.onclick = () => {
        Toast.show({ title: 'Dispatch Synced', message: 'Inbound Front Desk requests refreshed.', type: 'info' });
        this.renderContent();
      };
    }
  }
}
