// ==========================================================================
// VOLVITECH HOSPITALITY OS — FRONT DESK DEPARTURE & CHECK-OUT PROTOCOL MODAL
// Standard Operating Procedure (SOP) Gatekeeper for Resident Check-Out
// ==========================================================================

import { store } from '../../state/store.js';
import { FinalInvoiceModal } from './FinalInvoiceModal.js';

export class CheckOutModal {
  constructor({ reservation, onCheckedOut, onClose }) {
    this.reservation = reservation;
    this.onCheckedOut = onCheckedOut || (() => {});
    this.onClose = onClose || (() => {});
    this.container = null;

    // Checkout Protocol Checklist States
    this.checklist = {
      folioSettled: true,
      minibarChecked: true,
      keycardReturned: true,
      safeCleared: true,
      transportChecked: true,
    };

    this.sendInvoiceEmail = true;
    this.paymentMethod = 'Credit Card (Front Desk POS)';
    this.isProcessing = false;
  }

  render() {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[65] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn';
    overlay.id = 'checkout-modal-overlay';
    this.container = overlay;

    this.renderContent();
    return overlay;
  }

  renderContent() {
    if (!this.container) return;

    const res = (store.state.reservations || []).find(r => r.id === this.reservation.id) || this.reservation;
    const roomNum = res.assignedRoom || res.roomNumber || '—';
    const roomType = res.roomType || 'Standard Room';
    const keycard = res.keycardIssued || res.keyCardNumber || `RFID-${roomNum}-A`;

    // Calculate Financials
    const nights = Math.max(1, Number(res.nights || 1));
    const ratePerNight = Number(res.ratePerNight || (res.totalAmount ? Math.round(res.totalAmount / nights) : 480));
    const roomCharges = ratePerNight * nights;
    const servicesTotal = (res.optionalServices || []).reduce((sum, s) => sum + Number(s.price || 0), 0);
    const taxes = Math.round((roomCharges + servicesTotal) * 0.10);
    const grandTotal = roomCharges + servicesTotal + taxes;
    const paidAmount = Number(res.paidAmount !== undefined ? res.paidAmount : (res.status === 'Checked In' ? grandTotal : 0));
    const balanceDue = Math.max(0, grandTotal - paidAmount);

    const allChecklistPassed = Object.values(this.checklist).every(Boolean);

    this.container.innerHTML = `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-fadeIn select-none">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-bright shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[22px]">logout</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-headline-sm text-base font-bold text-primary">Front Desk Departure Protocol</h3>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold font-data-mono bg-rose-50 text-rose-800 border border-rose-200 uppercase">
                  CHECK-OUT GATEWAY
                </span>
                ${res.vip ? `
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-700 border border-amber-500/30">
                    ★ VIP
                  </span>
                ` : ''}
              </div>
              <p class="text-xs text-on-surface-variant mt-0.5">
                Resident: <strong>${res.guestName}</strong> · Room <strong>#${roomNum}</strong> (${roomType})
              </p>
            </div>
          </div>
          <button id="btn-close-checkout-modal" class="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Scrollable Body -->
        <div class="p-6 overflow-y-auto space-y-5 text-xs flex-1 custom-scrollbar">
          
          <!-- 1. Folio Financial Settlement Summary -->
          <div class="p-4 rounded-xl border ${balanceDue > 0 ? 'bg-amber-500/10 border-amber-300 text-amber-950' : 'bg-emerald-500/10 border-emerald-300 text-emerald-950'} space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[20px] ${balanceDue > 0 ? 'text-amber-700' : 'text-emerald-700'}">
                  ${balanceDue > 0 ? 'pending_actions' : 'receipt_long'}
                </span>
                <strong class="text-xs uppercase tracking-wider font-label-caps">
                  Folio Settlement & Balance
                </strong>
              </div>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-data-mono ${balanceDue > 0 ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'}">
                ${balanceDue > 0 ? `OUTSTANDING: $${balanceDue.toFixed(2)}` : '✓ FULLY SETTLED ($0.00)'}
              </span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-outline-variant/30 text-xs">
              <div>
                <span class="text-on-surface-variant block text-[10px]">Room Tariff</span>
                <span class="font-bold text-primary font-data-mono">$${roomCharges}</span>
              </div>
              <div>
                <span class="text-on-surface-variant block text-[10px]">Services / Incidental</span>
                <span class="font-bold text-primary font-data-mono">$${servicesTotal}</span>
              </div>
              <div>
                <span class="text-on-surface-variant block text-[10px]">Taxes & Fees</span>
                <span class="font-bold text-primary font-data-mono">$${taxes}</span>
              </div>
              <div>
                <span class="text-on-surface-variant block text-[10px]">Paid to Date</span>
                <span class="font-bold text-emerald-700 font-data-mono">$${paidAmount}</span>
              </div>
            </div>

            ${balanceDue > 0 ? `
              <div class="pt-2 border-t border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span class="text-[11px] text-amber-900 font-medium">
                  Collect balance of <strong>$${balanceDue.toFixed(2)}</strong> to authorize departure:
                </span>
                <div class="flex items-center gap-2">
                  <select id="checkout-pay-method" class="px-2.5 py-1.5 rounded-lg border border-outline-variant bg-white text-slate-900 font-semibold text-xs">
                    <option value="Card">Credit Card (POS)</option>
                    <option value="Cash">Cash</option>
                    <option value="DirectBill">Direct Master Bill</option>
                  </select>
                  <button id="btn-settle-balance-now" class="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer shadow-xs transition-all">
                    Settle Balance
                  </button>
                </div>
              </div>
            ` : ''}
          </div>

          <!-- 2. Standard 5-Point Departure Procedures Checklist -->
          <div class="space-y-2 border border-outline-variant/70 rounded-2xl p-4 bg-surface-bright">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-bold uppercase font-label-caps text-on-surface-variant">
                Standard Departure Procedures Checklist
              </span>
              <span class="text-[10px] text-primary font-data-mono font-semibold">
                ${Object.values(this.checklist).filter(Boolean).length} / 5 Checked
              </span>
            </div>

            <!-- Item 1: Folio Settlement -->
            <label class="p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${this.checklist.folioSettled ? 'border-emerald-200 bg-emerald-50/50 text-emerald-950' : 'border-outline-variant bg-surface-container-lowest text-on-surface'}">
              <div class="flex items-center gap-2.5">
                <input type="checkbox" id="chk-folio-settled" class="rounded text-primary focus:ring-primary h-4 w-4" ${this.checklist.folioSettled ? 'checked' : ''}>
                <div>
                  <span class="font-bold block text-xs">1. Folio Finalized & Settled</span>
                  <span class="text-[10px] text-on-surface-variant block">All stay charges, incidentals, and taxes reviewed and closed with zero discrepancy.</span>
                </div>
              </div>
              <span class="material-symbols-outlined text-[18px] ${this.checklist.folioSettled ? 'text-emerald-600' : 'text-on-surface-variant'}">
                ${this.checklist.folioSettled ? 'check_circle' : 'radio_button_unchecked'}
              </span>
            </label>

            <!-- Item 2: Minibar & Room Consumption -->
            <label class="p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${this.checklist.minibarChecked ? 'border-emerald-200 bg-emerald-50/50 text-emerald-950' : 'border-outline-variant bg-surface-container-lowest text-on-surface'}">
              <div class="flex items-center gap-2.5">
                <input type="checkbox" id="chk-minibar-checked" class="rounded text-primary focus:ring-primary h-4 w-4" ${this.checklist.minibarChecked ? 'checked' : ''}>
                <div>
                  <span class="font-bold block text-xs">2. In-Room Minibar & Amenities Clearance</span>
                  <span class="text-[10px] text-on-surface-variant block">Verified with floor team that no late unposted minibar or property items were consumed.</span>
                </div>
              </div>
              <span class="material-symbols-outlined text-[18px] ${this.checklist.minibarChecked ? 'text-emerald-600' : 'text-on-surface-variant'}">
                ${this.checklist.minibarChecked ? 'check_circle' : 'radio_button_unchecked'}
              </span>
            </label>

            <!-- Item 3: RFID Keycard Returned -->
            <label class="p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${this.checklist.keycardReturned ? 'border-emerald-200 bg-emerald-50/50 text-emerald-950' : 'border-outline-variant bg-surface-container-lowest text-on-surface'}">
              <div class="flex items-center gap-2.5">
                <input type="checkbox" id="chk-keycard-returned" class="rounded text-primary focus:ring-primary h-4 w-4" ${this.checklist.keycardReturned ? 'checked' : ''}>
                <div>
                  <span class="font-bold block text-xs">3. RFID Door Keycard Returned & Deactivated</span>
                  <span class="text-[10px] text-on-surface-variant block">Physical key card (<strong>${keycard}</strong>) handed back and contactless lock access revoked.</span>
                </div>
              </div>
              <span class="material-symbols-outlined text-[18px] ${this.checklist.keycardReturned ? 'text-emerald-600' : 'text-on-surface-variant'}">
                ${this.checklist.keycardReturned ? 'check_circle' : 'radio_button_unchecked'}
              </span>
            </label>

            <!-- Item 4: Safe & Personal Belongings -->
            <label class="p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${this.checklist.safeCleared ? 'border-emerald-200 bg-emerald-50/50 text-emerald-950' : 'border-outline-variant bg-surface-container-lowest text-on-surface'}">
              <div class="flex items-center gap-2.5">
                <input type="checkbox" id="chk-safe-cleared" class="rounded text-primary focus:ring-primary h-4 w-4" ${this.checklist.safeCleared ? 'checked' : ''}>
                <div>
                  <span class="font-bold block text-xs">4. In-Room Electronic Safe & Wardrobe Cleared</span>
                  <span class="text-[10px] text-on-surface-variant block">Guest confirmed in-room digital safe left unlocked and no personal items left behind.</span>
                </div>
              </div>
              <span class="material-symbols-outlined text-[18px] ${this.checklist.safeCleared ? 'text-emerald-600' : 'text-on-surface-variant'}">
                ${this.checklist.safeCleared ? 'check_circle' : 'radio_button_unchecked'}
              </span>
            </label>

            <!-- Item 5: Luggage & Transport Assistance -->
            <label class="p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${this.checklist.transportChecked ? 'border-emerald-200 bg-emerald-50/50 text-emerald-950' : 'border-outline-variant bg-surface-container-lowest text-on-surface'}">
              <div class="flex items-center gap-2.5">
                <input type="checkbox" id="chk-transport-checked" class="rounded text-primary focus:ring-primary h-4 w-4" ${this.checklist.transportChecked ? 'checked' : ''}>
                <div>
                  <span class="font-bold block text-xs">5. Concierge Luggage & Departure Transport</span>
                  <span class="text-[10px] text-on-surface-variant block">Bell desk luggage storage or departure airport shuttle arranged as required.</span>
                </div>
              </div>
              <span class="material-symbols-outlined text-[18px] ${this.checklist.transportChecked ? 'text-emerald-600' : 'text-on-surface-variant'}">
                ${this.checklist.transportChecked ? 'check_circle' : 'radio_button_unchecked'}
              </span>
            </label>
          </div>

          <!-- 3. Post-Checkout Operational Automation Notice -->
          <div class="p-4 rounded-xl bg-purple-50/70 border border-purple-200 text-purple-950 space-y-2">
            <span class="text-[10px] font-bold uppercase tracking-wider text-purple-900 font-data-mono block">
              AUTOMATIC OPERATIONAL LIFECYCLE
            </span>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span class="text-on-surface-variant block text-[10px]">Reservation:</span>
                <span class="font-bold text-purple-900">Checked Out</span>
              </div>
              <div>
                <span class="text-on-surface-variant block text-[10px]">Stay Record:</span>
                <span class="font-bold text-purple-900">Completed & Archived</span>
              </div>
              <div>
                <span class="text-on-surface-variant block text-[10px]">Room #${roomNum}:</span>
                <span class="font-bold text-rose-800">Vacant Dirty</span>
              </div>
              <div>
                <span class="text-on-surface-variant block text-[10px]">Housekeeping:</span>
                <span class="font-bold text-emerald-800">Dispatched Turnover</span>
              </div>
            </div>
          </div>

          <!-- 4. Folio Receipt Actions -->
          <div class="p-3.5 rounded-xl border border-outline-variant bg-surface-container/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <input type="checkbox" id="chk-email-invoice" class="rounded text-primary focus:ring-primary h-4 w-4" ${this.sendInvoiceEmail ? 'checked' : ''}>
              <label for="chk-email-invoice" class="cursor-pointer">
                <span class="font-semibold block text-xs">Email Zero-Balance Tax Folio Invoice</span>
                <span class="text-[10px] text-on-surface-variant">${res.email || 'guest-folio@volvitech.hotel'}</span>
              </label>
            </div>
            <button id="btn-preview-invoice" class="px-3 py-1.5 rounded-lg border border-outline-variant hover:border-primary text-xs font-bold text-primary hover:bg-surface-bright flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0">
              <span class="material-symbols-outlined text-[15px]">print</span>
              <span>View / Print Invoice</span>
            </button>
          </div>

        </div>

        <!-- Footer Actions -->
        <div class="px-6 py-4 border-t border-outline-variant/60 flex items-center justify-between bg-surface-bright shrink-0">
          <button id="btn-cancel-checkout" class="px-4 py-2.5 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container transition-all cursor-pointer">
            Cancel
          </button>

          <button 
            id="btn-confirm-departure" 
            class="px-6 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${this.isProcessing ? 'opacity-70 pointer-events-none' : ''}"
          >
            <span class="material-symbols-outlined text-[18px]">logout</span>
            <span>Complete Check-Out & Release Room →</span>
          </button>
        </div>

      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const root = this.container || document;
    const $ = (id) => root.querySelector(id.startsWith('#') || id.startsWith('.') ? id : `#${id}`);

    // Close Modal
    const btnClose = $('btn-close-checkout-modal');
    if (btnClose) btnClose.onclick = () => this.destroy();

    const btnCancel = $('btn-cancel-checkout');
    if (btnCancel) btnCancel.onclick = () => this.destroy();

    // Checkbox toggles
    const chkFolio = $('chk-folio-settled');
    if (chkFolio) chkFolio.onchange = () => { this.checklist.folioSettled = chkFolio.checked; this.renderContent(); };

    const chkMinibar = $('chk-minibar-checked');
    if (chkMinibar) chkMinibar.onchange = () => { this.checklist.minibarChecked = chkMinibar.checked; this.renderContent(); };

    const chkKeycard = $('chk-keycard-returned');
    if (chkKeycard) chkKeycard.onchange = () => { this.checklist.keycardReturned = chkKeycard.checked; this.renderContent(); };

    const chkSafe = $('chk-safe-cleared');
    if (chkSafe) chkSafe.onchange = () => { this.checklist.safeCleared = chkSafe.checked; this.renderContent(); };

    const chkTransport = $('chk-transport-checked');
    if (chkTransport) chkTransport.onchange = () => { this.checklist.transportChecked = chkTransport.checked; this.renderContent(); };

    const chkEmail = $('chk-email-invoice');
    if (chkEmail) chkEmail.onchange = () => { this.sendInvoiceEmail = chkEmail.checked; };

    // Settle Balance button
    const btnSettle = $('btn-settle-balance-now');
    if (btnSettle) {
      btnSettle.onclick = () => {
        const res = (store.state.reservations || []).find(r => r.id === this.reservation.id) || this.reservation;
        res.paidAmount = res.totalAmount || 480;
        store.showToast(`✓ Outstanding balance settled via ${$('checkout-pay-method')?.value || 'Credit Card'}.`, 'success');
        this.renderContent();
      };
    }

    // View / Print Invoice
    const btnInvoice = $('btn-preview-invoice');
    if (btnInvoice) {
      btnInvoice.onclick = () => {
        const res = (store.state.reservations || []).find(r => r.id === this.reservation.id) || this.reservation;
        const invModal = new FinalInvoiceModal({
          reservation: {
            first_name: res.firstName || (res.guestName || '').split(' ')[0],
            last_name: res.lastName || (res.guestName || '').split(' ').slice(1).join(' '),
            allocated_room_number: res.assignedRoom || res.roomNumber,
            folio_number: `FOL-${res.assignedRoom || res.roomNumber || 'RM'}-${res.id.slice(-4)}`,
            reservation_number: res.confirmationCode,
            check_in_date: res.checkIn,
            check_out_date: res.checkOut,
            total_amount: res.totalAmount || 480
          }
        });
        document.body.appendChild(invModal.render());
      };
    }

    // Confirm Departure Execution
    const btnConfirm = $('btn-confirm-departure');
    if (btnConfirm) {
      btnConfirm.onclick = () => {
        this.executeCheckout();
      };
    }
  }

