// ==========================================================================
// VOLVITECH HOSPITALITY OS — APPLICATION SERVER (TIER 2 ENTRYPOINT)
// ==========================================================================
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { reservationsRouter } from './controllers/reservationsController.js';
import { checkInRouter } from './controllers/checkInController.js';
import { foliosRouter } from './controllers/foliosController.js';
import { dashboardRouter } from './controllers/dashboardController.js';
import { metaRouter } from './controllers/metaController.js';
import { authRouter } from './controllers/authController.js';
import { roomsRouter, roomTypesRouter } from './controllers/roomsController.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Volvitech Hospitality OS API (Three-Tier TypeScript Engine)',
    architecture: 'Three-Tier (Presentation -> Business Logic Services -> PostgreSQL 18 DAL)',
    timestamp: new Date().toISOString(),
  });
});

// Mount Controllers
app.use('/api/auth', authRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/reservations', checkInRouter);
app.use('/api/reservations', foliosRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/meta', metaRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/room-types', roomTypesRouter);


import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve Frontend Production Assets (Single Origin Deployment)
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Unhandled Server Error]', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[Volvitech OS] Three-Tier TypeScript API Server running on http://127.0.0.1:${PORT}`);
});
