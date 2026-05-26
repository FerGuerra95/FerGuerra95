import { describe, expect, it } from 'vitest';

import { toBoardReviewDraftInput } from '../../../src/modules/reporting/utils/boardReviewDraftAdapter.js';

describe('toBoardReviewDraftInput', () => {
  it('maps board pack data into renderer input', () => {
    const input = toBoardReviewDraftInput({
      boardPack: {
        id: 'bp_1',
        title: 'Quarterly Board Pack',
        status: 'draft',
        completenessScore: 78,
        executiveSummary: 'Board pack ready for review.',
        moduleSignals: [{ module: 'Reporting', label: 'Evidence coverage', score: 78 }],
        keyRisks: ['Evidence freshness needs owner review.'],
        missingData: ['compliance:insufficient_data']
      },
      organizationName: 'Acme Holdings',
      generatedAt: '2026-05-26T10:00:00.000Z'
    });

    expect(input.title).toBe('Quarterly Board Pack');
    expect(input.organizationName).toBe('Acme Holdings');
    expect(input.scopeLabel).toBe('Reporting / Board Packs');
    expect(input.executiveSummary).toBe('Board pack ready for review.');
    expect(input.moduleSignals[0].score).toBe(78);
    expect(input.keyRisks).toContain('Evidence freshness needs owner review.');
  });

  it('keeps missing score as N/A and does not convert to zero', () => {
    const input = toBoardReviewDraftInput({
      boardPack: {
        id: 'bp_missing_score',
        title: 'Missing Score Pack',
        moduleSignals: [{ module: 'Risk', label: 'Risk posture', score: null }]
      }
    });

    expect(input.moduleSignals[0].score).toBe('N/A');
    expect(input.moduleSignals[0].score).not.toBe(0);
  });

  it('preserves insufficient_data and includes audit metadata', () => {
    const input = toBoardReviewDraftInput({
      boardPack: {
        id: 'bp_2',
        title: 'Insufficient Data Pack',
        missingData: ['funding:insufficient_data']
      },
      generatedAt: '2026-05-26T10:00:00.000Z'
    });

    expect(input.missingData).toContain('funding:insufficient_data');
    expect(input.auditMetadata.boardPackId).toBe('bp_2');
    expect(input.auditMetadata.status).toBe('draft');
    expect(input.auditMetadata.sourceType).toBe('board_pack');
  });

  it('includes human review checklist and avoids prohibited claims', () => {
    const input = toBoardReviewDraftInput({
      report: {
        id: 'report_1',
        title: 'Reporting Review',
        humanReviewChecklist: ['Confirm source labels.']
      }
    });
    const serialized = JSON.stringify(input);

    expect(input.humanReviewChecklist).toContain('Confirm source labels.');
    expect(serialized).not.toMatch(/board-approved/i);
    expect(serialized).not.toMatch(/certified PDF/i);
  });

  it('returns safe missing-data state when no board pack or report exists', () => {
    const input = toBoardReviewDraftInput();

    expect(input.missingData).toContain('board_pack_or_report_snapshot:insufficient_data');
    expect(input.auditMetadata.sourceType).toBe('snapshot_required');
  });
});
