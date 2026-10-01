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

describe('Compliance API boundary', () => {
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

  it('requires authentication for supplier, alert, evidence and report reads', async () => {
    const suppliers = await request(app).get('/api/suppliers');
    const alerts = await request(app).get('/api/alerts');
    const evidence = await request(app).get('/api/evidence');
    const reports = await request(app).get('/api/reports');

    expect(suppliers.status).toBe(401);
    expect(alerts.status).toBe(401);
    expect(evidence.status).toBe(401);
    expect(reports.status).toBe(401);
  });

  it('creates and reads supplier, alert, evidence and report records in the session organization', async () => {
    const supplier = await request(app)
      .post('/api/suppliers')
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send({
        organizationId: 'malicious_client_org',
        name: 'Isolated Compliance Supplier',
        country: 'ES',
        region: 'Europa'
      });

    expect(supplier.status).toBe(201);
    expect(supplier.body.data.organizationId).toBe('org_demo');
    expect(supplier.body.data.organizationId).not.toBe('malicious_client_org');

    const supplierId = supplier.body.data.id;
    const listedSuppliers = await request(app)
      .get('/api/suppliers')
      .set('Authorization', `Bearer ${tokens.admin}`);

    expect(listedSuppliers.status).toBe(200);
    expect(listedSuppliers.body.data.items.map((item) => item.id)).toContain(
      supplierId
    );

    const alert = await request(app)
      .post('/api/alerts')
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send({
        supplierId,
        title: 'Isolated compliance alert',
        severity: 'high',
        category: 'Legal Risk'
      });

    expect(alert.status).toBe(201);
    expect(alert.body.data.organizationId).toBe('org_demo');
    expect(alert.body.data.supplierId).toBe(supplierId);

    const evidence = await request(app)
      .post('/api/evidence')
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send({
        supplierId,
        alertId: alert.body.data.id,
        title: 'Isolated supplier evidence',
        sourceType: 'audit',
        confidence: 0.9,
        excerpt: 'Isolated audit excerpt.'
      });

    expect(evidence.status).toBe(201);
    expect(evidence.body.data.organizationId).toBe('org_demo');
    expect(evidence.body.data.supplierId).toBe(supplierId);

    const report = await request(app)
      .post('/api/reports/compliance')
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send({
        supplierId,
        title: 'Isolated supplier compliance report'
      });

    expect(report.status).toBe(201);
    expect(report.body.data.organizationId).toBe('org_demo');
    expect(report.body.data.supplierId).toBe(supplierId);

    const listedAlerts = await request(app)
      .get('/api/alerts')
      .set('Authorization', `Bearer ${tokens.admin}`);
    const listedEvidence = await request(app)
      .get('/api/evidence')
      .set('Authorization', `Bearer ${tokens.admin}`);
    const listedReports = await request(app)
      .get('/api/reports')
      .set('Authorization', `Bearer ${tokens.admin}`);

    expect(listedAlerts.status).toBe(200);
    expect(listedEvidence.status).toBe(200);
    expect(listedReports.status).toBe(200);
    expect(listedAlerts.body.data.items.map((item) => item.id)).toContain(
      alert.body.data.id
    );
    expect(listedEvidence.body.data.items.map((item) => item.id)).toContain(
      evidence.body.data.id
    );
    expect(listedReports.body.data.items.map((item) => item.id)).toContain(
      report.body.data.id
    );
  });

  it('does not expose a supplier across organizations', async () => {
    const created = await request(app)
      .post('/api/suppliers')
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send({
        name: 'Tenant A Supplier',
        country: 'DE'
      });

    expect(created.status).toBe(201);

    const crossTenantRead = await request(app)
      .get(`/api/suppliers/${created.body.data.id}`)
      .set('Authorization', `Bearer ${tokens.user}`);

    expect(crossTenantRead.status).toBe(404);
  });
});
