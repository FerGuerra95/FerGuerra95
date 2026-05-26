import { describe, expect, it } from 'vitest';

import { buildBoardReviewDraftHtml } from '../../../src/modules/reporting/renderers/boardReviewDraftHtml.js';
import { toBoardReviewDraftInput } from '../../../src/modules/reporting/utils/boardReviewDraftAdapter.js';

function buildHtml(overrides = {}) {
  return buildBoardReviewDraftHtml({
    title: 'Q2 Board Review Draft',
    organizationName: 'Acme Holdings',
    scopeLabel: 'Executive / Reporting',
    generatedAt: '2026-05-26T10:00:00.000Z',
    executiveSummary: 'Revenue signal requires review.',
    moduleSignals: [
      {
        module: 'Reporting',
        label: 'Board pack completeness',
        status: 'human_review_required',
        score: null,
        sourceLabel: 'Reporting snapshot'
      }
    ],
    keyRisks: ['Evidence coverage requires review.'],
    missingData: ['compliance:insufficient_data'],
    reviewQuestions: ['Which signal needs owner confirmation?'],
    humanReviewChecklist: ['Confirm source labels before circulation.'],
    auditMetadata: {
      reportId: 'report_1',
      version: 'draft-1',
      status: 'draft'
    },
    logoSrc: '/brand/ceos-logo.svg',
    ...overrides
  });
}

describe('buildBoardReviewDraftHtml', () => {
  it('includes logo/header and mandatory labels', () => {
    const html = buildHtml();

    expect(html).toContain('/brand/ceos-logo.svg');
    expect(html).toContain('Board Review Draft');
    expect(html).toContain('Human Review Required');
    expect(html).toContain('Not Board Approved');
    expect(html).toContain('Not Legal Advice');
    expect(html).toContain('Not Investment Advice');
    expect(html).toContain('Based on DSS Signals');
    expect(html).toContain('Confidential');
  });

  it('does not include prohibited claim phrases', () => {
    const html = buildHtml();

    expect(html).not.toMatch(/board-approved/i);
    expect(html).not.toMatch(/certified PDF/i);
    expect(html).not.toMatch(/final legal report/i);
    expect(html).not.toMatch(/investment recommendation/i);
    expect(html).not.toMatch(/autonomous AI report/i);
  });

  it('does not render undefined, null, NaN, or Infinity', () => {
    const html = buildHtml({
      executiveSummary: undefined,
      keyRisks: [null, undefined, NaN, Infinity]
    });

    expect(html).not.toMatch(/undefined/i);
    expect(html).not.toMatch(/null/i);
    expect(html).not.toMatch(/NaN/i);
    expect(html).not.toMatch(/Infinity/i);
  });

  it('renders missing score as N/A, not fake zero', () => {
    const html = buildHtml();

    expect(html).toContain('<td>N/A</td>');
    expect(html).not.toContain('<td>0</td>');
  });

  it('preserves insufficient_data and includes audit metadata', () => {
    const html = buildHtml();

    expect(html).toContain('compliance:insufficient_data');
    expect(html).toContain('Audit Metadata');
    expect(html).toContain('reportId');
    expect(html).toContain('report_1');
  });

  it('includes print CSS and A4 marker', () => {
    const html = buildHtml();

    expect(html).toContain('@page { size: A4;');
    expect(html).toContain('@media print');
    expect(html).toContain('page-break-inside: avoid');
  });

  it('renders integrated adapter output with logo/header labels', () => {
    const input = toBoardReviewDraftInput({
      boardPack: {
        id: 'bp_integrated',
        title: 'Integrated Board Pack',
        executiveSummary: 'Prepared from Reporting snapshot.',
        moduleSignals: [{ module: 'Reporting', label: 'Snapshot readiness', score: null }],
        missingData: ['risk:insufficient_data']
      },
      logoSrc: '/brand/ceos-logo.svg',
      includeSnapshot: true,
      generatedAt: '2026-05-26T10:00:00.000Z'
    });
    const html = buildBoardReviewDraftHtml(input);

    expect(html).toContain('Integrated Board Pack');
    expect(html).toContain('Board Review Draft');
    expect(html).toContain('Human Review Required');
    expect(html).toContain('Not Board Approved');
    expect(html).toContain('<td>N/A</td>');
    expect(html).toContain('risk:insufficient_data');
    expect(html).toContain('snapshotId');
    expect(html).toContain('previewOnly');
    expect(html).toContain('html_preview');
    expect(html).toContain('Workflow Status');
    expect(html).toContain('Requires backend persistence');
    expect(html).not.toMatch(/board-approved/i);
    expect(html).not.toMatch(/certified PDF/i);
  });
});
