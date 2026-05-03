const DEFAULT_CURRENCY = 'EUR';
const DEFAULT_COMPANY_NAME = 'Target Company';
const DEFAULT_BRAND_NAME = "CEO's OS";

function safeString(value, fallback = 'N/A') {
  if (value === null || value === undefined) return fallback;
  const text = String(value).trim();
  return text || fallback;
}

function firstDefined(...values) {
  return values.find((value) => value !== null && value !== undefined && value !== '');
}

function toNumber(value, fallback = 0) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value !== 'string') return fallback;

  const cleaned = value
    .replace(/[^\d,.-]/g, '')
    .replace(/\.(?=\d{3}(\D|$))/g, '')
    .replace(',', '.');

  const parsed = Number(cleaned);

  return Number.isFinite(parsed) ? parsed : fallback;
}

function firstNumber(...values) {
  for (const value of values) {
    if (value === null || value === undefined || value === '') continue;

    const parsed = toNumber(value, Number.NaN);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 0;
}

function toArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeBrandText(value, fallback = DEFAULT_BRAND_NAME) {
  return safeString(value, fallback)
    .replace(/CEO’s OS/g, DEFAULT_BRAND_NAME)
    .replace(/CEO\u2019s OS/g, DEFAULT_BRAND_NAME)
    .replace(/[“”]/g, '"')
    .replace(/[’]/g, "'");
}

export function formatCurrency(value, currency = DEFAULT_CURRENCY) {
  const amount = toNumber(value);

  try {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(amount);
  } catch {
    return `${Math.round(amount).toLocaleString('es-ES')} ${currency}`;
  }
}

export function formatMultiple(value) {
  return `${toNumber(value).toFixed(1)}x`;
}

export function formatPercent(value) {
  const parsed = toNumber(value);
  const normalized = Math.abs(parsed) <= 1 ? parsed * 100 : parsed;

  return `${normalized.toFixed(1)}%`;
}

export function sanitizeFileName(value, fallback = 'ma-report') {
  const normalized = safeString(value, fallback)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();

  return normalized || fallback;
}

function formatDate(value = new Date()) {
  const date = new Date(value);
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;

  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  }).format(safeDate);
}

function getMultiples(settings = {}, derived = {}) {
  const base = firstNumber(
    derived?.adjustedMultiple,
    derived?.selectedMultiple,
    derived?.multipleBase,
    derived?.multiples?.base,
    settings?.multipleBase,
    settings?.targetMultiple,
    5.5
  );

  const low = firstNumber(
    derived?.multipleLow,
    derived?.multiples?.low,
    settings?.multipleLow,
    base > 1 ? base - 1 : 4.5
  );

  const high = firstNumber(
    derived?.multipleHigh,
    derived?.multiples?.high,
    settings?.multipleHigh,
    base + 1
  );

  const ordered = [low, base, high]
    .filter((item) => Number.isFinite(item) && item > 0)
    .sort((a, b) => a - b);

  return {
    low: ordered[0] || 4.5,
    base: ordered[1] || ordered[0] || 5.5,
    high: ordered[2] || ordered[1] || 6.5
  };
}

function getDebtMode(financials = {}, derived = {}) {
  const grossDebtInput = firstDefined(
    financials?.grossDebt,
    financials?.debt,
    financials?.totalDebt,
    financials?.financialDebt,
    derived?.grossDebt,
    derived?.debt,
    derived?.totalDebt,
    derived?.financialDebt
  );

  const cashInput = firstDefined(
    financials?.cash,
    financials?.cashAndEquivalents,
    financials?.cashBalance,
    financials?.cashOnBalanceSheet,
    derived?.cash,
    derived?.cashAndEquivalents,
    derived?.cashBalance
  );

  const netDebtInput = firstDefined(
    financials?.netDebt,
    financials?.netFinancialDebt,
    derived?.netDebt,
    derived?.netFinancialDebt
  );

  const hasGrossDebtOrCash = grossDebtInput !== undefined || cashInput !== undefined;
  const hasNetDebt = netDebtInput !== undefined;

  const grossDebt = toNumber(grossDebtInput);
  const cash = toNumber(cashInput);

  if (hasGrossDebtOrCash) {
    return {
      mode: 'grossDebtAndCash',
      label: 'Gross debt and cash',
      grossDebt,
      cash,
      netDebt: grossDebt - cash
    };
  }

  if (hasNetDebt) {
    return {
      mode: 'netDebt',
      label: 'Net debt',
      grossDebt: 0,
      cash: 0,
      netDebt: toNumber(netDebtInput)
    };
  }

  return {
    mode: 'none',
    label: 'No debt adjustment',
    grossDebt: 0,
    cash: 0,
    netDebt: 0
  };
}

