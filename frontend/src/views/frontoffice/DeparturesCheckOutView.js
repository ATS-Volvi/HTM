// ==========================================================================
// VOLVITECH HOSPITALITY OS — DEPARTURES OPERATIONAL WORKSPACE
// Front Desk Checkout Control Center, Folio Settlement & Turnover Dispatch
// ==========================================================================

import { store } from '../../state/store.js';
import { Toast } from '../../components/Toast.js';
import { NewBookingModal } from './NewBookingModal.js';
import { reservationsClient } from '../../api/reservationsClient.js';

export class DeparturesCheckOutView {
  constructor() {
    this.container = null;
    this.isLoading = false;
    this.searchQuery = '';
    this.activeQuickFilter = 'ALL'; // 'ALL', 'PENDING', 'READY', 'BALANCE_DUE', 'LATE', 'VIP', 'CHECKED_OUT'

    // Date Context
    this.currentBusinessDate = '07 September 2026';
    this.selectedDate = '07 September 2026';
    this.currentTime = '1:35 PM';
    this.standardCheckoutTime = '12:00 PM';

    // Additional Filters
    this.filters = {
      roomType: 'ALL',
      paymentStatus: 'ALL',
      bookingSource: 'ALL',
      departureTime: 'ALL', // 'ALL', 'MORNING', 'STANDARD', 'AFTERNOON'
    };

    // Active Drawer & Workflow Modals
    this.activeDetailGuest = null;
    this.activeConfirmCheckoutGuest = null;
    this.activeSuccessGuest = null;
    this.activePendingChargesGuest = null;
    this.activeEarlyDepartureGuest = null;
    this.activeAddChargeGuest = null;
    this.selectedPaymentMethod = 'Card';

    // Core Operational Dataset (07 September 2026)
    // Exactly matches summary cards:
    // - 19 Departures Today
    // - 7 Checked Out
    // - 12 Pending Checkout (Still In-House)
    // - Balance Due: ₹48,500 Outstanding across pending accounts
    // - 4 Late Checkouts (Past expected checkout time)
    // - 2 VIP Departures (Special attention)
    this.departures = [
      // ────────────────────────────────────────────────────────────────────────
      // PENDING CHECKOUT GUESTS (12 Guests, Still In-House)
      // ────────────────────────────────────────────────────────────────────────
      {
        id: 'dep-10482',
        name: 'Sarah Mitchell',
        vip: true,
        vipTier: 'VIP',
        reservationNumber: 'RES-10482',
        roomNumber: '402',
        floor: '4',
        roomType: 'Deluxe King',
        ratePlan: 'Best Available Rate',
        nightlyRate: 12000,
        stayDates: '04 Sep → 07 Sep',
        checkInDate: '04 Sep',
        checkOutDate: '07 Sep',
        adults: 2,
        children: 0,
        phone: '+1 (555) 382-9901',
        email: 'sarah.mitchell@vanguard.com',
        nationality: 'United States',
        previousStays: 7,
        lastStay: 'June 2026',
        preferredRoom: 'Deluxe King',
        bookingSource: 'Direct Web',
        // Operational Status Separation
        reservationStatus: 'Checked-In',
        stayStatus: 'In-House',
        departureStatus: 'Pending',
        roomStatus: 'Occupied',
        folioStatus: 'Open',
        paymentStatus: 'PAID', // Folio Ready & Paid
        scheduledCheckOut: '12:00 PM',
        departureTimeSlot: 'STANDARD',
        isOverdue: true, // Expected 12:00 PM, Current 1:35 PM
        isLateCheckoutApproved: false,
        keycardsIssued: 2,
        // Folio breakdown
        folioNumber: 'FOL-402-0907',
        roomCharges: 36000,
        restaurantCharges: 2450,
        laundryCharges: 600,
        roomServiceCharges: 850,
        taxes: 6480,
        totalCharges: 46380,
        paidAmount: 46380,
        balanceDue: 0,
        // Optional pending charges to review
        pendingCharges: [],
        specialRequests: 'High floor corner room. Return airport limousine escort booked for 2:30 PM.',
        notes: 'VIP Gold Guest. Express checkout authorized. Personal farewell requested by Guest Relations.',
        checkoutLog: null,
      },
      {
        id: 'dep-10483',
        name: 'John Smith',
        vip: false,
        vipTier: null,
        reservationNumber: 'RES-10483',
        roomNumber: '508',
        floor: '5',
        roomType: 'Deluxe King',
        ratePlan: 'Corporate Flex Rate',
        nightlyRate: 14000,
        stayDates: '04 Sep → 07 Sep',
        checkInDate: '04 Sep',
        checkOutDate: '07 Sep',
        adults: 1,
        children: 0,
        phone: '+44 20 7946 0192',
        email: 'john.smith@smithadvisory.co.uk',
        nationality: 'United Kingdom',
        previousStays: 2,
        lastStay: 'January 2026',
        preferredRoom: 'Deluxe King',
        bookingSource: 'Corporate Direct',
        reservationStatus: 'Checked-In',
        stayStatus: 'In-House',
        departureStatus: 'Pending',
        roomStatus: 'Occupied',
        folioStatus: 'Open',
        paymentStatus: 'BALANCE_DUE',
        scheduledCheckOut: '12:00 PM',
        departureTimeSlot: 'STANDARD',
        isOverdue: true, // Expected 12:00 PM, Current 1:35 PM
        isLateCheckoutApproved: false,
        keycardsIssued: 1,
        folioNumber: 'FOL-508-0907',
        roomCharges: 42000,
        restaurantCharges: 3200,
        laundryCharges: 0,
        roomServiceCharges: 1400,
        taxes: 8388,
        totalCharges: 54988,
        paidAmount: 48608,
        balanceDue: 6380,
        pendingCharges: [],
        specialRequests: 'Quiet room away from elevators.',
        notes: 'Corporate account. Balance of ₹6,380 must be reviewed & settled before normal checkout.',
        checkoutLog: null,
      },
      {
        id: 'dep-10487',
        name: 'Carlos Ruiz',
        vip: false,
        vipTier: null,
        reservationNumber: 'RES-10487',
        roomNumber: '305',
        floor: '3',
        roomType: 'Classic King',
        ratePlan: 'Direct BAR',
        nightlyRate: 9500,
        stayDates: '06 Sep → 07 Sep',
        checkInDate: '06 Sep',
        checkOutDate: '07 Sep',
        adults: 1,
        children: 0,
        phone: '+34 600 123 456',
        email: 'carlos.ruiz@madrid.es',
        nationality: 'Spain',
        previousStays: 3,
        lastStay: 'March 2026',
        preferredRoom: 'Classic King',
        bookingSource: 'OTA / Booking.com',
        reservationStatus: 'Checked-In',
        stayStatus: 'In-House',
        departureStatus: 'Pending',
        roomStatus: 'Occupied',
        folioStatus: 'Open',
        paymentStatus: 'PAID',
        scheduledCheckOut: '12:00 PM',
        departureTimeSlot: 'STANDARD',
        isOverdue: true, // Expected 12:00 PM, Current 1:35 PM
        isLateCheckoutApproved: false,
        keycardsIssued: 1,
        folioNumber: 'FOL-305-0907',
        roomCharges: 9500,
        restaurantCharges: 0,
        laundryCharges: 0,
        roomServiceCharges: 0,
        taxes: 1710,
        totalCharges: 11210,
        paidAmount: 11210,
        balanceDue: 0,
        pendingCharges: [],
        specialRequests: 'Ground floor or close to reception.',
        notes: 'Pre-paid OTA reservation. Folio fully balanced.',
        checkoutLog: null,
      },
      {
        id: 'dep-10493',
        name: "James O'Brien",
        vip: false,
        vipTier: null,
        reservationNumber: 'RES-10493',
        roomNumber: '418',
        floor: '4',
        roomType: 'Deluxe King',
        ratePlan: 'OTA Package',
        nightlyRate: 13500,
        stayDates: '03 Sep → 07 Sep',
        checkInDate: '03 Sep',
        checkOutDate: '07 Sep',
        adults: 2,
        children: 1,
        phone: '+353 86 123 4567',
        email: 'james.obrien@dublin.ie',
        nationality: 'Ireland',
        previousStays: 1,
        lastStay: 'October 2025',
        preferredRoom: 'Deluxe King',
        bookingSource: 'OTA / Booking.com',
        reservationStatus: 'Checked-In',
        stayStatus: 'In-House',
        departureStatus: 'Pending',
        roomStatus: 'Occupied',
        folioStatus: 'Open',
        paymentStatus: 'BALANCE_DUE',
        scheduledCheckOut: '11:00 AM',
        departureTimeSlot: 'MORNING',
        isOverdue: false, // Late checkout approved until 2:00 PM
        isLateCheckoutApproved: true,
        lateCheckOutUntil: '2:00 PM',
        keycardsIssued: 2,
        folioNumber: 'FOL-418-0907',
        roomCharges: 54000,
        restaurantCharges: 4200,
        laundryCharges: 1200,
        roomServiceCharges: 1800,
        taxes: 11016,
        totalCharges: 72216,
        paidAmount: 64500,
        balanceDue: 7716,
        pendingCharges: [
          { id: 'pc-4', category: 'Minibar', description: 'Minibar final inspection charge', amount: 1216, time: '01:10 PM' }
        ],
        specialRequests: 'Late checkout requested until 2 PM. Luggage cloakroom voucher issued.',
        notes: 'Late checkout granted until 2:00 PM. Balance of ₹7,716 plus minibar pending payment.',
        checkoutLog: null,
      },
      {
        id: 'dep-10491',
        name: 'Marcus Wilson',
        vip: false,
        vipTier: null,
        reservationNumber: 'RES-10491',
        roomNumber: '210',
        floor: '2',
        roomType: 'Deluxe King',
        ratePlan: 'Corporate Special',
        nightlyRate: 11500,
        stayDates: '04 Sep → 07 Sep',
        checkInDate: '04 Sep',
        checkOutDate: '07 Sep',
        adults: 1,
        children: 0,
        phone: '+44 7911 123456',
        email: 'marcus.wilson@londonhq.co.uk',
        nationality: 'United Kingdom',
        previousStays: 4,
        lastStay: 'April 2026',
        preferredRoom: 'Deluxe King',
        bookingSource: 'Corporate Direct',
        reservationStatus: 'Checked-In',
        stayStatus: 'In-House',
        departureStatus: 'Pending',
        roomStatus: 'Occupied',
        folioStatus: 'Open',
        paymentStatus: 'PARTIAL',
        scheduledCheckOut: '12:00 PM',
        departureTimeSlot: 'STANDARD',
        isOverdue: false, // Late checkout granted until 2:30 PM
        isLateCheckoutApproved: true,
        lateCheckOutUntil: '2:30 PM',
        keycardsIssued: 1,
        folioNumber: 'FOL-210-0907',
        roomCharges: 34500,
        restaurantCharges: 2100,
        laundryCharges: 450,
        roomServiceCharges: 0,
        taxes: 6669,
        totalCharges: 43719,
        paidAmount: 33719,
        balanceDue: 10000,
        pendingCharges: [],
        specialRequests: 'Early morning taxi to train terminus.',
        notes: 'Deposit of ₹10,000 pending settlement via Corporate Amex.',
        checkoutLog: null,
      },
      {
        id: 'dep-10488',
        name: 'Aisha Al-Mansoor',
        vip: true,
        vipTier: 'VIP',
        reservationNumber: 'RES-10488',
        roomNumber: '501',
        floor: '5',
        roomType: 'Presidential Royal Suite',
        ratePlan: 'Royal Suite Package',
        nightlyRate: 65000,
        stayDates: '02 Sep → 07 Sep',
        checkInDate: '02 Sep',
        checkOutDate: '07 Sep',
        adults: 3,
        children: 2,
        phone: '+971 50 123 9988',
        email: 'aisha.almansoor@emirates.ae',
        nationality: 'United Arab Emirates',
        previousStays: 9,
        lastStay: 'May 2026',
        preferredRoom: 'Presidential Royal Suite',
        bookingSource: 'Direct Web',
        reservationStatus: 'Checked-In',
        stayStatus: 'In-House',
        departureStatus: 'Pending',
        roomStatus: 'Occupied',
        folioStatus: 'Open',
        paymentStatus: 'PAID',
        scheduledCheckOut: '02:00 PM',
        departureTimeSlot: 'AFTERNOON',
        isOverdue: false, // 1:35 PM < 2:00 PM
        isLateCheckoutApproved: true,
        lateCheckOutUntil: '2:00 PM',
        keycardsIssued: 4,
        folioNumber: 'FOL-501-0907',
        roomCharges: 325000,
        restaurantCharges: 18400,
        laundryCharges: 2800,
        roomServiceCharges: 6200,
        taxes: 63432,
        totalCharges: 415832,
        paidAmount: 415832,
        balanceDue: 0,
        pendingCharges: [],
        specialRequests: 'VIP Delegation. Rolls Royce departure escort at 2:00 PM sharp.',
        notes: 'All incidentals pre-settled. General Manager personal farewell arranged.',
        checkoutLog: null,
      },
      {
        id: 'dep-10495',
        name: 'Vikramaditya Singhania',
        vip: false,
        vipTier: null,
        reservationNumber: 'RES-10495',
        roomNumber: '412',
        floor: '4',
        roomType: 'Luxury Suite',
        ratePlan: 'Executive Club BAR',
        nightlyRate: 22000,
        stayDates: '04 Sep → 07 Sep',
        checkInDate: '04 Sep',
        checkOutDate: '07 Sep',
        adults: 2,
        children: 0,
        phone: '+91 98201 44552',
        email: 'v.singhania@apexholding.in',
        nationality: 'India',
        previousStays: 5,
        lastStay: 'August 2026',
        preferredRoom: 'Luxury Suite',
        bookingSource: 'Direct Web',
        reservationStatus: 'Checked-In',
        stayStatus: 'In-House',
        departureStatus: 'Pending',
        roomStatus: 'Occupied',
        folioStatus: 'Open',
        paymentStatus: 'BALANCE_DUE',
        scheduledCheckOut: '12:00 PM',
        departureTimeSlot: 'STANDARD',
        isOverdue: false,
        isLateCheckoutApproved: true,
        lateCheckOutUntil: '03:00 PM',
        keycardsIssued: 2,
        folioNumber: 'FOL-412-0907',
        roomCharges: 66000,
        restaurantCharges: 6200,
        laundryCharges: 900,
        roomServiceCharges: 1200,
        taxes: 13374,
        totalCharges: 87674,
        paidAmount: 79274,
        balanceDue: 8400,
        pendingCharges: [],
        specialRequests: 'Late checkout granted to 3:00 PM. Club lounge access voucher.',
        notes: 'Corporate billing card on file for ₹8,400 balance settlement.',
        checkoutLog: null,
      },
      {
        id: 'dep-10496',
        name: 'Emily Chen',
        vip: false,
        vipTier: null,
        reservationNumber: 'RES-10496',
        roomNumber: '204',
        floor: '2',
        roomType: 'Classic King',
        ratePlan: 'Direct Web Promotional',
        nightlyRate: 9800,
        stayDates: '05 Sep → 07 Sep',
        checkInDate: '05 Sep',
        checkOutDate: '07 Sep',
        adults: 2,
        children: 0,
        phone: '+65 9123 4567',
        email: 'emily.chen@singaporetech.sg',
        nationality: 'Singapore',
        previousStays: 2,
        lastStay: 'December 2025',
        preferredRoom: 'Classic King',
        bookingSource: 'Direct Web',
        reservationStatus: 'Checked-In',
        stayStatus: 'In-House',
        departureStatus: 'Pending',
        roomStatus: 'Occupied',
        folioStatus: 'Open',
        paymentStatus: 'PAID',
        scheduledCheckOut: '11:00 AM',
        departureTimeSlot: 'MORNING',
        isOverdue: false,
        isLateCheckoutApproved: true,
        lateCheckOutUntil: '02:00 PM',
        keycardsIssued: 2,
        folioNumber: 'FOL-204-0907',
        roomCharges: 19600,
        restaurantCharges: 2100,
        laundryCharges: 0,
        roomServiceCharges: 0,
        taxes: 3906,
        totalCharges: 25606,
        paidAmount: 25606,
        balanceDue: 0,
        pendingCharges: [],
        specialRequests: 'Quiet corner room. Luggage storage until 6 PM.',
        notes: 'Folio settled via Visa contactless at breakfast. Ready for departure.',
        checkoutLog: null,
      },
      {
        id: 'dep-10497',
        name: 'David Miller',
        vip: false,
        vipTier: null,
        reservationNumber: 'RES-10497',
        roomNumber: '310',
        floor: '3',
        roomType: 'Deluxe King',
        ratePlan: 'OTA Package',
        nightlyRate: 11000,
        stayDates: '03 Sep → 07 Sep',
        checkInDate: '03 Sep',
        checkOutDate: '07 Sep',
        adults: 1,
        children: 0,
        phone: '+1 (415) 789-0123',
        email: 'david.miller@bayadvisory.com',
        nationality: 'United States',
        previousStays: 3,
        lastStay: 'February 2026',
        preferredRoom: 'Deluxe King',
        bookingSource: 'OTA / Booking.com',
        reservationStatus: 'Checked-In',
        stayStatus: 'In-House',
        departureStatus: 'Pending',
        roomStatus: 'Occupied',
        folioStatus: 'Open',
        paymentStatus: 'BALANCE_DUE',
        scheduledCheckOut: '12:00 PM',
        departureTimeSlot: 'STANDARD',
        isOverdue: false,
        isLateCheckoutApproved: true,
        lateCheckOutUntil: '02:00 PM',
        keycardsIssued: 1,
        folioNumber: 'FOL-310-0907',
        roomCharges: 44000,
        restaurantCharges: 3100,
        laundryCharges: 600,
        roomServiceCharges: 750,
        taxes: 8721,
        totalCharges: 57171,
        paidAmount: 51567,
        balanceDue: 5604,
        pendingCharges: [],
        specialRequests: 'High speed wifi pass for video conferences.',
        notes: 'Incidental balance ₹5,604 to be collected at reception desk.',
        checkoutLog: null,
      },
      {
        id: 'dep-10498',
        name: 'Sophie Laurent',
        vip: false,
        vipTier: null,
        reservationNumber: 'RES-10498',
        roomNumber: '108',
        floor: '1',
        roomType: 'Classic King',
        ratePlan: 'Direct Corporate',
        nightlyRate: 10500,
        stayDates: '05 Sep → 07 Sep',
        checkInDate: '05 Sep',
        checkOutDate: '07 Sep',
        adults: 1,
        children: 0,
        phone: '+33 6 54 32 10 98',
        email: 'sophie.laurent@parisconsult.fr',
        nationality: 'France',
        previousStays: 1,
        lastStay: 'July 2026',
        preferredRoom: 'Classic King',
        bookingSource: 'Corporate Direct',
        reservationStatus: 'Checked-In',
        stayStatus: 'In-House',
        departureStatus: 'Pending',
        roomStatus: 'Occupied',
        folioStatus: 'Open',
        paymentStatus: 'PAID',
        scheduledCheckOut: '12:00 PM',
        departureTimeSlot: 'STANDARD',
        isOverdue: false,
        isLateCheckoutApproved: true,
        lateCheckOutUntil: '01:45 PM',
        keycardsIssued: 1,
        folioNumber: 'FOL-108-0907',
        roomCharges: 21000,
        restaurantCharges: 1650,
        laundryCharges: 0,
        roomServiceCharges: 0,
        taxes: 4077,
        totalCharges: 26727,
        paidAmount: 26727,
        balanceDue: 0,
        pendingCharges: [],
        specialRequests: 'Non-feather duvet and foam pillows.',
        notes: 'Folio verified and balanced with corporate voucher.',
        checkoutLog: null,
      },
      {
        id: 'dep-10499',
        name: 'Ananya Sharma',
        vip: false,
        vipTier: null,
        reservationNumber: 'RES-10499',
        roomNumber: '322',
        floor: '3',
        roomType: 'Deluxe Ocean Suite',
        ratePlan: 'Direct BAR Package',
        nightlyRate: 18500,
        stayDates: '04 Sep → 07 Sep',
        checkInDate: '04 Sep',
        checkOutDate: '07 Sep',
        adults: 2,
        children: 0,
        phone: '+91 99882 11029',
        email: 'ananya.sharma@delhicap.in',
        nationality: 'India',
        previousStays: 4,
        lastStay: 'May 2026',
        preferredRoom: 'Deluxe Ocean Suite',
        bookingSource: 'Direct Web',
        reservationStatus: 'Checked-In',
        stayStatus: 'In-House',
        departureStatus: 'Pending',
        roomStatus: 'Occupied',
        folioStatus: 'Open',
        paymentStatus: 'BALANCE_DUE',
        scheduledCheckOut: '11:00 AM',
        departureTimeSlot: 'MORNING',
        isOverdue: true, // Expected 11:00 AM, Current 1:35 PM -> OVERDUE #4!
        isLateCheckoutApproved: false,
        keycardsIssued: 2,
        folioNumber: 'FOL-322-0907',
        roomCharges: 55500,
        restaurantCharges: 4800,
        laundryCharges: 1100,
        roomServiceCharges: 2100,
        taxes: 11430,
        totalCharges: 74930,
        paidAmount: 64530,
        balanceDue: 10400,
        pendingCharges: [],
        specialRequests: 'Sea facing balcony. Extra bath towels.',
        notes: 'Checkout overdue. Contact room 322 regarding incidental balance of ₹10,400.',
        checkoutLog: null,
      },
      {
        id: 'dep-10500',
        name: 'Robert Taylor',
        vip: false,
        vipTier: null,
        reservationNumber: 'RES-10500',
        roomNumber: '114',
        floor: '1',
        roomType: 'Classic King',
        ratePlan: 'OTA Package',
        nightlyRate: 9500,
        stayDates: '06 Sep → 07 Sep',
        checkInDate: '06 Sep',
        checkOutDate: '07 Sep',
        adults: 1,
        children: 0,
        phone: '+1 (206) 555-0199',
        email: 'robert.taylor@seattlebio.com',
        nationality: 'United States',
        previousStays: 2,
        lastStay: 'January 2026',
        preferredRoom: 'Classic King',
        bookingSource: 'OTA / Booking.com',
        reservationStatus: 'Checked-In',
        stayStatus: 'In-House',
        departureStatus: 'Pending',
        roomStatus: 'Occupied',
        folioStatus: 'Open',
        paymentStatus: 'PAID',
        scheduledCheckOut: '12:00 PM',
        departureTimeSlot: 'STANDARD',
        isOverdue: false,
        isLateCheckoutApproved: true,
        lateCheckOutUntil: '02:00 PM',
        keycardsIssued: 1,
        folioNumber: 'FOL-114-0907',
        roomCharges: 9500,
        restaurantCharges: 950,
        laundryCharges: 0,
        roomServiceCharges: 0,
        taxes: 1881,
        totalCharges: 12331,
        paidAmount: 12331,
        balanceDue: 0,
        pendingCharges: [],
        specialRequests: 'Near lobby floor. Early wakeup call at 6 AM.',
        notes: 'Pre-paid through Expedia. Folio balanced.',
        checkoutLog: null,
      },

      // ────────────────────────────────────────────────────────────────────────
      // COMPLETED CHECKOUT GUESTS (7 Guests, Completed Today)
      // ────────────────────────────────────────────────────────────────────────
      {
        id: 'dep-10485',
        name: 'Elena Rostova',
        vip: false,
        vipTier: null,
        reservationNumber: 'RES-10485',
        roomNumber: '315',
        floor: '3',
        roomType: 'Deluxe Ocean Suite',
        ratePlan: 'OTA Package',
        nightlyRate: 16000,
        stayDates: '04 Sep → 07 Sep',
        checkInDate: '04 Sep',
        checkOutDate: '07 Sep',
        adults: 2,
        children: 0,
        phone: '+33 612 345 678',
        email: 'elena.rostova@artlux.fr',
        nationality: 'France',
        previousStays: 2,
        lastStay: 'November 2025',
        preferredRoom: 'Deluxe Ocean Suite',
        bookingSource: 'OTA / Booking.com',
        reservationStatus: 'Checked-Out',
        stayStatus: 'Completed',
        departureStatus: 'Completed',
        roomStatus: 'Dirty',
        folioStatus: 'Closed / Settled',
        paymentStatus: 'PAID',
        scheduledCheckOut: '12:00 PM',
        departureTimeSlot: 'MORNING',
        isOverdue: false,
        keycardsIssued: 0,
        folioNumber: 'FOL-315-0907',
        roomCharges: 48000,
        restaurantCharges: 3200,
        laundryCharges: 0,
        roomServiceCharges: 800,
        taxes: 9360,
        totalCharges: 61360,
        paidAmount: 61360,
        balanceDue: 0,
        pendingCharges: [],
        specialRequests: '',
        notes: 'Checked out at 10:30 AM by Duty Agent T01. Room 315 marked Dirty and assigned to Maria Santos.',
        checkoutLog: {
          time: '10:30 AM',
          agent: 'Front Desk Agent (T01)',
          settlementMethod: 'Credit Card (Visa ending in •••• 8821)',
        },
      },
      {
        id: 'dep-10489',
        name: 'Lucas Weber',
        vip: false,
        vipTier: null,
        reservationNumber: 'RES-10489',
        roomNumber: '104',
        floor: '1',
        roomType: 'Classic King',
        ratePlan: 'Direct Corporate',
        nightlyRate: 9500,
        stayDates: '05 Sep → 07 Sep',
        checkInDate: '05 Sep',
        checkOutDate: '07 Sep',
        adults: 1,
        children: 0,
        phone: '+49 171 2345678',
        email: 'lucas.weber@berlin.de',
        nationality: 'Germany',
        previousStays: 5,
        lastStay: 'May 2026',
        preferredRoom: 'Classic King',
        bookingSource: 'Corporate Direct',
        reservationStatus: 'Checked-Out',
        stayStatus: 'Completed',
        departureStatus: 'Completed',
        roomStatus: 'Dirty',
        folioStatus: 'Closed / Settled',
        paymentStatus: 'PAID',
        scheduledCheckOut: '11:00 AM',
        departureTimeSlot: 'MORNING',
        isOverdue: false,
        keycardsIssued: 0,
        folioNumber: 'FOL-104-0907',
        roomCharges: 19000,
        restaurantCharges: 1450,
        laundryCharges: 0,
        roomServiceCharges: 0,
        taxes: 3681,
        totalCharges: 24131,
        paidAmount: 24131,
        balanceDue: 0,
        pendingCharges: [],
        specialRequests: 'Invoice copy required with company tax GSTIN.',
        notes: 'Express checkout completed at 11:15 AM. Receipt emailed.',
        checkoutLog: {
          time: '11:15 AM',
          agent: 'Reception Supervisor (T02)',
          settlementMethod: 'Corporate Direct Billing',
        },
      },
      {
        id: 'dep-10484',
        name: 'Mei-Ling Zhou',
        vip: false,
        vipTier: null,
        reservationNumber: 'RES-10484',
        roomNumber: '218',
        floor: '2',
        roomType: 'Classic King',
        ratePlan: 'Direct BAR',
        nightlyRate: 11000,
        stayDates: '04 Sep → 07 Sep',
        checkInDate: '04 Sep',
        checkOutDate: '07 Sep',
        adults: 2,
        children: 0,
        phone: '+86 139 1234 5678',
        email: 'ml.zhou@shanghaifin.cn',
        nationality: 'China',
        previousStays: 3,
        lastStay: 'April 2026',
        preferredRoom: 'Classic King',
        bookingSource: 'Direct Web',
        reservationStatus: 'Checked-Out',
        stayStatus: 'Completed',
        departureStatus: 'Completed',
        roomStatus: 'Dirty',
        folioStatus: 'Closed / Settled',
        paymentStatus: 'PAID',
        scheduledCheckOut: '09:00 AM',
        departureTimeSlot: 'MORNING',
        isOverdue: false,
        keycardsIssued: 0,
        folioNumber: 'FOL-218-0907',
        roomCharges: 33000,
        restaurantCharges: 2800,
        laundryCharges: 0,
        roomServiceCharges: 0,
        taxes: 6444,
        totalCharges: 42244,
        paidAmount: 42244,
        balanceDue: 0,
        pendingCharges: [],
        specialRequests: 'Early airport taxi booked.',
        notes: 'Checked out at 08:45 AM. Airport taxi dispatched.',
        checkoutLog: {
          time: '08:45 AM',
          agent: 'Morning Shift Agent (T03)',
          settlementMethod: 'UnionPay Credit Card',
        },
      },
      {
        id: 'dep-10486',
        name: 'Oliver Bennett',
        vip: false,
        vipTier: null,
        reservationNumber: 'RES-10486',
        roomNumber: '302',
        floor: '3',
        roomType: 'Classic King',
        ratePlan: 'OTA Package',
        nightlyRate: 9800,
        stayDates: '05 Sep → 07 Sep',
        checkInDate: '05 Sep',
        checkOutDate: '07 Sep',
        adults: 1,
        children: 0,
        phone: '+44 20 8123 4567',
        email: 'oliver.bennett@consulting.uk',
        nationality: 'United Kingdom',
        previousStays: 1,
        lastStay: 'November 2025',
        preferredRoom: 'Classic King',
        bookingSource: 'OTA / Booking.com',
        reservationStatus: 'Checked-Out',
        stayStatus: 'Completed',
        departureStatus: 'Completed',
        roomStatus: 'Dirty',
        folioStatus: 'Closed / Settled',
        paymentStatus: 'PAID',
        scheduledCheckOut: '09:30 AM',
        departureTimeSlot: 'MORNING',
        isOverdue: false,
        keycardsIssued: 0,
        folioNumber: 'FOL-302-0907',
        roomCharges: 19600,
        restaurantCharges: 1150,
        laundryCharges: 400,
        roomServiceCharges: 0,
        taxes: 3807,
        totalCharges: 24957,
        paidAmount: 24957,
        balanceDue: 0,
        pendingCharges: [],
        specialRequests: 'Express check-out requested.',
        notes: 'Folio settled via contactless Apple Pay at 09:15 AM.',
        checkoutLog: {
          time: '09:15 AM',
          agent: 'Morning Shift Agent (T03)',
          settlementMethod: 'Apple Pay / Mastercard',
        },
      },
      {
        id: 'dep-10490',
        name: 'Fatima Al-Zahra',
        vip: false,
        vipTier: null,
        reservationNumber: 'RES-10490',
        roomNumber: '415',
        floor: '4',
        roomType: 'Deluxe King',
        ratePlan: 'Direct BAR',
        nightlyRate: 13000,
        stayDates: '04 Sep → 07 Sep',
        checkInDate: '04 Sep',
        checkOutDate: '07 Sep',
        adults: 2,
        children: 1,
        phone: '+966 50 987 6543',
        email: 'fatima.alzahra@riyadh.sa',
        nationality: 'Saudi Arabia',
        previousStays: 4,
        lastStay: 'March 2026',
        preferredRoom: 'Deluxe King',
        bookingSource: 'Direct Web',
        reservationStatus: 'Checked-Out',
        stayStatus: 'Completed',
        departureStatus: 'Completed',
        roomStatus: 'Dirty',
        folioStatus: 'Closed / Settled',
        paymentStatus: 'PAID',
        scheduledCheckOut: '10:00 AM',
        departureTimeSlot: 'MORNING',
        isOverdue: false,
        keycardsIssued: 0,
        folioNumber: 'FOL-415-0907',
        roomCharges: 39000,
        restaurantCharges: 3600,
        laundryCharges: 800,
        roomServiceCharges: 1400,
        taxes: 8064,
        totalCharges: 52864,
        paidAmount: 52864,
        balanceDue: 0,
        pendingCharges: [],
        specialRequests: 'Extra bed for child.',
        notes: 'Checked out at 09:50 AM. Room marked Dirty. Housekeeping notified.',
        checkoutLog: {
          time: '09:50 AM',
          agent: 'Reception Supervisor (T02)',
          settlementMethod: 'Visa Debit',
        },
      },
      {
        id: 'dep-10492',
        name: 'Liam Gallagher',
        vip: false,
        vipTier: null,
        reservationNumber: 'RES-10492',
        roomNumber: '120',
        floor: '1',
        roomType: 'Classic King',
        ratePlan: 'Corporate BAR',
        nightlyRate: 10000,
        stayDates: '05 Sep → 07 Sep',
        checkInDate: '05 Sep',
        checkOutDate: '07 Sep',
        adults: 1,
        children: 0,
        phone: '+44 161 234 5678',
        email: 'liam.gallagher@manchester.uk',
        nationality: 'United Kingdom',
        previousStays: 2,
        lastStay: 'December 2025',
        preferredRoom: 'Classic King',
        bookingSource: 'Corporate Direct',
        reservationStatus: 'Checked-Out',
        stayStatus: 'Completed',
        departureStatus: 'Completed',
        roomStatus: 'Dirty',
        folioStatus: 'Closed / Settled',
        paymentStatus: 'PAID',
        scheduledCheckOut: '10:15 AM',
        departureTimeSlot: 'MORNING',
        isOverdue: false,
        keycardsIssued: 0,
        folioNumber: 'FOL-120-0907',
        roomCharges: 20000,
        restaurantCharges: 1800,
        laundryCharges: 0,
        roomServiceCharges: 0,
        taxes: 3924,
        totalCharges: 25724,
        paidAmount: 25724,
        balanceDue: 0,
        pendingCharges: [],
        specialRequests: 'Quiet room requested.',
        notes: 'Checked out at 10:05 AM. Receipt printed and handed to guest.',
        checkoutLog: {
          time: '10:05 AM',
          agent: 'Front Desk Agent (T01)',
          settlementMethod: 'Mastercard Corporate',
        },
      },
      {
        id: 'dep-10494',
        name: 'Kavita Patel',
        vip: false,
        vipTier: null,
        reservationNumber: 'RES-10494',
        roomNumber: '225',
        floor: '2',
        roomType: 'Classic King',
        ratePlan: 'Direct BAR',
        nightlyRate: 10500,
        stayDates: '04 Sep → 07 Sep',
        checkInDate: '04 Sep',
        checkOutDate: '07 Sep',
        adults: 2,
        children: 0,
        phone: '+91 98450 67890',
        email: 'kavita.patel@bengaluru.in',
        nationality: 'India',
        previousStays: 6,
        lastStay: 'June 2026',
        preferredRoom: 'Classic King',
        bookingSource: 'Direct Web',
        reservationStatus: 'Checked-Out',
        stayStatus: 'Completed',
        departureStatus: 'Completed',
        roomStatus: 'Dirty',
        folioStatus: 'Closed / Settled',
        paymentStatus: 'PAID',
        scheduledCheckOut: '11:00 AM',
        departureTimeSlot: 'MORNING',
        isOverdue: false,
        keycardsIssued: 0,
        folioNumber: 'FOL-225-0907',
        roomCharges: 31500,
        restaurantCharges: 2450,
        laundryCharges: 0,
        roomServiceCharges: 650,
        taxes: 6228,
        totalCharges: 40828,
        paidAmount: 40828,
        balanceDue: 0,
        pendingCharges: [],
        specialRequests: 'Late afternoon luggage pickup.',
        notes: 'Checked out at 10:50 AM. Luggage tagged in front office cloakroom #042.',
        checkoutLog: {
          time: '10:50 AM',
          agent: 'Duty Manager (T04)',
          settlementMethod: 'UPI / HDFC Bank',
        },
      },
    ];
  }

