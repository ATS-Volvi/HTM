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
}
