import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import { ENTERPRISE_MA_PIPELINE_DEALS } from '../../../shared/config/demoData.js';
import {
  getSavedCaseStage,
  resolveDealStage
} from './maDealLifecycle.js';

export const LIVE_PIPELINE_DEAL_ID = 'active-deal';
export const DEMO_PIPELINE_DEALS = ENTERPRISE_MA_PIPELINE_DEALS;

export function isPipelineE2eItem(item) {
  const payload =
    item?.payload && typeof item.payload === 'object' ? item.payload : {};
  const settings =
    item?.settings && typeof item.settings === 'object' ? item.settings : {};

  return (
    item?.origin === 'e2e' ||
    settings.origin === 'e2e' ||
    payload.origin === 'e2e'
  );
}

export function collectPipelineIdentityKeys(item = {}) {
  const keys = new Set();
  const add = (value, prefix) => {
    const text = String(value || '').trim();
    if (!text) return;
    keys.add(`${prefix}:${text}`);
  };

  const payload =
    item.payload && typeof item.payload === 'object' ? item.payload : {};

  add(item.caseId, 'case');
  add(item.sourceCaseId, 'case');
  add(payload.caseId, 'case');
  add(item.originalId, 'origin');
  add(payload.originalId, 'origin');

  const id = String(item.id || '').trim();
  if (id) {
    add(id, 'id');
    if (id === LIVE_PIPELINE_DEAL_ID) add(LIVE_PIPELINE_DEAL_ID, 'origin');
  }

  if (item.source === 'live') add(LIVE_PIPELINE_DEAL_ID, 'origin');

  return keys;
}

export function pipelineIdentitiesOverlap(left, right) {
  const leftKeys = collectPipelineIdentityKeys(left);
  if (leftKeys.size === 0) return false;

  for (const key of collectPipelineIdentityKeys(right)) {
    if (leftKeys.has(key)) return true;
  }

  return false;
}

export function pipelineDealExists(board, incoming) {
  return findOverlapIndex(Array.isArray(board) ? board : [], incoming) >= 0;
}

export function buildPipelineDeals({
  financials,
  derived,
  savedCases,
  backendDeals,
  currency
} = {}) {
  const serverDeals = normalizeBackendDeals(backendDeals, currency);
  const operationalCases = (Array.isArray(savedCases) ? savedCases : []).filter(
    (item) => !isPipelineE2eItem(item)
  );
  const liveDeal = buildLivePipelineDeal({
    financials,
    derived,
    savedCases: operationalCases,
    currency
  });

  const board = [];
  const savedDeals = operationalCases
    .slice(0, 12)
    .map((item) => buildSavedPipelineDeal(item, currency));

  if (serverDeals.length > 0) {
    serverDeals.forEach((deal) => upsertPipelineDeal(board, deal));
    if (liveDeal) upsertPipelineDeal(board, liveDeal);
    savedDeals.forEach((deal) => upsertPipelineDeal(board, deal));
    return board;
  }

  if (liveDeal) upsertPipelineDeal(board, liveDeal);
  savedDeals.forEach((deal) => upsertPipelineDeal(board, deal));
  DEMO_PIPELINE_DEALS.forEach((demoDeal) => {
    upsertPipelineDeal(board, buildDemoPipelineDeal(demoDeal, currency));
  });

  return board;
}

export function getPipelineSummary(deals, currency) {
  const safeDeals = Array.isArray(deals) ? deals : [];
  const totalEquity = safeDeals.reduce((sum, deal) => {
    const value = Number(deal.equityValue);
    return Number.isFinite(value) ? sum + value : sum;
  }, 0);

  const activeStages = new Set(
    safeDeals.map((deal) => deal.stageId).filter(Boolean)
  ).size;
  const hasHighPriority = safeDeals.some((deal) => deal.priorityTone === 'high');
  const hasWatchPriority = safeDeals.some(
    (deal) => deal.priorityTone === 'watch' || deal.priorityTone === 'build'
  );

  return {
    totalDeals: safeDeals.length,
    totalEquity,
    totalEquityLabel:
      safeDeals.length > 0 ? formatCurrency(totalEquity, currency) : 'N/A',
    activeStages,
    priorityLabel: hasHighPriority
      ? 'High'
      : hasWatchPriority
        ? 'Watchlist'
        : safeDeals.length > 0
          ? 'Review'
          : 'N/A',
    highDealCount: safeDeals.filter((deal) => deal.priorityTone === 'high')
      .length
  };
}

