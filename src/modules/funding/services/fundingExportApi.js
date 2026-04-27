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

function buildList(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return '<li>No hay tesis de financiación disponible.</li>';
  }

  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
}

function buildScenarioRows(rows = [], currency = 'EUR') {
  if (!Array.isArray(rows) || rows.length === 0) {
    return `
      <tr>
        <td colspan="5">No hay escenarios disponibles.</td>
      </tr>
    `;
  }

  return rows
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.name || 'Scenario')}</td>
          <td>${escapeHtml(formatCurrency(row.raise, currency))}</td>
          <td>${escapeHtml(formatCurrency(row.preMoney, currency))}</td>
          <td>${escapeHtml(formatPercent(row.dilution))}</td>
          <td>${escapeHtml(formatMonths(row.runway))}</td>
        </tr>
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
    .map(
      (item) => `
        <div class="fund-card">
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

function buildChecklist(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return `
      <tr>
        <td colspan="3">No hay checklist disponible.</td>
      </tr>
    `;
  }

  return items
    .map((item) => {
      const status = item.completed || item.done || item.status === 'ready'
        ? 'Ready'
        : item.status || 'Pending';

      return `
        <tr>
          <td>${escapeHtml(item.title || item.label || 'Item')}</td>
          <td>${escapeHtml(status)}</td>
          <td>${escapeHtml(item.description || item.note || item.owner || '')}</td>
        </tr>
      `;
    })
    .join('');
}

function openPrintableWindow(html) {
  const printWindow = window.open('', '_blank', 'width=1024,height=768');

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

function buildFundingHtml({ fundingInputs = {}, fundingSettings = {}, derived = {} }) {
  const currency = fundingSettings.reportCurrency || 'EUR';
  const companyName = fundingInputs.companyName || 'Compañía sin nombre';
  const reportDate = new Date().toLocaleDateString('es-ES');

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

  return `
    <html>
      <head>
        <title>CEO's OS - Funding Memo - ${escapeHtml(companyName)}</title>

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
            border-bottom: 4px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 34px;
          }

          .brand {
            font-size: 26px;
            font-weight: 900;
            letter-spacing: -0.03em;
          }

          .brand span {
            color: #2563eb;
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
            background: #eff6ff;
            color: #1d4ed8;
            border: 1px solid #bfdbfe;
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
            border-left: 4px solid #2563eb;
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
            background: linear-gradient(135deg, #0f172a, #1d4ed8);
            color: #ffffff;
            border-radius: 18px;
            padding: 28px;
            margin: 28px 0 30px;
            text-align: center;
          }

          .hero-title {
            color: #bfdbfe;
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
            color: #dbeafe;
            font-size: 13px;
          }

          .grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin: 28px 0;
          }

          .grid-4 {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 14px;
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

          .blue {
            color: #2563eb;
          }

          .green {
            color: #059669;
          }

          .red {
            color: #dc2626;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
            font-size: 13px;
          }

          th {
            text-align: left;
            padding: 10px;
            border-bottom: 2px solid #e2e8f0;
            color: #64748b;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.06em;
          }

          td {
            padding: 10px;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: top;
            color: #334155;
            line-height: 1.45;
          }

          .fund-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
            margin-top: 18px;
          }

          .fund-card {
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

          .fund-value {
            font-size: 22px;
            font-weight: 900;
            color: #2563eb;
          }

          .fund-note {
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

          .notice {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            color: #1e3a8a;
            border-radius: 14px;
            padding: 16px;
            margin-top: 18px;
            font-size: 13px;
            line-height: 1.55;
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
              <div class="subline">Funding Memo</div>
            </div>

            <div class="meta">
              Investor Memo<br/>
              ${escapeHtml(reportDate)}<br/>
              Funding Workspace
            </div>
          </div>

          <div class="module-badge">Funding Memo</div>

          <h1>${escapeHtml(companyName)}</h1>

          <div class="subline">
            Stage: ${escapeHtml(fundingInputs.stage || 'N/A')} · Scenario: ${escapeHtml(fundingSettings.scenarioMode || 'balanced')} · Currency: ${escapeHtml(currency)}
          </div>

          <p>${escapeHtml(derived.summary || 'Resumen ejecutivo de financiación no disponible.')}</p>

          <div class="hero">
            <div class="hero-title">Target Raise</div>
            <div class="hero-value">${escapeHtml(formatCurrency(targetRaise, currency))}</div>
            <div class="hero-caption">
              Capital objetivo para extender runway, ejecutar crecimiento y preparar próximos hitos.
            </div>
          </div>

          <div class="grid">
            <div class="kpi">
              <div class="kpi-label">Pre-money</div>
              <div class="kpi-value">${escapeHtml(formatCurrency(preMoney, currency))}</div>
            </div>

            <div class="kpi">
              <div class="kpi-label">Post-money</div>
              <div class="kpi-value green">${escapeHtml(formatCurrency(postMoney, currency))}</div>
            </div>

            <div class="kpi">
              <div class="kpi-label">Dilución estimada</div>
              <div class="kpi-value red">${escapeHtml(formatPercent(dilution))}</div>
            </div>
          </div>

          <div class="grid">
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

          <h2>Investment Thesis</h2>

          <ul>
            ${buildList(derived.thesis)}
          </ul>

          <h2>Use of Funds</h2>

          <div class="fund-grid">
            ${buildUseOfFunds(derived.useOfFunds, currency)}
          </div>

          <h2>Fundraising Scenarios</h2>

          <table>
            <thead>
              <tr>
                <th>Scenario</th>
                <th>Raise</th>
                <th>Pre-money</th>
                <th>Dilution</th>
                <th>Runway</th>
              </tr>
            </thead>

            <tbody>
              ${buildScenarioRows(derived.scenarioRows, currency)}
            </tbody>
          </table>

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

          <h2>Readiness Checklist</h2>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Estado</th>
                <th>Nota</th>
              </tr>
            </thead>

            <tbody>
              ${buildChecklist(derived.readinessChecklist)}
            </tbody>
          </table>

          <div class="notice">
            Este memo es una herramienta de preparación de financiación. Sirve
            para estructurar narrativa, capital objetivo, escenarios y readiness,
            pero no sustituye asesoramiento financiero, legal o fiscal.
          </div>

          <div class="footer">
            Generado por CEO's OS — Funding Workspace. Documento confidencial para preparación de ronda e interacción con inversores.
          </div>
        </div>
      </body>
    </html>
  `;
}

function buildDataRoomHtml({ fundingInputs = {}, fundingSettings = {}, derived = {} }) {
  const currency = fundingSettings.reportCurrency || 'EUR';
  const companyName = fundingInputs.companyName || 'Compañía sin nombre';
  const reportDate = new Date().toLocaleDateString('es-ES');

  const checklist = derived.dataRoomChecklist || [];
  const completed = checklist.filter((item) => {
    const value = item.completed ?? item.done ?? item.status;
    return value === true || value === 'done' || value === 'completed' || value === 'ready';
  }).length;

  const total = checklist.length;
  const completion = total > 0 ? Math.round((completed / total) * 100) : 0;
  const pending = Math.max(0, total - completed);

  return `
    <html>
      <head>
        <title>CEO's OS - Investor Data Room - ${escapeHtml(companyName)}</title>

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
            border-bottom: 4px solid #7c3aed;
            padding-bottom: 20px;
            margin-bottom: 34px;
          }

          .brand {
            font-size: 26px;
            font-weight: 900;
            letter-spacing: -0.03em;
          }

          .brand span {
            color: #7c3aed;
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
            background: #f5f3ff;
            color: #6d28d9;
            border: 1px solid #ddd6fe;
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
            border-left: 4px solid #7c3aed;
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
            background: linear-gradient(135deg, #0f172a, #6d28d9);
            color: #ffffff;
            border-radius: 18px;
            padding: 28px;
            margin: 28px 0 30px;
            text-align: center;
          }

          .hero-title {
            color: #ddd6fe;
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
            color: #ede9fe;
            font-size: 13px;
          }

          .grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
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

          .purple {
            color: #7c3aed;
          }

          .green {
            color: #059669;
          }

          .orange {
            color: #d97706;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
            font-size: 13px;
          }

          th {
            text-align: left;
            padding: 10px;
            border-bottom: 2px solid #e2e8f0;
            color: #64748b;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.06em;
          }

          td {
            padding: 10px;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: top;
            color: #334155;
            line-height: 1.45;
          }

          .notice {
            background: #f5f3ff;
            border: 1px solid #ddd6fe;
            color: #4c1d95;
            border-radius: 14px;
            padding: 16px;
            margin-top: 18px;
            font-size: 13px;
            line-height: 1.55;
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
              <div class="subline">Investor Data Room</div>
            </div>

            <div class="meta">
              Data Room Memo<br/>
              ${escapeHtml(reportDate)}<br/>
              Funding Workspace
            </div>
          </div>

          <div class="module-badge">Investor Data Room</div>

          <h1>${escapeHtml(companyName)}</h1>

          <div class="subline">
            Stage: ${escapeHtml(fundingInputs.stage || 'N/A')} · Currency: ${escapeHtml(currency)}
          </div>

          <p>
            Checklist documental para preparar una ronda de financiación,
            conversaciones con inversores o revisión interna del paquete de
            materiales.
          </p>

          <div class="hero">
            <div class="hero-title">Data Room Readiness</div>
            <div class="hero-value">${escapeHtml(`${completion}%`)}</div>
            <div class="hero-caption">
              ${escapeHtml(completed)} documentos completados · ${escapeHtml(pending)} pendientes · ${escapeHtml(total)} items totales.
            </div>
          </div>

          <div class="grid">
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

          <h2>Data Room Checklist</h2>

          <table>
            <thead>
              <tr>
                <th>Documento</th>
                <th>Estado</th>
                <th>Nota</th>
              </tr>
            </thead>

            <tbody>
              ${buildChecklist(checklist)}
            </tbody>
          </table>

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

          <div class="notice">
            Este paquete es una guía documental para preparar el data room.
            Antes de compartirlo con terceros debe revisarse confidencialidad,
            permisos, documentación societaria y consistencia financiera.
          </div>

          <div class="footer">
            Generado por CEO's OS — Funding Workspace. Documento confidencial para preparación de ronda y revisión de materiales.
          </div>
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