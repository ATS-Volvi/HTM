// ==========================================================================
// VOLVITECH HOSPITALITY OS — GUEST PROFILE MANAGEMENT (CENTRAL GUEST 360°)
// Single Source of Truth for Identity, Lifetime Stays, Preferences & History
// ==========================================================================

import { store } from '../../state/store.js';
import { Toast } from '../../components/Toast.js';
import { NewBookingModal } from './NewBookingModal.js';
import { reservationsClient } from '../../api/reservationsClient.js';

export class GuestProfileCRMView {
  constructor() {
    this.container = null;
    this.isLoading = false;
    this.searchQuery = '';
    this.activeQuickFilter = 'ALL'; // 'ALL', 'IN_HOUSE', 'UPCOMING', 'RETURNING', 'VIP', 'CORPORATE', 'LOYALTY', 'ATTENTION'

    // Secondary Filter Dropdowns
    this.filters = {
      nationality: 'ALL',
      guestType: 'ALL',
      loyaltyLevel: 'ALL',
      completeness: 'ALL',
    };

    // Active Modal & Drawer State
    this.activeDetailGuest = null; // When selected, opens dedicated full guest profile view/drawer
    this.activeAddGuestModal = false;
    this.activeEditProfileGuest = null;
    this.activeEditPreferencesGuest = null;
    this.activeAddDocumentGuest = null;
    this.activeMergeModalGuest = null;
    this.activeCompleteProfileGuest = null;

    // Core Central Guest Database (1 Profile per real guest entity)
    // ID prefix: GST-XXXXX
    this.guests = this.generateInitialGuestProfiles();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // INITIAL GUEST PROFILES (Realistic Hotel Guests)
  // ──────────────────────────────────────────────────────────────────────────
  generateInitialGuestProfiles() {
    return [
      {
        id: 'gst-00182',
        guestId: 'GST-00182',
        name: 'Sarah Mitchell',
        firstName: 'Sarah',
        lastName: 'Mitchell',
        avatar: 'SM',
        phone: '+91 98201 44552',
        email: 'sarah.mitchell@vanguard.com',
        nationality: 'Indian',
        preferredLanguage: 'English',
        address: '42 Marine Drive, Mumbai 400020',
        guestSince: '2024',
        guestType: 'VIP',
        vip: true,
        vipTier: 'VIP',
        loyaltyLevel: 'Gold',
        loyaltyPoints: 14250,
        completeness: 80,
        missingFields: ['Emergency contact', 'Secondary phone'],
        isReturning: true,
        totalStays: 7,
        lifetimeSpend: 284500,
        lastStay: 'Aug 2026',
        // Current Stay
        currentStay: {
          status: 'IN_HOUSE',
          roomNumber: '402',
          roomType: 'Deluxe King',
          checkInDate: '12 Sep',
          checkOutDate: '15 Sep',
          stayDates: '12 Sep → 15 Sep',
          adults: 2,
          folioNumber: 'FOL-402-0926',
          totalFolio: 46380,
          balance: 0,
        },
        // Preferences
        preferences: {
          room: ['King Bed', 'High Floor', 'Non-Smoking', 'Corner Room'],
          dining: ['Vegetarian', 'Almond Milk', 'Decaf Coffee'],
          service: ['Late Checkout', 'Daily Newspaper', 'Extra Towels'],
          communication: ['WhatsApp', 'Email'],
        },
        // Completed Stay History
        stayHistory: [
          {
            id: 'stay-1',
            date: '15 Aug 2026',
            roomNumber: '402',
            roomType: 'Deluxe King',
            nights: 3,
            spend: 46380,
            status: 'Checked Out',
          },
          {
            id: 'stay-2',
            date: '12 Jun 2026',
            roomNumber: '615',
            roomType: 'Suite',
            nights: 2,
            spend: 32500,
            status: 'Checked Out',
          },
          {
            id: 'stay-3',
            date: '04 Feb 2026',
            roomNumber: '402',
            roomType: 'Deluxe King',
            nights: 4,
            spend: 51200,
            status: 'Checked Out',
          },
        ],
        // Reservation History
        reservationHistory: [
          { resNumber: 'RES-10482', stayDates: '12 Sep → 15 Sep 2026', roomType: 'Deluxe King', status: 'In-House' },
          { resNumber: 'RES-10591', stayDates: '22 Jul → 25 Jul 2026', roomType: 'Deluxe King', status: 'Cancelled' },
          { resNumber: 'RES-10823', stayDates: '10 May → 12 May 2026', roomType: 'Classic King', status: 'No Show' },
          { resNumber: 'RES-10944', stayDates: '24 Dec → 28 Dec 2026', roomType: 'Luxury Suite', status: 'Upcoming' },
        ],
        // Communication Log
        communicationHistory: [
          { date: '07 Sep', time: '10:15 AM', channel: 'WhatsApp', message: 'Your checkout is at 12 PM.' },
          { date: '06 Sep', time: '07:30 PM', channel: 'Email', message: 'Your restaurant reservation at The Grand Bistro is confirmed.' },
          { date: '04 Sep', time: '02:45 PM', channel: 'WhatsApp', message: 'Welcome to Volvitech Hotel. Your keycard is ready.' },
        ],
        // Operational Requests
        guestRequests: [
          { title: 'Late Checkout', status: 'Approved', department: 'Front Desk' },
          { title: 'Extra Pillow', status: 'Completed', department: 'Housekeeping' },
          { title: 'Airport Transfer', status: 'Confirmed', department: 'Concierge' },
        ],
        // Service / Complaint History
        serviceHistory: [
          {
            date: '14 Aug 2026',
            issue: 'Room AC issue',
            status: 'Resolved',
            resolution: 'Room moved + complimentary dinner provided.',
          },
        ],
        // Compliance Documents
        documents: [
          { type: 'Passport', status: 'Verified', number: 'P2094819X', expiry: '2029-08-15' },
          { type: 'National ID', status: 'Verified', number: 'XXXX-XXXX-4421', expiry: 'Permanent' },
          { type: 'Visa', status: 'Verified', number: 'IND-V-99218', expiry: '2027-01-10' },
        ],
        // Chronological Activity Timeline
        activityTimeline: [
          { time: 'Today 10:42 AM', text: 'Checked into Room 402 by Duty Agent T01.' },
          { time: 'Yesterday 8:30 PM', text: 'Restaurant charge ₹2,450 posted from The Grand Bistro.' },
          { time: 'Yesterday 7:45 PM', text: 'Room service requested (Fresh Towels tray).' },
          { time: '04 Sep 3:15 PM', text: 'Checked in for current stay reservation RES-10482.' },
          { time: '04 Sep 2:58 PM', text: 'Passport and Government ID verified.' },
        ],
        // Audit Info
        auditLog: {
          lastChanged: 'Phone number',
          changedDate: '07 Sep 2026, 10:32 AM',
          changedBy: 'Front Desk — Employee 104 (Victoria Sterling)',
        },
      },
      {
        id: 'gst-00183',
        guestId: 'GST-00183',
        name: 'John Smith',
        firstName: 'John',
        lastName: 'Smith',
        avatar: 'JS',
        phone: '+44 20 7946 0192',
        email: 'john.smith@smithadvisory.co.uk',
        nationality: 'United Kingdom',
        preferredLanguage: 'English',
        address: '12 Berkeley Square, Mayfair, London W1J 6BD',
        guestSince: '2025',
        guestType: 'RETURNING',
        vip: false,
        vipTier: null,
        loyaltyLevel: 'Silver',
        loyaltyPoints: 5400,
        completeness: 100,
        missingFields: [],
        isReturning: true,
        totalStays: 3,
        lifetimeSpend: 164000,
        lastStay: 'Jul 2026',
        currentStay: {
          status: 'IN_HOUSE',
          roomNumber: '508',
          roomType: 'Deluxe King',
          checkInDate: '04 Sep',
          checkOutDate: '07 Sep',
          stayDates: '04 Sep → 07 Sep',
          adults: 1,
          folioNumber: 'FOL-508-0926',
          totalFolio: 54988,
          balance: 6380,
        },
        preferences: {
          room: ['Quiet Room', 'Away from elevator', 'High Floor'],
          dining: ['Low Sodium', 'Continental Breakfast'],
          service: ['Express Checkout', 'Taxi at 08:00 AM'],
          communication: ['Email'],
        },
        stayHistory: [
          { id: 'stay-js1', date: '10 Jul 2026', roomNumber: '508', roomType: 'Deluxe King', nights: 3, spend: 42000, status: 'Checked Out' },
          { id: 'stay-js2', date: '18 Jan 2026', roomNumber: '304', roomType: 'Classic King', nights: 4, spend: 38000, status: 'Checked Out' },
        ],
        reservationHistory: [
          { resNumber: 'RES-10483', stayDates: '04 Sep → 07 Sep 2026', roomType: 'Deluxe King', status: 'In-House' },
          { resNumber: 'RES-10312', stayDates: '10 Jul → 13 Jul 2026', roomType: 'Deluxe King', status: 'Completed' },
        ],
        communicationHistory: [
          { date: '07 Sep', time: '09:00 AM', channel: 'Email', message: 'Corporate flex rate invoice copy dispatched.' },
        ],
        guestRequests: [
          { title: 'Extra Hangers', status: 'Completed', department: 'Housekeeping' },
          { title: 'Iron and Board', status: 'Completed', department: 'Housekeeping' },
        ],
        serviceHistory: [],
        documents: [
          { type: 'Passport', status: 'Verified', number: 'GB9821721', expiry: '2031-04-12' },
        ],
        activityTimeline: [
          { time: 'Today 09:15 AM', text: 'Corporate Amex pre-authorization verified.' },
          { time: '04 Sep 07:45 PM', text: 'Checked in by Evening Reception Shift.' },
        ],
        auditLog: {
          lastChanged: 'Corporate billing code',
          changedDate: '04 Sep 2026, 08:00 PM',
          changedBy: 'Front Desk — Employee 102 (James Wilson)',
        },
      },
      {
        id: 'gst-00184',
        guestId: 'GST-00184',
        name: 'Aisha Al-Mansoor',
        firstName: 'Aisha',
        lastName: 'Al-Mansoor',
        avatar: 'AA',
        phone: '+971 50 123 9988',
        email: 'aisha.almansoor@emirates.ae',
        nationality: 'United Arab Emirates',
        preferredLanguage: 'Arabic',
        address: 'Al Bateen Villa District, Abu Dhabi',
        guestSince: '2023',
        guestType: 'VIP',
        vip: true,
        vipTier: 'Royal VIP',
        loyaltyLevel: 'Platinum',
        loyaltyPoints: 68400,
        completeness: 95,
        missingFields: ['Secondary Contact Email'],
        isReturning: true,
        totalStays: 9,
        lifetimeSpend: 1480000,
        lastStay: 'May 2026',
        currentStay: {
          status: 'IN_HOUSE',
          roomNumber: '501',
          roomType: 'Presidential Royal Suite',
          checkInDate: '02 Sep',
          checkOutDate: '07 Sep',
          stayDates: '02 Sep → 07 Sep',
          adults: 3,
          folioNumber: 'FOL-501-0907',
          totalFolio: 415832,
          balance: 0,
        },
        preferences: {
          room: ['Royal Suite', 'Sea View', 'Fragrance-Free Linens', 'Connected Rooms'],
          dining: ['Halal Only', 'Arabic Breakfast Platter', 'Fresh Mint Tea'],
          service: ['Private Butler', 'Luggage Valet', 'Airport Limousine'],
          communication: ['WhatsApp', 'Direct Concierge Line'],
        },
        stayHistory: [
          { id: 'stay-aa1', date: '20 May 2026', roomNumber: '501', roomType: 'Presidential Suite', nights: 5, spend: 325000, status: 'Checked Out' },
          { id: 'stay-aa2', date: '14 Dec 2025', roomNumber: '501', roomType: 'Presidential Suite', nights: 6, spend: 410000, status: 'Checked Out' },
        ],
        reservationHistory: [
          { resNumber: 'RES-10488', stayDates: '02 Sep → 07 Sep 2026', roomType: 'Presidential Suite', status: 'In-House' },
          { resNumber: 'RES-10990', stayDates: '15 Nov → 20 Nov 2026', roomType: 'Presidential Suite', status: 'Upcoming' },
        ],
        communicationHistory: [
          { date: '06 Sep', time: '03:00 PM', channel: 'WhatsApp', message: 'Rolls Royce departure escort scheduled for 2:00 PM tomorrow.' },
        ],
        guestRequests: [
          { title: 'Rolls Royce Escort', status: 'Approved', department: 'Transport' },
          { title: 'Arabic Coffee Service', status: 'Completed', department: 'Butler Service' },
        ],
        serviceHistory: [],
        documents: [
          { type: 'Diplomatic Passport', status: 'Verified', number: 'UAE-D-88190', expiry: '2030-11-20' },
        ],
        activityTimeline: [
          { time: '02 Sep 01:00 PM', text: 'VIP check-in conducted in-suite by General Manager.' },
        ],
        auditLog: {
          lastChanged: 'VIP Butler Allocation',
          changedDate: '02 Sep 2026, 01:30 PM',
          changedBy: 'Guest Relations Manager (Elena Rostova)',
        },
      },
      {
        id: 'gst-00185',
        guestId: 'GST-00185',
        name: 'Carlos Ruiz',
        firstName: 'Carlos',
        lastName: 'Ruiz',
        avatar: 'CR',
        phone: '+34 600 123 456',
        email: 'carlos.ruiz@madrid.es',
        nationality: 'Spain',
        preferredLanguage: 'Spanish',
        address: 'Calle Serrano 45, Madrid 28001',
        guestSince: '2025',
        guestType: 'RETURNING',
        vip: false,
        vipTier: null,
        loyaltyLevel: 'Silver',
        loyaltyPoints: 3200,
        completeness: 85,
        missingFields: ['Emergency contact'],
        isReturning: true,
        totalStays: 3,
        lifetimeSpend: 48500,
        lastStay: 'Mar 2026',
        currentStay: {
          status: 'IN_HOUSE',
          roomNumber: '305',
          roomType: 'Classic King',
          checkInDate: '06 Sep',
          checkOutDate: '07 Sep',
          stayDates: '06 Sep → 07 Sep',
          adults: 1,
          folioNumber: 'FOL-305-0907',
          totalFolio: 11210,
          balance: 0,
        },
        preferences: {
          room: ['Lower Floor', 'Double Bed'],
          dining: ['Espresso in morning'],
          service: ['Taxi booking'],
          communication: ['Email'],
        },
        stayHistory: [
          { id: 'stay-cr1', date: '15 Mar 2026', roomNumber: '305', roomType: 'Classic King', nights: 2, spend: 18500, status: 'Checked Out' },
        ],
        reservationHistory: [
          { resNumber: 'RES-10487', stayDates: '06 Sep → 07 Sep 2026', roomType: 'Classic King', status: 'In-House' },
        ],
        communicationHistory: [],
        guestRequests: [],
        serviceHistory: [],
        documents: [
          { type: 'EU National ID', status: 'Verified', number: 'ES-09182736M', expiry: '2028-06-25' },
        ],
        activityTimeline: [
          { time: '06 Sep 02:30 PM', text: 'Checked in at front desk desk T02.' },
        ],
        auditLog: {
          lastChanged: 'Profile creation',
          changedDate: '15 Mar 2026',
          changedBy: 'OTA API Integration',
        },
      },
      {
        id: 'gst-00186',
        guestId: 'GST-00186',
        name: 'David Miller',
        firstName: 'David',
        lastName: 'Miller',
        avatar: 'DM',
        phone: '+1 (415) 789-0123',
        email: 'david.miller@bayadvisory.com',
        nationality: 'United States',
        preferredLanguage: 'English',
        address: '500 Howard Street, San Francisco, CA',
        guestSince: '2024',
        guestType: 'CORPORATE',
        vip: false,
        vipTier: null,
        loyaltyLevel: 'Gold',
        loyaltyPoints: 11200,
        completeness: 90,
        missingFields: ['Company GSTIN Registration'],
        isReturning: true,
        totalStays: 4,
        lifetimeSpend: 198000,
        lastStay: 'Feb 2026',
        currentStay: {
          status: 'IN_HOUSE',
          roomNumber: '310',
          roomType: 'Deluxe King',
          checkInDate: '03 Sep',
          checkOutDate: '07 Sep',
          stayDates: '03 Sep → 07 Sep',
          adults: 1,
          folioNumber: 'FOL-310-0907',
          totalFolio: 57171,
          balance: 5604,
        },
        preferences: {
          room: ['High Floor', 'Quiet Room', 'King Bed'],
          dining: ['Gluten-Free', 'Espresso machine'],
          service: ['Daily Laundry service'],
          communication: ['Email', 'SMS'],
        },
        stayHistory: [
          { id: 'stay-dm1', date: '08 Feb 2026', roomNumber: '410', roomType: 'Deluxe King', nights: 3, spend: 45000, status: 'Checked Out' },
        ],
        reservationHistory: [
          { resNumber: 'RES-10497', stayDates: '03 Sep → 07 Sep 2026', roomType: 'Deluxe King', status: 'In-House' },
        ],
        communicationHistory: [],
        guestRequests: [{ title: 'Late checkout request', status: 'Pending Review', department: 'Front Desk' }],
        serviceHistory: [],
        documents: [{ type: 'Passport', status: 'Verified', number: 'US-9918237', expiry: '2029-03-01' }],
        activityTimeline: [{ time: '03 Sep 03:00 PM', text: 'Checked in by Duty Agent T01.' }],
        auditLog: {
          lastChanged: 'Corporate corporate rates attached',
          changedDate: '03 Sep 2026',
          changedBy: 'Front Desk Supervisor',
        },
      },
      {
        id: 'gst-00187',
        guestId: 'GST-00187',
        name: 'Elena Rostova',
        firstName: 'Elena',
        lastName: 'Rostova',
        avatar: 'ER',
        phone: '+33 612 345 678',
        email: 'elena.rostova@artlux.fr',
        nationality: 'France',
        preferredLanguage: 'French',
        address: '18 Rue de Rivoli, Paris 75004',
        guestSince: '2025',
        guestType: 'RETURNING',
        vip: false,
        vipTier: null,
        loyaltyLevel: 'Silver',
        loyaltyPoints: 4800,
        completeness: 100,
        missingFields: [],
        isReturning: true,
        totalStays: 2,
        lifetimeSpend: 93860,
        lastStay: 'Today',
        currentStay: null, // Checked out earlier today
        preferences: {
          room: ['Ocean View', 'Balcony', 'Feather Pillows'],
          dining: ['French Pastries', 'Sparkling Water'],
          service: ['Taxi to Airport', 'Luggage Cloakroom'],
          communication: ['Email'],
        },
        stayHistory: [
          { id: 'stay-er1', date: '07 Sep 2026', roomNumber: '315', roomType: 'Deluxe Ocean Suite', nights: 3, spend: 61360, status: 'Checked Out' },
          { id: 'stay-er2', date: '12 Nov 2025', roomNumber: '315', roomType: 'Deluxe Ocean Suite', nights: 2, spend: 32500, status: 'Checked Out' },
        ],
        reservationHistory: [
          { resNumber: 'RES-10485', stayDates: '04 Sep → 07 Sep 2026', roomType: 'Deluxe Ocean Suite', status: 'Completed' },
        ],
        communicationHistory: [
          { date: '07 Sep', time: '10:35 AM', channel: 'Email', message: 'Final folio receipt ₹61,360 emailed to elena.rostova@artlux.fr.' },
        ],
        guestRequests: [],
        serviceHistory: [],
        documents: [{ type: 'Passport', status: 'Verified', number: 'FRA-992182', expiry: '2030-05-18' }],
        activityTimeline: [
          { time: 'Today 10:30 AM', text: 'Checked out from Room 315. Keycards returned.' },
        ],
        auditLog: {
          lastChanged: 'Checkout timestamp',
          changedDate: 'Today 10:30 AM',
          changedBy: 'Front Desk Duty Agent (T01)',
        },
      },
      {
        id: 'gst-00188',
        guestId: 'GST-00188',
        name: 'Lucas Weber',
        firstName: 'Lucas',
        lastName: 'Weber',
        avatar: 'LW',
        phone: '+49 171 2345678',
        email: 'lucas.weber@berlin.de',
        nationality: 'Germany',
        preferredLanguage: 'German',
        address: 'Friedrichstraße 120, Berlin 10117',
        guestSince: '2024',
        guestType: 'CORPORATE',
        vip: false,
        vipTier: null,
        loyaltyLevel: 'Gold',
        loyaltyPoints: 12500,
        completeness: 100,
        missingFields: [],
        isReturning: true,
        totalStays: 5,
        lifetimeSpend: 135000,
        lastStay: 'Today',
        currentStay: null,
        preferences: {
          room: ['Single Occupancy', 'Desk Workspace', 'High Speed Wifi'],
          dining: ['Black Coffee', 'Buffet Breakfast'],
          service: ['GST Company Invoice'],
          communication: ['Email'],
        },
        stayHistory: [
          { id: 'stay-lw1', date: '07 Sep 2026', roomNumber: '104', roomType: 'Classic King', nights: 2, spend: 24131, status: 'Checked Out' },
        ],
        reservationHistory: [
          { resNumber: 'RES-10489', stayDates: '05 Sep → 07 Sep 2026', roomType: 'Classic King', status: 'Completed' },
        ],
        communicationHistory: [],
        guestRequests: [],
        serviceHistory: [],
        documents: [{ type: 'EU ID Card', status: 'Verified', number: 'DE-19283746', expiry: '2029-10-01' }],
        activityTimeline: [{ time: 'Today 11:15 AM', text: 'Checked out by Reception Supervisor.' }],
        auditLog: { lastChanged: 'Invoice GST details', changedDate: '07 Sep 2026', changedBy: 'Front Desk T02' },
      },
      {
        id: 'gst-00189',
        guestId: 'GST-00189',
        name: 'Priya Narayanan',
        firstName: 'Priya',
        lastName: 'Narayanan',
        avatar: 'PN',
        phone: '+91 98401 23456',
        email: 'priya.narayanan@chennai.in',
        nationality: 'Indian',
        preferredLanguage: 'English',
        address: '14 Boat Club Road, Chennai 600028',
        guestSince: '2026',
        guestType: 'UPCOMING',
        vip: false,
        vipTier: null,
        loyaltyLevel: 'Member',
        loyaltyPoints: 1200,
        completeness: 65,
        missingFields: ['Government ID Upload', 'Emergency Contact', 'Address Proof'],
        isReturning: false,
        totalStays: 0,
        lifetimeSpend: 0,
        lastStay: 'None',
        currentStay: null,
        preferences: {
          room: ['Non-Smoking', 'Twin Beds'],
          dining: ['South Indian Breakfast'],
          service: ['Airport pickup at 4 PM'],
          communication: ['WhatsApp'],
        },
        stayHistory: [],
        reservationHistory: [
          { resNumber: 'RES-10992', stayDates: '15 Sep → 18 Sep 2026', roomType: 'Classic King', status: 'Upcoming' },
        ],
        communicationHistory: [
          { date: '05 Sep', time: '11:00 AM', channel: 'Email', message: 'Booking confirmation RES-10992 dispatched.' },
        ],
        guestRequests: [{ title: 'Airport Pickup', status: 'Confirmed', department: 'Concierge' }],
        serviceHistory: [],
        documents: [],
        activityTimeline: [{ time: '05 Sep 11:00 AM', text: 'Online reservation created via website.' }],
        auditLog: { lastChanged: 'Profile creation', changedDate: '05 Sep 2026', changedBy: 'Direct Web Booking Engine' },
      },
    ];
  }

  async loadData() {
    this.isLoading = true;
    this.renderContent();

    try {
      const res = await reservationsClient.searchGuests(this.searchQuery || 'a');
      if (res && res.data && res.data.length > 0) {
        console.log('[GuestProfileCRMView] Synced with hotel guest directory:', res.data.length);
      }
    } catch (err) {
      console.warn('[GuestProfileCRMView] Using central guest profile directory.', err);
    } finally {
      this.isLoading = false;
      this.renderContent();
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SUMMARY KPI METRICS (Exact 5 Cards from Specification)
  // ──────────────────────────────────────────────────────────────────────────
  getSummaryMetrics() {
    return {
      totalGuests: '12,482',
      returningGuests: '3,842',
      inHouse: 82,
      vipGuests: 146,
      profilesNeedingAttention: 18,
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FILTERING LOGIC
  // ──────────────────────────────────────────────────────────────────────────
  getFilteredGuests() {
    let list = [...this.guests];

    // Search query: Guest name, Guest ID, Phone, Email, Room number, Reservation number
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter((g) => {
        const matchName = g.name.toLowerCase().includes(q);
        const matchId = g.guestId.toLowerCase().includes(q);
        const matchPhone = g.phone.toLowerCase().includes(q);
        const matchEmail = g.email.toLowerCase().includes(q);
        const matchRoom = g.currentStay ? g.currentStay.roomNumber.toLowerCase().includes(q) : false;
        const matchRes = g.reservationHistory.some((r) => r.resNumber.toLowerCase().includes(q));
        const matchDoc = g.documents.some((d) => d.number.toLowerCase().includes(q));
        return matchName || matchId || matchPhone || matchEmail || matchRoom || matchRes || matchDoc;
      });
    }

    // Quick filter chips
    if (this.activeQuickFilter === 'IN_HOUSE') {
      list = list.filter((g) => g.currentStay && g.currentStay.status === 'IN_HOUSE');
    } else if (this.activeQuickFilter === 'UPCOMING') {
      list = list.filter((g) => g.guestType === 'UPCOMING' || g.reservationHistory.some((r) => r.status === 'Upcoming'));
    } else if (this.activeQuickFilter === 'RETURNING') {
      list = list.filter((g) => g.isReturning || g.totalStays > 1);
    } else if (this.activeQuickFilter === 'VIP') {
      list = list.filter((g) => g.vip);
    } else if (this.activeQuickFilter === 'CORPORATE') {
      list = list.filter((g) => g.guestType === 'CORPORATE');
    } else if (this.activeQuickFilter === 'LOYALTY') {
      list = list.filter((g) => g.loyaltyLevel && g.loyaltyLevel !== 'Member');
    } else if (this.activeQuickFilter === 'ATTENTION') {
      list = list.filter((g) => g.completeness < 100 || g.missingFields.length > 0);
    }

    // Secondary Dropdown Filters
    if (this.filters.nationality !== 'ALL') {
      list = list.filter((g) => g.nationality.toLowerCase() === this.filters.nationality.toLowerCase());
    }
    if (this.filters.guestType !== 'ALL') {
      list = list.filter((g) => g.guestType.toLowerCase() === this.filters.guestType.toLowerCase());
    }
    if (this.filters.loyaltyLevel !== 'ALL') {
      list = list.filter((g) => g.loyaltyLevel.toLowerCase() === this.filters.loyaltyLevel.toLowerCase());
    }
    if (this.filters.completeness === 'COMPLETE') {
      list = list.filter((g) => g.completeness === 100);
    } else if (this.filters.completeness === 'INCOMPLETE') {
      list = list.filter((g) => g.completeness < 100);
    }

    return list;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MAIN RENDER METHOD
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
    const filteredGuests = this.getFilteredGuests();

    this.container.innerHTML = `
      <!-- ================================================================= -->
      <!-- HEADER & TOP ACTIONS -->
      <!-- ================================================================= -->
      <section class="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-outline-variant/60">
        <div>
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant font-data-mono">VOLVITECH HOSPITALITY OS</span>
            <span class="text-on-surface-variant font-data-mono">→</span>
            <span class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant font-data-mono">Front Desk</span>
            <span class="text-on-surface-variant font-data-mono">→</span>
            <span class="text-xs font-semibold uppercase tracking-wider text-primary font-data-mono font-bold">Guests</span>
            <span class="text-on-surface-variant font-data-mono">•</span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              <span class="material-symbols-outlined text-[14px]">badge</span>
              Central Guest Intelligence
            </span>
          </div>
          <h1 class="font-headline-lg text-2xl sm:text-3xl font-bold text-primary tracking-tight">Guests</h1>
          <p class="text-sm text-on-surface-variant mt-0.5">Manage guest profiles, history and preferences.</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <button id="btn-import-guests" class="px-4 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container hover:border-primary text-primary font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
            <span class="material-symbols-outlined text-[18px]">upload_file</span>
            <span>Import Guests</span>
          </button>

          <button id="btn-add-guest" class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
            <span class="material-symbols-outlined text-[18px]">person_add</span>
            <span>+ Add Guest</span>
          </button>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- SUMMARY CARDS (Five Compact Operational Indicators) -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        <!-- CARD 1: TOTAL GUESTS -->
        <div class="card-summary-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'ALL'
            ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
            : 'border-outline-variant/70 hover:border-primary/50 hover:shadow-xs'
        }" data-filter="ALL" title="Click to view all guests">
          <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">TOTAL GUESTS</div>
          <div class="text-3xl font-black text-primary font-headline-lg tracking-tight">${metrics.totalGuests}</div>
          <div class="text-xs text-on-surface-variant mt-0.5">Master profile directory</div>
        </div>

        <!-- CARD 2: RETURNING GUESTS -->
        <div class="card-summary-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'RETURNING'
            ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-blue-400 hover:shadow-xs'
        }" data-filter="RETURNING" title="Click to view returning guests">
          <div class="text-[10px] font-bold uppercase tracking-wider text-blue-900 mb-1 font-data-mono flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-blue-700">repeat</span>
            RETURNING GUESTS
          </div>
          <div class="text-3xl font-black text-blue-800 font-headline-lg tracking-tight">${metrics.returningGuests}</div>
          <div class="text-xs text-blue-800 mt-0.5">Frequent visitors</div>
        </div>

        <!-- CARD 3: IN-HOUSE -->
        <div class="card-summary-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'IN_HOUSE'
            ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-emerald-500/50 hover:shadow-xs'
        }" data-filter="IN_HOUSE" title="Click to view currently staying guests">
          <div class="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1 font-data-mono flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            IN-HOUSE
          </div>
          <div class="text-3xl font-black text-emerald-700 font-headline-lg tracking-tight">${metrics.inHouse}</div>
          <div class="text-xs text-emerald-800 mt-0.5">Active hotel stays</div>
        </div>

        <!-- CARD 4: VIP GUESTS -->
        <div class="card-summary-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'VIP'
            ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-amber-400 hover:shadow-xs'
        }" data-filter="VIP" title="Click to view VIP guests">
          <div class="text-[10px] font-bold uppercase tracking-wider text-amber-900 mb-1 font-data-mono flex items-center gap-1">
            <span class="text-amber-500 text-[12px]">⭐</span>
            VIP GUESTS
          </div>
          <div class="text-3xl font-black text-amber-800 font-headline-lg tracking-tight">${metrics.vipGuests}</div>
          <div class="text-xs text-amber-800 mt-0.5">High value profiles</div>
        </div>

        <!-- CARD 5: PROFILES NEEDING ATTENTION -->
        <div class="card-summary-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'ATTENTION'
            ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-rose-400 hover:shadow-xs'
        }" data-filter="ATTENTION" title="Click to view incomplete profiles">
          <div class="text-[10px] font-bold uppercase tracking-wider text-rose-900 mb-1 font-data-mono flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-rose-700">warning</span>
            ATTENTION NEEDED
          </div>
          <div class="text-3xl font-black text-rose-800 font-headline-lg tracking-tight">${metrics.profilesNeedingAttention}</div>
          <div class="text-xs text-rose-800 mt-0.5">Missing documents/info</div>
        </div>

      </section>

      <!-- ================================================================= -->
      <!-- SEARCH & MULTI-FILTER TOOLBAR -->
      <!-- ================================================================= -->
      <section class="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/70 shadow-xs space-y-4">
        
        <!-- Large Search Bar: supports name, phone, email, guest ID, room, reservation -->
        <div class="relative">
          <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[22px]">search</span>
          <input
            type="text"
            id="input-guest-search"
            value="${this.searchQuery}"
            placeholder="Search guest name, phone, email, guest ID or room..."
            class="w-full pl-12 pr-10 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold text-on-surface bg-surface-container-high/30 placeholder:text-on-surface-variant/80 transition-all outline-none"
          />
          ${
            this.searchQuery
              ? `<button id="btn-clear-guest-search" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary p-1 cursor-pointer">
                  <span class="material-symbols-outlined text-[18px]">close</span>
                </button>`
              : ''
          }
        </div>

        <!-- Quick Filters Chips -->
        <div class="flex flex-wrap items-center gap-2">
          ${[
            { key: 'ALL', label: 'All Guests' },
            { key: 'IN_HOUSE', label: 'In-House' },
            { key: 'UPCOMING', label: 'Upcoming' },
            { key: 'RETURNING', label: 'Returning' },
            { key: 'VIP', label: '⭐ VIP' },
            { key: 'CORPORATE', label: 'Corporate' },
            { key: 'LOYALTY', label: 'Loyalty Members' },
            { key: 'ATTENTION', label: 'Profiles Needing Attention' },
          ]
            .map(
              (f) => `
            <button
              class="btn-guest-filter px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                this.activeQuickFilter === f.key
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/60'
              }"
              data-filter="${f.key}"
            >
              ${f.label}
            </button>
          `
            )
            .join('')}
        </div>

        <!-- Additional Filters Row -->
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-3 border-t border-outline-variant/40">
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Nationality</label>
            <select id="sel-filter-nationality" class="w-full py-1.5 px-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
              <option value="ALL" ${this.filters.nationality === 'ALL' ? 'selected' : ''}>All Nationalities</option>
              <option value="Indian" ${this.filters.nationality === 'Indian' ? 'selected' : ''}>India</option>
              <option value="United Kingdom" ${this.filters.nationality === 'United Kingdom' ? 'selected' : ''}>United Kingdom</option>
              <option value="United States" ${this.filters.nationality === 'United States' ? 'selected' : ''}>United States</option>
              <option value="United Arab Emirates" ${this.filters.nationality === 'United Arab Emirates' ? 'selected' : ''}>UAE</option>
              <option value="France" ${this.filters.nationality === 'France' ? 'selected' : ''}>France</option>
              <option value="Germany" ${this.filters.nationality === 'Germany' ? 'selected' : ''}>Germany</option>
              <option value="Spain" ${this.filters.nationality === 'Spain' ? 'selected' : ''}>Spain</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Guest Type</label>
            <select id="sel-filter-type" class="w-full py-1.5 px-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
              <option value="ALL" ${this.filters.guestType === 'ALL' ? 'selected' : ''}>All Guest Types</option>
              <option value="VIP" ${this.filters.guestType === 'VIP' ? 'selected' : ''}>VIP</option>
              <option value="RETURNING" ${this.filters.guestType === 'RETURNING' ? 'selected' : ''}>Returning</option>
              <option value="CORPORATE" ${this.filters.guestType === 'CORPORATE' ? 'selected' : ''}>Corporate</option>
              <option value="UPCOMING" ${this.filters.guestType === 'UPCOMING' ? 'selected' : ''}>Upcoming First-Time</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Loyalty Level</label>
            <select id="sel-filter-loyalty" class="w-full py-1.5 px-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
              <option value="ALL" ${this.filters.loyaltyLevel === 'ALL' ? 'selected' : ''}>All Loyalty Levels</option>
              <option value="Platinum" ${this.filters.loyaltyLevel === 'Platinum' ? 'selected' : ''}>Platinum</option>
              <option value="Gold" ${this.filters.loyaltyLevel === 'Gold' ? 'selected' : ''}>Gold</option>
              <option value="Silver" ${this.filters.loyaltyLevel === 'Silver' ? 'selected' : ''}>Silver</option>
              <option value="Member" ${this.filters.loyaltyLevel === 'Member' ? 'selected' : ''}>Standard Member</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Profile Completeness</label>
            <select id="sel-filter-completeness" class="w-full py-1.5 px-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
              <option value="ALL" ${this.filters.completeness === 'ALL' ? 'selected' : ''}>All Profiles</option>
              <option value="COMPLETE" ${this.filters.completeness === 'COMPLETE' ? 'selected' : ''}>100% Complete</option>
              <option value="INCOMPLETE" ${this.filters.completeness === 'INCOMPLETE' ? 'selected' : ''}>Attention Needed (&lt; 100%)</option>
            </select>
          </div>

          <div class="flex items-end justify-between gap-2 col-span-2 sm:col-span-1">
            <div class="py-1 px-1 text-xs font-bold text-primary font-data-mono">
              ${filteredGuests.length} Profiles
            </div>
            <button id="btn-reset-guest-filters" class="py-2 px-3 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary flex items-center justify-center gap-1 cursor-pointer transition-all">
              <span class="material-symbols-outlined text-[15px]">restart_alt</span>
              <span>Reset</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- GUEST LIST TABLE -->
      <!-- ================================================================= -->
      <section>
        ${this.renderGuestListTable(filteredGuests)}
      </section>

      <!-- ================================================================= -->
      <!-- DEDICATED FULL GUEST PROFILE EXPERIENCE (Full Drawer / Workspace) -->
      <!-- ================================================================= -->
      <div id="drawer-backdrop" class="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity duration-300 ${
        this.activeDetailGuest ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }"></div>

      <aside id="guest-profile-drawer" class="fixed top-0 right-0 h-full w-full max-w-3xl bg-surface-container-lowest shadow-2xl z-50 border-l border-outline-variant flex flex-col transform transition-transform duration-300 ease-out select-none ${
        this.activeDetailGuest ? 'translate-x-0' : 'translate-x-full'
      }">
        ${this.renderGuestProfileDrawerContent()}
      </aside>

      <!-- ================================================================= -->
      <!-- WORKFLOW MODALS -->
      <!-- ================================================================= -->
      ${this.renderAddGuestModal()}
      ${this.renderEditProfileModal()}
      ${this.renderEditPreferencesModal()}
      ${this.renderAddDocumentModal()}
      ${this.renderMergeProfilesModal()}
      ${this.renderCompleteProfileModal()}
    `;

    this.bindEvents();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // GUEST LIST TABLE RENDERING
  // ──────────────────────────────────────────────────────────────────────────
  renderGuestListTable(guests) {
    if (guests.length === 0) {
      return `
        <div class="bg-surface-container-lowest rounded-2xl p-16 border border-outline-variant/70 text-center space-y-4 shadow-xs">
          <div class="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <span class="material-symbols-outlined text-[32px]">person_search</span>
          </div>
          <div>
            <h3 class="font-headline-sm text-lg font-bold text-primary">No guests found.</h3>
            <p class="text-xs text-on-surface-variant max-w-md mx-auto mt-1">
              Try searching by name, phone, email, room or guest ID.
            </p>
          </div>
          <div class="pt-2">
            <button id="btn-empty-clear-search" class="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary/90 transition-all cursor-pointer">
              Clear Search
            </button>
          </div>
        </div>
      `;
    }

    return `
      <div class="bg-surface-container-lowest rounded-2xl border border-outline-variant/70 overflow-hidden shadow-xs">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-surface-bright border-b border-outline-variant text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-data-mono">
                <th class="py-3.5 px-4">Guest</th>
                <th class="py-3.5 px-4">Guest ID</th>
                <th class="py-3.5 px-4">Contact</th>
                <th class="py-3.5 px-4">Current Stay</th>
                <th class="py-3.5 px-4">Guest Type</th>
                <th class="py-3.5 px-4">Last Stay</th>
                <th class="py-3.5 px-4 text-center">Total Stays</th>
                <th class="py-3.5 px-4">Profile</th>
                <th class="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/40 font-body">
              ${guests
                .map((g) => {
                  const isInHouse = g.currentStay && g.currentStay.status === 'IN_HOUSE';

                  return `
                  <tr class="hover:bg-surface-container/30 transition-colors cursor-pointer row-guest-click" data-gid="${g.id}">
                    <!-- Guest Name & Badge -->
                    <td class="py-3.5 px-4">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl ${
                          g.vip
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-primary/10 text-primary border border-primary/20'
                        } font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                          ${g.avatar}
                        </div>
                        <div>
                          <div class="font-bold text-primary flex items-center gap-1.5 text-sm">
                            ${g.vip ? '<span class="text-amber-500">⭐</span>' : ''}
                            <span>${g.name}</span>
                          </div>
                          <div class="text-[11px] text-on-surface-variant font-data-mono">
                            ${g.nationality} • Member since ${g.guestSince}
                          </div>
                        </div>
                      </div>
                    </td>

                    <!-- Guest ID -->
                    <td class="py-3.5 px-4 font-black font-data-mono text-primary text-xs">
                      ${g.guestId}
                    </td>

                    <!-- Contact -->
                    <td class="py-3.5 px-4">
                      <div class="font-data-mono text-primary font-medium">${g.phone}</div>
                      <div class="text-[11px] text-on-surface-variant truncate max-w-[160px]">${g.email}</div>
                    </td>

                    <!-- Current Stay -->
                    <td class="py-3.5 px-4">
                      ${
                        isInHouse
                          ? `
                        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                          <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          <span>Room ${g.currentStay.roomNumber}</span>
                          <span class="text-[10px] text-emerald-700">IN-HOUSE</span>
                        </div>
                      `
                          : `<span class="text-on-surface-variant text-xs">—</span>`
                      }
                    </td>

                    <!-- Guest Type -->
                    <td class="py-3.5 px-4">
                      ${
                        g.vip
                          ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">⭐ VIP</span>`
                          : g.guestType === 'RETURNING'
                          ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900">RETURNING</span>`
                          : g.guestType === 'CORPORATE'
                          ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900">CORPORATE</span>`
                          : `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant">FIRST-TIME</span>`
                      }
                    </td>

                    <!-- Last Stay -->
                    <td class="py-3.5 px-4 font-data-mono text-on-surface">
                      ${g.lastStay}
                    </td>

                    <!-- Total Stays -->
                    <td class="py-3.5 px-4 text-center font-black font-data-mono text-primary">
                      ${g.totalStays} stay${g.totalStays !== 1 ? 's' : ''}
                    </td>

                    <!-- Profile Completeness -->
                    <td class="py-3.5 px-4">
                      <div class="flex items-center gap-2">
                        <div class="w-16 h-2 rounded-full bg-surface-container-high overflow-hidden">
                          <div class="h-full ${g.completeness === 100 ? 'bg-emerald-600' : 'bg-amber-500'}" style="width: ${g.completeness}%"></div>
                        </div>
                        <span class="text-[10px] font-bold font-data-mono ${g.completeness === 100 ? 'text-emerald-800' : 'text-amber-900'}">
                          ${g.completeness}%
                        </span>
                      </div>
                    </td>

                    <!-- Action -->
                    <td class="py-3.5 px-4 text-right">
                      <button class="btn-table-view-guest px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all cursor-pointer" data-gid="${g.id}">
                        View
                      </button>
                    </td>
                  </tr>
                `;
                })
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // DEDICATED FULL GUEST PROFILE EXPERIENCE (Large Substantial Drawer)
  // ──────────────────────────────────────────────────────────────────────────
  renderGuestProfileDrawerContent() {
    const g = this.activeDetailGuest;
    if (!g) return '';

    const isInHouse = g.currentStay && g.currentStay.status === 'IN_HOUSE';

    return `
      <!-- Header -->
      <div class="px-6 py-5 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between shrink-0">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl ${
            g.vip ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-primary/10 text-primary border border-primary/20'
          } font-bold text-base flex items-center justify-center shadow-xs">
            ${g.avatar}
          </div>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <h2 class="font-headline-sm text-xl font-bold text-primary">${g.name}</h2>
              ${g.vip ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">⭐ VIP</span>' : ''}
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900">Returning Guest</span>
              <span class="text-xs font-bold text-on-surface-variant font-data-mono">${g.totalStays} stays</span>
            </div>
            <p class="text-xs text-on-surface-variant font-data-mono mt-0.5">Guest ID: <strong>${g.guestId}</strong></p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button id="btn-profile-edit" class="px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all cursor-pointer">
            Edit Profile
          </button>
          <button id="btn-profile-new-res" class="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-xs transition-all cursor-pointer">
            New Reservation
          </button>
          
          <div class="relative">
            <button id="btn-profile-more" class="p-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all cursor-pointer flex items-center">
              <span>More</span>
              <span class="material-symbols-outlined text-[16px]">arrow_drop_down</span>
            </button>
            <div id="menu-profile-more" class="hidden absolute right-0 mt-1 w-48 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant py-1 z-30 text-xs">
              <button id="btn-menu-merge" class="w-full text-left px-3 py-2 hover:bg-surface-container flex items-center gap-2 cursor-pointer">
                <span class="material-symbols-outlined text-[16px]">merge</span>
                <span>Merge Guest Profiles</span>
              </button>
              <button id="btn-menu-export" class="w-full text-left px-3 py-2 hover:bg-surface-container flex items-center gap-2 cursor-pointer">
                <span class="material-symbols-outlined text-[16px]">download</span>
                <span>Export Profile (GDPR)</span>
              </button>
              <button id="btn-menu-reg-card" class="w-full text-left px-3 py-2 hover:bg-surface-container flex items-center gap-2 cursor-pointer">
                <span class="material-symbols-outlined text-[16px]">print</span>
                <span>Print Registration Card</span>
              </button>
            </div>
          </div>

          <button id="btn-close-guest-drawer" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer ml-1" title="Close">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      </div>

      <!-- Drawer Scrollable Content -->
      <div class="p-6 overflow-y-auto flex-1 space-y-6 text-xs custom-scrollbar">

        <!-- 1. PROFILE OVERVIEW (Contact & Guest Info with Role-Based Privacy) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Contact Info -->
          <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-2.5 shadow-xs">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono block pb-1 border-b border-outline-variant/40">
              CONTACT INFORMATION
            </span>
            <div class="space-y-2 pt-1">
              <div>
                <span class="text-[10px] text-on-surface-variant block font-data-mono">Phone</span>
                <span class="font-bold text-primary text-sm">${g.phone}</span>
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
                <span class="text-[10px] text-on-surface-variant block font-data-mono">Preferred Language</span>
                <span class="font-semibold text-primary">${g.preferredLanguage}</span>
              </div>
            </div>
          </div>

          <!-- Guest Intelligence -->
          <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-2.5 shadow-xs">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono block pb-1 border-b border-outline-variant/40">
              GUEST INFORMATION
            </span>
            <div class="space-y-2 pt-1">
              <div>
                <span class="text-[10px] text-on-surface-variant block font-data-mono">Guest Since</span>
                <span class="font-bold text-primary">${g.guestSince}</span>
              </div>
              <div>
                <span class="text-[10px] text-on-surface-variant block font-data-mono">VIP Status</span>
                <span class="font-bold text-amber-900">${g.vipTier || 'Standard'}</span>
              </div>
              <div>
                <span class="text-[10px] text-on-surface-variant block font-data-mono">Loyalty Level</span>
                <span class="font-bold text-primary">${g.loyaltyLevel} (${g.loyaltyPoints.toLocaleString('en-IN')} pts)</span>
              </div>
              <div>
                <span class="text-[10px] text-on-surface-variant block font-data-mono">Lifetime Total Spend</span>
                <span class="font-bold font-data-mono text-primary">₹${g.lifetimeSpend.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. CURRENT STAY -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-3 shadow-xs">
          <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">CURRENT STAY</span>
            ${
              isInHouse
                ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span>🟢 IN-HOUSE</span>
                  </span>`
                : `<span class="text-xs text-on-surface-variant font-medium">NO CURRENT STAY</span>`
            }
          </div>

          ${
            isInHouse
              ? `
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div>
                <span class="text-[10px] text-on-surface-variant block font-data-mono">Room</span>
                <strong class="text-sm text-primary">Room ${g.currentStay.roomNumber}</strong>
                <span class="text-[11px] text-on-surface-variant block">${g.currentStay.roomType}</span>
              </div>
              <div>
                <span class="text-[10px] text-on-surface-variant block font-data-mono">Stay Dates</span>
                <strong class="text-primary">${g.currentStay.stayDates}</strong>
                <span class="text-[11px] text-on-surface-variant block">${g.currentStay.adults} Adults</span>
              </div>
              <div>
                <span class="text-[10px] text-on-surface-variant block font-data-mono">Folio Total</span>
                <strong class="text-primary font-data-mono">₹${g.currentStay.totalFolio.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span class="text-[10px] text-on-surface-variant block font-data-mono">Balance</span>
                <strong class="text-emerald-800 font-data-mono">₹${g.currentStay.balance.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div class="flex gap-2 pt-2 border-t border-outline-variant/40">
              <button id="btn-profile-view-stay" class="px-4 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all cursor-pointer">
                View Stay
              </button>
              <button id="btn-profile-view-folio" class="px-4 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all cursor-pointer">
                View Folio
              </button>
            </div>
          `
              : `
            <div class="flex items-center justify-between pt-1">
              <p class="text-xs text-on-surface-variant">Guest is not currently in-house.</p>
              <button id="btn-profile-empty-new-res" class="px-4 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-xs cursor-pointer">
                + New Reservation
              </button>
            </div>
          `
          }
        </div>

        <!-- 3. GUEST PREFERENCES -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-3 shadow-xs">
          <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">GUEST PREFERENCES</span>
            <button id="btn-profile-edit-prefs" class="text-xs font-bold text-primary hover:underline cursor-pointer">
              Edit Preferences
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <!-- Room Prefs -->
            <div>
              <span class="text-[10px] font-bold text-on-surface-variant uppercase font-data-mono block mb-1">ROOM</span>
              <div class="flex flex-wrap gap-1.5">
                ${g.preferences.room.map((tag) => `<span class="px-2 py-0.5 rounded bg-surface-container border border-outline-variant/60 font-semibold text-primary">✓ ${tag}</span>`).join('')}
              </div>
            </div>

            <!-- Dining Prefs -->
            <div>
              <span class="text-[10px] font-bold text-on-surface-variant uppercase font-data-mono block mb-1">DINING</span>
              <div class="flex flex-wrap gap-1.5">
                ${g.preferences.dining.map((tag) => `<span class="px-2 py-0.5 rounded bg-surface-container border border-outline-variant/60 font-semibold text-primary">✓ ${tag}</span>`).join('')}
              </div>
            </div>

            <!-- Service Prefs -->
            <div>
              <span class="text-[10px] font-bold text-on-surface-variant uppercase font-data-mono block mb-1">SERVICE</span>
              <div class="flex flex-wrap gap-1.5">
                ${g.preferences.service.map((tag) => `<span class="px-2 py-0.5 rounded bg-surface-container border border-outline-variant/60 font-semibold text-primary">✓ ${tag}</span>`).join('')}
              </div>
            </div>

            <!-- Communication Prefs -->
            <div>
              <span class="text-[10px] font-bold text-on-surface-variant uppercase font-data-mono block mb-1">COMMUNICATION</span>
              <div class="flex flex-wrap gap-1.5">
                ${g.preferences.communication.map((tag) => `<span class="px-2 py-0.5 rounded bg-surface-container border border-outline-variant/60 font-semibold text-primary">✓ ${tag}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- 4. STAY HISTORY (Completed Past Stays) -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-3 shadow-xs">
          <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">STAY HISTORY</span>
            <span class="text-xs font-bold text-primary font-data-mono">${g.stayHistory.length} Previous Stays</span>
          </div>

          ${
            g.stayHistory.length > 0
              ? `
            <div class="space-y-2">
              ${g.stayHistory
                .map(
                  (stay) => `
                <div class="p-3 rounded-xl border border-outline-variant bg-surface-container/30 hover:bg-surface-container flex items-center justify-between cursor-pointer transition-colors">
                  <div>
                    <div class="font-bold text-primary text-xs">${stay.date}</div>
                    <div class="text-[11px] text-on-surface-variant font-data-mono">Room ${stay.roomNumber} (${stay.roomType}) • ${stay.nights} nights</div>
                  </div>
                  <div class="text-right">
                    <div class="font-black text-primary font-data-mono text-xs">₹${stay.spend.toLocaleString('en-IN')}</div>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">${stay.status}</span>
                  </div>
                </div>
              `
                )
                .join('')}
            </div>
          `
              : `<p class="text-xs text-on-surface-variant">No previous stays found.</p>`
          }
        </div>

        <!-- 5. RESERVATION HISTORY (Conceptually Separate) -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-3 shadow-xs">
          <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">RESERVATION HISTORY</span>
            <span class="text-xs font-bold text-primary font-data-mono">${g.reservationHistory.length} Bookings</span>
          </div>

          <div class="space-y-1.5">
            ${g.reservationHistory
              .map(
                (res) => `
              <div class="flex items-center justify-between p-2.5 rounded-lg border border-outline-variant bg-surface-container/20 text-xs">
                <div>
                  <span class="font-bold font-data-mono text-primary">${res.resNumber}</span>
                  <span class="text-on-surface-variant ml-2">${res.stayDates}</span>
                  <span class="text-[10px] text-on-surface-variant ml-2 font-data-mono">(${res.roomType})</span>
                </div>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${
                  res.status === 'Completed'
                    ? 'bg-emerald-100 text-emerald-900'
                    : res.status === 'In-House'
                    ? 'bg-blue-100 text-blue-900'
                    : res.status === 'Upcoming'
                    ? 'bg-purple-100 text-purple-900'
                    : 'bg-rose-100 text-rose-900'
                }">
                  ${res.status}
                </span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <!-- 6. COMMUNICATION TIMELINE -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-3 shadow-xs">
          <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">COMMUNICATION HISTORY</span>
            <button id="btn-send-communication" class="text-xs font-bold text-primary hover:underline cursor-pointer">
              + Send Message
            </button>
          </div>

          <div class="space-y-2">
            ${g.communicationHistory
              .map(
                (comm) => `
              <div class="p-2.5 rounded-lg border border-outline-variant bg-surface-container/20 flex items-start gap-2.5">
                <span class="material-symbols-outlined text-[16px] text-primary mt-0.5">
                  ${comm.channel === 'WhatsApp' ? 'chat' : 'mail'}
                </span>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-primary text-xs">${comm.channel}</span>
                    <span class="text-[10px] text-on-surface-variant font-data-mono">${comm.date} • ${comm.time}</span>
                  </div>
                  <p class="text-xs text-on-surface mt-0.5">${comm.message}</p>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <!-- 7. GUEST REQUESTS & SERVICE COMPLAINT HISTORY -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Requests -->
          <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-2 shadow-xs">
            <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
              <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">OPERATIONAL REQUESTS</span>
              <button id="btn-add-request" class="text-[11px] font-bold text-primary hover:underline cursor-pointer">+ Add</button>
            </div>
            <div class="space-y-1.5 pt-1">
              ${g.guestRequests
                .map(
                  (req) => `
                <div class="flex items-center justify-between p-2 rounded bg-surface-container/30">
                  <div>
                    <span class="font-bold text-primary block">${req.title}</span>
                    <span class="text-[10px] text-on-surface-variant">${req.department}</span>
                  </div>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">${req.status}</span>
                </div>
              `
                )
                .join('')}
            </div>
          </div>

          <!-- Service / Complaint History -->
          <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-2 shadow-xs">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono block pb-1 border-b border-outline-variant/40">
              SERVICE / COMPLAINT HISTORY
            </span>
            <div class="space-y-1.5 pt-1">
              ${
                g.serviceHistory.length > 0
                  ? g.serviceHistory
                      .map(
                        (srv) => `
                  <div class="p-2.5 rounded bg-rose-50/50 border border-rose-200">
                    <div class="flex justify-between items-center">
                      <span class="font-bold text-rose-900 text-xs">${srv.issue}</span>
                      <span class="text-[10px] text-on-surface-variant font-data-mono">${srv.date}</span>
                    </div>
                    <div class="text-[11px] text-rose-950 mt-0.5">Resolution: ${srv.resolution}</div>
                  </div>
                `
                      )
                      .join('')
                  : `<p class="text-xs text-on-surface-variant">✓ No negative service incidents recorded.</p>`
              }
            </div>
          </div>
        </div>

        <!-- 8. DOCUMENTS & VERIFICATION -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-3 shadow-xs">
          <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">DOCUMENTS & COMPLIANCE</span>
            <button id="btn-profile-add-doc" class="text-xs font-bold text-primary hover:underline cursor-pointer">
              + Add Document
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            ${g.documents
              .map(
                (doc) => `
              <div class="p-3 rounded-xl border border-outline-variant bg-surface-container/30 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-primary text-xs">${doc.type}</span>
                  <span class="text-emerald-800 text-[11px] font-bold">✓ Verified</span>
                </div>
                <div class="font-data-mono text-[11px] text-on-surface">${doc.number}</div>
                <div class="text-[10px] text-on-surface-variant font-data-mono">Exp: ${doc.expiry}</div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <!-- 9. PROFILE COMPLETENESS & AUDIT LOG -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Completeness -->
          <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-2.5 shadow-xs">
            <div class="flex items-center justify-between pb-1 border-b border-outline-variant/40">
              <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">PROFILE COMPLETENESS</span>
              <span class="font-bold font-data-mono text-primary">${g.completeness}%</span>
            </div>
            <div class="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden">
              <div class="h-full bg-emerald-600 rounded-full" style="width: ${g.completeness}%"></div>
            </div>
            ${
              g.missingFields.length > 0
                ? `
              <div class="text-[11px] text-on-surface-variant">
                Missing: <strong class="text-primary">${g.missingFields.join(', ')}</strong>
              </div>
              <button id="btn-profile-complete-now" class="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-xs cursor-pointer">
                Complete Profile
              </button>
            `
                : `<p class="text-xs text-emerald-800 font-semibold">✓ Profile is 100% complete.</p>`
            }
          </div>

          <!-- Audit Information -->
          <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-2 shadow-xs">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono block pb-1 border-b border-outline-variant/40">
              AUDIT TRAIL
            </span>
            <div class="space-y-1 text-xs pt-1">
              <div><span class="text-on-surface-variant">Last Changed:</span> <strong>${g.auditLog.lastChanged}</strong></div>
              <div><span class="text-on-surface-variant font-data-mono">Date:</span> <span class="font-data-mono">${g.auditLog.changedDate}</span></div>
              <div><span class="text-on-surface-variant">Changed by:</span> <strong>${g.auditLog.changedBy}</strong></div>
            </div>
          </div>
        </div>

        <!-- 10. CHRONOLOGICAL ACTIVITY TIMELINE -->
        <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/70 space-y-3 shadow-xs">
          <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono block pb-1 border-b border-outline-variant/40">
            CHRONOLOGICAL ACTIVITY TIMELINE
          </span>
          <div class="relative pl-4 space-y-3.5 border-l-2 border-outline-variant/60 ml-1">
            ${g.activityTimeline
              .map(
                (act) => `
              <div class="relative">
                <span class="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-surface-container-lowest"></span>
                <div class="text-[11px] font-bold font-data-mono text-primary">${act.time}</div>
                <div class="text-xs text-on-surface">${act.text}</div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // WORKFLOW: ADD NEW GUEST MODAL
  // ──────────────────────────────────────────────────────────────────────────
  renderAddGuestModal() {
    if (!this.activeAddGuestModal) return '';

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
          <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-primary font-data-mono">Central Directory</span>
              <h2 class="font-headline-sm text-base font-bold text-primary">Add New Guest Profile</h2>
            </div>
            <button id="btn-close-add-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-4 overflow-y-auto custom-scrollbar text-xs">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">First Name *</label>
                <input type="text" id="input-new-first-name" placeholder="e.g. Eleanor" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none font-medium" />
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Last Name *</label>
                <input type="text" id="input-new-last-name" placeholder="e.g. Vance" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none font-medium" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Phone Number *</label>
                <input type="tel" id="input-new-phone" placeholder="+91 XXXXX XXXXX" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none font-data-mono" />
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Email Address *</label>
                <input type="email" id="input-new-email" placeholder="eleanor@example.com" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Nationality</label>
                <input type="text" id="input-new-nationality" placeholder="e.g. Indian" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none" />
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Guest Type</label>
                <select id="sel-new-guest-type" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
                  <option value="FIRST-TIME">First-Time Guest</option>
                  <option value="RETURNING">Returning Guest</option>
                  <option value="VIP">⭐ VIP Guest</option>
                  <option value="CORPORATE">Corporate Account</option>
                </select>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-outline-variant/70 bg-surface-bright flex items-center justify-end gap-2.5">
            <button id="btn-cancel-add-guest" class="px-4 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all cursor-pointer">
              Cancel
            </button>
            <button id="btn-save-new-guest" class="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
              <span class="material-symbols-outlined text-[16px]">check</span>
              <span>Create Profile</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // WORKFLOW: EDIT PREFERENCES MODAL
  // ──────────────────────────────────────────────────────────────────────────
  renderEditPreferencesModal() {
    if (!this.activeEditPreferencesGuest) return '';
    const g = this.activeEditPreferencesGuest;

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-primary font-data-mono">Preferences</span>
              <h2 class="font-headline-sm text-base font-bold text-primary">Edit Preferences — ${g.name}</h2>
            </div>
            <button id="btn-close-prefs-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-3.5 text-xs">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Room Preferences (Comma Separated)</label>
              <input type="text" id="input-edit-room-prefs" value="${g.preferences.room.join(', ')}" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Dining Preferences</label>
              <input type="text" id="input-edit-dining-prefs" value="${g.preferences.dining.join(', ')}" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Service Preferences</label>
              <input type="text" id="input-edit-service-prefs" value="${g.preferences.service.join(', ')}" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none" />
            </div>
          </div>

          <div class="px-6 py-4 border-t border-outline-variant/70 bg-surface-bright flex items-center justify-end gap-2">
            <button id="btn-cancel-prefs" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-save-prefs" class="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm cursor-pointer hover:bg-primary/90 transition-all">Save Preferences</button>
          </div>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // WORKFLOW: DUPLICATE MERGE MODAL
  // ──────────────────────────────────────────────────────────────────────────
  renderMergeProfilesModal() {
    if (!this.activeMergeModalGuest) return '';
    const g = this.activeMergeModalGuest;

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-lg overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-primary font-data-mono">Integrity Management</span>
              <h2 class="font-headline-sm text-base font-bold text-primary">Merge Duplicate Guest Profiles</h2>
            </div>
            <button id="btn-close-merge-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-4 text-xs">
            <div class="p-3 bg-amber-50 rounded-xl border border-amber-300 text-amber-900 space-y-1">
              <div class="font-bold flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">warning</span>
                <span>Possible Duplicate Detected</span>
              </div>
              <p class="text-[11px] leading-relaxed">
                Found matching email <strong>${g.email}</strong> on another record. Merging will consolidate lifetime stays, folios, and documents into primary ID <strong>${g.guestId}</strong>.
              </p>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 rounded-xl border border-primary bg-primary/5">
                <span class="text-[10px] font-bold text-primary uppercase font-data-mono block mb-1">Primary Profile (Retained)</span>
                <div class="font-bold text-sm text-primary">${g.name}</div>
                <div class="text-[10px] text-on-surface-variant font-data-mono">${g.guestId}</div>
                <div class="text-xs text-on-surface mt-1">${g.totalStays} Stays • ${g.loyaltyLevel}</div>
              </div>

              <div class="p-3 rounded-xl border border-outline-variant bg-surface-container/30">
                <span class="text-[10px] font-bold text-on-surface-variant uppercase font-data-mono block mb-1">Duplicate Record (Merged)</span>
                <div class="font-bold text-sm text-primary">${g.firstName} M. ${g.lastName}</div>
                <div class="text-[10px] text-on-surface-variant font-data-mono">GST-00941</div>
                <div class="text-xs text-on-surface mt-1">1 Stay • Phone match</div>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-outline-variant/70 bg-surface-bright flex items-center justify-end gap-2.5">
            <button id="btn-cancel-merge" class="px-4 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary cursor-pointer">Cancel</button>
            <button id="btn-confirm-merge" class="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm cursor-pointer hover:bg-primary/90 transition-all">Confirm Merge</button>
          </div>
        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ADDITIONAL MODALS: Edit Profile, Add Document, Complete Profile
  // ──────────────────────────────────────────────────────────────────────────
  renderEditProfileModal() {
    if (!this.activeEditProfileGuest) return '';
    const g = this.activeEditProfileGuest;

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between">
            <h2 class="font-headline-sm text-base font-bold text-primary">Edit Profile — ${g.name}</h2>
            <button id="btn-close-edit-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <div class="p-6 space-y-3.5 text-xs">
            <div>
              <label class="block text-[10px] font-bold text-on-surface-variant mb-1 font-data-mono">Phone</label>
              <input type="text" id="input-edit-phone" value="${g.phone}" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none font-data-mono" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-on-surface-variant mb-1 font-data-mono">Email</label>
              <input type="email" id="input-edit-email" value="${g.email}" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-on-surface-variant mb-1 font-data-mono">Preferred Language</label>
              <input type="text" id="input-edit-lang" value="${g.preferredLanguage}" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none" />
            </div>
          </div>
          <div class="px-6 py-4 border-t border-outline-variant/70 bg-surface-bright flex items-center justify-end gap-2">
            <button id="btn-cancel-edit" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-save-edit" class="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm cursor-pointer hover:bg-primary/90">Save Changes</button>
          </div>
        </div>
      </div>
    `;
  }

  renderAddDocumentModal() {
    if (!this.activeAddDocumentGuest) return '';
    const g = this.activeAddDocumentGuest;

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between">
            <h2 class="font-headline-sm text-base font-bold text-primary">Add Document — ${g.name}</h2>
            <button id="btn-close-doc-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <div class="p-6 space-y-3.5 text-xs">
            <div>
              <label class="block text-[10px] font-bold text-on-surface-variant mb-1 font-data-mono">Document Type</label>
              <select id="sel-doc-type" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none">
                <option value="Passport">Passport</option>
                <option value="Driver's License">Driver's License</option>
                <option value="National ID">National ID Card</option>
                <option value="Visa">Visa Entry Stamp</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold text-on-surface-variant mb-1 font-data-mono">Document Identifier Number</label>
              <input type="text" id="input-doc-num" placeholder="e.g. Z99182746" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none font-data-mono" />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-on-surface-variant mb-1 font-data-mono">Expiry Date</label>
              <input type="date" id="input-doc-exp" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none font-data-mono" />
            </div>
          </div>
          <div class="px-6 py-4 border-t border-outline-variant/70 bg-surface-bright flex items-center justify-end gap-2">
            <button id="btn-cancel-doc" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-save-doc" class="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm cursor-pointer hover:bg-primary/90">Verify & Save</button>
          </div>
        </div>
      </div>
    `;
  }

  renderCompleteProfileModal() {
    if (!this.activeCompleteProfileGuest) return '';
    const g = this.activeCompleteProfileGuest;

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-outline-variant/70 bg-surface-bright flex items-center justify-between">
            <h2 class="font-headline-sm text-base font-bold text-primary">Complete Profile — ${g.name}</h2>
            <button id="btn-close-complete-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <div class="p-6 space-y-3.5 text-xs">
            <p class="text-on-surface-variant">Fill in the following fields to reach 100% compliance:</p>
            ${g.missingFields
              .map(
                (f, idx) => `
              <div>
                <label class="block text-[10px] font-bold text-on-surface-variant mb-1 font-data-mono">${f} *</label>
                <input type="text" id="input-missing-${idx}" placeholder="Provide ${f}..." class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none" />
              </div>
            `
              )
              .join('')}
          </div>
          <div class="px-6 py-4 border-t border-outline-variant/70 bg-surface-bright flex items-center justify-end gap-2">
            <button id="btn-cancel-complete" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-save-complete" class="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-sm cursor-pointer hover:bg-primary/90">Save Information</button>
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

    // Search Input
    const searchInput = this.container.querySelector('#input-guest-search');
    if (searchInput) {
      searchInput.oninput = (e) => {
        this.searchQuery = e.target.value;
        this.renderContent();
        const input = this.container.querySelector('#input-guest-search');
        if (input) {
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        }
      };
    }

    const btnClearSearch = this.container.querySelector('#btn-clear-guest-search');
    if (btnClearSearch) {
      btnClearSearch.onclick = () => {
        this.searchQuery = '';
        this.renderContent();
      };
    }

    const btnEmptyClear = this.container.querySelector('#btn-empty-clear-search');
    if (btnEmptyClear) {
      btnEmptyClear.onclick = () => {
        this.searchQuery = '';
        this.renderContent();
      };
    }

    // Quick Filter Chips
    this.container.querySelectorAll('.btn-guest-filter').forEach((btn) => {
      btn.onclick = () => {
        this.activeQuickFilter = btn.dataset.filter;
        this.renderContent();
      };
    });

    // Summary Cards click-to-filter
    this.container.querySelectorAll('.card-summary-metric').forEach((card) => {
      card.onclick = () => {
        this.activeQuickFilter = card.dataset.filter;
        this.renderContent();
      };
    });

    // Secondary Dropdown Filters
    const bindDropdown = (id, key) => {
      const el = this.container.querySelector(id);
      if (el) {
        el.onchange = (e) => {
          this.filters[key] = e.target.value;
          this.renderContent();
        };
      }
    };
    bindDropdown('#sel-filter-nationality', 'nationality');
    bindDropdown('#sel-filter-type', 'guestType');
    bindDropdown('#sel-filter-loyalty', 'loyaltyLevel');
    bindDropdown('#sel-filter-completeness', 'completeness');

    // Reset Filters
    const btnReset = this.container.querySelector('#btn-reset-guest-filters');
    if (btnReset) {
      btnReset.onclick = () => {
        this.searchQuery = '';
        this.activeQuickFilter = 'ALL';
        this.filters = { nationality: 'ALL', guestType: 'ALL', loyaltyLevel: 'ALL', completeness: 'ALL' };
        this.renderContent();
      };
    }

    // Table Row Click & View Button Click -> Open Full Profile Drawer
    this.container.querySelectorAll('.row-guest-click').forEach((row) => {
      row.onclick = (e) => {
        if (e.target.closest('.btn-table-view-guest')) return;
        this.openGuestDrawer(row.dataset.gid);
      };
    });

    this.container.querySelectorAll('.btn-table-view-guest').forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        this.openGuestDrawer(btn.dataset.gid);
      };
    });

    // Drawer Close
    const btnCloseDrawer = this.container.querySelector('#btn-close-guest-drawer');
    if (btnCloseDrawer) btnCloseDrawer.onclick = () => this.closeGuestDrawer();
    const backdrop = this.container.querySelector('#drawer-backdrop');
    if (backdrop) backdrop.onclick = () => this.closeGuestDrawer();

    // Add Guest Primary Button
    const btnAddGuest = this.container.querySelector('#btn-add-guest');
    if (btnAddGuest) {
      btnAddGuest.onclick = () => {
        this.activeAddGuestModal = true;
        this.renderContent();
      };
    }

    const btnImportGuests = this.container.querySelector('#btn-import-guests');
    if (btnImportGuests) {
      btnImportGuests.onclick = () => {
        Toast.show({ title: 'Import Guests', message: 'Supported formats: CSV, Excel, Opera PMS Export.', type: 'info' });
      };
    }

    // Modal: Add Guest
    const btnCloseAddModal = this.container.querySelector('#btn-close-add-modal');
    if (btnCloseAddModal) btnCloseAddModal.onclick = () => { this.activeAddGuestModal = false; this.renderContent(); };
    const btnCancelAddGuest = this.container.querySelector('#btn-cancel-add-guest');
    if (btnCancelAddGuest) btnCancelAddGuest.onclick = () => { this.activeAddGuestModal = false; this.renderContent(); };

    const btnSaveNewGuest = this.container.querySelector('#btn-save-new-guest');
    if (btnSaveNewGuest) {
      btnSaveNewGuest.onclick = () => {
        const fName = this.container.querySelector('#input-new-first-name')?.value || 'Guest';
        const lName = this.container.querySelector('#input-new-last-name')?.value || 'User';
        const phone = this.container.querySelector('#input-new-phone')?.value || '+91 99999 99999';
        const email = this.container.querySelector('#input-new-email')?.value || 'guest@example.com';
        const nat = this.container.querySelector('#input-new-nationality')?.value || 'Indian';
        const gType = this.container.querySelector('#sel-new-guest-type')?.value || 'FIRST-TIME';

        const newId = `gst-00${this.guests.length + 190}`;
        const newGuest = {
          id: newId,
          guestId: `GST-00${this.guests.length + 190}`,
          name: `${fName} ${lName}`,
          firstName: fName,
          lastName: lName,
          avatar: `${fName[0]}${lName[0]}`,
          phone,
          email,
          nationality: nat,
          preferredLanguage: 'English',
          address: 'Pending address update',
          guestSince: '2026',
          guestType: gType,
          vip: gType === 'VIP',
          vipTier: gType === 'VIP' ? 'VIP' : null,
          loyaltyLevel: 'Member',
          loyaltyPoints: 0,
          completeness: 70,
          missingFields: ['Address proof', 'Emergency contact'],
          isReturning: false,
          totalStays: 0,
          lifetimeSpend: 0,
          lastStay: 'None',
          currentStay: null,
          preferences: { room: ['Non-Smoking'], dining: [], service: [], communication: ['Email'] },
          stayHistory: [],
          reservationHistory: [],
          communicationHistory: [],
          guestRequests: [],
          serviceHistory: [],
          documents: [],
          activityTimeline: [{ time: 'Just now', text: 'Profile created manually by Front Desk.' }],
          auditLog: { lastChanged: 'Manual profile registration', changedDate: 'Today', changedBy: 'Front Desk' },
        };

        this.guests.unshift(newGuest);
        this.activeAddGuestModal = false;
        this.activeDetailGuest = newGuest;
        Toast.show({ title: 'Guest Profile Created', message: `${newGuest.name} registered with ID ${newGuest.guestId}.`, type: 'success' });
        this.renderContent();
      };
    }

    // Drawer Action Buttons
    const btnProfileEdit = this.container.querySelector('#btn-profile-edit');
    if (btnProfileEdit && this.activeDetailGuest) {
      btnProfileEdit.onclick = () => {
        this.activeEditProfileGuest = this.activeDetailGuest;
        this.renderContent();
      };
    }

    const btnProfileNewRes = this.container.querySelector('#btn-profile-new-res, #btn-profile-empty-new-res');
    if (btnProfileNewRes && this.activeDetailGuest) {
      btnProfileNewRes.onclick = () => {
        const modal = new NewBookingModal({
          onCreated: () => {
            store.notify();
            Toast.show({ title: 'Reservation Created', message: `New booking linked to ${this.activeDetailGuest.name}.`, type: 'success' });
          },
        });
        modal.init().then(() => {
          document.body.appendChild(modal.render());
        });
      };
    }

    // Drawer More dropdown toggle
    const btnMore = this.container.querySelector('#btn-profile-more');
    const menuMore = this.container.querySelector('#menu-profile-more');
    if (btnMore && menuMore) {
      btnMore.onclick = (e) => {
        e.stopPropagation();
        menuMore.classList.toggle('hidden');
      };
      document.addEventListener('click', () => {
        menuMore.classList.add('hidden');
      });
    }

    const btnMenuMerge = this.container.querySelector('#btn-menu-merge');
    if (btnMenuMerge && this.activeDetailGuest) {
      btnMenuMerge.onclick = () => {
        this.activeMergeModalGuest = this.activeDetailGuest;
        this.renderContent();
      };
    }

    const btnMenuExport = this.container.querySelector('#btn-menu-export');
    if (btnMenuExport && this.activeDetailGuest) {
      btnMenuExport.onclick = () => {
        Toast.show({ title: 'GDPR Export Ready', message: `Full encrypted profile bundle generated for ${this.activeDetailGuest.name}.`, type: 'info' });
      };
    }

    const btnMenuRegCard = this.container.querySelector('#btn-menu-reg-card');
    if (btnMenuRegCard && this.activeDetailGuest) {
      btnMenuRegCard.onclick = () => {
        window.print();
      };
    }

    // Edit Preferences
    const btnProfileEditPrefs = this.container.querySelector('#btn-profile-edit-prefs');
    if (btnProfileEditPrefs && this.activeDetailGuest) {
      btnProfileEditPrefs.onclick = () => {
        this.activeEditPreferencesGuest = this.activeDetailGuest;
        this.renderContent();
      };
    }

    const btnClosePrefs = this.container.querySelector('#btn-close-prefs-modal');
    if (btnClosePrefs) btnClosePrefs.onclick = () => { this.activeEditPreferencesGuest = null; this.renderContent(); };
    const btnCancelPrefs = this.container.querySelector('#btn-cancel-prefs');
    if (btnCancelPrefs) btnCancelPrefs.onclick = () => { this.activeEditPreferencesGuest = null; this.renderContent(); };

    const btnSavePrefs = this.container.querySelector('#btn-save-prefs');
    if (btnSavePrefs && this.activeEditPreferencesGuest) {
      btnSavePrefs.onclick = () => {
        const rVal = this.container.querySelector('#input-edit-room-prefs')?.value || '';
        const dVal = this.container.querySelector('#input-edit-dining-prefs')?.value || '';
        const sVal = this.container.querySelector('#input-edit-service-prefs')?.value || '';

        this.activeEditPreferencesGuest.preferences.room = rVal.split(',').map((s) => s.trim()).filter(Boolean);
        this.activeEditPreferencesGuest.preferences.dining = dVal.split(',').map((s) => s.trim()).filter(Boolean);
        this.activeEditPreferencesGuest.preferences.service = sVal.split(',').map((s) => s.trim()).filter(Boolean);

        this.activeEditPreferencesGuest = null;
        Toast.show({ title: 'Preferences Saved', message: 'Guest preference tags updated successfully.', type: 'success' });
        this.renderContent();
      };
    }

    // Merge Duplicate Confirmation
    const btnCloseMerge = this.container.querySelector('#btn-close-merge-modal');
    if (btnCloseMerge) btnCloseMerge.onclick = () => { this.activeMergeModalGuest = null; this.renderContent(); };
    const btnCancelMerge = this.container.querySelector('#btn-cancel-merge');
    if (btnCancelMerge) btnCancelMerge.onclick = () => { this.activeMergeModalGuest = null; this.renderContent(); };

    const btnConfirmMerge = this.container.querySelector('#btn-confirm-merge');
    if (btnConfirmMerge && this.activeMergeModalGuest) {
      btnConfirmMerge.onclick = () => {
        const g = this.activeMergeModalGuest;
        g.totalStays += 1;
        g.activityTimeline.unshift({
          time: 'Just now',
          text: `Merged duplicate record GST-00941 into primary profile ${g.guestId}.`,
        });
        g.auditLog = {
          lastChanged: 'Duplicate Profile Merged (GST-00941)',
          changedDate: 'Just now',
          changedBy: 'Front Desk Duty Supervisor',
        };
        this.activeMergeModalGuest = null;
        Toast.show({ title: 'Profiles Merged', message: `Historical stays consolidated into ${g.guestId}.`, type: 'success' });
        this.renderContent();
      };
    }

    // Add Document
    const btnProfileAddDoc = this.container.querySelector('#btn-profile-add-doc');
    if (btnProfileAddDoc && this.activeDetailGuest) {
      btnProfileAddDoc.onclick = () => {
        this.activeAddDocumentGuest = this.activeDetailGuest;
        this.renderContent();
      };
    }

    const btnCloseDoc = this.container.querySelector('#btn-close-doc-modal');
    if (btnCloseDoc) btnCloseDoc.onclick = () => { this.activeAddDocumentGuest = null; this.renderContent(); };
    const btnCancelDoc = this.container.querySelector('#btn-cancel-doc');
    if (btnCancelDoc) btnCancelDoc.onclick = () => { this.activeAddDocumentGuest = null; this.renderContent(); };

    const btnSaveDoc = this.container.querySelector('#btn-save-doc');
    if (btnSaveDoc && this.activeAddDocumentGuest) {
      btnSaveDoc.onclick = () => {
        const dType = this.container.querySelector('#sel-doc-type')?.value || 'Passport';
        const dNum = this.container.querySelector('#input-doc-num')?.value || 'DOC-9921';
        const dExp = this.container.querySelector('#input-doc-exp')?.value || '2030-01-01';

        this.activeAddDocumentGuest.documents.push({
          type: dType,
          status: 'Verified',
          number: dNum,
          expiry: dExp,
        });

        this.activeAddDocumentGuest = null;
        Toast.show({ title: 'Document Verified', message: `${dType} added to guest profile.`, type: 'success' });
        this.renderContent();
      };
    }

    // Complete Profile
    const btnProfileCompleteNow = this.container.querySelector('#btn-profile-complete-now');
    if (btnProfileCompleteNow && this.activeDetailGuest) {
      btnProfileCompleteNow.onclick = () => {
        this.activeCompleteProfileGuest = this.activeDetailGuest;
        this.renderContent();
      };
    }

    const btnCloseComplete = this.container.querySelector('#btn-close-complete-modal');
    if (btnCloseComplete) btnCloseComplete.onclick = () => { this.activeCompleteProfileGuest = null; this.renderContent(); };
    const btnCancelComplete = this.container.querySelector('#btn-cancel-complete');
    if (btnCancelComplete) btnCancelComplete.onclick = () => { this.activeCompleteProfileGuest = null; this.renderContent(); };

    const btnSaveComplete = this.container.querySelector('#btn-save-complete');
    if (btnSaveComplete && this.activeCompleteProfileGuest) {
      btnSaveComplete.onclick = () => {
        this.activeCompleteProfileGuest.completeness = 100;
        this.activeCompleteProfileGuest.missingFields = [];
        this.activeCompleteProfileGuest.activityTimeline.unshift({
          time: 'Just now',
          text: 'Profile completeness reached 100%. Mandatory fields verified.',
        });
        this.activeCompleteProfileGuest = null;
        Toast.show({ title: 'Profile 100% Complete', message: 'All compliance fields verified.', type: 'success' });
        this.renderContent();
      };
    }

    // Edit Profile Modal
    const btnCloseEditModal = this.container.querySelector('#btn-close-edit-modal');
    if (btnCloseEditModal) btnCloseEditModal.onclick = () => { this.activeEditProfileGuest = null; this.renderContent(); };
    const btnCancelEdit = this.container.querySelector('#btn-cancel-edit');
    if (btnCancelEdit) btnCancelEdit.onclick = () => { this.activeEditProfileGuest = null; this.renderContent(); };

    const btnSaveEdit = this.container.querySelector('#btn-save-edit');
    if (btnSaveEdit && this.activeEditProfileGuest) {
      btnSaveEdit.onclick = () => {
        const ph = this.container.querySelector('#input-edit-phone')?.value || this.activeEditProfileGuest.phone;
        const em = this.container.querySelector('#input-edit-email')?.value || this.activeEditProfileGuest.email;
        const lang = this.container.querySelector('#input-edit-lang')?.value || this.activeEditProfileGuest.preferredLanguage;

        this.activeEditProfileGuest.phone = ph;
        this.activeEditProfileGuest.email = em;
        this.activeEditProfileGuest.preferredLanguage = lang;
        this.activeEditProfileGuest.auditLog = {
          lastChanged: 'Contact Details',
          changedDate: 'Just now',
          changedBy: 'Front Desk T01',
        };

        this.activeEditProfileGuest = null;
        Toast.show({ title: 'Profile Saved', message: 'Guest contact info updated.', type: 'success' });
        this.renderContent();
      };
    }

    // Communication quick send
    const btnSendComm = this.container.querySelector('#btn-send-communication');
    if (btnSendComm && this.activeDetailGuest) {
      btnSendComm.onclick = () => {
        this.activeDetailGuest.communicationHistory.unshift({
          date: 'Today',
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          channel: 'WhatsApp',
          message: 'Welcome message and digital key instructions dispatched.',
        });
        Toast.show({ title: 'Message Sent', message: `WhatsApp sent to ${this.activeDetailGuest.phone}.`, type: 'success' });
        this.renderContent();
      };
    }

    // Add Request
    const btnAddRequest = this.container.querySelector('#btn-add-request');
    if (btnAddRequest && this.activeDetailGuest) {
      btnAddRequest.onclick = () => {
        this.activeDetailGuest.guestRequests.unshift({
          title: 'Extra Room Amenities Tray',
          status: 'In Progress',
          department: 'Housekeeping',
        });
        Toast.show({ title: 'Request Created', message: 'Dispatched to Housekeeping.', type: 'success' });
        this.renderContent();
      };
    }
  }

  openGuestDrawer(gid) {
    this.activeDetailGuest = this.guests.find((g) => g.id === gid) || this.guests[0];
    this.renderContent();
  }

  closeGuestDrawer() {
    this.activeDetailGuest = null;
    this.renderContent();
  }
}
