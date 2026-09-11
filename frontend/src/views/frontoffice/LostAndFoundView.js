// ==========================================================================
// VOLVITECH HOSPITALITY OS — LOST & FOUND TERMINAL VIEW
// Primary UI/UX Source: Google Stitch Screen 'Lost & Found Management Terminal' (aaa404cd81c6476ca713a16c56229ee4)
// ==========================================================================
import { Toast } from '../../components/Toast.js';

export class LostAndFoundView {
  constructor() {
    this.container = null;
    this.filterCategory = 'ALL';
    this.filterStatus = 'ALL';

    this.items = [
      { id: 'LF-9821', name: 'Apple AirPods Pro (2nd Gen)', category: 'ELECTRONICS', room: '402', guest: 'Julian Vane', date: 'Today, 11:30 AM', staff: 'Elena R. (Housekeeping)', status: 'MATCHED', storage: 'Locker B-12' },
      { id: 'LF-9820', name: 'Montblanc Meisterstück Rollerball Pen', category: 'VALUABLES', room: '404', guest: 'Sophia Loren', date: 'Yesterday, 04:15 PM', staff: 'Carlos M. (Concierge)', status: 'MATCHED', storage: 'Safe Vault 1' },
      { id: 'LF-9819', name: 'Navy Cashmere Scarf', category: 'APPAREL', room: 'Lobby Lounge', guest: 'Unassigned', date: 'Sep 01, 09:00 PM', staff: 'Front Desk Night Audit', status: 'UNCLAIMED', storage: 'Bin 4' },
      { id: 'LF-9818', name: 'Passport & Leather Travel Wallet', category: 'DOCUMENTS', room: '201', guest: 'Jane Doe', date: 'Sep 01, 02:20 PM', staff: 'Elena R. (Housekeeping)', status: 'RETURNED', storage: 'Returned at Desk' },
      { id: 'LF-9817', name: 'Ray-Ban Aviator Sunglasses (Gold)', category: 'ACCESSORIES', room: 'Pool Deck Cabana 4', guest: 'Unassigned', date: 'Aug 30, 05:00 PM', staff: 'Pool Attendant', status: 'UNCLAIMED', storage: 'Bin 2' },
    ];
  }

  mount(container) {
    this.container = container;
    this.render();
  }

