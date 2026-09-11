// ==========================================================================
// VOLVITECH HOSPITALITY OS — POST CHARGE MODAL (STITCH LUXEOPS UI)
// ==========================================================================
import { reservationsClient } from '../../api/reservationsClient.js';
import { Toast } from '../../components/Toast.js';

export class PostChargeModal {
  constructor({ reservation, onPosted, onClose }) {
    this.reservation = reservation;
    this.onPosted = onPosted || (() => {});
    this.onClose = onClose || (() => {});
    this.modalEl = null;

    // State
    this.category = 'FB_DINING';
    this.description = 'In-Room Dining — Executive Dinner & Wine';
    this.amount = '65.00';
    this.outlet = 'In-Room Dining (Room Service)';
    this.voucherRef = `POS-${Math.floor(1000 + Math.random() * 9000)}`;
    this.isSubmitting = false;

    // Predefined quick presets
    this.presets = [
      { label: 'Minibar Refresh', amount: 28, category: 'MINIBAR', desc: 'Minibar — Premium Refreshment Assortment' },
      { label: 'Breakfast Buffet', amount: 35, category: 'FB_DINING', desc: 'Grand Horizon Breakfast Buffet (2 Pax)' },
      { label: 'Executive Dinner', amount: 85, category: 'FB_DINING', desc: 'In-Room Dining — Executive Dinner & Wine' },
      { label: 'Dry Cleaning', amount: 45, category: 'LAUNDRY', desc: 'Express Dry Cleaning & Valet Pressing' },
      { label: 'Spa Treatment', amount: 140, category: 'SPA', desc: 'Spa Oasis — 60min Swedish Tension Relief' },
      { label: 'Valet Parking', amount: 30, category: 'INCIDENTAL', desc: 'Daily Valet Parking Service' },
    ];
  }

  render() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn';
    this.modalEl = modal;

    const guestName = this.reservation ? `${this.reservation.first_name} ${this.reservation.last_name}` : 'Guest';
    const roomNumber = this.reservation?.allocated_room_number ? `Room ${this.reservation.allocated_room_number}` : 'In-House';
    const folioNumber = this.reservation?.folio_number || 'FOL-8925';

    modal.innerHTML = `
      <div class="w-full max-w-xl bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <!-- Modal Header (Stitch LuxeOps Theme) -->
        <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center border border-secondary/30">
              <span class="material-symbols-outlined text-[22px]">add_card</span>
            </div>
            <div>
              <h2 class="font-headline-sm text-base font-bold text-primary">Post Incidental Folio Charge</h2>
              <p class="text-xs text-on-surface-variant font-data-mono mt-0.5">
                ${guestName} • <strong class="text-primary">${roomNumber}</strong> • Folio #${folioNumber}
              </p>
            </div>
          </div>
          <button id="btn-close-charge-modal" class="w-8 h-8 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto space-y-5 text-xs">
          
          <!-- Category Selector (Stitch Pills) -->
          <div>
            <label class="block font-label-caps text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              Charge Department Category
            </label>
            <div class="grid grid-cols-3 gap-2">
              <button type="button" class="cat-pill p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${this.category === 'FB_DINING' ? 'border-secondary bg-secondary/10 text-primary font-bold' : 'border-outline-variant hover:border-primary text-on-surface'}" data-cat="FB_DINING">
                <span class="material-symbols-outlined text-[18px] text-secondary">restaurant</span>
                <span>F&amp;B Dining</span>
              </button>
              <button type="button" class="cat-pill p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${this.category === 'MINIBAR' ? 'border-secondary bg-secondary/10 text-primary font-bold' : 'border-outline-variant hover:border-primary text-on-surface'}" data-cat="MINIBAR">
                <span class="material-symbols-outlined text-[18px] text-secondary">wine_bar</span>
                <span>Minibar</span>
              </button>
              <button type="button" class="cat-pill p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${this.category === 'LAUNDRY' ? 'border-secondary bg-secondary/10 text-primary font-bold' : 'border-outline-variant hover:border-primary text-on-surface'}" data-cat="LAUNDRY">
                <span class="material-symbols-outlined text-[18px] text-secondary">dry_cleaning</span>
                <span>Laundry</span>
              </button>
              <button type="button" class="cat-pill p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${this.category === 'SPA' ? 'border-secondary bg-secondary/10 text-primary font-bold' : 'border-outline-variant hover:border-primary text-on-surface'}" data-cat="SPA">
                <span class="material-symbols-outlined text-[18px] text-secondary">spa</span>
                <span>Spa &amp; Wellness</span>
              </button>
              <button type="button" class="cat-pill p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${this.category === 'INCIDENTAL' ? 'border-secondary bg-secondary/10 text-primary font-bold' : 'border-outline-variant hover:border-primary text-on-surface'}" data-cat="INCIDENTAL">
                <span class="material-symbols-outlined text-[18px] text-secondary">local_taxi</span>
                <span>Transport</span>
              </button>
              <button type="button" class="cat-pill p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${this.category === 'OTHER' ? 'border-secondary bg-secondary/10 text-primary font-bold' : 'border-outline-variant hover:border-primary text-on-surface'}" data-cat="OTHER">
                <span class="material-symbols-outlined text-[18px] text-secondary">receipt</span>
                <span>Other Service</span>
              </button>
            </div>
          </div>

          <!-- Quick Presets -->
          <div>
            <label class="block font-label-caps text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
              Quick One-Click Presets
            </label>
            <div class="flex flex-wrap gap-1.5">
              ${this.presets.map((p) => `
                <button type="button" class="preset-chip px-2.5 py-1 rounded-full border border-outline-variant bg-surface-container text-[11px] hover:border-secondary hover:text-primary transition-all flex items-center gap-1 font-medium" data-amount="${p.amount}" data-cat="${p.category}" data-desc="${p.desc}">
                  <span>${p.label}</span>
                  <span class="font-data-mono font-bold text-secondary">+$${p.amount}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Description & Outlet -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="block font-label-caps text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                Item / Service Description *
              </label>
              <input id="input-charge-desc" type="text" value="${this.description}" placeholder="e.g. In-Room Dining Dinner & Wine" 
                class="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg text-xs text-on-surface focus:border-secondary font-medium" />
            </div>

