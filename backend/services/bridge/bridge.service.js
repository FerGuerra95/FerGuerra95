import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';
import { listAuditLogs, recordAuditLog } from '../audit/auditLog.service.js';
import { getExecutiveComplianceHubBrief } from '../compliance/executiveHub.service.js';
import { getMaDealById, listMaDeals } from '../ma/deals.service.js';
import { listByOrganization as listFundingRounds } from '../funding/funding.service.js';
import { getFundingSummary } from '../funding/funding.service.js';
import { getGovernanceSummary } from '../governance/governance.service.js';
import { getPmiSummary } from '../pmi/pmi.service.js';
import { getRiskSummary } from '../risk/risk.service.js';
import { getReportingSummary } from '../reporting/reporting.service.js';
import { getStrategySummary } from '../strategy/strategy.service.js';

const opportunitiesStore = createSqliteEntityStore('bridge_opportunities', 'bridge_opp', {
  title: 'Bridge opportunity',
  sourceBranch: 'manual',
  sourceId: '',
  counterpartyType: 'Strategic buyer',
  sector: 'General',
  geography: 'Europe',
  stage: 'Qualification',
  qualificationStatus: 'verified',
  opportunityValue: 0,
  probability: 35,
  status: 'active',
  owner: 'Bridge Lead',
  ndaStatus: 'required',
  redactionLevel: 'redacted_teaser',
  dataRoomAccess: 'none',
  boardApprovalRequired: 1,
  nextStep: '',
  payload: {}
});

const counterpartiesStore = createSqliteEntityStore('bridge_counterparties', 'bridge_cp', {
  name: 'Bridge counterparty',
  counterpartyType: 'Strategic buyer',
  sectorFocus: 'General',
  geography: 'Europe',
  ticketMin: 0,
  ticketMax: 0,
  riskAppetite: 'Medium',
  kycStatus: 'review',
  ndaStatus: 'required',
  contactOwner: 'Bridge Lead',
  status: 'active',
  score: '',
  payload: {}
});

const introductionsStore = createSqliteEntityStore('bridge_introductions', 'bridge_intro', {
  opportunityId: '',
  counterpartyId: '',
  counterpartyName: '',
  status: 'drafted',
  ndaStatus: 'required',
  introducedAt: '',
  nextStep: '',
  payload: {}
});

const reportsStore = createSqliteEntityStore('bridge_reports', 'bridge_report', {
  title: 'Bridge Network Memo',
  status: 'generated',
  reportType: 'network_memo',
  opportunityId: '',
  payload: {}
});

const documentsStore = createSqliteEntityStore('bridge_documents', 'bridge_document', {
  title: 'Bridge document',
  documentType: 'teaser',
  classification: 'confidential',
  status: 'registered',
  owner: 'Bridge Lead',
  opportunityId: '',
  counterpartyId: '',
  ndaStatus: 'required',
  redactionLevel: 'redacted_teaser',
  payload: {}
});

const signalsStore = createSqliteEntityStore('bridge_signals', 'bridge_signal', {
  sourceModule: '',
  targetModule: '',
  signalType: 'cross_module_signal',
  severity: 'watch',
  title: 'Bridge signal',
  description: '',
  recommendedAction: '',
  evidence: [],
  status: 'open',
  owner: 'Executive Office',
  dueDate: '',
  confidenceLevel: 60,
  staleFlag: 0,
  humanReviewStatus: 'required',
  acknowledgedAt: '',
  resolvedAt: '',
  dismissedAt: '',
  dismissalReason: '',
  payload: {}
});

const dependenciesStore = createSqliteEntityStore('bridge_dependencies', 'bridge_dependency', {
  sourceModule: '',
  targetModule: '',
  sourceEntityId: '',
  targetEntityId: '',
  dependencyType: 'operational',
  blockingFlag: 0,
  status: 'open',
  owner: 'Executive Office',
  resolutionNote: '',
  payload: {}
});

const conflictsStore = createSqliteEntityStore('bridge_conflicts', 'bridge_conflict', {
  conflictType: 'cross_module_conflict',
  sourceModule: '',
  targetModule: '',
  severity: 'risk',
  title: 'Bridge conflict',
  description: '',
  mitigation: '',
  status: 'open',
  owner: 'Executive Office',
  evidence: [],
  payload: {}
});

const attentionQueueStore = createSqliteEntityStore('bridge_attention_queue', 'bridge_attention', {
  sourceSignalId: '',
  title: 'Executive attention item',
  priorityScore: 0,
  severity: 'watch',
  owner: 'Executive Office',
  dueDate: '',
  recommendedAction: '',
  status: 'open',
  payload: {}
});

const evidenceLinksStore = createSqliteEntityStore('bridge_evidence_links', 'bridge_evidence', {
  signalId: '',
  sourceModule: '',
  sourceEntityId: '',
  linkLabel: '',
  evidenceQuality: 'medium',
  humanReviewNote: '',
  payload: {}
});

const snapshotsStore = createSqliteEntityStore('bridge_snapshots', 'bridge_snapshot', {
  title: 'CEO Bridge Snapshot',
  status: 'generated',
  snapshotType: 'ceo_bridge_snapshot',
  payload: {}
});

const signalHistoryStore = createSqliteEntityStore('bridge_signal_history', 'bridge_signal_hist', {
  signalId: '',
  action: 'updated',
  fromStatus: '',
  toStatus: '',
  notes: '',
  payload: {}
});

