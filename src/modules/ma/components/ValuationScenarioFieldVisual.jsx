import React from 'react';

/**
 * Financial Valuation Scenario Field — hero decor for /ma/valuation.
 * Abstract upside / base / downside curves. Not a data chart. SVG/CSS only.
 */
export function ValuationScenarioFieldVisual() {
  return (
    <div className="ma-val-scenario-field" aria-hidden="true">
      <div className="ma-val-scenario-field-vignette" />
      <svg
        className="ma-val-scenario-field-svg"
        viewBox="0 0 640 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ma-val-scenario-grid-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="100%" stopColor="white" stopOpacity="0.15" />
          </linearGradient>
          <mask id="ma-val-scenario-mask">
            <rect x="0" y="0" width="640" height="360" fill="url(#ma-val-scenario-grid-fade)" />
          </mask>
          <linearGradient id="ma-val-curve-upside-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(94, 234, 212, 0.16)" />
            <stop offset="100%" stopColor="rgba(45, 212, 191, 0)" />
          </linearGradient>
          <linearGradient id="ma-val-curve-base-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(45, 212, 191, 0.22)" />
            <stop offset="100%" stopColor="rgba(45, 212, 191, 0)" />
          </linearGradient>
          <linearGradient id="ma-val-curve-down-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(148, 163, 184, 0.08)" />
            <stop offset="100%" stopColor="rgba(148, 163, 184, 0)" />
          </linearGradient>
          <filter id="ma-val-scenario-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Subtle volume bars */}
        <g className="ma-val-scenario-bars" opacity="0.78">
          <rect x="52" y="248" width="14" height="72" rx="2" fill="rgba(45, 212, 191, 0.09)" />
          <rect x="78" y="220" width="14" height="100" rx="2" fill="rgba(45, 212, 191, 0.11)" />
          <rect x="104" y="196" width="14" height="124" rx="2" fill="rgba(45, 212, 191, 0.08)" />
          <rect x="130" y="210" width="14" height="110" rx="2" fill="rgba(45, 212, 191, 0.09)" />
          <rect x="156" y="178" width="14" height="142" rx="2" fill="rgba(45, 212, 191, 0.12)" />
          <rect x="182" y="164" width="14" height="156" rx="2" fill="rgba(45, 212, 191, 0.11)" />
          <rect x="208" y="188" width="14" height="132" rx="2" fill="rgba(45, 212, 191, 0.08)" />
          <rect x="234" y="152" width="14" height="168" rx="2" fill="rgba(45, 212, 191, 0.13)" />
          <rect x="260" y="138" width="14" height="182" rx="2" fill="rgba(45, 212, 191, 0.12)" />
          <rect x="286" y="160" width="14" height="160" rx="2" fill="rgba(45, 212, 191, 0.09)" />
          <rect x="312" y="128" width="14" height="192" rx="2" fill="rgba(45, 212, 191, 0.14)" />
          <rect x="338" y="112" width="14" height="208" rx="2" fill="rgba(45, 212, 191, 0.13)" />
          <rect x="364" y="136" width="14" height="184" rx="2" fill="rgba(45, 212, 191, 0.1)" />
          <rect x="390" y="104" width="14" height="216" rx="2" fill="rgba(45, 212, 191, 0.15)" />
          <rect x="416" y="92" width="14" height="228" rx="2" fill="rgba(45, 212, 191, 0.14)" />
          <rect x="442" y="118" width="14" height="202" rx="2" fill="rgba(45, 212, 191, 0.11)" />
          <rect x="468" y="86" width="14" height="234" rx="2" fill="rgba(45, 212, 191, 0.16)" />
          <rect x="494" y="72" width="14" height="248" rx="2" fill="rgba(45, 212, 191, 0.15)" />
          <rect x="520" y="98" width="14" height="222" rx="2" fill="rgba(45, 212, 191, 0.12)" />
          <rect x="546" y="68" width="14" height="252" rx="2" fill="rgba(45, 212, 191, 0.17)" />
        </g>

        {/* Grid */}
        <g mask="url(#ma-val-scenario-mask)" opacity="0.68" stroke="rgba(45, 212, 191, 0.1)" strokeWidth="0.85">
          <line x1="40" y1="60" x2="600" y2="60" />
          <line x1="40" y1="120" x2="600" y2="120" />
          <line x1="40" y1="180" x2="600" y2="180" />
          <line x1="40" y1="240" x2="600" y2="240" />
          <line x1="40" y1="300" x2="600" y2="300" />
          <line x1="100" y1="40" x2="100" y2="320" />
          <line x1="200" y1="40" x2="200" y2="320" />
          <line x1="300" y1="40" x2="300" y2="320" />
          <line x1="400" y1="40" x2="400" y2="320" />
          <line x1="500" y1="40" x2="500" y2="320" />
        </g>

        {/* Downside scenario */}
        <path
          className="ma-val-scenario-curve ma-val-scenario-curve-down"
          d="M 48 268 C 140 262, 220 256, 320 248 S 520 230, 592 222"
          stroke="rgba(148, 163, 184, 0.52)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M 48 268 C 140 262, 220 256, 320 248 S 520 230, 592 222 L 592 320 L 48 320 Z"
          fill="url(#ma-val-curve-down-fill)"
          opacity="0.6"
        />

        {/* Base case — primary focal curve */}
        <path
          className="ma-val-scenario-curve ma-val-scenario-curve-base"
          d="M 48 248 C 130 236, 210 210, 300 188 S 480 148, 592 118"
          stroke="#2dd4bf"
          strokeWidth="3.1"
          strokeLinecap="round"
          filter="url(#ma-val-scenario-glow)"
        />
        <path
          d="M 48 248 C 130 236, 210 210, 300 188 S 480 148, 592 118 L 592 320 L 48 320 Z"
          fill="url(#ma-val-curve-base-fill)"
          opacity="0.85"
        />

        {/* Upside scenario */}
        <path
          className="ma-val-scenario-curve ma-val-scenario-curve-upside"
          d="M 48 228 C 120 200, 200 160, 290 128 S 470 72, 592 48"
          stroke="#5eead4"
          strokeWidth="2.35"
          strokeLinecap="round"
          strokeDasharray="6 4"
        />
        <path
          d="M 48 228 C 120 200, 200 160, 290 128 S 470 72, 592 48 L 592 320 L 48 320 Z"
          fill="url(#ma-val-curve-upside-fill)"
          opacity="0.55"
        />

        {/* Gold reference horizon — micro accent */}
        <line
          x1="48"
          y1="188"
          x2="592"
          y2="188"
          stroke="rgba(212, 175, 55, 0.18)"
          strokeWidth="0.75"
          strokeDasharray="2 6"
        />

        {/* Scenario nodes on base curve */}
        <g className="ma-val-scenario-nodes" filter="url(#ma-val-scenario-glow)">
          <circle className="ma-val-scenario-node" cx="156" cy="218" r="3" fill="#2dd4bf" opacity="0.75" />
          <circle className="ma-val-scenario-node" cx="300" cy="188" r="3.5" fill="#5eead4" />
          <circle className="ma-val-scenario-node ma-val-scenario-node-focal" cx="468" cy="134" r="4.5" fill="#ccfbf1" />
          <circle cx="468" cy="134" r="8" fill="rgba(212, 175, 55, 0.12)" stroke="rgba(212, 175, 55, 0.28)" strokeWidth="0.75" />
        </g>

        {/* Particle lattice */}
        <g opacity="0.65">
          <circle cx="88" cy="92" r="1.5" fill="#5eead4" opacity="0.5" />
          <circle cx="224" cy="72" r="1.5" fill="#2dd4bf" opacity="0.45" />
          <circle cx="380" cy="58" r="1.5" fill="#99f6e4" opacity="0.55" />
          <circle cx="528" cy="84" r="1.5" fill="#5eead4" opacity="0.5" />
          <circle cx="132" cy="148" r="1.2" fill="#2dd4bf" opacity="0.4" />
          <circle cx="420" cy="200" r="1.2" fill="#2dd4bf" opacity="0.35" />
        </g>

        {/* Scenario labels */}
        <g className="ma-val-scenario-labels" fontFamily="system-ui, sans-serif">
          <g className="ma-val-scenario-label ma-val-scenario-label-upside">
            <rect x="502" y="36" width="78" height="22" rx="11" fill="rgba(94, 234, 212, 0.08)" stroke="rgba(94, 234, 212, 0.22)" strokeWidth="0.75" />
            <text x="541" y="51" fill="rgba(94, 234, 212, 0.96)" fontSize="10" fontWeight="700" letterSpacing="0.12em" textAnchor="middle">UPSIDE</text>
          </g>
          <g className="ma-val-scenario-label ma-val-scenario-label-base">
            <rect x="502" y="102" width="92" height="22" rx="11" fill="rgba(45, 212, 191, 0.12)" stroke="rgba(45, 212, 191, 0.32)" strokeWidth="0.85" />
            <text x="548" y="117" fill="#5eead4" fontSize="10" fontWeight="700" letterSpacing="0.1em" textAnchor="middle">BASE CASE</text>
          </g>
          <g className="ma-val-scenario-label ma-val-scenario-label-down">
            <rect x="502" y="212" width="88" height="22" rx="11" fill="rgba(148, 163, 184, 0.06)" stroke="rgba(148, 163, 184, 0.18)" strokeWidth="0.75" />
            <text x="546" y="227" fill="rgba(203, 213, 225, 0.86)" fontSize="10" fontWeight="700" letterSpacing="0.1em" textAnchor="middle">DOWNSIDE</text>
          </g>
        </g>

        {/* Valuation engine caption */}
        <text x="48" y="344" fill="rgba(148, 163, 184, 0.55)" fontSize="8.5" fontWeight="600" letterSpacing="0.14em" fontFamily="system-ui, sans-serif">
          SCENARIO FIELD · INDICATIVE DSS · NOT A DATA CHART
        </text>
      </svg>
    </div>
  );
}
