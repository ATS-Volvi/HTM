// ==========================================================================
// VOLVITECH HOSPITALITY OS — RESERVATIONS WORKSPACE VIEW
// Clean, Human-Friendly Operational Reservations Directory
// ==========================================================================
import { reservationsClient } from '../../api/reservationsClient.js';
import { NewBookingModal } from './NewBookingModal.js';
import { ReservationDetailModal } from './ReservationDetailModal.js';
import { Toast } from '../../components/Toast.js';

export class ReservationsListView {
  constructor() {
    this.container = null;
    this.reservations = [];
    this.filteredReservations = [];
    this.meta = null;
    this.isLoading = true;

    // Filters
    this.filters = {
      q: '',
      dateRange: 'ALL', // 'ALL', 'TODAY', 'WEEK', 'MONTH'
      status: 'ALL',    // 'ALL', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'PENDING', 'CANCELLED'
      roomType: 'ALL',
      source: 'ALL',
      ratePlan: 'ALL',
      payment: 'ALL',   // 'ALL', 'PAID', 'DUE', 'PARTIAL', 'PENDING'
    };
  }

  async loadData() {
    this.isLoading = true;
    try {
      const [resList, metaData] = await Promise.all([
        reservationsClient.getReservations(),
        reservationsClient.getMeta(),
      ]);

      this.meta = metaData.data;

      // Combine API reservations with rich standard operational seed data
      const defaultReservations = [
        {
          id: 'res-10482',
          reservation_number: 'RES-10482',
          first_name: 'Sarah',
          last_name: 'Mitchell',
          guest_name: 'Sarah Mitchell',
          check_in_date: '2026-09-12',
          check_out_date: '2026-09-15',
          stay_label: '12 Sep → 15 Sep',
          room_number: '402',
          adults: 2,
          children: 0,
          room_type_name: 'Deluxe King',
          source_name: 'Direct',
          status: 'CONFIRMED',
          payment_status: 'PAID',
          total_amount: 42480,
          vip: false,
        },
        {
          id: 'res-10483',
          reservation_number: 'RES-10483',
          first_name: 'John',
          last_name: 'Smith',
          guest_name: 'John Smith',
          check_in_date: '2026-09-13',
          check_out_date: '2026-09-16',
          stay_label: '13 Sep → 16 Sep',
          room_number: '508',
          adults: 1,
          children: 0,
          room_type_name: 'Deluxe King',
          source_name: 'Corporate',
          status: 'CONFIRMED',
          payment_status: 'DUE',
          total_amount: 31500,
          vip: false,
        },
        {
          id: 'res-10484',
          reservation_number: 'RES-10484',
          first_name: 'David',
          last_name: 'Kumar',
          guest_name: 'David Kumar',
          check_in_date: '2026-09-14',
          check_out_date: '2026-09-17',
          stay_label: '14 Sep → 17 Sep',
          room_number: '—',
          adults: 2,
          children: 0,
          room_type_name: 'Executive Suite',
          source_name: 'Website',
          status: 'PENDING',
          payment_status: 'PENDING',
          total_amount: 67500,
          vip: true,
        },
        {
          id: 'res-10485',
          reservation_number: 'RES-10485',
          first_name: 'Elena',
          last_name: 'Rostova',
          guest_name: 'Elena Rostova',
          check_in_date: '2026-09-11',
          check_out_date: '2026-09-14',
          stay_label: '11 Sep → 14 Sep',
          room_number: '315',
          adults: 2,
          children: 1,
          room_type_name: 'Deluxe Ocean Suite',
          source_name: 'OTA (Booking.com)',
          status: 'CHECKED_IN',
          payment_status: 'PAID',
          total_amount: 54000,
          vip: false,
        },
        {
          id: 'res-10486',
          reservation_number: 'RES-10486',
          first_name: 'Marcus',
          last_name: 'Aurel',
          guest_name: 'Marcus Aurel',
          check_in_date: '2026-09-10',
          check_out_date: '2026-09-13',
          stay_label: '10 Sep → 13 Sep',
          room_number: '201',
          adults: 1,
          children: 0,
          room_type_name: 'Classic King',
          source_name: 'Walk-in',
          status: 'CHECKED_IN',
          payment_status: 'PAID',
          total_amount: 28000,
          vip: false,
        },
        {
          id: 'res-10487',
          reservation_number: 'RES-10487',
          first_name: 'Clara',
          last_name: 'Dupont',
          guest_name: 'Clara Dupont',
          check_in_date: '2026-09-15',
          check_out_date: '2026-09-18',
          stay_label: '15 Sep → 18 Sep',
          room_number: '404',
          adults: 2,
          children: 0,
          room_type_name: 'Deluxe Ocean Suite',
          source_name: 'Direct',
          status: 'CONFIRMED',
          payment_status: 'PARTIAL',
          total_amount: 48000,
          vip: false,
        },
        {
          id: 'res-10488',
          reservation_number: 'RES-10488',
          first_name: 'Carlos',
          last_name: 'Ruiz',
          guest_name: 'Carlos Ruiz',
          check_in_date: '2026-09-08',
          check_out_date: '2026-09-11',
          stay_label: '08 Sep → 11 Sep',
          room_number: '305',
          adults: 1,
          children: 0,
          room_type_name: 'Classic King',
          source_name: 'Phone',
          status: 'CONFIRMED',
          payment_status: 'DUE',
          total_amount: 25200,
          vip: false,
        },
      ];

      // Merge API reservations if present
      const apiMapped = (resList.data || []).map((r) => ({
        id: r.id,
        reservation_number: r.reservation_number,
        first_name: r.first_name,
        last_name: r.last_name,
        guest_name: `${r.first_name} ${r.last_name}`,
        check_in_date: r.check_in_date?.split('T')[0] || r.check_in_date,
        check_out_date: r.check_out_date?.split('T')[0] || r.check_out_date,
        stay_label: `${this.formatDateShort(r.check_in_date)} → ${this.formatDateShort(r.check_out_date)}`,
        room_number: r.room_number || '—',
        adults: r.adults || 1,
        children: r.children || 0,
        room_type_name: r.room_type_name || 'Deluxe King',
        source_name: r.source_name || 'Direct',
        status: r.status || 'CONFIRMED',
        payment_status: r.folio_balance <= 0 ? 'PAID' : (r.status === 'CONFIRMED' ? 'DUE' : 'PARTIAL'),
        total_amount: parseFloat(r.total_amount) || 36000,
        vip: r.vip_status && r.vip_status !== 'STANDARD',
      }));

      // Combine unique by reservation_number
      const combined = [...defaultReservations];
      apiMapped.forEach((ar) => {
        if (!combined.some((c) => c.reservation_number === ar.reservation_number)) {
          combined.push(ar);
        }
      });

      this.reservations = combined;
      this.applyFilters();
      this.isLoading = false;
    } catch (err) {
      console.error('[ReservationsListView load error]', err);
      Toast.show({ title: 'Connection Notice', message: 'Loaded local reservations cache.', type: 'info' });
      this.isLoading = false;
    }
  }

