import React from 'react';
import '../styles/maScoreRing.css';

/** Canonical Executive Signal ring geometry — scale from Dashboard oracle (224px). */
export const MA_SCORE_RING_BASE_SIZE = 224;
export const MA_SCORE_RING_BASE_RADIUS = 100;

export function getScoreRingGeometry(size = MA_SCORE_RING_BASE_SIZE) {
  const scale = size / MA_SCORE_RING_BASE_SIZE;
  const cx = size / 2;
  const r = MA_SCORE_RING_BASE_RADIUS * scale;
  const stroke = 16 * scale;
  return {
    size,
    cx,
    r,
    stroke,
    scale,
    circumference: 2 * Math.PI * r,
    coreSize: 188 * scale
  };
}

const GRADIENT_NS = {
  executive: 'ma-ref-ring',
  repository: 'ma-repo-ring'
};

/**
 * M&A premium score ring — SVG annular track + active arc (Dashboard Executive Signal family).
 * Visual only; does not compute business scores.
 */
export function MAScoreRing({
  value = null,
  size = MA_SCORE_RING_BASE_SIZE,
  variant = 'executive',
  showDenom = false,
  ringClassName = 'ma-score-ring',
  svgClassName = 'ma-score-ring-svg',
  coreClassName = 'ma-score-ring-core',
  figureClassName = 'ma-score-ring-figure',
  denomClassName = 'ma-score-ring-denom',
  emptyClassName = 'is-empty-score',
  figureAs: FigureTag = 'span',
  style,
  'aria-hidden': ariaHidden = true
}) {
  const geom = getScoreRingGeometry(size);
  const idPrefix = GRADIENT_NS[variant] || GRADIENT_NS.executive;
  const hasScore = value !== null && Number.isFinite(Number(value));
  const scorePct = hasScore ? Math.max(0, Math.min(100, Number(value))) : 0;
  const ringActiveLength = (scorePct / 100) * geom.circumference;
  const displayValue = hasScore ? Math.round(Number(value)) : '—';

  return (
    <div
      className={[ringClassName, `ma-score-ring--${variant}`].filter(Boolean).join(' ')}
      style={{
        '--ma-ref-score-pct': scorePct,
        '--ma-score-ring-size': `${geom.size}px`,
        '--ma-score-ring-scale': geom.scale,
        '--ma-score-ring-core-size': `${geom.coreSize}px`,
        ...style
      }}
      aria-hidden={ariaHidden}
    >
      <svg
        className={svgClassName}
        viewBox={`0 0 ${geom.size} ${geom.size}`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`${idPrefix}-active-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5eead4" />
            <stop offset="55%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
          <linearGradient id={`${idPrefix}-track-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(94, 234, 212, 0.18)" />
            <stop offset="100%" stopColor="rgba(45, 212, 191, 0.12)" />
          </linearGradient>
          <filter id={`${idPrefix}-glow`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.55" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          className="ma-ref-ring-track-glass"
          cx={geom.cx}
          cy={geom.cx}
          r={geom.r}
          fill="none"
        />
        <circle
          className="ma-ref-ring-track"
          cx={geom.cx}
          cy={geom.cx}
          r={geom.r}
          fill="none"
        />
        <circle
          className="ma-ref-ring-track-edge"
          cx={geom.cx}
          cy={geom.cx}
          r={geom.r}
          fill="none"
        />
        {scorePct > 0 ? (
          <circle
            className="ma-ref-ring-active"
            cx={geom.cx}
            cy={geom.cx}
            r={geom.r}
            fill="none"
            strokeDasharray={`${ringActiveLength} ${geom.circumference - ringActiveLength}`}
            transform={`rotate(-90 ${geom.cx} ${geom.cx})`}
          />
        ) : null}
      </svg>
      <div className={coreClassName}>
        <FigureTag
          className={[figureClassName, !hasScore ? emptyClassName : undefined]
            .filter(Boolean)
            .join(' ')}
        >
          {displayValue}
        </FigureTag>
        {showDenom ? <span className={denomClassName}>/100</span> : null}
      </div>
    </div>
  );
}
