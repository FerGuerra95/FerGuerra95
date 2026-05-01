function escapeHtml(value) {
  if (value === null || value === undefined) return '';

  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function formatCurrency(value, currency = 'EUR') {
  const amount = Number(value);

  try {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(Number.isFinite(amount) ? amount : 0);
  } catch {
    return `${Math.round(Number.isFinite(amount) ? amount : 0).toLocaleString('es-ES')} ${currency}`;
  }
}

function formatMultiple(value) {
  const parsed = Number(value);
  return `${(Number.isFinite(parsed) ? parsed : 0).toFixed(1)}x`;
}

function formatPercent(value) {
  const parsed = Number(value);
  const safe = Number.isFinite(parsed) ? parsed : 0;
  const normalized = Math.abs(safe) <= 1 ? safe * 100 : safe;

  return `${normalized.toFixed(1)}%`;
}

function renderSection(number, title, subtitle, content) {
  return `
    <section class="section">
      <div class="section-header">
        <div class="section-number">${escapeHtml(number)}</div>
        <div>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(subtitle)}</p>
        </div>
      </div>
      ${content}
    </section>
  `;
}

function renderKeyValueGrid(items = []) {
  return `
    <div class="grid">
      ${safeArray(items)
        .map(
          (item) => `
            <article class="card">
              <span>${escapeHtml(item.label)}</span>
              <strong>${escapeHtml(item.value)}</strong>
            </article>
          `
        )
        .join('')}
    </div>
  `;
}

function renderFinancialInputs(items = []) {
  return `
    <table>
      <thead>
        <tr>
          <th>Metric</th>
          <th class="right">Value</th>
        </tr>
      </thead>
      <tbody>
        ${safeArray(items)
          .map(
            (item) => `
              <tr>
                <td>${escapeHtml(item.label)}</td>
                <td class="right strong">${escapeHtml(item.formattedValue)}</td>
              </tr>
            `
          )
          .join('')}
      </tbody>
    </table>
  `;
}

function renderEbitdaAdjustments(report) {
  const currency = report?.meta?.currency || 'EUR';
  const items = safeArray(report?.sections?.ebitdaAdjustments?.items);

  if (items.length === 0) {
    return `
      <div class="note">
        No EBITDA adjustments were provided. Reported EBITDA has been used as the normalized valuation base unless derived data indicates otherwise.
      </div>
    `;
  }

  return `
    <table>
      <thead>
        <tr>
          <th>Adjustment</th>
          <th>Rationale</th>
          <th class="right">Impact</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(
            (item) => `
              <tr>
                <td class="strong">${escapeHtml(item.label)}</td>
                <td>${escapeHtml(item.note)}</td>
                <td class="right strong">${escapeHtml(formatCurrency(item.amount, currency))}</td>
              </tr>
            `
          )
          .join('')}
        <tr class="total">
          <td colspan="2">Total EBITDA Adjustments</td>
          <td class="right">${escapeHtml(formatCurrency(report?.sections?.ebitdaAdjustments?.total, currency))}</td>
        </tr>
      </tbody>
    </table>
  `;
}

function renderValuationRange(report) {
  const currency = report?.meta?.currency || 'EUR';
  const multiples = report?.sections?.valuationRange?.multiples || {};
  const enterpriseValue = report?.sections?.valuationRange?.enterpriseValue || {};
  const equityValue = report?.sections?.valuationRange?.equityValue || {};

  return `
    <table>
      <thead>
        <tr>
          <th>Scenario</th>
          <th class="right">Multiple</th>
          <th class="right">Enterprise Value</th>
          <th class="right">Equity Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Low Case</td>
          <td class="right">${escapeHtml(formatMultiple(multiples.low))}</td>
          <td class="right strong">${escapeHtml(formatCurrency(enterpriseValue.low, currency))}</td>
          <td class="right strong">${escapeHtml(formatCurrency(equityValue.low, currency))}</td>
        </tr>
        <tr class="highlight">
          <td>Base Case</td>
          <td class="right">${escapeHtml(formatMultiple(multiples.base))}</td>
          <td class="right strong">${escapeHtml(formatCurrency(enterpriseValue.base, currency))}</td>
          <td class="right strong">${escapeHtml(formatCurrency(equityValue.base, currency))}</td>
        </tr>
        <tr>
          <td>High Case</td>
          <td class="right">${escapeHtml(formatMultiple(multiples.high))}</td>
          <td class="right strong">${escapeHtml(formatCurrency(enterpriseValue.high, currency))}</td>
          <td class="right strong">${escapeHtml(formatCurrency(equityValue.high, currency))}</td>
        </tr>
      </tbody>
    </table>
  `;
}

function renderWaterfall(report) {
  const currency = report?.meta?.currency || 'EUR';
  const rows = safeArray(report?.sections?.waterfall);

  return `
    <table>
      <thead>
        <tr>
          <th>Bridge Item</th>
          <th>Description</th>
          <th class="right">Low</th>
          <th class="right">Base</th>
          <th class="right">High</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => `
              <tr class="${row.type === 'total' ? 'total' : ''}">
                <td class="strong">${escapeHtml(row.label)}</td>
                <td>${escapeHtml(row.description)}</td>
                <td class="right">${escapeHtml(formatCurrency(row.low, currency))}</td>
                <td class="right">${escapeHtml(formatCurrency(row.base, currency))}</td>
                <td class="right">${escapeHtml(formatCurrency(row.high, currency))}</td>
              </tr>
            `
          )
          .join('')}
      </tbody>
    </table>
  `;
}

function renderBuyerMatching(items = []) {
  return `
    <div class="grid">
      ${safeArray(items)
        .map(
          (item) => `
            <article class="card">
              <span>${escapeHtml(item.type)}</span>
              <strong>${escapeHtml(item.name)}</strong>
              <p>${escapeHtml(item.rationale)}</p>
            </article>
          `
        )
        .join('')}
    </div>
  `;
}

function renderBulletList(items = []) {
  return `
    <ul>
      ${safeArray(items)
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join('')}
    </ul>
  `;
}

function renderRisks(items = []) {
  return `
    <table>
      <thead>
        <tr>
          <th>Risk</th>
          <th>Mitigant</th>
        </tr>
      </thead>
      <tbody>
        ${safeArray(items)
          .map(
            (item) => `
              <tr>
                <td class="strong">${escapeHtml(item.risk)}</td>
                <td>${escapeHtml(item.mitigant)}</td>
              </tr>
            `
          )
          .join('')}
      </tbody>
    </table>
  `;
}

function renderPreliminaryCIM(items = []) {
  return `
    <div class="grid two">
      ${safeArray(items)
        .map(
          (item) => `
            <article class="card">
              <strong>${escapeHtml(item.title)}</strong>
              <p>${escapeHtml(item.content)}</p>
            </article>
          `
        )
        .join('')}
    </div>
  `;
}

function renderAppendix(items = []) {
  return `
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Detail</th>
        </tr>
      </thead>
      <tbody>
        ${safeArray(items)
          .map(
            (item) => `
              <tr>
                <td class="strong">${escapeHtml(item.label)}</td>
                <td>${escapeHtml(item.value)}</td>
              </tr>
            `
          )
          .join('')}
      </tbody>
    </table>
  `;
}

export function buildMAReportHtml(report) {
  const meta = report?.meta || {};
  const summary = report?.summary || {};
  const sections = report?.sections || {};
  const currency = meta.currency || 'EUR';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(meta.reportTitle || 'M&A Preliminary Valuation Report')}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    :root {
      --ink: #172033;
      --muted: #667085;
      --soft: #f4f6f9;
      --line: #dfe4ec;
      --navy: #101828;
      --blue: #172554;
      --gold: #b88a44;
      --gold-soft: #f5ead9;
      --danger: #9f1239;
      --danger-soft: #fff1f2;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      color: var(--ink);
      background: #e8ecf3;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 14px;
      line-height: 1.55;
    }

    .shell {
      max-width: 1120px;
      margin: 32px auto;
      background: #fff;
      box-shadow: 0 18px 60px rgba(16, 24, 40, 0.08);
    }

    .cover {
      min-height: 720px;
      padding: 72px;
      color: #fff;
      background:
        radial-gradient(circle at 85% 15%, rgba(184, 138, 68, 0.42), transparent 28%),
        linear-gradient(135deg, #070b16 0%, #101828 48%, #172554 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .brand {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      align-items: flex-start;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .status {
      border: 1px solid rgba(255,255,255,0.24);
      border-radius: 999px;
      padding: 8px 14px;
      background: rgba(255,255,255,0.08);
      font-size: 12px;
    }

    .cover h1 {
      max-width: 780px;
      margin: 0;
      font-size: 58px;
      line-height: 0.96;
      letter-spacing: -0.06em;
    }

    .cover p {
      max-width: 680px;
      color: rgba(255,255,255,0.76);
      font-size: 18px;
    }

    .cover-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
    }

    .cover-card {
      padding: 18px;
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 18px;
      background: rgba(255,255,255,0.08);
    }

    .cover-card span {
      display: block;
      margin-bottom: 8px;
      color: rgba(255,255,255,0.55);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .page {
      padding: 54px 72px;
    }

    .section {
      margin-bottom: 42px;
      break-inside: avoid;
    }

    .section-header {
      display: flex;
      gap: 18px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--line);
    }

    .section-number {
      min-width: 42px;
      height: 42px;
      border-radius: 14px;
      color: var(--blue);
      background: var(--gold-soft);
      display: grid;
      place-items: center;
      font-weight: 900;
    }

    h2 {
      margin: 0;
      font-size: 22px;
      letter-spacing: -0.03em;
      color: var(--navy);
    }

    .section-header p {
      margin: 5px 0 0;
      color: var(--muted);
    }

    .disclaimer {
      padding: 22px;
      border: 1px solid #fecdd3;
      border-radius: 22px;
      color: var(--danger);
      background: var(--danger-soft);
    }

    .executive-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 18px;
    }

    .hero {
      padding: 24px;
      border-radius: 24px;
      color: #fff;
      background: linear-gradient(135deg, var(--navy), var(--blue));
    }

    .hero span,
    .mini span,
    .card span {
      display: block;
      margin-bottom: 8px;
      color: var(--muted);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .hero span {
      color: rgba(255,255,255,0.65);
    }

    .hero strong {
      display: block;
      font-size: 34px;
      line-height: 1;
    }

    .mini-grid {
      display: grid;
      gap: 14px;
    }

    .mini,
    .card {
      padding: 18px;
      border: 1px solid var(--line);
      border-radius: 18px;
      background: #fff;
    }

    .mini {
      background: var(--soft);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
    }

    .grid.two {
      grid-template-columns: repeat(2, 1fr);
    }

    .card strong,
    .mini strong {
      display: block;
      color: var(--navy);
      font-size: 16px;
    }

    .card p {
      margin: 10px 0 0;
      color: var(--muted);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid var(--line);
      background: #fff;
    }

    th {
      padding: 13px 14px;
      color: #475467;
      background: #f8fafc;
      border-bottom: 1px solid var(--line);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.12em;
      text-align: left;
      text-transform: uppercase;
    }

    td {
      padding: 14px;
      border-bottom: 1px solid var(--line);
      color: #344054;
      vertical-align: top;
    }

    tr:last-child td {
      border-bottom: 0;
    }

    .right {
      text-align: right;
    }

    .strong {
      font-weight: 800;
      color: var(--navy);
    }

    .highlight td {
      background: #f8fbff;
    }

    .total td {
      background: var(--gold-soft);
      font-weight: 900;
      color: var(--navy);
    }

    .note {
      padding: 18px;
      border-radius: 16px;
      background: #fffbf4;
      border-left: 4px solid var(--gold);
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 12px;
    }

    li {
      padding: 16px 18px;
      border: 1px solid var(--line);
      border-radius: 18px;
      background: #fff;
    }

    .footer {
      padding: 26px 72px;
      color: #667085;
      background: #f8fafc;
      border-top: 1px solid var(--line);
      display: flex;
      justify-content: space-between;
      gap: 24px;
      font-size: 12px;
    }

    @page {
      size: A4;
      margin: 12mm;
    }

    @media print {
      body {
        background: #fff;
      }

      .shell {
        max-width: none;
        margin: 0;
        box-shadow: none;
      }

      .cover {
        min-height: 265mm;
        page-break-after: always;
      }

      .page {
        padding: 24px 0;
      }

      .section,
      table,
      .card,
      .mini,
      .hero,
      li {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <main class="shell">
    <section class="cover">
      <div class="brand">
        <div>CEO’s OS</div>
        <div class="status">${escapeHtml(meta.reportStatus || 'Draft')}</div>
      </div>

      <div>
        <p>M&A Professional Export</p>
        <h1>${escapeHtml(meta.companyName || 'Target Company')}</h1>
        <p>Preliminary valuation, transaction assessment and buyer-readiness report generated through CEO’s OS decision-support workflow.</p>
      </div>

      <div class="cover-grid">
        <div class="cover-card"><span>Report Date</span><strong>${escapeHtml(meta.generatedDateLabel)}</strong></div>
        <div class="cover-card"><span>Currency</span><strong>${escapeHtml(currency)}</strong></div>
        <div class="cover-card"><span>Generated By</span><strong>${escapeHtml(meta.generatedBy)}</strong></div>
        <div class="cover-card"><span>Organization</span><strong>${escapeHtml(meta.organizationName)}</strong></div>
      </div>
    </section>

    <section class="page">
      ${renderSection('01', 'Disclaimer DSS', 'Decision Support System disclaimer and professional review notice.', `
        <div class="disclaimer">
          <strong>Decision Support System Notice.</strong>
          This report is generated as a preliminary decision-support document. It is not legal, tax, financial or investment advice, does not constitute a fairness opinion, and must not be relied upon as a final valuation without independent human review, documentary verification and professional judgement.
        </div>
      `)}

      ${renderSection('02', 'Executive Summary', 'Core valuation outputs and preliminary transaction view.', `
        <div class="executive-grid">
          <div class="hero">
            <span>Base Case Equity Value</span>
            <strong>${escapeHtml(formatCurrency(summary.equityValueBase, currency))}</strong>
            <p>Derived from adjusted EBITDA, selected valuation multiple and equity bridge adjustments.</p>
          </div>

          <div class="mini-grid">
            <div class="mini"><span>Adjusted EBITDA</span><strong>${escapeHtml(formatCurrency(summary.adjustedEbitda, currency))}</strong></div>
            <div class="mini"><span>Base Multiple</span><strong>${escapeHtml(formatMultiple(summary.multipleBase))}</strong></div>
            <div class="mini"><span>EBITDA Margin</span><strong>${escapeHtml(formatPercent(summary.ebitdaMargin))}</strong></div>
          </div>
        </div>
      `)}

      ${renderSection('03', 'Company Snapshot', 'High-level company and operating profile.', renderKeyValueGrid(sections.companySnapshot))}
      ${renderSection('04', 'Transaction Overview', 'Preliminary transaction context and report metadata.', renderKeyValueGrid(sections.transactionOverview))}
      ${renderSection('05', 'Financial Inputs', 'Primary financial data used for the valuation model.', renderFinancialInputs(sections.financialInputs))}
      ${renderSection('06', 'EBITDA Adjustments', 'Normalization adjustments applied to reported EBITDA.', renderEbitdaAdjustments(report))}
      ${renderSection('07', 'Valuation Range', 'Low, base and high case valuation outputs.', renderValuationRange(report))}

      ${renderSection('08', 'Enterprise Value', 'Enterprise valuation based on normalized EBITDA and selected multiples.', `
        <div class="note">Enterprise Value base case: <strong>${escapeHtml(formatCurrency(sections.enterpriseValue?.base, currency))}</strong>.</div>
      `)}

      ${renderSection('09', 'Equity Value', 'Equity bridge logic avoiding duplicate debt and cash treatment.', `
        <div class="note">${escapeHtml(sections.equityValue?.bridgeLogic)}</div>
      `)}

      ${renderSection('10', 'Waterfall', 'Enterprise Value to Equity Value bridge.', renderWaterfall(report))}
      ${renderSection('11', 'Buyer Matching', 'Indicative buyer universe and strategic fit rationale.', renderBuyerMatching(sections.buyerMatching))}
      ${renderSection('12', 'Investment Thesis', 'Preliminary value creation arguments.', renderBulletList(sections.investmentThesis))}
      ${renderSection('13', 'Risks & Mitigants', 'Key diligence areas and preliminary mitigants.', renderRisks(sections.risksAndMitigants))}
      ${renderSection('14', 'Preliminary CIM', 'Initial buyer-facing narrative blocks for a future CIM.', renderPreliminaryCIM(sections.preliminaryCIM))}
      ${renderSection('15', 'Human Review Notes', 'Required human validation before external use.', renderBulletList(sections.humanReviewNotes))}
      ${renderSection('16', 'Appendix', 'Assumptions, methodology and supporting notes.', renderAppendix(sections.appendix))}
    </section>

    <footer class="footer">
      <div><strong>CEO’s OS</strong><br />Private corporate intelligence platform.</div>
      <div>${escapeHtml(meta.reportStatus)} · ${escapeHtml(meta.generatedDateLabel)}</div>
    </footer>
  </main>
</body>
</html>`;
}

export default buildMAReportHtml;
