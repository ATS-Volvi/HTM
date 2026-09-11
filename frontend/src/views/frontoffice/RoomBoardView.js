// ==========================================================================
// VOLVITECH HOSPITALITY OS — ROOM BOARD OPERATIONAL WORKSPACE
// Live Operational Command Board: Room + Guest + Arrival + Departure + Turnover
// ==========================================================================

import { store } from '../../state/store.js';
import { Toast } from '../../components/Toast.js';
import { reservationsClient } from '../../api/reservationsClient.js';

export class RoomBoardView {
  constructor() {
    this.container = null;
    this.isLoading = false;
    this.searchQuery = '';
    this.activeQuickFilter = 'ALL'; // 'ALL', 'ARRIVALS', 'IN_HOUSE', 'DEPARTURES', 'READY', 'NEEDS_CLEANING', 'MAINTENANCE'

    // Operational Controls Context
    this.selectedDateLabel = 'Today';
    this.selectedFloor = '4'; // Floor 4 default (Front Office standard) or 'ALL'
    this.selectedRoomType = 'ALL';
    this.lastUpdated = 'Just now';

    // Active Drawer & Workflow Modals
    this.activeDetailRoom = null;
    this.activeResolveAttention = null;
    this.activeAssignRoom = null;
    this.activeChangeRoom = null;
    this.activeMaintenanceIssue = null;
    this.activeUpdateStatusRoom = null;
    this.activeArrivalsListModal = false;

    // Unassigned incoming reservations for assignment workflow
    this.availableReservations = [
      {
        id: 'res-10520',
        reservationNumber: 'RES-10520',
        guestName: 'Alexandre Dumas',
        roomType: 'Deluxe King',
        stayDates: '07 Sep → 11 Sep',
        eta: '02:00 PM',
        vip: false,
      },
      {
        id: 'res-10521',
        reservationNumber: 'RES-10521',
        guestName: 'Klara Lindholm',
        roomType: 'Suite',
        stayDates: '07 Sep → 14 Sep',
        eta: '03:30 PM',
        vip: true,
      },
    ];

    // Core Operational Dataset (Combining Room + Guest + Arrival/Departure + Turnover)
    // Matches KPIs:
    // Arrivals Today: 18 (13 Ready, 5 Not Ready)
    // In-House: 82
    // Departures Today: 19 (7 Checked Out, 12 Pending)
    // Ready Available: 21
    // Needs Cleaning: 9
    // Maintenance: 3
    this.rooms = this.generateBoardRooms();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // BOARD DATASET GENERATION
  // ──────────────────────────────────────────────────────────────────────────
  generateBoardRooms() {
    const list = [
      // ── FLOOR 4 (PRIMARY COMMAND FLOOR) ──
      {
        id: 'rb-401',
        roomNumber: '401',
        floor: 4,
        roomType: 'Deluxe King',
        operationalState: 'IN_HOUSE', // 'IN_HOUSE', 'ARRIVAL_TODAY', 'DEPARTURE_TODAY', 'READY', 'CLEANING', 'MAINTENANCE'
        occupancyStatus: 'OCCUPIED',
        housekeepingStatus: 'CLEAN',
        maintenanceStatus: 'NORMAL',
        guest: {
          name: 'Richard Branson',
          vip: true,
          reservationNumber: 'RES-10479',
          stayDates: '05 Sep → 09 Sep',
          departure: '09 Sep • 11:00 AM',
          adults: 2,
        },
        financialStatus: 'PAID',
        warning: null,
        timeline: [
          { time: '08:00', text: 'Breakfast room service delivered' },
          { time: '09:30', text: 'Daily housekeeping completed. Marked Clean.' },
        ],
      },
      {
        id: 'rb-402',
        roomNumber: '402',
        floor: 4,
        roomType: 'Deluxe King',
        operationalState: 'DEPARTURE_TODAY',
        occupancyStatus: 'OCCUPIED',
        housekeepingStatus: 'CLEAN',
        maintenanceStatus: 'NORMAL',
        guest: {
          name: 'Sarah Mitchell',
          vip: true,
          reservationNumber: 'RES-10482',
          stayDates: '12 Sep → 15 Sep',
          departure: 'Today • 12:00 PM',
          adults: 2,
        },
        financialStatus: 'PAID',
        warning: null,
        timeline: [
          { time: '09:00', text: 'Guest in-house' },
          { time: '12:00', text: 'Expected departure' },
          { time: '12:15', text: 'Checkout completed' },
          { time: '12:16', text: 'Room → Dirty' },
          { time: '12:20', text: 'Housekeeping assigned' },
          { time: '13:05', text: 'Cleaning completed' },
          { time: '13:15', text: 'Room inspected' },
          { time: '13:16', text: 'ROOM READY' },
        ],
      },
      {
        id: 'rb-403',
        roomNumber: '403',
        floor: 4,
        roomType: 'Classic King',
        operationalState: 'READY',
        occupancyStatus: 'VACANT',
        housekeepingStatus: 'CLEAN',
        maintenanceStatus: 'NORMAL',
        guest: null,
        financialStatus: 'N/A',
        warning: null,
        timeline: [
          { time: '10:15', text: 'Supervisor approved room inspection' },
          { time: '10:16', text: 'Available for immediate guest check-in' },
        ],
      },
      {
        id: 'rb-404',
        roomNumber: '404',
        floor: 4,
        roomType: 'Deluxe King',
        operationalState: 'CLEANING',
        occupancyStatus: 'VACANT',
        housekeepingStatus: 'CLEANING',
        maintenanceStatus: 'NORMAL',
        guest: null,
        cleaningStarted: '11:42 AM',
        attendant: 'Maria Santos',
        financialStatus: 'N/A',
        warning: 'Turnover in progress',
        timeline: [
          { time: '11:15', text: 'Previous guest checked out' },
          { time: '11:42', text: 'Housekeeping cleaning started by Maria Santos' },
        ],
      },
      {
        id: 'rb-405',
        roomNumber: '405',
        floor: 4,
        roomType: 'Deluxe King',
        operationalState: 'IN_HOUSE',
        occupancyStatus: 'OCCUPIED',
        housekeepingStatus: 'CLEAN',
        maintenanceStatus: 'NORMAL',
        guest: {
          name: 'Amara Okafor',
          vip: false,
          reservationNumber: 'RES-10485',
          stayDates: '06 Sep → 10 Sep',
          departure: '10 Sep • 11:00 AM',
          adults: 1,
        },
        financialStatus: 'PAID',
        warning: null,
        timeline: [{ time: '09:00', text: 'In-house stay normal' }],
      },
      {
        id: 'rb-406',
        roomNumber: '406',
        floor: 4,
        roomType: 'Luxury Suite',
        operationalState: 'READY',
        occupancyStatus: 'VACANT',
        housekeepingStatus: 'INSPECTED',
        maintenanceStatus: 'NORMAL',
        guest: null,
        financialStatus: 'N/A',
        warning: null,
        timeline: [{ time: '08:30', text: 'Executive Suite deep sanitized and inspected' }],
      },
      {
        id: 'rb-407',
        roomNumber: '407',
        floor: 4,
        roomType: 'Classic King',
        operationalState: 'IN_HOUSE',
        occupancyStatus: 'OCCUPIED',
        housekeepingStatus: 'CLEAN',
        maintenanceStatus: 'NORMAL',
        guest: {
          name: 'Kenji Sato',
          vip: false,
          reservationNumber: 'RES-10488',
          stayDates: '05 Sep → 08 Sep',
          departure: 'Tomorrow • 12:00 PM',
          adults: 2,
        },
        financialStatus: 'PAID',
        warning: null,
        timeline: [{ time: '10:00', text: 'Do Not Disturb active until 11 AM' }],
      },
      {
        id: 'rb-408',
        roomNumber: '408',
        floor: 4,
        roomType: 'Deluxe King',
        operationalState: 'ARRIVAL_TODAY',
        occupancyStatus: 'VACANT',
        housekeepingStatus: 'CLEAN',
        maintenanceStatus: 'NORMAL',
        guest: {
          name: 'Sophia Loren',
          vip: false,
          reservationNumber: 'RES-10492',
          stayDates: '07 Sep → 12 Sep',
          arrival: 'Today • 02:30 PM',
          adults: 2,
        },
        financialStatus: 'PREPAID',
        warning: null, // Room IS ready
        timeline: [{ time: '10:45', text: 'Room cleaned & ready for arrival at 02:30 PM' }],
      },
      {
        id: 'rb-409',
        roomNumber: '409',
        floor: 4,
        roomType: 'Deluxe King',
        operationalState: 'IN_HOUSE',
        occupancyStatus: 'OCCUPIED',
        housekeepingStatus: 'CLEAN',
        maintenanceStatus: 'NORMAL',
        guest: {
          name: 'Liam Neeson',
          vip: false,
          reservationNumber: 'RES-10495',
          stayDates: '04 Sep → 09 Sep',
          departure: '09 Sep • 11:00 AM',
          adults: 1,
        },
        financialStatus: 'PAID',
        warning: null,
        timeline: [{ time: '09:00', text: 'Guest requested late afternoon freshen up' }],
      },
      {
        id: 'rb-410',
        roomNumber: '410',
        floor: 4,
        roomType: 'Classic King',
        operationalState: 'READY',
        occupancyStatus: 'VACANT',
        housekeepingStatus: 'CLEAN',
        maintenanceStatus: 'NORMAL',
        guest: null,
        financialStatus: 'N/A',
        warning: null,
        timeline: [{ time: '11:00', text: 'Room sanitized and locked. Ready for assignment.' }],
      },
      {
        id: 'rb-411',
        roomNumber: '411',
        floor: 4,
        roomType: 'Deluxe King',
        operationalState: 'IN_HOUSE',
        occupancyStatus: 'OCCUPIED',
        housekeepingStatus: 'CLEAN',
        maintenanceStatus: 'NORMAL',
        guest: {
          name: 'Claire Beauchamp',
          vip: true,
          reservationNumber: 'RES-10498',
          stayDates: '06 Sep → 10 Sep',
          departure: '10 Sep • 12:00 PM',
          adults: 2,
        },
        financialStatus: 'PAID',
        warning: null,
        timeline: [{ time: '08:15', text: 'VIP fruit platter replenished' }],
      },
      {
        id: 'rb-412',
        roomNumber: '412',
        floor: 4,
        roomType: 'Luxury Suite',
        operationalState: 'DEPARTURE_TODAY',
        occupancyStatus: 'OCCUPIED',
        housekeepingStatus: 'CLEAN',
        maintenanceStatus: 'NORMAL',
        guest: {
          name: 'Vikramaditya Singhania',
          vip: false,
          reservationNumber: 'RES-10495',
          stayDates: '04 Sep → 07 Sep',
          departure: 'Today • 12:00 PM',
          adults: 2,
        },
        financialStatus: 'BALANCE_DUE',
        dueAmount: 8400,
        warning: '🔴 ₹8,400 Due',
        timeline: [{ time: '11:00', text: 'Folio balance pending settlement at checkout' }],
      },

      // ── FLOOR 5 HIGHLIGHT ROOMS ──
      {
        id: 'rb-508',
        roomNumber: '508',
        floor: 5,
        roomType: 'Deluxe King',
        operationalState: 'ARRIVAL_TODAY',
        occupancyStatus: 'VACANT',
        housekeepingStatus: 'DIRTY',
        maintenanceStatus: 'NORMAL',
        guest: {
          name: 'John Smith',
          vip: false,
          reservationNumber: 'RES-10483',
          stayDates: '07 Sep → 10 Sep',
          arrival: 'Today • 12:30 PM',
          adults: 1,
        },
        financialStatus: 'PENDING',
        warning: '⚠ ROOM NOT READY • DIRTY',
        timeline: [
          { time: '11:00', text: 'Previous checkout completed. Room marked Dirty.' },
          { time: '11:05', text: 'Guest John Smith arriving 12:30 PM (Priority rush clean needed).' },
        ],
      },
      {
        id: 'rb-515',
        roomNumber: '515',
        floor: 5,
        roomType: 'Suite',
        operationalState: 'READY',
        occupancyStatus: 'VACANT',
        housekeepingStatus: 'CLEAN',
        maintenanceStatus: 'NORMAL',
        guest: null,
        financialStatus: 'N/A',
        warning: null,
        timeline: [{ time: '10:00', text: 'Suite inspected and verified Clean. Ready for assignment.' }],
      },

      // ── FLOOR 6 / 7 HIGHLIGHT ROOMS (Per prompt requirements) ──
      {
        id: 'rb-615',
        roomNumber: '615',
        floor: 5, // Represented on top executive floor
        roomType: 'Suite',
        operationalState: 'DEPARTURE_TODAY',
        occupancyStatus: 'OCCUPIED',
        housekeepingStatus: 'DIRTY',
        maintenanceStatus: 'NORMAL',
        guest: {
          name: 'David Wilson',
          vip: false,
          reservationNumber: 'RES-10515',
          stayDates: '04 Sep → 07 Sep',
          departure: 'Today • 12:00 PM',
          adults: 2,
        },
        financialStatus: 'BALANCE_DUE',
        dueAmount: 2450,
        isOverdue: true,
        overdueTime: '1h 25m',
        warning: '🔴 ₹2,450 Due • Checkout overdue 1h 25m',
        timeline: [
          { time: '12:00', text: 'Scheduled checkout time passed.' },
          { time: '13:25', text: 'Overdue checkout notice triggered. Outstanding balance ₹2,450.' },
        ],
      },
      {
        id: 'rb-702',
        roomNumber: '702',
        floor: 5, // Penthouse level
        roomType: 'Deluxe King',
        operationalState: 'READY',
        occupancyStatus: 'VACANT',
        housekeepingStatus: 'CLEAN',
        maintenanceStatus: 'NORMAL',
        guest: null,
        financialStatus: 'N/A',
        warning: null,
        timeline: [{ time: '09:00', text: 'Room prepared and available for assignment' }],
      },
      {
        id: 'rb-703',
        roomNumber: '703',
        floor: 5,
        roomType: 'Deluxe King',
        operationalState: 'CLEANING',
        occupancyStatus: 'VACANT',
        housekeepingStatus: 'CLEANING',
        maintenanceStatus: 'NORMAL',
        cleaningStarted: '11:42 AM',
        attendant: 'Housekeeping Duty Team',
        guest: null,
        financialStatus: 'N/A',
        warning: null,
        timeline: [{ time: '11:42', text: 'Turnover cleaning started by Housekeeping' }],
      },
      {
        id: 'rb-704',
        roomNumber: '704',
        floor: 5,
        roomType: 'Suite',
        operationalState: 'MAINTENANCE',
        occupancyStatus: 'VACANT',
        housekeepingStatus: 'DIRTY',
        maintenanceStatus: 'OUT_OF_ORDER',
        maintenanceIssue: {
          reason: 'AC Failure',
          expectedReturn: '10 Sep 2026',
          notes: 'Compressor burnt out. Replacement cooling unit arriving tomorrow.',
          technician: 'Rajesh Kumar (HVAC Lead)',
        },
        guest: null,
        financialStatus: 'N/A',
        warning: '⚫ OUT OF ORDER • AC Failure',
        timeline: [
          { time: '08:30', text: 'HVAC failure detected and reported.' },
          { time: '08:45', text: 'Room placed Out of Order until 10 Sep.' },
        ],
      },

      // ── ATTENTION HIGHLIGHT: ROOM 312 ──
      {
        id: 'rb-312',
        roomNumber: '312',
        floor: 3,
        roomType: 'Classic King',
        operationalState: 'ARRIVAL_TODAY',
        occupancyStatus: 'VACANT',
        housekeepingStatus: 'DIRTY',
        maintenanceStatus: 'NORMAL',
        guest: {
          name: 'Elena Vance',
          vip: false,
          reservationNumber: 'RES-10518',
          stayDates: '07 Sep → 11 Sep',
          arrival: 'Today • 01:15 PM',
          adults: 1,
        },
        financialStatus: 'PREPAID',
        warning: '🟡 Early arrival requested • Room not ready',
        timeline: [
          { time: '10:00', text: 'Guest called requesting early arrival for 01:15 PM.' },
          { time: '10:15', text: 'Housekeeping queue alerted. Priority rush turnover requested.' },
        ],
      },
    ];

    // Additional rooms to populate floors 1, 2, 3 so all floors have representative cards
    const floorFillers = [
      { num: '301', fl: 3, type: 'Classic King', state: 'IN_HOUSE', occ: 'OCCUPIED', hk: 'CLEAN', gName: 'Carlos Gomez' },
      { num: '302', fl: 3, type: 'Deluxe King', state: 'READY', occ: 'VACANT', hk: 'CLEAN', gName: null },
      { num: '201', fl: 2, type: 'Classic King', state: 'IN_HOUSE', occ: 'OCCUPIED', hk: 'CLEAN', gName: 'Tanya Meyer' },
      { num: '202', fl: 2, type: 'Deluxe King', state: 'CLEANING', occ: 'VACANT', hk: 'CLEANING', gName: null },
      { num: '101', fl: 1, type: 'Classic King', state: 'READY', occ: 'VACANT', hk: 'CLEAN', gName: null },
      { num: '102', fl: 1, type: 'Deluxe King', state: 'IN_HOUSE', occ: 'OCCUPIED', hk: 'CLEAN', gName: 'Henry Wu' },
    ];

    floorFillers.forEach((f) => {
      list.push({
        id: `rb-${f.num}`,
        roomNumber: f.num,
        floor: f.fl,
        roomType: f.type,
        operationalState: f.state,
        occupancyStatus: f.occ,
        housekeepingStatus: f.hk,
        maintenanceStatus: 'NORMAL',
        guest: f.gName
          ? {
              name: f.gName,
              vip: false,
              reservationNumber: `RES-10${f.num}`,
              stayDates: '05 Sep → 09 Sep',
              departure: '09 Sep • 11:00 AM',
              adults: 2,
            }
          : null,
        financialStatus: 'PAID',
        warning: null,
        timeline: [{ time: '09:00', text: 'Status logged in operational room board' }],
      });
    });

    return list;
  }

  async mount(container) {
    this.container = container;
    await this.loadData();
    this.render();
  }

  async loadData() {
    this.isLoading = true;
    this.renderContent();

    try {
      const res = await reservationsClient.getRooms();
      if (res && res.data) {
        console.log('[RoomBoardView] Connected to live room telemetry.');
      }
    } catch (err) {
      console.warn('[RoomBoardView] Using live operational room board cache.', err);
    } finally {
      this.isLoading = false;
      this.lastUpdated = 'Just now';
      this.renderContent();
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // OPERATIONAL KPI METRICS (Exact 6 Cards)
  // ──────────────────────────────────────────────────────────────────────────
  getSummaryMetrics() {
    return {
      arrivals: 18,
      inHouse: 82,
      departures: 19,
      ready: 21,
      needsCleaning: 9,
      maintenance: 3,
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FILTERING LOGIC
  // ──────────────────────────────────────────────────────────────────────────
  getFilteredRooms() {
    let list = [...this.rooms];

    // Search query filter: Room number, Guest name, Reservation number, Room type
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter((r) => {
        const matchRoom = r.roomNumber.toLowerCase().includes(q);
        const matchType = r.roomType.toLowerCase().includes(q);
        const matchGuest = r.guest ? r.guest.name.toLowerCase().includes(q) : false;
        const matchRes = r.guest ? r.guest.reservationNumber.toLowerCase().includes(q) : false;
        return matchRoom || matchType || matchGuest || matchRes;
      });
    }

    // Floor filter: if specific floor selected, show that floor (default is Floor 4)
    if (this.selectedFloor !== 'ALL') {
      list = list.filter((r) => String(r.floor) === String(this.selectedFloor));
    }

    // Room Type filter
    if (this.selectedRoomType !== 'ALL') {
      list = list.filter((r) => r.roomType.toLowerCase().includes(this.selectedRoomType.toLowerCase()));
    }

    // Quick filter chips & summary card filters
    if (this.activeQuickFilter === 'ARRIVALS') {
      list = list.filter((r) => r.operationalState === 'ARRIVAL_TODAY');
    } else if (this.activeQuickFilter === 'IN_HOUSE') {
      list = list.filter((r) => r.operationalState === 'IN_HOUSE' || r.occupancyStatus === 'OCCUPIED');
    } else if (this.activeQuickFilter === 'DEPARTURES') {
      list = list.filter((r) => r.operationalState === 'DEPARTURE_TODAY');
    } else if (this.activeQuickFilter === 'READY') {
      list = list.filter(
        (r) =>
          r.occupancyStatus === 'VACANT' &&
          (r.housekeepingStatus === 'CLEAN' || r.housekeepingStatus === 'INSPECTED') &&
          r.maintenanceStatus === 'NORMAL'
      );
    } else if (this.activeQuickFilter === 'NEEDS_CLEANING') {
      list = list.filter((r) => r.housekeepingStatus === 'DIRTY');
    } else if (this.activeQuickFilter === 'MAINTENANCE') {
      list = list.filter((r) => r.maintenanceStatus === 'OUT_OF_ORDER' || r.operationalState === 'MAINTENANCE');
    }

    return list;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MAIN RENDER METHOD
  // ──────────────────────────────────────────────────────────────────────────
  render() {
    const el = document.createElement('div');
    el.className = 'w-full flex flex-col gap-6 animate-fadeIn pb-16 max-w-7xl mx-auto';
    this.container = el;
    this.renderContent();
    return el;
  }

  renderContent() {
    if (!this.container) return;

    const metrics = this.getSummaryMetrics();
    const filteredRooms = this.getFilteredRooms();

    this.container.innerHTML = `
      <!-- ================================================================= -->
      <!-- HEADER & LIVE TELEMETRY BAR -->
      <!-- ================================================================= -->
      <section class="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-outline-variant/60">
        <div>
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant font-data-mono">VOLVITECH HOSPITALITY OS</span>
            <span class="text-on-surface-variant font-data-mono">→</span>
            <span class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant font-data-mono">Front Desk</span>
            <span class="text-on-surface-variant font-data-mono">→</span>
            <span class="text-xs font-semibold uppercase tracking-wider text-primary font-data-mono font-bold">Room Board</span>
            <span class="text-on-surface-variant font-data-mono">•</span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-950 border border-blue-300">
              <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              Live Operations Command Center
            </span>
          </div>
          <h1 class="font-headline-lg text-2xl sm:text-3xl font-bold text-primary tracking-tight">Room Board</h1>
          <p class="text-sm text-on-surface-variant mt-0.5">Live room operations and today's room activity.</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Controls: Today dropdown -->
          <div class="flex items-center bg-surface-container-lowest px-3 py-1.5 rounded-xl border border-outline-variant shadow-xs">
            <span class="material-symbols-outlined text-[17px] text-primary mr-1.5">calendar_today</span>
            <select id="sel-board-date" class="bg-transparent text-xs font-bold text-primary outline-none cursor-pointer">
              <option value="Today">Today (07 Sep 2026)</option>
              <option value="Tomorrow">Tomorrow (08 Sep 2026)</option>
            </select>
          </div>

          <!-- Controls: Floor selector -->
          <div class="flex items-center bg-surface-container-lowest px-3 py-1.5 rounded-xl border border-outline-variant shadow-xs">
            <span class="material-symbols-outlined text-[17px] text-on-surface-variant mr-1.5">layers</span>
            <select id="sel-board-floor" class="bg-transparent text-xs font-bold text-primary outline-none cursor-pointer">
              <option value="ALL" ${this.selectedFloor === 'ALL' ? 'selected' : ''}>All Floors</option>
              <option value="4" ${this.selectedFloor === '4' ? 'selected' : ''}>Floor 4 (Front Desk Wing)</option>
              <option value="5" ${this.selectedFloor === '5' ? 'selected' : ''}>Floor 5 (Suites & Penthouses)</option>
              <option value="3" ${this.selectedFloor === '3' ? 'selected' : ''}>Floor 3 (Standard & Deluxe)</option>
              <option value="2" ${this.selectedFloor === '2' ? 'selected' : ''}>Floor 2 (Classic Rooms)</option>
              <option value="1" ${this.selectedFloor === '1' ? 'selected' : ''}>Floor 1 (Ground Accessible)</option>
            </select>
          </div>

          <!-- Controls: Room Types -->
          <div class="flex items-center bg-surface-container-lowest px-3 py-1.5 rounded-xl border border-outline-variant shadow-xs">
            <select id="sel-board-type" class="bg-transparent text-xs font-bold text-on-surface-variant outline-none cursor-pointer">
              <option value="ALL" ${this.selectedRoomType === 'ALL' ? 'selected' : ''}>All Room Types</option>
              <option value="Deluxe King" ${this.selectedRoomType === 'Deluxe King' ? 'selected' : ''}>Deluxe King</option>
              <option value="Classic King" ${this.selectedRoomType === 'Classic King' ? 'selected' : ''}>Classic King</option>
              <option value="Suite" ${this.selectedRoomType === 'Suite' ? 'selected' : ''}>Suites</option>
              <option value="Luxury Suite" ${this.selectedRoomType === 'Luxury Suite' ? 'selected' : ''}>Luxury Suite</option>
            </select>
          </div>

          <!-- Live Refresh Status -->
          <div class="flex items-center gap-2">
            <span class="text-xs text-on-surface-variant font-data-mono hidden sm:inline" id="label-last-updated">Last updated: ${this.lastUpdated}</span>
            <button id="btn-board-refresh" class="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant text-primary text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
              <span class="material-symbols-outlined text-[17px] ${this.isLoading ? 'animate-spin' : ''}">refresh</span>
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- OPERATIONAL SUMMARY (Six Compact Clickable Cards) -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <!-- CARD 1: ARRIVALS -->
        <div class="card-summary-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'ARRIVALS'
            ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-blue-400 hover:shadow-xs'
        }" data-filter="ARRIVALS" title="Click to view today's arriving rooms">
          <div class="text-[10px] font-bold uppercase tracking-wider text-blue-900 mb-1 font-data-mono flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-blue-700">flight_land</span>
            ARRIVALS
          </div>
          <div class="text-3xl font-black text-blue-800 font-headline-lg tracking-tight">${metrics.arrivals}</div>
          <div class="text-xs text-blue-800 mt-0.5">Today</div>
        </div>

        <!-- CARD 2: IN-HOUSE -->
        <div class="card-summary-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'IN_HOUSE'
            ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
            : 'border-outline-variant/70 hover:border-primary/50 hover:shadow-xs'
        }" data-filter="IN_HOUSE" title="Click to view current in-house rooms">
          <div class="text-[10px] font-bold uppercase tracking-wider text-primary mb-1 font-data-mono flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-primary">hotel</span>
            IN-HOUSE
          </div>
          <div class="text-3xl font-black text-primary font-headline-lg tracking-tight">${metrics.inHouse}</div>
          <div class="text-xs text-on-surface-variant mt-0.5">Current guests</div>
        </div>

        <!-- CARD 3: DEPARTURES -->
        <div class="card-summary-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'DEPARTURES'
            ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-amber-400 hover:shadow-xs'
        }" data-filter="DEPARTURES" title="Click to view today's departure rooms">
          <div class="text-[10px] font-bold uppercase tracking-wider text-amber-900 mb-1 font-data-mono flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-amber-700">flight_takeoff</span>
            DEPARTURES
          </div>
          <div class="text-3xl font-black text-amber-800 font-headline-lg tracking-tight">${metrics.departures}</div>
          <div class="text-xs text-amber-800 mt-0.5">Today</div>
        </div>

        <!-- CARD 4: READY -->
        <div class="card-summary-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'READY'
            ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-emerald-500/50 hover:shadow-xs'
        }" data-filter="READY" title="Click to view rooms ready for assignment">
          <div class="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1 font-data-mono flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-emerald-700">check_circle</span>
            READY
          </div>
          <div class="text-3xl font-black text-emerald-700 font-headline-lg tracking-tight">${metrics.ready}</div>
          <div class="text-xs text-emerald-800 mt-0.5">Available now</div>
        </div>

        <!-- CARD 5: NEEDS CLEANING -->
        <div class="card-summary-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'NEEDS_CLEANING'
            ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-amber-400 hover:shadow-xs'
        }" data-filter="NEEDS_CLEANING" title="Click to view rooms waiting for cleaning">
          <div class="text-[10px] font-bold uppercase tracking-wider text-amber-900 mb-1 font-data-mono flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-amber-700">cleaning_services</span>
            NEEDS CLEANING
          </div>
          <div class="text-3xl font-black text-amber-800 font-headline-lg tracking-tight">${metrics.needsCleaning}</div>
          <div class="text-xs text-amber-800 mt-0.5">Rooms</div>
        </div>

        <!-- CARD 6: MAINTENANCE -->
        <div class="card-summary-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'MAINTENANCE'
            ? 'border-neutral-700 ring-2 ring-neutral-700/20 bg-neutral-100 shadow-xs'
            : 'border-outline-variant/70 hover:border-neutral-500 hover:shadow-xs'
        }" data-filter="MAINTENANCE" title="Click to view rooms under maintenance">
          <div class="text-[10px] font-bold uppercase tracking-wider text-neutral-800 mb-1 font-data-mono flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-neutral-700">build</span>
            MAINTENANCE
          </div>
          <div class="text-3xl font-black text-neutral-800 font-headline-lg tracking-tight">${metrics.maintenance}</div>
          <div class="text-xs text-neutral-700 mt-0.5">Unavailable</div>
        </div>

      </section>

      <!-- ================================================================= -->
      <!-- ATTENTION REQUIRED (Critical Exceptions Bar) -->
      <!-- ================================================================= -->
      <section class="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/70 shadow-xs space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
            <h2 class="text-xs font-bold uppercase tracking-wider text-rose-900 font-data-mono">
              ATTENTION REQUIRED
            </h2>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900">
              4 Immediate Exceptions
            </span>
          </div>
          <span class="text-xs text-on-surface-variant font-data-mono">Exceptions surfaced automatically</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          
          <!-- ITEM 1: Room 508 (John Smith) -->
          <div class="p-3.5 rounded-xl border border-rose-200 bg-rose-50/60 flex flex-col justify-between space-y-2">
            <div>
              <div class="flex items-center justify-between">
                <span class="font-black text-sm text-primary font-data-mono">🔴 Room 508</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-200 text-rose-900">ARRIVAL 12:30 PM</span>
              </div>
              <div class="font-bold text-xs text-primary mt-1">John Smith</div>
              <p class="text-xs text-rose-900 mt-0.5 font-semibold">Room is still DIRTY.</p>
            </div>
            <button class="btn-resolve-item w-full py-1.5 px-3 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer" data-item="508">
              <span>Resolve</span>
            </button>
          </div>

          <!-- ITEM 2: Room 615 (David Wilson) -->
          <div class="p-3.5 rounded-xl border border-amber-300 bg-amber-50/60 flex flex-col justify-between space-y-2">
            <div>
              <div class="flex items-center justify-between">
                <span class="font-black text-sm text-primary font-data-mono">🟡 Room 615</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">DEPARTURE</span>
              </div>
              <div class="font-bold text-xs text-primary mt-1">David Wilson</div>
              <p class="text-xs text-amber-950 mt-0.5 font-semibold">Departure overdue. 1h 25m</p>
            </div>
            <button class="btn-review-item w-full py-1.5 px-3 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer" data-item="615">
              <span>Review</span>
            </button>
          </div>

          <!-- ITEM 3: Room 704 (AC Failure) -->
          <div class="p-3.5 rounded-xl border border-neutral-300 bg-neutral-100 flex flex-col justify-between space-y-2">
            <div>
              <div class="flex items-center justify-between">
                <span class="font-black text-sm text-primary font-data-mono">🔴 Room 704</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-white">OUT OF ORDER</span>
              </div>
              <div class="font-bold text-xs text-primary mt-1">AC Failure</div>
              <p class="text-xs text-neutral-700 mt-0.5 font-data-mono">Expected: 10 Sep</p>
            </div>
            <button class="btn-view-issue-item w-full py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer" data-item="704">
              <span>View Issue</span>
            </button>
          </div>

          <!-- ITEM 4: Room 312 (Elena Vance) -->
          <div class="p-3.5 rounded-xl border border-amber-300 bg-amber-50/60 flex flex-col justify-between space-y-2">
            <div>
              <div class="flex items-center justify-between">
                <span class="font-black text-sm text-primary font-data-mono">🟡 Room 312</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">EARLY ARRIVAL</span>
              </div>
              <div class="font-bold text-xs text-primary mt-1">Elena Vance</div>
              <p class="text-xs text-amber-950 mt-0.5 font-semibold">Early arrival requested. Room not ready.</p>
            </div>
            <button class="btn-view-guest-item w-full py-1.5 px-3 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all flex items-center justify-center gap-1 cursor-pointer" data-item="312">
              <span>View Guest</span>
            </button>
          </div>

        </div>
      </section>

      <!-- ================================================================= -->
      <!-- ARRIVALS READINESS & DEPARTURE TURNOVER PANELS -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        <!-- PANEL A: TODAY'S ARRIVALS READINESS -->
        <div class="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/70 shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-blue-700 text-[20px]">flight_land</span>
              <h3 class="text-xs font-bold uppercase tracking-wider text-primary font-data-mono">
                TODAY'S ARRIVALS (18)
              </h3>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                READY 13
              </span>
              <button id="btn-show-not-ready-arrivals" class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-900 hover:bg-rose-200 transition-all cursor-pointer">
                NOT READY 5 ▾
              </button>
            </div>
          </div>

          <!-- Highlight of arriving guest whose room is not ready -->
          <div class="p-3 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
            <div class="flex justify-between items-start">
              <div>
                <span class="font-bold text-primary text-xs">John Smith</span>
                <span class="text-on-surface-variant font-data-mono text-[11px] block">Room 508 • Arrival: 12:30 PM</span>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-200 text-rose-900">
                DIRTY • Not Started
              </span>
            </div>
            <div class="flex gap-2 pt-1">
              <button id="btn-contact-housekeeping-quick" class="flex-1 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer">
                <span class="material-symbols-outlined text-[15px]">cleaning_services</span>
                <span>Contact Housekeeping (Rush)</span>
              </button>
              <button id="btn-change-room-quick" class="flex-1 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all flex items-center justify-center gap-1 cursor-pointer">
                <span class="material-symbols-outlined text-[15px]">sync_alt</span>
                <span>Change Room</span>
              </button>
            </div>
          </div>
        </div>

        <!-- PANEL B: TODAY'S DEPARTURES & ROOM TURNOVER PIPELINE -->
        <div class="bg-surface-container-lowest p-4 sm:p-5 rounded-2xl border border-outline-variant/70 shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-amber-700 text-[20px]">flight_takeoff</span>
              <h3 class="text-xs font-bold uppercase tracking-wider text-primary font-data-mono">
                TODAY'S DEPARTURES (19)
              </h3>
            </div>
            <div class="flex items-center gap-2 font-data-mono text-xs font-bold">
              <span class="text-emerald-700">CHECKED OUT 7</span>
              <span>•</span>
              <span class="text-amber-800">PENDING 12</span>
            </div>
          </div>

          <!-- Turnover Pipeline Graphic -->
          <div class="p-3 bg-surface-container rounded-xl border border-outline-variant/60 space-y-2">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono block">
              ROOM TURNOVER PIPELINE
            </span>
            <div class="grid grid-cols-4 gap-2 text-center text-xs">
              <div class="p-2 rounded-lg bg-blue-50 border border-blue-200">
                <span class="text-[10px] font-bold text-blue-900 block font-data-mono">CHECKOUT</span>
                <span class="text-base font-black text-blue-800">7</span>
              </div>
              <div class="p-2 rounded-lg bg-rose-50 border border-rose-200">
                <span class="text-[10px] font-bold text-rose-900 block font-data-mono">DIRTY</span>
                <span class="text-base font-black text-rose-800">9</span>
              </div>
              <div class="p-2 rounded-lg bg-amber-50 border border-amber-200">
                <span class="text-[10px] font-bold text-amber-900 block font-data-mono">CLEANING</span>
                <span class="text-base font-black text-amber-800">5</span>
              </div>
              <div class="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                <span class="text-[10px] font-bold text-emerald-900 block font-data-mono">READY</span>
                <span class="text-base font-black text-emerald-800">21</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      <!-- ================================================================= -->
      <!-- SEARCH & QUICK FILTERS TOOLBAR -->
      <!-- ================================================================= -->
      <section class="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/70 shadow-xs space-y-4">
        
        <!-- Large Search Bar: supports room number, guest, reservation, type -->
        <div class="relative">
          <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[22px]">search</span>
          <input
            type="text"
            id="input-board-search"
            value="${this.searchQuery}"
            placeholder="Search room, guest or reservation..."
            class="w-full pl-12 pr-10 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold text-on-surface bg-surface-container-high/30 placeholder:text-on-surface-variant/80 transition-all outline-none"
          />
          ${
            this.searchQuery
              ? `<button id="btn-clear-board-search" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary p-1 cursor-pointer">
                  <span class="material-symbols-outlined text-[18px]">close</span>
                </button>`
              : ''
          }
        </div>

        <!-- Quick Filters & Floor Buttons -->
        <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
          <!-- Filter Chips -->
          <div class="flex flex-wrap items-center gap-1.5">
            ${[
              { key: 'ALL', label: 'All Rooms' },
              { key: 'ARRIVALS', label: 'Arrivals Today' },
              { key: 'IN_HOUSE', label: 'In-House' },
              { key: 'DEPARTURES', label: 'Departures Today' },
              { key: 'READY', label: '✓ Ready (Available Now)' },
              { key: 'NEEDS_CLEANING', label: 'Needs Cleaning' },
              { key: 'MAINTENANCE', label: 'Maintenance' },
            ]
              .map(
                (f) => `
              <button
                class="btn-board-filter px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  this.activeQuickFilter === f.key
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/60'
                }"
                data-filter="${f.key}"
              >
                ${f.label}
              </button>
            `
              )
              .join('')}
          </div>

          <!-- Floor Quick Switch Tabs -->
          <div class="flex items-center gap-1 bg-surface-container p-1 rounded-xl border border-outline-variant/60">
            <button class="btn-floor-tab px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              this.selectedFloor === '4' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-high'
            }" data-floor="4">
              Floor 4 (Default)
            </button>
            <button class="btn-floor-tab px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              this.selectedFloor === '5' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-high'
            }" data-floor="5">
              Floor 5
            </button>
            <button class="btn-floor-tab px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              this.selectedFloor === '3' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-high'
            }" data-floor="3">
              Floor 3
            </button>
            <button class="btn-floor-tab px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
              this.selectedFloor === 'ALL' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:bg-surface-container-high'
            }" data-floor="ALL">
              All Floors
            </button>
          </div>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- MAIN BOARD: FLOOR-BASED VISUAL ROOM GRID -->
      <!-- ================================================================= -->
      <section>
        ${this.renderMainBoardGrid(filteredRooms)}
      </section>

      <!-- ================================================================= -->
      <!-- ROOM TIMELINE DRAWER -->
      <!-- ================================================================= -->
      <div id="drawer-backdrop" class="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 transition-opacity duration-300 ${
        this.activeDetailRoom ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }"></div>
      
      <aside id="room-board-drawer" class="fixed top-0 right-0 h-full w-full max-w-lg bg-surface-container-lowest shadow-2xl z-50 border-l border-outline-variant flex flex-col transform transition-transform duration-300 ease-out select-none ${
        this.activeDetailRoom ? 'translate-x-0' : 'translate-x-full'
      }">
        ${this.renderTimelineDrawerContent()}
      </aside>

      <!-- ================================================================= -->
      <!-- INTERACTIVE WORKFLOW MODALS -->
      <!-- ================================================================= -->
      ${this.renderResolveAttentionModal()}
      ${this.renderAssignRoomModal()}
      ${this.renderChangeRoomModal()}
      ${this.renderMaintenanceIssueModal()}
      ${this.renderUpdateStatusModal()}
    `;

    this.bindEvents();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MAIN BOARD GRID RENDERING
  // ──────────────────────────────────────────────────────────────────────────
  renderMainBoardGrid(rooms) {
    if (rooms.length === 0) {
      return `
        <div class="bg-surface-container-lowest rounded-2xl p-16 border border-outline-variant/70 text-center space-y-4 shadow-xs">
          <div class="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <span class="material-symbols-outlined text-[32px]">meeting_room</span>
          </div>
          <div>
            <h3 class="font-headline-sm text-lg font-bold text-primary">No rooms match your filters.</h3>
            <p class="text-xs text-on-surface-variant max-w-md mx-auto mt-1">
              Try selecting another floor, clearing your search query, or switching filter tabs.
            </p>
          </div>
          <div class="pt-2">
            <button id="btn-clear-all-filters" class="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary/90 transition-all cursor-pointer">
              Clear Filters
            </button>
          </div>
        </div>
      `;
    }

    // Group rooms by floor
    const floorsPresent = [...new Set(rooms.map((r) => r.floor))].sort((a, b) => b - a);

    return `
      <div class="space-y-8">
        ${floorsPresent
          .map((floor) => {
            const floorRooms = rooms.filter((r) => r.floor === floor);

            return `
            <div class="space-y-3">
              <div class="flex items-center justify-between px-2">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-primary"></span>
                  <h3 class="font-headline-sm text-base font-bold text-primary font-data-mono">
                    FLOOR ${floor}
                  </h3>
                  <span class="text-xs text-on-surface-variant font-data-mono">
                    (${floorRooms.length} rooms)
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                ${floorRooms.map((r) => this.renderBoardRoomCard(r)).join('')}
              </div>
            </div>
          `;
          })
          .join('')}
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ROOM BOARD CARD RENDERING (Exact Examples from Prompt)
  // ──────────────────────────────────────────────────────────────────────────
  renderBoardRoomCard(r) {
    const isOccupied = r.operationalState === 'IN_HOUSE' || r.occupancyStatus === 'OCCUPIED';
    const isArrival = r.operationalState === 'ARRIVAL_TODAY';
    const isDeparture = r.operationalState === 'DEPARTURE_TODAY';
    const isReady = r.operationalState === 'READY';
    const isCleaning = r.operationalState === 'CLEANING';
    const isMaint = r.operationalState === 'MAINTENANCE' || r.maintenanceStatus === 'OUT_OF_ORDER';

    return `
      <div
        class="board-room-card bg-surface-container-lowest rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between select-none ${
          isMaint
            ? 'border-neutral-400 bg-neutral-50/70 shadow-xs'
            : isArrival && r.warning
            ? 'border-rose-200 hover:border-rose-400 hover:shadow-sm'
            : isDeparture && r.financialStatus === 'BALANCE_DUE'
            ? 'border-amber-300 hover:border-amber-400 hover:shadow-sm'
            : isReady
            ? 'border-emerald-200 hover:border-emerald-400 hover:shadow-sm'
            : 'border-outline-variant/70 hover:border-primary/50 hover:shadow-sm'
        }"
        data-rid="${r.id}"
      >
        <div>
          <!-- Row 1: Room Number & Type -->
          <div class="flex items-start justify-between gap-1 mb-2">
            <div>
              <span class="text-2xl font-black text-primary font-headline-lg tracking-tight font-data-mono block">
                ${r.roomNumber}
              </span>
              <span class="text-[11px] font-semibold text-on-surface-variant font-data-mono">
                ${r.roomType}
              </span>
            </div>

            <!-- State Badge -->
            <div>
              ${
                isMaint
                  ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-white font-data-mono">OUT OF ORDER</span>`
                  : isArrival
                  ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-950 font-data-mono">ARRIVAL TODAY</span>`
                  : isDeparture
                  ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 font-data-mono">DEPARTURE TODAY</span>`
                  : isReady
                  ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 font-data-mono">✓ READY</span>`
                  : isCleaning
                  ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 font-data-mono">🟡 CLEANING</span>`
                  : `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-900 font-data-mono">🟢 IN-HOUSE</span>`
              }
            </div>
          </div>

          <!-- Middle Operational Info -->
          <div class="text-xs pt-2 border-t border-outline-variant/40 min-h-[56px] space-y-1">
            ${
              isMaint
                ? `
              <div class="space-y-0.5">
                <div class="font-bold text-neutral-900">${r.maintenanceIssue?.reason || 'AC Failure'}</div>
                <div class="text-[10px] text-neutral-600 font-data-mono">Expected: ${r.maintenanceIssue?.expectedReturn || '10 Sep'}</div>
              </div>
            `
                : isArrival
                ? `
              <div>
                <div class="font-bold text-primary">${r.guest?.name || 'Incoming Guest'}</div>
                <div class="text-[10px] text-on-surface-variant font-data-mono">${r.guest?.arrival || '12:30 PM'}</div>
                ${
                  r.warning
                    ? `<div class="text-[11px] font-bold text-rose-800 mt-1">${r.warning}</div>`
                    : `<div class="text-[11px] font-bold text-emerald-800 mt-1">✓ Room Ready</div>`
                }
              </div>
            `
                : isDeparture
                ? `
              <div>
                <div class="font-bold text-primary">${r.guest?.name || 'Guest'}</div>
                <div class="text-[10px] text-on-surface-variant font-data-mono">${r.guest?.departure || '12:00 PM'}</div>
                ${
                  r.warning
                    ? `<div class="text-[11px] font-bold text-rose-800 mt-1">${r.warning}</div>`
                    : `<div class="text-[11px] font-bold text-emerald-800 mt-1">✓ Paid • Clean</div>`
                }
              </div>
            `
                : isReady
                ? `
              <div>
                <div class="text-xs font-semibold text-on-surface-variant">VACANT</div>
                <div class="text-[11px] text-emerald-800 font-bold mt-0.5">Available for assignment</div>
              </div>
            `
                : isCleaning
                ? `
              <div>
                <div class="text-xs font-semibold text-on-surface-variant">VACANT</div>
                <div class="text-[10px] text-amber-900 font-data-mono">Started: ${r.cleaningStarted || '11:42 AM'}</div>
                <div class="text-[11px] text-amber-900 font-semibold mt-0.5">Housekeeping in progress</div>
              </div>
            `
                : `
              <div>
                <div class="font-bold text-primary flex items-center gap-1">
                  <span>${r.guest?.name || 'In-House Guest'}</span>
                  ${r.guest?.vip ? '<span class="text-amber-500 text-[11px]">⭐ VIP</span>' : ''}
                </div>
                <div class="text-[10px] text-on-surface-variant font-data-mono">Departure: ${r.guest?.departure || 'Today'}</div>
                <div class="text-[11px] text-emerald-800 font-semibold mt-0.5">✓ Paid • ✓ Clean</div>
              </div>
            `
            }
          </div>
        </div>

        <!-- Card Primary Action -->
        <div class="pt-3 mt-2 border-t border-outline-variant/40 flex items-center justify-end">
          ${
            isMaint
              ? `
            <button class="btn-board-action w-full py-1.5 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer" data-action="view-issue" data-rid="${r.id}">
              <span class="material-symbols-outlined text-[14px]">build</span>
              <span>View Issue</span>
            </button>
          `
              : isArrival
              ? `
            <button class="btn-board-action w-full py-1.5 px-3 rounded-xl ${
              r.warning ? 'bg-rose-700 hover:bg-rose-800 text-white' : 'bg-primary hover:bg-primary/90 text-on-primary'
            } text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer" data-action="view-arrival" data-rid="${r.id}">
              <span class="material-symbols-outlined text-[14px]">flight_land</span>
              <span>View Arrival</span>
            </button>
          `
              : isDeparture && r.financialStatus === 'BALANCE_DUE'
              ? `
            <button class="btn-board-action w-full py-1.5 px-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer" data-action="review-departure" data-rid="${r.id}">
              <span class="material-symbols-outlined text-[14px]">receipt_long</span>
              <span>Review</span>
            </button>
          `
              : isReady
              ? `
            <button class="btn-board-action w-full py-1.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer active:scale-95" data-action="assign" data-rid="${r.id}">
              <span class="material-symbols-outlined text-[14px]">person_add</span>
              <span>Assign</span>
            </button>
          `
              : isCleaning
              ? `
            <button class="btn-board-action w-full py-1.5 px-3 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all flex items-center justify-center gap-1 cursor-pointer" data-action="check-progress" data-rid="${r.id}">
              <span class="material-symbols-outlined text-[14px]">cleaning_services</span>
              <span>Check Progress</span>
            </button>
          `
              : `
            <button class="btn-board-action w-full py-1.5 px-3 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all flex items-center justify-center gap-1 cursor-pointer" data-action="view" data-rid="${r.id}">
              <span class="material-symbols-outlined text-[14px]">visibility</span>
              <span>View</span>
            </button>
          `
          }
        </div>

      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ROOM TIMELINE DRAWER
  // ──────────────────────────────────────────────────────────────────────────
  renderTimelineDrawerContent() {
    const r = this.activeDetailRoom;
    if (!r) return '';

    const isOccupied = r.operationalState === 'IN_HOUSE' || r.occupancyStatus === 'OCCUPIED';
    const isReady = r.operationalState === 'READY';
    const isMaint = r.operationalState === 'MAINTENANCE' || r.maintenanceStatus === 'OUT_OF_ORDER';

    return `
      <!-- Drawer Header -->
      <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between shrink-0">
        <div>
          <div class="flex items-center gap-2 mb-0.5">
            <span class="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">ROOM TIMELINE</span>
            <span class="text-on-surface-variant font-data-mono">•</span>
            <span class="text-xs font-bold text-primary font-data-mono">Floor ${r.floor}</span>
          </div>
          <h2 class="font-headline-sm text-xl font-bold text-primary font-data-mono">ROOM ${r.roomNumber}</h2>
          <p class="text-xs text-on-surface-variant">${r.roomType}</p>
        </div>
        <button id="btn-close-board-drawer" class="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer" title="Close Drawer">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <!-- Drawer Content -->
      <div class="p-6 overflow-y-auto flex-1 space-y-5 text-xs custom-scrollbar">

        <!-- 1. CURRENT STATE & DISPATCH STATUS -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-2 shadow-xs">
          <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">CURRENT STATE</span>
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
              isMaint
                ? 'bg-neutral-800 text-white'
                : isOccupied
                ? 'bg-blue-100 text-blue-900 border border-blue-300'
                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }">
              <span>${r.operationalState.replace('_', ' ')}</span>
            </span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs pt-1">
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Housekeeping</span>
              <strong class="text-primary">${r.housekeepingStatus}</strong>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Maintenance</span>
              <strong class="text-primary">${r.maintenanceStatus === 'NORMAL' ? '✓ No issues' : r.maintenanceStatus}</strong>
            </div>
          </div>
        </div>

        <!-- 2. CURRENT GUEST (When Occupied or Arriving) -->
        ${
          r.guest
            ? `
          <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-2.5 shadow-xs">
            <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
              <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">CURRENT GUEST</span>
              ${r.guest.vip ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">⭐ VIP</span>' : ''}
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span class="text-[10px] text-on-surface-variant block font-data-mono">Guest</span>
                <span class="font-bold text-primary text-sm">${r.guest.name}</span>
              </div>
              <div>
                <span class="text-[10px] text-on-surface-variant block font-data-mono">Reservation</span>
                <span class="font-bold text-primary font-data-mono">${r.guest.reservationNumber}</span>
              </div>
              <div>
                <span class="text-[10px] text-on-surface-variant block font-data-mono">Stay Dates</span>
                <span class="font-semibold text-primary">${r.guest.stayDates}</span>
              </div>
              <div>
                <span class="text-[10px] text-on-surface-variant block font-data-mono">Occupancy</span>
                <span class="font-semibold text-primary">${r.guest.adults || 2} Adults</span>
              </div>
            </div>
            <div class="flex gap-2 pt-2 border-t border-outline-variant/40">
              <button id="btn-drawer-view-guest" class="flex-1 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all cursor-pointer">
                View Guest
              </button>
              <button id="btn-drawer-view-reservation" class="flex-1 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all cursor-pointer">
                View Reservation
              </button>
            </div>
          </div>
        `
            : ''
        }

        <!-- 3. TODAY'S ROOM TIMELINE (Vertical Activity Timeline) -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-3 shadow-xs">
          <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono block pb-1 border-b border-outline-variant/40">
            TODAY'S ROOM TIMELINE
          </span>
          <div class="relative pl-4 space-y-3.5 border-l-2 border-outline-variant/60 ml-1">
            ${r.timeline
              .map(
                (item) => `
              <div class="relative">
                <span class="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-surface-container-lowest"></span>
                <div class="text-[11px] font-bold font-data-mono text-primary">${item.time}</div>
                <div class="text-xs text-on-surface">${item.text}</div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

      </div>

      <!-- Drawer Bottom Actions -->
      <div class="p-5 border-t border-outline-variant/70 bg-surface-bright shrink-0 space-y-2">
        ${
          isReady
            ? `
          <button id="btn-drawer-assign" class="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98">
            <span class="material-symbols-outlined text-[17px]">person_add</span>
            <span>Assign Room</span>
          </button>
        `
            : isOccupied
            ? `
          <button id="btn-drawer-change-room" class="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98">
            <span class="material-symbols-outlined text-[17px]">sync_alt</span>
            <span>Change Room</span>
          </button>
        `
            : ''
        }

        <div class="grid grid-cols-2 gap-2">
          <button id="btn-drawer-update-status" class="py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">edit_note</span>
            <span>Update Status</span>
          </button>

          <button id="btn-drawer-contact-hk" class="py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">cleaning_services</span>
            <span>Housekeeping</span>
          </button>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // WORKFLOW: RESOLVE ATTENTION MODAL
  // ──────────────────────────────────────────────────────────────────────────
  renderResolveAttentionModal() {
    if (!this.activeResolveAttention) return '';
    const r = this.activeResolveAttention;

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-rose-800 font-data-mono">Exception Resolution</span>
              <h2 class="font-headline-sm text-base font-bold text-primary">Resolve Attention — Room ${r.roomNumber}</h2>
            </div>
            <button id="btn-close-resolve-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-4 text-xs">
            <div class="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-950 space-y-1">
              <div class="font-bold text-sm">Guest: ${r.guest?.name || 'Incoming Guest'}</div>
              <div class="text-[11px] font-data-mono">Arrival: ${r.guest?.arrival || '12:30 PM'}</div>
              <div class="font-semibold text-rose-900 mt-1">Status: Room is still DIRTY (Not ready for arrival).</div>
            </div>

            <div class="space-y-2">
              <button id="btn-resolve-rush-clean" class="w-full p-3 rounded-xl border border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 text-left transition-all cursor-pointer">
                <div class="font-bold text-primary flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[18px]">cleaning_services</span>
                  <span>Dispatch Priority Rush Housekeeping</span>
                </div>
                <p class="text-[11px] text-on-surface-variant mt-0.5">Alerts Floor Supervisor to prioritize Room ${r.roomNumber} immediately.</p>
              </button>

              <button id="btn-resolve-reassign" class="w-full p-3 rounded-xl border border-outline-variant hover:border-primary bg-surface-container-high/30 hover:bg-surface-container-high/60 text-left transition-all cursor-pointer">
                <div class="font-bold text-primary flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[18px]">sync_alt</span>
                  <span>Reassign Guest to a Ready Room</span>
                </div>
                <p class="text-[11px] text-on-surface-variant mt-0.5">Transfer ${r.guest?.name} to Room 403 or 406 (Clean & Ready right now).</p>
              </button>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-outline-variant/70 bg-surface-bright flex items-center justify-end">
            <button id="btn-cancel-resolve" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
          </div>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // WORKFLOW: ASSIGN ROOM MODAL
  // ──────────────────────────────────────────────────────────────────────────
  renderAssignRoomModal() {
    if (!this.activeAssignRoom) return '';
    const r = this.activeAssignRoom;

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-800 font-data-mono">Room Assignment</span>
              <h2 class="font-headline-sm text-base font-bold text-primary">Assign Room ${r.roomNumber} (${r.roomType})</h2>
            </div>
            <button id="btn-close-assign-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-3.5 text-xs">
            <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-medium">
              Room ${r.roomNumber} is <strong>VACANT</strong> and <strong>✓ READY</strong> for assignment.
            </div>

            <div class="space-y-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono block">
                Select Arriving Guest
              </span>
              ${this.availableReservations
                .map(
                  (res, idx) => `
                <label class="flex items-center justify-between p-3 rounded-xl border border-outline-variant bg-surface-container/30 hover:border-primary cursor-pointer transition-all">
                  <div class="flex items-center gap-2.5">
                    <input type="radio" name="board-assign-res" value="${res.id}" ${idx === 0 ? 'checked' : ''} class="accent-primary" />
                    <div>
                      <div class="font-bold text-primary">${res.guestName}</div>
                      <div class="text-[10px] text-on-surface-variant font-data-mono">${res.reservationNumber} • ETA: ${res.eta}</div>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary font-data-mono">${res.roomType}</span>
                </label>
              `
                )
                .join('')}
            </div>
          </div>

          <div class="px-6 py-4 border-t border-outline-variant/70 bg-surface-bright flex items-center justify-end gap-2">
            <button id="btn-cancel-assign" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-confirm-assign" class="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm cursor-pointer transition-all">Assign Room</button>
          </div>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // WORKFLOW: CHANGE ROOM MODAL
  // ──────────────────────────────────────────────────────────────────────────
  renderChangeRoomModal() {
    if (!this.activeChangeRoom) return '';
    const r = this.activeChangeRoom;
    const readyAlternatives = this.rooms.filter(
      (x) => x.id !== r.id && x.operationalState === 'READY' && x.housekeepingStatus === 'CLEAN'
    );

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-primary font-data-mono">Room Relocation</span>
              <h2 class="font-headline-sm text-base font-bold text-primary">Change Room — ${r.guest?.name || 'Guest'}</h2>
            </div>
            <button id="btn-close-change-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-3.5 text-xs">
            <div class="p-3 bg-surface-container rounded-xl border border-outline-variant/60 flex justify-between">
              <div>
                <span class="text-[10px] text-on-surface-variant block font-data-mono">Current Room:</span>
                <strong class="text-primary text-sm">Room ${r.roomNumber} (${r.roomType})</strong>
              </div>
              <div class="text-right">
                <span class="text-[10px] text-on-surface-variant block font-data-mono">Guest:</span>
                <strong class="text-primary">${r.guest?.name}</strong>
              </div>
            </div>

            <div class="space-y-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono block">
                Select Ready Alternative Room
              </span>
              <div class="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                ${readyAlternatives.map((alt, idx) => `
                  <label class="flex items-center justify-between p-2.5 rounded-xl border border-outline-variant bg-surface-container/30 hover:border-primary cursor-pointer transition-all">
                    <div class="flex items-center gap-2.5">
                      <input type="radio" name="board-new-room" value="${alt.id}" ${idx === 0 ? 'checked' : ''} class="accent-primary" />
                      <div>
                        <span class="font-bold text-primary font-data-mono">Room ${alt.roomNumber}</span>
                        <span class="text-xs text-on-surface-variant block">${alt.roomType} • Floor ${alt.floor}</span>
                      </div>
                    </div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">Available Now</span>
                  </label>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-outline-variant/70 bg-surface-bright flex items-center justify-end gap-2">
            <button id="btn-cancel-change" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-confirm-change" class="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm cursor-pointer hover:bg-primary/90 transition-all">Confirm Relocation</button>
          </div>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // WORKFLOW: MAINTENANCE ISSUE & UPDATE STATUS MODALS
  // ──────────────────────────────────────────────────────────────────────────
  renderMaintenanceIssueModal() {
    if (!this.activeMaintenanceIssue) return '';
    const r = this.activeMaintenanceIssue;

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-neutral-800 font-data-mono">Engineering Ticket</span>
              <h2 class="font-headline-sm text-base font-bold text-primary">Out of Order — Room ${r.roomNumber}</h2>
            </div>
            <button id="btn-close-issue-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-3 text-xs">
            <div class="p-3.5 bg-neutral-100 rounded-xl border border-neutral-300 space-y-1.5">
              <div class="font-bold text-base text-neutral-900">${r.maintenanceIssue?.reason || 'AC Failure'}</div>
              <div class="text-xs text-neutral-700 font-data-mono">Expected Return: <strong>${r.maintenanceIssue?.expectedReturn || '10 Sep 2026'}</strong></div>
              <div class="text-xs text-neutral-700">${r.maintenanceIssue?.notes || 'Compressor replacement part on order.'}</div>
              <div class="text-[10px] text-neutral-500 pt-1">Assigned Tech: ${r.maintenanceIssue?.technician || 'Rajesh Kumar'}</div>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-outline-variant/70 bg-surface-bright flex items-center justify-end gap-2">
            <button id="btn-resolve-issue-done" class="px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold shadow-sm cursor-pointer hover:bg-emerald-800 transition-all">Mark Repaired & Ready</button>
          </div>
        </div>
      </div>
    `;
  }

  renderUpdateStatusModal() {
    if (!this.activeUpdateStatusRoom) return '';
    const r = this.activeUpdateStatusRoom;

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-primary font-data-mono">Quick Status Transition</span>
              <h2 class="font-headline-sm text-base font-bold text-primary">Room ${r.roomNumber} Status</h2>
            </div>
            <button id="btn-close-status-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-3 text-xs">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Select Operational State</label>
              <select id="sel-board-new-status" class="w-full py-2.5 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer font-semibold">
                <option value="READY" ${r.operationalState === 'READY' ? 'selected' : ''}>✓ READY (Clean & Available)</option>
                <option value="CLEANING" ${r.operationalState === 'CLEANING' ? 'selected' : ''}>🟡 CLEANING (Housekeeping in progress)</option>
                <option value="NEEDS_CLEANING" ${r.housekeepingStatus === 'DIRTY' ? 'selected' : ''}>DIRTY (Needs cleaning)</option>
                <option value="MAINTENANCE" ${r.operationalState === 'MAINTENANCE' ? 'selected' : ''}>OUT OF ORDER (Maintenance Hold)</option>
              </select>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-outline-variant/70 bg-surface-bright flex items-center justify-end gap-2">
            <button id="btn-cancel-status" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-save-status" class="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm cursor-pointer hover:bg-primary/90 transition-all">Save State</button>
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

    // Refresh Button
    const btnRefresh = this.container.querySelector('#btn-board-refresh');
    if (btnRefresh) {
      btnRefresh.onclick = () => {
        this.isLoading = true;
        this.renderContent();
        setTimeout(() => {
          this.isLoading = false;
          this.lastUpdated = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
          Toast.show({ title: 'Room Board Updated', message: 'Room board synced with live hotel PMS telemetry.', type: 'success' });
          this.renderContent();
        }, 400);
      };
    }

    // Floor Selector Dropdown & Tabs
    const selFloor = this.container.querySelector('#sel-board-floor');
    if (selFloor) {
      selFloor.onchange = (e) => {
        this.selectedFloor = e.target.value;
        this.renderContent();
      };
    }

    this.container.querySelectorAll('.btn-floor-tab').forEach((tab) => {
      tab.onclick = () => {
        this.selectedFloor = tab.dataset.floor;
        this.renderContent();
      };
    });

    // Room Type Dropdown
    const selType = this.container.querySelector('#sel-board-type');
    if (selType) {
      selType.onchange = (e) => {
        this.selectedRoomType = e.target.value;
        this.renderContent();
      };
    }

    // Summary Cards Clickable Filters
    this.container.querySelectorAll('.card-summary-metric').forEach((card) => {
      card.onclick = () => {
        this.activeQuickFilter = card.dataset.filter;
        this.renderContent();
      };
    });

    // Filter Chips
    this.container.querySelectorAll('.btn-board-filter').forEach((btn) => {
      btn.onclick = () => {
        this.activeQuickFilter = btn.dataset.filter;
        this.renderContent();
      };
    });

    // Search Input
    const searchInput = this.container.querySelector('#input-board-search');
    if (searchInput) {
      searchInput.oninput = (e) => {
        this.searchQuery = e.target.value;
        this.renderContent();
        const input = this.container.querySelector('#input-board-search');
        if (input) {
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        }
      };
    }

    const btnClearSearch = this.container.querySelector('#btn-clear-board-search');
    if (btnClearSearch) {
      btnClearSearch.onclick = () => {
        this.searchQuery = '';
        this.renderContent();
      };
    }

    const btnClearAll = this.container.querySelector('#btn-clear-all-filters');
    if (btnClearAll) {
      btnClearAll.onclick = () => {
        this.searchQuery = '';
        this.selectedFloor = 'ALL';
        this.selectedRoomType = 'ALL';
        this.activeQuickFilter = 'ALL';
        this.renderContent();
      };
    }

    // Attention Required Items Actions
    this.container.querySelectorAll('.btn-resolve-item').forEach((btn) => {
      btn.onclick = () => {
        const item = this.rooms.find((x) => x.roomNumber === btn.dataset.item);
        if (item) {
          this.activeResolveAttention = item;
          this.renderContent();
        }
      };
    });

    this.container.querySelectorAll('.btn-review-item').forEach((btn) => {
      btn.onclick = () => {
        const item = this.rooms.find((x) => x.roomNumber === btn.dataset.item);
        if (item) {
          this.openTimelineDrawer(item.id);
        }
      };
    });

    this.container.querySelectorAll('.btn-view-issue-item').forEach((btn) => {
      btn.onclick = () => {
        const item = this.rooms.find((x) => x.roomNumber === btn.dataset.item);
        if (item) {
          this.activeMaintenanceIssue = item;
          this.renderContent();
        }
      };
    });

    this.container.querySelectorAll('.btn-view-guest-item').forEach((btn) => {
      btn.onclick = () => {
        const item = this.rooms.find((x) => x.roomNumber === btn.dataset.item);
        if (item) {
          this.openTimelineDrawer(item.id);
        }
      };
    });

    // Panel Quick Actions
    const btnContactHKQuick = this.container.querySelector('#btn-contact-housekeeping-quick');
    if (btnContactHKQuick) {
      btnContactHKQuick.onclick = () => {
        Toast.show({
          title: 'Priority Rush Cleaning Sent',
          message: 'Housekeeping supervisor dispatched to Room 508 for John Smith arrival.',
          type: 'success',
        });
        const rm = this.rooms.find((x) => x.roomNumber === '508');
        if (rm) {
          rm.housekeepingStatus = 'CLEANING';
          rm.operationalState = 'CLEANING';
          rm.warning = '🟡 Priority Rush Cleaning In Progress';
          this.renderContent();
        }
      };
    }

    const btnChangeRoomQuick = this.container.querySelector('#btn-change-room-quick');
    if (btnChangeRoomQuick) {
      btnChangeRoomQuick.onclick = () => {
        const rm = this.rooms.find((x) => x.roomNumber === '508');
        if (rm) {
          this.activeChangeRoom = rm;
          this.renderContent();
        }
      };
    }

    const btnNotReadyArrivals = this.container.querySelector('#btn-show-not-ready-arrivals');
    if (btnNotReadyArrivals) {
      btnNotReadyArrivals.onclick = () => {
        this.searchQuery = 'John Smith';
        this.renderContent();
      };
    }

    // Room Card click -> open timeline drawer
    this.container.querySelectorAll('.board-room-card').forEach((card) => {
      card.onclick = (e) => {
        if (e.target.closest('.btn-board-action')) return;
        this.openTimelineDrawer(card.dataset.rid);
      };
    });

    // Board Card Buttons
    this.container.querySelectorAll('.btn-board-action').forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const rid = btn.dataset.rid;
        const r = this.rooms.find((x) => x.id === rid);
        if (!r) return;

        const action = btn.dataset.action;
        if (action === 'assign') {
          this.activeAssignRoom = r;
          this.renderContent();
        } else if (action === 'view-issue') {
          this.activeMaintenanceIssue = r;
          this.renderContent();
        } else {
          this.openTimelineDrawer(rid);
        }
      };
    });

    // Drawer close
    const btnCloseDrawer = this.container.querySelector('#btn-close-board-drawer');
    if (btnCloseDrawer) btnCloseDrawer.onclick = () => this.closeTimelineDrawer();
    const backdrop = this.container.querySelector('#drawer-backdrop');
    if (backdrop) backdrop.onclick = () => this.closeTimelineDrawer();

    // Drawer internal buttons
    const btnDrawerAssign = this.container.querySelector('#btn-drawer-assign');
    if (btnDrawerAssign && this.activeDetailRoom) {
      btnDrawerAssign.onclick = () => {
        this.activeAssignRoom = this.activeDetailRoom;
        this.renderContent();
      };
    }

    const btnDrawerChangeRoom = this.container.querySelector('#btn-drawer-change-room');
    if (btnDrawerChangeRoom && this.activeDetailRoom) {
      btnDrawerChangeRoom.onclick = () => {
        this.activeChangeRoom = this.activeDetailRoom;
        this.renderContent();
      };
    }

    const btnDrawerUpdateStatus = this.container.querySelector('#btn-drawer-update-status');
    if (btnDrawerUpdateStatus && this.activeDetailRoom) {
      btnDrawerUpdateStatus.onclick = () => {
        this.activeUpdateStatusRoom = this.activeDetailRoom;
        this.renderContent();
      };
    }

    const btnDrawerContactHK = this.container.querySelector('#btn-drawer-contact-hk');
    if (btnDrawerContactHK && this.activeDetailRoom) {
      btnDrawerContactHK.onclick = () => {
        Toast.show({ title: 'Housekeeping Notified', message: `Cleaning task priority elevated for Room ${this.activeDetailRoom.roomNumber}.`, type: 'info' });
      };
    }

    // Modal: Resolve Attention Actions
    const btnCloseResolve = this.container.querySelector('#btn-close-resolve-modal');
    if (btnCloseResolve) btnCloseResolve.onclick = () => { this.activeResolveAttention = null; this.renderContent(); };
    const btnCancelResolve = this.container.querySelector('#btn-cancel-resolve');
    if (btnCancelResolve) btnCancelResolve.onclick = () => { this.activeResolveAttention = null; this.renderContent(); };

    const btnRushClean = this.container.querySelector('#btn-resolve-rush-clean');
    if (btnRushClean && this.activeResolveAttention) {
      btnRushClean.onclick = () => {
        const r = this.activeResolveAttention;
        r.housekeepingStatus = 'CLEANING';
        r.operationalState = 'CLEANING';
        r.warning = '🟡 Priority Rush Cleaning In Progress';
        r.timeline.unshift({ time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), text: 'Front Desk dispatched priority rush cleaning.' });
        this.activeResolveAttention = null;
        Toast.show({ title: 'Rush Cleaning Dispatched', message: `Floor Supervisor notified for Room ${r.roomNumber}.`, type: 'success' });
        this.renderContent();
      };
    }

    const btnReassignResolve = this.container.querySelector('#btn-resolve-reassign');
    if (btnReassignResolve && this.activeResolveAttention) {
      btnReassignResolve.onclick = () => {
        const r = this.activeResolveAttention;
        this.activeResolveAttention = null;
        this.activeChangeRoom = r;
        this.renderContent();
      };
    }

    // Modal: Assign Room
    const btnCloseAssign = this.container.querySelector('#btn-close-assign-modal');
    if (btnCloseAssign) btnCloseAssign.onclick = () => { this.activeAssignRoom = null; this.renderContent(); };
    const btnCancelAssign = this.container.querySelector('#btn-cancel-assign');
    if (btnCancelAssign) btnCancelAssign.onclick = () => { this.activeAssignRoom = null; this.renderContent(); };

    const btnConfirmAssign = this.container.querySelector('#btn-confirm-assign');
    if (btnConfirmAssign && this.activeAssignRoom) {
      btnConfirmAssign.onclick = () => {
        const r = this.activeAssignRoom;
        const selectedId = this.container.querySelector('input[name="board-assign-res"]:checked')?.value;
        const res = this.availableReservations.find((x) => x.id === selectedId) || this.availableReservations[0];

        r.operationalState = 'IN_HOUSE';
        r.occupancyStatus = 'OCCUPIED';
        r.guest = {
          name: res.guestName,
          vip: res.vip,
          reservationNumber: res.reservationNumber,
          stayDates: res.stayDates,
          departure: res.stayDates.split(' → ')[1] + ' • 11:00 AM',
          adults: 2,
        };
        r.timeline.unshift({ time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), text: `Assigned to ${res.guestName}` });

        this.availableReservations = this.availableReservations.filter((x) => x.id !== res.id);
        this.activeAssignRoom = null;
        Toast.show({ title: 'Room Assigned', message: `Room ${r.roomNumber} assigned to ${res.guestName}.`, type: 'success' });
        this.renderContent();
      };
    }

    // Modal: Change Room
    const btnCloseChange = this.container.querySelector('#btn-close-change-modal');
    if (btnCloseChange) btnCloseChange.onclick = () => { this.activeChangeRoom = null; this.renderContent(); };
    const btnCancelChange = this.container.querySelector('#btn-cancel-change');
    if (btnCancelChange) btnCancelChange.onclick = () => { this.activeChangeRoom = null; this.renderContent(); };

    const btnConfirmChange = this.container.querySelector('#btn-confirm-change');
    if (btnConfirmChange && this.activeChangeRoom) {
      btnConfirmChange.onclick = () => {
        const oldRoom = this.activeChangeRoom;
        const newRoomId = this.container.querySelector('input[name="board-new-room"]:checked')?.value;
        const newRoom = this.rooms.find((x) => x.id === newRoomId);

        if (newRoom) {
          const guest = oldRoom.guest;

          oldRoom.operationalState = 'READY';
          oldRoom.occupancyStatus = 'VACANT';
          oldRoom.guest = null;
          oldRoom.warning = null;
          oldRoom.timeline.unshift({ time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), text: `Guest relocated to Room ${newRoom.roomNumber}.` });

          newRoom.operationalState = 'IN_HOUSE';
          newRoom.occupancyStatus = 'OCCUPIED';
          newRoom.guest = guest;
          newRoom.timeline.unshift({ time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), text: `Guest relocated from Room ${oldRoom.roomNumber}.` });

          this.activeChangeRoom = null;
          this.activeDetailRoom = newRoom;
          Toast.show({ title: 'Relocation Complete', message: `${guest?.name} moved to Room ${newRoom.roomNumber}.`, type: 'success' });
          this.renderContent();
        }
      };
    }

    // Modal: Maintenance Issue
    const btnCloseIssue = this.container.querySelector('#btn-close-issue-modal');
    if (btnCloseIssue) btnCloseIssue.onclick = () => { this.activeMaintenanceIssue = null; this.renderContent(); };

    const btnResolveIssue = this.container.querySelector('#btn-resolve-issue-done');
    if (btnResolveIssue && this.activeMaintenanceIssue) {
      btnResolveIssue.onclick = () => {
        const r = this.activeMaintenanceIssue;
        r.operationalState = 'READY';
        r.maintenanceStatus = 'NORMAL';
        r.housekeepingStatus = 'CLEAN';
        r.warning = null;
        r.timeline.unshift({ time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), text: 'Maintenance resolved. Room tested and verified Ready.' });

        this.activeMaintenanceIssue = null;
        Toast.show({ title: 'Issue Resolved', message: `Room ${r.roomNumber} returned to active inventory.`, type: 'success' });
        this.renderContent();
      };
    }

    // Modal: Update Status
    const btnCloseStatus = this.container.querySelector('#btn-close-status-modal');
    if (btnCloseStatus) btnCloseStatus.onclick = () => { this.activeUpdateStatusRoom = null; this.renderContent(); };
    const btnCancelStatus = this.container.querySelector('#btn-cancel-status');
    if (btnCancelStatus) btnCancelStatus.onclick = () => { this.activeUpdateStatusRoom = null; this.renderContent(); };

    const btnSaveStatus = this.container.querySelector('#btn-save-status');
    if (btnSaveStatus && this.activeUpdateStatusRoom) {
      btnSaveStatus.onclick = () => {
        const r = this.activeUpdateStatusRoom;
        const val = this.container.querySelector('#sel-board-new-status')?.value;

        if (val === 'READY') {
          r.operationalState = 'READY';
          r.housekeepingStatus = 'CLEAN';
          r.maintenanceStatus = 'NORMAL';
          r.warning = null;
        } else if (val === 'CLEANING') {
          r.operationalState = 'CLEANING';
          r.housekeepingStatus = 'CLEANING';
        } else if (val === 'NEEDS_CLEANING') {
          r.housekeepingStatus = 'DIRTY';
        } else if (val === 'MAINTENANCE') {
          r.operationalState = 'MAINTENANCE';
          r.maintenanceStatus = 'OUT_OF_ORDER';
          r.warning = '⚫ OUT OF ORDER';
        }

        r.timeline.unshift({ time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), text: `State updated to ${val} by Front Desk.` });

        this.activeUpdateStatusRoom = null;
        Toast.show({ title: 'State Updated', message: `Room ${r.roomNumber} updated.`, type: 'success' });
        this.renderContent();
      };
    }
  }

  openTimelineDrawer(rid) {
    this.activeDetailRoom = this.rooms.find((r) => r.id === rid) || this.rooms[0];
    this.renderContent();
  }

  closeTimelineDrawer() {
    this.activeDetailRoom = null;
    this.renderContent();
  }
}
