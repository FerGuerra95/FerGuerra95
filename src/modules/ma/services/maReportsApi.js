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

function buildReportId(companyName = '') {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const safeName = String(companyName || 'deal')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 18);

  return `MA-${datePart}-${safeName || 'DEAL'}`;
}

function normalizeRiskLabel(riskLevel = '') {
  return String(riskLevel || '').trim().toLowerCase();
}

function buildDecisionSignal({ qualityScore = 0, riskLevel = '' }) {
  const safeQuality = toNumber(qualityScore);
  const safeRisk = normalizeRiskLabel(riskLevel);

  const isHighRisk =
    safeRisk.includes('alto') ||
    safeRisk.includes('high') ||
    safeRisk.includes('critical') ||
    safeRisk.includes('crítico');

  const isMediumRisk =
    safeRisk.includes('medio') ||
    safeRisk.includes('medium') ||
    safeRisk.includes('moderate') ||
    safeRisk.includes('moderado');

  if (safeQuality >= 75 && !isHighRisk) {
    return {
      signal: 'Attractive',
      tone: 'positive',
      nextStep: 'Proceed to financial due diligence and buyer/investor validation.'
    };
  }

  if (safeQuality >= 60 || isMediumRisk) {
    return {
      signal: 'Proceed with diligence',
      tone: 'watch',
      nextStep: 'Validate assumptions, risk exposure and transaction structure before decision.'
    };
  }

  return {
    signal: 'Caution',
    tone: 'caution',
    nextStep: 'Strengthen financial evidence and reduce key risks before proceeding.'
  };
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
    .slice(0, 3)
    .map(
      (peer) => `
        <div class="comp-card avoid-break">
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
    const reportId = buildReportId(companyName);

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

    const decision = buildDecisionSignal({
      qualityScore,
      riskLevel
    });

    const html = `
      <html>
        <head>
          <title>CEO's OS - M&A Report - ${escapeHtml(companyName)}</title>

          <style>
            @page {
              size: A4;
              margin: 0;
            }

            * {
              box-sizing: border-box;
            }

            html,
            body {
              width: 210mm;
              margin: 0;
              padding: 0;
            }

            body {
              font-family:
                Inter,
                ui-sans-serif,
                system-ui,
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                Arial,
                Helvetica,
                sans-serif;
              color: #0f172a;
              background: #f8fafc;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            .document {
              width: 210mm;
              margin: 0 auto;
              background: #f8fafc;
            }

            .report-page {
              width: 210mm;
              min-height: 297mm;
              margin: 0 auto 18px;
              padding: 12mm;
              background: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 24px;
              box-shadow: 0 28px 80px rgba(15, 23, 42, 0.12);
              position: relative;
              overflow: hidden;
              display: flex;
              flex-direction: column;
            }

            .report-page::before {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 6px;
              background: linear-gradient(90deg, #020617, #10b981, #0ea5e9);
            }

            .report-page:not(.last) {
              break-after: page;
              page-break-after: always;
            }

            .report-page.last {
              break-after: auto;
              page-break-after: auto;
            }

            .page-body {
              flex: 1;
            }

            .avoid-break,
            .section,
            .panel,
            .kpi,
            .waterfall,
            .comp-card,
            .methodology,
            .method-card,
            .disclaimer,
            .hero,
            .executive-summary,
            .decision-panel,
            .report-footer,
            .prepared-panel,
            .prepared-item,
            .closing-panel,
            .summary-grid {
              break-inside: avoid;
              page-break-inside: avoid;
            }

            h1,
            h2,
            h3 {
              break-after: avoid;
              page-break-after: avoid;
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              gap: 22px;
              padding-bottom: 16px;
              margin-bottom: 20px;
              border-bottom: 1px solid #e2e8f0;
            }

            .brand-row {
              display: flex;
              align-items: center;
              gap: 10px;
            }

            .brand-mark {
              width: 34px;
              height: 34px;
              border-radius: 12px;
              display: grid;
              place-items: center;
              background: linear-gradient(135deg, #020617, #10b981);
              color: #ffffff;
              font-weight: 950;
              font-size: 13px;
              box-shadow: 0 10px 20px rgba(16, 185, 129, 0.22);
            }

            .brand {
              font-size: 24px;
              font-weight: 950;
              letter-spacing: -0.05em;
              color: #020617;
            }

            .brand span {
              color: #059669;
            }

            .subline {
              color: #64748b;
              font-size: 11px;
              line-height: 1.4;
            }

            .meta {
              text-align: right;
              font-size: 9.5px;
              color: #475569;
              text-transform: uppercase;
              font-weight: 900;
              line-height: 1.55;
              letter-spacing: 0.08em;
            }

            .meta strong {
              color: #020617;
            }

            .module-badge {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              background: #ecfdf5;
              color: #047857;
              border: 1px solid #a7f3d0;
              border-radius: 999px;
              padding: 6px 10px;
              font-size: 9.5px;
              font-weight: 950;
              text-transform: uppercase;
              margin-bottom: 12px;
              letter-spacing: 0.08em;
            }

            .module-badge::before {
              content: "";
              width: 7px;
              height: 7px;
              border-radius: 999px;
              background: #10b981;
              box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.12);
            }

            h1 {
              font-size: 35px;
              margin: 0 0 8px 0;
              letter-spacing: -0.055em;
              line-height: 1;
              color: #020617;
            }

            h2 {
              font-size: 12.5px;
              margin: 18px 0 10px;
              color: #020617;
              text-transform: uppercase;
              letter-spacing: 0.11em;
              display: flex;
              align-items: center;
              gap: 9px;
            }

            h2::before {
              content: "";
              width: 4px;
              height: 16px;
              border-radius: 999px;
              background: linear-gradient(180deg, #10b981, #0ea5e9);
            }

            h3 {
              font-size: 13px;
              margin: 0 0 6px;
              color: #0f172a;
            }

            p,
            li {
              font-size: 11.2px;
              line-height: 1.48;
              color: #334155;
            }

            ul {
              padding-left: 17px;
              margin: 0;
            }

            li {
              margin-bottom: 3px;
            }

            .section {
              margin-bottom: 12px;
            }

            .deal-meta {
              display: flex;
              flex-wrap: wrap;
              gap: 7px;
              margin: 10px 0 13px;
            }

            .deal-pill {
              display: inline-flex;
              align-items: center;
              border: 1px solid #e2e8f0;
              background: #f8fafc;
              color: #475569;
              border-radius: 999px;
              padding: 5px 9px;
              font-size: 10px;
              font-weight: 850;
            }

            .prepared-panel {
              display: grid;
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 9px;
              margin: 12px 0 13px;
            }

            .prepared-item {
              padding: 10px;
              border-radius: 14px;
              border: 1px solid #e2e8f0;
              background: #f8fafc;
            }

            .prepared-label {
              font-size: 8.5px;
              font-weight: 950;
              color: #64748b;
              letter-spacing: 0.09em;
              text-transform: uppercase;
              margin-bottom: 4px;
            }

            .prepared-value {
              font-size: 10.8px;
              font-weight: 850;
              color: #0f172a;
              line-height: 1.25;
            }

            .executive-summary {
              margin: 13px 0 16px;
              padding: 13px 15px;
              border-radius: 16px;
              background:
                linear-gradient(135deg, rgba(248, 250, 252, 0.95), rgba(236, 253, 245, 0.62));
              border: 1px solid #dbeafe;
            }

            .executive-summary p {
              margin: 0;
            }

            .hero {
              background:
                radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.22), transparent 28%),
                linear-gradient(135deg, #020617, #0f172a 48%, #064e3b);
              color: #ffffff;
              border-radius: 22px;
              padding: 25px 26px;
              margin: 18px 0 18px;
              text-align: center;
              border: 1px solid rgba(16, 185, 129, 0.28);
              box-shadow:
                0 20px 42px rgba(15, 23, 42, 0.22),
                inset 0 1px 0 rgba(255, 255, 255, 0.08);
            }

            .hero-title {
              color: #a7f3d0;
              font-size: 10px;
              text-transform: uppercase;
              font-weight: 950;
              margin-bottom: 7px;
              letter-spacing: 0.12em;
            }

            .hero-value {
              font-size: 46px;
              font-weight: 950;
              letter-spacing: -0.06em;
              line-height: 1;
            }

            .hero-caption {
              margin-top: 8px;
              color: #d1fae5;
              font-size: 11px;
            }

            .grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 10px;
              margin: 14px 0;
            }

            .summary-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr) !important;
              gap: 10px;
              margin: 14px 0 18px;
            }

            .kpi,
            .summary-card {
              background: linear-gradient(180deg, #ffffff, #f8fafc);
              border: 1px solid #dbe3ef;
              border-radius: 16px;
              padding: 12px;
              box-shadow: 0 10px 24px rgba(15, 23, 42, 0.045);
            }

            .kpi-label,
            .summary-label {
              font-size: 8px;
              text-transform: uppercase;
              color: #64748b;
              font-weight: 950;
              margin-bottom: 7px;
              letter-spacing: 0.09em;
            }

            .kpi-value {
              font-size: 21px;
              font-weight: 950;
              color: #020617;
              letter-spacing: -0.04em;
            }

            .summary-value {
              font-size: 12px;
              font-weight: 900;
              color: #020617;
              line-height: 1.28;
            }

            .kpi-note {
              font-size: 9.6px;
              color: #64748b;
              margin-top: 4px;
              line-height: 1.3;
            }

            .panel {
              background: #ffffff;
              border: 1px solid #e2e8f0;
              border-radius: 16px;
              padding: 13px 15px;
              box-shadow: 0 10px 22px rgba(15, 23, 42, 0.035);
            }

            .decision-panel {
              margin: 17px 0 0;
              padding: 14px;
              border-radius: 18px;
              background: linear-gradient(135deg, #020617, #0f172a);
              color: #ffffff;
              border: 1px solid rgba(16, 185, 129, 0.28);
            }

            .decision-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr) !important;
              gap: 8px;
              margin-top: 11px;
            }

            .decision-item {
              padding: 10px;
              border-radius: 12px;
              background: rgba(255, 255, 255, 0.06);
              border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .decision-label {
              font-size: 8px;
              font-weight: 950;
              color: #a7f3d0;
              letter-spacing: 0.09em;
              text-transform: uppercase;
              margin-bottom: 5px;
            }

            .decision-value {
              font-size: 10.8px;
              font-weight: 850;
              line-height: 1.3;
            }

            .decision-panel p {
              color: #cbd5e1;
              margin: 8px 0 0;
              font-size: 10.8px;
            }

            .signal-positive {
              color: #86efac;
            }

            .signal-watch {
              color: #fde68a;
            }

            .signal-caution {
              color: #fca5a5;
            }

            .methodology {
              display: grid;
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 10px;
              margin-top: 8px;
            }

            .method-card {
              border-radius: 15px;
              padding: 12px;
              border: 1px solid #dbe3ef;
              background: linear-gradient(180deg, #f8fafc, #ffffff);
            }

            .method-card p {
              margin: 0;
              font-size: 10.8px;
            }

            .waterfall {
              background: #ffffff;
              border: 1px solid #dbe3ef;
              border-radius: 18px;
              padding: 13px 16px;
              margin-top: 8px;
              box-shadow: 0 12px 26px rgba(15, 23, 42, 0.045);
            }

            .row {
              display: flex;
              justify-content: space-between;
              gap: 12px;
              padding: 7px 0;
              border-bottom: 1px solid #e2e8f0;
              font-size: 11px;
              break-inside: avoid;
              page-break-inside: avoid;
            }

            .row:last-child {
              border-bottom: none;
            }

            .row strong {
              font-weight: 950;
            }

            .negative {
              color: #dc2626;
              font-weight: 850;
            }

            .positive {
              color: #059669;
              font-weight: 850;
            }

            .highlight {
              background: linear-gradient(90deg, #f8fafc, #ecfdf5);
              border-radius: 11px;
              padding: 8px;
              margin: 5px 0;
              font-weight: 950;
            }

            .comparables {
              display: grid;
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 10px;
              margin-top: 8px;
            }

            .comp-card {
              background: linear-gradient(180deg, #ffffff, #f8fafc);
              border: 1px solid #dbe3ef;
              border-radius: 15px;
              padding: 12px;
              box-shadow: 0 10px 24px rgba(15, 23, 42, 0.035);
            }

            .eyebrow {
              font-size: 8px;
              color: #64748b;
              text-transform: uppercase;
              font-weight: 950;
              margin-bottom: 7px;
              letter-spacing: 0.09em;
            }

            .comp-name {
              font-weight: 950;
              font-size: 13px;
              margin-bottom: 7px;
              color: #020617;
              line-height: 1.12;
            }

            .comp-multiple {
              font-weight: 950;
              font-size: 20px;
              color: #059669;
              letter-spacing: -0.04em;
            }

            .comp-note {
              margin-top: 7px;
              font-size: 10px;
              color: #64748b;
              line-height: 1.38;
            }

            .empty-box {
              background: #f8fafc;
              border: 1px dashed #cbd5e1;
              border-radius: 14px;
              padding: 14px;
              color: #64748b;
              font-size: 11px;
              grid-column: 1 / -1;
            }

            .closing-panel {
              margin-top: 18px;
              padding: 16px;
              border-radius: 18px;
              background:
                linear-gradient(135deg, #020617, #0f172a 55%, #064e3b);
              color: #ffffff;
              border: 1px solid rgba(16, 185, 129, 0.26);
            }

            .closing-panel h3 {
              color: #ffffff;
              margin-bottom: 8px;
            }

            .closing-panel p {
              color: #cbd5e1;
              margin: 0;
            }

            .disclaimer {
              margin-top: 16px;
              padding: 12px 14px;
              border-radius: 15px;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              color: #475569;
              font-size: 9.8px;
              line-height: 1.42;
            }

            .report-footer {
              margin-top: auto;
              padding-top: 11px;
              border-top: 1px solid #e2e8f0;
              display: flex;
              justify-content: space-between;
              gap: 16px;
              color: #94a3b8;
              font-size: 9px;
              line-height: 1.3;
            }

            .report-footer strong {
              color: #64748b;
            }

            @media print {
              html,
              body {
                width: 210mm;
                margin: 0;
                padding: 0;
                background: #ffffff;
              }

              .document {
                width: 210mm;
                margin: 0;
                background: #ffffff;
              }

              .report-page {
                width: 210mm;
                min-height: 297mm;
                margin: 0;
                padding: 12mm;
                border: none;
                border-radius: 0;
                box-shadow: none;
                overflow: hidden;
                page-break-after: always;
                break-after: page;
              }

              .report-page.last {
                page-break-after: auto;
                break-after: auto;
              }

              .report-page::before {
                height: 5px;
              }

              .prepared-panel,
              .grid,
              .comparables {
                grid-template-columns: repeat(3, 1fr) !important;
              }

              .summary-grid,
              .decision-grid {
                grid-template-columns: repeat(4, 1fr) !important;
              }

              .methodology {
                grid-template-columns: repeat(2, 1fr) !important;
              }
            }
          </style>
        </head>

        <body>
          <div class="document">
            <section class="report-page">
              <div class="page-body">
                <div class="header avoid-break">
                  <div>
                    <div class="brand-row">
                      <div class="brand-mark">OS</div>
                      <div>
                        <div class="brand">CEO's <span>OS</span></div>
                        <div class="subline">M&A Valuation Report</div>
                      </div>
                    </div>
                  </div>

                  <div class="meta">
                    <strong>Strictly Confidential</strong><br/>
                    ${escapeHtml(reportDate)}<br/>
                    M&A Workspace
                  </div>
                </div>

                <div class="module-badge">M&A Report</div>

                <h1>${escapeHtml(companyName)}</h1>

                <div class="deal-meta avoid-break">
                  <span class="deal-pill">Sector: ${escapeHtml(sector)}</span>
                  <span class="deal-pill">Quality Score: ${escapeHtml(qualityScore)}/100</span>
                  <span class="deal-pill">Risk: ${escapeHtml(riskLevel)}</span>
                  <span class="deal-pill">Currency: ${escapeHtml(currency)}</span>
                </div>

                <div class="prepared-panel avoid-break">
                  <div class="prepared-item">
                    <div class="prepared-label">Prepared for</div>
                    <div class="prepared-value">Executive Review</div>
                  </div>

                  <div class="prepared-item">
                    <div class="prepared-label">Prepared by</div>
                    <div class="prepared-value">CEO's OS M&A Workspace</div>
                  </div>

                  <div class="prepared-item">
                    <div class="prepared-label">Report ID</div>
                    <div class="prepared-value">${escapeHtml(reportId)}</div>
                  </div>
                </div>

                <div class="executive-summary">
                  <p>${escapeHtml(derived.execSummary || 'Resumen ejecutivo no disponible para este caso.')}</p>
                </div>

                <div class="hero">
                  <div class="hero-title">Equity Value — Base Case</div>
                  <div class="hero-value">${escapeHtml(formatCurrency(equityValue, currency))}</div>
                  <div class="hero-caption">
                    Valoración indicativa sujeta a due diligence, negociación y documentación final.
                  </div>
                </div>

                <div class="grid avoid-break">
                  <div class="kpi">
                    <div class="kpi-label">EBITDA Normalizado</div>
                    <div class="kpi-value">${escapeHtml(formatCurrency(normalizedEbitda, currency))}</div>
                    <div class="kpi-note">Base operativa ajustada para estimar valor.</div>
                  </div>

                  <div class="kpi">
                    <div class="kpi-label">Múltiplo Ajustado</div>
                    <div class="kpi-value">${escapeHtml(formatMultiple(adjustedMultiple))}</div>
                    <div class="kpi-note">Ajustado por calidad, riesgo y perfil del activo.</div>
                  </div>

                  <div class="kpi">
                    <div class="kpi-label">Net Proceeds</div>
                    <div class="kpi-value">${escapeHtml(formatCurrency(netProceeds, currency))}</div>
                    <div class="kpi-note">Estimación neta tras fees e impuestos.</div>
                  </div>
                </div>

                <div class="decision-panel">
                  <h3>Executive Decision Signal</h3>

                  <div class="decision-grid">
                    <div class="decision-item">
                      <div class="decision-label">Signal</div>
                      <div class="decision-value signal-${escapeHtml(decision.tone)}">
                        ${escapeHtml(decision.signal)}
                      </div>
                    </div>

                    <div class="decision-item">
                      <div class="decision-label">Risk Level</div>
                      <div class="decision-value">${escapeHtml(riskLevel)}</div>
                    </div>

                    <div class="decision-item">
                      <div class="decision-label">Data Confidence</div>
                      <div class="decision-value">Indicative</div>
                    </div>

                    <div class="decision-item">
                      <div class="decision-label">Next Step</div>
                      <div class="decision-value">Due Diligence</div>
                    </div>
                  </div>

                  <p>${escapeHtml(decision.nextStep)}</p>
                </div>
              </div>

              <div class="report-footer">
                <span><strong>CEO's OS</strong> · Private Executive Intelligence</span>
                <span>Page 1 of 3 · ${escapeHtml(reportId)}</span>
              </div>
            </section>

            <section class="report-page">
              <div class="page-body">
                <div class="section">
                  <h2>Investment Thesis</h2>
                  <div class="panel">
                    <ul>
                      ${buildList(derived.thesis)}
                    </ul>
                  </div>
                </div>

                <div class="section">
                  <h2>Valuation Methodology</h2>

                  <div class="methodology">
                    <div class="method-card">
                      <h3>Base de valoración</h3>
                      <p>
                        La valoración parte del EBITDA normalizado y aplica un múltiplo ajustado
                        según sector, calidad financiera, crecimiento, concentración, dependencia
                        operativa y riesgos identificados.
                      </p>
                    </div>

                    <div class="method-card">
                      <h3>Quality & Risk</h3>
                      <p>
                        El Quality Score y el nivel de riesgo reflejan resiliencia operativa,
                        concentración de clientes, dependencia del propietario, exposición legal,
                        estructura financiera y visibilidad del negocio.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="section">
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
                </div>

                <div class="section">
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
                </div>

                <div class="summary-grid">
                  <div class="summary-card">
                    <div class="summary-label">Equity Value</div>
                    <div class="summary-value">${escapeHtml(formatCurrency(equityValue, currency))}</div>
                  </div>

                  <div class="summary-card">
                    <div class="summary-label">Net Proceeds</div>
                    <div class="summary-value">${escapeHtml(formatCurrency(netProceeds, currency))}</div>
                  </div>

                  <div class="summary-card">
                    <div class="summary-label">Multiple</div>
                    <div class="summary-value">${escapeHtml(formatMultiple(adjustedMultiple))}</div>
                  </div>

                  <div class="summary-card">
                    <div class="summary-label">Risk</div>
                    <div class="summary-value">${escapeHtml(riskLevel)}</div>
                  </div>
                </div>
              </div>

              <div class="report-footer">
                <span><strong>CEO's OS</strong> · Valuation Methodology & Deal Bridge</span>
                <span>Page 2 of 3 · ${escapeHtml(reportId)}</span>
              </div>
            </section>

            <section class="report-page last">
              <div class="page-body">
                <div class="section">
                  <h2>Comparables</h2>

                  <div class="comparables">
                    ${buildComparables(derived.comparables)}
                  </div>
                </div>

                <div class="section">
                  <h2>Review Checklist</h2>

                  <div class="summary-grid">
                    <div class="summary-card">
                      <div class="summary-label">Financial Evidence</div>
                      <div class="summary-value">Pending diligence</div>
                    </div>

                    <div class="summary-card">
                      <div class="summary-label">Legal Review</div>
                      <div class="summary-value">Required</div>
                    </div>

                    <div class="summary-card">
                      <div class="summary-label">Buyer Validation</div>
                      <div class="summary-value">Recommended</div>
                    </div>

                    <div class="summary-card">
                      <div class="summary-label">Decision Status</div>
                      <div class="summary-value">${escapeHtml(decision.signal)}</div>
                    </div>
                  </div>
                </div>

                <div class="closing-panel">
                  <h3>Executive closing note</h3>
                  <p>
                    This report is designed as an executive decision layer. It should be used
                    to structure discussion, validate assumptions and decide whether the deal
                    should proceed to deeper financial, legal and commercial due diligence.
                  </p>
                </div>

                <div class="disclaimer">
                  <strong>Disclaimer.</strong>
                  Este informe tiene carácter orientativo y preliminar. No constituye asesoramiento
                  financiero, fiscal, legal ni una valoración auditada. Las conclusiones deben ser
                  revisadas por asesores profesionales antes de tomar decisiones de inversión,
                  adquisición, financiación o desinversión.
                </div>
              </div>

              <div class="report-footer">
                <span><strong>Strictly Confidential</strong> · Generated by CEO's OS M&A Workspace</span>
                <span>Page 3 of 3 · ${escapeHtml(reportId)}</span>
              </div>
            </section>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=1400,height=1000');

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