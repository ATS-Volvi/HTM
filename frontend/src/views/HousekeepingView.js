// ==========================================================================
// VOLVITECH HOSPITALITY OS — HOUSEKEEPING DASHBOARD & OPERATIONS COMMAND
// Primary Operational System for Room Cleaning, Staff Workload & Inspection QA
// Actively Drives Room State Changes Reflected Across Front Desk & Room Board
// ==========================================================================

import { store } from '../state/store.js';
import { Toast } from '../components/Toast.js';

export class HousekeepingDashboardView {
  constructor() {
    this.container = null;
    this.isLoading = false;
    this.searchQuery = '';
    this.activeQuickFilter = 'ALL'; // 'ALL', 'TO_CLEAN', 'CLEANING', 'READY', 'INSPECTION', 'URGENT', 'ASSIGNED'

    // Dropdown Filters
    this.filters = {
      date: 'TODAY',
      floor: 'ALL',
      staff: 'ALL',
      status: 'ALL',
      cleaningType: 'ALL',
    };

    // Active Drawers & Modals
    this.activeTaskModal = null; // room task object for full detail drawer
    this.activeInspectionModal = null; // inspection review modal
    this.activeStaffAppModal = null; // staff app mobile simulator
    this.activeNewRequestModal = false; // add guest request modal
    this.activeLogLostFoundModal = false; // log lost & found item modal
    this.activeAssignModal = null; // quick assign modal

    // Core Operational State (Rooms & Tasks)
    this.tasks = this.generateInitialTasks();
    this.guestRequests = this.generateInitialRequests();
    this.lostAndFound = this.generateInitialLostAndFound();
    this.staffList = [
      { id: 'stf-1', name: 'Aisha', initials: 'AI', role: 'Floor Attendant', floor: '4 & 2', roomsCount: 6, maxRooms: 7 },
      { id: 'stf-2', name: 'Rahul', initials: 'RH', role: 'Senior Attendant', floor: '5', roomsCount: 5, maxRooms: 7 },
      { id: 'stf-3', name: 'Priya', initials: 'PR', role: 'Suite Specialist', floor: '6 & 4', roomsCount: 4, maxRooms: 6 },
      { id: 'stf-4', name: 'Carlos', initials: 'CR', role: 'Floor Attendant', floor: '3', roomsCount: 3, maxRooms: 7 },
    ];
  }

  // ──────────────────────────────────────────────────────────────────────────
  // INITIAL DATA (Realistic Hotel Housekeeping Tasks)
  // ──────────────────────────────────────────────────────────────────────────
  generateInitialTasks() {
    return [
      {
        id: 'task-508',
        roomNumber: '508',
        roomType: 'Deluxe King',
        floor: '5',
        guestName: 'John Smith',
        vip: false,
        cleaningType: 'Checkout Cleaning',
        priority: 'URGENT', // URGENT, HIGH, NORMAL, LOW
        status: 'DIRTY', // DIRTY, ASSIGNED, CLEANING, CLEANED, INSPECTION, FAILED, READY
        assignedTo: 'Rahul',
        nextArrival: 'Today • 12:30 PM (in 45 mins!)',
        urgentReason: 'Guest arriving in 45 minutes. Room still dirty.',
        createdAt: '10:15 AM',
        startedAt: null,
        completedAt: null,
        checklist: [
          { item: 'Strip bed linen and replace duvet', done: false },
          { item: 'Disinfect bathroom, tub and vanities', done: false },
          { item: 'Replenish luxury bath towels', done: false },
          { item: 'Restock premium amenities tray', done: false },
          { item: 'Vacuum carpet and mop tiles', done: false },
          { item: 'Dust surfaces, headboard and lamps', done: false },
          { item: 'Audit and restock minibar', done: false },
          { item: 'Verify climate control set to 21°C', done: false },
        ],
        inspection: null,
      },
      {
        id: 'task-615',
        roomNumber: '615',
        roomType: 'Presidential Suite',
        floor: '6',
        guestName: 'Aisha Al-Mansoor',
        vip: true,
        vipTier: 'VVIP Royal',
        cleaningType: 'Deep Cleaning',
        priority: 'HIGH',
        status: 'CLEANING',
        assignedTo: 'Priya',
        nextArrival: 'Today • 3:00 PM',
        urgentReason: 'Cleaning overdue. Started 85 minutes ago.',
        createdAt: '09:30 AM',
        startedAt: '10:15 AM',
        completedAt: null,
        checklist: [
          { item: 'Strip bed linen and replace duvet', done: true },
          { item: 'Disinfect bathroom, tub and vanities', done: true },
          { item: 'Replenish luxury bath towels', done: true },
          { item: 'Restock premium amenities tray', done: false },
          { item: 'Vacuum carpet and mop tiles', done: false },
          { item: 'Dust surfaces, headboard and lamps', done: false },
          { item: 'Audit and restock minibar', done: false },
          { item: 'Verify climate control set to 21°C', done: false },
        ],
        inspection: null,
      },
      {
        id: 'task-402',
        roomNumber: '402',
        roomType: 'Deluxe King',
        floor: '4',
        guestName: 'Sarah Mitchell',
        vip: true,
        vipTier: 'VIP',
        cleaningType: 'Checkout Cleaning',
        priority: 'HIGH',
        status: 'FAILED',
        assignedTo: 'Aisha',
        nextArrival: 'Today • 4:00 PM',
        urgentReason: 'Inspection failed. Missing minibar items.',
        createdAt: '11:20 AM',
        startedAt: '11:42 AM',
        completedAt: '1:05 PM',
        checklist: [
          { item: 'Strip bed linen and replace duvet', done: true },
          { item: 'Disinfect bathroom, tub and vanities', done: true },
          { item: 'Replenish luxury bath towels', done: true },
          { item: 'Restock premium amenities tray', done: true },
          { item: 'Vacuum carpet and mop tiles', done: true },
          { item: 'Dust surfaces, headboard and lamps', done: true },
          { item: 'Audit and restock minibar', done: false },
          { item: 'Verify climate control set to 21°C', done: true },
        ],
        inspection: {
          inspector: 'Supervisor Victoria S.',
          time: '01:15 PM',
          result: 'FAILED',
          failedReason: 'Missing minibar items (Imported Sparkling water & almonds missing).',
          items: [
            { name: 'Bathroom sanitization', pass: true },
            { name: 'Bed linen alignment', pass: true },
            { name: 'Amenities replenishment', pass: true },
            { name: 'Floor vacuuming', pass: true },
            { name: 'Minibar restocking', pass: false },
          ],
        },
      },
      {
        id: 'task-305',
        roomNumber: '305',
        roomType: 'Deluxe King',
        floor: '3',
        guestName: 'Vacant / Checkout',
        vip: false,
        cleaningType: 'Checkout Cleaning',
        priority: 'HIGH',
        status: 'DIRTY',
        assignedTo: 'Unassigned',
        nextArrival: 'Today • 2:00 PM',
        urgentReason: 'Unassigned checkout turnaround. Arrival at 2:00 PM.',
        createdAt: '11:30 AM',
        startedAt: null,
        completedAt: null,
        checklist: [
          { item: 'Strip bed linen and replace duvet', done: false },
          { item: 'Disinfect bathroom, tub and vanities', done: false },
          { item: 'Replenish luxury bath towels', done: false },
          { item: 'Restock premium amenities tray', done: false },
          { item: 'Vacuum carpet and mop tiles', done: false },
          { item: 'Dust surfaces, headboard and lamps', done: false },
          { item: 'Audit and restock minibar', done: false },
          { item: 'Verify climate control set to 21°C', done: false },
        ],
        inspection: null,
      },
      {
        id: 'task-302',
        roomNumber: '302',
        roomType: 'Classic King',
        floor: '3',
        guestName: 'Vikram Singhania',
        vip: true,
        vipTier: 'VIP',
        cleaningType: 'Stayover Cleaning',
        priority: 'NORMAL',
        status: 'ASSIGNED',
        assignedTo: 'Aisha',
        nextArrival: 'In-House Stayover',
        urgentReason: null,
        createdAt: '09:00 AM',
        startedAt: null,
        completedAt: null,
        checklist: [
          { item: 'Make bed with existing linens', done: false },
          { item: 'Clean bathroom vanity and replenish towels', done: false },
          { item: 'Empty wastebaskets', done: false },
          { item: 'Restock complimentary water & tea', done: false },
        ],
        inspection: null,
      },
      {
        id: 'task-501',
        roomNumber: '501',
        roomType: 'Luxury Suite',
        floor: '5',
        guestName: 'Elena Rostova',
        vip: false,
        cleaningType: 'Turnaround Cleaning',
        priority: 'NORMAL',
        status: 'INSPECTION',
        assignedTo: 'Rahul',
        nextArrival: 'Tomorrow • 11:00 AM',
        urgentReason: null,
        createdAt: '08:45 AM',
        startedAt: '09:30 AM',
        completedAt: '10:45 AM',
        checklist: [
          { item: 'Strip bed linen and replace duvet', done: true },
          { item: 'Disinfect bathroom, tub and vanities', done: true },
          { item: 'Replenish luxury bath towels', done: true },
          { item: 'Restock premium amenities tray', done: true },
          { item: 'Vacuum carpet and mop tiles', done: true },
          { item: 'Dust surfaces, headboard and lamps', done: true },
          { item: 'Audit and restock minibar', done: true },
          { item: 'Verify climate control set to 21°C', done: true },
        ],
        inspection: {
          inspector: 'Supervisor Victoria S.',
          time: 'Pending Inspection',
          result: 'PENDING',
          failedReason: null,
          items: [
            { name: 'Bathroom sanitization', pass: true },
            { name: 'Bed linen alignment', pass: true },
            { name: 'Amenities replenishment', pass: true },
            { name: 'Floor vacuuming', pass: true },
            { name: 'Minibar restocking', pass: true },
          ],
        },
      },
      {
        id: 'task-310',
        roomNumber: '310',
        roomType: 'Deluxe King',
        floor: '3',
        guestName: 'David Miller',
        vip: false,
        cleaningType: 'Checkout Cleaning',
        priority: 'NORMAL',
        status: 'CLEANED',
        assignedTo: 'Carlos',
        nextArrival: 'Today • 5:30 PM',
        urgentReason: null,
        createdAt: '10:00 AM',
        startedAt: '10:30 AM',
        completedAt: '11:45 AM',
        checklist: [
          { item: 'Strip bed linen and replace duvet', done: true },
          { item: 'Disinfect bathroom, tub and vanities', done: true },
          { item: 'Replenish luxury bath towels', done: true },
          { item: 'Restock premium amenities tray', done: true },
          { item: 'Vacuum carpet and mop tiles', done: true },
          { item: 'Dust surfaces, headboard and lamps', done: true },
          { item: 'Audit and restock minibar', done: true },
          { item: 'Verify climate control set to 21°C', done: true },
        ],
        inspection: null,
      },
      {
        id: 'task-204',
        roomNumber: '204',
        roomType: 'Classic King',
        floor: '2',
        guestName: 'Carlos Rodriguez',
        vip: false,
        cleaningType: 'Turndown',
        priority: 'NORMAL',
        status: 'READY',
        assignedTo: 'Unassigned',
        nextArrival: 'Ready for Assignment',
        urgentReason: null,
        createdAt: '08:00 AM',
        startedAt: '08:30 AM',
        completedAt: '09:15 AM',
        checklist: [
          { item: 'Turn down bed sheets', done: true },
          { item: 'Place bedside slippers & water', done: true },
          { item: 'Dim lighting & close drapes', done: true },
        ],
        inspection: {
          inspector: 'Supervisor Victoria S.',
          time: '09:30 AM',
          result: 'PASSED',
          failedReason: null,
          items: [{ name: 'Turndown quality', pass: true }],
        },
      },
      {
        id: 'task-201',
        roomNumber: '201',
        roomType: 'Classic King',
        floor: '2',
        guestName: 'Robert Lang',
        vip: false,
        cleaningType: 'Stayover Cleaning',
        priority: 'NORMAL',
        status: 'CLEANING',
        assignedTo: 'Aisha',
        nextArrival: 'In-House Stayover',
        urgentReason: null,
        createdAt: '10:00 AM',
        startedAt: '11:00 AM',
        completedAt: null,
        checklist: [{ item: 'Daily stayover refresh', done: false }],
        inspection: null,
      },
      {
        id: 'task-401',
        roomNumber: '401',
        roomType: 'Executive Panoramic Suite',
        floor: '4',
        guestName: 'Lady Eleanor Vance',
        vip: true,
        vipTier: 'VIP',
        cleaningType: 'Deep Cleaning',
        priority: 'NORMAL',
        status: 'CLEANING',
        assignedTo: 'Priya',
        nextArrival: 'In-House VIP Stay',
        urgentReason: null,
        createdAt: '09:30 AM',
        startedAt: '10:00 AM',
        completedAt: null,
        checklist: [{ item: 'VIP fragrance refresh & fresh roses', done: true }],
        inspection: null,
      },
      {
        id: 'task-102',
        roomNumber: '102',
        roomType: 'Classic Queen',
        floor: '1',
        guestName: 'Vacant',
        vip: false,
        cleaningType: 'Re-clean',
        priority: 'NORMAL',
        status: 'DIRTY',
        assignedTo: 'Unassigned',
        nextArrival: 'Today • 6:00 PM',
        urgentReason: null,
        createdAt: '11:00 AM',
        startedAt: null,
        completedAt: null,
        checklist: [{ item: 'Balcony glass polish', done: false }],
        inspection: null,
      },
      {
        id: 'task-104',
        roomNumber: '104',
        roomType: 'Classic King',
        floor: '1',
        guestName: 'Vacant',
        vip: false,
        cleaningType: 'Special Cleaning',
        priority: 'NORMAL',
        status: 'DIRTY',
        assignedTo: 'Unassigned',
        nextArrival: 'Tomorrow',
        urgentReason: null,
        createdAt: '11:15 AM',
        startedAt: null,
        completedAt: null,
        checklist: [{ item: 'Carpet shampooing post-spill', done: false }],
        inspection: null,
      },
    ];
  }

