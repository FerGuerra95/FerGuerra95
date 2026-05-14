import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';
import { listAuditLogs, recordAuditLog } from '../audit/auditLog.service.js';

const assetsStore = createSqliteEntityStore('heritage_assets', 'heritage_asset', {
  name: 'Heritage asset',
  assetType: 'Operating company',
  jurisdiction: '',
  estimatedValue: 0,
  protectionStatus: 'mapped',
  liquidityProfile: 'medium',
  owner: 'Owner',
  riskLevel: 'medium',
  payload: {}
});

const successionsStore = createSqliteEntityStore('heritage_successions', 'heritage_succession', {
  title: 'Succession protocol',
  status: 'draft',
  owner: 'Family Office',
  successor: '',
  readiness: 0,
  effectiveDate: '',
  evidenceStatus: 'pending',
  payload: {}
});

const protectionsStore = createSqliteEntityStore('heritage_protections', 'heritage_protection', {
  name: 'Asset protection control',
  domain: 'Legal',
  status: 'active',
  owner: 'Heritage Lead',
  coverage: 60,
  reviewCadence: 'quarterly',
  lastReviewAt: '',
  nextReviewAt: '',
  payload: {}
});

const reportsStore = createSqliteEntityStore('heritage_reports', 'heritage_report', {
  title: 'Heritage Continuity Report',
  status: 'generated',
  reportType: 'continuity',
  payload: {}
});

const documentsStore = createSqliteEntityStore('heritage_documents', 'heritage_document', {
  title: 'Heritage document',
  documentType: 'evidence',
  classification: 'confidential',
  status: 'registered',
  owner: 'Heritage Lead',
  linkedEntityType: '',
  linkedEntityId: '',
  evidenceStatus: 'pending',
  reviewDueAt: '',
  payload: {}
});

function createError(message, status = 400, code = 'HERITAGE_ERROR') {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function normalizeText(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function normalizeNumber(value, fallback = 0) {
  if (value === '' || value === null || value === undefined) return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(normalizeNumber(value))));
}

function assertOrganizationId(organizationId) {
  if (!normalizeText(organizationId)) {
    throw createError('Scope de organizacion no definido.', 403, 'INVALID_SCOPE');
  }
}

function sanitizeAsset(payload = {}, { requireName = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  if (requireName || source.name !== undefined) next.name = normalizeText(source.name, 'Heritage asset') || 'Heritage asset';
  ['assetType', 'jurisdiction', 'protectionStatus', 'liquidityProfile', 'owner', 'riskLevel'].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeText(source[key]);
  });
  if (source.estimatedValue !== undefined) next.estimatedValue = normalizeNumber(source.estimatedValue);
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

function sanitizeSuccession(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  if (requireTitle || source.title !== undefined) next.title = normalizeText(source.title, 'Succession protocol') || 'Succession protocol';
  ['status', 'owner', 'successor', 'effectiveDate', 'evidenceStatus'].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeText(source[key]);
  });
  if (source.readiness !== undefined) next.readiness = clampScore(source.readiness);
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

function sanitizeProtection(payload = {}, { requireName = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  if (requireName || source.name !== undefined) next.name = normalizeText(source.name, 'Asset protection control') || 'Asset protection control';
  ['domain', 'status', 'owner', 'reviewCadence', 'lastReviewAt', 'nextReviewAt'].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeText(source[key]);
  });
  if (source.coverage !== undefined) next.coverage = clampScore(source.coverage);
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

function sanitizeDocument(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  if (requireTitle || source.title !== undefined) next.title = normalizeText(source.title, 'Heritage document') || 'Heritage document';
  [
    'documentType',
    'classification',
    'status',
    'owner',
    'linkedEntityType',
    'linkedEntityId',
    'evidenceStatus',
    'reviewDueAt'
  ].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeText(source[key]);
  });
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

function sanitizeReport(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  if (requireTitle || source.title !== undefined) next.title = normalizeText(source.title, 'Heritage Continuity Report') || 'Heritage Continuity Report';
  ['status', 'reportType'].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeText(source[key]);
  });
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

async function recordHeritageAudit({ organizationId, userId, action, entityId = '', metadata = {} }) {
  if (!normalizeText(userId)) return;
  try {
    await recordAuditLog({
      organizationId,
      userId,
      action,
      entityType: 'heritage',
      entityId,
      metadata
    });
  } catch {
    // Heritage audit never blocks owner continuity workflows.
  }
}

