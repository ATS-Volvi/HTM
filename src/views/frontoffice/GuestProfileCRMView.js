// ==========================================================================
// VOLVITECH HOSPITALITY OS — GUEST PROFILES & CRM CENTRAL VIEW
// Primary UI/UX Source: Google Stitch Screen 'Guest Profile & CRM Central' (3b89c3404da24665ab03bf4ce99fa88e)
// ==========================================================================
import { reservationsClient } from '../../api/reservationsClient.js';
import { Toast } from '../../components/Toast.js';

export class GuestProfileCRMView {
  constructor() {
    this.guests = [];
    this.selectedGuest = null;
    this.searchQuery = '';
    this.isLoading = true;
    this.container = null;
  }

  async loadData() {
    this.isLoading = true;
    try {
      const res = await reservationsClient.searchGuests(this.searchQuery || 'a');
      this.guests = res.data || [];
      if (!this.selectedGuest && this.guests.length > 0) {
        this.selectedGuest = this.guests[0];
      }
      this.isLoading = false;
    } catch (err) {
      console.error(err);
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

    if (this.isLoading && this.guests.length === 0) {
      this.container.innerHTML = `
        <div class="flex items-center justify-center p-16 text-primary">
          <span class="material-symbols-outlined animate-spin text-[28px]">sync</span>
          <span class="font-headline-sm text-sm font-semibold ml-3">Loading Guest 360° CRM...</span>
        </div>
      `;
      return;
    }

    const sel = this.selectedGuest || (this.guests.length > 0 ? this.guests[0] : null);

    const html = `
      <!-- Header -->
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-outline-variant pb-4 gap-4">
        <div>
          <h1 class="font-headline-lg text-2xl md:text-3xl font-bold text-primary">Guest 360° CRM Central</h1>
          <p class="font-body-md text-xs text-on-surface-variant mt-1">
            Enterprise guest intelligence, lifetime stay records, VIP preferences, and compliance documentation.
          </p>
        </div>

        <div class="relative w-full sm:w-72">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
          <input id="crm-main-search" type="text" value="${this.searchQuery}" placeholder="Search guest name, phone, email..." 
            class="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded text-xs text-on-surface focus:border-primary font-body-sm h-9" />
        </div>
      </header>

      <!-- Master-Detail Split Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        
        <!-- Left Column: Guest Directory List (4 cols) -->
        <section class="lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col overflow-hidden shadow-sm">
          <div class="p-4 border-b border-outline-variant bg-surface-bright flex justify-between items-center">
            <span class="font-label-caps text-xs font-bold text-primary uppercase">Recognized Profiles</span>
            <span class="font-data-mono text-xs text-on-surface-variant">${this.guests.length} Guests</span>
          </div>

          <div class="flex-1 overflow-y-auto p-3 space-y-2 max-h-[540px]">
            ${this.guests.map((g) => {
              const isSelected = sel?.id === g.id;
              return `
                <div class="guest-card p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected ? 'border-primary bg-primary-fixed/40 shadow-sm' : 'border-outline-variant hover:border-primary bg-surface-container-lowest'
                }" data-id="${g.id}">
                  <div class="flex justify-between items-start">
                    <div>
                      <div class="font-bold text-sm text-primary">${g.first_name} ${g.last_name}</div>
                      <div class="text-[11px] text-on-surface-variant font-data-mono">${g.email || g.phone || 'No direct contact'}</div>
                    </div>
                    ${
                      g.vip_status && g.vip_status !== 'STANDARD'
                        ? `<span class="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-caps text-[10px] font-bold">${g.vip_status}</span>`
                        : ''
                    }
                  </div>
                  <div class="flex justify-between items-center mt-2 text-[11px] text-on-surface-variant border-t border-outline-variant/40 pt-1.5 font-data-mono">
                    <span>${g.total_stays || 0} Total Stays</span>
                    <span class="font-bold text-primary">$${parseFloat(g.lifetime_spend || 0).toLocaleString()} Spend</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </section>

        <!-- Right Column: Profile Detail Sheet (8 cols) -->
        <section class="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col overflow-hidden shadow-sm">
          ${
            !sel
              ? `<div class="p-16 text-center text-xs text-on-surface-variant italic">Select a guest from the directory to review CRM records.</div>`
              : `
                <!-- Profile Header -->
                <div class="p-6 border-b border-outline-variant bg-surface-bright flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div class="flex items-center gap-4">
                    <div class="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xl font-headline-lg flex-shrink-0 shadow">
                      ${sel.first_name[0]}${sel.last_name[0]}
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <h2 class="font-headline-lg text-xl font-bold text-primary">${sel.first_name} ${sel.last_name}</h2>
                        ${
                          sel.vip_status && sel.vip_status !== 'STANDARD'
                            ? `<span class="bg-secondary text-on-secondary font-label-caps text-xs px-2.5 py-0.5 rounded font-bold">${sel.vip_status} VIP</span>`
                            : ''
                        }
                      </div>
                      <div class="flex flex-wrap items-center gap-4 mt-1 text-xs text-on-surface-variant">
                        <span>${sel.nationality || 'International'} Citizen</span>
                        <span>•</span>
                        <span>Doc: ${sel.id_document_type || 'ID'} ${sel.id_document_number || 'Pending'}</span>
                      </div>
                    </div>
                  </div>

                  <div class="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-outline-variant">
                    <span class="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold block">LIFETIME REVENUE</span>
                    <span class="font-headline-sm text-xl text-secondary font-data-mono font-bold block">$${parseFloat(sel.lifetime_spend || 0).toLocaleString()}</span>
                    <span class="text-xs text-on-surface-variant font-data-mono">${sel.total_stays || 0} completed hotel stays</span>
                  </div>
                </div>

                <!-- Profile Body -->
                <div class="p-6 space-y-6 text-xs overflow-y-auto">
                  
                  <!-- Contact Card -->
                  <div class="bg-surface-bright p-4 rounded-lg border border-outline-variant">
                    <h3 class="font-label-caps text-[11px] text-primary uppercase font-bold mb-3 flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-[16px]">contact_phone</span> Contact Coordinates
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span class="text-on-surface-variant block mb-0.5">Email Address:</span>
                        <span class="font-semibold text-primary">${sel.email || 'None on file'}</span>
                      </div>
                      <div>
                        <span class="text-on-surface-variant block mb-0.5">Primary Phone:</span>
                        <span class="font-semibold text-primary">${sel.dial_code || ''} ${sel.phone || 'None on file'}</span>
                      </div>
                    </div>
                  </div>

                  <!-- VIP & Hospitality Preferences -->
                  <div class="bg-surface-bright p-4 rounded-lg border border-outline-variant">
                    <h3 class="font-label-caps text-[11px] text-primary uppercase font-bold mb-3 flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-[16px] text-secondary">hotel_class</span> VIP &amp; Stay Preferences
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div class="bg-surface-container-lowest p-3 rounded border border-outline-variant">
                        <span class="font-label-caps text-[10px] text-on-surface-variant block mb-1">PILLOW PREFERENCE</span>
                        <span class="font-bold text-primary">Goose Down (Firm)</span>
                      </div>
                      <div class="bg-surface-container-lowest p-3 rounded border border-outline-variant">
                        <span class="font-label-caps text-[10px] text-on-surface-variant block mb-1">ROOM LOCATION</span>
                        <span class="font-bold text-primary">High Floor Corner</span>
                      </div>
                      <div class="bg-surface-container-lowest p-3 rounded border border-outline-variant">
                        <span class="font-label-caps text-[10px] text-on-surface-variant block mb-1">DIETARY</span>
                        <span class="font-bold text-primary">Organic / Gluten-Free</span>
                      </div>
                    </div>
                  </div>

                </div>

                <!-- Footer Action -->
                <div class="p-4 border-t border-outline-variant bg-surface-bright flex justify-end">
                  <button id="btn-create-booking-for-guest" class="px-5 py-2.5 bg-primary text-on-primary rounded font-label-caps text-xs font-bold hover:bg-primary-container transition-all flex items-center gap-1.5 shadow">
                    <span class="material-symbols-outlined text-[16px]">add_circle</span>
                    Book New Stay for ${sel.first_name}
                  </button>
                </div>
              `
          }
        </section>

      </div>
    `;

    this.container.innerHTML = html;
    this.attachEvents();
  }

  attachEvents() {
    const searchInput = this.container.querySelector('#crm-main-search');
    if (searchInput) {
      let timer;
      searchInput.oninput = (e) => {
        clearTimeout(timer);
        this.searchQuery = e.target.value;
        timer = setTimeout(async () => {
          await this.loadData();
          this.renderContent();
        }, 300);
      };
    }

    this.container.querySelectorAll('.guest-card').forEach((card) => {
      card.onclick = () => {
        this.selectedGuest = this.guests.find((g) => g.id === card.dataset.id);
        this.renderContent();
      };
    });

    const bookForGuestBtn = this.container.querySelector('#btn-create-booking-for-guest');
    if (bookForGuestBtn && this.selectedGuest) {
      bookForGuestBtn.onclick = () => {
        Toast.show({ title: 'Pre-filled Booking', message: `Starting reservation for ${this.selectedGuest.first_name} ${this.selectedGuest.last_name}` });
      };
    }
  }
}
