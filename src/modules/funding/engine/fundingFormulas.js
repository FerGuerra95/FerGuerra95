import { clamp } from '../../../shared/utils/validators.js';
import { parseNumber } from '../../../shared/utils/parseNumber.js';

export const FUNDING_STORAGE_KEYS = {
  DRAFT: 'funding_workspace_draft_v1',
  SETTINGS: 'funding_workspace_settings_v1'
};

export const STAGE_OPTIONS = [
  { value: 'pre-seed', label: 'Pre-seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series-a', label: 'Series A' },
  { value: 'growth', label: 'Growth' }
];

export const DEFAULT_FUNDING_INPUTS = {
  companyName: 'Nova Industrial Growth S.L.',
  stage: 'seed',
  currentRevenue: '1200000',
  monthlyBurn: '80000',
  currentCash: '420000',
  targetRaise: '1500000',
  preMoneyValuation: '6000000',
  runwayMonthsTarget: '18',
  annualGrowthRate: '65',
  grossMargin: '72',
  teamSize: '18',
  dataRoomCompletion: '55',
  founderMarketFit: '80',
  investorInterest: '45',
  debtCapacity: '250000',
  founderOwnership: '78',
  existingInvestorOwnership: '12',
  optionPool: '10',
  hiringPlan: '6'
};

export const DEFAULT_FUNDING_SETTINGS = {
  reportCurrency: 'EUR',
  scenarioMode: 'balanced'
};

export function parseFundingInputs(inputs) {
  return {
    companyName: inputs.companyName || DEFAULT_FUNDING_INPUTS.companyName,
    stage: inputs.stage || DEFAULT_FUNDING_INPUTS.stage,
    currentRevenue: Math.max(0, parseNumber(inputs.currentRevenue)),
    monthlyBurn: Math.max(0, parseNumber(inputs.monthlyBurn)),
    currentCash: Math.max(0, parseNumber(inputs.currentCash)),
    targetRaise: Math.max(0, parseNumber(inputs.targetRaise)),
    preMoneyValuation: Math.max(0, parseNumber(inputs.preMoneyValuation)),
    runwayMonthsTarget: clamp(parseNumber(inputs.runwayMonthsTarget), 6, 36),
    annualGrowthRate: clamp(parseNumber(inputs.annualGrowthRate), -20, 200),
    grossMargin: clamp(parseNumber(inputs.grossMargin), 0, 100),
    teamSize: Math.max(1, Math.round(parseNumber(inputs.teamSize))),
    dataRoomCompletion: clamp(parseNumber(inputs.dataRoomCompletion), 0, 100),
    founderMarketFit: clamp(parseNumber(inputs.founderMarketFit), 0, 100),
    investorInterest: clamp(parseNumber(inputs.investorInterest), 0, 100),
    debtCapacity: Math.max(0, parseNumber(inputs.debtCapacity)),
    founderOwnership: clamp(parseNumber(inputs.founderOwnership), 0, 100),
    existingInvestorOwnership: clamp(parseNumber(inputs.existingInvestorOwnership), 0, 100),
    optionPool: clamp(parseNumber(inputs.optionPool), 0, 100),
    hiringPlan: Math.max(0, Math.round(parseNumber(inputs.hiringPlan)))
  };
}

export function buildUseOfFunds(stage, targetRaise) {
  const templates = {
    'pre-seed': { product: 45, goToMarket: 20, operations: 20, buffer: 15 },
    seed: { product: 35, goToMarket: 30, operations: 20, buffer: 15 },
    'series-a': { product: 25, goToMarket: 40, operations: 20, buffer: 15 },
    growth: { product: 18, goToMarket: 42, operations: 25, buffer: 15 }
  };

  const plan = templates[stage] || templates.seed;
  return Object.entries(plan).map(([key, pct]) => ({
    key,
    label:
      key === 'product'
        ? 'Producto & Tecnología'
        : key === 'goToMarket'
          ? 'Go-to-market'
          : key === 'operations'
            ? 'Operaciones'
            : 'Buffer de caja',
    pct,
    amount: targetRaise * (pct / 100)
  }));
}

export function calculateFundingCore(inputs) {
  const currentRunwayMonths =
    inputs.monthlyBurn > 0 ? inputs.currentCash / inputs.monthlyBurn : null;
  const postMoneyValuation = inputs.preMoneyValuation + inputs.targetRaise;
  const dilutionPct =
    postMoneyValuation > 0 ? (inputs.targetRaise / postMoneyValuation) * 100 : null;
  const runwayAfterRaiseMonths =
    inputs.monthlyBurn > 0
      ? (inputs.currentCash + inputs.targetRaise) / inputs.monthlyBurn
      : null;
  const bufferVsTargetMonths =
    runwayAfterRaiseMonths === null
      ? null
      : runwayAfterRaiseMonths - inputs.runwayMonthsTarget;

  const preRoundOwnershipTotal = inputs.founderOwnership + inputs.existingInvestorOwnership + inputs.optionPool;
  const normalizedFounderOwnership = preRoundOwnershipTotal > 0 ? (inputs.founderOwnership / preRoundOwnershipTotal) * 100 : 0;
  const normalizedExistingInvestorOwnership = preRoundOwnershipTotal > 0 ? (inputs.existingInvestorOwnership / preRoundOwnershipTotal) * 100 : 0;
  const normalizedOptionPool = preRoundOwnershipTotal > 0 ? (inputs.optionPool / preRoundOwnershipTotal) * 100 : 0;

  let postRoundOwnership;
  if (dilutionPct === null) {
    postRoundOwnership = {
      founders: null,
      existingInvestors: null,
      optionPool: null,
      newInvestors: null
    };
  } else {
    const legacyFactor = 1 - dilutionPct / 100;
    postRoundOwnership = {
      founders: normalizedFounderOwnership * legacyFactor,
      existingInvestors: normalizedExistingInvestorOwnership * legacyFactor,
      optionPool: normalizedOptionPool * legacyFactor,
      newInvestors: dilutionPct
    };
  }

  return {
    currentRunwayMonths,
    postMoneyValuation,
    dilutionPct,
    runwayAfterRaiseMonths,
    bufferVsTargetMonths,
    normalizedFounderOwnership,
    normalizedExistingInvestorOwnership,
    normalizedOptionPool,
    postRoundOwnership,
    useOfFunds: buildUseOfFunds(inputs.stage, inputs.targetRaise)
  };
}
