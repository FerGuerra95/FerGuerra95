import { listMaCases } from '../ma/cases.service.js';
import { getExecutiveComplianceHubBrief } from '../compliance/executiveHub.service.js';
import { getFundingExecutiveHubBrief } from '../funding/enterprise.service.js';
import { getFundingSummary } from '../funding/funding.service.js';
import { getPmiExecutiveHubBrief } from '../pmi/pmi.service.js';
import { getEcosystemExecutiveHubBrief } from '../ecosystem/ecosystem.service.js';

function createError(message, status = 400, code = 'BOARD_PACK_ERROR') {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function normalizeText(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(toNumber(value))));
}

/** Preserve null/N/A capture rates — do not coerce null to 0% (C.13.7G / C.13.8B). */
function preserveNullablePercent(value) {
  if (value === null || value === undefined) {
    return null;
  }

  return clamp(value);
}

function aggregateBranchScore(branches = {}) {
  const values = Object.values(branches)
    .map((branch) => branch?.score)
    .filter((value) => value !== null && value !== undefined && Number.isFinite(Number(value)))
    .map((value) => clamp(value));

  return values.length ? clamp(values.reduce((sum, value) => sum + value, 0) / values.length) : null;
}

export function buildBoardPackScoringTruthfulness() {
  return {
    certifiedRating: false,
    humanReviewRequired: true,
    decisionSupportOnly: true,
    note: 'Board pack aggregates operational DSS module signals — not Golden benchmarks or certified ratings.',
    moduleLayers: {
      pmi: {
        goldenBenchmark: 'pmiCaptureRateGolden',
        operationalMetrics: [
          'operationalPmiCaseCapture',
          'operationalPmiLedgerCapture',
          'operationalPmiEnterpriseCapture',
          'operationalPmiReadinessScore'
        ],
        preservesNullCapture: true,
        zeroDenominatorOperational: 'null when target/forecast <= 0'
      },
      risk: {
        goldenBenchmark: 'riskLikelihoodImpactGolden',
        operationalMetrics: ['operationalEnterpriseRiskScore']
      },
      compliance: {
        operationalScore: 'legalHealthScore',
        nullMeansInsufficientData: true
      },
      governance: {
        operationalMetrics: ['governanceReadinessScore', 'boardReadinessScore'],
        sourceModule: 'governance',
        governanceBoardPacksTable: 'governance_board_packs',
        reportingBoardPackRole: 'cross_module_aggregator_not_governance_workflow_sot',
        certifiedRating: false,
        humanReviewRequired: true
      }
    }
  };
}

function assertOrganizationId(organizationId) {
  if (!normalizeText(organizationId)) {
    throw createError('Scope de organizacion no definido.', 403, 'INVALID_ORGANIZATION_SCOPE');
  }
}

function sortByUpdated(items = []) {
  return [...items].sort(
    (left, right) =>
      new Date(right.updatedAt || right.createdAt || 0).getTime() -
      new Date(left.updatedAt || left.createdAt || 0).getTime()
  );
}

function pickLatestMaSnapshot(cases = []) {
  const snapshots = cases.flatMap((item) => {
    const nested = Array.isArray(item.snapshots) ? item.snapshots : [];
    return [
      ...(item.snapshot ? [{ ...item.snapshot, caseName: item.name }] : []),
      ...nested.map((snapshot) => ({ ...snapshot, caseName: item.name }))
    ];
  });

  return sortByUpdated(snapshots)[0] || null;
}

