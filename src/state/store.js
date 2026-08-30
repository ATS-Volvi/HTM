// LuxeStay Central Reactive State Store

const STORAGE_KEY = 'luxestay_hotel_sync_state_v1';

const initialRoomsData = [
  // Floor 4 (Guest Room 402 is here)
  { id: '401', floor: '4', type: 'Executive Suite', status: 'Clean', guest: 'Lady Eleanor Vance', vip: true, dnd: false, housekeeper: 'Maria Santos', lastCleaned: '10:30 AM' },
  { id: '402', floor: '4', type: 'Deluxe Ocean View', status: 'Inspected', guest: 'Mr. James Harrison', vip: true, dnd: false, housekeeper: 'Elena Gomez', lastCleaned: '09:15 AM' },
  { id: '403', floor: '4', type: 'Premier King', status: 'Dirty', guest: 'Dr. Aris Thorne', vip: false, dnd: false, housekeeper: 'Maria Santos', lastCleaned: 'Yesterday' },
  { id: '404', floor: '4', type: 'Deluxe Ocean View', status: 'In Progress', guest: 'Ms. Clara Dupont', vip: false, dnd: false, housekeeper: 'Elena Gomez', lastCleaned: 'In Progress' },
  { id: '405', floor: '4', type: 'Executive Suite', status: 'Clean', guest: 'Sir William Sterling', vip: true, dnd: true, housekeeper: 'Carlos Ruiz', lastCleaned: '11:00 AM' },
  { id: '406', floor: '4', type: 'Grand Balcony King', status: 'Inspected', guest: 'Vacant / Ready', vip: false, dnd: false, housekeeper: 'Elena Gomez', lastCleaned: '08:45 AM' },

  // Floor 3
  { id: '301', floor: '3', type: 'Deluxe King', status: 'Clean', guest: 'Marcus Aurel', vip: false, dnd: false, housekeeper: 'Fatima Zahra', lastCleaned: '11:20 AM' },
  { id: '302', floor: '3', type: 'Deluxe Twin', status: 'Dirty', guest: 'Chen Wei & Guest', vip: false, dnd: false, housekeeper: 'Fatima Zahra', lastCleaned: 'Yesterday' },
  { id: '303', floor: '3', type: 'Ocean Suite', status: 'In Progress', guest: 'Ambassador Al-Mansoor', vip: true, dnd: false, housekeeper: 'Carlos Ruiz', lastCleaned: 'In Progress' },
  { id: '304', floor: '3', type: 'Deluxe King', status: 'Inspected', guest: 'Sophia Laurent', vip: false, dnd: false, housekeeper: 'Fatima Zahra', lastCleaned: '10:00 AM' },
  { id: '305', floor: '3', type: 'Premier King', status: 'Dirty', guest: 'Vacant / Departure', vip: false, dnd: false, housekeeper: 'Carlos Ruiz', lastCleaned: 'Pending' },
  { id: '306', floor: '3', type: 'Deluxe King', status: 'Clean', guest: 'Julian Croft', vip: false, dnd: false, housekeeper: 'Fatima Zahra', lastCleaned: '11:45 AM' },

  // Floor 2
  { id: '201', floor: '2', type: 'Classic King', status: 'Clean', guest: 'Robert Lang', vip: false, dnd: false, housekeeper: 'David Kim', lastCleaned: '09:30 AM' },
  { id: '202', floor: '2', type: 'Classic Twin', status: 'Inspected', guest: 'Anna Becker', vip: false, dnd: false, housekeeper: 'David Kim', lastCleaned: '10:15 AM' },
  { id: '203', floor: '2', type: 'Courtyard Suite', status: 'Dirty', guest: 'Oliver Queen', vip: false, dnd: false, housekeeper: 'David Kim', lastCleaned: 'Yesterday' },
  { id: '204', floor: '2', type: 'Classic King', status: 'In Progress', guest: 'Emma Watson', vip: false, dnd: false, housekeeper: 'David Kim', lastCleaned: 'In Progress' },

  // Penthouse Floor 5
  { id: '501', floor: '5', type: 'Presidential Royal Suite', status: 'Inspected', guest: 'H.R.H. Sheikh Al-Sabah', vip: true, dnd: true, housekeeper: 'Maria Santos (Senior)', lastCleaned: '08:00 AM' },
  { id: '502', floor: '5', type: 'Crown Penthouse', status: 'Clean', guest: 'Victoria & David Sterling', vip: true, dnd: false, housekeeper: 'Maria Santos (Senior)', lastCleaned: '10:45 AM' }
];

