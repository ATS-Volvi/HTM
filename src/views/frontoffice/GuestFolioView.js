// ==========================================================================
// VOLVITECH HOSPITALITY OS — GUEST FOLIO & BILLING VIEW
// Primary UI/UX Source: Google Stitch Screen 'Guest Folio: Julian Vane - Room 402' (e0281f5f20ea4f129f420c21f3b72d51)
// ==========================================================================
import { reservationsClient } from '../../api/reservationsClient.js';
import { Toast } from '../../components/Toast.js';
import { PostChargeModal } from './PostChargeModal.js';
import { ProcessPaymentModal } from './ProcessPaymentModal.js';
import { FinalInvoiceModal } from './FinalInvoiceModal.js';

export class GuestFolioView {
  constructor() {
    this.inHouseReservations = [];
    this.selectedReservation = null;
    this.isLoading = true;
    this.container = null;
  }

  async loadData() {
    this.isLoading = true;
    try {
      const res = await reservationsClient.getReservations();
      // In-house or checked-in reservations
      this.inHouseReservations = res.data.filter((r) => r.status === 'CHECKED_IN' || r.status === 'CONFIRMED');
      if (this.inHouseReservations.length > 0 && !this.selectedReservation) {
        // Default to first checked-in guest (e.g. Julian Vane) or first available
        const checkedIn = this.inHouseReservations.find((r) => r.status === 'CHECKED_IN');
        this.selectedReservation = checkedIn || this.inHouseReservations[0];
      }
      this.isLoading = false;
    } catch (err) {
      console.error('[GuestFolioView error]', err);
      Toast.show({ title: 'Error', message: 'Failed to load guest folios', type: 'error' });
      this.isLoading = false;
    }
  }

  render() {
    const el = document.createElement('div');
    el.className = 'w-full flex flex-col gap-6 animate-fadeIn pb-12';
    this.container = el;
    this.renderContent();
    return el;
  }

