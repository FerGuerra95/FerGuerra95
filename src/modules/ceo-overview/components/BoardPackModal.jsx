import React from 'react';
import { Printer, X } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { BrandLogo } from '../../../shared/components/brand/BrandLogo.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import {
  BOARD_PACK_PRINT_DRAFT_HINT,
  BRIEFING_PACK_STATUS_ONLY_NOTE
} from '../utils/ceoOverviewTruthfulness.js';

export const BOARD_PACK_PRINT_ROOT_CLASS = 'board-pack-print-root';
export const BOARD_PACK_NO_PRINT_CLASS = 'board-pack-no-print';
export const BOARD_PACK_PRINTING_BODY_CLASS = 'printing-board-pack';
export const BOARD_PACK_PRINT_BUTTON_LABEL = 'Print draft preview';
export const BOARD_PACK_PRINT_DRAFT_BANNER =
  'Board review draft · Decision support only · Human review required · Not board-approved';
export const BOARD_PACK_PREMIUM_TITLE = 'BOARD REVIEW DRAFT';
export const BOARD_PACK_PREMIUM_SUBTITLE = "CEO's OS | Private Executive Intelligence";
export const BOARD_PACK_DRAFT_BADGE = 'DRAFT ONLY';
export const BOARD_PACK_DECISION_SUPPORT_BADGE = 'Decision Support Only';
export const BOARD_PACK_NOT_CERTIFIED_BADGE = 'Not Certified';
export const BOARD_PACK_HUMAN_REVIEW_BADGE = 'Human Review Required';
export const BOARD_PACK_PRINT_CLEAN_OUTPUT_HINT =
  'For clean output, disable browser headers and footers in print settings.';
export const BOARD_PACK_PRINT_DOCUMENT_CLASS = 'board-pack-print-document';
export const BOARD_PACK_PRINT_PAGE_BREAK_CLASS = 'board-pack-print-page-break';
export const BOARD_PACK_CORE_METRICS_TITLE = 'Core Metrics';
export const BOARD_PACK_EXECUTION_METRICS_TITLE = 'Execution Metrics';
export const BOARD_PACK_GOVERNANCE_METRICS_TITLE = 'Governance / Bridge / Heritage';
export const BOARD_PACK_RECOMMENDATIONS_TITLE = 'Board Recommendations';
export const BOARD_PACK_PRINT_HIDDEN_APP_CHROME_MARKERS = [
  'ceos-main-build-strip',
  'ceos-build-strip-tagline',
  'ceos-build-strip-actions',
  'ceos-logout-btn',
  'ceos-topbar-premium'
];
export const BOARD_PACK_EXEC_READINESS_LABEL = 'Executive Readiness Score';
export const BOARD_PACK_GENERATED_UNAVAILABLE = 'Generated timestamp unavailable';
export const BOARD_PACK_EXEC_DISCLAIMER =
  'Draft-only. Subject to human review. Not board-approved.';
export const BOARD_PACK_FOOTER_LEGAL =
  'DRAFT FOR REVIEW PURPOSES ONLY · CONFIDENTIAL · Human review required · Not certified · Not board-approved · Browser-print style draft · Subject to change';

export const BOARD_PACK_RECOMMENDATION_GUARDRAILS = [
  'Confirm owners and timing before external circulation.',
  'Review evidence before board distribution.',
  'Keep draft recommendations under human review.'
];

const branchMeta = [
  { key: 'ma', label: 'M&A', tone: '#34d399' },
  { key: 'compliance', label: 'Compliance', tone: '#60a5fa' },
  { key: 'funding', label: 'Funding', tone: '#fbbf24' },
  { key: 'pmi', label: 'PMI', tone: '#a78bfa' },
  { key: 'bridge', label: 'Bridge', tone: '#2dd4bf' },
  { key: 'governance', label: 'Governance', tone: '#38bdf8' },
  { key: 'heritage', label: 'Heritage', tone: '#d4af37' }
];

function isPresentMetricValue(value) {
  return value !== null && value !== undefined && value !== '';
}

export function formatBoardPackScore100(value) {
  if (!isPresentMetricValue(value)) {
    return 'N/A';
  }
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return 'N/A';
  }
  return `${Math.round(number)}/100`;
}

export function formatBoardPackPercent(value) {
  if (!isPresentMetricValue(value)) {
    return 'N/A';
  }
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return 'N/A';
  }
  return `${Math.round(number)}%`;
}

export function formatBoardPackCount(value) {
  if (!isPresentMetricValue(value)) {
    return 'N/A';
  }
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return 'N/A';
  }
  return String(number);
}

