// ==========================================================================
// VOLVITECH HOSPITALITY OS — FOOD & BEVERAGE (F&B) MANAGEMENT SYSTEM
// Comprehensive Culinary Operations, Camp Catering Scaling Engine,
// Breakfast / Lunch / Dinner Sessions, Chefs Brigade, Menu & Ingredients,
// and Autonomous AI Recipe & Ingredient Generator with Quantity Scaler
// ==========================================================================

import { store } from '../../state/store.js';
import { Toast } from '../../components/Toast.js';
import { AiRecipeGenerator, CULINARY_KNOWLEDGE_BASE } from '../../services/aiRecipeGenerator.js';

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

    // AI Recipe & Ingredient Generator State
    this.showAiRecipeModal = false;
    this.aiRecipeState = {
      dishName: 'Murgh Makhani (Butter Chicken)',
      mealType: 'Dinner',
      cuisine: 'Indian Regional',
      dietary: ['Halal', 'Gluten-Free'],
      targetPax: 1, // Portions headcount (settable: 1, 4, 10, 50, 100, 250, etc.)
      targetFoodCostPct: 28,
      chefNotes: '',
      viewMode: 'PER_PERSON', // 'PER_PERSON' (base 1 Pax) | 'BATCH' (scaled to targetPax)
      isGenerating: false,
      generatedRecipe: null,
      isEditingExisting: false,
      editingDishId: null,
      selectedPantryAddId: 'ing-rice-basmati',
      selectedPantryAddQty: 0.1
    };
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
            <span class="material-symbols-outlined text-primary text-[28px]">soup_kitchen</span>
            Food & Beverage Management System
          </h1>
          <p class="text-xs text-on-surface-variant mt-0.5">
            Executive Culinary Dashboard, Autonomous AI Recipe BOM Generator, Camp Ration Scaling Engine, and Kitchen Brigade.
          </p>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <!-- Ramadan Mode Switcher -->
          <button id="btn-toggle-ramadan" class="px-3 py-2 rounded-xl border border-outline-variant text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            ramadanMode ? 'bg-amber-500 text-white shadow-xs border-amber-600' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
          }">
            <span class="material-symbols-outlined text-[16px]">bedtime</span>
            ${ramadanMode ? 'Ramadan Active (Suhoor/Iftar)' : 'Enable Ramadan Mode'}
          </button>

          <!-- Quick AI Recipe Launch Button in Global Header -->
          <button id="btn-header-ai-recipe" class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95">
            <span class="material-symbols-outlined text-[16px] animate-spin-slow">auto_awesome</span>
            AI Recipe Generator
          </button>

          <!-- Quick Service Log / Scanner Button -->
          <button id="btn-quick-meal-scan" class="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95">
            <span class="material-symbols-outlined text-[16px]">qr_code_scanner</span>
            Record Meal Scan
          </button>
        </div>
      </div>

      <!-- Live Service Window Banner -->
      <div class="mb-6 p-4 rounded-2xl bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest to-primary/5 border border-outline-variant/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 font-data-mono">Live Active Service Window</span>
              <span class="px-2 py-0.2 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">${activeSession.title}</span>
            </div>
            <div class="text-base font-extrabold text-on-surface mt-0.5">${activeSession.title} (${activeSession.timeSlot})</div>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <div class="text-right">
            <div class="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider font-data-mono">Time Remaining in Service</div>
            <div id="fb-service-countdown" class="text-lg font-extrabold text-primary font-data-mono mt-0.5">
              ${this._getServiceCountdown()}
            </div>
          </div>

          <div class="border-l border-outline-variant/60 pl-6 text-right">
            <div class="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider font-data-mono">Current Station Lead</div>
            <div class="text-sm font-extrabold text-on-surface mt-0.5">${activeSession.chefLead || 'Tariq Al-Hassan'}</div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center gap-2 border-b border-outline-variant/60 mb-6 overflow-x-auto">
        <button class="tab-btn px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
          this.activeTab === 'dashboard'
            ? 'border-primary text-primary bg-primary/5'
            : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/40'
        }" data-tab="dashboard">
          <span class="material-symbols-outlined text-[17px]">analytics</span>
          F&B Dashboard
        </button>

        <button class="tab-btn px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
          this.activeTab === 'meals'
            ? 'border-primary text-primary bg-primary/5'
            : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/40'
        }" data-tab="meals">
          <span class="material-symbols-outlined text-[17px]">calculate</span>
          Meal Planning & Scaling Engine
          <span class="px-1.5 py-0.2 rounded text-[10px] bg-purple-100 text-purple-800 font-data-mono">Camp Rations</span>
        </button>

        <button class="tab-btn px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
          this.activeTab === 'menu'
            ? 'border-primary text-primary bg-primary/5'
            : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/40'
        }" data-tab="menu">
          <span class="material-symbols-outlined text-[17px]">menu_book</span>
          Menu & Recipes (BOM)
          <span class="px-1.5 py-0.2 rounded text-[10px] bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-data-mono font-bold">✨ AI Generator</span>
        </button>

        <button class="tab-btn px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
          this.activeTab === 'chefs'
            ? 'border-primary text-primary bg-primary/5'
            : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/40'
        }" data-tab="chefs">
          <span class="material-symbols-outlined text-[17px]">cooking</span>
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
              const pct = Math.round(((s.served || 0) / (s.ordered || 1)) * 100);
              const statusClass = s.status === 'COMPLETED' ? 'bg-surface-container text-on-surface-variant' :
                                  s.status === 'ACTIVE_SERVICE' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-blue-100 text-blue-800 border-blue-200';
              return `
                <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${statusClass}">
                        ${s.status.replace('_', ' ')}
                      </span>
                      <span class="text-xs font-data-mono text-on-surface-variant">${s.timeSlot}</span>
                    </div>
                    <h3 class="text-base font-extrabold text-on-surface">${s.title}</h3>
                    <div class="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                      <span class="material-symbols-outlined text-[14px]">person</span>
                      Lead: <span class="font-bold text-on-surface">${s.chefLead}</span>
                    </div>

                    <div class="mt-4 pt-3 border-t border-outline-variant/40 space-y-2">
                      <div class="flex justify-between text-xs">
                        <span class="text-on-surface-variant">Headcount Forecast:</span>
                        <span class="font-bold font-data-mono">${s.forecastPax} Pax</span>
                      </div>
                      <div class="flex justify-between text-xs">
                        <span class="text-on-surface-variant">Meal Vouchers Fulfilled:</span>
                        <span class="font-bold font-data-mono text-emerald-600">${s.served} / ${s.ordered} (${pct}%)</span>
                      </div>
                      <div class="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                        <div class="bg-primary h-full rounded-full" style="width: ${pct}%;"></div>
                      </div>
                    </div>
                  </div>

                  <div class="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                    <button class="btn-open-session-scaling text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer" data-meal="${s.code === 'BREAKFAST' ? 'Breakfast' : s.code === 'LUNCH' ? 'Lunch' : 'Dinner'}" data-pax="${s.forecastPax}">
                      <span class="material-symbols-outlined text-[14px]">tune</span>
                      Scale Ingredients
                    </button>
                    <button class="btn-record-meal-quick px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface cursor-pointer">
                      Scan Guest
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Two Column Section: Live Pantry Par Reorder Alerts & Recent Meal Scans -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Critical Par Alerts -->
          <div class="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-amber-600">notification_important</span>
                <h3 class="text-base font-extrabold text-on-surface">Central Pantry Low-Par Warnings</h3>
              </div>
              <button class="text-xs font-bold text-primary hover:underline btn-nav-ingredients">View All Pantry</button>
            </div>

            <div class="space-y-3">
              ${(fb.ingredients || []).filter(i => i.stock <= i.minPar).slice(0, 4).map(ing => {
                const deficit = +(ing.minPar - ing.stock).toFixed(1);
                return `
                  <div class="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 flex items-center justify-between">
                    <div>
                      <div class="text-xs font-bold text-on-surface">${ing.name}</div>
                      <div class="text-[11px] text-on-surface-variant font-data-mono mt-0.5">
                        On Hand: <b class="text-red-600">${ing.stock} ${ing.unit}</b> • Min Par: ${ing.minPar} ${ing.unit} (${ing.store})
                      </div>
                    </div>
                    <div class="text-right">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 font-data-mono">Deficit: -${deficit} ${ing.unit}</span>
                      <button class="btn-quick-requisition block text-[11px] text-primary font-bold hover:underline mt-1 cursor-pointer" data-ingname="${ing.name}" data-deficit="${deficit}" data-unit="${ing.unit}" data-cost="${ing.costPerUnit}">
                        + Requisition
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
              ${(fb.ingredients || []).filter(i => i.stock <= i.minPar).length === 0 ? `
                <div class="p-6 text-center text-xs text-on-surface-variant font-medium">All pantry par levels are healthy and within safety thresholds.</div>
              ` : ''}
            </div>
          </div>

          <!-- Real-Time Meal Collections Log -->
          <div class="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">receipt_long</span>
                <h3 class="text-base font-extrabold text-on-surface">Recent Meal Scans & Collections</h3>
              </div>
              <button id="btn-dashboard-new-scan" class="text-xs font-bold text-primary hover:underline cursor-pointer">+ New Scan</button>
            </div>

            <div class="space-y-2.5">
              ${(fb.mealLogs || []).slice(0, 5).map(log => `
                <div class="p-3 rounded-xl bg-surface-container/50 border border-outline-variant/40 flex items-center justify-between text-xs">
                  <div class="flex items-center gap-3">
                    <span class="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold font-data-mono text-[11px]">
                      ${log.roomNumber || 'G'}
                    </span>
                    <div>
                      <div class="font-bold text-on-surface">${log.guestName}</div>
                      <div class="text-[11px] text-on-surface-variant">${log.dishName || 'Standard Meal'} • ${log.mealType}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 font-data-mono">
                      ✓ ${log.status}
                    </span>
                    <div class="text-[10px] text-on-surface-variant mt-0.5 font-data-mono">${log.timestamp}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // TAB 2: MEAL PLANNING & SCALING ENGINE (CAMP MANAGEMENT INTEGRATION)
  // =========================================================================
  _html_meals() {
    const fb = this.fb;
    const days = fb.weeklyPlan || [];
    const currentDay = days.find(d => d.dayIndex === this.selectedDayIndex) || days[0];
    const ramadanMode = fb.ramadanMode;

    const dishIds = this.selectedMealType === 'Breakfast'
      ? currentDay.breakfastDishes
      : this.selectedMealType === 'Lunch'
      ? currentDay.lunchDishes
      : currentDay.dinnerDishes;

    const sessionDishes = (fb.menuDishes || []).filter(d => dishIds.includes(d.id));

    // Calculate aggregated ingredients scaled to headcount
    const scaledIngredientsMap = {};
    sessionDishes.forEach(dish => {
      (dish.recipe || []).forEach(item => {
        const key = item.ingredientId || item.name.toLowerCase();
        if (!scaledIngredientsMap[key]) {
          scaledIngredientsMap[key] = {
            name: item.name,
            ingredientId: item.ingredientId,
            unit: item.unit,
            totalQty: 0,
            dishes: []
          };
        }
        scaledIngredientsMap[key].totalQty += item.qty_per_person * this.scalingPax;
        if (!scaledIngredientsMap[key].dishes.includes(dish.name)) {
          scaledIngredientsMap[key].dishes.push(dish.name);
        }
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
                Issue Scaled Rations to Kitchen Line
              </button>
              <button id="btn-requisition-deficits" class="px-3.5 py-2 rounded-xl border border-outline-variant hover:border-primary text-xs font-bold text-on-surface transition-all flex items-center gap-1 cursor-pointer">
                <span class="material-symbols-outlined text-[16px]">post_add</span>
                Generate Requisition PO
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="border-b border-outline-variant bg-surface-container text-on-surface-variant font-bold uppercase tracking-wider text-[10px]">
                  <th class="py-2.5 px-3">Raw Material / Ingredient</th>
                  <th class="py-2.5 px-3">Storage Location</th>
                  <th class="py-2.5 px-3 text-right">Required (${this.scalingPax} Pax)</th>
                  <th class="py-2.5 px-3 text-right">Warehouse On-Hand</th>
                  <th class="py-2.5 px-3 text-center">Variance / Availability</th>
                  <th class="py-2.5 px-3 text-right">Est. Cost</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/40">
                ${scaledList.map(item => `
                  <tr class="hover:bg-surface-container/30 transition-all ${item.isDeficit ? 'bg-red-50/40 dark:bg-red-950/10' : ''}">
                    <td class="py-3 px-3">
                      <div class="font-bold text-on-surface">${item.name}</div>
                      <div class="text-[10px] text-on-surface-variant">Used in: ${item.dishes.join(', ')}</div>
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
  // TAB 3: MENU & RECIPES (BOM) — FEATURING AI RECIPE GENERATOR
  // =========================================================================
  _html_menu() {
    const fb = this.fb;
    let dishes = fb.menuDishes || [];

    if (this.menuFilter !== 'ALL') {
      dishes = dishes.filter(d => d.mealType.toUpperCase() === this.menuFilter.toUpperCase());
    }

    return `
      <div class="space-y-6 animate-fade-in">
        <!-- AI RECIPE GENERATOR HERO BANNER -->
        <div class="p-5 rounded-2xl bg-gradient-to-r from-purple-900/90 via-indigo-900/80 to-surface-container-lowest border border-purple-500/30 text-white shadow-md relative overflow-hidden">
          <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="max-w-2xl">
              <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold tracking-wider text-purple-200 border border-white/10 uppercase mb-2">
                <span class="material-symbols-outlined text-[14px]">auto_awesome</span>
                Volvi AI Executive Chef System
              </div>
              <h2 class="text-xl font-headline-sm font-extrabold tracking-tight text-white">
                Auto-Generate Recipes, Bill of Materials & Set Quantities
              </h2>
              <p class="text-xs text-purple-100/80 mt-1 leading-relaxed">
                Describe any dish, select cuisine, and set your target headcount. The culinary AI balances macro-ratios, maps ingredients to your pantry inventory, calculates standard BOM costs, and allows full per-ingredient quantity adjustments.
              </p>

              <!-- Quick Generation Suggestion Chips -->
              <div class="flex items-center gap-1.5 flex-wrap mt-3">
                <span class="text-[10px] font-bold uppercase text-purple-200/60 font-data-mono mr-1">Quick Generate:</span>
                ${[
                  { name: 'Butter Chicken', meal: 'Dinner' },
                  { name: 'Mutton Biryani', meal: 'Dinner' },
                  { name: 'Penne Alfredo', meal: 'Lunch' },
                  { name: 'Shakshuka', meal: 'Breakfast' },
                  { name: 'Seafood Paella', meal: 'Dinner' },
                  { name: 'Classic Beef Burger', meal: 'Lunch' },
                  { name: 'Falafel Bowl', meal: 'Lunch' },
                  { name: 'Belgian Waffles', meal: 'Breakfast' }
                ].map(chip => `
                  <button class="btn-quick-ai-chip px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white border border-white/10 transition-all cursor-pointer active:scale-95" data-dish="${chip.name}" data-meal="${chip.meal}">
                    ${chip.name}
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
              <button id="btn-open-ai-generator-hero" class="px-5 py-3 rounded-xl bg-white text-purple-900 hover:bg-purple-50 font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-95">
                <span class="material-symbols-outlined text-[18px] text-purple-700 animate-spin-slow">auto_awesome</span>
                Launch AI Recipe Generator
              </button>
              <span class="text-[10px] text-purple-200/70 text-center font-data-mono">100% Pantry Inventory Aligned</span>
            </div>
          </div>
        </div>

        <!-- Filter Controls & Action Bar -->
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

          <div class="flex items-center gap-2">
            <button id="btn-create-dish-open" class="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95">
              <span class="material-symbols-outlined text-[16px]">add</span>
              + New Standard Recipe (AI Assisted)
            </button>
          </div>
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
                  <div class="flex items-center gap-1.5">
                    <button class="btn-inspect-recipe px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-bold text-primary transition-all cursor-pointer" data-dishid="${d.id}">
                      Recipe BOM
                    </button>
                    <button class="btn-ai-scale-dish px-2.5 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-xs font-bold text-purple-800 transition-all flex items-center gap-1 cursor-pointer" data-dishid="${d.id}">
                      <span class="material-symbols-outlined text-[13px]">auto_awesome</span>
                      Scale
                    </button>
                  </div>
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
            <h2 class="text-base font-extrabold text-on-surface">Culinary Staff Roster & Station Assignments</h2>
            <p class="text-xs text-on-surface-variant">HACCP certified kitchen team with real-time on-duty status and station allocation.</p>
          </div>

          <button id="btn-add-chef-open" class="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95">
            <span class="material-symbols-outlined text-[16px]">person_add</span>
            Add Culinary Staff
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          ${chefs.map(c => {
            const isOnDuty = c.status === 'ON_DUTY';
            return `
              <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs flex flex-col justify-between">
                <div>
                  <div class="flex items-start justify-between gap-2 mb-3">
                    <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary font-extrabold flex items-center justify-center font-data-mono text-sm">
                      ${c.avatarInitials}
                    </div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold font-data-mono ${
                      isOnDuty ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container text-on-surface-variant'
                    }">
                      ${isOnDuty ? '● ON DUTY' : '○ ON BREAK'}
                    </span>
                  </div>

                  <h3 class="text-sm font-extrabold text-on-surface">${c.name}</h3>
                  <div class="text-[11px] font-bold text-primary mt-0.5">${c.title}</div>
                  <div class="text-[11px] text-on-surface-variant mt-2">
                    <b>Station:</b> ${c.station}
                  </div>
                  <div class="text-[11px] text-on-surface-variant mt-1">
                    <b>Shift:</b> ${c.shift}
                  </div>
                  <div class="text-[11px] text-on-surface-variant mt-2 italic bg-surface-container/40 p-2 rounded-lg">
                    "${c.specialty}"
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                  <span class="text-[10px] text-on-surface-variant font-data-mono">${c.experienceYrs} yrs exp • HACCP</span>
                  <button class="btn-toggle-chef-duty px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isOnDuty ? 'bg-amber-100 hover:bg-amber-200 text-amber-800' : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                  }" data-chefid="${c.id}" data-current="${c.status}">
                    ${isOnDuty ? 'Set On Break' : 'Clock In'}
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
  // TAB 5: INGREDIENTS & STORE STOCK
  // =========================================================================
  _html_ingredients() {
    const fb = this.fb;
    let ingredients = fb.ingredients || [];

    const categories = ['ALL', 'Rice & Grains', 'Meat & Poultry', 'Dairy & Eggs', 'Vegetables', 'Spices & Condiments', 'Beverages & Oils', 'Miscellaneous'];

    if (this.ingredientCategoryFilter !== 'ALL') {
      ingredients = ingredients.filter(i => i.category === this.ingredientCategoryFilter);
    }
    if (this.lowStockOnly) {
      ingredients = ingredients.filter(i => i.stock <= i.minPar);
    }

    const totalValuation = (fb.ingredients || []).reduce((acc, i) => acc + (i.stock * i.costPerUnit), 0);

    return `
      <div class="space-y-6 animate-fade-in">
        <!-- Valuation Strip -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs">
            <div class="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Total Raw Material Inventory</div>
            <div class="text-2xl font-headline-sm font-extrabold text-on-surface mt-1">${(fb.ingredients || []).length} SKUs</div>
            <div class="text-[11px] text-on-surface-variant mt-1">Across Central Dry Store, Meat Freezer & Chiller</div>
          </div>

          <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs">
            <div class="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Total Pantry Valuation</div>
            <div class="text-2xl font-headline-sm font-extrabold text-primary font-data-mono mt-1">$${totalValuation.toFixed(2)}</div>
            <div class="text-[11px] text-emerald-600 font-semibold mt-1">Real-time weighted average cost basis</div>
          </div>

          <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs">
            <div class="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Par Level Breach Alerts</div>
            <div class="text-2xl font-headline-sm font-extrabold text-red-600 font-data-mono mt-1">
              ${(fb.ingredients || []).filter(i => i.stock <= i.minPar).length} Items
            </div>
            <div class="text-[11px] text-red-600 font-semibold mt-1">Requires immediate supplier purchase PO</div>
          </div>
        </div>

        <!-- Filter Controls -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-1.5 flex-wrap">
            ${categories.map(cat => `
              <button class="btn-filter-ingredient px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                this.ingredientCategoryFilter === cat
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
              }" data-cat="${cat}">
                ${cat}
              </button>
            `).join('')}
          </div>

          <div class="flex items-center gap-2">
            <button id="btn-toggle-low-stock" class="px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              this.lowStockOnly ? 'bg-red-500 text-white border-red-600' : 'border-outline-variant text-on-surface-variant hover:text-on-surface'
            }">
              <span class="material-symbols-outlined text-[14px] align-middle">filter_alt</span>
              Filter Low Stock Par Only
            </button>
          </div>
        </div>

        <!-- Master Ingredients Table -->
        <div class="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-xs">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="border-b border-outline-variant bg-surface-container text-on-surface-variant font-bold uppercase tracking-wider text-[10px]">
                  <th class="py-2.5 px-3">Item Code & SKU</th>
                  <th class="py-2.5 px-3">Ingredient Description</th>
                  <th class="py-2.5 px-3">Category</th>
                  <th class="py-2.5 px-3">Storage Unit</th>
                  <th class="py-2.5 px-3 text-right">Unit Cost</th>
                  <th class="py-2.5 px-3 text-right">On Hand Stock</th>
                  <th class="py-2.5 px-3 text-right">Min Par</th>
                  <th class="py-2.5 px-3 text-center">Status</th>
                  <th class="py-2.5 px-3 text-center">Quick Adjust</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/40">
                ${ingredients.map(ing => {
                  const isLow = ing.stock <= ing.minPar;
                  return `
                    <tr class="hover:bg-surface-container/30 transition-all ${isLow ? 'bg-red-50/40 dark:bg-red-950/10' : ''}">
                      <td class="py-3 px-3 font-data-mono text-[11px] text-on-surface-variant font-bold">${ing.sku}</td>
                      <td class="py-3 px-3">
                        <div class="font-bold text-on-surface">${ing.name}</div>
                        <div class="text-[10px] text-on-surface-variant">${ing.store}</div>
                      </td>
                      <td class="py-3 px-3">
                        <span class="px-2 py-0.5 rounded bg-surface-container text-[10px] font-medium">${ing.category}</span>
                      </td>
                      <td class="py-3 px-3 font-data-mono text-on-surface-variant">${ing.unit}</td>
                      <td class="py-3 px-3 text-right font-data-mono font-bold text-on-surface">$${ing.costPerUnit.toFixed(2)}</td>
                      <td class="py-3 px-3 text-right font-extrabold font-data-mono ${isLow ? 'text-red-600' : 'text-primary'}">
                        ${ing.stock} ${ing.unit}
                      </td>
                      <td class="py-3 px-3 text-right font-data-mono text-on-surface-variant">${ing.minPar} ${ing.unit}</td>
                      <td class="py-3 px-3 text-center">
                        ${isLow ? `
                          <span class="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">REORDER</span>
                        ` : `
                          <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">OPTIMAL</span>
                        `}
                      </td>
                      <td class="py-3 px-3 text-center">
                        <div class="inline-flex items-center gap-1">
                          <button class="btn-adjust-stock p-1 rounded hover:bg-surface-container text-primary font-bold cursor-pointer" data-ingid="${ing.id}" data-action="in" title="Receive Goods (GRN)">+10</button>
                          <button class="btn-adjust-stock p-1 rounded hover:bg-surface-container text-red-600 font-bold cursor-pointer" data-ingid="${ing.id}" data-action="out" title="Issue Stock">-5</button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // MODALS & DRAWERS (INCLUDING AI RECIPE GENERATOR & QUANTITY SCALER)
  // =========================================================================
  _html_modals() {
    let output = '';
    const fb = this.fb;

    // 1. AI RECIPE GENERATOR & INGREDIENT QUANTITY CUSTOMIZER MODAL
    if (this.showAiRecipeModal) {
      const state = this.aiRecipeState;
      const rec = state.generatedRecipe;
      const targetPax = state.targetPax || 1;
      const isBatch = state.viewMode === 'BATCH';

      output += `
        <div class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in" id="ai-recipe-backdrop">
          <div class="w-full max-w-4xl bg-surface-bright rounded-2xl shadow-2xl border border-outline-variant my-auto flex flex-col max-h-[92vh] overflow-hidden">
            
            <!-- Modal Top Header -->
            <div class="p-4 sm:px-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest shrink-0">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <span class="material-symbols-outlined text-[20px]">auto_awesome</span>
                </div>
                <div>
                  <h3 class="text-base font-extrabold text-on-surface flex items-center gap-2">
                    <span>Volvi AI Executive Chef</span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 font-data-mono">Recipe & Ingredient Generator</span>
                  </h3>
                  <p class="text-[11px] text-on-surface-variant">Auto-generate standard recipe bill of materials, scale batch quantities, and align with pantry inventory.</p>
                </div>
              </div>
              <button id="btn-close-ai-modal" class="p-1.5 rounded-xl hover:bg-surface-container text-on-surface-variant cursor-pointer transition-all">
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <!-- Modal Scrollable Content -->
            <div class="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              <!-- STEP 1: AI RECIPE PARAMETERS & PROMPT -->
              <div class="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant space-y-4">
                <div class="flex items-center justify-between">
                  <div class="font-bold text-on-surface text-sm flex items-center gap-2">
                    <span class="material-symbols-outlined text-purple-600 text-[18px]">psychology</span>
                    Recipe Requirements & Dish Specifications
                  </div>
                  <span class="text-[11px] text-on-surface-variant font-data-mono">Step 1: Input Dish Concept</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block font-bold text-on-surface mb-1">Dish Name / Culinary Idea</label>
                    <input type="text" id="ai-input-dish-name" value="${state.dishName}" placeholder="e.g. Murgh Makhani, Seafood Paella, Lamb Rogan Josh, Truffle Pasta..." class="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant font-bold text-on-surface focus:border-purple-600 focus:outline-hidden" />
                  </div>

                  <div>
                    <label class="block font-bold text-on-surface mb-1">Cuisine & Gastronomic Style</label>
                    <select id="ai-select-cuisine" class="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant text-on-surface font-semibold focus:border-purple-600 focus:outline-hidden">
                      ${['Indian Regional', 'Arabic & Levantine', 'Italian & Mediterranean', 'Continental & Western', 'Asian & Wok', 'Mexican / Latin', 'Bakery & Pastry', 'International'].map(c => `
                        <option value="${c}" ${state.cuisine === c ? 'selected' : ''}>${c}</option>
                      `).join('')}
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label class="block font-bold text-on-surface mb-1">Meal Service Period</label>
                    <select id="ai-select-meal-type" class="w-full p-2.5 rounded-xl bg-surface-container border border-outline-variant text-on-surface font-semibold">
                      <option value="Breakfast" ${state.mealType === 'Breakfast' ? 'selected' : ''}>Breakfast</option>
                      <option value="Lunch" ${state.mealType === 'Lunch' ? 'selected' : ''}>Lunch</option>
                      <option value="Dinner" ${state.mealType === 'Dinner' ? 'selected' : ''}>Dinner</option>
                      <option value="Snack" ${state.mealType === 'Snack' ? 'selected' : ''}>Snack / Dessert</option>
                    </select>
                  </div>

                  <div>
                    <label class="block font-bold text-on-surface mb-1">Target Food Cost %</label>
                    <div class="flex items-center gap-2">
                      <input type="range" id="ai-range-fc" min="18" max="45" value="${state.targetFoodCostPct}" class="w-full accent-purple-600 cursor-pointer" />
                      <span id="ai-fc-display" class="font-data-mono font-bold text-purple-700 shrink-0 w-10">${state.targetFoodCostPct}%</span>
                    </div>
                  </div>

                  <div>
                    <label class="block font-bold text-on-surface mb-1">Initial Target Pax Headcount</label>
                    <div class="flex items-center gap-1.5">
                      <input type="number" id="ai-input-init-pax" min="1" max="1000" value="${state.targetPax}" class="w-20 p-2 rounded-xl bg-surface-container border border-outline-variant font-bold text-center font-data-mono text-primary" />
                      <span class="text-on-surface-variant font-bold">Pax</span>
                    </div>
                  </div>
                </div>

                <!-- Chef Guidance / Notes -->
                <div>
                  <label class="block font-bold text-on-surface mb-1">Chef Notes / Macro Instructions (Optional)</label>
                  <input type="text" id="ai-input-notes" value="${state.chefNotes}" placeholder="e.g. Extra rich cashew gravy, boneless chicken thigh cuts, low sodium, gluten-free crust..." class="w-full p-2 rounded-xl bg-surface-container border border-outline-variant text-on-surface" />
                </div>

                <!-- Action Button -->
                <div class="pt-2 flex justify-end">
                  <button id="btn-trigger-ai-gen" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs transition-all flex items-center gap-2 shadow-md cursor-pointer active:scale-95 ${state.isGenerating ? 'opacity-70 pointer-events-none' : ''}">
                    <span class="material-symbols-outlined text-[17px] ${state.isGenerating ? 'animate-spin' : ''}">
                      ${state.isGenerating ? 'sync' : 'auto_awesome'}
                    </span>
                    ${state.isGenerating ? 'AI Synthesizing Ingredients & Ratios...' : '✨ Auto-Generate Ingredients & Recipe'}
                  </button>
                </div>
              </div>

              ${rec ? `
                <!-- STEP 2: GENERATED RECIPE & INTERACTIVE QUANTITY SCALER -->
                <div class="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant space-y-5 animate-fade-in">
                  
                  <!-- Dish Overview Banner -->
                  <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-outline-variant">
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 font-data-mono uppercase">${rec.category}</span>
                        <span class="text-xs text-on-surface-variant font-data-mono">• Station: <b class="text-on-surface">${rec.leadStation}</b></span>
                        <span class="text-xs text-on-surface-variant font-data-mono">• Prep: <b class="text-on-surface">${rec.prepTimeMin} mins</b></span>
                      </div>
                      <h2 class="text-lg font-extrabold text-on-surface mt-1">${rec.name}</h2>
                      <p class="text-[11px] text-on-surface-variant mt-0.5">${rec.description}</p>
                    </div>

                    <div class="flex items-center gap-3 bg-surface-container/60 p-3 rounded-xl border border-outline-variant/60 shrink-0 text-right">
                      <div>
                        <div class="text-[10px] uppercase font-bold text-on-surface-variant font-data-mono">Standard Cost / Portion</div>
                        <div class="text-base font-extrabold text-primary font-data-mono mt-0.5">$${rec.standardCost.toFixed(2)}</div>
                      </div>
                      <div class="border-l border-outline-variant/60 pl-3">
                        <div class="text-[10px] uppercase font-bold text-on-surface-variant font-data-mono">Suggested Price</div>
                        <div class="text-base font-extrabold text-emerald-600 font-data-mono mt-0.5">$${rec.sellingPrice.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>

                  <!-- QUANTITY SETTING & SCALING ENGINE (USER REQUEST CORE FEATURE!) -->
                  <div class="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-800/40 space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div class="flex items-center gap-1.5 font-extrabold text-purple-900 dark:text-purple-200">
                          <span class="material-symbols-outlined text-[18px]">scale</span>
                          Adjust Recipe Quantity & Headcount (Batch Scaler)
                        </div>
                        <p class="text-[11px] text-purple-800/70 dark:text-purple-300/70">
                          Set the headcount quantity below to automatically multiply all ingredients, or fine-tune individual quantities in the table.
                        </p>
                      </div>

                      <!-- View Mode Switch: 1 Pax vs Scaled Batch -->
                      <div class="inline-flex p-1 rounded-xl bg-surface-container border border-outline-variant shrink-0">
                        <button class="btn-toggle-ai-view-mode px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                          !isBatch ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                        }" data-mode="PER_PERSON">
                          Per-Person Base (1 Pax)
                        </button>
                        <button class="btn-toggle-ai-view-mode px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                          isBatch ? 'bg-surface-container-lowest text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                        }" data-mode="BATCH">
                          Scaled Batch (${targetPax} Pax)
                        </button>
                      </div>
                    </div>

                    <!-- Pax Slider & Quick Preset Buttons -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="text-[10px] font-bold text-on-surface-variant uppercase font-data-mono">Quick Portions:</span>
                        ${[1, 4, 10, 50, 100, 250].map(p => `
                          <button class="btn-set-ai-pax px-2.5 py-1 rounded-lg border text-[11px] font-bold font-data-mono transition-all cursor-pointer ${
                            targetPax === p ? 'bg-purple-600 text-white border-purple-600 shadow-2xs' : 'bg-surface-container-lowest border-outline-variant hover:border-purple-400 text-on-surface'
                          }" data-pax="${p}">
                            ${p === 1 ? '1 Port.' : `${p} Pax`}
                          </button>
                        `).join('')}
                      </div>

                      <div class="flex items-center gap-2.5 shrink-0">
                        <input type="range" id="ai-range-target-pax" min="1" max="500" step="1" value="${targetPax}" class="w-32 sm:w-44 accent-purple-600 cursor-pointer" />
                        <div class="flex items-center gap-1 font-data-mono">
                          <input type="number" id="ai-num-target-pax" min="1" max="1000" value="${targetPax}" class="w-16 px-2 py-1 text-xs font-bold text-center bg-surface-container-lowest border border-outline-variant rounded-lg font-data-mono text-purple-700" />
                          <span class="font-bold text-on-surface">Pax</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- EDITABLE INGREDIENTS TABLE -->
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-bold text-on-surface text-xs uppercase tracking-wider font-data-mono flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[15px] text-primary">receipt</span>
                        Auto-Generated Ingredient Bill of Materials (${(rec.recipe || []).length} Items)
                      </h4>
                      <span class="text-[11px] text-on-surface-variant font-data-mono">
                        ${isBatch ? `Showing total quantities for <b>${targetPax} Pax</b>` : 'Showing base quantity per 1 portion'}
                      </span>
                    </div>

                    <div class="overflow-x-auto rounded-xl border border-outline-variant">
                      <table class="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr class="border-b border-outline-variant bg-surface-container text-on-surface-variant font-bold uppercase tracking-wider text-[10px]">
                            <th class="py-2.5 px-3">Raw Material / Ingredient</th>
                            <th class="py-2.5 px-3">Category & Store</th>
                            <th class="py-2.5 px-3 text-right">
                              ${isBatch ? `Batch Qty (${targetPax} Pax)` : 'Base Qty (1 Pax)'}
                            </th>
                            <th class="py-2.5 px-3 text-right">Unit</th>
                            <th class="py-2.5 px-3 text-right">Unit Cost</th>
                            <th class="py-2.5 px-3 text-right">Line Total</th>
                            <th class="py-2.5 px-3 text-center">Pantry Stock</th>
                            <th class="py-2.5 px-3 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-outline-variant/40">
                          ${(rec.recipe || []).map((item, idx) => {
                            const displayQty = isBatch ? +(item.qty_per_person * targetPax).toFixed(3) : item.qty_per_person;
                            const lineTotal = +(displayQty * item.unitCost).toFixed(2);
                            const pantryMaster = fb.ingredients?.find(i => i.id === item.ingredientId || i.name.toLowerCase().includes(item.name.toLowerCase()));
                            const currentStock = pantryMaster ? pantryMaster.stock : 0;
                            const hasSufficient = currentStock >= (item.qty_per_person * targetPax);

                            return `
                              <tr class="hover:bg-surface-container/30 transition-all">
                                <td class="py-2 px-3">
                                  <div class="font-bold text-on-surface">${item.name}</div>
                                </td>
                                <td class="py-2 px-3 text-on-surface-variant">
                                  <span class="px-1.5 py-0.2 rounded bg-surface-container text-[10px]">${item.store || 'Central Store'}</span>
                                </td>
                                <td class="py-2 px-3 text-right">
                                  <!-- User editable quantity input -->
                                  <input type="number" step="0.001" min="0.001" value="${displayQty}" class="input-ai-ing-qty w-20 px-2 py-1 text-right font-data-mono font-bold text-primary bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-purple-600 focus:outline-hidden" data-idx="${idx}" />
                                </td>
                                <td class="py-2 px-3 text-right">
                                  <select class="select-ai-ing-unit px-1.5 py-1 text-[11px] font-data-mono bg-surface-container-lowest border border-outline-variant rounded-lg" data-idx="${idx}">
                                    ${['kg', 'litres', 'pieces', 'grams', 'ml'].map(u => `
                                      <option value="${u}" ${item.unit === u ? 'selected' : ''}>${u}</option>
                                    `).join('')}
                                  </select>
                                </td>
                                <td class="py-2 px-3 text-right font-data-mono text-on-surface">
                                  $${item.unitCost.toFixed(2)}
                                </td>
                                <td class="py-2 px-3 text-right font-data-mono font-bold text-on-surface">
                                  $${lineTotal.toFixed(2)}
                                </td>
                                <td class="py-2 px-3 text-center">
                                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold font-data-mono ${
                                    hasSufficient ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                  }">
                                    Stock: ${currentStock} ${item.unit}
                                  </span>
                                </td>
                                <td class="py-2 px-3 text-center">
                                  <button class="btn-delete-ai-ing p-1 rounded-lg text-on-surface-variant hover:text-red-600 hover:bg-red-50 cursor-pointer" data-idx="${idx}" title="Remove Ingredient">
                                    <span class="material-symbols-outlined text-[16px]">delete</span>
                                  </button>
                                </td>
                              </tr>
                            `;
                          }).join('')}
                        </tbody>
                        <tfoot>
                          <!-- Add Custom Ingredient Row -->
                          <tr class="bg-surface-container-low border-t border-outline-variant">
                            <td colspan="4" class="py-2 px-3">
                              <div class="flex items-center gap-2">
                                <span class="font-bold text-[11px] text-on-surface-variant">+ Add From Pantry:</span>
                                <select id="ai-select-add-pantry" class="p-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant text-[11px] font-semibold text-on-surface max-w-[240px]">
                                  ${(fb.ingredients || []).map(ing => `
                                    <option value="${ing.id}" ${state.selectedPantryAddId === ing.id ? 'selected' : ''}>${ing.name} ($${ing.costPerUnit}/${ing.unit})</option>
                                  `).join('')}
                                </select>
                                <input type="number" id="ai-input-add-qty" step="0.01" min="0.01" value="${state.selectedPantryAddQty}" class="w-16 p-1 text-center font-data-mono font-bold bg-surface-container-lowest border border-outline-variant rounded-lg" />
                                <button id="btn-add-pantry-to-ai" class="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] cursor-pointer">
                                  + Append
                                </button>
                              </div>
                            </td>
                            <td colspan="2" class="py-2 px-3 text-right font-bold text-on-surface font-data-mono">
                              Batch Total: $${(rec.standardCost * targetPax).toFixed(2)}
                            </td>
                            <td colspan="2"></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <!-- Real-Time Costing & Selling Price Adjustment -->
                  <div class="p-4 rounded-xl bg-surface-container/60 border border-outline-variant grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                      <div class="text-[10px] font-bold text-on-surface-variant uppercase font-data-mono">Portion Standard Cost</div>
                      <div class="text-base font-extrabold text-primary font-data-mono mt-0.5">$${rec.standardCost.toFixed(2)}</div>
                    </div>

                    <div>
                      <div class="text-[10px] font-bold text-on-surface-variant uppercase font-data-mono">Batch Total Cost (${targetPax} Pax)</div>
                      <div class="text-base font-extrabold text-purple-700 font-data-mono mt-0.5">$${(rec.standardCost * targetPax).toFixed(2)}</div>
                    </div>

                    <div>
                      <div class="text-[10px] font-bold text-on-surface-variant uppercase font-data-mono">Menu Selling Price</div>
                      <div class="flex items-center gap-1 mt-0.5">
                        <span class="font-bold font-data-mono text-on-surface">$</span>
                        <input type="number" id="ai-input-selling-price" step="0.5" value="${rec.sellingPrice.toFixed(2)}" class="w-20 px-2 py-0.5 rounded bg-surface-container-lowest border border-outline-variant font-bold font-data-mono text-on-surface" />
                      </div>
                    </div>

                    <div>
                      <div class="text-[10px] font-bold text-on-surface-variant uppercase font-data-mono">Food Cost %</div>
                      <div class="mt-0.5">
                        <span class="px-2 py-0.5 rounded-full text-xs font-bold font-data-mono ${
                          rec.foodCostPct <= 22 ? 'bg-emerald-100 text-emerald-800' : rec.foodCostPct <= 30 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                        }">
                          ${rec.foodCostPct}% (${rec.foodCostPct <= 30 ? 'Optimal Margin' : 'High Cost'})
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Step-by-Step Culinary Preparation Steps -->
                  <div>
                    <h4 class="font-bold text-on-surface text-xs uppercase tracking-wider font-data-mono mb-2">
                      Master Chef Preparation Method
                    </h4>
                    <div class="space-y-1.5 bg-surface-container/30 p-3 rounded-xl border border-outline-variant/60">
                      ${(rec.steps || []).map((step, sIdx) => `
                        <div class="flex items-start gap-2 text-xs">
                          <span class="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold font-data-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            ${sIdx + 1}
                          </span>
                          <span class="text-on-surface">${step}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- Modal Bottom Actions -->
            <div class="p-4 sm:px-6 border-t border-outline-variant flex items-center justify-between bg-surface-container-lowest shrink-0">
              <button id="btn-cancel-ai-modal" class="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant hover:text-on-surface font-bold text-xs cursor-pointer">
                Cancel
              </button>

              <div class="flex items-center gap-2">
                ${rec ? `
                  <button id="btn-save-ai-recipe" class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95">
                    <span class="material-symbols-outlined text-[18px]">verified</span>
                    Save Recipe to Menu Catalog
                  </button>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // 2. RECIPE BOM DRAWER (FOR EXISTING DISHES)
    if (this.activeRecipeDrawer) {
      const dish = (this.fb.menuDishes || []).find(d => d.id === this.activeRecipeDrawer);
      if (dish) {
        output += `
          <div class="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex justify-end animate-fade-in" id="recipe-drawer-backdrop">
            <div class="w-full max-w-lg bg-surface-bright h-full shadow-2xl p-6 border-l border-outline-variant flex flex-col justify-between overflow-y-auto">
              <div>
                <div class="flex items-start justify-between pb-4 border-b border-outline-variant">
                  <div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary font-data-mono">${dish.mealType}</span>
                    <h2 class="text-lg font-extrabold text-on-surface mt-1">${dish.name}</h2>
                    <div class="text-xs text-on-surface-variant font-data-mono">Selling Price: $${dish.sellingPrice.toFixed(2)} • BOM Cost: $${dish.standardCost.toFixed(2)} • FC: ${dish.foodCostPct}%</div>
                  </div>
                  <button id="btn-close-recipe-drawer" class="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer">
                    <span class="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div class="py-4 space-y-4">
                  <!-- AI Scale / Re-generate Action inside Drawer -->
                  <div class="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 flex items-center justify-between">
                    <div>
                      <div class="font-bold text-xs text-purple-900 dark:text-purple-200 flex items-center gap-1">
                        <span class="material-symbols-outlined text-[15px]">auto_awesome</span>
                        AI Recipe Scaler & Quantities
                      </div>
                      <div class="text-[10px] text-purple-800/70 dark:text-purple-300/70">Adjust portions or customize ingredient ratios in AI Copilot.</div>
                    </div>
                    <button class="btn-drawer-ai-scale px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer" data-dishid="${dish.id}">
                      Scale Quantities
                    </button>
                  </div>

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

    // 3. RECORD MEAL SCAN MODAL
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
  // EVENT BINDINGS & AI RECIPE GENERATOR ACTIONS
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

    // Scaling headcount input and slider in Tab 2
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

    // Modal close & submit for meal scanner
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

    // =======================================================================
    // AI RECIPE GENERATOR EVENT LISTENERS & QUANTITY SCALING HANDLERS
    // =======================================================================

    // Open AI Generator Modal from Header or Menu Banner
    const openAiModal = (dishName = '', mealType = 'Lunch') => {
      this.showAiRecipeModal = true;
      if (dishName) {
        this.aiRecipeState.dishName = dishName;
        this.aiRecipeState.mealType = mealType;
        // Auto-generate immediately if specific dish chosen
        this._executeAiGeneration();
      }
      this.renderContent();
    };

    this.container.querySelector('#btn-header-ai-recipe')?.addEventListener('click', () => {
      openAiModal();
    });

    this.container.querySelector('#btn-open-ai-generator-hero')?.addEventListener('click', () => {
      openAiModal();
    });

    this.container.querySelector('#btn-create-dish-open')?.addEventListener('click', () => {
      openAiModal();
    });

    // Quick AI chips on menu banner
    this.container.querySelectorAll('.btn-quick-ai-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        openAiModal(btn.dataset.dish, btn.dataset.meal);
      });
    });

    // Scale Existing Dish from Menu Grid or Drawer
    const openForExistingDish = (dishId) => {
      const dish = (this.fb.menuDishes || []).find(d => d.id === dishId);
      if (!dish) return;
      this.activeRecipeDrawer = null;
      this.showAiRecipeModal = true;
      this.aiRecipeState.dishName = dish.name;
      this.aiRecipeState.mealType = dish.mealType;
      this.aiRecipeState.isEditingExisting = true;
      this.aiRecipeState.editingDishId = dish.id;

      // Copy dish structure into generatedRecipe
      this.aiRecipeState.generatedRecipe = {
        ...dish,
        recipe: (dish.recipe || []).map(r => ({
          ...r,
          unitCost: r.unitCost || this.fb.ingredients?.find(i => i.id === r.ingredientId)?.costPerUnit || 5.0
        }))
      };
      this.renderContent();
    };

    this.container.querySelectorAll('.btn-ai-scale-dish').forEach(btn => {
      btn.addEventListener('click', () => {
        openForExistingDish(btn.dataset.dishid);
      });
    });

    this.container.querySelectorAll('.btn-drawer-ai-scale').forEach(btn => {
      btn.addEventListener('click', () => {
        openForExistingDish(btn.dataset.dishid);
      });
    });

    // Close AI Modal
    this.container.querySelector('#btn-close-ai-modal')?.addEventListener('click', () => {
      this.showAiRecipeModal = false;
      this.renderContent();
    });
    this.container.querySelector('#btn-cancel-ai-modal')?.addEventListener('click', () => {
      this.showAiRecipeModal = false;
      this.renderContent();
    });

    // Food Cost slider in AI Modal
    const fcRange = this.container.querySelector('#ai-range-fc');
    const fcDisplay = this.container.querySelector('#ai-fc-display');
    if (fcRange && fcDisplay) {
      fcRange.addEventListener('input', (e) => {
        this.aiRecipeState.targetFoodCostPct = parseInt(e.target.value, 10);
        fcDisplay.textContent = `${this.aiRecipeState.targetFoodCostPct}%`;
      });
    }

    // Trigger AI Generation Button
    this.container.querySelector('#btn-trigger-ai-gen')?.addEventListener('click', () => {
      const dishNameInput = this.container.querySelector('#ai-input-dish-name')?.value || 'Chef Specialty';
      const cuisineInput = this.container.querySelector('#ai-select-cuisine')?.value || 'International';
      const mealTypeInput = this.container.querySelector('#ai-select-meal-type')?.value || 'Lunch';
      const initPaxInput = parseInt(this.container.querySelector('#ai-input-init-pax')?.value, 10) || 1;
      const notesInput = this.container.querySelector('#ai-input-notes')?.value || '';

      this.aiRecipeState.dishName = dishNameInput;
      this.aiRecipeState.cuisine = cuisineInput;
      this.aiRecipeState.mealType = mealTypeInput;
      this.aiRecipeState.targetPax = initPaxInput;
      this.aiRecipeState.chefNotes = notesInput;

      this._executeAiGeneration();
    });

    // Toggle View Mode: 1 Pax vs Scaled Batch
    this.container.querySelectorAll('.btn-toggle-ai-view-mode').forEach(btn => {
      btn.addEventListener('click', () => {
        this.aiRecipeState.viewMode = btn.dataset.mode;
        this.renderContent();
      });
    });

    // Quick Pax Presets (1, 4, 10, 50, 100, 250 Pax)
    this.container.querySelectorAll('.btn-set-ai-pax').forEach(btn => {
      btn.addEventListener('click', () => {
        const pax = parseInt(btn.dataset.pax, 10);
        this.aiRecipeState.targetPax = pax;
        this._recalculateAiRecipeCosting();
        this.renderContent();
      });
    });

    // Target Pax Range Slider & Number Input
    const paxRange = this.container.querySelector('#ai-range-target-pax');
    const paxNum = this.container.querySelector('#ai-num-target-pax');
    if (paxRange && paxNum) {
      paxRange.addEventListener('input', (e) => {
        this.aiRecipeState.targetPax = parseInt(e.target.value, 10) || 1;
        this._recalculateAiRecipeCosting();
        this.renderContent();
      });
      paxNum.addEventListener('change', (e) => {
        this.aiRecipeState.targetPax = Math.max(1, parseInt(e.target.value, 10) || 1);
        this._recalculateAiRecipeCosting();
        this.renderContent();
      });
    }

    // Editable Ingredient Quantity Inputs ("and we can set the quantity")
    this.container.querySelectorAll('.input-ai-ing-qty').forEach(input => {
      input.addEventListener('change', (e) => {
        const idx = parseInt(e.target.dataset.idx, 10);
        const enteredVal = parseFloat(e.target.value) || 0.001;
        const rec = this.aiRecipeState.generatedRecipe;
        if (!rec || !rec.recipe || !rec.recipe[idx]) return;

        if (this.aiRecipeState.viewMode === 'BATCH') {
          // Entered batch qty -> recalculate per-person qty
          rec.recipe[idx].qty_per_person = +(enteredVal / this.aiRecipeState.targetPax).toFixed(4);
        } else {
          // Entered per-person qty
          rec.recipe[idx].qty_per_person = +enteredVal.toFixed(4);
        }

        this._recalculateAiRecipeCosting();
        this.renderContent();
      });
    });

    // Editable Unit Select
    this.container.querySelectorAll('.select-ai-ing-unit').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const idx = parseInt(e.target.dataset.idx, 10);
        const rec = this.aiRecipeState.generatedRecipe;
        if (rec && rec.recipe && rec.recipe[idx]) {
          rec.recipe[idx].unit = e.target.value;
          this.renderContent();
        }
      });
    });

    // Delete Ingredient
    this.container.querySelectorAll('.btn-delete-ai-ing').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        const rec = this.aiRecipeState.generatedRecipe;
        if (rec && rec.recipe) {
          rec.recipe.splice(idx, 1);
          this._recalculateAiRecipeCosting();
          this.renderContent();
        }
      });
    });

    // Append Ingredient from Central Pantry
    this.container.querySelector('#btn-add-pantry-to-ai')?.addEventListener('click', () => {
      const pantryId = this.container.querySelector('#ai-select-add-pantry')?.value;
      const qtyVal = parseFloat(this.container.querySelector('#ai-input-add-qty')?.value) || 0.1;
      const pantryItem = this.fb.ingredients?.find(i => i.id === pantryId);
      const rec = this.aiRecipeState.generatedRecipe;

      if (pantryItem && rec && rec.recipe) {
        rec.recipe.push({
          name: pantryItem.name,
          ingredientId: pantryItem.id,
          unit: pantryItem.unit,
          qty_per_person: qtyVal,
          unitCost: pantryItem.costPerUnit,
          store: pantryItem.store
        });
        this._recalculateAiRecipeCosting();
        this.renderContent();
      }
    });

    // Editable Selling Price
    this.container.querySelector('#ai-input-selling-price')?.addEventListener('change', (e) => {
      const price = parseFloat(e.target.value) || 10.0;
      const rec = this.aiRecipeState.generatedRecipe;
      if (rec) {
        rec.sellingPrice = price;
        rec.foodCostPct = Math.round((rec.standardCost / price) * 100);
        this.renderContent();
      }
    });

    // Save Recipe to Catalog
    this.container.querySelector('#btn-save-ai-recipe')?.addEventListener('click', () => {
      const rec = this.aiRecipeState.generatedRecipe;
      if (!rec) return;

      if (this.aiRecipeState.isEditingExisting && this.aiRecipeState.editingDishId) {
        store.updateFbDish(this.aiRecipeState.editingDishId, rec);
      } else {
        store.addFbDish(rec);
      }

      this.showAiRecipeModal = false;
      this.aiRecipeState.generatedRecipe = null;
      this.aiRecipeState.isEditingExisting = false;
      this.aiRecipeState.editingDishId = null;
      this.setTab('menu');
    });
  }

  _executeAiGeneration() {
    this.aiRecipeState.isGenerating = true;
    this.renderContent();

    setTimeout(() => {
      const generated = AiRecipeGenerator.generateRecipe({
        dishName: this.aiRecipeState.dishName,
        mealType: this.aiRecipeState.mealType,
        cuisine: this.aiRecipeState.cuisine,
        dietary: this.aiRecipeState.dietary,
        targetPax: this.aiRecipeState.targetPax,
        targetFoodCostPct: this.aiRecipeState.targetFoodCostPct,
        chefNotes: this.aiRecipeState.chefNotes
      });

      this.aiRecipeState.generatedRecipe = generated;
      this.aiRecipeState.isGenerating = false;
      this.renderContent();

      Toast.show({
        title: '✨ Recipe & BOM Auto-Generated',
        message: `Successfully synthesized ${generated.recipe.length} ingredients with standard portion ratios for ${generated.name}.`,
        type: 'success'
      });
    }, 600);
  }

  _recalculateAiRecipeCosting() {
    const rec = this.aiRecipeState.generatedRecipe;
    if (!rec || !rec.recipe) return;

    const standardCost = rec.recipe.reduce((sum, item) => {
      return sum + (item.qty_per_person * (item.unitCost || 5.0));
    }, 0);

    rec.standardCost = +standardCost.toFixed(2);
    if (!rec.sellingPrice || rec.sellingPrice < rec.standardCost) {
      rec.sellingPrice = +(rec.standardCost / 0.28).toFixed(2);
    }
    rec.foodCostPct = Math.round((rec.standardCost / rec.sellingPrice) * 100);
  }
}
