export function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value))));
}

export function normalizeScoreOrNull(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? clampScore(parsed) : null;
}

export function formatScoreLabel(score, fallbackLabel = 'N/A') {
  return normalizeScoreOrNull(score) === null ? fallbackLabel : `${normalizeScoreOrNull(score)}%`;
}

export function formatModuleScoreDisplay(score, fallbackLabel = 'N/A') {
  const normalized = normalizeScoreOrNull(score);
  return normalized === null ? fallbackLabel : `${normalized}/100`;
}

export function formatExecutiveScoreNumber(score, fallbackLabel = 'N/A') {
  const normalized = normalizeScoreOrNull(score);
  return normalized === null ? fallbackLabel : String(normalized);
}

export const MODULE_READINESS_NA_CLARIFICATION =
  'N/A means insufficient available data, not poor operational performance.';

export const BRIEFING_PACK_STATUS_ONLY_NOTE =
  'Status only · not a downloadable or certified pack';

export const BOARD_PACK_GENERATE_DISABLED_HINT =
  'Board draft generation requires admin or board member role';

export const BOARD_PACK_PRINT_DRAFT_HINT =
  'Uses browser print. Draft only. Layout may vary by browser.';

export function resolveBoardReviewDraftPackStatus({
  sessionGeneratedAt = null,
  lastDraftTraceAt = null
} = {}) {
  const session = String(sessionGeneratedAt || '').trim();
  const trace = String(lastDraftTraceAt || '').trim();

  if (session) {
    return {
      statusLabel: 'Draft prepared this session',
      statusNote: BRIEFING_PACK_STATUS_ONLY_NOTE
    };
  }

  if (trace) {
    return {
      statusLabel: 'Previous draft trace',
      statusNote: BRIEFING_PACK_STATUS_ONLY_NOTE
    };
  }

  return {
    statusLabel: 'Draft',
    statusNote: BRIEFING_PACK_STATUS_ONLY_NOTE
  };
}

export const INFORMATIONAL_POSTURE_NOTE = 'Operating posture · not a scored signal';

const EXECUTIVE_BLOCKER_BRANCH_COPY = {
  funding:
    'Funding cannot be assessed until executive funding inputs are available.',
  risk: 'Risk posture cannot be reviewed without persisted risk data.',
  governance: 'Governance needs board-control inputs before executive review.',
  compliance:
    'Compliance signal requires persisted supplier and evidence inputs.',
  ma: 'M&A posture cannot be scored until persisted deal/case data is available.',
  pmi: 'PMI integration signal remains pending until source inputs are available.',
  reporting:
    'Reporting signal may be available, but board readiness still requires review.',
  strategy: 'Strategy inputs remain pending for executive scoring.',
  bridge: 'Bridge signal remains pending until source inputs are available.',
  heritage: 'Heritage inputs remain pending for executive scoring.'
};

function humanizeExecutiveBlockerDescription(moduleKey, rawDescription = '') {
  const key = String(moduleKey || '').trim().toLowerCase();
  const raw = String(rawDescription || '').trim();
  const rawLower = raw.toLowerCase();

  if (EXECUTIVE_BLOCKER_BRANCH_COPY[key]) {
    if (
      rawLower.includes('pending') ||
      rawLower.includes('insufficient') ||
      rawLower.includes('missing') ||
      !raw
    ) {
      return EXECUTIVE_BLOCKER_BRANCH_COPY[key];
    }
  }

  if (rawLower.includes('insufficient persisted module data')) {
    return (
      EXECUTIVE_BLOCKER_BRANCH_COPY[key] ||
      'Module inputs remain pending before executive scoring.'
    );
  }

  if (rawLower.includes('missing') && rawLower.includes('executive score')) {
    const branch = EXECUTIVE_RADAR_BRANCH_LABELS[key] || key;
    return (
      EXECUTIVE_BLOCKER_BRANCH_COPY[key] ||
      `${branch} inputs are pending — not treated as a failed score.`
    );
  }

  if (!raw || rawLower === 'pending inputs' || rawLower.includes('insufficient data')) {
    return (
      EXECUTIVE_BLOCKER_BRANCH_COPY[key] ||
      'Inputs pending before executive review — not a performance failure.'
    );
  }

  return raw;
}

function humanizeExecutiveBlockerEffect(effect = '') {
  const safe = String(effect || '').trim();
  if (safe === 'Blocks complete executive posture') {
    return 'Executive posture incomplete until inputs arrive';
  }
  if (safe === 'Blocks board readiness signal' || safe === 'Blocks executive posture') {
    return 'Required before board circulation';
  }
  return safe || 'Required before board circulation';
}

export function humanizeExecutiveBlocker(blocker = {}) {
  const description = humanizeExecutiveBlockerDescription(
    blocker.moduleKey,
    blocker.description
  );
  const effect = humanizeExecutiveBlockerEffect(blocker.effect);
  return {
    ...blocker,
    description,
    effect,
    summaryLine: description
  };
}

export const EXECUTIVE_RADAR_BRANCH_ORDER = [
  'ma',
  'funding',
  'compliance',
  'risk',
  'pmi',
  'governance',
  'strategy',
  'reporting',
  'bridge',
  'heritage'
];

export const EXECUTIVE_RADAR_BRANCH_LABELS = {
  ma: 'M&A',
  funding: 'Funding',
  compliance: 'Compliance',
  risk: 'Risk',
  pmi: 'PMI',
  governance: 'Governance',
  strategy: 'Strategy',
  reporting: 'Reporting',
  bridge: 'Bridge',
  heritage: 'Heritage'
};

const EXECUTIVE_RADAR_BRANCH_ALIASES = {
  legal: 'compliance',
  compliance: 'compliance',
  financial: 'ma',
  ma: 'ma',
  'm&a': 'ma',
  ops: 'pmi',
  operational: 'pmi',
  pmi: 'pmi',
  esg: 'governance',
  governance: 'governance',
  funding: 'funding',
  risk: 'risk',
  strategy: 'strategy',
  reporting: 'reporting',
  bridge: 'bridge',
  heritage: 'heritage',
  'financial · m&a': 'ma',
  'financial â· m&a': 'ma',
  'financial â€¢ m&a': 'ma',
  'financial a· m&a': 'ma',
  'esg & reputational risk': 'governance',
  'enterprise risk': 'risk',
  'pmi / synergies': 'pmi'
};

