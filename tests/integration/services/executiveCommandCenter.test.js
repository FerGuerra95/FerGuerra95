import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import { closeDatabase, getSql } from '../../../backend/storage/sqliteStorage.js';
import {
  createBoardViewFromOverview,
  createExecutiveReportFromOverview,
  createSnapshotFromOverview,
  getExecutiveBoardView,
  getExecutiveCalendar,
  getExecutiveDecisionQueue,
  getExecutiveOverview,
  getExecutiveReadiness,
  getExecutiveSignals,
  getExecutiveSummary
} from '../../../backend/services/executive/executiveOverview.service.js';
import { createExecutiveSignal, updateExecutiveSignal } from '../../../backend/services/executive/executiveSignals.service.js';
import { createStrategicInitiative, createStrategicObjective } from '../../../backend/services/strategy/strategy.service.js';

let tempDir = '';

describe('CEO command center enterprise foundation', () => {
  beforeAll(() => {
    closeDatabase();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-executive-enterprise-'));
    process.env.DB_PATH = path.join(tempDir, 'test.sqlite');
    initializeDatabaseSchema();
  });

  afterAll(() => {
    closeDatabase();
    delete process.env.DB_PATH;
    if (tempDir) fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('aplica migracion executive command center', () => {
    expect(getSql("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'executive_signals' LIMIT 1")?.name).toBe('executive_signals');
    expect(getSql("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'executive_calendar_items' LIMIT 1")?.name).toBe('executive_calendar_items');
  });

  it('genera overview, summary, readiness, signals, queue, board view, calendar y exports', async () => {
    const organizationId = 'org_executive_enterprise';
    const actor = { userId: 'u_executive_enterprise' };
    const objective = await createStrategicObjective(organizationId, {
      title: 'Capital efficient expansion',
      targetMetric: 100,
      currentMetric: 45,
      linkedBoardDecisionId: 'board_1'
    }, actor);
    await createStrategicInitiative(organizationId, {
      objectiveId: objective.id,
      title: 'Enterprise launch',
      status: 'blocked',
      capitalNeed: 300000,
      blockers: ['Board approval']
    }, actor);

    const overview = await getExecutiveOverview({ organizationId, userId: actor.userId, role: 'admin' });
    expect(overview.readiness.score).toBeGreaterThanOrEqual(0);
    expect(overview.moduleCards.map((item) => item.key)).toContain('strategy');
    expect(Array.isArray(overview.signals)).toBe(true);

    const summary = await getExecutiveSummary({ organizationId, userId: actor.userId });
    expect(summary.humanReviewPosture).toBe('human_review_required');
    expect((await getExecutiveReadiness({ organizationId })).score).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(await getExecutiveSignals({ organizationId }))).toBe(true);
    expect(Array.isArray(await getExecutiveDecisionQueue({ organizationId }))).toBe(true);
    expect((await getExecutiveBoardView({ organizationId })).humanReviewPosture).toBe('human_review_required');
    expect(Array.isArray(await getExecutiveCalendar({ organizationId }))).toBe(true);

    const signal = await createExecutiveSignal(organizationId, { title: 'Manual executive signal', module: 'CEO', severity: 'watch' }, actor);
    expect((await updateExecutiveSignal(organizationId, signal.id, { status: 'resolved' }, actor)).status).toBe('resolved');
    expect((await createSnapshotFromOverview({ organizationId, userId: actor.userId })).readinessScore).toBeGreaterThanOrEqual(0);
    expect((await createBoardViewFromOverview({ organizationId, userId: actor.userId })).title).toBe('Board Executive Snapshot');
    expect((await createExecutiveReportFromOverview({ organizationId, userId: actor.userId })).title).toBe('CEO Weekly Brief');
  });

  it('mantiene comportamiento defensivo para organizaciones sin datos', async () => {
    const overview = await getExecutiveOverview({ organizationId: 'org_executive_empty', userId: 'u' });
    expect(overview.readiness.missingData.length).toBeGreaterThanOrEqual(0);
    expect(overview.signals.some((item) => item.title.includes('not available') || item.humanReviewRequired)).toBe(true);
    expect(overview.readiness.humanReviewRequired).toBe(true);
    expect(overview.readiness.executiveSignalEligible).toBe(false);
    expect(overview.signals.length).toBeGreaterThan(0);
  });
});