  generateInitialRequests() {
    return [
      { id: 'req-1', roomNumber: '402', item: 'Extra Pillow', guestName: 'Sarah Mitchell', time: '10:42 AM', assignedTo: 'Aisha', status: 'In Delivery' },
      { id: 'req-2', roomNumber: '508', item: 'Extra Towels (Bath & Face)', guestName: 'John Smith', time: '11:02 AM', assignedTo: 'Unassigned', status: 'Pending' },
      { id: 'req-3', roomNumber: '615', item: 'Baby Cot & Wooden Crib', guestName: 'Aisha Al-Mansoor', time: '11:15 AM', assignedTo: 'Priya', status: 'Assigned' },
      { id: 'req-4', roomNumber: '304', item: 'Iron and Board', guestName: 'Sophia Laurent', time: '11:30 AM', assignedTo: 'Carlos', status: 'Completed' },
      { id: 'req-5', roomNumber: '201', item: 'Toiletries Replenishment (L’Occitane)', guestName: 'Robert Lang', time: '11:45 AM', assignedTo: 'Unassigned', status: 'Pending' },
    ];
  }

  generateInitialLostAndFound() {
    return [
      { id: 'LF-00281', roomNumber: '402', item: 'Black Montblanc leather wallet', foundBy: 'Aisha', date: '8 Sep • 11:42 AM', status: 'STORED', location: 'Safe Box B-14' },
      { id: 'LF-00282', roomNumber: '508', item: 'Apple MagSafe iPhone Charger (White)', foundBy: 'Rahul', date: '7 Sep • 04:15 PM', status: 'FOUND', location: 'Housekeeping Desk Shelf 2' },
      { id: 'LF-00283', roomNumber: '615', item: '18k Gold Plated Bracelet', foundBy: 'Priya', date: '6 Sep • 01:20 PM', status: 'STORED', location: 'Duty Manager Vault' },
    ];
  }

