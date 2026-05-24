import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import { closeDatabase, getSql } from '../../../backend/storage/sqliteStorage.js';
import * as boardPackModule from '../../../backend/services/reporting/boardPack.service.js';
import {
  createBoardPack,
  createEnterpriseReport,
  createReportEvidence,
  createReportExport,
  createReportSchedule,
  createReportTemplate,
  createReportVersion,
  getReportingDashboard,
  getReportingSummary,
  listEnterpriseReports,
  listReportingAuditLogs
} from '../../../backend/services/reporting/reporting.service.js';

let tempDir = '';

describe('enterprise reporting foundation', () => {
  beforeAll(() => {
    closeDatabase();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-reporting-enterprise-'));
    process.env.DB_PATH = path.join(tempDir, 'test.sqlite');
    initializeDatabaseSchema();
  });

  afterAll(() => {
    closeDatabase();
    delete process.env.DB_PATH;
    if (tempDir) fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('aplica migracion Reporting enterprise', () => {
    expect(getSql("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'enterprise_reports' LIMIT 1")?.name).toBe('enterprise_reports');
    expect(getSql("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'board_packs' LIMIT 1")?.name).toBe('board_packs');
  });

  it('gestiona report creation, templates, versioning, export ledger, schedules, evidence y board packs', async () => {
    const organizationId = 'org_reporting_enterprise';
    const actor = { userId: 'u_reporting_enterprise', role: 'admin' };
    const report = await createEnterpriseReport(organizationId, { title: 'CEO Weekly Brief', module: 'CEO', reportType: 'CEO Weekly Brief', evidenceCompleteness: 80 }, actor);
    await createReportTemplate(organizationId, { templateKey: 'ceo_weekly_brief', module: 'CEO', requiredSections: ['Summary'], requiredEvidence: ['Board pack'] }, actor);
    await createReportVersion(organizationId, { reportId: report.id, versionNumber: '1.1', changeSummary: 'Added risk section' }, actor);
    await createReportExport(organizationId, { reportId: report.id, exportType: 'pdf', destinationNote: 'Board portal' }, actor);
    await createReportSchedule(organizationId, { title: 'Weekly CEO brief', schedule: 'weekly', owner: 'CEO Office' }, actor);
    await createReportEvidence(organizationId, { reportId: report.id, sourceModule: 'Compliance', evidenceTitle: 'Audit ledger', evidenceStatus: 'missing' }, actor);
    await createBoardPack(organizationId, { title: 'Board Executive Snapshot', completenessScore: 84 }, actor);

    const summary = await getReportingSummary({ organizationId });
    expect(summary.counts.reports).toBe(1);
    expect(summary.counts.templates).toBe(1);
    expect(summary.counts.versions).toBe(1);
    expect(summary.counts.exports).toBe(1);
    expect(summary.counts.schedules).toBe(1);
    expect(summary.counts.boardPacks).toBe(1);
    expect(summary.missingEvidenceCount).toBe(1);
    expect(summary.bridgeSignals).toContain('reporting.board_pack_evidence_gap');

    const dashboard = await getReportingDashboard({ organizationId });
    expect(dashboard.reports.length).toBe(1);
    expect(dashboard.exports[0].checksum).toBeTruthy();

    const logs = await listReportingAuditLogs(organizationId);
    expect(logs.some((item) => item.action === 'reporting.report.created')).toBe(true);
    expect(logs.some((item) => item.action === 'reporting.report.exported')).toBe(true);
  });

  it('bloquea lectura cross-tenant', async () => {
    await createEnterpriseReport('org_reporting_a', { title: 'Tenant A report' }, { userId: 'u' });
    expect((await listEnterpriseReports('org_reporting_b')).some((item) => item.title === 'Tenant A report')).toBe(false);
  });

  it('no infla reportingReadinessScore cuando no hay metadata persistida', async () => {
    const summary = await getReportingSummary({ organizationId: 'org_reporting_empty' });

    expect(summary.metrics.reportingReadinessScore).toBeNull();
    expect(summary.hasPersistedReportingData).toBe(false);
    expect(summary.dataSource).toBe('insufficient_data');
    expect(summary.executiveSignalEligible).toBe(false);
  });

  it('marca generation_failed cuando generateBoardPack falla', async () => {
    const spy = vi.spyOn(boardPackModule, 'generateBoardPack').mockRejectedValueOnce(new Error('aggregation_failed'));
    const item = await createBoardPack('org_reporting_fail', {}, { userId: 'u_fail', role: 'admin' });

    expect(item.status).toBe('generation_failed');
    expect(item.payload.generationStatus).toBe('failed');
    expect(item.payload.humanReviewRequired).toBe(true);
    expect(item.payload.generatedBoardPack).toBeNull();
    expect(item.payload.generationError).toMatch(/human review required/i);

    spy.mockRestore();
  });
});
