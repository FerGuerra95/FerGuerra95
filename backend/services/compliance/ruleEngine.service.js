const DOCUMENT_SOURCE_TYPES = new Set([
  'audit',
  'certification',
  'document',
  'external_report'
]);

const RULE_SEVERITY_IMPACT = {
  low: 6,
  medium: 12,
  high: 20,
  critical: 30
};

const DEFAULT_FRAMEWORKS = ['gdpr', 'iso27001', 'soc2', 'csddd'];

function clamp(value, min = 0, max = 100) {
  const number = Number(value);

  if (!Number.isFinite(number)) return min;
  if (number < min) return min;
  if (number > max) return max;

  return number;
}

function normalizeText(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function normalizeFrameworks(value = []) {
  const items = Array.isArray(value) ? value : [value];
  const frameworks = items
    .map((item) => normalizeText(item).toLowerCase())
    .filter((item) => DEFAULT_FRAMEWORKS.includes(item));

  return frameworks.length ? [...new Set(frameworks)] : DEFAULT_FRAMEWORKS;
}

function buildSearchText(item = {}) {
  return [
    item.title,
    item.sourceType,
    item.sourceUrl,
    item.excerpt,
    item.translatedExcerpt
  ]
    .map((value) => normalizeText(value).toLowerCase())
    .filter(Boolean)
    .join(' ');
}

function isDocumentEvidence(item = {}) {
  return DOCUMENT_SOURCE_TYPES.has(normalizeText(item.sourceType).toLowerCase());
}

function hasKeyword(text = '', keywords = []) {
  return keywords.some((keyword) => text.includes(keyword));
}

function getEvidenceConfidence(item = {}) {
  return clamp(Number(item.confidence ?? 0.7), 0, 1);
}

function findEvidenceMatches({
  supplierId = '',
  evidenceItems = [],
  keywords = [],
  minConfidence = 0.7
} = {}) {
  return evidenceItems
    .filter((item) => !supplierId || item.supplierId === supplierId)
    .filter(isDocumentEvidence)
    .filter((item) => getEvidenceConfidence(item) >= minConfidence)
    .filter((item) => hasKeyword(buildSearchText(item), keywords))
    .map((item) => ({
      id: item.id,
      title: item.title,
      sourceType: item.sourceType,
      sourceUrl: item.sourceUrl || '',
      confidence: getEvidenceConfidence(item),
      excerpt: item.excerpt || item.translatedExcerpt || ''
    }));
}

function hasOpenCriticalAlert({ supplier = {}, alerts = [] } = {}) {
  return alerts.some(
    (alert) =>
      alert.supplierId === supplier.id &&
      alert.status !== 'closed' &&
      alert.status !== 'discarded' &&
      normalizeText(alert.severity).toLowerCase() === 'critical'
  );
}

function isHighExposureSupplier(supplier = {}) {
  return (
    ['Alta', 'Crítica', 'Critica'].includes(supplier.criticality) ||
    supplier.tier === 'Tier 1' ||
    Number(supplier.spend || 0) >= 250000
  );
}

function evaluateEvidenceRule({
  rule,
  supplier,
  evidenceItems,
  alerts,
  reviews
}) {
  const applicability = rule.isApplicable
    ? rule.isApplicable({
        supplier,
        evidenceItems,
        alerts,
        reviews
      })
    : true;

  if (!applicability) {
    return {
      rule,
      supplierId: supplier?.id || '',
      status: 'not_applicable',
      scoreImpact: 0,
      evidenceMatches: [],
      explanation: rule.notApplicableExplanation || 'Control not applicable for this supplier.'
    };
  }

  const evidenceMatches = findEvidenceMatches({
    supplierId: supplier?.id || '',
    evidenceItems,
    keywords: rule.evidenceKeywords,
    minConfidence: rule.minConfidence
  });
  const passed = evidenceMatches.length > 0;
  const status = passed ? 'passed' : rule.failedStatus || 'failed';
  const scoreImpact = passed ? 0 : RULE_SEVERITY_IMPACT[rule.severity] || 12;

  return {
    rule,
    supplierId: supplier?.id || '',
    status,
    scoreImpact,
    evidenceMatches,
    explanation: passed ? rule.passedExplanation : rule.failedExplanation
  };
}

export const COMPLIANCE_RULES = Object.freeze([
  {
    id: 'gdpr-dpa-required',
    framework: 'gdpr',
    controlRef: 'GDPR Art. 28',
    severity: 'critical',
    title: 'Data Processing Agreement',
    requiredEvidenceType: 'dpa',
    minConfidence: 0.72,
    evidenceKeywords: [
      'dpa',
      'data processing agreement',
      'encargo de tratamiento',
      'processor agreement'
    ],
    passedExplanation: 'DPA evidence is linked and confidence threshold is met.',
    failedExplanation: 'No valid DPA document is linked for this supplier.'
  },
  {
    id: 'gdpr-breach-response-policy',
    framework: 'gdpr',
    controlRef: 'GDPR Art. 33',
    severity: 'high',
    title: 'Personal data breach response',
    requiredEvidenceType: 'incident_response_policy',
    minConfidence: 0.7,
    evidenceKeywords: [
      'breach response',
      'data breach',
      'incident response',
      'notificacion de brecha',
      'notificación de brecha'
    ],
    passedExplanation: 'Incident response evidence supports GDPR breach readiness.',
    failedExplanation: 'No breach response evidence is linked.'
  },
  {
    id: 'iso27001-access-control',
    framework: 'iso27001',
    controlRef: 'ISO 27001 A.5/A.8',
    severity: 'high',
    title: 'Access control policy',
    requiredEvidenceType: 'access_control_policy',
    minConfidence: 0.7,
    evidenceKeywords: [
      'access control',
      'iam',
      'identity access',
      'control de acceso',
      'least privilege'
    ],
    passedExplanation: 'Access control evidence is linked.',
    failedExplanation: 'No access control evidence is linked.'
  },
  {
    id: 'iso27001-risk-treatment',
    framework: 'iso27001',
    controlRef: 'ISO 27001 Clause 6.1.3',
    severity: 'medium',
    title: 'Risk treatment plan',
    requiredEvidenceType: 'risk_treatment_plan',
    minConfidence: 0.65,
    evidenceKeywords: [
      'risk treatment',
      'risk register',
      'plan de tratamiento',
      'registro de riesgos'
    ],
    passedExplanation: 'Risk treatment evidence is linked.',
    failedExplanation: 'No risk treatment plan evidence is linked.'
  },
  {
    id: 'soc2-independent-report',
    framework: 'soc2',
    controlRef: 'SOC 2 Trust Services Criteria',
    severity: 'high',
    title: 'Independent SOC 2 report',
    requiredEvidenceType: 'soc2_report',
    minConfidence: 0.75,
    evidenceKeywords: [
      'soc 2',
      'soc2',
      'trust services',
      'type ii',
      'type 2'
    ],
    passedExplanation: 'SOC 2 report evidence is linked.',
    failedExplanation: 'No SOC 2 report evidence is linked.'
  },
  {
    id: 'csddd-high-risk-supplier-review',
    framework: 'csddd',
    controlRef: 'CSDDD Due Diligence',
    severity: 'critical',
    title: 'High-risk supplier due diligence',
    requiredEvidenceType: 'supplier_due_diligence',
    minConfidence: 0.68,
    evidenceKeywords: [
      'due diligence',
      'human rights',
      'csddd',
      'supply chain audit',
      'auditoria proveedor',
      'auditoría proveedor'
    ],
    isApplicable({ supplier, alerts }) {
      return isHighExposureSupplier(supplier) || hasOpenCriticalAlert({
        supplier,
        alerts
      });
    },
    notApplicableExplanation: 'Supplier exposure does not require enhanced CSDDD review.',
    passedExplanation: 'Enhanced supplier due diligence evidence is linked.',
    failedExplanation: 'High-risk supplier lacks enhanced due diligence evidence.'
  }
]);

export function calculateExecutiveComplianceScore(results = []) {
  const applicableResults = results.filter(
    (item) => item.status !== 'not_applicable'
  );

  if (!applicableResults.length) {
    return {
      score: 0,
      evidenceCoverage: 100,
      criticalFindings: 0,
      failedFindings: 0,
      riskLevel: 'low'
    };
  }

  const totalImpact = applicableResults.reduce(
    (sum, item) => sum + Number(item.scoreImpact || 0),
    0
  );
  const linkedEvidenceResults = applicableResults.filter(
    (item) => item.evidenceMatches?.length > 0
  ).length;
  const evidenceCoverage = Math.round(
    (linkedEvidenceResults / applicableResults.length) * 100
  );
  const criticalFindings = applicableResults.filter(
    (item) => item.severity === 'critical' && item.status !== 'passed'
  ).length;
  const failedFindings = applicableResults.filter((item) =>
    ['failed', 'warning'].includes(item.status)
  ).length;
  const coveragePenalty = (100 - evidenceCoverage) * 0.25;
  const score = Math.round(
    clamp(totalImpact + criticalFindings * 8 + coveragePenalty, 0, 100)
  );

  return {
    score,
    evidenceCoverage,
    criticalFindings,
    failedFindings,
    riskLevel:
      score >= 76
        ? 'critical'
        : score >= 56
          ? 'high'
          : score >= 31
            ? 'medium'
            : 'low'
  };
}

export function runDeterministicComplianceRules({
  suppliers = [],
  evidenceItems = [],
  alerts = [],
  reviews = [],
  frameworks = DEFAULT_FRAMEWORKS
} = {}) {
  const selectedFrameworks = normalizeFrameworks(frameworks);
  const activeRules = COMPLIANCE_RULES.filter((rule) =>
    selectedFrameworks.includes(rule.framework)
  );

  const results = suppliers.flatMap((supplier) =>
    activeRules.map((rule) => {
      const evaluated = evaluateEvidenceRule({
        rule,
        supplier,
        evidenceItems,
        alerts,
        reviews
      });

      return {
        ruleId: rule.id,
        framework: rule.framework,
        controlRef: rule.controlRef,
        title: rule.title,
        severity: rule.severity,
        requiredEvidenceType: rule.requiredEvidenceType,
        supplierId: evaluated.supplierId,
        status: evaluated.status,
        scoreImpact: evaluated.scoreImpact,
        explanation: evaluated.explanation,
        evidenceMatches: evaluated.evidenceMatches
      };
    })
  );

  return {
    frameworks: selectedFrameworks,
    results,
    summary: calculateExecutiveComplianceScore(results)
  };
}

export default runDeterministicComplianceRules;
