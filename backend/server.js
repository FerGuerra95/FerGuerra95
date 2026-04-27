import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = Number.parseInt(process.env.PORT || '4000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';

const DIST_DIR = path.resolve(__dirname, '../dist');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');
const INDEX_FILE = path.join(DIST_DIR, 'index.html');

function normalizeOrigin(value) {
  if (!value) return null;

  const trimmed = String(value).trim();

  if (!trimmed) return null;

  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed;
}

function parseAllowedOrigins() {
  const developmentOrigins = [
    'http://localhost:4000',
    'http://127.0.0.1:4000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174'
  ];

  const railwayPublicDomain = process.env.RAILWAY_PUBLIC_DOMAIN
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
    : null;

  const envOrigins = [
    process.env.FRONTEND_URL,
    process.env.PUBLIC_APP_URL,
    process.env.CORS_ORIGIN,
    process.env.CORS_ORIGINS,
    process.env.RENDER_EXTERNAL_URL,
    railwayPublicDomain
  ]
    .filter(Boolean)
    .flatMap((value) =>
      String(value)
        .split(',')
        .map((item) => normalizeOrigin(item))
        .filter(Boolean)
    );

  const baseOrigins = IS_PRODUCTION
    ? envOrigins
    : [...developmentOrigins, ...envOrigins];

  return [...new Set(baseOrigins)];
}

function isSameHostOrigin(origin, req) {
  try {
    const originUrl = new URL(origin);
    const requestHost = req.get('host');

    return Boolean(requestHost && originUrl.host === requestHost);
  } catch {
    return false;
  }
}

function createCorsMiddleware() {
  const allowedOrigins = parseAllowedOrigins();

  return (req, res, next) => {
    cors({
      origin(origin, callback) {
        if (!origin) {
          callback(null, true);
          return;
        }

        const normalizedOrigin = normalizeOrigin(origin);

        if (normalizedOrigin && allowedOrigins.includes(normalizedOrigin)) {
          callback(null, true);
          return;
        }

        if (isSameHostOrigin(origin, req)) {
          callback(null, true);
          return;
        }

        callback(new Error(`CORS no permitido para origen: ${origin}`));
      },
      credentials: true
    })(req, res, next);
  };
}

function getDatabasePathFromEnv() {
  return (
    process.env.DB_PATH ||
    process.env.SQLITE_PATH ||
    process.env.SQLITE_DB_PATH ||
    null
  );
}

function ensureDatabaseDirectoryExists() {
  const databasePath = getDatabasePathFromEnv();

  if (!databasePath) return;

  const resolvedDatabasePath = path.resolve(databasePath);
  const databaseDirectory = path.dirname(resolvedDatabasePath);

  fs.mkdirSync(databaseDirectory, { recursive: true });
}

function validateProductionEnvironment() {
  if (!IS_PRODUCTION) return;

  const missingVariables = [];

  if (!process.env.AUTH_SECRET) {
    missingVariables.push('AUTH_SECRET');
  }

  if (!getDatabasePathFromEnv()) {
    missingVariables.push('DB_PATH');
  }

  if (missingVariables.length > 0) {
    throw new Error(
      `Faltan variables de entorno obligatorias en producción: ${missingVariables.join(', ')}`
    );
  }

  if (String(process.env.AUTH_SECRET).length < 32) {
    throw new Error(
      'AUTH_SECRET debe tener al menos 32 caracteres en producción.'
    );
  }
}

function healthHandler(_req, res) {
  const frontendReady = fs.existsSync(INDEX_FILE);
  const assetsReady = fs.existsSync(ASSETS_DIR);

  res.json({
    data: {
      status: 'ok',
      service: 'CEO OS Backend',
      environment: NODE_ENV,
      database: 'sqlite',
      frontend: frontendReady ? 'dist-ready' : 'dist-not-found',
      assets: assetsReady ? 'assets-ready' : 'assets-not-found',
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString()
    },
    meta: {
      version: 1
    },
    error: null
  });
}

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(createCorsMiddleware());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

app.use('/api/auth', authRoutes);

app.use('/api/ma', requireAuth, maRoutes);
app.use('/api/suppliers', requireAuth, suppliersRoutes);
app.use('/api/alerts', requireAuth, alertsRoutes);
app.use('/api/evidence', requireAuth, evidenceRoutes);
app.use('/api/reviews', requireAuth, reviewsRoutes);
app.use('/api/reports', requireAuth, reportsRoutes);

if (fs.existsSync(ASSETS_DIR)) {
  app.use(
    '/assets',
    express.static(ASSETS_DIR, {
      fallthrough: false,
      maxAge: IS_PRODUCTION ? '1y' : 0
    })
  );
}

if (fs.existsSync(DIST_DIR)) {
  app.use(
    express.static(DIST_DIR, {
      fallthrough: true,
      maxAge: IS_PRODUCTION ? '1h' : 0
    })
  );
}

app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path === '/health') {
    return next();
  }

  if (fs.existsSync(INDEX_FILE)) {
    return res.sendFile(INDEX_FILE);
  }

  return next();
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

function startServer() {
  validateProductionEnvironment();
  ensureDatabaseDirectoryExists();
  initializeDatabaseSchema();

  app.listen(PORT, () => {
    const allowedOrigins = parseAllowedOrigins();

    console.log(`🚀 Backend corriendo en puerto ${PORT}`);
    console.log(`🌍 Entorno: ${NODE_ENV}`);
    console.log(
      `🔐 CORS permitido: ${
        allowedOrigins.length > 0
          ? allowedOrigins.join(', ')
          : 'mismo host / sin origen'
      }`
    );
    console.log('🗄️ SQLite schema inicializado');

    if (fs.existsSync(INDEX_FILE)) {
      console.log('📦 Frontend dist detectado y servido por Express');
    } else {
      console.log('⚠️ Frontend dist no encontrado. Ejecuta npm run build');
    }

    if (fs.existsSync(ASSETS_DIR)) {
      console.log('🎨 Assets detectados y servidos por Express');
    } else {
      console.log('⚠️ Assets no encontrados dentro de dist/assets');
    }
  });
}

startServer();