export async function listHeritageAssets(organizationId) {
  assertOrganizationId(organizationId);
  return assetsStore.listByOrganization(organizationId);
}

export async function createHeritageAsset(organizationId, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const created = await assetsStore.create({
    ...sanitizeAsset(payload, { requireName: true }),
    organizationId,
    userId: normalizeText(actor.userId) || null
  });
  await recordHeritageAudit({ organizationId, userId: actor.userId, action: 'heritage.asset.created', entityId: created.id });
  return created;
}

export async function updateHeritageAsset(organizationId, id, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const updated = await assetsStore.updateForOrganization(normalizeText(id), sanitizeAsset(payload), organizationId);
  if (updated) await recordHeritageAudit({ organizationId, userId: actor.userId, action: 'heritage.asset.updated', entityId: updated.id });
  return updated;
}

export async function listHeritageSuccessions(organizationId) {
  assertOrganizationId(organizationId);
  return successionsStore.listByOrganization(organizationId);
}

export async function createHeritageSuccession(organizationId, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const created = await successionsStore.create({
    ...sanitizeSuccession(payload, { requireTitle: true }),
    organizationId,
    userId: normalizeText(actor.userId) || null
  });
  await recordHeritageAudit({ organizationId, userId: actor.userId, action: 'heritage.succession.created', entityId: created.id });
  return created;
}

export async function updateHeritageSuccession(organizationId, id, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const updated = await successionsStore.updateForOrganization(normalizeText(id), sanitizeSuccession(payload), organizationId);
  if (updated) await recordHeritageAudit({ organizationId, userId: actor.userId, action: 'heritage.succession.updated', entityId: updated.id });
  return updated;
}

export async function listHeritageProtections(organizationId) {
  assertOrganizationId(organizationId);
  return protectionsStore.listByOrganization(organizationId);
}

export async function createHeritageProtection(organizationId, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const created = await protectionsStore.create({
    ...sanitizeProtection(payload, { requireName: true }),
    organizationId,
    userId: normalizeText(actor.userId) || null
  });
  await recordHeritageAudit({ organizationId, userId: actor.userId, action: 'heritage.protection.created', entityId: created.id });
  return created;
}

export async function updateHeritageProtection(organizationId, id, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const updated = await protectionsStore.updateForOrganization(normalizeText(id), sanitizeProtection(payload), organizationId);
  if (updated) await recordHeritageAudit({ organizationId, userId: actor.userId, action: 'heritage.protection.updated', entityId: updated.id });
  return updated;
}

export async function deleteHeritageAsset(organizationId, id, actor = {}) {
  assertOrganizationId(organizationId);
  const result = await assetsStore.removeForOrganization(normalizeText(id), organizationId);
  if (result.deleted) await recordHeritageAudit({ organizationId, userId: actor.userId, action: 'heritage.asset.deleted', entityId: id });
  return result;
}

export async function deleteHeritageSuccession(organizationId, id, actor = {}) {
  assertOrganizationId(organizationId);
  const result = await successionsStore.removeForOrganization(normalizeText(id), organizationId);
  if (result.deleted) await recordHeritageAudit({ organizationId, userId: actor.userId, action: 'heritage.succession.deleted', entityId: id });
  return result;
}

export async function deleteHeritageProtection(organizationId, id, actor = {}) {
  assertOrganizationId(organizationId);
  const result = await protectionsStore.removeForOrganization(normalizeText(id), organizationId);
  if (result.deleted) await recordHeritageAudit({ organizationId, userId: actor.userId, action: 'heritage.protection.deleted', entityId: id });
  return result;
}

export async function listHeritageDocuments(organizationId) {
  assertOrganizationId(organizationId);
  return documentsStore.listByOrganization(organizationId);
}

export async function createHeritageDocument(organizationId, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const created = await documentsStore.create({
    ...sanitizeDocument(payload, { requireTitle: true }),
    organizationId,
    userId: normalizeText(actor.userId) || null
  });
  await recordHeritageAudit({ organizationId, userId: actor.userId, action: 'heritage.document.created', entityId: created.id });
  return created;
}

export async function updateHeritageDocument(organizationId, id, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const updated = await documentsStore.updateForOrganization(normalizeText(id), sanitizeDocument(payload), organizationId);
  if (updated) await recordHeritageAudit({ organizationId, userId: actor.userId, action: 'heritage.document.updated', entityId: updated.id });
  return updated;
}

