import {
  assertFiniteNumber,
  assertId,
  assertOptionalEnum,
  assertPlainObject,
  normalizeString,
  validationError
} from '../middlewares/validate.middleware.js';

const VALID_CASE_STATUSES = ['draft', 'active', 'completed', 'archived'];
const VALID_REPORT_STATUSES = ['draft', 'generated', 'exported', 'archived'];
const VALID_DATA_ROOM_DOCUMENT_STATUSES = [
  'draft',
  'ready',
  'shared',
  'revoked',
  'archived'
];
const VALID_DATA_ROOM_DOCUMENT_TYPES = [
  'report',
  'cim',
  'financials',
  'legal',
  'tax',
  'operations',
  'other'
];
const VALID_VDR_AREAS = [
  'financial',
  'legal',
  'tax',
  'hr',
  'commercial',
  'operations',
  'esg',
  'technology',
  'other'
];
const VALID_VDR_ROLES = ['admin', 'user', 'viewer'];
const VALID_DEAL_STAGES = [
  'screening',
  'nda',
  'due-diligence',
  'ic-review',
  'negotiation',
  'closing'
];
const VALID_DEAL_PRIORITIES = ['low', 'medium', 'high', 'review', 'watch', 'build'];
const VALID_DEAL_RISK_LEVELS = [
  'low',
  'medium',
  'high',
  'controlled',
  'moderate',
  'elevated'
];
const VALID_DEAL_STATUSES = ['active', 'paused', 'completed', 'archived'];
const VALID_IC_MEMO_STATUSES = [
  'not_started',
  'draft',
  'in_review',
  'approved',
  'rejected'
];

const NUMERIC_FINANCIAL_FIELDS = [
  'revenue',
  'ebitda',
  'normalizedEbitda',
  'adjustedEbitda',
  'currentEbitda',
  'ebitdaAdjustments',
  'netDebt',
  'cash',
  'debt',
  'workingCapital',
  'targetWorkingCapital',
  'transactionFees',
  'taxRate',
  'growthRate',
  'customerConcentration',
  'ownerDependency'
];

function caseParams(params = {}) {
  return {
    ...params,
    id: assertId(params.id, 'case id')
  };
}

function reportParams(params = {}) {
  return {
    ...params,
    id: assertId(params.id, 'report id')
  };
}

function secureShareParams(params = {}) {
  return {
    ...params,
    id: assertId(params.id, 'secure share id')
  };
}

function dealParams(params = {}) {
  return {
    ...params,
    id: assertId(params.id, 'deal id')
  };
}

function dataRoomDocumentParams(params = {}) {
  return {
    ...params,
    id: assertId(params.id, 'data room document id')
  };
}

function normalizeFinancials(financials = {}) {
  const payload = assertPlainObject(financials, 'financials');
  const next = {
    ...payload
  };

  NUMERIC_FINANCIAL_FIELDS.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(next, field)) {
      next[field] = assertFiniteNumber(next[field], `financials.${field}`);
    }
  });

  if (Object.prototype.hasOwnProperty.call(next, 'name')) {
    next.name = normalizeString(next.name);
  }

  if (Object.prototype.hasOwnProperty.call(next, 'sector')) {
    next.sector = normalizeString(next.sector);
  }

  return next;
}

function normalizeSettings(settings = {}) {
  return assertPlainObject(settings, 'settings');
}

function normalizeSnapshot(snapshot = {}) {
  return assertPlainObject(snapshot, 'snapshot');
}

function assertCaseHasName(payload = {}) {
  const name = normalizeString(payload.name || payload.financials?.name);

  if (!name) {
    validationError('El nombre del deal M&A es obligatorio.');
  }

  return name;
}

function normalizeOptionalBoolean(value, fallback) {
  if (value === undefined || value === null || value === '') return fallback;
  if (value === true || value === false) return value;

  const text = normalizeString(value).toLowerCase();

  if (['1', 'true', 'yes', 'y', 'on'].includes(text)) return true;
  if (['0', 'false', 'no', 'n', 'off'].includes(text)) return false;

  validationError(`Valor booleano no permitido: ${value}.`);
}

