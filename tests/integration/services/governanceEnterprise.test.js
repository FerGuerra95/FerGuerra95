import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import { closeDatabase } from '../../../backend/storage/sqliteStorage.js';
import {
  approveGovernanceDecision,
  createGovernanceActionItem,
  createGovernanceBoardPack,
  createGovernanceCommittee,
  createGovernanceDecision,
  createGovernanceMeeting,
  createGovernancePolicy,
  deferGovernanceDecision,
  escalateGovernanceDecision,
  generateGovernanceReport,
  getGovernanceDecisionById,
  getGovernanceSummary,
  listGovernanceAuditLogs,
  rejectGovernanceDecision,
  submitGovernanceDecision
} from '../../../backend/services/governance/governance.service.js';

let tempDir = '';

describe('governance enterprise foundation', () => {
  beforeAll(() => {
    closeDatabase();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-governance-'));
    process.env.DB_PATH = path.join(tempDir, 'test.sqlite');
    initializeDatabaseSchema();
  });

  afterAll(() => {
    closeDatabase();
    delete process.env.DB_PATH;
    if (tempDir) fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('gestiona decisiones, workflows, entidades enterprise y summary', async () => {
    const organizationId = 'org_governance_enterprise';
    const userId = 'u_governance_enterprise';
    const decision = await createGovernanceDecision(
      organizationId,
      {
        title: 'Approve acquisition committee mandate',
        decisionType: 'acquisition',
        priority: 'critical',
        owner: 'Corporate Secretary',
        approver: 'Board',
        deadlineAt: '2099-01-01',
        blockingDecision: true,
        estimatedFinancialImpact: 12000000
      },
      { userId }
    );

    await submitGovernanceDecision(organizationId, decision.id, { userId }, { notes: 'Ready for board review' });
    const approved = await approveGovernanceDecision(organizationId, decision.id, { userId }, { notes: 'Approved by board' });
    expect(approved.status).toBe('approved');
    expect(approved.lockedAt).toBeTruthy();

    await createGovernanceBoardPack(organizationId, { title: 'Q2 Governance Board Pack', status: 'final', readinessScore: 82 }, { userId });
    await createGovernanceCommittee(organizationId, { committeeName: 'Investment Committee', committeeType: 'investment', nextMeetingDate: '2099-01-01' }, { userId });
    await createGovernancePolicy(organizationId, { title: 'Delegation of Authority', reviewDate: '2099-01-01' }, { userId });
    await createGovernanceActionItem(organizationId, { title: 'Prepare final minutes', dueDate: '2099-01-01' }, { userId });
    await createGovernanceMeeting(organizationId, { meetingTitle: 'Investment Committee', meetingDate: '2099-01-01' }, { userId });
    await generateGovernanceReport(organizationId, { reportType: 'board_readiness_snapshot' }, { userId });

    const summary = await getGovernanceSummary({ organizationId });
    expect(summary.metrics.governanceReadinessScore).toBeGreaterThan(0);
    expect(summary.metrics.boardReadinessScore).toBeGreaterThan(0);
    expect(summary.metrics.pendingCriticalDecisions).toBe(0);

    const logs = await listGovernanceAuditLogs(organizationId);
    expect(logs.some((item) => item.action === 'governance.decision.approved')).toBe(true);
    expect(logs.some((item) => item.action === 'governance.report.exported')).toBe(true);
  });

  it('empty org summary returns insufficient_data without baseline readiness scores', async () => {
    const summary = await getGovernanceSummary({ organizationId: 'org_governance_empty' });
    expect(summary.metrics.governanceReadinessScore).toBeNull();
    expect(summary.metrics.boardReadinessScore).toBeNull();
    expect(summary.metrics.governanceStatus).toBe('insufficient_data');
    expect(summary.executiveSignalEligible).toBe(false);
    expect(summary.humanReviewRequired).toBe(true);
  });

  it('mantiene aislamiento multi-tenant y soporta reject/defer/escalate', async () => {
    const decision = await createGovernanceDecision('org_governance_a', { title: 'Tenant A decision' }, { userId: 'u_a' });
    expect(await getGovernanceDecisionById('org_governance_b', decision.id)).toBeNull();

    const rejected = await rejectGovernanceDecision('org_governance_a', decision.id, { userId: 'u_a' }, { notes: 'No longer aligned' });
    expect(rejected.status).toBe('rejected');

    const second = await createGovernanceDecision('org_governance_a', { title: 'Tenant A deferred' }, { userId: 'u_a' });
    expect((await deferGovernanceDecision('org_governance_a', second.id, { userId: 'u_a' })).status).toBe('deferred');
    expect((await escalateGovernanceDecision('org_governance_a', second.id, { userId: 'u_a' })).status).toBe('escalated');
  });
});
