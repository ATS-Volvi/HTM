// ==========================================================================
// VOLVITECH HOSPITALITY OS — DASHBOARD SERVICE (TIER 2: BUSINESS LOGIC)
// ==========================================================================
import { query } from '../db/pool.js';
import type { DashboardMetricsDTO } from '../types/entities.js';

export class DashboardService {
  static async getMetrics(startDateStr?: string): Promise<DashboardMetricsDTO> {
    const today = new Date().toISOString().split('T')[0];
    let baseDate: Date;
    if (startDateStr && /^\d{4}-\d{2}-\d{2}$/.test(startDateStr)) {
      const [y, m, d] = startDateStr.split('-').map(Number);
      baseDate = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
    } else {
      const now = new Date();
      baseDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0));
    }

    // 1. Arrivals Today
    const arrivalsRes = await query(
      `SELECT 
         COUNT(*) FILTER (WHERE status = 'CHECKED_IN') AS checked_in,
         COUNT(*) AS count 
       FROM reservations 
       WHERE check_in_date = $1 AND status IN ('CONFIRMED', 'CHECKED_IN')`,
      [today]
    );

    // 2. Departures Today
    const departuresRes = await query(
      `SELECT 
         COUNT(*) FILTER (WHERE status = 'CHECKED_OUT') AS cleared,
         COUNT(*) AS count 
       FROM reservations 
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

    const totalRooms = parseInt(roomsRes.rows[0].total_rooms, 10) || 50;
    const occupiedRooms = parseInt(roomsRes.rows[0].occupied_rooms, 10) || 0;
    const occupancyPct = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    // 5. 7-Day Category Availability Matrix
    const dates: string[] = [];
    const dayLabels: string[] = [];
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowIso = tomorrowDate.toISOString().split('T')[0];

    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setUTCDate(baseDate.getUTCDate() + i);
      const iso = d.toISOString().split('T')[0];
      dates.push(iso);

      if (iso === today) {
        dayLabels.push('Today');
      } else if (iso === tomorrowIso) {
        dayLabels.push('Tomorrow');
      } else {
        dayLabels.push(d.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric' }));
      }
    }

    const categoriesRes = await query(
      `SELECT id, code, name, total_inventory, base_price, color_code 
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

    const availabilityGrid = categories.map((cat, idx) => {
      const rt = categoriesRes.rows[idx];
      return {
        roomTypeId: cat.id,
        categoryName: cat.name,
        code: cat.code,
        colorCode: rt?.color_code || '#1a2b3c',
        days: cat.counts.map((available, dIdx) => ({
          date: dates[dIdx],
          dayLabel: dayLabels[dIdx],
          available,
          total: cat.total,
          isLow: available <= 2 && available > 0,
          isSoldOut: available === 0,
        })),
      };
    });

    const checkedInArrivals = parseInt(arrivalsRes.rows[0].checked_in, 10) || 0;
    const totalArrivals = parseInt(arrivalsRes.rows[0].count, 10) || 0;
    const clearedDepartures = parseInt(departuresRes.rows[0].cleared, 10) || 0;
    const totalDepartures = parseInt(departuresRes.rows[0].count, 10) || 0;

    return {
      arrivalsToday: totalArrivals,
      departuresToday: totalDepartures,
      currentOccupancyPct: occupancyPct,
      inHouseGuests: parseInt(inHouseRes.rows[0].guest_count, 10) || 0,
      totalRooms,
      occupiedRooms,
      availabilityMatrix: {
        dates,
        categories,
      },
      metrics: {
        arrivals: {
          actual: checkedInArrivals,
          expected: totalArrivals,
        },
        departures: {
          cleared: clearedDepartures,
          expected: totalDepartures,
        },
        occupancy: {
          percentage: occupancyPct,
          occupied: occupiedRooms,
          total: totalRooms,
        },
        inHouse: {
          guests: parseInt(inHouseRes.rows[0].guest_count, 10) || 0,
          rooms: occupiedRooms,
        },
      },
      days: dayLabels,
      availabilityGrid,
    };
  }
}