  // ──────────────────────────────────────────────────────────────────────────
  // OPERATIONAL KPI METRICS (Exact numbers from Specification)
  // ──────────────────────────────────────────────────────────────────────────
  getSummaryMetrics() {
    return {
      roomsToClean: 18,
      cleaning: 7,
      ready: 21,
      inspection: 4,
      urgent: 2,
      assigned: '16 / 18',
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FILTERING LOGIC
  // ──────────────────────────────────────────────────────────────────────────
  getFilteredTasks() {
    let list = [...this.tasks];

    // Search query: room, guest or task
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter((t) => {
        const matchRoom = t.roomNumber.toLowerCase().includes(q);
        const matchGuest = t.guestName.toLowerCase().includes(q);
        const matchType = t.cleaningType.toLowerCase().includes(q);
        const matchStaff = t.assignedTo.toLowerCase().includes(q);
        return matchRoom || matchGuest || matchType || matchStaff;
      });
    }

    // Quick Filter Chips / KPI Clicks
    if (this.activeQuickFilter === 'TO_CLEAN') {
      list = list.filter((t) => t.status === 'DIRTY' || t.status === 'ASSIGNED');
    } else if (this.activeQuickFilter === 'CLEANING') {
      list = list.filter((t) => t.status === 'CLEANING');
    } else if (this.activeQuickFilter === 'READY') {
      list = list.filter((t) => t.status === 'READY');
    } else if (this.activeQuickFilter === 'INSPECTION') {
      list = list.filter((t) => t.status === 'INSPECTION' || t.status === 'FAILED');
    } else if (this.activeQuickFilter === 'URGENT') {
      list = list.filter((t) => t.priority === 'URGENT' || t.priority === 'HIGH');
    } else if (this.activeQuickFilter === 'ASSIGNED') {
      list = list.filter((t) => t.assignedTo !== 'Unassigned');
    }

    // Dropdown Filters
    if (this.filters.floor !== 'ALL') {
      list = list.filter((t) => t.floor === this.filters.floor);
    }
    if (this.filters.staff !== 'ALL') {
      list = list.filter((t) => t.assignedTo.toLowerCase() === this.filters.staff.toLowerCase());
    }
    if (this.filters.status !== 'ALL') {
      list = list.filter((t) => t.status.toLowerCase() === this.filters.status.toLowerCase());
    }
    if (this.filters.cleaningType !== 'ALL') {
      list = list.filter((t) => t.cleaningType.toLowerCase() === this.filters.cleaningType.toLowerCase());
    }

    // Intelligent Sorting: URGENT first, then arrival countdowns, VIPs
    const priorityWeight = { URGENT: 4, HIGH: 3, NORMAL: 2, LOW: 1 };
    list.sort((a, b) => {
      const pDiff = (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
      if (pDiff !== 0) return pDiff;
      if (a.vip && !b.vip) return -1;
      if (!a.vip && b.vip) return 1;
      return 0;
    });

    return list;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MAIN RENDER
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
    const filteredTasks = this.getFilteredTasks();

    this.container.innerHTML = `
      <!-- ================================================================= -->
      <!-- HEADER & OPERATIONAL CONTROLS -->
      <!-- ================================================================= -->
      <section class="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-outline-variant/60">
        <div>
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant font-data-mono">VOLVITECH HOSPITALITY OS</span>
            <span class="text-on-surface-variant font-data-mono">→</span>
            <span class="text-xs font-semibold uppercase tracking-wider text-primary font-data-mono font-bold">Housekeeping</span>
            <span class="text-on-surface-variant font-data-mono">•</span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              <span class="material-symbols-outlined text-[14px]">cleaning_services</span>
              Room Turnover &amp; Operational Quality
            </span>
          </div>
          <h1 class="font-headline-lg text-2xl sm:text-3xl font-bold text-primary tracking-tight">Housekeeping</h1>
          <p class="text-sm text-on-surface-variant mt-0.5">Today's room cleaning and operational tasks.</p>
        </div>

        <div class="flex items-center gap-3 flex-wrap">
          <button id="btn-open-staff-app" class="px-4 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container hover:border-primary text-primary font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
            <span class="material-symbols-outlined text-[18px]">smartphone</span>
            <span>Staff App (Mobile View)</span>
          </button>

          <div class="text-xs text-on-surface-variant font-data-mono hidden sm:block">
            Last updated: <strong class="text-primary">Just now</strong>
          </div>

          <button id="btn-refresh-housekeeping" class="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
            <span class="material-symbols-outlined text-[18px]">refresh</span>
            <span>Refresh</span>
          </button>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- CORE ROOM WORKFLOW VISUAL STEPPER BANNER -->
      <!-- ================================================================= -->
      <section class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/70 shadow-xs">
        <div class="flex items-center justify-between pb-2 mb-3 border-b border-outline-variant/40">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-primary">linear_scale</span>
            <span class="text-xs font-bold uppercase tracking-wider text-primary font-data-mono">Core Operational Room Workflow</span>
          </div>
          <span class="text-[11px] text-on-surface-variant font-data-mono">Click a stage to filter active rooms</span>
        </div>

        <div class="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs font-data-mono">
          <!-- DIRTY -->
          <div class="workflow-step-btn p-2.5 rounded-xl border cursor-pointer transition-all ${
            this.filters.status === 'DIRTY' ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-400/20' : 'bg-surface-bright border-outline-variant hover:border-primary/50'
          }" data-status="DIRTY">
            <span class="text-[10px] font-bold uppercase text-rose-800 block">DIRTY</span>
            <span class="text-lg font-black text-rose-800">18</span>
            <span class="text-[9px] text-on-surface-variant block">Rooms Pending</span>
          </div>

          <!-- ASSIGNED -->
          <div class="workflow-step-btn p-2.5 rounded-xl border cursor-pointer transition-all ${
            this.filters.status === 'ASSIGNED' ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-400/20' : 'bg-surface-bright border-outline-variant hover:border-primary/50'
          }" data-status="ASSIGNED">
            <span class="text-[10px] font-bold uppercase text-blue-900 block">ASSIGNED</span>
            <span class="text-lg font-black text-blue-900">16</span>
            <span class="text-[9px] text-on-surface-variant block">To Attendants</span>
          </div>

          <!-- CLEANING -->
          <div class="workflow-step-btn p-2.5 rounded-xl border cursor-pointer transition-all ${
            this.filters.status === 'CLEANING' ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/20' : 'bg-surface-bright border-outline-variant hover:border-primary/50'
          }" data-status="CLEANING">
            <span class="text-[10px] font-bold uppercase text-amber-900 block">CLEANING</span>
            <span class="text-lg font-black text-amber-800">7</span>
            <span class="text-[9px] text-on-surface-variant block">In Progress</span>
          </div>

          <!-- CLEANED -->
          <div class="workflow-step-btn p-2.5 rounded-xl border cursor-pointer transition-all ${
            this.filters.status === 'CLEANED' ? 'bg-cyan-50 border-cyan-400 ring-2 ring-cyan-400/20' : 'bg-surface-bright border-outline-variant hover:border-primary/50'
          }" data-status="CLEANED">
            <span class="text-[10px] font-bold uppercase text-cyan-900 block">CLEANED</span>
            <span class="text-lg font-black text-cyan-900">5</span>
            <span class="text-[9px] text-on-surface-variant block">Ready for QA</span>
          </div>

          <!-- INSPECTION (includes FAILED branch) -->
          <div class="workflow-step-btn p-2.5 rounded-xl border cursor-pointer transition-all ${
            this.filters.status === 'INSPECTION' || this.filters.status === 'FAILED' ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-400/20' : 'bg-surface-bright border-outline-variant hover:border-primary/50'
          }" data-status="INSPECTION">
            <span class="text-[10px] font-bold uppercase text-purple-900 block">INSPECTION</span>
            <span class="text-lg font-black text-purple-900">4 <span class="text-[11px] text-rose-600 font-bold">(1 Failed)</span></span>
            <span class="text-[9px] text-on-surface-variant block">Supervisor QA</span>
          </div>

          <!-- READY -->
          <div class="workflow-step-btn p-2.5 rounded-xl border cursor-pointer transition-all ${
            this.filters.status === 'READY' ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/20' : 'bg-surface-bright border-outline-variant hover:border-primary/50'
          }" data-status="READY">
            <span class="text-[10px] font-bold uppercase text-emerald-800 block">READY</span>
            <span class="text-lg font-black text-emerald-800">21</span>
            <span class="text-[9px] text-on-surface-variant block">Available at Desk</span>
          </div>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- SUMMARY CARDS (Operational Workload Indicators) -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <!-- 1. ROOMS TO CLEAN -->
        <div class="card-hk-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'TO_CLEAN'
            ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
            : 'border-outline-variant/70 hover:border-primary/50 hover:shadow-xs'
        }" data-filter="TO_CLEAN">
          <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">ROOMS TO CLEAN</div>
          <div class="text-3xl font-black text-primary font-headline-lg tracking-tight">${metrics.roomsToClean}</div>
          <div class="text-xs text-on-surface-variant mt-0.5">Total backlog</div>
        </div>

        <!-- 2. CLEANING -->
        <div class="card-hk-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'CLEANING'
            ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-amber-400 hover:shadow-xs'
        }" data-filter="CLEANING">
          <div class="text-[10px] font-bold uppercase tracking-wider text-amber-900 mb-1 font-data-mono flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-amber-700 animate-spin">sync</span>
            CLEANING
          </div>
          <div class="text-3xl font-black text-amber-800 font-headline-lg tracking-tight font-data-mono">${metrics.cleaning}</div>
          <div class="text-xs text-amber-800 mt-0.5">Active on floors</div>
        </div>

        <!-- 3. READY -->
        <div class="card-hk-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'READY'
            ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-emerald-500/50 hover:shadow-xs'
        }" data-filter="READY">
          <div class="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1 font-data-mono flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            READY
          </div>
          <div class="text-3xl font-black text-emerald-700 font-headline-lg tracking-tight font-data-mono">${metrics.ready}</div>
          <div class="text-xs text-emerald-800 mt-0.5">Inspected &amp; released</div>
        </div>

        <!-- 4. INSPECTION -->
        <div class="card-hk-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'INSPECTION'
            ? 'border-purple-400 ring-2 ring-purple-400/20 bg-purple-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-purple-400 hover:shadow-xs'
        }" data-filter="INSPECTION">
          <div class="text-[10px] font-bold uppercase tracking-wider text-purple-900 mb-1 font-data-mono flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-purple-700">verified</span>
            INSPECTION
          </div>
          <div class="text-3xl font-black text-purple-900 font-headline-lg tracking-tight font-data-mono">${metrics.inspection}</div>
          <div class="text-xs text-purple-900 mt-0.5">Awaiting supervisor</div>
        </div>

        <!-- 5. URGENT -->
        <div class="card-hk-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'URGENT'
            ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-rose-400 hover:shadow-xs'
        }" data-filter="URGENT">
          <div class="text-[10px] font-bold uppercase tracking-wider text-rose-900 mb-1 font-data-mono flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
            URGENT
          </div>
          <div class="text-3xl font-black text-rose-800 font-headline-lg tracking-tight font-data-mono">${metrics.urgent}</div>
          <div class="text-xs text-rose-800 mt-0.5">Imminent arrivals</div>
        </div>

        <!-- 6. ASSIGNED -->
        <div class="card-hk-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'ASSIGNED'
            ? 'border-blue-400 ring-2 ring-blue-400/20 bg-blue-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-blue-400 hover:shadow-xs'
        }" data-filter="ASSIGNED">
          <div class="text-[10px] font-bold uppercase tracking-wider text-blue-900 mb-1 font-data-mono flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-blue-700">group</span>
            ASSIGNED
          </div>
          <div class="text-3xl font-black text-blue-900 font-headline-lg tracking-tight font-data-mono">${metrics.assigned}</div>
          <div class="text-xs text-blue-900 mt-0.5">Staff coverage</div>
        </div>

      </section>

      <!-- ================================================================= -->
      <!-- ATTENTION REQUIRED (Operational Exceptions Section) -->
      <!-- ================================================================= -->
      <section class="bg-rose-50/40 border border-rose-200/80 rounded-2xl p-5 shadow-xs space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-rose-700 text-[20px]">warning</span>
            <h3 class="font-headline-sm text-sm font-bold text-rose-950 uppercase tracking-tight font-data-mono">
              ATTENTION REQUIRED (Operational Exceptions)
            </h3>
          </div>
          <span class="text-xs font-bold text-rose-900 font-data-mono">4 items needing supervisor intervention</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <!-- Exception 1 -->
          <div class="p-3.5 bg-surface-container-lowest rounded-xl border border-rose-300 shadow-xs flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="font-black text-rose-800 text-sm font-data-mono">🔴 Room 508</span>
                <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-900">URGENT</span>
              </div>
              <p class="text-xs text-on-surface font-semibold">Guest arriving in 45 minutes.</p>
              <p class="text-[11px] text-on-surface-variant mt-0.5">Room still dirty. Assigned to Rahul.</p>
            </div>
            <button class="btn-resolve-exception mt-3 w-full py-1.5 rounded-lg bg-rose-700 text-white font-bold text-xs hover:bg-rose-800 transition-all cursor-pointer" data-room="508">
              Resolve / Expedite
            </button>
          </div>

          <!-- Exception 2 -->
          <div class="p-3.5 bg-surface-container-lowest rounded-xl border border-rose-300 shadow-xs flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="font-black text-rose-800 text-sm font-data-mono">🔴 Room 615</span>
                <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-900">OVERDUE</span>
              </div>
              <p class="text-xs text-on-surface font-semibold">Cleaning overdue.</p>
              <p class="text-[11px] text-on-surface-variant mt-0.5">Started 85 mins ago by Priya (Suite turnaround).</p>
            </div>
            <button class="btn-resolve-exception mt-3 w-full py-1.5 rounded-lg border border-outline-variant text-primary font-bold text-xs hover:bg-surface-container transition-all cursor-pointer" data-room="615">
              View Task
            </button>
          </div>

          <!-- Exception 3 -->
          <div class="p-3.5 bg-surface-container-lowest rounded-xl border border-amber-300 shadow-xs flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="font-black text-amber-900 text-sm font-data-mono">🟡 Room 402</span>
                <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-900">QA FAILED</span>
              </div>
              <p class="text-xs text-on-surface font-semibold">Inspection failed.</p>
              <p class="text-[11px] text-on-surface-variant mt-0.5">Missing minibar items post-checkout.</p>
            </div>
            <button class="btn-open-inspection-modal mt-3 w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all cursor-pointer" data-room="402">
              Re-inspect
            </button>
          </div>

          <!-- Exception 4 -->
          <div class="p-3.5 bg-surface-container-lowest rounded-xl border border-amber-300 shadow-xs flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="font-black text-amber-900 text-sm font-data-mono">🟡 Room 305</span>
                <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-surface-container text-on-surface">UNASSIGNED</span>
              </div>
              <p class="text-xs text-on-surface font-semibold">Arrival at 2:00 PM.</p>
              <p class="text-[11px] text-on-surface-variant mt-0.5">Checkout turnaround not yet assigned to staff.</p>
            </div>
            <button class="btn-quick-assign-staff mt-3 w-full py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-all cursor-pointer" data-room="305">
              Assign Attendant
            </button>
          </div>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- SEARCH & MULTI-FILTER TOOLBAR -->
      <!-- ================================================================= -->
      <section class="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/70 shadow-xs space-y-4">
        
        <!-- Search bar -->
        <div class="relative">
          <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[22px]">search</span>
          <input
            type="text"
            id="input-hk-search"
            value="${this.searchQuery}"
            placeholder="Search room, guest or task..."
            class="w-full pl-12 pr-10 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold text-on-surface bg-surface-container-high/30 placeholder:text-on-surface-variant/80 transition-all outline-none"
          />
          ${
            this.searchQuery
              ? `<button id="btn-clear-hk-search" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary p-1 cursor-pointer">
                  <span class="material-symbols-outlined text-[18px]">close</span>
                </button>`
              : ''
          }
        </div>

        <!-- Controls & Secondary Dropdown Filters -->
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-outline-variant/40">
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Date</label>
            <select id="sel-filter-date" class="w-full py-2 px-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer font-medium">
              <option value="TODAY">Today ▾</option>
              <option value="TOMORROW">Tomorrow</option>
              <option value="WEEK">This Week</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Floors</label>
            <select id="sel-filter-floor" class="w-full py-2 px-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer font-medium">
              <option value="ALL" ${this.filters.floor === 'ALL' ? 'selected' : ''}>All Floors ▾</option>
              <option value="1" ${this.filters.floor === '1' ? 'selected' : ''}>Floor 1 (7 rooms)</option>
              <option value="2" ${this.filters.floor === '2' ? 'selected' : ''}>Floor 2 (4 rooms)</option>
              <option value="3" ${this.filters.floor === '3' ? 'selected' : ''}>Floor 3 (2 rooms)</option>
              <option value="4" ${this.filters.floor === '4' ? 'selected' : ''}>Floor 4 (3 rooms)</option>
              <option value="5" ${this.filters.floor === '5' ? 'selected' : ''}>Floor 5 (2 rooms)</option>
              <option value="6" ${this.filters.floor === '6' ? 'selected' : ''}>Floor 6 (Penthouse)</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Staff</label>
            <select id="sel-filter-staff" class="w-full py-2 px-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer font-medium">
              <option value="ALL" ${this.filters.staff === 'ALL' ? 'selected' : ''}>All Staff ▾</option>
              <option value="Aisha" ${this.filters.staff === 'Aisha' ? 'selected' : ''}>Aisha (6 rooms)</option>
              <option value="Rahul" ${this.filters.staff === 'Rahul' ? 'selected' : ''}>Rahul (5 rooms)</option>
              <option value="Priya" ${this.filters.staff === 'Priya' ? 'selected' : ''}>Priya (4 rooms)</option>
              <option value="Carlos" ${this.filters.staff === 'Carlos' ? 'selected' : ''}>Carlos (3 rooms)</option>
              <option value="Unassigned" ${this.filters.staff === 'Unassigned' ? 'selected' : ''}>Unassigned (3 rooms)</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Task Status</label>
            <select id="sel-filter-status" class="w-full py-2 px-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer font-medium">
              <option value="ALL" ${this.filters.status === 'ALL' ? 'selected' : ''}>All Status ▾</option>
              <option value="DIRTY" ${this.filters.status === 'DIRTY' ? 'selected' : ''}>Dirty</option>
              <option value="ASSIGNED" ${this.filters.status === 'ASSIGNED' ? 'selected' : ''}>Assigned</option>
              <option value="CLEANING" ${this.filters.status === 'CLEANING' ? 'selected' : ''}>Cleaning</option>
              <option value="CLEANED" ${this.filters.status === 'CLEANED' ? 'selected' : ''}>Cleaned</option>
              <option value="INSPECTION" ${this.filters.status === 'INSPECTION' ? 'selected' : ''}>Inspection</option>
              <option value="FAILED" ${this.filters.status === 'FAILED' ? 'selected' : ''}>Failed QA</option>
              <option value="READY" ${this.filters.status === 'READY' ? 'selected' : ''}>Ready</option>
            </select>
          </div>

          <div class="flex items-end justify-between gap-2 col-span-2 sm:col-span-1">
            <div class="py-1 px-1 text-xs font-bold text-primary font-data-mono">
              ${filteredTasks.length} Tasks
            </div>
            <button id="btn-reset-hk-filters" class="py-2 px-3 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary flex items-center justify-center gap-1 cursor-pointer transition-all">
              <span class="material-symbols-outlined text-[15px]">restart_alt</span>
              <span>Reset</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- FLOOR WORKLOAD & STAFF WORKLOAD (Side-by-Side Distribution) -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Floor Workload -->
        <div class="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/70 shadow-xs space-y-3.5">
          <div class="flex items-center justify-between pb-2 border-b border-outline-variant/40">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-primary">apartment</span>
              <span class="text-xs font-bold uppercase tracking-wider text-primary font-data-mono">FLOOR WORKLOAD</span>
            </div>
            <span class="text-[11px] text-on-surface-variant font-data-mono">Click floor to filter</span>
          </div>

          <div class="space-y-2.5">
            ${[
              { floor: '1', count: 7, total: 20, pct: 35 },
              { floor: '2', count: 4, total: 20, pct: 20 },
              { floor: '3', count: 2, total: 20, pct: 10 },
              { floor: '4', count: 3, total: 20, pct: 15 },
              { floor: '5', count: 2, total: 20, pct: 10 },
            ]
              .map(
                (f) => `
              <div class="floor-bar-item flex items-center justify-between gap-4 p-2 rounded-xl hover:bg-surface-container/50 cursor-pointer transition-colors" data-floor="${f.floor}">
                <div class="w-20 font-bold text-xs text-primary font-data-mono">Floor ${f.floor}</div>
                <div class="flex-1 h-3 rounded-full bg-surface-container-high overflow-hidden">
                  <div class="h-full bg-primary rounded-full" style="width: ${f.pct * 2.5}%"></div>
                </div>
                <div class="w-16 text-right font-black font-data-mono text-xs text-primary">${f.count} rooms</div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <!-- Staff Workload -->
        <div class="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/70 shadow-xs space-y-3.5">
          <div class="flex items-center justify-between pb-2 border-b border-outline-variant/40">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-primary">badge</span>
              <span class="text-xs font-bold uppercase tracking-wider text-primary font-data-mono">STAFF WORKLOAD &amp; COVERAGE</span>
            </div>
            <span class="text-[11px] text-on-surface-variant font-data-mono">Click staff to filter</span>
          </div>

          <div class="space-y-2.5">
            ${[
              { name: 'Aisha', count: 6, max: 7, pct: 85, color: 'bg-primary' },
              { name: 'Rahul', count: 5, max: 7, pct: 71, color: 'bg-primary' },
              { name: 'Priya', count: 4, max: 6, pct: 66, color: 'bg-primary' },
              { name: 'Unassigned', count: 3, max: 18, pct: 30, color: 'bg-amber-500' },
            ]
              .map(
                (s) => `
              <div class="staff-bar-item flex items-center justify-between gap-4 p-2 rounded-xl hover:bg-surface-container/50 cursor-pointer transition-colors" data-staff="${s.name}">
                <div class="w-24 font-bold text-xs ${s.name === 'Unassigned' ? 'text-amber-900' : 'text-primary'}">${s.name}</div>
                <div class="flex-1 h-3 rounded-full bg-surface-container-high overflow-hidden">
                  <div class="h-full ${s.color} rounded-full" style="width: ${s.pct}%"></div>
                </div>
                <div class="w-20 text-right font-black font-data-mono text-xs ${s.name === 'Unassigned' ? 'text-amber-900 font-bold' : 'text-primary'}">
                  ${s.count} rooms
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

      </section>

      <!-- ================================================================= -->
      <!-- TODAY'S HOUSEKEEPING WORK (Primary Task Section) -->
      <!-- ================================================================= -->
      <section class="space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px] text-primary">checklist</span>
            <h2 class="font-headline-sm text-lg font-bold text-primary">Today's Room Cleaning Tasks</h2>
          </div>
          <span class="text-xs font-bold text-on-surface-variant font-data-mono">${filteredTasks.length} Rooms Listed</span>
        </div>

        ${this.renderTaskListCards(filteredTasks)}
      </section>

      <!-- ================================================================= -->
      <!-- LOWER SECTION: GUEST REQUESTS & LOST & FOUND -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Operational Guest Requests -->
        <div class="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/70 shadow-xs space-y-3.5">
          <div class="flex items-center justify-between pb-2 border-b border-outline-variant/40">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-primary">room_service</span>
              <span class="text-xs font-bold uppercase tracking-wider text-primary font-data-mono">OPERATIONAL GUEST REQUESTS</span>
            </div>
            <button id="btn-add-hk-request" class="text-xs font-bold text-primary hover:underline cursor-pointer">
              + New Request
            </button>
          </div>

          <div class="space-y-2">
            ${this.guestRequests
              .map(
                (req) => `
              <div class="p-3 rounded-xl border border-outline-variant/70 bg-surface-container/20 flex items-center justify-between text-xs">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-black text-primary font-data-mono">Room ${req.roomNumber}</span>
                    <span class="font-bold text-on-surface">${req.item}</span>
                  </div>
                  <div class="text-[11px] text-on-surface-variant font-data-mono mt-0.5">
                    Requested ${req.time} • Assigned to <strong>${req.assignedTo}</strong>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold font-data-mono ${
                    req.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-900'
                      : req.status === 'In Delivery'
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-amber-100 text-amber-900'
                  }">${req.status}</span>
                  ${
                    req.status !== 'Completed'
                      ? `<button class="btn-complete-request px-2 py-1 rounded bg-primary text-on-primary text-[10px] font-bold cursor-pointer" data-reqid="${req.id}">
                          Complete
                        </button>`
                      : ''
                  }
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <!-- Lost & Found -->
        <div class="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/70 shadow-xs space-y-3.5">
          <div class="flex items-center justify-between pb-2 border-b border-outline-variant/40">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-primary">find_in_page</span>
              <span class="text-xs font-bold uppercase tracking-wider text-primary font-data-mono">LOST &amp; FOUND REPOSITORY</span>
            </div>
            <button id="btn-log-lost-found" class="text-xs font-bold text-primary hover:underline cursor-pointer">
              + Log Found Item
            </button>
          </div>

          <div class="space-y-2">
            ${this.lostAndFound
              .map(
                (item) => `
              <div class="p-3 rounded-xl border border-outline-variant/70 bg-surface-container/20 flex items-center justify-between text-xs">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-black text-primary font-data-mono">${item.id}</span>
                    <span class="font-bold text-on-surface">${item.item}</span>
                  </div>
                  <div class="text-[11px] text-on-surface-variant font-data-mono mt-0.5">
                    Room <strong>${item.roomNumber}</strong> • Found by ${item.foundBy} • ${item.date}
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold font-data-mono ${
                    item.status === 'STORED' ? 'bg-emerald-100 text-emerald-900' : 'bg-blue-100 text-blue-900'
                  }">${item.status}</span>
                  <button class="btn-view-lost-item px-2 py-1 rounded border border-outline-variant text-[10px] font-bold text-primary hover:bg-surface-container cursor-pointer" data-lfid="${item.id}">
                    View
                  </button>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

      </section>

      <!-- ================================================================= -->
      <!-- DRAWERS & WORKFLOW MODALS -->
      <!-- ================================================================= -->
      ${this.renderRoomTaskDetailDrawer()}
      ${this.renderInspectionModal()}
      ${this.renderStaffAppSimulator()}
      ${this.renderNewRequestModal()}
      ${this.renderLogLostFoundModal()}
      ${this.renderQuickAssignModal()}
    `;

    this.bindEvents();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TASK LIST CARDS
  // ──────────────────────────────────────────────────────────────────────────
  renderTaskListCards(tasks) {
    if (tasks.length === 0) {
      return `
        <div class="bg-surface-container-lowest rounded-2xl p-16 border border-outline-variant/70 text-center space-y-4 shadow-xs">
          <div class="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <span class="material-symbols-outlined text-[32px]">task_alt</span>
          </div>
          <div>
            <h3 class="font-headline-sm text-lg font-bold text-primary">No housekeeping tasks match your filter.</h3>
            <p class="text-xs text-on-surface-variant max-w-md mx-auto mt-1">
              All filtered rooms are currently inspected and available for guest allocation.
            </p>
          </div>
          <button id="btn-empty-reset-hk" class="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary/90 transition-all cursor-pointer">
            Reset Filters
          </button>
        </div>
      `;
    }

    return `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${tasks
          .map((t) => {
            const isUrgent = t.priority === 'URGENT';
            const isHigh = t.priority === 'HIGH';
            const isFailed = t.status === 'FAILED';
            const isReady = t.status === 'READY';

            return `
            <div class="bg-surface-container-lowest rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-md hover:border-primary/50 relative overflow-hidden ${
              isUrgent
                ? 'border-rose-300 ring-2 ring-rose-500/20 bg-rose-50/20'
                : isFailed
                ? 'border-amber-300 bg-amber-50/20'
                : 'border-outline-variant/70'
            }">
              
              <!-- Card Header -->
              <div>
                <div class="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-xl font-black font-data-mono text-primary">ROOM ${t.roomNumber}</span>
                      ${t.vip ? '<span class="text-amber-500 text-sm">⭐ VIP</span>' : ''}
                    </div>
                    <span class="text-xs font-semibold text-on-surface-variant">${t.roomType} • Floor ${t.floor}</span>
                  </div>

                  <!-- Cleaning Type Badge -->
                  <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase font-data-mono bg-primary/10 text-primary border border-primary/20">
                    ${t.cleaningType}
                  </span>
                </div>

                <!-- Guest & Stay -->
                <div class="p-2.5 rounded-xl bg-surface-bright border border-outline-variant/40 space-y-1 mb-3 text-xs">
                  <div class="flex justify-between">
                    <span class="text-on-surface-variant font-data-mono">Guest:</span>
                    <strong class="text-primary truncate max-w-[160px]">${t.guestName}</strong>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-on-surface-variant font-data-mono">Next Arrival:</span>
                    <strong class="${isUrgent ? 'text-rose-700 font-bold' : 'text-primary'}">${t.nextArrival}</strong>
                  </div>
                </div>

                <!-- Status & Priority Badges (Text with Icon, Never Color Alone) -->
                <div class="grid grid-cols-2 gap-2 text-xs mb-3 font-data-mono">
                  <div class="p-2 rounded-lg border bg-surface-container/30">
                    <span class="text-[9px] uppercase font-bold text-on-surface-variant block mb-0.5">STATUS</span>
                    <span class="font-bold flex items-center gap-1 ${
                      isReady ? 'text-emerald-800' : isFailed ? 'text-rose-700' : 'text-primary'
                    }">
                      <span class="w-1.5 h-1.5 rounded-full ${isReady ? 'bg-emerald-600' : isFailed ? 'bg-rose-600' : 'bg-primary'}"></span>
                      <span>${t.status}</span>
                    </span>
                  </div>

                  <div class="p-2 rounded-lg border bg-surface-container/30">
                    <span class="text-[9px] uppercase font-bold text-on-surface-variant block mb-0.5">PRIORITY</span>
                    <span class="font-bold ${isUrgent ? 'text-rose-700 animate-pulse' : isHigh ? 'text-amber-800' : 'text-primary'}">
                      ${t.priority}
                    </span>
                  </div>
                </div>

                <!-- Assigned Staff -->
                <div class="flex items-center justify-between text-xs py-1 border-t border-outline-variant/40">
                  <span class="text-on-surface-variant font-data-mono">Assigned Attendant:</span>
                  <span class="font-bold ${t.assignedTo === 'Unassigned' ? 'text-amber-900 font-black' : 'text-primary'}">
                    ${t.assignedTo === 'Unassigned' ? '⚠️ Unassigned' : t.assignedTo}
                  </span>
                </div>
              </div>

              <!-- Action Bar -->
              <div class="pt-3 mt-3 border-t border-outline-variant/40 flex items-center justify-between gap-2">
                ${
                  t.status === 'DIRTY' || t.status === 'ASSIGNED'
                    ? `<button class="btn-start-task-quick px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-xs cursor-pointer" data-taskid="${t.id}">
                        Start Cleaning
                      </button>`
                    : t.status === 'CLEANING'
                    ? `<button class="btn-clean-task-quick px-3 py-1.5 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold shadow-xs cursor-pointer" data-taskid="${t.id}">
                        Mark Cleaned
                      </button>`
                    : t.status === 'CLEANED' || t.status === 'INSPECTION'
                    ? `<button class="btn-inspect-task-quick px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs cursor-pointer" data-taskid="${t.id}">
                        Inspect Room
                      </button>`
                    : t.status === 'FAILED'
                    ? `<button class="btn-reinspect-task-quick px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-xs cursor-pointer" data-taskid="${t.id}">
                        Re-inspect
                      </button>`
                    : `<span class="text-emerald-800 font-bold text-xs flex items-center gap-1">✓ Ready for Front Desk</span>`
                }

                <button class="btn-view-task-drawer px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all cursor-pointer" data-taskid="${t.id}">
                  View Task
                </button>
              </div>

            </div>
          `;
          })
          .join('')}
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ROOM TASK DETAIL SLIDE-OVER DRAWER
  // ──────────────────────────────────────────────────────────────────────────
  renderRoomTaskDetailDrawer() {
    if (!this.activeTaskModal) return '';
    const t = this.activeTaskModal;

    return `
      <div id="hk-task-drawer-backdrop" class="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity duration-300 opacity-100 pointer-events-auto"></div>

      <aside id="hk-task-drawer" class="fixed top-0 right-0 h-full w-full max-w-xl bg-surface-container-lowest shadow-2xl z-50 border-l border-outline-variant flex flex-col transform transition-transform duration-300 ease-out">
        
        <!-- Header -->
        <div class="px-6 py-5 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between shrink-0">
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h2 class="font-headline-sm text-xl font-bold text-primary font-data-mono">ROOM ${t.roomNumber}</h2>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-data-mono bg-primary/10 text-primary border border-primary/20">
                ${t.cleaningType}
              </span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold font-data-mono ${
                t.status === 'READY' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
              }">${t.status}</span>
            </div>
            <p class="text-xs text-on-surface-variant font-data-mono mt-0.5">${t.roomType} • Floor ${t.floor}</p>
          </div>

          <button id="btn-close-task-drawer" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Scrollable Task Workspace -->
        <div class="p-6 overflow-y-auto flex-1 space-y-5 text-xs custom-scrollbar">
          
          <!-- Guest & Urgency Context -->
          <div class="bg-surface-bright p-4 rounded-xl border border-outline-variant/70 space-y-2">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono block pb-1 border-b border-outline-variant/40">
              GUEST &amp; OPERATIONAL ARRIVAL
            </span>
            <div class="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span class="text-[10px] text-on-surface-variant block font-data-mono">Departed / Current Guest:</span>
                <strong class="text-primary text-sm">${t.guestName}</strong>
              </div>
              <div>
                <span class="text-[10px] text-on-surface-variant block font-data-mono">Next Inbound Arrival:</span>
                <strong class="text-primary text-sm">${t.nextArrival}</strong>
              </div>
            </div>
            ${
              t.urgentReason
                ? `<div class="p-2 rounded bg-rose-100/70 border border-rose-300 text-rose-900 font-semibold text-[11px] mt-2">
                    ⚠️ ${t.urgentReason}
                  </div>`
                : ''
            }
          </div>

          <!-- Assignment & Timestamps -->
          <div class="bg-surface-bright p-4 rounded-xl border border-outline-variant/70 space-y-3">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono block pb-1 border-b border-outline-variant/40">
              TASK ASSIGNMENT &amp; DISPATCH
            </span>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase text-on-surface-variant font-data-mono mb-1">Assigned Attendant</label>
                <select id="sel-drawer-reassign-staff" class="w-full py-1.5 px-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary font-bold outline-none cursor-pointer">
                  <option value="Aisha" ${t.assignedTo === 'Aisha' ? 'selected' : ''}>Aisha</option>
                  <option value="Rahul" ${t.assignedTo === 'Rahul' ? 'selected' : ''}>Rahul</option>
                  <option value="Priya" ${t.assignedTo === 'Priya' ? 'selected' : ''}>Priya</option>
                  <option value="Carlos" ${t.assignedTo === 'Carlos' ? 'selected' : ''}>Carlos</option>
                  <option value="Unassigned" ${t.assignedTo === 'Unassigned' ? 'selected' : ''}>Unassigned</option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-bold uppercase text-on-surface-variant font-data-mono mb-1">Priority</label>
                <select id="sel-drawer-priority" class="w-full py-1.5 px-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary font-bold outline-none cursor-pointer">
                  <option value="URGENT" ${t.priority === 'URGENT' ? 'selected' : ''}>🔴 Urgent (Arrival &lt; 1hr)</option>
                  <option value="HIGH" ${t.priority === 'HIGH' ? 'selected' : ''}>🟡 High</option>
                  <option value="NORMAL" ${t.priority === 'NORMAL' ? 'selected' : ''}>Normal</option>
                  <option value="LOW" ${t.priority === 'LOW' ? 'selected' : ''}>Low</option>
                </select>
              </div>
            </div>

            <div class="flex items-center justify-between text-[11px] text-on-surface-variant font-data-mono pt-1">
              <span>Created: <strong>${t.createdAt}</strong></span>
              <span>Started: <strong>${t.startedAt || 'Not Started'}</strong></span>
              <span>Completed: <strong>${t.completedAt || 'In Progress'}</strong></span>
            </div>
          </div>

          <!-- Interactive Cleaning Checklist -->
          <div class="bg-surface-bright p-4 rounded-xl border border-outline-variant/70 space-y-3">
            <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
              <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">
                CLEANING PROTOCOL CHECKLIST
              </span>
              <span class="text-xs font-bold text-primary font-data-mono">
                ${t.checklist.filter((c) => c.done).length} / ${t.checklist.length} Complete
              </span>
            </div>

            <div class="space-y-2">
              ${t.checklist
                .map(
                  (c, idx) => `
                <label class="flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-container/60 cursor-pointer transition-colors">
                  <input type="checkbox" class="chk-drawer-item accent-primary w-4 h-4" ${c.done ? 'checked' : ''} data-idx="${idx}" />
                  <span class="${c.done ? 'line-through text-on-surface-variant' : 'font-semibold text-primary'}">${c.item}</span>
                </label>
              `
                )
                .join('')}
            </div>
          </div>

          <!-- Inspection Result if Any -->
          ${
            t.inspection
              ? `
            <div class="p-4 rounded-xl border ${t.inspection.result === 'FAILED' ? 'bg-rose-50 border-rose-300' : 'bg-emerald-50 border-emerald-300'} space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-bold text-xs ${t.inspection.result === 'FAILED' ? 'text-rose-900' : 'text-emerald-900'}">
                  Supervisor Inspection: ${t.inspection.result}
                </span>
                <span class="text-[10px] text-on-surface-variant font-data-mono">${t.inspection.time}</span>
              </div>
              ${
                t.inspection.failedReason
                  ? `<p class="text-xs text-rose-950 font-medium">Reason: ${t.inspection.failedReason}</p>`
                  : `<p class="text-xs text-emerald-950 font-medium">All inspection points verified satisfactory.</p>`
              }
            </div>
          `
              : ''
          }

        </div>

        <!-- Footer Operational Actions -->
        <div class="p-5 border-t border-outline-variant bg-surface-bright flex items-center justify-end gap-2.5">
          ${
            t.status === 'DIRTY' || t.status === 'ASSIGNED'
              ? `<button id="btn-drawer-start" class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-xs cursor-pointer">
                  Start Cleaning
                </button>`
              : t.status === 'CLEANING'
              ? `<button id="btn-drawer-mark-cleaned" class="px-5 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold shadow-xs cursor-pointer">
                  Mark Cleaned &amp; Request Inspection
                </button>`
              : t.status === 'FAILED'
              ? `<button id="btn-drawer-reclean" class="px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs cursor-pointer">
                  Send Back to Re-clean
                </button>
                <button id="btn-drawer-reinspect" class="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-xs cursor-pointer">
                  Open Inspection QA
                </button>`
              : `<button id="btn-drawer-inspect" class="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs cursor-pointer">
                  Open Inspection QA
                </button>`
          }
          <button id="btn-drawer-save-close" class="px-4 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary cursor-pointer">
            Close
          </button>
        </div>

      </aside>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ROOM INSPECTION MODAL (Pass/Fail QA Workflow)
  // ──────────────────────────────────────────────────────────────────────────
  renderInspectionModal() {
    if (!this.activeInspectionModal) return '';
    const t = this.activeInspectionModal;

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
          
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-purple-900 font-data-mono">Quality Assurance Protocol</span>
              <h2 class="font-headline-sm text-base font-bold text-primary">Supervisor Inspection — Room ${t.roomNumber}</h2>
            </div>
            <button id="btn-close-inspect-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-4 overflow-y-auto custom-scrollbar text-xs">
            <div class="p-3 bg-surface-bright rounded-xl border border-outline-variant flex justify-between items-center text-xs">
              <div>
                <span class="text-[10px] text-on-surface-variant font-data-mono uppercase block">Attendant Responsible</span>
                <strong class="text-primary text-sm">${t.assignedTo}</strong>
              </div>
              <div class="text-right">
                <span class="text-[10px] text-on-surface-variant font-data-mono uppercase block">Cleaning Completed</span>
                <span class="font-data-mono font-bold text-primary">${t.completedAt || '1:05 PM'}</span>
              </div>
            </div>

            <div class="space-y-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono block">
                INSPECTION QA CRITERIA
              </span>

              ${[
                { id: 'qa-bath', label: 'Bathroom fixtures, tiles, glass and mirrors' },
                { id: 'qa-bed', label: 'Bed linen alignment, tautness and pillow casing' },
                { id: 'qa-amenities', label: 'Luxury amenities tray and hygiene seals' },
                { id: 'qa-floor', label: 'Flooring, under-bed vacuuming and dusting' },
                { id: 'qa-minibar', label: 'Minibar inventory and seal inspection' },
                { id: 'qa-climate', label: 'Climate control thermostat and fragrance' },
              ]
                .map(
                  (c, i) => `
                <label class="p-2.5 rounded-xl border border-outline-variant flex items-center justify-between hover:bg-surface-container/50 cursor-pointer">
                  <span class="font-semibold text-primary">${c.label}</span>
                  <input type="checkbox" class="chk-qa-item accent-primary w-4 h-4" checked />
                </label>
              `
                )
                .join('')}
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Inspection Notes / Failure Reason</label>
              <textarea id="input-inspection-notes" rows="2" placeholder="Optional notes for attendant or reason if failed..." class="w-full p-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none"></textarea>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-outline-variant bg-surface-bright flex items-center justify-between gap-2.5">
            <button id="btn-qa-fail-reclean" class="px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">close</span>
              <span>Fail &amp; Send to Re-Clean</span>
            </button>

            <button id="btn-qa-pass-ready" class="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Pass QA &amp; Mark READY</span>
            </button>
          </div>

        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // STAFF APP SIMULATOR (Mobile Experience View)
  // ──────────────────────────────────────────────────────────────────────────
  renderStaffAppSimulator() {
    if (!this.activeStaffAppModal) return '';

    return `
      <div class="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-slate-900 rounded-[36px] shadow-2xl border-4 border-slate-700 w-full max-w-sm overflow-hidden flex flex-col h-[680px] relative text-white">
          
          <!-- Phone Speaker Notch -->
          <div class="w-28 h-4 bg-slate-800 rounded-b-xl mx-auto flex items-center justify-center mb-1">
            <div class="w-10 h-1 bg-slate-600 rounded-full"></div>
          </div>

          <!-- App Topbar -->
          <div class="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <span class="text-[10px] text-emerald-400 font-data-mono font-bold uppercase">VOLVITECH STAFF APP</span>
              <h3 class="font-bold text-sm">Attendant: Aisha Patel</h3>
            </div>
            <button id="btn-close-staff-app" class="p-1 text-slate-400 hover:text-white cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <!-- Attendant Tasks List -->
          <div class="p-4 overflow-y-auto flex-1 space-y-3 text-xs custom-scrollbar">
            <div class="text-[11px] font-bold uppercase text-slate-400 font-data-mono">MY ACTIVE SHIFT TASKS (6)</div>

            <!-- Task 1 -->
            <div class="bg-slate-800/90 rounded-2xl p-4 border border-rose-500/50 space-y-2">
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-base font-black text-white font-data-mono">ROOM 508</div>
                  <div class="text-[11px] text-slate-400">Checkout Cleaning • High Priority</div>
                </div>
                <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300">DIRTY</span>
              </div>
              <p class="text-[11px] text-amber-300">Next arrival: 12:30 PM (Urgent)</p>
              <button class="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white shadow-sm cursor-pointer">
                Start Cleaning Room 508
              </button>
            </div>

            <!-- Task 2 -->
            <div class="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 space-y-2">
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-base font-black text-white font-data-mono">ROOM 402</div>
                  <div class="text-[11px] text-slate-400">Checkout Cleaning • Re-Clean Required</div>
                </div>
                <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300">RE-CLEAN</span>
              </div>
              <p class="text-[11px] text-slate-300">Minibar replenishment needed.</p>
              <button class="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 font-bold text-xs text-white shadow-sm cursor-pointer">
                Complete Minibar &amp; Finish
              </button>
            </div>

            <!-- Task 3 -->
            <div class="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 space-y-2">
              <div class="flex justify-between items-start">
                <div>
                  <div class="text-base font-black text-white font-data-mono">ROOM 201</div>
                  <div class="text-[11px] text-slate-400">Stayover Cleaning</div>
                </div>
                <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300">CLEANING</span>
              </div>
              <button class="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-xs text-white shadow-sm cursor-pointer">
                Mark Cleaned
              </button>
            </div>
          </div>

          <!-- Bottom Phone Home Indicator -->
          <div class="p-2 flex justify-center">
            <div class="w-32 h-1 bg-slate-600 rounded-full"></div>
          </div>

        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // NEW REQUEST & LOST & FOUND MODALS
  // ──────────────────────────────────────────────────────────────────────────
  renderNewRequestModal() {
    if (!this.activeNewRequestModal) return '';

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <h3 class="font-headline-sm text-base font-bold text-primary">Log Guest Service Request</h3>
            <button id="btn-close-req-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <div class="p-6 space-y-3 text-xs">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Room Number *</label>
              <input type="text" id="input-req-room" placeholder="e.g. 402" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface font-data-mono outline-none" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Request Item / Service *</label>
              <select id="sel-req-item" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
                <option value="Extra Towels (Bath & Face)">Extra Towels</option>
                <option value="Extra Goose Down Pillow">Extra Pillow</option>
                <option value="Warm Cashmere Blanket">Blanket</option>
                <option value="L’Occitane Toiletries Pack">Toiletries Pack</option>
                <option value="Baby Cot & Crib">Baby Cot</option>
                <option value="Iron & Ironing Board">Iron &amp; Board</option>
                <option value="Dyson Hair Dryer">Hair Dryer</option>
                <option value="Immediate Express Cleaning">Express Room Cleaning</option>
                <option value="Laundry & Dry Cleaning Pickup">Laundry Pickup</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Assign Attendant</label>
              <select id="sel-req-staff" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
                <option value="Aisha">Aisha</option>
                <option value="Rahul">Rahul</option>
                <option value="Priya">Priya</option>
                <option value="Carlos">Carlos</option>
                <option value="Unassigned">Unassigned (Broadcast to Floor)</option>
              </select>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-outline-variant bg-surface-bright flex items-center justify-end gap-2">
            <button id="btn-cancel-req" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-save-req" class="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-xs cursor-pointer hover:bg-primary/90">Dispatch Request</button>
          </div>
        </div>
      </div>
    `;
  }

  renderLogLostFoundModal() {
    if (!this.activeLogLostFoundModal) return '';

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <h3 class="font-headline-sm text-base font-bold text-primary">Log Lost &amp; Found Item</h3>
            <button id="btn-close-lf-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <div class="p-6 space-y-3 text-xs">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Room Number *</label>
              <input type="text" id="input-lf-room" placeholder="e.g. 402" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface font-data-mono outline-none" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Item Description *</label>
              <input type="text" id="input-lf-desc" placeholder="e.g. Black leather wallet" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Found By Attendant *</label>
              <input type="text" id="input-lf-foundby" value="Aisha" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Storage Location</label>
              <input type="text" id="input-lf-loc" value="Safe Box Vault #14" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none" />
            </div>
          </div>
          <div class="px-6 py-4 border-t border-outline-variant bg-surface-bright flex items-center justify-end gap-2">
            <button id="btn-cancel-lf" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-save-lf" class="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-xs cursor-pointer hover:bg-primary/90">Register Item</button>
          </div>
        </div>
      </div>
    `;
  }

  renderQuickAssignModal() {
    if (!this.activeAssignModal) return '';
    const roomNum = this.activeAssignModal;

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-sm overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <h3 class="font-headline-sm text-base font-bold text-primary">Assign Staff — Room ${roomNum}</h3>
            <button id="btn-close-assign-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <div class="p-6 space-y-3 text-xs">
            <p class="text-on-surface-variant">Select an on-duty attendant to take charge of Room ${roomNum}:</p>
            <div class="space-y-1.5">
              ${this.staffList
                .map(
                  (s) => `
                <label class="p-3 rounded-xl border border-outline-variant flex items-center justify-between hover:bg-surface-container cursor-pointer">
                  <div class="flex items-center gap-2">
                    <input type="radio" name="quick-staff-radio" value="${s.name}" class="accent-primary" />
                    <div>
                      <div class="font-bold text-primary">${s.name} (${s.role})</div>
                      <div class="text-[10px] text-on-surface-variant font-data-mono">Floors ${s.floor} • ${s.roomsCount} rooms assigned</div>
                    </div>
                  </div>
                </label>
              `
                )
                .join('')}
            </div>
          </div>
          <div class="px-6 py-4 border-t border-outline-variant bg-surface-bright flex items-center justify-end gap-2">
            <button id="btn-cancel-assign" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-confirm-assign" class="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-xs cursor-pointer hover:bg-primary/90">Confirm Assignment</button>
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

    // Search input
    const searchInput = this.container.querySelector('#input-hk-search');
    if (searchInput) {
      searchInput.oninput = (e) => {
        this.searchQuery = e.target.value;
        this.renderContent();
        const input = this.container.querySelector('#input-hk-search');
        if (input) {
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        }
      };
    }

    const btnClearSearch = this.container.querySelector('#btn-clear-hk-search');
    if (btnClearSearch) {
      btnClearSearch.onclick = () => {
        this.searchQuery = '';
        this.renderContent();
      };
    }

    // Refresh button
    const btnRefresh = this.container.querySelector('#btn-refresh-housekeeping');
    if (btnRefresh) {
      btnRefresh.onclick = () => {
        Toast.show({ title: 'Housekeeping Refreshed', message: 'Syncing live telemetry from floor attendants.', type: 'info' });
        this.renderContent();
      };
    }

    // Workflow step buttons click
    this.container.querySelectorAll('.workflow-step-btn').forEach((btn) => {
      btn.onclick = () => {
        this.filters.status = btn.dataset.status;
        this.renderContent();
      };
    });

    // KPI Cards click
    this.container.querySelectorAll('.card-hk-metric').forEach((card) => {
      card.onclick = () => {
        this.activeQuickFilter = card.dataset.filter;
        this.renderContent();
      };
    });

    // Floor bar click
    this.container.querySelectorAll('.floor-bar-item').forEach((item) => {
      item.onclick = () => {
        this.filters.floor = item.dataset.floor;
        this.renderContent();
      };
    });

    // Staff bar click
    this.container.querySelectorAll('.staff-bar-item').forEach((item) => {
      item.onclick = () => {
        this.filters.staff = item.dataset.staff;
        this.renderContent();
      };
    });

    // Secondary Dropdown filters
    const bindDropdown = (id, key) => {
      const el = this.container.querySelector(id);
      if (el) {
        el.onchange = (e) => {
          this.filters[key] = e.target.value;
          this.renderContent();
        };
      }
    };
    bindDropdown('#sel-filter-floor', 'floor');
    bindDropdown('#sel-filter-staff', 'staff');
    bindDropdown('#sel-filter-status', 'status');

    // Reset filters
    const btnReset = this.container.querySelector('#btn-reset-hk-filters, #btn-empty-reset-hk');
    if (btnReset) {
      btnReset.onclick = () => {
        this.searchQuery = '';
        this.activeQuickFilter = 'ALL';
        this.filters = { date: 'TODAY', floor: 'ALL', staff: 'ALL', status: 'ALL', cleaningType: 'ALL' };
        this.renderContent();
      };
    }

    // Open Task Drawer
    this.container.querySelectorAll('.btn-view-task-drawer').forEach((btn) => {
      btn.onclick = () => {
        const taskId = btn.dataset.taskid;
        this.activeTaskModal = this.tasks.find((t) => t.id === taskId);
        this.renderContent();
      };
    });

    // Quick Task State Transitions
    this.container.querySelectorAll('.btn-start-task-quick').forEach((btn) => {
      btn.onclick = () => {
        const t = this.tasks.find((task) => task.id === btn.dataset.taskid);
        if (t) {
          t.status = 'CLEANING';
          t.startedAt = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
          Toast.show({ title: 'Cleaning Started', message: `Room ${t.roomNumber} is now marked CLEANING on Front Desk Board.`, type: 'info' });
          this.renderContent();
        }
      };
    });

    this.container.querySelectorAll('.btn-clean-task-quick').forEach((btn) => {
      btn.onclick = () => {
        const t = this.tasks.find((task) => task.id === btn.dataset.taskid);
        if (t) {
          t.status = 'CLEANED';
          t.completedAt = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
          Toast.show({ title: 'Room Cleaned', message: `Room ${t.roomNumber} ready for supervisor inspection QA.`, type: 'info' });
          this.renderContent();
        }
      };
    });

    this.container.querySelectorAll('.btn-inspect-task-quick, .btn-reinspect-task-quick, .btn-open-inspection-modal').forEach((btn) => {
      btn.onclick = () => {
        const roomNum = btn.dataset.room;
        const taskId = btn.dataset.taskid;
        const task = (roomNum ? this.tasks.find((t) => t.roomNumber === roomNum) : this.tasks.find((t) => t.id === taskId)) || this.tasks[2];
        this.activeInspectionModal = task;
        this.renderContent();
      };
    });

    // Resolve exception quick buttons
    this.container.querySelectorAll('.btn-resolve-exception').forEach((btn) => {
      btn.onclick = () => {
        const rNum = btn.dataset.room;
        const task = this.tasks.find((t) => t.roomNumber === rNum);
        if (task) {
          this.activeTaskModal = task;
          this.renderContent();
        }
      };
    });

    this.container.querySelectorAll('.btn-quick-assign-staff').forEach((btn) => {
      btn.onclick = () => {
        this.activeAssignModal = btn.dataset.room;
        this.renderContent();
      };
    });

    // Close Task Drawer
    const btnCloseDrawer = this.container.querySelector('#btn-close-task-drawer, #btn-drawer-save-close');
    if (btnCloseDrawer) {
      btnCloseDrawer.onclick = () => {
        this.activeTaskModal = null;
        this.renderContent();
      };
    }
    const drawerBackdrop = this.container.querySelector('#hk-task-drawer-backdrop');
    if (drawerBackdrop) {
      drawerBackdrop.onclick = () => {
        this.activeTaskModal = null;
        this.renderContent();
      };
    }

    // Drawer internal actions
    const btnDrawerStart = this.container.querySelector('#btn-drawer-start');
    if (btnDrawerStart && this.activeTaskModal) {
      btnDrawerStart.onclick = () => {
        this.activeTaskModal.status = 'CLEANING';
        this.activeTaskModal.startedAt = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        Toast.show({ title: 'Cleaning Started', message: `Room ${this.activeTaskModal.roomNumber} set to CLEANING.`, type: 'info' });
        this.renderContent();
      };
    }

    const btnDrawerMarkCleaned = this.container.querySelector('#btn-drawer-mark-cleaned');
    if (btnDrawerMarkCleaned && this.activeTaskModal) {
      btnDrawerMarkCleaned.onclick = () => {
        this.activeTaskModal.status = 'CLEANED';
        this.activeTaskModal.completedAt = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        Toast.show({ title: 'Room Cleaned', message: `Room ${this.activeTaskModal.roomNumber} awaiting inspection.`, type: 'info' });
        this.renderContent();
      };
    }

    const btnDrawerReclean = this.container.querySelector('#btn-drawer-reclean');
    if (btnDrawerReclean && this.activeTaskModal) {
      btnDrawerReclean.onclick = () => {
        this.activeTaskModal.status = 'CLEANING';
        Toast.show({ title: 'Re-clean Dispatched', message: `Attendant ${this.activeTaskModal.assignedTo} dispatched to re-clean Room ${this.activeTaskModal.roomNumber}.`, type: 'info' });
        this.renderContent();
      };
    }

    const btnDrawerInspect = this.container.querySelector('#btn-drawer-inspect, #btn-drawer-reinspect');
    if (btnDrawerInspect && this.activeTaskModal) {
      btnDrawerInspect.onclick = () => {
        const t = this.activeTaskModal;
        this.activeTaskModal = null;
        this.activeInspectionModal = t;
        this.renderContent();
      };
    }

    // Drawer checklist checkboxes
    this.container.querySelectorAll('.chk-drawer-item').forEach((chk) => {
      chk.onchange = () => {
        if (this.activeTaskModal) {
          const idx = parseInt(chk.dataset.idx, 10);
          this.activeTaskModal.checklist[idx].done = chk.checked;
        }
      };
    });

    // Reassign staff in drawer
    const selReassign = this.container.querySelector('#sel-drawer-reassign-staff');
    if (selReassign && this.activeTaskModal) {
      selReassign.onchange = (e) => {
        this.activeTaskModal.assignedTo = e.target.value;
        Toast.show({ title: 'Attendant Reassigned', message: `Room ${this.activeTaskModal.roomNumber} assigned to ${e.target.value}.`, type: 'success' });
      };
    }

    // Close Inspection Modal
    const btnCloseInspect = this.container.querySelector('#btn-close-inspect-modal');
    if (btnCloseInspect) {
      btnCloseInspect.onclick = () => {
        this.activeInspectionModal = null;
        this.renderContent();
      };
    }

    // QA Fail & Send to Re-Clean
    const btnQaFail = this.container.querySelector('#btn-qa-fail-reclean');
    if (btnQaFail && this.activeInspectionModal) {
      btnQaFail.onclick = () => {
        const t = this.activeInspectionModal;
        const notes = this.container.querySelector('#input-inspection-notes')?.value || 'Inspection failed on missing items.';
        t.status = 'FAILED';
        t.inspection = {
          inspector: 'Supervisor Victoria S.',
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          result: 'FAILED',
          failedReason: notes,
        };
        this.activeInspectionModal = null;
        Toast.show({ title: 'Inspection Failed', message: `Room ${t.roomNumber} rejected. Attendant ${t.assignedTo} notified to re-clean.`, type: 'error' });
        this.renderContent();
      };
    }

    // QA Pass & Mark READY (Real-time Front Desk integration)
    const btnQaPass = this.container.querySelector('#btn-qa-pass-ready');
    if (btnQaPass && this.activeInspectionModal) {
      btnQaPass.onclick = () => {
        const t = this.activeInspectionModal;
        t.status = 'READY';
        t.priority = 'NORMAL';
        t.urgentReason = null;
        t.inspection = {
          inspector: 'Supervisor Victoria S.',
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          result: 'PASSED',
          failedReason: null,
        };

        // Update Central State if available so Room Board reflects immediately
        if (store.state && store.state.rooms) {
          const roomObj = store.state.rooms.find((r) => r.id === t.roomNumber);
          if (roomObj) {
            roomObj.status = 'Inspected';
          }
        }

        this.activeInspectionModal = null;
        Toast.show({
          title: 'Room QA Passed — Room READY',
          message: `Room ${t.roomNumber} marked READY. Front Desk and Room Board have been updated.`,
          type: 'success',
        });
        this.renderContent();
      };
    }

    // Staff App Mobile Simulator
    const btnStaffApp = this.container.querySelector('#btn-open-staff-app');
    if (btnStaffApp) {
      btnStaffApp.onclick = () => {
        this.activeStaffAppModal = true;
        this.renderContent();
      };
    }
    const btnCloseStaffApp = this.container.querySelector('#btn-close-staff-app');
    if (btnCloseStaffApp) {
      btnCloseStaffApp.onclick = () => {
        this.activeStaffAppModal = false;
        this.renderContent();
      };
    }

    // Guest Requests
    const btnAddReq = this.container.querySelector('#btn-add-hk-request');
    if (btnAddReq) {
      btnAddReq.onclick = () => {
        this.activeNewRequestModal = true;
        this.renderContent();
      };
    }
    const btnCloseReq = this.container.querySelector('#btn-close-req-modal, #btn-cancel-req');
    if (btnCloseReq) {
      btnCloseReq.onclick = () => {
        this.activeNewRequestModal = false;
        this.renderContent();
      };
    }
    const btnSaveReq = this.container.querySelector('#btn-save-req');
    if (btnSaveReq) {
      btnSaveReq.onclick = () => {
        const rNum = this.container.querySelector('#input-req-room')?.value || '402';
        const item = this.container.querySelector('#sel-req-item')?.value || 'Extra Towels';
        const staff = this.container.querySelector('#sel-req-staff')?.value || 'Aisha';

        this.guestRequests.unshift({
          id: `req-${this.guestRequests.length + 1}`,
          roomNumber: rNum,
          item,
          guestName: 'In-House Guest',
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          assignedTo: staff,
          status: staff === 'Unassigned' ? 'Pending' : 'In Delivery',
        });
        this.activeNewRequestModal = false;
        Toast.show({ title: 'Request Dispatched', message: `${item} request logged for Room ${rNum}.`, type: 'success' });
        this.renderContent();
      };
    }

    this.container.querySelectorAll('.btn-complete-request').forEach((btn) => {
      btn.onclick = () => {
        const req = this.guestRequests.find((r) => r.id === btn.dataset.reqid);
        if (req) {
          req.status = 'Completed';
          Toast.show({ title: 'Request Completed', message: `Delivered to Room ${req.roomNumber}.`, type: 'success' });
          this.renderContent();
        }
      };
    });

    // Lost & Found
    const btnAddLf = this.container.querySelector('#btn-log-lost-found');
    if (btnAddLf) {
      btnAddLf.onclick = () => {
        this.activeLogLostFoundModal = true;
        this.renderContent();
      };
    }
    const btnCloseLf = this.container.querySelector('#btn-close-lf-modal, #btn-cancel-lf');
    if (btnCloseLf) {
      btnCloseLf.onclick = () => {
        this.activeLogLostFoundModal = false;
        this.renderContent();
      };
    }
    const btnSaveLf = this.container.querySelector('#btn-save-lf');
    if (btnSaveLf) {
      btnSaveLf.onclick = () => {
        const rNum = this.container.querySelector('#input-lf-room')?.value || '402';
        const desc = this.container.querySelector('#input-lf-desc')?.value || 'Valuable personal item';
        const foundBy = this.container.querySelector('#input-lf-foundby')?.value || 'Aisha';
        const loc = this.container.querySelector('#input-lf-loc')?.value || 'Safe Box B-14';

        this.lostAndFound.unshift({
          id: `LF-00${this.lostAndFound.length + 284}`,
          roomNumber: rNum,
          item: desc,
          foundBy,
          date: 'Today • Just now',
          status: 'STORED',
          location: loc,
        });
        this.activeLogLostFoundModal = false;
        Toast.show({ title: 'Item Registered', message: `${desc} from Room ${rNum} safely vaulted.`, type: 'success' });
        this.renderContent();
      };
    }

    // Quick Assign Modal
    const btnCloseAssign = this.container.querySelector('#btn-close-assign-modal, #btn-cancel-assign');
    if (btnCloseAssign) {
      btnCloseAssign.onclick = () => {
        this.activeAssignModal = null;
        this.renderContent();
      };
    }
    const btnConfirmAssign = this.container.querySelector('#btn-confirm-assign');
    if (btnConfirmAssign && this.activeAssignModal) {
      btnConfirmAssign.onclick = () => {
        const selectedRadio = this.container.querySelector('input[name="quick-staff-radio"]:checked')?.value || 'Aisha';
        const task = this.tasks.find((t) => t.roomNumber === this.activeAssignModal);
        if (task) {
          task.assignedTo = selectedRadio;
          task.status = 'ASSIGNED';
          Toast.show({ title: 'Attendant Assigned', message: `Room ${task.roomNumber} assigned to ${selectedRadio}.`, type: 'success' });
        }
        this.activeAssignModal = null;
        this.renderContent();
      };
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CONVENIENCE API (used by router / sidebar navigation)
  // ──────────────────────────────────────────────────────────────────────────
  setQuickFilter(filter) {
    this.activeQuickFilter = filter;
    this.renderContent();
    this.bindEvents();
  }

  async loadData() {
    this.isLoading = true;
    try {
      const storeTasks = (store && typeof store.getHousekeepingTasks === 'function') ? store.getHousekeepingTasks() : [];
      if (storeTasks && storeTasks.length > 0) {
        const existingIds = new Set(this.tasks.map(t => t.id));
        const newTasks = storeTasks.filter(t => !existingIds.has(t.id));
        if (newTasks.length > 0) {
          this.tasks = [...newTasks, ...this.tasks];
        }
      }
    } catch (err) {
      console.warn('[HousekeepingView] Error syncing store tasks:', err);
    }
    this.isLoading = false;
    this.renderContent();
    this.bindEvents();
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
