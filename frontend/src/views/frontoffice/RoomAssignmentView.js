// ==========================================================================
// VOLVITECH HOSPITALITY OS — FRONT DESK ROOM ASSIGNMENT COMMAND CENTER
// Dual Mode Architecture: Manual OPERA Workflow + Volvitech Smart Assignment
// Shared Room Allocation Data Model — Single Source of Truth
// ==========================================================================

import { store } from '../../state/store.js';
import { Toast } from '../../components/Toast.js';
import { ReservationDetailModal } from './ReservationDetailModal.js';

export class RoomAssignmentView {
  constructor() {
    this.container = null;
    this.activeModal = null;
    this.boundKeyHandler = null;

    // Assignment Mode: 'MANUAL' (default, OPERA workflow) | 'SMART' (Volvitech rule recommendations)
    this.assignmentMode = 'MANUAL';

    // Date and Search
    this.currentDate = '10 Sep 2026';
    this.searchQuery = '';

    // Primary Filters
    this.filterRoomType = 'ALL';
    this.filterRoomClass = 'ALL';
    this.filterGroup = 'ALL';
    this.filterBlock = 'ALL';
    this.filterVip = 'ALL';      // 'ALL', 'VIP_ONLY', 'STANDARD'
    this.filterStatus = 'ALL';   // 'ALL', 'UNASSIGNED', 'ASSIGNED', 'CHECK_IN_READY'
    this.sortBy = 'URGENCY';     // 'URGENCY', 'ETA', 'GUEST', 'ROOM_TYPE', 'STATUS'

    // Advanced Filters Modal State
    this.isAdvancedFilterOpen = false;
    this.advancedFilters = {
      company: 'ALL',
      agent: 'ALL',
      source: 'ALL',
      features: [],
      specials: '',
      resType: 'ALL',
      smoking: 'ALL',
      preferredRoom: '',
      lastRoom: '',
    };

    // Manual Mode Available Rooms Filters & Sorting
    this.manualFilterFloor = 'ALL';
    this.manualFilterType = 'ALL';
    this.manualFilterHK = 'ALL';
    this.manualFilterAvailability = 'ALL'; // 'ALL', 'ELIGIBLE_ONLY', 'SHOW_ALL'
    this.manualSortBy = 'ROOM_NUM';        // 'ROOM_NUM', 'FLOOR', 'TYPE', 'HK_STATUS'

    // Selection State
    this.selectedReservationId = 'res-10482'; // Default: Eta Thomas
    this.selectedReservationIds = new Set();  // Multi-select for bulk operations

    // Configurable Smart Assignment Rules Weights (Hotel Administrator Rules)
    // Values: 'REQUIRED' | 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW' | 'IGNORE'
    this.smartRules = {
      // Hard rules are always required
      hard: {
        roomTypeMatch: true,
        fullStayAvailability: true,
        occupancyCapacity: true,
        notOutOfOrder: true,
        notOutOfService: true,
        noConflictingAllocation: true,
      },
      // Soft preference priorities
      preferences: {
        vipStatus: 'HIGH',
        previousRoom: 'HIGH',
        floorPreference: 'MEDIUM',
        bedPreference: 'HIGH',
        viewPreference: 'MEDIUM',
        hkReadiness: 'HIGH',
        roomFeatures: 'MEDIUM',
        groupProximity: 'MEDIUM',
        minimizeRoomChanges: 'HIGH',
      },
    };

    // Audit Trail Log (Single source of truth tracking)
    this.auditTrail = [
      {
        id: 'aud-1',
        resId: 'res-10471',
        resNumber: 'RES-10471',
        guestName: 'Robert Lang',
        previousRoom: null,
        newRoom: '201',
        operator: 'Swastik',
        timestamp: '10 Sep 2026 · 08:30',
        method: 'Manual Assignment',
      },
      {
        id: 'aud-2',
        resId: 'res-10472',
        resNumber: 'RES-10472',
        guestName: 'Anna Becker',
        previousRoom: null,
        newRoom: '202',
        operator: 'Swastik',
        timestamp: '10 Sep 2026 · 09:15',
        method: 'Smart Recommendation → Manual Confirmation',
      },
    ];

    // Load initial operational datasets
    this.reservations = this.generateInitialReservations();
    this.rooms = this.generateInitialRooms();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 1. DATA INITIALIZATION (OPERA Reference Dataset aligned to 10 Sep 2026)
  // ──────────────────────────────────────────────────────────────────────────
  generateInitialReservations() {
    return [
      {
        id: 'res-10482',
        resNumber: 'RES-10482',
        confCode: 'VOL-88291',
        guestName: 'Eta Thomas',
        vip: true,
        vipTier: 'Platinum VIP',
        stayDates: '10 Sep → 13 Sep',
        arrival: '10 Sep',
        departure: '13 Sep',
        nights: 3,
        roomType: 'Deluxe King',
        roomTypeCode: 'DKR',
        roomClass: 'DELUXE',
        assignedRoom: null, // Unassigned
        hkStatus: 'Clean',
        eta: '14:00',
        adults: 2,
        children: 0,
        status: 'UNASSIGNED',
        company: 'ABC Corporation',
        agent: 'Amex Corporate',
        groupName: null,
        blockCode: null,
        source: 'Direct',
        resType: 'Guaranteed',
        smoking: 'Non-Smoking',
        ratePlan: 'Corporate Best Flex',
        rate: 14500,
        preferences: ['High Floor', 'King Bed', 'Non-Smoking', 'City View'],
        specialRequests: 'Late arrival',
        previousRoom: '507',
        preferredRoom: '507',
      },
      {
        id: 'res-10483',
        resNumber: 'RES-10483',
        confCode: 'VOL-88292',
        guestName: 'Ehrke, Lyle',
        vip: false,
        vipTier: null,
        stayDates: '10 Sep → 12 Sep',
        arrival: '10 Sep',
        departure: '12 Sep',
        nights: 2,
        roomType: 'Deluxe King',
        roomTypeCode: 'DKR',
        roomClass: 'DELUXE',
        assignedRoom: null,
        hkStatus: 'Dirty',
        eta: '15:00',
        adults: 1,
        children: 0,
        status: 'UNASSIGNED',
        company: 'Merck Pharma',
        agent: 'Direct',
        groupName: 'ABC Conference',
        blockCode: 'SEP09-CORP',
        source: 'Direct Web',
        resType: 'Guaranteed',
        smoking: 'Non-Smoking',
        ratePlan: 'Group Convention Rate',
        rate: 12500,
        preferences: ['King Bed', 'Non-Smoking'],
        specialRequests: 'High speed LAN cable',
        previousRoom: null,
        preferredRoom: '',
      },
      {
        id: 'res-10484',
        resNumber: 'RES-10484',
        confCode: 'VOL-88293',
        guestName: 'Grant, Ginger',
        vip: false,
        vipTier: null,
        stayDates: '10 Sep → 13 Sep',
        arrival: '10 Sep',
        departure: '13 Sep',
        nights: 3,
        roomType: 'Deluxe King',
        roomTypeCode: 'DKR',
        roomClass: 'DELUXE',
        assignedRoom: null,
        hkStatus: 'Inspected',
        eta: '18:00',
        adults: 2,
        children: 0,
        status: 'UNASSIGNED',
        company: 'Vanguard Capital',
        agent: 'BCD Travel',
        groupName: 'ABC Conference',
        blockCode: 'SEP09-CORP',
        source: 'Corporate GDS',
        resType: 'Guaranteed',
        smoking: 'Non-Smoking',
        ratePlan: 'Convention Rate',
        rate: 12500,
        preferences: ['High Floor', 'City View', 'Non-Smoking'],
        specialRequests: 'Corner room preferred',
        previousRoom: '305',
        preferredRoom: '305',
      },
      {
        id: 'res-10485',
        resNumber: 'RES-10485',
        confCode: 'VOL-88294',
        guestName: 'Dr. Sarah Mitchell',
        vip: true,
        vipTier: 'Royal Diamond VIP',
        stayDates: '10 Sep → 15 Sep',
        arrival: '10 Sep',
        departure: '15 Sep',
        nights: 5,
        roomType: 'Executive Suite',
        roomTypeCode: 'EPS',
        roomClass: 'SUITES',
        assignedRoom: null,
        hkStatus: 'Clean',
        eta: '13:30', // Early arrival
        adults: 2,
        children: 0,
        status: 'UNASSIGNED',
        company: 'Vanguard Health Group',
        agent: 'Direct VIP Desk',
        groupName: null,
        blockCode: null,
        source: 'Direct VIP Protocol',
        resType: 'Guaranteed',
        smoking: 'Non-Smoking',
        ratePlan: 'Executive Suite Package',
        rate: 28000,
        preferences: ['High Floor', 'Panoramic Skyline', 'King Bed', 'Non-Smoking', 'Away from Elevator'],
        specialRequests: 'VIP protocol, GM welcome note',
        previousRoom: '401',
        preferredRoom: '401',
      },
      {
        id: 'res-10486',
        resNumber: 'RES-10486',
        confCode: 'VOL-88295',
        guestName: 'Vikram Malhotra',
        vip: true,
        vipTier: 'Gold VIP',
        stayDates: '10 Sep → 12 Sep',
        arrival: '10 Sep',
        departure: '12 Sep',
        nights: 2,
        roomType: 'Deluxe Ocean Suite',
        roomTypeCode: 'DOS',
        roomClass: 'SUITES',
        assignedRoom: null,
        hkStatus: 'Inspected',
        eta: '14:30',
        adults: 2,
        children: 1,
        status: 'UNASSIGNED',
        company: 'Reliance Global',
        agent: 'Direct',
        groupName: null,
        blockCode: null,
        source: 'Mobile App',
        resType: 'Guaranteed',
        smoking: 'Non-Smoking',
        ratePlan: 'Best Available Rate',
        rate: 22000,
        preferences: ['Ocean View', 'King Bed', 'Non-Smoking'],
        specialRequests: 'Extra bath amenities',
        previousRoom: null,
        preferredRoom: '206',
      },
      {
        id: 'res-10487',
        resNumber: 'RES-10487',
        confCode: 'VOL-88296',
        guestName: 'Carlos Ruiz',
        vip: false,
        vipTier: null,
        stayDates: '10 Sep → 11 Sep',
        arrival: '10 Sep',
        departure: '11 Sep',
        nights: 1,
        roomType: 'Classic King Room',
        roomTypeCode: 'CKR',
        roomClass: 'CLASSIC',
        assignedRoom: null,
        hkStatus: 'Clean',
        eta: '16:00',
        adults: 1,
        children: 0,
        status: 'UNASSIGNED',
        company: 'Iberia Consulting',
        agent: 'Booking.com',
        groupName: null,
        blockCode: null,
        source: 'OTA',
        resType: 'Non-Guaranteed',
        smoking: 'Non-Smoking',
        ratePlan: 'BAR Non-Refundable',
        rate: 9800,
        preferences: ['Low Floor', 'Away from Elevator'],
        specialRequests: 'Quiet room',
        previousRoom: null,
        preferredRoom: '',
      },
      {
        id: 'res-10488',
        resNumber: 'RES-10488',
        confCode: 'VOL-88297',
        guestName: 'Emma Watson',
        vip: true,
        vipTier: 'Platinum VIP',
        stayDates: '10 Sep → 16 Sep',
        arrival: '10 Sep',
        departure: '16 Sep',
        nights: 6,
        roomType: 'Executive Suite',
        roomTypeCode: 'EPS',
        roomClass: 'SUITES',
        assignedRoom: null,
        hkStatus: 'Inspected',
        eta: '13:00', // Early arrival
        adults: 2,
        children: 0,
        status: 'UNASSIGNED',
        company: 'Pinewood Studios',
        agent: 'CAA Global',
        groupName: null,
        blockCode: null,
        source: 'Private Agency',
        resType: 'Guaranteed',
        smoking: 'Non-Smoking',
        ratePlan: 'VIP Luxury Long Stay',
        rate: 31000,
        preferences: ['High Floor', 'Panoramic Skyline', 'King Bed', 'Away from Elevator'],
        specialRequests: 'Discrete privacy check-in required',
        previousRoom: '405',
        preferredRoom: '405',
      },
      {
        id: 'res-10489',
        resNumber: 'RES-10489',
        confCode: 'VOL-88298',
        guestName: 'Marcus Aurel',
        vip: false,
        vipTier: null,
        stayDates: '10 Sep → 13 Sep',
        arrival: '10 Sep',
        departure: '13 Sep',
        nights: 3,
        roomType: 'Classic King Room',
        roomTypeCode: 'CKR',
        roomClass: 'CLASSIC',
        assignedRoom: null,
        hkStatus: 'Clean',
        eta: '15:30',
        adults: 1,
        children: 0,
        status: 'UNASSIGNED',
        company: 'Deutsche Bank',
        agent: 'Navan Corporate',
        groupName: null,
        blockCode: null,
        source: 'Corporate Tool',
        resType: 'Guaranteed',
        smoking: 'Non-Smoking',
        ratePlan: 'Negotiated Corporate',
        rate: 9800,
        preferences: ['High Floor', 'King Bed'],
        specialRequests: 'Early breakfast voucher',
        previousRoom: null,
        preferredRoom: '301',
      },
      {
        id: 'res-10490',
        resNumber: 'RES-10490',
        confCode: 'VOL-88299',
        guestName: 'Kovacs, Laszlo',
        vip: false,
        vipTier: null,
        stayDates: '10 Sep → 14 Sep',
        arrival: '10 Sep',
        departure: '14 Sep',
        nights: 4,
        roomType: 'Deluxe King',
        roomTypeCode: 'DKR',
        roomClass: 'DELUXE',
        assignedRoom: null,
        hkStatus: 'Clean',
        eta: '17:00',
        adults: 2,
        children: 0,
        status: 'UNASSIGNED',
        company: 'ABC Corporation',
        agent: 'Direct',
        groupName: 'ABC Conference',
        blockCode: 'SEP09-CORP',
        source: 'Group Block Portal',
        resType: 'Guaranteed',
        smoking: 'Non-Smoking',
        ratePlan: 'Convention Rate',
        rate: 12500,
        preferences: ['Twin Beds', 'High Floor'],
        specialRequests: 'Twin bed setup confirmed',
        previousRoom: null,
        preferredRoom: '',
      },
      {
        id: 'res-10491',
        resNumber: 'RES-10491',
        confCode: 'VOL-88300',
        guestName: 'Chen, Wei',
        vip: false,
        vipTier: null,
        stayDates: '10 Sep → 12 Sep',
        arrival: '10 Sep',
        departure: '12 Sep',
        nights: 2,
        roomType: 'Deluxe King',
        roomTypeCode: 'DKR',
        roomClass: 'DELUXE',
        assignedRoom: null,
        hkStatus: 'Inspected',
        eta: '12:00', // Early arrival
        adults: 1,
        children: 0,
        status: 'UNASSIGNED',
        company: 'Huawei Tech',
        agent: 'Direct',
        groupName: 'ABC Conference',
        blockCode: 'SEP09-CORP',
        source: 'Corporate Direct',
        resType: 'Guaranteed',
        smoking: 'Non-Smoking',
        ratePlan: 'Convention Rate',
        rate: 12500,
        preferences: ['King Bed', 'City View'],
        specialRequests: 'Luggage drop at 11 AM',
        previousRoom: null,
        preferredRoom: '',
      },
      {
        id: 'res-10492',
        resNumber: 'RES-10492',
        confCode: 'VOL-88301',
        guestName: 'Dubois, Pierre',
        vip: false,
        vipTier: null,
        stayDates: '10 Sep → 13 Sep',
        arrival: '10 Sep',
        departure: '13 Sep',
        nights: 3,
        roomType: 'Classic King Room',
        roomTypeCode: 'CKR',
        roomClass: 'CLASSIC',
        assignedRoom: null,
        hkStatus: 'Clean',
        eta: '16:30',
        adults: 2,
        children: 0,
        status: 'UNASSIGNED',
        company: 'Accor Hospitality',
        agent: 'Direct Web',
        groupName: null,
        blockCode: null,
        source: 'Brand Direct',
        resType: 'Guaranteed',
        smoking: 'Non-Smoking',
        ratePlan: 'Standard BAR',
        rate: 9800,
        preferences: ['Courtyard View', 'Non-Smoking'],
        specialRequests: '',
        previousRoom: null,
        preferredRoom: '',
      },
      {
        id: 'res-10493',
        resNumber: 'RES-10493',
        confCode: 'VOL-88302',
        guestName: 'Svensson, Astrid',
        vip: false,
        vipTier: null,
        stayDates: '10 Sep → 15 Sep',
        arrival: '10 Sep',
        departure: '15 Sep',
        nights: 5,
        roomType: 'Deluxe King',
        roomTypeCode: 'DKR',
        roomClass: 'DELUXE',
        assignedRoom: null,
        hkStatus: 'Clean',
        eta: '14:00',
        adults: 2,
        children: 1,
        status: 'UNASSIGNED',
        company: 'IKEA Design Group',
        agent: 'Expedia Corporate',
        groupName: null,
        blockCode: null,
        source: 'OTA Corporate',
        resType: 'Guaranteed',
        smoking: 'Non-Smoking',
        ratePlan: 'BAR Deluxe',
        rate: 13200,
        preferences: ['Connecting Room', 'King Bed'],
        specialRequests: 'Connecting door if possible with family',
        previousRoom: null,
        preferredRoom: '',
      },
      {
        id: 'res-10494',
        resNumber: 'RES-10494',
        confCode: 'VOL-88303',
        guestName: 'O\'Connor, Liam',
        vip: false,
        vipTier: null,
        stayDates: '10 Sep → 12 Sep',
        arrival: '10 Sep',
        departure: '12 Sep',
        nights: 2,
        roomType: 'Classic King Room',
        roomTypeCode: 'CKR',
        roomClass: 'CLASSIC',
        assignedRoom: null,
        hkStatus: 'Dirty',
        eta: '18:30',
        adults: 1,
        children: 0,
        status: 'UNASSIGNED',
        company: 'Ryanair Tech',
        agent: 'Direct',
        groupName: null,
        blockCode: null,
        source: 'Direct Web',
        resType: 'Non-Guaranteed',
        smoking: 'Non-Smoking',
        ratePlan: 'Standard BAR',
        rate: 9800,
        preferences: ['Low Floor', 'Quiet Room'],
        specialRequests: '',
        previousRoom: null,
        preferredRoom: '',
      },
      {
        id: 'res-10495',
        resNumber: 'RES-10495',
        confCode: 'VOL-88304',
        guestName: 'Takahashi, Kenji',
        vip: false,
        vipTier: null,
        stayDates: '10 Sep → 14 Sep',
        arrival: '10 Sep',
        departure: '14 Sep',
        nights: 4,
        roomType: 'Deluxe King',
        roomTypeCode: 'DKR',
        roomClass: 'DELUXE',
        assignedRoom: null,
        hkStatus: 'Clean',
        eta: '12:30', // Early arrival
        adults: 1,
        children: 0,
        status: 'UNASSIGNED',
        company: 'Sony Interactive',
        agent: 'JTB Global',
        groupName: 'ABC Conference',
        blockCode: 'SEP09-CORP',
        source: 'Corporate GDS',
        resType: 'Guaranteed',
        smoking: 'Non-Smoking',
        ratePlan: 'Convention Rate',
        rate: 12500,
        preferences: ['High Floor', 'King Bed', 'Away from Elevator'],
        specialRequests: 'Green tea kit in room',
        previousRoom: null,
        preferredRoom: '',
      },

      // Sample already assigned reservations
      {
        id: 'res-10471',
        resNumber: 'RES-10471',
        confCode: 'VOL-88280',
        guestName: 'Robert Lang',
        vip: false,
        vipTier: null,
        stayDates: '10 Sep → 13 Sep',
        arrival: '10 Sep',
        departure: '13 Sep',
        nights: 3,
        roomType: 'Classic King Room',
        roomTypeCode: 'CKR',
        roomClass: 'CLASSIC',
        assignedRoom: '201',
        hkStatus: 'Clean',
        eta: '14:00',
        adults: 1,
        children: 0,
        status: 'ASSIGNED',
        company: 'Novartis',
        agent: 'Direct',
        groupName: null,
        blockCode: null,
        source: 'Direct Web',
        resType: 'Guaranteed',
        smoking: 'Non-Smoking',
        ratePlan: 'Corporate Standard',
        rate: 9800,
        preferences: ['Low Floor'],
        specialRequests: '',
        previousRoom: null,
        preferredRoom: '201',
      },
      {
        id: 'res-10472',
        resNumber: 'RES-10472',
        confCode: 'VOL-88281',
        guestName: 'Anna Becker',
        vip: false,
        vipTier: null,
        stayDates: '10 Sep → 12 Sep',
        arrival: '10 Sep',
        departure: '12 Sep',
        nights: 2,
        roomType: 'Classic King Room',
        roomTypeCode: 'CKR',
        roomClass: 'CLASSIC',
        assignedRoom: '202',
        hkStatus: 'Inspected',
        eta: '13:00',
        adults: 2,
        children: 0,
        status: 'CHECK_IN_READY',
        company: 'Siemens AG',
        agent: 'BCD Travel',
        groupName: null,
        blockCode: null,
        source: 'Corporate GDS',
        resType: 'Guaranteed',
        smoking: 'Non-Smoking',
        ratePlan: 'Corporate Negotiated',
        rate: 9800,
        preferences: ['King Bed', 'Non-Smoking'],
        specialRequests: '',
        previousRoom: null,
        preferredRoom: '202',
      },
    ];
  }

  generateInitialRooms() {
    return [
      // Floor 2
      {
        roomNumber: '201',
        floor: 2,
        roomType: 'Classic King Room',
        roomTypeCode: 'CKR',
        roomClass: 'CLASSIC',
        bedType: '1 King Bed',
        view: 'Courtyard View',
        hkStatus: 'CLEAN',
        occupancy: 'OCCUPIED',
        assignedTo: 'res-10471',
        capacity: 2,
        features: ['Low Floor', 'King Bed', 'Non-Smoking'],
        smoking: false,
        available: false,
        unavailableReason: 'Occupied by Robert Lang through 13 Sep',
      },
      {
        roomNumber: '202',
        floor: 2,
        roomType: 'Classic King Room',
        roomTypeCode: 'CKR',
        roomClass: 'CLASSIC',
        bedType: '1 King Bed',
        view: 'Garden View',
        hkStatus: 'INSPECTED',
        occupancy: 'OCCUPIED',
        assignedTo: 'res-10472',
        capacity: 2,
        features: ['Low Floor', 'King Bed', 'Non-Smoking', 'Near Elevator'],
        smoking: false,
        available: false,
        unavailableReason: 'Occupied by Anna Becker through 12 Sep',
      },
      {
        roomNumber: '203',
        floor: 2,
        roomType: 'Deluxe Ocean Suite',
        roomTypeCode: 'DOS',
        roomClass: 'SUITES',
        bedType: '1 King Bed + Living',
        view: 'Ocean View',
        hkStatus: 'DIRTY',
        occupancy: 'VACANT',
        assignedTo: null,
        capacity: 3,
        features: ['Ocean View', 'King Bed', 'Non-Smoking', 'Low Floor'],
        smoking: false,
        available: true,
        unavailableReason: null,
      },
      {
        roomNumber: '204',
        floor: 2,
        roomType: 'Deluxe King',
        roomTypeCode: 'DKR',
        roomClass: 'DELUXE',
        bedType: '1 King Bed',
        view: 'City View',
        hkStatus: 'DIRTY',
        occupancy: 'VACANT',
        assignedTo: null,
        capacity: 2,
        features: ['Low Floor', 'King Bed', 'Non-Smoking', 'City View'],
        smoking: false,
        available: false,
        unavailableReason: 'Not Ready - Room is Vacant but Dirty (HK Turnover Required)',
      },
      {
        roomNumber: '205',
        floor: 2,
        roomType: 'Classic King Room',
        roomTypeCode: 'CKR',
        roomClass: 'CLASSIC',
        bedType: '1 King Bed',
        view: 'Courtyard View',
        hkStatus: 'CLEAN',
        occupancy: 'VACANT',
        assignedTo: null,
        capacity: 2,
        features: ['Low Floor', 'King Bed', 'Non-Smoking', 'Courtyard View'],
        smoking: false,
        available: true,
        unavailableReason: null,
      },
      {
        roomNumber: '206',
        floor: 2,
        roomType: 'Deluxe Ocean Suite',
        roomTypeCode: 'DOS',
        roomClass: 'SUITES',
        bedType: '1 King Bed + Living',
        view: 'Ocean View',
        hkStatus: 'INSPECTED',
        occupancy: 'VACANT',
        assignedTo: null,
        capacity: 3,
        features: ['Ocean View', 'King Bed', 'Non-Smoking', 'Balcony'],
        smoking: false,
        available: true,
        unavailableReason: null,
      },

      // Floor 3
      {
        roomNumber: '301',
        floor: 3,
        roomType: 'Classic King Room',
        roomTypeCode: 'CKR',
        roomClass: 'CLASSIC',
        bedType: '1 King Bed',
        view: 'City View',
        hkStatus: 'CLEAN',
        occupancy: 'VACANT',
        assignedTo: null,
        capacity: 2,
        features: ['High Floor', 'King Bed', 'Non-Smoking', 'City View'],
        smoking: false,
        available: true,
        unavailableReason: null,
      },
      {
        roomNumber: '302',
        floor: 3,
        roomType: 'Classic King Room',
        roomTypeCode: 'CKR',
        roomClass: 'CLASSIC',
        bedType: '1 King Bed',
        view: 'Courtyard View',
        hkStatus: 'DIRTY',
        occupancy: 'VACANT',
        assignedTo: null,
        capacity: 2,
        features: ['King Bed', 'Non-Smoking', 'Courtyard View'],
        smoking: false,
        available: true,
        unavailableReason: null,
      },
      {
        roomNumber: '304',
        floor: 3,
        roomType: 'Classic King Room',
        roomTypeCode: 'CKR',
        roomClass: 'CLASSIC',
        bedType: '1 King Bed',
        view: 'Poolside View',
        hkStatus: 'INSPECTED',
        occupancy: 'VACANT',
        assignedTo: null,
        capacity: 2,
        features: ['King Bed', 'Non-Smoking', 'Poolside View'],
        smoking: false,
        available: true,
        unavailableReason: null,
      },
      {
        roomNumber: '305',
        floor: 3,
        roomType: 'Deluxe King',
        roomTypeCode: 'DKR',
        roomClass: 'DELUXE',
        bedType: '1 King Bed',
        view: 'Garden View',
        hkStatus: 'CLEAN',
        occupancy: 'VACANT',
        assignedTo: null,
        capacity: 2,
        features: ['Floor 3', 'King Bed', 'Non-Smoking', 'Garden View'],
        smoking: false,
        available: true,
        unavailableReason: null,
      },
      {
        roomNumber: '306',
        floor: 3,
        roomType: 'Deluxe King',
        roomTypeCode: 'DKR',
        roomClass: 'DELUXE',
        bedType: '2 Twin Beds',
        view: 'Garden View',
        hkStatus: 'CLEAN',
        occupancy: 'VACANT',
        assignedTo: null,
        capacity: 2,
        features: ['Twin Beds', 'Non-Smoking', 'Garden View'],
        smoking: false,
        available: true,
        unavailableReason: null,
      },

      // Floor 4
      {
        roomNumber: '401',
        floor: 4,
        roomType: 'Executive Suite',
        roomTypeCode: 'EPS',
        roomClass: 'SUITES',
        bedType: '1 King Bed + Lounge',
        view: 'Panoramic Skyline',
        hkStatus: 'CLEAN',
        occupancy: 'VACANT',
        assignedTo: null,
        capacity: 4,
        features: ['High Floor', 'Panoramic Skyline', 'King Bed', 'Non-Smoking', 'Away from Elevator'],
        smoking: false,
        available: true,
        unavailableReason: null,
      },
      {
        roomNumber: '402',
        floor: 4,
        roomType: 'Deluxe King',
        roomTypeCode: 'DKR',
        roomClass: 'DELUXE',
        bedType: '1 King Bed',
        view: 'Skyline View',
        hkStatus: 'OUT_OF_ORDER',
        occupancy: 'VACANT',
        assignedTo: null,
        capacity: 2,
        features: ['High Floor', 'King Bed', 'Non-Smoking'],
        smoking: false,
        available: false,
        unavailableReason: 'Room Out of Order: AC compressor overhaul (ETA 18:00)',
      },
      {
        roomNumber: '403',
        floor: 4,
        roomType: 'Deluxe King',
        roomTypeCode: 'DKR',
        roomClass: 'DELUXE',
        bedType: '1 King Bed',
        view: 'City View',
        hkStatus: 'DIRTY',
        occupancy: 'VACANT',
        assignedTo: null,
        capacity: 2,
        features: ['High Floor', 'King Bed', 'Non-Smoking', 'City View'],
        smoking: false,
        available: true,
        unavailableReason: null,
      },
      {
        roomNumber: '404',
        floor: 4,
        roomType: 'Deluxe King',
        roomTypeCode: 'DKR',
        roomClass: 'DELUXE',
        bedType: '1 King Bed',
        view: 'Courtyard View',
        hkStatus: 'PICKUP',
        occupancy: 'VACANT',
        assignedTo: null,
        capacity: 2,
        features: ['High Floor', 'King Bed', 'Non-Smoking'],
        smoking: false,
        available: true,
        unavailableReason: null,
      },
      {
        roomNumber: '405',
        floor: 4,
        roomType: 'Executive Suite',
        roomTypeCode: 'EPS',
        roomClass: 'SUITES',
        bedType: '1 King Bed + Lounge',
        view: 'Panoramic Skyline',
        hkStatus: 'INSPECTED',
        occupancy: 'VACANT',
        assignedTo: null,
        capacity: 4,
        features: ['High Floor', 'Panoramic Skyline', 'King Bed', 'Non-Smoking', 'Away from Elevator'],
        smoking: false,
        available: true,
        unavailableReason: null,
      },
      {
        roomNumber: '406',
        floor: 4,
        roomType: 'Executive Suite',
        roomTypeCode: 'EPS',
        roomClass: 'SUITES',
        bedType: '1 King Bed + Lounge',
        view: 'Panoramic Skyline',
        hkStatus: 'INSPECTED',
        occupancy: 'VACANT',
        assignedTo: null,
        capacity: 4,
        features: ['High Floor', 'Panoramic Skyline', 'King Bed', 'Non-Smoking'],
        smoking: false,
        available: true,
        unavailableReason: null,
      },

      // Floor 5 & 6 (Suites & Deluxe)
      {
        roomNumber: '501',
        floor: 5,
        roomType: 'Presidential Royal Penthouse',
        roomTypeCode: 'PRP',
        roomClass: 'SUITES',
        bedType: 'Master King + 2 Suites',
        view: '360 Panoramic Ocean & Skyline',
        hkStatus: 'INSPECTED',
        occupancy: 'OCCUPIED',
        assignedTo: 'res-501',
        capacity: 6,
        features: ['Penthouse', 'High Floor', 'Ocean View', 'Butler Protocol', 'Non-Smoking'],
        smoking: false,
        available: false,
        unavailableReason: 'Occupied by H.R.H. Sheikh Al-Sabah through 14 Sep',
      },
      {
        roomNumber: '502',
        floor: 5,
        roomType: 'Presidential Royal Penthouse',
        roomTypeCode: 'PRP',
        roomClass: 'SUITES',
        bedType: 'Master King + 2 Suites',
        view: '360 Panoramic Skyline',
        hkStatus: 'CLEAN',
        occupancy: 'VACANT',
        assignedTo: null,
        capacity: 6,
        features: ['Penthouse', 'High Floor', 'City View', 'Butler Protocol', 'Non-Smoking'],
        smoking: false,
        available: true,
        unavailableReason: null,
      },
      {
        roomNumber: '507',
        floor: 5,
        roomType: 'Deluxe King',
        roomTypeCode: 'DKR',
        roomClass: 'DELUXE',
        bedType: '1 King Bed',
        view: 'City View',
        hkStatus: 'INSPECTED',
        occupancy: 'VACANT',
        assignedTo: null,
        capacity: 2,
        features: ['High Floor', 'King Bed', 'Non-Smoking', 'City View', 'Away from Elevator'],
        smoking: false,
        available: true,
        unavailableReason: null,
      },
      {
        roomNumber: '508',
        floor: 5,
        roomType: 'Deluxe King',
        roomTypeCode: 'DKR',
        roomClass: 'DELUXE',
        bedType: '1 King Bed',
        view: 'City View',
        hkStatus: 'OUT_OF_SERVICE',
        occupancy: 'VACANT',
        assignedTo: null,
        capacity: 2,
        features: ['High Floor', 'King Bed', 'Non-Smoking'],
        smoking: false,
        available: false,
        unavailableReason: 'Room Out of Service (Deep Carpet Cleaning in progress)',
      },
      {
        roomNumber: '602',
        floor: 6,
        roomType: 'Deluxe King',
        roomTypeCode: 'DKR',
        roomClass: 'DELUXE',
        bedType: '1 King Bed',
        view: 'Skyline View',
        hkStatus: 'CLEAN',
        occupancy: 'VACANT',
        assignedTo: null,
        capacity: 2,
        features: ['High Floor', 'King Bed', 'Non-Smoking', 'City View'],
        smoking: false,
        available: true,
        unavailableReason: null,
      },
      {
        roomNumber: '101',
        floor: 1,
        roomType: 'Classic King Room',
        roomTypeCode: 'CKR',
        roomClass: 'CLASSIC',
        bedType: '1 King Bed',
        view: 'Courtyard Ground',
        hkStatus: 'CLEAN',
        occupancy: 'VACANT',
        assignedTo: null,
        capacity: 2,
        features: ['Ground Floor', 'Low Floor', 'King Bed', 'Non-Smoking', 'Accessible Room'],
        smoking: false,
        available: true,
        unavailableReason: null,
      },
    ];
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 2. LIFECYCLE & KEYBOARD SHORTCUTS
  // ──────────────────────────────────────────────────────────────────────────
  render() {
    const el = document.createElement('div');
    el.className = 'w-full flex flex-col gap-4 animate-fadeIn pb-16';
    this.container = el;

    this.renderContent();
    this.setupKeyboardShortcuts();

    return el;
  }

  destroy() {
    if (this.boundKeyHandler) {
      window.removeEventListener('keydown', this.boundKeyHandler);
      this.boundKeyHandler = null;
    }
    this.closeModal();
  }

  setupKeyboardShortcuts() {
    this.boundKeyHandler = (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target?.tagName)) {
        if (e.key === 'Escape') this.closeModal();
        return;
      }

      if (e.key === 'Escape') {
        this.closeModal();
      } else if (e.key === 'F5') {
        e.preventDefault();
        this.refreshData();
      } else if (e.key === 'a' || e.key === 'A') {
        const res = this.getSelectedReservation();
        if (res && !res.assignedRoom) {
          const topRoom = this.assignmentMode === 'SMART' 
            ? this.getSmartRecommendations(res)[0]?.room 
            : this.getEligibleRoomsForReservation(res)[0];
          if (topRoom) this.openAssignModal(res, topRoom, this.assignmentMode === 'SMART' ? 'Smart Recommendation' : 'Manual Assignment');
        }
      } else if (e.key === 'u' || e.key === 'U') {
        const res = this.getSelectedReservation();
        if (res && res.assignedRoom) this.openUnassignModal(res);
      } else if (e.key === 'e' || e.key === 'E') {
        const res = this.getSelectedReservation();
        if (res && res.assignedRoom) this.openExchangeModal(res);
      }
    };
    window.addEventListener('keydown', this.boundKeyHandler);
  }

