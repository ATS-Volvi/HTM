import { store } from '../../state/store.js';
import { showToast } from '../../components/Toast.js';

export function renderGuestHomeView(state) {
  const dndActive = state.dndActive;
  const activeRequests = state.requests.filter(r => r.status !== 'Completed');
  const activeOrders = state.orders.filter(o => o.status !== 'delivered');

  return `
    <div class="app-content animate-fade-in">
      <!-- Welcome Hero Section -->
      <section>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
          <div class="label-bold" style="color: var(--secondary); letter-spacing: 0.1em;">
            ROOM 402 • DELUXE OCEAN VIEW
          </div>
          <span class="badge badge-vip">PLATINUM VIP</span>
        </div>
        <h2 class="display-title" style="margin-bottom: 6px;">
          Good Morning,<br /><span class="gold-text">Mr. Harrison.</span>
        </h2>
        <p class="body-sm" style="color: var(--on-surface-variant);">
          We hope you are enjoying your stay at The Grand Astoria.
        </p>
      </section>

      <!-- Prominent Do Not Disturb Privacy Mode Toggle -->
      <section>
        <div class="glass-card" style="padding: 16px 20px; border-left: 4px solid ${dndActive ? 'var(--error)' : 'var(--on-tertiary-container)'};">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 44px; height: 44px; border-radius: 50%; background: ${dndActive ? 'var(--error-container)' : 'var(--surface-container-high)'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <span class="material-symbols-outlined" style="color: ${dndActive ? 'var(--error)' : 'var(--primary)'}; font-size: 24px;">
                  ${dndActive ? 'do_not_disturb_on' : 'privacy_tip'}
                </span>
              </div>
              <div>
                <h3 class="headline-sm" style="font-size: 16px; margin-bottom: 2px;">
                  ${dndActive ? 'Privacy Mode Active' : 'Privacy & Service Mode'}
                </h3>
                <p class="body-sm" style="color: ${dndActive ? 'var(--error)' : 'var(--on-surface-variant)'}; font-weight: 500;">
                  ${dndActive ? 'Do Not Disturb is ON. Staff will not knock.' : 'Currently open to housekeeping & deliveries.'}
                </p>
              </div>
            </div>
            <label class="dnd-switch">
              <input type="checkbox" id="home-dnd-toggle" ${dndActive ? 'checked' : ''} />
              <span class="dnd-slider"></span>
            </label>
          </div>
        </div>
      </section>

      <!-- Active Requests / Order Tracking Snippet -->
      ${activeOrders.length > 0 ? `
        <section>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div class="label-bold">Live Dining Order</div>
            <button class="btn-secondary" id="track-order-btn" style="padding: 4px 10px; font-size: 11px; text-transform: uppercase;">
              View Live Tracker
            </button>
          </div>
          <div class="glass-card-navy" style="padding: 16px 18px; border-radius: var(--radius-lg); position: relative; overflow: hidden;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span class="badge badge-gold" style="font-size: 10px;">${activeOrders[0].deliveryType}</span>
              <span style="font-size: 12px; font-weight: 600; color: #ffe088;">ETA: ~${activeOrders[0].etaMinutes} Mins</span>
            </div>
            <h4 style="font-family: var(--font-serif); font-size: 17px; margin-bottom: 4px;">
              ${activeOrders[0].items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
            </h4>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.15); pt-2; padding-top: 8px;">
              <span style="font-size: 12px; opacity: 0.8;">Butler: ${activeOrders[0].server.name}</span>
              <span style="font-weight: 700; color: var(--secondary-container);">$${activeOrders[0].total.toFixed(2)}</span>
            </div>
          </div>
        </section>
      ` : ''}

      <!-- Scheduled Housekeeping Card -->
      <section>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <div class="label-bold">Active Service Schedule</div>
          <span style="font-size: 11px; color: var(--on-surface-variant);">1 Upcoming</span>
        </div>
        <div class="glass-card" style="padding: 16px; border-left: 4px solid var(--primary);">
          <div style="display: flex; align-items: flex-start; gap: 12px;">
            <span class="material-symbols-outlined" style="color: var(--primary); margin-top: 2px;">cleaning_services</span>
            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h4 class="headline-sm" style="font-size: 15px;">Daily Suite Refresh</h4>
                <span class="badge badge-inspected" style="font-size: 10px;">Today • 11:00 AM</span>
              </div>
              <p class="body-sm" style="margin: 4px 0 10px 0; color: var(--on-surface-variant);">
                Full turn-down, organic linen refresh, and Acqua Di Parma restocking.
              </p>
              <div style="display: flex; gap: 8px;">
                <button class="btn-secondary" id="reschedule-service-btn" style="padding: 6px 12px; font-size: 11px;">
                  Reschedule
                </button>
                <button class="btn-secondary" id="report-issue-btn" style="padding: 6px 12px; font-size: 11px; color: var(--error);">
                  Report Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Actions Bento Grid -->
      <section>
        <div class="label-bold" style="margin-bottom: 12px;">At Your Service</div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
          <!-- In-Room Dining Tile -->
          <div class="glass-card bento-action-tile" data-target="dining" style="cursor: pointer; position: relative; height: 160px; overflow: hidden; border-radius: var(--radius-lg); grid-column: span 2; display: flex; flex-direction: column; justify-content: flex-end; padding: 16px; color: white;">
            <img 
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80" 
              alt="In-Room Dining" 
              style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; transition: transform 0.5s ease;"
              class="tile-bg-img"
            />
            <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(4,22,39,0.92) 0%, rgba(4,22,39,0.3) 60%, transparent 100%); z-index: 1;"></div>
            <div style="position: relative; z-index: 2;">
              <div style="display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); margin-bottom: 6px;">
                <span class="material-symbols-outlined" style="font-size: 18px;">restaurant</span>
              </div>
              <h4 style="font-family: var(--font-serif); font-size: 18px; font-weight: 700; margin-bottom: 2px;">In-Room Dining</h4>
              <p style="font-size: 12px; opacity: 0.9;">Gourmet Breakfast, A5 Wagyu & Fine Cellar Wines →</p>
            </div>
          </div>

          <!-- Housekeeping Tile -->
          <div class="glass-card bento-action-tile" data-target="schedule-service" style="cursor: pointer; position: relative; height: 140px; overflow: hidden; border-radius: var(--radius-lg); display: flex; flex-direction: column; justify-content: flex-end; padding: 14px; color: white;">
            <img 
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80" 
              alt="Housekeeping" 
              style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;"
              class="tile-bg-img"
            />
            <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(4,22,39,0.92) 0%, rgba(4,22,39,0.3) 60%, transparent 100%); z-index: 1;"></div>
            <div style="position: relative; z-index: 2;">
              <span class="material-symbols-outlined" style="font-size: 20px; margin-bottom: 4px;">cleaning_services</span>
              <h4 style="font-family: var(--font-serif); font-size: 15px; font-weight: 600;">Housekeeping</h4>
              <p style="font-size: 11px; opacity: 0.85;">Towels & Turndown</p>
            </div>
          </div>

          <!-- Laundry & Valet Tile -->
          <div class="glass-card bento-action-tile" data-target="schedule-service" style="cursor: pointer; position: relative; height: 140px; overflow: hidden; border-radius: var(--radius-lg); display: flex; flex-direction: column; justify-content: flex-end; padding: 14px; color: white;">
            <img 
              src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=500&q=80" 
              alt="Laundry" 
              style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;"
              class="tile-bg-img"
            />
            <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(4,22,39,0.92) 0%, rgba(4,22,39,0.3) 60%, transparent 100%); z-index: 1;"></div>
            <div style="position: relative; z-index: 2;">
              <span class="material-symbols-outlined" style="font-size: 20px; margin-bottom: 4px;">local_laundry_service</span>
              <h4 style="font-family: var(--font-serif); font-size: 15px; font-weight: 600;">Valet & Laundry</h4>
              <p style="font-size: 11px; opacity: 0.85;">Suit Pressing</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Instant Hotel Concierge Assistance -->
      <section style="margin-bottom: 12px;">
        <div class="glass-card" style="padding: 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: linear-gradient(135deg, #ffffff 0%, #fef8e7 100%); border: 1px solid var(--secondary-fixed);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--secondary-container); display: flex; align-items: center; justify-content: center; color: var(--on-secondary-container);">
              <span class="material-symbols-outlined">concierge</span>
            </div>
            <div>
              <div style="font-weight: 700; font-size: 13px; color: var(--primary);">24/7 Dedicated Butler</div>
              <div class="body-sm">Press to call Front Desk or request car</div>
            </div>
          </div>
          <button class="btn-primary" id="call-butler-btn" style="padding: 8px 14px; font-size: 11px;">
            <span class="material-symbols-outlined" style="font-size: 16px;">call</span> Call
          </button>
        </div>
      </section>
    </div>
  `;
}

