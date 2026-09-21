// ==========================================================================
// VOLVITECH HOSPITALITY OS — HOUSEKEEPING STAFF & ATTENDANT ROSTER
// Comprehensive Staff Management: Duty Shifts, Workload Balancing, Floor Zoning
// ==========================================================================

import { store } from '../../state/store.js';
import { Toast } from '../../components/Toast.js';

export class StaffMembersView {
  constructor() {
    this.container = null;
    this.activeFilter = 'ALL'; // 'ALL', 'ON_DUTY', 'OFF_DUTY', 'FLOOR_ZONE'
    this.activeStaffModal = false; // Add staff modal
    this.activeInspectStaffId = null; // View assigned rooms modal
    this.editingStaffId = null;
    this.unsubscribe = null;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER LIFECYCLE
  // ──────────────────────────────────────────────────────────────────────────
  render() {
    this.container = document.createElement('div');
    this.container.className = 'w-full space-y-6 animate-fadeIn pb-12';
    this.renderContent();

    // Subscribe to store updates
    if (this.unsubscribe) {
      try { this.unsubscribe(); } catch (_) {}
    }
    this.unsubscribe = store.subscribe(() => {
      this.renderContent();
    });

    return this.container;
  }

  destroy() {
    if (this.unsubscribe) {
      try { this.unsubscribe(); } catch (_) {}
      this.unsubscribe = null;
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // DATA COMPUTATION
  // ──────────────────────────────────────────────────────────────────────────
  getRosterData() {
    const staffList = store.getHousekeepingStaff();
    const rooms = store.state.rooms || [];
    const tasks = store.state.housekeepingTasks || [];
    const requests = store.state.housekeepingRequests || [];

    const enrichedStaff = staffList.map(staff => {
      const staffName = staff.name;
      const assignedRooms = rooms.filter(r => 
        r.housekeeper === staffName || 
        (r.housekeeper && r.housekeeper.toLowerCase().includes(staffName.toLowerCase())) ||
        (staff.name.includes(' ') && r.housekeeper === staff.name.split(' ')[0])
      );
      const activeTasks = tasks.filter(t => 
        t.assignedTo === staffName || 
        (t.assignedTo && t.assignedTo.toLowerCase().includes(staffName.toLowerCase())) ||
        (staff.name.includes(' ') && t.assignedTo === staff.name.split(' ')[0])
      );
      const activeRequests = requests.filter(r => 
        (r.assignedTo === staffName || 
        (r.assignedTo && r.assignedTo.toLowerCase().includes(staffName.toLowerCase())) ||
        (staff.name.includes(' ') && r.assignedTo === staff.name.split(' ')[0])) &&
        r.status !== 'Completed'
      );

      // Compute utilized credits
      const utilizedCredits = activeTasks.reduce((acc, t) => acc + (Number(t.credits) || 3.0), 0);
      const maxCredits = staff.maxCredits || 14.0;
      const loadPercentage = Math.min(Math.round((utilizedCredits / maxCredits) * 100), 100);

      // Active in-progress activity description
      let currentActivity = 'Available for dispatch';
      const inProgressTask = activeTasks.find(t => t.status === 'In Progress' || t.status === 'Cleaning');
      const inProgressReq = activeRequests.find(r => r.status === 'In-Progress' || r.status === 'Assigned');

      if (inProgressTask) {
        currentActivity = `Cleaning Room #${inProgressTask.roomNumber} (${inProgressTask.type || 'Turnaround'})`;
      } else if (inProgressReq) {
        currentActivity = `Fulfilling: ${inProgressReq.item} (Room #${inProgressReq.roomNumber})`;
      } else if (assignedRooms.length > 0) {
        currentActivity = `${assignedRooms.length} room(s) assigned in queue`;
      }

      return {
        ...staff,
        assignedRooms,
        activeTasks,
        activeRequests,
        utilizedCredits,
        maxCredits,
        loadPercentage,
        currentActivity
      };
    });

    const onDutyCount = enrichedStaff.filter(s => s.onDuty).length;
    const offDutyCount = enrichedStaff.length - onDutyCount;

    let displayList = enrichedStaff;
    if (this.activeFilter === 'ON_DUTY') displayList = enrichedStaff.filter(s => s.onDuty);
    else if (this.activeFilter === 'OFF_DUTY') displayList = enrichedStaff.filter(s => !s.onDuty);

    return {
      all: enrichedStaff,
      displayList,
      totalCount: enrichedStaff.length,
      onDutyCount,
      offDutyCount
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // VIEW RENDERER
  // ──────────────────────────────────────────────────────────────────────────
  renderContent() {
    if (!this.container) return;

    const roster = this.getRosterData();

    this.container.innerHTML = `
      <!-- ================================================================= -->
      <!-- 1. STAFF ROSTER HEADER -->
      <!-- ================================================================= -->
      <section class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs">
        <div>
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-xs">
              <span class="material-symbols-outlined text-[24px]">badge</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="font-headline-sm text-lg md:text-xl font-bold text-primary tracking-tight">Housekeeping Staff &amp; Attendant Roster</h1>
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold font-data-mono border border-emerald-300">
                  ● ${roster.onDutyCount} Attendants Active on Shift
                </span>
              </div>
              <p class="text-xs text-on-surface-variant mt-0.5">
                Staff capacity allocation, shift duty status, floor zone coverage, and room assignment telemetry.
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2.5 flex-wrap">
          <button id="btn-open-add-staff-modal" class="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
            <span class="material-symbols-outlined text-[18px]">person_add</span>
            <span>+ Add Attendant</span>
          </button>

          <button id="btn-refresh-staff" class="p-2.5 rounded-xl border border-outline-variant hover:bg-surface-container text-primary font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95" title="Refresh Staff Roster">
            <span class="material-symbols-outlined text-[18px]">refresh</span>
          </button>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- 2. SHIFT CAPACITY KPI STRIP -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <!-- On Duty Attendants -->
        <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant flex items-center justify-between shadow-xs">
          <div>
            <span class="text-[10px] font-bold uppercase font-data-mono text-emerald-900 block">ON-DUTY FLOOR ATTENDANTS</span>
            <div class="text-2xl font-black font-data-mono text-emerald-800 leading-none mt-1">${roster.onDutyCount} Active</div>
            <span class="text-[11px] text-emerald-700 font-medium mt-0.5 block">Morning Shift (07:00 - 15:30)</span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <span class="material-symbols-outlined text-[22px]">groups</span>
          </div>
        </div>

        <!-- Total Registered Staff -->
        <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant flex items-center justify-between shadow-xs">
          <div>
            <span class="text-[10px] font-bold uppercase font-data-mono text-primary block">TOTAL REGISTERED TEAM</span>
            <div class="text-2xl font-black font-data-mono text-primary leading-none mt-1">${roster.totalCount} Staff</div>
            <span class="text-[11px] text-on-surface-variant mt-0.5 block">${roster.offDutyCount} off-duty / night roster</span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-surface-container text-on-surface flex items-center justify-center">
            <span class="material-symbols-outlined text-[22px]">assignment_ind</span>
          </div>
        </div>

        <!-- Floor Zone Coverage -->
        <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant flex items-center justify-between shadow-xs">
          <div>
            <span class="text-[10px] font-bold uppercase font-data-mono text-blue-900 block">FLOOR COVERAGE</span>
            <div class="text-2xl font-black font-data-mono text-blue-800 leading-none mt-1">100%</div>
            <span class="text-[11px] text-blue-700 font-medium mt-0.5 block">Floors 1 through 6 covered</span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
            <span class="material-symbols-outlined text-[22px]">domain</span>
          </div>
        </div>

        <!-- Shift Quality Benchmark -->
        <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant flex items-center justify-between shadow-xs">
          <div>
            <span class="text-[10px] font-bold uppercase font-data-mono text-purple-900 block">AVG QA PASS SCORE</span>
            <div class="text-2xl font-black font-data-mono text-purple-800 leading-none mt-1">97.8%</div>
            <span class="text-[11px] text-purple-700 font-medium mt-0.5 block">Exceeds 95% standard</span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
            <span class="material-symbols-outlined text-[22px]">verified</span>
          </div>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- 3. FILTER TABS BAR -->
      <!-- ================================================================= -->
      <section class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        ${[
          { id: 'ALL', label: 'All Staff Members', count: roster.totalCount },
          { id: 'ON_DUTY', label: 'On-Duty Active', count: roster.onDutyCount, highlight: true },
          { id: 'OFF_DUTY', label: 'Off-Duty & Rest', count: roster.offDutyCount }
        ].map(tab => `
          <button 
            class="btn-staff-filter px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              this.activeFilter === tab.id
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant border border-outline-variant'
            }"
            data-filter="${tab.id}"
          >
            <span>${tab.label}</span>
            <span class="px-1.5 py-0.2 rounded-full text-[10px] font-data-mono ${
              this.activeFilter === tab.id
                ? 'bg-white/20 text-white'
                : 'bg-surface-container-high text-on-surface-variant'
            }">
              ${tab.count}
            </span>
          </button>
        `).join('')}
      </section>

      <!-- ================================================================= -->
      <!-- 4. STAFF CAPACITY CARDS GRID -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${roster.displayList.map(staff => `
          <div class="p-5 rounded-2xl bg-surface-container-lowest border ${
            staff.onDuty ? 'border-outline-variant shadow-xs' : 'border-outline-variant/60 bg-surface-container/20 opacity-80'
          } flex flex-col justify-between gap-4 transition-all hover:shadow-md">

            <!-- Card Top: Name & Role -->
            <div>
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div class="relative">
                    <div class="w-12 h-12 rounded-2xl bg-primary text-on-primary font-black font-data-mono text-base flex items-center justify-center shadow-xs">
                      ${staff.initials}
                    </div>
                    <span class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      staff.onDuty ? 'bg-emerald-500' : 'bg-slate-400'
                    }" title="${staff.onDuty ? 'On Duty' : 'Off Duty'}"></span>
                  </div>

                  <div>
                    <h3 class="font-bold text-sm text-primary leading-tight">${staff.name}</h3>
                    <span class="text-xs text-on-surface-variant font-medium block mt-0.5">${staff.role}</span>
                    <span class="text-[10px] text-on-surface-variant/80 font-data-mono block">${staff.shift}</span>
                  </div>
                </div>

                <!-- Duty Toggle Chip -->
                <button 
                  class="btn-toggle-duty px-2.5 py-1 rounded-xl text-[11px] font-bold font-data-mono transition-all cursor-pointer active:scale-95 ${
                    staff.onDuty 
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300' 
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-highest border border-outline-variant'
                  }"
                  data-id="${staff.id}"
                  title="Click to toggle Shift Duty"
                >
                  ${staff.onDuty ? '● On-Duty' : '○ Off-Duty'}
                </button>
              </div>

              <!-- Contact & Floor Zone Badges -->
              <div class="mt-3.5 pt-3 border-t border-outline-variant/50 space-y-2 text-xs">
                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-on-surface-variant font-data-mono">Primary Floors:</span>
                  <div class="flex items-center gap-1">
                    ${(staff.primaryFloors || ['4']).map(f => `
                      <span class="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold font-data-mono text-[10px] border border-primary/20">
                        Floor ${f}
                      </span>
                    `).join('')}
                  </div>
                </div>

                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-on-surface-variant font-data-mono">Contact:</span>
                  <span class="font-data-mono font-medium text-primary text-[11px]">${staff.phone || '+1 (555) 000-0000'}</span>
                </div>
              </div>

              <!-- Workload Progress Bar -->
              <div class="mt-3 p-3 rounded-xl bg-surface-bright border border-outline-variant/60">
                <div class="flex items-center justify-between text-[11px] font-data-mono mb-1.5">
                  <span class="text-on-surface-variant">Cleaning Load:</span>
                  <span class="font-bold text-primary">${staff.utilizedCredits.toFixed(1)} / ${staff.maxCredits} credits (${staff.loadPercentage}%)</span>
                </div>
                <div class="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-500 ${
                    staff.loadPercentage > 85 ? 'bg-rose-600' : staff.loadPercentage > 60 ? 'bg-amber-500' : 'bg-primary'
                  }" style="width: ${staff.loadPercentage}%;"></div>
                </div>

