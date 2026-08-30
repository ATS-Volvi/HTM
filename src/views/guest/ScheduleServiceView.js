import { store } from '../../state/store.js';
import { showToast } from '../../components/Toast.js';

export function renderScheduleServiceView(state) {
  const serviceTypes = [
    { id: 'refresh', title: 'Daily Suite Refresh', icon: 'cleaning_services', desc: 'Full room cleaning, fresh bed linens, and bathroom sanitization' },
    { id: 'turndown', title: 'Evening Turndown', icon: 'bedtime', desc: 'Bed preparation, dimmed ambient lighting, and artisanal chocolates' },
    { id: 'towels', title: 'Extra Plush Towels & Amenities', icon: 'bathtub', desc: 'Fresh 800 GSM Egyptian cotton towels and Diptyque bath products' },
    { id: 'laundry', title: 'Express Valet & Dry Cleaning', icon: 'local_laundry_service', desc: 'Same-day garment pressing, suit steaming, or laundering' },
    { id: 'luggage', title: 'Luggage & Bellhop Assistance', icon: 'luggage', desc: 'Baggage storage, packing assistance, or airport departure handling' }
  ];

  const timeSlots = [
    'Immediate (Within 30m)',
    'Today • 11:00 AM',
    'Today • 02:00 PM',
    'Today • 05:00 PM',
    'Tonight • 08:30 PM (Turndown)',
    'Tomorrow • 09:00 AM'
  ];

  return `
    <div class="app-content animate-fade-in" style="padding-bottom: 40px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <button class="btn-secondary" id="service-back-btn" style="padding: 4px 10px; font-size: 11px;">
          ← Back to Home
        </button>
        <button class="btn-secondary" id="goto-report-issue-btn" style="padding: 4px 10px; font-size: 11px; color: var(--error);">
          Report Repair / Issue ⚠
        </button>
      </div>

      <div style="margin: 8px 0 12px 0;">
        <div class="label-bold" style="color: var(--secondary);">Guest Care & Concierge</div>
        <h2 class="display-title" style="font-size: 26px;">Schedule Services</h2>
        <p class="body-sm" style="color: var(--on-surface-variant); margin-top: 2px;">
          Customized hospitality tailored for Suite 402.
        </p>
      </div>

      <!-- Service Selection -->
      <div class="glass-card" style="padding: 16px;">
        <div class="label-bold" style="margin-bottom: 12px;">1. Select Service Type</div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${serviceTypes.map((svc, idx) => `
            <label style="display: flex; align-items: flex-start; gap: 12px; padding: 10px 12px; border-radius: var(--radius-sm); border: 1.5px solid ${idx === 0 ? 'var(--primary)' : 'var(--outline-variant)'}; background: ${idx === 0 ? 'var(--surface-container-lowest)' : 'var(--surface-container-low)'}; cursor: pointer;" class="service-radio-card">
              <input type="radio" name="service-type" value="${svc.title}" ${idx === 0 ? 'checked' : ''} style="margin-top: 4px;" />
              <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 14px; color: var(--primary);">
                  <span class="material-symbols-outlined" style="font-size: 18px; color: var(--secondary);">${svc.icon}</span>
                  ${svc.title}
                </div>
                <p class="body-sm" style="margin-top: 2px; color: var(--on-surface-variant);">${svc.desc}</p>
              </div>
            </label>
          `).join('')}
        </div>
      </div>

      <!-- Preferred Timing -->
      <div class="glass-card" style="padding: 16px;">
        <div class="label-bold" style="margin-bottom: 10px;">2. Preferred Time Slot</div>
        <div class="input-group">
          <select class="input-field" id="service-time-slot">
            ${timeSlots.map(slot => `<option value="${slot}">${slot}</option>`).join('')}
          </select>
        </div>

        <div class="input-group" style="margin-top: 14px;">
          <label class="input-label">Aromatherapy & Custom Preferences</label>
          <input type="text" id="service-special-notes" class="input-field" placeholder="e.g. Lavender pillow mist, extra espresso pods, firm pillows..." />
        </div>
      </div>

      <!-- Submit Button -->
      <button class="btn-primary" id="confirm-service-btn" style="padding: 16px; font-size: 14px; width: 100%; border-radius: var(--radius-md);">
        <span class="material-symbols-outlined">event_available</span> Request Service for Suite 402
      </button>
    </div>
  `;
}

export function bindScheduleServiceEvents() {
  const backBtn = document.getElementById('service-back-btn');
  if (backBtn) backBtn.addEventListener('click', () => store.setView('guest-home'));

  const reportIssueBtn = document.getElementById('goto-report-issue-btn');
  if (reportIssueBtn) reportIssueBtn.addEventListener('click', () => store.setView('report-issue'));

  const radioCards = document.querySelectorAll('.service-radio-card');
  radioCards.forEach(card => {
    card.addEventListener('click', () => {
      radioCards.forEach(c => {
        c.style.borderColor = 'var(--outline-variant)';
        c.style.background = 'var(--surface-container-low)';
      });
      card.style.borderColor = 'var(--primary)';
      card.style.background = 'var(--surface-container-lowest)';
    });
  });

  const confirmBtn = document.getElementById('confirm-service-btn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      const selectedType = document.querySelector('input[name="service-type"]:checked')?.value || 'Daily Suite Refresh';
      const timeSlot = document.getElementById('service-time-slot')?.value || 'Today';
      const notes = document.getElementById('service-special-notes')?.value || '';

      store.addServiceRequest({
        title: selectedType,
        time: timeSlot,
        notes,
        category: 'Housekeeping',
        priority: 'High'
      });

      showToast('Service Scheduled!', `${selectedType} scheduled for ${timeSlot}.`, 'check_circle');
      store.setView('guest-requests');
    });
  }
}
