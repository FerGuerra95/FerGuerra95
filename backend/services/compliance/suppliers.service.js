import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';
import {
  complianceChangedFields,
  recordComplianceAudit
} from './complianceAudit.service.js';

const suppliersStore = createSqliteEntityStore('compliance_suppliers', 'supplier', {
  status: 'active',
  tier: 'Tier 1',
  criticality: 'Media',
  spend: 0,
  riskScore: 50,
  resilienceScore: 50
});

const alertsStore = createSqliteEntityStore('compliance_alerts', 'alert', {
  status: 'open',
  severity: 'medium',
  category: 'General Risk',
  source: 'Manual'
});

const evidenceStore = createSqliteEntityStore('compliance_evidence', 'evidence', {
  sourceType: 'manual',
  language: 'es',
  confidence: 0.7
});

const reviewsStore = createSqliteEntityStore('compliance_reviews', 'review', {
  status: 'pending',
  reviewer: '',
  decision: '',
  notes: ''
});

const reportsStore = createSqliteEntityStore('compliance_reports', 'compliance_report', {
  status: 'generated',
  type: 'compliance'
});

const VALID_STATUSES = ['active', 'watchlist', 'inactive', 'blocked'];
const VALID_TIERS = ['Tier 1', 'Tier 2', 'Tier 3'];
const VALID_CRITICALITIES = ['Baja', 'Media', 'Alta', 'Crítica'];

function createValidationError(message, code = 'VALIDATION_ERROR') {
  const error = new Error(message);
  error.status = 400;
  error.code = code;
  return error;
}

function createForbiddenError(message, code = 'INVALID_ORGANIZATION_SCOPE') {
  const error = new Error(message);
  error.status = 403;
  error.code = code;
  return error;
}

function createConflictError(message, code = 'DUPLICATE_SUPPLIER') {
  const error = new Error(message);
  error.status = 409;
  error.code = code;
  return error;
}

function normalizeText(value) {
  return String(value || '').trim();
}

function normalizeComparableText(value) {
  return normalizeText(value).toLowerCase();
}

function normalizeNumber(value, fallback = 0) {
  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function clampScore(value, fallback = 50) {
  const number = normalizeNumber(value, fallback);

  if (number < 0) return 0;
  if (number > 100) return 100;

  return Math.round(number);
}

function normalizeSpend(value) {
  const number = normalizeNumber(value, 0);

  if (number < 0) return 0;

  return Math.round(number);
}

function normalizeStatus(value) {
  const status = normalizeText(value) || 'active';

  return VALID_STATUSES.includes(status) ? status : 'active';
}

function normalizeTier(value) {
  const tier = normalizeText(value) || 'Tier 1';

  return VALID_TIERS.includes(tier) ? tier : 'Tier 1';
}

function normalizeCriticality(value) {
  const criticality = normalizeText(value) || 'Media';

  return VALID_CRITICALITIES.includes(criticality) ? criticality : 'Media';
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

function normalizeSupplierPayload(payload = {}, options = {}) {
  const isPatch = Boolean(options.isPatch);
  const next = { ...payload };

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'name')) {
    next.name = normalizeText(next.name);

    if (!next.name) {
      throw createValidationError(
        'El nombre del proveedor es obligatorio.',
        'SUPPLIER_NAME_REQUIRED'
      );
    }
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'country')) {
    next.country = normalizeText(next.country) || 'Sin país';
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'region')) {
    next.region = normalizeText(next.region) || 'Sin región';
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'sector')) {
    next.sector = normalizeText(next.sector) || 'General';
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'tier')) {
    next.tier = normalizeTier(next.tier);
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'criticality')) {
    next.criticality = normalizeCriticality(next.criticality);
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'status')) {
    next.status = normalizeStatus(next.status);
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'spend')) {
    next.spend = normalizeSpend(next.spend);
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'riskScore')) {
    next.riskScore = clampScore(next.riskScore, 50);
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'resilienceScore')) {
    next.resilienceScore = clampScore(next.resilienceScore, 50);
  }

  return next;
}

async function assertNoDuplicateSupplierName({
  name,
  organizationId,
  excludeId = ''
}) {
  assertOrganizationScope(organizationId);

  const normalizedName = normalizeComparableText(name);

  if (!normalizedName) return;

  const items = await suppliersStore.listByOrganization(organizationId);

  const duplicated = items.find((item) => {
    if (excludeId && item.id === excludeId) return false;

    return normalizeComparableText(item.name) === normalizedName;
  });

  if (duplicated) {
    throw createConflictError(
      'Ya existe un proveedor con ese nombre en esta organización.',
      'DUPLICATE_SUPPLIER_NAME'
    );
  }
}

async function removeMany(store, items = [], organizationId = '') {
  const results = [];

  for (const item of items) {
    const result = await store.removeForOrganization(item.id, organizationId);
    results.push(result);
  }

  return results;
}

