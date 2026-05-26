import { describe, expect, it } from 'vitest';

import { AI_ERROR_CODES, AiServiceError } from '../../../backend/services/ai/aiErrors.js';
import { validateAiRequest } from '../../../backend/services/ai/aiGuardrails.service.js';
import { AI_USE_CASES } from '../../../backend/services/ai/aiUseCases.js';

const validRequest = {
  useCase: AI_USE_CASES.BOARD_REVIEW_DRAFT,
  organizationId: 'org_1',
  actorId: 'user_1',
  outputMode: 'draft',
  humanReviewRequired: true,
  allowExternalSend: false,
  allowDatabaseMutation: false,
  allowScoreRecalculation: false,
  certificationClaim: false
};

function expectAiError(request, code) {
  expect(() => validateAiRequest(request)).toThrow(AiServiceError);
  try {
    validateAiRequest(request);
  } catch (error) {
    expect(error.code).toBe(code);
  }
}

describe('aiGuardrails', () => {
  it('rejects missing organizationId', () => {
    expectAiError({ ...validRequest, organizationId: '' }, AI_ERROR_CODES.AI_TENANT_SCOPE_REQUIRED);
  });

  it('rejects non-draft output', () => {
    expectAiError({ ...validRequest, outputMode: 'final' }, AI_ERROR_CODES.AI_OUTPUT_MODE_INVALID);
  });

  it('rejects missing human review', () => {
    expectAiError({ ...validRequest, humanReviewRequired: false }, AI_ERROR_CODES.AI_HUMAN_REVIEW_REQUIRED);
  });

  it('rejects external sending, database mutation, score recalculation, and certification claims', () => {
    expectAiError({ ...validRequest, allowExternalSend: true }, AI_ERROR_CODES.AI_CONTEXT_REJECTED);
    expectAiError({ ...validRequest, allowDatabaseMutation: true }, AI_ERROR_CODES.AI_CONTEXT_REJECTED);
    expectAiError({ ...validRequest, allowScoreRecalculation: true }, AI_ERROR_CODES.AI_CONTEXT_REJECTED);
    expectAiError({ ...validRequest, certificationClaim: true }, AI_ERROR_CODES.AI_CONTEXT_REJECTED);
  });

  it('rejects future and forbidden use cases', () => {
    expectAiError(
      { ...validRequest, useCase: AI_USE_CASES.COMPLIANCE_MEMO_DRAFT },
      AI_ERROR_CODES.AI_USE_CASE_NOT_ALLOWED
    );
    expectAiError(
      { ...validRequest, useCase: AI_USE_CASES.LEGAL_ADVICE },
      AI_ERROR_CODES.AI_USE_CASE_FORBIDDEN
    );
  });

  it('accepts Board Review Draft draft-only request', () => {
    const result = validateAiRequest(validRequest);

    expect(result.ok).toBe(true);
    expect(result.labels).toContain('AI Draft');
    expect(result.labels).toContain('Requires Human Review');
    expect(result.labels).toContain('Not Board Approved');
  });
});
