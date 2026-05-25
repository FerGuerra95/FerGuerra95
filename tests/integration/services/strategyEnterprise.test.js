import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import { closeDatabase, getSql } from '../../../backend/storage/sqliteStorage.js';
import {
  createStrategicInitiative,
  createStrategicMarketNote,
  createStrategicObjective,
  createStrategicRisk,
  createStrategicScenario,
  createStrategyReport,
  getStrategyDashboard,
  getStrategySummary,
  listStrategicObjectives,
  listStrategyAuditLogs
} from '../../../backend/services/strategy/strategy.service.js';

let tempDir = '';

describe('enterprise strategy foundation', () => {
  beforeAll(() => {
    closeDatabase();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-strategy-enterprise-'));
    process.env.DB_PATH = path.join(tempDir, 'test.sqlite');
    initializeDatabaseSchema();
  });

  afterAll(() => {
    closeDatabase();
    delete process.env.DB_PATH;
    if (tempDir) fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('aplica migracion Strategy enterprise', () => {
    expect(getSql("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'strategic_objectives' LIMIT 1")?.name).toBe('strategic_objectives');
    expect(getSql("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'strategy_report_exports' LIMIT 1")?.name).toBe('strategy_report_exports');
  });

  it('gestiona objectives, initiatives, scenarios, market notes, risks, reports y summary', async () => {
    const organizationId = 'org_strategy_enterprise';
    const actor = { userId: 'u_strategy_enterprise' };
    const objective = await createStrategicObjective(organizationId, {
      title: 'Expand enterprise segment',
      targetMetric: 100,
      currentMetric: 45,
      linkedBoardDecisionId: 'decision_1'
    }, actor);
    await createStrategicInitiative(organizationId, { objectiveId: objective.id, title: 'Enterprise GTM', status: 'blocked', capitalNeed: 250000, blockers: ['Funding approval'] }, actor);
    await createStrategicScenario(organizationId, { title: 'Upside expansion', confidence: 76, capitalImpact: 250000 }, actor);
    await createStrategicMarketNote(organizationId, { market: 'EU', competitor: 'Incumbent', signal: 'Pricing shift' }, actor);
    await createStrategicRisk(organizationId, { risk: 'Delayed GTM', impact: 'high', mitigation: 'Board decision' }, actor);
    await createStrategyReport(organizationId, { reportType: 'capital_allocation_memo' }, actor);

    const summary = await getStrategySummary({ organizationId });
    expect(summary.capitalDependencyCount).toBe(1);
    expect(summary.blockedStrategicInitiatives).toBe(1);
    expect(summary.bridgeSignals).toContain('strategy.strategic_capital_dependency');
    expect(summary.counts.reports).toBe(1);

    const dashboard = await getStrategyDashboard({ organizationId });
    expect(dashboard.objectives.length).toBe(1);
    expect(dashboard.marketNotes.length).toBe(1);

    const logs = await listStrategyAuditLogs(organizationId);
    expect(logs.some((item) => item.action === 'strategy.objective.created')).toBe(true);
    expect(logs.some((item) => item.action === 'strategy.report.exported')).toBe(true);
  });

  it('bloquea lectura cross-tenant', async () => {
    await createStrategicObjective('org_strategy_a', { title: 'Tenant A objective' }, { userId: 'u' });
    expect((await listStrategicObjectives('org_strategy_b')).some((item) => item.title === 'Tenant A objective')).toBe(false);
  });

  it('ignora organizationId malicioso del cliente en create', async () => {
    const created = await createStrategicObjective(
      'org_strategy_a',
      { title: 'Malicious org objective', organizationId: 'org_strategy_b', tenantId: 'org_strategy_b' },
      { userId: 'u_tenant_create' }
    );

    expect(created.organizationId).toBe('org_strategy_a');
    expect((await listStrategicObjectives('org_strategy_a')).some((item) => item.id === created.id)).toBe(true);
    expect((await listStrategicObjectives('org_strategy_b')).some((item) => item.id === created.id)).toBe(false);
  });

  it('returns insufficient_data summary for empty strategy org without 60 defaults', async () => {
    const summary = await getStrategySummary({ organizationId: 'org_strategy_empty' });

    expect(summary.strategyReadinessScore).toBeNull();
    expect(summary.metrics.strategyReadinessScore).toBeNull();
    expect(summary.metrics.objectiveCompletion).toBeNull();
    expect(summary.metrics.scenarioConfidence).toBeNull();
    expect(summary.dataSource).toBe('insufficient_data');
    expect(summary.executiveSignalEligible).toBe(false);
    expect(summary.metrics.strategicRiskLevel).toBe('not_assessed');
    expect(summary.scoringTruthfulness?.certifiedRating).toBe(false);
  });
});
