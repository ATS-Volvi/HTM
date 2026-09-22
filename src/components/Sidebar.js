// ==========================================================================
// VOLVITECH HOSPITALITY OS — WORKSPACE NAVIGATION SIDEBAR
// Human-Friendly, Visual Hotel Navigation (Front Desk & Housekeeping)
// ==========================================================================
import { store } from '../state/store.js';
import { NewBookingModal } from '../views/frontoffice/NewBookingModal.js';

export function renderSidebar(state) {
  const isHousekeeping = state.activeWorkspace === 'HOUSEKEEPING';
  const isMaintenance = state.activeWorkspace === 'MAINTENANCE';
  const isFoodBeverage = state.activeWorkspace === 'FB' || state.activeWorkspace === 'FOOD_BEVERAGE';
  const activeTab = state.activeNavTab || (isFoodBeverage ? 'fb_dashboard' : (isMaintenance ? 'maint_dashboard' : (isHousekeeping ? 'housekeeping' : 'reservations')));

  let navSections;
  if (isFoodBeverage) {
    const fb = state.fb || (typeof store.getFbState === 'function' ? store.getFbState() : {});
    const onDutyChefs = (fb.chefs || []).filter(c => c.status === 'ON_DUTY').length;
    const lowStockCount = (fb.ingredients || []).filter(i => i.stock <= i.minPar).length;

    navSections = [
      {
        title: 'FOOD & BEVERAGE',
        items: [
          { id: 'fb_dashboard', label: 'Dashboard', icon: 'dashboard' },
          { id: 'fb_meals', label: 'Meal Planning & Scaling', icon: 'table_restaurant', badge: 'Camp Mode' },
          { id: 'fb_menu', label: 'Menu & Recipes (BOM)', icon: 'menu_book', badge: `${(fb.menuDishes || []).length} items` },
          { id: 'fb_chefs', label: 'Chefs & Brigade', icon: 'skillet', badge: onDutyChefs ? `${onDutyChefs} active` : null },
          { id: 'fb_ingredients', label: 'Ingredients & Stores', icon: 'inventory_2', badge: lowStockCount ? `${lowStockCount} low` : null },
        ],
      },
    ];
  } else if (isMaintenance) {
    const workOrders = state.maintenanceWorkOrders || [];
    const isUnresolved = s => !['REPAIR_COMPLETE', 'VERIFICATION', 'CLOSED', 'RESOLVED', 'CANCELLED'].includes(s);
    const urgentCount = workOrders.filter(w => ['CRITICAL', 'HIGH'].includes(w.priority) && isUnresolved(w.status)).length;
    const openRequestsCount = workOrders.filter(w => !['CLOSED', 'CANCELLED'].includes(w.status)).length;
    const pms = state.preventiveMaintenance || [];
    const pmAlertsCount = pms.filter(p => p.daysUntil <= (p.notifyAdvanceDays || 7)).length;
    const pmBadge = pmAlertsCount ? `${pmAlertsCount} alerts` : (pms.length ? `${pms.length} active` : '4 alerts');

    navSections = [
      {
        title: 'MAINTENANCE',
        items: [
          { id: 'maint_dashboard', label: 'Dashboard', icon: 'dashboard' },
          { id: 'maint_requests', label: 'Maintenance Requests', icon: 'build', badge: urgentCount ? `${urgentCount} urgent` : (openRequestsCount ? `${openRequestsCount} open` : null) },
          { id: 'maint_preventive', label: 'Preventive Maintenance', icon: 'event_repeat', badge: pmBadge },
          { id: 'maint_machines', label: 'Machines', icon: 'precision_manufacturing', badge: '6 units' },
          { id: 'maint_staff', label: 'Engineers or Staff', icon: 'engineering', badge: '4 on duty' },
        ],
      },
    ];
  } else if (isHousekeeping) {
    const dirtyRoomsCount = (state.rooms || []).filter(r => r.status === 'Dirty' || r.status === 'DIRTY').length;
    const pendingRequests = (state.housekeepingRequests || []).filter(r => 
      r.status === 'Unassigned' || r.status === 'Pending' || !r.assignedTo || r.assignedTo.includes('Unassigned')
    );
    const pendingCount = pendingRequests.length;
    const onDutyStaffCount = (state.housekeepingStaff || []).filter(s => s.onDuty).length;
    const openMaintCount = (state.maintenanceTickets || []).filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length;

    navSections = [
      {
        title: 'HOUSEKEEPING',
        items: [
          { id: 'housekeeping', label: 'Dashboard', icon: 'dashboard', badge: dirtyRoomsCount ? `${dirtyRoomsCount} dirty` : null },
          { id: 'hk_dispatch', label: 'Live Dispatch', icon: 'bolt', badge: pendingCount ? `${pendingCount} new` : null },
          { id: 'hk_staff', label: 'Staff Members', icon: 'badge', badge: onDutyStaffCount ? `${onDutyStaffCount} on duty` : null },
          { id: 'hk_house_status', label: 'House Status', icon: 'grid_view', badge: openMaintCount ? `${openMaintCount} maint` : null },
          { id: 'hk_linen', label: 'Linen & Laundry', icon: 'local_laundry_service' },
        ],
      },
    ];
  } else {
    const arrivalsCount = (state.reservations || []).filter(r => r.status === 'Confirmed' || r.status === 'ARRIVED').length;
    const inHouseCount = (state.activeCheckedInGuests || []).length || (state.reservations || []).filter(r => r.status === 'Checked In' || r.status === 'IN_HOUSE').length;
    const pendingServicesCount = (state.serviceRequests || []).filter(s => s.status === 'Pending').length;
    const dirtyRoomsCount = (state.rooms || []).filter(r => r.status === 'Dirty' || r.status === 'DIRTY').length;

    navSections = [
      {
        title: 'FRONT DESK',
        items: [
          { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
          { id: 'bookings', label: 'Bookings', icon: 'book_online', badge: arrivalsCount ? `${arrivalsCount} arr` : (inHouseCount ? `${inHouseCount} in-house` : null) },
          { id: 'house_status', label: 'House Status', icon: 'grid_view' },
          { id: 'room_master', label: 'Room Master', icon: 'meeting_room' },
          { id: 'crm', label: 'Guest Profiles', icon: 'person' },
          { id: 'services', label: 'Services / Requests', icon: 'room_service', badge: pendingServicesCount || null },
          { id: 'housekeeping', label: 'Housekeeping Status', icon: 'cleaning_services', badge: dirtyRoomsCount ? `${dirtyRoomsCount} dirty` : null },
          { id: 'lost_and_found', label: 'Lost & Found', icon: 'inventory_2' },
        ],
      },
    ];
  }

  return `
    <aside class="fixed left-0 top-0 h-full flex flex-col py-5 z-40 bg-surface-bright border-r border-outline-variant w-64 pt-20 hidden md:flex select-none">
      
      <!-- Hotel Monogram & Identity -->
      <div class="px-5 mb-5 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-sm shadow-sm border border-outline-variant">
          GM
        </div>
        <div class="overflow-hidden">
          <h2 class="font-headline-sm text-sm font-bold text-primary leading-tight truncate">The Grand Meridian</h2>
          <p class="font-data-mono text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5">
            ${isFoodBeverage ? 'Food & Beverage Workspace' : isMaintenance ? 'Maintenance Workspace' : isHousekeeping ? 'Housekeeping Workspace' : 'Front Desk Workspace'}
          </p>
        </div>
      </div>

      <!-- Main Navigation Groups -->
      <div class="flex-1 overflow-y-auto px-3 space-y-4 custom-scrollbar">
        ${navSections.map((section) => `
          <div>
            <div class="px-3 mb-1 text-[10px] font-label-caps font-bold tracking-wider text-on-surface-variant/80 uppercase">
              ${section.title}
            </div>
            <div class="space-y-0.5">
              ${section.items.map((item) => {
                const isFrontDesk = !isHousekeeping && !isMaintenance && !isFoodBeverage;
                const isActive = (activeTab === item.id) || 
                  (isFoodBeverage && (
                    (item.id === 'fb_dashboard' && (!activeTab || activeTab === 'fb' || activeTab === 'fb_dashboard' || activeTab === 'dashboard')) ||
                    (item.id === 'fb_meals' && (activeTab === 'fb_meals' || activeTab === 'meals')) ||
                    (item.id === 'fb_menu' && (activeTab === 'fb_menu' || activeTab === 'menu')) ||
                    (item.id === 'fb_chefs' && (activeTab === 'fb_chefs' || activeTab === 'chefs')) ||
                    (item.id === 'fb_ingredients' && (activeTab === 'fb_ingredients' || activeTab === 'ingredients'))
                  )) ||
                  (isFrontDesk && (
                    (item.id === 'dashboard' && (activeTab === 'dashboard')) ||
                    (item.id === 'bookings' && (activeTab === 'bookings' || activeTab === 'reservations' || activeTab === 'online_booking' || activeTab === 'walkin_booking' || activeTab === 'arrivals' || activeTab === 'profiles' || activeTab === 'inhouse')) ||
                    (item.id === 'house_status' && (activeTab === 'house_status' || activeTab === 'room_grid' || activeTab === 'room_matrix' || activeTab === 'room_status')) ||
                    (item.id === 'room_master' && (activeTab === 'room_master' || activeTab === 'room_configuration' || activeTab === 'room_inventory')) ||
                    (item.id === 'crm' && (activeTab === 'crm' || activeTab === 'guests')) ||
                    (item.id === 'services' && (activeTab === 'services' || activeTab === 'requests')) ||
                    (item.id === 'housekeeping' && (activeTab === 'housekeeping' || activeTab === 'hk_tasks' || activeTab === 'hk_inspections' || activeTab === 'hk_requests' || activeTab === 'hk_lostfound')) ||
                    (item.id === 'lost_and_found' && (activeTab === 'lost_and_found' || activeTab === 'lostfound'))
                  )) ||
                  (isHousekeeping && (
                    (item.id === 'housekeeping' && (!activeTab || activeTab === 'housekeeping')) ||
                    (item.id === 'hk_dispatch' && (activeTab === 'hk_dispatch' || activeTab === 'dispatch')) ||
                    (item.id === 'hk_staff' && (activeTab === 'hk_staff' || activeTab === 'staff')) ||
                    (item.id === 'hk_house_status' && (activeTab === 'hk_house_status' || activeTab === 'hk_house' || activeTab === 'hk_room_status')) ||
                    (item.id === 'hk_linen' && (activeTab === 'hk_linen' || activeTab === 'linen' || activeTab === 'hk_laundry' || activeTab === 'hk_linen_inventory'))
                  )) ||
                  (isMaintenance && (
                    (item.id === 'maint_dashboard' && (!activeTab || activeTab === 'maint_dashboard' || activeTab === 'maintenance')) ||
                    (item.id === 'maint_requests' && (activeTab === 'maint_requests' || activeTab === 'maint_workorders' || activeTab === 'maint_urgent')) ||
                    (item.id === 'maint_preventive' && (activeTab === 'maint_preventive' || activeTab === 'maint_pm')) ||
                    (item.id === 'maint_machines' && (activeTab === 'maint_machines' || activeTab === 'maint_assets')) ||
                    (item.id === 'maint_staff' && (activeTab === 'maint_staff' || activeTab === 'maint_team'))
                  ));
                return `
                  <button 
                    class="nav-sidebar-btn w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left group ${
                      isActive
                        ? 'text-primary bg-primary/10 border-l-[3px] border-primary font-bold shadow-xs'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'
                    }" 
                    data-tab="${item.id}"
                  >
                    <div class="flex items-center gap-3 min-w-0">
                      <span class="material-symbols-outlined text-[19px] ${isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}">${item.icon}</span>
                      <span class="truncate">${item.label}</span>
                    </div>
                    ${item.badge !== undefined && item.badge !== null ? `
                      <span class="ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold font-data-mono shrink-0 transition-colors ${
                        isActive 
                          ? 'bg-primary text-white' 
                          : 'bg-surface-container-highest text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary'
                      }">
                        ${item.badge}
                      </span>
                    ` : ''}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Quick Action + Bottom Navigation -->
      <div class="mt-auto px-3 pt-3 border-t border-outline-variant/60 flex flex-col gap-2">
        ${isMaintenance ? `
          <button 
            id="btn-sidebar-new-workorder"
            class="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-2.5 px-3 rounded-lg font-label-caps text-xs font-bold shadow-sm hover:bg-primary/90 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ New Work Order</span>
          </button>
        ` : isHousekeeping ? `
          <button 
            id="btn-sidebar-new-hk-task"
            class="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-2.5 px-3 rounded-lg font-label-caps text-xs font-bold shadow-sm hover:bg-primary/90 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">add_task</span>
            <span>+ Quick Cleaning Task</span>
          </button>
        ` : `
          <button 
            id="btn-sidebar-new-booking"
            class="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-2.5 px-3 rounded-lg font-label-caps text-xs font-bold shadow-sm hover:bg-primary/90 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">add</span>
            <span>+ New Reservation</span>
          </button>
        `}

        <div class="flex flex-col gap-0.5 pt-1">
          <button class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors text-left" id="btn-side-settings">
            <span class="material-symbols-outlined text-[17px]">settings</span>
            <span>Terminal Settings</span>
          </button>
          <button class="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors text-left" id="btn-side-support">
            <span class="material-symbols-outlined text-[17px]">help</span>
            <span>PMS Support</span>
          </button>
        </div>
      </div>

    </aside>
  `;
}

export function bindSidebarEvents() {
  document.querySelectorAll('.nav-sidebar-btn').forEach((btn) => {
    btn.onclick = () => {
      const tab = btn.dataset.tab;
      store.setNavTab(tab);
    };
  });

  const newBookingBtn = document.getElementById('btn-sidebar-new-booking');
  if (newBookingBtn) {
    newBookingBtn.onclick = () => {
      store.setNavTab('bookings');
    };
  }

  const newHkTaskBtn = document.getElementById('btn-sidebar-new-hk-task');
  if (newHkTaskBtn) {
    newHkTaskBtn.onclick = () => {
      const addBtn = document.getElementById('btn-quick-new-task') || document.getElementById('btn-refresh-housekeeping');
      if (addBtn) addBtn.click();
    };
  }

  const newWorkOrderBtn = document.getElementById('btn-sidebar-new-workorder');
  if (newWorkOrderBtn) {
    newWorkOrderBtn.onclick = () => {
      const addBtn = document.getElementById('btn-create-wo') || document.getElementById('btn-new-work-order');
      if (addBtn) addBtn.click();
    };
  }
}