function resolveMaValuation(cases = []) {
  const latestCase = sortByUpdated(cases)[0] || null;
  const latestSnapshot = pickLatestMaSnapshot(cases);
  const source = latestSnapshot || latestCase?.snapshot || latestCase?.financials || {};
  const ebitda = toNumber(
    source.normalizedEbitda ??
      source.adjustedEbitda ??
      source.currentEbitda ??
      latestCase?.financials?.normalizedEbitda ??
      latestCase?.financials?.ebitda
  );
  const multiple = toNumber(source.adjustedMultiple ?? source.multiple ?? source.baseMultiple);
  const enterpriseValue = toNumber(
    source.enterpriseValue ??
      source.impliedEnterpriseValue ??
      (ebitda > 0 && multiple > 0 ? ebitda * multiple : 0)
  );
  const equityValue = toNumber(
    source.equityValue ??
      source.impliedEquityValue ??
      enterpriseValue - toNumber(latestCase?.financials?.netDebt)
  );

  return {
    score: clamp(enterpriseValue > 0 ? 72 : 48),
    latestCaseId: latestCase?.id || null,
    targetName: latestCase?.name || latestSnapshot?.caseName || 'No active M&A case',
    valuation: enterpriseValue,
    equityValue,
    appliedMultiple: multiple,
    multipleLabel: multiple > 0 ? `${multiple.toFixed(1)}x` : 'N/A',
    valuationSource: latestSnapshot ? 'ma_snapshot' : latestCase ? 'ma_case_financials' : 'not_available',
    casesCount: cases.length
  };
}

function resolveCompliance(brief = {}) {
  const latestAudit = brief.latestAuditRun || null;
  const hasHealthScore = brief.legalHealthScore !== null && brief.legalHealthScore !== undefined;
  const healthScore = hasHealthScore ? clamp(brief.legalHealthScore) : null;
  const criticalFindings = toNumber(
    brief.valuationDragSignals?.criticalFindings ?? latestAudit?.criticalFindings
  );

  return {
    score: healthScore,
    healthScore,
    insufficientData: !hasHealthScore,
    dataSource: hasHealthScore ? 'compliance_hub' : 'insufficient_data',
    humanReviewRequired: true,
    auditLedgerStatus: latestAudit?.status || 'not_started',
    latestAuditId: latestAudit?.id || null,
    criticalFindings,
    riskStatus: !hasHealthScore
      ? 'insufficient_data'
      : criticalFindings > 0 || healthScore < 70
        ? 'attention_required'
        : 'controlled',
    rationale: brief.valuationDragSignals?.rationale || 'No compliance audit baseline available.'
  };
}

function resolveFunding(hub = {}, summary = {}) {
  const latestSnapshot = hub.latestSnapshot || null;
  const runway = toNumber(
    summary.projectedRunwayMonths ?? latestSnapshot?.runwayAfterRaiseMonths
  );
  const capitalRaised = toNumber(
    summary.totalAmountRaised ?? summary.totalRaised ?? latestSnapshot?.targetRaise
  );
  const capTableStatus =
    summary.estimatedDilution !== null && summary.estimatedDilution !== undefined
      ? `${toNumber(summary.estimatedDilution).toFixed(1)}% dilution`
      : latestSnapshot?.dilutionPct !== undefined
        ? `${toNumber(latestSnapshot.dilutionPct).toFixed(1)}% dilution`
        : 'not_available';
  const score = clamp(
    hub.capitalHealthScore ??
      summary.capitalEfficiencyScore ??
      (runway > 0 ? Math.min(100, (runway / 24) * 100) : 50)
  );

  return {
    score,
    runwayMonths: runway,
    capitalRaised,
    capTableStatus,
    fundingRiskStatus: summary.fundingRiskStatus || 'normal',
    readinessScore: hub.fundingReadinessScore ?? summary.capitalEfficiencyScore ?? null,
    latestRoundType: summary.latestRoundType || latestSnapshot?.stage || ''
  };
}

