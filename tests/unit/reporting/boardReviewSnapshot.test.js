import { describe, expect, it } from 'vitest';

import {
  buildBoardReviewSnapshot,
  sanitizeSnapshotForRenderer,
  validateBoardReviewSnapshot
} from '../../../src/modules/reporting/utils/boardReviewSnapshot.js';

function baseRendererInput() {
  return {
    title: 'Snapshot Draft',
    organizationName: 'Acme Holdings',
    scopeLabel: 'Reporting / Board Packs',
    generatedAt: '2026-05-26T10:00:00.000Z',
    executiveSummary: 'Prepared for review.',
    moduleSignals: [{ module: 'Reporting', label: 'Completeness', score: null }],
    keyRisks: ['Evidence requires review.'],
    missingData: ['risk:insufficient_data'],
    reviewQuestions: ['What changed?'],
    humanReviewChecklist: ['Confirm source labels.'],
    auditMetadata: {}
  };
}

describe('boardReviewSnapshot', () => {
  it('builds snapshot with status, version metadata, and audit metadata', () => {
    const snapshot = buildBoardReviewSnapshot({
      boardPack: { id: 'bp_1', status: 'draft' },
      rendererInput: baseRendererInput(),
      generatedAt: '2026-05-26T10:00:00.000Z',
      sourceModules: ['Reporting']
    });

    expect(snapshot.snapshotId).toContain('preview-bp-1');
    expect(snapshot.status).toBe('human_review_required');
    expect(snapshot.versionMetadata.status).toBe('human_review_required');
    expect(snapshot.auditMetadata.exportType).toBe('html_preview');
  });

  it('marks snapshot and renderer as not source-of-truth', () => {
    const snapshot = buildBoardReviewSnapshot({ rendererInput: baseRendererInput() });

    expect(snapshot.truthfulness.snapshotIsSourceOfTruth).toBe(false);
    expect(snapshot.truthfulness.rendererIsSourceOfTruth).toBe(false);
    expect(validateBoardReviewSnapshot(snapshot)).toBe(true);
  });

  it('preserves human review and truthfulness flags', () => {
    const snapshot = buildBoardReviewSnapshot({ rendererInput: baseRendererInput() });

    expect(snapshot.truthfulness.humanReviewRequired).toBe(true);
    expect(snapshot.truthfulness.notBoardApproved).toBe(true);
    expect(snapshot.truthfulness.noScoreRecalculation).toBe(true);
    expect(snapshot.truthfulness.noCertification).toBe(true);
  });

  it('does not convert missing score to zero and preserves insufficient_data', () => {
    const snapshot = buildBoardReviewSnapshot({ rendererInput: baseRendererInput() });

    expect(snapshot.rendererInput.moduleSignals[0].score).toBeNull();
    expect(snapshot.rendererInput.moduleSignals[0].score).not.toBe(0);
    expect(snapshot.missingData).toContain('risk:insufficient_data');
    expect(snapshot.insufficientDataFlags).toContain('risk:insufficient_data');
  });

  it('prevents AI metadata from marking final', () => {
    const snapshot = buildBoardReviewSnapshot({
      rendererInput: baseRendererInput(),
      aiMetadata: { aiUsed: true, aiOnly: true, promptVersion: 'BOARD_REVIEW_DRAFT_V1' },
      statusInput: { status: 'internal_final', internalFinalApproved: true }
    });

    expect(snapshot.status).toBe('human_review_required');
    expect(snapshot.aiMetadata.status).toBe('human_review_required');
  });

  it('does not mutate input', () => {
    const input = baseRendererInput();
    const original = JSON.stringify(input);

    buildBoardReviewSnapshot({ rendererInput: input });

    expect(JSON.stringify(input)).toBe(original);
  });

  it('returns safe renderer fallback for invalid snapshot', () => {
    const input = sanitizeSnapshotForRenderer({ truthfulness: { snapshotIsSourceOfTruth: true } });

    expect(input.missingData).toContain('snapshot:insufficient_data');
  });
});
