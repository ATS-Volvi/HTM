import { store } from '../../state/store.js';
import { showToast } from '../../components/Toast.js';

export function renderReportIssueView(state) {
  const categories = [
    { id: 'ac', name: 'Air Conditioning / Climate', icon: 'ac_unit' },
    { id: 'plumbing', name: 'Plumbing & Water Flow', icon: 'water_drop' },
    { id: 'wifi', name: 'Smart TV & High-Speed Wi-Fi', icon: 'wifi' },
    { id: 'lighting', name: 'Lighting & Smart Controls', icon: 'lightbulb' },
    { id: 'clean', name: 'Spot Cleaning / Spills', icon: 'cleaning_services' },
    { id: 'other', name: 'Other Immediate Assistance', icon: 'support_agent' }
  ];

  return `
    <div class="app-content animate-fade-in" style="padding-bottom: 40px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <button class="btn-secondary" id="issue-back-btn" style="padding: 4px 10px; font-size: 11px;">
          ← Back
        </button>
        <span class="badge badge-dirty" style="font-size: 10px;">Maintenance Dispatch</span>
      </div>

      <div style="margin: 8px 0 12px 0;">
        <div class="label-bold" style="color: var(--error);">Engineering & Maintenance</div>
        <h2 class="display-title" style="font-size: 26px;">Report an Issue</h2>
        <p class="body-sm" style="color: var(--on-surface-variant); margin-top: 2px;">
          Our rapid response engineering team will resolve any inconvenience immediately.
        </p>
      </div>

      <!-- Category Selection -->
      <div class="glass-card" style="padding: 16px;">
        <div class="label-bold" style="margin-bottom: 12px;">1. Issue Category</div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;" id="issue-category-grid">
          ${categories.map((cat, idx) => `
            <button class="btn-secondary issue-cat-btn ${idx === 0 ? 'active' : ''}" data-cat="${cat.name}" style="padding: 12px 10px; font-size: 12px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; ${idx === 0 ? 'background: var(--primary); color: white; border-color: var(--primary);' : ''}">
              <span class="material-symbols-outlined" style="font-size: 24px; color: ${idx === 0 ? 'white' : 'var(--primary)'};">${cat.icon}</span>
              <span>${cat.name}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Description & Urgency -->
      <div class="glass-card" style="padding: 16px;">
        <div class="label-bold" style="margin-bottom: 10px;">2. Problem Details & Room Access</div>
        
        <div class="input-group">
          <label class="input-label">Urgency Level</label>
          <select class="input-field" id="issue-urgency">
            <option value="Urgent">Immediate / Urgent (Within 15 mins)</option>
            <option value="High">High Priority (Within 45 mins)</option>
            <option value="Normal">Normal Priority (Whenever convenient)</option>
          </select>
        </div>

        <div class="input-group" style="margin-top: 12px;">
          <label class="input-label">Describe What Needs Attention</label>
          <textarea id="issue-description" class="input-field" rows="3" placeholder="e.g. The shower temperature does not get fully warm, or Wi-Fi drops on the balcony..."></textarea>
        </div>

        <!-- Simulated Photo Attachment -->
        <div style="margin-top: 12px; padding: 12px; border: 1.5px dashed var(--outline-variant); border-radius: var(--radius-sm); text-align: center; background: var(--surface-container-lowest); cursor: pointer;" id="attach-photo-box">
          <span class="material-symbols-outlined" style="color: var(--outline); font-size: 24px;">add_a_photo</span>
          <div style="font-size: 12px; font-weight: 600; color: var(--primary); margin-top: 2px;">Attach a Photo (Optional)</div>
          <div style="font-size: 10px; color: var(--on-surface-variant);">Click to simulate photo from room</div>
        </div>
      </div>

      <!-- Dispatch Button -->
      <button class="btn-primary" id="submit-issue-btn" style="padding: 16px; font-size: 14px; width: 100%; border-radius: var(--radius-md); background: #93000a;">
        <span class="material-symbols-outlined">send</span> Dispatch Engineering to Suite 402
      </button>
    </div>
  `;
}

export function bindReportIssueEvents() {
  const backBtn = document.getElementById('issue-back-btn');
  if (backBtn) backBtn.addEventListener('click', () => store.setView('guest-home'));

  let selectedCat = 'Air Conditioning / Climate';
  const catBtns = document.querySelectorAll('.issue-cat-btn');
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => {
        b.style.background = 'var(--surface-container-low)';
        b.style.color = 'var(--primary)';
        b.style.borderColor = 'var(--outline-variant)';
        const icon = b.querySelector('.material-symbols-outlined');
        if (icon) icon.style.color = 'var(--primary)';
      });
      btn.style.background = 'var(--primary)';
      btn.style.color = 'white';
      btn.style.borderColor = 'var(--primary)';
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) icon.style.color = 'white';
      selectedCat = btn.dataset.cat;
    });
  });

  const photoBox = document.getElementById('attach-photo-box');
  if (photoBox) {
    photoBox.addEventListener('click', () => {
      photoBox.innerHTML = `
        <span class="material-symbols-outlined" style="color: var(--success); font-size: 24px;">check_circle</span>
        <div style="font-size: 12px; font-weight: 600; color: var(--success);">Photo Attached: room402_issue.jpg</div>
      `;
      photoBox.style.borderColor = 'var(--success)';
      showToast('Photo Attached', 'Photo ready for engineering dispatcher review.', 'image');
    });
  }

  const submitBtn = document.getElementById('submit-issue-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const urgency = document.getElementById('issue-urgency')?.value || 'Urgent';
      const desc = document.getElementById('issue-description')?.value || 'Guest reported issue requiring inspection.';

      store.addServiceRequest({
        title: `${selectedCat} Maintenance`,
        time: 'Immediate Dispatch',
        notes: desc,
        category: 'Maintenance',
        priority: urgency,
        icon: 'build'
      });

      showToast('Dispatch Ticket Created', `Engineering notified for Suite 402 (${urgency}).`, 'handyman');
      store.setView('guest-requests');
    });
  }
}
