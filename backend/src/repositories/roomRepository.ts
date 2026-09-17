// ==========================================================================
// VOLVITECH HOSPITALITY OS — ROOM REPOSITORY (TIER 3: DATA ACCESS)
// ==========================================================================
import { query, pool } from '../db/pool.js';
import type { RoomEntity, RoomOperationalStatus } from '../types/entities.js';
import type { PoolClient } from 'pg';

export class RoomRepository {
  static async findAllRooms(): Promise<RoomEntity[]> {
    const res = await query<RoomEntity>(
      `SELECT * FROM rooms WHERE is_active = true ORDER BY floor ASC, room_number ASC`
    );
    return res.rows;
  }

  static async findById(id: string): Promise<RoomEntity | null> {
    const res = await query<RoomEntity>(`SELECT * FROM rooms WHERE id = $1`, [id]);
    return res.rows[0] || null;
  }

  static async findCleanVacantRooms(roomTypeId: string): Promise<RoomEntity[]> {
    const res = await query<RoomEntity>(
      `SELECT * FROM rooms 
       WHERE room_type_id = $1 AND operational_status = 'VACANT_CLEAN' AND is_active = true
       ORDER BY room_number ASC`,
      [roomTypeId]
    );
    return res.rows;
  }

  static async checkRoomConflict(
    roomId: string,
    checkInDate: string,
    checkOutDate: string,
    excludeReservationId?: string,
    client?: PoolClient
  ): Promise<string | null> {
    const executor = client || pool;
    let sql = `
      SELECT r.reservation_number 
      FROM room_allocations ra
      JOIN reservations r ON ra.reservation_id = r.id
      WHERE ra.room_id = $1 
        AND ra.status = 'ACTIVE'
        AND r.status IN ('CONFIRMED', 'CHECKED_IN')
        AND r.check_in_date < $3 
        AND r.check_out_date > $2
    `;
    const params: any[] = [roomId, checkInDate, checkOutDate];
    if (excludeReservationId) {
      sql += ` AND ra.reservation_id != $4`;
      params.push(excludeReservationId);
    }

    const res = await executor.query(sql, params);
    return res.rows.length > 0 ? res.rows[0].reservation_number : null;
  }

  static async allocateRoom(reservationId: string, roomId: string, client: PoolClient): Promise<void> {
    // Release existing active allocation
    await client.query(
      `UPDATE room_allocations SET status = 'TRANSFERRED', released_at = NOW() 
       WHERE reservation_id = $1 AND status = 'ACTIVE'`,
      [reservationId]
    );

    // Insert new active allocation
    await client.query(
      `INSERT INTO room_allocations (reservation_id, room_id, status) VALUES ($1, $2, 'ACTIVE')`,
      [reservationId, roomId]
    );
  }

  static async releaseAllocation(reservationId: string, client: PoolClient): Promise<string | null> {
    const active = await client.query(
      `UPDATE room_allocations SET status = 'RELEASED', released_at = NOW() 
       WHERE reservation_id = $1 AND status = 'ACTIVE' RETURNING room_id`,
      [reservationId]
    );
    return active.rows.length > 0 ? active.rows[0].room_id : null;
  }

  static async updateOperationalStatus(roomId: string, status: RoomOperationalStatus, client?: PoolClient): Promise<void> {
    const executor = client || pool;
    await executor.query(
      `UPDATE rooms SET operational_status = $1, updated_at = NOW() WHERE id = $2`,
      [status, roomId]
    );
  }

  // ── ROOM MASTER REPOSITORY METHODS ──────────────────────────────────────────

