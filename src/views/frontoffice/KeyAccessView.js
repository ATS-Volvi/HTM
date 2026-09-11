// ==========================================================================
// VOLVITECH HOSPITALITY OS — KEY & ACCESS MANAGEMENT VIEW
// Primary UI/UX Source: Google Stitch Screen 'Key & Access Management' (9987f08fcd2747b391a349d4144c86cf)
// ==========================================================================
import { reservationsClient } from '../../api/reservationsClient.js';
import { Toast } from '../../components/Toast.js';

export class KeyAccessView {
  constructor() {
    this.inHouseReservations = [];
    this.selectedRoom = '404';
    this.keyCount = 2;
    this.selectedGuest = 'Sophia Loren';
    this.accessZones = { elevator: true, gym: true, lounge: true, spa: true };
    this.isEncoding = false;
    this.container = null;

    this.activeKeys = [
      { id: 'RFID-404-A', room: '404', guest: 'Sophia Loren', type: 'RFID Keycard', issued: 'Today, 12:45 PM', expires: 'Sep 06, 11:00 AM', status: 'ACTIVE', battery: 92 },
      { id: 'RFID-404-B', room: '404', guest: 'Sophia Loren', type: 'RFID Keycard', issued: 'Today, 12:45 PM', expires: 'Sep 06, 11:00 AM', status: 'ACTIVE', battery: 92 },
      { id: 'BLE-402-M', room: '402', guest: 'Julian Vane', type: 'Digital Mobile Key (Apple Wallet)', issued: 'Sep 01, 03:15 PM', expires: 'Sep 04, 12:00 PM', status: 'ACTIVE', battery: 14 },
      { id: 'RFID-402-A', room: '402', guest: 'Julian Vane', type: 'RFID Keycard', issued: 'Sep 01, 03:12 PM', expires: 'Sep 04, 12:00 PM', status: 'ACTIVE', battery: 14 },
      { id: 'RFID-201-A', room: '201', guest: 'Jane Doe', type: 'RFID Keycard', issued: 'Sep 02, 02:00 PM', expires: 'Sep 05, 11:00 AM', status: 'ACTIVE', battery: 88 },
      { id: 'RFID-301-A', room: '301', guest: 'Marcus Aurelius', type: 'RFID Keycard', issued: 'Sep 02, 04:30 PM', expires: 'Sep 07, 11:00 AM', status: 'ACTIVE', battery: 76 },
    ];
  }

  async mount(container) {
    this.container = container;
    try {
      const res = await reservationsClient.getReservations();
      this.inHouseReservations = (res.data || []).filter((r) => r.status === 'CHECKED_IN');
      if (this.inHouseReservations.length > 0) {
        this.selectedRoom = this.inHouseReservations[0].allocated_room_number || '404';
        this.selectedGuest = `${this.inHouseReservations[0].first_name} ${this.inHouseReservations[0].last_name}`;
      }
    } catch (e) {
      console.error(e);
    }
    this.render();
  }

