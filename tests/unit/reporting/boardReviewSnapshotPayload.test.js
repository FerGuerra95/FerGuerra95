import { describe, expect, it } from 'vitest';

import {
  buildCreateBoardReviewSnapshotPayload,
  sanitizeBoardReviewSnapshotPayload,
  stripClientTenantFields,
  stripSensitiveSnapshotFields
} from '../../../src/modules/reporting/utils/boardReviewSnapshotPayload.js';

function boardPack() {
  return {
    id: 'bp_1',
    organizationId: 'client_org',
    title: 'Board Pack Snapshot',
    status: 'draft',
    completenessScore: null,
    sourceModules: ['Reporting'],
    executiveSummary: 'Prepared for review.',
    missingData: ['risk:insufficient_data'],
    moduleSignals: [{ module: 'Reporting', label: 'Completeness', score: null }]
  };
}

describe('boardReviewSnapshotPayload', () => {
  it('builds create payload without client tenant fields', () => {
    const payload = buildCreateBoardReviewSnapshotPayload({
      boardPack: boardPack(),
      generatedAt: '2026-05-26T10:00:00.000Z'
    });

    expect(payload.title).toBe('Board Pack Snapshot');
    expect(payload.organizationId).toBeUndefined();
    expect(payload.orgId).toBeUndefined();
    expect(payload.tenantId).toBeUndefined();
    expect(payload.rendererInput).toBeTruthy();
  });

  it('strips sensitive keys recursively', () => {
    const sanitized = sanitizeBoardReviewSnapshotPayload({
      token: 'abc',
      nested: {
        cookie: 'cookie',
        password: 'pw',
        safe: 'ok'
      }
    });

    expect(JSON.stringify(sanitized)).not.toContain('abc');
    expect(JSON.stringify(sanitized)).not.toContain('cookie');
    expect(JSON.stringify(sanitized)).not.toContain('pw');
    expect(sanitized.nested.safe).toBe('ok');
  });

  it('preserves missing score and insufficient_data', () => {
    const payload = buildCreateBoardReviewSnapshotPayload({ boardPack: boardPack() });

    expect(payload.rendererInput.moduleSignals[0].score).toBe('N/A');
    expect(payload.rendererInput.moduleSignals[0].score).not.toBe(0);
    expect(payload.missingData).toContain('risk:insufficient_data');
    expect(payload.insufficientDataFlags).toContain('risk:insufficient_data');
  });

  it('includes truthfulness and audit metadata', () => {
    const payload = buildCreateBoardReviewSnapshotPayload({ boardPack: boardPack() });

    expect(payload.truthfulness.noScoreRecalculation).toBe(true);
    expect(payload.truthfulness.noCertification).toBe(true);
    expect(payload.truthfulness.notBoardApproved).toBe(true);
    expect(payload.auditMetadata.humanReviewRequired).toBe(true);
  });

  it('does not mutate input', () => {
    const input = { organizationId: 'client', token: 'secret', nested: { value: 1 } };
    const original = JSON.stringify(input);

    stripClientTenantFields(input);
    stripSensitiveSnapshotFields(input);

    expect(JSON.stringify(input)).toBe(original);
  });
});
