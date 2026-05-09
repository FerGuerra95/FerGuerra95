export const DEMO_MA_CASE = {
  id: 'demo_ma_novatech_industrial_services',
  name: 'NovaTech Industrial Services',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),

  financials: {
    name: 'NovaTech Industrial Services',
    sector: 'Industria',
    geography: 'Spain / Western Europe',
    transactionType: 'Majority sale readiness review',
    revenue: '12400000',
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
    showAdvancedNotes: true,
    investmentThesis: [
      'Profitable industrial services platform with recurring maintenance revenue and cross-sell potential across Western Europe.',
      'Normalized EBITDA base is supported by management accounts, identified add-backs and moderate leverage.',
      'Strategic buyers may value operational density, technical workforce and synergy potential, subject to customer concentration review.'
    ],
    buyerMatching: [
      {
        name: 'Pan-European industrial services group',
        type: 'Strategic',
        fit: 'High potential',
        rationale: 'Likely to value regional density, technical service capacity and cross-selling synergies.'
      },
      {
        name: 'Lower-mid market private equity sponsor',
        type: 'Financial sponsor',
        fit: 'Selective',
        rationale: 'Potential platform or add-on thesis if retention, management depth and recurring revenue are validated.'
      },
      {
        name: 'Family office / long-term capital',
        type: 'Long-term capital',
        fit: 'Stable profile',
        rationale: 'May fit a cash-flow preservation mandate with operational improvement upside and moderate leverage.'
      }
    ],
    risksAndMitigants: [
      {
        risk: 'Customer concentration and contract renewals require confirmation.',
        severity: 'Medium',
        mitigant: 'Review top customer contracts, churn history and renewal pipeline before external circulation.'
      },
      {
        risk: 'Owner and senior technician dependency may affect transferability.',
        severity: 'Medium',
        mitigant: 'Validate second-line management, retention plan and key-person transition before buyer outreach.'
      },
      {
        risk: 'Working capital adjustment is negative versus target.',
        severity: 'Medium',
        mitigant: 'Define working capital peg and closing mechanism with adviser review.'
      }
    ],
    humanReviewNotes: [
      'Validate management accounts and EBITDA add-backs against source documentation.',
      'Confirm gross debt, cash and debt-like items before using the equity bridge externally.',
      'Review customer concentration, owner dependency and working capital peg with qualified advisers.'
    ],
    evidenceDocuments: [
      {
        id: 'doc_novatech_management_accounts_fy25',
        title: 'FY25 management accounts and EBITDA bridge',
        sourceType: 'financial_pack',
        status: 'verified',
        version: 'v1.0',
        uploadedAt: new Date().toISOString(),
        sourceIds: [
          'ma.financials.normalizedEbitda',
          'ma.financials.workingCapital',
          'ma.financials.growth'
        ]
      },
      {
        id: 'doc_novatech_market_multiples',
        title: 'Industrial services comparables and risk memo',
        sourceType: 'valuation_support',
        status: 'verified',
        version: 'v1.0',
        uploadedAt: new Date().toISOString(),
        sourceIds: [
          'ma.formula.adjustedMultiple',
          'ma.formula.dcf'
        ]
      },
      {
        id: 'doc_novatech_synergy_bridge',
        title: 'Post-deal synergy bridge',
        sourceType: 'integration_model',
        status: 'ready',
        version: 'v1.0',
        uploadedAt: new Date().toISOString(),
        sourceIds: ['ma.formula.synergyValue']
      }
    ]
  },

  snapshot: {
    equityBase: 5480000,
    evBase: 5720000,
    netDebt: 240000,
    normalizedEbitda: 925000,
    qualityScore: 76,
    adjustedMultiple: 6.2,
    netProceeds: 5170000,
    riskLevel: 'Moderate'
  }
};

