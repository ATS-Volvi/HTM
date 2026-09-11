// ==========================================================================
// VOLVITECH HOSPITALITY OS — GUEST 360° CRM & PROFILE HUB
// ==========================================================================

import { store } from '../state/store.js';

export function renderGuestCRMView(state) {
  const guests = state.guests;

  return `
    <div class="workspace-main animate-fade-in">
      <!-- Header -->
      <div class="page-header-container">
        <div>
          <div style="font-size: 11px; font-weight: 700; color: #2563EB; text-transform: uppercase;">Guest Intelligence & Loyalty</div>
          <h1 class="page-title">Unified Guest 360° Directory</h1>
          <div class="page-subtitle">Comprehensive preference management, lifetime value metrics, and loyalty history</div>
        </div>

        <div style="display: flex; gap: 10px;">
          <button class="btn-primary" id="btn-add-guest-profile">
            <span class="material-symbols-outlined" style="font-size: 16px;">person_add</span>
            Create VIP Profile
          </button>
        </div>
      </div>

      <!-- Guest Cards Grid -->
      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${guests.map(g => `
          <div class="enterprise-card" style="padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="width: 48px; height: 48px; border-radius: 9999px; background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 18px; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);">
                  ${g.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <h3 style="font-size: 18px; font-weight: 700; color: #0F172A;">${g.name}</h3>
                    <span class="badge badge-vip">★ ${g.vipTier}</span>
                    <span class="badge badge-clean">Current: Suite ${g.currentRoom}</span>
                  </div>
                  <div style="font-size: 12px; color: #64748B; margin-top: 2px;">
                    ${g.email} • ${g.phone} • Passport: ${g.passportNumber}
                  </div>
                </div>
              </div>

              <!-- LTV Metrics -->
              <div style="display: flex; gap: 20px; text-align: right;">
                <div>
                  <div style="font-size: 11px; color: #64748B; font-weight: 600;">Lifetime Spend</div>
                  <div style="font-size: 18px; font-weight: 800; color: #0F172A;">$${g.lifetimeSpend.toLocaleString()}</div>
                </div>
                <div>
                  <div style="font-size: 11px; color: #64748B; font-weight: 600;">Completed Stays</div>
                  <div style="font-size: 18px; font-weight: 800; color: #2563EB;">${g.totalStays} Stays</div>
                </div>
                <div>
                  <div style="font-size: 11px; color: #64748B; font-weight: 600;">Loyalty Tier Points</div>
                  <div style="font-size: 18px; font-weight: 800; color: #F59E0B;">${g.loyaltyPoints.toLocaleString()} pts</div>
                </div>
              </div>
            </div>

            <!-- Guest Preferences & Notes Breakdown -->
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px;">
              <div>
                <div style="font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 6px;">
                  Stay Preferences & Allergen Matrix
                </div>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; font-size: 12px; color: #334155;">
                  <div><strong>Pillow Menu:</strong> ${g.preferences.pillow}</div>
                  <div><strong>Room Climate:</strong> ${g.preferences.roomTemp}</div>
                  <div><strong>Dietary / Allergens:</strong> <span style="color: #EF4444; font-weight: 600;">${g.preferences.dietary}</span></div>
                  <div><strong>Beverage:</strong> ${g.preferences.beverage}</div>
                </div>
              </div>

              <div style="border-left: 1px solid #E2E8F0; padding-left: 14px;">
                <div style="font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; margin-bottom: 4px;">
                  Executive Concierge Notes
                </div>
                <div style="font-size: 12px; color: #475569; font-style: italic;">
                  "${g.notes}"
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function bindGuestCRMEvents() {
  const addBtn = document.getElementById('btn-add-guest-profile');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      store.showToast('VIP Guest Profile creation modal initialized with KYC verification.', 'info');
    });
  }
}
