// ==========================================================================
// VOLVITECH HOSPITALITY OS — DASHBOARD SERVICE (TIER 2: BUSINESS LOGIC)
// ==========================================================================
import { query } from '../db/pool.js';
import type { DashboardMetricsDTO } from '../types/entities.js';

export class DashboardService {
  static async getMetrics(): Promise<DashboardMetricsDTO> {
    const today = new Date().toISOString().split('T')[0];

    // 1. Arrivals Today
    const arrivalsRes = await query(
      `SELECT COUNT(*) AS count FROM reservations 
       WHERE check_in_date = $1 AND status IN ('CONFIRMED', 'CHECKED_IN')`,
      [today]
    );

    // 2. Departures Today
    const departuresRes = await query(
      `SELECT COUNT(*) AS count FROM reservations 
       WHERE check_out_date = $1 AND status IN ('CHECKED_IN', 'CHECKED_OUT')`,
      [today]
    );

    // 3. In-House Occupancy
    const roomsRes = await query(
      `SELECT 
         COUNT(*) AS total_rooms,
         COUNT(*) FILTER (WHERE operational_status = 'OCCUPIED') AS occupied_rooms
       FROM rooms WHERE is_active = true`
    );

    // 4. In-House Guests Count
    const inHouseRes = await query(
      `SELECT COALESCE(SUM(adults + children), 0) AS guest_count 
       FROM reservations 
       WHERE status = 'CHECKED_IN'`
    );

    const totalRooms = parseInt(roomsRes.rows[0].total_rooms, 10) || 1;
    const occupiedRooms = parseInt(roomsRes.rows[0].occupied_rooms, 10) || 0;
    const occupancyPct = Math.round((occupiedRooms / totalRooms) * 100);

    // 5. 7-Day Category Availability Matrix
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }

    const categoriesRes = await query(
      `SELECT id, code, name, total_inventory, base_price 
       FROM room_types WHERE is_active = true 
       ORDER BY base_price ASC`
    );

    const categories = await Promise.all(
      categoriesRes.rows.map(async (cat: any) => {
        const counts: number[] = [];
        const rates: number[] = [];
        const baseRate = parseFloat(cat.base_price) || 280.00;

        for (const targetDate of dates) {
          const bookedRes = await query(
            `SELECT COUNT(*) AS booked 
             FROM reservations 
             WHERE room_type_id = $1 
               AND status IN ('CONFIRMED', 'CHECKED_IN')
               AND check_in_date <= $2 
               AND check_out_date > $2`,
            [cat.id, targetDate]
          );

          const booked = parseInt(bookedRes.rows[0].booked, 10) || 0;
          const remaining = Math.max(0, cat.total_inventory - booked);
          counts.push(remaining);
          rates.push(baseRate);
        }

        return {
          id: cat.id,
          code: cat.code,
          name: cat.name,
          total: cat.total_inventory,
          rates,
          counts,
        };
      })
    );

    return {
      arrivalsToday: parseInt(arrivalsRes.rows[0].count, 10) || 0,
      departuresToday: parseInt(departuresRes.rows[0].count, 10) || 0,
      currentOccupancyPct: occupancyPct,
      inHouseGuests: parseInt(inHouseRes.rows[0].guest_count, 10) || 0,
      totalRooms,
      occupiedRooms,
      availabilityMatrix: {
        dates,
        categories,
      },
    };
  }
}
