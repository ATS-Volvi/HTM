// ==========================================================================
// VOLVITECH HOSPITALITY OS — FOOD & BEVERAGE (F&B) MANAGEMENT SYSTEM
// Comprehensive Culinary Operations, Camp Catering Scaling Engine,
// Breakfast / Lunch / Dinner Sessions, Chefs Brigade, Menu & Ingredients
// ==========================================================================

import { store } from '../../state/store.js';
import { Toast } from '../../components/Toast.js';

export class FoodBeverageView {
  constructor() {
    this.container = null;
    this.activeTab = 'dashboard'; // 'dashboard' | 'meals' | 'menu' | 'chefs' | 'ingredients'
    this.selectedDayIndex = 2; // Default Tuesday (today)
    this.selectedMealType = 'Lunch'; // 'Breakfast' | 'Lunch' | 'Dinner'
    this.scalingPax = 240; // Default scaling headcount for active meal
    this.menuFilter = 'ALL';
    this.ingredientCategoryFilter = 'ALL';
    this.lowStockOnly = false;
    this.activeRecipeDrawer = null; // recipeId for BOM drawer
    this.showAddDishModal = false;
    this.showAddChefModal = false;
    this.showLogMealModal = false;
    this.showGrnModal = false;
    this.showIssueModal = false;
    this.selectedIngredientForModal = null;
    this._tickerInterval = null;
  }

  get state() {
    return store.state;
  }

  get fb() {
    return store.getFbState();
  }

  render() {
    const el = document.createElement('div');
    el.className = 'w-full animate-fade-in text-on-surface';
    this.container = el;
    this.renderContent();
    this._startSessionClock();
    return el;
  }

  _startSessionClock() {
    if (this._tickerInterval) clearInterval(this._tickerInterval);
    this._tickerInterval = setInterval(() => {
      const clockEl = this.container?.querySelector('#fb-service-countdown');
      if (clockEl) {
        clockEl.textContent = this._getServiceCountdown();
      }
    }, 1000);
  }

  _getServiceCountdown() {
    const now = new Date();
    // Simulate active Lunch service running until 15:00 (3:00 PM)
    const target = new Date();
    target.setHours(15, 0, 0, 0);
    let diff = target.getTime() - now.getTime();
    if (diff <= 0) {
      target.setHours(22, 30, 0, 0); // Next: Dinner service close
      diff = target.getTime() - now.getTime();
    }
    if (diff <= 0) diff = 3600000 * 2;
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    return `${String(hours).padStart(2, '0')}h : ${String(mins).padStart(2, '0')}m : ${String(secs).padStart(2, '0')}s`;
  }

  setTab(tab) {
    this.activeTab = tab;
    this.renderContent();
  }

  renderContent() {
    if (!this.container) return;

    const fb = this.fb;
    const activeSession = fb.mealSessions?.find(s => s.status === 'ACTIVE_SERVICE') || fb.mealSessions?.[1] || { title: 'Lunch Service', timeSlot: '12:00 PM – 03:00 PM' };
    const ramadanMode = fb.ramadanMode;

    const lowStockIngredients = (fb.ingredients || []).filter(i => i.stock <= i.minPar);

    this.container.innerHTML = `
      <!-- F&B Header with Live Operational Status -->
      <div class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/60 pb-5">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
              ramadanMode ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-primary/10 text-primary border border-primary/20'
            }">
              ${ramadanMode ? '🌙 Ramadan Catering Mode' : 'Culinary Operations & Camp Catering'}
            </span>
            <span class="text-xs text-on-surface-variant font-data-mono">• Grand Meridian Kitchens</span>
          </div>
          <h1 class="text-2xl font-headline-sm font-extrabold text-on-surface mt-1 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-28px">restaurant</span>
            Food & Beverage Management
          </h1>
          <p class="text-xs text-on-surface-variant mt-0.5">
            Real-time meal services, automated pax scaling, kitchen brigade, recipe BOMs and inventory control.
          </p>
        </div>

        <!-- Quick Live Session Pill & Action Controls -->
        <div class="flex items-center gap-2.5 flex-wrap">
          <div class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-container border border-outline-variant shadow-2xs">
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Live Active Service</div>
              <div class="text-xs font-extrabold text-emerald-800 font-data-mono flex items-center gap-1.5">
                <span>${activeSession.title}</span>
                <span class="text-on-surface-variant/40">•</span>
                <span id="fb-service-countdown" class="text-primary">${this._getServiceCountdown()}</span>
              </div>
            </div>
          </div>

          <button id="btn-toggle-ramadan" class="px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
            ramadanMode
              ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
              : 'border-outline-variant hover:bg-surface-container text-on-surface-variant'
          }" title="Toggle Ramadan Catering (Suhoor & Iftar)">
            <span class="material-symbols-outlined text-[16px]">${ramadanMode ? 'bedtime' : 'wb_sunny'}</span>
            ${ramadanMode ? 'Ramadan: ON' : 'Ramadan Mode'}
          </button>

          <button id="btn-quick-meal-scan" class="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95">
            <span class="material-symbols-outlined text-[16px]">qr_code_scanner</span>
            Record Meal Scan
          </button>
        </div>
      </div>

      <!-- Navigation Tabs Strip -->
      <div class="mb-6 flex items-center gap-1.5 border-b border-outline-variant overflow-x-auto custom-scrollbar pb-px">
        <button class="tab-btn px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
          this.activeTab === 'dashboard'
            ? 'border-primary text-primary bg-primary/5'
            : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/40'
        }" data-tab="dashboard">
          <span class="material-symbols-outlined text-[17px]">dashboard</span>
          Dashboard
        </button>

        <button class="tab-btn px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
          this.activeTab === 'meals'
            ? 'border-primary text-primary bg-primary/5'
            : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/40'
        }" data-tab="meals">
          <span class="material-symbols-outlined text-[17px]">table_restaurant</span>
          Meal Planning & Scaling Engine
          <span class="px-1.5 py-0.2 rounded text-[10px] bg-secondary/15 text-secondary font-data-mono">Camp Mode</span>
        </button>

        <button class="tab-btn px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
          this.activeTab === 'menu'
            ? 'border-primary text-primary bg-primary/5'
            : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/40'
        }" data-tab="menu">
          <span class="material-symbols-outlined text-[17px]">menu_book</span>
          Menu & Recipes (BOM)
          <span class="px-1.5 py-0.2 rounded text-[10px] bg-surface-container text-on-surface-variant font-data-mono">${(fb.menuDishes || []).length}</span>
        </button>

        <button class="tab-btn px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
          this.activeTab === 'chefs'
            ? 'border-primary text-primary bg-primary/5'
            : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/40'
        }" data-tab="chefs">
          <span class="material-symbols-outlined text-[17px]">skillet</span>
          Chefs & Kitchen Brigade
          <span class="px-1.5 py-0.2 rounded text-[10px] bg-emerald-100 text-emerald-800 font-data-mono">${(fb.chefs || []).filter(c=>c.status==='ON_DUTY').length} On Duty</span>
        </button>

        <button class="tab-btn px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
          this.activeTab === 'ingredients'
            ? 'border-primary text-primary bg-primary/5'
            : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/40'
        }" data-tab="ingredients">
          <span class="material-symbols-outlined text-[17px]">inventory_2</span>
          Ingredients & Store Stock
          ${lowStockIngredients.length > 0 ? `<span class="px-1.5 py-0.2 rounded text-[10px] bg-red-100 text-red-700 font-bold font-data-mono animate-pulse">${lowStockIngredients.length} Low</span>` : ''}
        </button>
      </div>

      <!-- Tab Content Mount -->
      <div id="fb-tab-content">
        ${
          this.activeTab === 'dashboard' ? this._html_dashboard() :
          this.activeTab === 'meals' ? this._html_meals() :
          this.activeTab === 'menu' ? this._html_menu() :
          this.activeTab === 'chefs' ? this._html_chefs() :
          this._html_ingredients()
        }
      </div>

      <!-- Render Modals / Drawers if active -->
      ${this._html_modals()}
    `;

    this.bindEvents();
  }

