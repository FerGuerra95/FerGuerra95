import React from 'react';

const CEO_LION_MARK_SRC = '/brand/ceos-lion-mark.png';

/**
 * C.24.14C-CEO — Sovereign Executive Core with premium lion emblem.
 * Orbital rings + neural mesh frame a circular executive medallion (lion center).
 * Decorative only; non-interactive. Visual match: richer orbits / glow / nodes.
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
          <radialGradient id="ceoSovCoreGlow" cx="50%" cy="46%" r="38%">
            <stop offset="0%" stopColor="rgba(243, 218, 138, 0.34)" />
            <stop offset="40%" stopColor="rgba(212, 175, 55, 0.12)" />
            <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
          </radialGradient>
          <radialGradient id="ceoSovNodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(243, 218, 138, 0.9)" />
            <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
          </radialGradient>
        </defs>

        <circle cx="160" cy="160" r="108" fill="url(#ceoSovCoreGlow)" opacity="0.58" />

        <g className="ceo-sovereign-core-orbit ceo-sovereign-core-orbit--ultra">
          <ellipse
            cx="160"
            cy="160"
            rx="154"
            ry="138"
            fill="none"
            stroke="rgba(212, 175, 55, 0.34)"
            strokeWidth="0.9"
            strokeDasharray="1 16"
          />
        </g>
        <g className="ceo-sovereign-core-orbit ceo-sovereign-core-orbit--outer">
          <ellipse
            cx="160"
            cy="160"
            rx="136"
            ry="122"
            fill="none"
            stroke="rgba(245, 197, 92, 0.52)"
            strokeWidth="1.15"
            strokeDasharray="3 13"
          />
        </g>
        <g className="ceo-sovereign-core-orbit ceo-sovereign-core-orbit--mid">
          <ellipse
            cx="160"
            cy="160"
            rx="118"
            ry="104"
            fill="none"
            stroke="rgba(212, 175, 55, 0.34)"
            strokeWidth="0.9"
          />
        </g>
        <g className="ceo-sovereign-core-orbit ceo-sovereign-core-orbit--inner">
          <circle
            cx="160"
            cy="160"
            r="92"
            fill="none"
            stroke="rgba(243, 218, 138, 0.4)"
            strokeWidth="0.95"
            strokeDasharray="2 10"
          />
        </g>
        <g className="ceo-sovereign-core-orbit ceo-sovereign-core-orbit--core">
          <circle
            cx="160"
            cy="160"
            r="68"
            fill="none"
            stroke="rgba(245, 197, 92, 0.68)"
            strokeWidth="1.25"
          />
        </g>

        <g className="ceo-sovereign-core-mesh" opacity="0.08" stroke="rgba(245, 197, 92, 0.2)" strokeWidth="0.35" fill="none">
          <path d="M 160 28 L 228 78 L 228 178 L 160 228 L 92 178 L 92 78 Z" />
          <path d="M 160 28 L 160 228" opacity="0.7" />
          <path d="M 92 78 L 228 178" opacity="0.55" />
          <path d="M 228 78 L 92 178" opacity="0.55" />
          <path d="M 160 28 L 160 160" opacity="0.42" />
          <path d="M 228 78 L 160 160" opacity="0.38" />
          <path d="M 92 78 L 160 160" opacity="0.38" />
          <path d="M 228 178 L 160 160" opacity="0.38" />
          <path d="M 92 178 L 160 160" opacity="0.38" />
          <path d="M 160 228 L 160 160" opacity="0.42" />
        </g>

        <g className="ceo-sovereign-core-nodes" fill="url(#ceoSovNodeGlow)">
          <circle cx="160" cy="28" r="2.9" />
          <circle cx="228" cy="78" r="2.5" />
          <circle cx="228" cy="178" r="2.6" />
          <circle cx="160" cy="228" r="2.9" />
          <circle cx="92" cy="178" r="2.5" />
          <circle cx="92" cy="78" r="2.6" />
          <circle cx="296" cy="160" r="2.1" />
          <circle cx="24" cy="160" r="2.1" />
          <circle cx="198" cy="48" r="1.6" />
          <circle cx="122" cy="48" r="1.6" />
          <circle cx="198" cy="208" r="1.5" />
          <circle cx="122" cy="208" r="1.5" />
          <circle cx="160" cy="12" r="1.3" />
          <circle cx="268" cy="108" r="1.2" />
          <circle cx="268" cy="212" r="1.2" />
          <circle cx="52" cy="108" r="1.1" />
          <circle cx="52" cy="212" r="1.1" />
          <circle cx="160" cy="308" r="1.2" />
          <circle cx="184" cy="96" r="1.05" />
          <circle cx="136" cy="96" r="1.05" />
          <circle cx="214" cy="160" r="1.15" />
          <circle cx="106" cy="160" r="1.15" />
          <circle cx="176" cy="224" r="0.95" />
          <circle cx="144" cy="224" r="0.95" />
        </g>

        <circle
          className="ceo-sovereign-core-medallion-ring"
          cx="160"
          cy="160"
          r="84"
          fill="transparent"
          stroke="rgba(245, 197, 92, 0.52)"
          strokeWidth="1.2"
        />
        <circle
          cx="160"
          cy="160"
          r="78"
          fill="none"
          stroke="rgba(212, 175, 55, 0.32)"
          strokeWidth="0.75"
        />

        <circle
          className="ceo-sovereign-core-pulse-ring"
          cx="160"
          cy="160"
          r="56"
          fill="none"
          stroke="rgba(245, 197, 92, 0.26)"
          strokeWidth="0.8"
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
    </div>
  );
}

export default SovereignExecutiveCore;