export function formatBoardPackCurrency(value, currency = 'EUR') {
  if (!isPresentMetricValue(value)) {
    return 'N/A';
  }
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return 'N/A';
  }
  return formatCurrency(number, currency);
}

export function formatBoardPackMonths(value) {
  if (!isPresentMetricValue(value)) {
    return 'N/A';
  }
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    return 'N/A';
  }
  return `${number.toFixed(1)} months`;
}

export function softenBoardPackRecommendation(text) {
  if (typeof text !== 'string' || !text.trim()) {
    return text;
  }

  if (/named owners and board-level due dates/i.test(text)) {
    return 'Confirm owners and timing before external circulation.';
  }

  if (/prioritize remediation of critical compliance findings/i.test(text)) {
    return 'Prioritize remediation before external circulation.';
  }

  if (/board approval exceptions/i.test(text)) {
    return 'Resolve Bridge confidentiality review items before external circulation.';
  }

  let result = text;
  result = result.replace(/named owners/gi, 'confirmed owners');
  result = result.replace(/board-level due dates/gi, 'agreed timing before external circulation');
  result = result.replace(
    /assign remediation owners/gi,
    'confirm remediation owners before circulation'
  );
  result = result.replace(/succession owners/gi, 'succession accountability');
  result = result.replace(/\bfinal recommendation\b/gi, 'draft recommendation');
  result = result.replace(/\bfinal report\b/gi, 'draft report');
  result = result.replace(/\bcertified recommendation\b/gi, 'draft recommendation');
  return result;
}

function clampScore100(value) {
  if (!isPresentMetricValue(value)) {
    return null;
  }
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return null;
  }
  return Math.max(0, Math.min(100, Math.round(number)));
}

function hasRadarData(branches = {}) {
  return branchMeta.some((item) => clampScore100(branches[item.key]?.score) !== null);
}

function buildDisplayedRecommendations(recommendations = []) {
  const softened = recommendations
    .map((item) => softenBoardPackRecommendation(item))
    .filter((item) => typeof item === 'string' && item.trim());

  const combined = [...softened, ...BOARD_PACK_RECOMMENDATION_GUARDRAILS];
  return combined.filter((item, index) => combined.indexOf(item) === index);
}

