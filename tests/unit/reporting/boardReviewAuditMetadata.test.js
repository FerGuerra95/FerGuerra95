import { describe, expect, it } from 'vitest';

import {
  buildBoardReviewAuditMetadata,
  sanitizeBoardReviewAuditMetadata
} from '../../../src/modules/reporting/utils/boardReviewAuditMetadata.js';

describe('boardReviewAuditMetadata', () => {
  it('builds safe preview metadata', () => {
    const metadata = buildBoardReviewAuditMetadata({
      reportId: 'report_1',
      boardPackId: 'bp_1',
      organizationId: 'org_1',
      actorId: 'actor_1',
      generatedAt: '2026-05-26T10:00:00.000Z',
      sourceModules: ['Reporting', 'Risk'],
      limitations: ['Human review required'],
      insufficientDataFlags: ['compliance:insufficient_data']
    });

    expect(metadata.reportId).toBe('report_1');
    expect(metadata.previewOnly).toBe(true);
    expect(metadata.exportType).toBe('html_preview');
    expect(metadata.classification).toBe('Confidential');
    expect(metadata.statusLabel).toBe('Board Review Draft');
    expect(metadata.humanReviewRequired).toBe(true);
    expect(metadata.sourceModules).toEqual(['Reporting', 'Risk']);
  });

  it('redacts sensitive metadata keys recursively', () => {
    const metadata = sanitizeBoardReviewAuditMetadata({
      token: 'abc',
      password: 'pw',
      cookie: 'sid',
      authHeader: 'Bearer value',
      nested: {
        apiKey: 'key',
        visible: 'ok'
      }
    });

    expect(JSON.stringify(metadata)).not.toContain('abc');
    expect(JSON.stringify(metadata)).not.toContain('pw');
    expect(JSON.stringify(metadata)).not.toContain('sid');
    expect(JSON.stringify(metadata)).not.toContain('Bearer value');
    expect(JSON.stringify(metadata)).not.toContain('key');
    expect(metadata.nested.visible).toBe('ok');
  });

  it('includes insufficient data flags and no secret values', () => {
    const metadata = buildBoardReviewAuditMetadata({
      insufficientDataFlags: ['risk:insufficient_data'],
      limitations: ['Not Board Approved']
    });

    expect(metadata.insufficientDataFlags).toContain('risk:insufficient_data');
    expect(JSON.stringify(metadata)).not.toMatch(/secret|password|token|cookie/i);
  });
});
