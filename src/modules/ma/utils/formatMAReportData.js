const DEFAULT_CURRENCY = 'EUR';

function safeText(value, fallback = 'N/A') {
  if (value === null || value === undefined) return fallback;
  const text = String(value).trim();
  return text || fallback;
}

function firstDefined(...values) {
  return values.find((value) => value !== null && value !== undefined && value !== '');
}

function toNumber(value, fallback = 0) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : fallback;
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
    if (Number.isFinite(parsed)) return parsed;
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
  return safeText(value, fallback)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

function formatDate(value = new Date()) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    }).format(new Date());
  }

  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  }).format(date);
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
    derived?.grossDebt,
    derived?.debt,
    derived?.totalDebt
  );

  const cashInput = firstDefined(
    financials?.cash,
    financials?.cashAndEquivalents,
    financials?.cashBalance,
    derived?.cash,
    derived?.cashAndEquivalents
  );

  const netDebtInput = firstDefined(
    financials?.netDebt,
    financials?.netFinancialDebt,
    derived?.netDebt,
    derived?.netFinancialDebt
  );

  const grossDebt = toNumber(grossDebtInput);
  const cash = toNumber(cashInput);

  if (grossDebtInput !== undefined || cashInput !== undefined) {
    return {
      mode: 'grossDebtAndCash',
      grossDebt,
      cash,
      netDebt: grossDebt - cash
    };
  }

  if (netDebtInput !== undefined) {
    return {
      mode: 'netDebt',
      grossDebt: 0,
      cash: 0,
      netDebt: toNumber(netDebtInput)
    };
  }

  return {
    mode: 'none',
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
          note: 'Pendiente de cuantificación por revisión humana.'
        };
      }

      if (!item || typeof item !== 'object') return null;

      return {
        id: safeText(item.id, `adjustment-${index + 1}`),
        label: safeText(
          firstDefined(item.label, item.name, item.concept, item.title),
          `Ajuste EBITDA ${index + 1}`
        ),
        amount: toNumber(firstDefined(item.amount, item.value, item.impact)),
        note: safeText(
          firstDefined(item.note, item.description, item.rationale),
          'Ajuste normalizado para análisis preliminar.'
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
          rationale: 'Comprador potencial pendiente de cualificación.'
        };
      }

      if (!buyer || typeof buyer !== 'object') return null;

      return {
        id: safeText(buyer.id, `buyer-${index + 1}`),
        name: safeText(firstDefined(buyer.name, buyer.buyerName, buyer.title), `Buyer ${index + 1}`),
        type: safeText(firstDefined(buyer.type, buyer.category, buyer.profile), 'Strategic / Financial'),
        fitScore: firstDefined(buyer.fitScore, buyer.score, buyer.matchScore, null),
        rationale: safeText(
          firstDefined(buyer.rationale, buyer.description, buyer.notes),
          'Potencial encaje pendiente de validación comercial y estratégica.'
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
      rationale: 'Comprador industrial con potencial de sinergias operativas, comerciales o tecnológicas.'
    },
    {
      id: 'financial-sponsor',
      name: 'Financial sponsor',
      type: 'Private Equity / Financial',
      fitScore: null,
      rationale: 'Inversor financiero orientado a crecimiento, mejora operativa y salida futura.'
    },
    {
      id: 'family-office',
      name: 'Family office / Long-term investor',
      type: 'Long-term capital',
      fitScore: null,
      rationale: 'Capital paciente con foco en estabilidad, caja recurrente y preservación de valor.'
    }
  ];
}

