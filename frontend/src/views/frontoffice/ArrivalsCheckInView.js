// ==========================================================================
// VOLVITECH HOSPITALITY OS — FRONT DESK ARRIVALS OPERATIONAL WORKSPACE
// Section 8 & 22: Expected arrivals, search by name/conf/phone/email,
// contextual workflow: Verify ID -> Assign Room -> Check-In -> Issue Key
// ==========================================================================

import { store } from '../../state/store.js';
import { DocumentVerificationModal } from './DocumentVerificationModal.js';
import { RoomReadinessModal } from './RoomReadinessModal.js';
import { CheckInModal } from './CheckInModal.js';

export class ArrivalsCheckInView {
  constructor() {
    this.container = null;
    this.searchQuery = '';
    this.filterStatus = 'ALL'; // 'ALL', 'ASSIGNED', 'UNASSIGNED', 'NOT_READY', 'CHECKED_IN'
    this.selectedReservationId = null;
    this.recentlyCheckedInId = null;
  }

  async loadData() {
    // Loaded synchronously from unified reactive store
    return Promise.resolve();
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
    // Expected arrivals: Reservations with status Confirmed or ARRIVED
    const allReservations = state.reservations || [];
    const arrivals = allReservations.filter(r => r.status === 'Confirmed' || r.status === 'ARRIVED');
    const checkedInReservations = allReservations.filter(r => r.status === 'Checked In');

    const totalCount = arrivals.length;
    const assignedCount = arrivals.filter(r => !!(r.assignedRoom || r.roomNumber)).length;
    const unassignedCount = arrivals.filter(r => !(r.assignedRoom || r.roomNumber)).length;
    const notReadyCount = arrivals.filter(r => {
      const rm = r.assignedRoom || r.roomNumber;
      if (!rm) return false;
      return !store.checkRoomReadiness(rm).isReady;
    }).length;
    const checkedInCount = checkedInReservations.length;

    // Apply Filter & Search
    let targetList = arrivals;
    if (this.filterStatus === 'CHECKED_IN') {
      targetList = checkedInReservations;
    }

    const filtered = targetList.filter(r => {
      const rm = r.assignedRoom || r.roomNumber;
      if (this.filterStatus === 'ASSIGNED' && !rm) return false;
      if (this.filterStatus === 'UNASSIGNED' && !!rm) return false;
      if (this.filterStatus === 'NOT_READY') {
        if (!rm || store.checkRoomReadiness(rm).isReady) return false;
      }

      const q = this.searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        r.guestName.toLowerCase().includes(q) ||
        r.confirmationCode.toLowerCase().includes(q) ||
        (r.phone && r.phone.includes(q)) ||
        (r.email && r.email.toLowerCase().includes(q)) ||
        (rm && rm.toString().includes(q))
      );
    });

