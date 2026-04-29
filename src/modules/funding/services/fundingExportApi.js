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

function formatPercent(value) {
  return `${toNumber(value).toFixed(1)}%`;
}

function formatMonths(value) {
  return `${toNumber(value).toFixed(1)} meses`;
}

function buildReportId(companyName = '', prefix = 'FUND') {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const safeName = String(companyName || 'company')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 18);

  return `${prefix}-${datePart}-${safeName || 'COMPANY'}`;
}

function buildFundingDecisionSignal({ readinessScore, runway, dilution }) {
  const readiness = toNumber(readinessScore);
  const runwayMonths = toNumber(runway);
  const dilutionPct = toNumber(dilution);

  if (readiness >= 75 && runwayMonths >= 12 && dilutionPct <= 25) {
    return {
      signal: 'Investor ready',
      tone: 'positive',
      nextStep:
        'Preparar outreach a inversores, data room final y narrativa de ronda.'
    };
  }

  if (readiness >= 55 || runwayMonths >= 6) {
    return {
      signal: 'Prepare before launch',
      tone: 'watch',
      nextStep:
        'Reforzar data room, narrativa financiera y validación de métricas antes de lanzar ronda.'
    };
  }

  return {
    signal: 'Not ready',
    tone: 'caution',
    nextStep:
      'Mejorar runway, documentación, métricas y claridad del uso de fondos antes de abrir conversaciones.'
  };
}

function buildDataRoomDecisionSignal({ completion }) {
  const safeCompletion = toNumber(completion);

  if (safeCompletion >= 80) {
    return {
      signal: 'Data room ready',
      tone: 'positive',
      nextStep:
        'Revisar confidencialidad final y preparar versión compartible con inversores.'
    };
  }

  if (safeCompletion >= 50) {
    return {
      signal: 'Needs completion',
      tone: 'watch',
      nextStep:
        'Completar documentos clave, validar coherencia financiera y revisar permisos antes de compartir.'
    };
  }

  return {
    signal: 'Not ready',
    tone: 'caution',
    nextStep:
      'Priorizar documentación financiera, societaria, legal y comercial antes de iniciar conversaciones.'
  };
}

function buildList(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return '<li>No hay tesis de financiación disponible.</li>';
  }

  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
}

function buildScenarioCards(rows = [], currency = 'EUR') {
  if (!Array.isArray(rows) || rows.length === 0) {
    return `
      <div class="empty-box">
        No hay escenarios de financiación disponibles.
      </div>
    `;
  }

  return rows
    .slice(0, 4)
    .map(
      (row) => `
        <div class="summary-card avoid-break">
          <div class="summary-label">${escapeHtml(row.name || 'Scenario')}</div>
          <div class="summary-value">${escapeHtml(formatCurrency(row.raise, currency))}</div>
          <div class="summary-note">
            Pre-money: ${escapeHtml(formatCurrency(row.preMoney, currency))}<br/>
            Dilution: ${escapeHtml(formatPercent(row.dilution))}<br/>
            Runway: ${escapeHtml(formatMonths(row.runway))}
          </div>
        </div>
      `
    )
    .join('');
}

function buildUseOfFunds(items = [], currency = 'EUR') {
  if (!Array.isArray(items) || items.length === 0) {
    return `
      <div class="empty-box">
        No hay desglose de uso de fondos disponible.
      </div>
    `;
  }

  return items
    .slice(0, 6)
    .map(
      (item) => `
        <div class="fund-card avoid-break">
          <div class="eyebrow">${escapeHtml(item.label || item.name || 'Use of funds')}</div>
          <div class="fund-value">
            ${
              item.amount !== undefined
                ? escapeHtml(formatCurrency(item.amount, currency))
                : escapeHtml(`${toNumber(item.pct || item.percentage)}%`)
            }
          </div>
          <div class="fund-note">${escapeHtml(item.description || item.note || '')}</div>
        </div>
      `
    )
    .join('');
}

function resolveChecklistStatus(item = {}) {
  if (item.completed || item.done || item.status === 'ready') return 'Ready';
  if (item.status === 'done' || item.status === 'completed') return 'Ready';
  if (item.status) return item.status;

  return 'Pending';
}

