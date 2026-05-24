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

function formatOperationalCaptureForExport(value) {
  if (value === null || value === undefined) {
    return 'N/A · insufficient denominator (operational DSS)';
  }

  return `${toNumber(value)}%`;
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function formatCurrency(value, currency = 'EUR') {
  const safeValue = toNumber(value);

  try {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(safeValue);
  } catch {
    return `${new Intl.NumberFormat('es-ES', {
      maximumFractionDigits: 0
    }).format(safeValue)} ${currency}`;
  }
}

function formatDate(value) {
  if (!value) return 'N/A';

  try {
    return new Date(value).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return String(value);
  }
}

function buildReportId(dealName = '') {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const safeName = String(dealName || 'integration')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 18);

  return `PMI-${datePart}-${safeName || 'INTEGRATION'}`;
}

function buildDecisionSignal({ integrationScore, highRiskCount, synergyCaptureRate }) {
  const score = toNumber(integrationScore);
  const risks = toNumber(highRiskCount);
  const capture =
    synergyCaptureRate === null || synergyCaptureRate === undefined
      ? null
      : toNumber(synergyCaptureRate);

  if (score >= 82 && risks === 0) {
    return {
      tone: 'positive',
      signal: 'Integration on track',
      decision: 'Accelerate synergy capture',
      nextStep:
        'Mantener cadencia ejecutiva, acelerar captura de sinergias y preparar revisión de comité con foco en value capture.'
    };
  }

  if (score >= 62 && risks <= 1) {
    return {
      tone: 'watch',
      signal: 'Controlled with watch items',
      decision: 'Validate open risks',
      nextStep:
        'Revisar riesgos abiertos, reforzar owners y actualizar forecast de sinergias antes del siguiente comité.'
    };
  }

  if (capture < 35 || risks > 0) {
    return {
      tone: 'caution',
      signal: 'Integration risk requires attention',
      decision: 'Escalate integration controls',
      nextStep:
        'Elevar mitigantes, confirmar presupuesto, bloquear dependencias críticas y exigir actualización semanal.'
    };
  }

  return {
    tone: 'watch',
    signal: 'Integration plan in progress',
    decision: 'Maintain execution control',
    nextStep:
      'Mantener seguimiento de workstreams, sinergias, hitos y riesgos antes de avanzar de fase.'
  };
}

function buildList(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return '<li>No hay acciones registradas.</li>';
  }

  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
}

function buildMilestones(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return '<div class="empty-box">No hay hitos 30-60-90 registrados.</div>';
  }

  return items
    .slice(0, 4)
    .map((item) => {
      const progress = clamp(toNumber(item.progress));

      return `
        <div class="item-card avoid-break">
          <div class="item-top">
            <span>${escapeHtml(item.label || 'Milestone')}</span>
            <strong>${escapeHtml(item.status || 'N/A')}</strong>
          </div>

          <h3>${escapeHtml(item.title || 'Sin título')}</h3>

          <div class="progress-track">
            <div class="progress-fill" style="width:${progress}%"></div>
          </div>

          <p>${escapeHtml(item.summary || 'Sin resumen registrado.')}</p>
        </div>
      `;
    })
    .join('');
}

function buildWorkstreams(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return '<div class="empty-box">No hay workstreams registrados.</div>';
  }

  return items
    .slice(0, 8)
    .map((item) => {
      const progress = clamp(toNumber(item.progress));

      return `
        <div class="item-card avoid-break">
          <div class="item-top">
            <span>${escapeHtml(item.priority || 'Priority')}</span>
            <strong>${escapeHtml(item.risk || 'Risk N/A')}</strong>
          </div>

          <h3>${escapeHtml(item.name || 'Workstream')}</h3>
          <div class="item-meta">Owner: ${escapeHtml(item.owner || 'N/A')}</div>

          <div class="progress-track">
            <div class="progress-fill" style="width:${progress}%"></div>
          </div>

          <p>${escapeHtml(item.summary || 'Sin resumen registrado.')}</p>
        </div>
      `;
    })
    .join('');
}

