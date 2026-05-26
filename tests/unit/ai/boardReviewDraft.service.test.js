import { describe, expect, it, vi } from 'vitest';

import { createBoardReviewDraft } from '../../../backend/services/ai/boardReviewDraft.service.js';
import { AI_ERROR_CODES } from '../../../backend/services/ai/aiErrors.js';
import { AI_USE_CASES } from '../../../backend/services/ai/aiUseCases.js';

const baseRequest = Object.freeze({
  organizationId: 'org_1',
  actorId: 'user_1',
  source: { type: 'reporting_board_pack', id: 'board_pack_1' },
  executiveSummary: { summary: 'Revenue trend requires board review.' },
  moduleSignals: [
    {
      module: 'reporting',
      label: 'Revenue variance',
      status: 'review_required',
      provenance: 'Reporting KPI variance'
    }
  ],
  reportingMetadata: {
    title: 'Q2 Board Review Draft',
    reportId: 'report_1'
  },
  riskHighlights: ['Funding runway sensitivity requires human review.'],
  missingData: ['compliance:insufficient_data']
});

function cloneBaseRequest(overrides = {}) {
  return JSON.parse(JSON.stringify({ ...baseRequest, ...overrides }));
}

function expectAiError(input, code) {
  try {
    createBoardReviewDraft(input);
  } catch (error) {
    expect(error.code).toBe(code);
    return;
  }
  throw new Error(`Expected ${code}`);
}

describe('boardReviewDraft.service', () => {
  it('creates mock board review draft when provider mock and allowMock true', () => {
    const result = createBoardReviewDraft({
      ...cloneBaseRequest(),
      provider: 'mock',
      allowMock: true
    });

    expect(result.ok).toBe(true);
    expect(result.useCase).toBe(AI_USE_CASES.BOARD_REVIEW_DRAFT);
    expect(result.status).toBe('draft_prepared');
    expect(result.provider).toBe('mock');
    expect(result.promptVersion).toBe('BOARD_REVIEW_DRAFT_V1');
    expect(result.draft.title).toBe('Q2 Board Review Draft');
    expect(result.draft.keySignals[0].module).toBe('reporting');
  });

  it('returns controlled runtime disabled response when provider disabled', () => {
    const result = createBoardReviewDraft({
      ...cloneBaseRequest(),
      provider: 'disabled'
    });

    expect(result.ok).toBe(false);
    expect(result.status).toBe('runtime_disabled');
    expect(result.errorCode).toBe(AI_ERROR_CODES.AI_RUNTIME_DISABLED);
    expect(result.draft).toBeUndefined();
  });

  it('rejects missing organizationId', () => {
    expectAiError(
      { ...cloneBaseRequest(), organizationId: '', provider: 'mock', allowMock: true },
      AI_ERROR_CODES.AI_TENANT_SCOPE_REQUIRED
    );
  });

  it('rejects forbidden use case override', () => {
    expectAiError(
      {
        ...cloneBaseRequest(),
        useCase: AI_USE_CASES.AUTONOMOUS_AGENT,
        provider: 'mock',
        allowMock: true
      },
      AI_ERROR_CODES.AI_USE_CASE_FORBIDDEN
    );
  });

  it('rejects raw secrets in context', () => {
    expectAiError(
      {
        ...cloneBaseRequest({
          executiveSummary: {
            summary: 'safe',
            token: 'secret-token'
          }
        }),
        provider: 'mock',
        allowMock: true
      },
      AI_ERROR_CODES.AI_SECRET_DETECTED
    );
  });

  it('rejects crossTenantData markers', () => {
    expectAiError(
      {
        ...cloneBaseRequest({
          moduleSignals: [{ module: 'reporting', crossTenantData: true }]
        }),
        provider: 'mock',
        allowMock: true
      },
      AI_ERROR_CODES.AI_SECRET_DETECTED
    );
  });

  it('preserves insufficient_data in missingData', () => {
    const result = createBoardReviewDraft({
      ...cloneBaseRequest(),
      provider: 'mock',
      allowMock: true
    });

    expect(result.draft.missingData).toContain('compliance:insufficient_data');
  });

  it('includes required labels', () => {
    const result = createBoardReviewDraft({
      ...cloneBaseRequest(),
      provider: 'mock',
      allowMock: true
    });

    expect(result.labels).toEqual([
      'AI Draft',
      'Requires Human Review',
      'Based on DSS Signals',
      'Not Legal Advice',
      'Not Investment Advice',
      'Not Board Approved'
    ]);
  });

  it('includes truthfulness guarantees', () => {
    const result = createBoardReviewDraft({
      ...cloneBaseRequest(),
      provider: 'mock',
      allowMock: true
    });

    expect(result.truthfulness.humanReviewRequired).toBe(true);
    expect(result.truthfulness.noScoreRecalculation).toBe(true);
    expect(result.truthfulness.noCertification).toBe(true);
    expect(result.truthfulness.noAutonomousDecision).toBe(true);
    expect(result.truthfulness.sourceOfTruth).toBe('DSS_SIGNALS_ONLY');
  });

  it('does not mutate input object', () => {
    const input = cloneBaseRequest({
      provider: 'mock',
      allowMock: true
    });
    const before = JSON.stringify(input);

    createBoardReviewDraft(input);

    expect(JSON.stringify(input)).toBe(before);
  });

  it('audit metadata contains no token/password/cookie', () => {
    const result = createBoardReviewDraft({
      ...cloneBaseRequest(),
      provider: 'mock',
      allowMock: true
    });

    const auditJson = JSON.stringify(result.audit);
    expect(auditJson).not.toMatch(/token|password|cookie/i);
  });

  it('does not call external fetch', () => {
    const originalFetch = globalThis.fetch;
    const fetchSpy = vi.fn();
    globalThis.fetch = fetchSpy;

    try {
      createBoardReviewDraft({
        ...cloneBaseRequest(),
        provider: 'mock',
        allowMock: true
      });
      expect(fetchSpy).not.toHaveBeenCalled();
    } finally {
      if (originalFetch) {
        globalThis.fetch = originalFetch;
      } else {
        Reflect.deleteProperty(globalThis, 'fetch');
      }
    }
  });
});