            <div>
              <label class="block font-label-caps text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                Posting Outlet / POS Terminal
              </label>
              <select id="select-charge-outlet" class="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg text-xs text-on-surface focus:border-secondary">
                <option value="In-Room Dining (Room Service)">In-Room Dining (Room Service)</option>
                <option value="Main Dining Room">Main Dining Room</option>
                <option value="Rooftop Sky Lounge">Rooftop Sky Lounge</option>
                <option value="Spa Oasis & Wellness">Spa Oasis &amp; Wellness</option>
                <option value="Housekeeping & Laundry">Housekeeping &amp; Laundry</option>
                <option value="Front Desk Valet">Front Desk Valet</option>
              </select>
            </div>

            <div>
              <label class="block font-label-caps text-[11px] font-bold text-on-surface-variant uppercase mb-1">
                Voucher / Reference Code
              </label>
              <input id="input-charge-voucher" type="text" value="${this.voucherRef}" 
                class="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg text-xs font-data-mono text-on-surface focus:border-secondary" />
            </div>
          </div>

          <!-- Amount Input & Financial Preview -->
          <div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant space-y-3">
            <div>
              <label class="block font-label-caps text-[11px] font-bold text-primary uppercase mb-1">
                Charge Subtotal Amount (USD) *
              </label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-secondary font-data-mono">$</span>
                <input id="input-charge-amount" type="number" step="0.01" min="0.01" value="${this.amount}" 
                  class="w-full pl-8 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-lg font-data-mono font-bold text-primary focus:border-secondary shadow-inner" />
              </div>
            </div>

            <!-- Tax Calculation breakdown -->
            <div class="pt-2 border-t border-outline-variant space-y-1.5 text-xs" id="preview-calc-box">
              <!-- Dynamically updated -->
            </div>
          </div>

        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-outline-variant bg-surface-bright flex justify-between items-center">
          <button id="btn-cancel-charge" type="button" class="px-4 py-2 border border-outline-variant rounded-lg text-xs font-label-caps font-bold hover:bg-surface-container text-on-surface-variant transition-colors">
            Cancel
          </button>

          <button id="btn-submit-post-charge" type="button" class="px-6 py-2.5 bg-secondary text-on-secondary rounded-lg text-xs font-label-caps font-bold hover:brightness-95 transition-all flex items-center gap-2 shadow-sm">
            <span class="material-symbols-outlined text-[18px]">receipt_long</span>
            Post to Guest Folio
          </button>
        </div>