export function normalizeExecutiveRadarBranchKey(axis = {}) {
  const key = String(axis?.key || '').trim().toLowerCase();
  if (key && EXECUTIVE_RADAR_BRANCH_ALIASES[key]) {
    return EXECUTIVE_RADAR_BRANCH_ALIASES[key];
  }

  const label = String(axis?.label || '').trim().toLowerCase();
  return EXECUTIVE_RADAR_BRANCH_ALIASES[label] || key || label;
}

function statusImpliesPendingInputs(value) {
  const safe = String(value || '').trim().toLowerCase();
  if (!safe) {
    return false;
  }

  return (
    safe === 'insufficient_data' ||
    safe === 'not_available' ||
    safe === 'empty' ||
    safe === 'missing' ||
    safe === 'pending' ||
    safe === 'pending_inputs' ||
    safe.includes('pending input') ||
    safe.includes('missing input') ||
    safe.includes('insufficient')
  );
}

export function statusIndicatesInsufficientData(...values) {
  return values.some((value) => statusImpliesPendingInputs(value));
}

export function getRadarGeometryValue(score) {
  const normalized = normalizeScoreOrNull(score);
  return normalized === null ? 0 : normalized;
}

export function resolveLegalHealthRadarScore(hubBrief) {
  const hasAuditBaseline = Boolean(hubBrief?.latestAuditRun?.id);
  const hubScore = normalizeScoreOrNull(hubBrief?.legalHealthScore);

  if (!hasAuditBaseline) {
    return null;
  }

  return hubScore;
}

export function mapExecutiveCorporateRadarAxis(axis) {
  const safeAxis = axis && typeof axis === 'object' ? axis : {};
  const key = normalizeExecutiveRadarBranchKey(safeAxis);
  const score = normalizeScoreOrNull(safeAxis.value ?? safeAxis.score);
  const insufficient =
    score === null ||
    safeAxis.isCalculable === false ||
    safeAxis.executiveSignalEligible === false ||
    statusIndicatesInsufficientData(safeAxis.status, safeAxis.posture, safeAxis.dataSource);
  const displayScore = insufficient ? null : score;

  const status = insufficient
    ? 'insufficient_data'
    : safeAxis.status || (displayScore < 60 ? 'watch' : 'normal');

  return {
    key,
    label: EXECUTIVE_RADAR_BRANCH_LABELS[key] || safeAxis.label,
    route: safeAxis.route,
    tone: safeAxis.tone,
    score: displayScore,
    value: displayScore,
    displayLabel: formatScoreLabel(displayScore),
    status,
    isCalculable: displayScore !== null,
    executiveSignalEligible: displayScore !== null
  };
}

export function mergeExecutiveCorporateRadarAxes(primaryAxes = [], fallbackAxes = []) {
  const byBranch = new Map();
  const axes = [
    ...(Array.isArray(primaryAxes) ? primaryAxes : []),
    ...(Array.isArray(fallbackAxes) ? fallbackAxes : [])
  ];

  axes.forEach((axis) => {
    if (!axis || typeof axis !== 'object') return;

    const mapped = mapExecutiveCorporateRadarAxis(axis);
    const key = normalizeExecutiveRadarBranchKey(mapped);

    if (!EXECUTIVE_RADAR_BRANCH_ORDER.includes(key)) return;

    const current = byBranch.get(key);
    if (!current || (!current.isCalculable && mapped.isCalculable)) {
      byBranch.set(key, mapped);
    }
  });

  return EXECUTIVE_RADAR_BRANCH_ORDER.map((key) => byBranch.get(key)).filter(Boolean);
}

export function alignOverviewScoreWithRadarBranch(overview = {}, axes = [], branchKey = '') {
  const safeAxes = Array.isArray(axes) ? axes : [];
  const targetKey = normalizeExecutiveRadarBranchKey({ key: branchKey });
  const axis = safeAxes.find((item) => normalizeExecutiveRadarBranchKey(item) === targetKey);

  if (!axis) {
    return overview;
  }

  const score = normalizeScoreOrNull(axis.value ?? axis.score);
  const insufficient =
    score === null ||
    axis.isCalculable === false ||
    axis.executiveSignalEligible === false ||
    statusIndicatesInsufficientData(axis.status, axis.posture, axis.dataSource);

  if (insufficient) {
    return {
      ...overview,
      score: null,
      dataSource: 'insufficient_data',
      truthfulnessStatus: 'insufficient_data',
      executiveSignalEligible: false,
      posture: 'insufficient_data',
      scoreDisplay: null
    };
  }

  return {
    ...overview,
    score,
    dataSource: axis.dataSource || overview.dataSource || 'operational_dss',
    truthfulnessStatus: overview.truthfulnessStatus || 'operational_dss',
    executiveSignalEligible: true,
    scoreDisplay: null
  };
}

export function buildRadarAxis({ key, label, score, route, tone }) {
  const normalized = normalizeScoreOrNull(score);
  return {
    key,
    label,
    score: normalized,
    value: getRadarGeometryValue(normalized),
    displayLabel: formatScoreLabel(normalized),
    route,
    tone,
    isCalculable: normalized !== null,
    humanReviewRequired: true,
    dataSource: normalized === null ? 'insufficient_data' : 'operational_dss'
  };
}

function insufficientOverview(partial = {}) {
  return {
    score: null,
    dataSource: 'insufficient_data',
    truthfulnessStatus: 'insufficient_data',
    executiveSignalEligible: false,
    humanReviewRequired: true,
    scoreDisplay: 'Insufficient data — human review required',
    ...partial
  };
}

