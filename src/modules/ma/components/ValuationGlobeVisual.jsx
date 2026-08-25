import React from 'react';

/**
 * Decorative M&A valuation intelligence globe — parity with dashboard hero visual.
 * SVG/CSS only; aria-hidden; no external assets.
 */
export function ValuationGlobeVisual() {
  return (
    <div className="ma-val-ref-scene-globe">
      <div className="ma-val-ref-globe-flare" aria-hidden="true" />
      <div className="ma-val-ref-globe-halo" aria-hidden="true" />
      <svg className="ma-val-ref-globe-svg" viewBox="0 0 400 400" aria-hidden="true">
        <defs>
          <radialGradient id="ma-val-globe-sphere" cx="38%" cy="34%" r="70%">
            <stop offset="0%" stopColor="rgba(167, 243, 232, 0.16)" />
            <stop offset="42%" stopColor="rgba(45, 212, 191, 0.1)" />
            <stop offset="72%" stopColor="rgba(20, 184, 166, 0.06)" />
            <stop offset="100%" stopColor="rgba(13, 148, 136, 0.02)" />
          </radialGradient>
          <radialGradient id="ma-val-globe-rim" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(45, 212, 191, 0)" />
            <stop offset="72%" stopColor="rgba(45, 212, 191, 0)" />
            <stop offset="100%" stopColor="rgba(15, 118, 110, 0.12)" />
          </radialGradient>
          <radialGradient id="ma-val-globe-specular" cx="30%" cy="26%" r="32%">
            <stop offset="0%" stopColor="rgba(204, 251, 241, 0.14)" />
            <stop offset="100%" stopColor="rgba(204, 251, 241, 0)" />
          </radialGradient>
          <radialGradient id="ma-val-grid-fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.55" />
            <stop offset="55%" stopColor="white" stopOpacity="0.82" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </radialGradient>
          <mask id="ma-val-grid-mask">
            <circle cx="200" cy="200" r="146" fill="url(#ma-val-grid-fade)" />
          </mask>
          <filter id="ma-val-node-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id="ma-val-globe-clip">
            <circle cx="200" cy="200" r="146" />
          </clipPath>
        </defs>

        <circle cx="200" cy="200" r="154" fill="none" stroke="rgba(94, 234, 212, 0.08)" strokeWidth="5" opacity="0.65" />

        <g className="ma-val-ref-globe-body">
          <circle cx="200" cy="200" r="148" fill="url(#ma-val-globe-sphere)" />
          <circle cx="200" cy="200" r="148" fill="url(#ma-val-globe-rim)" />
          <circle cx="200" cy="200" r="148" fill="url(#ma-val-globe-specular)" />
          <circle cx="200" cy="200" r="148" fill="none" stroke="rgba(94, 234, 212, 0.18)" strokeWidth="1" />
        </g>

        <g className="ma-val-ref-globe-grid" clipPath="url(#ma-val-globe-clip)" mask="url(#ma-val-grid-mask)">
          <ellipse cx="200" cy="200" rx="146" ry="32" fill="none" stroke="rgba(94, 234, 212, 0.16)" strokeWidth="0.75" />
          <ellipse cx="200" cy="200" rx="146" ry="64" fill="none" stroke="rgba(94, 234, 212, 0.12)" strokeWidth="0.7" />
          <ellipse cx="200" cy="200" rx="146" ry="108" fill="none" stroke="rgba(94, 234, 212, 0.1)" strokeWidth="0.65" />
          <ellipse cx="200" cy="200" rx="64" ry="146" fill="none" stroke="rgba(94, 234, 212, 0.11)" strokeWidth="0.7" />
          <ellipse cx="200" cy="200" rx="124" ry="146" fill="none" stroke="rgba(94, 234, 212, 0.08)" strokeWidth="0.65" />
          <path
            d="M78 170c26-14 54-22 86-22s62 10 88 26M64 208c32 18 70 30 112 30s84-12 118-34M86 246c28 14 60 22 94 22s70-10 100-24"
            fill="none"
            stroke="rgba(94, 234, 212, 0.18)"
            strokeWidth="0.85"
          />
        </g>

        <g className="ma-val-ref-globe-orbit-svg" fill="none" stroke="rgba(94, 234, 212, 0.2)" strokeWidth="0.85">
          <ellipse cx="200" cy="200" rx="176" ry="58" transform="rotate(-18 200 200)" />
          <ellipse cx="200" cy="200" rx="184" ry="50" transform="rotate(24 200 200)" />
        </g>

        <g className="ma-val-ref-globe-network" filter="url(#ma-val-node-glow)">
          <g fill="none" stroke="rgba(45, 212, 191, 0.28)" strokeWidth="0.85">
            <path d="M148 158 Q188 128 214 124 T268 154" />
            <path d="M268 154 Q286 188 278 218 T246 266" />
            <path d="M246 266 Q204 286 166 272 T118 226" />
            <path d="M118 226 Q126 188 148 158" />
          </g>
          <g className="ma-val-ref-globe-nodes">
            <circle cx="148" cy="158" r="2.8" fill="#99f6e4" />
            <circle cx="214" cy="124" r="2.5" fill="#5eead4" />
            <circle cx="268" cy="154" r="2.8" fill="#5eead4" />
            <circle cx="246" cy="266" r="2.8" fill="#5eead4" />
            <circle cx="118" cy="226" r="2.4" fill="#2dd4bf" />
            <circle cx="200" cy="228" r="2.2" fill="#ccfbf1" opacity="0.85" />
          </g>
        </g>
      </svg>
    </div>
  );
}
