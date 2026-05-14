import {
  assertFiniteNumber,
  assertId,
  assertPlainObject,
  normalizeString
} from '../middlewares/validate.middleware.js';

const numericKeys = new Set(['evidenceCompleteness', 'completenessScore', 'humanReviewRequired']);

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

export const reportingValidator = {
  body: { body },
  update: { params, body },
  params: { params }
};

export default reportingValidator;
