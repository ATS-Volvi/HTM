import { store } from '../../state/store.js';
import { showToast } from '../../components/Toast.js';
import confetti from 'canvas-confetti';

export function renderCheckoutView(state) {
  const cart = state.cart;
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const serviceCharge = cartSubtotal * 0.18; // 18% hospitality service fee
  const selectedTip = state.selectedTip !== undefined ? state.selectedTip : 10;
  const total = cartSubtotal + serviceCharge + selectedTip;

  if (cart.length === 0) {
    return `
      <div class="app-content animate-fade-in" style="text-align: center; padding: 40px 20px;">
        <div style="width: 70px; height: 70px; border-radius: 50%; background: var(--surface-container); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto;">
          <span class="material-symbols-outlined" style="font-size: 32px; color: var(--outline);">shopping_bag</span>
        </div>
        <h3 class="headline-md" style="font-size: 20px; margin-bottom: 8px;">Your Cart is Empty</h3>
        <p class="body-sm" style="color: var(--on-surface-variant); margin-bottom: 24px;">
          Select culinary delights from our 24/7 in-room dining menu.
        </p>
        <button class="btn-primary" id="return-menu-btn">Browse Gastronomy Menu</button>
      </div>
    `;
  }

  return `
    <div class="app-content animate-fade-in" style="padding-bottom: 40px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
        <button class="btn-secondary" id="back-to-menu-btn" style="padding: 4px 10px; font-size: 11px;">
          ← Add More Items
        </button>
        <div class="label-bold" style="color: var(--secondary);">Order Checkout</div>
      </div>
      
      <h2 class="display-title" style="font-size: 24px; margin-bottom: 12px;">Confirm In-Room Order</h2>

      <!-- Delivery Location & Destination -->
      <div class="glass-card" style="padding: 16px; border-left: 4px solid var(--gold-accent);">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div class="label-bold" style="font-size: 10px;">Delivery Suite</div>
            <div style="font-weight: 700; font-size: 15px; color: var(--primary);">Room 402 • Deluxe Ocean View</div>
            <div class="body-sm" style="color: var(--on-surface-variant);">Guest: Mr. James Harrison (Platinum VIP)</div>
          </div>
          <span class="badge badge-vip">Direct Room Billing</span>
        </div>
      </div>

      <!-- Itemized Order Details -->
      <div class="glass-card" style="padding: 16px;">
        <div class="label-bold" style="margin-bottom: 12px;">Selected Items (${cart.reduce((s, i) => s + i.quantity, 0)})</div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${cart.map(item => `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 12px; border-bottom: 1px solid var(--surface-container-high);">
              <div style="flex: 1; padding-right: 12px;">
                <div style="font-weight: 600; font-size: 14px; color: var(--primary);">${item.name}</div>
                ${item.specialInstructions ? `
                  <div style="font-size: 11px; color: var(--secondary); font-style: italic; margin-top: 2px;">
                    Note: ${item.specialInstructions}
                  </div>
                ` : ''}
                <div style="font-size: 12px; color: var(--on-surface-variant); margin-top: 2px;">
                  $${item.price.toFixed(2)} each
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <button class="btn-icon checkout-qty-btn" data-id="${item.id}" data-delta="-1" style="background: var(--surface-container); width: 28px; height: 28px;">
                  <span class="material-symbols-outlined" style="font-size: 14px;">remove</span>
                </button>
                <span style="font-weight: 700; font-size: 13px; min-width: 14px; text-align: center;">${item.quantity}</span>
                <button class="btn-icon checkout-qty-btn" data-id="${item.id}" data-delta="1" style="background: var(--primary); color: white; width: 28px; height: 28px;">
                  <span class="material-symbols-outlined" style="font-size: 14px;">add</span>
                </button>
                <span style="font-weight: 700; font-size: 14px; min-width: 54px; text-align: right;">
                  $${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Special Delivery Notes -->
        <div class="input-group" style="margin-top: 14px;">
          <label class="input-label">Butler Delivery Instructions</label>
          <input type="text" id="order-butler-notes" class="input-field" placeholder="e.g. Please ring doorbell twice, set on balcony table..." />
        </div>
      </div>

      <!-- Gratuity & Bill Breakdown -->
      <div class="glass-card" style="padding: 16px;">
        <div class="label-bold" style="margin-bottom: 10px;">Butler Gratuity</div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 16px;">
          ${[5, 10, 15, 20].map(tipVal => `
            <button class="btn-secondary tip-btn ${selectedTip === tipVal ? 'active' : ''}" data-tip="${tipVal}" style="padding: 8px 4px; font-size: 12px; font-weight: 700; ${selectedTip === tipVal ? 'background: var(--primary); color: white; border-color: var(--primary);' : ''}">
              $${tipVal}
            </button>
          `).join('')}
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: var(--on-surface-variant);">
          <div style="display: flex; justify-content: space-between;">
            <span>Subtotal</span>
            <span style="font-weight: 600; color: var(--on-surface);">$${cartSubtotal.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Hospitality Service Charge (18%)</span>
            <span style="font-weight: 600; color: var(--on-surface);">$${serviceCharge.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Staff Gratuity</span>
            <span style="font-weight: 600; color: var(--on-surface);">$${selectedTip.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-top: 1.5px dashed var(--outline-variant); padding-top: 10px; font-size: 17px; font-weight: 800; color: var(--primary);">
            <span>Total Room Charge</span>
            <span style="color: var(--primary);">$${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <!-- Payment & Submit Button -->
      <button class="btn-gold" id="place-order-btn" style="padding: 16px; font-size: 14px; width: 100%; border-radius: var(--radius-md);">
        <span class="material-symbols-outlined">receipt</span> Confirm & Charge to Suite ($${total.toFixed(2)})
      </button>
    </div>
  `;
}

export function bindCheckoutEvents() {
  const backBtn = document.getElementById('back-to-menu-btn');
  if (backBtn) backBtn.addEventListener('click', () => store.setView('dining'));

  const returnBtn = document.getElementById('return-menu-btn');
  if (returnBtn) returnBtn.addEventListener('click', () => store.setView('dining'));

  const qtyBtns = document.querySelectorAll('.checkout-qty-btn');
  qtyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const delta = parseInt(btn.dataset.delta, 10);
      store.updateCartQuantity(id, delta);
    });
  });

  let currentTip = 10;
  const tipBtns = document.querySelectorAll('.tip-btn');
  tipBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentTip = parseInt(btn.dataset.tip, 10);
      store.state.selectedTip = currentTip;
      store.notify();
    });
  });

  const placeOrderBtn = document.getElementById('place-order-btn');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
      const notes = document.getElementById('order-butler-notes')?.value || '';
      const cartSubtotal = store.state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const serviceCharge = cartSubtotal * 0.18;
      const total = cartSubtotal + serviceCharge + currentTip;

      const newOrder = store.createOrder({
        subtotal: cartSubtotal,
        serviceCharge,
        tip: currentTip,
        total,
        deliveryType: 'Room Delivery (ASAP)',
        notes
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      showToast('Order Confirmed!', `Order #${newOrder.id} dispatched to Executive Kitchen.`, 'restaurant');
    });
  }
}