function createError(message, status = 400, code = 'BRIDGE_ERROR') {
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

function normalizeBoolean(value, fallback = false) {
  if (value === true || value === 'true' || value === 1 || value === '1') return true;
  if (value === false || value === 'false' || value === 0 || value === '0') return false;
  return fallback;
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function actorId(actor = {}) {
  return normalizeText(actor.userId || actor.id);
}

function commonCreate(organizationId, actor = {}) {
  const userId = actorId(actor);
  return {
    organizationId,
    userId,
    createdBy: userId
  };
}

function severityRank(value) {
  const severity = normalizeText(value).toLowerCase();
  if (severity === 'blocked') return 5;
  if (severity === 'critical') return 4;
  if (severity === 'risk') return 3;
  if (severity === 'watch') return 2;
  if (severity === 'info') return 1;
  return 2;
}

function todayMs() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

function isPastDate(value) {
  const safe = normalizeText(value);
  if (!safe) return false;
  const date = new Date(safe);
  if (Number.isNaN(date.getTime())) return false;
  date.setHours(0, 0, 0, 0);
  return date.getTime() < todayMs();
}

function isStaleSignal(signal = {}) {
  if (normalizeBoolean(signal.staleFlag)) return true;
  const updated = new Date(signal.updatedAt || signal.createdAt || 0).getTime();
  if (!Number.isFinite(updated) || updated <= 0) return false;
  return Date.now() - updated > 14 * 24 * 60 * 60 * 1000;
}

function expandOpportunity(item, introductions = []) {
  if (!item) return null;
  return {
    ...item,
    boardApprovalRequired: normalizeBoolean(item.boardApprovalRequired),
    introductionLedger: introductions.filter((intro) => intro.opportunityId === item.id),
    introductionsCount: introductions.filter((intro) => intro.opportunityId === item.id).length
  };
}

function sanitizeOpportunity(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};

  if (requireTitle || source.title !== undefined) {
    next.title = normalizeText(source.title, 'Bridge opportunity') || 'Bridge opportunity';
  }
  if (source.sourceBranch !== undefined) next.sourceBranch = normalizeText(source.sourceBranch, 'manual');
  if (source.sourceId !== undefined) next.sourceId = normalizeText(source.sourceId);
  if (source.counterpartyType !== undefined) next.counterpartyType = normalizeText(source.counterpartyType, 'Strategic buyer');
  if (source.sector !== undefined) next.sector = normalizeText(source.sector, 'General');
  if (source.geography !== undefined) next.geography = normalizeText(source.geography, 'Europe');
  if (source.stage !== undefined) next.stage = normalizeText(source.stage, 'Qualification');
  if (source.qualificationStatus !== undefined) next.qualificationStatus = normalizeText(source.qualificationStatus, 'verified');
  if (source.opportunityValue !== undefined) next.opportunityValue = normalizeNumber(source.opportunityValue);
  if (source.probability !== undefined) next.probability = clampScore(source.probability);
  if (source.status !== undefined) next.status = normalizeText(source.status, 'active');
  if (source.owner !== undefined) next.owner = normalizeText(source.owner, 'Bridge Lead');
  if (source.ndaStatus !== undefined) next.ndaStatus = normalizeText(source.ndaStatus, 'required');
  if (source.redactionLevel !== undefined) next.redactionLevel = normalizeText(source.redactionLevel, 'redacted_teaser');
  if (source.dataRoomAccess !== undefined) next.dataRoomAccess = normalizeText(source.dataRoomAccess, 'none');
  if (source.boardApprovalRequired !== undefined) {
    next.boardApprovalRequired = normalizeBoolean(source.boardApprovalRequired) ? 1 : 0;
  }
  if (source.nextStep !== undefined) next.nextStep = normalizeText(source.nextStep);
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;

  return next;
}

function sanitizeCounterparty(payload = {}, { requireName = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};

  if (requireName || source.name !== undefined || source.title !== undefined) {
    next.name = normalizeText(source.name || source.title, 'Bridge counterparty') || 'Bridge counterparty';
  }
  if (source.counterpartyType !== undefined) next.counterpartyType = normalizeText(source.counterpartyType, 'Strategic buyer');
  if (source.sectorFocus !== undefined) next.sectorFocus = normalizeText(source.sectorFocus, 'General');
  if (source.geography !== undefined) next.geography = normalizeText(source.geography, 'Europe');
  if (source.ticketMin !== undefined) next.ticketMin = normalizeNumber(source.ticketMin);
  if (source.ticketMax !== undefined) next.ticketMax = normalizeNumber(source.ticketMax);
  if (source.riskAppetite !== undefined) next.riskAppetite = normalizeText(source.riskAppetite, 'Medium');
  if (source.kycStatus !== undefined) next.kycStatus = normalizeText(source.kycStatus, 'review');
  if (source.ndaStatus !== undefined) next.ndaStatus = normalizeText(source.ndaStatus, 'required');
  if (source.contactOwner !== undefined) next.contactOwner = normalizeText(source.contactOwner, 'Bridge Lead');
  if (source.status !== undefined) next.status = normalizeText(source.status, 'active');
  if (source.score !== undefined) next.score = normalizeText(source.score);
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;

  return next;
}

function sanitizeDocument(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};

  if (requireTitle || source.title !== undefined) {
    next.title = normalizeText(source.title, 'Bridge document') || 'Bridge document';
  }
  [
    'documentType',
    'classification',
    'status',
    'owner',
    'opportunityId',
    'counterpartyId',
    'ndaStatus',
    'redactionLevel'
  ].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeText(source[key]);
  });
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;

  return next;
}

function sanitizeReport(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};

  if (requireTitle || source.title !== undefined) {
    next.title = normalizeText(source.title, 'Bridge Network Memo') || 'Bridge Network Memo';
  }
  ['status', 'reportType', 'opportunityId'].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeText(source[key]);
  });
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;

  return next;
}

function getMatchScore(opportunity, counterparty) {
  const value = normalizeNumber(opportunity?.opportunityValue);
  let score = 20;
  if (opportunity?.counterpartyType === counterparty?.counterpartyType) score += 24;
  if (normalizeText(counterparty?.sectorFocus).toLowerCase().includes(normalizeText(opportunity?.sector).toLowerCase())) score += 18;
  const oppGeo = normalizeText(opportunity?.geography).toLowerCase();
  const cpGeo = normalizeText(counterparty?.geography).toLowerCase();
  if (oppGeo && cpGeo && (oppGeo.includes(cpGeo) || cpGeo.includes(oppGeo))) score += 14;
  if (value >= normalizeNumber(counterparty?.ticketMin) && value <= normalizeNumber(counterparty?.ticketMax, value)) score += 18;
  if (counterparty?.kycStatus === 'verified') score += 6;
  return clampScore(score);
}

async function recordBridgeAudit({ organizationId, userId, action, entityId = '', metadata = {} }) {
  if (!normalizeText(userId)) return;
  try {
    await recordAuditLog({
      organizationId,
      userId,
      action,
      entityType: 'bridge',
      entityId,
      metadata
    });
  } catch {
    // Bridge audit never blocks transaction workflows.
  }
}

export async function listBridgeOpportunities(organizationId) {
  assertOrganizationId(organizationId);
  const [opportunities, introductions] = await Promise.all([
    opportunitiesStore.listByOrganization(organizationId),
    introductionsStore.listByOrganization(organizationId)
  ]);
  return opportunities.map((item) => expandOpportunity(item, introductions));
}

export async function createBridgeOpportunity(organizationId, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const created = await opportunitiesStore.create({
    ...sanitizeOpportunity(payload, { requireTitle: true }),
    organizationId,
    userId: normalizeText(actor.userId) || null
  });
  await recordBridgeAudit({ organizationId, userId: actor.userId, action: 'bridge.opportunity.created', entityId: created.id });
  return expandOpportunity(created, []);
}

export async function updateBridgeOpportunity(organizationId, id, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const existing = await opportunitiesStore.getByIdForOrganization(normalizeText(id), organizationId);
  if (!existing) return null;
  const updated = await opportunitiesStore.updateForOrganization(
    existing.id,
    sanitizeOpportunity(payload),
    organizationId
  );
  await recordBridgeAudit({ organizationId, userId: actor.userId, action: 'bridge.opportunity.updated', entityId: existing.id });
  const introductions = await introductionsStore.listByOrganization(organizationId);
  return expandOpportunity(updated, introductions);
}

export async function deleteBridgeOpportunity(organizationId, id, actor = {}) {
  assertOrganizationId(organizationId);
  const result = await opportunitiesStore.removeForOrganization(normalizeText(id), organizationId);
  if (result.deleted) await recordBridgeAudit({ organizationId, userId: actor.userId, action: 'bridge.opportunity.deleted', entityId: id });
  return result;
}

export async function listBridgeCounterparties(organizationId) {
  assertOrganizationId(organizationId);
  return counterpartiesStore.listByOrganization(organizationId);
}

export async function createBridgeCounterparty(organizationId, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const created = await counterpartiesStore.create({
    ...sanitizeCounterparty(payload, { requireName: true }),
    organizationId,
    userId: normalizeText(actor.userId) || null
  });
  await recordBridgeAudit({ organizationId, userId: actor.userId, action: 'bridge.counterparty.created', entityId: created.id });
  return created;
}

