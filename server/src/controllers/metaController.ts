// ==========================================================================
// VOLVITECH HOSPITALITY OS — META & LOOKUP CONTROLLER (TIER 2: API LAYER)
// ==========================================================================
import { Router } from 'express';
import { MetaRepository } from '../repositories/metaRepository.js';
import { GuestRepository } from '../repositories/guestRepository.js';

export const metaRouter = Router();

// GET /api/meta - Master Hotel Configuration
metaRouter.get('/', async (_req, res) => {
  try {
    const [roomTypes, ratePlans, bookingSources, rooms] = await Promise.all([
      MetaRepository.getRoomTypes(),
      MetaRepository.getRatePlans(),
      MetaRepository.getBookingSources(),
      MetaRepository.getRooms(),
    ]);

    res.json({
      success: true,
      data: {
        roomTypes,
        ratePlans,
        bookingSources,
        rooms,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/meta/guests/search - Guest Autocomplete
metaRouter.get('/guests/search', async (req, res) => {
  try {
    const q = (req.query.q as string) || '';
    const guests = await GuestRepository.searchGuests(q);
    res.json({ success: true, data: guests });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
