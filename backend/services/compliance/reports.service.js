import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';

const suppliersStore = createSqliteEntityStore('compliance_suppliers', 'supplier', {
  status: 'active',
  tier: 'Tier 1',
  criticality: 'Media',
  spend: 0,
  riskScore: 50,
  resilienceScore: 50
});

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
  executiveSummary: null,
  items: []
});

const VALID_STATUSES = ['draft', 'generated', 'exported', 'archived'];
const VALID_SCOPES = ['supplier', 'portfolio', 'alert', 'custom'];

function createForbiddenError(message, code = 'INVALID_ORGANIZATION_SCOPE') {
  const error = new Error(message);
  error.status = 403;
  error.code = code;
  return error;
}

function createNotFoundError(message, code = 'NOT_FOUND') {
  const error = new Error(message);
  error.status = 404;
  error.code = code;
  return error;
}

function normalizeText(value) {
  return String(value || '').trim();
}

function normalizeStatus(value) {
  const status = normalizeText(value) || 'generated';

  return VALID_STATUSES.includes(status) ? status : 'generated';
}

function normalizeScope(value) {
  const scope = normalizeText(value) || 'supplier';

  return VALID_SCOPES.includes(scope) ? scope : 'supplier';
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

function normalizeRecommendations(value) {
  return Array.isArray(value)
    ? value.map((item) => normalizeText(item)).filter(Boolean)
    : [];
}

function buildPosture({ riskScore, resilienceScore, riskLevel }) {
  const risk = Number(riskScore);
  const resilience = Number(resilienceScore);

  if (Number.isFinite(risk) && risk >= 76) return 'Critical legal risk';
  if (normalizeText(riskLevel).toLowerCase().includes('critical')) {
    return 'Critical legal risk';
  }
  if (Number.isFinite(risk) && risk >= 56) return 'High risk under review';
  if (Number.isFinite(resilience) && resilience >= 75) {
    return 'Controlled with evidence';
  }

  return 'Monitoring required';
}

export function buildComplianceExecutiveSummary(payload = {}) {
  const riskScore = normalizeScore(payload.riskScore);
  const resilienceScore = normalizeScore(payload.resilienceScore);
  const recommendations = normalizeRecommendations(payload.recommendations);
  const evidenceSummary =
    payload.evidenceSummary && typeof payload.evidenceSummary === 'object'
      ? payload.evidenceSummary
      : {};
  const evidenceCoverage = normalizeScore(
    evidenceSummary.coverage ??
      evidenceSummary.evidenceCoverage ??
      payload.evidenceCoverage
  );
  const title = normalizeText(payload.title) || 'Compliance Report';
  const supplierName = normalizeText(payload.supplierName);
  const headline = payload.summary
    ? normalizeText(payload.summary)
    : supplierName
      ? `${supplierName} compliance posture reviewed for executive decision.`
      : 'Portfolio compliance posture reviewed for executive decision.';

  return {
    version: 'compliance-executive-summary-v1',
    title,
    scope: normalizeScope(payload.scope),
    headline,
    posture: buildPosture({
      riskScore,
      resilienceScore,
      riskLevel: payload.riskLevel
    }),
    risk: {
      score: riskScore,
      level: normalizeLevel(payload.riskLevel)
    },
    resilience: {
      score: resilienceScore,
      level: normalizeLevel(payload.resilienceLevel)
    },
    evidence: {
      coverage: evidenceCoverage,
      summary: evidenceSummary
    },
    recommendationCount: recommendations.length,
    topRecommendations: recommendations.slice(0, 5),
    overviewSignals: {
      legalScore:
        riskScore === null ? null : Math.max(0, Math.min(100, 100 - riskScore)),
      evidenceCoverage,
      boardReady:
        riskScore !== null &&
        riskScore < 56 &&
        (evidenceCoverage === null || evidenceCoverage >= 60)
    },
    hubIntegration: {
      executiveOverviewEligible: true,
      schema: 'ceo_os_compliance_hub_v1'
    }
  };
}

function assertOrganizationScope(organizationId) {
  if (!organizationId) {
    throw createForbiddenError(
      'Scope de organización no definido. No se puede operar sin organizationId.'
    );
  }
}

function belongsToOrganization(item, organizationId) {
  if (!item) return false;
  if (!organizationId) return false;
  if (!item.organizationId) return false;

  return item.organizationId === organizationId;
}

function applyOwnership(payload = {}, scope = {}) {
  return {
    ...payload,
    organizationId: scope.organizationId || '',
    userId: scope.userId || ''
  };
}

async function assertSupplierBelongsToOrganization(supplierId, organizationId) {
  assertOrganizationScope(organizationId);

  const normalizedSupplierId = normalizeText(supplierId);

  if (!normalizedSupplierId) {
    return null;
  }

  const supplier = await suppliersStore.getByIdForOrganization(
    normalizedSupplierId,
    organizationId
  );

  if (!supplier) {
    throw createNotFoundError(
      'Proveedor no encontrado para esta organización.',
      'SUPPLIER_NOT_FOUND'
    );
  }

  return supplier;
}

function normalizeReportPayload(payload = {}) {
  const recommendations = normalizeRecommendations(payload.recommendations);
  const basePayload = {
    ...payload,
    recommendations
  };
  const executiveSummary =
    payload.executiveSummary && typeof payload.executiveSummary === 'object'
      ? payload.executiveSummary
      : buildComplianceExecutiveSummary(basePayload);

  return {
    ...payload,
    title: normalizeText(payload.title) || 'Compliance Report',
    supplierId: normalizeText(payload.supplierId),
    supplierName: normalizeText(payload.supplierName),
    scope: normalizeScope(payload.scope),
    status: normalizeStatus(payload.status),
    type: 'compliance',
    summary: normalizeText(payload.summary),
    riskLevel: normalizeLevel(payload.riskLevel),
    resilienceLevel: normalizeLevel(payload.resilienceLevel),
    riskScore: normalizeScore(payload.riskScore),
    resilienceScore: normalizeScore(payload.resilienceScore),
    recommendations,
    evidenceSummary: payload.evidenceSummary || null,
    executiveSummary,
    items: Array.isArray(payload.items) ? payload.items : []
  };
}

export const listReports = async (scope = {}) => {
  assertOrganizationScope(scope.organizationId);

  return reportsStore.listByOrganization(scope.organizationId);
};

export const getReportById = async (id, scope = {}) => {
  assertOrganizationScope(scope.organizationId);

  return reportsStore.getByIdForOrganization(id, scope.organizationId);
};

export const createComplianceReport = async (payload = {}) => {
  assertOrganizationScope(payload.organizationId);

  const normalizedPayload = normalizeReportPayload(payload);

  await assertSupplierBelongsToOrganization(
    normalizedPayload.supplierId,
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

  return reportsStore.create(item);
};

export const updateComplianceReport = async (id, patch = {}, scope = {}) => {
  assertOrganizationScope(scope.organizationId);

  const existing = await reportsStore.getByIdForOrganization(
    id,
    scope.organizationId
  );

  if (!existing) return null;

  const normalizedPatch = normalizeReportPayload({
    ...existing,
    ...patch
  });

  await assertSupplierBelongsToOrganization(
    normalizedPatch.supplierId,
    scope.organizationId
  );

  const safePatch = applyOwnership(
    {
      ...normalizedPatch,
      id: existing.id,
      createdAt: existing.createdAt,
      type: 'compliance',
      updatedAt: new Date().toISOString()
    },
    {
      organizationId: scope.organizationId,
      userId: patch.userId || existing.userId
    }
  );

  return reportsStore.updateForOrganization(id, safePatch, scope.organizationId);
};

export const deleteComplianceReport = async (id, scope = {}) => {
  assertOrganizationScope(scope.organizationId);

  const existing = await reportsStore.getByIdForOrganization(
    id,
    scope.organizationId
  );

  if (!existing) {
    return {
      deleted: false,
      id,
      reason: 'not_found',
      removed: {
        reports: 0
      }
    };
  }

  const result = await reportsStore.removeForOrganization(
    id,
    scope.organizationId
  );

  return {
    deleted: result.deleted,
    id,
    removed: {
      reports: result.deleted ? 1 : 0
    }
  };
};