export async function updateBridgeCounterparty(organizationId, id, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const existing = await counterpartiesStore.getByIdForOrganization(normalizeText(id), organizationId);
  if (!existing) return null;
  const updated = await counterpartiesStore.updateForOrganization(existing.id, sanitizeCounterparty(payload), organizationId);
  await recordBridgeAudit({ organizationId, userId: actor.userId, action: 'bridge.counterparty.updated', entityId: existing.id });
  return updated;
}

export async function deleteBridgeCounterparty(organizationId, id, actor = {}) {
  assertOrganizationId(organizationId);
  const result = await counterpartiesStore.removeForOrganization(normalizeText(id), organizationId);
  if (result.deleted) await recordBridgeAudit({ organizationId, userId: actor.userId, action: 'bridge.counterparty.deleted', entityId: id });
  return result;
}

export async function listBridgeIntroductions(organizationId, opportunityId = '') {
  assertOrganizationId(organizationId);
  const items = await introductionsStore.listByOrganization(organizationId);
  return normalizeText(opportunityId)
    ? items.filter((item) => item.opportunityId === normalizeText(opportunityId))
    : items;
}

export async function createBridgeIntroduction(organizationId, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const opportunity = await opportunitiesStore.getByIdForOrganization(normalizeText(payload.opportunityId), organizationId);
  const counterparty = await counterpartiesStore.getByIdForOrganization(normalizeText(payload.counterpartyId), organizationId);
  if (!opportunity) throw createError('Bridge opportunity no encontrada.', 404, 'BRIDGE_OPPORTUNITY_NOT_FOUND');
  if (!counterparty) throw createError('Bridge counterparty no encontrada.', 404, 'BRIDGE_COUNTERPARTY_NOT_FOUND');

  const created = await introductionsStore.create({
    opportunityId: opportunity.id,
    counterpartyId: counterparty.id,
    counterpartyName: counterparty.name,
    status: normalizeText(payload.status, 'drafted'),
    ndaStatus: normalizeText(payload.ndaStatus || opportunity.ndaStatus, 'required'),
    introducedAt: normalizeText(payload.introducedAt, new Date().toISOString().slice(0, 10)),
    nextStep: normalizeText(payload.nextStep),
    payload: payload.payload && typeof payload.payload === 'object' ? payload.payload : {},
    organizationId,
    userId: normalizeText(actor.userId) || null
  });

  await opportunitiesStore.updateForOrganization(
    opportunity.id,
    {
      stage: 'Introductions',
      probability: Math.max(normalizeNumber(opportunity.probability), 42)
    },
    organizationId
  );
  await recordBridgeAudit({
    organizationId,
    userId: actor.userId,
    action: 'bridge.introduction.created',
    entityId: created.id,
    metadata: { opportunityId: opportunity.id, counterpartyId: counterparty.id }
  });
  return created;
}

export async function listBridgeDocuments(organizationId) {
  assertOrganizationId(organizationId);
  return documentsStore.listByOrganization(organizationId);
}

export async function createBridgeDocument(organizationId, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const opportunityId = normalizeText(payload.opportunityId);
  const counterpartyId = normalizeText(payload.counterpartyId);
  if (opportunityId) {
    const opportunity = await opportunitiesStore.getByIdForOrganization(opportunityId, organizationId);
    if (!opportunity) throw createError('Bridge opportunity no encontrada.', 404, 'BRIDGE_OPPORTUNITY_NOT_FOUND');
  }
  if (counterpartyId) {
    const counterparty = await counterpartiesStore.getByIdForOrganization(counterpartyId, organizationId);
    if (!counterparty) throw createError('Bridge counterparty no encontrada.', 404, 'BRIDGE_COUNTERPARTY_NOT_FOUND');
  }
  const created = await documentsStore.create({
    ...sanitizeDocument(payload, { requireTitle: true }),
    organizationId,
    userId: normalizeText(actor.userId) || null
  });
  await recordBridgeAudit({ organizationId, userId: actor.userId, action: 'bridge.document.created', entityId: created.id });
  return created;
}

export async function updateBridgeDocument(organizationId, id, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const updated = await documentsStore.updateForOrganization(normalizeText(id), sanitizeDocument(payload), organizationId);
  if (updated) await recordBridgeAudit({ organizationId, userId: actor.userId, action: 'bridge.document.updated', entityId: updated.id });
  return updated;
}

export async function listBridgeReports(organizationId) {
  assertOrganizationId(organizationId);
  return reportsStore.listByOrganization(organizationId);
}

export async function createBridgeReport(organizationId, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const created = await reportsStore.create({
    ...sanitizeReport(payload, { requireTitle: true }),
    organizationId,
    userId: normalizeText(actor.userId) || null
  });
  await recordBridgeAudit({ organizationId, userId: actor.userId, action: 'bridge.report.created', entityId: created.id });
  return created;
}

export async function getBridgeMatches(organizationId, opportunityId) {
  assertOrganizationId(organizationId);
  const opportunity = await opportunitiesStore.getByIdForOrganization(normalizeText(opportunityId), organizationId);
  if (!opportunity) return null;
  const counterparties = await listBridgeCounterparties(organizationId);
  return counterparties
    .map((counterparty) => ({
      counterparty,
      score: getMatchScore(opportunity, counterparty)
    }))
    .sort((left, right) => right.score - left.score);
}

export async function createBridgeOpportunityFromMaDeal(organizationId, dealId, actor = {}) {
  const deal = await getMaDealById(dealId, { organizationId });
  if (!deal) throw createError('Deal M&A no encontrado.', 404, 'MA_DEAL_NOT_FOUND');
  return createBridgeOpportunity(
    organizationId,
    {
      title: `${deal.name} Bridge`,
      sourceBranch: 'M&A',
      sourceId: deal.id,
      counterpartyType: 'Strategic buyer',
      sector: deal.sector || deal.payload?.sector || 'General',
      geography: deal.market || deal.payload?.market || 'Europe',
      opportunityValue: deal.equityValue || deal.payload?.equityValue || 0,
      probability: 40,
      owner: deal.ownerName || 'Bridge Lead',
      nextStep: 'Prepare buyer introduction pack from M&A valuation and diligence signals.'
    },
    actor
  );
}

export async function createBridgeOpportunityFromFundingRound(organizationId, roundId, actor = {}) {
  const rounds = await listFundingRounds(organizationId);
  const round = rounds.find((item) => item.id === roundId);
  if (!round) throw createError('Funding round no encontrada.', 404, 'FUNDING_ROUND_NOT_FOUND');
  return createBridgeOpportunity(
    organizationId,
    {
      title: `${round.roundType || 'Funding'} Bridge`,
      sourceBranch: 'Funding',
      sourceId: round.id,
      counterpartyType: 'Growth investor',
      opportunityValue: round.amountRaised || round.targetRaise || round.valuationPostMoney || 0,
      probability: 35,
      owner: round.investorName || 'CFO Office',
      nextStep: 'Prepare investor introduction pack from Funding readiness and runway signals.'
    },
    actor
  );
}

