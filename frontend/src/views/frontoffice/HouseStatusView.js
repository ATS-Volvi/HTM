// ==========================================================================
// VOLVITECH HOSPITALITY OS — HOUSE STATUS & ROOM MATRIX (STITCH DESIGN SYSTEM)
// Ultra-Premium Visual Room Status Matrix, Telemetry Ribbon & Comprehensive Drawer
// Supports: Detailed Summary, In-Drawer Check-Out, Services Hub, Housekeeping & Restaurant F&B
// ==========================================================================

import { store } from '../../state/store.js';
import { Toast } from '../../components/Toast.js';
import { CheckInModal } from './CheckInModal.js';
import { CheckOutModal } from './CheckOutModal.js';
import { NewBookingModal } from './NewBookingModal.js';
import { RoomStatusView } from './RoomStatusView.js';


export class HouseStatusView {
  constructor() {
    this.container = null;
    this.isLoading = false;
    this.searchQuery = '';
    this.selectedFloor = 'ALL'; // 'ALL', '1', '2', '3', '4', '5'
    this.selectedCategory = 'ALL'; // 'ALL', 'Standard', 'Executive', 'Suite', 'Deluxe', 'Penthouse'
    this.selectedStatus = 'ALL'; // 'ALL', 'Available', 'Checked In', 'Reserved', 'Paid', 'Checked Out', 'Damaged'
    this.activeDrawerTab = 'overview'; // 'overview' | 'checkout' | 'services' | 'housekeeping' | 'restaurant'
    this.selectedRoom = null;

    // Page-level tab: 'matrix' (House Matrix Board) | 'operations' (Room Operations Board)
    this.activePageTab = 'matrix';
    this.roomOpsView = new RoomStatusView();

    this.initRooms();
  }

  destroy() {
    if (this.roomOpsView && typeof this.roomOpsView.destroy === 'function') {
      this.roomOpsView.destroy();
    }
  }

