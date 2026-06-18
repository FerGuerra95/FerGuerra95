import React, { useEffect, useMemo, useState } from 'react';
import { getCeoBranchAccentHex } from '../utils/ceoBranchAccents.js';
import {
  EXECUTIVE_RADAR_BRANCH_LABELS,
  EXECUTIVE_RADAR_BRANCH_ORDER,
  normalizeExecutiveRadarBranchKey
} from '../utils/ceoOverviewTruthfulness.js';

/** Matches ceoRadarSweepRotate duration in ceoMaterialSystem.css */
const RADAR_SWEEP_DURATION_SEC = 16;

function radarBranchSweepDelay(branchIndex, branchCount) {
  if (!branchCount) return '0s';
  return `${(branchIndex / branchCount) * RADAR_SWEEP_DURATION_SEC}s`;
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);
    syncPreference();
    mediaQuery.addEventListener('change', syncPreference);
    return () => mediaQuery.removeEventListener('change', syncPreference);
  }, []);

  return prefersReducedMotion;
}

const RADAR_LABEL_WHITE = 'rgba(248, 243, 231, 0.96)';
const RADAR_LABEL_MUTED = 'rgba(248, 243, 231, 0.38)';

const RADAR_LABEL_SHORT = {
  legal: 'Comp.',
  financial: 'M&A',
  ops: 'PMI',
  esg: 'Gov.',
  funding: 'Funding',
  risk: 'Risk',
  strategy: 'Strategy',
  bridge: 'Bridge',
  heritage: 'Heritage',
  reporting: 'Report.',
  compliance: 'Comp.',
  pmi: 'PMI',
  ma: 'M&A',
  'Financial · M&A': 'M&A',
  'ESG & reputational risk': 'Gov.',
  'Enterprise Risk': 'Risk',
  Compliance: 'Comp.',
  Governance: 'Gov.',
  'PMI / Synergies': 'PMI',
  Operational: 'PMI',
  Heritage: 'Heritage',
  Reporting: 'Report.',
  Strategy: 'Strategy',
  Funding: 'Funding',
  Bridge: 'Bridge',
  Legal: 'Comp.',
  'M&A': 'M&A',
  Risk: 'Risk'
};

const RADAR_LABEL_FULL = {
  legal: 'Compliance',
  financial: 'M&A',
  ops: 'PMI',
  esg: 'Governance',
  funding: 'Funding',
  risk: 'Risk',
  strategy: 'Strategy',
  bridge: 'Bridge',
  heritage: 'Heritage',
  reporting: 'Reporting',
  compliance: 'Compliance',
  pmi: 'PMI',
  ma: 'M&A',
  'Financial · M&A': 'M&A',
  'Financial Â· M&A': 'M&A',
  'ESG & reputational risk': 'Governance',
  'Enterprise Risk': 'Risk',
  Compliance: 'Compliance',
  Governance: 'Governance',
  'PMI / Synergies': 'PMI',
  Operational: 'PMI',
  Heritage: 'Heritage',
  Reporting: 'Reporting',
  Strategy: 'Strategy',
  Funding: 'Funding',
  Bridge: 'Bridge',
  Legal: 'Compliance',
  'M&A': 'M&A',
  Risk: 'Risk'
};

const RADAR_STATUS_LABEL = {
  healthy: 'Complete',
  strong: 'Complete',
  good: 'Complete',
  ready: 'Complete',
  operational: 'Complete',
  active: 'Complete',
  watch: 'Attention',
  warning: 'Attention',
  review: 'Review',
  medium: 'Review',
  high: 'Review',
  low: 'Review',
  insufficient_data: 'Pending inputs',
  missing: 'Pending inputs',
  pending: 'Pending inputs'
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

  return getCeoBranchAccentHex(normalizeExecutiveRadarBranchKey(axis));
}

