import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';

const reportsStore = createSqliteEntityStore('compliance_reports', 'compliance_report', {
  status: 'generated',
  type: 'compliance',
  scope: 'supplier',
  title: 'Compliance Report',
  supplierName: '',
  summary: '',
  riskLevel: '',
  resilienceLevel: '',
  recommendations: [],
  evidenceSummary: null,
  items: []
});

function normalizeText(value) {
  return String(value || '').trim();
}

function normalizeLevel(value) {
  if (value && typeof value === 'object') {
    return normalizeText(value.label || value.name || value.value);
  }

  return normalizeText(value);
}

function normalizeScore(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
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
  return {
    ...payload,
    title: normalizeText(payload.title) || 'Compliance Report',
    supplierId: normalizeText(payload.supplierId),
    supplierName: normalizeText(payload.supplierName),
    scope: normalizeText(payload.scope) || 'supplier',
    status: normalizeText(payload.status) || 'generated',
    type: 'compliance',
    summary: normalizeText(payload.summary),
    riskLevel: normalizeLevel(payload.riskLevel),
    resilienceLevel: normalizeLevel(payload.resilienceLevel),
    riskScore: normalizeScore(payload.riskScore),
    resilienceScore: normalizeScore(payload.resilienceScore),
    recommendations: Array.isArray(payload.recommendations)
      ? payload.recommendations
      : [],
    evidenceSummary: payload.evidenceSummary || null,
    items: Array.isArray(payload.items) ? payload.items : []
  };
}

export const listReports = async (scope = {}) => {
  const items = await reportsStore.list();

  return items.filter((item) =>
    belongsToOrganization(item, scope.organizationId)
  );
};

export const getReportById = async (id, scope = {}) => {
  const item = await reportsStore.getById(id);

  if (!belongsToOrganization(item, scope.organizationId)) {
    return null;
  }

  return item;
};

export const createComplianceReport = async (payload = {}) => {
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

  return reportsStore.create(item);
};

export const updateComplianceReport = async (id, patch = {}, scope = {}) => {
  const existing = await reportsStore.getById(id);

  if (!belongsToOrganization(existing, scope.organizationId)) {
    return null;
  }

  const normalizedPatch = normalizeReportPayload({
    ...existing,
    ...patch
  });

  const safePatch = applyOwnership(
    {
      ...normalizedPatch,
      id: existing.id,
      createdAt: existing.createdAt,
      type: 'compliance',
      updatedAt: new Date().toISOString()
    },
    {
      organizationId: scope.organizationId || existing.organizationId,
      userId: patch.userId || existing.userId
    }
  );

  return reportsStore.update(id, safePatch);
};

export const deleteComplianceReport = async (id, scope = {}) => {
  const existing = await reportsStore.getById(id);

  if (!belongsToOrganization(existing, scope.organizationId)) {
    return {
      deleted: false,
      id,
      reason: 'not_found',
      removed: {
        reports: 0
      }
    };
  }

  const result = await reportsStore.remove(id);

  return {
    deleted: result.deleted,
    id,
    removed: {
      reports: result.deleted ? 1 : 0
    }
  };
};