import React from 'react';

/**
 * Valuation hero effect — FINAL / FROZEN (C.24.98).
 * Approved geometry locked. Effect-only micro-polish pass complete.
 * Do not modify except verified regression, responsive, or a11y fixes.
 */

const VIEW_W = 1000;
const VIEW_H = 700;

const MAIN_CURVE =
  'M 320 608 C 395 568, 472 558, 528 518 C 578 482, 608 405, 628 305 C 652 205, 682 118, 718 68 C 742 48, 768 38, 798 30';

const MAIN_ASCENT =
  'M 628 305 C 652 205, 682 118, 718 68 C 742 48, 768 38, 798 30';

const CONTINUATIONS = [
  {
    id: 'c1',
    d: 'M 718 68 C 738 52, 758 42, 778 35 C 792 30, 808 26, 822 24',
    opacity: 0.42,
    width: 1.6,
  },
  {
    id: 'c2',
    d: 'M 682 118 C 702 88, 722 62, 742 48 C 762 36, 782 28, 802 22',
    opacity: 0.55,
    width: 2,
  },
];

const FOCAL = { cx: 628, cy: 305 };

const UPPER_RISE = [
  {
    id: 'ur1',
    d: 'M 615 478 C 642 410, 668 335, 692 255 C 712 185, 732 120, 752 72',
    opacity: 0.38,
    width: 1.45,
    dash: '5 12',
  },
  {
    id: 'ur2',
    d: 'M 648 438 C 672 370, 696 295, 718 220 C 736 155, 754 95, 772 58',
    opacity: 0.48,
    width: 1.65,
    dash: 'none',
  },
  {
    id: 'ur3',
    d: 'M 578 512 C 605 445, 632 365, 658 285 C 680 210, 702 140, 724 82',
    opacity: 0.32,
    width: 1.3,
    dash: '4 14',
  },
  {
    id: 'ur4',
    d: 'M 688 268 C 708 205, 728 145, 748 92 C 764 58, 780 38, 796 28',
    opacity: 0.52,
    width: 1.75,
    dash: 'none',
  },
];

const SCENARIOS = [
  {
    id: 'a',
    d: 'M 295 618 C 410 575, 510 582, 608 545 C 668 518, 712 465, 758 405',
    stroke: 'rgba(45, 212, 191, 0.82)',
    width: 2.4,
    opacity: 0.62,
    dash: 'none',
    tier: 'mid',
  },
  {
    id: 'b',
    d: 'M 308 638 C 420 598, 518 605, 618 572 C 678 548, 732 505, 788 448',
    stroke: 'rgba(45, 212, 191, 0.72)',
    width: 2.15,
    opacity: 0.56,
    dash: '8 16',
    tier: 'mid',
    drift: true,
  },
  {
    id: 'c',
    d: 'M 328 655 C 442 618, 542 628, 642 598 C 702 578, 762 540, 822 495',
    stroke: 'rgba(45, 212, 191, 0.55)',
    width: 1.85,
    opacity: 0.44,
    dash: '7 12',
    tier: 'low',
    drift: true,
  },
  {
    id: 'd',
    d: 'M 345 578 C 435 525, 518 518, 592 475 C 645 442, 678 375, 708 295 C 732 220, 752 155, 772 95',
    stroke: 'rgba(94, 234, 212, 0.72)',
    width: 2.05,
    opacity: 0.54,
    dash: 'none',
    tier: 'mid',
  },
  {
    id: 'e',
    d: 'M 375 562 C 462 505, 545 472, 618 415 C 672 368, 705 290, 732 205 C 752 145, 768 88, 782 52',
    stroke: 'rgba(94, 234, 212, 0.58)',
    width: 1.75,
    opacity: 0.42,
    dash: '5 14',
    tier: 'low',
    drift: true,
  },
  {
    id: 'f',
    d: 'M 415 548 C 495 488, 572 432, 642 365 C 688 318, 725 235, 758 155 C 778 98, 792 58, 805 38',
    stroke: 'rgba(45, 212, 191, 0.45)',
    width: 1.55,
    opacity: 0.36,
    dash: '3 18',
    tier: 'low',
    drift: true,
  },
  {
    id: 'g',
    d: 'M 285 632 C 398 592, 498 602, 598 568 C 658 543, 708 495, 758 448',
    stroke: 'rgba(45, 212, 191, 0.38)',
    width: 1.35,
    opacity: 0.28,
    dash: '4 16',
    tier: 'ghost',
    drift: true,
  },
  {
    id: 'h',
    d: 'M 355 542 C 448 488, 535 465, 612 418 C 662 378, 698 305, 728 225 C 748 165, 765 105, 780 62',
    stroke: 'rgba(94, 234, 212, 0.48)',
    width: 1.6,
    opacity: 0.34,
    dash: 'none',
    tier: 'ghost',
  },
  {
    id: 'i',
    d: 'M 388 512 C 478 458, 558 415, 628 358 C 675 315, 712 238, 742 158 C 762 105, 778 62, 792 35',
    stroke: 'rgba(94, 234, 212, 0.42)',
    width: 1.45,
    opacity: 0.3,
    dash: '6 14',
    tier: 'ghost',
    drift: true,
  },
  {
    id: 'j',
    d: 'M 300 645 C 412 608, 512 618, 612 588 C 672 568, 732 530, 792 492',
    stroke: 'rgba(45, 212, 191, 0.32)',
    width: 1.25,
    opacity: 0.24,
    dash: '2 20',
    tier: 'ghost',
    drift: true,
  },
];

