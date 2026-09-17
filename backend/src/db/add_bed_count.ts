import { query } from './pool.js';

async function run() {
  try {
    await query('ALTER TABLE rooms ADD COLUMN IF NOT EXISTS bed_count INT DEFAULT 1;');
    // Also update existing rooms based on their room type code if appropriate:
    // e.g. DBL_QUEEN -> 2 beds, Penthouse -> 3 beds, King -> 1 bed
    await query(`
      UPDATE rooms r
      SET bed_count = CASE 
        WHEN rt.code = 'DBL_QUEEN' THEN 2
        WHEN rt.code = 'PENTHOUSE' THEN 3
        WHEN rt.code = 'EXEC_STE' THEN 2
        ELSE 1
      END
      FROM room_types rt
      WHERE r.room_type_id = rt.id AND (r.bed_count IS NULL OR r.bed_count = 1);
    `);
    const res = await query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'rooms';");
    console.log('ROOMS COLUMNS:', res.rows.map(r => r.column_name));
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

run();
