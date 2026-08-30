import { store } from '../../state/store.js';
import { showToast } from '../../components/Toast.js';

export function renderInventoryView(state) {
  const inventory = state.inventory;
  const criticalItems = inventory.filter(i => i.status === 'Critical' || i.status === 'Low Stock');

  return `
    <div class="app-content animate-fade-in" style="padding-bottom: 40px;">
      <!-- Title -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div class="label-bold" style="color: var(--secondary);">LuxeStay Supply Chain</div>
          <h2 class="display-title" style="font-size: 24px;">Inventory Control</h2>
        </div>
        <button class="btn-primary" id="restock-all-btn" style="padding: 6px 12px; font-size: 11px;">
          + PO Reorder
        </button>
      </div>

      <!-- Critical Warnings Banner -->
      ${criticalItems.length > 0 ? `
        <div class="glass-card" style="padding: 14px 16px; border-left: 4px solid var(--error); background: #fff8f8;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="material-symbols-outlined" style="color: var(--error); font-size: 24px;">warning</span>
            <div>
              <div style="font-weight: 700; font-size: 13px; color: var(--error);">
                ${criticalItems.length} items below minimum safety threshold
              </div>
              <div class="body-sm" style="color: var(--on-surface-variant);">
                ${criticalItems.map(i => i.name.split(' ')[0]).join(', ')} require replenishment.
              </div>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Inventory Stock Items -->
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="label-bold">Par Stock Levels</div>
        ${inventory.map(item => {
          const isCritical = item.status === 'Critical' || item.status === 'Out of Stock';
          const isLow = item.status === 'Low Stock';
          const pct = Math.min(100, Math.round((item.stock / (item.minThreshold * 2.5)) * 100));

          return `
            <div class="glass-card" style="padding: 14px 16px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                <div>
                  <span class="label-bold" style="font-size: 9px; color: var(--secondary);">${item.category} • ${item.location}</span>
                  <h4 style="font-family: var(--font-serif); font-size: 14px; font-weight: 700; color: var(--primary); margin-top: 2px;">
                    ${item.name}
                  </h4>
                </div>
                <span class="badge ${isCritical ? 'badge-dirty' : isLow ? 'badge-dnd' : 'badge-clean'}" style="font-size: 9px;">
                  ${item.status}
                </span>
              </div>

              <!-- Progress bar -->
              <div style="margin: 8px 0 10px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                  <span>Current: <strong>${item.stock} ${item.unit}</strong></span>
                  <span style="color: var(--outline);">Par Min: ${item.minThreshold}</span>
                </div>
                <div style="width: 100%; height: 6px; background: var(--surface-container-high); border-radius: 3px; overflow: hidden;">
                  <div style="width: ${pct}%; height: 100%; background: ${isCritical ? 'var(--error)' : isLow ? 'var(--warning)' : '#2e7d32'}; transition: width 0.3s ease;"></div>
                </div>
              </div>

              <!-- Quick Stock Steppers -->
              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--surface-container-high); padding-top: 8px;">
                <span style="font-size: 11px; color: var(--outline);">Adjust on-hand count:</span>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <button class="btn-icon stock-step-btn" data-id="${item.id}" data-delta="-5" style="background: var(--surface-container); width: 28px; height: 28px; font-size: 11px; font-weight: 700;">
                    -5
                  </button>
                  <button class="btn-icon stock-step-btn" data-id="${item.id}" data-delta="-1" style="background: var(--surface-container); width: 28px; height: 28px;">
                    <span class="material-symbols-outlined" style="font-size: 14px;">remove</span>
                  </button>
                  <span style="font-weight: 700; font-size: 13px; min-width: 24px; text-align: center;">${item.stock}</span>
                  <button class="btn-icon stock-step-btn" data-id="${item.id}" data-delta="1" style="background: var(--surface-container); width: 28px; height: 28px;">
                    <span class="material-symbols-outlined" style="font-size: 14px;">add</span>
                  </button>
                  <button class="btn-icon stock-step-btn" data-id="${item.id}" data-delta="10" style="background: var(--primary); color: white; width: 28px; height: 28px; font-size: 11px; font-weight: 700;">
                    +10
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

export function bindInventoryEvents() {
  const stepBtns = document.querySelectorAll('.stock-step-btn');
  stepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const delta = parseInt(btn.dataset.delta, 10);
      store.updateInventoryStock(id, delta);
      const item = store.state.inventory.find(i => i.id === id);
      showToast('Stock Adjusted', `${item.name}: ${item.stock} ${item.unit}`, 'inventory_2');
    });
  });

  const reorderBtn = document.getElementById('restock-all-btn');
  if (reorderBtn) {
    reorderBtn.addEventListener('click', () => {
      showToast('Purchase Order Created', 'PO #8841 auto-generated for Diptyque soaps & luxury linens.', 'local_shipping');
    });
  }
}
