import { createHash } from 'node:crypto';

import { recordAuditLog } from '../audit/auditLog.service.js';
import { listAuditLogs } from '../audit/auditLog.service.js';
import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';

const snapshotStore = createSqliteEntityStore(
  'funding_snapshots',
  'funding_snapshot',
  {
    stage: 'seed',
    status: 'completed',
    readinessScore: 0,
    targetRaise: 0,
    runwayAfterRaiseMonths: 0,
    dilutionPct: 0,
    payload: {}
  }
);

const memoStore = createSqliteEntityStore(
  'funding_board_memos',
  'funding_board_memo',
  {
    status: 'generated',
    executiveSummary: {},
    payload: {}
  }
);

const DEFAULT_INPUTS = Object.freeze({
  companyName: 'Funding case',
  stage: 'seed',
  currentRevenue: 0,
  monthlyBurn: 0,
  currentCash: 0,
  targetRaise: 0,
  preMoneyValuation: 0,
  runwayMonthsTarget: 18,
  annualGrowthRate: 0,
  grossMargin: 0,
  teamSize: 1,
  dataRoomCompletion: 0,
  founderMarketFit: 0,
  investorInterest: 0,
  debtCapacity: 0,
  founderOwnership: 0,
  existingInvestorOwnership: 0,
  optionPool: 0,
  hiringPlan: 0
});

const DEFAULT_SETTINGS = Object.freeze({
  reportCurrency: 'EUR',
  scenarioMode: 'balanced'
});