export async function listHeritageReports(organizationId) {
  assertOrganizationId(organizationId);
  return reportsStore.listByOrganization(organizationId);
}

export async function createHeritageReport(organizationId, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const created = await reportsStore.create({
    ...sanitizeReport(payload, { requireTitle: true }),
    organizationId,
    userId: normalizeText(actor.userId) || null
  });
  await recordHeritageAudit({ organizationId, userId: actor.userId, action: 'heritage.report.created', entityId: created.id });
  return created;
}

export function summarizeHeritage({ assets = [], successions = [], protections = [] } = {}) {
  const protectedAssets = assets.filter((item) =>
    ['protected', 'ring_fenced', 'insured', 'secured'].includes(normalizeText(item.protectionStatus).toLowerCase())
  );
  const liquidityRiskAssets = assets.filter((item) =>
    ['low', 'illiquid', 'restricted'].includes(normalizeText(item.liquidityProfile).toLowerCase()) ||
    ['high', 'critical'].includes(normalizeText(item.riskLevel).toLowerCase())
  );
  const completeSuccessions = successions.filter((item) =>
    ['approved', 'active', 'ready'].includes(normalizeText(item.status).toLowerCase())
  );
  const evidenceReady = successions.filter((item) =>
    ['ready', 'approved', 'complete'].includes(normalizeText(item.evidenceStatus).toLowerCase())
  );
  const successionReadiness =
    successions.length > 0
      ? clampScore(successions.reduce((sum, item) => sum + normalizeNumber(item.readiness), 0) / successions.length)
      : 0;
  const assetProtectionCoverage =
    assets.length > 0 ? clampScore((protectedAssets.length / assets.length) * 100) : 0;
  const controlCoverage =
    protections.length > 0
      ? clampScore(protections.reduce((sum, item) => sum + normalizeNumber(item.coverage), 0) / protections.length)
      : 55;
  const weakProtections = protections.filter((item) => normalizeNumber(item.coverage) < 60);
  const evidenceReadiness = successions.length > 0 ? clampScore((evidenceReady.length / successions.length) * 100) : 0;
  const successionClosureRate = successions.length > 0 ? clampScore((completeSuccessions.length / successions.length) * 100) : 0;
  const totalAssetValue = Math.round(assets.reduce((sum, item) => sum + normalizeNumber(item.estimatedValue), 0));
  const continuityScore = clampScore(
    assetProtectionCoverage * 0.28 +
      successionReadiness * 0.3 +
      controlCoverage * 0.24 +
      evidenceReadiness * 0.1 +
      successionClosureRate * 0.08 -
      weakProtections.length * 4 -
      liquidityRiskAssets.length * 3
  );

  return {
    assetsCount: assets.length,
    totalAssetValue,
    protectedAssetsCount: protectedAssets.length,
    liquidityRiskCount: liquidityRiskAssets.length,
    successionsCount: successions.length,
    openSuccessionItemsCount: successions.length - completeSuccessions.length,
    successionReadiness,
    successionClosureRate,
    evidenceReadiness,
    protectionsCount: protections.length,
    weakProtectionsCount: weakProtections.length,
    protectionCoverage: clampScore((assetProtectionCoverage + controlCoverage) / 2),
    assetProtectionCoverage,
    controlCoverage,
    continuityScore,
    score: continuityScore
  };
}

