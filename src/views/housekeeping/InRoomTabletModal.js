// ==========================================================================
// VOLVITECH HOSPITALITY OS — IN-ROOM GUEST TABLET (SUITE CONCIERGE PORTAL)
// Luxury In-Room Guest Touchscreen: DND Privacy, On-Demand Clean, Time Slots
// ==========================================================================

import { store } from '../../state/store.js';

export class InRoomTabletModal {
  constructor(roomId, onClose = null) {
    this.roomId = String(roomId || '402');
    this.onClose = onClose;
    this.selectedTimeSlot = null;
    this.selectedPreferences = [];
    this.container = null;
  }

  render() {
    this.container = document.createElement('div');
    this.container.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6 animate-fadeIn select-none';
    this.renderContent();
    return this.container;
  }

  getRoom() {
    const raw = (store.state.rooms || []).find(r => String(r.id) === this.roomId || String(r.roomNumber) === this.roomId);
    if (raw) return store.getRoomCombinedStatus(this.roomId) || raw;
    return {
      roomNumber: this.roomId,
      type: 'Deluxe Ocean Suite',
      guest: 'Mr. James Harrison',
      vip: true,
      dnd: false,
      cleanlinessStatus: 'Clean'
    };
  }

  renderContent() {
    if (!this.container) return;
    const room = this.getRoom();
    const guestName = room.guest || 'Valued Guest';
    const isDND = room.dnd || false;
    const activeSlot = room.cleaningSlot;
    const attemptNotice = room.lastAttemptNotice;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const slots = [
      { id: 'slot-morning', label: 'Morning Refresh', time: '09:00 – 10:30', icon: 'wb_sunny' },
      { id: 'slot-midday', label: 'Mid-Day Service', time: '11:00 – 12:30', icon: 'light_mode' },
      { id: 'slot-afternoon', label: 'Afternoon Quiet Clean', time: '14:00 – 15:30', icon: 'wb_twilight' },
      { id: 'slot-turndown', label: 'Evening Turndown', time: '18:00 – 19:30', icon: 'bedtime' }
    ];

    const preferenceOptions = [
      { id: 'pref-towels', label: 'Fresh Bath Sheets', icon: 'dry_cleaning' },
      { id: 'pref-linens', label: 'Complete Linen Change', icon: 'bed' },
      { id: 'pref-pillows', label: 'Extra Feather Pillows', icon: 'hotel' },
      { id: 'pref-toiletries', label: 'Restock Acqua Di Parma Toiletries', icon: 'soap' }
    ];

    this.container.innerHTML = `
      <!-- Simulated Luxury Hotel In-Room Tablet Device Chassis -->
      <div class="bg-slate-950 text-white rounded-3xl border-4 border-slate-700/80 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh] ring-1 ring-white/10">
        
        <!-- Device Top Bezel: Camera Notch & Status Bar -->
        <div class="px-6 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-data-mono">
          <div class="flex items-center gap-2">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span class="font-bold text-slate-200">Volvitech In-Room Tablet · Suite ${room.roomNumber}</span>
          </div>
          <div class="flex items-center gap-4">
            <span>${currentTime}</span>
            <span>22.5°C · Climate Set</span>
            <button id="btn-tablet-close" class="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer" title="Close Tablet Simulator">
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        <!-- Tablet Main Content Area -->
        <div class="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 custom-scrollbar bg-linear-to-b from-slate-900 to-slate-950">
          
          <!-- Guest Welcome & Suite Banner -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-[10px] font-bold uppercase tracking-widest text-primary font-data-mono">Luxury In-Room Concierge</span>
                ${room.vip ? '<span class="px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">VIP PLATINUM</span>' : ''}
              </div>
              <h2 class="text-xl font-bold font-headline-sm text-white">Welcome, ${guestName}</h2>
              <p class="text-xs text-slate-400 mt-0.5">${room.type} · Floor ${room.floor || '4'}</p>
            </div>

            <!-- Instant Do Not Disturb (DND) Switch -->
            <div class="flex items-center gap-3 p-2.5 rounded-xl bg-black/40 border border-white/10 self-start sm:self-center">
              <div class="text-right">
                <div class="text-xs font-bold ${isDND ? 'text-rose-400' : 'text-slate-300'}">
                  ${isDND ? 'DO NOT DISTURB ON' : 'Privacy: Normal'}
                </div>
                <div class="text-[10px] text-slate-400 font-data-mono leading-none mt-0.5">
                  ${isDND ? 'Knocking & entry blocked' : 'Service permitted'}
                </div>
              </div>
              <button 
                id="btn-tablet-toggle-dnd" 
                class="w-12 h-6 rounded-full transition-colors relative cursor-pointer ${isDND ? 'bg-rose-600' : 'bg-slate-700'}"
              >
                <span class="absolute top-1 ${isDND ? 'right-1' : 'left-1'} w-4 h-4 rounded-full bg-white transition-all shadow-sm"></span>
              </button>
            </div>
          </div>

          <!-- MISSED SERVICE NOTICE (IF ATTENDANT ATTEMPTED SERVICE BUT GUEST DID NOT ANSWER) -->
          ${attemptNotice ? `
            <div class="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 shadow-md space-y-2 animate-fadeIn">
              <div class="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <span class="material-symbols-outlined text-[18px]">privacy_tip</span>
                <span>Housekeeping Service Notice (${attemptNotice.time})</span>
              </div>
              <p class="text-xs text-amber-200/90 leading-relaxed">
                ${attemptNotice.message}
              </p>
              <div class="flex items-center gap-2 pt-1 text-[11px] font-data-mono text-amber-300/70">
                <span>Protocol: Entry strictly deferred to protect your privacy.</span>
              </div>
            </div>
          ` : ''}

          <!-- Live Cleaning Telemetry Pill -->
          <div class="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-primary text-[20px]">cleaning_services</span>
              <div>
                <div class="font-bold text-slate-200">Current Room Housekeeping State</div>
                <div class="text-[11px] text-slate-400">
                  Status: <span class="font-bold text-primary">${room.cleanlinessStatus}</span>
                  ${activeSlot ? ` · Scheduled Slot: <strong class="text-emerald-400">${activeSlot.startTime} – ${activeSlot.endTime} (${activeSlot.label})</strong>` : ''}
                </div>
              </div>
            </div>
            ${room.cleanlinessStatus === 'Inspected' ? `
              <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ✓ Inspected & Fresh
              </span>
            ` : ''}
          </div>

          <!-- SECTION 1: SCHEDULE PREFERRED TIME SLOT -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-bold text-white flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-primary text-[18px]">schedule</span>
                  Schedule a Preferred Cleaning Time Slot
                </h3>
                <p class="text-xs text-slate-400 mt-0.5">
                  Housekeeping will only visit during your selected window. They will never knock outside your slot.
                </p>
              </div>
            </div>

            <!-- Time Slot Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              ${slots.map(s => {
                const isCurrentActive = activeSlot && activeSlot.startTime === s.time.split(' – ')[0];
                const isSelected = this.selectedTimeSlot === s.id;
                return `
                  <div 
                    class="btn-tablet-slot p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isCurrentActive
                        ? 'bg-emerald-950/40 border-emerald-500 text-white ring-1 ring-emerald-500'
                        : isSelected
                        ? 'bg-primary/20 border-primary text-white ring-1 ring-primary'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                    }"
                    data-slot-id="${s.id}"
                    data-slot-label="${s.label}"
                    data-slot-time="${s.time}"
                  >
                    <div class="flex items-center gap-2.5">
                      <span class="material-symbols-outlined text-[20px] ${isCurrentActive ? 'text-emerald-400' : 'text-primary'}">${s.icon}</span>
                      <div>
                        <div class="font-bold text-xs text-white">${s.label}</div>
                        <div class="text-[11px] text-slate-400 font-data-mono">${s.time}</div>
                      </div>
                    </div>
                    ${isCurrentActive ? `
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 font-data-mono">
                        ACTIVE
                      </span>
                    ` : `
                      <span class="material-symbols-outlined text-[16px] text-slate-500">radio_button_unchecked</span>
                    `}
                  </div>
                `;
              }).join('')}
            </div>

            <button 
              id="btn-tablet-confirm-slot"
              class="w-full py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]">check</span>
              <span>Confirm Preferred Time Slot</span>
            </button>
          </div>

          <!-- SECTION 2: REQUEST HOUSEKEEPING NOW (ON-DEMAND) -->
          <div class="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-bold text-white flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-emerald-400 text-[18px]">bolt</span>
                  Need Immediate Housekeeping?
                </h3>
                <p class="text-xs text-slate-400 mt-0.5">
                  Tap to request prompt cleaning right away. Attendants will be notified immediately.
                </p>
              </div>
            </div>

            <!-- Preferences Checkboxes -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              ${preferenceOptions.map(p => `
                <label class="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:bg-slate-800 transition-colors cursor-pointer text-slate-300">
                  <input 
                    type="checkbox" 
                    class="tablet-pref-toggle w-3.5 h-3.5 rounded text-primary focus:ring-primary/20 accent-primary" 
                    data-pref-name="${p.label}"
                  />
                  <span class="material-symbols-outlined text-[16px] text-primary">${p.icon}</span>
                  <span class="text-[11px] font-medium truncate">${p.label}</span>
                </label>
              `).join('')}
            </div>

            <button 
              id="btn-tablet-request-now"
              class="w-full py-2.5 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs hover:brightness-110 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span class="material-symbols-outlined text-[16px]">touch_app</span>
              <span>Request Housekeeping Now (Immediate Dispatch)</span>
            </button>
          </div>

        </div>

        <!-- Device Bottom Bezel -->
        <div class="px-6 py-3 bg-slate-950 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
          <span>Hotel Room Automation v3.8</span>
          <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Guest Privacy Protocol Enforced</span>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    if (!this.container) return;

    // Close button
    const closeBtn = this.container.querySelector('#btn-tablet-close');
    if (closeBtn) {
      closeBtn.onclick = () => {
        if (this.onClose) this.onClose();
        this.container.remove();
      };
    }

    // DND Toggle
    const dndBtn = this.container.querySelector('#btn-tablet-toggle-dnd');
    if (dndBtn) {
      dndBtn.onclick = () => {
        store.toggleRoomDND(this.roomId);
        this.renderContent();
      };
    }

    // Time Slot Selection
    this.container.querySelectorAll('.btn-tablet-slot').forEach(card => {
      card.onclick = () => {
        this.selectedTimeSlot = card.dataset.slotId;
        this.selectedSlotLabel = card.dataset.slotLabel;
        this.selectedSlotTime = card.dataset.slotTime;
        this.renderContent();
      };
    });

    // Confirm Time Slot Button
    const confirmSlotBtn = this.container.querySelector('#btn-tablet-confirm-slot');
    if (confirmSlotBtn) {
      confirmSlotBtn.onclick = () => {
        if (!this.selectedSlotTime) {
          store.showToast('Please select a time slot above first', 'warning');
          return;
        }
        const [startTime, endTime] = this.selectedSlotTime.split(' – ');
        store.scheduleRoomCleaningSlot(this.roomId, {
          startTime: startTime.trim(),
          endTime: endTime.trim(),
          label: this.selectedSlotLabel || 'Preferred Window',
          preferences: this.selectedPreferences
        });
        this.renderContent();
      };
    }

    // Preference toggles
    this.container.querySelectorAll('.tablet-pref-toggle').forEach(chk => {
      chk.onchange = (e) => {
        const prefName = chk.dataset.prefName;
        if (e.target.checked) {
          if (!this.selectedPreferences.includes(prefName)) {
            this.selectedPreferences.push(prefName);
          }
        } else {
          this.selectedPreferences = this.selectedPreferences.filter(p => p !== prefName);
        }
      };
    });

    // Request Now Button
    const requestNowBtn = this.container.querySelector('#btn-tablet-request-now');
    if (requestNowBtn) {
      requestNowBtn.onclick = () => {
        store.requestRoomHousekeepingOnDemand(this.roomId, this.selectedPreferences);
        this.renderContent();
      };
    }
  }
}