export function summarizeBridge({ opportunities = [], counterparties = [], introductions = [] } = {}) {
  const totalOpportunityValue = opportunities.reduce((sum, item) => sum + normalizeNumber(item.opportunityValue), 0);
  const weightedPipelineValue = opportunities.reduce(
    (sum, item) => sum + normalizeNumber(item.opportunityValue) * (clampScore(item.probability) / 100),
    0
  );
  const qualified = opportunities.filter((item) =>
    ['qualified', 'verified', 'ic_ready', 'mandated'].includes(normalizeText(item.qualificationStatus).toLowerCase())
  );
  const introduced = opportunities.filter((item) => {
    const stage = normalizeText(item.stage).toLowerCase();
    return stage.includes('intro') || stage.includes('diligence') || stage.includes('closing');
  });
  const mandated = opportunities.filter((item) => {
    const stage = normalizeText(item.stage).toLowerCase();
    return stage.includes('mandate') || stage.includes('closing');
  });
  const confidentialityExceptions = opportunities.filter(
    (item) => item.ndaStatus !== 'signed' || item.redactionLevel === 'full_data_room' || normalizeBoolean(item.boardApprovalRequired)
  );
  const readinessScore = clampScore(
    opportunities.length === 0
      ? 62
      : qualified.length * 18 +
          introduced.length * 14 +
          mandated.length * 18 +
          Math.min(18, counterparties.length * 4) +
          Math.min(30, introductions.length * 4) +
          Math.min(16, totalOpportunityValue / 1000000) -
          confidentialityExceptions.length * 6
  );

  return {
    totalOpportunityValue: Math.round(totalOpportunityValue),
    weightedPipelineValue: Math.round(weightedPipelineValue),
    introductionsCount: introductions.length,
    introductionLedgerCount: introductions.length,
    counterpartiesCount: counterparties.length,
    qualifiedOpportunitiesCount: qualified.length,
    activeMandatesCount: mandated.length,
    activeOpportunitiesCount: opportunities.filter((item) => ['active', 'ready', 'in_progress'].includes(item.status)).length,
    confidentialityExceptionsCount: confidentialityExceptions.length,
    conversionRate: opportunities.length > 0 ? clampScore((introduced.length / opportunities.length) * 100) : 0,
    readinessScore
  };
}

export async function generateBridgeNetworkReport(scope = {}, options = {}) {
  assertOrganizationId(scope.organizationId);
  const [opportunities, counterparties, introductions, documents] = await Promise.all([
    listBridgeOpportunities(scope.organizationId),
    listBridgeCounterparties(scope.organizationId),
    listBridgeIntroductions(scope.organizationId),
    listBridgeDocuments(scope.organizationId)
  ]);
  const selectedOpportunity =
    opportunities.find((item) => item.id === normalizeText(options.opportunityId)) ||
    opportunities[0] ||
    null;
  const matches = selectedOpportunity
    ? await getBridgeMatches(scope.organizationId, selectedOpportunity.id)
    : [];
  const metrics = summarizeBridge({ opportunities, counterparties, introductions });
  const circulationRisks = opportunities
    .filter((item) => item.ndaStatus !== 'signed' || item.redactionLevel === 'full_data_room' || normalizeBoolean(item.boardApprovalRequired))
    .map((item) => ({
      id: item.id,
      title: item.title,
      ndaStatus: item.ndaStatus,
      redactionLevel: item.redactionLevel,
      boardApprovalRequired: normalizeBoolean(item.boardApprovalRequired)
    }));

  return createBridgeReport(
    scope.organizationId,
    {
      title: options.title || 'Bridge Network Memo',
      status: 'generated',
      reportType: 'network_memo',
      opportunityId: selectedOpportunity?.id || '',
      payload: {
        generatedAt: new Date().toISOString(),
        metrics,
        selectedOpportunity,
        matches: matches.slice(0, 10),
        documents,
        circulationRisks,
        recommendations: [
          circulationRisks.length > 0
            ? 'Resolve NDA, redaction and board approval exceptions before external circulation.'
            : 'Proceed with controlled teaser circulation to qualified counterparties.',
          metrics.qualifiedOpportunitiesCount > 0
            ? 'Prioritize high-fit counterparties and maintain introduction ledger discipline.'
            : 'Qualify opportunities before escalating to mandate or diligence.',
          metrics.weightedPipelineValue > 0
            ? 'Keep weighted pipeline aligned with M&A valuation, Funding needs and board appetite.'
            : 'Source Bridge opportunities from active M&A and Funding workflows.'
        ]
      }
    },
    { userId: scope.userId }
  );
}

export async function getBridgeExecutiveHubBrief(scope = {}) {
  assertOrganizationId(scope.organizationId);
  const [opportunities, counterparties, introductions, documents, reports] = await Promise.all([
    listBridgeOpportunities(scope.organizationId),
    listBridgeCounterparties(scope.organizationId),
    listBridgeIntroductions(scope.organizationId),
    listBridgeDocuments(scope.organizationId),
    listBridgeReports(scope.organizationId)
  ]);
  const metrics = summarizeBridge({ opportunities, counterparties, introductions });

  return {
    version: 'bridge-executive-hub-v1',
    organizationId: scope.organizationId,
    generatedAt: new Date().toISOString(),
    score: metrics.readinessScore,
    posture: metrics.readinessScore >= 75 ? 'Verified liquidity network active' : 'Build verified network',
    title: opportunities[0]?.title || 'Liquidity network foundation',
    metrics: {
      ...metrics,
      documentsCount: documents.length,
      reportsCount: reports.length,
      pendingNdaDocumentsCount: documents.filter((item) => normalizeText(item.ndaStatus).toLowerCase() !== 'signed').length
    },
    latestOpportunity: opportunities[0] || null
  };
}

export async function listBridgeAuditLogs(organizationId, filters = {}) {
  assertOrganizationId(organizationId);
  return listAuditLogs({
    organizationId,
    entityType: 'bridge',
    action: filters.action || '',
    entityId: filters.entityId || '',
    limit: filters.limit || 100
  });
}

function sanitizeSignal(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  if (requireTitle || source.title !== undefined) next.title = normalizeText(source.title, 'Bridge signal') || 'Bridge signal';
  [
    'sourceModule',
    'targetModule',
    'signalType',
    'severity',
    'description',
    'recommendedAction',
    'status',
    'owner',
    'dueDate',
    'humanReviewStatus',
    'dismissalReason'
  ].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeText(source[key]);
  });
  if (source.confidenceLevel !== undefined) next.confidenceLevel = clampScore(source.confidenceLevel);
  if (source.staleFlag !== undefined) next.staleFlag = normalizeBoolean(source.staleFlag) ? 1 : 0;
  if (source.evidence !== undefined || source.evidenceJson !== undefined) next.evidence = normalizeArray(source.evidence || source.evidenceJson);
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

function sanitizeDependency(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  [
    'sourceModule',
    'targetModule',
    'sourceEntityId',
    'targetEntityId',
    'dependencyType',
    'status',
    'owner',
    'resolutionNote'
  ].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeText(source[key]);
  });
  if (source.blockingFlag !== undefined || source.blocking !== undefined) {
    next.blockingFlag = normalizeBoolean(source.blockingFlag ?? source.blocking) ? 1 : 0;
  }
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

