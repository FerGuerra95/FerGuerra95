import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

const BRANCH_TONES = {
  legal: '#60a5fa',
  financial: '#34d399',
  ma: '#34d399',
  ops: '#a78bfa',
  esg: '#4ade80',
  funding: '#fbbf24',
  risk: '#f87171',
  strategy: '#38bdf8',
  bridge: '#22d3ee',
  heritage: '#d4af37',
  compliance: '#3b82f6',
  governance: '#0ea5e9',
  pmi: '#a855f7'
};

function normalizeScore(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.max(0, Math.min(100, Math.round(parsed)));
}

function isAxisCalculable(axis) {
  if (axis?.isCalculable === false) {
    return false;
  }

  if (axis?.status === 'insufficient_data' || axis?.dataSource === 'insufficient_data') {
    return false;
  }

  return normalizeScore(axis?.value ?? axis?.score) !== null;
}

function axisScore(axis) {
  return normalizeScore(axis?.value ?? axis?.score);
}

function axisTone(axis) {
  return axis?.tone || BRANCH_TONES[axis?.key] || '#d4af37';
}

function formatAxisDisplay(axis) {
  if (axis?.displayLabel) {
    return axis.displayLabel;
  }

  const score = axisScore(axis);
  return score === null ? 'N/A' : `${score}%`;
}

function formatAxisStatus(axis) {
  if (!isAxisCalculable(axis)) {
    return 'Pending inputs';
  }

  if (axis?.status && axis.status !== 'normal') {
    return axis.status.replace(/_/g, ' ');
  }

  return 'DSS signal';
}

export function CorporateHealthRadar({ axes = [], className = '' }) {
  const safeAxes = Array.isArray(axes) ? axes.filter((axis) => axis && typeof axis === 'object') : [];
  const count = safeAxes.length || 1;
  const cx = 120;
  const cy = 120;
  const rMax = 92;
  const tau = Math.PI * 2;

  const geometry = useMemo(
    () =>
      safeAxes.map((axis, index) => {
        const angle = -Math.PI / 2 + (index / count) * tau;
        const score = axisScore(axis);
        const calculable = isAxisCalculable(axis);
        const radiusRatio = calculable && score !== null ? score / 100 : null;

        return {
          axis,
          angle,
          calculable,
          score,
          tone: axisTone(axis),
          outerX: cx + rMax * Math.cos(angle),
          outerY: cy + rMax * Math.sin(angle),
          pointX:
            radiusRatio === null ? null : cx + rMax * radiusRatio * Math.cos(angle),
          pointY:
            radiusRatio === null ? null : cy + rMax * radiusRatio * Math.sin(angle),
          labelX: cx + (rMax + 16) * Math.cos(angle),
          labelY: cy + (rMax + 16) * Math.sin(angle)
        };
      }),
    [safeAxes, count, tau]
  );

  const polygonPoints = geometry
    .filter((entry) => entry.calculable && entry.pointX !== null && entry.pointY !== null)
    .map((entry) => `${entry.pointX.toFixed(1)},${entry.pointY.toFixed(1)}`)
    .join(' ');

  const outerRingPoints = geometry.map((entry) => `${entry.outerX.toFixed(1)},${entry.outerY.toFixed(1)}`).join(' ');

  const calculableCount = geometry.filter((entry) => entry.calculable).length;
  const missingCount = geometry.length - calculableCount;
  const gradientId = 'ceoCorporateRadarGoldFill';

  return (
    <div className={`executive-radar-panel ceo-radar-premium ${className}`.trim()}>
      <div className="ceo-radar-visual-wrap">
        <svg
          className="ceo-radar-svg"
          viewBox="0 0 240 240"
          role="img"
          aria-label="Corporate health radar"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(243, 218, 138, 0.42)" />
              <stop offset="52%" stopColor="rgba(212, 175, 55, 0.34)" />
              <stop offset="100%" stopColor="rgba(154, 117, 24, 0.28)" />
            </linearGradient>
            <filter id="ceoRadarGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle
            cx={cx}
            cy={cy}
            r={rMax}
            className="executive-radar-outer-ring"
            fill="rgba(212, 175, 55, 0.03)"
          />

          {[0.33, 0.66, 1].map((ratio) => (
            <circle
              key={ratio}
              cx={cx}
              cy={cy}
              r={rMax * ratio}
              className="executive-radar-grid"
            />
          ))}

          <polygon points={outerRingPoints} className="executive-radar-reference" />

          {geometry.map((entry) => (
            <line
              key={`${entry.axis.key}-spoke`}
              x1={cx}
              y1={cy}
              x2={entry.outerX}
              y2={entry.outerY}
              className={`executive-radar-axis ${entry.calculable ? '' : 'is-missing'}`.trim()}
            />
          ))}

          {polygonPoints && calculableCount >= 3 ? (
            <polygon
              className="executive-radar-fill"
              points={polygonPoints}
              fill={`url(#${gradientId})`}
              filter="url(#ceoRadarGlow)"
            />
          ) : null}

          {geometry.map((entry) =>
            entry.calculable && entry.pointX !== null && entry.pointY !== null ? (
              <circle
                key={`${entry.axis.key}-node`}
                cx={entry.pointX}
                cy={entry.pointY}
                r="4.5"
                className="executive-radar-node"
                fill={entry.tone}
                stroke="rgba(248, 250, 252, 0.85)"
                strokeWidth="1.2"
              />
            ) : (
              <circle
                key={`${entry.axis.key}-missing`}
                cx={entry.outerX}
                cy={entry.outerY}
                r="3.5"
                className="executive-radar-node-missing"
                fill="none"
                stroke={entry.tone}
                strokeWidth="1.4"
                strokeDasharray="2 2"
              />
            )
          )}
        </svg>
      </div>

      <div className="ceo-radar-legend-wrap">
        {missingCount > 0 ? (
          <p className="ceo-radar-incomplete-note">
            Some branches require additional inputs before a complete executive posture can be shown.
          </p>
        ) : null}

        <div className="executive-radar-list ceo-radar-legend">
          {geometry.map((entry) => (
            <Link
              key={entry.axis.key}
              to={entry.axis.route || '/dashboard'}
              className={`ceo-radar-legend-item ${entry.calculable ? '' : 'is-missing'}`.trim()}
            >
              <span className="ceo-radar-legend-label">
                <span className="ceo-radar-swatch" style={{ background: entry.tone }} aria-hidden="true" />
                <span>{entry.axis.label}</span>
              </span>
              <span className="ceo-radar-legend-values">
                <strong>{formatAxisDisplay(entry.axis)}</strong>
                <small>{formatAxisStatus(entry.axis)}</small>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CorporateHealthRadar;
