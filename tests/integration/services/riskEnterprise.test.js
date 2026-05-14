import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import { closeDatabase, getSql } from '../../../backend/storage/sqliteStorage.js';
import {
  createKriMetric,
  createRisk,
  createRiskAppetite,
  createRiskControl,
  createRiskIncident,
  createRiskMitigation,
  createRiskReport,
  getRiskDashboard,
  getRiskSummary,
  listRiskAuditLogs,
  listRisks,
  updateRisk
} from '../../../backend/services/risk/risk.service.js';

let tempDir = '';

describe('enterprise risk foundation', () => {
  beforeAll(() => {
    closeDatabase();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-risk-enterprise-'));
    process.env.DB_PATH = path.join(tempDir, 'test.sqlite');
    initializeDatabaseSchema();
  });

  afterAll(() => {
    closeDatabase();
    delete process.env.DB_PATH;
    if (tempDir) fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('aplica migracion Risk enterprise', () => {
    expect(getSql("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'risk_register' LIMIT 1")?.name).toBe('risk_register');
    expect(getSql("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'risk_appetite_statements' LIMIT 1")?.name).toBe('risk_appetite_statements');
  });

  it('gestiona register, controls, mitigations, incidents, KRIs, appetite, reports y summary', async () => {
    const organizationId = 'org_risk_enterprise';
    const actor = { userId: 'u_risk_enterprise' };
    const risk = await createRisk(organizationId, {
      title: 'Cyber control gap',
      category: 'technology',
      inherentSeverity: 'critical',
      residualRisk: 'critical',
      likelihood: 5,
      impact: 5,
      owner: 'CRO',
      status: 'open'
    }, actor);

    await createRiskControl(organizationId, { riskId: risk.id, title: 'Access review', effectiveness: 72, status: 'active' }, actor);
    await createRiskMitigation(organizationId, { riskId: risk.id, action: 'Close privileged access gap', dueDate: '2000-01-01', status: 'open' }, actor);
    await createRiskIncident(organizationId, { description: 'Access exception', severity: 'high', status: 'open' }, actor);
    await createKriMetric(organizationId, { metric: 'Critical exceptions', threshold: 2, actualValue: 4 }, actor);
    await createRiskAppetite(organizationId, { appetiteStatement: 'Zero critical unmanaged access risks', breachFlag: 1 }, actor);
    await createRiskReport(organizationId, { reportType: 'risk_committee_pack' }, actor);

    expect((await updateRisk(organizationId, risk.id, { status: 'escalated' }, actor)).status).toBe('escalated');

    const summary = await getRiskSummary({ organizationId });
    expect(summary.metrics.criticalRiskCount).toBe(1);
    expect(summary.metrics.overdueMitigations).toBe(1);
    expect(summary.metrics.appetiteBreaches).toBe(1);
    expect(summary.bridgeSignals).toContain('risk.critical_risk_requires_ceo');

    const dashboard = await getRiskDashboard({ organizationId });
    expect(dashboard.heatmap.length).toBe(1);
    expect(dashboard.reports.length).toBe(1);

    const logs = await listRiskAuditLogs(organizationId);
    expect(logs.some((item) => item.action === 'risk.created')).toBe(true);
    expect(logs.some((item) => item.action === 'risk.report.exported')).toBe(true);
  });

  it('bloquea lectura cross-tenant por organizationId', async () => {
    const actor = { userId: 'u_cross_tenant' };
    await createRisk('org_risk_a', { title: 'Tenant A risk' }, actor);
    expect((await listRisks('org_risk_b')).some((item) => item.title === 'Tenant A risk')).toBe(false);
  });
});
