import { createServer as createHttpServer } from 'node:http';
import { createServer as createViteServer } from 'vite';

import { buildHttpApp } from '../backend/httpApp.js';
import { initializeDatabaseSchema } from '../backend/storage/databaseSchema.js';
import { closeDatabase } from '../backend/storage/sqliteStorage.js';
import {
  assertSafeE2eTarget,
  cleanupIsolatedTestEnvironment,
  emitTestProvenance
} from './lib/test-isolation.mjs';

process.env.NODE_ENV = 'test';
process.env.CEOS_E2E = 'true';
process.env.BOOTSTRAP_ADMIN_EMAIL = process.env.BOOTSTRAP_ADMIN_EMAIL || '';
process.env.BOOTSTRAP_ADMIN_PASSWORD = process.env.BOOTSTRAP_ADMIN_PASSWORD || '';
process.env.BOOTSTRAP_USERS_JSON = process.env.BOOTSTRAP_USERS_JSON || '';

const BACKEND_HOST = '127.0.0.1';
const BACKEND_PORT = Number.parseInt(process.env.PORT || '', 10);
const FRONTEND_HOST = '127.0.0.1';
const FRONTEND_PORT = Number.parseInt(
  process.env.CEOS_E2E_FRONTEND_PORT || '',
  10
);
const BASE_URL = `http://${FRONTEND_HOST}:${FRONTEND_PORT}`;
const API_BASE_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}/api`;

if (!Number.isInteger(BACKEND_PORT) || !Number.isInteger(FRONTEND_PORT)) {
  throw new Error('E2E requires explicit backend and frontend ports.');
}

assertSafeE2eTarget({
  baseUrl: BASE_URL,
  apiBaseUrl: API_BASE_URL,
  env: process.env
});

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
  emitTestProvenance({ result: 'SERVER_STARTING' });
  initializeDatabaseSchema();

  backendServer = createHttpServer(app);
  await listen(backendServer, BACKEND_PORT, BACKEND_HOST);

  viteServer = await createViteServer({
    server: {
      host: FRONTEND_HOST,
      port: FRONTEND_PORT,
      strictPort: true,
      hmr: false,
      // E2E does not reload source. A live glob watcher on this tree can
      // abort the process with Windows 0xC0000409 while Playwright writes
      // artifacts. Vite treats null as an explicit disabled watcher.
      watch: null,
      proxy: {
        '/api': {
          target: `http://${BACKEND_HOST}:${BACKEND_PORT}`,
          changeOrigin: false
        }
      }
    }
  });
  await viteServer.listen();

  console.log(`E2E backend ready: http://${BACKEND_HOST}:${BACKEND_PORT}`);
  console.log(`E2E frontend ready: ${BASE_URL}`);
}

async function shutdown() {
  await Promise.allSettled([
    viteServer?.close(),
    closeHttp(backendServer)
  ]);
  closeDatabase();
  emitTestProvenance({ result: 'SERVER_STOPPED' });
  if (process.env.CEOS_TEST_CLEANUP_OWNER === 'server') {
    cleanupIsolatedTestEnvironment(process.env);
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('uncaughtException', (error) => {
  console.error('[e2e-server] UNCAUGHT_EXCEPTION', error);
  closeDatabase();
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('[e2e-server] UNHANDLED_REJECTION', reason);
  closeDatabase();
  process.exit(1);
});

start().catch((error) => {
  console.error('[e2e-server] START_FAILED', error);
  closeDatabase();
  if (process.env.CEOS_TEST_CLEANUP_OWNER === 'server') {
    cleanupIsolatedTestEnvironment(process.env);
  }
  process.exit(1);
});
