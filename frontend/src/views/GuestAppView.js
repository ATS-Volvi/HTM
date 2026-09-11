// ==========================================================================
// VOLVITECH HOSPITALITY OS — GUEST MOBILE EXPERIENCE PORTAL
// ==========================================================================

import { store } from '../state/store.js';

export function renderGuestAppView(state) {
  const stay = state.activeGuestStay;
  const folio = state.folios[stay.roomNumber] || { items: [], payments: [] };
  const totalCharges = folio.items.reduce((sum, i) => sum + i.amount + i.tax, 0);
  const totalPayments = folio.payments.reduce((sum, p) => sum + p.amount, 0);
  const balance = +(totalCharges - totalPayments).toFixed(2);
  const recipes = state.recipes;

  return `
    <div class="mobile-simulator-wrapper animate-fade-in">
      <div class="mobile-phone-casing">
        <div class="phone-dynamic-island"></div>
        <div class="mobile-screen-viewport">
          <!-- Top Guest App Header -->
          <div style="background: linear-gradient(135deg, #0B1320 0%, #1E3A8A 100%); color: #FFFFFF; padding: 40px 18px 20px 18px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div style="font-size: 11px; font-weight: 700; color: #60A5FA; letter-spacing: 0.5px;">THE GRAND ASTORIA PALM</div>
                <h2 style="font-size: 18px; font-weight: 800; margin-top: 2px;">Welcome, ${stay.guestName.split(' ')[1] || stay.guestName}</h2>
                <div style="font-size: 11px; color: #94A3B8; margin-top: 2px;">Suite ${stay.roomNumber} • ${stay.vipTier} VIP Member</div>
              </div>
              <div style="width: 36px; height: 36px; border-radius: 9999px; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center;">
                <span class="material-symbols-outlined" style="font-size: 20px; color: #FCD34D;">star</span>
              </div>
            </div>

            <!-- Digital Keycard Card Widget -->
            <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 14px; margin-top: 14px; display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 38px; height: 38px; border-radius: 8px; background: ${stay.isDigitalKeyUnlocked ? '#10B981' : '#2563EB'}; display: flex; align-items: center; justify-content: center;">
                  <span class="material-symbols-outlined" style="font-size: 20px; color: #FFFFFF;">
                    ${stay.isDigitalKeyUnlocked ? 'lock_open' : 'key'}
                  </span>
                </div>
                <div>
                  <div style="font-weight: 700; font-size: 13px;">Digital Room Key</div>
                  <div style="font-size: 10px; color: #93C5FD;">
                    ${stay.isDigitalKeyUnlocked ? 'Door Unlocked (BLE Active)' : 'Tap to Unlock Door 402'}
                  </div>
                </div>
              </div>

              <button class="btn-primary" id="btn-toggle-digital-key" style="padding: 6px 12px; font-size: 11px; background: ${stay.isDigitalKeyUnlocked ? '#10B981' : '#FFFFFF'}; color: ${stay.isDigitalKeyUnlocked ? '#FFFFFF' : '#0F172A'}; border: none;">
                ${stay.isDigitalKeyUnlocked ? 'Lock Door' : 'Unlock Room'}
              </button>
            </div>
          </div>

          <!-- Mobile App Body Content -->
          <div class="mobile-app-content">
            <!-- In-Room Dining Quick Order -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span style="font-weight: 700; font-size: 13px; color: #0F172A;">In-Room Fine Dining</span>
              <span style="font-size: 10px; color: #2563EB; font-weight: 600;">24/7 Butler Service</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
              ${recipes.map(r => `
                <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
                  <div style="flex: 1; padding-right: 10px;">
                    <div style="font-weight: 700; font-size: 13px; color: #0F172A;">${r.name}</div>
                    <div style="font-size: 11px; color: #64748B; margin: 2px 0;">${r.portionSize} • ~${r.prepTimeMin}m prep</div>
                    <div style="font-weight: 800; font-size: 13px; color: #2563EB;">$${r.sellingPrice.toFixed(2)}</div>
                  </div>
                  <button class="btn-primary btn-guest-order-item" style="padding: 6px 12px; font-size: 11px;" data-recipe-id="${r.id}">
                    <span class="material-symbols-outlined" style="font-size: 14px;">add_shopping_cart</span>
                    Order
                  </button>
                </div>
              `).join('')}
            </div>

            <!-- Digital Concierge Service Requests -->
            <div style="font-weight: 700; font-size: 13px; color: #0F172A; margin-bottom: 10px;">Digital Concierge Requests</div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 20px;">
              <button class="enterprise-card btn-guest-request" data-req="Towels" style="padding: 10px; text-align: center; border: 1px solid #E2E8F0; cursor: pointer;">
                <span class="material-symbols-outlined" style="font-size: 22px; color: #2563EB;">dry_cleaning</span>
                <div style="font-size: 11px; font-weight: 700; color: #0F172A; margin-top: 4px;">Extra Towels</div>
              </button>
              <button class="enterprise-card btn-guest-request" data-req="Pillows" style="padding: 10px; text-align: center; border: 1px solid #E2E8F0; cursor: pointer;">
                <span class="material-symbols-outlined" style="font-size: 22px; color: #8B5CF6;">bed</span>
                <div style="font-size: 11px; font-weight: 700; color: #0F172A; margin-top: 4px;">Pillow Menu</div>
              </button>
              <button class="enterprise-card btn-guest-request" data-req="Housekeeping" style="padding: 10px; text-align: center; border: 1px solid #E2E8F0; cursor: pointer;">
                <span class="material-symbols-outlined" style="font-size: 22px; color: #10B981;">cleaning_services</span>
                <div style="font-size: 11px; font-weight: 700; color: #0F172A; margin-top: 4px;">Clean Room</div>
              </button>
              <button class="enterprise-card btn-guest-request" data-req="Luggage" style="padding: 10px; text-align: center; border: 1px solid #E2E8F0; cursor: pointer;">
                <span class="material-symbols-outlined" style="font-size: 22px; color: #F59E0B;">luggage</span>
                <div style="font-size: 11px; font-weight: 700; color: #0F172A; margin-top: 4px;">Luggage Pickup</div>
              </button>
            </div>

            <!-- Real-Time Master Folio Widget & Express Checkout -->
            <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; padding: 14px; margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <div style="font-weight: 700; font-size: 13px; color: #0F172A;">Live In-Stay Folio Balance</div>
                <span class="badge badge-clean">Auto-Sync</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-size: 10px; color: #64748B;">Outstanding (Net + Tax)</div>
                  <div style="font-size: 20px; font-weight: 800; color: #0F172A;">$${balance.toFixed(2)}</div>
                </div>
                <button class="btn-primary btn-guest-view-folio" style="padding: 6px 12px; font-size: 11px;">
                  View & Settle
                </button>
              </div>
            </div>
          </div>

          <!-- Guest Bottom Navigation -->
          <div class="mobile-bottom-bar">
            <button class="mobile-nav-btn active">
              <span class="material-symbols-outlined" style="font-size: 20px;">home</span>
              <span>Stay</span>
            </button>
            <button class="mobile-nav-btn btn-guest-view-folio">
              <span class="material-symbols-outlined" style="font-size: 20px;">receipt_long</span>
              <span>Folio</span>
            </button>
            <button class="mobile-nav-btn" id="btn-guest-switch-web">
              <span class="material-symbols-outlined" style="font-size: 20px;">desktop_windows</span>
              <span>HMS Web</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindGuestAppEvents() {
  // Digital Key Toggle
  const keyBtn = document.getElementById('btn-toggle-digital-key');
  if (keyBtn) {
    keyBtn.addEventListener('click', () => {
      store.toggleDigitalKey();
    });
  }

  // In-Room Order Item
  document.querySelectorAll('.btn-guest-order-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const recId = btn.dataset.recipeId;
      store.orderMenuItem('402', recId, 1);
    });
  });

  // Concierge Request
  document.querySelectorAll('.btn-guest-request').forEach(btn => {
    btn.addEventListener('click', () => {
      const reqName = btn.dataset.req;
      store.showToast(`Request for "${reqName}" dispatched to Floor 4 Butler Team.`, 'success');
    });
  });

  // View Folio
  document.querySelectorAll('.btn-guest-view-folio').forEach(btn => {
    btn.addEventListener('click', () => {
      store.setModal({ type: 'folio', data: { roomNumber: '402' } });
    });
  });

  // Switch back to HMS Web
  const switchWeb = document.getElementById('btn-guest-switch-web');
  if (switchWeb) {
    switchWeb.addEventListener('click', () => {
      store.setInterfaceMode('web_hms');
    });
  }
}
