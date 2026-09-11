// ==========================================================================
// VOLVITECH HOSPITALITY OS — FOLIOS & BILLING CONTROLLER (TIER 2: API LAYER)
// ==========================================================================
import { Router } from 'express';
import { BillingService } from '../services/billingService.js';

export const foliosRouter = Router();

// POST /api/reservations/:id/folio-charge - Post Incidental Charge
foliosRouter.post('/:id/folio-charge', async (req, res) => {
  try {
    const { id } = req.params;
    const { category = 'INCIDENTAL', description, amount } = req.body;
    if (!description || !amount) {
      return res.status(400).json({ success: false, error: 'Description and amount are required' });
    }
    const charge = await BillingService.postCharge(id, category, description, parseFloat(amount));
    res.json({ success: true, message: 'Charge posted to folio', data: charge });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});