export function bindGuestHomeEvents() {
  const dndToggle = document.getElementById('home-dnd-toggle');
  if (dndToggle) {
    dndToggle.addEventListener('change', () => {
      store.toggleDND();
      const isActive = store.state.dndActive;
      showToast(
        isActive ? 'Do Not Disturb Enabled' : 'Privacy Mode Disabled',
        isActive ? 'Staff supervisor and door sensors notified.' : 'Housekeeping and delivery access resumed.',
        isActive ? 'do_not_disturb_on' : 'notifications_active'
      );
    });
  }

  const trackBtn = document.getElementById('track-order-btn');
  if (trackBtn) {
    trackBtn.addEventListener('click', () => store.setView('order-tracking'));
  }

  const rescheduleBtn = document.getElementById('reschedule-service-btn');
  if (rescheduleBtn) {
    rescheduleBtn.addEventListener('click', () => store.setView('schedule-service'));
  }

  const reportBtn = document.getElementById('report-issue-btn');
  if (reportBtn) {
    reportBtn.addEventListener('click', () => store.setView('report-issue'));
  }

  const bentoTiles = document.querySelectorAll('.bento-action-tile');
  bentoTiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const target = tile.dataset.target;
      if (target) store.setView(target);
    });
  });

  const callButlerBtn = document.getElementById('call-butler-btn');
  if (callButlerBtn) {
    callButlerBtn.addEventListener('click', () => {
      showToast('Connecting to Butler', 'Connecting Room 402 to Head Butler Pierre Dubois...', 'ring_volume');
    });
  }
}
