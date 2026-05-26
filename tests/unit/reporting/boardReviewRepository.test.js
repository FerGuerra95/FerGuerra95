import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import { closeDatabase } from '../../../backend/storage/sqliteStorage.js';
import {
  createAuditEvent,
  createSnapshot,
  getSnapshotById,
  listAuditEvents,
  listSnapshots,
  updateSnapshotStatus
} from '../../../backend/services/reporting/boardReview.repository.js';

let tempDir = '';

function basePayload(overrides = {}) {
  return {
    organizationId: 'client_supplied_org',
    title: 'Board Review Draft',
    status: 'human_review_required',
    rendererVersion: 'html_board_review_v1',
    rendererInput: {
      moduleSignals: [{ module: 'Reporting', score: null }],
      missingData: ['risk:insufficient_data']
    },
    sourceModules: ['Reporting'],
    missingData: ['score:insufficient_data'],
    insufficientDataFlags: ['score:insufficient_data'],
    truthfulness: { humanReviewRequired: true },
    ...overrides
  };
}

describe('boardReview.repository', () => {
  beforeAll(() => {
    closeDatabase();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-board-review-repo-'));
    process.env.DB_PATH = path.join(tempDir, 'test.sqlite');
    initializeDatabaseSchema();
  });

  afterAll(() => {
    closeDatabase();
    delete process.env.DB_PATH;
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('creates snapshots with session organization scope and strips client tenant fields', async () => {
    const snapshot = await createSnapshot({
      organizationId: 'org_repo_a',
      actorId: 'u_repo_a',
      payload: basePayload()
    });

    expect(snapshot.organizationId).toBe('org_repo_a');
    expect(snapshot.organizationId).not.toBe('client_supplied_org');
    expect(snapshot.createdBy).toBe('u_repo_a');
    expect(snapshot.rendererInput.moduleSignals[0].score).toBeNull();
    expect(snapshot.insufficientDataFlags).toContain('score:insufficient_data');
  });

  it('lists and gets snapshots by organization only', async () => {
    const own = await createSnapshot({
      organizationId: 'org_repo_scope_a',
      actorId: 'u_a',
      payload: basePayload({ title: 'Own Snapshot' })
    });
    const other = await createSnapshot({
      organizationId: 'org_repo_scope_b',
      actorId: 'u_b',
      payload: basePayload({ title: 'Other Snapshot' })
    });

    const listA = await listSnapshots({ organizationId: 'org_repo_scope_a' });
    expect(listA.map((item) => item.id)).toContain(own.id);
    expect(listA.map((item) => item.id)).not.toContain(other.id);

    await expect(
      getSnapshotById({ organizationId: 'org_repo_scope_a', snapshotId: other.id })
    ).resolves.toBeNull();
  });

  it('updates status within the same organization and records safe audit events', async () => {
    const snapshot = await createSnapshot({
      organizationId: 'org_repo_status',
      actorId: 'u_status',
      payload: basePayload()
    });

    const updated = await updateSnapshotStatus({
      organizationId: 'org_repo_status',
      snapshotId: snapshot.id,
      actorId: 'u_status',
      transition: {
        status: 'reviewed',
        reviewedBy: 'u_status',
        reviewedAt: '2026-05-26T10:00:00.000Z'
      }
    });

    await createAuditEvent({
      organizationId: 'org_repo_status',
      snapshotId: snapshot.id,
      actorId: 'u_status',
      eventType: 'board_review.workflow.reviewed',
      previousStatus: snapshot.status,
      nextStatus: 'reviewed',
      metadata: { safe: true }
    });

    const auditEvents = await listAuditEvents({
      organizationId: 'org_repo_status',
      snapshotId: snapshot.id
    });

    expect(updated.status).toBe('reviewed');
    expect(updated.reviewedBy).toBe('u_status');
    expect(auditEvents[0].eventType).toBe('board_review.workflow.reviewed');
  });
});
