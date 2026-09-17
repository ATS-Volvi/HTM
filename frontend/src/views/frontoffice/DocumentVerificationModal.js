// ==========================================================================
// VOLVITECH HOSPITALITY OS — DOCUMENT VERIFICATION & PROFILE RECONCILIATION
// Section 9 & 29: Non-destructive ID scanning & side-by-side profile review
// ==========================================================================

import { store } from '../../state/store.js';

export class DocumentVerificationModal {
  constructor({ reservation, onVerified, onClose }) {
    this.reservation = reservation;
    this.onVerified = onVerified;
    this.onClose = onClose;
    this.container = null;

    this.scanState = 'READY'; // 'READY' | 'SCANNING' | 'REVIEW'
    this.docType = 'PASSPORT';
    this.selectedFieldsToUpdate = {};

    // Find linked or existing guest profile
    this.existingGuest = this.findExistingProfile();

    // Default extracted ID payload (simulated OCR from high-speed passport reader or online pre-check-in)
    const onlineDoc = this.reservation.onlineDocument;
    if (onlineDoc) {
      this.docType = onlineDoc.documentType || 'PASSPORT';
      this.extractedData = {
        fullName: onlineDoc.extractedName || this.reservation.guestName || 'Sarah Mitchell',
        documentType: onlineDoc.documentType || 'PASSPORT',
        documentNumber: onlineDoc.documentNumber || 'GB-99214482',
        issuingCountry: onlineDoc.issuingCountry || this.reservation.nationality || 'United Kingdom',
        dateOfBirth: onlineDoc.dateOfBirth || '1989-07-22',
        expiryDate: onlineDoc.expiryDate || '2032-05-18',
        extractedAddress: onlineDoc.extractedAddress || '42 Kensington Gardens, London W8 4PX',
        mrzLine: onlineDoc.mrzLine || `P<GBR${(this.reservation.guestName || 'GUEST').toUpperCase().replace(/[^A-Z]/g, '<<')}<<<<<<<<<<<<<<<<<<<\n${onlineDoc.documentNumber || '99214482'}`
      };
      // For online pre-collected documents, directly land in REVIEW state for instant staff reconciliation
      this.scanState = 'REVIEW';
    } else {
      this.extractedData = {
        fullName: this.reservation.guestName || 'Sarah Mitchell',
        documentType: 'PASSPORT',
        documentNumber: 'GB-99214482',
        issuingCountry: this.reservation.nationality || 'United Kingdom',
        dateOfBirth: '1989-07-22',
        expiryDate: '2032-05-18',
        mrzLine: 'P<GBRMITCHELL<<SARAH<<<<<<<<<<<<<<<<<<<<<<<\n99214482<4GBR8907228F3205186<<<<<<<<<<<<<<06'
      };
    }
  }

  findExistingProfile() {
    const guests = store.state.guests || [];
    const res = this.reservation;
    return guests.find(g => 
      (res.guestId && g.id === res.guestId) ||
      (res.email && g.email && g.email.toLowerCase() === res.email.toLowerCase()) ||
      (res.phone && g.phone && g.phone === res.phone) ||
      (res.guestName && g.name && g.name.toLowerCase() === res.guestName.toLowerCase())
    ) || null;
  }

  render() {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn';
    overlay.id = 'doc-verify-modal-overlay';
    this.container = overlay;

    this.renderContent();
    return overlay;
  }

