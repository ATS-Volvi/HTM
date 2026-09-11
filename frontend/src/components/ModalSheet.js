// ==========================================================================
// VOLVITECH HOSPITALITY OS — UNIVERSAL ENTERPRISE MODAL & DRAWER ENGINE
// ==========================================================================

import { store } from '../state/store.js';

export function renderModalSheet(state) {
  const modal = state.activeModal;
  if (!modal) return '';

  const { type, data } = modal;

  return `
    <div class="modal-backdrop" id="modal-universal-backdrop">
      <div class="modal-content-panel">
        ${renderModalBody(type, data, state)}
      </div>
    </div>
  `;
}

function renderModalBody(type, data, state) {
  switch (type) {
    // ─── MODAL 1: CHECK-IN & ROOM ALLOCATION ───────────────────────────────
    case 'check_in': {
      const res = state.reservations.find(r => r.id === data.resId) || state.reservations[0];
      const vacantRooms = state.rooms.filter(r => r.occupancy === 'Vacant' && (r.status === 'Inspected' || r.status === 'Clean'));

      return `
        <div style="padding: 24px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 20px;">
            <div>
              <div style="font-size: 11px; font-weight: 700; color: #2563EB; text-transform: uppercase;">Front Desk Operations</div>
              <h3 style="font-size: 20px; font-weight: 700; color: #0F172A;">Guest Check-In & Room Assignment</h3>
            </div>
            <button class="btn-secondary" id="btn-close-modal" style="padding: 4px 8px; border-radius: 6px;">
              <span class="material-symbols-outlined" style="font-size: 18px;">close</span>
            </button>
          </div>

          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
            <div style="display:flex; justify-content:space-between; margin-bottom: 8px;">
              <div>
                <span style="font-size: 16px; font-weight: 700; color: #0F172A;">${res.guestName}</span>
                <span class="badge badge-vip" style="margin-left: 8px;">VIP Verified</span>
              </div>
              <span style="font-family: var(--font-mono); font-size: 12px; color: #64748B;">Code: ${res.confirmationCode}</span>
            </div>
            <div style="font-size: 12px; color: #475569; display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
              <div><strong>Room Category:</strong> ${res.roomType}</div>
              <div><strong>Stay Duration:</strong> ${res.nights} Nights (${res.checkIn} to ${res.checkOut})</div>
              <div><strong>Rate / Night:</strong> $${res.ratePerNight.toFixed(2)}</div>
              <div><strong>Total Booking:</strong> $${res.totalAmount.toFixed(2)} (Guaranteed)</div>
            </div>
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display:block; font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 6px;">
              Allocate Inspected Clean Room
            </label>
            <select id="modal-select-room" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #CBD5E1; font-size: 13px;">
              ${vacantRooms.map(r => `
                <option value="${r.id}">
                  Room ${r.id} (${r.type} - Floor ${r.floor}) — Status: [${r.status.toUpperCase()}]
                </option>
              `).join('')}
            </select>
          </div>

          <div style="display:flex; justify-content:flex-end; gap: 10px;">
            <button class="btn-secondary" id="btn-cancel-modal">Cancel</button>
            <button class="btn-primary" id="btn-confirm-checkin" data-res-id="${res.id}">
              <span class="material-symbols-outlined" style="font-size: 16px;">key</span>
              Encode Digital Key & Complete Check-In
            </button>
          </div>
        </div>
      `;
    }

    // ─── MODAL 2: GUEST FOLIO, SPLIT BILLING & SETTLEMENT ──────────────────
    case 'folio': {
      const roomNumber = data.roomNumber || '402';
      const folio = state.folios[roomNumber] || {
        roomNumber: roomNumber,
        guestName: 'In-House Guest',
        status: 'Open',
        currency: '$',
        items: [],
        payments: []
      };

      const totalCharges = folio.items.reduce((sum, i) => sum + i.amount + i.tax, 0);
      const totalPayments = folio.payments.reduce((sum, p) => sum + p.amount, 0);
      const balance = +(totalCharges - totalPayments).toFixed(2);

      return `
        <div style="padding: 24px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 16px;">
            <div>
              <div style="font-size: 11px; font-weight: 700; color: #2563EB; text-transform: uppercase;">Real-Time Guest Ledger</div>
              <h3 style="font-size: 20px; font-weight: 700; color: #0F172A;">Master Folio — Room ${roomNumber}</h3>
              <div style="font-size: 12px; color: #64748B;">Guest: <strong>${folio.guestName}</strong> • Folio Status: <span class="badge ${folio.status === 'Open' ? 'badge-clean' : 'badge-ooo'}">${folio.status}</span></div>
            </div>
            <button class="btn-secondary" id="btn-close-modal" style="padding: 4px 8px; border-radius: 6px;">
              <span class="material-symbols-outlined" style="font-size: 18px;">close</span>
            </button>
          </div>

          <!-- Folio Balance Summary Box -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px;">
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px;">
              <div style="font-size: 11px; color: #64748B; font-weight: 600;">Total Incurred Charges</div>
              <div style="font-size: 20px; font-weight: 800; color: #0F172A; margin-top: 2px;">$${totalCharges.toFixed(2)}</div>
            </div>
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px;">
              <div style="font-size: 11px; color: #64748B; font-weight: 600;">Settled Payments</div>
              <div style="font-size: 20px; font-weight: 800; color: #10B981; margin-top: 2px;">$${totalPayments.toFixed(2)}</div>
            </div>
            <div style="background: ${balance > 0 ? '#FEF2F2' : '#ECFDF5'}; border: 1px solid ${balance > 0 ? '#FECACA' : '#A7F3D0'}; border-radius: 8px; padding: 12px;">
              <div style="font-size: 11px; color: ${balance > 0 ? '#991B1B' : '#065F46'}; font-weight: 600;">Outstanding Balance</div>
              <div style="font-size: 20px; font-weight: 800; color: ${balance > 0 ? '#EF4444' : '#10B981'}; margin-top: 2px;">$${balance.toFixed(2)}</div>
            </div>
          </div>

          <!-- Itemized Transactions Table -->
          <div style="font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 8px; display:flex; justify-content:space-between; align-items:center;">
            <span>Itemized Guest Charges</span>
            <span style="font-size: 11px; color: #64748B;">Tax Auto-Calculated (10% VAT + Tourism Dirham)</span>
          </div>

          <div style="border: 1px solid #E2E8F0; border-radius: 8px; overflow: hidden; max-height: 220px; overflow-y: auto; margin-bottom: 20px;">
            <table class="enterprise-table" style="font-size: 12px;">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Dept</th>
                  <th>Description</th>
                  <th>Net</th>
                  <th>Tax</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${folio.items.map(item => `
                  <tr>
                    <td style="font-family: var(--font-mono); font-size: 11px; color: #64748B;">${item.date}</td>
                    <td><span class="badge badge-normal" style="font-size: 9px;">${item.dept}</span></td>
                    <td style="font-weight: 500;">${item.desc}</td>
                    <td>$${item.amount.toFixed(2)}</td>
                    <td style="color: #64748B;">$${item.tax.toFixed(2)}</td>
                    <td style="font-weight: 700; color: #0F172A;">$${(item.amount + item.tax).toFixed(2)}</td>
                  </tr>
                `).join('')}
                ${folio.items.length === 0 ? `<tr><td colspan="6" style="text-align:center; color:#94A3B8; padding:20px;">No charges posted to this folio yet.</td></tr>` : ''}
              </tbody>
            </table>
          </div>

          <!-- Settlement & Actions Footer -->
          <div style="display:flex; justify-content:space-between; align-items:center; border-top: 1px solid #E2E8F0; padding-top: 16px;">
            <button class="btn-secondary" id="btn-print-invoice" style="font-size: 12px;">
              <span class="material-symbols-outlined" style="font-size: 16px;">receipt_long</span>
              Print Official Tax Invoice (PDF)
            </button>
            <div style="display:flex; gap: 8px;">
              ${balance > 0 ? `
                <button class="btn-primary" id="btn-settle-folio-card" data-room="${roomNumber}" data-balance="${balance}">
                  <span class="material-symbols-outlined" style="font-size: 16px;">credit_card</span>
                  Settle Full Balance ($${balance.toFixed(2)})
                </button>
              ` : `
                <button class="btn-success" id="btn-checkout-room" data-room="${roomNumber}">
                  <span class="material-symbols-outlined" style="font-size: 16px;">logout</span>
                  Express Check-Out Room ${roomNumber}
                </button>
              `}
            </div>
          </div>
        </div>
      `;
    }

    // ─── MODAL 3: CREATE MAINTENANCE TICKET ────────────────────────────────
    case 'create_ticket': {
      return `
        <div style="padding: 24px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 16px;">
            <div>
              <div style="font-size: 11px; font-weight: 700; color: #F59E0B; text-transform: uppercase;">Engineering & Facilities</div>
              <h3 style="font-size: 20px; font-weight: 700; color: #0F172A;">Dispatch Maintenance Work Order</h3>
            </div>
            <button class="btn-secondary" id="btn-close-modal" style="padding: 4px 8px; border-radius: 6px;">
              <span class="material-symbols-outlined" style="font-size: 18px;">close</span>
            </button>
          </div>

          <form id="form-create-ticket" style="display:flex; flex-direction:column; gap: 14px;">
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="display:block; font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 4px;">Room or Location *</label>
                <input type="text" id="ticket-location" placeholder="e.g. Room 402 or Main Kitchen" required style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #CBD5E1; font-size:13px;" />
              </div>
              <div>
                <label style="display:block; font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 4px;">Category *</label>
                <select id="ticket-category" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #CBD5E1; font-size:13px;">
                  <option value="HVAC & Climate">HVAC & Climate</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Smart Lock / RFID">Smart Lock / RFID</option>
                  <option value="Kitchen Equipment">Kitchen Equipment</option>
                </select>
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="display:block; font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 4px;">Priority & SLA Countdown *</label>
                <select id="ticket-priority" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #CBD5E1; font-size:13px;">
                  <option value="Critical">Critical (45-Minute SLA Deadline)</option>
                  <option value="High" selected>High (90-Minute SLA Deadline)</option>
                  <option value="Medium">Medium (3-Hour SLA Deadline)</option>
                </select>
              </div>
              <div>
                <label style="display:block; font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 4px;">Assign Lead Engineer</label>
                <select id="ticket-engineer" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #CBD5E1; font-size:13px;">
                  <option value="Tariq Mahmoud (Lead HVAC)">Tariq Mahmoud (Lead HVAC)</option>
                  <option value="Marco Bellini (Plumbing Spec.)">Marco Bellini (Plumbing Spec.)</option>
                  <option value="Rajesh Kumar (Kitchen Mech.)">Rajesh Kumar (Kitchen Mech.)</option>
                </select>
              </div>
            </div>

            <div>
              <label style="display:block; font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 4px;">Issue Description & Symptoms *</label>
              <textarea id="ticket-desc" rows="3" placeholder="Describe the fault in detail for the attending technician..." required style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #CBD5E1; font-size:13px; font-family:var(--font-body);"></textarea>
            </div>

            <div style="display:flex; justify-content:flex-end; gap: 10px; margin-top: 10px;">
              <button type="button" class="btn-secondary" id="btn-cancel-modal">Cancel</button>
              <button type="submit" class="btn-primary">
                <span class="material-symbols-outlined" style="font-size: 16px;">bolt</span>
                Dispatch Work Order
              </button>
            </div>
          </form>
        </div>
      `;
    }

    // ─── MODAL 4: CREATE RECIPE & BOM COSTING ──────────────────────────────
    case 'create_recipe': {
      return `
        <div style="padding: 24px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 16px;">
            <div>
              <div style="font-size: 11px; font-weight: 700; color: #A855F7; text-transform: uppercase;">F&B Kitchen Engineering</div>
              <h3 style="font-size: 20px; font-weight: 700; color: #0F172A;">Recipe Creator & BOM Costing</h3>
            </div>
            <button class="btn-secondary" id="btn-close-modal" style="padding: 4px 8px; border-radius: 6px;">
              <span class="material-symbols-outlined" style="font-size: 18px;">close</span>
            </button>
          </div>

          <form id="form-create-recipe" style="display:flex; flex-direction:column; gap: 14px;">
            <div style="display:grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px;">
              <div>
                <label style="display:block; font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 4px;">Dish Name *</label>
                <input type="text" id="recipe-name" placeholder="e.g. Pan-Seared Chilean Sea Bass" required style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #CBD5E1; font-size:13px;" />
              </div>
              <div>
                <label style="display:block; font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 4px;">Selling Price ($) *</label>
                <input type="number" step="0.5" id="recipe-price" value="52.00" required style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #CBD5E1; font-size:13px;" />
              </div>
              <div>
                <label style="display:block; font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 4px;">Yield %</label>
                <input type="number" id="recipe-yield" value="95" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #CBD5E1; font-size:13px;" />
              </div>
            </div>

            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px;">
              <div style="font-size: 12px; font-weight: 700; color: #334155; margin-bottom: 8px;">Bill of Materials (BOM) — Select Primary Ingredients</div>
              <div style="font-size: 12px; color: #64748B;">
                Primary Ingredient: <strong>Miyazaki A5 Wagyu Beef Striploin</strong> (0.20 kg @ $110/kg = $22.00)<br/>
                Secondary Ingredient: <strong>Handmade Brioche Bun</strong> (1 pcs @ $1.20 = $1.20)<br/>
                Garnish & Sauces: <strong>Black Truffle Aioli</strong> (0.03 kg @ $45/kg = $1.35)
              </div>
              <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed #CBD5E1; display:flex; justify-content:space-between; font-weight: 700; font-size: 13px; color: #0F172A;">
                <span>Total Standard Recipe Cost:</span>
                <span style="color: #2563EB;">$24.55 (Food Cost: 47.2%)</span>
              </div>
            </div>

            <div>
              <label style="display:block; font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 4px;">Chef Preparation Instructions</label>
              <textarea id="recipe-instructions" rows="2" placeholder="Standardized cooking technique, plating guidelines, allergen handling..." style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #CBD5E1; font-size:13px; font-family:var(--font-body);"></textarea>
            </div>

            <div style="display:flex; justify-content:flex-end; gap: 10px;">
              <button type="button" class="btn-secondary" id="btn-cancel-modal">Cancel</button>
              <button type="submit" class="btn-primary">
                <span class="material-symbols-outlined" style="font-size: 16px;">save</span>
                Save Recipe & Publish to POS
              </button>
            </div>
          </form>
        </div>
      `;
    }

    // ─── MODAL 5: ROOM INSPECTION QA CHECKLIST ─────────────────────────────
    case 'inspect_room': {
      const roomNumber = data.roomNumber || '403';
      return `
        <div style="padding: 24px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 16px;">
            <div>
              <div style="font-size: 11px; font-weight: 700; color: #2563EB; text-transform: uppercase;">Housekeeping Quality Assurance</div>
              <h3 style="font-size: 20px; font-weight: 700; color: #0F172A;">Digital Inspection Checklist — Room ${roomNumber}</h3>
            </div>
            <button class="btn-secondary" id="btn-close-modal" style="padding: 4px 8px; border-radius: 6px;">
              <span class="material-symbols-outlined" style="font-size: 18px;">close</span>
            </button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            ${[
              'Bedding: Egyptian cotton sheets tight with hospital corners',
              'Bathroom: Marble vanity sanitized, mirror spotless, zero water spots',
              'Towels: 4 Bath, 2 Hand, 2 Face folded to brand standard',
              'Amenities: Bvlgari Thé Blanc bottles fully replenished and aligned',
              'Minibar & Coffee: Illy espresso pods restocked, crystal glasses polished',
              'Climate: AC set to 21.0°C and remote batteries verified',
              'Electronics: Smart TV welcome screen active, bedside USB working',
              'Balcony / Terrace: Glass clean, furniture dusted and cushions placed'
            ].map((check, i) => `
              <label style="display: flex; align-items: center; gap: 10px; font-size: 13px; color: #1E293B; background: #F8FAFC; padding: 8px 12px; border-radius: 6px; border: 1px solid #E2E8F0; cursor: pointer;">
                <input type="checkbox" checked style="width: 16px; height: 16px; accent-color: #2563EB;" />
                <span>${check}</span>
              </label>
            `).join('')}
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button class="btn-secondary" id="btn-cancel-modal">Cancel</button>
            <button class="btn-primary" id="btn-approve-inspection" data-room="${roomNumber}">
              <span class="material-symbols-outlined" style="font-size: 16px;">verified</span>
              Approve & Mark "Inspected / Ready"
            </button>
          </div>
        </div>
      `;
    }

    // ─── MODAL 6: QUICK ACTIONS LAUNCHER ──────────────────────────────────
    case 'quick_actions': {
      return `
        <div style="padding: 24px;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 16px;">
            <div>
              <div style="font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;">Quick Operational Hub</div>
              <h3 style="font-size: 20px; font-weight: 700; color: #0F172A;">Launch Action</h3>
            </div>
            <button class="btn-secondary" id="btn-close-modal" style="padding: 4px 8px; border-radius: 6px;">
              <span class="material-symbols-outlined" style="font-size: 18px;">close</span>
            </button>
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
            <div class="enterprise-card" style="padding: 16px; cursor: pointer;" id="qa-btn-checkin">
              <span class="material-symbols-outlined" style="font-size: 28px; color: #2563EB; margin-bottom: 8px;">key</span>
              <div style="font-weight: 700; font-size: 14px; color: #0F172A;">Front Desk Check-In</div>
              <div style="font-size: 12px; color: #64748B; margin-top: 2px;">Allocate inspected room and issue keys</div>
            </div>

            <div class="enterprise-card" style="padding: 16px; cursor: pointer;" id="qa-btn-ticket">
              <span class="material-symbols-outlined" style="font-size: 28px; color: #F59E0B; margin-bottom: 8px;">build</span>
              <div style="font-weight: 700; font-size: 14px; color: #0F172A;">New Maintenance Ticket</div>
              <div style="font-size: 12px; color: #64748B; margin-top: 2px;">Dispatch work order with SLA countdown</div>
            </div>

            <div class="enterprise-card" style="padding: 16px; cursor: pointer;" id="qa-btn-recipe">
              <span class="material-symbols-outlined" style="font-size: 28px; color: #A855F7; margin-bottom: 8px;">restaurant_menu</span>
              <div style="font-weight: 700; font-size: 14px; color: #0F172A;">Create F&B Recipe</div>
              <div style="font-size: 12px; color: #64748B; margin-top: 2px;">Calculate BOM food cost and margins</div>
            </div>

            <div class="enterprise-card" style="padding: 16px; cursor: pointer;" id="qa-btn-order-wagyu">
              <span class="material-symbols-outlined" style="font-size: 28px; color: #10B981; margin-bottom: 8px;">fastfood</span>
              <div style="font-weight: 700; font-size: 14px; color: #0F172A;">Simulate In-Room Order</div>
              <div style="font-size: 12px; color: #64748B; margin-top: 2px;">Charges Folio 402 & deducts Wagyu inventory</div>
            </div>
          </div>
        </div>
      `;
    }

    default:
      return `<div style="padding: 20px;">Modal content not found.</div>`;
  }
}