function radarShortLabel(axis) {
  const key = normalizeExecutiveRadarBranchKey(axis);
  if (key && RADAR_LABEL_SHORT[key]) {
    return RADAR_LABEL_SHORT[key];
  }

  const label = axis?.label;
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

function radarStatusLabel(axis, calculable) {
  if (!calculable) {
    return 'Pending inputs';
  }

  const status = String(axis?.status || axis?.posture || axis?.dataSource || '').trim().toLowerCase();

  return RADAR_STATUS_LABEL[status] || 'Review';
}

function radarLegendLabel(axis) {
  const key = normalizeExecutiveRadarBranchKey(axis);
  if (key && EXECUTIVE_RADAR_BRANCH_LABELS[key]) {
    return EXECUTIVE_RADAR_BRANCH_LABELS[key];
  }

  const label = String(axis?.label || '').trim();
  if (!label) {
    return '';
  }

  return RADAR_LABEL_FULL[label] || label;
}

function dedupeRadarAxes(axes) {
  const byBranch = new Map();
  const safeAxes = Array.isArray(axes) ? axes.filter((axis) => axis && typeof axis === 'object') : [];

  safeAxes.forEach((axis) => {
    const key = normalizeExecutiveRadarBranchKey(axis);
    if (!EXECUTIVE_RADAR_BRANCH_ORDER.includes(key)) return;

    const canonicalAxis = {
      ...axis,
      key,
      label: EXECUTIVE_RADAR_BRANCH_LABELS[key] || axis.label
    };
    const current = byBranch.get(key);

    if (!current || (!isAxisCalculable(current) && isAxisCalculable(canonicalAxis))) {
      byBranch.set(key, canonicalAxis);
    }
  });

  return EXECUTIVE_RADAR_BRANCH_ORDER.map((key) => byBranch.get(key)).filter(Boolean);
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
  const prefersReducedMotion = usePrefersReducedMotion();
  const safeAxes = useMemo(() => dedupeRadarAxes(axes), [axes]);
  const count = safeAxes.length || 1;
  const cx = 180;
  const cy = 180;
  const rMax = 104;
  const labelRadius = rMax + 20;
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
          shortLabel: radarShortLabel(axis),
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
      <div className="ceo-radar-visual-wrap ceo-radar-cinematic">
        <div className="ceo-radar-cinematic-halo" aria-hidden="true" />
        <div className="ceo-radar-sweep-beam" aria-hidden="true" />
        <svg
          className="ceo-radar-svg"
          viewBox="0 0 360 360"
          role="img"
          aria-label="Corporate health radar"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(243, 218, 138, 0.36)" />
              <stop offset="48%" stopColor="rgba(212, 175, 55, 0.26)" />
              <stop offset="100%" stopColor="rgba(154, 117, 24, 0.16)" />
            </linearGradient>
            <radialGradient id="ceoRadarCinematicHalo" cx="50%" cy="46%" r="58%">
              <stop offset="0%" stopColor="rgba(245, 197, 92, 0.14)" />
              <stop offset="55%" stopColor="rgba(212, 175, 55, 0.06)" />
              <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
            </radialGradient>
            <filter id="ceoRadarGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
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

          <g className="ceo-radar-cinematic-depth" aria-hidden="true">
            <circle
              cx={cx}
              cy={cy}
              r={rMax + 52}
              fill="url(#ceoRadarCinematicHalo)"
              opacity="0.45"
            />
          </g>

          <g className="ceo-radar-sweep-orbit" aria-hidden="true">
            <circle
              cx={cx}
              cy={cy}
              r={rMax + 38}
              className="ceo-radar-sweep-ring"
              fill="none"
              stroke="rgba(245, 197, 92, 0.22)"
              strokeWidth="0.75"
              strokeDasharray="18 42"
            />
          </g>

          <g className="ceo-radar-sovereign-rings" aria-hidden="true">
            <circle
              cx={cx}
              cy={cy}
              r={rMax + 44}
              className="ceo-radar-orbit-halo ceo-radar-orbit-halo--outer"
              fill="none"
              stroke="rgba(212, 175, 55, 0.1)"
              strokeWidth="0.75"
              strokeDasharray="3 14"
            />
            <circle
              cx={cx}
              cy={cy}
              r={rMax + 34}
              className="ceo-radar-orbit-halo ceo-radar-orbit-halo--mid"
              fill="none"
              stroke="rgba(212, 175, 55, 0.14)"
              strokeWidth="0.8"
            />
            <circle
              cx={cx}
              cy={cy}
              r={rMax + 20}
              className="ceo-radar-orbit-halo ceo-radar-orbit-halo--inner"
              fill="none"
              stroke="rgba(245, 197, 92, 0.18)"
              strokeWidth="0.85"
            />
          </g>
          <circle
            cx={cx}
            cy={cy}
            r="14"
            className="ceo-radar-core-pulse"
            fill="rgba(245, 197, 92, 0.14)"
            stroke="rgba(243, 218, 138, 0.34)"
            strokeWidth="0.9"
          />
          <circle
            cx={cx}
            cy={cy}
            r={rMax}
            className="executive-radar-outer-ring"
            fill="rgba(245, 197, 92, 0.09)"
          />

          <circle
            cx={cx}
            cy={cy}
            r="10"
            className="executive-radar-center-focus"
          />

          {[0.33, 0.66, 1].map((ratio) => (
            <circle
              key={ratio}
              cx={cx}
              cy={cy}
              r={rMax * ratio}
              className={`executive-radar-grid ${ratio === 1 ? 'executive-radar-grid--outer' : 'executive-radar-grid--inner'}`.trim()}
              strokeDasharray={ratio === 1 ? undefined : '2 7'}
            />
          ))}

          <polygon points={outerRingPoints} className="executive-radar-reference ceo-radar-stroke-motion" />

          {geometry.map((entry, branchIndex) => (
            <line
              key={`${entry.axis.key}-spoke`}
              x1={cx}
              y1={cy}
              x2={entry.outerX}
              y2={entry.outerY}
              className={`executive-radar-axis ceo-radar-axis-branch-sweep ${entry.calculable ? '' : 'is-missing'}`.trim()}
              style={{
                '--ceo-radar-branch-delay': radarBranchSweepDelay(branchIndex, count),
                '--ceo-radar-branch-color': entry.tone
              }}
            />
          ))}

          {geometry.map((entry, branchIndex) => (
            <circle
              key={`${entry.axis.key}-hub`}
              cx={entry.outerX}
              cy={entry.outerY}
              r="2.5"
              className="ceo-radar-branch-hub-sweep"
              style={{
                '--ceo-radar-branch-delay': radarBranchSweepDelay(branchIndex, count),
                '--ceo-radar-branch-color': entry.tone
              }}
              aria-hidden="true"
            />
          ))}

          {polygonPoints && calculableCount >= 3 ? (
            <polygon
              className="executive-radar-fill"
              points={polygonPoints}
              fill={`url(#${gradientId})`}
              fillOpacity="0.72"
              stroke="rgba(252, 236, 180, 0.88)"
              strokeWidth="1.75"
              strokeLinejoin="round"
            />
          ) : null}

          {geometry.map((entry, branchIndex) =>
            entry.calculable && entry.pointX !== null && entry.pointY !== null ? (
              <circle
                key={`${entry.axis.key}-node`}
                cx={entry.pointX}
                cy={entry.pointY}
                r="6"
                className="executive-radar-node ceo-radar-node-pulse ceo-radar-node-branch-sweep"
                style={{
                  '--ceo-radar-branch-delay': radarBranchSweepDelay(branchIndex, count),
                  '--ceo-radar-node-breath-delay': `${branchIndex * 0.55}s`,
                  '--ceo-radar-branch-color': entry.tone
                }}
                fill={entry.tone}
                stroke="rgba(248, 243, 231, 0.88)"
                strokeWidth="1.5"
                filter="url(#ceoRadarNodeGlow)"
              />
            ) : (
              <circle
                key={`${entry.axis.key}-missing`}
                cx={entry.outerX}
                cy={entry.outerY}
                r="3.5"
                className="executive-radar-node-missing ceo-radar-node-branch-sweep"
                style={{
                  '--ceo-radar-branch-delay': radarBranchSweepDelay(branchIndex, count),
                  '--ceo-radar-branch-color': entry.tone
                }}
                fill="none"
                stroke={entry.tone}
                strokeWidth="1.4"
                strokeDasharray="2 2"
              />
            )
          )}

          {geometry.map((entry, branchIndex) => (
            <text
              key={`${entry.axis.key}-point-label`}
              x={entry.labelX}
              y={entry.labelY}
              dy={entry.labelDy}
              className={
                entry.calculable
                  ? 'ceo-radar-point-label ceo-radar-label-has-data'
                  : 'ceo-radar-point-label ceo-radar-label-no-data is-missing'
              }
              fill={entry.calculable ? RADAR_LABEL_WHITE : RADAR_LABEL_MUTED}
              textAnchor={entry.labelAnchor}
              aria-label={entry.axis.label}
            >
              {entry.shortLabel}
              {entry.calculable && !prefersReducedMotion ? (
                <animate
                  attributeName="fill"
                  values={`${RADAR_LABEL_WHITE};${entry.tone};${RADAR_LABEL_WHITE};${RADAR_LABEL_WHITE}`}
                  keyTimes="0;0.018;0.045;1"
                  dur={`${RADAR_SWEEP_DURATION_SEC}s`}
                  begin={radarBranchSweepDelay(branchIndex, count)}
                  repeatCount="indefinite"
                  calcMode="linear"
                />
              ) : null}
            </text>
          ))}
        </svg>
      </div>

      <div className="ceo-radar-legend-wrap" aria-label="Corporate health branch status">
        <div className="ceo-radar-legend">
          {geometry.map((entry) => (
            <div
              key={`${entry.axis.key}-legend`}
              className={`ceo-radar-legend-item ${entry.calculable ? '' : 'is-missing'}`.trim()}
            >
              <span className="ceo-radar-legend-label">
                <span
                  className="ceo-radar-swatch"
                  style={{ background: entry.tone, color: entry.tone }}
                  aria-hidden="true"
                />
                <span>{radarLegendLabel(entry.axis)}</span>
              </span>
              <span className="ceo-radar-legend-values">
                <strong>{entry.calculable ? `${entry.score}%` : 'N/A'}</strong>
                <small>{radarStatusLabel(entry.axis, entry.calculable)}</small>
              </span>
            </div>
          ))}
        </div>
        {missingCount > 0 ? (
          <p className="ceo-radar-incomplete-note">
            Some branches require additional inputs before a complete executive posture can be shown.
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default CorporateHealthRadar;