export function getMAOverview(maStore = {}) {
  const deals = Array.isArray(maStore.deals)
    ? maStore.deals
    : Array.isArray(maStore.savedDeals)
      ? maStore.savedDeals
      : Array.isArray(maStore.cases)
        ? maStore.cases
        : Array.isArray(maStore.savedCases)
          ? maStore.savedCases
          : Array.isArray(maStore.maCases)
            ? maStore.maCases
            : [];

  const activeDeal =
    maStore.activeDeal ||
    maStore.currentDeal ||
    maStore.selectedDeal ||
    deals[0] ||
    null;

  const targetName =
    activeDeal?.targetName ||
    activeDeal?.name ||
    activeDeal?.companyName ||
    maStore.targetName ||
    maStore.companyName ||
    'M&A workspace';

  const reportCount = Array.isArray(maStore.reports)
    ? maStore.reports.length
    : Array.isArray(maStore.generatedReports)
      ? maStore.generatedReports.length
      : Array.isArray(maStore.exportedReports)
        ? maStore.exportedReports.length
        : 0;

  if (deals.length === 0) {
    return insufficientOverview({
      title: 'M&A data pending',
      posture: 'insufficient_data',
      targetName,
      dealsCount: 0,
      reportCount,
      description:
        'M&A DSS layer is available, but no persisted deal or case is eligible for executive scoring yet.'
    });
  }

  return {
    score: clampScore(72 + Math.min(18, deals.length * 3)),
    dataSource: 'operational_dss',
    truthfulnessStatus: 'operational_dss',
    executiveSignalEligible: true,
    humanReviewRequired: true,
    scoreDisplay: null,
    title: 'M&A pipeline active',
    posture: 'Review deal signals',
    targetName,
    dealsCount: deals.length,
    reportCount,
    description:
      'M&A functions as a premium layer for valuation, deal intelligence and executive reporting. DSS only — human review required.'
  };
}

export function getComplianceOverview({ suppliers = [], alerts = [], evidenceItems = [], reviews = [] } = {}) {
  const safeSuppliers = Array.isArray(suppliers) ? suppliers : [];
  const safeAlerts = Array.isArray(alerts) ? alerts : [];
  const safeEvidence = Array.isArray(evidenceItems) ? evidenceItems : [];
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  const openAlerts = safeAlerts.filter((alert) => {
    const status = String(alert?.status || '').toLowerCase();
    return !status || status.includes('open') || status.includes('review');
  }).length;

  if (safeSuppliers.length === 0 && safeEvidence.length === 0 && safeReviews.length === 0) {
    return insufficientOverview({
      title: 'Compliance data pending',
      posture: 'insufficient_data',
      supplierCount: 0,
      openAlerts,
      evidenceCount: 0,
      reviewCount: 0,
      description:
        'Compliance executive signal requires persisted suppliers, audits or evidence. No certified compliance posture is implied.'
    });
  }

  const supplierRiskScores = safeSuppliers
    .map((supplier) => normalizeScoreOrNull(supplier?.riskScore))
    .filter((value) => value !== null);

  if (supplierRiskScores.length === 0) {
    return insufficientOverview({
      title: 'Compliance score pending',
      posture: 'insufficient_data',
      supplierCount: safeSuppliers.length,
      openAlerts,
      evidenceCount: safeEvidence.length,
      reviewCount: safeReviews.length,
      description:
        'Supplier, evidence or alert records exist, but no persisted supplier risk score is available for an executive compliance signal. Human review required — not a certified audit score.'
    });
  }

  const averageRisk =
    supplierRiskScores.reduce((total, value) => total + value, 0) / supplierRiskScores.length;

  const score = clampScore(
    100 -
      averageRisk +
      Math.min(14, safeEvidence.length * 2) +
      Math.min(10, safeReviews.length * 2) -
      openAlerts * 4
  );

  return {
    score,
    dataSource: 'operational_dss',
    truthfulnessStatus: 'operational_dss',
    executiveSignalEligible: true,
    humanReviewRequired: true,
    scoreDisplay: null,
    title: openAlerts > 0 ? 'Compliance exposure monitored' : 'Compliance posture under review',
    posture: openAlerts > 0 ? 'Review open alerts' : 'Maintain evidence review',
    supplierCount: safeSuppliers.length,
    openAlerts,
    evidenceCount: safeEvidence.length,
    reviewCount: safeReviews.length,
    description:
      openAlerts > 0
        ? 'Compliance centralizes suppliers, alerts, evidence and human review workflows. DSS only.'
        : 'Compliance presents an operational supplier and evidence baseline. Human review required.'
  };
}

export function getEcosystemBranchOverview(ecosystemBrief = null, branchKey, options = {}) {
  const branches = Array.isArray(ecosystemBrief?.branches) ? ecosystemBrief.branches : [];
  const branch = branches.find((item) => item?.branch === branchKey);
  const score = normalizeScoreOrNull(branch?.score);

  if (score === null) {
    return insufficientOverview({
      title: options.title || 'Module data pending',
      posture: 'insufficient_data',
      description: options.description || 'Insufficient persisted module data for executive scoring.',
      route: options.route || '/dashboard',
      recordsCount: branch?.recordsCount ?? 0,
      activeRecordsCount: branch?.activeRecordsCount ?? 0,
      metrics: branch?.metrics || {},
      latestTitle: options.latestTitle || 'Insufficient persisted data'
    });
  }

  return {
    score,
    dataSource: 'operational_dss',
    truthfulnessStatus: 'operational_dss',
    executiveSignalEligible: true,
    humanReviewRequired: true,
    scoreDisplay: null,
    title: branch?.title || options.title,
    posture: branch?.posture || options.posture || 'watch',
    description: options.description,
    route: options.route || branch?.route,
    recordsCount: branch?.recordsCount ?? 0,
    activeRecordsCount: branch?.activeRecordsCount ?? 0,
    metrics: branch?.metrics || {},
    latestTitle: branch?.latestRecord?.title || options.latestTitle
  };
}

