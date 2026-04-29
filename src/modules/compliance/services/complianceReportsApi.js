const STORAGE_KEY = 'compliance_reports_api_v1';

function safeRead(fallback = []) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // En modo local/demo, si falla localStorage, no bloqueamos la app.
  }
}

function createId(prefix = 'compliance_report') {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

function escapeHtml(value = '') {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatDate(value) {
  if (!value) return 'Sin fecha';

  try {
    return new Date(value).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return 'Sin fecha';
  }
}

function formatScore(value) {
  if (value === null || value === undefined || value === '') return 'N/A';

  const parsed = Number(value);
  return Number.isFinite(parsed) ? `${Math.round(parsed)}/100` : String(value);
}

function buildReportId(supplierName = '') {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const safeName = String(supplierName || 'supplier')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 18);

  return `COMP-${datePart}-${safeName || 'SUPPLIER'}`;
}

function normalizeRiskText(value = '') {
  return String(value || '').trim().toLowerCase();
}

function buildDecisionSignal({ riskScore, resilienceScore, riskLevel }) {
  const risk = toNumber(riskScore, 0);
  const resilience = toNumber(resilienceScore, 0);
  const riskText = normalizeRiskText(riskLevel);

  const isHighRisk =
    risk >= 70 ||
    riskText.includes('alto') ||
    riskText.includes('high') ||
    riskText.includes('critical') ||
    riskText.includes('crítico');

  const isMediumRisk =
    risk >= 40 ||
    riskText.includes('medio') ||
    riskText.includes('medium') ||
    riskText.includes('moderado') ||
    riskText.includes('moderate');

  if (isHighRisk) {
    return {
      signal: 'Immediate review',
      tone: 'caution',
      nextStep:
        'Priorizar revisión humana, evidencias críticas y plan de mitigación antes de avanzar.'
    };
  }

  if (isMediumRisk || resilience < 60) {
    return {
      signal: 'Monitor & validate',
      tone: 'watch',
      nextStep:
        'Completar evidencias pendientes, validar alertas abiertas y mantener seguimiento operativo.'
    };
  }

  return {
    signal: 'Controlled',
    tone: 'positive',
    nextStep:
      'Mantener trazabilidad, revisar cambios relevantes y actualizar scoring ante nuevas evidencias.'
  };
}

function buildRecommendations(recommendations = []) {
  if (!Array.isArray(recommendations) || recommendations.length === 0) {
    return `
      <li>Revisar evidencias disponibles y completar documentación pendiente.</li>
      <li>Mantener trazabilidad de decisiones humanas y cambios de estado.</li>
      <li>Actualizar scoring cuando existan nuevas alertas o evidencias.</li>
    `;
  }

  return recommendations.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
}

function buildItemsCards(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return `
      <div class="empty-box">
        No hay alertas, evidencias o revisiones asociadas a este informe.
      </div>
    `;
  }

  return items
    .slice(0, 8)
    .map(
      (item) => `
        <div class="item-card avoid-break">
          <div class="item-top">
            <span class="item-type">${escapeHtml(item.type || 'Item')}</span>
            <span class="item-status">${escapeHtml(item.status || 'N/A')}</span>
          </div>

          <div class="item-title">${escapeHtml(item.title || 'Sin título')}</div>

          <div class="item-date">${escapeHtml(formatDate(item.date || item.createdAt))}</div>

          <div class="item-desc">
            ${escapeHtml(item.description || item.summary || 'Sin descripción')}
          </div>
        </div>
      `
    )
    .join('');
}

