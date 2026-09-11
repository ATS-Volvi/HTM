-- ==========================================================================
-- VOLVITECH HOSPITALITY OS — CORE DATABASE SCHEMA (POSTGRESQL 18)
-- Module: Front Office & Reservation Foundation
-- ==========================================================================

-- Enable pgcrypto for UUID generation if needed (gen_random_uuid is built-in in modern PG)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Booking Sources (Configurable, extensible)
CREATE TABLE IF NOT EXISTS booking_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    commission_pct NUMERIC(5, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Guests (CRM Profile entity)
CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    dial_code VARCHAR(10) DEFAULT '+1',
    nationality VARCHAR(100),
    id_document_type VARCHAR(50) DEFAULT 'PASSPORT', -- PASSPORT, NATIONAL_ID, DRIVERS_LICENSE
    id_document_number VARCHAR(100),
    vip_status VARCHAR(50) DEFAULT 'STANDARD', -- STANDARD, SILVER, GOLD, PLATINUM, VIP
    special_preferences JSONB DEFAULT '{}'::jsonb, -- e.g. {"pillow": "Foam", "dietary": "Gluten-Free"}
    total_stays INT DEFAULT 0,
    lifetime_spend NUMERIC(12, 2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guests_email ON guests(email);
CREATE INDEX IF NOT EXISTS idx_guests_phone ON guests(phone);
CREATE INDEX IF NOT EXISTS idx_guests_name ON guests(last_name, first_name);

-- 3. Room Types (Inventory classification)
CREATE TABLE IF NOT EXISTS room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) UNIQUE NOT NULL, -- e.g. KING_DLX, DBL_QUEEN, EXEC_STE, PENTHOUSE
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_occupancy INT DEFAULT 2,
    max_occupancy INT DEFAULT 3,
    base_price NUMERIC(10, 2) NOT NULL,
    total_inventory INT DEFAULT 0,
    color_code VARCHAR(30) DEFAULT '#1a2b3c',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Rooms (Physical Room Units)
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number VARCHAR(20) UNIQUE NOT NULL,
    floor VARCHAR(10) NOT NULL,
    room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE RESTRICT,
    operational_status VARCHAR(30) DEFAULT 'VACANT_CLEAN', 
    -- Statuses: VACANT_CLEAN, VACANT_DIRTY, OCCUPIED, OUT_OF_ORDER, INSPECTION_REQUIRED
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rooms_type ON rooms(room_type_id);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(operational_status);

-- 5. Rate Plans
CREATE TABLE IF NOT EXISTS rate_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) UNIQUE NOT NULL, -- e.g. BAR_FLEX, CORP_L1, PROMO_NONREF
    name VARCHAR(100) NOT NULL,
    description TEXT,
    currency VARCHAR(3) DEFAULT 'USD',
    cancellation_policy TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Rate Plan Room Types (Pricing Matrix)
CREATE TABLE IF NOT EXISTS rate_plan_room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rate_plan_id UUID NOT NULL REFERENCES rate_plans(id) ON DELETE CASCADE,
    room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
    nightly_rate NUMERIC(10, 2) NOT NULL,
    UNIQUE(rate_plan_id, room_type_id)
);

-- 7. Reservations (Core booking record)
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_number VARCHAR(30) UNIQUE NOT NULL, -- e.g. HX-8921
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE RESTRICT,
    booking_source_id UUID NOT NULL REFERENCES booking_sources(id) ON DELETE RESTRICT,
    room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE RESTRICT,
    rate_plan_id UUID NOT NULL REFERENCES rate_plans(id) ON DELETE RESTRICT,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    adults INT DEFAULT 1 NOT NULL CHECK (adults >= 1),
    children INT DEFAULT 0 NOT NULL CHECK (children >= 0),
    status VARCHAR(30) DEFAULT 'CONFIRMED',
    -- Status lifecycle: DRAFT, CONFIRMED, CHECKED_IN, CHECKED_OUT, CANCELLED, NO_SHOW
    estimated_arrival_time TIME,
    special_requests TEXT,
    currency VARCHAR(3) DEFAULT 'USD',
    nightly_rate NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_dates CHECK (check_out_date > check_in_date)
);

CREATE INDEX IF NOT EXISTS idx_reservations_number ON reservations(reservation_number);
CREATE INDEX IF NOT EXISTS idx_reservations_dates ON reservations(check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_guest ON reservations(guest_id);
CREATE INDEX IF NOT EXISTS idx_reservations_room_type ON reservations(room_type_id);

-- 8. Room Allocations (Decoupled from reservation, supports room moves & history)
CREATE TABLE IF NOT EXISTS room_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
    status VARCHAR(30) DEFAULT 'ACTIVE', -- ACTIVE, RELEASED, TRANSFERRED
    allocated_at TIMESTAMPTZ DEFAULT NOW(),
    released_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_room_allocations_res ON room_allocations(reservation_id);
CREATE INDEX IF NOT EXISTS idx_room_allocations_room ON room_allocations(room_id);

-- 9. Minimal Folio Foundation (Ready for Check-In & Financial Integration)
CREATE TABLE IF NOT EXISTS folios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE RESTRICT,
    folio_number VARCHAR(40) UNIQUE NOT NULL,
    status VARCHAR(30) DEFAULT 'OPEN', -- OPEN, SETTLED, CLOSED
    balance NUMERIC(12, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS folio_charges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folio_id UUID NOT NULL REFERENCES folios(id) ON DELETE CASCADE,
    category VARCHAR(50) DEFAULT 'ROOM', -- ROOM, TAX, FB, SPA, LAUNDRY, SERVICE
    description VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    tax_amount NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS folio_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folio_id UUID NOT NULL REFERENCES folios(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL, -- CREDIT_CARD, CASH, CORPORATE_DIRECT, VOUCHER
    amount NUMERIC(10, 2) NOT NULL,
    reference VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Multi-Property Support
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(255),
    currency VARCHAR(3) DEFAULT 'USD',
    currency_symbol VARCHAR(10) DEFAULT '$',
    stars INT DEFAULT 5,
    rooms_count INT DEFAULT 32,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Workspaces Catalog (Central HMS Module Registry)
CREATE TABLE IF NOT EXISTS workspaces (
    id VARCHAR(50) PRIMARY KEY, -- e.g. FRONT_DESK, HOUSEKEEPING, FB, INVENTORY, etc.
    category VARCHAR(50) NOT NULL, -- CORE_OPERATIONS, FOOD_BEVERAGE, SUPPLY_CHAIN, BUSINESS, ADMINISTRATION
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50) NOT NULL,
    functions JSONB DEFAULT '[]'::jsonb,
    badge_metric VARCHAR(50),
    is_implemented BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- 12. Enterprise Roles & Permissions
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(50) PRIMARY KEY, -- ADMIN, GENERAL_MANAGER, FRONT_DESK_AGENT, etc.
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS role_workspaces (
    role_id VARCHAR(50) NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    workspace_id VARCHAR(50) NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, workspace_id)
);

-- 13. System Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL DEFAULT 'password123',
    full_name VARCHAR(150) NOT NULL,
    role_id VARCHAR(50) NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    avatar_initials VARCHAR(4) DEFAULT 'US',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_properties (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    is_default BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, property_id)
);

