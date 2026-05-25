import { omitClientTenantFields } from '../../utils/tenantPayload.js';
import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';
import { recordAuditLog } from '../audit/auditLog.service.js';
import { clampScore } from './readinessIndex.service.js';

export const executiveSignalsStore = createSqliteEntityStore('executive_signals', 'exec_signal', {
  module: 'enterprise',
  severity: 'watch',
  title: 'Executive signal',
  recommendedAction: '',
  owner: 'Executive Office',
  dueDate: '',
  status: 'open',
  source: '',
  evidence: [],
  humanReviewRequired: 1,
  payload: {}
});

const SEVERITY_RANK = { blocked: 5, critical: 4, risk: 3, watch: 2, normal: 1, insufficient_data: 0 };

function text(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function bool(value) {
  return value === true || value === 1 || value === '1';
}

function metric(summary, paths = []) {
  for (const path of paths) {
    const value = path.split('.').reduce((current, key) => current?.[key], summary);
    if (value !== undefined && value !== null && Number.isFinite(Number(value))) return Number(value);
  }
  return null;
}

export function rankExecutiveSeverity(severity = 'watch') {
  return SEVERITY_RANK[text(severity).toLowerCase()] ?? 1;
}

export function normalizeExecutiveSignal(signal = {}) {
  return {
    id: signal.id || `${text(signal.module, 'enterprise').toLowerCase()}-${text(signal.title, 'signal').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    module: text(signal.module, 'Enterprise'),
    severity: text(signal.severity, 'watch'),
    title: text(signal.title, 'Executive signal'),
    recommendedAction: text(signal.recommendedAction, 'Human review required'),
    owner: text(signal.owner, 'Executive Office'),
    dueDate: text(signal.dueDate),
    status: text(signal.status, 'open'),
    source: text(signal.source, 'executive_command_center'),
    evidence: Array.isArray(signal.evidence) ? signal.evidence : [],
    humanReviewRequired: signal.humanReviewRequired !== false,
    priorityScore: clampScore((rankExecutiveSeverity(signal.severity) * 18) + (signal.confidence || 60) * 0.2)
  };
}

export function buildExecutiveSignals({ moduleSummaries = {}, readiness = {} } = {}) {
  const signals = [];
  Object.entries(moduleSummaries).forEach(([module, envelope]) => {
    if (envelope?.status !== 'available') {
      signals.push(normalizeExecutiveSignal({
        module,
        severity: 'insufficient_data',
        title: `${module.toUpperCase()} signal not available`,
        recommendedAction: 'Confirm enterprise summary availability before board circulation.',
        source: 'module_summary',
        evidence: [{ label: 'Signal not available', quality: 'not_available' }]
      }));
    }
  });

  const complianceScore = metric(moduleSummaries.compliance?.data, ['legalHealthScore', 'metrics.healthScore']);
  if (complianceScore !== null && complianceScore < 70) {
    signals.push(normalizeExecutiveSignal({
      module: 'Compliance',
      severity: complianceScore < 55 ? 'critical' : 'risk',
      title: 'Compliance posture requires executive review',
      recommendedAction: 'Review audit ledger and remediation posture before capital markets or board escalation.',
      source: 'compliance.summary',
      evidence: [{ label: `Compliance score ${Math.round(complianceScore)}`, quality: 'medium' }]
    }));
  }

  const runway = metric(moduleSummaries.funding?.data, ['projectedRunwayMonths', 'runwayMonths', 'summary.projectedRunwayMonths']);
  if (runway !== null && runway < 9) {
    signals.push(normalizeExecutiveSignal({
      module: 'Funding',
      severity: runway < 6 ? 'critical' : 'risk',
      title: 'Runway attention required',
      recommendedAction: 'Confirm funding window, burn assumptions and board memo readiness.',
      source: 'funding.summary',
      evidence: [{ label: `${Math.round(runway)} months runway`, quality: 'high' }]
    }));
  }

  const governanceCritical = metric(moduleSummaries.governance?.data, ['metrics.pendingCriticalDecisions']);
  if (governanceCritical && governanceCritical > 0) {
    signals.push(normalizeExecutiveSignal({
      module: 'Governance',
      severity: 'blocked',
      title: 'Critical governance decisions pending',
      recommendedAction: 'Prioritize board-required approvals and unblock downstream workflows.',
      source: 'governance.summary',
      evidence: [{ label: `${governanceCritical} critical decisions`, quality: 'high' }]
    }));
  }

  const pmiDelayed = metric(moduleSummaries.pmi?.data, ['metrics.delayedMilestones', 'delayedMilestones']);
  const synergyRatio = metric(moduleSummaries.pmi?.data, ['metrics.synergyCaptureRatio', 'synergyCaptureRatio']);
  if ((pmiDelayed && pmiDelayed > 0) || (synergyRatio !== null && synergyRatio < 60)) {
    signals.push(normalizeExecutiveSignal({
      module: 'PMI',
      severity: pmiDelayed > 2 || synergyRatio < 40 ? 'critical' : 'risk',
      title: 'Integration value capture requires attention',
      recommendedAction: 'Review synergy blockers, Day 100 plan and integration committee actions.',
      source: 'pmi.summary',
      evidence: [{ label: `Synergy capture ${Math.round(synergyRatio ?? 0)}%`, quality: 'medium' }]
    }));
  }

  const criticalRiskCount = metric(moduleSummaries.risk?.data, ['metrics.criticalRiskCount', 'criticalRiskCount']);
  if (criticalRiskCount && criticalRiskCount > 0) {
    signals.push(normalizeExecutiveSignal({
      module: 'Risk',
      severity: 'critical',
      title: 'Critical enterprise risks open',
      recommendedAction: 'Confirm mitigation ownership and risk committee escalation path.',
      source: 'risk.summary',
      evidence: [{ label: `${criticalRiskCount} critical risks`, quality: 'high' }]
    }));
  }

  const missingEvidence = metric(moduleSummaries.reporting?.data, ['metrics.missingEvidenceCount', 'missingEvidenceCount']);
  if (missingEvidence && missingEvidence > 0) {
    signals.push(normalizeExecutiveSignal({
      module: 'Reporting',
      severity: missingEvidence > 3 ? 'risk' : 'watch',
      title: 'Board reporting evidence gap',
      recommendedAction: 'Complete evidence links before report export.',
      source: 'reporting.summary',
      evidence: [{ label: `${missingEvidence} missing evidence items`, quality: 'medium' }]
    }));
  }

  const blockedStrategy = metric(moduleSummaries.strategy?.data, ['metrics.blockedStrategicInitiatives', 'blockedStrategicInitiatives']);
  if (blockedStrategy && blockedStrategy > 0) {
    signals.push(normalizeExecutiveSignal({
      module: 'Strategy',
      severity: 'risk',
      title: 'Strategic initiatives blocked',
      recommendedAction: 'Resolve capital, governance or risk dependencies tied to strategic execution.',
      source: 'strategy.summary',
      evidence: [{ label: `${blockedStrategy} blocked initiatives`, quality: 'medium' }]
    }));
  }

  if ((readiness?.missingData || []).length > 0) {
    signals.push(normalizeExecutiveSignal({
      module: 'Executive',
      severity: 'insufficient_data',
      title: 'Executive readiness has missing module data',
      recommendedAction: 'Validate missing enterprise summaries before external board circulation.',
      source: 'readiness.index',
      evidence: readiness.missingData.map((item) => ({ label: item, quality: 'not_available' }))
    }));
  }

  return signals.sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 20);
}

export async function listExecutiveSignals(organizationId) {
  return executiveSignalsStore.listByOrganization(organizationId);
}

export async function createExecutiveSignal(organizationId, payload = {}, actor = {}) {
  const item = await executiveSignalsStore.create({
    ...omitClientTenantFields(payload),
    organizationId,
    userId: actor.userId || '',
    createdBy: actor.userId || ''
  });
  await recordAuditLog({
    organizationId,
    userId: actor.userId || '',
    action: 'executive.signal.created',
    entityType: 'executive',
    entityId: item.id,
    metadata: { title: item.title, module: item.module }
  });
  return item;
}

export async function updateExecutiveSignal(organizationId, id, payload = {}, actor = {}) {
  const item = await executiveSignalsStore.updateForOrganization(
    id,
    omitClientTenantFields(payload),
    organizationId
  );
  if (item) {
    await recordAuditLog({
      organizationId,
      userId: actor.userId || '',
      action: bool(payload.resolved) || item.status === 'resolved' ? 'executive.signal.resolved' : 'executive.signal.updated',
      entityType: 'executive',
      entityId: item.id,
      metadata: { status: item.status }
    });
  }
  return item;
}

export default {
  buildExecutiveSignals,
  createExecutiveSignal,
  listExecutiveSignals,
  rankExecutiveSeverity,
  updateExecutiveSignal
};
