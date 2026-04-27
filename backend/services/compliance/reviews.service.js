import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';

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

function normalizeText(value) {
  return String(value || '').trim();
}

function normalizeStatus(value) {
  const status = normalizeText(value).toLowerCase() || 'pending';

  return VALID_STATUSES.includes(status) ? status : 'pending';
}

function normalizeDecision(value) {
  const decision = normalizeText(value).toLowerCase();

  if (!decision) return '';

  return VALID_DECISIONS.includes(decision) ? decision : '';
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
  const decision = normalizeDecision(payload.decision);
  const notes = normalizeText(payload.notes);

  if (!reviewer) {
    throw createValidationError(
      'El revisor es obligatorio para cerrar una revisión.',
      'REVIEW_REVIEWER_REQUIRED'
    );
  }

  if (!decision) {
    throw createValidationError(
      'La decisión debe ser validated, discarded o needs_more_evidence.',
      'REVIEW_DECISION_INVALID'
    );
  }

  return {
    reviewer,
    decision,
    notes
  };
}

export const listReviews = async (scope = {}) => {
  const items = await reviewsStore.list();

  return items.filter((item) =>
    belongsToOrganization(item, scope.organizationId)
  );
};

export const getReviewById = async (id, scope = {}) => {
  const item = await reviewsStore.getById(id);

  if (!belongsToOrganization(item, scope.organizationId)) {
    return null;
  }

  return item;
};

export const createReviewDecision = async (payload = {}) => {
  const normalizedPayload = normalizeReviewPayload(payload);

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
  const existing = await reviewsStore.getById(id);

  if (!belongsToOrganization(existing, scope.organizationId)) {
    return null;
  }

  const normalizedPatch = normalizeReviewPayload(patch, {
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

  return reviewsStore.update(id, safePatch);
};

export const deleteReviewDecision = async (id, scope = {}) => {
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
      organizationId: scope.organizationId || existing.organizationId,
      userId: payload.userId || existing.userId
    }
  );

  return reviewsStore.update(id, safePatch);
}