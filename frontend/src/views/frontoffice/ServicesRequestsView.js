// ==========================================================================
// VOLVITECH HOSPITALITY OS — FRONT DESK SERVICES & REQUESTS WORKSPACE
// Section 11: Create service request, attach to stay, dispatch & track status
// Real-Time Arrival & Allotted Time Trigger System
// ==========================================================================

import { store } from '../../state/store.js';
import { Toast } from '../../components/Toast.js';

export class ServicesRequestsView {
  constructor() {
    this.container = null;
    this.activeFilter = 'ALL'; // 'ALL', 'Pending', 'In Progress', 'Delivered'
    this.deptFilter = 'ALL';
    this.searchQuery = '';
    this.isCreateModalOpen = false;

    this.newRequestData = {
      reservationId: '',
      guestName: '',
      roomNumber: '',
      serviceType: 'Laundry',
      details: '',
      department: 'Laundry',
      priority: 'Normal',
      price: 0,
      timingTrigger: 'Allotted Window • 10:00 - 11:30 AM'
    };
  }

  render() {
    const el = document.createElement('div');
    el.className = 'flex flex-col gap-6 animate-fadeIn pb-16 max-w-7xl mx-auto w-full';
    this.container = el;

    this.renderContent();
    return el;
  }

  renderContent() {
    if (!this.container) return;

    const state = store.state;
    const requests = (state.serviceRequests || []).map(r => store.enrichServiceRequest ? store.enrichServiceRequest(r) : r);
    const triggers = store.getServiceTriggers ? store.getServiceTriggers() : requests.filter(r => r.status !== 'Delivered');
    const activeTriggerCount = store.getActiveTriggerCount ? store.getActiveTriggerCount() : 0;
    const pendingCount = requests.filter(r => r.status === 'Pending').length;
    const progressCount = requests.filter(r => r.status === 'In Progress').length;
    const deliveredCount = requests.filter(r => r.status === 'Delivered').length;

    const filtered = requests.filter(r => {
      const statusMatch = this.activeFilter === 'ALL' || r.status === this.activeFilter;
      const deptMatch = this.deptFilter === 'ALL' || r.department === this.deptFilter;
      const q = this.searchQuery.toLowerCase().trim();
      const qMatch = !q ||
        r.guestName.toLowerCase().includes(q) ||
        r.serviceType.toLowerCase().includes(q) ||
        (r.roomNumber && String(r.roomNumber).includes(q)) ||
        (r.timingTrigger && r.timingTrigger.toLowerCase().includes(q)) ||
        r.details.toLowerCase().includes(q);
      return statusMatch && deptMatch && qMatch;
    });

    this.container.innerHTML = `
      <!-- Workspace Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-outline-variant/60 pb-5">
        <div>
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-data-mono uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
              Front Desk Operations
            </span>
            <span class="text-xs text-on-surface-variant font-medium">Real-Time Guest Journey & Arrival Triggers</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold font-headline-lg text-primary tracking-tight mt-1.5">
            Services & Amenities Requests
          </h1>
          <p class="text-xs text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
            Time-sensitive triggers for tonight's guest transport arrivals, allotted laundry slots, and pre-arrival amenities. Direct routing, dispatching, and audible team alerts.
          </p>
        </div>

        <div class="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button id="btn-simulate-trigger-hdr" class="px-4 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold shadow-sm hover:bg-amber-700 flex items-center gap-1.5 cursor-pointer transition-all">
            <span class="material-symbols-outlined text-[18px]">bolt</span>
            <span>Simulate Incoming Trigger</span>
          </button>

          <button id="btn-open-create-srv" class="px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm hover:bg-primary/90 flex items-center gap-1.5 cursor-pointer transition-all">
            <span class="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Create Service Request</span>
          </button>
        </div>
      </div>

      <!-- Real-Time Triggers & Allotted Windows Command Banner -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/60 pb-3.5">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center">
              <span class="material-symbols-outlined text-[20px]">campaign</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-headline-sm text-sm font-bold text-primary">Active Real-Time Triggers & Allotted Schedules</h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold font-data-mono bg-error/10 text-error border border-error/20 animate-pulse">
                  ${activeTriggerCount} ACTIVE TRIGGERS
                </span>
              </div>
              <p class="text-[11px] text-on-surface-variant mt-0.5">
                Proactive hotel operating triggers: Tonight's transport arrivals, allotted laundry slots, and VIP pre-arrival setup.
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button id="btn-trigger-test-chime" class="px-3 py-1.5 rounded-xl border border-outline-variant bg-surface-bright text-xs font-semibold text-primary hover:bg-surface-container flex items-center gap-1.5 transition-all cursor-pointer">
              <span class="material-symbols-outlined text-[16px] text-primary">volume_up</span>
              <span>Sound Chime</span>
            </button>
          </div>
        </div>

        <!-- Trigger Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          ${triggers.slice(0, 3).map(trig => {
            const isUrgent = trig.alertUrgency === 'URGENT';
            const isHigh = trig.alertUrgency === 'HIGH';
            const isPending = trig.status === 'Pending';
            const borderCol = isUrgent ? 'border-rose-300 bg-rose-50/50' : (isHigh ? 'border-blue-300 bg-blue-50/50' : 'border-amber-300 bg-amber-50/50');
            const iconBg = isUrgent ? 'bg-rose-100 text-rose-700' : (isHigh ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700');
            
            return `
              <div class="border ${borderCol} rounded-xl p-4 flex flex-col justify-between gap-3 shadow-xs transition-all hover:shadow-sm">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-start gap-2.5">
                    <div class="w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0 mt-0.5">
                      <span class="material-symbols-outlined text-[18px]">${trig.triggerIcon || 'room_service'}</span>
                    </div>
                    <div>
                      <div class="flex items-center gap-1.5">
                        <span class="text-xs font-bold text-primary">${trig.guestName}</span>
                        <span class="text-[10px] text-on-surface-variant font-data-mono">${trig.roomNumber ? `#${trig.roomNumber}` : ''}</span>
                      </div>
                      <span class="text-[11px] font-bold text-on-surface block mt-0.5">${trig.serviceType}</span>
                      <p class="text-[10px] text-on-surface-variant line-clamp-2 mt-0.5">${trig.details}</p>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 rounded-full text-[9px] font-bold font-data-mono shrink-0 ${
                    isUrgent ? 'bg-rose-100 text-rose-800 border border-rose-300' : (isHigh ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-amber-100 text-amber-800 border border-amber-300')
                  }">
                    ${trig.triggerBadge || trig.alertUrgency}
                  </span>
                </div>

                <div class="flex items-center justify-between gap-2 pt-2.5 border-t border-outline-variant/40 text-[10px]">
                  <div class="flex items-center gap-1 font-bold text-primary">
                    <span class="material-symbols-outlined text-[15px] text-amber-600">alarm</span>
                    <span>${trig.timingTrigger || trig.allottedWindow}</span>
                  </div>

                  <div class="flex items-center gap-1.5">
                    <button class="btn-card-ping-chime p-1 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-amber-600 cursor-pointer" data-id="${trig.id}" title="Play Alert Chime">
                      <span class="material-symbols-outlined text-[16px]">notification_important</span>
                    </button>
                    ${isPending ? `
                      <button class="btn-card-dispatch px-2.5 py-1 rounded-lg bg-primary text-on-primary font-bold text-[10px] hover:bg-primary/90 flex items-center gap-1 cursor-pointer transition-colors" data-id="${trig.id}">
                        <span class="material-symbols-outlined text-[12px]">send</span>
                        <span>Dispatch</span>
                      </button>
                    ` : `
                      <span class="px-2 py-0.5 rounded-md text-[10px] font-bold font-data-mono bg-blue-100 text-blue-800 border border-blue-200">In Progress</span>
                    `}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Quick Metrics Ribbon -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div class="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-4 shadow-xs">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold font-label-caps uppercase text-on-surface-variant">Total Requests</span>
            <span class="material-symbols-outlined text-[18px] text-primary">room_service</span>
          </div>
          <div class="text-2xl font-bold font-headline-lg text-primary mt-1">${requests.length}</div>
        </div>

        <div class="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-4 shadow-xs">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold font-label-caps uppercase text-amber-700">Pending Dispatch</span>
            <span class="material-symbols-outlined text-[18px] text-amber-600">hourglass_top</span>
          </div>
          <div class="text-2xl font-bold font-headline-lg text-amber-600 mt-1">${pendingCount}</div>
        </div>

        <div class="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-4 shadow-xs">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold font-label-caps uppercase text-blue-700">In Progress</span>
            <span class="material-symbols-outlined text-[18px] text-blue-600">sync</span>
          </div>
          <div class="text-2xl font-bold font-headline-lg text-blue-600 mt-1">${progressCount}</div>
        </div>

        <div class="bg-surface-container-lowest border border-outline-variant/70 rounded-2xl p-4 shadow-xs">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold font-label-caps uppercase text-emerald-700">Delivered / Done</span>
            <span class="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
          </div>
          <div class="text-2xl font-bold font-headline-lg text-emerald-600 mt-1">${deliveredCount}</div>
        </div>
      </div>

      <!-- Controls & Filter Bar -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        
        <!-- Status Filter Pills -->
        <div class="flex items-center gap-1 p-1 rounded-xl bg-surface-bright border border-outline-variant shrink-0">
          ${['ALL', 'Pending', 'In Progress', 'Delivered'].map(status => `
            <button class="btn-srv-status-filter px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              this.activeFilter === status ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant hover:text-primary'
            }" data-status="${status}">
              ${status === 'ALL' ? 'All Requests' : status}
            </button>
          `).join('')}
        </div>

        <div class="flex items-center gap-3">
          <!-- Department Filter -->
          <select id="srv-dept-filter" class="px-3 py-1.5 rounded-xl border border-outline-variant bg-surface-bright text-xs font-semibold">
            <option value="ALL" ${this.deptFilter === 'ALL' ? 'selected' : ''}>All Departments</option>
            <option value="Housekeeping" ${this.deptFilter === 'Housekeeping' ? 'selected' : ''}>Housekeeping</option>
            <option value="Food & Beverage" ${this.deptFilter === 'Food & Beverage' ? 'selected' : ''}>Food & Beverage</option>
            <option value="Laundry" ${this.deptFilter === 'Laundry' ? 'selected' : ''}>Laundry</option>
            <option value="Transport" ${this.deptFilter === 'Transport' ? 'selected' : ''}>Transport</option>
            <option value="Transport / Concierge" ${this.deptFilter === 'Transport / Concierge' ? 'selected' : ''}>Transport / Concierge</option>
            <option value="Front Desk" ${this.deptFilter === 'Front Desk' ? 'selected' : ''}>Front Desk</option>
          </select>

          <!-- Search Input -->
          <div class="relative w-64">
            <input type="text" id="srv-search-input" value="${this.searchQuery}" placeholder="Search guest, room, timing, details..." class="w-full px-3 py-1.5 pl-8 rounded-xl border border-outline-variant bg-surface-bright text-xs font-semibold">
            <span class="material-symbols-outlined absolute left-2.5 top-2 text-on-surface-variant text-[16px]">search</span>
          </div>
        </div>

      </div>

      <!-- Requests Table -->
      <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-xs">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-outline-variant/60 text-on-surface-variant font-label-caps uppercase text-[10px]">
                <th class="py-3 px-3">Req ID</th>
                <th class="py-3 px-3">Guest & Room</th>
                <th class="py-3 px-3">Service Type</th>
                <th class="py-3 px-3">Timing / Trigger Window</th>
                <th class="py-3 px-3">Details & Notes</th>
                <th class="py-3 px-3">Department</th>
                <th class="py-3 px-3">Status</th>
                <th class="py-3 px-3 text-right">Actions / Update</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/40">
              ${filtered.length > 0 ? filtered.map(req => `
                <tr class="hover:bg-surface-bright/80 transition-colors">
                  <td class="py-3.5 px-3 font-data-mono font-bold text-primary">${req.id}</td>
                  <td class="py-3.5 px-3">
                    <span class="font-bold text-primary block">${req.guestName}</span>
                    <span class="text-[10px] text-on-surface-variant block font-data-mono">
                      ${req.roomNumber ? `Room #${req.roomNumber}` : 'Reservation'}
                    </span>
                  </td>
                  <td class="py-3.5 px-3">
                    <span class="px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      req.serviceType === 'Laundry' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                      req.serviceType.includes('Breakfast') ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      req.serviceType.includes('Airport') || req.serviceType.includes('Transport') ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                      'bg-surface-container text-on-surface'
                    }">
                      ${req.serviceType}
                    </span>
                  </td>
                  <td class="py-3.5 px-3">
                    <div class="flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-[16px] ${
                        req.triggerType === 'TRANSPORT' ? 'text-rose-600' : (req.triggerType === 'LAUNDRY' ? 'text-blue-600' : 'text-amber-600')
                      }">${req.triggerIcon || 'schedule'}</span>
                      <div>
                        <span class="font-bold text-[11px] ${
                          req.triggerType === 'TRANSPORT' ? 'text-rose-700' : (req.triggerType === 'LAUNDRY' ? 'text-blue-700' : 'text-primary')
                        } block">${req.timingTrigger || req.allottedWindow || 'Immediate'}</span>
                        <span class="px-1.5 py-0.2 rounded text-[9px] font-bold font-data-mono uppercase ${
                          req.alertUrgency === 'URGENT' ? 'bg-rose-100 text-rose-800' : (req.alertUrgency === 'HIGH' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700')
                        }">${req.triggerBadge || req.triggerType}</span>
                      </div>
                    </div>
                  </td>
                  <td class="py-3.5 px-3 max-w-xs">
                    <p class="text-xs text-on-surface leading-snug">${req.details}</p>
                    <span class="text-[10px] text-on-surface-variant block mt-0.5">${req.createdAt || 'Today'}</span>
                  </td>
                  <td class="py-3.5 px-3 font-semibold text-on-surface-variant">
                    ${req.department}
                  </td>
                  <td class="py-3.5 px-3">
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold font-data-mono ${
                      req.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                      req.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }">
                      ${req.status}
                    </span>
                  </td>
                  <td class="py-3.5 px-3 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                      <button class="btn-row-ping p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-amber-600 cursor-pointer transition-colors" data-id="${req.id}" title="Sound Audio Chime & Trigger Alert">
                        <span class="material-symbols-outlined text-[16px]">notifications_active</span>
                      </button>
                      <select class="sel-update-req-status px-2 py-1 rounded-lg border border-outline-variant bg-surface-bright text-[11px] font-semibold" data-req-id="${req.id}">
                        <option value="Pending" ${req.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="In Progress" ${req.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                        <option value="Delivered" ${req.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                      </select>
                    </div>
                  </td>
                </tr>
              `).join('') : `
                <tr>
                  <td colspan="8" class="py-8 text-center text-xs text-on-surface-variant">
                    No service requests found matching the current filters.
                  </td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create Service Request Modal Overlay -->
      ${this.isCreateModalOpen ? this.renderCreateModal() : ''}
    `;

    this.bindEvents();
  }

  renderCreateModal() {
    const reservations = store.state.reservations || [];

    return `
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn" id="create-srv-overlay">
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col">
          
          <div class="px-6 py-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-bright">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-[20px] text-primary">add_task</span>
              <h3 class="font-headline-sm text-base font-bold text-primary">New Front Desk Service Request</h3>
            </div>
            <button id="btn-close-create-srv-modal" class="p-1.5 rounded-lg text-on-surface-variant hover:text-primary cursor-pointer">
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <form id="form-create-service-request" class="p-6 space-y-4 text-xs">
            
            <div>
              <label class="block font-bold text-on-surface uppercase font-label-caps mb-1.5">Attach to Guest / Reservation *</label>
              <select id="modal-srv-res-picker" required class="w-full px-3.5 py-2 rounded-lg border border-outline-variant bg-surface-bright font-semibold">
                <option value="">-- Select In-House Guest or Reservation --</option>
                ${reservations.map(r => `
                  <option value="${r.id}" data-name="${r.guestName}" data-room="${r.assignedRoom || r.roomNumber || 'TBD'}">
                    ${r.guestName} (${r.assignedRoom || r.roomNumber ? 'Room #' + (r.assignedRoom || r.roomNumber) : 'Unassigned'} · ${r.confirmationCode})
                  </option>
                `).join('')}
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-on-surface uppercase font-label-caps mb-1.5">Service Category *</label>
                <select id="modal-srv-type" required class="w-full px-3.5 py-2 rounded-lg border border-outline-variant bg-surface-bright font-semibold">
                  <option value="Laundry">Laundry & Dry Cleaning</option>
                  <option value="Breakfast">Breakfast & In-Room Dining</option>
                  <option value="Extra bed">Extra Bed / Rollaway</option>
                  <option value="Baby cot">Baby Cot / Nursery</option>
                  <option value="Airport Luxury Transfer">Airport Luxury Transfer</option>
                  <option value="Airport pickup">Airport Pickup</option>
                  <option value="Airport drop">Airport Drop</option>
                  <option value="Special requests">Special Amenities / Flowers</option>
                </select>
              </div>

              <div>
                <label class="block font-bold text-on-surface uppercase font-label-caps mb-1.5">Department Dispatched *</label>
                <select id="modal-srv-dept" required class="w-full px-3.5 py-2 rounded-lg border border-outline-variant bg-surface-bright font-semibold">
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Laundry">Laundry</option>
                  <option value="Transport">Transport</option>
                  <option value="Transport / Concierge">Transport / Concierge</option>
                  <option value="Front Desk">Front Desk</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-bold text-on-surface uppercase font-label-caps mb-1.5">Timing Trigger / Allotted Window *</label>
              <select id="modal-srv-timing" class="w-full px-3.5 py-2 rounded-lg border border-outline-variant bg-surface-bright font-semibold">
                <option value="Arriving Tonight • 21:30">Arriving Tonight • 21:30 (Transport / Chauffeur Arrival)</option>
                <option value="Arriving Tonight • 19:45">Arriving Tonight • 19:45 (Airport Flight Arrival)</option>
                <option value="Allotted Window • 10:00 - 11:30 AM">Allotted Window • 10:00 - 11:30 AM (Laundry Morning Window)</option>
                <option value="Allotted Window • 16:00 - 17:30">Allotted Window • 16:00 - 17:30 (Laundry Evening Window)</option>
                <option value="Pre-Arrival Prep • Tonight 18:00">Pre-Arrival Prep • Tonight 18:00 (F&B / Welcome Amenities)</option>
                <option value="Immediate • Within 30 Mins">Immediate • Within 30 Mins (Urgent Delivery)</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-on-surface uppercase font-label-caps mb-1.5">Details & Instructions *</label>
              <textarea id="modal-srv-details" required rows="2" placeholder="e.g. 2 executive suits dry cleaned with express turnaround during allotted slot" class="w-full px-3.5 py-2 rounded-lg border border-outline-variant bg-surface-bright font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-on-surface uppercase font-label-caps mb-1.5">Charge Amount ($)</label>
                <input type="number" id="modal-srv-price" value="0" min="0" class="w-full px-3.5 py-2 rounded-lg border border-outline-variant bg-surface-bright font-semibold font-data-mono">
              </div>

              <div>
                <label class="block font-bold text-on-surface uppercase font-label-caps mb-1.5">Priority</label>
                <select id="modal-srv-priority" class="w-full px-3.5 py-2 rounded-lg border border-outline-variant bg-surface-bright font-semibold">
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-outline-variant/60">
              <button type="button" id="btn-cancel-create-srv" class="px-4 py-2 rounded-xl border border-outline-variant text-xs font-bold text-on-surface hover:bg-surface-container transition-all cursor-pointer">
                Cancel
              </button>
              <button type="submit" class="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-sm hover:bg-primary/90 flex items-center gap-2 cursor-pointer transition-all">
                <span class="material-symbols-outlined text-[18px]">send</span>
                <span>Dispatch Request</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    `;
  }

  bindEvents() {
    const root = this.container || document;
    const $ = (id) => root.querySelector(id.startsWith('#') || id.startsWith('.') ? id : `#${id}`);
    const $$ = (sel) => Array.from(root.querySelectorAll(sel));

    const btnOpenCreate = $('btn-open-create-srv');
    if (btnOpenCreate) {
      btnOpenCreate.onclick = () => {
        this.isCreateModalOpen = true;
        this.renderContent();
      };
    }

    // Simulate guest trigger button in header
    const btnSimHeader = $('btn-simulate-trigger-hdr');
    if (btnSimHeader) {
      btnSimHeader.onclick = () => {
        const types = ['transport', 'laundry', 'fnb'];
        const chosen = types[Math.floor(Math.random() * types.length)];
        store.simulateNewServiceTrigger(chosen);
        this.renderContent();
      };
    }

    // Test Sound Chime button
    const btnTestChime = $('btn-trigger-test-chime');
    if (btnTestChime) {
      btnTestChime.onclick = () => {
        store.playChime();
        Toast.show({
          title: 'Concierge Audio Chime',
          message: 'Alert chime sound tested successfully',
          type: 'info'
        });
      };
    }

    // Dispatch buttons from banner cards
    $$('.btn-card-dispatch').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        store.dispatchServiceTrigger(id);
        this.renderContent();
      };
    });

    // Ping audio chime from banner cards
    $$('.btn-card-ping-chime').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        const req = (store.state.serviceRequests || []).find(r => r.id === id);
        store.playChime();
        Toast.show({
          title: 'Immediate Trigger Alert',
          message: `${req ? req.guestName : 'Guest'}: ${req ? req.timingTrigger : 'Time-critical request'}`,
          type: 'warning'
        });
      };
    });

    // Row ping trigger buttons
    $$('.btn-row-ping').forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        const req = (store.state.serviceRequests || []).find(r => r.id === id);
        store.playChime();
        Toast.show({
          title: '🚨 Service Trigger Alert',
          message: `${req ? req.guestName : 'Guest'} — ${req ? req.serviceType : 'Service'} (${req ? req.timingTrigger : 'Immediate'})`,
          type: 'warning'
        });
      };
    });

    const btnCloseModal = $('btn-close-create-srv-modal');
    if (btnCloseModal) {
      btnCloseModal.onclick = () => {
        this.isCreateModalOpen = false;
        this.renderContent();
      };
    }

    const btnCancelModal = $('btn-cancel-create-srv');
    if (btnCancelModal) {
      btnCancelModal.onclick = () => {
        this.isCreateModalOpen = false;
        this.renderContent();
      };
    }

    const formCreate = $('form-create-service-request');
    if (formCreate) {
      formCreate.onsubmit = (e) => {
        e.preventDefault();
        const resPicker = $('modal-srv-res-picker');
        const selectedOpt = resPicker.options[resPicker.selectedIndex];
        const resId = resPicker.value;
        const guestName = selectedOpt?.dataset?.name || 'Hotel Guest';
        const roomNumber = selectedOpt?.dataset?.room || 'In-House';

        store.createServiceRequest({
          reservationId: resId,
          guestName,
          roomNumber,
          serviceType: $('modal-srv-type')?.value || 'General',
          department: $('modal-srv-dept')?.value || 'Front Desk',
          details: $('modal-srv-details')?.value || '',
          timingTrigger: $('modal-srv-timing')?.value || 'Immediate • Within 30 Mins',
          price: Number($('modal-srv-price')?.value) || 0,
          priority: $('modal-srv-priority')?.value || 'Normal'
        });

        this.isCreateModalOpen = false;
        this.renderContent();
      };
    }

    $$('.btn-srv-status-filter').forEach(btn => {
      btn.onclick = () => {
        this.activeFilter = btn.dataset.status;
        this.renderContent();
      };
    });

    const deptFilter = $('srv-dept-filter');
    if (deptFilter) {
      deptFilter.onchange = (e) => {
        this.deptFilter = e.target.value;
        this.renderContent();
      };
    }

    const searchInput = $('srv-search-input');
    if (searchInput) {
      searchInput.oninput = () => {
        this.searchQuery = searchInput.value;
        this.renderContent();
        const inputAfter = $('srv-search-input');
        if (inputAfter) {
          inputAfter.focus();
          inputAfter.setSelectionRange(inputAfter.value.length, inputAfter.value.length);
        }
      };
    }

    $$('.sel-update-req-status').forEach(sel => {
      sel.onchange = (e) => {
        const reqId = sel.dataset.reqId;
        store.updateServiceRequestStatus(reqId, e.target.value);
        this.renderContent();
      };
    });
  }
}
