import { clamp } from '../../../shared/utils/validators.js';
import { parseNumber } from '../../../shared/utils/parseNumber.js';

export const STORAGE_KEYS = {
  CASES: 'ma_mastery_cases_clean_v1',
  SETTINGS: 'ma_mastery_settings_clean_v1'
};

export const SECTOR_DATA = {
  'Software / SaaS': { mult: 6.8, risk: 0.1, esgRisk: 0.15, color: 'text-success' },
  Industria: { mult: 4.2, risk: 0.25, esgRisk: 0.65, color: 'text-info' },
  Servicios: { mult: 3.5, risk: 0.3, esgRisk: 0.3, color: 'text-warning' },
  Retail: { mult: 3.0, risk: 0.4, esgRisk: 0.8, color: 'text-danger' }
};

export const DEFAULT_SECTOR = 'Industria';

export const DEFAULT_FINANCIALS = {
  name: 'Industrial Systems S.A.',
  sector: DEFAULT_SECTOR,
  reportedEbitda: '450000',
  addBacks: '85000',
  growth: '12',
  debt: '120000',
  cash: '50000',
  targetWC: '100000',
  actualWC: '90000',
  ownerDependency: '35',
  clientConcentration: '25',
  recurringRevenue: '55',
  workingCapitalNeed: '18',
  regionHighRisk: '15',
  synergiesCost: '50000',
  synergiesRev: '120000',
  foundersEquity: '70',
  taxRate: '21',
  transactionFees: '3',
  leverageRatio: '3'
};

export const DEFAULT_SETTINGS = {
  reportCurrency: 'EUR',
  riskMode: 'balanced',
  showAdvancedNotes: true
};

export const ANALYSIS_STEPS = [
  { label: 'Ingestando métricas financieras y normalizando...', progress: 16 },
  { label: 'Ajustando Deuda Neta y Working Capital...', progress: 34 },
  { label: 'Auditando riesgo operativo y resiliencia...', progress: 52 },
  { label: 'Proyectando Cap Table y Waterfall...', progress: 74 },
  { label: 'Construyendo salida ejecutiva del deal...', progress: 89 },
  { label: 'Análisis completado', progress: 100 }
];

export function parseFinancialInputs(financials) {
  return {
    reportedEbitda: parseNumber(financials.reportedEbitda),
    addBacks: parseNumber(financials.addBacks),
    growth: parseNumber(financials.growth),
    debt: parseNumber(financials.debt),
    cash: parseNumber(financials.cash),
    targetWC: parseNumber(financials.targetWC),
    actualWC: parseNumber(financials.actualWC),
    ownerDependency: clamp(parseNumber(financials.ownerDependency), 0, 100),
    clientConcentration: clamp(parseNumber(financials.clientConcentration), 0, 100),
    recurringRevenue: clamp(parseNumber(financials.recurringRevenue), 0, 100),
    workingCapitalNeed: clamp(parseNumber(financials.workingCapitalNeed), 0, 100),
    regionHighRisk: clamp(parseNumber(financials.regionHighRisk), 0, 100),
    synergiesCost: parseNumber(financials.synergiesCost),
    synergiesRev: parseNumber(financials.synergiesRev),
    foundersEquity: clamp(parseNumber(financials.foundersEquity), 0, 100),
    taxRate: clamp(parseNumber(financials.taxRate), 0, 100),
    transactionFees: clamp(parseNumber(financials.transactionFees), 0, 100),
    leverageRatioSetting: Math.max(0, parseNumber(financials.leverageRatio))
  };
}

export function calculateCoreMetrics(inputs) {
  const normalizedEbitda = inputs.reportedEbitda + inputs.addBacks;
  const netDebt = inputs.debt - inputs.cash;
  const wcAdjustment = inputs.actualWC - inputs.targetWC;
  const leverageRatio = normalizedEbitda > 0 ? netDebt / normalizedEbitda : 0;

  return { normalizedEbitda, netDebt, wcAdjustment, leverageRatio };
}