  async loadData() {
    this.isLoading = true;
    try {
      const res = await reservationsClient.getReservations();
      if (res && res.data) {
        console.log('[DeparturesCheckOutView] Synced with reservation engine:', res.data.length);
      }
    } catch (err) {
      console.warn('[DeparturesCheckOutView] Using operational departures cache', err);
    } finally {
      this.isLoading = false;
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // OPERATIONAL KPI COUNTS
  // ──────────────────────────────────────────────────────────────────────────
  getSummaryMetrics() {
    const total = this.departures.length; // Exactly 19
    const checkedOut = this.departures.filter((d) => d.departureStatus === 'Completed').length; // Exactly 7
    const pending = this.departures.filter((d) => d.departureStatus === 'Pending').length; // Exactly 12
    const late = this.departures.filter((d) => d.isOverdue && d.departureStatus === 'Pending').length; // Exactly 4
    const vip = this.departures.filter((d) => d.vip && d.departureStatus === 'Pending').length; // Exactly 2
    const balanceTotal = this.departures.reduce((sum, d) => sum + (d.departureStatus === 'Pending' ? d.balanceDue : 0), 0); // Exactly ₹48,500

    return {
      departuresToday: total,
      checkedOut,
      pendingCheckout: pending,
      balanceDue: `₹${balanceTotal.toLocaleString('en-IN')}`,
      lateCheckouts: late,
      vipDepartures: vip,
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FILTERING LOGIC
  // ──────────────────────────────────────────────────────────────────────────
  getFilteredDepartures() {
    let list = [...this.departures];

    // Search filter
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter((d) => {
        return (
          d.name.toLowerCase().includes(q) ||
          d.roomNumber.toLowerCase().includes(q) ||
          d.reservationNumber.toLowerCase().includes(q) ||
          d.phone.toLowerCase().includes(q) ||
          d.email.toLowerCase().includes(q) ||
          d.folioNumber.toLowerCase().includes(q) ||
          d.roomType.toLowerCase().includes(q)
        );
      });
    }

    // Quick filter chips & summary card filters
    if (this.activeQuickFilter === 'PENDING') {
      list = list.filter((d) => d.departureStatus === 'Pending');
    } else if (this.activeQuickFilter === 'READY') {
      list = list.filter((d) => d.departureStatus === 'Pending' && d.balanceDue === 0 && d.pendingCharges.length === 0);
    } else if (this.activeQuickFilter === 'BALANCE_DUE') {
      list = list.filter((d) => d.balanceDue > 0);
    } else if (this.activeQuickFilter === 'LATE') {
      list = list.filter((d) => d.isOverdue && d.departureStatus === 'Pending');
    } else if (this.activeQuickFilter === 'VIP') {
      list = list.filter((d) => d.vip);
    } else if (this.activeQuickFilter === 'CHECKED_OUT') {
      list = list.filter((d) => d.departureStatus === 'Completed');
    }

    // Secondary dropdown filters: Room Type
    if (this.filters.roomType !== 'ALL') {
      list = list.filter((d) => d.roomType.toLowerCase().includes(this.filters.roomType.toLowerCase()));
    }

    // Payment Status
    if (this.filters.paymentStatus === 'PAID') {
      list = list.filter((d) => d.balanceDue === 0);
    } else if (this.filters.paymentStatus === 'DUE') {
      list = list.filter((d) => d.balanceDue > 0);
    } else if (this.filters.paymentStatus === 'PARTIAL') {
      list = list.filter((d) => d.paymentStatus === 'PARTIAL');
    }

    // Booking Source
    if (this.filters.bookingSource !== 'ALL') {
      list = list.filter((d) => d.bookingSource.toLowerCase().includes(this.filters.bookingSource.toLowerCase()));
    }

    // Departure Time
    if (this.filters.departureTime === 'MORNING') {
      list = list.filter((d) => d.departureTimeSlot === 'MORNING');
    } else if (this.filters.departureTime === 'STANDARD') {
      list = list.filter((d) => d.departureTimeSlot === 'STANDARD');
    } else if (this.filters.departureTime === 'AFTERNOON') {
      list = list.filter((d) => d.departureTimeSlot === 'AFTERNOON');
    }

    return list;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MAIN RENDER
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

    const metrics = this.getSummaryMetrics();
    const filteredList = this.getFilteredDepartures();
    const allCompleted = this.departures.every((d) => d.departureStatus === 'Completed');

    this.container.innerHTML = `
      <!-- ================================================================= -->
      <!-- HEADER & DATE CONTROLS -->
      <!-- ================================================================= -->
      <section class="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-outline-variant/60">
        <div>
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant font-data-mono">VOLVITECH HOSPITALITY OS</span>
            <span class="text-on-surface-variant font-data-mono">→</span>
            <span class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant font-data-mono">Front Desk</span>
            <span class="text-on-surface-variant font-data-mono">→</span>
            <span class="text-xs font-semibold uppercase tracking-wider text-primary font-data-mono font-bold">Departures</span>
            <span class="text-on-surface-variant font-data-mono">•</span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <span class="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
              Current Time: ${this.currentTime} (Standard C/O: ${this.standardCheckoutTime})
            </span>
          </div>
          <h1 class="font-headline-lg text-2xl sm:text-3xl font-bold text-primary tracking-tight">Departures</h1>
          <p class="text-sm text-on-surface-variant mt-0.5">Guests expected to leave today.</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <!-- Date Selector with Prev / Next -->
          <div class="flex items-center gap-1.5 bg-surface-container-lowest p-1 rounded-xl border border-outline-variant shadow-xs">
            <button id="btn-dep-date-prev" class="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors cursor-pointer" title="Previous Day">
              <span class="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            
            <div class="px-3 text-xs font-bold text-primary flex items-center gap-1.5 font-data-mono">
              <span class="material-symbols-outlined text-[16px] text-primary">calendar_today</span>
              <span id="label-dep-date">${this.selectedDate}</span>
            </div>

            <button id="btn-dep-date-next" class="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors cursor-pointer" title="Next Day">
              <span class="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>

          <!-- Date Shortcuts: Today, Tomorrow, Custom Date -->
          <div class="flex items-center bg-surface-container-lowest p-1 rounded-xl border border-outline-variant shadow-xs relative">
            <button id="btn-date-today" class="px-3 py-1.5 rounded-lg text-xs font-bold ${
              this.selectedDate.includes('07') ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:bg-surface-container'
            } transition-all cursor-pointer">
              Today
            </button>
            <button id="btn-date-tomorrow" class="px-3 py-1.5 rounded-lg text-xs font-bold ${
              this.selectedDate.includes('08') ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:bg-surface-container'
            } transition-all cursor-pointer">
              Tomorrow
            </button>
            <label for="input-custom-date" id="btn-date-custom" class="px-3 py-1.5 rounded-lg text-xs font-bold ${
              !this.selectedDate.includes('07') && !this.selectedDate.includes('08') ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:bg-surface-container'
            } transition-all cursor-pointer flex items-center gap-1">
              <span>Custom Date</span>
              <input type="date" id="input-custom-date" class="sr-only" />
            </label>
          </div>

          <!-- Top-Right Actions -->
          <button id="btn-walk-in" class="px-4 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container hover:border-primary text-primary font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
            <span class="material-symbols-outlined text-[18px]">person_check</span>
            <span>Walk-in</span>
          </button>
          <button id="btn-new-reservation" class="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
            <span class="material-symbols-outlined text-[18px]">add</span>
            <span>+ New Reservation</span>
          </button>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- SUMMARY CARDS (Clickable Operational Indicators) -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <!-- CARD 1: DEPARTURES TODAY -->
        <div class="card-summary-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'ALL'
            ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
            : 'border-outline-variant/70 hover:border-primary/50 hover:shadow-xs'
        }" data-filter="ALL" title="Click to view all departures">
          <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">DEPARTURES TODAY</div>
          <div class="text-3xl font-black text-primary font-headline-lg tracking-tight">${metrics.departuresToday}</div>
          <div class="text-xs text-on-surface-variant mt-0.5">Expected to leave</div>
        </div>

        <!-- CARD 2: CHECKED OUT -->
        <div class="card-summary-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'CHECKED_OUT'
            ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-emerald-500/50 hover:shadow-xs'
        }" data-filter="CHECKED_OUT" title="Click to view completed checkouts">
          <div class="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1 font-data-mono flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px]">check_circle</span>
            CHECKED OUT
          </div>
          <div class="text-3xl font-black text-emerald-700 font-headline-lg tracking-tight">${metrics.checkedOut}</div>
          <div class="text-xs text-emerald-800 mt-0.5">Completed</div>
        </div>

        <!-- CARD 3: PENDING CHECKOUT -->
        <div class="card-summary-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'PENDING'
            ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-blue-400 hover:shadow-xs'
        }" data-filter="PENDING" title="Click to view guests still in-house">
          <div class="text-[10px] font-bold uppercase tracking-wider text-blue-800 mb-1 font-data-mono flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            PENDING CHECKOUT
          </div>
          <div class="text-3xl font-black text-blue-700 font-headline-lg tracking-tight">${metrics.pendingCheckout}</div>
          <div class="text-xs text-blue-800 mt-0.5">Still in-house</div>
        </div>

        <!-- CARD 4: BALANCE DUE -->
        <div class="card-summary-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'BALANCE_DUE'
            ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-rose-400 hover:shadow-xs'
        }" data-filter="BALANCE_DUE" title="Click to view departures with outstanding balances">
          <div class="text-[10px] font-bold uppercase tracking-wider text-rose-900 mb-1 font-data-mono flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            BALANCE DUE
          </div>
          <div class="text-2xl sm:text-3xl font-black text-rose-800 font-headline-lg tracking-tight">${metrics.balanceDue}</div>
          <div class="text-xs text-rose-800 mt-0.5">Outstanding</div>
        </div>

        <!-- CARD 5: LATE CHECKOUTS -->
        <div class="card-summary-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'LATE'
            ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-amber-400 hover:shadow-xs'
        }" data-filter="LATE" title="Click to view guests past expected checkout">
          <div class="text-[10px] font-bold uppercase tracking-wider text-amber-900 mb-1 font-data-mono flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-amber-700">schedule</span>
            LATE CHECKOUTS
          </div>
          <div class="text-3xl font-black text-amber-800 font-headline-lg tracking-tight">${metrics.lateCheckouts}</div>
          <div class="text-xs text-amber-800 mt-0.5">Past expected checkout</div>
        </div>

        <!-- CARD 6: VIP DEPARTURES -->
        <div class="card-summary-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'VIP'
            ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-amber-400 hover:shadow-xs'
        }" data-filter="VIP" title="Click to view VIP departures">
          <div class="text-[10px] font-bold uppercase tracking-wider text-amber-900 mb-1 font-data-mono flex items-center gap-1">
            <span class="text-amber-500 text-[12px]">⭐</span>
            VIP DEPARTURES
          </div>
          <div class="text-3xl font-black text-amber-800 font-headline-lg tracking-tight">${metrics.vipDepartures}</div>
          <div class="text-xs text-amber-800 mt-0.5">Special attention</div>
        </div>

      </section>

      <!-- ================================================================= -->
      <!-- SEARCH & FILTERS TOOLBAR -->
      <!-- ================================================================= -->
      <section class="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/70 shadow-xs space-y-4">
        
        <!-- Large Search Field -->
        <div class="relative">
          <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[22px]">search</span>
          <input
            type="text"
            id="input-dep-search"
            value="${this.searchQuery}"
            placeholder="Search guest, room, reservation or folio..."
            class="w-full pl-12 pr-10 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold text-on-surface bg-surface-container-high/30 placeholder:text-on-surface-variant/80 transition-all outline-none"
          />
          ${
            this.searchQuery
              ? `<button id="btn-clear-dep-search" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary p-1 cursor-pointer">
                  <span class="material-symbols-outlined text-[18px]">close</span>
                </button>`
              : ''
          }
        </div>

        <!-- Quick Filters -->
        <div class="flex flex-wrap items-center gap-2">
          ${[
            { key: 'ALL', label: 'All' },
            { key: 'PENDING', label: 'Pending' },
            { key: 'READY', label: '✓ Ready' },
            { key: 'BALANCE_DUE', label: 'Balance Due' },
            { key: 'LATE', label: 'Late Checkout' },
            { key: 'VIP', label: '⭐ VIP' },
            { key: 'CHECKED_OUT', label: 'Checked Out' },
          ]
            .map((f) => {
              const isActive = this.activeQuickFilter === f.key;
              return `
                <button
                  class="btn-quick-filter px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/60'
                  }"
                  data-filter="${f.key}"
                >
                  ${f.label}
                </button>
              `;
            })
            .join('')}
        </div>

        <!-- Additional Filters Row (Room Type, Payment Status, Booking Source, Departure Time) -->
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-3 border-t border-outline-variant/40">
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Room Type</label>
            <select id="sel-filter-room-type" class="w-full py-1.5 px-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
              <option value="ALL" ${this.filters.roomType === 'ALL' ? 'selected' : ''}>All Types</option>
              <option value="Deluxe King" ${this.filters.roomType === 'Deluxe King' ? 'selected' : ''}>Deluxe King</option>
              <option value="Classic King" ${this.filters.roomType === 'Classic King' ? 'selected' : ''}>Classic King</option>
              <option value="Luxury Suite" ${this.filters.roomType === 'Luxury Suite' ? 'selected' : ''}>Luxury Suite</option>
              <option value="Presidential" ${this.filters.roomType === 'Presidential' ? 'selected' : ''}>Presidential Royal</option>
              <option value="Ocean Suite" ${this.filters.roomType === 'Ocean Suite' ? 'selected' : ''}>Deluxe Ocean Suite</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Payment Status</label>
            <select id="sel-filter-payment" class="w-full py-1.5 px-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
              <option value="ALL" ${this.filters.paymentStatus === 'ALL' ? 'selected' : ''}>All Payments</option>
              <option value="PAID" ${this.filters.paymentStatus === 'PAID' ? 'selected' : ''}>🟢 Paid</option>
              <option value="DUE" ${this.filters.paymentStatus === 'DUE' ? 'selected' : ''}>🔴 Balance Due</option>
              <option value="PARTIAL" ${this.filters.paymentStatus === 'PARTIAL' ? 'selected' : ''}>🟡 Partial / Deposit</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Booking Source</label>
            <select id="sel-filter-source" class="w-full py-1.5 px-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
              <option value="ALL" ${this.filters.bookingSource === 'ALL' ? 'selected' : ''}>All Sources</option>
              <option value="Direct Web" ${this.filters.bookingSource === 'Direct Web' ? 'selected' : ''}>Direct Web</option>
              <option value="Corporate" ${this.filters.bookingSource === 'Corporate' ? 'selected' : ''}>Corporate Direct</option>
              <option value="Booking.com" ${this.filters.bookingSource === 'Booking.com' ? 'selected' : ''}>OTA / Booking.com</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Departure Time</label>
            <select id="sel-filter-time" class="w-full py-1.5 px-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
              <option value="ALL" ${this.filters.departureTime === 'ALL' ? 'selected' : ''}>All Times</option>
              <option value="MORNING" ${this.filters.departureTime === 'MORNING' ? 'selected' : ''}>Morning (&lt; 11:00 AM)</option>
              <option value="STANDARD" ${this.filters.departureTime === 'STANDARD' ? 'selected' : ''}>Standard (11 AM - 12 PM)</option>
              <option value="AFTERNOON" ${this.filters.departureTime === 'AFTERNOON' ? 'selected' : ''}>Afternoon (&gt; 12:00 PM)</option>
            </select>
          </div>

          <div class="flex items-end justify-between gap-2 col-span-2 sm:col-span-1">
            <div class="py-1 px-2 text-xs font-bold text-primary font-data-mono">
              ${filteredList.length} Departures
            </div>
            <button id="btn-reset-filters" class="py-2 px-3 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary flex items-center justify-center gap-1.5 cursor-pointer transition-all">
              <span class="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- MAIN DEPARTURE LIST -->
      <!-- ================================================================= -->
      <section>
        ${this.renderDepartureList(filteredList, allCompleted)}
      </section>

      <!-- ================================================================= -->
      <!-- DEPARTURE DETAIL DRAWER (Pre-Checkout Workspace) -->
      <!-- ================================================================= -->
      <div id="drawer-backdrop" class="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 transition-opacity duration-300 ${
        this.activeDetailGuest ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }"></div>
      
      <aside id="departure-detail-drawer" class="fixed top-0 right-0 h-full w-full max-w-xl bg-surface-container-lowest shadow-2xl z-50 border-l border-outline-variant flex flex-col transform transition-transform duration-300 ease-out select-none ${
        this.activeDetailGuest ? 'translate-x-0' : 'translate-x-full'
      }">
        ${this.renderDetailDrawerContent()}
      </aside>

      <!-- ================================================================= -->
      <!-- WORKFLOW MODALS -->
      <!-- ================================================================= -->
      ${this.renderCheckoutConfirmationModal()}
      ${this.renderCheckoutSuccessModal()}
      ${this.renderAddChargeModal()}
      ${this.renderEarlyDepartureModal()}
      ${this.renderPendingChargesModal()}
    `;

    this.bindEvents();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MAIN DEPARTURE LIST RENDERING
  // ──────────────────────────────────────────────────────────────────────────
  renderDepartureList(list, allCompleted) {
    if (allCompleted && list.length === 0) {
      return `
        <div class="bg-surface-container-lowest rounded-2xl p-16 border border-outline-variant/70 text-center space-y-4 shadow-xs">
          <div class="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <span class="material-symbols-outlined text-[32px]">task_alt</span>
          </div>
          <div>
            <h3 class="font-headline-sm text-lg font-bold text-primary">All departures completed.</h3>
            <p class="text-xs text-on-surface-variant max-w-md mx-auto mt-1">
              All scheduled guests for today have successfully checked out. Rooms marked Dirty and dispatched to Housekeeping.
            </p>
          </div>
        </div>
      `;
    }

    if (list.length === 0) {
      return `
        <div class="bg-surface-container-lowest rounded-2xl p-16 border border-outline-variant/70 text-center space-y-4 shadow-xs">
          <div class="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <span class="material-symbols-outlined text-[32px]">flight_takeoff</span>
          </div>
          <div>
            <h3 class="font-headline-sm text-lg font-bold text-primary">No departures for this date.</h3>
            <p class="text-xs text-on-surface-variant max-w-md mx-auto mt-1">
              Guests scheduled to leave on another date can be viewed using the date selector.
            </p>
          </div>
          <div class="flex items-center justify-center gap-3 pt-2">
            <button id="btn-empty-view-another" class="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary/90 transition-all flex items-center gap-1.5 cursor-pointer">
              <span class="material-symbols-outlined text-[17px]">calendar_month</span>
              <span>View Another Date</span>
            </button>
          </div>
        </div>
      `;
    }

    return `
      <div class="space-y-3">
        ${list.map((d) => this.renderDepartureCard(d)).join('')}
      </div>
    `;
  }

  renderDepartureCard(d) {
    const isCompleted = d.departureStatus === 'Completed';

    // Payment state pill
    let paymentPill = '';
    if (d.balanceDue === 0) {
      paymentPill = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
        <span class="material-symbols-outlined text-[14px]">check</span>
        <span>Paid</span>
      </span>`;
    } else if (d.paymentStatus === 'PARTIAL') {
      paymentPill = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
        <span class="material-symbols-outlined text-[14px]">payments</span>
        <span>Deposit ₹10,000</span>
      </span>`;
    } else {
      paymentPill = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
        <span class="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
        <span>₹${d.balanceDue.toLocaleString('en-IN')} Due</span>
      </span>`;
    }

    // Folio status badge
    const folioReadyPill = d.pendingCharges.length > 0
      ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
          <span class="material-symbols-outlined text-[12px] text-amber-700">warning</span>
          <span>${d.pendingCharges.length} Pending Charge${d.pendingCharges.length > 1 ? 's' : ''}</span>
        </span>`
      : `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <span class="material-symbols-outlined text-[12px] text-emerald-700">check</span>
          <span>Folio Ready</span>
        </span>`;

    // Late checkout subtle warning state:
    // If current time is after hotel's configured checkout time, display subtle warning
    const lateNotice = d.isOverdue && !isCompleted
      ? `<div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-50/90 text-amber-900 border border-amber-300">
          <span class="material-symbols-outlined text-[13px] text-amber-700">warning</span>
          <span>⚠ Checkout overdue • Expected: ${d.scheduledCheckOut} • Current: ${this.currentTime}</span>
        </div>`
      : '';

    return `
      <div class="departure-card-row bg-surface-container-lowest p-5 rounded-2xl border transition-all cursor-pointer ${
        isCompleted
          ? 'border-outline-variant/50 opacity-80'
          : d.balanceDue > 0
          ? 'border-rose-200 hover:border-rose-400 hover:shadow-xs'
          : 'border-outline-variant/70 hover:border-primary/60 hover:shadow-xs'
      }" data-did="${d.id}">
        
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <!-- LEFT: Guest Identity, Room, Stay & Expected Checkout -->
          <div class="flex items-start gap-4 min-w-0">
            <div class="w-11 h-11 rounded-xl ${
              d.vip
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : isCompleted
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-primary/10 text-primary border border-primary/20'
            } font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
              ${isCompleted ? '<span class="material-symbols-outlined text-[20px]">check</span>' : d.name.split(' ').map((n) => n[0]).join('')}
            </div>

            <div class="min-w-0 space-y-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-base font-bold text-primary truncate">${d.name}</span>
                ${
                  d.vip
                    ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        <span>⭐</span><span>VIP</span>
                      </span>`
                    : ''
                }
                <span class="text-xs font-semibold text-on-surface-variant font-data-mono px-2 py-0.5 rounded bg-surface-container border border-outline-variant/60">
                  ${d.reservationNumber}
                </span>
                
                ${
                  isCompleted
                    ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        ✓ Checked Out at ${d.checkoutLog?.time || '10:30 AM'}
                      </span>`
                    : `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        🟢 In-House
                      </span>`
                }
              </div>

              <!-- Room, Dates & Occupancy -->
              <div class="flex items-center gap-2.5 text-xs text-on-surface-variant flex-wrap">
                <span class="font-bold text-primary font-data-mono bg-primary/5 px-2 py-0.5 rounded">
                  Room ${d.roomNumber} • ${d.roomType}
                </span>
                <span>•</span>
                <span class="font-medium text-on-surface">${d.stayDates}</span>
                <span>•</span>
                <span>${d.adults} Adult${d.adults > 1 ? 's' : ''}${d.children > 0 ? `, ${d.children} Child` : ''}</span>
                <span>•</span>
                <span class="font-semibold text-primary font-data-mono">Checkout: ${d.scheduledCheckOut}</span>
              </div>

              <!-- Status Badges & Overdue Warning -->
              <div class="flex items-center gap-2 flex-wrap pt-0.5">
                ${folioReadyPill}
                ${lateNotice}
              </div>
            </div>
          </div>

          <!-- RIGHT: Status & Primary Action Button -->
          <div class="flex flex-wrap items-center justify-between lg:justify-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-outline-variant/40">
            
            <div class="flex items-center gap-2">
              ${paymentPill}
            </div>

            <!-- Primary Action with Obvious Distinction -->
            ${
              isCompleted
                ? `
              <button class="btn-open-detail px-4 py-2 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all cursor-pointer flex items-center gap-1.5" data-did="${d.id}">
                <span class="material-symbols-outlined text-[16px]">receipt</span>
                <span>View Receipt</span>
              </button>
            `
                : d.balanceDue > 0 || d.pendingCharges.length > 0
                ? `
              <button class="btn-review-bill px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95" data-did="${d.id}">
                <span class="material-symbols-outlined text-[16px]">receipt_long</span>
                <span>REVIEW BILL</span>
              </button>
            `
                : `
              <button class="btn-trigger-checkout px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95" data-did="${d.id}">
                <span class="material-symbols-outlined text-[16px]">flight_takeoff</span>
                <span>CHECK OUT</span>
              </button>
            `
            }

          </div>

        </div>

      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // DEPARTURE DETAIL DRAWER (Pre-Checkout Workspace)
  // ──────────────────────────────────────────────────────────────────────────
  renderDetailDrawerContent() {
    const d = this.activeDetailGuest;
    if (!d) return '';

    const isCompleted = d.departureStatus === 'Completed';

    return `
      <!-- Drawer Header -->
      <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between shrink-0">
        <div>
          <div class="flex items-center gap-2 mb-0.5">
            <span class="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">DEPARTURE CONTROL</span>
            ${d.vip ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">⭐ VIP</span>' : ''}
          </div>
          <h2 class="font-headline-sm text-lg font-bold text-primary">${d.name}</h2>
          <p class="text-xs text-on-surface-variant font-data-mono">Room ${d.roomNumber} • Reservation ${d.reservationNumber}</p>
        </div>
        <button id="btn-close-detail-drawer" class="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer" title="Close Drawer">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <!-- Drawer Scrollable Content -->
      <div class="p-6 overflow-y-auto flex-1 space-y-5 text-xs custom-scrollbar">

        <!-- 1. GUEST -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-2.5 shadow-xs">
          <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">GUEST</span>
            <span class="text-xs font-semibold text-primary">Previous stays: <strong>${d.previousStays}</strong></span>
          </div>
          <div class="grid grid-cols-2 gap-3 pt-1">
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Name</span>
              <span class="font-bold text-primary text-sm">${d.name} ${d.vip ? '⭐ VIP' : ''}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Phone</span>
              <span class="font-semibold text-primary">${d.phone}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Email</span>
              <span class="font-semibold text-primary truncate block">${d.email}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Nationality</span>
              <span class="font-semibold text-primary">${d.nationality}</span>
            </div>
          </div>
        </div>

        <!-- 2. CURRENT STAY -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-2.5 shadow-xs">
          <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">CURRENT STAY</span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }">
              <span class="w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-emerald-600' : 'bg-emerald-600 animate-pulse'}"></span>
              ${isCompleted ? 'Completed' : '🟢 In-House'}
            </span>
          </div>
          <div class="grid grid-cols-2 gap-3 pt-1">
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Room</span>
              <span class="font-bold text-primary text-sm">Room ${d.roomNumber}</span>
              <span class="text-[11px] text-on-surface-variant block">${d.roomType}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Stay Dates</span>
              <span class="font-bold text-primary">${d.stayDates}</span>
              <span class="text-[10px] text-on-surface-variant block">Expected C/O: ${d.scheduledCheckOut}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Guests</span>
              <span class="font-semibold text-primary">${d.adults} Adults${d.children > 0 ? `, ${d.children} Child` : ''}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Stay Status</span>
              <span class="font-bold ${isCompleted ? 'text-emerald-700' : 'text-emerald-700'}">${isCompleted ? 'Completed' : '🟢 In-House'}</span>
            </div>
          </div>
        </div>

        <!-- 3. ROOM -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-2.5 shadow-xs">
          <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">ROOM</span>
            <span class="text-xs font-semibold text-primary">Floor ${d.floor}</span>
          </div>
          <div class="grid grid-cols-2 gap-3 pt-1">
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Room Unit</span>
              <span class="font-bold text-primary">Room ${d.roomNumber}</span>
              <span class="text-[11px] text-on-surface-variant block">${d.roomType} • Floor ${d.floor}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Current Status</span>
              <span class="font-bold ${isCompleted ? 'text-rose-700' : 'text-emerald-700'}">
                ${isCompleted ? '🔴 Dirty' : '🟢 Occupied'}
              </span>
            </div>
          </div>
        </div>

        <!-- 4. FOLIO SUMMARY -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-3 shadow-xs">
          <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">FOLIO</span>
            <span class="font-data-mono text-[10px] text-on-surface-variant font-semibold">${d.folioNumber}</span>
          </div>
          
          <div class="space-y-1.5 text-xs">
            <div class="flex justify-between text-on-surface-variant">
              <span>Room Charges</span>
              <span class="font-data-mono font-medium text-on-surface">₹${d.roomCharges.toLocaleString('en-IN')}</span>
            </div>
            <div class="flex justify-between text-on-surface-variant">
              <span>Restaurant</span>
              <span class="font-data-mono font-medium text-on-surface">₹${d.restaurantCharges.toLocaleString('en-IN')}</span>
            </div>
            <div class="flex justify-between text-on-surface-variant">
              <span>Laundry</span>
              <span class="font-data-mono font-medium text-on-surface">₹${d.laundryCharges.toLocaleString('en-IN')}</span>
            </div>
            <div class="flex justify-between text-on-surface-variant">
              <span>Room Service</span>
              <span class="font-data-mono font-medium text-on-surface">₹${d.roomServiceCharges.toLocaleString('en-IN')}</span>
            </div>
            <div class="flex justify-between text-on-surface-variant">
              <span>Taxes</span>
              <span class="font-data-mono font-medium text-on-surface">₹${d.taxes.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div class="pt-2 border-t border-outline-variant/60 space-y-1.5">
            <div class="flex justify-between font-bold text-primary text-sm">
              <span>TOTAL</span>
              <span class="font-data-mono">₹${d.totalCharges.toLocaleString('en-IN')}</span>
            </div>
            <div class="flex justify-between text-xs text-emerald-800 font-semibold">
              <span>PAID</span>
              <span class="font-data-mono">₹${d.paidAmount.toLocaleString('en-IN')}</span>
            </div>
            <div class="flex justify-between font-black ${d.balanceDue > 0 ? 'text-rose-800' : 'text-primary'} text-base pt-1 border-t border-outline-variant/40">
              <span>BALANCE</span>
              <span class="font-data-mono ${d.balanceDue > 0 ? 'bg-rose-100 text-rose-900 px-2 py-0.5 rounded' : ''}">₹${d.balanceDue.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-2 pt-1">
            <button id="btn-drawer-view-full-folio" class="py-2 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary cursor-pointer transition-all">
              View Full Folio
            </button>
            <button id="btn-drawer-add-charge" class="py-2 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary cursor-pointer transition-all">
              Add Charge
            </button>
            <button id="btn-drawer-make-payment" class="py-2 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary cursor-pointer transition-all">
              Make Payment
            </button>
          </div>
        </div>

        <!-- 5. PENDING CHARGES WARNING -->
        ${
          d.pendingCharges && d.pendingCharges.length > 0
            ? `
          <div class="p-4 bg-amber-50 rounded-xl border border-amber-300 text-amber-900 space-y-2.5 shadow-xs">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 font-bold text-xs">
                <span class="material-symbols-outlined text-[18px] text-amber-700">warning</span>
                <span>⚠ PENDING CHARGES</span>
              </div>
              <button id="btn-drawer-review-pending" class="px-2.5 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 text-xs font-bold transition-all cursor-pointer">
                Review Charges
              </button>
            </div>
            <div class="space-y-1 text-xs border-t border-amber-200 pt-1.5">
              ${d.pendingCharges
                .map(
                  (pc) => `
                <div class="flex justify-between">
                  <span>${pc.category}</span>
                  <span class="font-bold font-data-mono">₹${pc.amount.toLocaleString('en-IN')}</span>
                </div>
              `
                )
                .join('')}
            </div>
            <p class="text-[11px] text-amber-800">The system should not silently ignore pending charges. Review before checkout.</p>
          </div>
        `
            : ''
        }

        <!-- 6. PAYMENT COLLECTION (If balance due) -->
        ${
          d.balanceDue > 0
            ? `
          <div id="section-payment-collection" class="p-4 bg-surface-container rounded-xl border border-outline-variant/70 space-y-3 shadow-xs">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold uppercase tracking-wider text-rose-800 font-data-mono">BALANCE DUE</span>
              <span class="text-base font-black text-rose-800 font-data-mono">₹${d.balanceDue.toLocaleString('en-IN')}</span>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Payment Method</label>
              <div class="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                ${['Cash', 'Card', 'UPI', 'Bank Transfer', 'Other']
                  .map(
                    (method) => `
                  <button
                    type="button"
                    class="btn-drawer-pay-method p-2 rounded-lg border text-center cursor-pointer text-xs font-bold transition-all ${
                      this.selectedPaymentMethod === method
                        ? 'border-primary bg-primary text-on-primary shadow-xs'
                        : 'border-outline-variant text-on-surface bg-surface-container-lowest hover:border-primary'
                    }"
                    data-method="${method}"
                  >
                    ${method}
                  </button>
                `
                  )
                  .join('')}
              </div>
            </div>

            <div class="flex items-center justify-between pt-1">
              <span class="text-xs font-semibold text-on-surface">Amount: <strong class="text-sm font-data-mono">₹${d.balanceDue.toLocaleString('en-IN')}</strong></span>
              <button id="btn-drawer-collect-payment" class="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
                <span class="material-symbols-outlined text-[16px]">payments</span>
                <span>Collect Payment</span>
              </button>
            </div>
          </div>
        `
            : `
          <div class="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between shadow-xs">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-emerald-700 text-[18px]">verified</span>
              <div>
                <span class="font-bold block">✓ Payment Settled</span>
                <span class="text-[11px] text-emerald-700 font-data-mono">Total: ₹${d.totalCharges.toLocaleString('en-IN')} | Paid: ₹${d.paidAmount.toLocaleString('en-IN')} | Balance: ₹0</span>
              </div>
            </div>
          </div>
        `
        }

        <!-- 7. SPECIAL INFORMATION (Secondary to Folio) -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-2 shadow-xs">
          <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono block pb-1 border-b border-outline-variant/40">
            SPECIAL INFORMATION
          </span>
          <div class="space-y-1.5 text-xs">
            ${d.specialRequests ? `<div><span class="text-on-surface-variant font-semibold">Special Requests:</span> <p class="text-primary mt-0.5">${d.specialRequests}</p></div>` : ''}
            ${d.vip ? `<div><span class="text-on-surface-variant font-semibold">VIP Status:</span> <p class="text-primary mt-0.5 font-bold">Tier ${d.vipTier} • High Value Return Guest</p></div>` : ''}
            ${d.preferredRoom ? `<div><span class="text-on-surface-variant font-semibold">Guest Preferences:</span> <p class="text-primary mt-0.5">Prefers ${d.preferredRoom}</p></div>` : ''}
            ${d.notes ? `<div><span class="text-on-surface-variant font-semibold">Relevant Guest Notes:</span> <p class="text-primary mt-0.5">${d.notes}</p></div>` : ''}
          </div>
        </div>

        <!-- 8. EARLY DEPARTURE SHORTCUT -->
        ${
          !isCompleted
            ? `
          <div class="pt-1 flex items-center justify-between">
            <button id="btn-drawer-early-departure" class="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer">
              <span class="material-symbols-outlined text-[15px]">event_busy</span>
              <span>Process Early Departure Adjustment</span>
            </button>
          </div>
        `
            : ''
        }

      </div>

      <!-- Drawer Bottom Action Bar -->
      <div class="p-5 border-t border-outline-variant/70 bg-surface-bright shrink-0">
        ${
          isCompleted
            ? `
          <button id="btn-drawer-completed-view" class="w-full py-3 rounded-xl bg-surface-container border border-outline-variant text-primary text-sm font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer">
            <span class="material-symbols-outlined text-[19px] text-emerald-600">verified</span>
            <span>Checkout Completed (${d.checkoutLog?.time || '10:30 AM'})</span>
          </button>
        `
            : `
          <button id="btn-drawer-checkout-action" class="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98">
            <span class="material-symbols-outlined text-[19px]">flight_takeoff</span>
            <span>CHECK OUT</span>
          </button>
        `
        }
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // WORKFLOW: CHECKOUT CONFIRMATION MODAL
  // ──────────────────────────────────────────────────────────────────────────
  renderCheckoutConfirmationModal() {
    if (!this.activeConfirmCheckoutGuest) return '';
    const d = this.activeConfirmCheckoutGuest;

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
          
          <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-primary font-data-mono">Checkout Protocol</span>
              <h2 class="font-headline-sm text-base font-bold text-primary">Confirm Guest Check-Out</h2>
            </div>
            <button id="btn-close-confirm-checkout" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-4 overflow-y-auto custom-scrollbar text-xs">
            
            <!-- CHECKOUT SUMMARY -->
            <div class="p-4 bg-surface-container rounded-xl border border-outline-variant/60 space-y-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono block pb-1 border-b border-outline-variant/40">
                CHECKOUT SUMMARY
              </span>
              <div class="grid grid-cols-2 gap-2 text-xs pt-1">
                <div><span class="text-on-surface-variant block text-[10px]">Guest:</span><strong class="text-sm text-primary">${d.name}</strong></div>
                <div><span class="text-on-surface-variant block text-[10px]">Room:</span><strong class="text-sm text-primary">${d.roomNumber}</strong></div>
                <div><span class="text-on-surface-variant block text-[10px]">Stay:</span><span>${d.stayDates}</span></div>
                <div><span class="text-on-surface-variant block text-[10px]">Keycards to Return:</span><span>${d.keycardsIssued} keycard${d.keycardsIssued !== 1 ? 's' : ''}</span></div>
              </div>
              <div class="pt-2 border-t border-outline-variant/60 flex justify-between font-bold text-primary">
                <span>Total:</span>
                <span class="font-data-mono">₹${d.totalCharges.toLocaleString('en-IN')}</span>
              </div>
              <div class="flex justify-between text-emerald-800 font-semibold">
                <span>Paid:</span>
                <span class="font-data-mono">₹${d.paidAmount.toLocaleString('en-IN')}</span>
              </div>
              <div class="flex justify-between font-bold text-primary pt-1 border-t border-outline-variant/40">
                <span>Balance:</span>
                <span class="font-data-mono">₹${d.balanceDue.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <!-- AFTER CHECKOUT CLEAR OPERATIONAL IMPACT -->
            <div class="p-4 bg-purple-50/70 rounded-xl border border-purple-200 text-purple-950 space-y-2.5">
              <span class="text-[10px] font-bold uppercase tracking-wider text-purple-900 font-data-mono block pb-1 border-b border-purple-200">
                AFTER CHECKOUT
              </span>
              <div class="space-y-1.5 text-xs">
                <div class="flex items-center justify-between">
                  <span class="font-medium">Reservation:</span>
                  <span class="font-bold text-purple-900">Checked Out</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="font-medium">Stay:</span>
                  <span class="font-bold text-purple-900">Completed</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="font-medium">Folio:</span>
                  <span class="font-bold text-purple-900">Closed / Settled</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="font-medium">Room:</span>
                  <span class="font-bold text-rose-800">Dirty</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="font-medium">Housekeeping:</span>
                  <span class="font-bold text-purple-900">Cleaning task will be created</span>
                </div>
              </div>
            </div>

            ${
              d.balanceDue > 0
                ? `
              <div class="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
                <span class="material-symbols-outlined text-rose-700 text-[18px]">error</span>
                <span>Outstanding balance of ₹${d.balanceDue.toLocaleString('en-IN')} will be closed & posted to Guest Master Account.</span>
              </div>
            `
                : ''
            }

          </div>

          <div class="px-6 py-4 border-t border-outline-variant/70 bg-surface-bright flex items-center justify-end gap-2.5">
            <button id="btn-cancel-confirm-checkout" class="px-4 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all cursor-pointer">
              Cancel
            </button>
            <button id="btn-do-confirm-checkout" class="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
              <span class="material-symbols-outlined text-[16px]">check</span>
              <span>CONFIRM CHECKOUT</span>
            </button>
          </div>

        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // WORKFLOW: CHECKOUT SUCCESS SCREEN
  // ──────────────────────────────────────────────────────────────────────────
  renderCheckoutSuccessModal() {
    if (!this.activeSuccessGuest) return '';
    const d = this.activeSuccessGuest;

    return `
      <div class="fixed inset-0 z-[70] flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
          
          <div class="p-6 text-center space-y-3">
            <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <span class="material-symbols-outlined text-[36px]">check_circle</span>
            </div>

            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-800 font-data-mono block">CHECKOUT COMPLETE</span>
              <h2 class="font-headline-sm text-xl font-bold text-primary mt-0.5">${d.name}</h2>
              <p class="text-sm font-semibold text-primary mt-1">Room ${d.roomNumber}</p>
            </div>

            <div class="p-4 bg-surface-container rounded-xl border border-outline-variant/60 text-left space-y-1.5 text-xs max-w-sm mx-auto">
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Total:</span>
                <span class="font-bold text-primary font-data-mono">₹${d.totalCharges.toLocaleString('en-IN')}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Paid:</span>
                <span class="font-bold text-emerald-800 font-data-mono">₹${d.paidAmount.toLocaleString('en-IN')}</span>
              </div>
              <div class="flex justify-between font-bold pt-1 border-t border-outline-variant/40">
                <span class="text-on-surface-variant">Balance:</span>
                <span class="font-data-mono text-emerald-800">₹0</span>
              </div>
              <div class="flex justify-between pt-1 border-t border-outline-variant/40 text-[11px]">
                <span class="text-on-surface-variant">Room Turnover:</span>
                <span class="font-bold text-rose-700">Room ${d.roomNumber} Marked Dirty</span>
              </div>
              <div class="flex justify-between text-[11px]">
                <span class="text-on-surface-variant">Housekeeping Task:</span>
                <span class="font-semibold text-primary font-data-mono">HK-TASK-${d.roomNumber}-0907</span>
              </div>
            </div>

            <!-- Actions: Print Bill, Email Bill, WhatsApp Bill, Print Receipt, Done -->
            <div class="pt-3 flex flex-wrap items-center justify-center gap-2">
              <button id="btn-success-print-bill" class="px-3.5 py-2 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary flex items-center gap-1.5 cursor-pointer">
                <span class="material-symbols-outlined text-[16px]">print</span>
                <span>Print Bill</span>
              </button>
              <button id="btn-success-email-bill" class="px-3.5 py-2 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary flex items-center gap-1.5 cursor-pointer">
                <span class="material-symbols-outlined text-[16px]">mail</span>
                <span>Email Bill</span>
              </button>
              <button id="btn-success-whatsapp-bill" class="px-3.5 py-2 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary flex items-center gap-1.5 cursor-pointer">
                <span class="material-symbols-outlined text-[16px]">chat</span>
                <span>WhatsApp Bill</span>
              </button>
              <button id="btn-success-print-receipt" class="px-3.5 py-2 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary flex items-center gap-1.5 cursor-pointer">
                <span class="material-symbols-outlined text-[16px]">receipt</span>
                <span>Print Receipt</span>
              </button>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-outline-variant/70 bg-surface-bright flex items-center justify-end">
            <button id="btn-success-done" class="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm cursor-pointer hover:bg-primary/90 transition-all">
              Done
            </button>
          </div>

        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // WORKFLOW: ADD INCIDENTAL CHARGE MODAL
  // ──────────────────────────────────────────────────────────────────────────
  renderAddChargeModal() {
    if (!this.activeAddChargeGuest) return '';
    const d = this.activeAddChargeGuest;

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-primary font-data-mono">Incidental Charge Posting</span>
              <h2 class="font-headline-sm text-base font-bold text-primary">Add Charge — Room ${d.roomNumber}</h2>
            </div>
            <button id="btn-close-add-charge" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-4 text-xs">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Category</label>
              <select id="sel-charge-category" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none">
                <option value="Restaurant">Restaurant (The Grand Bistro)</option>
                <option value="Room Service">Room Service / In-Room Dining</option>
                <option value="Laundry">Laundry / Dry Cleaning</option>
                <option value="Minibar">Minibar Consumption</option>
                <option value="Spa">Serenity Wellness Spa</option>
                <option value="Miscellaneous">Miscellaneous Incidentals</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Description / Item Detail</label>
              <input type="text" id="input-charge-desc" placeholder="e.g. Express laundry press / late snack" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none" />
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Amount (₹)</label>
              <input type="number" id="input-charge-amount" placeholder="0.00" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-sm font-bold font-data-mono text-primary outline-none" />
            </div>

            <div class="p-3 bg-surface-container rounded-xl border border-outline-variant/60 text-[11px] text-on-surface-variant">
              Taxes (GST 18%) will be calculated and added automatically to Folio ${d.folioNumber}.
            </div>
          </div>

          <div class="px-6 py-4 border-t border-outline-variant/70 bg-surface-bright flex items-center justify-end gap-2">
            <button id="btn-cancel-add-charge" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-submit-add-charge" class="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm cursor-pointer hover:bg-primary/90 transition-all">Post Charge to Folio</button>
          </div>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // WORKFLOW: EARLY DEPARTURE MODAL
  // ──────────────────────────────────────────────────────────────────────────
  renderEarlyDepartureModal() {
    if (!this.activeEarlyDepartureGuest) return '';
    const d = this.activeEarlyDepartureGuest;

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">Early Departure Protocol</span>
              <h2 class="font-headline-sm text-base font-bold text-primary">Modify Checkout Date — Room ${d.roomNumber}</h2>
            </div>
            <button id="btn-close-early-departure" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-3.5 text-xs">
            <div class="p-3 bg-surface-container rounded-xl border border-outline-variant/60 space-y-1">
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Original Departure:</span>
                <span class="font-bold text-primary">10 Sep 2026</span>
              </div>
              <div class="flex justify-between">
                <span class="text-on-surface-variant">New Departure:</span>
                <span class="font-bold text-emerald-800">Today (07 Sep 2026)</span>
              </div>
            </div>

            <div class="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 space-y-1.5">
              <span class="font-bold block">Rate Adjustment & Policy</span>
              <p class="text-[11px] leading-relaxed">
                Releasing remaining stay nights back to hotel inventory. Early departure policy applied. Updated charges will be recalculated to actual nights elapsed.
              </p>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-outline-variant/70 bg-surface-bright flex items-center justify-end gap-2">
            <button id="btn-cancel-early-departure" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-confirm-early-departure" class="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm cursor-pointer">Confirm Early Departure</button>
          </div>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // WORKFLOW: PENDING CHARGES MODAL
  // ──────────────────────────────────────────────────────────────────────────
  renderPendingChargesModal() {
    if (!this.activePendingChargesGuest) return '';
    const d = this.activePendingChargesGuest;

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-lg overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-amber-800 font-data-mono">Pending Departmental Charges</span>
              <h2 class="font-headline-sm text-base font-bold text-primary">Review Charges — Room ${d.roomNumber}</h2>
            </div>
            <button id="btn-close-pending-charges" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-3 text-xs">
            <p class="text-on-surface-variant">Select charges to post to guest folio before final settlement:</p>
            <div class="space-y-2">
              ${d.pendingCharges
                .map(
                  (pc, idx) => `
                <div class="flex items-center justify-between p-3 rounded-xl border border-outline-variant bg-surface-container/40">
                  <div class="flex items-center gap-2.5">
                    <input type="checkbox" id="chk-pc-${idx}" checked class="accent-primary rounded" />
                    <div>
                      <span class="font-bold text-primary block">${pc.category} — ${pc.description}</span>
                      <span class="text-[10px] text-on-surface-variant">Recorded at ${pc.time}</span>
                    </div>
                  </div>
                  <span class="font-black font-data-mono text-primary text-xs">₹${pc.amount.toLocaleString('en-IN')}</span>
                </div>
              `
                )
                .join('')}
            </div>
          </div>

          <div class="px-6 py-4 border-t border-outline-variant/70 bg-surface-bright flex items-center justify-end gap-2">
            <button id="btn-cancel-pending-charges" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-post-pending-charges" class="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm cursor-pointer hover:bg-primary/90 transition-all">Post All to Folio</button>
          </div>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // BIND EVENTS
  // ──────────────────────────────────────────────────────────────────────────
  bindEvents() {
    if (!this.container) return;

    // Date Shortcuts
    const btnToday = this.container.querySelector('#btn-date-today');
    if (btnToday) {
      btnToday.onclick = () => {
        this.selectedDate = '07 September 2026';
        this.renderContent();
      };
    }
    const btnTomorrow = this.container.querySelector('#btn-date-tomorrow');
    if (btnTomorrow) {
      btnTomorrow.onclick = () => {
        this.selectedDate = '08 September 2026';
        this.renderContent();
      };
    }
    const inputCustomDate = this.container.querySelector('#input-custom-date');
    if (inputCustomDate) {
      inputCustomDate.onchange = (e) => {
        if (e.target.value) {
          const d = new Date(e.target.value);
          this.selectedDate = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
          this.renderContent();
        }
      };
    }

    const btnDatePrev = this.container.querySelector('#btn-dep-date-prev');
    if (btnDatePrev) {
      btnDatePrev.onclick = () => {
        this.selectedDate = '06 September 2026';
        this.renderContent();
      };
    }
    const btnDateNext = this.container.querySelector('#btn-dep-date-next');
    if (btnDateNext) {
      btnDateNext.onclick = () => {
        this.selectedDate = '08 September 2026';
        this.renderContent();
      };
    }

    // Header buttons
    const btnNewRes = this.container.querySelector('#btn-new-reservation');
    if (btnNewRes) {
      btnNewRes.onclick = () => {
        const modal = new NewBookingModal({
          onCreated: () => {
            store.notify();
            Toast.show({ title: 'Reservation Created', message: 'New guest booking successfully added.', type: 'success' });
          },
        });
        modal.init().then(() => {
          document.body.appendChild(modal.render());
        });
      };
    }

    const btnWalkin = this.container.querySelector('#btn-walk-in');
    if (btnWalkin) {
      btnWalkin.onclick = () => {
        Toast.show({ title: 'Walk-In Registration', message: 'Opening express walk-in desk.', type: 'info' });
      };
    }

    // Summary Card Clickable Filters
    this.container.querySelectorAll('.card-summary-metric').forEach((card) => {
      card.onclick = () => {
        this.activeQuickFilter = card.dataset.filter;
        this.renderContent();
      };
    });

    // Quick Filter Chips
    this.container.querySelectorAll('.btn-quick-filter').forEach((btn) => {
      btn.onclick = () => {
        this.activeQuickFilter = btn.dataset.filter;
        this.renderContent();
      };
    });

    // Search input
    const searchInput = this.container.querySelector('#input-dep-search');
    if (searchInput) {
      searchInput.oninput = (e) => {
        this.searchQuery = e.target.value;
        this.renderContent();
        const input = this.container.querySelector('#input-dep-search');
        if (input) {
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        }
      };
    }

    const btnClearSearch = this.container.querySelector('#btn-clear-dep-search');
    if (btnClearSearch) {
      btnClearSearch.onclick = () => {
        this.searchQuery = '';
        this.renderContent();
      };
    }

    // Dropdown filters
    const bindDropdown = (id, key) => {
      const el = this.container.querySelector(id);
      if (el) {
        el.onchange = (e) => {
          this.filters[key] = e.target.value;
          this.renderContent();
        };
      }
    };
    bindDropdown('#sel-filter-room-type', 'roomType');
    bindDropdown('#sel-filter-payment', 'paymentStatus');
    bindDropdown('#sel-filter-source', 'bookingSource');
    bindDropdown('#sel-filter-time', 'departureTime');

    // Reset Filters
    const btnReset = this.container.querySelector('#btn-reset-filters');
    if (btnReset) {
      btnReset.onclick = () => {
        this.searchQuery = '';
        this.activeQuickFilter = 'ALL';
        this.filters = { roomType: 'ALL', paymentStatus: 'ALL', bookingSource: 'ALL', departureTime: 'ALL' };
        this.renderContent();
      };
    }

    // Card row click -> open drawer
    this.container.querySelectorAll('.departure-card-row').forEach((row) => {
      row.onclick = () => this.openDetailDrawer(row.dataset.did);
    });

    // Review bill button
    this.container.querySelectorAll('.btn-review-bill').forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        this.openDetailDrawer(btn.dataset.did);
      };
    });

    // Primary Check Out row button -> triggers confirmation workflow modal
    this.container.querySelectorAll('.btn-trigger-checkout').forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const d = this.departures.find((x) => x.id === btn.dataset.did);
        if (d) {
          this.activeConfirmCheckoutGuest = d;
          this.renderContent();
        }
      };
    });

    // Open detail button
    this.container.querySelectorAll('.btn-open-detail').forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        this.openDetailDrawer(btn.dataset.did);
      };
    });

    // Close Detail Drawer
    const btnCloseDrawer = this.container.querySelector('#btn-close-detail-drawer');
    if (btnCloseDrawer) btnCloseDrawer.onclick = () => this.closeDetailDrawer();
    const backdrop = this.container.querySelector('#drawer-backdrop');
    if (backdrop) backdrop.onclick = () => this.closeDetailDrawer();

    // Drawer buttons
    const btnDrawerCheckout = this.container.querySelector('#btn-drawer-checkout-action');
    if (btnDrawerCheckout) {
      btnDrawerCheckout.onclick = () => {
        this.activeConfirmCheckoutGuest = this.activeDetailGuest;
        this.renderContent();
      };
    }

    // Payment Method selectors in drawer
    this.container.querySelectorAll('.btn-drawer-pay-method').forEach((btn) => {
      btn.onclick = () => {
        this.selectedPaymentMethod = btn.dataset.method;
        this.renderContent();
      };
    });

    // Drawer Collect Payment
    const btnDrawerCollectPay = this.container.querySelector('#btn-drawer-collect-payment');
    if (btnDrawerCollectPay && this.activeDetailGuest) {
      btnDrawerCollectPay.onclick = () => {
        const d = this.activeDetailGuest;
        d.paidAmount = d.totalCharges;
        d.balanceDue = 0;
        d.paymentStatus = 'PAID';
        Toast.show({
          title: 'Payment Settled',
          message: `₹${d.totalCharges.toLocaleString('en-IN')} collected via ${this.selectedPaymentMethod}. Folio balanced.`,
          type: 'success',
        });
        this.renderContent();
      };
    }

    const btnDrawerViewFolio = this.container.querySelector('#btn-drawer-view-full-folio');
    if (btnDrawerViewFolio) {
      btnDrawerViewFolio.onclick = () => {
        store.setNavTab('billing');
      };
    }

    const btnDrawerAddCharge = this.container.querySelector('#btn-drawer-add-charge');
    if (btnDrawerAddCharge) {
      btnDrawerAddCharge.onclick = () => {
        this.activeAddChargeGuest = this.activeDetailGuest;
        this.renderContent();
      };
    }

    const btnDrawerMakePay = this.container.querySelector('#btn-drawer-make-payment');
    if (btnDrawerMakePay) {
      btnDrawerMakePay.onclick = () => {
        const sec = this.container.querySelector('#section-payment-collection');
        if (sec) {
          sec.scrollIntoView({ behavior: 'smooth' });
          sec.classList.add('ring-2', 'ring-primary');
          setTimeout(() => sec.classList.remove('ring-2', 'ring-primary'), 1500);
        } else {
          Toast.show({ title: 'Folio Settled', message: 'Current balance is already ₹0.', type: 'info' });
        }
      };
    }

    const btnDrawerReviewPending = this.container.querySelector('#btn-drawer-review-pending');
    if (btnDrawerReviewPending) {
      btnDrawerReviewPending.onclick = () => {
        this.activePendingChargesGuest = this.activeDetailGuest;
        this.renderContent();
      };
    }

    const btnDrawerEarlyDep = this.container.querySelector('#btn-drawer-early-departure');
    if (btnDrawerEarlyDep) {
      btnDrawerEarlyDep.onclick = () => {
        this.activeEarlyDepartureGuest = this.activeDetailGuest;
        this.renderContent();
      };
    }

    // Modal: Confirm Checkout
    const btnCloseConfirm = this.container.querySelector('#btn-close-confirm-checkout');
    if (btnCloseConfirm) btnCloseConfirm.onclick = () => { this.activeConfirmCheckoutGuest = null; this.renderContent(); };
    const btnCancelConfirm = this.container.querySelector('#btn-cancel-confirm-checkout');
    if (btnCancelConfirm) btnCancelConfirm.onclick = () => { this.activeConfirmCheckoutGuest = null; this.renderContent(); };

    const btnDoConfirm = this.container.querySelector('#btn-do-confirm-checkout');
    if (btnDoConfirm && this.activeConfirmCheckoutGuest) {
      btnDoConfirm.onclick = async () => {
        const d = this.activeConfirmCheckoutGuest;

        // 1. Backend PostgreSQL API Check-Out
        try {
          if (d.id && (d.isApiRecord || d.id.length > 20)) {
            await reservationsClient.checkOut(d.id);
          } else if (d.resNumber) {
            await reservationsClient.checkOut(d.resNumber).catch(() => {});
          }
        } catch (err) {
          console.warn('[DeparturesCheckOutView] Backend API checkout note:', err.message);
        }

        // 2. Cascade state change into Central Store SSOT:
        // Room -> VACANT DIRTY, Housekeeping -> Urgent Turnover task dispatched
        store.checkOutGuestLifecycle(d.roomNumber, d.id || d.resNumber);

        // 3. Update view status
        d.reservationStatus = 'Checked-Out';
        d.stayStatus = 'Completed';
        d.departureStatus = 'Completed';
        d.folioStatus = 'Closed / Settled';
        d.roomStatus = 'Dirty';
        d.balanceDue = 0;
        d.paidAmount = d.totalCharges;
        d.keycardsIssued = 0;
        d.checkoutLog = {
          time: this.currentTime,
          agent: 'Front Desk Duty Agent (Victoria Sterling / T01)',
          settlementMethod: 'Credit Card (Visa)',
        };

        this.activeConfirmCheckoutGuest = null;
        this.activeDetailGuest = null;
        this.activeSuccessGuest = d;

        Toast.show({
          title: 'Check-Out Confirmed',
          message: `${d.name} checked out. Room ${d.roomNumber} set to Dirty. Urgent Housekeeping turnover task dispatched.`,
          type: 'success',
        });
        this.renderContent();
      };
    }

    // Modal: Success Screen Actions
    const btnDoneSuccess = this.container.querySelector('#btn-success-done');
    if (btnDoneSuccess) btnDoneSuccess.onclick = () => { this.activeSuccessGuest = null; this.renderContent(); };

    const btnPrintBill = this.container.querySelector('#btn-success-print-bill');
    if (btnPrintBill) btnPrintBill.onclick = () => window.print();

    const btnEmailBill = this.container.querySelector('#btn-success-email-bill');
    if (btnEmailBill) btnEmailBill.onclick = () => Toast.show({ title: 'Bill Emailed', message: `Final invoice sent to ${this.activeSuccessGuest?.email}.`, type: 'success' });

    const btnWhatsappBill = this.container.querySelector('#btn-success-whatsapp-bill');
    if (btnWhatsappBill) btnWhatsappBill.onclick = () => Toast.show({ title: 'WhatsApp Sent', message: `PDF bill transmitted to ${this.activeSuccessGuest?.phone}.`, type: 'success' });

    const btnPrintReceipt = this.container.querySelector('#btn-success-print-receipt');
    if (btnPrintReceipt) btnPrintReceipt.onclick = () => window.print();

    // Modal: Add Charge Actions
    const btnCloseAC = this.container.querySelector('#btn-close-add-charge');
    if (btnCloseAC) btnCloseAC.onclick = () => { this.activeAddChargeGuest = null; this.renderContent(); };
    const btnCancelAC = this.container.querySelector('#btn-cancel-add-charge');
    if (btnCancelAC) btnCancelAC.onclick = () => { this.activeAddChargeGuest = null; this.renderContent(); };

    const btnSubmitAC = this.container.querySelector('#btn-submit-add-charge');
    if (btnSubmitAC && this.activeAddChargeGuest) {
      btnSubmitAC.onclick = () => {
        const cat = this.container.querySelector('#sel-charge-category')?.value || 'Miscellaneous';
        const desc = this.container.querySelector('#input-charge-desc')?.value || 'Incidental fee';
        const amount = parseFloat(this.container.querySelector('#input-charge-amount')?.value || '0');

        if (amount <= 0 || isNaN(amount)) {
          Toast.show({ title: 'Invalid Amount', message: 'Please enter a valid charge amount.', type: 'warning' });
          return;
        }

        const d = this.activeAddChargeGuest;
        const tax = Math.round(amount * 0.18);
        const net = amount + tax;

        if (cat === 'Restaurant') d.restaurantCharges += amount;
        else if (cat === 'Laundry') d.laundryCharges += amount;
        else if (cat === 'Room Service') d.roomServiceCharges += amount;
        else d.roomCharges += amount;

        d.taxes += tax;
        d.totalCharges += net;
        d.balanceDue += net;
        d.paymentStatus = 'BALANCE_DUE';

        this.activeAddChargeGuest = null;
        Toast.show({
          title: 'Charge Posted',
          message: `₹${net.toLocaleString('en-IN')} (incl. GST) added to Folio ${d.folioNumber}.`,
          type: 'success',
        });
        this.renderContent();
      };
    }

    // Modal: Pending Charges Actions
    const btnClosePC = this.container.querySelector('#btn-close-pending-charges');
    if (btnClosePC) btnClosePC.onclick = () => { this.activePendingChargesGuest = null; this.renderContent(); };
    const btnCancelPC = this.container.querySelector('#btn-cancel-pending-charges');
    if (btnCancelPC) btnCancelPC.onclick = () => { this.activePendingChargesGuest = null; this.renderContent(); };

    const btnPostPC = this.container.querySelector('#btn-post-pending-charges');
    if (btnPostPC && this.activePendingChargesGuest) {
      btnPostPC.onclick = () => {
        const d = this.activePendingChargesGuest;
        const totalPending = d.pendingCharges.reduce((sum, item) => sum + item.amount, 0);
        d.totalCharges += totalPending;
        d.balanceDue += totalPending;
        d.pendingCharges = [];
        d.paymentStatus = 'BALANCE_DUE';
        this.activePendingChargesGuest = null;
        Toast.show({ title: 'Charges Posted', message: `₹${totalPending.toLocaleString('en-IN')} posted to folio ${d.folioNumber}.`, type: 'success' });
        this.renderContent();
      };
    }

    // Modal: Early Departure Actions
    const btnCloseED = this.container.querySelector('#btn-close-early-departure');
    if (btnCloseED) btnCloseED.onclick = () => { this.activeEarlyDepartureGuest = null; this.renderContent(); };
    const btnCancelED = this.container.querySelector('#btn-cancel-early-departure');
    if (btnCancelED) btnCancelED.onclick = () => { this.activeEarlyDepartureGuest = null; this.renderContent(); };

    const btnConfirmED = this.container.querySelector('#btn-confirm-early-departure');
    if (btnConfirmED && this.activeEarlyDepartureGuest) {
      btnConfirmED.onclick = () => {
        const d = this.activeEarlyDepartureGuest;
        d.checkOutDate = '07 Sep';
        d.stayDates = '04 Sep → 07 Sep';
        this.activeEarlyDepartureGuest = null;
        Toast.show({ title: 'Early Departure Applied', message: `${d.name} checkout updated to today. Inventory released.`, type: 'success' });
        this.renderContent();
      };
    }

    // Empty state view another date
    const btnEmptyAnother = this.container.querySelector('#btn-empty-view-another');
    if (btnEmptyAnother) {
      btnEmptyAnother.onclick = () => {
        this.selectedDate = '07 September 2026';
        this.renderContent();
      };
    }
  }

  openDetailDrawer(did) {
    this.activeDetailGuest = this.departures.find((d) => d.id === did) || this.departures[0];
    this.renderContent();
  }

  closeDetailDrawer() {
    this.activeDetailGuest = null;
    this.renderContent();
  }
}