function getTextItems(value, fallback) {
  const items = toArray(value)
    .map((item) => {
      if (typeof item === 'string') return item;

      if (item && typeof item === 'object') {
        return safeText(firstDefined(item.text, item.label, item.title, item.description), '');
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
          mitigant: 'Pendiente de revisión y mitigación específica.'
        };
      }

      if (!item || typeof item !== 'object') return null;

      return {
        id: safeText(item.id, `risk-${index + 1}`),
        risk: safeText(firstDefined(item.risk, item.title, item.label), `Riesgo ${index + 1}`),
        mitigant: safeText(
          firstDefined(item.mitigant, item.mitigation, item.response, item.notes),
          'Pendiente de revisión y mitigación específica.'
        )
      };
    })
    .filter(Boolean);

  if (risks.length > 0) return risks;

  return [
    {
      id: 'quality-of-earnings',
      risk: 'Calidad y sostenibilidad del EBITDA normalizado.',
      mitigant: 'Revisión humana, contraste documental y análisis de recurrencia de ingresos y costes.'
    },
    {
      id: 'working-capital',
      risk: 'Necesidad de ajuste de capital circulante en cierre.',
      mitigant: 'Definir peg de working capital, revisar estacionalidad y documentar mecanismo de ajuste.'
    },
    {
      id: 'debt-cash',
      risk: 'Confirmación de deuda, caja y partidas debt-like.',
      mitigant: 'Validar deuda financiera, caja disponible, pasivos contingentes y partidas equivalentes a deuda.'
    }
  ];
}

