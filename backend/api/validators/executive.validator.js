import {
  assertFiniteNumber,
  assertId,
  assertPlainObject,
  normalizeString
} from '../middlewares/validate.middleware.js';

function genericExecutiveBody(value = {}) {
  const source = assertPlainObject(value, 'executive payload');
  const next = {};
  const numberKeys = new Set(['readinessScore', 'confidence', 'priorityScore']);
  Object.entries(source).forEach(([key, raw]) => {
    if (raw === undefined) return;
    if (Array.isArray(raw)) {
      next[key] = raw;
      return;
    }
    if (raw && typeof raw === 'object') {
      next[key] = assertPlainObject(raw, key);
      return;
    }
    if (typeof raw === 'boolean') {
      next[key] = raw;
      return;
    }
    next[key] = numberKeys.has(key) ? assertFiniteNumber(raw, key) : normalizeString(raw);
  });
  return next;
}

function idParams(value = {}) {
  return { ...value, id: assertId(value.id, 'id') };
}

export const executiveValidator = {
  body: { body: genericExecutiveBody },
  updateSignal: { params: idParams, body: genericExecutiveBody },
  idParams: { params: idParams }
};

export default executiveValidator;
