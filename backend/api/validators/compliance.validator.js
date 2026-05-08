import {
  assertId,
  assertOptionalEnum,
  assertPlainObject,
  normalizeString
} from '../middlewares/validate.middleware.js';

const VALID_FRAMEWORKS = ['gdpr', 'iso27001', 'soc2', 'csddd'];
const VALID_SCOPES = ['portfolio', 'supplier', 'ma_case'];

function normalizeFrameworks(value) {
  if (value === undefined || value === null || value === '') return VALID_FRAMEWORKS;

  const items = Array.isArray(value)
    ? value
    : normalizeString(value)
      .split(',')
      .map((item) => item.trim());

  return [
    ...new Set(
      items
        .map((item) => normalizeString(item).toLowerCase())
        .filter((item) => VALID_FRAMEWORKS.includes(item))
    )
  ];
}

function auditRunBody(body = {}) {
  const payload = assertPlainObject(body, 'body');
  const next = {
    ...payload
  };

  if (Object.prototype.hasOwnProperty.call(next, 'supplierId') && next.supplierId) {
    next.supplierId = assertId(next.supplierId, 'supplier id');
  }

  if (Object.prototype.hasOwnProperty.call(next, 'maCaseId') && next.maCaseId) {
    next.maCaseId = assertId(next.maCaseId, 'ma case id');
  }

  if (Object.prototype.hasOwnProperty.call(next, 'scope')) {
    next.scope = assertOptionalEnum(next.scope, VALID_SCOPES, 'portfolio');
  }

  next.frameworks = normalizeFrameworks(next.frameworks || next.framework);

  return next;
}

function auditRunParams(params = {}) {
  return {
    ...params,
    id: assertId(params.id, 'compliance audit run id')
  };
}

function auditRunQuery(query = {}) {
  const payload = query && typeof query === 'object' ? query : {};

  return {
    maCaseId: payload.maCaseId
      ? assertId(payload.maCaseId, 'ma case id')
      : '',
    supplierId: payload.supplierId
      ? assertId(payload.supplierId, 'supplier id')
      : ''
  };
}

export const complianceValidator = {
  runAudit: {
    body: auditRunBody
  },
  auditRunParams: {
    params: auditRunParams
  },
  auditRunQuery: {
    query: auditRunQuery
  }
};

export default complianceValidator;
