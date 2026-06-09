import React from 'react';
import { Download, FileText, X } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';

const branchMeta = [
  { key: 'ma', label: 'M&A', tone: '#34d399' },
  { key: 'compliance', label: 'Compliance', tone: '#60a5fa' },
  { key: 'funding', label: 'Funding', tone: '#fbbf24' },
  { key: 'pmi', label: 'PMI', tone: '#a78bfa' },
  { key: 'bridge', label: 'Bridge', tone: '#2dd4bf' },
  { key: 'governance', label: 'Governance', tone: '#38bdf8' },
  { key: 'heritage', label: 'Heritage', tone: '#d4af37' }
];

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(toNumber(value))));
}

function formatMonths(value) {
  const number = toNumber(value);
  return number > 0 ? `${number.toFixed(1)} months` : 'N/A';
}

function RadarChart({ branches = {} }) {
  const center = 92;
  const radius = 62;
  const points = branchMeta.map((item, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / branchMeta.length;
    const value = clamp(branches[item.key]?.score ?? 0) / 100;

    return {
      ...item,
      x: center + Math.cos(angle) * radius * value,
      y: center + Math.sin(angle) * radius * value,
      axisX: center + Math.cos(angle) * radius,
      axisY: center + Math.sin(angle) * radius,
      value: clamp(branches[item.key]?.score ?? 0)
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
  const safeValue = clamp(value);

  return (
    <div className="board-pack-bar-row">
      <div className="board-pack-bar-top">
        <span>{label}</span>
        <strong>{safeValue}/100</strong>
      </div>
      <div className="board-pack-bar-track">
        <div
          className="board-pack-bar-fill"
          style={{ width: `${safeValue}%`, backgroundColor: tone }}
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
          align-items: center;
          margin-top: 22px;
          padding-top: 18px;
          border-top: 1px solid rgba(212, 175, 55, 0.16);
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
      `}</style>
      <div className="board-pack-modal" role="dialog" aria-modal="true" aria-label="Executive Board Pack preview">
        <div className="board-pack-header">
          <div>
            <div className="board-pack-kicker">
              <FileText size={14} />
              Executive board review draft
            </div>
            <h2>Consolidated board review draft</h2>
            <p>{generatedAt ? `Prepared ${generatedAt}` : 'Preparing consolidated executive view.'}</p>
          </div>
          <button type="button" className="board-pack-icon-button" onClick={onClose} aria-label="Close Board Pack">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="board-pack-empty">Preparing board review draft.</div>
        ) : error ? (
          <div className="board-pack-empty">{error.message || 'Board review draft could not be prepared.'}</div>
        ) : (
          <>
            <section className="board-pack-summary">
              <div>
                <span>Consolidated score</span>
                <strong>{boardPack.score}/100</strong>
              </div>
              <p>{boardPack.executiveSummary}</p>
            </section>

            <section className="board-pack-grid">
              <div className="board-pack-panel">
                <h3>Branch balance</h3>
                <RadarChart branches={branches} />
              </div>

              <div className="board-pack-panel">
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

            <section className="board-pack-metrics">
              <Metric
                label="M&A valuation"
                value={formatCurrency(branches.ma?.valuation || 0, 'EUR')}
              />
              <Metric label="Applied multiple" value={branches.ma?.multipleLabel || 'N/A'} />
              <Metric label="Compliance health" value={`${branches.compliance?.healthScore ?? 0}/100`} />
              <Metric label="Critical findings" value={branches.compliance?.criticalFindings ?? 0} />
              <Metric label="Runway" value={formatMonths(branches.funding?.runwayMonths)} />
              <Metric
                label="Capital raised"
                value={formatCurrency(branches.funding?.capitalRaised || 0, 'EUR')}
              />
              <Metric label="PMI completion" value={`${branches.pmi?.integrationProgress ?? 0}%`} />
              <Metric label="Synergy capture" value={`${branches.pmi?.synergyCaptureRate ?? 0}%`} />
              <Metric label="Ledger capture" value={`${branches.pmi?.ledgerCaptureRate ?? 0}%`} />
              <Metric label="Playbook progress" value={`${branches.pmi?.playbookProgress ?? 0}%`} />
              <Metric label="Blocked dependencies" value={branches.pmi?.blockedDependenciesCount ?? 0} />
              <Metric
                label="Bridge weighted pipeline"
                value={formatCurrency(branches.bridge?.weightedPipelineValue || 0, 'EUR')}
              />
              <Metric label="Bridge intros" value={branches.bridge?.introductionsCount ?? 0} />
              <Metric
                label="Bridge confidentiality"
                value={branches.bridge?.confidentialityExceptionsCount ?? 0}
              />
              <Metric label="Bridge documents" value={branches.bridge?.documentsCount ?? 0} />
              <Metric label="Bridge reports" value={branches.bridge?.reportsCount ?? 0} />
              <Metric label="Governance controls" value={branches.governance?.controlsCount ?? 0} />
              <Metric label="Governance evidence" value={`${branches.governance?.evidenceReadiness ?? 0}%`} />
              <Metric label="Open board decisions" value={branches.governance?.openDecisionsCount ?? 0} />
              <Metric label="Board readiness" value={`${branches.governance?.boardReadinessScore ?? 0}%`} />
              <Metric label="Approval bottlenecks" value={branches.governance?.approvalBottlenecks ?? 0} />
              <Metric label="Policy review risk" value={branches.governance?.policyReviewRisk ?? 0} />
              <Metric
                label="Heritage mapped value"
                value={formatCurrency(branches.heritage?.totalAssetValue || 0, 'EUR')}
              />
              <Metric label="Heritage succession" value={`${branches.heritage?.successionReadiness ?? 0}%`} />
              <Metric label="Heritage protection" value={`${branches.heritage?.protectionCoverage ?? 0}%`} />
              <Metric label="Heritage documents" value={branches.heritage?.documentsCount ?? 0} />
              <Metric label="Heritage reports" value={branches.heritage?.reportsCount ?? 0} />
            </section>

            <section className="board-pack-panel">
              <h3>Board recommendations</h3>
              <div className="board-pack-recommendations">
                {(boardPack.recommendations || []).map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </section>
          </>
        )}

        <div className="board-pack-footer">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onExport} disabled={!boardPack || loading}>
            <Download size={16} />
            Exportar a PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BoardPackModal;
