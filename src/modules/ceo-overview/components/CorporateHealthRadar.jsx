import React, { useMemo } from 'react';
import { getCeoBranchAccentHex } from '../utils/ceoBranchAccents.js';
const RADAR_LABEL_SHORT = {
  'Financial · M&A': 'M&A',
  'ESG & reputational risk': 'ESG',
  'Enterprise Risk': 'Risk',
  Compliance: 'Comp.',
  Governance: 'Gov.',
  'PMI / Synergies': 'PMI',
  Operational: 'Ops',
  Heritage: 'Herit.',
  Reporting: 'Report.',
  Strategy: 'Strat.',
  Funding: 'Funding',
  Bridge: 'Bridge',
  Legal: 'Legal',
  'M&A': 'M&A',
  Risk: 'Risk'
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
  if (axis?.tone) {
    return axis.tone;
  }

  return getCeoBranchAccentHex(axis?.key);
}

function radarShortLabel(label) {
  const safe = String(label || '').trim();
  if (!safe) {
    return '';
  }

  if (RADAR_LABEL_SHORT[safe]) {
    return RADAR_LABEL_SHORT[safe];
  }

  if (safe.length <= 9) {
    return safe;
  }

  return safe.split(/\s+/)[0];
}

function radarLabelAnchor(cos) {
  if (cos > 0.28) {
    return 'start';
  }

  if (cos < -0.28) {
    return 'end';
  }

  return 'middle';
}

function radarLabelPosition(angle, cx, cy, radius) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return {
    x: cx + radius * cos,
    y: cy + radius * sin,
    anchor: radarLabelAnchor(cos),
    dy: sin > 0.22 ? '0.35em' : sin < -0.22 ? '-0.15em' : '0.32em'
  };
}

export function CorporateHealthRadar({ axes = [], className = '' }) {
  const safeAxes = Array.isArray(axes) ? axes.filter((axis) => axis && typeof axis === 'object') : [];
  const count = safeAxes.length || 1;
  const cx = 160;
  const cy = 160;
  const rMax = 98;
  const labelRadius = rMax + 40;
  const tau = Math.PI * 2;

  const geometry = useMemo(
    () =>
      safeAxes.map((axis, index) => {
        const angle = -Math.PI / 2 + (index / count) * tau;
        const score = axisScore(axis);
        const calculable = isAxisCalculable(axis);
        const radiusRatio = calculable && score !== null ? score / 100 : null;
        const label = radarLabelPosition(angle, cx, cy, labelRadius);
        const tone = axisTone(axis);

        return {
          axis,
          angle,
          calculable,
          score,
          tone,
          shortLabel: radarShortLabel(axis.label),
          outerX: cx + rMax * Math.cos(angle),
          outerY: cy + rMax * Math.sin(angle),
          pointX:
            radiusRatio === null ? null : cx + rMax * radiusRatio * Math.cos(angle),
          pointY:
            radiusRatio === null ? null : cy + rMax * radiusRatio * Math.sin(angle),
          labelX: label.x,
          labelY: label.y,
          labelAnchor: label.anchor,
          labelDy: label.dy
        };
      }),
    [safeAxes, count, tau, cx, cy, labelRadius]
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
          viewBox="0 0 320 320"
          role="img"
          aria-label="Corporate health radar"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(243, 218, 138, 0.42)" />
              <stop offset="52%" stopColor="rgba(212, 175, 55, 0.34)" />
              <stop offset="100%" stopColor="rgba(154, 117, 24, 0.28)" />
            </linearGradient>
            <filter id="ceoRadarGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="ceoRadarNodeGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="2.5" result="nodeBlur" />
              <feMerge>
                <feMergeNode in="nodeBlur" />
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
              fillOpacity="0.82"
              filter="url(#ceoRadarGlow)"
            />
          ) : null}

          {geometry.map((entry) =>
            entry.calculable && entry.pointX !== null && entry.pointY !== null ? (
              <circle
                key={`${entry.axis.key}-node`}
                cx={entry.pointX}
                cy={entry.pointY}
                r="6"
                className="executive-radar-node"
                fill={entry.tone}
                stroke="rgba(248, 243, 231, 0.82)"
                strokeWidth="1.4"
                filter="url(#ceoRadarNodeGlow)"
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

          {geometry.map((entry) => (
            <text
              key={`${entry.axis.key}-point-label`}
              x={entry.labelX}
              y={entry.labelY}
              dy={entry.labelDy}
              className={`ceo-radar-point-label ${entry.calculable ? '' : 'is-missing'}`.trim()}
              textAnchor={entry.labelAnchor}
              fill={entry.tone}
              aria-label={entry.axis.label}
            >
              {entry.shortLabel}
            </text>
          ))}
        </svg>
      </div>

      {missingCount > 0 ? (
        <p className="ceo-radar-incomplete-note">
          Some branches require additional inputs before a complete executive posture can be shown.
        </p>
      ) : null}
    </div>
  );
}

export default CorporateHealthRadar;