function buildChecklistCards(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return `
      <div class="empty-box">
        No hay checklist disponible.
      </div>
    `;
  }

  return items
    .slice(0, 12)
    .map((item) => {
      const status = resolveChecklistStatus(item);

      return `
        <div class="item-card avoid-break">
          <div class="item-top">
            <span class="item-type">${escapeHtml(item.category || 'Checklist')}</span>
            <span class="item-status">${escapeHtml(status)}</span>
          </div>

          <div class="item-title">${escapeHtml(item.title || item.label || 'Item')}</div>

          <div class="item-desc">
            ${escapeHtml(item.description || item.note || item.owner || 'Sin nota adicional.')}
          </div>
        </div>
      `;
    })
    .join('');
}

function openPrintableWindow(html) {
  const printWindow = window.open('', '_blank', 'width=1400,height=1000');

  if (!printWindow) return false;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.focus();
    printWindow.print();
  }, 450);

  return true;
}

function buildPremiumStyles({ accent = '#2563eb', accentSoft = '#dbeafe', accentDark = '#1d4ed8' }) {
  return `
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
        background: linear-gradient(90deg, #020617, ${accent}, ${accentSoft});
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
      .summary-card,
      .decision-panel,
      .report-footer,
      .prepared-panel,
      .prepared-item,
      .fund-card,
      .item-card,
      .closing-panel,
      .disclaimer,
      .notice {
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
        background: linear-gradient(135deg, #020617, ${accent});
        color: #ffffff;
        font-weight: 950;
        font-size: 13px;
        box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
      }

      .brand {
        font-size: 24px;
        font-weight: 950;
        letter-spacing: -0.05em;
        color: #020617;
      }

      .brand span {
        color: ${accent};
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
        background: ${accentSoft};
        color: ${accentDark};
        border: 1px solid rgba(37, 99, 235, 0.22);
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
        background: ${accent};
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
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
        background: linear-gradient(180deg, ${accent}, ${accentSoft});
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

      .prepared-panel,
      .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 9px;
        margin: 12px 0 13px;
      }

      .summary-grid,
      .decision-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr) !important;
        gap: 8px;
        margin: 12px 0 14px;
      }

      .fund-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 10px;
        margin-top: 10px;
      }

      .items-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 10px;
        margin-top: 10px;
      }

      .prepared-item,
      .kpi,
      .summary-card,
      .fund-card,
      .item-card {
        background: linear-gradient(180deg, #ffffff, #f8fafc);
        border: 1px solid #dbe3ef;
        border-radius: 16px;
        padding: 12px;
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.045);
      }

      .prepared-label,
      .kpi-label,
      .summary-label,
      .eyebrow {
        font-size: 8px;
        text-transform: uppercase;
        color: #64748b;
        font-weight: 950;
        margin-bottom: 7px;
        letter-spacing: 0.09em;
      }

      .prepared-value,
      .summary-value {
        font-size: 11.2px;
        font-weight: 900;
        color: #020617;
        line-height: 1.28;
      }

      .kpi-value {
        font-size: 21px;
        font-weight: 950;
        color: #020617;
        letter-spacing: -0.04em;
      }

      .blue {
        color: ${accent};
      }

      .green {
        color: #059669;
      }

      .red {
        color: #dc2626;
      }

      .orange {
        color: #d97706;
      }

      .purple {
        color: #7c3aed;
      }

      .kpi-note,
      .summary-note {
        font-size: 9.6px;
        color: #64748b;
        margin-top: 4px;
        line-height: 1.3;
      }

      .executive-summary {
        margin: 13px 0 16px;
        padding: 13px 15px;
        border-radius: 16px;
        background:
          linear-gradient(135deg, rgba(248, 250, 252, 0.95), rgba(239, 246, 255, 0.75));
        border: 1px solid ${accentSoft};
      }

      .executive-summary p {
        margin: 0;
      }

      .hero {
        background:
          radial-gradient(circle at 20% 20%, rgba(37, 99, 235, 0.22), transparent 28%),
          linear-gradient(135deg, #020617, #0f172a 48%, ${accentDark});
        color: #ffffff;
        border-radius: 22px;
        padding: 25px 26px;
        margin: 18px 0 18px;
        text-align: center;
        border: 1px solid rgba(37, 99, 235, 0.28);
        box-shadow:
          0 20px 42px rgba(15, 23, 42, 0.22),
          inset 0 1px 0 rgba(255, 255, 255, 0.08);
      }

      .hero-title {
        color: #bfdbfe;
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
        color: #dbeafe;
        font-size: 11px;
      }

      .decision-panel {
        margin: 17px 0 0;
        padding: 14px;
        border-radius: 18px;
        background: linear-gradient(135deg, #020617, #0f172a);
        color: #ffffff;
        border: 1px solid rgba(37, 99, 235, 0.28);
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
        color: #bfdbfe;
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

      .panel {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 13px 15px;
        box-shadow: 0 10px 22px rgba(15, 23, 42, 0.035);
      }

      .fund-value {
        font-size: 20px;
        font-weight: 950;
        color: ${accent};
        letter-spacing: -0.04em;
      }

      .fund-note {
        margin-top: 7px;
        font-size: 10px;
        color: #64748b;
        line-height: 1.38;
      }

      .item-top {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
      }

      .item-type,
      .item-status {
        font-size: 8px;
        text-transform: uppercase;
        font-weight: 950;
        letter-spacing: 0.08em;
        color: #64748b;
      }

      .item-status {
        color: ${accentDark};
      }

      .item-title {
        font-size: 12px;
        font-weight: 950;
        color: #020617;
        line-height: 1.25;
        margin-bottom: 5px;
      }

      .item-desc {
        font-size: 10px;
        color: #475569;
        line-height: 1.4;
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

      .closing-panel,
      .notice {
        margin-top: 18px;
        padding: 16px;
        border-radius: 18px;
        background:
          linear-gradient(135deg, #020617, #0f172a 55%, ${accentDark});
        color: #ffffff;
        border: 1px solid rgba(37, 99, 235, 0.26);
      }

      .closing-panel h3,
      .notice h3 {
        color: #ffffff;
        margin-bottom: 8px;
      }

      .closing-panel p,
      .notice p {
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
        .fund-grid {
          grid-template-columns: repeat(3, 1fr) !important;
        }

        .summary-grid,
        .decision-grid {
          grid-template-columns: repeat(4, 1fr) !important;
        }

        .items-grid {
          grid-template-columns: repeat(2, 1fr) !important;
        }
      }
    </style>
  `;
}

