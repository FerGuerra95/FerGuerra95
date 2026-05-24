import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import { closeDatabase } from '../../../backend/storage/sqliteStorage.js';
import { generatePmiReport } from '../../../backend/services/pmi/pmi.service.js';

let tempDir = '';

describe('PMI report export truthfulness', () => {
  beforeAll(() => {
    closeDatabase();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-pmi-report-truth-'));
    process.env.DB_PATH = path.join(tempDir, 'test.sqlite');
    initializeDatabaseSchema();
  });

  afterAll(() => {
    closeDatabase();
    delete process.env.DB_PATH;
    if (tempDir) fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('includes scoringTruthfulness, boardReadyMemo disclaimer and humanReviewRequired', async () => {
    const report = await generatePmiReport(
      'org_pmi_report_truth',
      { reportType: 'pmi_executive_integration_memo' },
      { userId: 'u_report' }
    );

    const payload = report.payload || {};

    expect(payload.humanReviewRequired).toBe(true);
    expect(payload.scoringTruthfulness?.goldenBenchmark).toBe('pmiCaptureRateGolden');
    expect(payload.scoringTruthfulness?.goldenFormula).toBe('captured / forecast');
    expect(payload.scoringTruthfulness?.certifiedRating).toBe(false);
    expect(payload.scoringTruthfulness?.humanReviewRequired).toBe(true);
    expect(payload.scoringTruthfulness?.operationalLayers).toContain('operationalPmiReadinessScore');
    expect(payload.boardReadyMemo?.requiredHumanReview).toBe(true);
    expect(payload.boardReadyMemo?.disclaimer).toMatch(/not a certified rating/i);
    expect(payload.boardReadyMemo?.disclaimer).toMatch(/pmiCaptureRateGolden/i);
    expect(payload.dssNotice).toMatch(/human review/i);
  });

  it('does not present operational readiness as Golden PMI_CAPTURE_RATE', async () => {
    const report = await generatePmiReport(
      'org_pmi_report_truth',
      { reportType: 'synergy_capture_report' },
      { userId: 'u_report' }
    );

    const payload = report.payload || {};
    const serialized = JSON.stringify(payload).toLowerCase();

    expect(serialized).not.toMatch(/golden score/);
    expect(serialized).not.toMatch(/certified synergy/);
    expect(payload.scoringTruthfulness?.note).toMatch(/decision-support/i);
    expect(payload.scoringTruthfulness?.zeroDenominatorOperational).toMatch(/null when target/i);
    expect(payload.scoringTruthfulness?.zeroDenominatorGolden).toMatch(/pmiCaptureRateGolden/i);
  });
});