function getEbitdaAdjustments(financials = {}, derived = {}) {
  const rawAdjustments = [
    ...toArray(financials?.ebitdaAdjustments),
    ...toArray(financials?.adjustments),
    ...toArray(derived?.ebitdaAdjustments),
    ...toArray(derived?.adjustments)
  ];

  const items = rawAdjustments
    .map((item, index) => {
      if (typeof item === 'string') {
        return {
          id: `adjustment-${index + 1}`,
          label: item,
          amount: 0,
          note: 'Pending quantification by human review.'
        };
      }

      if (!item || typeof item !== 'object') return null;

      return {
        id: safeString(item.id, `adjustment-${index + 1}`),
        label: safeString(
          firstDefined(item.label, item.name, item.concept, item.title),
          `EBITDA Adjustment ${index + 1}`
        ),
        amount: toNumber(firstDefined(item.amount, item.value, item.impact)),
        note: safeString(
          firstDefined(item.note, item.description, item.rationale),
          'Normalized adjustment for preliminary analysis.'
        )
      };
    })
    .filter(Boolean);

  return {
    items,
    total: items.reduce((sum, item) => sum + item.amount, 0)
  };
}

function getBuyerMatching(settings = {}, derived = {}) {
  const rawBuyers = [
    ...toArray(derived?.buyerMatching),
    ...toArray(derived?.buyers),
    ...toArray(settings?.buyerMatching),
    ...toArray(settings?.buyers)
  ];

  const buyers = rawBuyers
    .map((buyer, index) => {
      if (typeof buyer === 'string') {
        return {
          id: `buyer-${index + 1}`,
          name: buyer,
          type: 'Strategic / Financial',
          fitScore: null,
          fit: 'To qualify',
          rationale: 'Potential buyer pending commercial and strategic qualification.'
        };
      }

      if (!buyer || typeof buyer !== 'object') return null;

      const fitScore = firstDefined(buyer.fitScore, buyer.score, buyer.matchScore, null);

      return {
        id: safeString(buyer.id, `buyer-${index + 1}`),
        name: safeString(firstDefined(buyer.name, buyer.buyerName, buyer.title), `Buyer ${index + 1}`),
        type: safeString(firstDefined(buyer.type, buyer.category, buyer.profile), 'Strategic / Financial'),
        fitScore,
        fit: fitScore !== null ? String(fitScore) : safeString(firstDefined(buyer.fit, buyer.match), 'To qualify'),
        rationale: safeString(
          firstDefined(buyer.rationale, buyer.description, buyer.notes),
          'Strategic fit pending validation with buyer appetite, ticket size and acquisition criteria.'
        )
      };
    })
    .filter(Boolean);

  if (buyers.length > 0) return buyers;

  return [
    {
      id: 'strategic-acquirer',
      name: 'Strategic acquirer',
      type: 'Strategic',
      fitScore: null,
      fit: 'High potential',
      rationale: 'Industrial buyer with potential operating, commercial or technology synergies.'
    },
    {
      id: 'financial-sponsor',
      name: 'Financial sponsor',
      type: 'Private Equity / Financial',
      fitScore: null,
      fit: 'Selective',
      rationale: 'Financial investor focused on growth, operational improvement and future exit optionality.'
    },
    {
      id: 'family-office',
      name: 'Family office / Long-term investor',
      type: 'Long-term capital',
      fitScore: null,
      fit: 'Stable profile',
      rationale: 'Patient capital profile with focus on recurring cash flow, stability and value preservation.'
    }
  ];
}

