-- ==========================================================================
-- VOLVITECH HOSPITALITY OS — SEED DATA (POSTGRESQL 18)
-- Matching Google Stitch Project: Front Office Reservation System
-- ==========================================================================

-- Clean existing data in reverse order of dependencies
TRUNCATE TABLE folio_payments, folio_charges, folios, room_allocations, reservations, rate_plan_room_types, rate_plans, rooms, room_types, guests, booking_sources CASCADE;

-- 1. Booking Sources
INSERT INTO booking_sources (id, code, name, commission_pct) VALUES
('b1000000-0000-0000-0000-000000000001', 'DIRECT_PHONE', 'Direct - Phone', 0.00),
('b1000000-0000-0000-0000-000000000002', 'DIRECT_WEB', 'Direct - Website', 0.00),
('b1000000-0000-0000-0000-000000000003', 'OTA_BOOKING', 'OTA - Booking.com', 15.00),
('b1000000-0000-0000-0000-000000000004', 'OTA_EXPEDIA', 'OTA - Expedia', 18.00),
('b1000000-0000-0000-0000-000000000005', 'GDS', 'GDS (Amadeus, Sabre)', 10.00),
('b1000000-0000-0000-0000-000000000006', 'CORPORATE', 'Corporate Contract', 0.00),
('b1000000-0000-0000-0000-000000000007', 'WALK_IN', 'Front Desk Walk-In', 0.00);

-- 2. Room Types (Prefix c1)
INSERT INTO room_types (id, code, name, description, base_occupancy, max_occupancy, base_price, total_inventory, color_code) VALUES
('c1000000-0000-0000-0000-000000000001', 'KING_DLX', 'King Deluxe', 'Spacious King Bed with panoramic city skyline view and marble bath.', 2, 3, 280.00, 14, '#b7c8de'),
('c1000000-0000-0000-0000-000000000002', 'DBL_QUEEN', 'Double Queen', 'Two Queen Beds ideal for family or twin corporate travelers.', 2, 4, 320.00, 12, '#bcc7dd'),
('c1000000-0000-0000-0000-000000000003', 'EXEC_STE', 'Executive Suite', 'Corner Suite with living salon, executive lounge privileges, and deep soaking tub.', 2, 4, 540.00, 6, '#fed65b'),
('c1000000-0000-0000-0000-000000000004', 'PENTHOUSE', 'Penthouse', 'Top floor ultra-luxury presidential penthouse with wrap-around terrace.', 2, 6, 1800.00, 2, '#041627');

-- 3. Physical Rooms (Prefix d1)
INSERT INTO rooms (id, room_number, floor, room_type_id, operational_status) VALUES
-- Floor 5 & 4 (Suites & Penthouse)
('d1000000-0000-0000-0000-000000000501', '501', '5', 'c1000000-0000-0000-0000-000000000004', 'OCCUPIED'),
('d1000000-0000-0000-0000-000000000502', '502', '5', 'c1000000-0000-0000-0000-000000000004', 'VACANT_CLEAN'),
('d1000000-0000-0000-0000-000000000401', '401', '4', 'c1000000-0000-0000-0000-000000000003', 'OCCUPIED'),
('d1000000-0000-0000-0000-000000000402', '402', '4', 'c1000000-0000-0000-0000-000000000003', 'OCCUPIED'),
('d1000000-0000-0000-0000-000000000403', '403', '4', 'c1000000-0000-0000-0000-000000000003', 'VACANT_DIRTY'),
('d1000000-0000-0000-0000-000000000404', '404', '4', 'c1000000-0000-0000-0000-000000000003', 'VACANT_CLEAN'),
('d1000000-0000-0000-0000-000000000405', '405', '4', 'c1000000-0000-0000-0000-000000000003', 'INSPECTION_REQUIRED'),
('d1000000-0000-0000-0000-000000000406', '406', '4', 'c1000000-0000-0000-0000-000000000003', 'VACANT_CLEAN'),

