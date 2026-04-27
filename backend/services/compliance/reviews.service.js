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

const reviewsStore = createSqliteEntityStore('compliance_reviews', 'review', {
  status: 'pending',
  reviewer: '',
  decision: '',
  notes: ''
});

const VALID_STATUSES = ['pending', 'decided'];
const VALID_DECISIONS = ['validated', 'discarded', 'needs_more_evidence'];

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

function normalizeStatus(value) {
  const status = normalizeText(value).toLowerCase() || 'pending';

  return VALID_STATUSES.includes(status) ? status : 'pending';
}

function normalizeDecision(value, options = {}) {
  const allowEmpty = options.allowEmpty !== false;
  const decision = normalizeText(value).toLowerCase();

  if (!decision && allowEmpty) {
    return '';
  }

  if (!VALID_DECISIONS.includes(decision)) {
    throw createValidationError(
      'La decisión debe ser validated, discarded o needs_more_evidence.',
      'REVIEW_DECISION_INVALID'
    );
  }

  return decision;
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
      'La revisión debe estar asociada a un proveedor.',
      'REVIEW_SUPPLIER_REQUIRED'
    );
  }

  const supplier = await suppliersStore.getById(normalizedSupplierId);

  if (!belongsToOrganization(supplier, organizationId)) {
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
    throw createValidationError(
      'La revisión debe estar asociada a una alerta.',
      'REVIEW_ALERT_REQUIRED'
    );
  }

  const alert = await alertsStore.getById(normalizedAlertId);

  if (!belongsToOrganization(alert, organizationId)) {
    throw createNotFoundError(
      'Alerta no encontrada para esta organización.',
      'ALERT_NOT_FOUND'
    );
  }

  return alert;
}

async function validateReviewRelations(payload = {}, organizationId) {
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

  if (alert.supplierId && alert.supplierId !== supplier.id) {
    throw createValidationError(
      'La alerta indicada no pertenece al proveedor de esta revisión.',
      'REVIEW_ALERT_SUPPLIER_MISMATCH'
    );
  }

  return {
    supplier,
    alert
  };
}

async function validateReviewPatchRelations({
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

  if (alert.supplierId && alert.supplierId !== supplier.id) {
    throw createValidationError(
      'La alerta indicada no pertenece al proveedor de esta revisión.',
      'REVIEW_ALERT_SUPPLIER_MISMATCH'
    );
  }

  return {
    supplier,
    alert
  };
}

function normalizeReviewPayload(payload = {}, options = {}) {
  const isPatch = Boolean(options.isPatch);
  const next = { ...payload };

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'alertId')) {
    next.alertId = normalizeText(next.alertId);

    if (!next.alertId) {
      throw createValidationError(
        'La revisión debe estar asociada a una alerta.',
        'REVIEW_ALERT_REQUIRED'
      );
    }
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'supplierId')) {
    next.supplierId = normalizeText(next.supplierId);

    if (!next.supplierId) {
      throw createValidationError(
        'La revisión debe estar asociada a un proveedor.',
        'REVIEW_SUPPLIER_REQUIRED'
      );
    }
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'status')) {
    next.status = normalizeStatus(next.status);
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'reviewer')) {
    next.reviewer = normalizeText(next.reviewer);
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'decision')) {
    next.decision = normalizeDecision(next.decision);
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'notes')) {
    next.notes = normalizeText(next.notes);
  }

  return next;
}

function normalizeDecisionPayload(payload = {}) {
  const reviewer = normalizeText(payload.reviewer);
  const decision = normalizeDecision(payload.decision, {
    allowEmpty: false
  });
  const notes = normalizeText(payload.notes);

  if (!reviewer) {
    throw createValidationError(
      'El revisor es obligatorio para cerrar una revisión.',
      'REVIEW_REVIEWER_REQUIRED'
    );
  }

  return {
    reviewer,
    decision,
    notes
  };
}

export const listReviews = async (scope = {}) => {
  assertOrganizationScope(scope.organizationId);

  const items = await reviewsStore.list();

  return items.filter((item) =>
    belongsToOrganization(item, scope.organizationId)
  );
};

export const getReviewById = async (id, scope = {}) => {
  assertOrganizationScope(scope.organizationId);

  const item = await reviewsStore.getById(id);

  if (!belongsToOrganization(item, scope.organizationId)) {
    return null;
  }

  return item;
};

export const createReviewDecision = async (payload = {}) => {
  assertOrganizationScope(payload.organizationId);

  const normalizedPayload = normalizeReviewPayload(payload);

  await validateReviewRelations(
    normalizedPayload,
    payload.organizationId
  );

  const item = applyOwnership(
    {
      ...normalizedPayload,
      status: normalizedPayload.status || 'pending',
      createdAt: normalizedPayload.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      organizationId: payload.organizationId,
      userId: payload.userId
    }
  );

  return reviewsStore.create(item);
};

export const updateReviewDecision = async (id, patch = {}, scope = {}) => {
  assertOrganizationScope(scope.organizationId);

  const existing = await reviewsStore.getById(id);

  if (!belongsToOrganization(existing, scope.organizationId)) {
    return null;
  }

  const normalizedPatch = normalizeReviewPayload(patch, {
    isPatch: true
  });

  await validateReviewPatchRelations({
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

  return reviewsStore.update(id, safePatch);
};

export const deleteReviewDecision = async (id, scope = {}) => {
  assertOrganizationScope(scope.organizationId);

  const existing = await reviewsStore.getById(id);

  if (!belongsToOrganization(existing, scope.organizationId)) {
    return {
      deleted: false,
      id,
      reason: 'not_found',
      removed: {
        reviews: 0
      }
    };
  }

  const result = await reviewsStore.remove(id);

  return {
    deleted: result.deleted,
    id,
    removed: {
      reviews: result.deleted ? 1 : 0
    }
  };
};

export async function decideReview(id, payload = {}, scope = {}) {
  assertOrganizationScope(scope.organizationId);

  const existing = await reviewsStore.getById(id);

  if (!belongsToOrganization(existing, scope.organizationId)) {
    return null;
  }

  const decisionPayload = normalizeDecisionPayload(payload);
  const decidedAt = new Date().toISOString();

  const safePatch = applyOwnership(
    {
      status: 'decided',
      reviewer: decisionPayload.reviewer,
      decision: decisionPayload.decision,
      notes: decisionPayload.notes,
      decidedAt,
      updatedAt: decidedAt
    },
    {
      organizationId: scope.organizationId,
      userId: payload.userId || existing.userId
    }
  );

  return reviewsStore.update(id, safePatch);
}