export function getRiskOverview(riskSummary = null) {
  const metrics = riskSummary?.metrics || {};
  const riskCount = Number(riskSummary?.counts?.risks ?? 0);
  const scoreRaw = metrics.riskReadinessScore ?? riskSummary?.riskReadinessScore;
  const hasEligibleScore =
    riskCount > 0 &&
    metrics.executiveSignalEligible !== false &&
    metrics.dataSource !== 'insufficient_data' &&
    normalizeScoreOrNull(scoreRaw) !== null;
  const score = hasEligibleScore ? normalizeScoreOrNull(scoreRaw) : null;

  if (score === null) {
    return insufficientOverview({
      title: 'Enterprise Risk data pending',
      posture: 'insufficient_data',
      recordsCount: riskCount,
      activeRecordsCount: metrics.criticalRiskCount || riskSummary?.criticalRiskCount || 0,
      latestTitle: 'Insufficient persisted risk data',
      metrics,
      description:
        'Enterprise Risk requires persisted register data before an operational readiness signal is shown. Not a certified risk rating.'
    });
  }

  return {
    score,
    dataSource: metrics.dataSource || 'operational_dss',
    truthfulnessStatus: 'operational_dss',
    executiveSignalEligible: true,
    humanReviewRequired: true,
    scoreDisplay: null,
    title: 'Enterprise Risk Command',
    posture: metrics.riskPosture || 'watch',
    recordsCount: riskCount,
    activeRecordsCount: metrics.criticalRiskCount || riskSummary?.criticalRiskCount || 0,
    latestTitle: riskSummary?.latestRisk?.title || 'Enterprise risk posture',
    metrics,
    description:
      'Enterprise Risk centralizes register, heatmap, controls and mitigations. Operational DSS only — human review required.'
  };
}

export function estimateMaFinancialRadar(cases = []) {
  const list = Array.isArray(cases) ? cases.filter(Boolean) : [];
  if (list.length === 0) {
    return { score: null, geometryValue: 0 };
  }

  let total = 0;
  list.forEach((caseItem) => {
    let pts = 68;
    const fin = caseItem?.financials || caseItem?.financialInputs || {};
    const ebitLike =
      Number(fin.normalizedEbitda ?? fin.ebitda ?? fin.ebitDa ?? fin.revenue) || 0;
    if (ebitLike > 0) pts += 10;
    const dirty =
      Boolean(caseItem?.settings?.complianceRiskImpact?.valuationDirty) ||
      caseItem?.settings?.valuationRecalculation?.status === 'dirty';
    if (dirty) pts -= 15;
    const legalTouch = Number(caseItem?.settings?.complianceRiskImpact?.legalRiskScore);
    if (Number.isFinite(legalTouch) && legalTouch >= 55) pts -= 9;
    total += clampScore(pts);
  });

  const score = clampScore(total / list.length);
  return { score, geometryValue: score };
}

export function getExecutiveSignal(modules = []) {
  const eligible = modules.filter(
    (item) =>
      item?.executiveSignalEligible !== false &&
      normalizeScoreOrNull(item?.score) !== null &&
      item?.truthfulnessStatus !== 'insufficient_data' &&
      !['insufficient_data', 'empty', 'fallback', 'api_unavailable'].includes(item?.dataSource)
  );

  if (eligible.length === 0) {
    return {
      score: null,
      scoreDisplay: 'N/A',
      title: 'Executive signal pending',
      posture: 'insufficient_data',
      description:
        'Executive DSS baseline requires persisted module data. No executive score is synthesized from fallback values.',
      humanReviewRequired: true,
      executiveSignalEligible: false,
      dataSource: 'insufficient_data'
    };
  }

  const score = clampScore(
    eligible.reduce((sum, item) => sum + normalizeScoreOrNull(item.score), 0) / eligible.length
  );

  return {
    score,
    scoreDisplay: `${score}/100`,
    title: 'Executive DSS signal available',
    posture: 'Human review required',
    description:
      'Eligible module signals feed the executive layer. Decision support only — not a certified enterprise rating.',
    humanReviewRequired: true,
    executiveSignalEligible: true,
    dataSource: 'partial_operational_dss'
  };
}

export function buildInsufficientFallbackModuleCards() {
  return [
    ['ma', 'M&A', '/ma/dashboard'],
    ['compliance', 'Compliance', '/compliance/dashboard'],
    ['funding', 'Funding', '/funding/dashboard'],
    ['governance', 'Governance', '/governance/dashboard'],
    ['pmi', 'PMI', '/pmi/dashboard'],
    ['bridge', 'Bridge', '/bridge/dashboard'],
    ['risk', 'Risk', '/risk/dashboard'],
    ['reporting', 'Reporting', '/reporting/dashboard'],
    ['strategy', 'Strategy', '/strategy/dashboard'],
    ['heritage', 'Heritage', '/heritage/dashboard']
  ].map(([key, title, route]) => ({
    key,
    title,
    route,
    score: null,
    status: 'insufficient_data',
    keyMetric: 'Insufficient persisted executive data',
    cta: 'Open module',
    humanReviewRequired: true
  }));
}

export function formatModuleSignalValue(overview) {
  if (overview?.scoreDisplay) {
    return overview.scoreDisplay;
  }
  return formatScoreLabel(overview?.score);
}

export const EXECUTIVE_MODULE_ROUTES = {
  ma: '/ma/dashboard',
  'm&a': '/ma/dashboard',
  funding: '/funding/dashboard',
  compliance: '/compliance/dashboard',
  risk: '/risk/register',
  pmi: '/pmi/dashboard',
  governance: '/governance/dashboard',
  strategy: '/strategy/dashboard',
  reporting: '/reporting/dashboard',
  bridge: '/bridge/dashboard',
  heritage: '/heritage/dashboard'
};

function resolveExecutiveModuleRoute(module = '') {
  const key = String(module || '')
    .trim()
    .toLowerCase();
  return EXECUTIVE_MODULE_ROUTES[key] || '';
}

function hasPersistedDueDate(value) {
  const safe = String(value || '').trim();
  return Boolean(safe) && safe !== 'N/A';
}

