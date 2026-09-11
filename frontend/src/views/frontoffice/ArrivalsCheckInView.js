// ==========================================================================
// VOLVITECH HOSPITALITY OS — FRONT DESK ARRIVALS OPERATIONAL WORKSPACE
// High-Speed Frontline Hotel Arrivals, Check-In Readiness & Operations Center
// Operational Reference: Oracle OPERA PMS Arrivals Functional Capabilities
// Modernized for Instant, Human-Friendly Hotel Frontline Dispatch
// ==========================================================================

import { reservationsClient } from '../../api/reservationsClient.js';
import { NewBookingModal } from './NewBookingModal.js';
import { Toast } from '../../components/Toast.js';
import { store } from '../../state/store.js';

export class ArrivalsCheckInView {
  constructor() {
    this.container = null;
    this.isLoading = false;

    // Search & Filter State
    this.searchQuery = '';
    this.activeSummaryFilter = 'ALL'; // 'ALL', 'PENDING', 'ASSIGNED', 'UNASSIGNED', 'NOT_READY', 'VIP'
    this.activeQuickFilter = 'ALL';   // 'ALL', 'PENDING', 'UNASSIGNED', 'NOT_READY', 'VIP', 'GROUP', 'PAY_ISSUE', 'CHECKED_IN'
    this.sortBy = 'TIME';             // 'TIME', 'NAME', 'ROOM', 'ROOM_TYPE', 'STATUS'

    // Selection & Bulk Action State
    this.selectedArrivalIds = new Set();

    // Drawer & Modal States
    this.activeDrawerArrival = null;      // Arrival detail slide-over
    this.isAdvancedFilterOpen = false;    // Advanced filters drawer
    this.activeAssignModalArrival = null; // Room assignment modal
    this.activeNotReadyArrival = null;    // Room Not Ready guidance modal
    this.activeRegCardArrival = null;     // Registration card modal
    this.activeWalkInModal = false;       // Walk-in wizard modal
    this.walkInStep = 1;                  // Walk-in step 1 to 4
    this.walkInData = {
      name: '', phone: '', email: '', idType: 'PASSPORT', idNumber: '',
      checkInDate: '2026-09-08', checkOutDate: '2026-09-10', nights: 2,
      roomType: 'Deluxe King', roomNumber: '205', ratePerNight: 4800,
      paymentMethod: 'Credit Card', adults: 1
    };

    // Advanced Filter Form Values
    this.advancedFilters = {
      lastName: '', firstName: '',
      company: '', corporateNumber: '', group: '', block: '',
      source: 'ALL', agent: '', iataNumber: '', confNumber: '', crsNumber: '',
      arrivalFrom: '', arrivalTo: '',
      membershipType: 'ALL', membershipNumber: '', partySize: 'ALL',
      contact: '', postalCode: '', communication: '', customRef: '',
      resStatus: 'ALL', roomType: 'ALL', roomAssignment: 'ALL',
      roomReadiness: 'ALL', vipOnly: false, paymentStatus: 'ALL'
    };

    // Available Rooms Pool for Assignment
    this.availableRoomsPool = [
      { roomNumber: '402', floor: '4', type: 'Deluxe King', view: 'City View', bed: '1 King Bed', status: 'READY', housekeeping: 'Ready', estReady: null },
      { roomNumber: '408', floor: '4', type: 'Deluxe King', view: 'Garden View', bed: '1 King Bed', status: 'READY', housekeeping: 'Ready', estReady: null },
      { roomNumber: '512', floor: '5', type: 'Deluxe King', view: 'City View', bed: '1 King Bed', status: 'CLEANING', housekeeping: 'Cleaning', estReady: '15 min' },
      { roomNumber: '205', floor: '2', type: 'Classic King', view: 'Courtyard View', bed: '1 King Bed', status: 'READY', housekeeping: 'Ready', estReady: null },
      { roomNumber: '206', floor: '2', type: 'Deluxe Ocean Suite', view: 'Ocean View', bed: '1 King Bed + Living', status: 'READY', housekeeping: 'Ready', estReady: null },
      { roomNumber: '304', floor: '3', type: 'Classic King', view: 'Poolside', bed: '1 King Bed', status: 'READY', housekeeping: 'Ready', estReady: null },
      { roomNumber: '406', floor: '4', type: 'Executive Suite', view: 'Panoramic Skyline', bed: '1 King Bed', status: 'READY', housekeeping: 'Ready', estReady: null },
    ];

    // ──────────────────────────────────────────────────────────────────────────
    // 24 OPERATIONAL ARRIVALS DATASET (Monday, 8 September 2026)
    // Exactly matches operational summary metrics:
    // • Total Arrivals: 24
    // • Pending Check-in: 17
    // • Room Assigned: 19
    // • Room Unassigned: 5
    // • Room Not Ready: 3
    // • VIP Arrivals: 2
    // ──────────────────────────────────────────────────────────────────────────
    this.arrivals = [
      {
        id: 'arr-101', name: 'Sarah Mitchell', vip: true, vipTier: 'VIP', repeatGuest: true,
        badges: ['VIP', 'Repeat Guest', 'Early Arrival'],
        resNumber: 'RES-10482', confCode: 'VOL-88291', crsNumber: 'CRS-99201',
        arrivalTime: '2:00 PM', departureDate: 'Sep 10', nights: 2,
        roomNumber: '402', roomType: 'Deluxe King', guestsText: '2 Adults',
        resStatus: 'Confirmed', paymentState: 'PAID', paymentLabel: '✓ Paid',
        roomState: 'READY', roomReadinessLabel: '✓ Ready',
        totalAmount: 42480, paidAmount: 42480, balanceDue: 0, paymentMethod: 'Corporate Card',
        ratePlan: 'Direct VIP Flexible', bookingSource: 'Direct Website', company: 'Vanguard Capital',
        groupName: null, phone: '+1 (555) 382-9901', email: 's.mitchell@vanguard.com',
        nationality: 'United Kingdom', idType: 'PASSPORT', idNumber: 'GB-99214482',
        specialRequests: 'High floor, Airport pickup confirmed (Audi A8 at 1:30 PM), feather pillows, quiet courtyard view.',
        preferences: 'Hypoallergenic foam pillows, San Pellegrino sparkling water in mini-bar.',
        notes: 'VIP Guest. General Manager personal welcome letter placed in suite.',
        checkedIn: false
      },
      {
        id: 'arr-102', name: 'John Smith', vip: false, vipTier: null, repeatGuest: false,
        badges: ['First Stay'],
        resNumber: 'RES-10483', confCode: 'VOL-88292', crsNumber: 'CRS-99202',
        arrivalTime: '2:30 PM', departureDate: 'Sep 12', nights: 4,
        roomNumber: null, roomType: 'Deluxe King', guestsText: '1 Adult',
        resStatus: 'Confirmed', paymentState: 'PAID', paymentLabel: '✓ Paid',
        roomState: 'UNASSIGNED', roomReadinessLabel: '— Unassigned',
        totalAmount: 31500, paidAmount: 31500, balanceDue: 0, paymentMethod: 'Mastercard',
        ratePlan: 'BAR Flexible Rate', bookingSource: 'Expedia OTA', company: 'Acme Inc.',
        groupName: null, phone: '+1 (555) 304-9920', email: 'j.smith@acme.com',
        nationality: 'United States', idType: 'PASSPORT', idNumber: 'US-8821901',
        specialRequests: 'Quiet room away from elevator. Desk lamp.',
        preferences: 'Prefers high floor with natural lighting.',
        notes: 'Prepaid voucher verified via Expedia Connect.',
        checkedIn: false
      },
      {
        id: 'arr-103', name: 'Emma Wilson', vip: false, vipTier: null, repeatGuest: false,
        badges: ['Special Request'],
        resNumber: 'RES-10484', confCode: 'VOL-88293', crsNumber: 'CRS-99203',
        arrivalTime: '3:00 PM', departureDate: 'Sep 09', nights: 1,
        roomNumber: '508', roomType: 'Suite', guestsText: '2 Adults',
        resStatus: 'Confirmed', paymentState: 'BALANCE_DUE', paymentLabel: '⚠ Balance Due',
        roomState: 'CLEANING', roomReadinessLabel: '⚠ Cleaning · ~12 min',
        totalAmount: 18500, paidAmount: 8500, balanceDue: 10000, paymentMethod: 'Visa',
        ratePlan: 'Weekend Leisure Special', bookingSource: 'Direct Flex', company: null,
        groupName: null, phone: '+44 7700 900123', email: 'emma.w@london.co.uk',
        nationality: 'United Kingdom', idType: 'PASSPORT', idNumber: 'GB-4412098',
        specialRequests: 'Late checkout requested (2:00 PM), champagne bucket.',
        preferences: 'King size bed, non-feather bedding.',
        notes: 'Pending balance ₹10,000 to be settled upon arrival registration.',
        checkedIn: false
      },
      {
        id: 'arr-104', name: 'Ambassador Al-Mansoor', vip: true, vipTier: 'Royal VIP', repeatGuest: true,
        badges: ['VIP', 'Repeat Guest', 'Loyalty'],
        resNumber: 'RES-10476', confCode: 'VOL-88290', crsNumber: 'CRS-99200',
        arrivalTime: '1:30 PM', departureDate: 'Sep 15', nights: 7,
        roomNumber: '303', roomType: 'Deluxe Ocean Suite', guestsText: '2 Adults',
        resStatus: 'Confirmed', paymentState: 'PAID', paymentLabel: '✓ Paid',
        roomState: 'READY', roomReadinessLabel: '✓ Ready',
        totalAmount: 142000, paidAmount: 142000, balanceDue: 0, paymentMethod: 'Direct Wire',
        ratePlan: 'Diplomatic Suite Package', bookingSource: 'Embassy Protocol Direct', company: 'Kuwait Diplomatic Mission',
        groupName: null, phone: '+965 2200 4400', email: 'protocol@almansoor.kw',
        nationality: 'Kuwait', idType: 'DIPLOMATIC_PASSPORT', idNumber: 'KW-D00192',
        specialRequests: 'Private butler dispatch, Halal certified dining amenities, extra security clearance.',
        preferences: 'Room temperature fixed at 20.0°C, Arabic coffee service at 4:00 PM daily.',
        notes: 'Royal patron. Room 303 PRV shower valve verified by Maintenance this morning.',
        checkedIn: false
      },
      {
        id: 'arr-105', name: 'David Kumar', vip: false, vipTier: null, repeatGuest: true,
        badges: ['Group', 'Corporate'],
        resNumber: 'RES-10485', confCode: 'VOL-88294', crsNumber: 'CRS-99204',
        arrivalTime: '11:30 AM', departureDate: 'Sep 14', nights: 6,
        roomNumber: '201', roomType: 'Classic King', guestsText: '1 Adult',
        resStatus: 'Confirmed', paymentState: 'GUARANTEED', paymentLabel: '✓ Guaranteed',
        roomState: 'READY', roomReadinessLabel: '✓ Ready',
        totalAmount: 38400, paidAmount: 0, balanceDue: 38400, paymentMethod: 'Company Master Folio',
        ratePlan: 'Corporate Negotiated', bookingSource: 'Corporate Portal', company: 'TechCorp International',
        groupName: 'TECHCORP ANNUAL MEETING', phone: '+91 98210 11223', email: 'd.kumar@techcorp.com',
        nationality: 'India', idType: 'NATIONAL_ID', idNumber: 'IN-8829101',
        specialRequests: 'Room close to conference wing.',
        preferences: 'Morning newspaper (Financial Times), extra hangers.',
        notes: 'Room charges routed to TechCorp master billing account. Incidentals direct.',
        checkedIn: false
      },
      {
        id: 'arr-106', name: 'Elena Rostova', vip: false, vipTier: null, repeatGuest: false,
        badges: ['Special Request'],
        resNumber: 'RES-10486', confCode: 'VOL-88295', crsNumber: 'CRS-99205',
        arrivalTime: '4:15 PM', departureDate: 'Sep 11', nights: 3,
        roomNumber: '315', roomType: 'Classic King', guestsText: '2 Adults',
        resStatus: 'Confirmed', paymentState: 'DEPOSIT_DUE', paymentLabel: '⚠ Deposit Due',
        roomState: 'READY', roomReadinessLabel: '✓ Ready',
        totalAmount: 28500, paidAmount: 10000, balanceDue: 18500, paymentMethod: 'Card on File',
        ratePlan: 'Direct BAR', bookingSource: 'Booking.com', company: null,
        groupName: null, phone: '+33 612 345 678', email: 'e.rostova@artlux.fr',
        nationality: 'France', idType: 'PASSPORT', idNumber: 'FR-4481029',
        specialRequests: 'Twin bed setup requested. Non-smoking floor.',
        preferences: 'Tea facilities in room, city view.',
        notes: 'Pre-authorization of ₹5,000 incidental deposit required at desk.',
        checkedIn: false
      },
      {
        id: 'arr-107', name: 'Michael Chang', vip: false, vipTier: null, repeatGuest: false,
        badges: ['Group'],
        resNumber: 'RES-10487', confCode: 'VOL-88296', crsNumber: 'CRS-99206',
        arrivalTime: '4:30 PM', departureDate: 'Sep 14', nights: 6,
        roomNumber: '202', roomType: 'Classic King', guestsText: '1 Adult',
        resStatus: 'Confirmed', paymentState: 'GUARANTEED', paymentLabel: '✓ Guaranteed',
        roomState: 'INSPECTION_PENDING', roomReadinessLabel: '⚠ Inspection Pending',
        totalAmount: 38400, paidAmount: 0, balanceDue: 38400, paymentMethod: 'Company Master Folio',
        ratePlan: 'Corporate Negotiated', bookingSource: 'Corporate Portal', company: 'TechCorp International',
        groupName: 'TECHCORP ANNUAL MEETING', phone: '+65 9123 4567', email: 'm.chang@techcorp.sg',
        nationality: 'Singapore', idType: 'PASSPORT', idNumber: 'SG-K819201',
        specialRequests: 'High speed wired internet connection.',
        preferences: 'Firm mattress, quiet room.',
        notes: 'Cleaning completed by David Kim at 10:15 AM; supervisor inspection queued.',
        checkedIn: false
      },
      {
        id: 'arr-108', name: 'Carlos Ruiz', vip: false, vipTier: null, repeatGuest: true,
        badges: ['Repeat Guest'],
        resNumber: 'RES-10488', confCode: 'VOL-88297', crsNumber: 'CRS-99207',
        arrivalTime: '12:45 PM', departureDate: 'Sep 10', nights: 2,
        roomNumber: '305', roomType: 'Classic King', guestsText: '1 Adult',
        resStatus: 'Checked In', paymentState: 'PAID', paymentLabel: '✓ Paid',
        roomState: 'READY', roomReadinessLabel: '✓ Ready',
        totalAmount: 19000, paidAmount: 19000, balanceDue: 0, paymentMethod: 'Credit Card',
        ratePlan: 'Direct BAR', bookingSource: 'Direct Phone', company: null,
        groupName: null, phone: '+34 600 123 456', email: 'carlos.ruiz@madrid.es',
        nationality: 'Spain', idType: 'PASSPORT', idNumber: 'ES-B992019',
        specialRequests: 'Near elevator, ground/lower floor preferred.',
        preferences: 'Extra bath towels, wake-up call at 7:00 AM.',
        notes: 'Checked in at 11:15 AM by Front Desk T01.',
        checkedIn: true
      },
      {
        id: 'arr-109', name: 'Aisha Al-Mansoor', vip: false, vipTier: null, repeatGuest: true,
        badges: ['Repeat Guest'],
        resNumber: 'RES-10489', confCode: 'VOL-88298', crsNumber: 'CRS-99208',
        arrivalTime: '5:00 PM', departureDate: 'Sep 18', nights: 10,
        roomNumber: '501', roomType: 'Presidential Royal Penthouse', guestsText: '3 Adults',
        resStatus: 'Confirmed', paymentState: 'PAID', paymentLabel: '✓ Paid',
        roomState: 'READY', roomReadinessLabel: '✓ Ready',
        totalAmount: 240000, paidAmount: 240000, balanceDue: 0, paymentMethod: 'Direct Wire',
        ratePlan: 'Royal Package', bookingSource: 'Direct Concierge', company: 'Al-Mansoor Holding',
        groupName: null, phone: '+971 50 123 9988', email: 'a.almansoor@emirates.ae',
        nationality: 'United Arab Emirates', idType: 'PASSPORT', idNumber: 'AE-9920192',
        specialRequests: 'Connecting rooms for entourage, daily fresh orchids.',
        preferences: '24/7 dedicated butler service, room dining setup.',
        notes: 'Penthouse inspected and sealed by Executive Housekeeper.',
        checkedIn: false
      },
      {
        id: 'arr-110', name: 'Lucas Weber', vip: false, vipTier: null, repeatGuest: false,
        badges: ['Group', 'Corporate'],
        resNumber: 'RES-10490', confCode: 'VOL-88299', crsNumber: 'CRS-99209',
        arrivalTime: '6:30 PM', departureDate: 'Sep 14', nights: 6,
        roomNumber: '203', roomType: 'Classic King', guestsText: '1 Adult',
        resStatus: 'Confirmed', paymentState: 'BALANCE_DUE', paymentLabel: '⚠ Balance Due',
        roomState: 'CLEANING', roomReadinessLabel: '⚠ Cleaning · ~20 min',
        totalAmount: 38400, paidAmount: 20000, balanceDue: 18400, paymentMethod: 'Company Master Folio',
        ratePlan: 'Corporate Negotiated', bookingSource: 'Corporate Portal', company: 'TechCorp International',
        groupName: 'TECHCORP ANNUAL MEETING', phone: '+49 171 2345678', email: 'l.weber@techcorp.de',
        nationality: 'Germany', idType: 'PASSPORT', idNumber: 'DE-8829102',
        specialRequests: 'Iron and ironing board in room.',
        preferences: 'High floor, quiet corner.',
        notes: 'Partially pre-paid. Company card on file for balance.',
        checkedIn: false
      },
      {
        id: 'arr-111', name: 'Clara Dupont', vip: false, vipTier: null, repeatGuest: false,
        badges: ['Early Arrival'],
        resNumber: 'RES-10491', confCode: 'VOL-88300', crsNumber: 'CRS-99210',
        arrivalTime: '1:30 PM', departureDate: 'Sep 12', nights: 4,
        roomNumber: '404', roomType: 'Deluxe Ocean Suite', guestsText: '2 Adults',
        resStatus: 'Checked In', paymentState: 'PAID', paymentLabel: '✓ Paid',
        roomState: 'READY', roomReadinessLabel: '✓ Ready',
        totalAmount: 48000, paidAmount: 48000, balanceDue: 0, paymentMethod: 'Visa Card',
        ratePlan: 'Weekend Package', bookingSource: 'Direct Flex', company: null,
        groupName: null, phone: '+33 609 876 543', email: 'clara.dupont@paris.fr',
        nationality: 'France', idType: 'PASSPORT', idNumber: 'FR-9910238',
        specialRequests: 'Balcony view.',
        preferences: 'Extra pillows.',
        notes: 'Checked in at 10:45 AM.',
        checkedIn: true
      },
      {
        id: 'arr-112', name: 'Robert Lang', vip: false, vipTier: null, repeatGuest: true,
        badges: ['Repeat Guest'],
        resNumber: 'RES-10492', confCode: 'VOL-88301', crsNumber: 'CRS-99211',
        arrivalTime: '2:15 PM', departureDate: 'Sep 13', nights: 5,
        roomNumber: null, roomType: 'Classic King', guestsText: '1 Adult',
        resStatus: 'Confirmed', paymentState: 'PAID', paymentLabel: '✓ Paid',
        roomState: 'UNASSIGNED', roomReadinessLabel: '— Unassigned',
        totalAmount: 28000, paidAmount: 28000, balanceDue: 0, paymentMethod: 'Amex',
        ratePlan: 'Direct Corporate Flex', bookingSource: 'Direct Web', company: 'Global Media UK',
        groupName: null, phone: '+44 20 7946 0192', email: 'robert.lang@globalmedia.co.uk',
        nationality: 'United Kingdom', idType: 'PASSPORT', idNumber: 'GB-1029384',
        specialRequests: 'Needs room with bathtub.',
        preferences: 'Still water, green tea amenities.',
        notes: 'Room unassigned. Auto-assign Classic King on Floor 2 or 3.',
        checkedIn: false
      },
      {
        id: 'arr-113', name: 'Anna Becker', vip: false, vipTier: null, repeatGuest: false,
        badges: [],
        resNumber: 'RES-10493', confCode: 'VOL-88302', crsNumber: 'CRS-99212',
        arrivalTime: '3:15 PM', departureDate: 'Sep 11', nights: 3,
        roomNumber: '204', roomType: 'Classic King', guestsText: '1 Adult',
        resStatus: 'Confirmed', paymentState: 'PAID', paymentLabel: '✓ Paid',
        roomState: 'READY', roomReadinessLabel: '✓ Ready',
        totalAmount: 18000, paidAmount: 18000, balanceDue: 0, paymentMethod: 'Mastercard',
        ratePlan: 'Direct BAR', bookingSource: 'Direct Web', company: null,
        groupName: null, phone: '+49 30 123456', email: 'anna.becker@munich.de',
        nationality: 'Germany', idType: 'PASSPORT', idNumber: 'DE-9920194',
        specialRequests: 'Quiet room.',
        preferences: 'Feather pillows.',
        notes: 'Payment settled in full.',
        checkedIn: false
      },
      {
        id: 'arr-114', name: 'Sir William Sterling', vip: false, vipTier: null, repeatGuest: true,
        badges: ['Repeat Guest'],
        resNumber: 'RES-10494', confCode: 'VOL-88303', crsNumber: 'CRS-99213',
        arrivalTime: '1:00 PM', departureDate: 'Sep 16', nights: 8,
        roomNumber: '502', roomType: 'Presidential Royal Penthouse', guestsText: '2 Adults',
        resStatus: 'Checked In', paymentState: 'PAID', paymentLabel: '✓ Paid',
        roomState: 'READY', roomReadinessLabel: '✓ Ready',
        totalAmount: 192000, paidAmount: 192000, balanceDue: 0, paymentMethod: 'Amex Centurion',
        ratePlan: 'Presidential Suite Special', bookingSource: 'Direct Web VIP', company: 'Sterling Heritage Trust',
        groupName: null, phone: '+44 20 7946 0888', email: 'william@sterlingtrust.co.uk',
        nationality: 'United Kingdom', idType: 'PASSPORT', idNumber: 'GB-8829100',
        specialRequests: 'Private butler service, cigar lounge reservation.',
        preferences: 'Earl Grey tea, sparkling water.',
        notes: 'Checked in by reception at 09:30 AM.',
        checkedIn: true
      },
      {
        id: 'arr-115', name: 'Sophia Laurent', vip: false, vipTier: null, repeatGuest: false,
        badges: ['Early Arrival'],
        resNumber: 'RES-10495', confCode: 'VOL-88304', crsNumber: 'CRS-99214',
        arrivalTime: '10:30 AM', departureDate: 'Sep 12', nights: 4,
        roomNumber: '304', roomType: 'Classic King', guestsText: '1 Adult',
        resStatus: 'Checked In', paymentState: 'PAID', paymentLabel: '✓ Paid',
        roomState: 'READY', roomReadinessLabel: '✓ Ready',
        totalAmount: 22000, paidAmount: 22000, balanceDue: 0, paymentMethod: 'Visa',
        ratePlan: 'Early Bird Special', bookingSource: 'Direct Web', company: null,
        groupName: null, phone: '+33 1 42 68 00 00', email: 'sophia.laurent@paris.fr',
        nationality: 'France', idType: 'PASSPORT', idNumber: 'FR-8829104',
        specialRequests: 'Early check-in approved.',
        preferences: 'Courtyard view.',
        notes: 'Checked in early at 10:15 AM.',
        checkedIn: true
      },
      {
        id: 'arr-116', name: 'Marcus Aurel', vip: false, vipTier: null, repeatGuest: false,
        badges: ['Payment Issue'],
        resNumber: 'RES-10496', confCode: 'VOL-88305', crsNumber: 'CRS-99215',
        arrivalTime: '5:45 PM', departureDate: 'Sep 14', nights: 6,
        roomNumber: '301', roomType: 'Classic King', guestsText: '1 Adult',
        resStatus: 'Confirmed', paymentState: 'PAYMENT_ISSUE', paymentLabel: '⚠ Payment Issue',
        roomState: 'READY', roomReadinessLabel: '✓ Ready',
        totalAmount: 32000, paidAmount: 0, balanceDue: 32000, paymentMethod: 'Card Declined',
        ratePlan: 'OTA Package', bookingSource: 'Agoda', company: null,
        groupName: null, phone: '+39 06 698 1234', email: 'marcus.aurel@roma.it',
        nationality: 'Italy', idType: 'PASSPORT', idNumber: 'IT-9920194',
        specialRequests: 'Late arrival note.',
        preferences: 'Non-smoking floor.',
        notes: 'Credit card on file declined pre-auth. Collect new payment method on check-in.',
        checkedIn: false
      },
      {
        id: 'arr-117', name: 'Fatima Zahra', vip: false, vipTier: null, repeatGuest: false,
        badges: [],
        resNumber: 'RES-10497', confCode: 'VOL-88306', crsNumber: 'CRS-99216',
        arrivalTime: '6:00 PM', departureDate: 'Sep 13', nights: 5,
        roomNumber: '306', roomType: 'Classic King', guestsText: '1 Adult',
        resStatus: 'Confirmed', paymentState: 'GUARANTEED', paymentLabel: '✓ Guaranteed',
        roomState: 'READY', roomReadinessLabel: '✓ Ready',
        totalAmount: 26500, paidAmount: 0, balanceDue: 26500, paymentMethod: 'Corporate Guarantee',
        ratePlan: 'Corporate Direct', bookingSource: 'Direct Phone', company: 'Emirates Telecom',
        groupName: null, phone: '+971 4 222 1111', email: 'fatima.zahra@etisalat.ae',
        nationality: 'United Arab Emirates', idType: 'NATIONAL_ID', idNumber: 'AE-8819201',
        specialRequests: 'Halal amenities.',
        preferences: 'Quiet floor.',
        notes: 'Corporate billing voucher submitted.',
        checkedIn: false
      },
      {
        id: 'arr-118', name: 'David Kim', vip: false, vipTier: null, repeatGuest: false,
        badges: ['Group', 'Corporate'],
        resNumber: 'RES-10498', confCode: 'VOL-88307', crsNumber: 'CRS-99217',
        arrivalTime: '4:45 PM', departureDate: 'Sep 14', nights: 6,
        roomNumber: null, roomType: 'Classic King', guestsText: '1 Adult',
        resStatus: 'Confirmed', paymentState: 'GUARANTEED', paymentLabel: '✓ Guaranteed',
        roomState: 'UNASSIGNED', roomReadinessLabel: '— Unassigned',
        totalAmount: 38400, paidAmount: 0, balanceDue: 38400, paymentMethod: 'Company Master Folio',
        ratePlan: 'Corporate Negotiated', bookingSource: 'Corporate Portal', company: 'TechCorp International',
        groupName: 'TECHCORP ANNUAL MEETING', phone: '+82 2 1234 5678', email: 'd.kim@techcorp.kr',
        nationality: 'South Korea', idType: 'PASSPORT', idNumber: 'KR-8819201',
        specialRequests: 'Room on same floor as TechCorp delegates.',
        preferences: 'High floor, desk lamp.',
        notes: 'Unassigned room for TechCorp block. Recommend Room 205.',
        checkedIn: false
      },
      {
        id: 'arr-119', name: 'Maria Santos', vip: false, vipTier: null, repeatGuest: false,
        badges: [],
        resNumber: 'RES-10499', confCode: 'VOL-88308', crsNumber: 'CRS-99218',
        arrivalTime: '7:00 PM', departureDate: 'Sep 12', nights: 4,
        roomNumber: null, roomType: 'Deluxe King', guestsText: '2 Adults',
        resStatus: 'Confirmed', paymentState: 'PAID', paymentLabel: '✓ Paid',
        roomState: 'UNASSIGNED', roomReadinessLabel: '— Unassigned',
        totalAmount: 34000, paidAmount: 34000, balanceDue: 0, paymentMethod: 'Visa',
        ratePlan: 'Direct Flex', bookingSource: 'Direct Web', company: null,
        groupName: null, phone: '+63 2 8123 4567', email: 'm.santos@manila.ph',
        nationality: 'Philippines', idType: 'PASSPORT', idNumber: 'PH-9920194',
        specialRequests: 'Extra bath amenities.',
        preferences: 'Double bed or twin.',
        notes: 'Prepaid in full.',
        checkedIn: false
      },
      {
        id: 'arr-120', name: 'Julian Croft', vip: false, vipTier: null, repeatGuest: true,
        badges: ['Corporate', 'Repeat Guest'],
        resNumber: 'RES-10500', confCode: 'VOL-88309', crsNumber: 'CRS-99219',
        arrivalTime: '7:15 PM', departureDate: 'Sep 15', nights: 7,
        roomNumber: '206', roomType: 'Deluxe Ocean Suite', guestsText: '1 Adult',
        resStatus: 'Checked In', paymentState: 'PAID', paymentLabel: '✓ Paid',
        roomState: 'READY', roomReadinessLabel: '✓ Ready',
        totalAmount: 58000, paidAmount: 58000, balanceDue: 0, paymentMethod: 'Corporate Card',
        ratePlan: 'Corporate Partner', bookingSource: 'Direct Corporate', company: 'Volvitech Systems',
        groupName: null, phone: '+1 (555) 902-1144', email: 'julian.croft@volvitech.com',
        nationality: 'United States', idType: 'PASSPORT', idNumber: 'US-9910293',
        specialRequests: 'Fast Wi-Fi, desk workspace.',
        preferences: 'Ocean view.',
        notes: 'Checked in by reception at 08:30 AM.',
        checkedIn: true
      },
      {
        id: 'arr-121', name: 'Alexander Wright', vip: false, vipTier: null, repeatGuest: false,
        badges: ['Payment Issue'],
        resNumber: 'RES-10501', confCode: 'VOL-88310', crsNumber: 'CRS-99220',
        arrivalTime: '8:00 PM', departureDate: 'Sep 13', nights: 5,
        roomNumber: null, roomType: 'Classic King', guestsText: '1 Adult',
        resStatus: 'Confirmed', paymentState: 'DEPOSIT_DUE', paymentLabel: '⚠ Deposit Due',
        roomState: 'UNASSIGNED', roomReadinessLabel: '— Unassigned',
        totalAmount: 29000, paidAmount: 0, balanceDue: 29000, paymentMethod: 'Pay at Hotel',
        ratePlan: 'Direct Flex', bookingSource: 'Direct Phone', company: null,
        groupName: null, phone: '+44 20 8900 1234', email: 'a.wright@london.uk',
        nationality: 'United Kingdom', idType: 'PASSPORT', idNumber: 'GB-9920194',
        specialRequests: 'Late evening arrival.',
        preferences: 'Quiet room.',
        notes: 'Collect stay tariff + security deposit on arrival.',
        checkedIn: false
      },
      {
        id: 'arr-122', name: 'Priya Patel', vip: false, vipTier: null, repeatGuest: false,
        badges: [],
        resNumber: 'RES-10502', confCode: 'VOL-88311', crsNumber: 'CRS-99221',
        arrivalTime: '2:45 PM', departureDate: 'Sep 12', nights: 4,
        roomNumber: '205', roomType: 'Classic King', guestsText: '2 Adults',
        resStatus: 'Checked In', paymentState: 'PAID', paymentLabel: '✓ Paid',
        roomState: 'READY', roomReadinessLabel: '✓ Ready',
        totalAmount: 24000, paidAmount: 24000, balanceDue: 0, paymentMethod: 'UPI / NetBanking',
        ratePlan: 'Direct BAR', bookingSource: 'Direct Web', company: null,
        groupName: null, phone: '+91 99001 22334', email: 'priya.patel@mumbai.in',
        nationality: 'India', idType: 'AADHAAR', idNumber: 'IN-AAD-99201',
        specialRequests: 'Vegetarian breakfast package.',
        preferences: 'Courtyard view.',
        notes: 'Checked in at 11:45 AM.',
        checkedIn: true
      },
      {
        id: 'arr-123', name: 'Thomas Mueller', vip: false, vipTier: null, repeatGuest: false,
        badges: [],
        resNumber: 'RES-10503', confCode: 'VOL-88312', crsNumber: 'CRS-99222',
        arrivalTime: '5:15 PM', departureDate: 'Sep 11', nights: 3,
        roomNumber: '405', roomType: 'Executive Suite', guestsText: '2 Adults',
        resStatus: 'Confirmed', paymentState: 'PAID', paymentLabel: '✓ Paid',
        roomState: 'READY', roomReadinessLabel: '✓ Ready',
        totalAmount: 48000, paidAmount: 48000, balanceDue: 0, paymentMethod: 'Mastercard',
        ratePlan: 'Suite Special', bookingSource: 'Direct Web', company: null,
        groupName: null, phone: '+49 89 1234 5678', email: 't.mueller@bayern.de',
        nationality: 'Germany', idType: 'PASSPORT', idNumber: 'DE-8829104',
        specialRequests: 'King bed.',
        preferences: 'Extra towels.',
        notes: 'Payment confirmed.',
        checkedIn: false
      },
      {
        id: 'arr-124', name: 'Catherine Deneuve', vip: false, vipTier: null, repeatGuest: false,
        badges: ['Special Request'],
        resNumber: 'RES-10504', confCode: 'VOL-88313', crsNumber: 'CRS-99223',
        arrivalTime: '6:45 PM', departureDate: 'Sep 14', nights: 6,
        roomNumber: '406', roomType: 'Executive Suite', guestsText: '1 Adult',
        resStatus: 'Checked In', paymentState: 'PAID', paymentLabel: '✓ Paid',
        roomState: 'READY', roomReadinessLabel: '✓ Ready',
        totalAmount: 72000, paidAmount: 72000, balanceDue: 0, paymentMethod: 'Visa',
        ratePlan: 'Executive Deluxe', bookingSource: 'Booking.com', company: null,
        groupName: null, phone: '+33 1 45 67 89 01', email: 'c.deneuve@cinelux.fr',
        nationality: 'France', idType: 'PASSPORT', idNumber: 'FR-9920199',
        specialRequests: 'Quiet suite.',
        preferences: 'Daily fruit platter.',
        notes: 'Checked in early at 09:00 AM.',
        checkedIn: true
      },
    ];
  }

