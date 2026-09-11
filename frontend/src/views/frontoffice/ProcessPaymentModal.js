// ==========================================================================
// VOLVITECH HOSPITALITY OS — PROCESS PAYMENT MODAL
// Primary UI/UX Source: Google Stitch Screen 'Process Payment: Julian Vane' (cdfc7c81e5244aa88964bef7a3264b73)
// ==========================================================================
import { reservationsClient } from '../../api/reservationsClient.js';
import { Toast } from '../../components/Toast.js';
import { FinalInvoiceModal } from './FinalInvoiceModal.js';

export class ProcessPaymentModal {
  constructor({ reservation, onPaymentCompleted, onClose }) {
    this.reservation = reservation;
    this.onPaymentCompleted = onPaymentCompleted || (() => {});
    this.onClose = onClose || (() => {});
    this.modalEl = null;

    this.paymentMethod = 'saved_card';
    this.amountToPay = Number(reservation?.folio_balance || reservation?.total_amount || 950).toFixed(2);
    this.isProcessing = false;
  }

  render() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn';
    this.modalEl = modal;

    const guestName = this.reservation ? `${this.reservation.first_name} ${this.reservation.last_name}` : 'Guest';
    const roomNumber = this.reservation?.allocated_room_number || this.reservation?.room_number || '402';
    const folioNumber = this.reservation?.folio_number || 'FOL-8925';

    modal.innerHTML = `
      <div class="w-full max-w-4xl bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh]">
        
        <!-- Left Side: Folio & Guest Summary (Stitch LuxeOps Theme) -->
        <div class="w-full md:w-5/12 bg-surface-container-low p-6 border-b md:border-b-0 md:border-r border-outline-variant flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center border border-secondary/30">
                <span class="material-symbols-outlined text-[22px]">receipt_long</span>
              </div>
              <div>
                <h3 class="font-headline-sm text-base font-bold text-primary">Folio Settlement</h3>
                <p class="text-xs text-on-surface-variant font-data-mono">Folio #${folioNumber}</p>
              </div>
            </div>

            <!-- Guest Card -->
            <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-3 mb-5">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  ${this.reservation?.first_name?.[0] || 'G'}${this.reservation?.last_name?.[0] || 'V'}
                </div>
                <div>
                  <div class="font-bold text-primary text-sm">${guestName}</div>
                  <div class="text-[11px] text-on-surface-variant font-data-mono">Room ${roomNumber} • ${this.reservation?.room_type_name || 'Deluxe Room'}</div>
                </div>
              </div>

              <div class="pt-2 border-t border-outline-variant/60 flex justify-between text-xs">
                <span class="text-on-surface-variant">Stay Confirmation:</span>
                <span class="font-data-mono font-bold text-primary">#${this.reservation?.reservation_number || 'HX-8925'}</span>
              </div>
            </div>

            <!-- Outstanding Balance Box -->
            <div class="bg-primary text-on-primary p-5 rounded-xl space-y-1 shadow-md">
              <div class="text-[10px] uppercase font-label-caps tracking-widest text-tertiary-fixed opacity-90">Outstanding Payable Balance</div>
              <div class="font-display-lg text-3xl font-data-mono font-bold text-white">$${this.amountToPay}</div>
              <div class="text-[11px] text-on-primary/70 flex items-center gap-1.5 pt-1">
                <span class="material-symbols-outlined text-[14px] text-emerald-400">check_circle</span>
                <span>Includes 10% Municipal Tax &amp; Incidental Tariffs</span>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-outline-variant/60 text-[11px] text-on-surface-variant">
            <p>Settling balance marks the guest checked-out and automatically dispatches turnover clean alert to Housekeeping.</p>
          </div>
        </div>

        <!-- Right Side: Payment Details (Stitch Screen cdfc7c81) -->
        <div class="w-full md:w-7/12 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div class="flex justify-between items-center mb-5">
              <h3 class="font-headline-sm text-base font-bold text-primary">Payment Details</h3>
              <button id="btn-cancel-pay-modal" class="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 text-xs font-label-caps font-bold">
                <span class="material-symbols-outlined text-[16px]">close</span>
                CANCEL
              </button>
            </div>

            <!-- Amount Input -->
            <div class="mb-5">
              <label class="block font-label-caps text-xs text-on-surface-variant mb-1.5 font-bold uppercase">Amount to Authorize &amp; Settle</label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 font-data-mono text-base font-bold text-secondary">$</span>
                <input id="input-payment-amount" type="number" step="0.01" value="${this.amountToPay}"
                  class="w-full pl-8 pr-4 py-2.5 bg-surface-bright border border-outline-variant rounded-lg font-data-mono text-lg font-bold text-primary focus:border-secondary transition-colors" />
              </div>
            </div>

            <!-- Payment Methods -->
            <label class="block font-label-caps text-xs text-on-surface-variant mb-2.5 font-bold uppercase">Select Payment Instrument</label>
            <div class="space-y-2.5 mb-6">
              
              <!-- Saved Card (Visa 4242) -->
              <label class="relative block cursor-pointer group">
                <input type="radio" name="payment_method" value="saved_card" class="peer sr-only" checked />
                <div class="flex items-center p-3.5 border border-outline-variant rounded-xl bg-surface-bright peer-checked:border-primary peer-checked:bg-secondary/5 transition-all">
                  <div class="flex-shrink-0 w-11 h-7 bg-surface-container-high rounded flex items-center justify-center mr-3 font-bold text-[11px] text-primary border border-outline-variant">
                    VISA
                  </div>
                  <div class="flex-grow">
                    <p class="font-body-md text-xs text-primary font-bold">Visa ending in 4242</p>
                    <p class="text-[11px] text-on-surface-variant">Exp 12/28 • Authorized Card on File</p>
                  </div>
                  <div class="w-4 h-4 rounded-full border-2 border-outline-variant peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center">
                    <div class="w-1.5 h-1.5 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                  </div>
                </div>
              </label>

              <!-- Corporate Direct Billing -->
              <label class="relative block cursor-pointer group">
                <input type="radio" name="payment_method" value="corporate" class="peer sr-only" />
                <div class="flex items-center p-3.5 border border-outline-variant rounded-xl bg-surface-bright peer-checked:border-primary peer-checked:bg-secondary/5 hover:border-primary/50 transition-all">
                  <div class="flex-shrink-0 w-11 h-7 bg-surface-container-high rounded flex items-center justify-center mr-3 text-primary border border-outline-variant">
                    <span class="material-symbols-outlined text-[18px]">domain</span>
                  </div>
                  <div class="flex-grow">
                    <p class="font-body-md text-xs text-primary font-bold">Corporate Direct Master Account</p>
                    <p class="text-[11px] text-on-surface-variant">Acme Corp Global Account #CORP-892</p>
                  </div>
                  <div class="w-4 h-4 rounded-full border-2 border-outline-variant peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center">
                    <div class="w-1.5 h-1.5 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                  </div>
                </div>
              </label>

              <!-- Cash / Counter Settlement -->
              <label class="relative block cursor-pointer group">
                <input type="radio" name="payment_method" value="cash" class="peer sr-only" />
                <div class="flex items-center p-3.5 border border-outline-variant rounded-xl bg-surface-bright peer-checked:border-primary peer-checked:bg-secondary/5 hover:border-primary/50 transition-all">
                  <div class="flex-shrink-0 w-11 h-7 bg-surface-container-high rounded flex items-center justify-center mr-3 text-primary border border-outline-variant">
                    <span class="material-symbols-outlined text-[18px]">payments</span>
                  </div>
                  <div class="flex-grow">
                    <p class="font-body-md text-xs text-primary font-bold">Cash / Front Desk POS</p>
                    <p class="text-[11px] text-on-surface-variant">Physical Cash Receipt / Drawer #1</p>
                  </div>
                  <div class="w-4 h-4 rounded-full border-2 border-outline-variant peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center">
                    <div class="w-1.5 h-1.5 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                  </div>
                </div>
              </label>

            </div>
          </div>

          <!-- Actions -->
          <div class="pt-4 border-t border-outline-variant flex items-center justify-end gap-3">
            <button id="btn-save-later" type="button" class="px-4 py-2.5 text-xs font-label-caps font-bold border border-outline-variant text-on-surface-variant rounded-lg hover:bg-surface-container transition-colors">
              Save as Open
            </button>
            <button id="btn-confirm-payment" type="button" class="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-caps text-xs font-bold hover:bg-primary-container hover:text-on-primary-container flex items-center gap-2 transition-all shadow-md">
              <span class="material-symbols-outlined text-[18px]">check_circle</span>
              Complete Payment &amp; Settle
            </button>
          </div>

        </div>

      </div>
    `;