const DEEP_GHOST = [
  'M 312 662 C 432 622, 532 632, 632 602 C 692 582, 752 545, 812 508',
  'M 365 498 C 455 445, 545 408, 625 348 C 675 305, 712 225, 745 145 C 768 95, 785 55, 798 32',
];

const BAR_X = [460, 485, 510, 535, 560, 585, 610, 635, 660, 685, 710];
const BAR_H = [72, 108, 148, 198, 252, 308, 368, 432, 492, 548, 598];
const BAR_BASELINE = 608;

const BASELINE_TICKS = [
  { x: 320, label: '2023' },
  { x: 420, label: '2024' },
  { x: 520, label: '2025' },
  { x: 620, label: '2026E' },
  { x: 720, label: '2027E' },
];

const SIGNAL_NODES = [
  { id: 'n1', cx: 410, cy: 572, r: 4.5, ring: true, bright: true },
  { id: 'n2', cx: 528, cy: 518, r: 4.1, ring: true, bright: true },
  { id: 'n3', cx: 608, cy: 405, r: 4.3, ring: false, bright: true },
  { id: 'n4', cx: 772, cy: 95, r: 3.8, ring: true, bright: true },
  { id: 'n5', cx: 558, cy: 498, r: 3, ring: false, bright: false },
  { id: 'n6', cx: 472, cy: 562, r: 2.8, ring: false, bright: false },
  { id: 'n7', cx: 648, cy: 438, r: 3.2, ring: true, bright: false },
  { id: 'n8', cx: 718, cy: 220, r: 3, ring: false, bright: false },
  { id: 'n9', cx: 592, cy: 475, r: 2.6, ring: false, bright: false },
  { id: 'n10', cx: 752, cy: 72, r: 3.4, ring: true, bright: true },
  { id: 'n11', cx: 682, cy: 268, r: 2.8, ring: false, bright: false },
];

const BEND_GLOWS = [
  { cx: 608, cy: 545, r: 10 },
  { cx: 592, cy: 475, r: 9 },
  { cx: 628, cy: 405, r: 8 },
  { cx: 648, cy: 438, r: 7 },
  { cx: 718, cy: 220, r: 6 },
  { cx: 688, cy: 268, r: 5 },
];

const MICRO_DOTS = [
  { cx: 352, cy: 592, r: 1.6 },
  { cx: 438, cy: 558, r: 1.35 },
  { cx: 518, cy: 528, r: 1.65 },
  { cx: 598, cy: 448, r: 1.45 },
  { cx: 652, cy: 368, r: 1.55 },
  { cx: 702, cy: 228, r: 1.4 },
  { cx: 748, cy: 118, r: 1.3 },
  { cx: 778, cy: 68, r: 1.25 },
  { cx: 542, cy: 542, r: 1.2 },
  { cx: 668, cy: 318, r: 1.35 },
];

const SPECKS = [
  { cx: 505, cy: 405, r: 1.1 },
  { cx: 572, cy: 358, r: 0.9 },
  { cx: 632, cy: 305, r: 1 },
  { cx: 688, cy: 248, r: 0.85 },
  { cx: 728, cy: 185, r: 1.05 },
  { cx: 455, cy: 495, r: 0.95 },
  { cx: 538, cy: 438, r: 1.1 },
  { cx: 608, cy: 378, r: 0.9 },
  { cx: 665, cy: 318, r: 1 },
  { cx: 425, cy: 548, r: 0.85 },
  { cx: 758, cy: 135, r: 0.95 },
  { cx: 582, cy: 468, r: 1.05 },
  { cx: 712, cy: 198, r: 0.9 },
  { cx: 792, cy: 48, r: 1 },
];

const CONNECTORS = [
  { x1: 410, y1: 572, x2: 528, y2: 518 },
  { x1: 528, y1: 518, x2: 608, y2: 405 },
  { x1: 608, y1: 405, x2: 628, y2: 305 },
  { x1: 472, y1: 562, x2: 558, y2: 498 },
  { x1: 648, y1: 438, x2: 718, y2: 220 },
  { x1: 628, y1: 305, x2: 752, y2: 72 },
];

const FRAGMENTS = [
  { x1: 538, y1: 528, x2: 538, y2: 508 },
  { x1: 598, y1: 448, x2: 598, y2: 428 },
  { x1: 652, y1: 368, x2: 652, y2: 348 },
  { x1: 702, y1: 228, x2: 716, y2: 215 },
  { x1: 748, y1: 118, x2: 762, y2: 105 },
  { x1: 668, y1: 318, x2: 682, y2: 298 },
];