      </div>
    `;

    this.attachEvents();
    this.updateCalculation();
    return modal;
  }

  attachEvents() {
    // Close on backdrop click
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });

    // Close button
    this.modalEl.querySelector('#btn-close-charge-modal').onclick = () => this.close();
    this.modalEl.querySelector('#btn-cancel-charge').onclick = () => this.close();

    // Category pills
    this.modalEl.querySelectorAll('.cat-pill').forEach((pill) => {
      pill.onclick = () => {
        this.category = pill.dataset.cat;
        this.modalEl.querySelectorAll('.cat-pill').forEach((p) => {
          const isSelected = p.dataset.cat === this.category;
          p.className = `cat-pill p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
            isSelected
              ? 'border-secondary bg-secondary/10 text-primary font-bold shadow-xs'
              : 'border-outline-variant hover:border-primary text-on-surface'
          }`;
        });
      };
    });

    // Preset chips
    this.modalEl.querySelectorAll('.preset-chip').forEach((chip) => {
      chip.onclick = () => {
        const amt = chip.dataset.amount;
        const cat = chip.dataset.cat;
        const desc = chip.dataset.desc;

        this.amount = amt;
        this.category = cat;
        this.description = desc;

        const amtInput = this.modalEl.querySelector('#input-charge-amount');
        const descInput = this.modalEl.querySelector('#input-charge-desc');
        if (amtInput) amtInput.value = amt;
        if (descInput) descInput.value = desc;

        // Highlight corresponding category pill
        this.modalEl.querySelectorAll('.cat-pill').forEach((p) => {
          const isSelected = p.dataset.cat === this.category;
          p.className = `cat-pill p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
            isSelected
              ? 'border-secondary bg-secondary/10 text-primary font-bold shadow-xs'
              : 'border-outline-variant hover:border-primary text-on-surface'
          }`;
        });

        this.updateCalculation();
      };
    });

    // Amount input change
    const amtInput = this.modalEl.querySelector('#input-charge-amount');
    if (amtInput) {
      amtInput.oninput = (e) => {
        this.amount = e.target.value;
        this.updateCalculation();
      };
    }

    // Submit charge
    const submitBtn = this.modalEl.querySelector('#btn-submit-post-charge');
    if (submitBtn) {
      submitBtn.onclick = () => this.handleSubmit();
    }
  }

  updateCalculation() {
    const calcBox = this.modalEl.querySelector('#preview-calc-box');
    if (!calcBox) return;

    const subtotal = parseFloat(this.amount) || 0;
    const tax = subtotal * 0.10;
    const total = subtotal + tax;

    calcBox.innerHTML = `
      <div class="flex justify-between text-on-surface-variant font-medium">
        <span>Item Tariff Subtotal:</span>
        <span class="font-data-mono font-semibold text-on-surface">$${subtotal.toFixed(2)}</span>
      </div>
      <div class="flex justify-between text-on-surface-variant font-medium">
        <span>Municipal &amp; VAT Tax (10%):</span>
        <span class="font-data-mono font-semibold text-on-surface">+$${tax.toFixed(2)}</span>
      </div>
      <div class="flex justify-between text-xs font-bold text-primary pt-1 border-t border-outline-variant/60">
        <span>Total Debit to Folio:</span>
        <span class="font-data-mono text-sm text-secondary">$${total.toFixed(2)}</span>
      </div>
    `;
  }

  async handleSubmit() {
    const descInput = this.modalEl.querySelector('#input-charge-desc');
    const desc = descInput ? descInput.value.trim() : this.description;
    const numAmt = parseFloat(this.amount);

    if (!desc) {
      Toast.show({ title: 'Validation', message: 'Please provide a charge description', type: 'warning' });
      return;
    }
    if (isNaN(numAmt) || numAmt <= 0) {
      Toast.show({ title: 'Validation', message: 'Please provide a valid positive charge amount', type: 'warning' });
      return;
    }

    const submitBtn = this.modalEl.querySelector('#btn-submit-post-charge');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="material-symbols-outlined animate-spin text-[18px]">sync</span>
        <span>Posting Charge...</span>
      `;
    }

    try {
      await reservationsClient.postFolioCharge(this.reservation.id, {
        category: this.category,
        description: desc,
        amount: numAmt,
      });

      Toast.show({
        title: 'Charge Posted Successfully',
        message: `$${numAmt.toFixed(2)} billed to Folio #${this.reservation.folio_number || '8925'}`,
        type: 'success',
      });

      this.close();
      this.onPosted();
    } catch (err) {
      console.error('[PostChargeModal submit error]', err);
      Toast.show({ title: 'Error Posting Charge', message: err.message, type: 'error' });
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span class="material-symbols-outlined text-[18px]">receipt_long</span>
          <span>Post to Guest Folio</span>
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
