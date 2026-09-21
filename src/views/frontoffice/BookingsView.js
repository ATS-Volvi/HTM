// ==========================================================================
// VOLVITECH HOSPITALITY OS — FRONT DESK BOOKINGS WORKSPACE
// Core Starting Point: 1. Online Booking  2. Walk-In Booking
// Business Process: Version 1.0 (Strictly Online & Walk-In Only)
// ==========================================================================

import { store } from '../../state/store.js';
import { DocumentVerificationModal } from './DocumentVerificationModal.js';
import { RoomReadinessModal } from './RoomReadinessModal.js';
import { CheckInModal } from './CheckInModal.js';
import { OnlineServicesModal } from './OnlineServicesModal.js';
import { NewOnlineBookingModal } from './NewOnlineBookingModal.js';
import { NewBookingModal } from './NewBookingModal.js';
import { CheckOutModal } from './CheckOutModal.js';

export class BookingsView {
  constructor() {
    this.container = null;
    this.activeMode = 'profiles'; // Default to unified single-page bookings hub
    this.profilesFilterStatus = 'ALL'; // 'ALL' | 'ONLINE' | 'WALK_IN' | 'ASSIGNED' | 'UNASSIGNED' | 'NOT_READY' | 'CHECKED_IN'
    this.profilesSearchQuery = '';

    // Online Booking Flow Step (1 to 6)
    this.onlineStep = 1;
    this.onlineData = {
      firstName: '',
      lastName: '',
      guestName: '',
      email: '',
      phone: '',
      nationality: 'United Kingdom',
      checkInDate: new Date().toISOString().substring(0, 10),
      checkOutDate: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 3);
        return d.toISOString().substring(0, 10);
      })(),
      nights: 3,
      adults: 2,
      children: 0,
      roomTypeId: 'rt-2',
      roomTypeName: 'Deluxe Ocean Suite',
      ratePlanId: 'BAR_FLEX',
      ratePlanName: 'Best Available Flexible Rate',
      ratePerNight: 480,
      totalAmount: 1440,
      specialRequests: '',
      optionalServices: [],
      paymentMethod: 'Credit Card (Online Pre-paid)',
      cardNumber: '•••• •••• •••• 4242',
      cardExpiry: '08/29',
      cardCvv: '•••',
      paymentSimulatedSuccess: true
    };
    this.onlineConfirmedRes = null;

    // Walk-In Booking Flow Step (1 to 5)
    this.walkInStep = 1;
    this.walkInData = {
      guestName: '',
      email: '',
      phone: '',
      nationality: 'India',
      idType: 'PASSPORT',
      idNumber: '',
      checkInDate: new Date().toISOString().substring(0, 10),
      checkOutDate: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 2);
        return d.toISOString().substring(0, 10);
      })(),
      nights: 2,
      adults: 1,
      children: 0,
      roomTypeId: 'rt-1',
      roomTypeName: 'Classic King Room',
      selectedRoomNumber: '205',
      rateDiscussed: 280,
      guestAcceptedRate: true,
      alternativeOffered: false,
      optionalServices: [],
      specialRequests: '',
      paymentMethod: 'Credit Card (Front Desk POS)',
      paymentCollected: true
    };
    this.walkInConfirmedRes = null;

    // Profiles (Arrivals & Checked-In Profiles) Mode
    this.profilesFilterStatus = 'ALL'; // 'ALL', 'ASSIGNED', 'UNASSIGNED', 'NOT_READY', 'CHECKED_IN'
    this.profilesSearchQuery = '';
    this.recentlyCheckedInId = null;
    this.filterType = 'ALL'; // fallback
    this.searchQuery = ''; // fallback

    // Profile Detail Side Tab / Drawer State
    this.activeProfileDrawer = null; // Currently viewed reservation or in-house guest profile
    this.activeCheckoutConfirm = false; // Checkout confirmation prompt state in drawer

    // Online Booking Mode: Default to Incoming Feed (Web Channel Monitor)
    this.showOnlineSimulator = false;
    this.onlineSampleIndex = 0;
    this.onlineSearchQuery = '';
    this.onlineViewLayout = 'list'; // 'list' (Document Verification Desk) | 'cards'
    this.onlineFilterStatus = 'ALL'; // 'ALL' | 'PENDING_VERIFY' | 'VERIFIED' | 'CHECKED_IN'
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
    const reservations = state.reservations || [];
    const arrivals = reservations.filter(r => r.status === 'Confirmed' || r.status === 'ARRIVED');
    const checkedIn = reservations.filter(r => r.status === 'Checked In');
    const profilesCount = arrivals.length;
    const onlineCount = arrivals.filter(r => (r.bookingType || '').toUpperCase() === 'ONLINE' || r.channel === 'Online' || r.channel === 'Direct Web Engine').length;
    const walkinCount = arrivals.filter(r => (r.bookingType || '').toUpperCase() === 'WALK_IN' || r.channel === 'Walk-In').length;
    const checkedInCount = checkedIn.length;

    this.container.innerHTML = `
      <!-- Workspace Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-outline-variant/60 pb-5">
        <div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-data-mono uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
              Front Desk Module V1.0
            </span>
            <span class="text-xs text-on-surface-variant font-medium">Single-Page Operations Hub</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold font-headline-lg text-primary tracking-tight mt-1.5">
            Bookings Workspace
          </h1>
          <p class="text-xs text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
            All-in-one arrivals, guest intake, and in-house resident management. Filter <strong>Online Bookings</strong>, <strong>Walk-Ins</strong>, and <strong>Checked-In Guests</strong> directly on this page, review profiles, verify IDs, and manage departures seamlessly in a single page.
          </p>
        </div>

        <!-- Mode Switcher & Quick Intake Actions -->
        <div class="flex items-center gap-2 flex-wrap shrink-0">
          <div class="flex items-center gap-1 p-1 rounded-xl bg-surface-container border border-outline-variant shadow-xs">
            <button 
              id="btn-mode-profiles"
              data-mode="profiles"
              class="px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                this.profilesFilterStatus === 'ALL'
                  ? 'bg-primary text-on-primary shadow-sm font-bold'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-bright'
              }"
            >
              <span class="material-symbols-outlined text-[18px]">badge</span>
              <span>All Arrivals (${profilesCount})</span>
            </button>

            <button 
              id="btn-mode-checkedin"
              data-mode="checkedin"
              class="px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                this.profilesFilterStatus === 'CHECKED_IN'
                  ? 'bg-emerald-700 text-white shadow-sm font-bold'
                  : 'text-on-surface-variant hover:text-emerald-700 hover:bg-surface-bright'
              }"
            >
              <span class="material-symbols-outlined text-[18px]">hotel</span>
              <span>Checked-In (${checkedInCount})</span>
            </button>

            <button 
              id="btn-mode-online"
              data-mode="online"
              class="px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                this.profilesFilterStatus === 'ONLINE'
                  ? 'bg-primary text-on-primary shadow-sm font-bold'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-bright'
              }"
            >
              <span class="material-symbols-outlined text-[18px]">public</span>
              <span>Online (${onlineCount})</span>
            </button>

            <button 
              id="btn-mode-walkin"
              data-mode="walkin"
              class="px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                this.profilesFilterStatus === 'WALK_IN'
                  ? 'bg-primary text-on-primary shadow-sm font-bold'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-bright'
              }"
            >
              <span class="material-symbols-outlined text-[18px]">directions_walk</span>
              <span>Walk-Ins (${walkinCount})</span>
            </button>
          </div>

          <button 
            id="btn-open-new-online-booking-modal"
            class="px-3 py-2 rounded-xl bg-surface-bright border border-outline-variant hover:border-primary text-xs font-bold text-primary flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
            title="Create new online web booking with pre-collected document"
          >
            <span class="material-symbols-outlined text-[17px]">add_circle</span>
            <span class="hidden sm:inline">+ Online</span>
          </button>

          <button 
            id="btn-header-new-walkin"
            class="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
            title="Intake new walk-in guest at front desk"
          >
            <span class="material-symbols-outlined text-[17px]">person_add</span>
            <span>+ Walk-In</span>
          </button>

          <button 
            id="btn-simulate-incoming-web"
            class="p-2 rounded-xl border border-outline-variant hover:border-primary text-primary hover:bg-surface-bright transition-all cursor-pointer shadow-xs"
            title="⚡ Simulate Incoming Web Booking Arrival"
          >
            <span class="material-symbols-outlined text-[18px]">bolt</span>
          </button>
        </div>
      </div>

      <!-- Main Body Container -->
      <div id="bookings-main-mount" class="w-full">
        ${
          this.activeMode === 'online'
            ? (this.showOnlineSimulator ? this.renderOnlineWorkflow() : this.renderOnlineFeed())
            : this.activeMode === 'walkin'
            ? this.renderWalkInWorkflow()
            : this.renderProfilesView()
        }
      </div>

      <!-- PROFILE DETAIL SIDE TAB / DRAWER -->
      <div id="profile-drawer-backdrop" class="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 transition-opacity duration-300 ${this.activeProfileDrawer ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}"></div>
      <aside id="profile-detail-drawer" class="fixed top-0 right-0 h-full w-full max-w-xl bg-surface-container-lowest shadow-2xl z-50 border-l border-outline-variant flex flex-col transform transition-transform duration-300 ease-out select-none ${this.activeProfileDrawer ? 'translate-x-0' : 'translate-x-full'}">
        ${this.renderProfileDrawerContent()}
      </aside>
    `;

    this.bindEvents();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PROFILE DETAIL SIDE TAB (DRAWER) CONTROLLER & RENDERER
  // ═══════════════════════════════════════════════════════════════════════════
  openProfileDrawer(idOrName) {
    const allRes = store.state.reservations || [];
    let res = allRes.find(r => r.id === idOrName || r.confirmationCode === idOrName);
    if (!res) {
      res = allRes.find(r => r.guestName === idOrName);
    }
    if (!res && store.state.activeCheckedInGuests) {
      const inHouse = store.state.activeCheckedInGuests.find(g => g.id === idOrName || g.name === idOrName || g.reservationNumber === idOrName);
      if (inHouse) {
        res = allRes.find(r => r.id === inHouse.id || r.confirmationCode === inHouse.reservationNumber || r.guestName === inHouse.name) || {
          id: inHouse.id,
          confirmationCode: inHouse.reservationNumber || 'VOL-INHOUSE',
          guestName: inHouse.name,
          phone: inHouse.phone,
          email: inHouse.email,
          roomNumber: inHouse.roomNumber,
          assignedRoom: inHouse.roomNumber,
          roomType: inHouse.roomType,
          status: 'Checked In',
          checkIn: inHouse.checkInDate,
          checkOut: inHouse.checkOutDate,
          totalAmount: inHouse.totalCharges || inHouse.totalAmount,
          paidAmount: inHouse.paidAmount,
          vip: inHouse.vip,
          vipTier: inHouse.vipTier,
          optionalServices: []
        };
      }
    }
    if (res) {
      this.activeProfileDrawer = res;
      this.activeCheckoutConfirm = false;
      this.renderContent();
    }
  }

  closeProfileDrawer() {
    this.activeProfileDrawer = null;
    this.activeCheckoutConfirm = false;
    this.renderContent();
  }

  executeCheckoutFromDrawer() {
    if (!this.activeProfileDrawer) return;
    const res = this.activeProfileDrawer;
    const roomNum = res.assignedRoom || res.roomNumber;

    if (roomNum) {
      store.checkOutGuestLifecycle(roomNum, res.id || res.confirmationCode);
    } else {
      res.status = 'Checked Out';
      store.showToast(`✓ Checkout completed for ${res.guestName}.`, 'success');
    }

    res.status = 'Checked Out';
    this.activeCheckoutConfirm = false;
    this.renderContent();
  }

  renderProfileDrawerContent() {
    if (!this.activeProfileDrawer) {
      return '';
    }

    const res = this.activeProfileDrawer;
    const roomNum = res.assignedRoom || res.roomNumber;
    const keycard = res.keycardIssued || res.keyCardNumber || (roomNum ? `KC-${roomNum}-A` : null);
    const isDocVerified = !!(res.identityVerified || res.idVerification?.verified);
    const doc = res.idVerification || res.onlineDocument || {};
    const isInHouse = res.status === 'Checked In' || res.status === 'IN_HOUSE';
    const isCheckedOut = res.status === 'Checked Out';

    // Linked Guest CRM Profile info if available
    const allGuests = store.state.guests || [];
    const guestCrm = allGuests.find(g => (res.guestId && g.id === res.guestId) || g.name === res.guestName);
    const preferences = guestCrm?.preferences || {};

    // Financial breakdown
    const roomCharges = Number(res.ratePerNight ? res.ratePerNight * (res.nights || 1) : (res.totalAmount || 0));
    const servicesTotal = (res.optionalServices || []).reduce((sum, s) => sum + (Number(s.price) || 0), 0);
    const taxes = Math.round((roomCharges + servicesTotal) * 0.1);
    const grandTotal = Number(res.totalAmount) || (roomCharges + servicesTotal + taxes);
    const paidAmount = Number(res.paidAmount) || (isInHouse || isDocVerified ? grandTotal : 0);
    const balanceDue = Math.max(0, grandTotal - paidAmount);

    return `
      <!-- Drawer Header -->
      <div class="p-6 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-12 h-12 rounded-2xl ${isInHouse ? 'bg-emerald-600 text-white' : isCheckedOut ? 'bg-slate-600 text-white' : 'bg-primary text-on-primary'} flex items-center justify-center font-bold text-base shadow-xs shrink-0">
            ${(res.guestName || 'G').split(' ').map(w => w[0]).join('').substring(0, 2)}
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="font-headline-sm text-base font-bold text-primary truncate">${res.guestName}</h3>
              ${res.vip ? `
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-700 border border-amber-500/30">
                  ★ VIP ${res.vipTier || ''}
                </span>
              ` : ''}
              <span class="px-2 py-0.5 rounded text-[10px] font-bold font-data-mono ${
                (res.bookingType || '').toUpperCase() === 'ONLINE' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
              }">
                ${res.bookingType || 'DIRECT'}
              </span>
            </div>
            <div class="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5 font-data-mono">
              <span>Conf: <strong>${res.confirmationCode || res.id}</strong></span>
              <span>·</span>
              <span class="${isInHouse ? 'text-emerald-700 font-bold' : isCheckedOut ? 'text-slate-600 font-bold' : 'text-primary font-semibold'}">
                ${isInHouse ? '● IN-HOUSE' : isCheckedOut ? '✓ CHECKED OUT' : '✈ ARRIVAL CONFIRMED'}
              </span>
            </div>
          </div>
        </div>

        <button id="btn-close-profile-drawer" class="p-2 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-primary transition-colors cursor-pointer" title="Close Profile Side Tab">
          <span class="material-symbols-outlined text-[22px]">close</span>
        </button>
      </div>

      <!-- Drawer Scrollable Body -->
      <div class="p-6 overflow-y-auto flex-1 space-y-5 text-xs custom-scrollbar">

        <!-- 1. CHECKOUT & CHECK-IN OPERATIONAL HERO BANNER -->
        ${isInHouse ? `
          ${this.activeCheckoutConfirm ? `
            <div class="p-4 rounded-2xl bg-rose-50 border-2 border-rose-400 space-y-3 shadow-sm animate-fadeIn">
              <div class="flex items-center gap-2 text-rose-900 font-bold text-sm">
                <span class="material-symbols-outlined text-[20px] text-rose-700">logout</span>
                <span>Confirm Guest Checkout</span>
              </div>
              <p class="text-xs text-rose-900 leading-relaxed">
                You are about to check out <strong>${res.guestName}</strong> from <strong>Room #${roomNum}</strong>.
              </p>
              <div class="bg-white/90 p-3 rounded-xl border border-rose-200 space-y-1.5 text-xs">
                <div class="flex justify-between items-center">
                  <span class="text-on-surface-variant">Assigned Room:</span>
                  <span class="font-bold text-primary font-data-mono">#${roomNum} (${res.roomType})</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-on-surface-variant">RFID Keycard:</span>
                  <span class="font-bold text-primary font-data-mono">${keycard || 'Deactivate & Return'}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-on-surface-variant">Total Charges:</span>
                  <span class="font-bold text-primary font-data-mono">$${grandTotal}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-on-surface-variant">Outstanding Balance:</span>
                  <span class="font-bold ${balanceDue > 0 ? 'text-rose-700' : 'text-emerald-700'} font-data-mono">
                    ${balanceDue > 0 ? `$${balanceDue} Due` : '✓ Cleared & Settled ($0.00)'}
                  </span>
                </div>
                <div class="flex justify-between items-center pt-1 border-t border-rose-100 text-[11px] text-amber-800">
                  <span>Room Lifecycle:</span>
                  <span class="font-semibold">Will be marked DIRTY & dispatched to Housekeeping</span>
                </div>
              </div>

              <div class="flex items-center gap-2 pt-1">
                <button id="btn-drawer-confirm-checkout" class="flex-1 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98">
                  <span class="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Complete Checkout Now</span>
                </button>
                <button id="btn-drawer-cancel-checkout" class="px-4 py-2.5 rounded-xl border border-rose-300 hover:bg-rose-100 text-rose-800 font-bold text-xs transition-all cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>
          ` : `
            <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-900 font-data-mono">
                    ROOM #${roomNum}
                  </span>
                  <span class="text-[10px] font-bold text-emerald-800 font-data-mono">
                    KEY: ${keycard || 'ACTIVE'}
                  </span>
                </div>
                <p class="text-xs text-emerald-900 mt-1">
                  Active in-house resident. Expected departure: <strong>${res.checkOut}</strong> (11:00 AM).
                </p>
              </div>
              <button id="btn-drawer-checkout-trigger" class="px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 active:scale-95" title="Check Out Guest and Free Room">
                <span class="material-symbols-outlined text-[17px]">logout</span>
                <span>Check Out</span>
              </button>
            </div>
          `}
        ` : isCheckedOut ? `
          <div class="p-4 rounded-2xl bg-surface-container border border-outline-variant flex items-center justify-between gap-3 shadow-xs">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center">
                <span class="material-symbols-outlined text-[20px]">task_alt</span>
              </div>
              <div>
                <h4 class="text-xs font-bold text-primary">Guest Checked Out & Departed</h4>
                <p class="text-[11px] text-on-surface-variant">
                  Room #${roomNum || '—'} is in Turnover Cleaning status. Folio settled.
                </p>
              </div>
            </div>
            <button id="btn-drawer-open-folio" class="px-3 py-1.5 rounded-xl border border-outline-variant hover:border-primary text-xs font-bold text-primary hover:bg-surface-bright transition-all cursor-pointer">
              Folio Receipt
            </button>
          </div>
        ` : `
          <!-- Arrival Ready for Check-In -->
          <div class="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold uppercase font-data-mono text-primary">EXPECTED ARRIVAL</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isDocVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                  ${isDocVerified ? '✓ ID Verified' : '⚠ ID Pending'}
                </span>
              </div>
              <p class="text-xs text-on-surface-variant mt-1">
                ${roomNum ? `Allocated to Room #${roomNum}` : 'No room assigned yet'} · ${res.nights || 1} Night(s) Stay
              </p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button id="btn-drawer-checkin-trigger" class="btn-drawer-checkin-action px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer">
                <span class="material-symbols-outlined text-[16px]">how_to_reg</span>
                <span>Check-In →</span>
              </button>
              <button id="btn-drawer-checkout-trigger" class="px-3 py-2 rounded-xl border border-outline-variant hover:border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-bold transition-all cursor-pointer" title="Direct Checkout / Departure">
                <span>Check Out</span>
              </button>
            </div>
          </div>
        `}

        <!-- 2. ROOM & STAY DETAILS -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-3 shadow-xs">
          <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">STAY & ROOM ACCOMMODATION</span>
            <span class="text-[10px] font-bold text-primary font-data-mono">${res.nights || 1} NIGHTS</span>
          </div>

          <div class="grid grid-cols-2 gap-3 pt-1">
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono uppercase">Room Category</span>
              <span class="font-bold text-primary text-xs">${res.roomType || 'Classic King'}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono uppercase">Assigned Room</span>
              <div class="flex items-center gap-1.5 mt-0.5">
                ${roomNum ? `
                  <span class="font-bold text-primary text-xs">Room #${roomNum}</span>
                  <button id="btn-drawer-check-room" class="text-[10px] text-primary underline hover:text-primary/80 cursor-pointer">Check / Change</button>
                ` : `
                  <span class="text-amber-700 font-bold text-xs">Unassigned</span>
                  <button id="btn-drawer-check-room" class="text-[10px] text-primary underline hover:text-primary/80 cursor-pointer font-bold">+ Assign</button>
                `}
              </div>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono uppercase">Check-In Date</span>
              <span class="font-semibold text-primary text-xs">${res.checkIn || 'Today'}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono uppercase">Check-Out Date</span>
              <span class="font-semibold text-primary text-xs">${res.checkOut || 'Upcoming'}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono uppercase">Occupancy</span>
              <span class="font-semibold text-primary text-xs">${res.adults || 1} Adult(s), ${res.children || 0} Child(ren)</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono uppercase">Rate Plan</span>
              <span class="font-semibold text-primary text-xs">${res.ratePlanName || 'Best Available Rate'}</span>
            </div>
          </div>

          ${res.specialRequests ? `
            <div class="p-3 bg-surface-container/60 rounded-xl border border-outline-variant/40 mt-2">
              <span class="text-[10px] font-bold text-on-surface-variant uppercase font-label-caps block mb-0.5">Special Requests</span>
              <p class="text-xs text-primary italic">${res.specialRequests}</p>
            </div>
          ` : ''}
        </div>

        <!-- 3. GUEST CONTACT & CRM INTELLIGENCE -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-3 shadow-xs">
          <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">GUEST CONTACT & CRM</span>
            ${guestCrm?.loyaltyPoints ? `
              <span class="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                ${guestCrm.loyaltyPoints.toLocaleString()} PTS
              </span>
            ` : ''}
          </div>

          <div class="grid grid-cols-2 gap-3 pt-1">
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono uppercase">Phone</span>
              <span class="font-semibold text-primary text-xs">${res.phone || guestCrm?.phone || 'Contact on file'}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono uppercase">Email</span>
              <span class="font-semibold text-primary text-xs truncate block">${res.email || guestCrm?.email || 'email@guest.com'}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono uppercase">Country / Nationality</span>
              <span class="font-semibold text-primary text-xs">${res.nationality || doc.issuingCountry || guestCrm?.nationality || 'International'}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono uppercase">Stay History</span>
              <span class="font-semibold text-primary text-xs">${guestCrm?.totalStays ? `${guestCrm.totalStays} prior stays` : '1st Visit'}</span>
            </div>
          </div>

          ${preferences.pillow || preferences.dietary || preferences.beverage ? `
            <div class="p-3 bg-surface-container/60 rounded-xl border border-outline-variant/40 mt-1 space-y-1 text-xs">
              <span class="text-[10px] font-bold text-on-surface-variant uppercase font-label-caps block">Guest Preferences</span>
              ${preferences.pillow ? `<div><span class="text-on-surface-variant">Pillow:</span> <strong>${preferences.pillow}</strong></div>` : ''}
              ${preferences.dietary ? `<div><span class="text-on-surface-variant">Dietary:</span> <strong>${preferences.dietary}</strong></div>` : ''}
              ${preferences.beverage ? `<div><span class="text-on-surface-variant">Beverage:</span> <strong>${preferences.beverage}</strong></div>` : ''}
            </div>
          ` : ''}
        </div>

        <!-- 4. IDENTIFICATION DOCUMENT RECORD -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-3 shadow-xs">
          <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">GOVERNMENT ID VERIFICATION</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isDocVerified ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}">
              ${isDocVerified ? '✓ ID VERIFIED' : 'PENDING CAPTURE'}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-3 pt-1">
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono uppercase">Document Type</span>
              <span class="font-semibold text-primary text-xs">${doc.documentType || 'Passport'}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono uppercase">Document Number</span>
              <span class="font-bold text-primary text-xs font-data-mono">${doc.documentNumber || 'Pending verification'}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono uppercase">Issuing Country</span>
              <span class="font-semibold text-primary text-xs">${doc.issuingCountry || res.nationality || 'United Kingdom'}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono uppercase">Expiration Date</span>
              <span class="font-semibold text-primary text-xs font-data-mono">${doc.expiryDate || '2030-12-31'}</span>
            </div>
          </div>

          ${doc.extractedAddress ? `
            <div class="pt-1">
              <span class="text-[10px] text-on-surface-variant block font-data-mono uppercase">Verified Address</span>
              <span class="text-xs text-primary font-medium">${doc.extractedAddress}</span>
            </div>
          ` : ''}

          <div class="pt-2 flex justify-end">
            <button id="btn-drawer-verify-id" class="px-3 py-1.5 rounded-xl border border-outline-variant hover:border-primary text-xs font-bold text-primary hover:bg-surface-bright transition-all cursor-pointer flex items-center gap-1.5 shadow-xs">
              <span class="material-symbols-outlined text-[15px]">badge</span>
              <span>${isDocVerified ? 'Review / Update ID' : 'Verify ID Document'}</span>
            </button>
          </div>
        </div>

        <!-- 5. STAY SERVICES & AMENITIES -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-3 shadow-xs">
          <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">STAY SERVICES & AMENITIES</span>
            <span class="text-[10px] font-bold text-primary font-data-mono">$${servicesTotal} TOTAL</span>
          </div>

          ${res.optionalServices && res.optionalServices.length > 0 ? `
            <div class="space-y-2 pt-1">
              ${res.optionalServices.map(srv => `
                <div class="p-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/40 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-[16px] text-primary">
                      ${srv.category === 'Transport' ? 'airport_shuttle' : srv.category === 'Dining' ? 'restaurant' : srv.category === 'Wellness' ? 'spa' : 'room_service'}
                    </span>
                    <div>
                      <span class="font-semibold text-primary block">${srv.name}</span>
                      <span class="text-[10px] text-on-surface-variant">${srv.category || 'Service'} · Confirmed</span>
                    </div>
                  </div>
                  <span class="font-bold text-primary font-data-mono text-xs">$${srv.price}</span>
                </div>
              `).join('')}
            </div>
          ` : `
            <p class="text-xs text-on-surface-variant py-1">No additional stay services added yet.</p>
          `}

          <div class="pt-2 flex justify-end">
            <button id="btn-drawer-services" class="px-3 py-1.5 rounded-xl border border-outline-variant hover:border-primary text-xs font-bold text-primary hover:bg-surface-bright transition-all cursor-pointer flex items-center gap-1.5 shadow-xs">
              <span class="material-symbols-outlined text-[15px]">room_service</span>
              <span>Manage Services & Add-Ons</span>
            </button>
          </div>
        </div>

        <!-- 6. FOLIO & BILLING SUMMARY -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-3 shadow-xs">
          <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">FOLIO & BILLING SUMMARY</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${balanceDue === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
              ${balanceDue === 0 ? '✓ SETTLED' : 'BALANCE DUE'}
            </span>
          </div>

          <div class="space-y-1.5 pt-1 text-xs">
            <div class="flex justify-between">
              <span class="text-on-surface-variant">Accommodation Tariff:</span>
              <span class="font-semibold font-data-mono text-primary">$${roomCharges}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-on-surface-variant">Services & Amenities:</span>
              <span class="font-semibold font-data-mono text-primary">$${servicesTotal}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-on-surface-variant">Taxes & Fees (10%):</span>
              <span class="font-semibold font-data-mono text-primary">$${taxes}</span>
            </div>
            <div class="flex justify-between pt-1.5 border-t border-outline-variant/60 font-bold text-sm">
              <span class="text-primary">Total Folio Charges:</span>
              <span class="font-data-mono text-primary">$${grandTotal}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-on-surface-variant">Total Paid / Guarantee:</span>
              <span class="font-semibold font-data-mono text-emerald-700">$${paidAmount}</span>
            </div>
            <div class="flex justify-between text-xs font-bold pt-1 border-t border-dashed border-outline-variant/60">
              <span>Balance Due:</span>
              <span class="font-data-mono ${balanceDue > 0 ? 'text-rose-700' : 'text-emerald-700'}">
                $${balanceDue.toFixed(2)}
              </span>
            </div>
          </div>

          <div class="pt-2 flex items-center justify-between border-t border-outline-variant/40">
            <span class="text-[11px] text-on-surface-variant">Payment: <strong>${res.paymentMethod || 'Online Pre-paid'}</strong></span>
            <button id="btn-drawer-open-folio" class="px-3 py-1.5 rounded-xl border border-outline-variant hover:border-primary text-xs font-bold text-primary hover:bg-surface-bright transition-all cursor-pointer flex items-center gap-1.5 shadow-xs">
              <span class="material-symbols-outlined text-[15px]">receipt_long</span>
              <span>Folio Ledger</span>
            </button>
          </div>
        </div>

      </div>

      <!-- Drawer Footer Actions -->
      <div class="p-4 border-t border-outline-variant/70 bg-surface-bright flex items-center justify-between gap-2 shrink-0">
        <button id="btn-drawer-footer-close" class="px-4 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-on-surface-variant transition-all cursor-pointer">
          Close Tab
        </button>

        <div class="flex items-center gap-2">
          ${isInHouse ? `
            <button id="btn-drawer-footer-checkout" class="px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer active:scale-95">
              <span class="material-symbols-outlined text-[16px]">logout</span>
              <span>Check Out</span>
            </button>
          ` : isCheckedOut ? `
            <button id="btn-drawer-open-folio" class="px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer">
              <span class="material-symbols-outlined text-[16px]">receipt</span>
              <span>View Folio</span>
            </button>
          ` : `
            <button id="btn-drawer-footer-checkout" class="px-3.5 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-all cursor-pointer">
              Check Out
            </button>
            <button id="btn-drawer-footer-checkin" class="btn-drawer-checkin-action px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer active:scale-95">
              <span class="material-symbols-outlined text-[16px]">how_to_reg</span>
              <span>Check-In →</span>
            </button>
          `}
        </div>
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. ONLINE BOOKINGS — INCOMING WEB CHANNEL MONITOR & VERIFICATION DESK
  // ═══════════════════════════════════════════════════════════════════════════
  simulateIncomingWebBooking() {
    const samples = [
      {
        guestName: 'Sarah Mitchell',
        firstName: 'Sarah',
        lastName: 'Mitchell',
        email: 's.mitchell@vanguard.com',
        phone: '+1 (555) 382-9901',
        nationality: 'United Kingdom',
        roomTypeId: 'rt-2',
        roomTypeName: 'Deluxe Ocean Suite',
        ratePlanId: 'BAR_FLEX',
        ratePlanName: 'Best Available Flexible Rate',
        ratePerNight: 480,
        nights: 3,
        adults: 2,
        children: 0,
        totalAmount: 1440,
        specialRequests: 'High floor, ocean-facing, feather pillows.',
        onlineDocument: {
          documentType: 'PASSPORT',
          documentNumber: 'GB-99214482',
          issuingCountry: 'United Kingdom',
          expiryDate: '2032-05-18',
          dateOfBirth: '1989-07-22',
          extractedName: 'SARAH MITCHELL',
          extractedAddress: '42 Kensington Gardens, London W8 4PX',
          photoUploaded: true,
          submittedAt: new Date().toISOString()
        },
        optionalServices: [
          { id: 'srv-opt-1', name: 'Airport pickup', category: 'Transport', price: 90, status: 'Pending' }
        ]
      },
      {
        guestName: 'Elena Rostova',
        firstName: 'Elena',
        lastName: 'Rostova',
        email: 'e.rostova@geneva-private.ch',
        phone: '+41 22 819 4020',
        nationality: 'Switzerland',
        roomTypeId: 'rt-3',
        roomTypeName: 'Executive Panoramic Suite',
        ratePlanId: 'BAR_BFAST',
        ratePlanName: 'Artisan Breakfast Package',
        ratePerNight: 750,
        nights: 4,
        adults: 2,
        children: 1,
        totalAmount: 3000,
        specialRequests: 'Late arrival at 10 PM. Welcome fruit platter requested.',
        onlineDocument: {
          documentType: 'PASSPORT',
          documentNumber: 'CH-88192041',
          issuingCountry: 'Switzerland',
          expiryDate: '2031-09-12',
          dateOfBirth: '1992-11-04',
          extractedName: 'ELENA ROSTOVA',
          extractedAddress: 'Rue du Rhône 14, 1204 Genève',
          photoUploaded: true,
          submittedAt: new Date().toISOString()
        },
        optionalServices: [
          { id: 'srv-opt-2', name: 'Artisan Breakfast Package', category: 'Dining', price: 120, status: 'Pending' }
        ]
      },
      {
        guestName: 'Marcus Vance',
        firstName: 'Marcus',
        lastName: 'Vance',
        email: 'm.vance@techcorp.io',
        phone: '+1 (415) 555-0182',
        nationality: 'United States',
        roomTypeId: 'rt-1',
        roomTypeName: 'Classic King Room',
        ratePlanId: 'BAR_NONREF',
        ratePlanName: 'Pre-pay & Save (Non-refundable)',
        ratePerNight: 238,
        nights: 2,
        adults: 1,
        children: 0,
        totalAmount: 476,
        specialRequests: 'Quiet room away from elevator. Early check-in requested if ready.',
        onlineDocument: {
          documentType: 'DRIVERS_LICENSE',
          documentNumber: 'DL-CA-992104',
          issuingCountry: 'United States',
          expiryDate: '2029-03-19',
          dateOfBirth: '1985-03-19',
          extractedName: 'MARCUS VANCE',
          extractedAddress: '550 Howard St, San Francisco, CA',
          photoUploaded: true,
          submittedAt: new Date().toISOString()
        },
        optionalServices: []
      },
      {
        guestName: 'Lord Alistair Sterling',
        firstName: 'Alistair',
        lastName: 'Sterling',
        email: 'a.sterling@oxford-biomed.ac.uk',
        phone: '+44 1865 270000',
        nationality: 'United Kingdom',
        roomTypeId: 'rt-4',
        roomTypeName: 'Presidential Royal Penthouse',
        ratePlanId: 'BAR_FLEX',
        ratePlanName: 'Best Available Flexible Rate',
        ratePerNight: 2400,
        nights: 5,
        adults: 2,
        children: 0,
        totalAmount: 12000,
        specialRequests: 'VIP protocol. Chilled vintage champagne and fresh orchids on arrival.',
        onlineDocument: {
          documentType: 'PASSPORT',
          documentNumber: 'GB-DIP-004921',
          issuingCountry: 'United Kingdom',
          expiryDate: '2030-06-25',
          dateOfBirth: '1972-01-14',
          extractedName: 'LORD ALISTAIR STERLING',
          extractedAddress: 'Sterling Hall, Oxfordshire OX1 3QU',
          photoUploaded: true,
          submittedAt: new Date().toISOString()
        },
        optionalServices: [
          { id: 'srv-opt-1', name: 'Airport pickup', category: 'Transport', price: 90, status: 'Pending' },
          { id: 'srv-opt-3', name: 'Daily Spa & Thermal Access', category: 'Wellness', price: 350, status: 'Pending' }
        ]
      },
      {
        guestName: 'Dr. Amara Okafor',
        firstName: 'Amara',
        lastName: 'Okafor',
        email: 'a.okafor@lagos-health.org',
        phone: '+234 803 555 7890',
        nationality: 'Nigeria',
        roomTypeId: 'rt-2',
        roomTypeName: 'Deluxe Ocean Suite',
        ratePlanId: 'BAR_FLEX',
        ratePlanName: 'Best Available Flexible Rate',
        ratePerNight: 480,
        nights: 3,
        adults: 1,
        children: 0,
        totalAmount: 1530,
        specialRequests: 'Late check-in at 8:00 PM. High-speed Wi-Fi token for medical symposium prep.',
        onlineDocument: {
          documentType: 'PASSPORT',
          documentNumber: 'NG-A10982341',
          issuingCountry: 'Nigeria',
          expiryDate: '2033-02-14',
          dateOfBirth: '1984-06-30',
          extractedName: 'AMARA OKAFOR',
          extractedAddress: '14 Victoria Island Way, Lagos',
          photoUploaded: true,
          submittedAt: new Date().toISOString()
        },
        optionalServices: [
          { id: 'srv-opt-4', name: 'Airport Luxury Transfer', category: 'Transport', price: 90, status: 'Pending' }
        ]
      },
      {
        guestName: 'Sofia Rossi',
        firstName: 'Sofia',
        lastName: 'Rossi',
        email: 's.rossi@milano-design.it',
        phone: '+39 02 8901 2345',
        nationality: 'Italy',
        roomTypeId: 'rt-1',
        roomTypeName: 'Classic King Room',
        ratePlanId: 'BAR_FLEX',
        ratePlanName: 'Best Available Flexible Rate',
        ratePerNight: 280,
        nights: 2,
        adults: 2,
        children: 0,
        totalAmount: 626,
        specialRequests: 'Courtyard view. Request feather-free pillows.',
        onlineDocument: {
          documentType: 'NATIONAL_ID',
          documentNumber: 'IT-CA9920141',
          issuingCountry: 'Italy',
          expiryDate: '2031-10-20',
          dateOfBirth: '1993-04-15',
          extractedName: 'SOFIA ROSSI',
          extractedAddress: 'Via Monte Napoleone 8, 20121 Milano',
          photoUploaded: true,
          submittedAt: new Date().toISOString()
        },
        optionalServices: [
          { id: 'srv-opt-5', name: 'Artisan Breakfast Buffet', category: 'Dining', price: 70, status: 'Pending' }
        ]
      }
    ];

    const pick = samples[this.onlineSampleIndex % samples.length];
    this.onlineSampleIndex++;

    const today = new Date();
    const checkInDate = today.toISOString().substring(0, 10);
    const checkout = new Date(today);
    checkout.setDate(checkout.getDate() + pick.nights);
    const checkOutDate = checkout.toISOString().substring(0, 10);

    const bookingPayload = {
      ...pick,
      checkInDate,
      checkOutDate,
      paymentMethod: 'Credit Card (Online Pre-paid)',
      paymentSimulatedSuccess: true
    };

    const resResult = store.createOnlineBooking(bookingPayload);
    if (resResult.success) {
      this.onlineConfirmedRes = resResult.reservation;
      store.showToast(`⚡ Web Booking Received: ${pick.guestName} (${resResult.reservation.confirmationCode}) with pre-collected ID!`, 'success');
      this.renderContent();
    }
  }

  renderOnlineFeed() {
    const allReservations = store.state.reservations || [];
    const onlineReservations = allReservations.filter(r => {
      const isOnlineType = r.bookingType === 'ONLINE';
      const ch = (r.channel || '').toLowerCase();
      const isOnlineChannel = ch.includes('web') || ch.includes('online') || ch.includes('ota');
      const hasOnlCode = (r.confirmationCode || '').includes('ONL') || (r.confirmationNumber || '').includes('ONL');
      return isOnlineType || isOnlineChannel || hasOnlCode;
    });

    const totalCount = onlineReservations.length;
    const totalPrepaidRevenue = onlineReservations.reduce((acc, r) => acc + (Number(r.paidAmount) || Number(r.totalAmount) || 0), 0);
    const pendingVerifyCount = onlineReservations.filter(r => !r.identityVerified && !r.idVerified && r.status !== 'Checked In').length;
    const verifiedCount = onlineReservations.filter(r => (r.identityVerified || r.idVerified) && r.status !== 'Checked In').length;
    const inHouseCount = onlineReservations.filter(r => r.status === 'Checked In').length;

    // Apply Filter Tab
    let tabFiltered = onlineReservations;
    if (this.onlineFilterStatus === 'PENDING_VERIFY') {
      tabFiltered = onlineReservations.filter(r => !r.identityVerified && !r.idVerified && r.status !== 'Checked In');
    } else if (this.onlineFilterStatus === 'VERIFIED') {
      tabFiltered = onlineReservations.filter(r => (r.identityVerified || r.idVerified) && r.status !== 'Checked In');
    } else if (this.onlineFilterStatus === 'CHECKED_IN') {
      tabFiltered = onlineReservations.filter(r => r.status === 'Checked In');
    }

    // Apply Search Query
    const q = (this.onlineSearchQuery || '').toLowerCase().trim();
    const filtered = q
      ? tabFiltered.filter(r => 
          (r.guestName || '').toLowerCase().includes(q) ||
          (r.confirmationCode || '').toLowerCase().includes(q) ||
          (r.confirmationNumber || '').toLowerCase().includes(q) ||
          (r.email || '').toLowerCase().includes(q) ||
          (r.roomType || '').toLowerCase().includes(q) ||
          (r.onlineDocument?.documentNumber || '').toLowerCase().includes(q)
        )
      : tabFiltered;

    return `
      <div class="flex flex-col gap-6 animate-fadeIn">
        <!-- Web Channel Connection & Verification Desk Banner -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 sm:p-6 shadow-xs">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-xs">
                <span class="material-symbols-outlined text-[28px]">cloud_sync</span>
              </div>
              <div>
                <div class="flex flex-wrap items-center gap-2.5">
                  <span class="flex h-2.5 w-2.5 relative">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <h2 class="text-base font-bold font-headline-sm text-primary">Online Bookings & Document Verification Desk</h2>
                  <span class="text-[10px] font-bold font-data-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 uppercase tracking-wider">
                    ● Web Engine Auto-Sync Active
                  </span>
                </div>
                <p class="text-xs text-on-surface-variant mt-1.5 leading-relaxed max-w-3xl">
                  Guest details and identification documents are <strong>pre-collected online</strong> via web booking and direct check-in. Front desk agents do not type details manually; start document verification directly from the list below to reconcile and approve IDs.
                </p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2.5 shrink-0">
              <button 
                id="btn-open-new-online-booking-modal"
                class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                title="Add new online booking details with pre-collected identification and stay services"
              >
                <span class="material-symbols-outlined text-[18px]">add_circle</span>
                <span>+ Add Online Booking</span>
              </button>

              <button 
                id="btn-quick-simulate-online"
                class="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                title="Simulates an incoming online booking with pre-submitted passport details"
              >
                <span class="material-symbols-outlined text-[18px]">bolt</span>
                <span>Quick Simulate</span>
              </button>

              <button 
                id="btn-toggle-online-sim"
                class="px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-bright hover:bg-surface-container text-xs font-semibold text-on-surface flex items-center gap-2 cursor-pointer transition-all"
                title="Inspect the customer 6-step booking engine"
              >
                <span class="material-symbols-outlined text-[18px]">laptop_mac</span>
                <span>Guest Simulator</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Metrics KPI Strip -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[20px]">public</span>
            </div>
            <div>
              <div class="text-[11px] font-semibold text-on-surface-variant uppercase font-label-caps">Web Bookings</div>
              <div class="text-xl font-bold font-data-mono text-primary">${totalCount}</div>
            </div>
          </div>

          <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[20px]">badge</span>
            </div>
            <div>
              <div class="text-[11px] font-semibold text-on-surface-variant uppercase font-label-caps">Awaiting ID Verification</div>
              <div class="text-xl font-bold font-data-mono text-amber-600">${pendingVerifyCount}</div>
            </div>
          </div>

          <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[20px]">verified</span>
            </div>
            <div>
              <div class="text-[11px] font-semibold text-on-surface-variant uppercase font-label-caps">ID Verified & Ready</div>
              <div class="text-xl font-bold font-data-mono text-emerald-600">${verifiedCount}</div>
            </div>
          </div>

          <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[20px]">payments</span>
            </div>
            <div>
              <div class="text-[11px] font-semibold text-on-surface-variant uppercase font-label-caps">Pre-Paid Revenue</div>
              <div class="text-xl font-bold font-data-mono text-blue-600">$${totalPrepaidRevenue.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <!-- Filter Tabs & Controls Bar -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 shadow-xs">
          <!-- Status Filter Tabs -->
          <div class="flex flex-wrap items-center gap-1.5">
            ${[
              { id: 'ALL', label: 'All Online Bookings', count: totalCount },
              { id: 'PENDING_VERIFY', label: 'Awaiting ID Verification', count: pendingVerifyCount, badgeClass: 'bg-amber-100 text-amber-800' },
              { id: 'VERIFIED', label: 'ID Verified', count: verifiedCount, badgeClass: 'bg-emerald-100 text-emerald-800' },
              { id: 'CHECKED_IN', label: '🏨 Checked-In Profiles', count: inHouseCount, badgeClass: 'bg-emerald-100 text-emerald-800' }
            ].map(tab => `
              <button 
                class="btn-online-filter-tab px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  this.onlineFilterStatus === tab.id
                    ? 'bg-primary text-on-primary shadow-xs font-bold'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-bright'
                }"
                data-status="${tab.id}"
              >
                <span>${tab.label}</span>
                <span class="text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  this.onlineFilterStatus === tab.id
                    ? 'bg-on-primary/20 text-on-primary'
                    : (tab.badgeClass || 'bg-surface-container text-on-surface-variant')
                }">
                  ${tab.count}
                </span>
              </button>
            `).join('')}
          </div>

          <!-- Search & Layout Toggle -->
          <div class="flex items-center gap-3">
            <div class="w-full sm:w-64 relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">search</span>
              <input 
                type="text" 
                id="online-feed-search" 
                value="${this.onlineSearchQuery}" 
                placeholder="Search guest, code, passport..."
                class="w-full pl-9 pr-3.5 py-1.5 rounded-xl border border-outline-variant bg-surface-bright text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
            </div>

            <!-- View Toggle: List vs Cards -->
            <div class="flex items-center p-0.5 rounded-xl bg-surface-container border border-outline-variant shrink-0">
              <button 
                id="btn-toggle-view-list" 
                class="p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  this.onlineViewLayout === 'list'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-primary'
                }"
                title="List View (Verification Desk)"
              >
                <span class="material-symbols-outlined text-[18px]">table_rows</span>
                <span class="text-[11px] hidden sm:inline px-1">List View</span>
              </button>

              <button 
                id="btn-toggle-view-cards" 
                class="p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  this.onlineViewLayout === 'cards'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-primary'
                }"
                title="Cards View"
              >
                <span class="material-symbols-outlined text-[18px]">grid_view</span>
                <span class="text-[11px] hidden sm:inline px-1">Cards</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Main Mount: Checked-In Profiles View, List View or Cards View -->
        ${
          this.onlineFilterStatus === 'CHECKED_IN'
            ? this.renderCheckedInProfilesView(filtered)
            : filtered.length === 0
            ? `
              <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-12 text-center shadow-xs">
                <div class="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                  <span class="material-symbols-outlined text-[32px]">cloud_done</span>
                </div>
                <h4 class="text-base font-bold text-primary">No Matching Online Bookings</h4>
                <p class="text-xs text-on-surface-variant mt-1 max-w-md mx-auto">
                  Online bookings with pre-collected details arrive automatically without manual typing. Click below to simulate an incoming web booking with passport details right now.
                </p>
                <div class="mt-4 flex items-center justify-center gap-3">
                  <button 
                    id="btn-open-new-online-empty"
                    class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                  >
                    <span class="material-symbols-outlined text-[18px]">add_circle</span>
                    <span>+ Add Online Booking Details</span>
                  </button>

                  <button 
                    id="btn-quick-simulate-empty"
                    class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                  >
                    <span class="material-symbols-outlined text-[18px]">bolt</span>
                    <span>Quick Simulate</span>
                  </button>
                </div>
              </div>
            `
            : this.onlineViewLayout === 'list'
            ? this.renderOnlineVerificationTableView(filtered)
            : this.renderOnlineCardsView(filtered)
        }
      </div>
    `;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // A. DOCUMENT VERIFICATION LIST / TABLE VIEW (PRIMARY OPERATIONAL DESK)
  // ─────────────────────────────────────────────────────────────────────────
  renderOnlineVerificationTableView(reservations) {
    return `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead class="bg-surface-bright border-b border-outline-variant/60 font-bold uppercase font-label-caps text-[10px] text-on-surface-variant tracking-wider">
              <tr>
                <th class="py-3.5 px-4">Reservation Ref</th>
                <th class="py-3.5 px-4">Guest Info (Online Intake)</th>
                <th class="py-3.5 px-4">Stay & Room</th>
                <th class="py-3.5 px-4">Pre-Collected ID Document</th>
                <th class="py-3.5 px-4">Verification Status</th>
                <th class="py-3.5 px-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/40">
              ${reservations.map(res => {
                const confCode = res.confirmationCode || res.confirmationNumber || res.id;
                const isVerified = !!(res.identityVerified || res.idVerified);
                const isCheckedIn = res.status === 'Checked In';
                const onlDoc = res.onlineDocument;
                const roomType = res.roomType || 'Deluxe Ocean Suite';
                const totalAmt = Number(res.totalAmount || res.paidAmount || 0);

                return `
                  <tr class="hover:bg-surface-bright/70 transition-colors">
                    <!-- Ref & Channel -->
                    <td class="py-3.5 px-4 align-top">
                      <div class="font-bold font-data-mono text-primary text-xs">${confCode}</div>
                      <div class="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 mt-1 uppercase tracking-wider">
                        ${res.channel || 'Direct Web Engine'}
                      </div>
                      <div class="text-[10px] text-on-surface-variant mt-1 font-medium">
                        ${res.checkIn || res.checkInDate} → ${res.checkOut || res.checkOutDate} (${res.nights || 1}N)
                      </div>
                    </td>

                    <!-- Guest Profile (Online Intake) -->
                    <td class="py-3.5 px-4 align-top">
                      <div class="flex items-center gap-1.5 font-bold text-primary text-xs">
                        <span>${res.guestName}</span>
                        ${res.vip || res.vipTier ? `
                          <span class="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 border border-amber-500/30">★ VIP</span>
                        ` : ''}
                      </div>
                      <div class="text-[11px] text-on-surface-variant mt-0.5">${res.email || 'Email on file'}</div>
                      <div class="text-[11px] text-on-surface-variant">${res.phone || 'Phone on file'}</div>
                      <div class="text-[10px] text-on-surface-variant font-medium mt-0.5 flex items-center gap-1">
                        <span class="material-symbols-outlined text-[13px]">flag</span>
                        <span>${res.nationality || 'International'}</span>
                      </div>
                    </td>

                    <!-- Stay & Pre-Payment -->
                    <td class="py-3.5 px-4 align-top">
                      <div class="font-semibold text-on-surface text-xs">${roomType}</div>
                      <div class="text-[11px] text-on-surface-variant mt-0.5">${res.ratePlanName || res.ratePlan || 'Best Available Rate'}</div>
                      <div class="text-xs font-bold font-data-mono text-emerald-600 mt-1 flex items-center gap-1">
                        <span class="material-symbols-outlined text-[15px]">verified</span>
                        <span>PAID $${totalAmt.toLocaleString()}</span>
                      </div>
                    </td>

                    <!-- Pre-Collected Document -->
                    <td class="py-3.5 px-4 align-top">
                      ${onlDoc ? `
                        <div class="flex flex-col gap-0.5">
                          <div class="flex items-center gap-1.5 font-bold text-primary text-xs">
                            <span class="material-symbols-outlined text-[16px] text-primary">
                              ${onlDoc.documentType === 'DRIVERS_LICENSE' ? 'directions_car' : 'menu_book'}
                            </span>
                            <span>${onlDoc.documentType || 'PASSPORT'}: <strong>${onlDoc.documentNumber}</strong></span>
                          </div>
                          <div class="text-[11px] text-on-surface-variant">
                            Country: ${onlDoc.issuingCountry || res.nationality} · Exp: ${onlDoc.expiryDate || '2032'}
                          </div>
                          <div class="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 mt-1">
                            <span class="material-symbols-outlined text-[13px]">cloud_done</span>
                            <span>Pre-Collected Online</span>
                          </div>
                        </div>
                      ` : `
                        <div class="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg inline-block">
                          Awaiting Desk Physical Scan
                        </div>
                      `}
                    </td>

                    <!-- Verification Status -->
                    <td class="py-3.5 px-4 align-top">
                      ${isVerified ? `
                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span class="material-symbols-outlined text-[15px]">verified</span>
                          <span>✓ ID Verified</span>
                        </span>
                        <div class="text-[10px] text-on-surface-variant mt-1">
                          ${res.idVerification?.documentType || onlDoc?.documentType || 'PASSPORT'} verified
                        </div>
                      ` : `
                        <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <span class="material-symbols-outlined text-[15px]">pending</span>
                          <span>Pending Verification</span>
                        </span>
                        <div class="text-[10px] text-amber-700/80 mt-1 font-medium">
                          Click to verify pre-collected ID
                        </div>
                      `}
                    </td>

                    <!-- Action Column -->
                    <td class="py-3.5 px-4 align-top text-right">
                      <div class="inline-flex items-center justify-end gap-1.5 flex-wrap">
                        <!-- Option for Services (Right before check-in) -->
                        <button 
                          class="btn-manage-online-services px-2.5 py-1.5 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 text-xs font-bold text-primary inline-flex items-center gap-1 cursor-pointer transition-all"
                          data-res-id="${res.id}"
                          title="Review or Add Stay Services & Amenities before check-in"
                        >
                          <span class="material-symbols-outlined text-[15px]">room_service</span>
                          <span>Services (${(res.optionalServices || []).length})</span>
                        </button>

                        ${!isVerified ? `
                          <button 
                            class="btn-start-doc-verify px-3 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary/90 text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                            data-res-id="${res.id}"
                          >
                            <span class="material-symbols-outlined text-[15px]">verified_user</span>
                            <span>Verify ID</span>
                          </button>
                        ` : !isCheckedIn ? `
                          <button 
                            class="btn-start-doc-verify px-2.5 py-1.5 rounded-lg border border-outline-variant bg-surface-bright hover:bg-surface-container text-xs font-semibold text-on-surface inline-flex items-center gap-1 cursor-pointer transition-all"
                            data-res-id="${res.id}"
                            title="Inspect verified document details"
                          >
                            <span class="material-symbols-outlined text-[14px]">visibility</span>
                            <span>Review ID</span>
                          </button>
                          <button 
                            class="btn-process-online-arrival px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold inline-flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                            data-res-id="${res.id}"
                          >
                            <span>Check-In →</span>
                          </button>
                        ` : `
                          <button 
                            class="btn-view-inhouse-online px-3 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold inline-flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                            data-res-id="${res.id}"
                          >
                            <span class="material-symbols-outlined text-[15px]">hotel</span>
                            <span>Room ${res.roomNumber || res.assignedRoom}</span>
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
      </div>
    `;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // B. DOCUMENT VERIFICATION CARDS VIEW (ALTERNATIVE VISUAL LAYOUT)
  // ─────────────────────────────────────────────────────────────────────────
  renderOnlineCardsView(reservations) {
    return `
      <div class="grid grid-cols-1 gap-4">
        ${reservations.map(res => {
          const confCode = res.confirmationCode || res.confirmationNumber || res.id;
          const isVerified = !!(res.identityVerified || res.idVerified);
          const isCheckedIn = res.status === 'Checked In';
          const onlDoc = res.onlineDocument;
          const roomType = res.roomType || 'Deluxe Ocean Suite';
          const totalAmt = Number(res.totalAmount || res.paidAmount || 0);

          return `
            <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 sm:p-6 shadow-xs hover:border-primary/40 transition-all flex flex-col gap-4">
              <!-- Card Header -->
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-outline-variant/60 pb-3.5">
                <div class="flex flex-wrap items-center gap-2.5">
                  <span class="px-2.5 py-1 rounded-lg text-xs font-bold font-data-mono bg-primary/10 text-primary border border-primary/20">
                    ${confCode}
                  </span>
                  <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-700 border border-blue-500/20">
                    ${res.channel || 'Direct Web Engine'}
                  </span>
                  ${res.vip || res.vipTier ? `
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 border border-amber-500/30 flex items-center gap-1">
                      <span class="material-symbols-outlined text-[13px]">star</span>
                      <span>${res.vipTier || 'VIP'}</span>
                    </span>
                  ` : ''}
                </div>

                <div class="flex items-center gap-2">
                  <span class="px-2.5 py-1 rounded-full text-xs font-bold ${
                    isVerified
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }">
                    ${isVerified ? '✓ ID Verified' : 'Pending ID Verification'}
                  </span>
                </div>
              </div>

              <!-- Card Body: Grid of Details -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                <!-- Guest Info -->
                <div class="flex flex-col gap-1.5">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps">Guest Profile (Online Intake)</span>
                  <div class="text-sm font-bold text-primary flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[18px] text-on-surface-variant">person</span>
                    <span>${res.guestName}</span>
                  </div>
                  <div class="text-xs text-on-surface-variant flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[15px]">mail</span>
                    <span>${res.email || 'Email provided online'}</span>
                  </div>
                  <div class="text-xs text-on-surface-variant flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[15px]">call</span>
                    <span>${res.phone || 'Phone on file'}</span>
                  </div>
                  <div class="text-xs text-on-surface-variant flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[15px]">flag</span>
                    <span>${res.nationality || 'International'}</span>
                  </div>
                </div>

                <!-- Stay Details -->
                <div class="flex flex-col gap-1.5">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps">Stay Details</span>
                  <div class="text-xs font-bold text-on-surface flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[16px] text-primary">hotel</span>
                    <span>${roomType}</span>
                  </div>
                  <div class="text-xs text-on-surface-variant flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[15px]">date_range</span>
                    <span>${res.checkIn || res.checkInDate} → ${res.checkOut || res.checkOutDate}</span>
                    <span class="font-bold text-primary">(${res.nights || 1}N)</span>
                  </div>
                  <div class="text-xs text-on-surface-variant flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[15px]">sell</span>
                    <span>${res.ratePlanName || res.ratePlan || 'Best Available Rate'}</span>
                  </div>
                  <div class="text-sm font-bold font-data-mono text-emerald-600 flex items-center gap-1.5 mt-0.5">
                    <span class="material-symbols-outlined text-[18px]">verified</span>
                    <span>PAID $${totalAmt.toLocaleString()}</span>
                  </div>
                </div>

                <!-- Pre-Collected Document Details -->
                <div class="flex flex-col gap-1.5">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps">Online Pre-Collected Document</span>
                  ${onlDoc ? `
                    <div class="p-3 rounded-xl bg-surface-bright border border-outline-variant/60 flex flex-col gap-1">
                      <div class="font-bold text-primary text-xs flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[16px] text-primary">badge</span>
                        <span>${onlDoc.documentType}: ${onlDoc.documentNumber}</span>
                      </div>
                      <div class="text-[11px] text-on-surface-variant">
                        Issuing: ${onlDoc.issuingCountry} · Exp: ${onlDoc.expiryDate}
                      </div>
                      <div class="text-[10px] font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                        <span class="material-symbols-outlined text-[13px]">cloud_done</span>
                        <span>Pre-Submitted via Web Check-In</span>
                      </div>
                    </div>
                  ` : `
                    <div class="p-3 rounded-xl bg-surface-bright border border-outline-variant/60 text-xs text-on-surface-variant">
                      Physical ID scan required at front desk.
                    </div>
                  `}
                </div>
              </div>

              <!-- Card Action Footer -->
              <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant/60">
                <span class="text-[11px] text-on-surface-variant font-medium">
                  Verification: <strong class="${isVerified ? 'text-emerald-700' : 'text-amber-700'}">${isVerified ? 'ID Verified & Reconciled' : 'Pending Verification'}</strong>
                </span>

                <div class="flex items-center gap-2 flex-wrap">
                  <button 
                    class="btn-manage-online-services px-3.5 py-2 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 text-xs font-bold text-primary flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    data-res-id="${res.id}"
                    title="Review or Add Stay Services & Amenities before check-in"
                  >
                    <span class="material-symbols-outlined text-[16px]">room_service</span>
                    <span>Services (${(res.optionalServices || []).length})</span>
                  </button>

                  <button 
                    class="btn-start-doc-verify px-4 py-2 rounded-xl ${
                      !isVerified ? 'bg-primary text-on-primary hover:bg-primary/90' : 'bg-surface-bright border border-outline-variant text-on-surface hover:bg-surface-container'
                    } text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    data-res-id="${res.id}"
                  >
                    <span class="material-symbols-outlined text-[16px]">${!isVerified ? 'verified_user' : 'visibility'}</span>
                    <span>${!isVerified ? 'Verify Document' : 'Review ID Document'}</span>
                  </button>

                  ${!isCheckedIn ? `
                    <button 
                      class="btn-process-online-arrival px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      data-res-id="${res.id}"
                    >
                      <span>Check-In →</span>
                      <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  ` : `
                    <button 
                      class="btn-view-inhouse-online px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      data-res-id="${res.id}"
                    >
                      <span class="material-symbols-outlined text-[16px]">hotel</span>
                      <span>View In-House</span>
                    </button>
                  `}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // C. CHECKED-IN GUEST PROFILES LIST (GUESTS ALREADY CHECKED IN / IN-HOUSE)
  // ─────────────────────────────────────────────────────────────────────────
  renderCheckedInProfilesView(reservations) {
    if (!reservations || reservations.length === 0) {
      return `
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-12 text-center shadow-xs animate-fadeIn">
          <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
            <span class="material-symbols-outlined text-[32px]">hotel</span>
          </div>
          <h4 class="text-base font-bold text-primary">No Guests Checked In Yet</h4>
          <p class="text-xs text-on-surface-variant mt-1 max-w-md mx-auto">
            Once guest check-in and key issuance are completed, their active in-house stay profiles and room folios will appear here immediately.
          </p>
          <button 
            id="btn-return-to-all-online"
            class="mt-4 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-sm transition-all"
          >
            <span class="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>View All Arrivals / Verification Desk</span>
          </button>
        </div>
      `;
    }

    return `
      <div class="space-y-4 animate-fadeIn">
        <!-- Checked-in Profiles Banner -->
        <div class="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[28px]">hotel</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-bold font-headline-sm text-primary">Checked-In Guest Profiles (Active In-House)</h3>
                <span class="text-[10px] font-bold font-data-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                  ● ${reservations.length} Active Stays
                </span>
              </div>
              <p class="text-xs text-on-surface-variant mt-0.5">
                Complete guest profiles and live stay details for guests who have finished document verification and room key issuance.
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button id="btn-back-to-pending-verify" class="px-3.5 py-2 rounded-xl border border-outline-variant hover:bg-surface-bright text-xs font-semibold text-on-surface flex items-center gap-1.5 transition-all cursor-pointer">
              <span class="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back to Verification Desk</span>
            </button>
          </div>
        </div>

        <!-- Profiles Grid -->
        <div class="grid grid-cols-1 gap-4">
          ${reservations.map(res => {
            const isNewlyCheckedIn = this.newlyCheckedInResId === res.id;
            const guest = (store.state.guests || []).find(g => g.id === res.guestId || g.name?.toLowerCase() === res.guestName?.toLowerCase());
            const roomNum = res.assignedRoom || res.roomNumber || '402';
            const initials = (res.guestName || 'G').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            const vipTier = res.vipTier || guest?.vipTier || (res.vip ? 'VIP' : 'Standard');
            const confCode = res.confirmationCode || res.confirmationNumber || res.id;
            const doc = res.idVerification || res.onlineDocument;
            const totalAmt = Number(res.paidAmount || res.totalAmount || 0);

            return `
              <div class="bg-surface-container-lowest border ${
                isNewlyCheckedIn ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md' : 'border-outline-variant'
              } rounded-2xl p-5 sm:p-6 shadow-xs hover:border-primary/50 transition-all flex flex-col gap-4">
                
                <!-- Profile Card Header -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-outline-variant/60 pb-3.5">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-2xl bg-primary text-on-primary font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                      ${initials}
                    </div>
                    <div>
                      <div class="flex items-center gap-2 flex-wrap">
                        <h4 class="text-base font-bold text-primary">${res.guestName}</h4>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          vipTier === 'Royal Diamond' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                          vipTier === 'Platinum' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                          vipTier === 'Gold' || vipTier === 'VIP' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-surface-container text-on-surface-variant'
                        }">
                          ★ ${vipTier}
                        </span>
                        ${isNewlyCheckedIn ? `
                          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 animate-pulse">
                            <span class="material-symbols-outlined text-[12px]">check_circle</span>
                            <span>Just Checked In Now</span>
                          </span>
                        ` : ''}
                      </div>
                      <div class="flex items-center gap-2 text-xs text-on-surface-variant mt-0.5">
                        <span class="font-data-mono font-bold">${confCode}</span>
                        <span>•</span>
                        <span>${res.nationality || guest?.nationality || 'International'}</span>
                        <span>•</span>
                        <span>${res.channel || 'Direct Web Engine'}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Room & Access Status Badge -->
                  <div class="flex items-center gap-2 shrink-0">
                    <div class="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-right">
                      <span class="text-[10px] uppercase font-bold text-emerald-800 block">Assigned Room</span>
                      <strong class="text-sm font-bold font-data-mono text-emerald-900">Room #${roomNum}</strong>
                    </div>
                    <div class="px-3.5 py-1.5 rounded-xl bg-surface-bright border border-outline-variant/60 text-right">
                      <span class="text-[10px] uppercase font-bold text-on-surface-variant block">RFID Keycard</span>
                      <strong class="text-xs font-bold font-data-mono text-primary">${res.keyCardNumber || 'KC-' + roomNum + '-A'}</strong>
                    </div>
                  </div>
                </div>

                <!-- Profile Body: 3 Columns -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                  <!-- Contact & Stay Info -->
                  <div class="space-y-1.5">
                    <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider font-label-caps block">Stay & Contacts</span>
                    <div class="flex items-center gap-2 text-on-surface-variant">
                      <span class="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
                      <span>${res.checkIn || res.checkInDate} → ${res.checkOut || res.checkOutDate} (<strong>${res.nights || 1} Nights</strong>)</span>
                    </div>
                    <div class="flex items-center gap-2 text-on-surface-variant">
                      <span class="material-symbols-outlined text-[16px] text-primary">mail</span>
                      <span>${res.email || guest?.email || 'N/A'}</span>
                    </div>
                    <div class="flex items-center gap-2 text-on-surface-variant">
                      <span class="material-symbols-outlined text-[16px] text-primary">call</span>
                      <span>${res.phone || guest?.phone || 'N/A'}</span>
                    </div>
                    <div class="flex items-center gap-2 text-on-surface-variant">
                      <span class="material-symbols-outlined text-[16px] text-primary">hotel</span>
                      <span>${res.roomType || 'Deluxe Suite'}</span>
                    </div>
                  </div>

                  <!-- Verified Identification & Address -->
                  <div class="space-y-1.5">
                    <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider font-label-caps block">Verified Identification</span>
                    ${doc ? `
                      <div class="p-2.5 rounded-xl bg-surface-bright border border-outline-variant/60 space-y-1">
                        <div class="flex items-center justify-between font-bold text-primary">
                          <span>${doc.documentType || 'PASSPORT'}: ${doc.documentNumber || 'VERIFIED'}</span>
                          <span class="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-bold">✓ Verified</span>
                        </div>
                        <div class="text-[11px] text-on-surface-variant">
                          Issuing: ${doc.issuingCountry || res.nationality || 'N/A'} · Exp: ${doc.expiryDate || 'Valid'}
                        </div>
                        ${doc.extractedAddress ? `
                          <div class="text-[10px] text-on-surface-variant/80 truncate" title="${doc.extractedAddress}">
                            📍 ${doc.extractedAddress}
                          </div>
                        ` : ''}
                      </div>
                    ` : `
                      <div class="p-2.5 rounded-xl bg-surface-bright text-on-surface-variant text-[11px]">
                        Identification record reconciled during check-in.
                      </div>
                    `}
                  </div>

                  <!-- Billing, Folio & Stay Services -->
                  <div class="space-y-1.5">
                    <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider font-label-caps block">Folio & Stay Services</span>
                    <div class="flex items-center justify-between p-2 rounded-lg bg-surface-bright border border-outline-variant/60">
                      <span class="text-on-surface-variant">Stay Payment:</span>
                      <strong class="text-emerald-700 font-data-mono font-bold">✓ PAID $${totalAmt}</strong>
                    </div>
                    ${(res.optionalServices || []).length > 0 ? `
                      <div class="space-y-1 pt-1">
                        <span class="text-[10px] font-bold text-on-surface-variant uppercase">Included Services (${res.optionalServices.length}):</span>
                        <div class="flex flex-wrap gap-1">
                          ${res.optionalServices.map(s => `
                            <span class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                              ${s.name} (+$${s.price})
                            </span>
                          `).join('')}
                        </div>
                      </div>
                    ` : `
                      <div class="text-[11px] text-on-surface-variant">
                        No extra services requested.
                      </div>
                    `}
                  </div>
                </div>

                <!-- Footer Operational Actions -->
                <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant/60">
                  <span class="text-[11px] text-on-surface-variant font-medium">
                    Operational State: <strong class="text-emerald-700 font-semibold">In-House Guest (RFID Card Active)</strong>
                  </span>

                  <div class="flex items-center gap-2 flex-wrap">
                    <button 
                      class="btn-manage-online-services px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 text-xs font-bold text-primary inline-flex items-center gap-1 cursor-pointer transition-all"
                      data-res-id="${res.id}"
                      title="Add or review stay services and amenities"
                    >
                      <span class="material-symbols-outlined text-[15px]">room_service</span>
                      <span>Services (${(res.optionalServices || []).length})</span>
                    </button>

                    <button 
                      class="btn-checkedin-open-folio px-3 py-1.5 rounded-xl border border-outline-variant bg-surface-bright hover:bg-surface-container text-xs font-semibold text-on-surface inline-flex items-center gap-1 cursor-pointer transition-all"
                      data-room="${roomNum}"
                    >
                      <span class="material-symbols-outlined text-[15px]">receipt_long</span>
                      <span>Folio Ledger</span>
                    </button>

                    <button 
                      class="btn-checkedin-view-crm px-3 py-1.5 rounded-xl bg-primary text-on-primary hover:bg-primary/90 text-xs font-bold inline-flex items-center gap-1 shadow-xs cursor-pointer transition-all"
                      data-guest-id="${res.guestId || ''}"
                    >
                      <span class="material-symbols-outlined text-[15px]">account_circle</span>
                      <span>360° Profile</span>
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

  // ═══════════════════════════════════════════════════════════════════════════
  // GUEST DIRECT BOOKING SIMULATOR (Inspectable 6-Step Consumer Journey)
  // ═══════════════════════════════════════════════════════════════════════════
  renderOnlineWorkflow() {
    const s = this.onlineStep;
    const d = this.onlineData;

    return `
      <div class="flex flex-col gap-6 animate-fadeIn">
        <!-- Simulator Notice & Quick Auto-Complete Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[20px]">laptop_mac</span>
            </div>
            <div>
              <h4 class="text-xs font-bold text-primary">Guest Direct Booking Engine Simulator</h4>
              <p class="text-[11px] text-on-surface-variant">Simulates the customer-facing online website. You can step through or auto-complete with 1-click.</p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button 
              id="btn-auto-complete-online-sim" 
              class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
            >
              <span class="material-symbols-outlined text-[16px]">bolt</span>
              <span>⚡ 1-Click Auto-Complete & Confirm</span>
            </button>

            <button 
              id="btn-back-to-online-feed" 
              class="px-3.5 py-2 rounded-xl border border-outline-variant bg-surface-bright text-xs font-semibold text-on-surface hover:bg-surface-container flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span class="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back to Incoming Feed</span>
            </button>
          </div>
        </div>

        <!-- Progress Stepper -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 sm:p-5 shadow-xs">
          <div class="flex items-center justify-between max-w-4xl mx-auto relative">
            <div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface-container-high z-0"></div>
            <div class="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0 transition-all duration-300" style="width: ${((s - 1) / 5) * 100}%;"></div>

            ${[
              { step: 1, label: 'Guest & Dates', icon: 'person' },
              { step: 2, label: 'Select Room & Rate', icon: 'hotel' },
              { step: 3, label: 'Optional Services', icon: 'room_service' },
              { step: 4, label: 'Review Booking', icon: 'fact_check' },
              { step: 5, label: 'Payment', icon: 'payment' },
              { step: 6, label: 'Confirmed', icon: 'verified' }
            ].map(item => `
              <div class="flex flex-col items-center relative z-10">
                <div class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  s === item.step
                    ? 'bg-primary text-on-primary ring-4 ring-primary/20 shadow-sm'
                    : s > item.step
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-surface-bright text-on-surface-variant border border-outline-variant'
                }">
                  ${s > item.step ? '<span class="material-symbols-outlined text-[18px]">check</span>' : item.step}
                </div>
                <span class="text-[11px] mt-1.5 font-semibold hidden sm:block ${s === item.step ? 'text-primary font-bold' : 'text-on-surface-variant'}">
                  ${item.label}
                </span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Stepper Views -->
        ${
          s === 1 ? this.renderOnlineStep1() :
          s === 2 ? this.renderOnlineStep2() :
          s === 3 ? this.renderOnlineStep3() :
          s === 4 ? this.renderOnlineStep4() :
          s === 5 ? this.renderOnlineStep5() :
          this.renderOnlineStep6()
        }
      </div>
    `;
  }

  renderOnlineStep1() {
    const d = this.onlineData;
    return `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-xs max-w-4xl mx-auto w-full">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-outline-variant/60">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span class="material-symbols-outlined text-[22px]">edit_calendar</span>
            </div>
            <div>
              <h3 class="font-headline-sm text-base font-bold text-primary">Guest Details & Stay Requirements</h3>
              <p class="text-xs text-on-surface-variant">Step 1 of 6 — Online Direct Booking Engine</p>
            </div>
          </div>
          <div class="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <button 
              type="button" 
              id="btn-onl-extract-doc" 
              class="px-3.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
            >
              <span class="material-symbols-outlined text-[16px]">document_scanner</span>
              <span>⚡ Extract Document (OCR)</span>
            </button>
            <button 
              type="button" 
              id="btn-onl-quick-autofill" 
              class="px-3.5 py-1.5 rounded-lg border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span class="material-symbols-outlined text-[16px]">magic_button</span>
              <span>⚡ Auto-Fill Profile</span>
            </button>
          </div>
        </div>

        <form id="form-online-step1" class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label class="block text-xs font-bold text-on-surface uppercase font-label-caps mb-1.5">First Name *</label>
            <input type="text" id="onl-first-name" required value="${d.firstName || 'Sarah'}" placeholder="e.g. Sarah" class="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-bright text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
          </div>

          <div>
            <label class="block text-xs font-bold text-on-surface uppercase font-label-caps mb-1.5">Last Name *</label>
            <input type="text" id="onl-last-name" required value="${d.lastName || 'Mitchell'}" placeholder="e.g. Mitchell" class="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-bright text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
          </div>

          <div>
            <label class="block text-xs font-bold text-on-surface uppercase font-label-caps mb-1.5">Email Address *</label>
            <input type="email" id="onl-email" required value="${d.email || 's.mitchell@vanguard.com'}" placeholder="guest@example.com" class="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-bright text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
          </div>

          <div>
            <label class="block text-xs font-bold text-on-surface uppercase font-label-caps mb-1.5">Phone Number *</label>
            <input type="tel" id="onl-phone" required value="${d.phone || '+1 (555) 382-9901'}" placeholder="+1 (555) 000-0000" class="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-bright text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
          </div>

          <div>
            <label class="block text-xs font-bold text-on-surface uppercase font-label-caps mb-1.5">Check-In Date *</label>
            <input type="date" id="onl-checkin" required value="${d.checkInDate}" class="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-bright text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
          </div>

          <div>
            <label class="block text-xs font-bold text-on-surface uppercase font-label-caps mb-1.5">Check-Out Date *</label>
            <input type="date" id="onl-checkout" required value="${d.checkOutDate}" class="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-bright text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-on-surface uppercase font-label-caps mb-1.5">Adults *</label>
              <select id="onl-adults" class="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-bright text-xs font-semibold">
                <option value="1" ${d.adults === 1 ? 'selected' : ''}>1 Adult</option>
                <option value="2" ${d.adults === 2 ? 'selected' : ''}>2 Adults</option>
                <option value="3" ${d.adults === 3 ? 'selected' : ''}>3 Adults</option>
                <option value="4" ${d.adults === 4 ? 'selected' : ''}>4 Adults</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-on-surface uppercase font-label-caps mb-1.5">Children</label>
              <select id="onl-children" class="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-bright text-xs font-semibold">
                <option value="0" ${d.children === 0 ? 'selected' : ''}>0 Children</option>
                <option value="1" ${d.children === 1 ? 'selected' : ''}>1 Child</option>
                <option value="2" ${d.children === 2 ? 'selected' : ''}>2 Children</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-on-surface uppercase font-label-caps mb-1.5">Nationality</label>
            <input type="text" id="onl-nationality" value="${d.nationality}" class="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-bright text-xs font-semibold">
          </div>

          <div class="sm:col-span-2">
            <label class="block text-xs font-bold text-on-surface uppercase font-label-caps mb-1.5">Special Requests (Optional)</label>
            <textarea id="onl-requests" rows="2" placeholder="e.g. High floor, quiet courtyard view, feather pillows" class="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-bright text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">${d.specialRequests || ''}</textarea>
          </div>

          <div class="sm:col-span-2 pt-4 border-t border-outline-variant/60 flex items-center justify-between">
            <div class="text-xs text-on-surface-variant font-medium">
              Calculated Stay: <strong class="text-primary font-bold" id="onl-nights-calc">${d.nights} Nights</strong>
            </div>
            <button type="submit" class="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary/90 flex items-center gap-2 transition-all cursor-pointer">
              <span>Check Room Availability</span>
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </form>
      </div>
    `;
  }

  renderOnlineStep2() {
    const d = this.onlineData;
    const roomTypes = store.state.roomTypes || [];

    const packages = [
      { id: 'BAR_FLEX', name: 'Best Available Flexible Rate', multiplier: 1.0, desc: 'Free cancellation up to 24 hours prior to check-in.' },
      { id: 'BAR_BFAST', name: 'Artisan Breakfast Package', multiplier: 1.15, desc: 'Includes gourmet daily champagne breakfast buffet.' },
      { id: 'BAR_NONREF', name: 'Pre-pay & Save (Non-refundable)', multiplier: 0.85, desc: 'Instant 15% discount; non-amendable pre-paid rate.' }
    ];

    return `
      <div class="flex flex-col gap-6 max-w-5xl mx-auto w-full">
        <!-- Room Type Selection -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-xs">
          <div class="flex items-center justify-between mb-5">
            <div>
              <h3 class="font-headline-sm text-base font-bold text-primary">Available Room Types</h3>
              <p class="text-xs text-on-surface-variant">Selected Stay: ${d.checkInDate} → ${d.checkOutDate} (${d.nights} Nights, ${d.adults} Adults)</p>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              ✓ Available for Selected Dates
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${roomTypes.map(rt => {
              const isSelected = d.roomTypeId === rt.id;
              return `
                <div class="room-type-card border rounded-xl p-5 transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs' 
                    : 'border-outline-variant bg-surface-bright hover:border-primary/50'
                }" data-room-type-id="${rt.id}" data-room-type-name="${rt.name}" data-base-price="${rt.basePrice}">
                  <div class="flex items-start justify-between">
                    <div>
                      <span class="text-[10px] font-bold font-data-mono uppercase text-secondary tracking-wider">${rt.code}</span>
                      <h4 class="font-headline-sm text-sm font-bold text-primary mt-0.5">${rt.name}</h4>
                      <p class="text-xs text-on-surface-variant mt-1">Capacity: Up to ${rt.maxOccupancy} Guests · ${rt.sizeSqM} m²</p>
                    </div>
                    <div class="text-right">
                      <span class="text-xs text-on-surface-variant block">From</span>
                      <span class="text-lg font-bold font-headline-sm text-primary">$${rt.basePrice}</span>
                      <span class="text-[10px] text-on-surface-variant block">/ night</span>
                    </div>
                  </div>

                  <div class="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between">
                    <span class="text-[11px] text-on-surface-variant flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-[15px] text-emerald-600">check_circle</span>
                      Instant Booking Confirmed
                    </span>
                    <span class="text-xs font-bold ${isSelected ? 'text-primary' : 'text-on-surface-variant'}">
                      ${isSelected ? '✓ Selected' : 'Select Room'}
                    </span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Rate Plan / Package Selection -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-xs">
          <h3 class="font-headline-sm text-base font-bold text-primary mb-1">Select Rate Plan & Package</h3>
          <p class="text-xs text-on-surface-variant mb-5">Choose pricing guarantee and cancellation policy</p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${packages.map(pkg => {
              const base = (store.state.roomTypes || []).find(r => r.id === d.roomTypeId)?.basePrice || 480;
              const pkgPrice = Math.round(base * pkg.multiplier);
              const isSelected = d.ratePlanId === pkg.id;
              return `
                <div class="rate-plan-card border rounded-xl p-4 transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs' 
                    : 'border-outline-variant bg-surface-bright hover:border-primary/50'
                }" data-plan-id="${pkg.id}" data-plan-name="${pkg.name}" data-multiplier="${pkg.multiplier}">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-primary">${pkg.name}</span>
                    <span class="text-xs font-bold ${isSelected ? 'text-primary' : 'text-on-surface-variant'}">
                      ${isSelected ? '●' : '○'}
                    </span>
                  </div>
                  <p class="text-[11px] text-on-surface-variant mb-3 leading-relaxed">${pkg.desc}</p>
                  <div class="text-sm font-bold text-primary">$${pkgPrice} <span class="text-[10px] font-normal text-on-surface-variant">/ night</span></div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between pt-2">
          <button id="btn-onl-step2-back" class="px-5 py-2.5 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container transition-all cursor-pointer">
            ← Back to Guest Details
          </button>
          <button id="btn-onl-step2-next" class="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary/90 flex items-center gap-2 transition-all cursor-pointer">
            <span>Continue to Optional Services</span>
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    `;
  }

  renderOnlineStep3() {
    const d = this.onlineData;
    const availableServices = [
      { id: 'srv-laundry', name: 'Executive Laundry Service', category: 'Laundry', price: 65, desc: 'Express dry cleaning & pressing for up to 3 garments.' },
      { id: 'srv-breakfast', name: 'Artisan Champagne Breakfast', category: 'F&B', price: 45, desc: 'Daily gourmet breakfast buffet delivered to your room.' },
      { id: 'srv-airport-in', name: 'Airport Luxury Chauffeur Pickup', category: 'Transport', price: 90, desc: 'Private Mercedes S-Class transfer from International Airport.' },
      { id: 'srv-airport-out', name: 'Airport Drop-off Transfer', category: 'Transport', price: 90, desc: 'Complimentary terminal baggage assistance and direct drop.' },
      { id: 'srv-extra-bed', name: 'Plush Rollaway Extra Bed', category: 'Amenities', price: 50, desc: '600TC Egyptian Cotton bedding setup.' },
      { id: 'srv-baby-cot', name: 'Hypoallergenic Baby Cot', category: 'Amenities', price: 0, desc: 'Complimentary baby cot and nursery essentials.' },
    ];

    return `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-xs max-w-4xl mx-auto w-full">
        <div class="flex items-center justify-between pb-4 mb-5 border-b border-outline-variant/60">
          <div>
            <h3 class="font-headline-sm text-base font-bold text-primary">Optional Services & Amenities</h3>
            <p class="text-xs text-on-surface-variant mt-0.5">
              Services are <strong>OPTIONAL</strong>. The guest does not have to select services to complete an online booking.
            </p>
          </div>
          <span class="text-xs text-secondary font-bold font-data-mono uppercase">Add-ons</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          ${availableServices.map(srv => {
            const isChecked = (d.optionalServices || []).some(s => s.id === srv.id);
            return `
              <label class="border rounded-xl p-4 flex items-start gap-3 transition-all cursor-pointer ${
                isChecked ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-outline-variant hover:bg-surface-bright'
              }">
                <input type="checkbox" class="onl-srv-check mt-1 w-4 h-4 rounded text-primary focus:ring-primary" data-srv-id="${srv.id}" data-srv-name="${srv.name}" data-srv-category="${srv.category}" data-srv-price="${srv.price}" ${isChecked ? 'checked' : ''}>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-primary">${srv.name}</span>
                    <span class="text-xs font-bold text-primary font-data-mono">${srv.price > 0 ? '$' + srv.price : 'FREE'}</span>
                  </div>
                  <p class="text-[11px] text-on-surface-variant mt-1">${srv.desc}</p>
                </div>
              </label>
            `;
          }).join('')}
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-outline-variant/60">
          <button id="btn-onl-step3-back" class="px-5 py-2.5 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container transition-all cursor-pointer">
            ← Back to Rooms & Rates
          </button>
          <button id="btn-onl-step3-next" class="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary/90 flex items-center gap-2 transition-all cursor-pointer">
            <span>Review Booking</span>
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    `;
  }

  renderOnlineStep4() {
    const d = this.onlineData;
    const roomSubtotal = d.ratePerNight * d.nights;
    const srvTotal = (d.optionalServices || []).reduce((acc, s) => acc + (s.price || 0), 0);
    const taxes = Math.round((roomSubtotal + srvTotal) * 0.1);
    const grandTotal = roomSubtotal + srvTotal + taxes;
    d.totalAmount = grandTotal;

    return `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-xs max-w-3xl mx-auto w-full">
        <div class="flex items-center justify-between pb-4 mb-6 border-b border-outline-variant/60">
          <div>
            <h3 class="font-headline-sm text-base font-bold text-primary">Review Booking Details</h3>
            <p class="text-xs text-on-surface-variant">Step 4 of 6 — Review before making payment</p>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            Online Booking Direct
          </span>
        </div>

        <div class="space-y-4 text-xs mb-6">
          <div class="bg-surface-bright rounded-xl p-4 border border-outline-variant/60 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span class="text-[10px] text-on-surface-variant font-bold uppercase block">Guest Name</span>
              <span class="font-bold text-primary mt-0.5 block">${d.guestName || d.firstName + ' ' + d.lastName}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant font-bold uppercase block">Dates</span>
              <span class="font-bold text-primary mt-0.5 block">${d.checkInDate} → ${d.checkOutDate}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant font-bold uppercase block">Duration</span>
              <span class="font-bold text-primary mt-0.5 block">${d.nights} Nights (${d.adults} Guests)</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant font-bold uppercase block">Contact</span>
              <span class="font-bold text-primary mt-0.5 block truncate">${d.phone}</span>
            </div>
          </div>

          <div class="bg-surface-bright rounded-xl p-4 border border-outline-variant/60">
            <div class="flex items-center justify-between font-bold text-primary mb-1">
              <span>${d.roomTypeName}</span>
              <span>$${roomSubtotal}</span>
            </div>
            <p class="text-[11px] text-on-surface-variant">${d.ratePlanName} ($${d.ratePerNight} / night × ${d.nights} nights)</p>
          </div>

          ${(d.optionalServices && d.optionalServices.length > 0) ? `
            <div class="bg-surface-bright rounded-xl p-4 border border-outline-variant/60">
              <span class="text-[10px] font-bold uppercase text-on-surface-variant block mb-2">Selected Optional Services</span>
              <div class="space-y-1.5">
                ${d.optionalServices.map(s => `
                  <div class="flex items-center justify-between text-[11px]">
                    <span class="text-on-surface">${s.name} (${s.category})</span>
                    <span class="font-bold font-data-mono text-primary">$${s.price}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : `
            <div class="p-3 rounded-lg bg-surface-container text-[11px] text-on-surface-variant">
              No optional services added (services can also be requested at Front Desk anytime).
            </div>
          `}

          <!-- Price Summary Breakdown -->
          <div class="border-t border-outline-variant/60 pt-4 space-y-2">
            <div class="flex justify-between text-on-surface-variant">
              <span>Room Tariff Subtotal</span>
              <span>$${roomSubtotal}</span>
            </div>
            <div class="flex justify-between text-on-surface-variant">
              <span>Services & Amenities</span>
              <span>$${srvTotal}</span>
            </div>
            <div class="flex justify-between text-on-surface-variant">
              <span>Estimated Taxes & Municipal Surcharges (10%)</span>
              <span>$${taxes}</span>
            </div>
            <div class="flex justify-between text-base font-bold text-primary pt-2 border-t border-outline-variant/60">
              <span>Total Amount</span>
              <span>$${grandTotal}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-outline-variant/60">
          <button id="btn-onl-step4-back" class="px-5 py-2.5 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container transition-all cursor-pointer">
            ← Edit Services
          </button>
          <button id="btn-onl-step4-next" class="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary/90 flex items-center gap-2 transition-all cursor-pointer">
            <span>Proceed to Secure Payment</span>
            <span class="material-symbols-outlined text-[18px]">lock</span>
          </button>
        </div>
      </div>
    `;
  }

  renderOnlineStep5() {
    const d = this.onlineData;
    return `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-xs max-w-2xl mx-auto w-full">
        <div class="flex items-center gap-3 pb-4 mb-6 border-b border-outline-variant/60">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <span class="material-symbols-outlined text-[22px]">lock</span>
          </div>
          <div>
            <h3 class="font-headline-sm text-base font-bold text-primary">Secure Online Payment Gateway</h3>
            <p class="text-xs text-on-surface-variant">256-Bit SSL Encrypted Hotel Pre-Payment</p>
          </div>
        </div>

        <div class="bg-surface-bright rounded-xl p-4 border border-outline-variant/60 mb-6 flex items-center justify-between">
          <div>
            <span class="text-xs text-on-surface-variant block">Total Payment Due</span>
            <span class="text-xl font-bold font-headline-sm text-primary">$${d.totalAmount}</span>
          </div>
          <span class="px-3 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
            Instant Confirmation
          </span>
        </div>

        <form id="form-online-payment" class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-on-surface uppercase font-label-caps mb-1.5">Cardholder Full Name</label>
            <input type="text" id="onl-card-name" required value="${d.guestName || d.firstName + ' ' + d.lastName}" class="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-bright font-semibold">
          </div>

          <div>
            <label class="block font-bold text-on-surface uppercase font-label-caps mb-1.5">Card Number</label>
            <div class="relative">
              <input type="text" id="onl-card-number" required value="4242 •••• •••• 4242" class="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-bright font-semibold font-data-mono pl-10">
              <span class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">credit_card</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-on-surface uppercase font-label-caps mb-1.5">Expiry Date</label>
              <input type="text" id="onl-card-expiry" required value="08/29" placeholder="MM/YY" class="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-bright font-semibold font-data-mono">
            </div>
            <div>
              <label class="block font-bold text-on-surface uppercase font-label-caps mb-1.5">Security Code (CVV)</label>
              <input type="password" id="onl-card-cvv" required value="888" maxlength="4" class="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-bright font-semibold font-data-mono">
            </div>
          </div>

          <!-- Simulation toggle: Success vs Fail -->
          <div class="p-3.5 rounded-xl bg-surface-container border border-outline-variant/60 flex items-center justify-between">
            <div class="text-[11px] text-on-surface-variant">
              <strong>Simulate Payment Gateway:</strong>
              <p class="text-[10px] text-on-surface-variant/80">Toggle to test the payment success or failure handling workflow</p>
            </div>
            <select id="onl-payment-sim-result" class="text-xs font-bold px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-bright">
              <option value="SUCCESS">Payment Succeeds (200 OK)</option>
              <option value="FAIL">Payment Fails (Insufficient Funds / Decline)</option>
            </select>
          </div>

          <div id="onl-payment-error-alert" class="hidden p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-rose-600">error</span>
              <strong id="onl-payment-error-msg">Payment Failed: Card issuer declined transaction. Please retry or resolve.</strong>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-outline-variant/60">
            <button type="button" id="btn-onl-step5-back" class="px-5 py-2.5 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container transition-all cursor-pointer">
              ← Back to Review
            </button>
            <button type="submit" id="btn-onl-submit-pay" class="px-7 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm hover:bg-emerald-700 flex items-center gap-2 transition-all cursor-pointer">
              <span class="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Authorize & Pay $${d.totalAmount}</span>
            </button>
          </div>
        </form>
      </div>
    `;
  }

  renderOnlineStep6() {
    const res = this.onlineConfirmedRes;
    if (!res) return `<div class="p-8 text-center text-xs text-on-surface-variant">No confirmation details.</div>`;

    return `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm max-w-2xl mx-auto w-full text-center animate-fadeIn">
        <div class="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <span class="material-symbols-outlined text-[36px]">check_circle</span>
        </div>

        <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
          Payment Successful · Booking Confirmed
        </span>

        <h2 class="text-2xl font-bold font-headline-lg text-primary">Reservation Confirmed!</h2>
        <p class="text-xs text-on-surface-variant mt-1">
          A confirmation email has been dispatched with full stay guidelines.
        </p>

        <!-- Confirmation Badge -->
        <div class="bg-surface-bright rounded-2xl p-6 border border-outline-variant/70 my-6 text-left space-y-3">
          <div class="flex items-center justify-between pb-3 border-b border-outline-variant/60">
            <div>
              <span class="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Confirmation Reference</span>
              <h3 class="text-xl font-bold font-data-mono text-primary tracking-wide">${res.confirmationCode}</h3>
            </div>
            <span class="px-2.5 py-1 rounded-md text-xs font-bold font-data-mono bg-primary/10 text-primary">
              ONLINE
            </span>
          </div>

          <div class="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span class="text-[10px] text-on-surface-variant uppercase block font-bold">Guest</span>
              <span class="font-bold text-primary">${res.guestName}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant uppercase block font-bold">Stay Dates</span>
              <span class="font-bold text-primary">${res.checkIn} → ${res.checkOut} (${res.nights} Nights)</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant uppercase block font-bold">Room Category</span>
              <span class="font-bold text-primary">${res.roomType}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant uppercase block font-bold">Payment Status</span>
              <span class="font-bold text-emerald-600">✓ PAID ($${res.paidAmount})</span>
            </div>
          </div>
        </div>

        <!-- Next Step Operations -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button id="btn-onl-go-arrivals" class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary/90 flex items-center justify-center gap-2 cursor-pointer transition-all">
            <span class="material-symbols-outlined text-[18px]">flight_land</span>
            <span>View in Arrivals Workspace</span>
          </button>

          <button id="btn-onl-new-booking" class="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container flex items-center justify-center gap-2 cursor-pointer transition-all">
            <span class="material-symbols-outlined text-[18px]">add</span>
            <span>New Online Booking</span>
          </button>
        </div>
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. WALK-IN BOOKING WORKFLOW (Steps 1 to 6)
  // ═══════════════════════════════════════════════════════════════════════════
  renderWalkInWorkflow() {
    const s = this.walkInStep;
    const d = this.walkInData;

    return `
      <div class="flex flex-col gap-6 animate-fadeIn">
        <!-- Front Desk Walk-In Banner -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-[22px]">desk</span>
            </div>
            <div>
              <h3 class="font-headline-sm text-sm font-bold text-primary">Front Desk Walk-In Intake</h3>
              <p class="text-xs text-on-surface-variant">Guest arrives at reception counter without a prior reservation</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-full text-[11px] font-bold font-data-mono bg-surface-container border border-outline-variant text-on-surface-variant">
              Step ${s} of 6
            </span>
          </div>
        </div>

        ${
          s === 1 ? this.renderWalkInStep1() :
          s === 2 ? this.renderWalkInStep2() :
          s === 3 ? this.renderWalkInStep3() :
          s === 4 ? this.renderWalkInStep4() :
          s === 5 ? this.renderWalkInStep5() :
          this.renderWalkInStep6()
        }
      </div>
    `;
  }

  renderWalkInStep1() {
    const d = this.walkInData;
    return `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-xs max-w-4xl mx-auto w-full">
        <div class="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/60">
          <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-[20px]">badge</span>
          </div>
          <div>
            <h3 class="font-headline-sm text-base font-bold text-primary">Collect Guest Details & Stay Requirements</h3>
            <p class="text-xs text-on-surface-variant">Step 1 of 6 — Greet guest & capture intake requirements</p>
          </div>
        <!-- Instant Walk-In ID Document Scanner / OCR Extraction -->
        <div class="mb-5 p-4 rounded-xl border border-primary/30 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">document_scanner</span>
            </div>
            <div>
              <strong class="text-xs font-bold text-primary block">Instant Walk-In ID Document Extraction (OCR)</strong>
              <span class="text-[11px] text-on-surface-variant">Place guest ID on optical scanner or upload scan to auto-fill intake details</span>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <button type="button" id="btn-wlk-scan-passport" class="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 flex items-center gap-1 shadow-xs cursor-pointer">
              <span class="material-symbols-outlined text-[15px]">menu_book</span>
              <span>Scan Passport</span>
            </button>
            <button type="button" id="btn-wlk-scan-aadhaar" class="px-3 py-1.5 rounded-lg border border-primary/40 bg-white text-primary text-xs font-bold hover:bg-primary/5 flex items-center gap-1 shadow-xs cursor-pointer">
              <span class="material-symbols-outlined text-[15px]">fingerprint</span>
              <span>Scan Aadhaar</span>
            </button>
            <button type="button" id="btn-wlk-scan-id" class="px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-bright text-xs font-bold text-on-surface hover:bg-surface-container flex items-center gap-1 cursor-pointer">
              <span class="material-symbols-outlined text-[15px]">contact_emergency</span>
              <span>Scan National ID</span>
            </button>
          </div>
        </div>

        <form id="form-walkin-step1" class="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div>
            <label class="block font-bold text-on-surface uppercase font-label-caps mb-1.5">Guest Full Name *</label>
            <input type="text" id="wlk-name" required value="${d.guestName || 'David Warner'}" placeholder="e.g. David Warner" class="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-bright font-semibold">
          </div>

          <div>
            <label class="block font-bold text-on-surface uppercase font-label-caps mb-1.5">Phone Number *</label>
            <input type="tel" id="wlk-phone" required value="${d.phone || '+91 98112 34567'}" placeholder="+91 00000 00000" class="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-bright font-semibold">
          </div>

          <div>
            <label class="block font-bold text-on-surface uppercase font-label-caps mb-1.5">Email Address</label>
            <input type="email" id="wlk-email" value="${d.email || 'd.warner@corporate.com'}" placeholder="guest@example.com" class="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-bright font-semibold">
          </div>

          <div>
            <label class="block font-bold text-on-surface uppercase font-label-caps mb-1.5">Nationality</label>
            <input type="text" id="wlk-nationality" value="${d.nationality || 'Australia'}" class="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-bright font-semibold">
          </div>

          <div>
            <label class="block font-bold text-on-surface uppercase font-label-caps mb-1.5">Check-In Date *</label>
            <input type="date" id="wlk-checkin" required value="${d.checkInDate}" class="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-bright font-semibold">
          </div>

          <div>
            <label class="block font-bold text-on-surface uppercase font-label-caps mb-1.5">Check-Out Date *</label>
            <input type="date" id="wlk-checkout" required value="${d.checkOutDate}" class="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-bright font-semibold">
          </div>

          <div>
            <label class="block font-bold text-on-surface uppercase font-label-caps mb-1.5">Number of Adults</label>
            <select id="wlk-adults" class="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-bright font-semibold">
              <option value="1" ${d.adults === 1 ? 'selected' : ''}>1 Adult</option>
              <option value="2" ${d.adults === 2 ? 'selected' : ''}>2 Adults</option>
              <option value="3" ${d.adults === 3 ? 'selected' : ''}>3 Adults</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-on-surface uppercase font-label-caps mb-1.5">Preferred Room Category</label>
            <select id="wlk-room-type" class="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-bright font-semibold">
              ${(store.state.roomTypes || []).map(rt => `
                <option value="${rt.id}" data-name="${rt.name}" data-price="${rt.basePrice}" ${d.roomTypeId === rt.id ? 'selected' : ''}>
                  ${rt.name} (Base: $${rt.basePrice}/night)
                </option>
              `).join('')}
            </select>
          </div>

          <div class="sm:col-span-2 pt-4 border-t border-outline-variant/60 flex items-center justify-between">
            <span class="text-xs text-on-surface-variant">
              Stay Duration: <strong class="text-primary font-bold" id="wlk-nights-calc">${d.nights} Nights</strong>
            </span>
            <button type="submit" class="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary/90 flex items-center gap-2 transition-all cursor-pointer">
              <span>Check Real-Time Room Availability</span>
              <span class="material-symbols-outlined text-[18px]">check_circle</span>
            </button>
          </div>
        </form>
      </div>
    `;
  }

  renderWalkInStep2() {
    const d = this.walkInData;
    const rooms = store.state.rooms || [];
    const matchingRooms = rooms.filter(r => r.typeId === d.roomTypeId || r.type.toLowerCase().includes(d.roomTypeName.toLowerCase().split(' ')[0]));
    const availableRooms = matchingRooms.filter(r => r.occupancy === 'Vacant');

    return `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-xs max-w-4xl mx-auto w-full">
        <div class="flex items-center justify-between pb-4 mb-5 border-b border-outline-variant/60">
          <div>
            <h3 class="font-headline-sm text-base font-bold text-primary">Availability Results for ${d.roomTypeName}</h3>
            <p class="text-xs text-on-surface-variant">Step 2 of 6 — Check-In: Today · ${d.nights} Nights · ${d.adults} Guest(s)</p>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold ${
            availableRooms.length > 0 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }">
            ${availableRooms.length > 0 ? `${availableRooms.length} Rooms Vacant` : 'No Vacancy for this Category'}
          </span>
        </div>

        ${availableRooms.length > 0 ? `
          <div class="space-y-4 mb-6">
            <p class="text-xs text-on-surface-variant">
              Select an available room to inspect readiness and discuss agreed walk-in rate:
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              ${availableRooms.map(rm => {
                const readiness = store.checkRoomReadiness(rm.id);
                const isSelected = d.selectedRoomNumber === rm.id;
                return `
                  <div class="wlk-room-choice border rounded-xl p-4 transition-all cursor-pointer ${
                    isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-outline-variant hover:bg-surface-bright'
                  }" data-room-id="${rm.id}">
                    <div class="flex items-center justify-between mb-1">
                      <span class="font-bold text-base text-primary">Room ${rm.id}</span>
                      <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        readiness.isReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }">
                        ${readiness.isReady ? '✓ READY' : rm.status}
                      </span>
                    </div>
                    <p class="text-[11px] text-on-surface-variant">Floor ${rm.floor} · ${rm.type}</p>
                    ${!readiness.isReady ? `
                      <p class="text-[10px] text-amber-700 font-semibold mt-1">⚠ ${readiness.reasons[0] || 'Turnover required'}</p>
                    ` : `
                      <p class="text-[10px] text-emerald-700 font-semibold mt-1">Clean & Inspected</p>
                    `}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : `
          <!-- ALTERNATIVES WORKFLOW (Section 6 Requirement: If room not available, offer alternatives) -->
          <div class="p-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 mb-6">
            <div class="flex items-center gap-2 mb-2 font-bold text-xs text-amber-800">
              <span class="material-symbols-outlined text-[18px]">info</span>
              <span>Category Full — Alternative Rooms Offered</span>
            </div>
            <p class="text-xs leading-relaxed mb-3">
              ${d.roomTypeName} is completely booked for the requested stay dates. The Front Desk can offer an alternative available category:
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button type="button" class="btn-wlk-alt-pick p-3 rounded-lg bg-surface-bright border border-amber-300 text-left hover:border-amber-500" data-alt-type="rt-2" data-alt-name="Deluxe Ocean Suite" data-alt-price="480">
                <div class="font-bold text-xs text-primary">Deluxe Ocean Suite (Floor 4)</div>
                <div class="text-[11px] text-on-surface-variant">Available Today · $480 / night</div>
              </button>
              <button type="button" class="btn-wlk-alt-pick p-3 rounded-lg bg-surface-bright border border-amber-300 text-left hover:border-amber-500" data-alt-type="rt-3" data-alt-name="Executive Panoramic Suite" data-alt-price="750">
                <div class="font-bold text-xs text-primary">Executive Panoramic Suite (Floor 4)</div>
                <div class="text-[11px] text-on-surface-variant">Available Today · $750 / night</div>
              </button>
            </div>
          </div>
        `}

        <div class="flex items-center justify-between pt-4 border-t border-outline-variant/60">
          <button id="btn-wlk-step2-back" class="px-5 py-2.5 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container transition-all cursor-pointer">
            ← Change Guest Requirements
          </button>
          <button id="btn-wlk-step2-next" class="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary/90 flex items-center gap-2 transition-all cursor-pointer">
            <span>Discuss Room & Rate</span>
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    `;
  }

  renderWalkInStep3() {
    const d = this.walkInData;
    const subtotal = d.rateDiscussed * d.nights;

    return `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-xs max-w-3xl mx-auto w-full">
        <div class="flex items-center justify-between pb-4 mb-5 border-b border-outline-variant/60">
          <div>
            <h3 class="font-headline-sm text-base font-bold text-primary">Discuss Room & Rate Agreement</h3>
            <p class="text-xs text-on-surface-variant">Step 3 of 6 — Negotiate agreed walk-in rate with the guest</p>
          </div>
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
            Room #${d.selectedRoomNumber || 'TBD'}
          </span>
        </div>

        <div class="space-y-4 text-xs mb-6">
          <div class="bg-surface-bright rounded-xl p-4 border border-outline-variant/60 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span class="text-[10px] text-on-surface-variant uppercase font-bold block">Selected Room</span>
              <span class="font-bold text-primary text-sm mt-0.5 block">Room #${d.selectedRoomNumber}</span>
              <span class="text-[11px] text-on-surface-variant">${d.roomTypeName}</span>
            </div>
            <div>
              <label class="text-[10px] text-on-surface-variant uppercase font-bold block mb-1">Agreed Rate ($/night)</label>
              <input type="number" id="wlk-rate-input" value="${d.rateDiscussed}" class="w-full px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container font-bold text-sm text-primary">
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant uppercase font-bold block">Total Stay (${d.nights} Nights)</span>
              <span class="font-bold text-primary text-sm mt-0.5 block" id="wlk-subtotal-disp">$${subtotal}</span>
            </div>
          </div>

          <div class="p-4 rounded-xl border border-outline-variant/60 bg-surface-bright">
            <h4 class="font-bold text-primary text-xs mb-2">Guest Agreement Status:</h4>
            <div class="space-y-2">
              <label class="flex items-center gap-2.5 cursor-pointer">
                <input type="radio" name="wlk-guest-accept" value="YES" ${d.guestAcceptedRate ? 'checked' : ''} class="w-4 h-4 text-primary">
                <span class="text-xs font-semibold text-emerald-800">Guest ACCEPTS Room & Agreed Rate ($${d.rateDiscussed}/night)</span>
              </label>
              <label class="flex items-center gap-2.5 cursor-pointer">
                <input type="radio" name="wlk-guest-accept" value="NO" ${!d.guestAcceptedRate ? 'checked' : ''} class="w-4 h-4 text-primary">
                <span class="text-xs font-semibold text-rose-800">Guest DECLINES (Offer alternative category or rate)</span>
              </label>
            </div>
          </div>

          <div class="bg-surface-bright rounded-xl p-4 border border-outline-variant/60">
            <label class="block font-bold text-on-surface uppercase font-label-caps mb-1.5">Special Requests / Preferences</label>
            <input type="text" id="wlk-requests" value="${d.specialRequests || ''}" placeholder="e.g. VIP guest, requested late checkout, quiet floor" class="w-full px-3.5 py-2 rounded-lg border border-outline-variant bg-surface-container text-xs font-semibold">
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-outline-variant/60">
          <button id="btn-wlk-step3-back" class="px-5 py-2.5 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container transition-all cursor-pointer">
            ← Back to Room Selection
          </button>
          <button id="btn-wlk-step3-next" class="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary/90 flex items-center gap-2 transition-all cursor-pointer">
            <span>Select Services & Amenities →</span>
            <span class="material-symbols-outlined text-[18px]">room_service</span>
          </button>
        </div>
      </div>
    `;
  }

  // Step 4: WALK-IN SERVICES & AMENITIES (BEFORE PAYMENTS)
  renderWalkInStep4() {
    const d = this.walkInData;
    const roomSubtotal = d.rateDiscussed * d.nights;
    const servicesList = [
      { id: 'wlk-srv-1', name: 'Artisan Breakfast Buffet', price: 35, perNight: true, category: 'Dining', desc: 'Daily gourmet breakfast buffet with champagne & fresh juices', icon: 'bakery_dining' },
      { id: 'wlk-srv-2', name: 'Airport Luxury Transfer', price: 90, perNight: false, category: 'Transport', desc: 'Private chauffeur transfer to/from international terminal', icon: 'airport_shuttle' },
      { id: 'wlk-srv-3', name: 'Spa & Thermal Suite Pass', price: 75, perNight: false, category: 'Wellness', desc: 'Unlimited hydrotherapy, sauna & vitality pool access', icon: 'spa' },
      { id: 'wlk-srv-4', name: 'Guaranteed Late Check-Out (4 PM)', price: 50, perNight: false, category: 'Rooms', desc: 'Extended 4:00 PM checkout on departure day', icon: 'schedule' },
      { id: 'wlk-srv-5', name: 'Valet Parking Pass', price: 30, perNight: true, category: 'Parking', desc: 'Secure covered underground parking with unlimited in/out access', icon: 'local_parking' },
      { id: 'wlk-srv-6', name: 'Welcome Wine & Fruit Platter', price: 45, perNight: false, category: 'F&B', desc: 'Chilled reserve wine with seasonal artisanal fruits platter', icon: 'wine_bar' },
      { id: 'wlk-srv-7', name: 'Executive High-Speed Wi-Fi', price: 20, perNight: false, category: 'Services', desc: 'Dedicated 500Mbps symmetrical ultra-low latency connection', icon: 'wifi' },
    ];

    const currentServices = d.optionalServices || [];
    const srvSubtotal = currentServices.reduce((sum, s) => sum + Number(s.price || 0), 0);
    const taxes = Math.round((roomSubtotal + srvSubtotal) * 0.1);
    const grandTotal = roomSubtotal + srvSubtotal + taxes;

    return `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-xs max-w-4xl mx-auto w-full animate-fadeIn">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-6 border-b border-outline-variant/60">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span class="material-symbols-outlined text-[22px]">room_service</span>
            </div>
            <div>
              <h3 class="font-headline-sm text-base font-bold text-primary">Select Stay Services & Amenities (Before Payment)</h3>
              <p class="text-xs text-on-surface-variant">Step 4 of 6 — Offer add-ons and personalized experiences before collecting payment</p>
            </div>
          </div>
          <span class="text-xs font-bold font-data-mono px-3 py-1 rounded-full bg-primary/10 text-primary self-start sm:self-auto">
            Room #${d.selectedRoomNumber} · ${d.nights} Nights
          </span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <!-- Available Services Grid -->
          <div class="lg:col-span-2 space-y-3">
            <p class="text-xs font-bold text-on-surface uppercase font-label-caps tracking-wider">
              Available Add-On Amenities:
            </p>
            <div class="space-y-2.5">
              ${servicesList.map(srv => {
                const totalSrvCost = srv.perNight ? srv.price * d.nights : srv.price;
                const isChecked = currentServices.some(s => s.name === srv.name);
                return `
                  <div class="p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    isChecked 
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                      : 'border-outline-variant hover:bg-surface-bright'
                  }">
                    <label class="flex items-start gap-3 cursor-pointer flex-1 mr-2">
                      <input 
                        type="checkbox" 
                        class="wlk-srv-checkbox w-4 h-4 rounded text-primary mt-0.5" 
                        data-srv-id="${srv.id}"
                        data-srv-name="${srv.name}"
                        data-srv-price="${totalSrvCost}"
                        data-srv-cat="${srv.category}"
                        ${isChecked ? 'checked' : ''}
                      >
                      <div>
                        <div class="flex items-center gap-2">
                          <span class="material-symbols-outlined text-[18px] text-primary">${srv.icon}</span>
                          <strong class="text-xs text-primary font-bold">${srv.name}</strong>
                          <span class="text-[10px] font-bold px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant">${srv.category}</span>
                        </div>
                        <p class="text-[11px] text-on-surface-variant mt-0.5 leading-snug">${srv.desc}</p>
                      </div>
                    </label>
                    <div class="text-right shrink-0">
                      <div class="text-xs font-bold font-data-mono text-primary">+$${totalSrvCost}</div>
                      ${srv.perNight ? `<div class="text-[9px] text-on-surface-variant">$${srv.price}/nt × ${d.nights}N</div>` : `<div class="text-[9px] text-on-surface-variant">Flat charge</div>`}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Custom Service Input -->
            <div class="p-3.5 rounded-xl border border-dashed border-outline-variant bg-surface-bright flex items-center gap-2">
              <input 
                type="text" 
                id="input-wlk-custom-name" 
                placeholder="Other special service (e.g. Extra Bed, Laundry)..." 
                class="flex-1 px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs font-medium"
              >
              <input 
                type="number" 
                id="input-wlk-custom-price" 
                placeholder="$ Price" 
                class="w-24 px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs font-medium"
              >
              <button 
                type="button" 
                id="btn-wlk-add-custom-srv" 
                class="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 cursor-pointer shrink-0"
              >
                + Add
              </button>
            </div>
          </div>

          <!-- Live Price Summary Column -->
          <div class="bg-surface-bright rounded-2xl p-5 border border-outline-variant/70 space-y-4 h-fit">
            <h4 class="font-bold text-primary text-xs uppercase font-label-caps border-b border-outline-variant/60 pb-2">
              Stay Pricing Summary
            </h4>

            <div class="space-y-2.5 text-xs">
              <div class="flex justify-between text-on-surface-variant">
                <span>Room (${d.roomTypeName})</span>
                <span class="font-bold text-primary">$${roomSubtotal}</span>
              </div>
              <div class="text-[10px] text-on-surface-variant/80 pl-2">
                ${d.nights} Nights × $${d.rateDiscussed}/night
              </div>

              <div class="flex justify-between text-on-surface-variant pt-2 border-t border-outline-variant/50">
                <span>Services & Add-Ons (${currentServices.length})</span>
                <span class="font-bold text-primary">+$${srvSubtotal}</span>
              </div>

              ${currentServices.length > 0 ? `
                <div class="space-y-1 pl-2">
                  ${currentServices.map(s => `
                    <div class="flex justify-between text-[11px] text-on-surface-variant">
                      <span class="truncate max-w-[140px]">• ${s.name}</span>
                      <span>$${s.price}</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              <div class="flex justify-between text-on-surface-variant pt-2 border-t border-outline-variant/50">
                <span>Estimated Taxes (10%)</span>
                <span>$${taxes}</span>
              </div>

              <div class="flex justify-between text-sm font-bold text-primary pt-3 border-t-2 border-outline-variant/80">
                <span>Total Walk-In Charge:</span>
                <span class="text-base text-primary font-data-mono">$${grandTotal}</span>
              </div>
            </div>

            <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] leading-snug">
              ✓ All selected services will be posted to the guest's folio and charged during the next payment step.
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-outline-variant/60">
          <button id="btn-wlk-step4-back" class="px-5 py-2.5 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container transition-all cursor-pointer">
            ← Back to Rate Agreement
          </button>
          <button id="btn-wlk-step4-next" class="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary/90 flex items-center gap-2 transition-all cursor-pointer">
            <span>Proceed to Payment ($${grandTotal})</span>
            <span class="material-symbols-outlined text-[18px]">lock</span>
          </button>
        </div>
      </div>
    `;
  }

  // Step 5: WALK-IN PAYMENT COLLECTION
  renderWalkInStep5() {
    const d = this.walkInData;
    const roomSubtotal = d.rateDiscussed * d.nights;
    const srvSubtotal = (d.optionalServices || []).reduce((sum, s) => sum + Number(s.price || 0), 0);
    const taxes = Math.round((roomSubtotal + srvSubtotal) * 0.1);
    const totalAmount = roomSubtotal + srvSubtotal + taxes;

    return `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-xs max-w-2xl mx-auto w-full animate-fadeIn">
        <div class="flex items-center gap-3 pb-4 mb-6 border-b border-outline-variant/60">
          <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-[22px]">point_of_sale</span>
          </div>
          <div>
            <h3 class="font-headline-sm text-base font-bold text-primary">Front Desk Payment Collection</h3>
            <p class="text-xs text-on-surface-variant">Step 5 of 6 — Collect stay payment / pre-authorization for Walk-In Guest</p>
          </div>
        </div>

        <!-- Breakdown Banner -->
        <div class="bg-surface-bright rounded-xl p-4 border border-outline-variant/60 mb-6 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-on-surface-variant">Room Tariff (${d.nights}N · Room #${d.selectedRoomNumber})</span>
            <span class="font-bold text-primary">$${roomSubtotal}</span>
          </div>
          ${(d.optionalServices || []).length > 0 ? `
            <div class="flex items-center justify-between text-xs text-on-surface-variant">
              <span>Included Services (${d.optionalServices.length} add-ons)</span>
              <span class="font-bold text-primary">+$${srvSubtotal}</span>
            </div>
          ` : ''}
          <div class="flex items-center justify-between text-xs text-on-surface-variant">
            <span>Taxes & Surcharges (10%)</span>
            <span class="font-bold text-primary">+$${taxes}</span>
          </div>
          <div class="flex items-center justify-between pt-2 border-t border-outline-variant/60">
            <span class="text-xs font-bold uppercase tracking-wider text-primary">Total Amount Due</span>
            <span class="text-2xl font-bold font-headline-lg font-data-mono text-primary">$${totalAmount}</span>
          </div>
        </div>

        <form id="form-walkin-payment" class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-on-surface uppercase font-label-caps mb-1.5">Payment Method *</label>
            <select id="wlk-pay-method" class="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-bright font-semibold">
              <option value="Credit Card (Front Desk POS)">Credit Card (Front Desk POS Terminal)</option>
              <option value="Cash / Currency">Cash / Foreign Currency</option>
              <option value="Direct Corporate Billing">Direct Corporate Billing / Voucher</option>
            </select>
          </div>

          <div>
            <label class="block font-bold text-on-surface uppercase font-label-caps mb-1.5">POS Reference / Transaction Auth Code</label>
            <input type="text" id="wlk-pay-auth" value="AUTH-POS-${Math.floor(100000 + Math.random() * 900000)}" class="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface-bright font-semibold font-data-mono">
          </div>

          <div class="p-3.5 rounded-xl bg-surface-container border border-outline-variant/60 flex items-center justify-between">
            <div class="text-[11px] text-on-surface-variant">
              <strong>Payment Status:</strong>
              <p class="text-[10px] text-on-surface-variant/80">Confirm payment received at front desk terminal</p>
            </div>
            <select id="wlk-pay-status-choice" class="text-xs font-bold px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-bright">
              <option value="PAID">✓ Payment Collected Successfully</option>
              <option value="FAILED">Payment Failed / Declined</option>
            </select>
          </div>

          <div id="wlk-pay-error" class="hidden p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            Payment Failed: Terminal declined transaction. Please resolve payment before proceeding.
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-outline-variant/60">
            <button type="button" id="btn-wlk-step5-back" class="px-5 py-2.5 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container transition-all cursor-pointer">
              ← Edit Services
            </button>
            <button type="submit" id="btn-wlk-create-res" class="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-sm hover:bg-emerald-700 flex items-center gap-2 transition-all cursor-pointer">
              <span class="material-symbols-outlined text-[18px]">check</span>
              <span>Confirm & Authorize $${totalAmount}</span>
            </button>
          </div>
        </form>
      </div>
    `;
  }

  // Step 6: WALK-IN CONFIRMED
  renderWalkInStep6() {
    const res = this.walkInConfirmedRes;
    if (!res) return `<div class="p-8 text-center text-xs text-on-surface-variant">No confirmation details.</div>`;

    const services = res.optionalServices || [];

    return `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm max-w-2xl mx-auto w-full text-center animate-fadeIn">
        <div class="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <span class="material-symbols-outlined text-[36px]">check_circle</span>
        </div>

        <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
          Walk-In Reservation Created
        </span>

        <h2 class="text-2xl font-bold font-headline-lg text-primary">Reservation Active & Ready for Intake!</h2>
        <p class="text-xs text-on-surface-variant mt-1">
          Reservation number generated. Now proceed to <strong>Document Verification & Check-In</strong>.
        </p>

        <!-- Reservation Details Card -->
        <div class="bg-surface-bright rounded-2xl p-6 border border-outline-variant/70 my-6 text-left space-y-3">
          <div class="flex items-center justify-between pb-3 border-b border-outline-variant/60">
            <div>
              <span class="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Confirmation Reference</span>
              <h3 class="text-xl font-bold font-data-mono text-primary tracking-wide">${res.confirmationCode}</h3>
            </div>
            <span class="px-2.5 py-1 rounded-md text-xs font-bold font-data-mono bg-amber-500/10 text-amber-700 border border-amber-500/20">
              WALK-IN
            </span>
          </div>

          <div class="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span class="text-[10px] text-on-surface-variant uppercase block font-bold">Guest Name</span>
              <span class="font-bold text-primary">${res.guestName}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant uppercase block font-bold">Assigned Room</span>
              <span class="font-bold text-primary">Room #${res.assignedRoom || res.roomNumber}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant uppercase block font-bold">Stay Dates</span>
              <span class="font-bold text-primary">${res.checkIn} → ${res.checkOut}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant uppercase block font-bold">Total Payment</span>
              <span class="font-bold text-emerald-600">✓ PAID ($${res.paidAmount})</span>
            </div>
          </div>

          ${services.length > 0 ? `
            <div class="pt-3 border-t border-outline-variant/60">
              <span class="text-[10px] text-on-surface-variant uppercase block font-bold mb-1.5">Included Services & Amenities:</span>
              <div class="flex flex-wrap gap-1.5">
                ${services.map(s => `
                  <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-semibold text-[11px]">
                    <span class="material-symbols-outlined text-[13px]">check</span>
                    <span>${s.name} (+$${s.price})</span>
                  </span>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Direct Next Action in the Operational Guest Journey -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button id="btn-wlk-proceed-verify" class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary/90 flex items-center justify-center gap-2 cursor-pointer transition-all">
            <span class="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Proceed to Document Verification & Check-In</span>
          </button>

          <button id="btn-wlk-new-walkin" class="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container flex items-center justify-center gap-2 cursor-pointer transition-all">
            <span class="material-symbols-outlined text-[18px]">add</span>
            <span>New Walk-In Intake</span>
          </button>
        </div>
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. PROFILES WORKSPACE (Arrivals & Checked-In Profiles)
  // ═══════════════════════════════════════════════════════════════════════════
  renderProfilesView() {
    const state = store.state;
    const allReservations = state.reservations || [];
    const arrivals = allReservations.filter(r => r.status === 'Confirmed' || r.status === 'ARRIVED');
    const checkedInReservations = allReservations.filter(r => r.status === 'Checked In');

    const totalCount = arrivals.length;
    const onlineArrivals = arrivals.filter(r => (r.bookingType || '').toUpperCase() === 'ONLINE' || r.channel === 'Online' || r.channel === 'Direct Web Engine');
    const walkinArrivals = arrivals.filter(r => (r.bookingType || '').toUpperCase() === 'WALK_IN' || r.channel === 'Walk-In');
    const onlineCount = onlineArrivals.length;
    const walkinCount = walkinArrivals.length;

    const assignedCount = arrivals.filter(r => !!(r.assignedRoom || r.roomNumber)).length;
    const unassignedCount = arrivals.filter(r => !(r.assignedRoom || r.roomNumber)).length;
    const notReadyCount = arrivals.filter(r => {
      const rm = r.assignedRoom || r.roomNumber;
      if (!rm) return false;
      return !store.checkRoomReadiness(rm).isReady;
    }).length;
    const checkedInCount = checkedInReservations.length;

    let targetList = arrivals;
    if (this.profilesFilterStatus === 'CHECKED_IN') {
      targetList = checkedInReservations;
    } else if (this.profilesFilterStatus === 'ONLINE') {
      targetList = onlineArrivals;
    } else if (this.profilesFilterStatus === 'WALK_IN') {
      targetList = walkinArrivals;
    } else if (this.profilesFilterStatus === 'ASSIGNED') {
      targetList = arrivals.filter(r => !!(r.assignedRoom || r.roomNumber));
    } else if (this.profilesFilterStatus === 'UNASSIGNED') {
      targetList = arrivals.filter(r => !(r.assignedRoom || r.roomNumber));
    } else if (this.profilesFilterStatus === 'NOT_READY') {
      targetList = arrivals.filter(r => {
        const rm = r.assignedRoom || r.roomNumber;
        return rm && !store.checkRoomReadiness(rm).isReady;
      });
    } else {
      targetList = arrivals;
    }

    const filtered = targetList.filter(r => {
      const rm = r.assignedRoom || r.roomNumber;
      const q = (this.profilesSearchQuery || '').toLowerCase().trim();
      if (!q) return true;
      return (
        (r.guestName || '').toLowerCase().includes(q) ||
        (r.confirmationCode || '').toLowerCase().includes(q) ||
        (r.phone && r.phone.includes(q)) ||
        (r.email && r.email.toLowerCase().includes(q)) ||
        (rm && rm.toString().includes(q))
      );
    });

    return `
      <div class="space-y-6 animate-fadeIn">
        <!-- Operational Metrics Ribbon (Interactive Clickable Filters) -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div class="metric-filter-card bg-surface-container-lowest border border-outline-variant/70 hover:border-primary/60 rounded-2xl p-4 shadow-xs cursor-pointer transition-all ${this.profilesFilterStatus === 'ALL' ? 'ring-2 ring-primary bg-primary/5' : ''}" data-metric-filter="ALL" title="Click to view all arrivals">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold font-label-caps uppercase text-on-surface-variant">Today's Expected</span>
              <span class="material-symbols-outlined text-[18px] text-primary">flight_land</span>
            </div>
            <div class="text-2xl font-bold font-headline-lg text-primary mt-1">${totalCount}</div>
            <div class="text-[10px] text-on-surface-variant mt-0.5">All arrivals</div>
          </div>

          <div class="metric-filter-card bg-surface-container-lowest border border-outline-variant/70 hover:border-emerald-700/60 rounded-2xl p-4 shadow-xs cursor-pointer transition-all ${this.profilesFilterStatus === 'CHECKED_IN' ? 'ring-2 ring-emerald-700 bg-emerald-700/5' : ''}" data-metric-filter="CHECKED_IN" title="Click to view checked-in resident profiles">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold font-label-caps uppercase text-emerald-800">Checked-In</span>
              <span class="material-symbols-outlined text-[18px] text-emerald-700">hotel</span>
            </div>
            <div class="text-2xl font-bold font-headline-lg text-emerald-700 mt-1">${checkedInCount}</div>
            <div class="text-[10px] text-emerald-800/80 mt-0.5">In-house guests</div>
          </div>

          <div class="metric-filter-card bg-surface-container-lowest border border-outline-variant/70 hover:border-blue-500/60 rounded-2xl p-4 shadow-xs cursor-pointer transition-all ${this.profilesFilterStatus === 'ONLINE' ? 'ring-2 ring-blue-500 bg-blue-500/5' : ''}" data-metric-filter="ONLINE" title="Click to filter by Online web bookings">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold font-label-caps uppercase text-blue-700">Online Feed</span>
              <span class="material-symbols-outlined text-[18px] text-blue-600">public</span>
            </div>
            <div class="text-2xl font-bold font-headline-lg text-blue-600 mt-1">${onlineCount}</div>
            <div class="text-[10px] text-blue-700/80 mt-0.5">Pre-paid web feed</div>
          </div>

          <div class="metric-filter-card bg-surface-container-lowest border border-outline-variant/70 hover:border-amber-500/60 rounded-2xl p-4 shadow-xs cursor-pointer transition-all ${this.profilesFilterStatus === 'WALK_IN' ? 'ring-2 ring-amber-500 bg-amber-500/5' : ''}" data-metric-filter="WALK_IN" title="Click to filter by Walk-In intakes">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold font-label-caps uppercase text-amber-700">Walk-Ins</span>
              <span class="material-symbols-outlined text-[18px] text-amber-600">directions_walk</span>
            </div>
            <div class="text-2xl font-bold font-headline-lg text-amber-600 mt-1">${walkinCount}</div>
            <div class="text-[10px] text-amber-700/80 mt-0.5">Front desk intakes</div>
          </div>

          <div class="metric-filter-card bg-surface-container-lowest border border-outline-variant/70 hover:border-emerald-500/60 rounded-2xl p-4 shadow-xs cursor-pointer transition-all ${this.profilesFilterStatus === 'ASSIGNED' ? 'ring-2 ring-emerald-500 bg-emerald-500/5' : ''}" data-metric-filter="ASSIGNED" title="Click to view room assigned arrivals">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold font-label-caps uppercase text-emerald-700">Room Assigned</span>
              <span class="material-symbols-outlined text-[18px] text-emerald-600">assignment_turned_in</span>
            </div>
            <div class="text-2xl font-bold font-headline-lg text-emerald-600 mt-1">${assignedCount}</div>
            <div class="text-[10px] text-emerald-700/80 mt-0.5">Allocated rooms</div>
          </div>

          <div class="metric-filter-card bg-surface-container-lowest border border-outline-variant/70 hover:border-amber-500/60 rounded-2xl p-4 shadow-xs cursor-pointer transition-all ${this.profilesFilterStatus === 'UNASSIGNED' ? 'ring-2 ring-amber-500 bg-amber-500/5' : ''}" data-metric-filter="UNASSIGNED" title="Click to view unassigned arrivals">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold font-label-caps uppercase text-amber-700">Unassigned</span>
              <span class="material-symbols-outlined text-[18px] text-amber-600">report_problem</span>
            </div>
            <div class="text-2xl font-bold font-headline-lg text-amber-600 mt-1">${unassignedCount}</div>
            <div class="text-[10px] text-amber-700/80 mt-0.5">Needs room lock</div>
          </div>
        </div>

        <!-- Search & Filter Toolbar -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 shadow-xs flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <!-- Filter Tabs -->
          <div class="flex items-center gap-1 p-1 rounded-xl bg-surface-bright border border-outline-variant shrink-0 flex-wrap">
            ${[
              { id: 'ALL', label: 'All Arrivals', count: totalCount },
              { id: 'CHECKED_IN', label: '🏨 Checked-In Guests', count: checkedInCount, badgeClass: 'bg-emerald-100 text-emerald-800' },
              { id: 'ONLINE', label: '🌐 Online Bookings', count: onlineCount, badgeClass: 'bg-blue-100 text-blue-800' },
              { id: 'WALK_IN', label: '🚶 Walk-In Bookings', count: walkinCount, badgeClass: 'bg-amber-100 text-amber-800' },
              { id: 'ASSIGNED', label: 'Room Assigned', count: assignedCount },
              { id: 'UNASSIGNED', label: 'Unassigned', count: unassignedCount },
              { id: 'NOT_READY', label: 'Room Not Ready', count: notReadyCount }
            ].map(f => `
              <button class="btn-profiles-filter px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                this.profilesFilterStatus === f.id ? 'bg-primary text-on-primary font-bold shadow-xs' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container'
              }" data-filter="${f.id}">
                <span>${f.label}</span>
                <span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  this.profilesFilterStatus === f.id ? 'bg-white/20 text-white' : (f.badgeClass || 'bg-surface-container text-on-surface-variant')
                }">${f.count}</span>
              </button>
            `).join('')}
          </div>

          <!-- Search Input -->
          <div class="relative w-full xl:w-80">
            <input 
              type="text" 
              id="profiles-search-input" 
              value="${this.profilesSearchQuery}" 
              placeholder="Search name, conf code, room, email..." 
              class="w-full px-3.5 py-2 pl-9 rounded-xl border border-outline-variant bg-surface-bright text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
            <span class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[17px]">search</span>
          </div>
        </div>

        <!-- Content Mount: Checked-In Profiles View OR Expected Arrivals Ledger -->
        ${this.profilesFilterStatus === 'CHECKED_IN' 
          ? this.renderProfilesCheckedInContent(filtered) 
          : this.renderProfilesArrivalsContent(filtered)}
      </div>
    `;
  }

  // Alias for backward compatibility
  renderReservationsLedger() {
    return this.renderProfilesView();
  }

  // Checked-In Guest Profiles Cards inside Profiles Workspace
  renderProfilesCheckedInContent(checkedInList) {
    if (!checkedInList || checkedInList.length === 0) {
      return `
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-12 text-center shadow-xs animate-fadeIn">
          <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
            <span class="material-symbols-outlined text-[32px]">hotel</span>
          </div>
          <h4 class="text-base font-bold text-primary">No Checked-In Profiles Found</h4>
          <p class="text-xs text-on-surface-variant mt-1 max-w-md mx-auto">
            ${this.profilesSearchQuery ? `No checked-in guest matches "${this.profilesSearchQuery}".` : 'Once guest check-in and keycard issuance are completed, their active resident profile will appear here.'}
          </p>
          <button class="btn-profiles-back-arrivals mt-4 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-sm transition-all">
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
                <h3 class="text-base font-bold font-headline-sm text-primary">Active In-House Guest Profiles</h3>
                <span class="text-[10px] font-bold font-data-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                  ● ${checkedInList.length} Checked In
                </span>
              </div>
              <p class="text-xs text-on-surface-variant mt-0.5">
                Complete stay profiles, RFID room keys, verified travel documents, and active folios for currently checked-in guests.
              </p>
            </div>
          </div>

          <button class="btn-profiles-back-arrivals px-4 py-2 rounded-xl bg-surface-bright border border-outline-variant hover:border-primary text-xs font-bold text-primary flex items-center gap-2 cursor-pointer transition-all shadow-xs">
            <span class="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to Arrivals</span>
          </button>
        </div>

        <!-- Profile Cards List -->
        <div class="space-y-3">
          ${checkedInList.map(res => {
            const isNewlyCheckedIn = this.recentlyCheckedInId === res.id || this.newlyCheckedInResId === res.id;
            const roomNum = res.assignedRoom || res.roomNumber;
            const keycard = res.keycardIssued || res.keyCardNumber || `KC-${roomNum || '205'}-A`;
            const doc = res.idVerification || {};

            return `
              <div class="profile-guest-card bg-surface-container-lowest border ${
                isNewlyCheckedIn ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md' : 'border-outline-variant hover:border-primary/60'
              } rounded-2xl p-5 shadow-xs transition-all flex flex-col gap-4 cursor-pointer" data-card-res-id="${res.id}" title="Click to view full profile and operations in side tab">
                
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

                <!-- Included Services if any -->
                ${res.optionalServices && res.optionalServices.length > 0 ? `
                  <div class="flex items-center gap-2 flex-wrap pt-1">
                    <span class="text-[11px] font-bold text-on-surface-variant">Services:</span>
                    ${res.optionalServices.map(s => `
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary/5 text-primary border border-primary/20 flex items-center gap-1">
                        <span>${s.name}</span>
                        <span class="font-data-mono font-bold">($${s.price})</span>
                      </span>
                    `).join('')}
                  </div>
                ` : ''}

                <!-- Footer Quick Actions -->
                <div class="flex items-center justify-between pt-2 border-t border-outline-variant/40 flex-wrap gap-2">
                  <div class="text-[11px] text-on-surface-variant flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[14px] text-emerald-600">check_circle</span>
                    <span>Check-in complete · Access active until ${res.checkOut} 11:00 AM</span>
                  </div>

                  <div class="flex items-center gap-2 flex-wrap">
                    <button class="btn-checkedin-view-crm px-3 py-1.5 rounded-xl border border-outline-variant hover:border-primary text-xs font-bold text-primary flex items-center gap-1.5 transition-all cursor-pointer shadow-xs hover:bg-surface-container" data-guest-name="${res.guestName}" data-res-id="${res.id}" title="Open guest details in side tab">
                      <span class="material-symbols-outlined text-[15px]">badge</span>
                      <span>Profile</span>
                    </button>
                    <button class="btn-profiles-open-folio px-3 py-1.5 rounded-xl border border-outline-variant hover:border-primary text-xs font-bold text-primary flex items-center gap-1.5 transition-all cursor-pointer shadow-xs hover:bg-surface-container">
                      <span class="material-symbols-outlined text-[15px]">receipt_long</span>
                      <span>Folio Ledger</span>
                    </button>
                    <button class="btn-manage-online-services px-3 py-1.5 rounded-xl border border-outline-variant hover:border-primary text-xs font-bold text-primary flex items-center gap-1.5 transition-all cursor-pointer shadow-xs hover:bg-surface-container" data-res-id="${res.id}">
                      <span class="material-symbols-outlined text-[15px]">room_service</span>
                      <span>Services</span>
                    </button>
                    <button class="btn-checkedin-card-checkout px-3.5 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95" data-res-id="${res.id}" data-room="${roomNum || ''}" title="Check out guest now">
                      <span class="material-symbols-outlined text-[15px]">logout</span>
                      <span>Check Out</span>
                    </button>
                    <button class="btn-profiles-back-arrivals px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs hover:bg-primary/90">
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

  // Expected Arrivals Cards inside Profiles Workspace
  renderProfilesArrivalsContent(arrivalsList) {
    if (!arrivalsList || arrivalsList.length === 0) {
      return `
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-12 text-center shadow-xs">
          <div class="w-14 h-14 rounded-2xl bg-surface-container text-on-surface-variant flex items-center justify-center mx-auto mb-4">
            <span class="material-symbols-outlined text-[28px]">search_off</span>
          </div>
          <h3 class="font-headline-sm text-base font-bold text-primary">No Confirmed Arrivals Found</h3>
          <p class="text-xs text-on-surface-variant max-w-md mx-auto mt-1 mb-5 leading-relaxed">
            ${this.profilesSearchQuery 
              ? `No expected arrival matches "${this.profilesSearchQuery}".`
              : 'No expected arrivals currently pending in this category.'}
          </p>
          <button id="btn-profiles-empty-walkin" class="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-sm hover:bg-primary/90 inline-flex items-center gap-2 cursor-pointer transition-all">
            <span class="material-symbols-outlined text-[18px]">person_walk</span>
            <span>Handle as Walk-In Intake</span>
          </button>
        </div>
      `;
    }

    return `
      <div class="space-y-3">
        ${arrivalsList.map(res => {
          const roomNum = res.assignedRoom || res.roomNumber;
          const readiness = roomNum ? store.checkRoomReadiness(roomNum) : { isReady: false, status: 'UNASSIGNED', reasons: ['No room assigned yet'] };
          const isDocVerified = !!(res.identityVerified || res.idVerification?.verified);

          return `
            <div class="profile-guest-card bg-surface-container-lowest border border-outline-variant hover:border-primary/60 rounded-2xl p-5 shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer" data-card-res-id="${res.id}" title="Click to view full profile and operations in side tab">
              
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

                  ${res.optionalServices && res.optionalServices.length > 0 ? `
                    <div class="flex items-center gap-1.5 flex-wrap mt-2">
                      <span class="text-[10px] font-bold text-on-surface-variant uppercase font-label-caps">Services:</span>
                      ${res.optionalServices.map(s => `
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/5 text-primary border border-primary/20 flex items-center gap-1">
                          <span>${s.name}</span>
                          <span class="font-data-mono font-bold">($${s.price})</span>
                        </span>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              </div>

              <!-- Operational Badges & Actions -->
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
                <div class="flex items-center gap-2 flex-wrap">
                  <button class="btn-open-guest-crm px-3 py-2 rounded-xl border border-outline-variant hover:border-primary text-xs font-bold text-primary hover:bg-surface-container flex items-center gap-1.5 transition-all cursor-pointer" data-guest-name="${res.guestName}" data-res-id="${res.id}" title="Open guest details in side tab">
                    <span class="material-symbols-outlined text-[16px]">person</span>
                    <span>Profile</span>
                  </button>

                  <button class="btn-manage-online-services px-3 py-2 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 text-xs font-bold text-primary flex items-center gap-1.5 transition-all cursor-pointer shadow-xs" data-res-id="${res.id}" title="Review or Add Stay Services & Amenities before check-in">
                    <span class="material-symbols-outlined text-[16px]">room_service</span>
                    <span>Services (${(res.optionalServices || []).length})</span>
                  </button>

                  <button class="btn-profiles-verify-id px-3 py-2 rounded-xl border border-outline-variant hover:border-primary text-xs font-bold text-primary hover:bg-surface-container flex items-center gap-1.5 transition-all cursor-pointer" data-res-id="${res.id}">
                    <span class="material-symbols-outlined text-[16px]">badge</span>
                    <span>${isDocVerified ? 'Review ID' : 'Verify ID'}</span>
                  </button>

                  <button class="btn-profiles-check-room px-3 py-2 rounded-xl border border-outline-variant hover:border-primary text-xs font-bold text-primary hover:bg-surface-container flex items-center gap-1.5 transition-all cursor-pointer" data-res-id="${res.id}" data-room="${roomNum || ''}">
                    <span class="material-symbols-outlined text-[16px]">meeting_room</span>
                    <span>${roomNum ? 'Check Room' : 'Assign Room'}</span>
                  </button>

                  <button class="btn-profiles-checkin px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary/90 flex items-center gap-1.5 transition-all cursor-pointer" data-res-id="${res.id}">
                    <span class="material-symbols-outlined text-[16px]">how_to_reg</span>
                    <span>Check-In →</span>
                  </button>
                </div>

              </div>

            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EVENT BINDINGS
  // ═══════════════════════════════════════════════════════════════════════════
  bindEvents() {
    const root = this.container || document;
    const $ = (id) => root.querySelector(id.startsWith('#') || id.startsWith('.') ? id : `#${id}`);
    const $$ = (sel) => Array.from(root.querySelectorAll(sel));

    // ── Single-Page Filter Switcher (All Arrivals, Checked-In, Online, Walk-In) ──
    const setMode = (mode) => {
      this.activeMode = 'profiles';
      if (mode === 'online') {
        this.profilesFilterStatus = 'ONLINE';
      } else if (mode === 'walkin') {
        this.profilesFilterStatus = 'WALK_IN';
      } else if (mode === 'checkedin') {
        this.profilesFilterStatus = 'CHECKED_IN';
      } else {
        this.profilesFilterStatus = 'ALL';
      }
      this.renderContent();
    };

    const btnCheckedin = $('btn-mode-checkedin') || root.querySelector('[data-mode="checkedin"]');
    if (btnCheckedin) {
      btnCheckedin.onclick = (e) => {
        if (e) e.preventDefault();
        setMode('checkedin');
      };
    }

    const btnOnline = $('btn-mode-online') || root.querySelector('[data-mode="online"]');
    if (btnOnline) {
      btnOnline.onclick = (e) => {
        if (e) e.preventDefault();
        setMode('online');
      };
    }

    const btnWalkin = $('btn-mode-walkin') || root.querySelector('[data-mode="walkin"]');
    if (btnWalkin) {
      btnWalkin.onclick = (e) => {
        if (e) e.preventDefault();
        setMode('walkin');
      };
    }

    const btnProfiles = $('btn-mode-profiles') || $('btn-mode-list') || root.querySelector('[data-mode="profiles"]');
    if (btnProfiles) {
      btnProfiles.onclick = (e) => {
        if (e) e.preventDefault();
        setMode('profiles');
      };
    }

    // Direct mode attribute binding for guaranteed tab switching on single page
    $$('[data-mode]').forEach(btn => {
      btn.onclick = (e) => {
        if (e) e.preventDefault();
        const m = btn.dataset.mode;
        if (m) setMode(m);
      };
    });

    // ── Operational Metrics Ribbon (Interactive Clickable Filters) ──────────
    $$('[data-metric-filter]').forEach(card => {
      card.onclick = (e) => {
        if (e) e.preventDefault();
        this.activeMode = 'profiles';
        this.profilesFilterStatus = card.dataset.metricFilter || 'ALL';
        this.renderContent();
      };
    });

    // ── Quick Walk-In Intake Modal Button in Header ─────────────────────────
    const btnHeaderWalkin = $('btn-header-new-walkin');
    if (btnHeaderWalkin) {
      btnHeaderWalkin.onclick = (e) => {
        if (e) e.preventDefault();
        const modal = new NewBookingModal({
          onCreated: () => {
            this.activeMode = 'profiles';
            this.profilesFilterStatus = 'WALK_IN';
            this.renderContent();
          }
        });
        document.body.appendChild(modal.render());
      };
    }

    // ── Online Feed Filter Tabs (All, Awaiting ID, ID Verified, Checked-In Profiles)
    $$('.btn-online-filter-tab, .btn-online-filter').forEach(btn => {
      btn.onclick = (e) => {
        if (e) e.preventDefault();
        this.onlineFilterStatus = btn.dataset.status || 'ALL';
        this.renderContent();
      };
    });

    // ── Online Feed Search Input ────────────────────────────────────────────
    const onlineSearch = $('online-feed-search');
    if (onlineSearch) {
      onlineSearch.oninput = () => {
        this.onlineSearchQuery = onlineSearch.value;
        this.renderContent();
        const inputAfter = $('online-feed-search');
        if (inputAfter) {
          inputAfter.focus();
          inputAfter.setSelectionRange(inputAfter.value.length, inputAfter.value.length);
        }
      };
    }

    // ── Online Feed Actions ─────────────────────────────────────────────────
    const openNewOnlineModal = () => {
      const modal = new NewOnlineBookingModal({
        onCreated: () => {
          this.renderContent();
        },
        onClose: () => {
          this.renderContent();
        }
      });
      document.body.appendChild(modal.render());
    };

    const btnNewOnline = $('btn-open-new-online-booking-modal');
    if (btnNewOnline) {
      btnNewOnline.onclick = openNewOnlineModal;
    }

    const btnNewOnlineEmpty = $('btn-open-new-online-empty');
    if (btnNewOnlineEmpty) {
      btnNewOnlineEmpty.onclick = openNewOnlineModal;
    }

    const btnAddMoreOnline = $('btn-add-more-online-bookings');
    if (btnAddMoreOnline) {
      btnAddMoreOnline.onclick = openNewOnlineModal;
    }

    $$('.btn-open-new-online-booking-modal').forEach(btn => {
      btn.onclick = openNewOnlineModal;
    });

    const btnSim = $('btn-toggle-online-simulator');
    if (btnSim) {
      btnSim.onclick = () => {
        this.showOnlineSimulator = !this.showOnlineSimulator;
        this.renderContent();
      };
    }

    const btnSimulateArrival = $('btn-simulate-incoming-web');
    if (btnSimulateArrival) {
      btnSimulateArrival.onclick = () => {
        this.simulateIncomingWebBooking();
      };
    }

    const btnQuickSimEmpty = $('btn-quick-simulate-empty');
    if (btnQuickSimEmpty) {
      btnQuickSimEmpty.onclick = () => {
        this.simulateIncomingWebBooking();
      };
    }

    // ── Online View Layout Toggles (List vs Cards) ──────────────────────────
    const btnViewList = $('btn-toggle-view-list') || $('btn-online-view-list');
    if (btnViewList) {
      btnViewList.onclick = () => {
        this.onlineViewLayout = 'list';
        this.renderContent();
      };
    }

    const btnViewCards = $('btn-toggle-view-cards') || $('btn-online-view-cards');
    if (btnViewCards) {
      btnViewCards.onclick = () => {
        this.onlineViewLayout = 'cards';
        this.renderContent();
      };
    }

    // ── Pre-Collected Document Verification Desk ───────────────────────────
    $$('.btn-start-doc-verify').forEach(btn => {
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

    $$('.btn-manage-online-services').forEach(btn => {
      btn.onclick = () => {
        const resId = btn.dataset.resId;
        const res = (store.state.reservations || []).find(r => r.id === resId);
        if (res) {
          const modal = new OnlineServicesModal({
            reservation: res,
            onServicesUpdated: () => {
              this.renderContent();
            },
            onProceedToCheckIn: (updatedRes) => {
              const targetRes = updatedRes || res;
              const checkInModal = new CheckInModal({
                reservation: targetRes,
                onCheckedIn: (checkedInId) => {
                  this.activeMode = 'profiles';
                  this.profilesFilterStatus = 'CHECKED_IN';
                  this.recentlyCheckedInId = checkedInId || targetRes.id;
                  this.newlyCheckedInResId = checkedInId || targetRes.id;
                  store.showToast(`✓ Check-in completed! Viewing active in-house profile for ${targetRes.guestName}.`, 'success');
                  this.renderContent();
                },
                onSuccess: (checkedInId) => {
                  this.activeMode = 'profiles';
                  this.profilesFilterStatus = 'CHECKED_IN';
                  this.recentlyCheckedInId = checkedInId || targetRes.id;
                  this.newlyCheckedInResId = checkedInId || targetRes.id;
                  this.renderContent();
                },
                onClose: () => {
                  this.renderContent();
                }
              });
              document.body.appendChild(checkInModal.render());
            },
            onClose: () => {
              this.renderContent();
            }
          });
          document.body.appendChild(modal.render());
        }
      };
    });

    $$('.btn-process-online-arrival').forEach(btn => {
      btn.onclick = () => {
        const resId = btn.dataset.resId;
        const res = (store.state.reservations || []).find(r => r.id === resId);
        if (res) {
          const modal = new CheckInModal({
            reservation: res,
            onCheckedIn: (checkedInId) => {
              this.activeMode = 'profiles';
              this.profilesFilterStatus = 'CHECKED_IN';
              this.recentlyCheckedInId = checkedInId || res.id;
              this.newlyCheckedInResId = checkedInId || res.id;
              store.showToast(`✓ Check-in completed! Viewing active in-house profile for ${res.guestName}.`, 'success');
              this.renderContent();
            },
            onSuccess: (checkedInId) => {
              this.activeMode = 'profiles';
              this.profilesFilterStatus = 'CHECKED_IN';
              this.recentlyCheckedInId = checkedInId || res.id;
              this.newlyCheckedInResId = checkedInId || res.id;
              this.renderContent();
            },
            onClose: () => {
              this.renderContent();
            }
          });
          document.body.appendChild(modal.render());
        } else {
          this.activeMode = 'profiles';
          this.profilesFilterStatus = 'ALL';
          this.renderContent();
        }
      };
    });

    $$('.btn-view-inhouse-online').forEach(btn => {
      btn.onclick = () => {
        this.activeMode = 'profiles';
        this.profilesFilterStatus = 'CHECKED_IN';
        this.renderContent();
      };
    });

    const btnReturnToAll = $('btn-return-to-all-online');
    if (btnReturnToAll) {
      btnReturnToAll.onclick = () => {
        this.onlineFilterStatus = 'ALL';
        this.renderContent();
      };
    }

    const btnBackToPending = $('btn-back-to-pending-verify');
    if (btnBackToPending) {
      btnBackToPending.onclick = () => {
        this.onlineFilterStatus = 'PENDING_VERIFY';
        this.renderContent();
      };
    }

    $$('.btn-checkedin-open-folio').forEach(btn => {
      btn.onclick = () => {
        store.setNavTab('billing');
      };
    });

    $$('.btn-checkedin-view-crm, .btn-open-guest-crm').forEach(btn => {
      btn.onclick = (e) => {
        if (e) e.stopPropagation();
        const resId = btn.dataset.resId;
        const guestName = btn.dataset.guestName;
        this.openProfileDrawer(resId || guestName);
      };
    });

    const btnAutoFill = $('btn-onl-quick-autofill');
    if (btnAutoFill) {
      btnAutoFill.onclick = () => {
        const fName = $('onl-first-name');
        const lName = $('onl-last-name');
        const email = $('onl-email');
        const phone = $('onl-phone');
        const nat = $('onl-nationality');
        const req = $('onl-requests');
        if (fName) fName.value = 'Sarah';
        if (lName) lName.value = 'Mitchell';
        if (email) email.value = 's.mitchell@vanguard.com';
        if (phone) phone.value = '+1 (555) 382-9901';
        if (nat) nat.value = 'United Kingdom';
        if (req) req.value = 'High floor, ocean-facing, feather pillows.';
        store.showToast('Guest profile auto-filled from simulated web session.', 'info');
      };
    }

    // ── Online Form Step 1 ──────────────────────────────────────────────────
    const formOnline1 = $('form-online-step1');
    if (formOnline1) {
      formOnline1.onsubmit = (e) => {
        e.preventDefault();
        const fName = $('onl-first-name')?.value || '';
        const lName = $('onl-last-name')?.value || '';
        this.onlineData.firstName = fName;
        this.onlineData.lastName = lName;
        this.onlineData.guestName = `${fName} ${lName}`.trim();
        this.onlineData.email = $('onl-email')?.value || '';
        this.onlineData.phone = $('onl-phone')?.value || '';
        this.onlineData.checkInDate = $('onl-checkin')?.value || '';
        this.onlineData.checkOutDate = $('onl-checkout')?.value || '';
        this.onlineData.adults = Number($('onl-adults')?.value || 1);
        this.onlineData.children = Number($('onl-children')?.value || 0);
        this.onlineData.nationality = $('onl-nationality')?.value || '';
        this.onlineData.specialRequests = $('onl-requests')?.value || '';

        const d1 = new Date(this.onlineData.checkInDate);
        const d2 = new Date(this.onlineData.checkOutDate);
        const nights = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));
        this.onlineData.nights = nights;

        this.onlineStep = 2;
        this.renderContent();
      };
    }

    // ── Online Step 2 (Room & Rate) ─────────────────────────────────────────
    $$('.room-type-card').forEach(card => {
      card.onclick = () => {
        this.onlineData.roomTypeId = card.dataset.roomTypeId;
        this.onlineData.roomTypeName = card.dataset.roomTypeName;
        this.onlineData.ratePerNight = Number(card.dataset.basePrice);
        this.renderContent();
      };
    });

    $$('.rate-plan-card').forEach(card => {
      card.onclick = () => {
        this.onlineData.ratePlanId = card.dataset.planId;
        this.onlineData.ratePlanName = card.dataset.planName;
        const mult = Number(card.dataset.multiplier);
        const base = (store.state.roomTypes || []).find(r => r.id === this.onlineData.roomTypeId)?.basePrice || 480;
        this.onlineData.ratePerNight = Math.round(base * mult);
        this.renderContent();
      };
    });

    const btnOnlStep2Back = $('btn-onl-step2-back');
    if (btnOnlStep2Back) {
      btnOnlStep2Back.onclick = () => {
        this.onlineStep = 1;
        this.renderContent();
      };
    }

    const btnOnlStep2Next = $('btn-onl-step2-next');
    if (btnOnlStep2Next) {
      btnOnlStep2Next.onclick = () => {
        this.onlineStep = 3;
        this.renderContent();
      };
    }

    // ── Online Step 3 (Services) ────────────────────────────────────────────
    const btnOnlStep3Back = $('btn-onl-step3-back');
    if (btnOnlStep3Back) {
      btnOnlStep3Back.onclick = () => {
        this.onlineStep = 2;
        this.renderContent();
      };
    }

    const btnOnlStep3Next = $('btn-onl-step3-next');
    if (btnOnlStep3Next) {
      btnOnlStep3Next.onclick = () => {
        const checkedServices = [];
        $$('.onl-srv-check:checked').forEach(chk => {
          checkedServices.push({
            id: chk.dataset.srvId,
            name: chk.dataset.srvName,
            category: chk.dataset.srvCategory,
            price: Number(chk.dataset.srvPrice),
            status: 'Pending'
          });
        });
        this.onlineData.optionalServices = checkedServices;
        this.onlineStep = 4;
        this.renderContent();
      };
    }

    // ── Online Step 4 (Review) ──────────────────────────────────────────────
    const btnOnlStep4Back = $('btn-onl-step4-back');
    if (btnOnlStep4Back) {
      btnOnlStep4Back.onclick = () => {
        this.onlineStep = 3;
        this.renderContent();
      };
    }

    const btnOnlStep4Next = $('btn-onl-step4-next');
    if (btnOnlStep4Next) {
      btnOnlStep4Next.onclick = () => {
        this.onlineStep = 5;
        this.renderContent();
      };
    }

    // ── Online Step 5 (Payment) ─────────────────────────────────────────────
    const btnOnlStep5Back = $('btn-onl-step5-back');
    if (btnOnlStep5Back) {
      btnOnlStep5Back.onclick = () => {
        this.onlineStep = 4;
        this.renderContent();
      };
    }

    const formOnlinePay = $('form-online-payment');
    if (formOnlinePay) {
      formOnlinePay.onsubmit = (e) => {
        e.preventDefault();
        const simResult = $('onl-payment-sim-result')?.value || 'SUCCESS';
        const errAlert = $('onl-payment-error-alert');

        if (simResult === 'FAIL') {
          if (errAlert) errAlert.classList.remove('hidden');
          store.showToast('Payment declined by card gateway. Please try another card or resolve.', 'error');
          return;
        }

        if (errAlert) errAlert.classList.add('hidden');

        // Execute payment & create reservation in store
        const resResult = store.createOnlineBooking(this.onlineData);
        if (resResult.success) {
          this.onlineConfirmedRes = resResult.reservation;
          this.onlineStep = 6;
          this.renderContent();
        }
      };
    }

    // ── Online Step 6 (Confirmed actions) ───────────────────────────────────
    const btnOnlGoArrivals = $('btn-onl-go-arrivals');
    if (btnOnlGoArrivals) {
      btnOnlGoArrivals.onclick = () => {
        store.setNavTab('arrivals');
      };
    }

    const btnOnlNewBooking = $('btn-onl-new-booking');
    if (btnOnlNewBooking) {
      btnOnlNewBooking.onclick = () => {
        this.onlineStep = 1;
        this.onlineConfirmedRes = null;
        this.renderContent();
      };
    }

    // ── Walk-In Step 1 Document Extraction ─────────────────────────────────
    const scanWlkPass = $('btn-wlk-scan-passport');
    if (scanWlkPass) {
      scanWlkPass.onclick = () => {
        this.walkInData.guestName = 'Alexander Wright';
        this.walkInData.phone = '+44 7700 900456';
        this.walkInData.email = 'a.wright@vanguard-corp.co.uk';
        this.walkInData.nationality = 'United Kingdom';
        this.walkInData.docType = 'PASSPORT';
        this.walkInData.docNumber = `GB-${Math.floor(10000000 + Math.random() * 90000000)}`;
        this.walkInData.identityVerified = true;
        this.renderContent();
        store.showToast('✓ Passport scanned! Extracted guest details auto-filled.', 'success');
      };
    }

    const scanWlkAadhaar = $('btn-wlk-scan-aadhaar');
    if (scanWlkAadhaar) {
      scanWlkAadhaar.onclick = () => {
        this.walkInData.guestName = 'Rajesh V. Sharma';
        this.walkInData.phone = '+91 98450 12890';
        this.walkInData.email = 'rajesh.sharma@meridian-tech.in';
        this.walkInData.nationality = 'India';
        this.walkInData.docType = 'AADHAAR';
        this.walkInData.docNumber = `4582-9912-${Math.floor(1000 + Math.random() * 9000)}`;
        this.walkInData.identityVerified = true;
        this.renderContent();
        store.showToast('✓ Aadhaar Card scanned! Extracted guest details auto-filled.', 'success');
      };
    }

    const scanWlkId = $('btn-wlk-scan-id');
    if (scanWlkId) {
      scanWlkId.onclick = () => {
        this.walkInData.guestName = 'Kavita Menon';
        this.walkInData.phone = '+91 98200 66778';
        this.walkInData.email = 'kavita.menon@heritage.in';
        this.walkInData.nationality = 'India';
        this.walkInData.docType = 'NATIONAL_ID';
        this.walkInData.docNumber = `NID-${Math.floor(100000 + Math.random() * 900000)}`;
        this.walkInData.identityVerified = true;
        this.renderContent();
        store.showToast('✓ National ID scanned! Extracted guest details auto-filled.', 'success');
      };
    }

    const btnOnlExtractDoc = $('btn-onl-extract-doc');
    if (btnOnlExtractDoc) {
      btnOnlExtractDoc.onclick = () => {
        this.onlineData.firstName = 'Alexander';
        this.onlineData.lastName = 'Wright';
        this.onlineData.guestName = 'Alexander Wright';
        this.onlineData.email = 'a.wright@vanguard-corp.co.uk';
        this.onlineData.phone = '+44 7700 900456';
        this.onlineData.nationality = 'United Kingdom';
        this.onlineData.docType = 'PASSPORT';
        this.onlineData.docNumber = `GB-${Math.floor(10000000 + Math.random() * 90000000)}`;
        this.onlineData.docCountry = 'United Kingdom';
        this.onlineData.docExpiry = '2033-03-28';
        this.onlineData.docDob = '1987-03-29';
        this.onlineData.docAddress = '18 Kensington Palace Gardens, London W8 4QQ';
        this.onlineData.identityVerified = true;
        this.renderContent();
        store.showToast('✓ Online check-in document extracted & pre-filled!', 'success');
      };
    }

    const formWalkIn1 = $('form-walkin-step1');
    if (formWalkIn1) {
      formWalkIn1.onsubmit = (e) => {
        e.preventDefault();
        this.walkInData.guestName = $('wlk-name')?.value || '';
        this.walkInData.phone = $('wlk-phone')?.value || '';
        this.walkInData.email = $('wlk-email')?.value || '';
        this.walkInData.nationality = $('wlk-nationality')?.value || '';
        this.walkInData.checkInDate = $('wlk-checkin')?.value || '';
        this.walkInData.checkOutDate = $('wlk-checkout')?.value || '';
        this.walkInData.adults = Number($('wlk-adults')?.value || 1);

        const selRoomType = $('wlk-room-type');
        if (selRoomType) {
          this.walkInData.roomTypeId = selRoomType.value;
          const selectedOpt = selRoomType.options[selRoomType.selectedIndex];
          this.walkInData.roomTypeName = selectedOpt?.dataset?.name || 'Classic King Room';
          this.walkInData.rateDiscussed = Number(selectedOpt?.dataset?.price) || 280;
        }

        const d1 = new Date(this.walkInData.checkInDate);
        const d2 = new Date(this.walkInData.checkOutDate);
        this.walkInData.nights = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));

        this.walkInStep = 2;
        this.renderContent();
      };
    }

    // ── Walk-In Step 2 (Availability selection & alternatives) ──────────────
    $$('.wlk-room-choice').forEach(card => {
      card.onclick = () => {
        this.walkInData.selectedRoomNumber = card.dataset.roomId;
        this.renderContent();
      };
    });

    $$('.btn-wlk-alt-pick').forEach(btn => {
      btn.onclick = () => {
        this.walkInData.roomTypeId = btn.dataset.altType;
        this.walkInData.roomTypeName = btn.dataset.altName;
        this.walkInData.rateDiscussed = Number(btn.dataset.altPrice);
        store.showToast(`Alternative category accepted: ${btn.dataset.altName}`, 'info');
        this.renderContent();
      };
    });

    const btnWlkStep2Back = $('btn-wlk-step2-back');
    if (btnWlkStep2Back) {
      btnWlkStep2Back.onclick = () => {
        this.walkInStep = 1;
        this.renderContent();
      };
    }

    const btnWlkStep2Next = $('btn-wlk-step2-next');
    if (btnWlkStep2Next) {
      btnWlkStep2Next.onclick = () => {
        this.walkInStep = 3;
        this.renderContent();
      };
    }

    // ── Walk-In Step 3 (Discuss Room & Rate) ────────────────────────────────
    const rateInput = $('wlk-rate-input');
    if (rateInput) {
      rateInput.oninput = () => {
        this.walkInData.rateDiscussed = Number(rateInput.value) || 0;
        const subtotal = this.walkInData.rateDiscussed * this.walkInData.nights;
        const disp = $('wlk-subtotal-disp');
        if (disp) disp.textContent = `$${subtotal}`;
      };
    }

    const btnWlkStep3Back = $('btn-wlk-step3-back');
    if (btnWlkStep3Back) {
      btnWlkStep3Back.onclick = () => {
        this.walkInStep = 2;
        this.renderContent();
      };
    }

    const btnWlkStep3Next = $('btn-wlk-step3-next');
    if (btnWlkStep3Next) {
      btnWlkStep3Next.onclick = () => {
        const acceptRadio = root.querySelector('input[name="wlk-guest-accept"]:checked');
        const accepted = acceptRadio ? acceptRadio.value === 'YES' : true;
        this.walkInData.guestAcceptedRate = accepted;

        if (!accepted) {
          store.showToast('Guest declined rate. Please offer alternative room category or discuss adjustment.', 'warning');
          return;
        }

        const reqInput = $('wlk-requests');
        if (reqInput) this.walkInData.specialRequests = reqInput.value;

        this.walkInStep = 4;
        this.renderContent();
      };
    }

    // ── Walk-In Step 4 (Stay Services & Amenities Add-Ons Before Payment) ──
    const btnWlkStep4Back = $('btn-wlk-step4-back');
    if (btnWlkStep4Back) {
      btnWlkStep4Back.onclick = () => {
        this.walkInStep = 3;
        this.renderContent();
      };
    }

    $$('.wlk-srv-checkbox').forEach(chk => {
      chk.onchange = () => {
        const current = [...(this.walkInData.optionalServices || [])];
        const srvName = chk.dataset.srvName;
        if (chk.checked) {
          if (!current.some(s => s.name === srvName)) {
            current.push({
              id: chk.dataset.srvId || `srv-${Date.now()}`,
              name: srvName,
              category: chk.dataset.srvCat || 'Amenity',
              price: Number(chk.dataset.srvPrice) || 0,
              status: 'Pending'
            });
          }
        } else {
          const idx = current.findIndex(s => s.name === srvName);
          if (idx !== -1) current.splice(idx, 1);
        }
        this.walkInData.optionalServices = current;
        this.renderContent();
      };
    });

    const btnWlkAddCustom = $('btn-wlk-add-custom-srv');
    if (btnWlkAddCustom) {
      btnWlkAddCustom.onclick = () => {
        const nameInput = $('input-wlk-custom-name');
        const priceInput = $('input-wlk-custom-price');
        const name = nameInput?.value.trim();
        const price = Number(priceInput?.value) || 0;
        if (!name) {
          store.showToast('Please enter a service or amenity description.', 'warning');
          return;
        }
        this.walkInData.optionalServices = this.walkInData.optionalServices || [];
        this.walkInData.optionalServices.push({
          id: `srv-custom-${Date.now()}`,
          name: name,
          category: 'Custom Service',
          price: price,
          status: 'Pending'
        });
        store.showToast(`Added service: ${name} (+$${price})`, 'success');
        this.renderContent();
      };
    }

    const btnWlkStep4Next = $('btn-wlk-step4-next');
    if (btnWlkStep4Next) {
      btnWlkStep4Next.onclick = () => {
        this.walkInStep = 5;
        this.renderContent();
      };
    }

    // ── Walk-In Step 5 (Payment Collection) ─────────────────────────────────
    const btnWlkStep5Back = $('btn-wlk-step5-back');
    if (btnWlkStep5Back) {
      btnWlkStep5Back.onclick = () => {
        this.walkInStep = 4;
        this.renderContent();
      };
    }

    const formWlkPay = $('form-walkin-payment');
    if (formWlkPay) {
      formWlkPay.onsubmit = (e) => {
        e.preventDefault();
        const payStatus = $('wlk-pay-status-choice')?.value || 'PAID';
        const errAlert = $('wlk-pay-error');

        if (payStatus === 'FAILED') {
          if (errAlert) errAlert.classList.remove('hidden');
          store.showToast('Walk-In payment could not be authorized.', 'error');
          return;
        }

        if (errAlert) errAlert.classList.add('hidden');

        const roomSubtotal = this.walkInData.rateDiscussed * this.walkInData.nights;
        const srvSubtotal = (this.walkInData.optionalServices || []).reduce((sum, s) => sum + Number(s.price || 0), 0);
        const taxes = Math.round((roomSubtotal + srvSubtotal) * 0.1);
        const grandTotal = roomSubtotal + srvSubtotal + taxes;

        this.walkInData.paymentMethod = $('wlk-pay-method')?.value || 'Credit Card (Front Desk POS)';
        this.walkInData.totalAmount = grandTotal;
        this.walkInData.paidAmount = grandTotal;

        const resResult = store.createWalkInBooking(this.walkInData);
        if (resResult.success) {
          this.walkInConfirmedRes = resResult.reservation;
          this.walkInStep = 6;
          this.renderContent();
        }
      };
    }

    // ── Walk-In Step 6 (Confirmed Next Actions) ─────────────────────────────
    const btnWlkProceedVerify = $('btn-wlk-proceed-verify');
    if (btnWlkProceedVerify) {
      btnWlkProceedVerify.onclick = () => {
        const targetRes = this.walkInConfirmedRes;
        if (targetRes) {
          const modal = new CheckInModal({
            reservation: targetRes,
            onCheckedIn: (checkedInId) => {
              this.activeMode = 'profiles';
              this.profilesFilterStatus = 'CHECKED_IN';
              this.recentlyCheckedInId = checkedInId || targetRes.id;
              this.newlyCheckedInResId = checkedInId || targetRes.id;
              store.showToast(`✓ Check-in completed! Viewing active in-house profile for ${targetRes.guestName}.`, 'success');
              this.renderContent();
            },
            onSuccess: (checkedInId) => {
              this.activeMode = 'profiles';
              this.profilesFilterStatus = 'CHECKED_IN';
              this.recentlyCheckedInId = checkedInId || targetRes.id;
              this.newlyCheckedInResId = checkedInId || targetRes.id;
              this.renderContent();
            },
            onClose: () => {
              this.renderContent();
            }
          });
          document.body.appendChild(modal.render());
        } else {
          this.activeMode = 'profiles';
          this.renderContent();
        }
      };
    }

    const btnWlkNewWalkIn = $('btn-wlk-new-walkin');
    if (btnWlkNewWalkIn) {
      btnWlkNewWalkIn.onclick = () => {
        this.walkInStep = 1;
        this.walkInConfirmedRes = null;
        this.walkInData.optionalServices = [];
        this.renderContent();
      };
    }

    // ── Profiles (Arrivals & Checked-In Profiles) Event Listeners ───────────
    const profilesSearch = $('profiles-search-input');
    if (profilesSearch) {
      profilesSearch.oninput = () => {
        this.profilesSearchQuery = profilesSearch.value;
        this.renderContent();
        const inputAfter = $('profiles-search-input');
        if (inputAfter) {
          inputAfter.focus();
          inputAfter.setSelectionRange(inputAfter.value.length, inputAfter.value.length);
        }
      };
    }

    $$('.btn-profiles-filter').forEach(btn => {
      btn.onclick = () => {
        this.profilesFilterStatus = btn.dataset.filter;
        this.renderContent();
      };
    });

    $$('.btn-profiles-back-arrivals').forEach(btn => {
      btn.onclick = () => {
        this.profilesFilterStatus = 'ALL';
        this.renderContent();
      };
    });

    $$('.btn-profiles-open-folio').forEach(btn => {
      btn.onclick = () => {
        store.setNavTab('billing');
      };
    });

    $$('.btn-open-guest-crm, .btn-checkedin-view-crm').forEach(btn => {
      btn.onclick = (e) => {
        if (e) e.stopPropagation();
        const resId = btn.dataset.resId;
        const guestName = btn.dataset.guestName;
        this.openProfileDrawer(resId || guestName);
      };
    });

    const btnProfilesWalkIn = $('btn-profiles-empty-walkin');
    if (btnProfilesWalkIn) {
      btnProfilesWalkIn.onclick = () => {
        const modal = new NewBookingModal({
          onCreated: () => {
            this.activeMode = 'profiles';
            this.profilesFilterStatus = 'WALK_IN';
            this.renderContent();
          }
        });
        document.body.appendChild(modal.render());
      };
    }

    // 1. Contextual Action: Verify ID
    $$('.btn-profiles-verify-id').forEach(btn => {
      btn.onclick = (e) => {
        if (e) e.stopPropagation();
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

    // 2. Contextual Action: Room Readiness & Assignment
    $$('.btn-profiles-check-room').forEach(btn => {
      btn.onclick = (e) => {
        if (e) e.stopPropagation();
        const resId = btn.dataset.resId;
        const res = (store.state.reservations || []).find(r => r.id === resId);
        if (!res) return;

        const initialRoom = btn.dataset.room || '204';
        const modal = new RoomReadinessModal({
          reservation: res,
          initialRoomNumber: initialRoom,
          onAssigned: () => {
            this.renderContent();
          }
        });
        document.body.appendChild(modal.render());
      };
    });

    // 3. Contextual Action: Check-In Gate & Key Issuance
    $$('.btn-profiles-checkin').forEach(btn => {
      btn.onclick = (e) => {
        if (e) e.stopPropagation();
        const resId = btn.dataset.resId;
        const res = (store.state.reservations || []).find(r => r.id === resId);
        if (!res) return;

        const modal = new CheckInModal({
          reservation: res,
          onCheckedIn: (checkedInId) => {
            this.activeMode = 'profiles';
            this.profilesFilterStatus = 'CHECKED_IN';
            this.recentlyCheckedInId = checkedInId || res.id;
            this.newlyCheckedInResId = checkedInId || res.id;
            store.showToast(`✓ Check-in completed! Viewing active in-house profile for ${res.guestName}.`, 'success');
            this.renderContent();
          },
          onSuccess: (checkedInId) => {
            this.activeMode = 'profiles';
            this.profilesFilterStatus = 'CHECKED_IN';
            this.recentlyCheckedInId = checkedInId || res.id;
            this.newlyCheckedInResId = checkedInId || res.id;
            this.renderContent();
          }
        });
        document.body.appendChild(modal.render());
      };
    });

    // Helper to launch Departure & Check-Out Protocol Gateway
    const triggerCheckoutProcedure = (res) => {
      if (!res) return;
      const modal = new CheckOutModal({
        reservation: res,
        onCheckedOut: (updatedRes) => {
          if (this.activeProfileDrawer?.id === updatedRes.id) {
            this.activeProfileDrawer = updatedRes;
          }
          this.activeCheckoutConfirm = false;
          this.renderContent();
        },
        onClose: () => {
          this.renderContent();
        }
      });
      document.body.appendChild(modal.render());
    };

    // 4. In-Card Direct Checkout Button -> Launch 5-Point Departure Protocol Modal
    $$('.btn-checkedin-card-checkout').forEach(btn => {
      btn.onclick = (e) => {
        if (e) e.stopPropagation();
        const resId = btn.dataset.resId;
        const res = (store.state.reservations || []).find(r => r.id === resId);
        if (res) {
          triggerCheckoutProcedure(res);
        }
      };
    });

    // 5. Profile Card Body Click -> Open Side Tab Drawer
    $$('[data-card-res-id]').forEach(card => {
      card.onclick = (e) => {
        if (e.target.closest('button') || e.target.closest('input')) return;
        const resId = card.dataset.cardResId;
        if (resId) {
          this.openProfileDrawer(resId);
        }
      };
    });

    // 6. Side Tab Drawer Interactive Controls
    const btnCloseProfileDrawer = $('btn-close-profile-drawer');
    if (btnCloseProfileDrawer) {
      btnCloseProfileDrawer.onclick = () => this.closeProfileDrawer();
    }
    const btnDrawerFooterClose = $('btn-drawer-footer-close');
    if (btnDrawerFooterClose) {
      btnDrawerFooterClose.onclick = () => this.closeProfileDrawer();
    }
    const profileDrawerBackdrop = $('profile-drawer-backdrop');
    if (profileDrawerBackdrop) {
      profileDrawerBackdrop.onclick = () => this.closeProfileDrawer();
    }

    // Drawer Checkout Buttons -> Launch Departure Protocol Modal
    const btnDrawerCheckoutTrigger = $('btn-drawer-checkout-trigger');
    if (btnDrawerCheckoutTrigger) {
      btnDrawerCheckoutTrigger.onclick = (e) => {
        if (e) e.preventDefault();
        const targetRes = (store.state.reservations || []).find(r => r.id === this.activeProfileDrawer?.id) || this.activeProfileDrawer;
        if (targetRes) {
          triggerCheckoutProcedure(targetRes);
        }
      };
    }
    const btnDrawerFooterCheckout = $('btn-drawer-footer-checkout');
    if (btnDrawerFooterCheckout) {
      btnDrawerFooterCheckout.onclick = (e) => {
        if (e) e.preventDefault();
        const targetRes = (store.state.reservations || []).find(r => r.id === this.activeProfileDrawer?.id) || this.activeProfileDrawer;
        if (targetRes) {
          triggerCheckoutProcedure(targetRes);
        }
      };
    }
    const btnDrawerCancelCheckout = $('btn-drawer-cancel-checkout');
    if (btnDrawerCancelCheckout) {
      btnDrawerCancelCheckout.onclick = () => {
        this.activeCheckoutConfirm = false;
        this.renderContent();
      };
    }
    const btnDrawerConfirmCheckout = $('btn-drawer-confirm-checkout');
    if (btnDrawerConfirmCheckout) {
      btnDrawerConfirmCheckout.onclick = () => {
        this.executeCheckoutFromDrawer();
      };
    }

    // Drawer Check-In Triggers (Both Top Header Button & Bottom Footer Button)
    const triggerDrawerCheckin = () => {
      const targetRes = (store.state.reservations || []).find(r => r.id === this.activeProfileDrawer?.id) || this.activeProfileDrawer;
      if (!targetRes) return;
      const modal = new CheckInModal({
        reservation: targetRes,
        onCheckedIn: (checkedInId) => {
          const updated = (store.state.reservations || []).find(r => r.id === (checkedInId || targetRes.id)) || targetRes;
          updated.status = 'Checked In';
          this.activeProfileDrawer = updated;
          this.profilesFilterStatus = 'CHECKED_IN';
          this.recentlyCheckedInId = checkedInId || targetRes.id;
          this.newlyCheckedInResId = checkedInId || targetRes.id;
          store.showToast(`✓ Check-in completed! Viewing active in-house profile for ${targetRes.guestName}.`, 'success');
          this.renderContent();
        },
        onSuccess: (checkedInId) => {
          const updated = (store.state.reservations || []).find(r => r.id === (checkedInId || targetRes.id)) || targetRes;
          updated.status = 'Checked In';
          this.activeProfileDrawer = updated;
          this.profilesFilterStatus = 'CHECKED_IN';
          this.recentlyCheckedInId = checkedInId || targetRes.id;
          this.newlyCheckedInResId = checkedInId || targetRes.id;
          this.renderContent();
        },
        onClose: () => {
          this.renderContent();
        }
      });
      document.body.appendChild(modal.render());
    };

    $$('#btn-drawer-checkin-trigger, #btn-drawer-footer-checkin, .btn-drawer-checkin-action').forEach(btn => {
      btn.onclick = (e) => {
        if (e) e.preventDefault();
        triggerDrawerCheckin();
      };
    });

    // Drawer Services Trigger
    const btnDrawerServices = $('btn-drawer-services');
    if (btnDrawerServices && this.activeProfileDrawer) {
      btnDrawerServices.onclick = () => {
        const targetRes = this.activeProfileDrawer;
        const modal = new OnlineServicesModal({
          reservation: targetRes,
          onServicesUpdated: () => {
            this.renderContent();
          },
          onProceedToCheckIn: (updatedRes) => {
            const finalRes = updatedRes || targetRes;
            const checkInModal = new CheckInModal({
              reservation: finalRes,
              onCheckedIn: (checkedInId) => {
                finalRes.status = 'Checked In';
                this.activeProfileDrawer = finalRes;
                this.profilesFilterStatus = 'CHECKED_IN';
                this.renderContent();
              }
            });
            document.body.appendChild(checkInModal.render());
          }
        });
        document.body.appendChild(modal.render());
      };
    }

    // Drawer Verify ID Trigger
    const btnDrawerVerifyId = $('btn-drawer-verify-id');
    if (btnDrawerVerifyId && this.activeProfileDrawer) {
      btnDrawerVerifyId.onclick = () => {
        const targetRes = this.activeProfileDrawer;
        const modal = new DocumentVerificationModal({
          reservation: targetRes,
          onVerified: () => {
            targetRes.identityVerified = true;
            this.renderContent();
          }
        });
        document.body.appendChild(modal.render());
      };
    }

    // Drawer Check / Assign Room Trigger
    const btnDrawerCheckRoom = $('btn-drawer-check-room');
    if (btnDrawerCheckRoom && this.activeProfileDrawer) {
      btnDrawerCheckRoom.onclick = () => {
        const targetRes = this.activeProfileDrawer;
        const modal = new RoomReadinessModal({
          reservation: targetRes,
          initialRoomNumber: targetRes.assignedRoom || targetRes.roomNumber || '204',
          onAssigned: (assignedRoom) => {
            targetRes.assignedRoom = assignedRoom;
            targetRes.roomNumber = assignedRoom;
            this.renderContent();
          }
        });
        document.body.appendChild(modal.render());
      };
    }

    // Drawer Folio Ledger Trigger
    $$('#btn-drawer-open-folio').forEach(btn => {
      btn.onclick = () => {
        store.setNavTab('billing');
      };
    });
  }
}
