import { calculateWeightedRiskScore } from '../engine/complianceWeightedRisk.js';

const STORAGE_KEY = 'compliance_reports_api_v1';

export const WEIGHTED_RISK_LABEL = 'Weighted risk (explicable)';

export function supplierHasExplicitWeightedRiskInputs(supplier) {
  if (!supplier || typeof supplier !== 'object') {
    return false;
  }

  return (
    Object.prototype.hasOwnProperty.call(supplier, 'financialRisk') &&
    Object.prototype.hasOwnProperty.call(supplier, 'jurisdictionRisk') &&
    Object.prototype.hasOwnProperty.call(supplier, 'evidenceRisk')
  );
}

export function resolveWeightedRiskScoreForSupplier(supplier) {
  if (!supplierHasExplicitWeightedRiskInputs(supplier)) {
    return null;
  }

  return calculateWeightedRiskScore({
    financialRisk: supplier.financialRisk,
    jurisdictionRisk: supplier.jurisdictionRisk,
    evidenceRisk: supplier.evidenceRisk
  });
}

function normalizeWeightedRiskScoreForReport(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

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

function formatMoney(value) {
  const parsed = Number(value || 0);

  if (!Number.isFinite(parsed) || parsed <= 0) return 'N/A';

  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(parsed);
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

function buildDecisionSignal({ riskScore, resilienceScore, riskLevel, totalEvidence, pendingReviews }) {
  const risk = toNumber(riskScore, 0);
  const resilience = toNumber(resilienceScore, 0);
  const evidence = toNumber(totalEvidence, 0);
  const pending = toNumber(pendingReviews, 0);
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
      boardDecision: 'Hold external circulation',
      tone: 'caution',
      executiveLabel: 'High exposure',
      nextStep:
        'Priorizar revisión humana, evidencias críticas y plan de mitigación antes de avanzar.',
      memo:
        'El proveedor presenta una exposición elevada. Antes de circular conclusiones fuera del equipo interno, conviene cerrar evidencias críticas, documentar mitigantes y validar la decisión con compliance/legal.'
    };
  }

  if (evidence === 0) {
    return {
      signal: 'Evidence gap',
      boardDecision: 'Do not circulate',
      tone: 'watch',
      executiveLabel: 'Evidence required',
      nextStep:
        'Registrar evidencia mínima y vincularla al expediente antes de considerar el informe defendible.',
      memo:
        'El proveedor puede analizarse, pero la ausencia de evidencias limita la defendibilidad del informe. La prioridad es reforzar el soporte documental.'
    };
  }

  if (pending > 0) {
    return {
      signal: 'Review pending',
      boardDecision: 'Proceed with validation',
      tone: 'watch',
      executiveLabel: 'Human review required',
      nextStep:
        'Cerrar revisiones humanas pendientes y dejar trazabilidad antes de elevar el informe a comité.',
      memo:
        'Existe base documental, pero quedan revisiones pendientes. El informe debe circular como borrador ejecutivo hasta cerrar la validación humana.'
    };
  }

  if (isMediumRisk || resilience < 60) {
    return {
      signal: 'Monitor & validate',
      boardDecision: 'Proceed with controls',
      tone: 'watch',
      executiveLabel: 'Controlled with follow-up',
      nextStep:
        'Completar evidencias pendientes, validar alertas abiertas y mantener seguimiento operativo.',
      memo:
        'El proveedor no requiere bloqueo inmediato, pero sí seguimiento reforzado y controles periódicos para mantener una postura defendible.'
    };
  }

  return {
    signal: 'Controlled',
    boardDecision: 'Controlled reporting posture',
    tone: 'positive',
    executiveLabel: 'Report-ready',
    nextStep:
      'Mantener trazabilidad, revisar cambios relevantes y actualizar scoring ante nuevas evidencias.',
    memo:
      'El proveedor muestra una postura razonablemente controlada para reporte ejecutivo, manteniendo revisión humana y soporte documental antes de decisiones formales.'
  };
}

function buildRecommendations(recommendations = []) {
  if (!Array.isArray(recommendations) || recommendations.length === 0) {
    return `
      <li>Revisar evidencias disponibles y completar documentación pendiente.</li>
      <li>Mantener trazabilidad de decisiones humanas y cambios de estado.</li>
      <li>Actualizar scoring cuando existan nuevas alertas o evidencias.</li>
      <li>Validar conclusiones con el responsable interno antes de circular el informe.</li>
    `;
  }

  return recommendations.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
}

