import { createSqliteEntityStore } from '../../storage/sqliteEntityStore.service.js';
import { allSql, fromJson } from '../../storage/sqliteStorage.js';
import { createHash } from 'node:crypto';
import { recordAuditLog } from '../audit/auditLog.service.js';
import { listAuditLogs } from '../audit/auditLog.service.js';
import { getMaCaseById, updateMaCase } from '../ma/cases.service.js';
import { listAlerts } from './alerts.service.js';
import { listEvidence } from './evidence.service.js';
import { listReviews } from './reviews.service.js';
import {
  getSupplierById,
  listSuppliers
} from './suppliers.service.js';
import { runDeterministicComplianceRules } from './ruleEngine.service.js';

const auditRunStore = createSqliteEntityStore(
  'compliance_audit_runs',
  'compliance_audit_run',
  {
    scope: 'portfolio',
    framework: 'all',
    status: 'completed',
    score: 0,
    criticalFindings: 0,
    payload: {}
  }
);

const ruleResultStore = createSqliteEntityStore(
  'compliance_rule_results',
  'compliance_rule_result',
  {
    status: 'warning',
    severity: 'medium',
    scoreImpact: 0,
    payload: {}
  }
);

const evidenceLinkStore = createSqliteEntityStore(
  'compliance_rule_evidence_links',
  'compliance_rule_evidence_link',
  {
    linkStatus: 'linked',
    citation: {}
  }
);

const maRiskImpactStore = createSqliteEntityStore(
  'compliance_ma_risk_impacts',
  'compliance_ma_risk_impact',
  {
    legalRiskScore: 0,
    ebitdaMultipleDelta: 0,
    rationale: '',
    payload: {}
  }
);

