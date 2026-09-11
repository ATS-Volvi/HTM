// ==========================================================================
// VOLVITECH HOSPITALITY OS — RESERVATIONS CONTROLLER
// ==========================================================================
import express from 'express';
import { query, pool } from '../db/index.js';

export const reservationsRouter = express.Router();

// GET /api/reservations - Search & Filter
reservationsRouter.get('/', async (req, res) => {
  try {
    const { q, status, source, fromDate, toDate } = req.query;
    let sql = `
      SELECT 
        r.id,
        r.reservation_number,
        r.check_in_date,
        r.check_out_date,
        r.adults,
        r.children,
        r.status,
        r.nightly_rate,
        r.total_amount,
        r.created_at,
        g.id AS guest_id,
        g.first_name,
        g.last_name,
        g.email AS guest_email,
        g.phone AS guest_phone,
        g.vip_status,
        rt.id AS room_type_id,
        rt.name AS room_type_name,
        rt.code AS room_type_code,
        bs.name AS booking_source_name,
        bs.code AS booking_source_code,
        rp.name AS rate_plan_name,
        rm.room_number AS allocated_room_number,
        rm.operational_status AS room_operational_status,
        f.id AS folio_id,
        f.balance AS folio_balance
      FROM reservations r
      JOIN guests g ON r.guest_id = g.id
      JOIN room_types rt ON r.room_type_id = rt.id
      JOIN booking_sources bs ON r.booking_source_id = bs.id
      JOIN rate_plans rp ON r.rate_plan_id = rp.id
      LEFT JOIN room_allocations ra ON r.id = ra.reservation_id AND ra.status = 'ACTIVE'
      LEFT JOIN rooms rm ON ra.room_id = rm.id
      LEFT JOIN folios f ON r.id = f.reservation_id
      WHERE 1=1
    `;
    const params = [];

    if (q && q.trim()) {
      params.push(`%${q.trim()}%`);
      const idx = params.length;
      sql += ` AND (
        r.reservation_number ILIKE $${idx} OR
        g.first_name ILIKE $${idx} OR
        g.last_name ILIKE $${idx} OR
        CONCAT(g.first_name, ' ', g.last_name) ILIKE $${idx} OR
        g.email ILIKE $${idx} OR
        g.phone ILIKE $${idx}
      )`;
    }

    if (status && status !== 'ALL') {
      params.push(status);
      sql += ` AND r.status = $${params.length}`;
    }

    if (source && source !== 'ALL') {
      params.push(source);
      sql += ` AND (bs.code = $${params.length} OR bs.id::text = $${params.length})`;
    }

    if (fromDate) {
      params.push(fromDate);
      sql += ` AND r.check_in_date >= $${params.length}`;
    }

    if (toDate) {
      params.push(toDate);
      sql += ` AND r.check_out_date <= $${params.length}`;
    }

    sql += ` ORDER BY r.check_in_date ASC, r.created_at DESC`;

    const result = await query(sql, params);
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    console.error('[Reservations GET error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/reservations - Create New Booking
reservationsRouter.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      guest, // { id } OR { firstName, lastName, email, phone, dialCode, idDocType, idDocNumber, nationality }
      checkInDate,
      checkOutDate,
      adults = 1,
      children = 0,
      roomTypeId,
      ratePlanId,
      bookingSourceId,
      specialRequests,
      roomId, // optional physical room allocation
    } = req.body;

    if (!checkInDate || !checkOutDate || !roomTypeId || !ratePlanId || !bookingSourceId) {
      return res.status(400).json({ success: false, error: 'Missing required reservation fields' });
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      return res.status(400).json({ success: false, error: 'Check-out date must be after check-in date' });
    }

    await client.query('BEGIN');

    // 1. Resolve or Create Guest
    let guestId = guest?.id;
    if (!guestId) {
      if (!guest?.firstName || !guest?.lastName) {
        throw new Error('Guest first name and last name are required');
      }

      // Check if existing guest with exact email or phone exists
      const existingGuest = await client.query(
        `SELECT id FROM guests WHERE (email = $1 AND $1 IS NOT NULL AND $1 <> '') OR (phone = $2 AND $2 IS NOT NULL AND $2 <> '') LIMIT 1`,
        [guest.email || null, guest.phone || null]
      );

      if (existingGuest.rows.length > 0) {
        guestId = existingGuest.rows[0].id;
      } else {
        const insertGuest = await client.query(
          `INSERT INTO guests (first_name, last_name, email, phone, dial_code, nationality, id_document_type, id_document_number, vip_status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
          [
            guest.firstName.trim(),
            guest.lastName.trim(),
            guest.email?.trim() || null,
            guest.phone?.trim() || null,
            guest.dialCode || '+1',
            guest.nationality || null,
            guest.idDocType || 'PASSPORT',
            guest.idDocNumber?.trim() || null,
            guest.vipStatus || 'STANDARD'
          ]
        );
        guestId = insertGuest.rows[0].id;
      }
    }

    // 2. Check Category Inventory Availability
    // Total physical rooms in room type minus active reservations overlapping [checkInDate, checkOutDate)
    const availCheck = await client.query(
      `
      WITH total_rooms AS (
        SELECT COUNT(*) AS total FROM rooms WHERE room_type_id = $1 AND is_active = TRUE
      ),
      booked_rooms AS (
        SELECT COUNT(*) AS booked FROM reservations 
        WHERE room_type_id = $1 
          AND status IN ('CONFIRMED', 'CHECKED_IN')
          AND check_in_date < $3 
          AND check_out_date > $2
      )
      SELECT (total_rooms.total - booked_rooms.booked) AS available_count
      FROM total_rooms, booked_rooms;
      `,
      [roomTypeId, checkInDate, checkOutDate]
    );

    const availableCount = parseInt(availCheck.rows[0]?.available_count || '0', 10);
    if (availableCount <= 0) {
      throw new Error('No rooms of this category are available for the selected dates');
    }

    // 3. Fetch Nightly Rate from Rate Plan Room Types
    const rateCheck = await client.query(
      `SELECT nightly_rate FROM rate_plan_room_types WHERE rate_plan_id = $1 AND room_type_id = $2`,
      [ratePlanId, roomTypeId]
    );

    let nightlyRate = 0;
    if (rateCheck.rows.length > 0) {
      nightlyRate = parseFloat(rateCheck.rows[0].nightly_rate);
    } else {
      const fallbackRate = await client.query(`SELECT base_price FROM room_types WHERE id = $1`, [roomTypeId]);
      nightlyRate = parseFloat(fallbackRate.rows[0]?.base_price || 200);
    }

    const nights = Math.max(1, Math.round((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)));
    const totalAmount = nights * nightlyRate;

    // 4. Generate Sequential Reservation Number #HX-XXXX
    const countRes = await client.query(`SELECT COUNT(*) as cnt FROM reservations`);
    const nextSeq = 8920 + parseInt(countRes.rows[0].cnt, 10) + 1;
    const resNumber = `HX-${nextSeq}`;

    // 5. Insert Reservation
    const insertRes = await client.query(
      `
      INSERT INTO reservations (
        reservation_number, guest_id, booking_source_id, room_type_id, rate_plan_id,
        check_in_date, check_out_date, adults, children, status,
        special_requests, nightly_rate, total_amount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'CONFIRMED', $10, $11, $12)
      RETURNING *
      `,
      [
        resNumber,
        guestId,
        bookingSourceId,
        roomTypeId,
        ratePlanId,
        checkInDate,
        checkOutDate,
        adults,
        children,
        specialRequests || null,
        nightlyRate,
        totalAmount
      ]
    );

    const newReservation = insertRes.rows[0];

    // 6. Optional Room Allocation
    let allocatedRoom = null;
    if (roomId) {
      // Conflict check for specific room
      const roomConflict = await client.query(
        `
        SELECT r.reservation_number 
        FROM room_allocations ra
        JOIN reservations r ON ra.reservation_id = r.id
        WHERE ra.room_id = $1 
          AND ra.status = 'ACTIVE'
          AND r.status IN ('CONFIRMED', 'CHECKED_IN')
          AND r.check_in_date < $3 
          AND r.check_out_date > $2
        `,
        [roomId, checkInDate, checkOutDate]
      );

      if (roomConflict.rows.length > 0) {
        throw new Error(`Room is already allocated to reservation ${roomConflict.rows[0].reservation_number} for overlapping dates`);
      }

      await client.query(
        `INSERT INTO room_allocations (reservation_id, room_id, status) VALUES ($1, $2, 'ACTIVE')`,
        [newReservation.id, roomId]
      );

      const rInfo = await client.query(`SELECT room_number FROM rooms WHERE id = $1`, [roomId]);
      allocatedRoom = rInfo.rows[0]?.room_number;
    }

    // 7. Minimal Folio Foundation
    const folioNum = `FOL-${resNumber.replace('HX-', '')}`;
    const insertFolio = await client.query(
      `INSERT INTO folios (reservation_id, guest_id, folio_number, status, balance)
       VALUES ($1, $2, $3, 'OPEN', 0.00) RETURNING id`,
      [newReservation.id, guestId, folioNum]
    );

    // Record initial room charge expectation or hold
    await client.query(
      `INSERT INTO folio_charges (folio_id, category, description, amount, tax_amount)
       VALUES ($1, 'ROOM', $2, $3, $4)`,
      [
        insertFolio.rows[0].id,
        `Room Tariff Estimation (${nights} nights)`,
        totalAmount,
        totalAmount * 0.10 // 10% hospitality tax
      ]
    );

    await client.query(
      `UPDATE folios SET balance = $1 WHERE id = $2`,
      [totalAmount * 1.10, insertFolio.rows[0].id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      data: {
        ...newReservation,
        allocatedRoomNumber: allocatedRoom,
        folioNumber: folioNum
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Reservations POST error]', err);
    res.status(400).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
});

// GET /api/reservations/:id - Detail
reservationsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT 
        r.*,
        g.first_name, g.last_name, g.email AS guest_email, g.phone AS guest_phone,
        g.dial_code, g.nationality, g.id_document_type, g.id_document_number, g.vip_status,
        rt.name AS room_type_name, rt.code AS room_type_code,
        bs.name AS booking_source_name,
        rp.name AS rate_plan_name, rp.cancellation_policy,
        rm.id AS allocated_room_id,
        rm.room_number AS allocated_room_number,
        rm.floor AS allocated_room_floor,
        f.id AS folio_id,
        f.folio_number,
        f.balance AS folio_balance
      FROM reservations r
      JOIN guests g ON r.guest_id = g.id
      JOIN room_types rt ON r.room_type_id = rt.id
      JOIN booking_sources bs ON r.booking_source_id = bs.id
      JOIN rate_plans rp ON r.rate_plan_id = rp.id
      LEFT JOIN room_allocations ra ON r.id = ra.reservation_id AND ra.status = 'ACTIVE'
      LEFT JOIN rooms rm ON ra.room_id = rm.id
      LEFT JOIN folios f ON r.id = f.reservation_id
      WHERE r.id::text = $1 OR r.reservation_number = $1
    `;
    const result = await query(sql, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Reservation not found' });
    }

    const reservation = result.rows[0];

    // Get Folio Charges
    let folioCharges = [];
    if (reservation.folio_id) {
      const fRes = await query(
        `SELECT * FROM folio_charges WHERE folio_id = $1 ORDER BY created_at ASC`,
        [reservation.folio_id]
      );
      folioCharges = fRes.rows;
    }

    res.json({
      success: true,
      data: {
        ...reservation,
        charges: folioCharges
      }
    });
  } catch (err) {
    console.error('[Reservations GET /:id error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/reservations/:id/cancel - Cancel Reservation
reservationsRouter.post('/:id/cancel', async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { reason } = req.body;

    await client.query('BEGIN');
    const updateRes = await client.query(
      `UPDATE reservations 
       SET status = 'CANCELLED', cancelled_at = NOW(), cancellation_reason = $2, updated_at = NOW() 
       WHERE (id::text = $1 OR reservation_number = $1) AND status != 'CANCELLED'
       RETURNING *`,
      [id, reason || 'Guest requested cancellation']
    );

    if (updateRes.rows.length === 0) {
      throw new Error('Reservation not found or already cancelled');
    }

    const reservationId = updateRes.rows[0].id;

    // Release any active room allocation
    await client.query(
      `UPDATE room_allocations SET status = 'RELEASED', released_at = NOW() WHERE reservation_id = $1 AND status = 'ACTIVE'`,
      [reservationId]
    );

    await client.query('COMMIT');
    res.json({ success: true, data: updateRes.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
});

// POST /api/reservations/:id/allocate-room - Assign or Change Physical Room
reservationsRouter.post('/:id/allocate-room', async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({ success: false, error: 'Room ID is required' });
    }

    await client.query('BEGIN');

    // Get reservation
    const rRes = await client.query(`SELECT * FROM reservations WHERE id::text = $1 OR reservation_number = $1`, [id]);
    if (rRes.rows.length === 0) {
      throw new Error('Reservation not found');
    }
    const resv = rRes.rows[0];

    // Check conflict
    const conflict = await client.query(
      `
      SELECT r.reservation_number 
      FROM room_allocations ra
      JOIN reservations r ON ra.reservation_id = r.id
      WHERE ra.room_id = $1 
        AND ra.status = 'ACTIVE'
        AND ra.reservation_id != $4
        AND r.status IN ('CONFIRMED', 'CHECKED_IN')
        AND r.check_in_date < $3 
        AND r.check_out_date > $2
      `,
      [roomId, resv.check_in_date, resv.check_out_date, resv.id]
    );

    if (conflict.rows.length > 0) {
      throw new Error(`Room is already allocated to reservation ${conflict.rows[0].reservation_number}`);
    }

    // Release existing allocation if any
    await client.query(
      `UPDATE room_allocations SET status = 'TRANSFERRED', released_at = NOW() WHERE reservation_id = $1 AND status = 'ACTIVE'`,
      [resv.id]
    );

    // Insert new allocation
    await client.query(
      `INSERT INTO room_allocations (reservation_id, room_id, status) VALUES ($1, $2, 'ACTIVE')`,
      [resv.id, roomId]
    );

    const roomDetails = await client.query(`SELECT * FROM rooms WHERE id = $1`, [roomId]);

    await client.query('COMMIT');
    res.json({ success: true, room: roomDetails.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
});

// POST /api/reservations/:id/check-in - Complete Check-In & Room Key Issuance
reservationsRouter.post('/:id/check-in', async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { roomId } = req.body;
    await client.query('BEGIN');

    const rRes = await client.query(`SELECT * FROM reservations WHERE id::text = $1 OR reservation_number = $1`, [id]);
    if (rRes.rows.length === 0) throw new Error('Reservation not found');
    const resv = rRes.rows[0];

    // If a roomId is provided or needed
    let targetRoomId = roomId;
    if (!targetRoomId) {
      // Check existing active allocation
      const alloc = await client.query(`SELECT room_id FROM room_allocations WHERE reservation_id = $1 AND status = 'ACTIVE'`, [resv.id]);
      if (alloc.rows.length > 0) {
        targetRoomId = alloc.rows[0].room_id;
      } else {
        // Auto-assign first vacant clean room of that room type
        const autoRoom = await client.query(
          `SELECT id FROM rooms WHERE room_type_id = $1 AND operational_status = 'VACANT_CLEAN' LIMIT 1`,
          [resv.room_type_id]
        );
        if (autoRoom.rows.length === 0) throw new Error('No Vacant Clean rooms available for auto-assignment. Please clean or select another room.');
        targetRoomId = autoRoom.rows[0].id;

        await client.query(
          `INSERT INTO room_allocations (reservation_id, room_id, status) VALUES ($1, $2, 'ACTIVE')`,
          [resv.id, targetRoomId]
        );
      }
    } else {
      // Assign specified roomId
      await client.query(
        `UPDATE room_allocations SET status = 'TRANSFERRED', released_at = NOW() WHERE reservation_id = $1 AND status = 'ACTIVE'`,
        [resv.id]
      );
      await client.query(
        `INSERT INTO room_allocations (reservation_id, room_id, status) VALUES ($1, $2, 'ACTIVE')`,
        [resv.id, targetRoomId]
      );
    }

    // Set reservation status = 'CHECKED_IN'
    await client.query(`UPDATE reservations SET status = 'CHECKED_IN', updated_at = NOW() WHERE id = $1`, [resv.id]);

    // Set room operational status = 'OCCUPIED'
    await client.query(`UPDATE rooms SET operational_status = 'OCCUPIED', updated_at = NOW() WHERE id = $1`, [targetRoomId]);

    // Update guest total_stays
    await client.query(`UPDATE guests SET total_stays = total_stays + 1, updated_at = NOW() WHERE id = $1`, [resv.guest_id]);

    const finalRes = await client.query(
      `SELECT r.*, rm.room_number, g.first_name, g.last_name 
       FROM reservations r 
       JOIN room_allocations ra ON r.id = ra.reservation_id AND ra.status = 'ACTIVE'
       JOIN rooms rm ON ra.room_id = rm.id
       JOIN guests g ON r.guest_id = g.id
       WHERE r.id = $1`,
      [resv.id]
    );

    await client.query('COMMIT');
    res.json({ success: true, data: finalRes.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
});

// POST /api/reservations/:id/check-out - Settle & Check-Out
reservationsRouter.post('/:id/check-out', async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    await client.query('BEGIN');

    const rRes = await client.query(`SELECT * FROM reservations WHERE id::text = $1 OR reservation_number = $1`, [id]);
    if (rRes.rows.length === 0) throw new Error('Reservation not found');
    const resv = rRes.rows[0];

    // Find active allocated room
    const alloc = await client.query(`SELECT room_id FROM room_allocations WHERE reservation_id = $1 AND status = 'ACTIVE'`, [resv.id]);
    if (alloc.rows.length > 0) {
      const rId = alloc.rows[0].room_id;
      // Mark room as VACANT_DIRTY for turnover
      await client.query(`UPDATE rooms SET operational_status = 'VACANT_DIRTY', updated_at = NOW() WHERE id = $1`, [rId]);
      // Release allocation
      await client.query(`UPDATE room_allocations SET status = 'RELEASED', released_at = NOW() WHERE reservation_id = $1 AND status = 'ACTIVE'`, [resv.id]);
    }

    // Set reservation status = 'CHECKED_OUT'
    await client.query(`UPDATE reservations SET status = 'CHECKED_OUT', updated_at = NOW() WHERE id = $1`, [resv.id]);

    // Close Folio
    await client.query(`UPDATE folios SET status = 'SETTLED', updated_at = NOW() WHERE reservation_id = $1`, [resv.id]);

    await client.query('COMMIT');
    res.json({ success: true, message: `Reservation ${resv.reservation_number} checked out. Room marked VACANT_DIRTY for housekeeping.` });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(400).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
});

// POST /api/reservations/:id/folio-charge - Post incidental or room charge
reservationsRouter.post('/:id/folio-charge', async (req, res) => {
  try {
    const { id } = req.params;
    const { category = 'INCIDENTAL', description, amount } = req.body;

    const rRes = await query(`SELECT id FROM reservations WHERE id::text = $1 OR reservation_number = $1`, [id]);
    if (rRes.rows.length === 0) throw new Error('Reservation not found');

    const fRes = await query(`SELECT id FROM folios WHERE reservation_id = $1`, [rRes.rows[0].id]);
    if (fRes.rows.length === 0) throw new Error('Folio not found');
    const folioId = fRes.rows[0].id;

    const numAmount = parseFloat(amount);
    const tax = numAmount * 0.10;

    await query(
      `INSERT INTO folio_charges (folio_id, category, description, amount, tax_amount) VALUES ($1, $2, $3, $4, $5)`,
      [folioId, category, description, numAmount, tax]
    );

    await query(`UPDATE folios SET balance = balance + $1 WHERE id = $2`, [numAmount + tax, folioId]);

    res.json({ success: true, message: 'Charge posted to folio' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

