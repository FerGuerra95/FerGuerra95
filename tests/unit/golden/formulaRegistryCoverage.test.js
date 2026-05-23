import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Formula Approval Gate coverage (C.13.2A foundation → C.13.2B inventory → C.13.2C enforcement).
 * Validates classified formula blocks in FORMULA_REGISTRY.md by lot — not 100% global registry.
 */

const REGISTRY_PATH = path.join(process.cwd(), 'docs/testing/FORMULA_REGISTRY.md');
const GOLDEN_PATH = path.join(process.cwd(), 'docs/testing/golden_inputs.json');

/** C.13.2A — foundation lot */
const LOT_A_FORMULA_IDS = [
  'FUNDING_RUNWAY_MONTHS',
  'COMPLIANCE_WEIGHTED_RISK',
  'COMPLIANCE_RESILIENCE',
  'COMPLIANCE_OPERATIONAL_RISK',
  'COMPLIANCE_OPERATIONAL_RESILIENCE'
];

/** C.13.2B — expansion inventory lot */
const LOT_B_FORMULA_IDS = [
  'EV_EBITDA',
  'NET_DEBT',
  'EQUITY_VALUE',
  'WATERFALL_SIMPLE',
  'POST_MONEY',
  'INVESTOR_OWNERSHIP',
  'PMI_CAPTURE_RATE',
  'BRIDGE_PRIORITY',
  'RISK_LIKELIHOOD_IMPACT',
  'REPORTING_VARIANCE',
  'EXEC_MODULE_HEALTH_AVG'
];

/** C.13.2C — all classified approval blocks (16) */
const ENFORCED_CLASSIFIED_FORMULA_IDS = [...LOT_A_FORMULA_IDS, ...LOT_B_FORMULA_IDS];

const MINIMUM_BLOCK_FIELDS = [
  'Formula ID',
  'Module',
  'Owner',
  'Source',
  'Status',
  'Approval',
  'Inputs',
  'Formula',
  'Usage limits'
];

const ALLOWED_PENDING_FRAGMENTS = [
  'Pending Golden Dataset',
  'Pending Formula Owner',
  'Pending external validation',
  'Pending C.13.x validation',
  'Pending C.13 validation',
  'Pending implementation',
  'Pending discovery',
  'Pending human approval',
  'Pending validation'
];

const APPROVED_SCOPE_PATTERNS = [
  /Approved for DSS\/demo scope/i,
  /Approved for reports\/export scope/i,
  /Approved for limited scope/i
];

const GOLDEN_NA_PATTERN = /N\/A/i;
const TEST_FILE_PENDING_PATTERN = /^pending\b/i;

function loadRegistry() {
  return fs.readFileSync(REGISTRY_PATH, 'utf8');
}

function loadGoldenDatasetIds() {
  const raw = fs.readFileSync(GOLDEN_PATH, 'utf8');
  const parsed = JSON.parse(raw);
  return new Set(Object.keys(parsed.datasets ?? {}));
}

