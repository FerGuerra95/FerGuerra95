import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import authRoutes from './api/routes/auth.routes.js';
import maPublicRoutes from './api/routes/maPublic.routes.js';
import maRoutes from './api/routes/ma.routes.js';
import suppliersRoutes from './api/routes/suppliers.routes.js';
import alertsRoutes from './api/routes/alerts.routes.js';
import evidenceRoutes from './api/routes/evidence.routes.js';
import reviewsRoutes from './api/routes/reviews.routes.js';
import reportsRoutes from './api/routes/reports.routes.js';
import complianceRoutes from './api/routes/compliance.routes.js';
import fundingRoutes from './api/routes/funding.routes.js';
import pmiRoutes from './api/routes/pmi.routes.js';
import ecosystemRoutes from './api/routes/ecosystem.routes.js';
import bridgeRoutes from './api/routes/bridge.routes.js';
import governanceRoutes from './api/routes/governance.routes.js';
import heritageRoutes from './api/routes/heritage.routes.js';
import riskRoutes from './api/routes/risk.routes.js';

import { requireAuth } from './api/middlewares/auth.middleware.js';
import { notFoundMiddleware } from './api/middlewares/notFound.middleware.js';
import { errorMiddleware } from './api/middlewares/error.middleware.js';
import {
  createRateLimiter,
  requestIdMiddleware,
  securityHeadersMiddleware
} from './api/middlewares/security.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const IS_E2E = process.env.CEOS_E2E === 'true';

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

function healthHandler(req, res) {
  const frontendReady = fs.existsSync(INDEX_FILE);
  const assetsReady = fs.existsSync(ASSETS_DIR);
  const isDetailedHealth = req.path === '/api/health' && !IS_PRODUCTION;

  res.json({
    data: {
      status: 'ok',
      service: 'CEO OS Backend',
      ...(isDetailedHealth
        ? {
            environment: NODE_ENV,
            database: 'sqlite',
            frontend: frontendReady ? 'dist-ready' : 'dist-not-found',
            assets: assetsReady ? 'assets-ready' : 'assets-not-found',
            uptimeSeconds: Math.round(process.uptime())
          }
        : {}),
      timestamp: new Date().toISOString()
    },
    meta: {
      requestId: req.requestId,
      version: 1
    },
    error: null
  });
}

/**
 * Construye la app Express (sin listen). Útil para tests y para server.js.
 */
export function buildHttpApp() {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(requestIdMiddleware);
  app.use(securityHeadersMiddleware);
  app.use(createCorsMiddleware());

  app.use(
    '/api',
    createRateLimiter({
      windowMs: 60_000,
      max: IS_E2E ? 2000 : 240,
      code: 'API_RATE_LIMITED',
      message: 'Demasiadas solicitudes a la API. Intentalo de nuevo en breve.'
    })
  );

  app.use(
    '/api/auth/login',
    createRateLimiter({
      windowMs: 15 * 60_000,
      max: IS_E2E ? 500 : 20,
      code: 'AUTH_RATE_LIMITED',
      message: 'Demasiados intentos de login. Espera unos minutos.'
    })
  );

  app.use(
    '/api/auth/password-reset',
    createRateLimiter({
      windowMs: 60 * 60_000,
      max: IS_E2E ? 500 : 10,
      code: 'PASSWORD_RESET_RATE_LIMITED',
      message:
        'Demasiadas solicitudes de recuperación de contraseña. Inténtalo más tarde.'
    })
  );

  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/ma/public', maPublicRoutes);

  app.get('/health', healthHandler);
  app.get('/api/health', healthHandler);

  app.use('/api/auth', authRoutes);

  app.use('/api/ma', requireAuth, maRoutes);
  app.use('/api/suppliers', requireAuth, suppliersRoutes);
  app.use('/api/alerts', requireAuth, alertsRoutes);
  app.use('/api/evidence', requireAuth, evidenceRoutes);
  app.use('/api/reviews', requireAuth, reviewsRoutes);
  app.use('/api/reports', requireAuth, reportsRoutes);
  app.use('/api/compliance', requireAuth, complianceRoutes);
  app.use('/api/funding', requireAuth, fundingRoutes);
  app.use('/api/pmi', requireAuth, pmiRoutes);
  app.use('/api/ecosystem', requireAuth, ecosystemRoutes);
  app.use('/api/bridge', requireAuth, bridgeRoutes);
  app.use('/api/governance', requireAuth, governanceRoutes);
  app.use('/api/heritage', requireAuth, heritageRoutes);
  app.use('/api/risk', requireAuth, riskRoutes);

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

  return app;
}