  refreshData() {
    Toast.show('Refreshing room inventory & operational allocations...', 'info');
    setTimeout(() => {
      this.renderContent();
      Toast.show('Room Assignment telemetry synced.', 'success');
    }, 250);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 3. ELIGIBILITY VALIDATION ENGINE (Hard Rules)
  // ──────────────────────────────────────────────────────────────────────────
  checkRoomEligibility(room, reservation) {
    if (!room || !reservation) return { eligible: false, reasons: ['Missing room or reservation'] };

    const reasons = [];
    let eligible = true;

    // 1. Out of Order / Out of Service
    if (room.hkStatus === 'OUT_OF_ORDER') {
      eligible = false;
      reasons.push(room.unavailableReason || 'Room is Out of Order');
    }
    if (room.hkStatus === 'OUT_OF_SERVICE') {
      eligible = false;
      reasons.push(room.unavailableReason || 'Room is Out of Service');
    }

    // 2. Overlapping allocation / Occupied by another guest
    if (room.assignedTo && room.assignedTo !== reservation.id) {
      eligible = false;
      reasons.push(room.unavailableReason || `Occupied / Allocated to another reservation`);
    }

    // 3. Room Type Match
    const typeMatches = room.roomType === reservation.roomType || room.roomTypeCode === reservation.roomTypeCode;
    const classMatches = room.roomClass === reservation.roomClass;
    if (!typeMatches && !classMatches) {
      eligible = false;
      reasons.push(`Incompatible room type: Room is ${room.roomType}, reservation requires ${reservation.roomType}`);
    }

    // 4. Capacity
    const requiredGuests = (reservation.adults || 1) + (reservation.children || 0);
    if (room.capacity && room.capacity < requiredGuests) {
      eligible = false;
      reasons.push(`Insufficient capacity: Room accommodates ${room.capacity}, reservation has ${requiredGuests}`);
    }

    return { eligible, reasons };
  }

  getEligibleRoomsForReservation(reservation) {
    return this.rooms.filter((room) => this.checkRoomEligibility(room, reservation).eligible);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 4. SMART ASSIGNMENT SCORING ENGINE (Configurable Rules + "Why this room?")
  // ──────────────────────────────────────────────────────────────────────────
  getWeightMultiplier(priority) {
    switch (priority) {
      case 'VERY_HIGH': return 1.5;
      case 'HIGH': return 1.0;
      case 'MEDIUM': return 0.6;
      case 'LOW': return 0.3;
      case 'IGNORE': return 0.0;
      default: return 1.0;
    }
  }

  getSmartRecommendations(reservation) {
    if (!reservation) return [];

    const candidates = [];
    const prefs = this.smartRules.preferences;

    for (const room of this.rooms) {
      // 1. Hard Eligibility Check
      const eligibility = this.checkRoomEligibility(room, reservation);
      if (!eligibility.eligible) {
        continue; // Discard ineligible rooms completely from smart recommendations
      }

      let score = 0;
      const breakdown = [];

      // A. Correct Room Type (+20 base)
      if (room.roomType === reservation.roomType || room.roomTypeCode === reservation.roomTypeCode) {
        score += 20;
        breakdown.push({ label: 'Room Type Match', points: 20, matched: true, text: 'Correct room type' });
      } else {
        score += 10;
        breakdown.push({ label: 'Compatible Upgrade', points: 10, matched: true, text: `Compatible category (${room.roomType})` });
      }

      // B. Full Stay Availability (+20 base)
      score += 20;
      breakdown.push({ label: 'Full Stay Availability', points: 20, matched: true, text: 'Available for entire stay' });

      // C. Previous Room (+10 * weight)
      const prevRoomWeight = this.getWeightMultiplier(prefs.previousRoom);
      if (reservation.previousRoom && reservation.previousRoom === room.roomNumber) {
        const pts = Math.round(10 * prevRoomWeight);
        score += pts;
        breakdown.push({ label: 'Previous Room', points: pts, matched: true, text: `★ Guest previously stayed in Room ${room.roomNumber}` });
      } else if (reservation.previousRoom) {
        breakdown.push({ label: 'Previous Room', points: 0, matched: false, text: `△ Not previous room (Guest stayed in ${reservation.previousRoom})` });
      }

      // D. VIP Priority (+10 * weight)
      const vipWeight = this.getWeightMultiplier(prefs.vipStatus);
      if (reservation.vip) {
        const pts = Math.round(10 * vipWeight);
        score += pts;
        breakdown.push({ label: 'VIP Priority', points: pts, matched: true, text: 'VIP guest priority tier' });
      }

      // E. Floor Preference (+10 * weight)
      const floorWeight = this.getWeightMultiplier(prefs.floorPreference);
      const wantsHighFloor = (reservation.preferences || []).includes('High Floor');
      const wantsLowFloor = (reservation.preferences || []).includes('Low Floor');
      if (wantsHighFloor && room.floor >= 4) {
        const pts = Math.round(10 * floorWeight);
        score += pts;
        breakdown.push({ label: 'Floor Level', points: pts, matched: true, text: `Matches high-floor preference (Floor ${room.floor})` });
      } else if (wantsLowFloor && room.floor <= 2) {
        const pts = Math.round(10 * floorWeight);
        score += pts;
        breakdown.push({ label: 'Floor Level', points: pts, matched: true, text: `Matches low-floor preference (Floor ${room.floor})` });
      } else if (wantsHighFloor && room.floor < 4) {
        breakdown.push({ label: 'Floor Level', points: 0, matched: false, text: `Floor ${room.floor} (Guest prefers High Floor)` });
      }

      // F. Bedding Preference (+10 * weight)
      const bedWeight = this.getWeightMultiplier(prefs.bedPreference);
      const wantsKing = (reservation.preferences || []).includes('King Bed');
      const wantsTwin = (reservation.preferences || []).includes('Twin Beds');
      if (wantsKing && room.bedType.includes('King')) {
        const pts = Math.round(10 * bedWeight);
        score += pts;
        breakdown.push({ label: 'Bedding Setup', points: pts, matched: true, text: 'Matches king-bed preference' });
      } else if (wantsTwin && room.bedType.includes('Twin')) {
        const pts = Math.round(10 * bedWeight);
        score += pts;
        breakdown.push({ label: 'Bedding Setup', points: pts, matched: true, text: 'Matches twin-beds preference' });
      }

      // G. Non-Smoking (+10 * weight)
      if (reservation.smoking === 'Non-Smoking' && !room.smoking) {
        score += 10;
        breakdown.push({ label: 'Smoking Compliance', points: 10, matched: true, text: 'Non-smoking room verified' });
      }

      // H. Housekeeping Readiness (+10 * weight)
      const hkWeight = this.getWeightMultiplier(prefs.hkReadiness);
      if (room.hkStatus === 'INSPECTED') {
        const pts = Math.round(10 * hkWeight);
        score += pts;
        breakdown.push({ label: 'Housekeeping Readiness', points: pts, matched: true, text: 'Inspected and ready for immediate check-in' });
      } else if (room.hkStatus === 'CLEAN') {
        const pts = Math.round(7 * hkWeight);
        score += pts;
        breakdown.push({ label: 'Housekeeping Readiness', points: pts, matched: true, text: 'Clean room' });
      } else if (room.hkStatus === 'DIRTY') {
        breakdown.push({ label: 'Housekeeping Readiness', points: 0, matched: false, text: '● Dirty (housekeeping turnover required before check-in)' });
      }

      // I. View Preference (+5 * weight)
      const viewWeight = this.getWeightMultiplier(prefs.viewPreference);
      const hasViewPref = (reservation.preferences || []).some(p => p.includes('View'));
      if (hasViewPref) {
        const prefView = (reservation.preferences || []).find(p => p.includes('View'));
        if (room.view.includes(prefView.replace(' View', ''))) {
          const pts = Math.round(5 * viewWeight);
          score += pts;
          breakdown.push({ label: 'Preferred View', points: pts, matched: true, text: `Matches view preference (${room.view})` });
        }
      }

      // Clamp score to max 100
      const finalScore = Math.min(100, Math.max(50, score));

      candidates.push({
        room,
        score: finalScore,
        breakdown,
      });
    }

    return candidates.sort((a, b) => b.score - a.score);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 5. FILTERING & KPI COUNTERS
  // ──────────────────────────────────────────────────────────────────────────
  getOperationalCounters() {
    const unassignedCount = this.reservations.filter((r) => !r.assignedRoom).length;
    const assignedCount = this.reservations.filter((r) => !!r.assignedRoom).length;
    const vipArrivalsCount = this.reservations.filter((r) => r.vip && !r.assignedRoom).length;
    const earlyArrivalsCount = this.reservations.filter((r) => r.eta < '14:00' && !r.assignedRoom).length;
    const roomsAvailableCount = this.rooms.filter((r) => r.available && r.hkStatus !== 'OUT_OF_ORDER' && r.hkStatus !== 'OUT_OF_SERVICE').length;

    return {
      unassigned: unassignedCount,
      assigned: assignedCount,
      vipArrivals: vipArrivalsCount,
      earlyArrivals: earlyArrivalsCount,
      roomsAvailable: roomsAvailableCount,
    };
  }

  getFilteredReservations() {
    let list = [...this.reservations];

    // Search query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter((r) => {
        return (
          r.guestName.toLowerCase().includes(q) ||
          r.resNumber.toLowerCase().includes(q) ||
          r.confCode.toLowerCase().includes(q) ||
          (r.assignedRoom && r.assignedRoom.toLowerCase().includes(q)) ||
          (r.company && r.company.toLowerCase().includes(q)) ||
          (r.groupName && r.groupName.toLowerCase().includes(q))
        );
      });
    }

    // Primary Filters
    if (this.filterRoomType !== 'ALL') {
      list = list.filter((r) => r.roomType === this.filterRoomType || r.roomTypeCode === this.filterRoomType);
    }
    if (this.filterRoomClass !== 'ALL') {
      list = list.filter((r) => r.roomClass === this.filterRoomClass);
    }
    if (this.filterGroup !== 'ALL') {
      list = list.filter((r) => r.groupName === this.filterGroup);
    }
    if (this.filterBlock !== 'ALL') {
      list = list.filter((r) => r.blockCode === this.filterBlock);
    }
    if (this.filterVip === 'VIP_ONLY') {
      list = list.filter((r) => r.vip);
    } else if (this.filterVip === 'STANDARD') {
      list = list.filter((r) => !r.vip);
    }

    if (this.filterStatus === 'UNASSIGNED') {
      list = list.filter((r) => !r.assignedRoom);
    } else if (this.filterStatus === 'ASSIGNED') {
      list = list.filter((r) => !!r.assignedRoom);
    } else if (this.filterStatus === 'CHECK_IN_READY') {
      list = list.filter((r) => r.status === 'CHECK_IN_READY');
    }

    // Advanced Filters
    const adv = this.advancedFilters;
    if (adv.company !== 'ALL') list = list.filter((r) => r.company && r.company.includes(adv.company));
    if (adv.agent !== 'ALL') list = list.filter((r) => r.agent && r.agent.includes(adv.agent));
    if (adv.source !== 'ALL') list = list.filter((r) => r.source && r.source.includes(adv.source));
    if (adv.smoking !== 'ALL') list = list.filter((r) => r.smoking === adv.smoking);
    if (adv.features && adv.features.length > 0) {
      list = list.filter((r) => adv.features.every((f) => r.preferences.includes(f)));
    }

    // Sorting
    list.sort((a, b) => {
      if (this.sortBy === 'URGENCY') {
        if (a.vip !== b.vip) return a.vip ? -1 : 1;
        const aEarly = a.eta < '14:00';
        const bEarly = b.eta < '14:00';
        if (aEarly !== bEarly) return aEarly ? -1 : 1;
        const aUn = !a.assignedRoom;
        const bUn = !b.assignedRoom;
        if (aUn !== bUn) return aUn ? -1 : 1;
        return a.eta.localeCompare(b.eta);
      }
      if (this.sortBy === 'ETA') return a.eta.localeCompare(b.eta);
      if (this.sortBy === 'GUEST') return a.guestName.localeCompare(b.guestName);
      if (this.sortBy === 'ROOM_TYPE') return a.roomType.localeCompare(b.roomType);
      if (this.sortBy === 'STATUS') return a.status.localeCompare(b.status);
      return 0;
    });

    return list;
  }