function resolvePmi(brief = {}) {
  const metrics = brief.metrics || {};
  const latestCase = brief.latestCase || null;
  const progress = clamp(
    toNumber(metrics.workstreamProgress) * 0.55 +
      toNumber(metrics.milestoneProgress) * 0.45
  );
  const synergyCaptureRate = preserveNullablePercent(metrics.synergyCaptureRate);
  const ledgerCaptureRate = preserveNullablePercent(metrics.ledgerCaptureRate);

  return {
    score: brief.score === null || brief.score === undefined ? progress : clamp(brief.score),
    integrationProgress: progress,
    synergyCaptured: toNumber(latestCase?.synergyCaptured),
    synergyTarget: toNumber(latestCase?.synergyTarget),
    synergyCaptureRate,
    ledgerCaptureRate,
    notCalculable:
      synergyCaptureRate === null ||
      (metrics.ledgerForecast > 0 ? false : ledgerCaptureRate === null && toNumber(metrics.ledgerForecast) === 0),
    dataSource: brief.dataSource || 'operational_pmi_hub',
    humanReviewRequired: brief.humanReviewRequired !== false,
    executiveSignalEligible: brief.executiveSignalEligible !== false,
    ledgerForecast: toNumber(metrics.ledgerForecast),
    ledgerCaptured: toNumber(metrics.ledgerCaptured),
    playbookProgress: clamp(metrics.playbookProgress),
    blockedDependenciesCount: toNumber(metrics.blockedDependenciesCount),
    dependencyRiskScore: clamp(metrics.dependencyRiskScore ?? 100),
    highRiskCount: toNumber(metrics.highRiskCount),
    openRiskCount: toNumber(metrics.openRiskCount),
    latestCaseName: latestCase?.dealName || 'No PMI case'
  };
}

function resolveBridge(brief = {}) {
  const branch = (brief.branches || []).find((item) => item.branch === 'bridge') || {};
  const metrics = branch.metrics || {};

  return {
    score: clamp(branch.score ?? metrics.readinessScore ?? 0),
    title: branch.title || 'Bridge internal pipeline',
    pipelineValue: toNumber(metrics.totalOpportunityValue),
    weightedPipelineValue: toNumber(metrics.weightedPipelineValue),
    introductionsCount: toNumber(metrics.introductionsCount),
    qualifiedOpportunitiesCount: toNumber(metrics.qualifiedOpportunitiesCount),
    counterpartiesCount: toNumber(metrics.counterpartiesCount),
    activeMandatesCount: toNumber(metrics.activeMandatesCount),
    confidentialityExceptionsCount: toNumber(metrics.confidentialityExceptionsCount),
    conversionRate: clamp(metrics.conversionRate),
    documentsCount: toNumber(metrics.documentsCount),
    reportsCount: toNumber(metrics.reportsCount),
    pendingNdaDocumentsCount: toNumber(metrics.pendingNdaDocumentsCount)
  };
}

function resolveGovernance(brief = {}) {
  const branch = (brief.branches || []).find((item) => item.branch === 'governance') || {};
  const metrics = branch.metrics || {};

  return {
    score: clamp(branch.score ?? metrics.score ?? 0),
    title: branch.title || 'Governance control foundation',
    decisionsCount: toNumber(metrics.decisionsCount),
    openDecisionsCount: toNumber(metrics.openDecisionsCount),
    decisionClosureRate: clamp(metrics.decisionClosureRate),
    controlsCount: toNumber(metrics.controlsCount),
    weakControlsCount: toNumber(metrics.weakControlsCount),
    controlEffectiveness: clamp(metrics.controlEffectiveness),
    esgReadiness: clamp(metrics.esgReadiness),
    evidenceReadiness: clamp(metrics.evidenceReadiness),
    boardApprovalQueueCount: toNumber(metrics.boardApprovalQueueCount),
    governanceReadinessScore: clamp(metrics.governanceReadinessScore),
    boardReadinessScore: clamp(metrics.boardReadinessScore),
    pendingCriticalDecisions: toNumber(metrics.pendingCriticalDecisions),
    overdueBoardActions: toNumber(metrics.overdueBoardActions),
    policyReviewRisk: toNumber(metrics.policyReviewRisk),
    committeeReadiness: clamp(metrics.committeeReadiness),
    decisionVelocity: clamp(metrics.decisionVelocity),
    approvalBottlenecks: toNumber(metrics.approvalBottlenecks),
    requiresExecutiveAttention: Boolean(metrics.requiresExecutiveAttention),
    governanceStatus: metrics.governanceStatus || 'insufficient_data'
  };
}