function RadarChart({ branches = {} }) {
  const center = 92;
  const radius = 62;
  const points = branchMeta.map((item, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / branchMeta.length;
    const score = clampScore100(branches[item.key]?.score);
    const value = score === null ? 0 : score / 100;

    return {
      ...item,
      x: center + Math.cos(angle) * radius * value,
      y: center + Math.sin(angle) * radius * value,
      axisX: center + Math.cos(angle) * radius,
      axisY: center + Math.sin(angle) * radius,
      value: score
    };
  });
  const polygon = points.map((point) => `${point.x},${point.y}`).join(' ');

  return (
    <svg className="board-pack-radar" viewBox="0 0 184 184" role="img" aria-label="Board pack branch radar">
      <circle cx={center} cy={center} r={radius} className="board-pack-radar-grid" />
      <circle cx={center} cy={center} r={radius * 0.66} className="board-pack-radar-grid" />
      <circle cx={center} cy={center} r={radius * 0.33} className="board-pack-radar-grid" />
      {points.map((point) => (
        <line
          key={point.key}
          x1={center}
          y1={center}
          x2={point.axisX}
          y2={point.axisY}
          className="board-pack-radar-axis"
        />
      ))}
      <polygon points={polygon} className="board-pack-radar-fill" />
      {points.map((point) => (
        <g key={point.key}>
          <circle cx={point.x} cy={point.y} r="4" fill={point.tone} />
          <text x={point.axisX} y={point.axisY} className="board-pack-radar-label">
            {point.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function PremiumMetricCard({ label, value }) {
  return (
    <article className="board-pack-metric-card">
      <span className="board-pack-metric-label">{label}</span>
      <strong className="board-pack-metric-value">{value}</strong>
    </article>
  );
}

function PremiumPanel({ title, eyebrow, children, className = '' }) {
  return (
    <section className={`board-pack-panel board-pack-section ${className}`.trim()}>
      {eyebrow ? <p className="board-pack-panel-eyebrow">{eyebrow}</p> : null}
      <h3 className="board-pack-panel-title">{title}</h3>
      {children}
    </section>
  );
}

function MetricRow({ label, value }) {
  return (
    <div className="board-pack-inline-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function buildCoreMetrics(branches) {
  return [
    { label: 'M&A Valuation', value: formatBoardPackCurrency(branches.ma?.valuation, 'EUR') },
    { label: 'Applied Multiple', value: branches.ma?.multipleLabel || 'N/A' },
    {
      label: 'Compliance Health',
      value: formatBoardPackScore100(branches.compliance?.healthScore)
    },
    {
      label: 'Critical Findings',
      value: formatBoardPackCount(branches.compliance?.criticalFindings)
    },
    { label: 'Runway', value: formatBoardPackMonths(branches.funding?.runwayMonths) },
    {
      label: 'Capital Raised',
      value: formatBoardPackCurrency(branches.funding?.capitalRaised, 'EUR')
    }
  ];
}

function buildExecutionMetrics(branches) {
  return [
    {
      label: 'PMI Completion',
      value: formatBoardPackPercent(branches.pmi?.integrationProgress)
    },
    {
      label: 'Synergy Capture',
      value: formatBoardPackPercent(branches.pmi?.synergyCaptureRate)
    },
    {
      label: 'Ledger Capture',
      value: formatBoardPackPercent(branches.pmi?.ledgerCaptureRate)
    },
    {
      label: 'Playbook Progress',
      value: formatBoardPackPercent(branches.pmi?.playbookProgress)
    },
    {
      label: 'Blocked Dependencies',
      value: formatBoardPackCount(branches.pmi?.blockedDependenciesCount)
    }
  ];
}

function buildGovernanceBridgeHeritageMetrics(branches) {
  return [
    {
      label: 'Bridge Weighted Pipeline',
      value: formatBoardPackCurrency(branches.bridge?.weightedPipelineValue, 'EUR')
    },
    { label: 'Bridge Intros', value: formatBoardPackCount(branches.bridge?.introductionsCount) },
    {
      label: 'Bridge Confidentiality',
      value: formatBoardPackCount(branches.bridge?.confidentialityExceptionsCount)
    },
    { label: 'Bridge Documents', value: formatBoardPackCount(branches.bridge?.documentsCount) },
    { label: 'Bridge Reports', value: formatBoardPackCount(branches.bridge?.reportsCount) },
    {
      label: 'Governance Controls',
      value: formatBoardPackCount(branches.governance?.controlsCount)
    },
    {
      label: 'Governance Evidence',
      value: formatBoardPackPercent(branches.governance?.evidenceReadiness)
    },
    {
      label: 'Open Board Decisions',
      value: formatBoardPackCount(branches.governance?.openDecisionsCount)
    },
    {
      label: 'Board Readiness',
      value: formatBoardPackPercent(branches.governance?.boardReadinessScore)
    },
    {
      label: 'Heritage Mapped Value',
      value: formatBoardPackCurrency(branches.heritage?.totalAssetValue, 'EUR')
    },
    {
      label: 'Heritage Succession',
      value: formatBoardPackPercent(branches.heritage?.successionReadiness)
    },
    {
      label: 'Heritage Protection',
      value: formatBoardPackPercent(branches.heritage?.protectionCoverage)
    },
    {
      label: 'Heritage Documents',
      value: formatBoardPackCount(branches.heritage?.documentsCount)
    },
    { label: 'Heritage Reports', value: formatBoardPackCount(branches.heritage?.reportsCount) }
  ];
}

export function runBoardPackPrintPreview() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  const body = document.body;
  if (!body) {
    return;
  }

  const cleanup = () => {
    body.classList.remove(BOARD_PACK_PRINTING_BODY_CLASS);
  };

  body.classList.add(BOARD_PACK_PRINTING_BODY_CLASS);
  window.addEventListener('afterprint', cleanup, { once: true });
  window.setTimeout(cleanup, 1500);

  try {
    window.print();
  } catch {
    cleanup();
  }
}

export function BoardPackModal({ boardPack, loading = false, error = null, onClose }) {
  if (!boardPack && !loading && !error) return null;

  const branches = boardPack?.branches || {};
  const generatedAt = boardPack?.generatedAt
    ? new Date(boardPack.generatedAt).toLocaleString('en-GB')
    : '';
  const displayedRecommendations = buildDisplayedRecommendations(boardPack?.recommendations || []);
  const showRadar = hasRadarData(branches);

  return (
    <div className="board-pack-backdrop" role="presentation">
      <style>{`
        .board-pack-backdrop {
          position: fixed;
          inset: 0;
          z-index: 80;
          display: grid;
          place-items: center;
          padding: 24px;
          background: rgba(5, 5, 4, 0.88);
          backdrop-filter: blur(18px);
        }

        .board-pack-modal {
          position: relative;
          width: min(1080px, 100%);
          max-height: min(900px, calc(100vh - 48px));
          overflow: auto;
          border-radius: 28px;
          border: 1px solid rgba(214, 168, 74, 0.45);
          background:
            radial-gradient(ellipse 80% 60% at 18% 0%, rgba(240, 201, 106, 0.12), transparent 58%),
            linear-gradient(180deg, #080807 0%, #050505 100%);
          box-shadow: 0 36px 110px rgba(0, 0, 0, 0.55);
          padding: 28px;
          color: #f8f4ea;
        }

        .board-pack-icon-button {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 2;
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          border: 1px solid rgba(214, 168, 74, 0.35);
          background: rgba(8, 8, 7, 0.82);
          color: rgba(248, 244, 234, 0.94);
          cursor: pointer;
        }

        .board-pack-premium-header {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: 20px;
          align-items: center;
          padding: 18px 52px 18px 18px;
          border-radius: 22px;
          border: 1px solid rgba(214, 168, 74, 0.45);
          background:
            radial-gradient(circle at 12% 18%, rgba(240, 201, 106, 0.14), transparent 42%),
            linear-gradient(135deg, rgba(17, 16, 13, 0.96), rgba(5, 5, 5, 0.98));
        }

        .board-pack-brand-wrap {
          width: 72px;
          height: 72px;
          display: grid;
          place-items: center;
          border-radius: 18px;
          border: 1px solid rgba(214, 168, 74, 0.35);
          background: rgba(8, 8, 7, 0.9);
        }

        .board-pack-premium-title {
          margin: 0;
          font-size: clamp(1.35rem, 2.4vw, 1.85rem);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #f0c96a;
          font-weight: 850;
        }

        .board-pack-premium-subtitle {
          margin: 6px 0 0;
          color: rgba(248, 244, 234, 0.72);
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .board-pack-premium-meta {
          margin: 10px 0 0;
          color: rgba(248, 244, 234, 0.58);
          font-size: 12px;
        }

        .board-pack-badge-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .board-pack-badge {
          display: inline-flex;
          align-items: center;
          padding: 5px 10px;
          border-radius: 999px;
          border: 1px solid rgba(214, 168, 74, 0.42);
          background: rgba(155, 107, 31, 0.18);
          color: #f0c96a;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .board-pack-print-only-banner {
          display: none;
        }

        .board-pack-print-document {
          display: grid;
          gap: 20px;
        }

        .board-pack-print-page {
          display: grid;
          gap: 20px;
        }

        .board-pack-print-bottom-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .board-pack-exec-panel {
          margin-top: 20px;
          display: grid;
          grid-template-columns: minmax(160px, 0.32fr) minmax(0, 1fr);
          gap: 18px;
          padding: 20px;
          border-radius: 22px;
          border: 1px solid rgba(214, 168, 74, 0.38);
          background:
            radial-gradient(circle at 80% 0%, rgba(240, 201, 106, 0.1), transparent 48%),
            linear-gradient(155deg, #11100d 0%, #080807 100%);
        }

        .board-pack-exec-score-label,
        .board-pack-metric-label,
        .board-pack-panel-eyebrow,
        .board-pack-inline-metric span {
          color: rgba(240, 201, 106, 0.82);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 850;
        }

        .board-pack-exec-score-value {
          display: block;
          margin-top: 10px;
          font-size: 40px;
          letter-spacing: -0.05em;
          color: #fff8eb;
        }

        .board-pack-exec-summary {
          margin: 0;
          color: rgba(248, 244, 234, 0.84);
          line-height: 1.65;
        }

        .board-pack-exec-disclaimer {
          margin: 12px 0 0;
          color: rgba(240, 201, 106, 0.78);
          font-size: 12px;
          line-height: 1.55;
        }

        .board-pack-metrics-group {
          margin-top: 20px;
        }

        .board-pack-metrics-group-title {
          margin: 0 0 12px;
          color: #f0c96a;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-weight: 850;
        }

        .board-pack-metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .board-pack-metric-card {
          display: grid;
          gap: 8px;
          padding: 14px;
          border-radius: 18px;
          border: 1px solid rgba(214, 168, 74, 0.32);
          background:
            radial-gradient(circle at 18% 0%, rgba(240, 201, 106, 0.08), transparent 52%),
            linear-gradient(160deg, #0e0d0b 0%, #050505 100%);
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .board-pack-metric-value {
          font-size: 17px;
          color: #fff8eb;
          overflow-wrap: anywhere;
        }

        .board-pack-columns {
          margin-top: 20px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .board-pack-panel {
          border-radius: 22px;
          border: 1px solid rgba(214, 168, 74, 0.32);
          background:
            radial-gradient(circle at 12% 0%, rgba(240, 201, 106, 0.08), transparent 50%),
            linear-gradient(160deg, #0e0d0b 0%, #050505 100%);
          padding: 18px;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .board-pack-panel-title {
          margin: 0 0 14px;
          color: #f0c96a;
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .board-pack-panel-eyebrow {
          margin: 0 0 6px;
        }

        .board-pack-inline-metric {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 0;
          border-top: 1px solid rgba(214, 168, 74, 0.16);
        }

        .board-pack-inline-metric strong {
          color: #fff8eb;
          text-align: right;
        }

        .board-pack-radar {
          width: min(280px, 100%);
          display: block;
          margin: 0 auto;
        }

        .board-pack-radar-grid,
        .board-pack-radar-axis {
          fill: none;
          stroke: rgba(214, 168, 74, 0.28);
        }

        .board-pack-radar-fill {
          fill: rgba(240, 201, 106, 0.16);
          stroke: rgba(240, 201, 106, 0.82);
          stroke-width: 2;
        }

        .board-pack-radar-label {
          fill: rgba(248, 244, 234, 0.82);
          font-size: 8px;
          text-anchor: middle;
        }

        .board-pack-recommendations {
          display: grid;
          gap: 10px;
        }

        .board-pack-recommendations p {
          margin: 0;
          color: rgba(248, 244, 234, 0.84);
          line-height: 1.62;
        }

        .board-pack-premium-footer {
          margin-top: 22px;
          padding: 16px 18px;
          border-radius: 18px;
          border: 1px solid rgba(214, 168, 74, 0.28);
          background: rgba(8, 8, 7, 0.92);
          color: rgba(240, 201, 106, 0.82);
          font-size: 11px;
          line-height: 1.6;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .board-pack-empty {
          margin-top: 24px;
          padding: 28px;
          border-radius: 20px;
          border: 1px solid rgba(214, 168, 74, 0.24);
          background: rgba(8, 8, 7, 0.88);
          color: rgba(248, 244, 234, 0.86);
        }

        .board-pack-footer {
          margin-top: 22px;
          padding-top: 18px;
          border-top: 1px solid rgba(214, 168, 74, 0.2);
        }

        .board-pack-footer-actions {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: flex-end;
        }

        .board-pack-print-action {
          display: grid;
          gap: 6px;
          justify-items: end;
        }

        .board-pack-print-hint {
          margin: 0;
          font-size: 11px;
          color: rgba(248, 244, 234, 0.62);
        }

        @media (max-width: 900px) {
          .board-pack-metrics-grid,
          .board-pack-columns,
          .board-pack-exec-panel,
          .board-pack-print-bottom-grid {
            grid-template-columns: 1fr;
          }

          .board-pack-premium-header {
            grid-template-columns: 1fr;
          }
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }

          html,
          body.${BOARD_PACK_PRINTING_BODY_CLASS} {
            background: #050505 !important;
            height: auto !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .app-shell > .sidebar,
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .app-shell > .ceos-sidebar,
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .main-area > .topbar,
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .main-area > .ceos-main-build-strip,
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .ceos-build-strip-copy,
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .ceos-build-strip-tagline,
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .ceos-build-strip-actions,
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .ceos-build-strip-badge,
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .ceos-build-strip-user,
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .ceos-logout-btn,
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .ceos-topbar-premium,
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .ceos-topbar-shell,
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .page > *:not(.board-pack-backdrop),
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .sidebar,
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .ceos-sidebar,
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .topbar,
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .${BOARD_PACK_NO_PRINT_CLASS},
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-footer,
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-icon-button,
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-print-action,
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-screen-only {
            display: none !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-backdrop {
            position: static !important;
            inset: auto !important;
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
            background: #050505 !important;
            backdrop-filter: none !important;
            visibility: visible !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .${BOARD_PACK_PRINT_ROOT_CLASS} {
            position: static !important;
            left: auto !important;
            top: auto !important;
            display: block !important;
            visibility: visible !important;
            width: 100% !important;
            max-height: none !important;
            overflow: visible !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            padding: 0 !important;
            background: #050505 !important;
            color: #f8f3e7 !important;
            font-size: 11px;
            line-height: 1.45;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .${BOARD_PACK_PRINT_DOCUMENT_CLASS} {
            border: 1px solid rgba(214, 168, 74, 0.45) !important;
            border-radius: 10px;
            padding: 5mm;
            background:
              radial-gradient(ellipse 80% 50% at 12% 0%, rgba(240, 201, 106, 0.1), transparent 55%),
              #050505 !important;
            gap: 0 !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-print-page {
            gap: 9px !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-print-page-1 {
            gap: 7px !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-print-page-2 {
            display: flex !important;
            flex-direction: column !important;
            gap: 9px !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .${BOARD_PACK_PRINT_PAGE_BREAK_CLASS} {
            page-break-before: always !important;
            break-before: page !important;
            margin-top: 0 !important;
            padding-top: 2px !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-print-page-2 .board-pack-premium-footer {
            margin-top: auto !important;
            padding-top: 10px !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-print-page-1 .board-pack-metrics-group:last-of-type .board-pack-metrics-grid {
            grid-template-columns: repeat(5, minmax(0, 1fr)) !important;
            gap: 5px !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-print-only-banner {
            display: block !important;
            margin: 0 0 8px;
            padding: 6px 10px;
            border: 1px solid rgba(214, 168, 74, 0.45);
            border-radius: 6px;
            background: #11100d !important;
            color: #f0c96a !important;
            font-size: 8px;
            line-height: 1.4;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 700;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-premium-header {
            padding: 9px 10px !important;
            gap: 10px !important;
            border-radius: 8px !important;
            border: 1px solid rgba(214, 168, 74, 0.45) !important;
            background:
              radial-gradient(circle at 12% 18%, rgba(240, 201, 106, 0.12), transparent 42%),
              #080807 !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-brand-wrap {
            width: 48px !important;
            height: 48px !important;
            border-radius: 8px !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-premium-title {
            font-size: 15px !important;
            letter-spacing: 0.1em !important;
            color: #f0c96a !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-premium-subtitle,
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-premium-meta {
            font-size: 8px !important;
            color: #c7bda7 !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-badge-row {
            margin-top: 5px !important;
            gap: 4px !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-badge {
            padding: 3px 7px !important;
            font-size: 7.5px !important;
            border: 1px solid rgba(214, 168, 74, 0.42) !important;
            background: rgba(255, 255, 255, 0.04) !important;
            color: #f0c96a !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-exec-panel {
            margin-top: 0 !important;
            grid-template-columns: 104px minmax(0, 1fr) !important;
            gap: 10px !important;
            padding: 10px !important;
            border-radius: 8px !important;
            border: 1px solid rgba(214, 168, 74, 0.38) !important;
            background: rgba(255, 255, 255, 0.04) !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-exec-score-label,
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-metric-label,
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-panel-eyebrow,
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-inline-metric span,
          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-metrics-group-title {
            font-size: 8px !important;
            color: #d6a84a !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-exec-score-value {
            font-size: 26px !important;
            margin-top: 4px !important;
            color: #f8f3e7 !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-exec-summary {
            font-size: 9.5px !important;
            line-height: 1.5 !important;
            color: #f8f3e7 !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-exec-disclaimer {
            margin-top: 6px !important;
            font-size: 8px !important;
            color: #c7bda7 !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-metrics-group {
            margin-top: 0 !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-metrics-group-title {
            margin-bottom: 6px !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-metrics-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 6px !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-print-page-1 .board-pack-metrics-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-metric-card {
            padding: 6px 7px !important;
            border-radius: 7px !important;
            gap: 4px !important;
            border: 1px solid rgba(214, 168, 74, 0.35) !important;
            background: rgba(255, 255, 255, 0.04) !important;
            break-inside: auto !important;
            page-break-inside: auto !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-metric-value {
            font-size: 11px !important;
            color: #f8f3e7 !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-print-bottom-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 8px !important;
            flex: 1 1 auto !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-panel {
            padding: 8px 9px !important;
            border-radius: 8px !important;
            border: 1px solid rgba(214, 168, 74, 0.35) !important;
            background: rgba(255, 255, 255, 0.04) !important;
            break-inside: auto !important;
            page-break-inside: auto !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-panel-title {
            margin-bottom: 6px !important;
            font-size: 8.5px !important;
            color: #f0c96a !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-inline-metric {
            padding: 4px 0 !important;
            gap: 8px !important;
            border-top-color: rgba(214, 168, 74, 0.2) !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-inline-metric strong {
            font-size: 9.5px !important;
            color: #f8f3e7 !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-print-page-2 .board-pack-panel.board-pack-section {
            flex: 0 0 auto !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-recommendations {
            gap: 6px !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-recommendations p {
            font-size: 9px !important;
            line-height: 1.45 !important;
            color: #f8f3e7 !important;
          }

          body.${BOARD_PACK_PRINTING_BODY_CLASS} .board-pack-premium-footer {
            margin-top: 8px !important;
            padding: 8px 10px !important;
            border-radius: 6px !important;
            font-size: 7.5px !important;
            line-height: 1.5 !important;
            border: 1px solid rgba(214, 168, 74, 0.28) !important;
            background: #080807 !important;
            color: #c7bda7 !important;
          }
        }
      `}</style>
      <div
        className={`board-pack-modal ${BOARD_PACK_PRINT_ROOT_CLASS}`}
        role="dialog"
        aria-modal="true"
        aria-label="Executive Board Pack preview"
      >
        <p className="board-pack-print-only-banner">{BOARD_PACK_PRINT_DRAFT_BANNER}</p>

        <button
          type="button"
          className={`board-pack-icon-button ${BOARD_PACK_NO_PRINT_CLASS}`}
          onClick={onClose}
          aria-label="Close Board Pack"
        >
          <X size={18} />
        </button>

        {loading ? (
          <div className="board-pack-empty">Preparing board review draft.</div>
        ) : error ? (
          <div className="board-pack-empty">{error.message || 'Board review draft could not be prepared.'}</div>
        ) : (
          <div className={BOARD_PACK_PRINT_DOCUMENT_CLASS}>
            <div className="board-pack-print-page board-pack-print-page-1">
              <header className="board-pack-premium-header board-pack-section">
                <div className="board-pack-brand-wrap">
                  <BrandLogo variant="emblem" emblemAsset="lion" size="md" surface="transparent" />
                </div>
                <div>
                  <h2 className="board-pack-premium-title">{BOARD_PACK_PREMIUM_TITLE}</h2>
                  <p className="board-pack-premium-subtitle">{BOARD_PACK_PREMIUM_SUBTITLE}</p>
                  <p className="board-pack-premium-meta">
                    {generatedAt ? `Prepared ${generatedAt}` : BOARD_PACK_GENERATED_UNAVAILABLE}
                  </p>
                  <div className="board-pack-badge-row">
                    <span className="board-pack-badge">{BOARD_PACK_DRAFT_BADGE}</span>
                    <span className="board-pack-badge">{BOARD_PACK_DECISION_SUPPORT_BADGE}</span>
                    <span className="board-pack-badge">{BOARD_PACK_HUMAN_REVIEW_BADGE}</span>
                    <span className="board-pack-badge">{BOARD_PACK_NOT_CERTIFIED_BADGE}</span>
                  </div>
                </div>
              </header>

              <section className="board-pack-exec-panel board-pack-section">
                <div>
                  <span className="board-pack-exec-score-label">{BOARD_PACK_EXEC_READINESS_LABEL}</span>
                  <strong className="board-pack-exec-score-value">
                    {formatBoardPackScore100(boardPack.score)}
                  </strong>
                </div>
                <div>
                  <p className="board-pack-exec-summary">{boardPack.executiveSummary}</p>
                  <p className="board-pack-exec-disclaimer">{BOARD_PACK_EXEC_DISCLAIMER}</p>
                </div>
              </section>

              <section className="board-pack-metrics-group board-pack-section">
                <h3 className="board-pack-metrics-group-title">{BOARD_PACK_CORE_METRICS_TITLE}</h3>
                <div className="board-pack-metrics-grid">
                  {buildCoreMetrics(branches).map((metric) => (
                    <PremiumMetricCard key={metric.label} label={metric.label} value={metric.value} />
                  ))}
                </div>
              </section>

              <section className="board-pack-metrics-group board-pack-section">
                <h3 className="board-pack-metrics-group-title">{BOARD_PACK_EXECUTION_METRICS_TITLE}</h3>
                <div className="board-pack-metrics-grid">
                  {buildExecutionMetrics(branches).map((metric) => (
                    <PremiumMetricCard key={metric.label} label={metric.label} value={metric.value} />
                  ))}
                </div>
              </section>
            </div>

            <div className="board-pack-print-page board-pack-print-page-2">
              <section
                className={`board-pack-metrics-group board-pack-section ${BOARD_PACK_PRINT_PAGE_BREAK_CLASS}`}
              >
                <h3 className="board-pack-metrics-group-title">{BOARD_PACK_GOVERNANCE_METRICS_TITLE}</h3>
                <div className="board-pack-metrics-grid">
                  {buildGovernanceBridgeHeritageMetrics(branches).map((metric) => (
                    <PremiumMetricCard key={metric.label} label={metric.label} value={metric.value} />
                  ))}
                </div>
              </section>

              <div className="board-pack-print-bottom-grid board-pack-section">
                <PremiumPanel title="Readiness & Risk Summary">
                  <MetricRow
                    label="Compliance Health"
                    value={formatBoardPackScore100(branches.compliance?.healthScore)}
                  />
                  <MetricRow
                    label="Critical Findings"
                    value={formatBoardPackCount(branches.compliance?.criticalFindings)}
                  />
                  <MetricRow
                    label="Open Board Decisions"
                    value={formatBoardPackCount(branches.governance?.openDecisionsCount)}
                  />
                  <MetricRow
                    label="Board Readiness"
                    value={formatBoardPackPercent(branches.governance?.boardReadinessScore)}
                  />
                </PremiumPanel>

                <PremiumPanel title="Briefing Pack Status" eyebrow={BRIEFING_PACK_STATUS_ONLY_NOTE}>
                  <MetricRow
                    label="Bridge Intros"
                    value={formatBoardPackCount(branches.bridge?.introductionsCount)}
                  />
                  <MetricRow
                    label="Bridge Documents"
                    value={formatBoardPackCount(branches.bridge?.documentsCount)}
                  />
                  <MetricRow
                    label="Bridge Reports"
                    value={formatBoardPackCount(branches.bridge?.reportsCount)}
                  />
                  <MetricRow
                    label="Governance Controls"
                    value={formatBoardPackCount(branches.governance?.controlsCount)}
                  />
                  <MetricRow
                    label="Governance Evidence"
                    value={formatBoardPackPercent(branches.governance?.evidenceReadiness)}
                  />
                  <MetricRow
                    label="Bridge Confidentiality"
                    value={formatBoardPackCount(branches.bridge?.confidentialityExceptionsCount)}
                  />
                </PremiumPanel>
              </div>

              <div className="board-pack-columns board-pack-section board-pack-screen-only">
                <PremiumPanel title="Execution Profile">
                  {showRadar ? (
                    <RadarChart branches={branches} />
                  ) : (
                    <>
                      <MetricRow
                        label="PMI Completion"
                        value={formatBoardPackPercent(branches.pmi?.integrationProgress)}
                      />
                      <MetricRow
                        label="Ledger Capture"
                        value={formatBoardPackPercent(branches.pmi?.ledgerCaptureRate)}
                      />
                      <MetricRow
                        label="Synergy Capture"
                        value={formatBoardPackPercent(branches.pmi?.synergyCaptureRate)}
                      />
                      <MetricRow
                        label="Playbook Progress"
                        value={formatBoardPackPercent(branches.pmi?.playbookProgress)}
                      />
                      <MetricRow
                        label="Board Readiness"
                        value={formatBoardPackPercent(branches.governance?.boardReadinessScore)}
                      />
                    </>
                  )}
                </PremiumPanel>
              </div>

              <PremiumPanel title={BOARD_PACK_RECOMMENDATIONS_TITLE} className="board-pack-section">
                <div className="board-pack-recommendations">
                  {displayedRecommendations.map((item, index) => (
                    <p key={`${index}-${item}`}>{item}</p>
                  ))}
                </div>
              </PremiumPanel>

              <footer className="board-pack-premium-footer board-pack-section">{BOARD_PACK_FOOTER_LEGAL}</footer>
            </div>
          </div>
        )}

        <div className={`board-pack-footer ${BOARD_PACK_NO_PRINT_CLASS}`}>
          <div className="board-pack-footer-actions">
            <Button variant="secondary" onClick={onClose} className={BOARD_PACK_NO_PRINT_CLASS}>
              Close
            </Button>
            <div className={`board-pack-print-action ${BOARD_PACK_NO_PRINT_CLASS}`}>
              <Button
                onClick={runBoardPackPrintPreview}
                disabled={!boardPack || loading}
                className={BOARD_PACK_NO_PRINT_CLASS}
              >
                <Printer size={16} />
                {BOARD_PACK_PRINT_BUTTON_LABEL}
              </Button>
              <p className="board-pack-print-hint">{BOARD_PACK_PRINT_DRAFT_HINT}</p>
              <p className="board-pack-print-hint">{BOARD_PACK_PRINT_CLEAN_OUTPUT_HINT}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardPackModal;
