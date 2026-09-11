// ==========================================================================
// VOLVITECH HOSPITALITY OS — GLOBAL COMMAND PALETTE (CTRL+K)
// ==========================================================================

import { store } from '../state/store.js';

export function renderCommandPalette(state) {
  if (!state.isCommandPaletteOpen) return '';

  const q = (state.commandSearchQuery || '').toLowerCase().trim();

  // Search items across all domain entities
  const matchingRooms = state.rooms.filter(r => r.id.includes(q) || r.guest.toLowerCase().includes(q) || r.type.toLowerCase().includes(q));
  const matchingGuests = state.guests.filter(g => g.name.toLowerCase().includes(q) || g.vipTier.toLowerCase().includes(q) || g.currentRoom.includes(q));
  const matchingRecipes = state.recipes.filter(rc => rc.name.toLowerCase().includes(q));
  const matchingStock = state.stockLedger.filter(s => s.name.toLowerCase().includes(q) || s.sku.toLowerCase().includes(q));
  const matchingTickets = state.maintenanceTickets.filter(m => m.id.toLowerCase().includes(q) || m.assetName.toLowerCase().includes(q) || m.roomOrArea.toLowerCase().includes(q));

  const quickActions = [
    { title: 'Open Tape Chart (Room Gantt)', icon: 'calendar_view_week', action: () => { store.setNavTab('tape_chart'); store.setInterfaceMode('web_hms'); } },
    { title: 'Create Maintenance Work Order', icon: 'build', action: () => store.setModal({ type: 'create_ticket', data: {} }) },
    { title: 'Review Pending Purchase Requisitions', icon: 'shopping_cart_checkout', action: () => { store.setNavTab('procurement'); store.setInterfaceMode('web_hms'); } },
    { title: 'Create New Recipe & BOM', icon: 'restaurant_menu', action: () => store.setModal({ type: 'create_recipe', data: {} }) },
    { title: 'Switch to Staff Mobile Field App', icon: 'badge', action: () => store.setInterfaceMode('staff_app') },
    { title: 'Switch to Guest Mobile Portal', icon: 'smartphone', action: () => store.setInterfaceMode('guest_app') }
  ];

  return `
    <div class="modal-backdrop" id="cmd-palette-backdrop">
      <div class="cmd-palette-container" id="cmd-palette-box">
        <div style="display:flex; align-items:center; border-bottom: 1px solid #1E293B; padding: 0 16px;">
          <span class="material-symbols-outlined" style="font-size: 20px; color: #60A5FA;">search</span>
          <input 
            type="text" 
            class="cmd-palette-input" 
            id="cmd-palette-input-field" 
            placeholder="Type a command, room (e.g. 402), guest, recipe, or inventory SKU..." 
            value="${state.commandSearchQuery || ''}"
            autofocus
          />
          <span style="font-size: 11px; color: #64748B; background: #1E293B; padding: 2px 6px; border-radius: 4px;">ESC</span>
        </div>

        <div class="cmd-palette-results">
          ${q === '' ? `
            <div style="font-size: 10px; font-weight: 700; color: #64748B; padding: 6px 12px; text-transform: uppercase;">
              Quick Commands
            </div>
            ${quickActions.map((qa, i) => `
              <div class="cmd-item" data-qa-index="${i}">
                <span class="material-symbols-outlined" style="font-size: 18px; color: #60A5FA;">${qa.icon}</span>
                <span style="font-weight: 500;">${qa.title}</span>
              </div>
            `).join('')}
          ` : `
            <!-- Results for Query -->
            ${matchingRooms.length > 0 ? `
              <div style="font-size: 10px; font-weight: 700; color: #64748B; padding: 6px 12px; text-transform: uppercase;">
                Rooms & Occupants (${matchingRooms.length})
              </div>
              ${matchingRooms.map(r => `
                <div class="cmd-item" data-type="room" data-room-id="${r.id}">
                  <span class="material-symbols-outlined" style="font-size: 18px; color: #10B981;">meeting_room</span>
                  <div style="flex:1;">
                    <span style="font-weight: 600; color: #FFFFFF;">Room ${r.id}</span>
                    <span style="color: #94A3B8; font-size: 11px; margin-left: 8px;">${r.type} — ${r.guest}</span>
                  </div>
                  <span class="badge badge-${r.status.toLowerCase().replace(' ', '')}" style="font-size: 9px;">${r.status}</span>
                </div>
              `).join('')}
            ` : ''}

            ${matchingGuests.length > 0 ? `
              <div style="font-size: 10px; font-weight: 700; color: #64748B; padding: 6px 12px; text-transform: uppercase;">
                Guests (${matchingGuests.length})
              </div>
              ${matchingGuests.map(g => `
                <div class="cmd-item" data-type="guest" data-guest-id="${g.id}">
                  <span class="material-symbols-outlined" style="font-size: 18px; color: #F59E0B;">person</span>
                  <div style="flex:1;">
                    <span style="font-weight: 600; color: #FFFFFF;">${g.name}</span>
                    <span style="color: #94A3B8; font-size: 11px; margin-left: 8px;">Room ${g.currentRoom} • VIP ${g.vipTier}</span>
                  </div>
                </div>
              `).join('')}
            ` : ''}

            ${matchingStock.length > 0 ? `
              <div style="font-size: 10px; font-weight: 700; color: #64748B; padding: 6px 12px; text-transform: uppercase;">
                Inventory & Stock Items (${matchingStock.length})
              </div>
              ${matchingStock.map(s => `
                <div class="cmd-item" data-type="inventory" data-sku="${s.sku}">
                  <span class="material-symbols-outlined" style="font-size: 18px; color: #38BDF8;">inventory_2</span>
                  <div style="flex:1;">
                    <span style="font-weight: 600; color: #FFFFFF;">${s.name}</span>
                    <span style="color: #94A3B8; font-size: 11px; margin-left: 8px;">${s.sku} • Stock: ${s.currentStock} ${s.unit}</span>
                  </div>
                  <span class="badge ${s.status === 'Healthy' ? 'badge-clean' : 'badge-urgent'}" style="font-size: 9px;">${s.status}</span>
                </div>
              `).join('')}
            ` : ''}

            ${matchingRecipes.length > 0 ? `
              <div style="font-size: 10px; font-weight: 700; color: #64748B; padding: 6px 12px; text-transform: uppercase;">
                F&B Recipes (${matchingRecipes.length})
              </div>
              ${matchingRecipes.map(rc => `
                <div class="cmd-item" data-type="recipe" data-recipe-id="${rc.id}">
                  <span class="material-symbols-outlined" style="font-size: 18px; color: #A855F7;">restaurant</span>
                  <div style="flex:1;">
                    <span style="font-weight: 600; color: #FFFFFF;">${rc.name}</span>
                    <span style="color: #94A3B8; font-size: 11px; margin-left: 8px;">Selling: $${rc.sellingPrice.toFixed(2)} • Food Cost: ${rc.foodCostPct}%</span>
                  </div>
                </div>
              `).join('')}
            ` : ''}
          `}
        </div>
      </div>
    </div>
  `;
}

