import defaultLogoSrc from '../../../assets/brand/ceos-os-horizontal-color.png?url';
import { BOARD_REVIEW_DRAFT_LABELS, BOARD_REVIEW_DRAFT_LIMITATIONS } from '../utils/reportLabels.js';
import {
  normalizeMissingData,
  safeDate,
  safeList,
  safeText,
  sanitizeSignal
} from '../utils/reportSanitizers.js';

function escapeHtml(value) {
  return safeText(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderList(items, emptyLabel = 'N/A') {
  const list = safeList(items);
  if (list.length === 0) {
    return `<p class="muted">${escapeHtml(emptyLabel)}</p>`;
  }
  return `<ul>${list.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function renderSignals(items) {
  const signals = safeList(items).map(sanitizeSignal);
  if (signals.length === 0) {
    return '<p class="muted">insufficient_data</p>';
  }
  return `
    <table>
      <thead>
        <tr><th>Module</th><th>Signal</th><th>Status</th><th>Score</th><th>Source</th></tr>
      </thead>
      <tbody>
        ${signals.map((signal) => `
          <tr>
            <td>${escapeHtml(signal.module)}</td>
            <td>${escapeHtml(signal.label)}</td>
            <td>${escapeHtml(signal.status)}</td>
            <td>${escapeHtml(signal.score)}</td>
            <td>${escapeHtml(signal.sourceLabel)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderAuditMetadata(metadata) {
  const safeMetadata = metadata && typeof metadata === 'object' ? metadata : {};
  const entries = Object.entries(safeMetadata);
  if (entries.length === 0) {
    return '<p class="muted">N/A</p>';
  }
  return `
    <dl class="audit-grid">
      ${entries.map(([key, value]) => `
        <div><dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd></div>
      `).join('')}
    </dl>
  `;
}

export function buildBoardReviewDraftHtml({
  title,
  organizationName,
  scopeLabel,
  generatedAt,
  executiveSummary,
  moduleSignals,
  keyRisks,
  missingData,
  reviewQuestions,
  humanReviewChecklist,
  auditMetadata,
  logoSrc
} = {}) {
  const resolvedLogo = logoSrc || defaultLogoSrc;
  const generatedLabel = safeDate(generatedAt || new Date());
  const scope = [organizationName, scopeLabel].map((item) => safeText(item, '')).filter(Boolean).join(' - ');
  const normalizedMissingData = normalizeMissingData(missingData);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title || BOARD_REVIEW_DRAFT_LABELS.status)}</title>
  <style>
    @page { size: A4; margin: 18mm; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #f1f5f9; color: #0f172a; font-family: Arial, Helvetica, sans-serif; line-height: 1.5; }
    .page { width: 210mm; min-height: 297mm; margin: 0 auto; background: #fff; padding: 20mm; }
    .report-header { display: grid; grid-template-columns: minmax(140px, 220px) 1fr; gap: 20px; align-items: center; border-bottom: 2px solid #172033; padding-bottom: 18px; margin-bottom: 24px; }
    .report-logo img { max-width: 200px; max-height: 52px; object-fit: contain; display: block; }
    .text-mark { font-size: 22px; font-weight: 800; }
    .classification { margin: 0 0 4px; color: #64748b; font-size: 12px; font-weight: 800; text-transform: uppercase; }
    h1 { margin: 0; font-size: 28px; line-height: 1.15; }
    h2 { margin: 0 0 12px; font-size: 18px; }
    .badges { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    .badge { border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px 8px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #172033; background: #f8fafc; }
    .meta { margin: 10px 0 0; color: #475569; font-size: 12px; }
    .section { break-inside: avoid; page-break-inside: avoid; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 16px; background: #fff; }
    .eyebrow { margin: 0 0 6px; color: #64748b; font-size: 11px; font-weight: 800; text-transform: uppercase; }
    .muted { color: #64748b; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { padding: 9px; border-bottom: 1px solid #e2e8f0; text-align: left; vertical-align: top; }
    th { color: #334155; font-size: 11px; text-transform: uppercase; }
    .audit-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
    dt { color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 800; }
    dd { margin: 2px 0 0; }
    footer { margin-top: 28px; padding-top: 16px; border-top: 1px solid #cbd5e1; color: #475569; font-size: 12px; }
    @media print {
      body { background: #fff; }
      .page { width: auto; min-height: auto; margin: 0; padding: 0; }
      .section { break-inside: avoid; page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <main class="page">
    <header class="report-header">
      <div class="report-logo">
        ${resolvedLogo ? `<img src="${escapeHtml(resolvedLogo)}" alt="CEO's OS" />` : '<div class="text-mark">CEO&#39;s OS</div>'}
      </div>
      <div>
        <p class="classification">${BOARD_REVIEW_DRAFT_LABELS.confidential}</p>
        <h1>${escapeHtml(title || BOARD_REVIEW_DRAFT_LABELS.status)}</h1>
        <div class="badges">
          ${BOARD_REVIEW_DRAFT_LIMITATIONS.map((label) => `<span class="badge">${escapeHtml(label)}</span>`).join('')}
        </div>
        <p class="meta">Generated at: ${escapeHtml(generatedLabel)}${scope ? ` - Scope: ${escapeHtml(scope)}` : ''}</p>
      </div>
    </header>

    <section class="section">
      <p class="eyebrow">${BOARD_REVIEW_DRAFT_LABELS.basedOnDss}</p>
      <h2>Executive Summary</h2>
      <p>${escapeHtml(executiveSummary)}</p>
    </section>

    <section class="section">
      <h2>Module Signals</h2>
      ${renderSignals(moduleSignals)}
    </section>

    <section class="section">
      <h2>Key Risks</h2>
      ${renderList(keyRisks, 'N/A')}
    </section>

    <section class="section">
      <h2>Missing / Insufficient Data</h2>
      ${renderList(normalizedMissingData, 'insufficient_data')}
    </section>

    <section class="section">
      <h2>Review Questions</h2>
      ${renderList(reviewQuestions, 'N/A')}
    </section>

    <section class="section">
      <h2>Human Review Checklist</h2>
      ${renderList(humanReviewChecklist, BOARD_REVIEW_DRAFT_LABELS.humanReview)}
    </section>

    <section class="section">
      <h2>Audit Metadata</h2>
      ${renderAuditMetadata(auditMetadata)}
    </section>

    <section class="section">
      <h2>Limitations</h2>
      ${renderList(BOARD_REVIEW_DRAFT_LIMITATIONS)}
    </section>

    <footer>
      <strong>${BOARD_REVIEW_DRAFT_LABELS.confidential}</strong> - ${BOARD_REVIEW_DRAFT_LABELS.status} - ${BOARD_REVIEW_DRAFT_LABELS.notLegalAdvice} - ${BOARD_REVIEW_DRAFT_LABELS.notInvestmentAdvice} - ${BOARD_REVIEW_DRAFT_LABELS.notBoardApproved}. Generated by CEO's OS. Human review required before circulation.
    </footer>
  </main>
</body>
</html>`;
}