export function buildExecutiveLiveDecisionQueueItems(decisionQueue = [], { limit = 12 } = {}) {
  if (!Array.isArray(decisionQueue) || decisionQueue.length === 0) {
    return [];
  }

  return decisionQueue.slice(0, limit).map((item, index) => ({
    id: item?.id || `queue-${index}`,
    title: String(item?.title || 'Executive decision').trim(),
    module: String(item?.module || 'Enterprise').trim(),
    severity: String(item?.severity || 'watch').trim(),
    recommendedAction: String(item?.recommendedAction || '').trim() || null,
    priorityScore: Number.isFinite(Number(item?.priorityScore)) ? Number(item.priorityScore) : null,
    dueDate: hasPersistedDueDate(item?.dueDate) ? String(item.dueDate).trim() : null,
    status: String(item?.status || 'open').trim(),
    route: resolveExecutiveModuleRoute(item?.module)
  }));
}

function normalizeExecutiveModuleKey(module = '') {
  const safe = String(module || '').trim().toLowerCase();
  if (safe === 'm&a' || safe === 'ma') {
    return 'ma';
  }
  if (EXECUTIVE_MODULE_ROUTES[safe]) {
    return safe;
  }

  const labelMatch = Object.entries(EXECUTIVE_RADAR_BRANCH_LABELS).find(
    ([, label]) => label.toLowerCase() === safe
  );
  return labelMatch?.[0] || safe.replace(/\s+/g, '');
}

function executiveModuleDisplayLabel(moduleKey, fallbackModule = '') {
  return EXECUTIVE_RADAR_BRANCH_LABELS[moduleKey] || String(fallbackModule || moduleKey).trim();
}

function isUnavailableSignalSource(source = {}) {
  const title = String(source?.title || '').toLowerCase();
  const status = String(source?.status || '').toLowerCase();
  const severity = String(source?.severity || '').toLowerCase();

  return (
    title.includes('signal not available') ||
    title.includes('not available') ||
    severity === 'insufficient_data' ||
    status === 'insufficient_data' ||
    status === 'not_available'
  );
}

function recommendedActionSeverityScore(source = {}) {
  const severity = String(source?.severity || '').toLowerCase();
  let score = 0;

  if (severity === 'critical' || severity === 'blocked') {
    score += 100;
  } else if (severity === 'risk' || severity === 'high') {
    score += 80;
  } else if (severity === 'watch' || severity === 'medium') {
    score += 50;
  } else {
    score += 20;
  }

  if (String(source?.recommendedAction || '').trim()) {
    score += 30;
  }

  const moduleKey = normalizeExecutiveModuleKey(source?.module);
  if (moduleKey === 'pmi') {
    score += 25;
  } else if (['compliance', 'risk'].includes(moduleKey)) {
    score += 15;
  }

  return score;
}

function buildRecommendedActionFallbackLabel(source = {}, route = '') {
  const recommendedAction = String(source?.recommendedAction || '').trim();
  if (recommendedAction) {
    return recommendedAction;
  }
  if (route) {
    return 'Review source module before board circulation.';
  }
  return 'Complete source inputs before board circulation.';
}

const SUGGESTED_OWNER_BY_MODULE = {
  compliance: 'Legal / Compliance',
  funding: 'CFO / Funding',
  pmi: 'Integration Lead',
  governance: 'Governance Lead',
  risk: 'Risk Lead',
  ma: 'Corporate Development'
};

export function resolveSuggestedOwnerLabel(moduleKey, { isGroupedPending = false } = {}) {
  if (isGroupedPending) {
    return null;
  }
  const owner = SUGGESTED_OWNER_BY_MODULE[String(moduleKey || '').trim().toLowerCase()];
  return owner ? `Suggested owner: ${owner}` : null;
}

function isGenericExecutiveScope(moduleKey, module = '') {
  const safeModule = String(module || '').trim().toLowerCase();
  return (
    moduleKey === 'enterprise' ||
    moduleKey === 'executive' ||
    safeModule === 'enterprise' ||
    safeModule === 'executive'
  );
}

function summarizeRecommendedActionTitle(source = {}) {
  const title = String(source?.title || '').trim();
  const moduleKey = normalizeExecutiveModuleKey(source?.module);
  const label = executiveModuleDisplayLabel(moduleKey, source?.module);

  if (!title || isUnavailableSignalSource(source)) {
    return null;
  }

  if (isGenericExecutiveScope(moduleKey, source?.module)) {
    return 'Review readiness blockers';
  }

  if (moduleKey === 'pmi') {
    return 'Review PMI';
  }

  if (/exposure|alert|escalation|review|decision|opportunity|blocker|readiness/i.test(title)) {
    return title;
  }

  if (/^review\s+executive$/i.test(`Review ${label}`)) {
    return 'Validate board readiness inputs';
  }

  return `Review ${label}`;
}

function buildGroupedPendingSignalsAction(moduleKeys = []) {
  const uniqueKeys = [...new Set(moduleKeys.filter(Boolean))];
  if (!uniqueKeys.length) {
    return null;
  }

  const labels = uniqueKeys.map((key) => executiveModuleDisplayLabel(key));
  const moduleList = labels.join(' · ');

  return {
    id: 'pending-module-signals',
    title: uniqueKeys.length > 1 ? 'Pending module signals' : `${labels[0]} signal pending`,
    module: 'Enterprise',
    moduleKey: 'enterprise',
    severity: 'watch',
    recommendedAction: null,
    actionLabel:
      uniqueKeys.length > 1
        ? `${moduleList} require source inputs before board circulation.`
        : `${labels[0]} requires source inputs before board circulation.`,
    whyItMatters: 'Pending inputs — not treated as failed performance',
    status: 'Pending inputs',
    route: null,
    isGroupedPending: true
  };
}