-- Floor 3 (Double Queens & Kings)
('d1000000-0000-0000-0000-000000000301', '301', '3', 'c1000000-0000-0000-0000-000000000002', 'VACANT_CLEAN'),
('d1000000-0000-0000-0000-000000000302', '302', '3', 'c1000000-0000-0000-0000-000000000002', 'OCCUPIED'),
('d1000000-0000-0000-0000-000000000303', '303', '3', 'c1000000-0000-0000-0000-000000000002', 'VACANT_DIRTY'),
('d1000000-0000-0000-0000-000000000304', '304', '3', 'c1000000-0000-0000-0000-000000000001', 'OCCUPIED'),
('d1000000-0000-0000-0000-000000000305', '305', '3', 'c1000000-0000-0000-0000-000000000001', 'VACANT_CLEAN'),
('d1000000-0000-0000-0000-000000000306', '306', '3', 'c1000000-0000-0000-0000-000000000001', 'VACANT_CLEAN'),

-- Floor 2 (Kings)
('d1000000-0000-0000-0000-000000000201', '201', '2', 'c1000000-0000-0000-0000-000000000001', 'VACANT_CLEAN'),
('d1000000-0000-0000-0000-000000000202', '202', '2', 'c1000000-0000-0000-0000-000000000001', 'VACANT_CLEAN'),
('d1000000-0000-0000-0000-000000000203', '203', '2', 'c1000000-0000-0000-0000-000000000001', 'OCCUPIED'),
('d1000000-0000-0000-0000-000000000204', '204', '2', 'c1000000-0000-0000-0000-000000000001', 'VACANT_DIRTY'),
('d1000000-0000-0000-0000-000000000205', '205', '2', 'c1000000-0000-0000-0000-000000000001', 'VACANT_CLEAN'),
('d1000000-0000-0000-0000-000000000206', '206', '2', 'c1000000-0000-0000-0000-000000000001', 'VACANT_CLEAN');

-- 4. Rate Plans (Prefix e1)
INSERT INTO rate_plans (id, code, name, description, currency, cancellation_policy) VALUES
('e1000000-0000-0000-0000-000000000001', 'BAR_FLEX', 'Best Available Flexible Rate', 'Standard refundable rate with free cancellation up to 24 hours prior to check-in.', 'USD', 'Free cancellation up to 24h prior to 15:00 on arrival day.'),
('e1000000-0000-0000-0000-000000000002', 'CORP_L1', 'Corporate Preferred Partner', 'Contracted corporate rate including breakfast and late checkout.', 'USD', 'Corporate cancellation policy up to 18:00 arrival day.'),
('e1000000-0000-0000-0000-000000000003', 'PROMO_NONREF', 'Advance Purchase Non-Refundable', '15% discount for bookings made 14+ days in advance. Fully prepaid.', 'USD', 'Non-refundable upon booking.');