  renderContent() {
    if (!this.container) return;

    if (this.isLoading) {
      this.container.innerHTML = `
        <div class="flex items-center justify-center p-16 text-primary">
          <span class="material-symbols-outlined animate-spin text-[28px]">sync</span>
          <span class="font-headline-sm text-sm font-semibold ml-3">Loading Guest Folios...</span>
        </div>
      `;
      return;
    }

    const sel = this.selectedReservation;
    const roomSubtotal = sel ? parseFloat(sel.total_amount) : 0;
    const taxes = roomSubtotal * 0.10;
    const totalBalance = roomSubtotal + taxes;

    const html = `
      <!-- Header -->
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-outline-variant pb-4 gap-4">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="font-headline-lg text-2xl md:text-3xl font-bold text-primary">Guest Folio &amp; Billing</h1>
            <span class="bg-primary-fixed text-on-primary-fixed font-data-mono font-bold text-xs px-2.5 py-0.5 rounded-full">
              Folio #${sel ? (sel.folio_id ? sel.folio_id.substring(0, 8).toUpperCase() : 'FOL-8925') : 'NONE'}
            </span>
          </div>
          <p class="font-body-md text-xs text-on-surface-variant mt-1">
            ${sel ? `Guest: <strong>${sel.first_name} ${sel.last_name}</strong> • ${sel.allocated_room_number ? `Room ${sel.allocated_room_number}` : 'Unassigned'} • Stay: ${sel.check_in_date} to ${sel.check_out_date}` : 'No active folio selected'}
          </p>
        </div>

        <div class="flex items-center gap-3">
          <!-- Switch Guest Folio Dropdown -->
          <select id="select-active-folio" class="bg-surface-container-lowest border border-outline-variant rounded text-xs px-3 py-2 font-medium text-on-surface focus:border-primary">
            ${this.inHouseReservations.map((r) => `
              <option value="${r.id}" ${sel?.id === r.id ? 'selected' : ''}>
                ${r.first_name} ${r.last_name} (${r.allocated_room_number ? `Room ${r.allocated_room_number}` : 'Pre-checkin'})
              </option>
            `).join('')}
          </select>

          <button id="btn-view-tax-invoice" class="bg-surface-container-lowest border border-outline-variant text-primary font-label-caps text-xs font-bold px-3 py-2 rounded hover:bg-surface-container transition-all flex items-center gap-1.5 shadow-sm">
            <span class="material-symbols-outlined text-[16px]">receipt</span>
            Tax Invoice
          </button>

          <button id="btn-post-incidental" class="bg-secondary-container text-on-secondary-container font-label-caps text-xs font-bold px-4 py-2 rounded hover:brightness-95 transition-all flex items-center gap-1.5 shadow-sm border border-secondary/20">
            <span class="material-symbols-outlined text-[16px]">add_card</span>
            Post Charge
          </button>
        </div>
      </header>

      <!-- KPI Row (Charges / Payments / Balance) -->
      <section class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <span class="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold block mb-1">TOTAL ROOM CHARGES</span>
          <span class="font-display-lg text-2xl md:text-3xl text-primary font-data-mono font-bold">$${roomSubtotal.toFixed(2)}</span>
          <span class="text-[11px] text-on-surface-variant block mt-1">${sel?.room_type_name || 'Standard'} tariff</span>
        </div>

        <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <span class="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold block mb-1">MUNICIPAL &amp; VAT TAXES</span>
          <span class="font-display-lg text-2xl md:text-3xl text-on-surface font-data-mono font-bold">$${taxes.toFixed(2)}</span>
          <span class="text-[11px] text-on-surface-variant block mt-1">10% Standard Hospitality Duty</span>
        </div>

        <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div class="absolute inset-0 bg-secondary/5 pointer-events-none"></div>
          <span class="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold block mb-1">OUTSTANDING SETTLEMENT BALANCE</span>
          <span class="font-display-lg text-2xl md:text-3xl text-secondary font-data-mono font-bold">$${totalBalance.toFixed(2)}</span>
          <span class="text-[11px] text-emerald-700 font-bold block mt-1 flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">credit_score</span> Pre-Authorized Guarantee on File
          </span>
        </div>
      </section>

      <!-- Folio Transactions Table (Stitch design) -->
      <section class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div class="p-4 border-b border-outline-variant bg-surface-bright flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[20px]">receipt_long</span>
            <h3 class="font-headline-sm text-base font-bold text-primary">Itemized Ledger Account</h3>
          </div>
          <div class="flex gap-2">
            <button id="btn-print-invoice" class="px-3 py-1.5 border border-outline-variant rounded text-xs font-label-caps font-semibold hover:bg-surface-container transition-colors flex items-center gap-1 text-on-surface-variant">
              <span class="material-symbols-outlined text-[15px]">print</span> Print Invoice
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left whitespace-nowrap min-w-[750px]">
            <thead>
              <tr class="bg-surface-container-low text-[11px] font-label-caps text-on-surface-variant uppercase tracking-wider">
                <th class="px-5 py-3 border-b border-outline-variant w-32">Date</th>
                <th class="px-5 py-3 border-b border-outline-variant w-28">Category</th>
                <th class="px-5 py-3 border-b border-outline-variant">Description</th>
                <th class="px-5 py-3 border-b border-outline-variant w-36">Reference Code</th>
                <th class="px-5 py-3 border-b border-outline-variant text-right w-28">Tax</th>
                <th class="px-5 py-3 border-b border-outline-variant text-right w-32">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant text-xs">
              <tr class="hover:bg-surface-bright transition-colors">
                <td class="px-5 py-3 font-data-mono text-on-surface-variant">${sel?.check_in_date || 'Today'}</td>
                <td class="px-5 py-3">
                  <span class="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-[10px] font-bold uppercase">ROOM</span>
                </td>
                <td class="px-5 py-3 font-semibold text-primary">
                  Room Accommodation Tariff (${sel?.room_type_name || 'Suite'})
                </td>
                <td class="px-5 py-3 font-data-mono text-outline">TARIFF-892</td>
                <td class="px-5 py-3 font-data-mono text-right text-on-surface-variant">$${taxes.toFixed(2)}</td>
                <td class="px-5 py-3 font-data-mono font-bold text-right text-primary">$${roomSubtotal.toFixed(2)}</td>
              </tr>
              
              <tr class="hover:bg-surface-bright transition-colors">
                <td class="px-5 py-3 font-data-mono text-on-surface-variant">${sel?.check_in_date || 'Today'}</td>
                <td class="px-5 py-3">
                  <span class="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold uppercase">DINING</span>
                </td>
                <td class="px-5 py-3 font-semibold text-primary">
                  In-Room Dining — Executive Dinner &amp; Vintage Wine
                </td>
                <td class="px-5 py-3 font-data-mono text-outline">POS-ORD-4491</td>
                <td class="px-5 py-3 font-data-mono text-right text-on-surface-variant">$8.40</td>
                <td class="px-5 py-3 font-data-mono font-bold text-right text-primary">$84.00</td>
              </tr>

              <tr class="hover:bg-surface-bright transition-colors">
                <td class="px-5 py-3 font-data-mono text-on-surface-variant">${sel?.check_in_date || 'Today'}</td>
                <td class="px-5 py-3">
                  <span class="px-2 py-0.5 rounded bg-surface-container-high text-on-surface text-[10px] font-bold uppercase">SERVICE</span>
                </td>
                <td class="px-5 py-3 font-semibold text-primary">
                  Executive Dry Cleaning &amp; Valet Pressing
                </td>
                <td class="px-5 py-3 font-data-mono text-outline">LND-2910</td>
                <td class="px-5 py-3 font-data-mono text-right text-on-surface-variant">$5.80</td>
                <td class="px-5 py-3 font-data-mono font-bold text-right text-primary">$58.00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="bg-surface-container-low font-bold text-sm">
                <td colspan="5" class="px-5 py-3 text-right text-primary">Total Folio Payable:</td>
                <td class="px-5 py-3 text-right text-secondary font-data-mono text-base font-bold">
                  $${(totalBalance + 84 + 58 + 8.4 + 5.8).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <!-- Settle & Check-out Action Card -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
            <span class="material-symbols-outlined text-[20px]">payments</span>
          </div>
          <div>
            <div class="font-bold text-primary text-sm">Express Settle &amp; Departure</div>
            <div class="text-xs text-on-surface-variant">Settle balance with card on file and automatically dispatch turnover clean to Housekeeping.</div>
          </div>
        </div>

        <button id="btn-settle-checkout" class="w-full sm:w-auto px-6 py-2.5 bg-primary text-on-primary rounded font-label-caps text-xs font-bold hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow">
          <span class="material-symbols-outlined text-[16px]">logout</span>
          Settle Balance &amp; Check-Out
        </button>
      </div>
    `;

    this.container.innerHTML = html;
    this.attachEvents();
  }

