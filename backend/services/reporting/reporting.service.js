import { createHash } from 'node:crypto';
import { omitClientTenantFields } from '../../utils/tenantPayload.js';
import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';
import { listAuditLogs, recordAuditLog } from '../audit/auditLog.service.js';
import { generateBoardPack } from './boardPack.service.js';

const reportsStore = createSqliteEntityStore('enterprise_reports', 'enterprise_report', {
  title: 'Enterprise report',
  module: 'enterprise',
  reportType: 'enterprise_readiness_report',
  status: 'draft',
  owner: 'Executive Office',
  version: '1.0',
  lastExportedAt: '',
  evidenceCompleteness: 0,
  humanReviewRequired: 1,
  payload: {}
});

const templatesStore = createSqliteEntityStore('report_templates', 'report_template', {
  templateKey: '',
  module: 'enterprise',
  structure: {},
  requiredSections: [],
  requiredEvidence: [],
  status: 'active',
  payload: {}
});

const versionsStore = createSqliteEntityStore('report_versions', 'report_version', {
  reportId: '',
  versionNumber: '1.0',
  changeSummary: '',
  sourceEntities: [],
  payloadSnapshot: {},
  payload: {}
});

const exportsStore = createSqliteEntityStore('report_exports', 'report_export', {
  reportId: '',
  exportType: 'pdf',
  exportedBy: '',
  exportedAt: '',
  checksum: '',
  destinationNote: '',
  confidentialityLevel: 'confidential',
  payload: {}
});

const schedulesStore = createSqliteEntityStore('report_schedules', 'report_schedule', {
  title: 'Scheduled report',
  schedule: 'monthly',
  owner: 'Executive Office',
  nextRun: '',
  status: 'active',
  templateId: '',
  payload: {}
});

const evidenceStore = createSqliteEntityStore('report_evidence_links', 'report_evidence', {
  reportId: '',
  sourceModule: '',
  sourceEntityId: '',
  evidenceTitle: 'Report evidence',
  evidenceStatus: 'missing',
  evidenceQuality: 'medium',
  humanReviewRequired: 1,
  payload: {}
});

const boardPacksStore = createSqliteEntityStore('board_packs', 'board_pack', {
  title: 'Board Executive Snapshot',
  status: 'draft',
  sections: [],
  sourceModules: [],
  executiveSummary: '',
  decisions: [],
  risks: [],
  financialHighlights: [],
  complianceHighlights: [],
  fundingHighlights: [],
  maHighlights: [],
  pmiHighlights: [],
  governanceHighlights: [],
  completenessScore: 0,
  payload: {}
});

function normalizeText(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function normalizeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(normalizeNumber(value))));
}

function assertOrganizationId(organizationId) {
  if (!normalizeText(organizationId)) {
    const error = new Error('Scope de organizacion no definido.');
    error.status = 403;
    error.code = 'INVALID_SCOPE';
    throw error;
  }
}

function actorId(actor = {}) {
  return normalizeText(actor.userId || actor.id);
}

function commonCreate(organizationId, actor = {}) {
  const userId = actorId(actor);
  return { organizationId, userId, createdBy: userId };
}

function nowIso() {
  return new Date().toISOString();
}

async function audit({ organizationId, userId = '', action, entityId = '', metadata = {} }) {
  await recordAuditLog({ organizationId, userId, action, entityType: 'reporting', entityId, metadata });
}

