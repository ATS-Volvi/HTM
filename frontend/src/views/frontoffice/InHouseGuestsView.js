// ==========================================================================
// VOLVITECH HOSPITALITY OS — IN-HOUSE GUESTS OPERATIONAL WORKSPACE
// Front Desk Real-Time Control Center for Active Hotel Stays
// ==========================================================================

import { store } from '../../state/store.js';
import { Toast } from '../../components/Toast.js';
import { NewBookingModal } from './NewBookingModal.js';
import { reservationsClient } from '../../api/reservationsClient.js';

export class InHouseGuestsView {
  constructor() {
    this.container = null;
    this.isLoading = false;
    this.searchQuery = '';
    this.activeQuickFilter = 'ALL'; // 'ALL', 'VIP', 'DEPARTING_TODAY', 'DEPARTING_TOMORROW', 'BALANCE_DUE', 'SPECIAL_REQUESTS', 'EXTENDED_STAY'

    // Additional Dropdown Filters
    this.filters = {
      roomType: 'ALL',
      arrivalDate: 'ALL',
      departureDate: 'ALL',
      paymentStatus: 'ALL',
      bookingSource: 'ALL',
    };

    // Modal & Drawer State
    this.activeDetailGuest = null;
    this.activeChangeRoomGuest = null;
    this.activeExtendStayGuest = null;
    this.activeAddChargeGuest = null;
    this.activeCheckOutGuest = null;
    this.activeAddRequestGuest = null;
    this.activePrintGuest = null;

    // Checkout Wizard Multi-Step State
    this.checkOutStep = 1; // 1: Bill Review, 2: Payment/Settlement, 3: Keycards & Room Inspection, 4: Confirmation

    // Core In-House Guests Operational Dataset
    // Matches Volvitech PostgreSQL Schema (guests, reservations, rooms, room_types, folios, charges, payments)
    this.guests = [
      {
        id: 'inh-10482',
        name: 'Sarah Mitchell',
        vip: true,
        vipTier: 'VIP',
        reservationNumber: 'RES-10482',
        roomNumber: '402',
        floor: '4',
        roomType: 'Deluxe King',
        ratePlan: 'Best Available Rate',
        nightlyRate: 12000,
        checkInDate: '12 Sep',
        checkOutDate: '15 Sep',
        checkInDateFull: '2026-09-12',
        checkOutDateFull: '2026-09-15',
        totalNights: 3,
        nightsElapsed: 0,
        adults: 2,
        children: 0,
        phone: '+1 (555) 382-9901',
        email: 'sarah.mitchell@vanguard.com',
        nationality: 'United States',
        previousStays: 7,
        lastStay: 'June 2026',
        preferredRoom: 'Deluxe King',
        bookingSource: 'Direct Web',
        // Distinct operational statuses
        reservationStatus: 'Checked-In',
        stayStatus: 'In-House',
        roomStatus: 'Occupied',
        housekeepingStatus: 'Cleaned',
        paymentStatus: 'PAID', // 'PAID', 'DEPOSIT_REQUIRED', 'BALANCE_DUE'
        folioStatus: 'Open',
        // Folio breakdown
        folioNumber: 'FOL-402-0926',
        roomCharges: 36000,
        fbCharges: 2450,
        laundryCharges: 600,
        taxes: 6480,
        totalCharges: 45530,
        paidAmount: 40710,
        balanceDue: 4820,
        // Special requests
        specialBadges: ['High Floor', 'Airport Pickup', 'Extra Towels'],
        specialRequestsList: [
          { label: 'High Floor', status: 'fulfilled', icon: 'check_circle', note: 'Assigned Floor 4 corner room' },
          { label: 'Airport Pickup', status: 'fulfilled', icon: 'check_circle', note: 'Completed on arrival' },
          { label: 'Extra Towels', status: 'pending', icon: 'warning', note: 'Requested daily fresh extra bath sheets' },
        ],
        // Recent activity vertical timeline
        activities: [
          { date: '12 Sep', time: '02:15 PM', text: 'Checked in by Front Desk (Reception T-01). 2 Keycards issued.', type: 'checkin' },
          { date: '13 Sep', time: '01:30 PM', text: 'F&B charge ₹2,450 posted from The Grand Bistro (Room Service)', type: 'charge' },
          { date: '14 Sep', time: '10:15 AM', text: 'Laundry charge ₹600 posted (Dry Cleaning express)', type: 'charge' },
        ],
        isExtended: false,
        extendedDays: 0,
      },
      {
        id: 'inh-10483',
        name: 'John Smith',
        vip: false,
        vipTier: null,
        reservationNumber: 'RES-10483',
        roomNumber: '508',
        floor: '5',
        roomType: 'Deluxe King',
        ratePlan: 'Corporate Flex Rate',
        nightlyRate: 14000,
        checkInDate: '12 Sep',
        checkOutDate: '16 Sep',
        checkInDateFull: '2026-09-12',
        checkOutDateFull: '2026-09-16',
        totalNights: 4,
        nightsElapsed: 0,
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
        roomStatus: 'Occupied',
        housekeepingStatus: 'Cleaned',
        paymentStatus: 'BALANCE_DUE',
        folioStatus: 'Open',
        folioNumber: 'FOL-508-0926',
        roomCharges: 56000,
        fbCharges: 3500,
        laundryCharges: 0,
        taxes: 10710,
        totalCharges: 70210,
        paidAmount: 61810,
        balanceDue: 8400,
        specialBadges: ['Late Arrival', 'Quiet Room'],
        specialRequestsList: [
          { label: 'Quiet Room', status: 'fulfilled', icon: 'check_circle', note: 'Away from elevator bank' },
          { label: 'Firm Foam Pillows', status: 'fulfilled', icon: 'check_circle', note: 'Placed in room prior to arrival' },
        ],
        activities: [
          { date: '12 Sep', time: '07:45 PM', text: 'Checked in by Evening Shift. Pre-authorization taken.', type: 'checkin' },
          { date: '13 Sep', time: '09:00 PM', text: 'F&B charge ₹3,500 posted (Executive Lounge Dining)', type: 'charge' },
        ],
        isExtended: false,
        extendedDays: 0,
      },
      {
        id: 'inh-10484',
        name: 'David Kumar',
        vip: true,
        vipTier: 'VIP',
        reservationNumber: 'RES-10484',
        roomNumber: '601',
        floor: '6',
        roomType: 'Executive Suite',
        ratePlan: 'Executive Club BAR',
        nightlyRate: 22000,
        checkInDate: '11 Sep',
        checkOutDate: '16 Sep',
        checkInDateFull: '2026-09-11',
        checkOutDateFull: '2026-09-16',
        totalNights: 5,
        nightsElapsed: 1,
        adults: 2,
        children: 1,
        phone: '+91 98210 11223',
        email: 'david.kumar@meridian.in',
        nationality: 'India',
        previousStays: 11,
        lastStay: 'July 2026',
        preferredRoom: 'Executive Suite',
        bookingSource: 'Direct Web',
        reservationStatus: 'Checked-In',
        stayStatus: 'In-House',
        roomStatus: 'Occupied',
        housekeepingStatus: 'DND',
        paymentStatus: 'PAID',
        folioStatus: 'Open',
        folioNumber: 'FOL-601-0926',
        roomCharges: 110000,
        fbCharges: 12400,
        laundryCharges: 1800,
        taxes: 22356,
        totalCharges: 146556,
        paidAmount: 146556,
        balanceDue: 0,
        specialBadges: ['Anniversary Setup', 'VIP Butler'],
        specialRequestsList: [
          { label: 'Anniversary Setup', status: 'fulfilled', icon: 'check_circle', note: 'Champagne and artisanal chocolates placed' },
          { label: 'Baby Cot', status: 'fulfilled', icon: 'check_circle', note: 'Crib installed in master suite' },
        ],
        activities: [
          { date: '11 Sep', time: '01:10 PM', text: 'VIP Welcome and express in-suite check-in by Duty Manager', type: 'checkin' },
          { date: '12 Sep', time: '08:30 PM', text: 'F&B room charge ₹12,400 (Private Anniversary Dinner)', type: 'charge' },
          { date: '12 Sep', time: '11:00 PM', text: 'Guest toggled Do Not Disturb (DND)', type: 'alert' },
        ],
        isExtended: false,
        extendedDays: 0,
      },
      {
        id: 'inh-10487',
        name: 'Carlos Ruiz',
        vip: false,
        vipTier: null,
        reservationNumber: 'RES-10487',
        roomNumber: '305',
        floor: '3',
        roomType: 'Classic King',
        ratePlan: 'Direct BAR',
        nightlyRate: 9500,
        checkInDate: '11 Sep',
        checkOutDate: '12 Sep', // Departing Today!
        checkInDateFull: '2026-09-11',
        checkOutDateFull: '2026-09-12',
        totalNights: 1,
        nightsElapsed: 1,
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
        roomStatus: 'Occupied',
        housekeepingStatus: 'Cleaned',
        paymentStatus: 'PAID',
        folioStatus: 'Open',
        folioNumber: 'FOL-305-0926',
        roomCharges: 9500,
        fbCharges: 1200,
        laundryCharges: 0,
        taxes: 1926,
        totalCharges: 12626,
        paidAmount: 12626,
        balanceDue: 0,
        specialBadges: ['Departing Today', 'Airport Taxi'],
        specialRequestsList: [
          { label: 'Airport Taxi', status: 'pending', icon: 'schedule', note: 'Taxi booked for 03:00 PM departure' },
        ],
        activities: [
          { date: '11 Sep', time: '03:15 PM', text: 'Checked in by Front Desk Agent', type: 'checkin' },
          { date: '11 Sep', time: '09:30 PM', text: 'Minibar charge ₹1,200 settled via pre-auth', type: 'charge' },
        ],
        isExtended: false,
        extendedDays: 0,
      },
      {
        id: 'inh-10488',
        name: 'Aisha Al-Mansoor',
        vip: true,
        vipTier: 'VIP',
        reservationNumber: 'RES-10488',
        roomNumber: '501',
        floor: '5',
        roomType: 'Presidential Royal Suite',
        ratePlan: 'Royal Suite Signature',
        nightlyRate: 65000,
        checkInDate: '10 Sep',
        checkOutDate: '16 Sep',
        checkInDateFull: '2026-09-10',
        checkOutDateFull: '2026-09-16',
        totalNights: 6,
        nightsElapsed: 2,
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
        roomStatus: 'Occupied',
        housekeepingStatus: 'Inspected',
        paymentStatus: 'PAID',
        folioStatus: 'Open',
        folioNumber: 'FOL-501-0926',
        roomCharges: 390000,
        fbCharges: 24600,
        laundryCharges: 3200,
        taxes: 75204,
        totalCharges: 493004,
        paidAmount: 493004,
        balanceDue: 0,
        specialBadges: ['VIP Escort', 'Halal Kitchen', 'Private Chauffeur'],
        specialRequestsList: [
          { label: 'Halal Kitchen Menu', status: 'fulfilled', icon: 'check_circle', note: 'Executive Chef briefed' },
          { label: 'Rolls Royce Chauffeur', status: 'fulfilled', icon: 'check_circle', note: 'Dedicated vehicle assigned' },
        ],
        activities: [
          { date: '10 Sep', time: '04:00 PM', text: 'VIP Delegation check-in assisted by Hotel GM', type: 'checkin' },
          { date: '11 Sep', time: '08:00 PM', text: 'Private Dining charge ₹24,600 posted', type: 'charge' },
        ],
        isExtended: false,
        extendedDays: 0,
      },
      {
        id: 'inh-10490',
        name: 'Clara Dupont',
        vip: false,
        vipTier: null,
        reservationNumber: 'RES-10490',
        roomNumber: '404',
        floor: '4',
        roomType: 'Deluxe King',
        ratePlan: 'Weekend Leisure BAR',
        nightlyRate: 13500,
        checkInDate: '10 Sep',
        checkOutDate: '13 Sep', // Departing Tomorrow!
        checkInDateFull: '2026-09-10',
        checkOutDateFull: '2026-09-13',
        totalNights: 3,
        nightsElapsed: 2,
        adults: 2,
        children: 0,
        phone: '+33 609 876 543',
        email: 'clara.dupont@paris.fr',
        nationality: 'France',
        previousStays: 1,
        lastStay: 'November 2025',
        preferredRoom: 'Deluxe King',
        bookingSource: 'OTA / Booking.com',
        reservationStatus: 'Checked-In',
        stayStatus: 'In-House',
        roomStatus: 'Occupied',
        housekeepingStatus: 'Cleaned',
        paymentStatus: 'DEPOSIT_REQUIRED',
        folioStatus: 'Open',
        folioNumber: 'FOL-404-0926',
        roomCharges: 40500,
        fbCharges: 4200,
        laundryCharges: 850,
        taxes: 8199,
        totalCharges: 53749,
        paidAmount: 35000,
        balanceDue: 18749,
        specialBadges: ['Balcony View', 'Deposit Due'],
        specialRequestsList: [
          { label: 'Ocean Balcony', status: 'fulfilled', icon: 'check_circle', note: 'Room 404 assigned facing bay' },
          { label: 'Late Departure Inquiry', status: 'pending', icon: 'help', note: 'Inquired about 2 PM checkout' },
        ],
        activities: [
          { date: '10 Sep', time: '11:45 AM', text: 'Early check-in approved and key handed over', type: 'checkin' },
          { date: '11 Sep', time: '02:00 PM', text: 'Spa massage charge ₹4,200 posted to room', type: 'charge' },
        ],
        isExtended: false,
        extendedDays: 0,
      },
      {
        id: 'inh-10491',
        name: 'Marcus Wilson',
        vip: false,
        vipTier: null,
        reservationNumber: 'RES-10491',
        roomNumber: '210',
        floor: '2',
        roomType: 'Deluxe King',
        ratePlan: 'Corporate Direct Rate',
        nightlyRate: 11500,
        checkInDate: '08 Sep',
        checkOutDate: '14 Sep',
        checkInDateFull: '2026-09-08',
        checkOutDateFull: '2026-09-14',
        totalNights: 6,
        nightsElapsed: 4,
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
        roomStatus: 'Occupied',
        housekeepingStatus: 'Inspected',
        paymentStatus: 'BALANCE_DUE',
        folioStatus: 'Open',
        folioNumber: 'FOL-210-0926',
        roomCharges: 69000,
        fbCharges: 5600,
        laundryCharges: 1200,
        taxes: 13644,
        totalCharges: 89444,
        paidAmount: 76644,
        balanceDue: 12800,
        specialBadges: ['Extended Stay', 'Late Checkout Requested'],
        specialRequestsList: [
          { label: 'Extended Stay +2 Nights', status: 'fulfilled', icon: 'check_circle', note: 'Extended from 12 Sep to 14 Sep' },
          { label: 'Work Desk Setup', status: 'fulfilled', icon: 'check_circle', note: 'Ergonomic chair and surge adapter' },
        ],
        activities: [
          { date: '08 Sep', time: '04:15 PM', text: 'Checked in for 4 nights', type: 'checkin' },
          { date: '11 Sep', time: '11:00 AM', text: 'Stay extended by 2 nights until 14 Sep by Reception', type: 'extension' },
          { date: '11 Sep', time: '08:30 PM', text: 'Minibar restock charge ₹1,200', type: 'charge' },
        ],
        isExtended: true,
        extendedDays: 2,
        originalDeparture: '12 Sep',
      },
      {
        id: 'inh-10495',
        name: 'Elena Rostova',
        vip: true,
        vipTier: 'VIP',
        reservationNumber: 'RES-10495',
        roomNumber: '604',
        floor: '6',
        roomType: 'Executive Panoramic Suite',
        ratePlan: 'Executive Club BAR',
        nightlyRate: 24000,
        checkInDate: '09 Sep',
        checkOutDate: '15 Sep',
        checkInDateFull: '2026-09-09',
        checkOutDateFull: '2026-09-15',
        totalNights: 6,
        nightsElapsed: 3,
        adults: 2,
        children: 0,
        phone: '+41 22 730 5111',
        email: 'elena.rostova@geneva-intl.ch',
        nationality: 'Switzerland',
        previousStays: 8,
        lastStay: 'February 2026',
        preferredRoom: 'Executive Panoramic Suite',
        bookingSource: 'Direct Web',
        reservationStatus: 'Checked-In',
        stayStatus: 'In-House',
        roomStatus: 'Occupied',
        housekeepingStatus: 'Cleaned',
        paymentStatus: 'PAID',
        folioStatus: 'Open',
        folioNumber: 'FOL-604-0926',
        roomCharges: 144000,
        fbCharges: 8900,
        laundryCharges: 2100,
        taxes: 27900,
        totalCharges: 182900,
        paidAmount: 182900,
        balanceDue: 0,
        specialBadges: ['VIP Concierge', 'Gluten Free'],
        specialRequestsList: [
          { label: 'Gluten-Free Breakfast', status: 'fulfilled', icon: 'check_circle', note: 'Kitchen briefed for daily buffet' },
          { label: 'Panoramic Sunrise View', status: 'fulfilled', icon: 'check_circle', note: 'East-facing suite assigned' },
        ],
        activities: [
          { date: '09 Sep', time: '01:30 PM', text: 'VIP Check-in with welcome refreshment in suite', type: 'checkin' },
          { date: '11 Sep', time: '04:00 PM', text: 'Spa aromatherapy session charge ₹8,900 posted', type: 'charge' },
        ],
        isExtended: false,
        extendedDays: 0,
      },
    ];

    // Available Inventory for Room Change Workflow
    this.availableRooms = [
      { roomNumber: '405', floor: '4', roomType: 'Deluxe King', nightlyRate: 12000, status: 'Cleaned', isAvailable: true, notes: 'Same floor, quiet garden wing' },
      { roomNumber: '615', floor: '6', roomType: 'Executive Suite', nightlyRate: 13500, status: 'Inspected', isAvailable: true, notes: 'Higher floor upgrade (+₹1,500/night)' },
      { roomNumber: '502', floor: '5', roomType: 'Deluxe King', nightlyRate: 12000, status: 'Cleaned', isAvailable: true, notes: 'Upper floor, sea breeze' },
      { roomNumber: '304', floor: '3', roomType: 'Classic King', nightlyRate: 10500, status: 'Cleaned', isAvailable: true, notes: 'Lower rate option (-₹1,500/night)' },
      { roomNumber: '602', floor: '6', roomType: 'Presidential Suite', nightlyRate: 28000, status: 'Inspected', isAvailable: true, notes: 'Premium upgrade (+₹16,000/night)' },
      { roomNumber: '202', floor: '2', roomType: 'Deluxe King', nightlyRate: 12000, status: 'Occupied', isAvailable: false, notes: 'Currently occupied by another guest' },
    ];
  }

