function escapeHtml(value = '') {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value, currency = 'EUR') {
  const safeValue = toNumber(value);
  const symbol = currency === 'USD' ? '$' : '€';

  return `${new Intl.NumberFormat('es-ES', {
    maximumFractionDigits: 0
  }).format(safeValue)}${symbol}`;
}

function formatMultiple(value) {
  return `x${toNumber(value).toFixed(2)}`;
}

function formatPercent(value) {
  return `${toNumber(value).toFixed(1)}%`;
}

function buildList(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return '<li>No hay tesis de inversión disponible para este caso.</li>';
  }

  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
}

function buildComparables(comparables = []) {
  if (!Array.isArray(comparables) || comparables.length === 0) {
    return `
      <div class="empty-box">
        No hay comparables disponibles para este análisis.
      </div>
    `;
  }

  return comparables
    .map(
      (peer) => `
        <div class="comp-card">
          <div class="eyebrow">Comparable</div>
          <div class="comp-name">${escapeHtml(peer.name || 'Comparable')}</div>
          <div class="comp-multiple">${formatMultiple(peer.multiple)}</div>
          <div class="comp-note">${escapeHtml(peer.note || 'Sin comentario')}</div>
        </div>
      `
    )
    .join('');
}

export const maReportsApi = {
  exportExecutiveReport({ financials = {}, settings = {}, derived = {} }) {
    if (typeof window === 'undefined') return false;

    const currency = settings?.reportCurrency || 'EUR';
    const reportDate = new Date().toLocaleDateString('es-ES');

    const companyName = financials.name || 'Deal sin nombre';
    const sector = financials.sector || 'Sector no definido';

    const equityValue = toNumber(derived.equityBase);
    const enterpriseValue = toNumber(derived.evBase);
    const normalizedEbitda = toNumber(derived.normalizedEbitda);
    const adjustedMultiple = toNumber(derived.adjustedMultiple);
    const netDebt = toNumber(derived.netDebt);
    const wcAdjustment = toNumber(derived.wcAdjustment);
    const netProceeds = toNumber(derived.netProceeds);
    const feesVal = toNumber(derived.feesVal);
    const taxesVal = toNumber(derived.taxesVal);
    const qualityScore = toNumber(derived.qualityScore);
    const riskLevel = derived.riskLevel?.label || derived.riskLevel || 'N/A';

    const transactionFees = toNumber(financials.transactionFees);
    const taxRate = toNumber(financials.taxRate);
    const cashAtClosing = toNumber(derived.cashAtClosing);
    const escrow = toNumber(derived.escrow);
    const earnOut = toNumber(derived.earnOut);

    const html = `
      <html>
        <head>
          <title>CEO's OS - M&A Report - ${escapeHtml(companyName)}</title>
          <style>
            * {
              box-sizing: border-box;
            }

            body {
              font-family: Arial, Helvetica, sans-serif;
              margin: 0;
              padding: 0;
              color: #0f172a;
              background: #ffffff;
            }

            .page {
              max-width: 920px;
              margin: 40px auto;
              padding: 48px;
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              border-bottom: 4px solid #10b981;
              padding-bottom: 20px;
              margin-bottom: 34px;
            }

            .brand {
              font-size: 26px;
              font-weight: 900;
              letter-spacing: -0.03em;
            }

            .brand span {
              color: #10b981;
            }

            .meta {
              text-align: right;
              font-size: 11px;
              color: #64748b;
              text-transform: uppercase;
              font-weight: 800;
              line-height: 1.5;
            }

            .module-badge {
              display: inline-block;
              background: #ecfdf5;
              color: #047857;
              border: 1px solid #a7f3d0;
              border-radius: 999px;
              padding: 6px 10px;
              font-size: 11px;
              font-weight: 900;
              text-transform: uppercase;
              margin-bottom: 14px;
            }

            h1 {
              font-size: 38px;
              margin: 0 0 8px 0;
              letter-spacing: -0.04em;
            }

            h2 {
              font-size: 17px;
              margin-top: 36px;
              border-left: 4px solid #10b981;
              padding-left: 10px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }

            p,
            li {
              font-size: 14px;
              line-height: 1.6;
              color: #334155;
            }

            .subline {
              color: #64748b;
              font-size: 14px;
              margin-bottom: 22px;
            }

            .hero {
              background: linear-gradient(135deg, #0f172a, #064e3b);
              color: #ffffff;
              border-radius: 18px;
              padding: 28px;
              margin: 28px 0 30px;
              text-align: center;
            }

            .hero-title {
              color: #a7f3d0;
              font-size: 12px;
              text-transform: uppercase;
              font-weight: 900;
              margin-bottom: 8px;
              letter-spacing: 0.08em;
            }

            .hero-value {
              font-size: 46px;
              font-weight: 900;
              letter-spacing: -0.05em;
            }

            .hero-caption {
              margin-top: 8px;
              color: #d1fae5;
              font-size: 13px;
            }

            .grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 16px;
              margin: 28px 0;
            }

            .grid-2 {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
              margin: 28px 0;
            }

            .kpi {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 14px;
              padding: 18px;
            }

            .kpi-label {
              font-size: 10px;
              text-transform: uppercase;
              color: #64748b;
              font-weight: 900;
              margin-bottom: 8px;
              letter-spacing: 0.06em;
            }

            .kpi-value {
              font-size: 24px;
              font-weight: 900;
              color: #0f172a;
            }

            .waterfall {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 16px;
              padding: 20px;
              margin-top: 18px;
            }

            .row {
              display: flex;
              justify-content: space-between;
              gap: 12px;
              padding: 11px 0;
              border-bottom: 1px solid #e2e8f0;
              font-size: 14px;
            }

            .row:last-child {
              border-bottom: none;
            }

            .row strong {
              font-weight: 900;
            }

            .negative {
              color: #dc2626;
              font-weight: 800;
            }

            .positive {
              color: #059669;
              font-weight: 800;
            }

            .highlight {
              background: #e2e8f0;
              border-radius: 10px;
              padding: 12px;
              margin-top: 8px;
              font-weight: 900;
            }

            .comparables {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 14px;
              margin-top: 18px;
            }

            .comp-card {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 16px;
            }

            .eyebrow {
              font-size: 10px;
              color: #64748b;
              text-transform: uppercase;
              font-weight: 900;
              margin-bottom: 8px;
              letter-spacing: 0.06em;
            }

            .comp-name {
              font-weight: 900;
              font-size: 17px;
              margin-bottom: 8px;
            }

            .comp-multiple {
              font-weight: 900;
              font-size: 24px;
              color: #059669;
            }

            .comp-note {
              margin-top: 8px;
              font-size: 13px;
              color: #64748b;
              line-height: 1.5;
            }

            .empty-box {
              background: #f8fafc;
              border: 1px dashed #cbd5e1;
              border-radius: 14px;
              padding: 18px;
              color: #64748b;
              font-size: 14px;
            }

            .footer {
              margin-top: 48px;
              padding-top: 18px;
              border-top: 1px solid #e2e8f0;
              color: #94a3b8;
              text-align: center;
              font-size: 11px;
              line-height: 1.5;
            }

            @media print {
              .page {
                margin: 0 auto;
                padding: 32px;
              }
            }
          </style>
        </head>

        <body>
          <div class="page">
            <div class="header">
              <div>
                <div class="brand">CEO's <span>OS</span></div>
                <div class="subline">M&A Valuation Report</div>
              </div>

              <div class="meta">
                Strictly Confidential<br/>
                ${escapeHtml(reportDate)}<br/>
                M&A Workspace
              </div>
            </div>

            <div class="module-badge">M&A Report</div>

            <h1>${escapeHtml(companyName)}</h1>
            <div class="subline">
              Sector: ${escapeHtml(sector)} · Quality Score: ${escapeHtml(qualityScore)}/100 · Risk: ${escapeHtml(riskLevel)}
            </div>

            <p>${escapeHtml(derived.execSummary || 'Resumen ejecutivo no disponible para este caso.')}</p>

            <div class="hero">
              <div class="hero-title">Equity Value — Base Case</div>
              <div class="hero-value">${escapeHtml(formatCurrency(equityValue, currency))}</div>
              <div class="hero-caption">
                Valoración indicativa sujeta a due diligence, negociación y documentación final.
              </div>
            </div>

            <div class="grid">
              <div class="kpi">
                <div class="kpi-label">EBITDA Normalizado</div>
                <div class="kpi-value">${escapeHtml(formatCurrency(normalizedEbitda, currency))}</div>
              </div>

              <div class="kpi">
                <div class="kpi-label">Múltiplo Ajustado</div>
                <div class="kpi-value">${escapeHtml(formatMultiple(adjustedMultiple))}</div>
              </div>

              <div class="kpi">
                <div class="kpi-label">Net Proceeds</div>
                <div class="kpi-value">${escapeHtml(formatCurrency(netProceeds, currency))}</div>
              </div>
            </div>

            <h2>Investment Thesis</h2>
            <ul>
              ${buildList(derived.thesis)}
            </ul>

            <h2>Enterprise Value Bridge</h2>

            <div class="waterfall">
              <div class="row">
                <span>Enterprise Value</span>
                <span>${escapeHtml(formatCurrency(enterpriseValue, currency))}</span>
              </div>

              <div class="row">
                <span>Deuda neta</span>
                <span class="negative">-${escapeHtml(formatCurrency(netDebt, currency))}</span>
              </div>

              <div class="row">
                <span>Ajuste Working Capital</span>
                <span class="${wcAdjustment >= 0 ? 'positive' : 'negative'}">
                  ${wcAdjustment >= 0 ? '+' : '-'}${escapeHtml(formatCurrency(Math.abs(wcAdjustment), currency))}
                </span>
              </div>

              <div class="highlight row" style="border-bottom: none;">
                <strong>Equity Value</strong>
                <strong>${escapeHtml(formatCurrency(equityValue, currency))}</strong>
              </div>

              <div class="row">
                <span>Fees (${escapeHtml(formatPercent(transactionFees))})</span>
                <span class="negative">-${escapeHtml(formatCurrency(feesVal, currency))}</span>
              </div>

              <div class="row">
                <span>Impuestos (${escapeHtml(formatPercent(taxRate))})</span>
                <span class="negative">-${escapeHtml(formatCurrency(taxesVal, currency))}</span>
              </div>

              <div class="highlight row" style="border-bottom: none;">
                <strong>Net Proceeds</strong>
                <strong>${escapeHtml(formatCurrency(netProceeds, currency))}</strong>
              </div>
            </div>

            <h2>Deal Structure</h2>

            <div class="grid">
              <div class="kpi">
                <div class="kpi-label">Cash at Closing</div>
                <div class="kpi-value">${escapeHtml(formatPercent(cashAtClosing))}</div>
              </div>

              <div class="kpi">
                <div class="kpi-label">Escrow</div>
                <div class="kpi-value">${escapeHtml(formatPercent(escrow))}</div>
              </div>

              <div class="kpi">
                <div class="kpi-label">Earn-out</div>
                <div class="kpi-value">${escapeHtml(formatPercent(earnOut))}</div>
              </div>
            </div>

            <h2>Comparables</h2>

            <div class="comparables">
              ${buildComparables(derived.comparables)}
            </div>

            <div class="footer">
              Generado por CEO's OS — M&A Workspace. Este informe es orientativo y no sustituye due diligence financiera, fiscal, legal ni asesoramiento profesional.
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=1024,height=768');

    if (!printWindow) return false;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);

    return true;
  }
};