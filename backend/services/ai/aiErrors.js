export const AI_ERROR_CODES = Object.freeze({
  AI_PROVIDER_NOT_CONFIGURED: 'AI_PROVIDER_NOT_CONFIGURED',
  AI_USE_CASE_NOT_ALLOWED: 'AI_USE_CASE_NOT_ALLOWED',
  AI_USE_CASE_FORBIDDEN: 'AI_USE_CASE_FORBIDDEN',
  AI_CONTEXT_REJECTED: 'AI_CONTEXT_REJECTED',
  AI_SECRET_DETECTED: 'AI_SECRET_DETECTED',
  AI_TENANT_SCOPE_REQUIRED: 'AI_TENANT_SCOPE_REQUIRED',
  AI_HUMAN_REVIEW_REQUIRED: 'AI_HUMAN_REVIEW_REQUIRED',
  AI_OUTPUT_MODE_INVALID: 'AI_OUTPUT_MODE_INVALID',
  AI_RUNTIME_DISABLED: 'AI_RUNTIME_DISABLED'
});

const SAFE_MESSAGES = Object.freeze({
  [AI_ERROR_CODES.AI_PROVIDER_NOT_CONFIGURED]: 'AI provider is not configured for runtime use.',
  [AI_ERROR_CODES.AI_USE_CASE_NOT_ALLOWED]: 'AI use case is not allowed in this phase.',
  [AI_ERROR_CODES.AI_USE_CASE_FORBIDDEN]: 'AI use case is forbidden.',
  [AI_ERROR_CODES.AI_CONTEXT_REJECTED]: 'AI context was rejected by guardrails.',
  [AI_ERROR_CODES.AI_SECRET_DETECTED]: 'AI payload contains restricted credential material.',
  [AI_ERROR_CODES.AI_TENANT_SCOPE_REQUIRED]: 'AI request requires backend tenant scope.',
  [AI_ERROR_CODES.AI_HUMAN_REVIEW_REQUIRED]: 'AI output requires human review.',
  [AI_ERROR_CODES.AI_OUTPUT_MODE_INVALID]: 'AI output mode must be draft.',
  [AI_ERROR_CODES.AI_RUNTIME_DISABLED]: 'AI runtime is disabled.'
});

export class AiServiceError extends Error {
  constructor(code, details = {}) {
    super(SAFE_MESSAGES[code] ?? 'AI request blocked by guardrails.');
    this.name = 'AiServiceError';
    this.code = code;
    this.details = details;
  }
}

export function createAiError(code, details) {
  return new AiServiceError(code, details);
}
