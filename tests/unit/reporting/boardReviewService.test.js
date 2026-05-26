import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import { closeDatabase } from '../../../backend/storage/sqliteStorage.js';
import {
  createBoardReviewSnapshot,
  getBoardReviewSnapshot,
  listBoardReviewAuditEvents,
  listBoardReviewSnapshots,
  markBoardReviewInternalFinal,
  markBoardReviewReviewed,
  redactBoardReviewPayload,
  revokeBoardReviewSnapshot
} from '../../../backend/services/reporting/boardReview.service.js';

let tempDir = '';

function payload(overrides = {}) {
  return {
    organizationId: 'malicious_client_org',
    title: 'Executive Board Review Draft',
    status: 'human_review_required',
    rendererInput: {
      executiveSummary: 'Human review required.',
      moduleSignals: [{ module: 'Reporting', score: null }],
      missingData: ['compliance:insufficient_data']
    },
    missingData: ['compliance:insufficient_data'],
    insufficientDataFlags: ['compliance:insufficient_data'],
    auditMetadata: {
      token: 'secret-token',
      cookie: 'session-cookie',
      safe: 'kept'
    },
    ...overrides
  };
}

describe('boardReview.service', () => {
  beforeAll(() => {
    closeDatabase();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-board-review-service-'));
    process.env.DB_PATH = path.join(tempDir, 'test.sqlite');
    initializeDatabaseSchema();
  });

  afterAll(() => {
    closeDatabase();
    delete process.env.DB_PATH;
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('creates tenant-scoped snapshots without trusting client organizationId', async () => {
    const snapshot = await createBoardReviewSnapshot({
      organizationId: 'org_service_a',
      actor: { userId: 'u_service_a', role: 'user' },
      payload: payload()
    });

    expect(snapshot.organizationId).toBe('org_service_a');
    expect(snapshot.organizationId).not.toBe('malicious_client_org');
    expect(snapshot.status).toBe('human_review_required');
    expect(snapshot.rendererInput.moduleSignals[0].score).toBeNull();
    expect(snapshot.rendererInput.moduleSignals[0].score).not.toBe(0);
    expect(snapshot.insufficientDataFlags).toContain('compliance:insufficient_data');
    expect(snapshot.truthfulness.noCertification).toBe(true);
    expect(snapshot.truthfulness.notBoardApproved).toBe(true);
    expect(JSON.stringify(snapshot.auditMetadata)).not.toContain('secret-token');
  });

  it('lists and reads only within the session organization', async () => {
    const own = await createBoardReviewSnapshot({
      organizationId: 'org_service_scope_a',
      actor: { userId: 'u_scope_a', role: 'user' },
      payload: payload({ title: 'Own' })
    });
    const other = await createBoardReviewSnapshot({
      organizationId: 'org_service_scope_b',
      actor: { userId: 'u_scope_b', role: 'user' },
      payload: payload({ title: 'Other' })
    });

    const listA = await listBoardReviewSnapshots({ organizationId: 'org_service_scope_a' });
    expect(listA.map((item) => item.id)).toContain(own.id);
    expect(listA.map((item) => item.id)).not.toContain(other.id);
    await expect(
      getBoardReviewSnapshot({ organizationId: 'org_service_scope_a', snapshotId: other.id })
    ).rejects.toMatchObject({ status: 404 });
  });

  it('gates reviewed and internal_final transitions with human metadata', async () => {
    const snapshot = await createBoardReviewSnapshot({
      organizationId: 'org_service_flow',
      actor: { userId: 'u_flow', role: 'user' },
      payload: payload()
    });

    await expect(
      markBoardReviewInternalFinal({
        organizationId: 'org_service_flow',
        snapshotId: snapshot.id,
        actor: { userId: 'u_flow', role: 'admin' },
        approvalMetadata: { explicitApproval: true }
      })
    ).rejects.toMatchObject({ status: 409 });

    const reviewed = await markBoardReviewReviewed({
      organizationId: 'org_service_flow',
      snapshotId: snapshot.id,
      actor: { userId: 'u_reviewer', role: 'admin' },
      reviewMetadata: { reviewedAt: '2026-05-26T10:00:00.000Z' }
    });
    expect(reviewed.status).toBe('reviewed');
    expect(reviewed.reviewedBy).toBe('u_reviewer');

    const finalized = await markBoardReviewInternalFinal({
      organizationId: 'org_service_flow',
      snapshotId: snapshot.id,
      actor: { userId: 'u_admin', role: 'admin' },
      approvalMetadata: { explicitApproval: true }
    });
    expect(finalized.status).toBe('internal_final');
    expect(finalized.internalFinalBy).toBe('u_admin');
  });

  it('blocks AI actors from reviewed and internal_final', async () => {
    const snapshot = await createBoardReviewSnapshot({
      organizationId: 'org_service_ai',
      actor: { userId: 'u_ai_setup', role: 'user' },
      payload: payload({ status: 'ai_draft' })
    });

    await expect(
      markBoardReviewReviewed({
        organizationId: 'org_service_ai',
        snapshotId: snapshot.id,
        actor: { userId: 'ai_actor', role: 'ai' },
        reviewMetadata: {}
      })
    ).rejects.toMatchObject({ status: 403 });
  });

  it('keeps revoked snapshots from internal_final and records audit events', async () => {
    const snapshot = await createBoardReviewSnapshot({
      organizationId: 'org_service_revoke',
      actor: { userId: 'u_revoke', role: 'user' },
      payload: payload()
    });

    const revoked = await revokeBoardReviewSnapshot({
      organizationId: 'org_service_revoke',
      snapshotId: snapshot.id,
      actor: { userId: 'u_revoke', role: 'admin' }
    });
    expect(revoked.status).toBe('revoked');

    await expect(
      markBoardReviewInternalFinal({
        organizationId: 'org_service_revoke',
        snapshotId: snapshot.id,
        actor: { userId: 'u_revoke', role: 'admin' },
        approvalMetadata: { explicitApproval: true }
      })
    ).rejects.toMatchObject({ status: 409 });

    const events = await listBoardReviewAuditEvents({
      organizationId: 'org_service_revoke',
      snapshotId: snapshot.id
    });
    expect(events.map((event) => event.eventType)).toContain('board_review.workflow.revoked');
  });

  it('rejects invalid and board-approved statuses', async () => {
    await expect(
      createBoardReviewSnapshot({
        organizationId: 'org_service_invalid',
        actor: { userId: 'u_invalid', role: 'user' },
        payload: payload({ status: 'board_approved' })
      })
    ).rejects.toMatchObject({ status: 400 });
  });

  it('redacts secrets recursively', () => {
    const redacted = redactBoardReviewPayload({
      token: 'abc',
      nested: {
        password: 'pw',
        cookie: 'session-cookie',
        safe: 'ok'
      }
    });

    expect(JSON.stringify(redacted)).not.toContain('abc');
    expect(JSON.stringify(redacted)).not.toContain('pw');
    expect(JSON.stringify(redacted)).not.toContain('session-cookie');
    expect(redacted.nested.safe).toBe('ok');
  });
});
