import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildHttpApp } from './httpApp.js';
import { initializeDatabaseSchema } from './storage/databaseSchema.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = buildHttpApp();

const PORT = Number.parseInt(process.env.PORT || '4000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';

const DIST_DIR = path.resolve(__dirname, '../dist');
const INDEX_FILE = path.join(DIST_DIR, 'index.html');

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
  if (process.env.VITE_ENABLE_MA_LOCAL_FALLBACK === 'true') {
    throw new Error(
      'VITE_ENABLE_MA_LOCAL_FALLBACK no puede estar activo en produccion.'
    );
  }

  const issuer = String(process.env.OIDC_ISSUER || '').trim();
  if (issuer) {
    const oidcMissing = [];
    if (!String(process.env.OIDC_CLIENT_ID || '').trim()) {
      oidcMissing.push('OIDC_CLIENT_ID');
    }
    if (!String(process.env.OIDC_CLIENT_SECRET || '').trim()) {
      oidcMissing.push('OIDC_CLIENT_SECRET');
    }
    if (!String(process.env.FRONTEND_URL || '').trim()) {
      oidcMissing.push('FRONTEND_URL');
    }
    if (oidcMissing.length > 0) {
      throw new Error(
        `OIDC_ISSUER está definido pero faltan variables obligatorias para SSO en producción: ${oidcMissing.join(', ')}`
      );
    }
  }
}

function startServer() {
  validateProductionEnvironment();
  ensureDatabaseDirectoryExists();
  initializeDatabaseSchema();

  app.listen(PORT, () => {
    console.log(`🚀 Backend corriendo en puerto ${PORT}`);
    console.log(`🌍 Entorno: ${NODE_ENV}`);
    console.log('🗄️ SQLite schema inicializado');

    if (fs.existsSync(INDEX_FILE)) {
      console.log('📦 Frontend dist detectado y servido por Express');
    } else {
      console.log('⚠️ Frontend dist no encontrado. Ejecuta npm run build');
    }
  });
}

startServer();