  // =========================================================================
  // TAB 1: DASHBOARD
  // =========================================================================
  _html_dashboard() {
    const fb = this.fb;
    const sessions = fb.mealSessions || [];
    const totalPax = sessions.reduce((acc, s) => acc + (s.forecastPax || 0), 0);
    const totalServed = sessions.reduce((acc, s) => acc + (s.served || 0), 0);
    const totalOrdered = sessions.reduce((acc, s) => acc + (s.ordered || 0), 0);
    const onDutyChefs = (fb.chefs || []).filter(c => c.status === 'ON_DUTY').length;
    const lowStockCount = (fb.ingredients || []).filter(i => i.stock <= i.minPar).length;

    return `
      <div class="space-y-6 animate-fade-in">
        <!-- Top Executive KPI Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Total Projected Pax -->
          <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs">
            <div class="flex items-center justify-between text-on-surface-variant mb-2">
              <span class="text-xs font-bold uppercase tracking-wider">Total Daily Pax Forecast</span>
              <span class="p-2 rounded-xl bg-primary/10 text-primary">
                <span class="material-symbols-outlined text-[18px]">groups</span>
              </span>
            </div>
            <div class="text-2xl font-headline-sm font-extrabold text-on-surface">${totalPax} Pax</div>
            <div class="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+8.5% vs yesterday (185 BF • 240 LN • 310 DN)</span>
            </div>
          </div>

          <!-- Meals Service Completion -->
          <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs">
            <div class="flex items-center justify-between text-on-surface-variant mb-2">
              <span class="text-xs font-bold uppercase tracking-wider">Service Completion</span>
              <span class="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <span class="material-symbols-outlined text-[18px]">check_circle</span>
              </span>
            </div>
            <div class="text-2xl font-headline-sm font-extrabold text-emerald-700">${totalServed} / ${totalOrdered}</div>
            <div class="w-full bg-surface-container rounded-full h-1.5 mt-2 overflow-hidden">
              <div class="bg-emerald-500 h-full rounded-full" style="width: ${Math.round((totalServed / (totalOrdered || 1)) * 100)}%;"></div>
            </div>
            <div class="text-[11px] text-on-surface-variant mt-1.5 flex justify-between font-data-mono">
              <span>${Math.round((totalServed / (totalOrdered || 1)) * 100)}% Fulfilled</span>
              <span>10 No-shows</span>
            </div>
          </div>

          <!-- Food Cost % -->
          <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs">
            <div class="flex items-center justify-between text-on-surface-variant mb-2">
              <span class="text-xs font-bold uppercase tracking-wider">Aggregate Food Cost</span>
              <span class="p-2 rounded-xl bg-purple-100 text-purple-700">
                <span class="material-symbols-outlined text-[18px]">pie_chart</span>
              </span>
            </div>
            <div class="text-2xl font-headline-sm font-extrabold text-purple-700">26.8%</div>
            <div class="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">verified</span>
              <span>Optimal Margin (Target: &lt;30.0%)</span>
            </div>
          </div>

          <!-- Chefs On Duty & Par Alerts -->
          <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs">
            <div class="flex items-center justify-between text-on-surface-variant mb-2">
              <span class="text-xs font-bold uppercase tracking-wider">Kitchen Readiness</span>
              <span class="p-2 rounded-xl bg-amber-100 text-amber-700">
                <span class="material-symbols-outlined text-[18px]">skillet</span>
              </span>
            </div>
            <div class="text-2xl font-headline-sm font-extrabold text-on-surface">${onDutyChefs} Chefs Active</div>
            <div class="text-[11px] text-amber-700 font-semibold mt-1 flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">warning</span>
              <span>${lowStockCount} items at par reorder limit</span>
            </div>
          </div>
        </div>

        <!-- 3-Session Cards Strip (Breakfast, Lunch, Dinner) -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <h2 class="text-base font-bold text-on-surface">Daily Meal Sessions (Camp Catering Roster)</h2>
              <span class="text-xs text-on-surface-variant font-data-mono">Tuesday, 8 Sep 2026</span>
            </div>
            <button class="text-xs font-bold text-primary hover:underline flex items-center gap-1 btn-nav-meals">
              <span>Open Scaling & Planning Matrix</span>
              <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${sessions.map(s => {
              const isBreakfast = s.code === 'BREAKFAST';
              const isLunch = s.code === 'LUNCH';
              const isDinner = s.code === 'DINNER';

              const icon = isBreakfast ? 'wb_twilight' : isLunch ? 'wb_sunny' : 'nightlight';
              const statusBg = s.status === 'ACTIVE_SERVICE' ? 'bg-emerald-50 border-emerald-500/40 text-emerald-800' : s.status === 'COMPLETED' ? 'bg-surface-container text-on-surface-variant border-outline-variant' : 'bg-blue-50 border-blue-300 text-blue-800';
              const statusLabel = s.status === 'ACTIVE_SERVICE' ? '● LIVE SERVICE' : s.status === 'COMPLETED' ? '✓ COMPLETED' : '🕒 MISE EN PLACE';

              return `
                <div class="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs flex flex-col justify-between relative overflow-hidden ${s.status === 'ACTIVE_SERVICE' ? 'ring-2 ring-emerald-500/30' : ''}">
                  ${s.status === 'ACTIVE_SERVICE' ? '<div class="absolute top-0 right-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>' : ''}
                  <div>
                    <div class="flex items-center justify-between mb-3">
                      <div class="flex items-center gap-2">
                        <span class="p-2 rounded-xl bg-surface-container text-primary">
                          <span class="material-symbols-outlined text-[20px]">${icon}</span>
                        </span>
                        <div>
                          <div class="text-sm font-extrabold text-on-surface">${s.title}</div>
                          <div class="text-[11px] text-on-surface-variant font-data-mono">${s.timeSlot}</div>
                        </div>
                      </div>
                      <span class="px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusBg}">
                        ${statusLabel}
                      </span>
                    </div>

                    <div class="space-y-2 py-3 border-y border-outline-variant/40">
                      <div class="flex justify-between text-xs">
                        <span class="text-on-surface-variant">Forecast Headcount:</span>
                        <span class="font-extrabold text-on-surface font-data-mono">${s.forecastPax} Pax</span>
                      </div>
                      <div class="flex justify-between text-xs">
                        <span class="text-on-surface-variant">Meals Served:</span>
                        <span class="font-bold text-emerald-700 font-data-mono">${s.served} / ${s.ordered}</span>
                      </div>
                      <div class="flex justify-between text-xs">
                        <span class="text-on-surface-variant">Lead Kitchen Brigade:</span>
                        <span class="font-semibold text-on-surface truncate max-w-[160px]">${s.leadChef}</span>
                      </div>
                    </div>

                    <div class="mt-3">
                      <div class="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Planned Session Menu</div>
                      <div class="flex flex-wrap gap-1">
                        ${(s.dishesPlanned || []).map(d => `
                          <span class="px-2 py-0.5 rounded-md bg-surface-container text-[10px] text-on-surface font-medium">${d}</span>
                        `).join('')}
                      </div>
                    </div>
                  </div>

                  <div class="mt-4 pt-3 border-t border-outline-variant/30 flex items-center gap-2">
                    <button class="btn-open-session-scaling flex-1 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer" data-meal="${s.code === 'BREAKFAST' ? 'Breakfast' : s.code === 'LUNCH' ? 'Lunch' : 'Dinner'}" data-pax="${s.forecastPax}">
                      <span class="material-symbols-outlined text-[14px]">calculate</span>
                      Scale Ingredients
                    </button>
                    <button class="btn-record-meal-quick py-1.5 px-3 rounded-lg border border-outline-variant hover:border-primary text-xs font-bold transition-all text-on-surface-variant hover:text-primary cursor-pointer" data-meal="${s.code === 'BREAKFAST' ? 'Breakfast' : s.code === 'LUNCH' ? 'Lunch' : 'Dinner'}">
                      Log Service
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Two Column Section: Recent Meal Collections Log & Low Stock Pantry Alerts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Live Service Attendance Logbook -->
          <div class="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-sm font-extrabold text-on-surface flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary text-[18px]">receipt_long</span>
                  Recent Meal Distribution & QR Scans
                </h3>
                <p class="text-[11px] text-on-surface-variant">Live guest verification and in-room meal dispatch</p>
              </div>
              <button id="btn-dashboard-new-scan" class="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">add</span>
                Record Scan
              </button>
            </div>

            <div class="divide-y divide-outline-variant/40">
              ${(fb.mealLogs || []).slice(0, 6).map(l => `
                <div class="py-2.5 flex items-center justify-between text-xs">
                  <div class="flex items-center gap-3">
                    <span class="px-2 py-0.5 rounded bg-surface-container text-[10px] font-bold font-data-mono text-primary">
                      ${l.roomNumber}
                    </span>
                    <div>
                      <div class="font-bold text-on-surface">${l.guestName}</div>
                      <div class="text-[11px] text-on-surface-variant">${l.dishName} (${l.mealType})</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      ✓ ${l.status}
                    </span>
                    <div class="text-[10px] text-on-surface-variant font-data-mono mt-0.5">${l.timestamp}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Critical Low-Stock Par Watch -->
          <div class="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-sm font-extrabold text-on-surface flex items-center gap-2">
                  <span class="material-symbols-outlined text-red-500 text-[18px]">warning</span>
                  Pantry Stock Par Level Alerts
                </h3>
                <p class="text-[11px] text-on-surface-variant">Items below safety buffer threshold</p>
              </div>
              <button class="text-xs font-bold text-primary hover:underline btn-nav-ingredients">
                View All Ingredients
              </button>
            </div>

            <div class="space-y-3">
              ${(fb.ingredients || []).filter(i => i.stock <= i.minPar).map(i => {
                const deficit = +(i.minPar * 1.5 - i.stock).toFixed(1);
                return `
                  <div class="p-3 rounded-xl bg-red-50/40 border border-red-200 flex items-center justify-between gap-3">
                    <div>
                      <div class="text-xs font-bold text-on-surface">${i.name}</div>
                      <div class="text-[10px] text-on-surface-variant font-data-mono">
                        Current: <b class="text-red-600">${i.stock} ${i.unit}</b> • Min Par: ${i.minPar} ${i.unit} • Store: ${i.store}
                      </div>
                    </div>
                    <button class="btn-quick-requisition px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer" data-ingid="${i.id}" data-ingname="${i.name}" data-deficit="${deficit}" data-unit="${i.unit}" data-cost="${i.costPerUnit}">
                      + Order ${deficit} ${i.unit}
                    </button>
                  </div>
                `;
              }).join('')}

              ${(fb.ingredients || []).filter(i => i.stock <= i.minPar).length === 0 ? `
                <div class="text-center py-6 text-xs text-on-surface-variant">
                  <span class="material-symbols-outlined text-3xl text-emerald-500 block mb-1">check_circle</span>
                  All primary store ingredients are within optimal par levels.
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // TAB 2: MEAL PLANNING & SCALING ENGINE (CAMP MANAGEMENT FEATURES)
  // =========================================================================
  _html_meals() {
    const fb = this.fb;
    const days = fb.weeklyPlan || [];
    const currentDay = days.find(d => d.dayIndex === this.selectedDayIndex) || days[2];
    const ramadanMode = fb.ramadanMode;

    const allDishes = fb.menuDishes || [];

    // Filter dishes for selected meal type
    const activeDishIds = this.selectedMealType.toLowerCase() === 'breakfast'
      ? currentDay.breakfastDishes
      : this.selectedMealType.toLowerCase() === 'lunch'
      ? currentDay.lunchDishes
      : currentDay.dinnerDishes;

    const sessionDishes = (activeDishIds || []).map(id => allDishes.find(d => d.id === id)).filter(Boolean);

    // Scaling calculation: aggregate all ingredients across the session dishes for headcount this.scalingPax
    const scaledIngredientsMap = {};
    sessionDishes.forEach(dish => {
      (dish.recipe || []).forEach(r => {
        const requiredQty = +(r.qty_per_person * this.scalingPax).toFixed(2);
        if (!scaledIngredientsMap[r.name]) {
          scaledIngredientsMap[r.name] = {
            name: r.name,
            ingredientId: r.ingredientId,
            unit: r.unit,
            totalQty: 0,
            dishes: []
          };
        }
        scaledIngredientsMap[r.name].totalQty += requiredQty;
        scaledIngredientsMap[r.name].dishes.push(dish.name);
      });
    });

    const scaledList = Object.values(scaledIngredientsMap).map(item => {
      const ingMaster = fb.ingredients?.find(i => i.id === item.ingredientId || i.name.toLowerCase().includes(item.name.toLowerCase()));
      const currentStock = ingMaster ? ingMaster.stock : 0;
      const unitCost = ingMaster ? ingMaster.costPerUnit : 5.0;
      const totalCost = +(item.totalQty * unitCost).toFixed(2);
      const isDeficit = currentStock < item.totalQty;
      const deficitQty = isDeficit ? +(item.totalQty - currentStock).toFixed(2) : 0;

      return {
        ...item,
        currentStock,
        unitCost,
        totalCost,
        isDeficit,
        deficitQty,
        store: ingMaster?.store || 'Main Pantry'
      };
    });

    const totalSessionCost = scaledList.reduce((sum, i) => sum + i.totalCost, 0);

    return `
      <div class="space-y-6 animate-fade-in">
        <!-- 7-Day Matrix Navigation Bar -->
        <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div class="text-[10px] font-bold tracking-wider text-primary uppercase font-data-mono">Camp Catering Schedule</div>
              <h2 class="text-base font-extrabold text-on-surface">Weekly Meal Configuration Matrix</h2>
            </div>
            <div class="flex items-center gap-2">
              <button id="btn-copy-day-plan" class="px-3 py-1.5 rounded-lg border border-outline-variant hover:border-primary text-xs font-bold text-on-surface-variant hover:text-primary transition-all flex items-center gap-1 cursor-pointer">
                <span class="material-symbols-outlined text-[15px]">content_copy</span>
                Clone Day Plan
              </button>
            </div>
          </div>

          <!-- Day Selection Pills -->
          <div class="grid grid-cols-2 sm:grid-cols-7 gap-2">
            ${days.map(d => {
              const isSelected = d.dayIndex === this.selectedDayIndex;
              const isToday = d.dayIndex === 2; // Tuesday
              return `
                <button class="btn-select-day p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-on-primary border-primary shadow-xs font-bold'
                    : 'bg-surface-container/50 hover:bg-surface-container border-outline-variant/60 text-on-surface'
                }" data-day="${d.dayIndex}">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-extrabold">${d.dayName}</span>
                    ${isToday ? `<span class="px-1.5 py-0.2 rounded text-[9px] ${isSelected ? 'bg-on-primary/20 text-on-primary' : 'bg-primary/10 text-primary font-bold'}">TODAY</span>` : ''}
                  </div>
                  <div class="text-[10px] opacity-80 mt-1 font-data-mono">
                    ${d.expectedPax.lunch} Pax LN
                  </div>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Meal Period Toggle (Breakfast, Lunch, Dinner) -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="inline-flex p-1 rounded-xl bg-surface-container border border-outline-variant w-fit">
            ${['Breakfast', 'Lunch', 'Dinner'].map(meal => {
              const isSelected = this.selectedMealType === meal;
              const icon = meal === 'Breakfast' ? 'wb_twilight' : meal === 'Lunch' ? 'wb_sunny' : 'nightlight';
              return `
                <button class="btn-select-meal-type px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }" data-meal="${meal}">
                  <span class="material-symbols-outlined text-[16px]">${icon}</span>
                  ${ramadanMode && meal === 'Breakfast' ? 'Suhoor' : ramadanMode && meal === 'Dinner' ? 'Iftar' : meal}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Live Headcount Slider & Input -->
          <div class="flex items-center gap-3 bg-surface-container-lowest p-2 px-4 rounded-xl border border-outline-variant">
            <span class="text-xs font-bold text-on-surface-variant">Forecast Headcount:</span>
            <div class="flex items-center gap-2">
              <input type="range" id="scaling-pax-range" min="50" max="600" step="10" value="${this.scalingPax}" class="w-28 sm:w-36 accent-primary cursor-pointer" />
              <div class="flex items-center gap-1">
                <input type="number" id="scaling-pax-input" value="${this.scalingPax}" min="10" max="1000" class="w-16 px-2 py-1 text-xs font-bold font-data-mono text-primary bg-surface-container rounded border border-outline-variant text-center" />
                <span class="text-xs font-bold font-data-mono text-on-surface">Pax</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Session Dishes Row -->
        <div class="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-sm font-extrabold text-on-surface flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-[18px]">restaurant_menu</span>
                ${currentDay.dayName} • Planned ${this.selectedMealType} Lineup (${sessionDishes.length} Dishes)
              </h3>
              <p class="text-[11px] text-on-surface-variant">These recipes are factored into the ingredient scaling engine below.</p>
            </div>
            <button id="btn-add-dish-to-session" class="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer">
              <span class="material-symbols-outlined text-[14px]">add</span>
              + Add Dish to ${this.selectedMealType}
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            ${sessionDishes.map(d => `
              <div class="p-3.5 rounded-xl bg-surface-container/40 border border-outline-variant/60 flex flex-col justify-between">
                <div>
                  <div class="flex items-start justify-between gap-2">
                    <div class="text-xs font-bold text-on-surface">${d.name}</div>
                    <span class="px-2 py-0.5 rounded text-[9px] font-bold bg-primary/10 text-primary font-data-mono">$${d.sellingPrice.toFixed(2)}</span>
                  </div>
                  <div class="text-[11px] text-on-surface-variant mt-1 line-clamp-2">${d.description}</div>
                  <div class="flex flex-wrap gap-1 mt-2">
                    ${(d.dietary || []).map(t => `
                      <span class="px-1.5 py-0.2 rounded bg-surface-container text-[9px] text-on-surface-variant">${t}</span>
                    `).join('')}
                  </div>
                </div>
                <div class="mt-3 pt-2 border-t border-outline-variant/30 flex items-center justify-between text-[10px] font-data-mono text-on-surface-variant">
                  <span>${(d.recipe || []).length} BOM Ingredients</span>
                  <button class="btn-inspect-recipe text-primary font-bold hover:underline cursor-pointer" data-dishid="${d.id}">View Recipe</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Automated Ration & Ingredient Scaling Table (The Camp Management Star Feature!) -->
        <div class="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800">
                  Automated Ration Calculator
                </span>
                <span class="text-xs font-data-mono text-on-surface-variant">Scaled for <b>${this.scalingPax} Pax</b></span>
              </div>
              <h3 class="text-base font-extrabold text-on-surface mt-1">Raw Ingredient Requirements & Stock Variance</h3>
              <p class="text-[11px] text-on-surface-variant">Calculated mathematically by aggregating dish recipe bill of materials for this session.</p>
            </div>

            <div class="flex items-center gap-2">
              <button id="btn-issue-scaled-stock" class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95">
                <span class="material-symbols-outlined text-[16px]">output</span>
                Issue Stock to Kitchen
              </button>
              <button id="btn-requisition-deficits" class="px-3.5 py-2 rounded-xl border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95">
                <span class="material-symbols-outlined text-[16px]">shopping_cart_checkout</span>
                Requisition Deficit Items
              </button>
            </div>
          </div>

          <!-- Scaling Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-outline-variant bg-surface-container text-[10px] font-bold tracking-wider text-on-surface-variant uppercase font-data-mono">
                  <th class="py-2.5 px-3">Ingredient</th>
                  <th class="py-2.5 px-3">Category / Store</th>
                  <th class="py-2.5 px-3 text-right">Qty Needed (${this.scalingPax} Pax)</th>
                  <th class="py-2.5 px-3 text-right">Pantry Stock on Hand</th>
                  <th class="py-2.5 px-3 text-center">Variance / Availability</th>
                  <th class="py-2.5 px-3 text-right">Est. Cost</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/40">
                ${scaledList.map(item => `
                  <tr class="hover:bg-surface-container/30 transition-colors ${item.isDeficit ? 'bg-red-50/20' : ''}">
                    <td class="py-3 px-3 font-bold text-on-surface">
                      <div>${item.name}</div>
                      <div class="text-[10px] text-on-surface-variant font-normal">Used in: ${item.dishes.join(', ')}</div>
                    </td>
                    <td class="py-3 px-3 text-on-surface-variant">
                      <span class="px-2 py-0.5 rounded bg-surface-container text-[10px] font-medium">${item.store}</span>
                    </td>
                    <td class="py-3 px-3 text-right font-extrabold font-data-mono text-primary">
                      ${item.totalQty.toFixed(2)} ${item.unit}
                    </td>
                    <td class="py-3 px-3 text-right font-bold font-data-mono text-on-surface">
                      ${item.currentStock.toFixed(2)} ${item.unit}
                    </td>
                    <td class="py-3 px-3 text-center">
                      ${item.isDeficit ? `
                        <span class="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold inline-flex items-center gap-1">
                          <span class="material-symbols-outlined text-[12px]">error</span>
                          Short by ${item.deficitQty} ${item.unit}
                        </span>
                      ` : `
                        <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold inline-flex items-center gap-1">
                          <span class="material-symbols-outlined text-[12px]">check</span>
                          Sufficient (Buffer: +${(item.currentStock - item.totalQty).toFixed(1)})
                        </span>
                      `}
                    </td>
                    <td class="py-3 px-3 text-right font-data-mono font-bold text-on-surface">
                      $${item.totalCost.toFixed(2)}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr class="border-t-2 border-outline-variant bg-surface-container-low font-bold">
                  <td colspan="2" class="py-3 px-3 text-on-surface">Total Session Ingredient Valuation</td>
                  <td colspan="3" class="py-3 px-3 text-right text-on-surface-variant font-data-mono">${scaledList.length} Raw Ingredients Total</td>
                  <td class="py-3 px-3 text-right font-data-mono font-extrabold text-primary text-sm">$${totalSessionCost.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // TAB 3: MENU & RECIPES (BOM)
  // =========================================================================
  _html_menu() {
    const fb = this.fb;
    let dishes = fb.menuDishes || [];

    if (this.menuFilter !== 'ALL') {
      dishes = dishes.filter(d => d.mealType.toUpperCase() === this.menuFilter.toUpperCase());
    }

    return `
      <div class="space-y-6 animate-fade-in">
        <!-- Filter Controls -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-2 flex-wrap">
            ${['ALL', 'BREAKFAST', 'LUNCH', 'DINNER'].map(filter => `
              <button class="btn-filter-menu px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                this.menuFilter === filter
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
              }" data-filter="${filter}">
                ${filter}
              </button>
            `).join('')}
          </div>

          <button id="btn-create-dish-open" class="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95">
            <span class="material-symbols-outlined text-[16px]">add</span>
            Create New Standard Recipe
          </button>
        </div>

        <!-- Dish Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${dishes.map(d => {
            const foodCostColor = d.foodCostPct <= 22 ? 'bg-emerald-100 text-emerald-800' : d.foodCostPct <= 30 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800';
            return `
              <div class="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs flex flex-col justify-between hover:border-primary/50 transition-all">
                <div>
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span class="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-surface-container text-on-surface-variant font-data-mono">${d.mealType}</span>
                      <h3 class="text-sm font-extrabold text-on-surface mt-1">${d.name}</h3>
                    </div>
                    <div class="text-right">
                      <div class="text-base font-extrabold text-primary font-data-mono">$${d.sellingPrice.toFixed(2)}</div>
                      <span class="px-2 py-0.5 rounded-full text-[9px] font-bold font-data-mono ${foodCostColor}">FC: ${d.foodCostPct}%</span>
                    </div>
                  </div>

                  <p class="text-xs text-on-surface-variant line-clamp-2 mb-3">${d.description}</p>

                  <div class="space-y-1.5 py-2.5 border-y border-outline-variant/40 text-xs font-data-mono">
                    <div class="flex justify-between">
                      <span class="text-on-surface-variant">Portion & Yield:</span>
                      <span class="text-on-surface font-semibold">${d.portionSize}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-on-surface-variant">Standard BOM Cost:</span>
                      <span class="text-on-surface font-semibold">$${d.standardCost.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-on-surface-variant">Lead Cooking Station:</span>
                      <span class="text-primary font-semibold truncate max-w-[150px]">${d.leadStation}</span>
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-1 mt-3">
                    ${(d.dietary || []).map(t => `
                      <span class="px-1.5 py-0.2 rounded bg-surface-container text-[9px] text-on-surface font-medium">${t}</span>
                    `).join('')}
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                  <span class="text-[10px] text-on-surface-variant font-data-mono">${(d.recipe || []).length} Ingredients</span>
                  <button class="btn-inspect-recipe px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-bold text-primary transition-all cursor-pointer" data-dishid="${d.id}">
                    Recipe BOM & Steps
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // TAB 4: CHEFS & KITCHEN BRIGADE
  // =========================================================================
  _html_chefs() {
    const fb = this.fb;
    const chefs = fb.chefs || [];

    return `
      <div class="space-y-6 animate-fade-in">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-base font-extrabold text-on-surface">Kitchen Brigade & Station Roster</h2>
            <p class="text-xs text-on-surface-variant">Staff assignments, certifications, and active shift readiness</p>
          </div>
          <button id="btn-add-chef-open" class="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95">
            <span class="material-symbols-outlined text-[16px]">person_add</span>
            Add Chef to Brigade
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          ${chefs.map(c => {
            const isOnDuty = c.status === 'ON_DUTY';
            const isOnBreak = c.status === 'ON_BREAK';
            const badgeClass = isOnDuty ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : isOnBreak ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-surface-container text-on-surface-variant border-outline-variant';
            const badgeLabel = isOnDuty ? 'ON DUTY' : isOnBreak ? 'ON BREAK' : 'OFF DUTY';

            return `
              <div class="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs flex flex-col justify-between">
                <div>
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-sm border border-primary/20">
                        ${c.avatarInitials}
                      </div>
                      <div>
                        <h3 class="text-xs font-extrabold text-on-surface">${c.name}</h3>
                        <div class="text-[10px] text-primary font-bold font-data-mono">${c.title}</div>
                      </div>
                    </div>
                    <span class="px-2 py-0.5 rounded-full border text-[9px] font-bold font-data-mono ${badgeClass}">${badgeLabel}</span>
                  </div>

                  <div class="space-y-2 py-3 border-y border-outline-variant/40 text-xs">
                    <div>
                      <span class="text-[10px] text-on-surface-variant uppercase font-bold">Assigned Station:</span>
                      <div class="text-on-surface font-semibold">${c.station}</div>
                    </div>
                    <div>
                      <span class="text-[10px] text-on-surface-variant uppercase font-bold">Shift Schedule:</span>
                      <div class="text-on-surface-variant font-data-mono text-[11px]">${c.shift}</div>
                    </div>
                    <div>
                      <span class="text-[10px] text-on-surface-variant uppercase font-bold">Culinary Specialty:</span>
                      <div class="text-on-surface-variant text-[11px]">${c.specialty}</div>
                    </div>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-outline-variant/30 flex items-center gap-2">
                  <button class="btn-toggle-chef-duty flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    isOnDuty
                      ? 'border-amber-400 text-amber-700 bg-amber-50 hover:bg-amber-100'
                      : 'border-emerald-500 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                  } cursor-pointer" data-chefid="${c.id}" data-current="${c.status}">
                    ${isOnDuty ? 'Set On Break' : 'Clock In / On Duty'}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // =========================================================================
  // TAB 5: INGREDIENTS & STORE INVENTORY
  // =========================================================================
  _html_ingredients() {
    const fb = this.fb;
    let items = fb.ingredients || [];

    if (this.ingredientCategoryFilter !== 'ALL') {
      items = items.filter(i => i.category.toUpperCase() === this.ingredientCategoryFilter.toUpperCase());
    }
    if (this.lowStockOnly) {
      items = items.filter(i => i.stock <= i.minPar);
    }

    const categories = ['ALL', 'Rice & Grains', 'Meat & Poultry', 'Dairy & Eggs', 'Vegetables', 'Spices & Condiments', 'Beverages & Oils', 'Miscellaneous'];
    const totalInventoryValue = (fb.ingredients || []).reduce((acc, i) => acc + (i.stock * i.costPerUnit), 0);

    return `
      <div class="space-y-6 animate-fade-in">
        <!-- Top Metrics & Controls -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-base font-extrabold text-on-surface">Central Pantry & Walk-in Store Inventory</h2>
            <div class="text-xs text-on-surface-variant font-data-mono">
              Total Stock Valuation: <b class="text-primary">$${totalInventoryValue.toFixed(2)}</b> • ${(fb.ingredients || []).length} Raw SKUs Tracked
            </div>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <button id="btn-toggle-low-stock" class="px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              this.lowStockOnly
                ? 'bg-red-600 text-white border-red-700 shadow-xs'
                : 'border-outline-variant hover:bg-surface-container text-on-surface-variant'
            }">
              <span class="material-symbols-outlined text-[15px] inline mr-1">warning</span>
              ${this.lowStockOnly ? 'Showing Low Stock Only' : 'Filter Low Stock Par'}
            </button>
            <button id="btn-receive-grn-open" class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95">
              <span class="material-symbols-outlined text-[16px]">input</span>
              Receive Goods (GRN)
            </button>
          </div>
        </div>

        <!-- Category Filter Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
          ${categories.map(cat => `
            <button class="btn-filter-ingredient px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              this.ingredientCategoryFilter.toUpperCase() === cat.toUpperCase()
                ? 'bg-primary text-on-primary shadow-2xs'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }" data-cat="${cat}">
              ${cat}
            </button>
          `).join('')}
        </div>

        <!-- Master Ingredients Table -->
        <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-outline-variant bg-surface-container text-[10px] font-bold tracking-wider text-on-surface-variant uppercase font-data-mono">
                <th class="py-3 px-3">SKU & Ingredient Name</th>
                <th class="py-3 px-3">Category</th>
                <th class="py-3 px-3">Storage Location</th>
                <th class="py-3 px-3 text-right">Unit Cost</th>
                <th class="py-3 px-3 text-right">Current Stock</th>
                <th class="py-3 px-3 text-right">Min Par Level</th>
                <th class="py-3 px-3 text-center">Status</th>
                <th class="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/40">
              ${items.map(i => {
                const isLow = i.stock <= i.minPar;
                const statusClass = isLow ? 'bg-red-100 text-red-700 border-red-300' : 'bg-emerald-100 text-emerald-800 border-emerald-300';
                const statusLabel = isLow ? 'PAR DEFICIT' : 'OPTIMAL';
                return `
                  <tr class="hover:bg-surface-container/30 transition-colors ${isLow ? 'bg-red-50/20' : ''}">
                    <td class="py-3 px-3 font-bold text-on-surface">
                      <div>${i.name}</div>
                      <div class="text-[10px] text-on-surface-variant font-data-mono">${i.sku}</div>
                    </td>
                    <td class="py-3 px-3 text-on-surface-variant">${i.category}</td>
                    <td class="py-3 px-3 text-on-surface font-medium">${i.store}</td>
                    <td class="py-3 px-3 text-right font-data-mono font-bold text-on-surface">
                      $${i.costPerUnit.toFixed(2)} / ${i.unit}
                    </td>
                    <td class="py-3 px-3 text-right font-extrabold font-data-mono ${isLow ? 'text-red-600' : 'text-primary'}">
                      ${i.stock.toFixed(1)} ${i.unit}
                    </td>
                    <td class="py-3 px-3 text-right font-data-mono text-on-surface-variant">
                      ${i.minPar} ${i.unit}
                    </td>
                    <td class="py-3 px-3 text-center">
                      <span class="px-2 py-0.5 rounded border text-[9px] font-bold font-data-mono ${statusClass}">
                        ${statusLabel}
                      </span>
                    </td>
                    <td class="py-3 px-3 text-right">
                      <div class="flex items-center justify-end gap-1">
                        <button class="btn-adjust-stock px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-xs font-bold text-primary transition-all cursor-pointer" data-ingid="${i.id}" data-action="in">
                          + GRN
                        </button>
                        <button class="btn-adjust-stock px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-xs font-bold text-amber-700 transition-all cursor-pointer" data-ingid="${i.id}" data-action="out">
                          - Issue
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

  // =========================================================================
  // MODALS & DRAWERS
  // =========================================================================
  _html_modals() {
    let output = '';

    // Recipe BOM Drawer
    if (this.activeRecipeDrawer) {
      const dish = this.fb.menuDishes?.find(d => d.id === this.activeRecipeDrawer);
      if (dish) {
        output += `
          <div class="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex justify-end animate-fade-in" id="recipe-drawer-backdrop">
            <div class="w-full max-w-md bg-surface-bright h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
              <div>
                <div class="flex items-start justify-between pb-4 border-b border-outline-variant">
                  <div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary font-data-mono">${dish.mealType}</span>
                    <h2 class="text-lg font-extrabold text-on-surface mt-1">${dish.name}</h2>
                    <div class="text-xs text-on-surface-variant font-data-mono">Selling Price: $${dish.sellingPrice.toFixed(2)} • BOM Cost: $${dish.standardCost.toFixed(2)}</div>
                  </div>
                  <button id="btn-close-recipe-drawer" class="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer">
                    <span class="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div class="py-4 space-y-4">
                  <div>
                    <h3 class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Recipe Bill of Materials (Per Portion)</h3>
                    <div class="divide-y divide-outline-variant/40 bg-surface-container-lowest rounded-xl border border-outline-variant p-3">
                      ${(dish.recipe || []).map(r => `
                        <div class="py-2 flex items-center justify-between text-xs">
                          <span class="font-bold text-on-surface">${r.name}</span>
                          <span class="font-data-mono text-primary font-bold">${r.qty_per_person} ${r.unit}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>

                  <div>
                    <h3 class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Standard Culinary Description</h3>
                    <p class="text-xs text-on-surface-variant bg-surface-container/40 p-3 rounded-xl">${dish.description}</p>
                  </div>

                  <div class="grid grid-cols-2 gap-3 text-xs font-data-mono">
                    <div class="p-3 rounded-xl bg-surface-container/40 border border-outline-variant/40">
                      <div class="text-on-surface-variant">Lead Station</div>
                      <div class="font-bold text-on-surface mt-0.5">${dish.leadStation}</div>
                    </div>
                    <div class="p-3 rounded-xl bg-surface-container/40 border border-outline-variant/40">
                      <div class="text-on-surface-variant">Prep Time</div>
                      <div class="font-bold text-on-surface mt-0.5">${dish.prepTimeMin} mins</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-outline-variant flex gap-2">
                <button id="btn-close-recipe-drawer-bottom" class="w-full py-2 rounded-xl bg-primary text-on-primary font-bold text-xs cursor-pointer">
                  Done
                </button>
              </div>
            </div>
          </div>
        `;
      }
    }

    // Record Meal Scan Modal
    if (this.showLogMealModal) {
      output += `
        <div class="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in" id="log-meal-backdrop">
          <div class="w-full max-w-md bg-surface-bright rounded-2xl shadow-2xl p-6 border border-outline-variant">
            <div class="flex items-center justify-between pb-3 border-b border-outline-variant mb-4">
              <h3 class="text-sm font-extrabold text-on-surface flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">qr_code_scanner</span>
                Record Meal Collection / Scan
              </h3>
              <button id="btn-close-log-meal" class="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <form id="form-record-meal" class="space-y-3.5 text-xs">
              <div>
                <label class="block font-bold text-on-surface mb-1">Guest Room Number</label>
                <input type="text" id="modal-meal-room" value="402" class="w-full p-2 rounded-lg bg-surface-container border border-outline-variant font-bold text-on-surface" required />
              </div>
              <div>
                <label class="block font-bold text-on-surface mb-1">Guest Name</label>
                <input type="text" id="modal-meal-guest" value="Mr. James Harrison" class="w-full p-2 rounded-lg bg-surface-container border border-outline-variant text-on-surface" required />
              </div>
              <div>
                <label class="block font-bold text-on-surface mb-1">Meal Service Period</label>
                <select id="modal-meal-type" class="w-full p-2 rounded-lg bg-surface-container border border-outline-variant text-on-surface font-bold">
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch" selected>Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>
              <div>
                <label class="block font-bold text-on-surface mb-1">Selected Dish</label>
                <select id="modal-meal-dish" class="w-full p-2 rounded-lg bg-surface-container border border-outline-variant text-on-surface font-bold">
                  ${(this.fb.menuDishes || []).map(d => `<option value="${d.name}">${d.name} (${d.mealType})</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="block font-bold text-on-surface mb-1">Number of Portions (Pax)</label>
                <input type="number" id="modal-meal-pax" value="1" min="1" max="10" class="w-full p-2 rounded-lg bg-surface-container border border-outline-variant font-bold text-on-surface" required />
              </div>

              <div class="pt-3 border-t border-outline-variant flex justify-end gap-2">
                <button type="button" id="btn-cancel-log-meal" class="px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant font-semibold cursor-pointer">Cancel</button>
                <button type="submit" class="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-bold cursor-pointer">Verify & Collect Meal</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }

    return output;
  }

  // =========================================================================
  // EVENT BINDINGS
  // =========================================================================
  bindEvents() {
    if (!this.container) return;

    // Tab buttons
    this.container.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setTab(btn.dataset.tab);
      });
    });

    // Dashboard quick buttons
    this.container.querySelector('#btn-toggle-ramadan')?.addEventListener('click', () => {
      store.toggleRamadanMode();
      this.renderContent();
    });

    this.container.querySelector('#btn-quick-meal-scan')?.addEventListener('click', () => {
      this.showLogMealModal = true;
      this.renderContent();
    });

    this.container.querySelector('#btn-dashboard-new-scan')?.addEventListener('click', () => {
      this.showLogMealModal = true;
      this.renderContent();
    });

    this.container.querySelectorAll('.btn-nav-meals').forEach(btn => {
      btn.addEventListener('click', () => this.setTab('meals'));
    });

    this.container.querySelectorAll('.btn-nav-ingredients').forEach(btn => {
      btn.addEventListener('click', () => this.setTab('ingredients'));
    });

    // Scaling headcount input and slider
    const slider = this.container.querySelector('#scaling-pax-range');
    const numInput = this.container.querySelector('#scaling-pax-input');
    if (slider && numInput) {
      slider.addEventListener('input', (e) => {
        this.scalingPax = parseInt(e.target.value, 10);
        this.renderContent();
      });
      numInput.addEventListener('change', (e) => {
        this.scalingPax = Math.max(10, parseInt(e.target.value, 10) || 100);
        this.renderContent();
      });
    }

    // Day selection in weekly matrix
    this.container.querySelectorAll('.btn-select-day').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedDayIndex = parseInt(btn.dataset.day, 10);
        this.renderContent();
      });
    });

    // Meal type selection in planner (Breakfast, Lunch, Dinner)
    this.container.querySelectorAll('.btn-select-meal-type').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedMealType = btn.dataset.meal;
        this.renderContent();
      });
    });

    // Session scaling button from dashboard cards
    this.container.querySelectorAll('.btn-open-session-scaling').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedMealType = btn.dataset.meal;
        this.scalingPax = parseInt(btn.dataset.pax, 10) || 200;
        this.setTab('meals');
      });
    });

