// ==========================================================================
// VOLVITECH HOSPITALITY OS — UNIFIED ENTERPRISE REACTIVE DATA STORE
// Single Source of Truth (SSOT) with Connected Event Workflows
// ==========================================================================

const STORAGE_KEY = 'volvitech_hospitality_os_v1_store';

// ── Initial Master Data & Properties ──────────────────────────────────────
const initialProperties = [
  { id: 'prop-0', name: 'The Grand Meridian', code: 'TGM-IN', location: 'Emirates / India', currency: 'INR', currencySymbol: '₹', roomsCount: 120, stars: 5 },
  { id: 'prop-1', name: 'The Grand Astoria Palm & Resort', code: 'GAP-DXB', location: 'Palm Jumeirah, Dubai', currency: 'USD', currencySymbol: '$', roomsCount: 32, stars: 5 },
  { id: 'prop-2', name: 'Volvitech Alpine Grand Palace', code: 'VAG-STM', location: 'St. Moritz, Switzerland', currency: 'CHF', currencySymbol: 'CHF ', roomsCount: 48, stars: 5 },
  { id: 'prop-3', name: 'Volvitech Metropolis Central', code: 'VMC-LON', location: 'Mayfair, London', currency: 'GBP', currencySymbol: '£', roomsCount: 65, stars: 5 }
];

const initialRoomTypes = [
  { id: 'rt-1', name: 'Classic King Room', code: 'CKR', basePrice: 280, maxOccupancy: 2, sizeSqM: 38, count: 8 },
  { id: 'rt-2', name: 'Deluxe Ocean Suite', code: 'DOS', basePrice: 480, maxOccupancy: 3, sizeSqM: 65, count: 12 },
  { id: 'rt-3', name: 'Executive Panoramic Suite', code: 'EPS', basePrice: 750, maxOccupancy: 4, sizeSqM: 92, count: 8 },
  { id: 'rt-4', name: 'Presidential Royal Penthouse', code: 'PRP', basePrice: 2400, maxOccupancy: 6, sizeSqM: 220, count: 4 }
];

const initialRooms = [
  // Penthouse Floor 5
  { id: '501', floor: '5', typeId: 'rt-4', type: 'Presidential Royal Penthouse', status: 'Inspected', occupancy: 'Occupied', guest: 'H.R.H. Sheikh Al-Sabah', reservationId: 'res-501', vip: true, dnd: true, housekeeper: 'Maria Santos', lastCleaned: '08:00 AM' },
  { id: '502', floor: '5', typeId: 'rt-4', type: 'Presidential Royal Penthouse', status: 'Clean', occupancy: 'Occupied', guest: 'Sir William Sterling', reservationId: 'res-502', vip: true, dnd: false, housekeeper: 'Maria Santos', lastCleaned: '10:45 AM' },

  // Floor 4 (Suites)
  { id: '401', floor: '4', typeId: 'rt-3', type: 'Executive Panoramic Suite', status: 'Clean', occupancy: 'Occupied', guest: 'Lady Eleanor Vance', reservationId: 'res-401', vip: true, dnd: false, housekeeper: 'Maria Santos', lastCleaned: '10:30 AM' },
  { id: '402', floor: '4', typeId: 'rt-2', type: 'Deluxe Ocean Suite', status: 'Inspected', occupancy: 'Occupied', guest: 'Mr. James Harrison', reservationId: 'res-402', vip: true, dnd: false, housekeeper: 'Elena Gomez', lastCleaned: '09:15 AM' },
  { id: '403', floor: '4', typeId: 'rt-2', type: 'Deluxe Ocean Suite', status: 'Dirty', occupancy: 'Vacant', guest: 'Vacant / Departure', reservationId: null, vip: false, dnd: false, housekeeper: 'Maria Santos', lastCleaned: 'Yesterday' },
  { id: '404', floor: '4', typeId: 'rt-2', type: 'Deluxe Ocean Suite', status: 'In Progress', occupancy: 'Occupied', guest: 'Ms. Clara Dupont', reservationId: 'res-404', vip: false, dnd: false, housekeeper: 'Elena Gomez', lastCleaned: 'In Progress' },
  { id: '405', floor: '4', typeId: 'rt-3', type: 'Executive Panoramic Suite', status: 'Clean', occupancy: 'Occupied', guest: 'Dr. Aris Thorne', reservationId: 'res-405', vip: true, dnd: true, housekeeper: 'Carlos Ruiz', lastCleaned: '11:00 AM' },
  { id: '406', floor: '4', typeId: 'rt-3', type: 'Executive Panoramic Suite', status: 'Inspected', occupancy: 'Vacant', guest: 'Vacant / Ready', reservationId: null, vip: false, dnd: false, housekeeper: 'Elena Gomez', lastCleaned: '08:45 AM' },

  // Floor 3
  { id: '301', floor: '3', typeId: 'rt-1', type: 'Classic King Room', status: 'Clean', occupancy: 'Occupied', guest: 'Marcus Aurel', reservationId: 'res-301', vip: false, dnd: false, housekeeper: 'Fatima Zahra', lastCleaned: '11:20 AM' },
  { id: '302', floor: '3', typeId: 'rt-1', type: 'Classic King Room', status: 'Dirty', occupancy: 'Vacant', guest: 'Vacant / Departure', reservationId: null, vip: false, dnd: false, housekeeper: 'Fatima Zahra', lastCleaned: 'Yesterday' },
  { id: '303', floor: '3', typeId: 'rt-2', type: 'Deluxe Ocean Suite', status: 'In Progress', occupancy: 'Occupied', guest: 'Ambassador Al-Mansoor', reservationId: 'res-303', vip: true, dnd: false, housekeeper: 'Carlos Ruiz', lastCleaned: 'In Progress' },
  { id: '304', floor: '3', typeId: 'rt-1', type: 'Classic King Room', status: 'Inspected', occupancy: 'Occupied', guest: 'Sophia Laurent', reservationId: 'res-304', vip: false, dnd: false, housekeeper: 'Fatima Zahra', lastCleaned: '10:00 AM' },
  { id: '305', floor: '3', typeId: 'rt-2', type: 'Deluxe Ocean Suite', status: 'Dirty', occupancy: 'Vacant', guest: 'Vacant / Ready to Clean', reservationId: null, vip: false, dnd: false, housekeeper: 'Carlos Ruiz', lastCleaned: 'Pending' },
  { id: '306', floor: '3', typeId: 'rt-1', type: 'Classic King Room', status: 'Clean', occupancy: 'Occupied', guest: 'Julian Croft', reservationId: 'res-306', vip: false, dnd: false, housekeeper: 'Fatima Zahra', lastCleaned: '11:45 AM' },

  // Floor 2
  { id: '201', floor: '2', typeId: 'rt-1', type: 'Classic King Room', status: 'Clean', occupancy: 'Occupied', guest: 'Robert Lang', reservationId: 'res-201', vip: false, dnd: false, housekeeper: 'David Kim', lastCleaned: '09:30 AM' },
  { id: '202', floor: '2', typeId: 'rt-1', type: 'Classic King Room', status: 'Inspected', occupancy: 'Occupied', guest: 'Anna Becker', reservationId: 'res-202', vip: false, dnd: false, housekeeper: 'David Kim', lastCleaned: '10:15 AM' },
  { id: '203', floor: '2', typeId: 'rt-2', type: 'Deluxe Ocean Suite', status: 'Dirty', occupancy: 'Vacant', guest: 'Vacant / Checkout', reservationId: null, vip: false, dnd: false, housekeeper: 'David Kim', lastCleaned: 'Yesterday' },
  { id: '204', floor: '2', typeId: 'rt-1', type: 'Classic King Room', status: 'In Progress', occupancy: 'Occupied', guest: 'Emma Watson', reservationId: 'res-204', vip: false, dnd: false, housekeeper: 'David Kim', lastCleaned: 'In Progress' },
  { id: '205', floor: '2', typeId: 'rt-1', type: 'Classic King Room', status: 'Clean', occupancy: 'Vacant', guest: 'Vacant / Ready', reservationId: null, vip: false, dnd: false, housekeeper: 'David Kim', lastCleaned: '10:30 AM' },
  { id: '206', floor: '2', typeId: 'rt-2', type: 'Deluxe Ocean Suite', status: 'Inspected', occupancy: 'Vacant', guest: 'Vacant / Ready', reservationId: null, vip: false, dnd: false, housekeeper: 'David Kim', lastCleaned: '08:15 AM' }
];

