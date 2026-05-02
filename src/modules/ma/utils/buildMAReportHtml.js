function escapeHtml(value) {
  if (value === null || value === undefined) return '';

  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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

function formatPercent(value) {
  const parsed = safeNumber(value);
  const normalized = Math.abs(parsed) <= 1 ? parsed * 100 : parsed;

  return `${normalized.toFixed(1)}%`;
}

function getBarWidth(value, maxValue) {
  const safeValue = Math.abs(safeNumber(value));
  const safeMax = Math.max(Math.abs(safeNumber(maxValue)), 1);
  const width = Math.min(Math.max((safeValue / safeMax) * 100, 8), 100);

  return `${width.toFixed(0)}%`;
}

function renderSection(number, title, subtitle, content, options = {}) {
  const classes = [
    'report-section',
    options.featured ? 'featured-section' : '',
    options.compact ? 'compact-section' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return `
    <section class="${classes}">
      <div class="section-heading">
        <div class="section-number">${escapeHtml(number)}</div>
        <div class="section-title-block">
          <p class="section-kicker">${escapeHtml(options.kicker || 'M&A INTELLIGENCE')}</p>
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
    <div class="kv-grid">
      ${safeArray(items)
        .map(
          (item, index) => `
            <article class="kv-card accent-${(index % 5) + 1}">
              <div class="card-orb"></div>
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
    <div class="premium-table-shell">
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
    </div>
  `;
}

function renderEbitdaAdjustments(report) {
  const currency = report?.meta?.currency || 'EUR';
  const items = safeArray(report?.sections?.ebitdaAdjustments?.items);

  if (items.length === 0) {
    return `
      <div class="premium-note warning-note">
        <div class="note-icon">!</div>
        <div>
          <strong>No EBITDA adjustments provided</strong>
          <p>No normalization adjustments were entered. Reported EBITDA is used as the current valuation base, subject to human review and financial diligence.</p>
        </div>
      </div>
    `;
  }

  return `
    <div class="premium-table-shell">
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
          <tr class="total-row">
            <td colspan="2">Total EBITDA Adjustments</td>
            <td class="right">${escapeHtml(
              formatCurrency(report?.sections?.ebitdaAdjustments?.total, currency)
            )}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function renderValuationRange(report) {
  const currency = report?.meta?.currency || 'EUR';
  const multiples = report?.sections?.valuationRange?.multiples || {};
  const enterpriseValue = report?.sections?.valuationRange?.enterpriseValue || {};
  const equityValue = report?.sections?.valuationRange?.equityValue || {};
  const maxEquity = Math.max(
    Math.abs(safeNumber(equityValue.low)),
    Math.abs(safeNumber(equityValue.base)),
    Math.abs(safeNumber(equityValue.high)),
    1
  );

  return `
    <div class="scenario-grid">
      <article class="scenario-card scenario-low">
        <div class="scenario-top">
          <span>Low Case</span>
          <small>${escapeHtml(formatMultiple(multiples.low))}</small>
        </div>
        <strong>${escapeHtml(formatCurrency(equityValue.low, currency))}</strong>
        <div class="scenario-bar">
          <div style="width:${getBarWidth(equityValue.low, maxEquity)}"></div>
        </div>
        <p>Conservative case based on lower multiple assumptions.</p>
      </article>

      <article class="scenario-card scenario-base">
        <div class="scenario-top">
          <span>Base Case</span>
          <small>${escapeHtml(formatMultiple(multiples.base))}</small>
        </div>
        <strong>${escapeHtml(formatCurrency(equityValue.base, currency))}</strong>
        <div class="scenario-bar">
          <div style="width:${getBarWidth(equityValue.base, maxEquity)}"></div>
        </div>
        <p>Main committee reference case for valuation discussion.</p>
      </article>

      <article class="scenario-card scenario-high">
        <div class="scenario-top">
          <span>High Case</span>
          <small>${escapeHtml(formatMultiple(multiples.high))}</small>
        </div>
        <strong>${escapeHtml(formatCurrency(equityValue.high, currency))}</strong>
        <div class="scenario-bar">
          <div style="width:${getBarWidth(equityValue.high, maxEquity)}"></div>
        </div>
        <p>Upside case reflecting stronger valuation assumptions.</p>
      </article>
    </div>

    <div class="premium-table-shell">
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
          <tr class="highlight-row">
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
    </div>
  `;
}

function renderWaterfall(report) {
  const currency = report?.meta?.currency || 'EUR';
  const rows = safeArray(report?.sections?.waterfall);

  return `
    <div class="waterfall-board">
      ${rows
        .slice(0, 6)
        .map(
          (row, index) => `
            <article class="waterfall-node ${row.type === 'total' ? 'waterfall-total' : ''}">
              <span>${String(index + 1).padStart(2, '0')}</span>
              <h3>${escapeHtml(row.label)}</h3>
              <strong>${escapeHtml(formatCurrency(row.base, currency))}</strong>
            </article>
          `
        )
        .join('')}
    </div>

    <div class="premium-table-shell">
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
                <tr class="${row.type === 'total' ? 'total-row' : ''}">
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
    </div>
  `;
}

function renderBuyerMatching(items = []) {
  return `
    <div class="card-grid three">
      ${safeArray(items)
        .map(
          (item, index) => `
            <article class="buyer-card buyer-${(index % 3) + 1}">
              <div class="buyer-top">
                <span>${escapeHtml(item.type)}</span>
                <div class="buyer-badge">
                  ${item.fitScore !== null && item.fitScore !== undefined ? escapeHtml(item.fitScore) : 'FIT'}
                </div>
              </div>
              <h3>${escapeHtml(item.name)}</h3>
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
    <ul class="premium-list">
      ${safeArray(items)
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join('')}
    </ul>
  `;
}

function renderRisks(items = []) {
  return `
    <div class="premium-table-shell">
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
                  <td class="strong risk-cell">${escapeHtml(item.risk)}</td>
                  <td>${escapeHtml(item.mitigant)}</td>
                </tr>
              `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderPreliminaryCIM(items = []) {
  return `
    <div class="card-grid two">
      ${safeArray(items)
        .map(
          (item, index) => `
            <article class="cim-card module-${(index % 4) + 1}">
              <span>CIM MODULE</span>
              <h3>${escapeHtml(item.title)}</h3>
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
    <div class="premium-table-shell">
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
    </div>
  `;
}

export function buildMAReportHtml(report) {
  const meta = report?.meta || {};
  const summary = report?.summary || {};
  const sections = report?.sections || {};
  const currency = meta.currency || 'EUR';
  const safeCompanyName = meta.companyName || 'Target Company';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(meta.reportTitle || 'M&A Preliminary Valuation Report')}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    :root {
      --ink: #0f172a;
      --graphite: #243044;
      --muted: #64748b;
      --line: #dbe4f0;
      --paper: #ffffff;
      --soft: #f5f7fb;
      --navy: #030712;
      --navy-2: #0f172a;
      --blue: #172554;
      --blue-2: #2563eb;
      --cyan: #06b6d4;
      --emerald: #10b981;
      --violet: #7c3aed;
      --rose: #e11d48;
      --amber: #f59e0b;
      --gold: #b88a44;
      --gold-2: #e2b76d;
      --gold-soft: #f7ead3;
      --danger: #9f1239;
      --danger-soft: #fff1f2;
      --shadow-xl: 0 32px 120px rgba(15, 23, 42, 0.22);
      --shadow-card: 0 18px 48px rgba(15, 23, 42, 0.075);
    }

    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      color: var(--ink);
      background:
        radial-gradient(circle at 8% 0%, rgba(37, 99, 235, 0.22), transparent 26%),
        radial-gradient(circle at 94% 5%, rgba(226, 183, 109, 0.25), transparent 25%),
        radial-gradient(circle at 50% 100%, rgba(16, 185, 129, 0.12), transparent 26%),
        #e4e9f2;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 14px;
      line-height: 1.58;
    }

    .report-shell {
      width: min(1180px, 100%);
      margin: 34px auto;
      overflow: hidden;
      background: var(--paper);
      border: 1px solid rgba(255, 255, 255, 0.78);
      border-radius: 34px;
      box-shadow: var(--shadow-xl);
    }

    .cover {
      position: relative;
      min-height: 810px;
      padding: 76px;
      overflow: hidden;
      color: #ffffff;
      background:
        radial-gradient(circle at 78% 12%, rgba(226, 183, 109, 0.55), transparent 28%),
        radial-gradient(circle at 6% 4%, rgba(37, 99, 235, 0.48), transparent 34%),
        radial-gradient(circle at 40% 112%, rgba(16, 185, 129, 0.22), transparent 34%),
        linear-gradient(135deg, #020617 0%, #0f172a 48%, #172554 100%);
    }

    .cover::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px);
      background-size: 56px 56px;
      mask-image: linear-gradient(to bottom, rgba(0,0,0,0.92), transparent 88%);
      pointer-events: none;
    }

    .cover::after {
      content: "";
      position: absolute;
      right: -190px;
      bottom: -210px;
      width: 560px;
      height: 560px;
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 999px;
      box-shadow:
        inset 0 0 0 48px rgba(255, 255, 255, 0.028),
        inset 0 0 0 108px rgba(226, 183, 109, 0.04),
        0 0 100px rgba(37, 99, 235, 0.18);
    }

    .cover-side-label {
      position: absolute;
      right: 34px;
      top: 50%;
      transform: translateY(-50%) rotate(90deg);
      transform-origin: center;
      color: rgba(255, 255, 255, 0.16);
      font-size: 13px;
      font-weight: 950;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      z-index: 1;
    }

    .cover-top,
    .cover-content,
    .cover-dashboard {
      position: relative;
      z-index: 2;
    }

    .cover-top {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      align-items: flex-start;
      margin-bottom: 98px;
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 13px;
      font-size: 13px;
      font-weight: 950;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .brand-mark {
      width: 48px;
      height: 48px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 18px;
      display: grid;
      place-items: center;
      color: var(--gold-2);
      background:
        radial-gradient(circle at 24% 0%, rgba(255,255,255,0.24), transparent 38%),
        rgba(255,255,255,0.09);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.16),
        0 22px 48px rgba(0,0,0,0.28);
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      padding: 10px 17px;
      border: 1px solid rgba(255, 255, 255, 0.24);
      border-radius: 999px;
      color: rgba(255, 255, 255, 0.92);
      background: rgba(255, 255, 255, 0.095);
      font-size: 12px;
      font-weight: 900;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      backdrop-filter: blur(16px);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: var(--emerald);
      box-shadow: 0 0 0 5px rgba(16,185,129,0.14);
    }

    .eyebrow {
      margin: 0 0 18px;
      color: #f8ddb0;
      font-size: 12px;
      font-weight: 950;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .cover h1 {
      max-width: 870px;
      margin: 0;
      font-size: 70px;
      line-height: 0.9;
      letter-spacing: -0.075em;
    }

    .cover-subtitle {
      max-width: 760px;
      margin: 32px 0 0;
      color: rgba(255, 255, 255, 0.78);
      font-size: 18px;
      line-height: 1.74;
    }

    .cover-executive-line {
      width: min(620px, 100%);
      height: 1px;
      margin-top: 34px;
      background: linear-gradient(90deg, var(--gold-2), rgba(255,255,255,0.32), transparent);
    }

    .cover-dashboard {
      position: absolute;
      left: 76px;
      right: 76px;
      bottom: 72px;
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 15px;
    }

    .cover-card {
      min-height: 112px;
      padding: 19px;
      border: 1px solid rgba(255, 255, 255, 0.155);
      border-radius: 24px;
      background:
        linear-gradient(135deg, rgba(255,255,255,0.13), rgba(255,255,255,0.045));
      backdrop-filter: blur(18px);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.1),
        0 20px 46px rgba(0,0,0,0.16);
    }

    .cover-card span {
      display: block;
      margin-bottom: 11px;
      color: rgba(255, 255, 255, 0.56);
      font-size: 11px;
      font-weight: 950;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .cover-card strong {
      color: #ffffff;
      font-size: 14px;
      line-height: 1.36;
    }

    .page {
      position: relative;
      padding: 60px 76px;
      background:
        radial-gradient(circle at 100% 0%, rgba(37, 99, 235, 0.09), transparent 28%),
        radial-gradient(circle at 0% 14%, rgba(226, 183, 109, 0.075), transparent 22%),
        linear-gradient(180deg, rgba(248,250,252,0.84), rgba(255,255,255,0.99) 280px),
        var(--paper);
    }

    .page::before {
      content: "M&A";
      position: absolute;
      top: 22px;
      right: 54px;
      color: rgba(15, 23, 42, 0.035);
      font-size: 120px;
      font-weight: 950;
      letter-spacing: -0.1em;
      pointer-events: none;
    }

    .executive-index {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-bottom: 44px;
    }

    .index-card {
      position: relative;
      overflow: hidden;
      min-height: 112px;
      padding: 18px;
      border: 1px solid var(--line);
      border-radius: 24px;
      background:
        radial-gradient(circle at 100% 0%, rgba(37,99,235,0.11), transparent 32%),
        #ffffff;
      box-shadow: var(--shadow-card);
    }

    .index-card:nth-child(2) {
      background:
        radial-gradient(circle at 100% 0%, rgba(16,185,129,0.13), transparent 32%),
        #ffffff;
    }

    .index-card:nth-child(3) {
      background:
        radial-gradient(circle at 100% 0%, rgba(184,138,68,0.16), transparent 32%),
        #ffffff;
    }

    .index-card:nth-child(4) {
      background:
        radial-gradient(circle at 100% 0%, rgba(124,58,237,0.13), transparent 32%),
        #ffffff;
    }

    .index-card span {
      display: block;
      color: var(--gold);
      font-size: 10px;
      font-weight: 950;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .index-card strong {
      display: block;
      margin-top: 12px;
      color: var(--navy-2);
      font-size: 17px;
      line-height: 1.2;
    }

    .report-section {
      position: relative;
      margin-bottom: 48px;
      break-inside: avoid;
    }

    .featured-section {
      padding: 26px;
      border: 1px solid rgba(219, 228, 240, 0.95);
      border-radius: 32px;
      background:
        radial-gradient(circle at 100% 0%, rgba(37,99,235,0.08), transparent 26%),
        linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,250,252,0.96)),
        #ffffff;
      box-shadow: 0 22px 64px rgba(15, 23, 42, 0.075);
    }

    .section-heading {
      display: grid;
      grid-template-columns: 50px minmax(0, 1fr);
      gap: 18px;
      align-items: flex-start;
      margin-bottom: 24px;
      padding-bottom: 18px;
      border-bottom: 1px solid var(--line);
    }

    .section-number {
      width: 50px;
      height: 50px;
      border-radius: 18px;
      color: var(--blue);
      background:
        radial-gradient(circle at 30% 0%, #ffffff, transparent 56%),
        linear-gradient(135deg, #fff7ed, var(--gold-soft));
      display: grid;
      place-items: center;
      font-weight: 950;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.78),
        0 14px 30px rgba(184, 138, 68, 0.16);
    }

    .section-kicker {
      margin: 0 0 6px;
      color: var(--gold);
      font-size: 10px;
      font-weight: 950;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .section-heading h2 {
      margin: 0;
      color: var(--navy-2);
      font-size: 25px;
      line-height: 1.08;
      letter-spacing: -0.045em;
    }

    .section-heading p:not(.section-kicker) {
      margin: 8px 0 0;
      color: var(--muted);
    }

    .disclaimer {
      padding: 23px;
      border: 1px solid rgba(225, 29, 72, 0.22);
      border-radius: 25px;
      color: var(--danger);
      background:
        radial-gradient(circle at 100% 0%, rgba(225,29,72,0.12), transparent 30%),
        linear-gradient(135deg, var(--danger-soft), #ffffff);
      box-shadow: 0 16px 38px rgba(159, 18, 57, 0.065);
    }

    .disclaimer strong {
      display: block;
      margin-bottom: 8px;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    .executive-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.17fr) minmax(290px, 0.83fr);
      gap: 18px;
    }

    .hero-metric {
      position: relative;
      overflow: hidden;
      min-height: 268px;
      padding: 32px;
      border-radius: 32px;
      color: #ffffff;
      background:
        radial-gradient(circle at 90% 12%, rgba(226,183,109,0.46), transparent 30%),
        radial-gradient(circle at 0% 100%, rgba(6,182,212,0.28), transparent 32%),
        linear-gradient(135deg, var(--navy), var(--blue));
      box-shadow:
        0 28px 72px rgba(23, 37, 84, 0.26),
        inset 0 1px 0 rgba(255,255,255,0.11);
    }

    .hero-metric::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
      background-size: 40px 40px;
      mask-image: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent 84%);
    }

    .hero-metric::after {
      content: "";
      position: absolute;
      right: -80px;
      bottom: -100px;
      width: 270px;
      height: 270px;
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 999px;
      box-shadow: inset 0 0 0 46px rgba(255,255,255,0.032);
    }

    .hero-metric span,
    .mini-metric span,
    .kv-card span,
    .info-card span,
    .buyer-card span,
    .cim-card span {
      position: relative;
      z-index: 1;
      display: block;
      margin-bottom: 9px;
      color: var(--muted);
      font-size: 11px;
      font-weight: 950;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .hero-metric span {
      color: rgba(255,255,255,0.68);
    }

    .hero-metric strong {
      position: relative;
      z-index: 1;
      display: block;
      margin-top: 18px;
      font-size: 44px;
      line-height: 0.94;
      letter-spacing: -0.065em;
    }

    .hero-metric p {
      position: relative;
      z-index: 1;
      max-width: 560px;
      margin: 20px 0 0;
      color: rgba(255,255,255,0.76);
      font-size: 14px;
    }

    .mini-metrics {
      display: grid;
      gap: 14px;
    }

    .mini-metric,
    .kv-card,
    .info-card,
    .buyer-card,
    .cim-card,
    .premium-note {
      position: relative;
      overflow: hidden;
      padding: 20px;
      border: 1px solid var(--line);
      border-radius: 24px;
      background: #ffffff;
      box-shadow: var(--shadow-card);
    }

    .mini-metric {
      background:
        radial-gradient(circle at 100% 0%, rgba(37,99,235,0.12), transparent 31%),
        linear-gradient(135deg, var(--soft), #ffffff);
    }

    .mini-metric strong,
    .kv-card strong,
    .info-card h3,
    .info-card strong,
    .buyer-card h3,
    .cim-card h3 {
      position: relative;
      z-index: 1;
      display: block;
      color: var(--navy-2);
      font-size: 18px;
      line-height: 1.22;
      letter-spacing: -0.025em;
    }

    .kv-grid,
    .card-grid.three {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 15px;
    }

    .card-grid.two {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 15px;
    }

    .card-orb {
      position: absolute;
      inset: auto -46px -64px auto;
      width: 150px;
      height: 150px;
      border-radius: 999px;
      opacity: 0.2;
      pointer-events: none;
    }

    .accent-1 .card-orb { background: var(--blue-2); }
    .accent-2 .card-orb { background: var(--emerald); }
    .accent-3 .card-orb { background: var(--gold); }
    .accent-4 .card-orb { background: var(--violet); }
    .accent-5 .card-orb { background: var(--cyan); }

    .accent-1 { border-top: 4px solid var(--blue-2); }
    .accent-2 { border-top: 4px solid var(--emerald); }
    .accent-3 { border-top: 4px solid var(--gold); }
    .accent-4 { border-top: 4px solid var(--violet); }
    .accent-5 { border-top: 4px solid var(--cyan); }

    .info-card p,
    .buyer-card p,
    .cim-card p,
    .premium-note p {
      position: relative;
      z-index: 1;
      margin: 11px 0 0;
      color: var(--muted);
    }

    .scenario-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }

    .scenario-card {
      position: relative;
      overflow: hidden;
      padding: 24px;
      border-radius: 26px;
      color: #ffffff;
      min-height: 168px;
      box-shadow: 0 24px 58px rgba(15, 23, 42, 0.13);
    }

    .scenario-card::after {
      content: "";
      position: absolute;
      right: -58px;
      bottom: -76px;
      width: 184px;
      height: 184px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,0.2);
      box-shadow: inset 0 0 0 28px rgba(255,255,255,0.035);
    }

    .scenario-low {
      background:
        radial-gradient(circle at 90% 8%, rgba(148,163,184,0.28), transparent 30%),
        linear-gradient(135deg, #334155, #0f172a);
    }

    .scenario-base {
      background:
        radial-gradient(circle at 90% 8%, rgba(226,183,109,0.42), transparent 31%),
        linear-gradient(135deg, #172554, #2563eb);
    }

    .scenario-high {
      background:
        radial-gradient(circle at 90% 8%, rgba(16,185,129,0.34), transparent 31%),
        linear-gradient(135deg, #064e3b, #059669);
    }

    .scenario-top {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: flex-start;
      margin-bottom: 18px;
    }

    .scenario-top span {
      color: rgba(255,255,255,0.72);
      font-size: 11px;
      font-weight: 950;
      letter-spacing: 0.08em;
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
      z-index: 1;
      display: block;
      font-size: 29px;
      line-height: 1;
      letter-spacing: -0.045em;
    }

    .scenario-card p {
      position: relative;
      z-index: 1;
      margin: 11px 0 0;
      color: rgba(255,255,255,0.74);
      font-size: 13px;
    }

    .scenario-bar {
      position: relative;
      z-index: 1;
      height: 8px;
      margin-top: 18px;
      overflow: hidden;
      border-radius: 999px;
      background: rgba(255,255,255,0.18);
    }

    .scenario-bar div {
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, #ffffff, rgba(255,255,255,0.55));
    }

    .premium-table-shell {
      overflow: hidden;
      border-radius: 24px;
      box-shadow: 0 16px 42px rgba(15, 23, 42, 0.052);
    }

    table {
      width: 100%;
      overflow: hidden;
      border-collapse: separate;
      border-spacing: 0;
      border: 1px solid var(--line);
      border-radius: 24px;
      background: #ffffff;
    }

    th {
      padding: 15px 16px;
      color: #475467;
      background:
        linear-gradient(180deg, #ffffff, #f8fafc);
      border-bottom: 1px solid var(--line);
      font-size: 11px;
      font-weight: 950;
      letter-spacing: 0.08em;
      text-align: left;
      text-transform: uppercase;
    }

    td {
      padding: 15px 16px;
      border-bottom: 1px solid var(--line);
      color: #344054;
      vertical-align: top;
    }

    tr:last-child td {
      border-bottom: 0;
    }

    tbody tr:nth-child(even):not(.total-row):not(.highlight-row) td {
      background: #fbfdff;
    }

    .right {
      text-align: right;
    }

    .strong {
      font-weight: 850;
      color: var(--navy-2);
    }

    .highlight-row td {
      background: #eef5ff;
    }

    .total-row td {
      color: var(--navy-2);
      background:
        linear-gradient(135deg, var(--gold-soft), #fff7ed);
      font-weight: 950;
    }

    .risk-cell {
      color: var(--danger);
    }

    .premium-note {
      display: grid;
      grid-template-columns: 44px 1fr;
      gap: 15px;
      align-items: flex-start;
      border-left: 5px solid var(--gold);
      background:
        radial-gradient(circle at 100% 0%, rgba(184,138,68,0.13), transparent 31%),
        linear-gradient(135deg, #fffbf4, #ffffff);
    }

    .warning-note {
      border-left-color: var(--amber);
    }

    .note-icon {
      width: 44px;
      height: 44px;
      border-radius: 16px;
      display: grid;
      place-items: center;
      color: #92400e;
      background: #fef3c7;
      font-weight: 950;
    }

    .waterfall-board {
      display: grid;
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 20px;
    }

    .waterfall-node {
      position: relative;
      min-height: 144px;
      padding: 16px;
      border: 1px solid var(--line);
      border-radius: 22px;
      background:
        radial-gradient(circle at 100% 0%, rgba(37,99,235,0.11), transparent 31%),
        #ffffff;
      box-shadow: 0 14px 32px rgba(15, 23, 42, 0.048);
    }

    .waterfall-node span {
      display: inline-grid;
      width: 31px;
      height: 31px;
      place-items: center;
      border-radius: 12px;
      color: var(--blue);
      background: #eef4ff;
      font-size: 11px;
      font-weight: 950;
    }

    .waterfall-node h3 {
      margin: 14px 0 0;
      color: var(--navy-2);
      font-size: 14px;
      line-height: 1.16;
      letter-spacing: -0.02em;
    }

    .waterfall-node strong {
      display: block;
      margin-top: 9px;
      color: var(--gold);
      font-size: 13px;
      line-height: 1.15;
    }

    .waterfall-total {
      color: #ffffff;
      background:
        radial-gradient(circle at 100% 0%, rgba(226,183,109,0.36), transparent 31%),
        linear-gradient(135deg, var(--navy-2), var(--blue));
    }

    .waterfall-total h3,
    .waterfall-total strong {
      color: #ffffff;
    }

    .waterfall-total span {
      color: #fff;
      background: rgba(255,255,255,0.16);
    }

    .buyer-card {
      min-height: 225px;
      background:
        radial-gradient(circle at 100% 0%, rgba(37,99,235,0.11), transparent 32%),
        #ffffff;
    }

    .buyer-top {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .buyer-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 48px;
      padding: 6px 10px;
      border-radius: 999px;
      color: var(--blue);
      background: #eef4ff;
      font-size: 12px;
      font-weight: 900;
    }

    .buyer-1 { border-top: 4px solid var(--blue-2); }
    .buyer-2 { border-top: 4px solid var(--emerald); }
    .buyer-3 { border-top: 4px solid var(--gold); }

    .cim-card {
      min-height: 190px;
      background:
        radial-gradient(circle at 100% 0%, rgba(124,58,237,0.11), transparent 31%),
        #ffffff;
    }

    .module-1 { border-left: 5px solid var(--blue-2); }
    .module-2 { border-left: 5px solid var(--emerald); }
    .module-3 { border-left: 5px solid var(--gold); }
    .module-4 { border-left: 5px solid var(--violet); }

    .premium-list {
      margin: 0;
      padding: 0;
      display: grid;
      gap: 12px;
      list-style: none;
    }

    .premium-list li {
      position: relative;
      padding: 17px 18px 17px 47px;
      border: 1px solid var(--line);
      border-radius: 19px;
      background:
        linear-gradient(135deg, #ffffff, #f8fafc);
      color: var(--graphite);
      box-shadow: 0 11px 28px rgba(15, 23, 42, 0.038);
    }

    .premium-list li::before {
      content: "";
      position: absolute;
      left: 19px;
      top: 24px;
      width: 9px;
      height: 9px;
      border-radius: 999px;
      background: var(--gold);
      box-shadow: 0 0 0 4px var(--gold-soft);
    }

    .footer {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      padding: 30px 76px;
      color: #667085;
      background:
        linear-gradient(180deg, #ffffff, #f8fafc);
      border-top: 1px solid var(--line);
      font-size: 12px;
    }

    .footer strong {
      color: var(--navy-2);
    }

    @page {
      size: A4;
      margin: 10mm;
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

      .page {
        padding: 20px 0;
        background: #ffffff;
      }

      .page::before {
        display: none;
      }

      .report-section,
      table,
      .kv-card,
      .info-card,
      .buyer-card,
      .cim-card,
      .premium-note,
      .premium-list li,
      .hero-metric,
      .mini-metric,
      .disclaimer,
      .scenario-card,
      .waterfall-node,
      .index-card {
        break-inside: avoid;
        page-break-inside: avoid;
      }

      .footer {
        padding: 16px 0 0;
        background: #ffffff;
      }

      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }

    @media (max-width: 920px) {
      .report-shell {
        margin: 0;
        border-radius: 0;
      }

      .cover,
      .page,
      .footer {
        padding-left: 28px;
        padding-right: 28px;
      }

      .cover-dashboard,
      .executive-grid,
      .kv-grid,
      .card-grid.three,
      .card-grid.two,
      .scenario-grid,
      .waterfall-board,
      .executive-index {
        grid-template-columns: 1fr;
      }

      .cover-dashboard {
        position: relative;
        left: auto;
        right: auto;
        bottom: auto;
        margin-top: 60px;
      }

      .cover h1 {
        font-size: 42px;
      }

      .cover-side-label {
        display: none;
      }
    }
  </style>
</head>
<body>
  <main class="report-shell">
    <section class="cover">
      <div class="cover-side-label">Strictly Confidential</div>

      <div class="cover-top">
        <div class="brand">
          <div class="brand-mark">C</div>
          <div>CEO's OS</div>
        </div>

        <div class="status-pill">
          <span class="status-dot"></span>
          ${escapeHtml(meta.reportStatus || 'Draft')}
        </div>
      </div>

      <div class="cover-content">
        <p class="eyebrow">M&amp;A Professional Report</p>
        <h1>${escapeHtml(safeCompanyName)}</h1>
        <p class="cover-subtitle">
          Premium valuation, equity bridge, buyer readiness and risk review prepared as a decision-support workpaper for executive discussion.
        </p>
        <div class="cover-executive-line"></div>
      </div>

      <div class="cover-dashboard">
        <div class="cover-card"><span>Report Date</span><strong>${escapeHtml(meta.generatedDateLabel)}</strong></div>
        <div class="cover-card"><span>Currency</span><strong>${escapeHtml(currency)}</strong></div>
        <div class="cover-card"><span>Generated By</span><strong>${escapeHtml(meta.generatedBy || "CEO's OS")}</strong></div>
        <div class="cover-card"><span>Document Status</span><strong>${escapeHtml(meta.reportStatus || 'Draft')}</strong></div>
      </div>
    </section>

    <section class="page">
      <div class="executive-index">
        <article class="index-card">
          <span>01</span>
          <strong>Valuation and Equity Bridge</strong>
        </article>
        <article class="index-card">
          <span>02</span>
          <strong>Buyer Readiness</strong>
        </article>
        <article class="index-card">
          <span>03</span>
          <strong>Risks and Mitigants</strong>
        </article>
        <article class="index-card">
          <span>04</span>
          <strong>Human Review Required</strong>
        </article>
      </div>

      ${renderSection('01', 'Decision Support Disclaimer', 'Professional review notice and reliance limitation.', `
        <div class="disclaimer">
          <strong>Decision Support System Notice.</strong>
          This report is a preliminary decision-support document. It is not legal, tax, financial or investment advice, does not constitute a fairness opinion, and should not be relied upon as a final valuation without independent human review, documentary verification and professional judgement.
        </div>
      `, { kicker: 'Governance' })}

      ${renderSection('02', 'Executive Summary', 'Core valuation outputs and preliminary transaction view.', `
        <div class="executive-grid">
          <div class="hero-metric">
            <span>Base Case Equity Value</span>
            <strong>${escapeHtml(formatCurrency(summary.equityValueBase, currency))}</strong>
            <p>Derived from adjusted EBITDA, selected valuation multiple and equity bridge adjustments. This figure should be validated against diligence findings before external use.</p>
          </div>

          <div class="mini-metrics">
            <div class="mini-metric"><span>Adjusted EBITDA</span><strong>${escapeHtml(formatCurrency(summary.adjustedEbitda, currency))}</strong></div>
            <div class="mini-metric"><span>Base Multiple</span><strong>${escapeHtml(formatMultiple(summary.multipleBase))}</strong></div>
            <div class="mini-metric"><span>EBITDA Margin</span><strong>${escapeHtml(formatPercent(summary.ebitdaMargin))}</strong></div>
          </div>
        </div>
      `, { kicker: 'Executive View', featured: true })}

      ${renderSection('03', 'Company Snapshot', 'High-level company and operating profile.', renderKeyValueGrid(sections.companySnapshot), { kicker: 'Target Profile' })}
      ${renderSection('04', 'Transaction Overview', 'Preliminary transaction context and report metadata.', renderKeyValueGrid(sections.transactionOverview), { kicker: 'Transaction Context' })}
      ${renderSection('05', 'Financial Inputs', 'Primary financial data used for the valuation model.', renderFinancialInputs(sections.financialInputs), { kicker: 'Financial Base' })}
      ${renderSection('06', 'EBITDA Adjustments', 'Normalization adjustments applied to reported EBITDA.', renderEbitdaAdjustments(report), { kicker: 'Quality of Earnings' })}
      ${renderSection('07', 'Valuation Range', 'Low, base and high case valuation outputs.', renderValuationRange(report), { kicker: 'Valuation Output', featured: true })}

      ${renderSection('08', 'Enterprise Value', 'Enterprise valuation based on normalized EBITDA and selected multiples.', `
        <div class="premium-note"><div class="note-icon">EV</div><div><strong>Enterprise Value base case</strong><p>${escapeHtml(formatCurrency(sections.enterpriseValue?.base, currency))}</p></div></div>
      `, { kicker: 'EV Bridge' })}

      ${renderSection('09', 'Equity Value', 'Equity bridge logic avoiding duplicate debt and cash treatment.', `
        <div class="premium-note"><div class="note-icon">EQ</div><div><strong>Equity bridge logic</strong><p>${escapeHtml(sections.equityValue?.bridgeLogic)}</p></div></div>
      `, { kicker: 'Shareholder Value' })}

      ${renderSection('10', 'Waterfall', 'Enterprise Value to Equity Value bridge.', renderWaterfall(report), { kicker: 'Waterfall', featured: true })}
      ${renderSection('11', 'Buyer Matching', 'Indicative buyer universe and strategic fit rationale.', renderBuyerMatching(sections.buyerMatching), { kicker: 'Buyer Universe' })}
      ${renderSection('12', 'Investment Thesis', 'Preliminary value creation arguments.', renderBulletList(sections.investmentThesis), { kicker: 'Thesis' })}
      ${renderSection('13', 'Risks and Mitigants', 'Key diligence areas and preliminary mitigants.', renderRisks(sections.risksAndMitigants), { kicker: 'Risk Review' })}
      ${renderSection('14', 'Preliminary CIM', 'Initial buyer-facing narrative blocks for a future CIM.', renderPreliminaryCIM(sections.preliminaryCIM), { kicker: 'CIM Draft' })}
      ${renderSection('15', 'Human Review Notes', 'Required human validation before external use.', renderBulletList(sections.humanReviewNotes), { kicker: 'Human Oversight' })}
      ${renderSection('16', 'Appendix', 'Assumptions, methodology and supporting notes.', renderAppendix(sections.appendix), { kicker: 'Appendix' })}
    </section>

    <footer class="footer">
      <div><strong>CEO's OS</strong><br />Private corporate intelligence platform.</div>
      <div>${escapeHtml(meta.reportStatus || 'Draft')} - ${escapeHtml(meta.generatedDateLabel)}</div>
    </footer>
  </main>
</body>
</html>`;
}

export default buildMAReportHtml;