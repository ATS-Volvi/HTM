// ==========================================================================
// VOLVITECH HOSPITALITY OS — ROOM READINESS VERIFIER MODAL
// Section 13 & 28: Strict enforcement of VACANT != READY
// Explicit Test: Room 204 is Vacant but Dirty -> Block assignment
// ==========================================================================

import { store } from '../../state/store.js';

export class RoomReadinessModal {
  constructor({ reservation, initialRoomNumber = '204', onAssigned, onClose }) {
    this.reservation = reservation;
    this.selectedRoomNumber = String(initialRoomNumber || reservation.assignedRoom || reservation.roomNumber || '204');
    this.onAssigned = onAssigned;
    this.onClose = onClose;
    this.container = null;
  }

  render() {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn';
    overlay.id = 'room-readiness-modal-overlay';
    this.container = overlay;

    this.renderContent();
    return overlay;
  }

  renderContent() {
    if (!this.container) return;

    const res = this.reservation;
    const roomNum = this.selectedRoomNumber;
    const readiness = store.checkRoomReadiness(roomNum);
    const room = (store.state.rooms || []).find(r => String(r.id) === String(roomNum));
    const allRooms = store.state.rooms || [];

    this.container.innerHTML = `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-bright">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl ${readiness.isReady ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'} flex items-center justify-center">
              <span class="material-symbols-outlined text-[22px]">
                ${readiness.isReady ? 'verified' : 'gpp_bad'}
              </span>
            </div>
            <div>
              <h3 class="font-headline-sm text-base font-bold text-primary">Front Desk Room Readiness Verification</h3>
              <p class="text-xs text-on-surface-variant">
                Enforcing Critical Rule: <strong>VACANT ≠ READY</strong>
              </p>
            </div>
          </div>
          <button id="btn-close-readiness-modal" class="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto space-y-5 text-xs flex-1 custom-scrollbar">
          
          <!-- Room Selector Switcher -->
          <div class="p-4 rounded-xl bg-surface-bright border border-outline-variant/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label class="block font-bold text-on-surface uppercase font-label-caps mb-1">Target Room for Assignment</label>
              <span class="text-xs text-on-surface-variant">Reservation for: <strong>${res.guestName}</strong> (${res.roomType})</span>
            </div>
            <select id="readiness-room-picker" class="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container font-bold text-xs text-primary">
              ${allRooms.map(rm => `
                <option value="${rm.id}" ${rm.id === roomNum ? 'selected' : ''}>
                  Room #${rm.id} (${rm.type} · Floor ${rm.floor} · ${rm.occupancy} · ${rm.status})
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Readiness Verdict Card -->
          <div class="p-5 rounded-2xl border ${
            readiness.isReady 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-950'
          }">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${
                  readiness.isReady ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                }">
                  <span class="material-symbols-outlined text-[26px]">
                    ${readiness.isReady ? 'done_all' : 'block'}
                  </span>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="text-base font-bold font-headline-sm">
                      ${readiness.isReady ? 'ROOM READY FOR ASSIGNMENT' : 'ROOM NOT READY — BLOCKED'}
                    </h4>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold font-data-mono uppercase ${
                      readiness.isReady ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                    }">
                      ${readiness.status}
                    </span>
                  </div>
                  <p class="text-xs opacity-90 mt-0.5">
                    ${readiness.isReady 
                      ? `Room #${roomNum} satisfies all operational cleanliness, inspection, and safety requirements.` 
                      : `Room #${roomNum} fails readiness validation. Front Desk cannot treat this room as Ready.`}
                  </p>
                </div>
              </div>
            </div>

            <!-- Reasons list if blocked -->
            ${!readiness.isReady ? `
              <div class="mt-4 pt-3 border-t border-rose-200/60 space-y-1.5">
                <span class="text-[10px] font-bold font-data-mono uppercase text-rose-800 tracking-wider">Blocking Reasons:</span>
                ${readiness.reasons.map(r => `
                  <div class="flex items-center gap-2 text-xs font-semibold text-rose-900">
                    <span class="material-symbols-outlined text-[16px] text-rose-600">cancel</span>
                    <span>${r}</span>
                  </div>
                `).join('')}
              </div>
            ` : `
              <!-- Green checklist if ready -->
              <div class="mt-4 pt-3 border-t border-emerald-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-semibold text-emerald-900">
                <div class="flex items-center gap-2"><span class="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span> Room is Vacant (Available)</div>
                <div class="flex items-center gap-2"><span class="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span> No Conflicting Allocation</div>
                <div class="flex items-center gap-2"><span class="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span> Room Cleaned & Serviced</div>
                <div class="flex items-center gap-2"><span class="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span> Room Inspected</div>
                <div class="flex items-center gap-2"><span class="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span> No Blocking Maintenance Issue</div>
                <div class="flex items-center gap-2"><span class="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span> Not Out of Order / Service</div>
              </div>
            `}
          </div>

          <!-- Remediation Actions (Section 28 Requirements) -->
          ${!readiness.isReady ? `
            <div class="p-4 rounded-xl bg-surface-bright border border-outline-variant/70 space-y-3">
              <h5 class="font-bold text-primary text-xs uppercase font-label-caps">Front Desk Resolution Options:</h5>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button id="btn-dispatch-housekeeping" class="p-2.5 rounded-lg border border-outline-variant hover:border-primary hover:bg-surface-container text-left transition-all cursor-pointer">
                  <div class="flex items-center gap-2 font-bold text-primary">
                    <span class="material-symbols-outlined text-[17px] text-amber-600">cleaning_services</span>
                    <span>Dispatch Urgent HK Cleaning</span>
                  </div>
                  <p class="text-[10px] text-on-surface-variant mt-0.5">Alert ${room?.housekeeper || 'Elena Gomez'} to prioritize Room #${roomNum}</p>
                </button>

                <button id="btn-sim-hk-ready" class="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 hover:border-emerald-500 text-left transition-all cursor-pointer">
                  <div class="flex items-center gap-2 font-bold text-emerald-800">
                    <span class="material-symbols-outlined text-[17px] text-emerald-600">verified</span>
                    <span>Mark Cleaned & Inspected</span>
                  </div>
                  <p class="text-[10px] text-emerald-700/80 mt-0.5">Simulate Housekeeping completing turnover</p>
                </button>
              </div>

              <!-- Re-check Button -->
              <div class="pt-2 flex items-center justify-between">
                <button id="btn-recheck-readiness" class="px-4 py-2 rounded-lg bg-surface-container border border-outline-variant text-xs font-bold text-primary hover:bg-surface-container-high flex items-center gap-2 cursor-pointer transition-all">
                  <span class="material-symbols-outlined text-[17px]">sync</span>
                  <span>Re-check Room Readiness</span>
                </button>

                <span class="text-[11px] text-on-surface-variant">
                  Or select an already ready alternative room (e.g. Room #205 or #206)
                </span>
              </div>
            </div>
          ` : ''}

        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-outline-variant/60 flex items-center justify-between bg-surface-bright">
          <button id="btn-cancel-readiness" class="px-4 py-2 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container transition-all cursor-pointer">
            Close
          </button>
          
          <button 
            id="btn-confirm-assign-room" 
            class="px-6 py-2.5 rounded-xl font-bold text-xs shadow-sm flex items-center gap-2 transition-all cursor-pointer ${
              readiness.isReady 
                ? 'bg-primary text-on-primary hover:bg-primary/90' 
                : 'bg-surface-container text-on-surface-variant/50 cursor-not-allowed'
            }"
            ${!readiness.isReady ? 'disabled' : ''}
          >
            <span class="material-symbols-outlined text-[18px]">assignment_turned_in</span>
            <span>Assign Room #${roomNum} to Reservation</span>
          </button>
        </div>

      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const root = this.container || document;
    const $ = (sel) => root.querySelector(sel.startsWith('#') || sel.startsWith('.') ? sel : `#${sel}`);

    const closeBtn = $('btn-close-readiness-modal');
    if (closeBtn) closeBtn.onclick = () => this.destroy();

    const cancelBtn = $('btn-cancel-readiness');
    if (cancelBtn) cancelBtn.onclick = () => this.destroy();

    const roomPicker = $('readiness-room-picker');
    if (roomPicker) {
      roomPicker.onchange = (e) => {
        this.selectedRoomNumber = e.target.value;
        this.renderContent();
      };
    }

    const recheckBtn = $('btn-recheck-readiness');
    if (recheckBtn) {
      recheckBtn.onclick = () => {
        store.showToast(`Re-checking readiness for Room #${this.selectedRoomNumber}...`, 'info');
        this.renderContent();
      };
    }

    const dispatchHkBtn = $('btn-dispatch-housekeeping');
    if (dispatchHkBtn) {
      dispatchHkBtn.onclick = () => {
        store.showToast(`Urgent housekeeping turnover dispatched for Room #${this.selectedRoomNumber}.`, 'warning');
      };
    }

    const simHkReadyBtn = $('btn-sim-hk-ready');
    if (simHkReadyBtn) {
      simHkReadyBtn.onclick = () => {
        const room = (store.state.rooms || []).find(r => String(r.id) === String(this.selectedRoomNumber));
        if (room) {
          room.status = 'Inspected';
          room.occupancy = 'Vacant';
        }
        store.showToast(`Housekeeping marked Room #${this.selectedRoomNumber} as CLEAN & INSPECTED.`, 'success');
        store.notify();
        this.renderContent();
      };
    }

    const confirmAssignBtn = $('btn-confirm-assign-room');
    if (confirmAssignBtn && !confirmAssignBtn.disabled) {
      confirmAssignBtn.onclick = () => {
        const assignRes = store.assignRoomToReservation(this.reservation.id, this.selectedRoomNumber);
        if (assignRes.success) {
          if (this.onAssigned) this.onAssigned(this.selectedRoomNumber);
          this.destroy();
        }
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