  render() {
    if (!this.container) return;

    let filtered = this.items;
    if (this.filterCategory !== 'ALL') {
      filtered = filtered.filter((i) => i.category === this.filterCategory);
    }
    if (this.filterStatus !== 'ALL') {
      filtered = filtered.filter((i) => i.status === this.filterStatus);
    }

    const html = `
      <div class="space-y-6 animate-fadeIn text-xs">
        
        <!-- Page Header (Stitch aaa404cd) -->
        <header class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-outline-variant pb-4">
          <div>
            <div class="flex items-center gap-2 text-on-surface-variant mb-1">
              <span class="material-symbols-outlined text-[16px]">inventory_2</span>
              <span class="font-label-caps text-[11px] font-bold uppercase">Front Desk Operations</span>
              <span>/</span>
              <span class="font-label-caps text-[11px] font-bold text-primary uppercase">Lost &amp; Found Terminal</span>
            </div>
            <h1 class="font-headline-lg text-2xl font-bold text-primary tracking-tight">Lost &amp; Found Management Console</h1>
            <p class="text-on-surface-variant text-xs mt-0.5">Intake property left behind by guests, match items with stay profiles, and manage locker vaults.</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2.5">
            <button id="btn-print-lf-log" class="px-3.5 py-2 border border-outline-variant rounded-lg text-primary text-xs font-label-caps font-bold hover:bg-surface-container transition-colors flex items-center gap-1.5 shadow-sm">
              <span class="material-symbols-outlined text-[16px]">print</span>
              Print Log
            </button>
            <button id="btn-log-new-item" class="px-4 py-2 bg-secondary text-on-secondary rounded-lg text-xs font-label-caps font-bold hover:brightness-95 transition-all flex items-center gap-1.5 shadow-sm">
              <span class="material-symbols-outlined text-[16px]">add</span>
              Log Found Item
            </button>
          </div>
        </header>

        <!-- Bento Metrics Row -->
        <section class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-sm">
            <div class="flex justify-between items-center text-on-surface-variant font-label-caps text-[10px] font-bold uppercase">
              <span>Unclaimed In Vault</span>
              <span class="material-symbols-outlined text-[16px] text-amber-600">inventory_2</span>
            </div>
            <div class="font-display-lg text-2xl font-data-mono font-bold text-primary mt-2">
              ${this.items.filter((i) => i.status === 'UNCLAIMED').length} Items
            </div>
            <div class="text-[10px] text-on-surface-variant mt-0.5 font-data-mono">Locker Banks A &amp; B</div>
          </div>

          <div class="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-sm">
            <div class="flex justify-between items-center text-on-surface-variant font-label-caps text-[10px] font-bold uppercase">
              <span>Matched to Guests</span>
              <span class="material-symbols-outlined text-[16px] text-secondary">person_search</span>
            </div>
            <div class="font-display-lg text-2xl font-data-mono font-bold text-secondary mt-2">
              ${this.items.filter((i) => i.status === 'MATCHED').length} Matched
            </div>
            <div class="text-[10px] text-emerald-600 mt-0.5 font-bold">Contact details identified</div>
          </div>

          <div class="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-sm">
            <div class="flex justify-between items-center text-on-surface-variant font-label-caps text-[10px] font-bold uppercase">
              <span>Successfully Returned</span>
              <span class="material-symbols-outlined text-[16px] text-emerald-600">handshake</span>
            </div>
            <div class="font-display-lg text-2xl font-data-mono font-bold text-emerald-700 mt-2">
              ${this.items.filter((i) => i.status === 'RETURNED').length + 94} Returned
            </div>
            <div class="text-[10px] text-emerald-600 mt-0.5 font-bold">98.2% Resolution Rate</div>
          </div>

          <div class="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-sm">
            <div class="flex justify-between items-center text-on-surface-variant font-label-caps text-[10px] font-bold uppercase">
              <span>Secure Vault Storage</span>
              <span class="material-symbols-outlined text-[16px] text-primary">lock</span>
            </div>
            <div class="font-display-lg text-2xl font-data-mono font-bold text-primary mt-2">82% Cap</div>
            <div class="text-[10px] text-on-surface-variant mt-0.5">Locker Room Front Desk</div>
          </div>
        </section>

        <!-- Filter Bar -->
        <div class="flex flex-wrap items-center justify-between gap-3 bg-surface-container-lowest p-3 rounded-xl border border-outline-variant">
          <div class="flex items-center gap-2">
            <span class="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase mr-1">Category:</span>
            <button class="filter-cat-btn px-2.5 py-1 rounded-md text-xs font-label-caps font-bold transition-all ${this.filterCategory === 'ALL' ? 'bg-primary text-on-primary' : 'hover:bg-surface-container text-on-surface'}" data-cat="ALL">All Categories</button>
            <button class="filter-cat-btn px-2.5 py-1 rounded-md text-xs font-label-caps font-bold transition-all ${this.filterCategory === 'ELECTRONICS' ? 'bg-primary text-on-primary' : 'hover:bg-surface-container text-on-surface'}" data-cat="ELECTRONICS">Electronics</button>
            <button class="filter-cat-btn px-2.5 py-1 rounded-md text-xs font-label-caps font-bold transition-all ${this.filterCategory === 'VALUABLES' ? 'bg-primary text-on-primary' : 'hover:bg-surface-container text-on-surface'}" data-cat="VALUABLES">Valuables</button>
            <button class="filter-cat-btn px-2.5 py-1 rounded-md text-xs font-label-caps font-bold transition-all ${this.filterCategory === 'DOCUMENTS' ? 'bg-primary text-on-primary' : 'hover:bg-surface-container text-on-surface'}" data-cat="DOCUMENTS">Documents</button>
          </div>

          <div class="flex items-center gap-2">
            <span class="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase mr-1">Status:</span>
            <select id="select-lf-status" class="px-2.5 py-1 bg-surface border border-outline-variant rounded-md text-xs font-medium text-on-surface focus:border-secondary">
              <option value="ALL" ${this.filterStatus === 'ALL' ? 'selected' : ''}>All Statuses</option>
              <option value="UNCLAIMED" ${this.filterStatus === 'UNCLAIMED' ? 'selected' : ''}>Unclaimed</option>
              <option value="MATCHED" ${this.filterStatus === 'MATCHED' ? 'selected' : ''}>Matched to Guest</option>
              <option value="RETURNED" ${this.filterStatus === 'RETURNED' ? 'selected' : ''}>Returned</option>
            </select>
          </div>
        </div>

        <!-- Lost & Found Directory Table -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm space-y-4">
          <div class="flex justify-between items-center border-b border-outline-variant pb-3">
            <div>
              <h3 class="font-headline-sm text-sm font-bold text-primary">Found Property Catalog</h3>
              <p class="text-[11px] text-on-surface-variant">Logged items stored in secure hotel vaults awaiting retrieval.</p>
            </div>
            <span class="font-data-mono text-[11px] text-on-surface-variant">${filtered.length} Items Listed</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-outline-variant text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  <th class="py-2.5 px-3">Item Tag</th>
                  <th class="py-2.5 px-3">Item Description</th>
                  <th class="py-2.5 px-3">Location Found</th>
                  <th class="py-2.5 px-3">Matched Guest</th>
                  <th class="py-2.5 px-3">Date &amp; Staff</th>
                  <th class="py-2.5 px-3">Storage Locker</th>
                  <th class="py-2.5 px-3">Status</th>
                  <th class="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/50 text-[11px]">
                ${filtered.map((item) => {
                  let badge = 'bg-amber-100 text-amber-800 border-amber-300';
                  if (item.status === 'MATCHED') badge = 'bg-blue-100 text-blue-800 border-blue-300';
                  if (item.status === 'RETURNED') badge = 'bg-emerald-100 text-emerald-800 border-emerald-300';

                  return `
                    <tr class="hover:bg-surface-container-low transition-colors">
                      <td class="py-3 px-3 font-data-mono font-bold text-primary">${item.id}</td>
                      <td class="py-3 px-3 font-medium text-primary">${item.name}</td>
                      <td class="py-3 px-3 font-data-mono">Room ${item.room}</td>
                      <td class="py-3 px-3">
                        ${item.guest !== 'Unassigned' ? `
                          <div class="flex items-center gap-1.5 font-bold text-primary">
                            <span class="material-symbols-outlined text-[14px] text-secondary">person</span>
                            <span>${item.guest}</span>
                          </div>
                        ` : `<span class="text-on-surface-variant italic">Unassigned</span>`}
                      </td>
                      <td class="py-3 px-3">
                        <div class="text-[10px] text-on-surface-variant font-data-mono">${item.date}</div>
                        <div class="text-[10px] text-on-surface-variant">${item.staff}</div>
                      </td>
                      <td class="py-3 px-3 font-data-mono text-[10px]">${item.storage}</td>
                      <td class="py-3 px-3">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge}">
                          ${item.status}
                        </span>
                      </td>
                      <td class="py-3 px-3 text-right space-x-1">
                        ${item.status !== 'RETURNED' ? `
                          <button class="btn-claim-item px-2.5 py-1 bg-secondary text-on-secondary hover:brightness-95 rounded text-[10px] font-label-caps font-bold transition-all shadow-xs" data-item-id="${item.id}">
                            Return to Guest
                          </button>
                        ` : `
                          <span class="text-[10px] text-emerald-600 font-bold font-data-mono">Delivered</span>
                        `}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;

