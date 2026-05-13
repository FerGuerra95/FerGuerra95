// @vitest-environment node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

import { buildHttpApp } from '../../../backend/httpApp.js';
import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import { closeDatabase } from '../../../backend/storage/sqliteStorage.js';

describe('Health y cabeceras de seguridad', () => {
  let app;

  beforeAll(async () => {
    const tmp = path.join(os.tmpdir(), `ceos-health-${Date.now()}.sqlite`);
    process.env.DB_PATH = tmp;
    process.env.AUTH_SECRET = 'b'.repeat(40);
    process.env.NODE_ENV = 'development';
    delete process.env.CEOS_E2E;

    closeDatabase();
    initializeDatabaseSchema();
    app = buildHttpApp();
  });

  afterAll(() => {
    const dbPath = process.env.DB_PATH;
    closeDatabase();
    if (dbPath && fs.existsSync(dbPath)) {
      try {
        fs.unlinkSync(dbPath);
      } catch {
        // ignore
      }
    }
  });

  it('/health expone cabeceras de endurecimiento basicas', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('DENY');
    expect(res.headers['referrer-policy']).toBeTruthy();
    expect(String(res.headers['content-security-policy'] || '')).toContain(
      "default-src 'self'"
    );
  });
});
