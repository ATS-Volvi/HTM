// ==========================================================================
// VOLVITECH HOSPITALITY OS — NEW ONLINE BOOKING DETAILS MODAL
// Ingests, Simulates, and Enters Online Bookings with Pre-Collected Documents
// ==========================================================================

import { store } from '../../state/store.js';

export class NewOnlineBookingModal {
  constructor({ onCreated, onClose } = {}) {
    this.onCreated = onCreated;
    this.onClose = onClose;
    this.element = null;

    // Preset templates for instant 1-click auto-fill
    this.presets = [
      {
        id: 'sarah',
        label: 'Sarah Mitchell (UK · Ocean Suite · Passport)',
        icon: 'star',
        firstName: 'Sarah',
        lastName: 'Mitchell',
        guestName: 'Sarah Mitchell',
        email: 's.mitchell@vanguard.com',
        phone: '+44 20 7946 0912',
        nationality: 'United Kingdom',
        roomTypeId: 'rt-2',
        roomTypeName: 'Deluxe Ocean Suite',
        ratePlanId: 'BAR_FLEX',
        ratePlanName: 'Best Available Rate',
        ratePerNight: 480,
        nights: 3,
        adults: 2,
        children: 0,
        specialRequests: 'High floor, ocean-facing, feather pillows.',
        docType: 'PASSPORT',
        docNumber: 'GB-99214482',
        docCountry: 'United Kingdom',
        docExpiry: '2032-05-18',
        docDob: '1989-07-22',
        docAddress: '42 Kensington Gardens, London W8 4PX',
        channel: 'Direct Web (Online Booking Engine)',
        services: [
          { id: 'srv-opt-1', name: 'Airport luxury pickup', category: 'Transport', price: 90, status: 'Pending' },
          { id: 'srv-opt-2', name: 'Artisan Breakfast Buffet', category: 'Dining', price: 105, status: 'Pending' }
        ]
      },
      {
        id: 'marcus',
        label: 'Marcus Vance (US · Classic King · Solo Business)',
        icon: 'business_center',
        firstName: 'Marcus',
        lastName: 'Vance',
        guestName: 'Marcus Vance',
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
        specialRequests: 'Quiet room away from elevator. Early check-in requested if ready.',
        docType: 'DRIVERS_LICENSE',
        docNumber: 'DL-CA-992104',
        docCountry: 'United States',
        docExpiry: '2029-03-19',
        docDob: '1985-03-19',
        docAddress: '550 Howard St, San Francisco, CA 94105',
        channel: 'Expedia Partner Channel',
        services: []
      },
      {
        id: 'elena',
        label: 'Elena Rostova (Switzerland · Panoramic Suite · VIP Family)',
        icon: 'diamond',
        firstName: 'Elena',
        lastName: 'Rostova',
        guestName: 'Elena Rostova',
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
        specialRequests: 'Late arrival at 9:30 PM. Lake/ocean panorama view, welcome fruit platter.',
        docType: 'PASSPORT',
        docNumber: 'CH-88192041',
        docCountry: 'Switzerland',
        docExpiry: '2031-09-12',
        docDob: '1992-11-04',
        docAddress: 'Rue du Rhône 14, 1204 Genève',
        channel: 'Direct Web (Mobile App)',
        services: [
          { id: 'srv-opt-2', name: 'Artisan Breakfast Package', category: 'Dining', price: 120, status: 'Pending' },
          { id: 'srv-opt-3', name: 'Spa & Thermal Suite Pass', category: 'Wellness', price: 150, status: 'Pending' }
        ]
      },
      {
        id: 'sterling',
        label: 'Lord Alistair Sterling (UK · Royal Penthouse · Diplomatic)',
        icon: 'crown',
        firstName: 'Alistair',
        lastName: 'Sterling',
        guestName: 'Lord Alistair Sterling',
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
        specialRequests: 'VIP Diplomatic Protocol. Vintage Dom Pérignon on ice, private chauffeur airport pickup, fresh orchids.',
        docType: 'PASSPORT',
        docNumber: 'GB-DIP-004921',
        docCountry: 'United Kingdom',
        docExpiry: '2030-06-25',
        docDob: '1972-01-14',
        docAddress: 'Sterling Hall, Oxfordshire OX1 3QU',
        channel: 'Direct Web VIP Protocol',
        services: [
          { id: 'srv-opt-1', name: 'Airport luxury pickup', category: 'Transport', price: 90, status: 'Pending' },
          { id: 'srv-opt-3', name: 'Daily Spa & Thermal Access', category: 'Wellness', price: 350, status: 'Pending' }
        ]
      },
      {
        id: 'amara',
        label: 'Dr. Amara Okafor (Nigeria · Ocean Suite · Medical Exec)',
        icon: 'flight',
        firstName: 'Amara',
        lastName: 'Okafor',
        guestName: 'Dr. Amara Okafor',
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
        specialRequests: 'Late check-in at 8:00 PM. High-speed Wi-Fi token for medical symposium prep.',
        docType: 'PASSPORT',
        docNumber: 'NG-A10982341',
        docCountry: 'Nigeria',
        docExpiry: '2033-02-14',
        docDob: '1984-06-30',
        docAddress: '14 Victoria Island Way, Lagos',
        channel: 'Direct Web (Online Booking Engine)',
        services: [
          { id: 'srv-opt-4', name: 'Airport Luxury Transfer', category: 'Transport', price: 90, status: 'Pending' }
        ]
      }
    ];

    // Initial form state (defaults to Sarah Mitchell preset)
    const today = new Date();
    const dCheckIn = today.toISOString().substring(0, 10);
    const dOut = new Date(today);
    dOut.setDate(dOut.getDate() + 3);
    const dCheckOut = dOut.toISOString().substring(0, 10);

    this.data = {
      ...this.presets[0],
      checkInDate: dCheckIn,
      checkOutDate: dCheckOut
    };
  }