  static async findAllRoomsWithDetails(): Promise<any[]> {
    const sql = `
      SELECT 
        r.id,
        r.room_number,
        r.floor,
        r.room_type_id,
        r.operational_status,
        r.bed_count,
        r.is_active,
        r.created_at,
        r.updated_at,
        rt.code AS room_type_code,
        rt.name AS room_type_name,
        rt.color_code AS room_type_color,
        rt.base_price,
        rt.base_occupancy,
        rt.max_occupancy,
        (
          SELECT ra.status 
          FROM room_allocations ra 
          WHERE ra.room_id = r.id AND ra.status = 'ACTIVE' 
          LIMIT 1
        ) AS active_allocation_status,
        (
          SELECT res.reservation_number
          FROM room_allocations ra
          JOIN reservations res ON ra.reservation_id = res.id
          WHERE ra.room_id = r.id AND ra.status = 'ACTIVE' AND res.status IN ('CONFIRMED', 'CHECKED_IN')
          LIMIT 1
        ) AS active_reservation_number,
        (
          SELECT g.first_name || ' ' || g.last_name
          FROM room_allocations ra
          JOIN reservations res ON ra.reservation_id = res.id
          JOIN guests g ON res.guest_id = g.id
          WHERE ra.room_id = r.id AND ra.status = 'ACTIVE' AND res.status = 'CHECKED_IN'
          LIMIT 1
        ) AS occupant_name
      FROM rooms r
      JOIN room_types rt ON r.room_type_id = rt.id
      ORDER BY 
        CASE 
          WHEN r.floor ~ '^[0-9]+$' THEN r.floor::INTEGER 
          ELSE 999 
        END ASC, 
        r.room_number ASC
    `;
    const res = await query(sql);
    return res.rows;
  }