                <!-- Active In-Progress Task -->
                <div class="mt-2 text-[10px] font-data-mono text-on-surface-variant flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[14px] text-primary">play_arrow</span>
                  <span class="truncate">${staff.currentActivity}</span>
                </div>
              </div>
            </div>

            <!-- Card Bottom: Actions -->
            <div class="pt-3 border-t border-outline-variant/50 flex items-center justify-between gap-2">
              <button 
                class="btn-view-assigned-rooms px-3 py-1.5 rounded-xl border border-outline-variant hover:bg-surface-container text-primary font-bold text-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                data-id="${staff.id}"
                data-name="${staff.name}"
              >
                <span class="material-symbols-outlined text-[16px]">meeting_room</span>
                <span>Assigned Rooms (${staff.assignedRooms.length})</span>
              </button>

              <button 
                class="btn-edit-staff-profile p-1.5 rounded-xl border border-outline-variant hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all cursor-pointer active:scale-95"
                data-id="${staff.id}"
                title="Edit Staff Member"
              >
                <span class="material-symbols-outlined text-[18px]">edit</span>
              </button>
            </div>

          </div>
        `).join('')}
      </section>

      <!-- ================================================================= -->
      <!-- 5. MODALS: ADD STAFF, EDIT STAFF & VIEW ASSIGNED ROOMS -->
      <!-- ================================================================= -->
      ${this.renderAddStaffModal()}
      ${this.renderEditStaffModal()}
      ${this.renderAssignedRoomsModal()}
    `;

