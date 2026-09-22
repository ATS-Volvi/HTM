// ==========================================================================
// VOLVITECH HOSPITALITY OS — MAINTENANCE & ENGINEERING OPERATIONS DASHBOARD
// Hotel Engineering, Work Order Management, Asset Tracking & Room Impact
// Work Order Lifecycle: OPEN → ASSIGNED → IN PROGRESS → WAITING FOR PARTS →
//                       REPAIR COMPLETE → VERIFICATION → CLOSED
// ==========================================================================

import { store } from '../state/store.js';
import { Toast } from '../components/Toast.js';

export class MaintenanceDashboardView {
  constructor() {
    this.container = null;
    this.searchQuery = '';
    this.filterArea = 'ALL';
    this.filterPriority = 'ALL';
    this.filterTechnician = 'ALL';
    this.activeQuickFilter = 'ALL';
    this.activeWorkOrderDetail = null;
    this.activePmDetail = null;
    this.activeAssetDetail = null;
    this.showCreateModal = false;
    this.showSchedulePmModal = false;
    this.showLogServiceModal = null; // asset code or null
    this.pmFrequencyFilter = 'ALL';
    this.workOrdersTab = 'dashboard';
    if (store && store.state) {
      if (!store.state.maintenanceWorkOrders || !store.state.maintenanceWorkOrders.length) {
        store.state.maintenanceWorkOrders = this._buildWorkOrders();
      }
      this.workOrders = store.state.maintenanceWorkOrders;
      if (!store.state.preventiveMaintenance || !store.state.preventiveMaintenance.length) {
        store.state.preventiveMaintenance = this._buildPreventive();
      }
      this.preventive = store.state.preventiveMaintenance;
      if (!store.state.maintenanceAssets || !store.state.maintenanceAssets.length) {
        store.state.maintenanceAssets = this._buildAssets();
      }
      this.assets = store.state.maintenanceAssets;
    } else {
      this.workOrders = this._buildWorkOrders();
      this.preventive = this._buildPreventive();
      this.assets = this._buildAssets();
    }
    this.pmSchedule = this.preventive;

    // Start background second ticker for active stopwatch service timer
    if (typeof window !== 'undefined' && !window._maintServiceTimerTicker) {
      window._maintServiceTimerTicker = setInterval(() => {
        const timer = store?.state?.activeMaintenanceTimer;
        if (timer && !timer.isPaused) {
          timer.elapsedSeconds = (timer.elapsedSeconds || 0) + 1;
          const displayEl = document.getElementById('live-timer-counter');
          if (displayEl) {
            const h = Math.floor(timer.elapsedSeconds / 3600);
            const m = Math.floor((timer.elapsedSeconds % 3600) / 60);
            const s = timer.elapsedSeconds % 60;
            displayEl.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
          }
        }
      }, 1000);
    }
    this.technicians = [
      { id: 't1', name: 'Tariq Mahmoud', initials: 'TM', role: 'Lead HVAC Engineer', specialty: 'HVAC', onDuty: true },
      { id: 't2', name: 'Marco Bellini', initials: 'MB', role: 'Plumbing Specialist', specialty: 'Plumbing', onDuty: true },
      { id: 't3', name: 'Rajesh Kumar', initials: 'RK', role: 'Kitchen Mechanical', specialty: 'Kitchen Equipment', onDuty: true },
      { id: 't4', name: 'Anil Sharma', initials: 'AS', role: 'Electrical Engineer', specialty: 'Electrical', onDuty: true },
      { id: 't5', name: 'Chen Wei', initials: 'CW', role: 'General Maintenance', specialty: 'General', onDuty: false },
    ];
  }

  async loadData() {
    return Promise.resolve();
  }

  setQuickFilter(filter) {
    this.activeQuickFilter = filter;
    this.renderContent();
  }

  _buildWorkOrders() {
    return [
      {
        id: 'MT-10482', location: 'Kitchen', area: 'Kitchen', room: null,
        assetName: 'Gas Detection System', assetCode: 'GAS-DET-KIT-01', issueType: 'Safety',
        issue: 'Gas detection alarm triggered',
        description: 'Main kitchen gas detection system triggered alarm at 10:28 AM. Source not yet identified. All gas appliances isolated as precaution.',
        priority: 'CRITICAL', status: 'IN_PROGRESS', reportedBy: 'Kitchen Supervisor', source: 'Kitchen',
        assignedTo: 'Tariq Mahmoud', guestAffected: false, guestName: null, roomImpact: 'NONE',
        partsUsed: [], partsRequired: [],
        timeline: [
          { time: '10:28 AM', action: 'Alarm triggered automatically via BMS', by: 'System' },
          { time: '10:32 AM', action: 'Assigned to Tariq Mahmoud (Lead HVAC)', by: 'Maintenance Supervisor' },
          { time: '10:38 AM', action: 'Technician on site — isolating gas supply', by: 'Tariq Mahmoud' },
          { time: '10:45 AM', action: 'Gas leak traced to faulty solenoid on Range #3', by: 'Tariq Mahmoud' },
        ],
        createdAt: '8 Sep • 10:32 AM', startedAt: '10:38 AM', elapsedMin: 28, overdue: false, slaMin: 30,
      },
      {
        id: 'MT-10483', location: 'Room 508', area: 'Guest Rooms', room: '508',
        assetName: 'Samsung DVM S Air Conditioner', assetCode: 'AC-508-01', issueType: 'HVAC',
        issue: 'Air conditioning not cooling',
        description: 'Guest reports AC running but room temperature not dropping. Room at 27°C vs setpoint 20°C. Guest in room — 72 minutes elapsed.',
        priority: 'HIGH', status: 'WAITING_FOR_PARTS', reportedBy: 'Front Desk', source: 'Front Desk',
        assignedTo: 'Tariq Mahmoud', guestAffected: true, guestName: 'John Smith', guestRoom: '508',
        roomImpact: 'OUT_OF_SERVICE', partsUsed: [],
        partsRequired: [{ name: 'Daikin VRV 2-Way Valve Actuator', qty: 1, cost: 145, source: 'ENG-SPARE', available: false }],
        timeline: [
          { time: '09:50 AM', action: 'Guest reported AC failure via Guest App', by: 'Guest App' },
          { time: '09:52 AM', action: 'Ticket created by Front Desk', by: 'Julian Croft' },
          { time: '10:20 AM', action: 'Technician started inspection', by: 'Tariq Mahmoud' },
          { time: '10:40 AM', action: 'Compressor OK, valve actuator faulty — part required', by: 'Tariq Mahmoud' },
        ],
        createdAt: '8 Sep • 09:52 AM', startedAt: '10:20 AM', elapsedMin: 72, overdue: true, slaMin: 60,
      },
      {
        id: 'MT-10484', location: 'Room 402', area: 'Guest Rooms', room: '402',
        assetName: 'Samsung QLED 65" Smart TV', assetCode: 'TV-402-01', issueType: 'Electrical',
        issue: 'Television not switching on',
        description: 'Guest reports TV not turning on. Remote batteries replaced. TV power indicator not lit. Possible fuse or board failure.',
        priority: 'NORMAL', status: 'ASSIGNED', reportedBy: 'Housekeeping', source: 'Housekeeping',
        assignedTo: 'Anil Sharma', guestAffected: true, guestName: 'Mr. James Harrison', guestRoom: '402',
        roomImpact: 'NONE', partsUsed: [], partsRequired: [],
        timeline: [
          { time: '09:15 AM', action: 'Reported by Housekeeping during room inspection', by: 'Elena Gomez' },
          { time: '09:18 AM', action: 'Ticket created and assigned to Anil Sharma', by: 'System' },
        ],
        createdAt: '8 Sep • 09:18 AM', startedAt: null, elapsedMin: 95, overdue: false, slaMin: 120,
      },
      {
        id: 'MT-10485', location: 'Lobby', area: 'Public Areas', room: null,
        assetName: 'Schindler 3300 Passenger Lift', assetCode: 'LIFT-MAIN-01', issueType: 'Mechanical',
        issue: 'Elevator door closing slowly',
        description: 'Main lobby elevator door closing time 4-5 seconds vs normal 2 seconds. Door sensor check required. Multiple guests reported.',
        priority: 'HIGH', status: 'OPEN', reportedBy: 'Front Desk', source: 'Front Desk',
        assignedTo: 'Unassigned', guestAffected: true, guestName: null, roomImpact: 'NONE',
        partsUsed: [], partsRequired: [],
        timeline: [
          { time: '08:42 AM', action: 'Guest reported elevator door issue at reception', by: 'Julian Croft' },
          { time: '08:44 AM', action: 'Work order created — pending technician assignment', by: 'Julian Croft' },
        ],
        createdAt: '8 Sep • 08:44 AM', startedAt: null, elapsedMin: 129, overdue: true, slaMin: 90,
      },
      {
        id: 'MT-10486', location: 'Room 303', area: 'Guest Rooms', room: '303',
        assetName: 'Hansgrohe Raindance Shower', assetCode: 'PLUMB-303-SHW', issueType: 'Plumbing',
        issue: 'Shower water pressure very low',
        description: 'Ambassador Al-Mansoor reported shower pressure drop. PRV valve possibly blocked. Suite guest — treat as high priority.',
        priority: 'HIGH', status: 'IN_PROGRESS', reportedBy: 'Front Desk', source: 'Front Desk',
        assignedTo: 'Marco Bellini', guestAffected: true, guestName: 'Ambassador Al-Mansoor', guestRoom: '303',
        roomImpact: 'NONE',
        partsUsed: [{ name: 'PRV Pressure Valve (3/4")', qty: 1, cost: 320, source: 'ENG-SPARE', installed: true }],
        partsRequired: [],
        timeline: [
          { time: '07:30 AM', action: 'Guest reported low water pressure', by: 'Ambassador Al-Mansoor' },
          { time: '07:32 AM', action: 'Ticket created by Front Desk', by: 'Julian Croft' },
          { time: '07:55 AM', action: 'Inspected PRV valve — replacing component', by: 'Marco Bellini' },
          { time: '08:15 AM', action: 'PRV replaced, pressure restored to normal', by: 'Marco Bellini' },
        ],
        createdAt: '8 Sep • 07:32 AM', startedAt: '07:55 AM', elapsedMin: 165, overdue: false, slaMin: 180,
      },
      {
        id: 'MT-10487', location: 'Kitchen', area: 'Kitchen', room: null,
        assetName: 'Rational iCombi Pro Combi-Oven', assetCode: 'KIT-OVN-04', issueType: 'Kitchen Equipment',
        issue: 'Steam injection boiler descaling alert',
        description: 'Boiler descaling alert triggered on iCombi Pro. Steam injection solenoid needs calibration after descaling cycle. Kitchen operations partially affected.',
        priority: 'NORMAL', status: 'WAITING_FOR_PARTS', reportedBy: 'Kitchen', source: 'Kitchen',
        assignedTo: 'Rajesh Kumar', guestAffected: false, guestName: null, roomImpact: 'NONE',
        partsUsed: [],
        partsRequired: [{ name: 'Rational Descaling Tabs (24-pack)', qty: 2, cost: 180, source: 'ENG-SPARE', available: true }],
        timeline: [
          { time: '06:30 AM', action: 'Alert triggered on oven control panel', by: 'System' },
          { time: '08:00 AM', action: 'Inspection complete — descaling tabs needed from store', by: 'Rajesh Kumar' },
          { time: '08:05 AM', action: 'Status changed to Waiting for Parts', by: 'Rajesh Kumar' },
        ],
        createdAt: '8 Sep • 07:05 AM', startedAt: '08:00 AM', elapsedMin: 228, overdue: true, slaMin: 120,
      },
      {
        id: 'MT-10488', location: 'Room 406', area: 'Guest Rooms', room: '406',
        assetName: 'Daikin Cassette AC Unit', assetCode: 'AC-406-01', issueType: 'HVAC',
        issue: 'Quarterly PM — AC filter service',
        description: 'Scheduled quarterly preventive maintenance. Filter cleaning, coil sanitization, and refrigerant check completed successfully.',
        priority: 'LOW', status: 'CLOSED', reportedBy: 'PM Schedule', source: 'PM Schedule',
        assignedTo: 'Tariq Mahmoud', guestAffected: false, guestName: null, roomImpact: 'NONE',
        partsUsed: [{ name: 'AC Filter Set (Daikin F25)', qty: 1, cost: 85, source: 'ENG-SPARE', installed: true }],
        partsRequired: [],
        timeline: [
          { time: '06:00 AM', action: 'PM work order auto-generated by schedule', by: 'System' },
          { time: '06:15 AM', action: 'Technician started PM service', by: 'Tariq Mahmoud' },
          { time: '07:05 AM', action: 'Verified and closed by Maintenance Supervisor', by: 'Maintenance Supervisor' },
        ],
        createdAt: '8 Sep • 06:00 AM', startedAt: '06:15 AM', elapsedMin: 65, overdue: false, slaMin: 120,
      },
    ];
  }

  _buildAssets() {
    return [
      {
        id: 'a1',
        name: 'Samsung DVM S AC Unit',
        code: 'AC-508-01',
        category: 'HVAC',
        location: 'Room 508',
        manufacturer: 'Samsung Electronics',
        model: 'DVM S Outdoor AM050FXVAGH',
        serial: 'DVM-508-2022-A',
        purchaseDate: 'Jan 2022',
        warranty: 'Jan 2025 (Expired)',
        status: 'Under Repair',
        lastMaint: '14 Jul 2026',
        nextMaint: '14 Oct 2026',
        totalHoursWorked: '14.5 hrs',
        history: [
          {
            id: 'srv-101',
            date: '14 Jul 2026 • 09:30 AM',
            engineer: 'Tariq Mahmoud',
            engineerRole: 'Lead HVAC Engineer',
            serviceType: 'Quarterly PM Service — Cycle #13',
            duration: '1h 15m',
            durationMinutes: 75,
            notes: 'Refrigerant line pressure nominal at 4.2 bar. Cleaned primary air filters, flushed condensate tray, calibrated digital room sensor.',
            parts: ['1x Daikin F25 Pre-filter Set', '0.5L Coil Cleaner'],
            status: 'VERIFIED'
          },
          {
            id: 'srv-102',
            date: '22 Apr 2026 • 02:15 PM',
            engineer: 'Marco Bellini',
            engineerRole: 'Plumbing & Mechanical',
            serviceType: 'Filter & Drain Line Service',
            duration: '45m',
            durationMinutes: 45,
            notes: 'Cleared condensate drain blockage on floor 5 branch riser. Flushed line with enzyme bio-tablet.',
            parts: ['Drain Pipe Seal Ring 32mm'],
            status: 'VERIFIED'
          },
          {
            id: 'srv-103',
            date: '18 Jan 2026 • 11:00 AM',
            engineer: 'Tariq Mahmoud',
            engineerRole: 'Lead HVAC Engineer',
            serviceType: 'Annual Refrigerant & Electrical Overhaul',
            duration: '2h 30m',
            durationMinutes: 150,
            notes: 'Checked compressor motor insulation resistance (nominal > 100MΩ). Topped up 0.8kg R410A refrigerant gas.',
            parts: ['R410A Refrigerant (0.8kg)', 'Magnetic Contactor 24V'],
            status: 'VERIFIED'
          }
        ]
      },
      {
        id: 'a2',
        name: 'Samsung QLED 65"',
        code: 'TV-402-01',
        category: 'AV Equipment',
        location: 'Room 402',
        manufacturer: 'Samsung',
        model: 'QLED QN65Q80C Hospitality Edition',
        serial: 'SAM-TV-4020-B',
        purchaseDate: 'Mar 2023',
        warranty: 'Mar 2026 (Active)',
        status: 'Under Repair',
        lastMaint: '01 Jan 2026',
        nextMaint: '01 Jul 2026',
        totalHoursWorked: '3.5 hrs',
        history: [
          {
            id: 'srv-201',
            date: '01 Jan 2026 • 10:00 AM',
            engineer: 'Anil Sharma',
            engineerRole: 'Electrical Engineer',
            serviceType: 'Annual AV & IPTV Inspection',
            duration: '35m',
            durationMinutes: 35,
            notes: 'Updated hospitality firmware to v4.18. Verified HDMI matrix lock and guest screen casting privacy reset.',
            parts: ['Cat6 RJ45 Patch Cable 2m'],
            status: 'VERIFIED'
          },
          {
            id: 'srv-202',
            date: '22 Sep 2025 • 04:30 PM',
            engineer: 'Chen Wei',
            engineerRole: 'General Maintenance',
            serviceType: 'Hardware Replacement',
            duration: '20m',
            durationMinutes: 20,
            notes: 'Replaced guest remote control with antibacterial silicone sealed hospitality remote. Paired Bluetooth handset.',
            parts: ['Samsung Hospitality Remote BN59-01301A'],
            status: 'VERIFIED'
          }
        ]
      },
      {
        id: 'a3',
        name: 'Kitchen Gas Detection System',
        code: 'GAS-DET-KIT-01',
        category: 'Safety Equipment',
        location: 'Kitchen',
        manufacturer: 'Honeywell Analytics',
        model: 'Sensepoint XCL & 301-C Controller',
        serial: 'HW-GAS-KIT-001',
        purchaseDate: 'Jun 2020',
        warranty: 'Jun 2023 (Expired - Covered by AMC)',
        status: 'Under Inspection',
        lastMaint: '01 Jun 2026',
        nextMaint: '01 Sep 2026',
        totalHoursWorked: '18.0 hrs',
        history: [
          {
            id: 'srv-301',
            date: '01 Jun 2026 • 07:00 AM',
            engineer: 'Tariq Mahmoud',
            engineerRole: 'Lead HVAC & Safety Engineer',
            serviceType: 'Annual Safety Certification & Span Gas Calibration',
            duration: '2h 00m',
            durationMinutes: 120,
            notes: 'Calibrated Methane (CH4) and Carbon Monoxide (CO) electrochemical sensors using certified 50% LEL span calibration gas canister.',
            parts: ['Sensor Cartridge CO 0-500ppm', 'Calibration Cap O-Ring'],
            status: 'VERIFIED'
          },
          {
            id: 'srv-302',
            date: '01 Mar 2026 • 06:30 AM',
            engineer: 'Rajesh Kumar',
            engineerRole: 'Kitchen Mechanical Specialist',
            serviceType: 'Quarterly Sensor Zero & Response Test',
            duration: '1h 10m',
            durationMinutes: 70,
            notes: 'Bump tested 4 gas sensors above main cooking ranges. Solenoid automatic gas shut-off valve tripped within 1.8 seconds.',
            parts: [],
            status: 'VERIFIED'
          }
        ]
      },
      {
        id: 'a4',
        name: 'Schindler 3300 Passenger Lift',
        code: 'LIFT-MAIN-01',
        category: 'Vertical Transport',
        location: 'Lobby',
        manufacturer: 'Schindler Group',
        model: 'Schindler 3300 MRL 1000kg',
        serial: 'SCH-LIFT-2019-TGM',
        purchaseDate: 'Sep 2019',
        warranty: 'Sep 2024 (Under Schindler Gold AMC)',
        status: 'Operational — Degraded',
        lastMaint: '15 Aug 2026',
        nextMaint: '15 Nov 2026',
        totalHoursWorked: '32.0 hrs',
        history: [
          {
            id: 'srv-401',
            date: '15 Aug 2026 • 08:00 AM',
            engineer: 'Marco Bellini',
            engineerRole: 'Plumbing & Mechanical Specialist',
            serviceType: 'Quarterly Joint Schindler Inspection',
            duration: '3h 15m',
            durationMinutes: 195,
            notes: 'Lubricated car guide rails, inspected traction steel belts for cord exposure, adjusted door opening dwell profile.',
            parts: ['Schindler Synthetic Guide Lubricant 1L', 'Door Belt Tension Springs'],
            status: 'VERIFIED'
          },
          {
            id: 'srv-402',
            date: '12 May 2026 • 11:30 PM',
            engineer: 'Anil Sharma',
            engineerRole: 'Electrical Engineer',
            serviceType: 'Door Light Curtain Sensor Replacement',
            duration: '1h 45m',
            durationMinutes: 105,
            notes: 'Replaced infrared safety ray curtain on Lobby car door. Realigned emitter optical diodes.',
            parts: ['Cedam Light Curtain RX/TX Pair'],
            status: 'VERIFIED'
          }
        ]
      },
      {
        id: 'a5',
        name: 'Rational iCombi Pro',
        code: 'KIT-OVN-04',
        category: 'Kitchen Equipment',
        location: 'Kitchen',
        manufacturer: 'Rational AG',
        model: 'iCombi Pro 10-1/1 Electric',
        serial: 'RAT-ICP-KIT-04',
        purchaseDate: 'Feb 2021',
        warranty: 'Feb 2024 (Active Rational Service Contract)',
        status: 'Awaiting Parts',
        lastMaint: '01 May 2026',
        nextMaint: '01 Aug 2026',
        totalHoursWorked: '21.5 hrs',
        history: [
          {
            id: 'srv-501',
            date: '01 May 2026 • 11:00 PM',
            engineer: 'Rajesh Kumar',
            engineerRole: 'Kitchen Mechanical Specialist',
            serviceType: 'Steam Generator Descaling & Care Run',
            duration: '1h 30m',
            durationMinutes: 90,
            notes: 'Ran automated CareControl descaling program with 6 Active Green tabs. Replaced interior halogen lamp seal.',
            parts: ['6x Rational Active Green Tablets', 'Door Gasket Profile 10-1/1'],
            status: 'VERIFIED'
          },
          {
            id: 'srv-502',
            date: '01 Feb 2026 • 10:30 PM',
            engineer: 'Rajesh Kumar',
            engineerRole: 'Kitchen Mechanical Specialist',
            serviceType: 'Annual Steam Boiler Inspection',
            duration: '2h 15m',
            durationMinutes: 135,
            notes: 'Disassembled boiler inspection port, flushed calcium deposit slurry. Calibrated meat core temperature probe.',
            parts: ['Steam Boiler O-Ring 80mm', 'Scale Prevention Cartridge'],
            status: 'VERIFIED'
          }
        ]
      },
      {
        id: 'a6',
        name: 'Cummins Diesel Generator',
        code: 'GEN-MAIN-01',
        category: 'Power Systems',
        location: 'Basement Engineering',
        manufacturer: 'Cummins Power Generation',
        model: 'C150D5 Standby Genset (150 kVA)',
        serial: 'CUM-GEN-2018-TGM',
        purchaseDate: 'Mar 2018',
        warranty: 'Expired (Self-Maintained by Hotel Engineering)',
        status: 'Operational',
        lastMaint: '01 Jul 2026',
        nextMaint: '01 Oct 2026',
        totalHoursWorked: '42.0 hrs',
        history: [
          {
            id: 'srv-601',
            date: '01 Jul 2026 • 10:00 AM',
            engineer: 'Anil Sharma',
            engineerRole: 'Electrical Engineer',
            serviceType: 'Monthly Load Test & Oil Sampling',
            duration: '2h 00m',
            durationMinutes: 120,
            notes: 'Executed 30m full load step test via artificial load bank. Lubricating oil analysis showed no soot or fuel dilution.',
            parts: ['Fleetguard Oil Filter LF16015', 'Fuel Filter Separator FS19732'],
            status: 'VERIFIED'
          },
          {
            id: 'srv-602',
            date: '01 Apr 2026 • 09:30 AM',
            engineer: 'Anil Sharma',
            engineerRole: 'Electrical Engineer',
            serviceType: 'Quarterly Battery & Governor Calibration',
            duration: '1h 45m',
            durationMinutes: 105,
            notes: 'Replaced dual 12V 100Ah heavy-duty lead acid start batteries. Calibrated electronic speed governor actuator.',
            parts: ['2x Exide HD-100 Start Batteries', 'Battery Terminal Grease'],
            status: 'VERIFIED'
          }
        ]
      },
      {
        id: 'a7',
        name: 'Prominent Pool Chlorination Plant',
        code: 'POOL-TREAT-01',
        category: 'Water & Filtration',
        location: 'Pool and Spa',
        manufacturer: 'ProMinent GmbH',
        model: 'DULCODOS Pool Professional',
        serial: 'PROM-POOL-2021-DXB',
        purchaseDate: 'Aug 2021',
        warranty: 'Aug 2024 (Covered by Spa Facility AMC)',
        status: 'Operational',
        lastMaint: '03 Sep 2026',
        nextMaint: '10 Sep 2026',
        totalHoursWorked: '68.0 hrs',
        history: [
          {
            id: 'srv-701',
            date: '03 Sep 2026 • 07:00 AM',
            engineer: 'Rajesh Kumar',
            engineerRole: 'Kitchen & Mechanical Specialist',
            serviceType: 'Weekly Chlorination & Filter Backwash (Cycle #85)',
            duration: '48m',
            durationMinutes: 48,
            notes: 'Free Chlorine at 2.1 ppm, pH 7.35. Backwashed sand filters #1 and #2. Refilled 20L sodium hypochlorite reservoir.',
            parts: ['20L Sodium Hypochlorite 12.5%', 'Filter Sand Grade #1 (5kg top-up)'],
            status: 'VERIFIED'
          },
          {
            id: 'srv-702',
            date: '27 Aug 2026 • 07:15 AM',
            engineer: 'Rajesh Kumar',
            engineerRole: 'Kitchen & Mechanical Specialist',
            serviceType: 'Weekly Routine Inspection (Cycle #84)',
            duration: '42m',
            durationMinutes: 42,
            notes: 'ORP sensor probe cleaned with mild acid solution. Dosing pump peristaltic squeeze tube checked for micro-cracks.',
            parts: ['Dosing Squeeze Tube 4x7mm'],
            status: 'VERIFIED'
          }
        ]
      }
    ];
  }

