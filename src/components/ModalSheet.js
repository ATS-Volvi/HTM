import { store } from '../state/store.js';
import { showToast } from './Toast.js';

export function renderModalSheet(state) {
  if (!state.activeModal) return '';

  const { type, data } = state.activeModal;

  if (type === 'room-details') {
    const room = state.rooms.find(r => r.id === data.roomId);
    if (!room) return '';

    return `
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-sheet">
          <div class="modal-drag-pill"></div>
          <div class="modal-header">
            <div>
              <div class="label-bold" style="color: var(--secondary);">Floor ${room.floor} • Room Details</div>
              <h3 class="headline-md" style="font-size: 20px;">Room ${room.id} — ${room.type}</h3>
            </div>
            <button class="btn-icon" id="modal-close-btn">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">
            <!-- Room Status Info -->
            <div style="display: flex; gap: 12px; align-items: center; justify-content: space-between; background: var(--surface-container-low); padding: 12px 16px; border-radius: var(--radius-md);">
              <div>
                <div class="label-bold" style="font-size: 10px;">Current Status</div>
                <div style="font-weight: 700; font-size: 15px; margin-top: 2px;">
                  <span class="badge ${
                    room.status === 'Clean' ? 'badge-clean' :
                    room.status === 'Dirty' ? 'badge-dirty' :
                    room.status === 'Inspected' ? 'badge-inspected' :
                    room.status === 'DND' ? 'badge-dnd' :
                    room.status === 'In Progress' ? 'badge-progress' : 'badge-vip'
                  }">${room.status}</span>
                </div>
              </div>
              <div style="text-align: right;">
                <div class="label-bold" style="font-size: 10px;">Guest Occupant</div>
                <div style="font-weight: 600; font-size: 13px; color: var(--primary);">
                  ${room.guest} ${room.vip ? '<span class="badge badge-vip" style="font-size: 9px; padding: 2px 6px;">VIP</span>' : ''}
                </div>
              </div>
            </div>

            <!-- Quick Status Change Actions -->
            <div>
              <div class="label-bold" style="margin-bottom: 8px;">Update Room Status</div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                <button class="btn-secondary status-pick-btn ${room.status === 'Clean' ? 'active' : ''}" data-status="Clean" style="padding: 8px 4px; font-size: 11px;">
                  <span class="material-symbols-outlined" style="font-size: 16px; color: #1b5e20;">sparkles</span> Clean
                </button>
                <button class="btn-secondary status-pick-btn ${room.status === 'Inspected' ? 'active' : ''}" data-status="Inspected" style="padding: 8px 4px; font-size: 11px;">
                  <span class="material-symbols-outlined" style="font-size: 16px; color: #0d47a1;">verified</span> Inspected
                </button>
                <button class="btn-secondary status-pick-btn ${room.status === 'In Progress' ? 'active' : ''}" data-status="In Progress" style="padding: 8px 4px; font-size: 11px;">
                  <span class="material-symbols-outlined" style="font-size: 16px; color: #6a1b9a;">hourglass_top</span> In Progress
                </button>
                <button class="btn-secondary status-pick-btn ${room.status === 'Dirty' ? 'active' : ''}" data-status="Dirty" style="padding: 8px 4px; font-size: 11px;">
                  <span class="material-symbols-outlined" style="font-size: 16px; color: #c62828;">cleaning_bucket</span> Dirty
                </button>
                <button class="btn-secondary status-pick-btn ${room.status === 'DND' ? 'active' : ''}" data-status="DND" style="padding: 8px 4px; font-size: 11px;">
                  <span class="material-symbols-outlined" style="font-size: 16px; color: #e65100;">do_not_disturb_on</span> DND
                </button>
                <button class="btn-secondary" id="modal-dnd-toggle-btn" style="padding: 8px 4px; font-size: 11px;">
                  <span class="material-symbols-outlined" style="font-size: 16px;">privacy_tip</span> Toggle DND
                </button>
              </div>
            </div>

            <!-- Assigned Housekeeper -->
            <div class="input-group">
              <label class="input-label">Assigned Housekeeper</label>
              <select class="input-field" id="housekeeper-select">
                <option value="Elena Gomez" ${room.housekeeper === 'Elena Gomez' ? 'selected' : ''}>Elena Gomez (Floor 4 Lead)</option>
                <option value="Maria Santos" ${room.housekeeper === 'Maria Santos' ? 'selected' : ''}>Maria Santos (Senior VIP Butler)</option>
                <option value="Fatima Zahra" ${room.housekeeper === 'Fatima Zahra' ? 'selected' : ''}>Fatima Zahra (Floor 3 Housekeeping)</option>
                <option value="Carlos Ruiz" ${room.housekeeper === 'Carlos Ruiz' ? 'selected' : ''}>Carlos Ruiz (Turnaround Specialist)</option>
                <option value="David Kim" ${room.housekeeper === 'David Kim' ? 'selected' : ''}>David Kim (Floor 2 Lead)</option>
              </select>
            </div>

            <!-- Last Cleaned info -->
            <div style="font-size: 12px; color: var(--on-surface-variant); display: flex; justify-content: space-between;">
              <span>Last service record: <strong>${room.lastCleaned}</strong></span>
              <span>Floor Zone: <strong>Wing A North</strong></span>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" style="flex: 1;" id="modal-cancel-btn">Cancel</button>
            <button class="btn-primary" style="flex: 1;" id="modal-save-room-btn" data-room-id="${room.id}">Save Changes</button>
          </div>
        </div>
      </div>
    `;
  }

  if (type === 'item-customize') {
    const dish = data.dish;
    if (!dish) return '';

    return `
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-sheet">
          <div class="modal-drag-pill"></div>
          <div class="modal-header">
            <div>
              <div class="label-bold" style="color: var(--secondary);">${dish.category} • In-Room Dining</div>
              <h3 class="headline-md" style="font-size: 18px;">${dish.name}</h3>
            </div>
            <button class="btn-icon" id="modal-close-btn">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">
            <div style="height: 160px; border-radius: var(--radius-md); overflow: hidden; position: relative;">
              <img src="${dish.image}" alt="${dish.name}" style="width: 100%; height: 100%; object-fit: cover;" />
              <div style="position: absolute; bottom: 8px; right: 8px; background: rgba(4,22,39,0.8); color: white; padding: 4px 8px; border-radius: var(--radius-sm); font-size: 11px; font-weight: 600;">
                $${dish.price.toFixed(2)}
              </div>
            </div>
            <p class="body-sm" style="color: var(--on-surface-variant); line-height: 1.5;">${dish.description}</p>

            <div class="input-group">
              <label class="input-label">Special Dietary & Preparation Notes</label>
              <input type="text" id="dish-instructions" class="input-field" placeholder="e.g. Dressing on the side, no gluten, extra ice..." />
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; background: var(--surface-container-low); padding: 12px 16px; border-radius: var(--radius-md);">
              <span style="font-weight: 600; font-size: 14px;">Quantity</span>
              <div style="display: flex; align-items: center; gap: 12px;">
                <button class="btn-icon" id="modal-qty-minus" style="background: white; border: 1px solid var(--outline-variant); width: 32px; height: 32px;">
                  <span class="material-symbols-outlined" style="font-size: 16px;">remove</span>
                </button>
                <span id="modal-qty-display" style="font-weight: 700; font-size: 16px; min-width: 20px; text-align: center;">1</span>
                <button class="btn-icon" id="modal-qty-plus" style="background: white; border: 1px solid var(--outline-variant); width: 32px; height: 32px;">
                  <span class="material-symbols-outlined" style="font-size: 16px;">add</span>
                </button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-gold" style="flex: 1;" id="modal-add-cart-btn">
              <span class="material-symbols-outlined">shopping_bag</span> Add to Order — $<span id="modal-total-price">${dish.price.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  return '';
}

export function bindModalEvents() {
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close-btn');
  const cancelBtn = document.getElementById('modal-cancel-btn');

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        store.closeModal();
      }
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', () => store.closeModal());
  if (cancelBtn) cancelBtn.addEventListener('click', () => store.closeModal());

  // Room modal specific
  let selectedStatus = null;
  const statusPickBtns = document.querySelectorAll('.status-pick-btn');
  statusPickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      statusPickBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedStatus = btn.dataset.status;
    });
  });

  const saveRoomBtn = document.getElementById('modal-save-room-btn');
  if (saveRoomBtn) {
    saveRoomBtn.addEventListener('click', () => {
      const roomId = saveRoomBtn.dataset.roomId;
      const housekeeper = document.getElementById('housekeeper-select')?.value;
      const room = store.state.rooms.find(r => r.id === roomId);
      const newStatus = selectedStatus || room.status;

      store.updateRoomStatus(roomId, newStatus, housekeeper);
      store.closeModal();
      showToast(`Room ${roomId} Updated`, `Status changed to ${newStatus} (Assigned: ${housekeeper})`, 'check_circle');
    });
  }

  const dndToggleBtn = document.getElementById('modal-dnd-toggle-btn');
  if (dndToggleBtn) {
    dndToggleBtn.addEventListener('click', () => {
      const state = store.state;
      const roomId = state.activeModal?.data?.roomId;
      if (roomId) {
        store.toggleRoomDND(roomId);
        store.closeModal();
        showToast(`Room ${roomId} DND Updated`, 'Do Not Disturb status has been toggled', 'privacy_tip');
      }
    });
  }

  // Dish customize modal
  let dishQty = 1;
  const qtyMinus = document.getElementById('modal-qty-minus');
  const qtyPlus = document.getElementById('modal-qty-plus');
  const qtyDisplay = document.getElementById('modal-qty-display');
  const totalPriceDisplay = document.getElementById('modal-total-price');
  const addCartBtn = document.getElementById('modal-add-cart-btn');

  if (qtyMinus && qtyPlus && qtyDisplay) {
    const dish = store.state.activeModal?.data?.dish;
    qtyMinus.addEventListener('click', () => {
      if (dishQty > 1) {
        dishQty--;
        qtyDisplay.textContent = dishQty;
        if (dish && totalPriceDisplay) totalPriceDisplay.textContent = (dish.price * dishQty).toFixed(2);
      }
    });
    qtyPlus.addEventListener('click', () => {
      dishQty++;
      qtyDisplay.textContent = dishQty;
      if (dish && totalPriceDisplay) totalPriceDisplay.textContent = (dish.price * dishQty).toFixed(2);
    });
  }

  if (addCartBtn) {
    addCartBtn.addEventListener('click', () => {
      const dish = store.state.activeModal?.data?.dish;
      const instructions = document.getElementById('dish-instructions')?.value || '';
      if (dish) {
        store.addToCart(dish, dishQty, instructions);
        store.closeModal();
        showToast('Item Added to Order', `${dishQty}x ${dish.name} added to cart`, 'restaurant');
      }
    });
  }
}