export function formatPipelineUpdatedLabel(value) {
  if (!value) return 'N/A';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'N/A';

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short'
  }).format(date);
}

function upsertPipelineDeal(board, deal) {
  if (!deal) return;

  const index = findOverlapIndex(board, deal);

  if (index >= 0) {
    board[index] = mergePipelineDeals(board[index], deal);
    return;
  }

  board.push(deal);
}

function findOverlapIndex(board, deal) {
  const identityHits = [];
  const fingerprintHits = [];

  board.forEach((item, index) => {
    if (pipelineIdentitiesOverlap(item, deal)) {
      identityHits.push(index);
      return;
    }

    if (isLiveContinuityDuplicate(item, deal)) {
      fingerprintHits.push(index);
    }
  });

  if (identityHits.length > 0) return identityHits[0];
  if (fingerprintHits.length === 1) return fingerprintHits[0];

  return -1;
}

function mergePipelineDeals(base, overlay) {
  const persistedId = pickPersistedId(base, overlay);
  const caseId = overlay.caseId || base.caseId || '';
  const overlayIsLive = overlay.source === 'live';
  const updatedAt = pickLatestTimestamp(base.updatedAt, overlay.updatedAt);
  const stageId = overlayIsLive
    ? base.stageId || overlay.stageId
    : base.source === 'backend'
      ? base.stageId
      : overlay.stageId || base.stageId;

  return {
    ...base,
    ...overlay,
    id: persistedId,
    caseId,
    originalId: pickOriginalId(base.originalId, overlay.originalId, persistedId),
    source: overlayIsLive ? overlay.source : overlay.source || base.source,
    stageId,
    updatedAt,
    updatedLabel: formatPipelineUpdatedLabel(updatedAt),
    href: `/ma/deal/${caseId || persistedId}`
  };
}

function pickLatestTimestamp(left, right) {
  const leftTime = Date.parse(left || '');
  const rightTime = Date.parse(right || '');

  if (Number.isNaN(leftTime) && Number.isNaN(rightTime)) {
    return right || left || '';
  }

  if (Number.isNaN(leftTime)) return right;
  if (Number.isNaN(rightTime)) return left;

  return rightTime >= leftTime ? right : left;
}

function pickPersistedId(base, overlay) {
  if (base.id && base.id !== LIVE_PIPELINE_DEAL_ID) return base.id;
  if (overlay.id && overlay.id !== LIVE_PIPELINE_DEAL_ID) return overlay.id;
  return overlay.id || base.id;
}

function pickOriginalId(baseOriginalId, overlayOriginalId, persistedId) {
  const values = [baseOriginalId, overlayOriginalId].filter(Boolean);

  if (values.includes(LIVE_PIPELINE_DEAL_ID)) return LIVE_PIPELINE_DEAL_ID;

  return (
    values.find((value) => value !== persistedId) ||
    values[0] ||
    ''
  );
}

function isLiveContinuityDuplicate(left, right) {
  const live = left.source === 'live' ? left : right.source === 'live' ? right : null;
  const other = live === left ? right : live === right ? left : null;

  if (!live || !other || other.source === 'live') return false;

  return (
    numbersClose(live.equityValue, other.equityValue) &&
    numbersClose(live.qualityScore, other.qualityScore)
  );
}