-- 5. Rate Plan Room Types (Matrix Pricing)
INSERT INTO rate_plan_room_types (rate_plan_id, room_type_id, nightly_rate) VALUES
('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 280.00),
('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002', 320.00),
('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000003', 540.00),
('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000004', 1800.00),
-- Corporate L1 Rates
('e1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 240.00),
('e1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 280.00),
('e1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000003', 480.00);

-- 6. Guests (CRM Profiles, Prefix a1)
INSERT INTO guests (id, first_name, last_name, email, phone, dial_code, nationality, id_document_type, id_document_number, vip_status, special_preferences, total_stays, lifetime_spend, notes) VALUES
('a1000000-0000-0000-0000-000000000001', 'Eleanor', 'Vance', 'eleanor.vance@kensington.co.uk', '79460912', '+44', 'British', 'PASSPORT', 'GB-4412098B', 'PLATINUM', '{"pillow": "Goose Down", "dietary": "Vegetarian Organic", "high_floor": true}'::jsonb, 14, 48200.00, 'Global Trust Partner. Prefers Floor 4 corner suites.'),
('a1000000-0000-0000-0000-000000000002', 'Marcus', 'Sterling', 'm.sterling@barclays.com', '5553829901', '+1', 'American', 'PASSPORT', 'US-9823411A', 'GOLD', '{"newspaper": "Financial Times", "dietary": "Gluten-Free"}'::jsonb, 8, 26400.00, 'Barclays corporate traveler. Early arrivals.'),
('a1000000-0000-0000-0000-000000000003', 'Sarah', 'Jenkins', 'sarah.j@techcorp.io', '5558921044', '+1', 'American', 'DRIVERS_LICENSE', 'DL-CA-9021481', 'STANDARD', '{"quiet_room": true}'::jsonb, 2, 3400.00, 'Tech conference delegate.'),
('a1000000-0000-0000-0000-000000000004', 'Jonathan', 'Crane', 'j.crane@horizon.org', '78912345', '+44', 'British', 'PASSPORT', 'GB-8899124K', 'STANDARD', '{}'::jsonb, 1, 1400.00, 'Direct phone booking.'),
('a1000000-0000-0000-0000-000000000005', 'Julian', 'Vane', 'julian.vane@vanguard.com', '5552349001', '+1', 'American', 'PASSPORT', 'US-77889911', 'PLATINUM', '{"room_temp": "20C", "late_checkout": true}'::jsonb, 18, 62100.00, 'Managing Director at Vanguard. Current occupant of Suite 402.');

-- 7. Seed Reservations (Prefix f1, matching Stitch confirmation numbers #HX-8921, #HX-8922, etc.)
INSERT INTO reservations (id, reservation_number, guest_id, booking_source_id, room_type_id, rate_plan_id, check_in_date, check_out_date, adults, children, status, estimated_arrival_time, special_requests, nightly_rate, total_amount) VALUES
-- Eleanor Vance (Executive Suite, Confirmed)
('f1000000-0000-0000-0000-000000000001', 'HX-8921', 'a1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000001', CURRENT_DATE, CURRENT_DATE + INTERVAL '3 days', 2, 0, 'CONFIRMED', '15:00:00', 'High floor requested with goose down pillows.', 540.00, 1620.00),

-- Marcus Sterling (King Deluxe, VIP Arrival)
('f1000000-0000-0000-0000-000000000002', 'HX-8922', 'a1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000002', CURRENT_DATE, CURRENT_DATE + INTERVAL '2 days', 1, 0, 'CONFIRMED', '14:30:00', 'Corporate billing to Barclays. Financial Times in morning.', 240.00, 480.00),

-- Sarah Jenkins (Double Queen, Confirmed)
('f1000000-0000-0000-0000-000000000003', 'HX-8923', 'a1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE + INTERVAL '5 days', 2, 1, 'CONFIRMED', '16:00:00', 'Crib requested for child.', 320.00, 1280.00),

-- Jonathan Crane (King Deluxe, Confirmed)
('f1000000-0000-0000-0000-000000000004', 'HX-8924', 'a1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '4 days', 1, 0, 'CONFIRMED', '17:00:00', 'Late arrival expected.', 280.00, 560.00),

-- Julian Vane (Executive Suite 402, Checked-In)
('f1000000-0000-0000-0000-000000000005', 'HX-8925', 'a1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '3 days', 2, 0, 'CHECKED_IN', '12:00:00', 'Vanguard Executive Suite account.', 480.00, 1920.00);

-- 8. Room Allocations (Room 402 allocated to Julian Vane)
INSERT INTO room_allocations (id, reservation_id, room_id, status, allocated_at) VALUES
('a2000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000402', 'ACTIVE', CURRENT_DATE - INTERVAL '1 day');

-- 9. Folios (Julian Vane Room 402 Folio matching Stitch screen e0281f5f20ea4f129f420c21f3b72d51)
INSERT INTO folios (id, reservation_id, guest_id, folio_number, status, balance, currency) VALUES
('a3000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000005', 'FOL-402-8925', 'OPEN', 684.20, 'USD');

INSERT INTO folio_charges (folio_id, category, description, amount, tax_amount) VALUES
('a3000000-0000-0000-0000-000000000001', 'ROOM', 'Room Tariff - Executive Suite (Night 1)', 480.00, 48.00),
('a3000000-0000-0000-0000-000000000001', 'FB', 'In-Room Dining — Wagyu Burger & Wine', 84.00, 8.40),
('a3000000-0000-0000-0000-000000000001', 'LAUNDRY', 'Executive Dry Cleaning (3 items)', 58.00, 5.80);

-- 10. Properties
INSERT INTO properties (id, code, name, location, currency, currency_symbol, stars, rooms_count) VALUES
('10000000-0000-0000-0000-000000000001', 'GAP-DXB', 'The Grand Astoria Palm & Resort', 'Palm Jumeirah, Dubai', 'USD', '$', 5, 32),
('10000000-0000-0000-0000-000000000002', 'VAG-STM', 'Volvitech Alpine Grand Palace', 'St. Moritz, Switzerland', 'CHF', 'CHF ', 5, 48),
('10000000-0000-0000-0000-000000000003', 'VMC-LON', 'Volvitech Metropolis Central', 'Mayfair, London', 'GBP', '£', 5, 65)
ON CONFLICT (code) DO NOTHING;

-- 11. Workspaces
INSERT INTO workspaces (id, category, name, description, icon, functions, badge_metric, is_implemented, display_order) VALUES
('FRONT_DESK', 'CORE_OPERATIONS', 'Front Desk', 'Reservations, arrivals check-in, multi-floor room tape, and live folio billing', 'concierge', '["Reservations Directory", "Arrivals Check-In", "Room Inventory Tape", "Guest Folios & Invoicing"]'::jsonb, 'arrivals_attention', TRUE, 1),
('HOUSEKEEPING', 'CORE_OPERATIONS', 'Housekeeping', 'Multi-floor room matrix, cleaning dispatch queue, and supervisor room sign-off', 'cleaning_services', '["Room Matrix Grid", "Priority Task Queue", "Inspections Audit", "Turnaround KPIs"]'::jsonb, 'pending_rooms', TRUE, 2),
('MAINTENANCE', 'CORE_OPERATIONS', 'Maintenance', 'Facility telemetry, emergency engineering dispatch, and equipment work orders', 'build', '["Work Order Queue", "Facility Telemetry", "Equipment Asset Logs", "Repair Sign-off"]'::jsonb, 'open_orders', TRUE, 3),
('FB', 'FOOD_BEVERAGE', 'Food & Beverage', 'In-room dining orders, live kitchen display system, table service, and POS charges', 'restaurant', '["Kitchen Order Display", "In-Room Dining", "Butler Dispatch", "POS Billing"]'::jsonb, 'active_orders', TRUE, 4),
('RECIPE_MGMT', 'FOOD_BEVERAGE', 'Recipe Management', 'Master culinary formulas, raw ingredient BOM costing, and menu margin matrix', 'menu_book', '["Recipe Formulas", "Ingredient BOM", "Portion Costing", "Menu Engineering"]'::jsonb, NULL, TRUE, 5),
('INVENTORY', 'SUPPLY_CHAIN', 'Inventory', 'Multi-store stock monitoring, minimum par levels, and real-time storeroom adjustments', 'inventory_2', '["Par Stock Levels", "Storeroom Adjuster", "Transfer Orders", "Stock Audits"]'::jsonb, 'low_stock', TRUE, 6),
('PROCUREMENT', 'SUPPLY_CHAIN', 'Procurement', 'Purchase requisitions, vendor approval workflows, and purchase order tracking', 'shopping_cart', '["Purchase Orders", "Supplier Directory", "Requisitions", "Goods Receipt"]'::jsonb, 'pending_pos', TRUE, 7),
('CRM', 'BUSINESS', 'Guest CRM', '360° guest profiles, loyalty tiers, stay expenditure history, and VIP directives', 'badge', '["Guest Profiles", "Loyalty Tiering", "VIP Directives", "Stay History"]'::jsonb, NULL, TRUE, 8),
('FINANCE', 'BUSINESS', 'Finance & Audit', 'City ledger receivables, night audit settlement, payment reconciliation, and tax reports', 'account_balance', '["City Ledger", "Night Audit Rollover", "Payment Batches", "Tax Reports"]'::jsonb, NULL, FALSE, 9),
('HR', 'BUSINESS', 'Staff & Shifts', 'Shift rosters, staff leaderboards, turnaround metrics, and handover logs', 'badge', '["Shift Rosters", "Staff KPIs", "Attendance", "Handover Reports"]'::jsonb, NULL, TRUE, 10),
('ANALYTICS', 'BUSINESS', 'Analytics', 'RevPAR, ADR, occupancy forecasting, and multi-department operational KPIs', 'insights', '["RevPAR & ADR", "Occupancy Forecast", "Revenue Metrics", "Department KPIs"]'::jsonb, NULL, TRUE, 11),
('ADMINISTRATION', 'ADMINISTRATION', 'Administration', 'Hospitality OS configuration, user access controls, and security audit logs', 'admin_panel_settings', '["User Management", "Role Permissions", "Audit Trail", "Property Settings"]'::jsonb, NULL, FALSE, 12)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name, 
  description = EXCLUDED.description, 
  icon = EXCLUDED.icon, 
  functions = EXCLUDED.functions,
  is_implemented = EXCLUDED.is_implemented;

-- 12. Roles
INSERT INTO roles (id, name, description) VALUES
('ADMIN', 'System Administrator', 'Full enterprise control across all hotel workspaces and security settings'),
('GENERAL_MANAGER', 'General Manager', 'Operational oversight across front office, housekeeping, F&B, supply chain, and finance'),
('FRONT_DESK_AGENT', 'Front Desk Agent', 'Front office reservations, check-ins, key access, and guest folios'),
('HOUSEKEEPING_SUPERVISOR', 'Housekeeping Supervisor', 'Floor room inspection, cleaning dispatch, and maintenance reporting'),
('STORE_MANAGER', 'Supply & Store Manager', 'Storeroom inventory levels, par replenishment, and purchase orders'),
('FB_CHEF', 'Executive Chef / F&B Manager', 'Kitchen orders, culinary recipes, and food cost engineering')
ON CONFLICT (id) DO NOTHING;

-- Role Workspaces Mapping
DELETE FROM role_workspaces;
INSERT INTO role_workspaces (role_id, workspace_id) VALUES
-- Admin has access to all
('ADMIN', 'FRONT_DESK'),
('ADMIN', 'HOUSEKEEPING'),
('ADMIN', 'MAINTENANCE'),
('ADMIN', 'FB'),
('ADMIN', 'RECIPE_MGMT'),
('ADMIN', 'INVENTORY'),
('ADMIN', 'PROCUREMENT'),
('ADMIN', 'CRM'),
('ADMIN', 'FINANCE'),
('ADMIN', 'HR'),
('ADMIN', 'ANALYTICS'),
('ADMIN', 'ADMINISTRATION'),

-- General Manager
('GENERAL_MANAGER', 'FRONT_DESK'),
('GENERAL_MANAGER', 'HOUSEKEEPING'),
('GENERAL_MANAGER', 'MAINTENANCE'),
('GENERAL_MANAGER', 'FB'),
('GENERAL_MANAGER', 'RECIPE_MGMT'),
('GENERAL_MANAGER', 'INVENTORY'),
('GENERAL_MANAGER', 'PROCUREMENT'),
('GENERAL_MANAGER', 'CRM'),
('GENERAL_MANAGER', 'FINANCE'),
('GENERAL_MANAGER', 'HR'),
('GENERAL_MANAGER', 'ANALYTICS'),

-- Front Desk Agent: Front Desk only
('FRONT_DESK_AGENT', 'FRONT_DESK'),

-- Housekeeping Supervisor
('HOUSEKEEPING_SUPERVISOR', 'HOUSEKEEPING'),
('HOUSEKEEPING_SUPERVISOR', 'MAINTENANCE'),

-- Store Manager
('STORE_MANAGER', 'INVENTORY'),
('STORE_MANAGER', 'PROCUREMENT'),

-- F&B Chef
('FB_CHEF', 'FB'),
('FB_CHEF', 'RECIPE_MGMT'),
('FB_CHEF', 'INVENTORY');

-- 13. System Users
INSERT INTO users (id, username, email, full_name, role_id, avatar_initials) VALUES
('20000000-0000-0000-0000-000000000001', 'admin', 'admin@volvitech.com', 'Alexander Vance (System Admin)', 'ADMIN', 'AV'),
('20000000-0000-0000-0000-000000000002', 'gm', 'gm@astoria.com', 'Victoria Sterling (General Manager)', 'GENERAL_MANAGER', 'VS'),
('20000000-0000-0000-0000-000000000003', 'reception', 'reception@astoria.com', 'Julian Croft (Front Desk)', 'FRONT_DESK_AGENT', 'JC'),
('20000000-0000-0000-0000-000000000004', 'housekeeping', 'housekeeping@astoria.com', 'Maria Santos (Housekeeping)', 'HOUSEKEEPING_SUPERVISOR', 'MS'),
('20000000-0000-0000-0000-000000000005', 'store', 'store@astoria.com', 'Marcus Aurel (Supply Manager)', 'STORE_MANAGER', 'MA'),
('20000000-0000-0000-0000-000000000006', 'chef', 'chef@astoria.com', 'Antoine Laurent (Executive Chef)', 'FB_CHEF', 'AL')
ON CONFLICT (username) DO NOTHING;

-- User Properties
DELETE FROM user_properties;
INSERT INTO user_properties (user_id, property_id, is_default) VALUES
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', TRUE),
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', FALSE),
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', FALSE),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', TRUE),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', FALSE),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', TRUE),
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', TRUE),
('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', TRUE),
('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', TRUE);


