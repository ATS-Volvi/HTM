import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
  const seedPath = path.resolve(__dirname, '../../../database/seed.sql');

  console.log('[Migration] Loading schema from:', schemaPath);
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  await pool.query(schemaSql);
  console.log('[Migration] Schema executed successfully');

  console.log('[Migration] Loading seed from:', seedPath);
  const seedSql = fs.readFileSync(seedPath, 'utf8');
  await pool.query(seedSql);
  console.log('[Migration] Seed executed successfully');

  await pool.end();
  console.log('[Migration] Done.');
}

runMigration().catch((err) => {
  console.error('[Migration Error]', err);
  process.exit(1);
});