  render() {
    if (!this.container) return;

    const html = `
      <div class="space-y-6 animate-fadeIn text-xs">
        
        <!-- Page Header (Stitch 9987f08f) -->
        <header class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-outline-variant pb-4">
          <div>
            <div class="flex items-center gap-2 text-on-surface-variant mb-1">
              <span class="material-symbols-outlined text-[16px]">key</span>
              <span class="font-label-caps text-[11px] font-bold uppercase">Front Desk Operations</span>
              <span>/</span>
              <span class="font-label-caps text-[11px] font-bold text-primary uppercase">Key &amp; Access Management</span>
            </div>
            <h1 class="font-headline-lg text-2xl font-bold text-primary tracking-tight">Keycard Encoder &amp; Access Terminal</h1>
            <p class="text-on-surface-variant text-xs mt-0.5">Encode physical RFID guest cards, issue encrypted mobile wallet keys, and monitor lock battery health.</p>
          </div>

          <!-- Hardware Device Status Badge -->
          <div class="flex items-center gap-3 bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2 shadow-sm">
            <span class="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
            <div>
              <div class="text-[10px] font-label-caps uppercase font-bold text-emerald-800">Encoder Hardware Ready</div>
              <div class="text-[11px] font-data-mono text-on-surface-variant">Dormakaba Saflok RFID USB (Port 2)</div>
            </div>
          </div>
        </header>

        <!-- Bento Stats Grid -->
        <section class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-sm">
            <div class="flex justify-between items-center text-on-surface-variant font-label-caps text-[10px] font-bold uppercase">
              <span>Active Keycards</span>
              <span class="material-symbols-outlined text-[16px] text-primary">credit_card</span>
            </div>
            <div class="font-display-lg text-2xl font-data-mono font-bold text-primary mt-2">${this.activeKeys.length} Issued</div>
            <div class="text-[10px] text-emerald-600 mt-0.5 font-bold">100% Encrypted MIFARE DESFire</div>
          </div>

          <div class="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-sm">
            <div class="flex justify-between items-center text-on-surface-variant font-label-caps text-[10px] font-bold uppercase">
              <span>Digital Mobile Keys</span>
              <span class="material-symbols-outlined text-[16px] text-secondary">contactless</span>
            </div>
            <div class="font-display-lg text-2xl font-data-mono font-bold text-secondary mt-2">1 Active</div>
            <div class="text-[10px] text-on-surface-variant mt-0.5">Apple &amp; Google Wallet BLE</div>
          </div>

          <div class="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-sm">
            <div class="flex justify-between items-center text-on-surface-variant font-label-caps text-[10px] font-bold uppercase">
              <span>Low Lock Batteries</span>
              <span class="material-symbols-outlined text-[16px] text-rose-600">battery_alert</span>
            </div>
            <div class="font-display-lg text-2xl font-data-mono font-bold text-rose-700 mt-2">1 Lock</div>
            <div class="text-[10px] text-rose-600 mt-0.5 font-bold">Room 402 at 14% (Dispatch HK)</div>
          </div>

          <div class="bg-surface-container-lowest border border-outline-variant p-4 rounded-xl shadow-sm">
            <div class="flex justify-between items-center text-on-surface-variant font-label-caps text-[10px] font-bold uppercase">
              <span>Security Access Zones</span>
              <span class="material-symbols-outlined text-[16px] text-primary">lock</span>
            </div>
            <div class="font-display-lg text-2xl font-data-mono font-bold text-primary mt-2">4 Zones</div>
            <div class="text-[10px] text-on-surface-variant mt-0.5">Penthouse, Elevator, Spa, Gym</div>
          </div>
        </section>

        <!-- Main Layout: Keycard Encoding Console (Left) + Active Keys Directory (Right) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <!-- Left: Keycard Encoding Console (Stitch Card) -->
          <div class="lg:col-span-5 bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div class="flex items-center gap-3 border-b border-outline-variant pb-4 mb-5">
                <div class="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center border border-secondary/30">
                  <span class="material-symbols-outlined text-[22px]">contactless</span>
                </div>
                <div>
                  <h2 class="font-headline-sm text-base font-bold text-primary">Front Desk Keycard Encoder</h2>
                  <p class="text-[11px] text-on-surface-variant">Place physical card on reader pad or issue digital wallet pass.</p>
                </div>
              </div>

              <!-- Form Fields -->
              <div class="space-y-4">
                <div>
                  <label class="block font-label-caps text-[11px] font-bold text-on-surface-variant uppercase mb-1">Select In-House Room &amp; Guest *</label>
                  <select id="select-encode-room" class="w-full px-3 py-2 bg-surface border border-outline-variant rounded-lg text-xs font-medium text-on-surface focus:border-secondary">
                    ${this.inHouseReservations.map((r) => `
                      <option value="${r.allocated_room_number}" data-guest="${r.first_name} ${r.last_name}">
                        Room ${r.allocated_room_number || '404'} — ${r.first_name} ${r.last_name} (${r.reservation_number})
                      </option>
                    `).join('')}
                    ${this.inHouseReservations.length === 0 ? `
                      <option value="404" data-guest="Sophia Loren">Room 404 — Sophia Loren (#HX-8930)</option>
                      <option value="402" data-guest="Julian Vane">Room 402 — Julian Vane (#HX-8925)</option>
                      <option value="201" data-guest="Jane Doe">Room 201 — Jane Doe (#HX-8931)</option>
                    ` : ''}
                  </select>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block font-label-caps text-[11px] font-bold text-on-surface-variant uppercase mb-1">Keycard Quantity</label>
                    <div class="flex items-center gap-2 bg-surface border border-outline-variant rounded-lg p-1">
                      <button id="btn-dec-keys" type="button" class="w-7 h-7 bg-surface-container rounded font-bold text-primary flex items-center justify-center">-</button>
                      <span id="label-key-count" class="flex-1 text-center font-data-mono font-bold text-primary text-sm">${this.keyCount} Cards</span>
                      <button id="btn-inc-keys" type="button" class="w-7 h-7 bg-surface-container rounded font-bold text-primary flex items-center justify-center">+</button>
                    </div>
                  </div>

                  <div>
                    <label class="block font-label-caps text-[11px] font-bold text-on-surface-variant uppercase mb-1">Validity Expiration</label>
                    <input type="text" readonly value="Check-out: 12:00 PM" class="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded-lg text-xs font-data-mono text-on-surface-variant" />
                  </div>
                </div>

                <!-- Access Zones Matrix -->
                <div>
                  <label class="block font-label-caps text-[11px] font-bold text-on-surface-variant uppercase mb-2">Elevator &amp; Zone Permissions</label>
                  <div class="grid grid-cols-2 gap-2 bg-surface-container-low p-3 rounded-xl border border-outline-variant">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked class="rounded border-outline text-primary focus:ring-secondary" />
                      <span class="font-medium text-[11px]">Guest Room Access</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked class="rounded border-outline text-primary focus:ring-secondary" />
                      <span class="font-medium text-[11px]">Elevator &amp; Floor Lock</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked class="rounded border-outline text-primary focus:ring-secondary" />
                      <span class="font-medium text-[11px]">VIP Penthouse Sky Lounge</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked class="rounded border-outline text-primary focus:ring-secondary" />
                      <span class="font-medium text-[11px]">Spa Oasis &amp; Pool Deck</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-2 pt-4 border-t border-outline-variant">
              <button id="btn-write-card" type="button" class="w-full py-3 bg-secondary text-on-secondary rounded-xl font-label-caps text-xs font-bold hover:brightness-95 flex items-center justify-center gap-2 shadow transition-all">
                <span class="material-symbols-outlined text-[18px]">contactless</span>
                <span>Encode Physical RFID Keycard</span>
              </button>

              <button id="btn-send-mobile-key" type="button" class="w-full py-2.5 bg-surface-container border border-outline-variant hover:border-primary text-primary rounded-xl font-label-caps text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                <span class="material-symbols-outlined text-[18px] text-secondary">smartphone</span>
                <span>Send Apple / Google Wallet Key</span>
              </button>
            </div>
          </div>

          <!-- Right: Active Keycard Directory & Door Diagnostics (Stitch Table) -->
          <div class="lg:col-span-7 space-y-6">
            <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm space-y-4">
              <div class="flex justify-between items-center border-b border-outline-variant pb-3">
                <div>
                  <h3 class="font-headline-sm text-sm font-bold text-primary">Issued Keycards &amp; Credentials</h3>
                  <p class="text-[11px] text-on-surface-variant">Active credentials authorized for lock access.</p>
                </div>
                <span class="font-data-mono text-[11px] text-on-surface-variant">${this.activeKeys.length} Active Records</span>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-outline-variant text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                      <th class="py-2.5 px-3">Key ID</th>
                      <th class="py-2.5 px-3">Room</th>
                      <th class="py-2.5 px-3">Guest Name</th>
                      <th class="py-2.5 px-3">Type</th>
                      <th class="py-2.5 px-3">Lock Battery</th>
                      <th class="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-outline-variant/50 text-[11px]">
                    ${this.activeKeys.map((key) => `
                      <tr class="hover:bg-surface-container-low transition-colors">
                        <td class="py-3 px-3 font-data-mono font-bold text-primary">${key.id}</td>
                        <td class="py-3 px-3 font-data-mono font-semibold">Room ${key.room}</td>
                        <td class="py-3 px-3 font-medium text-primary">${key.guest}</td>
                        <td class="py-3 px-3 text-[10px] text-on-surface-variant">
                          <span class="inline-flex items-center gap-1">
                            <span class="material-symbols-outlined text-[13px] ${key.type.includes('Mobile') ? 'text-secondary' : 'text-primary'}">
                              ${key.type.includes('Mobile') ? 'smartphone' : 'credit_card'}
                            </span>
                            ${key.type}
                          </span>
                        </td>
                        <td class="py-3 px-3 font-data-mono">
                          <div class="flex items-center gap-1.5">
                            <span class="w-2 h-2 rounded-full ${key.battery <= 20 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}"></span>
                            <span class="${key.battery <= 20 ? 'text-rose-600 font-bold' : 'text-on-surface'}">${key.battery}%</span>
                          </div>
                        </td>
                        <td class="py-3 px-3 text-right">
                          <button class="btn-revoke-key px-2 py-1 text-rose-600 hover:bg-rose-50 rounded text-[10px] font-label-caps font-bold transition-colors" data-key-id="${key.id}">
                            Revoke
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Door Lock Diagnostics Card -->
            <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-sm flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span class="material-symbols-outlined text-[20px]">router</span>
                </div>
                <div>
                  <div class="font-bold text-primary text-xs">Zigbee / BLE Door Gateway Network Online</div>
                  <div class="text-[11px] text-on-surface-variant">20 of 20 Online Smart Locks synchronized in real-time. Latency: 12ms.</div>
                </div>
              </div>
              <button class="px-3 py-1.5 border border-outline-variant rounded-lg text-xs font-label-caps font-bold text-primary hover:bg-surface-container transition-colors">
                Run Diagnostics
              </button>
            </div>

          </div>

        </div>

      </div>
    `;

    this.container.innerHTML = html;
    this.attachEvents();
  }

  attachEvents() {
    // Key count
    const incBtn = this.container.querySelector('#btn-inc-keys');
    const decBtn = this.container.querySelector('#btn-dec-keys');
    const countLabel = this.container.querySelector('#label-key-count');

    if (incBtn && decBtn && countLabel) {
      incBtn.onclick = () => {
        if (this.keyCount < 4) {
          this.keyCount++;
          countLabel.textContent = `${this.keyCount} Cards`;
        }
      };
      decBtn.onclick = () => {
        if (this.keyCount > 1) {
          this.keyCount--;
          countLabel.textContent = `${this.keyCount} Cards`;
        }
      };
    }

    // Room select
    const roomSelect = this.container.querySelector('#select-encode-room');
    if (roomSelect) {
      roomSelect.onchange = (e) => {
        this.selectedRoom = e.target.value;
        const opt = roomSelect.options[roomSelect.selectedIndex];
        this.selectedGuest = opt.dataset.guest || 'Guest';
      };
    }

    // Write physical card
    const writeBtn = this.container.querySelector('#btn-write-card');
    if (writeBtn) {
      writeBtn.onclick = () => {
        writeBtn.disabled = true;
        writeBtn.innerHTML = `
          <span class="material-symbols-outlined animate-spin text-[18px]">sync</span>
          <span>Writing RFID Chip on Pad...</span>
        `;

        setTimeout(() => {
          writeBtn.disabled = false;
          writeBtn.innerHTML = `
            <span class="material-symbols-outlined text-[18px]">contactless</span>
            <span>Encode Physical RFID Keycard</span>
          `;

          const newKeyId = `RFID-${this.selectedRoom}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
          this.activeKeys.unshift({
            id: newKeyId,
            room: this.selectedRoom,
            guest: this.selectedGuest,
            type: 'RFID Keycard',
            issued: 'Just now',
            expires: 'Check-out 11:00 AM',
            status: 'ACTIVE',
            battery: 94,
          });

          Toast.show({
            title: 'Keycard Encoded Successfully',
            message: `${this.keyCount}x Card encoded for ${this.selectedGuest} (Room ${this.selectedRoom})`,
            type: 'success',
          });

          this.render();
        }, 1200);
      };
    }

    // Send mobile digital key
    const mobileBtn = this.container.querySelector('#btn-send-mobile-key');
    if (mobileBtn) {
      mobileBtn.onclick = () => {
        Toast.show({
          title: 'Digital Key Dispatched',
          message: `Encrypted Apple/Google Wallet pass sent via SMS to ${this.selectedGuest}`,
          type: 'success',
        });
      };
    }

    // Revoke key
    this.container.querySelectorAll('.btn-revoke-key').forEach((btn) => {
      btn.onclick = () => {
        const keyId = btn.dataset.keyId;
        this.activeKeys = this.activeKeys.filter((k) => k.id !== keyId);
        Toast.show({ title: 'Key Revoked', message: `Credential ${keyId} blacklisted immediately`, type: 'info' });
        this.render();
      };
    });
  }
}
