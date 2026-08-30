import { store } from '../../state/store.js';
import { showToast } from '../../components/Toast.js';

export function renderOrderTrackingView(state) {
  const latestOrder = state.orders[0];

  if (!latestOrder) {
    return `
      <div class="app-content animate-fade-in" style="text-align: center; padding: 40px 20px;">
        <h3 class="headline-md">No Active Orders</h3>
        <p class="body-sm" style="margin: 8px 0 20px 0; color: var(--on-surface-variant);">You do not have any in-room dining orders right now.</p>
        <button class="btn-primary" id="track-to-menu-btn">Order Dining</button>
      </div>
    `;
  }

  const statusMap = {
    received: { step: 1, label: 'Order Received', desc: 'Order confirmed and sent to Executive Chef' },
    preparing: { step: 2, label: 'Kitchen Preparing', desc: 'Culinary team is crafting your dishes' },
    delivering: { step: 3, label: 'Butler On The Way', desc: 'Dedicated butler is en route to Suite 402' },
    delivered: { step: 4, label: 'Delivered & Served', desc: 'Bon Appétit! Enjoy your dining experience' }
  };

  const currentStep = statusMap[latestOrder.status]?.step || 1;

  return `
    <div class="app-content animate-fade-in" style="padding-bottom: 40px;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <button class="btn-secondary" id="tracking-back-btn" style="padding: 4px 10px; font-size: 11px;">
          ← Back to Home
        </button>
        <span class="badge badge-vip">Live Butler Tracker</span>
      </div>

      <div style="text-align: center; margin: 10px 0 6px 0;">
        <div class="label-bold" style="color: var(--secondary); margin-bottom: 4px;">Suite 402 In-Room Delivery</div>
        <h2 class="display-title" style="font-size: 26px;">Order #${latestOrder.id}</h2>
        <div style="font-size: 13px; color: var(--on-surface-variant); margin-top: 2px;">
          ${latestOrder.status === 'delivered' ? '✨ Completed & Served' : `Estimated Delivery: ~${latestOrder.etaMinutes} minutes`}
        </div>
      </div>

      <!-- Real-Time Status Progress Tracker -->
      <div class="glass-card" style="padding: 20px 16px;">
        <div style="display: flex; flex-direction: column; gap: 20px; position: relative;">
          <!-- Step 1: Received -->
          <div style="display: flex; gap: 14px; align-items: flex-start;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: ${currentStep >= 1 ? 'var(--primary)' : 'var(--surface-container-high)'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; z-index: 2;">
              ${currentStep > 1 ? '✓' : '1'}
            </div>
            <div>
              <div style="font-weight: 700; font-size: 14px; color: var(--primary);">Order Received</div>
              <div class="body-sm" style="color: var(--on-surface-variant);">Sent to Kitchen at ${new Date(latestOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>

          <!-- Step 2: Preparing -->
          <div style="display: flex; gap: 14px; align-items: flex-start;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: ${currentStep >= 2 ? 'var(--primary)' : 'var(--surface-container-high)'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; z-index: 2;">
              ${currentStep > 2 ? '✓' : '2'}
            </div>
            <div>
              <div style="font-weight: 700; font-size: 14px; color: var(--primary);">Chef Preparation</div>
              <div class="body-sm" style="color: var(--on-surface-variant);">Artisan prep with warm cloche covers</div>
            </div>
          </div>

          <!-- Step 3: Delivering -->
          <div style="display: flex; gap: 14px; align-items: flex-start;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: ${currentStep >= 3 ? 'var(--primary)' : 'var(--surface-container-high)'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; z-index: 2;">
              ${currentStep > 3 ? '✓' : '3'}
            </div>
            <div>
              <div style="font-weight: 700; font-size: 14px; color: var(--primary);">Butler En Route</div>
              <div class="body-sm" style="color: var(--on-surface-variant);">Elevator transit to Floor 4</div>
            </div>
          </div>

          <!-- Step 4: Delivered -->
          <div style="display: flex; gap: 14px; align-items: flex-start;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: ${currentStep >= 4 ? 'var(--success)' : 'var(--surface-container-high)'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; z-index: 2;">
              ${currentStep >= 4 ? '✓' : '4'}
            </div>
            <div>
              <div style="font-weight: 700; font-size: 14px; color: ${currentStep >= 4 ? 'var(--success)' : 'var(--on-surface-variant)'};">Delivered & Served</div>
              <div class="body-sm" style="color: var(--on-surface-variant);">In-suite table service complete</div>
            </div>
          </div>
        </div>

        <!-- Simulation Advance Button -->
        ${latestOrder.status !== 'delivered' ? `
          <div style="margin-top: 20px; pt-3; border-top: 1px dashed var(--outline-variant); padding-top: 12px; text-align: center;">
            <button class="btn-secondary" id="advance-order-status-btn" style="width: 100%; font-size: 12px; padding: 10px;">
              <span class="material-symbols-outlined" style="font-size: 16px;">fast_forward</span> Simulate Next Step (Kitchen / Delivery)
            </button>
          </div>
        ` : ''}
      </div>

      <!-- Dedicated Butler Contact Card -->
      <div class="glass-card" style="padding: 16px;">
        <div class="label-bold" style="margin-bottom: 10px;">Assigned Butler</div>
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 44px; height: 44px; border-radius: 50%; overflow: hidden; border: 1.5px solid var(--secondary); flex-shrink: 0;">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" alt="Pierre Dubois" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div>
              <div style="font-weight: 700; font-size: 14px; color: var(--primary);">${latestOrder.server.name}</div>
              <div class="body-sm" style="color: var(--on-surface-variant);">${latestOrder.server.role}</div>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-icon" id="call-server-btn" style="background: var(--surface-container-high);" title="Call Butler">
              <span class="material-symbols-outlined" style="color: var(--primary); font-size: 20px;">call</span>
            </button>
            <button class="btn-icon" id="chat-server-btn" style="background: var(--surface-container-high);" title="Message Concierge">
              <span class="material-symbols-outlined" style="color: var(--primary); font-size: 20px;">chat</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Ordered Items Summary -->
      <div class="glass-card" style="padding: 16px;">
        <div class="label-bold" style="margin-bottom: 10px;">Order Summary</div>
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px;">
          ${latestOrder.items.map(item => `
            <div style="display: flex; justify-content: space-between;">
              <span>${item.quantity}x ${item.name}</span>
              <span style="font-weight: 600;">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
          <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--surface-container-high); padding-top: 8px; font-weight: 700; font-size: 14px; color: var(--primary);">
            <span>Total Charged</span>
            <span>$${latestOrder.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function bindOrderTrackingEvents() {
  const backBtn = document.getElementById('tracking-back-btn');
  if (backBtn) backBtn.addEventListener('click', () => store.setView('guest-home'));

  const toMenuBtn = document.getElementById('track-to-menu-btn');
  if (toMenuBtn) toMenuBtn.addEventListener('click', () => store.setView('dining'));

  const advanceBtn = document.getElementById('advance-order-status-btn');
  if (advanceBtn) {
    advanceBtn.addEventListener('click', () => {
      const order = store.state.orders[0];
      if (order) {
        store.advanceOrderStatus(order.id);
        showToast('Order Status Updated', `Order #${order.id} is now ${order.status.toUpperCase()}`, 'check_circle');
      }
    });
  }

  const callBtn = document.getElementById('call-server-btn');
  if (callBtn) {
    callBtn.addEventListener('click', () => {
      showToast('Calling Butler', 'Calling Pierre Dubois via hotel internal line...', 'ring_volume');
    });
  }

  const chatBtn = document.getElementById('chat-server-btn');
  if (chatBtn) {
    chatBtn.addEventListener('click', () => {
      showToast('Concierge Message', 'Direct message sent to Pierre Dubois: "Please deliver directly to balcony"', 'chat');
    });
  }
}