function mapComplianceRuleResultRow(row) {
  return {
    id: row.id,
    organizationId: row.organization_id,
    auditRunId: row.audit_run_id,
    supplierId: row.supplier_id,
    maCaseId: row.ma_case_id,
    ruleId: row.rule_id,
    framework: row.framework,
    controlRef: row.control_ref,
    status: row.status,
    severity: row.severity,
    scoreImpact: row.score_impact,
    title: row.title,
    explanation: row.explanation || '',
    requiredEvidenceType: row.required_evidence_type || '',
    payload: fromJson(row.payload_json, {}),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapComplianceEvidenceLinkRow(row) {
  return {
    id: row.id,
    organizationId: row.organization_id,
    ruleResultId: row.rule_result_id,
    evidenceId: row.evidence_id,
    linkStatus: row.link_status,
    citation: fromJson(row.citation_json, {}),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function listRuleResultsForAuditRunScoped(organizationId, auditRunId) {
  if (!normalizeText(organizationId) || !normalizeText(auditRunId)) return [];

  const rows = allSql(
    `
      SELECT *
      FROM compliance_rule_results
      WHERE organization_id = @organizationId
        AND audit_run_id = @auditRunId
      ORDER BY datetime(created_at) ASC
    `,
    {
      organizationId,
      auditRunId
    }
  );

  return rows.map(mapComplianceRuleResultRow);
}

function listEvidenceLinksForAuditRunScoped(organizationId, auditRunId) {
  if (!normalizeText(organizationId) || !normalizeText(auditRunId)) return [];

  const rows = allSql(
    `
      SELECT l.*
      FROM compliance_rule_evidence_links l
      INNER JOIN compliance_rule_results r
        ON r.id = l.rule_result_id
        AND r.organization_id = l.organization_id
      WHERE l.organization_id = @organizationId
        AND r.audit_run_id = @auditRunId
      ORDER BY datetime(l.created_at) ASC
    `,
    {
      organizationId,
      auditRunId
    }
  );

  return rows.map(mapComplianceEvidenceLinkRow);
}

function createError(message, status = 400, code = 'COMPLIANCE_AUDIT_ERROR') {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function normalizeText(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function normalizeScope(value) {
  const scope = normalizeText(value, 'portfolio').toLowerCase();

  return ['portfolio', 'supplier', 'ma_case'].includes(scope)
    ? scope
    : 'portfolio';
}

function normalizeFrameworks(value = []) {
  const rawItems = Array.isArray(value)
    ? value
    : normalizeText(value)
      .split(',')
      .map((item) => item.trim());
  const frameworks = rawItems
    .map((item) => normalizeText(item).toLowerCase())
    .filter((item) => ['gdpr', 'iso27001', 'soc2', 'csddd'].includes(item));

  return frameworks.length
    ? [...new Set(frameworks)]
    : ['gdpr', 'iso27001', 'soc2', 'csddd'];
}

function assertOrganizationScope(organizationId) {
  if (!normalizeText(organizationId)) {
    throw createError(
      'Scope de organizacion no definido. No se puede operar sin organizationId.',
      403,
      'INVALID_ORGANIZATION_SCOPE'
    );
  }
}

function assertUserScope(userId) {
  if (!normalizeText(userId)) {
    throw createError('Usuario no definido.', 403, 'USER_SCOPE_REQUIRED');
  }
}

function buildRunFrameworkLabel(frameworks = []) {
  return frameworks.length === 4 ? 'all' : frameworks.join(',');
}

function buildCitation(evidence = {}, result = {}) {
  return {
    evidenceId: evidence.id,
    title: evidence.title,
    sourceType: evidence.sourceType,
    sourceUrl: evidence.sourceUrl || '',
    confidence: evidence.confidence,
    ruleId: result.ruleId,
    controlRef: result.controlRef,
    excerpt: evidence.excerpt || ''
  };
}

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(',')}}`;
  }

  return JSON.stringify(value);
}

function buildDigest(value) {
  return createHash('sha256').update(stableStringify(value)).digest('hex');
}

export function calculateComplianceMultipleAdjustment({
  legalRiskScore = 0,
  criticalFindings = 0
} = {}) {
  const score = Number(legalRiskScore) || 0;
  const critical = Number(criticalFindings) || 0;

  if (critical >= 3 || score >= 85) return -1.25;
  if (score >= 70) return -0.8;
  if (score >= 55) return -0.45;
  if (score >= 35) return -0.2;

  return 0;
}

function buildMaImpactRationale({ summary, delta }) {
  if (delta === 0) {
    return 'Compliance risk does not require EBITDA multiple adjustment.';
  }

  return `Compliance risk score ${summary.score}/100 with ${summary.criticalFindings} critical findings applies ${delta.toFixed(2)}x EBITDA multiple adjustment.`;
}

async function loadScopedAuditInputs({
  organizationId,
  supplierId = ''
}) {
  assertOrganizationScope(organizationId);

  const [alerts, evidenceItems, reviews] = await Promise.all([
    listAlerts({ organizationId }),
    listEvidence({ organizationId }),
    listReviews({ organizationId })
  ]);

  if (supplierId) {
    const supplier = await getSupplierById(supplierId, {
      organizationId
    });

    if (!supplier) {
      throw createError(
        'Proveedor no encontrado para esta organizacion.',
        404,
        'SUPPLIER_NOT_FOUND'
      );
    }

    return {
      suppliers: [supplier],
      alerts,
      evidenceItems,
      reviews
    };
  }

  const suppliers = await listSuppliers({
    organizationId
  });

  return {
    suppliers,
    alerts,
    evidenceItems,
    reviews
  };
}

async function persistRuleResults({
  organizationId,
  userId,
  auditRunId,
  maCaseId = '',
  results = []
}) {
  const persistedResults = [];

  for (const result of results) {
    const persisted = await ruleResultStore.create({
      organizationId,
      userId,
      auditRunId,
      supplierId: result.supplierId || null,
      maCaseId: maCaseId || null,
      ruleId: result.ruleId,
      framework: result.framework,
      controlRef: result.controlRef,
      status: result.status,
      severity: result.severity,
      scoreImpact: result.scoreImpact,
      title: result.title,
      explanation: result.explanation,
      requiredEvidenceType: result.requiredEvidenceType,
      payload: {
        evidenceMatches: result.evidenceMatches || []
      }
    });
    const evidenceLinks = [];

    for (const evidence of result.evidenceMatches || []) {
      const link = await evidenceLinkStore.create({
        organizationId,
        userId,
        ruleResultId: persisted.id,
        evidenceId: evidence.id,
        linkStatus: result.status === 'passed' ? 'verified' : 'linked',
        citation: buildCitation(evidence, result)
      });

      evidenceLinks.push(link);
    }

    persistedResults.push({
      ...persisted,
      evidenceLinks
    });
  }

  return persistedResults;
}

async function persistMaRiskImpact({
  organizationId,
  userId,
  maCase,
  auditRun,
  summary,
  failedCriticalRules = []
}) {
  const updatedAt = new Date().toISOString();
  const delta = calculateComplianceMultipleAdjustment({
    legalRiskScore: summary.score,
    criticalFindings: summary.criticalFindings
  });
  const rationale = buildMaImpactRationale({
    summary,
    delta
  });
  const impact = await maRiskImpactStore.create({
    organizationId,
    userId,
    maCaseId: maCase.id,
    auditRunId: auditRun.id,
    legalRiskScore: summary.score,
    ebitdaMultipleDelta: delta,
    rationale,
    payload: {
      evidenceCoverage: summary.evidenceCoverage,
      failedFindings: summary.failedFindings,
      criticalFindings: summary.criticalFindings,
      failedCriticalRules
    }
  });

  await updateMaCase(
    maCase.id,
    {
      userId,
      settings: {
        ...(maCase.settings || {}),
        complianceRiskImpact: {
          auditRunId: auditRun.id,
          legalRiskScore: summary.score,
          criticalFindings: summary.criticalFindings,
          evidenceCoverage: summary.evidenceCoverage,
          ebitdaMultipleDelta: delta,
          rationale,
          requiresValuationRecalculation: true,
          valuationDirty: true,
          dirtyReason: 'compliance_audit_completed',
          dirtyAt: updatedAt,
          recalculationStatus: 'dirty',
          updatedAt
        },
        valuationRecalculation: {
          status: 'dirty',
          source: 'compliance',
          reason: 'compliance_audit_completed',
          auditRunId: auditRun.id,
          legalRiskScore: summary.score,
          requestedAt: updatedAt
        }
      }
    },
    {
      organizationId
    }
  );

  await recordAuditLog({
    organizationId,
    userId,
    action: 'compliance.ma_risk_impact.created',
    entityType: 'ma',
    entityId: maCase.id,
    metadata: {
      auditRunId: auditRun.id,
      legalRiskScore: summary.score,
      ebitdaMultipleDelta: delta
    }
  });

  return impact;
}

export async function runComplianceAudit(payload = {}) {
  assertOrganizationScope(payload.organizationId);
  assertUserScope(payload.userId);

  const organizationId = payload.organizationId;
  const userId = payload.userId;
  const supplierId = normalizeText(payload.supplierId);
  const maCaseId = normalizeText(payload.maCaseId);
  const frameworks = normalizeFrameworks(payload.frameworks || payload.framework);
  const scope = maCaseId
    ? 'ma_case'
    : supplierId
      ? 'supplier'
      : normalizeScope(payload.scope);
  const maCase = maCaseId
    ? await getMaCaseById(maCaseId, { organizationId })
    : null;

  if (maCaseId && !maCase) {
    throw createError(
      'Caso M&A no encontrado para esta organizacion.',
      404,
      'MA_CASE_NOT_FOUND'
    );
  }

  const inputs = await loadScopedAuditInputs({
    organizationId,
    supplierId
  });
  const execution = runDeterministicComplianceRules({
    ...inputs,
    frameworks
  });
  const failedCriticalRules = execution.results
    .filter(
      (item) =>
        item.severity === 'critical' &&
        item.status !== 'passed' &&
        item.status !== 'not_applicable'
    )
    .map((item) => item.ruleId);

  const auditRun = await auditRunStore.create({
    organizationId,
    userId,
    scope,
    framework: buildRunFrameworkLabel(execution.frameworks),
    status: 'completed',
    score: execution.summary.score,
    criticalFindings: execution.summary.criticalFindings,
    payload: {
      supplierId,
      maCaseId,
      frameworks: execution.frameworks,
      evidenceCoverage: execution.summary.evidenceCoverage,
      failedFindings: execution.summary.failedFindings,
      riskLevel: execution.summary.riskLevel,
      supplierCount: inputs.suppliers.length
    }
  });

  const results = await persistRuleResults({
    organizationId,
    userId,
    auditRunId: auditRun.id,
    maCaseId,
    results: execution.results
  });
  const maRiskImpact = maCase
    ? await persistMaRiskImpact({
        organizationId,
        userId,
        maCase,
        auditRun,
        summary: execution.summary,
        failedCriticalRules
      })
    : null;

  await recordAuditLog({
    organizationId,
    userId,
    action: 'compliance.audit_run.completed',
    entityType: 'compliance',
    entityId: auditRun.id,
    metadata: {
      scope,
      framework: auditRun.framework,
      score: auditRun.score,
      criticalFindings: auditRun.criticalFindings,
      maCaseId
    }
  });

  return {
    ...auditRun,
    summary: execution.summary,
    results,
    maRiskImpact
  };
}

export async function listComplianceAuditRuns(scope = {}) {
  assertOrganizationScope(scope.organizationId);

  return auditRunStore.listByOrganization(scope.organizationId);
}

export async function getComplianceAuditRunById(id, scope = {}) {
  assertOrganizationScope(scope.organizationId);

  const auditRun = await auditRunStore.getByIdForOrganization(
    normalizeText(id),
    scope.organizationId
  );

  if (!auditRun) return null;

  const results = listRuleResultsForAuditRunScoped(
    scope.organizationId,
    auditRun.id
  );
  const evidenceLinks = listEvidenceLinksForAuditRunScoped(
    scope.organizationId,
    auditRun.id
  );
  const linksByRuleResult = new Map();

  evidenceLinks.forEach((link) => {
    const items = linksByRuleResult.get(link.ruleResultId) || [];
    items.push(link);
    linksByRuleResult.set(link.ruleResultId, items);
  });

  return {
    ...auditRun,
    results: results.map((result) => ({
      ...result,
      evidenceLinks: linksByRuleResult.get(result.id) || []
    }))
  };
}

export async function buildComplianceAuditLedgerExport(id, scope = {}) {
  assertOrganizationScope(scope.organizationId);

  const auditRun = await getComplianceAuditRunById(id, {
    organizationId: scope.organizationId
  });

  if (!auditRun) return null;

  const auditTrail = await listAuditLogs({
    organizationId: scope.organizationId,
    entityType: 'compliance',
    entityId: auditRun.id,
    limit: 100
  });
  const generatedAt = new Date().toISOString();
  const ledgerContent = {
    version: 'compliance-ledger-v1',
    organizationId: scope.organizationId,
    auditRun: {
      id: auditRun.id,
      scope: auditRun.scope,
      framework: auditRun.framework,
      status: auditRun.status,
      score: auditRun.score,
      criticalFindings: auditRun.criticalFindings,
      payload: auditRun.payload || {},
      createdAt: auditRun.createdAt,
      updatedAt: auditRun.updatedAt,
      results: (auditRun.results || []).map((result) => ({
        id: result.id,
        ruleId: result.ruleId,
        framework: result.framework,
        controlRef: result.controlRef,
        status: result.status,
        severity: result.severity,
        scoreImpact: result.scoreImpact,
        title: result.title,
        explanation: result.explanation,
        requiredEvidenceType: result.requiredEvidenceType,
        supplierId: result.supplierId || '',
        maCaseId: result.maCaseId || '',
        evidenceLinks: (result.evidenceLinks || []).map((link) => ({
          id: link.id,
          evidenceId: link.evidenceId,
          linkStatus: link.linkStatus,
          citation: link.citation || {},
          createdAt: link.createdAt
        }))
      }))
    },
    auditTrail
  };
  const digestSha256 = buildDigest(ledgerContent);

  return {
    ...ledgerContent,
    generatedAt,
    digestIntegrityModel: 'CEO_OS_LEDGER_DIGEST_V1',
    digestSha256,
    integrityTag: `digest:${digestSha256}`,
    trustDisclaimer:
      'CEO OS DSS: reproducible deterministic digest over exported JSON payloads. Requires human reviewer validation — not cryptographic non-repudiation.',
    verificationHint:
      'Recalculate digestSha256 over version, organizationId, auditRun and auditTrail slices to verify manual edits.',
    /** @deprecated Use digestIntegrityModel + integrityTag. Kept for existing JSON parsers. */
    signatureAlgorithm:
      '(legacy label) deterministic SHA-256 digest export — aliases CEO_OS_LEDGER_DIGEST_V1',
    signer: 'CEO OS Compliance Ledger exporter',
    /** @deprecated Prefer integrityTag. */
    signature: `digest:${digestSha256}`,
    /** Auditor sandbox / DSS placeholder — reproducible verification uses digestSha256 instead. */
    simulatedSignatureAlgorithm: 'SIMULATED_SHA256_LEDGER_V1',
    simulatedLedgerSignature: `simulated_hmac_stub:${digestSha256}`,
    simulatedSigner: 'CEO OS External Auditor Sandbox (non-binding)'
  };
}

export async function listComplianceMaRiskImpacts(scope = {}) {
  assertOrganizationScope(scope.organizationId);

  const items = await maRiskImpactStore.listByOrganization(scope.organizationId);
  const maCaseId = normalizeText(scope.maCaseId);

  return maCaseId
    ? items.filter((item) => item.maCaseId === maCaseId)
    : items;
}

export default runComplianceAudit;
