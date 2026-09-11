// ==========================================================================
// VOLVITECH HOSPITALITY OS — GROUP & BLOCK MANAGEMENT VIEW
// Primary UI/UX Source: Google Stitch Screen 'Group & Block Management' (ce025f9667ff463883527710388e33a2)
// ==========================================================================
import { Toast } from '../../components/Toast.js';

export class GroupBlockView {
  constructor() {
    this.blocks = [
      {
        id: 'grp-1',
        name: 'Global Biotech Annual Summit',
        code: 'GRP-BIO-26',
        contact: 'Dr. Evelyn Reed (Reed Biotech Ltd)',
        checkIn: '2026-09-14',
        checkOut: '2026-09-18',
        allocatedRooms: 20,
        pickedUpRooms: 16,
        cutOffDate: '2026-09-08',
        status: 'DEFINITE',
        contractTotal: 22400.00,
      },
      {
        id: 'grp-2',
        name: 'Vanguard Global Partner Retreat',
        code: 'GRP-VG-11',
        contact: 'Julian Vane (Managing Director)',
        checkIn: '2026-09-20',
        checkOut: '2026-09-23',
        allocatedRooms: 12,
        pickedUpRooms: 10,
        cutOffDate: '2026-09-12',
        status: 'DEFINITE',
        contractTotal: 17280.00,
      },
      {
        id: 'grp-3',
        name: 'Kensington & Vance Wedding Party',
        code: 'GRP-KV-09',
        contact: 'Lady Eleanor Vance',
        checkIn: '2026-09-25',
        checkOut: '2026-09-28',
        allocatedRooms: 16,
        pickedUpRooms: 8,
        cutOffDate: '2026-09-15',
        status: 'TENTATIVE',
        contractTotal: 15360.00,
      },
    ];
    this.container = null;
  }

