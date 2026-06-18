import React from 'react';

/**
 * C.24.14C-CEO — Executive Intelligence Core (decorative atmosphere).
 * Non-interactive layers: neural field, sovereign orbitals, signal beam, core pulse.
 */
export function ExecutiveIntelligenceField({ className = '' }) {
  return (
    <div
      className={`ceo-intelligence-core ceo-intelligence-field ${className}`.trim()}
      aria-hidden="true"
    >
      <div className="ceo-intelligence-core-obsidian" />
      <div className="ceo-intelligence-core-beam" />

      <svg
        className="ceo-intelligence-core-orbitals"
        viewBox="0 0 1200 520"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <g className="ceo-intelligence-core-orbit-group">
          <ellipse
            cx="900"
            cy="248"
            rx="248"
            ry="196"
            fill="none"
            stroke="rgba(245, 197, 92, 0.11)"
            strokeWidth="0.75"
            strokeDasharray="4 14"
          />
          <ellipse
            cx="900"
            cy="248"
            rx="188"
            ry="148"
            fill="none"
            stroke="rgba(212, 175, 55, 0.14)"
            strokeWidth="0.65"
          />
          <ellipse
            cx="900"
            cy="248"
            rx="124"
            ry="96"
            fill="none"
            stroke="rgba(243, 218, 138, 0.16)"
            strokeWidth="0.55"
            strokeDasharray="2 10"
          />
          <circle
            cx="900"
            cy="248"
            r="42"
            fill="none"
            stroke="rgba(245, 197, 92, 0.2)"
            strokeWidth="0.5"
          />
        </g>
      </svg>

      <svg
        className="ceo-intelligence-core-neural ceo-intelligence-field-network"
        viewBox="0 0 1200 520"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <defs>
          <radialGradient id="ceoIntelCoreNode" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(243, 218, 138, 0.62)" />
            <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
          </radialGradient>
          <linearGradient id="ceoIntelCoreLink" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(212, 175, 55, 0)" />
            <stop offset="38%" stopColor="rgba(245, 197, 92, 0.26)" />
            <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
          </linearGradient>
          <radialGradient id="ceoIntelCoreHub" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(245, 197, 92, 0.34)" />
            <stop offset="55%" stopColor="rgba(212, 175, 55, 0.12)" />
            <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
          </radialGradient>
        </defs>

        <g className="ceo-intelligence-core-mesh" opacity="0.44">
          <path
            d="M 96 108 L 248 156 L 412 128 L 588 168 L 748 132 L 900 248"
            fill="none"
            stroke="url(#ceoIntelCoreLink)"
            strokeWidth="0.7"
          />
          <path
            d="M 72 268 L 228 236 L 392 284 L 548 252 L 724 296 L 900 248"
            fill="none"
            stroke="url(#ceoIntelCoreLink)"
            strokeWidth="0.65"
          />
          <path
            d="M 148 392 L 312 348 L 468 388 L 632 352 L 792 328 L 900 248"
            fill="none"
            stroke="url(#ceoIntelCoreLink)"
            strokeWidth="0.6"
          />
          <path d="M 248 156 L 392 284" stroke="rgba(245, 197, 92, 0.1)" strokeWidth="0.45" fill="none" />
          <path d="M 412 128 L 548 252" stroke="rgba(245, 197, 92, 0.09)" strokeWidth="0.45" fill="none" />
          <path d="M 588 168 L 724 296" stroke="rgba(245, 197, 92, 0.09)" strokeWidth="0.45" fill="none" />
          <path d="M 312 348 L 468 388" stroke="rgba(212, 175, 55, 0.08)" strokeWidth="0.4" fill="none" />
          <path d="M 748 132 L 792 328" stroke="rgba(212, 175, 55, 0.08)" strokeWidth="0.4" fill="none" />
        </g>

        <g className="ceo-intelligence-core-nodes" fill="url(#ceoIntelCoreNode)">
          <circle cx="96" cy="108" r="2.1" />
          <circle cx="248" cy="156" r="2.3" />
          <circle cx="412" cy="128" r="2" />
          <circle cx="588" cy="168" r="2.4" />
          <circle cx="748" cy="132" r="2.1" />
          <circle cx="72" cy="268" r="1.9" />
          <circle cx="228" cy="236" r="2.2" />
          <circle cx="392" cy="284" r="2" />
          <circle cx="548" cy="252" r="2.3" />
          <circle cx="724" cy="296" r="2.1" />
          <circle cx="148" cy="392" r="1.8" />
          <circle cx="312" cy="348" r="2" />
          <circle cx="468" cy="388" r="2.2" />
          <circle cx="632" cy="352" r="1.9" />
          <circle cx="792" cy="328" r="2.1" />
        </g>

        <circle
          className="ceo-intelligence-core-hub"
          cx="900"
          cy="248"
          r="18"
          fill="url(#ceoIntelCoreHub)"
        />
        <circle
          className="ceo-intelligence-core-hub-ring"
          cx="900"
          cy="248"
          r="28"
          fill="none"
          stroke="rgba(245, 197, 92, 0.22)"
          strokeWidth="0.7"
        />
      </svg>

      <div className="ceo-intelligence-core-pulse" />
      <div className="ceo-intelligence-field-scan ceo-intelligence-core-sheen" />
      <div className="ceo-intelligence-field-vignette ceo-intelligence-core-vignette" />
    </div>
  );
}

export default ExecutiveIntelligenceField;