function getItemType(item = {}) {
  const raw = String(item.type || item.category || '').toLowerCase();

  if (raw.includes('alert')) return 'Alert';
  if (raw.includes('evidence') || raw.includes('evidencia')) return 'Evidence';
  if (raw.includes('review') || raw.includes('revisión')) return 'Review';

  return item.type || 'Item';
}

function countItemsByType(items = [], type) {
  if (!Array.isArray(items)) return 0;

  return items.filter((item) => getItemType(item).toLowerCase() === type.toLowerCase()).length;
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
    .slice(0, 12)
    .map((item) => {
      const itemType = getItemType(item);

      return `
        <div class="item-card avoid-break">
          <div class="item-top">
            <span class="item-type">${escapeHtml(itemType)}</span>
            <span class="item-status">${escapeHtml(item.status || 'N/A')}</span>
          </div>

          <div class="item-title">${escapeHtml(item.title || 'Sin título')}</div>

          <div class="item-date">${escapeHtml(formatDate(item.date || item.createdAt))}</div>

          <div class="item-desc">
            ${escapeHtml(item.description || item.summary || 'Sin descripción')}
          </div>
        </div>
      `;
    })
    .join('');
}

function buildRedFlags({
  riskScore,
  riskLevel,
  totalEvidence,
  pendingReviews,
  totalItems,
  criticality,
  supplierCountry
}) {
  const risk = toNumber(riskScore, 0);
  const evidence = toNumber(totalEvidence, 0);
  const pending = toNumber(pendingReviews, 0);
  const items = toNumber(totalItems, 0);
  const riskText = normalizeRiskText(riskLevel);
  const criticalityText = normalizeRiskText(criticality);

  const flags = [];

  if (
    risk >= 70 ||
    riskText.includes('alto') ||
    riskText.includes('high') ||
    riskText.includes('critical') ||
    riskText.includes('crítico')
  ) {
    flags.push({
      title: 'High-risk supplier exposure',
      tone: 'danger',
      text:
        'El proveedor supera el umbral de riesgo alto. Requiere revisión prioritaria, mitigantes y validación antes de circular conclusiones.'
    });
  }

  if (evidence === 0) {
    flags.push({
      title: 'Evidence gap',
      tone: 'watch',
      text:
        'No existen evidencias suficientes asociadas al informe. La defendibilidad documental es limitada.'
    });
  }

  if (pending > 0) {
    flags.push({
      title: 'Human review pending',
      tone: 'watch',
      text:
        'Existen revisiones pendientes. El informe debe mantenerse como borrador ejecutivo hasta cerrar trazabilidad humana.'
    });
  }

  if (items === 0) {
    flags.push({
      title: 'No linked report items',
      tone: 'watch',
      text:
        'No hay alertas, evidencias o revisiones vinculadas. Conviene enriquecer el expediente antes de elevarlo a comité.'
    });
  }

  if (criticalityText.includes('alta') || criticalityText.includes('crítica') || criticalityText.includes('critical')) {
    flags.push({
      title: 'Critical supplier dependency',
      tone: 'danger',
      text:
        'La criticidad del proveedor exige plan de continuidad, alternativa operativa y seguimiento reforzado.'
    });
  }

  if (!supplierCountry || supplierCountry === 'N/A' || supplierCountry === 'Sin país') {
    flags.push({
      title: 'Jurisdiction not classified',
      tone: 'watch',
      text:
        'El país o jurisdicción del proveedor no está correctamente clasificado. Esto limita la lectura multinacional.'
    });
  }

  if (flags.length === 0) {
    flags.push({
      title: 'No critical red flags detected',
      tone: 'positive',
      text:
        'No se detectan señales críticas inmediatas con la información disponible. Mantener controles periódicos.'
    });
  }

  return flags;
}

function buildRedFlagCards(flags = []) {
  return flags
    .map(
      (flag) => `
        <div class="red-flag-card ${escapeHtml(flag.tone)} avoid-break">
          <div class="red-flag-dot"></div>
          <div>
            <div class="red-flag-title">${escapeHtml(flag.title)}</div>
            <p>${escapeHtml(flag.text)}</p>
          </div>
        </div>
      `
    )
    .join('');
}

function buildPreparedRows(rows = []) {
  return rows
    .map(
      ([label, value]) => `
        <div class="prepared-item">
          <div class="prepared-label">${escapeHtml(label)}</div>
          <div class="prepared-value">${escapeHtml(value)}</div>
        </div>
      `
    )
    .join('');
}