function sanitizeConflict(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  if (requireTitle || source.title !== undefined) next.title = normalizeText(source.title, 'Bridge conflict') || 'Bridge conflict';
  ['conflictType', 'sourceModule', 'targetModule', 'severity', 'description', 'mitigation', 'status', 'owner'].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeText(source[key]);
  });
  if (source.evidence !== undefined) next.evidence = normalizeArray(source.evidence);
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

function sanitizeAttentionItem(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  if (requireTitle || source.title !== undefined) next.title = normalizeText(source.title, 'Executive attention item') || 'Executive attention item';
  ['sourceSignalId', 'severity', 'owner', 'dueDate', 'recommendedAction', 'status'].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeText(source[key]);
  });
  if (source.priorityScore !== undefined) next.priorityScore = clampScore(source.priorityScore);
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

function sanitizeEvidenceLink(payload = {}, { requireTitle = false } = {}) {
  const source = payload && typeof payload === 'object' ? payload : {};
  const next = {};
  ['signalId', 'sourceModule', 'sourceEntityId', 'linkLabel', 'evidenceQuality', 'humanReviewNote'].forEach((key) => {
    if (source[key] !== undefined) next[key] = normalizeText(source[key]);
  });
  if (source.payload && typeof source.payload === 'object') next.payload = source.payload;
  return next;
}

function createCrud({ store, sanitize, createAction, updateAction }) {
  return {
    async list(organizationId) {
      assertOrganizationId(organizationId);
      return store.listByOrganization(organizationId);
    },
    async create(organizationId, payload = {}, actor = {}) {
      assertOrganizationId(organizationId);
      const created = await store.create({
        ...sanitize(payload, { requireTitle: true }),
        ...commonCreate(organizationId, actor)
      });
      await recordBridgeAudit({ organizationId, userId: actorId(actor), action: createAction, entityId: created.id });
      return created;
    },
    async update(organizationId, id, payload = {}, actor = {}) {
      assertOrganizationId(organizationId);
      const updated = await store.updateForOrganization(normalizeText(id), sanitize(payload), organizationId);
      if (updated) await recordBridgeAudit({ organizationId, userId: actorId(actor), action: updateAction, entityId: updated.id });
      return updated;
    }
  };
}

const signalCrud = createCrud({ store: signalsStore, sanitize: sanitizeSignal, createAction: 'bridge.signal.created', updateAction: 'bridge.signal.updated' });
const dependencyCrud = createCrud({ store: dependenciesStore, sanitize: sanitizeDependency, createAction: 'bridge.dependency.created', updateAction: 'bridge.dependency.updated' });
const conflictCrud = createCrud({ store: conflictsStore, sanitize: sanitizeConflict, createAction: 'bridge.conflict.created', updateAction: 'bridge.conflict.updated' });
const attentionCrud = createCrud({ store: attentionQueueStore, sanitize: sanitizeAttentionItem, createAction: 'bridge.attention_queue.generated', updateAction: 'bridge.attention_queue.updated' });
const evidenceCrud = createCrud({ store: evidenceLinksStore, sanitize: sanitizeEvidenceLink, createAction: 'bridge.evidence_link.created', updateAction: 'bridge.evidence_link.updated' });

export const listBridgeSignals = signalCrud.list;
export const createBridgeSignal = signalCrud.create;
export const updateBridgeSignal = signalCrud.update;
export const listBridgeDependencies = dependencyCrud.list;
export const createBridgeDependency = dependencyCrud.create;
export const updateBridgeDependency = dependencyCrud.update;
export const listBridgeConflicts = conflictCrud.list;
export const createBridgeConflict = conflictCrud.create;
export const updateBridgeConflict = conflictCrud.update;
export const listBridgeAttentionQueue = attentionCrud.list;
export const createBridgeAttentionItem = attentionCrud.create;
export const updateBridgeAttentionItem = attentionCrud.update;
export const listBridgeEvidenceLinks = evidenceCrud.list;
export const createBridgeEvidenceLink = evidenceCrud.create;
export const updateBridgeEvidenceLink = evidenceCrud.update;

async function recordSignalHistory({ organizationId, signal, action, fromStatus = '', toStatus = '', notes = '', actor = {}, payload = {} }) {
  if (!signal?.id) return null;
  return signalHistoryStore.create({
    ...commonCreate(organizationId, actor),
    signalId: signal.id,
    action,
    fromStatus,
    toStatus,
    notes,
    payload
  });
}

async function transitionBridgeSignal(organizationId, id, status, action, actor = {}, options = {}) {
  assertOrganizationId(organizationId);
  const existing = await signalsStore.getByIdForOrganization(normalizeText(id), organizationId);
  if (!existing) return null;
  const now = new Date().toISOString();
  const patch = { status };
  if (status === 'acknowledged') patch.acknowledgedAt = now;
  if (status === 'in_review') patch.humanReviewStatus = 'in_review';
  if (status === 'resolved') {
    patch.resolvedAt = now;
    patch.humanReviewStatus = 'completed';
  }
  if (status === 'dismissed') {
    patch.dismissedAt = now;
    patch.dismissalReason = normalizeText(options.reason || options.notes, 'Dismissed after human review.');
    patch.humanReviewStatus = 'completed';
  }
  if (options.owner !== undefined) patch.owner = normalizeText(options.owner);
  const updated = await signalsStore.updateForOrganization(existing.id, patch, organizationId);
  await recordSignalHistory({ organizationId, signal: updated, action, fromStatus: existing.status, toStatus: updated.status, notes: normalizeText(options.notes || options.reason), actor, payload: options });
  await recordBridgeAudit({ organizationId, userId: actorId(actor), action, entityId: updated.id, metadata: { fromStatus: existing.status, toStatus: updated.status } });
  return updated;
}

export const acknowledgeBridgeSignal = (organizationId, id, actor = {}, options = {}) =>
  transitionBridgeSignal(organizationId, id, 'acknowledged', 'bridge.signal.acknowledged', actor, options);
export const markBridgeSignalInReview = (organizationId, id, actor = {}, options = {}) =>
  transitionBridgeSignal(organizationId, id, 'in_review', 'bridge.signal.in_review', actor, options);
export const resolveBridgeSignal = (organizationId, id, actor = {}, options = {}) =>
  transitionBridgeSignal(organizationId, id, 'resolved', 'bridge.signal.resolved', actor, options);
export const dismissBridgeSignal = (organizationId, id, actor = {}, options = {}) =>
  transitionBridgeSignal(organizationId, id, 'dismissed', 'bridge.signal.dismissed', actor, options);

async function safeLoad(name, loader) {
  try {
    const data = await loader();
    return { name, status: 'available', data };
  } catch (error) {
    return {
      name,
      status: 'not_available',
      data: null,
      error: error?.code || error?.message || 'not_available'
    };
  }
}

function latestByDate(items = []) {
  return [...normalizeArray(items)].sort((left, right) =>
    new Date(right.updatedAt || right.createdAt || 0).getTime() - new Date(left.updatedAt || left.createdAt || 0).getTime()
  )[0] || null;
}

