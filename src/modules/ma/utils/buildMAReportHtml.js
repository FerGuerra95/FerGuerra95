const BRAND_NAME = "CEO's OS";

function normalizeText(value, fallback = '') {
  if (value === null || value === undefined) return fallback;

  return String(value)
    .replace(/CEO’s OS/g, BRAND_NAME)
    .replace(/CEO\u2019s OS/g, BRAND_NAME)
    .replace(/[“”]/g, '"')
    .replace(/[’]/g, "'")
    .trim() || fallback;
}

function escapeHtml(value) {
  return normalizeText(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeText(value, fallback = 'N/A') {
  const text = normalizeText(value, '');
  return text || fallback;
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function safeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatCurrency(value, currency = 'EUR') {
  const amount = safeNumber(value);

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

function formatMultiple(value) {
  return `${safeNumber(value).toFixed(1)}x`;
}

function readFormattedMetric(item) {
  if (!item || typeof item !== 'object') return 'N/A';

  return safeText(
    item.formattedValue ||
      item.value ||
      item.amount ||
      item.impact ||
      item.enterpriseValue ||
      item.equityValue,
    'N/A'
  );
}

function getReportMeta(report = {}) {
  const meta = report.meta || {};

  return {
    title: safeText(meta.reportTitle || report.title, 'M&A Professional Report'),
    subtitle: safeText(
      report.subtitle,
      'Strategic valuation and transaction review prepared for internal decision-making.'
    ),
    companyName: safeText(meta.companyName || report.companyName || report.targetName, 'Target Company'),
    organizationName: safeText(meta.organizationName || report.organizationName, BRAND_NAME),
    generatedBy: safeText(meta.generatedBy || report.generatedBy, BRAND_NAME),
    reportStatus: safeText(meta.reportStatus || report.reportStatus, 'Draft'),
    generatedDateLabel: safeText(meta.generatedDateLabel || report.reportDate, new Date().toLocaleDateString('es-ES')),
    currency: safeText(meta.currency, 'EUR'),
    fileName: safeText(meta.fileName, 'ma-report.html')
  };
}

function getTopKpis(report = {}, meta = {}) {
  const summary = report.summary || {};
  const enterpriseValue = report.enterpriseValue || {};
  const equityValue = report.equityValue || {};
  const sections = report.sections || {};

  const evBase =
    enterpriseValue.headline ||
    enterpriseValue.value ||
    sections.enterpriseValue?.base ||
    summary.enterpriseValueBase;

  const equityBase =
    equityValue.headline ||
    equityValue.value ||
    sections.equityValue?.base ||
    summary.equityValueBase;

  const valuationRange =
    report.valuationRangeHeadline ||
    report.valuationHeadline ||
    (summary.enterpriseValueLow || summary.enterpriseValueHigh
      ? `${formatCurrency(summary.enterpriseValueLow, meta.currency)} - ${formatCurrency(summary.enterpriseValueHigh, meta.currency)}`
      : 'N/A');

  const adjustedEbitda =
    summary.adjustedEbitda !== undefined
      ? formatCurrency(summary.adjustedEbitda, meta.currency)
      : 'N/A';

  return [
    {
      label: 'Valuation range',
      value: valuationRange,
      hint: 'Indicative enterprise value range'
    },
    {
      label: 'Enterprise Value',
      value: typeof evBase === 'number' ? formatCurrency(evBase, meta.currency) : safeText(evBase, 'N/A'),
      hint: 'Base case valuation output'
    },
    {
      label: 'Equity Value',
      value: typeof equityBase === 'number' ? formatCurrency(equityBase, meta.currency) : safeText(equityBase, 'N/A'),
      hint: 'After debt, cash and bridge adjustments'
    },
    {
      label: 'Adjusted EBITDA',
      value: adjustedEbitda,
      hint: 'Normalized valuation earnings base'
    }
  ];
}

function renderKpiCards(items = []) {
  return `
    <div class="cover-kpi-grid">
      ${safeArray(items)
        .map(
          (item, index) => `
            <article class="cover-kpi-card tone-${(index % 4) + 1}">
              <div class="card-light"></div>
              <span>${escapeHtml(item.label)}</span>
              <strong>${escapeHtml(item.value)}</strong>
              <small>${escapeHtml(item.hint)}</small>
            </article>
          `
        )
        .join('')}
    </div>
  `;
}

function renderMetaCards(items = []) {
  return `
    <div class="cover-meta-grid">
      ${safeArray(items)
        .map(
          (item) => `
            <article class="cover-meta-card">
              <span>${escapeHtml(item.label)}</span>
              <strong>${escapeHtml(item.value)}</strong>
            </article>
          `
        )
        .join('')}
    </div>
  `;
}

function renderSecondPageOpening(topKpis = [], meta = {}) {
  return `
    <div class="content-opening">
      <div class="content-opening-inner">
        <div>
          <div class="content-opening-kicker">Executive Workpaper</div>

          <h2>
            Valuation review prepared for executive decision-making.
          </h2>

          <p>
            This second page consolidates the professional workpaper: valuation base,
            key outputs, transaction context and review areas before moving into the
            detailed sections of the M&A report.
          </p>
        </div>

        <div class="content-opening-metrics">
          ${safeArray(topKpis)
            .slice(0, 3)
            .map(
              (item) => `
                <article class="content-opening-metric">
                  <span>${escapeHtml(item.label)}</span>
                  <strong>${escapeHtml(item.value)}</strong>
                  <small>${escapeHtml(item.hint)}</small>
                </article>
              `
            )
            .join('')}

          <article class="content-opening-metric">
            <span>Target</span>
            <strong>${escapeHtml(meta.companyName)}</strong>
            <small>Current report subject and active valuation case.</small>
          </article>
        </div>
      </div>
    </div>
  `;
}

function renderSection(number, title, subtitle, content, options = {}) {
  const classes = [
    'report-section',
    options.featured ? 'featured-section' : '',
    options.dark ? 'dark-section' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return `
    <section class="${classes}">
      <header class="section-header">
        <div class="section-number">${escapeHtml(String(number).padStart(2, '0'))}</div>
        <div>
          <p>${escapeHtml(options.kicker || 'M&A INTELLIGENCE')}</p>
          <h2>${escapeHtml(title)}</h2>
          <span>${escapeHtml(subtitle)}</span>
        </div>
      </header>
      <div class="section-body">
        ${content}
      </div>
    </section>
  `;
}

function renderDefinitionGrid(items = [], emptyText = 'No data available.') {
  const safeItems = safeArray(items).filter(Boolean);

  if (!safeItems.length) {
    return `<div class="empty-state">${escapeHtml(emptyText)}</div>`;
  }

  return `
    <div class="definition-grid">
      ${safeItems
        .map(
          (item, index) => `
            <article class="definition-card accent-${(index % 5) + 1}">
              <div class="definition-glow"></div>
              <span>${escapeHtml(item.label || item.title || 'Item')}</span>
              <strong>${escapeHtml(readFormattedMetric(item))}</strong>
            </article>
          `
        )
        .join('')}
    </div>
  `;
}

function renderBulletList(items = [], emptyText = 'No data available.') {
  const safeItems = safeArray(items).filter(Boolean);

  if (!safeItems.length) {
    return `<div class="empty-state">${escapeHtml(emptyText)}</div>`;
  }

  return `
    <ul class="premium-list">
      ${safeItems
        .map((item) => {
          const text =
            typeof item === 'string'
              ? item
              : item.text || item.label || item.title || item.description || item.value;

          return `<li>${escapeHtml(text)}</li>`;
        })
        .join('')}
    </ul>
  `;
}

function renderNumberedCards(items = [], emptyText = 'No data available.') {
  const safeItems = safeArray(items).filter(Boolean);

  if (!safeItems.length) {
    return `<div class="empty-state">${escapeHtml(emptyText)}</div>`;
  }

  return `
    <div class="numbered-card-list">
      ${safeItems
        .map((item, index) => {
          const title = safeText(item.title || item.label || `Item ${index + 1}`);
          const body = safeText(item.content || item.description || item.text || item.value, 'Pending further detail.');

          return `
            <article class="numbered-card">
              <div class="number-pill">${String(index + 1).padStart(2, '0')}</div>
              <div>
                <h3>${escapeHtml(title)}</h3>
                <p>${escapeHtml(body)}</p>
              </div>
            </article>
          `;
        })
        .join('')}
    </div>
  `;
}

function renderTable(columns = [], rows = [], emptyText = 'No data available.') {
  const safeColumns = safeArray(columns);
  const safeRows = safeArray(rows);

  if (!safeColumns.length || !safeRows.length) {
    return `<div class="empty-state">${escapeHtml(emptyText)}</div>`;
  }

  return `
    <div class="table-shell">
      <table>
        <thead>
          <tr>
            ${safeColumns.map((column) => `<th>${escapeHtml(column)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${safeRows
            .map(
              (row) => `
                <tr>
                  ${safeArray(row)
                    .map((cell) => `<td>${escapeHtml(cell)}</td>`)
                    .join('')}
                </tr>
              `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderFinancialInputs(report = {}) {
  const inputs = safeArray(report.financialInputs || report.sections?.financialInputs);

  return renderTable(
    ['Metric', 'Value'],
    inputs.map((item) => [
      safeText(item.label, 'Metric'),
      safeText(item.formattedValue || item.value, 'N/A')
    ]),
    'No financial inputs available.'
  );
}

function renderEbitdaAdjustments(report = {}) {
  const adjustments = safeArray(report.ebitdaAdjustments || report.sections?.ebitdaAdjustments?.items);
  const total =
    report.sections?.ebitdaAdjustments?.total !== undefined
      ? formatCurrency(report.sections.ebitdaAdjustments.total, report.meta?.currency || 'EUR')
      : 'N/A';

  if (!adjustments.length) {
    return `
      <div class="premium-note amber-note">
        <div class="note-icon">!</div>
        <div>
          <strong>No EBITDA adjustments provided</strong>
          <p>No normalization adjustments were entered. Reported EBITDA is used as the current valuation base, subject to human review and financial diligence.</p>
        </div>
      </div>
    `;
  }

  return `
    ${renderTable(
      ['Adjustment', 'Impact', 'Comment'],
      adjustments.map((item) => [
        safeText(item.label || item.title, 'Adjustment'),
        safeText(item.value || item.impact || formatCurrency(item.amount, report.meta?.currency || 'EUR'), 'N/A'),
        safeText(item.comment || item.note || item.description, 'N/A')
      ])
    )}
    <div class="total-strip">
      <span>Total EBITDA adjustments</span>
      <strong>${escapeHtml(total)}</strong>
    </div>
  `;
}

function renderValuationRange(report = {}) {
  const range = safeArray(report.valuationRange);
  const valuation = report.sections?.valuationRange || {};
  const currency = report.meta?.currency || 'EUR';

  const rows =
    range.length > 0
      ? range
      : [
          {
            scenario: 'Low Case',
            multiple: formatMultiple(valuation.multiples?.low),
            enterpriseValue: formatCurrency(valuation.enterpriseValue?.low, currency),
            equityValue: formatCurrency(valuation.equityValue?.low, currency)
          },
          {
            scenario: 'Base Case',
            multiple: formatMultiple(valuation.multiples?.base),
            enterpriseValue: formatCurrency(valuation.enterpriseValue?.base, currency),
            equityValue: formatCurrency(valuation.equityValue?.base, currency)
          },
          {
            scenario: 'High Case',
            multiple: formatMultiple(valuation.multiples?.high),
            enterpriseValue: formatCurrency(valuation.enterpriseValue?.high, currency),
            equityValue: formatCurrency(valuation.equityValue?.high, currency)
          }
        ];

  return `
    <div class="scenario-grid">
      ${rows
        .map(
          (item, index) => `
            <article class="scenario-card scenario-${index + 1}">
              <div class="scenario-top">
                <span>${escapeHtml(item.scenario || item.label || `Scenario ${index + 1}`)}</span>
                <small>${escapeHtml(item.multiple || 'N/A')}</small>
              </div>
              <strong>${escapeHtml(item.equityValue || item.enterpriseValue || item.value || 'N/A')}</strong>
              <p>${index === 0 ? 'Conservative case' : index === 1 ? 'Main committee case' : 'Upside case'}</p>
              <div class="scenario-line"><div></div></div>
            </article>
          `
        )
        .join('')}
    </div>

    ${renderTable(
      ['Scenario', 'Multiple', 'Enterprise Value', 'Equity Value'],
      rows.map((item) => [
        safeText(item.scenario || item.label, 'Scenario'),
        safeText(item.multiple, 'N/A'),
        safeText(item.enterpriseValue || item.value, 'N/A'),
        safeText(item.equityValue, 'N/A')
      ])
    )}
  `;
}

function renderEnterpriseEquityGrid(report = {}) {
  const enterprise = report.enterpriseValue || {};
  const equity = report.equityValue || {};
  const currency = report.meta?.currency || 'EUR';

  const items = [
    {
      label: 'Enterprise Value',
      value: enterprise.value || enterprise.headline || formatCurrency(report.sections?.enterpriseValue?.base, currency)
    },
    {
      label: 'Method',
      value: enterprise.method || 'Adjusted EBITDA Multiple'
    },
    {
      label: 'Equity Value',
      value: equity.value || equity.headline || formatCurrency(report.sections?.equityValue?.base, currency)
    },
    {
      label: 'Debt basis',
      value: equity.debtBasis || report.summary?.debtMode || 'N/A'
    },
    {
      label: 'Working Capital Adjustment',
      value: equity.workingCapitalAdjustment || 'N/A'
    },
    {
      label: 'Other Adjustments',
      value: equity.otherAdjustments || 'N/A'
    }
  ];

  return renderDefinitionGrid(items);
}

function renderWaterfall(report = {}) {
  const waterfall = safeArray(report.waterfall || report.sections?.waterfall);

  if (!waterfall.length) {
    return `<div class="empty-state">No waterfall available.</div>`;
  }

  return `
    <div class="waterfall-board">
      ${waterfall
        .map((item, index) => {
          const tone = item.tone || (item.type === 'deduction' ? 'negative' : item.type === 'addition' ? 'positive' : item.type === 'total' ? 'highlight' : 'neutral');

          return `
            <article class="waterfall-card tone-${escapeHtml(tone)}">
              <div class="waterfall-index">${String(index + 1).padStart(2, '0')}</div>
              <div class="waterfall-copy">
                <h3>${escapeHtml(item.label || item.title || 'Step')}</h3>
                <p>${escapeHtml(item.description || item.meta || '')}</p>
              </div>
              <strong>${escapeHtml(item.value || 'N/A')}</strong>
            </article>
          `;
        })
        .join('')}
    </div>
  `;
}

function renderBuyerMatching(report = {}) {
  const buyers = safeArray(report.buyerMatching || report.sections?.buyerMatching);

  if (!buyers.length) {
    return `<div class="empty-state">No buyer matching analysis available.</div>`;
  }

  return `
    <div class="buyer-grid">
      ${buyers
        .map(
          (buyer, index) => `
            <article class="buyer-card buyer-${(index % 3) + 1}">
              <div class="buyer-header">
                <span>${escapeHtml(buyer.type || 'Buyer')}</span>
                <small>${escapeHtml(buyer.fit || buyer.fitScore || 'Fit')}</small>
              </div>
              <h3>${escapeHtml(buyer.name || `Buyer ${index + 1}`)}</h3>
              <p>${escapeHtml(buyer.rationale || 'Strategic rationale pending validation.')}</p>
            </article>
          `
        )
        .join('')}
    </div>
  `;
}

function renderRisks(report = {}) {
  const risks = safeArray(report.risksMitigants || report.risksAndMitigants || report.sections?.risksAndMitigants);

  return renderTable(
    ['Risk', 'Severity', 'Mitigant'],
    risks.map((item) => [
      safeText(item.risk || item.title || item.label, 'Risk'),
      safeText(item.severity || item.level, 'To assess'),
      safeText(item.mitigant || item.mitigation || item.description, 'Pending mitigation.')
    ]),
    'No risks and mitigants available.'
  );
}

function renderAppendix(report = {}) {
  const appendix = safeArray(report.appendix || report.sections?.appendix);

  return renderTable(
    ['Item', 'Value'],
    appendix.map((item) => [
      safeText(item.label || item.title, 'Item'),
      safeText(item.value || item.text || item.description, 'N/A')
    ]),
    'No appendix data available.'
  );
}

export function buildMAReportHtml(report = {}) {
  const meta = getReportMeta(report);
  const topKpis = getTopKpis(report, meta);

  const coverMeta = [
    { label: 'Target', value: meta.companyName },
    { label: 'Status', value: meta.reportStatus },
    { label: 'Prepared for', value: meta.organizationName },
    { label: 'Generated by', value: meta.generatedBy },
    { label: 'Date', value: meta.generatedDateLabel },
    { label: 'Framework', value: 'M&A / Decision Support' }
  ];

  const executiveSummary = safeArray(report.executiveSummary);
  const companySnapshot = safeArray(report.companySnapshot || report.sections?.companySnapshot);
  const transactionOverview = safeArray(report.transactionOverview || report.sections?.transactionOverview);
  const investmentThesis = safeArray(report.investmentThesis || report.sections?.investmentThesis);
  const preliminaryCim = safeArray(report.preliminaryCim || report.preliminaryCIM || report.sections?.preliminaryCIM);
  const humanReviewNotes = safeArray(report.humanReviewNotes || report.sections?.humanReviewNotes);

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(meta.title)}</title>
  <style>
    :root {
      --ink: #e5eefc;
      --ink-dark: #0f172a;
      --graphite: #334155;
      --muted: #64748b;
      --line: #dbe4f0;
      --line-soft: rgba(148, 163, 184, 0.2);
      --white: #ffffff;
      --paper: #f8fafc;
      --navy: #020617;
      --navy-2: #0f172a;
      --blue: #2563eb;
      --blue-2: #60a5fa;
      --blue-soft: #dbeafe;
      --emerald: #10b981;
      --emerald-soft: #d1fae5;
      --gold: #d4a017;
      --gold-soft: #fef3c7;
      --danger: #dc2626;
      --danger-soft: #fee2e2;
      --violet: #7c3aed;
      --shadow-xl: 0 34px 120px rgba(15, 23, 42, 0.22);
      --shadow-card: 0 18px 48px rgba(15, 23, 42, 0.09);
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    html,
    body {
      margin: 0;
      background:
        radial-gradient(circle at 8% 0%, rgba(37, 99, 235, 0.18), transparent 28%),
        radial-gradient(circle at 92% 4%, rgba(16, 185, 129, 0.12), transparent 26%),
        linear-gradient(180deg, #eef4fb 0%, #e5edf7 100%);
      color: var(--ink-dark);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 14px;
      line-height: 1.6;
    }

    .report-shell {
      width: min(1120px, 100%);
      margin: 32px auto;
      padding: 0;
      background: var(--white);
      border: 1px solid rgba(255, 255, 255, 0.8);
      border-radius: 34px;
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }

    .cover {
      position: relative;
      min-height: 760px;
      overflow: hidden;
      padding: 62px;
      color: #f8fafc;
      background:
        radial-gradient(circle at 8% 6%, rgba(37, 99, 235, 0.48), transparent 32%),
        radial-gradient(circle at 88% 10%, rgba(16, 185, 129, 0.22), transparent 30%),
        radial-gradient(circle at 54% 112%, rgba(212, 160, 23, 0.18), transparent 34%),
        linear-gradient(135deg, #020617 0%, #0f172a 52%, #172554 100%);
      page-break-after: always;
    }

    .cover::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
      background-size: 48px 48px;
      mask-image: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 88%);
      pointer-events: none;
    }

    .cover::after {
      content: "";
      position: absolute;
      right: -170px;
      bottom: -190px;
      width: 520px;
      height: 520px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.14);
      box-shadow:
        inset 0 0 0 46px rgba(255,255,255,0.025),
        inset 0 0 0 112px rgba(37,99,235,0.045),
        0 0 110px rgba(37,99,235,0.18);
      pointer-events: none;
    }

    .cover-top,
    .cover-main,
    .cover-bottom {
      position: relative;
      z-index: 2;
    }

    .cover-top {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      align-items: flex-start;
      margin-bottom: 94px;
    }

    .brand-pill,
    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 11px 15px;
      border-radius: 999px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.14);
      color: rgba(248,250,252,0.92);
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      backdrop-filter: blur(16px);
    }

    .brand-dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: linear-gradient(135deg, var(--blue-2), var(--emerald));
      box-shadow: 0 0 0 5px rgba(96, 165, 250, 0.12);
    }

    .cover-kicker {
      display: inline-flex;
      align-items: center;
      margin-bottom: 20px;
      padding: 10px 14px;
      border-radius: 999px;
      background: rgba(37,99,235,0.18);
      border: 1px solid rgba(147,197,253,0.22);
      color: #dbeafe;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .cover h1 {
      max-width: 870px;
      margin: 0;
      font-size: 68px;
      line-height: 0.9;
      letter-spacing: -0.075em;
      color: #ffffff;
    }

    .cover h1 span {
      display: block;
      margin-top: 13px;
      color: rgba(226,232,240,0.74);
      font-weight: 500;
    }

    .cover-subtitle {
      max-width: 760px;
      margin: 30px 0 0;
      color: rgba(226,232,240,0.82);
      font-size: 17px;
      line-height: 1.76;
    }

    .cover-rule {
      width: min(640px, 100%);
      height: 1px;
      margin-top: 34px;
      background: linear-gradient(90deg, var(--gold), rgba(255,255,255,0.34), transparent);
    }

    .cover-kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 15px;
      margin-top: 52px;
    }

    .cover-kpi-card {
      position: relative;
      overflow: hidden;
      min-height: 150px;
      padding: 20px;
      border-radius: 25px;
      background:
        linear-gradient(135deg, rgba(255,255,255,0.13), rgba(255,255,255,0.045)),
        rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.13);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.08),
        0 18px 48px rgba(0,0,0,0.17);
    }

    .cover-kpi-card .card-light {
      position: absolute;
      right: -44px;
      bottom: -58px;
      width: 140px;
      height: 140px;
      border-radius: 999px;
      opacity: 0.24;
      pointer-events: none;
    }

    .tone-1 .card-light { background: var(--blue-2); }
    .tone-2 .card-light { background: var(--emerald); }
    .tone-3 .card-light { background: var(--gold); }
    .tone-4 .card-light { background: var(--violet); }

    .cover-kpi-card span,
    .cover-meta-card span {
      position: relative;
      display: block;
      margin-bottom: 12px;
      color: rgba(191,219,254,0.82);
      font-size: 11px;
      font-weight: 850;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .cover-kpi-card strong {
      position: relative;
      display: block;
      color: #ffffff;
      font-size: 24px;
      line-height: 1.05;
      letter-spacing: -0.045em;
    }

    .cover-kpi-card small {
      position: relative;
      display: block;
      margin-top: 10px;
      color: rgba(226,232,240,0.72);
      font-size: 12px;
      line-height: 1.45;
    }

    .cover-bottom {
      margin-top: 36px;
    }

    .cover-meta-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 13px;
    }

    .cover-meta-card {
      min-height: 86px;
      padding: 16px;
      border-radius: 20px;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.12);
      backdrop-filter: blur(14px);
    }

    .cover-meta-card strong {
      color: #ffffff;
      line-height: 1.35;
    }

    .content {
      position: relative;
      padding: 42px 52px 54px;
      background:
        radial-gradient(circle at 100% 0%, rgba(37,99,235,0.07), transparent 26%),
        radial-gradient(circle at 0% 12%, rgba(16,185,129,0.045), transparent 24%),
        linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
    }

    .content-opening {
      position: relative;
      overflow: hidden;
      margin-bottom: 28px;
      padding: 30px;
      border-radius: 30px;
      color: #ffffff;
      background:
        radial-gradient(circle at 8% 0%, rgba(37,99,235,0.42), transparent 32%),
        radial-gradient(circle at 92% 10%, rgba(16,185,129,0.18), transparent 28%),
        radial-gradient(circle at 58% 120%, rgba(212,160,23,0.14), transparent 32%),
        linear-gradient(135deg, #020617, #0f172a 62%, #172554);
      border: 1px solid rgba(148,163,184,0.24);
      box-shadow:
        0 24px 70px rgba(15,23,42,0.18),
        inset 0 1px 0 rgba(255,255,255,0.07);
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .content-opening::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
      background-size: 42px 42px;
      mask-image: linear-gradient(to bottom, rgba(0,0,0,0.85), transparent 88%);
      pointer-events: none;
    }

    .content-opening::after {
      content: "";
      position: absolute;
      right: -86px;
      bottom: -112px;
      width: 260px;
      height: 260px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.13);
      box-shadow: inset 0 0 0 34px rgba(255,255,255,0.028);
      pointer-events: none;
    }

    .content-opening-inner {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(260px, 0.9fr);
      gap: 24px;
      align-items: stretch;
    }

    .content-opening-kicker {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 14px;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(37,99,235,0.2);
      border: 1px solid rgba(147,197,253,0.22);
      color: #dbeafe;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .content-opening h2 {
      margin: 0;
      max-width: 620px;
      color: #ffffff;
      font-size: 34px;
      line-height: 0.98;
      letter-spacing: -0.06em;
    }

    .content-opening p {
      margin: 16px 0 0;
      max-width: 680px;
      color: rgba(226,232,240,0.78);
      line-height: 1.72;
    }

    .content-opening-metrics {
      display: grid;
      gap: 12px;
    }

    .content-opening-metric {
      position: relative;
      overflow: hidden;
      padding: 16px;
      border-radius: 20px;
      background: rgba(255,255,255,0.075);
      border: 1px solid rgba(255,255,255,0.12);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
    }

    .content-opening-metric span {
      display: block;
      margin-bottom: 8px;
      color: rgba(191,219,254,0.82);
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .content-opening-metric strong {
      display: block;
      color: #ffffff;
      font-size: 19px;
      line-height: 1.1;
      letter-spacing: -0.035em;
      overflow-wrap: anywhere;
    }

    .content-opening-metric small {
      display: block;
      margin-top: 7px;
      color: rgba(226,232,240,0.68);
      font-size: 11px;
      line-height: 1.4;
    }

    .disclaimer-banner {
      margin-bottom: 28px;
      padding: 18px 20px;
      border-radius: 24px;
      border: 1px solid rgba(212,160,23,0.33);
      background:
        radial-gradient(circle at 100% 0%, rgba(212,160,23,0.14), transparent 30%),
        linear-gradient(135deg, #fffbeb, #ffffff);
      color: #5b4300;
      box-shadow: 0 16px 38px rgba(212,160,23,0.08);
    }

    .disclaimer-banner strong {
      display: block;
      margin-bottom: 7px;
      color: #7c5800;
      font-size: 12px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .report-section {
      margin-bottom: 34px;
      border-radius: 30px;
      overflow: hidden;
      border: 1px solid var(--line);
      background: #ffffff;
      box-shadow: var(--shadow-card);
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .featured-section {
      border-color: rgba(37,99,235,0.22);
      box-shadow: 0 24px 70px rgba(37,99,235,0.11);
    }

    .section-header {
      display: grid;
      grid-template-columns: 58px minmax(0, 1fr);
      gap: 18px;
      align-items: flex-start;
      padding: 24px 26px;
      background:
        radial-gradient(circle at 0% 0%, rgba(37,99,235,0.08), transparent 34%),
        linear-gradient(180deg, #ffffff, #f4f8ff);
      border-bottom: 1px solid var(--line);
    }

    .section-number {
      width: 50px;
      height: 50px;
      border-radius: 18px;
      display: grid;
      place-items: center;
      color: #ffffff;
      background: linear-gradient(135deg, var(--blue), #1d4ed8);
      font-weight: 900;
      font-size: 13px;
      letter-spacing: 0.05em;
      box-shadow: 0 14px 32px rgba(37,99,235,0.22);
    }

    .section-header p {
      margin: 0 0 7px;
      color: var(--gold);
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }

    .section-header h2 {
      margin: 0;
      color: var(--ink-dark);
      font-size: 25px;
      line-height: 1.1;
      letter-spacing: -0.045em;
    }

    .section-header span {
      display: block;
      margin-top: 8px;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.6;
    }

    .section-body {
      padding: 26px;
    }

    .definition-grid,
    .buyer-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 15px;
    }

    .definition-card,
    .buyer-card,
    .numbered-card,
    .premium-note {
      position: relative;
      overflow: hidden;
      border-radius: 22px;
      border: 1px solid var(--line);
      background:
        radial-gradient(circle at 100% 0%, rgba(37,99,235,0.07), transparent 30%),
        linear-gradient(180deg, #ffffff, #f8fafc);
      box-shadow: 0 12px 30px rgba(15,23,42,0.045);
    }

    .definition-card {
      min-height: 126px;
      padding: 19px;
      border-top-width: 4px;
    }

    .definition-glow {
      position: absolute;
      right: -44px;
      bottom: -58px;
      width: 130px;
      height: 130px;
      border-radius: 999px;
      opacity: 0.12;
      pointer-events: none;
    }

    .accent-1 { border-top-color: var(--blue); }
    .accent-2 { border-top-color: var(--emerald); }
    .accent-3 { border-top-color: var(--gold); }
    .accent-4 { border-top-color: var(--violet); }
    .accent-5 { border-top-color: var(--blue-2); }

    .accent-1 .definition-glow { background: var(--blue); }
    .accent-2 .definition-glow { background: var(--emerald); }
    .accent-3 .definition-glow { background: var(--gold); }
    .accent-4 .definition-glow { background: var(--violet); }
    .accent-5 .definition-glow { background: var(--blue-2); }

    .definition-card span,
    .buyer-card span {
      position: relative;
      display: block;
      margin-bottom: 10px;
      color: var(--muted);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .definition-card strong {
      position: relative;
      display: block;
      color: var(--ink-dark);
      font-size: 19px;
      line-height: 1.16;
      letter-spacing: -0.03em;
      overflow-wrap: anywhere;
    }

    .premium-list {
      margin: 0;
      padding: 0;
      display: grid;
      gap: 13px;
      list-style: none;
    }

    .premium-list li {
      position: relative;
      padding: 17px 18px 17px 48px;
      border: 1px solid var(--line);
      border-radius: 19px;
      background: linear-gradient(180deg, #ffffff, #f8fafc);
      color: var(--graphite);
      line-height: 1.68;
    }

    .premium-list li::before {
      content: "";
      position: absolute;
      left: 18px;
      top: 24px;
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: linear-gradient(135deg, var(--blue), var(--emerald));
      box-shadow: 0 0 0 4px rgba(37,99,235,0.10);
    }

    .table-shell {
      overflow: hidden;
      border-radius: 22px;
      border: 1px solid var(--line);
      box-shadow: 0 14px 34px rgba(15,23,42,0.04);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: #ffffff;
    }

    th {
      padding: 15px 16px;
      text-align: left;
      color: #475569;
      background: linear-gradient(180deg, #f8fbff, #f1f5f9);
      border-bottom: 1px solid var(--line);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.11em;
      text-transform: uppercase;
    }

    td {
      padding: 15px 16px;
      color: var(--graphite);
      border-bottom: 1px solid #edf2f7;
      vertical-align: top;
      line-height: 1.55;
    }

    tr:last-child td {
      border-bottom: 0;
    }

    tbody tr:nth-child(even) td {
      background: #fbfdff;
    }

    .total-strip {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
      margin-top: 14px;
      padding: 16px 18px;
      border-radius: 20px;
      background: linear-gradient(135deg, var(--gold-soft), #ffffff);
      border: 1px solid rgba(212,160,23,0.26);
    }

    .total-strip span {
      color: #7c5800;
      font-weight: 800;
    }

    .total-strip strong {
      color: var(--ink-dark);
      font-size: 18px;
    }

    .scenario-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 15px;
      margin-bottom: 18px;
    }

    .scenario-card {
      position: relative;
      overflow: hidden;
      min-height: 166px;
      padding: 23px;
      border-radius: 25px;
      color: #ffffff;
      box-shadow: 0 22px 58px rgba(15,23,42,0.13);
    }

    .scenario-card::after {
      content: "";
      position: absolute;
      right: -62px;
      bottom: -72px;
      width: 180px;
      height: 180px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.18);
      box-shadow: inset 0 0 0 32px rgba(255,255,255,0.035);
      pointer-events: none;
    }

    .scenario-1 {
      background: linear-gradient(135deg, #334155, #0f172a);
    }

    .scenario-2 {
      background:
        radial-gradient(circle at 100% 0%, rgba(212,160,23,0.34), transparent 30%),
        linear-gradient(135deg, #172554, #2563eb);
    }

    .scenario-3 {
      background:
        radial-gradient(circle at 100% 0%, rgba(16,185,129,0.32), transparent 30%),
        linear-gradient(135deg, #064e3b, #059669);
    }

    .scenario-top {
      position: relative;
      display: flex;
      justify-content: space-between;
      gap: 14px;
      align-items: flex-start;
      margin-bottom: 18px;
    }

    .scenario-top span {
      color: rgba(255,255,255,0.72);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .scenario-top small {
      padding: 5px 9px;
      border-radius: 999px;
      color: #ffffff;
      background: rgba(255,255,255,0.16);
      font-weight: 850;
    }

    .scenario-card strong {
      position: relative;
      display: block;
      font-size: 28px;
      line-height: 1;
      letter-spacing: -0.045em;
    }

    .scenario-card p {
      position: relative;
      margin: 11px 0 0;
      color: rgba(255,255,255,0.74);
      font-size: 13px;
    }

    .scenario-line {
      position: relative;
      height: 8px;
      margin-top: 18px;
      overflow: hidden;
      border-radius: 999px;
      background: rgba(255,255,255,0.18);
    }

    .scenario-line div {
      width: 72%;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, #ffffff, rgba(255,255,255,0.55));
    }

    .waterfall-board {
      display: grid;
      gap: 13px;
    }

    .waterfall-card {
      display: grid;
      grid-template-columns: 48px minmax(0, 1fr) minmax(150px, auto);
      gap: 16px;
      align-items: center;
      padding: 17px;
      border-radius: 21px;
      border: 1px solid var(--line);
      background: linear-gradient(180deg, #ffffff, #f8fafc);
    }

    .waterfall-index {
      width: 42px;
      height: 42px;
      border-radius: 15px;
      display: grid;
      place-items: center;
      color: var(--blue);
      background: var(--blue-soft);
      border: 1px solid #bfdbfe;
      font-size: 12px;
      font-weight: 900;
    }

    .waterfall-copy h3 {
      margin: 0 0 5px;
      color: var(--ink-dark);
      font-size: 15px;
      line-height: 1.2;
    }

    .waterfall-copy p {
      margin: 0;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.55;
    }

    .waterfall-card strong {
      text-align: right;
      color: var(--ink-dark);
      font-size: 17px;
      white-space: nowrap;
    }

    .waterfall-card.tone-positive {
      background: linear-gradient(180deg, #ffffff, var(--emerald-soft));
      border-color: #a7f3d0;
    }

    .waterfall-card.tone-negative {
      background: linear-gradient(180deg, #ffffff, var(--danger-soft));
      border-color: #fecaca;
    }

    .waterfall-card.tone-highlight {
      color: #ffffff;
      background:
        radial-gradient(circle at 100% 0%, rgba(212,160,23,0.24), transparent 30%),
        linear-gradient(135deg, #0f172a, #172554);
      border-color: rgba(37,99,235,0.28);
    }

    .waterfall-card.tone-highlight .waterfall-index {
      color: #ffffff;
      background: rgba(255,255,255,0.14);
      border-color: rgba(255,255,255,0.16);
    }

    .waterfall-card.tone-highlight h3,
    .waterfall-card.tone-highlight p,
    .waterfall-card.tone-highlight strong {
      color: #ffffff;
    }

    .buyer-card {
      min-height: 215px;
      padding: 20px;
      border-top-width: 4px;
    }

    .buyer-1 { border-top-color: var(--blue); }
    .buyer-2 { border-top-color: var(--emerald); }
    .buyer-3 { border-top-color: var(--gold); }

    .buyer-header {
      display: flex;
      justify-content: space-between;
      gap: 14px;
      align-items: flex-start;
      margin-bottom: 14px;
    }

    .buyer-header small {
      padding: 6px 10px;
      border-radius: 999px;
      color: var(--blue);
      background: var(--blue-soft);
      font-size: 12px;
      font-weight: 900;
      white-space: nowrap;
    }

    .buyer-card h3 {
      margin: 0;
      color: var(--ink-dark);
      font-size: 19px;
      line-height: 1.18;
      letter-spacing: -0.03em;
    }

    .buyer-card p {
      margin: 12px 0 0;
      color: var(--graphite);
      line-height: 1.65;
    }

    .numbered-card-list {
      display: grid;
      gap: 13px;
    }

    .numbered-card {
      display: grid;
      grid-template-columns: 46px minmax(0, 1fr);
      gap: 15px;
      padding: 18px;
    }

    .number-pill {
      width: 40px;
      height: 40px;
      display: grid;
      place-items: center;
      border-radius: 14px;
      color: var(--blue);
      background: var(--blue-soft);
      border: 1px solid #bfdbfe;
      font-size: 12px;
      font-weight: 900;
    }

    .numbered-card h3 {
      margin: 0 0 7px;
      color: var(--ink-dark);
      font-size: 17px;
      letter-spacing: -0.025em;
    }

    .numbered-card p {
      margin: 0;
      color: var(--graphite);
      line-height: 1.67;
    }

    .premium-note {
      display: grid;
      grid-template-columns: 46px minmax(0, 1fr);
      gap: 15px;
      padding: 19px;
    }

    .note-icon {
      width: 42px;
      height: 42px;
      display: grid;
      place-items: center;
      border-radius: 15px;
      color: #7c5800;
      background: var(--gold-soft);
      font-weight: 900;
    }

    .premium-note strong {
      display: block;
      color: var(--ink-dark);
      margin-bottom: 7px;
    }

    .premium-note p {
      margin: 0;
      color: var(--graphite);
      line-height: 1.65;
    }

    .empty-state {
      padding: 17px 18px;
      border-radius: 18px;
      border: 1px dashed #cbd5e1;
      background: #fbfdff;
      color: var(--muted);
    }

    .report-footer {
      padding: 28px 56px;
      background: linear-gradient(180deg, #ffffff, #f8fafc);
      border-top: 1px solid var(--line);
    }

    .report-footer-inner {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      align-items: center;
      color: var(--muted);
      font-size: 12px;
      line-height: 1.55;
    }

    .footer-brand {
      color: var(--ink-dark);
      font-weight: 900;
    }

    @page {
      size: A4;
      margin: 11mm;
    }

    @media print {
      html,
      body {
        background: #ffffff;
      }

      .report-shell {
        width: 100%;
        max-width: none;
        margin: 0;
        border: 0;
        border-radius: 0;
        box-shadow: none;
      }

      .cover {
        min-height: 270mm;
        page-break-after: always;
      }

      .content {
        padding: 16px 0 28px;
        background: #ffffff;
      }

      .content-opening {
        margin-bottom: 22px;
        padding: 24px;
        box-shadow: none;
      }

      .content-opening h2 {
        font-size: 29px;
      }

      .content-opening-inner {
        grid-template-columns: minmax(0, 1.08fr) minmax(230px, 0.92fr);
        gap: 20px;
      }

      .disclaimer-banner {
        margin-bottom: 22px;
      }

      .report-section {
        margin-bottom: 26px;
      }

      .report-footer {
        padding: 18px 0 0;
      }

      .report-section,
      .definition-card,
      .buyer-card,
      .numbered-card,
      .premium-note,
      .premium-list li,
      .waterfall-card,
      .scenario-card,
      .content-opening,
      table {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    }

    @media (max-width: 980px) {
      .cover-kpi-grid,
      .cover-meta-grid,
      .definition-grid,
      .buyer-grid,
      .scenario-grid {
        grid-template-columns: 1fr 1fr;
      }

      .content-opening-inner {
        grid-template-columns: 1fr;
      }

      .cover h1 {
        font-size: 48px;
      }
    }

    @media (max-width: 680px) {
      .report-shell {
        margin: 0;
        border-radius: 0;
      }

      .cover,
      .content,
      .report-footer {
        padding-left: 24px;
        padding-right: 24px;
      }

      .cover-kpi-grid,
      .cover-meta-grid,
      .definition-grid,
      .buyer-grid,
      .scenario-grid {
        grid-template-columns: 1fr;
      }

      .cover h1 {
        font-size: 38px;
      }

      .content-opening h2 {
        font-size: 28px;
      }

      .section-header,
      .waterfall-card {
        grid-template-columns: 1fr;
      }

      .waterfall-card strong {
        text-align: left;
      }

      .report-footer-inner {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  </style>
</head>
<body>
  <main class="report-shell">
    <section class="cover">
      <div class="cover-top">
        <div class="brand-pill">
          <span class="brand-dot"></span>
          ${escapeHtml(meta.generatedBy)}
        </div>

        <div class="status-pill">${escapeHtml(meta.reportStatus)}</div>
      </div>

      <div class="cover-main">
        <div class="cover-kicker">M&amp;A Professional Export</div>

        <h1>
          ${escapeHtml(meta.companyName)}
          <span>Preliminary Valuation Report</span>
        </h1>

        <p class="cover-subtitle">
          Premium valuation, equity bridge, buyer readiness and risk review prepared as a decision-support workpaper for executive discussion.
        </p>

        <div class="cover-rule"></div>
      </div>

      ${renderKpiCards(topKpis)}

      <div class="cover-bottom">
        ${renderMetaCards(coverMeta)}
      </div>
    </section>

    <section class="content">
      ${renderSecondPageOpening(topKpis, meta)}

      <div class="disclaimer-banner">
        <strong>DSS Disclaimer</strong>
        ${escapeHtml(
          report.disclaimer ||
            "This document is a preliminary decision-support output generated within CEO's OS for internal strategic use only. It does not constitute legal, tax, audit, accounting or investment advice. All conclusions remain subject to human review, source validation, confirmatory due diligence and final approval."
        )}
      </div>

      ${renderSection(
        1,
        'Executive Summary',
        'High-level strategic takeaways for internal review and decision support.',
        renderBulletList(
          executiveSummary,
          `Preliminary review prepared for ${meta.companyName}. This report consolidates the valuation view, transaction perimeter, capital structure bridge and strategic fit considerations.`
        ),
        { featured: true, kicker: 'Executive view' }
      )}

      ${renderSection(
        2,
        'Company Snapshot',
        'Core business profile and target overview.',
        renderDefinitionGrid(companySnapshot, 'No company snapshot data available.'),
        { kicker: 'Target profile' }
      )}

      ${renderSection(
        3,
        'Transaction Overview',
        'Current deal framing, mandate context and perimeter.',
        renderDefinitionGrid(transactionOverview, 'No transaction overview available.'),
        { kicker: 'Transaction context' }
      )}

      ${renderSection(
        4,
        'Financial Inputs',
        'Base financial assumptions used for this preliminary valuation.',
        renderFinancialInputs(report),
        { kicker: 'Financial base' }
      )}

      ${renderSection(
        5,
        'EBITDA Adjustments',
        'Normalization items applied to derive a cleaner earnings base.',
        renderEbitdaAdjustments(report),
        { kicker: 'Quality of earnings' }
      )}

      ${renderSection(
        6,
        'Valuation Range',
        'Indicative low, base and high case valuation outputs.',
        renderValuationRange(report),
        { featured: true, kicker: 'Valuation output' }
      )}

      ${renderSection(
        7,
        'Enterprise Value & Equity Value',
        'Enterprise value framing and equity bridge after capital structure adjustments.',
        renderEnterpriseEquityGrid(report),
        { kicker: 'Value bridge' }
      )}

      ${renderSection(
        8,
        'Waterfall',
        'Bridge from Enterprise Value to Equity Value and seller proceeds.',
        renderWaterfall(report),
        { featured: true, kicker: 'Waterfall' }
      )}

      ${renderSection(
        9,
        'Buyer Matching',
        'Indicative buyer universe and preliminary strategic fit view.',
        renderBuyerMatching(report),
        { kicker: 'Buyer universe' }
      )}

      ${renderSection(
        10,
        'Investment Thesis',
        'Core reasons why the transaction may be strategically attractive.',
        renderNumberedCards(investmentThesis, 'No investment thesis available.'),
        { kicker: 'Thesis' }
      )}

      ${renderSection(
        11,
        'Risks & Mitigants',
        'Main risks identified at this stage and preliminary mitigation angles.',
        renderRisks(report),
        { kicker: 'Risk review' }
      )}

      ${renderSection(
        12,
        'Preliminary CIM',
        'Initial buyer-facing narrative and key positioning points.',
        renderNumberedCards(preliminaryCim, 'No preliminary CIM content available.'),
        { kicker: 'CIM draft' }
      )}

      ${renderSection(
        13,
        'Human Review Notes',
        'Items requiring explicit human validation before circulation or use.',
        renderBulletList(humanReviewNotes, 'No human review notes available.'),
        { kicker: 'Human oversight' }
      )}

      ${renderSection(
        14,
        'Appendix',
        'Supporting assumptions and complementary reference notes.',
        renderAppendix(report),
        { kicker: 'Appendix' }
      )}
    </section>

    <footer class="report-footer">
      <div class="report-footer-inner">
        <div>
          <span class="footer-brand">${escapeHtml(meta.generatedBy)}</span>
          · M&amp;A Professional Export · ${escapeHtml(meta.generatedDateLabel)}
        </div>
        <div>
          Internal decision-support document · Subject to human review and confirmatory diligence
        </div>
      </div>
    </footer>
  </main>
</body>
</html>`;
}

export default buildMAReportHtml;