function normalizeOptionalIsoDate(value, label) {
  const text = normalizeString(value);

  if (!text) return '';

  const timestamp = Date.parse(text);

  if (!Number.isFinite(timestamp)) {
    validationError(`${label} no es una fecha valida.`);
  }

  return new Date(timestamp).toISOString();
}

function normalizeAllowedRoles(value) {
  if (value === undefined || value === null || value === '') return undefined;

  const items = Array.isArray(value)
    ? value
    : normalizeString(value)
      .split(',')
      .map((item) => item.trim());
  const roles = items.map((item) => normalizeString(item).toLowerCase());

  if (roles.some((role) => !VALID_VDR_ROLES.includes(role))) {
    validationError('allowedRoles contiene roles no permitidos.');
  }

  return [...new Set(roles)];
}

function normalizeDataRoomGovernanceFields(next = {}) {
  ['area', 'folder', 'watermarkLabel', 'purgePolicy'].forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(next, field)) {
      next[field] = normalizeString(next[field]);
    }
  });

  if (Object.prototype.hasOwnProperty.call(next, 'area')) {
    next.area = assertOptionalEnum(next.area, VALID_VDR_AREAS, 'financial');
  }

  if (Object.prototype.hasOwnProperty.call(next, 'allowDownload')) {
    next.allowDownload = normalizeOptionalBoolean(next.allowDownload, true);
  }

  if (Object.prototype.hasOwnProperty.call(next, 'legalHold')) {
    next.legalHold = normalizeOptionalBoolean(next.legalHold, false);
  }

  if (Object.prototype.hasOwnProperty.call(next, 'expiresAt')) {
    next.expiresAt = normalizeOptionalIsoDate(next.expiresAt, 'expiresAt');
  }

  if (Object.prototype.hasOwnProperty.call(next, 'accessExpiresAt')) {
    next.accessExpiresAt = normalizeOptionalIsoDate(
      next.accessExpiresAt,
      'accessExpiresAt'
    );
  }

  if (Object.prototype.hasOwnProperty.call(next, 'retentionUntil')) {
    next.retentionUntil = normalizeOptionalIsoDate(
      next.retentionUntil,
      'retentionUntil'
    );
  }

  if (Object.prototype.hasOwnProperty.call(next, 'allowedRoles')) {
    next.allowedRoles = normalizeAllowedRoles(next.allowedRoles);
  }

  return next;
}

function normalizeCaseBody(body = {}, { partial = false } = {}) {
  const payload = assertPlainObject(body, 'body');
  const next = {
    ...payload
  };

  if (!partial || Object.prototype.hasOwnProperty.call(next, 'name')) {
    next.name = normalizeString(next.name || next.financials?.name);
  }

  if (!partial) {
    next.name = assertCaseHasName(next);
  }

  if (Object.prototype.hasOwnProperty.call(next, 'financials')) {
    next.financials = normalizeFinancials(next.financials);

    if (!partial && !normalizeString(next.financials.sector)) {
      validationError('El sector del deal M&A es obligatorio.');
    }
  }

  if (Object.prototype.hasOwnProperty.call(next, 'settings')) {
    next.settings = normalizeSettings(next.settings);
  }

  if (Object.prototype.hasOwnProperty.call(next, 'snapshot')) {
    next.snapshot = next.snapshot === null ? null : normalizeSnapshot(next.snapshot);
  }

  if (Object.prototype.hasOwnProperty.call(next, 'snapshots')) {
    if (!Array.isArray(next.snapshots)) {
      validationError('snapshots debe ser un array.');
    }
  }

  if (Object.prototype.hasOwnProperty.call(next, 'status')) {
    next.status = assertOptionalEnum(
      next.status,
      VALID_CASE_STATUSES,
      partial ? undefined : 'draft'
    );
  }

  return next;
}

function createCase(body = {}) {
  return normalizeCaseBody(body, {
    partial: false
  });
}

