import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';

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
  confidence: 0.7
});

const reviewsStore = createSqliteEntityStore('compliance_reviews', 'review', {
  status: 'pending',
  reviewer: '',
  decision: '',
  notes: ''
});

const VALID_SEVERITIES = ['low', 'medium', 'high', 'critical'];

const VALID_STATUSES = [
  'open',
  'in_review',
  'validated',
  'discarded',
  'closed'
];

const VALID_CATEGORIES = [
  'Operational Risk',
  'Geopolitical Risk',
  'Evidence Gap',
  'Manual Review',
  'ESG Risk',
  'Legal Risk',
  'General Risk'
];

function createValidationError(message, code = 'VALIDATION_ERROR') {
  const error = new Error(message);
  error.status = 400;
  error.code = code;
  return error;
}

function normalizeText(value) {
  return String(value || '').trim();
}

function normalizeSeverity(value) {
  const severity = normalizeText(value).toLowerCase() || 'medium';

  return VALID_SEVERITIES.includes(severity) ? severity : 'medium';
}

function normalizeStatus(value) {
  const status = normalizeText(value).toLowerCase() || 'open';

  return VALID_STATUSES.includes(status) ? status : 'open';
}

function normalizeCategory(value) {
  const category = normalizeText(value) || 'General Risk';

  return VALID_CATEGORIES.includes(category) ? category : 'General Risk';
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

function normalizeAlertPayload(payload = {}, options = {}) {
  const isPatch = Boolean(options.isPatch);
  const next = { ...payload };

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'supplierId')) {
    next.supplierId = normalizeText(next.supplierId);

    if (!next.supplierId) {
      throw createValidationError(
        'La alerta debe estar asociada a un proveedor.',
        'ALERT_SUPPLIER_REQUIRED'
      );
    }
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'title')) {
    next.title = normalizeText(next.title);

    if (!next.title) {
      throw createValidationError(
        'El título de la alerta es obligatorio.',
        'ALERT_TITLE_REQUIRED'
      );
    }
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'category')) {
    next.category = normalizeCategory(next.category);
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'severity')) {
    next.severity = normalizeSeverity(next.severity);
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'status')) {
    next.status = normalizeStatus(next.status);
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'source')) {
    next.source = normalizeText(next.source) || 'Manual';
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'description')) {
    next.description = normalizeText(next.description);
  }

  return next;
}

async function removeMany(store, items = []) {
  const results = [];

  for (const item of items) {
    const result = await store.remove(item.id);
    results.push(result);
  }

  return results;
}

export const listAlerts = async (scope = {}) => {
  const items = await alertsStore.list();

  return items.filter((item) =>
    belongsToOrganization(item, scope.organizationId)
  );
};

export const getAlertById = async (id, scope = {}) => {
  const item = await alertsStore.getById(id);

  if (!belongsToOrganization(item, scope.organizationId)) {
    return null;
  }

  return item;
};

export const createAlert = async (payload = {}) => {
  const normalizedPayload = normalizeAlertPayload(payload);

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

  return alertsStore.create(item);
};

export const updateAlert = async (id, patch = {}, scope = {}) => {
  const existing = await alertsStore.getById(id);

  if (!belongsToOrganization(existing, scope.organizationId)) {
    return null;
  }

  const normalizedPatch = normalizeAlertPayload(patch, {
    isPatch: true
  });

  const safePatch = applyOwnership(
    {
      ...normalizedPatch,
      updatedAt: new Date().toISOString()
    },
    {
      organizationId: scope.organizationId || existing.organizationId,
      userId: patch.userId || existing.userId
    }
  );

  return alertsStore.update(id, safePatch);
};

export const deleteAlert = async (id, scope = {}) => {
  const existing = await alertsStore.getById(id);

  if (!belongsToOrganization(existing, scope.organizationId)) {
    return {
      deleted: false,
      id,
      reason: 'not_found'
    };
  }

  const allEvidence = await evidenceStore.list();

  const removedEvidence = allEvidence.filter((item) => {
    return (
      belongsToOrganization(item, scope.organizationId) &&
      item.alertId === id
    );
  });

  const allReviews = await reviewsStore.list();

  const removedReviews = allReviews.filter((review) => {
    return (
      belongsToOrganization(review, scope.organizationId) &&
      review.alertId === id
    );
  });

  await removeMany(evidenceStore, removedEvidence);
  await removeMany(reviewsStore, removedReviews);

  const alertResult = await alertsStore.remove(id);

  return {
    deleted: alertResult.deleted,
    id,
    removed: {
      alerts: alertResult.deleted ? 1 : 0,
      evidence: removedEvidence.length,
      reviews: removedReviews.length
    }
  };
};