  attachEvents() {
    // Select folio
    const selDropdown = this.container.querySelector('#select-active-folio');
    if (selDropdown) {
      selDropdown.onchange = (e) => {
        this.selectedReservation = this.inHouseReservations.find((r) => r.id === e.target.value);
        this.renderContent();
      };
    }

    // Post charge modal UI
    const postBtn = this.container.querySelector('#btn-post-incidental');
    if (postBtn && this.selectedReservation) {
      postBtn.onclick = () => {
        const modal = new PostChargeModal({
          reservation: this.selectedReservation,
          onPosted: async () => {
            await this.loadData();
            this.renderContent();
          },
        });
        document.body.appendChild(modal.render());
      };
    }

    // Tax Invoice Modal UI
    const invoiceBtn = this.container.querySelector('#btn-view-tax-invoice');
    if (invoiceBtn && this.selectedReservation) {
      invoiceBtn.onclick = () => {
        const modal = new FinalInvoiceModal({ reservation: this.selectedReservation });
        document.body.appendChild(modal.render());
      };
    }

    // Settle & Check-out Modal UI (ProcessPaymentModal)
    const settleBtn = this.container.querySelector('#btn-settle-checkout');
    if (settleBtn && this.selectedReservation) {
      settleBtn.onclick = () => {
        const modal = new ProcessPaymentModal({
          reservation: this.selectedReservation,
          onPaymentCompleted: async () => {
            await this.loadData();
            this.selectedReservation = null;
            this.renderContent();
          },
        });
        document.body.appendChild(modal.render());
      };
    }

    // Print Invoice
    const printBtn = this.container.querySelector('#btn-print-invoice');
    if (printBtn) {
      printBtn.onclick = () => {
        window.print();
      };
    }
  }
}
