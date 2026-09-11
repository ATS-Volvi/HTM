import { store } from '../../state/store.js';
import { showToast } from '../../components/Toast.js';

// State for selected laundry options
let selectedDate = 'Oct 12';
let selectedSlot = '10:00–12:00 PM';
let selectedService = 'dry-clean';
let expressSpeedOn = false;

export function renderLaundryServiceView() {
  const dates = [
    { label: 'Oct', day: '12', dow: 'Thu' },
    { label: 'Oct', day: '13', dow: 'Fri' },
    { label: 'Oct', day: '14', dow: 'Sat' },
    { label: 'Oct', day: '15', dow: 'Sun', checkout: true },
  ];

  const services = [
    { id: 'dry-clean', title: 'Dry Cleaning', icon: 'dry_cleaning', desc: 'Suits, silk, gowns & delicate fabrics' },
    { id: 'wash-fold', title: 'Wash & Fold', icon: 'local_laundry_service', desc: 'Daily laundry, cottons & casual wear' },
    { id: 'pressing', title: 'Express Pressing', icon: 'iron', desc: 'Crisp steaming & garment pressing' },
    { id: 'shoe-valet', title: 'Shoe Polish & Care', icon: 'footprint', desc: 'Leather polishing & sneaker rejuvenation' },
  ];

  const slots = [
    { id: '8:00–10:00 AM',  display: ['8:00 – 10:00', 'AM'],  group: 'Morning'   },
    { id: '10:00–12:00 PM', display: ['10:00 – 12:00', 'PM'], group: 'Morning'   },
    { id: '2:00–4:00 PM',   display: ['2:00 – 4:00',  'PM'],  group: 'Afternoon' },
    { id: '5:00–7:00 PM',   display: ['5:00 – 7:00',  'PM'],  group: 'Afternoon' },
  ];

  const morningSlots   = slots.filter(s => s.group === 'Morning');
  const afternoonSlots = slots.filter(s => s.group === 'Afternoon');

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
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <div>
          <h2 style="font-family:var(--font-serif);font-size:26px;font-weight:700;color:var(--primary);line-height:1.2;margin-bottom:4px;">
            Laundry & Valet
          </h2>
          <p class="body-sm" style="color:var(--on-surface-variant);">
            Premium garment care & pressing delivered to Room 402.
          </p>
        </div>
      </div>

      <!-- Service Type Selection -->
      <div class="glass-card" style="padding:18px;border-radius:14px;margin-bottom:14px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <span style="font-family:var(--font-serif);font-size:16px;font-weight:700;color:var(--primary);">Service Type</span>
          <span class="label-bold" style="background:rgba(4,22,39,.06);color:var(--primary);padding:3px 10px;border-radius:999px;font-size:10px;">LUXURY CARE</span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          ${services.map(svc => {
            const isSelected = selectedService === svc.id;
            return `
              <button class="laundry-type-card ${isSelected ? 'selected' : ''}" data-svc="${svc.id}">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                  <span class="material-symbols-outlined" style="font-size:20px;color:${isSelected ? 'var(--secondary-container)' : 'var(--primary)'};">${svc.icon}</span>
                  <span style="font-family:var(--font-serif);font-size:14px;font-weight:700;text-align:left;">${svc.title}</span>
                </div>
                <p style="font-size:11px;opacity:0.8;margin:0;line-height:1.3;text-align:left;">${svc.desc}</p>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Pickup Date Selector -->
      <div class="glass-card" style="padding:18px;border-radius:14px;margin-bottom:14px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <span style="font-family:var(--font-serif);font-size:16px;font-weight:700;color:var(--primary);">Pickup Date</span>
          <span class="body-sm" style="color:var(--on-surface-variant);font-size:12px;">Same-day or next-day</span>
        </div>
        <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;">
          ${dateCards}
        </div>
      </div>

      <!-- Pickup Window -->
      <div class="glass-card" style="padding:18px;border-radius:14px;margin-bottom:14px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <span style="font-family:var(--font-serif);font-size:16px;font-weight:700;color:var(--primary);">Pickup Window</span>
          <span class="body-sm" style="color:var(--on-surface-variant);display:flex;align-items:center;gap:3px;">
            <span class="material-symbols-outlined" style="font-size:14px;">schedule</span> Valet pickup
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

      <!-- Express Turnaround Toggle -->
      <div class="glass-card" style="padding:18px;border-radius:14px;margin-bottom:14px;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
          <div style="flex:1;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span class="material-symbols-outlined" style="color:var(--secondary);font-size:20px;">bolt</span>
              <div style="font-family:var(--font-serif);font-size:16px;font-weight:700;color:var(--primary);">Express 4-Hour Turnaround</div>
            </div>
            <p class="body-sm" style="color:var(--on-surface-variant);margin-top:2px;">Priority rush service for immediate garment return.</p>
          </div>
          <label class="dnd-switch" style="margin-top:2px;flex-shrink:0;">
            <input type="checkbox" id="express-laundry-toggle" ${expressSpeedOn ? 'checked' : ''} />
            <span class="dnd-slider"></span>
          </label>
        </div>
        <div style="margin-top:12px;padding:12px;background:rgba(4,22,39,.05);border-radius:10px;display:flex;align-items:flex-start;gap:10px;">
          <span class="material-symbols-outlined" style="color:var(--primary);font-size:20px;margin-top:1px;">info</span>
          <div>
            <span class="label-bold" style="color:var(--primary);letter-spacing:.05em;display:block;margin-bottom:2px;">RETURN PROMISE</span>
            <span class="body-sm" style="color:var(--on-surface);">
              ${expressSpeedOn 
                ? 'Garments returned within <strong>4 hours</strong> from valet pickup.' 
                : 'Standard return: Next morning by <strong>9:00 AM</strong> on luxury hangers.'}
            </span>
          </div>
        </div>
      </div>

      <!-- Garment & Care Instructions -->
      <div class="glass-card" style="padding:18px;border-radius:14px;margin-bottom:20px;">
        <div style="font-family:var(--font-serif);font-size:16px;font-weight:700;color:var(--primary);margin-bottom:12px;">Special Garment Notes</div>
        <div style="position:relative;">
          <label style="position:absolute;top:-8px;left:8px;background:var(--surface-container-lowest);padding:0 4px;" class="label-bold">Special Care Instructions</label>
          <textarea id="laundry-notes" rows="3" placeholder="E.g., Extra starch on collars, cold water wash, treat stain on blue blazer…"
            style="width:100%;border:1px solid var(--outline-variant);border-radius:8px;padding:12px;font-size:14px;color:var(--on-surface);background:transparent;resize:none;outline:none;box-sizing:border-box;"></textarea>
        </div>
      </div>

      <!-- Confirm Button -->
      <button id="confirm-laundry-btn" class="btn-primary" style="width:100%;padding:16px;font-size:14px;border-radius:12px;display:flex;align-items:center;justify-content:center;gap:8px;">
        <span class="material-symbols-outlined">local_laundry_service</span>
        Request Valet Pickup
      </button>

    </div>
  `;
}

export function bindLaundryServiceEvents() {
  // Service type cards
  document.querySelectorAll('.laundry-type-card').forEach(card => {
    card.addEventListener('click', () => {
      selectedService = card.dataset.svc;
      store.setView('laundry');
    });
  });

  // Date cards
  document.querySelectorAll('.svc-date-card').forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('checkout')) return;
      selectedDate = card.dataset.date;
      store.setView('laundry');
    });
  });

  // Time slot cards
  document.querySelectorAll('.svc-slot-card').forEach(card => {
    card.addEventListener('click', () => {
      selectedSlot = card.dataset.slot;
      store.setView('laundry');
    });
  });

  // Express toggle
  const expressToggle = document.getElementById('express-laundry-toggle');
  if (expressToggle) {
    expressToggle.addEventListener('change', () => {
      expressSpeedOn = expressToggle.checked;
      store.setView('laundry');
    });
  }

  // Confirm
  const confirmBtn = document.getElementById('confirm-laundry-btn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      const notes = document.getElementById('laundry-notes')?.value || '';
      const serviceName = selectedService === 'dry-clean' ? 'Dry Cleaning' 
        : selectedService === 'wash-fold' ? 'Wash & Fold'
        : selectedService === 'pressing' ? 'Express Pressing' : 'Shoe Care';

      store.addServiceRequest({
        title: `${serviceName} (${expressSpeedOn ? 'Express' : 'Standard'})`,
        time: selectedSlot,
        date: selectedDate,
        notes,
        category: 'Laundry & Valet',
        priority: expressSpeedOn ? 'Urgent' : 'Medium',
      });

      showToast('Laundry Pickup Requested!', `Valet pickup booked for ${selectedDate} at ${selectedSlot}.`, 'check_circle');
      store.setView('guest-home');
    });
  }
}
