import React from 'react';
import { FileText, Printer, X } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import { BOARD_PACK_PRINT_DRAFT_HINT } from '../utils/ceoOverviewTruthfulness.js';

export const BOARD_PACK_PRINT_ROOT_CLASS = 'board-pack-print-root';
export const BOARD_PACK_NO_PRINT_CLASS = 'board-pack-no-print';
export const BOARD_PACK_PRINT_BUTTON_LABEL = 'Print draft preview';
export const BOARD_PACK_PRINT_DRAFT_BANNER =
  'Board review draft · Decision support only · Human review required · Not board-approved';

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
      value: score,
      calculable: score !== null
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

function BranchBar({ label, value, tone }) {
  const safeValue = clampScore100(value);
  const display = formatBoardPackScore100(value);

  return (
    <div className="board-pack-bar-row">
      <div className="board-pack-bar-top">
        <span>{label}</span>
        <strong>{display}</strong>
      </div>
      <div className="board-pack-bar-track">
        <div
          className="board-pack-bar-fill"
          style={{
            width: safeValue === null ? '0%' : `${safeValue}%`,
            backgroundColor: tone,
            opacity: safeValue === null ? 0.35 : 1
          }}
        />
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="board-pack-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function BoardPackModal({ boardPack, loading = false, error = null, onClose, onExport }) {
  if (!boardPack && !loading && !error) return null;

  const branches = boardPack?.branches || {};
  const generatedAt = boardPack?.generatedAt
    ? new Date(boardPack.generatedAt).toLocaleString('en-GB')
    : '';

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
          background: rgba(5, 5, 4, 0.82);
          backdrop-filter: blur(18px);
        }

        .board-pack-modal {
          width: min(1080px, 100%);
          max-height: min(880px, calc(100vh - 48px));
          overflow: auto;
          border-radius: 28px;
          border: 1px solid rgba(212, 175, 55, 0.24);
          background:
            linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)),
            linear-gradient(180deg, #0a0908 0%, #050504 100%);
          box-shadow: 0 36px 110px rgba(0, 0, 0, 0.45);
          padding: 28px;
        }

        .board-pack-header,
        .board-pack-footer,
        .board-pack-bar-top {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: flex-start;
        }

        .board-pack-header h2 {
          margin: 8px 0 6px;
          letter-spacing: -0.045em;
        }

        .board-pack-header p,
        .board-pack-summary p,
        .board-pack-recommendations p {
          margin: 0;
          color: rgba(203, 213, 225, 0.82);
          line-height: 1.62;
        }

        .board-pack-kicker {
          display: inline-flex;
          gap: 8px;
          align-items: center;
          color: rgba(243, 218, 138, 0.88);
          text-transform: uppercase;
          letter-spacing: 0.16em;
          font-size: 11px;
          font-weight: 850;
        }

        .board-pack-icon-button {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: rgba(226, 232, 240, 0.94);
          cursor: pointer;
        }

        .board-pack-summary {
          margin-top: 24px;
          display: grid;
          grid-template-columns: minmax(150px, 0.28fr) minmax(0, 1fr);
          gap: 18px;
          padding: 20px;
          border-radius: 22px;
          border: 1px solid rgba(212, 175, 55, 0.18);
          background: rgba(255,255,255,0.04);
        }

        .board-pack-summary span,
        .board-pack-metric span,
        .board-pack-bar-top span {
          color: rgba(212, 175, 55, 0.82);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 850;
        }

        .board-pack-summary strong {
          display: block;
          margin-top: 8px;
          font-size: 32px;
          letter-spacing: -0.055em;
        }

        .board-pack-grid,
        .board-pack-metrics {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          margin-top: 18px;
        }

        .board-pack-panel,
        .board-pack-metric {
          border-radius: 22px;
          border: 1px solid rgba(212, 175, 55, 0.18);
          background: rgba(255,255,255,0.04);
          padding: 18px;
        }

        .board-pack-panel h3 {
          margin: 0 0 14px;
          letter-spacing: -0.035em;
        }

        .board-pack-radar {
          width: min(330px, 100%);
          display: block;
          margin: 0 auto;
        }

        .board-pack-radar-grid,
        .board-pack-radar-axis {
          fill: none;
          stroke: rgba(212, 175, 55, 0.22);
        }

        .board-pack-radar-fill {
          fill: rgba(245, 197, 92, 0.16);
          stroke: rgba(245, 197, 92, 0.82);
          stroke-width: 2;
        }

        .board-pack-radar-label {
          fill: rgba(226, 232, 240, 0.82);
          font-size: 8px;
          text-anchor: middle;
        }

        .board-pack-bar-row {
          display: grid;
          gap: 8px;
          padding: 10px 0;
          border-top: 1px solid rgba(212, 175, 55, 0.12);
        }

        .board-pack-bar-track {
          height: 9px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          overflow: hidden;
        }

        .board-pack-bar-fill {
          height: 100%;
          border-radius: 999px;
        }

        .board-pack-metric {
          display: grid;
          gap: 8px;
        }

        .board-pack-metric strong {
          font-size: 18px;
          overflow-wrap: anywhere;
        }

        .board-pack-recommendations {
          display: grid;
          gap: 10px;
        }

        .board-pack-empty {
          margin-top: 24px;
          padding: 28px;
          border-radius: 20px;
          background: rgba(255,255,255,0.04);
          color: rgba(203, 213, 225, 0.86);
        }

        .board-pack-footer {
          margin-top: 22px;
          padding-top: 18px;
          border-top: 1px solid rgba(212, 175, 55, 0.16);
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
          color: rgba(203, 213, 225, 0.72);
        }

        .board-pack-print-only-banner {
          display: none;
        }

        @media (max-width: 820px) {
          .board-pack-summary,
          .board-pack-grid,
          .board-pack-metrics {
            grid-template-columns: 1fr;
          }

          .board-pack-modal {
            padding: 20px;
            border-radius: 22px;
          }
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 12mm;
          }

          html,
          body {
            background: #fff !important;
            height: auto !important;
            overflow: visible !important;
          }

          body * {
            visibility: hidden;
          }

          .board-pack-backdrop,
          .board-pack-backdrop .${BOARD_PACK_PRINT_ROOT_CLASS},
          .board-pack-backdrop .${BOARD_PACK_PRINT_ROOT_CLASS} * {
            visibility: visible;
          }

          .board-pack-backdrop {
            position: static !important;
            inset: auto !important;
            display: block !important;
            padding: 0 !important;
            margin: 0 !important;
            background: #fff !important;
            backdrop-filter: none !important;
          }

          .${BOARD_PACK_PRINT_ROOT_CLASS} {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-height: none !important;
            overflow: visible !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            padding: 0 !important;
            background: #fff !important;
            color: #111827 !important;
          }

          .${BOARD_PACK_NO_PRINT_CLASS},
          .board-pack-footer,
          .board-pack-icon-button,
          .board-pack-print-action {
            display: none !important;
            visibility: hidden !important;
          }

          .board-pack-print-only-banner {
            display: block !important;
            margin: 0 0 14px;
            padding: 10px 12px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            background: #f9fafb;
            color: #374151 !important;
            font-size: 11px;
            line-height: 1.5;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            font-weight: 700;
          }

          .board-pack-header h2,
          .board-pack-panel h3,
          .board-pack-summary strong,
          .board-pack-metric strong,
          .board-pack-bar-top strong {
            color: #111827 !important;
          }

          .board-pack-header p,
          .board-pack-summary p,
          .board-pack-recommendations p {
            color: #374151 !important;
          }

          .board-pack-kicker,
          .board-pack-summary span,
          .board-pack-metric span,
          .board-pack-bar-top span {
            color: #6b7280 !important;
          }

          .board-pack-summary,
          .board-pack-panel,
          .board-pack-metric {
            border: 1px solid #d1d5db !important;
            background: #fff !important;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .board-pack-section {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .board-pack-grid,
          .board-pack-metrics {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }

          .board-pack-radar {
            max-width: 280px;
          }

          .board-pack-radar-grid,
          .board-pack-radar-axis {
            stroke: #9ca3af !important;
          }

          .board-pack-radar-fill {
            fill: rgba(180, 140, 40, 0.18) !important;
            stroke: #92700c !important;
          }

          .board-pack-radar-label {
            fill: #111827 !important;
          }

          .board-pack-bar-track {
            background: #e5e7eb !important;
          }

          .ceos-sidebar,
          .sidebar,
          .topbar,
          .app-shell > :not(.board-pack-backdrop) {
            display: none !important;
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
        <div className="board-pack-header board-pack-section">
          <div>
            <div className="board-pack-kicker">
              <FileText size={14} />
              Executive board review draft
            </div>
            <h2>Consolidated board review draft</h2>
            <p>{generatedAt ? `Prepared ${generatedAt}` : 'Preparing consolidated executive view.'}</p>
          </div>
          <button
            type="button"
            className={`board-pack-icon-button ${BOARD_PACK_NO_PRINT_CLASS}`}
            onClick={onClose}
            aria-label="Close Board Pack"
          >
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="board-pack-empty">Preparing board review draft.</div>
        ) : error ? (
          <div className="board-pack-empty">{error.message || 'Board review draft could not be prepared.'}</div>
        ) : (
          <>
            <section className="board-pack-summary board-pack-section">
              <div>
                <span>Consolidated score</span>
                <strong>{formatBoardPackScore100(boardPack.score)}</strong>
              </div>
              <p>{boardPack.executiveSummary}</p>
            </section>

            <section className="board-pack-grid board-pack-section">
              <div className="board-pack-panel board-pack-section">
                <h3>Branch balance</h3>
                <RadarChart branches={branches} />
              </div>

              <div className="board-pack-panel board-pack-section">
                <h3>Operating balance</h3>
                {branchMeta.map((item) => (
                  <BranchBar
                    key={item.key}
                    label={item.label}
                    value={branches[item.key]?.score}
                    tone={item.tone}
                  />
                ))}
              </div>
            </section>

            <section className="board-pack-metrics board-pack-section">
              <Metric
                label="M&A valuation"
                value={formatBoardPackCurrency(branches.ma?.valuation, 'EUR')}
              />
              <Metric label="Applied multiple" value={branches.ma?.multipleLabel || 'N/A'} />
              <Metric
                label="Compliance health"
                value={formatBoardPackScore100(branches.compliance?.healthScore)}
              />
              <Metric
                label="Critical findings"
                value={formatBoardPackCount(branches.compliance?.criticalFindings)}
              />
              <Metric label="Runway" value={formatBoardPackMonths(branches.funding?.runwayMonths)} />
              <Metric
                label="Capital raised"
                value={formatBoardPackCurrency(branches.funding?.capitalRaised, 'EUR')}
              />
              <Metric
                label="PMI completion"
                value={formatBoardPackPercent(branches.pmi?.integrationProgress)}
              />
              <Metric
                label="Synergy capture"
                value={formatBoardPackPercent(branches.pmi?.synergyCaptureRate)}
              />
              <Metric
                label="Ledger capture"
                value={formatBoardPackPercent(branches.pmi?.ledgerCaptureRate)}
              />
              <Metric
                label="Playbook progress"
                value={formatBoardPackPercent(branches.pmi?.playbookProgress)}
              />
              <Metric
                label="Blocked dependencies"
                value={formatBoardPackCount(branches.pmi?.blockedDependenciesCount)}
              />
              <Metric
                label="Bridge weighted pipeline"
                value={formatBoardPackCurrency(branches.bridge?.weightedPipelineValue, 'EUR')}
              />
              <Metric
                label="Bridge intros"
                value={formatBoardPackCount(branches.bridge?.introductionsCount)}
              />
              <Metric
                label="Bridge confidentiality"
                value={formatBoardPackCount(branches.bridge?.confidentialityExceptionsCount)}
              />
              <Metric
                label="Bridge documents"
                value={formatBoardPackCount(branches.bridge?.documentsCount)}
              />
              <Metric
                label="Bridge reports"
                value={formatBoardPackCount(branches.bridge?.reportsCount)}
              />
              <Metric
                label="Governance controls"
                value={formatBoardPackCount(branches.governance?.controlsCount)}
              />
              <Metric
                label="Governance evidence"
                value={formatBoardPackPercent(branches.governance?.evidenceReadiness)}
              />
              <Metric
                label="Open board decisions"
                value={formatBoardPackCount(branches.governance?.openDecisionsCount)}
              />
              <Metric
                label="Board readiness"
                value={formatBoardPackPercent(branches.governance?.boardReadinessScore)}
              />
              <Metric
                label="Approval bottlenecks"
                value={formatBoardPackCount(branches.governance?.approvalBottlenecks)}
              />
              <Metric
                label="Policy review risk"
                value={formatBoardPackCount(branches.governance?.policyReviewRisk)}
              />
              <Metric
                label="Heritage mapped value"
                value={formatBoardPackCurrency(branches.heritage?.totalAssetValue, 'EUR')}
              />
              <Metric
                label="Heritage succession"
                value={formatBoardPackPercent(branches.heritage?.successionReadiness)}
              />
              <Metric
                label="Heritage protection"
                value={formatBoardPackPercent(branches.heritage?.protectionCoverage)}
              />
              <Metric
                label="Heritage documents"
                value={formatBoardPackCount(branches.heritage?.documentsCount)}
              />
              <Metric
                label="Heritage reports"
                value={formatBoardPackCount(branches.heritage?.reportsCount)}
              />
            </section>

            <section className="board-pack-panel board-pack-section">
              <h3>Board recommendations</h3>
              <div className="board-pack-recommendations">
                {(boardPack.recommendations || []).map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </section>
          </>
        )}

        <div className={`board-pack-footer ${BOARD_PACK_NO_PRINT_CLASS}`}>
          <div className="board-pack-footer-actions">
            <Button variant="secondary" onClick={onClose} className={BOARD_PACK_NO_PRINT_CLASS}>
              Close
            </Button>
            <div className={`board-pack-print-action ${BOARD_PACK_NO_PRINT_CLASS}`}>
              <Button
                onClick={onExport}
                disabled={!boardPack || loading}
                className={BOARD_PACK_NO_PRINT_CLASS}
              >
                <Printer size={16} />
                {BOARD_PACK_PRINT_BUTTON_LABEL}
              </Button>
              <p className="board-pack-print-hint">{BOARD_PACK_PRINT_DRAFT_HINT}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardPackModal;
