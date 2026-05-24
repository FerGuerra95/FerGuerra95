import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import { closeDatabase, getSql } from '../../../backend/storage/sqliteStorage.js';
import {
  createPmiDayOneItem,
  createPmiHundredDayItem,
  createPmiMilestone,
  createPmiProgram,
  createPmiRisk,
  createPmiSynergy,
  createPmiTransitionService,
  generatePmiReport,
  getPmiBridgeSignals,
  getPmiSummary,
  listPmiAuditLogs,
  updatePmiSynergy
} from '../../../backend/services/pmi/pmi.service.js';

let tempDir = '';

describe('PMI synergies enterprise foundation', () => {
  beforeAll(() => {
    closeDatabase();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-pmi-enterprise-'));
    process.env.DB_PATH = path.join(tempDir, 'test.sqlite');
    initializeDatabaseSchema();
  });

  afterAll(() => {
    closeDatabase();
    delete process.env.DB_PATH;
    if (tempDir) fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('aplica la migracion aditiva enterprise', () => {
    expect(getSql("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'pmi_programs' LIMIT 1")?.name).toBe('pmi_programs');
    expect(getSql("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'pmi_report_exports' LIMIT 1")?.name).toBe('pmi_report_exports');
  });

  it('gestiona programas, sinergias, milestones, riesgos, Day 1, TSA y reports', async () => {
    const organizationId = 'org_pmi_synergies_enterprise';
    const actor = { userId: 'u_pmi_synergies_enterprise' };
    const program = await createPmiProgram(organizationId, {
      title: 'MedTech Integration',
      acquisitionName: 'MedTech Platform',
      integrationPhase: 'day_60',
      owner: 'PMI Partner'
    }, actor);
    const synergy = await createPmiSynergy(organizationId, {
      programId: program.id,
      title: 'Procurement consolidation',
      targetValue: 1000000,
      capturedValue: 420000,
      status: 'in_progress',
      valueLeakageRisk: 'medium'
    }, actor);
    await updatePmiSynergy(organizationId, synergy.id, { capturedValue: 620000, status: 'captured' }, actor);
    await createPmiMilestone(organizationId, { programId: program.id, title: 'Day 60 value review', progress: 60, dueDate: '2099-01-01' }, actor);
    await createPmiRisk(organizationId, { programId: program.id, title: 'System cutover dependency', severity: 'critical', status: 'open' }, actor);
    await createPmiDayOneItem(organizationId, { programId: program.id, title: 'Finance handover', readinessScore: 80, status: 'ready' }, actor);
    await createPmiHundredDayItem(organizationId, { programId: program.id, title: 'Day 60 plan', period: 'day_60', valueCaptureProgress: 60 }, actor);
    await createPmiTransitionService(organizationId, { programId: program.id, title: 'ERP TSA', risk: 'high', endDate: '2099-01-01' }, actor);
    const report = await generatePmiReport(organizationId, { reportType: 'synergy_capture_report' }, actor);
    expect(report.payload?.scoringTruthfulness?.goldenBenchmark).toBe('pmiCaptureRateGolden');
    expect(report.payload?.humanReviewRequired).toBe(true);

    const summary = await getPmiSummary({ organizationId });
    expect(summary.metrics.synergyCaptureRatio).toBe(62);
    expect(summary.metrics.criticalIntegrationRisks).toBe(1);
    expect(summary.metrics.tsaRisk).toBe(1);
    expect(summary.metrics.pmiReadinessScore).toBeGreaterThan(0);

    const bridge = await getPmiBridgeSignals({ organizationId, userId: actor.userId });
    expect(bridge.signals).toContain('pmi.integration_risk_critical');
    expect(bridge.signals).toContain('pmi.tsa_exit_risk');

    const auditLogs = await listPmiAuditLogs(organizationId);
    expect(auditLogs.some((item) => item.action === 'pmi.program.created')).toBe(true);
    expect(auditLogs.some((item) => item.action === 'pmi.report.exported')).toBe(true);
  });
});
