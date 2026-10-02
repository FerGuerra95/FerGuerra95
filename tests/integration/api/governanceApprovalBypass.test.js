// @vitest-environment node

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';

import { buildHttpApp } from '../../../backend/httpApp.js';
import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import { closeDatabase } from '../../../backend/storage/sqliteStorage.js';
import {
  approveGovernanceDecision,
  createGovernanceDecision,
  getGovernanceDecisionById,
  listGovernanceApprovalHistory,
  listGovernanceAuditLogs,
  listGovernanceDecisions,
  rejectGovernanceDecision,
  requestGovernanceDecisionChanges,
  submitGovernanceDecision,
  updateGovernanceDecision
} from '../../../backend/services/governance/governance.service.js';
import { governanceValidator } from '../../../backend/api/validators/governance.validator.js';
import { assertIsolatedTestEnvironment } from '../../../scripts/lib/test-isolation.mjs';

const actor = { userId: 'u_a02' };
let app;
const tokens = {};

function workflowRejection() {
  return {
    status: 403,
    code: 'GOVERNANCE_DECISION_WORKFLOW_REQUIRED'
  };
}

function expectValidatorRejection(response) {
  expect(response.status).toBe(400);
  expect(response.body.error.code).toBe('VALIDATION_ERROR');
  expect(response.body.error.details).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        field: 'status',
        code: 'GOVERNANCE_DECISION_WORKFLOW_REQUIRED'
      })
    ])
  );
}

async function login(email, password) {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email, password });

  expect(response.status).toBe(200);
  return response.body.data.token;
}

