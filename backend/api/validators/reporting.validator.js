import {
  assertFiniteNumber,
  assertId,
  assertPlainObject,
  normalizeString,
  validationError
} from '../middlewares/validate.middleware.js';

const numericKeys = new Set(['evidenceCompleteness', 'completenessScore', 'humanReviewRequired']);
const tenantKeys = new Set(['organizationId', 'orgId', 'organization_id', 'tenantId', 'tenant_id']);
const allowedBoardReviewStatuses = new Set([
  'draft',
  'ai_draft',
  'human_review_required',
  'reviewed',
  'internal_final',
  'archived',
  'revoked'
]);
const sensitiveKeyPattern =
  /(password|token|cookie|authorization|authheader|auth_header|secret|api[_-]?key|private[_-]?key|secure[_-]?share|bearer)/i;

function params(value = {}) {
  return { ...value, id: assertId(value.id, 'id') };
}

function body(value = {}) {
  const source = assertPlainObject(value, 'Reporting payload');
  const next = {};
  Object.entries(source).forEach(([key, rawValue]) => {
    if (rawValue === undefined) return;
    if (Array.isArray(rawValue)) {
      next[key] = rawValue;
      return;
    }
    if (rawValue && typeof rawValue === 'object') {
      next[key] = assertPlainObject(rawValue, key);
      return;
    }
    if (typeof rawValue === 'number') {
      next[key] = assertFiniteNumber(rawValue, key);
      return;
    }
    if (typeof rawValue === 'boolean') {
      next[key] = rawValue;
      return;
    }
    next[key] = numericKeys.has(key) ? assertFiniteNumber(rawValue, key) : normalizeString(rawValue);
  });
  return next;
}

function hasSensitiveKey(value, path = '') {
  if (Array.isArray(value)) {
    return value.some((item, index) => hasSensitiveKey(item, `${path}[${index}]`));
  }
  if (!value || typeof value !== 'object') return false;

  return Object.entries(value).some(([key, nested]) => {
    if (sensitiveKeyPattern.test(key)) return true;
    return hasSensitiveKey(nested, path ? `${path}.${key}` : key);
  });
}

function stripTenantKeys(source = {}) {
  return Object.entries(source).reduce((acc, [key, value]) => {
    if (!tenantKeys.has(key)) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

function assertNoSensitiveKeys(value) {
  if (hasSensitiveKey(value)) {
    validationError('Board Review payload contiene campos sensibles no permitidos.');
  }
}

function boardReviewCreateBody(value = {}) {
  const source = assertPlainObject(value, 'Board Review payload');
  assertNoSensitiveKeys(source);

  const next = stripTenantKeys(source);
  next.title = normalizeString(next.title);

  if (!next.title) {
    validationError('title es obligatorio.');
  }

  if (!next.rendererInput || typeof next.rendererInput !== 'object' || Array.isArray(next.rendererInput)) {
    validationError('rendererInput debe ser un objeto.');
  }

  if (next.status !== undefined) {
    const status = normalizeString(next.status).toLowerCase();
    if (status === 'board_approved' || !allowedBoardReviewStatuses.has(status)) {
      validationError('status no es valido para Board Review.');
    }
    next.status = status;
  }

  return next;
}

function boardReviewTransitionBody(value = {}) {
  const source = assertPlainObject(value || {}, 'Board Review transition payload');
  assertNoSensitiveKeys(source);
  return stripTenantKeys(source);
}

function boardReviewInternalFinalBody(value = {}) {
  const source = boardReviewTransitionBody(value);
  const approvalMetadata =
    source.approvalMetadata && typeof source.approvalMetadata === 'object'
      ? source.approvalMetadata
      : source;

  if (approvalMetadata.explicitApproval !== true) {
    validationError('explicitApproval true es obligatorio.');
  }

  return source;
}

export const reportingValidator = {
  body: { body },
  update: { params, body },
  params: { params },
  boardReviewCreate: { body: boardReviewCreateBody },
  boardReviewTransition: { params, body: boardReviewTransitionBody },
  boardReviewInternalFinal: { params, body: boardReviewInternalFinalBody }
};

export default reportingValidator;
