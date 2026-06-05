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