const initialGuests = [
  {
    id: 'gst-1',
    name: 'Mr. James Harrison',
    email: 'j.harrison@vanguardcap.com',
    phone: '+1 (555) 382-9901',
    vipTier: 'Platinum',
    currentRoom: '402',
    lifetimeSpend: 48500,
    totalStays: 14,
    loyaltyPoints: 34200,
    passportNumber: 'US-9823411A',
    preferences: {
      pillow: 'Hypoallergenic Foam & Feather',
      roomTemp: '20.5°C',
      dietary: 'Nut Allergy (Severe), Gluten-Free',
      beverage: 'Sparkling San Pellegrino & Nespresso Intenso',
      newspaper: 'Financial Times'
    },
    notes: 'Global Partner at Vanguard Capital. High priority for room upgrades. Prefers late checkout.'
  },
  {
    id: 'gst-2',
    name: 'Lady Eleanor Vance',
    email: 'eleanor.vance@kensington-trust.co.uk',
    phone: '+44 20 7946 0912',
    vipTier: 'Platinum',
    currentRoom: '401',
    lifetimeSpend: 92400,
    totalStays: 22,
    loyaltyPoints: 68100,
    passportNumber: 'GB-4412098B',
    preferences: {
      pillow: 'Goose Down Silk Casing',
      roomTemp: '21.0°C',
      dietary: 'Vegetarian, Organic Only',
      beverage: 'Earl Grey White Tea & Laurent-Perrier Champagne',
      newspaper: 'The Times'
    },
    notes: 'Long-standing VIP patron. Always assign Floor 4 or 5. Enjoys private spa bookings at 5:00 PM.'
  },
  {
    id: 'gst-3',
    name: 'H.R.H. Sheikh Al-Sabah',
    email: 'royal.office@alsabah-holding.kw',
    phone: '+965 2200 4400',
    vipTier: 'Royal Diamond',
    currentRoom: '501',
    lifetimeSpend: 340000,
    totalStays: 38,
    loyaltyPoints: 215000,
    passportNumber: 'KW-9911000R',
    preferences: {
      pillow: 'Handmade Silk & Siberian Down',
      roomTemp: '19.5°C',
      dietary: 'Halal Certified, Strict Gourmet',
      beverage: 'Royal Amber Oud Water & Premium Arabic Coffee',
      newspaper: 'International Herald'
    },
    notes: 'Requires 24/7 dedicated butler Pierre Dubois and security clearance protocol.'
  }
];

const initialReservations = [
  {
    id: 'res-402',
    confirmationCode: 'VOL-88291',
    guestId: 'gst-1',
    guestName: 'Mr. James Harrison',
    roomNumber: '402',
    roomType: 'Deluxe Ocean Suite',
    checkIn: '2026-09-01',
    checkOut: '2026-09-06',
    status: 'Checked In',
    ratePerNight: 480,
    nights: 5,
    adults: 2,
    children: 0,
    channel: 'Direct Corporate VIP',
    corporateAccount: 'Vanguard Capital Partners',
    totalAmount: 2400.00,
    paidAmount: 2400.00
  },
  {
    id: 'res-401',
    confirmationCode: 'VOL-88292',
    guestId: 'gst-2',
    guestName: 'Lady Eleanor Vance',
    roomNumber: '401',
    roomType: 'Executive Panoramic Suite',
    checkIn: '2026-08-30',
    checkOut: '2026-09-04',
    status: 'Checked In',
    ratePerNight: 750,
    nights: 5,
    adults: 1,
    children: 0,
    channel: 'Direct Web VIP',
    corporateAccount: null,
    totalAmount: 3750.00,
    paidAmount: 3750.00
  },
  {
    id: 'res-501',
    confirmationCode: 'VOL-88290',
    guestId: 'gst-3',
    guestName: 'H.R.H. Sheikh Al-Sabah',
    roomNumber: '501',
    roomType: 'Presidential Royal Penthouse',
    checkIn: '2026-08-28',
    checkOut: '2026-09-10',
    status: 'Checked In',
    ratePerNight: 2400,
    nights: 13,
    adults: 4,
    children: 2,
    channel: 'Private Ambassador Protocol',
    corporateAccount: 'Al-Sabah Global Trust',
    totalAmount: 31200.00,
    paidAmount: 31200.00
  },
  {
    id: 'res-406',
    confirmationCode: 'VOL-90114',
    guestId: 'gst-4',
    guestName: 'Sir Arthur Wellesley',
    roomNumber: '406',
    roomType: 'Executive Panoramic Suite',
    checkIn: '2026-09-01',
    checkOut: '2026-09-05',
    status: 'Confirmed Arrival',
    ratePerNight: 750,
    nights: 4,
    adults: 2,
    children: 0,
    channel: 'Direct Corporate',
    corporateAccount: 'Barclays Capital',
    totalAmount: 3000.00,
    paidAmount: 1500.00
  }
];

