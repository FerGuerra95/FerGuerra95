import dotenv from 'dotenv';
import { createServer as createHttpServer } from 'node:http';
import { createServer as createViteServer } from 'vite';

import { buildHttpApp } from '../backend/httpApp.js';
import { initializeDatabaseSchema } from '../backend/storage/databaseSchema.js';
import { closeDatabase } from '../backend/storage/sqliteStorage.js';

dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.CEOS_E2E = process.env.CEOS_E2E || 'true';
process.env.BOOTSTRAP_ADMIN_EMAIL = process.env.BOOTSTRAP_ADMIN_EMAIL || '';
process.env.BOOTSTRAP_ADMIN_PASSWORD = process.env.BOOTSTRAP_ADMIN_PASSWORD || '';
process.env.BOOTSTRAP_USERS_JSON = process.env.BOOTSTRAP_USERS_JSON || '';

const BACKEND_HOST = '127.0.0.1';
const BACKEND_PORT = Number.parseInt(process.env.PORT || '4000', 10);
const FRONTEND_HOST = '127.0.0.1';
const FRONTEND_PORT = Number.parseInt(process.env.CEOS_E2E_FRONTEND_PORT || '5173', 10);

const app = buildHttpApp();
let backendServer = null;
let viteServer = null;

function listen(server, port, host) {
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => {
      server.off('error', reject);
      resolve();
    });
  });
}

function closeHttp(server) {
  if (!server) return Promise.resolve();
  return new Promise((resolve) => server.close(() => resolve()));
}

async function start() {
  initializeDatabaseSchema();

  backendServer = createHttpServer(app);
  await listen(backendServer, BACKEND_PORT, BACKEND_HOST);

  viteServer = await createViteServer({
    server: {
      host: FRONTEND_HOST,
      port: FRONTEND_PORT,
      strictPort: true
    }
  });
  await viteServer.listen();

  console.log(`E2E backend ready: http://${BACKEND_HOST}:${BACKEND_PORT}`);
  console.log(`E2E frontend ready: http://${FRONTEND_HOST}:${FRONTEND_PORT}`);
}

async function shutdown() {
  await Promise.allSettled([
    viteServer?.close(),
    closeHttp(backendServer)
  ]);
  closeDatabase();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

start().catch((error) => {
  console.error(error);
  closeDatabase();
  process.exit(1);
});
