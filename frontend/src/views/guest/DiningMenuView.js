import { store } from '../../state/store.js';
import { showToast } from '../../components/Toast.js';

export function renderDiningMenuView(state) {
  const selectedCategory = state.selectedCategory || 'All';
  const categories = ['All', 'Breakfast', 'Mains', 'Desserts', 'Beverages'];
  const menu = state.menu;

  const filteredDishes = selectedCategory === 'All' 
    ? menu 
    : menu.filter(dish => dish.category === selectedCategory);

  const cartTotalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return `
    <div class="app-content animate-fade-in" style="padding-bottom: ${cartTotalItems > 0 ? '110px' : '40px'};">
      <!-- Header / Banner -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <button class="btn-secondary" id="back-home-btn" style="padding: 4px 10px; font-size: 11px; margin-bottom: 8px;">
            ← Back to Home
          </button>
          <div class="label-bold" style="color: var(--secondary);">L’Étoile In-Room Gastronomy</div>
          <h2 class="display-title" style="font-size: 26px;">In-Room Dining</h2>
        </div>
        <div style="text-align: right;">
          <span class="badge badge-gold" style="font-size: 10px;">Available 24/7</span>
          <div style="font-size: 11px; color: var(--on-surface-variant); margin-top: 4px;">Delivered in ~25 min</div>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="category-pills-row" id="dining-categories">
        ${categories.map(cat => `
          <button class="category-pill ${cat === selectedCategory ? 'active' : ''}" data-cat="${cat}">
            ${cat}
          </button>
        `).join('')}
      </div>

      <!-- Menu Items Grid -->
      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${filteredDishes.map(dish => {
          const cartItem = state.cart.find(i => i.id === dish.id);
          const inCartCount = cartItem ? cartItem.quantity : 0;

          return `
            <div class="glass-card" style="overflow: hidden; display: flex; flex-direction: column; border-radius: var(--radius-lg);">
              <div style="height: 150px; position: relative; overflow: hidden; background: #222;">
                <img 
                  src="${dish.image}" 
                  alt="${dish.name}" 
                  style="width: 100%; height: 100%; object-fit: cover;"
                  loading="lazy"
                />
                <div style="position: absolute; top: 10px; left: 10px; display: flex; gap: 6px;">
                  <span class="badge badge-vip" style="font-size: 10px; background: rgba(255,255,255,0.9); backdrop-filter: blur(4px);">
                    ${dish.tag}
                  </span>
                </div>
                <div style="position: absolute; bottom: 8px; right: 10px; background: rgba(4,22,39,0.85); color: white; padding: 4px 10px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 700;">
                  $${dish.price.toFixed(2)}
                </div>
              </div>

              <div style="padding: 14px 16px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                  <h4 style="font-family: var(--font-serif); font-size: 16px; font-weight: 700; color: var(--primary);">${dish.name}</h4>
                </div>
                <p class="body-sm" style="color: var(--on-surface-variant); margin-bottom: 12px; line-height: 1.4;">
                  ${dish.description}
                </p>

                <div style="display: flex; align-items: center; justify-content: space-between; pt-2; border-top: 1px solid var(--surface-container-high); padding-top: 10px;">
                  <div style="display: flex; gap: 8px; font-size: 11px; color: var(--outline);">
                    <span>⏱ ${dish.time}</span>
                    <span>•</span>
                    <span>🔥 ${dish.calories}</span>
                  </div>

                  ${inCartCount > 0 ? `
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <button class="btn-icon dish-qty-btn" data-dish-id="${dish.id}" data-delta="-1" style="background: var(--surface-container); width: 30px; height: 30px;">
                        <span class="material-symbols-outlined" style="font-size: 14px;">remove</span>
                      </button>
                      <span style="font-weight: 700; font-size: 14px; min-width: 16px; text-align: center;">${inCartCount}</span>
                      <button class="btn-icon dish-qty-btn" data-dish-id="${dish.id}" data-delta="1" style="background: var(--primary); color: white; width: 30px; height: 30px;">
                        <span class="material-symbols-outlined" style="font-size: 14px;">add</span>
                      </button>
                    </div>
                  ` : `
                    <button class="btn-primary add-dish-btn" data-dish-id="${dish.id}" style="padding: 8px 14px; font-size: 11px;">
                      <span class="material-symbols-outlined" style="font-size: 14px;">add_shopping_cart</span> Add
                    </button>
                  `}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Floating Cart Bottom Bar (Sticky when items exist) -->
      ${cartTotalItems > 0 ? `
        <div style="position: sticky; bottom: 80px; z-index: 50; margin: 0 -4px;">
          <div class="glass-card-navy animate-slide-up" style="padding: 14px 18px; border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); border: 1.5px solid var(--gold-accent); display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 38px; height: 38px; border-radius: 50%; background: var(--secondary-container); color: var(--on-secondary-container); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;">
                ${cartTotalItems}
              </div>
              <div>
                <div style="font-weight: 700; font-size: 15px; color: white;">$${cartSubtotal.toFixed(2)}</div>
                <div style="font-size: 11px; opacity: 0.8;">Room 402 • Deluxe Ocean View</div>
              </div>
            </div>
            <button class="btn-gold" id="view-checkout-btn" style="padding: 10px 18px; font-size: 12px;">
              Review Order →
            </button>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

export function bindDiningMenuEvents() {
  const backBtn = document.getElementById('back-home-btn');
  if (backBtn) backBtn.addEventListener('click', () => store.setView('guest-home'));

  const catBtns = document.querySelectorAll('.category-pill');
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      store.state.selectedCategory = btn.dataset.cat;
      store.notify();
    });
  });

  const addBtns = document.querySelectorAll('.add-dish-btn');
  addBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const dishId = btn.dataset.dishId;
      const dish = store.state.menu.find(d => d.id === dishId);
      if (dish) {
        store.openModal('item-customize', { dish });
      }
    });
  });

  const qtyBtns = document.querySelectorAll('.dish-qty-btn');
  qtyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const dishId = btn.dataset.dishId;
      const delta = parseInt(btn.dataset.delta, 10);
      store.updateCartQuantity(dishId, delta);
    });
  });

  const checkoutBtn = document.getElementById('view-checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => store.setView('checkout'));
  }
}
