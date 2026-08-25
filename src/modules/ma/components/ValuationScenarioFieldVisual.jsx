import React from 'react';

/**
 * Executive signal graphic — hero decor for /ma/valuation.
 *
 * Abstract, atmospheric financial visual (NOT a literal data chart):
 * faint volume bars in the background, one luminous ascending teal signal
 * line with a light that travels along it, secondary flowing traces, a soft
 * pulsing flare + expanding ring at the focal node, and drifting particles.
 * An internal radial mask dissolves the whole thing softly into the hero
 * background on every edge so it never competes with the copy. SVG/CSS only.
 * Motion is defined in CSS and disabled under prefers-reduced-motion.
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
          {/* Soft edge dissolve — solid core biased up-right so the graphic
              stays present but dissolves toward the left/bottom text column */}
          <radialGradient id="ma-val-signal-fade" cx="66%" cy="42%" r="80%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="52%" stopColor="white" stopOpacity="1" />
            <stop offset="80%" stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="ma-val-signal-mask">
            <rect x="0" y="0" width="640" height="360" fill="url(#ma-val-signal-fade)" />
          </mask>

          {/* Vertical volume bars: whisper-faint teal in the deep background */}
          <linearGradient id="ma-val-signal-bar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(45, 212, 191, 0.13)" />
            <stop offset="100%" stopColor="rgba(45, 212, 191, 0)" />
          </linearGradient>

          {/* Main signal line: dim on the left, luminous toward the upside */}
          <linearGradient id="ma-val-signal-line" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(45, 212, 191, 0.42)" />
            <stop offset="52%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#aaf7e8" />
          </linearGradient>

          {/* Area under the main line */}
          <linearGradient id="ma-val-signal-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(45, 212, 191, 0.26)" />
            <stop offset="100%" stopColor="rgba(45, 212, 191, 0)" />
          </linearGradient>

          {/* Focal glow pool */}
          <radialGradient id="ma-val-signal-pool" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(94, 234, 212, 0.38)" />
            <stop offset="100%" stopColor="rgba(94, 234, 212, 0)" />
          </radialGradient>

          <filter id="ma-val-signal-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ma-val-signal-soft" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        <g mask="url(#ma-val-signal-mask)">
          {/* Faint volume bars in the background */}
          <g className="ma-val-scenario-bars" opacity="0.44" fill="url(#ma-val-signal-bar)">
            <rect x="64" y="232" width="10" height="88" rx="3" />
            <rect x="96" y="206" width="10" height="114" rx="3" />
            <rect x="128" y="220" width="10" height="100" rx="3" />
            <rect x="160" y="186" width="10" height="134" rx="3" />
            <rect x="192" y="198" width="10" height="122" rx="3" />
            <rect x="224" y="164" width="10" height="156" rx="3" />
            <rect x="256" y="178" width="10" height="142" rx="3" />
            <rect x="288" y="144" width="10" height="176" rx="3" />
            <rect x="320" y="158" width="10" height="162" rx="3" />
            <rect x="352" y="126" width="10" height="194" rx="3" />
            <rect x="384" y="140" width="10" height="180" rx="3" />
            <rect x="416" y="108" width="10" height="212" rx="3" />
            <rect x="448" y="122" width="10" height="198" rx="3" />
            <rect x="480" y="92" width="10" height="228" rx="3" />
            <rect x="512" y="106" width="10" height="214" rx="3" />
            <rect x="544" y="78" width="10" height="242" rx="3" />
            <rect x="576" y="96" width="10" height="224" rx="3" />
          </g>

          {/* Soft atmospheric bruma sweeping through the mid-field (no grid, no axes) */}
          <ellipse
            cx="360"
            cy="196"
            rx="300"
            ry="120"
            fill="rgba(45, 212, 191, 0.05)"
            filter="url(#ma-val-signal-soft)"
          />

          {/* Soft light pool near the focal node (pulsing flare) */}
          <circle
            className="ma-val-signal-flare"
            cx="506"
            cy="128"
            r="172"
            fill="url(#ma-val-signal-pool)"
            opacity="0.92"
          />

          {/* Area under the main signal line */}
          <path
            d="M 56 300 C 176 282, 258 236, 340 198 S 520 120, 600 96 L 600 320 L 56 320 Z"
            fill="url(#ma-val-signal-area)"
            opacity="0.9"
          />

          {/* Secondary flowing traces (implicit momentum) */}
          <path
            className="ma-val-scenario-curve ma-val-signal-flow ma-val-signal-flow-slow"
            d="M 56 312 C 180 300, 262 262, 348 224 S 528 150, 604 122"
            stroke="rgba(45, 212, 191, 0.22)"
            strokeWidth="1.3"
            strokeLinecap="round"
            fill="none"
            opacity="0.55"
          />
          <path
            className="ma-val-scenario-curve ma-val-signal-flow ma-val-signal-flow-slow"
            d="M 56 288 C 168 266, 250 220, 336 182 S 520 104, 600 78"
            stroke="rgba(94, 234, 212, 0.38)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeDasharray="5 11"
            fill="none"
            opacity="0.7"
          />
          <path
            className="ma-val-scenario-curve ma-val-signal-flow"
            d="M 56 276 C 168 250, 250 196, 336 156 S 520 78, 600 54"
            stroke="rgba(125, 243, 224, 0.6)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="7 9"
            fill="none"
            opacity="0.8"
          />

          {/* Main luminous ascending signal line */}
          <path
            className="ma-val-scenario-curve ma-val-scenario-curve-base"
            d="M 56 300 C 176 282, 258 236, 340 198 S 520 120, 600 96"
            stroke="url(#ma-val-signal-line)"
            strokeWidth="4.9"
            strokeLinecap="round"
            fill="none"
            filter="url(#ma-val-signal-glow)"
          />

          {/* Light travelling up the main line (movement) */}
          <path
            className="ma-val-signal-trail"
            d="M 56 300 C 176 282, 258 236, 340 198 S 520 120, 600 96"
            stroke="#ccfbf1"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="22 620"
            filter="url(#ma-val-signal-glow)"
            opacity="0.9"
          />

          {/* Discrete glowing nodes on the main line */}
          <g filter="url(#ma-val-signal-glow)">
            <circle cx="230" cy="250" r="3.4" fill="#2dd4bf" opacity="0.8" />
            <circle cx="340" cy="198" r="4" fill="#5eead4" opacity="0.9" />
            <circle
              className="ma-val-scenario-node-focal"
              cx="506"
              cy="128"
              r="5.6"
              fill="#ccfbf1"
            />
          </g>

          {/* Expanding pulse ring at the focal node */}
          <circle
            className="ma-val-signal-ring"
            cx="506"
            cy="128"
            r="9"
            fill="none"
            stroke="rgba(204, 251, 241, 0.45)"
            strokeWidth="1"
          />

          {/* Sparse drifting particle light */}
          <g className="ma-val-signal-drift">
            <circle cx="150" cy="120" r="1.3" fill="#5eead4" opacity="0.5" />
            <circle cx="392" cy="92" r="1.3" fill="#99f6e4" opacity="0.55" />
            <circle cx="556" cy="150" r="1.2" fill="#2dd4bf" opacity="0.45" />
            <circle cx="286" cy="286" r="1.2" fill="#2dd4bf" opacity="0.35" />
          </g>
        </g>
      </svg>
    </div>
  );
}
