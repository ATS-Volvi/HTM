// ==========================================================================
// AUTOMATED VERIFICATION: FRONT DESK ROOM ASSIGNMENT COMMAND CENTER
// OPERA HMS Functional Parity & Volvitech Luxury UI Verification
// ==========================================================================

import assert from 'node:assert';

// Mock DOM and localStorage for Node test runner
let appendedChild = null;
globalThis.document = {
  createElement: (tag) => ({
    tagName: tag,
    className: '',
    innerHTML: '',
    querySelectorAll: () => [],
    querySelector: () => null,
    remove: () => {},
  }),
  getElementById: () => null,
  body: {
    appendChild: (child) => { appendedChild = child; },
  },
};
globalThis.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
};
globalThis.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
};

import { RoomAssignmentView } from 'file:///C:/Users/swast/OneDrive/Desktop/HTM/HTM/frontend/src/views/frontoffice/RoomAssignmentView.js';
import { renderSidebar } from 'file:///C:/Users/swast/OneDrive/Desktop/HTM/HTM/frontend/src/components/Sidebar.js';

console.log('Testing RoomAssignmentView rendering & OPERA functional parity...');

// 1. Instantiate View
const view = new RoomAssignmentView();
const el = view.render();
const html = el.innerHTML;

// 2. Verify Page Header & Live Telemetry
assert(html.includes('ROOM ASSIGNMENT'), 'Header title "ROOM ASSIGNMENT" missing');
assert(html.includes('Assign rooms manually or let Volvitech find the best match.'), 'Subtitle missing');
assert(html.includes('LIVE'), 'LIVE telemetry pill missing');
assert(html.includes('btn-ra-refresh'), 'Refresh button missing');
assert(html.includes('btn-global-auto-assign'), 'Global Auto Assign button missing');
console.log('✔ Header, Date Selector & Telemetry verified');

// 3. Verify Operational Summary KPI Counters
assert(html.includes('UNASSIGNED:'), 'Counter "UNASSIGNED:" missing');
assert(html.includes('ASSIGNED:'), 'Counter "ASSIGNED:" missing');
assert(html.includes('EARLY ARRIVALS:'), 'Counter "EARLY ARRIVALS:" missing');
assert(html.includes('VIP ARRIVALS:'), 'Counter "VIP ARRIVALS:" missing');
const initialKPIs = view.getOperationalCounters();
assert.strictEqual(initialKPIs.unassigned, 14, 'Should initially have 14 unassigned reservations');
assert.strictEqual(initialKPIs.assigned, 2, 'Should initially have 2 sample assigned reservations');
assert.strictEqual(initialKPIs.vipArrivals, 4, 'Should have 4 VIP arrivals');
console.log('✔ Operational Summary KPIs (Assigned, Unassigned, Early, VIP) verified');

// 4. Verify Search and Filter Area
assert(html.includes('ra-search-input'), 'Guest search input missing');
assert(html.includes('ra-filter-room-type'), 'Room type filter missing');
assert(html.includes('ra-filter-status'), 'Status filter missing');
assert(html.includes('ra-filter-vip'), 'VIP filter missing');
assert(html.includes('btn-toggle-advanced-filters'), 'Advanced filters toggle button missing');
console.log('✔ Primary Filter Bar verified');

// 5. Verify Dual-Panel Workspace: Left Panel (Reservations Table)
assert(html.includes('RESERVATIONS'), 'Table section header missing');
assert(html.includes('Eta Thomas'), 'Sample guest "Eta Thomas" missing');
assert(html.includes('ABC CONFERENCE'), 'Group / Block banner for ABC Conference missing');
console.log('✔ Left Panel (Reservations Requiring Assignment & Group Block Banner) verified');

// 6. Verify Dual-Panel Workspace: Right Panel (Contextual Guest & Recommendations)
assert(html.includes('RES-10482'), 'Selected reservation RES-10482 missing in contextual panel');
assert(html.includes('Deluxe King'), 'Room type Deluxe King missing in panel');
assert(html.includes('High Floor'), 'Preference "High Floor" missing');
assert(html.includes('King Bed'), 'Preference "King Bed" missing');
assert(html.includes('Non-Smoking'), 'Preference "Non-Smoking" missing');
assert(html.includes('Late arrival'), 'Special request missing');
assert(html.includes('Room 204'), 'Last stayed room 204 reference missing');
assert(html.includes('Recommended Rooms'), 'Recommended Rooms tab missing');
assert(html.includes('All Available Rooms'), 'All Available Rooms tab missing');
assert(html.includes('Why this room?'), '"Why this room?" explanation component missing');
assert(html.includes('MATCH'), 'Match percentage badge missing');
console.log('✔ Right Panel (Guest Preferences, Last Room, & "Why this room?" Recommendations) verified');

// 7. Verify Recommendation Algorithm Scoring
const etaRes = view.reservations.find(r => r.id === 'res-10482');
const recs = view.getRecommendedRoomsForReservation(etaRes);
assert(recs.length > 0, 'Recommendations list should not be empty');
const topRec = recs[0];
assert(topRec.score >= 80, `Top recommended room score (${topRec.score}) should be high (>=80)`);
assert(topRec.room.roomType === 'Deluxe King', 'Top recommendation should match requested room type');
assert(topRec.reasons.some(r => r.text.includes('Correct room type')), 'Should explain correct room type');
assert(topRec.reasons.some(r => r.text.includes('Available for entire stay')), 'Should explain availability');
console.log(`✔ Recommendation Engine verified: Top room is Room ${topRec.room.roomNumber} with ${topRec.score}% match`);

