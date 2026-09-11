// ==========================================================================
// VOLVITECH HOSPITALITY OS — DASHBOARD CONTROLLER (TIER 2: API LAYER)
// ==========================================================================
import { Router } from 'express';
import { DashboardService } from '../services/dashboardService.js';

export const dashboardRouter = Router();

// GET /api/dashboard/metrics - Bento KPIs & 7-Day Matrix
dashboardRouter.get('/metrics', async (_req, res) => {
  try {
    const data = await DashboardService.getMetrics();
    res.json({ success: true, data });
  } catch (err: any) {
    console.error('[DashboardController.getMetrics error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});
