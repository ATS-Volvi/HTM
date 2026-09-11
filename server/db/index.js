// ==========================================================================
// VOLVITECH HOSPITALITY OS — POSTGRESQL POOL CONNECTION
// ==========================================================================
import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  database: process.env.PGDATABASE || 'volvitech_hospitality',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[PostgreSQL] Unexpected idle client error:', err);
});

export const query = (text, params) => pool.query(text, params);