const initialDiningMenu = [
  {
    id: 'dish-1',
    name: 'Artisan Continental Breakfast',
    category: 'Breakfast',
    price: 42.00,
    time: '20-25 min',
    tag: "Chef's Selection",
    calories: '620 kcal',
    description: 'Freshly baked French croissants, pain au chocolat, handcrafted preserves, organic cultured butter, seasonal berries, and freshly squeezed Valencia orange juice with choice of Illy espresso.',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dish-2',
    name: 'Eggs Royale with Caviar',
    category: 'Breakfast',
    price: 58.00,
    time: '25-30 min',
    tag: 'Signature',
    calories: '710 kcal',
    description: 'Two poached organic heritage eggs, Scottish smoked salmon, toasted brioche muffin, Meyer lemon hollandaise sauce, garnished with Oscietra Royal Caviar and chives.',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dish-3',
    name: 'Avocado Tartine & Poached Eggs',
    category: 'Breakfast',
    price: 34.00,
    time: '15-20 min',
    tag: 'Healthy',
    calories: '490 kcal',
    description: 'Hass avocado mash, heirloom cherry tomatoes, Persian feta, toasted sourdough, pickled shallots, microgreens, and two organic poached eggs with dukkah spice.',
    image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dish-4',
    name: 'Wagyu Beef Burger (A5)',
    category: 'Mains',
    price: 48.00,
    time: '25-30 min',
    tag: 'Bestseller',
    calories: '890 kcal',
    description: '220g Miyazaki Wagyu patty, aged Gruyère, black truffle aioli, caramelized shallot relish, butter lettuce on a toasted brioche bun, served with rosemary salted triple-cooked fries.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dish-5',
    name: 'Pan-Seared Chilean Sea Bass',
    category: 'Mains',
    price: 64.00,
    time: '30-35 min',
    tag: 'Signature',
    calories: '560 kcal',
    description: 'Wild caught sea bass, saffron cauliflower purée, braised baby fennel, champagne beurre blanc, and crispy sea asparagus.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dish-6',
    name: 'Truffle Tagliolini Pasta',
    category: 'Mains',
    price: 52.00,
    time: '20-25 min',
    tag: 'Vegetarian',
    calories: '680 kcal',
    description: 'Handcrafted fresh egg tagliolini, 36-month Parmigiano-Reggiano cream, Normandy butter, topped with freshly shaved Norcia black winter truffle.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dish-7',
    name: 'Valrhona Grand Cru Soufflé',
    category: 'Desserts',
    price: 26.00,
    time: '20 min',
    tag: 'House Special',
    calories: '420 kcal',
    description: 'Warm 70% dark chocolate soufflé with molten center, Tahitian vanilla bean anglaise, and gold leaf hazelnut gelato.',
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dish-8',
    name: 'Dom Pérignon Vintage 2013 (750ml)',
    category: 'Beverages',
    price: 380.00,
    time: 'Instant',
    tag: 'Cellar Selection',
    calories: '150 kcal/glass',
    description: 'Iconic prestige Champagne, crisp elegance with notes of citrus, brioche, and smoky mineral finish. Served chilled in crystal flutes with an ice bucket.',
    image: 'https://images.unsplash.com/photo-1569919659476-f0852f6834b7?auto=format&fit=crop&w=600&q=80'
  }
];

