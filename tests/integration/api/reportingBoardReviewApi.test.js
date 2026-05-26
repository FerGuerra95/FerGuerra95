// @vitest-environment node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

import { buildHttpApp } from '../../../backend/httpApp.js';
import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import { closeDatabase } from '../../../backend/storage/sqliteStorage.js';
import {
  createBoardReviewSnapshot,
  listBoardReviewAuditEvents
} from '../../../backend/services/reporting/boardReview.service.js';

let app;
let tempDir = '';
const tokens = {};

function snapshotPayload(overrides = {}) {
  return {
    organizationId: 'malicious_client_org',
    title: 'API Board Review Draft',
    status: 'human_review_required',
    rendererInput: {
      executiveSummary: 'Prepared for human review.',
      moduleSignals: [{ module: 'Reporting', score: null }],
      missingData: ['risk:insufficient_data']
    },
    sourceModules: ['Reporting'],
    missingData: ['risk:insufficient_data'],
    insufficientDataFlags: ['risk:insufficient_data'],
    auditMetadata: { previewOnly: true },
    ...overrides
  };
}

async function login(email, password) {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email, password });
  expect(res.status).toBe(200);
  return res.body.data.token;
}

describe('reporting Board Review API', () => {
  beforeAll(async () => {
    closeDatabase();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-board-review-api-'));
    process.env.DB_PATH = path.join(tempDir, 'test.sqlite');
    process.env.AUTH_SECRET = 'b'.repeat(40);
    process.env.NODE_ENV = 'development';
    delete process.env.CEOS_E2E;

    initializeDatabaseSchema();
    app = buildHttpApp();

    tokens.admin = await login('admin@ceoos.local', 'admin123');
    tokens.user = await login('user@ceoos.local', 'user123');
    tokens.viewer = await login('viewer@ceoos.local', 'viewer123');
  });

  afterAll(() => {
    const dbPath = process.env.DB_PATH;
    closeDatabase();
    delete process.env.DB_PATH;
    if (dbPath && fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('requires authentication', async () => {
    const res = await request(app).get('/api/reporting/board-review-snapshots');
    expect(res.status).toBe(401);
  });

  it('creates snapshots with session tenant and ignores malicious body organizationId', async () => {
    const res = await request(app)
      .post('/api/reporting/board-review-snapshots')
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send(snapshotPayload());

    expect(res.status).toBe(201);
    expect(res.body.data.organizationId).toBe('org_demo');
    expect(res.body.data.organizationId).not.toBe('malicious_client_org');
    expect(res.body.data.status).toBe('human_review_required');
    expect(res.body.data.rendererInput.moduleSignals[0].score).toBeNull();
  });

  it('blocks cross-tenant reads', async () => {
    const created = await request(app)
      .post('/api/reporting/board-review-snapshots')
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send(snapshotPayload({ title: 'Cross Tenant' }));

    const crossRead = await request(app)
      .get(`/api/reporting/board-review-snapshots/${created.body.data.id}`)
      .set('Authorization', `Bearer ${tokens.user}`);

    expect(crossRead.status).toBe(404);
  });

  it('lets viewer read own tenant snapshots but blocks review transitions', async () => {
    const ownViewerSnapshot = await createBoardReviewSnapshot({
      organizationId: 'org_demo_3',
      actor: { userId: 'setup', role: 'admin' },
      payload: snapshotPayload({ title: 'Viewer Readable' })
    });

    const read = await request(app)
      .get(`/api/reporting/board-review-snapshots/${ownViewerSnapshot.id}`)
      .set('Authorization', `Bearer ${tokens.viewer}`);

    const markReviewed = await request(app)
      .post(`/api/reporting/board-review-snapshots/${ownViewerSnapshot.id}/mark-reviewed`)
      .set('Authorization', `Bearer ${tokens.viewer}`)
      .send({ reviewMetadata: { reviewedAt: '2026-05-26T10:00:00.000Z' } });

    expect(read.status).toBe(200);
    expect(markReviewed.status).toBe(403);
  });

  it('creates audit metadata on reviewed and gates internal_final', async () => {
    const created = await request(app)
      .post('/api/reporting/board-review-snapshots')
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send(snapshotPayload({ title: 'Workflow API' }));

    const snapshotId = created.body.data.id;

    const blockedFinal = await request(app)
      .post(`/api/reporting/board-review-snapshots/${snapshotId}/mark-internal-final`)
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send({ approvalMetadata: { explicitApproval: true } });

    const reviewed = await request(app)
      .post(`/api/reporting/board-review-snapshots/${snapshotId}/mark-reviewed`)
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send({ reviewMetadata: { reviewedAt: '2026-05-26T10:00:00.000Z' } });

    const finalized = await request(app)
      .post(`/api/reporting/board-review-snapshots/${snapshotId}/mark-internal-final`)
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send({ approvalMetadata: { explicitApproval: true } });

    const auditEvents = await listBoardReviewAuditEvents({
      organizationId: 'org_demo',
      snapshotId
    });

    expect(blockedFinal.status).toBe(409);
    expect(reviewed.status).toBe(200);
    expect(reviewed.body.data.status).toBe('reviewed');
    expect(finalized.status).toBe(200);
    expect(finalized.body.data.status).toBe('internal_final');
    expect(auditEvents.map((event) => event.eventType)).toContain(
      'board_review.workflow.reviewed'
    );
    expect(auditEvents.map((event) => event.result)).toContain('blocked');
  });

  it('blocks revoked snapshots from finalization', async () => {
    const created = await request(app)
      .post('/api/reporting/board-review-snapshots')
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send(snapshotPayload({ title: 'Revoked API' }));
    const snapshotId = created.body.data.id;

    const revoked = await request(app)
      .post(`/api/reporting/board-review-snapshots/${snapshotId}/revoke`)
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send({});

    const final = await request(app)
      .post(`/api/reporting/board-review-snapshots/${snapshotId}/mark-internal-final`)
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send({ approvalMetadata: { explicitApproval: true } });

    expect(revoked.status).toBe(200);
    expect(revoked.body.data.status).toBe('revoked');
    expect(final.status).toBe(409);
  });

  it('rejects board-approved status and omits secrets from API responses', async () => {
    const invalid = await request(app)
      .post('/api/reporting/board-review-snapshots')
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send(snapshotPayload({ status: 'board_approved' }));

    const withSecret = await request(app)
      .post('/api/reporting/board-review-snapshots')
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send({
        ...snapshotPayload({ title: 'Secret API' }),
        auditMetadata: { safe: 'ok', token: 'should-not-pass' }
      });

    expect(invalid.status).toBe(400);
    expect(withSecret.status).toBe(400);
    expect(JSON.stringify(withSecret.body)).not.toContain('should-not-pass');
  });
});
