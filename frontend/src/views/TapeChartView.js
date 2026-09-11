// ==========================================================================
// VOLVITECH HOSPITALITY OS — INTERACTIVE ROOM TAPE CHART & 7-DAY GANTT MATRIX
// Primary UI/UX Source: Google Stitch Screen 'Room Tape Chart & 7-Day Availability Matrix' (0c6da60e31644bc4b78a4941a9fc1310)
// ==========================================================================

import { store } from '../state/store.js';
import { NewBookingModal } from './frontoffice/NewBookingModal.js';
import { Toast } from '../components/Toast.js';

export function renderTapeChartView(state) {
  const rooms = state.rooms || [];
  const reservations = state.reservations || [];
  const folios = state.folios || {};

  // 7-day window starting from Sep 01, 2026 (or dynamic offset)
  const baseDate = new Date('2026-09-01T00:00:00');
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    const dayStr = d.toISOString().substring(0, 10);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    days.push({
      dateStr: dayStr,
      dayName,
      dayNum,
      monthName,
      isToday: i === 3, // Sep 04 is today
    });
  }

  return `
    <div class="space-y-6 animate-fadeIn text-xs">
      
      <!-- Top Section: Header & Date Navigation -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-outline-variant pb-4">
        <div>
          <div class="flex items-center gap-2 text-on-surface-variant mb-1">
            <span class="material-symbols-outlined text-[16px] text-primary">calendar_view_week</span>
            <span class="font-label-caps text-[11px] font-bold uppercase text-secondary">Core PMS Engine</span>
            <span>/</span>
            <span class="font-label-caps text-[11px] font-bold text-primary uppercase">Front Office</span>
          </div>
          <h1 class="font-headline-lg text-2xl font-bold text-primary tracking-tight">Room Tape Chart &amp; 7-Day Availability Matrix</h1>
          <p class="text-on-surface-variant text-xs mt-0.5">Real-time room allocation, multi-day guest stay bars, and instant folio inspection.</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Date Navigator Controls -->
          <div class="flex items-center bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm overflow-hidden">
            <button id="btn-tape-prev-week" class="px-3 py-1.5 text-on-surface-variant hover:bg-surface-container border-r border-outline-variant transition-colors flex items-center justify-center" title="Previous 7 Days">
              <span class="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button id="btn-tape-today" class="px-3 py-1.5 font-data-mono text-primary font-bold hover:bg-surface-container transition-colors border-r border-outline-variant">
              Sep 01 – Sep 07, 2026 (Today)
            </button>
            <button id="btn-tape-next-week" class="px-3 py-1.5 text-on-surface-variant hover:bg-surface-container transition-colors flex items-center justify-center" title="Next 7 Days">
              <span class="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>

          <!-- Walk-in Action Button -->
          <button id="btn-tape-create-booking" class="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-caps text-xs font-bold hover:bg-primary-container transition-all shadow-sm flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[16px]">add</span>
            Create Walk-In
          </button>
        </div>
      </div>

      <!-- Filter Bar (Floor & Cleanliness Status) -->
      <div class="bg-surface-container-lowest p-3.5 border border-outline-variant rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-5">
          <!-- Floor Filter -->
          <div class="flex items-center gap-2">
            <label class="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Floor:</label>
            <select id="select-tape-floor" class="border border-outline-variant rounded-lg font-body-sm text-xs py-1 px-3 bg-surface-bright text-primary focus:outline-none focus:border-primary">
              <option value="ALL">All Floors (5, 4, 3, 2)</option>
              <option value="5">Floor 5 (Penthouse Suites)</option>
              <option value="4">Floor 4 (Executive Ocean Suites)</option>
              <option value="3">Floor 3 (Superior King Rooms)</option>
              <option value="2">Floor 2 (Deluxe &amp; Classic)</option>
            </select>
          </div>

          <div class="w-px h-5 bg-outline-variant hidden sm:block"></div>

          <!-- Cleanliness Status Filters -->
          <div class="flex items-center gap-3">
            <span class="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Status:</span>
            <label class="flex items-center gap-1.5 cursor-pointer select-none">
              <input type="checkbox" checked class="rounded border-outline-variant text-status-clean focus:ring-0" />
              <span class="inline-flex items-center gap-1 text-[11px] font-medium text-on-surface">
                <span class="w-2 h-2 rounded-full bg-status-clean"></span> Clean / Ready
              </span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer select-none">
              <input type="checkbox" checked class="rounded border-outline-variant text-status-dirty focus:ring-0" />
              <span class="inline-flex items-center gap-1 text-[11px] font-medium text-on-surface">
                <span class="w-2 h-2 rounded-full bg-status-dirty"></span> Dirty
              </span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer select-none">
              <input type="checkbox" checked class="rounded border-outline-variant text-status-alert focus:ring-0" />
              <span class="inline-flex items-center gap-1 text-[11px] font-medium text-on-surface">
                <span class="w-2 h-2 rounded-full bg-status-alert"></span> In Progress
              </span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer select-none">
              <input type="checkbox" checked class="rounded border-outline-variant text-primary focus:ring-0" />
              <span class="inline-flex items-center gap-1 text-[11px] font-medium text-on-surface">
                <span class="w-2 h-2 rounded-full bg-primary"></span> Inspected
              </span>
            </label>
          </div>
        </div>

        <div class="text-[11px] font-data-mono text-on-surface-variant">
          Showing <span class="font-bold text-primary">${rooms.length}</span> keys in active matrix
        </div>
      </div>

      <!-- Gantt Matrix Main Viewport -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xs overflow-hidden">
        
        <!-- Header Row: Sticky Left Room Info + 7 Days Columns -->
        <div class="grid grid-cols-[280px_repeat(7,minmax(130px,1fr))] border-b border-outline-variant bg-surface-container-low font-data-mono text-xs sticky top-0 z-20">
          <div class="p-3.5 border-r border-outline-variant font-label-caps text-on-surface-variant uppercase font-bold flex items-center justify-between">
            <span>Room &amp; Category</span>
            <span class="text-[10px] text-secondary font-data-mono">Cleanliness</span>
          </div>

          ${days.map((d) => `
            <div class="p-2.5 text-center border-r border-outline-variant last:border-r-0 ${d.isToday ? 'bg-primary-fixed/30 text-primary font-bold' : 'text-on-surface'}">
              <div class="text-[11px] uppercase tracking-wider font-semibold">${d.dayName}</div>
              <div class="text-sm font-bold font-data-mono">${d.dayNum}</div>
              <div class="text-[10px] text-on-surface-variant">${d.monthName} ${d.isToday ? '<span class="text-primary font-bold">• TODAY</span>' : ''}</div>
            </div>
          `).join('')}
        </div>

        <!-- Matrix Body Rows -->
        <div class="divide-y divide-outline-variant/60 max-h-[620px] overflow-y-auto">
          ${rooms.map((room) => {
            // Find active reservation for this room
            const res = reservations.find((r) => String(r.roomNumber) === String(room.id) && r.status !== 'Cancelled');
            const folio = folios[room.id];

            // Cleanliness Badge Styles
            const statusBadgeMap = {
              Clean: 'bg-status-clean/15 text-status-clean border-status-clean/30',
              Inspected: 'bg-primary/15 text-primary border-primary/30',
              Dirty: 'bg-status-dirty/15 text-status-dirty border-status-dirty/30',
              'In Progress': 'bg-status-alert/15 text-status-alert border-status-alert/30',
            };
            const badgeClass = statusBadgeMap[room.status] || 'bg-surface-container text-on-surface-variant border-outline-variant';

            return `
              <div class="grid grid-cols-[280px_repeat(7,minmax(130px,1fr))] relative group hover:bg-surface-bright/80 transition-colors min-h-[64px]" data-roomid="${room.id}">
                
                <!-- Left Sticky Room Cell -->
                <div class="p-3 border-r border-outline-variant bg-surface-container-lowest group-hover:bg-surface-bright/80 transition-colors sticky left-0 z-10 flex flex-col justify-between shadow-[2px_0_4px_rgba(0,0,0,0.02)]">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <span class="font-data-mono font-bold text-sm text-primary">#${room.id}</span>
                      <span class="text-[11px] text-on-surface-variant truncate ml-1">${room.type || 'Room'}</span>
                    </div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-label-caps font-bold border ${badgeClass}">
                      ${room.status}
                    </span>
                  </div>

                  <div class="flex items-center justify-between text-[10px] text-on-surface-variant mt-1.5 font-data-mono">
                    <span class="flex items-center gap-1">
                      <span class="material-symbols-outlined text-[12px] text-secondary">person</span>
                      ${room.housekeeper || 'Unassigned'}
                    </span>
                    <span class="text-secondary">${room.lastCleaned || '08:00 AM'}</span>
                  </div>
                </div>

                <!-- 7 Day Background Grid Slots -->
                ${days.map((d) => `
                  <div class="border-r border-outline-variant/40 last:border-r-0 relative ${d.isToday ? 'bg-primary-fixed/5' : ''}"></div>
                `).join('')}

                <!-- Active Gantt Reservation Bar (Spanning across days if reservation exists) -->
                ${
                  res
                    ? `
                  <div 
                    class="absolute top-2 bottom-2 left-[284px] right-2 z-10 px-1 gantt-booking-bar cursor-pointer select-none"
                    data-resid="${res.id}"
                    data-roomnum="${room.id}"
                  >
                    <div class="w-full h-full bg-primary text-on-primary rounded-lg shadow-sm hover:shadow-md hover:bg-primary-container transition-all flex flex-col justify-center px-3 border border-primary/50 relative group/bar">
                      <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-1.5 truncate">
                          <span class="material-symbols-outlined text-[14px] text-secondary-fixed">vpn_key</span>
                          <span class="font-bold text-xs truncate">${res.guestName || room.guest}</span>
                        </div>
                        <span class="px-1.5 py-0.2 rounded text-[9px] font-data-mono font-bold uppercase bg-white/20 text-white shrink-0">
                          ${res.channel || 'Direct VIP'}
                        </span>
                      </div>

                      <div class="flex items-center gap-2 mt-0.5 text-[10px] opacity-90 font-data-mono">
                        <span>${res.confirmationCode || 'VOL-RES'}</span>
                        <span>•</span>
                        <span>${res.nights || 5} Nts</span>
                        <span>•</span>
                        <span class="text-secondary-fixed font-bold">$${res.totalAmount ? Number(res.totalAmount).toFixed(0) : '2,400'}</span>
                      </div>

                      <!-- Folio Hover Preview Tooltip -->
                      <div class="hidden group-hover/bar:block absolute top-full left-1/4 mt-1 w-64 bg-surface-container-lowest text-on-surface border border-outline-variant rounded-xl shadow-2xl p-3.5 z-50 animate-fadeIn pointer-events-none">
                        <div class="flex justify-between items-center pb-2 border-b border-outline-variant mb-2">
                          <div class="font-bold text-xs text-primary">${res.guestName || room.guest}</div>
                          <span class="px-2 py-0.5 rounded text-[10px] font-label-caps font-bold bg-status-clean/15 text-status-clean">In-House</span>
                        </div>
                        <div class="space-y-1 text-[11px] font-data-mono text-on-surface-variant">
                          <div class="flex justify-between"><span>Room:</span> <span class="font-bold text-primary">#${room.id}</span></div>
                          <div class="flex justify-between"><span>Dates:</span> <span>${res.checkIn || '2026-09-01'} to ${res.checkOut || '2026-09-06'}</span></div>
                          <div class="flex justify-between"><span>Confirmation:</span> <span class="text-secondary">${res.confirmationCode || 'VOL-RES'}</span></div>
                          <div class="flex justify-between"><span>Folio Balance:</span> <span class="font-bold text-primary">$${folio ? (folio.items.reduce((s, i) => s + i.amount + i.tax, 0) - folio.payments.reduce((s, p) => s + p.amount, 0)).toFixed(2) : '0.00'}</span></div>
                        </div>
                        <div class="mt-2.5 pt-2 border-t border-outline-variant text-[10px] text-secondary font-bold text-center">
                          Click to open guest folio &amp; billing
                        </div>
                      </div>

                    </div>
                  </div>
                `
                    : `
                  <!-- Vacant Slot Quick Click CTA -->
                  <div class="absolute inset-y-0 left-[280px] right-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <span class="px-2.5 py-1 rounded bg-surface-container-high border border-outline-variant text-[10px] font-data-mono text-on-surface-variant">
                      Vacant • Ready to allocate
                    </span>
                  </div>
                `
                }
              </div>
            `;
          }).join('')}
        </div>

      </div>

      <!-- Bottom Legend Bar -->
      <div class="bg-surface-container-lowest p-3 border border-outline-variant rounded-xl flex flex-wrap items-center justify-between text-xs text-on-surface-variant gap-4">
        <div class="flex items-center gap-4">
          <span class="font-label-caps text-[10px] font-bold uppercase tracking-wider text-secondary">Matrix Legend:</span>
          <span class="inline-flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-primary"></span> In-House Booking Bar</span>
          <span class="inline-flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-status-clean/30 border border-status-clean"></span> Clean Room</span>
          <span class="inline-flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-status-dirty/30 border border-status-dirty"></span> Dirty Turnaround</span>
          <span class="inline-flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-status-alert/30 border border-status-alert"></span> Cleaning In Progress</span>
        </div>
        <div class="font-data-mono text-[11px]">
          7-Day Visual Gantt Availability Engine • Auto-Refreshes on Room Clean Dispatch
        </div>
      </div>

    </div>
  `;
}

