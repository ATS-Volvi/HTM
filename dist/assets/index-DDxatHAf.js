(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))e(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const d of o.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&e(d)}).observe(document,{childList:!0,subtree:!0});function s(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function e(i){if(i.ep)return;i.ep=!0;const o=s(i);fetch(i.href,o)}})();const te="luxestay_hotel_sync_state_v1",ae=[{id:"401",floor:"4",type:"Executive Suite",status:"Clean",guest:"Lady Eleanor Vance",vip:!0,dnd:!1,housekeeper:"Maria Santos",lastCleaned:"10:30 AM"},{id:"402",floor:"4",type:"Deluxe Ocean View",status:"Inspected",guest:"Mr. James Harrison",vip:!0,dnd:!1,housekeeper:"Elena Gomez",lastCleaned:"09:15 AM"},{id:"403",floor:"4",type:"Premier King",status:"Dirty",guest:"Dr. Aris Thorne",vip:!1,dnd:!1,housekeeper:"Maria Santos",lastCleaned:"Yesterday"},{id:"404",floor:"4",type:"Deluxe Ocean View",status:"In Progress",guest:"Ms. Clara Dupont",vip:!1,dnd:!1,housekeeper:"Elena Gomez",lastCleaned:"In Progress"},{id:"405",floor:"4",type:"Executive Suite",status:"Clean",guest:"Sir William Sterling",vip:!0,dnd:!0,housekeeper:"Carlos Ruiz",lastCleaned:"11:00 AM"},{id:"406",floor:"4",type:"Grand Balcony King",status:"Inspected",guest:"Vacant / Ready",vip:!1,dnd:!1,housekeeper:"Elena Gomez",lastCleaned:"08:45 AM"},{id:"301",floor:"3",type:"Deluxe King",status:"Clean",guest:"Marcus Aurel",vip:!1,dnd:!1,housekeeper:"Fatima Zahra",lastCleaned:"11:20 AM"},{id:"302",floor:"3",type:"Deluxe Twin",status:"Dirty",guest:"Chen Wei & Guest",vip:!1,dnd:!1,housekeeper:"Fatima Zahra",lastCleaned:"Yesterday"},{id:"303",floor:"3",type:"Ocean Suite",status:"In Progress",guest:"Ambassador Al-Mansoor",vip:!0,dnd:!1,housekeeper:"Carlos Ruiz",lastCleaned:"In Progress"},{id:"304",floor:"3",type:"Deluxe King",status:"Inspected",guest:"Sophia Laurent",vip:!1,dnd:!1,housekeeper:"Fatima Zahra",lastCleaned:"10:00 AM"},{id:"305",floor:"3",type:"Premier King",status:"Dirty",guest:"Vacant / Departure",vip:!1,dnd:!1,housekeeper:"Carlos Ruiz",lastCleaned:"Pending"},{id:"306",floor:"3",type:"Deluxe King",status:"Clean",guest:"Julian Croft",vip:!1,dnd:!1,housekeeper:"Fatima Zahra",lastCleaned:"11:45 AM"},{id:"201",floor:"2",type:"Classic King",status:"Clean",guest:"Robert Lang",vip:!1,dnd:!1,housekeeper:"David Kim",lastCleaned:"09:30 AM"},{id:"202",floor:"2",type:"Classic Twin",status:"Inspected",guest:"Anna Becker",vip:!1,dnd:!1,housekeeper:"David Kim",lastCleaned:"10:15 AM"},{id:"203",floor:"2",type:"Courtyard Suite",status:"Dirty",guest:"Oliver Queen",vip:!1,dnd:!1,housekeeper:"David Kim",lastCleaned:"Yesterday"},{id:"204",floor:"2",type:"Classic King",status:"In Progress",guest:"Emma Watson",vip:!1,dnd:!1,housekeeper:"David Kim",lastCleaned:"In Progress"},{id:"501",floor:"5",type:"Presidential Royal Suite",status:"Inspected",guest:"H.R.H. Sheikh Al-Sabah",vip:!0,dnd:!0,housekeeper:"Maria Santos (Senior)",lastCleaned:"08:00 AM"},{id:"502",floor:"5",type:"Crown Penthouse",status:"Clean",guest:"Victoria & David Sterling",vip:!0,dnd:!1,housekeeper:"Maria Santos (Senior)",lastCleaned:"10:45 AM"}],se=[{id:"dish-1",name:"Artisan Continental Breakfast",category:"Breakfast",price:42,time:"20-25 min",tag:"Chef's Selection",calories:"620 kcal",description:"Freshly baked French croissants, pain au chocolat, handcrafted preserves, organic cultured butter, seasonal berries, and freshly squeezed Valencia orange juice with choice of Illy espresso.",image:"https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80"},{id:"dish-2",name:"Eggs Royale with Caviar",category:"Breakfast",price:58,time:"25-30 min",tag:"Signature",calories:"710 kcal",description:"Two poached organic heritage eggs, Scottish smoked salmon, toasted brioche muffin, Meyer lemon hollandaise sauce, garnished with Oscietra Royal Caviar and chives.",image:"https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80"},{id:"dish-3",name:"Avocado Tartine & Poached Eggs",category:"Breakfast",price:34,time:"15-20 min",tag:"Healthy",calories:"490 kcal",description:"Hass avocado mash, heirloom cherry tomatoes, Persian feta, toasted sourdough, pickled shallots, microgreens, and two organic poached eggs with dukkah spice.",image:"https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&w=600&q=80"},{id:"dish-4",name:"Wagyu Beef Burger (A5)",category:"Mains",price:48,time:"25-30 min",tag:"Bestseller",calories:"890 kcal",description:"220g Miyazaki Wagyu patty, aged Gruyère, black truffle aioli, caramelized shallot relish, butter lettuce on a toasted brioche bun, served with rosemary salted triple-cooked fries.",image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"},{id:"dish-5",name:"Pan-Seared Chilean Sea Bass",category:"Mains",price:64,time:"30-35 min",tag:"Signature",calories:"560 kcal",description:"Wild caught sea bass, saffron cauliflower purée, braised baby fennel, champagne beurre blanc, and crispy sea asparagus.",image:"https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80"},{id:"dish-6",name:"Truffle Tagliolini Pasta",category:"Mains",price:52,time:"20-25 min",tag:"Vegetarian",calories:"680 kcal",description:"Handcrafted fresh egg tagliolini, 36-month Parmigiano-Reggiano cream, Normandy butter, topped with freshly shaved Norcia black winter truffle.",image:"https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=600&q=80"},{id:"dish-7",name:"Valrhona Grand Cru Soufflé",category:"Desserts",price:26,time:"20 min",tag:"House Special",calories:"420 kcal",description:"Warm 70% dark chocolate soufflé with molten center, Tahitian vanilla bean anglaise, and gold leaf hazelnut gelato.",image:"https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=600&q=80"},{id:"dish-8",name:"Dom Pérignon Vintage 2013 (750ml)",category:"Beverages",price:380,time:"Instant",tag:"Cellar Selection",calories:"150 kcal/glass",description:"Iconic prestige Champagne, crisp elegance with notes of citrus, brioche, and smoky mineral finish. Served chilled in crystal flutes with an ice bucket.",image:"https://images.unsplash.com/photo-1569919659476-f0852f6834b7?auto=format&fit=crop&w=600&q=80"}],ie=[{id:"TSK-1081",title:"Room 402 - Refresh Linens & Towels",category:"Housekeeping",room:"402",guest:"Mr. James Harrison",priority:"Urgent",status:"In Progress",timeDue:"11:00 AM",assignee:"Elena Gomez",details:"VIP guest requested extra plush bath sheets and lavender aromatherapy spray."},{id:"TSK-1082",title:"Room 303 - Replace AC Thermostat Sensor",category:"Maintenance",room:"303",guest:"Ambassador Al-Mansoor",priority:"High",status:"Pending",timeDue:"11:30 AM",assignee:"Marcus Vance (HVAC)",details:"Guest reported ambient temperature reads 24°C despite being set to 20°C."},{id:"TSK-1083",title:"Room 501 - Presidential Turndown & Champagne",category:"Housekeeping",room:"501",guest:"H.R.H. Sheikh Al-Sabah",priority:"Urgent",status:"Pending",timeDue:"12:00 PM",assignee:"Maria Santos",details:"Prepare evening turndown, floral refresh, and iced vintage Dom Pérignon setup."},{id:"TSK-1084",title:"Room 401 - High-Speed Wi-Fi Router Check",category:"Maintenance",room:"401",guest:"Lady Eleanor Vance",priority:"Normal",status:"Completed",timeDue:"09:45 AM",assignee:"Alex Rivera (IT)",details:"Verified dedicated AP bandwidth at 850 Mbps symmetrical."},{id:"TSK-1085",title:"Room 402 - Artisan Breakfast Delivery",category:"Dining",room:"402",guest:"Mr. James Harrison",priority:"High",status:"In Progress",timeDue:"08:30 AM",assignee:"Pierre Dubois (Butler)",details:"Cart #4 ready. Hot cloche covers and fresh orange juice."}],ne=[{id:"INV-01",name:"Egyptian Cotton Bath Sheet (800 GSM)",category:"Linens",stock:142,minThreshold:50,unit:"pcs",status:"Optimal",location:"Linen Closet 4F"},{id:"INV-02",name:"Luxury Goose Feather Pillows",category:"Linens",stock:24,minThreshold:30,unit:"pcs",status:"Low Stock",location:"Central Laundry"},{id:"INV-03",name:"Acqua Di Parma Shower Gel 100ml",category:"Amenities",stock:380,minThreshold:100,unit:"bottles",status:"Optimal",location:"Housekeeping Hub"},{id:"INV-04",name:"Diptyque Hand Soap Bars",category:"Amenities",stock:18,minThreshold:40,unit:"bars",status:"Critical",location:"Housekeeping Hub"},{id:"INV-05",name:"San Pellegrino Sparkling 750ml",category:"Minibar",stock:95,minThreshold:40,unit:"bottles",status:"Optimal",location:"Minibar Pantry 3F"},{id:"INV-06",name:"Artisan Lavender Pillow Mist",category:"Amenities",stock:12,minThreshold:25,unit:"bottles",status:"Critical",location:"Linen Depot"}],oe=[{id:"ORD-9942",createdAt:new Date(Date.now()-15*60*1e3).toISOString(),room:"402",guestName:"Mr. James Harrison",items:[{id:"dish-1",name:"Artisan Continental Breakfast",price:42,quantity:1},{id:"dish-3",name:"Avocado Tartine & Poached Eggs",price:34,quantity:1}],subtotal:76,serviceCharge:13.68,tip:10,total:99.68,deliveryType:"Room Delivery (ASAP)",notes:"Please bring hot milk on the side.",status:"preparing",etaMinutes:12,server:{name:"Pierre Dubois",role:"Head In-Room Butler",phone:"+1 (555) 019-4821"}}],re=[{id:"REQ-402-1",category:"Housekeeping",title:"Daily Room Refresh & Towels",time:"Today at 11:00 AM",status:"Scheduled",notes:"Preference: Lavender aromatherapy spray and extra espresso capsules.",icon:"cleaning_services"},{id:"REQ-402-2",category:"Valet",title:"Express Suit Pressing",time:"Today at 02:00 PM",status:"In Progress",notes:"2 2-piece navy suits for evening banquet.",icon:"local_laundry_service"}];class De{constructor(){this.subscribers=new Set,this.state=this.loadState()}loadState(){var t,s,e,i,o;try{const d=localStorage.getItem(te);if(d){const l=JSON.parse(d);return{...l,rooms:(t=l.rooms)!=null&&t.length?l.rooms:ae,menu:se,tasks:(s=l.tasks)!=null&&s.length?l.tasks:ie,inventory:(e=l.inventory)!=null&&e.length?l.inventory:ne,orders:(i=l.orders)!=null&&i.length?l.orders:oe,requests:(o=l.requests)!=null&&o.length?l.requests:re}}}catch(d){console.warn("Could not parse saved state, using initial state",d)}return{currentMode:"guest",currentView:"guest-home",selectedFloor:"4",selectedCategory:"All",dndActive:!1,guestProfile:{name:"Mr. James Harrison",room:"402",roomType:"Deluxe Ocean View",checkIn:"Aug 29, 2026",checkOut:"Sep 05, 2026",tier:"Platinum Elite VIP"},cart:[],rooms:ae,menu:se,tasks:ie,inventory:ne,orders:oe,requests:re,activeModal:null,selectedRoomDetails:null,selectedItemForModal:null,selectedTaskForModal:null}}saveState(){try{localStorage.setItem(te,JSON.stringify(this.state))}catch(t){console.error("Error persisting state",t)}}subscribe(t){return this.subscribers.add(t),()=>this.subscribers.delete(t)}notify(){this.saveState(),this.subscribers.forEach(t=>t(this.state))}setMode(t){this.state.currentMode=t,t==="guest"&&!this.state.currentView.startsWith("guest-")&&!["dining","checkout","order-tracking","schedule-service","report-issue"].includes(this.state.currentView)?this.state.currentView="guest-home":t==="staff"&&!this.state.currentView.startsWith("staff-")&&(this.state.currentView="staff-rooms"),this.notify()}setView(t){this.state.currentView=t,window.scrollTo({top:0,behavior:"smooth"}),this.notify()}toggleDND(){this.state.dndActive=!this.state.dndActive;const t=this.state.rooms.find(s=>s.id==="402");t&&(t.dnd=this.state.dndActive,this.state.dndActive?t.status="DND":t.status="Inspected"),this.notify()}addToCart(t,s=1,e=""){const i=this.state.cart.findIndex(o=>o.id===t.id);i>-1?this.state.cart[i].quantity+=s:this.state.cart.push({...t,quantity:s,specialInstructions:e}),this.notify()}updateCartQuantity(t,s){const e=this.state.cart.findIndex(i=>i.id===t);e>-1&&(this.state.cart[e].quantity+=s,this.state.cart[e].quantity<=0&&this.state.cart.splice(e,1),this.notify())}clearCart(){this.state.cart=[],this.notify()}createOrder(t){const s={id:"ORD-"+Math.floor(1e3+Math.random()*9e3),createdAt:new Date().toISOString(),room:this.state.guestProfile.room,guestName:this.state.guestProfile.name,items:[...this.state.cart],subtotal:t.subtotal,serviceCharge:t.serviceCharge,tip:t.tip,total:t.total,deliveryType:t.deliveryType||"Room Delivery (ASAP)",notes:t.notes||"",status:"received",etaMinutes:25,server:{name:"Pierre Dubois",role:"Head In-Room Butler",phone:"+1 (555) 019-4821"}};return this.state.orders.unshift(s),this.state.cart=[],this.state.tasks.unshift({id:"TSK-"+Math.floor(2e3+Math.random()*8e3),title:`Room ${s.room} - In-Room Dining Order (${s.items.length} items)`,category:"Dining",room:s.room,guest:s.guestName,priority:"High",status:"Pending",timeDue:"In 25 min",assignee:"Pierre Dubois",details:s.items.map(e=>`${e.quantity}x ${e.name}`).join(", ")}),this.state.currentView="order-tracking",this.notify(),s}advanceOrderStatus(t){const s=this.state.orders.find(e=>e.id===t);if(s){const e={received:"preparing",preparing:"delivering",delivering:"delivered"};e[s.status]&&(s.status=e[s.status],s.status==="delivered"?s.etaMinutes=0:s.status==="delivering"&&(s.etaMinutes=5),this.notify())}}updateRoomStatus(t,s,e=null){const i=this.state.rooms.find(o=>o.id===t);i&&(i.status=s,e&&(i.housekeeper=e),t==="402"&&(this.state.dndActive=s==="DND",i.dnd=this.state.dndActive),this.notify())}toggleRoomDND(t){const s=this.state.rooms.find(e=>e.id===t);s&&(s.dnd=!s.dnd,s.status=s.dnd?"DND":"Clean",t==="402"&&(this.state.dndActive=s.dnd),this.notify())}addServiceRequest(t){const s={id:"REQ-"+Math.floor(100+Math.random()*900),category:t.category||"Housekeeping",title:t.title,time:t.time||"Today",status:"Scheduled",notes:t.notes||"",icon:t.icon||"cleaning_services"};return this.state.requests.unshift(s),this.state.tasks.unshift({id:"TSK-"+Math.floor(3e3+Math.random()*7e3),title:`Room ${this.state.guestProfile.room} - ${s.title}`,category:s.category==="Maintenance"?"Maintenance":"Housekeeping",room:this.state.guestProfile.room,guest:this.state.guestProfile.name,priority:t.priority||"High",status:"Pending",timeDue:t.timeSlot||"Today 2:00 PM",assignee:"Unassigned",details:t.notes}),this.notify(),s}updateTaskStatus(t,s){const e=this.state.tasks.find(i=>i.id===t);e&&(e.status=s,this.notify())}updateInventoryStock(t,s){const e=this.state.inventory.find(i=>i.id===t);e&&(e.stock=Math.max(0,e.stock+s),e.stock===0?e.status="Out of Stock":e.stock<e.minThreshold?e.status="Critical":e.stock<=e.minThreshold*1.5?e.status="Low Stock":e.status="Optimal",this.notify())}setFloor(t){this.state.selectedFloor=t,this.notify()}openModal(t,s={}){this.state.activeModal={type:t,data:s},this.notify()}closeModal(){this.state.activeModal=null,this.notify()}}const c=new De;function S(r,t="",s="check_circle"){let e=document.getElementById("luxestay-toast-container");e||(e=document.createElement("div"),e.id="luxestay-toast-container",e.className="toast-container",document.body.appendChild(e));const i=document.createElement("div");i.className="toast",i.innerHTML=`
    <span class="material-symbols-outlined toast-icon">${s}</span>
    <div style="flex: 1;">
      <div class="toast-title">${r}</div>
      ${t?`<div class="toast-desc">${t}</div>`:""}
    </div>
  `,e.appendChild(i),setTimeout(()=>{i.style.opacity="0",i.style.transform="translateY(-10px)",i.style.transition="all 0.3s ease",setTimeout(()=>i.remove(),300)},3500)}function Be(r){const t=r.currentMode==="guest";r.orders.length>0;const s=r.tasks.filter(e=>e.status==="Pending").length;return`
    <header class="app-header">
      <div style="display: flex; align-items: center; gap: 10px;">
        <div style="width: 36px; height: 36px; border-radius: 50%; overflow: hidden; border: 1.5px solid var(--gold-accent); flex-shrink: 0; box-shadow: var(--shadow-sm);">
          <img 
            src="${t?"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}" 
            alt="Profile Avatar" 
            style="width: 100%; height: 100%; object-fit: cover;"
          />
        </div>
        <div>
          <div class="label-bold" style="color: var(--secondary); font-size: 10px;">
            ${t?"Room 402 • Ocean View":"Duty Supervisor • Ops"}
          </div>
          <div style="font-family: var(--font-serif); font-size: 14px; font-weight: 700; color: var(--primary);">
            ${t?"Mr. Harrison":"Elena Gomez"}
          </div>
        </div>
      </div>

      <!-- Mode Switcher -->
      <div class="mode-badge-switch" id="header-mode-switcher">
        <button class="mode-tab ${t?"active":""}" data-mode="guest">
          <span class="material-symbols-outlined" style="font-size: 14px;">concierge</span>
          Guest
        </button>
        <button class="mode-tab ${t?"":"active"}" data-mode="staff">
          <span class="material-symbols-outlined" style="font-size: 14px;">tune</span>
          Staff Ops
        </button>
      </div>

      <div style="display: flex; align-items: center; gap: 4px;">
        <button class="btn-icon" id="notification-btn" title="Notifications" style="position: relative;">
          <span class="material-symbols-outlined" style="color: var(--primary);">notifications</span>
          ${t&&r.dndActive?`
            <span style="position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; background: var(--error); border-radius: 50%; border: 1.5px solid white;"></span>
          `:!t&&s>0?`
            <span style="position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; background: var(--warning); border-radius: 50%; border: 1.5px solid white;"></span>
          `:""}
        </button>
      </div>
    </header>
  `}function Ae(){document.querySelectorAll(".mode-tab").forEach(s=>{s.addEventListener("click",e=>{const i=s.dataset.mode;c.setMode(i),S(i==="guest"?"Switched to Guest Suite Portal":"Switched to Staff Operations Hub",i==="guest"?"Managing Room 402 experience":"Live hotel dispatch & supervisor tools active",i==="guest"?"bed":"admin_panel_settings")})});const t=document.getElementById("notification-btn");t&&t.addEventListener("click",()=>{const s=c.state;if(s.currentMode==="guest")S("Active Concierge Updates",s.dndActive?"Privacy mode enabled (Do Not Disturb)":"All hotel services are actively available for Room 402.","notifications_active");else{const e=s.tasks.filter(i=>i.status==="Pending").length;S("Staff Dispatch Summary",`${e} pending operations tasks in current queue.`,"assignment")}})}function Pe(r){const t=r.currentMode==="guest",s=r.currentView;if(t){const e=r.cart.reduce((o,d)=>o+d.quantity,0),i=r.requests.filter(o=>o.status!=="Completed").length;return`
      <nav class="bottom-nav">
        <button class="nav-item ${s==="guest-home"?"active":""}" data-view="guest-home">
          <span class="material-symbols-outlined">home</span>
          <span>Home</span>
        </button>
        <button class="nav-item ${s==="dining"||s==="checkout"||s==="order-tracking"?"active":""}" data-view="dining">
          <span class="material-symbols-outlined">restaurant</span>
          <span>Dining</span>
          ${e>0?`<span class="nav-badge">${e}</span>`:""}
        </button>
        <button class="nav-item ${s==="schedule-service"||s==="report-issue"?"active":""}" data-view="schedule-service">
          <span class="material-symbols-outlined">room_service</span>
          <span>Services</span>
        </button>
        <button class="nav-item ${s==="guest-requests"?"active":""}" data-view="guest-requests">
          <span class="material-symbols-outlined">receipt_long</span>
          <span>Requests</span>
          ${i>0?`<span class="nav-badge" style="background: var(--primary);">${i}</span>`:""}
        </button>
      </nav>
    `}else{const e=r.tasks.filter(o=>o.priority==="Urgent"&&o.status!=="Completed").length,i=r.inventory.filter(o=>o.status==="Critical"||o.status==="Low Stock").length;return`
      <nav class="bottom-nav" style="background: #ffffff;">
        <button class="nav-item ${s==="staff-rooms"?"active":""}" data-view="staff-rooms">
          <span class="material-symbols-outlined">grid_view</span>
          <span>Rooms</span>
        </button>
        <button class="nav-item ${s==="staff-tasks"?"active":""}" data-view="staff-tasks">
          <span class="material-symbols-outlined">assignment</span>
          <span>Tasks</span>
          ${e>0?`<span class="nav-badge">${e}</span>`:""}
        </button>
        <button class="nav-item ${s==="staff-maintenance"?"active":""}" data-view="staff-maintenance">
          <span class="material-symbols-outlined">handyman</span>
          <span>Dispatch</span>
        </button>
        <button class="nav-item ${s==="staff-inventory"?"active":""}" data-view="staff-inventory">
          <span class="material-symbols-outlined">inventory_2</span>
          <span>Stock</span>
          ${i>0?`<span class="nav-badge" style="background: var(--warning);">${i}</span>`:""}
        </button>
        <button class="nav-item ${s==="staff-shifts"||s==="staff-kpis"||s==="staff-handover"?"active":""}" data-view="staff-shifts">
          <span class="material-symbols-outlined">groups</span>
          <span>Shifts</span>
        </button>
      </nav>
    `}}function Te(){document.querySelectorAll(".nav-item").forEach(t=>{t.addEventListener("click",()=>{const s=t.dataset.view;s&&c.setView(s)})})}function Re(r){if(!r.activeModal)return"";const{type:t,data:s}=r.activeModal;if(t==="room-details"){const e=r.rooms.find(i=>i.id===s.roomId);return e?`
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-sheet">
          <div class="modal-drag-pill"></div>
          <div class="modal-header">
            <div>
              <div class="label-bold" style="color: var(--secondary);">Floor ${e.floor} • Room Details</div>
              <h3 class="headline-md" style="font-size: 20px;">Room ${e.id} — ${e.type}</h3>
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
                  <span class="badge ${e.status==="Clean"?"badge-clean":e.status==="Dirty"?"badge-dirty":e.status==="Inspected"?"badge-inspected":e.status==="DND"?"badge-dnd":e.status==="In Progress"?"badge-progress":"badge-vip"}">${e.status}</span>
                </div>
              </div>
              <div style="text-align: right;">
                <div class="label-bold" style="font-size: 10px;">Guest Occupant</div>
                <div style="font-weight: 600; font-size: 13px; color: var(--primary);">
                  ${e.guest} ${e.vip?'<span class="badge badge-vip" style="font-size: 9px; padding: 2px 6px;">VIP</span>':""}
                </div>
              </div>
            </div>

            <!-- Quick Status Change Actions -->
            <div>
              <div class="label-bold" style="margin-bottom: 8px;">Update Room Status</div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                <button class="btn-secondary status-pick-btn ${e.status==="Clean"?"active":""}" data-status="Clean" style="padding: 8px 4px; font-size: 11px;">
                  <span class="material-symbols-outlined" style="font-size: 16px; color: #1b5e20;">sparkles</span> Clean
                </button>
                <button class="btn-secondary status-pick-btn ${e.status==="Inspected"?"active":""}" data-status="Inspected" style="padding: 8px 4px; font-size: 11px;">
                  <span class="material-symbols-outlined" style="font-size: 16px; color: #0d47a1;">verified</span> Inspected
                </button>
                <button class="btn-secondary status-pick-btn ${e.status==="In Progress"?"active":""}" data-status="In Progress" style="padding: 8px 4px; font-size: 11px;">
                  <span class="material-symbols-outlined" style="font-size: 16px; color: #6a1b9a;">hourglass_top</span> In Progress
                </button>
                <button class="btn-secondary status-pick-btn ${e.status==="Dirty"?"active":""}" data-status="Dirty" style="padding: 8px 4px; font-size: 11px;">
                  <span class="material-symbols-outlined" style="font-size: 16px; color: #c62828;">cleaning_bucket</span> Dirty
                </button>
                <button class="btn-secondary status-pick-btn ${e.status==="DND"?"active":""}" data-status="DND" style="padding: 8px 4px; font-size: 11px;">
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
                <option value="Elena Gomez" ${e.housekeeper==="Elena Gomez"?"selected":""}>Elena Gomez (Floor 4 Lead)</option>
                <option value="Maria Santos" ${e.housekeeper==="Maria Santos"?"selected":""}>Maria Santos (Senior VIP Butler)</option>
                <option value="Fatima Zahra" ${e.housekeeper==="Fatima Zahra"?"selected":""}>Fatima Zahra (Floor 3 Housekeeping)</option>
                <option value="Carlos Ruiz" ${e.housekeeper==="Carlos Ruiz"?"selected":""}>Carlos Ruiz (Turnaround Specialist)</option>
                <option value="David Kim" ${e.housekeeper==="David Kim"?"selected":""}>David Kim (Floor 2 Lead)</option>
              </select>
            </div>

            <!-- Last Cleaned info -->
            <div style="font-size: 12px; color: var(--on-surface-variant); display: flex; justify-content: space-between;">
              <span>Last service record: <strong>${e.lastCleaned}</strong></span>
              <span>Floor Zone: <strong>Wing A North</strong></span>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" style="flex: 1;" id="modal-cancel-btn">Cancel</button>
            <button class="btn-primary" style="flex: 1;" id="modal-save-room-btn" data-room-id="${e.id}">Save Changes</button>
          </div>
        </div>
      </div>
    `:""}if(t==="item-customize"){const e=s.dish;return e?`
      <div class="modal-overlay" id="modal-overlay">
        <div class="modal-sheet">
          <div class="modal-drag-pill"></div>
          <div class="modal-header">
            <div>
              <div class="label-bold" style="color: var(--secondary);">${e.category} • In-Room Dining</div>
              <h3 class="headline-md" style="font-size: 18px;">${e.name}</h3>
            </div>
            <button class="btn-icon" id="modal-close-btn">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <div class="modal-body">
            <div style="height: 160px; border-radius: var(--radius-md); overflow: hidden; position: relative;">
              <img src="${e.image}" alt="${e.name}" style="width: 100%; height: 100%; object-fit: cover;" />
              <div style="position: absolute; bottom: 8px; right: 8px; background: rgba(4,22,39,0.8); color: white; padding: 4px 8px; border-radius: var(--radius-sm); font-size: 11px; font-weight: 600;">
                $${e.price.toFixed(2)}
              </div>
            </div>
            <p class="body-sm" style="color: var(--on-surface-variant); line-height: 1.5;">${e.description}</p>

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
              <span class="material-symbols-outlined">shopping_bag</span> Add to Order — $<span id="modal-total-price">${e.price.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>
    `:""}return""}function Le(){var T,V;const r=document.getElementById("modal-overlay"),t=document.getElementById("modal-close-btn"),s=document.getElementById("modal-cancel-btn");r&&r.addEventListener("click",C=>{C.target===r&&c.closeModal()}),t&&t.addEventListener("click",()=>c.closeModal()),s&&s.addEventListener("click",()=>c.closeModal());let e=null;const i=document.querySelectorAll(".status-pick-btn");i.forEach(C=>{C.addEventListener("click",()=>{i.forEach(w=>w.classList.remove("active")),C.classList.add("active"),e=C.dataset.status})});const o=document.getElementById("modal-save-room-btn");o&&o.addEventListener("click",()=>{var j;const C=o.dataset.roomId,w=(j=document.getElementById("housekeeper-select"))==null?void 0:j.value,q=c.state.rooms.find(G=>G.id===C),R=e||q.status;c.updateRoomStatus(C,R,w),c.closeModal(),S(`Room ${C} Updated`,`Status changed to ${R} (Assigned: ${w})`,"check_circle")});const d=document.getElementById("modal-dnd-toggle-btn");d&&d.addEventListener("click",()=>{var q,R;const w=(R=(q=c.state.activeModal)==null?void 0:q.data)==null?void 0:R.roomId;w&&(c.toggleRoomDND(w),c.closeModal(),S(`Room ${w} DND Updated`,"Do Not Disturb status has been toggled","privacy_tip"))});let l=1;const b=document.getElementById("modal-qty-minus"),E=document.getElementById("modal-qty-plus"),u=document.getElementById("modal-qty-display"),D=document.getElementById("modal-total-price"),O=document.getElementById("modal-add-cart-btn");if(b&&E&&u){const C=(V=(T=c.state.activeModal)==null?void 0:T.data)==null?void 0:V.dish;b.addEventListener("click",()=>{l>1&&(l--,u.textContent=l,C&&D&&(D.textContent=(C.price*l).toFixed(2)))}),E.addEventListener("click",()=>{l++,u.textContent=l,C&&D&&(D.textContent=(C.price*l).toFixed(2))})}O&&O.addEventListener("click",()=>{var q,R,j;const C=(R=(q=c.state.activeModal)==null?void 0:q.data)==null?void 0:R.dish,w=((j=document.getElementById("dish-instructions"))==null?void 0:j.value)||"";C&&(c.addToCart(C,l,w),c.closeModal(),S("Item Added to Order",`${l}x ${C.name} added to cart`,"restaurant"))})}function le(r){const t=r.dndActive;r.requests.filter(e=>e.status!=="Completed");const s=r.orders.filter(e=>e.status!=="delivered");return`
    <div class="app-content animate-fade-in">
      <!-- Welcome Hero Section -->
      <section>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
          <div class="label-bold" style="color: var(--secondary); letter-spacing: 0.1em;">
            ROOM 402 • DELUXE OCEAN VIEW
          </div>
          <span class="badge badge-vip">PLATINUM VIP</span>
        </div>
        <h2 class="display-title" style="margin-bottom: 6px;">
          Good Morning,<br /><span class="gold-text">Mr. Harrison.</span>
        </h2>
        <p class="body-sm" style="color: var(--on-surface-variant);">
          We hope you are enjoying your stay at The Grand Astoria.
        </p>
      </section>

      <!-- Prominent Do Not Disturb Privacy Mode Toggle -->
      <section>
        <div class="glass-card" style="padding: 16px 20px; border-left: 4px solid ${t?"var(--error)":"var(--on-tertiary-container)"};">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 44px; height: 44px; border-radius: 50%; background: ${t?"var(--error-container)":"var(--surface-container-high)"}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <span class="material-symbols-outlined" style="color: ${t?"var(--error)":"var(--primary)"}; font-size: 24px;">
                  ${t?"do_not_disturb_on":"privacy_tip"}
                </span>
              </div>
              <div>
                <h3 class="headline-sm" style="font-size: 16px; margin-bottom: 2px;">
                  ${t?"Privacy Mode Active":"Privacy & Service Mode"}
                </h3>
                <p class="body-sm" style="color: ${t?"var(--error)":"var(--on-surface-variant)"}; font-weight: 500;">
                  ${t?"Do Not Disturb is ON. Staff will not knock.":"Currently open to housekeeping & deliveries."}
                </p>
              </div>
            </div>
            <label class="dnd-switch">
              <input type="checkbox" id="home-dnd-toggle" ${t?"checked":""} />
              <span class="dnd-slider"></span>
            </label>
          </div>
        </div>
      </section>

      <!-- Active Requests / Order Tracking Snippet -->
      ${s.length>0?`
        <section>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div class="label-bold">Live Dining Order</div>
            <button class="btn-secondary" id="track-order-btn" style="padding: 4px 10px; font-size: 11px; text-transform: uppercase;">
              View Live Tracker
            </button>
          </div>
          <div class="glass-card-navy" style="padding: 16px 18px; border-radius: var(--radius-lg); position: relative; overflow: hidden;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <span class="badge badge-gold" style="font-size: 10px;">${s[0].deliveryType}</span>
              <span style="font-size: 12px; font-weight: 600; color: #ffe088;">ETA: ~${s[0].etaMinutes} Mins</span>
            </div>
            <h4 style="font-family: var(--font-serif); font-size: 17px; margin-bottom: 4px;">
              ${s[0].items.map(e=>`${e.quantity}x ${e.name}`).join(", ")}
            </h4>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 12px; border-top: 1px solid rgba(255,255,255,0.15); pt-2; padding-top: 8px;">
              <span style="font-size: 12px; opacity: 0.8;">Butler: ${s[0].server.name}</span>
              <span style="font-weight: 700; color: var(--secondary-container);">$${s[0].total.toFixed(2)}</span>
            </div>
          </div>
        </section>
      `:""}

      <!-- Scheduled Housekeeping Card -->
      <section>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <div class="label-bold">Active Service Schedule</div>
          <span style="font-size: 11px; color: var(--on-surface-variant);">1 Upcoming</span>
        </div>
        <div class="glass-card" style="padding: 16px; border-left: 4px solid var(--primary);">
          <div style="display: flex; align-items: flex-start; gap: 12px;">
            <span class="material-symbols-outlined" style="color: var(--primary); margin-top: 2px;">cleaning_services</span>
            <div style="flex: 1;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h4 class="headline-sm" style="font-size: 15px;">Daily Suite Refresh</h4>
                <span class="badge badge-inspected" style="font-size: 10px;">Today • 11:00 AM</span>
              </div>
              <p class="body-sm" style="margin: 4px 0 10px 0; color: var(--on-surface-variant);">
                Full turn-down, organic linen refresh, and Acqua Di Parma restocking.
              </p>
              <div style="display: flex; gap: 8px;">
                <button class="btn-secondary" id="reschedule-service-btn" style="padding: 6px 12px; font-size: 11px;">
                  Reschedule
                </button>
                <button class="btn-secondary" id="report-issue-btn" style="padding: 6px 12px; font-size: 11px; color: var(--error);">
                  Report Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Actions Bento Grid -->
      <section>
        <div class="label-bold" style="margin-bottom: 12px;">At Your Service</div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
          <!-- In-Room Dining Tile -->
          <div class="glass-card bento-action-tile" data-target="dining" style="cursor: pointer; position: relative; height: 160px; overflow: hidden; border-radius: var(--radius-lg); grid-column: span 2; display: flex; flex-direction: column; justify-content: flex-end; padding: 16px; color: white;">
            <img 
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80" 
              alt="In-Room Dining" 
              style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; transition: transform 0.5s ease;"
              class="tile-bg-img"
            />
            <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(4,22,39,0.92) 0%, rgba(4,22,39,0.3) 60%, transparent 100%); z-index: 1;"></div>
            <div style="position: relative; z-index: 2;">
              <div style="display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); margin-bottom: 6px;">
                <span class="material-symbols-outlined" style="font-size: 18px;">restaurant</span>
              </div>
              <h4 style="font-family: var(--font-serif); font-size: 18px; font-weight: 700; margin-bottom: 2px;">In-Room Dining</h4>
              <p style="font-size: 12px; opacity: 0.9;">Gourmet Breakfast, A5 Wagyu & Fine Cellar Wines →</p>
            </div>
          </div>

          <!-- Housekeeping Tile -->
          <div class="glass-card bento-action-tile" data-target="schedule-service" style="cursor: pointer; position: relative; height: 140px; overflow: hidden; border-radius: var(--radius-lg); display: flex; flex-direction: column; justify-content: flex-end; padding: 14px; color: white;">
            <img 
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80" 
              alt="Housekeeping" 
              style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;"
              class="tile-bg-img"
            />
            <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(4,22,39,0.92) 0%, rgba(4,22,39,0.3) 60%, transparent 100%); z-index: 1;"></div>
            <div style="position: relative; z-index: 2;">
              <span class="material-symbols-outlined" style="font-size: 20px; margin-bottom: 4px;">cleaning_services</span>
              <h4 style="font-family: var(--font-serif); font-size: 15px; font-weight: 600;">Housekeeping</h4>
              <p style="font-size: 11px; opacity: 0.85;">Towels & Turndown</p>
            </div>
          </div>

          <!-- Laundry & Valet Tile -->
          <div class="glass-card bento-action-tile" data-target="schedule-service" style="cursor: pointer; position: relative; height: 140px; overflow: hidden; border-radius: var(--radius-lg); display: flex; flex-direction: column; justify-content: flex-end; padding: 14px; color: white;">
            <img 
              src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=500&q=80" 
              alt="Laundry" 
              style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;"
              class="tile-bg-img"
            />
            <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(4,22,39,0.92) 0%, rgba(4,22,39,0.3) 60%, transparent 100%); z-index: 1;"></div>
            <div style="position: relative; z-index: 2;">
              <span class="material-symbols-outlined" style="font-size: 20px; margin-bottom: 4px;">local_laundry_service</span>
              <h4 style="font-family: var(--font-serif); font-size: 15px; font-weight: 600;">Valet & Laundry</h4>
              <p style="font-size: 11px; opacity: 0.85;">Suit Pressing</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Instant Hotel Concierge Assistance -->
      <section style="margin-bottom: 12px;">
        <div class="glass-card" style="padding: 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; background: linear-gradient(135deg, #ffffff 0%, #fef8e7 100%); border: 1px solid var(--secondary-fixed);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--secondary-container); display: flex; align-items: center; justify-content: center; color: var(--on-secondary-container);">
              <span class="material-symbols-outlined">concierge</span>
            </div>
            <div>
              <div style="font-weight: 700; font-size: 13px; color: var(--primary);">24/7 Dedicated Butler</div>
              <div class="body-sm">Press to call Front Desk or request car</div>
            </div>
          </div>
          <button class="btn-primary" id="call-butler-btn" style="padding: 8px 14px; font-size: 11px;">
            <span class="material-symbols-outlined" style="font-size: 16px;">call</span> Call
          </button>
        </div>
      </section>
    </div>
  `}function de(){const r=document.getElementById("home-dnd-toggle");r&&r.addEventListener("change",()=>{c.toggleDND();const d=c.state.dndActive;S(d?"Do Not Disturb Enabled":"Privacy Mode Disabled",d?"Staff supervisor and door sensors notified.":"Housekeeping and delivery access resumed.",d?"do_not_disturb_on":"notifications_active")});const t=document.getElementById("track-order-btn");t&&t.addEventListener("click",()=>c.setView("order-tracking"));const s=document.getElementById("reschedule-service-btn");s&&s.addEventListener("click",()=>c.setView("schedule-service"));const e=document.getElementById("report-issue-btn");e&&e.addEventListener("click",()=>c.setView("report-issue")),document.querySelectorAll(".bento-action-tile").forEach(d=>{d.addEventListener("click",()=>{const l=d.dataset.target;l&&c.setView(l)})});const o=document.getElementById("call-butler-btn");o&&o.addEventListener("click",()=>{S("Connecting to Butler","Connecting Room 402 to Head Butler Pierre Dubois...","ring_volume")})}function Oe(r){const t=r.selectedCategory||"All",s=["All","Breakfast","Mains","Desserts","Beverages"],e=r.menu,i=t==="All"?e:e.filter(l=>l.category===t),o=r.cart.reduce((l,b)=>l+b.quantity,0),d=r.cart.reduce((l,b)=>l+b.price*b.quantity,0);return`
    <div class="app-content animate-fade-in" style="padding-bottom: ${o>0?"110px":"40px"};">
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
        ${s.map(l=>`
          <button class="category-pill ${l===t?"active":""}" data-cat="${l}">
            ${l}
          </button>
        `).join("")}
      </div>

      <!-- Menu Items Grid -->
      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${i.map(l=>{const b=r.cart.find(u=>u.id===l.id),E=b?b.quantity:0;return`
            <div class="glass-card" style="overflow: hidden; display: flex; flex-direction: column; border-radius: var(--radius-lg);">
              <div style="height: 150px; position: relative; overflow: hidden; background: #222;">
                <img 
                  src="${l.image}" 
                  alt="${l.name}" 
                  style="width: 100%; height: 100%; object-fit: cover;"
                  loading="lazy"
                />
                <div style="position: absolute; top: 10px; left: 10px; display: flex; gap: 6px;">
                  <span class="badge badge-vip" style="font-size: 10px; background: rgba(255,255,255,0.9); backdrop-filter: blur(4px);">
                    ${l.tag}
                  </span>
                </div>
                <div style="position: absolute; bottom: 8px; right: 10px; background: rgba(4,22,39,0.85); color: white; padding: 4px 10px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 700;">
                  $${l.price.toFixed(2)}
                </div>
              </div>

              <div style="padding: 14px 16px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                  <h4 style="font-family: var(--font-serif); font-size: 16px; font-weight: 700; color: var(--primary);">${l.name}</h4>
                </div>
                <p class="body-sm" style="color: var(--on-surface-variant); margin-bottom: 12px; line-height: 1.4;">
                  ${l.description}
                </p>

                <div style="display: flex; align-items: center; justify-content: space-between; pt-2; border-top: 1px solid var(--surface-container-high); padding-top: 10px;">
                  <div style="display: flex; gap: 8px; font-size: 11px; color: var(--outline);">
                    <span>⏱ ${l.time}</span>
                    <span>•</span>
                    <span>🔥 ${l.calories}</span>
                  </div>

                  ${E>0?`
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <button class="btn-icon dish-qty-btn" data-dish-id="${l.id}" data-delta="-1" style="background: var(--surface-container); width: 30px; height: 30px;">
                        <span class="material-symbols-outlined" style="font-size: 14px;">remove</span>
                      </button>
                      <span style="font-weight: 700; font-size: 14px; min-width: 16px; text-align: center;">${E}</span>
                      <button class="btn-icon dish-qty-btn" data-dish-id="${l.id}" data-delta="1" style="background: var(--primary); color: white; width: 30px; height: 30px;">
                        <span class="material-symbols-outlined" style="font-size: 14px;">add</span>
                      </button>
                    </div>
                  `:`
                    <button class="btn-primary add-dish-btn" data-dish-id="${l.id}" style="padding: 8px 14px; font-size: 11px;">
                      <span class="material-symbols-outlined" style="font-size: 14px;">add_shopping_cart</span> Add
                    </button>
                  `}
                </div>
              </div>
            </div>
          `}).join("")}
      </div>

      <!-- Floating Cart Bottom Bar (Sticky when items exist) -->
      ${o>0?`
        <div style="position: sticky; bottom: 80px; z-index: 50; margin: 0 -4px;">
          <div class="glass-card-navy animate-slide-up" style="padding: 14px 18px; border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); border: 1.5px solid var(--gold-accent); display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 38px; height: 38px; border-radius: 50%; background: var(--secondary-container); color: var(--on-secondary-container); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;">
                ${o}
              </div>
              <div>
                <div style="font-weight: 700; font-size: 15px; color: white;">$${d.toFixed(2)}</div>
                <div style="font-size: 11px; opacity: 0.8;">Room 402 • Deluxe Ocean View</div>
              </div>
            </div>
            <button class="btn-gold" id="view-checkout-btn" style="padding: 10px 18px; font-size: 12px;">
              Review Order →
            </button>
          </div>
        </div>
      `:""}
    </div>
  `}function qe(){const r=document.getElementById("back-home-btn");r&&r.addEventListener("click",()=>c.setView("guest-home")),document.querySelectorAll(".category-pill").forEach(o=>{o.addEventListener("click",()=>{c.state.selectedCategory=o.dataset.cat,c.notify()})}),document.querySelectorAll(".add-dish-btn").forEach(o=>{o.addEventListener("click",()=>{const d=o.dataset.dishId,l=c.state.menu.find(b=>b.id===d);l&&c.openModal("item-customize",{dish:l})})}),document.querySelectorAll(".dish-qty-btn").forEach(o=>{o.addEventListener("click",()=>{const d=o.dataset.dishId,l=parseInt(o.dataset.delta,10);c.updateCartQuantity(d,l)})});const i=document.getElementById("view-checkout-btn");i&&i.addEventListener("click",()=>c.setView("checkout"))}var K={};(function r(t,s,e,i){var o=!!(t.Worker&&t.Blob&&t.Promise&&t.OffscreenCanvas&&t.OffscreenCanvasRenderingContext2D&&t.HTMLCanvasElement&&t.HTMLCanvasElement.prototype.transferControlToOffscreen&&t.URL&&t.URL.createObjectURL),d=typeof Path2D=="function"&&typeof DOMMatrix=="function",l=function(){if(!t.OffscreenCanvas)return!1;try{var n=new OffscreenCanvas(1,1),a=n.getContext("2d");a.fillRect(0,0,1,1);var p=n.transferToImageBitmap();a.createPattern(p,"no-repeat")}catch{return!1}return!0}();function b(){}function E(n){var a=s.exports.Promise,p=a!==void 0?a:t.Promise;return typeof p=="function"?new p(n):(n(b,b),null)}var u=function(n,a){return{transform:function(p){if(n)return p;if(a.has(p))return a.get(p);var g=new OffscreenCanvas(p.width,p.height),m=g.getContext("2d");return m.drawImage(p,0,0),a.set(p,g),g},clear:function(){a.clear()}}}(l,new Map),D=function(){var n=Math.floor(16.666666666666668),a,p,g={},m=0;return typeof requestAnimationFrame=="function"&&typeof cancelAnimationFrame=="function"?(a=function(y){var f=Math.random();return g[f]=requestAnimationFrame(function v(h){m===h||m+n-1<h?(m=h,delete g[f],y()):g[f]=requestAnimationFrame(v)}),f},p=function(y){g[y]&&cancelAnimationFrame(g[y])}):(a=function(y){return setTimeout(y,n)},p=function(y){return clearTimeout(y)}),{frame:a,cancel:p}}(),O=function(){var n,a,p={};function g(m){function y(f,v){m.postMessage({options:f||{},callback:v})}m.init=function(v){var h=v.transferControlToOffscreen();m.postMessage({canvas:h},[h])},m.fire=function(v,h,k){if(a)return y(v,null),a;var M=Math.random().toString(36).slice(2);return a=E(function($){function z(I){I.data.callback===M&&(delete p[M],m.removeEventListener("message",z),a=null,u.clear(),k(),$())}m.addEventListener("message",z),y(v,M),p[M]=z.bind(null,{data:{callback:M}})}),a},m.reset=function(){m.postMessage({reset:!0});for(var v in p)p[v](),delete p[v]}}return function(){if(n)return n;if(!e&&o){var m=["var CONFETTI, SIZE = {}, module = {};","("+r.toString()+")(this, module, true, SIZE);","onmessage = function(msg) {","  if (msg.data.options) {","    CONFETTI(msg.data.options).then(function () {","      if (msg.data.callback) {","        postMessage({ callback: msg.data.callback });","      }","    });","  } else if (msg.data.reset) {","    CONFETTI && CONFETTI.reset();","  } else if (msg.data.resize) {","    SIZE.width = msg.data.resize.width;","    SIZE.height = msg.data.resize.height;","  } else if (msg.data.canvas) {","    SIZE.width = msg.data.canvas.width;","    SIZE.height = msg.data.canvas.height;","    CONFETTI = module.exports.create(msg.data.canvas);","  }","}"].join(`