function updateCase(body = {}) {
  return normalizeCaseBody(body, {
    partial: true
  });
}

function snapshotBody(body = {}) {
  const payload = assertPlainObject(body, 'body');

  if (Object.prototype.hasOwnProperty.call(payload, 'caseId')) {
    payload.caseId = assertId(payload.caseId, 'case id');
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'snapshot')) {
    payload.snapshot = normalizeSnapshot(payload.snapshot);
  }

  return payload;
}

function reportExport(body = {}) {
  const payload = assertPlainObject(body, 'body');
  const next = {
    ...payload
  };

  if (Object.prototype.hasOwnProperty.call(next, 'caseId') && next.caseId) {
    next.caseId = assertId(next.caseId, 'case id');
  }

  if (Object.prototype.hasOwnProperty.call(next, 'title')) {
    next.title = normalizeString(next.title);
  }

  if (Object.prototype.hasOwnProperty.call(next, 'status')) {
    next.status = assertOptionalEnum(
      next.status,
      VALID_REPORT_STATUSES,
      'generated'
    );
  }

  if (Object.prototype.hasOwnProperty.call(next, 'payload')) {
    next.payload = assertPlainObject(next.payload, 'payload');
  }

  return normalizeDataRoomGovernanceFields(next);
}

function updateDataRoomDocumentGovernance(body = {}) {
  const payload = assertPlainObject(body, 'body');
  const next = {
    ...payload
  };

  if (Object.prototype.hasOwnProperty.call(next, 'title')) {
    next.title = normalizeString(next.title);
  }

  if (Object.prototype.hasOwnProperty.call(next, 'documentType')) {
    next.documentType = assertOptionalEnum(
      next.documentType,
      VALID_DATA_ROOM_DOCUMENT_TYPES,
      'other'
    );
  }

  if (Object.prototype.hasOwnProperty.call(next, 'status')) {
    next.status = assertOptionalEnum(
      next.status,
      VALID_DATA_ROOM_DOCUMENT_STATUSES,
      'ready'
    );
  }

  if (Object.prototype.hasOwnProperty.call(next, 'classification')) {
    next.classification = normalizeString(next.classification);
  }

  if (Object.prototype.hasOwnProperty.call(next, 'payload')) {
    next.payload = assertPlainObject(next.payload, 'payload');
  }

  return normalizeDataRoomGovernanceFields(next);
}

function createSecureShare(body = {}) {
  const payload = body && typeof body === 'object' ? body : {};
  const expiresInHours = Number(payload.expiresInHours || 72);

  if (!Number.isFinite(expiresInHours) || expiresInHours < 1) {
    validationError('expiresInHours debe ser numerico y mayor que 0.');
  }

  return {
    expiresInHours: Math.min(Math.round(expiresInHours), 24 * 30)
  };
}

function createDataRoomDocument(body = {}) {
  const payload = assertPlainObject(body, 'body');
  const next = {
    ...payload
  };

  if (Object.prototype.hasOwnProperty.call(next, 'caseId') && next.caseId) {
    next.caseId = assertId(next.caseId, 'case id');
  }

  if (Object.prototype.hasOwnProperty.call(next, 'reportId') && next.reportId) {
    next.reportId = assertId(next.reportId, 'report id');
  }

  if (Object.prototype.hasOwnProperty.call(next, 'shareId') && next.shareId) {
    next.shareId = assertId(next.shareId, 'secure share id');
  }

  next.title = normalizeString(next.title || 'M&A Data Room Document');

  if (Object.prototype.hasOwnProperty.call(next, 'documentType')) {
    next.documentType = assertOptionalEnum(
      next.documentType,
      VALID_DATA_ROOM_DOCUMENT_TYPES,
      'other'
    );
  }

  if (Object.prototype.hasOwnProperty.call(next, 'status')) {
    next.status = assertOptionalEnum(
      next.status,
      VALID_DATA_ROOM_DOCUMENT_STATUSES,
      'ready'
    );
  }

  if (Object.prototype.hasOwnProperty.call(next, 'classification')) {
    next.classification = normalizeString(next.classification);
  }

  if (Object.prototype.hasOwnProperty.call(next, 'payload')) {
    next.payload = assertPlainObject(next.payload, 'payload');
  }

  return next;
}

