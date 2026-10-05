import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import {
  closeDatabase,
  execSql,
  getSql
} from '../../../backend/storage/sqliteStorage.js';
import { recordAuditLog } from '../../../backend/services/audit/auditLog.service.js';
import { createPmiCase, listPmiCases } from '../../../backend/services/pmi/pmi.service.js';
import { getFundingSummary } from '../../../backend/services/funding/funding.service.js';

const ORG = 'org_a04_fault';
const USER = 'u_a04_fault';

let tempDir = '';

function countAudit(action) {
  const row = getSql(
    `
      SELECT COUNT(*) AS total
      FROM audit_logs
      WHERE organization_id = @organizationId
        AND action = @action
    `,
    { organizationId: ORG, action }
  );
  return Number(row?.total || 0);
}

function installAbortTrigger() {
  dropAbortTrigger();
  execSql(`
    CREATE TRIGGER a04_fail_audit_insert
    BEFORE INSERT ON audit_logs
    BEGIN
      SELECT RAISE(ABORT, 'A04_INJECTED_PERSISTENCE_FAILURE');
    END;
  `);
}

function dropAbortTrigger() {
  execSql('DROP TRIGGER IF EXISTS a04_fail_audit_insert;');
}

describe('A04 audit persistence fault injection', () => {
  beforeAll(() => {
    closeDatabase();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-a04-fault-'));
    process.env.DB_PATH = path.join(tempDir, 'test.sqlite');
    initializeDatabaseSchema();
  });

  afterAll(() => {
    dropAbortTrigger();
    closeDatabase();
    delete process.env.DB_PATH;
    if (tempDir) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('required audit rejects with AUDIT_PERSISTENCE_FAILED and does not insert a row', async () => {
    installAbortTrigger();
    const before = countAudit('a04.required.write');

    const rejection = await recordAuditLog({
      organizationId: ORG,
      userId: USER,
      action: 'a04.required.write',
      entityType: 'audit_test',
      entityId: 'req-1',
      required: true
    }).catch((error) => error);

    expect(rejection).toBeInstanceOf(Error);
    expect(rejection.code).toBe('AUDIT_PERSISTENCE_FAILED');
    expect(rejection.message).toBe('Audit persistence failed');
    expect(rejection.details).toBeUndefined();
    expect(String(rejection.message)).not.toContain('A04_INJECTED_PERSISTENCE_FAILURE');
    expect(countAudit('a04.required.write')).toBe(before);
  });

  it('createPmiCase rejects under audit INSERT abort and records the non-atomic split', async () => {
    installAbortTrigger();
    const auditBefore = countAudit('pmi.case.created');
    const casesBefore = (await listPmiCases(ORG)).length;

    const rejection = await createPmiCase(
      ORG,
      { dealName: 'A04 PMI Fault Case', synergyTarget: 1000, synergyCaptured: 0 },
      { userId: USER }
    ).catch((error) => error);

    expect(rejection).toBeInstanceOf(Error);
    expect(rejection.code).toBe('AUDIT_PERSISTENCE_FAILED');
    expect(countAudit('pmi.case.created')).toBe(auditBefore);

    const casesAfter = await listPmiCases(ORG);
    const leftover = casesAfter.find((item) => item.dealName === 'A04 PMI Fault Case');
    expect(leftover).toBeTruthy();
    expect(leftover.id).toBeTruthy();
    expect(casesAfter.length).toBeGreaterThan(casesBefore);
  });

  it('getFundingSummary remains available while CLASS B audit writes fail', async () => {
    installAbortTrigger();
    const viewedBefore = countAudit('funding.summary.viewed');
    const bridgeBefore = countAudit('funding.bridge.evaluated');
    const windowBefore = countAudit('funding.window.evaluated');

    const summary = await getFundingSummary(ORG, { userId: USER });

    expect(summary).toBeTruthy();
    expect(summary.roundsCount).toBeDefined();
    expect(countAudit('funding.summary.viewed')).toBe(viewedBefore);
    expect(countAudit('funding.bridge.evaluated')).toBe(bridgeBefore);
    expect(countAudit('funding.window.evaluated')).toBe(windowBefore);
  });

  it('successful required audit inserts one independently queryable row', async () => {
    dropAbortTrigger();

    const created = await recordAuditLog({
      organizationId: ORG,
      userId: USER,
      action: 'a04.success.write',
      entityType: 'audit_test',
      entityId: 'ok-1'
    });

    expect(created?.id).toBeTruthy();
    const row = getSql(
      `
        SELECT id, organization_id, action
        FROM audit_logs
        WHERE id = @id
        LIMIT 1
      `,
      { id: created.id }
    );
    expect(row?.id).toBe(created.id);
    expect(row?.organization_id).toBe(ORG);
    expect(row?.action).toBe('a04.success.write');
  });
});