  initRooms() {
    if (store.state.houseStatusRooms && store.state.houseStatusRooms.length > 0) {
      this.rooms = store.state.houseStatusRooms;
      if (!this.selectedRoom) {
        this.selectedRoom = this.rooms.find(r => r.number === '102') || this.rooms[0];
      }
      return;
    }

    // Comprehensive 6-column hotel rooms matching reference matrix & Stitch design
    this.rooms = [
      // ── Floor 1: Standard (101 - 112) ──
      {
        number: '101', category: 'Standard', floor: '1', status: 'Available', rate: 4500,
        bedding: '1 Queen Bed', size: '28 m²', wing: 'East Wing',
        hkStaff: 'Maria Santos', hkStatus: 'Ready / Inspected',
        housekeeper: 'Maria Santos - Team A',
        services: [], diningOrders: []
      },
      {
        number: '102', category: 'Standard', floor: '1', status: 'Checked In', rate: 4500,
        bedding: '1 Queen Bed', size: '28 m²', wing: 'East Wing',
        guest: 'Elena Rostova', reservationId: 'RES-102', phone: '+1 (555) 234-5678', email: 'elena.rostova@traveler.com',
        nationality: 'France / EU', idVerified: true, idDoc: 'Passport #FR-982341-P',
        vipTier: 'VIP Gold', corporateAccount: 'Global Media Network',
        checkIn: '15 Sep 2026', checkOut: '18 Sep 2026', currentNight: 3, totalNights: 4,
        adults: 2, children: 0, bookingChannel: 'Direct Web (VIP Corporate)',
        folioTotal: 13500, roomCharges: 13500, serviceCharges: 2450, taxTotal: 1595, totalBalance: 17545, paidAmount: 13500,
        keycard: 'RFID-102-A', tempSetting: '21.5°C (Eco)', dnd: false, doorLatched: true,
        lastCleaned: 'Yesterday 11:20 AM', housekeeper: 'Elena Gomez - Team Alpha', hkStatus: 'Clean', turnDownTime: '19:30',
        preferences: {
          pillow: 'Goose Down Soft Silk Casing',
          temp: '20.5°C',
          dietary: 'Nut Allergy (Severe), Gluten-Free',
          beverage: 'Sparkling San Pellegrino & Nespresso Intenso'
        },
        checkoutChecklist: {
          folioSettled: true,
          minibarAudited: true,
          keycardReturned: true,
          safeCleared: true,
          transportAssisted: true
        },
        services: [
          { id: 'srv-101', name: 'Extra Hypoallergenic Goose Down Pillows', department: 'Housekeeping', priority: 'VIP Urgent', price: 0, status: 'Completed', time: '09:30 AM' },
          { id: 'srv-102', name: 'Evening Turndown & Lavender Aromatherapy', department: 'Housekeeping', priority: 'Normal', price: 0, status: 'In Progress', time: '19:30 Scheduled' },
          { id: 'srv-103', name: 'Executive Mercedes Airport Transfer', department: 'Concierge', priority: 'High', price: 2500, status: 'Pending', time: 'Tomorrow 08:00 AM' }
        ],
        diningOrders: [
          { id: 'ORD-882', items: '2x Prime Wagyu Sliders, Truffle Parmesan Fries, San Pellegrino', total: 2450, status: 'Delivered & Billed', time: '13:15 PM' },
          { id: 'ORD-904', items: 'Executive Continental Breakfast Tray, 2x Double Espresso', total: 1800, status: 'Delivered & Billed', time: '08:45 AM' }
        ]
      },
      {
        number: '103', category: 'Standard', floor: '1', status: 'Available', rate: 4500,
        bedding: '2 Twin Beds', size: '30 m²', wing: 'East Wing',
        hkStaff: 'Fatima Zahra', hkStatus: 'Ready / Inspected',
        housekeeper: 'Fatima Zahra - Team B', services: [], diningOrders: []
      },
      {
        number: '104', category: 'Standard', floor: '1', status: 'Reserved', rate: 4500,
        bedding: '1 Queen Bed', size: '28 m²', wing: 'East Wing',
        guest: 'Marcus Vance', reservationId: 'RES-104', phone: '+44 20 7946 0192', email: 'm.vance@londoncorp.co.uk',
        checkIn: '17 Sep 2026', checkOut: '20 Sep 2026', currentNight: 1, totalNights: 3,
        eta: '14:30 Arriving', folioTotal: 13500, paidAmount: 0,
        housekeeper: 'Maria Santos - Team A', hkStatus: 'Ready / Inspected',
        services: [], diningOrders: []
      },
      {
        number: '105', category: 'Standard', floor: '1', status: 'Available', rate: 4500,
        bedding: '1 Queen Bed', size: '28 m²', wing: 'East Wing',
        hkStaff: 'Maria Santos', hkStatus: 'Ready / Inspected', services: [], diningOrders: []
      },
      {
        number: '106', category: 'Standard', floor: '1', status: 'Paid', rate: 4500,
        bedding: '1 Queen Bed', size: '28 m²', wing: 'East Wing',
        guest: 'David Sterling', reservationId: 'RES-106', phone: '+1 (555) 890-1234', email: 'd.sterling@vanguard.com',
        vipTier: 'VIP Platinum', checkIn: '17 Sep 2026', checkOut: '19 Sep 2026', currentNight: 1, totalNights: 2,
        folioTotal: 9000, paidAmount: 9000, badgeNote: 'Guaranteed VIP', services: [], diningOrders: []
      },
      {
        number: '107', category: 'Standard', floor: '1', status: 'Reserved', rate: 4500,
        bedding: '1 Queen Bed', size: '28 m²', wing: 'East Wing',
        guest: 'Clara Dubois', reservationId: 'RES-107', phone: '+33 6 12 34 56 78', email: 'c.dubois@paris-art.fr',
        checkIn: '18 Sep 2026', checkOut: '22 Sep 2026', eta: '16:00 Arriving', totalNights: 4, folioTotal: 18000, paidAmount: 4500,
        services: [], diningOrders: []
      },
      {
        number: '108', category: 'Standard', floor: '1', status: 'Available', rate: 4500,
        bedding: '2 Twin Beds', size: '30 m²', wing: 'East Wing',
        hkStaff: 'Fatima Zahra', hkStatus: 'Ready / Inspected', services: [], diningOrders: []
      },
      {
        number: '109', category: 'Standard', floor: '1', status: 'Checked In', rate: 4500,
        bedding: '1 Queen Bed', size: '28 m²', wing: 'East Wing',
        guest: 'Arthur Pendelton', reservationId: 'RES-109', phone: '+1 (555) 345-6789', email: 'a.pendelton@apex.com',
        vipTier: 'Standard', checkIn: '14 Sep 2026', checkOut: '19 Sep 2026', currentNight: 4, totalNights: 5,
        folioTotal: 22500, roomCharges: 22500, serviceCharges: 850, totalBalance: 23350, paidAmount: 22500, keycard: 'RFID-109-B',
        services: [{ id: 'srv-109', name: 'Late Departure Request (14:00)', department: 'Front Desk', priority: 'Normal', price: 0, status: 'In Progress', time: '10:00 AM' }],
        diningOrders: [{ id: 'ORD-771', items: 'Club Sandwich & Belgian Beer', total: 850, status: 'Delivered & Billed', time: 'Yesterday' }]
      },
      {
        number: '110', category: 'Standard', floor: '1', status: 'Available', rate: 4500,
        bedding: '1 Queen Bed', size: '28 m²', wing: 'East Wing',
        hkStaff: 'David Kim', hkStatus: 'Ready / Inspected', services: [], diningOrders: []
      },
      {
        number: '111', category: 'Standard', floor: '1', status: 'Paid', rate: 4500,
        bedding: '1 Queen Bed', size: '28 m²', wing: 'East Wing',
        guest: 'Beatrice Webb', reservationId: 'RES-111', phone: '+44 20 7946 0881', email: 'beatrice.webb@oxford.edu',
        vipTier: 'VIP Gold', checkIn: '17 Sep 2026', checkOut: '21 Sep 2026', currentNight: 1, totalNights: 4,
        folioTotal: 18000, paidAmount: 18000, badgeNote: 'Pre-Settled', services: [], diningOrders: []
      },
      {
        number: '112', category: 'Standard', floor: '1', status: 'Available', rate: 4500,
        bedding: '2 Twin Beds', size: '30 m²', wing: 'East Wing',
        hkStaff: 'David Kim', hkStatus: 'Ready / Inspected', services: [], diningOrders: []
      },

      // ── Floor 2: Executive (201 - 212) ──
      { number: '201', category: 'Executive', floor: '2', status: 'Available', rate: 7500, bedding: '1 King Bed', size: '42 m²', wing: 'West Wing', hkStatus: 'Ready / Inspected', services: [], diningOrders: [] },
      {
        number: '202', category: 'Executive', floor: '2', status: 'Reserved', rate: 7500, bedding: '1 King Bed', size: '42 m²', wing: 'West Wing',
        guest: 'Julian Croft', reservationId: 'RES-202', phone: '+1 (555) 678-9012', email: 'j.croft@croft-holdings.com',
        checkIn: '17 Sep 2026', checkOut: '22 Sep 2026', eta: '15:00 Arriving', totalNights: 5, folioTotal: 37500, paidAmount: 0, services: [], diningOrders: []
      },
      {
        number: '203', category: 'Executive', floor: '2', status: 'Paid', rate: 7500, bedding: '1 King Bed', size: '42 m²', wing: 'West Wing',
        guest: 'Sophia Laurent', reservationId: 'RES-203', phone: '+33 6 98 76 54 32', email: 'sophia.laurent@luxury.fr',
        vipTier: 'VIP Platinum', checkIn: '17 Sep 2026', checkOut: '20 Sep 2026', totalNights: 3, folioTotal: 22500, paidAmount: 22500, badgeNote: 'Guaranteed', services: [], diningOrders: []
      },
      { number: '204', category: 'Executive', floor: '2', status: 'Available', rate: 7500, bedding: '1 King Bed', size: '42 m²', wing: 'West Wing', hkStatus: 'Ready / Inspected', services: [], diningOrders: [] },
      {
        number: '205', category: 'Executive', floor: '2', status: 'Reserved', rate: 7500, bedding: '1 King Bed', size: '42 m²', wing: 'West Wing',
        guest: 'Robert Lang', reservationId: 'RES-205', phone: '+1 (555) 789-0123', email: 'robert.lang@techcorp.io',
        checkIn: '18 Sep 2026', checkOut: '23 Sep 2026', eta: '17:30 Arriving', totalNights: 5, folioTotal: 37500, paidAmount: 7500, services: [], diningOrders: []
      },
      { number: '206', category: 'Executive', floor: '2', status: 'Available', rate: 7500, bedding: '2 Queen Beds', size: '45 m²', wing: 'West Wing', hkStatus: 'Ready / Inspected', services: [], diningOrders: [] },
      {
        number: '207', category: 'Executive', floor: '2', status: 'Checked In', rate: 7500, bedding: '1 King Bed', size: '42 m²', wing: 'West Wing',
        guest: 'Anna Becker', reservationId: 'RES-207', phone: '+49 30 1234567', email: 'a.becker@berlin-design.de',
        vipTier: 'VIP Gold', checkIn: '16 Sep 2026', checkOut: '19 Sep 2026', currentNight: 2, totalNights: 3,
        folioTotal: 22500, roomCharges: 22500, serviceCharges: 1100, totalBalance: 23600, paidAmount: 22500, keycard: 'RFID-207-A',
        services: [{ id: 'srv-207', name: 'Spa Session (Swedish Massage 60m)', department: 'Spa & Wellness', priority: 'High', price: 3500, status: 'Pending', time: '17:00 PM' }],
        diningOrders: [{ id: 'ORD-912', items: 'Wood-Fired Margherita Pizza, Sparkling Water', total: 1100, status: 'Delivered & Billed', time: '14:00 PM' }]
      },
      { number: '208', category: 'Executive', floor: '2', status: 'Available', rate: 7500, bedding: '1 King Bed', size: '42 m²', wing: 'West Wing', hkStatus: 'Ready / Inspected', services: [], diningOrders: [] },
      {
        number: '209', category: 'Executive', floor: '2', status: 'Checked In', rate: 7500, bedding: '1 King Bed', size: '42 m²', wing: 'West Wing',
        guest: 'Charles Montgomery', reservationId: 'RES-209', phone: '+1 (555) 456-7890', email: 'c.montgomery@equity.com',
        vipTier: 'VIP Platinum', checkIn: '15 Sep 2026', checkOut: '20 Sep 2026', currentNight: 3, totalNights: 5,
        folioTotal: 37500, roomCharges: 37500, serviceCharges: 4200, totalBalance: 41700, paidAmount: 37500, keycard: 'RFID-209-A',
        services: [{ id: 'srv-209', name: 'Executive Meeting Room Booking (Boardroom B)', department: 'Front Desk', priority: 'High', price: 5000, status: 'Completed', time: 'Yesterday' }],
        diningOrders: [{ id: 'ORD-899', items: '2x Grilled Atlantic Salmon, Champagne Bottle', total: 4200, status: 'Delivered & Billed', time: 'Yesterday 20:30' }]
      },
      { number: '210', category: 'Executive', floor: '2', status: 'Available', rate: 7500, bedding: '2 Queen Beds', size: '45 m²', wing: 'West Wing', hkStatus: 'Ready / Inspected', services: [], diningOrders: [] },
      {
        number: '211', category: 'Executive', floor: '2', status: 'Checked Out', rate: 7500, bedding: '1 King Bed', size: '42 m²', wing: 'West Wing',
        housekeepingStatus: 'Vacant Dirty (Housekeeping turnover dispatched)', lastOccupant: 'Maximilian Sterling', depTime: '11:15 Departed',
        services: [], diningOrders: []
      },
      { number: '212', category: 'Executive', floor: '2', status: 'Available', rate: 7500, bedding: '1 King Bed', size: '42 m²', wing: 'West Wing', hkStatus: 'Ready / Inspected', services: [], diningOrders: [] },

      // ── Floor 3: Suite (301 - 312) ──
      { number: '301', category: 'Suite', floor: '3', status: 'Available', rate: 12000, bedding: 'Master Suite + Living Area', size: '65 m²', wing: 'Executive Tower', hkStatus: 'Ready / Inspected', services: [], diningOrders: [] },
      {
        number: '302', category: 'Suite', floor: '3', status: 'Reserved', rate: 12000, bedding: 'Master Suite + Living Area', size: '65 m²', wing: 'Executive Tower',
        guest: 'Diana Prince', reservationId: 'RES-302', phone: '+1 (555) 567-8901', email: 'diana.prince@themyscira.org',
        checkIn: '17 Sep 2026', checkOut: '21 Sep 2026', eta: '15:30 Arriving', totalNights: 4, folioTotal: 48000, paidAmount: 12000, services: [], diningOrders: []
      },
      {
        number: '303', category: 'Suite', floor: '3', status: 'Checked In', rate: 12000, bedding: 'Master Suite + Balcony', size: '70 m²', wing: 'Executive Tower',
        guest: 'Edward Norton', reservationId: 'RES-303', phone: '+1 (555) 678-1234', email: 'edward.norton@hollywood.com',
        vipTier: 'VIP Platinum', checkIn: '14 Sep 2026', checkOut: '19 Sep 2026', currentNight: 4, totalNights: 5,
        folioTotal: 60000, roomCharges: 60000, serviceCharges: 5400, totalBalance: 65400, paidAmount: 60000, keycard: 'RFID-303-VIP',
        services: [{ id: 'srv-303', name: 'VIP Organic Fruit & Champagne Basket', department: 'Room Service', priority: 'VIP Urgent', price: 0, status: 'Completed', time: '11:00 AM' }],
        diningOrders: [{ id: 'ORD-930', items: 'Caviar Service, Beluga & Blinis, Champagne', total: 5400, status: 'Delivered & Billed', time: 'Yesterday' }]
      },
      { number: '304', category: 'Suite', floor: '3', status: 'Available', rate: 12000, bedding: 'Master Suite + Living Area', size: '65 m²', wing: 'Executive Tower', hkStatus: 'Ready / Inspected', services: [], diningOrders: [] },
      {
        number: '305', category: 'Suite', floor: '3', status: 'Checked In', rate: 12000, bedding: 'Master Suite + Jacuzzi', size: '72 m²', wing: 'Executive Tower',
        guest: 'Fiona Gallagher', reservationId: 'RES-305', phone: '+1 (555) 789-2345', email: 'fiona.g@gallagher.com',
        checkIn: '16 Sep 2026', checkOut: '21 Sep 2026', currentNight: 2, totalNights: 5,
        folioTotal: 60000, roomCharges: 60000, serviceCharges: 1850, totalBalance: 61850, paidAmount: 60000, keycard: 'RFID-305-A',
        services: [], diningOrders: []
      },
      {
        number: '306', category: 'Suite', floor: '3', status: 'Checked Out', rate: 12000, bedding: 'Master Suite + Living Area', size: '65 m²', wing: 'Executive Tower',
        housekeepingStatus: 'Vacant Dirty (Rush Turnover)', lastOccupant: 'Baroness Von Meyer', depTime: '10:45 Departed', services: [], diningOrders: []
      },
      { number: '307', category: 'Suite', floor: '3', status: 'Available', rate: 12000, bedding: 'Master Suite + Living Area', size: '65 m²', wing: 'Executive Tower', hkStatus: 'Ready / Inspected', services: [], diningOrders: [] },
      {
        number: '308', category: 'Suite', floor: '3', status: 'Checked In', rate: 12000, bedding: 'Master Suite + Panoramic View', size: '75 m²', wing: 'Executive Tower',
        guest: 'George Harrison', reservationId: 'RES-308', phone: '+44 20 7946 0992', email: 'george.harrison@applecorps.uk',
        vipTier: 'Royal Diamond', checkIn: '15 Sep 2026', checkOut: '20 Sep 2026', currentNight: 3, totalNights: 5,
        folioTotal: 60000, roomCharges: 60000, serviceCharges: 7500, totalBalance: 67500, paidAmount: 60000, keycard: 'RFID-308-VIP',
        services: [{ id: 'srv-308', name: 'Steinway Grand Piano Tuning in Suite', department: 'Concierge', priority: 'VIP Urgent', price: 0, status: 'Completed', time: '10:15 AM' }],
        diningOrders: [{ id: 'ORD-945', items: 'Château Margaux 2015, Artisanal Cheese Board', total: 7500, status: 'Delivered & Billed', time: 'Yesterday' }]
      },
      { number: '309', category: 'Suite', floor: '3', status: 'Available', rate: 12000, bedding: 'Master Suite + Living Area', size: '65 m²', wing: 'Executive Tower', hkStatus: 'Ready / Inspected', services: [], diningOrders: [] },
      {
        number: '310', category: 'Suite', floor: '3', status: 'Reserved', rate: 12000, bedding: 'Master Suite + Living Area', size: '65 m²', wing: 'Executive Tower',
        guest: 'Helena Bonham', reservationId: 'RES-310', phone: '+44 20 7946 0773', email: 'helena.b@cinema.co.uk',
        checkIn: '18 Sep 2026', checkOut: '22 Sep 2026', eta: '18:00 Arriving', totalNights: 4, folioTotal: 48000, paidAmount: 24000, services: [], diningOrders: []
      },
      {
        number: '311', category: 'Suite', floor: '3', status: 'Paid', rate: 12000, bedding: 'Master Suite + Living Area', size: '65 m²', wing: 'Executive Tower',
        guest: 'Ian Malcolm', reservationId: 'RES-311', phone: '+1 (555) 890-3456', email: 'ian.malcolm@jurassic.edu',
        vipTier: 'VIP Gold', checkIn: '17 Sep 2026', checkOut: '20 Sep 2026', totalNights: 3, folioTotal: 36000, paidAmount: 36000, badgeNote: 'Guaranteed', services: [], diningOrders: []
      },
      {
        number: '312', category: 'Suite', floor: '3', status: 'Damaged', rate: 12000, bedding: 'Master Suite', size: '65 m²', wing: 'Executive Tower',
        damageReason: 'AC Coolant Pipe Leak & Carpet Moisture Remediation', workOrder: '#WO-1038',
        reportedBy: 'Housekeeping Supervisor', etaRepair: '18 Sep 2026 14:00', services: [], diningOrders: []
      },

      // ── Floor 4: Deluxe (401 - 406) ──
      { number: '401', category: 'Deluxe', floor: '4', status: 'Available', rate: 9500, bedding: '1 King Bed + Ocean View', size: '52 m²', wing: 'Seaside Wing', hkStatus: 'Ready / Inspected', services: [], diningOrders: [] },
      {
        number: '402', category: 'Deluxe', floor: '4', status: 'Checked In', rate: 9500, bedding: '1 King Bed + Ocean View', size: '52 m²', wing: 'Seaside Wing',
        guest: 'Sarah Mitchell', reservationId: 'RES-402', phone: '+1 (555) 382-9901', email: 'sarah.m@vanguard.com',
        vipTier: 'VIP Platinum', checkIn: '12 Sep 2026', checkOut: '15 Sep 2026', currentNight: 3, totalNights: 3,
        folioTotal: 28500, paidAmount: 28500, keycard: 'RFID-402-A', services: [], diningOrders: []
      },
      { number: '403', category: 'Deluxe', floor: '4', status: 'Available', rate: 9500, bedding: '1 King Bed + Ocean View', size: '52 m²', wing: 'Seaside Wing', hkStatus: 'Ready / Inspected', services: [], diningOrders: [] },
      {
        number: '404', category: 'Deluxe', floor: '4', status: 'Reserved', rate: 9500, bedding: '1 King Bed + Ocean View', size: '52 m²', wing: 'Seaside Wing',
        guest: 'Clara Dupont', reservationId: 'RES-404', phone: '+33 6 45 67 89 01', email: 'c.dupont@artisan.fr',
        checkIn: '17 Sep 2026', checkOut: '21 Sep 2026', eta: '16:45 Arriving', totalNights: 4, folioTotal: 38000, paidAmount: 9500, services: [], diningOrders: []
      },
      {
        number: '405', category: 'Deluxe', floor: '4', status: 'Paid', rate: 9500, bedding: '1 King Bed + Ocean View', size: '52 m²', wing: 'Seaside Wing',
        guest: 'Dr. Aris Thorne', reservationId: 'RES-405', phone: '+41 22 767 1111', email: 'thorne@cern.ch',
        vipTier: 'VIP Platinum', checkIn: '17 Sep 2026', checkOut: '22 Sep 2026', totalNights: 5, folioTotal: 47500, paidAmount: 47500, badgeNote: 'Guaranteed', services: [], diningOrders: []
      },
      { number: '406', category: 'Deluxe', floor: '4', status: 'Available', rate: 9500, bedding: '1 King Bed + Ocean View', size: '52 m²', wing: 'Seaside Wing', hkStatus: 'Ready / Inspected', services: [], diningOrders: [] },

      // ── Floor 5: Penthouse (501 - 504) ──
      {
        number: '501', category: 'Penthouse', floor: '5', status: 'Checked In', rate: 25000, bedding: 'Presidential Royal Penthouse', size: '180 m²', wing: 'Sky Level',
        guest: 'H.R.H. Sheikh Al-Sabah', reservationId: 'RES-501', phone: '+965 2200 4400', email: 'royal.office@alsabah.kw',
        vipTier: 'Royal Diamond', checkIn: '10 Sep 2026', checkOut: '24 Sep 2026', currentNight: 8, totalNights: 14,
        folioTotal: 350000, paidAmount: 350000, keycard: 'RFID-501-VIP-GOLD', services: [], diningOrders: []
      },
      {
        number: '502', category: 'Penthouse', floor: '5', status: 'Reserved', rate: 25000, bedding: 'Presidential Royal Penthouse', size: '180 m²', wing: 'Sky Level',
        guest: 'Sir William Sterling', reservationId: 'RES-502', phone: '+44 20 7946 0001', email: 'sterling@knight.co.uk',
        vipTier: 'VIP Platinum', checkIn: '18 Sep 2026', checkOut: '25 Sep 2026', eta: '14:00 Arriving', totalNights: 7, folioTotal: 175000, paidAmount: 50000, services: [], diningOrders: []
      },
      { number: '503', category: 'Penthouse', floor: '5', status: 'Available', rate: 25000, bedding: 'Presidential Royal Penthouse', size: '180 m²', wing: 'Sky Level', services: [], diningOrders: [] },
      { number: '504', category: 'Penthouse', floor: '5', status: 'Available', rate: 25000, bedding: 'Presidential Royal Penthouse', size: '180 m²', wing: 'Sky Level', services: [], diningOrders: [] }
    ];

    store.state.houseStatusRooms = this.rooms;
    this.selectedRoom = this.rooms.find(r => r.number === '102') || this.rooms[0];
  }

