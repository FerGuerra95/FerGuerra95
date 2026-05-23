import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * C.13.2A — Formula Approval Gate minimum coverage.
 * Validates metadata presence for explicitly covered formulas only.
 * Does NOT require full registry completeness.
 */

const REGISTRY_PATH = path.join(process.cwd(), 'docs/testing/FORMULA_REGISTRY.md');
const GOLDEN_PATH = path.join(process.cwd(), 'docs/testing/golden_inputs.json');

const MINIMUM_FORMULA_IDS = [
  'FUNDING_RUNWAY_MONTHS',
  'COMPLIANCE_WEIGHTED_RISK',
  'COMPLIANCE_RESILIENCE',
  'COMPLIANCE_OPERATIONAL_RISK',
  'COMPLIANCE_OPERATIONAL_RESILIENCE'
];

const REQUIRED_BLOCK_FIELDS = [
  'Owner',
  'Source',
  'Status',
  'Inputs',
  'Formula',
  'Usage limits',
  'Approval'
];

const GOLDEN_BY_FORMULA = {
  FUNDING_RUNWAY_MONTHS: ['funding_runway_zero_burn'],
  COMPLIANCE_WEIGHTED_RISK: ['compliance_weighted_risk_score_basic'],
  COMPLIANCE_RESILIENCE: ['compliance_resilience_score_basic']
};

const TEST_FILE_BY_FORMULA = {
  FUNDING_RUNWAY_MONTHS: 'tests/unit/funding/fundingFormulas.test.js',
  COMPLIANCE_WEIGHTED_RISK: 'tests/unit/compliance/complianceWeightedRisk.test.js',
  COMPLIANCE_RESILIENCE: 'tests/unit/compliance/complianceGoldenResilience.test.js',
  COMPLIANCE_OPERATIONAL_RISK: 'tests/unit/compliance/compliancePrecedence.test.js',
  COMPLIANCE_OPERATIONAL_RESILIENCE: 'tests/unit/compliance/compliancePrecedence.test.js'
};

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
  const block = nextHeader === -1 ? afterHeader : afterHeader.slice(0, nextHeader);
  return block;
}

function fieldPresent(block, fieldName) {
  const patterns = [
    new RegExp(`\\*\\*${fieldName}:\\*\\*`, 'i'),
    new RegExp(`\\*\\*${fieldName}\\*\\*`, 'i'),
    new RegExp(`^${fieldName}:`, 'im')
  ];
  return patterns.some((re) => re.test(block));
}

function extractGoldenIds(block) {
  const match = block.match(/\*\*Golden ID:\*\*\s*([^\n]+)/i);
  if (!match) return [];
  const value = match[1].trim();
  if (/N\/A/i.test(value)) return [];
  const ids = [];
  const backtickMatches = value.matchAll(/`([a-z0-9_]+)`/gi);
  for (const m of backtickMatches) {
    ids.push(m[1]);
  }
  const plainMatches = value.match(/\b([a-z][a-z0-9_]*)\b/g) ?? [];
  for (const token of plainMatches) {
    if (token.includes('_') && !['also', 'edge', 'case'].includes(token)) {
      ids.push(token);
    }
  }
  return [...new Set(ids)];
}

/** C.13.2B — presence + Status/Approval only; no global golden/test mandate */
const EXPANSION_LOT_B_FORMULA_IDS = [
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

const LIGHT_BLOCK_FIELDS = ['Status', 'Approval'];

describe('formulaRegistryCoverage (C.13.2A)', () => {
  const registryText = loadRegistry();
  const goldenIds = loadGoldenDatasetIds();

  it('FORMULA_REGISTRY.md exists and documents Formula Approval Gate', () => {
    expect(fs.existsSync(REGISTRY_PATH)).toBe(true);
    expect(registryText).toMatch(/Formula Approval Gate/i);
  });

  it.each(MINIMUM_FORMULA_IDS)('registry contains Formula ID %s', (formulaId) => {
    expect(registryText).toContain(formulaId);
  });

  describe('minimum metadata per covered formula', () => {
    it.each(MINIMUM_FORMULA_IDS)('%s block has required fields', (formulaId) => {
      const block = extractApprovalBlock(registryText, formulaId);
      for (const field of REQUIRED_BLOCK_FIELDS) {
        expect(fieldPresent(block, field), `${formulaId} missing ${field}`).toBe(true);
      }
    });
  });

  describe('Golden Dataset IDs for formulas with golden oracle', () => {
    it.each(Object.entries(GOLDEN_BY_FORMULA))(
      '%s golden ids exist in golden_inputs.json',
      (formulaId, expectedIds) => {
        const block = extractApprovalBlock(registryText, formulaId);
        const declared = extractGoldenIds(block);
        for (const expected of expectedIds) {
          expect(declared, `${formulaId} should declare ${expected}`).toContain(expected);
          expect(goldenIds.has(expected), `golden_inputs missing ${expected}`).toBe(true);
        }
      }
    );
  });

  describe('operational formulas allow N/A golden', () => {
    it('COMPLIANCE_OPERATIONAL_RISK documents N/A golden', () => {
      const block = extractApprovalBlock(registryText, 'COMPLIANCE_OPERATIONAL_RISK');
      expect(block).toMatch(/Golden ID:.*N\/A/is);
    });

    it('COMPLIANCE_OPERATIONAL_RESILIENCE documents N/A golden', () => {
      const block = extractApprovalBlock(registryText, 'COMPLIANCE_OPERATIONAL_RESILIENCE');
      expect(block).toMatch(/Golden ID:.*N\/A/is);
    });
  });

  describe('declared test files exist on disk', () => {
    it.each(Object.entries(TEST_FILE_BY_FORMULA))(
      '%s test file exists',
      (formulaId, relativePath) => {
        const block = extractApprovalBlock(registryText, formulaId);
        expect(block).toContain(relativePath.replace(/\//g, '/'));
        const absolute = path.join(process.cwd(), relativePath);
        expect(fs.existsSync(absolute), `missing ${relativePath}`).toBe(true);
      }
    );
  });
});

describe('formulaRegistryCoverage (C.13.2B expansion lot)', () => {
  const registryText = loadRegistry();

  it('documents C.13.2B inventory summary', () => {
    expect(registryText).toMatch(/Formula Approval Inventory summary \(C\.13\.2B\)/i);
  });

  it.each(EXPANSION_LOT_B_FORMULA_IDS)('registry contains expansion Formula ID %s', (formulaId) => {
    expect(registryText).toContain(formulaId);
  });

  describe('expansion blocks have Status and Approval (pending allowed)', () => {
    it.each(EXPANSION_LOT_B_FORMULA_IDS)('%s', (formulaId) => {
      const block = extractApprovalBlock(registryText, formulaId);
      for (const field of LIGHT_BLOCK_FIELDS) {
        expect(fieldPresent(block, field), `${formulaId} missing ${field}`).toBe(true);
      }
      expect(block).toMatch(/Pending/i);
    });
  });
});