function buildBoardRows(rows = []) {
  return rows
    .map(
      ([label, value]) => `
        <div class="summary-card">
          <div class="summary-label">${escapeHtml(label)}</div>
          <div class="summary-value">${escapeHtml(value)}</div>
        </div>
      `
    )
    .join('');
}

export function buildComplianceReportBoardRows(report = {}) {
  const riskScore = formatScore(report.riskScore);
  const resilienceScore = formatScore(report.resilienceScore);
  const riskLevel = report.riskLevel || 'N/A';
  const resilienceLevel = report.resilienceLevel || 'N/A';
  const evidenceSummary = report.evidenceSummary || {};
  const coverageLabel =
    evidenceSummary.coverageLabel || evidenceSummary.coverage || 'N/A';
  const decision = buildDecisionSignal({
    riskScore: report.riskScore,
    resilienceScore: report.resilienceScore,
    riskLevel,
    totalEvidence:
      evidenceSummary.totalEvidence ?? evidenceSummary.total ?? 'N/A',
    pendingReviews:
      evidenceSummary.pendingReviews ?? evidenceSummary.pending ?? 'N/A'
  });

  const boardRows = [
    ['Risk Score', riskScore],
    ['Risk Level', riskLevel],
    ['Resilience', resilienceScore],
    ['Resilience Level', resilienceLevel],
    ['Evidence Coverage', coverageLabel],
    ['Board Decision', decision.boardDecision]
  ];

  const weightedNumeric = normalizeWeightedRiskScoreForReport(
    report.weightedRiskScore
  );

  if (weightedNumeric !== null) {
    boardRows.splice(1, 0, [
      WEIGHTED_RISK_LABEL,
      formatScore(weightedNumeric)
    ]);
  }

  return boardRows;
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
      supplierCountry: payload.supplierCountry || payload.country || '',
      supplierRegion: payload.supplierRegion || payload.region || '',
      supplierTier: payload.supplierTier || payload.tier || '',
      supplierCriticality: payload.supplierCriticality || payload.criticality || '',
      supplierSpend: payload.supplierSpend || payload.spend || 0,
      scope: payload.scope || 'supplier',
      status: payload.status || 'generated',
      riskScore: payload.riskScore ?? null,
      resilienceScore: payload.resilienceScore ?? null,
      ...(normalizeWeightedRiskScoreForReport(payload.weightedRiskScore) !== null
        ? {
            weightedRiskScore: normalizeWeightedRiskScoreForReport(
              payload.weightedRiskScore
            )
          }
        : {}),
      riskLevel: payload.riskLevel || '',
      resilienceLevel: payload.resilienceLevel || '',
      summary: payload.summary || '',
      recommendations: payload.recommendations || [],
      evidenceSummary: payload.evidenceSummary || null,
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
    weightedRiskScore,
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

    const resolvedWeighted =
      normalizeWeightedRiskScoreForReport(weightedRiskScore) ??
      resolveWeightedRiskScoreForSupplier(supplier);

    const report = {
      id: createId('report'),
      title: `Compliance Board Pack · ${supplier.name}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      supplierCountry: supplier.country || supplier.jurisdiction || '',
      supplierRegion: supplier.region || '',
      supplierTier: supplier.tier || '',
      supplierCriticality: supplier.criticality || '',
      supplierSpend: supplier.spend || supplier.annualSpend || 0,
      scope: 'Third-party supplier compliance',
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
              'Actualizar scoring cuando existan nuevas alertas o evidencias.',
              'Validar conclusiones con responsable interno antes de circulación externa.'
            ],
      evidenceSummary: evidenceSummary || null,
      items: reportItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (resolvedWeighted !== null) {
      report.weightedRiskScore = resolvedWeighted;
    }

    return report;
  },

  exportReport(report) {
    if (typeof window === 'undefined' || !report) return false;

    const reportDate = formatDate(report.createdAt || new Date().toISOString());
    const supplierName = report.supplierName || 'Sin proveedor';
    const reportId = buildReportId(supplierName);

    const supplierCountry = report.supplierCountry || report.country || 'Sin país';
    const supplierRegion = report.supplierRegion || report.region || 'Sin región';
    const supplierTier = report.supplierTier || report.tier || 'Tier N/A';
    const supplierCriticality =
      report.supplierCriticality || report.criticality || 'N/A';
    const supplierSpend = formatMoney(report.supplierSpend || report.spend || 0);

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

    const safeItems = Array.isArray(report.items) ? report.items : [];
    const totalItems = safeItems.length;
    const alertItems = countItemsByType(safeItems, 'Alert');
    const evidenceItems = countItemsByType(safeItems, 'Evidence');
    const reviewItems = countItemsByType(safeItems, 'Review');

    const decision = buildDecisionSignal({
      riskScore: report.riskScore,
      resilienceScore: report.resilienceScore,
      riskLevel,
      totalEvidence,
      pendingReviews
    });

    const redFlags = buildRedFlags({
      riskScore: report.riskScore,
      riskLevel,
      totalEvidence,
      pendingReviews,
      totalItems,
      criticality: supplierCriticality,
      supplierCountry
    });

    const jurisdictionRows = [
      ['Supplier', supplierName],
      ['Country / Jurisdiction', supplierCountry],
      ['Region', supplierRegion],
      ['Tier', supplierTier],
      ['Criticality', supplierCriticality],
      ['Annual Spend', supplierSpend]
    ];

    const boardRows = buildComplianceReportBoardRows({
      ...report,
      riskScore: report.riskScore,
      resilienceScore: report.resilienceScore,
      riskLevel,
      resilienceLevel,
      evidenceSummary
    });

    const evidenceRows = [
      ['Linked Items', totalItems],
      ['Alerts', alertItems],
      ['Evidence', evidenceItems],
      ['Human Reviews', reviewItems],
      ['Pending Reviews', pendingReviews],
      ['Coverage', coverageLabel]
    ];

    const html = `
      <html>
        <head>
          <title>CEO's OS - Compliance Board Pack - ${escapeHtml(supplierName)}</title>

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
              background: linear-gradient(90deg, #020617, #2563eb, #10b981, #f59e0b);
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
            .notice,
            .red-flag-card {
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
              background: linear-gradient(135deg, #020617, #2563eb);
              color: #ffffff;
              font-weight: 950;
              font-size: 13px;
              box-shadow: 0 10px 20px rgba(37, 99, 235, 0.22);
            }

            .brand {
              font-size: 24px;
              font-weight: 950;
              letter-spacing: -0.05em;
              color: #020617;
            }

            .brand span {
              color: #2563eb;
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
              background: #eff6ff;
              color: #1d4ed8;
              border: 1px solid #bfdbfe;
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
              background: #2563eb;
              box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
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
              background: linear-gradient(180deg, #2563eb, #10b981);
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
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 8px;
              margin: 12px 0 14px;
            }

            .board-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr) !important;
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
                linear-gradient(135deg, rgba(248, 250, 252, 0.95), rgba(239, 246, 255, 0.76));
              border: 1px solid #dbeafe;
            }

            .executive-summary p {
              margin: 0;
            }

            .hero {
              background:
                radial-gradient(circle at 20% 20%, rgba(37, 99, 235, 0.22), transparent 28%),
                linear-gradient(135deg, #020617, #111827 48%, #1e3a8a);
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
              background: linear-gradient(135deg, #020617, #111827);
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

            .red-flag-list {
              display: grid;
              gap: 9px;
            }

            .red-flag-card {
              display: grid;
              grid-template-columns: 12px minmax(0, 1fr);
              gap: 10px;
              padding: 12px;
              border-radius: 15px;
              border: 1px solid #e2e8f0;
              background: #f8fafc;
            }

            .red-flag-card p {
              margin: 4px 0 0;
              font-size: 10.5px;
            }

            .red-flag-dot {
              width: 10px;
              height: 10px;
              border-radius: 999px;
              margin-top: 2px;
              background: #2563eb;
            }

            .red-flag-title {
              font-size: 11px;
              font-weight: 950;
              color: #020617;
            }

            .red-flag-card.danger {
              border-color: #fecaca;
              background: #fef2f2;
            }

            .red-flag-card.danger .red-flag-dot {
              background: #ef4444;
            }

            .red-flag-card.watch {
              border-color: #fde68a;
              background: #fffbeb;
            }

            .red-flag-card.watch .red-flag-dot {
              background: #f59e0b;
            }

            .red-flag-card.positive {
              border-color: #bbf7d0;
              background: #f0fdf4;
            }

            .red-flag-card.positive .red-flag-dot {
              background: #10b981;
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
              color: #1d4ed8;
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
                linear-gradient(135deg, #020617, #111827 55%, #1e3a8a);
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
              .summary-grid,
              .decision-grid,
              .board-grid {
                grid-template-columns: repeat(3, 1fr) !important;
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
                        <div class="subline">Multinational Third-Party Compliance Board Pack</div>
                      </div>
                    </div>
                  </div>

                  <div class="meta">
                    <strong>Strictly Confidential</strong><br/>
                    ${escapeHtml(reportDate)}<br/>
                    Compliance Workspace
                  </div>
                </div>

                <div class="module-badge">Compliance Board Pack</div>

                <h1>${escapeHtml(report.title || 'Compliance Board Pack')}</h1>

                <div class="deal-meta avoid-break">
                  <span class="deal-pill">Supplier: ${escapeHtml(supplierName)}</span>
                  <span class="deal-pill">Jurisdiction: ${escapeHtml(supplierCountry)}</span>
                  <span class="deal-pill">Scope: ${escapeHtml(report.scope || 'supplier')}</span>
                  <span class="deal-pill">Risk: ${escapeHtml(riskLevel)}</span>
                </div>

                <div class="prepared-panel avoid-break">
                  <div class="prepared-item">
                    <div class="prepared-label">Prepared for</div>
                    <div class="prepared-value">Board / Compliance Committee</div>
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
                  <div class="hero-title">Third-Party Risk Signal</div>
                  <div class="hero-value">${escapeHtml(riskScore)}</div>
                  <div class="hero-caption">
                    ${escapeHtml(decision.executiveLabel)} · ${escapeHtml(decision.boardDecision)}
                  </div>
                </div>

                <div class="board-grid avoid-break">
                  ${buildBoardRows(boardRows)}
                </div>

                <div class="decision-panel">
                  <h3>Executive Decision Memo</h3>

                  <div class="decision-grid">
                    <div class="decision-item">
                      <div class="decision-label">Signal</div>
                      <div class="decision-value signal-${escapeHtml(decision.tone)}">
                        ${escapeHtml(decision.signal)}
                      </div>
                    </div>

                    <div class="decision-item">
                      <div class="decision-label">Board posture</div>
                      <div class="decision-value">${escapeHtml(decision.boardDecision)}</div>
                    </div>

                    <div class="decision-item">
                      <div class="decision-label">Next step</div>
                      <div class="decision-value">Human Review</div>
                    </div>
                  </div>

                  <p>${escapeHtml(decision.memo)}</p>
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
                  <h2>Jurisdiction & Supplier Exposure</h2>

                  <div class="prepared-panel avoid-break">
                    ${buildPreparedRows(jurisdictionRows)}
                  </div>
                </div>

                <div class="section">
                  <h2>Evidence Pack</h2>

                  <div class="board-grid">
                    ${buildBoardRows(evidenceRows)}
                  </div>
                </div>

                <div class="section">
                  <h2>Red Flags & Mitigants</h2>

                  <div class="red-flag-list">
                    ${buildRedFlagCards(redFlags)}
                  </div>
                </div>

                <div class="section">
                  <h2>Executive Recommendations</h2>

                  <div class="panel">
                    <ul>
                      ${buildRecommendations(report.recommendations)}
                    </ul>
                  </div>
                </div>
              </div>

              <div class="report-footer">
                <span><strong>CEO's OS</strong> · Jurisdiction Exposure, Evidence Pack & Mitigants</span>
                <span>Page 2 of 3 · ${escapeHtml(reportId)}</span>
              </div>
            </section>

            <section class="report-page last">
              <div class="page-body">
                <div class="section">
                  <h2>Alerts, Evidence & Human Review Trail</h2>

                  <div class="items-grid">
                    ${buildItemsCards(safeItems)}
                  </div>
                </div>

                <div class="section">
                  <h2>Review Checklist</h2>

                  <div class="summary-grid">
                    <div class="summary-card">
                      <div class="summary-label">Human Review</div>
                      <div class="summary-value">Required before formal reliance</div>
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

                    <div class="summary-card">
                      <div class="summary-label">Jurisdiction Check</div>
                      <div class="summary-value">Required for cross-border suppliers</div>
                    </div>

                    <div class="summary-card">
                      <div class="summary-label">Board Circulation</div>
                      <div class="summary-value">${escapeHtml(decision.boardDecision)}</div>
                    </div>
                  </div>
                </div>

                <div class="closing-panel">
                  <h3>Executive closing note</h3>
                  <p>
                    This Compliance Board Pack is designed as an executive third-party risk layer.
                    It structures supplier exposure, jurisdiction context, evidence coverage, red flags,
                    mitigants and human review signals to support defendable decisions.
                  </p>
                </div>

                <div class="notice">
                  <h3>Decision Support System</h3>
                  <p>
                    Este informe funciona como DSS —Decision Support System—.
                    Sirve para priorizar revisión, evidencias y acciones, pero no sustituye
                    revisión humana, legal, contractual, regulatoria o de compliance.
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