  getSelectedReservation() {
    return this.reservations.find((r) => r.id === this.selectedReservationId) || this.reservations[0] || null;
  }

  getManualFilteredRooms(selectedRes) {
    return this.rooms.filter((room) => {
      if (this.manualFilterFloor !== 'ALL' && String(room.floor) !== String(this.manualFilterFloor)) return false;
      if (this.manualFilterType !== 'ALL' && room.roomType !== this.manualFilterType) return false;
      if (this.manualFilterHK !== 'ALL' && room.hkStatus !== this.manualFilterHK) return false;

      if (this.manualFilterAvailability === 'ELIGIBLE_ONLY' && selectedRes) {
        const eligibility = this.checkRoomEligibility(room, selectedRes);
        if (!eligibility.eligible) return false;
      }
      return true;
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 6. MAIN RENDER CONTENT
  // ──────────────────────────────────────────────────────────────────────────
  renderContent() {
    if (!this.container) return;

    const counters = this.getOperationalCounters();
    const filteredReservations = this.getFilteredReservations();
    const selectedRes = this.getSelectedReservation();
    const smartRecommendations = selectedRes ? this.getSmartRecommendations(selectedRes) : [];
    const manualRooms = selectedRes ? this.getManualFilteredRooms(selectedRes) : [];

    this.container.innerHTML = `
      <!-- ================================================================= -->
      <!-- 1. PAGE HEADER -->
      <!-- ================================================================= -->
      <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-outline-variant/60">
        <div>
          <div class="flex items-center gap-2">
            <span class="font-label-caps text-[11px] font-bold uppercase tracking-wider text-secondary">Front Desk Operations</span>
            <span class="text-outline-variant">•</span>
            <span class="font-data-mono text-[11px] text-on-surface-variant">OPERA Parity + Volvitech Smart Engine</span>
          </div>
          <h1 class="font-headline-lg text-2xl sm:text-3xl font-bold text-primary tracking-tight mt-0.5">ROOM ASSIGNMENT</h1>
          <p class="font-body-md text-xs text-on-surface-variant mt-1">Assign rooms manually or let Volvitech find the best match.</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- LIVE Telemetry Pill -->
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold font-data-mono border border-emerald-500/20 shadow-2xs">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>LIVE</span>
          </div>

          <!-- Refresh Button -->
          <button 
            id="btn-ra-refresh"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-outline-variant text-on-surface-variant hover:text-primary text-xs font-bold hover:bg-surface-container transition-all cursor-pointer shadow-2xs"
            title="Refresh operational allocations (F5)"
          >
            <span class="material-symbols-outlined text-[16px]">refresh</span>
            <span>Refresh</span>
          </button>

          <!-- Smart Assignment Rules Configuration Button -->
          <button 
            id="btn-smart-rules"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-primary/40 bg-primary/5 text-primary text-xs font-bold hover:bg-primary/10 transition-all cursor-pointer shadow-2xs"
            title="Configure hotel assignment rules and priority weights"
          >
            <span class="material-symbols-outlined text-[16px]">tune</span>
            <span>Smart Assignment Rules</span>
          </button>

          <!-- Audit Trail Button -->
          <button 
            id="btn-audit-trail"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-outline-variant text-on-surface-variant hover:text-primary text-xs font-semibold hover:bg-surface-container transition-all cursor-pointer shadow-2xs"
            title="View allocation audit history"
          >
            <span class="material-symbols-outlined text-[16px]">history</span>
            <span>Audit Trail</span>
          </button>
        </div>
      </header>

      <!-- ================================================================= -->
      <!-- 2. COMPACT OPERATIONAL COUNTERS (NOT giant dashboard cards) -->
      <!-- ================================================================= -->
      <section class="flex flex-wrap items-center gap-2 sm:gap-4 py-1.5 px-3 rounded-xl bg-surface-container-low/60 border border-outline-variant/60 text-xs">
        <div class="flex items-center gap-2">
          <span class="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase">UNASSIGNED:</span>
          <span class="font-data-mono font-black text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">${counters.unassigned}</span>
        </div>
        <span class="text-outline-variant">|</span>

        <div class="flex items-center gap-2">
          <span class="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase">ASSIGNED:</span>
          <span class="font-data-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">${counters.assigned}</span>
        </div>
        <span class="text-outline-variant">|</span>

        <div class="flex items-center gap-2">
          <span class="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase">VIP ARRIVALS:</span>
          <span class="font-data-mono font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">${counters.vipArrivals}</span>
        </div>
        <span class="text-outline-variant">|</span>

        <div class="flex items-center gap-2">
          <span class="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase">EARLY ARRIVALS:</span>
          <span class="font-data-mono font-black text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md">${counters.earlyArrivals}</span>
        </div>
        <span class="text-outline-variant">|</span>

        <div class="flex items-center gap-2">
          <span class="font-label-caps text-[11px] font-bold text-on-surface-variant uppercase">ROOMS AVAILABLE:</span>
          <span class="font-data-mono font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">${counters.roomsAvailable}</span>
        </div>

        <div class="ml-auto flex items-center gap-2">
          <button 
            id="btn-global-auto-assign"
            class="px-3 py-1 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
          >
            <span class="material-symbols-outlined text-[15px]">auto_awesome</span>
            <span>Auto Assign (${counters.unassigned})</span>
          </button>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- 3. ASSIGNMENT MODE SELECTOR ([ Manual Assignment ] [ Smart Assignment ]) -->
      <!-- ================================================================= -->
      <section class="flex items-center justify-between gap-4 p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/80 shadow-2xs">
        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mr-1">Assignment Mode:</span>
          <div class="inline-flex rounded-xl p-1 bg-surface-container-low border border-outline-variant/60 shadow-2xs">
            <button 
              id="mode-btn-manual"
              class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${this.assignmentMode === 'MANUAL' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-primary'}"
              title="Traditional OPERA-style workflow with manual room selection"
            >
              <span class="material-symbols-outlined text-[16px]">pan_tool</span>
              <span>Manual Assignment</span>
            </button>

            <button 
              id="mode-btn-smart"
              class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${this.assignmentMode === 'SMART' ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-primary'}"
              title="Volvitech rule-based room recommendations and match scoring"
            >
              <span class="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>Smart Assignment</span>
            </button>
          </div>
        </div>

        <div class="text-xs text-on-surface-variant hidden sm:flex items-center gap-2">
          <span class="material-symbols-outlined text-[16px] text-primary">info</span>
          <span>${this.assignmentMode === 'MANUAL' ? 'Manual mode: select and assign any eligible room directly.' : 'Smart mode: ranking rooms based on your hotel\'s active rules.'}</span>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- 4. MODERN SEARCH & OPERA FILTER BAR -->
      <!-- ================================================================= -->
      <section class="bg-surface-container-lowest rounded-2xl p-3.5 border border-outline-variant/80 shadow-xs flex flex-col gap-2.5">
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Date Filter -->
          <div class="flex items-center gap-1 rounded-xl border border-outline-variant bg-surface-bright px-2.5 py-1.5 shadow-2xs">
            <span class="material-symbols-outlined text-[16px] text-on-surface-variant">calendar_month</span>
            <select id="ra-date-select" class="bg-transparent text-primary font-bold text-xs cursor-pointer outline-none">
              <option value="10 Sep 2026" ${this.currentDate === '10 Sep 2026' ? 'selected' : ''}>10 Sep 2026</option>
              <option value="11 Sep 2026" ${this.currentDate === '11 Sep 2026' ? 'selected' : ''}>11 Sep 2026</option>
              <option value="12 Sep 2026" ${this.currentDate === '12 Sep 2026' ? 'selected' : ''}>12 Sep 2026</option>
            </select>
          </div>

          <!-- Guest / Reservation Search Input -->
          <div class="flex-1 min-w-[220px] relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[17px] text-on-surface-variant">search</span>
            <input 
              id="ra-search-input"
              type="text" 
              placeholder="Search guest, confirmation, room..." 
              value="${this.searchQuery}"
              class="w-full pl-8 pr-7 py-1.5 rounded-xl border border-outline-variant bg-surface-bright text-primary text-xs placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary shadow-2xs"
            />
            ${this.searchQuery ? `
              <button id="btn-clear-search" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary">
                <span class="material-symbols-outlined text-[15px]">close</span>
              </button>
            ` : ''}
          </div>

          <!-- Room Type -->
          <select id="ra-filter-room-type" class="px-2.5 py-1.5 rounded-xl border border-outline-variant bg-surface-bright text-primary font-semibold text-xs cursor-pointer shadow-2xs">
            <option value="ALL" ${this.filterRoomType === 'ALL' ? 'selected' : ''}>All Types</option>
            <option value="Deluxe King" ${this.filterRoomType === 'Deluxe King' ? 'selected' : ''}>Deluxe King</option>
            <option value="Classic King Room" ${this.filterRoomType === 'Classic King Room' ? 'selected' : ''}>Classic King</option>
            <option value="Deluxe Ocean Suite" ${this.filterRoomType === 'Deluxe Ocean Suite' ? 'selected' : ''}>Deluxe Ocean Suite</option>
            <option value="Executive Suite" ${this.filterRoomType === 'Executive Suite' ? 'selected' : ''}>Executive Suite</option>
          </select>

          <!-- Room Class -->
          <select id="ra-filter-room-class" class="px-2.5 py-1.5 rounded-xl border border-outline-variant bg-surface-bright text-primary font-semibold text-xs cursor-pointer shadow-2xs">
            <option value="ALL" ${this.filterRoomClass === 'ALL' ? 'selected' : ''}>All Classes</option>
            <option value="SUITES" ${this.filterRoomClass === 'SUITES' ? 'selected' : ''}>Suites</option>
            <option value="DELUXE" ${this.filterRoomClass === 'DELUXE' ? 'selected' : ''}>Deluxe</option>
            <option value="CLASSIC" ${this.filterRoomClass === 'CLASSIC' ? 'selected' : ''}>Classic</option>
          </select>

          <!-- Group -->
          <select id="ra-filter-group" class="px-2.5 py-1.5 rounded-xl border border-outline-variant bg-surface-bright text-primary font-semibold text-xs cursor-pointer shadow-2xs">
            <option value="ALL" ${this.filterGroup === 'ALL' ? 'selected' : ''}>All Groups</option>
            <option value="ABC Conference" ${this.filterGroup === 'ABC Conference' ? 'selected' : ''}>ABC Conference</option>
          </select>

          <!-- Block -->
          <select id="ra-filter-block" class="px-2.5 py-1.5 rounded-xl border border-outline-variant bg-surface-bright text-primary font-semibold text-xs cursor-pointer shadow-2xs">
            <option value="ALL" ${this.filterBlock === 'ALL' ? 'selected' : ''}>All Blocks</option>
            <option value="SEP09-CORP" ${this.filterBlock === 'SEP09-CORP' ? 'selected' : ''}>SEP09-CORP</option>
          </select>

          <!-- VIP -->
          <select id="ra-filter-vip" class="px-2.5 py-1.5 rounded-xl border border-outline-variant bg-surface-bright text-primary font-semibold text-xs cursor-pointer shadow-2xs">
            <option value="ALL" ${this.filterVip === 'ALL' ? 'selected' : ''}>All Guests</option>
            <option value="VIP_ONLY" ${this.filterVip === 'VIP_ONLY' ? 'selected' : ''}>★ VIP Only</option>
            <option value="STANDARD" ${this.filterVip === 'STANDARD' ? 'selected' : ''}>Standard</option>
          </select>

          <!-- Advanced Filters Button -->
          <button 
            id="btn-toggle-advanced-filters"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${this.hasActiveAdvancedFilters() ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-outline-variant text-on-surface-variant hover:text-primary hover:bg-surface-container'} text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <span class="material-symbols-outlined text-[16px]">tune</span>
            <span>Advanced Filters</span>
          </button>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- 5. MAIN WORKSPACE (RESERVATIONS QUEUE + CONTEXTUAL ROOM PANEL) -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        <!-- LEFT PANEL: RESERVATIONS (7 Cols) -->
        <div class="lg:col-span-7 flex flex-col gap-3">
          
          <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/80 shadow-xs overflow-hidden">
            
            <!-- Table Header Bar -->
            <div class="p-3.5 border-b border-outline-variant/60 flex flex-wrap items-center justify-between gap-3 bg-surface-container-low/40">
              <div class="flex items-center gap-2">
                <h2 class="font-headline-sm text-sm font-bold text-primary uppercase tracking-wider">
                  RESERVATIONS
                </h2>
                <span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-data-mono text-xs font-bold">
                  ${filteredReservations.length}
                </span>
              </div>

              <!-- Sorting & Status Filter -->
              <div class="flex items-center gap-2 text-xs">
                <select id="ra-sort-by" class="px-2 py-1 rounded-lg border border-outline-variant bg-surface-bright text-primary text-xs font-semibold cursor-pointer">
                  <option value="URGENCY" ${this.sortBy === 'URGENCY' ? 'selected' : ''}>Urgency (VIP & Early)</option>
                  <option value="ETA" ${this.sortBy === 'ETA' ? 'selected' : ''}>Arrival Time (ETA)</option>
                  <option value="GUEST" ${this.sortBy === 'GUEST' ? 'selected' : ''}>Guest Name</option>
                  <option value="STATUS" ${this.sortBy === 'STATUS' ? 'selected' : ''}>Status</option>
                </select>

                <select id="ra-filter-status" class="px-2 py-1 rounded-lg border border-outline-variant bg-surface-bright text-primary text-xs font-semibold cursor-pointer">
                  <option value="ALL" ${this.filterStatus === 'ALL' ? 'selected' : ''}>All</option>
                  <option value="UNASSIGNED" ${this.filterStatus === 'UNASSIGNED' ? 'selected' : ''}>Unassigned</option>
                  <option value="ASSIGNED" ${this.filterStatus === 'ASSIGNED' ? 'selected' : ''}>Assigned</option>
                </select>
              </div>
            </div>

            <!-- Group Proximity & Block Indicator (ABC Conference) -->
            <div class="px-4 py-2 bg-secondary-fixed/20 border-b border-secondary-fixed/40 flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px] text-secondary">groups</span>
                <span class="font-bold text-primary">ABC CONFERENCE</span>
                <span class="text-on-surface-variant">• 20 Rooms (14 Assigned, 6 Remaining)</span>
                <span class="px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-[10px]">
                  Same Floor Proximity Preferred
                </span>
              </div>
              <button id="btn-filter-group-block" class="text-[11px] font-bold text-secondary hover:underline cursor-pointer">
                View Group
              </button>
            </div>

            <!-- Multi-Select Bulk Actions Toolbar -->
            ${this.selectedReservationIds.size > 0 ? `
              <div class="px-4 py-2 bg-primary/10 border-b border-primary/20 flex items-center justify-between text-xs animate-fadeIn">
                <span class="font-bold text-primary">${this.selectedReservationIds.size} reservations selected</span>
                <div class="flex items-center gap-2">
                  <button id="btn-bulk-smart-assign" class="px-3 py-1 rounded-lg bg-primary text-on-primary font-bold text-xs hover:bg-primary/90 cursor-pointer shadow-2xs">
                    Smart Assign
                  </button>
                  <button id="btn-bulk-auto-assign" class="px-3 py-1 rounded-lg border border-primary text-primary font-bold text-xs hover:bg-primary/10 cursor-pointer">
                    Auto Assign
                  </button>
                  <button id="btn-clear-selection" class="px-2.5 py-1 rounded-lg border border-outline-variant text-on-surface-variant hover:text-primary font-semibold text-xs cursor-pointer">
                    Clear
                  </button>
                </div>
              </div>
            ` : ''}

            <!-- Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-outline-variant/60 bg-surface-container-lowest text-on-surface-variant font-label-caps text-[11px] font-bold">
                    <th class="py-2.5 px-3 w-8">
                      <input type="checkbox" id="ra-select-all" class="rounded cursor-pointer" ${this.selectedReservationIds.size === filteredReservations.length && filteredReservations.length > 0 ? 'checked' : ''} />
                    </th>
                    <th class="py-2.5 px-2">Guest</th>
                    <th class="py-2.5 px-2">Arrival</th>
                    <th class="py-2.5 px-2">Departure</th>
                    <th class="py-2.5 px-2">Room Type</th>
                    <th class="py-2.5 px-2">Room</th>
                    <th class="py-2.5 px-2">HK Status</th>
                    <th class="py-2.5 px-2">ETA</th>
                    <th class="py-2.5 px-2 text-center">Ad</th>
                    <th class="py-2.5 px-2 text-center">Ch</th>
                    <th class="py-2.5 px-2 text-center">VIP</th>
                    <th class="py-2.5 px-3 text-right">Assignment Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-outline-variant/30">
                  ${filteredReservations.length === 0 ? `
                    <tr>
                      <td colspan="12" class="py-12 text-center text-on-surface-variant">
                        <span class="material-symbols-outlined text-4xl text-outline mb-1">search_off</span>
                        <p class="font-bold text-primary">No reservations match your filters.</p>
                      </td>
                    </tr>
                  ` : filteredReservations.map((r) => {
                    const isSelected = selectedRes && selectedRes.id === r.id;
                    const isChecked = this.selectedReservationIds.has(r.id);

                    return `
                      <tr 
                        data-res-id="${r.id}"
                        class="cursor-pointer transition-colors hover:bg-surface-container/60 ${isSelected ? 'bg-primary/5 font-medium border-l-4 border-primary' : ''}"
                      >
                        <td class="py-2.5 px-3 w-8" onclick="event.stopPropagation()">
                          <input 
                            type="checkbox" 
                            class="ra-row-checkbox rounded cursor-pointer" 
                            data-res-id="${r.id}" 
                            ${isChecked ? 'checked' : ''} 
                          />
                        </td>
                        <td class="py-2.5 px-2">
                          <div class="font-bold text-primary">${r.guestName}</div>
                          <div class="text-[10px] text-on-surface-variant font-data-mono">${r.resNumber}</div>
                        </td>
                        <td class="py-2.5 px-2 whitespace-nowrap">${r.arrival}</td>
                        <td class="py-2.5 px-2 whitespace-nowrap">${r.departure}</td>
                        <td class="py-2.5 px-2 whitespace-nowrap">
                          <span class="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-semibold">
                            ${r.roomType}
                          </span>
                        </td>
                        <td class="py-2.5 px-2 whitespace-nowrap font-data-mono font-bold">
                          ${r.assignedRoom ? `
                            <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                              ${r.assignedRoom}
                            </span>
                          ` : `
                            <span class="text-rose-500 font-bold">—</span>
                          `}
                        </td>
                        <td class="py-2.5 px-2 whitespace-nowrap">
                          ${this.renderHousekeepingBadge(r.hkStatus)}
                        </td>
                        <td class="py-2.5 px-2 whitespace-nowrap font-data-mono">
                          ${r.eta}
                        </td>
                        <td class="py-2.5 px-2 text-center font-data-mono">${r.adults}</td>
                        <td class="py-2.5 px-2 text-center font-data-mono">${r.children}</td>
                        <td class="py-2.5 px-2 text-center whitespace-nowrap">
                          ${r.vip ? `<span class="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[10px]">★ VIP</span>` : '—'}
                        </td>
                        <td class="py-2.5 px-3 text-right whitespace-nowrap">
                          ${r.assignedRoom ? `
                            <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase">
                              Assigned
                            </span>
                          ` : `
                            <span class="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase">
                              Unassigned
                            </span>
                          `}
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>

            <!-- Table Footer -->
            <div class="px-4 py-2 bg-surface-container-lowest border-t border-outline-variant/60 flex items-center justify-between text-[11px] text-on-surface-variant">
              <span>Showing <strong>${filteredReservations.length}</strong> of ${this.reservations.length} reservations</span>
              <span>Click a row to select reservation & review rooms</span>
            </div>

          </div>

        </div>

        <!-- RIGHT PANEL: CONTEXTUAL DETAILS & ROOM ASSIGNMENT WORKSPACE (5 Cols) -->
        <div class="lg:col-span-5 flex flex-col gap-3">
          
          ${selectedRes ? `
            <!-- Contextual Reservation Details Card -->
            <div class="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/80 shadow-xs flex flex-col gap-3">
              
              <!-- Guest Header -->
              <div class="flex items-start justify-between gap-3 pb-2.5 border-b border-outline-variant/60">
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="font-headline-sm text-base font-bold text-primary uppercase tracking-tight">${selectedRes.guestName}</h3>
                    ${selectedRes.vip ? `
                      <span class="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
                        ★ VIP
                      </span>
                    ` : ''}
                  </div>
                  <div class="flex items-center gap-2 mt-0.5 text-xs text-on-surface-variant font-data-mono">
                    <span>${selectedRes.resNumber}</span>
                    <span>•</span>
                    <span>${selectedRes.confCode}</span>
                  </div>
                </div>

                <div class="text-right">
                  <span class="text-[10px] uppercase font-bold text-on-surface-variant block">Assigned Room</span>
                  ${selectedRes.assignedRoom ? `
                    <span class="font-data-mono text-xl font-bold text-emerald-600 dark:text-emerald-400">${selectedRes.assignedRoom}</span>
                  ` : `
                    <span class="text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md">UNASSIGNED</span>
                  `}
                </div>
              </div>

              <!-- Reservation Quick Specs -->
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="p-2 rounded-xl bg-surface-container-low/50 border border-outline-variant/40">
                  <span class="text-[10px] uppercase font-bold text-on-surface-variant block">Stay</span>
                  <span class="font-bold text-primary mt-0.5 block">${selectedRes.stayDates}</span>
                  <span class="text-[10px] text-on-surface-variant">ETA ${selectedRes.eta} · Dep ${selectedRes.departure}</span>
                </div>

                <div class="p-2 rounded-xl bg-surface-container-low/50 border border-outline-variant/40">
                  <span class="text-[10px] uppercase font-bold text-on-surface-variant block">Booked Room Type</span>
                  <span class="font-bold text-primary mt-0.5 block">${selectedRes.roomType}</span>
                  <span class="text-[10px] text-on-surface-variant font-data-mono">${selectedRes.adults} Adults${selectedRes.children ? `, ${selectedRes.children} Child` : ''}</span>
                </div>

                ${selectedRes.company ? `
                  <div class="p-2 rounded-xl bg-surface-container-low/50 border border-outline-variant/40 col-span-2 flex items-center justify-between">
                    <div>
                      <span class="text-[10px] uppercase font-bold text-on-surface-variant block">Company & Source</span>
                      <span class="font-semibold text-primary">${selectedRes.company}</span>
                    </div>
                    <span class="text-[10px] text-on-surface-variant font-data-mono">${selectedRes.source}</span>
                  </div>
                ` : ''}
              </div>

              <!-- Preferences & Special Requests -->
              <div class="flex flex-col gap-1.5 pt-1 text-xs">
                <span class="font-label-caps text-[10px] font-bold text-on-surface-variant uppercase">Preferences:</span>
                <div class="flex flex-wrap gap-1.5">
                  ${(selectedRes.preferences || []).map(p => `
                    <span class="px-2 py-0.5 rounded bg-surface-container border border-outline-variant/70 text-primary text-[11px] font-semibold flex items-center gap-1">
                      <span class="text-emerald-500 font-bold">✓</span>
                      <span>${p}</span>
                    </span>
                  `).join('')}
                </div>

                ${selectedRes.specialRequests ? `
                  <div class="mt-1 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                    <span class="text-[10px] font-bold uppercase text-amber-800 dark:text-amber-300 block mb-0.5">Special Requests:</span>
                    <p class="text-amber-900 dark:text-amber-200 text-xs italic">"${selectedRes.specialRequests}"</p>
                  </div>
                ` : ''}

                <!-- Previous Room Boost Indicator -->
                ${selectedRes.previousRoom ? `
                  <div class="mt-1 flex items-center justify-between p-2 rounded-xl bg-primary/5 border border-primary/20 text-xs">
                    <div>
                      <span class="text-[10px] font-bold uppercase text-primary block">★ Previous Room</span>
                      <span class="font-bold text-primary">Room ${selectedRes.previousRoom}</span>
                      <span class="text-[10px] text-on-surface-variant ml-1.5">(Guest previously stayed in Room ${selectedRes.previousRoom})</span>
                    </div>
                    <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                      ✓ Available & Compatible
                    </span>
                  </div>
                ` : ''}
              </div>

              <!-- Contextual Action Buttons -->
              <div class="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-outline-variant/60">
                <div class="flex items-center gap-1.5">
                  <button id="btn-view-profile" class="px-2.5 py-1 rounded-lg border border-outline-variant text-on-surface-variant hover:text-primary text-xs font-semibold cursor-pointer">
                    Profile
                  </button>
                  <button id="btn-view-reservation" class="px-2.5 py-1 rounded-lg border border-outline-variant text-on-surface-variant hover:text-primary text-xs font-semibold cursor-pointer">
                    Reservation
                  </button>
                  <button id="btn-view-history" class="px-2.5 py-1 rounded-lg border border-outline-variant text-on-surface-variant hover:text-primary text-xs font-semibold cursor-pointer">
                    View Guest History
                  </button>
                </div>

                <div class="flex items-center gap-2">
                  ${selectedRes.assignedRoom ? `
                    <button id="btn-exchange-room" class="px-3 py-1 rounded-xl border border-primary text-primary hover:bg-primary/10 text-xs font-bold transition-all cursor-pointer">
                      Exchange
                    </button>
                    <button id="btn-unassign-room" class="px-3 py-1 rounded-xl border border-rose-500/40 text-rose-600 hover:bg-rose-500/10 text-xs font-bold transition-all cursor-pointer">
                      Unassign
                    </button>
                    <button id="btn-proceed-checkin" class="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs">
                      Check In
                    </button>
                  ` : ''}
                </div>
              </div>

            </div>

            <!-- Dynamic Room Selector Area (Switches based on this.assignmentMode) -->
            ${this.assignmentMode === 'SMART' ? `
              <!-- ========================================================= -->
              <!-- SMART ASSIGNMENT MODE PANEL -->
              <!-- ========================================================= -->
              <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/80 shadow-xs p-4 flex flex-col gap-3">
                <div class="flex items-center justify-between pb-2 border-b border-outline-variant/60">
                  <div>
                    <h3 class="font-headline-sm text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-[18px] text-primary">auto_awesome</span>
                      <span>SMART ROOM RECOMMENDATIONS</span>
                    </h3>
                    <p class="text-[11px] text-on-surface-variant mt-0.5">Rooms are ranked using your hotel's assignment rules.</p>
                  </div>
                  <button id="btn-open-rules-sub" class="text-[11px] font-bold text-primary hover:underline cursor-pointer">
                    Edit Rules
                  </button>
                </div>

                <!-- Recommendation Cards -->
                <div class="flex flex-col gap-3">
                  ${smartRecommendations.length === 0 ? `
                    <div class="py-8 text-center text-on-surface-variant text-xs">
                      <span class="material-symbols-outlined text-3xl text-outline mb-1">warning</span>
                      <p class="font-bold text-primary">No eligible rooms match hard rules</p>
                    </div>
                  ` : smartRecommendations.slice(0, 3).map((rec) => {
                    const room = rec.room;
                    const isPreviousRoom = selectedRes.previousRoom === room.roomNumber;
                    const isCurrentAssigned = selectedRes.assignedRoom === room.roomNumber;

                    return `
                      <div class="p-3.5 rounded-xl border ${rec.score >= 90 ? 'border-primary/50 bg-primary/5' : 'border-outline-variant/70 bg-surface-container-lowest'} shadow-2xs flex flex-col gap-2">
                        
                        <!-- Room & Score Header -->
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-2">
                            <span class="font-data-mono font-black text-lg text-primary">ROOM ${room.roomNumber}</span>
                            <span class="px-2 py-0.5 rounded-full ${rec.score >= 90 ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold' : 'bg-primary/10 text-primary font-bold'} text-xs font-data-mono">
                              ${rec.score}% MATCH
                            </span>
                            ${isPreviousRoom ? `
                              <span class="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold text-[10px] uppercase">
                                ★ Previous Room
                              </span>
                            ` : ''}
                          </div>

                          <div class="flex items-center gap-1.5">
                            ${this.renderHousekeepingBadge(room.hkStatus)}
                          </div>
                        </div>

                        <!-- Room Specs -->
                        <div class="text-xs text-on-surface-variant">
                          <span class="font-bold text-primary">${room.roomType}</span> · Floor ${room.floor} · ${room.view}
                        </div>

                        <!-- Factor Badges -->
                        <div class="flex flex-wrap gap-1 text-[11px]">
                          ${rec.breakdown.filter(b => b.matched).map(b => `
                            <span class="px-2 py-0.5 rounded bg-surface-container text-on-surface text-[10px] font-semibold">
                              ✓ ${b.label}
                            </span>
                          `).join('')}
                        </div>

                        <!-- Actions: Assign & Why this room? -->
                        <div class="flex items-center justify-between pt-1 border-t border-outline-variant/40 mt-1">
                          <button 
                            class="btn-why-this-room text-primary text-xs font-bold hover:underline cursor-pointer flex items-center gap-1"
                            data-room-number="${room.roomNumber}"
                          >
                            <span class="material-symbols-outlined text-[15px]">help_outline</span>
                            <span>Why this room?</span>
                          </button>

                          ${isCurrentAssigned ? `
                            <span class="px-3 py-1 rounded-xl bg-surface-container text-on-surface-variant text-xs font-bold">Assigned</span>
                          ` : `
                            <button 
                              class="btn-smart-assign-execute px-4 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer shadow-2xs"
                              data-room-number="${room.roomNumber}"
                            >
                              Assign
                            </button>
                          `}
                        </div>

                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            ` : `
              <!-- ========================================================= -->
              <!-- MANUAL ASSIGNMENT MODE PANEL (Traditional OPERA Workflow) -->
              <!-- ========================================================= -->
              <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/80 shadow-xs p-4 flex flex-col gap-3">
                <div class="flex items-center justify-between pb-2 border-b border-outline-variant/60">
                  <div>
                    <h3 class="font-headline-sm text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-[18px] text-primary">meeting_room</span>
                      <span>AVAILABLE ROOMS</span>
                    </h3>
                    <p class="text-[11px] text-on-surface-variant mt-0.5">Select and assign any eligible room.</p>
                  </div>

                  <!-- Quick Filter: All vs Eligible Only -->
                  <div class="flex items-center gap-1.5 text-xs">
                    <select id="manual-filter-avail" class="px-2 py-1 rounded-lg border border-outline-variant bg-surface-bright text-xs font-semibold cursor-pointer">
                      <option value="ALL" ${this.manualFilterAvailability === 'ALL' ? 'selected' : ''}>Show All Rooms</option>
                      <option value="ELIGIBLE_ONLY" ${this.manualFilterAvailability === 'ELIGIBLE_ONLY' ? 'selected' : ''}>Eligible Only</option>
                    </select>
                  </div>
                </div>

                <!-- Secondary Filters for Floor & HK -->
                <div class="flex flex-wrap items-center gap-2 text-xs pb-1 border-b border-outline-variant/40">
                  <select id="manual-filter-floor" class="px-2 py-1 rounded-lg border border-outline-variant bg-surface-bright text-xs font-semibold cursor-pointer">
                    <option value="ALL" ${this.manualFilterFloor === 'ALL' ? 'selected' : ''}>All Floors</option>
                    <option value="2" ${this.manualFilterFloor === '2' ? 'selected' : ''}>Floor 2</option>
                    <option value="3" ${this.manualFilterFloor === '3' ? 'selected' : ''}>Floor 3</option>
                    <option value="4" ${this.manualFilterFloor === '4' ? 'selected' : ''}>Floor 4</option>
                    <option value="5" ${this.manualFilterFloor === '5' ? 'selected' : ''}>Floor 5</option>
                    <option value="6" ${this.manualFilterFloor === '6' ? 'selected' : ''}>Floor 6</option>
                  </select>

                  <select id="manual-filter-type" class="px-2 py-1 rounded-lg border border-outline-variant bg-surface-bright text-xs font-semibold cursor-pointer">
                    <option value="ALL" ${this.manualFilterType === 'ALL' ? 'selected' : ''}>All Room Types</option>
                    <option value="Deluxe King" ${this.manualFilterType === 'Deluxe King' ? 'selected' : ''}>Deluxe King</option>
                    <option value="Classic King Room" ${this.manualFilterType === 'Classic King Room' ? 'selected' : ''}>Classic King</option>
                    <option value="Deluxe Ocean Suite" ${this.manualFilterType === 'Deluxe Ocean Suite' ? 'selected' : ''}>Deluxe Ocean Suite</option>
                  </select>

                  <select id="manual-filter-hk" class="px-2 py-1 rounded-lg border border-outline-variant bg-surface-bright text-xs font-semibold cursor-pointer">
                    <option value="ALL" ${this.manualFilterHK === 'ALL' ? 'selected' : ''}>All HK Status</option>
                    <option value="CLEAN" ${this.manualFilterHK === 'CLEAN' ? 'selected' : ''}>Clean</option>
                    <option value="INSPECTED" ${this.manualFilterHK === 'INSPECTED' ? 'selected' : ''}>Inspected</option>
                    <option value="DIRTY" ${this.manualFilterHK === 'DIRTY' ? 'selected' : ''}>Dirty</option>
                  </select>
                </div>

                <!-- Available Rooms List -->
                <div class="flex flex-col gap-2.5 max-h-[500px] overflow-y-auto pr-1">
                  ${manualRooms.map((room) => {
                    const eligibility = this.checkRoomEligibility(room, selectedRes);
                    const isCurrentAssigned = selectedRes.assignedRoom === room.roomNumber;
                    const isPreviousRoom = selectedRes.previousRoom === room.roomNumber;

                    return `
                      <div class="p-3 rounded-xl border ${eligibility.eligible ? 'border-outline-variant/80 bg-surface-container-lowest' : 'border-outline-variant/50 bg-surface-container-low/40 opacity-75'} shadow-2xs flex flex-col gap-2 text-xs">
                        
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-2">
                            <span class="font-data-mono font-bold text-base text-primary">ROOM ${room.roomNumber}</span>
                            <span class="font-semibold text-primary">${room.roomType}</span>
                            <span class="text-[10px] text-on-surface-variant font-data-mono">Floor ${room.floor}</span>
                            ${isPreviousRoom ? `<span class="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 font-bold text-[10px]">★ Previous Room</span>` : ''}
                          </div>

                          <div class="flex items-center gap-1.5">
                            ${this.renderHousekeepingBadge(room.hkStatus)}
                          </div>
                        </div>

                        <!-- Availability & Features -->
                        <div class="flex flex-wrap items-center justify-between text-[11px] text-on-surface-variant">
                          <div class="flex items-center gap-1.5">
                            ${eligibility.eligible ? `
                              <span class="text-emerald-600 font-bold">✓ Available for entire stay</span>
                            ` : `
                              <span class="text-rose-600 font-bold flex items-center gap-1">
                                <span>⚠ NOT ELIGIBLE:</span>
                                <span>${eligibility.reasons[0]}</span>
                              </span>
                            `}
                          </div>
                          <span>${room.bedType}</span>
                        </div>

                        <!-- Features line -->
                        <div class="text-[10px] text-on-surface-variant truncate">
                          ${room.features.join(' · ')}
                        </div>

                        <!-- Action Button -->
                        <div class="flex items-center justify-between pt-1 border-t border-outline-variant/30">
                          <span class="text-[10px] text-on-surface-variant">
                            ${room.hkStatus === 'DIRTY' ? '⚠ Housekeeping required before check-in' : '✓ Ready for allocation'}
                          </span>

                          ${isCurrentAssigned ? `
                            <span class="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 font-bold text-xs">Assigned</span>
                          ` : eligibility.eligible ? `
                            <button 
                              class="btn-manual-assign-execute px-4 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 transition-all cursor-pointer shadow-2xs"
                              data-room-number="${room.roomNumber}"
                            >
                              Assign
                            </button>
                          ` : `
                            <button 
                              disabled 
                              class="px-3 py-1 rounded-xl bg-surface-container text-on-surface-variant text-xs font-bold cursor-not-allowed opacity-60"
                              title="${eligibility.reasons.join('; ')}"
                            >
                              Blocked
                            </button>
                          `}
                        </div>

                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `}
          ` : `
            <div class="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/80 shadow-xs flex flex-col items-center justify-center text-center">
              <span class="material-symbols-outlined text-4xl text-outline mb-2">hotel</span>
              <h3 class="font-headline-sm text-base font-bold text-primary">Select a Reservation</h3>
              <p class="text-xs text-on-surface-variant max-w-sm mt-1">
                Choose any reservation from the queue to view requirements and assign rooms.
              </p>
            </div>
          `}

        </div>

      </section>
    `;

    this.bindEvents();
  }

  // Helper for Housekeeping Badges
  renderHousekeepingBadge(hkStatus) {
    const s = String(hkStatus || '').toUpperCase();
    if (s === 'CLEAN') return `<span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400"><span>✓</span><span>Clean</span></span>`;
    if (s === 'INSPECTED') return `<span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300"><span>✓</span><span>Inspected</span></span>`;
    if (s === 'DIRTY') return `<span class="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400"><span>●</span><span>Dirty</span></span>`;
    if (s === 'PICKUP') return `<span class="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 dark:text-sky-400"><span>◷</span><span>Pickup</span></span>`;
    if (s === 'OUT_OF_ORDER') return `<span class="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400"><span>⚠</span><span>Out of Order</span></span>`;
    if (s === 'OUT_OF_SERVICE') return `<span class="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400"><span>⊘</span><span>Out of Service</span></span>`;
    return `<span class="text-[11px] text-on-surface-variant">${hkStatus}</span>`;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 7. EVENT BINDINGS
  // ──────────────────────────────────────────────────────────────────────────
  bindEvents() {
    if (!this.container) return;

    // Refresh
    const refreshBtn = this.container.querySelector('#btn-ra-refresh');
    if (refreshBtn) refreshBtn.onclick = () => this.refreshData();

    // Smart Rules Modal
    const smartRulesBtn = this.container.querySelector('#btn-smart-rules');
    if (smartRulesBtn) smartRulesBtn.onclick = () => this.openSmartRulesModal();

    const subRulesBtn = this.container.querySelector('#btn-open-rules-sub');
    if (subRulesBtn) subRulesBtn.onclick = () => this.openSmartRulesModal();

    // Audit Trail Modal
    const auditBtn = this.container.querySelector('#btn-audit-trail');
    if (auditBtn) auditBtn.onclick = () => this.openAuditTrailModal();

    // Global Auto Assign
    const globalAutoBtn = this.container.querySelector('#btn-global-auto-assign');
    if (globalAutoBtn) globalAutoBtn.onclick = () => this.openAutoAssignPreviewModal();

    // Assignment Mode Switcher
    const manualModeBtn = this.container.querySelector('#mode-btn-manual');
    if (manualModeBtn) {
      manualModeBtn.onclick = () => {
        this.assignmentMode = 'MANUAL';
        this.renderContent();
        Toast.show('Switched to Manual Assignment mode', 'info');
      };
    }

    const smartModeBtn = this.container.querySelector('#mode-btn-smart');
    if (smartModeBtn) {
      smartModeBtn.onclick = () => {
        this.assignmentMode = 'SMART';
        this.renderContent();
        Toast.show('Switched to Volvitech Smart Assignment mode', 'info');
      };
    }

    // Search Input
    const searchInput = this.container.querySelector('#ra-search-input');
    if (searchInput) {
      searchInput.oninput = (e) => {
        this.searchQuery = e.target.value;
        this.renderContent();
      };
    }

    const clearSearchBtn = this.container.querySelector('#btn-clear-search');
    if (clearSearchBtn) {
      clearSearchBtn.onclick = () => {
        this.searchQuery = '';
        this.renderContent();
      };
    }

    // Primary Filters
    const typeSelect = this.container.querySelector('#ra-filter-room-type');
    if (typeSelect) {
      typeSelect.onchange = (e) => {
        this.filterRoomType = e.target.value;
        this.renderContent();
      };
    }

    const classSelect = this.container.querySelector('#ra-filter-room-class');
    if (classSelect) {
      classSelect.onchange = (e) => {
        this.filterRoomClass = e.target.value;
        this.renderContent();
      };
    }

    const groupSelect = this.container.querySelector('#ra-filter-group');
    if (groupSelect) {
      groupSelect.onchange = (e) => {
        this.filterGroup = e.target.value;
        this.renderContent();
      };
    }

    const blockSelect = this.container.querySelector('#ra-filter-block');
    if (blockSelect) {
      blockSelect.onchange = (e) => {
        this.filterBlock = e.target.value;
        this.renderContent();
      };
    }

    const vipSelect = this.container.querySelector('#ra-filter-vip');
    if (vipSelect) {
      vipSelect.onchange = (e) => {
        this.filterVip = e.target.value;
        this.renderContent();
      };
    }

    const statusSelect = this.container.querySelector('#ra-filter-status');
    if (statusSelect) {
      statusSelect.onchange = (e) => {
        this.filterStatus = e.target.value;
        this.renderContent();
      };
    }

    const sortSelect = this.container.querySelector('#ra-sort-by');
    if (sortSelect) {
      sortSelect.onchange = (e) => {
        this.sortBy = e.target.value;
        this.renderContent();
      };
    }

    // Advanced Filters Toggle
    const advBtn = this.container.querySelector('#btn-toggle-advanced-filters');
    if (advBtn) advBtn.onclick = () => this.openAdvancedFiltersModal();

    // Group Banner View
    const groupBannerBtn = this.container.querySelector('#btn-filter-group-block');
    if (groupBannerBtn) {
      groupBannerBtn.onclick = () => {
        this.filterGroup = 'ABC Conference';
        this.renderContent();
        Toast.show('Filtered reservations for ABC Conference', 'info');
      };
    }

    // Table Row Selection
    const rows = this.container.querySelectorAll('tr[data-res-id]');
    rows.forEach((row) => {
      row.onclick = () => {
        this.selectedReservationId = row.getAttribute('data-res-id');
        this.renderContent();
      };
    });

    // Multi-Select Checkboxes
    const selectAllCheckbox = this.container.querySelector('#ra-select-all');
    if (selectAllCheckbox) {
      selectAllCheckbox.onchange = (e) => {
        const filtered = this.getFilteredReservations();
        if (e.target.checked) {
          filtered.forEach((r) => this.selectedReservationIds.add(r.id));
        } else {
          this.selectedReservationIds.clear();
        }
        this.renderContent();
      };
    }

    const rowCheckboxes = this.container.querySelectorAll('.ra-row-checkbox');
    rowCheckboxes.forEach((cb) => {
      cb.onchange = (e) => {
        const id = cb.getAttribute('data-res-id');
        if (e.target.checked) this.selectedReservationIds.add(id);
        else this.selectedReservationIds.delete(id);
        this.renderContent();
      };
    });

    // Bulk Action Buttons
    const bulkSmartBtn = this.container.querySelector('#btn-bulk-smart-assign');
    if (bulkSmartBtn) {
      bulkSmartBtn.onclick = () => {
        this.assignmentMode = 'SMART';
        this.renderContent();
        Toast.show(`Displaying Smart Assignment recommendations for selected queue`, 'info');
      };
    }

    const bulkAutoBtn = this.container.querySelector('#btn-bulk-auto-assign');
    if (bulkAutoBtn) bulkAutoBtn.onclick = () => this.openAutoAssignPreviewModal();

    const clearSelectionBtn = this.container.querySelector('#btn-clear-selection');
    if (clearSelectionBtn) {
      clearSelectionBtn.onclick = () => {
        this.selectedReservationIds.clear();
        this.renderContent();
      };
    }

    // Manual Filters (Right panel)
    const manualFloorSelect = this.container.querySelector('#manual-filter-floor');
    if (manualFloorSelect) {
      manualFloorSelect.onchange = (e) => {
        this.manualFilterFloor = e.target.value;
        this.renderContent();
      };
    }

    const manualTypeSelect = this.container.querySelector('#manual-filter-type');
    if (manualTypeSelect) {
      manualTypeSelect.onchange = (e) => {
        this.manualFilterType = e.target.value;
        this.renderContent();
      };
    }

    const manualHkSelect = this.container.querySelector('#manual-filter-hk');
    if (manualHkSelect) {
      manualHkSelect.onchange = (e) => {
        this.manualFilterHK = e.target.value;
        this.renderContent();
      };
    }

    const manualAvailSelect = this.container.querySelector('#manual-filter-avail');
    if (manualAvailSelect) {
      manualAvailSelect.onchange = (e) => {
        this.manualFilterAvailability = e.target.value;
        this.renderContent();
      };
    }

    // Assign Buttons in Manual Mode
    const manualAssignBtns = this.container.querySelectorAll('.btn-manual-assign-execute');
    manualAssignBtns.forEach((btn) => {
      btn.onclick = () => {
        const roomNum = btn.getAttribute('data-room-number');
        const room = this.rooms.find((r) => r.roomNumber === roomNum);
        const res = this.getSelectedReservation();
        if (room && res) {
          this.openAssignModal(res, room, 'Manual Assignment');
        }
      };
    });

    // Assign Buttons in Smart Mode
    const smartAssignBtns = this.container.querySelectorAll('.btn-smart-assign-execute');
    smartAssignBtns.forEach((btn) => {
      btn.onclick = () => {
        const roomNum = btn.getAttribute('data-room-number');
        const room = this.rooms.find((r) => r.roomNumber === roomNum);
        const res = this.getSelectedReservation();
        if (room && res) {
          this.openAssignModal(res, room, 'Smart Recommendation → Manual Confirmation');
        }
      };
    });

    // "Why this room?" Breakdown Buttons
    const whyBtns = this.container.querySelectorAll('.btn-why-this-room');
    whyBtns.forEach((btn) => {
      btn.onclick = () => {
        const roomNum = btn.getAttribute('data-room-number');
        const res = this.getSelectedReservation();
        if (roomNum && res) {
          this.openWhyThisRoomModal(res, roomNum);
        }
      };
    });

    // Contextual Actions: Exchange, Unassign, Check-In, Profile, Reservation
    const exchangeBtn = this.container.querySelector('#btn-exchange-room');
    if (exchangeBtn) {
      exchangeBtn.onclick = () => {
        const res = this.getSelectedReservation();
        if (res) this.openExchangeModal(res);
      };
    }

    const unassignBtn = this.container.querySelector('#btn-unassign-room');
    if (unassignBtn) {
      unassignBtn.onclick = () => {
        const res = this.getSelectedReservation();
        if (res) this.openUnassignModal(res);
      };
    }

    const checkInBtn = this.container.querySelector('#btn-proceed-checkin');
    if (checkInBtn) {
      checkInBtn.onclick = () => {
        const res = this.getSelectedReservation();
        if (res) this.proceedToCheckIn(res);
      };
    }

    const profileBtn = this.container.querySelector('#btn-view-profile');
    if (profileBtn) {
      profileBtn.onclick = () => {
        const res = this.getSelectedReservation();
        if (res) this.openGuestProfileModal(res);
      };
    }

    const resBtn = this.container.querySelector('#btn-view-reservation');
    if (resBtn) {
      resBtn.onclick = () => {
        const res = this.getSelectedReservation();
        if (res) this.openReservationDetailModal(res);
      };
    }

    const historyBtn = this.container.querySelector('#btn-view-history');
    if (historyBtn) {
      historyBtn.onclick = () => {
        const res = this.getSelectedReservation();
        if (res) this.openGuestProfileModal(res);
      };
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 8. MODALS & WORKFLOWS
  // ──────────────────────────────────────────────────────────────────────────

  // Modal 1: Smart Assignment Rules Configuration Panel
  openSmartRulesModal() {
    this.closeModal();

    const p = this.smartRules.preferences;
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn';
    modal.innerHTML = `
      <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/80 shadow-2xl w-full max-w-xl overflow-hidden animate-scaleUp">
        
        <div class="px-6 py-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/40">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px] text-primary">tune</span>
            <h3 class="font-headline-sm text-base font-bold text-primary">SMART ASSIGNMENT RULES</h3>
          </div>
          <button id="rules-close-btn" class="text-on-surface-variant hover:text-primary cursor-pointer">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div class="p-6 flex flex-col gap-4 text-xs max-h-[72vh] overflow-y-auto">
          
          <!-- Hard Requirements -->
          <div class="p-3.5 rounded-xl bg-surface-container border border-outline-variant/70 flex flex-col gap-2">
            <span class="font-bold text-primary text-[11px] uppercase tracking-wider">HARD REQUIREMENTS (Must be satisfied)</span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-on-surface">
              <div class="flex items-center gap-1.5"><span class="text-emerald-500 font-bold">✓</span><span>Room Type Match</span></div>
              <div class="flex items-center gap-1.5"><span class="text-emerald-500 font-bold">✓</span><span>Full Stay Availability</span></div>
              <div class="flex items-center gap-1.5"><span class="text-emerald-500 font-bold">✓</span><span>Occupancy Capacity</span></div>
              <div class="flex items-center gap-1.5"><span class="text-emerald-500 font-bold">✓</span><span>Room Not Out of Order</span></div>
              <div class="flex items-center gap-1.5"><span class="text-emerald-500 font-bold">✓</span><span>Room Not Out of Service</span></div>
              <div class="flex items-center gap-1.5"><span class="text-emerald-500 font-bold">✓</span><span>No Conflicting Allocation</span></div>
            </div>
            <p class="text-[10px] text-on-surface-variant mt-1">If any hard requirement fails, the room is never recommended.</p>
          </div>

          <!-- Preferences / Priority Weights -->
          <div class="flex flex-col gap-2.5">
            <span class="font-bold text-primary text-[11px] uppercase tracking-wider">PREFERENCES (Determines Ranking Score)</span>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              <div class="flex flex-col gap-1">
                <label class="font-semibold text-on-surface-variant">VIP Status Priority:</label>
                <select id="rule-vip" class="px-2.5 py-1.5 rounded-lg border border-outline-variant bg-surface-bright text-xs font-bold cursor-pointer">
                  ${['VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW', 'IGNORE'].map(v => `<option value="${v}" ${p.vipStatus === v ? 'selected' : ''}>${v.replace('_', ' ')}</option>`).join('')}
                </select>
              </div>

              <div class="flex flex-col gap-1">
                <label class="font-semibold text-on-surface-variant">Previous Room:</label>
                <select id="rule-prev" class="px-2.5 py-1.5 rounded-lg border border-outline-variant bg-surface-bright text-xs font-bold cursor-pointer">
                  ${['VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW', 'IGNORE'].map(v => `<option value="${v}" ${p.previousRoom === v ? 'selected' : ''}>${v.replace('_', ' ')}</option>`).join('')}
                </select>
              </div>

              <div class="flex flex-col gap-1">
                <label class="font-semibold text-on-surface-variant">Floor Preference:</label>
                <select id="rule-floor" class="px-2.5 py-1.5 rounded-lg border border-outline-variant bg-surface-bright text-xs font-bold cursor-pointer">
                  ${['VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW', 'IGNORE'].map(v => `<option value="${v}" ${p.floorPreference === v ? 'selected' : ''}>${v.replace('_', ' ')}</option>`).join('')}
                </select>
              </div>

              <div class="flex flex-col gap-1">
                <label class="font-semibold text-on-surface-variant">Bed Preference:</label>
                <select id="rule-bed" class="px-2.5 py-1.5 rounded-lg border border-outline-variant bg-surface-bright text-xs font-bold cursor-pointer">
                  ${['VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW', 'IGNORE'].map(v => `<option value="${v}" ${p.bedPreference === v ? 'selected' : ''}>${v.replace('_', ' ')}</option>`).join('')}
                </select>
              </div>

              <div class="flex flex-col gap-1">
                <label class="font-semibold text-on-surface-variant">View Preference:</label>
                <select id="rule-view" class="px-2.5 py-1.5 rounded-lg border border-outline-variant bg-surface-bright text-xs font-bold cursor-pointer">
                  ${['VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW', 'IGNORE'].map(v => `<option value="${v}" ${p.viewPreference === v ? 'selected' : ''}>${v.replace('_', ' ')}</option>`).join('')}
                </select>
              </div>

              <div class="flex flex-col gap-1">
                <label class="font-semibold text-on-surface-variant">Housekeeping Readiness:</label>
                <select id="rule-hk" class="px-2.5 py-1.5 rounded-lg border border-outline-variant bg-surface-bright text-xs font-bold cursor-pointer">
                  ${['VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW', 'IGNORE'].map(v => `<option value="${v}" ${p.hkReadiness === v ? 'selected' : ''}>${v.replace('_', ' ')}</option>`).join('')}
                </select>
              </div>

              <div class="flex flex-col gap-1">
                <label class="font-semibold text-on-surface-variant">Group Proximity:</label>
                <select id="rule-group" class="px-2.5 py-1.5 rounded-lg border border-outline-variant bg-surface-bright text-xs font-bold cursor-pointer">
                  ${['VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW', 'IGNORE'].map(v => `<option value="${v}" ${p.groupProximity === v ? 'selected' : ''}>${v.replace('_', ' ')}</option>`).join('')}
                </select>
              </div>

              <div class="flex flex-col gap-1">
                <label class="font-semibold text-on-surface-variant">Minimize Room Changes:</label>
                <select id="rule-minimize" class="px-2.5 py-1.5 rounded-lg border border-outline-variant bg-surface-bright text-xs font-bold cursor-pointer">
                  ${['VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW', 'IGNORE'].map(v => `<option value="${v}" ${p.minimizeRoomChanges === v ? 'selected' : ''}>${v.replace('_', ' ')}</option>`).join('')}
                </select>
              </div>

            </div>
          </div>

        </div>

        <div class="px-6 py-4 border-t border-outline-variant/60 bg-surface-container-low/40 flex items-center justify-between">
          <button id="rules-reset-btn" class="px-3.5 py-1.5 rounded-xl border border-outline-variant text-on-surface-variant hover:text-primary text-xs font-bold cursor-pointer">
            Reset to Standard
          </button>
          <button id="rules-save-btn" class="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 cursor-pointer shadow-xs active:scale-95">
            Save & Recompute Scores
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(modal);
    this.activeModal = modal;

    modal.querySelector('#rules-close-btn').onclick = () => this.closeModal();
    modal.querySelector('#rules-reset-btn').onclick = () => {
      this.smartRules.preferences = {
        vipStatus: 'HIGH',
        previousRoom: 'HIGH',
        floorPreference: 'MEDIUM',
        bedPreference: 'HIGH',
        viewPreference: 'MEDIUM',
        hkReadiness: 'HIGH',
        roomFeatures: 'MEDIUM',
        groupProximity: 'MEDIUM',
        minimizeRoomChanges: 'HIGH',
      };
      this.closeModal();
      this.renderContent();
      Toast.show('Smart assignment rules reset to defaults.', 'info');
    };
    modal.querySelector('#rules-save-btn').onclick = () => {
      this.smartRules.preferences.vipStatus = modal.querySelector('#rule-vip').value;
      this.smartRules.preferences.previousRoom = modal.querySelector('#rule-prev').value;
      this.smartRules.preferences.floorPreference = modal.querySelector('#rule-floor').value;
      this.smartRules.preferences.bedPreference = modal.querySelector('#rule-bed').value;
      this.smartRules.preferences.viewPreference = modal.querySelector('#rule-view').value;
      this.smartRules.preferences.hkReadiness = modal.querySelector('#rule-hk').value;
      this.smartRules.preferences.groupProximity = modal.querySelector('#rule-group').value;
      this.smartRules.preferences.minimizeRoomChanges = modal.querySelector('#rule-minimize').value;

      this.closeModal();
      this.renderContent();
      Toast.show('Rules updated: Smart room recommendation scores recalculated.', 'success');
    };
  }

  // Modal 2: "Why this room?" Score & Factor Breakdown
  openWhyThisRoomModal(reservation, roomNumber) {
    this.closeModal();

    const recs = this.getSmartRecommendations(reservation);
    const candidate = recs.find(r => r.room.roomNumber === roomNumber);
    if (!candidate) return;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn';
    modal.innerHTML = `
      <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/80 shadow-2xl w-full max-w-md overflow-hidden animate-scaleUp">
        
        <div class="px-6 py-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/40">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px] text-primary">fact_check</span>
            <h3 class="font-headline-sm text-base font-bold text-primary">WHY ROOM ${roomNumber}?</h3>
          </div>
          <button id="why-close-btn" class="text-on-surface-variant hover:text-primary cursor-pointer">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div class="p-6 flex flex-col gap-4 text-xs">
          
          <div class="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/20">
            <div>
              <span class="text-[10px] font-bold uppercase text-primary block">Recommendation Score</span>
              <span class="font-bold text-primary text-sm">${reservation.guestName} → Room ${roomNumber}</span>
            </div>
            <span class="font-data-mono text-2xl font-black text-primary">${candidate.score}%</span>
          </div>

          <!-- Factor Score Breakdown -->
          <div class="flex flex-col gap-1.5">
            <span class="font-bold text-primary text-[11px] uppercase tracking-wider">Score Breakdown</span>
            
            <div class="rounded-xl border border-outline-variant/60 divide-y divide-outline-variant/30 overflow-hidden text-xs">
              ${candidate.breakdown.map(item => `
                <div class="p-2.5 flex items-center justify-between bg-surface-container-low/30">
                  <div class="flex items-center gap-2">
                    <span class="${item.matched ? 'text-emerald-500' : 'text-amber-500'} font-bold">${item.matched ? '✓' : '△'}</span>
                    <span class="font-medium text-on-surface">${item.text}</span>
                  </div>
                  <span class="font-data-mono font-bold ${item.points > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-on-surface-variant'}">
                    ${item.points > 0 ? `+${item.points}` : '0'}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

          <p class="text-[11px] text-on-surface-variant leading-relaxed">
            The score is an operational ranking aid calculated using your hotel's configured priority weights.
          </p>

        </div>

        <div class="px-6 py-3.5 border-t border-outline-variant/60 bg-surface-container-low/40 flex items-center justify-end gap-2">
          <button id="why-done-btn" class="px-4 py-1.5 rounded-xl border border-outline-variant text-on-surface-variant hover:text-primary text-xs font-bold cursor-pointer">
            Close
          </button>
          <button id="why-assign-btn" class="px-4 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 cursor-pointer shadow-xs">
            Assign Room ${roomNumber}
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(modal);
    this.activeModal = modal;

    modal.querySelector('#why-close-btn').onclick = () => this.closeModal();
    modal.querySelector('#why-done-btn').onclick = () => this.closeModal();
    modal.querySelector('#why-assign-btn').onclick = () => {
      this.closeModal();
      this.openAssignModal(reservation, candidate.room, 'Smart Recommendation → Manual Confirmation');
    };
  }

  // Modal 3: Assign Room Confirmation Dialog
  openAssignModal(reservation, room, method = 'Manual Assignment') {
    this.closeModal();

    const isDirty = room.hkStatus === 'DIRTY';

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn';
    modal.innerHTML = `
      <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/80 shadow-2xl w-full max-w-lg overflow-hidden animate-scaleUp">
        
        <div class="px-6 py-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/40">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px] text-primary">assignment_turned_in</span>
            <h3 class="font-headline-sm text-base font-bold text-primary">ASSIGN ROOM</h3>
          </div>
          <button id="assign-close-btn" class="text-on-surface-variant hover:text-primary cursor-pointer">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div class="p-6 flex flex-col gap-4 text-xs">
          
          <div class="grid grid-cols-2 gap-3">
            <div class="p-3 rounded-xl bg-surface-container border border-outline-variant/60">
              <span class="text-[10px] uppercase font-bold text-on-surface-variant block">Guest</span>
              <span class="font-bold text-primary text-sm mt-0.5 block">${reservation.guestName}</span>
              <span class="font-data-mono text-[11px] text-on-surface-variant">${reservation.resNumber}</span>
            </div>

            <div class="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <span class="text-[10px] uppercase font-bold text-primary block">Target Room</span>
              <span class="font-bold text-primary text-sm mt-0.5 block">Room ${room.roomNumber}</span>
              <span class="font-data-mono text-[11px] text-primary">${room.roomType} (Fl ${room.floor})</span>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-surface-container-low/70 border border-outline-variant/60 flex flex-col gap-1.5">
            <span class="font-bold text-primary text-[11px] uppercase tracking-wider mb-1">Pre-Assignment Validation</span>
            <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span><span>Room type matches required category</span></div>
            <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span><span>Available for full stay (${reservation.stayDates})</span></div>
            <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span><span>No conflicting maintenance blocks</span></div>
            <div class="flex items-center gap-2">
              <span class="${isDirty ? 'text-amber-500 font-bold' : 'text-emerald-500 font-bold'}">${isDirty ? '●' : '✓'}</span>
              <span>${isDirty ? 'Room is currently Dirty — housekeeping turnover dispatched before check-in' : 'Room is ready for guest arrival'}</span>
            </div>
          </div>

          ${isDirty ? `
            <div class="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-[11px] flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px] text-amber-600">info</span>
              <span>Hotel policy allows room assignment before arrival. Check-in will require room inspection.</span>
            </div>
          ` : ''}

        </div>

        <div class="px-6 py-4 border-t border-outline-variant/60 bg-surface-container-low/40 flex items-center justify-end gap-3">
          <button id="assign-cancel-btn" class="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant hover:text-primary text-xs font-bold cursor-pointer">
            Cancel
          </button>
          <button id="assign-confirm-btn" class="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 cursor-pointer shadow-xs active:scale-95">
            Confirm Assignment
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(modal);
    this.activeModal = modal;

    modal.querySelector('#assign-close-btn').onclick = () => this.closeModal();
    modal.querySelector('#assign-cancel-btn').onclick = () => this.closeModal();
    modal.querySelector('#assign-confirm-btn').onclick = () => {
      this.executeAssignRoom(reservation.id, room.roomNumber, method);
      this.closeModal();
    };
  }

  // Core Room Allocation Execution (Single Source of Truth)
  executeAssignRoom(reservationId, roomNumber, method = 'Manual Assignment') {
    const res = this.reservations.find((r) => r.id === reservationId);
    const room = this.rooms.find((r) => r.roomNumber === roomNumber);

    if (!res || !room) return;

    // SECTION 10 & 28 RULE: VACANT != READY
    // If room is dirty or not ready, block assignment
    const readiness = store.checkRoomReadiness(roomNumber);
    if (!readiness.ready || room.hkStatus === 'DIRTY') {
      const cause = readiness.reason || (room.hkStatus === 'DIRTY' ? 'Room is Vacant but DIRTY (HK Turnover Required)' : 'Room Not Ready');
      Toast.show(`⚠️ Blocked: Room ${roomNumber} is NOT READY (${cause})`, 'warning');
      alert(`ROOM ASSIGNMENT BLOCKED (Section 28 Compliance)\n\nRoom ${roomNumber} is currently Vacant but DIRTY.\n\nCore Operational Rule: VACANT != READY.\n\nYou cannot assign an uncleaned room to a guest for arrival.\nPlease dispatch housekeeping turnover before proceeding.`);
      return;
    }

    // Sync with central reactive store
    try {
      store.assignRoomToReservation(reservationId, roomNumber);
    } catch (e) {
      console.warn('[RoomAssignmentView] store.assignRoomToReservation notice:', e);
    }

    const prevRoomNum = res.assignedRoom;

    // Release old room if swapping
    if (prevRoomNum && prevRoomNum !== roomNumber) {
      const prevRoom = this.rooms.find((r) => r.roomNumber === prevRoomNum);
      if (prevRoom) {
        prevRoom.assignedTo = null;
        prevRoom.available = true;
        prevRoom.occupancy = 'VACANT';
      }
    }

    res.assignedRoom = roomNumber;
    res.hkStatus = room.hkStatus === 'INSPECTED' ? 'Inspected' : room.hkStatus === 'CLEAN' ? 'Clean' : 'Dirty';
    res.status = room.hkStatus === 'INSPECTED' || room.hkStatus === 'CLEAN' ? 'CHECK_IN_READY' : 'ASSIGNED';

    room.assignedTo = res.id;
    room.available = false;
    room.occupancy = 'OCCUPIED';

    // Log Audit Trail
    this.auditTrail.unshift({
      id: `aud-${Date.now()}`,
      resId: res.id,
      resNumber: res.resNumber,
      guestName: res.guestName,
      previousRoom: prevRoomNum || 'None',
      newRoom: roomNumber,
      operator: 'Swastik',
      timestamp: `10 Sep 2026 · ${new Date().toTimeString().split(' ')[0].substring(0, 5)}`,
      method,
    });

    this.renderContent();
    Toast.show(`✓ Room ${roomNumber} assigned to ${res.guestName}`, 'success');
  }

  // Modal 4: Auto Assignment Preview Modal
  openAutoAssignPreviewModal() {
    this.closeModal();

    const unassigned = this.reservations.filter((r) => !r.assignedRoom);
    const previewList = [];
    const usedRooms = new Set();

    for (const res of unassigned) {
      const recs = this.getSmartRecommendations(res);
      const top = recs.find((rec) => !usedRooms.has(rec.room.roomNumber));
      if (top) {
        usedRooms.add(top.room.roomNumber);
        previewList.push({
          reservation: res,
          room: top.room,
          score: top.score,
        });
      }
    }

    const manualAttentionCount = unassigned.length - previewList.length;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn';
    modal.innerHTML = `
      <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/80 shadow-2xl w-full max-w-2xl overflow-hidden animate-scaleUp">
        
        <div class="px-6 py-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/40">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px] text-primary">auto_awesome</span>
            <h3 class="font-headline-sm text-base font-bold text-primary">AUTO ASSIGNMENT PREVIEW</h3>
          </div>
          <button id="auto-close-btn" class="text-on-surface-variant hover:text-primary cursor-pointer">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div class="p-6 flex flex-col gap-4 text-xs">
          <p class="text-on-surface text-xs leading-relaxed">
            ${unassigned.length} reservations require room assignment. <strong>${previewList.length}</strong> can be automatically assigned. <strong>${manualAttentionCount}</strong> require manual attention.
          </p>

          <div class="rounded-xl border border-outline-variant/60 overflow-hidden max-h-[260px] overflow-y-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead class="bg-surface-container-low text-on-surface-variant text-[11px] font-bold border-b border-outline-variant/40">
                <tr>
                  <th class="py-2.5 px-3">Guest</th>
                  <th class="py-2.5 px-3">Room Type</th>
                  <th class="py-2.5 px-3">Proposed Room</th>
                  <th class="py-2.5 px-3 text-right">Match</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/30">
                ${previewList.map(item => `
                  <tr>
                    <td class="py-2.5 px-3 font-bold text-primary">${item.reservation.guestName}</td>
                    <td class="py-2.5 px-3 text-on-surface-variant">${item.reservation.roomType}</td>
                    <td class="py-2.5 px-3 font-data-mono font-bold text-primary">
                      Room ${item.room.roomNumber} <span class="text-[10px] font-normal text-on-surface-variant">(${item.room.hkStatus})</span>
                    </td>
                    <td class="py-2.5 px-3 text-right font-data-mono font-bold text-emerald-600">
                      ${item.score}%
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-outline-variant/60 bg-surface-container-low/40 flex items-center justify-end gap-3">
          <button id="auto-cancel-btn" class="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant hover:text-primary text-xs font-bold cursor-pointer">
            Cancel
          </button>
          <button id="auto-confirm-btn" class="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 cursor-pointer shadow-xs active:scale-95">
            Confirm Assignments (${previewList.length})
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(modal);
    this.activeModal = modal;

    modal.querySelector('#auto-close-btn').onclick = () => this.closeModal();
    modal.querySelector('#auto-cancel-btn').onclick = () => this.closeModal();
    modal.querySelector('#auto-confirm-btn').onclick = () => {
      previewList.forEach(item => {
        this.executeAssignRoom(item.reservation.id, item.room.roomNumber, 'Auto Assignment');
      });
      this.closeModal();
      Toast.show(`Auto-assigned ${previewList.length} reservations successfully.`, 'success');
    };
  }

  // Modal 5: Exchange Room
  openExchangeModal(reservation) {
    this.closeModal();

    const currentRoomNum = reservation.assignedRoom;
    const alternatives = this.rooms.filter(r => r.available && r.roomNumber !== currentRoomNum && r.hkStatus !== 'OUT_OF_ORDER');

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn';
    modal.innerHTML = `
      <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/80 shadow-2xl w-full max-w-lg overflow-hidden animate-scaleUp">
        
        <div class="px-6 py-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/40">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px] text-primary">swap_horiz</span>
            <h3 class="font-headline-sm text-base font-bold text-primary">EXCHANGE ROOM</h3>
          </div>
          <button id="ex-close-btn" class="text-on-surface-variant hover:text-primary cursor-pointer">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div class="p-6 flex flex-col gap-4 text-xs">
          <div class="p-3 rounded-xl bg-surface-container border border-outline-variant/60 flex items-center justify-between">
            <div>
              <span class="text-[10px] uppercase font-bold text-on-surface-variant block">Current Room</span>
              <span class="font-bold text-primary text-sm">Room ${currentRoomNum}</span>
              <span class="text-on-surface-variant text-[11px]">${reservation.guestName}</span>
            </div>
            <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 font-bold text-xs">Assigned</span>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="font-bold text-primary text-xs uppercase tracking-wider">Select New Room:</label>
            <select id="select-exchange-room" class="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-bright text-primary text-xs font-bold cursor-pointer">
              ${alternatives.map(alt => `
                <option value="${alt.roomNumber}">
                  Room ${alt.roomNumber} — ${alt.roomType} (Floor ${alt.floor}, ${alt.hkStatus})
                </option>
              `).join('')}
            </select>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-outline-variant/60 bg-surface-container-low/40 flex items-center justify-end gap-3">
          <button id="ex-cancel-btn" class="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant hover:text-primary text-xs font-bold cursor-pointer">
            Cancel
          </button>
          <button id="ex-confirm-btn" class="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 cursor-pointer shadow-xs active:scale-95">
            Confirm Exchange
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(modal);
    this.activeModal = modal;

    modal.querySelector('#ex-close-btn').onclick = () => this.closeModal();
    modal.querySelector('#ex-cancel-btn').onclick = () => this.closeModal();
    modal.querySelector('#ex-confirm-btn').onclick = () => {
      const newRoom = modal.querySelector('#select-exchange-room').value;
      this.executeAssignRoom(reservation.id, newRoom, 'Exchange');
      this.closeModal();
    };
  }

  // Modal 6: Unassign Room
  openUnassignModal(reservation) {
    this.closeModal();

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn';
    modal.innerHTML = `
      <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/80 shadow-2xl w-full max-w-md overflow-hidden animate-scaleUp">
        
        <div class="px-6 py-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/40">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px] text-rose-500">link_off</span>
            <h3 class="font-headline-sm text-base font-bold text-primary">UNASSIGN ROOM?</h3>
          </div>
          <button id="un-close-btn" class="text-on-surface-variant hover:text-primary cursor-pointer">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div class="p-6 flex flex-col gap-3 text-xs">
          <p class="text-on-surface">
            Guest: <strong>${reservation.guestName}</strong><br/>
            Current Room: <strong>${reservation.assignedRoom}</strong><br/>
            Stay: <strong>${reservation.stayDates}</strong>
          </p>
          <p class="text-on-surface-variant text-[11px]">
            The room will become available for reassignment to other arriving guests.
          </p>
        </div>

        <div class="px-6 py-4 border-t border-outline-variant/60 bg-surface-container-low/40 flex items-center justify-end gap-3">
          <button id="un-cancel-btn" class="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant hover:text-primary text-xs font-bold cursor-pointer">
            Cancel
          </button>
          <button id="un-confirm-btn" class="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer shadow-xs active:scale-95">
            Unassign Room
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(modal);
    this.activeModal = modal;

    modal.querySelector('#un-close-btn').onclick = () => this.closeModal();
    modal.querySelector('#un-cancel-btn').onclick = () => this.closeModal();
    modal.querySelector('#un-confirm-btn').onclick = () => {
      const roomNum = reservation.assignedRoom;
      const room = this.rooms.find(r => r.roomNumber === roomNum);
      if (room) {
        room.assignedTo = null;
        room.available = true;
        room.occupancy = 'VACANT';
      }
      reservation.assignedRoom = null;
      reservation.status = 'UNASSIGNED';

      this.auditTrail.unshift({
        id: `aud-${Date.now()}`,
        resId: reservation.id,
        resNumber: reservation.resNumber,
        guestName: reservation.guestName,
        previousRoom: roomNum,
        newRoom: 'None (Unassigned)',
        operator: 'Swastik',
        timestamp: `10 Sep 2026 · ${new Date().toTimeString().split(' ')[0].substring(0, 5)}`,
        method: 'Unassignment',
      });

      this.closeModal();
      this.renderContent();
      Toast.show(`Room ${roomNum} unassigned.`, 'info');
    };
  }

  // Modal 7: Audit Trail Modal
  openAuditTrailModal() {
    this.closeModal();

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn';
    modal.innerHTML = `
      <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/80 shadow-2xl w-full max-w-2xl overflow-hidden animate-scaleUp">
        
        <div class="px-6 py-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/40">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px] text-primary">history</span>
            <h3 class="font-headline-sm text-base font-bold text-primary">ROOM ALLOCATION AUDIT TRAIL</h3>
          </div>
          <button id="aud-close-btn" class="text-on-surface-variant hover:text-primary cursor-pointer">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div class="p-6 flex flex-col gap-3 text-xs max-h-[60vh] overflow-y-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead class="bg-surface-container-low text-on-surface-variant text-[11px] font-bold border-b border-outline-variant/40">
              <tr>
                <th class="py-2.5 px-3">Guest & Res</th>
                <th class="py-2.5 px-2">Prev Room</th>
                <th class="py-2.5 px-2">New Room</th>
                <th class="py-2.5 px-2">Method</th>
                <th class="py-2.5 px-2">Operator</th>
                <th class="py-2.5 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/30 font-data-mono">
              ${this.auditTrail.map(a => `
                <tr>
                  <td class="py-2.5 px-3">
                    <span class="font-bold text-primary">${a.guestName}</span>
                    <span class="text-[10px] text-on-surface-variant block">${a.resNumber}</span>
                  </td>
                  <td class="py-2.5 px-2">${a.previousRoom || 'None'}</td>
                  <td class="py-2.5 px-2 font-bold text-emerald-600">${a.newRoom}</td>
                  <td class="py-2.5 px-2 text-[11px] text-on-surface">${a.method}</td>
                  <td class="py-2.5 px-2">${a.operator}</td>
                  <td class="py-2.5 px-3 text-right text-[11px] text-on-surface-variant">${a.timestamp}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="px-6 py-3 border-t border-outline-variant/60 bg-surface-container-low/40 flex items-center justify-end">
          <button id="aud-done-btn" class="px-4 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold cursor-pointer">
            Close
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(modal);
    this.activeModal = modal;

    modal.querySelector('#aud-close-btn').onclick = () => this.closeModal();
    modal.querySelector('#aud-done-btn').onclick = () => this.closeModal();
  }

  // Modal 8: OPERA Advanced Filters Modal
  openAdvancedFiltersModal() {
    this.closeModal();

    const adv = this.advancedFilters;
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn';
    modal.innerHTML = `
      <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/80 shadow-2xl w-full max-w-xl overflow-hidden animate-scaleUp">
        
        <div class="px-6 py-4 border-b border-outline-variant/60 flex items-center justify-between bg-surface-container-low/40">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px] text-primary">tune</span>
            <h3 class="font-headline-sm text-base font-bold text-primary">Advanced Filters</h3>
          </div>
          <button id="adv-close-btn" class="text-on-surface-variant hover:text-primary cursor-pointer">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div class="p-6 grid grid-cols-2 gap-3 text-xs max-h-[65vh] overflow-y-auto">
          <div class="flex flex-col gap-1">
            <label class="font-bold text-on-surface-variant text-[11px] uppercase">Company:</label>
            <select id="adv-company" class="px-2.5 py-1.5 rounded-xl border border-outline-variant bg-surface-bright text-xs font-semibold cursor-pointer">
              <option value="ALL" ${adv.company === 'ALL' ? 'selected' : ''}>All Companies</option>
              <option value="ABC Corporation" ${adv.company === 'ABC Corporation' ? 'selected' : ''}>ABC Corporation</option>
              <option value="Vanguard Capital" ${adv.company === 'Vanguard Capital' ? 'selected' : ''}>Vanguard Capital</option>
            </select>
          </div>

          <div class="flex flex-col gap-1">
            <label class="font-bold text-on-surface-variant text-[11px] uppercase">Agent:</label>
            <select id="adv-agent" class="px-2.5 py-1.5 rounded-xl border border-outline-variant bg-surface-bright text-xs font-semibold cursor-pointer">
              <option value="ALL" ${adv.agent === 'ALL' ? 'selected' : ''}>All Agents</option>
              <option value="Direct" ${adv.agent === 'Direct' ? 'selected' : ''}>Direct</option>
              <option value="Amex Corporate" ${adv.agent === 'Amex Corporate' ? 'selected' : ''}>Amex Corporate</option>
            </select>
          </div>

          <div class="flex flex-col gap-1">
            <label class="font-bold text-on-surface-variant text-[11px] uppercase">Source:</label>
            <select id="adv-source" class="px-2.5 py-1.5 rounded-xl border border-outline-variant bg-surface-bright text-xs font-semibold cursor-pointer">
              <option value="ALL" ${adv.source === 'ALL' ? 'selected' : ''}>All Sources</option>
              <option value="Direct" ${adv.source === 'Direct' ? 'selected' : ''}>Direct</option>
              <option value="Corporate GDS" ${adv.source === 'Corporate GDS' ? 'selected' : ''}>Corporate GDS</option>
            </select>
          </div>

          <div class="flex flex-col gap-1">
            <label class="font-bold text-on-surface-variant text-[11px] uppercase">Smoking Preference:</label>
            <select id="adv-smoking" class="px-2.5 py-1.5 rounded-xl border border-outline-variant bg-surface-bright text-xs font-semibold cursor-pointer">
              <option value="ALL" ${adv.smoking === 'ALL' ? 'selected' : ''}>All</option>
              <option value="Non-Smoking" ${adv.smoking === 'Non-Smoking' ? 'selected' : ''}>Non-Smoking</option>
              <option value="Smoking" ${adv.smoking === 'Smoking' ? 'selected' : ''}>Smoking</option>
            </select>
          </div>

          <div class="col-span-2 flex flex-col gap-1 pt-1">
            <label class="font-bold text-on-surface-variant text-[11px] uppercase">Features Required:</label>
            <div class="flex flex-wrap gap-2">
              ${['High Floor', 'King Bed', 'City View', 'Ocean View', 'Away from Elevator'].map(feat => `
                <label class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-outline-variant bg-surface-bright text-xs cursor-pointer">
                  <input type="checkbox" class="adv-feat-chk rounded" value="${feat}" ${adv.features.includes(feat) ? 'checked' : ''} />
                  <span>${feat}</span>
                </label>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="px-6 py-3.5 border-t border-outline-variant/60 bg-surface-container-low/40 flex items-center justify-between">
          <button id="adv-clear-btn" class="px-4 py-1.5 rounded-xl border border-outline-variant text-on-surface-variant hover:text-primary text-xs font-bold cursor-pointer">
            Clear
          </button>
          <button id="adv-apply-btn" class="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 cursor-pointer shadow-xs active:scale-95">
            Apply
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(modal);
    this.activeModal = modal;

    modal.querySelector('#adv-close-btn').onclick = () => this.closeModal();
    modal.querySelector('#adv-clear-btn').onclick = () => {
      this.advancedFilters = { company: 'ALL', agent: 'ALL', source: 'ALL', features: [], specials: '', resType: 'ALL', smoking: 'ALL', preferredRoom: '', lastRoom: '' };
      this.closeModal();
      this.renderContent();
    };
    modal.querySelector('#adv-apply-btn').onclick = () => {
      this.advancedFilters.company = modal.querySelector('#adv-company').value;
      this.advancedFilters.agent = modal.querySelector('#adv-agent').value;
      this.advancedFilters.source = modal.querySelector('#adv-source').value;
      this.advancedFilters.smoking = modal.querySelector('#adv-smoking').value;

      const checked = [];
      modal.querySelectorAll('.adv-feat-chk:checked').forEach(c => checked.push(c.value));
      this.advancedFilters.features = checked;

      this.closeModal();
      this.renderContent();
      Toast.show('Advanced filters applied.', 'info');
    };
  }

  // Reservation & Profile links
  openReservationDetailModal(reservation) {
    const detailModal = new ReservationDetailModal({
      reservationId: reservation.id,
      reservationData: {
        id: reservation.id,
        reservation_number: reservation.resNumber,
        status: reservation.status === 'UNASSIGNED' ? 'CONFIRMED' : 'CHECKED_IN',
        first_name: reservation.guestName.split(' ')[0] || '',
        last_name: reservation.guestName.split(' ').slice(1).join(' ') || '',
        vip_status: reservation.vip ? 'VIP' : 'STANDARD',
        check_in_date: reservation.arrival,
        check_out_date: reservation.departure,
        adults: reservation.adults,
        children: reservation.children,
        room_type_name: reservation.roomType,
        room_type_code: reservation.roomTypeCode,
        room_number: reservation.assignedRoom || 'Unassigned',
        rate_plan_name: reservation.ratePlan,
        source_name: reservation.source,
        special_requests: reservation.specialRequests,
      },
      onClose: () => {},
    });
    detailModal.init().then(() => {
      const el = detailModal.render();
      document.body.appendChild(el);
      const closeBtn = el.querySelector('#close-detail-btn');
      if (closeBtn) closeBtn.onclick = () => el.remove();
    });
  }

  openGuestProfileModal(reservation) {
    this.closeModal();
    Toast.show(`Viewing guest profile for ${reservation.guestName}`, 'info');
    setTimeout(() => {
      store.setNavTab('crm');
    }, 400);
  }

  proceedToCheckIn(reservation) {
    if (!reservation.assignedRoom) {
      Toast.show('Please assign a room before proceeding to check-in.', 'warning');
      return;
    }
    Toast.show(`Opening check-in for ${reservation.guestName} in Room ${reservation.assignedRoom}...`, 'info');
    setTimeout(() => {
      store.setNavTab('arrivals');
    }, 400);
  }

  closeModal() {
    if (this.activeModal) {
      this.activeModal.remove();
      this.activeModal = null;
    }
  }

  hasActiveAdvancedFilters() {
    const a = this.advancedFilters;
    return a.company !== 'ALL' || a.agent !== 'ALL' || a.source !== 'ALL' || a.smoking !== 'ALL' || (a.features && a.features.length > 0);
  }
}