function buildRecommendedActionEntry(source, { queueLiteralPhrases = new Set() } = {}) {
  const module = String(source?.module || 'Enterprise').trim();
  const moduleKey = normalizeExecutiveModuleKey(module);
  const title = summarizeRecommendedActionTitle(source);
  if (!title) {
    return null;
  }

  const recommendedAction = String(source?.recommendedAction || '').trim();
  const route = resolveExecutiveModuleRoute(module);
  const actionLabel = buildRecommendedActionFallbackLabel(source, route);
  const literalPhrase = `${title}::${actionLabel}`.toLowerCase();

  if (queueLiteralPhrases.has(literalPhrase)) {
    return null;
  }

  const severity = String(source?.severity || 'watch').trim();

  return {
    id: `${moduleKey}-${title}`,
    title,
    module,
    moduleKey,
    severity,
    recommendedAction: recommendedAction || null,
    actionLabel,
    whyItMatters:
      severity.toLowerCase() === 'critical' || severity.toLowerCase() === 'risk'
        ? 'Elevated attention across executive posture'
        : 'Supports board-ready review',
    status:
      String(source?.status || '').trim() ||
      (recommendedAction ? 'Suggested action' : 'Review required'),
    route,
    isGroupedPending: false,
    suggestedOwner: resolveSuggestedOwnerLabel(moduleKey)
  };
}

export function buildExecutiveRecommendedActions({
  alerts = [],
  signals = [],
  decisionQueue = [],
  limit = 3
} = {}) {
  const combined = [
    ...(Array.isArray(alerts) ? alerts : []),
    ...(Array.isArray(signals) ? signals : [])
  ];
  if (!combined.length) {
    return [];
  }

  const mainLimit = Math.min(3, Math.max(1, Number(limit) || 3));
  const queueItems = buildExecutiveLiveDecisionQueueItems(decisionQueue, { limit: 12 });
  const queueLiteralPhrases = new Set(
    queueItems.flatMap((item) => {
      const title = String(item.title || '').trim();
      const action = String(item.recommendedAction || 'Review required').trim();
      return [`${title}::${action}`.toLowerCase()];
    })
  );

  const seenSourceKeys = new Set();
  const unavailableModuleKeys = [];
  const rankedCandidates = [];

  combined.forEach((source) => {
    const title = String(source?.title || '').trim();
    const moduleKey = normalizeExecutiveModuleKey(source?.module);
    const sourceKey = `${moduleKey}::${title.toLowerCase()}`;
    if (!title || seenSourceKeys.has(sourceKey)) {
      return;
    }
    seenSourceKeys.add(sourceKey);

    if (isUnavailableSignalSource(source)) {
      unavailableModuleKeys.push(moduleKey);
      return;
    }

    rankedCandidates.push({
      source,
      moduleKey,
      score: recommendedActionSeverityScore(source)
    });
  });

  rankedCandidates.sort((left, right) => right.score - left.score);

  const actions = [];
  const usedModules = new Set();

  for (const candidate of rankedCandidates) {
    const mainCount = actions.filter((item) => !item.isGroupedPending).length;
    if (mainCount >= mainLimit) {
      break;
    }

    const { source, moduleKey } = candidate;
    if (usedModules.has(moduleKey)) {
      continue;
    }

    const entry = buildRecommendedActionEntry(source, { queueLiteralPhrases });
    if (!entry) {
      continue;
    }

    usedModules.add(moduleKey);
    actions.push(entry);
  }

  const groupedPending = buildGroupedPendingSignalsAction(unavailableModuleKeys);
  if (groupedPending) {
    actions.push(groupedPending);
  }

  return actions;
}

function blockerDescriptionRank(description = '') {
  const safe = String(description || '').trim().toLowerCase();
  if (safe === 'pending inputs' || safe.includes('pending input')) {
    return 100;
  }
  if (safe.includes('insufficient data') || safe.includes('insufficient persisted')) {
    return 75;
  }
  if (safe.startsWith('missing')) {
    return 40;
  }
  return 85;
}

function mergeExecutiveBlocker(existing, candidate) {
  const keepCandidate =
    blockerDescriptionRank(candidate.description) > blockerDescriptionRank(existing.description);
  const merged = {
    branch: existing.branch,
    moduleKey: existing.moduleKey,
    description: keepCandidate ? candidate.description : existing.description,
    effect:
      existing.effect === 'Blocks complete executive posture' ||
      candidate.effect === 'Blocks complete executive posture'
        ? 'Blocks complete executive posture'
        : keepCandidate
          ? candidate.effect
          : existing.effect,
    route: candidate.route || existing.route || ''
  };

  return humanizeExecutiveBlocker(merged);
}

const EXECUTIVE_BLOCKER_MODULE_PRIORITY = {
  funding: 100,
  governance: 90,
  risk: 85,
  compliance: 80,
  ma: 70,
  pmi: 65,
  reporting: 60,
  strategy: 55,
  bridge: 50,
  heritage: 45
};

function blockerActionabilityScore(blocker = {}) {
  let score = EXECUTIVE_BLOCKER_MODULE_PRIORITY[blocker.moduleKey] || 0;
  if (blocker.effect === 'Blocks complete executive posture') {
    score += 30;
  } else if (blocker.effect === 'Blocks board readiness signal') {
    score += 20;
  }
  score += blockerDescriptionRank(blocker.description) / 10;
  return score;
}

function sortExecutiveBlockers(blockers = []) {
  const orderIndex = new Map(EXECUTIVE_RADAR_BRANCH_ORDER.map((key, index) => [key, index]));
  return [...blockers].sort((left, right) => {
    const leftIndex = orderIndex.get(left.moduleKey) ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = orderIndex.get(right.moduleKey) ?? Number.MAX_SAFE_INTEGER;
    return leftIndex - rightIndex;
  });
}

export function prioritizeExecutiveBlockers(blockers = []) {
  const orderIndex = new Map(EXECUTIVE_RADAR_BRANCH_ORDER.map((key, index) => [key, index]));
  return [...blockers].sort((left, right) => {
    const scoreDelta = blockerActionabilityScore(right) - blockerActionabilityScore(left);
    if (scoreDelta !== 0) {
      return scoreDelta;
    }
    const leftIndex = orderIndex.get(left.moduleKey) ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = orderIndex.get(right.moduleKey) ?? Number.MAX_SAFE_INTEGER;
    return leftIndex - rightIndex;
  });
}

