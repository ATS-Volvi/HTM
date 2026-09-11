// ==========================================================================
// VOLVITECH HOSPITALITY OS — RESERVATIONS & FRONT OFFICE VIEW
// Primary UI/UX Source: Google Stitch Project "Front Office Reservation System"
// ==========================================================================
import { ReservationDashboardView } from './frontoffice/ReservationDashboardView.js';

let activeDashboardInstance = null;

export function renderReservationsView(state) {
  return `
    <div class="workspace-main animate-fade-in" id="stitch-frontoffice-mount" style="padding: 24px; max-width: 1440px; margin: 0 auto; width: 100%;">
      <!-- Active Stitch Reservation Dashboard dynamically mounted here -->
    </div>
  `;
}

export function bindReservationsEvents() {
  const mountPoint = document.getElementById('stitch-frontoffice-mount');
  if (!mountPoint) return;

  activeDashboardInstance = new ReservationDashboardView();
  mountPoint.appendChild(activeDashboardInstance.render());
  
  // Load live data from PostgreSQL
  activeDashboardInstance.loadData().then(() => {
    activeDashboardInstance.renderContent();
  });
}
