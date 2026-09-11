# Volvitech Hospitality OS — Database Tier (Tier 3)

Enterprise relational storage powered by **PostgreSQL 18**.

## Files
- `schema.sql`: Core tables, relational foreign keys, check constraints, and performance indexes.
- `seed.sql`: Initial seed data matching Stitch LuxeOps confirmation codes (`#HX-8921` to `#HX-8925`).
- `init.sql`: One-command initialization runner.

## Local PostgreSQL Setup

```bash
# 1. Create database
createdb -U postgres -h localhost volvitech_hospitality

# 2. Run initialization
psql -U postgres -h localhost -d volvitech_hospitality -f database/init.sql
```
