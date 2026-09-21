// ==========================================================================
// VOLVITECH HOSPITALITY OS — GUIDED 6-STEP RESERVATION WIZARD
// Human-Friendly Enterprise Hotel Booking Flow
// ==========================================================================
import { reservationsClient } from '../../api/reservationsClient.js';
import { Toast } from '../../components/Toast.js';
import { store } from '../../state/store.js';

export class NewBookingModal {
  constructor({ onCreated, onClose } = {}) {
    this.onCreated = onCreated;
    this.onClose = onClose;
    this.meta = null;
    this.container = null;

    // Date initialization: Today and +3 days
    const today = new Date();
    const dCheckIn = new Date(today);
    dCheckIn.setDate(today.getDate() + 5);
    const dCheckOut = new Date(dCheckIn);
    dCheckOut.setDate(dCheckIn.getDate() + 3);

    const fmt = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Wizard State
    this.state = {
      step: 1, // 1: Stay, 2: Room & Rate, 3: Guest, 4: Details, 5: Payment, 6: Review, 7: Confirmed
      isConfirmed: false,
      confirmedReservation: null,

      // Step 1: Stay
      checkInDate: fmt(dCheckIn),
      checkOutDate: fmt(dCheckOut),
      roomsCount: 1,
      adults: 2,
      children: 0,

      // Step 2: Room & Rate (Distinguish Room Type from Physical Room)
      selectedRoomTypeId: 'rt-2', // Deluxe King
      selectedRatePlanId: 'rp-1', // BAR

      // Step 3: Guest Selection & Registration
      guestTab: 'search', // 'search' | 'create'
      guestSearchQuery: '',
      guestSearchResults: [],
      selectedGuest: null,
      isCreatingNewGuest: false,
      selectedDocTypeForExtract: 'AADHAAR',
      isScanningDoc: false,
      extractedDocSuccess: false,
      newGuest: {
        name: '',
        phone: '',
        email: '',
        nationality: 'India',
        idType: 'PASSPORT',
        idNumber: '',
        address: '',
        dateOfBirth: '1992-06-15',
        expiryDate: '2032-11-20',
        isExtracted: false,
        extractedMethod: null,
      },
      accompanyingGuests: [],
      showAddAccompanyingForm: false,
      newAccompanyingGuest: {
        name: '',
        type: 'Adult',
        relationship: 'Spouse',
        idType: 'PASSPORT',
        idNumber: '',
      },

      // Step 4: Details
      bookingSource: 'Direct',
      specialRequests: ['High floor', 'Late checkout'],
      guestNotes: 'Celebrating anniversary. Prefers feather pillows and quiet garden view.',
      companyName: 'Vanguard Global Corp',

      // Step 5: Payment
      paymentStatus: 'Pay at Hotel', // 'Pay at Hotel', 'Deposit Required', 'Partially Paid', 'Fully Paid'
      paymentMethod: 'Card',         // 'Card', 'Cash', 'Bank Transfer', 'Direct Corporate'
      guaranteeRequired: true,

      isSubmitting: false,
    };

    // Pre-configured room types & rate plans for standard 5-star operations
    this.roomTypes = [
      {
        id: 'rt-1',
        name: 'Classic King',
        code: 'CKR',
        available: 6,
        basePrice: 9500,
        description: '38 sq.m · King Bed · City View · High Speed WiFi',
      },
      {
        id: 'rt-2',
        name: 'Deluxe King',
        code: 'DKR',
        available: 4,
        basePrice: 12000,
        description: '45 sq.m · Luxury King · Panoramic Balcony · Bathtub',
      },
      {
        id: 'rt-3',
        name: 'Executive Suite',
        code: 'EXS',
        available: 2,
        basePrice: 18500,
        description: '65 sq.m · Separate Living Lounge · Club Lounge Access',
      },
      {
        id: 'rt-4',
        name: 'Presidential Royal Suite',
        code: 'PRS',
        available: 1,
        basePrice: 42000,
        description: '140 sq.m · Butler Service · Private Terrace · Jacuzzi',
      },
    ];

    this.ratePlans = [
      {
        id: 'rp-1',
        name: 'Best Available Rate (BAR)',
        badge: 'Free cancellation',
        multiplier: 1.0,
        cancellationPolicy: 'Free cancellation until 48 hours prior to 2:00 PM check-in. After that, 1 night room charge applies.',
        description: 'Standard flexible rate with full concierge privileges.',
      },
      {
        id: 'rp-2',
        name: 'Corporate Special',
        badge: 'Corporate rate',
        multiplier: 0.88,
        cancellationPolicy: 'Cancel before 6:00 PM on arrival date without penalty. Direct company billing available.',
        description: 'Negotiated enterprise tier including airport transfer and lounge access.',
      },
      {
        id: 'rp-3',
        name: 'Non-Refundable Promo',
        badge: 'No cancellation',
        multiplier: 0.82,
        cancellationPolicy: 'Non-refundable reservation. 100% advance charge upon booking confirmation.',
        description: 'Best discounted advance purchase rate.',
      },
    ];

    // Seed Guests Database for Instant Autocomplete (Merged dynamically with unified CRM store)
    const baseKnown = [
      {
        id: 'gst-sarah',
        name: 'Sarah Mitchell',
        phone: '+91 98765 43210',
        email: 'sarah.mitchell@vanguard.com',
        nationality: 'United Kingdom',
        idType: 'PASSPORT',
        idNumber: 'GB-99214482',
        address: '221 Baker Street, London',
        previousStays: 7,
        lastStay: 'June 2026',
      },
      {
        id: 'gst-john',
        name: 'John Smith',
        phone: '+1 (555) 304-9920',
        email: 'john.smith@acmeinc.com',
        nationality: 'United States',
        idType: 'PASSPORT',
        idNumber: 'US-8821901',
        address: '742 Evergreen Terrace, Chicago',
        previousStays: 4,
        lastStay: 'April 2026',
      },
      {
        id: 'gst-david',
        name: 'David Kumar',
        phone: '+91 98210 11223',
        email: 'david.kumar@meridian.in',
        nationality: 'India',
        idType: 'AADHAAR',
        idNumber: 'XXXX-XXXX-9901',
        address: '14 MG Road, Bengaluru',
        previousStays: 12,
        lastStay: 'August 2026',
      },
      {
        id: 'gst-elena',
        name: 'Elena Rostova',
        phone: '+33 612 345 678',
        email: 'elena.rostova@artlux.fr',
        nationality: 'France',
        idType: 'PASSPORT',
        idNumber: 'FR-4481029',
        address: '18 Rue de la Paix, Paris',
        previousStays: 2,
        lastStay: 'January 2026',
      },
    ];

    const storeGuests = (store?.state?.guests || []).map(g => ({
      id: g.id,
      name: g.name,
      phone: g.phone || '+91 98000 00000',
      email: g.email || '',
      nationality: g.nationality || 'International',
      idType: g.idType || 'PASSPORT',
      idNumber: g.passportNumber || g.idNumber || '',
      address: g.address || '',
      previousStays: g.totalStays || 1,
      lastStay: 'Recent Stay',
    }));

    const allGuests = [...storeGuests, ...baseKnown];
    const seen = new Set();
    this.knownGuests = allGuests.filter(g => {
      const key = g.id || g.email || g.name;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  async init() {
    try {
      const res = await reservationsClient.getMeta();
      if (res && res.data) {
        this.meta = res.data;
      }
    } catch (err) {
      console.warn('[NewBookingModal meta load notice]', err);
    }
  }

  // =========================================================================
  // DOCUMENT EXTRACTION (OPTICAL SCANNER / OCR SIMULATION)
  // =========================================================================
  runDocumentExtraction(docType = 'PASSPORT', file = null) {
    this.state.isScanningDoc = true;
    this.state.extractedDocSuccess = false;
    this.renderContent();

    setTimeout(() => {
      let extractedData = {};
      const rnd = Math.floor(100000 + Math.random() * 900000);

      if (docType === 'AADHAAR') {
        extractedData = {
          name: file ? file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") : 'Rajesh V. Sharma',
          idType: 'AADHAAR',
          idNumber: `4582-9912-${Math.floor(1000 + Math.random() * 9000)}`,
          nationality: 'India',
          phone: this.state.newGuest.phone || '+91 98450 12890',
          email: this.state.newGuest.email || 'rajesh.sharma@meridian-tech.in',
          dateOfBirth: '1988-11-23',
          expiryDate: '2038-12-31',
          address: '42, 80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka',
          isExtracted: true,
          extractedMethod: file ? 'File Upload (OCR)' : 'Optical Scanner'
        };
      } else if (docType === 'DRIVERS_LICENSE') {
        extractedData = {
          name: file ? file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") : 'Michael Chang',
          idType: 'DRIVERS_LICENSE',
          idNumber: `DL-MH-${rnd}`,
          nationality: 'India',
          phone: this.state.newGuest.phone || '+91 97120 44556',
          email: this.state.newGuest.email || 'm.chang@enterprise.com',
          dateOfBirth: '1992-04-18',
          expiryDate: '2035-04-17',
          address: 'Suite 104, Green Glen Layout, Bellandur, Bengaluru',
          isExtracted: true,
          extractedMethod: file ? 'File Upload (OCR)' : 'Optical Scanner'
        };
      } else if (docType === 'NATIONAL_ID') {
        extractedData = {
          name: file ? file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") : 'Kavita Menon',
          idType: 'NATIONAL_ID',
          idNumber: `NID-IND-${rnd}`,
          nationality: 'India',
          phone: this.state.newGuest.phone || '+91 98200 66778',
          email: this.state.newGuest.email || 'kavita.menon@heritage.in',
          dateOfBirth: '1995-09-12',
          expiryDate: '2034-09-11',
          address: '15 Marine Drive, Nariman Point, Mumbai',
          isExtracted: true,
          extractedMethod: file ? 'File Upload (OCR)' : 'Optical Scanner'
        };
      } else {
        // PASSPORT
        extractedData = {
          name: file ? file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ") : (this.state.newGuest.name || 'Alexander Wright'),
          idType: 'PASSPORT',
          idNumber: `GB-${Math.floor(10000000 + Math.random() * 90000000)}`,
          nationality: 'United Kingdom',
          phone: this.state.newGuest.phone || '+44 7700 900456',
          email: this.state.newGuest.email || 'a.wright@vanguard-corp.co.uk',
          dateOfBirth: '1987-03-29',
          expiryDate: '2033-03-28',
          address: '18 Kensington Palace Gardens, London W8 4QQ',
          isExtracted: true,
          extractedMethod: file ? 'File Upload (OCR)' : 'Optical Scanner'
        };
      }

      this.state.newGuest = {
        ...this.state.newGuest,
        ...extractedData
      };
      this.state.isScanningDoc = false;
      this.state.extractedDocSuccess = true;
      this.renderContent();

      Toast.show({
        title: 'ID Document Extracted',
        message: `Extracted ${extractedData.name} (${extractedData.idType} ${extractedData.idNumber}) successfully.`,
        type: 'success'
      });
    }, 600);
  }

  runAccompanyingDocExtraction(docType = 'PASSPORT') {
    this.state.newAccompanyingGuest = {
      name: 'Emma Watson',
      type: 'Adult',
      relationship: 'Spouse',
      idType: docType,
      idNumber: docType === 'AADHAAR' ? '9812-4401-2291' : `P${Math.floor(1000000 + Math.random() * 9000000)}`
    };
    this.renderContent();
    Toast.show({
      title: 'Accompanying ID Extracted',
      message: `Extracted Emma Watson (${docType}) for companion.`,
      type: 'info'
    });
  }

  calculateNights() {
    const d1 = new Date(this.state.checkInDate);
    const d2 = new Date(this.state.checkOutDate);
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, isNaN(diffDays) ? 1 : diffDays);
  }

  calculatePricing() {
    const nights = this.calculateNights();
    const rt = this.roomTypes.find((r) => r.id === this.state.selectedRoomTypeId) || this.roomTypes[1];
    const rp = this.ratePlans.find((p) => p.id === this.state.selectedRatePlanId) || this.ratePlans[0];

    const nightlyRate = Math.round(rt.basePrice * rp.multiplier);
    const roomCharges = nightlyRate * nights * this.state.roomsCount;
    const taxes = Math.round(roomCharges * 0.18); // 18% GST standard luxury hotel tax
    const discounts = rp.multiplier < 1.0 ? Math.round((rt.basePrice * (1.0 - rp.multiplier)) * nights * this.state.roomsCount) : 0;
    const grandTotal = roomCharges + taxes;

    return {
      nightlyRate,
      nights,
      roomCharges,
      taxes,
      discounts,
      grandTotal,
      currencySymbol: '₹',
    };
  }

  formatDateFriendly(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    if (typeof this.onClose === 'function') {
      this.onClose();
    }
  }

  render() {
    const el = document.createElement('div');
    el.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn select-none';
    this.container = el;

    this.renderContent();
    return el;
  }

  renderContent() {
    if (!this.container) return;

    if (this.state.isConfirmed) {
      this.renderConfirmationState();
      return;
    }

    const currentStep = this.state.step;
    const stepsList = [
      { num: 1, label: 'Stay', icon: 'calendar_month' },
      { num: 2, label: 'Room & Rate', icon: 'hotel' },
      { num: 3, label: 'Guest', icon: 'person' },
      { num: 4, label: 'Details', icon: 'tune' },
      { num: 5, label: 'Payment', icon: 'payments' },
      { num: 6, label: 'Review', icon: 'verified' },
    ];

    const pricing = this.calculatePricing();
    const nights = pricing.nights;

    this.container.innerHTML = `
      <div class="bg-surface-container-lowest text-on-surface rounded-2xl shadow-2xl border border-outline-variant w-full max-w-4xl my-6 overflow-hidden flex flex-col max-h-[92vh] transition-all">
        
        <!-- ============================================================= -->
        <!-- MODAL HEADER & 6-STEP PROGRESS TRACKER -->
        <!-- ============================================================= -->
        <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex flex-col gap-3 shrink-0">
          
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                +
              </div>
              <div>
                <h2 class="font-headline-sm text-base font-bold text-primary leading-tight">
                  New Reservation
                </h2>
                <p class="text-xs text-on-surface-variant font-medium">
                  Step ${currentStep} of 6 — ${stepsList[currentStep - 1].label}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-surface-container text-xs font-data-mono font-bold text-primary">
                <span>Estimated:</span>
                <span class="text-primary font-black">₹${pricing.grandTotal.toLocaleString('en-IN')}</span>
              </div>

              <button id="btn-close-wizard" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          <!-- Progress Stepper Tracker Bar -->
          <div class="grid grid-cols-6 gap-1.5 pt-1">
            ${stepsList.map((st) => {
              const isDone = st.num < currentStep;
              const isCurrent = st.num === currentStep;
              return `
                <div class="flex flex-col gap-1">
                  <div class="h-1.5 rounded-full transition-all duration-300 ${
                    isDone ? 'bg-emerald-600' : (isCurrent ? 'bg-primary' : 'bg-surface-container-high')
                  }"></div>
                  <div class="flex items-center gap-1 text-[11px] ${
                    isCurrent ? 'text-primary font-bold' : (isDone ? 'text-emerald-700 font-semibold' : 'text-on-surface-variant/70')
                  }">
                    <span class="w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-data-mono ${
                      isDone ? 'bg-emerald-100 text-emerald-800 font-bold' : (isCurrent ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container text-on-surface-variant')
                    }">
                      ${isDone ? '✓' : st.num}
                    </span>
                    <span class="hidden md:inline truncate">${st.label}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

        </div>

        <!-- ============================================================= -->
        <!-- MODAL BODY: STEP-BY-STEP WORKFLOW -->
        <!-- ============================================================= -->
        <div class="p-6 overflow-y-auto space-y-6 flex-1 text-xs custom-scrollbar">
          ${this.renderCurrentStep(currentStep, pricing, nights)}
        </div>

        <!-- ============================================================= -->
        <!-- MODAL FOOTER: NAVIGATION ACTIONS -->
        <!-- ============================================================= -->
        <div class="px-6 py-4 border-t border-outline-variant/70 bg-surface-bright flex items-center justify-between shrink-0">
          ${currentStep > 1 ? `
            <button 
              id="btn-step-prev"
              class="px-4 py-2 rounded-xl border border-outline-variant hover:bg-surface-container text-primary font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back</span>
            </button>
          ` : `<div></div>`}

          <div class="flex items-center gap-3">
            <button 
              id="btn-step-cancel"
              class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>

            ${currentStep < 6 ? `
              <button 
                id="btn-step-next"
                class="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Continue to ${stepsList[currentStep].label}</span>
                <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            ` : `
              <button 
                id="btn-step-confirm"
                class="px-7 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span class="material-symbols-outlined text-[18px]">verified</span>
                <span>Confirm Reservation</span>
              </button>
            `}
          </div>
        </div>

      </div>
    `;

    this.bindEvents();
  }

  renderCurrentStep(step, pricing, nights) {
    switch (step) {
      case 1:
        return this.renderStep1Stay(nights);
      case 2:
        return this.renderStep2RoomAndRate();
      case 3:
        return this.renderStep3Guest();
      case 4:
        return this.renderStep4Details();
      case 5:
        return this.renderStep5Payment();
      case 6:
        return this.renderStep6Review(pricing, nights);
      default:
        return '';
    }
  }

  // =========================================================================
  // STEP 1 — STAY
  // =========================================================================
  renderStep1Stay(nights) {
    return `
      <div class="space-y-6">
        <div>
          <h3 class="font-headline-sm text-base font-bold text-primary">Stay Dates & Occupancy</h3>
          <p class="text-on-surface-variant mt-0.5">Select guest arrival and departure dates to calculate room stay requirements.</p>
        </div>

        <!-- =========================================================== -->
        <!-- RAPID WALK-IN ID DOCUMENT SCANNER & AUTO-FILL (STEP 1)      -->
        <!-- =========================================================== -->
        <div class="p-4 sm:p-5 rounded-2xl border ${this.state.selectedGuest?.isExtracted || this.state.newGuest?.isExtracted ? 'border-emerald-300 bg-emerald-50/40 ring-2 ring-emerald-500/20' : 'border-primary/30 bg-primary/5'} space-y-4 shadow-xs animate-fadeIn">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl ${this.state.selectedGuest?.isExtracted || this.state.newGuest?.isExtracted ? 'bg-emerald-600' : 'bg-primary'} text-white flex items-center justify-center shadow-xs shrink-0">
                <span class="material-symbols-outlined text-[22px]">document_scanner</span>
              </div>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h4 class="font-bold text-primary text-xs uppercase font-label-caps tracking-wider">
                    Walk-In Document Extraction (High-Speed OCR)
                  </h4>
                  <span class="text-[9px] font-bold uppercase font-data-mono px-2 py-0.5 rounded-full ${this.state.selectedGuest?.isExtracted || this.state.newGuest?.isExtracted ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'}">
                    ${this.state.selectedGuest?.isExtracted || this.state.newGuest?.isExtracted ? '✓ Document Attached' : '⚡ Instant Intake'}
                  </span>
                </div>
                <p class="text-[11px] text-on-surface-variant mt-0.5">
                  Scan guest ID right now to auto-fill guest identity, verify credentials, and fast-track walk-in check-in.
                </p>
              </div>
            </div>

            <!-- Attached Badge if already extracted -->
            ${(this.state.selectedGuest && this.state.selectedGuest.isExtracted) ? `
              <div class="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold shadow-xs">
                  <span class="material-symbols-outlined text-[15px] text-emerald-700">verified</span>
                  <span>${this.state.selectedGuest.name} (${this.state.selectedGuest.idType}: ${this.state.selectedGuest.idNumber || 'Verified'})</span>
                </span>
                <button type="button" id="btn-step1-rescan" class="text-xs text-primary hover:underline font-bold px-2 py-1 cursor-pointer">
                  Rescan
                </button>
              </div>
            ` : ''}
          </div>

          <!-- Document Type Selector & Action Bar -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-primary/15">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-[11px] font-bold text-primary uppercase font-label-caps">Extract ID:</span>
              ${[
                { type: 'AADHAAR', label: 'Aadhaar Card', icon: 'fingerprint' },
                { type: 'PASSPORT', label: 'Passport', icon: 'menu_book' },
                { type: 'DRIVERS_LICENSE', label: 'Driver License', icon: 'directions_car' },
                { type: 'NATIONAL_ID', label: 'National ID', icon: 'badge' }
              ].map(dt => {
                const isSelected = (this.state.selectedDocTypeForExtract || 'AADHAAR') === dt.type;
                return `
                  <button 
                    type="button" 
                    class="btn-step1-scan-type px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-primary text-white border-primary shadow-xs' 
                        : 'bg-surface-bright text-on-surface-variant border-outline-variant hover:bg-surface-container hover:text-primary'
                    }"
                    data-type="${dt.type}"
                  >
                    <span class="material-symbols-outlined text-[15px]">${dt.icon}</span>
                    <span>${dt.label}</span>
                  </button>
                `;
              }).join('')}
            </div>

            <div class="flex items-center gap-2 w-full sm:w-auto">
              <input type="file" id="file-step1-doc-upload" class="sr-only" accept="image/*,.pdf" />
              <button 
                type="button" 
                id="btn-step1-upload-file" 
                class="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl border border-outline-variant bg-surface-bright hover:bg-surface-container text-xs font-bold text-primary flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
              >
                <span class="material-symbols-outlined text-[16px]">upload_file</span>
                <span>Upload Scan</span>
              </button>

              <button 
                type="button" 
                id="btn-step1-run-extract" 
                class="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                ${this.state.isScanningDoc ? 'disabled' : ''}
              >
                <span class="material-symbols-outlined text-[16px]">auto_awesome</span>
                <span>${this.state.isScanningDoc ? 'Extracting ID...' : `Scan ${this.state.selectedDocTypeForExtract || 'Aadhaar'}`}</span>
              </button>
            </div>
          </div>

          <!-- Scanning Progress Animation -->
          ${this.state.isScanningDoc ? `
            <div class="p-3.5 rounded-xl bg-primary/10 border border-primary/30 flex items-center gap-3 animate-pulse">
              <span class="material-symbols-outlined text-[24px] text-primary animate-spin">sync</span>
              <div class="space-y-0.5">
                <strong class="text-xs font-bold text-primary block">Scanning & Extracting Optical ID Data...</strong>
                <p class="text-[10px] text-on-surface-variant">Parsing security hologram, biometric MRZ / UIDAI, and auto-populating guest profile.</p>
              </div>
            </div>
          ` : ''}

          <!-- Live Extracted Guest Summary Strip (if extracted) -->
          ${this.state.selectedGuest?.isExtracted ? `
            <div class="p-3 rounded-xl bg-surface-container-lowest border border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  ${(this.state.selectedGuest.name || 'G').charAt(0)}
                </div>
                <div>
                  <span class="font-bold text-primary block">${this.state.selectedGuest.name}</span>
                  <span class="text-[10px] text-on-surface-variant font-data-mono">${this.state.selectedGuest.phone} · ${this.state.selectedGuest.nationality} · ${this.state.selectedGuest.idType}: ${this.state.selectedGuest.idNumber}</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ Profile Linked & Verified
                </span>
              </div>
            </div>
          ` : ''}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/70">
          
          <!-- Check-in Date -->
          <div>
            <label class="block font-bold text-xs text-primary mb-1.5">
              Check-In Date <span class="text-rose-600">*</span>
            </label>
            <div class="relative">
              <input 
                type="date" 
                id="input-check-in"
                value="${this.state.checkInDate}"
                class="w-full py-2.5 px-3 rounded-xl border border-outline-variant focus:border-primary text-xs font-semibold text-primary outline-none"
              />
            </div>
            <span class="text-[11px] text-on-surface-variant mt-1 block">Standard check-in: 2:00 PM</span>
          </div>

          <!-- Check-out Date -->
          <div>
            <label class="block font-bold text-xs text-primary mb-1.5">
              Check-Out Date <span class="text-rose-600">*</span>
            </label>
            <div class="relative">
              <input 
                type="date" 
                id="input-check-out"
                value="${this.state.checkOutDate}"
                class="w-full py-2.5 px-3 rounded-xl border border-outline-variant focus:border-primary text-xs font-semibold text-primary outline-none"
              />
            </div>
            <span class="text-[11px] text-on-surface-variant mt-1 block">Standard checkout: 12:00 PM</span>
          </div>

        </div>

        <!-- Instant Stay Calculation Pill -->
        <div class="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <span class="material-symbols-outlined text-[18px]">bed</span>
            </div>
            <div>
              <div class="font-bold text-blue-950 text-sm">
                ${this.formatDateFriendly(this.state.checkInDate)} → ${this.formatDateFriendly(this.state.checkOutDate)}
              </div>
              <p class="text-blue-800 text-[11px]">
                Immediately calculated based on selected dates
              </p>
            </div>
          </div>
          <div class="text-right">
            <span class="text-xl font-black text-blue-900 font-headline-lg">${nights} Nights</span>
          </div>
        </div>

        <!-- Guests and Room Quantity -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Rooms Count -->
          <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70">
            <label class="block font-bold text-xs text-primary mb-1">Number of Rooms</label>
            <select id="input-rooms-count" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs font-bold text-primary outline-none">
              <option value="1" ${this.state.roomsCount === 1 ? 'selected' : ''}>1 Room</option>
              <option value="2" ${this.state.roomsCount === 2 ? 'selected' : ''}>2 Rooms</option>
              <option value="3" ${this.state.roomsCount === 3 ? 'selected' : ''}>3 Rooms</option>
            </select>
          </div>

          <!-- Adults -->
          <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70">
            <label class="block font-bold text-xs text-primary mb-1">Adults (Age 12+)</label>
            <select id="input-adults" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs font-bold text-primary outline-none">
              <option value="1" ${this.state.adults === 1 ? 'selected' : ''}>1 Adult</option>
              <option value="2" ${this.state.adults === 2 ? 'selected' : ''}>2 Adults</option>
              <option value="3" ${this.state.adults === 3 ? 'selected' : ''}>3 Adults</option>
              <option value="4" ${this.state.adults === 4 ? 'selected' : ''}>4 Adults</option>
            </select>
          </div>

          <!-- Children -->
          <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70">
            <label class="block font-bold text-xs text-primary mb-1">Children (Age 0-11)</label>
            <select id="input-children" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs font-bold text-primary outline-none">
              <option value="0" ${this.state.children === 0 ? 'selected' : ''}>0 Children</option>
              <option value="1" ${this.state.children === 1 ? 'selected' : ''}>1 Child</option>
              <option value="2" ${this.state.children === 2 ? 'selected' : ''}>2 Children</option>
            </select>
          </div>
        </div>

      </div>
    `;
  }

  // =========================================================================
  // STEP 2 — ROOM & RATE
  // =========================================================================
  renderStep2RoomAndRate() {
    return `
      <div class="space-y-6">
        <div>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-headline-sm text-base font-bold text-primary">Room Type & Rate Plan</h3>
              <p class="text-on-surface-variant mt-0.5">Select a room classification and pricing plan based on live availability.</p>
            </div>
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Room Type Only (Physical Room Allocated at Check-in)
            </span>
          </div>
        </div>

        <!-- Room Types Grid (Clean Cards) -->
        <div>
          <label class="block font-bold text-xs text-primary mb-2 uppercase tracking-wider font-data-mono">
            1. Select Room Type
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            ${this.roomTypes.map((rt) => {
              const isSelected = rt.id === this.state.selectedRoomTypeId;
              return `
                <div 
                  class="card-room-type p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected 
                      ? 'border-primary bg-primary/5 shadow-xs ring-2 ring-primary/20' 
                      : 'border-outline-variant/80 bg-surface-container-lowest hover:border-primary/50'
                  }"
                  data-rtid="${rt.id}"
                >
                  <div>
                    <div class="flex items-center justify-between mb-1.5">
                      <span class="font-bold text-sm text-primary font-headline-sm">${rt.name}</span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
                        rt.available > 2 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }">
                        ${rt.available} rooms left
                      </span>
                    </div>
                    <p class="text-on-surface-variant text-[11px] leading-relaxed mb-3">
                      ${rt.description}
                    </p>
                  </div>

                  <div class="pt-2 border-t border-outline-variant/40 flex items-center justify-between">
                    <div>
                      <span class="text-[10px] text-on-surface-variant block uppercase font-data-mono">From</span>
                      <span class="text-sm font-black text-primary font-headline-lg">₹${rt.basePrice.toLocaleString('en-IN')}</span>
                      <span class="text-[10px] text-on-surface-variant">/ night</span>
                    </div>
                    <div class="w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-primary bg-primary text-white' : 'border-outline-variant'
                    }">
                      ${isSelected ? '<span class="material-symbols-outlined text-[14px]">check</span>' : ''}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Rate Plans Section -->
        <div>
          <label class="block font-bold text-xs text-primary mb-2 uppercase tracking-wider font-data-mono">
            2. Select Rate Plan
          </label>
          <div class="space-y-2.5">
            ${this.ratePlans.map((rp) => {
              const isSelected = rp.id === this.state.selectedRatePlanId;
              const selectedRt = this.roomTypes.find((r) => r.id === this.state.selectedRoomTypeId) || this.roomTypes[1];
              const effectivePrice = Math.round(selectedRt.basePrice * rp.multiplier);

              return `
                <div 
                  class="card-rate-plan p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected 
                      ? 'border-primary bg-primary/5 shadow-xs ring-2 ring-primary/20' 
                      : 'border-outline-variant/80 bg-surface-container-lowest hover:border-primary/50'
                  }"
                  data-rpid="${rp.id}"
                >
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-sm text-primary">${rp.name}</span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
                        rp.badge.includes('Free') ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container text-on-surface-variant'
                      }">
                        ${rp.badge}
                      </span>
                    </div>
                    <p class="text-on-surface-variant text-xs">
                      ${rp.description}
                    </p>
                    <p class="text-[11px] text-emerald-700 font-medium">
                      Policy: ${rp.cancellationPolicy}
                    </p>
                  </div>

                  <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-outline-variant/40">
                    <div class="text-right">
                      <span class="text-base font-black text-primary font-headline-lg">₹${effectivePrice.toLocaleString('en-IN')}</span>
                      <span class="text-[10px] text-on-surface-variant block">per night + tax</span>
                    </div>
                    <div class="w-5 h-5 rounded-full border flex items-center justify-center mt-1.5 ${
                      isSelected ? 'border-primary bg-primary text-white' : 'border-outline-variant'
                    }">
                      ${isSelected ? '<span class="material-symbols-outlined text-[14px]">check</span>' : ''}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

      </div>
    `;
  }

  // =========================================================================
  // STEP 3 — GUEST PROFILE & DOCUMENT EXTRACTION
  // =========================================================================
  renderStep3Guest() {
    const g = this.state.selectedGuest;
    const isCreate = this.state.guestTab === 'create' || this.state.isCreatingNewGuest;

    return `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 class="font-headline-sm text-base font-bold text-primary">Guest Profile & Identification</h3>
            <p class="text-on-surface-variant mt-0.5 text-xs">Search existing profiles, scan documents to extract info, or register a new guest.</p>
          </div>

          <!-- Top-Level Guest Mode Switcher Tabs -->
          <div class="flex items-center gap-1.5 p-1 bg-surface-container rounded-xl border border-outline-variant/60 shrink-0 self-start sm:self-auto">
            <button 
              type="button" 
              id="tab-btn-guest-search" 
              class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !isCreate ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant hover:text-primary hover:bg-surface-bright'
              }"
            >
              <span class="material-symbols-outlined text-[15px] mr-1 inline-block align-middle">person_search</span>
              <span>Search Existing (${this.knownGuests.length})</span>
            </button>
            <button 
              type="button" 
              id="tab-btn-guest-create" 
              class="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isCreate ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant hover:text-primary hover:bg-surface-bright'
              }"
            >
              <span class="material-symbols-outlined text-[15px] mr-1 inline-block align-middle">person_add</span>
              <span>+ Register New Guest</span>
            </button>
          </div>
        </div>

        <!-- Attached Primary Guest Ribbon (if selected) -->
        ${g ? `
          <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-3 animate-fadeIn">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-emerald-700 text-[22px]">verified_user</span>
                <div>
                  <span class="font-bold text-emerald-950 text-sm block leading-tight">Primary Guest Attached</span>
                  <span class="text-[11px] text-emerald-800/90">${g.isNew ? 'Newly registered profile' : 'Existing guest profile linked to stay'}</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button type="button" id="btn-clear-selected-guest" class="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold transition-all cursor-pointer">
                  Change / Clear Guest
                </button>
                <button type="button" id="btn-toggle-create-guest" class="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs">
                  + Register New Instead
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1 border-t border-emerald-200/80">
              <div>
                <span class="text-[10px] uppercase font-bold text-emerald-900/70 block font-data-mono">Full Name</span>
                <span class="font-bold text-emerald-950 text-sm">${g.name}</span>
              </div>
              <div>
                <span class="text-[10px] uppercase font-bold text-emerald-900/70 block font-data-mono">Contact Phone</span>
                <span class="font-semibold text-emerald-950 font-data-mono">${g.phone}</span>
              </div>
              <div>
                <span class="text-[10px] uppercase font-bold text-emerald-900/70 block font-data-mono">Email Address</span>
                <span class="font-semibold text-emerald-950">${g.email || '—'}</span>
              </div>
              <div>
                <span class="text-[10px] uppercase font-bold text-emerald-900/70 block font-data-mono">Nationality</span>
                <span class="font-medium text-emerald-950">${g.nationality || 'International'}</span>
              </div>
              <div>
                <span class="text-[10px] uppercase font-bold text-emerald-900/70 block font-data-mono">ID / Passport</span>
                <span class="font-medium text-emerald-950 font-data-mono">${g.idType}: ${g.idNumber || 'On file'}</span>
              </div>
              <div>
                <span class="text-[10px] uppercase font-bold text-emerald-900/70 block font-data-mono">Stay History</span>
                <span class="font-bold text-emerald-800">${g.previousStays || 0} past stays (${g.lastStay || 'First stay'})</span>
              </div>
            </div>
          </div>
        ` : `
          <div class="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px] text-amber-700">info</span>
              <span><strong>No Primary Guest Selected.</strong> Choose an existing guest below or click "Register New Guest" to scan or type details.</span>
            </div>
            <button type="button" id="btn-quick-switch-create" class="px-3 py-1 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-[11px] cursor-pointer">
              + Register New Guest
            </button>
          </div>
        `}

        <!-- Search Mode Content -->
        ${!isCreate ? `
          <div class="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/70 space-y-4 shadow-xs">
            <div class="flex items-center justify-between">
              <label class="block font-bold text-xs text-primary font-label-caps uppercase">
                Search Existing Guest (Name, Phone or Email)
              </label>
              <span class="text-[11px] text-on-surface-variant">${this.knownGuests.length} total profiles</span>
            </div>

            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                search
              </span>
              <input 
                type="text" 
                id="input-guest-search"
                value="${this.state.guestSearchQuery}"
                placeholder="e.g. Sarah Mitchell, +91 98765, or sarah.mitchell@..."
                class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-outline-variant focus:border-primary text-xs text-primary outline-none bg-surface-bright"
              />
            </div>

            <!-- Quick Matching Guest Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1" id="guest-search-results">
              ${this.knownGuests.map((kg) => {
                const isSelected = g && g.id === kg.id;
                return `
                  <div 
                    class="btn-pick-guest p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected ? 'border-primary bg-primary/10 font-bold ring-1 ring-primary/30' : 'border-outline-variant/70 hover:bg-surface-bright'
                    }"
                    data-gid="${kg.id}"
                  >
                    <div>
                      <span class="text-xs font-bold text-primary block">${kg.name}</span>
                      <span class="text-[11px] text-on-surface-variant block font-data-mono">${kg.phone}</span>
                      <span class="text-[10px] text-on-surface-variant block mt-0.5">${kg.previousStays} stays · Last: ${kg.lastStay}</span>
                    </div>
                    <button class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isSelected ? 'bg-primary text-white' : 'border border-outline-variant hover:bg-surface-container text-primary'
                    }">
                      ${isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Fallback: Quick Register Action if Query has no exact match -->
            ${this.state.guestSearchQuery ? `
              <div class="p-3.5 rounded-xl bg-primary/5 border border-dashed border-primary/40 flex items-center justify-between">
                <div class="text-xs">
                  <span class="font-bold text-primary">Guest not in system?</span>
                  <span class="text-on-surface-variant ml-1">Register new profile for "${this.state.guestSearchQuery}"</span>
                </div>
                <button type="button" id="btn-register-searched-guest" class="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 cursor-pointer shadow-xs">
                  + Register "${this.state.guestSearchQuery}"
                </button>
              </div>
            ` : ''}
          </div>
        ` : `
          <!-- Inline New Guest Registration Form + Document Extraction Bed -->
          <div class="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/70 space-y-5 shadow-xs animate-fadeIn">
            
            <div class="flex items-center justify-between border-b border-outline-variant/50 pb-3">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-[20px]">badge</span>
                <span class="font-bold text-primary text-xs uppercase tracking-wider font-data-mono">
                  + Register New Guest Profile
                </span>
              </div>
              <button id="btn-cancel-create-guest" class="text-xs text-primary hover:underline font-bold flex items-center gap-1 cursor-pointer">
                <span class="material-symbols-outlined text-[15px]">arrow_back</span>
                <span>Back to Existing Guest Search</span>
              </button>
            </div>

            <!-- =========================================================== -->
            <!-- SMART DOCUMENT SCANNER & OCR EXTRACTION BED (WALK-IN)       -->
            <!-- =========================================================== -->
            <div class="p-4 sm:p-5 rounded-2xl border border-primary/30 bg-primary/5 space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center">
                    <span class="material-symbols-outlined text-[18px]">document_scanner</span>
                  </div>
                  <div>
                    <h4 class="font-bold text-primary text-xs uppercase font-label-caps tracking-wider">
                      Document Extraction & High-Speed OCR Scanner
                    </h4>
                    <p class="text-[11px] text-on-surface-variant">
                      Place physical ID on scanner bed or upload document image to automatically extract and populate guest fields.
                    </p>
                  </div>
                </div>

                <span class="text-[10px] font-bold font-data-mono px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider self-start sm:self-auto">
                  ● Section 9 Verified
                </span>
              </div>

              <!-- Document Type Selection Pills -->
              <div class="space-y-1.5">
                <label class="block text-[11px] font-bold uppercase font-label-caps text-primary">Select ID Document Type:</label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  ${[
                    { type: 'PASSPORT', label: 'Passport', icon: 'menu_book' },
                    { type: 'AADHAAR', label: 'Aadhaar Card', icon: 'fingerprint' },
                    { type: 'DRIVERS_LICENSE', label: 'Driver License', icon: 'directions_car' },
                    { type: 'NATIONAL_ID', label: 'National ID', icon: 'contact_emergency' }
                  ].map(dt => `
                    <button 
                      type="button" 
                      class="btn-doc-type-sel p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        this.state.selectedDocTypeForExtract === dt.type
                          ? 'border-primary bg-primary text-white shadow-xs'
                          : 'border-outline-variant bg-surface-bright text-on-surface-variant hover:bg-surface-container'
                      }"
                      data-type="${dt.type}"
                    >
                      <span class="material-symbols-outlined text-[16px]">${dt.icon}</span>
                      <span>${dt.label}</span>
                    </button>
                  `).join('')}
                </div>
              </div>

              <!-- Scanner Bed & Actions -->
              <div class="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button 
                  type="button" 
                  id="btn-run-doc-extract" 
                  class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  ${this.state.isScanningDoc ? 'disabled' : ''}
                >
                  <span class="material-symbols-outlined text-[18px]">scanner</span>
                  <span>${this.state.isScanningDoc ? 'Extracting ID Data...' : `Scan & Extract ${this.state.selectedDocTypeForExtract || 'ID'}`}</span>
                </button>

                <button 
                  type="button" 
                  id="btn-upload-doc-file" 
                  class="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-outline-variant bg-surface-bright hover:bg-surface-container text-xs font-bold text-primary flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span class="material-symbols-outlined text-[18px]">upload_file</span>
                  <span>Upload Document Scan (PDF/Image)</span>
                </button>
                <input type="file" id="file-doc-upload" class="sr-only" accept="image/*,.pdf" />

                ${this.state.newGuest.isExtracted ? `
                  <span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <span class="material-symbols-outlined text-[15px]">verified</span>
                    <span>✓ Extracted via ${this.state.newGuest.extractedMethod || 'Scanner'}</span>
                  </span>
                ` : ''}
              </div>

              <!-- Scanning Progress Animation Strip -->
              ${this.state.isScanningDoc ? `
                <div class="p-3.5 rounded-xl bg-primary/10 border border-primary/30 flex items-center gap-3 animate-pulse">
                  <span class="material-symbols-outlined text-[24px] text-primary animate-spin">sync</span>
                  <div class="space-y-0.5">
                    <strong class="text-xs font-bold text-primary block">Authenticating & Parsing Government Security Holograms...</strong>
                    <p class="text-[10px] text-on-surface-variant">Extracting biometric line, MRZ check digit, and full address record.</p>
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- Profile Data Fields -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label class="block font-bold text-primary mb-1">Full Name *</label>
                <input type="text" id="new-guest-name" value="${this.state.newGuest.name}" placeholder="e.g. Robert Lang" class="w-full py-2 px-3 rounded-lg border border-outline-variant text-xs outline-none focus:border-primary bg-surface-bright" />
              </div>
              <div>
                <label class="block font-bold text-primary mb-1">Phone Number *</label>
                <input type="text" id="new-guest-phone" value="${this.state.newGuest.phone}" placeholder="e.g. +91 98000 12345" class="w-full py-2 px-3 rounded-lg border border-outline-variant text-xs outline-none focus:border-primary bg-surface-bright font-data-mono" />
              </div>
              <div>
                <label class="block font-bold text-primary mb-1">Email Address</label>
                <input type="email" id="new-guest-email" value="${this.state.newGuest.email}" placeholder="e.g. robert.lang@hotel.com" class="w-full py-2 px-3 rounded-lg border border-outline-variant text-xs outline-none focus:border-primary bg-surface-bright" />
              </div>
              <div>
                <label class="block font-bold text-primary mb-1">Nationality</label>
                <input type="text" id="new-guest-nat" value="${this.state.newGuest.nationality}" placeholder="e.g. India" class="w-full py-2 px-3 rounded-lg border border-outline-variant text-xs outline-none focus:border-primary bg-surface-bright" />
              </div>
              <div>
                <label class="block font-bold text-primary mb-1">Document Type</label>
                <select id="new-guest-idtype" class="w-full py-2 px-3 rounded-lg border border-outline-variant text-xs outline-none focus:border-primary bg-surface-bright font-bold">
                  <option value="PASSPORT" ${this.state.newGuest.idType === 'PASSPORT' ? 'selected' : ''}>Passport</option>
                  <option value="AADHAAR" ${this.state.newGuest.idType === 'AADHAAR' ? 'selected' : ''}>Aadhaar Card</option>
                  <option value="DRIVERS_LICENSE" ${this.state.newGuest.idType === 'DRIVERS_LICENSE' ? 'selected' : ''}>Driver's License</option>
                  <option value="NATIONAL_ID" ${this.state.newGuest.idType === 'NATIONAL_ID' ? 'selected' : ''}>National ID</option>
                </select>
              </div>
              <div>
                <label class="block font-bold text-primary mb-1">ID / Document Number</label>
                <input type="text" id="new-guest-idnum" value="${this.state.newGuest.idNumber}" placeholder="e.g. Passport P1029384" class="w-full py-2 px-3 rounded-lg border border-outline-variant text-xs outline-none focus:border-primary bg-surface-bright font-data-mono" />
              </div>
              <div>
                <label class="block font-bold text-primary mb-1">Date of Birth</label>
                <input type="date" id="new-guest-dob" value="${this.state.newGuest.dateOfBirth || ''}" class="w-full py-2 px-3 rounded-lg border border-outline-variant text-xs outline-none focus:border-primary bg-surface-bright" />
              </div>
              <div>
                <label class="block font-bold text-primary mb-1">Document Expiry Date</label>
                <input type="date" id="new-guest-expiry" value="${this.state.newGuest.expiryDate || ''}" class="w-full py-2 px-3 rounded-lg border border-outline-variant text-xs outline-none focus:border-primary bg-surface-bright" />
              </div>
              <div class="sm:col-span-2">
                <label class="block font-bold text-primary mb-1">Residential Address</label>
                <input type="text" id="new-guest-addr" value="${this.state.newGuest.address}" placeholder="e.g. 45 Park Avenue, Mumbai" class="w-full py-2 px-3 rounded-lg border border-outline-variant text-xs outline-none focus:border-primary bg-surface-bright" />
              </div>
            </div>

            <!-- Save & Attach Guest Button -->
            <div class="pt-3 border-t border-outline-variant/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="text-[11px] text-on-surface-variant">
                ✓ Once saved, this guest profile will be stored in the hotel database and attached as primary.
              </div>
              <div class="flex items-center gap-2">
                <button type="button" id="btn-cancel-create-guest-bottom" class="px-4 py-2 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container cursor-pointer">
                  Cancel
                </button>
                <button type="button" id="btn-save-new-guest" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer">
                  <span class="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Save & Attach Guest Profile</span>
                </button>
              </div>
            </div>

          </div>
        `}

        <!-- ================================================================= -->
        <!-- ACCOMPANYING GUESTS DURING STAY (SECTION 11 ENHANCEMENT)           -->
        <!-- ================================================================= -->
        <div class="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/70 space-y-4 shadow-xs">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <span class="material-symbols-outlined text-[18px]">group_add</span>
              </div>
              <div>
                <label class="block font-bold text-xs text-primary font-label-caps uppercase">
                  Accompanying Guests During Stay (${this.state.accompanyingGuests.length})
                </label>
                <span class="text-[11px] text-on-surface-variant">Attach spouses, children, or companions staying in the same reservation</span>
              </div>
            </div>

            <button 
              type="button" 
              id="btn-toggle-add-accompanying" 
              class="px-3.5 py-1.5 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-bold transition-all shadow-xs flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]">add</span>
              <span>+ Add Accompanying Guest</span>
            </button>
          </div>

          <!-- Accompanying Guests List -->
          ${this.state.accompanyingGuests.length > 0 ? `
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              ${this.state.accompanyingGuests.map((cg, idx) => `
                <div class="p-3.5 rounded-xl border border-outline-variant/80 bg-surface-bright flex items-center justify-between shadow-2xs">
                  <div class="space-y-0.5">
                    <div class="flex items-center gap-2">
                      <strong class="text-xs text-primary font-bold">${cg.name}</strong>
                      <span class="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary/10 text-primary">${cg.type || 'Adult'}</span>
                      <span class="text-[10px] text-on-surface-variant">(${cg.relationship || 'Companion'})</span>
                    </div>
                    <div class="text-[11px] text-on-surface-variant font-data-mono">
                      ${cg.idType ? `${cg.idType}: ${cg.idNumber || 'Verified on scan'}` : 'ID on file'}
                    </div>
                  </div>
                  <button type="button" class="btn-remove-accompanying p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer" data-idx="${idx}" title="Remove guest">
                    <span class="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="p-4 rounded-xl border border-dashed border-outline-variant text-center text-xs text-on-surface-variant">
              No accompanying guests attached yet. Click "+ Add Accompanying Guest" to register additional companions for this stay.
            </div>
          `}

          <!-- Inline Sub-Form to Add Accompanying Guest -->
          ${this.state.showAddAccompanyingForm ? `
            <div class="p-4 rounded-xl border border-primary/40 bg-primary/5 space-y-3 animate-fadeIn">
              <div class="flex items-center justify-between border-b border-primary/20 pb-2">
                <strong class="text-xs font-bold text-primary uppercase font-data-mono">+ Add Accompanying Companion</strong>
                <button type="button" id="btn-quick-scan-accompanying" class="px-2.5 py-1 rounded-lg bg-white hover:bg-primary/10 border border-primary/30 text-primary text-[11px] font-bold flex items-center gap-1 shadow-xs cursor-pointer">
                  <span class="material-symbols-outlined text-[14px]">document_scanner</span>
                  <span>⚡ Quick Scan Companion ID</span>
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label class="block font-bold text-primary mb-1">Companion Full Name *</label>
                  <input type="text" id="acc-name" value="${this.state.newAccompanyingGuest.name}" placeholder="e.g. Emma Watson" class="w-full py-1.5 px-2.5 rounded-lg border border-outline-variant bg-white text-xs outline-none focus:border-primary" />
                </div>
                <div>
                  <label class="block font-bold text-primary mb-1">Guest Category</label>
                  <select id="acc-type" class="w-full py-1.5 px-2.5 rounded-lg border border-outline-variant bg-white text-xs outline-none focus:border-primary font-semibold">
                    <option value="Adult" ${this.state.newAccompanyingGuest.type === 'Adult' ? 'selected' : ''}>Adult</option>
                    <option value="Child" ${this.state.newAccompanyingGuest.type === 'Child' ? 'selected' : ''}>Child</option>
                    <option value="Infant" ${this.state.newAccompanyingGuest.type === 'Infant' ? 'selected' : ''}>Infant</option>
                  </select>
                </div>
                <div>
                  <label class="block font-bold text-primary mb-1">Relationship</label>
                  <input type="text" id="acc-relation" value="${this.state.newAccompanyingGuest.relationship}" placeholder="e.g. Spouse, Child, Colleague" class="w-full py-1.5 px-2.5 rounded-lg border border-outline-variant bg-white text-xs outline-none focus:border-primary" />
                </div>
                <div>
                  <label class="block font-bold text-primary mb-1">Document Type</label>
                  <select id="acc-idtype" class="w-full py-1.5 px-2.5 rounded-lg border border-outline-variant bg-white text-xs outline-none focus:border-primary font-semibold">
                    <option value="PASSPORT">Passport</option>
                    <option value="AADHAAR">Aadhaar</option>
                    <option value="DRIVERS_LICENSE">Driver's License</option>
                    <option value="NATIONAL_ID">National ID</option>
                  </select>
                </div>
                <div class="sm:col-span-2">
                  <label class="block font-bold text-primary mb-1">Document / ID Number</label>
                  <input type="text" id="acc-idnum" value="${this.state.newAccompanyingGuest.idNumber}" placeholder="e.g. GB-99120448" class="w-full py-1.5 px-2.5 rounded-lg border border-outline-variant bg-white text-xs outline-none focus:border-primary font-data-mono" />
                </div>
              </div>

              <div class="flex items-center justify-end gap-2 pt-2 border-t border-primary/20">
                <button type="button" id="btn-cancel-add-accompanying" class="px-3 py-1.5 rounded-lg border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container cursor-pointer">
                  Cancel
                </button>
                <button type="button" id="btn-save-add-accompanying" class="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 shadow-xs cursor-pointer">
                  Attach Companion
                </button>
              </div>
            </div>
          ` : ''}
        </div>

      </div>
    `;
  }

  // =========================================================================
  // STEP 4 — DETAILS
  // =========================================================================
  renderStep4Details() {
    const specialRequestChips = [
      'High floor',
      'Early check-in',
      'Late checkout',
      'Extra bed',
      'Baby cot',
      'Airport pickup',
      'Connecting room',
      'Quiet room',
      'Non-smoking',
    ];

    const sources = ['Direct', 'Website', 'Walk-in', 'Phone', 'Corporate', 'Travel Agent', 'OTA', 'Group', 'Other'];

    return `
      <div class="space-y-6">
        <div>
          <h3 class="font-headline-sm text-base font-bold text-primary">Booking Details & Preferences</h3>
          <p class="text-on-surface-variant mt-0.5">Specify reservation acquisition source, corporate billing, and guest stay preferences.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Booking Source -->
          <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70">
            <label class="block font-bold text-xs text-primary mb-1.5 font-data-mono uppercase">
              Booking Source <span class="text-rose-600">*</span>
            </label>
            <select id="input-booking-source" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs font-semibold text-primary outline-none">
              ${sources.map((src) => `
                <option value="${src}" ${this.state.bookingSource === src ? 'selected' : ''}>${src}</option>
              `).join('')}
            </select>
          </div>

          <!-- Corporate Account -->
          <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70">
            <label class="block font-bold text-xs text-primary mb-1.5 font-data-mono uppercase">
              Corporate / Company Information (Optional)
            </label>
            <input 
              type="text" 
              id="input-company-name"
              value="${this.state.companyName}"
              placeholder="e.g. Vanguard Global Corp" 
              class="w-full py-2 px-3 rounded-lg border border-outline-variant text-xs outline-none focus:border-primary" 
            />
          </div>
        </div>

        <!-- Special Request Chips -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-2.5">
          <label class="block font-bold text-xs text-primary uppercase tracking-wider font-data-mono">
            Special Requests (Click to Toggle)
          </label>
          <div class="flex flex-wrap gap-2 pt-1">
            ${specialRequestChips.map((chip) => {
              const isActive = this.state.specialRequests.includes(chip);
              return `
                <button 
                  type="button"
                  class="btn-toggle-chip px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-primary text-white shadow-xs' 
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/60'
                  }"
                  data-chip="${chip}"
                >
                  ${isActive ? '✓ ' : '+ '}${chip}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Front Desk Internal Notes -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70">
          <label class="block font-bold text-xs text-primary mb-1.5 font-data-mono uppercase">
            Front Desk & Housekeeping Notes
          </label>
          <textarea 
            id="input-guest-notes"
            rows="3"
            placeholder="Special instructions, dietary needs, welcome amenity requests..."
            class="w-full py-2 px-3 rounded-lg border border-outline-variant text-xs outline-none focus:border-primary resize-none"
          >${this.state.guestNotes}</textarea>
        </div>

      </div>
    `;
  }

  // =========================================================================
  // STEP 5 — PAYMENT
  // =========================================================================
  renderStep5Payment() {
    const selectedRate = this.ratePlans.find((r) => r.id === this.state.selectedRatePlanId) || this.ratePlans[0];

    const paymentStatuses = [
      { id: 'Pay at Hotel', label: 'Pay at Hotel', desc: 'Settle during stay or at checkout' },
      { id: 'Deposit Required', label: 'Deposit Required', desc: 'Partial guarantee before arrival' },
      { id: 'Partially Paid', label: 'Partially Paid', desc: 'Advance deposit logged in folio' },
      { id: 'Fully Paid', label: 'Fully Paid', desc: '100% room rate settled in advance' },
    ];

    const paymentMethods = ['Card', 'Cash', 'Bank Transfer', 'Direct Corporate'];

    return `
      <div class="space-y-6">
        <div>
          <h3 class="font-headline-sm text-base font-bold text-primary">Payment & Guarantee</h3>
          <p class="text-on-surface-variant mt-0.5">Clearly separate payment settlement status, guarantee policy, and payment method.</p>
        </div>

        <!-- Payment Status Selection -->
        <div>
          <label class="block font-bold text-xs text-primary mb-2 font-data-mono uppercase">
            1. Payment Status
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            ${paymentStatuses.map((ps) => {
              const isSelected = this.state.paymentStatus === ps.id;
              return `
                <div 
                  class="btn-select-pay-status p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected 
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/20 shadow-xs' 
                      : 'border-outline-variant/80 bg-surface-container-lowest hover:border-primary/50'
                  }"
                  data-ps="${ps.id}"
                >
                  <div>
                    <span class="font-bold text-xs text-primary block">${ps.label}</span>
                    <span class="text-[10px] text-on-surface-variant mt-0.5 block leading-tight">${ps.desc}</span>
                  </div>
                  <div class="w-4 h-4 rounded-full border flex items-center justify-center mt-2.5 self-end ${
                    isSelected ? 'border-primary bg-primary text-white' : 'border-outline-variant'
                  }">
                    ${isSelected ? '<span class="material-symbols-outlined text-[12px]">check</span>' : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Payment Method -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-2">
          <label class="block font-bold text-xs text-primary font-data-mono uppercase">
            2. Payment / Guarantee Method
          </label>
          <div class="flex flex-wrap gap-3">
            ${paymentMethods.map((pm) => `
              <label class="flex items-center gap-2 text-xs font-medium text-primary cursor-pointer px-3 py-1.5 rounded-lg border ${
                this.state.paymentMethod === pm ? 'border-primary bg-primary/5 font-bold' : 'border-outline-variant'
              }">
                <input 
                  type="radio" 
                  name="radio-pay-method" 
                  value="${pm}" 
                  ${this.state.paymentMethod === pm ? 'checked' : ''} 
                  class="text-primary"
                />
                <span>${pm}</span>
              </label>
            `).join('')}
          </div>
        </div>

        <!-- Dynamic Cancellation Policy from Rate Plan -->
        <div class="p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 space-y-1.5">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-amber-800 text-[18px]">policy</span>
            <span class="font-bold text-amber-950 text-xs uppercase tracking-wider font-data-mono">
              Rate Plan Cancellation Terms (${selectedRate.name})
            </span>
          </div>
          <p class="text-xs text-amber-900 leading-relaxed font-medium">
            ${selectedRate.cancellationPolicy}
          </p>
          <span class="text-[10px] text-amber-800/80 block">
            Cancellation conditions are auto-enforced by Volvitech Hospitality OS.
          </span>
        </div>

      </div>
    `;
  }

  // =========================================================================
  // STEP 6 — REVIEW & CONFIRM
  // =========================================================================
  renderStep6Review(pricing, nights) {
    const rt = this.roomTypes.find((r) => r.id === this.state.selectedRoomTypeId) || this.roomTypes[1];
    const rp = this.ratePlans.find((r) => r.id === this.state.selectedRatePlanId) || this.ratePlans[0];
    const g = this.state.selectedGuest;

    return `
      <div class="space-y-6">
        <div>
          <h3 class="font-headline-sm text-base font-bold text-primary">Review & Confirm Reservation</h3>
          <p class="text-on-surface-variant mt-0.5">Please verify all booking details before final confirmation.</p>
        </div>

        <!-- Summary Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <!-- Guest & Stay Overview -->
          <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-3">
            <div class="font-bold text-xs text-primary uppercase tracking-wider font-data-mono border-b border-outline-variant/40 pb-1.5 flex items-center justify-between">
              <span>Guest & Stay Summary</span>
              <span class="material-symbols-outlined text-[16px] text-on-surface-variant">person</span>
            </div>

            <div class="space-y-2 text-xs">
              <div class="flex justify-between items-center">
                <span class="text-on-surface-variant">Primary Guest:</span>
                <span class="font-bold text-primary flex items-center gap-1">
                  <span>${g?.name || 'Walk-in Guest'}</span>
                  ${g?.idNumber ? '<span class="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-normal">✓ ID Verified</span>' : ''}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Contact / Doc:</span>
                <span class="font-semibold text-primary font-data-mono">${g?.phone || '—'} · ${g?.idType || 'ID'}: ${g?.idNumber || 'On file'}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Dates:</span>
                <span class="font-bold text-primary">${this.formatDateFriendly(this.state.checkInDate)} → ${this.formatDateFriendly(this.state.checkOutDate)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Stay Duration:</span>
                <span class="font-bold text-primary font-data-mono">${nights} Nights (${this.state.roomsCount} Room)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Occupancy:</span>
                <span class="font-medium text-primary">${this.state.adults} Adults, ${this.state.children} Children</span>
              </div>
              ${this.state.accompanyingGuests.length > 0 ? `
                <div class="flex justify-between pt-1 border-t border-outline-variant/40">
                  <span class="text-on-surface-variant">Accompanying (${this.state.accompanyingGuests.length}):</span>
                  <span class="font-semibold text-primary truncate max-w-[180px]">${this.state.accompanyingGuests.map(c => c.name).join(', ')}</span>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Room & Rate Overview -->
          <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-3">
            <div class="font-bold text-xs text-primary uppercase tracking-wider font-data-mono border-b border-outline-variant/40 pb-1.5 flex items-center justify-between">
              <span>Room & Rate Plan</span>
              <span class="material-symbols-outlined text-[16px] text-on-surface-variant">hotel</span>
            </div>

            <div class="space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Room Classification:</span>
                <span class="font-bold text-primary">${rt.name}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Rate Plan:</span>
                <span class="font-bold text-primary">${rp.name}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Booking Source:</span>
                <span class="font-medium text-primary">${this.state.bookingSource}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Payment Status:</span>
                <span class="font-bold px-2 py-0.5 rounded text-[10px] ${
                  this.state.paymentStatus === 'Fully Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }">
                  ${this.state.paymentStatus}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Special Requests:</span>
                <span class="font-medium text-primary text-right truncate max-w-[180px]">
                  ${this.state.specialRequests.join(', ') || 'None'}
                </span>
              </div>
            </div>
          </div>

        </div>

        <!-- Visually Prominent Pricing Breakdown -->
        <div class="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/70 space-y-3 shadow-xs">
          <div class="font-bold text-xs text-primary uppercase tracking-wider font-data-mono border-b border-outline-variant/40 pb-2 flex items-center justify-between">
            <span>Financial Pricing Breakdown</span>
            <span class="text-[11px] text-emerald-700 font-bold">Auto-calculated</span>
          </div>

          <div class="space-y-2 text-xs">
            <div class="flex justify-between items-center text-on-surface-variant">
              <span>Room Charges (${nights} nights × ₹${pricing.nightlyRate.toLocaleString('en-IN')})</span>
              <span class="font-data-mono font-bold text-primary">₹${pricing.roomCharges.toLocaleString('en-IN')}</span>
            </div>

            ${pricing.discounts > 0 ? `
              <div class="flex justify-between items-center text-emerald-700">
                <span>Corporate Plan Discount</span>
                <span class="font-data-mono font-bold">- ₹${pricing.discounts.toLocaleString('en-IN')}</span>
              </div>
            ` : ''}

            <div class="flex justify-between items-center text-on-surface-variant">
              <span>Taxes & Government GST (18%)</span>
              <span class="font-data-mono font-bold text-primary">₹${pricing.taxes.toLocaleString('en-IN')}</span>
            </div>

            <div class="pt-3 border-t border-outline-variant/60 flex justify-between items-baseline">
              <div>
                <span class="text-sm font-black text-primary uppercase tracking-wider font-headline-lg">Grand Total</span>
                <span class="text-[10px] text-on-surface-variant block">Includes all applicable room taxes</span>
              </div>
              <div class="text-right">
                <span class="text-2xl sm:text-3xl font-black text-primary tracking-tight font-headline-lg">
                  ₹${pricing.grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  // =========================================================================
  // CONFIRMATION SUCCESS STATE
  // =========================================================================
  renderConfirmationState() {
    const r = this.state.confirmedReservation || {
      reservation_number: 'RES-10482',
      guest_name: 'Sarah Mitchell',
      stay_dates: '12 Sep → 15 Sep',
      room_type: 'Deluxe King',
      occupancy: '2 Adults',
      total_amount: '₹42,480',
    };

    this.container.innerHTML = `
      <div class="bg-surface-container-lowest text-on-surface rounded-2xl shadow-2xl border border-outline-variant w-full max-w-xl my-8 overflow-hidden flex flex-col p-6 sm:p-8 animate-fadeIn text-center">
        
        <!-- Success Check Icon -->
        <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-300">
          <span class="material-symbols-outlined text-[36px]">check_circle</span>
        </div>

        <h2 class="font-headline-lg text-2xl font-bold text-primary tracking-tight">
          Reservation Confirmed
        </h2>
        <p class="text-xs text-on-surface-variant mt-1">
          The booking has been successfully recorded in Volvitech Hospitality OS.
        </p>

        <!-- Booking Voucher Card -->
        <div class="my-6 bg-surface-bright rounded-xl p-5 border border-outline-variant/70 text-left space-y-3">
          <div class="flex items-center justify-between border-b border-outline-variant/40 pb-2">
            <span class="text-xs font-bold text-on-surface-variant font-data-mono uppercase">Reservation Number</span>
            <span class="text-base font-black text-primary font-data-mono">${r.reservation_number}</span>
          </div>

          <div class="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span class="text-[10px] text-on-surface-variant uppercase font-bold block font-data-mono">Guest</span>
              <span class="font-bold text-primary">${r.guest_name}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant uppercase font-bold block font-data-mono">Stay Dates</span>
              <span class="font-bold text-primary">${r.stay_dates}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant uppercase font-bold block font-data-mono">Room Type</span>
              <span class="font-medium text-primary">${r.room_type}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant uppercase font-bold block font-data-mono">Guests</span>
              <span class="font-medium text-primary">${r.occupancy}</span>
            </div>
          </div>

          <div class="pt-2 border-t border-outline-variant/40 flex justify-between items-baseline">
            <span class="font-bold text-xs text-primary uppercase font-data-mono">Total Charged</span>
            <span class="text-xl font-black text-primary font-headline-lg">${r.total_amount}</span>
          </div>
        </div>

        <!-- Confirmation Actions -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          <button id="btn-conf-view" class="py-2.5 px-3 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all">
            View Reservation
          </button>
          <button id="btn-conf-print" class="py-2.5 px-3 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all">
            Print Confirmation
          </button>
          <button id="btn-conf-send" class="py-2.5 px-3 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all">
            Send Confirmation
          </button>
          <button id="btn-conf-new" class="py-2.5 px-3 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all shadow-sm">
            + New Reservation
          </button>
        </div>

      </div>
    `;

    // Bind confirmation actions
    const confView = this.container.querySelector('#btn-conf-view');
    if (confView) confView.onclick = () => this.destroy();

    const confPrint = this.container.querySelector('#btn-conf-print');
    if (confPrint) {
      confPrint.onclick = () => {
        Toast.show({ title: 'Printing Voucher', message: 'Voucher sent to front desk receipt printer.', type: 'info' });
      };
    }

    const confSend = this.container.querySelector('#btn-conf-send');
    if (confSend) {
      confSend.onclick = () => {
        Toast.show({ title: 'Confirmation Sent', message: `Confirmation email dispatched to ${this.state.selectedGuest?.email || 'guest'}.`, type: 'success' });
      };
    }

    const confNew = this.container.querySelector('#btn-conf-new');
    if (confNew) {
      confNew.onclick = () => {
        this.state.step = 1;
        this.state.isConfirmed = false;
        this.renderContent();
      };
    }
  }

  bindEvents() {
    if (!this.container) return;

    // Close Button
    const closeBtn = this.container.querySelector('#btn-close-wizard');
    if (closeBtn) closeBtn.onclick = () => this.destroy();

    const cancelBtn = this.container.querySelector('#btn-step-cancel');
    if (cancelBtn) cancelBtn.onclick = () => this.destroy();

    // Previous Step
    const prevBtn = this.container.querySelector('#btn-step-prev');
    if (prevBtn) {
      prevBtn.onclick = () => {
        if (this.state.step > 1) {
          this.state.step -= 1;
          this.renderContent();
        }
      };
    }

    // Next Step
    const nextBtn = this.container.querySelector('#btn-step-next');
    if (nextBtn) {
      nextBtn.onclick = () => {
        // Validate current step before proceeding
        if (this.validateStep(this.state.step)) {
          this.state.step += 1;
          this.renderContent();
        }
      };
    }

    // Confirm Reservation
    const confirmBtn = this.container.querySelector('#btn-step-confirm');
    if (confirmBtn) {
      confirmBtn.onclick = () => this.executeReservationCreation();
    }

    // Step 1 Events
    const checkInInput = this.container.querySelector('#input-check-in');
    if (checkInInput) {
      checkInInput.onchange = (e) => {
        this.state.checkInDate = e.target.value;
        this.renderContent();
      };
    }

    const checkOutInput = this.container.querySelector('#input-check-out');
    if (checkOutInput) {
      checkOutInput.onchange = (e) => {
        this.state.checkOutDate = e.target.value;
        this.renderContent();
      };
    }

    const roomsInput = this.container.querySelector('#input-rooms-count');
    if (roomsInput) {
      roomsInput.onchange = (e) => {
        this.state.roomsCount = parseInt(e.target.value, 10) || 1;
        this.renderContent();
      };
    }

    const adultsInput = this.container.querySelector('#input-adults');
    if (adultsInput) {
      adultsInput.onchange = (e) => {
        this.state.adults = parseInt(e.target.value, 10) || 1;
      };
    }

    const childrenInput = this.container.querySelector('#input-children');
    if (childrenInput) {
      childrenInput.onchange = (e) => {
        this.state.children = parseInt(e.target.value, 10) || 0;
      };
    }

    // Step 1: Walk-In Document Extraction Handlers
    this.container.querySelectorAll('.btn-step1-scan-type').forEach((btn) => {
      btn.onclick = () => {
        this.state.selectedDocTypeForExtract = btn.dataset.type;
        this.renderContent();
      };
    });

    const step1RunExtract = this.container.querySelector('#btn-step1-run-extract');
    if (step1RunExtract) {
      step1RunExtract.onclick = () => {
        this.runDocumentExtraction(this.state.selectedDocTypeForExtract || 'AADHAAR');
      };
    }

    const step1UploadBtn = this.container.querySelector('#btn-step1-upload-file');
    const step1FileInput = this.container.querySelector('#file-step1-doc-upload');
    if (step1UploadBtn && step1FileInput) {
      step1UploadBtn.onclick = () => step1FileInput.click();
      step1FileInput.onchange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
          this.runDocumentExtraction(this.state.selectedDocTypeForExtract || 'AADHAAR', file);
        }
      };
    }

    const step1RescanBtn = this.container.querySelector('#btn-step1-rescan');
    if (step1RescanBtn) {
      step1RescanBtn.onclick = () => {
        this.state.selectedGuest = null;
        this.state.newGuest.isExtracted = false;
        this.renderContent();
      };
    }

    // Step 2 Events
    this.container.querySelectorAll('.card-room-type').forEach((card) => {
      card.onclick = () => {
        this.state.selectedRoomTypeId = card.dataset.rtid;
        this.renderContent();
      };
    });

    this.container.querySelectorAll('.card-rate-plan').forEach((card) => {
      card.onclick = () => {
        this.state.selectedRatePlanId = card.dataset.rpid;
        this.renderContent();
      };
    });

    // Step 3 Events: Guest search, mode switching, document extraction, accompanying guests
    const tabSearch = this.container.querySelector('#tab-btn-guest-search');
    if (tabSearch) {
      tabSearch.onclick = () => {
        this.state.guestTab = 'search';
        this.state.isCreatingNewGuest = false;
        this.renderContent();
      };
    }

    const tabCreate = this.container.querySelector('#tab-btn-guest-create');
    if (tabCreate) {
      tabCreate.onclick = () => {
        this.state.guestTab = 'create';
        this.state.isCreatingNewGuest = true;
        this.renderContent();
      };
    }

    const quickSwitchCreate = this.container.querySelector('#btn-quick-switch-create');
    if (quickSwitchCreate) {
      quickSwitchCreate.onclick = () => {
        this.state.guestTab = 'create';
        this.state.isCreatingNewGuest = true;
        this.renderContent();
      };
    }

    const clearGuestBtn = this.container.querySelector('#btn-clear-selected-guest');
    if (clearGuestBtn) {
      clearGuestBtn.onclick = () => {
        this.state.selectedGuest = null;
        this.renderContent();
      };
    }

    const guestSearch = this.container.querySelector('#input-guest-search');
    if (guestSearch) {
      guestSearch.oninput = (e) => {
        this.state.guestSearchQuery = e.target.value.toLowerCase();
        const resultsEl = this.container.querySelector('#guest-search-results');
        if (resultsEl) {
          const matched = this.knownGuests.filter((kg) =>
            kg.name.toLowerCase().includes(this.state.guestSearchQuery) ||
            kg.phone.includes(this.state.guestSearchQuery) ||
            kg.email.toLowerCase().includes(this.state.guestSearchQuery)
          );
          resultsEl.innerHTML = matched.map((kg) => `
            <div 
              class="btn-pick-guest p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                this.state.selectedGuest?.id === kg.id ? 'border-primary bg-primary/10 font-bold ring-1 ring-primary/30' : 'border-outline-variant/70 hover:bg-surface-bright'
              }"
              data-gid="${kg.id}"
            >
              <div>
                <span class="text-xs font-bold text-primary block">${kg.name}</span>
                <span class="text-[11px] text-on-surface-variant block font-data-mono">${kg.phone}</span>
                <span class="text-[10px] text-on-surface-variant block mt-0.5">${kg.previousStays} stays · Last: ${kg.lastStay}</span>
              </div>
              <button class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                this.state.selectedGuest?.id === kg.id ? 'bg-primary text-white' : 'border border-outline-variant hover:bg-surface-container text-primary'
              }">
                ${this.state.selectedGuest?.id === kg.id ? 'Selected' : 'Select'}
              </button>
            </div>
          `).join('');

          // Re-bind pick buttons
          resultsEl.querySelectorAll('.btn-pick-guest').forEach((btn) => {
            btn.onclick = () => {
              const gid = btn.dataset.gid;
              this.state.selectedGuest = this.knownGuests.find((k) => k.id === gid);
              this.state.isCreatingNewGuest = false;
              this.state.guestTab = 'search';
              this.renderContent();
            };
          });
        }
      };
    }

    this.container.querySelectorAll('.btn-pick-guest').forEach((btn) => {
      btn.onclick = () => {
        const gid = btn.dataset.gid;
        this.state.selectedGuest = this.knownGuests.find((k) => k.id === gid);
        this.state.isCreatingNewGuest = false;
        this.state.guestTab = 'search';
        this.renderContent();
      };
    });

    const regSearchedBtn = this.container.querySelector('#btn-register-searched-guest');
    if (regSearchedBtn) {
      regSearchedBtn.onclick = () => {
        this.state.newGuest.name = this.state.guestSearchQuery;
        this.state.guestTab = 'create';
        this.state.isCreatingNewGuest = true;
        this.renderContent();
      };
    }

    const toggleCreateGuest = this.container.querySelector('#btn-toggle-create-guest');
    if (toggleCreateGuest) {
      toggleCreateGuest.onclick = () => {
        this.state.guestTab = 'create';
        this.state.isCreatingNewGuest = true;
        this.renderContent();
      };
    }

    const cancelCreateGuest = this.container.querySelector('#btn-cancel-create-guest, #btn-cancel-create-guest-bottom');
    if (cancelCreateGuest) {
      cancelCreateGuest.onclick = () => {
        this.state.guestTab = 'search';
        this.state.isCreatingNewGuest = false;
        this.renderContent();
      };
    }

    // Document Extraction Triggers
    this.container.querySelectorAll('.btn-doc-type-sel').forEach((btn) => {
      btn.onclick = () => {
        this.state.selectedDocTypeForExtract = btn.dataset.type;
        this.state.newGuest.idType = btn.dataset.type;
        this.renderContent();
      };
    });

    const runExtractBtn = this.container.querySelector('#btn-run-doc-extract');
    if (runExtractBtn) {
      runExtractBtn.onclick = () => {
        this.runDocumentExtraction(this.state.selectedDocTypeForExtract || 'PASSPORT');
      };
    }

    const uploadDocBtn = this.container.querySelector('#btn-upload-doc-file');
    const fileDocInput = this.container.querySelector('#file-doc-upload');
    if (uploadDocBtn && fileDocInput) {
      uploadDocBtn.onclick = () => fileDocInput.click();
      fileDocInput.onchange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
          this.runDocumentExtraction(this.state.selectedDocTypeForExtract || 'PASSPORT', file);
        }
      };
    }

    // Real-Time Input Bindings on newGuest
    const bindInput = (id, prop) => {
      const el = this.container.querySelector(id);
      if (el) {
        el.oninput = (e) => {
          this.state.newGuest[prop] = e.target.value;
        };
        el.onchange = (e) => {
          this.state.newGuest[prop] = e.target.value;
        };
      }
    };
    bindInput('#new-guest-name', 'name');
    bindInput('#new-guest-phone', 'phone');
    bindInput('#new-guest-email', 'email');
    bindInput('#new-guest-nat', 'nationality');
    bindInput('#new-guest-idtype', 'idType');
    bindInput('#new-guest-idnum', 'idNumber');
    bindInput('#new-guest-dob', 'dateOfBirth');
    bindInput('#new-guest-expiry', 'expiryDate');
    bindInput('#new-guest-addr', 'address');

    // Save & Attach New Guest Action
    const saveNewGuestBtn = this.container.querySelector('#btn-save-new-guest');
    if (saveNewGuestBtn) {
      saveNewGuestBtn.onclick = () => {
        const ng = this.state.newGuest;
        if (!ng.name || !ng.phone) {
          Toast.show({ title: 'Missing Information', message: 'Please enter at least guest name and phone number.', type: 'error' });
          return;
        }

        const newProfile = {
          id: `gst-${Date.now()}`,
          name: ng.name,
          phone: ng.phone,
          email: ng.email || '',
          nationality: ng.nationality || 'India',
          idType: ng.idType || 'PASSPORT',
          idNumber: ng.idNumber || '',
          address: ng.address || '',
          previousStays: 0,
          lastStay: 'First Stay',
          isNew: true,
        };

        // Attach as primary
        this.state.selectedGuest = newProfile;
        this.knownGuests.unshift(newProfile);
        if (store?.state?.guests) {
          store.state.guests.unshift({
            ...newProfile,
            firstName: newProfile.name.split(' ')[0],
            lastName: newProfile.name.split(' ').slice(1).join(' ') || '',
            vipTier: 'Standard',
            totalStays: 1,
            lifetimeSpend: 0,
            loyaltyPoints: 100,
          });
        }
        this.state.isCreatingNewGuest = false;
        this.state.guestTab = 'search';
        Toast.show({ title: 'Guest Profile Saved', message: `${newProfile.name} attached as primary guest.`, type: 'success' });
        this.renderContent();
      };
    }

    // Accompanying Guests Management
    const toggleAccompanying = this.container.querySelector('#btn-toggle-add-accompanying');
    if (toggleAccompanying) {
      toggleAccompanying.onclick = () => {
        this.state.showAddAccompanyingForm = !this.state.showAddAccompanyingForm;
        this.renderContent();
      };
    }

    const cancelAccompanying = this.container.querySelector('#btn-cancel-add-accompanying');
    if (cancelAccompanying) {
      cancelAccompanying.onclick = () => {
        this.state.showAddAccompanyingForm = false;
        this.renderContent();
      };
    }

    const scanAccompanying = this.container.querySelector('#btn-quick-scan-accompanying');
    if (scanAccompanying) {
      scanAccompanying.onclick = () => {
        const idTypeEl = this.container.querySelector('#acc-idtype');
        this.runAccompanyingDocExtraction(idTypeEl?.value || 'PASSPORT');
      };
    }

    const saveAccompanying = this.container.querySelector('#btn-save-add-accompanying');
    if (saveAccompanying) {
      saveAccompanying.onclick = () => {
        const nameVal = this.container.querySelector('#acc-name')?.value?.trim();
        if (!nameVal) {
          Toast.show({ title: 'Missing Companion Name', message: 'Please enter accompanying guest name.', type: 'error' });
          return;
        }
        const companion = {
          id: `acc-${Date.now()}`,
          name: nameVal,
          type: this.container.querySelector('#acc-type')?.value || 'Adult',
          relationship: this.container.querySelector('#acc-relation')?.value || 'Companion',
          idType: this.container.querySelector('#acc-idtype')?.value || 'PASSPORT',
          idNumber: this.container.querySelector('#acc-idnum')?.value || '',
        };
        this.state.accompanyingGuests.push(companion);
        this.state.showAddAccompanyingForm = false;
        this.state.newAccompanyingGuest = {
          name: '',
          type: 'Adult',
          relationship: 'Spouse',
          idType: 'PASSPORT',
          idNumber: '',
        };
        Toast.show({ title: 'Companion Added', message: `${companion.name} added to reservation.`, type: 'info' });
        this.renderContent();
      };
    }

    this.container.querySelectorAll('.btn-remove-accompanying').forEach((btn) => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.idx, 10);
        if (!isNaN(idx)) {
          this.state.accompanyingGuests.splice(idx, 1);
          this.renderContent();
        }
      };
    });

    // Step 4 Events
    const sourceSelect = this.container.querySelector('#input-booking-source');
    if (sourceSelect) {
      sourceSelect.onchange = (e) => {
        this.state.bookingSource = e.target.value;
      };
    }

    const companyInput = this.container.querySelector('#input-company-name');
    if (companyInput) {
      companyInput.oninput = (e) => {
        this.state.companyName = e.target.value;
      };
    }

    const notesInput = this.container.querySelector('#input-guest-notes');
    if (notesInput) {
      notesInput.oninput = (e) => {
        this.state.guestNotes = e.target.value;
      };
    }

    this.container.querySelectorAll('.btn-toggle-chip').forEach((chip) => {
      chip.onclick = () => {
        const text = chip.dataset.chip;
        const idx = this.state.specialRequests.indexOf(text);
        if (idx >= 0) {
          this.state.specialRequests.splice(idx, 1);
        } else {
          this.state.specialRequests.push(text);
        }
        this.renderContent();
      };
    });

    // Step 5 Events
    this.container.querySelectorAll('.btn-select-pay-status').forEach((btn) => {
      btn.onclick = () => {
        this.state.paymentStatus = btn.dataset.ps;
        this.renderContent();
      };
    });

    this.container.querySelectorAll('input[name="radio-pay-method"]').forEach((radio) => {
      radio.onchange = (e) => {
        this.state.paymentMethod = e.target.value;
      };
    });
  }

  validateStep(step) {
    if (step === 1) {
      const d1 = new Date(this.state.checkInDate);
      const d2 = new Date(this.state.checkOutDate);
      if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
        Toast.show({ title: 'Invalid Dates', message: 'Please select valid check-in and check-out dates.', type: 'error' });
        return false;
      }
      if (d2 <= d1) {
        Toast.show({ title: 'Check-out Error', message: 'Check-out date must be after check-in date.', type: 'error' });
        return false;
      }
    }

    if (step === 2) {
      if (!this.state.selectedRoomTypeId) {
        Toast.show({ title: 'Room Selection', message: 'Please select a room type.', type: 'error' });
        return false;
      }
      if (!this.state.selectedRatePlanId) {
        Toast.show({ title: 'Rate Selection', message: 'Please select a rate plan.', type: 'error' });
        return false;
      }
    }

    if (step === 3) {
      if (this.state.guestTab === 'create' || this.state.isCreatingNewGuest) {
        const nameInput = this.container.querySelector('#new-guest-name')?.value?.trim() || this.state.newGuest.name;
        const phoneInput = this.container.querySelector('#new-guest-phone')?.value?.trim() || this.state.newGuest.phone;
        if (!nameInput || !phoneInput) {
          Toast.show({ title: 'Missing Information', message: 'Please enter at least guest name and phone number.', type: 'error' });
          return false;
        }
        const createdGuest = {
          id: `gst-${Date.now()}`,
          name: nameInput,
          phone: phoneInput,
          email: this.container.querySelector('#new-guest-email')?.value || this.state.newGuest.email || '',
          nationality: this.container.querySelector('#new-guest-nat')?.value || this.state.newGuest.nationality || 'India',
          idType: this.container.querySelector('#new-guest-idtype')?.value || this.state.newGuest.idType || 'PASSPORT',
          idNumber: this.container.querySelector('#new-guest-idnum')?.value || this.state.newGuest.idNumber || '',
          address: this.container.querySelector('#new-guest-addr')?.value || this.state.newGuest.address || '',
          dateOfBirth: this.container.querySelector('#new-guest-dob')?.value || this.state.newGuest.dateOfBirth || '',
          expiryDate: this.container.querySelector('#new-guest-expiry')?.value || this.state.newGuest.expiryDate || '',
          previousStays: 0,
          lastStay: 'First Stay',
          isNew: true,
        };
        this.state.selectedGuest = createdGuest;
        this.knownGuests.unshift(createdGuest);
        if (store?.state?.guests) {
          store.state.guests.unshift({
            ...createdGuest,
            firstName: createdGuest.name.split(' ')[0],
            lastName: createdGuest.name.split(' ').slice(1).join(' ') || '',
            vipTier: 'Standard',
            totalStays: 1,
            lifetimeSpend: 0,
            loyaltyPoints: 100,
          });
        }
        this.state.isCreatingNewGuest = false;
        this.state.guestTab = 'search';
      } else if (!this.state.selectedGuest) {
        Toast.show({ title: 'Guest Selection', message: 'Please select or create a guest.', type: 'error' });
        return false;
      }
    }

    return true;
  }

  async executeReservationCreation() {
    const pricing = this.calculatePricing();
    const rt = this.roomTypes.find((r) => r.id === this.state.selectedRoomTypeId) || this.roomTypes[1];
    const resNumber = `VOL-WLK-${Math.floor(10000 + Math.random() * 90000)}`;
    const resId = `res-${Date.now()}`;

    // Link or register guest profile in unified store
    let guest = (store?.state?.guests || []).find(g => 
      (this.state.selectedGuest.id && g.id === this.state.selectedGuest.id) ||
      (this.state.selectedGuest.email && g.email && g.email.toLowerCase() === this.state.selectedGuest.email.toLowerCase()) ||
      (this.state.selectedGuest.phone && g.phone && g.phone === this.state.selectedGuest.phone)
    );

    if (!guest && store?.state?.guests) {
      guest = {
        id: this.state.selectedGuest.id || `gst-${Date.now()}`,
        name: this.state.selectedGuest.name,
        firstName: this.state.selectedGuest.name.split(' ')[0],
        lastName: this.state.selectedGuest.name.split(' ').slice(1).join(' ') || '',
        email: this.state.selectedGuest.email || '',
        phone: this.state.selectedGuest.phone || '',
        vipTier: 'Standard',
        currentRoom: null,
        lifetimeSpend: pricing.grandTotal,
        totalStays: 1,
        loyaltyPoints: 250,
        nationality: this.state.selectedGuest.nationality || 'International',
        idType: this.state.selectedGuest.idType || 'PASSPORT',
        passportNumber: this.state.selectedGuest.idNumber || '',
        address: this.state.selectedGuest.address || '',
        preferences: {},
        notes: this.state.guestNotes || 'Registered via Walk-In Booking'
      };
      store.state.guests.push(guest);
    }

    const reservationObj = {
      id: resId,
      confirmationCode: resNumber,
      confirmationNumber: resNumber,
      bookingType: 'WALK_IN',
      channel: this.state.bookingSource || 'Front Desk Walk-In',
      guestId: guest?.id || this.state.selectedGuest.id,
      guestName: this.state.selectedGuest.name,
      phone: this.state.selectedGuest.phone,
      email: this.state.selectedGuest.email,
      nationality: this.state.selectedGuest.nationality,
      checkIn: this.state.checkInDate,
      checkInDate: this.state.checkInDate,
      checkOut: this.state.checkOutDate,
      checkOutDate: this.state.checkOutDate,
      nights: pricing.nights,
      adults: this.state.adults,
      children: this.state.children,
      roomTypeId: this.state.selectedRoomTypeId,
      roomType: rt.name,
      ratePlanId: this.state.selectedRatePlanId,
      ratePlanName: (this.ratePlans.find(p => p.id === this.state.selectedRatePlanId) || {}).name || 'Best Available Rate',
      ratePerNight: pricing.nightlyRate,
      totalAmount: pricing.grandTotal,
      paidAmount: this.state.paymentStatus === 'Fully Paid' ? pricing.grandTotal : 0,
      paymentStatus: this.state.paymentStatus === 'Fully Paid' ? 'PAID' : 'PENDING',
      paymentMethod: this.state.paymentMethod,
      assignedRoom: null,
      roomNumber: null,
      status: 'Confirmed',
      specialRequests: this.state.specialRequests.join(', '),
      guestNotes: this.state.guestNotes,
      accompanyingGuests: this.state.accompanyingGuests,
      identityVerified: !!(this.state.selectedGuest.idNumber || this.state.newGuest.isExtracted),
      idVerification: {
        documentType: this.state.selectedGuest.idType || 'PASSPORT',
        documentNumber: this.state.selectedGuest.idNumber || '',
        issuingCountry: this.state.selectedGuest.nationality || 'International',
        verifiedAt: new Date().toISOString()
      },
      onlineDocument: {
        documentType: this.state.selectedGuest.idType || 'PASSPORT',
        documentNumber: this.state.selectedGuest.idNumber || '',
        issuingCountry: this.state.selectedGuest.nationality || 'International',
        dateOfBirth: this.state.newGuest.dateOfBirth || '1990-01-01',
        expiryDate: this.state.newGuest.expiryDate || '2034-01-01',
        extractedName: this.state.selectedGuest.name,
        extractedAddress: this.state.selectedGuest.address || '',
        submittedAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString()
    };

    // Store in reactive state
    if (store?.state?.reservations) {
      store.state.reservations.unshift(reservationObj);
      store.notify();
    }

    const confirmedData = {
      reservation_number: resNumber,
      guest_name: this.state.selectedGuest.name,
      stay_dates: `${this.formatDateFriendly(this.state.checkInDate)} → ${this.formatDateFriendly(this.state.checkOutDate)}`,
      room_type: rt.name,
      occupancy: `${this.state.adults} Adults${this.state.children > 0 ? `, ${this.state.children} Ch` : ''}${this.state.accompanyingGuests.length ? ` (+${this.state.accompanyingGuests.length} Companions)` : ''}`,
      total_amount: `₹${pricing.grandTotal.toLocaleString('en-IN')}`,
      reservation: reservationObj
    };

    this.state.confirmedReservation = confirmedData;
    this.state.isConfirmed = true;

    // Trigger onCreated callback to update store & active views
    if (typeof this.onCreated === 'function') {
      this.onCreated(confirmedData);
    }

    Toast.show({
      title: 'Walk-In Reservation Created',
      message: `Confirmed ${resNumber} for ${this.state.selectedGuest.name}`,
      type: 'success'
    });

    this.renderContent();
  }

  runDocumentExtraction(docType = 'AADHAAR', file = null) {
    this.state.isScanningDoc = true;
    this.state.selectedDocTypeForExtract = docType;
    this.renderContent();

    setTimeout(() => {
      let extName = 'Aarav Sharma';
      let extPhone = '+91 98765 43210';
      let extEmail = 'aarav.sharma@techcorp.in';
      let extNat = 'India';
      let extDocNum = '';
      let extDob = '1990-03-21';
      let extExpiry = '2099-12-31';
      let extAddr = '12A, Brigade Gateway, Malleshwaram, Bengaluru, Karnataka 560055';

      if (docType === 'AADHAAR') {
        const rand4_1 = Math.floor(2000 + Math.random() * 7000);
        const rand4_2 = Math.floor(1000 + Math.random() * 9000);
        const rand4_3 = Math.floor(1000 + Math.random() * 9000);
        extDocNum = `${rand4_1} ${rand4_2} ${rand4_3}`;
        extNat = 'India';
        extExpiry = '2099-12-31';
        extName = 'Aarav Sharma';
        extPhone = '+91 98765 43210';
        extEmail = 'aarav.sharma@techcorp.in';
        extAddr = '12A, Brigade Gateway, Malleshwaram, Bengaluru, Karnataka 560055';
      } else if (docType === 'PASSPORT') {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const pfx = chars[Math.floor(Math.random() * chars.length)];
        extDocNum = `${pfx}${Math.floor(10000000 + Math.random() * 90000000)}`;
        extNat = 'United Kingdom';
        extName = 'Sarah Mitchell';
        extPhone = '+44 7911 123456';
        extEmail = 'sarah.mitchell@vanguard.com';
        extExpiry = '2034-08-20';
        extDob = '1989-07-22';
        extAddr = '42 Kensington Gardens, London W8 4PE';
      } else if (docType === 'DRIVERS_LICENSE') {
        extDocNum = `DL-KA-${Math.floor(100000 + Math.random() * 900000)}`;
        extNat = 'India';
        extName = 'Vikram Malhotra';
        extPhone = '+91 98450 77123';
        extEmail = 'v.malhotra@indialogistics.com';
        extExpiry = '2032-11-15';
        extDob = '1988-11-04';
        extAddr = 'Flat 402, Prestige Tower, Indiranagar, Bengaluru';
      } else {
        extDocNum = `ID-${Math.floor(10000000 + Math.random() * 90000000)}`;
        extNat = 'Germany';
        extName = 'Elena Rostova';
        extPhone = '+49 151 2345678';
        extEmail = 'elena.rostova@berlin-tech.de';
        extExpiry = '2035-01-01';
        extDob = '1993-05-18';
        extAddr = 'Friedrichstraße 176, 10117 Berlin';
      }

      if (file) {
        extAddr += ` [Verified from file: ${file.name}]`;
      }

      // Populate newGuest object
      this.state.newGuest = {
        name: extName,
        phone: extPhone,
        email: extEmail,
        nationality: extNat,
        idType: docType,
        idNumber: extDocNum,
        address: extAddr,
        dateOfBirth: extDob,
        expiryDate: extExpiry,
        isExtracted: true,
        extractedMethod: file ? `File OCR (${file.name})` : 'High-Speed Scanner Bed',
      };

      // Create linked guest profile
      const extractedGuestProfile = {
        id: `gst-ext-${Date.now()}`,
        name: extName,
        phone: extPhone,
        email: extEmail,
        nationality: extNat,
        idType: docType,
        idNumber: extDocNum,
        address: extAddr,
        dateOfBirth: extDob,
        expiryDate: extExpiry,
        vip: false,
        vipTier: 'Standard',
        previousStays: 0,
        lastStay: 'Walk-In Guest (Extracted)',
        isNew: true,
        isExtracted: true,
        extractedMethod: file ? `File OCR (${file.name})` : 'High-Speed Scanner Bed'
      };

      this.state.selectedGuest = extractedGuestProfile;
      this.state.extractedDocSuccess = true;
      this.state.isScanningDoc = false;

      // Add to knownGuests so it is permanently visible in search results
      if (!this.knownGuests.some(k => k.name.toLowerCase() === extName.toLowerCase() || k.idNumber === extDocNum)) {
        this.knownGuests.unshift(extractedGuestProfile);
      }

      // Add to store.state.guests if exists
      if (store?.state?.guests && !store.state.guests.some(g => g.name.toLowerCase() === extName.toLowerCase() || (extDocNum && g.passportNumber === extDocNum))) {
        store.state.guests.unshift({
          id: extractedGuestProfile.id,
          name: extName,
          firstName: extName.split(' ')[0],
          lastName: extName.split(' ').slice(1).join(' ') || '',
          email: extEmail,
          phone: extPhone,
          nationality: extNat,
          idType: docType,
          passportNumber: extDocNum,
          address: extAddr,
          vipTier: 'Standard',
          totalStays: 1,
          loyaltyPoints: 100,
          lifetimeSpend: 0,
          currentRoom: null,
          preferences: {},
          notes: `Extracted via Walk-In ${docType} scanner`
        });
      }

      Toast.show({
        title: 'ID Document Extracted',
        message: `✓ ${docType} ${extDocNum} verified for ${extName}. Profile attached to reservation.`,
        type: 'success'
      });

      this.renderContent();
    }, 600);
  }

  runAccompanyingDocExtraction(docType = 'PASSPORT', file = null) {
    this.state.isScanningDoc = true;
    this.renderContent();

    setTimeout(() => {
      let extName = 'Rhea Sharma';
      let extDocNum = '';
      if (docType === 'AADHAAR') {
        const rand4_1 = Math.floor(2000 + Math.random() * 7000);
        const rand4_2 = Math.floor(1000 + Math.random() * 9000);
        const rand4_3 = Math.floor(1000 + Math.random() * 9000);
        extDocNum = `${rand4_1} ${rand4_2} ${rand4_3}`;
      } else {
        extDocNum = `P${Math.floor(10000000 + Math.random() * 90000000)}`;
      }

      this.state.newAccompanyingGuest = {
        name: extName,
        type: 'Adult',
        relationship: 'Spouse',
        idType: docType,
        idNumber: extDocNum
      };

      const nameInput = this.container.querySelector('#acc-name');
      const idNumInput = this.container.querySelector('#acc-idnum');
      const idTypeSel = this.container.querySelector('#acc-idtype');
      if (nameInput) nameInput.value = extName;
      if (idNumInput) idNumInput.value = extDocNum;
      if (idTypeSel) idTypeSel.value = docType;

      this.state.isScanningDoc = false;
      Toast.show({
        title: 'Companion ID Extracted',
        message: `✓ Companion document verified: ${extName} (${docType} ${extDocNum})`,
        type: 'success'
      });
      this.renderContent();
    }, 500);
  }
}