    // Quick log service from dashboard card
    this.container.querySelectorAll('.btn-record-meal-quick').forEach(btn => {
      btn.addEventListener('click', () => {
        this.showLogMealModal = true;
        this.renderContent();
      });
    });

    // Clone day plan button
    this.container.querySelector('#btn-copy-day-plan')?.addEventListener('click', () => {
      const targetDay = (this.selectedDayIndex + 1) % 7;
      store.copyDayMealPlan(this.selectedDayIndex, targetDay);
      this.selectedDayIndex = targetDay;
      this.renderContent();
    });

    // Issue stock to kitchen from scaling table
    this.container.querySelector('#btn-issue-scaled-stock')?.addEventListener('click', () => {
      Toast.show({
        title: '✓ Stock Issued to Kitchen Line',
        message: `Rations for ${this.scalingPax} Pax (${this.selectedMealType}) deducted from Central Stores.`,
        type: 'success'
      });
    });

    // Requisition deficit items
    this.container.querySelector('#btn-requisition-deficits')?.addEventListener('click', () => {
      store.createGroceryRequisition([
        { name: 'Jumbo Tiger Prawns (U-15)', qty: 20, unit: 'kg', estCost: 1400 },
        { name: 'Lebanese Pure Sesame Tahini', qty: 10, unit: 'kg', estCost: 200 }
      ], `Auto-generated deficit requisition for ${this.selectedMealType} (${this.scalingPax} Pax).`);
      this.renderContent();
    });

