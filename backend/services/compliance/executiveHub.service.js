import { listComplianceAuditRuns } from './auditRuns.service.js';
import {
  buildComplianceExecutiveSummary,
  listReports
} from './reports.service.js';

function normalizeText(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function assertOrganizationScope(organizationId) {
  if (!normalizeText(organizationId)) {
    const error = new Error(
      'Scope de organizacion no definido. No se puede operar sin organizationId.'
    );
    error.status = 403;
    error.code = 'INVALID_ORGANIZATION_SCOPE';
    throw error;
  }
}

function summarizeAudit(run) {
  if (!run?.id) return null;

  return {
    id: run.id,
    scope: run.scope,
    framework: run.framework,
    status: run.status,
    score: run.score,
    criticalFindings: run.criticalFindings,
    createdAt: run.createdAt,
    updatedAt: run.updatedAt,
    payload: run.payload || {}
  };
}

export async function getExecutiveComplianceHubBrief(scope = {}) {
  assertOrganizationScope(scope.organizationId);

  const audits = await listComplianceAuditRuns({
    organizationId: scope.organizationId
  });
  const auditSorted = [...(audits || [])].sort((a, b) => {
    return (
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  });

  const latestAudit = auditSorted[0] || null;
  const latestAuditSummary = summarizeAudit(latestAudit);

  const riskScore =
    typeof latestAudit?.score === 'number' && Number.isFinite(latestAudit.score)
      ? Math.max(0, Math.min(100, Math.round(latestAudit.score)))
      : null;

  const legalHealthScore =
    riskScore === null ? null : Math.max(0, Math.min(100, 100 - riskScore));

  const reports = await listReports({
    organizationId: scope.organizationId
  });

  const reportSorted = [...(reports || [])].sort((a, b) => {
    return (
      new Date(b.updatedAt || b.createdAt || 0).getTime() -
      new Date(a.updatedAt || a.createdAt || 0).getTime()
    );
  });

  const topReport = reportSorted[0] || null;
  let reportExecutive = null;

  if (topReport) {
    reportExecutive =
      topReport.executiveSummary && typeof topReport.executiveSummary === 'object'
        ? topReport.executiveSummary
        : buildComplianceExecutiveSummary(topReport);
  }

  return {
    version: 'compliance-executive-hub-v1',
    organizationId: scope.organizationId,
    generatedAt: new Date().toISOString(),
    latestAuditRun: latestAuditSummary,
    legalHealthScore,
    valuationDragSignals: {
      riskScore,
      criticalFindings: latestAuditSummary?.criticalFindings ?? null,
      requiresHumanReview:
        typeof riskScore === 'number' &&
        Number.isFinite(riskScore) &&
        riskScore >= 56,
      rationale:
        riskScore === null
          ? 'No enterprise audit baseline yet — run Compliance audit to populate legal drag signals.'
          : `Latest enterprise audit exposes legal risk score ${riskScore}/100 with ${latestAuditSummary?.criticalFindings ?? 0} critical checks pending validation.`
    },
    portfolioReportBrief: reportExecutive && {
      reportId: topReport.id,
      title: reportExecutive.title,
      headline: reportExecutive.headline,
      posture: reportExecutive.posture,
      overviewSignals: reportExecutive.overviewSignals || {},
      recommendationCount: reportExecutive.recommendationCount,
      version: reportExecutive.version
    }
  };
}

export default getExecutiveComplianceHubBrief;
