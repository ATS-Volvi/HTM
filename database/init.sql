-- ==========================================================================
-- VOLVITECH HOSPITALITY OS — DATABASE MASTER INIT (TIER 3)
-- ==========================================================================

CREATE SEQUENCE IF NOT EXISTS reservation_number_seq START 10;

\i schema.sql
\i seed.sql