  saveRooms() {
    store.state.houseStatusRooms = this.rooms;
    try {
      localStorage.setItem('volvitech_house_status_rooms', JSON.stringify(this.rooms));
    } catch (_) {}
  }

  async loadData() {
    this.initRooms();
  }

  render() {
    const root = document.createElement('div');
    root.className = 'w-full pb-16 space-y-5 animate-fadeIn select-none';
    this.container = root;

    this.renderContent();
    return root;
  }

  renderContent() {
    if (!this.container) return;

    // Filter computation
    let filteredRooms = [...this.rooms];

    if (this.selectedFloor !== 'ALL') {
      filteredRooms = filteredRooms.filter(r => String(r.floor) === String(this.selectedFloor));
    }

    if (this.selectedCategory !== 'ALL') {
      filteredRooms = filteredRooms.filter(r => r.category.toLowerCase() === this.selectedCategory.toLowerCase());
    }

    if (this.selectedStatus !== 'ALL') {
      filteredRooms = filteredRooms.filter(r => r.status.toLowerCase() === this.selectedStatus.toLowerCase());
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      filteredRooms = filteredRooms.filter(r =>
        r.number.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        (r.guest && r.guest.toLowerCase().includes(q)) ||
        (r.reservationId && r.reservationId.toLowerCase().includes(q)) ||
        (r.workOrder && r.workOrder.toLowerCase().includes(q))
      );
    }

    // Dynamic metrics
    const totalCount = this.rooms.length;
    const availableCount = this.rooms.filter(r => r.status === 'Available').length;
    const checkedInCount = this.rooms.filter(r => r.status === 'Checked In').length;
    const reservedCount = this.rooms.filter(r => r.status === 'Reserved').length;
    const paidCount = this.rooms.filter(r => r.status === 'Paid').length;
    const checkedOutCount = this.rooms.filter(r => r.status === 'Checked Out').length;
    const damagedCount = this.rooms.filter(r => r.status === 'Damaged').length;
    const inUseCount = checkedInCount + paidCount;
    const occupancyRate = Math.round(((inUseCount + reservedCount) / totalCount) * 100);



    this.container.innerHTML = `
      <!-- ================================================================= -->
      <!-- TOP SCREEN HEADER — HOUSE STATUS (DUAL-TAB: MATRIX + OPERATIONS) -->
      <!-- ================================================================= -->
      <header class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest border border-outline-variant/80 rounded-2xl p-4.5 shadow-xs">

        <!-- Left: Title + Active Tab Label -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm">
            <span class="material-symbols-outlined text-[22px]">${this.activePageTab === 'matrix' ? 'grid_view' : 'meeting_room'}</span>
          </div>
          <div>
            <div class="flex items-center gap-2.5">
              <h1 class="font-headline-lg text-xl sm:text-2xl font-bold text-primary tracking-tight">House Status</h1>
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                ${this.activePageTab === 'matrix' ? 'House Matrix' : 'Room Operations'}
              </span>
            </div>
            <p class="text-xs text-on-surface-variant font-medium mt-0.5">
              ${this.activePageTab === 'matrix'
                ? 'Guest occupancy matrix, reservation status &amp; in-drawer operational workflows'
                : 'Physical room states — cleanliness, housekeeping turnover &amp; maintenance status'}
            </p>
          </div>
        </div>

        <!-- Center: Tab Switcher -->
        <div class="flex items-center gap-1 p-1 bg-surface-container rounded-xl border border-outline-variant/60 shadow-2xs self-start lg:self-center">
          <button id="btn-tab-matrix" class="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            this.activePageTab === 'matrix' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-primary'
          }">
            <span class="material-symbols-outlined text-[16px]">grid_view</span>
            House Matrix
          </button>
          <button id="btn-tab-operations" class="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            this.activePageTab === 'operations' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-primary'
          }">
            <span class="material-symbols-outlined text-[16px]">meeting_room</span>
            Room Operations
          </button>
        </div>

        <!-- Right: context-aware stats + actions -->
        ${
          this.activePageTab === 'matrix'
            ? `<div class="flex flex-wrap items-center gap-3">
                <div class="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-primary text-on-primary shadow-xs border border-primary-container">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <div class="text-left">
                    <div class="text-xs font-bold leading-none tracking-tight">${occupancyRate}% Occupancy</div>
                    <div class="text-[10px] text-primary-fixed-dim leading-none mt-1 font-data-mono">${inUseCount + reservedCount}/${totalCount} Units</div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button id="btn-jump-room-master" class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant text-xs font-semibold text-on-surface hover:bg-surface-container hover:text-primary transition-all cursor-pointer shadow-2xs" title="Manage physical rooms and room types in Room Master">
                    <span class="material-symbols-outlined text-[16px] text-primary">meeting_room</span>
                    <span class="hidden sm:inline">Room Master</span>
                  </button>
                  <button id="btn-print-roster" class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant text-xs font-semibold text-on-surface hover:bg-surface-container hover:text-primary transition-all cursor-pointer shadow-2xs">
                    <span class="material-symbols-outlined text-[16px]">print</span>
                    <span class="hidden sm:inline">Print Roster</span>
                  </button>
                  <button id="btn-export-audit" class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-primary/90 transition-all cursor-pointer shadow-xs">
                    <span class="material-symbols-outlined text-[16px]">file_download</span>
                    <span>Export Audit</span>
                  </button>
                </div>
              </div>`
            : `<div class="flex items-center gap-2.5">
                <button id="btn-jump-room-master-ops" class="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant text-xs font-semibold text-on-surface hover:bg-surface-container hover:text-primary transition-all cursor-pointer shadow-2xs" title="Manage physical rooms and room types in Room Master">
                  <span class="material-symbols-outlined text-[16px] text-primary">meeting_room</span>
                  <span class="hidden sm:inline">Room Master</span>
                </button>
                <div class="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface-container border border-outline-variant shadow-2xs">
                  <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                  <div class="text-left">
                    <div class="text-xs font-bold text-on-surface leading-none">Live Operations Feed</div>
                    <div class="text-[10px] text-on-surface-variant leading-none mt-1 font-data-mono">HK Turnover &amp; Maintenance</div>
                  </div>
                </div>
              </div>`
        }
      </header>

      ${this.activePageTab === 'operations' ? `
        <!-- Room Operations Board (mounted from RoomStatusView) -->
        <div id="room-ops-mount" class="w-full"></div>
      ` : `

      <!-- ================================================================= -->
      <!-- KPI TELEMETRY RIBBON (7-CARD HIGH-VISIBILITY STRIP) -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-2.5 sm:gap-3">
        
        <!-- 1. Total Inventory -->
        <div class="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant/80 flex flex-col justify-between shadow-xs">
          <div class="flex items-center justify-between">
            <span class="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase font-data-mono">Total Units</span>
            <span class="material-symbols-outlined text-on-surface-variant text-[17px]">meeting_room</span>
          </div>
          <div class="mt-2 flex items-baseline justify-between">
            <span class="text-2xl font-black text-primary font-display-kpi leading-none">${totalCount}</span>
            <span class="text-[11px] font-semibold text-on-surface-variant">100% Cap</span>
          </div>
          <div class="mt-2.5 w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
            <div class="bg-primary h-1.5 rounded-full" style="width: 100%"></div>
          </div>
        </div>

        <!-- 2. Available / Ready -->
        <div class="btn-quick-filter-metric bg-surface-container-lowest p-3.5 rounded-xl border border-emerald-300 flex flex-col justify-between shadow-xs hover:border-emerald-500 cursor-pointer transition-colors" data-filter-status="Available">
          <div class="flex items-center justify-between">
            <span class="font-label-caps text-[10px] font-bold text-emerald-800 uppercase font-data-mono">Available</span>
            <span class="material-symbols-outlined text-emerald-600 text-[17px]">check_circle</span>
          </div>
          <div class="mt-2 flex items-baseline justify-between">
            <span class="text-2xl font-black text-emerald-700 font-display-kpi leading-none">${availableCount}</span>
            <span class="text-[11px] font-semibold text-emerald-600 font-data-mono">${Math.round((availableCount/totalCount)*100)}%</span>
          </div>
          <div class="mt-2.5 w-full bg-emerald-100 rounded-full h-1.5 overflow-hidden">
            <div class="bg-emerald-500 h-1.5 rounded-full" style="width: ${(availableCount/totalCount)*100}%"></div>
          </div>
        </div>

        <!-- 3. Checked In (In-House) -->
        <div class="btn-quick-filter-metric bg-rose-50/70 p-3.5 rounded-xl border border-rose-300 flex flex-col justify-between shadow-xs hover:border-rose-500 cursor-pointer transition-colors" data-filter-status="Checked In">
          <div class="flex items-center justify-between">
            <span class="font-label-caps text-[10px] font-bold text-rose-800 uppercase font-data-mono">Checked In</span>
            <span class="material-symbols-outlined text-rose-500 text-[17px]">key</span>
          </div>
          <div class="mt-2 flex items-baseline justify-between">
            <span class="text-2xl font-black text-rose-600 font-display-kpi leading-none">${checkedInCount}</span>
            <span class="text-[11px] font-semibold text-rose-500 font-data-mono">${Math.round((checkedInCount/totalCount)*100)}%</span>
          </div>
          <div class="mt-2.5 w-full bg-rose-200 rounded-full h-1.5 overflow-hidden">
            <div class="bg-rose-500 h-1.5 rounded-full" style="width: ${(checkedInCount/totalCount)*100}%"></div>
          </div>
        </div>

        <!-- 4. Reserved -->
        <div class="btn-quick-filter-metric bg-amber-50/70 p-3.5 rounded-xl border border-amber-300 flex flex-col justify-between shadow-xs hover:border-amber-500 cursor-pointer transition-colors" data-filter-status="Reserved">
          <div class="flex items-center justify-between">
            <span class="font-label-caps text-[10px] font-bold text-amber-800 uppercase font-data-mono">Reserved</span>
            <span class="material-symbols-outlined text-amber-500 text-[17px]">pending_actions</span>
          </div>
          <div class="mt-2 flex items-baseline justify-between">
            <span class="text-2xl font-black text-amber-600 font-display-kpi leading-none">${reservedCount}</span>
            <span class="text-[11px] font-semibold text-amber-600 font-data-mono">${Math.round((reservedCount/totalCount)*100)}%</span>
          </div>
          <div class="mt-2.5 w-full bg-amber-200 rounded-full h-1.5 overflow-hidden">
            <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${(reservedCount/totalCount)*100}%"></div>
          </div>
        </div>

        <!-- 5. Paid / VIP -->
        <div class="btn-quick-filter-metric bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-400 flex flex-col justify-between shadow-xs hover:border-emerald-600 cursor-pointer transition-colors" data-filter-status="Paid">
          <div class="flex items-center justify-between">
            <span class="font-label-caps text-[10px] font-bold text-emerald-900 uppercase font-data-mono">Paid / VIP</span>
            <span class="material-symbols-outlined text-emerald-600 text-[17px]">verified</span>
          </div>
          <div class="mt-2 flex items-baseline justify-between">
            <span class="text-2xl font-black text-emerald-700 font-display-kpi leading-none">${paidCount}</span>
            <span class="text-[11px] font-semibold text-emerald-600 font-data-mono">${Math.round((paidCount/totalCount)*100)}%</span>
          </div>
          <div class="mt-2.5 w-full bg-emerald-200 rounded-full h-1.5 overflow-hidden">
            <div class="bg-emerald-600 h-1.5 rounded-full" style="width: ${(paidCount/totalCount)*100}%"></div>
          </div>
        </div>

        <!-- 6. Checked Out / Turnover -->
        <div class="btn-quick-filter-metric bg-purple-50/70 p-3.5 rounded-xl border border-purple-300 flex flex-col justify-between shadow-xs hover:border-purple-500 cursor-pointer transition-colors" data-filter-status="Checked Out">
          <div class="flex items-center justify-between">
            <span class="font-label-caps text-[10px] font-bold text-purple-900 uppercase font-data-mono">Turnover</span>
            <span class="material-symbols-outlined text-purple-600 text-[17px]">cleaning_services</span>
          </div>
          <div class="mt-2 flex items-baseline justify-between">
            <span class="text-2xl font-black text-purple-700 font-display-kpi leading-none">${checkedOutCount}</span>
            <span class="text-[11px] font-semibold text-purple-600 font-data-mono">${Math.round((checkedOutCount/totalCount)*100)}%</span>
          </div>
          <div class="mt-2.5 w-full bg-purple-200 rounded-full h-1.5 overflow-hidden">
            <div class="bg-purple-600 h-1.5 rounded-full" style="width: ${(checkedOutCount/totalCount)*100}%"></div>
          </div>
        </div>

        <!-- 7. Damaged / OOO -->
        <div class="btn-quick-filter-metric bg-slate-100 p-3.5 rounded-xl border border-slate-300 flex flex-col justify-between shadow-xs hover:border-slate-500 cursor-pointer transition-colors col-span-2 md:col-span-2 xl:col-span-1" data-filter-status="Damaged">
          <div class="flex items-center justify-between">
            <span class="font-label-caps text-[10px] font-bold text-slate-800 uppercase font-data-mono">Damaged / OOO</span>
            <span class="material-symbols-outlined text-slate-700 text-[17px]">construction</span>
          </div>
          <div class="mt-2 flex items-baseline justify-between">
            <span class="text-2xl font-black text-slate-900 font-display-kpi leading-none">${damagedCount}</span>
            <span class="text-[11px] font-semibold text-slate-600 font-data-mono">${Math.round((damagedCount/totalCount)*100)}%</span>
          </div>
          <div class="mt-2.5 w-full bg-slate-300 rounded-full h-1.5 overflow-hidden">
            <div class="bg-slate-700 h-1.5 rounded-full" style="width: ${(damagedCount/totalCount)*100}%"></div>
          </div>
        </div>

      </section>

      <!-- ================================================================= -->
      <!-- FILTER TOOLBAR & LIVE STATUS LEGEND (STITCH TOOLBAR SYSTEM) -->
      <!-- ================================================================= -->
      <section class="bg-surface-container-lowest p-3.5 rounded-2xl border border-outline-variant/80 space-y-3 shadow-xs">
        
        <!-- Row 1: Floor Tabs, Category Selector, Live Search & Density -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          
          <!-- Floor Selector Tabs -->
          <div class="flex items-center gap-1 bg-surface-container p-1 rounded-xl overflow-x-auto custom-scrollbar">
            ${[
              { id: 'ALL', label: `All Floors (${totalCount})` },
              { id: '1', label: 'Floor 1 (Ground)' },
              { id: '2', label: 'Floor 2' },
              { id: '3', label: 'Floor 3 (Executive)' },
              { id: '4', label: 'Floor 4 (Suites)' },
              { id: '5', label: 'Floor 5 (Penthouse)' }
            ].map(fl => `
              <button class="btn-floor-tab px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                this.selectedFloor === fl.id
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-lowest'
              }" data-floor="${fl.id}">
                ${fl.label}
              </button>
            `).join('')}
          </div>

          <!-- Controls: Category Dropdown & Search -->
          <div class="flex flex-wrap items-center gap-2.5">
            
            <!-- Category Dropdown -->
            <div class="relative">
              <select id="house-filter-category" class="appearance-none pl-3 pr-8 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-xs text-primary font-semibold hover:border-primary/50 cursor-pointer shadow-2xs focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="ALL" ${this.selectedCategory === 'ALL' ? 'selected' : ''}>All Room Categories</option>
                <option value="Standard" ${this.selectedCategory === 'Standard' ? 'selected' : ''}>Standard</option>
                <option value="Executive" ${this.selectedCategory === 'Executive' ? 'selected' : ''}>Executive</option>
                <option value="Suite" ${this.selectedCategory === 'Suite' ? 'selected' : ''}>Suite</option>
                <option value="Deluxe" ${this.selectedCategory === 'Deluxe' ? 'selected' : ''}>Deluxe</option>
                <option value="Penthouse" ${this.selectedCategory === 'Penthouse' ? 'selected' : ''}>Penthouse</option>
              </select>
              <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-[16px]">expand_more</span>
            </div>

            <!-- Instant Search Input -->
            <div class="relative w-48 sm:w-60">
              <span class="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">search</span>
              <input 
                type="text" 
                id="house-search-input" 
                value="${this.searchQuery}"
                placeholder="Search room, guest, RES..." 
                class="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface placeholder:text-on-surface-variant/70 shadow-2xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>

            ${
              this.selectedFloor !== 'ALL' || this.selectedCategory !== 'ALL' || this.selectedStatus !== 'ALL' || this.searchQuery
                ? `<button id="btn-house-reset-filters" class="px-2.5 py-1.5 rounded-xl text-xs font-bold text-primary hover:bg-surface-container transition-colors flex items-center gap-1 cursor-pointer">
                    <span class="material-symbols-outlined text-[15px]">restart_alt</span>
                    <span>Reset</span>
                   </button>`
                : ''
            }
          </div>

        </div>

        <!-- Row 2: Status Indicator Legend with Interactive Counts -->
        <div class="flex flex-wrap items-center gap-2 pt-2.5 border-t border-outline-variant/40">
          <span class="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider font-data-mono mr-1">STATUS LEGEND:</span>
          
          <!-- ALL PILL -->
          <button class="btn-house-legend-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            this.selectedStatus === 'ALL'
              ? 'bg-primary text-on-primary font-bold shadow-xs'
              : 'bg-surface-container-lowest border border-outline-variant text-on-surface hover:border-primary/50'
          }" data-status="ALL">
            <span class="w-2 h-2 rounded-full ${this.selectedStatus === 'ALL' ? 'bg-white' : 'bg-slate-400'}"></span>
            <span>All Units</span>
            <span class="font-data-mono font-bold text-[11px]">(${totalCount})</span>
          </button>