const initialTasks = [
  {
    id: 'TSK-1081',
    title: 'Room 402 - Refresh Linens & Towels',
    category: 'Housekeeping',
    room: '402',
    guest: 'Mr. James Harrison',
    priority: 'Urgent',
    status: 'In Progress',
    timeDue: '11:00 AM',
    assignee: 'Elena Gomez',
    details: 'VIP guest requested extra plush bath sheets and lavender aromatherapy spray.'
  },
  {
    id: 'TSK-1082',
    title: 'Room 303 - Replace AC Thermostat Sensor',
    category: 'Maintenance',
    room: '303',
    guest: 'Ambassador Al-Mansoor',
    priority: 'High',
    status: 'Pending',
    timeDue: '11:30 AM',
    assignee: 'Marcus Vance (HVAC)',
    details: 'Guest reported ambient temperature reads 24°C despite being set to 20°C.'
  },
  {
    id: 'TSK-1083',
    title: 'Room 501 - Presidential Turndown & Champagne',
    category: 'Housekeeping',
    room: '501',
    guest: 'H.R.H. Sheikh Al-Sabah',
    priority: 'Urgent',
    status: 'Pending',
    timeDue: '12:00 PM',
    assignee: 'Maria Santos',
    details: 'Prepare evening turndown, floral refresh, and iced vintage Dom Pérignon setup.'
  },
  {
    id: 'TSK-1084',
    title: 'Room 401 - High-Speed Wi-Fi Router Check',
    category: 'Maintenance',
    room: '401',
    guest: 'Lady Eleanor Vance',
    priority: 'Normal',
    status: 'Completed',
    timeDue: '09:45 AM',
    assignee: 'Alex Rivera (IT)',
    details: 'Verified dedicated AP bandwidth at 850 Mbps symmetrical.'
  },
  {
    id: 'TSK-1085',
    title: 'Room 402 - Artisan Breakfast Delivery',
    category: 'Dining',
    room: '402',
    guest: 'Mr. James Harrison',
    priority: 'High',
    status: 'In Progress',
    timeDue: '08:30 AM',
    assignee: 'Pierre Dubois (Butler)',
    details: 'Cart #4 ready. Hot cloche covers and fresh orange juice.'
  }
];

const initialInventory = [
  { id: 'INV-01', name: 'Egyptian Cotton Bath Sheet (800 GSM)', category: 'Linens', stock: 142, minThreshold: 50, unit: 'pcs', status: 'Optimal', location: 'Linen Closet 4F' },
  { id: 'INV-02', name: 'Luxury Goose Feather Pillows', category: 'Linens', stock: 24, minThreshold: 30, unit: 'pcs', status: 'Low Stock', location: 'Central Laundry' },
  { id: 'INV-03', name: 'Acqua Di Parma Shower Gel 100ml', category: 'Amenities', stock: 380, minThreshold: 100, unit: 'bottles', status: 'Optimal', location: 'Housekeeping Hub' },
  { id: 'INV-04', name: 'Diptyque Hand Soap Bars', category: 'Amenities', stock: 18, minThreshold: 40, unit: 'bars', status: 'Critical', location: 'Housekeeping Hub' },
  { id: 'INV-05', name: 'San Pellegrino Sparkling 750ml', category: 'Minibar', stock: 95, minThreshold: 40, unit: 'bottles', status: 'Optimal', location: 'Minibar Pantry 3F' },
  { id: 'INV-06', name: 'Artisan Lavender Pillow Mist', category: 'Amenities', stock: 12, minThreshold: 25, unit: 'bottles', status: 'Critical', location: 'Linen Depot' }
];

const initialOrders = [
  {
    id: 'ORD-9942',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    room: '402',
    guestName: 'Mr. James Harrison',
    items: [
      { id: 'dish-1', name: 'Artisan Continental Breakfast', price: 42.00, quantity: 1 },
      { id: 'dish-3', name: 'Avocado Tartine & Poached Eggs', price: 34.00, quantity: 1 }
    ],
    subtotal: 76.00,
    serviceCharge: 13.68,
    tip: 10.00,
    total: 99.68,
    deliveryType: 'Room Delivery (ASAP)',
    notes: 'Please bring hot milk on the side.',
    status: 'preparing', // received -> preparing -> delivering -> delivered
    etaMinutes: 12,
    server: { name: 'Pierre Dubois', role: 'Head In-Room Butler', phone: '+1 (555) 019-4821' }
  }
];

const initialRequests = [
  {
    id: 'REQ-402-1',
    category: 'Housekeeping',
    title: 'Daily Room Refresh & Towels',
    time: 'Today at 11:00 AM',
    status: 'Scheduled',
    notes: 'Preference: Lavender aromatherapy spray and extra espresso capsules.',
    icon: 'cleaning_services'
  },
  {
    id: 'REQ-402-2',
    category: 'Valet',
    title: 'Express Suit Pressing',
    time: 'Today at 02:00 PM',
    status: 'In Progress',
    notes: '2 2-piece navy suits for evening banquet.',
    icon: 'local_laundry_service'
  }
];

