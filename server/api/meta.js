// ==========================================================================
// VOLVITECH HOSPITALITY OS — METADATA & GUEST LOOKUP CONTROLLER
// ==========================================================================
import express from 'express';
import { query } from '../db/index.js';

export const metaRouter = express.Router();

// GET /api/meta - Lookup Tables
metaRouter.get('/', async (req, res) => {
  try {
    const roomTypes = await query(`SELECT * FROM room_types WHERE is_active = TRUE ORDER BY base_price ASC`);
    const ratePlans = await query(`SELECT * FROM rate_plans WHERE is_active = TRUE ORDER BY name ASC`);
    const ratePlanRoomTypes = await query(`SELECT * FROM rate_plan_room_types`);
    const bookingSources = await query(`SELECT * FROM booking_sources WHERE is_active = TRUE ORDER BY name ASC`);
    const rooms = await query(`
      SELECT r.*, rt.name as room_type_name, rt.code as room_type_code 
      FROM rooms r 
      JOIN room_types rt ON r.room_type_id = rt.id 
      WHERE r.is_active = TRUE 
      ORDER BY r.floor ASC, r.room_number ASC
    `);

    res.json({
      success: true,
      data: {
        roomTypes: roomTypes.rows,
        ratePlans: ratePlans.rows,
        ratePlanRoomTypes: ratePlanRoomTypes.rows,
        bookingSources: bookingSources.rows,
        rooms: rooms.rows
      }
    });
  } catch (err) {
    console.error('[Meta error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/guests/search?q= - Guest Autocomplete
metaRouter.get('/guests/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.json({ success: true, data: [] });
    }

    const term = `%${q.trim()}%`;
    const sql = `
      SELECT id, first_name, last_name, email, phone, dial_code, nationality, 
             id_document_type, id_document_number, vip_status, total_stays, lifetime_spend
      FROM guests
      WHERE 
        first_name ILIKE $1 OR
        last_name ILIKE $1 OR
        CONCAT(first_name, ' ', last_name) ILIKE $1 OR
        email ILIKE $1 OR
        phone ILIKE $1 OR
        id_document_number ILIKE $1
      ORDER BY total_stays DESC, last_name ASC
      LIMIT 10
    `;
    const result = await query(sql, [term]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error('[Guest Search error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});