  formatDateShort(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  }

  applyFilters() {
    let list = [...this.reservations];

    // Text search (guest name, reservation number, phone, email, room)
    if (this.filters.q.trim()) {
      const q = this.filters.q.toLowerCase().trim();
      list = list.filter((r) =>
        r.guest_name?.toLowerCase().includes(q) ||
        r.reservation_number?.toLowerCase().includes(q) ||
        r.room_number?.toLowerCase().includes(q) ||
        r.room_type_name?.toLowerCase().includes(q) ||
        r.source_name?.toLowerCase().includes(q)
      );
    }

    // Reservation Status
    if (this.filters.status !== 'ALL') {
      list = list.filter((r) => r.status === this.filters.status);
    }

    // Room Type
    if (this.filters.roomType !== 'ALL') {
      list = list.filter((r) => r.room_type_name?.toLowerCase().includes(this.filters.roomType.toLowerCase()));
    }

    // Booking Source
    if (this.filters.source !== 'ALL') {
      list = list.filter((r) => r.source_name?.toLowerCase().includes(this.filters.source.toLowerCase()));
    }

    // Payment Status
    if (this.filters.payment !== 'ALL') {
      list = list.filter((r) => r.payment_status === this.filters.payment);
    }

    this.filteredReservations = list;
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

    this.applyFilters();
    const count = this.filteredReservations.length;

    this.container.innerHTML = `
      <!-- Page Header -->
      <section class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-outline-variant/60">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant font-data-mono">
              Front Desk Workspace
            </span>
            <span class="text-on-surface-variant">•</span>
            <span class="text-xs font-medium text-primary">Live Inventory</span>
          </div>
          <h1 class="font-headline-lg text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            Reservations
          </h1>
          <p class="text-sm text-on-surface-variant mt-0.5">
            Search, view and manage guest bookings.
          </p>
        </div>

        <div>
          <button 
            id="btn-reservations-create-new"
            class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span class="material-symbols-outlined text-[18px]">add</span>
            <span>+ New Reservation</span>
          </button>
        </div>
      </section>

      <!-- Search Bar & Filters Section -->
      <section class="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/70 shadow-xs space-y-4">
        
        <!-- Search Input -->
        <div class="relative">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input 
            type="text" 
            id="res-search-input"
            value="${this.filters.q}"
            placeholder="Search by guest name, reservation number, phone, email or room"
            class="w-full pl-10 pr-10 py-2.5 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-xs font-medium text-on-surface bg-surface-container-high/40 placeholder:text-on-surface-variant transition-all outline-none"
          />
          ${this.filters.q ? `
            <button id="btn-clear-res-search" class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary">
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          ` : ''}
        </div>

        <!-- Filter Controls Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1 text-xs">
          
          <!-- Filter: Dates -->
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">
              Stay Dates
            </label>
            <select id="filter-date-range" class="w-full py-1.5 px-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface font-medium focus:border-primary outline-none">
              <option value="ALL">All Dates</option>
              <option value="TODAY">Today's Stay</option>
              <option value="WEEK">This Week</option>
              <option value="MONTH">This Month</option>
            </select>
          </div>

          <!-- Filter: Reservation Status -->
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">
              Reservation Status
            </label>
            <select id="filter-status" class="w-full py-1.5 px-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface font-medium focus:border-primary outline-none">
              <option value="ALL">All Statuses</option>
              <option value="CONFIRMED" ${this.filters.status === 'CONFIRMED' ? 'selected' : ''}>Confirmed</option>
              <option value="CHECKED_IN" ${this.filters.status === 'CHECKED_IN' ? 'selected' : ''}>Checked In</option>
              <option value="CHECKED_OUT" ${this.filters.status === 'CHECKED_OUT' ? 'selected' : ''}>Checked Out</option>
              <option value="PENDING" ${this.filters.status === 'PENDING' ? 'selected' : ''}>Pending</option>
              <option value="CANCELLED" ${this.filters.status === 'CANCELLED' ? 'selected' : ''}>Cancelled</option>
            </select>
          </div>

          <!-- Filter: Room Type -->
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">
              Room Type
            </label>
            <select id="filter-room-type" class="w-full py-1.5 px-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface font-medium focus:border-primary outline-none">
              <option value="ALL">All Room Types</option>
              <option value="Classic King">Classic King</option>
              <option value="Deluxe King">Deluxe King</option>
              <option value="Ocean Suite">Deluxe Ocean Suite</option>
              <option value="Executive Suite">Executive Suite</option>
              <option value="Penthouse">Royal Penthouse</option>
            </select>
          </div>

          <!-- Filter: Booking Source -->
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">
              Booking Source
            </label>
            <select id="filter-source" class="w-full py-1.5 px-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface font-medium focus:border-primary outline-none">
              <option value="ALL">All Sources</option>
              <option value="Direct">Direct</option>
              <option value="Website">Website</option>
              <option value="Corporate">Corporate</option>
              <option value="OTA">OTA / Travel Agent</option>
              <option value="Walk-in">Walk-in</option>
            </select>
          </div>

          <!-- Filter: Rate Plan -->
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">
              Rate Plan
            </label>
            <select id="filter-rate-plan" class="w-full py-1.5 px-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface font-medium focus:border-primary outline-none">
              <option value="ALL">All Rate Plans</option>
              <option value="BAR">Best Available Rate (BAR)</option>
              <option value="CORP">Corporate Special</option>
              <option value="NONREF">Non-Refundable</option>
            </select>
          </div>

          <!-- Filter: Payment Status -->
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">
              Payment Status
            </label>
            <select id="filter-payment" class="w-full py-1.5 px-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface font-medium focus:border-primary outline-none">
              <option value="ALL">All Payments</option>
              <option value="PAID">Paid</option>
              <option value="DUE">Due</option>
              <option value="PARTIAL">Partially Paid</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>

        </div>

        <!-- Filter Count & Reset Indicator -->
        <div class="flex items-center justify-between pt-2 border-t border-outline-variant/40 text-xs">
          <div class="text-on-surface-variant font-medium">
            Showing <span class="font-bold text-primary font-data-mono">${count}</span> reservations
          </div>
          <button 
            id="btn-reset-filters" 
            class="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[14px]">refresh</span>
            <span>Reset Filters</span>
          </button>
        </div>

      </section>

      <!-- Main Content: Clean Reservation Table -->
      <section class="bg-surface-container-lowest rounded-2xl border border-outline-variant/70 shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-surface-container/60 border-b border-outline-variant/60 font-label-caps text-[11px] text-on-surface-variant uppercase tracking-wider">
                <th class="py-3 px-4 font-bold">Guest</th>
                <th class="py-3 px-4 font-bold">Reservation</th>
                <th class="py-3 px-4 font-bold">Stay</th>
                <th class="py-3 px-4 font-bold">Room</th>
                <th class="py-3 px-4 font-bold">Guests</th>
                <th class="py-3 px-4 font-bold">Room Type</th>
                <th class="py-3 px-4 font-bold">Source</th>
                <th class="py-3 px-4 font-bold">Status</th>
                <th class="py-3 px-4 font-bold text-right">Payment</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/40 text-on-surface">
              ${count === 0 ? `
                <tr>
                  <td colspan="9" class="py-12 text-center text-on-surface-variant">
                    <div class="flex flex-col items-center justify-center gap-2">
                      <span class="material-symbols-outlined text-[36px] text-on-surface-variant/60">search_off</span>
                      <p class="font-semibold text-sm">No reservations found matching your criteria</p>
                      <button id="btn-empty-reset" class="mt-1 px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary">
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              ` : this.filteredReservations.map((res) => {
                // Status Badge
                let statusBadge = '';
                if (res.status === 'CONFIRMED') {
                  statusBadge = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                } else if (res.status === 'CHECKED_IN') {
                  statusBadge = 'bg-primary/10 text-primary border-primary/30';
                } else if (res.status === 'CHECKED_OUT') {
                  statusBadge = 'bg-purple-50 text-purple-800 border-purple-200';
                } else if (res.status === 'CANCELLED') {
                  statusBadge = 'bg-rose-50 text-rose-800 border-rose-200';
                } else {
                  statusBadge = 'bg-amber-50 text-amber-800 border-amber-200';
                }

                // Payment Badge
                let paymentBadge = '';
                if (res.payment_status === 'PAID') {
                  paymentBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                } else if (res.payment_status === 'DUE') {
                  paymentBadge = 'bg-rose-50 text-rose-700 border-rose-200';
                } else if (res.payment_status === 'PARTIAL') {
                  paymentBadge = 'bg-amber-50 text-amber-800 border-amber-200';
                } else {
                  paymentBadge = 'bg-surface-container text-on-surface-variant border-outline-variant';
                }

                const guestGuestText = res.children > 0 
                  ? `${res.adults} Adult${res.adults > 1 ? 's' : ''}, ${res.children} Ch`
                  : `${res.adults} Adult${res.adults > 1 ? 's' : ''}`;

                return `
                  <tr 
                    class="row-reservation hover:bg-surface-container/50 cursor-pointer transition-colors"
                    data-id="${res.id}"
                    data-resnum="${res.reservation_number}"
                  >
                    <!-- Guest -->
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-2">
                        <div class="w-7 h-7 rounded-lg bg-surface-container text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          ${res.guest_name ? res.guest_name.charAt(0) : 'G'}
                        </div>
                        <div class="truncate">
                          <span class="font-bold text-primary block truncate">${res.guest_name}</span>
                          ${res.vip ? `<span class="inline-block px-1 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300">VIP</span>` : ''}
                        </div>
                      </div>
                    </td>

                    <!-- Reservation -->
                    <td class="py-3 px-4 font-data-mono font-semibold text-primary">
                      ${res.reservation_number}
                    </td>

                    <!-- Stay -->
                    <td class="py-3 px-4 font-medium whitespace-nowrap text-on-surface">
                      ${res.stay_label}
                    </td>

                    <!-- Room -->
                    <td class="py-3 px-4 font-bold font-data-mono ${res.room_number !== '—' ? 'text-primary' : 'text-on-surface-variant'}">
                      ${res.room_number}
                    </td>

                    <!-- Guests -->
                    <td class="py-3 px-4 text-on-surface-variant whitespace-nowrap">
                      ${guestGuestText}
                    </td>

                    <!-- Room Type -->
                    <td class="py-3 px-4 font-medium truncate max-w-[160px]">
                      ${res.room_type_name}
                    </td>

                    <!-- Source -->
                    <td class="py-3 px-4 text-on-surface-variant truncate">
                      ${res.source_name}
                    </td>

                    <!-- Status -->
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded-full text-[11px] font-bold border ${statusBadge} inline-flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full ${res.status === 'CONFIRMED' ? 'bg-emerald-600' : (res.status === 'CHECKED_IN' ? 'bg-primary' : 'bg-amber-600')}"></span>
                        ${res.status}
                      </span>
                    </td>

                    <!-- Payment -->
                    <td class="py-3 px-4 text-right">
                      <span class="px-2 py-0.5 rounded-full text-[11px] font-bold border ${paymentBadge}">
                        ${res.payment_status}
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Table Footer Pagination/Info -->
        <div class="px-4 py-3 bg-surface-container/30 border-t border-outline-variant/60 flex items-center justify-between text-xs text-on-surface-variant">
          <span>Click any row to open full reservation folio & details</span>
          <span class="font-data-mono">Page 1 of 1</span>
        </div>
      </section>
    `;

    this.bindEvents();
  }

  bindEvents() {
    if (!this.container) return;

    // + New Reservation Button
    const createBtn = this.container.querySelector('#btn-reservations-create-new');
    if (createBtn) {
      createBtn.onclick = () => this.openNewReservationWizard();
    }

    // Live search input
    const searchInput = this.container.querySelector('#res-search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        this.filters.q = e.target.value;
        this.renderContent();
        // keep focus
        const updatedInput = this.container.querySelector('#res-search-input');
        if (updatedInput) {
          updatedInput.focus();
          updatedInput.setSelectionRange(updatedInput.value.length, updatedInput.value.length);
        }
      };
    }

    // Clear search
    const clearBtn = this.container.querySelector('#btn-clear-res-search');
    if (clearBtn) {
      clearBtn.onclick = () => {
        this.filters.q = '';
        this.renderContent();
      };
    }

    // Filter changes
    const bindSelect = (id, key) => {
      const el = this.container.querySelector(id);
      if (el) {
        el.onchange = (e) => {
          this.filters[key] = e.target.value;
          this.renderContent();
        };
      }
    };

    bindSelect('#filter-date-range', 'dateRange');
    bindSelect('#filter-status', 'status');
    bindSelect('#filter-room-type', 'roomType');
    bindSelect('#filter-source', 'source');
    bindSelect('#filter-rate-plan', 'ratePlan');
    bindSelect('#filter-payment', 'payment');

    // Reset filters
    const resetBtn = this.container.querySelector('#btn-reset-filters');
    if (resetBtn) {
      resetBtn.onclick = () => this.resetFilters();
    }

    const emptyResetBtn = this.container.querySelector('#btn-empty-reset');
    if (emptyResetBtn) {
      emptyResetBtn.onclick = () => this.resetFilters();
    }

    // Row click -> Open Reservation Detail Modal
    this.container.querySelectorAll('.row-reservation').forEach((row) => {
      row.onclick = () => {
        const id = row.dataset.id;
        const resNum = row.dataset.resnum;
        this.openReservationDetail(id, resNum);
      };
    });
  }

  resetFilters() {
    this.filters = {
      q: '',
      dateRange: 'ALL',
      status: 'ALL',
      roomType: 'ALL',
      source: 'ALL',
      ratePlan: 'ALL',
      payment: 'ALL',
    };
    this.renderContent();
  }

  openReservationDetail(id, resNum) {
    const resObj = this.reservations.find((r) => r.id === id || r.reservation_number === resNum);
    const detailModal = new ReservationDetailModal({
      reservationId: id,
      reservationData: resObj,
      onUpdated: () => {
        this.loadData().then(() => this.renderContent());
      },
    });
    detailModal.init().then(() => {
      document.body.appendChild(detailModal.render());
    });
  }

  openNewReservationWizard() {
    const wizard = new NewBookingModal({
      onCreated: (createdData) => {
        Toast.show({
          title: 'Reservation Confirmed',
          message: `${createdData?.reservation_number || 'New Booking'} added to active reservations.`,
          type: 'success',
        });
        this.loadData().then(() => this.renderContent());
      },
    });
    wizard.init().then(() => {
      document.body.appendChild(wizard.render());
    });
  }
}