export const complianceReportsApi = {
  list(fallback = []) {
    return safeRead(fallback);
  },

  saveAll(reports = []) {
    safeWrite(reports);
    return reports;
  },

  getById(id, fallback = []) {
    const reports = safeRead(fallback);
    return reports.find((report) => report.id === id) || null;
  },

  listBySupplier(supplierId, fallback = []) {
    const reports = safeRead(fallback);

    if (!supplierId) return reports;

    return reports.filter((report) => report.supplierId === supplierId);
  },

  create(payload = {}, fallback = []) {
    const reports = safeRead(fallback);

    const report = {
      id: createId('report'),
      title: payload.title || 'Compliance Report',
      supplierId: payload.supplierId || '',
      supplierName: payload.supplierName || '',
      scope: payload.scope || 'supplier',
      status: payload.status || 'generated',
      riskScore: payload.riskScore ?? null,
      resilienceScore: payload.resilienceScore ?? null,
      riskLevel: payload.riskLevel || '',
      resilienceLevel: payload.resilienceLevel || '',
      summary: payload.summary || '',
      recommendations: payload.recommendations || [],
      items: payload.items || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const next = [report, ...reports];
    safeWrite(next);

    return report;
  },

  update(id, patch = {}, fallback = []) {
    const reports = safeRead(fallback);

    const next = reports.map((report) =>
      report.id === id
        ? {
            ...report,
            ...patch,
            updatedAt: new Date().toISOString()
          }
        : report
    );

    safeWrite(next);

    return next.find((report) => report.id === id) || null;
  },

  remove(id, fallback = []) {
    const reports = safeRead(fallback);
    const next = reports.filter((report) => report.id !== id);

    safeWrite(next);

    return {
      deleted: true,
      id
    };
  },

  removeBySupplier(supplierId, fallback = []) {
    const reports = safeRead(fallback);
    const next = reports.filter((report) => report.supplierId !== supplierId);

    safeWrite(next);

    return {
      deleted: true,
      supplierId
    };
  },

  clear() {
    safeWrite([]);
    return [];
  },

  buildSupplierReport({
    supplier,
    riskScore,
    resilienceScore,
    riskLevel,
    resilienceLevel,
    executiveSummary,
    evidenceSummary,
    reportItems = [],
    recommendations = []
  }) {
    if (!supplier) {
      return null;
    }

    return {
      id: createId('report'),
      title: `Compliance Report · ${supplier.name}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      scope: 'supplier',
      status: 'generated',
      riskScore,
      resilienceScore,
      riskLevel: riskLevel?.label || '',
      resilienceLevel: resilienceLevel?.label || '',
      summary:
        executiveSummary ||
        `${supplier.name} presenta un riesgo ${
          riskLevel?.label || 'no clasificado'
        } y una resiliencia ${resilienceLevel?.label || 'no clasificada'}.`,
      recommendations:
        recommendations.length > 0
          ? recommendations
          : [
              'Revisar evidencias disponibles y completar documentación pendiente.',
              'Mantener trazabilidad de decisiones humanas y cambios de estado.',
              'Actualizar scoring cuando existan nuevas alertas o evidencias.'
            ],
      evidenceSummary: evidenceSummary || null,
      items: reportItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  exportReport(report) {
    if (typeof window === 'undefined' || !report) return false;

    const reportDate = formatDate(report.createdAt || new Date().toISOString());
    const supplierName = report.supplierName || 'Sin proveedor';
    const reportId = buildReportId(supplierName);

    const riskScore = formatScore(report.riskScore);
    const resilienceScore = formatScore(report.resilienceScore);
    const riskLevel = report.riskLevel || 'N/A';
    const resilienceLevel = report.resilienceLevel || 'N/A';

    const evidenceSummary = report.evidenceSummary || {};
    const totalEvidence = evidenceSummary.totalEvidence ?? evidenceSummary.total ?? 'N/A';
    const pendingReviews =
      evidenceSummary.pendingReviews ?? evidenceSummary.pending ?? 'N/A';
    const coverageLabel =
      evidenceSummary.coverageLabel || evidenceSummary.coverage || 'N/A';

    const totalItems = Array.isArray(report.items) ? report.items.length : 0;

    const decision = buildDecisionSignal({
      riskScore: report.riskScore,
      resilienceScore: report.resilienceScore,
      riskLevel
    });

    const html = `
      <html>
        <head>
          <title>CEO's OS - Compliance Report - ${escapeHtml(supplierName)}</title>

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
              background: linear-gradient(90deg, #020617, #ef4444, #f97316);
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
              background: linear-gradient(135deg, #020617, #ef4444);
              color: #ffffff;
              font-weight: 950;
              font-size: 13px;
              box-shadow: 0 10px 20px rgba(239, 68, 68, 0.2);
            }

            .brand {
              font-size: 24px;
              font-weight: 950;
              letter-spacing: -0.05em;
              color: #020617;
            }

            .brand span {
              color: #ef4444;
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
              background: #fef2f2;
              color: #b91c1c;
              border: 1px solid #fecaca;
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
              background: #ef4444;
              box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.12);
            }

            h1 {
              font-size: 34px;
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
              background: linear-gradient(180deg, #ef4444, #f97316);
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

            .items-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr) !important;
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
              letter-spacing: -0.04em;
            }

            .risk {
              color: #dc2626;
            }

            .resilience {
              color: #059669;
            }

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
              background:
                linear-gradient(135deg, rgba(248, 250, 252, 0.95), rgba(254, 242, 242, 0.68));
              border: 1px solid #fee2e2;
            }

            .executive-summary p {
              margin: 0;
            }

            .hero {
              background:
                radial-gradient(circle at 20% 20%, rgba(239, 68, 68, 0.22), transparent 28%),
                linear-gradient(135deg, #020617, #111827 48%, #7f1d1d);
              color: #ffffff;
              border-radius: 22px;
              padding: 25px 26px;
              margin: 18px 0 18px;
              text-align: center;
              border: 1px solid rgba(239, 68, 68, 0.28);
              box-shadow:
                0 20px 42px rgba(15, 23, 42, 0.22),
                inset 0 1px 0 rgba(255, 255, 255, 0.08);
            }

            .hero-title {
              color: #fecaca;
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
              color: #fee2e2;
              font-size: 11px;
            }

            .decision-panel {
              margin: 17px 0 0;
              padding: 14px;
              border-radius: 18px;
              background: linear-gradient(135deg, #020617, #111827);
              color: #ffffff;
              border: 1px solid rgba(239, 68, 68, 0.28);
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
              color: #fecaca;
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
              color: #b91c1c;
            }

            .item-title {
              font-size: 12px;
              font-weight: 950;
              color: #020617;
              line-height: 1.25;
              margin-bottom: 5px;
            }

            .item-date {
              font-size: 9px;
              color: #64748b;
              margin-bottom: 6px;
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
                linear-gradient(135deg, #020617, #111827 55%, #7f1d1d);
              color: #ffffff;
              border: 1px solid rgba(239, 68, 68, 0.26);
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
              .grid {
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
                        <div class="subline">Supply Chain Compliance Report</div>
                      </div>
                    </div>
                  </div>

                  <div class="meta">
                    <strong>Strictly Confidential</strong><br/>
                    ${escapeHtml(reportDate)}<br/>
                    Compliance Workspace
                  </div>
                </div>

                <div class="module-badge">Compliance DSS Report</div>

                <h1>${escapeHtml(report.title || 'Compliance Report')}</h1>

                <div class="deal-meta avoid-break">
                  <span class="deal-pill">Supplier: ${escapeHtml(supplierName)}</span>
                  <span class="deal-pill">Scope: ${escapeHtml(report.scope || 'supplier')}</span>
                  <span class="deal-pill">Status: ${escapeHtml(report.status || 'generated')}</span>
                  <span class="deal-pill">Risk: ${escapeHtml(riskLevel)}</span>
                </div>

                <div class="prepared-panel avoid-break">
                  <div class="prepared-item">
                    <div class="prepared-label">Prepared for</div>
                    <div class="prepared-value">Compliance Review</div>
                  </div>

                  <div class="prepared-item">
                    <div class="prepared-label">Prepared by</div>
                    <div class="prepared-value">CEO's OS Compliance Workspace</div>
                  </div>

                  <div class="prepared-item">
                    <div class="prepared-label">Report ID</div>
                    <div class="prepared-value">${escapeHtml(reportId)}</div>
                  </div>
                </div>

                <div class="executive-summary">
                  <p>${escapeHtml(report.summary || 'Sin resumen ejecutivo.')}</p>
                </div>

                <div class="hero">
                  <div class="hero-title">Supplier Risk Score</div>
                  <div class="hero-value">${escapeHtml(riskScore)}</div>
                  <div class="hero-caption">
                    Nivel de riesgo: ${escapeHtml(riskLevel)} · Resiliencia: ${escapeHtml(resilienceLevel)}
                  </div>
                </div>

                <div class="grid avoid-break">
                  <div class="kpi">
                    <div class="kpi-label">Risk Score</div>
                    <div class="kpi-value risk">${escapeHtml(riskScore)}</div>
                    <div class="kpi-note">Indicador ejecutivo de exposición.</div>
                  </div>

                  <div class="kpi">
                    <div class="kpi-label">Risk Level</div>
                    <div class="kpi-value risk">${escapeHtml(riskLevel)}</div>
                    <div class="kpi-note">Clasificación del nivel de riesgo.</div>
                  </div>

                  <div class="kpi">
                    <div class="kpi-label">Resilience</div>
                    <div class="kpi-value resilience">${escapeHtml(resilienceScore)}</div>
                    <div class="kpi-note">Capacidad de respuesta y continuidad.</div>
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
                      <div class="decision-label">Evidence</div>
                      <div class="decision-value">${escapeHtml(totalEvidence)}</div>
                    </div>

                    <div class="decision-item">
                      <div class="decision-label">Next Step</div>
                      <div class="decision-value">Human Review</div>
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
                  <h2>Evidence Coverage</h2>

                  <div class="grid">
                    <div class="kpi">
                      <div class="kpi-label">Evidencias</div>
                      <div class="kpi-value">${escapeHtml(totalEvidence)}</div>
                    </div>

                    <div class="kpi">
                      <div class="kpi-label">Revisiones pendientes</div>
                      <div class="kpi-value">${escapeHtml(pendingReviews)}</div>
                    </div>

                    <div class="kpi">
                      <div class="kpi-label">Cobertura</div>
                      <div class="kpi-value">${escapeHtml(coverageLabel)}</div>
                    </div>
                  </div>
                </div>

                <div class="section">
                  <h2>Recommendations</h2>

                  <div class="panel">
                    <ul>
                      ${buildRecommendations(report.recommendations)}
                    </ul>
                  </div>
                </div>

                <div class="section">
                  <h2>Compliance Summary</h2>

                  <div class="summary-grid">
                    <div class="summary-card">
                      <div class="summary-label">Items</div>
                      <div class="summary-value">${escapeHtml(totalItems)}</div>
                    </div>

                    <div class="summary-card">
                      <div class="summary-label">Risk</div>
                      <div class="summary-value">${escapeHtml(riskLevel)}</div>
                    </div>

                    <div class="summary-card">
                      <div class="summary-label">Resilience</div>
                      <div class="summary-value">${escapeHtml(resilienceLevel)}</div>
                    </div>

                    <div class="summary-card">
                      <div class="summary-label">Decision</div>
                      <div class="summary-value">${escapeHtml(decision.signal)}</div>
                    </div>
                  </div>
                </div>

                <div class="notice">
                  <h3>Decision Support System</h3>
                  <p>
                    Este informe funciona como DSS —Decision Support System—.
                    Sirve para priorizar revisión, evidencias y acciones, pero no sustituye
                    revisión humana, legal, contractual o de compliance.
                  </p>
                </div>
              </div>

              <div class="report-footer">
                <span><strong>CEO's OS</strong> · Evidence Coverage & Recommendations</span>
                <span>Page 2 of 3 · ${escapeHtml(reportId)}</span>
              </div>
            </section>

            <section class="report-page last">
              <div class="page-body">
                <div class="section">
                  <h2>Alerts, Evidence & Reviews</h2>

                  <div class="items-grid">
                    ${buildItemsCards(report.items)}
                  </div>
                </div>

                <div class="section">
                  <h2>Review Checklist</h2>

                  <div class="summary-grid">
                    <div class="summary-card">
                      <div class="summary-label">Human Review</div>
                      <div class="summary-value">Required</div>
                    </div>

                    <div class="summary-card">
                      <div class="summary-label">Legal Review</div>
                      <div class="summary-value">If material risk</div>
                    </div>

                    <div class="summary-card">
                      <div class="summary-label">Evidence Update</div>
                      <div class="summary-value">Recommended</div>
                    </div>

                    <div class="summary-card">
                      <div class="summary-label">Monitoring</div>
                      <div class="summary-value">Active</div>
                    </div>
                  </div>
                </div>

                <div class="closing-panel">
                  <h3>Executive closing note</h3>
                  <p>
                    This report is designed as an executive compliance layer. It should be used
                    to structure supplier review, validate evidence, prioritize risks and decide
                    whether escalation, mitigation or continued monitoring is required.
                  </p>
                </div>

                <div class="disclaimer">
                  <strong>Disclaimer.</strong>
                  Este informe tiene carácter orientativo y preliminar. No constituye asesoramiento
                  legal, fiscal, contractual ni una auditoría formal de compliance. Las conclusiones
                  deben ser revisadas por responsables internos y asesores profesionales antes de
                  tomar decisiones operativas, contractuales o regulatorias.
                </div>
              </div>

              <div class="report-footer">
                <span><strong>Strictly Confidential</strong> · Generated by CEO's OS Compliance Workspace</span>
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