// ==========================================================================
// VOLVITECH HOSPITALITY OS — FINAL TAX INVOICE MODAL
// Primary UI/UX Source: Google Stitch Screen 'Final Invoice: Julian Vane - Room 402' (8b077c3be7ea4ff49269de85a55027d1)
// ==========================================================================

export class FinalInvoiceModal {
  constructor({ reservation, onClose }) {
    this.reservation = reservation;
    this.onClose = onClose || (() => {});
    this.modalEl = null;
  }

  render() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn';
    this.modalEl = modal;

    const guestName = this.reservation ? `${this.reservation.first_name} ${this.reservation.last_name}` : 'Julian Vane';
    const roomNumber = this.reservation?.allocated_room_number || this.reservation?.room_number || '402';
    const folioNumber = this.reservation?.folio_number || 'FOL-8925';
    const resNumber = this.reservation?.reservation_number || 'HX-8925';
    const checkIn = this.reservation?.check_in_date || '2026-09-01';
    const checkOut = this.reservation?.check_out_date || '2026-09-04';
    const totalAmount = Number(this.reservation?.total_amount || 950).toFixed(2);
    const taxAmount = (Number(totalAmount) * 0.10).toFixed(2);
    const subtotal = (Number(totalAmount) - Number(taxAmount)).toFixed(2);

