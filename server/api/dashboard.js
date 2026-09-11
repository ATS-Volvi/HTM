// ==========================================================================
// VOLVITECH HOSPITALITY OS — DASHBOARD METRICS & 7-DAY AVAILABILITY
// ==========================================================================
import express from 'express';
import { query } from '../db/index.js';

export const dashboardRouter = express.Router();

dashboardRouter.get('/metrics', async (req, res) => {
  try {
    // 1. Arrivals Today
    const arrivalsRes = await query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'CHECKED_IN') as checked_in,
        COUNT(*) as total_expected
      FROM reservations
      WHERE check_in_date = CURRENT_DATE AND status IN ('CONFIRMED', 'CHECKED_IN')
    `);
    const arrivals = arrivalsRes.rows[0];

    // 2. Departures Today
    const departuresRes = await query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'CHECKED_OUT') as cleared,
        COUNT(*) as total_expected
      FROM reservations
      WHERE check_out_date = CURRENT_DATE AND status IN ('CHECKED_IN', 'CHECKED_OUT')
    `);
    const departures = departuresRes.rows[0];

    // 3. Occupancy
    const roomsRes = await query(`
      SELECT 
        COUNT(*) as total_rooms,
        COUNT(*) FILTER (WHERE operational_status = 'OCCUPIED') as occupied_rooms
      FROM rooms WHERE is_active = TRUE
    `);
    const totalRooms = parseInt(roomsRes.rows[0].total_rooms, 10) || 1;
    const occupiedRooms = parseInt(roomsRes.rows[0].occupied_rooms, 10) || 0;
    const occupancyPct = Math.round((occupiedRooms / totalRooms) * 100);

    // 4. In-House Guests
    const inHouseRes = await query(`
      SELECT 
        COALESCE(SUM(adults + children), 0) as total_guests,
        COUNT(DISTINCT r.id) as in_house_rooms
      FROM reservations r
      WHERE r.status = 'CHECKED_IN'
    `);
    const inHouse = inHouseRes.rows[0];

    // 5. 7-Day Room Availability Grid
    // Generate dates for the next 7 days
    const datesRes = await query(`
      SELECT 
        generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '6 days', '1 day')::date as day_date,
        to_char(generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '6 days', '1 day')::date, 'Dy, DD') as day_label
    `);
    const days = datesRes.rows;

    const roomTypesRes = await query(`
      SELECT id, name, code, total_inventory, color_code FROM room_types WHERE is_active = TRUE ORDER BY base_price ASC
    `);
    const roomTypes = roomTypesRes.rows;

    // Calculate remaining availability for each room type on each day
    const availabilityGrid = [];
    for (const rt of roomTypes) {
      const dayCounts = [];
      for (const day of days) {
        const countRes = await query(`
          SELECT COUNT(*) as booked
          FROM reservations
          WHERE room_type_id = $1
            AND status IN ('CONFIRMED', 'CHECKED_IN')
            AND check_in_date <= $2
            AND check_out_date > $2
        `, [rt.id, day.day_date]);

        const booked = parseInt(countRes.rows[0].booked, 10);
        const available = Math.max(0, rt.total_inventory - booked);
        dayCounts.push({
          date: day.day_date,
          dayLabel: day.day_label,
          available,
          total: rt.total_inventory,
          isLow: available <= 2 && available > 0,
          isSoldOut: available === 0
        });
      }

      availabilityGrid.push({
        roomTypeId: rt.id,
        categoryName: rt.name,
        code: rt.code,
        colorCode: rt.colorCode || '#1a2b3c',
        days: dayCounts
      });
    }

    res.json({
      success: true,
      data: {
        metrics: {
          arrivals: {
            actual: parseInt(arrivals.checked_in, 10),
            expected: parseInt(arrivals.total_expected, 10)
          },
          departures: {
            cleared: parseInt(departures.cleared, 10),
            expected: parseInt(departures.total_expected, 10)
          },
          occupancy: {
            percentage: occupancyPct,
            occupied: occupiedRooms,
            total: totalRooms
          },
          inHouse: {
            guests: parseInt(inHouse.total_guests, 10),
            rooms: parseInt(inHouse.in_house_rooms, 10)
          }
        },
        days: days.map(d => d.day_label),
        availabilityGrid
      }
    });
  } catch (err) {
    console.error('[Dashboard Metrics error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});