export function formatExecutiveBlockerSummaryLine(blocker = {}) {
  const humanized = humanizeExecutiveBlocker(blocker);
  return humanized.summaryLine;
}

export function buildExecutiveInputBlockers({ readiness = {}, moduleOverviews = {} } = {}) {
  const raw = [];

  const pushRawBlocker = ({ branch, moduleKey, description, effect, route }) => {
    raw.push({
      branch,
      moduleKey,
      description,
      effect,
      route: route || ''
    });
  };

  const missingData = Array.isArray(readiness.missingData) ? readiness.missingData : [];
  missingData.forEach((key) => {
    const branch = EXECUTIVE_RADAR_BRANCH_LABELS[key] || String(key);
    pushRawBlocker({
      branch,
      moduleKey: key,
      description: `Missing ${branch} executive score`,
      effect: 'Blocks board readiness signal',
      route: resolveExecutiveModuleRoute(key)
    });
  });

  const insufficientModules = Array.isArray(readiness.insufficientModules)
    ? readiness.insufficientModules
    : [];
  insufficientModules.forEach((key) => {
    const branch = EXECUTIVE_RADAR_BRANCH_LABELS[key] || String(key);
    pushRawBlocker({
      branch,
      moduleKey: key,
      description: 'Insufficient persisted module data',
      effect: 'Blocks board readiness signal',
      route: resolveExecutiveModuleRoute(key)
    });
  });

  Object.entries(moduleOverviews).forEach(([key, overview]) => {
    if (!overview) {
      return;
    }
    const posture = String(overview.posture || '').toLowerCase();
    const score = normalizeScoreOrNull(overview.score);
    if (posture !== 'insufficient_data' && score !== null) {
      return;
    }

    const branch = EXECUTIVE_RADAR_BRANCH_LABELS[key] || String(key);
    pushRawBlocker({
      branch,
      moduleKey: key,
      description: overview.scoreDisplay || 'Pending inputs',
      effect:
        posture === 'insufficient_data'
          ? 'Blocks complete executive posture'
          : 'Blocks board readiness signal',
      route: resolveExecutiveModuleRoute(key)
    });
  });

  const byModule = new Map();
  raw.forEach((blocker) => {
    const key = String(blocker.moduleKey || blocker.branch || '').trim().toLowerCase();
    if (!key) {
      return;
    }
    if (byModule.has(key)) {
      byModule.set(key, mergeExecutiveBlocker(byModule.get(key), blocker));
      return;
    }
    byModule.set(key, blocker);
  });

  return sortExecutiveBlockers(
    Array.from(byModule.values()).map((blocker) => humanizeExecutiveBlocker(blocker))
  );
}

export function summarizeExecutiveInputBlockers(blockers = [], { maxVisible = 4 } = {}) {
  const prioritized = prioritizeExecutiveBlockers(Array.isArray(blockers) ? blockers : []);
  const total = prioritized.length;
  const visible = prioritized.slice(0, maxVisible);
  return {
    blockers: visible,
    total,
    additionalCount: Math.max(0, total - visible.length)
  };
}

export function buildExecutiveBoardReadinessSummary({
  boardView = {},
  readiness = {},
  briefingDraftPrepared = false,
  boardPackGeneratedAt = null
} = {}) {
  const missingData = Array.isArray(readiness.missingData) ? readiness.missingData : [];
  const humanReviewRequired =
    readiness.humanReviewRequired !== false && boardView.humanReviewRequired !== false;
  const readinessScore = normalizeScoreOrNull(readiness.score ?? boardView.readinessScore);
  const hasPendingInputs =
    missingData.length > 0 ||
    readinessScore === null ||
    boardView.readinessStatus === 'insufficient_data' ||
    boardView.dataSource === 'insufficient_data';

  let statusLabel = 'Not ready for distribution';
  if (hasPendingInputs) {
    statusLabel = 'Pending inputs';
  } else if (humanReviewRequired) {
    statusLabel = 'Human review required';
  } else if (readinessScore !== null) {
    statusLabel = 'Signals available — review required';
  }

  const reportingSignalAvailable =
    boardView.reportingReadiness !== null &&
    boardView.reportingReadiness !== undefined &&
    boardView.reportingReadiness !== 'Insufficient data';

  const requiredBeforeDistribution = [];
  if (humanReviewRequired) {
    requiredBeforeDistribution.push('Human review');
  }
  if (missingData.length > 0) {
    requiredBeforeDistribution.push(
      `${missingData.length} module score${missingData.length === 1 ? '' : 's'} pending`
    );
  }
  if (!briefingDraftPrepared) {
    requiredBeforeDistribution.push('Board review draft not yet prepared');
  }
  if (reportingSignalAvailable) {
    requiredBeforeDistribution.push('Reporting signal available');
  }

  const bullets = [
    {
      label: 'Board review draft',
      value: briefingDraftPrepared ? 'Draft prepared' : 'Not yet prepared'
    },
    {
      label: 'Missing evidence',
      value:
        missingData.length > 0
          ? `${missingData.length} module score(s) pending`
          : 'No missing score keys reported'
    },
    {
      label: 'Governance critical decisions',
      value:
        Number.isFinite(Number(boardView.governanceBottlenecks)) &&
        Number(boardView.governanceBottlenecks) > 0
          ? `${boardView.governanceBottlenecks} pending`
          : 'None flagged in board snapshot'
    },
    {
      label: 'Human review',
      value: humanReviewRequired ? 'Required before distribution' : 'Review posture unavailable'
    },
    {
      label: 'Data room readiness',
      value:
        boardView.reportingReadiness !== null &&
        boardView.reportingReadiness !== undefined &&
        boardView.reportingReadiness !== 'Insufficient data'
          ? 'Reporting signal available'
          : 'Pending inputs'
    }
  ];

  if (boardPackGeneratedAt) {
    bullets.push({
      label: 'Board pack generated',
      value: String(boardPackGeneratedAt)
    });
  }

  const compactSummaryLines =
    requiredBeforeDistribution.length > 0
      ? requiredBeforeDistribution.slice(0, 4)
      : [statusLabel];

  const boardDistributionLabel =
    hasPendingInputs || humanReviewRequired ? 'Not ready' : 'Review required before distribution';

  return {
    statusLabel,
    boardDistributionLabel,
    humanReviewRequired,
    hasPendingInputs,
    requiredBeforeDistribution: requiredBeforeDistribution.slice(0, 5),
    bullets: bullets.slice(0, 5),
    compactSummaryLines,
    fallbackCopy:
      hasPendingInputs && humanReviewRequired
        ? 'Not ready for distribution · Pending inputs · Human review required'
        : hasPendingInputs
          ? 'Not ready for distribution · Pending inputs'
          : humanReviewRequired
            ? 'Not ready for distribution · Human review required'
            : statusLabel
  };
}

