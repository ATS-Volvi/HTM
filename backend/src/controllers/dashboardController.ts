// ==========================================================================
// VOLVITECH HOSPITALITY OS — DASHBOARD CONTROLLER (TIER 2: API LAYER)
// ==========================================================================
import { Router } from 'express';
import { DashboardService } from '../services/dashboardService.js';

export const dashboardRouter = Router();

// GET /api/dashboard/metrics - Bento KPIs & 7-Day Matrix
dashboardRouter.get('/metrics', async (req, res) => {
  try {
    const startDate = typeof req.query.startDate === 'string' ? req.query.startDate : undefined;
    const data = await DashboardService.getMetrics(startDate);
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('[DashboardController.getMetrics error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});
