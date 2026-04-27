import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';

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
  const items = await evidenceStore.list();

  return items.filter((item) =>
    belongsToOrganization(item, scope.organizationId)
  );
};

export const getEvidenceById = async (id, scope = {}) => {
  const item = await evidenceStore.getById(id);

  if (!belongsToOrganization(item, scope.organizationId)) {
    return null;
  }

  return item;
};

export const createEvidence = async (payload = {}) => {
  const normalizedPayload = normalizeEvidencePayload(payload);

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
  const existing = await evidenceStore.getById(id);

  if (!belongsToOrganization(existing, scope.organizationId)) {
    return null;
  }

  const normalizedPatch = normalizeEvidencePayload(patch, {
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

  return evidenceStore.update(id, safePatch);
};

export const deleteEvidence = async (id, scope = {}) => {
  const existing = await evidenceStore.getById(id);

  if (!belongsToOrganization(existing, scope.organizationId)) {
    return {
      deleted: false,
      id,
      reason: 'not_found',
      removed: {
        evidence: 0
      }
    };
  }

  const result = await evidenceStore.remove(id);

  return {
    deleted: result.deleted,
    id,
    removed: {
      evidence: result.deleted ? 1 : 0
    }
  };
};