    this.container.innerHTML = html;
    this.attachEvents();
  }

  attachEvents() {
    // Filter categories
    this.container.querySelectorAll('.filter-cat-btn').forEach((btn) => {
      btn.onclick = () => {
        this.filterCategory = btn.dataset.cat;
        this.render();
      };
    });

    // Status filter
    const statusSelect = this.container.querySelector('#select-lf-status');
    if (statusSelect) {
      statusSelect.onchange = (e) => {
        this.filterStatus = e.target.value;
        this.render();
      };
    }

    // Return to guest button
    this.container.querySelectorAll('.btn-claim-item').forEach((btn) => {
      btn.onclick = () => {
        const id = btn.dataset.itemId;
        const item = this.items.find((i) => i.id === id);
        if (item) {
          item.status = 'RETURNED';
          item.storage = 'Returned at Front Desk';
          Toast.show({
            title: 'Item Returned to Guest',
            message: `${item.name} (${item.id}) marked returned to ${item.guest}`,
            type: 'success',
          });
          this.render();
        }
      };
    });

    // Log new found item prompt
    const logBtn = this.container.querySelector('#btn-log-new-item');
    if (logBtn) {
      logBtn.onclick = () => {
        const name = prompt('Enter Item Description (e.g. Gold Bracelet, Laptop Charger):', 'Silver Watch');
        if (!name) return;
        const room = prompt('Enter Room or Location Found (e.g. 402, Gym, Pool):', '404');
        if (!room) return;

        const newId = `LF-${Math.floor(1000 + Math.random() * 9000)}`;
        this.items.unshift({
          id: newId,
          name,
          category: 'VALUABLES',
          room,
          guest: room === '404' ? 'Sophia Loren' : 'Unassigned',
          date: 'Just now',
          staff: 'Front Desk Agent',
          status: room === '404' ? 'MATCHED' : 'UNCLAIMED',
          storage: 'Vault Locker A-1',
        });

        Toast.show({
          title: 'Found Item Logged',
          message: `Item #${newId} logged and secured in Vault Locker A-1`,
          type: 'success',
        });

        this.render();
      };
    }

    // Print Log
    const printBtn = this.container.querySelector('#btn-print-lf-log');
    if (printBtn) {
      printBtn.onclick = () => {
        window.print();
      };
    }
  }
}