    this.bindEvents();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MODALS
  // ──────────────────────────────────────────────────────────────────────────
  renderAddStaffModal() {
    if (!this.activeStaffModal) return '';

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px] text-primary">person_add</span>
              <h3 class="font-headline-sm text-base font-bold text-primary">Add New Housekeeping Staff</h3>
            </div>
            <button id="btn-close-add-staff" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <form id="form-add-staff" class="p-6 space-y-3.5 text-xs">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Full Name *</label>
              <input type="text" id="input-staff-name" placeholder="e.g. Fatima Zahra" required class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary font-bold outline-none" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Role *</label>
                <select id="sel-staff-role" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary outline-none cursor-pointer">
                  <option value="Floor Attendant">Floor Attendant</option>
                  <option value="Senior Attendant">Senior Attendant</option>
                  <option value="Suite Specialist">Suite Specialist</option>
                  <option value="Express Float Attendant">Express Float Attendant</option>
                  <option value="Lead Supervisor">Lead Supervisor</option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Shift *</label>
                <select id="sel-staff-shift" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary outline-none cursor-pointer">
                  <option value="Morning (07:00 - 15:30)">Morning (07:00 - 15:30)</option>
                  <option value="Evening (15:00 - 23:30)">Evening (15:00 - 23:30)</option>
                  <option value="Night (23:00 - 07:30)">Night (23:00 - 07:30)</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Primary Assigned Floors *</label>
              <div class="flex items-center gap-2 flex-wrap">
                ${['1', '2', '3', '4', '5', '6'].map(fl => `
                  <label class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-outline-variant bg-surface-bright cursor-pointer text-xs font-data-mono">
                    <input type="checkbox" name="primaryFloors" value="${fl}" ${fl === '4' ? 'checked' : ''} class="accent-primary" />
                    <span>Floor ${fl}</span>
                  </label>
                `).join('')}
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Phone Number</label>
                <input type="text" id="input-staff-phone" placeholder="+1 (555) 000-0000" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary outline-none" />
              </div>

              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Max Shift Credits</label>
                <input type="number" id="input-staff-credits" value="14.0" step="0.5" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary font-data-mono outline-none" />
              </div>
            </div>

