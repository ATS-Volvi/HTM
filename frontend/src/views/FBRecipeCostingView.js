// ==========================================================================
// VOLVITECH HOSPITALITY OS — F&B & RECIPE COSTING ENGINE
// ==========================================================================

import { store } from '../state/store.js';

export function renderFBRecipeCostingView(state) {
  const recipes = state.recipes;
  const ingredients = state.ingredients;

  return `
    <div class="workspace-main animate-fade-in">
      <!-- Header -->
      <div class="page-header-container">
        <div>
          <div style="font-size: 11px; font-weight: 700; color: #A855F7; text-transform: uppercase;">Kitchen Operations & Food Costing</div>
          <h1 class="page-title">F&B Recipe Management & Bill of Materials (BOM)</h1>
          <div class="page-subtitle">Standardized recipe yields, sub-recipe costing, and Menu Engineering Matrix analytics</div>
        </div>

        <div style="display: flex; gap: 10px;">
          <button class="btn-secondary" id="btn-simulate-kds-order">
            <span class="material-symbols-outlined" style="font-size: 16px; color: #10B981;">fastfood</span>
            Dispatch Wagyu Order to Folio 402
          </button>
          <button class="btn-primary" id="btn-open-create-recipe">
            <span class="material-symbols-outlined" style="font-size: 16px;">add</span>
            Create Standard Recipe
          </button>
        </div>
      </div>

      <!-- Key F&B Metrics -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px;">
        <div class="kpi-stat-card">
          <div class="kpi-title">Aggregate Food Cost %</div>
          <div class="kpi-value" style="color: #10B981;">28.4%</div>
          <div style="font-size: 11px; color: #10B981; font-weight: 600;">Optimal (Target: <30.0%)</div>
        </div>
        <div class="kpi-stat-card">
          <div class="kpi-title">Active Standard Recipes</div>
          <div class="kpi-value">${recipes.length} Master Recipes</div>
          <div style="font-size: 11px; color: #64748B;">100% BOM Costed</div>
        </div>
        <div class="kpi-stat-card">
          <div class="kpi-title">Menu Stars (High Profit)</div>
          <div class="kpi-value" style="color: #2563EB;">8 Items</div>
          <div style="font-size: 11px; color: #2563EB; font-weight: 600;">Wagyu Burger, Caviar Tart</div>
        </div>
        <div class="kpi-stat-card">
          <div class="kpi-title">Raw Ingredients in Store</div>
          <div class="kpi-value">${ingredients.length} Tracked</div>
          <div style="font-size: 11px; color: #EF4444; font-weight: 600;">1 Critical Par Breach</div>
        </div>
      </div>

      <!-- Section 1: Standardized Recipe Catalog & BOM Costing Table -->
      <div class="enterprise-table-wrapper" style="margin-bottom: 24px;">
        <div style="padding: 14px 16px; background: #F8FAFC; border-bottom: 1px solid #E2E8F0; font-weight: 700; font-size: 13px; color: #0F172A; display: flex; justify-content: space-between; align-items: center;">
          <span>Standardized Recipe Catalog & Dynamic Food Cost Analysis</span>
          <span class="badge badge-normal">${recipes.length} Verified BOMs</span>
        </div>

        <table class="enterprise-table">
          <thead>
            <tr>
              <th>Dish Name</th>
              <th>Category</th>
              <th>Portion & Yield</th>
              <th>BOM Standard Cost</th>
              <th>Selling Price</th>
              <th>Food Cost %</th>
              <th>Menu Matrix</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${recipes.map(r => `
              <tr>
                <td>
                  <div style="font-weight: 700; color: #0F172A; font-size: 14px;">${r.name}</div>
                  <div style="font-size: 11px; color: #64748B;">Prep Time: ${r.prepTimeMin} mins</div>
                </td>
                <td><span class="badge badge-normal">${r.menuCategoryId}</span></td>
                <td style="font-size: 12px; color: #475569;">${r.portionSize} (${r.yieldPct}% yield)</td>
                <td style="font-family: var(--font-mono); font-weight: 700; color: #0F172A;">$${r.standardCost.toFixed(2)}</td>
                <td style="font-family: var(--font-mono); font-weight: 700; color: #2563EB;">$${r.sellingPrice.toFixed(2)}</td>
                <td>
                  <span class="badge ${r.foodCostPct < 32 ? 'badge-clean' : r.foodCostPct < 45 ? 'badge-dnd' : 'badge-dirty'}" style="font-weight: 700;">
                    ${r.foodCostPct}%
                  </span>
                </td>
                <td>
                  <span class="badge ${r.matrixCategory === 'Star' ? 'badge-vip' : 'badge-normal'}">
                    ★ ${r.matrixCategory}
                  </span>
                </td>
                <td>
                  <button class="btn-secondary btn-order-recipe" style="padding: 4px 10px; font-size: 11px;" data-recipe-id="${r.id}">
                    <span class="material-symbols-outlined" style="font-size: 14px; color: #10B981;">room_service</span>
                    Order to Folio
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Section 2: Bill of Materials (BOM) Breakdown & Live Kitchen Store Stock -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        <!-- Left: BOM Ingredients Explorer -->
        <div class="enterprise-card" style="padding: 20px;">
          <div style="font-weight: 700; font-size: 15px; color: #0F172A; margin-bottom: 12px;">Bill of Materials (BOM) — Live Raw Ingredients</div>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${ingredients.map(ing => `
              <div style="display: flex; justify-content: space-between; align-items: center; background: #F8FAFC; border: 1px solid #E2E8F0; padding: 10px 14px; border-radius: 8px;">
                <div>
                  <div style="font-weight: 700; font-size: 13px; color: #0F172A;">${ing.name}</div>
                  <div style="font-size: 11px; color: #64748B;">SKU: ${ing.sku} • Cost: $${ing.costPerUnit.toFixed(2)} / ${ing.unit}</div>
                </div>
                <div style="text-align: right;">
                  <div style="font-weight: 800; font-size: 14px; color: ${ing.stock < ing.minPar ? '#EF4444' : '#0F172A'};">
                    ${ing.stock} ${ing.unit}
                  </div>
                  <span class="badge ${ing.stock < ing.minPar ? 'badge-urgent' : 'badge-clean'}" style="font-size: 9px;">
                    ${ing.stock < ing.minPar ? 'Par Breached' : 'Par OK'}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right: Menu Engineering Quadrant Guide -->
        <div class="enterprise-card" style="padding: 20px;">
          <div style="font-weight: 700; font-size: 15px; color: #0F172A; margin-bottom: 12px;">Menu Engineering Matrix</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 8px; padding: 12px;">
              <div style="font-weight: 700; font-size: 13px; color: #1E40AF;">★ STARS (Maintain)</div>
              <div style="font-size: 11px; color: #3B82F6; margin-top: 4px;">High Profitability & High Popularity. Promote vigorously and preserve recipe consistency.</div>
            </div>
            <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 12px;">
              <div style="font-weight: 700; font-size: 13px; color: #B45309;">🐎 PLOWHORSES (Optimize)</div>
              <div style="font-size: 11px; color: #D97706; margin-top: 4px;">High Popularity but Moderate Margin. Slightly re-engineer portion sizing to reduce food cost.</div>
            </div>
            <div style="background: #F5F3FF; border: 1px solid #DDD6FE; border-radius: 8px; padding: 12px;">
              <div style="font-weight: 700; font-size: 13px; color: #6D28D9;">🧩 PUZZLES (Promote)</div>
              <div style="font-size: 11px; color: #8B5CF6; margin-top: 4px;">High Margin but Low Volume. Retrain waitstaff to recommend and feature in promotions.</div>
            </div>
            <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; padding: 12px;">
              <div style="font-weight: 700; font-size: 13px; color: #991B1B;">🐕 DOGS (Review/Drop)</div>
              <div style="font-size: 11px; color: #EF4444; margin-top: 4px;">Low Margin & Low Popularity. Eliminate from seasonal menu or replace completely.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindFBRecipeCostingEvents() {
  const createBtn = document.getElementById('btn-open-create-recipe');
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      store.setModal({ type: 'create_recipe', data: {} });
    });
  }

  const simulateOrderBtn = document.getElementById('btn-simulate-kds-order');
  if (simulateOrderBtn) {
    simulateOrderBtn.addEventListener('click', () => {
      store.orderMenuItem('402', 'rec-1', 1);
    });
  }

  document.querySelectorAll('.btn-order-recipe').forEach(btn => {
    btn.addEventListener('click', () => {
      const recId = btn.dataset.recipeId;
      store.orderMenuItem('402', recId, 1);
    });
  });
}