function buildFundingHtml({ fundingInputs = {}, fundingSettings = {}, derived = {} }) {
  const currency = fundingSettings.reportCurrency || 'EUR';
  const companyName = fundingInputs.companyName || 'Compañía sin nombre';
  const reportDate = new Date().toLocaleDateString('es-ES');
  const reportId = buildReportId(companyName, 'FUND');

  const targetRaise = toNumber(fundingInputs.targetRaise || derived.targetRaise);
  const preMoney = toNumber(
    fundingInputs.preMoneyValuation || derived.preMoneyValuation
  );
  const postMoney = toNumber(derived.postMoneyValuation || preMoney + targetRaise);
  const monthlyBurn = toNumber(fundingInputs.monthlyBurn);
  const currentCash = toNumber(fundingInputs.currentCash);

  const runway =
    monthlyBurn > 0
      ? (currentCash + targetRaise) / monthlyBurn
      : toNumber(derived.runwayAfterRaise || derived.runwayMonths);

  const dilution =
    postMoney > 0
      ? (targetRaise / postMoney) * 100
      : toNumber(derived.dilutionPct);

  const readinessScore = toNumber(derived.readinessScore);
  const decision = buildFundingDecisionSignal({
    readinessScore,
    runway,
    dilution
  });

  return `
    <html>
      <head>
        <title>CEO's OS - Funding Memo - ${escapeHtml(companyName)}</title>
        ${buildPremiumStyles({
          accent: '#2563eb',
          accentSoft: '#dbeafe',
          accentDark: '#1d4ed8'
        })}
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
                      <div class="subline">Funding Memo</div>
                    </div>
                  </div>
                </div>

                <div class="meta">
                  <strong>Strictly Confidential</strong><br/>
                  ${escapeHtml(reportDate)}<br/>
                  Funding Workspace
                </div>
              </div>

              <div class="module-badge">Funding Memo</div>

              <h1>${escapeHtml(companyName)}</h1>

              <div class="deal-meta avoid-break">
                <span class="deal-pill">Stage: ${escapeHtml(fundingInputs.stage || 'N/A')}</span>
                <span class="deal-pill">Scenario: ${escapeHtml(fundingSettings.scenarioMode || 'balanced')}</span>
                <span class="deal-pill">Currency: ${escapeHtml(currency)}</span>
                <span class="deal-pill">Readiness: ${escapeHtml(`${Math.round(readinessScore)}/100`)}</span>
              </div>

              <div class="prepared-panel avoid-break">
                <div class="prepared-item">
                  <div class="prepared-label">Prepared for</div>
                  <div class="prepared-value">Investor Review</div>
                </div>

                <div class="prepared-item">
                  <div class="prepared-label">Prepared by</div>
                  <div class="prepared-value">CEO's OS Funding Workspace</div>
                </div>

                <div class="prepared-item">
                  <div class="prepared-label">Report ID</div>
                  <div class="prepared-value">${escapeHtml(reportId)}</div>
                </div>
              </div>

              <div class="executive-summary">
                <p>${escapeHtml(derived.summary || 'Resumen ejecutivo de financiación no disponible.')}</p>
              </div>

              <div class="hero">
                <div class="hero-title">Target Raise</div>
                <div class="hero-value">${escapeHtml(formatCurrency(targetRaise, currency))}</div>
                <div class="hero-caption">
                  Capital objetivo para extender runway, ejecutar crecimiento y preparar próximos hitos.
                </div>
              </div>

              <div class="grid avoid-break">
                <div class="kpi">
                  <div class="kpi-label">Pre-money</div>
                  <div class="kpi-value">${escapeHtml(formatCurrency(preMoney, currency))}</div>
                  <div class="kpi-note">Valoración previa a la ronda.</div>
                </div>

                <div class="kpi">
                  <div class="kpi-label">Post-money</div>
                  <div class="kpi-value green">${escapeHtml(formatCurrency(postMoney, currency))}</div>
                  <div class="kpi-note">Valoración estimada después de la ronda.</div>
                </div>

                <div class="kpi">
                  <div class="kpi-label">Dilución estimada</div>
                  <div class="kpi-value red">${escapeHtml(formatPercent(dilution))}</div>
                  <div class="kpi-note">Participación estimada cedida en la ronda.</div>
                </div>
              </div>

              <div class="grid avoid-break">
                <div class="kpi">
                  <div class="kpi-label">Current Cash</div>
                  <div class="kpi-value">${escapeHtml(formatCurrency(currentCash, currency))}</div>
                </div>

                <div class="kpi">
                  <div class="kpi-label">Monthly Burn</div>
                  <div class="kpi-value">${escapeHtml(formatCurrency(monthlyBurn, currency))}</div>
                </div>

                <div class="kpi">
                  <div class="kpi-label">Runway post-raise</div>
                  <div class="kpi-value blue">${escapeHtml(formatMonths(runway))}</div>
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
                    <div class="decision-label">Readiness</div>
                    <div class="decision-value">${escapeHtml(`${Math.round(readinessScore)}/100`)}</div>
                  </div>

                  <div class="decision-item">
                    <div class="decision-label">Runway</div>
                    <div class="decision-value">${escapeHtml(formatMonths(runway))}</div>
                  </div>

                  <div class="decision-item">
                    <div class="decision-label">Next Step</div>
                    <div class="decision-value">Investor Prep</div>
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
                <h2>Use of Funds</h2>

                <div class="fund-grid">
                  ${buildUseOfFunds(derived.useOfFunds, currency)}
                </div>
              </div>

              <div class="section">
                <h2>Fundraising Scenarios</h2>

                <div class="summary-grid">
                  ${buildScenarioCards(derived.scenarioRows, currency)}
                </div>
              </div>

              <div class="section">
                <h2>Investor Readiness</h2>

                <div class="grid">
                  <div class="kpi">
                    <div class="kpi-label">Readiness Score</div>
                    <div class="kpi-value blue">${escapeHtml(`${Math.round(readinessScore)}/100`)}</div>
                  </div>

                  <div class="kpi">
                    <div class="kpi-label">Data Room</div>
                    <div class="kpi-value">${escapeHtml(`${toNumber(fundingInputs.dataRoomCompletion)}%`)}</div>
                  </div>

                  <div class="kpi">
                    <div class="kpi-label">Investor Interest</div>
                    <div class="kpi-value">${escapeHtml(`${toNumber(fundingInputs.investorInterest)}%`)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="report-footer">
              <span><strong>CEO's OS</strong> · Funding Thesis & Scenarios</span>
              <span>Page 2 of 3 · ${escapeHtml(reportId)}</span>
            </div>
          </section>

          <section class="report-page last">
            <div class="page-body">
              <div class="section">
                <h2>Readiness Checklist</h2>

                <div class="items-grid">
                  ${buildChecklistCards(derived.readinessChecklist)}
                </div>
              </div>

              <div class="section">
                <h2>Funding Review Checklist</h2>

                <div class="summary-grid">
                  <div class="summary-card">
                    <div class="summary-label">Narrative</div>
                    <div class="summary-value">Review required</div>
                  </div>

                  <div class="summary-card">
                    <div class="summary-label">Data Room</div>
                    <div class="summary-value">${escapeHtml(`${toNumber(fundingInputs.dataRoomCompletion)}%`)}</div>
                  </div>

                  <div class="summary-card">
                    <div class="summary-label">Financial Model</div>
                    <div class="summary-value">Validate</div>
                  </div>

                  <div class="summary-card">
                    <div class="summary-label">Investor Targeting</div>
                    <div class="summary-value">Recommended</div>
                  </div>
                </div>
              </div>

              <div class="closing-panel">
                <h3>Executive closing note</h3>
                <p>
                  This memo is designed as an executive funding preparation layer.
                  It should be used to structure capital needs, investor narrative,
                  runway planning and readiness before opening fundraising conversations.
                </p>
              </div>

              <div class="disclaimer">
                <strong>Disclaimer.</strong>
                Este memo tiene carácter orientativo y preliminar. No constituye asesoramiento
                financiero, legal, fiscal ni una recomendación de inversión. Las hipótesis,
                valoraciones, dilución y escenarios deben revisarse con asesores profesionales
                antes de presentar la ronda o negociar con inversores.
              </div>
            </div>

            <div class="report-footer">
              <span><strong>Strictly Confidential</strong> · Generated by CEO's OS Funding Workspace</span>
              <span>Page 3 of 3 · ${escapeHtml(reportId)}</span>
            </div>
          </section>
        </div>
      </body>
    </html>
  `;
}