  executeCheckout() {
    this.isProcessing = true;
    const res = (store.state.reservations || []).find(r => r.id === this.reservation.id) || this.reservation;
    const roomNum = res.assignedRoom || res.roomNumber;

    // 1. Execute hotel lifecycle checkout in store
    const result = store.checkOutGuestLifecycle(roomNum, res.id);

    // 2. Mark reservation completed
    res.status = 'Checked Out';
    res.departureCompletedAt = new Date().toISOString();

    // 3. Dispatch Housekeeping Turnover Cleaning Task
    if (store.state.housekeepingTasks) {
      store.state.housekeepingTasks.unshift({
        id: `hk-turnover-${Date.now()}`,
        roomNumber: roomNum,
        roomType: res.roomType || 'Standard',
        taskType: 'DEPARTURE_CLEAN',
        priority: 'URGENT',
        status: 'PENDING',
        assignedTo: 'Floor Team Lead',
        dispatchedAt: new Date().toLocaleTimeString(),
        notes: `Turnover clean for checked-out guest ${res.guestName}. Room is Vacant Dirty.`
      });
    }

    store.showToast(
      `✓ Check-out protocol completed for ${res.guestName}! Room #${roomNum || '—'} is now Vacant Dirty and dispatched for turnover cleaning.`,
      'success'
    );

    // 4. Close modal and invoke callback
    this.destroy();
    this.onCheckedOut(res);
  }

  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.onClose();
  }
}