export async function getHeritageSummary(scope = {}) {
  assertOrganizationId(scope.organizationId);
  const [assets, successions, protections, documents, reports] = await Promise.all([
    listHeritageAssets(scope.organizationId),
    listHeritageSuccessions(scope.organizationId),
    listHeritageProtections(scope.organizationId),
    listHeritageDocuments(scope.organizationId),
    listHeritageReports(scope.organizationId)
  ]);
  const metrics = summarizeHeritage({ assets, successions, protections });
  const pendingDocuments = documents.filter((item) =>
    normalizeText(item.evidenceStatus, 'pending').toLowerCase() !== 'ready'
  );
  const reviewDueDocuments = documents.filter((item) => {
    const due = normalizeText(item.reviewDueAt);
    return due && new Date(due).getTime() <= Date.now() + 1000 * 60 * 60 * 24 * 45;
  });
  const requiresExecutiveAttention =
    metrics.score < 65 ||
    metrics.openSuccessionItemsCount > 0 ||
    metrics.weakProtectionsCount > 0 ||
    metrics.liquidityRiskCount > 0 ||
    pendingDocuments.length > 0;
  const heritageStatus =
    assets.length + successions.length + protections.length === 0
      ? 'insufficient_data'
      : metrics.score >= 78 && !requiresExecutiveAttention
      ? 'strong'
      : metrics.score >= 65
      ? 'watch'
      : metrics.score >= 45
      ? 'risk'
      : 'blocked';

  return {
    version: 'heritage-summary-v1',
    organizationId: scope.organizationId,
    generatedAt: new Date().toISOString(),
    continuityScore: metrics.score,
    heritageStatus,
    requiresExecutiveAttention,
    metrics: {
      ...metrics,
      documentsCount: documents.length,
      reportsCount: reports.length,
      pendingEvidenceDocumentsCount: pendingDocuments.length,
      reviewDueDocumentsCount: reviewDueDocuments.length,
      boardReadinessScore: clampScore(
        metrics.score * 0.55 +
          metrics.evidenceReadiness * 0.18 +
          metrics.protectionCoverage * 0.17 +
          (pendingDocuments.length === 0 ? 10 : 0) -
          reviewDueDocuments.length * 4
      )
    },
    latest: {
      asset: assets[0] || null,
      succession: successions[0] || null,
      protection: protections[0] || null,
      report: reports[0] || null
    }
  };
}

export async function getHeritageDashboard(scope = {}) {
  const summary = await getHeritageSummary(scope);
  const [assets, successions, protections, documents, reports, auditLogs] = await Promise.all([
    listHeritageAssets(scope.organizationId),
    listHeritageSuccessions(scope.organizationId),
    listHeritageProtections(scope.organizationId),
    listHeritageDocuments(scope.organizationId),
    listHeritageReports(scope.organizationId),
    listHeritageAuditLogs(scope.organizationId, { limit: 12 })
  ]);

  return {
    ...summary,
    assets,
    successions,
    protections,
    documents,
    reports,
    auditLogs,
    humanReviewPosture:
      summary.requiresExecutiveAttention
        ? 'Human review required before ownership, funding, M&A or board action.'
        : 'Human review cadence aligned; maintain legal, tax and family-office review.'
  };
}

export function buildHeritageBridgeSignals(summary = {}) {
  const metrics = summary.metrics || {};
  const signals = [];

  if ((metrics.openSuccessionItemsCount || 0) > 0 || (metrics.successionReadiness || 0) < 65) {
    signals.push({
      type: 'heritage.succession_risk_affects_governance',
      severity: 'high',
      message: 'Succession readiness requires Governance review before strategic ownership events.'
    });
  }

  if ((metrics.liquidityRiskCount || 0) > 0) {
    signals.push({
      type: 'heritage.asset_liquidity_risk_affects_funding',
      severity: 'medium',
      message: 'Illiquid or high-risk assets may affect funding capacity and covenant narratives.'
    });
  }

  if ((metrics.weakProtectionsCount || 0) > 0 || (metrics.protectionCoverage || 0) < 65) {
    signals.push({
      type: 'heritage.protection_gap_affects_compliance',
      severity: 'high',
      message: 'Protection gaps should be reviewed with Compliance, legal counsel and asset owners.'
    });
  }

  if ((metrics.boardReadinessScore || 0) >= 75) {
    signals.push({
      type: 'heritage.board_review_ready',
      severity: 'low',
      message: 'Heritage continuity package is ready for board-level review.'
    });
  } else {
    signals.push({
      type: 'heritage.board_review_required',
      severity: 'medium',
      message: 'Board readiness remains below enterprise threshold; close evidence and protection gaps.'
    });
  }

  return signals;
}

export async function getHeritageBridgeSignals(scope = {}) {
  const summary = await getHeritageSummary(scope);
  return {
    organizationId: scope.organizationId,
    generatedAt: new Date().toISOString(),
    signals: buildHeritageBridgeSignals(summary)
  };
}