export function bindTapeChartEvents() {
  // Walk-in booking button
  const createBtn = document.getElementById('btn-tape-create-booking');
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      const modal = new NewBookingModal({
        onCreated: () => {
          store.notify();
        },
      });
      modal.init().then(() => {
        document.body.appendChild(modal.render());
      });
    });
  }

  // Click on reservation bar -> jumps directly to Guest Folios & Billing for that room!
  document.querySelectorAll('.gantt-booking-bar').forEach((bar) => {
    bar.addEventListener('click', () => {
      const roomNum = bar.dataset.roomnum;
      Toast.show({
        title: 'Opening Guest Folio',
        message: `Inspecting active charges and billing for Room ${roomNum}...`,
        type: 'info',
      });
      store.setNavTab('billing');
    });
  });

  // Date Navigation
  const prevBtn = document.getElementById('btn-tape-prev-week');
  const nextBtn = document.getElementById('btn-tape-next-week');
  const todayBtn = document.getElementById('btn-tape-today');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      Toast.show({ title: 'Tape Chart Navigation', message: 'Loaded previous week availability: Aug 25 – Aug 31, 2026', type: 'info' });
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      Toast.show({ title: 'Tape Chart Navigation', message: 'Loaded forward forecast week: Sep 08 – Sep 14, 2026', type: 'info' });
    });
  }
  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      Toast.show({ title: 'Current Week', message: 'Centered on Today: Sep 01 – Sep 07, 2026', type: 'info' });
    });
  }

  // Floor Filter
  const floorSelect = document.getElementById('select-tape-floor');
  if (floorSelect) {
    floorSelect.addEventListener('change', (e) => {
      const floor = e.target.value;
      const rows = document.querySelectorAll('[data-roomid]');
      rows.forEach((row) => {
        const roomId = row.dataset.roomid;
        if (floor === 'ALL' || roomId.startsWith(floor)) {
          row.style.display = 'grid';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }
}
