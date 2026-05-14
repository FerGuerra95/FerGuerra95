import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';
import { recordAuditLog } from '../audit/auditLog.service.js';

export const boardViewStore = createSqliteEntityStore('executive_board_views', 'exec_board', {
  title: 'Board Executive Snapshot',
  status: 'generated',
  payload: {}
});

function take(items = [], count = 5) {
  return Array.isArray(items) ? items.slice(0, count) : [];
}

function metric(summary, paths = [], fallback = 'Insufficient data') {
  for (const path of paths) {
    const value = path.split('.').reduce((current, key) => current?.[key], summary);
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return fallback;
}

export function buildBoardViewSnapshot({ moduleSummaries = {}, signals = [], decisionQueue = [], readiness = {} } = {}) {
  return {
    title: 'Board Executive Snapshot',
    generatedAt: new Date().toISOString(),
    readinessScore: readiness.score || 0,
    confidence: readiness.confidence || 0,
    topRisks: take(signals.filter((item) => ['critical', 'risk', 'blocked'].includes(item.severity)), 5),
    topDecisions: take(decisionQueue, 5),
    topOpportunities: [
      {
        module: 'M&A',
        title: metric(moduleSummaries.ma?.data, ['latestDeal.name', 'latestCase.name'], 'M&A opportunity signal not available'),
        status: moduleSummaries.ma?.status || 'not_available'
      },
      {
        module: 'Strategy',
        title: metric(moduleSummaries.strategy?.data, ['latestObjective.title'], 'Strategic opportunity signal not available'),
        status: moduleSummaries.strategy?.status || 'not_available'
      }
    ],
    capitalRunway: metric(moduleSummaries.funding?.data, ['projectedRunwayMonths', 'runwayMonths']),
    compliancePosture: metric(moduleSummaries.compliance?.data, ['legalHealthScore']),
    maPipeline: metric(moduleSummaries.ma?.data, ['counts.deals', 'totalDeals'], 0),
    fundingReadiness: metric(moduleSummaries.funding?.data, ['readinessScore', 'capitalEfficiencyScore']),
    governanceBottlenecks: metric(moduleSummaries.governance?.data, ['metrics.approvalBottlenecks', 'metrics.pendingCriticalDecisions'], 0),
    pmiValueCapture: metric(moduleSummaries.pmi?.data, ['metrics.synergyCaptureRatio', 'synergyCaptureRatio']),
    reportingReadiness: metric(moduleSummaries.reporting?.data, ['metrics.reportingReadinessScore', 'reportingReadinessScore']),
    humanReviewPosture: 'human_review_required'
  };
}

export async function createExecutiveBoardView(organizationId, payload = {}, actor = {}) {
  const created = await boardViewStore.create({
    organizationId,
    userId: actor.userId || '',
    createdBy: actor.userId || '',
    title: payload.title || 'Board Executive Snapshot',
    status: payload.status || 'generated',
    payload
  });
  await recordAuditLog({
    organizationId,
    userId: actor.userId || '',
    action: 'executive.board_view.generated',
    entityType: 'executive',
    entityId: created.id,
    metadata: { title: created.title }
  });
  return created;
}

export default {
  buildBoardViewSnapshot,
  createExecutiveBoardView
};