const SCAFFOLD_LINES = [320, 380, 440, 500, 560];

const CENTER_TRAJECTORIES = [
  {
    id: 'ht1',
    d: 'M 395 558 C 438 498, 482 438, 522 382 C 552 338, 578 288, 602 238',
    opacity: 0.54,
    width: 1.75,
    dash: 'none',
  },
  {
    id: 'ht2',
    d: 'M 418 542 C 458 482, 498 422, 535 365 C 562 318, 588 268, 612 218',
    opacity: 0.6,
    width: 1.9,
    dash: '5 11',
  },
  {
    id: 'ht3',
    d: 'M 440 525 C 478 468, 516 408, 548 355 C 574 308, 598 258, 622 208',
    opacity: 0.46,
    width: 1.55,
    dash: '4 13',
  },
  {
    id: 'ht4',
    d: 'M 462 508 C 498 452, 534 395, 562 345 C 586 298, 608 248, 632 198',
    opacity: 0.38,
    width: 1.4,
    dash: 'none',
  },
  {
    id: 'ht5',
    d: 'M 382 572 C 425 512, 468 452, 508 398 C 538 358, 565 312, 588 268',
    opacity: 0.3,
    width: 1.25,
    dash: '3 16',
  },
];

const MID_AIR_NODES = [
  { id: 'ma1', cx: 488, cy: 425, r: 3.1, bright: false },
  { id: 'ma2', cx: 532, cy: 382, r: 3, bright: true },
  { id: 'ma3', cx: 572, cy: 338, r: 2.8, bright: false },
  { id: 'ma4', cx: 608, cy: 292, r: 3.2, bright: true },
  { id: 'ma5', cx: 545, cy: 452, r: 2.6, bright: false },
  { id: 'ma6', cx: 598, cy: 362, r: 2.5, bright: false },
  { id: 'ma7', cx: 515, cy: 402, r: 2.4, bright: false },
];

const CENTER_MICRO = [
  { cx: 455, cy: 478, r: 1.2 },
  { cx: 498, cy: 442, r: 1.05 },
  { cx: 542, cy: 398, r: 1.15 },
  { cx: 585, cy: 352, r: 1.1 },
  { cx: 618, cy: 308, r: 1.05 },
  { cx: 472, cy: 512, r: 1 },
  { cx: 558, cy: 418, r: 1.1 },
];

const CENTER_RING_MARKERS = [
  { id: 'cr1', cx: 535, cy: 365, r: 3.8 },
  { id: 'cr2', cx: 588, cy: 268, r: 3.4 },
  { id: 'cr3', cx: 622, cy: 208, r: 3.2 },
];

const CENTER_TICKS = [
  { x1: 505, y1: 468, x2: 505, y2: 478 },
  { x1: 548, y1: 418, x2: 548, y2: 428 },
  { x1: 592, y1: 348, x2: 592, y2: 358 },
  { x1: 625, y1: 278, x2: 625, y2: 288 },
  { x1: 478, y1: 498, x2: 488, y2: 498 },
  { x1: 565, y1: 328, x2: 575, y2: 328 },
  { x1: 518, y1: 445, x2: 518, y2: 452 },
  { x1: 608, y1: 312, x2: 608, y2: 320 },
];

const TRAVEL_PATHS = {
  signalA: MAIN_CURVE,
  signalB: CENTER_TRAJECTORIES[1].d,
  signalC: CENTER_TRAJECTORIES[4].d,
  secondary: SCENARIOS[3].d,
  centerAscent: CENTER_TRAJECTORIES[2].d,
};

const INTERSECTION_PULSES = [
  { id: 'ix1', cx: 410, cy: 572 },
  { id: 'ix2', cx: 528, cy: 518 },
  { id: 'ix3', cx: 608, cy: 405 },
  { id: 'ix4', cx: 648, cy: 438 },
  { id: 'ix5', cx: 752, cy: 72 },
  { id: 'ix6', cx: 682, cy: 268 },
];

const UPPER_NODES = [
  { id: 'un1', cx: 778, cy: 35, r: 2.4 },
  { id: 'un2', cx: 802, cy: 22, r: 2.2 },
];

const RING_MARKERS = [
  { id: 'rm1', cx: 718, cy: 68, r: 4.2 },
  { id: 'rm2', cx: 768, cy: 38, r: 3.8 },
  { id: 'rm3', cx: 798, cy: 30, r: 4.5 },
];

const EXTRA_TICKS = [
  { x1: 735, y1: 95, x2: 735, y2: 108 },
  { x1: 765, y1: 58, x2: 765, y2: 71 },
  { x1: 622, y1: 405, x2: 635, y2: 405 },
  { x1: 698, y1: 248, x2: 711, y2: 248 },
];

const BAR_RISE_INDICES = [3, 6, 9];