describe('A02 governance approval bypass', () => {
  beforeAll(async () => {
    assertIsolatedTestEnvironment();
    closeDatabase();
    initializeDatabaseSchema();
    app = buildHttpApp();
    tokens.admin = await login('admin@ceoos.local', 'admin123');
    tokens.user = await login('user@ceoos.local', 'user123');
  });

  afterAll(() => {
    closeDatabase();
  });

  it('CASE 1 rejects generic create of an approved decision', async () => {
    const organizationId = 'org_a02_create_approved';

    await expect(
      createGovernanceDecision(
        organizationId,
        { title: 'Generic approved decision', status: 'approved' },
        actor
      )
    ).rejects.toMatchObject(workflowRejection());

    const decisions = await listGovernanceDecisions(organizationId);
    expect(decisions).toEqual([]);
    const history = await listGovernanceApprovalHistory(organizationId);
    expect(history.some((item) => item.action === 'approved')).toBe(false);
  });

  it('CASE 2 rejects generic update to approved and preserves the prior state', async () => {
    const organizationId = 'org_a02_update_approved';
    const decision = await createGovernanceDecision(
      organizationId,
      { title: 'Draft before approval bypass' },
      actor
    );

    await expect(
      updateGovernanceDecision(
        organizationId,
        decision.id,
        { status: 'approved' },
        actor
      )
    ).rejects.toMatchObject(workflowRejection());

    const stored = await getGovernanceDecisionById(organizationId, decision.id);
    expect(stored.status).toBe('draft');
    expect(stored.approvedAt).toBeFalsy();
    expect(stored.lockedAt).toBeFalsy();
    const history = await listGovernanceApprovalHistory(organizationId, decision.id);
    expect(history.some((item) => item.action === 'approved')).toBe(false);
  });

  it('CASE 3 rejects generic update to rejected', async () => {
    const organizationId = 'org_a02_update_rejected';
    const decision = await createGovernanceDecision(
      organizationId,
      { title: 'Draft before rejection bypass' },
      actor
    );

    await expect(
      updateGovernanceDecision(
        organizationId,
        decision.id,
        { status: 'rejected' },
        actor
      )
    ).rejects.toMatchObject(workflowRejection());

    const stored = await getGovernanceDecisionById(organizationId, decision.id);
    expect(stored.status).toBe('draft');
    expect(stored.rejectedAt).toBeFalsy();
    const history = await listGovernanceApprovalHistory(organizationId, decision.id);
    expect(history.some((item) => item.action === 'rejected')).toBe(false);
  });

  it('CASE 4 rejects generic return to draft after submit', async () => {
    const organizationId = 'org_a02_request_changes';
    const decision = await createGovernanceDecision(
      organizationId,
      { title: 'Under review before request-changes bypass' },
      actor
    );
    await submitGovernanceDecision(organizationId, decision.id, actor, {
      notes: 'Submitted for review'
    });

    await expect(
      updateGovernanceDecision(
        organizationId,
        decision.id,
        { status: 'draft' },
        actor
      )
    ).rejects.toMatchObject(workflowRejection());

    const stored = await getGovernanceDecisionById(organizationId, decision.id);
    expect(stored.status).toBe('under_review');
    const history = await listGovernanceApprovalHistory(organizationId, decision.id);
    expect(history.some((item) => item.action === 'changes_requested')).toBe(false);
    expect(history.some((item) => item.action === 'submitted')).toBe(true);
  });

  it('CASE 5 rejects direct service create and update with privileged statuses', async () => {
    const organizationId = 'org_a02_direct_service';
    const privileged = ['approved', 'rejected', 'under_review', 'deferred', 'escalated', 'implemented'];

    for (const status of privileged) {
      await expect(
        createGovernanceDecision(
          organizationId,
          { title: `Direct create ${status}`, status },
          actor
        )
      ).rejects.toMatchObject(workflowRejection());
    }

    const decision = await createGovernanceDecision(
      organizationId,
      { title: 'Direct service draft' },
      actor
    );

    for (const status of privileged) {
      await expect(
        updateGovernanceDecision(organizationId, decision.id, { status }, actor)
      ).rejects.toMatchObject(workflowRejection());
    }

    const stored = await getGovernanceDecisionById(organizationId, decision.id);
    expect(stored.status).toBe('draft');
    expect(await listGovernanceDecisions(organizationId)).toHaveLength(1);
  });

  it('CASE 6 allows draft create and non-workflow updates', async () => {
    const organizationId = 'org_a02_valid_crud';
    const created = await createGovernanceDecision(
      organizationId,
      {
        title: 'Ordinary draft',
        status: 'draft',
        owner: 'Corporate Secretary',
        priority: 'high'
      },
      actor
    );

    expect(created.status).toBe('draft');
    expect(created.approvedAt).toBeFalsy();
    expect(created.lockedAt).toBeFalsy();

    const updated = await updateGovernanceDecision(
      organizationId,
      created.id,
      { title: 'Ordinary draft revised', owner: 'Board Secretary' },
      actor
    );

    expect(updated.status).toBe('draft');
    expect(updated.title).toBe('Ordinary draft revised');
    expect(updated.owner).toBe('Board Secretary');
    expect(updated.approvedAt).toBeFalsy();
    expect(updated.lockedAt).toBeFalsy();
  });

  it('CASE 7 keeps the dedicated approval workflow authoritative', async () => {
    const organizationId = 'org_a02_legitimate_approval';
    const decision = await createGovernanceDecision(
      organizationId,
      { title: 'Board mandate', status: 'draft' },
      actor
    );

    await submitGovernanceDecision(organizationId, decision.id, actor, {
      notes: 'Ready for approval'
    });
    const approved = await approveGovernanceDecision(
      organizationId,
      decision.id,
      actor,
      { notes: 'Approved by board' }
    );

    expect(approved.status).toBe('approved');
    expect(approved.approvedAt).toBeTruthy();
    expect(approved.lockedAt).toBeTruthy();

    const history = await listGovernanceApprovalHistory(organizationId, decision.id);
    expect(history.some((item) => item.action === 'approved' && item.toStatus === 'approved')).toBe(true);

    const logs = await listGovernanceAuditLogs(organizationId);
    expect(logs.some((item) => item.action === 'governance.decision.approved')).toBe(true);

    const review = await createGovernanceDecision(
      organizationId,
      { title: 'Changes requested through workflow' },
      actor
    );
    await submitGovernanceDecision(organizationId, review.id, actor);
    const returned = await requestGovernanceDecisionChanges(
      organizationId,
      review.id,
      actor,
      { notes: 'Revise the mandate' }
    );
    expect(returned.status).toBe('draft');
    const reviewHistory = await listGovernanceApprovalHistory(organizationId, review.id);
    expect(reviewHistory.some((item) => item.action === 'changes_requested')).toBe(true);

    const rejected = await rejectGovernanceDecision(
      organizationId,
      review.id,
      actor,
      { notes: 'Not aligned' }
    );
    expect(rejected.status).toBe('rejected');
    expect(rejected.rejectedAt).toBeTruthy();
  });

  it('CASE 9 keeps organization scope on generic mutation', async () => {
    const decision = await createGovernanceDecision(
      'org_a02_tenant_a',
      { title: 'Tenant A decision' },
      { userId: 'u_a' }
    );

    await expect(
      updateGovernanceDecision(
        'org_a02_tenant_b',
        decision.id,
        { title: 'Tenant B hijack', status: 'approved' },
        { userId: 'u_b' }
      )
    ).rejects.toMatchObject({
      status: 404,
      code: 'GOVERNANCE_DECISION_NOT_FOUND'
    });

    const stored = await getGovernanceDecisionById('org_a02_tenant_a', decision.id);
    expect(stored.title).toBe('Tenant A decision');
    expect(stored.status).toBe('draft');
    expect(stored.approvedAt).toBeFalsy();
    expect(await getGovernanceDecisionById('org_a02_tenant_b', decision.id)).toBeNull();
  });

  it('rejects privileged statuses at the HTTP validator before persistence', async () => {
    const created = await request(app)
      .post('/api/governance/decisions')
      .set('Authorization', `Bearer ${tokens.user}`)
      .send({ title: 'API approved bypass', status: 'approved' });

    expectValidatorRejection(created);

    const listed = await request(app)
      .get('/api/governance/decisions')
      .set('Authorization', `Bearer ${tokens.user}`);

    expect(listed.status).toBe(200);
    expect(listed.body.data.items.map((item) => item.title)).not.toContain('API approved bypass');

    const draft = await request(app)
      .post('/api/governance/decisions')
      .set('Authorization', `Bearer ${tokens.user}`)
      .send({ title: 'API ordinary draft', status: 'draft', owner: 'Secretary' });

    expect(draft.status).toBe(201);
    expect(draft.body.data.status).toBe('draft');
    expect(draft.body.data.organizationId).toBe('org_demo_2');

    const approvedUpdate = await request(app)
      .patch(`/api/governance/decisions/${draft.body.data.id}`)
      .set('Authorization', `Bearer ${tokens.user}`)
      .send({ status: 'approved' });
    expectValidatorRejection(approvedUpdate);

    const rejectedUpdate = await request(app)
      .patch(`/api/governance/decisions/${draft.body.data.id}`)
      .set('Authorization', `Bearer ${tokens.user}`)
      .send({ status: 'rejected' });
    expectValidatorRejection(rejectedUpdate);

    const submitted = await request(app)
      .post(`/api/governance/decisions/${draft.body.data.id}/submit`)
      .set('Authorization', `Bearer ${tokens.user}`)
      .send({ notes: 'Submit through dedicated route' });
    expect(submitted.status).toBe(200);
    expect(submitted.body.data.status).toBe('under_review');

    const requestChangesBypass = await request(app)
      .patch(`/api/governance/decisions/${draft.body.data.id}`)
      .set('Authorization', `Bearer ${tokens.user}`)
      .send({ status: 'draft' });
    expectValidatorRejection(requestChangesBypass);

    const contentUpdate = await request(app)
      .patch(`/api/governance/decisions/${draft.body.data.id}`)
      .set('Authorization', `Bearer ${tokens.user}`)
      .send({ title: 'API ordinary draft revised', owner: 'Board Secretary' });

    expect(contentUpdate.status).toBe(200);
    expect(contentUpdate.body.data.status).toBe('under_review');
    expect(contentUpdate.body.data.title).toBe('API ordinary draft revised');
    expect(contentUpdate.body.data.approvedAt).toBeFalsy();
    expect(contentUpdate.body.data.lockedAt).toBeFalsy();
  });

  it('CASE 8 keeps APPROVE_GOVERNANCE_DECISION on the dedicated workflow routes', async () => {
    const created = await request(app)
      .post('/api/governance/decisions')
      .set('Authorization', `Bearer ${tokens.user}`)
      .send({ title: 'User cannot approve', status: 'draft' });

    expect(created.status).toBe(201);
    const decisionId = created.body.data.id;

    await request(app)
      .post(`/api/governance/decisions/${decisionId}/submit`)
      .set('Authorization', `Bearer ${tokens.user}`)
      .send({ notes: 'Ready' })
      .expect(200);

    for (const action of ['approve', 'reject', 'request-changes']) {
      const response = await request(app)
        .post(`/api/governance/decisions/${decisionId}/${action}`)
        .set('Authorization', `Bearer ${tokens.user}`)
        .send({ notes: 'Unauthorized workflow' });

      expect(response.status).toBe(403);
      expect(response.body.error.code).toBe('FORBIDDEN');
    }

    const stored = await request(app)
      .get(`/api/governance/decisions/${decisionId}`)
      .set('Authorization', `Bearer ${tokens.user}`);

    expect(stored.status).toBe(200);
    expect(stored.body.data.status).toBe('under_review');
    expect(stored.body.data.approvedAt).toBeFalsy();
    expect(stored.body.data.lockedAt).toBeFalsy();
    expect(stored.body.data.approvalHistory.some((item) => item.action === 'approved')).toBe(false);
  });

  it('allows an authorized role to approve through the dedicated route', async () => {
    const created = await request(app)
      .post('/api/governance/decisions')
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send({ title: 'Admin dedicated approval', status: 'draft' });

    expect(created.status).toBe(201);
    const decisionId = created.body.data.id;

    await request(app)
      .post(`/api/governance/decisions/${decisionId}/submit`)
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send({ notes: 'Ready for board' })
      .expect(200);

    const approved = await request(app)
      .post(`/api/governance/decisions/${decisionId}/approve`)
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send({ notes: 'Approved by board' });

    expect(approved.status).toBe(200);
    expect(approved.body.data.status).toBe('approved');
    expect(approved.body.data.approvedAt).toBeTruthy();
    expect(approved.body.data.lockedAt).toBeTruthy();
    expect(approved.body.data.organizationId).toBe('org_demo');

    const stored = await request(app)
      .get(`/api/governance/decisions/${decisionId}`)
      .set('Authorization', `Bearer ${tokens.admin}`);

    expect(stored.body.data.approvalHistory.some((item) => item.action === 'approved')).toBe(true);
  });

  it('does not let another organization mutate a decision through generic update', async () => {
    const created = await request(app)
      .post('/api/governance/decisions')
      .set('Authorization', `Bearer ${tokens.admin}`)
      .send({ title: 'Admin tenant decision', status: 'draft' });

    expect(created.status).toBe(201);
    const decisionId = created.body.data.id;

    const crossTenant = await request(app)
      .patch(`/api/governance/decisions/${decisionId}`)
      .set('Authorization', `Bearer ${tokens.user}`)
      .send({ title: 'Cross-tenant edit', owner: 'Other organization' });

    expect(crossTenant.status).toBe(404);
    expect(crossTenant.body.error.code).toBe('GOVERNANCE_DECISION_NOT_FOUND');

    const stored = await request(app)
      .get(`/api/governance/decisions/${decisionId}`)
      .set('Authorization', `Bearer ${tokens.admin}`);

    expect(stored.status).toBe(200);
    expect(stored.body.data.title).toBe('Admin tenant decision');
    expect(stored.body.data.status).toBe('draft');
    expect(stored.body.data.organizationId).toBe('org_demo');
  });

  it('validator create allows draft and rejects known workflow statuses', () => {
    expect(
      governanceValidator.decisionCreate.body({
        title: 'Draft decision',
        status: 'draft'
      }).status
    ).toBe('draft');

    expect(() =>
      governanceValidator.decisionCreate.body({
        title: 'Approved decision',
        status: 'approved'
      })
    ).toThrow(
      expect.objectContaining({
        status: 400,
        code: 'VALIDATION_ERROR',
        details: [
          expect.objectContaining({
            field: 'status',
            code: 'GOVERNANCE_DECISION_WORKFLOW_REQUIRED'
          })
        ]
      })
    );

    expect(() =>
      governanceValidator.decisionUpdate.body({
        title: 'Still draft',
        status: 'draft'
      })
    ).toThrow(
      expect.objectContaining({
        code: 'VALIDATION_ERROR'
      })
    );
  });
});