    modal.innerHTML = `
      <div class="w-full max-w-3xl bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        <!-- Header Toolbar -->
        <div class="px-6 py-3.5 bg-surface-bright border-b border-outline-variant flex justify-between items-center print:hidden">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary text-[20px]">verified</span>
            <span class="font-headline-sm text-sm font-bold text-primary">Tax Folio Invoice #${folioNumber}</span>
          </div>
          <div class="flex items-center gap-2">
            <button id="btn-print-invoice" class="px-3.5 py-1.5 bg-secondary text-on-secondary rounded-lg font-label-caps text-xs font-bold hover:brightness-95 transition-all flex items-center gap-1.5 shadow-sm">
              <span class="material-symbols-outlined text-[16px]">print</span>
              Print Invoice
            </button>
            <button id="btn-close-invoice" class="w-8 h-8 rounded-full hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        <!-- Printable Document Canvas (Stitch LuxeOps Theme 8b077c3b) -->
        <div id="printable-invoice" class="p-8 overflow-y-auto space-y-6 text-xs bg-white text-slate-900 font-sans">
          
          <!-- Hotel & Invoice Header -->
          <div class="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm">
                  VH
                </div>
                <h1 class="font-black text-xl tracking-tight text-slate-900">GRAND HORIZON RESORT &amp; SPA</h1>
              </div>
              <p class="text-slate-500 text-[11px] mt-1 font-mono">
                100 Oceanfront Boulevard • Miami Beach, FL 33139<br/>
                Tel: +1 (305) 555-0199 • Tax / GST Registration: #US-FL-9918231
              </p>
            </div>

            <div class="text-right">
              <span class="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px] tracking-wider uppercase mb-1.5">
                PAID &amp; SETTLED
              </span>
              <div class="font-mono text-sm font-bold text-slate-900">TAX INVOICE</div>
              <div class="font-mono text-xs text-slate-500">Ref: ${folioNumber}</div>
              <div class="text-[11px] text-slate-400 mt-0.5">Date: ${new Date().toISOString().split('T')[0]}</div>
            </div>
          </div>

          <!-- Guest & Stay Metadata -->
          <div class="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <div class="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Billed To (Primary Guest)</div>
              <div class="font-bold text-slate-900 text-sm">${guestName}</div>
              <div class="text-slate-600">${this.reservation?.email || 'guest@example.com'}</div>
              <div class="text-slate-600">${this.reservation?.phone || '+1 (555) 012-3456'}</div>
              <div class="text-slate-500 font-mono text-[11px] mt-1">Loyalty ID: ${this.reservation?.vip_tier || 'PLATINUM VIP'}</div>
            </div>

            <div class="space-y-1 text-right">
              <div><span class="text-slate-500">Room Number:</span> <strong class="font-mono text-slate-900 text-sm">Room ${roomNumber}</strong></div>
              <div><span class="text-slate-500">Confirmation:</span> <strong class="font-mono text-slate-900">#${resNumber}</strong></div>
              <div><span class="text-slate-500">Check-in Date:</span> <strong class="font-mono text-slate-900">${checkIn}</strong></div>
              <div><span class="text-slate-500">Check-out Date:</span> <strong class="font-mono text-slate-900">${checkOut}</strong></div>
              <div><span class="text-slate-500">Payment Tender:</span> <strong class="font-mono text-slate-900">Visa ending in 4242 (Auth #9921)</strong></div>
            </div>
          </div>

          <!-- Line Items Table -->
          <div>
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b-2 border-slate-900 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                  <th class="py-2">Date</th>
                  <th class="py-2">Dept / Category</th>
                  <th class="py-2">Description &amp; Voucher</th>
                  <th class="py-2 text-right">Taxable</th>
                  <th class="py-2 text-right">Tax (10%)</th>
                  <th class="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-[11px]">
                <tr>
                  <td class="py-2.5 font-mono text-slate-500">${checkIn}</td>
                  <td class="py-2.5 font-bold text-slate-800">ROOM_CHARGE</td>
                  <td class="py-2.5">Room Accommodation — Deluxe Ocean Suite (3 Nights)</td>
                  <td class="py-2.5 text-right font-mono text-slate-600">$${(Number(subtotal) - 84).toFixed(2)}</td>
                  <td class="py-2.5 text-right font-mono text-slate-600">$${((Number(subtotal) - 84) * 0.1).toFixed(2)}</td>
                  <td class="py-2.5 text-right font-mono font-bold text-slate-900">$${(Number(totalAmount) - 92.4).toFixed(2)}</td>
                </tr>
                <tr>
                  <td class="py-2.5 font-mono text-slate-500">2026-09-02</td>
                  <td class="py-2.5 font-bold text-amber-800">FB_DINING</td>
                  <td class="py-2.5">In-Room Dining — Executive Dinner &amp; Wine (POS-2574)</td>
                  <td class="py-2.5 text-right font-mono text-slate-600">$58.00</td>
                  <td class="py-2.5 text-right font-mono text-slate-600">$5.80</td>
                  <td class="py-2.5 text-right font-mono font-bold text-slate-900">$63.80</td>
                </tr>
                <tr>
                  <td class="py-2.5 font-mono text-slate-500">2026-09-03</td>
                  <td class="py-2.5 font-bold text-purple-800">MINIBAR</td>
                  <td class="py-2.5">Minibar Refreshment Assortment (MB-402)</td>
                  <td class="py-2.5 text-right font-mono text-slate-600">$26.00</td>
                  <td class="py-2.5 text-right font-mono text-slate-600">$2.60</td>
                  <td class="py-2.5 text-right font-mono font-bold text-slate-900">$28.60</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Total Summary & Footer -->
          <div class="border-t-2 border-slate-900 pt-4 flex justify-between items-start">
            <div class="w-1/2 space-y-2 text-[11px] text-slate-500">
              <p>Thank you for choosing Grand Horizon Resort &amp; Spa. All charges are governed by hospitality lodging statutes.</p>
              <div class="flex items-center gap-3 pt-2">
                <div class="w-16 h-16 bg-slate-100 border border-slate-300 rounded flex items-center justify-center font-mono text-[9px] text-slate-400">
                  [ QR VALID ]
                </div>
                <div class="text-[10px] text-slate-400">
                  Digitally signed by Volvitech Hospitality OS<br/>
                  Transaction ID: #TXN-9918204-HX
                </div>
              </div>
            </div>

            <div class="w-5/12 space-y-1.5 text-right text-xs">
              <div class="flex justify-between text-slate-600">
                <span>Subtotal (Net Charges):</span>
                <span class="font-mono">$${subtotal}</span>
              </div>
              <div class="flex justify-between text-slate-600">
                <span>Municipal &amp; VAT Tax (10%):</span>
                <span class="font-mono">+$${taxAmount}</span>
              </div>
              <div class="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Settled:</span>
                <span class="font-mono font-black text-slate-900">$${totalAmount}</span>
              </div>
              <div class="flex justify-between text-xs font-bold text-emerald-700">
                <span>Balance Remaining:</span>
                <span class="font-mono font-black">$0.00</span>
              </div>
            </div>
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

    this.modalEl.querySelector('#btn-close-invoice').onclick = () => this.close();

    this.modalEl.querySelector('#btn-print-invoice').onclick = () => {
      const printable = this.modalEl.querySelector('#printable-invoice');
      if (printable) {
        const win = window.open('', '_blank');
        win.document.write(`
          <html>
            <head>
              <title>Tax Invoice #${this.reservation?.folio_number || 'FOL-8925'}</title>
              <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="p-8 bg-white text-slate-900">
              ${printable.innerHTML}
              <script>window.onload = () => { window.print(); window.close(); }</script>
            </body>
          </html>
        `);
        win.document.close();
      }
    };
  }

  close() {
    if (this.modalEl && this.modalEl.parentNode) {
      this.modalEl.parentNode.removeChild(this.modalEl);
    }
    this.onClose();
  }
}
