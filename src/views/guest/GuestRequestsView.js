import { store } from '../../state/store.js';

export function renderGuestRequestsView(state) {
  const requests = state.requests;
  const orders = state.orders;

  return `
    <div class="app-content animate-fade-in" style="padding-bottom: 40px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div class="label-bold" style="color: var(--secondary);">Room 402 Activity</div>
          <h2 class="display-title" style="font-size: 26px;">Active Requests</h2>
        </div>
        <button class="btn-secondary" id="new-req-btn" style="padding: 6px 12px; font-size: 11px;">
          + New Service
        </button>
      </div>

      <!-- In-Room Dining Orders Section -->
      ${orders.length > 0 ? `
        <section style="display: flex; flex-direction: column; gap: 10px;">
          <div class="label-bold">In-Room Dining Orders</div>
          ${orders.map(order => `
            <div class="glass-card" style="padding: 14px 16px; border-left: 4px solid var(--gold-accent);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span class="badge ${order.status === 'delivered' ? 'badge-clean' : 'badge-gold'}" style="font-size: 10px; text-transform: uppercase;">
                  ${order.status}
                </span>
                <span style="font-size: 11px; color: var(--on-surface-variant);">
                  ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div style="font-weight: 700; font-size: 15px; color: var(--primary);">
                ${order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; border-top: 1px solid var(--surface-container-high); padding-top: 8px;">
                <span style="font-size: 12px; color: var(--on-surface-variant);">Total: <strong>$${order.total.toFixed(2)}</strong></span>
                <button class="btn-secondary view-order-track-btn" data-id="${order.id}" style="padding: 4px 10px; font-size: 11px;">
                  Track Order →
                </button>
              </div>
            </div>
          `).join('')}
        </section>
      ` : ''}

      <!-- General Service Requests Section -->
      <section style="display: flex; flex-direction: column; gap: 10px;">
        <div class="label-bold">Concierge & Maintenance Tickets</div>
        ${requests.length === 0 ? `
          <div class="glass-card" style="padding: 24px; text-align: center; color: var(--on-surface-variant);">
            No active service requests right now.
          </div>
        ` : requests.map(req => `
          <div class="glass-card" style="padding: 14px 16px; border-left: 4px solid ${req.category === 'Maintenance' ? 'var(--error)' : 'var(--primary)'};">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span class="badge ${req.status === 'Scheduled' ? 'badge-inspected' : 'badge-progress'}" style="font-size: 10px;">
                ${req.status}
              </span>
              <span style="font-size: 11px; color: var(--on-surface-variant);">${req.time}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;">
              <span class="material-symbols-outlined" style="font-size: 18px; color: var(--primary);">${req.icon || 'room_service'}</span>
              <h4 style="font-family: var(--font-serif); font-size: 15px; font-weight: 700; color: var(--primary);">${req.title}</h4>
            </div>
            ${req.notes ? `
              <p class="body-sm" style="color: var(--on-surface-variant); margin-top: 4px;">
                ${req.notes}
              </p>
            ` : ''}
          </div>
        `).join('')}
      </section>
    </div>
  `;
}

export function bindGuestRequestsEvents() {
  const newReqBtn = document.getElementById('new-req-btn');
  if (newReqBtn) newReqBtn.addEventListener('click', () => store.setView('schedule-service'));

  const trackBtns = document.querySelectorAll('.view-order-track-btn');
  trackBtns.forEach(btn => {
    btn.addEventListener('click', () => store.setView('order-tracking'));
  });
}