  _buildPreventive() {
    return [
      {
        id: 'pm1',
        title: 'AC Filter Service — Rooms 401-406',
        location: 'Floor 4 Suites',
        assetCode: 'AC-FLOOR4',
        assetName: 'Daikin Cassette AC Units',
        frequency: 'Quarterly',
        scheduleRule: 'Quarterly • 12th of Month • 08:30 AM',
        dueDate: '12 Sep 2026',
        dueTime: '08:30 AM',
        daysUntil: 4,
        lastCompleted: '12 Jun 2026',
        assignedTo: 'Tariq Mahmoud',
        notifyAdvanceDays: 7,
        estimatedDuration: '1h 30m',
        cycleCount: 14,
        status: 'UPCOMING',
        checklist: [
          'Inspect and thoroughly wash primary air intake nylon pre-filters',
          'Measure refrigerant line suction pressure & temp differential (ΔT ≥ 8°C)',
          'Sanitize evaporator condensation drain tray & flush pump discharge line',
          'Test wall thermostat sensor calibration & fan 3-speed stepped relay'
        ],
        sop: 'Standard HVAC Quarter-turn PM protocol. Tag out isolator switch before servicing fan coil motor.',
        linkedWoId: null,
        notificationSent: false
      },
      {
        id: 'pm2',
        title: 'Cummins Generator — Load Test & Oil',
        location: 'Basement Engineering',
        assetCode: 'GEN-MAIN-01',
        assetName: 'Cummins C150D5 Diesel Generator',
        frequency: 'Monthly',
        scheduleRule: 'Monthly • 15th of Month • 10:00 AM',
        dueDate: '15 Sep 2026',
        dueTime: '10:00 AM',
        daysUntil: 7,
        lastCompleted: '15 Aug 2026',
        assignedTo: 'Anil Sharma',
        notifyAdvanceDays: 7,
        estimatedDuration: '2h 00m',
        cycleCount: 28,
        status: 'UPCOMING',
        checklist: [
          'Verify starter battery terminal voltage (nominal 24.8V DC)',
          'Inspect lube oil level, viscosity and coolant jacket heater',
          'Execute 30-minute off-load run & 15-minute simulated load transfer',
          'Inspect fuel day-tank level (min 85% capacity required) and water separator'
        ],
        sop: 'Critical emergency power asset. Log frequency (50Hz ±0.5) and output voltage on central BMS logbook.',
        linkedWoId: null,
        notificationSent: false
      },
      {
        id: 'pm3',
        title: 'Fire Suppression System Inspection',
        location: 'All Floors',
        assetCode: 'FIRE-SYS-01',
        assetName: 'Honeywell Notifier Fire Sprinkler & Alarm System',
        frequency: 'Semi-Annual',
        scheduleRule: 'Semi-Annual • 18th of Mar/Sep • 06:00 AM',
        dueDate: '18 Sep 2026',
        dueTime: '06:00 AM',
        daysUntil: 10,
        lastCompleted: '18 Mar 2026',
        assignedTo: 'Tariq Mahmoud',
        notifyAdvanceDays: 14,
        estimatedDuration: '3h 00m',
        cycleCount: 8,
        status: 'SCHEDULED',
        checklist: [
          'Test diesel jockey pump automatic pressure cut-in switch (at 7.5 bar)',
          'Inspect riser flow valves and tamper switches on Floors 1-5',
          'Verify optical smoke detectors in public corridors and kitchen hood interlock',
          'Verify civil defense direct dialer monitoring circuit test'
        ],
        sop: 'Notify front desk and duty manager 1 hour before acoustic bell strobe test. Reset repeater panel after run.',
        linkedWoId: null,
        notificationSent: false
      },
      {
        id: 'pm4',
        title: 'Pool Water Treatment System',
        location: 'Pool and Spa',
        assetCode: 'POOL-TREAT-01',
        assetName: 'Prominent Pool Chlorination & Filtration Plant',
        frequency: 'Weekly',
        scheduleRule: 'Weekly • Every Wednesday • 07:00 AM',
        dueDate: '10 Sep 2026',
        dueTime: '07:00 AM',
        daysUntil: 2,
        lastCompleted: '03 Sep 2026',
        assignedTo: 'Rajesh Kumar',
        notifyAdvanceDays: 3,
        estimatedDuration: '45m',
        cycleCount: 86,
        status: 'DUE_SOON',
        checklist: [
          'Chemical testing: Free Chlorine (1.5 - 3.0 ppm), pH (7.2 - 7.6)',
          'Backwash and rinse dual sand filtration media vessels',
          'Check chemical dosing peristaltic pumps and refill hypochlorite carboys',
          'Inspect automated ORP sensor probe calibration'
        ],
        sop: 'Daily & Weekly health department logbook entry mandatory before 08:00 AM guest pool opening.',
        linkedWoId: null,
        notificationSent: false
      },
      {
        id: 'pm5',
        title: 'Kitchen Exhaust Hood & Grease Trap Degreasing',
        location: 'Kitchen',
        assetCode: 'KIT-HOOD-01',
        assetName: 'CaptiveAire Kitchen Extraction Hoods',
        frequency: 'Monthly',
        scheduleRule: 'Monthly • 14th of Month • 11:30 PM',
        dueDate: '14 Sep 2026',
        dueTime: '11:30 PM',
        daysUntil: 6,
        lastCompleted: '14 Aug 2026',
        assignedTo: 'Rajesh Kumar',
        notifyAdvanceDays: 7,
        estimatedDuration: '2h 15m',
        cycleCount: 19,
        status: 'UPCOMING',
        checklist: [
          'Soak and pressure wash baffle filters in caustic degreasing vat',
          'Scrape grease collection gutter troughs and clean discharge spouts',
          'Check belt tension on rooftop exhaust centrifugal fans',
          'Empty grease interceptor pit and dose bio-enzymatic treatment'
        ],
        sop: 'Must be performed after kitchen culinary night shutdown. Lock out exhaust fans at rooftop breaker.',
        linkedWoId: null,
        notificationSent: false
      },
      {
        id: 'pm6',
        title: 'Cold Water Booster Pump Station & Pressure Vessels',
        location: 'Basement Pump Room',
        assetCode: 'PUMP-BOOST-01',
        assetName: 'Grundfos Hydro MPC Booster Set',
        frequency: 'Weekly',
        scheduleRule: 'Weekly • Every Sunday • 06:00 AM',
        dueDate: '13 Sep 2026',
        dueTime: '06:00 AM',
        daysUntil: 5,
        lastCompleted: '06 Sep 2026',
        assignedTo: 'Marco Bellini',
        notifyAdvanceDays: 3,
        estimatedDuration: '40m',
        cycleCount: 52,
        status: 'UPCOMING',
        checklist: [
          'Inspect delivery manifold pressure (target 4.8 bar)',
          'Check diaphragm expansion tanks pre-charge pressure (3.2 bar)',
          'Verify variable speed frequency drive (VFD) sequencing',
          'Inspect mechanical shaft seals for weeping or motor overheating'
        ],
        sop: 'Perform early morning before peak guest morning shower demand.',
        linkedWoId: null,
        notificationSent: false
      },
      {
        id: 'pm7',
        title: 'Main Lobby Elevator — Schindler Service',
        location: 'Lobby',
        assetCode: 'LIFT-MAIN-01',
        assetName: 'Schindler 3300 Passenger Lift',
        frequency: 'Quarterly',
        scheduleRule: 'Quarterly • 15th of Nov/Feb/May/Aug • 08:00 AM',
        dueDate: '15 Nov 2026',
        dueTime: '08:00 AM',
        daysUntil: 68,
        lastCompleted: '15 Aug 2026',
        assignedTo: 'Marco Bellini',
        notifyAdvanceDays: 14,
        estimatedDuration: '3h 30m',
        cycleCount: 12,
        status: 'SCHEDULED',
        checklist: [
          'Inspect car guide shoe wear, gib clearance, and rail lubrication',
          'Test car door interlock switches and light curtain sensor response',
          'Inspect traction machine gearbox oil, brake air gap, and rope tension',
          'Verify emergency car alarm telephone and battery backup descent'
        ],
        sop: 'Coordinate with Schindler certified technician. Place Out of Service barriers at Ground & Penthouse landing.',
        linkedWoId: null,
        notificationSent: false
      }
    ];
  }

  // ── Preventive Scheduling Helpers ─────────────────────────────────────────
  _addFrequencyToDate(dateStr, frequency) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const parts = (dateStr || '').trim().split(' ');
    if (parts.length < 3) return dateStr;
    const day = parseInt(parts[0], 10);
    const monthIdx = months.indexOf(parts[1]);
    const year = parseInt(parts[2], 10);
    if (monthIdx === -1 || isNaN(day) || isNaN(year)) return dateStr;

