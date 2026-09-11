// ==========================================================================
// VOLVITECH HOSPITALITY OS — META REPOSITORY (TIER 3: DATA ACCESS)
// ==========================================================================
import { query } from '../db/pool.js';
import type { RoomTypeEntity, RatePlanEntity, BookingSourceEntity, RoomEntity } from '../types/entities.js';

export class MetaRepository {
  static async getRoomTypes(): Promise<RoomTypeEntity[]> {
    const res = await query<RoomTypeEntity>(
      `SELECT * FROM room_types WHERE is_active = true ORDER BY base_price ASC`
    );
    return res.rows;
  }

  static async getRatePlans(): Promise<RatePlanEntity[]> {
    const res = await query<RatePlanEntity>(
      `SELECT * FROM rate_plans WHERE is_active = true ORDER BY name ASC`
    );
    return res.rows;
  }

  static async getBookingSources(): Promise<BookingSourceEntity[]> {
    const res = await query<BookingSourceEntity>(
      `SELECT * FROM booking_sources WHERE is_active = true ORDER BY name ASC`
    );
    return res.rows;
  }

  static async getRooms(): Promise<RoomEntity[]> {
    const res = await query<RoomEntity>(
      `SELECT * FROM rooms WHERE is_active = true ORDER BY floor ASC, room_number ASC`
    );
    return res.rows;
  }
}
