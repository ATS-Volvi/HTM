// ==========================================================================
// VOLVITECH HOSPITALITY OS — ONLINE BOOKINGS STAY SERVICES & AMENITIES MODAL
// Review, select, and add hotel services right before guest check-in
// ==========================================================================

import { store } from '../../state/store.js';
import { CheckInModal } from './CheckInModal.js';

export class OnlineServicesModal {
  constructor({ reservation, onUpdated, onClose }) {
    this.reservation = reservation;
    this.onUpdated = onUpdated;
    this.onClose = onClose;
    this.container = null;
  }

  render() {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn';
    overlay.id = 'online-services-modal-overlay';
    this.container = overlay;

    this.renderContent();
    return overlay;
  }

  renderContent() {
    if (!this.container) return;

    const res = (store.state.reservations || []).find(r => r.id === this.reservation.id) || this.reservation;
    const services = res.optionalServices || [];
    const servicesTotal = services.reduce((sum, s) => sum + Number(s.price || 0), 0);

    const catalog = [
      { name: 'Artisan Breakfast Buffet', price: 35, category: 'Dining', desc: 'Daily gourmet champagne breakfast buffet', icon: 'bakery_dining' },
      { name: 'Airport Luxury Transfer', price: 90, category: 'Transport', desc: 'Private chauffeur service from international terminal', icon: 'airport_shuttle' },
      { name: 'Spa & Thermal Suite Pass', price: 75, category: 'Wellness', desc: 'Full-day vitality pool, sauna & steam access', icon: 'spa' },
      { name: 'Guaranteed Late Check-Out', price: 50, category: 'Rooms', desc: 'Extended 4:00 PM room checkout privileges', icon: 'schedule' },
      { name: 'Welcome Wine & Fruits Platter', price: 40, category: 'F&B', desc: 'Reserve red/white vintage with fresh exotic fruits', icon: 'wine_bar' },
      { name: 'Executive High-Speed Wi-Fi', price: 20, category: 'Services', desc: 'Dedicated 500Mbps symmetrical connection', icon: 'wifi' },
    ];

    this.container.innerHTML = `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-bright">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span class="material-symbols-outlined text-[22px]">room_service</span>
            </div>
            <div>
              <h3 class="font-headline-sm text-base font-bold text-primary">Stay Services & Amenities</h3>
              <p class="text-xs text-on-surface-variant">
                Reservation <strong>${res.confirmationCode}</strong> · ${res.guestName}
              </p>
            </div>
          </div>
          <button id="btn-close-services-modal" class="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto space-y-5 text-xs flex-1 custom-scrollbar">
          <!-- Summary Bar -->
          <div class="p-4 rounded-xl bg-surface-bright border border-outline-variant/70 flex items-center justify-between">
            <div>
              <span class="text-[10px] uppercase font-bold text-on-surface-variant block font-label-caps">Current Stay Services</span>
              <span class="text-lg font-bold font-headline-sm text-primary">
                ${services.length} ${services.length === 1 ? 'Service' : 'Services'} Selected
              </span>
            </div>
            <div class="text-right">
              <span class="text-[10px] uppercase font-bold text-on-surface-variant block font-label-caps">Services Total</span>
              <span class="text-lg font-bold font-data-mono text-emerald-600">+$${servicesTotal}</span>
            </div>
          </div>

          <!-- Existing Services List -->
          ${services.length > 0 ? `
            <div class="space-y-2">
              <span class="text-[10px] font-bold uppercase font-label-caps text-on-surface-variant block">Active Services:</span>
              <div class="space-y-2">
                ${services.map(srv => `
                  <div class="flex items-center justify-between p-3 rounded-xl bg-surface-bright border border-outline-variant/70">
                    <div class="flex items-center gap-2.5">
                      <span class="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                      <div>
                        <strong class="font-bold text-xs text-primary block">${srv.name}</strong>
                        <span class="text-[10px] text-on-surface-variant">${srv.category || 'Front Desk'} · ${srv.status || 'Confirmed'}</span>
                      </div>
                    </div>
                    <span class="font-bold font-data-mono text-xs text-emerald-700">+$${srv.price}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : `
            <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <span class="font-bold">No services currently added.</span> Offer amenities to the guest right before check-in from the options below.
            </div>
          `}

          <!-- Quick Add Catalog -->
          <div class="space-y-2 pt-2 border-t border-outline-variant/60">
            <span class="text-[10px] font-bold uppercase font-label-caps text-on-surface-variant block">
              1-Click Add Stay Amenities:
            </span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              ${catalog.map(item => `
                <div class="p-3 rounded-xl border border-outline-variant hover:border-primary bg-surface-bright hover:bg-primary/5 transition-all flex items-center justify-between">
                  <div class="flex items-start gap-2.5 min-w-0 pr-2">
                    <span class="material-symbols-outlined text-[20px] text-primary shrink-0 mt-0.5">${item.icon}</span>
                    <div class="truncate">
                      <strong class="font-bold text-xs text-primary block truncate">${item.name}</strong>
                      <span class="text-[10px] text-on-surface-variant line-clamp-1">${item.desc}</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    class="btn-add-modal-srv px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-[11px] hover:bg-primary/90 transition-all cursor-pointer shrink-0"
                    data-name="${item.name}"
                    data-price="${item.price}"
                    data-cat="${item.category}"
                  >
                    +$${item.price}
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Custom Service Input -->
          <div class="pt-2 border-t border-outline-variant/60">
            <span class="text-[10px] font-bold uppercase font-label-caps text-on-surface-variant block mb-1.5">
              Add Custom Service:
            </span>
            <div class="flex items-center gap-2">
              <input 
                type="text" 
                id="input-onl-custom-name" 
                placeholder="Service name (e.g. Extra Bed, Laundry, Pet Fee)..." 
                class="flex-1 px-3.5 py-2 rounded-lg border border-outline-variant bg-surface-bright text-xs font-semibold"
              >
              <input 
                type="number" 
                id="input-onl-custom-price" 
                placeholder="$ Amount" 
                class="w-28 px-3.5 py-2 rounded-lg border border-outline-variant bg-surface-bright text-xs font-semibold font-data-mono"
              >
              <button 
                type="button" 
                id="btn-onl-add-custom" 
                class="px-4 py-2 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 cursor-pointer shrink-0"
              >
                + Add Service
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-outline-variant/60 flex items-center justify-between bg-surface-bright">
          <button id="btn-done-services-modal" class="px-5 py-2 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container transition-all cursor-pointer">
            Done
          </button>

          <button 
            id="btn-proceed-to-checkin-modal" 
            class="px-6 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <span>Proceed to Check-In</span>
            <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
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

    const closeBtn = $('btn-close-services-modal');
    if (closeBtn) closeBtn.onclick = () => this.destroy();

    const doneBtn = $('btn-done-services-modal');
    if (doneBtn) doneBtn.onclick = () => this.destroy();

    // Add Catalog Item
    $$('.btn-add-modal-srv').forEach(btn => {
      btn.onclick = () => {
        const name = btn.dataset.name;
        const price = Number(btn.dataset.price) || 0;
        const category = btn.dataset.cat || 'Front Desk';

        store.addServiceToReservation(this.reservation.id, {
          name,
          price,
          category
        });
        if (this.onUpdated) this.onUpdated();
        this.renderContent();
      };
    });

    // Add Custom Service
    const btnCustom = $('btn-onl-add-custom');
    if (btnCustom) {
      btnCustom.onclick = () => {
        const nameInput = $('input-onl-custom-name');
        const priceInput = $('input-onl-custom-price');
        const name = nameInput ? nameInput.value.trim() : '';
        const price = priceInput ? Number(priceInput.value) : 0;

        if (!name) {
          store.showToast('Please enter a service name.', 'warning');
          return;
        }

        store.addServiceToReservation(this.reservation.id, {
          name,
          price,
          category: 'Guest Request'
        });
        if (this.onUpdated) this.onUpdated();
        this.renderContent();
      };
    }

    // Proceed to Check-In Modal
    const btnCheckIn = $('btn-proceed-to-checkin-modal');
    if (btnCheckIn) {
      btnCheckIn.onclick = () => {
        const currentRes = (store.state.reservations || []).find(r => r.id === this.reservation.id) || this.reservation;
        this.destroy();
        const checkInModal = new CheckInModal({
          reservation: currentRes,
          onCheckedIn: () => {
            if (this.onUpdated) this.onUpdated();
            store.setNavTab('inhouse');
          }
        });
        document.body.appendChild(checkInModal.render());
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