export async function getHeritageExecutiveHubBrief(scope = {}) {
  assertOrganizationId(scope.organizationId);
  const [assets, successions, protections, documents, reports] = await Promise.all([
    listHeritageAssets(scope.organizationId),
    listHeritageSuccessions(scope.organizationId),
    listHeritageProtections(scope.organizationId),
    listHeritageDocuments(scope.organizationId),
    listHeritageReports(scope.organizationId)
  ]);
  const metrics = summarizeHeritage({ assets, successions, protections });
  const summary = await getHeritageSummary(scope);
  return {
    version: 'heritage-executive-hub-v1',
    organizationId: scope.organizationId,
    generatedAt: new Date().toISOString(),
    score: summary.continuityScore,
    posture: summary.continuityScore >= 75 ? 'Owner legacy protected' : 'Formalize succession controls',
    title: assets[0]?.name || successions[0]?.title || 'Legacy infrastructure foundation',
    metrics: {
      ...metrics,
      documentsCount: documents.length,
      reportsCount: reports.length,
      pendingEvidenceDocumentsCount: summary.metrics.pendingEvidenceDocumentsCount,
      reviewDueDocumentsCount: summary.metrics.reviewDueDocumentsCount,
      boardReadinessScore: summary.metrics.boardReadinessScore,
      heritageStatus: summary.heritageStatus,
      requiresExecutiveAttention: summary.requiresExecutiveAttention
    },
    latestAsset: assets[0] || null
  };
}

export async function generateHeritageContinuityReport(scope = {}, options = {}) {
  assertOrganizationId(scope.organizationId);
  const [assets, successions, protections, documents] = await Promise.all([
    listHeritageAssets(scope.organizationId),
    listHeritageSuccessions(scope.organizationId),
    listHeritageProtections(scope.organizationId),
    listHeritageDocuments(scope.organizationId)
  ]);
  const metrics = summarizeHeritage({ assets, successions, protections });
  const criticalItems = [
    ...assets
      .filter((item) => ['high', 'critical'].includes(normalizeText(item.riskLevel).toLowerCase()))
      .map((item) => ({ type: 'asset', title: item.name, rationale: 'High patrimonial risk' })),
    ...successions
      .filter((item) => normalizeNumber(item.readiness) < 65)
      .map((item) => ({ type: 'succession', title: item.title, rationale: 'Succession readiness below threshold' })),
    ...protections
      .filter((item) => normalizeNumber(item.coverage) < 60)
      .map((item) => ({ type: 'protection', title: item.name, rationale: 'Protection coverage below threshold' }))
  ];
  const recommendations = [
    metrics.liquidityRiskCount > 0
      ? 'Review illiquid or high-risk assets and define board-level mitigation owners.'
      : 'Maintain asset liquidity monitoring on the current governance cadence.',
    metrics.openSuccessionItemsCount > 0
      ? 'Close open succession protocols with evidence, successor role clarity and effective dates.'
      : 'Maintain succession protocols as controlled evidence.',
    metrics.weakProtectionsCount > 0
      ? 'Upgrade weak protection controls before any ownership, funding or M&A event.'
      : 'Keep protection controls aligned with legal, insurance and tax review cadence.'
  ];

  return createHeritageReport(
    scope.organizationId,
    {
      title: options.title || 'Heritage Continuity Report',
      status: 'generated',
      reportType: 'continuity',
      payload: {
        generatedAt: new Date().toISOString(),
        metrics,
        assets,
        successions,
        protections,
        documents,
        criticalItems,
        recommendations
      }
    },
    { userId: scope.userId }
  );
}

export async function listHeritageAuditLogs(organizationId, filters = {}) {
  assertOrganizationId(organizationId);
  return listAuditLogs({
    organizationId,
    entityType: 'heritage',
    action: filters.action || '',
    entityId: filters.entityId || '',
    limit: filters.limit || 100
  });
}

export default {
  listHeritageAssets,
  createHeritageAsset,
  updateHeritageAsset,
  listHeritageSuccessions,
  createHeritageSuccession,
  updateHeritageSuccession,
  listHeritageProtections,
  createHeritageProtection,
  updateHeritageProtection,
  deleteHeritageAsset,
  deleteHeritageSuccession,
  deleteHeritageProtection,
  listHeritageDocuments,
  createHeritageDocument,
  updateHeritageDocument,
  listHeritageReports,
  createHeritageReport,
  getHeritageSummary,
  getHeritageDashboard,
  buildHeritageBridgeSignals,
  getHeritageBridgeSignals,
  generateHeritageContinuityReport,
  listHeritageAuditLogs,
  getHeritageExecutiveHubBrief
};