function normalizeDealBody(body = {}, { partial = false } = {}) {
  const payload = assertPlainObject(body, 'body');
  const next = {
    ...payload
  };

  if (!partial || Object.prototype.hasOwnProperty.call(next, 'name')) {
    next.name = normalizeString(next.name);

    if (!partial && !next.name) {
      validationError('El nombre del deal M&A es obligatorio.');
    }
  }

  if (Object.prototype.hasOwnProperty.call(next, 'caseId') && next.caseId) {
    next.caseId = assertId(next.caseId, 'case id');
  }

  if (Object.prototype.hasOwnProperty.call(next, 'stage')) {
    next.stage = assertOptionalEnum(next.stage, VALID_DEAL_STAGES, 'screening');
  }

  if (Object.prototype.hasOwnProperty.call(next, 'priority')) {
    next.priority = assertOptionalEnum(
      next.priority,
      VALID_DEAL_PRIORITIES,
      'medium'
    );
  }

  if (Object.prototype.hasOwnProperty.call(next, 'riskLevel')) {
    next.riskLevel = assertOptionalEnum(
      next.riskLevel,
      VALID_DEAL_RISK_LEVELS,
      'medium'
    );
  }

  if (Object.prototype.hasOwnProperty.call(next, 'status')) {
    next.status = assertOptionalEnum(
      next.status,
      VALID_DEAL_STATUSES,
      'active'
    );
  }

  if (Object.prototype.hasOwnProperty.call(next, 'icMemoStatus')) {
    next.icMemoStatus = assertOptionalEnum(
      next.icMemoStatus,
      VALID_IC_MEMO_STATUSES,
      'not_started'
    );
  }

  [
    'ownerName',
    'nextStep',
    'expectedCloseAt',
    'sector',
    'market'
  ].forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(next, field)) {
      next[field] = normalizeString(next[field]);
    }
  });

  if (Object.prototype.hasOwnProperty.call(next, 'equityValue')) {
    next.equityValue = assertFiniteNumber(next.equityValue, 'equityValue');
  }

  if (Object.prototype.hasOwnProperty.call(next, 'payload')) {
    next.payload = assertPlainObject(next.payload, 'payload');
  }

  return next;
}

function auditLogQuery(query = {}) {
  const payload = query && typeof query === 'object' ? query : {};
  const limit = Number(payload.limit || 100);

  return {
    action: normalizeString(payload.action),
    entityId: normalizeString(payload.entityId),
    entityType: normalizeString(payload.entityType || 'ma'),
    limit: Number.isFinite(limit)
      ? Math.max(1, Math.min(Math.round(limit), 500))
      : 100
  };
}

export const maValidator = {
  caseParams: {
    params: caseParams
  },
  reportParams: {
    params: reportParams
  },
  secureShareParams: {
    params: secureShareParams
  },
  dealParams: {
    params: dealParams
  },
  dataRoomDocumentParams: {
    params: dataRoomDocumentParams
  },
  create: {
    body: createCase
  },
  update: {
    params: caseParams,
    body: updateCase
  },
  snapshot: {
    params: caseParams,
    body: snapshotBody
  },
  runValuation: {
    body: snapshotBody
  },
  exportReport: {
    body: reportExport
  },
  createSecureShare: {
    params: reportParams,
    body: createSecureShare
  },
  createDataRoomDocument: {
    body: createDataRoomDocument
  },
  updateDataRoomDocumentGovernance: {
    params: dataRoomDocumentParams,
    body: updateDataRoomDocumentGovernance
  },
  createDeal: {
    body: (body) => normalizeDealBody(body)
  },
  updateDeal: {
    params: dealParams,
    body: (body) => normalizeDealBody(body, { partial: true })
  },
  auditLogs: {
    query: auditLogQuery
  }
};
