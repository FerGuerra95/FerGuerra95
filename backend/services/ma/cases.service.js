import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';

const casesStore = createSqliteEntityStore('ma_cases', 'ma_case', {
  status: 'draft',
  financials: {},
  settings: {},
  snapshot: null,
  snapshots: []
});

const VALID_STATUSES = ['draft', 'active', 'completed', 'archived'];

const NUMERIC_FINANCIAL_FIELDS = [
  'revenue',
  'ebitda',
  'normalizedEbitda',
  'adjustedEbitda',
  'currentEbitda',
  'ebitdaAdjustments',
  'netDebt',
  'cash',
  'debt',
  'workingCapital',
  'targetWorkingCapital',
  'transactionFees',
  'taxRate',
  'growthRate',
  'customerConcentration',
  'ownerDependency'
];

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

function createConflictError(message, code = 'DUPLICATE_MA_CASE') {
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
  if (value === '' || value === null || value === undefined) {
    return fallback;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : fallback;
}

function normalizeStatus(value) {
  const status = normalizeText(value) || 'draft';

  return VALID_STATUSES.includes(status) ? status : 'draft';
}

function normalizeSourceIds(value) {
  const sourceIds = Array.isArray(value) ? value : [];

  return [...new Set(sourceIds.map(normalizeText).filter(Boolean))];
}

function normalizeEvidenceDocuments(documents = [], scope = {}) {
  return Array.isArray(documents)
    ? documents
        .filter((item) => item && typeof item === 'object')
        .map((item, index) => ({
          ...item,
          id: normalizeText(item.id || item.documentId) || `ma_doc_${Date.now()}_${index}`,
          title:
            normalizeText(item.title || item.documentTitle || item.name) ||
            `Evidence document ${index + 1}`,
          sourceType: normalizeText(item.sourceType || item.type) || 'document',
          status: normalizeText(item.status) || 'linked',
          version: normalizeText(item.version) || 'current',
          sourceUrl: normalizeText(item.sourceUrl || item.url),
          sourceIds: normalizeSourceIds([
            item.sourceId,
            ...(Array.isArray(item.sourceIds) ? item.sourceIds : []),
            ...(Array.isArray(item.linkedSourceIds) ? item.linkedSourceIds : [])
          ]),
          organizationId: scope.organizationId || '',
          userId: scope.userId || ''
        }))
        .filter((item) => item.sourceIds.length > 0)
    : [];
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

function extractCaseName(payload = {}) {
  return normalizeText(payload.name || payload.financials?.name);
}

function extractSector(payload = {}) {
  return normalizeText(payload.sector || payload.financials?.sector);
}

function normalizeFinancials(financials = {}, caseName = '') {
  const next = {
    ...(financials || {})
  };

  if (caseName) {
    next.name = caseName;
  }

  next.sector = normalizeText(next.sector);

  NUMERIC_FINANCIAL_FIELDS.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(next, key)) {
      next[key] = normalizeNumber(next[key], 0);
    }
  });

  return next;
}

function normalizeSettings(settings = {}, scope = {}) {
  return {
    ...(settings || {}),
    reportCurrency: normalizeText(settings?.reportCurrency) || 'EUR',
    scenarioMode: normalizeText(settings?.scenarioMode) || 'balanced',
    evidenceDocuments: normalizeEvidenceDocuments(
      settings?.evidenceDocuments,
      scope
    )
  };
}

function getEbitdaValue(financials = {}) {
  if (financials.normalizedEbitda !== undefined) {
    return Number(financials.normalizedEbitda);
  }

  if (financials.adjustedEbitda !== undefined) {
    return Number(financials.adjustedEbitda);
  }

  if (financials.currentEbitda !== undefined) {
    return Number(financials.currentEbitda);
  }

  if (financials.ebitda !== undefined) {
    return Number(financials.ebitda);
  }

  return null;
}

function validateCasePayload(payload = {}, options = {}) {
  const isPatch = Boolean(options.isPatch);
  const scope = options.scope || {};
  const next = {
    ...payload
  };

  const hasNameInput =
    Object.prototype.hasOwnProperty.call(next, 'name') ||
    Object.prototype.hasOwnProperty.call(next, 'financials');

  if (!isPatch || hasNameInput) {
    const caseName = extractCaseName(next);

    if (!caseName) {
      throw createValidationError(
        'El nombre del deal M&A es obligatorio.',
        'MA_CASE_NAME_REQUIRED'
      );
    }

    next.name = caseName;
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'financials')) {
    const caseName = extractCaseName(next);
    const normalizedFinancials = normalizeFinancials(
      next.financials || {},
      caseName
    );

    const sector = extractSector({
      ...next,
      financials: normalizedFinancials
    });

    if (!sector) {
      throw createValidationError(
        'El sector del deal M&A es obligatorio.',
        'MA_CASE_SECTOR_REQUIRED'
      );
    }

    normalizedFinancials.sector = sector;

    const ebitdaValue = getEbitdaValue(normalizedFinancials);

    if (
      ebitdaValue !== null &&
      (!Number.isFinite(ebitdaValue) || ebitdaValue <= 0)
    ) {
      throw createValidationError(
        'El EBITDA del deal M&A debe ser mayor que 0.',
        'MA_CASE_EBITDA_INVALID'
      );
    }

    next.financials = normalizedFinancials;
    next.sector = sector;
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'settings')) {
    next.settings = normalizeSettings(next.settings || {}, scope);
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'status')) {
    next.status = normalizeStatus(next.status);
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'snapshot')) {
    next.snapshot = next.snapshot || null;
  }

  if (!isPatch || Object.prototype.hasOwnProperty.call(next, 'snapshots')) {
    next.snapshots = Array.isArray(next.snapshots) ? next.snapshots : [];
  }

  return next;
}

