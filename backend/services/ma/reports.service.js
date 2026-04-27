import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';

const reportsStore = createSqliteEntityStore('ma_reports', 'ma_report', {
  status: 'generated',
  type: 'ma',
  title: 'M&A Report',
  payload: {}
});

function normalizeText(value) {
  return String(value || '').trim();
}

function belongsToOrganization(item, organizationId) {
  if (!item) return false;

  // Compatibilidad con datos antiguos sin organizationId.
  if (!item.organizationId) return true;

  return item.organizationId === organizationId;
}

function applyOwnership(payload = {}, scope = {}) {
  return {
    ...payload,
    organizationId: scope.organizationId || payload.organizationId || '',
    userId: scope.userId || payload.userId || ''
  };
}

function normalizeReportPayload(payload = {}) {
  const title =
    normalizeText(payload.title) ||
    normalizeText(payload.name) ||
    'M&A Report';

  const caseId = normalizeText(payload.caseId || payload.case_id);

  return {
    ...payload,
    caseId,
    title,
    type: 'ma',
    status: normalizeText(payload.status) || 'generated',
    payload: {
      ...payload,
      caseId,
      title,
      type: 'ma',
      status: normalizeText(payload.status) || 'generated'
    }
  };
}

function expandReport(entity) {
  if (!entity) return null;

  const payload = entity.payload && typeof entity.payload === 'object'
    ? entity.payload
    : {};

  return {
    ...payload,
    ...entity,
    type: 'ma'
  };
}

export const listMaReports = async (scope = {}) => {
  const items = await reportsStore.list();

  return items
    .filter((item) => belongsToOrganization(item, scope.organizationId))
    .map(expandReport);
};

export const getMaReportById = async (id, scope = {}) => {
  const item = await reportsStore.getById(id);

  if (!belongsToOrganization(item, scope.organizationId)) {
    return null;
  }

  return expandReport(item);
};

export const createMaReport = async (payload = {}) => {
  const normalizedPayload = normalizeReportPayload(payload);

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
  const existing = await reportsStore.getById(id);

  if (!belongsToOrganization(existing, scope.organizationId)) {
    return {
      deleted: false,
      id,
      reason: 'not_found'
    };
  }

  return reportsStore.remove(id);
};