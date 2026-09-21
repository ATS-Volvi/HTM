// ==========================================================================
// VOLVITECH HOSPITALITY OS — INVENTORY & PROCUREMENT SCM HUB
// ==========================================================================

import { store } from '../state/store.js';

export function renderInventoryProcurementView(state) {
  const stockLedger = state.stockLedger;
  const requisitions = state.purchaseRequisitions;
  const purchaseOrders = state.purchaseOrders;
  const stores = state.stores;

  const lowStockCount = stockLedger.filter(s => s.status.includes('Low') || s.status.includes('Critical')).length;
  const pendingPRCount = requisitions.filter(pr => pr.status.includes('Pending')).length;

  return `
    <div class="workspace-main animate-fade-in">
      <!-- Header -->
      <div class="page-header-container">
        <div>
          <div style="font-size: 11px; font-weight: 700; color: #2563EB; text-transform: uppercase;">Supply Chain & Materials Management</div>
          <h1 class="page-title">Multi-Store Inventory & Automated Procurement</h1>
          <div class="page-subtitle">Par-level automated requisitions, 2-tier managerial signoff, and 3-way match Goods Receipt</div>
        </div>

        <div style="display: flex; gap: 10px;">
          <button class="btn-primary" id="btn-trigger-reorder-check">
            <span class="material-symbols-outlined" style="font-size: 16px;">autorenew</span>
            Run Par-Level Breach Audit
          </button>
        </div>
      </div>

      <!-- Quick Metrics Row -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
        <div class="kpi-stat-card">
          <div class="kpi-title">Multi-Store Locations</div>
          <div class="kpi-value">${stores.length} Depots</div>
          <div style="font-size: 11px; color: #64748B;">Central WH, Kitchen, HK, Eng</div>
        </div>
        <div class="kpi-stat-card">
          <div class="kpi-title">Par Level Breaches</div>
          <div class="kpi-value" style="color: ${lowStockCount > 0 ? '#EF4444' : '#10B981'};">${lowStockCount} Items</div>
          <div style="font-size: 11px; color: #EF4444; font-weight: 600;">Automated PR Generated</div>
        </div>
        <div class="kpi-stat-card">
          <div class="kpi-title">Pending PR Approvals</div>
          <div class="kpi-value" style="color: ${pendingPRCount > 0 ? '#F59E0B' : '#10B981'};">${pendingPRCount} Requests</div>
          <div style="font-size: 11px; color: #F59E0B; font-weight: 600;">Requires General Manager Sign-Off</div>
        </div>
        <div class="kpi-stat-card">
          <div class="kpi-title">Open Purchase Orders</div>
          <div class="kpi-value">${purchaseOrders.length} POs Active</div>
          <div style="font-size: 11px; color: #2563EB; font-weight: 600;">In Transit from Vendors</div>
        </div>
      </div>

      <!-- Section 1: Purchase Requisitions & Manager Approval Hub -->
      <div class="enterprise-table-wrapper" style="margin-bottom: 24px;">
        <div style="padding: 14px 16px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; font-weight: 700; font-size: 13px; color: #0F172A; display: flex; justify-content: space-between; align-items: center;">
          <span>Purchase Requisitions (PR) Workflow</span>
          <span class="badge badge-normal">${requisitions.length} Total</span>
        </div>

        <table class="enterprise-table">
          <thead>
            <tr>
              <th>PR Number</th>
              <th>Dept / Store</th>
              <th>Requested By</th>
              <th>Requisition Items</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${requisitions.map(pr => `
              <tr>
                <td style="font-family: var(--font-mono); font-weight: 700; color: #2563EB;">${pr.prNumber}</td>
                <td>
                  <div style="font-weight: 700; color: #0F172A;">${pr.department}</div>
                  <div style="font-size: 11px; color: #64748B;">Store: ${pr.storeCode}</div>
                  ${pr.destination ? `<div style="font-size: 10px; color: #0284c7; font-weight: 600; margin-top: 2px;">📍 ${pr.destination}</div>` : ''}
                </td>
                <td style="font-size: 12px; color: #334155;">${pr.requestedBy}</td>
                <td>
                  <div style="font-size: 12px; font-weight: 600; color: #0F172A;">
                    ${pr.items.map(i => `${i.name} (x${i.qty} ${i.unit})`).join(', ')}
                  </div>
                  <div style="font-size: 10px; color: #64748B; margin-top: 2px;">${pr.justification}</div>
                </td>
                <td style="font-family: var(--font-mono); font-weight: 700; color: #0F172A;">$${pr.totalAmount.toFixed(2)}</td>
                <td>
                  <span class="badge ${pr.status.includes('Pending') ? 'badge-urgent' : (pr.status.includes('Dispatched') ? 'badge-inspected' : 'badge-clean')}">
                    ${pr.status}
                  </span>
                </td>
                <td>
                  ${pr.status.includes('Pending') ? `
                    <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                      ${pr.department === 'Housekeeping' ? `
                        <button class="btn-success btn-dispatch-hk-pr" style="padding: 4px 8px; font-size: 11px;" data-pr-id="${pr.id}" title="Issue items from Central Warehouse directly to Floor Pantry">
                          <span class="material-symbols-outlined" style="font-size: 14px;">local_shipping</span>
                          Dispatch to HK
                        </button>
                      ` : ''}
                      <button class="btn-primary btn-approve-pr" style="padding: 4px 8px; font-size: 11px;" data-pr-id="${pr.id}">
                        <span class="material-symbols-outlined" style="font-size: 14px;">check_circle</span>
                        GM Approve & PO
                      </button>
                    </div>
                  ` : (pr.status.includes('Dispatched') ? `
                    <span class="badge badge-clean">Dispatched to HK</span>
                  ` : `
                    <span class="badge badge-clean">PO Generated</span>
                  `)}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Section 2: Purchase Orders & 3-Way Match Goods Receipt -->
      <div class="enterprise-table-wrapper" style="margin-bottom: 24px;">
        <div style="padding: 14px 16px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; font-weight: 700; font-size: 13px; color: #0F172A; display: flex; justify-content: space-between; align-items: center;">
          <span>Active Purchase Orders & 3-Way Match Ingestion</span>
          <span class="badge badge-inspected">${purchaseOrders.length} In-Flight</span>
        </div>

        <table class="enterprise-table">
          <thead>
            <tr>
              <th>PO Number</th>
              <th>PR Reference</th>
              <th>Vendor Partner</th>
              <th>Issued Date</th>
              <th>Expected Delivery</th>
              <th>PO Amount</th>
              <th>3-Way Match Verification</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${purchaseOrders.map(po => `
              <tr>
                <td style="font-family: var(--font-mono); font-weight: 700; color: #2563EB;">${po.poNumber}</td>
                <td style="font-family: var(--font-mono); font-size: 12px; color: #64748B;">${po.prRef}</td>
                <td>
                  <div style="font-weight: 700; color: #0F172A;">${po.vendorName}</div>
                  <div style="font-size: 11px; color: #64748B;">${po.vendorContact}</div>
                </td>
                <td style="font-size: 12px;">${po.issuedDate}</td>
                <td style="font-size: 12px; color: #475569;">${po.expectedDelivery}</td>
                <td style="font-family: var(--font-mono); font-weight: 700; color: #0F172A;">$${po.totalAmount.toFixed(2)}</td>
                <td>
                  <span class="badge ${po.status.includes('Completed') ? 'badge-clean' : 'badge-dnd'}">
                    ${po.matchStatus}
                  </span>
                </td>
                <td>
                  ${po.status !== 'Delivered & Completed' ? `
                    <button class="btn-success btn-receive-goods" style="padding: 4px 10px; font-size: 11px;" data-po-id="${po.id}">
                      <span class="material-symbols-outlined" style="font-size: 14px;">inventory</span>
                      Receive Goods & 3-Way Match
                    </button>
                  ` : `
                    <span class="badge badge-clean">Restocked in WH</span>
                  `}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Section 3: Multi-Store Stock Ledger -->
      <div class="enterprise-table-wrapper">
        <div style="padding: 14px 16px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; font-weight: 700; font-size: 13px; color: #0F172A; display: flex; justify-content: space-between; align-items: center;">
          <span>Multi-Store Stock Ledger (Safety Par Levels)</span>
          <span class="badge badge-normal">${stockLedger.length} SKUs Monitored</span>
        </div>

        <table class="enterprise-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Item Name</th>
              <th>Store Location</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Min / Max Par</th>
              <th>Unit Cost</th>
              <th>Health Status</th>
            </tr>
          </thead>
          <tbody>
            ${stockLedger.map(s => `
              <tr>
                <td style="font-family: var(--font-mono); font-weight: 600; color: #2563EB;">${s.sku}</td>
                <td style="font-weight: 700; color: #0F172A;">${s.name}</td>
                <td><span class="badge badge-normal">${s.store}</span></td>
                <td>${s.category}</td>
                <td>
                  <span style="font-weight: 800; font-size: 13px; color: ${s.status === 'Healthy' ? '#0F172A' : '#EF4444'};">
                    ${s.currentStock} ${s.unit}
                  </span>
                </td>
                <td style="font-size: 12px; color: #64748B;">${s.minPar} / ${s.maxPar} ${s.unit}</td>
                <td style="font-family: var(--font-mono); font-weight: 600;">$${s.costPerUnit.toFixed(2)}</td>
                <td>
                  <span class="badge ${s.status === 'Healthy' ? 'badge-clean' : 'badge-urgent'}">
                    ${s.status}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function bindInventoryProcurementEvents() {
  // GM Approve PR
  document.querySelectorAll('.btn-approve-pr').forEach(btn => {
    btn.addEventListener('click', () => {
      const prId = btn.dataset.prId;
      store.approvePurchaseRequisition(prId);
    });
  });

  // Direct Dispatch HK Requisition from Central Store
  document.querySelectorAll('.btn-dispatch-hk-pr').forEach(btn => {
    btn.addEventListener('click', () => {
      const prId = btn.dataset.prId;
      store.fulfillHousekeepingRequisition(prId);
    });
  });

  // Receive Goods & 3-Way Match
  document.querySelectorAll('.btn-receive-goods').forEach(btn => {
    btn.addEventListener('click', () => {
      const poId = btn.dataset.poId;
      store.receiveGoodsPO(poId);
    });
  });

  // Run Par-Level Audit Button
  const auditBtn = document.getElementById('btn-trigger-reorder-check');
  if (auditBtn) {
    auditBtn.addEventListener('click', () => {
      store.state.ingredients.forEach(ing => {
        if (ing.stock < ing.minPar) {
          store.checkAndTriggerParBreachPR(ing);
        }
      });
      store.showToast('Completed real-time par audit across all 4 store locations.', 'info');
      store.notify();
    });
  }
}