const initialFolios = {
  '402': {
    roomNumber: '402',
    guestName: 'Mr. James Harrison',
    reservationId: 'res-402',
    status: 'Open',
    currency: '$',
    items: [
      { id: 'tx-1', date: '2026-09-01 14:00', code: 'RM-CHG', desc: 'Room Tariff - Deluxe Ocean Suite (Night 1)', amount: 480.00, tax: 48.00, dept: 'Rooms', status: 'Posted' },
      { id: 'tx-2', date: '2026-09-01 19:45', code: 'FB-POS', desc: 'In-Room Dining — Miyazaki Wagyu Burger & San Pellegrino', amount: 56.00, tax: 5.60, dept: 'Food & Beverage', status: 'Posted' },
      { id: 'tx-3', date: '2026-09-02 08:30', code: 'FB-POS', desc: 'Artisan Continental Breakfast & Illy Espresso', amount: 42.00, tax: 4.20, dept: 'Food & Beverage', status: 'Posted' },
      { id: 'tx-4', date: '2026-09-02 11:00', code: 'LND-SRV', desc: 'Express Dry Cleaning & Shirt Pressing (3 items)', amount: 65.00, tax: 6.50, dept: 'Laundry', status: 'Posted' }
    ],
    payments: [
      { id: 'pay-1', date: '2026-09-01 14:00', method: 'Amex Centurion (...9012)', amount: 480.00, ref: 'AUTH-99214' }
    ]
  }
};

// ── Housekeeping Staff Roster (Proline PMS Standard) ─────────────────────
const initialHousekeepingStaff = [
  { id: 'hk-staff-1', name: 'Maria Santos', role: 'Lead Attendant', initials: 'MS', primaryFloors: ['5', '4'], maxCredits: 14.0, onDuty: true, shift: 'Morning (07:00 - 15:30)' },
  { id: 'hk-staff-2', name: 'Elena Gomez', role: 'Senior Attendant', initials: 'EG', primaryFloors: ['4'], maxCredits: 14.0, onDuty: true, shift: 'Morning (07:00 - 15:30)' },
  { id: 'hk-staff-3', name: 'Fatima Zahra', role: 'Floor Attendant', initials: 'FZ', primaryFloors: ['3'], maxCredits: 14.0, onDuty: true, shift: 'Morning (07:00 - 15:30)' },
  { id: 'hk-staff-4', name: 'Carlos Ruiz', role: 'Floor Attendant', initials: 'CR', primaryFloors: ['3', '4'], maxCredits: 14.0, onDuty: true, shift: 'Morning (07:00 - 15:30)' },
  { id: 'hk-staff-5', name: 'David Kim', role: 'Floor Attendant', initials: 'DK', primaryFloors: ['2'], maxCredits: 14.0, onDuty: true, shift: 'Morning (07:00 - 15:30)' },
  { id: 'hk-staff-6', name: 'Aisha Patel', role: 'Express Float Attendant', initials: 'AP', primaryFloors: ['2', '3'], maxCredits: 14.0, onDuty: true, shift: 'Morning (07:00 - 15:30)' }
];

// ── Housekeeping Tasks ────────────────────────────────────────────────────
const initialHousekeepingTasks = [
  { id: 'hk-1', roomNumber: '403', floor: '4', type: 'Full Departure Clean', priority: 'Urgent', status: 'Pending', assignedTo: 'Maria Santos', credits: 3.5, estimatedMin: 45, checklistDone: 0, checklistTotal: 8 },
  { id: 'hk-2', roomNumber: '404', floor: '4', type: 'Daily Stayover Refresh', priority: 'Normal', status: 'In Progress', assignedTo: 'Elena Gomez', credits: 2.0, estimatedMin: 25, checklistDone: 4, checklistTotal: 8 },
  { id: 'hk-3', roomNumber: '302', floor: '3', type: 'Full Departure Clean', priority: 'High', status: 'Pending', assignedTo: 'Fatima Zahra', credits: 3.5, estimatedMin: 45, checklistDone: 0, checklistTotal: 8 },
  { id: 'hk-4', roomNumber: '305', floor: '3', type: 'Deep Steam Clean & Sanitize', priority: 'High', status: 'Pending', assignedTo: 'Carlos Ruiz', credits: 4.0, estimatedMin: 60, checklistDone: 0, checklistTotal: 8 },
  { id: 'hk-5', roomNumber: '203', floor: '2', type: 'Full Departure Clean', priority: 'Normal', status: 'Pending', assignedTo: 'David Kim', credits: 3.0, estimatedMin: 40, checklistDone: 0, checklistTotal: 8 }
];

// ── Maintenance Work Orders (with live SLA) ──────────────────────────────
const initialMaintenanceTickets = [
  {
    id: 'maint-101',
    roomOrArea: 'Room 303',
    assetName: 'Daikin VRV Chiller AC Unit',
    assetCode: 'HVAC-303-A',
    category: 'HVAC & Climate',
    priority: 'Critical',
    slaMinutesRemaining: 34,
    reportedBy: 'Ambassador Al-Mansoor',
    assignedEngineer: 'Tariq Mahmoud (Lead HVAC)',
    description: 'Chilled water supply valve restricted; room ambient temperature reading 25.8°C vs setpoint 20.0°C.',
    status: 'In Progress',
    partsUsed: ['2-Way Solenoid Valve Actuator', 'Thermal Sensor Probe'],
    createdAt: '2026-09-01 11:15'
  },
  {
    id: 'maint-102',
    roomOrArea: 'Room 402',
    assetName: 'Hansgrohe Raindance Waterfall Shower',
    assetCode: 'PLUMB-402-SHW',
    category: 'Plumbing',
    priority: 'High',
    slaMinutesRemaining: 85,
    reportedBy: 'Mr. James Harrison',
    assignedEngineer: 'Marco Bellini (Plumbing Spec.)',
    description: 'Thermostatic cartridge temperature dial stiff; pressure fluctuation noted on hot water line.',
    status: 'Pending',
    partsUsed: [],
    createdAt: '2026-09-01 12:00'
  },
  {
    id: 'maint-103',
    roomOrArea: 'Kitchen Central Pastry',
    assetName: 'Rational iCombi Pro Combi-Oven',
    assetCode: 'KIT-OVN-04',
    category: 'Kitchen Equipment',
    priority: 'High',
    slaMinutesRemaining: 110,
    reportedBy: 'Chef Antoine (Exec Pastry)',
    assignedEngineer: 'Rajesh Kumar (Kitchen Mech.)',
    description: 'Boiler descaling alert triggered; steam injection solenoid needs calibration.',
    status: 'In Progress',
    partsUsed: ['Rational Descaling Care Tabs (x4)'],
    createdAt: '2026-09-01 10:30'
  }
];