function extractApprovalBlock(registryText, formulaId) {
  const header = `### ${formulaId}`;
  const start = registryText.indexOf(header);
  expect(start, `missing approval block header ${header}`).toBeGreaterThanOrEqual(0);

  const afterHeader = registryText.slice(start + header.length);
  const nextHeader = afterHeader.search(/\n### [A-Z0-9_]+/);
  return nextHeader === -1 ? afterHeader : afterHeader.slice(0, nextHeader);
}

function fieldPresent(block, fieldName) {
  const patterns = [
    new RegExp(`\\*\\*${fieldName}:\\*\\*`, 'i'),
    new RegExp(`\\*\\*${fieldName}\\*\\*`, 'i'),
    new RegExp(`^${fieldName}:`, 'im')
  ];
  return patterns.some((re) => re.test(block));
}

function extractFieldLine(block, fieldName) {
  const match = block.match(new RegExp(`\\*\\*${fieldName}:\\*\\*\\s*([^\\n]+)`, 'i'));
  return match ? match[1].trim() : '';
}

function extractGoldenIds(block) {
  const value = extractFieldLine(block, 'Golden ID');
  if (!value || GOLDEN_NA_PATTERN.test(value)) return [];

  const ids = [];
  for (const m of value.matchAll(/`([a-z][a-z0-9_]*)`/gi)) {
    ids.push(m[1]);
  }
  for (const token of value.match(/\b([a-z][a-z0-9_]{4,})\b/g) ?? []) {
    if (token.includes('_') && !['also', 'edge', 'case', 'pending'].includes(token)) {
      ids.push(token);
    }
  }
  return [...new Set(ids)];
}

function extractTestFilePath(block) {
  const value = extractFieldLine(block, 'Test file');
  if (!value || TEST_FILE_PENDING_PATTERN.test(value) || GOLDEN_NA_PATTERN.test(value)) {
    return null;
  }
  const match = value.match(/`(tests\/[^`]+)`/);
  return match ? match[1] : null;
}

function assertPendingStatusOrApprovalAllowed(formulaId, status, approval) {
  const combined = `${status} ${approval}`;
  if (!/Pending/i.test(combined)) return;

  const recognized = ALLOWED_PENDING_FRAGMENTS.some((fragment) => combined.includes(fragment));
  expect(recognized, `${formulaId}: unrecognized Pending in Status/Approval — ${combined}`).toBe(
    true
  );
}

function assertApprovalScopes(formulaId, approval) {
  const grantSegments = approval
    .split('·')
    .map((segment) => segment.trim())
    .filter((segment) => /^Approved for /i.test(segment));

  for (const segment of grantSegments) {
    const hasScopedApproval = APPROVED_SCOPE_PATTERNS.some((re) => re.test(segment));
    expect(
      hasScopedApproval,
      `${formulaId}: grant segment lacks recognized scope — ${segment}`
    ).toBe(true);
  }
}

describe('formulaRegistryCoverage — registry shell', () => {
  const registryText = loadRegistry();

  it('FORMULA_REGISTRY.md exists and documents Formula Approval Gate', () => {
    expect(fs.existsSync(REGISTRY_PATH)).toBe(true);
    expect(registryText).toMatch(/Formula Approval Gate/i);
  });

  it('documents C.13.2B inventory summary', () => {
    expect(registryText).toMatch(/Formula Approval Inventory summary \(C\.13\.2B\)/i);
  });

  it.each(ENFORCED_CLASSIFIED_FORMULA_IDS)('registry contains classified Formula ID %s', (formulaId) => {
    expect(registryText).toContain(formulaId);
  });
});

describe('formulaRegistryCoverage (C.13.2C enforcement — classified lot)', () => {
  const registryText = loadRegistry();
  const goldenIds = loadGoldenDatasetIds();

  describe('minimum metadata fields per classified formula', () => {
    it.each(ENFORCED_CLASSIFIED_FORMULA_IDS)('%s', (formulaId) => {
      const block = extractApprovalBlock(registryText, formulaId);
      for (const field of MINIMUM_BLOCK_FIELDS) {
        expect(fieldPresent(block, field), `${formulaId} missing ${field}`).toBe(true);
      }
      expect(extractFieldLine(block, 'Formula ID')).toContain(formulaId);
    });
  });

  describe('Status and Approval rules (Pending allowed; Approved requires scope)', () => {
    it.each(ENFORCED_CLASSIFIED_FORMULA_IDS)('%s', (formulaId) => {
      const block = extractApprovalBlock(registryText, formulaId);
      const status = extractFieldLine(block, 'Status');
      const approval = extractFieldLine(block, 'Approval');

      expect(status.length, `${formulaId} empty Status`).toBeGreaterThan(0);
      expect(approval.length, `${formulaId} empty Approval`).toBeGreaterThan(0);

      assertPendingStatusOrApprovalAllowed(formulaId, status, approval);
      assertApprovalScopes(formulaId, approval);
    });
  });

  describe('Golden IDs exist in golden_inputs.json when declared (N/A exempt)', () => {
    it.each(ENFORCED_CLASSIFIED_FORMULA_IDS)('%s', (formulaId) => {
      const block = extractApprovalBlock(registryText, formulaId);
      const declared = extractGoldenIds(block);

      for (const goldenId of declared) {
        expect(goldenIds.has(goldenId), `${formulaId}: missing golden ${goldenId}`).toBe(true);
      }

      if (GOLDEN_NA_PATTERN.test(extractFieldLine(block, 'Golden ID'))) {
        expect(declared.length, `${formulaId}: N/A golden must not list ids`).toBe(0);
      }
    });
  });

  describe('Test file paths exist when declared (pending exempt)', () => {
    it.each(ENFORCED_CLASSIFIED_FORMULA_IDS)('%s', (formulaId) => {
      const block = extractApprovalBlock(registryText, formulaId);
      const testPath = extractTestFilePath(block);

      if (TEST_FILE_PENDING_PATTERN.test(extractFieldLine(block, 'Test file'))) {
        expect(testPath, `${formulaId}: pending test file must not require path`).toBeNull();
        return;
      }

      if (testPath) {
        const absolute = path.join(process.cwd(), testPath);
        expect(fs.existsSync(absolute), `${formulaId}: missing ${testPath}`).toBe(true);
      }
    });
  });

  describe('operational compliance formulas document N/A golden', () => {
    it('COMPLIANCE_OPERATIONAL_RISK', () => {
      const block = extractApprovalBlock(registryText, 'COMPLIANCE_OPERATIONAL_RISK');
      expect(extractFieldLine(block, 'Golden ID')).toMatch(GOLDEN_NA_PATTERN);
    });

    it('COMPLIANCE_OPERATIONAL_RESILIENCE', () => {
      const block = extractApprovalBlock(registryText, 'COMPLIANCE_OPERATIONAL_RESILIENCE');
      expect(extractFieldLine(block, 'Golden ID')).toMatch(GOLDEN_NA_PATTERN);
    });
  });

  describe('lot A — golden anchors still declared (regression)', () => {
    it('FUNDING_RUNWAY_MONTHS declares funding_runway_zero_burn', () => {
      const block = extractApprovalBlock(registryText, 'FUNDING_RUNWAY_MONTHS');
      expect(extractGoldenIds(block)).toContain('funding_runway_zero_burn');
    });

    it('COMPLIANCE_WEIGHTED_RISK declares compliance_weighted_risk_score_basic', () => {
      const block = extractApprovalBlock(registryText, 'COMPLIANCE_WEIGHTED_RISK');
      expect(extractGoldenIds(block)).toContain('compliance_weighted_risk_score_basic');
    });

    it('COMPLIANCE_RESILIENCE declares compliance_resilience_score_basic', () => {
      const block = extractApprovalBlock(registryText, 'COMPLIANCE_RESILIENCE');
      expect(extractGoldenIds(block)).toContain('compliance_resilience_score_basic');
    });
  });
});