export function bindModalEvents() {
  const backdrop = document.getElementById('modal-universal-backdrop');
  if (!backdrop) return;

  // Close buttons
  const closeBtn = document.getElementById('btn-close-modal');
  const cancelBtn = document.getElementById('btn-cancel-modal');
  if (closeBtn) closeBtn.addEventListener('click', () => store.closeModal());
  if (cancelBtn) cancelBtn.addEventListener('click', () => store.closeModal());

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      store.closeModal();
    }
  });

  // Check-In Confirm
  const checkinBtn = document.getElementById('btn-confirm-checkin');
  if (checkinBtn) {
    checkinBtn.addEventListener('click', () => {
      const resId = checkinBtn.dataset.resId;
      const selectEl = document.getElementById('modal-select-room');
      const chosenRoom = selectEl ? selectEl.value : '402';
      store.checkInReservation(resId, chosenRoom);
      store.closeModal();
    });
  }

  // Folio Settle
  const settleBtn = document.getElementById('btn-settle-folio-card');
  if (settleBtn) {
    settleBtn.addEventListener('click', () => {
      const roomNumber = settleBtn.dataset.room;
      const balance = parseFloat(settleBtn.dataset.balance);
      store.settleGuestFolio(roomNumber, 'Credit Card (Amex Centurion)', balance);
      store.closeModal();
    });
  }

  // Folio Checkout Room
  const checkoutBtn = document.getElementById('btn-checkout-room');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const roomNumber = checkoutBtn.dataset.room;
      store.checkOutRoom(roomNumber);
      store.closeModal();
    });
  }

  // Print Invoice
  const printBtn = document.getElementById('btn-print-invoice');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Maintenance Ticket Form Submit
  const ticketForm = document.getElementById('form-create-ticket');
  if (ticketForm) {
    ticketForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const location = document.getElementById('ticket-location').value;
      const category = document.getElementById('ticket-category').value;
      const priority = document.getElementById('ticket-priority').value;
      const engineer = document.getElementById('ticket-engineer').value;
      const desc = document.getElementById('ticket-desc').value;

      store.createMaintenanceTicket({
        roomOrArea: location,
        category: category,
        priority: priority,
        assignedEngineer: engineer,
        description: desc
      });
      store.closeModal();
    });
  }

  // Recipe Creator Form Submit
  const recipeForm = document.getElementById('form-create-recipe');
  if (recipeForm) {
    recipeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('recipe-name').value;
      const price = parseFloat(document.getElementById('recipe-price').value);
      const yieldVal = parseInt(document.getElementById('recipe-yield').value, 10);
      const instructions = document.getElementById('recipe-instructions').value;

      store.addRecipe({
        name: name,
        menuCategoryId: 'Mains',
        sellingPrice: price,
        portionSize: '1 Portion',
        yieldPct: yieldVal,
        prepTimeMin: 20,
        matrixCategory: 'Star',
        ingredients: [
          { ingredientId: 'ing-1', name: 'Miyazaki A5 Wagyu Beef', qty: 0.20, unit: 'kg', unitCost: 110.00, lineCost: 22.00 },
          { ingredientId: 'ing-2', name: 'Brioche Bun', qty: 1, unit: 'pcs', unitCost: 1.20, lineCost: 1.20 },
          { ingredientId: 'ing-3', name: 'Black Truffle Aioli', qty: 0.03, unit: 'kg', unitCost: 45.00, lineCost: 1.35 }
        ],
        standardCost: 24.55,
        foodCostPct: +((24.55 / price) * 100).toFixed(1),
        instructions: instructions || 'Standardized chef preparation technique.'
      });
      store.closeModal();
    });
  }

  // Inspection QA Approve
  const approveInspBtn = document.getElementById('btn-approve-inspection');
  if (approveInspBtn) {
    approveInspBtn.addEventListener('click', () => {
      const roomNumber = approveInspBtn.dataset.room;
      const room = store.state.rooms.find(r => r.id === roomNumber);
      if (room) {
        room.status = 'Inspected';
        const task = store.state.housekeepingTasks.find(t => t.roomNumber === roomNumber);
        if (task) task.status = 'Inspected';
        store.showToast(`Room ${roomNumber} passed 8-point QA inspection and is now Inspected / Ready!`, 'success');
      }
      store.closeModal();
    });
  }

  // Quick Action Buttons
  const qaCheckin = document.getElementById('qa-btn-checkin');
  if (qaCheckin) qaCheckin.addEventListener('click', () => store.setModal({ type: 'check_in', data: {} }));

  const qaTicket = document.getElementById('qa-btn-ticket');
  if (qaTicket) qaTicket.addEventListener('click', () => store.setModal({ type: 'create_ticket', data: {} }));

  const qaRecipe = document.getElementById('qa-btn-recipe');
  if (qaRecipe) qaRecipe.addEventListener('click', () => store.setModal({ type: 'create_recipe', data: {} }));

  const qaOrder = document.getElementById('qa-btn-order-wagyu');
  if (qaOrder) {
    qaOrder.addEventListener('click', () => {
      store.orderMenuItem('402', 'rec-1', 1);
      store.closeModal();
    });
  }
}