// ── F&B Raw Ingredients, Recipes & BOM Costing ───────────────────────────
const initialIngredients = [
  { id: 'ing-1', sku: 'RAW-BEEF-WAGYU', name: 'Miyazaki A5 Wagyu Beef Striploin', category: 'Meats', unit: 'kg', stock: 18.5, minPar: 10.0, costPerUnit: 110.00, store: 'Kitchen Cold Store' },
  { id: 'ing-2', sku: 'RAW-BUN-BRIOCHE', name: 'Handmade French Brioche Burger Buns', category: 'Bakery', unit: 'pcs', stock: 120, minPar: 60, costPerUnit: 1.20, store: 'Pastry Store' },
  { id: 'ing-3', sku: 'RAW-TRUFFLE-AIOLI', name: 'Black Summer Truffle Infused Aioli', category: 'Condiments', unit: 'kg', stock: 4.2, minPar: 3.0, costPerUnit: 45.00, store: 'Kitchen Dry Store' },
  { id: 'ing-4', sku: 'RAW-CAVIAR-OSCIETRA', name: 'Royal Oscietra Caviar (Imperial Tin)', category: 'Luxury F&B', unit: 'tin (50g)', stock: 8, minPar: 12, costPerUnit: 85.00, store: 'Kitchen Cold Store' }, // LOW STOCK!
  { id: 'ing-5', sku: 'RAW-SALMON-SCOTTISH', name: 'Wild Scottish Smoked Salmon', category: 'Seafood', unit: 'kg', stock: 12.0, minPar: 8.0, costPerUnit: 38.00, store: 'Kitchen Cold Store' },
  { id: 'ing-6', sku: 'RAW-COFFEE-ILLY', name: 'Illy Classico Arabica Whole Beans', category: 'Beverages', unit: 'kg', stock: 24.0, minPar: 15.0, costPerUnit: 26.00, store: 'Main Beverage Store' }
];

const initialRecipes = [
  {
    id: 'rec-1',
    name: 'Wagyu Beef Burger (A5 Miyazaki)',
    menuCategoryId: 'Mains',
    sellingPrice: 48.00,
    portionSize: '1 Burger (220g patty)',
    yieldPct: 95,
    prepTimeMin: 25,
    matrixCategory: 'Star', // High Margin, High Popularity
    ingredients: [
      { ingredientId: 'ing-1', name: 'Miyazaki A5 Wagyu Beef', qty: 0.22, unit: 'kg', unitCost: 110.00, lineCost: 24.20 },
      { ingredientId: 'ing-2', name: 'Handmade Brioche Bun', qty: 1, unit: 'pcs', unitCost: 1.20, lineCost: 1.20 },
      { ingredientId: 'ing-3', name: 'Black Truffle Aioli', qty: 0.03, unit: 'kg', unitCost: 45.00, lineCost: 1.35 }
    ],
    standardCost: 26.75,
    foodCostPct: 55.7,
    instructions: '1. Sear seasoned wagyu patty on high iron plancha for 2.5 min each side. 2. Toast brioche bun with clarified butter. 3. Apply truffle aioli, aged gruyere, caramelized shallots.'
  },
  {
    id: 'rec-2',
    name: 'Eggs Royale with Oscietra Caviar',
    menuCategoryId: 'Breakfast',
    sellingPrice: 58.00,
    portionSize: '2 Poached Eggs on Brioche',
    yieldPct: 98,
    prepTimeMin: 20,
    matrixCategory: 'Plowhorse', // High Popularity, Moderate Margin
    ingredients: [
      { ingredientId: 'ing-5', name: 'Wild Scottish Smoked Salmon', qty: 0.08, unit: 'kg', unitCost: 38.00, lineCost: 3.04 },
      { ingredientId: 'ing-4', name: 'Royal Oscietra Caviar', qty: 0.2, unit: 'tin (10g eq)', unitCost: 85.00, lineCost: 17.00 },
      { ingredientId: 'ing-2', name: 'Brioche Muffin', qty: 1, unit: 'pcs', unitCost: 1.20, lineCost: 1.20 }
    ],
    standardCost: 21.24,
    foodCostPct: 36.6,
    instructions: '1. Poach 2 farm-fresh eggs to 63°C soft yolk. 2. Layer smoked salmon over warm brioche. 3. Spoon hollandaise and top with 10g Oscietra caviar.'
  }
];

// ── Multi-Store Inventory, Purchase Requisitions & POs ──────────────────
const initialStores = [
  { id: 'str-1', name: 'Central Warehouse Depot', code: 'MAIN-WH', manager: 'Farooq Al-Qasimi', itemsCount: 420 },
  { id: 'str-2', name: 'Kitchen Executive Cold Store', code: 'KIT-COLD', manager: 'Chef Antoine', itemsCount: 86 },
  { id: 'str-3', name: 'Housekeeping Linen & Chemical Store', code: 'HK-LINEN', manager: 'Elena Gomez', itemsCount: 54 },
  { id: 'str-4', name: 'Engineering & Spares Bay', code: 'ENG-SPARE', manager: 'Tariq Mahmoud', itemsCount: 140 }
];

const initialStockLedger = [
  { id: 'stk-1', sku: 'LIN-BED-KNG-EGY', name: '600TC Egyptian Cotton King Sheet Sets', store: 'HK-LINEN', category: 'Linen', currentStock: 48, minPar: 60, maxPar: 150, unit: 'sets', costPerUnit: 85.00, status: 'Low Stock' },
  { id: 'stk-2', sku: 'AMN-BVLG-GEL', name: 'Bvlgari Thé Blanc Shower Gel (75ml)', store: 'HK-LINEN', category: 'Guest Amenities', currentStock: 340, minPar: 200, maxPar: 800, unit: 'bottles', costPerUnit: 4.50, status: 'Healthy' },
  { id: 'stk-3', sku: 'RAW-CAVIAR-OSCIETRA', name: 'Royal Oscietra Caviar (50g)', store: 'KIT-COLD', category: 'Luxury F&B', currentStock: 8, minPar: 12, maxPar: 30, unit: 'tins', costPerUnit: 85.00, status: 'Critical Par Breach' },
  { id: 'stk-4', sku: 'ENG-VRV-ACTUATOR', name: 'Daikin VRV 2-Way Valve Actuator', store: 'ENG-SPARE', category: 'HVAC Spares', currentStock: 2, minPar: 4, maxPar: 10, unit: 'units', costPerUnit: 145.00, status: 'Low Stock' }
];

const initialPurchaseRequisitions = [
  {
    id: 'pr-1042',
    prNumber: 'PR-2026-0042',
    storeCode: 'KIT-COLD',
    department: 'Food & Beverage',
    requestedBy: 'Chef Antoine (Exec Chef)',
    createdAt: '2026-09-01 09:30',
    status: 'Pending GM Approval',
    urgency: 'High',
    items: [
      { sku: 'RAW-CAVIAR-OSCIETRA', name: 'Royal Oscietra Caviar (50g)', qty: 20, unit: 'tins', estUnitCost: 85.00, totalCost: 1700.00 },
      { sku: 'RAW-BEEF-WAGYU', name: 'Miyazaki A5 Wagyu Striploin', qty: 25, unit: 'kg', estUnitCost: 110.00, totalCost: 2750.00 }
    ],
    totalAmount: 4450.00,
    justification: 'Weekend banquet booking for Royal Embassy delegation; stock approaching minimum par.'
  },
  {
    id: 'pr-1041',
    prNumber: 'PR-2026-0041',
    storeCode: 'HK-LINEN',
    department: 'Housekeeping',
    requestedBy: 'Elena Gomez (HK Lead)',
    createdAt: '2026-08-31 16:00',
    status: 'Approved - PO Issued',
    urgency: 'Normal',
    items: [
      { sku: 'LIN-BED-KNG-EGY', name: '600TC Egyptian Cotton King Sets', qty: 50, unit: 'sets', estUnitCost: 85.00, totalCost: 4250.00 }
    ],
    totalAmount: 4250.00,
    justification: 'Replacing quarterly worn linen par stock for Floors 3 and 4.'
  }
];