`);try{n=new Worker(URL.createObjectURL(new Blob([m])))}catch(y){return typeof console<"u"&&typeof console.warn=="function"&&console.warn("🎊 Could not load worker",y),null}g(n)}return n}}(),T={particleCount:50,angle:90,spread:45,startVelocity:45,decay:.9,gravity:1,drift:0,ticks:200,x:.5,y:.5,shapes:["square","circle"],zIndex:100,colors:["#26ccff","#a25afd","#ff5e7e","#88ff5a","#fcff42","#ffa62d","#ff36ff"],disableForReducedMotion:!1,scalar:1};function V(n,a){return a?a(n):n}function C(n){return n!=null}function w(n,a,p){return V(n&&C(n[a])?n[a]:T[a],p)}function q(n){return n<0?0:Math.floor(n)}function R(n,a){return Math.floor(Math.random()*(a-n))+n}function j(n){return parseInt(n,16)}function G(n){return n.map(ce)}function ce(n){var a=String(n).replace(/[^0-9a-f]/gi,"");return a.length<6&&(a=a[0]+a[0]+a[1]+a[1]+a[2]+a[2]),{r:j(a.substring(0,2)),g:j(a.substring(2,4)),b:j(a.substring(4,6))}}function pe(n){var a=w(n,"origin",Object);return a.x=w(a,"x",Number),a.y=w(a,"y",Number),a}function ue(n){n.width=document.documentElement.clientWidth,n.height=document.documentElement.clientHeight}function ve(n){var a=n.getBoundingClientRect();n.width=a.width,n.height=a.height}function ge(n){var a=document.createElement("canvas");return a.style.position="fixed",a.style.top="0px",a.style.left="0px",a.style.pointerEvents="none",a.style.zIndex=n,a}function me(n,a,p,g,m,y,f,v,h){n.save(),n.translate(a,p),n.rotate(y),n.scale(g,m),n.arc(0,0,1,f,v,h),n.restore()}function ye(n){var a=n.angle*(Math.PI/180),p=n.spread*(Math.PI/180);return{x:n.x,y:n.y,wobble:Math.random()*10,wobbleSpeed:Math.min(.11,Math.random()*.1+.05),velocity:n.startVelocity*.5+Math.random()*n.startVelocity,angle2D:-a+(.5*p-Math.random()*p),tiltAngle:(Math.random()*(.75-.25)+.25)*Math.PI,color:n.color,shape:n.shape,tick:0,totalTicks:n.ticks,decay:n.decay,drift:n.drift,random:Math.random()+2,tiltSin:0,tiltCos:0,wobbleX:0,wobbleY:0,gravity:n.gravity*3,ovalScalar:.6,scalar:n.scalar,flat:n.flat}}function fe(n,a){a.x+=Math.cos(a.angle2D)*a.velocity+a.drift,a.y+=Math.sin(a.angle2D)*a.velocity+a.gravity,a.velocity*=a.decay,a.flat?(a.wobble=0,a.wobbleX=a.x+10*a.scalar,a.wobbleY=a.y+10*a.scalar,a.tiltSin=0,a.tiltCos=0,a.random=1):(a.wobble+=a.wobbleSpeed,a.wobbleX=a.x+10*a.scalar*Math.cos(a.wobble),a.wobbleY=a.y+10*a.scalar*Math.sin(a.wobble),a.tiltAngle+=.1,a.tiltSin=Math.sin(a.tiltAngle),a.tiltCos=Math.cos(a.tiltAngle),a.random=Math.random()+2);var p=a.tick++/a.totalTicks,g=a.x+a.random*a.tiltCos,m=a.y+a.random*a.tiltSin,y=a.wobbleX+a.random*a.tiltCos,f=a.wobbleY+a.random*a.tiltSin;if(n.fillStyle="rgba("+a.color.r+", "+a.color.g+", "+a.color.b+", "+(1-p)+")",n.beginPath(),d&&a.shape.type==="path"&&typeof a.shape.path=="string"&&Array.isArray(a.shape.matrix))n.fill(be(a.shape.path,a.shape.matrix,a.x,a.y,Math.abs(y-g)*.1,Math.abs(f-m)*.1,Math.PI/10*a.wobble));else if(a.shape.type==="bitmap"){var v=Math.PI/10*a.wobble,h=Math.abs(y-g)*.1,k=Math.abs(f-m)*.1,M=a.shape.bitmap.width*a.scalar,$=a.shape.bitmap.height*a.scalar,z=new DOMMatrix([Math.cos(v)*h,Math.sin(v)*h,-Math.sin(v)*k,Math.cos(v)*k,a.x,a.y]);z.multiplySelf(new DOMMatrix(a.shape.matrix));var I=n.createPattern(u.transform(a.shape.bitmap),"no-repeat");I.setTransform(z),n.globalAlpha=1-p,n.fillStyle=I,n.fillRect(a.x-M/2,a.y-$/2,M,$),n.globalAlpha=1}else if(a.shape==="circle")n.ellipse?n.ellipse(a.x,a.y,Math.abs(y-g)*a.ovalScalar,Math.abs(f-m)*a.ovalScalar,Math.PI/10*a.wobble,0,2*Math.PI):me(n,a.x,a.y,Math.abs(y-g)*a.ovalScalar,Math.abs(f-m)*a.ovalScalar,Math.PI/10*a.wobble,0,2*Math.PI);else if(a.shape==="star")for(var x=Math.PI/2*3,B=4*a.scalar,A=8*a.scalar,P=a.x,F=a.y,H=5,L=Math.PI/H;H--;)P=a.x+Math.cos(x)*A,F=a.y+Math.sin(x)*A,n.lineTo(P,F),x+=L,P=a.x+Math.cos(x)*B,F=a.y+Math.sin(x)*B,n.lineTo(P,F),x+=L;else n.moveTo(Math.floor(a.x),Math.floor(a.y)),n.lineTo(Math.floor(a.wobbleX),Math.floor(m)),n.lineTo(Math.floor(y),Math.floor(f)),n.lineTo(Math.floor(g),Math.floor(a.wobbleY));return n.closePath(),n.fill(),a.tick<a.totalTicks}function he(n,a,p,g,m){var y=a.slice(),f=n.getContext("2d"),v,h,k=E(function(M){function $(){v=h=null,f.clearRect(0,0,g.width,g.height),u.clear(),m(),M()}function z(){e&&!(g.width===i.width&&g.height===i.height)&&(g.width=n.width=i.width,g.height=n.height=i.height),!g.width&&!g.height&&(p(n),g.width=n.width,g.height=n.height),f.clearRect(0,0,g.width,g.height),y=y.filter(function(I){return fe(f,I)}),y.length?v=D.frame(z):$()}v=D.frame(z),h=$});return{addFettis:function(M){return y=y.concat(M),k},canvas:n,promise:k,reset:function(){v&&D.cancel(v),h&&h()}}}function Q(n,a){var p=!n,g=!!w(a||{},"resize"),m=!1,y=w(a,"disableForReducedMotion",Boolean),f=o&&!!w(a||{},"useWorker"),v=f?O():null,h=p?ue:ve,k=n&&v?!!n.__confetti_initialized:!1,M=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion)").matches,$;function z(x,B,A){for(var P=w(x,"particleCount",q),F=w(x,"angle",Number),H=w(x,"spread",Number),L=w(x,"startVelocity",Number),ke=w(x,"decay",Number),$e=w(x,"gravity",Number),Se=w(x,"drift",Number),J=w(x,"colors",G),Me=w(x,"ticks",Number),Y=w(x,"shapes"),ze=w(x,"scalar"),Ce=!!w(x,"flat"),X=pe(x),ee=P,U=[],Ee=n.width*X.x,Ie=n.height*X.y;ee--;)U.push(ye({x:Ee,y:Ie,angle:F,spread:H,startVelocity:L,color:J[ee%J.length],shape:Y[R(0,Y.length)],ticks:Me,decay:ke,gravity:$e,drift:Se,scalar:ze,flat:Ce}));return $?$.addFettis(U):($=he(n,U,h,B,A),$.promise)}function I(x){var B=y||w(x,"disableForReducedMotion",Boolean),A=w(x,"zIndex",Number);if(B&&M)return E(function(L){L()});p&&$?n=$.canvas:p&&!n&&(n=ge(A),document.body.appendChild(n)),g&&!k&&h(n);var P={width:n.width,height:n.height};v&&!k&&v.init(n),k=!0,v&&(n.__confetti_initialized=!0);function F(){if(v){var L={getBoundingClientRect:function(){if(!p)return n.getBoundingClientRect()}};h(L),v.postMessage({resize:{width:L.width,height:L.height}});return}P.width=P.height=null}function H(){$=null,g&&(m=!1,t.removeEventListener("resize",F)),p&&n&&(document.body.contains(n)&&document.body.removeChild(n),n=null,k=!1)}return g&&!m&&(m=!0,t.addEventListener("resize",F,!1)),v?v.fire(x,P,H):z(x,P,H)}return I.reset=function(){v&&v.reset(),$&&$.reset()},I}var W;function Z(){return W||(W=Q(null,{useWorker:!0,resize:!0})),W}function be(n,a,p,g,m,y,f){var v=new Path2D(n),h=new Path2D;h.addPath(v,new DOMMatrix(a));var k=new Path2D;return k.addPath(h,new DOMMatrix([Math.cos(f)*m,Math.sin(f)*m,-Math.sin(f)*y,Math.cos(f)*y,p,g])),k}function xe(n){if(!d)throw new Error("path confetti are not supported in this browser");var a,p;typeof n=="string"?a=n:(a=n.path,p=n.matrix);var g=new Path2D(a),m=document.createElement("canvas"),y=m.getContext("2d");if(!p){for(var f=1e3,v=f,h=f,k=0,M=0,$,z,I=0;I<f;I+=2)for(var x=0;x<f;x+=2)y.isPointInPath(g,I,x,"nonzero")&&(v=Math.min(v,I),h=Math.min(h,x),k=Math.max(k,I),M=Math.max(M,x));$=k-v,z=M-h;var B=10,A=Math.min(B/$,B/z);p=[A,0,0,A,-Math.round($/2+v)*A,-Math.round(z/2+h)*A]}return{type:"path",path:a,matrix:p}}function we(n){var a,p=1,g="#000000",m='"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif';typeof n=="string"?a=n:(a=n.text,p="scalar"in n?n.scalar:p,m="fontFamily"in n?n.fontFamily:m,g="color"in n?n.color:g);var y=10*p,f=""+y+"px "+m,v=new OffscreenCanvas(y,y),h=v.getContext("2d");h.font=f;var k=h.measureText(a),M=Math.ceil(k.actualBoundingBoxRight+k.actualBoundingBoxLeft),$=Math.ceil(k.actualBoundingBoxAscent+k.actualBoundingBoxDescent),z=2,I=k.actualBoundingBoxLeft+z,x=k.actualBoundingBoxAscent+z;M+=z+z,$+=z+z,v=new OffscreenCanvas(M,$),h=v.getContext("2d"),h.font=f,h.fillStyle=g,h.fillText(a,I,x);var B=1/p;return{type:"bitmap",bitmap:v.transferToImageBitmap(),matrix:[B,0,0,B,-M*B/2,-$*B/2]}}s.exports=function(){return Z().apply(this,arguments)},s.exports.reset=function(){Z().reset()},s.exports.create=Q,s.exports.shapeFromPath=xe,s.exports.shapeFromText=we})(function(){return typeof window<"u"?window:typeof self<"u"?self:this||{}}(),K,!1);const je=K.exports;K.exports.create;function Fe(r){const t=r.cart,s=t.reduce((d,l)=>d+l.price*l.quantity,0),e=s*.18,i=r.selectedTip!==void 0?r.selectedTip:10,o=s+e+i;return t.length===0?`
      <div class="app-content animate-fade-in" style="text-align: center; padding: 40px 20px;">
        <div style="width: 70px; height: 70px; border-radius: 50%; background: var(--surface-container); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto;">
          <span class="material-symbols-outlined" style="font-size: 32px; color: var(--outline);">shopping_bag</span>
        </div>
        <h3 class="headline-md" style="font-size: 20px; margin-bottom: 8px;">Your Cart is Empty</h3>
        <p class="body-sm" style="color: var(--on-surface-variant); margin-bottom: 24px;">
          Select culinary delights from our 24/7 in-room dining menu.
        </p>
        <button class="btn-primary" id="return-menu-btn">Browse Gastronomy Menu</button>
      </div>
    `:`
    <div class="app-content animate-fade-in" style="padding-bottom: 40px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
        <button class="btn-secondary" id="back-to-menu-btn" style="padding: 4px 10px; font-size: 11px;">
          ← Add More Items
        </button>
        <div class="label-bold" style="color: var(--secondary);">Order Checkout</div>
      </div>
      
      <h2 class="display-title" style="font-size: 24px; margin-bottom: 12px;">Confirm In-Room Order</h2>

      <!-- Delivery Location & Destination -->
      <div class="glass-card" style="padding: 16px; border-left: 4px solid var(--gold-accent);">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div class="label-bold" style="font-size: 10px;">Delivery Suite</div>
            <div style="font-weight: 700; font-size: 15px; color: var(--primary);">Room 402 • Deluxe Ocean View</div>
            <div class="body-sm" style="color: var(--on-surface-variant);">Guest: Mr. James Harrison (Platinum VIP)</div>
          </div>
          <span class="badge badge-vip">Direct Room Billing</span>
        </div>
      </div>

      <!-- Itemized Order Details -->
      <div class="glass-card" style="padding: 16px;">
        <div class="label-bold" style="margin-bottom: 12px;">Selected Items (${t.reduce((d,l)=>d+l.quantity,0)})</div>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${t.map(d=>`
            <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 12px; border-bottom: 1px solid var(--surface-container-high);">
              <div style="flex: 1; padding-right: 12px;">
                <div style="font-weight: 600; font-size: 14px; color: var(--primary);">${d.name}</div>
                ${d.specialInstructions?`
                  <div style="font-size: 11px; color: var(--secondary); font-style: italic; margin-top: 2px;">
                    Note: ${d.specialInstructions}
                  </div>
                `:""}
                <div style="font-size: 12px; color: var(--on-surface-variant); margin-top: 2px;">
                  $${d.price.toFixed(2)} each
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <button class="btn-icon checkout-qty-btn" data-id="${d.id}" data-delta="-1" style="background: var(--surface-container); width: 28px; height: 28px;">
                  <span class="material-symbols-outlined" style="font-size: 14px;">remove</span>
                </button>
                <span style="font-weight: 700; font-size: 13px; min-width: 14px; text-align: center;">${d.quantity}</span>
                <button class="btn-icon checkout-qty-btn" data-id="${d.id}" data-delta="1" style="background: var(--primary); color: white; width: 28px; height: 28px;">
                  <span class="material-symbols-outlined" style="font-size: 14px;">add</span>
                </button>
                <span style="font-weight: 700; font-size: 14px; min-width: 54px; text-align: right;">
                  $${(d.price*d.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Special Delivery Notes -->
        <div class="input-group" style="margin-top: 14px;">
          <label class="input-label">Butler Delivery Instructions</label>
          <input type="text" id="order-butler-notes" class="input-field" placeholder="e.g. Please ring doorbell twice, set on balcony table..." />
        </div>
      </div>

      <!-- Gratuity & Bill Breakdown -->
      <div class="glass-card" style="padding: 16px;">
        <div class="label-bold" style="margin-bottom: 10px;">Butler Gratuity</div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 16px;">
          ${[5,10,15,20].map(d=>`
            <button class="btn-secondary tip-btn ${i===d?"active":""}" data-tip="${d}" style="padding: 8px 4px; font-size: 12px; font-weight: 700; ${i===d?"background: var(--primary); color: white; border-color: var(--primary);":""}">
              $${d}
            </button>
          `).join("")}
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: var(--on-surface-variant);">
          <div style="display: flex; justify-content: space-between;">
            <span>Subtotal</span>
            <span style="font-weight: 600; color: var(--on-surface);">$${s.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Hospitality Service Charge (18%)</span>
            <span style="font-weight: 600; color: var(--on-surface);">$${e.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Staff Gratuity</span>
            <span style="font-weight: 600; color: var(--on-surface);">$${i.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-top: 1.5px dashed var(--outline-variant); padding-top: 10px; font-size: 17px; font-weight: 800; color: var(--primary);">
            <span>Total Room Charge</span>
            <span style="color: var(--primary);">$${o.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <!-- Payment & Submit Button -->
      <button class="btn-gold" id="place-order-btn" style="padding: 16px; font-size: 14px; width: 100%; border-radius: var(--radius-md);">
        <span class="material-symbols-outlined">receipt</span> Confirm & Charge to Suite ($${o.toFixed(2)})
      </button>
    </div>
  `}function Ve(){const r=document.getElementById("back-to-menu-btn");r&&r.addEventListener("click",()=>c.setView("dining"));const t=document.getElementById("return-menu-btn");t&&t.addEventListener("click",()=>c.setView("dining")),document.querySelectorAll(".checkout-qty-btn").forEach(d=>{d.addEventListener("click",()=>{const l=d.dataset.id,b=parseInt(d.dataset.delta,10);c.updateCartQuantity(l,b)})});let e=10;document.querySelectorAll(".tip-btn").forEach(d=>{d.addEventListener("click",()=>{e=parseInt(d.dataset.tip,10),c.state.selectedTip=e,c.notify()})});const o=document.getElementById("place-order-btn");o&&o.addEventListener("click",()=>{var D;const d=((D=document.getElementById("order-butler-notes"))==null?void 0:D.value)||"",l=c.state.cart.reduce((O,T)=>O+T.price*T.quantity,0),b=l*.18,E=l+b+e,u=c.createOrder({subtotal:l,serviceCharge:b,tip:e,total:E,deliveryType:"Room Delivery (ASAP)",notes:d});je({particleCount:80,spread:60,origin:{y:.6}}),S("Order Confirmed!",`Order #${u.id} dispatched to Executive Kitchen.`,"restaurant")})}function He(r){var i;const t=r.orders[0];if(!t)return`
      <div class="app-content animate-fade-in" style="text-align: center; padding: 40px 20px;">
        <h3 class="headline-md">No Active Orders</h3>
        <p class="body-sm" style="margin: 8px 0 20px 0; color: var(--on-surface-variant);">You do not have any in-room dining orders right now.</p>
        <button class="btn-primary" id="track-to-menu-btn">Order Dining</button>
      </div>
    `;const e=((i={received:{step:1,label:"Order Received",desc:"Order confirmed and sent to Executive Chef"},preparing:{step:2,label:"Kitchen Preparing",desc:"Culinary team is crafting your dishes"},delivering:{step:3,label:"Butler On The Way",desc:"Dedicated butler is en route to Suite 402"},delivered:{step:4,label:"Delivered & Served",desc:"Bon Appétit! Enjoy your dining experience"}}[t.status])==null?void 0:i.step)||1;return`
    <div class="app-content animate-fade-in" style="padding-bottom: 40px;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <button class="btn-secondary" id="tracking-back-btn" style="padding: 4px 10px; font-size: 11px;">
          ← Back to Home
        </button>
        <span class="badge badge-vip">Live Butler Tracker</span>
      </div>

      <div style="text-align: center; margin: 10px 0 6px 0;">
        <div class="label-bold" style="color: var(--secondary); margin-bottom: 4px;">Suite 402 In-Room Delivery</div>
        <h2 class="display-title" style="font-size: 26px;">Order #${t.id}</h2>
        <div style="font-size: 13px; color: var(--on-surface-variant); margin-top: 2px;">
          ${t.status==="delivered"?"✨ Completed & Served":`Estimated Delivery: ~${t.etaMinutes} minutes`}
        </div>
      </div>

      <!-- Real-Time Status Progress Tracker -->
      <div class="glass-card" style="padding: 20px 16px;">
        <div style="display: flex; flex-direction: column; gap: 20px; position: relative;">
          <!-- Step 1: Received -->
          <div style="display: flex; gap: 14px; align-items: flex-start;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: ${e>=1?"var(--primary)":"var(--surface-container-high)"}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; z-index: 2;">
              ${e>1?"✓":"1"}
            </div>
            <div>
              <div style="font-weight: 700; font-size: 14px; color: var(--primary);">Order Received</div>
              <div class="body-sm" style="color: var(--on-surface-variant);">Sent to Kitchen at ${new Date(t.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</div>
            </div>
          </div>

          <!-- Step 2: Preparing -->
          <div style="display: flex; gap: 14px; align-items: flex-start;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: ${e>=2?"var(--primary)":"var(--surface-container-high)"}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; z-index: 2;">
              ${e>2?"✓":"2"}
            </div>
            <div>
              <div style="font-weight: 700; font-size: 14px; color: var(--primary);">Chef Preparation</div>
              <div class="body-sm" style="color: var(--on-surface-variant);">Artisan prep with warm cloche covers</div>
            </div>
          </div>

          <!-- Step 3: Delivering -->
          <div style="display: flex; gap: 14px; align-items: flex-start;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: ${e>=3?"var(--primary)":"var(--surface-container-high)"}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; z-index: 2;">
              ${e>3?"✓":"3"}
            </div>
            <div>
              <div style="font-weight: 700; font-size: 14px; color: var(--primary);">Butler En Route</div>
              <div class="body-sm" style="color: var(--on-surface-variant);">Elevator transit to Floor 4</div>
            </div>
          </div>

          <!-- Step 4: Delivered -->
          <div style="display: flex; gap: 14px; align-items: flex-start;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: ${e>=4?"var(--success)":"var(--surface-container-high)"}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; z-index: 2;">
              ${e>=4?"✓":"4"}
            </div>
            <div>
              <div style="font-weight: 700; font-size: 14px; color: ${e>=4?"var(--success)":"var(--on-surface-variant)"};">Delivered & Served</div>
              <div class="body-sm" style="color: var(--on-surface-variant);">In-suite table service complete</div>
            </div>
          </div>
        </div>

        <!-- Simulation Advance Button -->
        ${t.status!=="delivered"?`
          <div style="margin-top: 20px; pt-3; border-top: 1px dashed var(--outline-variant); padding-top: 12px; text-align: center;">
            <button class="btn-secondary" id="advance-order-status-btn" style="width: 100%; font-size: 12px; padding: 10px;">
              <span class="material-symbols-outlined" style="font-size: 16px;">fast_forward</span> Simulate Next Step (Kitchen / Delivery)
            </button>
          </div>
        `:""}
      </div>

      <!-- Dedicated Butler Contact Card -->
      <div class="glass-card" style="padding: 16px;">
        <div class="label-bold" style="margin-bottom: 10px;">Assigned Butler</div>
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 44px; height: 44px; border-radius: 50%; overflow: hidden; border: 1.5px solid var(--secondary); flex-shrink: 0;">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80" alt="Pierre Dubois" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div>
              <div style="font-weight: 700; font-size: 14px; color: var(--primary);">${t.server.name}</div>
              <div class="body-sm" style="color: var(--on-surface-variant);">${t.server.role}</div>
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-icon" id="call-server-btn" style="background: var(--surface-container-high);" title="Call Butler">
              <span class="material-symbols-outlined" style="color: var(--primary); font-size: 20px;">call</span>
            </button>
            <button class="btn-icon" id="chat-server-btn" style="background: var(--surface-container-high);" title="Message Concierge">
              <span class="material-symbols-outlined" style="color: var(--primary); font-size: 20px;">chat</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Ordered Items Summary -->
      <div class="glass-card" style="padding: 16px;">
        <div class="label-bold" style="margin-bottom: 10px;">Order Summary</div>
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px;">
          ${t.items.map(o=>`
            <div style="display: flex; justify-content: space-between;">
              <span>${o.quantity}x ${o.name}</span>
              <span style="font-weight: 600;">$${(o.price*o.quantity).toFixed(2)}</span>
            </div>
          `).join("")}
          <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--surface-container-high); padding-top: 8px; font-weight: 700; font-size: 14px; color: var(--primary);">
            <span>Total Charged</span>
            <span>$${t.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  `}function Ne(){const r=document.getElementById("tracking-back-btn");r&&r.addEventListener("click",()=>c.setView("guest-home"));const t=document.getElementById("track-to-menu-btn");t&&t.addEventListener("click",()=>c.setView("dining"));const s=document.getElementById("advance-order-status-btn");s&&s.addEventListener("click",()=>{const o=c.state.orders[0];o&&(c.advanceOrderStatus(o.id),S("Order Status Updated",`Order #${o.id} is now ${o.status.toUpperCase()}`,"check_circle"))});const e=document.getElementById("call-server-btn");e&&e.addEventListener("click",()=>{S("Calling Butler","Calling Pierre Dubois via hotel internal line...","ring_volume")});const i=document.getElementById("chat-server-btn");i&&i.addEventListener("click",()=>{S("Concierge Message",'Direct message sent to Pierre Dubois: "Please deliver directly to balcony"',"chat")})}function _e(r){const t=[{id:"refresh",title:"Daily Suite Refresh",icon:"cleaning_services",desc:"Full room cleaning, fresh bed linens, and bathroom sanitization"},{id:"turndown",title:"Evening Turndown",icon:"bedtime",desc:"Bed preparation, dimmed ambient lighting, and artisanal chocolates"},{id:"towels",title:"Extra Plush Towels & Amenities",icon:"bathtub",desc:"Fresh 800 GSM Egyptian cotton towels and Diptyque bath products"},{id:"laundry",title:"Express Valet & Dry Cleaning",icon:"local_laundry_service",desc:"Same-day garment pressing, suit steaming, or laundering"},{id:"luggage",title:"Luggage & Bellhop Assistance",icon:"luggage",desc:"Baggage storage, packing assistance, or airport departure handling"}],s=["Immediate (Within 30m)","Today • 11:00 AM","Today • 02:00 PM","Today • 05:00 PM","Tonight • 08:30 PM (Turndown)","Tomorrow • 09:00 AM"];return`
    <div class="app-content animate-fade-in" style="padding-bottom: 40px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <button class="btn-secondary" id="service-back-btn" style="padding: 4px 10px; font-size: 11px;">
          ← Back to Home
        </button>
        <button class="btn-secondary" id="goto-report-issue-btn" style="padding: 4px 10px; font-size: 11px; color: var(--error);">
          Report Repair / Issue ⚠
        </button>
      </div>

      <div style="margin: 8px 0 12px 0;">
        <div class="label-bold" style="color: var(--secondary);">Guest Care & Concierge</div>
        <h2 class="display-title" style="font-size: 26px;">Schedule Services</h2>
        <p class="body-sm" style="color: var(--on-surface-variant); margin-top: 2px;">
          Customized hospitality tailored for Suite 402.
        </p>
      </div>

      <!-- Service Selection -->
      <div class="glass-card" style="padding: 16px;">
        <div class="label-bold" style="margin-bottom: 12px;">1. Select Service Type</div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${t.map((e,i)=>`
            <label style="display: flex; align-items: flex-start; gap: 12px; padding: 10px 12px; border-radius: var(--radius-sm); border: 1.5px solid ${i===0?"var(--primary)":"var(--outline-variant)"}; background: ${i===0?"var(--surface-container-lowest)":"var(--surface-container-low)"}; cursor: pointer;" class="service-radio-card">
              <input type="radio" name="service-type" value="${e.title}" ${i===0?"checked":""} style="margin-top: 4px;" />
              <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 14px; color: var(--primary);">
                  <span class="material-symbols-outlined" style="font-size: 18px; color: var(--secondary);">${e.icon}</span>
                  ${e.title}
                </div>
                <p class="body-sm" style="margin-top: 2px; color: var(--on-surface-variant);">${e.desc}</p>
              </div>
            </label>
          `).join("")}
        </div>
      </div>

      <!-- Preferred Timing -->
      <div class="glass-card" style="padding: 16px;">
        <div class="label-bold" style="margin-bottom: 10px;">2. Preferred Time Slot</div>
        <div class="input-group">
          <select class="input-field" id="service-time-slot">
            ${s.map(e=>`<option value="${e}">${e}</option>`).join("")}
          </select>
        </div>

        <div class="input-group" style="margin-top: 14px;">
          <label class="input-label">Aromatherapy & Custom Preferences</label>
          <input type="text" id="service-special-notes" class="input-field" placeholder="e.g. Lavender pillow mist, extra espresso pods, firm pillows..." />
        </div>
      </div>

      <!-- Submit Button -->
      <button class="btn-primary" id="confirm-service-btn" style="padding: 16px; font-size: 14px; width: 100%; border-radius: var(--radius-md);">
        <span class="material-symbols-outlined">event_available</span> Request Service for Suite 402
      </button>
    </div>
  `}function Ge(){const r=document.getElementById("service-back-btn");r&&r.addEventListener("click",()=>c.setView("guest-home"));const t=document.getElementById("goto-report-issue-btn");t&&t.addEventListener("click",()=>c.setView("report-issue"));const s=document.querySelectorAll(".service-radio-card");s.forEach(i=>{i.addEventListener("click",()=>{s.forEach(o=>{o.style.borderColor="var(--outline-variant)",o.style.background="var(--surface-container-low)"}),i.style.borderColor="var(--primary)",i.style.background="var(--surface-container-lowest)"})});const e=document.getElementById("confirm-service-btn");e&&e.addEventListener("click",()=>{var l,b,E;const i=((l=document.querySelector('input[name="service-type"]:checked'))==null?void 0:l.value)||"Daily Suite Refresh",o=((b=document.getElementById("service-time-slot"))==null?void 0:b.value)||"Today",d=((E=document.getElementById("service-special-notes"))==null?void 0:E.value)||"";c.addServiceRequest({title:i,time:o,notes:d,category:"Housekeeping",priority:"High"}),S("Service Scheduled!",`${i} scheduled for ${o}.`,"check_circle"),c.setView("guest-requests")})}function We(r){return`
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
          ${[{id:"ac",name:"Air Conditioning / Climate",icon:"ac_unit"},{id:"plumbing",name:"Plumbing & Water Flow",icon:"water_drop"},{id:"wifi",name:"Smart TV & High-Speed Wi-Fi",icon:"wifi"},{id:"lighting",name:"Lighting & Smart Controls",icon:"lightbulb"},{id:"clean",name:"Spot Cleaning / Spills",icon:"cleaning_services"},{id:"other",name:"Other Immediate Assistance",icon:"support_agent"}].map((s,e)=>`
            <button class="btn-secondary issue-cat-btn ${e===0?"active":""}" data-cat="${s.name}" style="padding: 12px 10px; font-size: 12px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; ${e===0?"background: var(--primary); color: white; border-color: var(--primary);":""}">
              <span class="material-symbols-outlined" style="font-size: 24px; color: ${e===0?"white":"var(--primary)"};">${s.icon}</span>
              <span>${s.name}</span>
            </button>
          `).join("")}
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
  `}function Ue(){const r=document.getElementById("issue-back-btn");r&&r.addEventListener("click",()=>c.setView("guest-home"));let t="Air Conditioning / Climate";const s=document.querySelectorAll(".issue-cat-btn");s.forEach(o=>{o.addEventListener("click",()=>{s.forEach(l=>{l.style.background="var(--surface-container-low)",l.style.color="var(--primary)",l.style.borderColor="var(--outline-variant)";const b=l.querySelector(".material-symbols-outlined");b&&(b.style.color="var(--primary)")}),o.style.background="var(--primary)",o.style.color="white",o.style.borderColor="var(--primary)";const d=o.querySelector(".material-symbols-outlined");d&&(d.style.color="white"),t=o.dataset.cat})});const e=document.getElementById("attach-photo-box");e&&e.addEventListener("click",()=>{e.innerHTML=`
        <span class="material-symbols-outlined" style="color: var(--success); font-size: 24px;">check_circle</span>
        <div style="font-size: 12px; font-weight: 600; color: var(--success);">Photo Attached: room402_issue.jpg</div>
      `,e.style.borderColor="var(--success)",S("Photo Attached","Photo ready for engineering dispatcher review.","image")});const i=document.getElementById("submit-issue-btn");i&&i.addEventListener("click",()=>{var l,b;const o=((l=document.getElementById("issue-urgency"))==null?void 0:l.value)||"Urgent",d=((b=document.getElementById("issue-description"))==null?void 0:b.value)||"Guest reported issue requiring inspection.";c.addServiceRequest({title:`${t} Maintenance`,time:"Immediate Dispatch",notes:d,category:"Maintenance",priority:o,icon:"build"}),S("Dispatch Ticket Created",`Engineering notified for Suite 402 (${o}).`,"handyman"),c.setView("guest-requests")})}function Ke(r){const t=r.requests,s=r.orders;return`
    <div class="app-content animate-fade-in" style="padding-bottom: 40px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div class="label-bold" style="color: var(--secondary);">Room 402 Activity</div>
          <h2 class="display-title" style="font-size: 26px;">Active Requests</h2>
        </div>
        <button class="btn-secondary" id="new-req-btn" style="padding: 6px 12px; font-size: 11px;">
          + New Service
        </button>
      </div>

      <!-- In-Room Dining Orders Section -->
      ${s.length>0?`
        <section style="display: flex; flex-direction: column; gap: 10px;">
          <div class="label-bold">In-Room Dining Orders</div>
          ${s.map(e=>`
            <div class="glass-card" style="padding: 14px 16px; border-left: 4px solid var(--gold-accent);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span class="badge ${e.status==="delivered"?"badge-clean":"badge-gold"}" style="font-size: 10px; text-transform: uppercase;">
                  ${e.status}
                </span>
                <span style="font-size: 11px; color: var(--on-surface-variant);">
                  ${new Date(e.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
                </span>
              </div>
              <div style="font-weight: 700; font-size: 15px; color: var(--primary);">
                ${e.items.map(i=>`${i.quantity}x ${i.name}`).join(", ")}
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; border-top: 1px solid var(--surface-container-high); padding-top: 8px;">
                <span style="font-size: 12px; color: var(--on-surface-variant);">Total: <strong>$${e.total.toFixed(2)}</strong></span>
                <button class="btn-secondary view-order-track-btn" data-id="${e.id}" style="padding: 4px 10px; font-size: 11px;">
                  Track Order →
                </button>
              </div>
            </div>
          `).join("")}
        </section>
      `:""}

      <!-- General Service Requests Section -->
      <section style="display: flex; flex-direction: column; gap: 10px;">
        <div class="label-bold">Concierge & Maintenance Tickets</div>
        ${t.length===0?`
          <div class="glass-card" style="padding: 24px; text-align: center; color: var(--on-surface-variant);">
            No active service requests right now.
          </div>
        `:t.map(e=>`
          <div class="glass-card" style="padding: 14px 16px; border-left: 4px solid ${e.category==="Maintenance"?"var(--error)":"var(--primary)"};">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span class="badge ${e.status==="Scheduled"?"badge-inspected":"badge-progress"}" style="font-size: 10px;">
                ${e.status}
              </span>
              <span style="font-size: 11px; color: var(--on-surface-variant);">${e.time}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;">
              <span class="material-symbols-outlined" style="font-size: 18px; color: var(--primary);">${e.icon||"room_service"}</span>
              <h4 style="font-family: var(--font-serif); font-size: 15px; font-weight: 700; color: var(--primary);">${e.title}</h4>
            </div>
            ${e.notes?`
              <p class="body-sm" style="color: var(--on-surface-variant); margin-top: 4px;">
                ${e.notes}
              </p>
            `:""}
          </div>
        `).join("")}
      </section>
    </div>
  `}function Qe(){const r=document.getElementById("new-req-btn");r&&r.addEventListener("click",()=>c.setView("schedule-service")),document.querySelectorAll(".view-order-track-btn").forEach(s=>{s.addEventListener("click",()=>c.setView("order-tracking"))})}function Ze(r){const t=r.selectedFloor||"4",s=r.selectedStatusFilter||"All",e=["4","3","2","5"],i=["All","Clean","Dirty","Inspected","DND","In Progress"];let o=r.rooms.filter(u=>u.floor===t);s!=="All"&&(o=o.filter(u=>u.status===s));const d=r.rooms.filter(u=>u.floor===t),l=d.filter(u=>u.status==="Clean"||u.status==="Inspected").length,b=d.filter(u=>u.status==="Dirty").length,E=d.filter(u=>u.dnd||u.status==="DND").length;return`
    <div class="app-content animate-fade-in" style="padding-bottom: 40px;">
      <!-- Title & Live Dispatch Bar -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div class="label-bold" style="color: var(--secondary);">Supervisor Command Center</div>
          <h2 class="display-title" style="font-size: 24px;">Room Operations</h2>
        </div>
        <div style="text-align: right;">
          <span class="badge badge-clean" style="font-size: 10px;">Live Sync Active</span>
          <div style="font-size: 11px; color: var(--on-surface-variant); margin-top: 2px;">Floor ${t==="5"?"Penthouse":t}</div>
        </div>
      </div>

      <!-- Quick Metrics Counters -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
        <div class="glass-card" style="padding: 10px 12px; text-align: center;">
          <div class="label-bold" style="font-size: 9px; color: #1b5e20;">Ready / Clean</div>
          <div style="font-size: 20px; font-weight: 800; color: #1b5e20;">${l}</div>
        </div>
        <div class="glass-card" style="padding: 10px 12px; text-align: center;">
          <div class="label-bold" style="font-size: 9px; color: #c62828;">Turnaround</div>
          <div style="font-size: 20px; font-weight: 800; color: #c62828;">${b}</div>
        </div>
        <div class="glass-card" style="padding: 10px 12px; text-align: center;">
          <div class="label-bold" style="font-size: 9px; color: #e65100;">DND Privacy</div>
          <div style="font-size: 20px; font-weight: 800; color: #e65100;">${E}</div>
        </div>
      </div>

      <!-- Floor Selection Tabs -->
      <div>
        <div class="label-bold" style="margin-bottom: 6px;">Select Floor</div>
        <div style="display: flex; gap: 6px;">
          ${e.map(u=>`
            <button class="btn-secondary floor-tab-btn ${u===t?"active":""}" data-floor="${u}" style="flex: 1; padding: 8px 4px; font-size: 12px; font-weight: 700; ${u===t?"background: var(--primary); color: white; border-color: var(--primary);":""}">
              ${u==="5"?"Penthouse":`Floor ${u}`}
            </button>
          `).join("")}
        </div>
      </div>

      <!-- Status Filter Chips -->
      <div class="category-pills-row">
        ${i.map(u=>`
          <button class="category-pill status-filter-pill ${u===s?"active":""}" data-filter="${u}" style="font-size: 11px; padding: 6px 12px;">
            ${u}
          </button>
        `).join("")}
      </div>

      <!-- Interactive Room Grid -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
        ${o.map(u=>{const D=u.dnd||u.status==="DND",O=u.status==="Inspected",T=u.status==="Clean",V=u.status==="Dirty";return u.status,`
            <div class="glass-card room-grid-card" data-room-id="${u.id}" style="padding: 14px; cursor: pointer; border-left: 4px solid ${D?"var(--error)":T||O?"#2e7d32":V?"#c62828":"#7b1fa2"}; position: relative;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                <div style="font-family: var(--font-serif); font-size: 18px; font-weight: 800; color: var(--primary);">
                  ${u.id}
                </div>
                <span class="badge ${T?"badge-clean":O?"badge-inspected":V?"badge-dirty":D?"badge-dnd":"badge-progress"}" style="font-size: 9px; padding: 2px 6px;">
                  ${u.status}
                </span>
              </div>

              <div style="font-size: 11px; font-weight: 600; color: var(--on-surface-variant); margin-bottom: 2px;">
                ${u.type}
              </div>

              <div style="font-size: 12px; font-weight: 700; color: var(--primary); margin: 6px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${u.guest}
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--surface-container-high); padding-top: 6px; font-size: 10px; color: var(--outline);">
                <span>👤 ${u.housekeeper.split(" ")[0]}</span>
                ${u.vip?'<span class="badge badge-vip" style="font-size: 8px; padding: 1px 4px;">VIP</span>':""}
              </div>
            </div>
          `}).join("")}
      </div>

      <!-- Quick Supervisor Actions -->
      <div class="glass-card" style="padding: 14px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 700; font-size: 13px;">Floor Turnover Actions</div>
          <div class="body-sm">Auto-assign departure rooms to available team</div>
        </div>
        <button class="btn-primary" id="auto-assign-btn" style="padding: 8px 12px; font-size: 11px;">
          Auto-Assign
        </button>
      </div>
    </div>
  `}function Je(){document.querySelectorAll(".floor-tab-btn").forEach(i=>{i.addEventListener("click",()=>{c.setFloor(i.dataset.floor)})}),document.querySelectorAll(".status-filter-pill").forEach(i=>{i.addEventListener("click",()=>{c.state.selectedStatusFilter=i.dataset.filter,c.notify()})}),document.querySelectorAll(".room-grid-card").forEach(i=>{i.addEventListener("click",()=>{const o=i.dataset.roomId;c.openModal("room-details",{roomId:o})})});const e=document.getElementById("auto-assign-btn");e&&e.addEventListener("click",()=>{S("Turnover Auto-Assigned","Dirty rooms distributed across on-duty housekeeping team.","done_all")})}function Ye(r){const t=r.selectedTaskCat||"All",s=["All","Housekeeping","Maintenance","Dining"];let e=r.tasks;t!=="All"&&(e=e.filter(o=>o.category===t));const i=r.tasks.filter(o=>o.priority==="Urgent"&&o.status!=="Completed").length;return`
    <div class="app-content animate-fade-in" style="padding-bottom: 40px;">
      <!-- Title Bar -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div class="label-bold" style="color: var(--secondary);">Live Hotel Dispatch</div>
          <h2 class="display-title" style="font-size: 24px;">Task Queue</h2>
        </div>
        <div style="text-align: right;">
          <span class="badge ${i>0?"badge-dirty":"badge-clean"}" style="font-size: 10px;">
            ${i} Urgent Tickets
          </span>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="category-pills-row">
        ${s.map(o=>`
          <button class="category-pill task-cat-pill ${o===t?"active":""}" data-cat="${o}" style="font-size: 11px; padding: 6px 14px;">
            ${o}
          </button>
        `).join("")}
      </div>

      <!-- Task List -->
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${e.map(o=>{const d=o.priority==="Urgent",l=o.priority==="High",b=o.status==="Completed",E=o.status==="In Progress";return`
            <div class="glass-card" style="padding: 16px; border-left: 4px solid ${b?"var(--success)":d?"var(--error)":l?"var(--warning)":"var(--primary)"}; opacity: ${b?"0.7":"1"};">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span class="badge ${d?"badge-dirty":l?"badge-gold":"badge-inspected"}" style="font-size: 9px;">
                    ${o.priority}
                  </span>
                  <span class="badge badge-vip" style="font-size: 9px;">Room ${o.room}</span>
                </div>
                <span style="font-size: 11px; color: var(--on-surface-variant); font-weight: 600;">
                  Due: ${o.timeDue}
                </span>
              </div>

              <h4 style="font-family: var(--font-serif); font-size: 15px; font-weight: 700; color: var(--primary); margin-bottom: 4px;">
                ${o.title}
              </h4>
              <p class="body-sm" style="color: var(--on-surface-variant); margin-bottom: 10px;">
                ${o.details}
              </p>

              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--surface-container-high); padding-top: 10px;">
                <div style="font-size: 11px; color: var(--outline);">
                  Assignee: <strong style="color: var(--primary);">${o.assignee}</strong>
                </div>

                <div style="display: flex; gap: 6px;">
                  ${b?`
                    <span class="badge badge-clean" style="font-size: 10px;">Done</span>
                  `:`
                    ${E?"":`
                      <button class="btn-secondary start-task-btn" data-id="${o.id}" style="padding: 4px 10px; font-size: 11px;">
                        Start Task
                      </button>
                    `}
                    <button class="btn-primary complete-task-btn" data-id="${o.id}" style="padding: 4px 12px; font-size: 11px; background: #2e7d32;">
                      ✓ Complete
                    </button>
                  `}
                </div>
              </div>
            </div>
          `}).join("")}
      </div>
    </div>
  `}function Xe(){document.querySelectorAll(".task-cat-pill").forEach(e=>{e.addEventListener("click",()=>{c.state.selectedTaskCat=e.dataset.cat,c.notify()})}),document.querySelectorAll(".start-task-btn").forEach(e=>{e.addEventListener("click",()=>{const i=e.dataset.id;c.updateTaskStatus(i,"In Progress"),S("Task In Progress",`Task #${i} moved to In Progress`,"hourglass_top")})}),document.querySelectorAll(".complete-task-btn").forEach(e=>{e.addEventListener("click",()=>{const i=e.dataset.id;c.updateTaskStatus(i,"Completed"),S("Task Completed",`Task #${i} marked as completed and logged to handover.`,"check_circle")})})}function et(r){const t=[{title:"Chiller & HVAC Loop",status:"Optimal",val:"21.4°C / 48% RH",icon:"ac_unit",color:"var(--success)"},{title:"Domestic Water Pumps",status:"Optimal",val:"5.2 Bar Flow",icon:"water_drop",color:"var(--success)"},{title:"High-Speed Wi-Fi APs",status:"Active (99.8%)",val:"64/64 Online",icon:"wifi",color:"var(--success)"},{title:"Smart Lock Telemetry",status:"Low Battery",val:"Room 303 (12%)",icon:"lock_open",color:"var(--error)"}],s=r.tasks.filter(e=>e.category==="Maintenance");return`
    <div class="app-content animate-fade-in" style="padding-bottom: 40px;">
      <!-- Title -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div class="label-bold" style="color: var(--error);">Engineering Operations</div>
          <h2 class="display-title" style="font-size: 24px;">Maintenance Hub</h2>
        </div>
        <button class="btn-secondary" id="run-telemetry-btn" style="padding: 4px 10px; font-size: 11px;">
          ↻ Diagnostics
        </button>
      </div>

      <!-- Live Building Telemetry -->
      <div class="glass-card" style="padding: 16px;">
        <div class="label-bold" style="margin-bottom: 12px;">Building System Telemetry</div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
          ${t.map(e=>`
            <div style="background: var(--surface-container-low); padding: 10px 12px; border-radius: var(--radius-sm); border: 1px solid var(--outline-variant);">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <span class="material-symbols-outlined" style="font-size: 18px; color: ${e.color};">${e.icon}</span>
                <span style="font-size: 9px; font-weight: 700; color: ${e.color};">${e.status}</span>
              </div>
              <div style="font-weight: 700; font-size: 12px; color: var(--primary);">${e.title}</div>
              <div style="font-size: 11px; color: var(--on-surface-variant); margin-top: 2px;">${e.val}</div>
            </div>
          `).join("")}
        </div>
      </div>

      <!-- Active Maintenance Dispatches -->
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="label-bold">Active Repair Dispatches (${s.length})</div>
        ${s.length===0?`
          <div class="glass-card" style="padding: 20px; text-align: center; color: var(--on-surface-variant);">
            All facility systems operating nominally.
          </div>
        `:s.map(e=>`
          <div class="glass-card" style="padding: 16px; border-left: 4px solid var(--error);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <span class="badge badge-dirty" style="font-size: 9px;">Room ${e.room}</span>
              <span style="font-size: 11px; font-weight: 600; color: var(--on-surface-variant);">${e.timeDue}</span>
            </div>
            <h4 style="font-family: var(--font-serif); font-size: 15px; font-weight: 700; color: var(--primary);">
              ${e.title}
            </h4>
            <p class="body-sm" style="color: var(--on-surface-variant); margin: 6px 0 10px 0;">
              ${e.details}
            </p>
            <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--surface-container-high); padding-top: 8px;">
              <span style="font-size: 11px; color: var(--outline);">Technician: <strong>${e.assignee}</strong></span>
              <button class="btn-primary complete-maint-btn" data-id="${e.id}" style="padding: 4px 10px; font-size: 11px; background: var(--primary);">
                Sign Off & Close
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `}function tt(){const r=document.getElementById("run-telemetry-btn");r&&r.addEventListener("click",()=>{S("Diagnostics Completed","All 12 BMS automation gateways responding in 4ms.","sensors")}),document.querySelectorAll(".complete-maint-btn").forEach(s=>{s.addEventListener("click",()=>{const e=s.dataset.id;c.updateTaskStatus(e,"Completed"),S("Maintenance Sign-off",`Task #${e} marked as inspected and operational.`,"check_circle")})})}function at(r){const t=r.inventory,s=t.filter(e=>e.status==="Critical"||e.status==="Low Stock");return`
    <div class="app-content animate-fade-in" style="padding-bottom: 40px;">
      <!-- Title -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div class="label-bold" style="color: var(--secondary);">LuxeStay Supply Chain</div>
          <h2 class="display-title" style="font-size: 24px;">Inventory Control</h2>
        </div>
        <button class="btn-primary" id="restock-all-btn" style="padding: 6px 12px; font-size: 11px;">
          + PO Reorder
        </button>
      </div>

      <!-- Critical Warnings Banner -->
      ${s.length>0?`
        <div class="glass-card" style="padding: 14px 16px; border-left: 4px solid var(--error); background: #fff8f8;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="material-symbols-outlined" style="color: var(--error); font-size: 24px;">warning</span>
            <div>
              <div style="font-weight: 700; font-size: 13px; color: var(--error);">
                ${s.length} items below minimum safety threshold
              </div>
              <div class="body-sm" style="color: var(--on-surface-variant);">
                ${s.map(e=>e.name.split(" ")[0]).join(", ")} require replenishment.
              </div>
            </div>
          </div>
        </div>
      `:""}

      <!-- Inventory Stock Items -->
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="label-bold">Par Stock Levels</div>
        ${t.map(e=>{const i=e.status==="Critical"||e.status==="Out of Stock",o=e.status==="Low Stock",d=Math.min(100,Math.round(e.stock/(e.minThreshold*2.5)*100));return`
            <div class="glass-card" style="padding: 14px 16px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                <div>
                  <span class="label-bold" style="font-size: 9px; color: var(--secondary);">${e.category} • ${e.location}</span>
                  <h4 style="font-family: var(--font-serif); font-size: 14px; font-weight: 700; color: var(--primary); margin-top: 2px;">
                    ${e.name}
                  </h4>
                </div>
                <span class="badge ${i?"badge-dirty":o?"badge-dnd":"badge-clean"}" style="font-size: 9px;">
                  ${e.status}
                </span>
              </div>

              <!-- Progress bar -->
              <div style="margin: 8px 0 10px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
                  <span>Current: <strong>${e.stock} ${e.unit}</strong></span>
                  <span style="color: var(--outline);">Par Min: ${e.minThreshold}</span>
                </div>
                <div style="width: 100%; height: 6px; background: var(--surface-container-high); border-radius: 3px; overflow: hidden;">
                  <div style="width: ${d}%; height: 100%; background: ${i?"var(--error)":o?"var(--warning)":"#2e7d32"}; transition: width 0.3s ease;"></div>
                </div>
              </div>

              <!-- Quick Stock Steppers -->
              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--surface-container-high); padding-top: 8px;">
                <span style="font-size: 11px; color: var(--outline);">Adjust on-hand count:</span>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <button class="btn-icon stock-step-btn" data-id="${e.id}" data-delta="-5" style="background: var(--surface-container); width: 28px; height: 28px; font-size: 11px; font-weight: 700;">
                    -5
                  </button>
                  <button class="btn-icon stock-step-btn" data-id="${e.id}" data-delta="-1" style="background: var(--surface-container); width: 28px; height: 28px;">
                    <span class="material-symbols-outlined" style="font-size: 14px;">remove</span>
                  </button>
                  <span style="font-weight: 700; font-size: 13px; min-width: 24px; text-align: center;">${e.stock}</span>
                  <button class="btn-icon stock-step-btn" data-id="${e.id}" data-delta="1" style="background: var(--surface-container); width: 28px; height: 28px;">
                    <span class="material-symbols-outlined" style="font-size: 14px;">add</span>
                  </button>
                  <button class="btn-icon stock-step-btn" data-id="${e.id}" data-delta="10" style="background: var(--primary); color: white; width: 28px; height: 28px; font-size: 11px; font-weight: 700;">
                    +10
                  </button>
                </div>
              </div>
            </div>
          `}).join("")}
      </div>
    </div>
  `}function st(){document.querySelectorAll(".stock-step-btn").forEach(s=>{s.addEventListener("click",()=>{const e=s.dataset.id,i=parseInt(s.dataset.delta,10);c.updateInventoryStock(e,i);const o=c.state.inventory.find(d=>d.id===e);S("Stock Adjusted",`${o.name}: ${o.stock} ${o.unit}`,"inventory_2")})});const t=document.getElementById("restock-all-btn");t&&t.addEventListener("click",()=>{S("Purchase Order Created","PO #8841 auto-generated for Diptyque soaps & luxury linens.","local_shipping")})}function it(r){return`
    <div class="app-content animate-fade-in" style="padding-bottom: 40px;">
      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div class="label-bold" style="color: var(--secondary);">Hospitality Excellence</div>
          <h2 class="display-title" style="font-size: 24px;">Team & Shifts</h2>
        </div>
        <button class="btn-primary" id="submit-handover-btn" style="padding: 6px 12px; font-size: 11px;">
          + Shift Handover
        </button>
      </div>

      <!-- KPI Overview Cards -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
        <div class="glass-card" style="padding: 10px; text-align: center;">
          <div class="label-bold" style="font-size: 9px;">Turnaround</div>
          <div style="font-size: 18px; font-weight: 800; color: var(--primary); margin-top: 2px;">24 min</div>
          <div style="font-size: 9px; color: #2e7d32;">↑ 8% faster</div>
        </div>
        <div class="glass-card" style="padding: 10px; text-align: center;">
          <div class="label-bold" style="font-size: 9px;">Pass Rate</div>
          <div style="font-size: 18px; font-weight: 800; color: var(--primary); margin-top: 2px;">99.2%</div>
          <div style="font-size: 9px; color: #2e7d32;">5-Star Audited</div>
        </div>
        <div class="glass-card" style="padding: 10px; text-align: center;">
          <div class="label-bold" style="font-size: 9px;">Active Staff</div>
          <div style="font-size: 18px; font-weight: 800; color: var(--secondary); margin-top: 2px;">18 On Duty</div>
          <div style="font-size: 9px; color: var(--outline);">Wing A & B</div>
        </div>
      </div>

      <!-- Staff Roster & Leaderboard -->
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="label-bold">On-Duty Shift Roster (Aug 31)</div>
        ${[{name:"Elena Gomez",role:"Floor 4 Lead",shift:"Morning (07:00 - 15:30)",score:"99.4%",roomsDone:14,avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",status:"On Duty"},{name:"Maria Santos",role:"VIP Senior Butler",shift:"Morning (07:00 - 15:30)",score:"98.8%",roomsDone:11,avatar:"https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",status:"On Duty"},{name:"Pierre Dubois",role:"Head In-Room Butler",shift:"All-Day (08:00 - 16:30)",score:"99.1%",roomsDone:22,avatar:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",status:"On Duty"},{name:"Carlos Ruiz",role:"Turnaround Specialist",shift:"Evening (15:00 - 23:30)",score:"96.5%",roomsDone:9,avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",status:"Upcoming"},{name:"Fatima Zahra",role:"Floor 3 Lead",shift:"Morning (07:00 - 15:30)",score:"97.9%",roomsDone:16,avatar:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",status:"On Duty"}].map((s,e)=>`
          <div class="glass-card" style="padding: 12px 14px; display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="position: relative;">
                <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 1.5px solid var(--primary-fixed-dim);">
                  <img src="${s.avatar}" alt="${s.name}" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
                ${e===0?'<span style="position: absolute; bottom: -2px; right: -2px; font-size: 12px;">👑</span>':""}
              </div>
              <div>
                <div style="font-weight: 700; font-size: 13px; color: var(--primary);">${s.name}</div>
                <div class="body-sm" style="font-size: 11px; color: var(--on-surface-variant);">${s.role} • ${s.shift}</div>
              </div>
            </div>

            <div style="text-align: right;">
              <span class="badge ${s.status==="On Duty"?"badge-clean":"badge-inspected"}" style="font-size: 9px;">
                ${s.status}
              </span>
              <div style="font-size: 11px; font-weight: 700; color: var(--secondary); margin-top: 2px;">
                ${s.roomsDone} rooms (${s.score})
              </div>
            </div>
          </div>
        `).join("")}
      </div>

      <!-- Shift Handover Notes -->
      <div class="glass-card" style="padding: 16px;">
        <div class="label-bold" style="margin-bottom: 8px;">Supervisor Shift Handover Log</div>
        <div style="background: var(--surface-container-low); padding: 12px; border-radius: var(--radius-sm); font-size: 12px; line-height: 1.5; color: var(--on-surface);">
          <strong>07:00 AM - Morning Briefing:</strong><br />
          • Suite 501 (Presidential) requires vintage Champagne setup at 12:00 PM.<br />
          • Suite 402 (Mr. Harrison) requested extra plush towels and lavender mist.<br />
          • HVAC inspection ongoing for Room 303 thermostat sensor.
        </div>
      </div>
    </div>
  `}function nt(){const r=document.getElementById("submit-handover-btn");r&&r.addEventListener("click",()=>{S("Shift Handover Report","Handover notes synced to Duty Manager and Evening Supervisor.","note_add")})}let N=!1;function _(){const r=document.getElementById("app");if(!r)return;const t=c.state,s=t.currentView;let e="",i=()=>{};switch(s){case"guest-home":e=le(t),i=de;break;case"dining":e=Oe(t),i=qe;break;case"checkout":e=Fe(t),i=Ve;break;case"order-tracking":e=He(t),i=Ne;break;case"schedule-service":e=_e(),i=Ge;break;case"report-issue":e=We(),i=Ue;break;case"guest-requests":e=Ke(t),i=Qe;break;case"staff-rooms":e=Ze(t),i=Je;break;case"staff-tasks":e=Ye(t),i=Xe;break;case"staff-maintenance":e=et(t),i=tt;break;case"staff-inventory":e=at(t),i=st;break;case"staff-shifts":e=it(),i=nt;break;default:e=le(t),i=de}r.innerHTML=`
    <!-- Floating Frame / Preview Switcher for Desktop / Mobile -->
    <div class="preview-control-bar">
      <button class="preview-pill-btn ${N?"":"active"}" id="toggle-frame-mode-btn">
        <span class="material-symbols-outlined" style="font-size: 16px;">smartphone</span>
        Mobile Frame
      </button>
      <button class="preview-pill-btn ${N?"active":""}" id="toggle-full-mode-btn">
        <span class="material-symbols-outlined" style="font-size: 16px;">fullscreen</span>
        Fluid View
      </button>
    </div>

    <div class="app-viewport-wrapper ${N?"frame-fullscreen":""}">
      <div class="mobile-device-frame">
        <div class="device-notch"></div>
        ${Be(t)}
        ${e}
        ${Pe(t)}
        ${Re(t)}
      </div>
    </div>
  `,Ae(),Te(),Le(),i();const o=document.getElementById("toggle-frame-mode-btn"),d=document.getElementById("toggle-full-mode-btn");o&&o.addEventListener("click",()=>{N=!1,_()}),d&&d.addEventListener("click",()=>{N=!0,_()})}document.addEventListener("DOMContentLoaded",()=>{_(),c.subscribe(()=>{_()})});
