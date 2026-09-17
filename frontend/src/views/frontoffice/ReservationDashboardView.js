// ==========================================================================
// VOLVITECH HOSPITALITY OS — FRONT DESK OPERATIONAL COMMAND CENTER
// Primary Landing & Operations Workspace for Hotel Front Desk & Reception
// Connected directly with Arrivals, Departures, Room Board, Folios & Housekeeping
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

    // State for Quick Assign Room Modal
    this.activeAssignGuest = null;

    // Operational Arrivals Preview Dataset (Live Interactive State)
    this.arrivalsList = [
      { id: 'arr-1', name: 'Sarah Mitchell', resCode: 'RES-10482', room: '402', roomType: 'Deluxe King', time: '2:00 PM', ready: true, statusText: 'Room Ready', vip: true, vipTier: 'Gold VIP', checkedIn: false },
      { id: 'arr-2', name: 'Emma Wilson', resCode: 'RES-10485', room: null, roomType: 'Deluxe King', time: '2:30 PM', ready: false, statusText: 'Needs Room', vip: false, vipTier: null, checkedIn: false },
      { id: 'arr-3', name: 'John Smith', resCode: 'RES-10488', room: '215', roomType: 'Executive Suite', time: '3:00 PM', ready: true, statusText: 'Ready', vip: false, vipTier: null, checkedIn: false },
      { id: 'arr-4', name: 'Ambassador Al-Mansoor', resCode: 'RES-10476', room: '303', roomType: 'Deluxe Ocean Suite', time: '1:30 PM', ready: true, statusText: 'Ready', vip: true, vipTier: 'Royal VIP', checkedIn: false },
      { id: 'arr-5', name: 'Elena Rostova', resCode: 'RES-10492', room: '315', roomType: 'Classic King', time: '4:15 PM', ready: true, statusText: 'Ready', vip: false, vipTier: null, checkedIn: false },
    ];

    // Operational Departures Preview Dataset (Live Interactive State)
    this.departuresList = [
      { id: 'dep-1', name: 'John Smith', room: '315', time: '11:30 AM', balance: '₹7,200', billStatus: 'PENDING', billText: 'Payment Pending', checkedOut: false },
      { id: 'dep-2', name: 'David Lee', room: '208', time: '12:00 PM', balance: '₹0', billStatus: 'CLEARED', billText: 'Ready for Checkout', checkedOut: false },
      { id: 'dep-3', name: 'Lady Eleanor Vance', room: '401', time: '12:30 PM', balance: '₹0', billStatus: 'CLEARED', billText: 'Ready for Checkout (Late)', checkedOut: false, isLate: true },
      { id: 'dep-4', name: 'Carlos Ruiz', room: '305', time: '1:00 PM', balance: '₹4,500', billStatus: 'PENDING', billText: 'Payment Pending', checkedOut: false },
      { id: 'dep-5', name: 'Clara Dupont', room: '404', time: '11:30 AM', balance: '₹0', billStatus: 'CLEARED', billText: 'Ready for Checkout', checkedOut: false },
    ];

    // Available clean rooms pool for quick assignment
    this.availableRoomsPool = [
      { roomNumber: '205', floor: '2', type: 'Classic King Room', status: 'Clean' },
      { roomNumber: '206', floor: '2', type: 'Deluxe Ocean Suite', status: 'Inspected' },
      { roomNumber: '304', floor: '3', type: 'Classic King Room', status: 'Inspected' },
      { roomNumber: '406', floor: '4', type: 'Executive Panoramic Suite', status: 'Inspected' },
    ];
  }

  async loadData() {
    this.isLoading = true;
    try {
      const res = await reservationsClient.getDashboardMetrics();
      if (res && res.data) {
        this.apiMetrics = res.data;
      }
    } catch (err) {
      console.warn('[Dashboard load warning - using unified store state]', err);
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

  getFormattedTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  render() {
    const el = document.createElement('div');
    el.className = 'flex flex-col gap-6 animate-fadeIn pb-16 max-w-7xl mx-auto w-full';
    this.container = el;

    this.renderContent();
    return el;
  }

  renderContent() {
    if (!this.container) return;

    const state = store.state;
    const rawUser = state.currentUser || { fullName: 'Julian Croft', roleName: 'Front Desk Agent' };
    const userFirstName = (rawUser.fullName || 'Julian').split(' ')[0];
    const prop = state.currentProperty || { name: 'The Grand Meridian', currency_symbol: '₹' };
    this.currencySymbol = prop.currency_symbol || '₹';

    // ── Primary Operational Numbers (Direct from hotel state) ────────────────
    // ── Primary Operational Numbers (Direct from hotel state) ────────────────
    const liveReservations = state.reservations || [];
    const arrivalsList = liveReservations.filter(r => r.status === 'Confirmed' || r.status === 'ARRIVED');
    const inHouseList = (typeof store.getInHouseGuests === 'function') ? store.getInHouseGuests() : [];
    const pendingServicesCount = (state.serviceRequests || []).filter(s => s.status === 'Pending').length;
    const unassignedCount = liveReservations.filter(r => !r.roomNumber && r.status !== 'Cancelled').length;

    const kpi = {
      arrivals: arrivalsList.length || 24,
      arrivalsCheckedIn: inHouseList.length || 16,
      arrivalsPending: arrivalsList.length || 8,
      departures: 18,
      departuresCleared: 13,
      departuresPending: 5,
      inHouseRooms: inHouseList.length || 86,
      inHouseGuests: inHouseList.length ? inHouseList.length * 2 : 156,
      availableRooms: 32,
      totalRooms: 120,
      occupancyToday: 78,
      occupancyYesterday: 76,
      attentionCount: 9 + (pendingServicesCount > 0 ? 1 : 0),
    };

    // ── Hotel Status / Room Distribution ─────────────────────────────────────
    const roomStatus = {
      available: 32,
      occupied: inHouseList.length || 86,
      dirty: 8,
      cleaning: 12,
      inspected: 4,
      outOfOrder: 2,
    };

    // ── Attention Required Items ─────────────────────────────────────────────
    const attentionItems = [];

    if (pendingServicesCount > 0) {
      attentionItems.push({
        id: 'att-services',
        count: pendingServicesCount,
        title: `${pendingServicesCount} guest service requests pending`,
        desc: 'Front Desk guest requests require immediate action or dispatch.',
        actionText: 'Manage Requests',
        tab: 'services',
        urgency: 'high',
        icon: 'room_service',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      });
    }

    attentionItems.push(
      {
        id: 'att-unassigned',
        count: unassignedCount || 5,
        title: `${unassignedCount || 5} arrivals without rooms`,
        desc: 'Guests arriving today need room assignment.',
        actionText: 'Assign Rooms',
        tab: 'room_assignment',
        urgency: 'high',
        icon: 'meeting_room',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      },
      {
        id: 'att-cleaning',
        count: 2,
        title: '2 rooms waiting for housekeeping',
        desc: 'Rooms required for today\'s arrivals (Rooms 204, 508).',
        actionText: 'View Rooms',
        tab: 'room_status',
        urgency: 'high',
        icon: 'cleaning_services',
        badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      },
      {
        id: 'att-balances',
        count: 2,
        title: '2 departures with pending balance',
        desc: 'Outstanding folios totaling ₹11,700 need settlement.',
        actionText: 'Review Folios',
        tab: 'billing',
        urgency: 'medium',
        icon: 'receipt_long',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      },
      {
        id: 'att-vip',
        count: 1,
        title: '1 VIP arrival requires preparation',
        desc: 'Ambassador Al-Mansoor arriving at 2:00 PM (Room 303).',
        actionText: 'Prepare VIP',
        tab: 'arrivals',
        urgency: 'medium',
        icon: 'stars',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      },
      {
        id: 'att-maint',
        count: 1,
        title: '1 room blocked due to maintenance',
        desc: 'Room 508 out of service (AC valve actuator repair).',
        actionText: 'View Maintenance',
        tab: 'maintenance',
        urgency: 'normal',
        icon: 'build',
        badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
      },
      {
        id: 'att-request',
        count: 1,
        title: '1 guest request is overdue',
        desc: 'Room 303 requested extra feather pillows (15m overdue).',
        actionText: 'View Requests',
        tab: 'housekeeping',
        urgency: 'normal',
        icon: 'room_service',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      }
    );

    // ── Hourly Operational Flow Data (08 AM -> 08 PM) ────────────────────────
    const flowHours = [
      { time: '08 AM', arrivals: 1, departures: 3 },
      { time: '10 AM', arrivals: 2, departures: 7 }, // Peak Check-out
      { time: '12 PM', arrivals: 4, departures: 4 },
      { time: '02 PM', arrivals: 8, departures: 2 }, // Peak Check-in start
      { time: '04 PM', arrivals: 6, departures: 1 },
      { time: '06 PM', arrivals: 2, departures: 1 },
      { time: '08 PM', arrivals: 1, departures: 0 },
    ];

    // ── Live Recent Activity Log ─────────────────────────────────────────────
    const activityEvents = [
      { time: '10:42 AM', title: 'Sarah Mitchell checked in', sub: 'Room 402 • Keycard issued & welcome packet handed over', icon: 'login', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
      { time: '10:38 AM', title: 'Room 215 marked Ready', sub: 'Housekeeping inspection verified by Elena Gomez', icon: 'check_circle', color: 'text-sky-700 bg-sky-50 border-sky-200' },
      { time: '10:31 AM', title: 'Payment posted — ₹4,500', sub: 'John Smith (Room 315) settled via Corporate Visa', icon: 'payments', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
      { time: '10:22 AM', title: 'Room 508 moved to Maintenance', sub: 'Engineering inspecting AC valve actuator (Tariq Mahmoud)', icon: 'engineering', color: 'text-orange-700 bg-orange-50 border-orange-200' },
      { time: '10:15 AM', title: 'New reservation created', sub: 'Emma Wilson • Deluxe King • 2 Nights (Direct Web)', icon: 'add_circle', color: 'text-blue-700 bg-blue-50 border-blue-200' },
      { time: '09:50 AM', title: 'VIP Airport Transfer confirmed', sub: 'Ambassador Al-Mansoor • Audi A8 private dispatch at 1:30 PM', icon: 'local_taxi', color: 'text-purple-700 bg-purple-50 border-purple-200' },
    ];

    // ── Guest & Operational Alerts ───────────────────────────────────────────
    const guestAlerts = [
      { id: 'al-1', type: 'VIP ARRIVAL', name: 'Sarah Mitchell', room: 'Room 402', detail: 'Airport transfer requested • Audi A8 at 1:30 PM', actionText: 'View Guest', tab: 'crm' },
      { id: 'al-2', type: 'LATE CHECKOUT', name: 'Lady Eleanor Vance', room: 'Room 401', detail: 'Complimentary late checkout granted until 2:00 PM', actionText: 'View Folio', tab: 'billing' },
      { id: 'al-3', type: 'SPECIAL PREFERENCE', name: 'Mr. James Harrison', room: 'Room 402', detail: 'Severe Nut Allergy & Hypoallergenic pillows confirmed', actionText: 'Details', tab: 'crm' },
    ];

    this.container.innerHTML = `
      <!-- ================================================================= -->
      <!-- TOP HEADER -->
      <!-- ================================================================= -->
      <section class="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-3 border-b border-outline-variant/60">
        <div>
          <!-- Contextual Breadcrumb & Status Pill -->
          <div class="flex items-center gap-2 mb-1.5 flex-wrap">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">VOLVITECH HOSPITALITY OS</span>
            <span class="text-on-surface-variant font-data-mono text-xs">→</span>
            <span class="text-[10px] font-bold uppercase tracking-wider text-primary font-data-mono">Front Desk</span>
            
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/60 ml-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5 animate-pulse"></span>
              Live Operations Active
            </span>

            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-data-mono font-semibold bg-surface-container text-on-surface-variant border border-outline-variant/60">
              <span class="material-symbols-outlined text-[12px]">schedule</span>
              <span>${this.getFormattedTime()}</span>
            </span>

            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-data-mono text-on-surface-variant border border-outline-variant/60">
              <span class="material-symbols-outlined text-[12px]">apartment</span>
              <span>${prop.name} • 120 Keys</span>
            </span>
          </div>

          <!-- Greeting & Description -->
          <h1 class="font-headline-lg text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            ${this.getGreeting()}, ${userFirstName}
          </h1>
          <p class="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Today, ${this.getFormattedDate()} — Hotel operational summary & frontline action center.
          </p>
        </div>

        <!-- Header Quick Action Buttons -->
        <div class="flex items-center gap-2.5 flex-wrap">
          <button 
            id="btn-hdr-view-room-board"
            class="px-3.5 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-primary font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
            title="Open Interactive Room Board"
          >
            <span class="material-symbols-outlined text-[18px]">grid_view</span>
            <span>Room Board</span>
          </button>

          <button 
            id="btn-hdr-view-room-status"
            class="px-3.5 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-primary font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
            title="Open Room Status Map"
          >
            <span class="material-symbols-outlined text-[18px]">meeting_room</span>
            <span>Room Status</span>
          </button>

          <button 
            id="btn-hdr-new-reservation"
            class="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span class="material-symbols-outlined text-[18px]">add</span>
            <span>+ New Reservation</span>
          </button>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- PRIMARY KPI CARDS (6 CLICKABLE CARDS) -->
      <!-- ================================================================= -->
      <section>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          <!-- Card 1: ARRIVALS -->
          <button 
            class="btn-kpi-card text-left bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/70 shadow-xs hover:border-amber-400 hover:shadow-sm hover:-translate-y-0.5 transition-all flex flex-col justify-between cursor-pointer group"
            data-tab="arrivals"
            title="Click to open Today's Arrivals"
          >
            <div class="flex items-center justify-between mb-2 w-full">
              <span class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps">Arrivals</span>
              <div class="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <span class="material-symbols-outlined text-[16px]">flight_land</span>
              </div>
            </div>
            <div>
              <span class="text-3xl sm:text-4xl font-black text-primary tracking-tight font-headline-lg">${kpi.arrivals}</span>
              <p class="text-xs text-on-surface-variant mt-1 font-medium">Today's expected arrivals</p>
            </div>
            <div class="mt-3 pt-2 border-t border-outline-variant/40 text-[10px] font-bold text-amber-800 flex items-center justify-between w-full">
              <span>${kpi.arrivalsCheckedIn} in • ${kpi.arrivalsPending} pending</span>
              <span class="material-symbols-outlined text-[13px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">arrow_forward</span>
            </div>
          </button>

          <!-- Card 2: DEPARTURES -->
          <button 
            class="btn-kpi-card text-left bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/70 shadow-xs hover:border-purple-400 hover:shadow-sm hover:-translate-y-0.5 transition-all flex flex-col justify-between cursor-pointer group"
            data-tab="departures"
            title="Click to open Today's Departures"
          >
            <div class="flex items-center justify-between mb-2 w-full">
              <span class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps">Departures</span>
              <div class="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <span class="material-symbols-outlined text-[16px]">flight_takeoff</span>
              </div>
            </div>
            <div>
              <span class="text-3xl sm:text-4xl font-black text-primary tracking-tight font-headline-lg">${kpi.departures}</span>
              <p class="text-xs text-on-surface-variant mt-1 font-medium">Today's expected departures</p>
            </div>
            <div class="mt-3 pt-2 border-t border-outline-variant/40 text-[10px] font-bold text-purple-800 flex items-center justify-between w-full">
              <span>${kpi.departuresCleared} cleared • ${kpi.departuresPending} pending</span>
              <span class="material-symbols-outlined text-[13px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">arrow_forward</span>
            </div>
          </button>

          <!-- Card 3: IN-HOUSE -->
          <button 
            class="btn-kpi-card text-left bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/70 shadow-xs hover:border-blue-400 hover:shadow-sm hover:-translate-y-0.5 transition-all flex flex-col justify-between cursor-pointer group"
            data-tab="inhouse"
            title="Click to open In-House Guests list"
          >
            <div class="flex items-center justify-between mb-2 w-full">
              <span class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps">In-House</span>
              <div class="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <span class="material-symbols-outlined text-[16px]">hotel</span>
              </div>
            </div>
            <div>
              <span class="text-3xl sm:text-4xl font-black text-primary tracking-tight font-headline-lg">${kpi.inHouseRooms}</span>
              <p class="text-xs text-on-surface-variant mt-1 font-medium">Current guests staying</p>
            </div>
            <div class="mt-3 pt-2 border-t border-outline-variant/40 text-[10px] font-bold text-blue-800 flex items-center justify-between w-full">
              <span>${kpi.inHouseGuests} total guests</span>
              <span class="material-symbols-outlined text-[13px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">arrow_forward</span>
            </div>
          </button>

          <!-- Card 4: AVAILABLE ROOMS -->
          <button 
            class="btn-kpi-card text-left bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/70 shadow-xs hover:border-emerald-400 hover:shadow-sm hover:-translate-y-0.5 transition-all flex flex-col justify-between cursor-pointer group"
            data-tab="inventory"
            title="Click to open Room Board"
          >
            <div class="flex items-center justify-between mb-2 w-full">
              <span class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps">Available Rooms</span>
              <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <span class="material-symbols-outlined text-[16px]">meeting_room</span>
              </div>
            </div>
            <div>
              <span class="text-3xl sm:text-4xl font-black text-emerald-700 tracking-tight font-headline-lg">${kpi.availableRooms}</span>
              <p class="text-xs text-on-surface-variant mt-1 font-medium">Rooms currently available</p>
            </div>
            <div class="mt-3 pt-2 border-t border-outline-variant/40 text-[10px] font-bold text-emerald-700 flex items-center justify-between w-full">
              <span>Ready for walk-ins</span>
              <span class="material-symbols-outlined text-[13px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">arrow_forward</span>
            </div>
          </button>

          <!-- Card 5: OCCUPANCY -->
          <button 
            class="btn-kpi-card text-left bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/70 shadow-xs hover:border-primary/40 hover:shadow-sm hover:-translate-y-0.5 transition-all flex flex-col justify-between cursor-pointer group"
            data-tab="room_status"
            title="Click to view Room Status"
          >
            <div class="flex items-center justify-between mb-2 w-full">
              <span class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps">Occupancy</span>
              <div class="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                <span class="material-symbols-outlined text-[16px]">donut_large</span>
              </div>
            </div>
            <div>
              <span class="text-3xl sm:text-4xl font-black text-primary tracking-tight font-headline-lg">${kpi.occupancyToday}%</span>
              <p class="text-xs text-on-surface-variant mt-1 font-medium">Today's occupancy</p>
            </div>
            <div class="mt-3 pt-2 border-t border-outline-variant/40 text-[10px] font-bold text-primary flex items-center justify-between w-full">
              <span>${kpi.inHouseRooms} / ${kpi.totalRooms} rooms (+2%)</span>
              <span class="material-symbols-outlined text-[13px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">arrow_forward</span>
            </div>
          </button>

          <!-- Card 6: ATTENTION REQUIRED -->
          <button 
            id="btn-kpi-attention"
            class="text-left bg-surface-container-lowest rounded-2xl p-4 border border-amber-300 bg-amber-50/30 shadow-xs hover:border-amber-500 hover:shadow-sm hover:-translate-y-0.5 transition-all flex flex-col justify-between cursor-pointer group"
            title="Jump to Attention Required items"
          >
            <div class="flex items-center justify-between mb-2 w-full">
              <span class="text-[11px] font-bold uppercase tracking-wider text-amber-900 font-label-caps">Attention</span>
              <div class="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center group-hover:bg-amber-200 transition-colors animate-pulse">
                <span class="material-symbols-outlined text-[16px]">notification_important</span>
              </div>
            </div>
            <div>
              <span class="text-3xl sm:text-4xl font-black text-amber-900 tracking-tight font-headline-lg">${kpi.attentionCount}</span>
              <p class="text-xs text-amber-900/80 mt-1 font-medium">Items requiring action</p>
            </div>
            <div class="mt-3 pt-2 border-t border-amber-200 text-[10px] font-bold text-amber-900 flex items-center justify-between w-full">
              <span>Action required now</span>
              <span class="material-symbols-outlined text-[13px] group-hover:translate-y-0.5 transition-transform">arrow_downward</span>
            </div>
          </button>

        </div>
      </section>

      <!-- ================================================================= -->
      <!-- ATTENTION REQUIRED PANEL (ACTIONABLE OPERATIONAL ITEMS) -->
      <!-- ================================================================= -->
      <section id="section-attention-required" class="bg-surface-container-lowest rounded-2xl p-5 border border-amber-200 shadow-xs">
        <div class="flex items-center justify-between mb-3.5">
          <div class="flex items-center gap-2.5">
            <span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            <div>
              <h2 class="font-headline-sm text-base font-bold text-primary tracking-tight">Attention Required Right Now</h2>
              <p class="text-xs text-on-surface-variant">Prioritized operational items requiring frontline front desk intervention.</p>
            </div>
          </div>
          <span class="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full font-data-mono">
            ${attentionItems.length} active alerts
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          ${attentionItems.map((item) => `
            <div class="p-3.5 rounded-xl border border-outline-variant/80 bg-surface-bright hover:border-amber-400 hover:shadow-xs transition-all flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between gap-2 mb-1.5">
                  <span class="px-2 py-0.5 rounded-md text-[11px] font-bold border ${item.badgeColor} flex items-center gap-1">
                    <span class="material-symbols-outlined text-[13px]">${item.icon}</span>
                    <span>${item.title}</span>
                  </span>
                </div>
                <p class="text-xs text-on-surface-variant font-medium leading-relaxed mt-1">
                  ${item.desc}
                </p>
              </div>
              <div class="mt-3 pt-2.5 border-t border-outline-variant/40 flex items-center justify-between">
                <span class="text-[10px] font-data-mono uppercase tracking-wider text-on-surface-variant">Frontline Action</span>
                <button 
                  class="btn-attention-action px-3 py-1 rounded-lg bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                  data-tab="${item.tab}"
                  data-id="${item.id}"
                >
                  <span>${item.actionText}</span>
                  <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- OPERATIONAL FLOW & OCCUPANCY VISUALIZATION -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- 1. Today's Operational Flow Chart (7 Cols) -->
        <div class="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/70 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-outline-variant/50 mb-3 gap-2">
              <div>
                <h3 class="font-headline-sm text-base font-bold text-primary">Today's Operational Flow</h3>
                <p class="text-xs text-on-surface-variant">Expected guest arrival and departure distribution throughout the day.</p>
              </div>
              
              <!-- Flow Legend -->
              <div class="flex items-center gap-3 text-xs font-semibold">
                <span class="flex items-center gap-1.5 text-primary font-data-mono">
                  <span class="w-3 h-3 rounded bg-primary"></span>
                  <span>Arrivals (24)</span>
                </span>
                <span class="flex items-center gap-1.5 text-purple-700 font-data-mono">
                  <span class="w-3 h-3 rounded bg-purple-500"></span>
                  <span>Departures (18)</span>
                </span>
              </div>
            </div>

            <!-- Flow Bar Chart SVG / Visual Graph -->
            <div class="w-full pt-2">
              <div class="grid grid-cols-7 gap-2 items-end h-40 pb-2 px-1">
                ${flowHours.map((h) => {
                  const arrHeight = Math.max(8, (h.arrivals / 8) * 110);
                  const depHeight = Math.max(8, (h.departures / 8) * 110);

                  return `
                    <div class="flex flex-col items-center h-full justify-end group relative">
                      <!-- Tooltip -->
                      <div class="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-on-primary text-[10px] font-data-mono py-1 px-2 rounded pointer-events-none shadow-md whitespace-nowrap z-10">
                        ${h.time}: ${h.arrivals} Arr / ${h.departures} Dep
                      </div>

                      <!-- Side-by-side Dual Bars -->
                      <div class="flex items-end gap-1.5 w-full justify-center">
                        <!-- Arrivals Bar -->
                        <div 
                          class="w-3.5 sm:w-4.5 rounded-t bg-primary group-hover:bg-primary/80 transition-all flex items-center justify-center relative"
                          style="height: ${arrHeight}px;"
                          title="${h.arrivals} arrivals at ${h.time}"
                        >
                          ${h.arrivals > 0 ? `<span class="text-[9px] font-data-mono text-on-primary font-bold -mt-1">${h.arrivals}</span>` : ''}
                        </div>

                        <!-- Departures Bar -->
                        <div 
                          class="w-3.5 sm:w-4.5 rounded-t bg-purple-500 group-hover:bg-purple-600 transition-all flex items-center justify-center relative"
                          style="height: ${depHeight}px;"
                          title="${h.departures} departures at ${h.time}"
                        >
                          ${h.departures > 0 ? `<span class="text-[9px] font-data-mono text-white font-bold -mt-1">${h.departures}</span>` : ''}
                        </div>
                      </div>

                      <!-- X-Axis Label -->
                      <span class="text-[10px] font-data-mono font-bold text-on-surface-variant mt-2">
                        ${h.time}
                      </span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- Bottom Summary Notes -->
          <div class="mt-4 pt-3 border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span class="inline-flex items-center gap-1 font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-[11px]">
              <span class="material-symbols-outlined text-[13px]">trending_up</span>
              <span>Peak Check-in: 2:00 PM – 4:00 PM (14 guests)</span>
            </span>
            <span class="inline-flex items-center gap-1 font-bold text-purple-900 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md text-[11px]">
              <span class="material-symbols-outlined text-[13px]">trending_down</span>
              <span>Peak Check-out: 10:00 AM – 12:00 PM (11 guests)</span>
            </span>
          </div>
        </div>

        <!-- 2. Occupancy Visualization (5 Cols) -->
        <div class="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/70 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-outline-variant/50 mb-3">
              <div>
                <h3 class="font-headline-sm text-base font-bold text-primary">Hotel Occupancy</h3>
                <p class="text-xs text-on-surface-variant">Live room allocation & daily occupancy comparison.</p>
              </div>
              <div class="text-right">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  <span class="material-symbols-outlined text-[12px]">arrow_upward</span>
                  <span>+2.0% vs yesterday</span>
                </span>
              </div>
            </div>

            <!-- Gauge & Breakdown -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center py-2">
              
              <!-- Circular Progress Ring SVG -->
              <div class="flex items-center justify-center relative py-1">
                <svg viewBox="0 0 140 140" class="w-36 h-36 transform -rotate-90">
                  <!-- Background Track -->
                  <circle cx="70" cy="70" r="54" fill="transparent" stroke="#e2e8f0" stroke-width="14"></circle>
                  <!-- Value Circle (78% of 339.29 = 264.6) -->
                  <circle 
                    cx="70" cy="70" r="54" fill="transparent" 
                    stroke="#041627" stroke-width="14" 
                    stroke-dasharray="264.6 339.29" stroke-dashoffset="0"
                    stroke-linecap="round"
                    class="transition-all duration-1000"
                  ></circle>
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span class="text-2xl sm:text-3xl font-black text-primary font-headline-lg leading-none">78%</span>
                  <span class="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant mt-1">Today's Occupancy</span>
                </div>
              </div>

              <!-- Key Occupancy Figures -->
              <div class="space-y-2 text-xs">
                <div class="flex items-center justify-between p-2 rounded-xl bg-surface-bright border border-outline-variant/50">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
                    <span class="font-medium text-on-surface">Occupied</span>
                  </div>
                  <span class="font-bold text-primary font-data-mono">86 rooms</span>
                </div>

                <div class="flex items-center justify-between p-2 rounded-xl bg-surface-bright border border-outline-variant/50">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span class="font-medium text-on-surface">Available</span>
                  </div>
                  <span class="font-bold text-emerald-700 font-data-mono">32 rooms</span>
                </div>

                <div class="flex items-center justify-between p-2 rounded-xl bg-surface-bright border border-outline-variant/50">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span class="font-medium text-on-surface">Out of Order</span>
                  </div>
                  <span class="font-bold text-rose-700 font-data-mono">2 rooms</span>
                </div>
              </div>

            </div>
          </div>

          <!-- Bottom Benchmark -->
          <div class="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs text-on-surface-variant">
            <span>Yesterday: <strong class="text-primary font-data-mono">76%</strong></span>
            <span>Projected Night: <strong class="text-emerald-700 font-data-mono">85%</strong></span>
          </div>
        </div>

      </section>

      <!-- ================================================================= -->
      <!-- HOTEL STATUS / ROOM STATUS (6 COMPACT STATUS CARDS) -->
      <!-- ================================================================= -->
      <section class="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/70 shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-outline-variant/50 mb-3.5 gap-2">
          <div>
            <h3 class="font-headline-sm text-base font-bold text-primary">Hotel Room Status</h3>
            <p class="text-xs text-on-surface-variant">Live physical distribution across all 120 hotel rooms. Click any state to open the Room Board.</p>
          </div>
          <button 
            id="btn-room-status-full-board"
            class="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Open Interactive Room Board</span>
            <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        <!-- 6 Simple Status Clickable Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <!-- Status 1: AVAILABLE -->
          <button 
            class="btn-room-status-card text-left p-3 rounded-xl border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-400 transition-all cursor-pointer group"
            data-filter="AVAILABLE"
            data-tab="inventory"
            title="Filter Room Board by Available"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-800 font-label-caps">Available</span>
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div class="text-2xl font-black text-emerald-800 font-headline-lg">${roomStatus.available}</div>
            <p class="text-[10px] text-emerald-700/90 font-medium mt-0.5">Vacant & ready</p>
          </button>

          <!-- Status 2: OCCUPIED -->
          <button 
            class="btn-room-status-card text-left p-3 rounded-xl border border-slate-300 bg-slate-50/70 hover:bg-slate-100 hover:border-primary transition-all cursor-pointer group"
            data-filter="OCCUPIED"
            data-tab="inhouse"
            title="Open In-House Guests"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] font-bold uppercase tracking-wider text-primary font-label-caps">Occupied</span>
              <span class="w-2 h-2 rounded-full bg-primary"></span>
            </div>
            <div class="text-2xl font-black text-primary font-headline-lg">${roomStatus.occupied}</div>
            <p class="text-[10px] text-on-surface-variant font-medium mt-0.5">Guest in room</p>
          </button>

          <!-- Status 3: DIRTY -->
          <button 
            class="btn-room-status-card text-left p-3 rounded-xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-400 transition-all cursor-pointer group"
            data-filter="DIRTY"
            data-tab="housekeeping"
            title="Filter Housekeeping by Dirty"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] font-bold uppercase tracking-wider text-amber-900 font-label-caps">Dirty</span>
              <span class="w-2 h-2 rounded-full bg-amber-500"></span>
            </div>
            <div class="text-2xl font-black text-amber-900 font-headline-lg">${roomStatus.dirty}</div>
            <p class="text-[10px] text-amber-800 font-medium mt-0.5">Needs turnover</p>
          </button>

          <!-- Status 4: CLEANING -->
          <button 
            class="btn-room-status-card text-left p-3 rounded-xl border border-sky-200 bg-sky-50/40 hover:bg-sky-50 hover:border-sky-400 transition-all cursor-pointer group"
            data-filter="CLEANING"
            data-tab="housekeeping"
            title="Filter Housekeeping by In-Progress"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] font-bold uppercase tracking-wider text-sky-900 font-label-caps">Cleaning</span>
              <span class="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            </div>
            <div class="text-2xl font-black text-sky-900 font-headline-lg">${roomStatus.cleaning}</div>
            <p class="text-[10px] text-sky-800 font-medium mt-0.5">Housekeeper inside</p>
          </button>

          <!-- Status 5: INSPECTED -->
          <button 
            class="btn-room-status-card text-left p-3 rounded-xl border border-teal-200 bg-teal-50/40 hover:bg-teal-50 hover:border-teal-400 transition-all cursor-pointer group"
            data-filter="INSPECTED"
            data-tab="inventory"
            title="Filter Room Board by Inspected"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] font-bold uppercase tracking-wider text-teal-900 font-label-caps">Inspected</span>
              <span class="w-2 h-2 rounded-full bg-teal-500"></span>
            </div>
            <div class="text-2xl font-black text-teal-900 font-headline-lg">${roomStatus.inspected}</div>
            <p class="text-[10px] text-teal-800 font-medium mt-0.5">Supervisor verified</p>
          </button>

          <!-- Status 6: OUT OF ORDER -->
          <button 
            class="btn-room-status-card text-left p-3 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 hover:border-rose-400 transition-all cursor-pointer group"
            data-filter="OUT_OF_ORDER"
            data-tab="maintenance"
            title="Open Maintenance Workspace"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] font-bold uppercase tracking-wider text-rose-900 font-label-caps">Out of Order</span>
              <span class="w-2 h-2 rounded-full bg-rose-500"></span>
            </div>
            <div class="text-2xl font-black text-rose-900 font-headline-lg">${roomStatus.outOfOrder}</div>
            <p class="text-[10px] text-rose-800 font-medium mt-0.5">Maintenance repair</p>
          </button>

        </div>

        <!-- Visual Segmented Bar -->
        <div class="mt-4 pt-3 border-t border-outline-variant/40">
          <div class="w-full bg-surface-container rounded-full h-2 flex overflow-hidden">
            <div class="bg-primary h-2" style="width: 71.6%;" title="Occupied (86)"></div>
            <div class="bg-emerald-500 h-2" style="width: 26.6%;" title="Available (32)"></div>
            <div class="bg-rose-500 h-2" style="width: 1.8%;" title="Out of Order (2)"></div>
          </div>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- OPERATIONAL LISTS: TODAY'S ARRIVALS & TODAY'S DEPARTURES -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- PANEL A: TODAY'S ARRIVALS -->
        <div class="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/70 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-outline-variant/50 mb-3">
              <div>
                <h3 class="font-headline-sm text-base font-bold text-primary">Today's Arrivals</h3>
                <p class="text-xs text-on-surface-variant">Frontline queue of guests arriving today.</p>
              </div>
              <span class="text-xs font-bold text-primary bg-surface-container px-2.5 py-1 rounded-lg font-data-mono">
                ${this.arrivalsList.length} shown of 24
              </span>
            </div>

            <!-- List Rows -->
            <div class="divide-y divide-outline-variant/40">
              ${this.arrivalsList.map((arr) => {
                return `
                  <div class="py-3 flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3 min-w-0">
                      <!-- Room Monogram Badge -->
                      <div class="w-10 h-10 rounded-xl ${arr.room ? 'bg-surface-container text-primary' : 'bg-amber-100 text-amber-900 border border-amber-300'} font-bold text-xs flex items-center justify-center font-data-mono shrink-0">
                        ${arr.room ? `R${arr.room}` : 'UNAS'}
                      </div>

                      <!-- Guest Info -->
                      <div class="truncate">
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-bold text-primary truncate">${arr.name}</span>
                          ${arr.vip ? `<span class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">${arr.vipTier || 'VIP'}</span>` : ''}
                        </div>
                        <div class="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5 flex-wrap">
                          <span class="flex items-center gap-1 font-data-mono text-[11px]">
                            <span class="material-symbols-outlined text-[13px]">schedule</span>
                            ${arr.time}
                          </span>
                          <span>•</span>
                          <span class="font-medium">${arr.room ? `Room ${arr.room}` : '<strong class="text-amber-800">Room Unassigned</strong>'}</span>
                          <span>•</span>
                          <span class="text-on-surface-variant/80">${arr.roomType}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Status & Quick Action -->
                    <div class="flex items-center gap-2 shrink-0">
                      ${arr.checkedIn 
                        ? `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                             <span class="material-symbols-outlined text-[13px]">check</span>
                             Checked In
                           </span>`
                        : arr.room && arr.ready 
                        ? `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 hidden sm:inline-flex items-center gap-1">
                             <span class="material-symbols-outlined text-[13px]">check</span>
                             ${arr.statusText}
                           </span>
                           <button 
                             class="btn-arrival-checkin px-3 py-1 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                             data-id="${arr.id}"
                             data-guest="${arr.name}"
                             data-room="${arr.room}"
                           >
                             Check In
                           </button>`
                        : `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/60 hidden sm:inline-flex items-center gap-1">
                             <span class="material-symbols-outlined text-[13px]">warning</span>
                             ${arr.statusText}
                           </span>
                           <button 
                             class="btn-arrival-assign px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                             data-id="${arr.id}"
                             data-guest="${arr.name}"
                             data-type="${arr.roomType}"
                           >
                             Assign Room
                           </button>`
                      }
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Bottom View All Link -->
          <div class="pt-4 mt-2 border-t border-outline-variant/50">
            <button 
              id="btn-view-all-arrivals"
              class="w-full py-2.5 rounded-xl text-center text-xs font-bold text-primary hover:bg-surface-container transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>VIEW ALL ARRIVALS (24)</span>
              <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        <!-- PANEL B: TODAY'S DEPARTURES -->
        <div class="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/70 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-outline-variant/50 mb-3">
              <div>
                <h3 class="font-headline-sm text-base font-bold text-primary">Today's Departures</h3>
                <p class="text-xs text-on-surface-variant">Guests scheduled for checkout today & folio status.</p>
              </div>
              <span class="text-xs font-bold text-primary bg-surface-container px-2.5 py-1 rounded-lg font-data-mono">
                ${this.departuresList.length} shown of 18
              </span>
            </div>

            <!-- List Rows -->
            <div class="divide-y divide-outline-variant/40">
              ${this.departuresList.map((dep) => {
                const isCleared = dep.billStatus === 'CLEARED';
                return `
                  <div class="py-3 flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3 min-w-0">
                      <!-- Room Monogram Badge -->
                      <div class="w-10 h-10 rounded-xl bg-surface-container text-primary font-bold text-xs flex items-center justify-center font-data-mono shrink-0">
                        R${dep.room}
                      </div>

                      <!-- Guest Info -->
                      <div class="truncate">
                        <div class="flex items-center gap-2">
                          <span class="text-sm font-bold text-primary truncate">${dep.name}</span>
                          ${dep.isLate ? `<span class="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Late Out</span>` : ''}
                        </div>
                        <div class="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5">
                          <span class="flex items-center gap-1 font-data-mono text-[11px]">
                            <span class="material-symbols-outlined text-[13px]">schedule</span>
                            ${dep.time}
                          </span>
                          <span>•</span>
                          <span>Room ${dep.room}</span>
                          <span>•</span>
                          <span class="font-data-mono ${isCleared ? 'text-emerald-700' : 'text-rose-700 font-bold'}">${dep.balance}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Status & Quick Action -->
                    <div class="flex items-center gap-2 shrink-0">
                      ${dep.checkedOut 
                        ? `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                             <span class="material-symbols-outlined text-[13px]">task_alt</span>
                             Checked Out
                           </span>`
                        : isCleared 
                        ? `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 hidden sm:inline-flex items-center gap-1">
                             <span class="material-symbols-outlined text-[13px]">check</span>
                             Ready
                           </span>
                           <button 
                             class="btn-departure-checkout px-3 py-1 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                             data-id="${dep.id}"
                             data-guest="${dep.name}"
                             data-room="${dep.room}"
                           >
                             Check Out
                           </button>`
                        : `<span class="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/60 hidden sm:inline-flex items-center gap-1">
                             <span class="material-symbols-outlined text-[13px]">receipt</span>
                             Due
                           </span>
                           <button 
                             class="btn-departure-folio px-3 py-1 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all cursor-pointer"
                             data-guest="${dep.name}"
                             data-room="${dep.room}"
                           >
                             View Folio
                           </button>`
                      }
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Bottom View All Link -->
          <div class="pt-4 mt-2 border-t border-outline-variant/50">
            <button 
              id="btn-view-all-departures"
              class="w-full py-2.5 rounded-xl text-center text-xs font-bold text-primary hover:bg-surface-container transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>VIEW ALL DEPARTURES (18)</span>
              <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

      </section>

      <!-- ================================================================= -->
      <!-- QUICK ACTIONS, GUEST ALERTS & LIVE ACTIVITY -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Left 6 Cols: Quick Actions & Operational Alerts -->
        <div class="lg:col-span-6 flex flex-col gap-6">
          
          <!-- 1. Quick Actions -->
          <div class="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/70 shadow-xs">
            <div class="pb-3 border-b border-outline-variant/50 mb-3.5">
              <h3 class="font-headline-sm text-base font-bold text-primary">Quick Actions</h3>
              <p class="text-xs text-on-surface-variant">Instant one-click hotel front desk operations.</p>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <button 
                id="qa-new-res" 
                class="p-3 rounded-xl border border-outline-variant/80 hover:border-primary hover:bg-surface-container/50 transition-all flex flex-col items-center text-center gap-1.5 group cursor-pointer"
              >
                <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span class="material-symbols-outlined text-[19px]">add_circle</span>
                </div>
                <span class="text-xs font-bold text-primary leading-tight">+ New Reservation</span>
              </button>

              <button 
                id="qa-check-in" 
                class="p-3 rounded-xl border border-outline-variant/80 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all flex flex-col items-center text-center gap-1.5 group cursor-pointer"
              >
                <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <span class="material-symbols-outlined text-[19px]">login</span>
                </div>
                <span class="text-xs font-bold text-primary leading-tight">Check In Guest</span>
              </button>

              <button 
                id="qa-check-out" 
                class="p-3 rounded-xl border border-outline-variant/80 hover:border-purple-500 hover:bg-purple-50/40 transition-all flex flex-col items-center text-center gap-1.5 group cursor-pointer"
              >
                <div class="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <span class="material-symbols-outlined text-[19px]">logout</span>
                </div>
                <span class="text-xs font-bold text-primary leading-tight">Check Out Guest</span>
              </button>

              <button 
                id="qa-assign-room" 
                class="p-3 rounded-xl border border-outline-variant/80 hover:border-amber-500 hover:bg-amber-50/40 transition-all flex flex-col items-center text-center gap-1.5 group cursor-pointer"
              >
                <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <span class="material-symbols-outlined text-[19px]">meeting_room</span>
                </div>
                <span class="text-xs font-bold text-primary leading-tight">Assign Room</span>
              </button>

              <button 
                id="qa-find-guest" 
                class="p-3 rounded-xl border border-outline-variant/80 hover:border-blue-500 hover:bg-blue-50/40 transition-all flex flex-col items-center text-center gap-1.5 group cursor-pointer"
              >
                <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <span class="material-symbols-outlined text-[19px]">person_search</span>
                </div>
                <span class="text-xs font-bold text-primary leading-tight">Find Guest</span>
              </button>

              <button 
                id="qa-open-folio" 
                class="p-3 rounded-xl border border-outline-variant/80 hover:border-teal-500 hover:bg-teal-50/40 transition-all flex flex-col items-center text-center gap-1.5 group cursor-pointer"
              >
                <div class="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <span class="material-symbols-outlined text-[19px]">receipt_long</span>
                </div>
                <span class="text-xs font-bold text-primary leading-tight">Open Folio</span>
              </button>
            </div>
          </div>

          <!-- 2. Guest / Operational Alerts -->
          <div class="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/70 shadow-xs">
            <div class="pb-3 border-b border-outline-variant/50 mb-3.5">
              <h3 class="font-headline-sm text-base font-bold text-primary">Guest & Stay Alerts</h3>
              <p class="text-xs text-on-surface-variant">VIP protocols, transfer dispatches & personalized stay preferences.</p>
            </div>

            <div class="space-y-2.5">
              ${guestAlerts.map((al) => `
                <div class="p-3 rounded-xl bg-surface-bright border border-outline-variant/60 flex items-center justify-between gap-3">
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase font-data-mono ${al.type === 'VIP ARRIVAL' ? 'bg-purple-100 text-purple-800' : al.type === 'LATE CHECKOUT' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-900'}">
                        ${al.type}
                      </span>
                      <span class="text-xs font-bold text-primary truncate">${al.name} • ${al.room}</span>
                    </div>
                    <p class="text-[11px] text-on-surface-variant mt-0.5 truncate">
                      ${al.detail}
                    </p>
                  </div>
                  <button 
                    class="btn-alert-action px-2.5 py-1 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary shrink-0 cursor-pointer"
                    data-tab="${al.tab}"
                  >
                    ${al.actionText}
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- Right 6 Cols: Live Activity Feed -->
        <div class="lg:col-span-6 bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/70 shadow-xs flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between pb-3 border-b border-outline-variant/50 mb-4">
              <div>
                <h3 class="font-headline-sm text-base font-bold text-primary">Live Front Desk Activity</h3>
                <p class="text-xs text-on-surface-variant">Real-time telemetry log of hotel operations.</p>
              </div>
              <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70 flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Feed</span>
              </span>
            </div>

            <div class="space-y-3.5">
              ${activityEvents.map((evt) => `
                <div class="flex items-start gap-3 p-2 rounded-xl hover:bg-surface-bright transition-colors">
                  <div class="w-7 h-7 rounded-lg border ${evt.color} flex items-center justify-center shrink-0 mt-0.5">
                    <span class="material-symbols-outlined text-[15px]">${evt.icon}</span>
                  </div>
                  <div class="flex-1 min-w-0 text-xs">
                    <div class="flex items-center justify-between gap-2">
                      <span class="font-bold text-primary truncate">${evt.title}</span>
                      <span class="font-data-mono text-[10px] text-on-surface-variant shrink-0">${evt.time}</span>
                    </div>
                    <p class="text-on-surface-variant text-[11px] mt-0.5 truncate">${evt.sub}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between text-[11px] text-on-surface-variant">
            <span>Unified HMS audit trail active</span>
            <span class="font-data-mono">Terminal: FD-01</span>
          </div>
        </div>

      </section>

      <!-- ================================================================= -->
      <!-- MODAL: QUICK ROOM ASSIGNMENT MODAL -->
      <!-- ================================================================= -->
      ${this.activeAssignGuest ? this._renderAssignModal() : ''}
    `;

    this.bindEvents();
  }

  _renderAssignModal() {
    const g = this.activeAssignGuest;
    return `
      <div id="modal-quick-assign-backdrop" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl p-6 max-w-lg w-full border border-outline-variant shadow-2xl animate-scaleUp">
          
          <div class="flex items-center justify-between pb-3 border-b border-outline-variant mb-4">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <span class="material-symbols-outlined text-[18px]">meeting_room</span>
              </div>
              <div>
                <h3 class="font-headline-sm text-base font-bold text-primary">Assign Room to Guest</h3>
                <p class="text-xs text-on-surface-variant">${g.name} • ${g.resCode || 'Reservation'}</p>
              </div>
            </div>
            <button id="btn-close-assign-modal" class="text-on-surface-variant hover:text-primary p-1 rounded-lg hover:bg-surface-container">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="bg-surface-bright rounded-xl p-3 border border-outline-variant/60 mb-4 text-xs">
            <div class="flex justify-between py-0.5">
              <span class="text-on-surface-variant">Guest Name:</span>
              <span class="font-bold text-primary">${g.name}</span>
            </div>
            <div class="flex justify-between py-0.5">
              <span class="text-on-surface-variant">Room Category:</span>
              <span class="font-bold text-primary">${g.roomType || 'Deluxe King'}</span>
            </div>
            <div class="flex justify-between py-0.5">
              <span class="text-on-surface-variant">Arrival Time:</span>
              <span class="font-bold text-primary">${g.time || '2:30 PM'}</span>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
              Select Available Clean Room
            </label>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              ${this.availableRoomsPool.map((rm, idx) => `
                <label class="flex items-center justify-between p-3 rounded-xl border border-outline-variant hover:border-primary cursor-pointer hover:bg-surface-bright transition-all">
                  <div class="flex items-center gap-3">
                    <input type="radio" name="quick_assign_room" value="${rm.roomNumber}" ${idx === 0 ? 'checked' : ''} class="text-primary focus:ring-primary">
                    <div>
                      <div class="font-bold text-sm text-primary">Room ${rm.roomNumber}</div>
                      <div class="text-[11px] text-on-surface-variant">Floor ${rm.floor} • ${rm.type}</div>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    ${rm.status}
                  </span>
                </label>
              `).join('')}
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant">
            <button id="btn-cancel-assign" class="px-4 py-2 rounded-xl border border-outline-variant text-xs font-bold text-primary hover:bg-surface-container">
              Cancel
            </button>
            <button id="btn-confirm-assign" class="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 shadow-sm">
              Confirm Assignment
            </button>
          </div>

        </div>
      </div>
    `;
  }

  bindEvents() {
    if (!this.container) return;

    // Header buttons
    const newResBtn = this.container.querySelector('#btn-hdr-new-reservation');
    if (newResBtn) newResBtn.onclick = () => this.openNewBookingModal();

    const roomBoardBtn = this.container.querySelector('#btn-hdr-view-room-board');
    if (roomBoardBtn) roomBoardBtn.onclick = () => store.setNavTab('inventory');

    const roomStatusBtn = this.container.querySelector('#btn-hdr-view-room-status');
    if (roomStatusBtn) roomStatusBtn.onclick = () => store.setNavTab('room_status');

    const roomStatusFullBoard = this.container.querySelector('#btn-room-status-full-board');
    if (roomStatusFullBoard) roomStatusFullBoard.onclick = () => store.setNavTab('inventory');

    // KPI Cards click routing
    this.container.querySelectorAll('.btn-kpi-card').forEach((card) => {
      card.onclick = () => {
        const tab = card.dataset.tab;
        if (tab) store.setNavTab(tab);
      };
    });

    const kpiAttention = this.container.querySelector('#btn-kpi-attention');
    if (kpiAttention) {
      kpiAttention.onclick = () => {
        const section = document.getElementById('section-attention-required');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
    }

    // Attention Items click routing
    this.container.querySelectorAll('.btn-attention-action').forEach((btn) => {
      btn.onclick = () => {
        const tab = btn.dataset.tab;
        const id = btn.dataset.id;
        if (id === 'att-unassigned') {
          // Open quick assignment modal for unassigned arrival Emma Wilson
          const unassigned = this.arrivalsList.find(a => !a.room) || this.arrivalsList[1];
          if (unassigned) {
            this.activeAssignGuest = unassigned;
            this.renderContent();
            return;
          }
        }
        if (tab) store.setNavTab(tab);
      };
    });

    // Room Status Cards click routing
    this.container.querySelectorAll('.btn-room-status-card').forEach((card) => {
      card.onclick = () => {
        const tab = card.dataset.tab || 'inventory';
        store.setNavTab(tab);
      };
    });

    // View All Arrivals / Departures links
    const viewAllArrivals = this.container.querySelector('#btn-view-all-arrivals');
    if (viewAllArrivals) viewAllArrivals.onclick = () => store.setNavTab('arrivals');

    const viewAllDepartures = this.container.querySelector('#btn-view-all-departures');
    if (viewAllDepartures) viewAllDepartures.onclick = () => store.setNavTab('departures');

    // Quick Actions grid buttons
    const qaNewRes = this.container.querySelector('#qa-new-res');
    if (qaNewRes) qaNewRes.onclick = () => this.openNewBookingModal();

    const qaCheckIn = this.container.querySelector('#qa-check-in');
    if (qaCheckIn) qaCheckIn.onclick = () => store.setNavTab('arrivals');

    const qaCheckOut = this.container.querySelector('#qa-check-out');
    if (qaCheckOut) qaCheckOut.onclick = () => store.setNavTab('departures');

    const qaAssignRoom = this.container.querySelector('#qa-assign-room');
    if (qaAssignRoom) {
      qaAssignRoom.onclick = () => {
        const unassigned = this.arrivalsList.find(a => !a.room) || this.arrivalsList[1];
        if (unassigned) {
          this.activeAssignGuest = unassigned;
          this.renderContent();
        } else {
          store.setNavTab('inventory');
        }
      };
    }

    const qaFindGuest = this.container.querySelector('#qa-find-guest');
    if (qaFindGuest) qaFindGuest.onclick = () => store.setNavTab('crm');

    const qaOpenFolio = this.container.querySelector('#qa-open-folio');
    if (qaOpenFolio) qaOpenFolio.onclick = () => store.setNavTab('billing');

    // Alert action buttons
    this.container.querySelectorAll('.btn-alert-action').forEach((btn) => {
      btn.onclick = () => {
        const tab = btn.dataset.tab;
        if (tab) store.setNavTab(tab);
      };
    });

    // Arrivals Row Actions
    this.container.querySelectorAll('.btn-arrival-checkin').forEach((btn) => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        const guest = btn.dataset.guest;
        const room = btn.dataset.room;
        const item = this.arrivalsList.find(a => a.id === id);
        if (item) {
          item.checkedIn = true;
          Toast.show({
            title: 'Guest Checked In',
            message: `${guest} checked into Room ${room}. Keycard encoded.`,
            type: 'success',
          });
          this.renderContent();
        }
      };
    });

    this.container.querySelectorAll('.btn-arrival-assign').forEach((btn) => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        const item = this.arrivalsList.find(a => a.id === id);
        if (item) {
          this.activeAssignGuest = item;
          this.renderContent();
        }
      };
    });

    // Departures Row Actions
    this.container.querySelectorAll('.btn-departure-checkout').forEach((btn) => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        const guest = btn.dataset.guest;
        const room = btn.dataset.room;
        const item = this.departuresList.find(d => d.id === id);
        if (item) {
          item.checkedOut = true;
          Toast.show({
            title: 'Guest Checked Out',
            message: `${guest} checked out of Room ${room}. Room marked Dirty for Housekeeping turnover.`,
            type: 'success',
          });
          this.renderContent();
        }
      };
    });

    this.container.querySelectorAll('.btn-departure-folio').forEach((btn) => {
      btn.onclick = () => store.setNavTab('billing');
    });

    // Quick Assignment Modal events
    const closeAssignBtn = this.container.querySelector('#btn-close-assign-modal');
    if (closeAssignBtn) {
      closeAssignBtn.onclick = () => {
        this.activeAssignGuest = null;
        this.renderContent();
      };
    }

    const cancelAssignBtn = this.container.querySelector('#btn-cancel-assign');
    if (cancelAssignBtn) {
      cancelAssignBtn.onclick = () => {
        this.activeAssignGuest = null;
        this.renderContent();
      };
    }

    const confirmAssignBtn = this.container.querySelector('#btn-confirm-assign');
    if (confirmAssignBtn) {
      confirmAssignBtn.onclick = () => {
        const selectedRadio = this.container.querySelector('input[name="quick_assign_room"]:checked');
        const selectedRoom = selectedRadio ? selectedRadio.value : '205';
        if (this.activeAssignGuest) {
          this.activeAssignGuest.room = selectedRoom;
          this.activeAssignGuest.ready = true;
          this.activeAssignGuest.statusText = 'Room Ready';
          Toast.show({
            title: 'Room Assigned',
            message: `Room ${selectedRoom} assigned to ${this.activeAssignGuest.name}.`,
            type: 'success',
          });
          this.activeAssignGuest = null;
          this.renderContent();
        }
      };
    }
  }

  openNewBookingModal() {
    const modal = new NewBookingModal({
      onCreated: () => {
        Toast.show({
          title: 'Reservation Created',
          message: 'Booking successfully confirmed in Volvitech OS.',
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
