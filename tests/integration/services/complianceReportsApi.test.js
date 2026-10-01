// @vitest-environment node

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import { closeDatabase } from '../../../backend/storage/sqliteStorage.js';
import { createSupplier } from '../../../backend/services/compliance/suppliers.service.js';
import {
  createComplianceReport,
  getReportById,
  listReports
} from '../../../backend/services/compliance/reports.service.js';
import { complianceReportsApi } from '../../../src/modules/compliance/services/complianceReportsApi.js';

describe('Compliance report service boundary', () => {
  beforeAll(() => {
    closeDatabase();
    initializeDatabaseSchema();
  });

  afterAll(() => {
    closeDatabase();
  });

  it('builds a truthful public report and persists it for one organization', async () => {
    const supplier = await createSupplier({
      organizationId: 'org_report_a',
      userId: 'user_report_a',
      name: 'Supplier A',
      country: 'ES',
      financialRisk: 70,
      jurisdictionRisk: 40,
      evidenceRisk: 55
    });
    const draft = complianceReportsApi.buildSupplierReport({
      supplier: {
        ...supplier,
        financialRisk: 70,
        jurisdictionRisk: 40,
        evidenceRisk: 55
      },
      riskScore: 61,
      resilienceScore: 72,
      riskLevel: { label: 'Medium' },
      resilienceLevel: { label: 'Controlled' },
      evidenceSummary: {
        totalEvidence: 2,
        pendingReviews: 1,
        coverageLabel: 'Partial'
      }
    });

    expect(draft).toBeTruthy();
    expect(draft.weightedRiskScore).toBe(55);

    const persisted = await createComplianceReport({
      ...draft,
      organizationId: 'org_report_a',
      userId: 'user_report_a'
    });

    expect(persisted.organizationId).toBe('org_report_a');
    expect(persisted.supplierId).toBe(supplier.id);

    const ownList = await listReports({ organizationId: 'org_report_a' });
    expect(ownList.map((item) => item.id)).toEqual([persisted.id]);
  });

  it('returns no persisted report for another organization', async () => {
    const supplier = await createSupplier({
      organizationId: 'org_report_scope_a',
      userId: 'user_report_scope_a',
      name: 'Scoped Supplier',
      country: 'DE'
    });
    const persisted = await createComplianceReport({
      organizationId: 'org_report_scope_a',
      userId: 'user_report_scope_a',
      supplierId: supplier.id,
      supplierName: supplier.name,
      title: 'Scoped Compliance Report'
    });

    await expect(
      getReportById(persisted.id, {
        organizationId: 'org_report_scope_b'
      })
    ).resolves.toBeNull();

    await expect(
      listReports({ organizationId: 'org_report_scope_b' })
    ).resolves.toEqual([]);
  });
});
