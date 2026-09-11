// ==========================================================================
// VOLVITECH HOSPITALITY OS — GUEST FOLIOS FINANCIAL WORKSPACE
// Central Financial Record for Charges, Payments, Taxes, Adjustments & Checkout
// ==========================================================================

import { store } from '../../state/store.js';
import { Toast } from '../../components/Toast.js';
import { reservationsClient } from '../../api/reservationsClient.js';

export class GuestFolioView {
  constructor() {
    this.container = null;
    this.isLoading = false;
    this.searchQuery = '';
    this.activeQuickFilter = 'ALL'; // 'ALL', 'OPEN', 'SETTLED', 'PARTIAL', 'OUTSTANDING', 'OVERPAID', 'ARRIVALS_TODAY', 'DEPARTURES_TODAY'

    // Secondary Dropdown Filters
    this.filters = {
      roomFloor: 'ALL',
      paymentStatus: 'ALL',
      folioStatus: 'ALL',
      chargeSource: 'ALL',
      dateRange: 'ALL',
    };

    // Active Selection & Ledger Filter
    this.selectedFolioId = null; // When set, displays dedicated full-detail folio workspace
    this.selectedLedgerFilter = 'ALL'; // 'ALL', 'ROOM', 'FB', 'ROOM_SERVICE', 'MINIBAR', 'LAUNDRY', 'SPA', 'TRANSPORT', 'TAX', 'PAYMENTS', 'ADJUSTMENTS'

    // Modal States
    this.activeAddChargeModal = false;
    this.activeAddPaymentModal = false;
    this.activeSplitModal = false;
    this.activeTransferModal = null; // charge object to transfer
    this.activeAdjustmentModal = null; // charge object to adjust
    this.activeTransactionDetail = null; // transaction object to inspect
    this.activeNewFolioModal = false;
    this.activeSettleCheckoutModal = false;

    // Database: Rich, Connected Hotel Folios
    this.folios = this.generateInitialFolios();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // INITIAL FOLIO DATA (Cross-connected to Sarah Mitchell GST-00182, etc.)
  // ──────────────────────────────────────────────────────────────────────────
  generateInitialFolios() {
    return [
      {
        id: 'fol-10482',
        folioNumber: 'FOL-10482',
        reservationNumber: 'RES-10482',
        guestId: 'GST-00182',
        guestName: 'Sarah Mitchell',
        firstName: 'Sarah',
        lastName: 'Mitchell',
        avatar: 'SM',
        vip: true,
        vipTier: 'VIP',
        roomNumber: '402',
        roomType: 'Deluxe King',
        floor: '4',
        stayDates: '12 Sep → 15 Sep',
        checkInDate: '12 Sep',
        checkOutDate: '15 Sep',
        adults: 2,
        children: 0,
        billingType: 'Individual / Guest Folio',
        companyAccount: 'Vanguard Holdings Ltd (Direct Bill Option)',
        status: 'OUTSTANDING', // OPEN, SETTLED, PARTIALLY PAID, OUTSTANDING, OVERPAID, VOIDED, TRANSFERRED
        paymentStatus: 'Partially Paid',
        lastActivity: '14 Sep • 8:42 PM',
        createdAt: '12 Sep 2026, 09:00 AM',
        createdBy: 'Front Desk — Agent T01',
        // Tax Summary
        taxSummary: {
          subtotal: 41800,
          cgst: 3515,
          sgst: 3515,
          totalTax: 7030,
        },
        // Transactions
        transactions: [
          {
            id: 'TXN-10482-01',
            date: '12 Sep',
            time: '09:00',
            description: 'Room Charge — Deluxe King (Night 1)',
            source: 'ROOM',
            sourceLabel: 'Room Tariff',
            debit: 12000,
            credit: 0,
            tax: 2160,
            reference: 'TAR-00182-1',
            outlet: 'Front Desk Room Billing',
            postedBy: 'System Night Audit',
            relatedOrder: 'RES-10482',
            notes: 'Nightly contracted luxury tariff',
          },
          {
            id: 'TXN-10482-02',
            date: '12 Sep',
            time: '09:10',
            description: 'GST on Accommodation (18% Integrated)',
            source: 'TAX',
            sourceLabel: 'Tax / GST',
            debit: 2160,
            credit: 0,
            tax: 0,
            reference: 'TAX-0912-402',
            outlet: 'Statutory GST Pool',
            postedBy: 'Automated Tax Engine',
            relatedOrder: 'TAR-00182-1',
            notes: 'CGST 9% + SGST 9%',
          },
          {
            id: 'TXN-10482-03',
            date: '12 Sep',
            time: '20:30',
            description: 'Restaurant — Dinner at The Grand Bistro',
            source: 'RESTAURANT',
            sourceLabel: 'POS / F&B',
            debit: 2450,
            credit: 0,
            tax: 122.5,
            reference: 'ORD-48291',
            outlet: 'The Grand Bistro (Outlet 01)',
            postedBy: 'POS — Main Restaurant (Captain Roy)',
            relatedOrder: 'TABLE-14-ORD',
            notes: 'Handcrafted Truffle Pasta & Artisanal Wine',
          },
          {
            id: 'TXN-10482-04',
            date: '12 Sep',
            time: '21:00',
            description: 'Payment — Visa Credit Card (Check-in Pre-auth Capture)',
            source: 'CARD',
            sourceLabel: 'Payment (Card)',
            debit: 0,
            credit: 10000,
            tax: 0,
            reference: 'TXN-CARD-9912',
            outlet: 'Front Desk POS Terminal 02',
            postedBy: 'Front Desk — Employee 104',
            relatedOrder: 'AUTH-VISA-9912',
            notes: 'Initial stay deposit authorization settled',
          },
          {
            id: 'TXN-10482-05',
            date: '13 Sep',
            time: '12:00',
            description: 'Room Charge — Deluxe King (Night 2)',
            source: 'ROOM',
            sourceLabel: 'Room Tariff',
            debit: 12000,
            credit: 0,
            tax: 2160,
            reference: 'TAR-00182-2',
            outlet: 'Front Desk Room Billing',
            postedBy: 'System Night Audit',
            relatedOrder: 'RES-10482',
            notes: 'Nightly contracted luxury tariff',
          },
          {
            id: 'TXN-10482-06',
            date: '13 Sep',
            time: '12:10',
            description: 'GST on Accommodation (18% Integrated)',
            source: 'TAX',
            sourceLabel: 'Tax / GST',
            debit: 2160,
            credit: 0,
            tax: 0,
            reference: 'TAX-0913-402',
            outlet: 'Statutory GST Pool',
            postedBy: 'Automated Tax Engine',
            relatedOrder: 'TAR-00182-2',
            notes: 'CGST 9% + SGST 9%',
          },
          {
            id: 'TXN-10482-07',
            date: '13 Sep',
            time: '15:45',
            description: 'Spa Oasis — 60min Swedish Tension Relief Massage',
            source: 'SPA',
            sourceLabel: 'Spa & Wellness',
            debit: 4500,
            credit: 0,
            tax: 450,
            reference: 'SPA-2104',
            outlet: 'Meridian Lotus Spa',
            postedBy: 'Spa Reception — Ananya K.',
            relatedOrder: 'APPT-SPA-8812',
            notes: 'Aromatherapy oil selection complimentary',
          },
          {
            id: 'TXN-10482-08',
            date: '13 Sep',
            time: '21:15',
            description: 'In-Room Dining — Executive Room Service Dinner',
            source: 'ROOM SERVICE',
            sourceLabel: 'Room Service',
            debit: 1850,
            credit: 0,
            tax: 92.5,
            reference: 'IRD-1029',
            outlet: 'In-Room Dining Dispatch',
            postedBy: 'Room Service Server T02',
            relatedOrder: 'KITCHEN-TICKET-994',
            notes: 'Delivered to Room 402',
          },
          {
            id: 'TXN-10482-09',
            date: '14 Sep',
            time: '08:30',
            description: 'Executive Dry Cleaning & Valet Garment Pressing',
            source: 'LAUNDRY',
            sourceLabel: 'Laundry',
            debit: 1400,
            credit: 0,
            tax: 140,
            reference: 'LND-8819',
            outlet: 'Housekeeping & Valet Pressing',
            postedBy: 'Housekeeping Desk — Sunita M.',
            relatedOrder: 'TICKET-LND-402',
            notes: '3 Business Suits pressed & hung',
          },
          {
            id: 'TXN-10482-10',
            date: '14 Sep',
            time: '18:20',
            description: 'Payment — UPI Payment (HDFC Merchant Portal)',
            source: 'UPI',
            sourceLabel: 'Payment (UPI)',
            debit: 0,
            credit: 10000,
            tax: 0,
            reference: 'UPI-882190',
            outlet: 'Dynamic UPI QR Terminal',
            postedBy: 'Front Desk — Employee 104',
            relatedOrder: 'PAY-UPI-00182-B',
            notes: 'Confirmed on bank settlement dashboard',
          },
          {
            id: 'TXN-10482-11',
            date: '14 Sep',
            time: '20:00',
            description: 'Minibar Refreshment — Imported Sparkling & Snacks',
            source: 'MINIBAR',
            sourceLabel: 'Minibar',
            debit: 890,
            credit: 0,
            tax: 89,
            reference: 'MNB-402',
            outlet: 'Floor 4 Minibar Attendant',
            postedBy: 'Housekeeping — Attendant 08',
            relatedOrder: 'AUDIT-BAR-402',
            notes: 'Daily replenishment audit post-inspection',
          },
          {
            id: 'TXN-10482-12',
            date: '14 Sep',
            time: '20:42',
            description: 'Restaurant — Dinner & Dessert at The Grand Bistro',
            source: 'RESTAURANT',
            sourceLabel: 'POS / F&B',
            debit: 2450,
            credit: 0,
            tax: 122.5,
            reference: 'ORD-48291',
            outlet: 'The Grand Bistro',
            postedBy: 'POS — Main Restaurant',
            relatedOrder: 'ORD-48291',
            notes: 'Chef special gourmet dessert paired',
          },
          {
            id: 'TXN-10482-13',
            date: '14 Sep',
            time: '21:30',
            description: 'Payment — Master Corporate Amex Card',
            source: 'CARD',
            sourceLabel: 'Payment (Card)',
            debit: 0,
            credit: 20000,
            tax: 0,
            reference: 'TXN-AMEX-4412',
            outlet: 'Front Desk POS Terminal 01',
            postedBy: 'Front Desk — Employee 104',
            relatedOrder: 'SETTLE-CARD-02',
            notes: 'Interim folio settlement payment',
          },
          {
            id: 'TXN-10482-14',
            date: '14 Sep',
            time: '23:59',
            description: 'Room Charge — Deluxe King (Night 3 Tariff & Tax)',
            source: 'ROOM',
            sourceLabel: 'Room Tariff',
            debit: 6970,
            credit: 0,
            tax: 1063.2,
            reference: 'TAR-00182-3',
            outlet: 'Front Desk Room Billing',
            postedBy: 'System Night Audit',
            relatedOrder: 'RES-10482',
            notes: 'Contracted corporate flex rate with tax inclusive',
          },
        ],
        // Chronological Folio Activity Timeline
        activityTimeline: [
          { time: '14 Sep • 9:30 PM', text: 'Payment of ₹20,000 recorded via Amex (Ref: TXN-AMEX-4412)', user: 'Front Desk — Emp 104' },
          { time: '14 Sep • 8:42 PM', text: 'Restaurant charge ₹2,450 posted from Main Bistro (Order ORD-48291)', user: 'POS Terminal 01' },
          { time: '14 Sep • 8:00 PM', text: 'Minibar replenishment ₹890 posted post-inspection', user: 'Housekeeping Desk' },
          { time: '14 Sep • 6:20 PM', text: 'Payment of ₹10,000 recorded via UPI (Ref: UPI-882190)', user: 'Front Desk — Emp 104' },
          { time: '14 Sep • 8:30 AM', text: 'Dry cleaning charge ₹1,400 posted (Ref: LND-8819)', user: 'Housekeeping Desk' },
          { time: '13 Sep • 9:15 PM', text: 'Room service dinner ₹1,850 posted (Ref: IRD-1029)', user: 'In-Room Dining' },
          { time: '13 Sep • 3:45 PM', text: 'Spa massage charge ₹4,500 posted (Ref: SPA-2104)', user: 'Lotus Spa Reception' },
          { time: '13 Sep • 12:00 PM', text: 'Room charge ₹12,000 posted for Night 2', user: 'System Night Audit' },
          { time: '12 Sep • 9:00 PM', text: 'Payment of ₹10,000 recorded via Visa Card', user: 'Front Desk — Emp 104' },
          { time: '12 Sep • 9:00 AM', text: 'Folio FOL-10482 opened on check-in for Sarah Mitchell', user: 'Front Desk Desk T01' },
        ],
      },
      {
        id: 'fol-10483',
        folioNumber: 'FOL-10483',
        reservationNumber: 'RES-10483',
        guestId: 'GST-00183',
        guestName: 'John Smith',
        firstName: 'John',
        lastName: 'Smith',
        avatar: 'JS',
        vip: false,
        vipTier: null,
        roomNumber: '508',
        roomType: 'Deluxe King',
        floor: '5',
        stayDates: '12 Sep → 16 Sep',
        checkInDate: '12 Sep',
        checkOutDate: '16 Sep',
        adults: 1,
        children: 0,
        billingType: 'Corporate Master Account',
        companyAccount: 'Smith Advisory UK Ltd',
        status: 'OUTSTANDING',
        paymentStatus: 'Partially Paid',
        lastActivity: 'Today • 09:15 AM',
        createdAt: '12 Sep 2026, 02:30 PM',
        createdBy: 'Front Desk — Agent T02',
        taxSummary: { subtotal: 28000, cgst: 2225, sgst: 2225, totalTax: 4450 },
        transactions: [
          {
            id: 'TXN-10483-01',
            date: '12 Sep',
            time: '14:30',
            description: 'Room Accommodation — Deluxe King (Night 1 & 2)',
            source: 'ROOM',
            sourceLabel: 'Room Tariff',
            debit: 26000,
            credit: 0,
            tax: 4680,
            reference: 'TAR-508-01',
            outlet: 'Front Desk',
            postedBy: 'System Night Audit',
            relatedOrder: 'RES-10483',
            notes: 'Corporate guaranteed tariff',
          },
          {
            id: 'TXN-10483-02',
            date: '13 Sep',
            time: '13:00',
            description: 'Business Center — Executive Meeting Room & Video Link',
            source: 'BANQUET',
            sourceLabel: 'Banquets / Events',
            debit: 6450,
            credit: 0,
            tax: 1161,
            reference: 'BC-8812',
            outlet: 'Executive Business Center',
            postedBy: 'Concierge Desk',
            relatedOrder: 'CONF-ROOM-B',
            notes: 'High speed fiber & AV equipment',
          },
          {
            id: 'TXN-10483-03',
            date: '13 Sep',
            time: '15:00',
            description: 'Payment — Corporate Wire Transfer Pre-payment',
            source: 'CARD',
            sourceLabel: 'Bank Transfer',
            debit: 0,
            credit: 20000,
            tax: 0,
            reference: 'WIRE-UK-99120',
            outlet: 'Finance Accounts Receivable',
            postedBy: 'Finance Desk',
            relatedOrder: 'INV-8812',
            notes: 'Advance corporate direct bank credit',
          },
        ],
        activityTimeline: [
          { time: 'Today • 09:15 AM', text: 'Folio balance audited for checkout prep', user: 'Front Desk' },
          { time: '13 Sep • 3:00 PM', text: 'Corporate Wire credit ₹20,000 posted', user: 'Accounts' },
          { time: '12 Sep • 2:30 PM', text: 'Folio FOL-10483 opened on check-in', user: 'Front Desk Desk T02' },
        ],
      },
      {
        id: 'fol-10484',
        folioNumber: 'FOL-10484',
        reservationNumber: 'RES-10484',
        guestId: 'GST-00184',
        guestName: 'Aisha Al-Mansoor',
        firstName: 'Aisha',
        lastName: 'Al-Mansoor',
        avatar: 'AA',
        vip: true,
        vipTier: 'VVIP Royal',
        roomNumber: '615',
        roomType: 'Presidential Suite',
        floor: '6',
        stayDates: '11 Sep → 17 Sep',
        checkInDate: '11 Sep',
        checkOutDate: '17 Sep',
        adults: 3,
        children: 1,
        billingType: 'VVIP Direct Settlement',
        companyAccount: 'Emirates Diplomatic Mission',
        status: 'SETTLED',
        paymentStatus: 'Fully Paid',
        lastActivity: 'Yesterday • 11:30 PM',
        createdAt: '11 Sep 2026, 11:00 AM',
        createdBy: 'General Manager Desk',
        taxSummary: { subtotal: 105085, cgst: 9457, sgst: 9457, totalTax: 18915 },
        transactions: [
          {
            id: 'TXN-10484-01',
            date: '11 Sep',
            time: '11:00',
            description: 'Presidential Suite Accommodation (3 Nights)',
            source: 'ROOM',
            sourceLabel: 'Room Tariff',
            debit: 105000,
            credit: 0,
            tax: 18900,
            reference: 'TAR-615-ROYAL',
            outlet: 'Executive Suites Suite',
            postedBy: 'System',
            relatedOrder: 'RES-10484',
            notes: 'Full butler service included',
          },
          {
            id: 'TXN-10484-02',
            date: '12 Sep',
            time: '19:00',
            description: 'Private Dining Banquet — Royal Salon',
            source: 'RESTAURANT',
            sourceLabel: 'POS / F&B',
            debit: 19000,
            credit: 0,
            tax: 950,
            reference: 'BANQ-ROYAL-01',
            outlet: 'Fine Dining Salon',
            postedBy: 'Executive Chef Team',
            relatedOrder: 'BANQ-ORDER-99',
            notes: 'Exclusive 7-course tasting menu',
          },
          {
            id: 'TXN-10484-03',
            date: '13 Sep',
            time: '10:00',
            description: 'Payment — Embassy Wire Settlement in Full',
            source: 'CARD',
            sourceLabel: 'Bank Transfer',
            debit: 0,
            credit: 124000,
            tax: 0,
            reference: 'EMB-WIRE-2026-99',
            outlet: 'Finance Direct Credit',
            postedBy: 'Chief Accountant',
            relatedOrder: 'DIPLOMAT-INV-01',
            notes: 'Settled in full with diplomatic tax exemption certificate',
          },
        ],
        activityTimeline: [
          { time: 'Yesterday • 11:30 PM', text: 'Folio verified zero balance with zero outstanding', user: 'Night Audit' },
          { time: '13 Sep • 10:00 AM', text: 'Settlement wire ₹1,24,000 received and reconciled', user: 'Finance' },
        ],
      },
      {
        id: 'fol-10485',
        folioNumber: 'FOL-10485',
        reservationNumber: 'RES-10485',
        guestId: 'GST-00185',
        guestName: 'Vikram Singhania',
        firstName: 'Vikram',
        lastName: 'Singhania',
        avatar: 'VS',
        vip: true,
        vipTier: 'VIP',
        roomNumber: '302',
        roomType: 'Classic King',
        floor: '3',
        stayDates: '10 Sep → 14 Sep',
        checkInDate: '10 Sep',
        checkOutDate: '14 Sep',
        adults: 2,
        children: 0,
        billingType: 'Individual Folio',
        companyAccount: 'Singhania Capital Advisors',
        status: 'PARTIALLY PAID',
        paymentStatus: 'Partially Paid',
        lastActivity: 'Today • 08:30 AM',
        createdAt: '10 Sep 2026, 04:00 PM',
        createdBy: 'Front Desk',
        taxSummary: { subtotal: 55000, cgst: 4600, sgst: 4600, totalTax: 9200 },
        transactions: [
          {
            id: 'TXN-10485-01',
            date: '10 Sep',
            time: '16:00',
            description: 'Room Accommodation — Classic King (4 Nights)',
            source: 'ROOM',
            sourceLabel: 'Room Tariff',
            debit: 52000,
            credit: 0,
            tax: 9360,
            reference: 'TAR-302-01',
            outlet: 'Front Desk',
            postedBy: 'System',
            relatedOrder: 'RES-10485',
            notes: 'Contracted room tariff',
          },
          {
            id: 'TXN-10485-02',
            date: '11 Sep',
            time: '21:00',
            description: 'Airport Limousine Chauffeur Service (Mercedes S-Class)',
            source: 'TRANSPORT',
            sourceLabel: 'Transport',
            debit: 7200,
            credit: 0,
            tax: 1296,
            reference: 'LIMO-0911',
            outlet: 'Concierge Limousine Desk',
            postedBy: 'Concierge Lead — Farhan',
            relatedOrder: 'TRANS-BOM-01',
            notes: 'Roundtrip terminal transfer with VIP tarmac assist',
          },
          {
            id: 'TXN-10485-03',
            date: '12 Sep',
            time: '18:00',
            description: 'In-Room Dining — Vintage Champagne & Caviar Plate',
            source: 'ROOM SERVICE',
            sourceLabel: 'Room Service',
            debit: 5000,
            credit: 0,
            tax: 250,
            reference: 'IRD-5591',
            outlet: 'In-Room Dining',
            postedBy: 'Room Service Team',
            relatedOrder: 'IRD-9921',
            notes: 'Special request delivered chilled',
          },
          {
            id: 'TXN-10485-04',
            date: '12 Sep',
            time: '19:30',
            description: 'Payment — Personal HDFC Infinia Credit Card',
            source: 'CARD',
            sourceLabel: 'Payment (Card)',
            debit: 0,
            credit: 50000,
            tax: 0,
            reference: 'TXN-HDFC-99120',
            outlet: 'Front Desk POS',
            postedBy: 'Front Desk — Emp 102',
            relatedOrder: 'PAY-HDFC-01',
            notes: 'Interim balance clearance payment',
          },
        ],
        activityTimeline: [
          { time: 'Today • 08:30 AM', text: 'Limousine departure scheduled and verified', user: 'Concierge' },
          { time: '12 Sep • 7:30 PM', text: 'Payment of ₹50,000 recorded via Credit Card', user: 'Front Desk' },
        ],
      },
      {
        id: 'fol-10486',
        folioNumber: 'FOL-10486',
        reservationNumber: 'RES-10486',
        guestId: 'GST-00187',
        guestName: 'Elena Rostova',
        firstName: 'Elena',
        lastName: 'Rostova',
        avatar: 'ER',
        vip: false,
        vipTier: null,
        roomNumber: '501',
        roomType: 'Luxury Suite',
        floor: '5',
        stayDates: '13 Sep → 18 Sep',
        checkInDate: '13 Sep',
        checkOutDate: '18 Sep',
        adults: 2,
        children: 0,
        billingType: 'Individual Folio',
        companyAccount: 'None',
        status: 'OVERPAID',
        paymentStatus: 'Overpaid',
        lastActivity: 'Yesterday • 06:00 PM',
        createdAt: '13 Sep 2026, 03:15 PM',
        createdBy: 'Front Desk',
        taxSummary: { subtotal: 72000, cgst: 6500, sgst: 6500, totalTax: 13000 },
        transactions: [
          {
            id: 'TXN-10486-01',
            date: '13 Sep',
            time: '15:30',
            description: 'Room Accommodation — Luxury Suite (5 Nights Package)',
            source: 'ROOM',
            sourceLabel: 'Room Tariff',
            debit: 85000,
            credit: 0,
            tax: 15300,
            reference: 'TAR-501-PK',
            outlet: 'Front Desk',
            postedBy: 'System',
            relatedOrder: 'RES-10486',
            notes: 'Non-refundable advance booking rate',
          },
          {
            id: 'TXN-10486-02',
            date: '13 Sep',
            time: '16:00',
            description: 'Payment — Online Wire Advance Deposit (Excess Credit)',
            source: 'CARD',
            sourceLabel: 'Bank Wire',
            debit: 0,
            credit: 90000,
            tax: 0,
            reference: 'WIRE-DEP-9912',
            outlet: 'Payment Gateway',
            postedBy: 'Online Booking Engine',
            relatedOrder: 'WEB-DEP-88',
            notes: 'Advance deposit exceeds stay tariff by ₹5,000',
          },
        ],
        activityTimeline: [
          { time: 'Yesterday • 06:00 PM', text: 'Overpayment credit of ₹5,000 flagged for refund or incidentals', user: 'Accounts' },
        ],
      },
      {
        id: 'fol-10487',
        folioNumber: 'FOL-10487',
        reservationNumber: 'RES-10497',
        guestId: 'GST-00186',
        guestName: 'David Miller',
        firstName: 'David',
        lastName: 'Miller',
        avatar: 'DM',
        vip: false,
        vipTier: null,
        roomNumber: '310',
        roomType: 'Deluxe King',
        floor: '3',
        stayDates: '03 Sep → 07 Sep',
        checkInDate: '03 Sep',
        checkOutDate: '07 Sep',
        adults: 1,
        children: 0,
        billingType: 'Corporate Split Account',
        companyAccount: 'Bay Advisory SF Corp',
        status: 'OUTSTANDING',
        paymentStatus: 'Partially Paid',
        lastActivity: 'Today • 10:20 AM',
        createdAt: '03 Sep 2026, 02:00 PM',
        createdBy: 'Front Desk Agent T01',
        taxSummary: { subtotal: 48450, cgst: 4360, sgst: 4360, totalTax: 8721 },
        transactions: [
          {
            id: 'TXN-10487-01',
            date: '03 Sep',
            time: '14:00',
            description: 'Room Accommodation — Deluxe King (4 Nights)',
            source: 'ROOM',
            sourceLabel: 'Room Tariff',
            debit: 51567,
            credit: 0,
            tax: 9282,
            reference: 'TAR-310-01',
            outlet: 'Front Desk',
            postedBy: 'System',
            relatedOrder: 'RES-10497',
            notes: 'Corporate guaranteed rate',
          },
          {
            id: 'TXN-10487-02',
            date: '05 Sep',
            time: '20:15',
            description: 'Room Service Dinner & Minibar',
            source: 'ROOM SERVICE',
            sourceLabel: 'Room Service',
            debit: 5604,
            credit: 0,
            tax: 280,
            reference: 'IRD-310-02',
            outlet: 'Room Service',
            postedBy: 'IRD Team',
            relatedOrder: 'TICKET-IRD-310',
            notes: 'Personal incidentals',
          },
          {
            id: 'TXN-10487-03',
            date: '06 Sep',
            time: '12:00',
            description: 'Payment — Corporate Amex (Room Only Billed to Company)',
            source: 'CARD',
            sourceLabel: 'Payment (Card)',
            debit: 0,
            credit: 51567,
            tax: 0,
            reference: 'TXN-AMEX-BAY-01',
            outlet: 'Front Desk',
            postedBy: 'Front Desk — Emp 104',
            relatedOrder: 'CORP-DIRECT-01',
            notes: 'Room charges settled by corporate card. Incidentals remain outstanding.',
          },
        ],
        activityTimeline: [
          { time: 'Today • 10:20 AM', text: 'Folio split reviewed: Incidentals ₹5,604 pending guest payment at checkout', user: 'Front Desk' },
        ],
      },
      {
        id: 'fol-10488',
        folioNumber: 'FOL-10488',
        reservationNumber: 'RES-10487',
        guestId: 'GST-00188',
        guestName: 'Carlos Rodriguez',
        firstName: 'Carlos',
        lastName: 'Rodriguez',
        avatar: 'CR',
        vip: false,
        vipTier: null,
        roomNumber: '204',
        roomType: 'Classic King',
        floor: '2',
        stayDates: '06 Sep → 07 Sep',
        checkInDate: '06 Sep',
        checkOutDate: '07 Sep',
        adults: 1,
        children: 0,
        billingType: 'Direct Settlement',
        companyAccount: 'None',
        status: 'SETTLED',
        paymentStatus: 'Fully Paid',
        lastActivity: '07 Sep • 11:15 AM',
        createdAt: '06 Sep 2026, 01:00 PM',
        createdBy: 'Front Desk',
        taxSummary: { subtotal: 15678, cgst: 1411, sgst: 1411, totalTax: 2822 },
        transactions: [
          {
            id: 'TXN-10488-01',
            date: '06 Sep',
            time: '13:00',
            description: 'Room Accommodation — Classic King (1 Night)',
            source: 'ROOM',
            sourceLabel: 'Room Tariff',
            debit: 16000,
            credit: 0,
            tax: 2880,
            reference: 'TAR-204-01',
            outlet: 'Front Desk',
            postedBy: 'System',
            relatedOrder: 'RES-10487',
            notes: 'Standard single occupancy',
          },
          {
            id: 'TXN-10488-02',
            date: '06 Sep',
            time: '21:00',
            description: 'Bar & Lounge Beverages — Obsidian Lounge',
            source: 'RESTAURANT',
            sourceLabel: 'POS / F&B',
            debit: 2500,
            credit: 0,
            tax: 125,
            reference: 'POS-BAR-9912',
            outlet: 'Obsidian Bar & Lounge',
            postedBy: 'Bartender 04',
            relatedOrder: 'BAR-TAB-204',
            notes: 'Cocktails and tapas',
          },
          {
            id: 'TXN-10488-03',
            date: '07 Sep',
            time: '11:15',
            description: 'Payment — Master Credit Card Settlement in Full',
            source: 'CARD',
            sourceLabel: 'Payment (Card)',
            debit: 0,
            credit: 18500,
            tax: 0,
            reference: 'TXN-SETTLE-204',
            outlet: 'Front Desk Check-out',
            postedBy: 'Front Desk — Emp 104',
            relatedOrder: 'CHECKOUT-204',
            notes: 'Settled at departure. Keycards returned.',
          },
        ],
        activityTimeline: [
          { time: '07 Sep • 11:15 AM', text: 'Folio settled in full and guest checked out', user: 'Front Desk — Emp 104' },
        ],
      },
    ];
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FINANCIAL CALCULATIONS PER FOLIO
  // ──────────────────────────────────────────────────────────────────────────
  calculateFolioFinances(folio) {
    let totalDebits = 0;
    let totalCredits = 0;
    let totalTax = 0;

    folio.transactions.forEach((txn) => {
      totalDebits += Number(txn.debit || 0);
      totalCredits += Number(txn.credit || 0);
      totalTax += Number(txn.tax || 0);
    });

    const balance = totalDebits - totalCredits;

    return {
      totalCharges: totalDebits,
      totalPayments: totalCredits,
      balance,
      totalTax,
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SUMMARY CARDS (Exact 4 + 1 Optional metrics from Specification)
  // ──────────────────────────────────────────────────────────────────────────
  getSummaryMetrics() {
    return {
      openFolios: 82,
      outstanding: '₹4,82,450',
      dueToday: '₹1,26,800',
      settledToday: '₹8,42,300',
      unpostedPending: 12,
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FILTERING LOGIC
  // ──────────────────────────────────────────────────────────────────────────
  getFilteredFolios() {
    let list = [...this.folios];

    // Search query: guest, room, reservation or folio
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter((f) => {
        const matchGuest = f.guestName.toLowerCase().includes(q);
        const matchGuestId = f.guestId.toLowerCase().includes(q);
        const matchRoom = f.roomNumber.toLowerCase().includes(q);
        const matchFolio = f.folioNumber.toLowerCase().includes(q);
        const matchRes = f.reservationNumber.toLowerCase().includes(q);
        const matchCompany = (f.companyAccount || '').toLowerCase().includes(q);
        return matchGuest || matchGuestId || matchRoom || matchFolio || matchRes || matchCompany;
      });
    }

    // Quick filter chips
    if (this.activeQuickFilter === 'OPEN') {
      list = list.filter((f) => f.status === 'OPEN' || f.status === 'OUTSTANDING' || f.status === 'PARTIALLY PAID');
    } else if (this.activeQuickFilter === 'SETTLED') {
      list = list.filter((f) => f.status === 'SETTLED');
    } else if (this.activeQuickFilter === 'PARTIAL') {
      list = list.filter((f) => f.status === 'PARTIALLY PAID');
    } else if (this.activeQuickFilter === 'OUTSTANDING') {
      list = list.filter((f) => {
        const fin = this.calculateFolioFinances(f);
        return fin.balance > 0;
      });
    } else if (this.activeQuickFilter === 'OVERPAID') {
      list = list.filter((f) => {
        const fin = this.calculateFolioFinances(f);
        return fin.balance < 0 || f.status === 'OVERPAID';
      });
    } else if (this.activeQuickFilter === 'ARRIVALS_TODAY') {
      list = list.filter((f) => f.checkInDate.toLowerCase().includes('today') || f.checkInDate === '14 Sep');
    } else if (this.activeQuickFilter === 'DEPARTURES_TODAY') {
      list = list.filter((f) => f.checkOutDate.toLowerCase().includes('today') || f.checkOutDate === '14 Sep' || f.checkOutDate === '07 Sep');
    }

    // Secondary Dropdowns
    if (this.filters.roomFloor !== 'ALL') {
      list = list.filter((f) => f.floor === this.filters.roomFloor);
    }
    if (this.filters.folioStatus !== 'ALL') {
      list = list.filter((f) => f.status === this.filters.folioStatus);
    }
    if (this.filters.chargeSource !== 'ALL') {
      list = list.filter((f) => f.transactions.some((t) => t.source === this.filters.chargeSource));
    }

    return list;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // DATA LOADING
  // ──────────────────────────────────────────────────────────────────────────
  async loadData() {
    this.isLoading = true;
    this.renderContent();

    try {
      const res = await reservationsClient.getReservations();
      if (res && res.data && res.data.length > 0) {
        console.log('[GuestFolioView] Connected to hotel reservation billing engine:', res.data.length);
      }
    } catch (err) {
      console.warn('[GuestFolioView] Using integrated central folio ledger system.', err);
    } finally {
      this.isLoading = false;
      this.renderContent();
    }
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

    // If a folio is currently opened in full detail mode, render the Full Folio Workspace
    if (this.selectedFolioId) {
      const activeFolio = this.folios.find((f) => f.id === this.selectedFolioId) || this.folios[0];
      this.renderFolioDetailWorkspace(activeFolio);
      return;
    }

    // Otherwise render the Master Folio Directory Table
    this.renderFolioDirectoryList();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 1. MASTER FOLIO DIRECTORY LIST
  // ──────────────────────────────────────────────────────────────────────────
  renderFolioDirectoryList() {
    const metrics = this.getSummaryMetrics();
    const filteredFolios = this.getFilteredFolios();

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
            <span class="text-xs font-semibold uppercase tracking-wider text-primary font-data-mono font-bold">Guest Folios</span>
            <span class="text-on-surface-variant font-data-mono">•</span>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              <span class="material-symbols-outlined text-[14px]">account_balance_wallet</span>
              Shared Financial Ledger
            </span>
          </div>
          <h1 class="font-headline-lg text-2xl sm:text-3xl font-bold text-primary tracking-tight">Guest Folios</h1>
          <p class="text-sm text-on-surface-variant mt-0.5">Manage guest charges, payments and balances.</p>
        </div>

        <div class="flex items-center gap-3">
          <button id="btn-new-folio" class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
            <span class="material-symbols-outlined text-[18px]">add</span>
            <span>+ New Folio</span>
          </button>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- SUMMARY CARDS (Five Compact Operational Indicators) -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        
        <!-- CARD 1: OPEN FOLIOS -->
        <div class="card-folio-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'OPEN'
            ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
            : 'border-outline-variant/70 hover:border-primary/50 hover:shadow-xs'
        }" data-filter="OPEN" title="Click to view open folios">
          <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">OPEN FOLIOS</div>
          <div class="text-3xl font-black text-primary font-headline-lg tracking-tight">${metrics.openFolios}</div>
          <div class="text-xs text-on-surface-variant mt-0.5">Active billing accounts</div>
        </div>

        <!-- CARD 2: OUTSTANDING -->
        <div class="card-folio-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'OUTSTANDING'
            ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-rose-400 hover:shadow-xs'
        }" data-filter="OUTSTANDING" title="Click to view folios with balance due">
          <div class="text-[10px] font-bold uppercase tracking-wider text-rose-900 mb-1 font-data-mono flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
            OUTSTANDING
          </div>
          <div class="text-3xl font-black text-rose-800 font-headline-lg tracking-tight font-data-mono">${metrics.outstanding}</div>
          <div class="text-xs text-rose-800 mt-0.5">Balance receivable</div>
        </div>

        <!-- CARD 3: DUE TODAY -->
        <div class="card-folio-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'DEPARTURES_TODAY'
            ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-amber-400 hover:shadow-xs'
        }" data-filter="DEPARTURES_TODAY" title="Click to view folios due today">
          <div class="text-[10px] font-bold uppercase tracking-wider text-amber-900 mb-1 font-data-mono flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-amber-700">schedule</span>
            DUE TODAY
          </div>
          <div class="text-3xl font-black text-amber-800 font-headline-lg tracking-tight font-data-mono">${metrics.dueToday}</div>
          <div class="text-xs text-amber-800 mt-0.5">Departing guests folio</div>
        </div>

        <!-- CARD 4: SETTLED TODAY -->
        <div class="card-folio-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all ${
          this.activeQuickFilter === 'SETTLED'
            ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/60 shadow-xs'
            : 'border-outline-variant/70 hover:border-emerald-500/50 hover:shadow-xs'
        }" data-filter="SETTLED" title="Click to view settled accounts">
          <div class="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1 font-data-mono flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-emerald-700">check_circle</span>
            SETTLED TODAY
          </div>
          <div class="text-3xl font-black text-emerald-700 font-headline-lg tracking-tight font-data-mono">${metrics.settledToday}</div>
          <div class="text-xs text-emerald-800 mt-0.5">Collected &amp; reconciled</div>
        </div>

        <!-- CARD 5: UNPOSTED / PENDING -->
        <div class="card-folio-metric bg-surface-container-lowest p-4 rounded-2xl border cursor-pointer transition-all border-outline-variant/70 hover:border-blue-400 hover:shadow-xs" data-filter="ALL" title="View pending charges">
          <div class="text-[10px] font-bold uppercase tracking-wider text-blue-900 mb-1 font-data-mono flex items-center gap-1">
            <span class="material-symbols-outlined text-[13px] text-blue-700">pending_actions</span>
            UNPOSTED / PENDING
          </div>
          <div class="text-3xl font-black text-blue-800 font-headline-lg tracking-tight font-data-mono">${metrics.unpostedPending}</div>
          <div class="text-xs text-blue-800 mt-0.5">POS &amp; minibar batches</div>
        </div>

      </section>

      <!-- ================================================================= -->
      <!-- SEARCH & MULTI-FILTER TOOLBAR -->
      <!-- ================================================================= -->
      <section class="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/70 shadow-xs space-y-4">
        
        <!-- Large Search Bar -->
        <div class="relative">
          <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[22px]">search</span>
          <input
            type="text"
            id="input-folio-search"
            value="${this.searchQuery}"
            placeholder="Search guest, room, reservation or folio..."
            class="w-full pl-12 pr-10 py-3 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary text-sm font-semibold text-on-surface bg-surface-container-high/30 placeholder:text-on-surface-variant/80 transition-all outline-none"
          />
          ${
            this.searchQuery
              ? `<button id="btn-clear-folio-search" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary p-1 cursor-pointer">
                  <span class="material-symbols-outlined text-[18px]">close</span>
                </button>`
              : ''
          }
        </div>

        <!-- Quick Filter Chips -->
        <div class="flex flex-wrap items-center gap-2">
          ${[
            { key: 'ALL', label: 'All' },
            { key: 'OPEN', label: 'Open' },
            { key: 'SETTLED', label: 'Settled' },
            { key: 'PARTIAL', label: 'Partially Paid' },
            { key: 'OUTSTANDING', label: '🔴 Outstanding' },
            { key: 'OVERPAID', label: 'Overpaid' },
            { key: 'ARRIVALS_TODAY', label: "Today's Arrivals" },
            { key: 'DEPARTURES_TODAY', label: "Today's Departures" },
          ]
            .map(
              (f) => `
            <button
              class="btn-folio-filter px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Room / Floor</label>
            <select id="sel-filter-floor" class="w-full py-1.5 px-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
              <option value="ALL" ${this.filters.roomFloor === 'ALL' ? 'selected' : ''}>All Floors</option>
              <option value="2" ${this.filters.roomFloor === '2' ? 'selected' : ''}>Floor 2</option>
              <option value="3" ${this.filters.roomFloor === '3' ? 'selected' : ''}>Floor 3</option>
              <option value="4" ${this.filters.roomFloor === '4' ? 'selected' : ''}>Floor 4 (Executive)</option>
              <option value="5" ${this.filters.roomFloor === '5' ? 'selected' : ''}>Floor 5 (Suites)</option>
              <option value="6" ${this.filters.roomFloor === '6' ? 'selected' : ''}>Floor 6 (Penthouse / Royal)</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Folio Status</label>
            <select id="sel-filter-status" class="w-full py-1.5 px-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
              <option value="ALL" ${this.filters.folioStatus === 'ALL' ? 'selected' : ''}>All Statuses</option>
              <option value="OPEN" ${this.filters.folioStatus === 'OPEN' ? 'selected' : ''}>Open</option>
              <option value="OUTSTANDING" ${this.filters.folioStatus === 'OUTSTANDING' ? 'selected' : ''}>Outstanding</option>
              <option value="PARTIALLY PAID" ${this.filters.folioStatus === 'PARTIALLY PAID' ? 'selected' : ''}>Partially Paid</option>
              <option value="SETTLED" ${this.filters.folioStatus === 'SETTLED' ? 'selected' : ''}>Settled</option>
              <option value="OVERPAID" ${this.filters.folioStatus === 'OVERPAID' ? 'selected' : ''}>Overpaid</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Charge Source</label>
            <select id="sel-filter-source" class="w-full py-1.5 px-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
              <option value="ALL" ${this.filters.chargeSource === 'ALL' ? 'selected' : ''}>All Charge Sources</option>
              <option value="ROOM" ${this.filters.chargeSource === 'ROOM' ? 'selected' : ''}>Room Tariff</option>
              <option value="RESTAURANT" ${this.filters.chargeSource === 'RESTAURANT' ? 'selected' : ''}>POS / Restaurant</option>
              <option value="ROOM SERVICE" ${this.filters.chargeSource === 'ROOM SERVICE' ? 'selected' : ''}>Room Service</option>
              <option value="MINIBAR" ${this.filters.chargeSource === 'MINIBAR' ? 'selected' : ''}>Minibar</option>
              <option value="LAUNDRY" ${this.filters.chargeSource === 'LAUNDRY' ? 'selected' : ''}>Laundry &amp; Valet</option>
              <option value="SPA" ${this.filters.chargeSource === 'SPA' ? 'selected' : ''}>Spa &amp; Wellness</option>
              <option value="TRANSPORT" ${this.filters.chargeSource === 'TRANSPORT' ? 'selected' : ''}>Transport / Limousine</option>
              <option value="BANQUET" ${this.filters.chargeSource === 'BANQUET' ? 'selected' : ''}>Banquets &amp; Meetings</option>
              <option value="ADJUSTMENT" ${this.filters.chargeSource === 'ADJUSTMENT' ? 'selected' : ''}>Adjustments / Credits</option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Date Range</label>
            <select id="sel-filter-date" class="w-full py-1.5 px-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
              <option value="ALL">All Current Stays</option>
              <option value="TODAY">Active Today (14 Sep)</option>
              <option value="WEEK">Past 7 Days</option>
              <option value="MONTH">Month to Date (Sep 2026)</option>
            </select>
          </div>

          <div class="flex items-end justify-between gap-2 col-span-2 sm:col-span-1">
            <div class="py-1 px-1 text-xs font-bold text-primary font-data-mono">
              ${filteredFolios.length} Accounts
            </div>
            <button id="btn-reset-folio-filters" class="py-2 px-3 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary flex items-center justify-center gap-1 cursor-pointer transition-all">
              <span class="material-symbols-outlined text-[15px]">restart_alt</span>
              <span>Reset</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ================================================================= -->
      <!-- FOLIO DIRECTORY TABLE -->
      <!-- ================================================================= -->
      <section>
        ${this.renderFolioDirectoryTable(filteredFolios)}
      </section>

      <!-- New Folio Modal -->
      ${this.renderNewFolioModal()}
    `;

    this.bindDirectoryEvents();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FOLIO DIRECTORY TABLE
  // ──────────────────────────────────────────────────────────────────────────
  renderFolioDirectoryTable(folios) {
    if (folios.length === 0) {
      return `
        <div class="bg-surface-container-lowest rounded-2xl p-16 border border-outline-variant/70 text-center space-y-4 shadow-xs">
          <div class="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <span class="material-symbols-outlined text-[32px]">receipt_long</span>
          </div>
          <div>
            <h3 class="font-headline-sm text-lg font-bold text-primary">No guest folios found.</h3>
            <p class="text-xs text-on-surface-variant max-w-md mx-auto mt-1">
              Try searching by guest name, room number, reservation or folio ID.
            </p>
          </div>
          <div class="pt-2">
            <button id="btn-empty-clear-folio-search" class="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-xs hover:bg-primary/90 transition-all cursor-pointer">
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
                <th class="py-3.5 px-4">Folio</th>
                <th class="py-3.5 px-4">Guest</th>
                <th class="py-3.5 px-4">Room</th>
                <th class="py-3.5 px-4">Stay</th>
                <th class="py-3.5 px-4 text-right">Charges</th>
                <th class="py-3.5 px-4 text-right">Paid</th>
                <th class="py-3.5 px-4 text-right">Balance</th>
                <th class="py-3.5 px-4 text-center">Status</th>
                <th class="py-3.5 px-4">Last Activity</th>
                <th class="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/40 font-body">
              ${folios
                .map((f) => {
                  const fin = this.calculateFolioFinances(f);
                  const isBalanceZero = Math.abs(fin.balance) < 0.01;
                  const isOverpaid = fin.balance < -0.01;
                  const isDue = fin.balance > 0.01;

                  return `
                  <tr class="hover:bg-surface-container/30 transition-colors cursor-pointer row-folio-click" data-fid="${f.id}">
                    <!-- Folio Number -->
                    <td class="py-3.5 px-4 font-black font-data-mono text-primary text-xs">
                      ${f.folioNumber}
                    </td>

                    <!-- Guest -->
                    <td class="py-3.5 px-4">
                      <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-xl ${
                          f.vip
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-primary/10 text-primary border border-primary/20'
                        } font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                          ${f.avatar}
                        </div>
                        <div>
                          <div class="font-bold text-primary flex items-center gap-1.5 text-xs">
                            ${f.vip ? '<span class="text-amber-500">⭐</span>' : ''}
                            <span>${f.guestName}</span>
                          </div>
                          <div class="text-[10px] text-on-surface-variant font-data-mono">
                            ${f.guestId} • ${f.reservationNumber}
                          </div>
                        </div>
                      </div>
                    </td>

                    <!-- Room -->
                    <td class="py-3.5 px-4">
                      <div class="font-bold text-primary text-xs">Room ${f.roomNumber}</div>
                      <div class="text-[10px] text-on-surface-variant">${f.roomType}</div>
                    </td>

                    <!-- Stay -->
                    <td class="py-3.5 px-4 font-data-mono text-on-surface text-xs whitespace-nowrap">
                      ${f.stayDates}
                    </td>

                    <!-- Charges -->
                    <td class="py-3.5 px-4 text-right font-data-mono font-bold text-primary text-xs">
                      ₹${fin.totalCharges.toLocaleString('en-IN')}
                    </td>

                    <!-- Paid -->
                    <td class="py-3.5 px-4 text-right font-data-mono font-semibold text-emerald-800 text-xs">
                      ₹${fin.totalPayments.toLocaleString('en-IN')}
                    </td>

                    <!-- Balance (Visually Prominent, Not Color Alone) -->
                    <td class="py-3.5 px-4 text-right">
                      <div class="inline-flex flex-col items-end">
                        <span class="font-black font-data-mono text-sm ${
                          isDue ? 'text-rose-700' : isOverpaid ? 'text-blue-700' : 'text-emerald-800'
                        }">
                          ₹${Math.abs(fin.balance).toLocaleString('en-IN')}
                        </span>
                        <span class="text-[9px] font-bold uppercase tracking-wider font-data-mono ${
                          isDue ? 'text-rose-900' : isOverpaid ? 'text-blue-800' : 'text-emerald-800'
                        }">
                          ${isDue ? '● DUE' : isOverpaid ? '● OVERPAID' : '✓ SETTLED'}
                        </span>
                      </div>
                    </td>

                    <!-- Status -->
                    <td class="py-3.5 px-4 text-center">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold font-data-mono ${
                        f.status === 'SETTLED'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : f.status === 'OUTSTANDING'
                          ? 'bg-rose-100 text-rose-900 border border-rose-300'
                          : f.status === 'PARTIALLY PAID'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : f.status === 'OVERPAID'
                          ? 'bg-blue-100 text-blue-900 border border-blue-300'
                          : 'bg-surface-container text-on-surface border border-outline-variant'
                      }">
                        ${f.status}
                      </span>
                    </td>

                    <!-- Last Activity -->
                    <td class="py-3.5 px-4 font-data-mono text-on-surface-variant text-[11px]">
                      ${f.lastActivity}
                    </td>

                    <!-- Action -->
                    <td class="py-3.5 px-4 text-right">
                      <button class="btn-table-view-folio px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all cursor-pointer" data-fid="${f.id}">
                        View Folio
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
  // 2. DEDICATED FULL-DETAIL FOLIO WORKSPACE
  // ──────────────────────────────────────────────────────────────────────────
  renderFolioDetailWorkspace(folio) {
    const fin = this.calculateFolioFinances(folio);
    const isDue = fin.balance > 0.01;
    const isSettled = Math.abs(fin.balance) < 0.01;
    const isOverpaid = fin.balance < -0.01;

    // Filter transactions based on selected ledger category
    let filteredTransactions = [...folio.transactions];
    if (this.selectedLedgerFilter === 'ROOM') {
      filteredTransactions = filteredTransactions.filter((t) => t.source === 'ROOM');
    } else if (this.selectedLedgerFilter === 'FB') {
      filteredTransactions = filteredTransactions.filter((t) => t.source === 'RESTAURANT');
    } else if (this.selectedLedgerFilter === 'ROOM_SERVICE') {
      filteredTransactions = filteredTransactions.filter((t) => t.source === 'ROOM SERVICE');
    } else if (this.selectedLedgerFilter === 'MINIBAR') {
      filteredTransactions = filteredTransactions.filter((t) => t.source === 'MINIBAR');
    } else if (this.selectedLedgerFilter === 'LAUNDRY') {
      filteredTransactions = filteredTransactions.filter((t) => t.source === 'LAUNDRY');
    } else if (this.selectedLedgerFilter === 'SPA') {
      filteredTransactions = filteredTransactions.filter((t) => t.source === 'SPA');
    } else if (this.selectedLedgerFilter === 'TRANSPORT') {
      filteredTransactions = filteredTransactions.filter((t) => t.source === 'TRANSPORT');
    } else if (this.selectedLedgerFilter === 'TAX') {
      filteredTransactions = filteredTransactions.filter((t) => t.source === 'TAX');
    } else if (this.selectedLedgerFilter === 'PAYMENTS') {
      filteredTransactions = filteredTransactions.filter((t) => t.credit > 0 && t.source !== 'ADJUSTMENT');
    } else if (this.selectedLedgerFilter === 'ADJUSTMENTS') {
      filteredTransactions = filteredTransactions.filter((t) => t.source === 'ADJUSTMENT');
    }

    // Calculate running balance for filtered list
    let runningTotal = 0;
    const itemizedRows = filteredTransactions.map((t) => {
      runningTotal += (Number(t.debit) || 0) - (Number(t.credit) || 0);
      return {
        ...t,
        runningBalance: runningTotal,
      };
    });

    this.container.innerHTML = `
      <!-- ================================================================= -->
      <!-- TOP NAVIGATION BAR: Back to Directory & Guest Switcher -->
      <!-- ================================================================= -->
      <div class="flex items-center justify-between pb-3 border-b border-outline-variant/60">
        <button id="btn-back-to-directory" class="px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary flex items-center gap-1.5 cursor-pointer transition-all">
          <span class="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to All Folios</span>
        </button>

        <!-- Folio Switcher -->
        <div class="flex items-center gap-2">
          <label class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">Active Folio:</label>
          <select id="sel-switch-folio" class="py-1 px-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs font-bold text-primary outline-none cursor-pointer">
            ${this.folios.map((f) => `
              <option value="${f.id}" ${f.id === folio.id ? 'selected' : ''}>
                ${f.folioNumber} — ${f.guestName} (${f.roomNumber ? `Room ${f.roomNumber}` : 'Account'})
              </option>
            `).join('')}
          </select>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- FOLIO DETAIL WORKSPACE HEADER -->
      <!-- ================================================================= -->
      <section class="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/70 shadow-xs space-y-5">
        
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <!-- Left: Folio Identity & Guest Context -->
          <div class="flex items-start gap-4">
            <div class="w-14 h-14 rounded-2xl ${
              folio.vip ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-primary/10 text-primary border border-primary/20'
            } font-bold text-xl flex items-center justify-center shadow-xs shrink-0">
              ${folio.avatar}
            </div>

            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-data-mono font-black text-lg text-primary">${folio.folioNumber}</span>
                <span class="text-on-surface-variant">•</span>
                <h2 class="font-headline-sm text-xl font-bold text-primary">${folio.guestName}</h2>
                ${folio.vip ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">⭐ VIP</span>' : ''}
                <span class="px-2 py-0.5 rounded text-[10px] font-bold font-data-mono ${
                  folio.status === 'SETTLED' ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                }">${folio.status}</span>
              </div>

              <div class="flex items-center gap-3 text-xs text-on-surface-variant font-data-mono mt-1 flex-wrap">
                <span>Room <strong class="text-primary">${folio.roomNumber}</strong> (${folio.roomType})</span>
                <span>•</span>
                <span>Reservation: <strong class="text-primary">${folio.reservationNumber}</strong></span>
                <span>•</span>
                <span>Stay: <strong>${folio.stayDates}</strong> (${folio.adults} Adults)</span>
                <span>•</span>
                <span>Guest ID: <strong>${folio.guestId}</strong></span>
              </div>
            </div>
          </div>

          <!-- Right: Primary Operational Actions -->
          <div class="flex items-center gap-2 flex-wrap">
            <button id="btn-folio-add-charge" class="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
              <span class="material-symbols-outlined text-[16px]">add_card</span>
              <span>+ Add Charge</span>
            </button>

            <button id="btn-folio-add-payment" class="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
              <span class="material-symbols-outlined text-[16px]">payments</span>
              <span>+ Add Payment</span>
            </button>

            <button id="btn-folio-transfer" class="px-3.5 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all flex items-center gap-1.5 cursor-pointer">
              <span class="material-symbols-outlined text-[16px]">swap_horiz</span>
              <span>Transfer</span>
            </button>

            <button id="btn-folio-split" class="px-3.5 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all flex items-center gap-1.5 cursor-pointer">
              <span class="material-symbols-outlined text-[16px]">call_split</span>
              <span>Split</span>
            </button>

            <button id="btn-folio-print" class="px-3.5 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all flex items-center gap-1.5 cursor-pointer">
              <span class="material-symbols-outlined text-[16px]">print</span>
              <span>Print</span>
            </button>

            <!-- More dropdown -->
            <div class="relative">
              <button id="btn-folio-more" class="p-2.5 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all flex items-center gap-0.5 cursor-pointer">
                <span>More</span>
                <span class="material-symbols-outlined text-[16px]">arrow_drop_down</span>
              </button>
              <div id="menu-folio-more" class="hidden absolute right-0 mt-1 w-52 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant py-1 z-30 text-xs">
                <button id="btn-menu-adjustment" class="w-full text-left px-3.5 py-2 hover:bg-surface-container flex items-center gap-2 cursor-pointer text-primary">
                  <span class="material-symbols-outlined text-[16px]">tune</span>
                  <span>+ Add Adjustment</span>
                </button>
                <button id="btn-menu-void" class="w-full text-left px-3.5 py-2 hover:bg-surface-container flex items-center gap-2 cursor-pointer text-rose-700">
                  <span class="material-symbols-outlined text-[16px]">block</span>
                  <span>Void / Reverse Charge</span>
                </button>
                <button id="btn-menu-export-csv" class="w-full text-left px-3.5 py-2 hover:bg-surface-container flex items-center gap-2 cursor-pointer">
                  <span class="material-symbols-outlined text-[16px]">file_download</span>
                  <span>Export Folio CSV / XML</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Secondary Cross-Module Context Links -->
        <div class="pt-3 border-t border-outline-variant/40 flex items-center gap-4 text-xs">
          <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">Quick Navigation:</span>
          <button id="btn-nav-view-guest" class="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer">
            <span class="material-symbols-outlined text-[14px]">person</span>
            <span>View Guest (${folio.guestId})</span>
          </button>
          <span class="text-outline-variant">•</span>
          <button id="btn-nav-view-res" class="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer">
            <span class="material-symbols-outlined text-[14px]">book_online</span>
            <span>View Reservation (${folio.reservationNumber})</span>
          </button>
          <span class="text-outline-variant">•</span>
          <button id="btn-nav-view-room" class="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer">
            <span class="material-symbols-outlined text-[14px]">meeting_room</span>
            <span>View Room (${folio.roomNumber})</span>
          </button>
        </div>

      </section>

      <!-- ================================================================= -->
      <!-- PROMINENT FINANCIAL SUMMARY (Immediate Visual Prominence) -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <!-- Total Charges -->
        <div class="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/70 shadow-xs">
          <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono block mb-1">TOTAL CHARGES</span>
          <div class="text-3xl font-black font-data-mono text-primary tracking-tight">₹${fin.totalCharges.toLocaleString('en-IN')}</div>
          <span class="text-xs text-on-surface-variant block mt-1 font-data-mono">${folio.transactions.filter(t => t.debit > 0).length} Postings across outlets</span>
        </div>

        <!-- Payments -->
        <div class="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/70 shadow-xs">
          <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-900 font-data-mono block mb-1">PAYMENTS COLLECTED</span>
          <div class="text-3xl font-black font-data-mono text-emerald-700 tracking-tight">₹${fin.totalPayments.toLocaleString('en-IN')}</div>
          <span class="text-xs text-emerald-800 block mt-1 font-data-mono">${folio.transactions.filter(t => t.credit > 0 && t.source !== 'ADJUSTMENT').length} Recorded transactions</span>
        </div>

        <!-- Prominent Outstanding Balance -->
        <div class="p-5 rounded-2xl border shadow-xs relative overflow-hidden ${
          isDue
            ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-500/20'
            : isOverpaid
            ? 'bg-blue-50/70 border-blue-300'
            : 'bg-emerald-50/70 border-emerald-300'
        }">
          <span class="text-[10px] font-bold uppercase tracking-wider font-data-mono block mb-1 ${
            isDue ? 'text-rose-900' : isOverpaid ? 'text-blue-900' : 'text-emerald-900'
          }">
            OUTSTANDING BALANCE
          </span>
          <div class="text-3xl font-black font-data-mono tracking-tight ${
            isDue ? 'text-rose-800' : isOverpaid ? 'text-blue-800' : 'text-emerald-800'
          }">
            ₹${Math.abs(fin.balance).toLocaleString('en-IN')}
          </div>
          <div class="flex items-center gap-1.5 mt-1 font-bold text-xs ${
            isDue ? 'text-rose-900' : isOverpaid ? 'text-blue-900' : 'text-emerald-900'
          }">
            <span class="w-2 h-2 rounded-full ${isDue ? 'bg-rose-600 animate-pulse' : isOverpaid ? 'bg-blue-600' : 'bg-emerald-600'}"></span>
            <span>STATUS: ${isDue ? '🔴 OUTSTANDING' : isOverpaid ? '🔵 OVERPAID' : '🟢 SETTLED'}</span>
          </div>
        </div>

        <!-- Checkout Quick Connection -->
        <div class="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/70 shadow-xs flex flex-col justify-between">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono block mb-1">CHECKOUT WORKFLOW</span>
            <div class="text-xs text-on-surface">
              ${isDue ? 'Requires full balance settlement prior to room key deactivation.' : 'Folio is balanced and ready for departure.'}
            </div>
          </div>
          
          <button id="btn-quick-settle-checkout" class="w-full mt-2 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
            isDue
              ? 'bg-rose-700 hover:bg-rose-800 text-white'
              : 'bg-emerald-700 hover:bg-emerald-800 text-white'
          }">
            <span class="material-symbols-outlined text-[16px]">${isDue ? 'payments' : 'logout'}</span>
            <span>${isDue ? 'Settle Balance & Checkout' : 'Proceed to Checkout'}</span>
          </button>
        </div>

      </section>

      <!-- ================================================================= -->
      <!-- TRANSACTION LEDGER & SOURCE FILTER BAR -->
      <!-- ================================================================= -->
      <section class="bg-surface-container-lowest rounded-2xl border border-outline-variant/70 overflow-hidden shadow-xs space-y-0">
        
        <!-- Ledger Header & Category Tabs -->
        <div class="p-4 border-b border-outline-variant bg-surface-bright flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[20px]">receipt_long</span>
            <h3 class="font-headline-sm text-base font-bold text-primary">Main Folio Transaction Ledger</h3>
            <span class="text-xs text-on-surface-variant font-data-mono">(${folio.transactions.length} items)</span>
          </div>

          <div class="flex items-center gap-2">
            <button id="btn-export-statement" class="px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary transition-all flex items-center gap-1 cursor-pointer">
              <span class="material-symbols-outlined text-[15px]">description</span>
              <span>Statement</span>
            </button>
          </div>
        </div>

        <!-- Quick Charge Category Filter Chips Inside Folio -->
        <div class="p-3 border-b border-outline-variant/50 bg-surface-container-low/40 flex items-center gap-1.5 flex-wrap text-xs">
          <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono mr-1">Ledger Filter:</span>
          ${[
            { key: 'ALL', label: 'All Postings' },
            { key: 'ROOM', label: 'Room' },
            { key: 'FB', label: 'F&B / Dining' },
            { key: 'ROOM_SERVICE', label: 'Room Service' },
            { key: 'MINIBAR', label: 'Minibar' },
            { key: 'LAUNDRY', label: 'Laundry' },
            { key: 'SPA', label: 'Spa' },
            { key: 'TRANSPORT', label: 'Transport' },
            { key: 'TAX', label: 'Tax' },
            { key: 'PAYMENTS', label: 'Payments' },
            { key: 'ADJUSTMENTS', label: 'Adjustments' },
          ]
            .map(
              (cat) => `
            <button
              class="btn-ledger-filter px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                this.selectedLedgerFilter === cat.key
                  ? 'bg-primary text-on-primary shadow-xs font-bold'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/50'
              }"
              data-cat="${cat.key}"
            >
              ${cat.label}
            </button>
          `
            )
            .join('')}
        </div>

        <!-- Itemized Transaction Ledger Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-surface-bright border-b border-outline-variant text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-data-mono">
                <th class="py-3 px-4">Date / Time</th>
                <th class="py-3 px-4">Description</th>
                <th class="py-3 px-4">Source</th>
                <th class="py-3 px-4 text-right">Debit (Charge)</th>
                <th class="py-3 px-4 text-right">Credit (Payment)</th>
                <th class="py-3 px-4 text-right">Tax</th>
                <th class="py-3 px-4 text-right">Running Balance</th>
                <th class="py-3 px-4">Reference</th>
                <th class="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/40 font-body">
              ${itemizedRows
                .map((txn) => {
                  const isDebit = Number(txn.debit) > 0;
                  const isCredit = Number(txn.credit) > 0;
                  const badgeStyle = this.getChargeSourceBadge(txn.source);

                  return `
                  <tr class="hover:bg-surface-container/30 transition-colors cursor-pointer row-txn-click" data-txnid="${txn.id}">
                    <!-- Date & Time -->
                    <td class="py-3 px-4 font-data-mono whitespace-nowrap text-on-surface">
                      <span class="font-bold text-primary">${txn.date}</span>
                      <span class="text-[10px] text-on-surface-variant ml-1">${txn.time}</span>
                    </td>

                    <!-- Description -->
                    <td class="py-3 px-4">
                      <div class="font-semibold text-primary">${txn.description}</div>
                      <div class="text-[10px] text-on-surface-variant font-data-mono truncate max-w-xs">${txn.outlet} • Posted by ${txn.postedBy}</div>
                    </td>

                    <!-- Source Badge -->
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-data-mono ${badgeStyle}">
                        ${txn.source}
                      </span>
                    </td>

                    <!-- Debit -->
                    <td class="py-3 px-4 text-right font-data-mono font-bold ${isDebit ? 'text-primary' : 'text-on-surface-variant/40'}">
                      ${isDebit ? `₹${Number(txn.debit).toLocaleString('en-IN')}` : '—'}
                    </td>

                    <!-- Credit -->
                    <td class="py-3 px-4 text-right font-data-mono font-bold ${isCredit ? 'text-emerald-700' : 'text-on-surface-variant/40'}">
                      ${isCredit ? `₹${Number(txn.credit).toLocaleString('en-IN')}` : '—'}
                    </td>

                    <!-- Tax -->
                    <td class="py-3 px-4 text-right font-data-mono text-on-surface-variant">
                      ${txn.tax > 0 ? `₹${Number(txn.tax).toLocaleString('en-IN')}` : '₹0'}
                    </td>

                    <!-- Running Balance -->
                    <td class="py-3 px-4 text-right font-data-mono font-black ${
                      txn.runningBalance > 0 ? 'text-rose-700' : txn.runningBalance < 0 ? 'text-blue-700' : 'text-emerald-800'
                    }">
                      ₹${txn.runningBalance.toLocaleString('en-IN')}
                    </td>

                    <!-- Reference -->
                    <td class="py-3 px-4 font-data-mono text-on-surface-variant text-[11px]">
                      ${txn.reference}
                    </td>

                    <!-- Action -->
                    <td class="py-3 px-4 text-right whitespace-nowrap">
                      <button class="btn-txn-inspect px-2 py-1 rounded border border-outline-variant hover:bg-surface-container text-[11px] font-bold text-primary transition-all cursor-pointer" data-txnid="${txn.id}">
                        Details
                      </button>
                    </td>
                  </tr>
                `;
                })
                .join('')}
            </tbody>
            <tfoot>
              <tr class="bg-surface-bright border-t border-outline-variant font-bold text-xs">
                <td colspan="3" class="py-3.5 px-4 text-right text-primary uppercase font-data-mono">Totals:</td>
                <td class="py-3.5 px-4 text-right font-data-mono font-black text-primary">₹${fin.totalCharges.toLocaleString('en-IN')}</td>
                <td class="py-3.5 px-4 text-right font-data-mono font-black text-emerald-800">₹${fin.totalPayments.toLocaleString('en-IN')}</td>
                <td class="py-3.5 px-4 text-right font-data-mono text-on-surface-variant">₹${fin.totalTax.toLocaleString('en-IN')}</td>
                <td class="py-3.5 px-4 text-right font-data-mono font-black text-base ${isDue ? 'text-rose-700' : 'text-emerald-800'}">
                  ₹${fin.balance.toLocaleString('en-IN')}
                </td>
                <td colspan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>

      </section>

      <!-- ================================================================= -->
      <!-- LOWER WORKSPACE: TAX BREAKDOWN & FOLIO ACTIVITY TIMELINE -->
      <!-- ================================================================= -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Tax-Level Breakdown Section (Data-Driven) -->
        <div class="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/70 shadow-xs space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-outline-variant/40">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">STATUTORY TAX BREAKDOWN (GST)</span>
            <span class="text-xs font-bold text-primary font-data-mono">Harmonized Tariff Code</span>
          </div>

          <div class="space-y-2 text-xs">
            <div class="flex items-center justify-between py-1 border-b border-outline-variant/20">
              <span class="text-on-surface-variant">Subtotal (Pre-Tax Postings):</span>
              <span class="font-data-mono font-bold text-primary">₹${folio.taxSummary.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div class="flex items-center justify-between py-1 border-b border-outline-variant/20">
              <span class="text-on-surface-variant">Central GST (CGST @ 9% on Accommodation &amp; Services):</span>
              <span class="font-data-mono font-semibold text-primary">₹${folio.taxSummary.cgst.toLocaleString('en-IN')}</span>
            </div>
            <div class="flex items-center justify-between py-1 border-b border-outline-variant/20">
              <span class="text-on-surface-variant">State GST (SGST @ 9% on Accommodation &amp; Services):</span>
              <span class="font-data-mono font-semibold text-primary">₹${folio.taxSummary.sgst.toLocaleString('en-IN')}</span>
            </div>
            <div class="flex items-center justify-between py-1.5 font-bold text-sm bg-surface-bright px-3 rounded-lg">
              <span class="text-primary">Total Inclusive Charges:</span>
              <span class="font-data-mono text-primary font-black">₹${fin.totalCharges.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <p class="text-[11px] text-on-surface-variant">Tax invoices comply with Indian GST Council hotel luxury slab regulations.</p>
        </div>

        <!-- Chronological Folio Activity Timeline -->
        <div class="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/70 shadow-xs space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-outline-variant/40">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">CHRONOLOGICAL AUDIT TIMELINE</span>
            <span class="text-xs font-bold text-primary font-data-mono">Live Audit Trail</span>
          </div>

          <div class="relative pl-4 space-y-3.5 border-l-2 border-outline-variant/60 ml-1 max-h-64 overflow-y-auto custom-scrollbar pr-1">
            ${folio.activityTimeline
              .map(
                (act) => `
              <div class="relative">
                <span class="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-surface-container-lowest"></span>
                <div class="text-[11px] font-bold font-data-mono text-primary">${act.time}</div>
                <div class="text-xs text-on-surface">${act.text}</div>
                <div class="text-[10px] text-on-surface-variant font-data-mono">Logged by: ${act.user}</div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

      </section>

      <!-- WORKFLOW MODALS -->
      ${this.renderAddChargeModal(folio)}
      ${this.renderAddPaymentModal(folio, fin)}
      ${this.renderSplitFolioModal(folio)}
      ${this.renderTransferModal(folio)}
      ${this.renderAdjustmentModal(folio)}
      ${this.renderTransactionDetailDrawer()}
      ${this.renderSettleCheckoutModal(folio, fin)}
    `;

    this.bindWorkspaceEvents(folio);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SOURCE BADGE STYLING HELPER
  // ──────────────────────────────────────────────────────────────────────────
  getChargeSourceBadge(src) {
    switch (src) {
      case 'ROOM':
        return 'bg-blue-100 text-blue-900 border border-blue-200';
      case 'POS':
      case 'RESTAURANT':
        return 'bg-amber-100 text-amber-900 border border-amber-200';
      case 'ROOM SERVICE':
        return 'bg-orange-100 text-orange-900 border border-orange-200';
      case 'MINIBAR':
        return 'bg-purple-100 text-purple-900 border border-purple-200';
      case 'LAUNDRY':
        return 'bg-cyan-100 text-cyan-900 border border-cyan-200';
      case 'SPA':
        return 'bg-emerald-100 text-emerald-900 border border-emerald-200';
      case 'TRANSPORT':
        return 'bg-indigo-100 text-indigo-900 border border-indigo-200';
      case 'BANQUET':
        return 'bg-fuchsia-100 text-fuchsia-900 border border-fuchsia-200';
      case 'CARD':
      case 'UPI':
      case 'CASH':
        return 'bg-emerald-100 text-emerald-900 font-black border border-emerald-300';
      case 'TAX':
        return 'bg-surface-container text-on-surface-variant border border-outline-variant';
      case 'ADJUSTMENT':
        return 'bg-rose-100 text-rose-900 font-bold border border-rose-300';
      default:
        return 'bg-surface-container text-on-surface border border-outline-variant';
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 3. WORKFLOW MODALS
  // ──────────────────────────────────────────────────────────────────────────

  // MODAL: Add Charge
  renderAddChargeModal(folio) {
    if (!this.activeAddChargeModal) return '';

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
          
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-primary font-data-mono">Folio #${folio.folioNumber}</span>
              <h2 class="font-headline-sm text-base font-bold text-primary">Post New Charge</h2>
            </div>
            <button id="btn-close-charge-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-4 overflow-y-auto custom-scrollbar text-xs">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Charge Type *</label>
              <select id="input-charge-type" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
                <option value="RESTAURANT">Restaurant &amp; Dining (POS)</option>
                <option value="ROOM SERVICE">In-Room Dining (Room Service)</option>
                <option value="MINIBAR">Minibar Refreshment</option>
                <option value="SPA">Spa &amp; Wellness</option>
                <option value="LAUNDRY">Laundry &amp; Valet Pressing</option>
                <option value="TRANSPORT">Airport Transfer / Limousine</option>
                <option value="BANQUET">Banquets / Meeting Room</option>
                <option value="ROOM">Room Tariff Adjustment</option>
                <option value="MANUAL">Miscellaneous Service</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Description *</label>
              <input type="text" id="input-charge-desc" placeholder="e.g. In-Room Dining Dinner &amp; Wine" value="In-Room Dining Dinner" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none font-medium" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Amount (₹) *</label>
                <input type="number" id="input-charge-amount" placeholder="0.00" value="1850" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none font-data-mono font-bold text-primary" />
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Quantity</label>
                <input type="number" id="input-charge-qty" value="1" min="1" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none font-data-mono" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Tax Rate *</label>
                <select id="input-charge-tax" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
                  <option value="0.18">18% GST (Standard Luxury)</option>
                  <option value="0.12">12% GST (Standard Rooms)</option>
                  <option value="0.05">5% GST (F&amp;B Outlets)</option>
                  <option value="0">0% Exempt</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Date</label>
                <input type="text" id="input-charge-date" value="14 Sep" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none font-data-mono" />
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Reference / Order ID (Optional)</label>
              <input type="text" id="input-charge-ref" placeholder="e.g. POS-ORD-48291" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none font-data-mono" />
            </div>

            <div class="p-3 bg-amber-50 rounded-xl border border-amber-300 text-amber-900 text-[11px] flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px] text-amber-700">lock</span>
              <span>Financial Safety: Posting creates an auditable ledger debit requiring employee authorization.</span>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-outline-variant bg-surface-bright flex items-center justify-end gap-2.5">
            <button id="btn-cancel-charge" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-confirm-post-charge" class="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-sm transition-all cursor-pointer">Post Charge</button>
          </div>

        </div>
      </div>
    `;
  }

  // MODAL: Add Payment
  renderAddPaymentModal(folio, fin) {
    if (!this.activeAddPaymentModal) return '';

    const suggestedAmount = fin.balance > 0 ? fin.balance : 5000;

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
          
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-800 font-data-mono">Record Payment</span>
              <h2 class="font-headline-sm text-base font-bold text-primary">Folio #${folio.folioNumber} — ${folio.guestName}</h2>
            </div>
            <button id="btn-close-payment-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-4 overflow-y-auto custom-scrollbar text-xs">
            <!-- Balance Card -->
            <div class="p-3 bg-surface-bright rounded-xl border border-outline-variant flex justify-between items-center">
              <div>
                <span class="text-[10px] text-on-surface-variant font-data-mono block">Current Outstanding Balance</span>
                <span class="text-xl font-black font-data-mono text-rose-700">₹${fin.balance.toLocaleString('en-IN')}</span>
              </div>
              <button id="btn-pay-full-balance" class="px-3 py-1.5 rounded-lg border border-primary text-primary font-bold text-xs hover:bg-primary/10 transition-all cursor-pointer">
                Pay Full Balance
              </button>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Payment Amount (₹) *</label>
              <input type="number" id="input-payment-amount" value="${suggestedAmount}" class="w-full py-2.5 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-base text-primary font-bold font-data-mono outline-none" />
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2 font-data-mono">Payment Method *</label>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <label class="p-3 rounded-xl border border-outline-variant flex items-center gap-2 cursor-pointer hover:bg-surface-container">
                  <input type="radio" name="pay-method" value="CARD" checked class="accent-primary" />
                  <span class="font-bold">Card</span>
                </label>
                <label class="p-3 rounded-xl border border-outline-variant flex items-center gap-2 cursor-pointer hover:bg-surface-container">
                  <input type="radio" name="pay-method" value="UPI" class="accent-primary" />
                  <span class="font-bold">UPI</span>
                </label>
                <label class="p-3 rounded-xl border border-outline-variant flex items-center gap-2 cursor-pointer hover:bg-surface-container">
                  <input type="radio" name="pay-method" value="CASH" class="accent-primary" />
                  <span class="font-bold">Cash</span>
                </label>
                <label class="p-3 rounded-xl border border-outline-variant flex items-center gap-2 cursor-pointer hover:bg-surface-container">
                  <input type="radio" name="pay-method" value="BANK" class="accent-primary" />
                  <span class="font-bold">Bank Transfer</span>
                </label>
                <label class="p-3 rounded-xl border border-outline-variant flex items-center gap-2 cursor-pointer hover:bg-surface-container col-span-2 sm:col-span-1">
                  <input type="radio" name="pay-method" value="OTHER" class="accent-primary" />
                  <span class="font-bold">Other / Voucher</span>
                </label>
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Reference / Transaction ID *</label>
              <input type="text" id="input-payment-ref" value="TXN-PAY-${Math.floor(10000 + Math.random() * 90000)}" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none font-data-mono" />
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Received By</label>
              <input type="text" value="Front Desk — Employee 104" readonly class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-bright text-xs text-on-surface-variant font-medium outline-none" />
            </div>
          </div>

          <div class="px-6 py-4 border-t border-outline-variant bg-surface-bright flex items-center justify-end gap-2.5">
            <button id="btn-cancel-payment" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-confirm-record-payment" class="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer">Record Payment</button>
          </div>

        </div>
      </div>
    `;
  }

  // MODAL: Split Folio
  renderSplitFolioModal(folio) {
    if (!this.activeSplitModal) return '';

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-primary font-data-mono">Folio Segregation</span>
              <h2 class="font-headline-sm text-base font-bold text-primary">Split Folio Charges — ${folio.folioNumber}</h2>
            </div>
            <button id="btn-close-split-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-4 overflow-y-auto custom-scrollbar text-xs">
            <p class="text-on-surface-variant">Select charges to isolate into a separate sub-account or corporate direct-bill folio:</p>

            <div class="grid grid-cols-2 gap-3 mb-2">
              <div class="p-3 bg-primary/5 rounded-xl border border-primary text-primary">
                <span class="text-[10px] font-bold uppercase font-data-mono block">Folio A (Company)</span>
                <span class="text-sm font-bold">Room Charges Only</span>
                <p class="text-[11px] text-on-surface-variant mt-0.5">Billed to ${folio.companyAccount || 'Corporate Account'}</p>
              </div>

              <div class="p-3 bg-surface-bright rounded-xl border border-outline-variant">
                <span class="text-[10px] font-bold uppercase font-data-mono block text-on-surface-variant">Folio B (Guest)</span>
                <span class="text-sm font-bold text-primary">Incidentals &amp; F&amp;B</span>
                <p class="text-[11px] text-on-surface-variant mt-0.5">Payable directly by ${folio.guestName}</p>
              </div>
            </div>

            <div class="border border-outline-variant rounded-xl overflow-hidden">
              <div class="p-2.5 bg-surface-bright border-b border-outline-variant font-bold text-[10px] uppercase font-data-mono text-on-surface-variant flex justify-between">
                <span>Select Items to Move to Folio B</span>
                <span>Amount</span>
              </div>
              <div class="divide-y divide-outline-variant/40 max-h-48 overflow-y-auto">
                ${folio.transactions
                  .filter((t) => t.debit > 0)
                  .map(
                    (t) => `
                  <label class="p-2.5 flex items-center justify-between hover:bg-surface-container/50 cursor-pointer">
                    <div class="flex items-center gap-2">
                      <input type="checkbox" class="chk-split-item accent-primary" ${t.source !== 'ROOM' ? 'checked' : ''} data-txnid="${t.id}" />
                      <div>
                        <div class="font-bold text-primary text-xs">${t.description}</div>
                        <div class="text-[10px] text-on-surface-variant font-data-mono">${t.source} • ${t.date}</div>
                      </div>
                    </div>
                    <span class="font-data-mono font-bold text-primary">₹${t.debit.toLocaleString('en-IN')}</span>
                  </label>
                `
                  )
                  .join('')}
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Move Selected Charges To:</label>
              <div class="space-y-1.5">
                <label class="p-2 rounded-lg border border-outline-variant flex items-center gap-2 cursor-pointer hover:bg-surface-container">
                  <input type="radio" name="split-target" value="NEW" checked class="accent-primary" />
                  <span>Create New Folio (Folio B - Incidental Account)</span>
                </label>
                <label class="p-2 rounded-lg border border-outline-variant flex items-center gap-2 cursor-pointer hover:bg-surface-container">
                  <input type="radio" name="split-target" value="COMPANY" class="accent-primary" />
                  <span>Direct Bill to Corporate Account (${folio.companyAccount})</span>
                </label>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-outline-variant bg-surface-bright flex items-center justify-end gap-2.5">
            <button id="btn-cancel-split" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-confirm-split" class="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-sm transition-all cursor-pointer">Complete Split</button>
          </div>

        </div>
      </div>
    `;
  }

  // MODAL: Transfer Charge
  renderTransferModal(folio) {
    if (!this.activeTransferModal) return '';

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-primary font-data-mono">Inter-Folio Transfer</span>
              <h2 class="font-headline-sm text-base font-bold text-primary">Transfer Posting</h2>
            </div>
            <button id="btn-close-transfer-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-3.5 text-xs">
            <div class="p-3 bg-surface-bright rounded-xl border border-outline-variant">
              <span class="text-[10px] text-on-surface-variant font-data-mono block uppercase">Source Folio</span>
              <strong class="text-primary text-sm">${folio.folioNumber} (${folio.guestName} — Room ${folio.roomNumber})</strong>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Select Charge to Transfer *</label>
              <select id="sel-transfer-charge" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
                ${folio.transactions
                  .filter((t) => t.debit > 0)
                  .map((t) => `<option value="${t.id}">${t.description} — ₹${t.debit.toLocaleString('en-IN')}</option>`)
                  .join('')}
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Transfer Destination *</label>
              <select id="sel-transfer-target" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
                <option value="fol-10484">Room 615 — Aisha Al-Mansoor (FOL-10484)</option>
                <option value="fol-10483">Room 508 — John Smith (FOL-10483)</option>
                <option value="fol-10487">Room 310 — David Miller (FOL-10487)</option>
                <option value="fol-10485">Room 302 — Vikram Singhania (FOL-10485)</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Reason for Transfer</label>
              <input type="text" id="input-transfer-reason" placeholder="e.g. Guest requested shared dinner bill" value="Host picked up dinner tab" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none" />
            </div>
          </div>

          <div class="px-6 py-4 border-t border-outline-variant bg-surface-bright flex items-center justify-end gap-2.5">
            <button id="btn-cancel-transfer" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-confirm-transfer" class="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-sm transition-all cursor-pointer">Confirm Transfer</button>
          </div>

        </div>
      </div>
    `;
  }

  // MODAL: Add Controlled Adjustment
  renderAdjustmentModal(folio) {
    if (!this.activeAdjustmentModal) return '';

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-rose-900 font-data-mono">Controlled Billing Correction</span>
              <h2 class="font-headline-sm text-base font-bold text-primary">Post Adjustment / Credit</h2>
            </div>
            <button id="btn-close-adj-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-3.5 text-xs">
            <div class="p-3 bg-amber-50 rounded-xl border border-amber-300 text-amber-900 text-[11px]">
              <strong>Rule of Financial Integrity:</strong> Historical transactions cannot be silently edited. All adjustments post as auditable offsetting credits with managerial approval.
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Adjustment Credit Amount (₹) *</label>
              <input type="number" id="input-adj-amount" value="450" class="w-full py-2.5 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-base text-rose-700 font-bold font-data-mono outline-none" />
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Adjustment Reason *</label>
              <select id="sel-adj-reason" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
                <option value="Service recovery concession">Service recovery concession</option>
                <option value="Duplicate posting reversal">Duplicate posting reversal</option>
                <option value="Courtesy manager allowance">Courtesy manager allowance</option>
                <option value="Pricing tariff correction">Pricing tariff correction</option>
              </select>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Approved By (Manager Auth) *</label>
              <input type="text" id="input-adj-approver" value="Duty Manager — Rajesh Sharma (PIN Verified)" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-bright text-xs text-on-surface-variant font-data-mono" readonly />
            </div>
          </div>

          <div class="px-6 py-4 border-t border-outline-variant bg-surface-bright flex items-center justify-end gap-2.5">
            <button id="btn-cancel-adj" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-confirm-adj" class="px-6 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer">Apply Adjustment</button>
          </div>

        </div>
      </div>
    `;
  }

  // MODAL: Transaction Detail Slide-Over / Modal
  renderTransactionDetailDrawer() {
    if (!this.activeTransactionDetail) return '';
    const txn = this.activeTransactionDetail;

    return `
      <div class="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md overflow-hidden flex flex-col">
          
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-primary font-data-mono">${txn.id}</span>
              <h2 class="font-headline-sm text-base font-bold text-primary">Transaction Itemization</h2>
            </div>
            <button id="btn-close-txn-detail" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-3.5 text-xs">
            <div class="p-4 bg-surface-bright rounded-xl border border-outline-variant flex justify-between items-center">
              <div>
                <span class="text-[10px] text-on-surface-variant uppercase font-data-mono block">Posting Amount</span>
                <span class="text-2xl font-black font-data-mono ${txn.debit > 0 ? 'text-primary' : 'text-emerald-700'}">
                  ₹${(txn.debit || txn.credit).toLocaleString('en-IN')}
                </span>
              </div>
              <span class="px-2.5 py-1 rounded text-xs font-bold uppercase font-data-mono ${this.getChargeSourceBadge(txn.source)}">
                ${txn.source}
              </span>
            </div>

            <div class="space-y-2 border-t border-outline-variant/50 pt-2">
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Description:</span>
                <strong class="text-primary">${txn.description}</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Origin Outlet:</span>
                <span class="font-semibold text-primary">${txn.outlet}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Posted By:</span>
                <span class="font-data-mono text-primary">${txn.postedBy}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Timestamp:</span>
                <span class="font-data-mono text-primary">${txn.date} • ${txn.time}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Reference / Voucher:</span>
                <span class="font-data-mono font-bold text-primary">${txn.reference}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Related Order / Stay:</span>
                <span class="font-data-mono text-primary">${txn.relatedOrder || 'None'}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Itemized GST:</span>
                <span class="font-data-mono text-primary">₹${(txn.tax || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            ${txn.notes ? `
              <div class="p-3 bg-surface-container/50 rounded-xl border border-outline-variant/60 text-[11px] text-on-surface">
                <strong>Audit Note:</strong> ${txn.notes}
              </div>
            ` : ''}
          </div>

          <div class="px-6 py-4 border-t border-outline-variant bg-surface-bright flex items-center justify-between">
            <button id="btn-txn-print-receipt" class="px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary flex items-center gap-1 cursor-pointer">
              <span class="material-symbols-outlined text-[15px]">print</span>
              <span>Print Slip</span>
            </button>
            <button id="btn-close-txn-detail-footer" class="px-5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-xs cursor-pointer">
              Done
            </button>
          </div>

        </div>
      </div>
    `;
  }

  // MODAL: Settle & Checkout Connection
  renderSettleCheckoutModal(folio, fin) {
    if (!this.activeSettleCheckoutModal) return '';

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-lg overflow-hidden flex flex-col">
          
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-primary font-data-mono">Checkout Integration</span>
              <h2 class="font-headline-sm text-base font-bold text-primary">Settle Folio &amp; Complete Departure</h2>
            </div>
            <button id="btn-close-settle-modal" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-4 text-xs">
            <div class="p-4 bg-surface-bright rounded-xl border border-outline-variant space-y-2">
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Guest:</span>
                <strong class="text-primary">${folio.guestName} (${folio.guestId})</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-on-surface-variant">Room:</span>
                <strong class="text-primary">Room ${folio.roomNumber} (${folio.roomType})</strong>
              </div>
              <div class="flex justify-between pt-2 border-t border-outline-variant/40">
                <span class="font-bold text-primary">Amount Due for Departure:</span>
                <span class="font-data-mono font-black text-lg text-rose-700">₹${fin.balance.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Settlement Method</label>
              <select id="sel-settle-method" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
                <option value="CARD_ON_FILE">Charge Pre-authorized Visa Card on File (ending 9912)</option>
                <option value="TERMINAL_CARD">Front Desk Physical POS Card Tap</option>
                <option value="UPI">Dynamic Front Desk UPI QR</option>
                <option value="CASH">Cash Settlement at Counter</option>
              </select>
            </div>

            <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-900 text-[11px] space-y-1">
              <div class="font-bold flex items-center gap-1">
                <span class="material-symbols-outlined text-[15px]">verified</span>
                <span>Automatic Housekeeping Turnover</span>
              </div>
              <p>Completing settlement automatically marks Folio #${folio.folioNumber} as SETTLED, releases pre-authorizations, and dispatches turnover clean for Room ${folio.roomNumber}.</p>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-outline-variant bg-surface-bright flex items-center justify-end gap-2.5">
            <button id="btn-cancel-settle" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-confirm-settle-departure" class="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer">
              Collect ₹${fin.balance.toLocaleString('en-IN')} &amp; Settle Folio
            </button>
          </div>

        </div>
      </div>
    `;
  }

  // MODAL: + New Folio
  renderNewFolioModal() {
    if (!this.activeNewFolioModal) return '';

    return `
      <div class="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-lg overflow-hidden flex flex-col">
          
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-bright flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-primary font-data-mono">Accounts Ledger</span>
              <h2 class="font-headline-sm text-base font-bold text-primary">Open New Guest Folio</h2>
            </div>
            <button id="btn-close-new-folio" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div class="p-6 space-y-3.5 text-xs">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Guest Name *</label>
              <input type="text" id="input-new-folio-guest" placeholder="e.g. Liam Vance" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Room Number</label>
                <input type="text" id="input-new-folio-room" placeholder="e.g. 405" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none font-data-mono" />
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Reservation Ref</label>
                <input type="text" id="input-new-folio-res" placeholder="e.g. RES-10992" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none font-data-mono" />
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1 font-data-mono">Billing Account Type</label>
              <select id="sel-new-folio-type" class="w-full py-2 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface outline-none cursor-pointer">
                <option value="INDIVIDUAL">Individual Guest Folio</option>
                <option value="CORPORATE">Corporate Direct Bill Account</option>
                <option value="BANQUET">Banquets &amp; Events Master Folio</option>
              </select>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-outline-variant bg-surface-bright flex items-center justify-end gap-2.5">
            <button id="btn-cancel-new-folio" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-save-new-folio" class="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold shadow-sm transition-all cursor-pointer">Create Folio</button>
          </div>

        </div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // EVENT BINDINGS: DIRECTORY LIST
  // ──────────────────────────────────────────────────────────────────────────
  bindDirectoryEvents() {
    if (!this.container) return;

    // Search Input
    const searchInput = this.container.querySelector('#input-folio-search');
    if (searchInput) {
      searchInput.oninput = (e) => {
        this.searchQuery = e.target.value;
        this.renderContent();
        const input = this.container.querySelector('#input-folio-search');
        if (input) {
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        }
      };
    }

    const btnClearSearch = this.container.querySelector('#btn-clear-folio-search');
    if (btnClearSearch) {
      btnClearSearch.onclick = () => {
        this.searchQuery = '';
        this.renderContent();
      };
    }

    const btnEmptyClear = this.container.querySelector('#btn-empty-clear-folio-search');
    if (btnEmptyClear) {
      btnEmptyClear.onclick = () => {
        this.searchQuery = '';
        this.renderContent();
      };
    }

    // Quick Filter Chips
    this.container.querySelectorAll('.btn-folio-filter').forEach((btn) => {
      btn.onclick = () => {
        this.activeQuickFilter = btn.dataset.filter;
        this.renderContent();
      };
    });

    // Summary Metric Cards Click to Filter
    this.container.querySelectorAll('.card-folio-metric').forEach((card) => {
      card.onclick = () => {
        this.activeQuickFilter = card.dataset.filter;
        this.renderContent();
      };
    });

    // Secondary Dropdowns
    const bindDropdown = (id, key) => {
      const el = this.container.querySelector(id);
      if (el) {
        el.onchange = (e) => {
          this.filters[key] = e.target.value;
          this.renderContent();
        };
      }
    };
    bindDropdown('#sel-filter-floor', 'roomFloor');
    bindDropdown('#sel-filter-status', 'folioStatus');
    bindDropdown('#sel-filter-source', 'chargeSource');

    // Reset Filters
    const btnReset = this.container.querySelector('#btn-reset-folio-filters');
    if (btnReset) {
      btnReset.onclick = () => {
        this.searchQuery = '';
        this.activeQuickFilter = 'ALL';
        this.filters = { roomFloor: 'ALL', paymentStatus: 'ALL', folioStatus: 'ALL', chargeSource: 'ALL', dateRange: 'ALL' };
        this.renderContent();
      };
    }

    // Click Table Row or Action Button -> Open Dedicated Folio Workspace
    this.container.querySelectorAll('.row-folio-click').forEach((row) => {
      row.onclick = (e) => {
        if (e.target.closest('.btn-table-view-folio')) return;
        this.selectedFolioId = row.dataset.fid;
        this.renderContent();
      };
    });

    this.container.querySelectorAll('.btn-table-view-folio').forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        this.selectedFolioId = btn.dataset.fid;
        this.renderContent();
      };
    });

    // New Folio
    const btnNewFolio = this.container.querySelector('#btn-new-folio');
    if (btnNewFolio) {
      btnNewFolio.onclick = () => {
        this.activeNewFolioModal = true;
        this.renderContent();
      };
    }

    const btnCloseNewFolio = this.container.querySelector('#btn-close-new-folio');
    if (btnCloseNewFolio) btnCloseNewFolio.onclick = () => { this.activeNewFolioModal = false; this.renderContent(); };
    const btnCancelNewFolio = this.container.querySelector('#btn-cancel-new-folio');
    if (btnCancelNewFolio) btnCancelNewFolio.onclick = () => { this.activeNewFolioModal = false; this.renderContent(); };

    const btnSaveNewFolio = this.container.querySelector('#btn-save-new-folio');
    if (btnSaveNewFolio) {
      btnSaveNewFolio.onclick = () => {
        const gName = this.container.querySelector('#input-new-folio-guest')?.value || 'New Guest';
        const rNum = this.container.querySelector('#input-new-folio-room')?.value || '405';
        const resNum = this.container.querySelector('#input-new-folio-res')?.value || 'RES-10992';

        const newF = {
          id: `fol-104${this.folios.length + 90}`,
          folioNumber: `FOL-104${this.folios.length + 90}`,
          reservationNumber: resNum,
          guestId: `GST-00${this.folios.length + 190}`,
          guestName: gName,
          firstName: gName.split(' ')[0] || 'Guest',
          lastName: gName.split(' ')[1] || '',
          avatar: gName.substring(0, 2).toUpperCase(),
          vip: false,
          vipTier: null,
          roomNumber: rNum,
          roomType: 'Deluxe Room',
          floor: rNum[0] || '4',
          stayDates: '14 Sep → 17 Sep',
          checkInDate: '14 Sep',
          checkOutDate: '17 Sep',
          adults: 1,
          children: 0,
          billingType: 'Individual Folio',
          status: 'OPEN',
          paymentStatus: 'Unpaid',
          lastActivity: 'Just now',
          taxSummary: { subtotal: 0, cgst: 0, sgst: 0, totalTax: 0 },
          transactions: [],
          activityTimeline: [{ time: 'Just now', text: 'Folio account opened manually.', user: 'Front Desk' }],
        };

        this.folios.unshift(newF);
        this.activeNewFolioModal = false;
        this.selectedFolioId = newF.id;
        Toast.show({ title: 'Folio Created', message: `${newF.folioNumber} opened for ${newF.guestName}.`, type: 'success' });
        this.renderContent();
      };
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // EVENT BINDINGS: FOLIO DETAIL WORKSPACE
  // ──────────────────────────────────────────────────────────────────────────
  bindWorkspaceEvents(folio) {
    if (!this.container) return;

    // Back to directory
    const btnBack = this.container.querySelector('#btn-back-to-directory');
    if (btnBack) {
      btnBack.onclick = () => {
        this.selectedFolioId = null;
        this.renderContent();
      };
    }

    // Switch Folio Dropdown
    const selSwitch = this.container.querySelector('#sel-switch-folio');
    if (selSwitch) {
      selSwitch.onchange = (e) => {
        this.selectedFolioId = e.target.value;
        this.renderContent();
      };
    }

    // Cross-module Quick Links
    const btnViewGuest = this.container.querySelector('#btn-nav-view-guest');
    if (btnViewGuest) {
      btnViewGuest.onclick = () => {
        store.setState({ activeNavTab: 'crm' });
      };
    }

    const btnViewRes = this.container.querySelector('#btn-nav-view-res');
    if (btnViewRes) {
      btnViewRes.onclick = () => {
        store.setState({ activeNavTab: 'reservations_list' });
      };
    }

    const btnViewRoom = this.container.querySelector('#btn-nav-view-room');
    if (btnViewRoom) {
      btnViewRoom.onclick = () => {
        store.setState({ activeNavTab: 'room_status' });
      };
    }

    // Ledger Filter Chips
    this.container.querySelectorAll('.btn-ledger-filter').forEach((btn) => {
      btn.onclick = () => {
        this.selectedLedgerFilter = btn.dataset.cat;
        this.renderContent();
      };
    });

    // More Dropdown toggle
    const btnMore = this.container.querySelector('#btn-folio-more');
    const menuMore = this.container.querySelector('#menu-folio-more');
    if (btnMore && menuMore) {
      btnMore.onclick = (e) => {
        e.stopPropagation();
        menuMore.classList.toggle('hidden');
      };
      document.addEventListener('click', () => {
        menuMore.classList.add('hidden');
      });
    }

    // Print
    const btnPrint = this.container.querySelector('#btn-folio-print, #btn-export-statement');
    if (btnPrint) {
      btnPrint.onclick = () => window.print();
    }

    // Add Charge
    const btnAddCharge = this.container.querySelector('#btn-folio-add-charge');
    if (btnAddCharge) {
      btnAddCharge.onclick = () => {
        this.activeAddChargeModal = true;
        this.renderContent();
      };
    }

    const btnCloseCharge = this.container.querySelector('#btn-close-charge-modal');
    if (btnCloseCharge) btnCloseCharge.onclick = () => { this.activeAddChargeModal = false; this.renderContent(); };
    const btnCancelCharge = this.container.querySelector('#btn-cancel-charge');
    if (btnCancelCharge) btnCancelCharge.onclick = () => { this.activeAddChargeModal = false; this.renderContent(); };

    const btnConfirmPostCharge = this.container.querySelector('#btn-confirm-post-charge');
    if (btnConfirmPostCharge) {
      btnConfirmPostCharge.onclick = () => {
        const cType = this.container.querySelector('#input-charge-type')?.value || 'ROOM SERVICE';
        const desc = this.container.querySelector('#input-charge-desc')?.value || 'Incidental Charge';
        const amt = parseFloat(this.container.querySelector('#input-charge-amount')?.value || 1000);
        const qty = parseInt(this.container.querySelector('#input-charge-qty')?.value || 1, 10);
        const taxRate = parseFloat(this.container.querySelector('#input-charge-tax')?.value || 0.18);
        const ref = this.container.querySelector('#input-charge-ref')?.value || `MAN-${Math.floor(1000 + Math.random() * 9000)}`;

        const totalDebit = amt * qty;
        const totalTax = totalDebit * taxRate;

        const newTxn = {
          id: `TXN-${folio.folioNumber.replace('FOL-', '')}-${folio.transactions.length + 1}`,
          date: '14 Sep',
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          description: `${desc}${qty > 1 ? ` (x${qty})` : ''}`,
          source: cType,
          sourceLabel: cType,
          debit: totalDebit,
          credit: 0,
          tax: totalTax,
          reference: ref,
          outlet: 'Front Desk Incidentals',
          postedBy: 'Front Desk — Emp 104',
          relatedOrder: ref,
          notes: 'Posted via Front Desk Folio workspace',
        };

        folio.transactions.push(newTxn);
        folio.lastActivity = 'Just now';
        folio.activityTimeline.unshift({
          time: 'Just now',
          text: `Charge of ₹${totalDebit.toLocaleString('en-IN')} posted (${desc})`,
          user: 'Front Desk — Emp 104',
        });

        this.activeAddChargeModal = false;
        Toast.show({ title: 'Charge Posted', message: `₹${totalDebit.toLocaleString('en-IN')} added to Folio #${folio.folioNumber}.`, type: 'success' });
        this.renderContent();
      };
    }

    // Add Payment
    const btnAddPayment = this.container.querySelector('#btn-folio-add-payment');
    if (btnAddPayment) {
      btnAddPayment.onclick = () => {
        this.activeAddPaymentModal = true;
        this.renderContent();
      };
    }

    const btnClosePayment = this.container.querySelector('#btn-close-payment-modal');
    if (btnClosePayment) btnClosePayment.onclick = () => { this.activeAddPaymentModal = false; this.renderContent(); };
    const btnCancelPayment = this.container.querySelector('#btn-cancel-payment');
    if (btnCancelPayment) btnCancelPayment.onclick = () => { this.activeAddPaymentModal = false; this.renderContent(); };

    const btnPayFull = this.container.querySelector('#btn-pay-full-balance');
    if (btnPayFull) {
      btnPayFull.onclick = () => {
        const fin = this.calculateFolioFinances(folio);
        const inp = this.container.querySelector('#input-payment-amount');
        if (inp) inp.value = fin.balance > 0 ? fin.balance : 0;
      };
    }

    const btnConfirmPayment = this.container.querySelector('#btn-confirm-record-payment');
    if (btnConfirmPayment) {
      btnConfirmPayment.onclick = () => {
        const pAmt = parseFloat(this.container.querySelector('#input-payment-amount')?.value || 1000);
        const pMethod = this.container.querySelector('input[name="pay-method"]:checked')?.value || 'CARD';
        const pRef = this.container.querySelector('#input-payment-ref')?.value || 'PAY-REF-01';

        const newPayTxn = {
          id: `TXN-${folio.folioNumber.replace('FOL-', '')}-${folio.transactions.length + 1}`,
          date: '14 Sep',
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          description: `Payment — ${pMethod} Received at Front Desk`,
          source: pMethod,
          sourceLabel: `Payment (${pMethod})`,
          debit: 0,
          credit: pAmt,
          tax: 0,
          reference: pRef,
          outlet: 'Front Desk Cashier',
          postedBy: 'Front Desk — Emp 104',
          relatedOrder: pRef,
          notes: 'Received and verified against terminal slip',
        };

        folio.transactions.push(newPayTxn);
        const updatedFin = this.calculateFolioFinances(folio);
        if (Math.abs(updatedFin.balance) < 0.01) {
          folio.status = 'SETTLED';
          folio.paymentStatus = 'Fully Paid';
        } else if (updatedFin.balance < 0) {
          folio.status = 'OVERPAID';
        } else {
          folio.status = 'PARTIALLY PAID';
        }

        folio.lastActivity = 'Just now';
        folio.activityTimeline.unshift({
          time: 'Just now',
          text: `Payment of ₹${pAmt.toLocaleString('en-IN')} recorded via ${pMethod} (Ref: ${pRef})`,
          user: 'Front Desk — Emp 104',
        });

        this.activeAddPaymentModal = false;
        Toast.show({ title: 'Payment Recorded', message: `₹${pAmt.toLocaleString('en-IN')} credited to Folio #${folio.folioNumber}.`, type: 'success' });
        this.renderContent();
      };
    }

    // Split Folio
    const btnSplit = this.container.querySelector('#btn-folio-split');
    if (btnSplit) {
      btnSplit.onclick = () => {
        this.activeSplitModal = true;
        this.renderContent();
      };
    }

    const btnCloseSplit = this.container.querySelector('#btn-close-split-modal');
    if (btnCloseSplit) btnCloseSplit.onclick = () => { this.activeSplitModal = false; this.renderContent(); };
    const btnCancelSplit = this.container.querySelector('#btn-cancel-split');
    if (btnCancelSplit) btnCancelSplit.onclick = () => { this.activeSplitModal = false; this.renderContent(); };

    const btnConfirmSplit = this.container.querySelector('#btn-confirm-split');
    if (btnConfirmSplit) {
      btnConfirmSplit.onclick = () => {
        folio.activityTimeline.unshift({
          time: 'Just now',
          text: `Folio charges split: Incidentals isolated to personal sub-account Folio B.`,
          user: 'Front Desk — Emp 104',
        });
        this.activeSplitModal = false;
        Toast.show({ title: 'Folio Split Complete', message: `Incidentals segregated to Folio B. Company invoice prepared.`, type: 'success' });
        this.renderContent();
      };
    }

    // Transfer Charge
    const btnTransfer = this.container.querySelector('#btn-folio-transfer');
    if (btnTransfer) {
      btnTransfer.onclick = () => {
        this.activeTransferModal = true;
        this.renderContent();
      };
    }

    const btnCloseTransfer = this.container.querySelector('#btn-close-transfer-modal');
    if (btnCloseTransfer) btnCloseTransfer.onclick = () => { this.activeTransferModal = null; this.renderContent(); };
    const btnCancelTransfer = this.container.querySelector('#btn-cancel-transfer');
    if (btnCancelTransfer) btnCancelTransfer.onclick = () => { this.activeTransferModal = null; this.renderContent(); };

    const btnConfirmTransfer = this.container.querySelector('#btn-confirm-transfer');
    if (btnConfirmTransfer) {
      btnConfirmTransfer.onclick = () => {
        const targetId = this.container.querySelector('#sel-transfer-target')?.value;
        const targetFolio = this.folios.find((f) => f.id === targetId);

        folio.activityTimeline.unshift({
          time: 'Just now',
          text: `Transferred dining charge to ${targetFolio ? targetFolio.guestName : 'Room 615'}.`,
          user: 'Front Desk — Emp 104',
        });

        this.activeTransferModal = null;
        Toast.show({ title: 'Charge Transferred', message: `Transferred successfully to ${targetFolio ? targetFolio.folioNumber : 'Room 615'}.`, type: 'success' });
        this.renderContent();
      };
    }

    // Adjustment Modal
    const btnMenuAdj = this.container.querySelector('#btn-menu-adjustment');
    if (btnMenuAdj) {
      btnMenuAdj.onclick = () => {
        this.activeAdjustmentModal = true;
        this.renderContent();
      };
    }

    const btnCloseAdj = this.container.querySelector('#btn-close-adj-modal');
    if (btnCloseAdj) btnCloseAdj.onclick = () => { this.activeAdjustmentModal = null; this.renderContent(); };
    const btnCancelAdj = this.container.querySelector('#btn-cancel-adj');
    if (btnCancelAdj) btnCancelAdj.onclick = () => { this.activeAdjustmentModal = null; this.renderContent(); };

    const btnConfirmAdj = this.container.querySelector('#btn-confirm-adj');
    if (btnConfirmAdj) {
      btnConfirmAdj.onclick = () => {
        const adjAmt = parseFloat(this.container.querySelector('#input-adj-amount')?.value || 450);
        const adjReason = this.container.querySelector('#sel-adj-reason')?.value || 'Service recovery credit';

        const newAdjTxn = {
          id: `TXN-${folio.folioNumber.replace('FOL-', '')}-${folio.transactions.length + 1}`,
          date: '14 Sep',
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          description: `Adjustment — ${adjReason}`,
          source: 'ADJUSTMENT',
          sourceLabel: 'Adjustment Credit',
          debit: 0,
          credit: adjAmt,
          tax: 0,
          reference: `ADJ-${Math.floor(100 + Math.random() * 900)}`,
          outlet: 'Front Desk Management',
          postedBy: 'Duty Manager — Rajesh Sharma',
          relatedOrder: 'MGR-AUTH',
          notes: 'Authorized service recovery adjustment credit',
        };

        folio.transactions.push(newAdjTxn);
        folio.activityTimeline.unshift({
          time: 'Just now',
          text: `Adjustment credit of -₹${adjAmt.toLocaleString('en-IN')} posted (${adjReason})`,
          user: 'Duty Mgr Rajesh S.',
        });

        this.activeAdjustmentModal = null;
        Toast.show({ title: 'Adjustment Applied', message: `-₹${adjAmt.toLocaleString('en-IN')} credited to Folio #${folio.folioNumber}.`, type: 'success' });
        this.renderContent();
      };
    }

    // Inspect Transaction Detail
    this.container.querySelectorAll('.btn-txn-inspect, .row-txn-click').forEach((el) => {
      el.onclick = (e) => {
        const txnid = el.dataset.txnid || el.closest('.row-txn-click')?.dataset.txnid;
        const txn = folio.transactions.find((t) => t.id === txnid);
        if (txn) {
          this.activeTransactionDetail = txn;
          this.renderContent();
        }
      };
    });

    const btnCloseTxnDetail = this.container.querySelector('#btn-close-txn-detail, #btn-close-txn-detail-footer');
    if (btnCloseTxnDetail) {
      btnCloseTxnDetail.onclick = () => {
        this.activeTransactionDetail = null;
        this.renderContent();
      };
    }

    const btnPrintReceipt = this.container.querySelector('#btn-txn-print-receipt');
    if (btnPrintReceipt) {
      btnPrintReceipt.onclick = () => window.print();
    }

    // Settle & Checkout Quick Connection
    const btnSettleCheckout = this.container.querySelector('#btn-quick-settle-checkout');
    if (btnSettleCheckout) {
      btnSettleCheckout.onclick = () => {
        this.activeSettleCheckoutModal = true;
        this.renderContent();
      };
    }

    const btnCloseSettle = this.container.querySelector('#btn-close-settle-modal');
    if (btnCloseSettle) btnCloseSettle.onclick = () => { this.activeSettleCheckoutModal = false; this.renderContent(); };
    const btnCancelSettle = this.container.querySelector('#btn-cancel-settle');
    if (btnCancelSettle) btnCancelSettle.onclick = () => { this.activeSettleCheckoutModal = false; this.renderContent(); };

    const btnConfirmSettleDep = this.container.querySelector('#btn-confirm-settle-departure');
    if (btnConfirmSettleDep) {
      btnConfirmSettleDep.onclick = () => {
        const fin = this.calculateFolioFinances(folio);
        if (fin.balance > 0) {
          folio.transactions.push({
            id: `TXN-${folio.folioNumber.replace('FOL-', '')}-${folio.transactions.length + 1}`,
            date: '14 Sep',
            time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
            description: 'Payment — Final Settlement at Checkout (Card on File)',
            source: 'CARD',
            sourceLabel: 'Final Settlement',
            debit: 0,
            credit: fin.balance,
            tax: 0,
            reference: 'SETTLE-CHK-01',
            outlet: 'Front Desk Checkout',
            postedBy: 'Front Desk — Emp 104',
            relatedOrder: 'CHECKOUT',
            notes: 'Settled in full for key release',
          });
        }

        folio.status = 'SETTLED';
        folio.paymentStatus = 'Fully Paid';
        folio.activityTimeline.unshift({
          time: 'Just now',
          text: `Folio balance settled in full. Checkout approved and room turnover dispatched.`,
          user: 'Front Desk — Emp 104',
        });

        this.activeSettleCheckoutModal = false;
        Toast.show({ title: 'Folio Settled', message: `Folio #${folio.folioNumber} settled. Proceeding to Departures workspace.`, type: 'success' });
        this.renderContent();
      };
    }
  }
}
