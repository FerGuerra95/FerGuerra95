export const DEMO_MA_CASE = {
  id: 'demo_ma_novatech_industrial_services',
  name: 'NovaTech Industrial Services',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),

  financials: {
    name: 'NovaTech Industrial Services',
    sector: 'Industria',
    reportedEbitda: '850000',
    addBacks: '75000',
    growth: '12',
    debt: '420000',
    cash: '180000',
    targetWC: '250000',
    actualWC: '210000',
    ownerDependency: '35',
    clientConcentration: '28',
    recurringRevenue: '65',
    workingCapitalNeed: '40',
    regionHighRisk: '15',
    synergiesCost: '90000',
    synergiesRev: '60000',
    foundersEquity: '70',
    taxRate: '25',
    transactionFees: '3',
    leverageRatio: '2.5'
  },

  settings: {
    reportCurrency: 'EUR',
    riskMode: 'balanced',
    showAdvancedNotes: true
  },

  snapshot: {
    equityBase: 0,
    evBase: 0,
    netDebt: 240000,
    normalizedEbitda: 925000,
    qualityScore: 0,
    adjustedMultiple: 0,
    netProceeds: 0,
    riskLevel: 'Demo'
  }
};

export const DEMO_COMPLIANCE_SUPPLIER = {
  id: 'demo_supplier_atlas_components_morocco',
  name: 'Atlas Components Morocco',
  country: 'Marruecos',
  region: 'África Norte',
  tier: 'Tier 2',
  sector: 'Industrial',
  criticality: 'Alta',
  spend: 380000,
  status: 'watchlist',
  riskScore: 74,
  resilienceScore: 58,
  createdAt: new Date().toISOString(),
  lastReviewAt: new Date().toISOString()
};

export const DEMO_COMPLIANCE_ALERT = {
  id: 'demo_alert_atlas_regional_risk',
  supplierId: 'demo_supplier_atlas_components_morocco',
  title: 'Aumento de riesgo operativo regional',
  category: 'Geopolitical Risk',
  severity: 'high',
  status: 'open',
  source: 'Country risk monitor',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  description:
    'Se detecta exposición relevante a una región con mayor presión logística y riesgo de continuidad. Requiere revisión humana y evidencia adicional antes de validar el expediente.'
};

export const DEMO_COMPLIANCE_EVIDENCE = {
  id: 'demo_evidence_atlas_supply_continuity',
  supplierId: 'demo_supplier_atlas_components_morocco',
  alertId: 'demo_alert_atlas_regional_risk',
  title: 'Nota interna de continuidad de suministro',
  sourceType: 'internal_note',
  sourceUrl: '',
  language: 'es',
  excerpt:
    'El proveedor concentra componentes críticos para la línea industrial. Se recomienda revisar alternativas, capacidad de sustitución y plan de continuidad.',
  translatedExcerpt: '',
  confidence: 0.82,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const DEMO_COMPLIANCE_REVIEW = {
  id: 'demo_review_atlas_regional_risk',
  alertId: 'demo_alert_atlas_regional_risk',
  supplierId: 'demo_supplier_atlas_components_morocco',
  status: 'pending',
  reviewer: '',
  decision: '',
  notes: '',
  createdAt: new Date().toISOString(),
  decidedAt: '',
  updatedAt: new Date().toISOString()
};

export const DEMO_FUNDING_INPUTS = {
  companyName: 'Nova Industrial Growth S.L.',
  stage: 'Seed',
  currentRevenue: '1200000',
  monthlyBurn: '80000',
  currentCash: '420000',
  targetRaise: '1500000',
  preMoneyValuation: '6000000',
  runwayMonthsTarget: '18',
  annualGrowthRate: '35',
  grossMargin: '62',
  dataRoomCompletion: '70',
  founderMarketFit: '85',
  investorInterest: '60',
  teamSize: '14',
  hiringPlan: '6',
  debtCapacity: '350000',
  founderOwnership: '78',
  existingInvestorOwnership: '12',
  optionPool: '10'
};

export const DEMO_FUNDING_SETTINGS = {
  reportCurrency: 'EUR',
  scenarioMode: 'balanced'
};

export const DEMO_LABELS = {
  maCaseName: 'NovaTech Industrial Services',
  complianceSupplierName: 'Atlas Components Morocco',
  fundingCompanyName: 'Nova Industrial Growth S.L.'
};