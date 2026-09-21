// ==========================================================================
// VOLVITECH HOSPITALITY OS — HOUSEKEEPING KNOCK & ENTRY PROTOCOL MODAL
// Strict Guest Privacy Enforcement: DND Guard, Time-Slot Verification,
// 3-Knock Announce Lifecycle & Mandatory No-Entry on No-Response
// ==========================================================================

import { store } from '../../state/store.js';

export class RoomEntryProtocolModal {
  constructor(roomId, onClose = null) {
    this.roomId = String(roomId || '402');
    this.onClose = onClose;
    this.container = null;
    this.knockStage = 0; // 0: Ready, 1: Knock 1, 2: Knock 2, 3: Knock 3
  }

  render() {
    this.container = document.createElement('div');
    this.container.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fadeIn select-none';
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
    const isDND = room.dnd;
    const activeSlot = room.cleaningSlot;

    this.container.innerHTML = `
      <div class="bg-surface-bright rounded-3xl border border-outline-variant shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface-container">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span class="material-symbols-outlined text-[24px]">door_front</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-bold text-on-surface">Room Entry Protocol · Room ${room.roomNumber}</h3>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold font-data-mono uppercase ${
                  room.occupancy === 'Occupied' ? 'bg-primary/10 text-primary' : 'bg-surface-container-high text-on-surface-variant'
                }">
                  ${room.occupancy}
                </span>
              </div>
              <p class="text-xs text-on-surface-variant">Attendant verification & strict guest privacy protocol</p>
            </div>
          </div>
          <button id="btn-close-protocol-modal" class="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Protocol Body -->
        <div class="p-6 space-y-4 text-xs">
          
          <!-- GATE 1: DND PRIVACY CHECK -->
          ${isDND ? `
            <div class="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 space-y-2">
              <div class="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-xs">
                <span class="material-symbols-outlined text-[20px]">do_not_disturb_on</span>
                <span>ENTRY BLOCKED: DO NOT DISTURB IS ACTIVE</span>
              </div>
              <p class="text-xs text-rose-800 dark:text-rose-200 leading-relaxed">
                Guest has engaged the digital Do Not Disturb privacy lock. Under luxury hospitality regulations, attendants are strictly forbidden from knocking, ringing the chime, or attempting room entry.
              </p>
              <div class="pt-2 flex justify-end">
                <button 
                  id="btn-protocol-dnd-abort"
                  class="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-all shadow-xs cursor-pointer"
                >
                  Acknowledge DND & Abort Service
                </button>
              </div>
            </div>
          ` : `
            <!-- GATE 2: SCHEDULED TIME SLOT CHECK -->
            ${activeSlot ? `
              <div class="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/50 flex items-start gap-2.5">
                <span class="material-symbols-outlined text-amber-600 text-[18px] shrink-0 mt-0.5">schedule</span>
                <div class="text-[11px] text-amber-800 dark:text-amber-200 leading-normal">
                  <strong class="font-bold">Scheduled Time Slot:</strong> Guest selected <strong class="font-mono text-amber-700 dark:text-amber-300">${activeSlot.startTime} – ${activeSlot.endTime} (${activeSlot.label})</strong> on in-room tablet. Confirm this visit is within or close to the requested window.
                </div>
              </div>
            ` : ''}

            <!-- GATE 3: 3-STAGE KNOCK & ANNOUNCE PROTOCOL -->
            <div class="p-4 rounded-2xl bg-surface-container border border-outline-variant space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="font-bold font-label-caps uppercase text-on-surface flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[16px] text-primary">notifications_active</span>
                  Standard Knock & Announce Sequence
                </h4>
                <span class="text-[10px] font-mono font-bold text-primary">Stage ${this.knockStage} of 3</span>
              </div>

              <!-- Visual Knock Pills -->
              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="p-2 rounded-xl border transition-all ${
                  this.knockStage >= 1 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-700 dark:text-emerald-300 font-bold' 
                    : 'bg-surface-bright border-outline-variant/60 text-on-surface-variant'
                }">
                  <span class="text-[10px] font-bold block uppercase">Knock 1</span>
                  <span class="text-[11px]">"Housekeeping!"</span>
                </div>
                <div class="p-2 rounded-xl border transition-all ${
                  this.knockStage >= 2 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-700 dark:text-emerald-300 font-bold' 
                    : 'bg-surface-bright border-outline-variant/60 text-on-surface-variant'
                }">
                  <span class="text-[10px] font-bold block uppercase">Knock 2 (Wait 10s)</span>
                  <span class="text-[11px]">"Housekeeping!"</span>
                </div>
                <div class="p-2 rounded-xl border transition-all ${
                  this.knockStage >= 3 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-700 dark:text-emerald-300 font-bold' 
                    : 'bg-surface-bright border-outline-variant/60 text-on-surface-variant'
                }">
                  <span class="text-[10px] font-bold block uppercase">Knock 3 (Final)</span>
                  <span class="text-[11px]">"Good morning!"</span>
                </div>
              </div>

              <div class="pt-1 flex justify-center">
                <button 
                  id="btn-execute-knock"
                  class="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  ${this.knockStage >= 3 ? 'disabled class="opacity-60 cursor-not-allowed"' : ''}
                >
                  <span class="material-symbols-outlined text-[16px]">touch_app</span>
                  <span>${this.knockStage === 0 ? 'Perform Knock 1' : this.knockStage === 1 ? 'Perform Knock 2' : this.knockStage === 2 ? 'Perform Knock 3 (Final)' : 'Sequence Completed'}</span>
                </button>
              </div>
            </div>

            <!-- GATE 4: RESPONSE DECISION (STRICT NO-ENTRY ON NO RESPONSE) -->
            <div class="p-4 rounded-2xl bg-surface-container border border-outline-variant space-y-3">
              <h4 class="font-bold font-label-caps uppercase text-on-surface flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px] text-primary">how_to_reg</span>
                Guest Response Determination
              </h4>
              <p class="text-xs text-on-surface-variant leading-relaxed">
                Hospitality Regulation: <strong>Attendants cannot enter the room if there is no response.</strong> Entry without confirmation violates guest privacy protocols.
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <!-- Option A: Guest Answered & Allowed Entry -->
                <button 
                  id="btn-outcome-answered"
                  class="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span class="material-symbols-outlined text-[18px]">key</span>
                  <span>Guest Answered & Entered</span>
                </button>

                <!-- Option B: No Response (Strict No-Entry Deferral) -->
                <button 
                  id="btn-outcome-no-response"
                  class="p-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span class="material-symbols-outlined text-[18px]">do_not_disturb</span>
                  <span>No Response (Do Not Enter)</span>
                </button>
              </div>
            </div>
          `}
        </div>

        <!-- Footer -->
        <div class="px-6 py-3 bg-surface-container-high border-t border-outline-variant/60 flex items-center justify-between text-[11px] text-on-surface-variant font-mono">
          <span>SOP-HK-401 · Occupied Room Entry Rules</span>
          <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Policy Active</span>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    if (!this.container) return;

    // Close button
    const closeBtn = this.container.querySelector('#btn-close-protocol-modal');
    if (closeBtn) {
      closeBtn.onclick = () => {
        if (this.onClose) this.onClose();
        this.container.remove();
      };
    }

    // DND Abort button
    const dndAbortBtn = this.container.querySelector('#btn-protocol-dnd-abort');
    if (dndAbortBtn) {
      dndAbortBtn.onclick = () => {
        store.recordRoomServiceAttempt(this.roomId, {
          outcome: 'DND_BLOCKED',
          attendant: 'Floor Attendant',
          notes: 'Visit aborted. Do Not Disturb active on suite.'
        });
        if (this.onClose) this.onClose();
        this.container.remove();
      };
    }

    // Execute Knock Button
    const knockBtn = this.container.querySelector('#btn-execute-knock');
    if (knockBtn) {
      knockBtn.onclick = () => {
        if (this.knockStage < 3) {
          this.knockStage++;
          store.showToast(`Room ${this.roomId}: Knock ${this.knockStage} performed ("Housekeeping!")`, 'info');
          this.renderContent();
        }
      };
    }

    // Outcome: Guest Answered & Allowed Entry
    const answeredBtn = this.container.querySelector('#btn-outcome-answered');
    if (answeredBtn) {
      answeredBtn.onclick = () => {
        store.recordRoomServiceAttempt(this.roomId, {
          outcome: 'GUEST_ANSWERED_ENTER',
          attendant: 'Floor Attendant',
          notes: 'Guest answered knock and granted entry. Turnover initiated.'
        });
        if (this.onClose) this.onClose();
        this.container.remove();
      };
    }

    // Outcome: No Response (Strict No-Entry Deferral)
    const noRespBtn = this.container.querySelector('#btn-outcome-no-response');
    if (noRespBtn) {
      noRespBtn.onclick = () => {
        store.recordRoomServiceAttempt(this.roomId, {
          outcome: 'NO_RESPONSE',
          attendant: 'Floor Attendant',
          notes: 'Attendant knocked x3. No guest response. Direct entry strictly prohibited; service deferred and tablet notified.'
        });
        if (this.onClose) this.onClose();
        this.container.remove();
      };
    }
  }
}