function createError(message, status = 400, code = 'FUNDING_ENTERPRISE_ERROR') {
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

function clamp(value, min = 0, max = 100) {
  const number = normalizeNumber(value, min);

  if (number < min) return min;
  if (number > max) return max;

  return number;
}

function assertOrganizationScope(organizationId) {
  if (!normalizeText(organizationId)) {
    throw createError(
      'Scope de organizacion no definido. No se puede operar sin organizationId.',
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

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(',')}}`;
  }

  return JSON.stringify(value);
}

function buildDigest(value) {
  return createHash('sha256').update(stableStringify(value)).digest('hex');
}

function normalizeInputs(inputs = {}) {
  const next = {
    ...DEFAULT_INPUTS,
    ...(inputs || {})
  };

  return {
    companyName: normalizeText(next.companyName, DEFAULT_INPUTS.companyName),
    stage: normalizeText(next.stage, DEFAULT_INPUTS.stage).toLowerCase(),
    currentRevenue: Math.max(0, normalizeNumber(next.currentRevenue)),
    monthlyBurn: Math.max(0, normalizeNumber(next.monthlyBurn)),
    currentCash: Math.max(0, normalizeNumber(next.currentCash)),
    targetRaise: Math.max(0, normalizeNumber(next.targetRaise)),
    preMoneyValuation: Math.max(0, normalizeNumber(next.preMoneyValuation)),
    runwayMonthsTarget: clamp(next.runwayMonthsTarget, 6, 36),
    annualGrowthRate: clamp(next.annualGrowthRate, -20, 200),
    grossMargin: clamp(next.grossMargin, 0, 100),
    teamSize: Math.max(1, Math.round(normalizeNumber(next.teamSize, 1))),
    dataRoomCompletion: clamp(next.dataRoomCompletion, 0, 100),
    founderMarketFit: clamp(next.founderMarketFit, 0, 100),
    investorInterest: clamp(next.investorInterest, 0, 100),
    debtCapacity: Math.max(0, normalizeNumber(next.debtCapacity)),
    founderOwnership: clamp(next.founderOwnership, 0, 100),
    existingInvestorOwnership: clamp(next.existingInvestorOwnership, 0, 100),
    optionPool: clamp(next.optionPool, 0, 100),
    hiringPlan: Math.max(0, Math.round(normalizeNumber(next.hiringPlan)))
  };
}

function normalizeSettings(settings = {}) {
  const next = {
    ...DEFAULT_SETTINGS,
    ...(settings || {})
  };

  return {
    reportCurrency: normalizeText(next.reportCurrency, 'EUR').toUpperCase(),
    scenarioMode: ['conservative', 'balanced', 'aggressive'].includes(
      normalizeText(next.scenarioMode).toLowerCase()
    )
      ? normalizeText(next.scenarioMode).toLowerCase()
      : 'balanced'
  };
}

function getScenarioMultiplier(mode) {
  if (mode === 'conservative') return { raise: 0.9, valuation: 0.92, burn: 1.08 };
  if (mode === 'aggressive') return { raise: 1.15, valuation: 1.12, burn: 0.96 };
  return { raise: 1, valuation: 1, burn: 1 };
}

function buildUseOfFunds(stage, targetRaise) {
  const templates = {
    'pre-seed': { product: 45, goToMarket: 20, operations: 20, buffer: 15 },
    seed: { product: 35, goToMarket: 30, operations: 20, buffer: 15 },
    'series-a': { product: 25, goToMarket: 40, operations: 20, buffer: 15 },
    growth: { product: 18, goToMarket: 42, operations: 25, buffer: 15 }
  };
  const plan = templates[stage] || templates.seed;

  return Object.entries(plan).map(([key, pct]) => ({
    key,
    label:
      key === 'product'
        ? 'Product & technology'
        : key === 'goToMarket'
          ? 'Go-to-market'
          : key === 'operations'
            ? 'Operations'
            : 'Cash buffer',
    pct,
    amount: targetRaise * (pct / 100)
  }));
}

export function calculateFundingCore(inputs = {}) {
  const currentRunwayMonths =
    inputs.monthlyBurn > 0 ? inputs.currentCash / inputs.monthlyBurn : 999;
  const postMoneyValuation = inputs.preMoneyValuation + inputs.targetRaise;
  const dilutionPct =
    postMoneyValuation > 0 ? (inputs.targetRaise / postMoneyValuation) * 100 : 0;
  const runwayAfterRaiseMonths =
    inputs.monthlyBurn > 0
      ? (inputs.currentCash + inputs.targetRaise) / inputs.monthlyBurn
      : 999;
  const bufferVsTargetMonths = runwayAfterRaiseMonths - inputs.runwayMonthsTarget;

  return {
    currentRunwayMonths,
    postMoneyValuation,
    dilutionPct,
    runwayAfterRaiseMonths,
    bufferVsTargetMonths,
    useOfFunds: buildUseOfFunds(inputs.stage, inputs.targetRaise)
  };
}

export function calculateFundingReadinessScore({ inputs, core }) {
  const runwayComponent = clamp(
    (core.currentRunwayMonths / Math.max(inputs.runwayMonthsTarget, 1)) * 100,
    0,
    100
  );
  const growthComponent = clamp(inputs.annualGrowthRate, 0, 100);
  const debtComponent = clamp(
    (inputs.debtCapacity / Math.max(inputs.targetRaise, 1)) * 100,
    0,
    100
  );
  const dilutionPenalty = clamp(core.dilutionPct * 1.1, 0, 30);
  const raw =
    inputs.dataRoomCompletion * 0.28 +
    inputs.founderMarketFit * 0.2 +
    inputs.investorInterest * 0.18 +
    inputs.grossMargin * 0.12 +
    runwayComponent * 0.12 +
    growthComponent * 0.1 +
    debtComponent * 0.05;

  return Math.round(clamp(raw - dilutionPenalty, 22, 96));
}

function buildReadinessLevel(score) {
  if (score >= 78) return 'high';
  if (score >= 58) return 'medium';
  return 'low';
}

function buildReadinessChecklist({ inputs, core, readinessScore }) {
  return [
    {
      key: 'narrative',
      label: 'Funding narrative',
      status: inputs.founderMarketFit >= 70 ? 'passed' : 'warning',
      detail: 'Problem, timing, moat and use of funds must be board-ready.'
    },
    {
      key: 'data-room',
      label: 'Investor data room',
      status: inputs.dataRoomCompletion >= 70 ? 'passed' : 'warning',
      detail: `Current data room completion is ${Math.round(inputs.dataRoomCompletion)}%.`
    },
    {
      key: 'runway',
      label: 'Runway before market launch',
      status: core.currentRunwayMonths >= 6 ? 'passed' : 'failed',
      detail: `Current runway is ${core.currentRunwayMonths.toFixed(1)} months.`
    },
    {
      key: 'dilution',
      label: 'Dilution control',
      status:
        core.dilutionPct <= 20
          ? 'passed'
          : core.dilutionPct <= 28
            ? 'warning'
            : 'failed',
      detail: `Base dilution is ${core.dilutionPct.toFixed(1)}%.`
    },
    {
      key: 'market-signal',
      label: 'Investor market signal',
      status: inputs.investorInterest >= 55 ? 'passed' : 'warning',
      detail: 'Shortlist, warm intros and outreach process should be validated.'
    },
    {
      key: 'global-readiness',
      label: 'Global readiness',
      status: readinessScore >= 78 ? 'passed' : readinessScore >= 58 ? 'warning' : 'failed',
      detail: `Funding readiness score is ${readinessScore}/100.`
    }
  ];
}

function buildDataRoomChecklist(inputs) {
  const completion = inputs.dataRoomCompletion;

  return [
    {
      category: 'Corporate & legal',
      status: completion >= 45 ? 'ready' : 'missing',
      items: ['Cap table', 'Shareholder agreements', 'Corporate minutes']
    },
    {
      category: 'Finance',
      status: completion >= 55 ? 'ready' : 'missing',
      items: ['Monthly P&L', 'Cash flow', '24-month forecast']
    },
    {
      category: 'Product & GTM',
      status: completion >= 65 ? 'ready' : 'missing',
      items: ['Roadmap', 'Commercial KPIs', 'Pipeline metrics']
    },
    {
      category: 'People & operations',
      status: completion >= 75 ? 'ready' : 'missing',
      items: ['Org chart', 'Hiring plan', 'Operational dependencies']
    }
  ];
}

function buildScenarioRows(inputs, settings) {
  const multiplier = getScenarioMultiplier(settings.scenarioMode);
  const rows = [
    {
      name: 'Low',
      raise: inputs.targetRaise * 0.85,
      preMoney: inputs.preMoneyValuation * 0.9,
      burn: inputs.monthlyBurn * 1.05
    },
    {
      name: 'Base',
      raise: inputs.targetRaise * multiplier.raise,
      preMoney: inputs.preMoneyValuation * multiplier.valuation,
      burn: inputs.monthlyBurn * multiplier.burn
    },
    {
      name: 'High',
      raise: inputs.targetRaise * 1.15,
      preMoney: inputs.preMoneyValuation * 1.1,
      burn: inputs.monthlyBurn * 0.95
    }
  ];

  return rows.map((scenario) => {
    const postMoney = scenario.preMoney + scenario.raise;
    const dilution = postMoney > 0 ? (scenario.raise / postMoney) * 100 : 0;
    const runway =
      scenario.burn > 0 ? (inputs.currentCash + scenario.raise) / scenario.burn : 999;

    return {
      ...scenario,
      postMoney,
      dilution,
      runway
    };
  });
}

function buildRiskItems({ inputs, core, readinessScore }) {
  const items = [];

  if (inputs.dataRoomCompletion < 70) {
    items.push({
      severity: inputs.dataRoomCompletion < 45 ? 'high' : 'medium',
      title: 'Investor data room incomplete',
      detail: 'Document completeness may slow diligence and reduce investor confidence.'
    });
  }

  if (core.runwayAfterRaiseMonths < inputs.runwayMonthsTarget) {
    items.push({
      severity: 'high',
      title: 'Runway below target',
      detail: 'The proposed raise does not fully cover the target runway.'
    });
  }

  if (core.dilutionPct > 28) {
    items.push({
      severity: 'high',
      title: 'Dilution pressure',
      detail: 'Base dilution exceeds 28%, which may require valuation or round-size review.'
    });
  }

  if (inputs.investorInterest < 45) {
    items.push({
      severity: 'medium',
      title: 'Weak investor signal',
      detail: 'Market feedback should be validated before broad outreach.'
    });
  }

  if (readinessScore >= 78 && items.length === 0) {
    items.push({
      severity: 'low',
      title: 'Controlled funding posture',
      detail: 'Current funding profile is ready for controlled investor preparation.'
    });
  }

  return items;
}

function buildInvestorTargets({ inputs, readinessScore }) {
  const targets = [];

  if (['pre-seed', 'seed'].includes(inputs.stage)) {
    targets.push({
      type: 'Angel / Seed VC',
      fit: Math.min(94, readinessScore + 8),
      rationale: 'Relevant for early traction, founder-market fit and speed of close.'
    });
  }

  if (inputs.currentRevenue >= 1000000 && inputs.annualGrowthRate >= 40) {
    targets.push({
      type: 'Early Growth Fund',
      fit: Math.min(95, readinessScore + 4),
      rationale: 'Revenue and growth profile can support institutional growth diligence.'
    });
  }

  if (inputs.debtCapacity > 0) {
    targets.push({
      type: 'Venture Debt / Revenue Financing',
      fit: Math.min(88, readinessScore),
      rationale: 'Useful to reduce dilution if cash discipline and revenue visibility hold.'
    });
  }

  if (targets.length === 0) {
    targets.push({
      type: 'Strategic Angels',
      fit: readinessScore,
      rationale: 'Recommended as a validation path before larger institutional outreach.'
    });
  }

  return targets;
}

export function buildFundingExecutiveSummary({
  inputs,
  settings,
  core,
  readinessScore,
  readinessChecklist,
  riskItems
}) {
  const readinessLevel = buildReadinessLevel(readinessScore);
  const blockers = readinessChecklist.filter((item) => item.status === 'failed');
  const warnings = readinessChecklist.filter((item) => item.status === 'warning');
  const boardDecision =
    readinessScore >= 78 && blockers.length === 0
      ? 'prepare_investor_outreach'
      : readinessScore >= 58
        ? 'validate_before_broad_circulation'
        : 'hold_market_outreach';

  return {
    version: 'funding-executive-summary-v1',
    companyName: inputs.companyName,
    stage: inputs.stage,
    currency: settings.reportCurrency,
    readinessScore,
    readinessLevel,
    boardDecision,
    headline:
      boardDecision === 'prepare_investor_outreach'
        ? `${inputs.companyName} is ready for controlled investor preparation.`
        : boardDecision === 'validate_before_broad_circulation'
          ? `${inputs.companyName} has a qualified funding case requiring validation.`
          : `${inputs.companyName} should strengthen the funding case before outreach.`,
    metrics: {
      targetRaise: inputs.targetRaise,
      preMoneyValuation: inputs.preMoneyValuation,
      postMoneyValuation: core.postMoneyValuation,
      runwayAfterRaiseMonths: core.runwayAfterRaiseMonths,
      currentRunwayMonths: core.currentRunwayMonths,
      dilutionPct: core.dilutionPct,
      dataRoomCompletion: inputs.dataRoomCompletion,
      investorInterest: inputs.investorInterest
    },
    blockers: blockers.map((item) => item.key),
    warnings: warnings.map((item) => item.key),
    topRisks: riskItems.slice(0, 5),
    overviewSignals: {
      fundingReadinessScore: readinessScore,
      capitalHealthScore: Math.round(
        clamp(
          readinessScore * 0.46 +
            clamp((core.runwayAfterRaiseMonths / 24) * 100, 0, 100) * 0.32 +
            clamp(100 - Math.max(0, core.dilutionPct - 18) * 4, 0, 100) * 0.22,
          0,
          100
        )
      ),
      dataRoomCompletion: inputs.dataRoomCompletion,
      boardReady: boardDecision === 'prepare_investor_outreach'
    }
  };
}

export function evaluateFundingEnterpriseCase(payload = {}) {
  const inputs = normalizeInputs(payload.fundingInputs || payload.inputs || payload);
  const settings = normalizeSettings(payload.fundingSettings || payload.settings);
  const core = calculateFundingCore(inputs);
  const readinessScore = calculateFundingReadinessScore({
    inputs,
    core
  });
  const readinessChecklist = buildReadinessChecklist({
    inputs,
    core,
    readinessScore
  });
  const dataRoomChecklist = buildDataRoomChecklist(inputs);
  const scenarioRows = buildScenarioRows(inputs, settings);
  const riskItems = buildRiskItems({
    inputs,
    core,
    readinessScore
  });
  const investorTargets = buildInvestorTargets({
    inputs,
    readinessScore
  });
  const executiveSummary = buildFundingExecutiveSummary({
    inputs,
    settings,
    core,
    readinessScore,
    readinessChecklist,
    riskItems
  });

  return {
    inputs,
    settings,
    core,
    readinessScore,
    readinessLevel: buildReadinessLevel(readinessScore),
    readinessChecklist,
    dataRoomChecklist,
    scenarioRows,
    riskItems,
    investorTargets,
    executiveSummary
  };
}

export async function createFundingSnapshot(payload = {}) {
  assertOrganizationScope(payload.organizationId);
  assertUserScope(payload.userId);

  const organizationId = payload.organizationId;
  const userId = payload.userId;
  const evaluation = evaluateFundingEnterpriseCase(payload);
  const snapshot = await snapshotStore.create({
    organizationId,
    userId,
    companyName: evaluation.inputs.companyName,
    stage: evaluation.inputs.stage,
    status: 'completed',
    readinessScore: evaluation.readinessScore,
    targetRaise: evaluation.inputs.targetRaise,
    runwayAfterRaiseMonths: evaluation.core.runwayAfterRaiseMonths,
    dilutionPct: evaluation.core.dilutionPct,
    payload: {
      ...evaluation,
      createdBy: userId
    }
  });
  const memo = await memoStore.create({
    organizationId,
    userId,
    snapshotId: snapshot.id,
    title: `${evaluation.inputs.companyName} Funding Board Memo`,
    status: 'generated',
    executiveSummary: evaluation.executiveSummary,
    payload: {
      snapshotId: snapshot.id,
      thesis: [
        `Target raise: ${evaluation.inputs.targetRaise}`,
        `Runway after raise: ${evaluation.core.runwayAfterRaiseMonths.toFixed(1)} months`,
        `Dilution: ${evaluation.core.dilutionPct.toFixed(1)}%`,
        `Readiness score: ${evaluation.readinessScore}/100`
      ],
      readinessChecklist: evaluation.readinessChecklist,
      dataRoomChecklist: evaluation.dataRoomChecklist,
      scenarioRows: evaluation.scenarioRows,
      investorTargets: evaluation.investorTargets,
      riskItems: evaluation.riskItems
    }
  });

  await recordAuditLog({
    organizationId,
    userId,
    action: 'funding.snapshot.completed',
    entityType: 'funding',
    entityId: snapshot.id,
    metadata: {
      readinessScore: snapshot.readinessScore,
      targetRaise: snapshot.targetRaise,
      runwayAfterRaiseMonths: snapshot.runwayAfterRaiseMonths,
      dilutionPct: snapshot.dilutionPct,
      memoId: memo.id
    }
  });

  return {
    ...snapshot,
    memo
  };
}

export async function listFundingSnapshots(scope = {}) {
  assertOrganizationScope(scope.organizationId);

  return snapshotStore.listByOrganization(scope.organizationId);
}

export async function getFundingSnapshotById(id, scope = {}) {
  assertOrganizationScope(scope.organizationId);

  const snapshot = await snapshotStore.getByIdForOrganization(
    normalizeText(id),
    scope.organizationId
  );

  if (!snapshot) return null;

  const memos = await memoStore.listByOrganization(scope.organizationId);
  const memo = memos.find((item) => item.snapshotId === snapshot.id) || null;

  return {
    ...snapshot,
    memo
  };
}

export async function buildFundingLedgerExport(id, scope = {}) {
  assertOrganizationScope(scope.organizationId);

  const snapshot = await getFundingSnapshotById(id, {
    organizationId: scope.organizationId
  });

  if (!snapshot) return null;

  const auditTrail = await listAuditLogs({
    organizationId: scope.organizationId,
    entityType: 'funding',
    entityId: snapshot.id,
    limit: 100
  });
  const ledgerContent = {
    version: 'funding-ledger-v1',
    organizationId: scope.organizationId,
    snapshot: {
      id: snapshot.id,
      companyName: snapshot.companyName,
      stage: snapshot.stage,
      status: snapshot.status,
      readinessScore: snapshot.readinessScore,
      targetRaise: snapshot.targetRaise,
      runwayAfterRaiseMonths: snapshot.runwayAfterRaiseMonths,
      dilutionPct: snapshot.dilutionPct,
      payload: snapshot.payload || {},
      memo: snapshot.memo || null,
      createdAt: snapshot.createdAt,
      updatedAt: snapshot.updatedAt
    },
    auditTrail
  };
  const digestSha256 = buildDigest(ledgerContent);

  return {
    ...ledgerContent,
    generatedAt: new Date().toISOString(),
    digestIntegrityModel: 'CEO_OS_FUNDING_LEDGER_DIGEST_V1',
    digestSha256,
    integrityTag: `digest:${digestSha256}`,
    simulatedSignatureAlgorithm: 'SIMULATED_SHA256_LEDGER_V1',
    simulatedLedgerSignature: `simulated_hmac_stub:${digestSha256}`,
    signer: 'CEO OS Funding Ledger exporter',
    verificationHint:
      'Recalculate digestSha256 over version, organizationId, snapshot and auditTrail slices to verify manual edits.'
  };
}

export async function getFundingExecutiveHubBrief(scope = {}) {
  assertOrganizationScope(scope.organizationId);

  const snapshots = await listFundingSnapshots({
    organizationId: scope.organizationId
  });
  const sorted = [...snapshots].sort(
    (left, right) =>
      new Date(right.createdAt || 0).getTime() -
      new Date(left.createdAt || 0).getTime()
  );
  const latest = sorted[0] || null;

  if (!latest) {
    return {
      version: 'funding-executive-hub-v1',
      organizationId: scope.organizationId,
      generatedAt: new Date().toISOString(),
      latestSnapshot: null,
      fundingReadinessScore: null,
      capitalHealthScore: null,
      boardMemoBrief: null
    };
  }

  const detail = await getFundingSnapshotById(latest.id, {
    organizationId: scope.organizationId
  });
  const summary =
    detail?.memo?.executiveSummary ||
    detail?.payload?.executiveSummary ||
    {};

  return {
    version: 'funding-executive-hub-v1',
    organizationId: scope.organizationId,
    generatedAt: new Date().toISOString(),
    latestSnapshot: {
      id: latest.id,
      companyName: latest.companyName,
      stage: latest.stage,
      status: latest.status,
      readinessScore: latest.readinessScore,
      targetRaise: latest.targetRaise,
      runwayAfterRaiseMonths: latest.runwayAfterRaiseMonths,
      dilutionPct: latest.dilutionPct,
      createdAt: latest.createdAt,
      updatedAt: latest.updatedAt
    },
    fundingReadinessScore: Math.round(Number(latest.readinessScore || 0)),
    capitalHealthScore:
      summary?.overviewSignals?.capitalHealthScore ??
      Math.round(Number(latest.readinessScore || 0)),
    boardMemoBrief: detail?.memo && {
      memoId: detail.memo.id,
      title: detail.memo.title,
      headline: summary.headline || '',
      boardDecision: summary.boardDecision || '',
      overviewSignals: summary.overviewSignals || {},
      version: summary.version || 'funding-executive-summary-v1'
    }
  };
}

export default createFundingSnapshot;
