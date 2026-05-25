import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initializeDatabaseSchema } from '../../../backend/storage/databaseSchema.js';
import {
  closeDatabase,
  getSql
} from '../../../backend/storage/sqliteStorage.js';
import { listAuditLogs } from '../../../backend/services/audit/auditLog.service.js';
import {
  createSupplier,
  deleteSupplier,
  getSupplierById,
  updateSupplier
} from '../../../backend/services/compliance/suppliers.service.js';
import {
  createAlert,
  listAlerts
} from '../../../backend/services/compliance/alerts.service.js';
import {
  createEvidence,
  deleteEvidence,
  listEvidence,
  updateEvidence
} from '../../../backend/services/compliance/evidence.service.js';
import {
  createReviewDecision,
  decideReview,
  listReviews
} from '../../../backend/services/compliance/reviews.service.js';
import {
  createComplianceReport,
  listReports
} from '../../../backend/services/compliance/reports.service.js';
import {
  buildComplianceAuditLedgerExport,
  getComplianceAuditRunById,
  listComplianceMaRiskImpacts,
  runComplianceAudit
} from '../../../backend/services/compliance/auditRuns.service.js';
import { getExecutiveComplianceHubBrief } from '../../../backend/services/compliance/executiveHub.service.js';
import { createMaCase, getMaCaseById } from '../../../backend/services/ma/cases.service.js';

let tempDir = '';

function buildMaCasePayload(name, organizationId, userId) {
  return {
    organizationId,
    userId,
    name,
    financials: {
      name,
      sector: 'Industria',
      normalizedEbitda: 900000
    },
    settings: {
      reportCurrency: 'EUR'
    }
  };
}