    this.container.innerHTML = `
      <!-- Workspace Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-outline-variant/60 pb-5">
        <div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-data-mono uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
              Front Desk Operations
            </span>
            <span class="text-xs text-on-surface-variant font-medium">Guest Intake & Arrivals</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold font-headline-lg text-primary tracking-tight mt-1.5">
            Arrivals Workspace
          </h1>
          <p class="text-xs text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
            Locate arriving reservations by guest name, confirmation number, phone, or email. Guide guests through document verification, room assignment, readiness check, and keycard check-in.
          </p>
        </div>

        <button id="btn-arr-walkin" class="px-5 py-2.5 rounded-xl bg-surface-bright border border-outline-variant text-xs font-bold text-primary hover:bg-surface-container flex items-center gap-2 shadow-xs cursor-pointer transition-all shrink-0">
          <span class="material-symbols-outlined text-[18px]">person_walk</span>
          <span>Handle as Walk-In</span>
        </button>
      </div>

      <!-- Operational Metrics Ribbon -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-4 shadow-xs">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold font-label-caps uppercase text-on-surface-variant">Today's Expected</span>
            <span class="material-symbols-outlined text-[18px] text-primary">flight_land</span>
          </div>
          <div class="text-2xl font-bold font-headline-lg text-primary mt-1">${totalCount}</div>
        </div>

        <div class="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-4 shadow-xs">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold font-label-caps uppercase text-emerald-700">Room Assigned</span>
            <span class="material-symbols-outlined text-[18px] text-emerald-600">assignment_turned_in</span>
          </div>
          <div class="text-2xl font-bold font-headline-lg text-emerald-600 mt-1">${assignedCount}</div>
        </div>

        <div class="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-4 shadow-xs">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold font-label-caps uppercase text-amber-700">Unassigned Rooms</span>
            <span class="material-symbols-outlined text-[18px] text-amber-600">report_problem</span>
          </div>
          <div class="text-2xl font-bold font-headline-lg text-amber-600 mt-1">${unassignedCount}</div>
        </div>

        <div class="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-4 shadow-xs">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold font-label-caps uppercase text-rose-700">Assigned But Not Ready</span>
            <span class="material-symbols-outlined text-[18px] text-rose-600">cleaning_services</span>
          </div>
          <div class="text-2xl font-bold font-headline-lg text-rose-600 mt-1">${notReadyCount}</div>
        </div>
      </div>

      <!-- Search & Filters Toolbar -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        <!-- Filter Tabs -->
        <div class="flex items-center gap-1 p-1 rounded-xl bg-surface-bright border border-outline-variant shrink-0 flex-wrap">
          ${[
            { id: 'ALL', label: 'All Arrivals', count: totalCount },
            { id: 'ASSIGNED', label: 'Room Assigned', count: assignedCount },
            { id: 'UNASSIGNED', label: 'Unassigned', count: unassignedCount },
            { id: 'NOT_READY', label: 'Room Not Ready', count: notReadyCount },
            { id: 'CHECKED_IN', label: '🏨 Checked-In Profiles', count: checkedInCount, badgeClass: 'bg-emerald-100 text-emerald-800' }
          ].map(f => `
            <button class="btn-arr-filter px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              this.filterStatus === f.id ? 'bg-primary text-on-primary font-bold shadow-xs' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
            }" data-filter="${f.id}">
              <span>${f.label}</span>
              <span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                this.filterStatus === f.id ? 'bg-white/20 text-white' : (f.badgeClass || 'bg-surface-container text-on-surface-variant')
              }">${f.count}</span>
            </button>
          `).join('')}
        </div>

        <!-- Comprehensive Search Bar (Name, Conf Code, Phone, Email) -->
        <div class="relative w-full sm:w-80">
          <input 
            type="text" 
            id="arr-search-input" 
            value="${this.searchQuery}" 
            placeholder="Search by name, conf code, room, email..." 
            class="w-full px-3.5 py-2 pl-9 rounded-xl border border-outline-variant bg-surface-bright text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
          <span class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[17px]">search</span>
        </div>

      </div>

      <!-- Main Content: Arrivals Ledger OR Checked-In Profiles -->
      ${this.filterStatus === 'CHECKED_IN' ? this.renderCheckedInProfiles(filtered) : `
        <div class="space-y-3">
          ${filtered.length > 0 ? filtered.map(res => {
            const roomNum = res.assignedRoom || res.roomNumber;
            const readiness = roomNum ? store.checkRoomReadiness(roomNum) : { isReady: false, status: 'UNASSIGNED', reasons: ['No room assigned yet'] };
            const isDocVerified = !!(res.identityVerified || res.idVerification?.verified);

            return `
              <div class="bg-surface-container-lowest border border-outline-variant hover:border-primary/50 rounded-2xl p-5 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <!-- Guest & Booking Info -->
                <div class="flex items-start gap-4 min-w-0">
                  <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                    ${(res.guestName || 'G').split(' ').map(w => w[0]).join('').substring(0, 2)}
                  </div>

                  <div class="min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <h3 class="font-headline-sm text-sm font-bold text-primary">${res.guestName}</h3>
                      
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold font-data-mono ${
                        res.bookingType === 'ONLINE' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }">
                        ${res.bookingType || 'DIRECT'}
                      </span>

                      ${res.vip ? `
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-700 border border-amber-500/30">
                          ★ VIP
                        </span>
                      ` : ''}

                      <span class="text-[11px] font-data-mono font-bold text-on-surface-variant">
                        ${res.confirmationCode}
                      </span>
                    </div>

                    <div class="flex items-center gap-4 text-xs text-on-surface-variant mt-1 flex-wrap">
                      <span>${res.roomType}</span>
                      <span>·</span>
                      <span>${res.checkIn} → ${res.checkOut} (${res.nights} Nights)</span>
                      <span>·</span>
                      <span class="truncate">${res.phone || res.email || 'Contact on file'}</span>
                    </div>

                    ${res.specialRequests ? `
                      <div class="text-[11px] text-on-surface-variant/90 mt-1.5 flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[14px] text-amber-600">info</span>
                        <span class="italic truncate">${res.specialRequests}</span>
                      </div>
                    ` : ''}
                  </div>
                </div>

                <!-- Operational Badges & Journey Progression -->
                <div class="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-outline-variant/40">
                  
                  <!-- Room & Readiness Badge -->
                  <div class="text-left sm:text-right">
                    <div class="flex items-center sm:justify-end gap-1.5">
                      ${roomNum ? `
                        <span class="text-xs font-bold text-primary">Room #${roomNum}</span>
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
                          readiness.isReady ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }">
                          ${readiness.isReady ? '✓ READY' : '⚠ ' + readiness.status}
                        </span>
                      ` : `
                        <span class="px-2.5 py-1 rounded text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          No Room Assigned
                        </span>
                      `}
                    </div>

                    <!-- Document Verification Badge -->
                    <div class="text-[10px] text-on-surface-variant mt-1 flex items-center sm:justify-end gap-1">
                      <span class="material-symbols-outlined text-[14px] ${isDocVerified ? 'text-emerald-600' : 'text-amber-600'}">
                        ${isDocVerified ? 'verified' : 'pending'}
                      </span>
                      <span>${isDocVerified ? 'ID Verified' : 'ID Pending Capture'}</span>
                    </div>
                  </div>

                  <!-- Contextual Action Buttons -->
                  <div class="flex items-center gap-2">
                    <button class="btn-verify-guest-id px-3 py-2 rounded-xl border border-outline-variant hover:border-primary text-xs font-bold text-primary hover:bg-surface-container flex items-center gap-1.5 transition-all cursor-pointer" data-res-id="${res.id}">
                      <span class="material-symbols-outlined text-[16px]">badge</span>
                      <span>${isDocVerified ? 'Review ID' : 'Verify ID'}</span>
                    </button>

                    <button class="btn-check-room-readiness px-3 py-2 rounded-xl border border-outline-variant hover:border-primary text-xs font-bold text-primary hover:bg-surface-container flex items-center gap-1.5 transition-all cursor-pointer" data-res-id="${res.id}" data-room="${roomNum || ''}">
                      <span class="material-symbols-outlined text-[16px]">meeting_room</span>
                      <span>${roomNum ? 'Check Room' : 'Assign Room'}</span>
                    </button>

                    <button class="btn-start-checkin px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary/90 flex items-center gap-1.5 transition-all cursor-pointer" data-res-id="${res.id}">
                      <span class="material-symbols-outlined text-[16px]">how_to_reg</span>
                      <span>Check-In →</span>
                    </button>
                  </div>

                </div>

              </div>
            `;
          }).join('') : `
            <!-- No arrivals or search empty (Section 8: If no reservation found, handle as walk-in) -->
            <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-12 text-center shadow-xs">
              <div class="w-14 h-14 rounded-2xl bg-surface-container text-on-surface-variant flex items-center justify-center mx-auto mb-4">
                <span class="material-symbols-outlined text-[28px]">search_off</span>
              </div>
              <h3 class="font-headline-sm text-base font-bold text-primary">No Confirmed Arrival Found</h3>
              <p class="text-xs text-on-surface-variant max-w-md mx-auto mt-1 mb-5 leading-relaxed">
                ${this.searchQuery 
                  ? `No reservation matches "${this.searchQuery}". The guest may have walked in without a prior booking.`
                  : 'No expected arrivals currently pending in this filter category.'}
              </p>
              <button id="btn-empty-handle-walkin" class="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-sm hover:bg-primary/90 inline-flex items-center gap-2 cursor-pointer transition-all">
                <span class="material-symbols-outlined text-[18px]">person_walk</span>
                <span>Handle as Walk-In Intake</span>
              </button>
            </div>
          `}
        </div>
      `}
    `;

    this.bindEvents();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CHECKED-IN GUEST PROFILES LIST (STAYS ON SAME PAGE AFTER CHECK-IN)
  // ─────────────────────────────────────────────────────────────────────────
  renderCheckedInProfiles(checkedInList) {
    if (!checkedInList || checkedInList.length === 0) {
      return `
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-12 text-center shadow-xs animate-fadeIn">
          <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
            <span class="material-symbols-outlined text-[32px]">hotel</span>
          </div>
          <h4 class="text-base font-bold text-primary">No Checked-In Guests Found</h4>
          <p class="text-xs text-on-surface-variant mt-1 max-w-md mx-auto">
            ${this.searchQuery ? `No active checked-in guest matches "${this.searchQuery}".` : 'Once guest check-in and keycard issuance are completed, their active in-house stay profile will be listed here.'}
          </p>
          <button id="btn-arr-back-arrivals" class="mt-4 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-sm transition-all">
            <span class="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>View Expected Arrivals</span>
          </button>
        </div>
      `;
    }

    return `
      <div class="space-y-4 animate-fadeIn">
        <!-- Banner -->
        <div class="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[28px]">hotel</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-bold font-headline-sm text-primary">Checked-In Guest Profiles (Active In-House)</h3>
                <span class="text-[10px] font-bold font-data-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                  ● ${checkedInList.length} In-House
                </span>
              </div>
              <p class="text-xs text-on-surface-variant mt-0.5">
                Profiles and room details of guests currently occupying rooms with active RFID access keys.
              </p>
            </div>
          </div>

          <button id="btn-arr-back-arrivals" class="px-4 py-2 rounded-xl bg-surface-bright border border-outline-variant hover:border-primary text-xs font-bold text-primary flex items-center gap-2 cursor-pointer transition-all shadow-xs">
            <span class="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>View Expected Arrivals</span>
          </button>
        </div>

        <!-- Checked-in Profiles Cards -->
        <div class="space-y-3">
          ${checkedInList.map(res => {
            const isNewlyCheckedIn = this.recentlyCheckedInId === res.id;
            const roomNum = res.assignedRoom || res.roomNumber;
            const keycard = res.keycardIssued || `KC-${roomNum || '204'}-A`;
            const doc = res.idVerification || {};

            return `
              <div class="bg-surface-container-lowest border ${
                isNewlyCheckedIn ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md' : 'border-outline-variant hover:border-primary/40'
              } rounded-2xl p-5 shadow-xs transition-all flex flex-col gap-4">
                
                <!-- Profile Header -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/60">
                  <div class="flex items-center gap-3">
                    <div class="w-11 h-11 rounded-xl ${isNewlyCheckedIn ? 'bg-emerald-600 text-white' : 'bg-primary/10 text-primary'} flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                      ${(res.guestName || 'G').split(' ').map(w => w[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <div class="flex items-center gap-2 flex-wrap">
                        <h4 class="font-headline-sm text-sm font-bold text-primary">${res.guestName}</h4>
                        
                        ${isNewlyCheckedIn ? `
                          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white animate-pulse shadow-xs">
                            <span class="material-symbols-outlined text-[12px]">verified</span>
                            <span>JUST CHECKED IN NOW</span>
                          </span>
                        ` : ''}

                        <span class="px-2 py-0.5 rounded text-[10px] font-bold font-data-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                          ● CHECKED IN
                        </span>

                        ${res.vip ? `
                          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-700 border border-amber-500/30">
                            ★ VIP ${res.vipTier || ''}
                          </span>
                        ` : ''}
                      </div>

                      <div class="flex items-center gap-3 text-xs text-on-surface-variant mt-0.5 flex-wrap">
                        <span class="font-data-mono font-semibold">${res.confirmationCode}</span>
                        <span>·</span>
                        <span>${res.bookingType || 'ONLINE'}</span>
                        <span>·</span>
                        <span>${res.phone || res.email || 'Contact on file'}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Room & Keycard Pills -->
                  <div class="flex items-center gap-2 flex-wrap">
                    <div class="px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-[16px] text-primary">meeting_room</span>
                      <span class="text-xs font-bold text-primary">Room #${roomNum}</span>
                      <span class="text-[10px] text-on-surface-variant">(${res.roomType})</span>
                    </div>

                    <div class="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-[16px] text-emerald-700">key</span>
                      <span class="text-xs font-bold font-data-mono">${keycard}</span>
                    </div>
                  </div>
                </div>

                <!-- Profile Body Details Grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <!-- Stay Timeline -->
                  <div class="p-3 rounded-xl bg-surface-container/60 border border-outline-variant/40 flex flex-col justify-between">
                    <span class="text-[10px] font-bold uppercase text-on-surface-variant">Stay Duration</span>
                    <div class="font-semibold text-primary mt-1">
                      ${res.checkIn} → ${res.checkOut}
                    </div>
                    <span class="text-[11px] text-on-surface-variant mt-0.5 font-medium">${res.nights || 1} Night(s) Stay</span>
                  </div>

                  <!-- Document Verification Record -->
                  <div class="p-3 rounded-xl bg-surface-container/60 border border-outline-variant/40 flex flex-col justify-between">
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] font-bold uppercase text-on-surface-variant">ID Document</span>
                      <span class="text-[10px] font-bold text-emerald-700">✓ Verified</span>
                    </div>
                    <div class="font-semibold text-primary mt-1 truncate">
                      ${doc.documentType || 'Passport'}: ${doc.documentNumber || 'VERIFIED'}
                    </div>
                    <span class="text-[11px] text-on-surface-variant mt-0.5 truncate">
                      Issuing: ${doc.issuingCountry || 'Verified'} · Exp: ${doc.expiryDate || 'Valid'}
                    </span>
                  </div>

                  <!-- Folio & Billing -->
                  <div class="p-3 rounded-xl bg-surface-container/60 border border-outline-variant/40 flex flex-col justify-between">
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] font-bold uppercase text-on-surface-variant">Folio Balance</span>
                      <span class="text-[10px] font-bold text-emerald-700">✓ Settled</span>
                    </div>
                    <div class="font-semibold text-primary mt-1">
                      $${res.totalAmount || res.paidAmount || res.roomRate || 0}
                    </div>
                    <span class="text-[11px] text-on-surface-variant mt-0.5">${res.paymentMethod || 'Online Pre-paid'}</span>
                  </div>
                </div>

                <!-- Footer Quick Actions -->
                <div class="flex items-center justify-between pt-2 border-t border-outline-variant/40 flex-wrap gap-2">
                  <div class="text-[11px] text-on-surface-variant flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
                    <span>Check-in complete · Access active until ${res.checkOut} 11:00 AM</span>
                  </div>

                  <div class="flex items-center gap-2">
                    <button class="btn-arr-open-folio px-3 py-1.5 rounded-xl border border-outline-variant hover:border-primary text-xs font-bold text-primary flex items-center gap-1.5 transition-all cursor-pointer shadow-xs hover:bg-surface-container">
                      <span class="material-symbols-outlined text-[15px]">receipt_long</span>
                      <span>Folio Ledger</span>
                    </button>
                    <button class="btn-arr-back-arrivals px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs hover:bg-primary/90">
                      <span class="material-symbols-outlined text-[15px]">arrow_back</span>
                      <span>Back to Arrivals</span>
                    </button>
                  </div>
                </div>

              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  bindEvents() {
    const searchInput = document.getElementById('arr-search-input');
    if (searchInput) {
      searchInput.oninput = () => {
        this.searchQuery = searchInput.value;
        this.renderContent();
        const el = document.getElementById('arr-search-input');
        if (el) {
          el.focus();
          el.setSelectionRange(el.value.length, el.value.length);
        }
      };
    }

    const btnWalkIn = document.getElementById('btn-arr-walkin');
    if (btnWalkIn) {
      btnWalkIn.onclick = () => store.setNavTab('bookings');
    }

    const btnEmptyWalkIn = document.getElementById('btn-empty-handle-walkin');
    if (btnEmptyWalkIn) {
      btnEmptyWalkIn.onclick = () => store.setNavTab('bookings');
    }

    document.querySelectorAll('.btn-arr-filter').forEach(btn => {
      btn.onclick = () => {
        this.filterStatus = btn.dataset.filter;
        this.renderContent();
      };
    });

    // Back to arrivals from checked-in view
    document.querySelectorAll('#btn-arr-back-arrivals, .btn-arr-back-arrivals').forEach(btn => {
      btn.onclick = () => {
        this.filterStatus = 'ALL';
        this.renderContent();
      };
    });

    // Open folio ledger
    document.querySelectorAll('.btn-arr-open-folio').forEach(btn => {
      btn.onclick = () => {
        store.setNavTab('accounts');
      };
    });

    // 1. Contextual Action: Verify ID
    document.querySelectorAll('.btn-verify-guest-id').forEach(btn => {
      btn.onclick = () => {
        const resId = btn.dataset.resId;
        const res = (store.state.reservations || []).find(r => r.id === resId);
        if (!res) return;

        const modal = new DocumentVerificationModal({
          reservation: res,
          onVerified: () => {
            this.renderContent();
          }
        });
        document.body.appendChild(modal.render());
      };
    });

    // 2. Contextual Action: Check Room Readiness / Assign Room
    document.querySelectorAll('.btn-check-room-readiness').forEach(btn => {
      btn.onclick = () => {
        const resId = btn.dataset.resId;
        const res = (store.state.reservations || []).find(r => r.id === resId);
        if (!res) return;

        const initialRoom = btn.dataset.room || '204';
        const modal = new RoomReadinessModal({
          reservation: res,
          initialRoomNumber: initialRoom,
          onAssigned: (roomNum) => {
            this.renderContent();
          }
        });
        document.body.appendChild(modal.render());
      };
    });

    // 3. Contextual Action: Check-In Gate & Key Issuance
    document.querySelectorAll('.btn-start-checkin').forEach(btn => {
      btn.onclick = () => {
        const resId = btn.dataset.resId;
        const res = (store.state.reservations || []).find(r => r.id === resId);
        if (!res) return;

        const modal = new CheckInModal({
          reservation: res,
          onCheckedIn: (checkedInId) => {
            this.filterStatus = 'CHECKED_IN';
            this.recentlyCheckedInId = checkedInId || res.id;
            this.renderContent();
            store.showToast(`✓ Check-in completed! Viewing active in-house profile for ${res.guestName}.`, 'success');
          },
          onSuccess: (checkedInId) => {
            this.filterStatus = 'CHECKED_IN';
            this.recentlyCheckedInId = checkedInId || res.id;
            this.renderContent();
          }
        });
        document.body.appendChild(modal.render());
      };
    });
  }
}
