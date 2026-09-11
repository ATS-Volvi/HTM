import { store } from '../../state/store.js';
import { showToast } from '../../components/Toast.js';

// State for selected date & time slot
let selectedDate = 'Oct 12';
let selectedSlot = '11:00–1:00 PM';
let recurringOn  = true;

export function renderScheduleServiceView() {
  const dates = [
    { label: 'Oct', day: '12', dow: 'Thu' },
    { label: 'Oct', day: '13', dow: 'Fri' },
    { label: 'Oct', day: '14', dow: 'Sat' },
    { label: 'Oct', day: '15', dow: 'Sun', checkout: true },
  ];

  const slots = [
    { id: '9:00–11:00 AM',  display: ['9:00 – 11:00', 'AM'],  group: 'Morning'   },
    { id: '11:00–1:00 PM',  display: ['11:00 – 1:00', 'PM'],  group: 'Morning'   },
    { id: '1:00–3:00 PM',   display: ['1:00 – 3:00',  'PM'],  group: 'Afternoon' },
    { id: '3:00–5:00 PM',   display: ['3:00 – 5:00',  'PM'],  group: 'Afternoon' },
  ];

  const morningSlots    = slots.filter(s => s.group === 'Morning');
  const afternoonSlots  = slots.filter(s => s.group === 'Afternoon');

  const dateCards = dates.map(d => {
    const isSelected = selectedDate === `${d.label} ${d.day}`;
    return `
      <button class="svc-date-card ${isSelected ? 'selected' : ''} ${d.checkout ? 'checkout' : ''}"
              data-date="${d.label} ${d.day}">
        <span class="svc-date-month">${d.label}</span>
        <span class="svc-date-day">${d.day}</span>
        <span class="svc-date-dow">${d.dow}</span>
        ${d.checkout ? '<span class="svc-checkout-label">Checkout</span>' : ''}
      </button>
    `;
  }).join('');

  const slotCard = (slot) => {
    const isActive = selectedSlot === slot.id;
    return `
      <button class="svc-slot-card ${isActive ? 'active' : ''}" data-slot="${slot.id}">
        ${isActive ? '<span class="svc-slot-dot"></span>' : ''}
        <span class="svc-slot-time">${slot.display[0]}</span>
        <span class="svc-slot-ampm">${slot.display[1]}</span>
      </button>
    `;
  };

  return `
    <div class="app-content animate-fade-in" style="padding-bottom:24px;">

      <!-- Page Header -->
      <div style="margin-bottom:20px;">
        <h2 style="font-family:var(--font-serif);font-size:26px;font-weight:700;color:var(--primary);line-height:1.2;margin-bottom:4px;">
          Housekeeping Schedule
        </h2>
        <p class="body-sm" style="color:var(--on-surface-variant);">
          Customize cleaning times for your stay (Oct 12–15).
        </p>
      </div>

      <!-- Date Selector -->
      <div class="glass-card" style="padding:18px;border-radius:14px;margin-bottom:14px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <span style="font-family:var(--font-serif);font-size:16px;font-weight:700;color:var(--primary);">Select Date</span>
          <span class="label-bold" style="background:rgba(4,22,39,.06);color:var(--primary);padding:3px 10px;border-radius:999px;font-size:10px;">STAY DURATION</span>
        </div>
        <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;">
          ${dateCards}
        </div>
      </div>

      <!-- Time Slot Selector -->
      <div class="glass-card" style="padding:18px;border-radius:14px;margin-bottom:14px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <span style="font-family:var(--font-serif);font-size:16px;font-weight:700;color:var(--primary);">Preferred Time</span>
          <span class="body-sm" style="color:var(--on-surface-variant);display:flex;align-items:center;gap:3px;">
            <span class="material-symbols-outlined" style="font-size:14px;">info</span> 2hr windows
          </span>
        </div>

        <p class="label-bold" style="color:var(--on-surface-variant);letter-spacing:.06em;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid var(--outline-variant);">MORNING</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;">
          ${morningSlots.map(slotCard).join('')}
        </div>

        <p class="label-bold" style="color:var(--on-surface-variant);letter-spacing:.06em;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid var(--outline-variant);">AFTERNOON</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          ${afternoonSlots.map(slotCard).join('')}
        </div>
      </div>

      <!-- Recurring Toggle -->
      <div class="glass-card" style="padding:18px;border-radius:14px;margin-bottom:14px;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
          <div style="flex:1;">
            <div style="font-family:var(--font-serif);font-size:16px;font-weight:700;color:var(--primary);margin-bottom:3px;">Recurring Schedule</div>
            <p class="body-sm" style="color:var(--on-surface-variant);">Apply this time slot to all remaining days of your stay.</p>
          </div>
          <label class="dnd-switch" style="margin-top:2px;flex-shrink:0;">
            <input type="checkbox" id="recurring-toggle" ${recurringOn ? 'checked' : ''} />
            <span class="dnd-slider"></span>
          </label>
        </div>
        ${recurringOn ? `
        <div style="margin-top:14px;padding:12px;background:rgba(4,22,39,.05);border-radius:10px;display:flex;align-items:flex-start;gap:10px;">
          <span class="material-symbols-outlined" style="color:var(--primary);font-size:20px;margin-top:1px;">event_repeat</span>
          <div>
            <span class="label-bold" style="color:var(--primary);letter-spacing:.05em;display:block;margin-bottom:2px;">ACTIVE RULE</span>
            <span class="body-sm" style="color:var(--on-surface);">
              Daily cleaning scheduled for <strong>${selectedSlot}</strong> from Oct 12 to Oct 14.
            </span>
          </div>
        </div>` : ''}
      </div>

      <!-- Special Requests -->
      <div class="glass-card" style="padding:18px;border-radius:14px;margin-bottom:20px;">
        <div style="font-family:var(--font-serif);font-size:16px;font-weight:700;color:var(--primary);margin-bottom:12px;">Special Requests</div>
        <div style="position:relative;">
          <label style="position:absolute;top:-8px;left:8px;background:var(--surface-container-lowest);padding:0 4px;" class="label-bold">Instructions for Staff</label>
          <textarea id="service-notes" rows="3" placeholder="E.g., Please refill coffee pods, extra towels…"
            style="width:100%;border:1px solid var(--outline-variant);border-radius:8px;padding:12px;font-size:14px;color:var(--on-surface);background:transparent;resize:none;outline:none;box-sizing:border-box;"></textarea>
        </div>
      </div>

      <!-- Confirm Button -->
      <button id="confirm-service-btn" class="btn-primary" style="width:100%;padding:16px;font-size:14px;border-radius:12px;display:flex;align-items:center;justify-content:center;gap:8px;">
        <span class="material-symbols-outlined">check_circle</span>
        Confirm Schedule
      </button>

    </div>
  `;
}

export function bindScheduleServiceEvents() {
  // Date cards
  document.querySelectorAll('.svc-date-card').forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('checkout')) return;
      selectedDate = card.dataset.date;
      store.setView('services');
    });
  });

  // Time slot cards
  document.querySelectorAll('.svc-slot-card').forEach(card => {
    card.addEventListener('click', () => {
      selectedSlot = card.dataset.slot;
      store.setView('services');
    });
  });

  // Recurring toggle
  const recurringToggle = document.getElementById('recurring-toggle');
  if (recurringToggle) {
    recurringToggle.addEventListener('change', () => {
      recurringOn = recurringToggle.checked;
      store.setView('services');
    });
  }

  // Confirm
  const confirmBtn = document.getElementById('confirm-service-btn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      const notes = document.getElementById('service-notes')?.value || '';
      store.addServiceRequest({
        title: 'Housekeeping',
        time: selectedSlot,
        date: selectedDate,
        notes,
        category: 'Housekeeping',
        priority: 'High',
      });
      showToast('Schedule Confirmed!', `Housekeeping at ${selectedSlot} on ${selectedDate}.`, 'check_circle');
      store.setView('guest-home');
    });
  }
}