export function buildExecutiveConclusion({
  readiness = {},
  blockerCount = 0,
  hasLivePriorities = false
} = {}) {
  const missingData = Array.isArray(readiness.missingData) ? readiness.missingData : [];
  const hasPendingInputs =
    missingData.length > 0 || normalizeScoreOrNull(readiness.score) === null;
  const humanReview = readiness.humanReviewRequired !== false;
  const lines = [];

  if (hasLivePriorities || blockerCount > 0) {
    lines.push('Priority reviews required.');
  }
  if (missingData.length > 0 || normalizeScoreOrNull(readiness.score) === null) {
    lines.push('Missing inputs remain.');
  }
  if (humanReview) {
    lines.push('Human review required before board distribution.');
  }

  const headline =
    hasPendingInputs || blockerCount > 0
      ? 'Operational with priority reviews.'
      : 'Operational posture under executive review.';

  return {
    headline,
    subline:
      lines.length > 0
        ? lines.join(' ')
        : 'Signals available for review — decision support only.'
  };
}

const INFORMATIONAL_PRIORITY_ROWS = [
  { label: 'Decision quality', value: 'Active · not a scored signal', isInformational: true },
  {
    label: 'Workspace consistency',
    value: 'Under review · not a scored signal',
    isInformational: true
  },
  {
    label: 'Executive narrative',
    value: 'Active · not a scored signal',
    isInformational: true
  },
  {
    label: 'Board review drafts',
    value: 'In progress · not a scored signal',
    isInformational: true
  }
];

function summarizeExecutiveAttentionValue({ moduleKey, title, recommendedAction } = {}) {
  const action = String(recommendedAction || '').trim();
  if (action) {
    return action;
  }

  const safeTitle = String(title || '').trim();
  if (moduleKey === 'compliance') {
    return 'Compliance posture requires executive review';
  }
  if (moduleKey === 'pmi') {
    return 'Integration value capture requires attention';
  }
  if (moduleKey === 'funding') {
    return 'Capital readiness requires executive review';
  }
  if (moduleKey === 'risk') {
    return 'Risk posture requires executive review';
  }
  if (moduleKey === 'governance') {
    return 'Governance decisions require executive review';
  }
  if (safeTitle && !/signal not available/i.test(safeTitle)) {
    return safeTitle;
  }

  return `${executiveModuleDisplayLabel(moduleKey)} requires executive attention`;
}

export function buildExecutivePriorityRows({
  decisionQueue = [],
  alerts = [],
  signals = [],
  pmiOverview = {},
  fundingOverview = {},
  complianceOverview = {},
  readiness = {}
} = {}) {
  const realRows = [];
  const usedModuleKeys = new Set();

  const addRow = (row) => {
    const moduleKey = row.moduleKey || normalizeExecutiveModuleKey(row.label);
    if (usedModuleKeys.has(moduleKey)) {
      return;
    }
    usedModuleKeys.add(moduleKey);
    realRows.push({ ...row, moduleKey, isInformational: false });
  };

  buildExecutiveLiveDecisionQueueItems(decisionQueue, { limit: 6 }).forEach((item) => {
    const moduleKey = normalizeExecutiveModuleKey(item.module);
    addRow({
      label: executiveModuleDisplayLabel(moduleKey, item.module),
      value: summarizeExecutiveAttentionValue({
        moduleKey,
        title: item.title,
        recommendedAction: item.recommendedAction
      }),
      severity: item.severity,
      moduleKey
    });
  });

  if (Array.isArray(pmiOverview.alerts) && pmiOverview.alerts.length > 0) {
    addRow({
      label: 'PMI',
      value: pmiOverview.alerts[0] || 'Integration value capture requires attention',
      moduleKey: 'pmi'
    });
  }

  if (fundingOverview.requiresExecutiveUpdate) {
    addRow({
      label: 'Funding',
      value: 'Executive review required before board circulation',
      moduleKey: 'funding'
    });
  }

  if (Number(complianceOverview.openAlerts) > 0) {
    addRow({
      label: 'Compliance',
      value: 'Compliance posture requires executive review',
      moduleKey: 'compliance'
    });
  }

  const missingData = Array.isArray(readiness.missingData) ? readiness.missingData : [];
  const hasExplicitPendingInputs =
    missingData.length > 0 ||
    (readiness.score !== undefined && normalizeScoreOrNull(readiness.score) === null);
  if (realRows.length < 3 && hasExplicitPendingInputs) {
    addRow({
      label: 'Board readiness',
      value: 'Pending inputs before distribution',
      moduleKey: 'board-readiness'
    });
  } else if (realRows.length < 3 && readiness.humanReviewRequired === true) {
    addRow({
      label: 'Board readiness',
      value: 'Human review required before distribution',
      moduleKey: 'board-readiness'
    });
  }

  if (realRows.length) {
    return realRows.slice(0, 3);
  }

  return INFORMATIONAL_PRIORITY_ROWS.slice(0, 4);
}