    // Quick single-item requisition button from alert card
    this.container.querySelectorAll('.btn-quick-requisition').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.ingname;
        const deficit = parseFloat(btn.dataset.deficit);
        const unit = btn.dataset.unit;
        const cost = parseFloat(btn.dataset.cost);
        store.createGroceryRequisition([
          { name, qty: deficit, unit, estCost: deficit * cost }
        ], `Urgent par restock for ${name}`);
        this.renderContent();
      });
    });

    // Inspect recipe drawer
    this.container.querySelectorAll('.btn-inspect-recipe').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeRecipeDrawer = btn.dataset.dishid;
        this.renderContent();
      });
    });

    this.container.querySelector('#btn-close-recipe-drawer')?.addEventListener('click', () => {
      this.activeRecipeDrawer = null;
      this.renderContent();
    });
    this.container.querySelector('#btn-close-recipe-drawer-bottom')?.addEventListener('click', () => {
      this.activeRecipeDrawer = null;
      this.renderContent();
    });

    // Menu filters
    this.container.querySelectorAll('.btn-filter-menu').forEach(btn => {
      btn.addEventListener('click', () => {
        this.menuFilter = btn.dataset.filter;
        this.renderContent();
      });
    });

    // Chef duty toggles
    this.container.querySelectorAll('.btn-toggle-chef-duty').forEach(btn => {
      btn.addEventListener('click', () => {
        const chefId = btn.dataset.chefid;
        const curr = btn.dataset.current;
        const next = curr === 'ON_DUTY' ? 'ON_BREAK' : 'ON_DUTY';
        store.updateChefStatus(chefId, next);
        this.renderContent();
      });
    });

    // Ingredients filter buttons
    this.container.querySelectorAll('.btn-filter-ingredient').forEach(btn => {
      btn.addEventListener('click', () => {
        this.ingredientCategoryFilter = btn.dataset.cat;
        this.renderContent();
      });
    });

    this.container.querySelector('#btn-toggle-low-stock')?.addEventListener('click', () => {
      this.lowStockOnly = !this.lowStockOnly;
      this.renderContent();
    });

    // Adjust stock (GRN / Issue)
    this.container.querySelectorAll('.btn-adjust-stock').forEach(btn => {
      btn.addEventListener('click', () => {
        const ingId = btn.dataset.ingid;
        const action = btn.dataset.action;
        const delta = action === 'in' ? 10 : -5;
        store.adjustIngredientStock(ingId, delta, action === 'in' ? 'Supplier GRN' : 'Kitchen Issue');
        this.renderContent();
      });
    });

    // Modal close & submit
    this.container.querySelector('#btn-close-log-meal')?.addEventListener('click', () => {
      this.showLogMealModal = false;
      this.renderContent();
    });
    this.container.querySelector('#btn-cancel-log-meal')?.addEventListener('click', () => {
      this.showLogMealModal = false;
      this.renderContent();
    });

    this.container.querySelector('#form-record-meal')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const room = this.container.querySelector('#modal-meal-room').value;
      const guest = this.container.querySelector('#modal-meal-guest').value;
      const mealType = this.container.querySelector('#modal-meal-type').value;
      const dish = this.container.querySelector('#modal-meal-dish').value;
      const pax = parseInt(this.container.querySelector('#modal-meal-pax').value, 10) || 1;

      store.recordMealCollection({
        roomNumber: room,
        guestName: guest,
        mealType,
        dishName: dish,
        pax,
        verifiedBy: 'QR Scanner Station'
      });

      this.showLogMealModal = false;
      this.renderContent();
    });
  }
}