describe('compliance enterprise audit services', () => {
  beforeAll(() => {
    closeDatabase();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ceos-compliance-enterprise-'));
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

  it('aplica la migracion enterprise de Compliance', () => {
    const migration = getSql(
      `
        SELECT id
        FROM schema_migrations
        WHERE id = @id
        LIMIT 1
      `,
      {
        id: '003_compliance_enterprise'
      }
    );
    const auditRunsTable = getSql(
      `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
          AND name = 'compliance_audit_runs'
        LIMIT 1
      `
    );
    const impactsTable = getSql(
      `
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
          AND name = 'compliance_ma_risk_impacts'
        LIMIT 1
      `
    );
    const reportExecutiveColumn = getSql(
      `
        SELECT name
        FROM pragma_table_info('compliance_reports')
        WHERE name = 'executive_summary_json'
        LIMIT 1
      `
    );

    expect(migration?.id).toBe('003_compliance_enterprise');
    expect(auditRunsTable?.name).toBe('compliance_audit_runs');
    expect(impactsTable?.name).toBe('compliance_ma_risk_impacts');
    expect(reportExecutiveColumn?.name).toBe('executive_summary_json');
  });

  it('endurece servicios legacy con operaciones por organizacion', async () => {
    const supplierA = await createSupplier({
      organizationId: 'org_harden_a',
      userId: 'u_harden_a',
      name: 'Hardened Supplier A',
      country: 'Spain',
      region: 'Europa'
    });
    const supplierB = await createSupplier({
      organizationId: 'org_harden_b',
      userId: 'u_harden_b',
      name: 'Hardened Supplier B',
      country: 'France',
      region: 'Europa'
    });
    const alertA = await createAlert({
      organizationId: 'org_harden_a',
      userId: 'u_harden_a',
      supplierId: supplierA.id,
      title: 'Critical compliance alert',
      severity: 'critical',
      category: 'Legal Risk'
    });

    await createEvidence({
      organizationId: 'org_harden_a',
      userId: 'u_harden_a',
      supplierId: supplierA.id,
      alertId: alertA.id,
      title: 'Supplier audit evidence',
      sourceType: 'audit',
      confidence: 0.88,
      excerpt: 'Supply chain audit evidence.'
    });
    await createReviewDecision({
      organizationId: 'org_harden_a',
      userId: 'u_harden_a',
      supplierId: supplierA.id,
      alertId: alertA.id,
      status: 'pending'
    });
    await createComplianceReport({
      organizationId: 'org_harden_a',
      userId: 'u_harden_a',
      supplierId: supplierA.id,
      title: 'Supplier compliance report'
    });

    const crossTenantDelete = await deleteSupplier(supplierB.id, {
      organizationId: 'org_harden_a'
    });

    expect(crossTenantDelete.deleted).toBe(false);
    await expect(
      getSupplierById(supplierB.id, {
        organizationId: 'org_harden_b'
      })
    ).resolves.toMatchObject({
      id: supplierB.id
    });

    const deleteResult = await deleteSupplier(supplierA.id, {
      organizationId: 'org_harden_a'
    });

    expect(deleteResult.deleted).toBe(true);
    expect(deleteResult.removed.alerts).toBe(1);
    expect(deleteResult.removed.evidence).toBe(1);
    expect(deleteResult.removed.reviews).toBe(1);
    expect(deleteResult.removed.reports).toBe(1);

    expect(await listAlerts({ organizationId: 'org_harden_a' })).toEqual([]);
    expect(await listEvidence({ organizationId: 'org_harden_a' })).toEqual([]);
    expect(await listReviews({ organizationId: 'org_harden_a' })).toEqual([]);
    expect(await listReports({ organizationId: 'org_harden_a' })).toEqual([]);
    await expect(
      getSupplierById(supplierB.id, {
        organizationId: 'org_harden_b'
      })
    ).resolves.toMatchObject({
      id: supplierB.id
    });
  });

  it('ejecuta reglas deterministas, vincula evidencia y crea impacto M&A multi-tenant', async () => {
    const supplier = await createSupplier({
      organizationId: 'org_compliance_a',
      userId: 'u_compliance_a',
      name: 'Critical Cloud Processor',
      country: 'Spain',
      region: 'Europa',
      sector: 'Technology',
      tier: 'Tier 1',
      criticality: 'Alta',
      spend: 500000
    });

    const dpa = await createEvidence({
      organizationId: 'org_compliance_a',
      userId: 'u_compliance_a',
      supplierId: supplier.id,
      title: 'Signed DPA - Data Processing Agreement',
      sourceType: 'document',
      language: 'en',
      confidence: 0.92,
      excerpt: 'Data Processing Agreement signed by both parties.'
    });
    await createEvidence({
      organizationId: 'org_compliance_a',
      userId: 'u_compliance_a',
      supplierId: supplier.id,
      title: 'Access Control Policy',
      sourceType: 'document',
      language: 'en',
      confidence: 0.86,
      excerpt: 'Access control and least privilege policy.'
    });
    await createEvidence({
      organizationId: 'org_compliance_a',
      userId: 'u_compliance_a',
      supplierId: supplier.id,
      title: 'SOC 2 Type II Report',
      sourceType: 'certification',
      language: 'en',
      confidence: 0.91,
      excerpt: 'SOC 2 Type II Trust Services report.'
    });

    const maCase = await createMaCase(
      buildMaCasePayload('Compliance Impact Target', 'org_compliance_a', 'u_compliance_a')
    );

    const auditRun = await runComplianceAudit({
      organizationId: 'org_compliance_a',
      userId: 'u_compliance_a',
      supplierId: supplier.id,
      maCaseId: maCase.id,
      frameworks: ['gdpr', 'iso27001', 'soc2', 'csddd']
    });

    expect(auditRun.id).toBeTruthy();
    expect(auditRun.summary.score).toBeGreaterThan(0);
    expect(auditRun.results.some((item) => item.ruleId === 'gdpr-dpa-required')).toBe(true);

    const dpaResult = auditRun.results.find(
      (item) => item.ruleId === 'gdpr-dpa-required'
    );

    expect(dpaResult.status).toBe('passed');
    expect(dpaResult.evidenceLinks[0].evidenceId).toBe(dpa.id);
    expect(dpaResult.evidenceLinks[0].linkStatus).toBe('verified');

    expect(auditRun.maRiskImpact.maCaseId).toBe(maCase.id);
    expect(auditRun.maRiskImpact.legalRiskScore).toBe(auditRun.summary.score);
    expect(auditRun.maRiskImpact.ebitdaMultipleDelta).toBeLessThanOrEqual(0);

    const reloadedRun = await getComplianceAuditRunById(auditRun.id, {
      organizationId: 'org_compliance_a'
    });

    expect(reloadedRun.results.length).toBe(auditRun.results.length);
    expect(
      reloadedRun.results.some((item) => item.evidenceLinks.length > 0)
    ).toBe(true);

    const impacts = await listComplianceMaRiskImpacts({
      organizationId: 'org_compliance_a',
      maCaseId: maCase.id
    });

    expect(impacts).toHaveLength(1);

    const signedLedger = await buildComplianceAuditLedgerExport(auditRun.id, {
      organizationId: 'org_compliance_a'
    });

    expect(signedLedger.digestIntegrityModel).toBe('CEO_OS_LEDGER_DIGEST_V1');
    expect(signedLedger.integrityTag).toBe(`digest:${signedLedger.digestSha256}`);
    expect(signedLedger.simulatedSignatureAlgorithm).toBe(
      'SIMULATED_SHA256_LEDGER_V1'
    );
    expect(signedLedger.simulatedLedgerSignature).toBe(
      `simulated_hmac_stub:${signedLedger.digestSha256}`
    );
    expect(signedLedger.auditRun.results.length).toBe(auditRun.results.length);
    expect(
      signedLedger.auditRun.results.some((item) => item.evidenceLinks.length > 0)
    ).toBe(true);

    const updatedCase = await getMaCaseById(maCase.id, {
      organizationId: 'org_compliance_a'
    });

    expect(updatedCase.settings.complianceRiskImpact.auditRunId).toBe(auditRun.id);
    expect(updatedCase.settings.complianceRiskImpact.ebitdaMultipleDelta).toBe(
      auditRun.maRiskImpact.ebitdaMultipleDelta
    );
    expect(
      updatedCase.settings.complianceRiskImpact.requiresValuationRecalculation
    ).toBe(true);
    expect(updatedCase.settings.complianceRiskImpact.valuationDirty).toBe(true);
    expect(updatedCase.settings.valuationRecalculation.status).toBe('dirty');
    expect(updatedCase.settings.valuationRecalculation.auditRunId).toBe(auditRun.id);

    const report = await createComplianceReport({
      organizationId: 'org_compliance_a',
      userId: 'u_compliance_a',
      supplierId: supplier.id,
      supplierName: supplier.name,
      title: 'Enterprise compliance board pack',
      summary: 'Critical processor reviewed with board-ready evidence.',
      riskScore: auditRun.summary.score,
      resilienceScore: 78,
      riskLevel: auditRun.summary.riskLevel,
      resilienceLevel: 'Controlled',
      evidenceSummary: {
        evidenceCoverage: auditRun.summary.evidenceCoverage
      },
      recommendations: ['Maintain DPA refresh cadence', 'Refresh SOC 2 annually']
    });

    expect(report.executiveSummary.version).toBe(
      'compliance-executive-summary-v1'
    );
    expect(report.executiveSummary.overviewSignals.legalScore).toBe(
      100 - auditRun.summary.score
    );

    const hubBrief = await getExecutiveComplianceHubBrief({
      organizationId: 'org_compliance_a'
    });

    expect(hubBrief.latestAuditRun.id).toBe(auditRun.id);
    expect(hubBrief.legalHealthScore).toBe(100 - auditRun.summary.score);
    expect(hubBrief.portfolioReportBrief.reportId).toBe(report.id);

    await expect(
      runComplianceAudit({
        organizationId: 'org_compliance_b',
        userId: 'u_compliance_b',
        supplierId: supplier.id,
        frameworks: ['gdpr']
      })
    ).rejects.toMatchObject({
      code: 'SUPPLIER_NOT_FOUND'
    });

    await expect(
      runComplianceAudit({
        organizationId: 'org_compliance_b',
        userId: 'u_compliance_b',
        maCaseId: maCase.id,
        frameworks: ['gdpr']
      })
    ).rejects.toMatchObject({
      code: 'MA_CASE_NOT_FOUND'
    });
  });

  it('registra audit logs en CRUD de suppliers, evidence, reviews y reports', async () => {
    const orgA = 'org_compliance_audit_a';
    const orgB = 'org_compliance_audit_b';
    const userA = 'u_compliance_audit_a';

    const supplier = await createSupplier({
      organizationId: orgA,
      userId: userA,
      name: 'Audit Trail Supplier',
      country: 'Spain',
      region: 'Europa'
    });

    const createdLogs = await listAuditLogs({
      organizationId: orgA,
      action: 'compliance.supplier.created',
      entityId: supplier.id,
      limit: 5
    });

    expect(createdLogs).toHaveLength(1);
    expect(createdLogs[0].userId).toBe(userA);
    expect(createdLogs[0].metadata?.name).toBe('Audit Trail Supplier');
    expect(createdLogs[0].metadata?.excerpt).toBeUndefined();

    const crossTenantLogs = await listAuditLogs({
      organizationId: orgB,
      entityId: supplier.id,
      limit: 5
    });

    expect(crossTenantLogs).toHaveLength(0);

    await updateSupplier(
      supplier.id,
      { status: 'watchlist', userId: userA },
      { organizationId: orgA }
    );

    const updatedLogs = await listAuditLogs({
      organizationId: orgA,
      action: 'compliance.supplier.updated',
      entityId: supplier.id,
      limit: 5
    });

    expect(updatedLogs.length).toBeGreaterThan(0);
    expect(updatedLogs[0].metadata?.changedFields).toContain('status');

    const alert = await createAlert({
      organizationId: orgA,
      userId: userA,
      supplierId: supplier.id,
      title: 'Audit alert',
      severity: 'medium',
      category: 'General Risk'
    });

    const evidence = await createEvidence({
      organizationId: orgA,
      userId: userA,
      supplierId: supplier.id,
      alertId: alert.id,
      title: 'Audit evidence',
      sourceType: 'document',
      excerpt: 'Must not appear in audit metadata',
      confidence: 0.9
    });

    const evidenceLogs = await listAuditLogs({
      organizationId: orgA,
      action: 'compliance.evidence.created',
      entityId: evidence.id,
      limit: 5
    });

    expect(evidenceLogs).toHaveLength(1);
    expect(evidenceLogs[0].metadata?.excerpt).toBeUndefined();

    await updateEvidence(
      evidence.id,
      { confidence: 0.95, userId: userA },
      { organizationId: orgA }
    );

    const review = await createReviewDecision({
      organizationId: orgA,
      userId: userA,
      supplierId: supplier.id,
      alertId: alert.id,
      status: 'pending'
    });

    await decideReview(
      review.id,
      {
        reviewer: 'Compliance Lead',
        decision: 'validated',
        notes: 'Sensitive review notes',
        userId: userA
      },
      { organizationId: orgA, userId: userA }
    );

    const statusLogs = await listAuditLogs({
      organizationId: orgA,
      action: 'compliance.review.status_changed',
      entityId: review.id,
      limit: 5
    });

    expect(statusLogs.length).toBeGreaterThan(0);
    expect(statusLogs[0].metadata?.previousStatus).toBe('pending');
    expect(statusLogs[0].metadata?.newStatus).toBe('decided');
    expect(statusLogs[0].metadata?.notes).toBeUndefined();

    const report = await createComplianceReport({
      organizationId: orgA,
      userId: userA,
      supplierId: supplier.id,
      title: 'Audit compliance report'
    });

    const reportLogs = await listAuditLogs({
      organizationId: orgA,
      action: 'compliance.report.created',
      entityId: report.id,
      limit: 5
    });

    expect(reportLogs).toHaveLength(1);

    await deleteEvidence(evidence.id, {
      organizationId: orgA,
      userId: userA
    });

    const evidenceDeletedLogs = await listAuditLogs({
      organizationId: orgA,
      action: 'compliance.evidence.deleted',
      entityId: evidence.id,
      limit: 5
    });

    expect(evidenceDeletedLogs.length).toBeGreaterThan(0);

    const deleteResult = await deleteSupplier(supplier.id, {
      organizationId: orgA,
      userId: userA
    });

    expect(deleteResult.deleted).toBe(true);

    const deletedLogs = await listAuditLogs({
      organizationId: orgA,
      action: 'compliance.supplier.deleted',
      entityId: supplier.id,
      limit: 5
    });

    expect(deletedLogs.length).toBeGreaterThan(0);
  });
});