  static async createRoom(data: {
    room_number: string;
    floor: string;
    room_type_id: string;
    bed_count?: number;
    operational_status?: string;
  }): Promise<any> {
    const status = data.operational_status || 'VACANT_CLEAN';
    const bedCount = Number(data.bed_count) > 0 ? Number(data.bed_count) : 1;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // Check duplicate
      const dup = await client.query('SELECT id FROM rooms WHERE room_number = $1', [data.room_number.trim()]);
      if (dup.rows.length > 0) {
        throw new Error(`Room number "${data.room_number.trim()}" already exists`);
      }

      const insertRes = await client.query(
        `INSERT INTO rooms (room_number, floor, room_type_id, operational_status, bed_count, is_active)
         VALUES ($1, $2, $3, $4, $5, true)
         RETURNING *`,
        [data.room_number.trim(), data.floor.trim(), data.room_type_id, status, bedCount]
      );
      const newRoom = insertRes.rows[0];

      // Update total_inventory count on room_types
      await client.query(
        `UPDATE room_types 
         SET total_inventory = (SELECT COUNT(*) FROM rooms WHERE room_type_id = $1 AND is_active = true)
         WHERE id = $1`,
        [data.room_type_id]
      );

      await client.query('COMMIT');
      return newRoom;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  static async batchCreateRooms(params: {
    floor: string;
    room_type_id: string;
    room_numbers: string[];
    bed_count?: number;
    operational_status?: string;
  }): Promise<{ created: any[]; skipped: string[] }> {
    const client = await pool.connect();
    const created: any[] = [];
    const skipped: string[] = [];
    const status = params.operational_status || 'VACANT_CLEAN';
    const bedCount = Number(params.bed_count) > 0 ? Number(params.bed_count) : 1;

    try {
      await client.query('BEGIN');

      for (const num of params.room_numbers) {
        const cleanNum = num.trim();
        if (!cleanNum) continue;

        const exists = await client.query('SELECT id FROM rooms WHERE room_number = $1', [cleanNum]);
        if (exists.rows.length > 0) {
          skipped.push(cleanNum);
          continue;
        }

        const inserted = await client.query(
          `INSERT INTO rooms (room_number, floor, room_type_id, operational_status, bed_count, is_active)
           VALUES ($1, $2, $3, $4, $5, true)
           RETURNING *`,
          [cleanNum, params.floor.trim(), params.room_type_id, status, bedCount]
        );
        created.push(inserted.rows[0]);
      }

      // Update total inventory
      await client.query(
        `UPDATE room_types 
         SET total_inventory = (SELECT COUNT(*) FROM rooms WHERE room_type_id = $1 AND is_active = true)
         WHERE id = $1`,
        [params.room_type_id]
      );

      await client.query('COMMIT');
      return { created, skipped };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  static async updateRoom(
    id: string,
    data: {
      room_number?: string;
      floor?: string;
      room_type_id?: string;
      bed_count?: number;
      operational_status?: string;
      is_active?: boolean;
    }
  ): Promise<any> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const current = await client.query('SELECT * FROM rooms WHERE id = $1', [id]);
      if (current.rows.length === 0) {
        throw new Error('Room not found');
      }
      const existing = current.rows[0];

      if (data.room_number && data.room_number.trim() !== existing.room_number) {
        const dup = await client.query('SELECT id FROM rooms WHERE room_number = $1 AND id != $2', [
          data.room_number.trim(),
          id,
        ]);
        if (dup.rows.length > 0) {
          throw new Error(`Room number "${data.room_number.trim()}" is already taken`);
        }
      }

      const roomNumber = data.room_number !== undefined ? data.room_number.trim() : existing.room_number;
      const floor = data.floor !== undefined ? data.floor.trim() : existing.floor;
      const roomTypeId = data.room_type_id !== undefined ? data.room_type_id : existing.room_type_id;
      const operationalStatus = data.operational_status !== undefined ? data.operational_status : existing.operational_status;
      const bedCount = data.bed_count !== undefined ? Number(data.bed_count) : (existing.bed_count || 1);
      const isActive = data.is_active !== undefined ? data.is_active : existing.is_active;

      const res = await client.query(
        `UPDATE rooms 
         SET room_number = $1, floor = $2, room_type_id = $3, operational_status = $4, bed_count = $5, is_active = $6, updated_at = NOW()
         WHERE id = $7
         RETURNING *`,
        [roomNumber, floor, roomTypeId, operationalStatus, bedCount, isActive, id]
      );

      // Recompute inventory for both old and new room_type if changed
      await client.query(
        `UPDATE room_types 
         SET total_inventory = (SELECT COUNT(*) FROM rooms WHERE room_type_id = $1 AND is_active = true)
         WHERE id = $1`,
        [existing.room_type_id]
      );
      if (existing.room_type_id !== roomTypeId) {
        await client.query(
          `UPDATE room_types 
           SET total_inventory = (SELECT COUNT(*) FROM rooms WHERE room_type_id = $1 AND is_active = true)
           WHERE id = $1`,
          [roomTypeId]
        );
      }

      await client.query('COMMIT');
      return res.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  static async deleteRoom(id: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // Check if room has active allocations
      const activeAlloc = await client.query(
        `SELECT r.reservation_number 
         FROM room_allocations ra
         JOIN reservations r ON ra.reservation_id = r.id
         WHERE ra.room_id = $1 AND ra.status = 'ACTIVE' AND r.status IN ('CONFIRMED', 'CHECKED_IN')
         LIMIT 1`,
        [id]
      );

      if (activeAlloc.rows.length > 0) {
        throw new Error(
          `Cannot delete room: It is currently allocated to active reservation #${activeAlloc.rows[0].reservation_number}. Unassign or check out guest first.`
        );
      }

      const room = await client.query('SELECT room_type_id FROM rooms WHERE id = $1', [id]);
      if (room.rows.length === 0) {
        throw new Error('Room not found');
      }
      const roomTypeId = room.rows[0].room_type_id;

      // Also clean up any historical inactive allocations or cascade
      await client.query('DELETE FROM room_allocations WHERE room_id = $1', [id]);
      await client.query('DELETE FROM rooms WHERE id = $1', [id]);

      // Recompute inventory
      await client.query(
        `UPDATE room_types 
         SET total_inventory = (SELECT COUNT(*) FROM rooms WHERE room_type_id = $1 AND is_active = true)
         WHERE id = $1`,
        [roomTypeId]
      );

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  // ── ROOM TYPE REPOSITORY METHODS ────────────────────────────────────────────

  static async findAllRoomTypesWithCounts(): Promise<any[]> {
    const sql = `
      SELECT 
        rt.*,
        COUNT(r.id) AS total_physical_rooms,
        COUNT(CASE WHEN r.is_active = true THEN 1 END) AS active_rooms_count,
        COUNT(CASE WHEN r.operational_status = 'OCCUPIED' THEN 1 END) AS occupied_rooms_count,
        COUNT(CASE WHEN r.operational_status = 'VACANT_CLEAN' THEN 1 END) AS vacant_clean_count
      FROM room_types rt
      LEFT JOIN rooms r ON rt.id = r.room_type_id
      GROUP BY rt.id
      ORDER BY rt.base_price ASC
    `;
    const res = await query(sql);
    return res.rows;
  }

  static async createRoomType(data: {
    code: string;
    name: string;
    description?: string;
    base_occupancy?: number;
    max_occupancy?: number;
    base_price: number;
    color_code?: string;
  }): Promise<any> {
    const code = data.code.trim().toUpperCase().replace(/\s+/g, '_');
    const name = data.name.trim();
    const baseOccupancy = data.base_occupancy || 2;
    const maxOccupancy = data.max_occupancy || Math.max(baseOccupancy, 3);
    const colorCode = data.color_code || '#2563eb';

    const dup = await query('SELECT id FROM room_types WHERE code = $1', [code]);
    if (dup.rows.length > 0) {
      throw new Error(`Room type code "${code}" already exists`);
    }

    const res = await query(
      `INSERT INTO room_types (code, name, description, base_occupancy, max_occupancy, base_price, color_code, is_active, total_inventory)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true, 0)
       RETURNING *`,
      [code, name, data.description || '', baseOccupancy, maxOccupancy, data.base_price, colorCode]
    );
    return res.rows[0];
  }

  static async updateRoomType(
    id: string,
    data: {
      code?: string;
      name?: string;
      description?: string;
      base_occupancy?: number;
      max_occupancy?: number;
      base_price?: number;
      color_code?: string;
      is_active?: boolean;
    }
  ): Promise<any> {
    const existing = await query('SELECT * FROM room_types WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      throw new Error('Room type not found');
    }
    const cur = existing.rows[0];

    const code = data.code !== undefined ? data.code.trim().toUpperCase().replace(/\s+/g, '_') : cur.code;
    const name = data.name !== undefined ? data.name.trim() : cur.name;
    const desc = data.description !== undefined ? data.description : cur.description;
    const baseOcc = data.base_occupancy !== undefined ? data.base_occupancy : cur.base_occupancy;
    const maxOcc = data.max_occupancy !== undefined ? data.max_occupancy : cur.max_occupancy;
    const basePrice = data.base_price !== undefined ? data.base_price : cur.base_price;
    const color = data.color_code !== undefined ? data.color_code : cur.color_code;
    const isActive = data.is_active !== undefined ? data.is_active : cur.is_active;

    if (code !== cur.code) {
      const dup = await query('SELECT id FROM room_types WHERE code = $1 AND id != $2', [code, id]);
      if (dup.rows.length > 0) {
        throw new Error(`Room type code "${code}" already exists`);
      }
    }

    const res = await query(
      `UPDATE room_types
       SET code = $1, name = $2, description = $3, base_occupancy = $4, max_occupancy = $5, base_price = $6, color_code = $7, is_active = $8, updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [code, name, desc, baseOcc, maxOcc, basePrice, color, isActive, id]
    );
    return res.rows[0];
  }

  static async deleteRoomType(id: string): Promise<void> {
    const countRes = await query('SELECT COUNT(*) FROM rooms WHERE room_type_id = $1', [id]);
    const count = parseInt(countRes.rows[0].count, 10);
    if (count > 0) {
      throw new Error(`Cannot delete room type: There are ${count} physical room(s) assigned to this room type. Reassign or delete those rooms first.`);
    }

    await query('DELETE FROM room_types WHERE id = $1', [id]);
  }
}