          <!-- AVAILABLE -->
          <button class="btn-house-legend-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            this.selectedStatus === 'Available'
              ? 'bg-white text-slate-900 border-2 border-slate-500 font-bold shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400 shadow-2xs'
          }" data-status="Available">
            <span class="w-2.5 h-2.5 rounded-full border border-slate-300 bg-white"></span>
            <span>Available</span>
            <span class="font-data-mono font-bold text-[11px] text-slate-500">(${availableCount})</span>
          </button>

          <!-- CHECKED IN -->
          <button class="btn-house-legend-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            this.selectedStatus === 'Checked In'
              ? 'bg-[#f87171] text-white border-2 border-red-600 font-bold shadow-xs'
              : 'bg-[#f87171] text-white hover:brightness-105 shadow-2xs'
          }" data-status="Checked In">
            <span class="w-2 h-2 rounded-full bg-white"></span>
            <span>Checked In</span>
            <span class="font-data-mono font-bold text-[11px] text-white/90">(${checkedInCount})</span>
          </button>

          <!-- RESERVED -->
          <button class="btn-house-legend-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            this.selectedStatus === 'Reserved'
              ? 'bg-[#f59e0b] text-white border-2 border-amber-600 font-bold shadow-xs'
              : 'bg-[#f59e0b] text-white hover:brightness-105 shadow-2xs'
          }" data-status="Reserved">
            <span class="w-2 h-2 rounded-full bg-white"></span>
            <span>Reserved</span>
            <span class="font-data-mono font-bold text-[11px] text-white/90">(${reservedCount})</span>
          </button>

          <!-- PAID -->
          <button class="btn-house-legend-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            this.selectedStatus === 'Paid'
              ? 'bg-[#10b981] text-white border-2 border-emerald-600 font-bold shadow-xs'
              : 'bg-[#10b981] text-white hover:brightness-105 shadow-2xs'
          }" data-status="Paid">
            <span class="w-2 h-2 rounded-full bg-white"></span>
            <span>Paid / VIP</span>
            <span class="font-data-mono font-bold text-[11px] text-white/90">(${paidCount})</span>
          </button>

          <!-- CHECKED OUT -->
          <button class="btn-house-legend-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            this.selectedStatus === 'Checked Out'
              ? 'bg-[#8b5cf6] text-white border-2 border-purple-600 font-bold shadow-xs'
              : 'bg-[#8b5cf6] text-white hover:brightness-105 shadow-2xs'
          }" data-status="Checked Out">
            <span class="w-2 h-2 rounded-full bg-white"></span>
            <span>Turnover</span>
            <span class="font-data-mono font-bold text-[11px] text-white/90">(${checkedOutCount})</span>
          </button>

          <!-- DAMAGED -->
          <button class="btn-house-legend-pill inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            this.selectedStatus === 'Damaged'
              ? 'bg-[#1e293b] text-white border-2 border-slate-900 font-bold shadow-xs'
              : 'bg-[#1e293b] text-white hover:brightness-105 shadow-2xs'
          }" data-status="Damaged">
            <span class="w-2 h-2 rounded-full bg-white"></span>
            <span>Damaged / OOO</span>
            <span class="font-data-mono font-bold text-[11px] text-white/90">(${damagedCount})</span>
          </button>
        </div>

      </section>

      <!-- ================================================================= -->
      <!-- 6-COLUMN HOUSE STATUS ROOM MATRIX -->
      <!-- ================================================================= -->
      <main class="w-full space-y-3">
        
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-primary uppercase tracking-wider bg-surface-container-high px-2.5 py-0.5 rounded-lg font-data-mono">
              ${this.selectedFloor === 'ALL' ? 'Entire Property Matrix' : `Floor ${this.selectedFloor} Units`}
            </span>
            <span class="text-xs text-on-surface-variant font-medium">
              Showing ${filteredRooms.length} of ${totalCount} Units
            </span>
          </div>
          <span class="text-[11px] font-data-mono text-on-surface-variant flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Telemetry Synced
          </span>
        </div>

        ${
          filteredRooms.length === 0
            ? `
              <div class="py-16 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant p-8 space-y-3 shadow-xs">
                <span class="material-symbols-outlined text-4xl text-on-surface-variant">search_off</span>
                <h4 class="text-base font-bold text-primary">No Units Match Filter</h4>
                <p class="text-xs text-on-surface-variant max-w-md mx-auto">No rooms were found for the selected criteria. Reset filters to view all property inventory.</p>
                <button id="btn-empty-house-reset" class="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold cursor-pointer">
                  Reset All Filters
                </button>
              </div>
            `
            : `
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-3.5">
                ${filteredRooms.map(room => this.renderRoomCard(room)).join('')}
              </div>
            `
        }
      </main>

      <!-- ================================================================= -->
      <!-- SLIDE-OVER TELEMETRY & ROOM INSPECTION DRAWER -->
      <!-- ================================================================= -->
      <div id="house-drawer-backdrop" class="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 transition-opacity duration-300 ${
        this.selectedRoom ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }"></div>
      
      <aside id="house-detail-drawer" class="fixed top-0 right-0 h-full w-full max-w-xl bg-surface-container-lowest shadow-2xl z-50 border-l border-outline-variant flex flex-col transform transition-transform duration-300 ease-out select-none ${
        this.selectedRoom ? 'translate-x-0' : 'translate-x-full'
      }">
        ${this.renderDrawerContent()}
      </aside>
      `}
    `;

    this.bindEvents();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ROOM CARD RENDERING (HIGH-END STITCH UI ELEVATION)
  // ──────────────────────────────────────────────────────────────────────────
  renderRoomCard(r) {
    const isSelected = this.selectedRoom && this.selectedRoom.number === r.number;

    let cardBg = '';
    let categoryText = '';
    let numberText = '';
    let bottomBadge = '';
    let topIcon = '';

    switch (r.status) {
      case 'Checked In':
        cardBg = 'bg-[#F87171] text-white shadow-xs hover:brightness-105 border border-red-300/40';
        categoryText = 'text-white/90';
        numberText = 'text-white';
        topIcon = `<span class="material-symbols-outlined text-[16px] text-white/80">vpn_key</span>`;
        bottomBadge = `
          <div class="pt-2 border-t border-white/25 flex items-center justify-between">
            <div class="flex items-center gap-1 truncate mr-1">
              <span class="material-symbols-outlined text-[14px]">nfc</span>
              <span class="text-xs font-bold text-white truncate">${r.guest ? r.guest.split(' ')[0] + ' ' + (r.guest.split(' ')[1] ? r.guest.split(' ')[1][0] + '.' : '') : 'In-House'}</span>
            </div>
            <span class="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-bold font-data-mono">Night ${r.currentNight || 2}/${r.totalNights || 4}</span>
          </div>
        `;
        break;

      case 'Reserved':
        cardBg = 'bg-[#F59E0B] text-white shadow-xs hover:brightness-105 border border-amber-400/40';
        categoryText = 'text-white/90';
        numberText = 'text-white';
        topIcon = `<span class="material-symbols-outlined text-[16px] text-white/80">schedule</span>`;
        bottomBadge = `
          <div class="pt-2 border-t border-white/25 flex items-center justify-between">
            <span class="text-xs font-bold text-white flex items-center gap-1">
              <span class="material-symbols-outlined text-[13px]">flight_land</span>
              <span>${r.eta ? r.eta.replace(' Arriving', '') : 'Reserved'}</span>
            </span>
            <span class="text-[10px] bg-black/15 px-1.5 py-0.5 rounded text-white font-data-mono font-bold">${r.reservationId || 'RES'}</span>
          </div>
        `;
        break;

      case 'Paid':
        cardBg = 'bg-[#10B981] text-white shadow-xs hover:brightness-105 border border-emerald-400/40';
        categoryText = 'text-white/90';
        numberText = 'text-white';
        topIcon = `<span class="material-symbols-outlined text-[16px] text-white/90">stars</span>`;
        bottomBadge = `
          <div class="pt-2 border-t border-white/25 flex items-center justify-between">
            <span class="text-xs font-bold text-white flex items-center gap-1">
              <span class="material-symbols-outlined text-[13px]">verified_user</span>
              <span>${r.badgeNote || 'Guaranteed'}</span>
            </span>
            <span class="text-[10px] bg-black/15 px-1.5 py-0.5 rounded text-white font-data-mono font-bold">Pre-Paid</span>
          </div>
        `;
        break;

      case 'Checked Out':
        cardBg = 'bg-[#8B5CF6] text-white shadow-xs hover:brightness-105 border border-purple-400/40';
        categoryText = 'text-white/90';
        numberText = 'text-white';
        topIcon = `<span class="material-symbols-outlined text-[16px] text-white/80">dry_cleaning</span>`;
        bottomBadge = `
          <div class="pt-2 border-t border-white/25 flex items-center justify-between">
            <span class="text-xs font-bold text-white flex items-center gap-1">
              <span class="material-symbols-outlined text-[13px]">priority_high</span>
              <span>Rush Clean</span>
            </span>
            <span class="text-[10px] bg-black/15 px-1.5 py-0.5 rounded text-white font-data-mono font-bold">Turnover</span>
          </div>
        `;
        break;

      case 'Damaged':
        cardBg = 'bg-[#1E293B] text-white shadow-xs hover:brightness-105 border border-slate-700/60';
        categoryText = 'text-slate-400';
        numberText = 'text-white';
        topIcon = `<span class="material-symbols-outlined text-[16px] text-rose-400">warning</span>`;
        bottomBadge = `
          <div class="pt-2 border-t border-white/20 flex items-center justify-between">
            <span class="text-xs font-medium text-slate-300 flex items-center gap-1 truncate">
              <span class="material-symbols-outlined text-[13px] text-amber-400">build</span>
              <span>HVAC Repair</span>
            </span>
            <span class="text-[10px] bg-rose-500/20 text-rose-300 px-1 py-0.5 rounded font-mono font-bold">${r.workOrder || '#WO-1038'}</span>
          </div>
        `;
        break;

      case 'Available':
      default:
        cardBg = 'bg-white text-slate-800 shadow-2xs border-2 border-outline-variant hover:border-primary group';
        categoryText = 'text-slate-500 font-semibold';
        numberText = 'text-slate-900';
        topIcon = `<span class="material-symbols-outlined text-[16px] text-slate-400 group-hover:text-primary">bed</span>`;
        bottomBadge = `
          <div class="pt-2 border-t border-outline-variant/50 flex items-center justify-between">
            <span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <span class="material-symbols-outlined text-[13px]">check</span>
              <span>Ready</span>
            </span>
            <span class="text-[10px] text-slate-500 font-mono font-bold">${r.hkStaff ? 'HK: #12' : 'Inspected'}</span>
          </div>
        `;
        break;
    }

    const selectionRing = isSelected ? 'ring-4 ring-primary/40 ring-offset-2 shadow-lg scale-[1.02]' : '';

    return `
      <div 
        class="house-room-card rounded-2xl p-3.5 flex flex-col justify-between h-36 cursor-pointer transition-all duration-200 select-none ${cardBg} ${selectionRing}" 
        data-room-number="${r.number}"
        title="Room ${r.number} (${r.category}) — ${r.status}"
      >
        <!-- Top Row: Category & Icon -->
        <div class="flex items-start justify-between">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-wider leading-tight ${categoryText}">${r.category}</p>
            <p class="text-2xl sm:text-3xl font-black tracking-tight font-display-kpi mt-0.5 ${numberText}">${r.number}</p>
          </div>
          <div class="p-1 rounded-full bg-black/10 flex items-center justify-center">
            ${topIcon}
          </div>
        </div>

        <!-- Bottom Row: Telemetry Badge -->
        ${bottomBadge}
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // COMPREHENSIVE DRAWER: SUMMARY, CHECK-OUT, SERVICES, HOUSEKEEPING & F&B
  // ──────────────────────────────────────────────────────────────────────────
  renderDrawerContent() {
    if (!this.selectedRoom) {
      return `<div class="p-6 text-center text-on-surface-variant">No room selected.</div>`;
    }

    const r = this.selectedRoom;

    let badgeClass = 'bg-slate-100 text-slate-800 border border-slate-300';
    if (r.status === 'Checked In') badgeClass = 'bg-[#f87171] text-white';
    if (r.status === 'Reserved') badgeClass = 'bg-[#f59e0b] text-white';
    if (r.status === 'Paid') badgeClass = 'bg-[#10b981] text-white';
    if (r.status === 'Checked Out') badgeClass = 'bg-[#8b5cf6] text-white';
    if (r.status === 'Damaged') badgeClass = 'bg-[#1e293b] text-white';

    const servicesCount = (r.services || []).length;
    const diningCount = (r.diningOrders || []).length;

    return `
      <!-- Drawer Top Bar -->
      <div class="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface-bright shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-xs ${badgeClass}">
            ${r.number}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-headline-sm text-base font-bold text-primary">Room ${r.number} · ${r.category}</h3>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeClass}">
                ${r.status}
              </span>
            </div>
            <p class="text-xs text-on-surface-variant font-medium mt-0.5">${r.wing || 'Main Wing'} · Floor ${r.floor} · ₹${r.rate.toLocaleString()} / night</p>
          </div>
        </div>
        <button id="btn-close-house-drawer" class="p-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <!-- Segmented Drawer Navigation Switcher -->
      <div class="px-6 pt-3 pb-2 bg-surface-bright border-b border-outline-variant/60 shrink-0">
        <div class="flex items-center gap-1 p-1 bg-surface-container rounded-xl border border-outline-variant/60">
          <button class="btn-drawer-nav-tab flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
            this.activeDrawerTab === 'overview' ? 'bg-primary text-on-primary font-bold shadow-xs' : 'text-on-surface-variant hover:text-primary'
          }" data-drawer-tab="overview">Overview</button>
          
          <button class="btn-drawer-nav-tab flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
            this.activeDrawerTab === 'checkout' ? 'bg-primary text-on-primary font-bold shadow-xs' : 'text-on-surface-variant hover:text-primary'
          }" data-drawer-tab="checkout">Check-Out</button>
          
          <button class="btn-drawer-nav-tab flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
            this.activeDrawerTab === 'services' ? 'bg-primary text-on-primary font-bold shadow-xs' : 'text-on-surface-variant hover:text-primary'
          }" data-drawer-tab="services">Services (${servicesCount})</button>
          
          <button class="btn-drawer-nav-tab flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
            this.activeDrawerTab === 'housekeeping' ? 'bg-primary text-on-primary font-bold shadow-xs' : 'text-on-surface-variant hover:text-primary'
          }" data-drawer-tab="housekeeping">Housekeeping</button>
          
          <button class="btn-drawer-nav-tab flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
            this.activeDrawerTab === 'restaurant' ? 'bg-primary text-on-primary font-bold shadow-xs' : 'text-on-surface-variant hover:text-primary'
          }" data-drawer-tab="restaurant">Dining (${diningCount})</button>
        </div>
      </div>

      <!-- Drawer Tab Panels (Scrollable) -->
      <div class="p-6 overflow-y-auto flex-1 space-y-5 text-xs custom-scrollbar">
        ${
          this.activeDrawerTab === 'overview'
            ? this.renderTabOverview(r)
            : this.activeDrawerTab === 'checkout'
            ? this.renderTabCheckOut(r)
            : this.activeDrawerTab === 'services'
            ? this.renderTabServices(r)
            : this.activeDrawerTab === 'housekeeping'
            ? this.renderTabHousekeeping(r)
            : this.renderTabRestaurant(r)
        }
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TAB 1: DETAILED SUMMARY & OPERATIONAL TELEMETRY OVERVIEW
  // ──────────────────────────────────────────────────────────────────────────
  renderTabOverview(r) {
    const isCheckedIn = r.status === 'Checked In';

    return `
      <!-- Guest Record & VIP Telemetry -->
      ${
        r.guest || r.reservationId
          ? `
            <div class="bg-surface-container-lowest rounded-2xl p-4.5 border border-outline-variant shadow-xs space-y-3.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5">
                  <div class="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shadow-2xs">
                    ${r.guest ? r.guest.charAt(0) : 'G'}
                  </div>
                  <div>
                    <h4 class="font-bold text-sm text-primary flex items-center gap-1.5">
                      ${r.guest}
                      ${r.vipTier ? `<span class="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold font-data-mono">${r.vipTier}</span>` : ''}
                      ${r.idVerified ? `<span class="material-symbols-outlined text-[15px] text-emerald-600" title="Government ID Verified">verified</span>` : ''}
                    </h4>
                    <p class="text-[11px] text-on-surface-variant font-data-mono">Folio #${r.reservationId} · ${r.corporateAccount || 'Direct Booking'}</p>
                  </div>
                </div>
                <span class="px-2.5 py-1 rounded-lg bg-surface-container font-data-mono text-[11px] font-bold text-primary">
                  Night ${r.currentNight || 1} of ${r.totalNights || 3}
                </span>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2.5 border-t border-outline-variant/50 text-[11px]">
                <div>
                  <span class="text-on-surface-variant block text-[10px]">Stay Period:</span>
                  <p class="font-semibold text-on-surface font-data-mono">${r.checkIn || '15 Sep'} → ${r.checkOut || '18 Sep'}</p>
                </div>
                <div>
                  <span class="text-on-surface-variant block text-[10px]">Nationality / ID:</span>
                  <p class="font-semibold text-on-surface">${r.nationality || 'Verified Citizen'}</p>
                </div>
                <div>
                  <span class="text-on-surface-variant block text-[10px]">Phone Contact:</span>
                  <p class="font-semibold text-on-surface truncate">${r.phone || '+1 (555) 0192'}</p>
                </div>
              </div>

              <!-- VIP Curated Preferences -->
              ${
                r.preferences
                  ? `
                    <div class="p-3 bg-surface-container rounded-xl text-[11px] space-y-1.5 border border-outline-variant/40">
                      <span class="text-[10px] font-bold uppercase tracking-wider text-primary font-data-mono flex items-center gap-1">
                        <span class="material-symbols-outlined text-[14px]">tune</span>
                        <span>Resident Preferences & SOP Flags:</span>
                      </span>
                      <p class="text-on-surface"><strong class="text-on-surface-variant font-medium">Pillows:</strong> ${r.preferences.pillow}</p>
                      <p class="text-on-surface"><strong class="text-on-surface-variant font-medium">Dietary:</strong> <span class="text-rose-700 font-semibold">${r.preferences.dietary}</span></p>
                      <p class="text-on-surface"><strong class="text-on-surface-variant font-medium">Beverage:</strong> ${r.preferences.beverage}</p>
                    </div>
                  `
                  : ''
              }
            </div>
          `
          : ''
      }

      <!-- Room Hardware & IoT Telemetry -->
      <div class="bg-surface-container-lowest rounded-2xl p-4.5 border border-outline-variant shadow-xs space-y-3">
        <h4 class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">Room Hardware & IoT Telemetry</h4>
        <div class="grid grid-cols-2 gap-3 text-xs">
          <div class="flex items-center gap-2.5 p-2 bg-surface-container rounded-xl">
            <span class="material-symbols-outlined text-slate-500 text-[18px]">bed</span>
            <div>
              <span class="text-[10px] text-on-surface-variant block">Bedding Setup</span>
              <span class="font-semibold text-on-surface">${r.bedding || '1 King Bed'}</span>
            </div>
          </div>
          <div class="flex items-center gap-2.5 p-2 bg-surface-container rounded-xl">
            <span class="material-symbols-outlined text-emerald-600 text-[18px]">thermostat</span>
            <div>
              <span class="text-[10px] text-on-surface-variant block">Thermostat</span>
              <span class="font-semibold text-emerald-700 font-data-mono">${r.tempSetting || '21.5°C (Eco)'}</span>
            </div>
          </div>
          <div class="flex items-center gap-2.5 p-2 bg-surface-container rounded-xl">
            <span class="material-symbols-outlined text-primary text-[18px]">badge</span>
            <div>
              <span class="text-[10px] text-on-surface-variant block">Active RFID Keycard</span>
              <span class="font-semibold text-primary font-data-mono">${r.keycard || 'Unassigned'}</span>
            </div>
          </div>
          <div class="flex items-center gap-2.5 p-2 bg-surface-container rounded-xl">
            <span class="material-symbols-outlined text-emerald-600 text-[18px]">lock</span>
            <div>
              <span class="text-[10px] text-on-surface-variant block">Door Deadbolt</span>
              <span class="font-semibold text-emerald-700">Secured & Latched</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Financial Telemetry & Master Folio -->
      ${
        isCheckedIn
          ? `
            <div class="bg-surface-container-lowest rounded-2xl p-4.5 border border-outline-variant space-y-3 shadow-xs">
              <div class="flex items-center justify-between">
                <h4 class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">Folio Financial Telemetry</h4>
                <span class="text-[11px] font-bold text-emerald-700 font-data-mono">Pre-Auth Guarantee: ₹35,000</span>
              </div>
              <div class="space-y-1.5 text-[11px]">
                <div class="flex justify-between text-on-surface-variant">
                  <span>Room Tariff (${r.totalNights || 4} Nights × ₹${r.rate.toLocaleString()})</span>
                  <span class="font-data-mono font-semibold text-on-surface">₹${(r.roomCharges || 13500).toLocaleString()}</span>
                </div>
                <div class="flex justify-between text-on-surface-variant">
                  <span>F&B Restaurant & In-Room Dining</span>
                  <span class="font-data-mono font-semibold text-on-surface">₹${(r.serviceCharges || 2450).toLocaleString()}</span>
                </div>
                <div class="flex justify-between text-on-surface-variant">
                  <span>Taxes & Luxury Hospitality Surcharges (10%)</span>
                  <span class="font-data-mono font-semibold text-on-surface">₹${(r.taxTotal || 1595).toLocaleString()}</span>
                </div>
                <div class="flex justify-between pt-2 border-t border-outline-variant font-bold text-xs">
                  <span class="text-primary">Master Folio Total</span>
                  <span class="font-data-mono text-primary text-sm">₹${(r.totalBalance || 17545).toLocaleString()}</span>
                </div>
              </div>
            </div>
          `
          : ''
      }

      <!-- Quick Operations Launcher -->
      <div class="space-y-2">
        <h4 class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">Quick Workflow Launchers</h4>
        <div class="grid grid-cols-2 gap-2">
          <button class="btn-switch-tab-action py-2.5 px-3 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-all cursor-pointer shadow-xs" data-target-tab="checkout">
            <span class="material-symbols-outlined text-[16px]">door_open</span>
            <span>Perform Check-Out</span>
          </button>
          <button class="btn-switch-tab-action py-2.5 px-3 rounded-xl border border-outline-variant bg-surface-container-lowest font-semibold text-xs text-primary flex items-center justify-center gap-1.5 hover:bg-surface-container transition-all cursor-pointer shadow-2xs" data-target-tab="services">
            <span class="material-symbols-outlined text-[16px]">room_service</span>
            <span>Assign Services (${(r.services || []).length})</span>
          </button>
          <button class="btn-switch-tab-action py-2.5 px-3 rounded-xl border border-outline-variant bg-surface-container-lowest font-semibold text-xs text-primary flex items-center justify-center gap-1.5 hover:bg-surface-container transition-all cursor-pointer shadow-2xs" data-target-tab="housekeeping">
            <span class="material-symbols-outlined text-[16px]">cleaning_services</span>
            <span>Housekeeping Status</span>
          </button>
          <button class="btn-switch-tab-action py-2.5 px-3 rounded-xl border border-outline-variant bg-surface-container-lowest font-semibold text-xs text-primary flex items-center justify-center gap-1.5 hover:bg-surface-container transition-all cursor-pointer shadow-2xs" data-target-tab="restaurant">
            <span class="material-symbols-outlined text-[16px]">restaurant</span>
            <span>Restaurant Orders</span>
          </button>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TAB 2: IN-DRAWER CHECK-OUT PROCEDURE (SOP GATEWAY)
  // ──────────────────────────────────────────────────────────────────────────
  renderTabCheckOut(r) {
    if (r.status === 'Checked Out') {
      return `
        <div class="bg-purple-50 rounded-2xl p-6 border border-purple-200 text-purple-900 space-y-4 text-center">
          <div class="w-14 h-14 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-2xs">
            <span class="material-symbols-outlined text-3xl">verified</span>
          </div>
          <div>
            <h4 class="text-base font-bold text-purple-950">Departure Completed for Room ${r.number}</h4>
            <p class="text-xs text-purple-800 mt-1">Guest departure successfully executed. Room is now in Turnover status awaiting housekeeping inspection.</p>
          </div>
          <div class="p-3 bg-white/80 rounded-xl border border-purple-200 text-left space-y-1 font-data-mono text-xs">
            <div class="flex justify-between"><span>Departure Time:</span><span class="font-bold">${r.depTime || 'Just Now'}</span></div>
            <div class="flex justify-between"><span>Last Resident:</span><span class="font-bold">${r.lastOccupant || r.guest || 'Resident Guest'}</span></div>
            <div class="flex justify-between"><span>Turnover Priority:</span><span class="font-bold text-purple-700">Vacant Dirty (Rush Clean)</span></div>
          </div>
          <button id="btn-re-clean-turnover" class="px-4 py-2 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-800 transition-all cursor-pointer shadow-xs">
            Mark Cleaned & Ready (Return to Available)
          </button>
        </div>
      `;
    }

    if (r.status !== 'Checked In') {
      return `
        <div class="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant text-center space-y-3">
          <span class="material-symbols-outlined text-4xl text-on-surface-variant">info</span>
          <h4 class="text-base font-bold text-primary">Room Not In-House</h4>
          <p class="text-xs text-on-surface-variant max-w-sm mx-auto">This unit is currently in "${r.status}" status. Only active in-house resident rooms can undergo departure checkout.</p>
        </div>
      `;
    }

    const cl = r.checkoutChecklist || { folioSettled: true, minibarAudited: true, keycardReturned: true, safeCleared: true, transportAssisted: true };

    return `
      <div class="space-y-4">
        
        <!-- Header Banner -->
        <div class="p-3.5 bg-primary/5 rounded-2xl border border-primary/20 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[20px]">door_open</span>
            <div>
              <h4 class="font-bold text-xs text-primary">Resident Departure Protocol (Room ${r.number})</h4>
              <p class="text-[11px] text-on-surface-variant">Perform full 5-point front desk clearance directly here</p>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[10px] font-data-mono">Ready to Check Out</span>
        </div>

        <!-- 5-Point SOP Departure Checklist -->
        <div class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant shadow-xs space-y-2.5">
          <h4 class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">5-Point Departure Checklist</h4>
          
          <div class="space-y-2">
            <label class="flex items-start gap-2.5 p-2 rounded-xl bg-surface-container cursor-pointer hover:bg-surface-container-high transition-colors">
              <input type="checkbox" id="chk-folio-settled" class="mt-0.5 rounded text-primary focus:ring-primary" ${cl.folioSettled ? 'checked' : ''}/>
              <div>
                <span class="font-bold text-on-surface block text-xs">1. Master Folio & Incidentals Settle Balance</span>
                <span class="text-[11px] text-on-surface-variant">Room charges, dining, and spa confirmed</span>
              </div>
            </label>

            <label class="flex items-start gap-2.5 p-2 rounded-xl bg-surface-container cursor-pointer hover:bg-surface-container-high transition-colors">
              <input type="checkbox" id="chk-minibar" class="mt-0.5 rounded text-primary focus:ring-primary" ${cl.minibarAudited ? 'checked' : ''}/>
              <div>
                <span class="font-bold text-on-surface block text-xs">2. In-Room Minibar Consumption Audited</span>
                <span class="text-[11px] text-on-surface-variant">Automated sensor audit cleared with no pending charges</span>
              </div>
            </label>

            <label class="flex items-start gap-2.5 p-2 rounded-xl bg-surface-container cursor-pointer hover:bg-surface-container-high transition-colors">
              <input type="checkbox" id="chk-keycard" class="mt-0.5 rounded text-primary focus:ring-primary" ${cl.keycardReturned ? 'checked' : ''}/>
              <div>
                <span class="font-bold text-on-surface block text-xs">3. RFID Keycard Recovered & De-encoded</span>
                <span class="text-[11px] text-on-surface-variant">Card ID: <strong>${r.keycard || 'RFID-102-A'}</strong> surrendered</span>
              </div>
            </label>

            <label class="flex items-start gap-2.5 p-2 rounded-xl bg-surface-container cursor-pointer hover:bg-surface-container-high transition-colors">
              <input type="checkbox" id="chk-safe" class="mt-0.5 rounded text-primary focus:ring-primary" ${cl.safeCleared ? 'checked' : ''}/>
              <div>
                <span class="font-bold text-on-surface block text-xs">4. In-Room Electronic Safe Inspected & Left Open</span>
                <span class="text-[11px] text-on-surface-variant">Verified empty by housekeeping or resident</span>
              </div>
            </label>

            <label class="flex items-start gap-2.5 p-2 rounded-xl bg-surface-container cursor-pointer hover:bg-surface-container-high transition-colors">
              <input type="checkbox" id="chk-transport" class="mt-0.5 rounded text-primary focus:ring-primary" ${cl.transportAssisted ? 'checked' : ''}/>
              <div>
                <span class="font-bold text-on-surface block text-xs">5. Luggage Assistance & Departure Transfer Confirmed</span>
                <span class="text-[11px] text-on-surface-variant">Airport limousine or bell desk service arranged</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Settlement & Payment Method -->
        <div class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">Final Folio Settlement</h4>
            <span class="text-sm font-black text-primary font-data-mono">Total: ₹${(r.totalBalance || 17545).toLocaleString()}</span>
          </div>

          <div class="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <label class="block font-bold text-on-surface-variant mb-1 font-data-mono">Settlement Method</label>
              <select id="sel-checkout-payment-method" class="w-full py-1.5 px-2.5 rounded-xl border border-outline-variant bg-surface-container text-xs text-on-surface outline-none">
                <option selected>Credit Card (Front Desk POS)</option>
                <option>Cash / Currency Settlement</option>
                <option>Corporate Direct Billing</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-on-surface-variant mb-1 font-data-mono">Email Tax Invoice</label>
              <input type="text" value="${r.email || 'elena.rostova@traveler.com'}" class="w-full py-1.5 px-2.5 rounded-xl border border-outline-variant bg-surface-container text-xs text-on-surface outline-none font-data-mono"/>
            </div>
          </div>
        </div>

        <!-- Execute Check-Out Here Button -->
        <div class="space-y-2 pt-2">
          <button id="btn-execute-checkout-direct" class="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md transform hover:-translate-y-0.5">
            <span class="material-symbols-outlined text-[18px]">verified</span>
            <span>Confirm & Complete Departure Check-Out Here</span>
          </button>
          
          <button id="btn-open-full-checkout-modal" class="w-full py-2 px-3 rounded-xl border border-outline-variant text-primary font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-surface-container transition-all cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">receipt_long</span>
            <span>Open Full Checkout Invoice Window</span>
          </button>
        </div>

      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TAB 3: SERVICES & SPECIAL REQUESTS ASSIGNMENT HUB
  // ──────────────────────────────────────────────────────────────────────────
  renderTabServices(r) {
    const services = r.services || [];

    return `
      <div class="space-y-4">
        
        <!-- Active Requests for Room -->
        <div class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">Active Room Services & Requests</h4>
            <span class="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold text-[10px] font-data-mono">${services.length} Requests</span>
          </div>

          ${
            services.length === 0
              ? `<div class="p-4 text-center text-on-surface-variant">No active service requests for this room yet. Use the form below to assign a service.</div>`
              : `
                <div class="space-y-2">
                  ${services.map((s, idx) => `
                    <div class="p-3 bg-surface-container rounded-xl flex items-center justify-between gap-3 border border-outline-variant/50">
                      <div class="min-w-0">
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-xs text-primary truncate">${s.name}</span>
                          <span class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            s.priority === 'VIP Urgent' ? 'bg-red-100 text-red-800' : (s.priority === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700')
                          }">${s.priority}</span>
                        </div>
                        <p class="text-[11px] text-on-surface-variant mt-0.5 font-data-mono">
                          Dept: <strong>${s.department}</strong> · Cost: ₹${(s.price || 0).toLocaleString()} · ${s.time || 'Today'}
                        </p>
                      </div>

                      <div class="flex items-center gap-1.5 shrink-0">
                        <span class="px-2 py-1 rounded-lg text-[10px] font-bold font-data-mono ${
                          s.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : (s.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800')
                        }">${s.status}</span>
                        
                        ${
                          s.status !== 'Completed'
                            ? `<button class="btn-toggle-service-done p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer" data-service-idx="${idx}" title="Mark Service Completed">
                                <span class="material-symbols-outlined text-[15px]">check</span>
                               </button>`
                            : ''
                        }
                      </div>
                    </div>
                  `).join('')}
                </div>
              `
          }
        </div>

        <!-- Inline Assign New Service Form -->
        <div class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant shadow-xs space-y-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[18px]">add_task</span>
            <h4 class="text-[11px] font-bold uppercase tracking-wider text-primary font-data-mono">Assign New Guest Service / Request</h4>
          </div>

          <div class="space-y-2.5">
            <div>
              <label class="block text-[11px] font-bold text-on-surface-variant mb-1 font-data-mono">Select Service / Amenity</label>
              <select id="sel-new-service-type" class="w-full py-1.5 px-2.5 rounded-xl border border-outline-variant bg-surface-container text-xs text-on-surface outline-none">
                <option value="Airport Luxury Sedan Transfer" data-price="2500" data-dept="Concierge">Airport Luxury Sedan Transfer (₹2,500)</option>
                <option value="Extra Goose Down Pillows & Silk Bedding" data-price="0" data-dept="Housekeeping">Extra Goose Down Pillows & Silk Bedding (Complimentary)</option>
                <option value="Evening Turndown & Aromatherapy" data-price="0" data-dept="Housekeeping">Evening Turndown & Aromatherapy (Complimentary)</option>
                <option value="In-Suite Deep Tissue Spa Massage (60m)" data-price="3500" data-dept="Spa & Wellness">In-Suite Deep Tissue Spa Massage (₹3,500)</option>
                <option value="Express Laundry & Garment Pressing" data-price="650" data-dept="Housekeeping">Express Laundry & Garment Pressing (₹650)</option>
                <option value="Executive Wake-Up Call with Espresso" data-price="0" data-dept="Front Desk">Executive Wake-Up Call with Espresso (Complimentary)</option>
                <option value="Baby Crib & Childproofing Setup" data-price="0" data-dept="Housekeeping">Baby Crib & Childproofing Setup (Complimentary)</option>
                <option value="Special Resident Concierge Request" data-price="0" data-dept="Front Desk">Custom Front Desk Special Request</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[11px] font-bold text-on-surface-variant mb-1 font-data-mono">Department</label>
                <select id="sel-new-service-dept" class="w-full py-1.5 px-2.5 rounded-xl border border-outline-variant bg-surface-container text-xs text-on-surface outline-none">
                  <option>Housekeeping</option>
                  <option>Front Desk</option>
                  <option>Concierge</option>
                  <option>Spa & Wellness</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-on-surface-variant mb-1 font-data-mono">Priority</label>
                <select id="sel-new-service-priority" class="w-full py-1.5 px-2.5 rounded-xl border border-outline-variant bg-surface-container text-xs text-on-surface outline-none">
                  <option>Normal</option>
                  <option>High</option>
                  <option selected>VIP Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-on-surface-variant mb-1 font-data-mono">Notes & Special Delivery Instructions</label>
              <input type="text" id="input-new-service-notes" placeholder="e.g., Deliver promptly by 14:00, ring bell once" class="w-full py-1.5 px-2.5 rounded-xl border border-outline-variant bg-surface-container text-xs text-on-surface outline-none"/>
            </div>

            <label class="flex items-center gap-2 pt-1 text-[11px] font-medium text-on-surface-variant cursor-pointer">
              <input type="checkbox" id="chk-charge-folio" checked class="rounded text-primary focus:ring-primary"/>
              <span>Charge service fee to Room Folio if applicable</span>
            </label>

            <button id="btn-submit-assign-service" class="w-full py-2.5 px-4 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-all cursor-pointer shadow-xs">
              <span class="material-symbols-outlined text-[17px]">send</span>
              <span>Assign & Dispatch Service to Room ${r.number}</span>
            </button>
          </div>
        </div>

      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TAB 4: HOUSEKEEPING & TURNOVER STATUS MANAGEMENT
  // ──────────────────────────────────────────────────────────────────────────
  renderTabHousekeeping(r) {
    const currentHk = r.hkStatus || (r.status === 'Checked Out' ? 'Dirty' : 'Clean');

    return `
      <div class="space-y-4">
        
        <!-- Housekeeping Condition Card -->
        <div class="bg-surface-container-lowest rounded-2xl p-4.5 border border-outline-variant shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">Cleanliness & Readiness Status</h4>
            <span class="px-2.5 py-1 rounded-full text-xs font-bold ${
              currentHk.includes('Inspected') ? 'bg-emerald-100 text-emerald-800' : (currentHk.includes('Clean') ? 'bg-blue-100 text-blue-800' : (currentHk.includes('Progress') ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'))
            }">${currentHk}</span>
          </div>

          <!-- Quick One-Click Status Switcher -->
          <div class="grid grid-cols-2 gap-2 pt-2">
            <button class="btn-set-hk-status py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              currentHk.includes('Inspected') ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'border-outline-variant bg-surface-container hover:bg-surface-container-high'
            }" data-hk-status="Ready / Inspected">
              <span class="material-symbols-outlined text-[16px]">verified</span>
              <span>Mark Inspected</span>
            </button>

            <button class="btn-set-hk-status py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              currentHk === 'Clean' ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'border-outline-variant bg-surface-container hover:bg-surface-container-high'
            }" data-hk-status="Clean">
              <span class="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Mark Clean</span>
            </button>

            <button class="btn-set-hk-status py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              currentHk.includes('Progress') ? 'bg-amber-500 text-white border-amber-500 shadow-xs' : 'border-outline-variant bg-surface-container hover:bg-surface-container-high'
            }" data-hk-status="Cleaning In Progress">
              <span class="material-symbols-outlined text-[16px]">soap</span>
              <span>In Progress</span>
            </button>

            <button class="btn-set-hk-status py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              currentHk.includes('Dirty') ? 'bg-rose-600 text-white border-rose-600 shadow-xs' : 'border-outline-variant bg-surface-container hover:bg-surface-container-high'
            }" data-hk-status="Vacant Dirty (Rush Turnover)">
              <span class="material-symbols-outlined text-[16px]">cleaning_services</span>
              <span>Dispatch Dirty</span>
            </button>
          </div>
        </div>

        <!-- Attendant Assignment Card -->
        <div class="bg-surface-container-lowest rounded-2xl p-4.5 border border-outline-variant shadow-xs space-y-3">
          <h4 class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">Assigned Housekeeping Attendant</h4>
          
          <div class="flex items-center gap-3 p-3 bg-surface-container rounded-xl">
            <div class="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
              <span class="material-symbols-outlined text-[20px]">person</span>
            </div>
            <div class="flex-1">
              <span class="text-[10px] text-on-surface-variant block uppercase font-data-mono font-bold">Primary Attendant</span>
              <p class="font-bold text-xs text-primary">${r.housekeeper || 'Elena Gomez - Team Alpha'}</p>
            </div>
          </div>

          <div class="pt-2">
            <label class="block text-[11px] font-bold text-on-surface-variant mb-1 font-data-mono">Reassign Attendant</label>
            <div class="flex items-center gap-2">
              <select id="sel-reassign-attendant" class="flex-1 py-1.5 px-2.5 rounded-xl border border-outline-variant bg-surface-container text-xs text-on-surface outline-none">
                <option>Elena Gomez (Floor 1)</option>
                <option>Maria Santos (Floor 1 & 2)</option>
                <option>Fatima Zahra (Floor 2)</option>
                <option>Carlos Ruiz (Floor 3)</option>
                <option>David Kim (Suites Team)</option>
              </select>
              <button id="btn-save-attendant" class="px-3 py-1.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-all cursor-pointer">
                Reassign
              </button>
            </div>
          </div>
        </div>

        <!-- Housekeeping Specifications & Logs -->
        <div class="bg-surface-container rounded-2xl p-4 border border-outline-variant/60 space-y-2 text-xs">
          <div class="flex justify-between text-on-surface-variant font-data-mono">
            <span>Last Deep Cleaned:</span>
            <span class="font-bold text-on-surface">${r.lastCleaned || 'Today 08:30 AM'}</span>
          </div>
          <div class="flex justify-between text-on-surface-variant font-data-mono">
            <span>Turndown Service:</span>
            <span class="font-bold text-on-surface">${r.turnDownTime || '19:30 Scheduled'}</span>
          </div>
          <div class="flex justify-between text-on-surface-variant font-data-mono">
            <span>Inspection Audit Score:</span>
            <span class="font-bold text-emerald-700">98.5% (Executive Standard)</span>
          </div>
        </div>

      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TAB 5: IN-ROOM DINING & RESTAURANT ORDERS HUB
  // ──────────────────────────────────────────────────────────────────────────
  renderTabRestaurant(r) {
    const orders = r.diningOrders || [];

    return `
      <div class="space-y-4">
        
        <!-- Billed Restaurant Orders -->
        <div class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">Billed In-Room Dining & Restaurant Orders</h4>
            <span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[10px] font-data-mono">${orders.length} Orders</span>
          </div>

          ${
            orders.length === 0
              ? `<div class="p-4 text-center text-on-surface-variant">No restaurant orders recorded for Room ${r.number} yet. Place an order below to charge to room.</div>`
              : `
                <div class="space-y-2">
                  ${orders.map(ord => `
                    <div class="p-3 bg-surface-container rounded-xl border border-outline-variant/50 space-y-1">
                      <div class="flex items-center justify-between">
                        <span class="font-bold text-xs text-primary font-data-mono">Order #${ord.id}</span>
                        <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">${ord.status || 'Delivered'}</span>
                      </div>
                      <p class="text-xs text-on-surface font-medium">${ord.items}</p>
                      <div class="flex items-center justify-between pt-1 border-t border-outline-variant/40 text-[11px] font-data-mono text-on-surface-variant">
                        <span>${ord.time || 'Today'}</span>
                        <span class="font-bold text-primary">₹${ord.total.toLocaleString()} Billed</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              `
          }
        </div>

        <!-- Quick Restaurant Ordering Menu -->
        <div class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant shadow-xs space-y-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[18px]">restaurant_menu</span>
            <h4 class="text-[11px] font-bold uppercase tracking-wider text-primary font-data-mono">New Restaurant Order (Charge to Room)</h4>
          </div>

          <div class="space-y-2.5">
            <div>
              <label class="block text-[11px] font-bold text-on-surface-variant mb-1 font-data-mono">Select Culinary Item</label>
              <select id="sel-dining-menu-item" class="w-full py-1.5 px-2.5 rounded-xl border border-outline-variant bg-surface-container text-xs text-on-surface outline-none">
                <option value="Volvitech Signature Wagyu Burger & Truffle Fries" data-price="1400">Volvitech Signature Wagyu Burger & Truffle Fries (₹1,400)</option>
                <option value="Artisan Club Sandwich with Triple-Cooked Chips" data-price="850">Artisan Club Sandwich with Triple-Cooked Chips (₹850)</option>
                <option value="Wood-Fired Neapolitan Margherita Pizza" data-price="1100">Wood-Fired Neapolitan Margherita Pizza (₹1,100)</option>
                <option value="Pan-Seared Atlantic Salmon with Grilled Asparagus" data-price="1850">Pan-Seared Atlantic Salmon with Grilled Asparagus (₹1,850)</option>
                <option value="Executive Continental Breakfast Tray & Fresh Juice" data-price="950">Executive Continental Breakfast Tray & Fresh Juice (₹950)</option>
                <option value="Belgian Waffle with Fresh Berry Compote" data-price="750">Belgian Waffle with Fresh Berry Compote (₹750)</option>
                <option value="Nespresso Double Espresso & French Butter Croissant" data-price="450">Nespresso Double Espresso & French Butter Croissant (₹450)</option>
                <option value="Champagne Laurent-Perrier Brut 750ml" data-price="7500">Champagne Laurent-Perrier Brut 750ml (₹7,500)</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[11px] font-bold text-on-surface-variant mb-1 font-data-mono">Quantity</label>
                <input type="number" id="input-dining-qty" value="1" min="1" max="10" class="w-full py-1.5 px-2.5 rounded-xl border border-outline-variant bg-surface-container text-xs text-on-surface outline-none font-data-mono"/>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-on-surface-variant mb-1 font-data-mono">Delivery Time</label>
                <select id="sel-dining-delivery-time" class="w-full py-1.5 px-2.5 rounded-xl border border-outline-variant bg-surface-container text-xs text-on-surface outline-none">
                  <option>Rush Priority (Within 25 mins)</option>
                  <option>Standard (Within 45 mins)</option>
                  <option>Breakfast Tomorrow 08:00 AM</option>
                  <option>Dinner Tonight 20:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-on-surface-variant mb-1 font-data-mono">Dietary & Chef Preparation Notes</label>
              <input type="text" id="input-dining-notes" placeholder="e.g., No nuts, extra dressing, warm plates" class="w-full py-1.5 px-2.5 rounded-xl border border-outline-variant bg-surface-container text-xs text-on-surface outline-none"/>
            </div>

            <button id="btn-place-dining-order" class="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs">
              <span class="material-symbols-outlined text-[17px]">dinner_dining</span>
              <span>Send Order to Kitchen & Charge Room Folio</span>
            </button>
          </div>
        </div>

      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // EVENT BINDINGS
  // ──────────────────────────────────────────────────────────────────────────
  bindEvents() {
    if (!this.container) return;

    // ── PAGE TAB SWITCHER ────────────────────────────────────────────────────
    const btnTabMatrix = this.container.querySelector('#btn-tab-matrix');
    const btnTabOperations = this.container.querySelector('#btn-tab-operations');

    if (btnTabMatrix) {
      btnTabMatrix.addEventListener('click', () => {
        this.activePageTab = 'matrix';
        this.selectedRoom = null;
        this.renderContent();
      });
    }

    if (btnTabOperations) {
      btnTabOperations.addEventListener('click', () => {
        this.activePageTab = 'operations';
        this.selectedRoom = null;
        this.renderContent();
        this._mountRoomOps();
      });
    }

    // Room Master Jump Buttons
    const btnJumpRM = this.container.querySelector('#btn-jump-room-master') || this.container.querySelector('#btn-jump-room-master-ops');
    if (btnJumpRM) {
      btnJumpRM.onclick = () => {
        store.setNavTab('room_master');
      };
    }

    // If already in operations tab (e.g. routed via ?tab=room_status), mount now
    if (this.activePageTab === 'operations') {
      this._mountRoomOps();
      return; // skip matrix-specific bindings
    }

    // Room Card Clicks -> Open Drawer
    this.container.querySelectorAll('.house-room-card').forEach(card => {
      card.addEventListener('click', () => {
        const roomNum = card.getAttribute('data-room-number');
        const room = this.rooms.find(r => r.number === roomNum);
        if (room) {
          this.selectedRoom = room;
          this.renderContent();
        }
      });
    });

    // Close Drawer
    const btnCloseDrawer = this.container.querySelector('#btn-close-house-drawer');
    const drawerBackdrop = this.container.querySelector('#house-drawer-backdrop');

    if (btnCloseDrawer) {
      btnCloseDrawer.addEventListener('click', () => {
        this.selectedRoom = null;
        this.renderContent();
      });
    }

    if (drawerBackdrop) {
      drawerBackdrop.addEventListener('click', () => {
        this.selectedRoom = null;
        this.renderContent();
      });
    }

    // Segmented Drawer Navigation Tabs
    this.container.querySelectorAll('.btn-drawer-nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.activeDrawerTab = tab.getAttribute('data-drawer-tab');
        this.renderContent();
      });
    });

    // Switch Tab Action Shortcuts from Overview
    this.container.querySelectorAll('.btn-switch-tab-action').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeDrawerTab = btn.getAttribute('data-target-tab');
        this.renderContent();
      });
    });

    // Floor Tabs Filter
    this.container.querySelectorAll('.btn-floor-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedFloor = btn.getAttribute('data-floor');
        this.renderContent();
      });
    });

    // Category Selector
    const selCat = this.container.querySelector('#house-filter-category');
    if (selCat) {
      selCat.addEventListener('change', (e) => {
        this.selectedCategory = e.target.value;
        this.renderContent();
      });
    }

    // Legend Pill Filter
    this.container.querySelectorAll('.btn-house-legend-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedStatus = btn.getAttribute('data-status');
        this.renderContent();
      });
    });

    // Top Metric Card Quick Filters
    this.container.querySelectorAll('.btn-quick-filter-metric').forEach(card => {
      card.addEventListener('click', () => {
        this.selectedStatus = card.getAttribute('data-filter-status');
        this.renderContent();
      });
    });

    // Search Input
    const searchInput = this.container.querySelector('#house-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        const currentCursor = e.target.selectionStart;
        this.renderContent();
        const nextInput = this.container.querySelector('#house-search-input');
        if (nextInput) {
          nextInput.focus();
          nextInput.setSelectionRange(currentCursor, currentCursor);
        }
      });
    }

    // Reset Filters
    const btnReset = this.container.querySelector('#btn-house-reset-filters');
    const btnEmptyReset = this.container.querySelector('#btn-empty-house-reset');
    const resetAction = () => {
      this.selectedFloor = 'ALL';
      this.selectedCategory = 'ALL';
      this.selectedStatus = 'ALL';
      this.searchQuery = '';
      this.renderContent();
    };
    if (btnReset) btnReset.addEventListener('click', resetAction);
    if (btnEmptyReset) btnEmptyReset.addEventListener('click', resetAction);

    // ────────────────────────────────────────────────────────────────────────
    // DIRECT IN-DRAWER CHECK-OUT EXECUTION
    // ────────────────────────────────────────────────────────────────────────
    const btnExecuteCheckout = this.container.querySelector('#btn-execute-checkout-direct');
    if (btnExecuteCheckout && this.selectedRoom) {
      btnExecuteCheckout.addEventListener('click', () => {
        const r = this.selectedRoom;
        r.status = 'Checked Out';
        r.housekeepingStatus = 'Vacant Dirty (Rush Turnover)';
        r.hkStatus = 'Vacant Dirty (Rush Turnover)';
        r.lastOccupant = r.guest || 'Resident Guest';
        r.depTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Departed';
        r.guest = null;

        this.saveRooms();
        store.showToast(`Departure completed for Room #${r.number}! Folio settled and housekeeping rush turnover dispatched.`, 'success');
        this.renderContent();
      });
    }

    // Modal Fallback Checkout Window
    const btnOpenFullCheckout = this.container.querySelector('#btn-open-full-checkout-modal');
    if (btnOpenFullCheckout && this.selectedRoom) {
      btnOpenFullCheckout.addEventListener('click', () => {
        const r = this.selectedRoom;
        const mockRes = {
          id: r.reservationId || `res-${r.number}`,
          confirmationCode: r.reservationId || `RES-${r.number}`,
          guestName: r.guest || 'Resident Guest',
          assignedRoom: r.number,
          roomNumber: r.number,
          roomType: r.category,
          status: 'Checked In',
          ratePerNight: r.rate,
          nights: r.totalNights || 3,
          totalAmount: r.totalBalance || 17545,
          paidAmount: r.totalBalance || 17545,
          phone: r.phone || '+1 (555) 0192',
          email: r.email || 'guest@volvitech.com',
        };

        const modal = new CheckOutModal({
          reservation: mockRes,
          onCheckedOut: () => {
            r.status = 'Checked Out';
            r.housekeepingStatus = 'Vacant Dirty (Rush Turnover)';
            r.lastOccupant = mockRes.guestName;
            r.depTime = 'Just Now';
            r.guest = null;
            this.saveRooms();
            this.renderContent();
            store.showToast(`Room #${r.number} departure completed!`, 'success');
          },
          onClose: () => {
            const overlay = document.getElementById('checkout-modal-overlay');
            if (overlay) overlay.remove();
          }
        });
        document.body.appendChild(modal.render());
      });
    }

    // Re-clean / Return to Available button on checked out room
    const btnReClean = this.container.querySelector('#btn-re-clean-turnover');
    if (btnReClean && this.selectedRoom) {
      btnReClean.addEventListener('click', () => {
        this.selectedRoom.status = 'Available';
        this.selectedRoom.hkStatus = 'Ready / Inspected';
        this.selectedRoom.housekeepingStatus = null;
        this.saveRooms();
        store.showToast(`Room #${this.selectedRoom.number} inspected and marked Available!`, 'success');
        this.renderContent();
      });
    }

    // ────────────────────────────────────────────────────────────────────────
    // ASSIGN NEW SERVICE EXECUTION
    // ────────────────────────────────────────────────────────────────────────
    const btnSubmitService = this.container.querySelector('#btn-submit-assign-service');
    if (btnSubmitService && this.selectedRoom) {
      btnSubmitService.addEventListener('click', () => {
        const selService = this.container.querySelector('#sel-new-service-type');
        const selDept = this.container.querySelector('#sel-new-service-dept');
        const selPriority = this.container.querySelector('#sel-new-service-priority');
        const inputNotes = this.container.querySelector('#input-new-service-notes');
        const chkCharge = this.container.querySelector('#chk-charge-folio');

        const serviceName = selService ? selService.value : 'Guest Service';
        const selectedOption = selService ? selService.selectedOptions[0] : null;
        const price = selectedOption ? Number(selectedOption.getAttribute('data-price') || 0) : 0;
        const dept = selDept ? selDept.value : 'Front Desk';
        const priority = selPriority ? selPriority.value : 'Normal';
        const notes = inputNotes ? inputNotes.value : '';

        if (!this.selectedRoom.services) this.selectedRoom.services = [];

        const newService = {
          id: `srv-${Date.now().toString().slice(-4)}`,
          name: serviceName + (notes ? ` (${notes})` : ''),
          department: dept,
          priority,
          price,
          status: 'Pending',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        this.selectedRoom.services.unshift(newService);

        // If charged to folio
        if (chkCharge && chkCharge.checked && price > 0) {
          this.selectedRoom.serviceCharges = (this.selectedRoom.serviceCharges || 0) + price;
          this.selectedRoom.totalBalance = (this.selectedRoom.totalBalance || 0) + price;
        }

        // Also log into global store
        store.createServiceRequest({
          guestName: this.selectedRoom.guest || 'Resident Guest',
          roomNumber: this.selectedRoom.number,
          serviceType: serviceName,
          department: dept,
          priority,
          price,
          details: notes
        }, false);

        this.saveRooms();
        store.showToast(`Service "${serviceName}" assigned to Room #${this.selectedRoom.number} (${dept})!`, 'success');
        this.renderContent();
      });
    }

    // Toggle Service Request Done
    this.container.querySelectorAll('.btn-toggle-service-done').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = Number(btn.getAttribute('data-service-idx'));
        if (this.selectedRoom && this.selectedRoom.services && this.selectedRoom.services[idx]) {
          this.selectedRoom.services[idx].status = 'Completed';
          this.saveRooms();
          store.showToast(`Service marked Completed!`, 'success');
          this.renderContent();
        }
      });
    });

    // ────────────────────────────────────────────────────────────────────────
    // HOUSEKEEPING STATUS CHANGERS & REASSIGNMENT
    // ────────────────────────────────────────────────────────────────────────
    this.container.querySelectorAll('.btn-set-hk-status').forEach(btn => {
      btn.addEventListener('click', () => {
        const newHk = btn.getAttribute('data-hk-status');
        if (!this.selectedRoom) return;

        this.selectedRoom.hkStatus = newHk;
        this.selectedRoom.housekeepingStatus = newHk;
        if (newHk.includes('Inspected') && this.selectedRoom.status === 'Checked Out') {
          this.selectedRoom.status = 'Available';
        }
        this.saveRooms();
        store.showToast(`Housekeeping condition set to "${newHk}" for Room #${this.selectedRoom.number}`, 'success');
        this.renderContent();
      });
    });

    const btnSaveAttendant = this.container.querySelector('#btn-save-attendant');
    if (btnSaveAttendant && this.selectedRoom) {
      btnSaveAttendant.addEventListener('click', () => {
        const selStaff = this.container.querySelector('#sel-reassign-attendant');
        if (selStaff) {
          this.selectedRoom.housekeeper = selStaff.value;
          this.saveRooms();
          store.showToast(`Housekeeper reassigned to ${selStaff.value}`, 'success');
          this.renderContent();
        }
      });
    }

    // ────────────────────────────────────────────────────────────────────────
    // RESTAURANT / IN-ROOM DINING ORDER PLACEMENT
    // ────────────────────────────────────────────────────────────────────────
    const btnPlaceOrder = this.container.querySelector('#btn-place-dining-order');
    if (btnPlaceOrder && this.selectedRoom) {
      btnPlaceOrder.addEventListener('click', () => {
        const selItem = this.container.querySelector('#sel-dining-menu-item');
        const inputQty = this.container.querySelector('#input-dining-qty');
        const selDelivery = this.container.querySelector('#sel-dining-delivery-time');
        const inputNotes = this.container.querySelector('#input-dining-notes');

        const itemName = selItem ? selItem.value : 'Culinary Item';
        const selectedOption = selItem ? selItem.selectedOptions[0] : null;
        const unitPrice = selectedOption ? Number(selectedOption.getAttribute('data-price') || 1200) : 1200;
        const qty = inputQty ? Math.max(1, Number(inputQty.value) || 1) : 1;
        const total = unitPrice * qty;
        const delivery = selDelivery ? selDelivery.value : 'Standard';
        const notes = inputNotes ? inputNotes.value : '';

        if (!this.selectedRoom.diningOrders) this.selectedRoom.diningOrders = [];

        const newOrder = {
          id: `ORD-${Math.floor(100 + Math.random() * 900)}`,
          items: `${qty}x ${itemName}${notes ? ` [${notes}]` : ''} (${delivery})`,
          total,
          status: 'Kitchen Preparing & Billed',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        this.selectedRoom.diningOrders.unshift(newOrder);

        // Charge directly to folio
        this.selectedRoom.serviceCharges = (this.selectedRoom.serviceCharges || 0) + total;
        this.selectedRoom.totalBalance = (this.selectedRoom.totalBalance || 0) + total;

        this.saveRooms();
        store.showToast(`Dining order placed! ₹${total.toLocaleString()} billed to Room #${this.selectedRoom.number} folio. Kitchen notified.`, 'success');
        this.renderContent();
      });
    }

    // Header Quick Action Buttons (Print, Batch, Export)
    const btnPrint = this.container.querySelector('#btn-print-roster');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => window.print());
    }

    const btnBatch = this.container.querySelector('#btn-batch-update');
    if (btnBatch) {
      btnBatch.addEventListener('click', () => store.showToast('Batch Status Update: Multi-select enabled for room turnovers.', 'info'));
    }

    const btnExport = this.container.querySelector('#btn-export-audit');
    if (btnExport) {
      btnExport.addEventListener('click', () => store.showToast('Night Audit report exported successfully (CSV / PDF).', 'success'));
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ROOM OPERATIONS MOUNT HELPER
  // ──────────────────────────────────────────────────────────────────────────
  _mountRoomOps() {
    const mount = this.container && this.container.querySelector('#room-ops-mount');
    if (!mount || !this.roomOpsView) return;
    if (mount.children.length > 0) return; // already mounted
    // Reset the child view's container so it re-renders fresh
    this.roomOpsView.container = null;
    const el = this.roomOpsView.render();
    mount.appendChild(el);
    // Load data then render the operations board content
    if (typeof this.roomOpsView.loadData === 'function') {
      this.roomOpsView.loadData().then(() => {
        if (typeof this.roomOpsView.renderContent === 'function') {
          this.roomOpsView.renderContent();
        }
      });
    } else if (typeof this.roomOpsView.renderContent === 'function') {
      this.roomOpsView.renderContent();
    }
  }
}