function normalizeBackendDeals(backendDeals = [], currency = 'EUR') {
  if (!Array.isArray(backendDeals)) return [];

  return backendDeals
    .filter(Boolean)
    .filter((deal) => !isPipelineE2eItem(deal))
    .filter((deal) => {
      const status = String(deal.status || 'active').toLowerCase();
      return status !== 'archived';
    })
    .map((deal) => {
      const equityValue = Number(deal.equityValue);
      const priorityTone = normalizePriorityTone(deal.priority);
      const updatedAt = deal.updatedAt || deal.createdAt || '';
      const originalId = deal.originalId || deal.payload?.originalId || '';

      return {
        id: deal.id,
        caseId: deal.caseId || deal.payload?.caseId || '',
        originalId,
        source: 'backend',
        name: deal.name || 'M&A Deal',
        sector: deal.sector || deal.payload?.sector || 'Enterprise deal',
        market: deal.market || deal.payload?.market || 'Private pipeline',
        stageId: deal.stage || 'screening',
        equityValue: Number.isFinite(equityValue) ? equityValue : 0,
        qualityScore: getSafeQualityScore(
          deal.qualityScore || deal.payload?.qualityScore
        ),
        equityLabel: Number.isFinite(equityValue)
          ? formatCurrency(equityValue, currency)
          : 'N/A',
        riskLabel: normalizeRiskLabel(deal.riskLevel),
        priority: getPriorityLabelFromTone(priorityTone),
        priorityTone,
        owner: deal.ownerName || 'Deal owner',
        updatedAt,
        updatedLabel: formatPipelineUpdatedLabel(updatedAt),
        href: `/ma/deal/${deal.caseId || deal.id}`
      };
    });
}

function buildDemoPipelineDeal(demoDeal, currency) {
  return {
    ...demoDeal,
    caseId: '',
    originalId: demoDeal.id,
    source: 'demo',
    qualityScore: getSafeQualityScore(demoDeal.qualityScore),
    equityLabel: formatCurrency(demoDeal.equityValue, currency),
    updatedAt: demoDeal.updatedAt || '',
    updatedLabel: demoDeal.updatedAt
      ? formatPipelineUpdatedLabel(demoDeal.updatedAt)
      : demoDeal.updatedLabel || 'N/A',
    href: `/ma/deal/${demoDeal.id}`
  };
}

function buildSavedPipelineDeal(item, currency) {
  const snapshot = item?.snapshot || {};
  const score = getSafeQualityScore(snapshot?.qualityScore);
  const equityValue = Number(snapshot?.equityBase);
  const updatedAt = item?.updatedAt || item?.createdAt || '';

  return {
    id: item?.id,
    caseId: item?.id || '',
    originalId: item?.id || '',
    source: 'saved',
    name: item?.name || 'Saved Deal',
    sector: item?.financials?.sector || 'Saved case',
    market:
      item?.financials?.country ||
      item?.financials?.market ||
      item?.financials?.geography ||
      'Repository',
    stageId: getSavedCaseStage(item),
    equityValue: Number.isFinite(equityValue) ? equityValue : 0,
    qualityScore: score,
    equityLabel: Number.isFinite(equityValue)
      ? formatCurrency(equityValue, currency)
      : 'N/A',
    riskLabel: snapshot?.riskLevel || getRiskLabelFromScore(score),
    priority: getPriorityLabel(score),
    priorityTone: getPriorityTone(score),
    owner: 'Repository',
    updatedAt,
    updatedLabel: formatPipelineUpdatedLabel(updatedAt),
    href: `/ma/deal/${item?.id}`
  };
}

