import { AI_ERROR_CODES, createAiError } from './aiErrors.js';

const CONTEXT_VERSION = 'ai_context_v1';
const MAX_ARRAY_ITEMS = 20;
const MAX_STRING_LENGTH = 2000;

const FORBIDDEN_CONTEXT_KEYS = [
  /rawDbDump/i,
  /authHeaders?/i,
  /authorization/i,
  /tokens?/i,
  /accessToken/i,
  /refreshToken/i,
  /idToken/i,
  /cookies?/i,
  /password/i,
  /passwordHash/i,
  /passwordSalt/i,
  /secureShareToken/i,
  /crossTenantData/i,
  /apiKey/i,
  /secret/i,
  /privateKey/i
];

function hasForbiddenKey(value) {
  if (Array.isArray(value)) {
    return value.some((item) => hasForbiddenKey(item));
  }
  if (!value || typeof value !== 'object') {
    return false;
  }
  return Object.entries(value).some(([key, nestedValue]) => (
    FORBIDDEN_CONTEXT_KEYS.some((pattern) => pattern.test(key)) || hasForbiddenKey(nestedValue)
  ));
}

function minimizeValue(value, allowedFields, omittedFields, path = '') {
  if (Array.isArray(value)) {
    if (value.length > MAX_ARRAY_ITEMS) {
      omittedFields.push(`${path || 'array'}:truncated`);
    }
    return value.slice(0, MAX_ARRAY_ITEMS).map((item, index) => (
      minimizeValue(item, allowedFields, omittedFields, `${path}[${index}]`)
    ));
  }
  if (typeof value === 'string') {
    if (value.length > MAX_STRING_LENGTH) {
      omittedFields.push(`${path || 'string'}:truncated`);
      return value.slice(0, MAX_STRING_LENGTH);
    }
    return value;
  }
  if (!value || typeof value !== 'object') {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => {
        const fieldPath = path ? `${path}.${key}` : key;
        const allowed = !allowedFields?.length || allowedFields.includes(key) || allowedFields.includes(fieldPath);
        if (!allowed) {
          omittedFields.push(fieldPath);
        }
        return allowed;
      })
      .map(([key, nestedValue]) => {
        const fieldPath = path ? `${path}.${key}` : key;
        return [key, minimizeValue(nestedValue, allowedFields, omittedFields, fieldPath)];
      })
  );
}

export function buildAiContext({
  useCase,
  organizationId,
  actorId,
  source,
  summaries,
  moduleSignals,
  reportMetadata,
  allowedFields,
  ...rest
} = {}) {
  if (!organizationId) {
    throw createAiError(AI_ERROR_CODES.AI_TENANT_SCOPE_REQUIRED);
  }

  const candidate = { source, summaries, moduleSignals, reportMetadata, ...rest };
  if (hasForbiddenKey(candidate)) {
    throw createAiError(AI_ERROR_CODES.AI_SECRET_DETECTED);
  }

  const omittedFields = [];
  const warnings = [];
  const sanitizedAllowedFields = Array.isArray(allowedFields) ? allowedFields : null;

  if (!actorId) {
    warnings.push('actorId_missing_for_future_auth_audit');
  }

  return {
    useCase,
    contextVersion: CONTEXT_VERSION,
    organizationScope: 'backend-authenticated',
    source: minimizeValue(source ?? null, sanitizedAllowedFields, omittedFields, 'source'),
    summaries: minimizeValue(summaries ?? [], sanitizedAllowedFields, omittedFields, 'summaries'),
    moduleSignals: minimizeValue(moduleSignals ?? [], sanitizedAllowedFields, omittedFields, 'moduleSignals'),
    reportMetadata: minimizeValue(reportMetadata ?? {}, sanitizedAllowedFields, omittedFields, 'reportMetadata'),
    omittedFields,
    warnings
  };
}