    this.attachEvents();
    return modal;
  }

  attachEvents() {
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });

    this.modalEl.querySelector('#btn-cancel-pay-modal').onclick = () => this.close();
    this.modalEl.querySelector('#btn-save-later').onclick = () => this.close();

    // Amount change
    const amtInput = this.modalEl.querySelector('#input-payment-amount');
    if (amtInput) {
      amtInput.oninput = (e) => {
        this.amountToPay = e.target.value;
      };
    }

    // Radio select
    this.modalEl.querySelectorAll('input[name="payment_method"]').forEach((radio) => {
      radio.onchange = (e) => {
        this.paymentMethod = e.target.value;
      };
    });

    // Confirm Payment
    const confirmBtn = this.modalEl.querySelector('#btn-confirm-payment');
    if (confirmBtn) {
      confirmBtn.onclick = () => this.handleCompletePayment();
    }
  }

  async handleCompletePayment() {
    const amt = parseFloat(this.amountToPay);
    if (isNaN(amt) || amt < 0) {
      Toast.show({ title: 'Invalid Amount', message: 'Please specify a valid payment amount', type: 'warning' });
      return;
    }

    const confirmBtn = this.modalEl.querySelector('#btn-confirm-payment');
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = `
        <span class="material-symbols-outlined animate-spin text-[18px]">sync</span>
        <span>Processing Settlement...</span>
      `;
    }

    try {
      // Execute check-out and folio settlement
      await reservationsClient.checkOut(this.reservation.id, {
        paymentMethod: this.paymentMethod,
        amountPaid: amt,
      });

      Toast.show({
        title: 'Settlement Completed',
        message: `Folio #${this.reservation.folio_number || '8925'} settled with ${this.paymentMethod.replace('_', ' ').toUpperCase()}`,
        type: 'success',
      });

      const res = this.reservation;
      this.close();
      this.onPaymentCompleted();

      // Offer to view printable invoice
      const invoiceModal = new FinalInvoiceModal({ reservation: res });
      document.body.appendChild(invoiceModal.render());
    } catch (err) {
      console.error('[ProcessPaymentModal error]', err);
      Toast.show({ title: 'Payment Failed', message: err.message, type: 'error' });
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = `
          <span class="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Complete Payment &amp; Settle</span>
        `;
      }
    }
  }

  close() {
    if (this.modalEl && this.modalEl.parentNode) {
      this.modalEl.parentNode.removeChild(this.modalEl);
    }
    this.onClose();
  }
}
