import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';
import { recordAuditLog } from '../audit/auditLog.service.js';

export const calendarStore = createSqliteEntityStore('executive_calendar_items', 'exec_calendar', {
  title: 'Executive calendar item',
  module: 'enterprise',
  itemType: 'critical_deadline',
  dueDate: '',
  priority: 'watch',
  owner: 'Executive Office',
  status: 'open',
  sourceEntityId: '',
  payload: {}
});

const PRIORITY_RANK = { blocked: 5, critical: 4, risk: 3, watch: 2, normal: 1 };

export function sortCalendarItems(items = []) {
  return [...items].sort((a, b) => {
    const rankDelta = (PRIORITY_RANK[b.priority] || 1) - (PRIORITY_RANK[a.priority] || 1);
    if (rankDelta !== 0) return rankDelta;
    return String(a.dueDate || '9999').localeCompare(String(b.dueDate || '9999'));
  });
}

function item(payload = {}) {
  return {
    id: payload.id,
    title: payload.title,
    module: payload.module || 'Executive',
    itemType: payload.itemType || 'critical_deadline',
    dueDate: payload.dueDate || '',
    priority: payload.priority || 'watch',
    owner: payload.owner || 'Executive Office',
    status: payload.status || 'open',
    sourceEntityId: payload.sourceEntityId || ''
  };
}

export function buildExecutiveCalendar({ moduleSummaries = {}, decisionQueue = [] } = {}) {
  const items = [];
  decisionQueue.forEach((decision, index) => {
    items.push(item({
      id: `decision-${index}`,
      title: decision.title,
      module: decision.module,
      itemType: decision.decisionType,
      dueDate: decision.dueDate,
      priority: decision.severity,
      owner: decision.owner
    }));
  });

  const policyRisk = moduleSummaries.governance?.data?.metrics?.policyReviewRisk;
  if (policyRisk && policyRisk !== 'controlled') {
    items.push(item({
      id: 'governance-policy-review',
      title: 'Policy review due',
      module: 'Governance',
      itemType: 'policy_review_due',
      priority: policyRisk === 'blocked' ? 'critical' : 'risk'
    }));
  }

  const missingEvidence = moduleSummaries.reporting?.data?.metrics?.missingEvidenceCount || moduleSummaries.reporting?.data?.missingEvidenceCount;
  if (missingEvidence > 0) {
    items.push(item({
      id: 'reporting-board-evidence',
      title: 'Board pack evidence review',
      module: 'Reporting',
      itemType: 'board_pack_due',
      priority: missingEvidence > 3 ? 'risk' : 'watch'
    }));
  }

  const pmiDelayed = moduleSummaries.pmi?.data?.metrics?.delayedMilestones || moduleSummaries.pmi?.data?.delayedMilestones;
  if (pmiDelayed > 0) {
    items.push(item({
      id: 'pmi-milestone-review',
      title: 'PMI milestone due',
      module: 'PMI',
      itemType: 'pmi_milestone_due',
      priority: pmiDelayed > 2 ? 'critical' : 'risk'
    }));
  }

  return sortCalendarItems(items).slice(0, 12);
}

export async function listExecutiveCalendarItems(organizationId) {
  return calendarStore.listByOrganization(organizationId);
}

export async function createExecutiveCalendarItem(organizationId, payload = {}, actor = {}) {
  const created = await calendarStore.create({
    organizationId,
    userId: actor.userId || '',
    createdBy: actor.userId || '',
    ...payload
  });
  await recordAuditLog({
    organizationId,
    userId: actor.userId || '',
    action: 'executive.calendar.viewed',
    entityType: 'executive',
    entityId: created.id,
    metadata: { title: created.title }
  });
  return created;
}

export default {
  buildExecutiveCalendar,
  createExecutiveCalendarItem,
  listExecutiveCalendarItems,
  sortCalendarItems
};
