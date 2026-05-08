import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import {
  closeDatabase,
  getSql,
  runSql
} from '../../../backend/storage/sqliteStorage.js';
import {
  createForOrganization,
  deleteForOrganization,
  getByIdForOrganization,
  getFundingSummary,
  listByOrganization,
  updateForOrganization
} from '../../../backend/services/funding/funding.service.js';
import * as fundingController from '../../../backend/api/controllers/funding.controller.js';
import {
  PERMISSIONS,
  requirePermission
} from '../../../backend/api/middlewares/auth.middleware.js';

let tempDir = '';

function createRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
}

describe('funding API enterprise foundation', () => {
  beforeAll(() => {
    closeDatabase();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-funding-enterprise-'));
    process.env.DB_PATH = path.join(tempDir, 'test.sqlite');
    initializeDatabaseSchema();
  });

  afterAll(() => {
    closeDatabase();
    delete process.env.DB_PATH;

    if (tempDir) {
      fs.rmSync(tempDir, {
        recursive: true,
        force: true
      });
    }
  });

  it('aplica migracion 006_funding_rounds_enterprise', () => {
    const migration = getSql(
      `
        SELECT id
        FROM schema_migrations
        WHERE id = @id
        LIMIT 1
      `,
      {
        id: '006_funding_rounds_enterprise'
      }
    );
    const roundsTable = getSql(
      `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
          AND name = 'funding_rounds'
        LIMIT 1
      `
    );

    expect(migration?.id).toBe('006_funding_rounds_enterprise');
    expect(roundsTable?.name).toBe('funding_rounds');
  });

  it('GET/POST/PUT/DELETE rounds + summary respetan multi-tenancy', async () => {
    const createdA = await createForOrganization(
      'org_funding_a',
      {
        roundType: 'Seed',
        status: 'active',
        amountRaised: 500000,
        valuationPostMoney: 3000000,
        currentCash: 120000,
        monthlyBurnRate: 40000
      },
      { userId: 'u_funding_a' }
    );
    const createdB = await createForOrganization(
      'org_funding_b',
      {
        roundType: 'Debt',
        status: 'draft',
        amountRaised: 800000,
        valuationPostMoney: 5000000
      },
      { userId: 'u_funding_b' }
    );

    const listA = await listByOrganization('org_funding_a');
    const listB = await listByOrganization('org_funding_b');
    expect(listA.map((item) => item.id)).toEqual([createdA.id]);
    expect(listB.map((item) => item.id)).toEqual([createdB.id]);

    await expect(
      getByIdForOrganization('org_funding_a', createdB.id)
    ).resolves.toBeNull();

    await expect(
      updateForOrganization(
        'org_funding_a',
        createdB.id,
        {
          status: 'active'
        },
        { userId: 'u_funding_a' }
      )
    ).resolves.toBeNull();

    const updatedA = await updateForOrganization(
      'org_funding_a',
      createdA.id,
      {
        amountRaised: 650000,
        monthlyBurnRate: 50000
      },
      { userId: 'u_funding_a' }
    );
    expect(updatedA.amountRaised).toBe(650000);
    expect(updatedA.projectedRunwayMonths).toBeCloseTo(15.4, 5);

    const crossDelete = await deleteForOrganization(
      'org_funding_a',
      createdB.id,
      { userId: 'u_funding_a' }
    );
    expect(crossDelete.deleted).toBe(false);

    const ownDelete = await deleteForOrganization(
      'org_funding_b',
      createdB.id,
      { userId: 'u_funding_b' }
    );
    expect(ownDelete.deleted).toBe(true);

    const summaryA = await getFundingSummary('org_funding_a', {
      userId: 'u_funding_a'
    });
    expect(summaryA.roundsCount).toBe(1);
    expect(summaryA.totalRaised).toBe(650000);
    expect(summaryA.latestRound?.id).toBe(createdA.id);
    expect(summaryA.optimalFundingWindowStatus).toBeTruthy();
    expect(Array.isArray(summaryA.executiveSignals)).toBe(true);
  });

  it('summary aplica bridges defensivos de compliance y M&A', async () => {
    const now = new Date().toISOString();
    await createForOrganization(
      'org_bridge_test',
      {
        roundType: 'Seed',
        status: 'active',
        amountRaised: 400000,
        valuationPreMoney: 1600000,
        valuationPostMoney: 2000000,
        currentCash: 120000,
        monthlyBurnRate: 30000
      },
      { userId: 'u_bridge_test' }
    );

    runSql(
      `
        INSERT INTO ma_deals (
          id, organization_id, user_id, case_id, name, stage, owner_name, priority,
          risk_level, status, next_step, ic_memo_status, expected_close_at, payload_json,
          created_at, updated_at
        )
        VALUES (
          @id, @organizationId, @userId, NULL, @name, 'screening', '', 'medium',
          'medium', 'active', '', 'not_started', NULL, @payloadJson, @createdAt, @updatedAt
        )
      `,
      {
        id: 'deal_bridge_test_1',
        organizationId: 'org_bridge_test',
        userId: 'u_bridge_test',
        name: 'Bridge Deal',
        payloadJson: JSON.stringify({ equityValue: 2500000 }),
        createdAt: now,
        updatedAt: now
      }
    );

    runSql(
      `
        INSERT INTO compliance_audit_runs (
          id, organization_id, user_id, scope, framework, status, score, critical_findings,
          payload_json, created_at, updated_at
        )
        VALUES (
          @id, @organizationId, @userId, 'portfolio', 'all', 'completed', @score, 2, '{}', @createdAt, @updatedAt
        )
      `,
      {
        id: 'audit_bridge_test_1',
        organizationId: 'org_bridge_test',
        userId: 'u_bridge_test',
        score: 45,
        createdAt: now,
        updatedAt: now
      }
    );

    const summary = await getFundingSummary('org_bridge_test', {
      userId: 'u_bridge_test'
    });

    expect(summary.suggestedPreMoneyValuation).toBe(2500000);
    expect(summary.suggestedValuationSource).toBe('ma_valuation');
    expect(summary.complianceScore).toBe(55);
    expect(summary.complianceStatus).toBe('high_risk_audit_required');
    expect(summary.fundingRiskStatus).toBe('high_risk_audit_required');
    expect(summary.humanReviewRequired).toBe(true);
    expect(summary.latestPreMoneyValuation).toBe(1600000);
  });

  it('controller handlers cubren GET/POST/PUT/DELETE/summary endpoints', async () => {
    const next = vi.fn();
    const postReq = {
      organizationId: 'org_controller_a',
      user: { id: 'u_controller_a', organizationId: 'org_controller_a' },
      body: {
        roundType: 'Series A',
        amountRaised: 1200000,
        valuationPostMoney: 7200000,
        currentCash: 100000,
        monthlyBurnRate: 65000
      }
    };
    const postRes = createRes();
    await fundingController.createRound(postReq, postRes, next);

    expect(postRes.statusCode).toBe(201);
    const roundId = postRes.body?.data?.id;
    expect(roundId).toBeTruthy();

    const getReq = {
      organizationId: 'org_controller_a',
      user: { id: 'u_controller_a', organizationId: 'org_controller_a' },
      params: { id: roundId }
    };
    const getRes = createRes();
    await fundingController.getRoundById(getReq, getRes, next);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.data.id).toBe(roundId);

    const listReq = {
      organizationId: 'org_controller_a',
      user: { id: 'u_controller_a', organizationId: 'org_controller_a' },
      query: {}
    };
    const listRes = createRes();
    await fundingController.listRounds(listReq, listRes, next);
    expect(listRes.statusCode).toBe(200);
    expect(listRes.body.data.total).toBeGreaterThanOrEqual(1);

    const putReq = {
      organizationId: 'org_controller_a',
      user: { id: 'u_controller_a', organizationId: 'org_controller_a' },
      params: { id: roundId },
      body: {
        amountRaised: 1300000
      }
    };
    const putRes = createRes();
    await fundingController.updateRound(putReq, putRes, next);
    expect(putRes.statusCode).toBe(200);
    expect(putRes.body.data.amountRaised).toBe(1300000);

    const summaryReq = {
      organizationId: 'org_controller_a',
      user: { id: 'u_controller_a', organizationId: 'org_controller_a' }
    };
    const summaryRes = createRes();
    await fundingController.getRoundSummary(summaryReq, summaryRes, next);
    expect(summaryRes.statusCode).toBe(200);
    expect(summaryRes.body.data.roundsCount).toBeGreaterThanOrEqual(1);

    const deleteReq = {
      organizationId: 'org_controller_a',
      user: { id: 'u_controller_a', organizationId: 'org_controller_a' },
      params: { id: roundId }
    };
    const deleteRes = createRes();
    await fundingController.deleteRound(deleteReq, deleteRes, next);
    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.data.deleted).toBe(true);
  });

  it('viewer read-only y user/admin con permiso de escritura', () => {
    const denyRes = createRes();
    const denyNext = vi.fn();
    const createGuard = requirePermission(PERMISSIONS.CREATE_FUNDING_SNAPSHOT);

    createGuard(
      { user: { id: 'viewer_1', role: 'viewer' } },
      denyRes,
      denyNext
    );
    expect(denyRes.statusCode).toBe(403);
    expect(denyNext).not.toHaveBeenCalled();

    const userRes = createRes();
    const userNext = vi.fn();
    createGuard(
      { user: { id: 'user_1', role: 'user' } },
      userRes,
      userNext
    );
    expect(userNext).toHaveBeenCalledTimes(1);

    const adminRes = createRes();
    const adminNext = vi.fn();
    createGuard(
      { user: { id: 'admin_1', role: 'admin' } },
      adminRes,
      adminNext
    );
    expect(adminNext).toHaveBeenCalledTimes(1);
  });
});
