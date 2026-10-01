// @vitest-environment node

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

import { buildHttpApp } from '../../../backend/httpApp.js';
import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import { closeDatabase } from '../../../backend/storage/sqliteStorage.js';

let app;
const tokens = {};

async function login(email, password) {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email, password });

  expect(response.status).toBe(200);
  return response.body.data.token;
}

describe('M&A API boundary', () => {
  beforeAll(async () => {
    closeDatabase();
    initializeDatabaseSchema();
    app = buildHttpApp();
    tokens.admin = await login('admin@ceoos.local', 'admin123');
    tokens.user = await login('user@ceoos.local', 'user123');
  });

  afterAll(() => {
    closeDatabase();
  });

  it('requires authentication for case reads', async () => {
    const response = await request(app).get('/api/ma/cases');
    expect(response.status).toBe(401);
  });

  it('creates, reads and exports a case within the session organization', async () => {
    const created = await request(app)
      .post('/api/ma/cases')
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send({
        organizationId: 'malicious_client_org',
        name: 'Isolated API Case',
        status: 'draft',
        financials: {
          name: 'Isolated API Case',
          sector: 'Industrial',
          revenue: 12_000_000,
          ebitda: 1_800_000
        },
        settings: {
          humanReviewRequired: true
        }
      });

    expect(created.status).toBe(201);
    expect(created.body.data.organizationId).toBe('org_demo');
    expect(created.body.data.organizationId).not.toBe('malicious_client_org');

    const caseId = created.body.data.id;
    const ownRead = await request(app)
      .get(`/api/ma/cases/${caseId}`)
      .set('Authorization', `Bearer ${tokens.admin}`);

    expect(ownRead.status).toBe(200);
    expect(ownRead.body.data.id).toBe(caseId);

    const exported = await request(app)
      .post('/api/ma/reports/export')
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send({
        caseId,
        title: 'Isolated API Report',
        status: 'generated',
        payload: {
          humanReviewRequired: true,
          source: 'integration_test'
        }
      });

    expect(exported.status).toBe(201);
    expect(exported.body.data.caseId).toBe(caseId);

    const listedReports = await request(app)
      .get('/api/ma/reports')
      .set('Authorization', `Bearer ${tokens.admin}`);

    expect(listedReports.status).toBe(200);
    expect(listedReports.body.data.items.map((item) => item.id)).toContain(
      exported.body.data.id
    );
  });

  it('does not expose a case across organizations', async () => {
    const created = await request(app)
      .post('/api/ma/cases')
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send({
        name: 'Tenant A Case',
        financials: {
          name: 'Tenant A Case',
          sector: 'Technology'
        }
      });

    const crossTenantRead = await request(app)
      .get(`/api/ma/cases/${created.body.data.id}`)
      .set('Authorization', `Bearer ${tokens.user}`);

    expect(crossTenantRead.status).toBe(404);
  });
});