export const listSuppliers = async (scope = {}) => {
  assertOrganizationScope(scope.organizationId);

  return suppliersStore.listByOrganization(scope.organizationId);
};

export const getSupplierById = async (id, scope = {}) => {
  assertOrganizationScope(scope.organizationId);

  return suppliersStore.getByIdForOrganization(id, scope.organizationId);
};

export const createSupplier = async (payload = {}) => {
  assertOrganizationScope(payload.organizationId);

  const normalizedPayload = normalizeSupplierPayload(payload);

  await assertNoDuplicateSupplierName({
    name: normalizedPayload.name,
    organizationId: payload.organizationId
  });

  const item = applyOwnership(
    {
      ...normalizedPayload,
      lastReviewAt: normalizedPayload.lastReviewAt || new Date().toISOString()
    },
    {
      organizationId: payload.organizationId,
      userId: payload.userId
    }
  );

  const created = await suppliersStore.create(item);

  await recordComplianceAudit({
    organizationId: payload.organizationId,
    userId: payload.userId,
    action: 'compliance.supplier.created',
    entityType: 'compliance_supplier',
    entityId: created.id,
    metadata: {
      name: created.name,
      status: created.status,
      tier: created.tier,
      criticality: created.criticality
    }
  });

  return created;
};

export const updateSupplier = async (id, patch = {}, scope = {}) => {
  assertOrganizationScope(scope.organizationId);

  const existing = await suppliersStore.getByIdForOrganization(
    id,
    scope.organizationId
  );

  if (!existing) return null;

  const normalizedPatch = normalizeSupplierPayload(patch, {
    isPatch: true
  });

  if (Object.prototype.hasOwnProperty.call(normalizedPatch, 'name')) {
    await assertNoDuplicateSupplierName({
      name: normalizedPatch.name,
      organizationId: scope.organizationId,
      excludeId: id
    });
  }

  const safePatch = applyOwnership(
    {
      ...normalizedPatch,
      lastReviewAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      organizationId: scope.organizationId,
      userId: patch.userId || existing.userId
    }
  );

  const updated = await suppliersStore.updateForOrganization(
    id,
    safePatch,
    scope.organizationId
  );

  if (updated) {
    await recordComplianceAudit({
      organizationId: scope.organizationId,
      userId: patch.userId || existing.userId,
      action: 'compliance.supplier.updated',
      entityType: 'compliance_supplier',
      entityId: updated.id,
      metadata: {
        changedFields: complianceChangedFields(existing, normalizedPatch, [
          'name',
          'status',
          'tier',
          'criticality',
          'riskScore',
          'resilienceScore',
          'spend'
        ]),
        status: updated.status
      }
    });
  }

  return updated;
};

export const deleteSupplier = async (id, scope = {}) => {
  assertOrganizationScope(scope.organizationId);

  const existing = await suppliersStore.getByIdForOrganization(
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

  const allAlerts = await alertsStore.listByOrganization(scope.organizationId);

  const removedAlerts = allAlerts.filter((alert) => {
    return alert.supplierId === id;
  });

  const removedAlertIds = new Set(removedAlerts.map((alert) => alert.id));

  const allEvidence = await evidenceStore.listByOrganization(scope.organizationId);

  const removedEvidence = allEvidence.filter((item) => {
    return item.supplierId === id || removedAlertIds.has(item.alertId);
  });

  const allReviews = await reviewsStore.listByOrganization(scope.organizationId);

  const removedReviews = allReviews.filter((review) => {
    return review.supplierId === id || removedAlertIds.has(review.alertId);
  });

  const allReports = await reportsStore.listByOrganization(scope.organizationId);

  const removedReports = allReports.filter((report) => {
    return report.supplierId === id;
  });

  await removeMany(evidenceStore, removedEvidence, scope.organizationId);
  await removeMany(reviewsStore, removedReviews, scope.organizationId);
  await removeMany(reportsStore, removedReports, scope.organizationId);
  await removeMany(alertsStore, removedAlerts, scope.organizationId);

  const supplierResult = await suppliersStore.removeForOrganization(
    id,
    scope.organizationId
  );

  if (supplierResult.deleted) {
    await recordComplianceAudit({
      organizationId: scope.organizationId,
      userId: scope.userId || existing.userId,
      action: 'compliance.supplier.deleted',
      entityType: 'compliance_supplier',
      entityId: id,
      metadata: {
        name: existing.name,
        status: existing.status
      }
    });
  }

  return {
    deleted: supplierResult.deleted,
    id,
    removed: {
      suppliers: supplierResult.deleted ? 1 : 0,
      alerts: removedAlerts.length,
      evidence: removedEvidence.length,
      reviews: removedReviews.length,
      reports: removedReports.length
    }
  };
};
