// ==========================================================================
// VOLVITECH HOSPITALITY OS — 8-POINT CHECK-IN GATE & KEY ISSUANCE MODAL
// Section 15 & 16: Enforces strict gatekeeper before guest becomes IN-HOUSE
// ==========================================================================

import { store } from '../../state/store.js';
import { DocumentVerificationModal } from './DocumentVerificationModal.js';
import { RoomReadinessModal } from './RoomReadinessModal.js';

export class CheckInModal {
  constructor({ reservation, onCheckedIn, onSuccess, onClose }) {
    this.reservation = reservation;
    this.onCheckedIn = onCheckedIn;
    this.onSuccess = onSuccess;
    this.onClose = onClose;
    this.container = null;

    this.keyNumber = `RFID-${reservation.assignedRoom || reservation.roomNumber || 'RM'}-${Math.floor(1000 + Math.random() * 9000)}`;
    this.isIssuingKey = false;
  }

  render() {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn';
    overlay.id = 'checkin-modal-overlay';
    this.container = overlay;

    this.renderContent();
    return overlay;
  }

  renderContent() {
    if (!this.container) return;

    const res = (store.state.reservations || []).find(r => r.id === this.reservation.id) || this.reservation;
    const gateResult = store.canCheckIn(res.id);
    const roomNum = res.assignedRoom || res.roomNumber;

    this.container.innerHTML = `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-bright">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl ${gateResult.canCheckIn ? 'bg-emerald-100 text-emerald-700' : 'bg-primary/10 text-primary'} flex items-center justify-center">
              <span class="material-symbols-outlined text-[22px]">how_to_reg</span>
            </div>
            <div>
              <h3 class="font-headline-sm text-base font-bold text-primary">Front Desk Check-In Gatekeeper</h3>
              <p class="text-xs text-on-surface-variant">Reservation <strong>${res.confirmationCode}</strong> · ${res.guestName}</p>
            </div>
          </div>
          <button id="btn-close-checkin-modal" class="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto space-y-5 text-xs flex-1 custom-scrollbar">
          
          <!-- Summary Banner -->
          <div class="p-4 rounded-xl border ${
            gateResult.canCheckIn 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-950'
          }">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-[22px] ${gateResult.canCheckIn ? 'text-emerald-700' : 'text-amber-700'}">
                  ${gateResult.canCheckIn ? 'verified' : 'pending_actions'}
                </span>
                <div>
                  <strong class="text-sm font-bold block">
                    ${gateResult.canCheckIn ? 'All 8 Check-In Conditions Satisfied' : 'Check-In Blocked — Missing Prerequisites'}
                  </strong>
                  <span class="text-[11px] opacity-80 block mt-0.5">
                    ${gateResult.canCheckIn 
                      ? 'Ready to issue physical key card and transition guest to IN-HOUSE.' 
                      : `Resolve the ${gateResult.missingChecks.length} outstanding requirement(s) below to proceed.`}
                  </span>
                </div>
              </div>
              <span class="text-xs font-bold font-data-mono px-2.5 py-1 rounded-full ${
                gateResult.canCheckIn ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
              }">
                ${gateResult.passedChecks.length} / 8 Passed
              </span>
            </div>
          </div>

          <!-- 8-Point Gate Checklist -->
          <div class="space-y-2 border border-outline-variant/70 rounded-2xl p-4 bg-surface-bright">
            <span class="text-[10px] font-bold uppercase font-label-caps text-on-surface-variant block mb-2">
              Mandatory Check-In Verification Gate (Section 15)
            </span>

            <div class="space-y-2">
              ${gateResult.checks.map(chk => `
                <div class="p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  chk.passed 
                    ? 'border-emerald-200/60 bg-emerald-50/40 text-emerald-900' 
                    : 'border-rose-200 bg-rose-50/70 text-rose-900'
                }">
                  <div class="flex items-center gap-2.5">
                    <span class="material-symbols-outlined text-[18px] shrink-0 ${chk.passed ? 'text-emerald-600' : 'text-rose-600'}">
                      ${chk.passed ? 'check_circle' : 'cancel'}
                    </span>
                    <div>
                      <span class="font-bold text-xs block">${chk.label}</span>
                      <span class="text-[10px] opacity-80 block">${chk.passed ? chk.desc : chk.failReason}</span>
                    </div>
                  </div>

