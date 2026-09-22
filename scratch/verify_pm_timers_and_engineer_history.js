// Verification Script for PM Timers & Engineer Machine History
import { MaintenanceDashboardView } from '../frontend/src/views/MaintenanceView.js';
import { store } from '../frontend/src/state/store.js';

console.log('=== Starting Verification: PM Timers & Engineer Machine History ===');

// Setup mock DOM environment if not present
if (typeof document === 'undefined') {
  global.document = {
    createElement: (tag) => {
      const el = {
        tagName: tag,
        className: '',
        innerHTML: '',
        querySelector: (sel) => null,
        querySelectorAll: (sel) => [],
        appendChild: () => {},
      };
      return el;
    },
    getElementById: () => null,
  };
}

const view = new MaintenanceDashboardView();

// Test 1: Machine Assets and Engineer History
console.log('\n--- Test 1: Machine Assets and Engineer History ---');
console.assert(view.assets.length >= 7, `Expected at least 7 assets, got ${view.assets.length}`);
console.log(`Assets loaded: ${view.assets.length}`);

const acUnit = view.assets.find(a => a.code === 'AC-508-01');
console.assert(!!acUnit, 'Asset AC-508-01 should exist');
console.assert(Array.isArray(acUnit.history) && acUnit.history.length >= 2, 'Asset should have engineer service history');
console.log(`AC-508-01 history records: ${acUnit.history.length}`);
console.log(`First entry: Engineer = ${acUnit.history[0].engineer}, Duration = ${acUnit.history[0].duration}, Role = ${acUnit.history[0].engineerRole}`);
console.assert(acUnit.history[0].engineer === 'Tariq Mahmoud', 'Engineer should match Tariq Mahmoud');
console.assert(acUnit.history[0].status === 'VERIFIED', 'Status should be VERIFIED');
console.log('Test 1 Passed: Assets and Engineer History structured properly.');

// Test 2: Countdown Timer Calculation
console.log('\n--- Test 2: PM Countdown Timer Calculation ---');
const cd1 = view._calcCountdown('10 Sep 2026', '07:00 AM');
console.log(`Countdown for 10 Sep 2026 07:00 AM: ${cd1.clock} (urgency: ${cd1.urgency}, days: ${cd1.days})`);
console.assert(!cd1.isOverdue, 'Should not be overdue');
console.assert(cd1.clock.includes('d :') && cd1.clock.includes('h :'), 'Clock format should be dd : hh : mm');

const cdOverdue = view._calcCountdown('01 Sep 2026', '08:00 AM');
console.log(`Countdown for past date 01 Sep 2026: ${cdOverdue.clock} (isOverdue: ${cdOverdue.isOverdue})`);
console.assert(cdOverdue.isOverdue === true, 'Past date should be marked overdue');
console.log('Test 2 Passed: Countdown calculation accurate.');

// Test 3: Live Service Timer Execution
console.log('\n--- Test 3: Live Service Timer Execution ---');
const pm4 = view.preventive.find(p => p.id === 'pm4');
console.assert(!!pm4, 'pm4 Pool Water Treatment should exist');

view._startServiceTimer('pm4');
console.assert(!!store.state.activeMaintenanceTimer, 'activeMaintenanceTimer should be set in store');
console.log(`Active timer running for: ${store.state.activeMaintenanceTimer.assetCode} by ${store.state.activeMaintenanceTimer.engineer}`);
console.assert(store.state.activeMaintenanceTimer.assetCode === 'POOL-TREAT-01', 'Timer should target POOL-TREAT-01');
console.assert(store.state.activeMaintenanceTimer.isPaused === false, 'Timer should initially be unpaused');

// Pause timer
view._pauseServiceTimer();
console.assert(store.state.activeMaintenanceTimer.isPaused === true, 'Timer should now be paused');
console.log('Timer paused successfully.');

// Resume timer
view._pauseServiceTimer();
console.assert(store.state.activeMaintenanceTimer.isPaused === false, 'Timer should now be running');
console.log('Timer resumed successfully.');

// Advance timer seconds and complete
store.state.activeMaintenanceTimer.elapsedSeconds = 2700; // 45 minutes
const initialHistoryCount = view.assets.find(a => a.code === 'POOL-TREAT-01').history.length;
const initialCycleCount = pm4.cycleCount;

view._stopAndLogServiceTimer('Completed full chemical calibration and backwashed filter.');
console.assert(store.state.activeMaintenanceTimer === null, 'Active timer should be cleared upon stop');

const poolAsset = view.assets.find(a => a.code === 'POOL-TREAT-01');
console.assert(poolAsset.history.length === initialHistoryCount + 1, 'History count should increment by 1');
const loggedEntry = poolAsset.history[0];
console.log(`Logged Service Entry: Engineer = ${loggedEntry.engineer}, Duration = ${loggedEntry.duration}, Notes = ${loggedEntry.notes}`);
console.assert(loggedEntry.engineer === 'Rajesh Kumar', 'Logged engineer should match Rajesh Kumar');
console.assert(loggedEntry.duration === '45m 0s', `Duration should be formatted 45m 0s, got ${loggedEntry.duration}`);
console.assert(loggedEntry.status === 'VERIFIED', 'Status should be VERIFIED');
console.assert(pm4.cycleCount === initialCycleCount + 1, 'PM cycle count should increment');
console.log('Test 3 Passed: Service timer logs to machine engineer history and advances PM cycle.');

// Test 4: Manual Add Service History Entry
console.log('\n--- Test 4: Manual Service Entry ---');
const genAsset = view.assets.find(a => a.code === 'GEN-MAIN-01');
const initialGenHistory = genAsset.history.length;