function buildDataRoomHtml({ fundingInputs = {}, fundingSettings = {}, derived = {} }) {
  const currency = fundingSettings.reportCurrency || 'EUR';
  const companyName = fundingInputs.companyName || 'Compañía sin nombre';
  const reportDate = new Date().toLocaleDateString('es-ES');
  const reportId = buildReportId(companyName, 'DR');

  const checklist = derived.dataRoomChecklist || [];
  const completed = checklist.filter((item) => {
    const value = item.completed ?? item.done ?? item.status;
    return value === true || value === 'done' || value === 'completed' || value === 'ready';
  }).length;

  const total = checklist.length;
  const completion = total > 0 ? Math.round((completed / total) * 100) : 0;
  const pending = Math.max(0, total - completed);
  const decision = buildDataRoomDecisionSignal({ completion });

  return `
    <html>
      <head>
        <title>CEO's OS - Investor Data Room - ${escapeHtml(companyName)}</title>
        ${buildPremiumStyles({
          accent: '#7c3aed',
          accentSoft: '#ede9fe',
          accentDark: '#6d28d9'
        })}
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
                      <div class="subline">Investor Data Room</div>
                    </div>
                  </div>
                </div>

                <div class="meta">
                  <strong>Strictly Confidential</strong><br/>
                  ${escapeHtml(reportDate)}<br/>
                  Funding Workspace
                </div>
              </div>

              <div class="module-badge">Investor Data Room</div>

              <h1>${escapeHtml(companyName)}</h1>

              <div class="deal-meta avoid-break">
                <span class="deal-pill">Stage: ${escapeHtml(fundingInputs.stage || 'N/A')}</span>
                <span class="deal-pill">Currency: ${escapeHtml(currency)}</span>
                <span class="deal-pill">Completion: ${escapeHtml(`${completion}%`)}</span>
                <span class="deal-pill">Pending: ${escapeHtml(pending)}</span>
              </div>

              <div class="prepared-panel avoid-break">
                <div class="prepared-item">
                  <div class="prepared-label">Prepared for</div>
                  <div class="prepared-value">Investor Data Room Review</div>
                </div>

                <div class="prepared-item">
                  <div class="prepared-label">Prepared by</div>
                  <div class="prepared-value">CEO's OS Funding Workspace</div>
                </div>

                <div class="prepared-item">
                  <div class="prepared-label">Report ID</div>
                  <div class="prepared-value">${escapeHtml(reportId)}</div>
                </div>
              </div>

              <div class="executive-summary">
                <p>
                  Checklist documental para preparar una ronda de financiación,
                  conversaciones con inversores o revisión interna del paquete de materiales.
                </p>
              </div>

              <div class="hero">
                <div class="hero-title">Data Room Readiness</div>
                <div class="hero-value">${escapeHtml(`${completion}%`)}</div>
                <div class="hero-caption">
                  ${escapeHtml(completed)} documentos completados · ${escapeHtml(pending)} pendientes · ${escapeHtml(total)} items totales.
                </div>
              </div>

              <div class="grid avoid-break">
                <div class="kpi">
                  <div class="kpi-label">Completados</div>
                  <div class="kpi-value green">${escapeHtml(completed)}</div>
                </div>

                <div class="kpi">
                  <div class="kpi-label">Pendientes</div>
                  <div class="kpi-value orange">${escapeHtml(pending)}</div>
                </div>

                <div class="kpi">
                  <div class="kpi-label">Total</div>
                  <div class="kpi-value purple">${escapeHtml(total)}</div>
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
                    <div class="decision-label">Completion</div>
                    <div class="decision-value">${escapeHtml(`${completion}%`)}</div>
                  </div>

                  <div class="decision-item">
                    <div class="decision-label">Pending</div>
                    <div class="decision-value">${escapeHtml(pending)}</div>
                  </div>

                  <div class="decision-item">
                    <div class="decision-label">Next Step</div>
                    <div class="decision-value">Document Review</div>
                  </div>
                </div>

                <p>${escapeHtml(decision.nextStep)}</p>
              </div>

              <div class="section">
                <h2>Funding Context</h2>

                <div class="grid">
                  <div class="kpi">
                    <div class="kpi-label">Target Raise</div>
                    <div class="kpi-value">${escapeHtml(formatCurrency(fundingInputs.targetRaise, currency))}</div>
                  </div>

                  <div class="kpi">
                    <div class="kpi-label">Pre-money</div>
                    <div class="kpi-value">${escapeHtml(formatCurrency(fundingInputs.preMoneyValuation, currency))}</div>
                  </div>

                  <div class="kpi">
                    <div class="kpi-label">Monthly Burn</div>
                    <div class="kpi-value">${escapeHtml(formatCurrency(fundingInputs.monthlyBurn, currency))}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="report-footer">
              <span><strong>CEO's OS</strong> · Private Executive Intelligence</span>
              <span>Page 1 of 2 · ${escapeHtml(reportId)}</span>
            </div>
          </section>

          <section class="report-page last">
            <div class="page-body">
              <div class="section">
                <h2>Data Room Checklist</h2>

                <div class="items-grid">
                  ${buildChecklistCards(checklist)}
                </div>
              </div>

              <div class="section">
                <h2>Sharing Readiness</h2>

                <div class="summary-grid">
                  <div class="summary-card">
                    <div class="summary-label">Confidentiality</div>
                    <div class="summary-value">Review before sharing</div>
                  </div>

                  <div class="summary-card">
                    <div class="summary-label">Financial Data</div>
                    <div class="summary-value">Validate consistency</div>
                  </div>

                  <div class="summary-card">
                    <div class="summary-label">Legal Docs</div>
                    <div class="summary-value">Check permissions</div>
                  </div>

                  <div class="summary-card">
                    <div class="summary-label">Investor Access</div>
                    <div class="summary-value">Controlled</div>
                  </div>
                </div>
              </div>

              <div class="closing-panel">
                <h3>Executive closing note</h3>
                <p>
                  This package should be reviewed before external sharing.
                  Confirm confidentiality, document permissions, financial consistency
                  and investor access controls before opening the data room.
                </p>
              </div>

              <div class="disclaimer">
                <strong>Disclaimer.</strong>
                Este paquete es una guía documental para preparar el data room.
                Antes de compartirlo con terceros debe revisarse confidencialidad,
                permisos, documentación societaria, consistencia financiera y alcance
                legal de la información incluida.
              </div>
            </div>

            <div class="report-footer">
              <span><strong>Strictly Confidential</strong> · Generated by CEO's OS Funding Workspace</span>
              <span>Page 2 of 2 · ${escapeHtml(reportId)}</span>
            </div>
          </section>
        </div>
      </body>
    </html>
  `;
}

export const fundingExportApi = {
  exportMemo({ fundingInputs = {}, fundingSettings = {}, derived = {} }) {
    if (typeof window === 'undefined') return false;

    const html = buildFundingHtml({
      fundingInputs,
      fundingSettings,
      derived
    });

    return openPrintableWindow(html);
  },

  exportDataRoomMemo({ fundingInputs = {}, fundingSettings = {}, derived = {} }) {
    if (typeof window === 'undefined') return false;

    const html = buildDataRoomHtml({
      fundingInputs,
      fundingSettings,
      derived
    });

    return openPrintableWindow(html);
  }
};