async function assertNoDuplicateCaseName({
  name,
  organizationId,
  excludeId = ''
}) {
  assertOrganizationScope(organizationId);

  const normalizedName = normalizeComparableText(name);

  if (!normalizedName) return;

  const items = await casesStore.listByOrganization(organizationId);

  const duplicated = items.find((item) => {
    if (excludeId && item.id === excludeId) return false;

    return (
      normalizeComparableText(item.name || item.financials?.name) ===
      normalizedName
    );
  });

  if (duplicated) {
    throw createConflictError(
      'Ya existe un deal M&A con ese nombre en esta organización.',
      'DUPLICATE_MA_CASE_NAME'
    );
  }
}

function normalizeSnapshot(snapshot = {}, scope = {}) {
  const currentTime = new Date().toISOString();

  return applyOwnership(
    {
      ...(snapshot || {}),
      id: snapshot.id || `snapshot_${Date.now()}`,
      createdAt: snapshot.createdAt || currentTime,
      updatedAt: currentTime
    },
    {
      organizationId: scope.organizationId,
      userId: scope.userId
    }
  );
}

export const listMaCases = async (scope = {}) => {
  assertOrganizationScope(scope.organizationId);

  return casesStore.listByOrganization(scope.organizationId);
};

export const getMaCaseById = async (id, scope = {}) => {
  assertOrganizationScope(scope.organizationId);

  return casesStore.getByIdForOrganization(id, scope.organizationId);
};

export const createMaCase = async (payload = {}) => {
  assertOrganizationScope(payload.organizationId);

  const normalizedPayload = validateCasePayload(payload, {
    scope: {
      organizationId: payload.organizationId,
      userId: payload.userId
    }
  });

  await assertNoDuplicateCaseName({
    name: normalizedPayload.name,
    organizationId: payload.organizationId
  });

  const item = applyOwnership(
    {
      ...normalizedPayload,
      snapshot: normalizedPayload.snapshot || payload.snapshot || null,
      snapshots: Array.isArray(normalizedPayload.snapshots)
        ? normalizedPayload.snapshots
        : [],
      createdAt: normalizedPayload.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      organizationId: payload.organizationId,
      userId: payload.userId
    }
  );

  return casesStore.create(item);
};

export const updateMaCase = async (id, patch = {}, scope = {}) => {
  assertOrganizationScope(scope.organizationId);

  const existing = await casesStore.getByIdForOrganization(
    id,
    scope.organizationId
  );

  if (!existing) return null;

  const normalizedPatch = validateCasePayload(patch, {
    isPatch: true,
    scope: {
      organizationId: scope.organizationId,
      userId: patch.userId || existing.userId
    }
  });

  if (
    Object.prototype.hasOwnProperty.call(normalizedPatch, 'name') ||
    Object.prototype.hasOwnProperty.call(normalizedPatch, 'financials')
  ) {
    await assertNoDuplicateCaseName({
      name: normalizedPatch.name || normalizedPatch.financials?.name,
      organizationId: scope.organizationId,
      excludeId: id
    });
  }

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

  return casesStore.updateForOrganization(id, safePatch, scope.organizationId);
};

export const deleteMaCase = async (id, scope = {}) => {
  assertOrganizationScope(scope.organizationId);

  const existing = await casesStore.getByIdForOrganization(
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

  return casesStore.removeForOrganization(id, scope.organizationId);
};

export async function addMaSnapshot(caseId, snapshot = {}, scope = {}) {
  assertOrganizationScope(scope.organizationId);

  const item = await casesStore.getByIdForOrganization(
    caseId,
    scope.organizationId
  );

  if (!item) return null;

  const currentTime = new Date().toISOString();

  const nextSnapshot = normalizeSnapshot(snapshot, {
    organizationId: scope.organizationId,
    userId: snapshot.userId || item.userId
  });

  const nextSnapshots = [
    nextSnapshot,
    ...(item.snapshots || [])
  ];

  return casesStore.updateForOrganization(
    caseId,
    {
      snapshots: nextSnapshots,
      lastSnapshotAt: currentTime,
      updatedAt: currentTime,
      organizationId: scope.organizationId,
      userId: item.userId || snapshot.userId || ''
    },
    scope.organizationId
  );
}