                  ${!chk.passed ? `
                    <div class="shrink-0 pl-2">
                      ${chk.id === 'guest_identity' || chk.id === 'documentation_verified' ? `
                        <button class="btn-resolve-id px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-[11px] hover:bg-primary/90 cursor-pointer">
                          Verify ID Now →
                        </button>
                      ` : chk.id === 'room_assigned' || chk.id === 'room_ready' ? `
                        <button class="btn-resolve-room px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-[11px] hover:bg-primary/90 cursor-pointer">
                          Assign Room →
                        </button>
                      ` : chk.id === 'registration_completed' ? `
                        <button class="btn-resolve-reg px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-[11px] hover:bg-primary/90 cursor-pointer">
                          Sign Registration →
                        </button>
                      ` : `
                        <span class="text-[10px] font-semibold text-rose-700">Action Required</span>
                      `}
                    </div>
                  ` : `
                    <span class="text-[10px] font-bold text-emerald-700">✓ Pass</span>
                  `}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Pre-Check-In Services & Amenities Add-Ons (Right Before Check-In) -->
          <div class="space-y-3 border border-outline-variant/70 rounded-2xl p-4 bg-surface-bright">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px] text-primary">room_service</span>
                <div>
                  <h4 class="font-bold text-primary text-xs uppercase font-label-caps">Stay Services & Amenities (Pre-Check-In Add-Ons)</h4>
                  <p class="text-[10px] text-on-surface-variant">Offer guest personalized services before issuing key and moving to In-House</p>
                </div>
              </div>
              <span class="text-[11px] font-bold font-data-mono px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                ${(res.optionalServices || []).length} Included
              </span>
            </div>

            <!-- Existing Services List -->
            ${(res.optionalServices && res.optionalServices.length > 0) ? `
              <div class="space-y-1.5 pt-1">
                <span class="text-[10px] font-bold uppercase text-on-surface-variant/80 block">Active Stay Services:</span>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  ${res.optionalServices.map(srv => `
                    <div class="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/80 text-xs">
                      <div class="flex items-center gap-2 min-w-0">
                        <span class="material-symbols-outlined text-[16px] text-emerald-600 shrink-0">check_circle</span>
                        <div class="truncate">
                          <span class="font-bold text-primary block truncate">${srv.name}</span>
                          <span class="text-[10px] text-on-surface-variant">${srv.category || 'Front Desk'} · ${srv.status || 'Confirmed'}</span>
                        </div>
                      </div>
                      <span class="font-bold font-data-mono text-emerald-700 shrink-0 pl-2">+$${srv.price}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : `
              <p class="text-[11px] text-on-surface-variant/80 italic">No additional services currently attached to this reservation.</p>
            `}

            <!-- Quick Add Services Carousel / Chips -->
            <div class="pt-2 border-t border-outline-variant/60">
              <span class="text-[10px] font-bold uppercase text-on-surface-variant block mb-2">1-Click Quick Add Services:</span>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                ${[
                  { name: 'Artisan Breakfast Buffet', price: 35, category: 'Dining', icon: 'bakery_dining' },
                  { name: 'Airport Luxury Transfer', price: 90, category: 'Transport', icon: 'airport_shuttle' },
                  { name: 'Spa & Thermal Suite Pass', price: 75, category: 'Wellness', icon: 'spa' },
                  { name: 'Late Check-Out (4 PM)', price: 50, category: 'Rooms', icon: 'schedule' },
                  { name: 'Welcome Wine & Fruits', price: 40, category: 'F&B', icon: 'wine_bar' },
                  { name: 'Executive High-Speed Wi-Fi', price: 20, category: 'Services', icon: 'wifi' }
                ].map(srv => {
                  const alreadyAdded = (res.optionalServices || []).some(s => s.name === s.name);
                  return `
                    <button 
                      type="button" 
                      class="btn-add-precheckin-srv text-left p-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest hover:border-primary hover:bg-primary/5 transition-all cursor-pointer flex flex-col justify-between group"
                      data-srv-name="${srv.name}"
                      data-srv-price="${srv.price}"
                      data-srv-cat="${srv.category}"
                    >
                      <div class="flex items-center justify-between w-full mb-1">
                        <span class="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">${srv.icon}</span>
                        <span class="text-[10px] font-bold font-data-mono text-primary">+$${srv.price}</span>
                      </div>
                      <span class="font-bold text-[11px] text-on-surface leading-tight block">${srv.name}</span>
                      <span class="text-[9px] text-primary font-bold mt-1 inline-flex items-center gap-0.5">
                        <span class="material-symbols-outlined text-[12px]">add_circle</span>
                        <span>Add to Stay</span>
                      </span>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Custom Service Input -->
            <div class="pt-2 border-t border-outline-variant/60 flex items-center gap-2">
              <input 
                type="text" 
                id="input-custom-srv-name" 
                placeholder="Custom service (e.g. Extra Bed, Laundry)..." 
                class="flex-1 px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs font-medium"
              >
              <input 
                type="number" 
                id="input-custom-srv-price" 
                placeholder="$ Price" 
                class="w-24 px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs font-medium"
              >
              <button 
                type="button" 
                id="btn-add-custom-srv" 
                class="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 cursor-pointer shrink-0"
              >
                + Add
              </button>
            </div>
          </div>

          <!-- Key Card Issuance Section (Available when gate passes) -->
          ${gateResult.canCheckIn ? `
            <div class="p-5 rounded-2xl bg-surface-bright border border-primary/30 space-y-4 animate-fadeIn">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-bold text-primary text-xs uppercase font-label-caps">Issue Room Key & Access Card</h4>
                  <p class="text-[11px] text-on-surface-variant mt-0.5">Section 16: Door-lock RFID card encoding</p>
                </div>
                <span class="px-2.5 py-1 rounded bg-primary/10 text-primary font-bold font-data-mono text-xs">
                  Room #${roomNum}
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-900 uppercase font-label-caps text-[10px] mb-1">Key Card ID / Track 2 RFID</label>
                  <input type="text" id="checkin-key-input" value="${this.keyNumber}" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-white font-data-mono font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 focus:outline-none">
                </div>

                <div>
                  <label class="block font-bold text-slate-900 uppercase font-label-caps text-[10px] mb-1">Key Access Type</label>
                  <select id="checkin-key-type" class="w-full px-3 py-2 rounded-lg border border-outline-variant bg-white text-slate-900 font-semibold text-xs focus:ring-2 focus:ring-primary/20 focus:outline-none cursor-pointer">
                    <option value="RFID" class="text-slate-900 bg-white font-medium py-1">RFID RFID-Card (Dual Guest Copies)</option>
                    <option value="BLE" class="text-slate-900 bg-white font-medium py-1">BLE Mobile Digital Key (Guest App)</option>
                    <option value="KEY" class="text-slate-900 bg-white font-medium py-1">Physical Brass Key (Suites / Protocol)</option>
                  </select>
                </div>
              </div>
            </div>
          ` : ''}

        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-outline-variant/60 flex items-center justify-between bg-surface-bright">
          <button id="btn-cancel-checkin" class="px-4 py-2 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container transition-all cursor-pointer">
            Close
          </button>
          
          <button 
            id="btn-confirm-checkin-key" 
            class="px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer ${
              gateResult.canCheckIn 
                ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                : 'bg-surface-container text-on-surface-variant/50 cursor-not-allowed'
            }"
            ${!gateResult.canCheckIn ? 'disabled' : ''}
          >
            <span class="material-symbols-outlined text-[18px]">key</span>
            <span>Issue Key & Complete Check-In →</span>
          </button>
        </div>

      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const root = this.container || document;
    const $ = (sel) => root.querySelector(sel.startsWith('#') || sel.startsWith('.') ? sel : `#${sel}`);
    const $$ = (sel) => Array.from(root.querySelectorAll(sel));

    const closeBtn = $('btn-close-checkin-modal');
    if (closeBtn) closeBtn.onclick = () => this.destroy();

    const cancelBtn = $('btn-cancel-checkin');
    if (cancelBtn) cancelBtn.onclick = () => this.destroy();

    // Inline Resolver: ID Verification
    $$('.btn-resolve-id').forEach(btn => {
      btn.onclick = () => {
        const modal = new DocumentVerificationModal({
          reservation: this.reservation,
          onVerified: () => {
            this.renderContent();
          }
        });
        document.body.appendChild(modal.render());
      };
    });

    // Inline Resolver: Room Assignment & Readiness
    $$('.btn-resolve-room').forEach(btn => {
      btn.onclick = () => {
        const modal = new RoomReadinessModal({
          reservation: this.reservation,
          onAssigned: (roomNum) => {
            this.renderContent();
          }
        });
        document.body.appendChild(modal.render());
      };
    });

    // Inline Resolver: Sign Registration
    $$('.btn-resolve-reg').forEach(btn => {
      btn.onclick = () => {
        store.completeRegistration(this.reservation.id);
        this.renderContent();
      };
    });

    // Quick Add Service Buttons
    $$('.btn-add-precheckin-srv').forEach(btn => {
      btn.onclick = () => {
        const srvName = btn.dataset.srvName;
        const srvPrice = Number(btn.dataset.srvPrice) || 0;
        const srvCat = btn.dataset.srvCat || 'Front Desk';
        store.addServiceToReservation(this.reservation.id, {
          name: srvName,
          price: srvPrice,
          category: srvCat
        });
        this.renderContent();
      };
    });

    // Custom Service Button
    const btnAddCustom = $('btn-add-custom-srv');
    if (btnAddCustom) {
      btnAddCustom.onclick = () => {
        const nameInput = $('input-custom-srv-name');
        const priceInput = $('input-custom-srv-price');
        const srvName = nameInput ? nameInput.value.trim() : '';
        const srvPrice = priceInput ? Number(priceInput.value) : 0;
        if (!srvName) {
          store.showToast('Please enter a service name', 'warning');
          return;
        }
        store.addServiceToReservation(this.reservation.id, {
          name: srvName,
          price: srvPrice,
          category: 'Guest Request'
        });
        this.renderContent();
      };
    }

    // Final Action: Issue Key & Complete Check-In
    const issueKeyBtn = $('btn-confirm-checkin-key');
    if (issueKeyBtn && !issueKeyBtn.disabled) {
      issueKeyBtn.onclick = () => {
        const keyInput = $('checkin-key-input');
        const keyVal = keyInput ? keyInput.value : this.keyNumber;
        const res = store.issueKeyAndAccess(this.reservation.id, keyVal);
        if (res.success) {
          const callback = this.onCheckedIn || this.onSuccess;
          if (callback) callback(this.reservation.id);
          this.destroy();
        }
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