            <div class="pt-3 border-t border-outline-variant flex items-center justify-end gap-2">
              <button type="button" id="btn-cancel-add-staff" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all">
                Save Staff Member
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  renderEditStaffModal() {
    if (!this.editingStaffId) return '';
    const staff = store.getHousekeepingStaff().find(s => s.id === this.editingStaffId);
    if (!staff) return '';

    const primaryFloors = staff.primaryFloors || ['4'];

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px] text-primary">edit_square</span>
              <h3 class="font-headline-sm text-base font-bold text-primary">Edit Staff Profile</h3>
            </div>
            <button id="btn-close-edit-staff" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <form id="form-edit-staff" class="p-6 space-y-3.5 text-xs">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Full Name *</label>
              <input type="text" id="input-edit-staff-name" value="${staff.name || ''}" required class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary font-bold outline-none" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Role *</label>
                <select id="sel-edit-staff-role" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary outline-none cursor-pointer">
                  ${['Floor Attendant', 'Senior Attendant', 'Suite Specialist', 'Express Float Attendant', 'Lead Supervisor'].map(role => `
                    <option value="${role}" ${staff.role === role ? 'selected' : ''}>${role}</option>
                  `).join('')}
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Shift *</label>
                <select id="sel-edit-staff-shift" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary outline-none cursor-pointer">
                  ${['Morning (07:00 - 15:30)', 'Evening (15:00 - 23:30)', 'Night (23:00 - 07:30)'].map(shift => `
                    <option value="${shift}" ${staff.shift === shift ? 'selected' : ''}>${shift}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Primary Assigned Floors *</label>
              <div class="flex items-center gap-2 flex-wrap">
                ${['1', '2', '3', '4', '5', '6'].map(fl => `
                  <label class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-outline-variant bg-surface-bright cursor-pointer text-xs font-data-mono">
                    <input type="checkbox" name="editPrimaryFloors" value="${fl}" ${primaryFloors.includes(fl) ? 'checked' : ''} class="accent-primary" />
                    <span>Floor ${fl}</span>
                  </label>
                `).join('')}
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Phone Number</label>
                <input type="text" id="input-edit-staff-phone" value="${staff.phone || ''}" placeholder="+1 (555) 000-0000" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary outline-none" />
              </div>

              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Max Shift Credits</label>
                <input type="number" id="input-edit-staff-credits" value="${staff.maxCredits || 14.0}" step="0.5" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary font-data-mono outline-none" />
              </div>
            </div>

            <div class="p-3 rounded-xl border border-outline-variant bg-surface-bright flex items-center justify-between">
              <div>
                <span class="font-bold text-primary block">Active Duty Status</span>
                <span class="text-[10px] text-on-surface-variant">Eligible for automated room assignments</span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="input-edit-staff-onduty" ${staff.onDuty ? 'checked' : ''} class="sr-only peer">
                <div class="w-10 h-5 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div class="pt-3 border-t border-outline-variant flex items-center justify-between gap-2">
              <button type="button" id="btn-delete-staff" data-id="${staff.id}" class="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all">
                <span class="material-symbols-outlined text-[16px]">delete</span>
                <span>Remove</span>
              </button>

              <div class="flex items-center gap-2">
                <button type="button" id="btn-cancel-edit-staff" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
                <button type="submit" class="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  renderAssignedRoomsModal() {
    if (!this.activeInspectStaffId) return '';
    const staff = store.getHousekeepingStaff().find(s => s.id === this.activeInspectStaffId);
    if (!staff) return '';

    const staffName = staff.name;
    const rooms = (store.state.rooms || []).filter(r => 
      r.housekeeper === staffName || 
      (r.housekeeper && r.housekeeper.toLowerCase().includes(staffName.toLowerCase())) ||
      (staff.name.includes(' ') && r.housekeeper === staff.name.split(' ')[0])
    );

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-lg overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px] text-primary">meeting_room</span>
              <h3 class="font-headline-sm text-base font-bold text-primary">Assigned Rooms — ${staff.name}</h3>
            </div>
            <button id="btn-close-inspect-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-3 text-xs max-h-[60vh] overflow-y-auto">
            ${rooms.length === 0 ? `
              <div class="p-8 text-center text-on-surface-variant">
                <span class="material-symbols-outlined text-[32px] text-on-surface-variant/60 block mb-1">cleaning_services</span>
                <span>No rooms currently assigned to ${staff.name}.</span>
              </div>
            ` : `
              <div class="space-y-2">
                ${rooms.map(room => `
                  <div class="p-3 rounded-xl border border-outline-variant bg-surface-bright flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <span class="w-10 h-10 rounded-lg bg-primary/10 text-primary font-black font-data-mono text-xs flex items-center justify-center shrink-0">
                        ${room.id}
                      </span>
                      <div>
                        <div class="font-bold text-primary">${room.type || 'Standard Room'} • Floor ${room.floor}</div>
                        <div class="text-[11px] text-on-surface-variant font-data-mono mt-0.5">
                          Status: <strong>${room.status}</strong> • Occupancy: ${room.occupancy || 'Vacant'}
                        </div>
                      </div>
                    </div>

                    <span class="px-2.5 py-1 rounded-lg text-[10px] font-bold font-data-mono ${
                      room.status === 'Inspected' 
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                        : room.status === 'Clean'
                        ? 'bg-blue-100 text-blue-900 border border-blue-300'
                        : room.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-rose-100 text-rose-900 border border-rose-300'
                    }">${room.status}</span>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <div class="px-6 py-4 border-t border-outline-variant bg-surface-bright flex items-center justify-end">
            <button id="btn-close-inspect-footer" class="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold cursor-pointer">
              Close
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // EVENT BINDINGS
  // ──────────────────────────────────────────────────────────────────────────
  bindEvents() {
    if (!this.container) return;

    // Filter Buttons
    this.container.querySelectorAll('.btn-staff-filter').forEach(btn => {
      btn.onclick = () => {
        this.activeFilter = btn.dataset.filter;
        this.renderContent();
      };
    });

    // Toggle Duty Status
    this.container.querySelectorAll('.btn-toggle-duty').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const staffId = btn.dataset.id;
        store.toggleStaffDutyStatus(staffId);
      };
    });

    // View Assigned Rooms
    this.container.querySelectorAll('.btn-view-assigned-rooms').forEach(btn => {
      btn.onclick = () => {
        this.activeInspectStaffId = btn.dataset.id;
        this.renderContent();
      };
    });

    // Edit Staff Profile
    this.container.querySelectorAll('.btn-edit-staff-profile').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        this.editingStaffId = btn.dataset.id;
        this.renderContent();
      };
    });

    // Close / Cancel Edit Staff Modal
    const btnCloseEdit = this.container.querySelector('#btn-close-edit-staff');
    if (btnCloseEdit) {
      btnCloseEdit.onclick = () => {
        this.editingStaffId = null;
        this.renderContent();
      };
    }
    const btnCancelEdit = this.container.querySelector('#btn-cancel-edit-staff');
    if (btnCancelEdit) {
      btnCancelEdit.onclick = () => {
        this.editingStaffId = null;
        this.renderContent();
      };
    }

    // Delete Staff Member
    const btnDeleteStaff = this.container.querySelector('#btn-delete-staff');
    if (btnDeleteStaff) {
      btnDeleteStaff.onclick = () => {
        const staffId = btnDeleteStaff.dataset.id;
        if (confirm('Are you sure you want to remove this staff member from the roster?')) {
          store.deleteHousekeepingStaff(staffId);
          this.editingStaffId = null;
          this.renderContent();
        }
      };
    }

    // Form Edit Staff Submission
    const formEditStaff = this.container.querySelector('#form-edit-staff');
    if (formEditStaff) {
      formEditStaff.onsubmit = (e) => {
        e.preventDefault();
        const staffId = this.editingStaffId;
        const name = this.container.querySelector('#input-edit-staff-name').value.trim();
        const role = this.container.querySelector('#sel-edit-staff-role').value;
        const shift = this.container.querySelector('#sel-edit-staff-shift').value;
        const phone = this.container.querySelector('#input-edit-staff-phone').value.trim();
        const maxCredits = Number(this.container.querySelector('#input-edit-staff-credits').value) || 14.0;
        const onDuty = this.container.querySelector('#input-edit-staff-onduty').checked;

        const selectedFloors = [];
        this.container.querySelectorAll('input[name="editPrimaryFloors"]:checked').forEach(cb => {
          selectedFloors.push(cb.value);
        });

        store.updateHousekeepingStaff(staffId, {
          name,
          role,
          shift,
          phone,
          maxCredits,
          onDuty,
          primaryFloors: selectedFloors.length > 0 ? selectedFloors : ['4']
        });

        this.editingStaffId = null;
        this.renderContent();
      };
    }

    // Close Inspect Modal
    const btnCloseInspect = this.container.querySelector('#btn-close-inspect-modal');
    if (btnCloseInspect) {
      btnCloseInspect.onclick = () => {
        this.activeInspectStaffId = null;
        this.renderContent();
      };
    }
    const btnCloseInspectFooter = this.container.querySelector('#btn-close-inspect-footer');
    if (btnCloseInspectFooter) {
      btnCloseInspectFooter.onclick = () => {
        this.activeInspectStaffId = null;
        this.renderContent();
      };
    }

    // Open Add Staff Modal
    const btnOpenAdd = this.container.querySelector('#btn-open-add-staff-modal');
    if (btnOpenAdd) {
      btnOpenAdd.onclick = () => {
        this.activeStaffModal = true;
        this.renderContent();
      };
    }

    // Close Add Staff Modal
    const btnCloseAdd = this.container.querySelector('#btn-close-add-staff');
    if (btnCloseAdd) {
      btnCloseAdd.onclick = () => {
        this.activeStaffModal = false;
        this.renderContent();
      };
    }
    const btnCancelAdd = this.container.querySelector('#btn-cancel-add-staff');
    if (btnCancelAdd) {
      btnCancelAdd.onclick = () => {
        this.activeStaffModal = false;
        this.renderContent();
      };
    }

    // Form Add Staff Submission
    const formAddStaff = this.container.querySelector('#form-add-staff');
    if (formAddStaff) {
      formAddStaff.onsubmit = (e) => {
        e.preventDefault();
        const name = this.container.querySelector('#input-staff-name').value.trim();
        const role = this.container.querySelector('#sel-staff-role').value;
        const shift = this.container.querySelector('#sel-staff-shift').value;
        const phone = this.container.querySelector('#input-staff-phone').value.trim();
        const maxCredits = Number(this.container.querySelector('#input-staff-credits').value) || 14.0;
        
        const selectedFloors = [];
        this.container.querySelectorAll('input[name="primaryFloors"]:checked').forEach(cb => {
          selectedFloors.push(cb.value);
        });

        store.addHousekeepingStaff({
          name,
          role,
          shift,
          phone,
          maxCredits,
          primaryFloors: selectedFloors.length > 0 ? selectedFloors : ['4']
        });

        this.activeStaffModal = false;
        this.renderContent();
      };
    }

    // Refresh Button
    const btnRefresh = this.container.querySelector('#btn-refresh-staff');
    if (btnRefresh) {
      btnRefresh.onclick = () => {
        Toast.show({ title: 'Roster Synced', message: 'Staff availability and room allocations refreshed.', type: 'info' });
        this.renderContent();
      };
    }
  }
}