function checksum(payload = {}) {
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

async function createWith(store, organizationId, payload = {}, actor = {}, action) {
  assertOrganizationId(organizationId);
  const item = await store.create({
    ...omitClientTenantFields(payload),
    ...commonCreate(organizationId, actor)
  });
  await audit({ organizationId, userId: actorId(actor), action, entityId: item.id, metadata: { title: item.title || item.templateKey || item.reportId } });
  return item;
}

async function listAll(organizationId) {
  assertOrganizationId(organizationId);
  const [reports, templates, versions, exports, schedules, evidence, boardPacks] = await Promise.all([
    reportsStore.listByOrganization(organizationId),
    templatesStore.listByOrganization(organizationId),
    versionsStore.listByOrganization(organizationId),
    exportsStore.listByOrganization(organizationId),
    schedulesStore.listByOrganization(organizationId),
    evidenceStore.listByOrganization(organizationId),
    boardPacksStore.listByOrganization(organizationId)
  ]);
  return { reports, templates, versions, exports, schedules, evidence, boardPacks };
}

export function calculateReportingMetrics({ reports = [], templates = [], versions = [], exports = [], schedules = [], evidence = [], boardPacks = [] } = {}) {
  const pendingReview = reports.filter((item) => ['draft', 'review', 'pending_review'].includes(normalizeText(item.status).toLowerCase())).length;
  const draftBoardPacks = boardPacks.filter((item) => normalizeText(item.status).toLowerCase() === 'draft').length;
  const missingEvidenceCount = evidence.filter((item) => ['missing', 'gap', 'pending'].includes(normalizeText(item.evidenceStatus).toLowerCase())).length;
  const outdatedReports = reports.filter((item) => !item.lastExportedAt || normalizeText(item.status).toLowerCase() === 'stale').length;
  const hasPersistedReportingData = reports.length > 0 || boardPacks.length > 0 || evidence.length > 0;
  const avgEvidence = reports.length
    ? Math.round(reports.reduce((sum, item) => sum + normalizeNumber(item.evidenceCompleteness), 0) / reports.length)
    : null;
  const boardPackCompleteness = boardPacks.length
    ? Math.round(boardPacks.reduce((sum, item) => sum + normalizeNumber(item.completenessScore), 0) / boardPacks.length)
    : null;
  const reportFreshness = reports.length ? clampScore(100 - Math.round((outdatedReports / reports.length) * 100)) : null;
  const reportingReadinessScore = hasPersistedReportingData
    ? clampScore(
        normalizeNumber(avgEvidence, 0) * 0.32 +
          normalizeNumber(boardPackCompleteness, 0) * 0.28 +
          normalizeNumber(reportFreshness, 0) * 0.24 +
          Math.min(100, templates.length * 12) * 0.08 +
          Math.min(100, schedules.length * 12) * 0.08 -
          missingEvidenceCount * 3
      )
    : null;
  const requiresExecutiveAttention = missingEvidenceCount > 0 || pendingReview > 2 || draftBoardPacks > 0 || outdatedReports > 2;
  return {
    reportsByModule: reports.reduce((acc, item) => {
      const key = normalizeText(item.module, 'enterprise');
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {}),
    reportsPendingReview: pendingReview,
    boardPacksInDraft: draftBoardPacks,
    recentExports: exports.slice(0, 5),
    evidenceGaps: missingEvidenceCount,
    missingEvidenceCount,
    reportFreshness,
    reportingReadinessScore,
    boardPackCompleteness: boardPackCompleteness === null ? null : clampScore(boardPackCompleteness),
    outdatedReports,
    scheduledReports: schedules.length,
    versionsCount: versions.length,
    hasPersistedReportingData,
    dataSource: hasPersistedReportingData ? 'persisted_reporting_metadata' : 'insufficient_data',
    executiveReportingStatus: hasPersistedReportingData
      ? requiresExecutiveAttention
        ? 'watch'
        : 'ready'
      : 'insufficient_data',
    requiresExecutiveAttention: hasPersistedReportingData ? requiresExecutiveAttention : true,
    humanReviewRequired: true
  };
}

function buildBridgeSignals(metrics = {}) {
  const signals = [];
  if (metrics.missingEvidenceCount > 0) signals.push('reporting.board_pack_evidence_gap');
  if (metrics.outdatedReports > 0) signals.push('reporting.outdated_report_requires_review');
  if (metrics.requiresExecutiveAttention) signals.push('bridge.reporting_signal.created');
  return signals;
}

export async function listEnterpriseReports(organizationId) { return reportsStore.listByOrganization(organizationId); }
export const createEnterpriseReport = (organizationId, payload, actor) => createWith(reportsStore, organizationId, payload, actor, 'reporting.report.created');
export async function listReportTemplates(organizationId) { return templatesStore.listByOrganization(organizationId); }
export const createReportTemplate = (organizationId, payload, actor) => createWith(templatesStore, organizationId, payload, actor, 'reporting.template.created');
export async function listReportVersions(organizationId) { return versionsStore.listByOrganization(organizationId); }
export const createReportVersion = (organizationId, payload, actor) => createWith(versionsStore, organizationId, payload, actor, 'reporting.report.versioned');
export async function listReportExports(organizationId) { return exportsStore.listByOrganization(organizationId); }
export async function createReportExport(organizationId, payload = {}, actor = {}) {
  const item = await createWith(exportsStore, organizationId, {
    ...payload,
    exportedBy: payload.exportedBy || actorId(actor),
    exportedAt: payload.exportedAt || nowIso(),
    checksum: payload.checksum || checksum(payload)
  }, actor, 'reporting.report.exported');
  if (payload.reportId) {
    await reportsStore.updateForOrganization(payload.reportId, { lastExportedAt: item.exportedAt, status: 'exported' }, organizationId);
  }
  return item;
}
export async function listReportSchedules(organizationId) { return schedulesStore.listByOrganization(organizationId); }
export const createReportSchedule = (organizationId, payload, actor) => createWith(schedulesStore, organizationId, payload, actor, 'reporting.schedule.created');
export async function listReportEvidence(organizationId) { return evidenceStore.listByOrganization(organizationId); }
export const createReportEvidence = (organizationId, payload, actor) => createWith(evidenceStore, organizationId, payload, actor, 'reporting.evidence.linked');
export async function listBoardPacks(organizationId) { return boardPacksStore.listByOrganization(organizationId); }

export async function createBoardPack(organizationId, payload = {}, actor = {}) {
  assertOrganizationId(organizationId);
  let generated = null;
  let generationError = null;

  try {
    generated = await generateBoardPack({ organizationId, userId: actorId(actor), role: actor.role || 'admin' });
  } catch (error) {
    generationError = normalizeText(error?.message, 'board_pack_generation_failed');
  }

  const generationStatus = generated ? 'completed' : 'failed';
  const sections = normalizeArray(payload.sections).length
    ? payload.sections
    : ['Executive Summary', 'Decisions', 'Risks', 'Financial Highlights', 'Compliance', 'Funding', 'M&A', 'PMI', 'Governance'];
  const completenessScore =
    generationStatus === 'completed'
      ? clampScore(payload.completenessScore ?? 82)
      : null;
  const item = await createWith(boardPacksStore, organizationId, {
    title: payload.title || 'Board Executive Snapshot',
    status: generationStatus === 'completed' ? payload.status || 'draft' : 'generation_failed',
    sections,
    sourceModules: payload.sourceModules || ['M&A', 'Compliance', 'Funding', 'PMI', 'Governance', 'Risk'],
    executiveSummary:
      payload.executiveSummary ||
      generated?.executiveSummary ||
      (generationStatus === 'completed'
        ? 'Enterprise board pack prepared for human review.'
        : 'Board pack aggregation failed — human review required before circulation.'),
    decisions: payload.decisions || [],
    risks: payload.risks || [],
    financialHighlights: payload.financialHighlights || [],
    complianceHighlights: payload.complianceHighlights || [],
    fundingHighlights: payload.fundingHighlights || [],
    maHighlights: payload.maHighlights || [],
    pmiHighlights: payload.pmiHighlights || [],
    governanceHighlights: payload.governanceHighlights || [],
    completenessScore: completenessScore ?? 0,
    payload: {
      generatedBoardPack: generated,
      generationStatus,
      generationError: generationError ? 'Aggregation failed — human review required.' : null,
      humanReviewRequired: true,
      decisionSupportOnly: true,
      scoringTruthfulness: generated?.scoringTruthfulness || null,
      dssNotice:
        generated?.dssNotice ||
        'Decision-support board pack draft only. Not a certified rating or board-approved final report.',
      ...(payload.payload || {})
    }
  }, actor, 'reporting.board_pack.created');
  return item;
}

export async function getReportingSummary(scope = {}) {
  assertOrganizationId(scope.organizationId);
  const data = await listAll(scope.organizationId);
  const metrics = calculateReportingMetrics(data);
  return {
    metrics,
    reportingReadinessScore: metrics.reportingReadinessScore,
    boardPackCompleteness: metrics.boardPackCompleteness,
    missingEvidenceCount: metrics.missingEvidenceCount,
    outdatedReports: metrics.outdatedReports,
    requiresExecutiveAttention: metrics.requiresExecutiveAttention,
    hasPersistedReportingData: metrics.hasPersistedReportingData,
    dataSource: metrics.dataSource,
    executiveSignalEligible: metrics.hasPersistedReportingData,
    counts: {
      reports: data.reports.length,
      templates: data.templates.length,
      versions: data.versions.length,
      exports: data.exports.length,
      schedules: data.schedules.length,
      evidence: data.evidence.length,
      boardPacks: data.boardPacks.length
    },
    latestReport: data.reports[0] || null,
    latestExport: data.exports[0] || null,
    bridgeSignals: buildBridgeSignals(metrics),
    humanReviewPosture: 'human_review_required'
  };
}

export async function getReportingDashboard(scope = {}) {
  assertOrganizationId(scope.organizationId);
  const data = await listAll(scope.organizationId);
  const metrics = calculateReportingMetrics(data);
  return { ...data, metrics, bridgeSignals: buildBridgeSignals(metrics), humanReviewPosture: 'human_review_required' };
}

export async function listReportingAuditLogs(organizationId, options = {}) {
  assertOrganizationId(organizationId);
  return listAuditLogs({ organizationId, entityType: 'reporting', limit: options.limit || 50 });
}

export default {
  calculateReportingMetrics,
  getReportingSummary,
  getReportingDashboard,
  listEnterpriseReports,
  createEnterpriseReport,
  listReportTemplates,
  createReportTemplate,
  listReportVersions,
  createReportVersion,
  listReportExports,
  createReportExport,
  listReportSchedules,
  createReportSchedule,
  listReportEvidence,
  createReportEvidence,
  listBoardPacks,
  createBoardPack,
  listReportingAuditLogs
};
