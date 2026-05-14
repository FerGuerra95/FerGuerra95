// @vitest-environment node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

import { buildHttpApp } from '../../../backend/httpApp.js';
import { createMaCase } from '../../../backend/services/ma/cases.service.js';
import { createMaReport } from '../../../backend/services/ma/reports.service.js';
import { createMaSecureShareLink } from '../../../backend/services/ma/secureShare.service.js';
import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import { closeDatabase } from '../../../backend/storage/sqliteStorage.js';

describe('API MA public secure share', () => {
  let app;
  let dbPath;
  let shareId;
  let shareToken;

  beforeAll(async () => {
    dbPath = path.join(os.tmpdir(), `ceos-ma-pub-api-${Date.now()}.sqlite`);
    process.env.DB_PATH = dbPath;
    process.env.AUTH_SECRET = 'ceos-test-auth-secret-xxxxxxxxxxxxxxxx';
    process.env.NODE_ENV = 'development';

    closeDatabase();
    initializeDatabaseSchema();

    const item = await createMaCase({
      name: 'Public share case',
      organizationId: 'org_public_api',
      userId: 'u_pub',
      financials: {
        name: 'Public share case',
        sector: 'Servicios',
        normalizedEbitda: 100000
      },
      settings: {
        reportCurrency: 'EUR',
        evidenceDocuments: []
      }
    });

    const report = await createMaReport({
      organizationId: 'org_public_api',
      userId: 'u_pub',
      caseId: item.id,
      title: 'Report',
      payload: { html: '<p>Hi</p>' }
    });

    const share = await createMaSecureShareLink({
      organizationId: 'org_public_api',
      userId: 'u_pub',
      reportId: report.id,
      expiresInHours: 24
    });

    shareId = share.id;
    shareToken = share.token;

    app = buildHttpApp();
  });

  afterAll(() => {
    closeDatabase();
    delete process.env.DB_PATH;

    if (dbPath && fs.existsSync(dbPath)) {
      try {
        fs.unlinkSync(dbPath);
      } catch {
        //
      }
    }
  });

  it('devuelve el informe sin JWT cuando el token de share es valido', async () => {
    const res = await request(app)
      .get(`/api/ma/public/secure-shares/${encodeURIComponent(shareId)}`)
      .set('X-MA-Share-Token', shareToken);

    expect(res.status).toBe(200);
    expect(res.body?.data?.report?.id).toBeTruthy();
    expect(res.body?.data?.report?.payload?.html).toContain('Hi');
  });

  it('rechaza token incorrecto sin JWT', async () => {
    const res = await request(app)
      .get(`/api/ma/public/secure-shares/${encodeURIComponent(shareId)}`)
      .set('X-MA-Share-Token', 'bad');

    expect(res.status).toBe(403);
    expect(res.body?.error?.code).toBe('SECURE_SHARE_TOKEN_INVALID');
  });
});
