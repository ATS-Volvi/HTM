// ==========================================================================
// VOLVITECH HOSPITALITY OS — POSTGRESQL 18 POOL (DATA TIER DRIVER)
// ==========================================================================
import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
const isNeonOrSsl = connectionString?.includes('neon.tech') || process.env.PGSSL === 'true' || connectionString?.includes('sslmode=require');

export const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: isNeonOrSsl ? { rejectUnauthorized: false } : undefined,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 15000,
    })
  : new Pool({
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT || '5432', 10),
      database: process.env.PGDATABASE || 'volvitech_hospitality',
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

export async function query<T = any>(text: string, params?: any[]): Promise<pg.QueryResult<T>> {
  const start = Date.now();
  const res = await pool.query<T>(text, params);
  const duration = Date.now() - start;
  if (process.env.DEBUG_SQL) {
    console.log('[PG 18 SQL]', { text: text.trim().substring(0, 100), duration, rows: res.rowCount });
  }
  return res;
}

export async function getClient() {
  const client = await pool.connect();
  return client;
}