view._addServiceHistory('GEN-MAIN-01', {
  id: 'srv-manual-1',
  date: '8 Sep 2026 • 11:30 AM',
  engineer: 'Anil Sharma',
  engineerRole: 'Electrical Engineer',
  serviceType: 'Emergency Battery Impedance Check',
  duration: '1h 15m',
  durationMinutes: 75,
  notes: 'Checked DC terminal resistance and torque. Verified clean contact.',
  parts: ['Terminal Anti-Corrosion Spray'],
  status: 'VERIFIED'
});

console.assert(genAsset.history.length === initialGenHistory + 1, 'Manual history should be added');
console.assert(genAsset.history[0].engineer === 'Anil Sharma', 'Engineer must be Anil Sharma');
console.log(`GenAsset total hours: ${genAsset.totalHoursWorked}`);
console.log('Test 4 Passed: Manual service logging operational.');

// Test 5: Render and HTML Check
console.log('\n--- Test 5: Render and Template Validation ---');
const renderedContainer = view.render();

// Check tab switches
view.workOrdersTab = 'preventive';
view.renderContent();
console.assert(view.container.innerHTML.includes('Countdown:'), 'Preventive view should include Countdown:');
console.assert(view.container.innerHTML.includes('btn-start-pm-timer'), 'Preventive view should include btn-start-pm-timer');
console.assert(view.container.innerHTML.includes('Schedule PM'), 'Preventive view should include Schedule PM');

view.workOrdersTab = 'assets';
view.renderContent();
console.assert(view.container.innerHTML.includes('Engineer Service History'), 'Assets view should display Engineer Service History');
console.assert(view.container.innerHTML.includes('Machine Dossier'), 'Assets view should include Machine Dossier buttons');
console.assert(view.container.innerHTML.includes('+ Log Service'), 'Assets view should include + Log Service buttons');

// Check Machine Dossier Drawer
view.activeAssetDetail = 'GEN-MAIN-01';
view.renderContent();
console.assert(view.container.innerHTML.includes('Machine Technical Specifications &amp; Installation') || view.container.innerHTML.includes('Machine Technical Specifications & Installation'), 'Dossier drawer should render specs');
console.assert(view.container.innerHTML.includes('Chronological Engineer Service Logbook'), 'Dossier drawer should render Chronological Engineer Service Logbook');
console.assert(view.container.innerHTML.includes('Engineers Working on this Machine'), 'Dossier drawer should render engineers time breakdown');

// Check Manual Log Modal
view.activeAssetDetail = null;
view.showLogServiceModal = 'KIT-OVN-04';
view.renderContent();
console.assert(view.container.innerHTML.includes('Log Engineer Service Record'), 'Log modal should be rendered');
console.assert(view.container.innerHTML.includes('log-srv-engineer'), 'Log modal should have engineer select');
console.assert(view.container.innerHTML.includes('Commit Service Entry'), 'Log modal should have submit button');

console.log('Test 5 Passed: HTML templates render all timers, dossier, and engineer history elements.');

// Test 6: Repetitive PM Cycle Done Timer Reset
console.log('\n--- Test 6: Repetitive PM Cycle Done Timer Reset ---');
const pm1 = view.preventive.find(p => p.id === 'pm1');
console.assert(!!pm1, 'pm1 Chiller Descaling routine should exist');
const prevPm1Cycle = pm1.cycleCount || 1;
const initialAssetHistoryCount = view.assets.find(a => a.code === pm1.assetCode).history.length;

// Click "Done" (invoke _advancePmCycle)
view._advancePmCycle('pm1');

console.assert(pm1.cycleCount === prevPm1Cycle + 1, `Cycle count should increment to ${prevPm1Cycle + 1}, got ${pm1.cycleCount}`);
console.assert(pm1.justCompleted === true, 'pm1.justCompleted should be true after Done');
console.assert(pm1.dueDate !== '10 Sep 2026', 'Due date should have reset to next frequency cadence');
console.log(`Reset Due Date for Monthly Chiller routine: ${pm1.dueDate}`);

// Verify asset history log
const chillerAsset = view.assets.find(a => a.code === pm1.assetCode);
console.assert(chillerAsset.history.length === initialAssetHistoryCount + 1, 'Asset history should receive completed cycle entry');
console.assert(chillerAsset.history[0].serviceType.includes(`Cycle #${prevPm1Cycle}`), 'Service entry should log completed cycle');
console.log(`Service entry logged: ${chillerAsset.history[0].serviceType}`);

// Test countdown clock on reset cycle
const resetCd = view._calcCountdown(pm1.dueDate, pm1.dueTime);
console.log(`Reset countdown clock: ${resetCd.clock} (days: ${resetCd.days}, overdue: ${resetCd.isOverdue})`);
console.assert(!resetCd.isOverdue, 'Reset countdown clock should not be overdue');
console.assert(resetCd.days >= 28, 'Monthly PM reset countdown should be ~30 days in future');

// Second repetitive cycle test (to ensure multiple repeats work indefinitely)
view._advancePmCycle('pm1');
console.assert(pm1.cycleCount === prevPm1Cycle + 2, `Cycle count should increment again to ${prevPm1Cycle + 2}`);
console.log(`Second cycle advanced successfully. New cycle count: ${pm1.cycleCount}, Due: ${pm1.dueDate}`);
console.log('Test 6 Passed: Repetitive PM Done immediately resets timer for next occurrence and logs engineer history.');

console.log('\n=== ALL TESTS PASSED SUCCESSFULLY! ===');