export async function collectBridgeModuleSummaries(scope = {}) {
  assertOrganizationId(scope.organizationId);
  const organizationId = scope.organizationId;
  const [compliance, funding, governance, pmi, risk, reporting, strategy, maDeals] = await Promise.all([
    safeLoad('compliance', () => getExecutiveComplianceHubBrief({ organizationId })),
    safeLoad('funding', () => getFundingSummary(organizationId, { userId: scope.userId || '' })),
    safeLoad('governance', () => getGovernanceSummary({ organizationId })),
    safeLoad('pmi', () => getPmiSummary({ organizationId })),
    safeLoad('risk', () => getRiskSummary({ organizationId })),
    safeLoad('reporting', () => getReportingSummary({ organizationId })),
    safeLoad('strategy', () => getStrategySummary({ organizationId })),
    safeLoad('ma', () => listMaDeals({ organizationId }))
  ]);
  return {
    compliance,
    funding,
    governance,
    pmi,
    ma: {
      ...maDeals,
      data: {
        deals: normalizeArray(maDeals.data),
        latestDeal: latestByDate(maDeals.data)
      }
    },
    risk,
    reporting,
    strategy
  };
}

function maValuation(deal = {}) {
  const safeDeal = deal && typeof deal === 'object' ? deal : {};
  return normalizeNumber(safeDeal.equityValue || safeDeal.payload?.equityValue || safeDeal.enterpriseValue || safeDeal.payload?.enterpriseValue);
}

export function buildEnterpriseBridgeSignals(summaries = {}) {
  const signals = [];
  const complianceScore = normalizeNumber(summaries.compliance?.data?.legalHealthScore, null);
  if (complianceScore !== null && complianceScore < 70) {
    signals.push({
      sourceModule: 'Compliance',
      targetModule: 'Funding',
      signalType: 'compliance_funding_risk',
      severity: complianceScore < 55 ? 'critical' : 'risk',
      title: 'Compliance risk may affect capital raise',
      description: `Compliance health score is ${complianceScore}/100, below the enterprise threshold for investor readiness.`,
      recommendedAction: 'Run audit and human review before capital raise.',
      confidenceLevel: 82,
      evidence: [{ sourceModule: 'Compliance', label: 'Compliance executive hub', quality: 'high' }]
    });
  } else if (summaries.compliance?.status === 'not_available') {
    signals.push({
      sourceModule: 'Compliance',
      targetModule: 'Funding',
      signalType: 'compliance_funding_risk',
      severity: 'watch',
      title: 'Compliance signal not available',
      description: 'Compliance summary is not available. Human review is required before relying on fundraising readiness.',
      recommendedAction: 'Confirm compliance posture manually before external investor circulation.',
      confidenceLevel: 40,
      evidence: [{ sourceModule: 'Compliance', label: 'not_available', quality: 'low' }]
    });
  }

  const fundingMetrics = summaries.funding?.data?.metrics || summaries.funding?.data || {};
  const runwayMonths = normalizeNumber(fundingMetrics.runwayMonths ?? fundingMetrics.runwayRemainingMonths ?? fundingMetrics.runway, null);
  if (runwayMonths !== null && runwayMonths < 9) {
    signals.push({
      sourceModule: 'Funding',
      targetModule: 'CEO Overview',
      signalType: 'runway_attention_required',
      severity: runwayMonths < 4 ? 'critical' : 'risk',
      title: 'Runway requires executive attention',
      description: `Funding runway is ${runwayMonths} months.`,
      recommendedAction: 'Review cash runway, funding timeline and board-approved capital actions.',
      confidenceLevel: 78,
      evidence: [{ sourceModule: 'Funding', label: 'Funding summary', quality: 'high' }]
    });
  }

  const latestDeal = summaries.ma?.data?.latestDeal || null;
  const valuation = maValuation(latestDeal);
  if (latestDeal && valuation > 0) {
    signals.push({
      sourceModule: 'M&A',
      targetModule: 'Funding',
      signalType: 'valuation_reference_available',
      severity: 'info',
      title: 'M&A valuation reference available',
      description: `Latest M&A valuation reference is available from ${latestDeal.name || latestDeal.title || latestDeal.id}.`,
      recommendedAction: 'Use M&A valuation as reference input; CFO validation required before investor use.',
      confidenceLevel: 72,
      evidence: [{ sourceModule: 'M&A', sourceEntityId: latestDeal.id, label: 'Latest M&A valuation', quality: 'medium' }]
    });
  }

  const pmiMetrics = summaries.pmi?.data?.metrics || {};
  if (normalizeNumber(pmiMetrics.synergyCaptureRatio, 100) < 50 && summaries.pmi?.status === 'available') {
    signals.push({
      sourceModule: 'PMI',
      targetModule: 'M&A',
      signalType: 'value_capture_risk',
      severity: normalizeNumber(pmiMetrics.synergyCaptureRatio) < 30 ? 'critical' : 'risk',
      title: 'PMI value capture below acquisition thesis',
      description: `Synergy capture ratio is ${normalizeNumber(pmiMetrics.synergyCaptureRatio)}%.`,
      recommendedAction: 'Review synergy owners, blocked milestones and M&A value thesis before next board update.',
      confidenceLevel: 80,
      evidence: [{ sourceModule: 'PMI', label: 'PMI summary', quality: 'high' }]
    });
  }

  const governanceMetrics = summaries.governance?.data?.metrics || {};
  if (normalizeNumber(governanceMetrics.pendingCriticalDecisions) > 0) {
    signals.push({
      sourceModule: 'Governance',
      targetModule: 'PMI',
      signalType: 'governance_blocker',
      severity: 'blocked',
      title: 'Governance approval blocks execution',
      description: `${governanceMetrics.pendingCriticalDecisions} critical governance decisions remain pending.`,
      recommendedAction: 'Escalate pending critical decision to the appropriate committee before PMI execution continues.',
      confidenceLevel: 84,
      evidence: [{ sourceModule: 'Governance', label: 'Governance summary', quality: 'high' }]
    });
  }

  const riskMetrics = summaries.risk?.data?.metrics || {};
  if (
    normalizeNumber(riskMetrics.criticalRiskCount) > 0 ||
    normalizeNumber(riskMetrics.appetiteBreaches) > 0 ||
    normalizeNumber(pmiMetrics.criticalIntegrationRisks) > 0 ||
    normalizeNumber(governanceMetrics.governanceRisks) > 2
  ) {
    signals.push({
      sourceModule: 'Risk',
      targetModule: 'CEO Overview',
      signalType: 'enterprise_risk_attention',
      severity: normalizeNumber(riskMetrics.criticalRiskCount) > 0 ? 'critical' : 'risk',
      title: 'Enterprise risk requires CEO attention',
      description: 'Critical risk indicators detected across Enterprise Risk, governance or PMI execution.',
      recommendedAction: 'Assign executive owner and review mitigation evidence in the next operating cadence.',
      confidenceLevel: summaries.risk?.status === 'available' ? 86 : 70,
      evidence: [{ sourceModule: 'Risk', label: summaries.risk?.status === 'available' ? 'Enterprise Risk summary' : 'Derived cross-module risk', quality: summaries.risk?.status === 'available' ? 'high' : 'medium' }]
    });
  }

  const reportingMetrics = summaries.reporting?.data?.metrics || {};
  if (
    normalizeNumber(governanceMetrics.boardReadinessScore, 100) < 70 ||
    normalizeNumber(reportingMetrics.missingEvidenceCount) > 0
  ) {
    signals.push({
      sourceModule: 'Reporting',
      targetModule: 'Governance',
      signalType: 'board_pack_evidence_gap',
      severity: normalizeNumber(reportingMetrics.missingEvidenceCount) > 2 ? 'risk' : 'watch',
      title: 'Board pack evidence gap',
      description: `Board readiness score is ${normalizeNumber(governanceMetrics.boardReadinessScore)}/100 and missing evidence count is ${normalizeNumber(reportingMetrics.missingEvidenceCount)}.`,
      recommendedAction: 'Complete board evidence links and human review before final board pack circulation.',
      confidenceLevel: summaries.reporting?.status === 'available' ? 82 : 66,
      evidence: [{ sourceModule: 'Reporting', label: summaries.reporting?.status === 'available' ? 'Reporting summary' : 'Governance board readiness', quality: summaries.reporting?.status === 'available' ? 'high' : 'medium' }]
    });
  }

  const strategyMetrics = summaries.strategy?.data?.metrics || {};
  if (fundingMetrics.capitalRequired || fundingMetrics.targetRaise || fundingMetrics.nextRoundTarget || normalizeNumber(strategyMetrics.capitalDependencyCount) > 0) {
    signals.push({
      sourceModule: 'Strategy',
      targetModule: 'Funding',
      signalType: 'strategic_capital_dependency',
      severity: normalizeNumber(strategyMetrics.capitalDependencyCount) > 1 ? 'risk' : 'watch',
      title: 'Strategic capital dependency detected',
      description: `Strategic plan indicates ${normalizeNumber(strategyMetrics.capitalDependencyCount)} capital dependency item(s).`,
      recommendedAction: 'Align strategic initiative timing with funding runway and board-approved capital plan.',
      confidenceLevel: summaries.strategy?.status === 'available' ? 84 : 58,
      evidence: [{ sourceModule: 'Strategy', label: summaries.strategy?.status === 'available' ? 'Strategy summary' : 'Derived funding requirement', quality: summaries.strategy?.status === 'available' ? 'high' : 'medium' }]
    });
  } else if (summaries.strategy?.status === 'not_available') {
    signals.push({
      sourceModule: 'Strategy',
      targetModule: 'Funding',
      signalType: 'strategic_capital_dependency',
      severity: 'info',
      title: 'Strategy module not available',
      description: 'Strategy summary is not available. No automated capital dependency decision has been made.',
      recommendedAction: 'Validate strategic capital dependencies manually in the next executive review.',
      confidenceLevel: 35,
      evidence: [{ sourceModule: 'Strategy', label: 'not_available', quality: 'low' }]
    });
  }

  return signals.map((signal) => ({
    status: 'open',
    owner: 'Executive Office',
    staleFlag: 0,
    humanReviewStatus: 'required',
    ...signal
  }));
}