class Store {
  constructor() {
    this.subscribers = new Set();
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          // Ensure arrays are present
          rooms: parsed.rooms?.length ? parsed.rooms : initialRoomsData,
          menu: initialDiningMenu,
          tasks: parsed.tasks?.length ? parsed.tasks : initialTasks,
          inventory: parsed.inventory?.length ? parsed.inventory : initialInventory,
          orders: parsed.orders?.length ? parsed.orders : initialOrders,
          requests: parsed.requests?.length ? parsed.requests : initialRequests
        };
      }
    } catch (e) {
      console.warn('Could not parse saved state, using initial state', e);
    }

    return {
      currentMode: 'guest', // 'guest' | 'staff'
      currentView: 'guest-home', // 'guest-home' | 'dining' | 'checkout' | 'order-tracking' | 'schedule-service' | 'report-issue' | 'guest-requests' | 'staff-rooms' | 'staff-tasks' | 'staff-maintenance' | 'staff-inventory' | 'staff-shifts' | 'staff-kpis' | 'staff-handover' | 'staff-profile'
      selectedFloor: '4',
      selectedCategory: 'All',
      dndActive: false,
      guestProfile: {
        name: 'Mr. James Harrison',
        room: '402',
        roomType: 'Deluxe Ocean View',
        checkIn: 'Aug 29, 2026',
        checkOut: 'Sep 05, 2026',
        tier: 'Platinum Elite VIP'
      },
      cart: [],
      rooms: initialRoomsData,
      menu: initialDiningMenu,
      tasks: initialTasks,
      inventory: initialInventory,
      orders: initialOrders,
      requests: initialRequests,
      activeModal: null, // { type: 'room-details'|'item-customize'|'stock-edit'|'report-issue', data: {} }
      selectedRoomDetails: null,
      selectedItemForModal: null,
      selectedTaskForModal: null
    };
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Error persisting state', e);
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    this.saveState();
    this.subscribers.forEach(cb => cb(this.state));
  }

  // --- ACTIONS ---

  setMode(mode) {
    this.state.currentMode = mode;
    if (mode === 'guest' && !this.state.currentView.startsWith('guest-') && !['dining', 'checkout', 'order-tracking', 'schedule-service', 'report-issue'].includes(this.state.currentView)) {
      this.state.currentView = 'guest-home';
    } else if (mode === 'staff' && !this.state.currentView.startsWith('staff-')) {
      this.state.currentView = 'staff-rooms';
    }
    this.notify();
  }

  setView(viewName) {
    this.state.currentView = viewName;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.notify();
  }

  toggleDND() {
    this.state.dndActive = !this.state.dndActive;
    // Update Room 402 in staff supervisor grid as well!
    const r402 = this.state.rooms.find(r => r.id === '402');
    if (r402) {
      r402.dnd = this.state.dndActive;
      if (this.state.dndActive) {
        r402.status = 'DND';
      } else {
        r402.status = 'Inspected';
      }
    }
    this.notify();
  }

  // Cart actions
  addToCart(dish, quantity = 1, specialInstructions = '') {
    const existingIndex = this.state.cart.findIndex(item => item.id === dish.id);
    if (existingIndex > -1) {
      this.state.cart[existingIndex].quantity += quantity;
    } else {
      this.state.cart.push({
        ...dish,
        quantity,
        specialInstructions
      });
    }
    this.notify();
  }

  updateCartQuantity(dishId, delta) {
    const itemIndex = this.state.cart.findIndex(item => item.id === dishId);
    if (itemIndex > -1) {
      this.state.cart[itemIndex].quantity += delta;
      if (this.state.cart[itemIndex].quantity <= 0) {
        this.state.cart.splice(itemIndex, 1);
      }
      this.notify();
    }
  }

  clearCart() {
    this.state.cart = [];
    this.notify();
  }

  createOrder(orderData) {
    const newOrder = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
      room: this.state.guestProfile.room,
      guestName: this.state.guestProfile.name,
      items: [...this.state.cart],
      subtotal: orderData.subtotal,
      serviceCharge: orderData.serviceCharge,
      tip: orderData.tip,
      total: orderData.total,
      deliveryType: orderData.deliveryType || 'Room Delivery (ASAP)',
      notes: orderData.notes || '',
      status: 'received', // received -> preparing -> delivering -> delivered
      etaMinutes: 25,
      server: { name: 'Pierre Dubois', role: 'Head In-Room Butler', phone: '+1 (555) 019-4821' }
    };

    this.state.orders.unshift(newOrder);
    this.state.cart = [];

    // Also add to staff task queue automatically!
    this.state.tasks.unshift({
      id: 'TSK-' + Math.floor(2000 + Math.random() * 8000),
      title: `Room ${newOrder.room} - In-Room Dining Order (${newOrder.items.length} items)`,
      category: 'Dining',
      room: newOrder.room,
      guest: newOrder.guestName,
      priority: 'High',
      status: 'Pending',
      timeDue: 'In 25 min',
      assignee: 'Pierre Dubois',
      details: newOrder.items.map(i => `${i.quantity}x ${i.name}`).join(', ')
    });

    this.state.currentView = 'order-tracking';
    this.notify();
    return newOrder;
  }

  advanceOrderStatus(orderId) {
    const order = this.state.orders.find(o => o.id === orderId);
    if (order) {
      const transitions = { received: 'preparing', preparing: 'delivering', delivering: 'delivered' };
      if (transitions[order.status]) {
        order.status = transitions[order.status];
        if (order.status === 'delivered') {
          order.etaMinutes = 0;
        } else if (order.status === 'delivering') {
          order.etaMinutes = 5;
        }
        this.notify();
      }
    }
  }

  // Room Management Actions
  updateRoomStatus(roomId, newStatus, housekeeper = null) {
    const room = this.state.rooms.find(r => r.id === roomId);
    if (room) {
      room.status = newStatus;
      if (housekeeper) room.housekeeper = housekeeper;
      if (roomId === '402') {
        this.state.dndActive = (newStatus === 'DND');
        room.dnd = this.state.dndActive;
      }
      this.notify();
    }
  }

  toggleRoomDND(roomId) {
    const room = this.state.rooms.find(r => r.id === roomId);
    if (room) {
      room.dnd = !room.dnd;
      room.status = room.dnd ? 'DND' : 'Clean';
      if (roomId === '402') {
        this.state.dndActive = room.dnd;
      }
      this.notify();
    }
  }

  // Service & Request Actions
  addServiceRequest(requestData) {
    const newReq = {
      id: 'REQ-' + Math.floor(100 + Math.random() * 900),
      category: requestData.category || 'Housekeeping',
      title: requestData.title,
      time: requestData.time || 'Today',
      status: 'Scheduled',
      notes: requestData.notes || '',
      icon: requestData.icon || 'cleaning_services'
    };

    this.state.requests.unshift(newReq);

    // Add to staff task queue
    this.state.tasks.unshift({
      id: 'TSK-' + Math.floor(3000 + Math.random() * 7000),
      title: `Room ${this.state.guestProfile.room} - ${newReq.title}`,
      category: newReq.category === 'Maintenance' ? 'Maintenance' : 'Housekeeping',
      room: this.state.guestProfile.room,
      guest: this.state.guestProfile.name,
      priority: requestData.priority || 'High',
      status: 'Pending',
      timeDue: requestData.timeSlot || 'Today 2:00 PM',
      assignee: 'Unassigned',
      details: requestData.notes
    });

    this.notify();
    return newReq;
  }

  updateTaskStatus(taskId, newStatus) {
    const task = this.state.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
      this.notify();
    }
  }

  updateInventoryStock(itemId, delta) {
    const item = this.state.inventory.find(i => i.id === itemId);
    if (item) {
      item.stock = Math.max(0, item.stock + delta);
      if (item.stock === 0) item.status = 'Out of Stock';
      else if (item.stock < item.minThreshold) item.status = 'Critical';
      else if (item.stock <= item.minThreshold * 1.5) item.status = 'Low Stock';
      else item.status = 'Optimal';
      this.notify();
    }
  }

  setFloor(floor) {
    this.state.selectedFloor = floor;
    this.notify();
  }

  openModal(type, data = {}) {
    this.state.activeModal = { type, data };
    this.notify();
  }

  closeModal() {
    this.state.activeModal = null;
    this.notify();
  }
}

export const store = new Store();