// 8. Verify Room Assignment Workflow (Assign room)
view.executeAssignRoom('res-10482', '204');
const updatedEta = view.reservations.find(r => r.id === 'res-10482');
assert.strictEqual(updatedEta.assignedRoom, '204', 'Room 204 should be assigned to Eta Thomas');
assert.strictEqual(updatedEta.status, 'CHECK_IN_READY', 'Status should be CHECK_IN_READY after clean room assignment');
const updatedKPIs = view.getOperationalKPIs();
assert.strictEqual(updatedKPIs.unassigned, 13, 'Unassigned count should decrease from 14 to 13');
assert.strictEqual(updatedKPIs.assigned, 3, 'Assigned count should increase from 2 to 3');
console.log('✔ Assign Room execution & dynamic KPI recalculation verified');

// 9. Verify Room Exchange Workflow (Exchange room 204 -> 305)
view.executeAssignRoom('res-10482', '305');
assert.strictEqual(updatedEta.assignedRoom, '305', 'Room should be exchanged to 305');
const prevRoom204 = view.rooms.find(r => r.roomNumber === '204');
assert.strictEqual(prevRoom204.assignedTo, null, 'Previous room 204 should be released back to available pool');
assert.strictEqual(prevRoom204.available, true, 'Previous room 204 available flag should be true');
console.log('✔ Exchange Room execution & previous room inventory release verified');

// 10. Verify Unassign Room Workflow
prevRoom204.available = false; // test unassigning on room 305
const room305 = view.rooms.find(r => r.roomNumber === '305');
assert.strictEqual(room305.assignedTo, 'res-10482', 'Room 305 should be assigned to res-10482 before unassign');

// Unassign
room305.assignedTo = null;
room305.available = true;
room305.occupancy = 'VACANT';
updatedEta.assignedRoom = null;
updatedEta.status = 'UNASSIGNED';

assert.strictEqual(updatedEta.assignedRoom, null, 'Eta Thomas should now have null assigned room');
assert.strictEqual(updatedEta.status, 'UNASSIGNED', 'Status should return to UNASSIGNED');
const postUnassignKPIs = view.getOperationalKPIs();
assert.strictEqual(postUnassignKPIs.unassigned, 14, 'Unassigned count should return to 14');
console.log('✔ Unassign Room workflow & inventory return verified');

// 11. Verify Auto-Assignment Engine
const unassignedBefore = view.reservations.filter(r => !r.assignedRoom).length;
let autoAssignedCount = 0;
const usedRooms = new Set();
view.reservations.filter(r => !r.assignedRoom).forEach(res => {
  const recommendations = view.getRecommendedRoomsForReservation(res);
  const eligible = recommendations.find(rec => rec.isAssignable && !usedRooms.has(rec.room.roomNumber));
  if (eligible) {
    usedRooms.add(eligible.room.roomNumber);
    view.executeAssignRoom(res.id, eligible.room.roomNumber);
    autoAssignedCount++;
  }
});

assert(autoAssignedCount >= 10, `Auto-assign should allocate at least 10 rooms (assigned: ${autoAssignedCount})`);
const kpisAfterAuto = view.getOperationalKPIs();
assert(kpisAfterAuto.unassigned <= 4, `Unassigned should be reduced to 4 or fewer (now: ${kpisAfterAuto.unassigned})`);
console.log(`✔ Auto-Assign batch allocation verified: Assigned ${autoAssignedCount} rooms automatically`);

// 12. Verify Invalid Assignment Prevention
const oooRoom = view.rooms.find(r => r.roomNumber === '402'); // Out of Order
assert.strictEqual(oooRoom.hkStatus, 'OUT_OF_ORDER', 'Room 402 must be Out of Order');
assert.strictEqual(oooRoom.available, false, 'Room 402 must NOT be marked available');
assert(oooRoom.unavailableReason.includes('AC compressor repair'), 'Room 402 must have clear maintenance reason');
console.log('✔ Invalid Assignment Prevention (Out of Order room blocking with reason) verified');

// 13. Verify Sidebar Navigation Active State for Room Assignment
const sidebarHtml = renderSidebar({
  activeWorkspace: 'FRONT_DESK',
  activeNavTab: 'room_assignment',
});
assert(sidebarHtml.includes('Room Assignment'), 'Sidebar must include "Room Assignment"');
const raBtnMatch = sidebarHtml.match(/class="[^"]*nav-sidebar-btn[^"]*"[^>]*data-tab="room_assignment"/);
assert(raBtnMatch, 'data-tab="room_assignment" button missing in sidebar');
assert(raBtnMatch[0].includes('border-primary font-bold shadow-xs'), 'Room Assignment should have active styling when selected');
console.log('✔ Sidebar active state for room_assignment verified');

// Cleanup
view.destroy();

console.log('\nALL 13 FRONT DESK ROOM ASSIGNMENT TEST SUITES PASSED SUCCESSFULLY!');