  render() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-scrim/60 backdrop-blur-sm animate-fadeIn overflow-y-auto';
    modal.id = 'modal-new-online-booking';
    this.element = modal;

    const nights = Math.max(1, this.data.nights || 3);
    const roomSubtotal = (this.data.ratePerNight || 480) * nights;
    const srvSubtotal = (this.data.services || []).reduce((acc, s) => acc + (Number(s.price) || 0), 0);
    const taxes = Math.round((roomSubtotal + srvSubtotal) * 0.1);
    const grandTotal = roomSubtotal + srvSubtotal + taxes;

    modal.innerHTML = `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-3xl shadow-xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        <!-- Header -->
        <div class="px-6 py-4 bg-primary text-on-primary flex items-center justify-between shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-on-primary">
              <span class="material-symbols-outlined text-[24px]">cloud_sync</span>
            </div>
            <div>
              <h3 class="text-base font-bold font-headline-sm">Add New Online Booking Details</h3>
              <p class="text-xs text-on-primary/80">In-take web reservation with pre-collected guest details and identity documents</p>
            </div>
          </div>
          <button id="btn-close-onl-modal" class="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-on-primary/90 hover:text-white cursor-pointer transition-colors">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Scrollable Form Body -->
        <div class="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          <!-- 1-Click Realistic Presets Banner -->
          <div class="p-4 rounded-xl bg-surface-bright border border-outline-variant/70">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px] text-amber-600">bolt</span>
                <span>Quick Fill from Realistic Online Presets</span>
              </span>
              <span class="text-[10px] text-on-surface-variant font-medium">Click to populate complete pre-collected details</span>
            </div>
            <div class="flex flex-wrap gap-2">
              ${this.presets.map(p => `
                <button 
                  type="button" 
                  class="btn-onl-preset px-3 py-1.5 rounded-lg border border-outline-variant text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    this.data.id === p.id 
                      ? 'bg-primary text-on-primary border-primary shadow-xs' 
                      : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                  }"
                  data-preset-id="${p.id}"
                >
                  <span class="material-symbols-outlined text-[14px]">${p.icon}</span>
                  <span>${p.firstName} ${p.lastName}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <form id="form-new-online-booking" class="space-y-6">
            <!-- Section 1: Guest Information -->
            <div class="space-y-3">
              <h4 class="text-xs font-bold uppercase font-label-caps text-primary border-b border-outline-variant/60 pb-1.5 flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px] text-primary">person</span>
                <span>1. Guest Profile & Contact Information</span>
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label class="block font-semibold text-on-surface mb-1">First Name *</label>
                  <input type="text" id="nob-fname" required value="${this.data.firstName || ''}" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright font-medium text-xs">
                </div>
                <div>
                  <label class="block font-semibold text-on-surface mb-1">Last Name *</label>
                  <input type="text" id="nob-lname" required value="${this.data.lastName || ''}" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright font-medium text-xs">
                </div>
                <div>
                  <label class="block font-semibold text-on-surface mb-1">Email Address *</label>
                  <input type="email" id="nob-email" required value="${this.data.email || ''}" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright font-medium text-xs">
                </div>
                <div>
                  <label class="block font-semibold text-on-surface mb-1">Phone Number *</label>
                  <input type="text" id="nob-phone" required value="${this.data.phone || ''}" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright font-medium text-xs">
                </div>
                <div class="sm:col-span-2">
                  <label class="block font-semibold text-on-surface mb-1">Nationality / Country of Residence *</label>
                  <input type="text" id="nob-nationality" required value="${this.data.nationality || 'United Kingdom'}" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright font-medium text-xs">
                </div>
              </div>
            </div>

            <!-- Section 2: Stay & Room Reservation -->
            <div class="space-y-3">
              <h4 class="text-xs font-bold uppercase font-label-caps text-primary border-b border-outline-variant/60 pb-1.5 flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px] text-primary">hotel</span>
                <span>2. Stay Requirements & Room Category</span>
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
                <div class="sm:col-span-2">
                  <label class="block font-semibold text-on-surface mb-1">Check-In Date *</label>
                  <input type="date" id="nob-checkin" required value="${this.data.checkInDate || ''}" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright font-medium text-xs">
                </div>
                <div class="sm:col-span-2">
                  <label class="block font-semibold text-on-surface mb-1">Check-Out Date *</label>
                  <input type="date" id="nob-checkout" required value="${this.data.checkOutDate || ''}" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright font-medium text-xs">
                </div>
                <div>
                  <label class="block font-semibold text-on-surface mb-1">Adults</label>
                  <select id="nob-adults" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright font-semibold text-xs">
                    <option value="1" ${this.data.adults === 1 ? 'selected' : ''}>1 Adult</option>
                    <option value="2" ${this.data.adults === 2 || !this.data.adults ? 'selected' : ''}>2 Adults</option>
                    <option value="3" ${this.data.adults === 3 ? 'selected' : ''}>3 Adults</option>
                    <option value="4" ${this.data.adults === 4 ? 'selected' : ''}>4 Adults</option>
                  </select>
                </div>
                <div>
                  <label class="block font-semibold text-on-surface mb-1">Children</label>
                  <select id="nob-children" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright font-semibold text-xs">
                    <option value="0" ${!this.data.children ? 'selected' : ''}>0 Children</option>
                    <option value="1" ${this.data.children === 1 ? 'selected' : ''}>1 Child</option>
                    <option value="2" ${this.data.children === 2 ? 'selected' : ''}>2 Children</option>
                  </select>
                </div>
                <div class="sm:col-span-2">
                  <label class="block font-semibold text-on-surface mb-1">Room Category *</label>
                  <select id="nob-room-type" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright font-semibold text-xs">
                    <option value="rt-1" data-name="Classic King Room" data-price="280" ${this.data.roomTypeId === 'rt-1' ? 'selected' : ''}>Classic King Room ($280/night)</option>
                    <option value="rt-2" data-name="Deluxe Ocean Suite" data-price="480" ${this.data.roomTypeId === 'rt-2' ? 'selected' : ''}>Deluxe Ocean Suite ($480/night)</option>
                    <option value="rt-3" data-name="Executive Panoramic Suite" data-price="750" ${this.data.roomTypeId === 'rt-3' ? 'selected' : ''}>Executive Panoramic Suite ($750/night)</option>
                    <option value="rt-4" data-name="Presidential Royal Penthouse" data-price="2400" ${this.data.roomTypeId === 'rt-4' ? 'selected' : ''}>Presidential Royal Penthouse ($2,400/night)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Section 3: Pre-Collected Identity Document -->
            <div class="space-y-3">
              <div class="flex items-center justify-between border-b border-outline-variant/60 pb-1.5">
                <h4 class="text-xs font-bold uppercase font-label-caps text-primary flex items-center gap-2">
                  <span class="material-symbols-outlined text-[16px] text-emerald-600">badge</span>
                  <span>3. Pre-Collected Identification (Submitted Online)</span>
                </h4>
                <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center gap-1">
                  <span class="material-symbols-outlined text-[12px]">check_circle</span>
                  <span>Digital Scan Verified</span>
                </span>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label class="block font-semibold text-on-surface mb-1">Document Type *</label>
                  <select id="nob-doc-type" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright font-semibold text-xs">
                    <option value="PASSPORT" ${this.data.docType === 'PASSPORT' ? 'selected' : ''}>Passport</option>
                    <option value="DRIVERS_LICENSE" ${this.data.docType === 'DRIVERS_LICENSE' ? 'selected' : ''}>Driver's License</option>
                    <option value="NATIONAL_ID" ${this.data.docType === 'NATIONAL_ID' ? 'selected' : ''}>National ID Card</option>
                  </select>
                </div>
                <div>
                  <label class="block font-semibold text-on-surface mb-1">Document / Passport Number *</label>
                  <input type="text" id="nob-doc-num" required value="${this.data.docNumber || ''}" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright font-mono font-bold text-xs">
                </div>
                <div>
                  <label class="block font-semibold text-on-surface mb-1">Issuing Country *</label>
                  <input type="text" id="nob-doc-country" required value="${this.data.docCountry || 'United Kingdom'}" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright font-medium text-xs">
                </div>
                <div>
                  <label class="block font-semibold text-on-surface mb-1">Document Expiry Date *</label>
                  <input type="date" id="nob-doc-expiry" required value="${this.data.docExpiry || '2032-05-18'}" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright font-medium text-xs">
                </div>
                <div>
                  <label class="block font-semibold text-on-surface mb-1">Date of Birth</label>
                  <input type="date" id="nob-doc-dob" value="${this.data.docDob || '1989-07-22'}" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright font-medium text-xs">
                </div>
                <div>
                  <label class="block font-semibold text-on-surface mb-1">Extracted Home Address</label>
                  <input type="text" id="nob-doc-addr" value="${this.data.docAddress || '42 Kensington Gardens, London'}" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright font-medium text-xs">
                </div>
              </div>
            </div>

            <!-- Section 4: Pre-Selected Services & Amenities Add-Ons -->
            <div class="space-y-3">
              <h4 class="text-xs font-bold uppercase font-label-caps text-primary border-b border-outline-variant/60 pb-1.5 flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px] text-primary">room_service</span>
                <span>4. Pre-Selected Stay Services & Amenities</span>
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <label class="p-3 rounded-xl border border-outline-variant bg-surface-bright flex items-center justify-between cursor-pointer hover:bg-surface-container transition-colors">
                  <div class="flex items-center gap-2.5">
                    <input type="checkbox" class="nob-srv-check w-4 h-4 rounded text-primary" data-name="Artisan Breakfast Buffet" data-cat="Dining" data-price="35" data-per-night="true" ${this.data.services?.some(s => s.name.includes('Breakfast')) ? 'checked' : ''}>
                    <div>
                      <span class="font-bold text-primary block">Artisan Breakfast Buffet</span>
                      <span class="text-[10px] text-on-surface-variant">+$35 / night</span>
                    </div>
                  </div>
                  <span class="material-symbols-outlined text-[18px] text-amber-600">restaurant</span>
                </label>

                <label class="p-3 rounded-xl border border-outline-variant bg-surface-bright flex items-center justify-between cursor-pointer hover:bg-surface-container transition-colors">
                  <div class="flex items-center gap-2.5">
                    <input type="checkbox" class="nob-srv-check w-4 h-4 rounded text-primary" data-name="Airport Luxury Transfer" data-cat="Transport" data-price="90" ${this.data.services?.some(s => s.name.includes('Airport')) ? 'checked' : ''}>
                    <div>
                      <span class="font-bold text-primary block">Airport Luxury Transfer</span>
                      <span class="text-[10px] text-on-surface-variant">+$90 flat one-way</span>
                    </div>
                  </div>
                  <span class="material-symbols-outlined text-[18px] text-blue-600">directions_car</span>
                </label>

                <label class="p-3 rounded-xl border border-outline-variant bg-surface-bright flex items-center justify-between cursor-pointer hover:bg-surface-container transition-colors">
                  <div class="flex items-center gap-2.5">
                    <input type="checkbox" class="nob-srv-check w-4 h-4 rounded text-primary" data-name="Spa & Thermal Suite Pass" data-cat="Wellness" data-price="75" ${this.data.services?.some(s => s.name.includes('Spa')) ? 'checked' : ''}>
                    <div>
                      <span class="font-bold text-primary block">Spa & Thermal Suite Pass</span>
                      <span class="text-[10px] text-on-surface-variant">+$75 per person</span>
                    </div>
                  </div>
                  <span class="material-symbols-outlined text-[18px] text-emerald-600">spa</span>
                </label>

                <label class="p-3 rounded-xl border border-outline-variant bg-surface-bright flex items-center justify-between cursor-pointer hover:bg-surface-container transition-colors">
                  <div class="flex items-center gap-2.5">
                    <input type="checkbox" class="nob-srv-check w-4 h-4 rounded text-primary" data-name="Welcome Champagne & Fruit Platter" data-cat="F&B VIP" data-price="60" ${this.data.services?.some(s => s.name.includes('Champagne')) ? 'checked' : ''}>
                    <div>
                      <span class="font-bold text-primary block">Chilled Champagne on Arrival</span>
                      <span class="text-[10px] text-on-surface-variant">+$60 in-suite VIP setup</span>
                    </div>
                  </div>
                  <span class="material-symbols-outlined text-[18px] text-purple-600">wine_bar</span>
                </label>
              </div>
            </div>

            <!-- Section 5: Special Requests & Payment Status -->
            <div class="space-y-3">
              <h4 class="text-xs font-bold uppercase font-label-caps text-primary border-b border-outline-variant/60 pb-1.5 flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px] text-primary">credit_card</span>
                <span>5. Special Requests & Payment Guarantee</span>
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div class="sm:col-span-2">
                  <label class="block font-semibold text-on-surface mb-1">Guest Special Requests & Notes</label>
                  <input type="text" id="nob-requests" value="${this.data.specialRequests || ''}" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright font-medium text-xs" placeholder="e.g. High floor, quiet room, late check-in">
                </div>
                <div>
                  <label class="block font-semibold text-on-surface mb-1">Booking Channel</label>
                  <select id="nob-channel" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-bright font-semibold text-xs">
                    <option value="Direct Web (Online Booking Engine)">Direct Web (Booking Engine)</option>
                    <option value="Direct Web (Mobile App)">Direct Web (Mobile App)</option>
                    <option value="Direct Web VIP Protocol">Direct Web VIP Protocol</option>
                    <option value="Expedia / OTA Partner">Expedia / OTA Partner</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Live Summary Strip -->
            <div class="p-4 rounded-xl bg-surface-bright border border-outline-variant/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Online Pre-Paid Total</span>
                <div class="flex items-baseline gap-2">
                  <span class="text-xl font-bold font-headline-md font-data-mono text-primary" id="nob-total-disp">$${grandTotal}</span>
                  <span class="text-[11px] text-emerald-700 font-semibold">✓ Pre-authorized & Guaranteed</span>
                </div>
              </div>

              <div class="flex items-center gap-2.5 w-full sm:w-auto">
                <button type="button" id="btn-cancel-onl-modal" class="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container transition-all cursor-pointer">
                  Cancel
                </button>
                <button type="submit" id="btn-submit-onl-booking" class="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary/90 flex items-center justify-center gap-2 transition-all cursor-pointer">
                  <span class="material-symbols-outlined text-[18px]">cloud_upload</span>
                  <span>Create & Sync Online Booking</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;

    this.bindEvents();
    return modal;
  }

  bindEvents() {
    const root = this.element;
    if (!root) return;

    // Close handlers
    const close = () => {
      if (this.onClose) this.onClose();
      root.remove();
    };

    root.querySelector('#btn-close-onl-modal')?.addEventListener('click', close);
    root.querySelector('#btn-cancel-onl-modal')?.addEventListener('click', close);

    // Preset selection
    root.querySelectorAll('.btn-onl-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.dataset.presetId;
        const found = this.presets.find(p => p.id === pId);
        if (found) {
          this.data = {
            ...found,
            checkInDate: root.querySelector('#nob-checkin')?.value || this.data.checkInDate,
            checkOutDate: root.querySelector('#nob-checkout')?.value || this.data.checkOutDate
          };
          // Re-render modal in place
          const newEl = this.render();
          root.replaceWith(newEl);
        }
      });
    });

    // Form submit
    const form = root.querySelector('#form-new-online-booking');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const fName = root.querySelector('#nob-fname')?.value.trim() || '';
        const lName = root.querySelector('#nob-lname')?.value.trim() || '';
        const guestName = `${fName} ${lName}`.trim();
        const email = root.querySelector('#nob-email')?.value.trim() || '';
        const phone = root.querySelector('#nob-phone')?.value.trim() || '';
        const nationality = root.querySelector('#nob-nationality')?.value.trim() || 'International';

        const checkInDate = root.querySelector('#nob-checkin')?.value || '';
        const checkOutDate = root.querySelector('#nob-checkout')?.value || '';
        const adults = Number(root.querySelector('#nob-adults')?.value || 2);
        const children = Number(root.querySelector('#nob-children')?.value || 0);

        const selRoom = root.querySelector('#nob-room-type');
        const roomTypeId = selRoom?.value || 'rt-2';
        const opt = selRoom?.options[selRoom?.selectedIndex];
        const roomTypeName = opt?.dataset?.name || 'Deluxe Ocean Suite';
        const ratePerNight = Number(opt?.dataset?.price) || 480;

        const d1 = new Date(checkInDate);
        const d2 = new Date(checkOutDate);
        const nights = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)));

        // Pre-collected document
        const docType = root.querySelector('#nob-doc-type')?.value || 'PASSPORT';
        const docNumber = root.querySelector('#nob-doc-num')?.value.trim() || `DOC-${Date.now()}`;
        const docCountry = root.querySelector('#nob-doc-country')?.value.trim() || nationality;
        const docExpiry = root.querySelector('#nob-doc-expiry')?.value || '2032-05-18';
        const docDob = root.querySelector('#nob-doc-dob')?.value || '1990-01-01';
        const docAddress = root.querySelector('#nob-doc-addr')?.value || '';

        // Pre-selected services
        const services = [];
        root.querySelectorAll('.nob-srv-check:checked').forEach(chk => {
          const perNight = chk.dataset.perNight === 'true';
          const price = Number(chk.dataset.price) || 0;
          services.push({
            id: `srv-opt-${Date.now()}-${Math.floor(Math.random()*100)}`,
            name: chk.dataset.name,
            category: chk.dataset.cat,
            price: perNight ? price * nights : price,
            status: 'Pending'
          });
        });

        const specialRequests = root.querySelector('#nob-requests')?.value || '';
        const channel = root.querySelector('#nob-channel')?.value || 'Direct Web (Online Booking Engine)';

        const roomSubtotal = ratePerNight * nights;
        const srvSubtotal = services.reduce((acc, s) => acc + s.price, 0);
        const taxes = Math.round((roomSubtotal + srvSubtotal) * 0.1);
        const totalAmount = roomSubtotal + srvSubtotal + taxes;

        const payload = {
          firstName: fName,
          lastName: lName,
          guestName,
          email,
          phone,
          nationality,
          checkInDate,
          checkOutDate,
          nights,
          adults,
          children,
          roomTypeId,
          roomTypeName,
          ratePlanId: 'BAR_FLEX',
          ratePlanName: 'Best Available Rate',
          ratePerNight,
          totalAmount,
          paidAmount: totalAmount,
          paymentMethod: 'Credit Card (Online Pre-paid)',
          channel,
          specialRequests,
          optionalServices: services,
          onlineDocument: {
            documentType: docType,
            documentNumber: docNumber,
            issuingCountry: docCountry,
            expiryDate: docExpiry,
            dateOfBirth: docDob,
            extractedName: guestName.toUpperCase(),
            extractedAddress: docAddress,
            photoUploaded: true,
            submittedAt: new Date().toISOString()
          }
        };

        const result = store.createOnlineBooking(payload);
        if (result.success) {
          store.showToast(`✓ New Online Booking synced! Ref: ${result.reservation?.confirmationCode || ''}`, 'success');
          if (this.onCreated) this.onCreated(result.reservation);
          close();
        }
      });
    }
  }
}