function buildRisks(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return '<div class="empty-box">No hay riesgos registrados.</div>';
  }

  return items
    .slice(0, 8)
    .map(
      (item) => `
        <div class="item-card risk-card avoid-break">
          <div class="item-top">
            <span>${escapeHtml(item.owner || 'Owner N/A')}</span>
            <strong>${escapeHtml(item.severity || 'N/A')}</strong>
          </div>

          <h3>${escapeHtml(item.title || 'Risk')}</h3>
          <p>${escapeHtml(item.mitigation || 'Sin mitigante registrado.')}</p>
        </div>
      `
    )
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
  }, 500);

  return true;
}

function buildBoardMemoHtml({ pmiCase = {}, engine = {} }) {
  const currency = pmiCase.currency || 'EUR';
  const reportDate = new Date().toLocaleDateString('es-ES');
  const reportId = buildReportId(pmiCase.dealName);

  const integrationScore = toNumber(engine.integrationScore);
  const synergyTarget = toNumber(engine.synergyTarget ?? pmiCase.synergyTarget);
  const synergyCaptured = toNumber(engine.synergyCaptured ?? pmiCase.synergyCaptured);
  const synergyCaptureRateRaw = engine.synergyCaptureRate;
  const synergyCaptureRateDisplay = formatOperationalCaptureForExport(synergyCaptureRateRaw);
  const synergyCaptureRate =
    synergyCaptureRateRaw === null || synergyCaptureRateRaw === undefined
      ? null
      : toNumber(synergyCaptureRateRaw);
  const integrationBudget = toNumber(engine.integrationBudget ?? pmiCase.integrationBudget);
  const integrationCostUsed = toNumber(engine.integrationCostUsed ?? pmiCase.integrationCostUsed);
  const budgetUsedRate = toNumber(engine.budgetUsedRate);
  const synergyGap = toNumber(engine.synergyGap);
  const budgetRemaining = toNumber(engine.budgetRemaining);
  const openRiskCount = toNumber(engine.openRiskCount);
  const executionVelocity = toNumber(engine.executionVelocity);
  const workstreamProgress = toNumber(engine.workstreamProgress);
  const milestoneProgress = toNumber(engine.milestoneProgress);
  const highRiskCount = toNumber(engine.highRiskCount);

  const workstreams = Array.isArray(engine.workstreams) ? engine.workstreams : [];
  const milestones = Array.isArray(engine.milestones) ? engine.milestones : [];
  const risks = Array.isArray(engine.risks) ? engine.risks : [];
  const boardActions = Array.isArray(engine.boardActions) ? engine.boardActions : [];

  const decision = buildDecisionSignal({
    integrationScore,
    highRiskCount,
    synergyCaptureRate
  });

  return `
    <html>
      <head>
        <title>CEO's OS - PMI Board Integration Memo</title>

        <style>
          @page { size: A4; margin: 0; }

          * { box-sizing: border-box; }

          html,
          body {
            width: 210mm;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
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
            background: linear-gradient(90deg, #020617, #7c3aed, #34d399);
          }

          .report-page:not(.last) {
            break-after: page;
            page-break-after: always;
          }

          .report-page.last {
            break-after: auto;
            page-break-after: auto;
          }

          .page-body { flex: 1; }

          .avoid-break,
          .section,
          .panel,
          .kpi,
          .summary-card,
          .decision-panel,
          .report-footer,
          .prepared-panel,
          .prepared-item,
          .item-card,
          .closing-panel,
          .disclaimer,
          .notice {
            break-inside: avoid;
            page-break-inside: avoid;
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
            background: linear-gradient(135deg, #020617, #7c3aed);
            color: #ffffff;
            font-weight: 950;
            font-size: 13px;
          }

          .brand {
            font-size: 24px;
            font-weight: 950;
            letter-spacing: 0;
            color: #020617;
          }

          .brand span { color: #7c3aed; }

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

          .meta strong { color: #020617; }

          .module-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #ede9fe;
            color: #6d28d9;
            border: 1px solid #ddd6fe;
            border-radius: 999px;
            padding: 6px 10px;
            font-size: 9.5px;
            font-weight: 950;
            text-transform: uppercase;
            margin-bottom: 12px;
            letter-spacing: 0.08em;
          }

          h1 {
            font-size: 34px;
            margin: 0 0 8px 0;
            letter-spacing: 0;
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
            background: linear-gradient(180deg, #7c3aed, #34d399);
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

          li { margin-bottom: 3px; }

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
            grid-template-columns: repeat(3, 1fr);
            gap: 9px;
            margin: 12px 0 13px;
          }

          .summary-grid,
          .decision-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin: 12px 0 14px;
          }

          .items-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-top: 10px;
          }

          .prepared-item,
          .kpi,
          .summary-card,
          .item-card {
            background: linear-gradient(180deg, #ffffff, #f8fafc);
            border: 1px solid #dbe3ef;
            border-radius: 16px;
            padding: 12px;
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.045);
          }

          .prepared-label,
          .kpi-label,
          .summary-label {
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
            letter-spacing: 0;
          }

          .green { color: #059669; }
          .purple { color: #7c3aed; }
          .orange { color: #d97706; }
          .red { color: #dc2626; }

          .kpi-note {
            font-size: 9.6px;
            color: #64748b;
            margin-top: 4px;
            line-height: 1.3;
          }

          .executive-summary {
            margin: 13px 0 16px;
            padding: 13px 15px;
            border-radius: 16px;
            background: linear-gradient(135deg, rgba(248, 250, 252, 0.95), rgba(245, 243, 255, 0.75));
            border: 1px solid #ddd6fe;
          }

          .executive-summary p { margin: 0; }

          .hero {
            background:
              radial-gradient(circle at 20% 20%, rgba(124, 58, 237, 0.24), transparent 28%),
              linear-gradient(135deg, #020617, #0f172a 48%, #4c1d95);
            color: #ffffff;
            border-radius: 22px;
            padding: 25px 26px;
            margin: 18px 0 18px;
            text-align: center;
          }

          .hero-title {
            color: #ddd6fe;
            font-size: 10px;
            text-transform: uppercase;
            font-weight: 950;
            margin-bottom: 7px;
            letter-spacing: 0.12em;
          }

          .hero-value {
            font-size: 46px;
            font-weight: 950;
            letter-spacing: 0;
            line-height: 1;
          }

          .hero-caption {
            margin-top: 8px;
            color: #ede9fe;
            font-size: 11px;
          }

          .decision-panel,
          .notice,
          .closing-panel {
            margin-top: 18px;
            padding: 16px;
            border-radius: 18px;
            background: linear-gradient(135deg, #020617, #0f172a 55%, #4c1d95);
            color: #ffffff;
            border: 1px solid rgba(124, 58, 237, 0.26);
          }

          .decision-panel h3,
          .notice h3,
          .closing-panel h3 {
            color: #ffffff;
            margin-bottom: 8px;
          }

          .decision-panel p,
          .notice p,
          .closing-panel p {
            color: #cbd5e1;
            margin: 0;
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
            color: #ddd6fe;
            letter-spacing: 0.09em;
            text-transform: uppercase;
            margin-bottom: 5px;
          }

          .decision-value {
            font-size: 10.8px;
            font-weight: 850;
            line-height: 1.3;
          }

          .signal-positive { color: #86efac; }
          .signal-watch { color: #fde68a; }
          .signal-caution { color: #fca5a5; }

          .item-top {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            margin-bottom: 8px;
          }

          .item-top span,
          .item-top strong {
            font-size: 8px;
            text-transform: uppercase;
            font-weight: 950;
            letter-spacing: 0.08em;
            color: #64748b;
          }

          .item-top strong { color: #6d28d9; }

          .item-meta {
            font-size: 9.2px;
            color: #64748b;
            margin-bottom: 7px;
          }

          .progress-track {
            overflow: hidden;
            height: 8px;
            border-radius: 999px;
            background: #e2e8f0;
            margin: 8px 0 8px;
          }

          .progress-fill {
            height: 100%;
            border-radius: 999px;
            background: linear-gradient(90deg, #7c3aed, #34d399);
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

          .panel {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 13px 15px;
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

          .report-footer strong { color: #64748b; }

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
          }
        </style>
      </head>

      <body>
        <div class="document">
          <section class="report-page">
            <div class="page-body">
              <div class="header avoid-break">
                <div class="brand-row">
                  <div class="brand-mark">OS</div>
                  <div>
                    <div class="brand">CEO's <span>OS</span></div>
                    <div class="subline">PMI & Synergies Board Memo</div>
                  </div>
                </div>

                <div class="meta">
                  <strong>Strictly Confidential</strong><br/>
                  ${escapeHtml(reportDate)}<br/>
                  PMI Workspace
                </div>
              </div>

              <div class="module-badge">Board Integration Memo</div>

              <h1>${escapeHtml(pmiCase.dealName || 'PMI Integration')}</h1>

              <div class="deal-meta avoid-break">
                <span class="deal-pill">Buyer: ${escapeHtml(pmiCase.buyerName || 'N/A')}</span>
                <span class="deal-pill">Target: ${escapeHtml(pmiCase.targetName || 'N/A')}</span>
                <span class="deal-pill">Closing: ${escapeHtml(formatDate(pmiCase.closingDate))}</span>
                <span class="deal-pill">Day ${escapeHtml(pmiCase.integrationDay || 0)}</span>
              </div>

              <div class="prepared-panel avoid-break">
                <div class="prepared-item">
                  <div class="prepared-label">Prepared for</div>
                  <div class="prepared-value">Board / Integration Committee</div>
                </div>

                <div class="prepared-item">
                  <div class="prepared-label">Prepared by</div>
                  <div class="prepared-value">CEO's OS PMI Workspace</div>
                </div>

                <div class="prepared-item">
                  <div class="prepared-label">Report ID</div>
                  <div class="prepared-value">${escapeHtml(reportId)}</div>
                </div>
              </div>

              <div class="executive-summary">
                <p>
                  Executive memo para revisar el estado de integración post-adquisición,
                  captura de sinergias, avance de workstreams, riesgos críticos y decisiones
                  pendientes de comité.
                </p>
              </div>

              <div class="hero">
                <div class="hero-title">Integration Score</div>
                <div class="hero-value">${escapeHtml(`${integrationScore}/100`)}</div>
                <div class="hero-caption">
                  ${escapeHtml(decision.signal)} · ${escapeHtml(decision.decision)}
                </div>
              </div>

              <div class="grid avoid-break">
                <div class="kpi">
                  <div class="kpi-label">Synergies captured</div>
                  <div class="kpi-value green">${escapeHtml(formatCurrency(synergyCaptured, currency))}</div>
                  <div class="kpi-note">Target: ${escapeHtml(formatCurrency(synergyTarget, currency))}</div>
                </div>

                <div class="kpi">
                  <div class="kpi-label">Capture rate</div>
                  <div class="kpi-value purple">${escapeHtml(synergyCaptureRateDisplay)}</div>
                  <div class="kpi-note">Porcentaje capturado frente al objetivo.</div>
                </div>

                <div class="kpi">
                  <div class="kpi-label">Budget used</div>
                  <div class="kpi-value orange">${escapeHtml(`${budgetUsedRate}%`)}</div>
                  <div class="kpi-note">${escapeHtml(formatCurrency(integrationCostUsed, currency))} usado de ${escapeHtml(formatCurrency(integrationBudget, currency))}.</div>
                </div>
              </div>

              <div class="grid avoid-break">
                <div class="kpi">
                  <div class="kpi-label">Workstream progress</div>
                  <div class="kpi-value">${escapeHtml(`${workstreamProgress}%`)}</div>
                </div>

                <div class="kpi">
                  <div class="kpi-label">Milestone progress</div>
                  <div class="kpi-value">${escapeHtml(`${milestoneProgress}%`)}</div>
                </div>

                <div class="kpi">
                  <div class="kpi-label">High risks</div>
                  <div class="kpi-value red">${escapeHtml(highRiskCount)}</div>
                  <div class="kpi-note">${escapeHtml(openRiskCount)} open risks in register.</div>
                </div>
              </div>

              <div class="grid avoid-break">
                <div class="kpi">
                  <div class="kpi-label">Synergy gap</div>
                  <div class="kpi-value orange">${escapeHtml(formatCurrency(synergyGap, currency))}</div>
                  <div class="kpi-note">Remaining value capture against target.</div>
                </div>

                <div class="kpi">
                  <div class="kpi-label">Budget remaining</div>
                  <div class="kpi-value green">${escapeHtml(formatCurrency(budgetRemaining, currency))}</div>
                  <div class="kpi-note">Available PMI budget envelope.</div>
                </div>

                <div class="kpi">
                  <div class="kpi-label">Execution velocity</div>
                  <div class="kpi-value purple">${escapeHtml(`${executionVelocity}%`)}</div>
                  <div class="kpi-note">Combined workstream and milestone momentum.</div>
                </div>
              </div>

              <div class="decision-panel">
                <h3>Executive Decision Signal</h3>

                <div class="decision-grid">
                  <div class="decision-item">
                    <div class="decision-label">Signal</div>
                    <div class="decision-value signal-${escapeHtml(decision.tone)}">${escapeHtml(decision.signal)}</div>
                  </div>

                  <div class="decision-item">
                    <div class="decision-label">Decision</div>
                    <div class="decision-value">${escapeHtml(decision.decision)}</div>
                  </div>

                  <div class="decision-item">
                    <div class="decision-label">Committee Focus</div>
                    <div class="decision-value">Risks + Synergies</div>
                  </div>

                  <div class="decision-item">
                    <div class="decision-label">Next Step</div>
                    <div class="decision-value">Board Review</div>
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
                <h2>30-60-90 Integration Roadmap</h2>

                <div class="items-grid">
                  ${buildMilestones(milestones)}
                </div>
              </div>

              <div class="section">
                <h2>Integration Workstreams</h2>

                <div class="items-grid">
                  ${buildWorkstreams(workstreams)}
                </div>
              </div>

              <div class="notice">
                <h3>Execution control note</h3>
                <p>
                  El objetivo del PMI no es solo cerrar tareas, sino convertir la tesis
                  de adquisición en valor capturado, continuidad operativa y control de riesgos.
                </p>
              </div>
            </div>

            <div class="report-footer">
              <span><strong>CEO's OS</strong> · Roadmap & Workstreams</span>
              <span>Page 2 of 3 · ${escapeHtml(reportId)}</span>
            </div>
          </section>

          <section class="report-page last">
            <div class="page-body">
              <div class="section">
                <h2>Integration Risks & Mitigants</h2>

                <div class="items-grid">
                  ${buildRisks(risks)}
                </div>
              </div>

              <div class="section">
                <h2>Board Actions</h2>

                <div class="panel">
                  <ul>
                    ${buildList(boardActions)}
                  </ul>
                </div>
              </div>

              <div class="section">
                <h2>Committee Checklist</h2>

                <div class="summary-grid">
                  <div class="summary-card">
                    <div class="summary-label">Synergy Forecast</div>
                    <div class="summary-value">Update required</div>
                  </div>

                  <div class="summary-card">
                    <div class="summary-label">Risk Owners</div>
                    <div class="summary-value">Validate</div>
                  </div>

                  <div class="summary-card">
                    <div class="summary-label">Systems Plan</div>
                    <div class="summary-value">Review</div>
                  </div>

                  <div class="summary-card">
                    <div class="summary-label">Next Committee</div>
                    <div class="summary-value">Recommended</div>
                  </div>
                </div>
              </div>

              <div class="closing-panel">
                <h3>Executive closing note</h3>
                <p>
                  This memo is designed as a board-level integration control layer.
                  It should support decision-making around synergy capture, execution
                  risks, integration owners, budget discipline and next-phase priorities.
                </p>
              </div>

              <div class="disclaimer">
                <strong>Disclaimer.</strong>
                Este memo tiene carácter ejecutivo y preliminar. No sustituye revisión legal,
                fiscal, laboral, tecnológica ni operativa. Las decisiones de integración deben
                validarse por los responsables internos y asesores correspondientes.
              </div>
            </div>

            <div class="report-footer">
              <span><strong>Strictly Confidential</strong> · Generated by CEO's OS PMI Workspace</span>
              <span>Page 3 of 3 · ${escapeHtml(reportId)}</span>
            </div>
          </section>
        </div>
      </body>
    </html>
  `;
}

export const pmiExportApi = {
  exportBoardMemo({ pmiCase = {}, engine = {} }) {
    if (typeof window === 'undefined') return false;

    const html = buildBoardMemoHtml({
      pmiCase,
      engine
    });

    return openPrintableWindow(html);
  }
};
