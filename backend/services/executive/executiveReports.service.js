import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';
import { recordAuditLog } from '../audit/auditLog.service.js';

export const reportsStore = createSqliteEntityStore('executive_reports', 'exec_report', {
  reportType: 'ceo_weekly_brief',
  title: 'CEO Weekly Brief',
  status: 'generated',
  payload: {}
});

export const snapshotsStore = createSqliteEntityStore('executive_snapshots', 'exec_snapshot', {
  title: 'Executive snapshot',
  readinessScore: 0,
  confidence: 0,
  payload: {}
});

function actorId(actor = {}) {
  return String(actor.userId || actor.id || '').trim();
}

export function getExecutiveReportTypes() {
  return [
    'CEO Weekly Brief',
    'Board Executive Snapshot',
    'Enterprise Readiness Report',
    'Strategic Decision Memo',
    'Executive Attention Report',
    'CEO Risk & Opportunity Brief'
  ];
}

export async function listExecutiveReports(organizationId) {
  return reportsStore.listByOrganization(organizationId);
}

export async function createExecutiveReport(organizationId, payload = {}, actor = {}) {
  const created = await reportsStore.create({
    organizationId,
    userId: actorId(actor),
    createdBy: actorId(actor),
    reportType: payload.reportType || 'ceo_weekly_brief',
    title: payload.title || 'CEO Weekly Brief',
    status: payload.status || 'generated',
    payload: {
      reportTypes: getExecutiveReportTypes(),
      humanReviewRequired: true,
      ...(payload.payload || {})
    }
  });
  await recordAuditLog({
    organizationId,
    userId: actorId(actor),
    action: 'executive.report.exported',
    entityType: 'executive',
    entityId: created.id,
    metadata: { title: created.title, reportType: created.reportType }
  });
  return created;
}

export async function createExecutiveSnapshot(organizationId, payload = {}, actor = {}) {
  const created = await snapshotsStore.create({
    organizationId,
    userId: actorId(actor),
    createdBy: actorId(actor),
    title: payload.title || 'Executive snapshot',
    readinessScore: payload.readinessScore || 0,
    confidence: payload.confidence || 0,
    payload
  });
  await recordAuditLog({
    organizationId,
    userId: actorId(actor),
    action: 'executive.snapshot.created',
    entityType: 'executive',
    entityId: created.id,
    metadata: { title: created.title }
  });
  return created;
}

export default {
  createExecutiveReport,
  createExecutiveSnapshot,
  getExecutiveReportTypes,
  listExecutiveReports
};