const initialPurchaseOrders = [
  {
    id: 'po-5501',
    poNumber: 'PO-VOL-2026-5501',
    prRef: 'PR-2026-0041',
    vendorName: 'Riviera Luxury Textiles Ltd.',
    vendorContact: 'sales@rivieralinen.com',
    issuedDate: '2026-08-31',
    expectedDelivery: '2026-09-03',
    status: 'Issued / In Transit',
    totalAmount: 4250.00,
    paymentTerms: 'Net 30 Days',
    matchStatus: 'Awaiting GRV (3-Way Match Pending)'
  }
];

// ── Initial State Structure ───────────────────────────────────────────────
function getInitialState() {
  return {
    // Enterprise Auth, Multi-Property & Workspace Context
    isAuthenticated: false,
    currentUser: null,
    activeWorkspace: null, // null = Workspace Selector Screen
    authorizedWorkspaces: [],
    currentProperty: {
      id: 'prop-0',
      code: 'TGM-IN',
      name: 'The Grand Meridian',
      location: 'Grand Meridian Boulevard',
      currency: 'INR',
      currency_symbol: '₹',
      stars: 5,
      rooms_count: 120
    },
    availableProperties: initialProperties,

    // Platform navigation & active contexts
    currentPropertyId: 'prop-0',
    currentRole: 'gm', // 'owner', 'gm', 'front_desk', 'housekeeping', 'maintenance', 'fb_chef', 'procurement', 'guest'
    currentInterfaceMode: 'web_hms', // 'web_hms', 'staff_app', 'guest_app'
    activeNavTab: 'reservations', // 'dashboard', 'tape_chart', 'reservations', 'housekeeping', 'maintenance', 'fb_recipes', 'inventory', 'procurement', 'guests', 'analytics', 'settings'
    
    // UI state
    isCommandPaletteOpen: false,
    commandSearchQuery: '',
    activeModal: null, // null or { type: 'string', data: {} }
    toast: null,
    
    // Core Domain Data
    properties: initialProperties,
    roomTypes: initialRoomTypes,
    rooms: initialRooms,
    guests: initialGuests,
    reservations: initialReservations,
    folios: initialFolios,
    housekeepingTasks: initialHousekeepingTasks,
    housekeepingStaff: initialHousekeepingStaff,
    maintenanceTickets: initialMaintenanceTickets,
    ingredients: initialIngredients,
    recipes: initialRecipes,
    stores: initialStores,
    stockLedger: initialStockLedger,
    purchaseRequisitions: initialPurchaseRequisitions,
    purchaseOrders: initialPurchaseOrders,
    
    // Guest active session state (simulated logged-in guest)
    activeGuestStay: {
      roomNumber: '402',
      guestName: 'Mr. James Harrison',
      vipTier: 'Platinum',
      checkIn: '2026-09-01',
      checkOut: '2026-09-06',
      pinCode: '4029',
      isDigitalKeyUnlocked: false
    },
    guestCart: [],
    guestRequests: [
      { id: 'req-1', title: 'Extra Hypoallergenic Pillows (x2)', category: 'Housekeeping', status: 'In Transit', time: '12:15 PM' },
      { id: 'req-2', title: 'Suit Steam Pressing (2 jackets)', category: 'Laundry', status: 'Delivered', time: '10:45 AM' }
    ]
  };
}

