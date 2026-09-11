// ==========================================================================
// VOLVITECH HOSPITALITY OS — EXECUTIVE COMMAND DASHBOARD
// ==========================================================================

import { store } from '../state/store.js';

export function renderExecutiveDashboardView(state) {
  const rooms = state.rooms;
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.occupancy === 'Occupied').length;
  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

  const adr = 442.50; // Average Daily Rate
  const revpar = +((adr * (occupancyRate / 100))).toFixed(2); // Revenue Per Available Room
  const trevpar = +(revpar * 1.42).toFixed(2); // Total RevPAR including F&B + Spa
  const goppar = +(revpar * 0.48).toFixed(2); // Gross Operating Profit PAR

  const dirtyRooms = rooms.filter(r => r.status === 'Dirty').length;
  const inspectedRooms = rooms.filter(r => r.status === 'Inspected').length;
  const openMaint = state.maintenanceTickets.filter(m => m.status !== 'Resolved').length;
  const pendingPRs = state.purchaseRequisitions.filter(pr => pr.status.includes('Pending')).length;

  return `
    <div class="workspace-main animate-fade-in">
      <!-- Page Header -->
      <div class="page-header-container">
        <div>
          <div style="font-size: 11px; font-weight: 700; color: #2563EB; text-transform: uppercase; letter-spacing: 0.5px;">Corporate Executive Suite</div>
          <h1 class="page-title">Executive Command & Operations Pulse</h1>
          <div class="page-subtitle">Real-time telemetry and revenue performance for The Grand Astoria Palm & Resort</div>
        </div>

        <div style="display: flex; gap: 10px; align-items: center;">
          <button class="btn-secondary" id="btn-night-audit-run">
            <span class="material-symbols-outlined" style="font-size: 16px; color: #6366F1;">bedtime</span>
            Execute Night Audit Roll
          </button>
          <button class="btn-primary" id="btn-quick-tape">
            <span class="material-symbols-outlined" style="font-size: 16px;">calendar_view_week</span>
            Open Tape Chart
          </button>
        </div>
      </div>

      <!-- Core Executive KPI Grid -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
        <div class="kpi-stat-card">
          <div class="kpi-title">
            <span>Occupancy Rate</span>
            <span class="material-symbols-outlined" style="font-size: 18px; color: #2563EB;">hotel</span>
          </div>
          <div class="kpi-value">${occupancyRate}%</div>
          <div class="kpi-trend trend-up">
            <span class="material-symbols-outlined" style="font-size: 14px;">trending_up</span>
            <span>+4.2% vs last week (${occupiedRooms}/${totalRooms} Keys)</span>
          </div>
        </div>

        <div class="kpi-stat-card">
          <div class="kpi-title">
            <span>RevPAR (Yield)</span>
            <span class="material-symbols-outlined" style="font-size: 18px; color: #10B981;">payments</span>
          </div>
          <div class="kpi-value">$${revpar.toFixed(2)}</div>
          <div class="kpi-trend trend-up">
            <span class="material-symbols-outlined" style="font-size: 14px;">trending_up</span>
            <span>ADR: $${adr.toFixed(2)} | Target: $320</span>
          </div>
        </div>

        <div class="kpi-stat-card">
          <div class="kpi-title">
            <span>TrevPAR / GOPPAR</span>
            <span class="material-symbols-outlined" style="font-size: 18px; color: #F59E0B;">account_balance</span>
          </div>
          <div class="kpi-value">$${trevpar.toFixed(2)}</div>
          <div class="kpi-trend trend-up">
            <span class="material-symbols-outlined" style="font-size: 14px;">trending_up</span>
            <span>GOPPAR: $${goppar.toFixed(2)} (48% Margin)</span>
          </div>
        </div>

        <div class="kpi-stat-card">
          <div class="kpi-title">
            <span>Food Cost & Par</span>
            <span class="material-symbols-outlined" style="font-size: 18px; color: #A855F7;">restaurant</span>
          </div>
          <div class="kpi-value">28.4%</div>
          <div class="kpi-trend trend-neutral">
            <span class="material-symbols-outlined" style="font-size: 14px;">check_circle</span>
            <span>Within 30% Budget Target</span>
          </div>
        </div>
      </div>

      <!-- Operational Status Matrix & Action Panels -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 24px;">
        <!-- Left: Operations Hub & Cross-Department Pulse -->
        <div class="enterprise-card" style="padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div style="font-weight: 700; font-size: 15px; color: #0F172A;">Departmental Operational Mesh</div>
            <span class="badge badge-clean">All Systems Healthy</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px;">
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px;">
              <div style="font-size: 11px; font-weight: 600; color: #64748B;">ROOMS & HOUSEKEEPING</div>
              <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 4px 0;">${inspectedRooms} Ready / ${dirtyRooms} Dirty</div>
              <div style="font-size: 11px; color: #2563EB; font-weight: 500;">Avg Turnaround: 38 min</div>
            </div>

            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px;">
              <div style="font-size: 11px; font-weight: 600; color: #64748B;">MAINTENANCE SLA</div>
              <div style="font-size: 18px; font-weight: 800; color: ${openMaint > 0 ? '#F59E0B' : '#10B981'}; margin: 4px 0;">${openMaint} Active Tickets</div>
              <div style="font-size: 11px; color: #10B981; font-weight: 500;">98.2% SLA Compliance</div>
            </div>

            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px;">
              <div style="font-size: 11px; font-weight: 600; color: #64748B;">PURCHASE APPROVALS</div>
              <div style="font-size: 18px; font-weight: 800; color: ${pendingPRs > 0 ? '#EF4444' : '#10B981'}; margin: 4px 0;">${pendingPRs} Pending PRs</div>
              <div style="font-size: 11px; color: #EF4444; font-weight: 500;">Requires GM Sign-Off</div>
            </div>
          </div>

          <!-- Quick Live Rooms Grid Snippet -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px;">
            <div style="font-size: 12px; font-weight: 700; color: #475569;">VIP Suites & Penthouse State</div>
            <a href="#" id="link-view-all-rooms" style="font-size: 12px; color: #2563EB; text-decoration:none; font-weight:600;">View All Rooms →</a>
          </div>

          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
            ${rooms.slice(0, 8).map(r => `
              <div class="enterprise-card" style="padding: 10px; cursor: pointer; border-left: 3px solid ${r.status === 'Clean' ? '#10B981' : r.status === 'Inspected' ? '#2563EB' : r.status === 'Dirty' ? '#EF4444' : '#F59E0B'};" data-room-id="${r.id}">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-weight:800; font-size:14px; color:#0F172A;">${r.id}</span>
                  ${r.vip ? `<span class="badge badge-vip" style="font-size:8px;">VIP</span>` : ''}
                </div>
                <div style="font-size:10px; color:#64748B; margin:2px 0;">${r.type.split(' ')[0]} ${r.type.split(' ')[1] || ''}</div>
                <div style="font-size:11px; font-weight:600; color:#1E293B; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${r.guest}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right: Connected Workflow Alerts & Quick Actions -->
        <div style="display:flex; flex-direction:column; gap: 16px;">
          <!-- Critical Workflow Escalation Box -->
          <div class="enterprise-card" style="padding: 18px; border-left: 4px solid #F59E0B;">
            <div style="display:flex; align-items:center; gap:8px; margin-bottom: 10px;">
              <span class="material-symbols-outlined" style="font-size:20px; color:#F59E0B;">notification_important</span>
              <div style="font-weight:700; font-size:13px; color:#0F172A;">Connected Workflow Triggers</div>
            </div>
            <div style="font-size: 12px; color: #475569; display:flex; flex-direction:column; gap: 10px;">
              <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 6px; padding: 8px;">
                <strong>Supply Chain:</strong> PR-2026-0042 auto-created due to Caviar minimum par breach (8 tins left).
              </div>
              <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 6px; padding: 8px;">
                <strong>Maintenance SLA:</strong> Ticket #maint-101 (Daikin VRV Chiller) has 34m remaining.
              </div>
            </div>
          </div>

          <!-- Telemetry & Property Hardware -->
          <div class="enterprise-card" style="padding: 18px;">
            <div style="font-weight:700; font-size:13px; color:#0F172A; margin-bottom: 12px;">Building & IoT Telemetry</div>
            <div style="display: flex; flex-direction:column; gap: 8px; font-size: 12px;">
              <div style="display:flex; justify-content:space-between; color:#475569;">
                <span>Chiller Loop & HVAC:</span>
                <span style="font-weight:600; color:#10B981;">21.4°C / 48% RH</span>
              </div>
              <div style="display:flex; justify-content:space-between; color:#475569;">
                <span>Saflok Smart Locks:</span>
                <span style="font-weight:600; color:#10B981;">99.4% Gateway Online</span>
              </div>
              <div style="display:flex; justify-content:space-between; color:#475569;">
                <span>Water Booster Pressure:</span>
                <span style="font-weight:600; color:#10B981;">5.2 Bar (Optimal)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindExecutiveDashboardEvents() {
  const tapeBtn = document.getElementById('btn-quick-tape');
  if (tapeBtn) {
    tapeBtn.addEventListener('click', () => store.setNavTab('tape_chart'));
  }

  const nightAuditBtn = document.getElementById('btn-night-audit-run');
  if (nightAuditBtn) {
    nightAuditBtn.addEventListener('click', () => {
      store.showToast('Night Audit Roll executed: Posted daily tariffs, audited taxes, and closed Business Date 2026-09-01.', 'success');
    });
  }

  const viewAllRooms = document.getElementById('link-view-all-rooms');
  if (viewAllRooms) {
    viewAllRooms.addEventListener('click', (e) => {
      e.preventDefault();
      store.setNavTab('housekeeping');
    });
  }

  document.querySelectorAll('[data-room-id]').forEach(card => {
    card.addEventListener('click', () => {
      const roomId = card.dataset.roomId;
      store.setModal({ type: 'folio', data: { roomNumber: roomId } });
    });
  });
}