function resolveHeritage(brief = {}) {
  const branch = (brief.branches || []).find((item) => item.branch === 'heritage') || {};
  const metrics = branch.metrics || {};

  return {
    score: clamp(branch.score ?? metrics.score ?? 0),
    title: branch.title || 'Legacy infrastructure foundation',
    assetsCount: toNumber(metrics.assetsCount),
    totalAssetValue: toNumber(metrics.totalAssetValue),
    protectedAssetsCount: toNumber(metrics.protectedAssetsCount),
    liquidityRiskCount: toNumber(metrics.liquidityRiskCount),
    successionsCount: toNumber(metrics.successionsCount),
    openSuccessionItemsCount: toNumber(metrics.openSuccessionItemsCount),
    successionReadiness: clamp(metrics.successionReadiness),
    evidenceReadiness: clamp(metrics.evidenceReadiness),
    protectionsCount: toNumber(metrics.protectionsCount),
    weakProtectionsCount: toNumber(metrics.weakProtectionsCount),
    protectionCoverage: clamp(metrics.protectionCoverage),
    continuityScore: clamp(metrics.continuityScore),
    documentsCount: toNumber(metrics.documentsCount),
    reportsCount: toNumber(metrics.reportsCount),
    pendingEvidenceDocumentsCount: toNumber(metrics.pendingEvidenceDocumentsCount)
  };
}

export function generateExecutiveSummary({ ma, compliance, funding, pmi, bridge, governance, heritage } = {}) {
  const strengths = [];
  const concerns = [];

  if (funding?.runwayMonths >= 18 || funding?.score >= 75) {
    strengths.push('salud financiera solida');
  } else if (funding?.runwayMonths > 0 && funding.runwayMonths < 12) {
    concerns.push('runway inferior a 12 meses');
  }

  if (ma?.valuation > 0 && ma?.appliedMultiple > 0) {
    strengths.push('valoracion M&A soportada por multiplos operativos');
  }

  if (compliance?.criticalFindings > 0 || (compliance?.healthScore !== null && compliance?.healthScore < 70)) {
    concerns.push('controles de Compliance y Audit Ledger pendientes de refuerzo');
  }

  if (
    pmi?.synergyCaptureRate !== null &&
    pmi?.synergyCaptureRate !== undefined &&
    pmi?.synergyCaptureRate >= 60 &&
    pmi?.ledgerCaptureRate !== null &&
    pmi?.ledgerCaptureRate !== undefined &&
    pmi?.ledgerCaptureRate >= 50 &&
    pmi?.playbookProgress >= 65
  ) {
    strengths.push('PMI con captura de sinergias y playbooks en avance');
  } else if (
    pmi?.openRiskCount > 0 ||
    pmi?.integrationProgress < 50 ||
    pmi?.blockedDependenciesCount > 0
  ) {
    concerns.push('riesgos abiertos de integracion post-cierre');
  }

  if (bridge?.weightedPipelineValue > 0 && bridge?.qualifiedOpportunitiesCount > 0) {
    strengths.push('Bridge con pipeline transaccional cualificado');
  }

  if (bridge?.confidentialityExceptionsCount > 0) {
    concerns.push('excepciones de confidencialidad en Bridge');
  }

  if (governance?.controlEffectiveness >= 75 && governance?.evidenceReadiness >= 65) {
    strengths.push('gobernanza con controles y evidencia trazables');
  }

  if (governance?.weakControlsCount > 0 || governance?.openDecisionsCount > 3) {
    concerns.push('controles o decisiones de Governance pendientes');
  }

  if (heritage?.totalAssetValue > 0 && heritage?.successionReadiness >= 65 && heritage?.protectionCoverage >= 65) {
    strengths.push('Heritage con continuidad patrimonial trazable');
  }

  if (heritage?.weakProtectionsCount > 0 || heritage?.openSuccessionItemsCount > 0 || heritage?.liquidityRiskCount > 0) {
    concerns.push('riesgos de continuidad patrimonial o sucesion en Heritage');
  }

  if (strengths.length === 0 && concerns.length === 0) {
    return 'La organizacion mantiene una posicion operativa en construccion. El Board Pack recomienda completar las lineas base de M&A, Compliance, Funding y PMI antes de elevar decisiones materiales.';
  }

  if (concerns.length === 0) {
    return `La organizacion presenta ${strengths.join(', ')}. El perfil consolidado es favorable para comite, sujeto a validacion humana de supuestos financieros y legales.`;
  }

  if (strengths.length === 0) {
    return `El estado consolidado requiere atencion ejecutiva en ${concerns.join(', ')}. Se recomienda revisar owners, plazos y evidencia antes de decisiones de capital o transaccion.`;
  }

  return `La organizacion muestra ${strengths.join(', ')}, pero requiere atencion en ${concerns.join(', ')}. La recomendacion es avanzar con disciplina de seguimiento y elevar excepciones al board.`;
}

