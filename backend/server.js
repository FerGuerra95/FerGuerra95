import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './api/routes/auth.routes.js';
import maRoutes from './api/routes/ma.routes.js';
import suppliersRoutes from './api/routes/suppliers.routes.js';
import alertsRoutes from './api/routes/alerts.routes.js';
import evidenceRoutes from './api/routes/evidence.routes.js';
import reviewsRoutes from './api/routes/reviews.routes.js';
import reportsRoutes from './api/routes/reports.routes.js';

import { requireAuth } from './api/middlewares/auth.middleware.js';
import { notFoundMiddleware } from './api/middlewares/notFound.middleware.js';
import { errorMiddleware } from './api/middlewares/error.middleware.js';

import { initializeDatabaseSchema } from './storage/databaseSchema.js';

dotenv.config();

initializeDatabaseSchema();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5174'
    ],
    credentials: true
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({
    data: {
      status: 'ok',
      service: 'CEO OS Backend',
      database: 'sqlite',
      timestamp: new Date().toISOString()
    },
    meta: { version: 1 },
    error: null
  });
});

app.use('/api/auth', authRoutes);

app.use('/api/ma', requireAuth, maRoutes);
app.use('/api/suppliers', requireAuth, suppliersRoutes);
app.use('/api/alerts', requireAuth, alertsRoutes);
app.use('/api/evidence', requireAuth, evidenceRoutes);
app.use('/api/reviews', requireAuth, reviewsRoutes);
app.use('/api/reports', requireAuth, reportsRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
  console.log('🗄️ SQLite schema inicializado');
});