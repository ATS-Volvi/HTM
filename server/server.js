// ==========================================================================
// VOLVITECH HOSPITALITY OS — BACKEND API SERVER
// ==========================================================================
import express from 'express';
import cors from 'cors';
import { reservationsRouter } from './api/reservations.js';
import { dashboardRouter } from './api/dashboard.js';
import { metaRouter } from './api/meta.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Volvitech Hospitality OS API', timestamp: new Date() });
});

// Mount Routes
app.use('/api/reservations', reservationsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/meta', metaRouter);

app.listen(PORT, () => {
  console.log(`[Volvitech OS] API server running on http://localhost:${PORT}`);
});
