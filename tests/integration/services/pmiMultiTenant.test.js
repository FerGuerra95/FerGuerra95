import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import { closeDatabase } from '../../../backend/storage/sqliteStorage.js';
import {
  createPmiCase,
  createPmiSynergy,
  generatePmiReport,
  getPmiCaseById,
  getPmiExecutiveHubBrief,
  listPmiCases,
  listPmiReports,
  listPmiSynergies
} from '../../../backend/services/pmi/pmi.service.js';

let tempDir = '';

describe('PMI multi-tenant isolation', () => {
  beforeAll(() => {
    closeDatabase();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-pmi-multitenant-'));
    process.env.DB_PATH = path.join(tempDir, 'test.sqlite');
    initializeDatabaseSchema();
  });

  afterAll(() => {
    closeDatabase();
    delete process.env.DB_PATH;
    if (tempDir) fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('bloquea lectura cross-tenant de casos PMI', async () => {
    const created = await createPmiCase(
      'org_pmi_a',
      { dealName: 'Tenant A PMI Case', synergyTarget: 1000000, synergyCaptured: 250000 },
      { userId: 'u_a' }
    );

    expect((await listPmiCases('org_pmi_b')).some((item) => item.dealName === 'Tenant A PMI Case')).toBe(
      false
    );
    expect(await getPmiCaseById('org_pmi_b', created.id)).toBeNull();
  });

  it('bloquea lectura cross-tenant de sinergias enterprise', async () => {
    await createPmiSynergy(
      'org_pmi_a',
      { title: 'Tenant A synergy initiative', targetValue: 500000, capturedValue: 100000 },
      { userId: 'u_a' }
    );

    expect(
      (await listPmiSynergies('org_pmi_b')).some((item) => item.title === 'Tenant A synergy initiative')
    ).toBe(false);
  });

  it('bloquea report exports cross-tenant', async () => {
    const report = await generatePmiReport(
      'org_pmi_a',
      { reportType: 'synergy_capture_report', title: 'Tenant A PMI Report' },
      { userId: 'u_a' }
    );

    const reportsB = await listPmiReports('org_pmi_b');
    expect(reportsB.some((item) => item.id === report.id)).toBe(false);
    expect(reportsB.some((item) => item.title === 'Tenant A PMI Report')).toBe(false);
  });

  it('hub brief no expone caso persistido de otra organizacion', async () => {
    await createPmiCase(
      'org_pmi_a',
      { dealName: 'Tenant A Hub Case', synergyTarget: 2000000, synergyCaptured: 500000 },
      { userId: 'u_a' }
    );

    const briefB = await getPmiExecutiveHubBrief({ organizationId: 'org_pmi_b' });

    expect(briefB.latestCase).toBeFalsy();
    expect(briefB.executiveSignalEligible).toBe(false);
    expect(briefB.dataSource).toBe('empty');
    expect(briefB.score).toBeNull();
    expect(briefB.demoDataIncluded).toBe(false);
  });
});
