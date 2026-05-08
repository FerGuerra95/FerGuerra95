import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';

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
  source: 'Manual',
  description: ''
});

const evidenceStore = createSqliteEntityStore('compliance_evidence', 'evidence', {
  sourceType: 'manual',
  language: 'es',
  confidence: 0.7,
  sourceUrl: '',
  excerpt: '',
  translatedExcerpt: ''
});

const VALID_SOURCE_TYPES = [
  'manual',
  'internal_note',
  'external_report',
  'news',
  'document',
  'audit',
  'certification',
  'other'
];

const VALID_LANGUAGES = ['es', 'en', 'fr', 'de', 'it', 'pt', 'other'];

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

function createNotFoundError(message, code = 'NOT_FOUND') {
  const error = new Error(message);
  error.status = 404;
  error.code = code;
  return error;
}

function normalizeText(value) {
  return String(value || '').trim();
}

function normalizeNumber(value, fallback = 0.7) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeConfidence(value) {
  const number = normalizeNumber(value, 0.7);

  if (number < 0) return 0;
  if (number > 1) return 1;

  return Number(number.toFixed(2));
}

function normalizeSourceType(value) {
  const sourceType = normalizeText(value).toLowerCase() || 'manual';

  return VALID_SOURCE_TYPES.includes(sourceType) ? sourceType : 'manual';
}

function normalizeLanguage(value) {
  const language = normalizeText(value).toLowerCase() || 'es';

  return VALID_LANGUAGES.includes(language) ? language : 'other';
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
    throw createValidationError(
      'La evidencia debe estar asociada a un proveedor.',
      'EVIDENCE_SUPPLIER_REQUIRED'
    );
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

async function assertAlertBelongsToOrganization(alertId, organizationId) {
  assertOrganizationScope(organizationId);

  const normalizedAlertId = normalizeText(alertId);

  if (!normalizedAlertId) {
    return null;
  }

  const alert = await alertsStore.getByIdForOrganization(
    normalizedAlertId,
    organizationId
  );

  if (!alert) {
    throw createNotFoundError(
      'Alerta no encontrada para esta organización.',
      'ALERT_NOT_FOUND'
    );
  }

  return alert;
}

async function validateEvidenceRelations(payload = {}, organizationId) {
  assertOrganizationScope(organizationId);

  const supplierId = normalizeText(payload.supplierId);
  const alertId = normalizeText(payload.alertId);

  const supplier = await assertSupplierBelongsToOrganization(
    supplierId,
    organizationId
  );

  const alert = await assertAlertBelongsToOrganization(
    alertId,
    organizationId
  );

  if (alert && alert.supplierId && alert.supplierId !== supplier.id) {
    throw createValidationError(
      'La alerta indicada no pertenece al proveedor de esta evidencia.',
      'EVIDENCE_ALERT_SUPPLIER_MISMATCH'
    );
  }

  return {
    supplier,
    alert
  };
}

async function validateEvidencePatchRelations({
  existing,
  patch,
  organizationId
}) {
  assertOrganizationScope(organizationId);

  const nextSupplierId = Object.prototype.hasOwnProperty.call(patch, 'supplierId')
    ? normalizeText(patch.supplierId)
    : existing.supplierId;

  const nextAlertId = Object.prototype.hasOwnProperty.call(patch, 'alertId')
    ? normalizeText(patch.alertId)
    : existing.alertId;

  const supplier = await assertSupplierBelongsToOrganization(
    nextSupplierId,
    organizationId
  );

  const alert = await assertAlertBelongsToOrganization(
    nextAlertId,
    organizationId
  );

  if (alert && alert.supplierId && alert.supplierId !== supplier.id) {
    throw createValidationError(
      'La alerta indicada no pertenece al proveedor de esta evidencia.',
      'EVIDENCE_ALERT_SUPPLIER_MISMATCH'
    );
  }

  return {
    supplier,
    alert
  };
}

function normalizeEvidencePayload(payload = {}, options = {}) {
  const isPatch = Boolean(options.isPatch);
  const next = { ...payload };

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'supplierId')) {
    next.supplierId = normalizeText(next.supplierId);

    if (!next.supplierId) {
      throw createValidationError(
        'La evidencia debe estar asociada a un proveedor.',
        'EVIDENCE_SUPPLIER_REQUIRED'
      );
    }
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'title')) {
    next.title = normalizeText(next.title);

    if (!next.title) {
      throw createValidationError(
        'El título de la evidencia es obligatorio.',
        'EVIDENCE_TITLE_REQUIRED'
      );
    }
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'sourceType')) {
    next.sourceType = normalizeSourceType(next.sourceType);
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'language')) {
    next.language = normalizeLanguage(next.language);
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'confidence')) {
    next.confidence = normalizeConfidence(next.confidence);
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'alertId')) {
    next.alertId = normalizeText(next.alertId);
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'sourceUrl')) {
    next.sourceUrl = normalizeText(next.sourceUrl);
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'excerpt')) {
    next.excerpt = normalizeText(next.excerpt);
  }

  if (
    !isPatch ||
    Object.prototype.hasOwnProperty.call(next, 'translatedExcerpt')
  ) {
    next.translatedExcerpt = normalizeText(next.translatedExcerpt);
  }

  return next;
}

export const listEvidence = async (scope = {}) => {
  assertOrganizationScope(scope.organizationId);

  return evidenceStore.listByOrganization(scope.organizationId);
};

export const getEvidenceById = async (id, scope = {}) => {
  assertOrganizationScope(scope.organizationId);

  return evidenceStore.getByIdForOrganization(id, scope.organizationId);
};

export const createEvidence = async (payload = {}) => {
  assertOrganizationScope(payload.organizationId);

  const normalizedPayload = normalizeEvidencePayload(payload);

  await validateEvidenceRelations(
    normalizedPayload,
    payload.organizationId
  );

  const item = applyOwnership(
    {
      ...normalizedPayload,
      createdAt: normalizedPayload.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      organizationId: payload.organizationId,
      userId: payload.userId
    }
  );

  return evidenceStore.create(item);
};

export const updateEvidence = async (id, patch = {}, scope = {}) => {
  assertOrganizationScope(scope.organizationId);

  const existing = await evidenceStore.getByIdForOrganization(
    id,
    scope.organizationId
  );

  if (!existing) return null;

  const normalizedPatch = normalizeEvidencePayload(patch, {
    isPatch: true
  });

  await validateEvidencePatchRelations({
    existing,
    patch: normalizedPatch,
    organizationId: scope.organizationId
  });

  const safePatch = applyOwnership(
    {
      ...normalizedPatch,
      updatedAt: new Date().toISOString()
    },
    {
      organizationId: scope.organizationId,
      userId: patch.userId || existing.userId
    }
  );

  return evidenceStore.updateForOrganization(id, safePatch, scope.organizationId);
};

export const deleteEvidence = async (id, scope = {}) => {
  assertOrganizationScope(scope.organizationId);

  const existing = await evidenceStore.getByIdForOrganization(
    id,
    scope.organizationId
  );

  if (!existing) {
    return {
      deleted: false,
      id,
      reason: 'not_found',
      removed: {
        evidence: 0
      }
    };
  }

  const result = await evidenceStore.removeForOrganization(
    id,
    scope.organizationId
  );

  return {
    deleted: result.deleted,
    id,
    removed: {
      evidence: result.deleted ? 1 : 0
    }
  };
};
