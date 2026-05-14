import {
  assertFiniteNumber,
  assertId,
  assertPlainObject,
  normalizeString
} from '../middlewares/validate.middleware.js';

const numericKeys = new Set([
  'likelihood',
  'impact',
  'effectiveness',
  'progress',
  'threshold',
  'actualValue',
  'breachFlag'
]);

function params(value = {}) {
  return {
    ...value,
    id: assertId(value.id, 'id')
  };
}

function body(value = {}) {
  const source = assertPlainObject(value, 'Risk payload');
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
    next[key] = numericKeys.has(key)
      ? assertFiniteNumber(rawValue, key)
      : normalizeString(rawValue);
  });

  return next;
}

export const riskValidator = {
  body: { body },
  update: { body, params },
  params: { params }
};

export default riskValidator;