// ── Central Reactive Store Implementation ──────────────────────────────────
class VolvitechStore {
  constructor() {
    this.listeners = [];
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load saved state from localStorage, initializing fresh:', e);
    }
    return getInitialState();
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.saveState();
    this.listeners.forEach(fn => fn(this.state));
  }

  // ── Actions & Mutators ──────────────────────────────────────────────────

  loginUser(authData) {
    this.state.isAuthenticated = true;
    this.state.currentUser = authData.user;
    this.state.currentProperty = authData.currentProperty || this.state.currentProperty;
    this.state.availableProperties = authData.availableProperties || this.state.availableProperties;
    this.state.authorizedWorkspaces = authData.authorizedWorkspaces || [];
    this.state.activeWorkspace = null; // Direct user to Workspace Selector first!
    this.notify();
  }

  logoutUser() {
    this.state.isAuthenticated = false;
    this.state.currentUser = null;
    this.state.activeWorkspace = null;
    this.state.authorizedWorkspaces = [];
    this.notify();
  }

  selectWorkspace(workspaceId) {
    this.state.activeWorkspace = workspaceId;
    if (workspaceId === 'FRONT_DESK') {
      this.state.activeNavTab = 'reservations';
    }
    this.notify();
  }

  openWorkspaceSelector() {
    this.state.activeWorkspace = null;
    this.notify();
  }

  switchProperty(propertyId) {
    const prop = (this.state.availableProperties || []).find((p) => p.id === propertyId);
    if (prop) {
      this.state.currentProperty = prop;
      this.state.currentPropertyId = prop.id;
      this.notify();
    }
  }

  setProperty(propId) {
    this.state.currentPropertyId = propId;
    this.notify();
  }

  setRole(role) {
    this.state.currentRole = role;
    // Auto-adjust default nav tab based on role
    switch (role) {
      case 'front_desk':
        this.state.activeNavTab = 'reservations';
        break;
      case 'housekeeping':
        this.state.activeNavTab = 'housekeeping';
        break;
      case 'maintenance':
        this.state.activeNavTab = 'maintenance';
        break;
      case 'fb_chef':
        this.state.activeNavTab = 'fb_recipes';
        break;
      case 'procurement':
        this.state.activeNavTab = 'procurement';
        break;
      case 'guest':
        this.state.currentInterfaceMode = 'guest_app';
        break;
      default:
        this.state.activeNavTab = 'dashboard';
    }
    this.notify();
  }

  setInterfaceMode(mode) {
    this.state.currentInterfaceMode = mode;
    this.notify();
  }

  setNavTab(tab) {
    if (tab === 'housekeeping' && this.state.activeWorkspace !== 'HOUSEKEEPING') {
      this.state.activeWorkspace = 'HOUSEKEEPING';
    }
    if (tab === 'maintenance' && this.state.activeWorkspace !== 'MAINTENANCE') {
      this.state.activeWorkspace = 'MAINTENANCE';
    }
    if (['reservations', 'dashboard', 'reservations_list', 'arrivals', 'inhouse', 'departures', 'billing', 'crm', 'groups', 'keycards', 'lostfound', 'house_status', 'room_status', 'room_board', 'room_assignment', 'queue_reservations', 'messages', 'traces', 'wakeup_calls'].includes(tab) && this.state.activeWorkspace !== 'FRONT_DESK') {
      this.state.activeWorkspace = 'FRONT_DESK';
    }
    this.state.activeNavTab = tab;
    this.notify();
  }

  setModal(modalConfig) {
    this.state.activeModal = modalConfig;
    this.notify();
  }

  closeModal() {
    this.state.activeModal = null;
    this.notify();
  }

  setCommandPalette(isOpen, query = '') {
    this.state.isCommandPaletteOpen = isOpen;
    this.state.commandSearchQuery = query;
    this.notify();
  }

  showToast(message, type = 'info') {
    this.state.toast = { id: Date.now(), message, type };
    this.notify();
    setTimeout(() => {
      if (this.state.toast && Date.now() - this.state.toast.id >= 3500) {
        this.state.toast = null;
        this.notify();
      }
    }, 4000);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CONNECTED WORKFLOW ACTIONS (REAL-TIME CROSS-MODULE LOGIC)
  // ═══════════════════════════════════════════════════════════════════════════

  // WORKFLOW 1: Check-in Guest
  checkInReservation(resId, assignedRoomNumber) {
    const res = this.state.reservations.find(r => r.id === resId);
    if (!res) return;

    res.status = 'Checked In';
    res.roomNumber = assignedRoomNumber;

    // Update Room
    const room = this.state.rooms.find(r => r.id === assignedRoomNumber);
    if (room) {
      room.occupancy = 'Occupied';
      room.guest = res.guestName;
      room.reservationId = res.id;
    }

    // Initialize Folio if not present
    if (!this.state.folios[assignedRoomNumber]) {
      this.state.folios[assignedRoomNumber] = {
        roomNumber: assignedRoomNumber,
        guestName: res.guestName,
        reservationId: res.id,
        status: 'Open',
        currency: '$',
        items: [
          {
            id: `tx-${Date.now()}`,
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            code: 'RM-CHG',
            desc: `Room Tariff - ${res.roomType} (Night 1)`,
            amount: res.ratePerNight,
            tax: res.ratePerNight * 0.1,
            dept: 'Rooms',
            status: 'Posted'
          }
        ],
        payments: []
      };
    }

    this.showToast(`Checked in ${res.guestName} to Room ${assignedRoomNumber}`, 'success');
    this.notify();
  }

  // WORKFLOW 2: Checkout Guest -> Room Dirty -> Housekeeping Task Created
  checkOutRoom(roomNumber) {
    const room = this.state.rooms.find(r => r.id === roomNumber);
    if (!room) return;

    const previousGuest = room.guest;
    room.occupancy = 'Vacant';
    room.status = 'Dirty';
    room.guest = 'Vacant / Departure';
    room.reservationId = null;

    // Settle / Close Folio
    if (this.state.folios[roomNumber]) {
      this.state.folios[roomNumber].status = 'Settled & Closed';
    }

    // Automatically create Housekeeping Task
    const newTaskId = `hk-${Date.now()}`;
    this.state.housekeepingTasks.unshift({
      id: newTaskId,
      roomNumber: roomNumber,
      floor: room.floor,
      type: 'Full Departure Clean & Turnover',
      priority: 'Urgent',
      status: 'Pending',
      assignedTo: room.housekeeper || 'Elena Gomez',
      credits: 3.5,
      estimatedMin: 45,
      checklistDone: 0,
      checklistTotal: 8
    });

    this.showToast(`Checkout completed for Room ${roomNumber}. Room marked Dirty; HK task dispatched.`, 'success');
    this.notify();
  }

  // WORKFLOW 2B: Housekeeping Status Flow (Dirty -> Cleaning -> Clean -> Inspected)
  updateHousekeepingTaskStatus(taskId, newStatus) {
    const task = (this.state.housekeepingTasks || []).find(t => t.id === taskId);
    if (!task) return;

    task.status = newStatus;
    const room = (this.state.rooms || []).find(r => String(r.id) === String(task.roomNumber));

    if (room) {
      if (newStatus === 'In Progress') {
        room.status = 'In Progress';
      } else if (newStatus === 'Completed') {
        room.status = 'Clean';
        task.checklistDone = task.checklistTotal;
      } else if (newStatus === 'Inspected') {
        room.status = 'Inspected';
        task.status = 'Inspected';
      }
    }

    this.showToast(`HK Task ${taskId} for Room ${task.roomNumber} updated to "${newStatus}"`, 'info');
    this.notify();
  }

  // Room Status & Staff Assignment Unified Method
  updateRoomStatus(roomId, newStatus, housekeeper = null) {
    const room = (this.state.rooms || []).find(r => String(r.id) === String(roomId));
    if (room) {
      room.status = newStatus;
      if (housekeeper) {
        room.housekeeper = housekeeper;
      }
    }
    const task = (this.state.housekeepingTasks || []).find(t => String(t.roomNumber) === String(roomId));
    if (task) {
      if (newStatus === 'In Progress') task.status = 'In Progress';
      else if (newStatus === 'Clean') task.status = 'Completed';
      else if (newStatus === 'Inspected') task.status = 'Inspected';
      else if (newStatus === 'Dirty') task.status = 'Pending';
      if (housekeeper) {
        task.assignedTo = housekeeper;
      }
    }
    this.notify();
  }

  // Assign Staff Directly to a Room (Proline PMS style)
  assignStaffToRoom(roomNumber, staffName) {
    const room = (this.state.rooms || []).find(r => String(r.id) === String(roomNumber));
    if (room) {
      room.housekeeper = staffName;
    }
    let task = (this.state.housekeepingTasks || []).find(t => String(t.roomNumber) === String(roomNumber));
    if (task) {
      task.assignedTo = staffName;
    } else if (room && (room.status === 'Dirty' || room.status === 'In Progress')) {
      task = {
        id: `hk-${Date.now()}-${room.id}`,
        roomNumber: String(room.id),
        floor: String(room.floor),
        type: room.vip ? 'VIP Suite Deep Clean' : 'Turnaround Departure Clean',
        priority: room.vip ? 'Urgent' : 'Normal',
        status: 'In Progress',
        assignedTo: staffName,
        credits: room.floor === '5' ? 4.5 : room.floor === '4' ? 3.5 : 2.5,
        estimatedMin: 40,
        checklistDone: 0,
        checklistTotal: 8
      };
      this.state.housekeepingTasks.unshift(task);
    }
    this.showToast(`Room #${roomNumber} assigned to ${staffName}`, 'success');
    this.notify();
  }

  // Auto-Assign Daily Tasks across on-duty attendants (Proline PMS style)
  autoAssignDailyTasks({ strategy = 'balanced', selectedStaffIds = [] } = {}) {
    const activeStaff = (this.state.housekeepingStaff || []).filter(s => 
      s.onDuty && (selectedStaffIds.length === 0 || selectedStaffIds.includes(s.id))
    );

    if (activeStaff.length === 0) {
      this.showToast('No active attendants selected for auto-assignment.', 'error');
      return { assignedCount: 0 };
    }

    // Collect all tasks & dirty rooms needing assignment
    const pendingTasks = (this.state.housekeepingTasks || []).filter(t => t.status === 'Pending' || !t.assignedTo || t.assignedTo === 'Unassigned');
    const dirtyRooms = (this.state.rooms || []).filter(r => r.status === 'Dirty');

    // Create tasks for dirty rooms without an active task
    dirtyRooms.forEach(room => {
      const exists = (this.state.housekeepingTasks || []).some(t => String(t.roomNumber) === String(room.id));
      if (!exists) {
        pendingTasks.push({
          id: `hk-${Date.now()}-${room.id}`,
          roomNumber: String(room.id),
          floor: String(room.floor),
          type: room.vip ? 'VIP Suite Turnaround' : 'Full Departure Clean',
          priority: room.vip ? 'Urgent' : 'Normal',
          status: 'Pending',
          assignedTo: 'Unassigned',
          credits: room.floor === '5' ? 4.5 : room.floor === '4' ? 3.5 : 2.5,
          estimatedMin: 40,
          checklistDone: 0,
          checklistTotal: 8
        });
      }
    });

    if (pendingTasks.length === 0) {
      this.showToast('All daily turnaround tasks are already assigned and dispatched.', 'info');
      return { assignedCount: 0 };
    }

    // Strategy 1: Floor Section Zoning (Zoned to primary floors)
    if (strategy === 'floor_zone') {
      pendingTasks.forEach(task => {
        let bestStaff = activeStaff.find(s => s.primaryFloors && s.primaryFloors.includes(String(task.floor)));
        if (!bestStaff) {
          bestStaff = [...activeStaff].sort((a, b) => this.getStaffTotalCredits(a.name) - this.getStaffTotalCredits(b.name))[0];
        }
        task.assignedTo = bestStaff.name;
        task.status = 'In Progress';
        const room = (this.state.rooms || []).find(r => String(r.id) === String(task.roomNumber));
        if (room) {
          room.housekeeper = bestStaff.name;
          if (room.status === 'Dirty') room.status = 'In Progress';
        }
      });
    } 
    // Strategy 2: Priority & VIP First
    else if (strategy === 'priority_vip') {
      const priorityOrder = { Urgent: 3, High: 2, Normal: 1, Low: 0 };
      const sortedTasks = [...pendingTasks].sort((a, b) => (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0));
      sortedTasks.forEach(task => {
        const sortedStaff = [...activeStaff].sort((a, b) => this.getStaffTotalCredits(a.name) - this.getStaffTotalCredits(b.name));
        const chosenStaff = sortedStaff[0];
        task.assignedTo = chosenStaff.name;
        task.status = 'In Progress';
        const room = (this.state.rooms || []).find(r => String(r.id) === String(task.roomNumber));
        if (room) {
          room.housekeeper = chosenStaff.name;
          if (room.status === 'Dirty') room.status = 'In Progress';
        }
      });
    }
    // Strategy 3: Balanced Credits (Default Proline standard)
    else {
      pendingTasks.forEach(task => {
        const sortedStaff = [...activeStaff].sort((a, b) => this.getStaffTotalCredits(a.name) - this.getStaffTotalCredits(b.name));
        const chosenStaff = sortedStaff[0];
        task.assignedTo = chosenStaff.name;
        task.status = 'In Progress';
        const room = (this.state.rooms || []).find(r => String(r.id) === String(task.roomNumber));
        if (room) {
          room.housekeeper = chosenStaff.name;
          if (room.status === 'Dirty') room.status = 'In Progress';
        }
      });
    }

    // Merge any newly created tasks into state
    pendingTasks.forEach(pt => {
      const existing = (this.state.housekeepingTasks || []).find(t => t.id === pt.id);
      if (!existing) {
        this.state.housekeepingTasks.unshift(pt);
      }
    });

    this.showToast(`Auto-Assigned ${pendingTasks.length} rooms across ${activeStaff.length} on-duty attendants. Workload balanced.`, 'success');
    this.notify();
    return { assignedCount: pendingTasks.length, staffCount: activeStaff.length };
  }

  getStaffTotalCredits(staffName) {
    const tasks = (this.state.housekeepingTasks || []).filter(t => t.assignedTo === staffName && t.status !== 'Completed');
    return tasks.reduce((sum, t) => sum + (Number(t.credits) || 2.0), 0);
  }

  getStaffTotalRooms(staffName) {
    const rooms = (this.state.rooms || []).filter(r => r.housekeeper === staffName);
    return rooms.length;
  }

  // WORKFLOW 3: Maintenance Ticket Logged -> SLA Countdown -> Resolution
  createMaintenanceTicket(ticketData) {
    const newTicket = {
      id: `maint-${Date.now().toString().slice(-4)}`,
      roomOrArea: ticketData.roomOrArea,
      assetName: ticketData.assetName || 'General Fixture',
      assetCode: ticketData.assetCode || 'FIX-GEN',
      category: ticketData.category || 'General',
      priority: ticketData.priority || 'High',
      slaMinutesRemaining: ticketData.priority === 'Critical' ? 45 : ticketData.priority === 'High' ? 90 : 180,
      reportedBy: ticketData.reportedBy || 'Staff Member',
      assignedEngineer: ticketData.assignedEngineer || 'Tariq Mahmoud',
      description: ticketData.description,
      status: 'Pending',
      partsUsed: [],
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    this.state.maintenanceTickets.unshift(newTicket);
    this.showToast(`Maintenance Work Order ${newTicket.id} created with ${newTicket.slaMinutesRemaining}m SLA`, 'warning');
    this.notify();
  }

  resolveMaintenanceTicket(ticketId, resolutionNotes = '', partsDeducted = []) {
    const ticket = this.state.maintenanceTickets.find(t => t.id === ticketId);
    if (!ticket) return;

    ticket.status = 'Resolved';
    ticket.resolutionNotes = resolutionNotes;
    ticket.resolvedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

    if (partsDeducted && partsDeducted.length > 0) {
      ticket.partsUsed = partsDeducted;
      // Deduct spares from inventory
      partsDeducted.forEach(partName => {
        const item = this.state.stockLedger.find(s => s.name.toLowerCase().includes(partName.toLowerCase()));
        if (item && item.currentStock > 0) {
          item.currentStock -= 1;
        }
      });
    }

    this.showToast(`Work Order ${ticketId} resolved. Spare parts deducted from Engineering Store.`, 'success');
    this.notify();
  }

  // WORKFLOW 4: Food & Beverage Order -> Folio Charge -> Recipe BOM Deducts Inventory
  orderMenuItem(roomNumber, recipeId, quantity = 1) {
    const recipe = this.state.recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const totalAmount = recipe.sellingPrice * quantity;
    const taxAmount = totalAmount * 0.1;

    // 1. Post to Guest Folio
    if (this.state.folios[roomNumber]) {
      this.state.folios[roomNumber].items.unshift({
        id: `tx-${Date.now()}`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        code: 'FB-POS',
        desc: `In-Room Dining — ${recipe.name} (x${quantity})`,
        amount: totalAmount,
        tax: taxAmount,
        dept: 'Food & Beverage',
        status: 'Posted'
      });
    }

    // 2. Bill of Materials (BOM) Auto-Deduction from Kitchen Store
    recipe.ingredients.forEach(ing => {
      const inventoryItem = this.state.ingredients.find(i => i.id === ing.ingredientId);
      if (inventoryItem) {
        const deductedQty = ing.qty * quantity;
        inventoryItem.stock = Math.max(0, +(inventoryItem.stock - deductedQty).toFixed(2));

        // Check if now breached Par level -> auto trigger Requisition recommendation
        if (inventoryItem.stock < inventoryItem.minPar) {
          this.checkAndTriggerParBreachPR(inventoryItem);
        }
      }
    });

    this.showToast(`Order confirmed: ${recipe.name} posted to Folio Room ${roomNumber}. Ingredients deducted via BOM.`, 'success');
    this.notify();
  }

  // WORKFLOW 5: Inventory Par Level Breach -> Automated Purchase Requisition
  checkAndTriggerParBreachPR(inventoryItem) {
    const existingPR = this.state.purchaseRequisitions.find(pr => 
      pr.status.includes('Pending') && pr.items.some(i => i.sku === inventoryItem.sku)
    );
    if (existingPR) return; // Already requested

    const reorderQty = Math.ceil(inventoryItem.minPar * 2);
    const estTotal = +(reorderQty * inventoryItem.costPerUnit).toFixed(2);

    const newPR = {
      id: `pr-${Date.now().toString().slice(-4)}`,
      prNumber: `PR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      storeCode: inventoryItem.store ? (inventoryItem.store.includes('Cold') ? 'KIT-COLD' : 'MAIN-WH') : 'MAIN-WH',
      department: inventoryItem.category === 'Luxury F&B' || inventoryItem.category === 'Meats' ? 'Food & Beverage' : 'General Store',
      requestedBy: 'System Auto-Replenishment',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Pending GM Approval',
      urgency: 'Critical Par Breach',
      items: [
        {
          sku: inventoryItem.sku,
          name: inventoryItem.name,
          qty: reorderQty,
          unit: inventoryItem.unit,
          estUnitCost: inventoryItem.costPerUnit,
          totalCost: estTotal
        }
      ],
      totalAmount: estTotal,
      justification: `Automated Par-Level breach detection: current stock (${inventoryItem.stock} ${inventoryItem.unit}) fell below minimum safety par (${inventoryItem.minPar} ${inventoryItem.unit}).`
    };

    this.state.purchaseRequisitions.unshift(newPR);
    this.showToast(`Alert: Par breached for ${inventoryItem.name}. Auto-generated ${newPR.prNumber}.`, 'warning');
  }

  // WORKFLOW 5B: Manager Approves PR -> Generates Purchase Order (PO)
  approvePurchaseRequisition(prId) {
    const pr = this.state.purchaseRequisitions.find(p => p.id === prId);
    if (!pr) return;

    pr.status = 'Approved - PO Issued';
    pr.approvedBy = 'General Manager';
    pr.approvedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newPO = {
      id: `po-${Date.now().toString().slice(-4)}`,
      poNumber: `PO-VOL-2026-${Math.floor(5000 + Math.random() * 4000)}`,
      prRef: pr.prNumber,
      vendorName: pr.department === 'Food & Beverage' ? 'Gourmet Imports & Meats Global' : 'Grand Supplies Corp.',
      vendorContact: 'orders@gourmetimports.com',
      issuedDate: new Date().toISOString().substring(0, 10),
      expectedDelivery: new Date(Date.now() + 86400000 * 2).toISOString().substring(0, 10),
      status: 'Issued / In Transit',
      totalAmount: pr.totalAmount,
      paymentTerms: 'Net 30 Days',
      matchStatus: 'Awaiting GRV (3-Way Match Pending)'
    };

    this.state.purchaseOrders.unshift(newPO);
    this.showToast(`Approved ${pr.prNumber}. Purchase Order ${newPO.poNumber} issued to vendor.`, 'success');
    this.notify();
  }

  // WORKFLOW 5C: Goods Receipt Voucher (GRV) -> 3-Way Match & Stock Restoration
  receiveGoodsPO(poId) {
    const po = this.state.purchaseOrders.find(p => p.id === poId);
    if (!po) return;

    po.status = 'Delivered & Completed';
    po.matchStatus = '3-Way Match Verified (PO = GRV = Invoice)';
    po.receivedDate = new Date().toISOString().substring(0, 10);

    // Find linked PR and restore stock
    const pr = this.state.purchaseRequisitions.find(p => p.prNumber === po.prRef);
    if (pr && pr.items) {
      pr.items.forEach(item => {
        const inv = this.state.ingredients.find(i => i.sku === item.sku);
        if (inv) {
          inv.stock += item.qty;
        }
        const stk = this.state.stockLedger.find(s => s.sku === item.sku);
        if (stk) {
          stk.currentStock += item.qty;
          stk.status = 'Healthy';
        }
      });
    }

    this.showToast(`Goods received for ${po.poNumber}. 3-Way Match verified and inventory incremented.`, 'success');
    this.notify();
  }

  // Folio Payment & Settlement
  settleGuestFolio(roomNumber, paymentMethod = 'Credit Card (Amex)', amount) {
    const folio = this.state.folios[roomNumber];
    if (!folio) return;

    const totalCharges = folio.items.reduce((sum, item) => sum + item.amount + item.tax, 0);
    const totalPayments = folio.payments.reduce((sum, p) => sum + p.amount, 0);
    const balance = +(totalCharges - totalPayments).toFixed(2);
    const payAmount = amount || balance;

    folio.payments.push({
      id: `pay-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      method: paymentMethod,
      amount: payAmount,
      ref: `AUTH-${Math.floor(100000 + Math.random() * 900000)}`
    });

    this.showToast(`Payment of $${payAmount.toFixed(2)} processed for Room ${roomNumber} via ${paymentMethod}`, 'success');
    this.notify();
  }

  // Recipe Creator Action
  addRecipe(newRecipeData) {
    const newId = `rec-${Date.now().toString().slice(-4)}`;
    this.state.recipes.push({
      id: newId,
      ...newRecipeData
    });
    this.showToast(`Recipe "${newRecipeData.name}" created with calculated Food Cost: ${newRecipeData.foodCostPct}%`, 'success');
    this.notify();
  }

  // Digital Key Toggle for Guest App
  toggleDigitalKey() {
    this.state.activeGuestStay.isDigitalKeyUnlocked = !this.state.activeGuestStay.isDigitalKeyUnlocked;
    const isUnlocked = this.state.activeGuestStay.isDigitalKeyUnlocked;
    this.showToast(isUnlocked ? 'Door Unlocked (BLE RFID Verified)' : 'Door Locked', isUnlocked ? 'success' : 'info');
    this.notify();
  }

  // Reset demo state to clean defaults
  resetState() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = getInitialState();
    this.showToast('System state reset to fresh enterprise demo baseline.', 'info');
    this.notify();
  }
}

export const store = new VolvitechStore();