function buildLivePipelineDeal({ financials, derived, savedCases, currency }) {
  if (!hasSufficientDealData(financials, derived)) return null;

  const qualityScore = getSafeQualityScore(derived?.qualityScore);
  const equityValue = Number(derived?.equityBase);
  const liveDeal = {
    id: LIVE_PIPELINE_DEAL_ID,
    caseId: '',
    originalId: LIVE_PIPELINE_DEAL_ID,
    source: 'live',
    name: financials?.name?.trim() || 'Active Target',
    sector: financials?.sector || 'Sector not specified',
    market:
      financials?.country ||
      financials?.market ||
      financials?.geography ||
      'Primary market',
    stageId: resolveDealStage({ qualityScore }),
    equityValue: Number.isFinite(equityValue) ? equityValue : 0,
    qualityScore,
    equityLabel: Number.isFinite(equityValue)
      ? formatCurrency(equityValue, currency)
      : 'N/A',
    riskLabel:
      derived?.riskLevel?.label ||
      derived?.riskLevel ||
      getRiskLabelFromScore(qualityScore),
    priority: getPriorityLabel(qualityScore),
    priorityTone: getPriorityTone(qualityScore),
    owner: 'CEO workspace',
    updatedAt: '',
    updatedLabel: 'N/A',
    href: `/ma/deal/${LIVE_PIPELINE_DEAL_ID}`
  };

  const matchedCase = findUniqueContinuityCase(savedCases, liveDeal);
  if (!matchedCase) return liveDeal;

  return {
    ...liveDeal,
    caseId: matchedCase.id,
    originalId: LIVE_PIPELINE_DEAL_ID,
    updatedAt: matchedCase.updatedAt || matchedCase.createdAt || '',
    updatedLabel: formatPipelineUpdatedLabel(
      matchedCase.updatedAt || matchedCase.createdAt
    ),
    href: `/ma/deal/${matchedCase.id}`
  };
}

function findUniqueContinuityCase(savedCases, liveDeal) {
  const matches = (Array.isArray(savedCases) ? savedCases : []).filter((item) =>
    numbersClose(item?.snapshot?.equityBase, liveDeal.equityValue) &&
    numbersClose(item?.snapshot?.qualityScore, liveDeal.qualityScore)
  );

  return matches.length === 1 ? matches[0] : null;
}

function normalizePriorityTone(value) {
  const normalized = String(value || '').toLowerCase();

  if (['high', 'review', 'watch', 'build'].includes(normalized)) return normalized;
  if (normalized === 'low') return 'watch';

  return 'review';
}

function getPriorityLabelFromTone(value) {
  const tone = normalizePriorityTone(value);

  if (tone === 'high') return 'High';
  if (tone === 'watch') return 'Watch';
  if (tone === 'build') return 'Build';

  return 'Review';
}

function normalizeRiskLabel(value) {
  const normalized = String(value || '').toLowerCase();

  if (normalized.includes('control')) return 'Controlled';
  if (normalized.includes('elev')) return 'Elevated';
  if (normalized.includes('mod')) return 'Moderate';
  if (normalized === 'high' || normalized.includes('alto')) return 'High';
  if (normalized === 'low' || normalized.includes('bajo')) return 'Low';
  if (normalized.includes('medio')) return 'Medio';

  return 'Medium';
}

function getPriorityLabel(score) {
  if (score === null) return 'Build';
  if (score >= 80) return 'High';
  if (score >= 55) return 'Review';

  return 'Watch';
}

function getPriorityTone(score) {
  if (score === null) return 'build';
  if (score >= 80) return 'high';
  if (score >= 55) return 'review';

  return 'watch';
}

function getRiskLabelFromScore(score) {
  if (score === null) return 'To assess';
  if (score >= 80) return 'Controlled';
  if (score >= 60) return 'Moderate';
  if (score >= 40) return 'Elevated';

  return 'High';
}

function hasSufficientDealData(financials, derived) {
  const hasName = Boolean(financials?.name?.trim());
  const hasSector = Boolean(financials?.sector);
  const normalizedEbitda = Number(derived?.normalizedEbitda);

  return (
    hasName &&
    hasSector &&
    Number.isFinite(normalizedEbitda) &&
    normalizedEbitda > 0
  );
}

function getSafeQualityScore(score) {
  const parsed = Number(score);

  if (!Number.isFinite(parsed)) return null;

  return Math.max(0, Math.min(100, Math.round(parsed)));
}

function numbersClose(left, right, epsilon = 1) {
  const a = Number(left);
  const b = Number(right);

  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;

  return Math.abs(a - b) <= epsilon;
}
