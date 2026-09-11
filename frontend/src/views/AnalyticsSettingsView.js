// ==========================================================================
// VOLVITECH HOSPITALITY OS — BI ANALYTICS & RBAC GOVERNANCE VIEW
// ==========================================================================

import { store } from '../state/store.js';

export function renderAnalyticsSettingsView(state) {
  const isSettings = state.activeNavTab === 'settings';

  return `
    <div class="workspace-main animate-fade-in">
      <!-- Header -->
      <div class="page-header-container">
        <div>
          <div style="font-size: 11px; font-weight: 700; color: #2563EB; text-transform: uppercase;">
            ${isSettings ? 'Enterprise Administration' : 'Business Intelligence & Yield'}
          </div>
          <h1 class="page-title">${isSettings ? 'System Security & Granular RBAC Matrix' : 'Multi-Property Performance & GOPPAR Analytics'}</h1>
          <div class="page-subtitle">
            ${isSettings ? 'Manage fine-grained role capabilities, audit logging, and property configurations' : 'RevPAR, TrevPAR, Departmental Food Cost % and Labor Efficiency benchmarks'}
          </div>
        </div>
      </div>

      ${!isSettings ? `
        <!-- BI Performance Grid -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
          <div class="kpi-stat-card">
            <div class="kpi-title">Dubai Palm Flagship RevPAR</div>
            <div class="kpi-value" style="color: #2563EB;">$392.40</div>
            <div style="font-size: 11px; color: #10B981; font-weight: 600;">+12.4% vs Luxury CompSet</div>
          </div>
          <div class="kpi-stat-card">
            <div class="kpi-title">St. Moritz Alpine GOPPAR</div>
            <div class="kpi-value" style="color: #10B981;">CHF 410.00</div>
            <div style="font-size: 11px; color: #10B981; font-weight: 600;">Gross Operating Profit: 52%</div>
          </div>
          <div class="kpi-stat-card">
            <div class="kpi-title">London Mayfair TrevPAR</div>
            <div class="kpi-value" style="color: #F59E0B;">£510.00</div>
            <div style="font-size: 11px; color: #2563EB; font-weight: 600;">F&B Michelin Contribution: 38%</div>
          </div>
        </div>

        <!-- Financial Breakdown Table -->
        <div class="enterprise-table-wrapper">
          <div style="padding: 14px 16px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; font-weight: 700; font-size: 13px; color: #0F172A;">
            Consolidated Multi-Property Financial Summary (Q3 2026)
          </div>
          <table class="enterprise-table">
            <thead>
              <tr>
                <th>Property Unit</th>
                <th>Keys</th>
                <th>Occupancy %</th>
                <th>ADR</th>
                <th>RevPAR</th>
                <th>F&B Revenue</th>
                <th>GOPPAR</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: 700; color: #0F172A;">The Grand Astoria Palm (Dubai)</td>
                <td>32 Suites</td>
                <td><span class="badge badge-clean">88%</span></td>
                <td>$480.00</td>
                <td>$422.40</td>
                <td>$142,500.00</td>
                <td>$218.00</td>
              </tr>
              <tr>
                <td style="font-weight: 700; color: #0F172A;">Volvitech Alpine Grand (St. Moritz)</td>
                <td>48 Suites</td>
                <td><span class="badge badge-clean">92%</span></td>
                <td>CHF 620.00</td>
                <td>CHF 570.40</td>
                <td>CHF 210,000.00</td>
                <td>CHF 310.00</td>
              </tr>
              <tr>
                <td style="font-weight: 700; color: #0F172A;">Volvitech Metropolis (London)</td>
                <td>65 Keys</td>
                <td><span class="badge badge-clean">84%</span></td>
                <td>£380.00</td>
                <td>£319.20</td>
                <td>£185,000.00</td>
                <td>£168.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      ` : `
        <!-- RBAC Governance Matrix Table -->
        <div class="enterprise-table-wrapper" style="margin-bottom: 24px;">
          <div style="padding: 14px 16px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; font-weight: 700; font-size: 13px; color: #0F172A;">
            Granular Role-Based Access Control (RBAC) Policies
          </div>
          <table class="enterprise-table">
            <thead>
              <tr>
                <th>Module / Capability</th>
                <th>GM / Owner</th>
                <th>Front Desk</th>
                <th>Housekeeping</th>
                <th>Maintenance</th>
                <th>Chef / F&B</th>
                <th>Procurement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Tape Chart & Reservations</strong></td>
                <td><span class="badge badge-clean">Full Admin</span></td>
                <td><span class="badge badge-clean">Create / Assign</span></td>
                <td><span class="badge badge-ooo">View State</span></td>
                <td><span class="badge badge-ooo">View State</span></td>
                <td><span class="badge badge-ooo">View Name</span></td>
                <td><span class="badge badge-dirty">No Access</span></td>
              </tr>
              <tr>
                <td><strong>Folio Billing & Payments</strong></td>
                <td><span class="badge badge-clean">Full + Void</span></td>
                <td><span class="badge badge-clean">Settle & Split</span></td>
                <td><span class="badge badge-dirty">No Access</span></td>
                <td><span class="badge badge-dirty">No Access</span></td>
                <td><span class="badge badge-normal">Post In-Room</span></td>
                <td><span class="badge badge-ooo">View Invoices</span></td>
              </tr>
              <tr>
                <td><strong>F&B Recipe & BOM Costing</strong></td>
                <td><span class="badge badge-ooo">View Margins</span></td>
                <td><span class="badge badge-dirty">No Access</span></td>
                <td><span class="badge badge-dirty">No Access</span></td>
                <td><span class="badge badge-dirty">No Access</span></td>
                <td><span class="badge badge-clean">Full Admin</span></td>
                <td><span class="badge badge-normal">View Ingredients</span></td>
              </tr>
              <tr>
                <td><strong>Purchase Order Approvals</strong></td>
                <td><span class="badge badge-clean">Tier-2 Signoff</span></td>
                <td><span class="badge badge-dirty">No Access</span></td>
                <td><span class="badge badge-normal">Requisition Only</span></td>
                <td><span class="badge badge-normal">Requisition Only</span></td>
                <td><span class="badge badge-normal">Requisition Only</span></td>
                <td><span class="badge badge-clean">Create PO & GRV</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;
}

export function bindAnalyticsSettingsEvents() {}