function getTextItems(value, fallback) {
  const items = toArray(value)
    .map((item) => {
      if (typeof item === 'string') return item;

      if (item && typeof item === 'object') {
        return safeString(firstDefined(item.text, item.label, item.title, item.description), '');
      }

      return '';
    })
    .filter(Boolean);

  return items.length > 0 ? items : fallback;
}

function getRisks(settings = {}, derived = {}) {
  const rawRisks = [
    ...toArray(derived?.risksAndMitigants),
    ...toArray(derived?.risks),
    ...toArray(settings?.risksAndMitigants),
    ...toArray(settings?.risks)
  ];

  const risks = rawRisks
    .map((item, index) => {
      if (typeof item === 'string') {
        return {
          id: `risk-${index + 1}`,
          risk: item,
          severity: 'To assess',
          mitigant: 'Pending specific review and mitigation plan.'
        };
      }

      if (!item || typeof item !== 'object') return null;

      return {
        id: safeString(item.id, `risk-${index + 1}`),
        risk: safeString(firstDefined(item.risk, item.title, item.label), `Risk ${index + 1}`),
        severity: safeString(firstDefined(item.severity, item.level, item.priority), 'To assess'),
        mitigant: safeString(
          firstDefined(item.mitigant, item.mitigation, item.response, item.notes),
          'Pending specific review and mitigation plan.'
        )
      };
    })
    .filter(Boolean);

  if (risks.length > 0) return risks;

  return [
    {
      id: 'quality-of-earnings',
      risk: 'Quality and sustainability of normalized EBITDA.',
      severity: 'High',
      mitigant: 'Perform human review, source validation and quality of earnings analysis.'
    },
    {
      id: 'working-capital',
      risk: 'Potential working capital adjustment at closing.',
      severity: 'Medium',
      mitigant: 'Define working capital peg, review seasonality and document the closing adjustment mechanism.'
    },
    {
      id: 'debt-cash',
      risk: 'Confirmation of debt, cash and debt-like items.',
      severity: 'High',
      mitigant: 'Validate financial debt, cash availability, contingent liabilities and debt-like items.'
    }
  ];
}

function getWaterfallTone(type) {
  if (type === 'addition') return 'positive';
  if (type === 'deduction') return 'negative';
  if (type === 'total') return 'highlight';

  return 'neutral';
}

function buildExecutiveSummary({
  companyName,
  sector,
  geography,
  transactionType,
  revenue,
  adjustedEbitda,
  ebitdaMargin,
  multiples,
  evBase,
  equityBase,
  debtMode,
  currency
}) {
  return [
    `${companyName} has been reviewed under a preliminary ${transactionType} framework in the ${sector} sector.`,
    `The current valuation view uses adjusted EBITDA of ${formatCurrency(adjustedEbitda, currency)} and a base multiple of ${formatMultiple(multiples.base)}.`,
    `The base case Enterprise Value is ${formatCurrency(evBase, currency)}, with a base case Equity Value of ${formatCurrency(equityBase, currency)} after the selected debt and equity bridge treatment.`,
    `Revenue is currently shown at ${formatCurrency(revenue, currency)}, with an adjusted EBITDA margin of ${formatPercent(ebitdaMargin)}.`,
    `Debt treatment used in the bridge: ${debtMode.label}. Human review is required before external circulation.`
  ];
}

