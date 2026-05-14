import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import { closeDatabase } from '../../../backend/storage/sqliteStorage.js';
import {
  createHeritageAsset,
  createHeritageDocument,
  createHeritageProtection,
  createHeritageSuccession,
  generateHeritageContinuityReport,
  getHeritageBridgeSignals,
  getHeritageSummary,
  listHeritageAssets,
  listHeritageAuditLogs
} from '../../../backend/services/heritage/heritage.service.js';

let tempDir = '';

beforeAll(() => {
  closeDatabase();
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-heritage-'));
  process.env.DB_PATH = path.join(tempDir, 'heritage-enterprise.sqlite');
  initializeDatabaseSchema();
});

afterAll(() => {
  closeDatabase();
  delete process.env.DB_PATH;
  if (tempDir) fs.rmSync(tempDir, { recursive: true, force: true });
});

describe('heritage enterprise service', () => {
  it('cubre CRUD base, summary, bridge signals, report y audit trail por organizacion', async () => {
    const organizationId = 'org-heritage';
    const actor = { userId: 'user-heritage' };

    const asset = await createHeritageAsset(
      organizationId,
      {
        name: 'Family HoldCo',
        assetType: 'Operating company',
        estimatedValue: 12000000,
        protectionStatus: 'protected',
        liquidityProfile: 'medium',
        riskLevel: 'medium'
      },
      actor
    );
    await createHeritageSuccession(
      organizationId,
      { title: 'Founder continuity protocol', status: 'draft', readiness: 62, evidenceStatus: 'pending' },
      actor
    );
    await createHeritageProtection(
      organizationId,
      { name: 'Holding structure review', coverage: 58, status: 'active' },
      actor
    );
    await createHeritageDocument(
      organizationId,
      { title: 'Shareholder protocol evidence', evidenceStatus: 'pending', reviewDueAt: '2026-06-15' },
      actor
    );
    const report = await generateHeritageContinuityReport(
      { organizationId, userId: actor.userId },
      { title: 'Board Heritage Continuity Report' }
    );

    expect(asset.id).toBeTruthy();
    expect(report.payload.metrics.totalAssetValue).toBe(12000000);

    const summary = await getHeritageSummary({ organizationId });
    expect(summary.metrics.assetsCount).toBe(1);
    expect(summary.metrics.documentsCount).toBe(1);
    expect(summary.requiresExecutiveAttention).toBe(true);

    const bridge = await getHeritageBridgeSignals({ organizationId });
    expect(bridge.signals.length).toBeGreaterThan(0);

    const audit = await listHeritageAuditLogs(organizationId);
    expect(audit.map((item) => item.action)).toEqual(expect.arrayContaining(['heritage.asset.created', 'heritage.report.created']));

    const otherOrgAssets = await listHeritageAssets('org-other');
    expect(otherOrgAssets).toEqual([]);
  });
});
