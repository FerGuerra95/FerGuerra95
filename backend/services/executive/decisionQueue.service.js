import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';
import { recordAuditLog } from '../audit/auditLog.service.js';
import { rankExecutiveSeverity } from './executiveSignals.service.js';
import { clampScore } from './readinessIndex.service.js';

export const decisionQueueStore = createSqliteEntityStore('executive_decision_queue', 'exec_decision', {
  title: 'Executive decision',
  module: 'enterprise',
  decisionType: 'critical_decision',
  severity: 'watch',
  owner: 'Executive Office',
  dueDate: '',
  status: 'open',
  priorityScore: 0,
  boardRequired: 0,
  recommendedAction: '',
  payload: {}
});

function metric(summary, paths = []) {
  for (const path of paths) {
    const value = path.split('.').reduce((current, key) => current?.[key], summary);
    if (value !== undefined && value !== null && Number.isFinite(Number(value))) return Number(value);
  }
  return null;
}

export function sortDecisionQueue(items = []) {
  return [...items].sort((a, b) => {
    const priorityDelta = Number(b.priorityScore || 0) - Number(a.priorityScore || 0);
    if (priorityDelta !== 0) return priorityDelta;
    return rankExecutiveSeverity(b.severity) - rankExecutiveSeverity(a.severity);
  });
}

function item(payload = {}) {
  return {
    id: payload.id,
    title: payload.title,
    module: payload.module || 'Executive',
    decisionType: payload.decisionType || 'critical_decision',
    severity: payload.severity || 'watch',
    owner: payload.owner || 'Executive Office',
    dueDate: payload.dueDate || '',
    status: payload.status || 'open',
    boardRequired: Boolean(payload.boardRequired),
    recommendedAction: payload.recommendedAction || 'Human review required',
    priorityScore: clampScore(payload.priorityScore ?? rankExecutiveSeverity(payload.severity) * 20)
  };
}

export function buildExecutiveDecisionQueue({ moduleSummaries = {}, signals = [] } = {}) {
  const queue = [];
  const governanceCritical = metric(moduleSummaries.governance?.data, ['metrics.pendingCriticalDecisions']);
  if (governanceCritical && governanceCritical > 0) {
    queue.push(item({
      id: 'governance-critical-decisions',
      title: 'Resolve critical governance decisions',
      module: 'Governance',
      decisionType: 'board_required_decision',
      severity: 'blocked',
      boardRequired: true,
      priorityScore: 96,
      recommendedAction: 'Schedule board or committee review for pending critical decisions.'
    }));
  }

  const runway = metric(moduleSummaries.funding?.data, ['projectedRunwayMonths', 'runwayMonths']);
  if (runway !== null && runway < 9) {
    queue.push(item({
      id: 'funding-window-decision',
      title: 'Confirm funding window decision',
      module: 'Funding',
      decisionType: 'funding_window_decision',
      severity: runway < 6 ? 'critical' : 'risk',
      priorityScore: runway < 6 ? 90 : 78,
      recommendedAction: 'Confirm timing, amount and board memo readiness.'
    }));
  }

  const complianceScore = metric(moduleSummaries.compliance?.data, ['legalHealthScore']);
  if (complianceScore !== null && complianceScore < 70) {
    queue.push(item({
      id: 'compliance-remediation-decision',
      title: 'Approve compliance remediation posture',
      module: 'Compliance',
      decisionType: 'compliance_remediation_decision',
      severity: complianceScore < 55 ? 'critical' : 'risk',
      priorityScore: 82,
      recommendedAction: 'Decide remediation owner, deadline and board communication posture.'
    }));
  }

  const pmiDelayed = metric(moduleSummaries.pmi?.data, ['metrics.delayedMilestones', 'delayedMilestones']);
  if (pmiDelayed && pmiDelayed > 0) {
    queue.push(item({
      id: 'pmi-integration-decision',
      title: 'Unblock PMI integration milestones',
      module: 'PMI',
      decisionType: 'pmi_integration_decision',
      severity: pmiDelayed > 2 ? 'critical' : 'risk',
      priorityScore: 76,
      recommendedAction: 'Review committee actions and synergy capture blockers.'
    }));
  }

  signals
    .filter((signal) => ['blocked', 'critical'].includes(signal.severity))
    .forEach((signal, index) => {
      queue.push(item({
        id: `signal-${index}-${signal.module}`,
        title: signal.title,
        module: signal.module,
        decisionType: 'executive_attention_decision',
        severity: signal.severity,
        priorityScore: signal.priorityScore,
        recommendedAction: signal.recommendedAction
      }));
    });

  return sortDecisionQueue(queue).slice(0, 12);
}

export async function listExecutiveDecisionQueue(organizationId) {
  return decisionQueueStore.listByOrganization(organizationId);
}

export async function createExecutiveDecision(organizationId, payload = {}, actor = {}) {
  const created = await decisionQueueStore.create({
    organizationId,
    userId: actor.userId || '',
    createdBy: actor.userId || '',
    ...payload
  });
  await recordAuditLog({
    organizationId,
    userId: actor.userId || '',
    action: 'executive.decision_queue.viewed',
    entityType: 'executive',
    entityId: created.id,
    metadata: { title: created.title }
  });
  return created;
}

export default {
  buildExecutiveDecisionQueue,
  createExecutiveDecision,
  listExecutiveDecisionQueue,
  sortDecisionQueue
};
