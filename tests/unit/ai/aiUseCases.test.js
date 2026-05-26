import { describe, expect, it } from 'vitest';

import {
  AI_USE_CASES,
  AI_USE_CASE_STATUSES,
  getAiUseCasePolicy,
  isAiUseCaseAllowed,
  isAiUseCaseForbidden
} from '../../../backend/services/ai/aiUseCases.js';

describe('aiUseCases', () => {
  it('allows Board Review Draft as the only C.16.1 design use case', () => {
    expect(isAiUseCaseAllowed(AI_USE_CASES.BOARD_REVIEW_DRAFT)).toBe(true);
    expect(getAiUseCasePolicy(AI_USE_CASES.BOARD_REVIEW_DRAFT)?.status).toBe(
      AI_USE_CASE_STATUSES.ALLOWED
    );
  });

  it('marks future cases as not allowed yet', () => {
    expect(isAiUseCaseAllowed(AI_USE_CASES.COMPLIANCE_MEMO_DRAFT)).toBe(false);
    expect(isAiUseCaseAllowed(AI_USE_CASES.MA_IC_MEMO_DRAFT)).toBe(false);
    expect(isAiUseCaseAllowed(AI_USE_CASES.EXECUTIVE_BRIEF)).toBe(false);
    expect(getAiUseCasePolicy(AI_USE_CASES.EXECUTIVE_BRIEF)?.status).toBe(AI_USE_CASE_STATUSES.FUTURE);
  });

  it('forbids autonomous, legal, investment, and marketplace use cases', () => {
    expect(isAiUseCaseForbidden(AI_USE_CASES.AUTONOMOUS_AGENT)).toBe(true);
    expect(isAiUseCaseForbidden(AI_USE_CASES.LEGAL_ADVICE)).toBe(true);
    expect(isAiUseCaseForbidden(AI_USE_CASES.INVESTMENT_ADVICE)).toBe(true);
    expect(isAiUseCaseForbidden(AI_USE_CASES.MARKETPLACE_MATCHING)).toBe(true);
  });
});
