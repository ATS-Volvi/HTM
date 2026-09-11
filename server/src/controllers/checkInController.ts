// ==========================================================================
// VOLVITECH HOSPITALITY OS — CHECK-IN & ALLOCATION CONTROLLER (TIER 2: API LAYER)
// ==========================================================================
import { Router } from 'express';
import { AllocationService } from '../services/allocationService.js';
import { CheckInService } from '../services/checkInService.js';
import { BillingService } from '../services/billingService.js';

export const checkInRouter = Router();

// POST /api/reservations/:id/allocate-room - Allocate or Change Room
checkInRouter.post('/:id/allocate-room', async (req, res) => {
  try {
    const { id } = req.params;
    const { roomId } = req.body;
    if (!roomId) {
      return res.status(400).json({ success: false, error: 'Room ID is required' });
    }
    const room = await AllocationService.allocatePhysicalRoom(id, roomId);
    res.json({ success: true, room });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/reservations/:id/check-in - Complete Check-in & Key Issuance
checkInRouter.post('/:id/check-in', async (req, res) => {
  try {
    const { id } = req.params;
    const { roomId } = req.body;
    const data = await CheckInService.checkInGuest(id, roomId);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/reservations/:id/check-out - Settle & Check-out
checkInRouter.post('/:id/check-out', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await BillingService.checkOutGuest(id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});
