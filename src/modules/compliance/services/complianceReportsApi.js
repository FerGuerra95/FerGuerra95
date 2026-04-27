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

function buildItemsTable(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    return `
      <div class="empty-box">
        No hay alertas, evidencias o revisiones asociadas a este informe.
      </div>
    `;
  }

  return `
    <table>
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Título</th>
          <th>Estado</th>
          <th>Fecha</th>
          <th>Descripción</th>
        </tr>
      </thead>

      <tbody>
        ${items
          .map(
            (item) => `
              <tr>
                <td>${escapeHtml(item.type || 'Item')}</td>
                <td>${escapeHtml(item.title || 'Sin título')}</td>
                <td>${escapeHtml(item.status || 'N/A')}</td>
                <td>${escapeHtml(formatDate(item.date || item.createdAt))}</td>
                <td>${escapeHtml(item.description || item.summary || 'Sin descripción')}</td>
              </tr>
            `
          )
          .join('')}
      </tbody>
    </table>
  `;
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
        `${supplier.name} presenta un riesgo ${riskLevel?.label || 'no clasificado'} y una resiliencia ${resilienceLevel?.label || 'no clasificada'}.`,
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

    const html = `
      <html>
        <head>
          <title>CEO's OS - Compliance Report - ${escapeHtml(supplierName)}</title>
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
              border-bottom: 4px solid #ef4444;
              padding-bottom: 20px;
              margin-bottom: 34px;
            }

            .brand {
              font-size: 26px;
              font-weight: 900;
              letter-spacing: -0.03em;
            }

            .brand span {
              color: #ef4444;
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
              background: #fef2f2;
              color: #b91c1c;
              border: 1px solid #fecaca;
              border-radius: 999px;
              padding: 6px 10px;
              font-size: 11px;
              font-weight: 900;
              text-transform: uppercase;
              margin-bottom: 14px;
            }

            h1 {
              font-size: 36px;
              margin: 0 0 8px 0;
              letter-spacing: -0.04em;
            }

            h2 {
              font-size: 17px;
              margin-top: 36px;
              border-left: 4px solid #ef4444;
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
              background: linear-gradient(135deg, #111827, #7f1d1d);
              color: #ffffff;
              border-radius: 18px;
              padding: 28px;
              margin: 28px 0 30px;
              text-align: center;
            }

            .hero-title {
              color: #fecaca;
              font-size: 12px;
              text-transform: uppercase;
              font-weight: 900;
              margin-bottom: 8px;
              letter-spacing: 0.08em;
            }

            .hero-value {
              font-size: 44px;
              font-weight: 900;
              letter-spacing: -0.05em;
            }

            .hero-caption {
              margin-top: 8px;
              color: #fee2e2;
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

            .risk {
              color: #dc2626;
            }

            .resilience {
              color: #059669;
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

            .empty-box {
              background: #f8fafc;
              border: 1px dashed #cbd5e1;
              border-radius: 14px;
              padding: 18px;
              color: #64748b;
              font-size: 14px;
            }

            .notice {
              background: #fff7ed;
              border: 1px solid #fed7aa;
              color: #9a3412;
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
                <div class="subline">Supply Chain Compliance Report</div>
              </div>

              <div class="meta">
                DSS Report<br/>
                ${escapeHtml(reportDate)}<br/>
                Compliance Workspace
              </div>
            </div>

            <div class="module-badge">Compliance DSS Report</div>

            <h1>${escapeHtml(report.title || 'Compliance Report')}</h1>

            <div class="subline">
              Proveedor: ${escapeHtml(supplierName)} · Scope: ${escapeHtml(report.scope || 'supplier')} · Estado: ${escapeHtml(report.status || 'generated')}
            </div>

            <p>${escapeHtml(report.summary || 'Sin resumen ejecutivo.')}</p>

            <div class="hero">
              <div class="hero-title">Supplier Risk Score</div>
              <div class="hero-value">${escapeHtml(riskScore)}</div>
              <div class="hero-caption">
                Nivel de riesgo: ${escapeHtml(riskLevel)} · Resiliencia: ${escapeHtml(resilienceLevel)}
              </div>
            </div>

            <div class="grid">
              <div class="kpi">
                <div class="kpi-label">Risk Score</div>
                <div class="kpi-value risk">${escapeHtml(riskScore)}</div>
              </div>

              <div class="kpi">
                <div class="kpi-label">Risk Level</div>
                <div class="kpi-value risk">${escapeHtml(riskLevel)}</div>
              </div>

              <div class="kpi">
                <div class="kpi-label">Resilience</div>
                <div class="kpi-value resilience">${escapeHtml(resilienceScore)}</div>
              </div>
            </div>

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

            <h2>Recomendaciones</h2>

            <ul>
              ${buildRecommendations(report.recommendations)}
            </ul>

            <h2>Alertas, evidencias y revisiones</h2>

            ${buildItemsTable(report.items)}

            <div class="notice">
              Este informe es una herramienta DSS —Decision Support System—.
              Sirve como soporte para priorizar revisión, evidencias y acciones,
              pero no sustituye revisión humana, legal, contractual o de compliance.
            </div>

            <div class="footer">
              Generado por CEO's OS — Compliance Workspace. Documento confidencial para uso interno y soporte a decisión.
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