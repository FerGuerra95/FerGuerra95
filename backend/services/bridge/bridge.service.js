import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';
import { listAuditLogs, recordAuditLog } from '../audit/auditLog.service.js';
import { getMaDealById, listMaDeals } from '../ma/deals.service.js';
import { listByOrganization as listFundingRounds } from '../funding/funding.service.js';

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
  getBridgeExecutiveHubBrief
};
