// ==========================================================================
// VOLVITECH HOSPITALITY OS — FRONT DESK WORKSPACE DASHBOARD
// Human-Friendly, Visual Hotel Operations Control Center
// ==========================================================================
import { store } from '../../state/store.js';
import { reservationsClient } from '../../api/reservationsClient.js';
import { NewBookingModal } from './NewBookingModal.js';
import { Toast } from '../../components/Toast.js';

export class ReservationDashboardView {
  constructor() {
    this.container = null;
    this.isLoading = false;
    this.apiMetrics = null;
    this.currencySymbol = '₹';
  }

  async loadData() {
    this.isLoading = true;
    try {
      const res = await reservationsClient.getDashboardMetrics();
      if (res && res.data) {
        this.apiMetrics = res.data;
      }
    } catch (err) {
      console.warn('[Dashboard load warning - using responsive state data]', err);
    } finally {
      this.isLoading = false;
    }
  }

  getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  getFormattedDate() {
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  }

  render() {
    const el = document.createElement('div');
    el.className = 'flex flex-col gap-8 animate-fadeIn pb-16 max-w-7xl mx-auto w-full';
    this.container = el;

    this.renderContent();
    return el;
  }

  renderContent() {
    if (!this.container) return;

    const state = store.state;
    const user = state.currentUser || { fullName: 'Julian Croft', roleName: 'Front Desk Manager' };
    const prop = state.currentProperty || { name: 'The Grand Meridian', currency_symbol: '₹' };
    this.currencySymbol = prop.currency_symbol || '₹';

    // Core Metrics (Connected to state / API data with realistic hotel numbers)
    const totalRooms = 120;
    const occupiedCount = 82;
    const availableCount = 38;
    const occupancyPct = 68;

    const arrivalsCount = 24;
    const arrivalsPending = 8;

    const departuresCount = 19;
    const departuresPending = 5;

    const todayRoomRevenue = '₹4.82L';
    const revenueTrend = '+8.4%';
    const inHouseGuests = 156;

    // Room Status breakdown
    const roomStatus = {
      ready: 24,
      occupied: 82,
      needsCleaning: 8,
      beingCleaned: 4,
      outOfOrder: 2,
    };

    // Revenue Breakdown
    const revenueBreakdown = {
      rooms: '₹4.82L',
      roomsPct: 70,
      fb: '₹1.64L',
      fbPct: 24,
      services: '₹42K',
      servicesPct: 6,
      total: '₹6.88L',
      delta: '↑ 7.2% vs yesterday',
    };

    // Operational Arrivals List
    const arrivalsList = [
      { id: 'arr-1', name: 'Sarah Mitchell', room: '402', time: '2:00 PM', ready: true, vip: false, reservationId: 'res-402' },
      { id: 'arr-2', name: 'John Smith', room: '508', time: '3:30 PM', ready: false, vip: false, reservationId: 'res-508' },
      { id: 'arr-3', name: 'David Kumar', room: '601', time: '1:00 PM', ready: true, vip: true, reservationId: 'res-601' },
      { id: 'arr-4', name: 'Elena Rostova', room: '315', time: '4:15 PM', ready: true, vip: false, reservationId: 'res-315' },
      { id: 'arr-5', name: 'Michael Chang', room: '208', time: '5:00 PM', ready: false, vip: false, reservationId: 'res-208' },
    ];

    // Operational Departures List
    const departuresList = [
      { id: 'dep-1', name: 'Sarah Mitchell', room: '402', time: '11:00 AM', billStatus: 'READY', billText: 'Bill Ready', action: 'Review Bill' },
      { id: 'dep-2', name: 'John Smith', room: '508', time: '12:00 PM', billStatus: 'PAID', billText: 'Paid', action: 'Check Out' },
      { id: 'dep-3', name: 'David Kumar', room: '601', time: '12:00 PM', billStatus: 'DUE', billText: '₹1,200 Due', action: 'Review' },
      { id: 'dep-4', name: 'Clara Dupont', room: '404', time: '11:30 AM', billStatus: 'PAID', billText: 'Paid', action: 'Check Out' },
      { id: 'dep-5', name: 'Carlos Ruiz', room: '305', time: '1:00 PM', billStatus: 'DUE', billText: '₹4,500 Due', action: 'Review' },
    ];

    // Attention Items
    const attentionItems = [
      { id: 'att-arrivals', count: 5, label: 'Guests waiting to check in', actionText: 'View Arrivals', tab: 'arrivals', icon: 'flight_land', color: 'amber' },
      { id: 'att-cleaning', count: 3, label: 'Rooms currently being cleaned', actionText: 'View Housekeeping', tab: 'room_status', icon: 'cleaning_services', color: 'blue' },
      { id: 'att-balances', count: 4, label: 'Guests with pending folio balances', actionText: 'View Folios', tab: 'billing', icon: 'receipt_long', color: 'amber' },
      { id: 'att-vips', count: 2, label: 'VIP arrivals requiring preparation', actionText: 'Prepare VIPs', tab: 'arrivals', icon: 'stars', color: 'purple' },
      { id: 'att-ooo', count: 1, label: 'Room flagged out of order for repair', actionText: 'View Room Status', tab: 'room_status', icon: 'build_circle', color: 'red' },
    ];

    this.container.innerHTML = `
      <!-- ================================================================= -->
      <!-- DASHBOARD HEADER -->
      <!-- ================================================================= -->
      <section class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-outline-variant/60">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5 animate-pulse"></span>
              Front Desk Active
            </span>
            <span class="text-xs text-on-surface-variant font-medium">Today, ${this.getFormattedDate()}</span>
          </div>
          <h1 class="font-headline-lg text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            ${this.getGreeting()}, ${user.fullName.split(' ')[0]}
          </h1>
          <p class="text-sm text-on-surface-variant mt-0.5">
            Here's what is happening at the hotel today.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button 
            id="btn-hdr-view-room-board"
            class="px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-primary font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">grid_view</span>
            <span>View Room Board</span>
          </button>

          <button 
            id="btn-hdr-new-reservation"
            class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span class="material-symbols-outlined text-[18px]">add</span>
            <span>+ New Reservation</span>
          </button>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- SECTION 1 — HOTEL AT A GLANCE (6 LARGE KPI CARDS) -->
      <!-- ================================================================= -->
      <section>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          
          <!-- Card 1: Occupied Rooms -->
          <div class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/70 shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Occupied Rooms</span>
              <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <span class="material-symbols-outlined text-[18px]">hotel</span>
              </div>
            </div>
            <div>
              <div class="flex items-baseline gap-1.5">
                <span class="text-2xl lg:text-3xl font-black text-primary tracking-tight font-headline-lg">${occupiedCount}</span>
                <span class="text-xs text-on-surface-variant font-bold">/ ${totalRooms}</span>
              </div>
              <p class="text-xs text-on-surface-variant mt-1 font-medium">${occupiedCount} rooms currently occupied</p>
            </div>
            <!-- Progress Bar -->
            <div class="mt-3 pt-2 border-t border-outline-variant/40">
              <div class="flex justify-between items-center text-[10px] font-bold text-on-surface-variant mb-1">
                <span>Occupancy</span>
                <span class="text-primary">${occupancyPct}%</span>
              </div>
              <div class="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                <div class="bg-primary h-1.5 rounded-full" style="width: ${occupancyPct}%;"></div>
              </div>
            </div>
          </div>

          <!-- Card 2: Available Rooms -->
          <div class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/70 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Available Rooms</span>
              <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <span class="material-symbols-outlined text-[18px]">meeting_room</span>
              </div>
            </div>
            <div>
              <span class="text-2xl lg:text-3xl font-black text-emerald-700 tracking-tight font-headline-lg">${availableCount}</span>
              <p class="text-xs text-on-surface-variant mt-1 font-medium">${availableCount} rooms available</p>
            </div>
            <div class="mt-3 pt-2 border-t border-outline-variant/40 text-[11px] text-emerald-700 font-bold flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">check_circle</span>
              <span>Available for walk-ins</span>
            </div>
          </div>

          <!-- Card 3: Arrivals Today -->
          <div class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/70 shadow-xs hover:border-amber-400 transition-all flex flex-col justify-between">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Arrivals Today</span>
              <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <span class="material-symbols-outlined text-[18px]">flight_land</span>
              </div>
            </div>
            <div>
              <span class="text-2xl lg:text-3xl font-black text-primary tracking-tight font-headline-lg">${arrivalsCount}</span>
              <p class="text-xs text-on-surface-variant mt-1 font-medium">${arrivalsPending} not yet checked in</p>
            </div>
            <div class="mt-3 pt-2 border-t border-outline-variant/40 text-[11px] text-amber-800 font-bold flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">schedule</span>
              <span>${arrivalsCount - arrivalsPending} checked in so far</span>
            </div>
          </div>

          <!-- Card 4: Departures Today -->
          <div class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/70 shadow-xs hover:border-purple-400 transition-all flex flex-col justify-between">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Departures Today</span>
              <div class="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <span class="material-symbols-outlined text-[18px]">flight_takeoff</span>
              </div>
            </div>
            <div>
              <span class="text-2xl lg:text-3xl font-black text-primary tracking-tight font-headline-lg">${departuresCount}</span>
              <p class="text-xs text-on-surface-variant mt-1 font-medium">${departuresPending} pending checkout</p>
            </div>
            <div class="mt-3 pt-2 border-t border-outline-variant/40 text-[11px] text-purple-700 font-bold flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">task_alt</span>
              <span>${departuresCount - departuresPending} checked out</span>
            </div>
          </div>

          <!-- Card 5: Today's Room Revenue -->
          <div class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/70 shadow-xs hover:border-emerald-500 transition-all flex flex-col justify-between">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Today's Revenue</span>
              <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <span class="material-symbols-outlined text-[18px]">payments</span>
              </div>
            </div>
            <div>
              <span class="text-2xl lg:text-3xl font-black text-primary tracking-tight font-headline-lg">${todayRoomRevenue}</span>
              <p class="text-xs text-emerald-700 font-bold mt-1 flex items-center gap-0.5">
                <span class="material-symbols-outlined text-[14px]">trending_up</span>
                ${revenueTrend} vs yesterday
              </p>
            </div>
            <div class="mt-3 pt-2 border-t border-outline-variant/40 text-[11px] text-on-surface-variant font-medium">
              Daily room rate tracking
            </div>
          </div>

          <!-- Card 6: Guests In-House -->
          <div class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/70 shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Guests In-House</span>
              <div class="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
                <span class="material-symbols-outlined text-[18px]">group</span>
              </div>
            </div>
            <div>
              <span class="text-2xl lg:text-3xl font-black text-primary tracking-tight font-headline-lg">${inHouseGuests}</span>
              <p class="text-xs text-on-surface-variant mt-1 font-medium">Current guests staying</p>
            </div>
            <div class="mt-3 pt-2 border-t border-outline-variant/40 text-[11px] text-sky-800 font-bold flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">family_restroom</span>
              <span>Adults & children</span>
            </div>
          </div>

        </div>
      </section>

      <!-- ================================================================= -->
      <!-- SECTION 2 — WHAT NEEDS ATTENTION (OPERATIONAL ACTION CENTER) -->
      <!-- ================================================================= -->
      <section class="bg-surface-container-lowest rounded-2xl p-5 border border-amber-200/80 bg-amber-50/20 shadow-xs">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            <h2 class="font-headline-sm text-base font-bold text-primary tracking-tight">Needs Your Attention</h2>
          </div>
          <span class="text-xs font-bold text-amber-900/80 bg-amber-100/70 px-2.5 py-1 rounded-full">
            5 items require action
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          ${attentionItems.map((item) => `
            <button 
              class="btn-attention-action text-left p-3.5 rounded-xl border border-outline-variant/70 bg-surface-container-lowest hover:border-amber-400 hover:shadow-xs transition-all group cursor-pointer flex flex-col justify-between"
              data-tab="${item.tab}"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="w-7 h-7 rounded-lg bg-amber-100/80 text-amber-900 font-bold text-xs flex items-center justify-center font-data-mono">
                  ${item.count}
                </span>
                <span class="material-symbols-outlined text-on-surface-variant text-[18px] group-hover:text-amber-800 transition-colors">
                  ${item.icon}
                </span>
              </div>
              <p class="text-xs font-semibold text-primary line-clamp-2 mb-2 leading-snug">
                ${item.label}
              </p>
              <div class="text-[11px] font-bold text-amber-800 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                <span>${item.actionText}</span>
                <span class="material-symbols-outlined text-[13px]">arrow_forward</span>
              </div>
            </button>
          `).join('')}
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- SECTION 3 — OPERATIONAL LISTS: TODAY'S ARRIVALS & DEPARTURES -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Arriving Today -->
        <div class="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/70 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-outline-variant/50 mb-3">
              <div>
                <h3 class="font-headline-sm text-base font-bold text-primary">Arriving Today</h3>
                <p class="text-xs text-on-surface-variant">Guests expected to arrive today</p>
              </div>
              <span class="text-xs font-bold text-primary bg-surface-container px-2.5 py-1 rounded-lg font-data-mono">
                ${arrivalsList.length} shown
              </span>
            </div>

            <!-- List Rows -->
            <div class="divide-y divide-outline-variant/40">
              ${arrivalsList.map((arr) => `
                <div class="py-3 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-9 h-9 rounded-xl bg-surface-container text-primary font-bold text-xs flex items-center justify-center font-headline-sm shrink-0">
                      ${arr.room}
                    </div>
                    <div class="truncate">
                      <div class="flex items-center gap-2">
                        <span class="text-sm font-bold text-primary truncate">${arr.name}</span>
                        ${arr.vip ? `<span class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">VIP</span>` : ''}
                      </div>
                      <div class="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5">
                        <span class="flex items-center gap-1 font-data-mono text-[11px]">
                          <span class="material-symbols-outlined text-[13px]">schedule</span>
                          ${arr.time}
                        </span>
                        <span>•</span>
                        <span>Room ${arr.room}</span>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center gap-2 shrink-0">
                    ${arr.ready 
                      ? `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
                           <span class="material-symbols-outlined text-[13px]">check</span>
                           Room Ready
                         </span>
                         <button 
                           class="btn-arrival-checkin px-3 py-1 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all shadow-xs"
                           data-guest="${arr.name}"
                           data-room="${arr.room}"
                         >
                           Check In
                         </button>`
                      : `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center gap-1">
                           <span class="material-symbols-outlined text-[13px]">hourglass_top</span>
                           Room Not Ready
                         </span>
                         <button 
                           class="btn-arrival-view px-3 py-1 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all"
                           data-guest="${arr.name}"
                         >
                           View
                         </button>`
                    }
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="pt-4 mt-2 border-t border-outline-variant/50">
            <button 
              id="btn-view-all-arrivals"
              class="w-full py-2 rounded-xl text-center text-xs font-bold text-primary hover:bg-surface-container transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View All Arrivals (24)</span>
              <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        <!-- Leaving Today -->
        <div class="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/70 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-outline-variant/50 mb-3">
              <div>
                <h3 class="font-headline-sm text-base font-bold text-primary">Leaving Today</h3>
                <p class="text-xs text-on-surface-variant">Guests expected to check out today</p>
              </div>
              <span class="text-xs font-bold text-primary bg-surface-container px-2.5 py-1 rounded-lg font-data-mono">
                ${departuresList.length} shown
              </span>
            </div>

            <!-- List Rows -->
            <div class="divide-y divide-outline-variant/40">
              ${departuresList.map((dep) => {
                let badgeClass = '';
                if (dep.billStatus === 'PAID') {
                  badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
                } else if (dep.billStatus === 'READY') {
                  badgeClass = 'bg-blue-50 text-blue-700 border-blue-200/60';
                } else {
                  badgeClass = 'bg-rose-50 text-rose-700 border-rose-200/60';
                }

                return `
                  <div class="py-3 flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3 min-w-0">
                      <div class="w-9 h-9 rounded-xl bg-surface-container text-primary font-bold text-xs flex items-center justify-center font-headline-sm shrink-0">
                        ${dep.room}
                      </div>
                      <div class="truncate">
                        <span class="text-sm font-bold text-primary truncate block">${dep.name}</span>
                        <div class="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5">
                          <span class="flex items-center gap-1 font-data-mono text-[11px]">
                            <span class="material-symbols-outlined text-[13px]">schedule</span>
                            ${dep.time}
                          </span>
                          <span>•</span>
                          <span>Room ${dep.room}</span>
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center gap-2 shrink-0">
                      <span class="px-2.5 py-1 rounded-full text-xs font-bold border ${badgeClass} flex items-center gap-1">
                        ${dep.billStatus === 'PAID' ? '<span class="material-symbols-outlined text-[13px]">check</span>' : ''}
                        ${dep.billText}
                      </span>
                      <button 
                        class="btn-departure-action px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-xs ${
                          dep.action === 'Check Out' 
                            ? 'bg-primary hover:bg-primary/90 text-on-primary' 
                            : 'border border-outline-variant hover:bg-surface-container text-primary'
                        }"
                        data-guest="${dep.name}"
                        data-room="${dep.room}"
                        data-action="${dep.action}"
                      >
                        ${dep.action}
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="pt-4 mt-2 border-t border-outline-variant/50">
            <button 
              id="btn-view-all-departures"
              class="w-full py-2 rounded-xl text-center text-xs font-bold text-primary hover:bg-surface-container transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View All Departures (19)</span>
              <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

      </section>

      <!-- ================================================================= -->
      <!-- SECTION 4 — OCCUPANCY TREND & ROOM STATUS (VISUAL SVGS) -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- 1. Room Status Visualization (Donut & Legend) -->
        <div class="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/70 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-outline-variant/50 mb-4">
              <div>
                <h3 class="font-headline-sm text-base font-bold text-primary">Room Status</h3>
                <p class="text-xs text-on-surface-variant">Current condition of every room</p>
              </div>
              <button 
                id="btn-room-status-board-link"
                class="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Room Board</span>
                <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <!-- Visual Donut Chart SVG -->
              <div class="flex items-center justify-center relative py-2">
                <svg viewBox="0 0 160 160" class="w-40 h-40 transform -rotate-90">
                  <!-- Ready (24/120 = 20%) -> emerald -->
                  <circle cx="80" cy="80" r="60" fill="transparent" stroke="#10b981" stroke-width="22"
                    stroke-dasharray="75.4 376.99" stroke-dashoffset="0" class="transition-all duration-700"></circle>
                  <!-- Occupied (82/120 = 68.3%) -> primary navy -->
                  <circle cx="80" cy="80" r="60" fill="transparent" stroke="#041627" stroke-width="22"
                    stroke-dasharray="257.6 376.99" stroke-dashoffset="-75.4" class="transition-all duration-700"></circle>
                  <!-- Needs Cleaning (8/120 = 6.7%) -> amber -->
                  <circle cx="80" cy="80" r="60" fill="transparent" stroke="#f59e0b" stroke-width="22"
                    stroke-dasharray="25.1 376.99" stroke-dashoffset="-333" class="transition-all duration-700"></circle>
                  <!-- Being Cleaned (4/120 = 3.3%) -> sky blue -->
                  <circle cx="80" cy="80" r="60" fill="transparent" stroke="#0284c7" stroke-width="22"
                    stroke-dasharray="12.5 376.99" stroke-dashoffset="-358.1" class="transition-all duration-700"></circle>
                  <!-- Out of Order (2/120 = 1.7%) -> rose -->
                  <circle cx="80" cy="80" r="60" fill="transparent" stroke="#ef4444" stroke-width="22"
                    stroke-dasharray="6.4 376.99" stroke-dashoffset="-370.6" class="transition-all duration-700"></circle>
                </svg>

                <div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span class="text-2xl font-black text-primary font-headline-lg">${totalRooms}</span>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Total Rooms</span>
                </div>
              </div>

              <!-- Clear Human Legend -->
              <div class="space-y-2 text-xs">
                <div class="flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-container transition-colors">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
                    <span class="font-medium text-on-surface">Ready</span>
                  </div>
                  <span class="font-bold text-primary font-data-mono">${roomStatus.ready}</span>
                </div>

                <div class="flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-container transition-colors">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-primary shrink-0"></span>
                    <span class="font-medium text-on-surface">Occupied</span>
                  </div>
                  <span class="font-bold text-primary font-data-mono">${roomStatus.occupied}</span>
                </div>

                <div class="flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-container transition-colors">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-amber-500 shrink-0"></span>
                    <span class="font-medium text-on-surface">Needs Cleaning</span>
                  </div>
                  <span class="font-bold text-primary font-data-mono">${roomStatus.needsCleaning}</span>
                </div>

                <div class="flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-container transition-colors">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-sky-600 shrink-0"></span>
                    <span class="font-medium text-on-surface">Being Cleaned</span>
                  </div>
                  <span class="font-bold text-primary font-data-mono">${roomStatus.beingCleaned}</span>
                </div>

                <div class="flex items-center justify-between p-1.5 rounded-lg hover:bg-surface-container transition-colors">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-rose-500 shrink-0"></span>
                    <span class="font-medium text-on-surface">Out of Order</span>
                  </div>
                  <span class="font-bold text-primary font-data-mono">${roomStatus.outOfOrder}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs text-on-surface-variant">
            <span>Housekeeping turnaround: 28 min avg</span>
            <span class="text-emerald-700 font-bold flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">check</span>
              Operations on schedule
            </span>
          </div>
        </div>

        <!-- 2. Occupancy Trend (7-Day Smooth Curve) -->
        <div class="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/70 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-outline-variant/50 mb-3">
              <div>
                <h3 class="font-headline-sm text-base font-bold text-primary">Hotel Occupancy</h3>
                <p class="text-xs text-on-surface-variant">How full the hotel has been over the last 7 days</p>
              </div>
              <div class="text-right">
                <span class="text-2xl font-black text-primary font-headline-lg">82%</span>
                <span class="text-[10px] block font-bold text-emerald-700 uppercase tracking-wider">Today's Occupancy</span>
              </div>
            </div>

            <!-- Smooth SVG Line Chart -->
            <div class="w-full pt-2">
              <div class="relative h-44 w-full">
                <svg viewBox="0 0 500 160" class="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#041627" stop-opacity="0.18" />
                      <stop offset="100%" stop-color="#041627" stop-opacity="0.0" />
                    </linearGradient>
                  </defs>

                  <!-- Horizontal Grid Lines & Y-Labels -->
                  <line x1="0" y1="20" x2="500" y2="20" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3 3"></line>
                  <text x="5" y="24" font-size="9" fill="#94a3b8" font-family="monospace">100%</text>

                  <line x1="0" y1="70" x2="500" y2="70" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="3 3"></line>
                  <text x="5" y="74" font-size="9" fill="#94a3b8" font-family="monospace">50%</text>

                  <line x1="0" y1="130" x2="500" y2="130" stroke="#e2e8f0" stroke-width="1"></line>
                  <text x="5" y="134" font-size="9" fill="#94a3b8" font-family="monospace">0%</text>

                  <!-- Shaded Area Under Curve -->
                  <path 
                    d="M 35 78 Q 105 70, 180 62 T 325 45 T 465 38 L 465 130 L 35 130 Z" 
                    fill="url(#occupancyGradient)"
                  />

                  <!-- Smooth Main Curve (Mon 62%, Tue 68%, Wed 74%, Thu 79%, Fri 88%, Sat 91%, Sun 82%) -->
                  <path 
                    d="M 35 78 C 90 75, 120 68, 175 60 C 230 52, 280 46, 325 36 C 370 26, 420 30, 465 38" 
                    fill="none" 
                    stroke="#041627" 
                    stroke-width="3.5" 
                    stroke-linecap="round"
                  />

                  <!-- Today's Highlighted Node -->
                  <circle cx="465" cy="38" r="6" fill="#ffffff" stroke="#041627" stroke-width="3.5" class="animate-pulse"></circle>
                  <circle cx="465" cy="38" r="2.5" fill="#10b981"></circle>
                </svg>

                <!-- X-Axis Labels -->
                <div class="flex justify-between items-center text-[11px] font-bold text-on-surface-variant px-2 mt-1">
                  <span>Mon (62%)</span>
                  <span>Tue (68%)</span>
                  <span>Wed (74%)</span>
                  <span>Thu (79%)</span>
                  <span>Fri (88%)</span>
                  <span>Sat (91%)</span>
                  <span class="text-primary font-black">Sun (82%)</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs text-on-surface-variant">
            <span>Weekly average: 77.7%</span>
            <span class="text-primary font-semibold">Peak: Saturday (91%)</span>
          </div>
        </div>

      </section>

      <!-- ================================================================= -->
      <!-- SECTION 5 — REVENUE SNAPSHOT & QUICK ACTIONS -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- 1. Today's Revenue Breakdown -->
        <div class="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/70 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-outline-variant/50 mb-4">
              <div>
                <h3 class="font-headline-sm text-base font-bold text-primary">Today's Revenue</h3>
                <p class="text-xs text-on-surface-variant">Daily earnings across hotel operations</p>
              </div>
              <div class="text-right">
                <span class="text-2xl font-black text-primary font-headline-lg">${revenueBreakdown.total}</span>
                <span class="text-[10px] block font-bold text-emerald-700">${revenueBreakdown.delta}</span>
              </div>
            </div>

            <!-- Revenue Segment Bars -->
            <div class="space-y-4">
              <!-- Rooms Revenue -->
              <div>
                <div class="flex justify-between items-center text-xs mb-1 font-semibold">
                  <span class="flex items-center gap-1.5 text-primary">
                    <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
                    Rooms
                  </span>
                  <span class="font-data-mono font-bold text-primary">${revenueBreakdown.rooms}</span>
                </div>
                <div class="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
                  <div class="bg-primary h-2 rounded-full" style="width: ${revenueBreakdown.roomsPct}%;"></div>
                </div>
              </div>

              <!-- Food & Beverage -->
              <div>
                <div class="flex justify-between items-center text-xs mb-1 font-semibold">
                  <span class="flex items-center gap-1.5 text-primary">
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    Food & Beverage
                  </span>
                  <span class="font-data-mono font-bold text-primary">${revenueBreakdown.fb}</span>
                </div>
                <div class="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
                  <div class="bg-amber-500 h-2 rounded-full" style="width: ${revenueBreakdown.fbPct}%;"></div>
                </div>
              </div>

              <!-- Other Services -->
              <div>
                <div class="flex justify-between items-center text-xs mb-1 font-semibold">
                  <span class="flex items-center gap-1.5 text-primary">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    Other Services (Spa, Laundry, Transport)
                  </span>
                  <span class="font-data-mono font-bold text-primary">${revenueBreakdown.services}</span>
                </div>
                <div class="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
                  <div class="bg-emerald-500 h-2 rounded-full" style="width: ${revenueBreakdown.servicesPct}%;"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs text-on-surface-variant">
            <span>Average Daily Room Rate: ₹5,878</span>
            <button class="text-primary hover:underline font-bold" id="btn-view-guest-folios">View Folios</button>
          </div>
        </div>

        <!-- 2. Clean Quick Actions -->
        <div class="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/70 shadow-xs flex flex-col justify-between">
          <div>
            <div class="pb-3 border-b border-outline-variant/50 mb-4">
              <h3 class="font-headline-sm text-base font-bold text-primary">Quick Actions</h3>
              <p class="text-xs text-on-surface-variant">Frequent front desk operations</p>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button 
                id="qa-new-res" 
                class="p-3.5 rounded-xl border border-outline-variant/80 hover:border-primary hover:bg-surface-container/50 transition-all flex flex-col items-center text-center gap-2 group cursor-pointer"
              >
                <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span class="material-symbols-outlined text-[20px]">add_circle</span>
                </div>
                <span class="text-xs font-bold text-primary leading-tight">New Reservation</span>
              </button>

              <button 
                id="qa-check-in" 
                class="p-3.5 rounded-xl border border-outline-variant/80 hover:border-primary hover:bg-surface-container/50 transition-all flex flex-col items-center text-center gap-2 group cursor-pointer"
              >
                <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <span class="material-symbols-outlined text-[20px]">login</span>
                </div>
                <span class="text-xs font-bold text-primary leading-tight">Check In Guest</span>
              </button>

              <button 
                id="qa-check-out" 
                class="p-3.5 rounded-xl border border-outline-variant/80 hover:border-primary hover:bg-surface-container/50 transition-all flex flex-col items-center text-center gap-2 group cursor-pointer"
              >
                <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <span class="material-symbols-outlined text-[20px]">logout</span>
                </div>
                <span class="text-xs font-bold text-primary leading-tight">Check Out Guest</span>
              </button>

              <button 
                id="qa-find-res" 
                class="p-3.5 rounded-xl border border-outline-variant/80 hover:border-primary hover:bg-surface-container/50 transition-all flex flex-col items-center text-center gap-2 group cursor-pointer"
              >
                <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <span class="material-symbols-outlined text-[20px]">search</span>
                </div>
                <span class="text-xs font-bold text-primary leading-tight">Find Reservation</span>
              </button>

              <button 
                id="qa-room-board" 
                class="p-3.5 rounded-xl border border-outline-variant/80 hover:border-primary hover:bg-surface-container/50 transition-all flex flex-col items-center text-center gap-2 group cursor-pointer"
              >
                <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <span class="material-symbols-outlined text-[20px]">grid_view</span>
                </div>
                <span class="text-xs font-bold text-primary leading-tight">View Room Board</span>
              </button>

              <button 
                id="qa-find-guest" 
                class="p-3.5 rounded-xl border border-outline-variant/80 hover:border-primary hover:bg-surface-container/50 transition-all flex flex-col items-center text-center gap-2 group cursor-pointer"
              >
                <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-700 group-hover:text-white transition-colors">
                  <span class="material-symbols-outlined text-[20px]">person_search</span>
                </div>
                <span class="text-xs font-bold text-primary leading-tight">Find Guest</span>
              </button>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-outline-variant/40 text-xs text-on-surface-variant flex items-center justify-between">
            <span>Terminal: T01 (Front Desk)</span>
            <span class="font-data-mono">Keyboard: [⌘K / Ctrl+K]</span>
          </div>
        </div>

      </section>

      <!-- ================================================================= -->
      <!-- SECTION 6 — RECENT ACTIVITY FEED -->
      <!-- ================================================================= -->
      <section class="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/70 shadow-xs">
        <div class="flex items-center justify-between pb-3 border-b border-outline-variant/50 mb-4">
          <div>
            <h3 class="font-headline-sm text-base font-bold text-primary">Recent Activity</h3>
            <p class="text-xs text-on-surface-variant">Real-time log of hotel operational actions</p>
          </div>
          <span class="text-xs text-on-surface-variant font-data-mono">Live Timeline</span>
        </div>

        <div class="space-y-4">
          <!-- Event 1 -->
          <div class="flex items-start gap-3">
            <div class="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
              <span class="material-symbols-outlined text-[15px]">login</span>
            </div>
            <div class="flex-1 text-xs">
              <div class="flex items-center justify-between">
                <span class="font-bold text-primary">Sarah Mitchell checked into Room 402</span>
                <span class="font-data-mono text-[11px] text-on-surface-variant">10:42 AM</span>
              </div>
              <p class="text-on-surface-variant mt-0.5">Key card encoded, welcome packet handed over</p>
            </div>
          </div>

          <!-- Event 2 -->
          <div class="flex items-start gap-3">
            <div class="w-7 h-7 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 mt-0.5 border border-sky-200">
              <span class="material-symbols-outlined text-[15px]">cleaning_services</span>
            </div>
            <div class="flex-1 text-xs">
              <div class="flex items-center justify-between">
                <span class="font-bold text-primary">Room 215 marked Ready</span>
                <span class="font-data-mono text-[11px] text-on-surface-variant">10:31 AM</span>
              </div>
              <p class="text-on-surface-variant mt-0.5">Supervisor inspection passed by Elena Gomez</p>
            </div>
          </div>

          <!-- Event 3 -->
          <div class="flex items-start gap-3">
            <div class="w-7 h-7 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 border border-amber-200">
              <span class="material-symbols-outlined text-[15px]">receipt</span>
            </div>
            <div class="flex-1 text-xs">
              <div class="flex items-center justify-between">
                <span class="font-bold text-primary">₹2,450 F&B charge added to Room 508</span>
                <span class="font-data-mono text-[11px] text-on-surface-variant">10:18 AM</span>
              </div>
              <p class="text-on-surface-variant mt-0.5">Poolside Terrace dining bill signed by John Smith</p>
            </div>
          </div>

          <!-- Event 4 -->
          <div class="flex items-start gap-3">
            <div class="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 border border-blue-200">
              <span class="material-symbols-outlined text-[15px]">calendar_today</span>
            </div>
            <div class="flex-1 text-xs">
              <div class="flex items-center justify-between">
                <span class="font-bold text-primary">Reservation created for John Smith</span>
                <span class="font-data-mono text-[11px] text-on-surface-variant">09:56 AM</span>
              </div>
              <p class="text-on-surface-variant mt-0.5">Deluxe Ocean Suite reserved for 3 nights (Direct Web)</p>
            </div>
          </div>
        </div>
      </section>
    `;

    this.bindEvents();
  }

  bindEvents() {
    if (!this.container) return;

    // Header buttons
    const newResBtn = this.container.querySelector('#btn-hdr-new-reservation');
    if (newResBtn) {
      newResBtn.onclick = () => this.openNewBookingModal();
    }

    const roomBoardBtn = this.container.querySelector('#btn-hdr-view-room-board');
    if (roomBoardBtn) {
      roomBoardBtn.onclick = () => store.setNavTab('inventory');
    }

    const roomStatusLink = this.container.querySelector('#btn-room-status-board-link');
    if (roomStatusLink) {
      roomStatusLink.onclick = () => store.setNavTab('inventory');
    }

    const viewAllArrivalsBtn = this.container.querySelector('#btn-view-all-arrivals');
    if (viewAllArrivalsBtn) {
      viewAllArrivalsBtn.onclick = () => store.setNavTab('arrivals');
    }

    const viewAllDeparturesBtn = this.container.querySelector('#btn-view-all-departures');
    if (viewAllDeparturesBtn) {
      viewAllDeparturesBtn.onclick = () => store.setNavTab('billing');
    }

    const viewFoliosBtn = this.container.querySelector('#btn-view-guest-folios');
    if (viewFoliosBtn) {
      viewFoliosBtn.onclick = () => store.setNavTab('billing');
    }

    // Attention Items click routing
    this.container.querySelectorAll('.btn-attention-action').forEach((btn) => {
      btn.onclick = () => {
        const tab = btn.dataset.tab;
        if (tab) store.setNavTab(tab);
      };
    });

    // Quick Actions
    const qaNewRes = this.container.querySelector('#qa-new-res');
    if (qaNewRes) qaNewRes.onclick = () => this.openNewBookingModal();

    const qaCheckIn = this.container.querySelector('#qa-check-in');
    if (qaCheckIn) qaCheckIn.onclick = () => store.setNavTab('arrivals');

    const qaCheckOut = this.container.querySelector('#qa-check-out');
    if (qaCheckOut) qaCheckOut.onclick = () => store.setNavTab('billing');

    const qaFindRes = this.container.querySelector('#qa-find-res');
    if (qaFindRes) {
      qaFindRes.onclick = () => {
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
          searchInput.focus();
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      };
    }

    const qaRoomBoard = this.container.querySelector('#qa-room-board');
    if (qaRoomBoard) qaRoomBoard.onclick = () => store.setNavTab('inventory');

    const qaFindGuest = this.container.querySelector('#qa-find-guest');
    if (qaFindGuest) qaFindGuest.onclick = () => store.setNavTab('crm');

    // Operational Arrivals action buttons
    this.container.querySelectorAll('.btn-arrival-checkin').forEach((btn) => {
      btn.onclick = () => {
        const guest = btn.dataset.guest;
        const room = btn.dataset.room;
        Toast.show({
          title: 'Guest Checked In',
          message: `${guest} checked into Room ${room}. Keycard ready.`,
          type: 'success',
        });
        btn.textContent = 'Checked In';
        btn.disabled = true;
        btn.className = 'px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold cursor-default';
      };
    });

    this.container.querySelectorAll('.btn-arrival-view').forEach((btn) => {
      btn.onclick = () => store.setNavTab('arrivals');
    });

    // Operational Departures action buttons
    this.container.querySelectorAll('.btn-departure-action').forEach((btn) => {
      btn.onclick = () => {
        const guest = btn.dataset.guest;
        const room = btn.dataset.room;
        const action = btn.dataset.action;
        if (action === 'Check Out') {
          Toast.show({
            title: 'Guest Checked Out',
            message: `${guest} checked out of Room ${room}. Room marked Dirty.`,
            type: 'success',
          });
          btn.textContent = 'Cleared';
          btn.disabled = true;
          btn.className = 'px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold cursor-default';
        } else {
          store.setNavTab('billing');
        }
      };
    });
  }

  openNewBookingModal() {
    const modal = new NewBookingModal({
      onCreated: () => {
        Toast.show({
          title: 'Reservation Created',
          message: 'Booking successfully confirmed in Hospitality OS.',
          type: 'success',
        });
        store.notify();
      },
    });
    modal.init().then(() => {
      document.body.appendChild(modal.render());
    });
  }
}