export function bindCommandPaletteEvents() {
  const backdrop = document.getElementById('cmd-palette-backdrop');
  if (!backdrop) return;

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      store.setCommandPalette(false);
    }
  });

  const inputField = document.getElementById('cmd-palette-input-field');
  if (inputField) {
    inputField.focus();
    inputField.addEventListener('input', (e) => {
      store.state.commandSearchQuery = e.target.value;
      store.notify();
    });
  }

  // Handle Quick Action Clicks
  document.querySelectorAll('[data-qa-index]').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.dataset.qaIndex, 10);
      store.setCommandPalette(false);
      const quickActions = [
        () => { store.setNavTab('tape_chart'); store.setInterfaceMode('web_hms'); },
        () => store.setModal({ type: 'create_ticket', data: {} }),
        () => { store.setNavTab('procurement'); store.setInterfaceMode('web_hms'); },
        () => store.setModal({ type: 'create_recipe', data: {} }),
        () => store.setInterfaceMode('staff_app'),
        () => store.setInterfaceMode('guest_app')
      ];
      if (quickActions[idx]) quickActions[idx]();
    });
  });

  // Handle Item Clicks
  document.querySelectorAll('[data-type="room"]').forEach(el => {
    el.addEventListener('click', () => {
      const roomId = el.dataset.roomId;
      store.setCommandPalette(false);
      store.setModal({ type: 'folio', data: { roomNumber: roomId } });
    });
  });

  document.querySelectorAll('[data-type="inventory"]').forEach(el => {
    el.addEventListener('click', () => {
      store.setCommandPalette(false);
      store.setNavTab('inventory');
      store.setInterfaceMode('web_hms');
    });
  });

  document.querySelectorAll('[data-type="recipe"]').forEach(el => {
    el.addEventListener('click', () => {
      store.setCommandPalette(false);
      store.setNavTab('fb_recipes');
      store.setInterfaceMode('web_hms');
    });
  });
}

// Global Keyboard Shortcut listener for Ctrl+K & Escape
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    store.setCommandPalette(!store.state.isCommandPaletteOpen);
  }
  if (e.key === 'Escape' && store.state.isCommandPaletteOpen) {
    store.setCommandPalette(false);
  }
});