function TravelNode({ path, dur, begin, r, trail, deepTrail, className }) {
  const trailSteps = trail
    ? deepTrail
      ? [
          { r: r * 0.48, opacity: 0.1, offset: -0.34 },
          { r: r * 0.68, opacity: 0.26, offset: -0.24 },
          { r: r * 0.88, opacity: 0.44, offset: -0.14 },
        ]
      : [
          { r: r * 0.62, opacity: 0.2, offset: -0.2 },
          { r: r * 0.82, opacity: 0.42, offset: -0.11 },
        ]
    : [];

  return (
    <g className={className}>
      {trailSteps.map((step, i) => (
        <circle key={`trail-${i}`} r={step.r} fill="#5eead4" opacity={step.opacity}>
          <animateMotion path={path} dur={`${dur}s`} repeatCount="indefinite" rotate="0" begin={`${begin + step.offset}s`} />
        </circle>
      ))}
      <circle r={r} fill="#5eead4" opacity="0">
        <animateMotion path={path} dur={`${dur}s`} repeatCount="indefinite" rotate="0" begin={`${begin}s`} />
        <animate attributeName="opacity" values="0;0.92;1;0.78;0" keyTimes="0;0.1;0.4;0.72;1" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
      </circle>
      <circle r={r * 0.55} fill="#ffffff" opacity="0">
        <animateMotion path={path} dur={`${dur}s`} repeatCount="indefinite" rotate="0" begin={`${begin}s`} />
        <animate attributeName="opacity" values="0;0.72;0.95;0.55;0" keyTimes="0;0.1;0.4;0.72;1" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
      </circle>
    </g>
  );
}