export const ENTERPRISE_MA_DEMO_CASES = [
  DEMO_MA_CASE,
  {
    id: 'demo_ma_nordic_saas_platform',
    name: 'Nordic SaaS Platform',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    financials: {
      name: 'Nordic SaaS Platform',
      sector: 'Software / SaaS',
      revenue: '14800000',
      ebitda: '3600000',
      normalizedEbitda: '4200000',
      reportedEbitda: '3600000',
      addBacks: '600000',
      growth: '28',
      debt: '1800000',
      cash: '2400000',
      netDebt: '-600000',
      targetWC: '900000',
      actualWC: '1120000',
      ownerDependency: '18',
      clientConcentration: '24',
      recurringRevenue: '84',
      workingCapitalNeed: '18',
      regionHighRisk: '8',
      synergiesCost: '250000',
      synergiesRev: '420000',
      foundersEquity: '62',
      taxRate: '22',
      transactionFees: '2.4',
      leverageRatio: '0.4'
    },
    settings: {
      reportCurrency: 'EUR',
      riskMode: 'balanced',
      showAdvancedNotes: true,
      evidenceDocuments: [
        {
          id: 'doc_nordic_saas_arr_bridge',
          title: 'ARR bridge, cohort retention and gross margin pack',
          sourceType: 'financial_pack',
          status: 'verified',
          version: 'v1.0',
          uploadedAt: new Date().toISOString(),
          sourceIds: [
            'ma.financials.normalizedEbitda',
            'ma.financials.recurringRevenue',
            'ma.financials.growth'
          ]
        },
        {
          id: 'doc_nordic_saas_security_review',
          title: 'Product security, churn and customer concentration review',
          sourceType: 'commercial_due_diligence',
          status: 'ready',
          version: 'v1.0',
          uploadedAt: new Date().toISOString(),
          sourceIds: [
            'ma.risk.customerConcentration',
            'ma.risk.ownerDependency'
          ]
        }
      ]
    },
    snapshot: {
      equityBase: 37400000,
      evBase: 36800000,
      netDebt: -600000,
      normalizedEbitda: 4200000,
      qualityScore: 88,
      adjustedMultiple: 8.8,
      netProceeds: 36500000,
      riskLevel: 'Controlled'
    }
  },
  {
    id: 'demo_ma_family_precision_components',
    name: 'Family Precision Components',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    financials: {
      name: 'Family Precision Components',
      sector: 'Advanced Manufacturing',
      revenue: '32200000',
      ebitda: '5100000',
      normalizedEbitda: '5750000',
      reportedEbitda: '5100000',
      addBacks: '650000',
      growth: '9',
      debt: '6200000',
      cash: '1450000',
      netDebt: '4750000',
      targetWC: '2850000',
      actualWC: '2460000',
      ownerDependency: '64',
      clientConcentration: '31',
      recurringRevenue: '48',
      workingCapitalNeed: '42',
      regionHighRisk: '12',
      synergiesCost: '380000',
      synergiesRev: '520000',
      foundersEquity: '92',
      taxRate: '25',
      transactionFees: '2.8',
      leverageRatio: '1.1'
    },
    settings: {
      reportCurrency: 'EUR',
      riskMode: 'balanced',
      showAdvancedNotes: true,
      evidenceDocuments: [
        {
          id: 'doc_family_precision_qoe',
          title: 'Quality of earnings, owner adjustments and customer mix',
          sourceType: 'qoe_workbook',
          status: 'verified',
          version: 'v1.0',
          uploadedAt: new Date().toISOString(),
          sourceIds: [
            'ma.financials.normalizedEbitda',
            'ma.risk.ownerDependency',
            'ma.risk.customerConcentration'
          ]
        },
        {
          id: 'doc_family_precision_succession',
          title: 'Management succession and transition risk memo',
          sourceType: 'governance_review',
          status: 'ready',
          version: 'v1.0',
          uploadedAt: new Date().toISOString(),
          sourceIds: [
            'ma.risk.ownerDependency',
            'ma.formula.adjustedMultiple'
          ]
        }
      ]
    },
    snapshot: {
      equityBase: 35650000,
      evBase: 40400000,
      netDebt: 4750000,
      normalizedEbitda: 5750000,
      qualityScore: 63,
      adjustedMultiple: 7.0,
      netProceeds: 34400000,
      riskLevel: 'Moderate'
    }
  }
];

export const ENTERPRISE_MA_PIPELINE_DEALS = [
  {
    id: 'demo_ma_novatech_industrial_services',
    name: 'NovaTech Industrial Services',
    sector: 'Industrial Services',
    market: 'Spain / Portugal',
    stageId: 'ic-review',
    equityValue: 5480000,
    riskLabel: 'Moderate',
    priority: 'Review',
    priorityTone: 'review',
    owner: 'Southern Europe Desk',
    updatedLabel: 'Enterprise demo'
  },
  {
    id: 'demo_ma_nordic_saas_platform',
    name: 'Nordic SaaS Platform',
    sector: 'Software / SaaS',
    market: 'Nordics',
    stageId: 'nda',
    equityValue: 37400000,
    riskLabel: 'Controlled',
    priority: 'High',
    priorityTone: 'high',
    owner: 'Technology M&A',
    updatedLabel: 'Enterprise demo'
  },
  {
    id: 'demo_ma_family_precision_components',
    name: 'Family Precision Components',
    sector: 'Advanced Manufacturing',
    market: 'DACH / Italy',
    stageId: 'due-diligence',
    equityValue: 35650000,
    riskLabel: 'Moderate',
    priority: 'Watch',
    priorityTone: 'watch',
    owner: 'Family Business Desk',
    updatedLabel: 'Enterprise demo'
  }
];

export const ENTERPRISE_MA_DEAL_DETAILS = [
  {
    id: 'demo_ma_novatech_industrial_services',
    name: 'NovaTech Industrial Services',
    sourceLabel: 'Enterprise demo',
    sector: 'Industrial Services',
    market: 'Spain / Portugal',
    owner: 'Southern Europe Desk',
    stageId: 'ic-review',
    equityValue: 5480000,
    enterpriseValue: 5720000,
    ebitda: 925000,
    multiple: 6.2,
    qualityScore: 76,
    riskLabel: 'Moderate',
    updatedLabel: 'Enterprise demo'
  },
  {
    id: 'demo_ma_nordic_saas_platform',
    name: 'Nordic SaaS Platform',
    sourceLabel: 'Enterprise demo',
    sector: 'Software / SaaS',
    market: 'Nordics',
    owner: 'Technology M&A',
    stageId: 'nda',
    equityValue: 37400000,
    enterpriseValue: 36800000,
    ebitda: 4200000,
    multiple: 8.8,
    qualityScore: 88,
    riskLabel: 'Controlled',
    updatedLabel: 'Enterprise demo'
  },
  {
    id: 'demo_ma_family_precision_components',
    name: 'Family Precision Components',
    sourceLabel: 'Enterprise demo',
    sector: 'Advanced Manufacturing',
    market: 'DACH / Italy',
    owner: 'Family Business Desk',
    stageId: 'due-diligence',
    equityValue: 35650000,
    enterpriseValue: 40400000,
    ebitda: 5750000,
    multiple: 7.0,
    qualityScore: 63,
    riskLabel: 'Moderate',
    updatedLabel: 'Enterprise demo'
  }
];

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