  renderContent() {
    if (!this.container) return;

    const res = this.reservation;
    const existing = this.existingGuest;
    const ext = this.extractedData;

    this.container.innerHTML = `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-bright">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span class="material-symbols-outlined text-[22px]">badge</span>
            </div>
            <div>
              <h3 class="font-headline-sm text-base font-bold text-primary">Guest Identification & Document Verification</h3>
              <p class="text-xs text-on-surface-variant">Reservation: <strong>${res.confirmationCode || res.confirmationNumber || res.reservation_number || res.id}</strong> · ${res.guestName || res.guest_name || 'Guest'}</p>
            </div>
          </div>
          <button id="btn-close-doc-modal" class="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto space-y-5 text-xs flex-1 custom-scrollbar">
          
          ${this.scanState === 'READY' ? `
            <!-- Step A: Choose ID & Trigger Scan -->
            <div class="space-y-4">
              <div class="p-4 rounded-xl bg-surface-bright border border-outline-variant/70">
                <label class="block font-bold text-on-surface uppercase font-label-caps mb-2">Select Guest Document Type</label>
                <div class="grid grid-cols-3 gap-3">
                  ${['PASSPORT', 'DRIVERS_LICENSE', 'NATIONAL_ID'].map(t => `
                    <label class="doc-type-label border rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      this.docType === t ? 'border-primary bg-primary/5 ring-1 ring-primary/20 font-bold text-primary' : 'border-outline-variant hover:bg-surface-container text-on-surface-variant'
                    }" data-doc-type="${t}">
                      <input type="radio" name="doc-type-sel" value="${t}" ${this.docType === t ? 'checked' : ''} class="sr-only">
                      <span class="material-symbols-outlined text-[24px] mb-1">${t === 'PASSPORT' ? 'menu_book' : t === 'DRIVERS_LICENSE' ? 'directions_car' : 'contact_emergency'}</span>
                      <span class="text-[11px]">${t === 'PASSPORT' ? 'Passport' : t === 'DRIVERS_LICENSE' ? 'Driver License' : 'National ID'}</span>
                    </label>
                  `).join('')}
                </div>
              </div>

              <!-- Scanner Bed Simulation -->
              <div class="p-8 border-2 border-dashed border-outline-variant rounded-2xl flex flex-col items-center justify-center text-center bg-surface-bright/50">
                <div class="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 animate-pulse">
                  <span class="material-symbols-outlined text-[30px]">document_scanner</span>
                </div>
                <h4 class="font-bold text-sm text-primary">Place ID Document on Scanner</h4>
                <p class="text-[11px] text-on-surface-variant max-w-sm mt-1">
                  Ready to capture optical and chip data. Simulates 3M / Thales document scanner OCR extraction.
                </p>
                <button id="btn-start-id-scan" class="mt-4 px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-sm hover:bg-primary/90 flex items-center gap-2 cursor-pointer transition-all">
                  <span class="material-symbols-outlined text-[18px]">scanner</span>
                  <span>Scan & Extract ID Data</span>
                </button>
              </div>
            </div>
          ` : this.scanState === 'SCANNING' ? `
            <!-- Step B: Scanning In Progress Animation -->
            <div class="p-12 flex flex-col items-center justify-center text-center space-y-4">
              <div class="relative w-20 h-20">
                <div class="absolute inset-0 rounded-2xl bg-primary/10 animate-ping"></div>
                <div class="relative w-20 h-20 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-md">
                  <span class="material-symbols-outlined text-[36px] animate-pulse">qr_code_scanner</span>
                </div>
              </div>
              <h4 class="text-base font-bold text-primary">Reading OCR Data & Verifying MRZ...</h4>
              <p class="text-xs text-on-surface-variant max-w-sm">
                Authenticating government holograms, optical security features, and parsing bio-page details.
              </p>
              <div class="w-48 h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div class="w-full h-full bg-primary animate-pulse"></div>
              </div>
            </div>
          ` : `
            <!-- Step C: Reconciliation Review (Section 29 Acceptance Rule) -->
            <div class="space-y-4 animate-fadeIn">
              
              ${this.reservation.onlineDocument ? `
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-950">
                  <div class="flex items-center gap-2.5">
                    <span class="material-symbols-outlined text-[22px] text-blue-600">cloud_done</span>
                    <div>
                      <strong class="text-xs font-bold text-blue-950">Pre-Collected Online Identification</strong>
                      <p class="text-[11px] text-blue-800/80">Guest submitted government ID (${this.extractedData.documentType} ${this.extractedData.documentNumber}) via online check-in.</p>
                    </div>
                  </div>
                  <button type="button" id="btn-rescan-physical" class="px-2.5 py-1 rounded-lg border border-blue-300 bg-white hover:bg-blue-50 text-[11px] font-bold text-blue-700 flex items-center gap-1 cursor-pointer transition-all self-start sm:self-auto">
                    <span class="material-symbols-outlined text-[14px]">scanner</span>
                    <span>Rescan Physical ID</span>
                  </button>
                </div>
              ` : ''}

              <div class="flex items-center justify-between p-3.5 rounded-xl ${
                existing ? 'bg-amber-50 border border-amber-200 text-amber-900' : 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              }">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[20px] ${existing ? 'text-amber-700' : 'text-emerald-700'}">
                    ${existing ? 'manage_accounts' : 'person_add'}
                  </span>
                  <div>
                    <strong>${existing ? 'Existing Guest Profile Found' : 'New Guest Profile Recognized'}</strong>
                    <p class="text-[10px] opacity-80">
                      ${existing 
                        ? `Profile #${existing.id} (${existing.name}). Document extraction must NOT blindly overwrite existing records.` 
                        : 'No prior profile matches found. A clean profile will be created.'}
                    </p>
                  </div>
                </div>
                <span class="text-[10px] font-bold uppercase font-data-mono px-2 py-0.5 rounded ${
                  existing ? 'bg-amber-200/60 text-amber-900' : 'bg-emerald-200/60 text-emerald-900'
                }">
                  ${existing ? 'Existing Profile' : 'New Profile'}
                </span>
              </div>

              <!-- Side-by-side reconciliation comparison -->
              <div class="border border-outline-variant/70 rounded-xl overflow-hidden bg-surface-bright">
                <div class="p-3 bg-surface-container font-label-caps uppercase text-[10px] font-bold text-on-surface-variant flex items-center justify-between border-b border-outline-variant/60">
                  <span>Reconciliation Field</span>
                  <div class="flex items-center gap-8 pr-2">
                    <span class="w-36 text-left">Existing Record</span>
                    <span class="w-40 text-left">Extracted From ID</span>
                    <span class="w-20 text-right">Update?</span>
                  </div>
                </div>

                <div class="divide-y divide-outline-variant/40 text-xs">
                  ${[
                    { key: 'name', label: 'Guest Name', existVal: existing?.name || '—', extVal: ext.fullName },
                    { key: 'nationality', label: 'Nationality', existVal: existing?.nationality || '—', extVal: ext.issuingCountry },
                    { key: 'idType', label: 'Document Type', existVal: existing?.idType || '—', extVal: ext.documentType },
                    { key: 'passportNumber', label: 'Document Number', existVal: existing?.passportNumber || '—', extVal: ext.documentNumber },
                    { key: 'expiryDate', label: 'Doc Expiry', existVal: '—', extVal: ext.expiryDate },
                    { key: 'dateOfBirth', label: 'Birth Date', existVal: '—', extVal: ext.dateOfBirth },
                  ].map(row => {
                    const isDiff = existing && row.existVal !== '—' && row.existVal !== row.extVal;
                    return `
                      <div class="p-3 flex items-center justify-between ${isDiff ? 'bg-amber-500/5' : ''}">
                        <div class="font-bold text-primary">
                          ${row.label}
                          ${isDiff ? '<span class="ml-1.5 text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-normal">Difference</span>' : ''}
                        </div>
                        <div class="flex items-center gap-8 pr-2">
                          <span class="w-36 text-on-surface-variant truncate font-medium">${row.existVal}</span>
                          <span class="w-40 font-bold text-primary truncate">${row.extVal}</span>
                          <div class="w-20 text-right">
                            <input type="checkbox" class="profile-update-field-check w-4 h-4 rounded text-primary focus:ring-primary" data-field="${row.key}" data-val="${row.extVal}" ${!existing || isDiff ? '' : 'checked'}>
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>

              <div class="p-3 bg-surface-container rounded-xl text-[11px] text-on-surface-variant">
                <strong>Non-Destructive Guarantee:</strong> Only checked fields will be updated in the guest profile. Existing preferences and VIP notes remain fully protected.
              </div>

            </div>
          `}
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-outline-variant/60 flex items-center justify-between bg-surface-bright">
          <button id="btn-cancel-doc-modal" class="px-4 py-2 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container transition-all cursor-pointer">
            Cancel
          </button>
          
          ${this.scanState === 'REVIEW' ? `
            <button id="btn-commit-doc-verify" class="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700 flex items-center gap-2 cursor-pointer transition-all">
              <span class="material-symbols-outlined text-[18px]">verified</span>
              <span>Accept & Verify Document</span>
            </button>
          ` : ''}
        </div>

      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const root = this.container || document;
    const $ = (sel) => root.querySelector(sel.startsWith('#') || sel.startsWith('.') ? sel : `#${sel}`);
    const $$ = (sel) => Array.from(root.querySelectorAll(sel));

    const closeBtn = $('btn-close-doc-modal');
    if (closeBtn) closeBtn.onclick = () => this.destroy();

    const cancelBtn = $('btn-cancel-doc-modal');
    if (cancelBtn) cancelBtn.onclick = () => this.destroy();

    const rescanBtn = $('btn-rescan-physical');
    if (rescanBtn) {
      rescanBtn.onclick = () => {
        this.scanState = 'READY';
        this.renderContent();
      };
    }

    $$('.doc-type-label').forEach(label => {
      label.onclick = () => {
        const type = label.dataset.docType;
        if (type) {
          this.docType = type;
          this.extractedData.documentType = type;
          this.renderContent();
        }
      };
    });

    $$('input[name="doc-type-sel"]').forEach(radio => {
      radio.onchange = (e) => {
        this.docType = e.target.value;
        this.extractedData.documentType = this.docType;
        this.renderContent();
      };
    });

    const startScanBtn = $('btn-start-id-scan');
    if (startScanBtn) {
      startScanBtn.onclick = (e) => {
        e.preventDefault();
        this.scanState = 'SCANNING';
        this.renderContent();

        setTimeout(() => {
          this.scanState = 'REVIEW';
          this.renderContent();
        }, 700);
      };
    }

    const commitBtn = $('btn-commit-doc-verify');
    if (commitBtn) {
      commitBtn.onclick = (e) => {
        e.preventDefault();
        const fieldsToUpdate = {};
        $$('.profile-update-field-check:checked').forEach(chk => {
          fieldsToUpdate[chk.dataset.field] = chk.dataset.val;
        });

        store.verifyGuestDocument(this.reservation.id, this.extractedData, {
          shouldUpdateProfile: !!this.existingGuest,
          fieldsToUpdate
        });

        if (this.onVerified) this.onVerified();
        this.destroy();
      };
    }
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    if (this.onClose) this.onClose();
  }
}
