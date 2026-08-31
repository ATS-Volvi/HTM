import { store } from '../../state/store.js';
import { showToast } from '../../components/Toast.js';

export function renderGuestHomeView(state) {
  const dndActive = state.dndActive;
  const activeOrders = state.orders.filter(o => o.status !== 'Delivered');
  const activeRequests = state.requests.filter(r => r.status !== 'Completed');

  const hasActive = activeOrders.length > 0 || activeRequests.length > 0;

  return `
    <div class="app-content animate-fade-in" style="padding-bottom: 24px;">

      <!-- Welcome Hero -->
      <section style="margin-bottom: 24px;">
        <p class="label-bold" style="color:var(--secondary);letter-spacing:.1em;margin-bottom:4px;">ROOM 402</p>
        <h2 style="font-family:var(--font-serif);font-size:28px;font-weight:700;color:var(--primary);line-height:1.2;margin-bottom:0;">
          Good Morning,<br>Mr. Harrison.
        </h2>
      </section>

      <!-- Privacy Mode Card -->
      <section style="margin-bottom:20px;">
        <div class="glass-card" style="padding:20px;border-radius:16px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
          <div style="display:flex;align-items:center;gap:16px;">
            <div style="width:56px;height:56px;border-radius:50%;background:${dndActive ? 'var(--error-container)' : 'var(--surface-container-high)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <span class="material-symbols-outlined" style="font-size:28px;color:${dndActive ? 'var(--error)' : 'var(--primary)'};">
                ${dndActive ? 'do_not_disturb_on' : 'privacy_tip'}
              </span>
            </div>
            <div>
              <h3 style="font-family:var(--font-serif);font-size:18px;font-weight:700;color:var(--primary);margin-bottom:2px;">Privacy Mode</h3>
              <p class="body-sm" style="color:${dndActive ? 'var(--error)' : 'var(--on-surface-variant)'};">
                ${dndActive ? 'Do Not Disturb is active.' : 'Currently open to services.'}
              </p>
            </div>
          </div>
          <label class="dnd-switch">
            <input type="checkbox" id="home-dnd-toggle" ${dndActive ? 'checked' : ''} />
            <span class="dnd-slider"></span>
          </label>
        </div>
      </section>

      <!-- Active Requests Banner -->
      ${hasActive ? `
      <section style="margin-bottom:20px;">
        <p class="label-bold" style="margin-bottom:10px;color:var(--on-surface-variant);letter-spacing:.08em;">ACTIVE REQUESTS</p>
        ${activeOrders.length > 0 ? `
        <div class="glass-card" style="padding:16px 18px;border-left:4px solid var(--secondary);border-radius:12px;margin-bottom:10px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <span class="material-symbols-outlined" style="color:var(--secondary);font-size:22px;">room_service</span>
            <div style="flex:1;min-width:0;">
              <h4 style="font-family:var(--font-serif);font-size:16px;font-weight:700;color:var(--primary);margin-bottom:2px;">
                Dining Order En Route
              </h4>
              <p class="body-sm" style="color:var(--on-surface-variant);">
                ${activeOrders[0].items.map(i => `${i.quantity}× ${i.name}`).join(', ')} · ETA ~${activeOrders[0].etaMinutes} min
              </p>
            </div>
            <button class="btn-secondary" id="track-order-btn" style="padding:5px 12px;font-size:11px;white-space:nowrap;">Track →</button>
          </div>
        </div>` : ''}
        ${activeRequests.length > 0 ? `
        <div class="glass-card" style="padding:16px 18px;border-left:4px solid var(--primary);border-radius:12px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <span class="material-symbols-outlined" style="color:var(--primary);font-size:22px;">cleaning_services</span>
            <div>
              <h4 style="font-family:var(--font-serif);font-size:16px;font-weight:700;color:var(--primary);margin-bottom:2px;">
                ${activeRequests[0].type} Scheduled
              </h4>
              <p class="body-sm" style="color:var(--on-surface-variant);">
                Your room is scheduled for a full refresh at <strong>${activeRequests[0].time || '11:00 AM'}</strong>.
              </p>
              <div style="display:flex;gap:8px;margin-top:8px;">
                <button class="btn-secondary" style="padding:4px 12px;font-size:11px;">Reschedule</button>
                <button style="padding:4px 12px;font-size:11px;font-weight:700;border:none;background:rgba(186,26,26,.08);color:var(--error);border-radius:var(--radius-full);cursor:pointer;letter-spacing:.04em;">Cancel</button>
              </div>
            </div>
          </div>
        </div>` : ''}
      </section>` : ''}

      <!-- Quick Actions Bento Grid -->
      <section>
        <p class="label-bold" style="margin-bottom:12px;color:var(--on-surface-variant);letter-spacing:.08em;">AT YOUR SERVICE</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">

          <!-- Dining Tile -->
          <div id="bento-dining" class="bento-tile" style="grid-column:1/-1;" data-view="dining">
            <div class="bento-img-wrap">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9rpr10VwsRERI68RBqaOkrnRL8IPjqgWMEZpQoDGytSSmAT12wH7BTAtVysQEwKEnmOwdaEYrYgF4xjk_i6MHJQP16WXCdpP_LW2Oj5j6fxx0iW-5_frbPU--37lcNYs5V7vOK8O6HwuXVo3kZmO6KKkS0GEbWp3KBEipLQ5Ax8tziOsABHMsQDOc9kM9c0CcgkEGgrBU6gKHczvEJbR2dEaeIh5NQavvZ-hOLqJXij3fJa28jfhl" alt="In-Room Dining" />
              <div class="bento-gradient"></div>
            </div>
            <div class="bento-label">
              <div class="bento-icon"><span class="material-symbols-outlined">room_service</span></div>
              <h4>In-Room Dining</h4>
              <p>Explore menus &amp; order</p>
            </div>
          </div>

          <!-- Housekeeping Tile -->
          <div id="bento-services" class="bento-tile" data-view="services">
            <div class="bento-img-wrap">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkl0QOEZczjCWd35eWxiVUnemJ4elthKY7xR4H2XHZeexnVigMqC9n62ug-9QA-6oosLozdhldR61GXW8oVedHNAYPiP6fDUjyJvY20Xc4c7z1NXwjEx8pVRqr-mvY-2wLYjqs_GrmhZk6i7RKigZR11R2HxrpW8gfvepK94pgzAe1LnEVUJVU5rACQiNWFCYd5i5kolbt5DBAoHi0P5NjL0xzTbh2Jz22KWLtjdpDMcap9rvPbXjX" alt="Housekeeping" />
              <div class="bento-gradient"></div>
            </div>
            <div class="bento-label">
              <div class="bento-icon"><span class="material-symbols-outlined">cleaning_services</span></div>
              <h4>Housekeeping</h4>
              <p>Extra towels &amp; turndown</p>
            </div>
          </div>

          <!-- Laundry & Valet Tile -->
          <div id="bento-laundry" class="bento-tile" data-view="laundry">
            <div class="bento-img-wrap">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcKiUSuo2x7YjQGSeZFcD-2vUw6H_G_w26XYKlnFKm4wGewvX_o-Ca07pfOqXlM8e86WKLl2fxDb5b4CsBHpfch3mYi1IN3O0GZS_m0Y0RQ4Nj7_2ROA2_6_MuLnQOgZwjVeVmPzaDZh01FPPfhRjmPiZl_1TvhzKpQ6ohrI824jA35kXMe_LMfUT8sej0s-71HKXkuyHG-2lmdeiKiIT30W2UOkaZnriGCaV-UGd72Dwyc59wlZhy" alt="Laundry & Valet" />
              <div class="bento-gradient"></div>
            </div>
            <div class="bento-label">
              <div class="bento-icon"><span class="material-symbols-outlined">local_laundry_service</span></div>
              <h4>Laundry &amp; Valet</h4>
              <p>Pressing &amp; dry clean</p>
            </div>
          </div>

          <!-- Chat / Messaging Tile -->
          <div id="bento-chat" class="bento-tile" data-view="chat">
            <div class="bento-img-wrap">
              <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800" alt="Front Desk Chat" />
              <div class="bento-gradient"></div>
            </div>
            <div class="bento-label">
              <div class="bento-icon"><span class="material-symbols-outlined">chat</span></div>
              <h4>Messaging</h4>
              <p>Chat with front desk</p>
            </div>
          </div>

          <!-- Report Issue Tile -->
          <div id="bento-issue" class="bento-tile" data-view="report-issue">
            <div class="bento-img-wrap" style="background:var(--primary);">
              <span class="material-symbols-outlined" style="font-size:48px;color:rgba(255,255,255,.18);position:absolute;bottom:8px;right:8px;">report_problem</span>
            </div>
            <div class="bento-label">
              <div class="bento-icon"><span class="material-symbols-outlined">report_problem</span></div>
              <h4>Report Issue</h4>
              <p>Submit a complaint</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  `;
}

export function bindGuestHomeEvents(state) {
  // DND toggle
  const dndToggle = document.getElementById('home-dnd-toggle');
  if (dndToggle) {
    dndToggle.addEventListener('change', () => {
      store.toggleDND();
      const on = store.state.dndActive;
      showToast(on ? 'Privacy Mode Activated' : 'Privacy Mode Deactivated',
        on ? 'Staff will not disturb you until this is turned off.' : 'You are now open to housekeeping & deliveries.',
        on ? 'do_not_disturb_on' : 'privacy_tip');
    });
  }

  // Track order button
  const trackBtn = document.getElementById('track-order-btn');
  if (trackBtn) trackBtn.addEventListener('click', () => store.setView('order-tracking'));

  // Bento tiles navigation
  document.querySelectorAll('.bento-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const view = tile.dataset.view;
      if (view) store.setView(view);
    });
  });
}