export function calculateSignalPriority(signal = {}) {
  const severityScore = severityRank(signal.severity) * 18;
  const confidenceScore = clampScore(signal.confidenceLevel) * 0.2;
  const stalePenalty = isStaleSignal(signal) ? 8 : 0;
  const blockingBonus = normalizeText(signal.severity) === 'blocked' ? 12 : 0;
  return clampScore(severityScore + confidenceScore + blockingBonus - stalePenalty);
}

async function upsertBridgeSignal(organizationId, payload = {}, actor = {}) {
  const existing = (await listBridgeSignals(organizationId)).find((item) =>
    item.signalType === payload.signalType &&
    item.sourceModule === payload.sourceModule &&
    item.targetModule === payload.targetModule &&
    !['resolved', 'dismissed'].includes(normalizeText(item.status))
  );
  if (existing) {
    return updateBridgeSignal(organizationId, existing.id, payload, actor);
  }
  return createBridgeSignal(organizationId, payload, actor);
}

export async function recalculateEnterpriseBridge(scope = {}) {
  assertOrganizationId(scope.organizationId);
  const summaries = await collectBridgeModuleSummaries(scope);
  const generatedSignals = buildEnterpriseBridgeSignals(summaries);
  const savedSignals = [];
  for (const signal of generatedSignals) {
    savedSignals.push(await upsertBridgeSignal(scope.organizationId, signal, { userId: scope.userId || '' }));
  }
  const attentionItems = [];
  for (const signal of savedSignals.filter((item) => ['critical', 'blocked', 'risk'].includes(normalizeText(item.severity)))) {
    attentionItems.push(await createBridgeAttentionItem(scope.organizationId, {
      sourceSignalId: signal.id,
      title: signal.title,
      priorityScore: calculateSignalPriority(signal),
      severity: signal.severity,
      owner: signal.owner,
      dueDate: signal.dueDate,
      recommendedAction: signal.recommendedAction,
      status: 'open',
      payload: { signalType: signal.signalType, sourceModule: signal.sourceModule, targetModule: signal.targetModule }
    }, { userId: scope.userId || '' }));
  }
  if (attentionItems.length > 0) {
    await recordBridgeAudit({ organizationId: scope.organizationId, userId: scope.userId || '', action: 'executive.bridge_update_required', metadata: { attentionItems: attentionItems.length } });
  }
  return {
    version: 'enterprise-bridge-engine-v1',
    organizationId: scope.organizationId,
    generatedAt: new Date().toISOString(),
    moduleSummaries: Object.fromEntries(Object.entries(summaries).map(([key, value]) => [key, value.status])),
    signals: savedSignals,
    attentionItems
  };
}

export function calculateBridgeSummary({ signals = [], dependencies = [], conflicts = [], attentionQueue = [] } = {}) {
  const openSignals = signals.filter((item) => !['resolved', 'dismissed'].includes(normalizeText(item.status)));
  const criticalCrossModuleSignals = openSignals.filter((item) => ['critical', 'blocked'].includes(normalizeText(item.severity))).length;
  const blockedDependencies = dependencies.filter((item) => normalizeBoolean(item.blockingFlag) && !['resolved', 'dismissed'].includes(normalizeText(item.status))).length;
  const unresolvedConflicts = conflicts.filter((item) => !['resolved', 'dismissed'].includes(normalizeText(item.status))).length;
  const staleSignalCount = signals.filter(isStaleSignal).length;
  const executiveAttentionCount = attentionQueue.filter((item) => !['resolved', 'dismissed'].includes(normalizeText(item.status))).length;
  const signalConfidence = signals.length > 0 ? clampScore(signals.reduce((sum, item) => sum + normalizeNumber(item.confidenceLevel), 0) / signals.length) : 0;
  const crossModuleReadiness = clampScore(
    100 -
      criticalCrossModuleSignals * 15 -
      blockedDependencies * 12 -
      unresolvedConflicts * 10 -
      staleSignalCount * 6 +
      signalConfidence * 0.18
  );
  const bridgeHealthStatus =
    signals.length === 0
      ? 'insufficient_data'
      : criticalCrossModuleSignals > 0 || blockedDependencies > 0
        ? 'blocked'
        : crossModuleReadiness >= 78
        ? 'strong'
        : crossModuleReadiness >= 62
          ? 'watch'
          : 'risk';
  return {
    bridgeHealthStatus,
    criticalCrossModuleSignals,
    openDependencies: dependencies.filter((item) => normalizeText(item.status) === 'open').length,
    blockedDependencies,
    unresolvedConflicts,
    executiveAttentionCount,
    topRecommendedActions: openSignals
      .sort((left, right) => calculateSignalPriority(right) - calculateSignalPriority(left))
      .slice(0, 5)
      .map((item) => item.recommendedAction || item.title),
    crossModuleReadiness,
    staleSignalCount,
    signalConfidence,
    humanReviewPosture: openSignals.length > 0 ? 'human_review_required' : 'human_review_available',
    blockedWorkflows: blockedDependencies + criticalCrossModuleSignals,
    signalTrend: openSignals.length > 0 ? 'active' : 'stable',
    moduleHealthMap: {
      ma: openSignals.filter((item) => item.sourceModule === 'M&A' || item.targetModule === 'M&A').length,
      compliance: openSignals.filter((item) => item.sourceModule === 'Compliance' || item.targetModule === 'Compliance').length,
      funding: openSignals.filter((item) => item.sourceModule === 'Funding' || item.targetModule === 'Funding').length,
      governance: openSignals.filter((item) => item.sourceModule === 'Governance' || item.targetModule === 'Governance').length,
      pmi: openSignals.filter((item) => item.sourceModule === 'PMI' || item.targetModule === 'PMI').length,
      risk: openSignals.filter((item) => item.sourceModule === 'Risk' || item.targetModule === 'Risk').length,
      reporting: openSignals.filter((item) => item.sourceModule === 'Reporting' || item.targetModule === 'Reporting').length,
      strategy: openSignals.filter((item) => item.sourceModule === 'Strategy' || item.targetModule === 'Strategy').length
    }
  };
}

