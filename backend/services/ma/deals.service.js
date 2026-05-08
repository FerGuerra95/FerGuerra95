import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';
import { getMaCaseById } from './cases.service.js';

const dealsStore = createSqliteEntityStore('ma_deals', 'ma_deal', {
  stage: 'screening',
  ownerName: '',
  priority: 'medium',
  riskLevel: 'medium',
  status: 'active',
  nextStep: '',
  icMemoStatus: 'not_started',
  payload: {}
});

const VALID_STAGES = [
  'screening',
  'nda',
  'due-diligence',
  'ic-review',
  'negotiation',
  'closing'
];
const VALID_PRIORITIES = ['low', 'medium', 'high', 'review', 'watch', 'build'];
const VALID_RISK_LEVELS = ['low', 'medium', 'high', 'controlled', 'moderate', 'elevated'];
const VALID_STATUSES = ['active', 'paused', 'completed', 'archived'];
const VALID_IC_MEMO_STATUSES = [
  'not_started',
  'draft',
  'in_review',
  'approved',
  'rejected'
];

function createError(message, status = 400, code = 'MA_DEAL_ERROR') {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function normalizeText(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function normalizeEnum(value, allowedValues, fallback) {
  const normalized = normalizeText(value || fallback).toLowerCase();
  return allowedValues.includes(normalized) ? normalized : fallback;
}

function hasOwn(object = {}, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function assignIfPresent(target, source, key, normalizer) {
  if (!hasOwn(source, key)) return;
  target[key] = normalizer(source[key]);
}

function assertOrganizationScope(organizationId) {
  if (!normalizeText(organizationId)) {
    throw createError(
      'Scope de organizacion no definido.',
      403,
      'INVALID_ORGANIZATION_SCOPE'
    );
  }
}

function assertUserScope(userId) {
  if (!normalizeText(userId)) {
    throw createError('Usuario no definido.', 403, 'USER_SCOPE_REQUIRED');
  }
}

async function assertOptionalCaseScope(caseId, organizationId) {
  if (!caseId) return;

  const item = await getMaCaseById(caseId, {
    organizationId
  });

  if (!item) {
    throw createError(
      'Caso M&A no encontrado para esta organizacion.',
      404,
      'MA_CASE_NOT_FOUND'
    );
  }
}

function expandDeal(entity) {
  if (!entity) return null;

  const payload =
    entity.payload && typeof entity.payload === 'object'
      ? entity.payload
      : {};

  return {
    ...payload,
    ...entity,
    stage: entity.stage || payload.stage || 'screening',
    ownerName: entity.ownerName || payload.ownerName || '',
    priority: entity.priority || payload.priority || 'medium',
    riskLevel: entity.riskLevel || payload.riskLevel || 'medium',
    status: entity.status || payload.status || 'active',
    nextStep: entity.nextStep || payload.nextStep || '',
    icMemoStatus: entity.icMemoStatus || payload.icMemoStatus || 'not_started'
  };
}

function normalizeDealPayload(payload = {}, { partial = false } = {}) {
  const caseId = normalizeText(payload.caseId) || null;
  const name = normalizeText(payload.name);

  if (!partial && !name) {
    throw createError('name es obligatorio.', 400, 'MA_DEAL_NAME_REQUIRED');
  }

  if (partial) {
    const patch = {};
    const payloadPatch =
      payload.payload && typeof payload.payload === 'object'
        ? { ...payload.payload }
        : {};

    if (hasOwn(payload, 'caseId')) patch.caseId = caseId;
    if (hasOwn(payload, 'name')) patch.name = name || undefined;
    assignIfPresent(patch, payload, 'stage', (value) =>
      normalizeEnum(value, VALID_STAGES, 'screening')
    );
    if (hasOwn(payload, 'ownerName') || hasOwn(payload, 'owner')) {
      patch.ownerName = normalizeText(payload.ownerName || payload.owner || '');
    }
    assignIfPresent(patch, payload, 'priority', (value) =>
      normalizeEnum(value, VALID_PRIORITIES, 'medium')
    );
    if (hasOwn(payload, 'riskLevel') || hasOwn(payload, 'risk')) {
      patch.riskLevel = normalizeEnum(
        payload.riskLevel || payload.risk,
        VALID_RISK_LEVELS,
        'medium'
      );
    }
    assignIfPresent(patch, payload, 'status', (value) =>
      normalizeEnum(value, VALID_STATUSES, 'active')
    );
    assignIfPresent(patch, payload, 'nextStep', normalizeText);
    assignIfPresent(patch, payload, 'icMemoStatus', (value) =>
      normalizeEnum(value, VALID_IC_MEMO_STATUSES, 'not_started')
    );
    if (hasOwn(payload, 'expectedCloseAt')) {
      patch.expectedCloseAt = normalizeText(payload.expectedCloseAt) || null;
    }

    if (hasOwn(payload, 'sector')) payloadPatch.sector = payload.sector || '';
    if (hasOwn(payload, 'market')) payloadPatch.market = payload.market || '';
    if (hasOwn(payload, 'equityValue')) {
      payloadPatch.equityValue = payload.equityValue ?? 0;
    }
    if (hasOwn(payload, 'source')) payloadPatch.source = payload.source || 'manual';
    if (Object.keys(payloadPatch).length > 0) patch.payload = payloadPatch;

    return patch;
  }

  return {
    ...payload,
    caseId,
    name: name || undefined,
    stage: normalizeEnum(payload.stage, VALID_STAGES, 'screening'),
    ownerName: normalizeText(payload.ownerName || payload.owner || ''),
    priority: normalizeEnum(payload.priority, VALID_PRIORITIES, 'medium'),
    riskLevel: normalizeEnum(payload.riskLevel || payload.risk, VALID_RISK_LEVELS, 'medium'),
    status: normalizeEnum(payload.status, VALID_STATUSES, 'active'),
    nextStep: normalizeText(payload.nextStep),
    icMemoStatus: normalizeEnum(
      payload.icMemoStatus,
      VALID_IC_MEMO_STATUSES,
      'not_started'
    ),
    expectedCloseAt: normalizeText(payload.expectedCloseAt) || null,
    payload: {
      ...(payload.payload && typeof payload.payload === 'object'
        ? payload.payload
        : {}),
      sector: payload.sector || payload.payload?.sector || '',
      market: payload.market || payload.payload?.market || '',
      equityValue: payload.equityValue ?? payload.payload?.equityValue ?? 0,
      source: payload.source || payload.payload?.source || 'manual'
    }
  };
}

export async function listMaDeals(scope = {}) {
  assertOrganizationScope(scope.organizationId);

  const items = await dealsStore.listByOrganization(scope.organizationId);

  return items.map(expandDeal);
}

export async function getMaDealById(id, scope = {}) {
  assertOrganizationScope(scope.organizationId);

  const item = await dealsStore.getByIdForOrganization(
    normalizeText(id),
    scope.organizationId
  );

  return expandDeal(item);
}

export async function createMaDeal(payload = {}) {
  assertOrganizationScope(payload.organizationId);
  assertUserScope(payload.userId);

  const normalizedPayload = normalizeDealPayload(payload);

  await assertOptionalCaseScope(normalizedPayload.caseId, payload.organizationId);

  const item = await dealsStore.create({
    ...normalizedPayload,
    organizationId: payload.organizationId,
    userId: payload.userId
  });

  return expandDeal(item);
}

export async function updateMaDeal(id, payload = {}, scope = {}) {
  assertOrganizationScope(scope.organizationId);

  const existing = await dealsStore.getByIdForOrganization(
    normalizeText(id),
    scope.organizationId
  );

  if (!existing) return null;

  const normalizedPayload = normalizeDealPayload(payload, {
    partial: true
  });

  await assertOptionalCaseScope(normalizedPayload.caseId, scope.organizationId);

  const patch = { ...normalizedPayload };

  if (patch.payload && typeof patch.payload === 'object') {
    patch.payload = {
      ...(existing.payload && typeof existing.payload === 'object'
        ? existing.payload
        : {}),
      ...patch.payload
    };
  }

  const item = await dealsStore.updateForOrganization(
    existing.id,
    patch,
    scope.organizationId
  );

  return expandDeal(item);
}

export async function deleteMaDeal(id, scope = {}) {
  assertOrganizationScope(scope.organizationId);

  return dealsStore.removeForOrganization(normalizeText(id), scope.organizationId);
}
