import React from 'react';

const CEO_LION_MARK_SRC = '/brand/ceos-lion-mark.png';

/**
 * C.24.14C-CEO — Sovereign Executive Core with premium lion emblem.
 * Orbital rings + neural mesh frame a circular executive medallion (lion center).
 * Decorative only; non-interactive.
 */
export function SovereignExecutiveCore({ className = '' }) {
  return (
    <div className={`ceo-sovereign-executive-core ${className}`.trim()} aria-hidden="true">
      <svg
        className="ceo-sovereign-core-svg"
        viewBox="0 0 320 320"
        focusable="false"
        role="presentation"
      >
        <defs>
          <radialGradient id="ceoSovCoreGlow" cx="50%" cy="46%" r="52%">
            <stop offset="0%" stopColor="rgba(243, 218, 138, 0.34)" />
            <stop offset="48%" stopColor="rgba(212, 175, 55, 0.12)" />
            <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
          </radialGradient>
        </defs>

        <circle cx="160" cy="160" r="148" fill="url(#ceoSovCoreGlow)" opacity="0.68" />

        <g className="ceo-sovereign-core-orbit ceo-sovereign-core-orbit--ultra">
          <ellipse
            cx="160"
            cy="160"
            rx="142"
            ry="126"
            fill="none"
            stroke="rgba(212, 175, 55, 0.08)"
            strokeWidth="0.55"
            strokeDasharray="1 18"
          />
        </g>
        <g className="ceo-sovereign-core-orbit ceo-sovereign-core-orbit--outer">
          <ellipse
            cx="160"
            cy="160"
            rx="132"
            ry="118"
            fill="none"
            stroke="rgba(245, 197, 92, 0.12)"
            strokeWidth="0.75"
            strokeDasharray="3 16"
          />
        </g>
        <g className="ceo-sovereign-core-orbit ceo-sovereign-core-orbit--mid">
          <ellipse
            cx="160"
            cy="160"
            rx="108"
            ry="96"
            fill="none"
            stroke="rgba(212, 175, 55, 0.15)"
            strokeWidth="0.65"
          />
        </g>
        <g className="ceo-sovereign-core-orbit ceo-sovereign-core-orbit--inner">
          <circle
            cx="160"
            cy="160"
            r="78"
            fill="none"
            stroke="rgba(243, 218, 138, 0.17)"
            strokeWidth="0.6"
            strokeDasharray="2 9"
          />
        </g>

        <g className="ceo-sovereign-core-mesh" opacity="0.46" stroke="rgba(245, 197, 92, 0.14)" strokeWidth="0.48" fill="none">
          <path d="M 160 42 L 218 88 L 218 168 L 160 214 L 102 168 L 102 88 Z" />
          <path d="M 160 42 L 160 214" opacity="0.65" />
          <path d="M 102 88 L 218 168" opacity="0.5" />
          <path d="M 218 88 L 102 168" opacity="0.5" />
          <path d="M 160 42 L 160 160" opacity="0.38" />
          <path d="M 218 88 L 160 160" opacity="0.32" />
          <path d="M 102 88 L 160 160" opacity="0.32" />
          <path d="M 218 168 L 160 160" opacity="0.32" />
          <path d="M 102 168 L 160 160" opacity="0.32" />
          <path d="M 160 214 L 160 160" opacity="0.38" />
        </g>

        <g className="ceo-sovereign-core-nodes" fill="rgba(243, 218, 138, 0.62)">
          <circle cx="160" cy="42" r="2" />
          <circle cx="218" cy="88" r="1.8" />
          <circle cx="218" cy="168" r="1.9" />
          <circle cx="160" cy="214" r="2" />
          <circle cx="102" cy="168" r="1.8" />
          <circle cx="102" cy="88" r="1.9" />
        </g>

        <circle
          className="ceo-sovereign-core-medallion-ring"
          cx="160"
          cy="160"
          r="82"
          fill="transparent"
          stroke="rgba(245, 197, 92, 0.28)"
          strokeWidth="1.15"
        />
        <circle
          cx="160"
          cy="160"
          r="76"
          fill="none"
          stroke="rgba(212, 175, 55, 0.16)"
          strokeWidth="0.7"
        />

        <circle
          className="ceo-sovereign-core-pulse-ring"
          cx="160"
          cy="160"
          r="54"
          fill="none"
          stroke="rgba(245, 197, 92, 0.14)"
          strokeWidth="0.65"
        />
      </svg>

      <div className="ceo-sovereign-lion-halo" />
      <div className="ceo-sovereign-lion-medallion">
        <img
          className="ceo-sovereign-lion-mark"
          src={CEO_LION_MARK_SRC}
          alt=""
          width={260}
          height={260}
          decoding="async"
        />
      </div>

      <div className="ceo-sovereign-core-pulse-aura" />
    </div>
  );
}

export default SovereignExecutiveCore;