export function formatMAReportData({
  financials = {},
  settings = {},
  derived = {},
  generatedBy = DEFAULT_BRAND_NAME,
  organizationName = DEFAULT_BRAND_NAME,
  reportStatus = 'Draft'
} = {}) {
  const generatedAt = new Date();
  const safeGeneratedBy = normalizeBrandText(generatedBy, DEFAULT_BRAND_NAME);
  const safeOrganizationName = normalizeBrandText(organizationName, DEFAULT_BRAND_NAME);

  const currency = safeString(
    firstDefined(financials?.currency, settings?.currency, derived?.currency),
    DEFAULT_CURRENCY
  ).toUpperCase();

  const companyName = safeString(
    firstDefined(
      financials?.name,
      financials?.companyName,
      financials?.targetCompanyName,
      settings?.companyName,
      settings?.targetCompanyName,
      derived?.companyName
    ),
    DEFAULT_COMPANY_NAME
  );

  const sector = safeString(
    firstDefined(financials?.sector, settings?.sector, derived?.sector),
    'Sector not specified'
  );

  const geography = safeString(
    firstDefined(
      financials?.geography,
      financials?.country,
      settings?.geography,
      derived?.geography
    ),
    'Geography not specified'
  );

  const transactionType = safeString(
    firstDefined(financials?.transactionType, settings?.transactionType, derived?.transactionType),
    'M&A preliminary assessment'
  );

  const revenue = firstNumber(
    financials?.revenue,
    financials?.sales,
    financials?.netSales,
    financials?.ltmRevenue,
    derived?.revenue,
    derived?.ltmRevenue
  );

  const ebitdaAdjustments = getEbitdaAdjustments(financials, derived);

  const rawEbitda = firstNumber(
    financials?.ebitda,
    financials?.reportedEbitda,
    financials?.ltmEbitda,
    derived?.reportedEbitda
  );

  const adjustedEbitda = firstNumber(
    derived?.normalizedEbitda,
    derived?.adjustedEbitda,
    derived?.valuationEbitda,
    financials?.normalizedEbitda,
    financials?.adjustedEbitda,
    rawEbitda + ebitdaAdjustments.total
  );

  const multiples = getMultiples(settings, derived);
  const debtMode = getDebtMode(financials, derived);

  const workingCapitalAdjustment = firstNumber(
    financials?.workingCapitalAdjustment,
    financials?.nwcAdjustment,
    derived?.workingCapitalAdjustment,
    derived?.nwcAdjustment
  );

  const otherAdjustments = firstNumber(
    financials?.otherAdjustments,
    financials?.equityBridgeAdjustments,
    derived?.otherAdjustments
  );

  const evLow = firstNumber(
    derived?.enterpriseValueLow,
    derived?.evLow,
    adjustedEbitda * multiples.low
  );

  const evBase = firstNumber(
    derived?.enterpriseValue,
    derived?.enterpriseValueBase,
    derived?.evBase,
    adjustedEbitda * multiples.base
  );

  const evHigh = firstNumber(
    derived?.enterpriseValueHigh,
    derived?.evHigh,
    adjustedEbitda * multiples.high
  );

  const calculateEquity = (enterpriseValue) => {
    if (debtMode.mode === 'grossDebtAndCash') {
      return enterpriseValue - debtMode.grossDebt + debtMode.cash + workingCapitalAdjustment + otherAdjustments;
    }

    if (debtMode.mode === 'netDebt') {
      return enterpriseValue - debtMode.netDebt + workingCapitalAdjustment + otherAdjustments;
    }

    return enterpriseValue + workingCapitalAdjustment + otherAdjustments;
  };

  const equityLow = firstNumber(
    derived?.equityValueLow,
    calculateEquity(evLow)
  );

  const equityBase = firstNumber(
    derived?.equityValue,
    derived?.equityValueBase,
    derived?.equityBase,
    calculateEquity(evBase)
  );

  const equityHigh = firstNumber(
    derived?.equityValueHigh,
    calculateEquity(evHigh)
  );

  const netProceeds = firstNumber(
    derived?.netProceeds,
    derived?.sellerProceeds,
    equityBase
  );

  const qualityScore = firstNumber(
    derived?.qualityScore,
    derived?.score,
    0
  );

  const ebitdaMargin = revenue !== 0
    ? adjustedEbitda / revenue
    : firstNumber(derived?.ebitdaMargin);

  const bridgeLogic =
    debtMode.mode === 'grossDebtAndCash'
      ? 'Equity Value = Enterprise Value - Gross Debt + Cash + Working Capital Adjustment + Other Adjustments'
      : debtMode.mode === 'netDebt'
        ? 'Equity Value = Enterprise Value - Net Debt + Working Capital Adjustment + Other Adjustments'
        : 'Equity Value = Enterprise Value + Working Capital Adjustment + Other Adjustments';

  const waterfall = [
    {
      label: 'Enterprise Value',
      description: 'Enterprise value derived from normalized EBITDA and the selected multiple range.',
      low: evLow,
      base: evBase,
      high: evHigh,
      value: formatCurrency(evBase, currency),
      type: 'base',
      tone: 'neutral'
    },
    ...(debtMode.mode === 'grossDebtAndCash'
      ? [
          {
            label: 'Less: Gross Debt',
            description: 'Gross financial debt deducted from Enterprise Value.',
            low: -Math.abs(debtMode.grossDebt),
            base: -Math.abs(debtMode.grossDebt),
            high: -Math.abs(debtMode.grossDebt),
            value: formatCurrency(-Math.abs(debtMode.grossDebt), currency),
            type: 'deduction',
            tone: 'negative'
          },
          {
            label: 'Add: Cash',
            description: 'Cash and cash equivalents added to Equity Value.',
            low: debtMode.cash,
            base: debtMode.cash,
            high: debtMode.cash,
            value: formatCurrency(debtMode.cash, currency),
            type: 'addition',
            tone: 'positive'
          }
        ]
      : []),
    ...(debtMode.mode === 'netDebt'
      ? [
          {
            label: 'Less: Net Debt',
            description: 'Net financial debt deducted from Enterprise Value. No additional cash is added to avoid double counting.',
            low: -Math.abs(debtMode.netDebt),
            base: -Math.abs(debtMode.netDebt),
            high: -Math.abs(debtMode.netDebt),
            value: formatCurrency(-Math.abs(debtMode.netDebt), currency),
            type: 'deduction',
            tone: 'negative'
          }
        ]
      : []),
    {
      label: 'Working Capital Adjustment',
      description: 'Preliminary working capital adjustment.',
      low: workingCapitalAdjustment,
      base: workingCapitalAdjustment,
      high: workingCapitalAdjustment,
      value: formatCurrency(workingCapitalAdjustment, currency),
      type: workingCapitalAdjustment >= 0 ? 'addition' : 'deduction',
      tone: getWaterfallTone(workingCapitalAdjustment >= 0 ? 'addition' : 'deduction')
    },
    {
      label: 'Other Equity Adjustments',
      description: 'Other adjustments bridging Enterprise Value to Equity Value.',
      low: otherAdjustments,
      base: otherAdjustments,
      high: otherAdjustments,
      value: formatCurrency(otherAdjustments, currency),
      type: otherAdjustments >= 0 ? 'addition' : 'deduction',
      tone: getWaterfallTone(otherAdjustments >= 0 ? 'addition' : 'deduction')
    },
    {
      label: 'Equity Value',
      description: 'Estimated shareholder value after debt, cash, working capital and other adjustments.',
      low: equityLow,
      base: equityBase,
      high: equityHigh,
      value: formatCurrency(equityBase, currency),
      type: 'total',
      tone: 'highlight'
    }
  ];

  const buyerMatching = getBuyerMatching(settings, derived);
  const risksAndMitigants = getRisks(settings, derived);

  const investmentThesis = getTextItems(
    firstDefined(derived?.investmentThesis, settings?.investmentThesis),
    [
      'Potential value creation platform through growth, operational improvement or sector consolidation.',
      'Preliminary valuation supported by normalized EBITDA and selected market multiple range.',
      'Opportunity remains subject to document validation, human review and qualified buyer feedback.'
    ]
  );

  const humanReviewNotes = getTextItems(
    firstDefined(derived?.humanReviewNotes, settings?.humanReviewNotes),
    [
      'This report is preliminary and must be reviewed by a professional before external circulation.',
      'Figures depend on the quality of user-provided financial inputs and supporting documentation.',
      'This report does not constitute financial, legal, tax or investment advice, nor a fairness opinion.'
    ]
  );

  const preliminaryCIM = [
    {
      title: 'Business Overview',
      content: `${companyName} operates in the ${sector} sector. The preliminary narrative should be completed with business model, customer base, channels, management team and competitive positioning.`
    },
    {
      title: 'Market Context',
      content: `Market context should be validated with external sources, sector comparables and competitive dynamics in ${geography}.`
    },
    {
      title: 'Transaction Rationale',
      content: `The transaction is currently framed as ${transactionType}. Rationale should be validated against seller objectives, buyer universe, expected structure and closing conditions.`
    },
    {
      title: 'Financial Overview',
      content: 'Financial information is preliminary and should be completed with historical financial statements, EBITDA adjustments, debt, cash, working capital and growth assumptions.'
    }
  ];

  const companySnapshot = [
    { label: 'Company', value: companyName },
    { label: 'Sector', value: sector },
    { label: 'Geography', value: geography },
    { label: 'Currency', value: currency },
    { label: 'Revenue', value: formatCurrency(revenue, currency) },
    { label: 'Adjusted EBITDA', value: formatCurrency(adjustedEbitda, currency) },
    { label: 'Adjusted EBITDA Margin', value: formatPercent(ebitdaMargin) }
  ];

  const transactionOverview = [
    { label: 'Transaction Type', value: transactionType },
    { label: 'Report Status', value: safeString(reportStatus, 'Draft') },
    { label: 'Generated By', value: safeGeneratedBy },
    { label: 'Organization', value: safeOrganizationName },
    { label: 'Generated Date', value: formatDate(generatedAt) }
  ];

  const financialInputs = [
    { label: 'Revenue', value: revenue, formattedValue: formatCurrency(revenue, currency) },
    { label: 'Reported EBITDA', value: rawEbitda, formattedValue: formatCurrency(rawEbitda, currency) },
    { label: 'EBITDA Adjustments', value: ebitdaAdjustments.total, formattedValue: formatCurrency(ebitdaAdjustments.total, currency) },
    { label: 'Adjusted EBITDA', value: adjustedEbitda, formattedValue: formatCurrency(adjustedEbitda, currency) },
    { label: 'Gross Debt', value: debtMode.grossDebt, formattedValue: formatCurrency(debtMode.grossDebt, currency) },
    { label: 'Cash', value: debtMode.cash, formattedValue: formatCurrency(debtMode.cash, currency) },
    { label: 'Net Debt', value: debtMode.netDebt, formattedValue: formatCurrency(debtMode.netDebt, currency) },
    { label: 'Working Capital Adjustment', value: workingCapitalAdjustment, formattedValue: formatCurrency(workingCapitalAdjustment, currency) },
    { label: 'Other Adjustments', value: otherAdjustments, formattedValue: formatCurrency(otherAdjustments, currency) }
  ];

  const valuationRangeArray = [
    {
      scenario: 'Low Case',
      label: 'Low Case',
      multiple: formatMultiple(multiples.low),
      enterpriseValue: formatCurrency(evLow, currency),
      equityValue: formatCurrency(equityLow, currency),
      value: formatCurrency(evLow, currency)
    },
    {
      scenario: 'Base Case',
      label: 'Base Case',
      multiple: formatMultiple(multiples.base),
      enterpriseValue: formatCurrency(evBase, currency),
      equityValue: formatCurrency(equityBase, currency),
      value: formatCurrency(evBase, currency)
    },
    {
      scenario: 'High Case',
      label: 'High Case',
      multiple: formatMultiple(multiples.high),
      enterpriseValue: formatCurrency(evHigh, currency),
      equityValue: formatCurrency(equityHigh, currency),
      value: formatCurrency(evHigh, currency)
    }
  ];

  const appendix = [
    { label: 'Currency', value: currency },
    { label: 'Valuation methodology', value: 'Adjusted EBITDA Multiple' },
    { label: 'Multiple range', value: `${formatMultiple(multiples.low)} / ${formatMultiple(multiples.base)} / ${formatMultiple(multiples.high)}` },
    { label: 'Debt treatment', value: bridgeLogic },
    { label: 'Data source', value: 'User-provided financial inputs' },
    { label: 'Review status', value: 'Human review required' }
  ];

  const fileName = `${sanitizeFileName(companyName)}-ma-report-${generatedAt.toISOString().slice(0, 10)}.html`;
  const reportTitle = `${companyName} - M&A Preliminary Valuation Report`;
  const valuationRangeHeadline = `${formatCurrency(evLow, currency)} - ${formatCurrency(evHigh, currency)}`;

  return {
    title: 'M&A Professional Report',
    subtitle: 'Strategic valuation and transaction review prepared for internal decision-making.',
    companyName,
    targetName: companyName,
    organizationName: safeOrganizationName,
    generatedBy: safeGeneratedBy,
    reportStatus: safeString(reportStatus, 'Draft'),
    reportDate: formatDate(generatedAt),
    valuationRangeHeadline,
    valuationHeadline: valuationRangeHeadline,
    riskSignal: safeString(derived?.riskLevel?.label || derived?.riskLevel, 'Moderate'),
    executiveSummary: buildExecutiveSummary({
      companyName,
      sector,
      geography,
      transactionType,
      revenue,
      adjustedEbitda,
      ebitdaMargin,
      multiples,
      evBase,
      equityBase,
      debtMode,
      currency
    }),
    companySnapshot,
    transactionOverview,
    financialInputs,
    ebitdaAdjustments: ebitdaAdjustments.items.map((item) => ({
      ...item,
      value: formatCurrency(item.amount, currency),
      impact: formatCurrency(item.amount, currency),
      comment: item.note
    })),
    valuationRange: valuationRangeArray,
    enterpriseValue: {
      low: evLow,
      base: evBase,
      high: evHigh,
      value: formatCurrency(evBase, currency),
      headline: formatCurrency(evBase, currency),
      method: 'Adjusted EBITDA Multiple',
      ebitda: formatCurrency(adjustedEbitda, currency),
      multiple: formatMultiple(multiples.base)
    },
    equityValue: {
      low: equityLow,
      base: equityBase,
      high: equityHigh,
      value: formatCurrency(equityBase, currency),
      headline: formatCurrency(equityBase, currency),
      debtBasis: debtMode.label,
      workingCapitalAdjustment: formatCurrency(workingCapitalAdjustment, currency),
      otherAdjustments: formatCurrency(otherAdjustments, currency),
      bridgeLogic
    },
    waterfall,
    buyerMatching,
    investmentThesis,
    risksMitigants: risksAndMitigants,
    risksAndMitigants,
    preliminaryCim: preliminaryCIM,
    preliminaryCIM,
    humanReviewNotes,
    appendix,
    disclaimer:
      "DSS Disclaimer: This document is a preliminary decision-support output generated within CEO's OS for internal strategic use only. It does not constitute legal, tax, audit, accounting or investment advice. All conclusions remain subject to human review, source validation, confirmatory due diligence and final approval.",
    meta: {
      reportTitle,
      companyName,
      generatedBy: safeGeneratedBy,
      organizationName: safeOrganizationName,
      reportStatus: safeString(reportStatus, 'Draft'),
      generatedAt: generatedAt.toISOString(),
      generatedDateLabel: formatDate(generatedAt),
      currency,
      fileName
    },
    company: {
      name: companyName,
      sector,
      geography
    },
    transaction: {
      type: transactionType,
      status: safeString(reportStatus, 'Draft')
    },
    summary: {
      revenue,
      rawEbitda,
      adjustedEbitda,
      ebitdaMargin,
      multipleLow: multiples.low,
      multipleBase: multiples.base,
      multipleHigh: multiples.high,
      enterpriseValueLow: evLow,
      enterpriseValueBase: evBase,
      enterpriseValueHigh: evHigh,
      equityValueLow: equityLow,
      equityValueBase: equityBase,
      equityValueHigh: equityHigh,
      netProceeds,
      qualityScore,
      debtMode: debtMode.mode
    },
    sections: {
      companySnapshot,
      transactionOverview,
      financialInputs,
      ebitdaAdjustments: {
        items: ebitdaAdjustments.items,
        total: ebitdaAdjustments.total,
        adjustedEbitda
      },
      valuationRange: {
        multiples,
        enterpriseValue: {
          low: evLow,
          base: evBase,
          high: evHigh
        },
        equityValue: {
          low: equityLow,
          base: equityBase,
          high: equityHigh
        }
      },
      enterpriseValue: {
        low: evLow,
        base: evBase,
        high: evHigh
      },
      equityValue: {
        low: equityLow,
        base: equityBase,
        high: equityHigh,
        bridgeLogic
      },
      waterfall,
      buyerMatching,
      investmentThesis,
      risksAndMitigants,
      preliminaryCIM,
      humanReviewNotes,
      appendix
    }
  };
}

export default formatMAReportData;