  render() {
    const el = document.createElement('div');
    el.className = 'w-full flex flex-col gap-6 animate-fadeIn pb-12';
    this.container = el;

    const totalBlocked = this.blocks.reduce((acc, b) => acc + b.allocatedRooms, 0);
    const totalPickedUp = this.blocks.reduce((acc, b) => acc + b.pickedUpRooms, 0);
    const totalValue = this.blocks.reduce((acc, b) => acc + b.contractTotal, 0);
    const overallPickupPct = Math.round((totalPickedUp / totalBlocked) * 100);

    const html = `
      <!-- Header -->
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-outline-variant pb-4 gap-4">
        <div>
          <h1 class="font-headline-lg text-2xl md:text-3xl font-bold text-primary">Group &amp; Block Management</h1>
          <p class="font-body-md text-xs text-on-surface-variant mt-1">
            Corporate event allocations, wedding room blocks, and automated cut-off attrition release.
          </p>
        </div>

        <button id="btn-new-group-block" class="bg-primary text-on-primary font-label-caps text-xs font-bold px-4 py-2 rounded hover:bg-primary-container transition-all flex items-center gap-1.5 shadow">
          <span class="material-symbols-outlined text-[16px]">add_box</span>
          New Group Block
        </button>
      </header>

      <!-- KPI Summary Row -->
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <span class="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold block mb-1">ACTIVE GROUPS</span>
          <span class="font-display-lg text-2xl md:text-3xl text-primary font-data-mono font-bold">${this.blocks.length} Contracts</span>
          <span class="text-[11px] text-on-surface-variant block mt-1">Definite &amp; Tentative</span>
        </div>

        <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <span class="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold block mb-1">TOTAL ROOMS BLOCKED</span>
          <span class="font-display-lg text-2xl md:text-3xl text-primary font-data-mono font-bold">${totalBlocked} Rooms</span>
          <span class="text-[11px] text-on-surface-variant block mt-1">Protected inventory</span>
        </div>

        <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <span class="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold block mb-1">PICKUP CONVERSION</span>
          <span class="font-display-lg text-2xl md:text-3xl text-emerald-700 font-data-mono font-bold">${overallPickupPct}%</span>
          <span class="text-[11px] text-on-surface-variant block mt-1">${totalPickedUp} of ${totalBlocked} picked up</span>
        </div>

        <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <span class="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold block mb-1">CONTRACT VALUE</span>
          <span class="font-display-lg text-2xl md:text-3xl text-secondary font-data-mono font-bold">$${totalValue.toLocaleString()}</span>
          <span class="text-[11px] text-secondary font-bold block mt-1">Guaranteed minimums</span>
        </div>
      </section>

      <!-- Group Blocks Directory Table (Stitch design) -->
      <section class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div class="p-4 border-b border-outline-variant bg-surface-bright flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[20px]">hub</span>
            <h3 class="font-headline-sm text-base font-bold text-primary">Master Allotment Ledger</h3>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left whitespace-nowrap min-w-[850px]">
            <thead>
              <tr class="bg-surface-container-low text-[11px] font-label-caps text-on-surface-variant uppercase tracking-wider">
                <th class="px-5 py-3 border-b border-outline-variant w-28">Code</th>
                <th class="px-5 py-3 border-b border-outline-variant">Group / Event Name</th>
                <th class="px-5 py-3 border-b border-outline-variant w-40">Stay Dates</th>
                <th class="px-5 py-3 border-b border-outline-variant w-48">Pickup Progress</th>
                <th class="px-5 py-3 border-b border-outline-variant w-32">Cut-off Date</th>
                <th class="px-5 py-3 border-b border-outline-variant text-right w-32">Contract Total</th>
                <th class="px-5 py-3 border-b border-outline-variant text-right w-28">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant text-xs">
              ${this.blocks.map((b) => {
                const pct = Math.round((b.pickedUpRooms / b.allocatedRooms) * 100);
                return `
                  <tr class="hover:bg-surface-bright transition-colors cursor-pointer group">
                    <td class="px-5 py-3 font-data-mono text-primary font-bold">${b.code}</td>
                    <td class="px-5 py-3">
                      <div class="font-bold text-primary">${b.name}</div>
                      <div class="text-[11px] text-on-surface-variant font-data-mono">${b.contact}</div>
                    </td>
                    <td class="px-5 py-3 font-data-mono text-on-surface-variant">
                      ${b.checkIn} &rarr; ${b.checkOut}
                    </td>
                    <td class="px-5 py-3">
                      <div class="flex items-center justify-between font-data-mono text-[11px] mb-1">
                        <span class="font-bold text-primary">${b.pickedUpRooms} / ${b.allocatedRooms} rms</span>
                        <span class="font-bold text-secondary">${pct}%</span>
                      </div>
                      <div class="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div class="h-full bg-secondary rounded-full" style="width: ${pct}%"></div>
                      </div>
                    </td>
                    <td class="px-5 py-3 font-data-mono text-on-surface-variant">
                      ${b.cutOffDate}
                    </td>
                    <td class="px-5 py-3 font-data-mono text-right font-bold text-primary">
                      $${b.contractTotal.toFixed(2)}
                    </td>
                    <td class="px-5 py-3 text-right">
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        b.status === 'DEFINITE' ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-secondary-fixed text-on-secondary-fixed'
                      }">
                        ${b.status}
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </section>
    `;

    this.container.innerHTML = html;
    this.attachEvents();
    return el;
  }

  attachEvents() {
    const btnNew = this.container.querySelector('#btn-new-group-block');
    if (btnNew) {
      btnNew.onclick = () => {
        const name = prompt('Enter Group / Conference Name:', 'Apex Tech Leadership Forum 2026');
        if (!name) return;
        const count = prompt('Enter room allotment count:', '15');
        if (!count || isNaN(count)) return;

        this.blocks.push({
          id: `grp-${Date.now()}`,
          name,
          code: `GRP-APX-${Math.floor(Math.random() * 89 + 10)}`,
          contact: 'Corporate Lead Planner',
          checkIn: '2026-09-18',
          checkOut: '2026-09-22',
          allocatedRooms: parseInt(count, 10),
          pickedUpRooms: 0,
          cutOffDate: '2026-09-11',
          status: 'TENTATIVE',
          contractTotal: parseInt(count, 10) * 4 * 280,
        });

        Toast.show({ title: 'Group Block Created', message: `${name} (${count} rooms) registered into PMS.`, type: 'success' });
        this.render();
      };
    }
  }
}
