import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';
import { getMaCaseById } from './cases.service.js';

const reportsStore = createSqliteEntityStore('ma_reports', 'ma_report', {
  status: 'generated',
  type: 'ma',
  title: 'M&A Report',
  payload: {}
});

const VALID_REPORT_STATUSES = [
  'draft',
  'generated',
  'exported',
  'archived'
];

function createForbiddenError(message, code = 'INVALID_ORGANIZATION_SCOPE') {
  const error = new Error(message);
  error.status = 403;
  error.code = code;
  return error;
}

function normalizeText(value) {
  return String(value || '').trim();
}

function normalizeStatus(value) {
  const status = normalizeText(value) || 'generated';

  return VALID_REPORT_STATUSES.includes(status) ? status : 'generated';
}

function assertOrganizationScope(organizationId) {
  if (!organizationId) {
    throw createForbiddenError(
      'Scope de organización no definido. No se puede operar sin organizationId.'
    );
  }
}

function applyOwnership(payload = {}, scope = {}) {
  return {
    ...payload,
    organizationId: scope.organizationId || '',
    userId: scope.userId || ''
  };
}

async function assertCaseBelongsToOrganization(caseId, organizationId) {
  if (!caseId) return;

  const item = await getMaCaseById(caseId, {
    organizationId
  });

  if (!item) {
    const error = new Error('Caso M&A no encontrado para esta organizacion.');
    error.status = 404;
    error.code = 'MA_CASE_NOT_FOUND';
    throw error;
  }
}

function normalizeReportPayload(payload = {}) {
  const title =
    normalizeText(payload.title) ||
    normalizeText(payload.name) ||
    'M&A Report';

  const caseId = normalizeText(payload.caseId || payload.case_id) || null;
  const status = normalizeStatus(payload.status);

  return {
    ...payload,
    caseId,
    title,
    type: 'ma',
    status,
    payload: {
      ...(payload.payload && typeof payload.payload === 'object'
        ? payload.payload
        : {}),
      ...payload,
      caseId,
      title,
      type: 'ma',
      status
    }
  };
}

function expandReport(entity) {
  if (!entity) return null;

  const payload =
    entity.payload && typeof entity.payload === 'object'
      ? entity.payload
      : {};

  return {
    ...payload,
    ...entity,
    type: 'ma'
  };
}

export const listMaReports = async (scope = {}) => {
  assertOrganizationScope(scope.organizationId);

  const items = await reportsStore.listByOrganization(scope.organizationId);

  return items.map(expandReport);
};

export const getMaReportById = async (id, scope = {}) => {
  assertOrganizationScope(scope.organizationId);

  const item = await reportsStore.getByIdForOrganization(
    id,
    scope.organizationId
  );

  if (!item) return null;

  return expandReport(item);
};

export const createMaReport = async (payload = {}) => {
  assertOrganizationScope(payload.organizationId);

  const normalizedPayload = normalizeReportPayload(payload);

  await assertCaseBelongsToOrganization(
    normalizedPayload.caseId,
    payload.organizationId
  );

  const item = applyOwnership(
    {
      ...normalizedPayload,
      createdAt: payload.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      organizationId: payload.organizationId,
      userId: payload.userId
    }
  );

  const created = await reportsStore.create(item);

  return expandReport(created);
};

export const deleteMaReport = async (id, scope = {}) => {
  assertOrganizationScope(scope.organizationId);

  const existing = await reportsStore.getByIdForOrganization(
    id,
    scope.organizationId
  );

  if (!existing) {
    return {
      deleted: false,
      id,
      reason: 'not_found'
    };
  }

  return reportsStore.removeForOrganization(id, scope.organizationId);
};
