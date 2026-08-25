import React from 'react';

/**
 * Decorative valuation waterfall stack — distinct from dashboard globe.
 * Abstract EV → net debt → equity → proceeds layers. SVG/CSS only.
 */
export function ValuationStackVisual() {
  return (
    <div className="ma-val-ref-stack-visual" aria-hidden="true">
      <svg
        className="ma-val-ref-stack-svg"
        viewBox="0 0 520 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ma-val-stack-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(45, 212, 191, 0)" />
            <stop offset="18%" stopColor="rgba(45, 212, 191, 0.35)" />
            <stop offset="82%" stopColor="rgba(45, 212, 191, 0.35)" />
            <stop offset="100%" stopColor="rgba(45, 212, 191, 0)" />
          </linearGradient>
          <linearGradient id="ma-val-stack-fill-a" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(45, 212, 191, 0.14)" />
            <stop offset="100%" stopColor="rgba(45, 212, 191, 0.02)" />
          </linearGradient>
          <linearGradient id="ma-val-stack-fill-b" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(94, 234, 212, 0.1)" />
            <stop offset="100%" stopColor="rgba(45, 212, 191, 0.015)" />
          </linearGradient>
          <filter id="ma-val-stack-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Baseline grid — calculation engine feel */}
        <g opacity="0.35" stroke="rgba(45, 212, 191, 0.08)" strokeWidth="0.75">
          <line x1="48" y1="48" x2="472" y2="48" />
          <line x1="48" y1="108" x2="472" y2="108" />
          <line x1="48" y1="168" x2="472" y2="168" />
          <line x1="48" y1="228" x2="472" y2="228" />
          <line x1="48" y1="288" x2="472" y2="288" />
          <line x1="120" y1="32" x2="120" y2="304" />
          <line x1="260" y1="32" x2="260" y2="304" />
          <line x1="400" y1="32" x2="400" y2="304" />
        </g>

        {/* Waterfall connector spine */}
        <path
          d="M 88 72 L 88 248 M 88 248 L 432 248"
          stroke="url(#ma-val-stack-line)"
          strokeWidth="1.25"
          strokeLinecap="round"
        />

        {/* Layer 01 — Enterprise value (widest) */}
        <g className="ma-val-stack-layer ma-val-stack-layer-1">
          <rect x="72" y="56" width="320" height="44" rx="6" fill="url(#ma-val-stack-fill-a)" stroke="rgba(45, 212, 191, 0.22)" strokeWidth="0.85" />
          <line x1="88" y1="78" x2="376" y2="78" stroke="rgba(94, 234, 212, 0.18)" strokeWidth="0.65" />
          <circle cx="104" cy="78" r="2.5" fill="#5eead4" opacity="0.85" />
          <circle cx="200" cy="78" r="2" fill="#2dd4bf" opacity="0.7" />
          <circle cx="296" cy="78" r="2.5" fill="#5eead4" opacity="0.85" />
          <text x="104" y="68" fill="rgba(148, 163, 184, 0.75)" fontSize="9" fontWeight="600" letterSpacing="0.14em">ENTERPRISE VALUE</text>
        </g>

        {/* Layer 02 — Net debt adjustment */}
        <g className="ma-val-stack-layer ma-val-stack-layer-2">
          <rect x="108" y="118" width="248" height="38" rx="6" fill="url(#ma-val-stack-fill-b)" stroke="rgba(45, 212, 191, 0.16)" strokeWidth="0.75" />
          <line x1="124" y1="137" x2="340" y2="137" stroke="rgba(94, 234, 212, 0.14)" strokeWidth="0.6" />
          <circle cx="140" cy="137" r="2" fill="#2dd4bf" opacity="0.65" />
          <circle cx="260" cy="137" r="2" fill="#2dd4bf" opacity="0.65" />
          <text x="124" y="128" fill="rgba(148, 163, 184, 0.7)" fontSize="8.5" fontWeight="600" letterSpacing="0.12em">NET DEBT BRIDGE</text>
        </g>

        {/* Layer 03 — Adjusted equity */}
        <g className="ma-val-stack-layer ma-val-stack-layer-3">
          <rect x="144" y="174" width="176" height="36" rx="6" fill="rgba(45, 212, 191, 0.06)" stroke="rgba(45, 212, 191, 0.2)" strokeWidth="0.85" />
          <line x1="160" y1="192" x2="304" y2="192" stroke="rgba(94, 234, 212, 0.2)" strokeWidth="0.7" />
          <circle cx="176" cy="192" r="2.2" fill="#99f6e4" opacity="0.8" />
          <circle cx="232" cy="192" r="2.2" fill="#5eead4" opacity="0.85" />
          <circle cx="288" cy="192" r="2.2" fill="#99f6e4" opacity="0.8" />
          <text x="160" y="184" fill="rgba(148, 163, 184, 0.72)" fontSize="8.5" fontWeight="600" letterSpacing="0.12em">ADJUSTED EQUITY</text>
        </g>

        {/* Layer 04 — Net proceeds (narrowest focal) */}
        <g className="ma-val-stack-layer ma-val-stack-layer-4" filter="url(#ma-val-stack-soft)">
          <rect x="180" y="228" width="104" height="32" rx="6" fill="rgba(45, 212, 191, 0.1)" stroke="rgba(94, 234, 212, 0.28)" strokeWidth="1" />
          <line x1="196" y1="244" x2="268" y2="244" stroke="rgba(204, 251, 241, 0.35)" strokeWidth="0.75" />
          <circle cx="232" cy="244" r="3" fill="#ccfbf1" opacity="0.9" />
          <text x="196" y="238" fill="rgba(94, 234, 212, 0.85)" fontSize="8" fontWeight="700" letterSpacing="0.1em">PROCEEDS</text>
        </g>

        {/* Right-side calculation nodes — multiples lattice */}
        <g className="ma-val-stack-nodes" opacity="0.88">
          <path d="M 360 72 L 420 56 L 448 88 L 400 108 L 360 72" stroke="rgba(45, 212, 191, 0.2)" strokeWidth="0.75" fill="rgba(45, 212, 191, 0.04)" />
          <circle cx="404" cy="82" r="2.5" fill="#5eead4" />
          <circle cx="432" cy="72" r="2" fill="#2dd4bf" opacity="0.75" />
          <circle cx="376" cy="96" r="2" fill="#2dd4bf" opacity="0.75" />

          <path d="M 388 148 L 448 132 L 468 168 L 420 188 L 388 148" stroke="rgba(45, 212, 191, 0.16)" strokeWidth="0.7" fill="rgba(45, 212, 191, 0.03)" />
          <circle cx="428" cy="160" r="2" fill="#5eead4" opacity="0.8" />

          <path d="M 400 208 L 456 196 L 472 232 L 424 252 L 400 208" stroke="rgba(45, 212, 191, 0.14)" strokeWidth="0.65" fill="rgba(45, 212, 191, 0.025)" />
          <circle cx="436" cy="224" r="2.2" fill="#99f6e4" opacity="0.75" />
        </g>

        {/* Vertical flow markers */}
        <g stroke="rgba(45, 212, 191, 0.25)" strokeWidth="0.75" strokeDasharray="3 4">
          <line x1="88" y1="100" x2="88" y2="118" />
          <line x1="88" y1="156" x2="88" y2="174" />
          <line x1="88" y1="210" x2="88" y2="228" />
        </g>

        {/* Subtle scan line accent */}
        <rect className="ma-val-stack-scan" x="72" y="56" width="320" height="1.5" rx="1" fill="rgba(94, 234, 212, 0.25)" opacity="0.6" />
      </svg>
    </div>
  );
}
