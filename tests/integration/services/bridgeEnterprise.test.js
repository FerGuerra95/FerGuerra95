import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import { closeDatabase, getSql } from '../../../backend/storage/sqliteStorage.js';
import {
  acknowledgeBridgeSignal,
  createBridgeConflict,
  createBridgeDependency,
  createBridgeEvidenceLink,
  createBridgeSignal,
  createBridgeSnapshot,
  dismissBridgeSignal,
  generateEnterpriseBridgeReport,
  getEnterpriseBridgeSummary,
  listBridgeAuditLogs,
  recalculateEnterpriseBridge,
  resolveBridgeSignal
} from '../../../backend/services/bridge/bridge.service.js';

let tempDir = '';

describe('enterprise bridge cross-module intelligence', () => {
  beforeAll(() => {
    closeDatabase();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-bridge-enterprise-'));
    process.env.DB_PATH = path.join(tempDir, 'test.sqlite');
    initializeDatabaseSchema();
  });

  afterAll(() => {
    closeDatabase();
    delete process.env.DB_PATH;
    if (tempDir) fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('aplica migracion enterprise bridge', () => {
    expect(getSql("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'bridge_signals' LIMIT 1")?.name).toBe('bridge_signals');
    expect(getSql("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'bridge_snapshots' LIMIT 1")?.name).toBe('bridge_snapshots');
  });

  it('gestiona signal lifecycle, dependencies, conflicts, evidence, snapshots y reports', async () => {
    const organizationId = 'org_bridge_enterprise';
    const actor = { userId: 'u_bridge_enterprise' };
    const signal = await createBridgeSignal(organizationId, {
      sourceModule: 'Compliance',
      targetModule: 'Funding',
      signalType: 'compliance_funding_risk',
      severity: 'risk',
      title: 'Compliance risk may affect funding',
      recommendedAction: 'Audit before capital raise',
      confidenceLevel: 82
    }, actor);

    expect((await acknowledgeBridgeSignal(organizationId, signal.id, actor)).status).toBe('acknowledged');
    expect((await resolveBridgeSignal(organizationId, signal.id, actor)).status).toBe('resolved');
    const secondSignal = await createBridgeSignal(organizationId, { title: 'Dismiss me', signalType: 'manual_signal' }, actor);
    expect((await dismissBridgeSignal(organizationId, secondSignal.id, actor, { reason: 'No longer applicable' })).status).toBe('dismissed');

    await createBridgeDependency(organizationId, { sourceModule: 'Governance', targetModule: 'PMI', blockingFlag: true, owner: 'CEO Office' }, actor);
    await createBridgeConflict(organizationId, { title: 'Funding proceeds while compliance score low', sourceModule: 'Funding', targetModule: 'Compliance', severity: 'critical' }, actor);
    await createBridgeEvidenceLink(organizationId, { signalId: signal.id, sourceModule: 'Compliance', linkLabel: 'Audit evidence', evidenceQuality: 'high' }, actor);
    await createBridgeSnapshot(organizationId, { title: 'CEO Bridge Snapshot' }, actor);
    await generateEnterpriseBridgeReport(organizationId, { reportType: 'cross_module_executive_brief' }, actor);

    const summary = await getEnterpriseBridgeSummary({ organizationId });
    expect(summary.metrics.blockedDependencies).toBe(1);
    expect(summary.metrics.unresolvedConflicts).toBe(1);
    expect(summary.counts.evidenceLinks).toBe(1);
    expect(summary.counts.snapshots).toBe(1);

    const logs = await listBridgeAuditLogs(organizationId);
    expect(logs.some((item) => item.action === 'bridge.signal.acknowledged')).toBe(true);
    expect(logs.some((item) => item.action === 'bridge.report.exported')).toBe(true);
  });

  it('recalcula defensivamente aunque falten modulos', async () => {
    const result = await recalculateEnterpriseBridge({ organizationId: 'org_bridge_missing_modules', userId: 'u_bridge_missing_modules' });
    expect(result.moduleSummaries.strategy).toBe('not_available');
    expect(result.signals.some((item) => item.signalType === 'strategic_capital_dependency')).toBe(true);
  });
});
