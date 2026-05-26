import { AI_ERROR_CODES, createAiError } from './aiErrors.js';
import {
  AI_USE_CASE_STATUSES,
  getAiUseCasePolicy
} from './aiUseCases.js';

export const AI_OUTPUT_LABELS = Object.freeze([
  'AI Draft',
  'Requires Human Review',
  'Based on DSS Signals',
  'Not Legal Advice',
  'Not Investment Advice',
  'Not Board Approved'
]);

export function validateAiRequest({
  useCase,
  organizationId,
  actorId,
  outputMode,
  humanReviewRequired,
  allowExternalSend,
  allowDatabaseMutation,
  allowScoreRecalculation,
  certificationClaim
} = {}) {
  if (!organizationId) {
    throw createAiError(AI_ERROR_CODES.AI_TENANT_SCOPE_REQUIRED);
  }

  const policy = getAiUseCasePolicy(useCase);
  if (!policy) {
    throw createAiError(AI_ERROR_CODES.AI_USE_CASE_NOT_ALLOWED);
  }
  if (policy.status === AI_USE_CASE_STATUSES.FORBIDDEN) {
    throw createAiError(AI_ERROR_CODES.AI_USE_CASE_FORBIDDEN);
  }
  if (policy.status !== AI_USE_CASE_STATUSES.ALLOWED) {
    throw createAiError(AI_ERROR_CODES.AI_USE_CASE_NOT_ALLOWED);
  }
  if (outputMode !== 'draft') {
    throw createAiError(AI_ERROR_CODES.AI_OUTPUT_MODE_INVALID);
  }
  if (humanReviewRequired !== true) {
    throw createAiError(AI_ERROR_CODES.AI_HUMAN_REVIEW_REQUIRED);
  }
  if (allowExternalSend !== false || allowDatabaseMutation !== false || allowScoreRecalculation !== false) {
    throw createAiError(AI_ERROR_CODES.AI_CONTEXT_REJECTED);
  }
  if (certificationClaim) {
    throw createAiError(AI_ERROR_CODES.AI_CONTEXT_REJECTED);
  }

  return {
    ok: true,
    policy,
    labels: [...AI_OUTPUT_LABELS],
    warnings: actorId ? [] : ['actorId_missing_for_future_auth_audit']
  };
}