export function formatMAReportData({
  financials = {},
  settings = {},
  derived = {},
  generatedBy = 'CEO’s OS',
  organizationName = 'CEO’s OS',
  reportStatus = 'Draft'
} = {}) {
  const generatedAt = new Date();
  const currency = safeText(firstDefined(financials?.currency, settings?.currency, derived?.currency), DEFAULT_CURRENCY).toUpperCase();

  const companyName = safeText(
    firstDefined(
      financials?.name,
      financials?.companyName,
      financials?.targetCompanyName,
      settings?.companyName,
      settings?.targetCompanyName,
      derived?.companyName
    ),
    'Target Company'
  );

  const sector = safeText(firstDefined(financials?.sector, settings?.sector, derived?.sector), 'Sector not specified');
  const geography = safeText(firstDefined(financials?.geography, financials?.country, settings?.geography, derived?.geography), 'Geography not specified');
  const transactionType = safeText(firstDefined(financials?.transactionType, settings?.transactionType, derived?.transactionType), 'M&A preliminary assessment');

  const revenue = firstNumber(financials?.revenue, financials?.sales, financials?.netSales, financials?.ltmRevenue, derived?.revenue, derived?.ltmRevenue);
  const ebitdaAdjustments = getEbitdaAdjustments(financials, derived);

  const rawEbitda = firstNumber(financials?.ebitda, financials?.reportedEbitda, financials?.ltmEbitda, derived?.reportedEbitda);
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

  const workingCapitalAdjustment = firstNumber(financials?.workingCapitalAdjustment, financials?.nwcAdjustment, derived?.workingCapitalAdjustment, derived?.nwcAdjustment);
  const otherAdjustments = firstNumber(financials?.otherAdjustments, financials?.equityBridgeAdjustments, derived?.otherAdjustments);

  const evLow = firstNumber(derived?.enterpriseValueLow, derived?.evLow, adjustedEbitda * multiples.low);
  const evBase = firstNumber(derived?.enterpriseValue, derived?.enterpriseValueBase, derived?.evBase, adjustedEbitda * multiples.base);
  const evHigh = firstNumber(derived?.enterpriseValueHigh, derived?.evHigh, adjustedEbitda * multiples.high);

  const calculateEquity = (enterpriseValue) => {
    if (debtMode.mode === 'grossDebtAndCash') {
      return enterpriseValue - debtMode.grossDebt + debtMode.cash + workingCapitalAdjustment + otherAdjustments;
    }

    if (debtMode.mode === 'netDebt') {
      return enterpriseValue - debtMode.netDebt + workingCapitalAdjustment + otherAdjustments;
    }

    return enterpriseValue + workingCapitalAdjustment + otherAdjustments;
  };

  const equityLow = firstNumber(derived?.equityValueLow, calculateEquity(evLow));
  const equityBase = firstNumber(derived?.equityValue, derived?.equityValueBase, derived?.equityBase, calculateEquity(evBase));
  const equityHigh = firstNumber(derived?.equityValueHigh, calculateEquity(evHigh));

  const ebitdaMargin = revenue !== 0 ? adjustedEbitda / revenue : firstNumber(derived?.ebitdaMargin);

  const bridgeLogic =
    debtMode.mode === 'grossDebtAndCash'
      ? 'Equity Value = Enterprise Value - Gross Debt + Cash + Working Capital Adjustment + Other Adjustments'
      : debtMode.mode === 'netDebt'
        ? 'Equity Value = Enterprise Value - Net Debt + Working Capital Adjustment + Other Adjustments'
        : 'Equity Value = Enterprise Value + Working Capital Adjustment + Other Adjustments';

  const waterfall = [
    {
      label: 'Enterprise Value',
      description: 'Valor de empresa derivado del EBITDA normalizado y rango de múltiplos.',
      low: evLow,
      base: evBase,
      high: evHigh,
      type: 'base'
    },
    ...(debtMode.mode === 'grossDebtAndCash'
      ? [
          {
            label: 'Less: Gross Debt',
            description: 'Deuda financiera bruta deducida del Enterprise Value.',
            low: -Math.abs(debtMode.grossDebt),
            base: -Math.abs(debtMode.grossDebt),
            high: -Math.abs(debtMode.grossDebt),
            type: 'deduction'
          },
          {
            label: 'Add: Cash',
            description: 'Caja y equivalentes añadidos al Equity Value.',
            low: debtMode.cash,
            base: debtMode.cash,
            high: debtMode.cash,
            type: 'addition'
          }
        ]
      : []),
    ...(debtMode.mode === 'netDebt'
      ? [
          {
            label: 'Less: Net Debt',
            description: 'Deuda financiera neta deducida del Enterprise Value. No se suma caja adicional para evitar duplicidad.',
            low: -Math.abs(debtMode.netDebt),
            base: -Math.abs(debtMode.netDebt),
            high: -Math.abs(debtMode.netDebt),
            type: 'deduction'
          }
        ]
      : []),
    {
      label: 'Working Capital Adjustment',
      description: 'Ajuste preliminar de capital circulante.',
      low: workingCapitalAdjustment,
      base: workingCapitalAdjustment,
      high: workingCapitalAdjustment,
      type: workingCapitalAdjustment >= 0 ? 'addition' : 'deduction'
    },
    {
      label: 'Other Equity Adjustments',
      description: 'Otros ajustes de puente hacia Equity Value.',
      low: otherAdjustments,
      base: otherAdjustments,
      high: otherAdjustments,
      type: otherAdjustments >= 0 ? 'addition' : 'deduction'
    },
    {
      label: 'Equity Value',
      description: 'Valor estimado para el accionista tras ajustes de deuda, caja y circulante.',
      low: equityLow,
      base: equityBase,
      high: equityHigh,
      type: 'total'
    }
  ];

  const fileName = `${sanitizeFileName(companyName)}-ma-report-${generatedAt.toISOString().slice(0, 10)}.html`;

  return {
    meta: {
      reportTitle: `${companyName} — M&A Preliminary Valuation Report`,
      companyName,
      generatedBy: safeText(generatedBy, 'CEO’s OS'),
      organizationName: safeText(organizationName, 'CEO’s OS'),
      reportStatus: safeText(reportStatus, 'Draft'),
      generatedAt: generatedAt.toISOString(),
      generatedDateLabel: formatDate(generatedAt),
      currency,
      fileName
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
      debtMode: debtMode.mode
    },
    sections: {
      companySnapshot: [
        { label: 'Company', value: companyName },
        { label: 'Sector', value: sector },
        { label: 'Geography', value: geography },
        { label: 'Currency', value: currency },
        { label: 'Revenue', value: formatCurrency(revenue, currency) },
        { label: 'Adjusted EBITDA', value: formatCurrency(adjustedEbitda, currency) },
        { label: 'Adjusted EBITDA Margin', value: formatPercent(ebitdaMargin) }
      ],
      transactionOverview: [
        { label: 'Transaction Type', value: transactionType },
        { label: 'Report Status', value: safeText(reportStatus, 'Draft') },
        { label: 'Generated By', value: safeText(generatedBy, 'CEO’s OS') },
        { label: 'Organization', value: safeText(organizationName, 'CEO’s OS') },
        { label: 'Generated Date', value: formatDate(generatedAt) }
      ],
      financialInputs: [
        { label: 'Revenue', value: revenue, formattedValue: formatCurrency(revenue, currency) },
        { label: 'Reported EBITDA', value: rawEbitda, formattedValue: formatCurrency(rawEbitda, currency) },
        { label: 'EBITDA Adjustments', value: ebitdaAdjustments.total, formattedValue: formatCurrency(ebitdaAdjustments.total, currency) },
        { label: 'Adjusted EBITDA', value: adjustedEbitda, formattedValue: formatCurrency(adjustedEbitda, currency) },
        { label: 'Gross Debt', value: debtMode.grossDebt, formattedValue: formatCurrency(debtMode.grossDebt, currency) },
        { label: 'Cash', value: debtMode.cash, formattedValue: formatCurrency(debtMode.cash, currency) },
        { label: 'Net Debt', value: debtMode.netDebt, formattedValue: formatCurrency(debtMode.netDebt, currency) },
        { label: 'Working Capital Adjustment', value: workingCapitalAdjustment, formattedValue: formatCurrency(workingCapitalAdjustment, currency) },
        { label: 'Other Adjustments', value: otherAdjustments, formattedValue: formatCurrency(otherAdjustments, currency) }
      ],
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
      buyerMatching: getBuyerMatching(settings, derived),
      investmentThesis: getTextItems(firstDefined(derived?.investmentThesis, settings?.investmentThesis), [
        'Plataforma con potencial de creación de valor mediante crecimiento, mejora operativa o consolidación sectorial.',
        'Valoración preliminar basada en EBITDA normalizado y rango de múltiplos de mercado.',
        'Oportunidad sujeta a validación documental, revisión humana y contraste con compradores cualificados.'
      ]),
      risksAndMitigants: getRisks(settings, derived),
      preliminaryCIM: [
        {
          title: 'Business Overview',
          content: `${companyName} opera en el sector ${sector}. El análisis preliminar debe completarse con descripción del modelo de negocio, clientes principales, canales, equipo directivo y posición competitiva.`
        },
        {
          title: 'Market Context',
          content: `El contexto de mercado debe validarse con fuentes externas, comparables sectoriales y dinámica competitiva en ${geography}.`
        },
        {
          title: 'Transaction Rationale',
          content: `La operación se plantea como ${transactionType}. El racional debe contrastar objetivos del vendedor, perfil de comprador, estructura esperada y principales condiciones de cierre.`
        },
        {
          title: 'Financial Overview',
          content: 'La información financiera incluida es preliminar y debe completarse con estados financieros históricos, detalle de ajustes EBITDA, deuda, caja, working capital y supuestos de crecimiento.'
        }
      ],
      humanReviewNotes: getTextItems(firstDefined(derived?.humanReviewNotes, settings?.humanReviewNotes), [
        'Este informe es una versión preliminar y debe ser revisado por un profesional antes de ser compartido externamente.',
        'Las cifras dependen de la calidad de los datos introducidos y de la documentación financiera disponible.',
        'La valoración no constituye asesoramiento financiero, legal, fiscal ni una fairness opinion.'
      ]),
      appendix: [
        { label: 'Currency', value: currency },
        { label: 'Valuation methodology', value: 'Adjusted EBITDA Multiple' },
        { label: 'Multiple range', value: `${formatMultiple(multiples.low)} / ${formatMultiple(multiples.base)} / ${formatMultiple(multiples.high)}` },
        { label: 'Debt treatment', value: bridgeLogic },
        { label: 'Data source', value: 'User-provided financial inputs' },
        { label: 'Review status', value: 'Human review required' }
      ]
    }
  };
}

export default formatMAReportData;
