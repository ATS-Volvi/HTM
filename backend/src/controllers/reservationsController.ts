// ==========================================================================
// VOLVITECH HOSPITALITY OS — RESERVATIONS CONTROLLER (TIER 2: API LAYER)
// ==========================================================================
import { Router } from 'express';
import { ReservationService } from '../services/reservationService.js';

export const reservationsRouter = Router();

// GET /api/reservations - Search & Filter
reservationsRouter.get('/', async (req, res) => {
  try {
    const { q, status, source, fromDate, toDate } = req.query;
    const data = await ReservationService.searchReservations({
      q: q as string,
      status: status as string,
      source: source as string,
      fromDate: fromDate as string,
      toDate: toDate as string,
    });
    res.json({ success: true, count: data.length, data });
  } catch (err: any) {
    console.error('[ReservationsController.get error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/reservations/:id - Details with Folio Charges
reservationsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await ReservationService.getReservationById(id);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(404).json({ success: false, error: err.message });
  }
});

// POST /api/reservations - Create Booking
reservationsRouter.post('/', async (req, res) => {
  try {
    const data = await ReservationService.createReservation(req.body);
    res.status(201).json({ success: true, data });
  } catch (err: any) {
    console.error('[ReservationsController.create error]', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/reservations/:id/cancel - Cancel Booking
reservationsRouter.post('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const data = await ReservationService.cancelReservation(id, reason || 'Guest requested cancellation');
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});