    const d = new Date(year, monthIdx, day);
    if (frequency === 'Daily') d.setDate(d.getDate() + 1);
    else if (frequency === 'Weekly') d.setDate(d.getDate() + 7);
    else if (frequency === 'Bi-Weekly') d.setDate(d.getDate() + 14);
    else if (frequency === 'Monthly') d.setMonth(d.getMonth() + 1);
    else if (frequency === 'Quarterly') d.setMonth(d.getMonth() + 3);
    else if (frequency === 'Semi-Annual') d.setMonth(d.getMonth() + 6);
    else if (frequency === 'Annual') d.setFullYear(d.getFullYear() + 1);
    else d.setDate(d.getDate() + 7);

    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  _calcDaysUntil(dateStr) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const parts = (dateStr || '').trim().split(' ');
    if (parts.length < 3) return 7;
    const day = parseInt(parts[0], 10);
    const monthIdx = months.indexOf(parts[1]);
    const year = parseInt(parts[2], 10);
    if (monthIdx === -1) return 7;
    // Base simulation reference date: 8 Sep 2026
    const baseDate = new Date(2026, 8, 8);
    const targetDate = new Date(year, monthIdx, day);
    const diff = targetDate.getTime() - baseDate.getTime();
    return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
  }

  _calculateFutureCycles(startDate, frequency, count = 4) {
    const cycles = [];
    let cur = startDate;
    for (let i = 0; i < count; i++) {
      cur = this._addFrequencyToDate(cur, frequency);
      cycles.push(cur);
    }
    return cycles;
  }

  _calcCountdown(dueDateStr, dueTimeStr = '08:00 AM') {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const parts = (dueDateStr || '').trim().split(' ');
    if (parts.length < 3) return { text: 'Scheduled', clock: 'Scheduled', isOverdue: false, urgency: 'normal', days: 7, hours: 0, minutes: 0 };
    const day = parseInt(parts[0], 10);
    const monthIdx = months.indexOf(parts[1]);
    const year = parseInt(parts[2], 10);
    if (monthIdx === -1 || isNaN(day) || isNaN(year)) return { text: 'Scheduled', clock: 'Scheduled', isOverdue: false, urgency: 'normal', days: 7, hours: 0, minutes: 0 };

    let hour = 8;
    let min = 0;
    if (dueTimeStr) {
      const tp = dueTimeStr.trim().split(' ');
      const [hh, mm] = (tp[0] || '08:00').split(':');
      hour = parseInt(hh, 10);
      min = parseInt(mm || '0', 10);
      if (tp[1] === 'PM' && hour < 12) hour += 12;
      if (tp[1] === 'AM' && hour === 12) hour = 0;
    }

    // Base simulation reference time: 8 Sep 2026, 08:00 AM
    const base = new Date(2026, 8, 8, 8, 0, 0);
    const target = new Date(year, monthIdx, day, hour, min, 0);
    const diffMs = target.getTime() - base.getTime();

    if (diffMs <= 0) {
      const overdueHours = Math.max(1, Math.abs(Math.round(diffMs / (1000 * 60 * 60))));
      return {
        label: 'OVERDUE',
        text: `Overdue by ${overdueHours}h`,
        clock: `🚨 Overdue (${overdueHours}h)`,
        isOverdue: true,
        urgency: 'critical',
        days: 0, hours: 0, minutes: 0
      };
    }

    const totalMin = Math.floor(diffMs / (1000 * 60));
    const days = Math.floor(totalMin / (60 * 24));
    const hours = Math.floor((totalMin % (60 * 24)) / 60);
    const minutes = totalMin % 60;

    const clock = `${String(days).padStart(2,'0')}d : ${String(hours).padStart(2,'0')}h : ${String(minutes).padStart(2,'0')}m`;
    const text = days > 0 ? `${days}d ${hours}h left` : `${hours}h ${minutes}m left`;

    return {
      days,
      hours,
      minutes,
      text,
      clock,
      isOverdue: false,
      urgency: days <= 1 ? 'critical' : (days <= 3 ? 'warning' : 'normal')
    };
  }

  _startServiceTimer(pmId) {
    const pm = this.preventive.find(p => p.id === pmId);
    if (!pm) return;
    if (store && store.state) {
      store.state.activeMaintenanceTimer = {
        pmId: pm.id,
        assetCode: pm.assetCode,
        assetName: pm.assetName || pm.title,
        title: pm.title,
        frequency: pm.frequency,
        cycleCount: pm.cycleCount || 1,
        engineer: pm.assignedTo,
        startedAtFormatted: new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }),
        startTimestamp: Date.now(),
        elapsedSeconds: 0,
        isPaused: false
      };
      store.notify();
    }
    pm.status = 'IN_PROGRESS';
    Toast.show({
      title: '⏱️ Service Timer Started',
      message: `${pm.assignedTo} started servicing ${pm.assetCode} (${pm.title}). Live stopwatch tracking service duration.`,
      type: 'info'
    });
    this.renderContent();
  }

  _pauseServiceTimer() {
    const timer = store?.state?.activeMaintenanceTimer;
    if (!timer) return;
    timer.isPaused = !timer.isPaused;
    if (store) store.notify();
    Toast.show({
      title: timer.isPaused ? 'Timer Paused' : 'Timer Resumed',
      message: `Work timer on ${timer.assetCode} is now ${timer.isPaused ? 'paused' : 'running'}.`,
      type: 'info'
    });
    this.renderContent();
  }

  _stopAndLogServiceTimer(customNotes = '') {
    const timer = store?.state?.activeMaintenanceTimer;
    if (!timer) return;

    const elapsed = timer.elapsedSeconds || 60;
    const durationMinutes = Math.max(1, Math.round(elapsed / 60));
    const durationFormatted = elapsed < 3600
      ? `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`
      : `${Math.floor(elapsed / 3600)}h ${Math.floor((elapsed % 3600) / 60)}m`;

    // 1. Log to Machine History
    const asset = this.assets.find(a => a.code === timer.assetCode);
    if (asset) {
      if (!Array.isArray(asset.history)) asset.history = [];
      const serviceEntry = {
        id: `srv-${Date.now()}`,
        date: `8 Sep 2026 • ${new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}`,
        engineer: timer.engineer,
        engineerRole: this.technicians.find(t => t.name === timer.engineer)?.role || 'Service Engineer',
        serviceType: `${timer.frequency} PM Service (Cycle #${timer.cycleCount})`,
        duration: durationFormatted,
        durationMinutes,
        notes: customNotes || `Completed on-time service routine via Live Service Timer. Operational telemetry verified nominal.`,
        parts: [],
        status: 'VERIFIED'
      };
      asset.history.unshift(serviceEntry);
      const totalMins = asset.history.reduce((acc, h) => acc + (h.durationMinutes || 60), 0);
      asset.totalHoursWorked = `${(totalMins / 60).toFixed(1)} hrs`;
      asset.lastMaint = '8 Sep 2026';
    }

    // 2. Advance PM cycle
    this._advancePmCycle(timer.pmId);

    // 3. Clear active timer
    if (store && store.state) {
      store.state.activeMaintenanceTimer = null;
      store.notify();
    }

    Toast.show({
      title: '✓ Service Completed & Logged',
      message: `Logged ${durationFormatted} of service by ${timer.engineer} to ${timer.assetCode} history logbook.`,
      type: 'success'
    });
    this.renderContent();
  }

  _addServiceHistory(assetCode, entry) {
    const asset = this.assets.find(a => a.code === assetCode);
    if (!asset) return;
    if (!Array.isArray(asset.history)) asset.history = [];
    asset.history.unshift(entry);
    const totalMins = asset.history.reduce((acc, h) => acc + (entry.durationMinutes || 60), 0);
    asset.totalHoursWorked = `${(totalMins / 60).toFixed(1)} hrs`;
    asset.lastMaint = entry.date.split('•')[0].trim();
    if (store) store.notify();
    Toast.show({
      title: 'Logbook Updated',
      message: `Added service record by ${entry.engineer} to ${asset.code} (${asset.name}).`,
      type: 'success'
    });
    this.renderContent();
  }

  _advancePmCycle(pmId) {
    const pm = this.preventive.find(p => p.id === pmId);
    if (!pm) return;
    const oldDueDate = pm.dueDate;
    const nextDate = this._addFrequencyToDate(pm.dueDate, pm.frequency);
    pm.lastCompleted = '8 Sep 2026';
    pm.dueDate = nextDate;
    pm.daysUntil = this._calcDaysUntil(nextDate);
    pm.cycleCount = (pm.cycleCount || 0) + 1;
    pm.notificationSent = false;
    pm.status = pm.daysUntil <= 2 ? 'DUE_SOON' : (pm.daysUntil <= (pm.notifyAdvanceDays || 7) ? 'UPCOMING' : 'SCHEDULED');

    if (pm.linkedWoId) {
      const wo = this.workOrders.find(w => w.id === pm.linkedWoId);
      if (wo) {
        wo.status = 'REPAIR_COMPLETE';
        wo.timeline.push({ time: 'Just now', action: `PM Service cycle #${pm.cycleCount} completed and verified`, by: 'System PM Engine' });
      }
      pm.linkedWoId = null;
    }

    if (store) store.notify();
    Toast.show({
      title: 'PM Cycle Advanced',
      message: `Completed ${pm.title}. Next scheduled service: ${nextDate} (${pm.frequency} schedule).`,
      type: 'success'
    });
    this.renderContent();
  }

  _createWoFromPm(pmId) {
    const pm = this.preventive.find(p => p.id === pmId);
    if (!pm) return;

    if (pm.linkedWoId) {
      this.activeWorkOrderDetail = pm.linkedWoId;
      this.renderContent();
      return;
    }

    const newId = `MT-${10490 + this.workOrders.length}`;
    const wo = {
      id: newId,
      location: pm.location,
      area: pm.location.includes('Kitchen') ? 'Kitchen' : (pm.location.includes('Room') || pm.location.includes('Floor') ? 'Guest Rooms' : 'Public Areas'),
      room: null,
      assetName: pm.assetName || pm.title,
      assetCode: pm.assetCode,
      issueType: 'Preventive Maintenance',
      issue: `PM: ${pm.title}`,
      description: `Scheduled ${pm.frequency} preventive maintenance routine. Fixed Cadence: ${pm.scheduleRule}. Checklist: ${(pm.checklist || []).join('; ')}. ${pm.sop || ''}`,
      priority: pm.daysUntil <= 2 ? 'HIGH' : 'NORMAL',
      status: 'ASSIGNED',
      reportedBy: `PM Auto-Schedule (${pm.frequency})`,
      source: 'PM Schedule',
      assignedTo: pm.assignedTo,
      guestAffected: false,
      guestName: null,
      roomImpact: 'NONE',
      partsUsed: [],
      partsRequired: [],
      timeline: [
        { time: 'Just now', action: `Work order auto-generated from fixed ${pm.frequency} schedule (${pm.scheduleRule})`, by: 'PM Scheduling System' },
        { time: 'Just now', action: `Dispatched to lead engineer ${pm.assignedTo}`, by: 'PM Scheduling System' },
      ],
      createdAt: `8 Sep • ${new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}`,
      startedAt: null,
      elapsedMin: 0,
      overdue: false,
      slaMin: 180,
      isPm: true,
      pmId: pm.id
    };

    this.workOrders.unshift(wo);
    pm.linkedWoId = newId;
    pm.status = 'IN_PROGRESS';
    if (store) store.notify();
    Toast.show({
      title: 'Work Order Dispatched',
      message: `${newId} generated for ${pm.title}. Assigned to ${pm.assignedTo}.`,
      type: 'success'
    });
    this.renderContent();
  }

  _notifyEngineer(pmId) {
    const pm = this.preventive.find(p => p.id === pmId);
    if (!pm) return;
    pm.notificationSent = true;
    Toast.show({
      title: 'Notification Alert Sent',
      message: `Advance PM reminder dispatched to ${pm.assignedTo} for ${pm.title} (Due in ${pm.daysUntil} days • ${pm.frequency}).`,
      type: 'info'
    });
    this.renderContent();
  }

  // ── Computed ──────────────────────────────────────────────────────────────
  _metrics() {
    const wo = this.workOrders;
    const isUnresolved = s => !['REPAIR_COMPLETE', 'VERIFICATION', 'CLOSED', 'RESOLVED', 'CANCELLED'].includes(s);
    return {
      openWorkOrders: wo.filter(w => !['CLOSED','CANCELLED'].includes(w.status)).length,
      urgent: wo.filter(w => ['CRITICAL','HIGH'].includes(w.priority) && isUnresolved(w.status)).length,
      inProgress: wo.filter(w => w.status === 'IN_PROGRESS').length,
      waitingParts: wo.filter(w => w.status === 'WAITING_FOR_PARTS').length,
      overdue: wo.filter(w => w.overdue && isUnresolved(w.status)).length,
      roomsAffected: wo.filter(w => w.room && wo.roomImpact !== 'NONE' && isUnresolved(w.status)).length,
    };
  }

  _filtered() {
    let list = [...this.workOrders];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(w => [w.id, w.room||'', w.location, w.issue, w.assetName, w.assignedTo].join(' ').toLowerCase().includes(q));
    }
    if (this.filterArea !== 'ALL') list = list.filter(w => w.area === this.filterArea);
    if (this.filterPriority !== 'ALL') list = list.filter(w => w.priority === this.filterPriority);
    if (this.filterTechnician !== 'ALL') list = list.filter(w => w.assignedTo === this.filterTechnician);
    const qf = this.activeQuickFilter;
    const STATUSES = ['OPEN','ASSIGNED','IN_PROGRESS','WAITING_FOR_PARTS','REPAIR_COMPLETE','VERIFICATION','CLOSED'];
    const isUnresolved = s => !['REPAIR_COMPLETE', 'VERIFICATION', 'CLOSED', 'RESOLVED', 'CANCELLED'].includes(s);
    if (qf === 'URGENT') list = list.filter(w => ['CRITICAL','HIGH'].includes(w.priority) && isUnresolved(w.status));
    else if (qf === 'OVERDUE') list = list.filter(w => w.overdue && isUnresolved(w.status));
    else if (qf === 'ROOMS') list = list.filter(w => !!w.room && w.roomImpact !== 'NONE' && isUnresolved(w.status));
    else if (STATUSES.includes(qf)) list = list.filter(w => w.status === qf);
    const pw = { CRITICAL:5, HIGH:4, NORMAL:3, LOW:2 };
    return list.sort((a,b) => {
      if (a.overdue && !b.overdue) return -1;
      if (!a.overdue && b.overdue) return 1;
      return (pw[b.priority]||0) - (pw[a.priority]||0);
    });
  }

  // ── Badge helpers ─────────────────────────────────────────────────────────
  _pBadge(p) {
    return { CRITICAL:'bg-red-100 text-red-700 border-red-300', HIGH:'bg-orange-100 text-orange-700 border-orange-300', NORMAL:'bg-blue-100 text-blue-700 border-blue-300', LOW:'bg-gray-100 text-gray-600 border-gray-300' }[p] || 'bg-gray-100 text-gray-600 border-gray-300';
  }
  _sBadge(s) {
    return { OPEN:'bg-slate-100 text-slate-600 border-slate-300', ASSIGNED:'bg-blue-100 text-blue-700 border-blue-300', IN_PROGRESS:'bg-amber-100 text-amber-700 border-amber-300', WAITING_FOR_PARTS:'bg-purple-100 text-purple-700 border-purple-300', REPAIR_COMPLETE:'bg-teal-100 text-teal-700 border-teal-300', VERIFICATION:'bg-cyan-100 text-cyan-700 border-cyan-300', CLOSED:'bg-green-100 text-green-700 border-green-300', ON_HOLD:'bg-yellow-100 text-yellow-700 border-yellow-300', CANCELLED:'bg-gray-100 text-gray-500 border-gray-300', REOPENED:'bg-red-100 text-red-600 border-red-300' }[s] || 'bg-gray-100 text-gray-500 border-gray-200';
  }
  _sLabel(s) {
    return { OPEN:'Open', ASSIGNED:'Assigned', IN_PROGRESS:'In Progress', WAITING_FOR_PARTS:'Waiting for Parts', REPAIR_COMPLETE:'Repair Complete', VERIFICATION:'Verification', CLOSED:'Closed', ON_HOLD:'On Hold', CANCELLED:'Cancelled', REOPENED:'Reopened' }[s] || s;
  }
  _impactBadge(i) {
    return { NONE:'bg-green-100 text-green-700', OUT_OF_SERVICE:'bg-orange-100 text-orange-700', OUT_OF_ORDER:'bg-red-100 text-red-700' }[i] || 'bg-gray-100 text-gray-500';
  }
  _impactLabel(i) {
    return { NONE:'None', OUT_OF_SERVICE:'Out of Service', OUT_OF_ORDER:'Out of Order' }[i] || i;
  }
  _elapsed(m) {
    if (!m) return '—';
    return m < 60 ? `${m}m` : `${Math.floor(m/60)}h${m%60 ? ` ${m%60}m` : ''}`;
  }
  _nextStepLabel(status) {
    return { OPEN:'Assign Technician', ASSIGNED:'Start Work', IN_PROGRESS:'Mark Repair Complete', WAITING_FOR_PARTS:'Parts Received — Resume', REPAIR_COMPLETE:'Start Verification', VERIFICATION:'Close Work Order', CLOSED:'Reopen', ON_HOLD:'Resume' }[status] || 'Next Step';
  }
  _nextStatus(status) {
    return { OPEN:'ASSIGNED', ASSIGNED:'IN_PROGRESS', IN_PROGRESS:'REPAIR_COMPLETE', WAITING_FOR_PARTS:'IN_PROGRESS', REPAIR_COMPLETE:'VERIFICATION', VERIFICATION:'CLOSED', CLOSED:'REOPENED', ON_HOLD:'IN_PROGRESS' }[status] || 'OPEN';
  }

  // ── Mount ─────────────────────────────────────────────────────────────────
  render() {
    const el = document.createElement('div');
    el.className = 'w-full flex flex-col gap-6 animate-fadeIn pb-16 max-w-7xl mx-auto';
    this.container = el;
    this.renderContent();
    return el;
  }

  renderContent() {
    if (!this.container) return;
    const m = this._metrics();
    const filtered = this._filtered();
    const isUnresolved = s => !['REPAIR_COMPLETE', 'VERIFICATION', 'CLOSED', 'RESOLVED', 'CANCELLED'].includes(s);
    const urgentWOs = this.workOrders.filter(w => ['CRITICAL','HIGH'].includes(w.priority) && isUnresolved(w.status));
    const activeWO = this.activeWorkOrderDetail ? this.workOrders.find(w => w.id === this.activeWorkOrderDetail) : null;

    const activeTimer = store?.state?.activeMaintenanceTimer;

    this.container.innerHTML = `
      ${this._html_header()}
      ${activeTimer ? this._html_activeTimerBar(activeTimer) : ''}
      ${this._html_kpis(m)}
      ${urgentWOs.length > 0 && (this.workOrdersTab === 'dashboard' || this.workOrdersTab === 'list') ? this._html_urgent(urgentWOs) : ''}
      ${this.workOrdersTab === 'list' || this.workOrdersTab === 'dashboard' ? this._html_stepper() : ''}
      ${this._html_tabbar(filtered)}
      ${this.workOrdersTab === 'dashboard' ? this._html_dashboard(m, urgentWOs) : ''}
      ${this.workOrdersTab === 'list' ? this._html_table(filtered) : ''}
      ${this.workOrdersTab === 'assets' ? this._html_assets() : ''}
      ${this.workOrdersTab === 'preventive' ? this._html_preventive() : ''}
      ${this.workOrdersTab === 'technicians' ? this._html_technicians() : ''}
      ${activeWO ? this._html_drawer(activeWO) : ''}
      ${this.activePmDetail ? this._html_pmDrawer(this.preventive.find(p => p.id === this.activePmDetail)) : ''}
      ${this.activeAssetDetail ? this._html_assetDrawer(this.assets.find(a => a.code === this.activeAssetDetail || a.id === this.activeAssetDetail)) : ''}
      ${this.showCreateModal ? this._html_createModal() : ''}
      ${this.showSchedulePmModal ? this._html_schedulePmModal() : ''}
      ${this.showLogServiceModal ? this._html_logServiceModal(this.assets.find(a => a.code === this.showLogServiceModal || a.id === this.showLogServiceModal)) : ''}
    `;
    this.bindEvents();
  }

  // ── Header ────────────────────────────────────────────────────────────────
  _html_header() {
    const titles = {
      dashboard: { title: 'Maintenance Dashboard', desc: 'Real-time overview of hotel plant, machinery uptime, and urgent repair tickets.' },
      list: { title: 'Maintenance Requests', desc: 'Track, dispatch, and resolve guest room and facilities work orders.' },
      preventive: { title: 'Preventive Maintenance', desc: 'Scheduled recurring equipment servicing, inspections, and compliance checks.' },
      assets: { title: 'Machines', desc: 'Asset registry of HVAC, vertical transport, kitchen systems, and generators.' },
      technicians: { title: 'Engineers or Staff', desc: 'On-duty engineering technicians, specialty assignments, and active work queues.' }
    };
    const currentTabInfo = titles[this.workOrdersTab] || titles.dashboard;

    return `
      <section class="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-4 border-b border-outline-variant/60">
        <div>
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-data-mono">VOLVITECH HOSPITALITY OS</span>
            <span class="text-on-surface-variant font-data-mono text-xs">→</span>
            <span class="text-[10px] font-bold uppercase tracking-wider text-primary font-data-mono">Maintenance</span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
              <span class="material-symbols-outlined text-[12px]">engineering</span> ${currentTabInfo.title}
            </span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold text-primary tracking-tight">${currentTabInfo.title}</h1>
          <p class="text-sm text-on-surface-variant mt-0.5">${currentTabInfo.desc}</p>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <select id="sel-maint-area" class="border border-outline-variant rounded-xl font-data-mono text-xs py-2 px-3 bg-surface-bright text-primary focus:outline-none focus:border-primary cursor-pointer">
            <option value="ALL">All Areas</option>
            <option value="Guest Rooms">Guest Rooms</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Public Areas">Public Areas</option>
          </select>
          <select id="sel-maint-priority" class="border border-outline-variant rounded-xl font-data-mono text-xs py-2 px-3 bg-surface-bright text-primary focus:outline-none focus:border-primary cursor-pointer">
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="NORMAL">Normal</option>
            <option value="LOW">Low</option>
          </select>
          <select id="sel-maint-tech" class="border border-outline-variant rounded-xl font-data-mono text-xs py-2 px-3 bg-surface-bright text-primary focus:outline-none focus:border-primary cursor-pointer">
            <option value="ALL">All Technicians</option>
            ${this.technicians.map(t => `<option value="${t.name}">${t.name}</option>`).join('')}
          </select>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[15px] text-on-surface-variant pointer-events-none">search</span>
            <input id="input-maint-search" type="text" placeholder="Search room, asset, ticket or issue..." value="${this.searchQuery}"
              class="pl-9 pr-3 py-2 rounded-xl border border-outline-variant bg-surface-bright text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary w-56 font-data-mono" />
          </div>
          <button id="btn-create-wo" class="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
            <span class="material-symbols-outlined text-[17px]">add</span>
            + Create Work Order
          </button>
        </div>
      </section>
    `;
  }

  // ── KPI Cards ─────────────────────────────────────────────────────────────
  _html_kpis(m) {
    const cards = [
      { label:'OPEN WORK ORDERS', value:m.openWorkOrders, icon:'build', filter:'ALL', alert:false },
      { label:'URGENT', value:m.urgent, icon:'priority_high', filter:'URGENT', alert:m.urgent>0 },
      { label:'IN PROGRESS', value:m.inProgress, icon:'handyman', filter:'IN_PROGRESS', alert:false },
      { label:'WAITING FOR PARTS', value:m.waitingParts, icon:'inventory_2', filter:'WAITING_FOR_PARTS', alert:m.waitingParts>0 },
      { label:'OVERDUE', value:m.overdue, icon:'alarm', filter:'OVERDUE', alert:m.overdue>0 },
      { label:'ROOMS AFFECTED', value:m.roomsAffected, icon:'meeting_room', filter:'ROOMS', alert:false },
    ];
    return `
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        ${cards.map(c => {
          const isActive = this.activeQuickFilter === c.filter;
          const base = isActive ? 'bg-primary text-on-primary border-primary shadow-md' : `bg-surface-container-lowest border-outline-variant hover:border-primary cursor-pointer${c.alert ? ' border-error/40 bg-error/5' : ''}`;
          return `
            <div class="card-kpi-maint rounded-xl border p-4 flex flex-col transition-all ${base}" data-filter="${c.filter}">
              <div class="flex items-start justify-between mb-2">
                <span class="text-[9px] font-bold uppercase tracking-wider ${isActive ? 'text-on-primary/70' : 'text-on-surface-variant'} font-data-mono leading-tight">${c.label}</span>
                <span class="material-symbols-outlined text-[17px] ${isActive ? 'text-on-primary' : c.alert ? 'text-error' : 'text-primary'}">${c.icon}</span>
              </div>
              <div class="font-bold text-3xl font-data-mono ${isActive ? 'text-on-primary' : c.alert ? 'text-error' : 'text-primary'} leading-none mt-auto">${c.value}</div>
              <div class="text-[9px] mt-1 ${isActive ? 'text-on-primary/60' : 'text-on-surface-variant'}">Click to filter</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // ── Urgent Section ────────────────────────────────────────────────────────
  _html_urgent(urgentWOs) {
    return `
      <section>
        <div class="flex items-center gap-2 mb-3">
          <span class="material-symbols-outlined text-[18px] text-error">report</span>
          <h2 class="text-sm font-bold text-primary">Attention Required</h2>
          <span class="px-2 py-0.5 rounded-full bg-error/10 text-error text-[10px] font-bold font-data-mono border border-error/20">${urgentWOs.length} active</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          ${urgentWOs.map(wo => {
            const isCrit = wo.priority === 'CRITICAL';
            const bdr = isCrit ? 'border-red-300 bg-red-50' : 'border-orange-300 bg-orange-50';
            const pbadge = isCrit ? 'bg-red-600 text-white' : 'bg-orange-500 text-white';
            return `
              <div class="rounded-xl border ${bdr} p-4 flex flex-col gap-3">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold ${pbadge} font-data-mono">${wo.priority}</span>
                    ${wo.overdue ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-300 font-data-mono">OVERDUE</span>' : ''}
                  </div>
                  <span class="text-[10px] text-on-surface-variant font-data-mono">${wo.id}</span>
                </div>
                <div>
                  <div class="text-xs font-bold text-primary">${(wo.room && !wo.location.includes(wo.room)) ? `${wo.location} · Room ${wo.room}` : wo.location}</div>
                  <div class="font-bold text-sm text-on-surface mt-0.5">${wo.issue}</div>
                  ${wo.guestAffected && wo.guestName ? `<div class="text-[10px] text-orange-700 font-bold mt-1 flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">person</span>Guest: ${wo.guestName}</div>` : ''}
                </div>
                <div class="grid grid-cols-2 gap-2 text-[10px]">
                  <div><div class="text-on-surface-variant font-data-mono uppercase tracking-wide">Reported</div><div class="font-bold text-on-surface">${wo.createdAt}</div></div>
                  <div><div class="text-on-surface-variant font-data-mono uppercase tracking-wide">Assigned</div><div class="font-bold text-on-surface">${wo.assignedTo}</div></div>
                  ${wo.elapsedMin ? `<div><div class="text-on-surface-variant font-data-mono uppercase tracking-wide">Elapsed</div><div class="font-bold ${wo.overdue ? 'text-red-600' : 'text-on-surface'}">${this._elapsed(wo.elapsedMin)}</div></div>` : ''}
                  ${wo.roomImpact !== 'NONE' ? `<div><div class="text-on-surface-variant font-data-mono uppercase tracking-wide">Room Status</div><div class="font-bold text-red-700">${this._impactLabel(wo.roomImpact)}</div></div>` : ''}
                </div>
                <div class="flex gap-2 pt-1 border-t border-black/10">
                  <button class="btn-open-wo flex-1 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-[11px] font-bold cursor-pointer hover:bg-primary/90 active:scale-95 flex items-center justify-center gap-1 transition-all" data-woid="${wo.id}">
                    <span class="material-symbols-outlined text-[13px]">open_in_new</span>
                    ${isCrit ? 'Handle Incident' : 'Open Work Order'}
                  </button>
                  <button class="btn-quick-complete px-2.5 py-1.5 rounded-lg border border-emerald-600/30 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-[11px] font-bold cursor-pointer transition-all flex items-center gap-1 active:scale-95" data-woid="${wo.id}" title="Mark Repair Complete">
                    <span class="material-symbols-outlined text-[13px]">check_circle</span>
                    <span>Complete</span>
                  </button>
                  ${wo.assignedTo === 'Unassigned' ? `<button class="btn-quick-assign px-3 py-1.5 rounded-lg border border-primary text-primary text-[11px] font-bold cursor-pointer hover:bg-primary/5 active:scale-95" data-woid="${wo.id}" title="Assign Technician"><span class="material-symbols-outlined text-[13px]">person_add</span></button>` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `;
  }

  // ── Workflow Stepper ──────────────────────────────────────────────────────
  _html_stepper() {
    const steps = [
      { s:'OPEN', label:'Open', icon:'fiber_new', c:'slate' },
      { s:'ASSIGNED', label:'Assigned', icon:'person_add', c:'blue' },
      { s:'IN_PROGRESS', label:'In Progress', icon:'handyman', c:'amber' },
      { s:'WAITING_FOR_PARTS', label:'Waiting Parts', icon:'inventory_2', c:'purple' },
      { s:'REPAIR_COMPLETE', label:'Repair Done', icon:'check_circle', c:'teal' },
      { s:'VERIFICATION', label:'Verification', icon:'verified', c:'cyan' },
      { s:'CLOSED', label:'Closed', icon:'task_alt', c:'green' },
    ];
    return `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-3.5 overflow-x-auto">
        <div class="flex items-center min-w-max">
          ${steps.map((st, i) => {
            const cnt = this.workOrders.filter(w => w.status === st.s).length;
            const isActive = this.activeQuickFilter === st.s;
            const cls = isActive
              ? `bg-${st.c}-600 text-white border-${st.c}-600`
              : `border-outline-variant text-on-surface hover:text-${st.c}-700 hover:border-${st.c}-400`;
            return `
              <button class="workflow-step-btn flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${cls}" data-status="${st.s}">
                <span class="material-symbols-outlined text-[15px]">${st.icon}</span>
                <div class="text-left">
                  <div class="text-[9px] font-bold uppercase tracking-wide leading-tight">${st.label}</div>
                  <div class="font-data-mono font-bold text-base leading-tight">${cnt}</div>
                </div>
              </button>
              ${i < steps.length-1 ? '<span class="material-symbols-outlined text-[15px] text-on-surface-variant/30 mx-0.5">chevron_right</span>' : ''}
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // ── Tab Bar ───────────────────────────────────────────────────────────────
  // ── Tab Bar ───────────────────────────────────────────────────────────────
  _html_tabbar(filtered) {
    const tabs = [
      { id:'dashboard', label:'Dashboard', icon:'dashboard' },
      { id:'list', label:`Maintenance Requests (${this.workOrders.length})`, icon:'build' },
      { id:'preventive', label:`Preventive Maintenance (${this.preventive.length})`, icon:'event_repeat' },
      { id:'assets', label:`Machines (${this.assets.length})`, icon:'precision_manufacturing' },
      { id:'technicians', label:`Engineers or Staff (${this.technicians.length})`, icon:'engineering' },
    ];
    return `
      <div class="flex items-center gap-1 border-b border-outline-variant/60 pb-2 overflow-x-auto">
        ${tabs.map(t => `
          <button class="maint-tab-btn px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${this.workOrdersTab === t.id ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:bg-surface-container hover:text-primary'}" data-tab="${t.id}">
            <span class="material-symbols-outlined text-[15px]">${t.icon}</span><span>${t.label}</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  // ── Dashboard Overview Panel ───────────────────────────────────────────────
  _html_dashboard(m, urgentWOs) {
    const onDutyTechs = this.technicians.filter(t => t.onDuty);
    const activeRequests = this.workOrders.filter(w => !['CLOSED','CANCELLED'].includes(w.status));

    return `
      <div class="space-y-6">
        <!-- 1. Quick Action & Telemetry Hero Bar -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
              <span class="material-symbols-outlined text-2xl">precision_manufacturing</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-base font-bold text-primary">Plant & Facilities Operational Command</h2>
                <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[10px] font-bold border border-emerald-500/20 font-data-mono">99.4% Uptime</span>
              </div>
              <p class="text-xs text-on-surface-variant mt-0.5">
                Central BMS telemetry nominal. <strong>${onDutyTechs.length} engineers</strong> on duty, <strong>${activeRequests.length} active maintenance requests</strong>, and <strong>${this.preventive.length} scheduled PPM tasks</strong>.
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-wrap shrink-0">
            <button class="btn-goto-tab px-3.5 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 cursor-pointer flex items-center gap-1.5 transition-all shadow-xs" data-tab="list">
              <span class="material-symbols-outlined text-[15px]">build</span>Maintenance Requests
            </button>
            <button class="btn-goto-tab px-3.5 py-2 rounded-xl border border-outline-variant text-primary hover:bg-surface-container text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all" data-tab="assets">
              <span class="material-symbols-outlined text-[15px]">precision_manufacturing</span>Machines Fleet
            </button>
            <button class="btn-goto-tab px-3.5 py-2 rounded-xl border border-outline-variant text-primary hover:bg-surface-container text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-all" data-tab="technicians">
              <span class="material-symbols-outlined text-[15px]">engineering</span>Engineers or Staff
            </button>
          </div>
        </div>

        <!-- 2. Core Plant Machinery Health Cards -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-lg">memory</span>
              <h3 class="text-sm font-bold text-primary">Machines & Plant Infrastructure Status</h3>
            </div>
            <button class="btn-goto-tab text-xs font-bold text-primary hover:underline flex items-center gap-0.5 cursor-pointer" data-tab="assets">
              All Machines (${this.assets.length}) <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <!-- HVAC -->
            <div class="p-4 rounded-xl border border-outline-variant bg-surface-container-lowest hover:border-primary transition-all">
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-cyan-600 text-xl">mode_fan</span>
                  <span class="text-xs font-bold text-primary">HVAC & Chillers</span>
                </div>
                <span class="px-1.5 py-0.5 rounded text-[9px] font-bold font-data-mono bg-amber-100 text-amber-700 border border-amber-200">1 Degraded</span>
              </div>
              <div class="text-base font-bold font-data-mono text-on-surface">Samsung DVM S</div>
              <p class="text-[11px] text-on-surface-variant mt-1">Room 508 unit valve replacement underway. Chiller loop supply steady at 7.2°C.</p>
              <div class="mt-3 pt-2.5 border-t border-outline-variant/60 flex items-center justify-between text-[10px] text-on-surface-variant font-data-mono">
                <span>Lead: Tariq Mahmoud</span>
                <span class="text-primary font-bold">PM in 4d</span>
              </div>
            </div>

            <!-- Elevators -->
            <div class="p-4 rounded-xl border border-outline-variant bg-surface-container-lowest hover:border-primary transition-all">
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-indigo-600 text-xl">elevator</span>
                  <span class="text-xs font-bold text-primary">Vertical Transport</span>
                </div>
                <span class="px-1.5 py-0.5 rounded text-[9px] font-bold font-data-mono bg-orange-100 text-orange-700 border border-orange-200">Degraded</span>
              </div>
              <div class="text-base font-bold font-data-mono text-on-surface">Schindler 3300 MRL</div>
              <p class="text-[11px] text-on-surface-variant mt-1">Lobby passenger lift door sensor warning. Service & freight lifts normal.</p>
              <div class="mt-3 pt-2.5 border-t border-outline-variant/60 flex items-center justify-between text-[10px] text-on-surface-variant font-data-mono">
                <span>Schindler SLA: 90m</span>
                <span class="text-orange-700 font-bold">Attention</span>
              </div>
            </div>

            <!-- Commercial Kitchen -->
            <div class="p-4 rounded-xl border border-outline-variant bg-surface-container-lowest hover:border-primary transition-all">
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-amber-600 text-xl">soup_kitchen</span>
                  <span class="text-xs font-bold text-primary">Kitchen Machinery</span>
                </div>
                <span class="px-1.5 py-0.5 rounded text-[9px] font-bold font-data-mono bg-purple-100 text-purple-700 border border-purple-200">Awaiting Part</span>
              </div>
              <div class="text-base font-bold font-data-mono text-on-surface">Rational iCombi Pro</div>
              <p class="text-[11px] text-on-surface-variant mt-1">Boiler descaling alert triggered. Descaling care tabs in transit from store.</p>
              <div class="mt-3 pt-2.5 border-t border-outline-variant/60 flex items-center justify-between text-[10px] text-on-surface-variant font-data-mono">
                <span>Lead: Rajesh Kumar</span>
                <span class="text-purple-700 font-bold">Parts Req</span>
              </div>
            </div>

            <!-- Power & Genset -->
            <div class="p-4 rounded-xl border border-outline-variant bg-surface-container-lowest hover:border-primary transition-all">
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-emerald-600 text-xl">bolt</span>
                  <span class="text-xs font-bold text-primary">Standby Power</span>
                </div>
                <span class="px-1.5 py-0.5 rounded text-[9px] font-bold font-data-mono bg-emerald-100 text-emerald-700 border border-emerald-200">100% Ready</span>
              </div>
              <div class="text-base font-bold font-data-mono text-on-surface">Cummins C150D5</div>
              <p class="text-[11px] text-on-surface-variant mt-1">Automatic transfer switch nominal. Diesel tank at 94% capacity. Ready for load test.</p>
              <div class="mt-3 pt-2.5 border-t border-outline-variant/60 flex items-center justify-between text-[10px] text-on-surface-variant font-data-mono">
                <span>Lead: Anil Sharma</span>
                <span class="text-emerald-700 font-bold">PPM 15 Sep</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Dual Columns: Active Maintenance Requests & On-Duty Staff -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Live Maintenance Requests Feed (2 cols) -->
          <div class="lg:col-span-2 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-lg">build</span>
                <h3 class="text-sm font-bold text-primary">Active Maintenance Requests</h3>
                <span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold font-data-mono">${activeRequests.length} active</span>
              </div>
              <button class="btn-goto-tab text-xs font-bold text-primary hover:underline flex items-center gap-0.5 cursor-pointer" data-tab="list">
                View All Requests <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
            <div class="bg-surface-container-lowest border border-outline-variant rounded-xl divide-y divide-outline-variant/60 overflow-hidden shadow-xs">
              ${this.workOrders.slice(0, 5).map(wo => {
                const isCrit = wo.priority === 'CRITICAL';
                const isHigh = wo.priority === 'HIGH';
                const pColor = isCrit ? 'bg-red-100 text-red-700 border-red-300' : isHigh ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-blue-100 text-blue-700 border-blue-300';
                return `
                  <div class="p-3.5 hover:bg-surface-container/30 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div class="flex items-start gap-3 min-w-0">
                      <div class="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center font-data-mono text-xs font-bold shrink-0">
                        <span class="material-symbols-outlined text-[18px]">handyman</span>
                      </div>
                      <div class="min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                          <span class="font-data-mono text-xs font-bold text-primary">${wo.id}</span>
                          <span class="px-1.5 py-0.2 rounded border text-[9px] font-bold font-data-mono ${pColor}">${wo.priority}</span>
                          <span class="px-1.5 py-0.2 rounded border text-[9px] font-bold font-data-mono ${this._sBadge(wo.status)}">${this._sLabel(wo.status)}</span>
                          ${wo.overdue ? '<span class="px-1.5 py-0.2 rounded border text-[9px] font-bold font-data-mono bg-red-100 text-red-700 border-red-300">OVERDUE</span>' : ''}
                        </div>
                        <div class="font-bold text-xs text-on-surface truncate mt-0.5">${wo.issue}</div>
                        <div class="text-[10px] text-on-surface-variant flex items-center gap-2 mt-0.5 flex-wrap">
                          <span>${wo.location}${wo.room ? ` · Room ${wo.room}` : ''}</span>
                          <span>•</span>
                          <span>Assigned: <strong class="text-on-surface">${wo.assignedTo}</strong></span>
                          <span>•</span>
                          <span>${wo.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button class="btn-open-wo px-3 py-1.5 rounded-lg bg-primary text-on-primary text-[11px] font-bold hover:bg-primary/90 cursor-pointer active:scale-95 transition-all flex items-center gap-1" data-woid="${wo.id}">
                        <span>Details</span>
                        <span class="material-symbols-outlined text-[13px]">chevron_right</span>
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Engineers or Staff Status Roster (1 col) -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-lg">engineering</span>
                <h3 class="text-sm font-bold text-primary">Engineers or Staff</h3>
              </div>
              <button class="btn-goto-tab text-xs font-bold text-primary hover:underline flex items-center gap-0.5 cursor-pointer" data-tab="technicians">
                View Staff <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
            <div class="bg-surface-container-lowest border border-outline-variant rounded-xl divide-y divide-outline-variant/60 overflow-hidden shadow-xs">
              ${this.technicians.map(t => {
                const activeJobs = this.workOrders.filter(w => w.assignedTo === t.name && !['CLOSED','CANCELLED'].includes(w.status));
                return `
                  <div class="p-3 hover:bg-surface-container/30 transition-colors flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2.5 min-w-0">
                      <div class="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold text-xs shrink-0">${t.initials}</div>
                      <div class="min-w-0">
                        <div class="text-xs font-bold text-primary truncate">${t.name}</div>
                        <div class="text-[10px] text-on-surface-variant truncate">${t.role}</div>
                      </div>
                    </div>
                    <div class="flex flex-col items-end shrink-0">
                      <div class="flex items-center gap-1">
                        <span class="w-1.5 h-1.5 rounded-full ${t.onDuty ? 'bg-emerald-500' : 'bg-slate-300'}"></span>
                        <span class="text-[9px] font-bold ${t.onDuty ? 'text-emerald-700' : 'text-slate-500'} font-data-mono">${t.onDuty ? 'ON DUTY' : 'OFF'}</span>
                      </div>
                      <div class="text-[10px] text-on-surface-variant font-data-mono mt-0.5">${activeJobs.length} active jobs</div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- PPM Agenda Preview -->
            <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-3.5 shadow-xs">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <span class="material-symbols-outlined text-[16px] text-primary">event_repeat</span>
                  <span>Upcoming Preventive PM</span>
                </div>
                <button class="btn-goto-tab text-[10px] font-bold text-primary hover:underline cursor-pointer" data-tab="preventive">View PM</button>
              </div>
              <div class="space-y-2">
                ${this.preventive.slice(0, 4).map(pm => `
                  <div class="text-[10px] p-2.5 rounded-lg bg-surface-container/50 border border-outline-variant/40 flex items-center justify-between gap-2">
                    <div class="min-w-0">
                      <div class="font-bold text-on-surface truncate">${pm.title}</div>
                      <div class="text-on-surface-variant font-data-mono flex items-center gap-1 mt-0.5">
                        <span class="px-1.5 py-0.2 rounded text-[8px] font-bold ${pm.frequency === 'Weekly' ? 'bg-purple-100 text-purple-700' : pm.frequency === 'Monthly' ? 'bg-blue-100 text-blue-700' : 'bg-teal-100 text-teal-700'}">${pm.frequency}</span>
                        <span class="truncate">${pm.location}</span>
                      </div>
                    </div>
                    <div class="flex items-center gap-1.5 shrink-0">
                      <span class="px-1.5 py-0.5 rounded font-bold font-data-mono ${pm.daysUntil <= 2 ? 'bg-red-100 text-red-700' : pm.daysUntil <= 7 ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}">${pm.daysUntil}d</span>
                      <button class="btn-quick-run-pm px-2 py-1 rounded bg-primary text-on-primary font-bold text-[9px] cursor-pointer hover:bg-primary/90 transition-all active:scale-95" data-pmid="${pm.id}">Run</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ── Work Orders Table ─────────────────────────────────────────────────────
  _html_table(list) {
    if (!list.length) return `<div class="text-center py-16 text-on-surface-variant"><span class="material-symbols-outlined text-[48px] block mb-3 opacity-30">build</span><p class="text-sm font-semibold">No work orders match your filters.</p></div>`;
    return `
      <div class="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xs overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-outline-variant bg-surface-container text-[10px] font-bold tracking-wider text-on-surface-variant uppercase font-data-mono">
                <th class="py-3 px-4">Ticket</th>
                <th class="py-3 px-4">Location</th>
                <th class="py-3 px-4">Asset</th>
                <th class="py-3 px-4">Issue</th>
                <th class="py-3 px-4">Priority</th>
                <th class="py-3 px-4">Source</th>
                <th class="py-3 px-4">Technician</th>
                <th class="py-3 px-4">Status</th>
                <th class="py-3 px-4">Age</th>
                <th class="py-3 px-4">Room Impact</th>
                <th class="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/40">
              ${list.map(wo => `
                <tr class="hover:bg-surface-container/50 transition-colors ${wo.overdue && wo.status !== 'CLOSED' ? 'bg-red-50/30' : ''}">
                  <td class="py-3 px-4">
                    <div class="font-bold text-xs text-primary font-data-mono">${wo.id}</div>
                    ${wo.overdue && wo.status !== 'CLOSED' ? '<div class="text-[9px] text-red-600 font-bold">OVERDUE</div>' : ''}
                  </td>
                  <td class="py-3 px-4">
                    <div class="font-bold text-xs text-on-surface">${wo.location}</div>
                    ${wo.room ? `<div class="text-[10px] text-on-surface-variant font-data-mono">Room ${wo.room}</div>` : ''}
                  </td>
                  <td class="py-3 px-4">
                    <div class="text-xs text-on-surface truncate max-w-[110px]">${wo.assetName}</div>
                    <div class="text-[10px] text-on-surface-variant font-data-mono">${wo.assetCode}</div>
                  </td>
                  <td class="py-3 px-4">
                    <div class="text-xs text-on-surface max-w-[180px] leading-snug">${wo.issue}</div>
                    ${wo.guestAffected ? '<div class="text-[9px] text-orange-600 font-bold mt-0.5 flex items-center gap-0.5"><span class="material-symbols-outlined text-[11px]">person</span>Guest Affected</div>' : ''}
                  </td>
                  <td class="py-3 px-4"><span class="px-2 py-0.5 rounded border text-[10px] font-bold font-data-mono ${this._pBadge(wo.priority)}">${wo.priority}</span></td>
                  <td class="py-3 px-4"><span class="text-[10px] text-on-surface-variant">${wo.source}</span></td>
                  <td class="py-3 px-4">
                    ${wo.assignedTo !== 'Unassigned' ? `
                      <div class="flex items-center gap-1.5">
                        <div class="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[9px] font-bold shrink-0">${wo.assignedTo.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                        <span class="text-xs text-on-surface">${wo.assignedTo.split(' ')[0]}</span>
                      </div>` : '<span class="text-[10px] text-error font-semibold">Unassigned</span>'}
                  </td>
                  <td class="py-3 px-4"><span class="px-2 py-0.5 rounded border text-[10px] font-bold font-data-mono ${this._sBadge(wo.status)}">${this._sLabel(wo.status)}</span></td>
                  <td class="py-3 px-4"><span class="text-xs font-data-mono ${wo.overdue && wo.status !== 'CLOSED' ? 'text-error font-bold' : 'text-on-surface-variant'}">${this._elapsed(wo.elapsedMin)}</span></td>
                  <td class="py-3 px-4"><span class="px-1.5 py-0.5 rounded text-[9px] font-bold ${this._impactBadge(wo.roomImpact)}">${this._impactLabel(wo.roomImpact)}</span></td>
                  <td class="py-3 px-4 text-right">
                    <button class="btn-open-wo px-3 py-1.5 rounded-lg border border-outline-variant hover:border-primary hover:bg-surface-container text-xs font-semibold text-on-surface-variant hover:text-primary transition-all cursor-pointer active:scale-95" data-woid="${wo.id}">View</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ── Detail Drawer ─────────────────────────────────────────────────────────
  _html_drawer(wo) {
    return `
      <div id="wo-backdrop" class="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm animate-fadeIn"></div>
      <div class="fixed right-0 top-0 h-full z-[61] w-full max-w-2xl bg-surface-bright shadow-2xl flex flex-col overflow-hidden" style="animation:slideInRight .25s ease">
        <div class="px-6 py-4 border-b border-outline-variant bg-surface-container flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1 flex-wrap">
              <span class="font-bold text-xs font-data-mono text-secondary">${wo.id}</span>
              <span class="px-2 py-0.5 rounded border text-[10px] font-bold ${this._pBadge(wo.priority)}">${wo.priority}</span>
              <span class="px-2 py-0.5 rounded border text-[10px] font-bold ${this._sBadge(wo.status)}">${this._sLabel(wo.status)}</span>
              ${wo.overdue && wo.status !== 'CLOSED' ? '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-300">OVERDUE</span>' : ''}
            </div>
            <h2 class="font-bold text-lg text-primary leading-snug">${wo.issue}</h2>
            <div class="flex items-center gap-3 mt-1 text-xs text-on-surface-variant flex-wrap">
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[13px]">location_on</span>${wo.location}${wo.room ? ' · Room ' + wo.room : ''}</span>
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[13px]">precision_manufacturing</span>${wo.assetCode}</span>
            </div>
          </div>
          <button id="btn-close-detail" class="p-2 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer flex-shrink-0">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div class="grid grid-cols-4 gap-3 px-6 py-3.5 border-b border-outline-variant/60 bg-surface-container/30">
          ${[['Reported', wo.createdAt], ['Reported By', wo.reportedBy], ['Assigned To', wo.assignedTo], ['Elapsed', `<span class="${wo.overdue && wo.status !== 'CLOSED' ? 'text-error font-bold' : ''}">${this._elapsed(wo.elapsedMin)}</span>`]].map(([l,v]) => `
            <div>
              <div class="text-[9px] text-on-surface-variant font-data-mono uppercase tracking-wider">${l}</div>
              <div class="text-xs font-bold text-on-surface mt-0.5">${v}</div>
            </div>
          `).join('')}
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar px-6 py-5 space-y-5">

          <div>
            <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2 font-data-mono">Issue Description</div>
            <p class="text-sm text-on-surface leading-relaxed bg-surface-container rounded-xl p-4 border border-outline-variant/60 italic">"${wo.description}"</p>
          </div>

          ${wo.guestAffected ? `
          <div class="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div class="text-[10px] font-bold uppercase tracking-wider text-orange-700 mb-2 font-data-mono flex items-center gap-1">
              <span class="material-symbols-outlined text-[13px]">person_alert</span>Guest Impact
            </div>
            <div class="grid grid-cols-3 gap-3 text-xs">
              <div><div class="text-[9px] text-orange-600 uppercase">Guest</div><div class="font-bold">${wo.guestName || 'Multiple'}</div></div>
              <div><div class="text-[9px] text-orange-600 uppercase">Room</div><div class="font-bold">${wo.room || '—'}</div></div>
              <div><div class="text-[9px] text-orange-600 uppercase">Impact</div><div class="font-bold text-orange-700">Major Inconvenience</div></div>
            </div>
          </div>
          ` : ''}

          <div>
            <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2 font-data-mono">Room Impact</div>
            <div class="flex items-center gap-2 flex-wrap">
              ${['NONE','OUT_OF_SERVICE','OUT_OF_ORDER'].map(imp => {
                const sel = wo.roomImpact === imp;
                const clsMap = { NONE: sel ? 'bg-green-100 border-green-500 text-green-700' : 'border-outline-variant text-on-surface-variant hover:border-green-400', OUT_OF_SERVICE: sel ? 'bg-orange-100 border-orange-500 text-orange-700' : 'border-outline-variant text-on-surface-variant hover:border-orange-400', OUT_OF_ORDER: sel ? 'bg-red-100 border-red-500 text-red-700' : 'border-outline-variant text-on-surface-variant hover:border-red-400' };
                const icns = { NONE:'check_circle', OUT_OF_SERVICE:'do_not_disturb', OUT_OF_ORDER:'cancel' };
                return `<button class="btn-set-impact flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-bold cursor-pointer transition-all ${clsMap[imp]}" data-woid="${wo.id}" data-impact="${imp}"><span class="material-symbols-outlined text-[14px]">${icns[imp]}</span>${this._impactLabel(imp)}</button>`;
              }).join('')}
            </div>
            ${wo.roomImpact !== 'NONE' && wo.room ? `<p class="mt-2 text-[10px] text-error flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">info</span>Room ${wo.room} is currently unavailable — synced to Front Desk and Room Board.</p>` : ''}
          </div>

          ${(wo.partsUsed.length > 0 || wo.partsRequired.length > 0) ? `
          <div>
            <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2 font-data-mono">Parts and Materials</div>
            ${wo.partsUsed.length > 0 ? `
              <div class="mb-3">
                <div class="text-[9px] text-secondary font-bold uppercase mb-1.5">Parts Used</div>
                ${wo.partsUsed.map(p => `
                  <div class="flex items-center justify-between bg-surface-container rounded-lg p-2.5 border border-outline-variant/60 text-xs mb-1.5">
                    <div><div class="font-bold">${p.name}</div><div class="text-[10px] text-on-surface-variant">Qty: ${p.qty} · ${p.source}</div></div>
                    <div class="text-right"><div class="font-bold text-primary">&#x20b9;${p.cost}</div><div class="text-[9px] text-green-600 font-bold">&#x2713; Installed</div></div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            ${wo.partsRequired.length > 0 ? `
              <div>
                <div class="text-[9px] text-purple-600 font-bold uppercase mb-1.5 flex items-center gap-1"><span class="material-symbols-outlined text-[12px]">inventory_2</span>Parts Required</div>
                ${wo.partsRequired.map(p => `
                  <div class="flex items-center justify-between bg-purple-50 rounded-lg p-2.5 border border-purple-200 text-xs mb-1.5">
                    <div><div class="font-bold">${p.name}</div><div class="text-[10px] text-on-surface-variant">Qty: ${p.qty} · &#x20b9;${p.cost}</div></div>
                    <div class="text-right font-bold text-[9px] ${p.available ? 'text-green-600' : 'text-red-600'}">${p.available ? '&#x2713; In Stock' : '&#x2717; Not in Stock'}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
          ` : ''}

          <div>
            <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-3 font-data-mono">Activity Timeline</div>
            <div class="relative pl-4 border-l-2 border-outline-variant/40 space-y-4">
              ${wo.timeline.map(ev => `
                <div class="relative">
                  <div class="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-primary border-2 border-surface-bright flex items-center justify-center">
                    <div class="w-1.5 h-1.5 rounded-full bg-on-primary"></div>
                  </div>
                  <div class="flex items-start gap-2">
                    <span class="text-[10px] text-on-surface-variant font-data-mono font-bold w-16 shrink-0">${ev.time}</span>
                    <div><div class="text-xs text-on-surface">${ev.action}</div><div class="text-[10px] text-on-surface-variant">by ${ev.by}</div></div>
                  </div>
                </div>
              `).join('')}
              <div class="relative">
                <div class="absolute -left-[21px] top-1 w-4 h-4 rounded-full bg-outline-variant border-2 border-surface-bright"></div>
                <div class="flex items-center gap-2">
                  <input type="text" id="input-timeline-note" placeholder="Add activity note..." class="flex-1 py-1.5 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary" />
                  <button id="btn-post-update" class="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold cursor-pointer hover:bg-primary/90">Post</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-outline-variant bg-surface-container flex items-center justify-between gap-3 flex-wrap">
          <div class="flex items-center gap-2 flex-wrap">
            ${!['REPAIR_COMPLETE', 'VERIFICATION', 'CLOSED'].includes(wo.status) ? `
              <button class="btn-complete-wo px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm active:scale-95" data-woid="${wo.id}">
                <span class="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Mark Repair Complete</span>
              </button>
            ` : `
              <button class="btn-close-wo-final px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold cursor-pointer hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-sm active:scale-95" data-woid="${wo.id}">
                <span class="material-symbols-outlined text-[16px]">task_alt</span>
                <span>Close Work Order</span>
              </button>
            `}
            <button class="btn-advance-status px-3.5 py-2 rounded-xl border border-outline-variant hover:bg-surface-container text-on-surface text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 active:scale-95" data-woid="${wo.id}">
              <span class="material-symbols-outlined text-[15px]">arrow_forward</span>${this._nextStepLabel(wo.status)}
            </button>
            <button id="btn-hold-wo" class="px-3 py-2 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">pause</span>On Hold
            </button>
          </div>
          <button id="btn-close-detail2" class="px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Close</button>
        </div>
      </div>
    `;
  }

  // ── Create Modal ──────────────────────────────────────────────────────────
  _html_createModal() {
    return `
      <div id="create-overlay" class="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
        <div class="bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-container flex items-center justify-between">
            <div>
              <h2 class="font-bold text-lg text-primary">Create Work Order</h2>
              <p class="text-xs text-on-surface-variant">Log a new maintenance request or repair job</p>
            </div>
            <button id="btn-close-create" class="p-2 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer"><span class="material-symbols-outlined text-[20px]">close</span></button>
          </div>
          <div class="flex-1 overflow-y-auto px-6 py-5 space-y-4 custom-scrollbar">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5 font-data-mono">Issue Type *</label>
                <select id="new-issue-type" class="w-full border border-outline-variant rounded-xl text-xs py-2.5 px-3 bg-surface-bright text-on-surface focus:outline-none focus:border-primary">
                  <option>Electrical</option><option>HVAC / Climate</option><option>Plumbing</option><option>Kitchen Equipment</option><option>Mechanical</option><option>Safety Equipment</option><option>AV / TV</option><option>Structural</option><option>General Repair</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5 font-data-mono">Location *</label>
                <select id="new-location" class="w-full border border-outline-variant rounded-xl text-xs py-2.5 px-3 bg-surface-bright text-on-surface focus:outline-none focus:border-primary">
                  <option>Guest Room</option><option>Lobby</option><option>Restaurant and F&amp;B</option><option>Kitchen</option><option>Pool and Spa</option><option>Gym</option><option>Basement Engineering</option><option>Parking</option><option>Back of House</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5 font-data-mono">Room Number</label>
                <input id="new-room" type="text" placeholder="e.g. 402 (leave blank if not a room)" class="w-full border border-outline-variant rounded-xl text-xs py-2.5 px-3 bg-surface-bright text-on-surface focus:outline-none focus:border-primary font-data-mono" />
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5 font-data-mono">Assign Technician</label>
                <select id="new-tech" class="w-full border border-outline-variant rounded-xl text-xs py-2.5 px-3 bg-surface-bright text-on-surface focus:outline-none focus:border-primary">
                  <option value="">Unassigned</option>
                  ${this.technicians.filter(t => t.onDuty).map(t => `<option value="${t.name}">${t.name} (${t.specialty})</option>`).join('')}
                </select>
              </div>
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5 font-data-mono">Problem Title *</label>
              <input id="new-issue" type="text" placeholder="e.g. AC not cooling, TV not turning on..." class="w-full border border-outline-variant rounded-xl text-xs py-2.5 px-3 bg-surface-bright text-on-surface focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5 font-data-mono">Full Description</label>
              <textarea id="new-desc" rows="3" placeholder="Describe the issue in detail — symptoms, observations..." class="w-full border border-outline-variant rounded-xl text-xs py-2.5 px-3 bg-surface-bright text-on-surface focus:outline-none focus:border-primary resize-none"></textarea>
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2 font-data-mono">Priority *</label>
              <div class="flex items-center gap-3 flex-wrap">
                ${['LOW','NORMAL','HIGH','CRITICAL'].map(p => `
                  <label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-outline-variant cursor-pointer text-xs hover:bg-surface-container">
                    <input type="radio" name="new-priority" value="${p}" class="accent-primary" ${p === 'NORMAL' ? 'checked' : ''} />
                    <span class="font-bold">${p}</span>
                  </label>
                `).join('')}
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5 font-data-mono">Guest Affected?</label>
                <div class="flex gap-3">
                  <label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-outline-variant cursor-pointer text-xs hover:bg-surface-container"><input type="radio" name="new-guest" value="yes" class="accent-primary" />Yes</label>
                  <label class="flex items-center gap-2 px-3 py-2 rounded-lg border border-outline-variant cursor-pointer text-xs hover:bg-surface-container"><input type="radio" name="new-guest" value="no" class="accent-primary" checked />No</label>
                </div>
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5 font-data-mono">Room Impact</label>
                <div class="flex gap-2 flex-wrap">
                  ${['NONE','OUT_OF_SERVICE','OUT_OF_ORDER'].map(imp => `<label class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-outline-variant cursor-pointer text-[10px] hover:bg-surface-container"><input type="radio" name="new-impact" value="${imp}" class="accent-primary" ${imp==='NONE'?'checked':''} /><span class="font-bold">${this._impactLabel(imp)}</span></label>`).join('')}
                </div>
              </div>
            </div>
          </div>
          <div class="px-6 py-4 border-t border-outline-variant bg-surface-container flex items-center justify-end gap-3">
            <button id="btn-cancel-create" class="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container text-xs font-semibold cursor-pointer">Cancel</button>
            <button id="btn-submit-create" class="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow-xs cursor-pointer hover:bg-primary/90 active:scale-95 flex items-center gap-1.5 transition-all">
              <span class="material-symbols-outlined text-[15px]">check</span>Create Work Order
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ── Live Active Service Timer Bar ─────────────────────────────────────────
  _html_activeTimerBar(timer) {
    if (!timer) return '';
    const h = Math.floor((timer.elapsedSeconds || 0) / 3600);
    const m = Math.floor(((timer.elapsedSeconds || 0) % 3600) / 60);
    const s = (timer.elapsedSeconds || 0) % 60;
    const timeFormatted = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;

    return `
      <div class="sticky top-2 z-40 bg-gray-900 text-white border-2 border-emerald-500/80 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-fadeIn">
        <div class="flex items-center gap-3.5 min-w-0 w-full md:w-auto">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-2xl ${timer.isPaused ? '' : 'animate-spin'}" style="${timer.isPaused ? '' : 'animation-duration: 4s'}">settings</span>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold font-data-mono ${timer.isPaused ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'}">
                <span class="w-2 h-2 rounded-full ${timer.isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'}"></span>
                ${timer.isPaused ? 'TIMER PAUSED' : 'LIVE PM SERVICE TIMER RUNNING'}
              </span>
              <span class="text-xs text-gray-400 font-data-mono">Started ${timer.startedAtFormatted}</span>
            </div>
            <div class="text-sm font-bold text-white truncate mt-1 flex items-center gap-2">
              <span>${timer.assetCode}</span>
              <span class="text-gray-500">•</span>
              <span class="text-emerald-300 truncate">${timer.assetName}</span>
            </div>
            <div class="text-[11px] text-gray-300 flex items-center gap-2 mt-0.5">
              <span>Servicing Engineer: <strong class="text-white">${timer.engineer}</strong></span>
              <span>•</span>
              <span class="text-gray-400">${timer.frequency} PM Routine (Cycle #${timer.cycleCount})</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-800">
          <div class="text-right">
            <div class="text-[10px] uppercase tracking-wider text-gray-400 font-data-mono">Active Service Duration</div>
            <div id="live-timer-counter" class="font-data-mono text-2xl font-bold text-emerald-400 tracking-wider">
              ${timeFormatted}
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button id="btn-pause-service-timer" class="px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border ${timer.isPaused ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' : 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700'} flex items-center gap-1.5 active:scale-95">
              <span class="material-symbols-outlined text-[16px]">${timer.isPaused ? 'play_arrow' : 'pause'}</span>
              <span>${timer.isPaused ? 'Resume' : 'Pause'}</span>
            </button>
            <button id="btn-complete-service-timer" class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-all shadow-md active:scale-95 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Complete & Log Work</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ── Assets Panel ──────────────────────────────────────────────────────────
  _html_assets() {
    const sc = s => {
      if (s === 'Operational') return 'bg-green-100 text-green-700 border-green-300';
      if (s.includes('Repair') || s.includes('Inspection') || s.includes('Degraded')) return 'bg-orange-100 text-orange-700 border-orange-300';
      if (s.includes('Parts') || s.includes('Awaiting')) return 'bg-purple-100 text-purple-700 border-purple-300';
      return 'bg-gray-100 text-gray-600 border-gray-300';
    };

    const activeTimer = store?.state?.activeMaintenanceTimer;

    return `
      <div class="space-y-4">
        <div class="flex items-center justify-between gap-4 flex-wrap bg-surface-container p-4 rounded-xl border border-outline-variant/60">
          <div>
            <h3 class="text-sm font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-lg">precision_manufacturing</span>
              Hotel Machinery & Equipment Registry
            </h3>
            <p class="text-xs text-on-surface-variant mt-0.5">Comprehensive dossier of hotel assets with cumulative service duration and full engineer logbook history.</p>
          </div>
          <div class="flex items-center gap-2 text-xs font-data-mono">
            <span class="px-2.5 py-1 rounded-lg bg-surface-container-lowest border border-outline-variant text-primary font-bold">
              ${this.assets.length} Total Machines
            </span>
            <span class="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold">
              ${this.assets.filter(a => a.status === 'Operational').length} 100% Operational
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          ${this.assets.map(a => {
            const isCurrentlyServiced = activeTimer && activeTimer.assetCode === a.code;
            const historyList = Array.isArray(a.history) ? a.history : [];
            const recentHistory = historyList.slice(0, 2);

            return `
              <div class="bg-surface-container-lowest border ${isCurrentlyServiced ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20' : 'border-outline-variant hover:border-primary'} rounded-xl p-4 transition-all flex flex-col justify-between">
                <div>
                  ${isCurrentlyServiced ? `
                    <div class="mb-3 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-[11px] font-bold font-data-mono flex items-center justify-between">
                      <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>SERVICING NOW: ${activeTimer.engineer}</span>
                      <span>IN PROGRESS</span>
                    </div>
                  ` : ''}

                  <div class="flex items-start justify-between mb-3">
                    <div>
                      <div class="text-sm font-bold text-primary hover:underline cursor-pointer btn-view-asset-dossier" data-assetcode="${a.code}">${a.name}</div>
                      <div class="text-[10px] text-on-surface-variant font-data-mono">${a.code} · ${a.category}</div>
                    </div>
                    <span class="px-2 py-0.5 rounded border text-[9px] font-bold font-data-mono ${sc(a.status)}">${a.status}</span>
                  </div>

                  <div class="grid grid-cols-2 gap-2 text-[10px] text-on-surface-variant mb-3 bg-surface-container/30 p-2.5 rounded-lg border border-outline-variant/40">
                    <div><div class="uppercase tracking-wide font-bold text-on-surface-variant mb-0.5">Location</div><div class="text-on-surface font-medium">${a.location}</div></div>
                    <div><div class="uppercase tracking-wide font-bold text-on-surface-variant mb-0.5">Total Service Hours</div><div class="text-primary font-bold font-data-mono">${a.totalHoursWorked || '0.0 hrs'}</div></div>
                    <div><div class="uppercase tracking-wide font-bold text-on-surface-variant mb-0.5">Last Service</div><div class="text-on-surface">${a.lastMaint}</div></div>
                    <div><div class="uppercase tracking-wide font-bold text-on-surface-variant mb-0.5">Next Service</div><div class="text-primary font-semibold">${a.nextMaint}</div></div>
                  </div>

                  <!-- Engineer Working History Preview -->
                  <div class="pt-2 border-t border-outline-variant/60">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-[10px] text-primary uppercase tracking-wide font-bold flex items-center gap-1">
                        <span class="material-symbols-outlined text-[13px]">history_edu</span>
                        Engineer Service History (${historyList.length})
                      </span>
                      <button class="btn-view-asset-dossier text-[10px] font-bold text-primary hover:underline cursor-pointer" data-assetcode="${a.code}">
                        View All →
                      </button>
                    </div>

                    ${recentHistory.length > 0 ? `
                      <div class="space-y-2">
                        ${recentHistory.map(h => {
                          if (typeof h === 'string') {
                            return `<div class="text-[10px] text-on-surface-variant flex items-start gap-1"><span class="text-primary/40">•</span>${h}</div>`;
                          }
                          const initials = (h.engineer || 'Eng').split(' ').map(n=>n[0]).join('').slice(0,2);
                          return `
                            <div class="p-2 rounded-lg bg-surface-container/50 border border-outline-variant/40 text-[10px]">
                              <div class="flex items-center justify-between gap-1">
                                <div class="flex items-center gap-1.5 font-bold text-on-surface">
                                  <span class="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[9px] font-bold">${initials}</span>
                                  <span>${h.engineer}</span>
                                  <span class="text-on-surface-variant text-[9px] font-normal">(${h.engineerRole?.split(' ')[0] || 'Eng'})</span>
                                </div>
                                <span class="px-1.5 py-0.2 rounded bg-primary/10 text-primary font-bold font-data-mono text-[9px]">${h.duration}</span>
                              </div>
                              <div class="text-on-surface-variant mt-1 line-clamp-1 font-medium">${h.serviceType}: ${h.notes}</div>
                              <div class="text-[9px] text-on-surface-variant/80 mt-0.5 font-data-mono">${h.date}</div>
                            </div>
                          `;
                        }).join('')}
                      </div>
                    ` : '<div class="text-[10px] text-on-surface-variant italic py-1">No past service records logged.</div>'}
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-outline-variant/60 flex items-center gap-2">
                  <button class="btn-view-asset-dossier flex-1 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant text-primary text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-1" data-assetcode="${a.code}">
                    <span class="material-symbols-outlined text-[14px]">menu_book</span>
                    <span>Machine Dossier</span>
                  </button>
                  <button class="btn-open-log-service px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold cursor-pointer transition-all flex items-center gap-1 shadow-2xs active:scale-95" data-assetcode="${a.code}" title="Log a service completed on this machine">
                    <span class="material-symbols-outlined text-[14px]">post_add</span>
                    <span>+ Log Service</span>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // ── Machine Dossier & Engineer History Drawer ─────────────────────────────
  _html_assetDrawer(asset) {
    if (!asset) return '';
    const historyList = Array.isArray(asset.history) ? asset.history : [];
    const totalMinutes = historyList.reduce((acc, h) => acc + (typeof h === 'object' ? (h.durationMinutes || 60) : 60), 0);
    const totalHours = (totalMinutes / 60).toFixed(1);

    // Group hours worked by engineer
    const engineerHours = {};
    historyList.forEach(h => {
      if (typeof h === 'object' && h.engineer) {
        engineerHours[h.engineer] = (engineerHours[h.engineer] || 0) + (h.durationMinutes || 60);
      }
    });

    return `
      <div id="asset-drawer-backdrop" class="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm animate-fadeIn"></div>
      <div class="fixed right-0 top-0 h-full z-[61] w-full max-w-2xl bg-surface-bright shadow-2xl flex flex-col overflow-hidden" style="animation:slideInRight .25s ease">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-outline-variant bg-surface-container flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1 flex-wrap">
              <span class="px-2 py-0.5 rounded border text-[10px] font-bold font-data-mono bg-primary/10 text-primary border-primary/20">Machine Dossier</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold font-data-mono bg-surface-container-high text-on-surface border border-outline-variant">${asset.category}</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold font-data-mono ${asset.status === 'Operational' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}">${asset.status}</span>
            </div>
            <h2 class="font-bold text-lg text-primary leading-snug">${asset.name}</h2>
            <div class="flex items-center gap-3 mt-1 text-xs text-on-surface-variant flex-wrap font-data-mono">
              <span class="font-bold text-primary">${asset.code}</span>
              <span>•</span>
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[13px]">location_on</span>${asset.location}</span>
            </div>
          </div>
          <button id="btn-close-asset-drawer" class="p-2 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer shrink-0">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Telemetry KPIs -->
        <div class="grid grid-cols-4 gap-3 px-6 py-3.5 border-b border-outline-variant/60 bg-surface-container/30 text-center">
          <div>
            <div class="text-[9px] text-on-surface-variant font-data-mono uppercase tracking-wider">Total Service Hours</div>
            <div class="text-sm font-bold text-primary mt-0.5 font-data-mono">${asset.totalHoursWorked || `${totalHours} hrs`}</div>
          </div>
          <div>
            <div class="text-[9px] text-on-surface-variant font-data-mono uppercase tracking-wider">Engineer Interventions</div>
            <div class="text-sm font-bold text-on-surface mt-0.5 font-data-mono">${historyList.length} visits</div>
          </div>
          <div>
            <div class="text-[9px] text-on-surface-variant font-data-mono uppercase tracking-wider">Warranty Expiry</div>
            <div class="text-xs font-bold text-on-surface mt-0.5">${asset.warranty}</div>
          </div>
          <div>
            <div class="text-[9px] text-on-surface-variant font-data-mono uppercase tracking-wider">Next PM Due</div>
            <div class="text-xs font-bold text-primary mt-0.5">${asset.nextMaint}</div>
          </div>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto custom-scrollbar px-6 py-5 space-y-6">
          <!-- 1. Technical Specs & Information -->
          <div>
            <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2 font-data-mono flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px] text-primary">info</span>
              Machine Technical Specifications & Installation
            </div>
            <div class="bg-surface-container rounded-xl p-4 border border-outline-variant/60 grid grid-cols-2 gap-3 text-xs">
              <div><span class="text-on-surface-variant">Manufacturer / Model:</span> <strong class="text-on-surface block mt-0.5">${asset.name}</strong></div>
              <div><span class="text-on-surface-variant">Asset Identifier:</span> <strong class="text-primary font-data-mono block mt-0.5">${asset.code}</strong></div>
              <div><span class="text-on-surface-variant">Installed Location:</span> <strong class="text-on-surface block mt-0.5">${asset.location}</strong></div>
              <div><span class="text-on-surface-variant">Criticality Level:</span> <strong class="text-on-surface block mt-0.5">Tier-1 Core Infrastructure</strong></div>
            </div>
          </div>

          <!-- 2. Engineer Time Breakdown -->
          ${Object.keys(engineerHours).length > 0 ? `
            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2.5 font-data-mono flex items-center justify-between">
                <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px] text-primary">badge</span>Engineers Working on this Machine</span>
                <span class="text-[9px] text-on-surface-variant font-normal">Cumulative hours</span>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                ${Object.entries(engineerHours).map(([eng, mins]) => `
                  <div class="p-3 rounded-xl border border-outline-variant bg-surface-container-lowest">
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                        ${eng.split(' ').map(n=>n[0]).join('').slice(0,2)}
                      </div>
                      <div class="min-w-0">
                        <div class="text-xs font-bold text-on-surface truncate">${eng}</div>
                        <div class="text-[10px] font-data-mono font-bold text-primary">${(mins/60).toFixed(1)}h logged</div>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- 3. Full Chronological Engineer Service Logbook -->
          <div>
            <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2.5 font-data-mono flex items-center justify-between">
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px] text-primary">history_edu</span>Chronological Engineer Service Logbook</span>
              <span class="text-[9px] text-on-surface-variant font-normal">${historyList.length} entries</span>
            </div>

            <div class="space-y-3">
              ${historyList.length > 0 ? historyList.map(entry => {
                if (typeof entry === 'string') {
                  return `
                    <div class="p-3.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface">
                      ${entry}
                    </div>
                  `;
                }
                const initials = (entry.engineer || 'Eng').split(' ').map(n=>n[0]).join('').slice(0,2);
                return `
                  <div class="p-4 rounded-xl border border-outline-variant bg-surface-container-lowest hover:border-primary transition-all space-y-2.5 shadow-2xs">
                    <div class="flex items-start justify-between gap-2">
                      <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold shadow-xs">
                          ${initials}
                        </div>
                        <div>
                          <div class="text-xs font-bold text-primary flex items-center gap-1.5">
                            <span>${entry.engineer}</span>
                            <span class="text-[10px] font-normal text-on-surface-variant">• ${entry.engineerRole}</span>
                          </div>
                          <div class="text-[10px] text-on-surface-variant font-data-mono">${entry.date}</div>
                        </div>
                      </div>
                      <div class="text-right">
                        <span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold font-data-mono">
                          ⏱️ ${entry.duration}
                        </span>
                      </div>
                    </div>

                    <div class="p-3 rounded-lg bg-surface-container/60 border border-outline-variant/40">
                      <div class="text-xs font-bold text-on-surface mb-0.5">${entry.serviceType}</div>
                      <p class="text-xs text-on-surface-variant leading-relaxed">${entry.notes}</p>
                    </div>

                    ${entry.parts && entry.parts.length > 0 ? `
                      <div class="flex items-center gap-1.5 flex-wrap text-[10px]">
                        <span class="text-on-surface-variant font-bold font-data-mono uppercase">Spares:</span>
                        ${entry.parts.map(p => `<span class="px-2 py-0.5 rounded bg-surface-container border border-outline-variant font-data-mono text-on-surface">${p}</span>`).join('')}
                      </div>
                    ` : ''}

                    <div class="pt-2 border-t border-outline-variant/40 flex items-center justify-between text-[10px]">
                      <span class="inline-flex items-center gap-1 text-emerald-700 font-bold font-data-mono">
                        <span class="material-symbols-outlined text-[13px]">verified</span>
                        ${entry.status || 'VERIFIED'} BY ENGINEERING
                      </span>
                      <span class="text-on-surface-variant font-data-mono">Record ID: ${entry.id}</span>
                    </div>
                  </div>
                `;
              }).join('') : `
                <div class="text-center py-8 text-on-surface-variant border border-dashed border-outline-variant rounded-xl">
                  <span class="material-symbols-outlined text-3xl opacity-40">engineering</span>
                  <p class="text-xs font-medium mt-1">No service records on file yet.</p>
                </div>
              `}
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-outline-variant bg-surface-container flex items-center justify-between gap-3">
          <button id="btn-close-asset-drawer2" class="px-4 py-2 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-on-surface-variant cursor-pointer">
            Close Dossier
          </button>
          <button class="btn-open-log-service px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-sm active:scale-95" data-assetcode="${asset.code}">
            <span class="material-symbols-outlined text-[16px]">post_add</span>
            <span>+ Log Service Record</span>
          </button>
        </div>
      </div>
    `;
  }

  // ── Manual Log Service Modal ──────────────────────────────────────────────
  _html_logServiceModal(asset) {
    if (!asset) return '';

    return `
      <div id="log-service-backdrop" class="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm animate-fadeIn"></div>
      <div class="fixed inset-0 z-[71] flex items-center justify-center p-4">
        <div class="bg-surface-bright rounded-2xl shadow-2xl border border-outline-variant max-w-lg w-full flex flex-col max-h-[90vh] overflow-hidden animate-fadeIn">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-container flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                <span class="material-symbols-outlined text-[18px]">history_edu</span>
              </div>
              <div>
                <h3 class="font-bold text-base text-primary">Log Engineer Service Record</h3>
                <p class="text-xs text-on-surface-variant">Record engineer intervention & work history for <strong>${asset.code}</strong>.</p>
              </div>
            </div>
            <button id="btn-close-log-service" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <!-- Machine details banner -->
          <div class="px-6 py-2.5 bg-primary/5 border-b border-outline-variant/60 flex items-center justify-between text-xs font-data-mono">
            <span>Machine: <strong class="text-primary">${asset.name}</strong></span>
            <span>Location: <strong class="text-on-surface">${asset.location}</strong></span>
          </div>

          <!-- Modal Form -->
          <div class="p-6 overflow-y-auto custom-scrollbar space-y-4 flex-1">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-primary mb-1">Servicing Engineer *</label>
                <select id="log-srv-engineer" class="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:outline-none focus:border-primary font-medium">
                  ${this.technicians.map(t => `<option value="${t.name}">${t.name} (${t.role})</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-primary mb-1">Duration Worked *</label>
                <select id="log-srv-duration" class="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:outline-none focus:border-primary font-data-mono font-bold">
                  <option value="30m">30 minutes</option>
                  <option value="45m">45 minutes</option>
                  <option value="1h 00m" selected>1 hour</option>
                  <option value="1h 30m">1 hour 30 mins</option>
                  <option value="2h 00m">2 hours</option>
                  <option value="2h 30m">2 hours 30 mins</option>
                  <option value="3h 00m">3 hours</option>
                  <option value="4h 00m">4 hours</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-primary mb-1">Service Type / Work Category *</label>
              <input id="log-srv-type" type="text" placeholder="e.g. Scheduled PM Service, Bearing Lubrication, Filter Wash" value="Scheduled PM Service"
                class="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:outline-none focus:border-primary font-medium" />
            </div>

            <div>
              <label class="block text-xs font-bold text-primary mb-1">Spares / Materials Used</label>
              <input id="log-srv-parts" type="text" placeholder="e.g. Synthetic Oil 15W-40, Oil Filter Cartridge (optional)"
                class="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:outline-none focus:border-primary font-data-mono" />
            </div>

            <div>
              <label class="block text-xs font-bold text-primary mb-1">Engineer Observations & Findings *</label>
              <textarea id="log-srv-notes" rows="3" placeholder="Describe the work completed, readings measured, and equipment condition..."
                class="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:outline-none focus:border-primary resize-none"></textarea>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 border-t border-outline-variant bg-surface-container flex items-center justify-end gap-3">
            <button id="btn-cancel-log-service" class="px-4 py-2 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-on-surface-variant cursor-pointer">
              Cancel
            </button>
            <button id="btn-submit-log-service" data-assetcode="${asset.code}" class="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold cursor-pointer transition-all shadow-sm active:scale-95 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">verified</span>
              Commit Service Entry
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ── Preventive Panel ──────────────────────────────────────────────────────
  _html_preventive() {
    const pms = this.preventive;
    const dueSoon = pms.filter(p => p.daysUntil <= 2);
    const upcoming = pms.filter(p => p.daysUntil > 2 && p.daysUntil <= (p.notifyAdvanceDays || 7));
    const onTrack = pms.filter(p => p.daysUntil > (p.notifyAdvanceDays || 7));
    const alertItems = pms.filter(p => p.daysUntil <= (p.notifyAdvanceDays || 7)).sort((a, b) => a.daysUntil - b.daysUntil);

    // Apply frequency filter
    let filteredPms = [...pms];
    if (this.pmFrequencyFilter === 'ALERTS') {
      filteredPms = filteredPms.filter(p => p.daysUntil <= (p.notifyAdvanceDays || 7));
    } else if (this.pmFrequencyFilter !== 'ALL') {
      filteredPms = filteredPms.filter(p => p.frequency === this.pmFrequencyFilter);
    }
    filteredPms.sort((a, b) => a.daysUntil - b.daysUntil);

    const freqCounts = {
      ALL: pms.length,
      ALERTS: alertItems.length,
      Weekly: pms.filter(p => p.frequency === 'Weekly').length,
      Monthly: pms.filter(p => p.frequency === 'Monthly').length,
      Quarterly: pms.filter(p => p.frequency === 'Quarterly').length,
      'Semi-Annual': pms.filter(p => p.frequency === 'Semi-Annual' || p.frequency === 'Annual').length,
    };

    const freqColor = f => {
      switch (f) {
        case 'Weekly': return 'bg-purple-100 text-purple-700 border-purple-300';
        case 'Monthly': return 'bg-blue-100 text-blue-700 border-blue-300';
        case 'Quarterly': return 'bg-teal-100 text-teal-700 border-teal-300';
        case 'Semi-Annual': return 'bg-indigo-100 text-indigo-700 border-indigo-300';
        case 'Annual': return 'bg-amber-100 text-amber-700 border-amber-300';
        default: return 'bg-slate-100 text-slate-700 border-slate-300';
      }
    };

    return `
      <div class="space-y-6">
        <!-- 1. Preventive Schedule & Notification Alerts Header Banner -->
        <div class="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-surface-container-lowest border border-amber-500/30 rounded-2xl p-5 shadow-xs">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="flex items-start gap-3.5">
              <div class="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <span class="material-symbols-outlined text-2xl">notifications_active</span>
              </div>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h2 class="text-base font-bold text-primary">Preventive Maintenance Schedule & Notification Alerts</h2>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 font-data-mono flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                    ${dueSoon.length} DUE SOON • ${upcoming.length} UPCOMING THIS WEEK
                  </span>
                </div>
                <p class="text-xs text-on-surface-variant mt-0.5">
                  Fixed recurring schedules timed by <strong>Weekly, Monthly, and Quarterly</strong> intervals with automated advance notifications for engineering staff.
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2 flex-wrap shrink-0">
              <button id="btn-open-schedule-pm" class="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary/90 cursor-pointer flex items-center gap-1.5 transition-all shadow-xs active:scale-95">
                <span class="material-symbols-outlined text-[16px]">add_circle</span>+ Schedule PM
              </button>
            </div>
          </div>

          <!-- Notification Alert Cards Strip -->
          ${alertItems.length > 0 ? `
            <div class="mt-4 pt-4 border-t border-amber-500/20">
              <div class="text-[10px] font-bold uppercase tracking-wider text-amber-900 mb-2.5 font-data-mono flex items-center justify-between">
                <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[13px]">alarm</span>Upcoming Timed Service Notifications</span>
                <span class="text-[10px] text-amber-700 font-normal">Advance alerts active (${alertItems.length})</span>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                ${alertItems.map(pm => {
                  const isCritSoon = pm.daysUntil <= 2;
                  const borderCls = isCritSoon ? 'border-red-300 bg-red-50/80' : 'border-amber-300 bg-amber-50/80';
                  const badgeCls = isCritSoon ? 'bg-red-600 text-white' : 'bg-amber-600 text-white';
                  const alertLabel = isCritSoon ? `🚨 DUE IN ${pm.daysUntil} DAYS` : `⚠️ DUE IN ${pm.daysUntil} DAYS`;
                  const cd = this._calcCountdown(pm.dueDate, pm.dueTime);

                  return `
                    <div class="rounded-xl border ${borderCls} p-3 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all">
                      <div>
                        <div class="flex items-center justify-between gap-1 mb-1.5">
                          <span class="px-2 py-0.5 rounded text-[9px] font-bold font-data-mono ${badgeCls}">${alertLabel}</span>
                          <span class="px-1.5 py-0.5 rounded border text-[9px] font-bold font-data-mono ${freqColor(pm.frequency)}">${pm.frequency}</span>
                        </div>
                        <h4 class="text-xs font-bold text-primary leading-snug line-clamp-2">${pm.title}</h4>
                        <div class="text-[10px] text-on-surface-variant font-data-mono mt-1 flex items-center gap-1 truncate">
                          <span class="material-symbols-outlined text-[12px] text-primary/70">precision_manufacturing</span>
                          <span>${pm.assetCode} · ${pm.location}</span>
                        </div>
                        <div class="text-[10px] text-on-surface-variant mt-1">
                          Timing: <strong class="text-on-surface">${pm.scheduleRule}</strong>
                        </div>
                        <div class="text-[10px] text-on-surface-variant mt-0.5">
                          Assigned: <strong class="text-primary">${pm.assignedTo}</strong>
                        </div>

                        <!-- Live Countdown Timer -->
                        <div class="mt-2 py-1 px-2 rounded-lg bg-black/5 flex items-center justify-between">
                          <span class="text-[9px] text-on-surface-variant font-data-mono uppercase">Countdown:</span>
                          <span class="text-[10px] font-data-mono font-bold ${isCritSoon ? 'text-red-700' : 'text-amber-800'} flex items-center gap-1">
                            <span class="material-symbols-outlined text-[12px] animate-pulse">timer</span>
                            ${cd.clock}
                          </span>
                        </div>
                      </div>
                      <div class="mt-3 pt-2.5 border-t border-black/10 flex items-center gap-1.5 flex-wrap">
                        ${pm.linkedWoId ? `
                          <button class="btn-open-wo flex-1 px-2.5 py-1 rounded-lg bg-teal-600 text-white text-[10px] font-bold cursor-pointer hover:bg-teal-700 transition-all flex items-center justify-center gap-1" data-woid="${pm.linkedWoId}">
                            <span class="material-symbols-outlined text-[12px]">build</span>WO Active (${pm.linkedWoId})
                          </button>
                        ` : `
                          <button class="btn-pm-create-wo flex-1 px-2 py-1 rounded-lg bg-primary text-on-primary text-[10px] font-bold cursor-pointer hover:bg-primary/90 transition-all flex items-center justify-center gap-0.5 active:scale-95" data-pmid="${pm.id}">
                            <span class="material-symbols-outlined text-[12px]">bolt</span>Create WO
                          </button>
                        `}
                        <button class="btn-start-pm-timer px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold cursor-pointer transition-all flex items-center gap-0.5 active:scale-95 shadow-2xs" data-pmid="${pm.id}" title="Start Live Service Stopwatch">
                          <span class="material-symbols-outlined text-[12px]">play_circle</span>Timer
                        </button>
                        <button class="btn-pm-advance-cycle px-2 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold cursor-pointer transition-all flex items-center gap-0.5 active:scale-95" data-pmid="${pm.id}" title="Complete this cycle and advance to next scheduled date">
                          <span class="material-symbols-outlined text-[12px]">check_circle</span>Done
                        </button>
                        <button class="btn-pm-notify-tech p-1 rounded-lg border border-outline-variant hover:bg-white text-on-surface-variant text-[10px] font-bold cursor-pointer transition-all flex items-center" data-pmid="${pm.id}" title="Send notification reminder to ${pm.assignedTo}">
                          <span class="material-symbols-outlined text-[13px] ${pm.notificationSent ? 'text-green-600' : 'text-primary'}">forward_to_inbox</span>
                        </button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- 2. Fixed Schedule Cadence & Frequency Filter Bar -->
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1">
            ${[
              { id: 'ALL', label: `All Schedules (${freqCounts.ALL})`, icon: 'list_alt' },
              { id: 'ALERTS', label: `🚨 Alerts & Due Soon (${freqCounts.ALERTS})`, icon: 'notifications' },
              { id: 'Weekly', label: `Weekly (${freqCounts.Weekly})`, icon: 'view_week' },
              { id: 'Monthly', label: `Monthly (${freqCounts.Monthly})`, icon: 'calendar_month' },
              { id: 'Quarterly', label: `Quarterly (${freqCounts.Quarterly})`, icon: 'event_repeat' },
              { id: 'Semi-Annual', label: `Semi-Annual (${freqCounts['Semi-Annual']})`, icon: 'date_range' },
            ].map(f => {
              const active = this.pmFrequencyFilter === f.id;
              const cls = active
                ? 'bg-primary text-on-primary font-bold shadow-xs'
                : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary font-semibold';
              return `
                <button class="pm-freq-filter-btn px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-all whitespace-nowrap flex items-center gap-1.5 ${cls}" data-freq="${f.id}">
                  <span class="material-symbols-outlined text-[14px]">${f.icon}</span>
                  <span>${f.label}</span>
                </button>
              `;
            }).join('')}
          </div>
          <div class="text-xs text-on-surface-variant font-data-mono">
            Showing <strong>${filteredPms.length}</strong> of ${pms.length} PM routines
          </div>
        </div>

        <!-- 3. Fixed Schedule Preventive Maintenance Table -->
        <div class="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-xs">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-outline-variant bg-surface-container text-[10px] font-bold tracking-wider text-on-surface-variant uppercase font-data-mono">
                  <th class="py-3 px-4">Task & Asset</th>
                  <th class="py-3 px-4">Location</th>
                  <th class="py-3 px-4">Fixed Cadence & Timing</th>
                  <th class="py-3 px-4">Due Date & Horizon</th>
                  <th class="py-3 px-4">Alert Status</th>
                  <th class="py-3 px-4">Lead Engineer</th>
                  <th class="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant/40">
                ${filteredPms.length > 0 ? filteredPms.map(pm => {
                  const isSoon = pm.daysUntil <= 2;
                  const isNear = pm.daysUntil <= (pm.notifyAdvanceDays || 7);
                  const bc = isSoon ? 'bg-red-100 text-red-700 border-red-300' : isNear ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-blue-100 text-blue-700 border-blue-300';
                  const bl = pm.linkedWoId ? 'WO ACTIVE' : isSoon ? 'DUE SOON' : isNear ? 'UPCOMING' : 'SCHEDULED';
                  const cd = this._calcCountdown(pm.dueDate, pm.dueTime);

                  return `
                    <tr class="hover:bg-surface-container/40 transition-colors ${isSoon ? 'bg-red-50/20' : ''}">
                      <td class="py-3.5 px-4">
                        <div class="flex items-start gap-2">
                          <div>
                            <div class="text-xs font-bold text-primary hover:underline cursor-pointer btn-view-pm" data-pmid="${pm.id}">${pm.title}</div>
                            <div class="text-[10px] text-on-surface-variant font-data-mono flex items-center gap-1.5 mt-0.5">
                              <span class="font-bold text-primary/80">${pm.assetCode}</span>
                              <span class="text-outline-variant">•</span>
                              <span class="truncate max-w-[140px]">${pm.assetName || pm.title}</span>
                              <span class="px-1.5 py-0.2 rounded bg-surface-container text-[9px] text-on-surface-variant">${(pm.checklist || []).length} checks</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="py-3.5 px-4">
                        <div class="text-xs text-on-surface">${pm.location}</div>
                        <div class="text-[10px] text-on-surface-variant font-data-mono">Est. ${pm.estimatedDuration || '1h'}</div>
                      </td>
                      <td class="py-3.5 px-4">
                        <div class="flex items-center gap-1.5 flex-wrap">
                          <span class="px-2 py-0.5 rounded border text-[9px] font-bold font-data-mono ${freqColor(pm.frequency)}">${pm.frequency}</span>
                        </div>
                        <div class="text-[10px] text-on-surface font-semibold mt-1 font-data-mono">${pm.scheduleRule}</div>
                      </td>
                      <td class="py-3.5 px-4">
                        <div class="text-xs font-bold font-data-mono text-on-surface">${pm.dueDate} <span class="text-[10px] text-on-surface-variant font-normal">(${pm.dueTime || '08:00 AM'})</span></div>
                        <div class="text-[10px] font-data-mono font-bold ${cd.urgency === 'critical' ? 'text-red-600' : cd.urgency === 'warning' ? 'text-orange-600' : 'text-emerald-700'} flex items-center gap-1 mt-0.5">
                          <span class="material-symbols-outlined text-[12px]">timer</span>
                          <span>${cd.clock}</span>
                        </div>
                      </td>
                      <td class="py-3.5 px-4">
                        <div class="flex flex-col items-start gap-1">
                          <span class="px-2 py-0.5 rounded border text-[9px] font-bold font-data-mono ${bc}">${bl}</span>
                          <span class="text-[9px] text-on-surface-variant font-data-mono">Notice: ${pm.notifyAdvanceDays || 7}d advance</span>
                        </div>
                      </td>
                      <td class="py-3.5 px-4">
                        <div class="flex items-center gap-2">
                          <div class="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                            ${pm.assignedTo.split(' ').map(n=>n[0]).join('').slice(0,2)}
                          </div>
                          <div>
                            <div class="text-xs text-on-surface font-medium">${pm.assignedTo}</div>
                            <div class="text-[9px] text-on-surface-variant">Cycle #${pm.cycleCount || 1}</div>
                          </div>
                        </div>
                      </td>
                      <td class="py-3.5 px-4 text-right">
                        <div class="flex items-center justify-end gap-1.5 flex-wrap">
                          <button class="btn-start-pm-timer px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-all flex items-center gap-1 active:scale-95 shadow-2xs" data-pmid="${pm.id}" title="Start Live Service Stopwatch">
                            <span class="material-symbols-outlined text-[14px]">timer</span>Start Timer
                          </button>
                          ${pm.linkedWoId ? `
                            <button class="btn-open-wo px-2.5 py-1.5 rounded-lg border border-teal-500 text-teal-700 hover:bg-teal-50 text-xs font-bold cursor-pointer transition-all flex items-center gap-1" data-woid="${pm.linkedWoId}">
                              <span class="material-symbols-outlined text-[13px]">build</span>WO: ${pm.linkedWoId}
                            </button>
                          ` : `
                            <button class="btn-pm-create-wo px-2.5 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary/90 text-xs font-bold cursor-pointer transition-all flex items-center gap-1 active:scale-95 shadow-2xs" data-pmid="${pm.id}" title="Generate Work Order">
                              <span class="material-symbols-outlined text-[13px]">bolt</span>Create WO
                            </button>
                          `}
                          <button class="btn-pm-advance-cycle px-2 py-1.5 rounded-lg border border-emerald-500/40 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold cursor-pointer transition-all flex items-center gap-1 active:scale-95" data-pmid="${pm.id}" title="Mark completed and advance to next scheduled cycle">
                            <span class="material-symbols-outlined text-[14px]">check_circle</span>Done
                          </button>
                          <button class="btn-view-pm px-2 py-1.5 rounded-lg border border-outline-variant hover:border-primary text-xs font-semibold text-on-surface-variant hover:text-primary cursor-pointer transition-all" data-pmid="${pm.id}">
                            Schedule
                          </button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('') : `
                  <tr>
                    <td colspan="7" class="py-12 text-center text-on-surface-variant">
                      <span class="material-symbols-outlined text-4xl block mb-2 opacity-30">event_busy</span>
                      <p class="text-sm font-semibold">No preventive maintenance schedules match this frequency filter.</p>
                      <button class="pm-freq-filter-btn mt-2 text-xs font-bold text-primary hover:underline" data-freq="ALL">Reset to All Schedules</button>
                    </td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // ── PM Detail & Multi-Cycle Schedule Drawer ───────────────────────────────
  _html_pmDrawer(pm) {
    if (!pm) return '';
    const futureCycles = this._calculateFutureCycles(pm.dueDate, pm.frequency, 4);
    const cd = this._calcCountdown(pm.dueDate, pm.dueTime);
    const machineAsset = this.assets.find(a => a.code === pm.assetCode);
    const machineHistory = machineAsset && Array.isArray(machineAsset.history) ? machineAsset.history : [];

    return `
      <div id="pm-detail-backdrop" class="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm animate-fadeIn"></div>
      <div class="fixed right-0 top-0 h-full z-[61] w-full max-w-2xl bg-surface-bright shadow-2xl flex flex-col overflow-hidden" style="animation:slideInRight .25s ease">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-outline-variant bg-surface-container flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1 flex-wrap">
              <span class="px-2 py-0.5 rounded border text-[10px] font-bold font-data-mono bg-purple-100 text-purple-700 border-purple-300">${pm.frequency} Routine</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold font-data-mono bg-surface-container-high text-primary border border-outline-variant">Cycle #${pm.cycleCount || 1}</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold font-data-mono ${cd.urgency === 'critical' ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'} flex items-center gap-1">
                <span class="material-symbols-outlined text-[12px]">timer</span>
                <span>⏳ ${cd.clock} remaining</span>
              </span>
            </div>
            <h2 class="font-bold text-lg text-primary leading-snug">${pm.title}</h2>
            <div class="flex items-center gap-3 mt-1 text-xs text-on-surface-variant flex-wrap">
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[13px]">location_on</span>${pm.location}</span>
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[13px]">precision_manufacturing</span>${pm.assetCode} (${pm.assetName || 'Plant Asset'})</span>
            </div>
          </div>
          <button id="btn-close-pm-detail" class="p-2 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer shrink-0">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Quick Telemetry Grid -->
        <div class="grid grid-cols-4 gap-3 px-6 py-3.5 border-b border-outline-variant/60 bg-surface-container/30">
          <div>
            <div class="text-[9px] text-on-surface-variant font-data-mono uppercase tracking-wider">Frequency</div>
            <div class="text-xs font-bold text-primary mt-0.5">${pm.frequency}</div>
          </div>
          <div>
            <div class="text-[9px] text-on-surface-variant font-data-mono uppercase tracking-wider">Next Due Date</div>
            <div class="text-xs font-bold text-on-surface mt-0.5">${pm.dueDate}</div>
          </div>
          <div>
            <div class="text-[9px] text-on-surface-variant font-data-mono uppercase tracking-wider">Lead Technician</div>
            <div class="text-xs font-bold text-on-surface mt-0.5">${pm.assignedTo}</div>
          </div>
          <div>
            <div class="text-[9px] text-on-surface-variant font-data-mono uppercase tracking-wider">Countdown Clock</div>
            <div class="text-xs font-bold font-data-mono ${cd.urgency === 'critical' ? 'text-red-600' : 'text-emerald-700'} mt-0.5">${cd.clock}</div>
          </div>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto custom-scrollbar px-6 py-5 space-y-6">
          <!-- 1. Fixed Recurrence Schedule Rule -->
          <div>
            <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2 font-data-mono flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px] text-primary">event_repeat</span>
              Fixed Recurrence Schedule Rule
            </div>
            <div class="bg-surface-container rounded-xl p-4 border border-outline-variant/60">
              <div class="text-sm font-bold text-primary">${pm.scheduleRule}</div>
              <p class="text-xs text-on-surface-variant mt-1">
                Automated scheduler triggers advance notifications <strong>${pm.notifyAdvanceDays || 7} days prior</strong> to inspection due date. Work orders auto-populate standard SOP and spares checklist.
              </p>
            </div>
          </div>

          <!-- 2. Upcoming Service Cycles Timeline -->
          <div>
            <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2.5 font-data-mono flex items-center justify-between">
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px] text-primary">calendar_month</span>Upcoming Service Cycles Schedule Horizon</span>
              <span class="text-[9px] text-on-surface-variant font-normal">Auto-calculated (${pm.frequency})</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div class="p-3 rounded-xl border border-primary/40 bg-primary/5">
                <div class="text-[9px] font-bold uppercase font-data-mono text-primary">Current Cycle</div>
                <div class="text-xs font-bold text-primary mt-1 font-data-mono">${pm.dueDate}</div>
                <div class="text-[10px] font-bold text-red-600 mt-0.5">${pm.daysUntil}d away</div>
              </div>
              ${futureCycles.slice(0, 3).map((cycleDate, idx) => `
                <div class="p-3 rounded-xl border border-outline-variant bg-surface-container-lowest">
                  <div class="text-[9px] font-bold uppercase font-data-mono text-on-surface-variant">Cycle #${(pm.cycleCount || 1) + idx + 1}</div>
                  <div class="text-xs font-bold text-on-surface mt-1 font-data-mono">${cycleDate}</div>
                  <div class="text-[10px] text-on-surface-variant mt-0.5">${pm.frequency}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 3. Inspection Checklist -->
          <div>
            <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2.5 font-data-mono flex items-center justify-between">
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px] text-primary">checklist</span>Standard Operating Inspection Checklist</span>
              <span class="text-[9px] text-on-surface-variant font-normal">${(pm.checklist || []).length} steps</span>
            </div>
            <div class="space-y-2 bg-surface-container rounded-xl p-4 border border-outline-variant/60">
              ${(pm.checklist || []).map((step, idx) => `
                <label class="flex items-start gap-2.5 text-xs text-on-surface cursor-pointer select-none">
                  <input type="checkbox" class="mt-0.5 accent-primary rounded cursor-pointer" />
                  <span class="leading-relaxed"><strong class="font-data-mono text-primary/80">${idx + 1}.</strong> ${step}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- 4. Past Engineer Service Log on this Machine -->
          <div>
            <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2.5 font-data-mono flex items-center justify-between">
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px] text-primary">history_edu</span>Past Engineer Service History on ${pm.assetCode}</span>
              <button class="btn-view-asset-dossier text-[10px] font-bold text-primary hover:underline cursor-pointer" data-assetcode="${pm.assetCode}">
                Full Machine Dossier →
              </button>
            </div>
            <div class="space-y-2.5 bg-surface-container rounded-xl p-4 border border-outline-variant/60">
              ${machineHistory.length > 0 ? machineHistory.slice(0, 3).map(h => {
                if (typeof h === 'string') return `<div class="text-xs text-on-surface-variant">• ${h}</div>`;
                const initials = (h.engineer || 'Eng').split(' ').map(n=>n[0]).join('').slice(0,2);
                return `
                  <div class="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/60 text-xs">
                    <div class="flex items-center justify-between gap-2 mb-1">
                      <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">${initials}</span>
                        <strong class="text-on-surface">${h.engineer}</strong>
                        <span class="text-on-surface-variant text-[10px]">(${h.engineerRole})</span>
                      </div>
                      <span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold font-data-mono text-[9px]">${h.duration}</span>
                    </div>
                    <div class="text-on-surface font-medium">${h.serviceType}</div>
                    <p class="text-on-surface-variant mt-0.5 text-[11px]">${h.notes}</p>
                    <div class="text-[9px] text-on-surface-variant/80 font-data-mono mt-1">${h.date}</div>
                  </div>
                `;
              }).join('') : '<div class="text-xs text-on-surface-variant italic">No previous service records logged for this machine.</div>'}
            </div>
          </div>

          <!-- 5. SOP Instructions -->
          ${pm.sop ? `
            <div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-2 font-data-mono">Safety & Standard Operating Procedure (SOP)</div>
              <div class="text-xs text-on-surface leading-relaxed bg-surface-container rounded-xl p-4 border border-outline-variant/60 italic">
                "${pm.sop}"
              </div>
            </div>
          ` : ''}

          <!-- 6. Notification Status & Actions -->
          <div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center justify-between gap-3">
            <div>
              <div class="text-xs font-bold text-primary flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px] text-amber-600">notifications</span>
                Advance Engineer Notification
              </div>
              <p class="text-[11px] text-on-surface-variant mt-0.5">
                ${pm.notificationSent ? `Notification reminder dispatched to <strong>${pm.assignedTo}</strong>.` : `Notification triggers <strong>${pm.notifyAdvanceDays || 7} days prior</strong> to due date.`}
              </p>
            </div>
            <button class="btn-pm-notify-tech px-3 py-1.5 rounded-lg border border-primary text-primary hover:bg-primary/5 text-xs font-bold cursor-pointer transition-all shrink-0 active:scale-95" data-pmid="${pm.id}">
              ${pm.notificationSent ? 'Resend Alert' : 'Send Alert Now'}
            </button>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="p-4 border-t border-outline-variant bg-surface-container flex items-center justify-between gap-3">
          <button id="btn-close-pm-detail2" class="px-4 py-2 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-on-surface-variant cursor-pointer">
            Close
          </button>
          <div class="flex items-center gap-2">
            <button class="btn-start-pm-timer px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95" data-pmid="${pm.id}">
              <span class="material-symbols-outlined text-[16px]">timer</span>Start Service Timer
            </button>
            ${pm.linkedWoId ? `
              <button class="btn-open-wo px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm" data-woid="${pm.linkedWoId}">
                <span class="material-symbols-outlined text-[16px]">build</span>Open Active Work Order (${pm.linkedWoId})
              </button>
            ` : `
              <button class="btn-pm-create-wo px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95" data-pmid="${pm.id}">
                <span class="material-symbols-outlined text-[16px]">bolt</span>Generate Work Order Now
              </button>
            `}
            <button class="btn-pm-advance-cycle px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95" data-pmid="${pm.id}">
              <span class="material-symbols-outlined text-[16px]">check_circle</span>Complete & Advance Cycle
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ── Schedule PM Modal ─────────────────────────────────────────────────────
  _html_schedulePmModal() {
    return `
      <div id="pm-schedule-backdrop" class="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm animate-fadeIn"></div>
      <div class="fixed inset-0 z-[71] flex items-center justify-center p-4">
        <div class="bg-surface-bright rounded-2xl shadow-2xl border border-outline-variant max-w-xl w-full flex flex-col max-h-[90vh] overflow-hidden animate-fadeIn">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-outline-variant bg-surface-container flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                <span class="material-symbols-outlined text-[18px]">calendar_add_on</span>
              </div>
              <div>
                <h3 class="font-bold text-base text-primary">Schedule Preventive Maintenance</h3>
                <p class="text-xs text-on-surface-variant">Set up fixed recurring equipment service with automated alerts.</p>
              </div>
            </div>
            <button id="btn-close-schedule-pm" class="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant cursor-pointer">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <!-- Modal Form -->
          <div class="p-6 overflow-y-auto custom-scrollbar space-y-4 flex-1">
            <div>
              <label class="block text-xs font-bold text-primary mb-1">Task Title *</label>
              <input id="pm-new-title" type="text" placeholder="e.g. Chiller Condenser Tube Descaling & Water Treatment"
                class="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:outline-none focus:border-primary font-medium" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-primary mb-1">Machine / Asset *</label>
                <select id="pm-new-asset" class="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:outline-none focus:border-primary">
                  ${this.assets.map(a => `<option value="${a.code}" data-loc="${a.location}" data-name="${a.name}">${a.name} (${a.code})</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-primary mb-1">Location *</label>
                <input id="pm-new-location" type="text" value="${this.assets[0]?.location || 'Plant Room'}"
                  class="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:outline-none focus:border-primary" />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-primary mb-1">Fixed Schedule Frequency *</label>
                <select id="pm-new-frequency" class="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:outline-none focus:border-primary font-bold">
                  <option value="Weekly">Weekly (Every 7 Days)</option>
                  <option value="Bi-Weekly">Bi-Weekly (Every 14 Days)</option>
                  <option value="Monthly" selected>Monthly (Every Month)</option>
                  <option value="Quarterly">Quarterly (Every 3 Months)</option>
                  <option value="Semi-Annual">Semi-Annual (Every 6 Months)</option>
                  <option value="Annual">Annual (Every Year)</option>
                  <option value="Daily">Daily (Every Day)</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-primary mb-1">Schedule Timing Rule *</label>
                <input id="pm-new-rule" type="text" placeholder="e.g. Monthly • 15th of Month • 10:00 AM" value="Monthly • 15th of Month • 10:00 AM"
                  class="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:outline-none focus:border-primary font-data-mono" />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-xs font-bold text-primary mb-1">First Due Date *</label>
                <input id="pm-new-duedate" type="text" value="25 Sep 2026"
                  class="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:outline-none focus:border-primary font-data-mono" />
              </div>
              <div>
                <label class="block text-xs font-bold text-primary mb-1">Lead Engineer *</label>
                <select id="pm-new-tech" class="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:outline-none focus:border-primary">
                  ${this.technicians.map(t => `<option value="${t.name}">${t.name} (${t.specialty})</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-primary mb-1">Advance Notification</label>
                <select id="pm-new-notify" class="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:outline-none focus:border-primary">
                  <option value="2">2 days before</option>
                  <option value="3">3 days before</option>
                  <option value="7" selected>7 days before</option>
                  <option value="14">14 days before</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-primary mb-1">Inspection Checklist (one item per line)</label>
              <textarea id="pm-new-checklist" rows="3" placeholder="Inspect mechanical seals&#10;Check operating pressure differential&#10;Test automated safety trip switches"
                class="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:outline-none focus:border-primary"></textarea>
            </div>

            <div>
              <label class="block text-xs font-bold text-primary mb-1">Standard Operating Procedure / Safety Notes</label>
              <input id="pm-new-sop" type="text" placeholder="e.g. Lockout/tagout primary power isolator before servicing."
                class="w-full px-3 py-2 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs text-on-surface focus:outline-none focus:border-primary" />
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 border-t border-outline-variant bg-surface-container flex items-center justify-end gap-3">
            <button id="btn-cancel-schedule-pm" class="px-4 py-2 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-on-surface-variant cursor-pointer">
              Cancel
            </button>
            <button id="btn-submit-schedule-pm" class="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold cursor-pointer transition-all shadow-sm active:scale-95 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">save</span>
              Save & Activate Schedule
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ── Technicians Panel ─────────────────────────────────────────────────────
  _html_technicians() {
    return `
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        ${this.technicians.map(t => {
          const jobs = this.workOrders.filter(w => w.assignedTo === t.name && !['CLOSED','CANCELLED'].includes(w.status));
          return `
            <div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 hover:border-primary transition-all">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-bold text-sm">${t.initials}</div>
                <div>
                  <div class="font-bold text-sm text-primary">${t.name}</div>
                  <div class="text-[10px] text-on-surface-variant">${t.role}</div>
                  <div class="flex items-center gap-1 mt-0.5">
                    <div class="w-2 h-2 rounded-full ${t.onDuty ? 'bg-green-500' : 'bg-gray-300'}"></div>
                    <span class="text-[9px] font-bold ${t.onDuty ? 'text-green-600' : 'text-gray-500'}">${t.onDuty ? 'On Duty' : 'Off Duty'}</span>
                  </div>
                </div>
              </div>
              <div class="text-xs text-on-surface-variant flex items-center justify-between mb-3">
                <span>Active jobs</span><span class="font-bold text-on-surface font-data-mono">${jobs.length}</span>
              </div>
              ${jobs.length > 0 ? `
                <div class="space-y-1.5 pt-3 border-t border-outline-variant/60">
                  ${jobs.map(w => `
                    <div class="flex items-center justify-between text-[10px]">
                      <span class="font-bold text-primary font-data-mono">${w.id}</span>
                      <span class="text-on-surface-variant truncate max-w-[100px] px-1">${w.issue}</span>
                      <span class="px-1.5 py-0.5 rounded border text-[9px] font-bold ${this._sBadge(w.status)}">${this._sLabel(w.status)}</span>
                    </div>
                  `).join('')}
                </div>
              ` : '<div class="text-[10px] text-on-surface-variant text-center py-2 pt-3 border-t border-outline-variant/60">No active jobs</div>'}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // ── Event Bindings ────────────────────────────────────────────────────────
  bindEvents() {
    if (!this.container) return;

    const g = id => this.container.querySelector(id);

    // Search
    const si = g('#input-maint-search');
    if (si) si.oninput = e => {
      this.searchQuery = e.target.value;
      this.renderContent();
      const si2 = g('#input-maint-search');
      if (si2) { si2.focus(); si2.setSelectionRange(si2.value.length, si2.value.length); }
    };

    // Dropdowns
    const sa = g('#sel-maint-area'); if (sa) sa.onchange = e => { this.filterArea = e.target.value; this.renderContent(); };
    const sp = g('#sel-maint-priority'); if (sp) sp.onchange = e => { this.filterPriority = e.target.value; this.renderContent(); };
    const st = g('#sel-maint-tech'); if (st) st.onchange = e => { this.filterTechnician = e.target.value; this.renderContent(); };

    // KPI cards
    this.container.querySelectorAll('.card-kpi-maint').forEach(c => c.onclick = () => {
      this.activeQuickFilter = this.activeQuickFilter === c.dataset.filter ? 'ALL' : c.dataset.filter;
      this.renderContent();
    });

    // Workflow steps
    this.container.querySelectorAll('.workflow-step-btn').forEach(b => b.onclick = () => {
      this.activeQuickFilter = this.activeQuickFilter === b.dataset.status ? 'ALL' : b.dataset.status;
      this.workOrdersTab = 'list';
      this.renderContent();
    });

    // Helper to sync tab to sidebar
    const syncNavTab = (tabId) => {
      this.workOrdersTab = tabId;
      const tabMap = {
        dashboard: 'maint_dashboard',
        list: 'maint_requests',
        preventive: 'maint_preventive',
        assets: 'maint_machines',
        technicians: 'maint_staff'
      };
      const activeNav = tabMap[tabId];
      if (activeNav && store) {
        store.state.activeNavTab = activeNav;
        const sidebar = document.querySelector('aside');
        if (sidebar) {
          sidebar.querySelectorAll('.nav-sidebar-btn').forEach(btn => {
            const btnTab = btn.dataset.tab;
            const isActive = btnTab === activeNav;
            if (isActive) {
              btn.className = 'nav-sidebar-btn w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left group text-primary bg-primary/10 border-l-[3px] border-primary font-bold shadow-xs';
            } else {
              btn.className = 'nav-sidebar-btn w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left group text-on-surface-variant hover:bg-surface-container hover:text-primary';
            }
          });
        }
      }
      this.renderContent();
    };

    // Tabs
    this.container.querySelectorAll('.maint-tab-btn').forEach(b => b.onclick = () => {
      syncNavTab(b.dataset.tab);
    });

    // Quick Jump Buttons
    this.container.querySelectorAll('.btn-goto-tab').forEach(b => b.onclick = () => {
      syncNavTab(b.dataset.tab);
    });

    // Open WO detail
    this.container.querySelectorAll('.btn-open-wo').forEach(b => b.onclick = () => { this.activeWorkOrderDetail = b.dataset.woid; this.renderContent(); });

    // Close detail
    [g('#btn-close-detail'), g('#btn-close-detail2'), g('#wo-backdrop')].forEach(el => {
      if (el) el.onclick = () => { this.activeWorkOrderDetail = null; this.renderContent(); };
    });

    // Create modal
    if (g('#btn-create-wo')) g('#btn-create-wo').onclick = () => { this.showCreateModal = true; this.renderContent(); };
    [g('#btn-close-create'), g('#btn-cancel-create')].forEach(el => {
      if (el) el.onclick = () => { this.showCreateModal = false; this.renderContent(); };
    });

    // Submit create
    const sub = g('#btn-submit-create');
    if (sub) sub.onclick = () => {
      const issue = g('#new-issue')?.value?.trim();
      if (!issue) { Toast.show({ title: 'Validation Error', message: 'Please enter a problem title.', type: 'error' }); return; }
      const tech = g('#new-tech')?.value || '';
      const newId = `MT-${10489 + this.workOrders.length}`;
      const wo = {
        id: newId,
        location: g('#new-location')?.value || 'Guest Room',
        area: 'Guest Rooms',
        room: g('#new-room')?.value?.trim() || null,
        assetName: 'Not Specified', assetCode: 'GEN-NEW',
        issueType: g('#new-issue-type')?.value || 'General Repair',
        issue,
        description: g('#new-desc')?.value || issue,
        priority: this.container.querySelector('input[name="new-priority"]:checked')?.value || 'NORMAL',
        status: tech ? 'ASSIGNED' : 'OPEN',
        reportedBy: 'Julian Croft', source: 'Front Desk',
        assignedTo: tech || 'Unassigned',
        guestAffected: this.container.querySelector('input[name="new-guest"]:checked')?.value === 'yes',
        guestName: null, roomImpact: 'NONE', partsUsed: [], partsRequired: [],
        timeline: [
          { time: 'Just now', action: `Work order created — ${issue}`, by: 'Julian Croft' },
          ...(tech ? [{ time: 'Just now', action: `Assigned to ${tech}`, by: 'Julian Croft' }] : []),
        ],
        createdAt: `8 Sep • ${new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}`,
        startedAt: null, elapsedMin: 0, overdue: false, slaMin: 120,
      };
      this.workOrders.unshift(wo);
      this.showCreateModal = false;
      this.activeWorkOrderDetail = newId;
      Toast.show({ title: 'Work Order Created', message: `${newId} — ${issue}`, type: 'success' });
      this.renderContent();
    };

    // Direct Complete button in drawer
    const compBtn = this.container.querySelector('.btn-complete-wo');
    if (compBtn) compBtn.onclick = () => {
      const wo = this.workOrders.find(w => w.id === compBtn.dataset.woid); if (!wo) return;
      wo.status = 'REPAIR_COMPLETE';
      wo.timeline.push({ time: 'Just now', action: 'Repair marked complete by technician', by: 'Julian Croft' });
      if (wo.roomImpact !== 'NONE') {
        wo.roomImpact = 'NONE';
        if (wo.room) {
          const room = (store.state.rooms || []).find(r => r.id === wo.room || r.roomNumber === wo.room || r.room_number === wo.room);
          if (room) {
            room.maintenanceStatus = 'Operational';
            if (room.status === 'Out of Order' || room.status === 'Maintenance') {
              room.status = 'Dirty';
            }
          }
        }
      }
      this.activeWorkOrderDetail = null;
      if (store) store.notify();
      Toast.show({ title: 'Repair Complete', message: `${wo.id} marked complete and removed from Attention Required.`, type: 'success' });
      this.renderContent();
    };

    // Close WO final in drawer
    const closeFinalBtn = this.container.querySelector('.btn-close-wo-final');
    if (closeFinalBtn) closeFinalBtn.onclick = () => {
      const wo = this.workOrders.find(w => w.id === closeFinalBtn.dataset.woid); if (!wo) return;
      wo.status = 'CLOSED';
      wo.timeline.push({ time: 'Just now', action: 'Work order verified and closed', by: 'Julian Croft' });
      this.activeWorkOrderDetail = null;
      if (store) store.notify();
      Toast.show({ title: 'Work Order Closed', message: `${wo.id} has been verified and closed.`, type: 'success' });
      this.renderContent();
    };

    // Advance status
    const adv = this.container.querySelector('.btn-advance-status');
    if (adv) adv.onclick = () => {
      const wo = this.workOrders.find(w => w.id === adv.dataset.woid); if (!wo) return;
      wo.status = this._nextStatus(wo.status);
      wo.timeline.push({ time: 'Just now', action: `Status changed to ${this._sLabel(wo.status)}`, by: 'Julian Croft' });
      if ((wo.status === 'REPAIR_COMPLETE' || wo.status === 'VERIFICATION' || wo.status === 'CLOSED') && wo.roomImpact !== 'NONE') {
        wo.roomImpact = 'NONE';
        if (wo.room) {
          const room = (store.state.rooms || []).find(r => r.id === wo.room || r.roomNumber === wo.room || r.room_number === wo.room);
          if (room) {
            room.maintenanceStatus = 'Operational';
            if (room.status === 'Out of Order' || room.status === 'Maintenance') {
              room.status = 'Dirty';
            }
          }
        }
      }
      if (store) store.notify();
      Toast.show({ title: `${wo.id} Updated`, message: `Status: ${this._sLabel(wo.status)}`, type: 'success' });
      this.renderContent();
    };

    // Quick complete from urgent cards
    this.container.querySelectorAll('.btn-quick-complete').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const wo = this.workOrders.find(w => w.id === btn.dataset.woid);
        if (!wo) return;
        wo.status = 'REPAIR_COMPLETE';
        wo.timeline.push({ time: 'Just now', action: 'Repair completed on site', by: 'Julian Croft' });
        if (wo.roomImpact !== 'NONE') {
          wo.roomImpact = 'NONE';
          if (wo.room) {
            const room = (store.state.rooms || []).find(r => r.id === wo.room || r.roomNumber === wo.room || r.room_number === wo.room);
            if (room) {
              room.maintenanceStatus = 'Operational';
              if (room.status === 'Out of Order' || room.status === 'Maintenance') {
                room.status = 'Dirty';
              }
            }
            store.notify();
          }
          Toast.show({ title: 'Room Restored', message: `Room ${wo.room} repairs completed. Room released for housekeeping.`, type: 'success' });
        }
        Toast.show({ title: `${wo.id} Repaired`, message: 'Repair marked complete. Removed from Attention Required.', type: 'success' });
        this.renderContent();
      };
    });

    // Room impact buttons
    this.container.querySelectorAll('.btn-set-impact').forEach(b => b.onclick = () => {
      const wo = this.workOrders.find(w => w.id === b.dataset.woid); if (!wo) return;
      const prev = wo.roomImpact; wo.roomImpact = b.dataset.impact;
      wo.timeline.push({ time: 'Just now', action: `Room impact: ${this._impactLabel(prev)} → ${this._impactLabel(b.dataset.impact)}`, by: 'Julian Croft' });
      if (wo.room) {
        const room = (store.state.rooms || []).find(r => r.id === wo.room || r.roomNumber === wo.room);
        if (room) {
          room.status = b.dataset.impact === 'OUT_OF_ORDER' ? 'Out of Order' : b.dataset.impact === 'OUT_OF_SERVICE' ? 'Dirty' : 'Inspected';
          store.notify();
        }
      }
      Toast.show({ title: 'Room Impact Updated', message: `${this._impactLabel(b.dataset.impact)}`, type: b.dataset.impact === 'NONE' ? 'success' : 'warning' });
      this.renderContent();
    });

    // Timeline post
    const postBtn = g('#btn-post-update');
    if (postBtn) postBtn.onclick = () => {
      const inp = g('#input-timeline-note');
      if (!inp?.value?.trim()) return;
      const wo = this.workOrders.find(w => w.id === this.activeWorkOrderDetail);
      if (wo) { wo.timeline.push({ time: 'Just now', action: inp.value.trim(), by: 'Julian Croft' }); Toast.show({ title: 'Update Added', message: 'Activity logged.', type: 'info' }); this.renderContent(); }
    };

    // Hold
    const holdBtn = g('#btn-hold-wo');
    if (holdBtn) holdBtn.onclick = () => {
      const wo = this.workOrders.find(w => w.id === this.activeWorkOrderDetail);
      if (wo) { wo.status = 'ON_HOLD'; wo.timeline.push({ time: 'Just now', action: 'Work order placed on hold', by: 'Julian Croft' }); Toast.show({ title: 'On Hold', message: `${wo.id} placed on hold.`, type: 'warning' }); this.renderContent(); }
    };

    // Quick assign (from urgent cards)
    this.container.querySelectorAll('.btn-quick-assign').forEach(b => b.onclick = () => {
      const wo = this.workOrders.find(w => w.id === b.dataset.woid); if (!wo) return;
      const tech = this.technicians.find(t => t.onDuty) || this.technicians[0];
      wo.assignedTo = tech.name; wo.status = 'ASSIGNED';
      wo.timeline.push({ time: 'Just now', action: `Assigned to ${tech.name}`, by: 'Julian Croft' });
      Toast.show({ title: 'Assigned', message: `${wo.id} assigned to ${tech.name}`, type: 'success' });
      this.renderContent();
    });

    // ── Preventive Maintenance Events ─────────────────────────────────────────
    // Frequency filter pills
    this.container.querySelectorAll('.pm-freq-filter-btn').forEach(btn => {
      btn.onclick = () => {
        this.pmFrequencyFilter = btn.dataset.freq;
        this.renderContent();
      };
    });

    // Open Schedule PM Modal
    const openSchedBtn = g('#btn-open-schedule-pm');
    if (openSchedBtn) openSchedBtn.onclick = () => {
      this.showSchedulePmModal = true;
      this.renderContent();
    };

    // Close Schedule PM Modal
    [g('#btn-close-schedule-pm'), g('#btn-cancel-schedule-pm'), g('#pm-schedule-backdrop')].forEach(el => {
      if (el) el.onclick = () => {
        this.showSchedulePmModal = false;
        this.renderContent();
      };
    });

    // Auto-fill location when asset changes in modal
    const pmAssetSel = g('#pm-new-asset');
    if (pmAssetSel) {
      pmAssetSel.onchange = () => {
        const opt = pmAssetSel.options[pmAssetSel.selectedIndex];
        const locInp = g('#pm-new-location');
        if (locInp && opt?.dataset?.loc) locInp.value = opt.dataset.loc;
      };
    }

    // Submit Schedule PM
    const submitSchedBtn = g('#btn-submit-schedule-pm');
    if (submitSchedBtn) submitSchedBtn.onclick = () => {
      const title = g('#pm-new-title')?.value?.trim();
      if (!title) {
        Toast.show({ title: 'Validation Error', message: 'Please enter a task title for the PM schedule.', type: 'error' });
        return;
      }
      const assetOpt = g('#pm-new-asset')?.selectedOptions?.[0];
      const assetCode = assetOpt?.value || 'GEN-01';
      const assetName = assetOpt?.dataset?.name || title;
      const location = g('#pm-new-location')?.value?.trim() || 'Plant Room';
      const frequency = g('#pm-new-frequency')?.value || 'Monthly';
      const scheduleRule = g('#pm-new-rule')?.value?.trim() || `${frequency} Routine`;
      const dueDate = g('#pm-new-duedate')?.value?.trim() || '25 Sep 2026';
      const tech = g('#pm-new-tech')?.value || 'Tariq Mahmoud';
      const notifyAdvanceDays = parseInt(g('#pm-new-notify')?.value || '7', 10);
      const checklistText = g('#pm-new-checklist')?.value || '';
      const checklist = checklistText.split('\n').map(s => s.trim()).filter(Boolean);
      const sop = g('#pm-new-sop')?.value?.trim() || 'Standard Operating Procedure.';

      const newPm = {
        id: `pm${Date.now().toString().slice(-4)}`,
        title,
        location,
        assetCode,
        assetName,
        frequency,
        scheduleRule,
        dueDate,
        dueTime: '09:00 AM',
        daysUntil: this._calcDaysUntil(dueDate),
        lastCompleted: 'Not recorded',
        assignedTo: tech,
        notifyAdvanceDays,
        estimatedDuration: '1h 30m',
        cycleCount: 1,
        status: 'UPCOMING',
        checklist: checklist.length ? checklist : ['Perform visual inspection and verify operational clearance', 'Test safety controls and record operating metrics'],
        sop,
        linkedWoId: null,
        notificationSent: false
      };
      newPm.status = newPm.daysUntil <= 2 ? 'DUE_SOON' : (newPm.daysUntil <= notifyAdvanceDays ? 'UPCOMING' : 'SCHEDULED');

      this.preventive.unshift(newPm);
      this.showSchedulePmModal = false;
      if (store) store.notify();
      Toast.show({
        title: 'PM Schedule Created',
        message: `${title} scheduled (${frequency}: ${scheduleRule}).`,
        type: 'success'
      });
      this.renderContent();
    };

    // View PM Detail Drawer
    this.container.querySelectorAll('.btn-view-pm').forEach(b => {
      b.onclick = () => {
        this.activePmDetail = b.dataset.pmid;
        this.renderContent();
      };
    });

    // Close PM Detail Drawer
    [g('#btn-close-pm-detail'), g('#btn-close-pm-detail2'), g('#pm-detail-backdrop')].forEach(el => {
      if (el) el.onclick = () => {
        this.activePmDetail = null;
        this.renderContent();
      };
    });

    // Create WO from PM
    this.container.querySelectorAll('.btn-pm-create-wo').forEach(b => {
      b.onclick = (e) => {
        e.stopPropagation();
        this._createWoFromPm(b.dataset.pmid);
      };
    });

    // Advance PM Cycle
    this.container.querySelectorAll('.btn-pm-advance-cycle').forEach(b => {
      b.onclick = (e) => {
        e.stopPropagation();
        this._advancePmCycle(b.dataset.pmid);
      };
    });

    // Notify engineer
    this.container.querySelectorAll('.btn-pm-notify-tech').forEach(b => {
      b.onclick = (e) => {
        e.stopPropagation();
        this._notifyEngineer(b.dataset.pmid);
      };
    });

    // Quick run PM from dashboard agenda preview
    this.container.querySelectorAll('.btn-quick-run-pm').forEach(b => {
      b.onclick = (e) => {
        e.stopPropagation();
        this._createWoFromPm(b.dataset.pmid);
      };
    });

    // ── Active Service Timer Bar Events ──────────────────────────────────────
    const pauseTimerBtn = g('#btn-pause-service-timer');
    if (pauseTimerBtn) {
      pauseTimerBtn.onclick = () => {
        this._pauseServiceTimer();
      };
    }

    const completeTimerBtn = g('#btn-complete-service-timer');
    if (completeTimerBtn) {
      completeTimerBtn.onclick = () => {
        this._stopAndLogServiceTimer();
      };
    }

    // Start PM Service Timer
    this.container.querySelectorAll('.btn-start-pm-timer').forEach(b => {
      b.onclick = (e) => {
        e.stopPropagation();
        this._startServiceTimer(b.dataset.pmid);
      };
    });

    // ── Machine Dossier & Engineer History Drawer ───────────────────────────
    this.container.querySelectorAll('.btn-view-asset-dossier').forEach(b => {
      b.onclick = (e) => {
        e.stopPropagation();
        this.activeAssetDetail = b.dataset.assetcode;
        this.renderContent();
      };
    });

    [g('#btn-close-asset-drawer'), g('#btn-close-asset-drawer2'), g('#asset-drawer-backdrop')].forEach(el => {
      if (el) el.onclick = () => {
        this.activeAssetDetail = null;
        this.renderContent();
      };
    });

    // ── Log Service Modal ───────────────────────────────────────────────────
    this.container.querySelectorAll('.btn-open-log-service').forEach(b => {
      b.onclick = (e) => {
        e.stopPropagation();
        this.showLogServiceModal = b.dataset.assetcode;
        this.renderContent();
      };
    });

    [g('#btn-close-log-service'), g('#btn-cancel-log-service'), g('#log-service-backdrop')].forEach(el => {
      if (el) el.onclick = () => {
        this.showLogServiceModal = null;
        this.renderContent();
      };
    });

    const submitLogSrvBtn = g('#btn-submit-log-service');
    if (submitLogSrvBtn) {
      submitLogSrvBtn.onclick = () => {
        const assetCode = submitLogSrvBtn.dataset.assetcode;
        const engineer = g('#log-srv-engineer')?.value || 'Tariq Mahmoud';
        const duration = g('#log-srv-duration')?.value || '1h 00m';
        const serviceType = g('#log-srv-type')?.value?.trim() || 'Scheduled PM Service';
        const partsStr = g('#log-srv-parts')?.value?.trim() || '';
        const notes = g('#log-srv-notes')?.value?.trim() || 'Service completed nominal. Operating tolerances verified.';

        // Parse duration into minutes
        let durationMinutes = 60;
        if (duration.includes('m')) {
          const matchH = duration.match(/(\d+)h/);
          const matchM = duration.match(/(\d+)m/);
          const h = matchH ? parseInt(matchH[1], 10) : 0;
          const m = matchM ? parseInt(matchM[1], 10) : 0;
          durationMinutes = (h * 60) + m;
        }

        const engineerRole = this.technicians.find(t => t.name === engineer)?.role || 'Service Engineer';
        const parts = partsStr ? partsStr.split(',').map(p => p.trim()).filter(Boolean) : [];

        const now = new Date();
        const dateStr = `8 Sep 2026 • ${now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}`;

        const entry = {
          id: `srv-${Date.now()}`,
          date: dateStr,
          engineer,
          engineerRole,
          serviceType,
          duration,
          durationMinutes,
          notes,
          parts,
          status: 'VERIFIED'
        };

        this._addServiceHistory(assetCode, entry);
        this.showLogServiceModal = null;
        this.renderContent();
      };
    }
  }

  async loadData() {
    this.renderContent();
    this.bindEvents();
  }

  setQuickFilter(filter) {
    this.activeQuickFilter = filter;
    this.renderContent();
    this.bindEvents();
  }
}

// ─── Backwards-compat shims (for any legacy imports) ──────────────────────
let _activeMaintViewInstance = null;

export function renderMaintenanceView(state) {
  _activeMaintViewInstance = new MaintenanceDashboardView();
  return `<div id="maintenance-legacy-mount" class="w-full"></div>`;
}

export function bindMaintenanceEvents() {
  const mount = document.getElementById('maintenance-legacy-mount');
  if (mount && _activeMaintViewInstance) {
    mount.innerHTML = '';
    mount.appendChild(_activeMaintViewInstance.render());
    _activeMaintViewInstance.loadData();
  }
}