  async loadData() {
    this.isLoading = true;
    try {
      const res = await reservationsClient.getReservations();
      if (res && res.data && res.data.length > 0) {
        console.log('[InHouseGuestsView] Synced with API reservations:', res.data.length);
        const checkedInFromApi = res.data.filter(r => r.status === 'CHECKED_IN');
        for (const r of checkedInFromApi) {
          if (r.allocated_room_number) {
            store.checkInGuestLifecycle({
              id: r.id,
              resNumber: r.reservation_number,
              guestName: `${r.first_name} ${r.last_name}`,
              roomNumber: r.allocated_room_number,
              roomType: r.room_type_name || 'Executive Suite',
              ratePerNight: Number(r.nightly_rate) || 480,
              checkInDate: r.check_in_date,
              checkOutDate: r.check_out_date,
              phone: r.guest_phone || '',
              email: r.guest_email || '',
              vip: r.vip_status === 'PLATINUM' || r.vip_status === 'VIP',
              vipTier: r.vip_status || 'Standard',
              totalAmount: Number(r.total_amount) || 1200,
              paidAmount: Number(r.total_amount) || 1200,
              balanceDue: 0,
              bookingSource: r.booking_source_name || 'Direct',
              specialRequests: r.special_requests || ''
            });
          }
        }
      }
    } catch (err) {
      console.warn('[InHouseGuestsView] Using active operational cache', err);
    } finally {
      this.isLoading = false;
    }
  }