export async function getEnterpriseBridgeSummary(scope = {}) {
  assertOrganizationId(scope.organizationId);
  const [signals, dependencies, conflicts, attentionQueue, evidenceLinks, snapshots] = await Promise.all([
    listBridgeSignals(scope.organizationId),
    listBridgeDependencies(scope.organizationId),
    listBridgeConflicts(scope.organizationId),
    listBridgeAttentionQueue(scope.organizationId),
    listBridgeEvidenceLinks(scope.organizationId),
    listBridgeSnapshots(scope.organizationId)
  ]);
  const metrics = calculateBridgeSummary({ signals, dependencies, conflicts, attentionQueue });
  return {
    version: 'enterprise-bridge-summary-v1',
    organizationId: scope.organizationId,
    generatedAt: new Date().toISOString(),
    metrics,
    latestSignal: signals[0] || null,
    latestSnapshot: snapshots[0] || null,
    counts: {
      signals: signals.length,
      dependencies: dependencies.length,
      conflicts: conflicts.length,
      attentionQueue: attentionQueue.length,
      evidenceLinks: evidenceLinks.length,
      snapshots: snapshots.length
    }
  };
}

export async function getEnterpriseBridgeDashboard(scope = {}) {
  const summary = await getEnterpriseBridgeSummary(scope);
  const [signals, dependencies, conflicts, attentionQueue, evidenceLinks, auditEvents] = await Promise.all([
    listBridgeSignals(scope.organizationId),
    listBridgeDependencies(scope.organizationId),
    listBridgeConflicts(scope.organizationId),
    listBridgeAttentionQueue(scope.organizationId),
    listBridgeEvidenceLinks(scope.organizationId),
    listBridgeAuditLogs(scope.organizationId, { limit: 10 })
  ]);
  return {
    ...summary,
    signals,
    dependencies,
    conflicts,
    attentionQueue,
    evidenceLinks,
    auditEvents,
    dssNotice: 'Decision support only. Bridge does not automate decisions and always requires human review.'
  };
}

export async function listBridgeSnapshots(organizationId) {
  assertOrganizationId(organizationId);
  return snapshotsStore.listByOrganization(organizationId);
}

export async function createBridgeSnapshot(organizationId, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const summary = await getEnterpriseBridgeSummary({ organizationId });
  const created = await snapshotsStore.create({
    ...commonCreate(organizationId, actor),
    title: normalizeText(payload.title, 'CEO Bridge Snapshot') || 'CEO Bridge Snapshot',
    status: 'generated',
    snapshotType: normalizeText(payload.snapshotType, 'ceo_bridge_snapshot'),
    payload: {
      generatedAt: new Date().toISOString(),
      summary,
      ...(payload.payload && typeof payload.payload === 'object' ? payload.payload : {})
    }
  });
  await recordBridgeAudit({ organizationId, userId: actorId(actor), action: 'bridge.snapshot.created', entityId: created.id });
  return created;
}

export async function generateEnterpriseBridgeReport(organizationId, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  const summary = await getEnterpriseBridgeSummary({ organizationId });
  const reportType = normalizeText(payload.reportType, 'cross_module_executive_brief');
  const title = normalizeText(payload.title) || ({
    cross_module_executive_brief: 'Cross-Module Executive Brief',
    dependency_map_report: 'Dependency Map Report',
    enterprise_attention_queue: 'Enterprise Attention Queue',
    conflicts_mitigations_brief: 'Conflicts & Mitigations Brief',
    board_signal_pack: 'Board Signal Pack',
    ceo_bridge_snapshot: 'CEO Bridge Snapshot'
  }[reportType] || 'Bridge Report');
  const created = await createBridgeReport(organizationId, {
    title,
    status: 'generated',
    reportType,
    payload: {
      generatedAt: new Date().toISOString(),
      summary,
      dssNotice: 'Decision support only. Human review required.'
    }
  }, actor);
  await recordBridgeAudit({ organizationId, userId: actorId(actor), action: 'bridge.report.exported', entityId: created.id, metadata: { reportType } });
  return created;
}

export default {
  listBridgeOpportunities,
  createBridgeOpportunity,
  updateBridgeOpportunity,
  deleteBridgeOpportunity,
  listBridgeCounterparties,
  createBridgeCounterparty,
  updateBridgeCounterparty,
  deleteBridgeCounterparty,
  listBridgeIntroductions,
  createBridgeIntroduction,
  listBridgeDocuments,
  createBridgeDocument,
  updateBridgeDocument,
  listBridgeReports,
  createBridgeReport,
  generateBridgeNetworkReport,
  listBridgeAuditLogs,
  getBridgeMatches,
  createBridgeOpportunityFromMaDeal,
  createBridgeOpportunityFromFundingRound,
  listBridgeSignals,
  createBridgeSignal,
  updateBridgeSignal,
  acknowledgeBridgeSignal,
  markBridgeSignalInReview,
  resolveBridgeSignal,
  dismissBridgeSignal,
  listBridgeDependencies,
  createBridgeDependency,
  updateBridgeDependency,
  listBridgeConflicts,
  createBridgeConflict,
  updateBridgeConflict,
  listBridgeAttentionQueue,
  createBridgeAttentionItem,
  updateBridgeAttentionItem,
  listBridgeEvidenceLinks,
  createBridgeEvidenceLink,
  updateBridgeEvidenceLink,
  listBridgeSnapshots,
  createBridgeSnapshot,
  collectBridgeModuleSummaries,
  buildEnterpriseBridgeSignals,
  calculateSignalPriority,
  calculateBridgeSummary,
  recalculateEnterpriseBridge,
  getEnterpriseBridgeSummary,
  getEnterpriseBridgeDashboard,
  generateEnterpriseBridgeReport,
  getBridgeExecutiveHubBrief
};
