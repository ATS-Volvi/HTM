// ==========================================================================
// VOLVITECH HOSPITALITY OS — LINEN, LAUNDRY & BATHROOM AMENITIES MODULE
// Real-time Par Stock, Turnover Consumption Telemetry & Commercial Laundry
// Fully Editable Par Levels, Room Turnover Consumption Logs & Consumables
// ==========================================================================

import { store } from '../../state/store.js';
import { Toast } from '../../components/Toast.js';

export class LinenAmenitiesView {
  constructor() {
    this.container = null;
    this.activeTab = 'CONSUMPTION_LOG'; // 'INVENTORY', 'AMENITIES', 'LAUNDRY_BATCHES', 'CONSUMPTION_LOG', 'REQUISITIONS'
    this.activeSendLaundryModal = false;
    this.activeRequestInventoryModal = false;
    this.preselectedRequisitionItemId = null;
    this.activeLogRoomModal = false;

    // Editing State
    this.editingLogId = null;
    this.editingInventoryCategory = null; // 'towels' | 'bedLinens'
    this.editingInventoryItemId = null;
    this.editingAmenityId = null;

    this.unsubscribe = null;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER LIFECYCLE
  // ──────────────────────────────────────────────────────────────────────────
  render() {
    this.container = document.createElement('div');
    this.container.className = 'w-full space-y-6 animate-fadeIn pb-16';
    this.renderContent();

    // Subscribe to store updates
    if (this.unsubscribe) {
      try { this.unsubscribe(); } catch (_) {}
    }
    this.unsubscribe = store.subscribe(() => {
      this.renderContent();
    });

    return this.container;
  }

  destroy() {
    if (this.unsubscribe) {
      try { this.unsubscribe(); } catch (_) {}
      this.unsubscribe = null;
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CONTENT COMPILATION
  // ──────────────────────────────────────────────────────────────────────────
  renderContent() {
    if (!this.container) return;

    const inventory = store.getLinenInventory();
    const { logs, totals } = store.getDailyLinenConsumption();
    const batches = store.getLaundryBatches();
    const hkRequisitions = store.getHousekeepingRequisitions ? store.getHousekeepingRequisitions() : [];

    const activeInLaundryBatches = batches.filter(b => b.status.includes('Laundry') || b.status.includes('Washing'));
    const totalPiecesInWash = inventory.towels.reduce((acc, t) => acc + (t.inLaundryCycle || 0), 0) +
      inventory.bedLinens.reduce((acc, b) => acc + (b.inLaundryCycle || 0), 0);
    const totalCleanInPantries = inventory.towels.reduce((acc, t) => acc + (t.cleanInPantries || 0), 0) +
      inventory.bedLinens.reduce((acc, b) => acc + (b.cleanInPantries || 0), 0);

    this.container.innerHTML = `
      <!-- ================================================================= -->
      <!-- 1. HEADER & QUICK ACTIONS -->
      <!-- ================================================================= -->
      <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-outline-variant pb-5">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary uppercase tracking-wider font-label-caps">
              <span class="material-symbols-outlined text-[14px]">local_laundry_service</span>
              Floor Logistics & Stock Audit
            </span>
            <span class="text-xs text-on-surface-variant font-data-mono">PAR RATIO: 3.5x</span>
          </div>
          <h1 class="text-2xl font-black font-headline tracking-tight text-primary">
            Linen, Laundry & Amenities Tracking
          </h1>
          <p class="text-xs text-on-surface-variant max-w-2xl">
            Live counts of towels changed, sheets laundered, and bathroom consumables replenished across all rooms and floor pantries.
          </p>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <button 
            id="btn-open-log-room-linen"
            class="px-3.5 py-2 rounded-xl border border-outline-variant bg-surface-bright hover:bg-surface-container text-primary font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <span class="material-symbols-outlined text-[17px]">edit_note</span>
            <span>+ Manual Room Entry</span>
          </button>

          <button 
            id="btn-open-request-inventory"
            class="px-3.5 py-2 rounded-xl border border-outline-variant bg-surface-bright hover:bg-surface-container text-primary font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
            title="Submit a Material Requisition to Central Inventory / Warehouse"
          >
            <span class="material-symbols-outlined text-[17px]">inventory_2</span>
            <span>Request from Inventory</span>
          </button>

          <button 
            id="btn-open-send-laundry"
            class="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-primary/90 transition-all cursor-pointer active:scale-95"
          >
            <span class="material-symbols-outlined text-[17px]">local_shipping</span>
            <span>Send to Laundry</span>
          </button>
        </div>
      </header>

      <!-- ================================================================= -->
      <!-- 2. EXECUTIVE SUMMARY KPI CARDS -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1: Towels Changed Today -->
        <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps">Towels Changed Today</span>
            <div class="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">wash</span>
            </div>
          </div>
          <div>
            <div class="text-3xl font-black text-primary font-data-mono">${totals.totalTowels} <span class="text-xs text-on-surface-variant font-normal">pcs</span></div>
            <div class="mt-2 flex items-center gap-1.5 flex-wrap text-[10px] font-data-mono text-on-surface-variant">
              <span class="px-1.5 py-0.5 rounded bg-surface-container font-semibold">${totals.totalBathTowels} Bath</span>
              <span class="px-1.5 py-0.5 rounded bg-surface-container font-semibold">${totals.totalHandTowels} Hand</span>
              <span class="px-1.5 py-0.5 rounded bg-surface-container font-semibold">${totals.totalWashcloths} Face</span>
              <span class="px-1.5 py-0.5 rounded bg-surface-container font-semibold">${totals.totalBathMats} Mats</span>
            </div>
          </div>
        </div>

        <!-- Card 2: Bed Linens Changed Today -->
        <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps">Sheets & Linens Changed</span>
            <div class="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">bed</span>
            </div>
          </div>
          <div>
            <div class="text-3xl font-black text-primary font-data-mono">${totals.totalSheets} <span class="text-xs text-on-surface-variant font-normal">pcs</span></div>
            <div class="mt-2 flex items-center gap-1.5 flex-wrap text-[10px] font-data-mono text-on-surface-variant">
              <span class="px-1.5 py-0.5 rounded bg-surface-container font-semibold">${totals.totalFittedSheets} Sheets</span>
              <span class="px-1.5 py-0.5 rounded bg-surface-container font-semibold">${totals.totalDuvetCovers} Duvets</span>
              <span class="px-1.5 py-0.5 rounded bg-surface-container font-semibold">${totals.totalPillowcases} Pillowcases</span>
            </div>
          </div>
        </div>

        <!-- Card 3: Bathroom Consumables Refilled -->
        <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps">Bathroom Amenities Refilled</span>
            <div class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">sanitizer</span>
            </div>
          </div>
          <div>
            <div class="text-3xl font-black text-primary font-data-mono">${totals.totalAmenities} <span class="text-xs text-on-surface-variant font-normal">units</span></div>
            <div class="mt-2 flex items-center gap-1.5 flex-wrap text-[10px] font-data-mono text-on-surface-variant">
              <span class="px-1.5 py-0.5 rounded bg-surface-container font-semibold">${totals.totalShampoos} Shampoo</span>
              <span class="px-1.5 py-0.5 rounded bg-surface-container font-semibold">${totals.totalSoaps} Soap</span>
              <span class="px-1.5 py-0.5 rounded bg-surface-container font-semibold">${totals.totalDentalKits} Dental</span>
            </div>
          </div>
        </div>

        <!-- Card 4: Laundry Pipeline -->
        <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps">Laundry Pipeline Status</span>
            <div class="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">sync</span>
            </div>
          </div>
          <div>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-black text-primary font-data-mono">${totalPiecesInWash}</span>
              <span class="text-xs text-amber-700 font-bold font-data-mono">in washing</span>
            </div>
            <div class="mt-2 flex items-center justify-between text-[10px] font-data-mono text-on-surface-variant">
              <span>Clean in Pantries: <strong>${totalCleanInPantries} pcs</strong></span>
              <span class="text-emerald-700 font-bold">${activeInLaundryBatches.length} active batch(es)</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- 3. NAVIGATION TABS -->
      <!-- ================================================================= -->
      <nav class="flex items-center gap-2 border-b border-outline-variant text-xs font-bold overflow-x-auto pb-px">
        <button 
          class="btn-linen-tab px-4 py-2.5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            this.activeTab === 'CONSUMPTION_LOG' 
              ? 'border-primary text-primary bg-primary/5 rounded-t-lg' 
              : 'border-transparent text-on-surface-variant hover:text-primary'
          }"
          data-tab="CONSUMPTION_LOG"
        >
          <span class="material-symbols-outlined text-[18px]">history</span>
          <span>Room Turnover Consumption Log</span>
          <span class="px-1.5 py-0.2 rounded-full bg-surface-container font-data-mono text-[10px]">${logs.length}</span>
        </button>

        <button 
          class="btn-linen-tab px-4 py-2.5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            this.activeTab === 'INVENTORY' 
              ? 'border-primary text-primary bg-primary/5 rounded-t-lg' 
              : 'border-transparent text-on-surface-variant hover:text-primary'
          }"
          data-tab="INVENTORY"
        >
          <span class="material-symbols-outlined text-[18px]">inventory_2</span>
          <span>Towels & Linens Par Stock</span>
        </button>

        <button 
          class="btn-linen-tab px-4 py-2.5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            this.activeTab === 'AMENITIES' 
              ? 'border-primary text-primary bg-primary/5 rounded-t-lg' 
              : 'border-transparent text-on-surface-variant hover:text-primary'
          }"
          data-tab="AMENITIES"
        >
          <span class="material-symbols-outlined text-[18px]">shower</span>
          <span>Bathroom Amenities & Stock</span>
        </button>

        <button 
          class="btn-linen-tab px-4 py-2.5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            this.activeTab === 'LAUNDRY_BATCHES' 
              ? 'border-primary text-primary bg-primary/5 rounded-t-lg' 
              : 'border-transparent text-on-surface-variant hover:text-primary'
          }"
          data-tab="LAUNDRY_BATCHES"
        >
          <span class="material-symbols-outlined text-[18px]">local_laundry_service</span>
          <span>Commercial Laundry Batches</span>
          <span class="px-1.5 py-0.2 rounded-full bg-surface-container font-data-mono text-[10px]">${batches.length}</span>
        </button>

        <button 
          class="btn-linen-tab px-4 py-2.5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            this.activeTab === 'REQUISITIONS' 
              ? 'border-primary text-primary bg-primary/5 rounded-t-lg' 
              : 'border-transparent text-on-surface-variant hover:text-primary'
          }"
          data-tab="REQUISITIONS"
        >
          <span class="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
          <span>Supply Requisitions</span>
          <span class="px-1.5 py-0.2 rounded-full bg-surface-container font-data-mono text-[10px]">${hkRequisitions.length}</span>
        </button>
      </nav>

      <!-- ================================================================= -->
      <!-- 4. ACTIVE TAB CONTENT -->
      <!-- ================================================================= -->
      <main>
        ${this.activeTab === 'CONSUMPTION_LOG' ? this.renderConsumptionLogTab(logs) : ''}
        ${this.activeTab === 'INVENTORY' ? this.renderInventoryTab(inventory) : ''}
        ${this.activeTab === 'AMENITIES' ? this.renderAmenitiesTab(inventory) : ''}
        ${this.activeTab === 'LAUNDRY_BATCHES' ? this.renderLaundryBatchesTab(batches) : ''}
        ${this.activeTab === 'REQUISITIONS' ? this.renderRequisitionsTab(hkRequisitions) : ''}
      </main>

      <!-- ================================================================= -->
      <!-- 5. MODALS: EDIT & DISPATCH -->
      <!-- ================================================================= -->
      ${this.renderSendLaundryModal()}
      ${this.renderRequestInventoryModal()}
      ${this.renderLogRoomLinenModal()}
      ${this.renderEditConsumptionLogModal()}
      ${this.renderEditInventoryModal()}
      ${this.renderEditAmenityModal()}
    `;

    this.bindEvents();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TAB 1: TOWELS & BED LINENS PAR STOCK (Editable)
  // ──────────────────────────────────────────────────────────────────────────
  renderInventoryTab(inventory) {
    return `
      <div class="space-y-6">
        <!-- Towels Category -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-sky-600">wash</span>
              <span>Towels & Bath Linens Par Inventory</span>
            </h3>
            <span class="text-xs text-on-surface-variant font-data-mono">Click edit on any card to modify par or stock levels</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            ${inventory.towels.map(item => {
              const cleanPercent = Math.min(100, Math.round((item.cleanInPantries / item.parLevel) * 100));
              return `
                <div class="p-4 rounded-2xl border border-outline-variant bg-surface-container-lowest flex flex-col justify-between shadow-xs">
                  <div>
                    <div class="flex items-start justify-between gap-2 mb-1.5">
                      <span class="font-bold text-primary text-xs">${item.name}</span>
                      <button 
                        class="btn-edit-linen-item p-1 rounded-lg border border-outline-variant hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all cursor-pointer"
                        data-category="towels"
                        data-id="${item.id}"
                        title="Edit Par & Stock Levels"
                      >
                        <span class="material-symbols-outlined text-[15px]">edit</span>
                      </button>
                    </div>

                    <div class="flex items-center justify-between text-[11px] font-data-mono text-on-surface-variant">
                      <span>Par Target: <strong>${item.parLevel} ${item.unit}</strong></span>
                      <span class="text-xs font-bold ${cleanPercent > 60 ? 'text-emerald-700' : 'text-amber-700'}">${cleanPercent}%</span>
                    </div>

                    <!-- Progress Bar -->
                    <div class="w-full h-1.5 bg-surface-container rounded-full overflow-hidden my-2">
                      <div class="h-full ${cleanPercent > 60 ? 'bg-emerald-600' : cleanPercent > 30 ? 'bg-amber-500' : 'bg-rose-600'}" style="width: ${cleanPercent}%;"></div>
                    </div>

                    <!-- Clean in Pantries -->
                    <div class="mt-3 flex items-baseline justify-between">
                      <span class="text-[11px] text-on-surface-variant">Clean in Pantries:</span>
                      <span class="font-black text-emerald-700 font-data-mono text-sm">${item.cleanInPantries} ${item.unit}</span>
                    </div>

                    <!-- Dirty Awaiting Laundry -->
                    <div class="mt-1 flex items-baseline justify-between text-xs">
                      <span class="text-[11px] text-on-surface-variant">Dirty Awaiting Wash:</span>
                      <span class="font-bold text-rose-600 font-data-mono">${item.dirtyAwaitingLaundry} ${item.unit}</span>
                    </div>

                    <!-- In Laundry Tunnel -->
                    <div class="mt-1 flex items-baseline justify-between text-xs">
                      <span class="text-[11px] text-on-surface-variant">In Laundry Cycle:</span>
                      <span class="font-bold text-amber-700 font-data-mono">${item.inLaundryCycle} ${item.unit}</span>
                    </div>
                  </div>

                  <div class="mt-3 pt-2.5 border-t border-outline-variant/60 flex items-center justify-between text-[10px] text-on-surface-variant font-data-mono">
                    <span>Par Ratio: ${(item.parLevel / 60).toFixed(1)}x</span>
                    <span class="text-primary font-bold cursor-pointer hover:underline btn-edit-linen-item" data-category="towels" data-id="${item.id}">Edit Values ✎</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Bed Linens Category -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-headline-sm text-sm font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-indigo-600">bed</span>
              <span>Bed Linens & Bedding Par Inventory</span>
            </h3>
            <span class="text-xs text-on-surface-variant font-data-mono">Click edit to customize bedding par counts</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            ${inventory.bedLinens.map(item => {
              const cleanPercent = Math.min(100, Math.round((item.cleanInPantries / item.parLevel) * 100));
              return `
                <div class="p-4 rounded-2xl border border-outline-variant bg-surface-container-lowest flex flex-col justify-between shadow-xs">
                  <div>
                    <div class="flex items-start justify-between gap-2 mb-1.5">
                      <span class="font-bold text-primary text-xs">${item.name}</span>
                      <button 
                        class="btn-edit-linen-item p-1 rounded-lg border border-outline-variant hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all cursor-pointer"
                        data-category="bedLinens"
                        data-id="${item.id}"
                        title="Edit Par & Stock Levels"
                      >
                        <span class="material-symbols-outlined text-[15px]">edit</span>
                      </button>
                    </div>

                    <div class="flex items-center justify-between text-[11px] font-data-mono text-on-surface-variant">
                      <span>Par Target: <strong>${item.parLevel} ${item.unit}</strong></span>
                      <span class="text-xs font-bold ${cleanPercent > 60 ? 'text-indigo-700' : 'text-amber-700'}">${cleanPercent}%</span>
                    </div>

                    <div class="w-full h-1.5 bg-surface-container rounded-full overflow-hidden my-2">
                      <div class="h-full ${cleanPercent > 60 ? 'bg-indigo-600' : cleanPercent > 30 ? 'bg-amber-500' : 'bg-rose-600'}" style="width: ${cleanPercent}%;"></div>
                    </div>

                    <div class="mt-3 flex items-baseline justify-between">
                      <span class="text-[11px] text-on-surface-variant">Clean in Pantries:</span>
                      <span class="font-black text-indigo-700 font-data-mono text-sm">${item.cleanInPantries} ${item.unit}</span>
                    </div>

                    <div class="mt-1 flex items-baseline justify-between text-xs">
                      <span class="text-[11px] text-on-surface-variant">Dirty Awaiting Wash:</span>
                      <span class="font-bold text-rose-600 font-data-mono">${item.dirtyAwaitingLaundry} ${item.unit}</span>
                    </div>

                    <div class="mt-1 flex items-baseline justify-between text-xs">
                      <span class="text-[11px] text-on-surface-variant">In Laundry Cycle:</span>
                      <span class="font-bold text-amber-700 font-data-mono">${item.inLaundryCycle} ${item.unit}</span>
                    </div>
                  </div>

                  <div class="mt-3 pt-2.5 border-t border-outline-variant/60 flex items-center justify-between text-[10px] text-on-surface-variant font-data-mono">
                    <span>Par Ratio: ${(item.parLevel / 40).toFixed(1)}x</span>
                    <span class="text-primary font-bold cursor-pointer hover:underline btn-edit-linen-item" data-category="bedLinens" data-id="${item.id}">Edit Values ✎</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TAB 2: BATHROOM AMENITIES & CONSUMABLES (Editable)
  // ──────────────────────────────────────────────────────────────────────────
  renderAmenitiesTab(inventory) {
    return `
      <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-xs">
        <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
          <div>
            <h3 class="font-headline-sm text-sm font-bold text-primary">Luxury Bathroom Consumables & Amenities</h3>
            <p class="text-xs text-on-surface-variant">Click edit on any amenity row to modify stock levels, consumption, or re-order thresholds</p>
          </div>
          <button 
            id="btn-tab-restock-amenities"
            class="px-3.5 py-1.5 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-primary/90 transition-all shadow-xs"
          >
            <span class="material-symbols-outlined text-[16px]">add_box</span>
            <span>Receive Consumables Stock</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-surface-container-low text-on-surface-variant text-[10px] uppercase font-data-mono border-b border-outline-variant">
              <tr>
                <th class="py-3 px-4 font-bold">Item Description</th>
                <th class="py-3 px-4 font-bold">Category</th>
                <th class="py-3 px-4 font-bold">Current Stock</th>
                <th class="py-3 px-4 font-bold">Min Threshold</th>
                <th class="py-3 px-4 font-bold">Used Today</th>
                <th class="py-3 px-4 font-bold">Stock Status</th>
                <th class="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/60">
              ${inventory.bathroomAmenities.map(item => {
                const isLow = item.stockAvailable <= item.minThreshold;
                return `
                  <tr class="hover:bg-surface-bright transition-colors">
                    <td class="py-3.5 px-4 font-bold text-primary flex items-center gap-2">
                      <span class="material-symbols-outlined text-[18px] text-primary">
                        ${item.id.includes('soap') ? 'soap' : item.id.includes('shampoo') || item.id.includes('conditioner') || item.id.includes('bodywash') ? 'sanitizer' : 'clean_hands'}
                      </span>
                      <span>${item.name}</span>
                    </td>
                    <td class="py-3.5 px-4 font-data-mono text-on-surface-variant">${item.category}</td>
                    <td class="py-3.5 px-4 font-data-mono font-black ${isLow ? 'text-rose-600' : 'text-emerald-700'}">${item.stockAvailable} ${item.unit}</td>
                    <td class="py-3.5 px-4 font-data-mono text-on-surface-variant">${item.minThreshold} ${item.unit}</td>
                    <td class="py-3.5 px-4 font-data-mono font-bold text-primary">${item.consumedToday || 0} ${item.unit}</td>
                    <td class="py-3.5 px-4">
                      ${isLow ? `
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold font-data-mono bg-rose-100 text-rose-800 border border-rose-200">
                          ⚠️ Low Stock
                        </span>
                      ` : `
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold font-data-mono bg-emerald-100 text-emerald-800 border border-emerald-200">
                          ✓ Optimal
                        </span>
                      `}
                    </td>
                    <td class="py-3.5 px-4 text-right">
                      <div class="flex items-center justify-end gap-1.5">
                        <button 
                          class="btn-request-refill-amenity px-2.5 py-1 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary cursor-pointer active:scale-95 transition-all flex items-center gap-1"
                          data-id="${item.id}"
                          data-name="${item.name}"
                          title="Submit Restock Requisition to Central Inventory"
                        >
                          <span class="material-symbols-outlined text-[14px]">inventory_2</span>
                          <span>Request Refill</span>
                        </button>
                        <button 
                          class="btn-edit-amenity-item p-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all cursor-pointer"
                          data-id="${item.id}"
                          title="Edit Stock & Thresholds"
                        >
                          <span class="material-symbols-outlined text-[15px]">edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TAB 3: COMMERCIAL LAUNDRY BATCHES
  // ──────────────────────────────────────────────────────────────────────────
  renderLaundryBatchesTab(batches) {
    return `
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-headline-sm text-sm font-bold text-primary">Commercial Eco-Laundry Batches</h3>
            <p class="text-xs text-on-surface-variant">Off-site and internal wash tracking for bed linen and terry towels</p>
          </div>
          <button 
            id="btn-tab-send-laundry"
            class="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-primary/90 transition-all shadow-xs"
          >
            <span class="material-symbols-outlined text-[16px]">local_shipping</span>
            <span>Dispatch Soiled Batch</span>
          </button>
        </div>

        <div class="grid grid-cols-1 gap-3">
          ${batches.map(batch => {
            const isCompleted = batch.status === 'Completed & Delivered';
            return `
              <div class="p-4 rounded-2xl border border-outline-variant bg-surface-container-lowest flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
                <div class="flex items-start gap-3.5">
                  <div class="w-10 h-10 rounded-xl ${isCompleted ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'} flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-[22px]">
                      ${isCompleted ? 'check_circle' : 'local_laundry_service'}
                    </span>
                  </div>
                  <div>
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="font-black text-primary font-data-mono">${batch.code}</span>
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold font-data-mono ${
                        isCompleted 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }">
                        ${batch.status}
                      </span>
                      <span class="text-xs text-on-surface-variant">• ${batch.vendor}</span>
                    </div>

                    <div class="mt-1 text-xs text-on-surface-variant">
                      Breakdown: <strong>${batch.breakdown}</strong>
                    </div>

                    <div class="mt-1.5 flex items-center gap-4 text-[11px] font-data-mono text-on-surface-variant">
                      <span>Total: <strong>${batch.totalPieces} pieces</strong> (${batch.weightKg} kg)</span>
                      <span>Dispatched: ${batch.sentTime}</span>
                      <span>Est. Return: ${batch.expectedReturn}</span>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2 self-end md:self-center">
                  ${!isCompleted ? `
                    <button 
                      class="btn-receive-batch px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shadow-xs active:scale-95"
                      data-id="${batch.id}"
                    >
                      <span class="material-symbols-outlined text-[16px]">done_all</span>
                      <span>Receive Clean Delivery</span>
                    </button>
                  ` : `
                    <span class="text-xs font-bold text-emerald-700 font-data-mono flex items-center gap-1">
                      <span class="material-symbols-outlined text-[16px]">verified</span>
                      <span>Restocked to Pantries</span>
                    </span>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TAB 4: ROOM TURNOVER CONSUMPTION LOG (With Row Actions: Edit & Delete)
  // ──────────────────────────────────────────────────────────────────────────
  renderConsumptionLogTab(logs) {
    return `
      <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-xs">
        <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
          <div>
            <h3 class="font-headline-sm text-sm font-bold text-primary">Room Turnover Consumption Audit Log</h3>
            <p class="text-xs text-on-surface-variant">All room turnover entries are fully editable. Click the edit button on any row to adjust quantities.</p>
          </div>
          <button 
            id="btn-tab-log-room-linen"
            class="px-3.5 py-1.5 rounded-xl border border-outline-variant hover:bg-surface-container text-primary font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span class="material-symbols-outlined text-[16px]">edit_note</span>
            <span>+ Manual Room Entry</span>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-surface-container-low text-on-surface-variant text-[10px] uppercase font-data-mono border-b border-outline-variant">
              <tr>
                <th class="py-3 px-4 font-bold">Room #</th>
                <th class="py-3 px-4 font-bold">Room Type</th>
                <th class="py-3 px-4 font-bold">Clean Type</th>
                <th class="py-3 px-4 font-bold">Attendant</th>
                <th class="py-3 px-4 font-bold">Towels Changed</th>
                <th class="py-3 px-4 font-bold">Linens Changed</th>
                <th class="py-3 px-4 font-bold">Toiletries Replaced</th>
                <th class="py-3 px-4 font-bold">Time</th>
                <th class="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/60">
              ${logs.length === 0 ? `
                <tr>
                  <td colspan="9" class="p-8 text-center text-on-surface-variant">
                    No room turnover linen entries recorded yet today.
                  </td>
                </tr>
              ` : logs.map(log => `
                <tr class="hover:bg-surface-bright transition-colors group">
                  <td class="py-3 px-4 font-data-mono font-black text-primary">#${log.roomId}</td>
                  <td class="py-3 px-4 font-medium text-on-surface-variant">${log.roomType}</td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold font-data-mono ${
                      log.cleanType.includes('Departure') || log.cleanType.includes('Full')
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-sky-100 text-sky-800'
                    }">
                      ${log.cleanType}
                    </span>
                  </td>
                  <td class="py-3 px-4 font-bold text-primary">${log.attendant}</td>
                  <td class="py-3 px-4 font-data-mono text-xs">
                    ${log.towelsChanged ? `
                      <span class="font-bold text-sky-700">${log.towelsChanged.bathTowels || 0} Bath</span>,
                      <span>${log.towelsChanged.handTowels || 0} Hand</span>,
                      <span>${log.towelsChanged.washcloths || 0} Face</span>
                    ` : 'None'}
                  </td>
                  <td class="py-3 px-4 font-data-mono text-xs">
                    ${log.sheetsChanged ? `
                      <span class="font-bold text-indigo-700">${log.sheetsChanged.fittedSheets || 0} Sheet</span>,
                      <span>${log.sheetsChanged.duvetCovers || 0} Duvet</span>,
                      <span>${log.sheetsChanged.pillowcases || 0} Pillow</span>
                    ` : 'None'}
                  </td>
                  <td class="py-3 px-4 font-data-mono text-xs">
                    ${log.amenitiesRefilled ? `
                      <span>${log.amenitiesRefilled.shampoo || 0} Shampoo, ${log.amenitiesRefilled.soap || 0} Soap, ${log.amenitiesRefilled.dentalKit || 0} Dental</span>
                    ` : 'None'}
                  </td>
                  <td class="py-3 px-4 font-data-mono text-on-surface-variant">${log.timestamp}</td>
                  <td class="py-3 px-4 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                      <button 
                        class="btn-edit-consumption-log p-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all cursor-pointer active:scale-95"
                        data-id="${log.id}"
                        title="Edit Turnover Item Breakdown"
                      >
                        <span class="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button 
                        class="btn-delete-consumption-log p-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-all cursor-pointer active:scale-95"
                        data-id="${log.id}"
                        title="Delete Entry"
                      >
                        <span class="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MODALS: EDIT CONSUMPTION LOG (The Primary User Request)
  // ──────────────────────────────────────────────────────────────────────────
  renderEditConsumptionLogModal() {
    if (!this.editingLogId) return '';
    const { logs } = store.getDailyLinenConsumption();
    const log = logs.find(l => l.id === this.editingLogId);
    if (!log) return '';

    const towels = log.towelsChanged || {};
    const sheets = log.sheetsChanged || {};
    const amenities = log.amenitiesRefilled || {};

    return `
      <div class="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px] text-primary">edit_note</span>
              <div>
                <h3 class="font-headline-sm text-base font-bold text-primary">Edit Turnover Usage — Room #${log.roomId}</h3>
                <p class="text-[11px] text-on-surface-variant">${log.roomType} • Logged at ${log.timestamp}</p>
              </div>
            </div>
            <button id="btn-close-edit-log" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <form id="form-edit-consumption-log" class="p-6 space-y-4 text-xs overflow-y-auto custom-scrollbar">
            <!-- Basic Meta Info -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Clean Type *</label>
                <select id="input-edit-log-clean-type" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary font-bold outline-none cursor-pointer">
                  ${[
                    'Departure Turnover (Full Strip)',
                    'Daily Stayover Refresh',
                    'VIP Turndown & Linen Refresh',
                    'Express Touchup',
                    'Custom Service'
                  ].map(ct => `
                    <option value="${ct}" ${log.cleanType === ct ? 'selected' : ''}>${ct}</option>
                  `).join('')}
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Attendant Name *</label>
                <input type="text" id="input-edit-log-attendant" value="${log.attendant || ''}" required class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary font-bold outline-none" />
              </div>
            </div>

            <!-- Towels Changed Inputs -->
            <div class="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200/80 space-y-2">
              <div class="flex items-center gap-1.5 text-sky-900 font-bold text-xs">
                <span class="material-symbols-outlined text-[16px]">wash</span>
                <span>Towels Changed</span>
              </div>
              <div class="grid grid-cols-4 gap-2">
                <div>
                  <label class="block text-[9px] font-bold text-sky-900 font-data-mono uppercase">Bath Towels</label>
                  <input type="number" id="input-edit-log-bath-towels" min="0" value="${towels.bathTowels ?? 0}" class="w-full py-1.5 px-2 rounded-lg border border-sky-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-sky-900 font-data-mono uppercase">Hand Towels</label>
                  <input type="number" id="input-edit-log-hand-towels" min="0" value="${towels.handTowels ?? 0}" class="w-full py-1.5 px-2 rounded-lg border border-sky-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-sky-900 font-data-mono uppercase">Face Cloths</label>
                  <input type="number" id="input-edit-log-washcloths" min="0" value="${towels.washcloths ?? 0}" class="w-full py-1.5 px-2 rounded-lg border border-sky-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-sky-900 font-data-mono uppercase">Bath Mats</label>
                  <input type="number" id="input-edit-log-bath-mats" min="0" value="${towels.bathMats ?? 0}" class="w-full py-1.5 px-2 rounded-lg border border-sky-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
              </div>
            </div>

            <!-- Bed Linens Inputs -->
            <div class="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200/80 space-y-2">
              <div class="flex items-center gap-1.5 text-indigo-900 font-bold text-xs">
                <span class="material-symbols-outlined text-[16px]">bed</span>
                <span>Bed Linens Changed</span>
              </div>
              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="block text-[9px] font-bold text-indigo-900 font-data-mono uppercase">Fitted Sheets</label>
                  <input type="number" id="input-edit-log-fitted-sheets" min="0" value="${sheets.fittedSheets ?? 0}" class="w-full py-1.5 px-2 rounded-lg border border-indigo-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-indigo-900 font-data-mono uppercase">Duvet Covers</label>
                  <input type="number" id="input-edit-log-duvet-covers" min="0" value="${sheets.duvetCovers ?? 0}" class="w-full py-1.5 px-2 rounded-lg border border-indigo-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-indigo-900 font-data-mono uppercase">Pillowcases</label>
                  <input type="number" id="input-edit-log-pillowcases" min="0" value="${sheets.pillowcases ?? 0}" class="w-full py-1.5 px-2 rounded-lg border border-indigo-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
              </div>
            </div>

            <!-- Bathroom Toiletries Inputs -->
            <div class="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
              <div class="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                <span class="material-symbols-outlined text-[16px]">sanitizer</span>
                <span>Bathroom Toiletries Replaced</span>
              </div>
              <div class="grid grid-cols-4 gap-2">
                <div>
                  <label class="block text-[9px] font-bold text-emerald-900 font-data-mono uppercase">Shampoo</label>
                  <input type="number" id="input-edit-log-shampoo" min="0" value="${amenities.shampoo ?? 0}" class="w-full py-1.5 px-2 rounded-lg border border-emerald-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-emerald-900 font-data-mono uppercase">Conditioner</label>
                  <input type="number" id="input-edit-log-conditioner" min="0" value="${amenities.conditioner ?? 0}" class="w-full py-1.5 px-2 rounded-lg border border-emerald-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-emerald-900 font-data-mono uppercase">Body Wash</label>
                  <input type="number" id="input-edit-log-bodywash" min="0" value="${amenities.bodyWash ?? 0}" class="w-full py-1.5 px-2 rounded-lg border border-emerald-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-emerald-900 font-data-mono uppercase">Hand Soap</label>
                  <input type="number" id="input-edit-log-soap" min="0" value="${amenities.soap ?? 0}" class="w-full py-1.5 px-2 rounded-lg border border-emerald-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
              </div>

              <div class="grid grid-cols-3 gap-2 pt-1">
                <div>
                  <label class="block text-[9px] font-bold text-emerald-900 font-data-mono uppercase">Dental Kits</label>
                  <input type="number" id="input-edit-log-dental" min="0" value="${amenities.dentalKit ?? 0}" class="w-full py-1.5 px-2 rounded-lg border border-emerald-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-emerald-900 font-data-mono uppercase">Shaving Kits</label>
                  <input type="number" id="input-edit-log-shaving" min="0" value="${amenities.shavingKit ?? 0}" class="w-full py-1.5 px-2 rounded-lg border border-emerald-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-emerald-900 font-data-mono uppercase">Vanity Kits</label>
                  <input type="number" id="input-edit-log-vanity" min="0" value="${amenities.vanityKit ?? 0}" class="w-full py-1.5 px-2 rounded-lg border border-emerald-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Notes / Special Observations</label>
              <input type="text" id="input-edit-log-notes" value="${log.notes || ''}" placeholder="e.g. Extra towels requested by guest" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary outline-none" />
            </div>

            <div class="pt-3 border-t border-outline-variant flex items-center justify-between gap-2">
              <button type="button" id="btn-delete-log-direct" data-id="${log.id}" class="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all">
                <span class="material-symbols-outlined text-[16px]">delete</span>
                <span>Remove Entry</span>
              </button>

              <div class="flex items-center gap-2">
                <button type="button" id="btn-cancel-edit-log" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
                <button type="submit" class="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MODALS: EDIT INVENTORY ITEM (Par levels & stock)
  // ──────────────────────────────────────────────────────────────────────────
  renderEditInventoryModal() {
    if (!this.editingInventoryItemId || !this.editingInventoryCategory) return '';
    const inventory = store.getLinenInventory();
    const list = inventory[this.editingInventoryCategory] || [];
    const item = list.find(i => i.id === this.editingInventoryItemId);
    if (!item) return '';

    return `
      <div class="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px] text-primary">tune</span>
              <h3 class="font-headline-sm text-base font-bold text-primary">Edit Stock — ${item.name}</h3>
            </div>
            <button id="btn-close-edit-inventory" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <form id="form-edit-inventory" class="p-6 space-y-3.5 text-xs">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Par Level Target *</label>
                <input type="number" id="input-edit-par-level" value="${item.parLevel}" required min="10" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary font-bold font-data-mono outline-none" />
              </div>

              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Clean in Pantries *</label>
                <input type="number" id="input-edit-clean-pantries" value="${item.cleanInPantries}" required min="0" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-emerald-800 font-bold font-data-mono outline-none" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Dirty Awaiting Laundry *</label>
                <input type="number" id="input-edit-dirty-laundry" value="${item.dirtyAwaitingLaundry}" required min="0" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-rose-700 font-bold font-data-mono outline-none" />
              </div>

              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">In Laundry Tunnel *</label>
                <input type="number" id="input-edit-in-wash" value="${item.inLaundryCycle}" required min="0" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-amber-700 font-bold font-data-mono outline-none" />
              </div>
            </div>

            <div class="pt-3 border-t border-outline-variant flex items-center justify-end gap-2">
              <button type="button" id="btn-cancel-edit-inventory" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all">
                Save Par Stock
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MODALS: EDIT AMENITY ITEM (Thresholds & Stock)
  // ──────────────────────────────────────────────────────────────────────────
  renderEditAmenityModal() {
    if (!this.editingAmenityId) return '';
    const inventory = store.getLinenInventory();
    const item = inventory.bathroomAmenities.find(a => a.id === this.editingAmenityId);
    if (!item) return '';

    return `
      <div class="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px] text-primary">edit</span>
              <h3 class="font-headline-sm text-base font-bold text-primary">Edit Consumable — ${item.name}</h3>
            </div>
            <button id="btn-close-edit-amenity" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <form id="form-edit-amenity" class="p-6 space-y-3.5 text-xs">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Stock Available (${item.unit}) *</label>
              <input type="number" id="input-edit-amenity-stock" value="${item.stockAvailable}" required min="0" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary font-bold font-data-mono outline-none" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Min Reorder Threshold *</label>
                <input type="number" id="input-edit-amenity-min" value="${item.minThreshold}" required min="10" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary font-data-mono outline-none" />
              </div>

              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Consumed Today</label>
                <input type="number" id="input-edit-amenity-consumed" value="${item.consumedToday || 0}" min="0" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary font-data-mono outline-none" />
              </div>
            </div>

            <div class="pt-3 border-t border-outline-variant flex items-center justify-end gap-2">
              <button type="button" id="btn-cancel-edit-amenity" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all">
                Save Amenity Stock
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MODALS: SEND LAUNDRY
  // ──────────────────────────────────────────────────────────────────────────
  renderSendLaundryModal() {
    if (!this.activeSendLaundryModal) return '';

    return `
      <div class="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px] text-primary">local_shipping</span>
              <h3 class="font-headline-sm text-base font-bold text-primary">Dispatch Soiled Linens to Laundry</h3>
            </div>
            <button id="btn-close-send-laundry" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <form id="form-send-laundry" class="p-6 space-y-3.5 text-xs">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Total Pieces to Send *</label>
              <input type="number" id="input-laundry-pieces" value="65" required class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary font-bold font-data-mono outline-none" />
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Item Breakdown *</label>
              <input type="text" id="input-laundry-breakdown" value="30 Bath Towels, 20 Hand Towels, 15 Bedsheets" required class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary outline-none" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Est. Weight (kg)</label>
                <input type="number" id="input-laundry-weight" value="38.5" step="0.5" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary font-data-mono outline-none" />
              </div>

              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Commercial Laundry</label>
                <select id="sel-laundry-vendor" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary outline-none cursor-pointer">
                  <option value="Riviera Commercial Eco-Laundry Ltd.">Riviera Commercial Eco-Laundry</option>
                  <option value="In-House Luxury Laundry Plant">In-House Luxury Laundry Plant</option>
                </select>
              </div>
            </div>

            <div class="pt-3 border-t border-outline-variant flex items-center justify-end gap-2">
              <button type="button" id="btn-cancel-send-laundry" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all">
                Dispatch Batch
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TAB 5: SUPPLY REQUISITIONS TO CENTRAL INVENTORY
  // ──────────────────────────────────────────────────────────────────────────
  renderRequisitionsTab(requisitions) {
    return `
      <div class="space-y-4">
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-headline-sm text-sm font-bold text-primary">Supply Requisitions to Central Inventory</h3>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold font-data-mono bg-sky-100 text-sky-800">${requisitions.length} Total</span>
            </div>
            <p class="text-xs text-on-surface-variant">Track material requisitions submitted to the Central Warehouse & Stores for pantry replenishment.</p>
          </div>
          <div class="flex items-center gap-2">
            <button 
              id="btn-go-to-inventory-module"
              class="px-3 py-2 rounded-xl border border-outline-variant hover:bg-surface-container text-primary font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
              title="Switch to Central Inventory & Procurement Hub"
            >
              <span class="material-symbols-outlined text-[16px]">open_in_new</span>
              <span>Open Central Inventory Hub</span>
            </button>
            <button 
              id="btn-tab-request-inventory"
              class="px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-primary/90 transition-all shadow-xs"
            >
              <span class="material-symbols-outlined text-[16px]">inventory_2</span>
              <span>+ New Supply Requisition</span>
            </button>
          </div>
        </div>

        <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-xs">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-surface-container-low text-on-surface-variant text-[10px] uppercase font-data-mono border-b border-outline-variant">
                <tr>
                  <th class="py-3 px-4 font-bold">PR Number</th>
                  <th class="py-3 px-4 font-bold">Items Requested</th>
                  <th class="py-3 px-4 font-bold">Destination</th>
                  <th class="py-3 px-4 font-bold">Requested By</th>
                  <th class="py-3 px-4 font-bold">Priority</th>
                  <th class="py-3 px-4 font-bold">Estimated Cost</th>
                  <th class="py-3 px-4 font-bold">Status</th>
                  <th class="py-3 px-4 font-bold text-right">Created</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/60">
                ${requisitions.length === 0 ? `
                  <tr>
                    <td colspan="8" class="p-8 text-center text-on-surface-variant">
                      No supply requests sent to Central Inventory yet. Click "+ New Supply Requisition" to submit a request.
                    </td>
                  </tr>
                ` : requisitions.map(pr => `
                  <tr class="hover:bg-surface-bright transition-colors">
                    <td class="py-3 px-4 font-data-mono font-black text-primary">${pr.prNumber}</td>
                    <td class="py-3 px-4 font-medium text-primary">
                      ${pr.items.map(i => `<span class="font-bold">${i.name}</span> (x${i.qty} ${i.unit})`).join(', ')}
                      <div class="text-[10px] text-on-surface-variant mt-0.5">${pr.justification || ''}</div>
                    </td>
                    <td class="py-3 px-4 font-data-mono text-xs font-semibold text-sky-700">
                      📍 ${pr.destination || 'Floor Pantries'}
                    </td>
                    <td class="py-3 px-4 text-on-surface-variant">${pr.requestedBy}</td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold font-data-mono ${
                        pr.urgency === 'Critical Par Breach' || pr.urgency === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-surface-container text-on-surface-variant'
                      }">
                        ${pr.urgency || 'Normal'}
                      </span>
                    </td>
                    <td class="py-3 px-4 font-data-mono font-bold text-primary">
                      $${(pr.totalAmount || 0).toFixed(2)}
                    </td>
                    <td class="py-3 px-4">
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-data-mono ${
                        pr.status.includes('Dispatched')
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : pr.status.includes('Pending')
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-sky-100 text-sky-800 border border-sky-200'
                      }">
                        ${pr.status}
                      </span>
                    </td>
                    <td class="py-3 px-4 font-data-mono text-[11px] text-on-surface-variant text-right">
                      ${pr.createdAt ? pr.createdAt.split(' ')[0] : 'Today'}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MODALS: REQUEST SUPPLIES FROM CENTRAL INVENTORY
  // ──────────────────────────────────────────────────────────────────────────
  renderRequestInventoryModal() {
    if (!this.activeRequestInventoryModal) return '';
    const inventory = store.getLinenInventory();

    const amenityItems = inventory.bathroomAmenities.map(a => ({
      id: a.id,
      name: a.name,
      category: 'Amenities',
      unit: a.unit,
      stock: a.stockAvailable
    }));
    const towelItems = inventory.towels.map(t => ({
      id: t.id,
      name: t.name,
      category: 'Towels',
      unit: t.unit,
      stock: t.cleanInPantries
    }));
    const linenItems = inventory.bedLinens.map(b => ({
      id: b.id,
      name: b.name,
      category: 'Bed Linens',
      unit: b.unit,
      stock: b.cleanInPantries
    }));

    const preselected = this.preselectedRequisitionItemId || (amenityItems[0] ? amenityItems[0].id : '');

    return `
      <div class="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[22px] text-primary">inventory_2</span>
              <div>
                <h3 class="font-headline-sm text-base font-bold text-primary">Request Supplies from Central Inventory</h3>
                <p class="text-[11px] text-on-surface-variant">Sends an official Material Requisition to the Central Warehouse / Stores</p>
              </div>
            </div>
            <button id="btn-close-request-inventory" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <form id="form-request-inventory" class="p-6 space-y-3.5 text-xs overflow-y-auto custom-scrollbar">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Select Required Item *</label>
              <select id="sel-req-item" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary font-bold outline-none cursor-pointer">
                <optgroup label="🧼 Bathroom Consumables & Amenities">
                  ${amenityItems.map(a => `
                    <option value="${a.id}" data-category="Amenities" data-name="${a.name}" data-unit="${a.unit}" ${a.id === preselected ? 'selected' : ''}>
                      ${a.name} (Pantry Stock: ${a.stock} ${a.unit})
                    </option>
                  `).join('')}
                </optgroup>
                <optgroup label="🛁 Towels & Terry Cloths">
                  ${towelItems.map(t => `
                    <option value="${t.id}" data-category="Towels" data-name="${t.name}" data-unit="${t.unit}" ${t.id === preselected ? 'selected' : ''}>
                      ${t.name} (Clean: ${t.stock} ${t.unit})
                    </option>
                  `).join('')}
                </optgroup>
                <optgroup label="🛏️ Bed Linens & Pillows">
                  ${linenItems.map(b => `
                    <option value="${b.id}" data-category="Bed Linens" data-name="${b.name}" data-unit="${b.unit}" ${b.id === preselected ? 'selected' : ''}>
                      ${b.name} (Clean: ${b.stock} ${b.unit})
                    </option>
                  `).join('')}
                </optgroup>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Quantity Needed *</label>
                <input type="number" id="input-req-qty" value="50" min="5" step="5" required class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary font-bold font-data-mono outline-none" />
              </div>

              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Urgency / Priority *</label>
                <select id="sel-req-urgency" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary outline-none cursor-pointer">
                  <option value="Normal">Normal (Routine 24h restock)</option>
                  <option value="High">High (Impending stockout - 4h)</option>
                  <option value="Critical Par Breach">Critical Par Breach (Immediate)</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Destination Floor / Pantry *</label>
                <select id="sel-req-destination" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary outline-none cursor-pointer font-medium">
                  <option value="Floor 4 Service Pantry">Floor 4 Service Pantry</option>
                  <option value="Floor 2 Service Pantry">Floor 2 Service Pantry</option>
                  <option value="Floor 3 Service Pantry">Floor 3 Service Pantry</option>
                  <option value="Floor 5 Service Pantry">Floor 5 Service Pantry</option>
                  <option value="Floor 6 Penthouse Butler Station">Floor 6 Penthouse Butler Station</option>
                  <option value="Central HK Depot / Floor 1 Linen Room">Central HK Depot / Linen Room</option>
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Requested By *</label>
                <input type="text" id="input-req-by" value="Victoria S. (Executive Housekeeper)" required class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary font-bold outline-none" />
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Justification / Operational Note</label>
              <input type="text" id="input-req-justification" placeholder="e.g., Weekend arrival rush & VIP room prep" value="Pantry restock before weekend arrival turnover peak" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary outline-none" />
            </div>

            <div class="p-3 rounded-xl bg-sky-50/80 border border-sky-200/80 text-sky-900 text-[11px] flex items-start gap-2">
              <span class="material-symbols-outlined text-[17px] text-sky-700 shrink-0 mt-0.5">info</span>
              <div>
                Submitting this requisition will route to the <strong>Multi-Store Inventory & Automated Procurement SCM Hub</strong> where Store Management reviews stock and issues the items to your floor pantry.
              </div>
            </div>

            <div class="pt-3 border-t border-outline-variant flex items-center justify-end gap-2">
              <button type="button" id="btn-cancel-request-inventory" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">send</span>
                <span>Send Requisition to Inventory</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MODALS: MANUAL ROOM ENTRY
  // ──────────────────────────────────────────────────────────────────────────
  renderLogRoomLinenModal() {
    if (!this.activeLogRoomModal) return '';
    const rooms = store.state.rooms || [];

    return `
      <div class="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px] text-primary">edit_note</span>
              <h3 class="font-headline-sm text-base font-bold text-primary">Log Room Linen & Amenities Entry</h3>
            </div>
            <button id="btn-close-log-room" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <form id="form-log-room-linen" class="p-6 space-y-3.5 text-xs overflow-y-auto custom-scrollbar">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Room Number *</label>
                <select id="sel-log-room-id" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary font-bold outline-none cursor-pointer">
                  ${rooms.map(r => `
                    <option value="${r.roomNumber || r.id}">Room #${r.roomNumber || r.id} (${r.type})</option>
                  `).join('')}
                </select>
              </div>

              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Turnover Clean Type *</label>
                <select id="sel-log-clean-type" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary outline-none cursor-pointer">
                  <option value="Departure Turnover (Full Strip)">Departure Turnover (Full Strip)</option>
                  <option value="Daily Stayover Refresh">Daily Stayover Refresh</option>
                  <option value="VIP Turndown & Linen Refresh">VIP Turndown & Linen Refresh</option>
                  <option value="Custom Service">Custom Service</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Attendant Name *</label>
              <input type="text" id="input-log-attendant" placeholder="Attendant Name" value="Maria Santos" required class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-primary font-bold outline-none" />
            </div>

            <!-- Towels Counts -->
            <div class="p-3 rounded-xl bg-sky-50/60 border border-sky-200/80 space-y-2">
              <div class="text-sky-900 font-bold">Towels Replaced (Units)</div>
              <div class="grid grid-cols-4 gap-2">
                <div>
                  <label class="block text-[9px] font-bold text-sky-900 font-data-mono uppercase">Bath</label>
                  <input type="number" id="input-add-bath-towels" min="0" value="4" class="w-full py-1.5 px-2 rounded-lg border border-sky-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-sky-900 font-data-mono uppercase">Hand</label>
                  <input type="number" id="input-add-hand-towels" min="0" value="2" class="w-full py-1.5 px-2 rounded-lg border border-sky-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-sky-900 font-data-mono uppercase">Face</label>
                  <input type="number" id="input-add-washcloths" min="0" value="2" class="w-full py-1.5 px-2 rounded-lg border border-sky-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-sky-900 font-data-mono uppercase">Mat</label>
                  <input type="number" id="input-add-bath-mats" min="0" value="1" class="w-full py-1.5 px-2 rounded-lg border border-sky-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
              </div>
            </div>

            <!-- Sheets Counts -->
            <div class="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200/80 space-y-2">
              <div class="text-indigo-900 font-bold">Bedding Replaced (Units)</div>
              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="block text-[9px] font-bold text-indigo-900 font-data-mono uppercase">Fitted Sheet</label>
                  <input type="number" id="input-add-fitted-sheets" min="0" value="1" class="w-full py-1.5 px-2 rounded-lg border border-indigo-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-indigo-900 font-data-mono uppercase">Duvet Cover</label>
                  <input type="number" id="input-add-duvet-covers" min="0" value="1" class="w-full py-1.5 px-2 rounded-lg border border-indigo-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-indigo-900 font-data-mono uppercase">Pillowcases</label>
                  <input type="number" id="input-add-pillowcases" min="0" value="4" class="w-full py-1.5 px-2 rounded-lg border border-indigo-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
              </div>
            </div>

            <!-- Toiletries Counts -->
            <div class="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
              <div class="text-emerald-900 font-bold">Toiletries Replaced (Units)</div>
              <div class="grid grid-cols-4 gap-2">
                <div>
                  <label class="block text-[9px] font-bold text-emerald-900 font-data-mono uppercase">Shampoo</label>
                  <input type="number" id="input-add-shampoo" min="0" value="2" class="w-full py-1.5 px-2 rounded-lg border border-emerald-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-emerald-900 font-data-mono uppercase">Conditioner</label>
                  <input type="number" id="input-add-conditioner" min="0" value="2" class="w-full py-1.5 px-2 rounded-lg border border-emerald-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-emerald-900 font-data-mono uppercase">Body Wash</label>
                  <input type="number" id="input-add-bodywash" min="0" value="2" class="w-full py-1.5 px-2 rounded-lg border border-emerald-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
                <div>
                  <label class="block text-[9px] font-bold text-emerald-900 font-data-mono uppercase">Soap</label>
                  <input type="number" id="input-add-soap" min="0" value="2" class="w-full py-1.5 px-2 rounded-lg border border-emerald-300 bg-white font-data-mono font-bold text-center text-xs outline-none" />
                </div>
              </div>
            </div>

            <div class="pt-3 border-t border-outline-variant flex items-center justify-end gap-2">
              <button type="button" id="btn-cancel-log-room" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
              <button type="submit" class="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition-all">
                Save & Deduct Stock
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // EVENT BINDINGS
  // ──────────────────────────────────────────────────────────────────────────
  bindEvents() {
    if (!this.container) return;

    // Tabs
    this.container.querySelectorAll('.btn-linen-tab').forEach(btn => {
      btn.onclick = () => {
        this.activeTab = btn.dataset.tab;
        this.renderContent();
      };
    });

    // ── EDIT CONSUMPTION LOG ROW ───────────────────────────────────────────
    this.container.querySelectorAll('.btn-edit-consumption-log').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        this.editingLogId = btn.dataset.id;
        this.renderContent();
      };
    });

    // Delete consumption log row
    this.container.querySelectorAll('.btn-delete-consumption-log').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const logId = btn.dataset.id;
        if (confirm('Are you sure you want to remove this turnover consumption entry from the audit log?')) {
          store.deleteRoomLinenConsumptionLog(logId);
          this.renderContent();
        }
      };
    });

    // Direct delete from modal
    const btnDeleteDirect = this.container.querySelector('#btn-delete-log-direct');
    if (btnDeleteDirect) {
      btnDeleteDirect.onclick = () => {
        const logId = btnDeleteDirect.dataset.id;
        if (confirm('Are you sure you want to remove this turnover entry?')) {
          store.deleteRoomLinenConsumptionLog(logId);
          this.editingLogId = null;
          this.renderContent();
        }
      };
    }

    // Close / Cancel Edit Log Modal
    const btnCloseEditLog = this.container.querySelector('#btn-close-edit-log');
    if (btnCloseEditLog) {
      btnCloseEditLog.onclick = () => {
        this.editingLogId = null;
        this.renderContent();
      };
    }
    const btnCancelEditLog = this.container.querySelector('#btn-cancel-edit-log');
    if (btnCancelEditLog) {
      btnCancelEditLog.onclick = () => {
        this.editingLogId = null;
        this.renderContent();
      };
    }

    // Submit Edit Consumption Log Form
    const formEditLog = this.container.querySelector('#form-edit-consumption-log');
    if (formEditLog) {
      formEditLog.onsubmit = (e) => {
        e.preventDefault();
        const cleanType = this.container.querySelector('#input-edit-log-clean-type').value;
        const attendant = this.container.querySelector('#input-edit-log-attendant').value.trim();
        const notes = this.container.querySelector('#input-edit-log-notes').value.trim();

        const bathTowels = Number(this.container.querySelector('#input-edit-log-bath-towels').value) || 0;
        const handTowels = Number(this.container.querySelector('#input-edit-log-hand-towels').value) || 0;
        const washcloths = Number(this.container.querySelector('#input-edit-log-washcloths').value) || 0;
        const bathMats = Number(this.container.querySelector('#input-edit-log-bath-mats').value) || 0;

        const fittedSheets = Number(this.container.querySelector('#input-edit-log-fitted-sheets').value) || 0;
        const duvetCovers = Number(this.container.querySelector('#input-edit-log-duvet-covers').value) || 0;
        const pillowcases = Number(this.container.querySelector('#input-edit-log-pillowcases').value) || 0;

        const shampoo = Number(this.container.querySelector('#input-edit-log-shampoo').value) || 0;
        const conditioner = Number(this.container.querySelector('#input-edit-log-conditioner').value) || 0;
        const bodyWash = Number(this.container.querySelector('#input-edit-log-bodywash').value) || 0;
        const soap = Number(this.container.querySelector('#input-edit-log-soap').value) || 0;
        const dentalKit = Number(this.container.querySelector('#input-edit-log-dental').value) || 0;
        const shavingKit = Number(this.container.querySelector('#input-edit-log-shaving').value) || 0;
        const vanityKit = Number(this.container.querySelector('#input-edit-log-vanity').value) || 0;

        store.updateRoomLinenConsumptionLog(this.editingLogId, {
          cleanType,
          attendant,
          notes,
          towelsChanged: { bathTowels, handTowels, washcloths, bathMats },
          sheetsChanged: { fittedSheets, duvetCovers, pillowcases },
          amenitiesRefilled: { shampoo, conditioner, bodyWash, soap, dentalKit, shavingKit, vanityKit }
        });

        this.editingLogId = null;
        this.renderContent();
      };
    }

    // ── EDIT LINEN INVENTORY / PAR MODAL ───────────────────────────────────
    this.container.querySelectorAll('.btn-edit-linen-item').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        this.editingInventoryCategory = btn.dataset.category;
        this.editingInventoryItemId = btn.dataset.id;
        this.renderContent();
      };
    });

    const btnCloseEditInv = this.container.querySelector('#btn-close-edit-inventory');
    if (btnCloseEditInv) {
      btnCloseEditInv.onclick = () => {
        this.editingInventoryItemId = null;
        this.editingInventoryCategory = null;
        this.renderContent();
      };
    }
    const btnCancelEditInv = this.container.querySelector('#btn-cancel-edit-inventory');
    if (btnCancelEditInv) {
      btnCancelEditInv.onclick = () => {
        this.editingInventoryItemId = null;
        this.editingInventoryCategory = null;
        this.renderContent();
      };
    }

    const formEditInv = this.container.querySelector('#form-edit-inventory');
    if (formEditInv) {
      formEditInv.onsubmit = (e) => {
        e.preventDefault();
        const parLevel = Number(this.container.querySelector('#input-edit-par-level').value) || 100;
        const cleanInPantries = Number(this.container.querySelector('#input-edit-clean-pantries').value) || 0;
        const dirtyAwaitingLaundry = Number(this.container.querySelector('#input-edit-dirty-laundry').value) || 0;
        const inLaundryCycle = Number(this.container.querySelector('#input-edit-in-wash').value) || 0;

        store.updateLinenInventoryItem(this.editingInventoryCategory, this.editingInventoryItemId, {
          parLevel,
          cleanInPantries,
          dirtyAwaitingLaundry,
          inLaundryCycle
        });

        this.editingInventoryItemId = null;
        this.editingInventoryCategory = null;
        this.renderContent();
      };
    }

    // ── EDIT AMENITY STOCK MODAL ──────────────────────────────────────────
    this.container.querySelectorAll('.btn-edit-amenity-item').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        this.editingAmenityId = btn.dataset.id;
        this.renderContent();
      };
    });

    const btnCloseEditAmenity = this.container.querySelector('#btn-close-edit-amenity');
    if (btnCloseEditAmenity) {
      btnCloseEditAmenity.onclick = () => {
        this.editingAmenityId = null;
        this.renderContent();
      };
    }
    const btnCancelEditAmenity = this.container.querySelector('#btn-cancel-edit-amenity');
    if (btnCancelEditAmenity) {
      btnCancelEditAmenity.onclick = () => {
        this.editingAmenityId = null;
        this.renderContent();
      };
    }

    const formEditAmenity = this.container.querySelector('#form-edit-amenity');
    if (formEditAmenity) {
      formEditAmenity.onsubmit = (e) => {
        e.preventDefault();
        const stockAvailable = Number(this.container.querySelector('#input-edit-amenity-stock').value) || 0;
        const minThreshold = Number(this.container.querySelector('#input-edit-amenity-min').value) || 0;
        const consumedToday = Number(this.container.querySelector('#input-edit-amenity-consumed').value) || 0;

        store.updateLinenInventoryItem('bathroomAmenities', this.editingAmenityId, {
          stockAvailable,
          minThreshold,
          consumedToday
        });

        this.editingAmenityId = null;
        this.renderContent();
      };
    }

    // ── SEND LAUNDRY MODAL ────────────────────────────────────────────────
    const btnOpenSend = this.container.querySelector('#btn-open-send-laundry') || this.container.querySelector('#btn-tab-send-laundry');
    if (btnOpenSend) {
      btnOpenSend.onclick = () => {
        this.activeSendLaundryModal = true;
        this.renderContent();
      };
    }
    const btnTabSend = this.container.querySelector('#btn-tab-send-laundry');
    if (btnTabSend) {
      btnTabSend.onclick = () => {
        this.activeSendLaundryModal = true;
        this.renderContent();
      };
    }

    const btnCloseSend = this.container.querySelector('#btn-close-send-laundry');
    if (btnCloseSend) {
      btnCloseSend.onclick = () => {
        this.activeSendLaundryModal = false;
        this.renderContent();
      };
    }
    const btnCancelSend = this.container.querySelector('#btn-cancel-send-laundry');
    if (btnCancelSend) {
      btnCancelSend.onclick = () => {
        this.activeSendLaundryModal = false;
        this.renderContent();
      };
    }

    const formSend = this.container.querySelector('#form-send-laundry');
    if (formSend) {
      formSend.onsubmit = (e) => {
        e.preventDefault();
        const piecesCount = Number(this.container.querySelector('#input-laundry-pieces').value) || 50;
        const breakdown = this.container.querySelector('#input-laundry-breakdown').value.trim();
        const weightKg = Number(this.container.querySelector('#input-laundry-weight').value) || 30;
        const vendor = this.container.querySelector('#sel-laundry-vendor').value;

        store.sendLinensToLaundry({ piecesCount, breakdown, weightKg, vendor });
        this.activeSendLaundryModal = false;
        this.renderContent();
      };
    }

    // ── RECEIVE LAUNDRY BATCH ─────────────────────────────────────────────
    this.container.querySelectorAll('.btn-receive-batch').forEach(btn => {
      btn.onclick = () => {
        const batchId = btn.dataset.id;
        store.receiveCleanLinenBatch(batchId);
        this.renderContent();
      };
    });

    // ── REQUEST REFILL / INVENTORY REQUISITION ────────────────────────────
    this.container.querySelectorAll('.btn-request-refill-amenity').forEach(btn => {
      btn.onclick = () => {
        this.preselectedRequisitionItemId = btn.dataset.id;
        this.activeRequestInventoryModal = true;
        this.renderContent();
      };
    });

    const btnOpenReq = this.container.querySelector('#btn-open-request-inventory') || this.container.querySelector('#btn-tab-request-inventory');
    if (btnOpenReq) {
      btnOpenReq.onclick = () => {
        this.preselectedRequisitionItemId = null;
        this.activeRequestInventoryModal = true;
        this.renderContent();
      };
    }
    const btnTabReq = this.container.querySelector('#btn-tab-request-inventory');
    if (btnTabReq) {
      btnTabReq.onclick = () => {
        this.preselectedRequisitionItemId = null;
        this.activeRequestInventoryModal = true;
        this.renderContent();
      };
    }

    const btnCloseReq = this.container.querySelector('#btn-close-request-inventory');
    if (btnCloseReq) {
      btnCloseReq.onclick = () => {
        this.activeRequestInventoryModal = false;
        this.preselectedRequisitionItemId = null;
        this.renderContent();
      };
    }
    const btnCancelReq = this.container.querySelector('#btn-cancel-request-inventory');
    if (btnCancelReq) {
      btnCancelReq.onclick = () => {
        this.activeRequestInventoryModal = false;
        this.preselectedRequisitionItemId = null;
        this.renderContent();
      };
    }

    const formReq = this.container.querySelector('#form-request-inventory');
    if (formReq) {
      formReq.onsubmit = (e) => {
        e.preventDefault();
        const selItem = this.container.querySelector('#sel-req-item');
        const selectedOpt = selItem ? selItem.selectedOptions[0] : null;
        const itemId = selItem ? selItem.value : '';
        const itemName = selectedOpt ? selectedOpt.dataset.name : '';
        const category = selectedOpt ? selectedOpt.dataset.category : 'Amenities';
        const unit = selectedOpt ? selectedOpt.dataset.unit : 'pcs';

        const quantity = Number(this.container.querySelector('#input-req-qty').value) || 50;
        const urgency = this.container.querySelector('#sel-req-urgency').value;
        const destination = this.container.querySelector('#sel-req-destination').value;
        const requestedBy = this.container.querySelector('#input-req-by').value;
        const justification = this.container.querySelector('#input-req-justification').value;

        store.requestSuppliesFromInventory({
          category,
          itemId,
          itemName,
          quantity,
          unit,
          destination,
          urgency,
          requestedBy,
          justification
        });

        this.activeRequestInventoryModal = false;
        this.preselectedRequisitionItemId = null;
        this.activeTab = 'REQUISITIONS';
        this.renderContent();
      };
    }

    // ── SWITCH TO INVENTORY & PROCUREMENT HUB ─────────────────────────────
    const btnGoToInv = this.container.querySelector('#btn-go-to-inventory-module');
    if (btnGoToInv) {
      btnGoToInv.onclick = () => {
        store.setNavTab('procurement');
        store.setInterfaceMode('web_hms');
      };
    }

    // ── LOG MANUAL ROOM LINEN MODAL ───────────────────────────────────────
    const btnOpenLog = this.container.querySelector('#btn-open-log-room-linen') || this.container.querySelector('#btn-tab-log-room-linen');
    if (btnOpenLog) {
      btnOpenLog.onclick = () => {
        this.activeLogRoomModal = true;
        this.renderContent();
      };
    }
    const btnTabLog = this.container.querySelector('#btn-tab-log-room-linen');
    if (btnTabLog) {
      btnTabLog.onclick = () => {
        this.activeLogRoomModal = true;
        this.renderContent();
      };
    }

    const btnCloseLog = this.container.querySelector('#btn-close-log-room');
    if (btnCloseLog) {
      btnCloseLog.onclick = () => {
        this.activeLogRoomModal = false;
        this.renderContent();
      };
    }
    const btnCancelLog = this.container.querySelector('#btn-cancel-log-room');
    if (btnCancelLog) {
      btnCancelLog.onclick = () => {
        this.activeLogRoomModal = false;
        this.renderContent();
      };
    }

    const formLogRoom = this.container.querySelector('#form-log-room-linen');
    if (formLogRoom) {
      formLogRoom.onsubmit = (e) => {
        e.preventDefault();
        const roomId = this.container.querySelector('#sel-log-room-id').value;
        const cleanType = this.container.querySelector('#sel-log-clean-type').value;
        const attendant = this.container.querySelector('#input-log-attendant').value.trim();

        const bathTowels = Number(this.container.querySelector('#input-add-bath-towels')?.value) || 4;
        const handTowels = Number(this.container.querySelector('#input-add-hand-towels')?.value) || 2;
        const washcloths = Number(this.container.querySelector('#input-add-washcloths')?.value) || 2;
        const bathMats = Number(this.container.querySelector('#input-add-bath-mats')?.value) || 1;

        const fittedSheets = Number(this.container.querySelector('#input-add-fitted-sheets')?.value) || 1;
        const duvetCovers = Number(this.container.querySelector('#input-add-duvet-covers')?.value) || 1;
        const pillowcases = Number(this.container.querySelector('#input-add-pillowcases')?.value) || 4;

        const shampoo = Number(this.container.querySelector('#input-add-shampoo')?.value) || 2;
        const conditioner = Number(this.container.querySelector('#input-add-conditioner')?.value) || 2;
        const bodyWash = Number(this.container.querySelector('#input-add-bodywash')?.value) || 2;
        const soap = Number(this.container.querySelector('#input-add-soap')?.value) || 2;

        store.recordRoomLinenTurnover(roomId, {
          cleanType,
          attendant,
          itemsChanged: {
            towelsChanged: { bathTowels, handTowels, washcloths, bathMats },
            sheetsChanged: { fittedSheets, duvetCovers, pillowcases },
            amenitiesRefilled: { shampoo, conditioner, bodyWash, soap }
          }
        });
        this.activeLogRoomModal = false;
        this.renderContent();
      };
    }
  }
}