  async loadData() {
    this.isLoading = true;
    try {
      const res = await reservationsClient.getReservations();
      if (res && res.data && res.data.length > 0) {
        console.log('[ArrivalsCheckInView] Live API synced:', res.data.length);
        const existingNumbers = new Set(this.arrivals.map(a => a.resNumber));
        const liveArrivals = res.data
          .filter(r => !existingNumbers.has(r.reservation_number))
          .map(r => ({
            id: r.id,
            name: `${r.first_name} ${r.last_name}`,
            vip: r.vip_status === 'VIP' || r.vip_status === 'PLATINUM' || r.vip_status === 'GOLD',
            vipTier: r.vip_status,
            repeatGuest: false,
            badges: r.vip_status === 'PLATINUM' ? ['VIP', 'Corporate'] : ['Direct Booking'],
            resNumber: r.reservation_number,
            confCode: r.reservation_number,
            crsNumber: `CRS-${r.reservation_number.replace(/\D/g, '') || '9021'}`,
            arrivalTime: '2:00 PM',
            departureDate: r.check_out_date,
            nights: 2,
            roomNumber: r.allocated_room_number || null,
            roomType: r.room_type_name || 'Deluxe King',
            guestsText: `${r.adults || 1} Adult${(r.adults || 1) > 1 ? 's' : ''}`,
            resStatus: r.status === 'CHECKED_IN' ? 'Checked In' : 'Confirmed',
            paymentState: 'PAID',
            paymentLabel: '✓ Paid',
            roomState: r.allocated_room_number ? 'READY' : 'UNASSIGNED',
            roomReadinessLabel: r.allocated_room_number ? '✓ Ready' : '— Unassigned',
            totalAmount: Number(r.total_amount) || 1200,
            paidAmount: Number(r.total_amount) || 1200,
            balanceDue: 0,
            paymentMethod: 'Corporate Card',
            ratePlan: r.rate_plan_name || 'Best Available Rate',
            bookingSource: r.booking_source_name || 'Direct',
            company: r.booking_source_name?.includes('Corporate') ? 'Corporate Account' : '',
            groupName: null,
            phone: r.guest_phone || '+1 (555) 019-2831',
            email: r.guest_email || 'guest@example.com',
            nationality: r.nationality || 'United States',
            idType: r.id_document_type || 'PASSPORT',
            idNumber: r.id_document_number || 'US-98214',
            specialRequests: r.special_requests || '',
            preferences: '',
            notes: '',
            checkedIn: r.status === 'CHECKED_IN',
            isApiRecord: true
          }));
        if (liveArrivals.length > 0) {
          this.arrivals = [...liveArrivals, ...this.arrivals];
        }
      }
    } catch (err) {
      console.warn('[ArrivalsCheckInView] Using verified operational dataset', err);
    } finally {
      this.isLoading = false;
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // COMPUTED COUNTS
  // ──────────────────────────────────────────────────────────────────────────
  getSummaryCounts() {
    const total = this.arrivals.length; // 24
    const pending = this.arrivals.filter(a => !a.checkedIn).length; // 17
    const roomAssigned = this.arrivals.filter(a => !!a.roomNumber).length; // 19
    const roomUnassigned = this.arrivals.filter(a => !a.roomNumber).length; // 5
    const roomNotReady = this.arrivals.filter(a => a.roomState !== 'READY' && !!a.roomNumber).length; // 3
    const vip = this.arrivals.filter(a => a.vip).length; // 2

    return { total, pending, roomAssigned, roomUnassigned, roomNotReady, vip };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FILTERING & SORTING PIPELINE
  // ──────────────────────────────────────────────────────────────────────────
  getFilteredArrivals() {
    let list = [...this.arrivals];

    // 1. Global Search (Comprehensive Multi-field Search)
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter((a) => {
        return (
          a.name.toLowerCase().includes(q) ||
          (a.roomNumber && a.roomNumber.toLowerCase().includes(q)) ||
          a.resNumber.toLowerCase().includes(q) ||
          a.confCode.toLowerCase().includes(q) ||
          (a.crsNumber && a.crsNumber.toLowerCase().includes(q)) ||
          a.phone.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          (a.company && a.company.toLowerCase().includes(q)) ||
          (a.groupName && a.groupName.toLowerCase().includes(q)) ||
          a.bookingSource.toLowerCase().includes(q) ||
          a.roomType.toLowerCase().includes(q)
        );
      });
    }

    // 2. Summary Card Filter
    if (this.activeSummaryFilter === 'PENDING') {
      list = list.filter(a => !a.checkedIn);
    } else if (this.activeSummaryFilter === 'ASSIGNED') {
      list = list.filter(a => !!a.roomNumber);
    } else if (this.activeSummaryFilter === 'UNASSIGNED') {
      list = list.filter(a => !a.roomNumber);
    } else if (this.activeSummaryFilter === 'NOT_READY') {
      list = list.filter(a => a.roomState !== 'READY' && !!a.roomNumber);
    } else if (this.activeSummaryFilter === 'VIP') {
      list = list.filter(a => a.vip);
    }

    // 3. Quick Filter Chips
    if (this.activeQuickFilter === 'PENDING') {
      list = list.filter(a => !a.checkedIn);
    } else if (this.activeQuickFilter === 'UNASSIGNED') {
      list = list.filter(a => !a.roomNumber);
    } else if (this.activeQuickFilter === 'NOT_READY') {
      list = list.filter(a => a.roomState !== 'READY' && !!a.roomNumber);
    } else if (this.activeQuickFilter === 'VIP') {
      list = list.filter(a => a.vip);
    } else if (this.activeQuickFilter === 'GROUP') {
      list = list.filter(a => !!a.groupName);
    } else if (this.activeQuickFilter === 'PAY_ISSUE') {
      list = list.filter(a => a.paymentState === 'PAYMENT_ISSUE' || a.paymentState === 'BALANCE_DUE' || a.paymentState === 'DEPOSIT_DUE');
    } else if (this.activeQuickFilter === 'CHECKED_IN') {
      list = list.filter(a => a.checkedIn);
    }

    // 4. Advanced Filter Drawer Criteria
    const af = this.advancedFilters;
    if (af.lastName.trim()) {
      const q = af.lastName.toLowerCase().trim();
      list = list.filter(a => a.name.toLowerCase().split(' ').slice(1).join(' ').includes(q));
    }
    if (af.firstName.trim()) {
      const q = af.firstName.toLowerCase().trim();
      list = list.filter(a => a.name.toLowerCase().split(' ')[0].includes(q));
    }
    if (af.company.trim()) {
      const q = af.company.toLowerCase().trim();
      list = list.filter(a => a.company && a.company.toLowerCase().includes(q));
    }
    if (af.group.trim()) {
      const q = af.group.toLowerCase().trim();
      list = list.filter(a => a.groupName && a.groupName.toLowerCase().includes(q));
    }
    if (af.source !== 'ALL') {
      list = list.filter(a => a.bookingSource.toLowerCase().includes(af.source.toLowerCase()));
    }
    if (af.confNumber.trim()) {
      const q = af.confNumber.toLowerCase().trim();
      list = list.filter(a => a.confCode.toLowerCase().includes(q) || a.resNumber.toLowerCase().includes(q));
    }
    if (af.roomType !== 'ALL') {
      list = list.filter(a => a.roomType === af.roomType);
    }
    if (af.roomAssignment === 'ASSIGNED') {
      list = list.filter(a => !!a.roomNumber);
    } else if (af.roomAssignment === 'UNASSIGNED') {
      list = list.filter(a => !a.roomNumber);
    }
    if (af.roomReadiness !== 'ALL') {
      list = list.filter(a => a.roomState === af.roomReadiness);
    }
    if (af.paymentStatus !== 'ALL') {
      list = list.filter(a => a.paymentState === af.paymentStatus);
    }
    if (af.vipOnly) {
      list = list.filter(a => a.vip);
    }
    if (af.resStatus !== 'ALL') {
      list = list.filter(a => a.resStatus === af.resStatus);
    }

    // 5. Sorting
    list.sort((a, b) => {
      if (this.sortBy === 'TIME') {
        return a.arrivalTime.localeCompare(b.arrivalTime);
      } else if (this.sortBy === 'NAME') {
        return a.name.localeCompare(b.name);
      } else if (this.sortBy === 'ROOM') {
        return (a.roomNumber || '999').localeCompare(b.roomNumber || '999');
      } else if (this.sortBy === 'ROOM_TYPE') {
        return a.roomType.localeCompare(b.roomType);
      } else if (this.sortBy === 'STATUS') {
        return a.roomState.localeCompare(b.roomState);
      }
      return 0;
    });

    return list;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MOUNT & RENDER
  // ──────────────────────────────────────────────────────────────────────────
  render() {
    const el = document.createElement('div');
    el.className = 'w-full flex flex-col gap-6 animate-fadeIn pb-16 max-w-7xl mx-auto';
    this.container = el;

    this.renderContent();
    return el;
  }

  renderContent() {
    if (!this.container) return;

    const counts = this.getSummaryCounts();
    const filteredList = this.getFilteredArrivals();
    const selectedCount = this.selectedArrivalIds.size;
    const isAllSelected = filteredList.length > 0 && filteredList.every(a => this.selectedArrivalIds.has(a.id));

    this.container.innerHTML = `
      <!-- ============================================================= -->
      <!-- 1. PAGE HEADER -->
      <!-- ============================================================= -->
      <section class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-outline-variant/60">
        <div>
          <!-- Title & Subtitle -->
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">VOLVITECH HOSPITALITY OS</span>
            <span class="text-on-surface-variant font-data-mono text-xs">→</span>
            <span class="text-[10px] font-bold uppercase tracking-wider text-primary font-data-mono">Front Desk</span>
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 ml-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5 animate-pulse"></span>
              Live Check-In Desk
            </span>
          </div>

          <h1 class="font-headline-lg text-2xl sm:text-3xl font-bold text-primary tracking-tight">
            ARRIVALS
          </h1>
          <p class="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Today's expected arrivals and check-in readiness • <strong class="text-primary font-medium">Monday, 8 September 2026</strong> • 24 expected arrivals
          </p>
        </div>

        <!-- Header Action: + WALK-IN -->
        <div class="flex items-center gap-2.5">
          <button 
            id="btn-header-walkin"
            class="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Launch Walk-In Guest Workflow"
          >
            <span class="material-symbols-outlined text-[18px]">directions_walk</span>
            <span>+ WALK-IN</span>
          </button>
        </div>
      </section>

      <!-- ============================================================= -->
      <!-- 2. ARRIVAL SUMMARY CARDS (6 COMPACT OPERATIONAL CARDS) -->
      <!-- ============================================================= -->
      <section class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <!-- CARD 1: TOTAL ARRIVALS -->
        <button 
          class="btn-summary-card text-left bg-surface-container-lowest p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
            this.activeSummaryFilter === 'ALL' 
              ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs' 
              : 'border-outline-variant/70 hover:border-primary/50'
          }"
          data-filter="ALL"
          title="Filter: All 24 Arrivals"
        >
          <div class="flex items-center justify-between mb-1 w-full">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps">Total Arrivals</span>
            <span class="w-2 h-2 rounded-full bg-primary"></span>
          </div>
          <div>
            <span class="text-2xl sm:text-3xl font-black text-primary font-headline-lg">${counts.total}</span>
            <p class="text-[11px] text-on-surface-variant font-medium mt-0.5">Scheduled today</p>
          </div>
          <div class="mt-2.5 pt-1.5 border-t border-outline-variant/40 text-[10px] font-bold text-primary flex items-center justify-between w-full">
            <span>Show all</span>
            <span class="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
          </div>
        </button>

        <!-- CARD 2: PENDING CHECK-IN -->
        <button 
          class="btn-summary-card text-left bg-surface-container-lowest p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
            this.activeSummaryFilter === 'PENDING' 
              ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/40 shadow-xs' 
              : 'border-outline-variant/70 hover:border-amber-400'
          }"
          data-filter="PENDING"
          title="Filter: Pending Check-In (17)"
        >
          <div class="flex items-center justify-between mb-1 w-full">
            <span class="text-[10px] font-bold uppercase tracking-wider text-amber-900 font-label-caps">Pending Check-in</span>
            <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          </div>
          <div>
            <span class="text-2xl sm:text-3xl font-black text-amber-800 font-headline-lg">${counts.pending}</span>
            <p class="text-[11px] text-amber-900/80 font-medium mt-0.5">Not yet arrived</p>
          </div>
          <div class="mt-2.5 pt-1.5 border-t border-amber-200 text-[10px] font-bold text-amber-900 flex items-center justify-between w-full">
            <span>Show pending</span>
            <span class="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
          </div>
        </button>

        <!-- CARD 3: ROOM ASSIGNED -->
        <button 
          class="btn-summary-card text-left bg-surface-container-lowest p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
            this.activeSummaryFilter === 'ASSIGNED' 
              ? 'border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/40 shadow-xs' 
              : 'border-outline-variant/70 hover:border-emerald-400'
          }"
          data-filter="ASSIGNED"
          title="Filter: Room Assigned (19)"
        >
          <div class="flex items-center justify-between mb-1 w-full">
            <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-800 font-label-caps">Room Assigned</span>
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div>
            <span class="text-2xl sm:text-3xl font-black text-emerald-700 font-headline-lg">${counts.roomAssigned}</span>
            <p class="text-[11px] text-emerald-800/80 font-medium mt-0.5">Rooms allocated</p>
          </div>
          <div class="mt-2.5 pt-1.5 border-t border-emerald-200 text-[10px] font-bold text-emerald-700 flex items-center justify-between w-full">
            <span>Show assigned</span>
            <span class="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
          </div>
        </button>

        <!-- CARD 4: ROOM UNASSIGNED -->
        <button 
          class="btn-summary-card text-left bg-surface-container-lowest p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
            this.activeSummaryFilter === 'UNASSIGNED' 
              ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/40 shadow-xs' 
              : 'border-outline-variant/70 hover:border-rose-400'
          }"
          data-filter="UNASSIGNED"
          title="Filter: Room Unassigned (5)"
        >
          <div class="flex items-center justify-between mb-1 w-full">
            <span class="text-[10px] font-bold uppercase tracking-wider text-rose-800 font-label-caps">Room Unassigned</span>
            <span class="w-2 h-2 rounded-full bg-rose-500"></span>
          </div>
          <div>
            <span class="text-2xl sm:text-3xl font-black text-rose-700 font-headline-lg">${counts.roomUnassigned}</span>
            <p class="text-[11px] text-rose-800/80 font-medium mt-0.5">Needs allocation</p>
          </div>
          <div class="mt-2.5 pt-1.5 border-t border-rose-200 text-[10px] font-bold text-rose-700 flex items-center justify-between w-full">
            <span>Show unassigned</span>
            <span class="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
          </div>
        </button>

        <!-- CARD 5: ROOM NOT READY -->
        <button 
          class="btn-summary-card text-left bg-surface-container-lowest p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
            this.activeSummaryFilter === 'NOT_READY' 
              ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/40 shadow-xs' 
              : 'border-outline-variant/70 hover:border-orange-400'
          }"
          data-filter="NOT_READY"
          title="Filter: Room Not Ready (3)"
        >
          <div class="flex items-center justify-between mb-1 w-full">
            <span class="text-[10px] font-bold uppercase tracking-wider text-orange-900 font-label-caps">Room Not Ready</span>
            <span class="w-2 h-2 rounded-full bg-orange-500"></span>
          </div>
          <div>
            <span class="text-2xl sm:text-3xl font-black text-orange-800 font-headline-lg">${counts.roomNotReady}</span>
            <p class="text-[11px] text-orange-900/80 font-medium mt-0.5">Cleaning or inspect</p>
          </div>
          <div class="mt-2.5 pt-1.5 border-t border-orange-200 text-[10px] font-bold text-orange-800 flex items-center justify-between w-full">
            <span>Show not ready</span>
            <span class="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
          </div>
        </button>

        <!-- CARD 6: VIP ARRIVALS -->
        <button 
          class="btn-summary-card text-left bg-surface-container-lowest p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
            this.activeSummaryFilter === 'VIP' 
              ? 'border-purple-600 ring-2 ring-purple-600/20 bg-purple-50/40 shadow-xs' 
              : 'border-outline-variant/70 hover:border-purple-400'
          }"
          data-filter="VIP"
          title="Filter: VIP Arrivals (2)"
        >
          <div class="flex items-center justify-between mb-1 w-full">
            <span class="text-[10px] font-bold uppercase tracking-wider text-purple-900 font-label-caps">VIP Arrivals</span>
            <span class="w-2 h-2 rounded-full bg-purple-600"></span>
          </div>
          <div>
            <span class="text-2xl sm:text-3xl font-black text-purple-800 font-headline-lg">${counts.vip}</span>
            <p class="text-[11px] text-purple-900/80 font-medium mt-0.5">VIP guest protocols</p>
          </div>
          <div class="mt-2.5 pt-1.5 border-t border-purple-200 text-[10px] font-bold text-purple-800 flex items-center justify-between w-full">
            <span>Show VIPs</span>
            <span class="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
          </div>
        </button>

      </section>

      <!-- ============================================================= -->
      <!-- 3. SEARCH & ADVANCED FILTERS BAR -->
      <!-- ============================================================= -->
      <section class="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/70 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        <!-- Global Search Input -->
        <div class="relative flex-1">
          <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant">
            search
          </span>
          <input 
            type="text" 
            id="input-arrivals-search"
            value="${this.searchQuery}"
            placeholder="Search guest, reservation, room, confirmation number..."
            class="w-full pl-10 pr-10 py-2.5 bg-surface-bright rounded-xl border border-outline-variant text-xs text-primary font-medium placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-xs"
          />
          ${this.searchQuery ? `
            <button id="btn-clear-search-x" class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary">
              <span class="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          ` : ''}
        </div>

        <!-- Filter Controls -->
        <div class="flex items-center gap-2 shrink-0">
          <button 
            id="btn-open-advanced-filters"
            class="px-3.5 py-2.5 rounded-xl border ${
              this._hasActiveAdvancedFilters() 
                ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs' 
                : 'border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-primary font-semibold'
            } text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">tune</span>
            <span>Advanced Filters</span>
            ${this._hasActiveAdvancedFilters() ? `
              <span class="w-2 h-2 rounded-full bg-primary"></span>
            ` : ''}
          </button>

          <button 
            id="btn-clear-all-filters"
            class="px-3 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container text-on-surface-variant hover:text-primary text-xs font-semibold transition-all cursor-pointer"
            title="Reset All Filters"
          >
            Clear
          </button>
        </div>
      </section>

      <!-- ============================================================= -->
      <!-- 4. QUICK FILTER CHIPS & SORTING BAR -->
      <!-- ============================================================= -->
      <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        
        <!-- Filter Chips -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
          ${[
            { id: 'ALL', label: 'All', count: counts.total },
            { id: 'PENDING', label: 'Pending Check-in', count: counts.pending },
            { id: 'UNASSIGNED', label: 'Room Unassigned', count: counts.roomUnassigned },
            { id: 'NOT_READY', label: 'Room Not Ready', count: counts.roomNotReady },
            { id: 'VIP', label: 'VIP Arrivals', count: counts.vip },
            { id: 'GROUP', label: 'Groups', count: 4 },
            { id: 'PAY_ISSUE', label: 'Payment Issue', count: 4 },
            { id: 'CHECKED_IN', label: 'Checked In', count: 7 },
          ].map(chip => {
            const isActive = this.activeQuickFilter === chip.id;
            return `
              <button 
                class="btn-quick-filter px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isActive 
                    ? 'bg-primary text-on-primary shadow-xs' 
                    : 'bg-surface-container-lowest border border-outline-variant/70 text-on-surface-variant hover:bg-surface-container hover:text-primary'
                }"
                data-qf="${chip.id}"
              >
                <span>${chip.label}</span>
                <span class="text-[10px] font-data-mono px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface-variant'}">${chip.count}</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Sort Control -->
        <div class="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <span class="text-[11px] font-bold text-on-surface-variant font-label-caps uppercase">Sort by:</span>
          <select id="sel-arrivals-sort" class="border border-outline-variant rounded-xl font-data-mono text-xs py-1.5 px-2.5 bg-surface-bright text-primary focus:outline-none focus:border-primary cursor-pointer">
            <option value="TIME" ${this.sortBy === 'TIME' ? 'selected' : ''}>Arrival Time</option>
            <option value="NAME" ${this.sortBy === 'NAME' ? 'selected' : ''}>Guest Name</option>
            <option value="ROOM" ${this.sortBy === 'ROOM' ? 'selected' : ''}>Room Number</option>
            <option value="ROOM_TYPE" ${this.sortBy === 'ROOM_TYPE' ? 'selected' : ''}>Room Type</option>
            <option value="STATUS" ${this.sortBy === 'STATUS' ? 'selected' : ''}>Status</option>
          </select>
        </div>
      </section>

      <!-- ============================================================= -->
      <!-- 5. GROUP ARRIVAL HIGHLIGHT BANNER -->
      <!-- ============================================================= -->
      <section class="bg-surface-container-lowest rounded-2xl p-3.5 border border-outline-variant/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-[20px]">groups</span>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-xs text-primary font-headline-sm">TECHCORP ANNUAL MEETING</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">Corporate Group Block</span>
            </div>
            <p class="text-[11px] text-on-surface-variant mt-0.5">
              4 arrivals today • 1 checked in • 3 pending • 3 rooms assigned • 1 room pending (David Kim)
            </p>
          </div>
        </div>

        <button 
          id="btn-filter-techcorp" 
          class="px-3 py-1.5 rounded-lg border border-purple-300 text-purple-800 bg-purple-50 hover:bg-purple-100 text-xs font-bold transition-all shrink-0 cursor-pointer"
        >
          ${this.activeQuickFilter === 'GROUP' ? 'Showing Group' : 'Filter TechCorp Arrivals'}
        </button>
      </section>

      <!-- ============================================================= -->
      <!-- 6. MASS ACTION BAR (SHOWN WHEN CHECKBOXES ARE SELECTED) -->
      <!-- ============================================================= -->
      ${selectedCount > 0 ? `
        <section class="bg-primary text-on-primary rounded-2xl p-3.5 shadow-md flex items-center justify-between gap-4 animate-scaleUp">
          <div class="flex items-center gap-2.5 text-xs font-bold">
            <span class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-data-mono">${selectedCount}</span>
            <span>${selectedCount} ${selectedCount === 1 ? 'arrival' : 'arrivals'} selected</span>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <button id="btn-mass-checkin" class="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 cursor-pointer">
              <span class="material-symbols-outlined text-[16px]">how_to_reg</span>
              <span>MASS CHECK-IN</span>
            </button>

            <button id="btn-mass-assign" class="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-all flex items-center gap-1 cursor-pointer">
              <span class="material-symbols-outlined text-[16px]">meeting_room</span>
              <span>ASSIGN ROOMS</span>
            </button>

            <button id="btn-mass-print" class="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-all flex items-center gap-1 cursor-pointer">
              <span class="material-symbols-outlined text-[16px]">print</span>
              <span>PRINT REGISTRATION</span>
            </button>

            <button id="btn-mass-clear" class="px-2.5 py-1.5 text-xs text-white/80 hover:text-white underline cursor-pointer">
              Cancel
            </button>
          </div>
        </section>
      ` : ''}

      <!-- ============================================================= -->
      <!-- 7. MAIN ARRIVAL TABLE -->
      <!-- ============================================================= -->
      <section class="bg-surface-container-lowest rounded-2xl border border-outline-variant/70 shadow-xs overflow-hidden">
        
        ${filteredList.length === 0 ? `
          <!-- Empty State -->
          <div class="p-12 text-center flex flex-col items-center justify-center">
            <div class="w-12 h-12 rounded-2xl bg-surface-container text-on-surface-variant flex items-center justify-center mb-3">
              <span class="material-symbols-outlined text-[28px]">search_off</span>
            </div>
            <h3 class="font-bold text-sm text-primary">No arrivals match your filters</h3>
            <p class="text-xs text-on-surface-variant mt-1 max-w-sm">
              Try modifying your search term, clearing active filters, or expanding the arrival range.
            </p>
            <button id="btn-empty-clear" class="mt-4 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90">
              Clear Filters
            </button>
          </div>
        ` : `
          <!-- Table -->
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-surface-bright border-b border-outline-variant/60 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps select-none">
                  <th class="py-3 px-3 w-8 text-center">
                    <input type="checkbox" id="chk-select-all" ${isAllSelected ? 'checked' : ''} class="rounded text-primary focus:ring-primary cursor-pointer">
                  </th>
                  <th class="py-3 px-2 w-8 text-center">Status</th>
                  <th class="py-3 px-4 min-w-[200px]">Guest</th>
                  <th class="py-3 px-3 min-w-[90px]">Arrival</th>
                  <th class="py-3 px-3 min-w-[90px]">Departure</th>
                  <th class="py-3 px-3 min-w-[100px]">Room</th>
                  <th class="py-3 px-3 min-w-[130px]">Room Type</th>
                  <th class="py-3 px-3 min-w-[80px]">Guests</th>
                  <th class="py-3 px-3 min-w-[110px]">Reservation</th>
                  <th class="py-3 px-3 min-w-[110px]">Payment</th>
                  <th class="py-3 px-3 min-w-[130px]">Room Readiness</th>
                  <th class="py-3 px-4 text-right min-w-[130px]">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/40">
                ${filteredList.map((a) => {
                  const isSelected = this.selectedArrivalIds.has(a.id);
                  const isCheckedIn = a.checkedIn;
                  
                  // Status Dot Indicator
                  let statusDot = '<span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" title="Ready to Check In"></span>';
                  if (isCheckedIn) {
                    statusDot = '<span class="w-2.5 h-2.5 rounded-full bg-primary inline-block" title="Already Checked In"></span>';
                  } else if (!a.roomNumber) {
                    statusDot = '<span class="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block animate-pulse" title="Room Unassigned"></span>';
                  } else if (a.roomState !== 'READY') {
                    statusDot = '<span class="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" title="Room Not Ready"></span>';
                  }

                  // Payment Badge Styling
                  let payBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  if (a.paymentState === 'BALANCE_DUE' || a.paymentState === 'DEPOSIT_DUE') {
                    payBadge = 'bg-amber-50 text-amber-800 border-amber-200';
                  } else if (a.paymentState === 'PAYMENT_ISSUE') {
                    payBadge = 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
                  } else if (a.paymentState === 'GUARANTEED') {
                    payBadge = 'bg-blue-50 text-blue-700 border-blue-200';
                  }

                  // Room Readiness Badge Styling
                  let readyBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  if (a.roomState === 'UNASSIGNED') {
                    readyBadge = 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
                  } else if (a.roomState === 'CLEANING') {
                    readyBadge = 'bg-amber-50 text-amber-800 border-amber-200';
                  } else if (a.roomState === 'INSPECTION_PENDING') {
                    readyBadge = 'bg-teal-50 text-teal-800 border-teal-200';
                  }

                  return `
                    <tr 
                      class="row-arrival hover:bg-surface-bright transition-colors cursor-pointer ${isSelected ? 'bg-primary/5' : ''}"
                      data-id="${a.id}"
                    >
                      <!-- Checkbox -->
                      <td class="py-3 px-3 text-center" onclick="event.stopPropagation()">
                        <input type="checkbox" class="chk-arrival rounded text-primary focus:ring-primary cursor-pointer" data-id="${a.id}" ${isSelected ? 'checked' : ''}>
                      </td>

                      <!-- Status Dot -->
                      <td class="py-3 px-2 text-center">
                        ${statusDot}
                      </td>

                      <!-- Guest Column (Name + Contextual Badges) -->
                      <td class="py-3 px-4">
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-primary text-xs hover:underline">${a.name}</span>
                        </div>
                        
                        <!-- Contextual Badges Below Name -->
                        ${a.badges.length > 0 ? `
                          <div class="flex items-center gap-1 mt-0.5 flex-wrap">
                            ${a.badges.map(b => {
                              let badgeColor = 'bg-surface-container text-on-surface-variant';
                              if (b === 'VIP') badgeColor = 'bg-purple-100 text-purple-800 border border-purple-200 font-bold';
                              else if (b === 'Repeat Guest') badgeColor = 'bg-blue-100 text-blue-800';
                              else if (b === 'Group') badgeColor = 'bg-purple-50 text-purple-700 border border-purple-200';
                              else if (b === 'Early Arrival') badgeColor = 'bg-amber-100 text-amber-900 border border-amber-200';
                              else if (b === 'Payment Issue') badgeColor = 'bg-rose-100 text-rose-800 font-bold';
                              return `<span class="px-1.5 py-0.2 rounded text-[9px] ${badgeColor}">${b}</span>`;
                            }).join('')}
                          </div>
                        ` : ''}
                      </td>

                      <!-- Arrival Time -->
                      <td class="py-3 px-3 font-data-mono text-[11px] text-on-surface-variant font-medium">
                        ${a.arrivalTime}
                      </td>

                      <!-- Departure Date -->
                      <td class="py-3 px-3 font-data-mono text-[11px] text-on-surface-variant">
                        ${a.departureDate} (${a.nights}n)
                      </td>

                      <!-- Room -->
                      <td class="py-3 px-3 font-data-mono text-xs">
                        ${a.roomNumber ? `
                          <span class="font-bold text-primary bg-surface-container px-2 py-0.5 rounded-md">
                            ${a.roomNumber}
                          </span>
                        ` : `
                          <span class="text-rose-700 font-bold">
                            —
                          </span>
                        `}
                      </td>

                      <!-- Room Type -->
                      <td class="py-3 px-3 text-on-surface-variant truncate max-w-[130px]">
                        ${a.roomType}
                      </td>

                      <!-- Guests -->
                      <td class="py-3 px-3 text-on-surface-variant">
                        ${a.guestsText}
                      </td>

                      <!-- Reservation Status -->
                      <td class="py-3 px-3">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${isCheckedIn ? 'bg-primary/10 text-primary' : 'bg-surface-container text-on-surface-variant'}">
                          ${a.resStatus}
                        </span>
                      </td>

                      <!-- Payment Status -->
                      <td class="py-3 px-3">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold border ${payBadge} whitespace-nowrap">
                          ${a.paymentLabel}
                        </span>
                      </td>

                      <!-- Room Readiness -->
                      <td class="py-3 px-3">
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold border ${readyBadge} whitespace-nowrap">
                          ${a.roomReadinessLabel}
                        </span>
                      </td>

                      <!-- Contextual Action Button -->
                      <td class="py-3 px-4 text-right" onclick="event.stopPropagation()">
                        ${isCheckedIn ? `
                          <span class="text-[11px] text-on-surface-variant font-bold">Checked In</span>
                        ` : !a.roomNumber ? `
                          <button 
                            class="btn-row-assign px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shadow-xs cursor-pointer active:scale-95"
                            data-id="${a.id}"
                          >
                            Assign
                          </button>
                        ` : a.roomState !== 'READY' ? `
                          <button 
                            class="btn-row-view-options px-2.5 py-1 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] cursor-pointer"
                            data-id="${a.id}"
                          >
                            View
                          </button>
                        ` : `
                          <button 
                            class="btn-row-checkin px-3 py-1 rounded-lg bg-primary hover:bg-primary/90 text-on-primary font-bold text-[11px] shadow-xs cursor-pointer active:scale-95"
                            data-id="${a.id}"
                          >
                            Check In
                          </button>
                        `}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <!-- Table Footer Pagination/Count -->
          <div class="px-5 py-3 border-t border-outline-variant/50 bg-surface-bright flex items-center justify-between text-xs text-on-surface-variant">
            <span>Showing <strong class="text-primary font-data-mono">${filteredList.length}</strong> of 24 arrivals</span>
            <div class="flex items-center gap-2">
              <span class="font-data-mono text-[11px]">PMS Spine Active • Room Engine Sync</span>
            </div>
          </div>
        `}
      </section>

      <!-- ============================================================= -->
      <!-- 8. SLIDE-OVER DETAIL DRAWER (WHEN ROW IS CLICKED) -->
      <!-- ============================================================= -->
      ${this.activeDrawerArrival ? this._renderDetailDrawer(this.activeDrawerArrival) : ''}

      <!-- ============================================================= -->
      <!-- 9. ADVANCED FILTERS DRAWER -->
      <!-- ============================================================= -->
      ${this.isAdvancedFilterOpen ? this._renderAdvancedFilterDrawer() : ''}

      <!-- ============================================================= -->
      <!-- 10. ROOM ASSIGNMENT DRAWER / MODAL -->
      <!-- ============================================================= -->
      ${this.activeAssignModalArrival ? this._renderAssignModal(this.activeAssignModalArrival) : ''}

      <!-- ============================================================= -->
      <!-- 11. ROOM NOT READY GUIDANCE MODAL -->
      <!-- ============================================================= -->
      ${this.activeNotReadyArrival ? this._renderNotReadyModal(this.activeNotReadyArrival) : ''}

      <!-- ============================================================= -->
      <!-- 12. REGISTRATION CARD MODAL -->
      <!-- ============================================================= -->
      ${this.activeRegCardArrival ? this._renderRegistrationCardModal(this.activeRegCardArrival) : ''}

      <!-- ============================================================= -->
      <!-- 13. WALK-IN WORKFLOW MODAL -->
      <!-- ============================================================= -->
      ${this.activeWalkInModal ? this._renderWalkInModal() : ''}
    `;

    this.bindEvents();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // DRAWER: ARRIVAL DETAIL SLIDE-OVER
  // ──────────────────────────────────────────────────────────────────────────
  _renderDetailDrawer(a) {
    const isReady = a.roomNumber && a.roomState === 'READY';
    const isUnassigned = !a.roomNumber;
    const isNotReady = a.roomNumber && a.roomState !== 'READY';
    const hasPayIssue = a.paymentState === 'PAYMENT_ISSUE' || a.paymentState === 'BALANCE_DUE';

    return `
      <div id="drawer-backdrop" class="fixed inset-0 bg-black/40 z-50 flex justify-end animate-fadeIn">
        <div class="bg-surface-container-lowest w-full max-w-xl h-full shadow-2xl border-l border-outline-variant flex flex-col justify-between overflow-y-auto animate-slideInRight">
          
          <!-- Drawer Header -->
          <div class="p-6 border-b border-outline-variant bg-surface-bright">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">Arrival Details</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${a.checkedIn ? 'bg-primary/10 text-primary' : 'bg-emerald-100 text-emerald-800'}">
                  ${a.resStatus}
                </span>
                ${a.vip ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">${a.vipTier || 'VIP'}</span>` : ''}
              </div>
              <button id="btn-close-drawer" class="p-1 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors cursor-pointer">
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <h2 class="font-headline-lg text-2xl font-bold text-primary">${a.name}</h2>
            <div class="flex items-center gap-2 text-xs text-on-surface-variant mt-1">
              <span>Conf: <strong class="font-data-mono text-primary">${a.confCode}</strong></span>
              <span>•</span>
              <span>CRS: <strong class="font-data-mono text-primary">${a.crsNumber}</strong></span>
            </div>
          </div>

          <!-- Drawer Body Sections -->
          <div class="p-6 space-y-6 flex-1 text-xs">
            
            <!-- Contextual Primary Action Prompt -->
            <div class="p-4 rounded-xl border ${
              isReady 
                ? 'bg-emerald-50/50 border-emerald-200' 
                : isUnassigned 
                ? 'bg-rose-50/50 border-rose-200' 
                : isNotReady 
                ? 'bg-amber-50/50 border-amber-200' 
                : 'bg-surface-bright border-outline-variant'
            }">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <div class="font-bold text-primary text-xs flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[16px] ${isReady ? 'text-emerald-700' : isUnassigned ? 'text-rose-700' : 'text-amber-700'}">
                      ${isReady ? 'verified' : isUnassigned ? 'meeting_room' : 'schedule'}
                    </span>
                    <span>
                      ${isReady ? 'Ready for Immediate Check-In' : isUnassigned ? 'Room Needs Assignment' : isNotReady ? 'Room Not Ready (Turnover)' : 'Review Payment'}
                    </span>
                  </div>
                  <p class="text-[11px] text-on-surface-variant mt-0.5">
                    ${isReady ? 'Room inspected and keycard encoder ready.' : isUnassigned ? 'Select a room before completing guest check-in.' : 'Housekeeping is completing turnover. Options available.'}
                  </p>
                </div>

                <!-- Primary Action Button -->
                <div>
                  ${a.checkedIn ? `
                    <span class="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">Checked In</span>
                  ` : isReady ? `
                    <button id="btn-drawer-primary-checkin" class="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs shadow-sm active:scale-95 cursor-pointer">
                      CHECK IN GUEST
                    </button>
                  ` : isUnassigned ? `
                    <button id="btn-drawer-primary-assign" class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm active:scale-95 cursor-pointer">
                      ASSIGN ROOM
                    </button>
                  ` : `
                    <button id="btn-drawer-primary-options" class="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm active:scale-95 cursor-pointer">
                      VIEW ROOM OPTIONS
                    </button>
                  `}
                </div>
              </div>
            </div>

            <!-- GUEST INFO -->
            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps mb-2">Guest Information</div>
              <div class="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-surface-bright border border-outline-variant/60">
                <div>
                  <span class="text-[10px] text-on-surface-variant block">Phone</span>
                  <span class="font-data-mono font-medium text-primary">${a.phone}</span>
                </div>
                <div>
                  <span class="text-[10px] text-on-surface-variant block">Email</span>
                  <span class="font-medium text-primary truncate block">${a.email}</span>
                </div>
                <div>
                  <span class="text-[10px] text-on-surface-variant block">Nationality</span>
                  <span class="font-medium text-primary">${a.nationality}</span>
                </div>
                <div>
                  <span class="text-[10px] text-on-surface-variant block">${a.idType}</span>
                  <span class="font-data-mono font-medium text-primary">${a.idNumber}</span>
                </div>
              </div>
            </div>

            <!-- RESERVATION DETAILS -->
            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps mb-2">Reservation</div>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-surface-bright border border-outline-variant/60">
                <div>
                  <span class="text-[10px] text-on-surface-variant block">Arrival</span>
                  <span class="font-bold text-primary">${a.arrivalTime}</span>
                </div>
                <div>
                  <span class="text-[10px] text-on-surface-variant block">Departure</span>
                  <span class="font-bold text-primary">${a.departureDate} (${a.nights} nights)</span>
                </div>
                <div>
                  <span class="text-[10px] text-on-surface-variant block">Guests</span>
                  <span class="font-medium text-primary">${a.guestsText}</span>
                </div>
                <div>
                  <span class="text-[10px] text-on-surface-variant block">Room Category</span>
                  <span class="font-medium text-primary">${a.roomType}</span>
                </div>
                <div>
                  <span class="text-[10px] text-on-surface-variant block">Rate Plan</span>
                  <span class="font-medium text-primary">${a.ratePlan}</span>
                </div>
                <div>
                  <span class="text-[10px] text-on-surface-variant block">Booking Source</span>
                  <span class="font-medium text-primary">${a.bookingSource}</span>
                </div>
              </div>
            </div>

            <!-- ROOM DETAILS -->
            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps mb-2">Room Details</div>
              <div class="p-3 rounded-xl bg-surface-bright border border-outline-variant/60 flex items-center justify-between">
                <div>
                  <div class="text-sm font-black text-primary font-data-mono">
                    ${a.roomNumber ? `Room ${a.roomNumber}` : '<span class="text-rose-700">Room Unassigned</span>'}
                  </div>
                  <div class="text-[11px] text-on-surface-variant mt-0.5">
                    Readiness: <strong class="text-primary">${a.roomReadinessLabel}</strong>
                  </div>
                </div>
                <div>
                  <button id="btn-drawer-change-room" class="px-3 py-1 rounded-lg border border-outline-variant hover:bg-surface-container font-bold text-xs text-primary cursor-pointer">
                    ${a.roomNumber ? 'Change Room' : 'Assign Room'}
                  </button>
                </div>
              </div>
            </div>

            <!-- PAYMENT SUMMARY -->
            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps mb-2">Payment</div>
              <div class="p-3 rounded-xl bg-surface-bright border border-outline-variant/60">
                <div class="flex justify-between py-1 border-b border-outline-variant/40">
                  <span class="text-on-surface-variant">Total Charges:</span>
                  <span class="font-bold text-primary font-data-mono">₹${a.totalAmount.toLocaleString()}</span>
                </div>
                <div class="flex justify-between py-1 border-b border-outline-variant/40">
                  <span class="text-on-surface-variant">Paid to Date:</span>
                  <span class="font-bold text-emerald-700 font-data-mono">₹${a.paidAmount.toLocaleString()}</span>
                </div>
                <div class="flex justify-between py-1 font-bold">
                  <span class="${a.balanceDue > 0 ? 'text-rose-700' : 'text-primary'}">Outstanding Balance:</span>
                  <span class="font-data-mono ${a.balanceDue > 0 ? 'text-rose-700' : 'text-emerald-700'}">₹${a.balanceDue.toLocaleString()}</span>
                </div>
                <div class="text-[11px] text-on-surface-variant mt-1">
                  Method: <span class="font-medium text-primary">${a.paymentMethod}</span>
                </div>
              </div>
            </div>

            <!-- GUEST NOTES & PREFERENCES -->
            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps mb-2">Guest Notes & Preferences</div>
              <div class="p-3 rounded-xl bg-surface-bright border border-outline-variant/60 space-y-2">
                <div>
                  <span class="text-[10px] text-on-surface-variant block font-semibold">Special Requests:</span>
                  <p class="text-primary text-[11px]">${a.specialRequests || 'None recorded'}</p>
                </div>
                <div>
                  <span class="text-[10px] text-on-surface-variant block font-semibold">Stay Preferences:</span>
                  <p class="text-primary text-[11px]">${a.preferences || 'Standard hotel setup'}</p>
                </div>
                ${a.notes ? `
                  <div class="pt-1.5 border-t border-outline-variant/40">
                    <span class="text-[10px] text-amber-900 block font-bold">Front Desk Alert:</span>
                    <p class="text-primary text-[11px] font-medium">${a.notes}</p>
                  </div>
                ` : ''}
              </div>
            </div>

          </div>

          <!-- Drawer Footer Quick & More Actions -->
          <div class="p-4 border-t border-outline-variant bg-surface-bright flex items-center justify-between gap-2">
            <!-- Secondary Quick Actions -->
            <div class="flex items-center gap-1.5 flex-wrap">
              <button id="btn-drawer-view-res" class="px-2.5 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container font-semibold text-[11px] text-primary cursor-pointer">
                View Res
              </button>
              <button id="btn-drawer-view-profile" class="px-2.5 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container font-semibold text-[11px] text-primary cursor-pointer">
                Guest Profile
              </button>
              <button id="btn-drawer-view-folio" class="px-2.5 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container font-semibold text-[11px] text-primary cursor-pointer">
                View Folio
              </button>
              <button id="btn-drawer-reg-card" class="px-2.5 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container font-semibold text-[11px] text-primary cursor-pointer flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">badge</span>
                <span>Reg Card</span>
              </button>
            </div>

            <!-- More Actions Dropdown Toggle -->
            <div class="relative">
              <button id="btn-drawer-more-toggle" class="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs flex items-center gap-1 cursor-pointer">
                <span>More Actions</span>
                <span class="material-symbols-outlined text-[16px]">expand_more</span>
              </button>

              <div id="drawer-more-menu" class="hidden absolute right-0 bottom-full mb-1 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl p-1 z-30 space-y-0.5">
                <button class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-surface-container text-xs text-primary flex items-center gap-2" id="ma-prereg">
                  <span class="material-symbols-outlined text-[15px]">how_to_reg</span> Pre-register
                </button>
                <button class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-surface-container text-xs text-primary flex items-center gap-2" id="ma-advance-checkin">
                  <span class="material-symbols-outlined text-[15px]">fast_forward</span> Advance Check-in
                </button>
                <button class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-surface-container text-xs text-primary flex items-center gap-2" id="ma-add-note">
                  <span class="material-symbols-outlined text-[15px]">edit_note</span> Add Note
                </button>
                <button class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-surface-container text-xs text-primary flex items-center gap-2" id="ma-add-trace">
                  <span class="material-symbols-outlined text-[15px]">flag</span> Add Trace
                </button>
                <button class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-surface-container text-xs text-primary flex items-center gap-2" id="ma-send-msg">
                  <span class="material-symbols-outlined text-[15px]">sms</span> Send Message
                </button>
                <button class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-surface-container text-xs text-primary flex items-center gap-2" id="ma-add-pay">
                  <span class="material-symbols-outlined text-[15px]">payments</span> Add Payment
                </button>
                <button class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-surface-container text-xs text-primary flex items-center gap-2" id="ma-queue">
                  <span class="material-symbols-outlined text-[15px]">hourglass_top</span> Place in Queue
                </button>
                <div class="border-t border-outline-variant my-1"></div>
                <button class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-xs text-rose-700 flex items-center gap-2" id="ma-cancel">
                  <span class="material-symbols-outlined text-[15px]">cancel</span> Cancel Reservation
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MODAL: ROOM NOT READY GUIDANCE (OPERATIONAL PROBLEM SOLVER)
  // ──────────────────────────────────────────────────────────────────────────
  _renderNotReadyModal(a) {
    return `
      <div id="modal-not-ready-backdrop" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl p-6 max-w-md w-full border border-amber-300 shadow-2xl animate-scaleUp">
          
          <div class="flex items-center justify-between pb-3 border-b border-outline-variant mb-4">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                <span class="material-symbols-outlined text-[20px]">hourglass_top</span>
              </div>
              <div>
                <h3 class="font-headline-sm text-base font-bold text-primary">Room Not Ready</h3>
                <p class="text-xs text-on-surface-variant">${a.name} • Room ${a.roomNumber}</p>
              </div>
            </div>
            <button id="btn-close-not-ready" class="text-on-surface-variant hover:text-primary p-1">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <!-- Problem Box -->
          <div class="p-4 rounded-xl bg-amber-50/70 border border-amber-200 mb-5 text-xs">
            <div class="font-bold text-amber-900 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">warning</span>
              <span>Room ${a.roomNumber} is currently ${a.roomState === 'CLEANING' ? 'being cleaned' : 'pending inspection'}</span>
            </div>
            <p class="text-on-surface-variant mt-1">
              Estimated readiness: <strong class="text-primary font-data-mono">12 minutes</strong> remaining. Housekeeping is currently on Floor ${a.roomNumber.charAt(0)}.
            </p>
          </div>

          <!-- Guided Operational Choices -->
          <div class="space-y-2.5">
            <button id="btn-op-prioritize-hk" class="w-full p-3 rounded-xl border border-outline-variant hover:border-primary hover:bg-surface-bright text-left transition-all flex items-center justify-between group cursor-pointer">
              <div>
                <div class="font-bold text-xs text-primary group-hover:text-primary">Prioritize Housekeeping</div>
                <div class="text-[11px] text-on-surface-variant">Send high-priority turnover dispatch to Floor Supervisor</div>
              </div>
              <span class="material-symbols-outlined text-primary text-[18px]">campaign</span>
            </button>

            <button id="btn-op-find-another" class="w-full p-3 rounded-xl border border-outline-variant hover:border-emerald-500 hover:bg-emerald-50/30 text-left transition-all flex items-center justify-between group cursor-pointer">
              <div>
                <div class="font-bold text-xs text-primary group-hover:text-emerald-800">Find Another Clean Room</div>
                <div class="text-[11px] text-on-surface-variant">Switch to another ready ${a.roomType} immediately</div>
              </div>
              <span class="material-symbols-outlined text-emerald-700 text-[18px]">swap_horiz</span>
            </button>

            <button id="btn-op-queue" class="w-full p-3 rounded-xl border border-outline-variant hover:border-blue-500 hover:bg-blue-50/30 text-left transition-all flex items-center justify-between group cursor-pointer">
              <div>
                <div class="font-bold text-xs text-primary group-hover:text-blue-800">Place Guest in Arrivals Queue</div>
                <div class="text-[11px] text-on-surface-variant">Offer lounge pass & SMS notification once keycard ready</div>
              </div>
              <span class="material-symbols-outlined text-blue-700 text-[18px]">sms</span>
            </button>
          </div>

          <div class="pt-4 mt-4 border-t border-outline-variant flex justify-end">
            <button id="btn-op-keep-assigned" class="px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant hover:text-primary">
              Keep Assigned Room
            </button>
          </div>

        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MODAL: ROOM ASSIGNMENT SELECTOR (RECOMMENDED ROOMS)
  // ──────────────────────────────────────────────────────────────────────────
  _renderAssignModal(a) {
    const matchingRooms = this.availableRoomsPool;

    return `
      <div id="modal-assign-backdrop" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl p-6 max-w-lg w-full border border-outline-variant shadow-2xl animate-scaleUp">
          
          <div class="flex items-center justify-between pb-3 border-b border-outline-variant mb-4">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <span class="material-symbols-outlined text-[20px]">meeting_room</span>
              </div>
              <div>
                <h3 class="font-headline-sm text-base font-bold text-primary">Assign Room to Guest</h3>
                <p class="text-xs text-on-surface-variant">${a.name} • ${a.roomType}</p>
              </div>
            </div>
            <button id="btn-close-assign-modal" class="text-on-surface-variant hover:text-primary p-1">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <!-- Reservation Context -->
          <div class="bg-surface-bright p-3 rounded-xl border border-outline-variant/60 mb-4 text-xs">
            <div class="flex justify-between py-0.5">
              <span class="text-on-surface-variant">Stay Dates:</span>
              <span class="font-bold text-primary">Today → ${a.departureDate} (${a.nights} nights)</span>
            </div>
            <div class="flex justify-between py-0.5">
              <span class="text-on-surface-variant">Requested Category:</span>
              <span class="font-bold text-primary">${a.roomType}</span>
            </div>
          </div>

          <!-- Recommended Rooms List -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label-caps">Recommended Available Rooms</span>
              <span class="text-[11px] font-data-mono text-emerald-700 font-bold">${matchingRooms.length} available</span>
            </div>

            <div class="space-y-2 max-h-52 overflow-y-auto custom-scrollbar">
              ${matchingRooms.map((rm, idx) => `
                <label class="flex items-center justify-between p-3 rounded-xl border border-outline-variant hover:border-primary cursor-pointer hover:bg-surface-bright transition-all">
                  <div class="flex items-center gap-3">
                    <input type="radio" name="assign_room_choice" value="${rm.roomNumber}" ${idx === 0 ? 'checked' : ''} class="text-primary focus:ring-primary">
                    <div>
                      <div class="font-bold text-xs text-primary font-data-mono">Room ${rm.roomNumber} • Floor ${rm.floor}</div>
                      <div class="text-[11px] text-on-surface-variant">${rm.type} • ${rm.view} • ${rm.bed}</div>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${rm.status === 'READY' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-900 border border-amber-200'}">
                    ${rm.status === 'READY' ? '✓ Ready' : `⚠ ${rm.housekeeping}`}
                  </span>
                </label>
              `).join('')}
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-3 border-t border-outline-variant">
            <button id="btn-cancel-assign-modal" class="px-4 py-2 rounded-xl border border-outline-variant text-xs font-bold text-on-surface-variant hover:text-primary">
              Cancel
            </button>
            <button id="btn-confirm-assign-modal" class="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 shadow-sm cursor-pointer">
              ASSIGN ROOM
            </button>
          </div>

        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MODAL: ADVANCED FILTERS DRAWER (OPERA-STYLE CAPABILITY, MODERN UI)
  // ──────────────────────────────────────────────────────────────────────────
  _renderAdvancedFilterDrawer() {
    const af = this.advancedFilters;

    return `
      <div id="adv-filter-backdrop" class="fixed inset-0 bg-black/40 z-50 flex justify-end animate-fadeIn">
        <div class="bg-surface-container-lowest w-full max-w-lg h-full shadow-2xl border-l border-outline-variant flex flex-col justify-between overflow-y-auto animate-slideInRight">
          
          <!-- Header -->
          <div class="p-5 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <div>
              <h3 class="font-headline-sm text-base font-bold text-primary">Advanced Arrival Filters</h3>
              <p class="text-xs text-on-surface-variant">Multi-parameter search matching legacy PMS depth.</p>
            </div>
            <button id="btn-close-adv-filter" class="p-1 rounded-lg text-on-surface-variant hover:text-primary">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <!-- Form Fields in Grouped Sections -->
          <div class="p-6 space-y-5 flex-1 text-xs">
            
            <!-- SECTION 1: GUEST -->
            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-primary font-label-caps mb-2 pb-1 border-b border-outline-variant/40">1. Guest Identity</div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[11px] font-semibold text-on-surface-variant block mb-1">Last Name</label>
                  <input type="text" id="af-lastName" value="${af.lastName}" placeholder="e.g. Mitchell" class="w-full p-2 bg-surface-bright border border-outline-variant rounded-lg text-xs">
                </div>
                <div>
                  <label class="text-[11px] font-semibold text-on-surface-variant block mb-1">First Name</label>
                  <input type="text" id="af-firstName" value="${af.firstName}" placeholder="e.g. Sarah" class="w-full p-2 bg-surface-bright border border-outline-variant rounded-lg text-xs">
                </div>
              </div>
            </div>

            <!-- SECTION 2: BUSINESS & GROUP -->
            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-primary font-label-caps mb-2 pb-1 border-b border-outline-variant/40">2. Business / Group</div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[11px] font-semibold text-on-surface-variant block mb-1">Company</label>
                  <input type="text" id="af-company" value="${af.company}" placeholder="e.g. Vanguard" class="w-full p-2 bg-surface-bright border border-outline-variant rounded-lg text-xs">
                </div>
                <div>
                  <label class="text-[11px] font-semibold text-on-surface-variant block mb-1">Group / Event Block</label>
                  <input type="text" id="af-group" value="${af.group}" placeholder="e.g. TechCorp" class="w-full p-2 bg-surface-bright border border-outline-variant rounded-lg text-xs">
                </div>
              </div>
            </div>

            <!-- SECTION 3: BOOKING & CONFIRMATION -->
            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-primary font-label-caps mb-2 pb-1 border-b border-outline-variant/40">3. Booking & Source</div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[11px] font-semibold text-on-surface-variant block mb-1">Confirmation / Res #</label>
                  <input type="text" id="af-confNumber" value="${af.confNumber}" placeholder="e.g. VOL-88291" class="w-full p-2 bg-surface-bright border border-outline-variant rounded-lg text-xs">
                </div>
                <div>
                  <label class="text-[11px] font-semibold text-on-surface-variant block mb-1">Booking Source</label>
                  <select id="af-source" class="w-full p-2 bg-surface-bright border border-outline-variant rounded-lg text-xs">
                    <option value="ALL">All Sources</option>
                    <option value="Direct" ${af.source === 'Direct' ? 'selected' : ''}>Direct Web / Phone</option>
                    <option value="OTA" ${af.source === 'OTA' ? 'selected' : ''}>OTA (Booking/Expedia)</option>
                    <option value="Corporate" ${af.source === 'Corporate' ? 'selected' : ''}>Corporate Portal</option>
                    <option value="Embassy" ${af.source === 'Embassy' ? 'selected' : ''}>Diplomatic / Protocol</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- SECTION 4: OPERATIONAL CRITERIA -->
            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-primary font-label-caps mb-2 pb-1 border-b border-outline-variant/40">4. Operational Criteria</div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[11px] font-semibold text-on-surface-variant block mb-1">Room Assignment</label>
                  <select id="af-roomAssignment" class="w-full p-2 bg-surface-bright border border-outline-variant rounded-lg text-xs">
                    <option value="ALL">All States</option>
                    <option value="ASSIGNED" ${af.roomAssignment === 'ASSIGNED' ? 'selected' : ''}>Room Assigned</option>
                    <option value="UNASSIGNED" ${af.roomAssignment === 'UNASSIGNED' ? 'selected' : ''}>Room Unassigned</option>
                  </select>
                </div>
                <div>
                  <label class="text-[11px] font-semibold text-on-surface-variant block mb-1">Room Readiness</label>
                  <select id="af-roomReadiness" class="w-full p-2 bg-surface-bright border border-outline-variant rounded-lg text-xs">
                    <option value="ALL">All Readiness</option>
                    <option value="READY" ${af.roomReadiness === 'READY' ? 'selected' : ''}>Ready</option>
                    <option value="CLEANING" ${af.roomReadiness === 'CLEANING' ? 'selected' : ''}>Cleaning</option>
                    <option value="INSPECTION_PENDING" ${af.roomReadiness === 'INSPECTION_PENDING' ? 'selected' : ''}>Inspection Pending</option>
                  </select>
                </div>
                <div>
                  <label class="text-[11px] font-semibold text-on-surface-variant block mb-1">Payment Status</label>
                  <select id="af-paymentStatus" class="w-full p-2 bg-surface-bright border border-outline-variant rounded-lg text-xs">
                    <option value="ALL">All Payments</option>
                    <option value="PAID" ${af.paymentStatus === 'PAID' ? 'selected' : ''}>Paid</option>
                    <option value="GUARANTEED" ${af.paymentStatus === 'GUARANTEED' ? 'selected' : ''}>Guaranteed</option>
                    <option value="BALANCE_DUE" ${af.paymentStatus === 'BALANCE_DUE' ? 'selected' : ''}>Balance Due</option>
                    <option value="PAYMENT_ISSUE" ${af.paymentStatus === 'PAYMENT_ISSUE' ? 'selected' : ''}>Payment Issue</option>
                  </select>
                </div>
                <div>
                  <label class="text-[11px] font-semibold text-on-surface-variant block mb-1">VIP Filter</label>
                  <div class="flex items-center gap-2 pt-2">
                    <input type="checkbox" id="af-vipOnly" ${af.vipOnly ? 'checked' : ''} class="rounded text-primary focus:ring-primary">
                    <span class="text-xs text-primary font-medium">VIP Guests Only</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Drawer Footer -->
          <div class="p-4 border-t border-outline-variant bg-surface-bright flex items-center justify-between">
            <button id="btn-reset-adv-filter" class="px-4 py-2 rounded-xl border border-outline-variant text-xs font-bold text-on-surface-variant hover:text-primary">
              RESET
            </button>
            <button id="btn-apply-adv-filter" class="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 shadow-sm cursor-pointer">
              APPLY FILTERS
            </button>
          </div>

        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MODAL: REGISTRATION CARD (OPERA PARITY)
  // ──────────────────────────────────────────────────────────────────────────
  _renderRegistrationCardModal(a) {
    return `
      <div id="modal-regcard-backdrop" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl p-6 max-w-xl w-full border border-outline-variant shadow-2xl animate-scaleUp">
          
          <div class="flex items-center justify-between pb-3 border-b border-outline-variant mb-4">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold">
                <span class="material-symbols-outlined text-[18px]">badge</span>
              </div>
              <div>
                <h3 class="font-headline-sm text-base font-bold text-primary">Guest Registration Card</h3>
                <p class="text-xs text-on-surface-variant">${a.name} • Conf #${a.confCode}</p>
              </div>
            </div>
            <button id="btn-close-regcard" class="text-on-surface-variant hover:text-primary p-1">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <!-- Official Printable Reg Card Box -->
          <div class="p-5 rounded-xl border border-outline-variant bg-surface-bright text-xs space-y-3 font-body-sm mb-4">
            <div class="flex justify-between items-start border-b border-outline-variant/60 pb-3">
              <div>
                <h4 class="font-bold text-sm text-primary">The Grand Meridian</h4>
                <p class="text-[10px] text-on-surface-variant">Grand Meridian Boulevard • 5-Star Luxury Resort</p>
              </div>
              <div class="text-right">
                <span class="font-data-mono text-xs font-bold text-primary">ROOM ${a.roomNumber || 'UNASSIGNED'}</span>
                <span class="text-[10px] block text-on-surface-variant font-data-mono">RES: ${a.resNumber}</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 py-1 text-[11px]">
              <div><strong class="text-on-surface-variant">Guest:</strong> <span class="font-bold text-primary">${a.name}</span></div>
              <div><strong class="text-on-surface-variant">Nationality:</strong> ${a.nationality}</div>
              <div><strong class="text-on-surface-variant">Arrival:</strong> 8 Sep 2026 (${a.arrivalTime})</div>
              <div><strong class="text-on-surface-variant">Departure:</strong> ${a.departureDate} 2026</div>
              <div><strong class="text-on-surface-variant">Room Category:</strong> ${a.roomType}</div>
              <div><strong class="text-on-surface-variant">Rate:</strong> ₹${(a.totalAmount / a.nights).toLocaleString()} / night</div>
            </div>

            <div class="p-2.5 rounded-lg bg-surface-container-low text-[10px] text-on-surface-variant leading-relaxed">
              I agree that my liability for this bill is not waived and agree to be held personally liable in the event that the indicated person, company, or association fails to pay for any part of the full amount of these charges.
            </div>

            <div class="pt-4 border-t border-outline-variant/60 flex justify-between items-end">
              <div class="text-[10px] text-on-surface-variant">
                Front Desk Agent: <strong>Julian Croft (T01)</strong>
              </div>
              <div class="border-b border-primary w-40 text-center text-[10px] text-on-surface-variant pb-1">
                Guest Signature
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant">
            <button id="btn-print-regcard" class="px-4 py-2 rounded-xl border border-outline-variant text-xs font-bold text-primary hover:bg-surface-container flex items-center gap-1.5 cursor-pointer">
              <span class="material-symbols-outlined text-[16px]">print</span>
              <span>Print Card</span>
            </button>
            <button id="btn-send-regcard-digital" class="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 flex items-center gap-1.5 cursor-pointer">
              <span class="material-symbols-outlined text-[16px]">send</span>
              <span>Send Digitally</span>
            </button>
          </div>

        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MODAL: COMPACT WALK-IN GUEST WORKFLOW
  // ──────────────────────────────────────────────────────────────────────────
  _renderWalkInModal() {
    return `
      <div id="modal-walkin-backdrop" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl p-6 max-w-lg w-full border border-outline-variant shadow-2xl animate-scaleUp">
          
          <div class="flex items-center justify-between pb-3 border-b border-outline-variant mb-4">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold">
                <span class="material-symbols-outlined text-[20px]">directions_walk</span>
              </div>
              <div>
                <h3 class="font-headline-sm text-base font-bold text-primary">Walk-In Guest Check-In</h3>
                <p class="text-xs text-on-surface-variant">Step-by-step frontline walk-in registration</p>
              </div>
            </div>
            <button id="btn-close-walkin" class="text-on-surface-variant hover:text-primary p-1">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <!-- Form Fields -->
          <div class="space-y-3.5 text-xs">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-[11px] font-semibold text-on-surface-variant block mb-1">Guest Full Name *</label>
                <input type="text" id="wi-name" placeholder="e.g. Arthur Pendelton" class="w-full p-2.5 bg-surface-bright border border-outline-variant rounded-xl text-xs font-bold text-primary">
              </div>
              <div>
                <label class="text-[11px] font-semibold text-on-surface-variant block mb-1">Contact Phone *</label>
                <input type="text" id="wi-phone" placeholder="+1 (555) 000-0000" class="w-full p-2.5 bg-surface-bright border border-outline-variant rounded-xl text-xs font-data-mono">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-[11px] font-semibold text-on-surface-variant block mb-1">Room Category</label>
                <select id="wi-roomType" class="w-full p-2.5 bg-surface-bright border border-outline-variant rounded-xl text-xs font-bold text-primary">
                  <option value="Classic King">Classic King (₹4,800/n)</option>
                  <option value="Deluxe King">Deluxe King (₹6,500/n)</option>
                  <option value="Deluxe Ocean Suite">Deluxe Ocean Suite (₹9,200/n)</option>
                </select>
              </div>
              <div>
                <label class="text-[11px] font-semibold text-on-surface-variant block mb-1">Assign Clean Room</label>
                <select id="wi-roomNumber" class="w-full p-2.5 bg-surface-bright border border-outline-variant rounded-xl text-xs font-data-mono font-bold text-emerald-800">
                  <option value="205">Room 205 (Floor 2 • Ready)</option>
                  <option value="304">Room 304 (Floor 3 • Ready)</option>
                  <option value="408">Room 408 (Floor 4 • Ready)</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-[11px] font-semibold text-on-surface-variant block mb-1">Nights</label>
                <input type="number" id="wi-nights" value="1" min="1" max="14" class="w-full p-2.5 bg-surface-bright border border-outline-variant rounded-xl text-xs font-bold">
              </div>
              <div>
                <label class="text-[11px] font-semibold text-on-surface-variant block mb-1">Payment Method</label>
                <select id="wi-payMethod" class="w-full p-2.5 bg-surface-bright border border-outline-variant rounded-xl text-xs">
                  <option value="Credit Card">Credit Card (Swipe / Chip)</option>
                  <option value="Cash">Cash at Counter</option>
                  <option value="UPI">UPI / Digital QR</option>
                </select>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 pt-5 mt-4 border-t border-outline-variant">
            <button id="btn-cancel-walkin" class="px-4 py-2 rounded-xl border border-outline-variant text-xs font-bold text-on-surface-variant">
              Cancel
            </button>
            <button id="btn-complete-walkin" class="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 shadow-sm cursor-pointer">
              COMPLETE CHECK-IN
            </button>
          </div>

        </div>
      </div>
    `;
  }

  _hasActiveAdvancedFilters() {
    const af = this.advancedFilters;
    return !!(
      af.lastName || af.firstName || af.company || af.group ||
      af.source !== 'ALL' || af.confNumber || af.roomType !== 'ALL' ||
      af.roomAssignment !== 'ALL' || af.roomReadiness !== 'ALL' ||
      af.vipOnly || af.paymentStatus !== 'ALL'
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // EVENT BINDINGS
  // ──────────────────────────────────────────────────────────────────────────
  bindEvents() {
    if (!this.container) return;

    // Header Walk-In CTA
    const walkInBtn = this.container.querySelector('#btn-header-walkin');
    if (walkInBtn) {
      walkInBtn.onclick = () => {
        this.activeWalkInModal = true;
        this.renderContent();
      };
    }

    // Summary Cards Click Filtering
    this.container.querySelectorAll('.btn-summary-card').forEach((card) => {
      card.onclick = () => {
        const filter = card.dataset.filter;
        this.activeSummaryFilter = filter;
        this.activeQuickFilter = filter;
        this.renderContent();
      };
    });

    // Global Search Input
    const searchInput = this.container.querySelector('#input-arrivals-search');
    if (searchInput) {
      searchInput.oninput = (e) => {
        this.searchQuery = e.target.value;
        this.renderContent();
        // Maintain focus after re-render
        const inp = this.container.querySelector('#input-arrivals-search');
        if (inp) {
          inp.focus();
          inp.setSelectionRange(inp.value.length, inp.value.length);
        }
      };
    }

    const clearSearchX = this.container.querySelector('#btn-clear-search-x');
    if (clearSearchX) {
      clearSearchX.onclick = () => {
        this.searchQuery = '';
        this.renderContent();
      };
    }

    // Advanced Filters Drawer Toggle
    const openAdvFilterBtn = this.container.querySelector('#btn-open-advanced-filters');
    if (openAdvFilterBtn) {
      openAdvFilterBtn.onclick = () => {
        this.isAdvancedFilterOpen = true;
        this.renderContent();
      };
    }

    const clearAllFiltersBtn = this.container.querySelector('#btn-clear-all-filters');
    if (clearAllFiltersBtn) {
      clearAllFiltersBtn.onclick = () => this.resetAllFilters();
    }

    const emptyClearBtn = this.container.querySelector('#btn-empty-clear');
    if (emptyClearBtn) {
      emptyClearBtn.onclick = () => this.resetAllFilters();
    }

    // Quick Filter Chips
    this.container.querySelectorAll('.btn-quick-filter').forEach((btn) => {
      btn.onclick = () => {
        this.activeQuickFilter = btn.dataset.qf;
        this.activeSummaryFilter = btn.dataset.qf;
        this.renderContent();
      };
    });

    // TechCorp Filter Button
    const techcorpBtn = this.container.querySelector('#btn-filter-techcorp');
    if (techcorpBtn) {
      techcorpBtn.onclick = () => {
        this.activeQuickFilter = this.activeQuickFilter === 'GROUP' ? 'ALL' : 'GROUP';
        this.renderContent();
      };
    }

    // Sort Dropdown
    const sortSelect = this.container.querySelector('#sel-arrivals-sort');
    if (sortSelect) {
      sortSelect.onchange = (e) => {
        this.sortBy = e.target.value;
        this.renderContent();
      };
    }

    // Checkbox: Select All
    const selectAllChk = this.container.querySelector('#chk-select-all');
    if (selectAllChk) {
      selectAllChk.onchange = (e) => {
        const filtered = this.getFilteredArrivals();
        if (e.target.checked) {
          filtered.forEach(a => this.selectedArrivalIds.add(a.id));
        } else {
          this.selectedArrivalIds.clear();
        }
        this.renderContent();
      };
    }

    // Row Checkboxes
    this.container.querySelectorAll('.chk-arrival').forEach((chk) => {
      chk.onchange = (e) => {
        const id = chk.dataset.id;
        if (e.target.checked) {
          this.selectedArrivalIds.add(id);
        } else {
          this.selectedArrivalIds.delete(id);
        }
        this.renderContent();
      };
    });

    // Click on Table Row -> Open Detail Drawer
    this.container.querySelectorAll('.row-arrival').forEach((row) => {
      row.onclick = () => {
        const id = row.dataset.id;
        const arrival = this.arrivals.find(a => a.id === id);
        if (arrival) {
          this.activeDrawerArrival = arrival;
          this.renderContent();
        }
      };
    });

    // Row Direct Action: Check In
    this.container.querySelectorAll('.btn-row-checkin').forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        this.executeCheckIn(id);
      };
    });

    // Row Direct Action: Assign Room
    this.container.querySelectorAll('.btn-row-assign').forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const arrival = this.arrivals.find(a => a.id === id);
        if (arrival) {
          this.activeAssignModalArrival = arrival;
          this.renderContent();
        }
      };
    });

    // Row Direct Action: View Options (Room Not Ready)
    this.container.querySelectorAll('.btn-row-view-options').forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const arrival = this.arrivals.find(a => a.id === id);
        if (arrival) {
          this.activeNotReadyArrival = arrival;
          this.renderContent();
        }
      };
    });

    // Mass Action Bar Buttons
    const massCheckInBtn = this.container.querySelector('#btn-mass-checkin');
    if (massCheckInBtn) {
      massCheckInBtn.onclick = () => {
        let count = 0;
        this.selectedArrivalIds.forEach(id => {
          const arr = this.arrivals.find(a => a.id === id);
          if (arr && arr.roomNumber && arr.roomState === 'READY' && !arr.checkedIn) {
            arr.checkedIn = true;
            arr.resStatus = 'Checked In';
            count++;
          }
        });
        Toast.show({
          title: 'Mass Check-In Complete',
          message: `${count} eligible guests successfully checked in.`,
          type: 'success'
        });
        this.selectedArrivalIds.clear();
        this.renderContent();
      };
    }

    const massClearBtn = this.container.querySelector('#btn-mass-clear');
    if (massClearBtn) {
      massClearBtn.onclick = () => {
        this.selectedArrivalIds.clear();
        this.renderContent();
      };
    }

    // Detail Drawer Events
    this._bindDrawerEvents();

    // Advanced Filters Events
    this._bindAdvFilterEvents();

    // Assignment Modal Events
    this._bindAssignModalEvents();

    // Not Ready Modal Events
    this._bindNotReadyModalEvents();

    // Registration Card Events
    this._bindRegCardEvents();

    // Walk-In Modal Events
    this._bindWalkInEvents();
  }

  _bindDrawerEvents() {
    const closeDrawerBtn = this.container.querySelector('#btn-close-drawer');
    const drawerBackdrop = this.container.querySelector('#drawer-backdrop');

    if (closeDrawerBtn) {
      closeDrawerBtn.onclick = () => {
        this.activeDrawerArrival = null;
        this.renderContent();
      };
    }

    if (drawerBackdrop) {
      drawerBackdrop.onclick = (e) => {
        if (e.target === drawerBackdrop) {
          this.activeDrawerArrival = null;
          this.renderContent();
        }
      };
    }

    const primaryCheckIn = this.container.querySelector('#btn-drawer-primary-checkin');
    if (primaryCheckIn && this.activeDrawerArrival) {
      primaryCheckIn.onclick = () => {
        this.executeCheckIn(this.activeDrawerArrival.id);
        this.activeDrawerArrival = null;
      };
    }

    const primaryAssign = this.container.querySelector('#btn-drawer-primary-assign');
    if (primaryAssign && this.activeDrawerArrival) {
      primaryAssign.onclick = () => {
        this.activeAssignModalArrival = this.activeDrawerArrival;
        this.activeDrawerArrival = null;
        this.renderContent();
      };
    }

    const primaryOptions = this.container.querySelector('#btn-drawer-primary-options');
    if (primaryOptions && this.activeDrawerArrival) {
      primaryOptions.onclick = () => {
        this.activeNotReadyArrival = this.activeDrawerArrival;
        this.activeDrawerArrival = null;
        this.renderContent();
      };
    }

    const drawerChangeRoom = this.container.querySelector('#btn-drawer-change-room');
    if (drawerChangeRoom && this.activeDrawerArrival) {
      drawerChangeRoom.onclick = () => {
        this.activeAssignModalArrival = this.activeDrawerArrival;
        this.activeDrawerArrival = null;
        this.renderContent();
      };
    }

    // Drawer Secondary Actions
    const viewResBtn = this.container.querySelector('#btn-drawer-view-res');
    if (viewResBtn) {
      viewResBtn.onclick = () => {
        Toast.show({ title: 'Reservation', message: `Displaying Folio & Details for ${this.activeDrawerArrival.name}`, type: 'info' });
      };
    }

    const viewProfileBtn = this.container.querySelector('#btn-drawer-view-profile');
    if (viewProfileBtn) {
      viewProfileBtn.onclick = () => store.setNavTab('crm');
    }

    const viewFolioBtn = this.container.querySelector('#btn-drawer-view-folio');
    if (viewFolioBtn) {
      viewFolioBtn.onclick = () => store.setNavTab('billing');
    }

    const regCardBtn = this.container.querySelector('#btn-drawer-reg-card');
    if (regCardBtn && this.activeDrawerArrival) {
      regCardBtn.onclick = () => {
        this.activeRegCardArrival = this.activeDrawerArrival;
        this.renderContent();
      };
    }

    // More Actions Menu Toggle
    const moreToggle = this.container.querySelector('#btn-drawer-more-toggle');
    const moreMenu = this.container.querySelector('#drawer-more-menu');
    if (moreToggle && moreMenu) {
      moreToggle.onclick = (e) => {
        e.stopPropagation();
        moreMenu.classList.toggle('hidden');
      };
    }
  }

  _bindAdvFilterEvents() {
    const closeBtn = this.container.querySelector('#btn-close-adv-filter');
    const backdrop = this.container.querySelector('#adv-filter-backdrop');

    if (closeBtn) {
      closeBtn.onclick = () => {
        this.isAdvancedFilterOpen = false;
        this.renderContent();
      };
    }

    if (backdrop) {
      backdrop.onclick = (e) => {
        if (e.target === backdrop) {
          this.isAdvancedFilterOpen = false;
          this.renderContent();
        }
      };
    }

    const applyBtn = this.container.querySelector('#btn-apply-adv-filter');
    if (applyBtn) {
      applyBtn.onclick = () => {
        this.advancedFilters.lastName = this.container.querySelector('#af-lastName')?.value || '';
        this.advancedFilters.firstName = this.container.querySelector('#af-firstName')?.value || '';
        this.advancedFilters.company = this.container.querySelector('#af-company')?.value || '';
        this.advancedFilters.group = this.container.querySelector('#af-group')?.value || '';
        this.advancedFilters.confNumber = this.container.querySelector('#af-confNumber')?.value || '';
        this.advancedFilters.source = this.container.querySelector('#af-source')?.value || 'ALL';
        this.advancedFilters.roomAssignment = this.container.querySelector('#af-roomAssignment')?.value || 'ALL';
        this.advancedFilters.roomReadiness = this.container.querySelector('#af-roomReadiness')?.value || 'ALL';
        this.advancedFilters.paymentStatus = this.container.querySelector('#af-paymentStatus')?.value || 'ALL';
        this.advancedFilters.vipOnly = !!this.container.querySelector('#af-vipOnly')?.checked;

        this.isAdvancedFilterOpen = false;
        this.renderContent();
      };
    }

    const resetBtn = this.container.querySelector('#btn-reset-adv-filter');
    if (resetBtn) {
      resetBtn.onclick = () => {
        this.advancedFilters = {
          lastName: '', firstName: '', company: '', corporateNumber: '', group: '', block: '',
          source: 'ALL', agent: '', iataNumber: '', confNumber: '', crsNumber: '', arrivalFrom: '', arrivalTo: '',
          membershipType: 'ALL', membershipNumber: '', partySize: 'ALL', contact: '', postalCode: '', communication: '',
          customRef: '', resStatus: 'ALL', roomType: 'ALL', roomAssignment: 'ALL', roomReadiness: 'ALL', vipOnly: false, paymentStatus: 'ALL'
        };
        this.isAdvancedFilterOpen = false;
        this.renderContent();
      };
    }
  }

  _bindAssignModalEvents() {
    const closeBtn = this.container.querySelector('#btn-close-assign-modal');
    const cancelBtn = this.container.querySelector('#btn-cancel-assign-modal');
    const confirmBtn = this.container.querySelector('#btn-confirm-assign-modal');

    if (closeBtn) closeBtn.onclick = () => { this.activeAssignModalArrival = null; this.renderContent(); };
    if (cancelBtn) cancelBtn.onclick = () => { this.activeAssignModalArrival = null; this.renderContent(); };

    if (confirmBtn && this.activeAssignModalArrival) {
      confirmBtn.onclick = () => {
        const selected = this.container.querySelector('input[name="assign_room_choice"]:checked')?.value || '402';
        this.activeAssignModalArrival.roomNumber = selected;
        this.activeAssignModalArrival.roomState = 'READY';
        this.activeAssignModalArrival.roomReadinessLabel = '✓ Ready';
        Toast.show({
          title: 'Room Assigned',
          message: `Room ${selected} assigned to ${this.activeAssignModalArrival.name}.`,
          type: 'success'
        });
        this.activeAssignModalArrival = null;
        this.renderContent();
      };
    }
  }

  _bindNotReadyModalEvents() {
    const closeBtn = this.container.querySelector('#btn-close-not-ready');
    const keepBtn = this.container.querySelector('#btn-op-keep-assigned');

    if (closeBtn) closeBtn.onclick = () => { this.activeNotReadyArrival = null; this.renderContent(); };
    if (keepBtn) keepBtn.onclick = () => { this.activeNotReadyArrival = null; this.renderContent(); };

    const prioritizeBtn = this.container.querySelector('#btn-op-prioritize-hk');
    if (prioritizeBtn && this.activeNotReadyArrival) {
      prioritizeBtn.onclick = () => {
        Toast.show({
          title: 'Housekeeping Prioritized',
          message: `Rush turnover dispatch sent for Room ${this.activeNotReadyArrival.roomNumber}.`,
          type: 'success'
        });
        this.activeNotReadyArrival = null;
        this.renderContent();
      };
    }

    const findAnotherBtn = this.container.querySelector('#btn-op-find-another');
    if (findAnotherBtn && this.activeNotReadyArrival) {
      findAnotherBtn.onclick = () => {
        const arr = this.activeNotReadyArrival;
        this.activeNotReadyArrival = null;
        this.activeAssignModalArrival = arr;
        this.renderContent();
      };
    }

    const queueBtn = this.container.querySelector('#btn-op-queue');
    if (queueBtn && this.activeNotReadyArrival) {
      queueBtn.onclick = () => {
        Toast.show({
          title: 'Guest Placed in Queue',
          message: `${this.activeNotReadyArrival.name} notified via SMS. Complimentary lounge pass issued.`,
          type: 'info'
        });
        this.activeNotReadyArrival = null;
        this.renderContent();
      };
    }
  }

  _bindRegCardEvents() {
    const closeBtn = this.container.querySelector('#btn-close-regcard');
    if (closeBtn) closeBtn.onclick = () => { this.activeRegCardArrival = null; this.renderContent(); };

    const printBtn = this.container.querySelector('#btn-print-regcard');
    if (printBtn) {
      printBtn.onclick = () => {
        window.print();
      };
    }

    const sendBtn = this.container.querySelector('#btn-send-regcard-digital');
    if (sendBtn) {
      sendBtn.onclick = () => {
        Toast.show({ title: 'Digital Signature Sent', message: 'Registration link sent to guest smartphone via SMS & Email.', type: 'success' });
        this.activeRegCardArrival = null;
        this.renderContent();
      };
    }
  }

  _bindWalkInEvents() {
    const closeBtn = this.container.querySelector('#btn-close-walkin');
    const cancelBtn = this.container.querySelector('#btn-cancel-walkin');
    const completeBtn = this.container.querySelector('#btn-complete-walkin');

    if (closeBtn) closeBtn.onclick = () => { this.activeWalkInModal = false; this.renderContent(); };
    if (cancelBtn) cancelBtn.onclick = () => { this.activeWalkInModal = false; this.renderContent(); };

    if (completeBtn) {
      completeBtn.onclick = () => {
        const nameInput = this.container.querySelector('#wi-name');
        const guestName = nameInput?.value?.trim() || 'Arthur Pendelton (Walk-In)';
        const roomSelect = this.container.querySelector('#wi-roomNumber');
        const roomNumber = roomSelect?.value || '205';

        // Add to Arrivals as checked in
        this.arrivals.unshift({
          id: `arr-${Date.now()}`,
          name: guestName,
          vip: false,
          vipTier: null,
          repeatGuest: false,
          badges: ['Walk-In'],
          resNumber: `RES-${Math.floor(10000 + Math.random() * 90000)}`,
          confCode: `VOL-${Math.floor(10000 + Math.random() * 90000)}`,
          crsNumber: 'WALK-IN',
          arrivalTime: 'Just Now',
          departureDate: 'Sep 10',
          nights: 2,
          roomNumber: roomNumber,
          roomType: 'Classic King',
          guestsText: '1 Adult',
          resStatus: 'Checked In',
          paymentState: 'PAID',
          paymentLabel: '✓ Paid',
          roomState: 'READY',
          roomReadinessLabel: '✓ Ready',
          totalAmount: 9600,
          paidAmount: 9600,
          balanceDue: 0,
          paymentMethod: 'Credit Card',
          ratePlan: 'Walk-In Standard',
          bookingSource: 'Front Desk Walk-In',
          company: null,
          groupName: null,
          phone: '+1 (555) 000-0000',
          email: 'walkin@guest.com',
          nationality: 'Walk-In Guest',
          idType: 'PASSPORT',
          idNumber: 'WI-99201',
          specialRequests: 'Walk-In immediate check-in.',
          preferences: 'Standard room.',
          notes: 'Walk-in registration completed at counter.',
          checkedIn: true
        });

        Toast.show({
          title: 'Walk-In Check-In Complete',
          message: `${guestName} registered and checked into Room ${roomNumber}.`,
          type: 'success'
        });

        this.activeWalkInModal = false;
        this.renderContent();
      };
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CORE ACTION: EXECUTE CHECK-IN
  // ──────────────────────────────────────────────────────────────────────────
  async executeCheckIn(id) {
    const arrival = this.arrivals.find(a => a.id === id);
    if (!arrival) return;

    if (!arrival.roomNumber) {
      Toast.show({
        title: 'Room Required',
        message: 'Please assign a room before checking in this guest.',
        type: 'warning'
      });
      this.activeAssignModalArrival = arrival;
      this.renderContent();
      return;
    }

    if (arrival.roomState !== 'READY') {
      this.activeNotReadyArrival = arrival;
      this.renderContent();
      return;
    }

    // 1. Backend PostgreSQL API Check-in Call
    try {
      if (arrival.isApiRecord || (arrival.id && arrival.id.length > 20)) {
        await reservationsClient.checkIn(arrival.id);
      }
    } catch (err) {
      console.warn('[ArrivalsCheckInView] Backend API note:', err.message);
    }

    // 2. Cascade state change into Central Store SSOT (Room Occupied, Folio initialized, In-House sync)
    store.checkInGuestLifecycle({
      id: arrival.id,
      resNumber: arrival.resNumber || arrival.confCode || arrival.id,
      guestName: arrival.name,
      roomNumber: arrival.roomNumber,
      roomType: arrival.roomType,
      checkInDate: 'Today',
      checkOutDate: arrival.departureDate || 'Sep 10',
      totalNights: arrival.nights || 2,
      adults: parseInt(arrival.guestsText) || 1,
      phone: arrival.phone,
      email: arrival.email,
      vip: arrival.vip,
      vipTier: arrival.vipTier,
      totalAmount: arrival.totalAmount || 1200,
      paidAmount: arrival.paidAmount || 1200,
      balanceDue: arrival.balanceDue || 0,
      bookingSource: arrival.bookingSource || 'Direct Web',
      specialRequests: arrival.specialRequests || ''
    });

    arrival.checkedIn = true;
    arrival.resStatus = 'Checked In';

    Toast.show({
      title: 'Guest Checked In',
      message: `${arrival.name} checked into Room ${arrival.roomNumber}. Keycard issued & In-House stay live.`,
      type: 'success'
    });

    this.renderContent();
  }

  resetAllFilters() {
    this.searchQuery = '';
    this.activeSummaryFilter = 'ALL';
    this.activeQuickFilter = 'ALL';
    this.sortBy = 'TIME';
    this.selectedArrivalIds.clear();
    this.advancedFilters = {
      lastName: '', firstName: '', company: '', corporateNumber: '', group: '', block: '',
      source: 'ALL', agent: '', iataNumber: '', confNumber: '', crsNumber: '', arrivalFrom: '', arrivalTo: '',
      membershipType: 'ALL', membershipNumber: '', partySize: 'ALL', contact: '', postalCode: '', communication: '',
      customRef: '', resStatus: 'ALL', roomType: 'ALL', roomAssignment: 'ALL', roomReadiness: 'ALL', vipOnly: false, paymentStatus: 'ALL'
    };
    this.renderContent();
  }
}