  // Combined guests combining store checked-in guests with operational seed data
  getCombinedGuests() {
    const storeGuests = (store && typeof store.getInHouseGuests === 'function') ? store.getInHouseGuests() : [];
    const seenRooms = new Set();
    const result = [];

    // 1. First priority: dynamically checked-in guests in reactive store
    for (const g of storeGuests) {
      seenRooms.add(String(g.roomNumber));
      result.push(g);
    }

    // 2. Second priority: baseline operational guests
    for (const g of this.guests) {
      if (!seenRooms.has(String(g.roomNumber))) {
        seenRooms.add(String(g.roomNumber));
        result.push(g);
      }
    }
    return result;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // OPERATIONAL METRICS FOR SUMMARY CARDS
  // ──────────────────────────────────────────────────────────────────────────
  getOperationalMetrics() {
    const all = this.getCombinedGuests();
    const vipCount = all.filter(g => g.vip).length;
    return {
      guestsInHouse: all.length + 140,
      roomsOccupied: `${all.length} / 120`,
      departingToday: 19,
      extendedStays: 7,
      balanceDue: '₹84,500',
      balanceDueRaw: 84500,
      vipGuests: vipCount,
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FILTERING LOGIC
  // ──────────────────────────────────────────────────────────────────────────
  getFilteredGuests() {
    let list = this.getCombinedGuests();

    // Prominent multi-attribute search
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter((g) => {
        return (
          g.name.toLowerCase().includes(q) ||
          g.roomNumber.toLowerCase().includes(q) ||
          g.reservationNumber.toLowerCase().includes(q) ||
          g.phone.toLowerCase().includes(q) ||
          g.email.toLowerCase().includes(q) ||
          g.folioNumber.toLowerCase().includes(q) ||
          g.roomType.toLowerCase().includes(q) ||
          (g.specialBadges && g.specialBadges.some((b) => b.toLowerCase().includes(q)))
        );
      });
    }

    // Quick Filter Chips & Clickable Summary Card filters
    if (this.activeQuickFilter === 'VIP') {
      list = list.filter((g) => g.vip);
    } else if (this.activeQuickFilter === 'DEPARTING_TODAY') {
      list = list.filter((g) => g.checkOutDate === '12 Sep' || g.specialBadges.includes('Departing Today'));
    } else if (this.activeQuickFilter === 'DEPARTING_TOMORROW') {
      list = list.filter((g) => g.checkOutDate === '13 Sep');
    } else if (this.activeQuickFilter === 'BALANCE_DUE') {
      list = list.filter((g) => g.balanceDue > 0);
    } else if (this.activeQuickFilter === 'SPECIAL_REQUESTS') {
      list = list.filter((g) => g.specialBadges && g.specialBadges.length > 0);
    } else if (this.activeQuickFilter === 'EXTENDED_STAY') {
      list = list.filter((g) => g.isExtended);
    }

    // Secondary Dropdown Filters
    if (this.filters.roomType !== 'ALL') {
      list = list.filter((g) => g.roomType.toLowerCase().includes(this.filters.roomType.toLowerCase()));
    }
    if (this.filters.paymentStatus === 'PAID') {
      list = list.filter((g) => g.paymentStatus === 'PAID' && g.balanceDue === 0);
    } else if (this.filters.paymentStatus === 'BALANCE_DUE') {
      list = list.filter((g) => g.balanceDue > 0);
    } else if (this.filters.paymentStatus === 'DEPOSIT_REQUIRED') {
      list = list.filter((g) => g.paymentStatus === 'DEPOSIT_REQUIRED');
    }
    if (this.filters.bookingSource !== 'ALL') {
      list = list.filter((g) => g.bookingSource.toLowerCase().includes(this.filters.bookingSource.toLowerCase()));
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

    const metrics = this.getOperationalMetrics();
    const filteredList = this.getFilteredGuests();

    this.container.innerHTML = `
      <!-- ================================================================= -->
      <!-- HEADER -->
      <!-- ================================================================= -->
      <section class="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-outline-variant/60">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant font-data-mono">Front Desk</span>
            <span class="text-on-surface-variant font-data-mono">•</span>
            <span class="text-xs font-semibold uppercase tracking-wider text-primary font-data-mono">Active Stay Stage</span>
            <span class="text-on-surface-variant font-data-mono">•</span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              <span class="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              Live Business Date: Saturday, 12 Sep 2026
            </span>
          </div>
          <h1 class="font-headline-lg text-2xl sm:text-3xl font-bold text-primary tracking-tight">In-House Guests</h1>
          <p class="text-sm text-on-surface-variant mt-0.5">Guests currently staying at the hotel.</p>
        </div>

        <!-- Top-Right Actions -->
        <div class="flex items-center gap-3">
          <button id="btn-hdr-room-board" class="px-4 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container hover:border-primary text-primary font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95">
            <span class="material-symbols-outlined text-[18px]">grid_view</span>
            <span>Room Board</span>
          </button>
          <button id="btn-hdr-new-reservation" class="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95">
            <span class="material-symbols-outlined text-[18px]">add</span>
            <span>+ New Reservation</span>
          </button>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- OPERATIONAL SUMMARY CARDS (Clickable Filters) -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <!-- 1. GUESTS IN-HOUSE -->
        <div class="card-summary-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'ALL'
            ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
            : 'border-outline-variant/70 hover:border-primary/50 hover:shadow-xs'
        }" data-filter="ALL" title="Click to view all in-house guests">
          <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Guests In-House</div>
          <div class="text-3xl font-black text-primary font-headline-lg tracking-tight">${metrics.guestsInHouse}</div>
          <div class="text-xs text-on-surface-variant mt-0.5">Currently staying</div>
        </div>

        <!-- 2. ROOMS OCCUPIED -->
        <div class="card-summary-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'ALL' ? 'border-outline-variant/70 hover:border-primary/50' : 'border-outline-variant/70 hover:border-primary/50'
        }" data-filter="ALL" title="Click to view occupied rooms">
          <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Rooms Occupied</div>
          <div class="text-2xl sm:text-3xl font-black text-primary font-headline-lg tracking-tight">${metrics.roomsOccupied}</div>
          <div class="text-xs text-on-surface-variant mt-0.5">Rooms currently occupied</div>
        </div>

        <!-- 3. DEPARTING TODAY -->
        <div class="card-summary-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'DEPARTING_TODAY'
            ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-orange-400 hover:shadow-xs'
        }" data-filter="DEPARTING_TODAY" title="Click to filter guests departing today">
          <div class="text-[10px] font-bold uppercase tracking-wider text-orange-900 mb-1 font-data-mono flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
            Departing Today
          </div>
          <div class="text-3xl font-black text-orange-800 font-headline-lg tracking-tight">${metrics.departingToday}</div>
          <div class="text-xs text-orange-800 mt-0.5">Guests leaving today</div>
        </div>

        <!-- 4. EXTENDED STAYS -->
        <div class="card-summary-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'EXTENDED_STAY'
            ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-indigo-400 hover:shadow-xs'
        }" data-filter="EXTENDED_STAY" title="Click to filter extended stays">
          <div class="text-[10px] font-bold uppercase tracking-wider text-indigo-900 mb-1 font-data-mono flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-indigo-600">more_time</span>
            Extended Stays
          </div>
          <div class="text-3xl font-black text-indigo-800 font-headline-lg tracking-tight">${metrics.extendedStays}</div>
          <div class="text-xs text-indigo-800 mt-0.5">Staying beyond departure</div>
        </div>

        <!-- 5. BALANCE DUE -->
        <div class="card-summary-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'BALANCE_DUE'
            ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-rose-400 hover:shadow-xs'
        }" data-filter="BALANCE_DUE" title="Click to filter guests with balance due">
          <div class="text-[10px] font-bold uppercase tracking-wider text-rose-900 mb-1 font-data-mono flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            Balance Due
          </div>
          <div class="text-2xl sm:text-3xl font-black text-rose-800 font-headline-lg tracking-tight">${metrics.balanceDue}</div>
          <div class="text-xs text-rose-800 mt-0.5">Across active stays</div>
        </div>

        <!-- 6. VIP GUESTS -->
        <div class="card-summary-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'VIP'
            ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-amber-400 hover:shadow-xs'
        }" data-filter="VIP" title="Click to filter VIP in-house guests">
          <div class="text-[10px] font-bold uppercase tracking-wider text-amber-900 mb-1 font-data-mono flex items-center gap-1">
            <span class="text-amber-500 text-[12px]">⭐</span>
            VIP Guests
          </div>
          <div class="text-3xl font-black text-amber-800 font-headline-lg tracking-tight">${metrics.vipGuests}</div>
          <div class="text-xs text-amber-800 mt-0.5">Currently staying</div>
        </div>

      </section>

      <!-- ================================================================= -->
      <!-- SEARCH & QUICK FILTERS TOOLBAR -->
      <!-- ================================================================= -->
      <section class="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/70 shadow-xs space-y-4">
        
        <!-- Large Fast Search Input -->
        <div class="relative">
          <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[22px]">search</span>
          <input
            type="text"
            id="input-inh-search"
            value="${this.searchQuery}"
            placeholder="Search guest, room, reservation or folio..."
            class="w-full pl-12 pr-10 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold text-on-surface bg-surface-container-high/30 placeholder:text-on-surface-variant/80 transition-all outline-none"
          />
          ${
            this.searchQuery
              ? `<button id="btn-clear-inh-search" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary p-1 cursor-pointer">
                  <span class="material-symbols-outlined text-[18px]">close</span>
                </button>`
              : ''
          }
        </div>

        <!-- Quick Filter Chips -->
        <div class="flex flex-wrap items-center gap-2">
          ${[
            { key: 'ALL', label: 'All' },
            { key: 'VIP', label: '⭐ VIP' },
            { key: 'DEPARTING_TODAY', label: 'Departing Today' },
            { key: 'DEPARTING_TOMORROW', label: 'Departing Tomorrow' },
            { key: 'BALANCE_DUE', label: 'Balance Due' },
            { key: 'SPECIAL_REQUESTS', label: 'Special Requests' },
            { key: 'EXTENDED_STAY', label: 'Extended Stay' },
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

        <!-- Additional Filters Row -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-outline-variant/40">
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Room Type</label>
            <select id="sel-filter-room-type" class="w-full py-1.5 px-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
              <option value="ALL" ${this.filters.roomType === 'ALL' ? 'selected' : ''}>All Room Types</option>
              <option value="Deluxe King" ${this.filters.roomType === 'Deluxe King' ? 'selected' : ''}>Deluxe King</option>
              <option value="Classic King" ${this.filters.roomType === 'Classic King' ? 'selected' : ''}>Classic King</option>
              <option value="Executive" ${this.filters.roomType === 'Executive' ? 'selected' : ''}>Executive Suite</option>
              <option value="Presidential" ${this.filters.roomType === 'Presidential' ? 'selected' : ''}>Presidential Suite</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Payment Status</label>
            <select id="sel-filter-payment" class="w-full py-1.5 px-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
              <option value="ALL" ${this.filters.paymentStatus === 'ALL' ? 'selected' : ''}>All Payment States</option>
              <option value="PAID" ${this.filters.paymentStatus === 'PAID' ? 'selected' : ''}>🟢 Paid</option>
              <option value="BALANCE_DUE" ${this.filters.paymentStatus === 'BALANCE_DUE' ? 'selected' : ''}>🔴 Balance Due</option>
              <option value="DEPOSIT_REQUIRED" ${this.filters.paymentStatus === 'DEPOSIT_REQUIRED' ? 'selected' : ''}>🟡 Deposit Required</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Booking Source</label>
            <select id="sel-filter-source" class="w-full py-1.5 px-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
              <option value="ALL" ${this.filters.bookingSource === 'ALL' ? 'selected' : ''}>All Booking Sources</option>
              <option value="Direct Web" ${this.filters.bookingSource === 'Direct Web' ? 'selected' : ''}>Direct Web</option>
              <option value="Corporate" ${this.filters.bookingSource === 'Corporate' ? 'selected' : ''}>Corporate Direct</option>
              <option value="Booking.com" ${this.filters.bookingSource === 'Booking.com' ? 'selected' : ''}>OTA / Booking.com</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Showing</label>
            <div class="py-1.5 px-2 text-xs font-bold text-primary font-data-mono">
              ${filteredList.length} Active Stays
            </div>
          </div>

          <div class="flex items-end">
            <button id="btn-reset-filters" class="w-full py-2 px-3 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary flex items-center justify-center gap-1.5 cursor-pointer transition-all">
              <span class="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- MAIN GUEST LIST (Operational Guest Cards / Rows) -->
      <!-- ================================================================= -->
      <section>
        ${this.renderGuestList(filteredList)}
      </section>

      <!-- ================================================================= -->
      <!-- GUEST DETAIL DRAWER (Slideout) -->
      <!-- ================================================================= -->
      <div id="drawer-backdrop" class="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 transition-opacity duration-300 ${
        this.activeDetailGuest ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }"></div>
      
      <aside id="guest-detail-drawer" class="fixed top-0 right-0 h-full w-full max-w-xl bg-surface-container-lowest shadow-2xl z-50 border-l border-outline-variant flex flex-col transform transition-transform duration-300 ease-out select-none ${
        this.activeDetailGuest ? 'translate-x-0' : 'translate-x-full'
      }">
        ${this.renderDetailDrawerContent()}
      </aside>

      <!-- ================================================================= -->
      <!-- WORKFLOW MODALS -->
      <!-- ================================================================= -->
      ${this.renderChangeRoomModal()}
      ${this.renderExtendStayModal()}
      ${this.renderAddChargeModal()}
      ${this.renderCheckoutModal()}
      ${this.renderAddRequestModal()}
      ${this.renderPrintRegistrationModal()}
    `;

    this.bindEvents();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MAIN GUEST LIST RENDERING
  // ──────────────────────────────────────────────────────────────────────────
  renderGuestList(list) {
    if (list.length === 0) {
      return `
        <div class="bg-surface-container-lowest rounded-2xl p-16 border border-outline-variant/70 text-center space-y-4 shadow-xs">
          <div class="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <span class="material-symbols-outlined text-[32px]">hotel</span>
          </div>
          <div>
            <h3 class="font-headline-sm text-lg font-bold text-primary">No guests are currently in-house.</h3>
            <p class="text-xs text-on-surface-variant max-w-md mx-auto mt-1">
              Guests will appear here after they complete check-in. You can also view upcoming arrivals or clear active search filters.
            </p>
          </div>
          <div class="flex items-center justify-center gap-3 pt-2">
            <button id="btn-empty-view-arrivals" class="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary/90 transition-all flex items-center gap-1.5 cursor-pointer">
              <span class="material-symbols-outlined text-[17px]">flight_land</span>
              <span>View Arrivals</span>
            </button>
            <button id="btn-empty-clear-filters" class="px-4 py-2.5 rounded-xl border border-outline-variant text-primary text-xs font-bold hover:bg-surface-container transition-all cursor-pointer">
              <span>Clear Filters</span>
            </button>
          </div>
        </div>
      `;
    }

    return `
      <div class="space-y-3">
        ${list.map((g) => this.renderGuestCard(g)).join('')}
      </div>
    `;
  }

  renderGuestCard(g) {
    // Human-readable payment status pill
    let paymentPill = '';
    if (g.balanceDue === 0) {
      paymentPill = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
        <span class="material-symbols-outlined text-[14px]">check</span>
        <span>Paid</span>
      </span>`;
    } else if (g.paymentStatus === 'DEPOSIT_REQUIRED') {
      paymentPill = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
        <span class="material-symbols-outlined text-[14px]">priority_high</span>
        <span>Deposit Required</span>
      </span>`;
    } else {
      paymentPill = `<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
        <span class="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
        <span>₹${g.balanceDue.toLocaleString('en-IN')} Due</span>
      </span>`;
    }

    // Departure urgency indicator
    const isDepartingToday = g.checkOutDate === '12 Sep';
    const isDepartingTomorrow = g.checkOutDate === '13 Sep';

    return `
      <div class="guest-card-row bg-surface-container-lowest p-5 rounded-2xl border transition-all cursor-pointer ${
        g.balanceDue > 0
          ? 'border-rose-200/80 hover:border-rose-400 hover:shadow-xs'
          : 'border-outline-variant/70 hover:border-primary/60 hover:shadow-xs'
      }" data-gid="${g.id}">
        
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <!-- LEFT: Guest Identity, Room & Reservation -->
          <div class="flex items-start gap-4 min-w-0">
            <div class="w-11 h-11 rounded-xl ${
              g.vip
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-primary/10 text-primary border border-primary/20'
            } font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
              ${g.name.split(' ').map((n) => n[0]).join('')}
            </div>

            <div class="min-w-0 space-y-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-base font-bold text-primary truncate">${g.name}</span>
                ${
                  g.vip
                    ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        <span>⭐</span><span>${g.vipTier}</span>
                      </span>`
                    : ''
                }
                <span class="text-xs font-semibold text-on-surface-variant font-data-mono px-2 py-0.5 rounded bg-surface-container border border-outline-variant/60">
                  ${g.reservationNumber}
                </span>
                ${
                  g.isExtended
                    ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                        Extended +${g.extendedDays}n
                      </span>`
                    : ''
                }
              </div>

              <!-- Room & Dates -->
              <div class="flex items-center gap-2.5 text-xs text-on-surface-variant flex-wrap">
                <span class="font-bold text-primary font-data-mono bg-primary/5 px-2 py-0.5 rounded">
                  Room ${g.roomNumber} • ${g.roomType}
                </span>
                <span>•</span>
                <span class="font-medium text-on-surface">Arrived: <strong>${g.checkInDate}</strong></span>
                <span>→</span>
                <span class="font-medium ${isDepartingToday ? 'text-orange-700 font-bold bg-orange-50 px-1.5 py-0.5 rounded' : 'text-on-surface'}">
                  Leaving: <strong>${g.checkOutDate}</strong> ${isDepartingToday ? '(Today)' : isDepartingTomorrow ? '(Tomorrow)' : ''}
                </span>
                <span>•</span>
                <span>${g.adults} Adult${g.adults > 1 ? 's' : ''}${g.children > 0 ? `, ${g.children} Child` : ''}</span>
              </div>

              <!-- Special Request Indicators -->
              ${
                g.specialBadges && g.specialBadges.length > 0
                  ? `
                    <div class="flex items-center gap-1.5 flex-wrap pt-0.5">
                      ${g.specialBadges
                        .map((req) => {
                          const isWarning = req.includes('Due') || req.includes('Towel');
                          return `
                            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                              isWarning
                                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                : 'bg-surface-container text-on-surface-variant border border-outline-variant/60'
                            }">
                              <span class="material-symbols-outlined text-[11px]">${isWarning ? 'priority_high' : 'check'}</span>
                              <span>${req}</span>
                            </span>
                          `;
                        })
                        .join('')}
                    </div>
                  `
                  : ''
              }
            </div>
          </div>

          <!-- RIGHT: Status & Primary Action -->
          <div class="flex flex-wrap items-center justify-between lg:justify-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-outline-variant/40">
            
            <!-- Stay Status -->
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>In-House</span>
              </span>

              <!-- Folio Balance & Payment State -->
              ${paymentPill}
            </div>

            <!-- Primary Action -->
            <button class="btn-view-stay px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95" data-gid="${g.id}">
              <span>View Stay</span>
              <span class="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

        </div>

      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // GUEST DETAIL DRAWER RENDERING
  // ──────────────────────────────────────────────────────────────────────────
  renderDetailDrawerContent() {
    const g = this.activeDetailGuest;
    if (!g) return '';

    return `
      <!-- Drawer Top Header -->
      <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between shrink-0">
        <div>
          <div class="flex items-center gap-2 mb-0.5">
            <span class="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">Active Stay Details</span>
            ${
              g.vip
                ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">⭐ ${g.vipTier}</span>`
                : ''
            }
          </div>
          <h2 class="font-headline-sm text-lg font-bold text-primary">${g.name}</h2>
          <p class="text-xs text-on-surface-variant font-data-mono">Reservation: ${g.reservationNumber} • Folio: ${g.folioNumber}</p>
        </div>
        <button id="btn-close-detail-drawer" class="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer" title="Close Drawer">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      <!-- Drawer Scrollable Body -->
      <div class="p-6 overflow-y-auto flex-1 space-y-5 text-xs custom-scrollbar">

        <!-- 1. GUEST -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-2.5 shadow-xs">
          <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">GUEST</span>
            <span class="text-xs font-semibold text-primary">Previous Stays: <strong>${g.previousStays}</strong></span>
          </div>
          <div class="grid grid-cols-2 gap-3 pt-1">
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Phone</span>
              <span class="font-semibold text-primary">${g.phone}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Email</span>
              <span class="font-semibold text-primary truncate block">${g.email}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Nationality</span>
              <span class="font-semibold text-primary">${g.nationality}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Booking Source</span>
              <span class="font-semibold text-primary">${g.bookingSource}</span>
            </div>
          </div>
        </div>

        <!-- 2. CURRENT STAY -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-2.5 shadow-xs">
          <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">CURRENT STAY</span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              🟢 In-House
            </span>
          </div>
          <div class="grid grid-cols-2 gap-3 pt-1">
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Room</span>
              <span class="font-bold text-primary text-sm">Room ${g.roomNumber}</span>
              <span class="text-[11px] text-on-surface-variant block">${g.roomType}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Dates</span>
              <span class="font-bold text-primary">${g.checkInDate} → ${g.checkOutDate}</span>
              <span class="text-[10px] text-on-surface-variant block">${g.totalNights} Nights total</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Occupancy</span>
              <span class="font-semibold text-primary">${g.adults} Adults${g.children > 0 ? `, ${g.children} Child` : ''}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Reservation Status</span>
              <span class="font-semibold text-primary">Checked-In</span>
            </div>
          </div>
        </div>

        <!-- 3. ROOM -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-3 shadow-xs">
          <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">ROOM</span>
            <span class="text-xs font-semibold text-primary">Floor ${g.floor}</span>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Room Status</span>
              <span class="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                🟢 Occupied
              </span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Housekeeping</span>
              <span class="font-bold text-primary">${g.housekeepingStatus}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 pt-1 border-t border-outline-variant/40">
            <button id="btn-drawer-change-room" class="flex-1 py-2 px-3 rounded-lg border border-outline-variant hover:bg-surface-container hover:border-primary text-xs font-bold text-primary flex items-center justify-center gap-1.5 cursor-pointer transition-all">
              <span class="material-symbols-outlined text-[16px]">swap_horiz</span>
              <span>Change Room</span>
            </button>
            <button id="btn-drawer-view-room" class="flex-1 py-2 px-3 rounded-lg border border-outline-variant hover:bg-surface-container hover:border-primary text-xs font-bold text-primary flex items-center justify-center gap-1.5 cursor-pointer transition-all">
              <span class="material-symbols-outlined text-[16px]">meeting_room</span>
              <span>View Room</span>
            </button>
          </div>
        </div>

        <!-- 4. FOLIO SUMMARY -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-3 shadow-xs">
          <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">FOLIO SUMMARY</span>
            <span class="font-data-mono text-[10px] text-on-surface-variant font-semibold">${g.folioNumber}</span>
          </div>
          
          <div class="space-y-1.5 text-xs">
            <div class="flex justify-between text-on-surface-variant">
              <span>Room Charges</span>
              <span class="font-data-mono font-medium text-on-surface">₹${g.roomCharges.toLocaleString('en-IN')}</span>
            </div>
            <div class="flex justify-between text-on-surface-variant">
              <span>F&B</span>
              <span class="font-data-mono font-medium text-on-surface">₹${g.fbCharges.toLocaleString('en-IN')}</span>
            </div>
            <div class="flex justify-between text-on-surface-variant">
              <span>Laundry</span>
              <span class="font-data-mono font-medium text-on-surface">₹${g.laundryCharges.toLocaleString('en-IN')}</span>
            </div>
            <div class="flex justify-between text-on-surface-variant">
              <span>Taxes (GST)</span>
              <span class="font-data-mono font-medium text-on-surface">₹${g.taxes.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div class="pt-2 border-t border-outline-variant/60 space-y-1.5">
            <div class="flex justify-between font-bold text-primary text-sm">
              <span>Total Charges</span>
              <span class="font-data-mono">₹${g.totalCharges.toLocaleString('en-IN')}</span>
            </div>
            <div class="flex justify-between text-xs text-emerald-800 font-semibold">
              <span>Paid Amount</span>
              <span class="font-data-mono">₹${g.paidAmount.toLocaleString('en-IN')}</span>
            </div>
            <div class="flex justify-between font-bold ${g.balanceDue > 0 ? 'text-rose-800' : 'text-primary'} text-sm pt-1 border-t border-outline-variant/40">
              <span>Folio Balance</span>
              <span class="font-data-mono">₹${g.balanceDue.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div class="pt-1">
            <button id="btn-drawer-view-full-folio" class="w-full py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container hover:border-primary text-xs font-bold text-primary flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-2xs">
              <span class="material-symbols-outlined text-[16px]">receipt_long</span>
              <span>View Full Folio</span>
            </button>
          </div>
        </div>

        <!-- 5. SPECIAL REQUESTS -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-2.5 shadow-xs">
          <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">SPECIAL REQUESTS</span>
            <button id="btn-drawer-add-request" class="text-xs text-primary font-bold hover:underline flex items-center gap-0.5 cursor-pointer">
              <span class="material-symbols-outlined text-[14px]">add</span>
              <span>Add Request</span>
            </button>
          </div>
          
          <div class="space-y-2">
            ${g.specialRequestsList
              .map((r) => {
                const isWarn = r.status === 'pending' || r.label.includes('Towel');
                return `
                  <div class="p-2.5 rounded-lg border ${
                    isWarn ? 'bg-amber-50/70 border-amber-200 text-amber-900' : 'bg-surface-container/60 border-outline-variant/50 text-on-surface'
                  }">
                    <div class="flex items-center gap-1.5 font-bold text-xs">
                      <span class="material-symbols-outlined text-[15px] ${isWarn ? 'text-amber-700' : 'text-emerald-700'}">${
                  isWarn ? 'warning' : 'check_circle'
                }</span>
                      <span>${r.label}</span>
                      <span class="ml-auto text-[10px] font-normal uppercase tracking-wider font-data-mono ${
                        isWarn ? 'text-amber-800' : 'text-emerald-800'
                      }">${r.status}</span>
                    </div>
                    ${r.note ? `<p class="text-[11px] text-on-surface-variant mt-1 pl-5">${r.note}</p>` : ''}
                  </div>
                `;
              })
              .join('')}
          </div>
        </div>

        <!-- 6. RECENT ACTIVITY (Clean Vertical Timeline) -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-3 shadow-xs">
          <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono block pb-1 border-b border-outline-variant/40">
            RECENT ACTIVITY
          </span>
          <div class="space-y-3 pl-2 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/60">
            ${g.activities
              .map(
                (act) => `
              <div class="relative flex items-start gap-3 pl-4">
                <span class="absolute left-0 top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-surface-container-lowest"></span>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center justify-between text-[11px] text-on-surface-variant font-data-mono">
                    <span class="font-bold text-primary">${act.date}</span>
                    <span>${act.time}</span>
                  </div>
                  <p class="text-xs text-on-surface mt-0.5">${act.text}</p>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <!-- 7. GUEST HISTORY -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-2 shadow-xs">
          <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono block pb-1 border-b border-outline-variant/40">
            GUEST HISTORY
          </span>
          <div class="grid grid-cols-3 gap-2 pt-1 text-xs">
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Previous Stays</span>
              <span class="font-bold text-primary">${g.previousStays}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Last Stay</span>
              <span class="font-bold text-primary">${g.lastStay}</span>
            </div>
            <div>
              <span class="text-[10px] text-on-surface-variant block font-data-mono">Preferred Room</span>
              <span class="font-bold text-primary truncate block">${g.preferredRoom}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Drawer Bottom Actions -->
      <div class="p-5 border-t border-outline-variant/70 bg-surface-bright space-y-2 shrink-0">
        
        <!-- Primary Action: Start Check-Out -->
        <button id="btn-drawer-start-checkout" class="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98">
          <span class="material-symbols-outlined text-[19px]">flight_takeoff</span>
          <span>Start Check-Out</span>
        </button>

        <!-- Secondary Operational Actions Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <button id="btn-drawer-extend-stay" class="py-2 px-2 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary flex items-center justify-center gap-1 cursor-pointer transition-all">
            <span class="material-symbols-outlined text-[15px]">more_time</span>
            <span>Extend Stay</span>
          </button>
          <button id="btn-drawer-add-charge" class="py-2 px-2 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary flex items-center justify-center gap-1 cursor-pointer transition-all">
            <span class="material-symbols-outlined text-[15px]">add_card</span>
            <span>Add Charge</span>
          </button>
          <button id="btn-drawer-add-guest" class="py-2 px-2 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary flex items-center justify-center gap-1 cursor-pointer transition-all">
            <span class="material-symbols-outlined text-[15px]">person_add</span>
            <span>Add Guest</span>
          </button>
          <button id="btn-drawer-print-reg" class="py-2 px-2 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary flex items-center justify-center gap-1 cursor-pointer transition-all">
            <span class="material-symbols-outlined text-[15px]">print</span>
            <span>Print Reg</span>
          </button>
        </div>

      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // WORKFLOW 1: CHANGE ROOM WORKFLOW MODAL
  // ──────────────────────────────────────────────────────────────────────────
  renderChangeRoomModal() {
    if (!this.activeChangeRoomGuest) return '';
    const g = this.activeChangeRoomGuest;

    return `
      <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">Room Allocation Transfer</span>
              <h2 class="font-headline-sm text-lg font-bold text-primary">Change Room — ${g.name}</h2>
              <p class="text-xs text-on-surface-variant font-data-mono">Current: Room ${g.roomNumber} (${g.roomType})</p>
            </div>
            <button id="btn-close-change-room" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-xs">
            
            <!-- Current Room Status Card -->
            <div class="p-3.5 bg-surface-container rounded-xl border border-outline-variant/60 flex items-center justify-between">
              <div>
                <span class="text-[10px] uppercase font-bold text-on-surface-variant font-data-mono block">Current Room</span>
                <span class="font-bold text-sm text-primary">Room ${g.roomNumber} • ${g.roomType}</span>
                <span class="text-[11px] text-on-surface-variant block">Nightly Rate: ₹${g.nightlyRate.toLocaleString('en-IN')}</span>
              </div>
              <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                🟢 Currently Occupied
              </span>
            </div>

            <!-- Available Rooms Selector -->
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2 font-data-mono">
                Select Available New Room
              </label>
              <div class="space-y-2">
                ${this.availableRooms
                  .map((r, i) => {
                    const priceDiff = r.nightlyRate - g.nightlyRate;
                    const diffText =
                      priceDiff === 0
                        ? 'Same nightly rate'
                        : priceDiff > 0
                        ? `+₹${priceDiff.toLocaleString('en-IN')}/night (Upgrade)`
                        : `-₹${Math.abs(priceDiff).toLocaleString('en-IN')}/night (Downgrade)`;

                    return `
                      <label class="room-option-card flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                        !r.isAvailable
                          ? 'opacity-50 cursor-not-allowed bg-surface-container-high/40 border-outline-variant/40'
                          : i === 0
                          ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                          : 'border-outline-variant/70 hover:border-primary/50'
                      }">
                        <div class="flex items-center gap-3">
                          <input type="radio" name="sel-new-room" value="${r.roomNumber}" ${i === 0 ? 'checked' : ''} ${
                      !r.isAvailable ? 'disabled' : ''
                    } class="accent-primary" />
                          <div>
                            <div class="flex items-center gap-2">
                              <span class="font-bold text-primary text-sm font-data-mono">Room ${r.roomNumber}</span>
                              <span class="text-xs font-semibold text-on-surface">Floor ${r.floor} • ${r.roomType}</span>
                              ${
                                !r.isAvailable
                                  ? `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">Unavailable</span>`
                                  : `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">${r.status}</span>`
                              }
                            </div>
                            <span class="text-[11px] text-on-surface-variant block mt-0.5">${r.notes}</span>
                          </div>
                        </div>

                        <div class="text-right">
                          <span class="font-bold text-xs text-primary font-data-mono block">₹${r.nightlyRate.toLocaleString('en-IN')}/n</span>
                          <span class="text-[10px] font-bold ${priceDiff > 0 ? 'text-amber-800' : 'text-on-surface-variant'}">${diffText}</span>
                        </div>
                      </label>
                    `;
                  })
                  .join('')}
              </div>
            </div>

            <!-- Transfer Reason -->
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">
                Reason for Room Transfer
              </label>
              <select id="sel-transfer-reason" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none">
                <option value="Guest preference (view/quiet)">Guest preference (view / quiet area)</option>
                <option value="Complimentary hotel upgrade">Complimentary hotel upgrade</option>
                <option value="Room maintenance issue / defect">Room maintenance issue / defect</option>
                <option value="Noise disturbance">Noise disturbance</option>
                <option value="Extended stay relocation">Extended stay relocation</option>
              </select>
            </div>

            <!-- Warning Notice -->
            <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
              <span class="material-symbols-outlined text-[16px] text-amber-700 shrink-0">info</span>
              <div>
                <span class="font-bold block">Room Transition Protocol</span>
                Previous Room ${g.roomNumber} will immediately become <strong>Vacant Dirty</strong> for Housekeeping inspection, and active keycards will be reassigned.
              </div>
            </div>

          </div>

          <div class="px-6 py-4 border-t border-outline-variant/70 bg-surface-bright flex items-center justify-end gap-3">
            <button id="btn-cancel-change-room" class="px-4 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all cursor-pointer">
              Cancel
            </button>
            <button id="btn-confirm-change-room" class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
              <span class="material-symbols-outlined text-[16px]">check</span>
              <span>Confirm Room Change</span>
            </button>
          </div>

        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // WORKFLOW 2: EXTEND STAY WORKFLOW MODAL
  // ──────────────────────────────────────────────────────────────────────────
  renderExtendStayModal() {
    if (!this.activeExtendStayGuest) return '';
    const g = this.activeExtendStayGuest;

    const extraNights = 2;
    const additionalRoomCharges = extraNights * g.nightlyRate;
    const additionalTaxes = Math.round(additionalRoomCharges * 0.18);
    const newEstimatedTotal = g.totalCharges + additionalRoomCharges + additionalTaxes;
    const differenceTotal = additionalRoomCharges + additionalTaxes;

    return `
      <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-lg overflow-hidden flex flex-col">
          
          <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">Stay Modification</span>
              <h2 class="font-headline-sm text-lg font-bold text-primary">Extend Stay — Room ${g.roomNumber}</h2>
              <p class="text-xs text-on-surface-variant">${g.name} • ${g.roomType}</p>
            </div>
            <button id="btn-close-extend-stay" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-4 text-xs">
            
            <!-- Dates Selection Grid -->
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-surface-container rounded-xl border border-outline-variant/50">
                <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono block">Current Departure</span>
                <span class="text-sm font-bold text-primary">${g.checkOutDate}</span>
                <span class="text-[10px] text-on-surface-variant block mt-0.5">12:00 PM standard</span>
              </div>
              <div class="p-3 bg-primary/5 rounded-xl border border-primary/30">
                <span class="text-[10px] font-bold uppercase tracking-wider text-primary font-data-mono block">New Departure</span>
                <select id="sel-extend-days" class="w-full mt-0.5 py-1 px-2 rounded-lg border border-primary/40 bg-surface-container-lowest text-xs font-bold text-primary outline-none">
                  <option value="1">16 Sep (+1 Night)</option>
                  <option value="2" selected>17 Sep (+2 Nights)</option>
                  <option value="3">18 Sep (+3 Nights)</option>
                  <option value="5">20 Sep (+5 Nights)</option>
                </select>
              </div>
            </div>

            <!-- Room Availability Check -->
            <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
                <div>
                  <span class="font-bold text-xs block">Room Available</span>
                  <span class="text-[10px] text-emerald-800">Room ${g.roomNumber} has no conflicting reservations.</span>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-900">Verified</span>
            </div>

            <!-- Financial Calculation Breakdown -->
            <div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 space-y-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono block pb-1 border-b border-outline-variant/40">
                Financial Impact Breakdown
              </span>
              <div class="flex justify-between text-on-surface-variant">
                <span>Additional Room Charges (2 Nights × ₹${g.nightlyRate.toLocaleString('en-IN')})</span>
                <span class="font-data-mono font-medium text-on-surface">₹${additionalRoomCharges.toLocaleString('en-IN')}</span>
              </div>
              <div class="flex justify-between text-on-surface-variant">
                <span>Estimated Taxes (18% GST)</span>
                <span class="font-data-mono font-medium text-on-surface">₹${additionalTaxes.toLocaleString('en-IN')}</span>
              </div>
              <div class="flex justify-between text-xs font-bold text-primary pt-1 border-t border-outline-variant/40">
                <span>Difference from Current Booking</span>
                <span class="font-data-mono">+₹${differenceTotal.toLocaleString('en-IN')}</span>
              </div>
              <div class="flex justify-between text-sm font-bold text-primary pt-1 border-t border-outline-variant/60">
                <span>New Estimated Total</span>
                <span class="font-data-mono">₹${newEstimatedTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

          </div>

          <div class="px-6 py-4 border-t border-outline-variant/70 bg-surface-bright flex items-center justify-end gap-3">
            <button id="btn-cancel-extend-stay" class="px-4 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all cursor-pointer">
              Cancel
            </button>
            <button id="btn-confirm-extend-stay" class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
              <span class="material-symbols-outlined text-[16px]">more_time</span>
              <span>Confirm Stay Extension</span>
            </button>
          </div>

        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // WORKFLOW 3: ADD CHARGE WORKFLOW MODAL
  // ──────────────────────────────────────────────────────────────────────────
  renderAddChargeModal() {
    if (!this.activeAddChargeGuest) return '';
    const g = this.activeAddChargeGuest;

    return `
      <div class="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          
          <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">Front Desk Folio Posting</span>
              <h2 class="font-headline-sm text-lg font-bold text-primary">Post Charge to Folio</h2>
              <p class="text-xs text-on-surface-variant font-data-mono">${g.name} • Room ${g.roomNumber} (${g.folioNumber})</p>
            </div>
            <button id="btn-close-add-charge" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-4 text-xs">
            
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">
                Charge Category
              </label>
              <select id="sel-charge-type" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none">
                <option value="Food & Beverage">Food & Beverage (Room Service / Dining)</option>
                <option value="Minibar">Minibar Consumption</option>
                <option value="Spa & Wellness">Spa & Wellness Services</option>
                <option value="Laundry">Laundry & Dry Cleaning</option>
                <option value="Airport Transfer">Airport Transfer / Car Hire</option>
                <option value="Miscellaneous">Miscellaneous / Incidentals</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">
                  Amount (₹) *
                </label>
                <input type="number" id="input-charge-amount" placeholder="e.g. 2500" value="2500" class="w-full py-2 px-3 rounded-lg border border-outline-variant text-xs text-on-surface font-data-mono outline-none" />
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">
                  Tax / GST
                </label>
                <select id="sel-charge-tax" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none">
                  <option value="18">18% GST (Standard)</option>
                  <option value="5">5% GST (F&B / Non-AC)</option>
                  <option value="0">0% (Exempt / Included)</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">
                Description *
              </label>
              <input type="text" id="input-charge-desc" placeholder="e.g. Late Night Room Service order #4021" value="Room Service Dinner Order #4021" class="w-full py-2 px-3 rounded-lg border border-outline-variant text-xs text-on-surface outline-none" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">
                  Date
                </label>
                <input type="text" readonly value="Today, 12 Sep 2026" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container text-xs text-on-surface font-data-mono" />
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">
                  Voucher / Ref #
                </label>
                <input type="text" id="input-charge-ref" placeholder="e.g. VCH-892" value="VCH-981" class="w-full py-2 px-3 rounded-lg border border-outline-variant text-xs text-on-surface font-data-mono outline-none" />
              </div>
            </div>

            <!-- Clear Folio Impact Warning -->
            <div class="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
              <span class="material-symbols-outlined text-[16px] text-amber-700 shrink-0">info</span>
              <div>
                <span class="font-bold block">Folio Impact</span>
                This charge will immediately increase the guest's folio balance by the posted amount plus taxes.
              </div>
            </div>

          </div>

          <div class="px-6 py-4 border-t border-outline-variant/70 bg-surface-bright flex items-center justify-end gap-3">
            <button id="btn-cancel-add-charge" class="px-4 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all cursor-pointer">
              Cancel
            </button>
            <button id="btn-confirm-add-charge" class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
              <span class="material-symbols-outlined text-[16px]">receipt</span>
              <span>Post to Folio</span>
            </button>
          </div>

        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // WORKFLOW 4: CHECKOUT CONNECTION WIZARD MODAL
  // Flow: In-House Guest → Start Check-Out → Bill Review → Payment / Settlement → Confirm Checkout → Guest removed from In-House → Room becomes Dirty → Housekeeping task assigned
  // ──────────────────────────────────────────────────────────────────────────
  renderCheckoutModal() {
    if (!this.activeCheckOutGuest) return '';
    const g = this.activeCheckOutGuest;
    const step = this.checkOutStep;

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <!-- Modal Header with Step Indicator -->
          <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2 mb-0.5">
                <span class="text-xs font-bold uppercase tracking-wider text-primary font-data-mono">Front Desk Check-Out Workflow</span>
                <span class="text-xs text-on-surface-variant font-data-mono">• Step ${step} of 4</span>
              </div>
              <h2 class="font-headline-sm text-lg font-bold text-primary">${g.name} — Room ${g.roomNumber}</h2>
            </div>
            <button id="btn-close-checkout-wizard" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <!-- Wizard Progress Bar -->
          <div class="grid grid-cols-4 border-b border-outline-variant/50 text-[10px] font-bold text-center font-data-mono">
            <div class="py-2 ${step >= 1 ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}">1. Bill Review</div>
            <div class="py-2 ${step >= 2 ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}">2. Settlement</div>
            <div class="py-2 ${step >= 3 ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}">3. Keys & Room</div>
            <div class="py-2 ${step >= 4 ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}">4. Confirm</div>
          </div>

          <!-- Wizard Body Content Depending on Step -->
          <div class="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-xs">
            
            ${
              step === 1
                ? `
              <!-- STEP 1: BILL REVIEW -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">Itemized Folio Review</span>
                  <span class="font-data-mono text-xs text-primary font-bold">Folio: ${g.folioNumber}</span>
                </div>

                <div class="p-4 bg-surface-container-low rounded-xl border border-outline-variant/60 space-y-2">
                  <div class="flex justify-between text-on-surface-variant">
                    <span>Room Accommodation (${g.totalNights} Nights)</span>
                    <span class="font-data-mono font-medium text-on-surface">₹${g.roomCharges.toLocaleString('en-IN')}</span>
                  </div>
                  <div class="flex justify-between text-on-surface-variant">
                    <span>Food & Beverage Services</span>
                    <span class="font-data-mono font-medium text-on-surface">₹${g.fbCharges.toLocaleString('en-IN')}</span>
                  </div>
                  <div class="flex justify-between text-on-surface-variant">
                    <span>Laundry & Dry Cleaning</span>
                    <span class="font-data-mono font-medium text-on-surface">₹${g.laundryCharges.toLocaleString('en-IN')}</span>
                  </div>
                  <div class="flex justify-between text-on-surface-variant">
                    <span>Taxes & Government Levies</span>
                    <span class="font-data-mono font-medium text-on-surface">₹${g.taxes.toLocaleString('en-IN')}</span>
                  </div>
                  
                  <div class="pt-2 border-t border-outline-variant/60 flex justify-between font-bold text-sm text-primary">
                    <span>Total Bill</span>
                    <span class="font-data-mono">₹${g.totalCharges.toLocaleString('en-IN')}</span>
                  </div>
                  <div class="flex justify-between text-xs text-emerald-800 font-semibold">
                    <span>Payments Already Received</span>
                    <span class="font-data-mono">₹${g.paidAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div class="flex justify-between text-base font-black ${g.balanceDue > 0 ? 'text-rose-800' : 'text-emerald-800'} pt-2 border-t border-outline-variant/60">
                    <span>Outstanding Due</span>
                    <span class="font-data-mono">₹${g.balanceDue.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                ${
                  g.balanceDue > 0
                    ? `
                  <div class="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
                    <span class="material-symbols-outlined text-rose-600 text-[18px]">warning</span>
                    <span>An outstanding balance of <strong>₹${g.balanceDue.toLocaleString('en-IN')}</strong> must be settled before checkout can be confirmed.</span>
                  </div>
                `
                    : `
                  <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                    <span class="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                    <span>All charges are fully settled. Folio is balanced at ₹0.00.</span>
                  </div>
                `
                }
              </div>
            `
                : step === 2
                ? `
              <!-- STEP 2: PAYMENT & SETTLEMENT -->
              <div class="space-y-4">
                <div>
                  <span class="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-data-mono block mb-1">Select Settlement Method</span>
                  <div class="grid grid-cols-2 gap-2.5">
                    <label class="p-3 rounded-xl border border-primary bg-primary/5 flex items-center gap-2.5 cursor-pointer">
                      <input type="radio" name="settle-method" value="CARD" checked class="accent-primary" />
                      <div>
                        <span class="font-bold text-primary block">Credit / Debit Card</span>
                        <span class="text-[10px] text-on-surface-variant">Visa ending in •••• 4012</span>
                      </div>
                    </label>
                    <label class="p-3 rounded-xl border border-outline-variant hover:border-primary/50 flex items-center gap-2.5 cursor-pointer">
                      <input type="radio" name="settle-method" value="UPI" class="accent-primary" />
                      <div>
                        <span class="font-bold text-primary block">UPI / QR Code</span>
                        <span class="text-[10px] text-on-surface-variant">Instant payment verification</span>
                      </div>
                    </label>
                    <label class="p-3 rounded-xl border border-outline-variant hover:border-primary/50 flex items-center gap-2.5 cursor-pointer">
                      <input type="radio" name="settle-method" value="CASH" class="accent-primary" />
                      <div>
                        <span class="font-bold text-primary block">Cash Settlement</span>
                        <span class="text-[10px] text-on-surface-variant">Front desk cash drawer</span>
                      </div>
                    </label>
                    <label class="p-3 rounded-xl border border-outline-variant hover:border-primary/50 flex items-center gap-2.5 cursor-pointer">
                      <input type="radio" name="settle-method" value="CORP" class="accent-primary" />
                      <div>
                        <span class="font-bold text-primary block">Corporate Direct Bill</span>
                        <span class="text-[10px] text-on-surface-variant">Approved client master account</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div class="p-4 bg-surface-container rounded-xl border border-outline-variant/60 space-y-2">
                  <div class="flex justify-between text-xs">
                    <span class="text-on-surface-variant">Settlement Amount:</span>
                    <span class="font-black text-primary font-data-mono text-sm">₹${g.balanceDue.toLocaleString('en-IN')}</span>
                  </div>
                  <div class="flex items-center gap-2 pt-1">
                    <input type="checkbox" id="chk-email-receipt" checked class="accent-primary rounded" />
                    <label for="chk-email-receipt" class="text-xs text-on-surface">Email itemized PDF invoice to <strong>${g.email}</strong></label>
                  </div>
                </div>
              </div>
            `
                : step === 3
                ? `
              <!-- STEP 3: KEYS & ROOM INSPECTION -->
              <div class="space-y-4">
                <div class="p-4 bg-surface-container-low rounded-xl border border-outline-variant/60 space-y-3">
                  <span class="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-data-mono block">Front Desk Turnover Checklist</span>
                  
                  <label class="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" id="chk-keys-returned" checked class="accent-primary rounded mt-0.5" />
                    <div>
                      <span class="font-bold text-primary block">Keycards Returned & Deactivated</span>
                      <span class="text-[10px] text-on-surface-variant">2 physical RFID keycards received from guest</span>
                    </div>
                  </label>

                  <label class="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" id="chk-minibar-verified" checked class="accent-primary rounded mt-0.5" />
                    <div>
                      <span class="font-bold text-primary block">Minibar & Safe Clear</span>
                      <span class="text-[10px] text-on-surface-variant">In-room safe verified empty and open</span>
                    </div>
                  </label>

                  <label class="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" id="chk-luggage-handled" checked class="accent-primary rounded mt-0.5" />
                    <div>
                      <span class="font-bold text-primary block">Luggage Assistance Handled</span>
                      <span class="text-[10px] text-on-surface-variant">Bell desk coordinated for guest luggage</span>
                    </div>
                  </label>
                </div>

                <!-- Housekeeping Immediate Handover Notice -->
                <div class="p-3.5 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 flex items-start gap-2.5">
                  <span class="material-symbols-outlined text-purple-700 text-[18px] shrink-0">cleaning_services</span>
                  <div>
                    <span class="font-bold block text-xs">Housekeeping Automatic Notification</span>
                    Upon checkout, <strong>Room ${g.roomNumber}</strong> operational status will automatically transition to <strong>🔴 Dirty (Vacant Dirty)</strong> and dispatch a turnover cleaning task to Housekeeping.
                  </div>
                </div>
              </div>
            `
                : `
              <!-- STEP 4: CONFIRM CHECKOUT -->
              <div class="space-y-4 text-center py-2">
                <div class="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <span class="material-symbols-outlined text-[32px]">task_alt</span>
                </div>
                
                <div>
                  <h3 class="font-headline-sm text-base font-bold text-primary">Ready to Complete Checkout</h3>
                  <p class="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
                    ${g.name} will be marked as Checked-Out and removed from the active in-house guest list.
                  </p>
                </div>

                <div class="p-4 bg-surface-container rounded-xl border border-outline-variant/60 text-left space-y-1.5 text-xs max-w-md mx-auto">
                  <div class="flex justify-between">
                    <span class="text-on-surface-variant">Guest:</span>
                    <span class="font-bold text-primary">${g.name}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-on-surface-variant">Room Released:</span>
                    <span class="font-bold text-primary">Room ${g.roomNumber} (${g.roomType})</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-on-surface-variant">Final Folio Balance:</span>
                    <span class="font-bold text-emerald-800 font-data-mono">₹0.00 Settled</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-on-surface-variant">Housekeeping Status:</span>
                    <span class="font-bold text-rose-700">🔴 Transitions to Dirty</span>
                  </div>
                </div>
              </div>
            `
            }

          </div>

          <!-- Wizard Step Footer -->
          <div class="px-6 py-4 border-t border-outline-variant/70 bg-surface-bright flex items-center justify-between">
            <button id="btn-checkout-prev" class="px-4 py-2 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all cursor-pointer ${
              step === 1 ? 'opacity-40 pointer-events-none' : ''
            }">
              ← Back
            </button>

            <div class="flex items-center gap-2">
              <button id="btn-cancel-checkout" class="px-3.5 py-2 rounded-xl hover:bg-surface-container text-xs font-semibold text-on-surface-variant transition-all cursor-pointer">
                Cancel
              </button>

              ${
                step < 4
                  ? `
                <button id="btn-checkout-next" class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
                  <span>${step === 1 ? 'Proceed to Settlement' : step === 2 ? 'Proceed to Keys' : 'Proceed to Confirmation'}</span>
                  <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              `
                  : `
                <button id="btn-confirm-final-checkout" class="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
                  <span class="material-symbols-outlined text-[17px]">check</span>
                  <span>Confirm Checkout & Release Room</span>
                </button>
              `
              }
            </div>
          </div>

        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // WORKFLOW 5: ADD SPECIAL REQUEST MODAL
  // ──────────────────────────────────────────────────────────────────────────
  renderAddRequestModal() {
    if (!this.activeAddRequestGuest) return '';
    const g = this.activeAddRequestGuest;

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">Special Service Request</span>
              <h2 class="font-headline-sm text-base font-bold text-primary">Add Request — Room ${g.roomNumber}</h2>
              <p class="text-xs text-on-surface-variant">${g.name}</p>
            </div>
            <button id="btn-close-add-request" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <div class="p-6 space-y-3.5 text-xs">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Category</label>
              <select id="sel-req-category" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none">
                <option value="Housekeeping">Housekeeping (Extra linen, towels, cleaning)</option>
                <option value="Concierge">Concierge (Taxi, tickets, reservations)</option>
                <option value="F&B">Food & Beverage (Special dietary, amenities)</option>
                <option value="Maintenance">Engineering / Maintenance</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Request Title</label>
              <input type="text" id="input-req-title" placeholder="e.g. Baby crib setup" value="Extra Feather Pillows" class="w-full py-2 px-3 rounded-lg border border-outline-variant text-xs text-on-surface outline-none" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Instructions / Notes</label>
              <textarea id="input-req-notes" rows="3" placeholder="Specific guest instructions..." class="w-full py-2 px-3 rounded-lg border border-outline-variant text-xs text-on-surface outline-none">Deliver 2 extra hypoallergenic pillows before 8:00 PM.</textarea>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-outline-variant/70 bg-surface-bright flex items-center justify-end gap-2">
            <button id="btn-cancel-add-request" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-confirm-add-request" class="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm cursor-pointer">Save Request</button>
          </div>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // WORKFLOW 6: PRINT REGISTRATION CARD MODAL
  // ──────────────────────────────────────────────────────────────────────────
  renderPrintRegistrationModal() {
    if (!this.activePrintGuest) return '';
    const g = this.activePrintGuest;

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
          <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-[20px]">print</span>
              <h2 class="font-headline-sm text-base font-bold text-primary">Guest Registration Card</h2>
            </div>
            <button id="btn-close-print-reg" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 overflow-y-auto custom-scrollbar space-y-4 text-xs font-body-sm bg-white" id="printable-reg-card">
            <!-- Hotel Branding Header -->
            <div class="flex items-center justify-between border-b pb-3">
              <div>
                <h3 class="font-headline-sm text-base font-bold text-primary">The Grand Meridian</h3>
                <p class="text-[10px] text-on-surface-variant font-data-mono">VOLVITECH HOSPITALITY OS • OFFICIAL REGISTRATION</p>
              </div>
              <div class="text-right font-data-mono text-xs">
                <span class="font-bold text-primary">${g.reservationNumber}</span>
                <span class="block text-[10px] text-on-surface-variant">Folio: ${g.folioNumber}</span>
              </div>
            </div>

            <!-- Guest & Stay Metadata -->
            <div class="grid grid-cols-2 gap-3 pt-1">
              <div><span class="text-[10px] text-on-surface-variant block font-data-mono">Guest Full Name</span><strong class="text-sm">${g.name}</strong></div>
              <div><span class="text-[10px] text-on-surface-variant block font-data-mono">Assigned Room</span><strong class="text-sm">Room ${g.roomNumber} (${g.roomType})</strong></div>
              <div><span class="text-[10px] text-on-surface-variant block font-data-mono">Check-In Date</span><span>${g.checkInDate} 2026</span></div>
              <div><span class="text-[10px] text-on-surface-variant block font-data-mono">Check-Out Date</span><span>${g.checkOutDate} 2026 (12:00 PM)</span></div>
              <div><span class="text-[10px] text-on-surface-variant block font-data-mono">Phone / Contact</span><span>${g.phone}</span></div>
              <div><span class="text-[10px] text-on-surface-variant block font-data-mono">Email Address</span><span class="truncate block">${g.email}</span></div>
            </div>

            <div class="p-3 bg-surface-container-low rounded-lg border border-outline-variant/60 text-[11px] text-on-surface-variant leading-relaxed">
              <strong>Hotel Notice & Agreement:</strong> The hotel checkout time is 12:00 PM noon. Non-smoking policy strictly applies inside all guest suites. Personal valuables should be secured in the electronic safe.
            </div>

            <!-- Signature Line -->
            <div class="pt-6 border-t border-outline-variant/60 grid grid-cols-2 gap-4">
              <div>
                <div class="h-10 border-b border-dashed border-outline-variant"></div>
                <span class="text-[10px] text-on-surface-variant font-data-mono block mt-1">Guest Signature</span>
              </div>
              <div>
                <div class="h-10 border-b border-dashed border-outline-variant"></div>
                <span class="text-[10px] text-on-surface-variant font-data-mono block mt-1">Front Desk Duty Agent</span>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-outline-variant/70 bg-surface-bright flex items-center justify-end gap-2">
            <button id="btn-cancel-print-reg" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Close</button>
            <button id="btn-do-print-reg" class="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer">
              <span class="material-symbols-outlined text-[16px]">print</span>
              <span>Print Registration Card</span>
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

    // Header buttons
    const btnNewRes = this.container.querySelector('#btn-hdr-new-reservation');
    if (btnNewRes) {
      btnNewRes.onclick = () => {
        const modal = new NewBookingModal({
          onCreated: () => {
            store.notify();
            Toast.show({ title: 'Reservation Created', message: 'New guest booking successfully added to system.', type: 'success' });
          },
        });
        modal.init().then(() => {
          document.body.appendChild(modal.render());
        });
      };
    }

    const btnRoomBoard = this.container.querySelector('#btn-hdr-room-board');
    if (btnRoomBoard) {
      btnRoomBoard.onclick = () => {
        store.setNavTab('inventory');
      };
    }

    // Summary Card Clickable Filters
    this.container.querySelectorAll('.card-summary-metric').forEach((card) => {
      card.onclick = () => {
        const filter = card.dataset.filter;
        this.activeQuickFilter = filter;
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

    // Fast Search Input
    const searchInput = this.container.querySelector('#input-inh-search');
    if (searchInput) {
      searchInput.oninput = (e) => {
        this.searchQuery = e.target.value;
        this.renderContent();
        const input = this.container.querySelector('#input-inh-search');
        if (input) {
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        }
      };
    }

    const btnClearSearch = this.container.querySelector('#btn-clear-inh-search');
    if (btnClearSearch) {
      btnClearSearch.onclick = () => {
        this.searchQuery = '';
        this.renderContent();
      };
    }

    // Dropdown Filters
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

    // Reset Filters
    const btnReset = this.container.querySelector('#btn-reset-filters');
    if (btnReset) {
      btnReset.onclick = () => {
        this.searchQuery = '';
        this.activeQuickFilter = 'ALL';
        this.filters = { roomType: 'ALL', arrivalDate: 'ALL', departureDate: 'ALL', paymentStatus: 'ALL', bookingSource: 'ALL' };
        this.renderContent();
      };
    }

    // Empty state buttons
    const btnEmptyArrivals = this.container.querySelector('#btn-empty-view-arrivals');
    if (btnEmptyArrivals) {
      btnEmptyArrivals.onclick = () => {
        store.setNavTab('arrivals');
      };
    }
    const btnEmptyClear = this.container.querySelector('#btn-empty-clear-filters');
    if (btnEmptyClear) {
      btnEmptyClear.onclick = () => {
        this.searchQuery = '';
        this.activeQuickFilter = 'ALL';
        this.renderContent();
      };
    }

    // Guest card clicks & View Stay button clicks
    this.container.querySelectorAll('.guest-card-row').forEach((row) => {
      row.onclick = () => {
        const gid = row.dataset.gid;
        this.openDetailDrawer(gid);
      };
    });

    this.container.querySelectorAll('.btn-view-stay').forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        this.openDetailDrawer(btn.dataset.gid);
      };
    });

    // Close Detail Drawer
    const btnCloseDrawer = this.container.querySelector('#btn-close-detail-drawer');
    if (btnCloseDrawer) btnCloseDrawer.onclick = () => this.closeDetailDrawer();
    const backdrop = this.container.querySelector('#drawer-backdrop');
    if (backdrop) backdrop.onclick = () => this.closeDetailDrawer();

    // Drawer internal actions
    const btnDrawerChangeRoom = this.container.querySelector('#btn-drawer-change-room');
    if (btnDrawerChangeRoom) {
      btnDrawerChangeRoom.onclick = () => {
        this.activeChangeRoomGuest = this.activeDetailGuest;
        this.renderContent();
      };
    }

    const btnDrawerViewRoom = this.container.querySelector('#btn-drawer-view-room');
    if (btnDrawerViewRoom) {
      btnDrawerViewRoom.onclick = () => {
        store.setNavTab('inventory');
      };
    }

    const btnDrawerViewFolio = this.container.querySelector('#btn-drawer-view-full-folio');
    if (btnDrawerViewFolio) {
      btnDrawerViewFolio.onclick = () => {
        store.setNavTab('billing');
      };
    }

    const btnDrawerAddReq = this.container.querySelector('#btn-drawer-add-request');
    if (btnDrawerAddReq) {
      btnDrawerAddReq.onclick = () => {
        this.activeAddRequestGuest = this.activeDetailGuest;
        this.renderContent();
      };
    }

    const btnDrawerCheckout = this.container.querySelector('#btn-drawer-start-checkout');
    if (btnDrawerCheckout) {
      btnDrawerCheckout.onclick = () => {
        this.activeCheckOutGuest = this.activeDetailGuest;
        this.checkOutStep = 1;
        this.renderContent();
      };
    }

    const btnDrawerExtend = this.container.querySelector('#btn-drawer-extend-stay');
    if (btnDrawerExtend) {
      btnDrawerExtend.onclick = () => {
        this.activeExtendStayGuest = this.activeDetailGuest;
        this.renderContent();
      };
    }

    const btnDrawerAddCharge = this.container.querySelector('#btn-drawer-add-charge');
    if (btnDrawerAddCharge) {
      btnDrawerAddCharge.onclick = () => {
        this.activeAddChargeGuest = this.activeDetailGuest;
        this.renderContent();
      };
    }

    const btnDrawerAddGuest = this.container.querySelector('#btn-drawer-add-guest');
    if (btnDrawerAddGuest) {
      btnDrawerAddGuest.onclick = () => {
        Toast.show({ title: 'Add Guest', message: `Companion guest registration opened for Room ${this.activeDetailGuest?.roomNumber}.`, type: 'info' });
      };
    }

    const btnDrawerPrint = this.container.querySelector('#btn-drawer-print-reg');
    if (btnDrawerPrint) {
      btnDrawerPrint.onclick = () => {
        this.activePrintGuest = this.activeDetailGuest;
        this.renderContent();
      };
    }

    // Modal: Change Room Actions
    const btnCloseCR = this.container.querySelector('#btn-close-change-room');
    if (btnCloseCR) btnCloseCR.onclick = () => { this.activeChangeRoomGuest = null; this.renderContent(); };
    const btnCancelCR = this.container.querySelector('#btn-cancel-change-room');
    if (btnCancelCR) btnCancelCR.onclick = () => { this.activeChangeRoomGuest = null; this.renderContent(); };

    const btnConfirmCR = this.container.querySelector('#btn-confirm-change-room');
    if (btnConfirmCR && this.activeChangeRoomGuest) {
      btnConfirmCR.onclick = () => {
        const guest = this.activeChangeRoomGuest;
        const selectedRadio = this.container.querySelector('input[name="sel-new-room"]:checked');
        const newRoomNum = selectedRadio ? selectedRadio.value : '405';
        const targetRoom = this.availableRooms.find((r) => r.roomNumber === newRoomNum) || this.availableRooms[0];
        const reason = this.container.querySelector('#sel-transfer-reason')?.value || 'Guest preference';

        const oldRoom = guest.roomNumber;
        guest.roomNumber = targetRoom.roomNumber;
        guest.roomType = targetRoom.roomType;
        guest.floor = targetRoom.floor;
        guest.nightlyRate = targetRoom.nightlyRate;
        guest.activities.unshift({
          date: '12 Sep',
          time: '04:30 PM',
          type: 'room_change',
          text: `Room changed from ${oldRoom} to ${guest.roomNumber} (${reason}). New keycards encoded.`,
        });

        this.activeChangeRoomGuest = null;
        Toast.show({
          title: 'Room Change Confirmed',
          message: `${guest.name} transferred to Room ${guest.roomNumber}. Previous Room ${oldRoom} marked Dirty for turnover.`,
          type: 'success',
        });
        this.renderContent();
      };
    }

    // Modal: Extend Stay Actions
    const btnCloseES = this.container.querySelector('#btn-close-extend-stay');
    if (btnCloseES) btnCloseES.onclick = () => { this.activeExtendStayGuest = null; this.renderContent(); };
    const btnCancelES = this.container.querySelector('#btn-cancel-extend-stay');
    if (btnCancelES) btnCancelES.onclick = () => { this.activeExtendStayGuest = null; this.renderContent(); };

    const btnConfirmES = this.container.querySelector('#btn-confirm-extend-stay');
    if (btnConfirmES && this.activeExtendStayGuest) {
      btnConfirmES.onclick = () => {
        const guest = this.activeExtendStayGuest;
        const extraNights = parseInt(this.container.querySelector('#sel-extend-days')?.value || '2', 10);
        guest.totalNights += extraNights;
        guest.isExtended = true;
        guest.extendedDays += extraNights;
        guest.checkOutDate = `${15 + guest.extendedDays} Sep`;
        const addRoom = extraNights * guest.nightlyRate;
        const addTax = Math.round(addRoom * 0.18);
        guest.roomCharges += addRoom;
        guest.taxes += addTax;
        guest.totalCharges += addRoom + addTax;
        guest.balanceDue += addRoom + addTax;
        guest.paymentStatus = 'BALANCE_DUE';
        if (!guest.specialBadges.includes('Extended Stay')) {
          guest.specialBadges.push('Extended Stay');
        }
        guest.activities.unshift({
          date: '12 Sep',
          time: '04:45 PM',
          type: 'extension',
          text: `Stay extended by ${extraNights} night(s). New departure: ${guest.checkOutDate}. Folio balance updated.`,
        });

        this.activeExtendStayGuest = null;
        Toast.show({
          title: 'Stay Extended',
          message: `${guest.name}'s stay extended to ${guest.checkOutDate} (+${extraNights} nights). Folio updated.`,
          type: 'success',
        });
        this.renderContent();
      };
    }

    // Modal: Add Charge Actions
    const btnCloseAC = this.container.querySelector('#btn-close-add-charge');
    if (btnCloseAC) btnCloseAC.onclick = () => { this.activeAddChargeGuest = null; this.renderContent(); };
    const btnCancelAC = this.container.querySelector('#btn-cancel-add-charge');
    if (btnCancelAC) btnCancelAC.onclick = () => { this.activeAddChargeGuest = null; this.renderContent(); };

    const btnConfirmAC = this.container.querySelector('#btn-confirm-add-charge');
    if (btnConfirmAC && this.activeAddChargeGuest) {
      btnConfirmAC.onclick = () => {
        const guest = this.activeAddChargeGuest;
        const amount = parseFloat(this.container.querySelector('#input-charge-amount')?.value || '2500');
        const taxRate = parseFloat(this.container.querySelector('#sel-charge-tax')?.value || '18');
        const desc = this.container.querySelector('#input-charge-desc')?.value || 'Food & Beverage Room Service';
        const cat = this.container.querySelector('#sel-charge-type')?.value || 'Food & Beverage';

        const taxAmount = Math.round(amount * (taxRate / 100));
        const total = amount + taxAmount;

        if (cat.includes('Food') || cat.includes('Minibar')) {
          guest.fbCharges += amount;
        } else if (cat.includes('Laundry')) {
          guest.laundryCharges += amount;
        } else {
          guest.fbCharges += amount;
        }
        guest.taxes += taxAmount;
        guest.totalCharges += total;
        guest.balanceDue += total;
        guest.paymentStatus = 'BALANCE_DUE';

        guest.activities.unshift({
          date: '12 Sep',
          time: '05:00 PM',
          type: 'charge',
          text: `Charge posted: ${desc} (₹${total.toLocaleString('en-IN')} incl. GST)`,
        });

        this.activeAddChargeGuest = null;
        Toast.show({
          title: 'Charge Posted to Folio',
          message: `₹${total.toLocaleString('en-IN')} posted to Room ${guest.roomNumber} folio. Balance updated.`,
          type: 'success',
        });
        this.renderContent();
      };
    }

    // Modal: Checkout Multi-Step Wizard Actions
    const btnCloseCW = this.container.querySelector('#btn-close-checkout-wizard');
    if (btnCloseCW) btnCloseCW.onclick = () => { this.activeCheckOutGuest = null; this.renderContent(); };
    const btnCancelCW = this.container.querySelector('#btn-cancel-checkout');
    if (btnCancelCW) btnCancelCW.onclick = () => { this.activeCheckOutGuest = null; this.renderContent(); };

    const btnNextCW = this.container.querySelector('#btn-checkout-next');
    if (btnNextCW) {
      btnNextCW.onclick = () => {
        this.checkOutStep++;
        this.renderContent();
      };
    }

    const btnPrevCW = this.container.querySelector('#btn-checkout-prev');
    if (btnPrevCW) {
      btnPrevCW.onclick = () => {
        if (this.checkOutStep > 1) this.checkOutStep--;
        this.renderContent();
      };
    }

    const btnFinalCheckout = this.container.querySelector('#btn-confirm-final-checkout');
    if (btnFinalCheckout && this.activeCheckOutGuest) {
      btnFinalCheckout.onclick = async () => {
        const guest = this.activeCheckOutGuest;
        const roomNumber = guest.roomNumber;
        const guestName = guest.name;

        // 1. API Call
        try {
          if (guest.id && guest.id.length > 20) {
            await reservationsClient.checkOut(guest.id);
          }
        } catch (err) {
          console.warn('[InHouseGuestsView] API checkout note:', err.message);
        }

        // 2. Cascade through Central Store (Room -> Dirty, Folio -> Closed, HK task created)
        store.checkOutGuestLifecycle(roomNumber, guest.id);

        // Remove guest from active in-house list
        this.guests = this.guests.filter((g) => g.id !== guest.id);
        this.activeCheckOutGuest = null;
        this.activeDetailGuest = null;

        Toast.show({
          title: 'Check-Out Confirmed',
          message: `${guestName} checked out. Room ${roomNumber} set to Dirty; Housekeeping turnover dispatched.`,
          type: 'success',
        });
        this.renderContent();
      };
    }

    // Modal: Add Request Actions
    const btnCloseAR = this.container.querySelector('#btn-close-add-request');
    if (btnCloseAR) btnCloseAR.onclick = () => { this.activeAddRequestGuest = null; this.renderContent(); };
    const btnCancelAR = this.container.querySelector('#btn-cancel-add-request');
    if (btnCancelAR) btnCancelAR.onclick = () => { this.activeAddRequestGuest = null; this.renderContent(); };

    const btnConfirmAR = this.container.querySelector('#btn-confirm-add-request');
    if (btnConfirmAR && this.activeAddRequestGuest) {
      btnConfirmAR.onclick = () => {
        const guest = this.activeAddRequestGuest;
        const title = this.container.querySelector('#input-req-title')?.value || 'Guest Request';
        const notes = this.container.querySelector('#input-req-notes')?.value || '';

        guest.specialRequestsList.push({
          label: title,
          status: 'pending',
          icon: 'warning',
          note: notes,
        });
        if (!guest.specialBadges.includes(title)) {
          guest.specialBadges.push(title);
        }

        this.activeAddRequestGuest = null;
        Toast.show({
          title: 'Request Created',
          message: `Special request "${title}" added for Room ${guest.roomNumber}.`,
          type: 'success',
        });
        this.renderContent();
      };
    }

    // Modal: Print Registration Actions
    const btnClosePR = this.container.querySelector('#btn-close-print-reg');
    if (btnClosePR) btnClosePR.onclick = () => { this.activePrintGuest = null; this.renderContent(); };
    const btnCancelPR = this.container.querySelector('#btn-cancel-print-reg');
    if (btnCancelPR) btnCancelPR.onclick = () => { this.activePrintGuest = null; this.renderContent(); };
    const btnDoPrint = this.container.querySelector('#btn-do-print-reg');
    if (btnDoPrint) {
      btnDoPrint.onclick = () => {
        window.print();
      };
    }
  }

  openDetailDrawer(gid) {
    this.activeDetailGuest = this.guests.find((g) => g.id === gid) || this.guests[0];
    this.renderContent();
  }

  closeDetailDrawer() {
    this.activeDetailGuest = null;
    this.renderContent();
  }
}