export async function generateBoardPack(scope = {}) {
  assertOrganizationId(scope.organizationId);

  const [maCases, complianceBrief, fundingHub, fundingSummary, pmiBrief, ecosystemBrief] =
    await Promise.all([
      listMaCases({ organizationId: scope.organizationId }),
      getExecutiveComplianceHubBrief({ organizationId: scope.organizationId }),
      getFundingExecutiveHubBrief({ organizationId: scope.organizationId }),
      getFundingSummary(scope.organizationId, { userId: scope.userId }),
      getPmiExecutiveHubBrief({ organizationId: scope.organizationId }),
      getEcosystemExecutiveHubBrief({ organizationId: scope.organizationId })
    ]);

  const branches = {
    ma: resolveMaValuation(maCases),
    compliance: resolveCompliance(complianceBrief),
    funding: resolveFunding(fundingHub, fundingSummary),
    pmi: resolvePmi(pmiBrief),
    bridge: resolveBridge(ecosystemBrief),
    governance: resolveGovernance(ecosystemBrief),
    heritage: resolveHeritage(ecosystemBrief)
  };
  const score = aggregateBranchScore(branches);
  const scoringTruthfulness = buildBoardPackScoringTruthfulness();

  return {
    version: 'board-pack-v1',
    organizationId: scope.organizationId,
    generatedAt: new Date().toISOString(),
    generatedBy: scope.userId || null,
    title: 'Executive Board Pack',
    score,
    humanReviewRequired: true,
    decisionSupportOnly: true,
    dataSource: 'operational_module_aggregation',
    scoringTruthfulness,
    dssNotice:
      'Decision-support board pack draft only. Human review required. Not a certified rating or board-approved final report.',
    executiveSummary: generateExecutiveSummary(branches),
    branches,
    recommendations: [
      branches.compliance.criticalFindings > 0
        ? 'Prioritize remediation of critical compliance findings before external circulation.'
        : 'Maintain Compliance audit cadence and ledger integrity.',
      branches.funding.runwayMonths > 0 && branches.funding.runwayMonths < 12
        ? 'Review capital plan and runway extension options within the next board cycle.'
        : 'Keep funding narrative aligned with valuation and cap table discipline.',
      branches.pmi.blockedDependenciesCount > 0
        ? 'Escalate blocked PMI dependencies with named owners and board-level due dates.'
        : branches.pmi.openRiskCount > 0
          ? 'Escalate open PMI risks with named owners and board-level due dates.'
          : 'Continue tracking synergy capture, playbooks and dependency closure against the integration plan.',
      branches.bridge.confidentialityExceptionsCount > 0
        ? 'Resolve Bridge NDA, redaction and board approval exceptions before external circulation.'
        : 'Use Bridge matching and introduction ledger to advance qualified counterparties.',
      branches.governance.weakControlsCount > 0
        ? 'Review weak Governance controls and assign remediation owners before the next board cycle.'
        : 'Maintain Governance decision ledger, ESG evidence and board approval cadence.',
      branches.heritage.weakProtectionsCount > 0 || branches.heritage.openSuccessionItemsCount > 0
        ? 'Formalize Heritage protections, succession owners and evidence before strategic ownership events.'
        : 'Maintain Heritage asset map, protection cadence and succession evidence for owner continuity.'
    ]
  };
}

export default {
  generateBoardPack,
  generateExecutiveSummary,
  buildBoardPackScoringTruthfulness
};