export function ValuationScenarioFieldVisual() {
  return (
    <div className="ma-valuation-effect-layer" aria-hidden="true">
      <svg
        className="ma-valuation-effect-svg"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ma-val-eff-left-mask" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="18%" stopColor="white" stopOpacity="0" />
            <stop offset="32%" stopColor="white" stopOpacity="0.55" />
            <stop offset="42%" stopColor="white" stopOpacity="1" />
            <stop offset="52%" stopColor="white" stopOpacity="1" />
            <stop offset="60%" stopColor="white" stopOpacity="0.94" />
            <stop offset="66%" stopColor="white" stopOpacity="0.86" />
            <stop offset="72%" stopColor="white" stopOpacity="0.72" />
            <stop offset="78%" stopColor="white" stopOpacity="0.54" />
            <stop offset="84%" stopColor="white" stopOpacity="0.36" />
            <stop offset="90%" stopColor="white" stopOpacity="0.2" />
            <stop offset="96%" stopColor="white" stopOpacity="0.07" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="ma-val-eff-btn-shield" gradientUnits="userSpaceOnUse" cx="150" cy="648" r="300">
            <stop offset="0%" stopColor="white" stopOpacity="0.34" />
            <stop offset="42%" stopColor="white" stopOpacity="0.62" />
            <stop offset="72%" stopColor="white" stopOpacity="0.88" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </radialGradient>

          <mask id="ma-val-eff-mask-primary" maskUnits="userSpaceOnUse">
            <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#ma-val-eff-left-mask)" />
          </mask>

          <mask id="ma-val-eff-mask-secondary" maskUnits="userSpaceOnUse">
            <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#ma-val-eff-left-mask)" />
            <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#ma-val-eff-btn-shield)" style={{ mixBlendMode: 'multiply' }} />
          </mask>

          <pattern id="ma-val-eff-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(45, 212, 191, 0.055)" strokeWidth="0.55" />
          </pattern>

          <linearGradient id="ma-val-eff-scan" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(94, 234, 212, 0)" />
            <stop offset="42%" stopColor="rgba(94, 234, 212, 0.12)" />
            <stop offset="58%" stopColor="rgba(94, 234, 212, 0.16)" />
            <stop offset="100%" stopColor="rgba(94, 234, 212, 0)" />
          </linearGradient>

          <linearGradient id="ma-val-eff-bar-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(45, 212, 191, 0.28)" />
            <stop offset="45%" stopColor="rgba(16, 62, 56, 0.48)" />
            <stop offset="100%" stopColor="rgba(8, 28, 26, 0.16)" />
          </linearGradient>

          <linearGradient id="ma-val-eff-bar-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(94, 234, 212, 0.45)" />
            <stop offset="100%" stopColor="rgba(94, 234, 212, 0)" />
          </linearGradient>

          <linearGradient id="ma-val-eff-primary" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(45, 212, 191, 0.88)" />
            <stop offset="50%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#5eead4" />
          </linearGradient>

          <linearGradient id="ma-val-eff-ascent" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(45, 212, 191, 0.75)" />
            <stop offset="100%" stopColor="#5eead4" />
          </linearGradient>

          <radialGradient id="ma-val-eff-focal-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(94, 234, 212, 0.72)" />
            <stop offset="50%" stopColor="rgba(94, 234, 212, 0.18)" />
            <stop offset="100%" stopColor="rgba(94, 234, 212, 0)" />
          </radialGradient>
        </defs>

        <g mask="url(#ma-val-eff-mask-secondary)">
          <g className="ma-valuation-effect-deep">
            <rect x="290" y="55" width="640" height="600" fill="url(#ma-val-eff-grid)" opacity="0.68" />
            {SCAFFOLD_LINES.map((y) => (
              <line key={y} x1="300" y1={y} x2="840" y2={y - 24} stroke="rgba(45, 212, 191, 0.075)" strokeWidth="0.65" strokeDasharray="3 11" />
            ))}
            {DEEP_GHOST.map((d, i) => (
              <path key={`ghost-${i}`} className={`ma-valuation-effect-ghost ma-valuation-effect-ghost-${i + 1}`} d={d} stroke="rgba(45, 212, 191, 0.22)" strokeWidth="1.1" opacity="0.2" />
            ))}
          </g>

          <g className="ma-valuation-effect-scan">
            <rect x="260" y="45" width="140" height="600" fill="url(#ma-val-eff-scan)" opacity="0.24" />
          </g>

          <g className="ma-valuation-effect-back">
            {BAR_X.map((x, i) => (
              <g key={x}>
                <rect className={`ma-valuation-effect-bar ma-valuation-effect-bar-${i + 1}`} x={x - 6} y={BAR_BASELINE - BAR_H[i]} width="12" height={BAR_H[i]} rx="2.5" fill="url(#ma-val-eff-bar-fill)" opacity="0.94" />
                <rect className={`ma-valuation-effect-bar-edge ma-valuation-effect-bar-edge-${i + 1}`} x={x - 6} y={BAR_BASELINE - BAR_H[i]} width="12" height={BAR_H[i]} rx="2.5" fill="none" stroke="rgba(45, 212, 191, 0.48)" strokeWidth="1" opacity="0.92" />
                <rect className={`ma-valuation-effect-bar-top ma-valuation-effect-bar-top-${i + 1}`} x={x - 6} y={BAR_BASELINE - BAR_H[i]} width="12" height="14" rx="2" fill="url(#ma-val-eff-bar-top)" opacity="0.75" />
                <line className={`ma-valuation-effect-bar-cap ma-valuation-effect-bar-cap-${i + 1}`} x1={x - 9} y1={BAR_BASELINE - BAR_H[i]} x2={x + 9} y2={BAR_BASELINE - BAR_H[i]} stroke="rgba(94, 234, 212, 0.42)" strokeWidth="1" opacity="0.85" />
                {BAR_RISE_INDICES.includes(i + 1) ? (
                  <line
                    className={`ma-valuation-effect-bar-rise ma-valuation-effect-bar-rise-${i + 1}`}
                    x1={x}
                    y1={BAR_BASELINE - 8}
                    x2={x}
                    y2={BAR_BASELINE - BAR_H[i] + 8}
                    stroke="rgba(94, 234, 212, 0.55)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="10 120"
                    opacity="0"
                  />
                ) : null}
              </g>
            ))}

            <g className="ma-valuation-effect-baseline" opacity="0.82">
              <line x1="275" y1="662" x2="840" y2="625" stroke="rgba(45, 212, 191, 0.38)" strokeWidth="1.1" />
              {BASELINE_TICKS.map((tick) => {
                const t = (tick.x - 275) / (840 - 275);
                const ty = 662 - t * 37;
                return (
                  <g key={tick.x}>
                    <line x1={tick.x} y1={ty} x2={tick.x} y2={ty + 9} stroke="rgba(45, 212, 191, 0.32)" strokeWidth="0.8" />
                    <text x={tick.x} y={ty + 20} textAnchor="middle" fill="rgba(45, 212, 191, 0.26)" fontSize="11" fontFamily="system-ui, sans-serif">
                      {tick.label}
                    </text>
                  </g>
                );
              })}
            </g>
          </g>

          <g className="ma-valuation-effect-mid">
            {SCENARIOS.map((curve) => (
              <path
                key={curve.id}
                className={['ma-valuation-effect-scenario', `ma-valuation-effect-scenario-${curve.id}`, curve.drift ? 'ma-valuation-effect-scenario-drift' : '', curve.dash !== 'none' ? 'ma-valuation-effect-scenario-dashed' : '', curve.tier === 'ghost' ? 'ma-valuation-effect-scenario-ghost' : ''].filter(Boolean).join(' ')}
                d={curve.d}
                stroke={curve.stroke}
                strokeWidth={curve.width}
                strokeLinecap="round"
                strokeDasharray={curve.dash === 'none' ? undefined : curve.dash}
                fill="none"
                opacity={curve.opacity}
              />
            ))}

            {UPPER_RISE.map((rise) => (
              <path
                key={rise.id}
                className={['ma-valuation-effect-upper-rise', `ma-valuation-effect-upper-rise-${rise.id}`, rise.dash !== 'none' ? 'ma-valuation-effect-upper-rise-dashed' : ''].filter(Boolean).join(' ')}
                d={rise.d}
                stroke="rgba(94, 234, 212, 0.62)"
                strokeWidth={rise.width}
                strokeLinecap="round"
                strokeDasharray={rise.dash === 'none' ? undefined : rise.dash}
                fill="none"
                opacity={rise.opacity}
              />
            ))}

            {CENTER_TRAJECTORIES.map((traj) => (
              <path
                key={traj.id}
                className={['ma-valuation-effect-center-traj', `ma-valuation-effect-center-traj-${traj.id}`, traj.dash !== 'none' ? 'ma-valuation-effect-center-traj-dashed' : ''].filter(Boolean).join(' ')}
                d={traj.d}
                stroke="rgba(94, 234, 212, 0.58)"
                strokeWidth={traj.width}
                strokeLinecap="round"
                strokeDasharray={traj.dash === 'none' ? undefined : traj.dash}
                fill="none"
                opacity={traj.opacity}
              />
            ))}

            {CENTER_TICKS.map((t, i) => (
              <line key={`ctick-${i}`} className={`ma-valuation-effect-center-tick ma-valuation-effect-center-tick-${i + 1}`} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="rgba(45, 212, 191, 0.22)" strokeWidth="0.6" opacity="0.52" />
            ))}

            {CENTER_MICRO.map((dot, i) => (
              <circle key={`cmicro-${i}`} className={`ma-valuation-effect-center-micro ma-valuation-effect-center-micro-${i + 1}`} cx={dot.cx} cy={dot.cy} r={dot.r} fill="#5eead4" opacity="0.48" />
            ))}

            {CENTER_RING_MARKERS.map((rm) => (
              <circle key={rm.id} className={`ma-valuation-effect-center-ring ma-valuation-effect-center-ring-${rm.id}`} cx={rm.cx} cy={rm.cy} r={rm.r} fill="none" stroke="rgba(94, 234, 212, 0.28)" strokeWidth="0.6" opacity="0.42" />
            ))}

            {BEND_GLOWS.map((glow, i) => (
              <circle key={`bend-${i}`} className={`ma-valuation-effect-bend ma-valuation-effect-bend-${i + 1}`} cx={glow.cx} cy={glow.cy} r={glow.r} fill="rgba(94, 234, 212, 0.1)" stroke="rgba(94, 234, 212, 0.22)" strokeWidth="0.55" opacity="0.52" />
            ))}

            <g className="ma-valuation-effect-connectors" opacity="0.48">
              {CONNECTORS.map((c, i) => (
                <line key={`conn-${i}`} className={`ma-valuation-effect-connector ma-valuation-effect-connector-${i + 1}`} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2} stroke="rgba(45, 212, 191, 0.22)" strokeWidth="0.7" strokeDasharray="2 7" />
              ))}
            </g>

            {FRAGMENTS.map((f, i) => (
              <line key={`frag-${i}`} className={`ma-valuation-effect-fragment ma-valuation-effect-fragment-${i + 1}`} x1={f.x1} y1={f.y1} x2={f.x2} y2={f.y2} stroke="rgba(94, 234, 212, 0.28)" strokeWidth="0.75" opacity="0.65" />
            ))}

            {EXTRA_TICKS.map((t, i) => (
              <line key={`tick-${i}`} className={`ma-valuation-effect-tick ma-valuation-effect-tick-${i + 1}`} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="rgba(45, 212, 191, 0.24)" strokeWidth="0.65" opacity="0.55" />
            ))}

            {UPPER_NODES.map((node) => (
              <g key={node.id}>
                <circle className={`ma-valuation-effect-upper-node ma-valuation-effect-upper-node-${node.id}`} cx={node.cx} cy={node.cy} r={node.r} fill="#5eead4" opacity="0.72" />
              </g>
            ))}
          </g>
        </g>

        <g mask="url(#ma-val-eff-mask-primary)">
          <g className="ma-valuation-effect-front">
            <path className="ma-valuation-effect-primary ma-valuation-effect-primary-aura" d={MAIN_CURVE} stroke="rgba(45, 212, 191, 0.26)" strokeWidth="18" strokeLinecap="round" opacity="0.72" />
            <path className="ma-valuation-effect-primary ma-valuation-effect-primary-aura-inner" d={MAIN_CURVE} stroke="rgba(45, 212, 191, 0.18)" strokeWidth="11" strokeLinecap="round" opacity="0.78" />
            <path className="ma-valuation-effect-primary ma-valuation-effect-primary-core" d={MAIN_CURVE} stroke="url(#ma-val-eff-primary)" strokeWidth="5" strokeLinecap="round" opacity="1" />
            <path className="ma-valuation-effect-primary ma-valuation-effect-primary-highlight" d={MAIN_CURVE} stroke="#5eead4" strokeWidth="2.4" strokeLinecap="round" opacity="0.98" />
            <path className="ma-valuation-effect-primary ma-valuation-effect-primary-ascent" d={MAIN_ASCENT} stroke="url(#ma-val-eff-ascent)" strokeWidth="3.2" strokeLinecap="round" opacity="0.72" />

            {CONTINUATIONS.map((cont) => (
              <path key={cont.id} className={`ma-valuation-effect-continuation ma-valuation-effect-continuation-${cont.id}`} d={cont.d} stroke="rgba(94, 234, 212, 0.55)" strokeWidth={cont.width} strokeLinecap="round" opacity={cont.opacity} />
            ))}

            <path className="ma-valuation-effect-signal-a-trail-fade" d={MAIN_CURVE} stroke="rgba(94, 234, 212, 0.22)" strokeWidth="14" strokeLinecap="round" strokeDasharray="38 1300" opacity="0.28" />
            <path className="ma-valuation-effect-signal-a-tail" d={MAIN_CURVE} stroke="rgba(94, 234, 212, 0.5)" strokeWidth="9" strokeLinecap="round" strokeDasharray="52 1300" opacity="0.42" />
            <path className="ma-valuation-effect-signal-a" d={MAIN_CURVE} stroke="#5eead4" strokeWidth="4.8" strokeLinecap="round" strokeDasharray="16 1300" opacity="1" />
            <path className="ma-valuation-effect-signal-a-head" d={MAIN_CURVE} stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeDasharray="7 1300" opacity="0.88" />

            <path className="ma-valuation-effect-signal-b-tail" d={TRAVEL_PATHS.signalB} stroke="rgba(94, 234, 212, 0.4)" strokeWidth="6" strokeLinecap="round" strokeDasharray="36 680" opacity="0.32" />
            <path className="ma-valuation-effect-signal-b" d={TRAVEL_PATHS.signalB} stroke="rgba(94, 234, 212, 0.78)" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="14 680" opacity="0.68" />
            <path className="ma-valuation-effect-signal-b-head" d={TRAVEL_PATHS.signalB} stroke="#5eead4" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="6 680" opacity="0.82" />

            <path className="ma-valuation-effect-signal-c-tail" d={TRAVEL_PATHS.signalC} stroke="rgba(45, 212, 191, 0.38)" strokeWidth="5" strokeLinecap="round" strokeDasharray="32 720" opacity="0.28" />
            <path className="ma-valuation-effect-signal-c" d={TRAVEL_PATHS.signalC} stroke="rgba(45, 212, 191, 0.62)" strokeWidth="2" strokeLinecap="round" strokeDasharray="12 720" opacity="0.58" />
            <path className="ma-valuation-effect-signal-c-head" d={TRAVEL_PATHS.signalC} stroke="#2dd4bf" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="5 720" opacity="0.75" />

            <path className="ma-valuation-effect-event-upper" d={CENTER_TRAJECTORIES[1].d} stroke="#5eead4" strokeWidth="2.8" strokeLinecap="round" strokeDasharray="12 680" opacity="0" />

            <path className="ma-valuation-effect-event" d={MAIN_CURVE} stroke="#5eead4" strokeWidth="5.5" strokeLinecap="round" strokeDasharray="16 1300" opacity="0" />
            <path className="ma-valuation-effect-event-burst" d={MAIN_CURVE} stroke="rgba(94, 234, 212, 0.55)" strokeWidth="11" strokeLinecap="round" strokeDasharray="22 1300" opacity="0" />
            <path className="ma-valuation-effect-event-ascent" d={MAIN_ASCENT} stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" strokeDasharray="10 600" opacity="0" />

            <path className="ma-valuation-effect-secondary-travel" d={TRAVEL_PATHS.secondary} stroke="rgba(94, 234, 212, 0.55)" strokeWidth="2" strokeLinecap="round" strokeDasharray="16 950" opacity="0.42" />

            <g className="ma-valuation-effect-focal">
              <circle className="ma-valuation-effect-focal-glow" cx={FOCAL.cx} cy={FOCAL.cy} r="34" fill="url(#ma-val-eff-focal-glow)" opacity="0.26" />
              <circle className="ma-valuation-effect-focal-ripple ma-valuation-effect-focal-ripple-1" cx={FOCAL.cx} cy={FOCAL.cy} r="18" fill="none" stroke="rgba(94, 234, 212, 0.62)" strokeWidth="1.1" opacity="0" />
              <circle className="ma-valuation-effect-focal-ripple ma-valuation-effect-focal-ripple-2" cx={FOCAL.cx} cy={FOCAL.cy} r="18" fill="none" stroke="rgba(94, 234, 212, 0.42)" strokeWidth="0.85" opacity="0" />
              <circle className="ma-valuation-effect-focal-ripple ma-valuation-effect-focal-ripple-3" cx={FOCAL.cx} cy={FOCAL.cy} r="18" fill="none" stroke="rgba(94, 234, 212, 0.28)" strokeWidth="0.65" opacity="0" />
              <circle className="ma-valuation-effect-focal-ring-faint" cx={FOCAL.cx} cy={FOCAL.cy} r="28" fill="none" stroke="rgba(94, 234, 212, 0.18)" strokeWidth="0.55" opacity="0" />
              <circle className="ma-valuation-effect-focal-ring-outer" cx={FOCAL.cx} cy={FOCAL.cy} r="22" fill="none" stroke="rgba(94, 234, 212, 0.35)" strokeWidth="0.75" opacity="0.72" />
              <circle className="ma-valuation-effect-focal-ring" cx={FOCAL.cx} cy={FOCAL.cy} r="16" fill="none" stroke="rgba(94, 234, 212, 0.95)" strokeWidth="1.35" opacity="0.95" />
              <circle className="ma-valuation-effect-focal-core" cx={FOCAL.cx} cy={FOCAL.cy} r="8" fill="#5eead4" opacity="1" />
              <circle className="ma-valuation-effect-focal-core-hot" cx={FOCAL.cx} cy={FOCAL.cy} r="4" fill="#ffffff" opacity="0.85" />
            </g>

            <circle className="ma-valuation-effect-endpoint" cx="798" cy="30" r="5" fill="#5eead4" opacity="0.88" />
            <circle className="ma-valuation-effect-endpoint-ring" cx="798" cy="30" r="10" fill="none" stroke="rgba(94, 234, 212, 0.55)" strokeWidth="0.85" opacity="0.65" />

            {INTERSECTION_PULSES.map((ix) => (
              <g key={ix.id}>
                <circle className={`ma-valuation-effect-ix-pulse ma-valuation-effect-ix-pulse-${ix.id}`} cx={ix.cx} cy={ix.cy} r="6" fill="none" stroke="rgba(94, 234, 212, 0.55)" strokeWidth="0.75" opacity="0" />
                <circle className={`ma-valuation-effect-ix-flash ma-valuation-effect-ix-flash-${ix.id}`} cx={ix.cx} cy={ix.cy} r="3" fill="#5eead4" opacity="0" />
              </g>
            ))}

            {RING_MARKERS.map((rm) => (
              <circle key={rm.id} className={`ma-valuation-effect-ring-marker ma-valuation-effect-ring-marker-${rm.id}`} cx={rm.cx} cy={rm.cy} r={rm.r} fill="none" stroke="rgba(94, 234, 212, 0.32)" strokeWidth="0.65" opacity="0.48" />
            ))}

            {SIGNAL_NODES.map((node) => (
              <g key={node.id}>
                {node.ring ? (
                  <circle className={`ma-valuation-effect-node-ring ma-valuation-effect-node-ring-${node.id}`} cx={node.cx} cy={node.cy} r={node.r + 6} fill="none" stroke="rgba(94, 234, 212, 0.42)" strokeWidth="0.75" opacity="0.62" />
                ) : null}
                <circle className={`ma-valuation-effect-node ma-valuation-effect-node-${node.id}`} cx={node.cx} cy={node.cy} r={node.r} fill={node.bright ? '#5eead4' : '#2dd4bf'} opacity={node.bright ? 0.95 : 0.78} />
              </g>
            ))}

            {MID_AIR_NODES.map((node) => (
              <g key={node.id}>
                <circle className={`ma-valuation-effect-mid-air-node ma-valuation-effect-mid-air-node-${node.id}`} cx={node.cx} cy={node.cy} r={node.r} fill={node.bright ? '#5eead4' : '#2dd4bf'} opacity={node.bright ? 0.82 : 0.58} />
                <circle className={`ma-valuation-effect-mid-air-halo ma-valuation-effect-mid-air-halo-${node.id}`} cx={node.cx} cy={node.cy} r={node.r + 4} fill="none" stroke="rgba(94, 234, 212, 0.32)" strokeWidth="0.55" opacity="0" />
              </g>
            ))}

            <g className="ma-valuation-effect-travelers">
              <TravelNode path={TRAVEL_PATHS.signalA} dur={4.8} begin={0} r={3.2} trail deepTrail className="ma-valuation-effect-node-motion ma-valuation-effect-node-motion-a" />
              <TravelNode path={TRAVEL_PATHS.signalB} dur={6.6} begin={-1.6} r={2.7} trail className="ma-valuation-effect-node-motion ma-valuation-effect-node-motion-b" />
              <TravelNode path={TRAVEL_PATHS.signalC} dur={8.9} begin={-3.2} r={2.5} trail className="ma-valuation-effect-node-motion ma-valuation-effect-node-motion-c" />
            </g>

            {MICRO_DOTS.map((dot, i) => (
              <circle key={`dot-${i}`} className={`ma-valuation-effect-micro ma-valuation-effect-micro-${i + 1}`} cx={dot.cx} cy={dot.cy} r={dot.r} fill="#5eead4" opacity="0.62" />
            ))}

            {SPECKS.map((speck, i) => (
              <circle key={`speck-${i}`} className={`ma-valuation-effect-speck ma-valuation-effect-speck-${i + 1}`} cx={speck.cx} cy={speck.cy} r={speck.r} fill="#5eead4" opacity="0.35" />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
