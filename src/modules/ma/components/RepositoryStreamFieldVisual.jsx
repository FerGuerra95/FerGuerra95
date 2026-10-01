import React, { useEffect, useState } from 'react';

/**
 * Repository hero — Archive Vault + Security Seal (decorative only).
 * Saved M&A intelligence / controlled retrieval / secure continuity.
 */

const LOOP = '11s';

/** Idle ambient packets — max 2 subtle movements during calm */
const MOVING_PACKETS = [
  { id: 'mp0', path: 'M 38 378 C 138 338, 238 298, 368 248 C 468 218, 548 204, 608 198', dur: '9.2s', begin: '0.6s', kind: 'doc', small: true, tier: 'ghost' },
  { id: 'mp4', path: 'M 128 318 C 228 278, 328 248, 428 218 C 508 198, 578 192, 624 196', dur: '10.4s', begin: '0.3s', kind: 'check', small: true, tier: 'ghost' },
];

/** Controlled snapshot batch — 5 records, one becomes primary */
const BATCH_PATH = 'M 88 368 C 168 338, 248 308, 328 278 C 408 248, 488 228, 568 212 C 598 206, 612 200, 628 196';
const BATCH_PACKETS = [
  { begin: '1.2s', role: 'secondary' },
  { begin: '1.32s', role: 'secondary' },
  { begin: '1.44s', role: 'primary' },
  { begin: '1.59s', role: 'secondary' },
  { begin: '1.74s', role: 'secondary' },
];

/** Pre-activation filaments — stagger before main tracer */
const PRE_FILAMENT_INDICES = [0, 1, 2];

/** Idle route trace — one faint ring during calm */
const ROUTE_PULSES = [
  { id: 'rp0', d: 'M 8 408 C 108 368, 228 318, 368 268 C 468 232, 528 208, 568 198 C 598 192, 612 194, 628 196', w: 4.2, delay: 0 },
  { id: 'rp4', d: 'M 38 378 C 138 338, 238 298, 368 248 C 468 218, 548 204, 608 198', w: 1.8, delay: -0.9 },
];
const LOCK_SCALE = 1.48;
const VAULT = { cx: 628, cy: 196 };

function octPoints(r, sy = 0.72, sx = 1.54, ox = 0, oy = 0) {
  const pts = [];
  for (let i = 0; i < 8; i += 1) {
    const a = (Math.PI / 4) * i - Math.PI / 8;
    pts.push(`${(Math.cos(a) * r * sx + ox).toFixed(1)},${(Math.sin(a) * r * sy + oy).toFixed(1)}`);
  }
  return pts.join(' ');
}

/** 8 shell levels — +25% mass vs prior pass */
const SHELLS = [
  { r: 178, sx: 1.56, sy: 0.7, ox: 11, oy: 7, tier: 'rear-far', fill: 'url(#ma-repo-v3-shell-rear-far)', stroke: 'rgba(45,212,191,0.08)', sw: 0.4 },
  { r: 158, sx: 1.54, sy: 0.72, ox: 8, oy: 5, tier: 'rear', fill: 'url(#ma-repo-v3-shell-rear)', stroke: 'rgba(45,212,191,0.12)', sw: 0.46 },
  { r: 140, sx: 1.52, sy: 0.73, ox: 6, oy: 3, tier: 'mid-rear', fill: 'url(#ma-repo-v3-shell-mid-rear)', stroke: 'rgba(45,212,191,0.16)', sw: 0.52 },
  { r: 122, sx: 1.5, sy: 0.74, ox: 3, oy: 1, tier: 'mid', fill: 'url(#ma-repo-v3-shell-mid)', stroke: 'rgba(45,212,191,0.2)', sw: 0.58 },
  { r: 102, sx: 1.48, sy: 0.75, ox: 0, oy: 0, tier: 'mid-front', fill: 'url(#ma-repo-v3-shell-mid-front)', stroke: 'rgba(45,212,191,0.26)', sw: 0.66 },
  { r: 84, sx: 1.46, sy: 0.76, ox: 0, oy: -1, tier: 'front', fill: 'url(#ma-repo-v3-shell-front)', stroke: 'rgba(94,234,212,0.55)', sw: 1.02 },
  { r: 68, sx: 1.44, sy: 0.77, ox: 0, oy: 0, tier: 'index-frame', fill: 'url(#ma-repo-v3-shell-index)', stroke: 'rgba(94,234,212,0.48)', sw: 0.82 },
  { r: 50, sx: 1.42, sy: 0.78, ox: 0, oy: 0, tier: 'record-chamber', fill: 'url(#ma-repo-v3-shell-record)', stroke: 'rgba(94,234,212,0.62)', sw: 0.76 },
];

const INDEX = {
  cx: VAULT.cx,
  cy: VAULT.cy,
  rings: [
    { rx: 648, ry: 138, tier: 'o1', plane: 'far' },
    { rx: 538, ry: 116, tier: 'o2', plane: 'far' },
    { rx: 422, ry: 92, tier: 'm1', plane: 'mid' },
    { rx: 312, ry: 68, tier: 'm2', plane: 'mid' },
    { rx: 204, ry: 46, tier: 'n1', plane: 'front' },
    { rx: 118, ry: 28, tier: 'n2', plane: 'front' },
  ],
  resolveRings: [
    { rx: 182, ry: 34, tier: 'rs1' },
    { rx: 138, ry: 26, tier: 'rs2' },
    { rx: 98, ry: 20, tier: 'rs3' },
  ],
  broken: [
    'M 128 196 A 500 118 0 0 1 408 98',
    'M 408 98 A 500 118 0 0 1 688 98',
    'M 688 98 A 500 118 0 0 1 1128 196',
    'M 178 228 A 450 92 0 0 0 1078 228',
    'M 228 168 A 400 72 0 0 1 1028 168',
  ],
  segments: [
    'M 148 196 A 480 110 0 0 1 1108 196',
    'M 198 158 A 430 78 0 0 1 1058 158',
    'M 248 232 A 380 58 0 0 0 1008 232',
  ],
  ticks: [238, 308, 378, 448, 518, 588, 658, 728, 798, 868, 938, 1008],
  radials: [0, 22, 45, 68, 90, 112, 135, 158, 180, 202, 225, 248, 270, 292, 315, 338],
  cross: [
    { x1: VAULT.cx - 420, y1: VAULT.cy, x2: VAULT.cx + 420, y2: VAULT.cy },
    { x1: VAULT.cx, y1: VAULT.cy - 88, x2: VAULT.cx, y2: VAULT.cy + 88 },
  ],
};

const UPPER = {
  main: 'M 18 42 C 168 2, 368 -8, 528 12 C 688 32, 848 62, 1108 98',
  companion: 'M -8 62 C 142 22, 342 12, 502 32 C 662 52, 822 82, 1082 118',
  faint: 'M 48 28 C 198 0, 398 -10, 558 10 C 718 30, 878 58, 1128 88',
  marker: { x: 688, y: 32 },
  fragments: [
    'M 188 88 C 288 68, 388 58, 488 68',
    'M 688 78 C 788 58, 888 48, 988 58',
  ],
};

/** 4 primary streams — A/B/C are structured memory corridors */
const PRIMARY = [
  {
    id: 'pa',
    corridor: true,
    band: true,
    wake: true,
    w: 4.2,
    z: 'behind',
    main: 'M 8 408 C 108 368, 228 318, 368 268 C 468 232, 528 208, 568 198 C 598 192, 612 194, 628 196',
    companion: 'M 28 398 C 128 358, 248 308, 388 258 C 488 222, 548 198, 588 188',
    side: 'M 108 338 C 168 318, 228 298, 288 278',
    channel: 'M 168 378 C 248 338, 328 298, 408 258',
    versionTrace: 'M 148 368 C 208 348, 268 328, 328 308 C 388 288, 448 268, 498 248',
    micro: [
      'M 88 388 C 148 368, 208 348, 268 328',
      'M 208 348 C 268 328, 328 308, 388 288',
      'M 288 308 C 348 288, 408 268, 468 248',
    ],
    nodes: [
      { x: 128, y: 348, tier: 'historical', kind: 'doc' },
      { x: 248, y: 298, tier: 'snapshot', kind: 'folder', trail: true, ghosts: 2 },
      { x: 348, y: 258, tier: 'active', kind: 'doc', trail: true, ghosts: 2 },
    ],
  },
  {
    id: 'pb',
    corridor: true,
    band: true,
    w: 3.15,
    z: 'mid',
    main: 'M 68 348 C 188 308, 308 268, 428 238 C 488 222, 548 212, 598 204 C 612 200, 620 198, 628 196',
    companion: 'M 48 338 C 168 298, 288 258, 408 228',
    history: 'M 88 318 C 148 298, 208 278, 268 258',
    versionTrace: 'M 128 328 C 188 308, 248 288, 308 268',
    micro: ['M 168 318 C 228 298, 288 278, 348 258'],
    nodes: [
      { x: 188, y: 308, tier: 'historical', kind: 'doc', trail: true, ghosts: 1 },
      { x: 388, y: 248, tier: 'snapshot', kind: 'archive', trail: true, ghosts: 2 },
    ],
  },
  {
    id: 'pc',
    corridor: true,
    w: 1.95,
    z: 'behind-upper',
    main: 'M 118 208 C 258 178, 398 158, 518 148 C 568 144, 598 158, 618 178 C 622 184, 625 190, 628 196',
    companion: 'M 98 198 C 238 168, 378 148, 498 138',
    versionTrace: 'M 178 188 C 258 168, 338 158, 418 148',
    nodes: [{ x: 258, y: 178, tier: 'saved', kind: 'check', trail: true, ghosts: 1 }],
  },
  {
    id: 'pd',
    corridor: true,
    band: true,
    wake: true,
    w: 3.35,
    z: 'front',
    main: 'M 148 388 C 248 348, 348 308, 448 268 C 518 242, 568 222, 608 210 C 618 206, 624 200, 628 196',
    companion: 'M 128 378 C 228 338, 328 298, 428 258',
    channel: 'M 198 368 C 298 328, 398 288, 498 248',
    nodes: [
      { x: 228, y: 328, tier: 'historical', kind: 'doc' },
      { x: 328, y: 288, tier: 'snapshot', kind: 'table', trail: true, ghosts: 2 },
    ],
  },
];

/** Fine converging filaments — memory pulses toward vault (12 total) */
const FILAMENTS = [
  { d: 'M 38 378 C 138 338, 238 298, 368 248 C 468 218, 548 204, 608 198', w: 0.32, o: 0.07 },
  { d: 'M 68 358 C 168 318, 268 278, 388 238 C 488 212, 568 202, 618 198', w: 0.28, o: 0.065 },
  { d: 'M 98 398 C 198 358, 298 318, 408 268 C 498 238, 568 218, 622 200', w: 0.3, o: 0.068 },
  { d: 'M 128 318 C 228 278, 328 248, 428 218 C 508 198, 578 192, 624 196', w: 0.26, o: 0.06 },
  { d: 'M 158 428 C 258 388, 358 348, 448 298 C 518 262, 578 228, 620 206', w: 0.24, o: 0.055, ghost: true },
  { d: 'M 188 268 C 288 238, 388 218, 478 208 C 548 200, 598 196, 626 196', w: 0.22, o: 0.05 },
  { d: 'M 218 388 C 318 348, 418 308, 508 268 C 568 242, 608 220, 628 200', w: 0.26, o: 0.058, ghost: true },
  { d: 'M 248 338 C 348 298, 448 258, 528 228 C 578 210, 612 200, 628 196', w: 0.24, o: 0.052 },
  { d: 'M -8 418 C 58 388, 128 348, 208 308 C 288 268, 388 238, 488 218', w: 0.22, o: 0.048, ghost: true },
  { d: 'M 18 308 C 118 278, 218 248, 318 228 C 418 208, 518 198, 598 196', w: 0.24, o: 0.052 },
  { d: 'M 48 428 C 148 388, 248 348, 348 308 C 418 278, 478 252, 528 232', w: 0.2, o: 0.045, ghost: true, fade: true },
  { d: 'M 168 448 C 268 408, 368 368, 448 328 C 518 298, 578 268, 618 236', w: 0.22, o: 0.05 },
];

const SECONDARY = [
  { d: 'M -18 428 C 58 398, 138 358, 228 318', o: 0.055, w: 0.42, ghost: true },
  { d: 'M 28 388 C 128 348, 228 308, 328 268', o: 0.05, w: 0.4 },
  { d: 'M 88 418 C 188 378, 288 338, 368 298', o: 0.048, w: 0.38, ghost: true },
  { d: 'M -8 288 C 88 258, 188 228, 288 208', o: 0.052, w: 0.4 },
  { d: 'M 148 118 C 288 98, 428 88, 548 98', o: 0.045, w: 0.36 },
  { d: 'M 188 438 C 288 398, 388 358, 468 318', o: 0.042, w: 0.35, ghost: true },
  { d: 'M 48 168 C 188 148, 328 138, 448 148', o: 0.04, w: 0.34 },
  { d: 'M 228 408 C 328 368, 428 328, 508 288', o: 0.038, w: 0.32, ghost: true },
  { d: 'M 108 248 C 228 228, 348 208, 448 198', o: 0.042, w: 0.36 },
  { d: 'M 288 128 C 408 108, 528 98, 628 108', o: 0.036, w: 0.32, ghost: true },
  { d: 'M 368 418 C 468 388, 568 358, 628 328', o: 0.034, w: 0.3, ghost: true },
  { d: 'M 8 198 C 128 178, 248 168, 368 178', o: 0.038, w: 0.34 },
];

const LOWER = {
  rings: [
    { cx: VAULT.cx - 18, cy: 258, rx: 428, ry: 58, tier: 'near' },
    { cx: VAULT.cx + 14, cy: 268, rx: 348, ry: 42, tier: 'mid' },
    { cx: VAULT.cx - 10, cy: 276, rx: 268, ry: 30, tier: 'mid-far' },
    { cx: VAULT.cx + 12, cy: 284, rx: 198, ry: 20, tier: 'far' },
    { cx: VAULT.cx - 6, cy: 292, rx: 138, ry: 14, tier: 'deep' },
    { cx: VAULT.cx + 4, cy: 300, rx: 88, ry: 9, tier: 'anchor' },
    { cx: VAULT.cx - 2, cy: 306, rx: 58, ry: 6, tier: 'core' },
  ],
  versionTrails: [
    'M 366 316 C 416 306, 466 298, 516 292',
    'M 486 308 C 536 300, 586 294, 636 290',
    'M 406 328 C 456 320, 506 314, 556 308',
  ],
  arcs: [
    'M 306 308 C 406 288, 506 278, 606 288 C 706 298, 806 318, 846 328',
    'M 346 322 C 446 312, 546 308, 646 312',
    'M 386 334 C 486 324, 586 318, 686 324',
    'M 426 342 C 526 334, 626 328, 726 334',
  ],
  markers: [
    { x: 406, y: 314, kind: 'doc', tier: 'historical' },
    { x: 546, y: 304, kind: 'stack', tier: 'historical' },
    { x: 686, y: 314, kind: 'archive', tier: 'historical' },
    { x: 486, y: 328, kind: 'folder', tier: 'historical' },
  ],
  dots: [
    { x: 446, y: 300 }, { x: 566, y: 296 }, { x: 686, y: 302 },
    { x: 506, y: 318 }, { x: 626, y: 314 }, { x: 746, y: 320 },
    { x: 566, y: 332 },
  ],
  vTicks: [
    { x: 506, y: 286 }, { x: 628, y: 284 }, { x: 748, y: 288 },
  ],
  radial: [
    'M 528 308 L 568 298', 'M 628 306 L 668 296', 'M 728 310 L 768 300',
  ],
};

const WAKE = { x: 128, y: 348 };
const RETRIEVAL =
  'M 128 348 C 188 328, 248 308, 348 258 C 418 238, 488 222, 548 212 C 588 206, 608 200, 622 198 C 626 197, 627 196, 628 196';
const SYNC =
  'M 628 196 C 758 194, 858 178, 958 152 C 1048 128, 1108 108, 1168 92';

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(Boolean(mq.matches));
    sync();
    mq.addEventListener?.('change', sync);
    mq.addListener?.(sync);
    return () => {
      mq.removeEventListener?.('change', sync);
      mq.removeListener?.(sync);
    };
  }, []);
  return reduced;
}

function NodeGlyph({ kind, size }) {
  const s = size * 0.54;
  switch (kind) {
    case 'folder':
      return (
        <path
          d={`M ${-s} ${-s * 0.12} L ${-s * 0.12} ${-s * 0.12} L 0 ${-s * 0.48} L ${s} ${-s * 0.48} L ${s} ${s} L ${-s} ${s} Z`}
          fill="rgba(45,212,191,0.16)"
          stroke="rgba(94,234,212,0.45)"
          strokeWidth="0.45"
        />
      );
    case 'archive':
      return (
        <>
          <rect x={-s * 0.62} y={-s * 0.52} width={s * 1.24} height={s} rx={0.35} fill="rgba(45,212,191,0.14)" stroke="rgba(94,234,212,0.42)" strokeWidth="0.42" />
          <line x1={-s * 0.32} y1={-s * 0.12} x2={s * 0.32} y2={-s * 0.12} stroke="rgba(94,234,212,0.32)" strokeWidth="0.34" />
        </>
      );
    case 'table':
      return (
        <>
          <rect x={-s * 0.68} y={-s * 0.68} width={s * 1.36} height={s * 1.36} rx={0.32} fill="rgba(45,212,191,0.1)" stroke="rgba(94,234,212,0.4)" strokeWidth="0.4" />
          <line x1={-s * 0.68} y1={0} x2={s * 0.68} y2={0} stroke="rgba(94,234,212,0.28)" strokeWidth="0.32" />
          <line x1={0} y1={-s * 0.68} x2={0} y2={s * 0.68} stroke="rgba(94,234,212,0.28)" strokeWidth="0.32" />
        </>
      );
    case 'stack':
      return (
        <>
          <ellipse cx={0} cy={s * 0.44} rx={s * 0.64} ry={s * 0.17} fill="rgba(45,212,191,0.12)" stroke="rgba(94,234,212,0.34)" strokeWidth="0.36" />
          <ellipse cx={0} cy={0} rx={s * 0.64} ry={s * 0.17} fill="rgba(45,212,191,0.14)" stroke="rgba(94,234,212,0.38)" strokeWidth="0.36" />
          <ellipse cx={0} cy={-s * 0.44} rx={s * 0.64} ry={s * 0.17} fill="rgba(45,212,191,0.16)" stroke="rgba(94,234,212,0.42)" strokeWidth="0.36" />
        </>
      );
    case 'check':
      return (
        <>
          <rect x={-s * 0.62} y={-s * 0.62} width={s * 1.24} height={s * 1.24} rx={0.32} fill="rgba(45,212,191,0.12)" stroke="rgba(94,234,212,0.4)" strokeWidth="0.42" />
          <path d={`M ${-s * 0.22} ${0} L ${-s * 0.04} ${s * 0.22} L ${s * 0.28} ${-s * 0.26}`} stroke="#5eead4" strokeWidth="0.52" strokeLinecap="round" fill="none" />
        </>
      );
    default:
      return (
        <>
          <rect x={-s * 0.52} y={-s * 0.72} width={s * 1.04} height={s * 1.44} rx={0.32} fill="rgba(45,212,191,0.14)" stroke="rgba(94,234,212,0.42)" strokeWidth="0.42" />
          <line x1={-s * 0.28} y1={-s * 0.34} x2={s * 0.34} y2={-s * 0.34} stroke="rgba(94,234,212,0.3)" strokeWidth="0.34" />
          <line x1={-s * 0.28} y1={-s * 0.02} x2={s * 0.34} y2={-s * 0.02} stroke="rgba(94,234,212,0.24)" strokeWidth="0.3" />
          <line x1={-s * 0.28} y1={s * 0.3} x2={s * 0.14} y2={s * 0.3} stroke="rgba(94,234,212,0.2)" strokeWidth="0.28" />
        </>
      );
  }
}

function SnapNode({ x, y, tier, kind, reduced, expand }) {
  const spec = {
    historical: { s: 9, o: 0.52 },
    snapshot: { s: 10.5, o: 0.68 },
    saved: { s: 9.5, o: 0.58 },
    active: { s: 11.5, o: 0.95 },
  }[tier] || { s: 9.2, o: 0.55 };
  const h = spec.s / 2;
  return (
    <g className={`ma-repo-v3-node ma-repo-v3-node-${tier}${expand ? ' ma-repo-v3-node-expand' : ''}`} transform={`translate(${x} ${y})`}>
      <rect x={-h} y={-h} width={spec.s} height={spec.s} rx={0.55} fill="rgba(4,12,16,0.82)" stroke="rgba(45,212,191,0.55)" strokeWidth="0.85" />
      <g opacity={spec.o}><NodeGlyph kind={kind || 'doc'} size={spec.s} /></g>
      {expand && !reduced ? (
        <>
          <rect className="ma-repo-v3-version-layer" x={-h - 5} y={-h - 5} width={spec.s + 10} height={spec.s + 10} rx={0.6} fill="none" stroke="#5eead4" strokeWidth="0.48" />
          <rect className="ma-repo-v3-version-layer ma-repo-v3-version-layer-2" x={-h - 10} y={-h - 10} width={spec.s + 20} height={spec.s + 20} rx={0.7} fill="none" stroke="rgba(94,234,212,0.45)" strokeWidth="0.38" />
          <rect className="ma-repo-v3-version-layer ma-repo-v3-version-layer-3" x={-h - 15} y={-h - 15} width={spec.s + 30} height={spec.s + 30} rx={0.8} fill="none" stroke="rgba(94,234,212,0.28)" strokeWidth="0.32" />
        </>
      ) : null}
    </g>
  );
}

function VersionGhosts({ x, y, reduced, count = 3 }) {
  if (reduced) return null;
  const frames = [
    { ox: -16, w: 4.8, h: 3, o: 0.32 },
    { ox: -10, w: 4, h: 2.5, o: 0.2 },
    { ox: -5, w: 3.2, h: 2, o: 0.12 },
  ].slice(0, count);
  return (
    <g className="ma-repo-v3-version-trail" transform={`translate(${x} ${y})`}>
      {frames.map((f, i) => (
        <rect key={i} x={f.ox} y={-f.h / 2} width={f.w} height={f.h} rx={0.28} fill="#2dd4bf" opacity={f.o} />
      ))}
    </g>
  );
}

function PrimaryStream({ stream, reduced }) {
  const zMap = { front: 'ma-repo-v3-primary-front', mid: 'ma-repo-v3-primary-mid', behind: 'ma-repo-v3-primary-behind', 'behind-upper': 'ma-repo-v3-primary-behind' };
  const bodyW = stream.w * 1.85;
  const corridorCls = stream.corridor ? ` ma-repo-v3-corridor ma-repo-v3-corridor-${stream.id}` : '';
  return (
    <g className={`ma-repo-v3-primary ma-repo-v3-memory-stream ${zMap[stream.z] || 'ma-repo-v3-primary-behind'}${corridorCls}`}>
      {stream.band ? (
        <path d={stream.main} className="ma-repo-v3-primary-body" stroke="rgba(45,212,191,0.2)" strokeWidth={bodyW * 0.55} strokeLinecap="round" fill="none" />
      ) : null}
      {stream.channel ? <path d={stream.channel} className="ma-repo-v3-stream-channel" stroke="rgba(45,212,191,0.16)" strokeWidth="0.62" strokeDasharray="3 8" fill="none" /> : null}
      {stream.history ? <path d={stream.history} className="ma-repo-v3-history-trail" stroke="rgba(45,212,191,0.14)" strokeWidth="0.55" strokeDasharray="2 7" fill="none" /> : null}
      {stream.versionTrace ? <path d={stream.versionTrace} className="ma-repo-v3-version-trace" stroke="rgba(94,234,212,0.22)" strokeWidth="0.48" strokeDasharray="4 6" fill="none" /> : null}
      {stream.micro?.map((d, i) => (
        <path key={`mic${i}`} d={d} className="ma-repo-v3-stream-micro" stroke="rgba(45,212,191,0.1)" strokeWidth="0.38" strokeDasharray="2 5" fill="none" />
      ))}
      <path className="ma-repo-v3-primary-main" d={stream.main} stroke="url(#ma-repo-v3-stream-mid)" strokeWidth={stream.w} strokeLinecap="round" fill="none" />
      <path d={stream.companion} className="ma-repo-v3-stream-companion" stroke="rgba(45,212,191,0.28)" strokeWidth={stream.w * 0.48} strokeLinecap="round" fill="none" />
      {stream.side ? <path d={stream.side} className="ma-repo-v3-stream-side" stroke="rgba(94,234,212,0.32)" strokeWidth="0.68" fill="none" /> : null}
      {stream.id === 'pa' && !reduced ? (
        <path className="ma-repo-v3-retrieval-prelight" d={stream.main} stroke="rgba(94,234,212,0.35)" strokeWidth={stream.w + 0.8} strokeLinecap="round" fill="none" />
      ) : null}
      {stream.corridor && !reduced ? (
        <>
          <path
            className={`ma-repo-v3-stream-energy ma-repo-v3-stream-energy-${stream.id}`}
            d={stream.main}
            stroke="rgba(94,234,212,0.52)"
            strokeWidth={stream.w + 0.55}
            strokeLinecap="round"
            fill="none"
            strokeDasharray="26 660"
          />
          <path
            className={`ma-repo-v3-stream-energy-2 ma-repo-v3-stream-energy-2-${stream.id}`}
            d={stream.main}
            stroke="rgba(45,212,191,0.28)"
            strokeWidth={stream.w * 0.58}
            strokeLinecap="round"
            fill="none"
            strokeDasharray="12 700"
          />
          <path
            className={`ma-repo-v3-stream-pulse ma-repo-v3-stream-pulse-${stream.id}`}
            d={stream.main}
            stroke="rgba(94,234,212,0.38)"
            strokeWidth={stream.w + 1.2}
            strokeLinecap="round"
            fill="none"
            strokeDasharray="18 720"
          />
        </>
      ) : null}
      {!reduced ? (
        <path
          className={`ma-repo-v3-primary-carrier${stream.wake ? ' ma-repo-v3-carrier-wake' : ''}`}
          d={stream.main}
          stroke="rgba(94,234,212,0.45)"
          strokeWidth={stream.w + 0.15}
          strokeLinecap="round"
          fill="none"
          strokeDasharray="28 760"
        />
      ) : null}
      {stream.nodes?.map((n) => (
        <React.Fragment key={`${stream.id}-${n.x}`}>
          <SnapNode x={n.x} y={n.y} tier={n.tier} kind={n.kind} reduced={reduced} expand={n.tier === 'active'} />
          {n.trail ? <VersionGhosts x={n.x - 12} y={n.y} reduced={reduced} count={n.ghosts || 3} /> : null}
        </React.Fragment>
      ))}
    </g>
  );
}

function FilamentStream({ filament, reduced, index }) {
  const isPre = PRE_FILAMENT_INDICES.includes(index);
  const pulseDur = 4.6 + (index % 5) * 0.8;
  return (
    <g className={`ma-repo-v3-filament ma-repo-v3-filament-${index}${filament.ghost ? ' is-ghost' : ''}${filament.fade ? ' is-fade' : ''}${isPre ? ' ma-repo-v3-filament-pre' : ''}`}>
      <path d={filament.d} stroke={`rgba(45,212,191,${filament.o})`} strokeWidth={filament.w} strokeLinecap="round" fill="none" />
      {!reduced ? (
        <>
          <path
            className="ma-repo-v3-filament-pulse"
            d={filament.d}
            stroke="rgba(94,234,212,0.35)"
            strokeWidth={filament.w + 0.08}
            strokeLinecap="round"
            fill="none"
            strokeDasharray="6 720"
            style={{ animationDelay: `${index * -1.4}s`, animationDuration: `${pulseDur}s` }}
          />
          <path
            className="ma-repo-v3-filament-pulse-2"
            d={filament.d}
            stroke="rgba(94,234,212,0.22)"
            strokeWidth={filament.w + 0.04}
            strokeLinecap="round"
            fill="none"
            strokeDasharray="4 760"
            style={{ animationDelay: `${index * -2.1}s`, animationDuration: `${pulseDur + 1.2}s` }}
          />
        </>
      ) : null}
    </g>
  );
}

function GhostStream({ strand, reduced, index = 0 }) {
  return (
    <g className={`ma-repo-v3-secondary-strand ma-repo-v3-secondary-${index % 4}`}>
      <path className={`ma-repo-v3-secondary-path${strand.ghost ? ' is-ghost' : ''}`} d={strand.d} stroke={`rgba(45,212,191,${strand.o + 0.02})`} strokeWidth={strand.w} strokeLinecap="round" fill="none" />
      {!reduced ? (
        <>
          <path className="ma-repo-v3-secondary-carrier" d={strand.d} stroke="rgba(45,212,191,0.14)" strokeWidth={strand.w + 0.06} strokeDasharray="4 640" fill="none" style={{ animationDelay: `${index * -1.8}s` }} />
          <path className="ma-repo-v3-secondary-pulse" d={strand.d} stroke="rgba(94,234,212,0.22)" strokeWidth={strand.w + 0.12} strokeDasharray="8 680" fill="none" style={{ animationDelay: `${index * -2.4}s` }} />
        </>
      ) : null}
    </g>
  );
}

function MovingPacket({ packet, reduced }) {
  if (reduced) return null;
  const sz = packet.small ? 5.5 : packet.tier === 'primary' ? 8 : 7;
  const h = sz / 2;
  const tier = packet.tier || 'secondary';
  const ghostFrames = packet.ghosts
    ? [
        { ox: -14, w: 4.6, h: 3, o: 0.28 },
        { ox: -8, w: 3.8, h: 2.4, o: 0.16 },
      ].slice(0, packet.ghosts)
    : [];
  return (
    <g className={`ma-repo-v3-ambient-packet ma-repo-v3-packet-${packet.id} ma-repo-v3-packet-tier-${tier}`}>
      <g className="ma-repo-v3-packet-motion">
        {ghostFrames.map((f, i) => (
          <rect
            key={`pg${i}`}
            className={`ma-repo-v3-packet-ghost ma-repo-v3-packet-ghost-${i}`}
            x={-h + f.ox}
            y={-f.h / 2}
            width={f.w}
            height={f.h}
            rx={0.28}
            fill="#2dd4bf"
            opacity={f.o}
          />
        ))}
        {packet.trail ? (
          <g className="ma-repo-v3-packet-trails">
            <rect x={-h - 10} y={-1.2} width={4.2} height={2.8} rx={0.28} fill="#2dd4bf" opacity="0.32" />
            <rect x={-h - 16} y={-0.9} width={3.4} height={2.2} rx={0.22} fill="#2dd4bf" opacity="0.18" />
            <rect x={-h - 20} y={-0.6} width={2.6} height={1.6} rx={0.18} fill="#2dd4bf" opacity="0.1" />
          </g>
        ) : null}
        <g className="ma-repo-v3-packet-body">
          <rect x={-h} y={-h} width={sz} height={sz} rx={0.5} fill="rgba(4,12,16,0.88)" stroke="#5eead4" strokeWidth="0.62" />
          <g opacity="0.85" transform={`scale(${sz / 10})`}>
            <NodeGlyph kind={packet.kind} size={10} />
          </g>
        </g>
        <animateMotion path={packet.path} dur={packet.dur} begin={packet.begin} repeatCount="indefinite" rotate="auto" />
      </g>
    </g>
  );
}

function ArchiveBatchBurst({ reduced }) {
  if (reduced) return null;
  return (
    <g className="ma-repo-v3-batch-burst">
      {BATCH_PACKETS.map((bp, i) => (
        <g key={`batch${i}`} className={`ma-repo-v3-batch-packet ma-repo-v3-batch-${i} ma-repo-v3-batch-${bp.role}`}>
          <rect x={-2.4} y={-1.7} width={4.8} height={3.4} rx={0.3} fill="rgba(4,12,16,0.85)" stroke="#5eead4" strokeWidth="0.5" />
          <line x1={-1.6} y1={-0.4} x2={1.6} y2={-0.4} stroke="rgba(94,234,212,0.38)" strokeWidth="0.35" />
          <animateMotion path={BATCH_PATH} dur={LOOP} begin={bp.begin} repeatCount="indefinite" rotate="auto" />
        </g>
      ))}
    </g>
  );
}

function PacketAbsorption({ reduced }) {
  if (reduced) return null;
  return (
    <g className="ma-repo-v3-absorption-wrap" transform={`translate(${VAULT.cx} ${VAULT.cy})`}>
      <circle className="ma-repo-v3-absorption-ring" cx={0} cy={0} r={20} fill="none" stroke="rgba(94,234,212,0.42)" strokeWidth="0.55" />
      <circle className="ma-repo-v3-absorption-ring-2" cx={0} cy={0} r={14} fill="none" stroke="rgba(45,212,191,0.28)" strokeWidth="0.45" />
      <rect className="ma-repo-v3-absorption-packet" x={-4.2} y={-3} width={8.4} height={6} rx={0.42} fill="rgba(4,12,16,0.88)" stroke="#5eead4" strokeWidth="0.58" />
      <rect className="ma-repo-v3-absorption-trail" x={-6} y={-1.2} width={3.2} height={2.4} rx={0.22} fill="#2dd4bf" opacity="0.22" />
    </g>
  );
}

function BackgroundMicro({ reduced }) {
  if (reduced) return null;
  const pulses = [
    { d: 'M 268 168 C 368 158, 468 148, 568 142', delay: -1.5, w: 0.38 },
    { d: 'M 308 358 C 408 328, 508 298, 588 268', delay: -3.2, w: 0.34 },
    { d: 'M 148 248 C 248 228, 348 208, 448 198', delay: -4.6, w: 0.32 },
  ];
  return (
    <g className="ma-repo-v3-bg-micro">
      {pulses.map((p, i) => (
        <path
          key={`bgp${i}`}
          className={`ma-repo-v3-bg-pulse ma-repo-v3-bg-pulse-${i}`}
          d={p.d}
          stroke="rgba(94,234,212,0.24)"
          strokeWidth={p.w}
          strokeLinecap="round"
          fill="none"
          strokeDasharray="6 640"
          style={{ animationDelay: `${p.delay}s` }}
        />
      ))}
    </g>
  );
}

function LowerFieldIdle({ reduced }) {
  if (reduced) return null;
  const path = 'M 366 316 C 416 306, 466 298, 516 292 C 566 286, 616 284, 666 282';
  return (
    <g className="ma-repo-v3-lower-idle-packet">
      <rect x={-2.2} y={-1.5} width={4.4} height={3} rx={0.28} fill="rgba(4,12,16,0.82)" stroke="#5eead4" strokeWidth="0.45" />
      <animateMotion path={path} dur="8.1s" begin="0.4s" repeatCount="indefinite" rotate="auto" />
    </g>
  );
}

function RoutePulseLayer({ reduced }) {
  if (reduced) return null;
  return (
    <g className="ma-repo-v3-route-pulses">
      {ROUTE_PULSES.map((rp) => (
        <path
          key={rp.id}
          className={`ma-repo-v3-route-pulse-ambient ma-repo-v3-route-pulse-${rp.id}`}
          d={rp.d}
          stroke="rgba(94,234,212,0.42)"
          strokeWidth={rp.w}
          strokeLinecap="round"
          fill="none"
          strokeDasharray="32 680"
          style={{ animationDelay: `${rp.delay}s` }}
        />
      ))}
    </g>
  );
}

function VaultEdgeSweep({ reduced }) {
  if (reduced) return null;
  return (
    <g className="ma-repo-v3-vault-edge-sweep-wrap" transform={`translate(${VAULT.cx} ${VAULT.cy})`}>
      <path className="ma-repo-v3-vault-edge-sweep" d="M -76,-52 L 76,-52 L 86,0 L 76,52" fill="none" stroke="rgba(94,234,212,0.45)" strokeWidth="0.85" strokeLinecap="round" />
      <path className="ma-repo-v3-vault-edge-sweep-2" d="M -76,52 L -86,0 L -76,-52" fill="none" stroke="rgba(94,234,212,0.38)" strokeWidth="0.72" strokeLinecap="round" />
    </g>
  );
}

function RadialScan({ reduced }) {
  if (reduced) return null;
  return (
    <g className="ma-repo-v3-radial-scan-wrap" transform={`translate(${VAULT.cx} ${VAULT.cy})`}>
      <line className="ma-repo-v3-radial-scan" x1={0} y1={0} x2={108} y2={-36} stroke="rgba(94,234,212,0.48)" strokeWidth="0.55" strokeLinecap="round" />
    </g>
  );
}

function Backdrop() {
  const scans = [360, 420, 480, 540, 600, 660, 720, 780, 840, 900, 960];
  return (
    <g className="ma-repo-v3-backdrop">
      {scans.map((x) => (
        <line key={x} className="ma-repo-v3-scan-line" x1={x} y1={38} x2={x} y2={372} />
      ))}
      <path d="M 148 118 C 308 98, 468 88, 628 98 C 788 108, 948 128, 1100 148" stroke="rgba(45,212,191,0.045)" strokeWidth="0.48" fill="none" />
    </g>
  );
}

function LowerField({ reduced }) {
  return (
    <g className="ma-repo-v3-lower-field">
      {LOWER.versionTrails?.map((d, i) => (
        <path key={`lvt${i}`} className="ma-repo-v3-lower-version-trail" d={d} fill="none" />
      ))}
      {!reduced ? (
        <>
          <path className="ma-repo-v3-lower-idle-trail" d="M 406 328 C 456 320, 506 314, 556 308" fill="none" stroke="rgba(45,212,191,0.16)" strokeWidth="0.42" strokeDasharray="2 6" />
          <LowerFieldIdle reduced={reduced} />
        </>
      ) : null}
      {!reduced ? (
        <path className="ma-repo-v3-lower-event-path" d="M 486 308 C 536 300, 586 294, 636 290 C 686 286, 736 284, 786 282" fill="none" stroke="rgba(94,234,212,0.28)" strokeWidth="0.48" strokeDasharray="3 7" />
      ) : null}
      {LOWER.rings.map((ring, i) => (
        <ellipse
          key={`lr${i}`}
          className={`ma-repo-v3-lower-ring ma-repo-v3-lower-ring-${i} ma-repo-v3-lower-tier-${ring.tier}${i >= 2 && i <= 5 ? ' ma-repo-v3-lower-trace-ring' : ''}`}
          cx={ring.cx}
          cy={ring.cy}
          rx={ring.rx}
          ry={ring.ry}
          fill="none"
        />
      ))}
      {LOWER.arcs.map((d, i) => (
        <path key={`la${i}`} className="ma-repo-v3-lower-arc" d={d} fill="none" />
      ))}
      {LOWER.radial.map((d, i) => (
        <path key={`lrad${i}`} className="ma-repo-v3-lower-radial" d={d} fill="none" />
      ))}
      {LOWER.dots.map((d, i) => (
        <circle key={`ld${i}`} className="ma-repo-v3-lower-dot" cx={d.x} cy={d.y} r="1.2" fill="#2dd4bf" />
      ))}
      {LOWER.vTicks.map((t, i) => (
        <line key={`vt${i}`} className="ma-repo-v3-lower-vtick" x1={t.x} y1={t.y - 7} x2={t.x} y2={t.y + 7} />
      ))}
      {LOWER.markers.map((m, i) => (
        <g key={`lm${m.x}`} className={`ma-repo-v3-lower-marker ma-repo-v3-lower-marker-${i}`}>
          <SnapNode x={m.x} y={m.y} tier={m.tier} kind={m.kind} reduced={reduced} expand={false} />
        </g>
      ))}
    </g>
  );
}

function IndexField({ reduced }) {
  const { cx, cy } = INDEX;
  return (
    <g className="ma-repo-v3-index-field">
      <g className="ma-repo-v3-index-expand-wrap" transform={`translate(${cx} ${cy})`}>
        {INDEX.resolveRings?.map((ring) => (
          <ellipse
            key={ring.tier}
            className={`ma-repo-v3-index-resolve-ring ma-repo-v3-index-resolve-${ring.tier}`}
            cx={0}
            cy={0}
            rx={ring.rx}
            ry={ring.ry}
            fill="none"
          />
        ))}
        {INDEX.rings.map((ring) => (
          <ellipse key={ring.tier} className={`ma-repo-v3-index-ring ma-repo-v3-index-ring-${ring.tier} ma-repo-v3-index-plane-${ring.plane}`} cx={0} cy={0} rx={ring.rx} ry={ring.ry} fill="none" />
        ))}
        {!reduced ? (
          <>
            <ellipse className="ma-repo-v3-index-resolve" cx={0} cy={0} rx={188} ry={30} fill="none" stroke="#2dd4bf" strokeWidth="0.75" />
            <ellipse className="ma-repo-v3-vault-intake-ring" cx={0} cy={0} rx={118} ry={38} fill="none" stroke="rgba(94,234,212,0.22)" strokeWidth="0.58" />
          </>
        ) : null}
      </g>
      {INDEX.segments.map((d, i) => (
        <path key={`seg${i}`} className="ma-repo-v3-index-segment" d={d} fill="none" />
      ))}
      {INDEX.broken.map((d, i) => (
        <path key={`brk${i}`} className="ma-repo-v3-index-broken" d={d} fill="none" />
      ))}
      {INDEX.cross.map((l, i) => (
        <line key={`cr${i}`} className="ma-repo-v3-index-cross" x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
      ))}
      {INDEX.ticks.map((tx) => (
        <line key={tx} className="ma-repo-v3-index-tick" x1={tx} y1={cy - 14} x2={tx} y2={cy + 14} />
      ))}
      {INDEX.radials.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            className="ma-repo-v3-index-radial"
            x1={cx + Math.cos(rad) * 96}
            y1={cy + Math.sin(rad) * 96 * 0.32}
            x2={cx + Math.cos(rad) * 142}
            y2={cy + Math.sin(rad) * 142 * 0.32}
          />
        );
      })}
    </g>
  );
}

function SecuritySeal({ reduced }) {
  const ticks = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340];
  const s = LOCK_SCALE;
  return (
    <g className="ma-repo-v3-security-seal" transform={`scale(${s})`}>
      <ellipse cx={0} cy={2} rx={54} ry={42} fill="rgba(45,212,191,0.08)" stroke="rgba(94,234,212,0.38)" strokeWidth="0.72" />
      <ellipse className="ma-repo-v3-seal-index-ring" cx={0} cy={2} rx={50} ry={38} fill="none" stroke="rgba(94,234,212,0.28)" strokeWidth="0.52" strokeDasharray="5 3 2 3" />
      <ellipse className="ma-repo-v3-seal-ring-outer" cx={0} cy={2} rx={46} ry={36} fill="none" stroke="rgba(94,234,212,0.42)" strokeWidth="0.65" strokeDasharray="8 5" />
      <ellipse className="ma-repo-v3-seal-ring-mid" cx={0} cy={2} rx={41} ry={32} fill="none" stroke="rgba(94,234,212,0.38)" strokeWidth="0.55" strokeDasharray="4 6" />
      <ellipse className="ma-repo-v3-seal-ring" cx={0} cy={2} rx={36} ry={28} fill="none" stroke="rgba(94,234,212,0.52)" strokeWidth="0.58" />
      <ellipse className="ma-repo-v3-seal-ring-inner" cx={0} cy={2} rx={26} ry={20} fill="rgba(45,212,191,0.06)" stroke="rgba(94,234,212,0.35)" strokeWidth="0.52" />
      {ticks.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            className={`ma-repo-v3-seal-tick ma-repo-v3-seal-tick-cascade ma-repo-v3-seal-tick-${i}`}
            style={{ animationDelay: `${i * -0.06}s` }}
            x1={Math.cos(rad) * 30}
            y1={2 + Math.sin(rad) * 30 * 0.72}
            x2={Math.cos(rad) * 38}
            y2={2 + Math.sin(rad) * 38 * 0.72}
            stroke="rgba(94,234,212,0.45)"
            strokeWidth="0.48"
          />
        );
      })}
      {[[-34, -14], [34, -14], [-34, 18], [34, 18]].map(([x, y]) => (
        <path
          key={`${x}-${y}`}
          className="ma-repo-v3-seal-bracket"
          d={`M ${x} ${y} L ${x + (x < 0 ? 8 : -8)} ${y} L ${x + (x < 0 ? 8 : -8)} ${y + (y < 0 ? 8 : -8)} L ${x} ${y + (y < 0 ? 8 : -8)}`}
          fill="none"
          stroke="rgba(94,234,212,0.38)"
          strokeWidth="0.48"
        />
      ))}
      <circle className="ma-repo-v3-seal-node" cx={-42} cy={-4} r="1.8" fill="#5eead4" opacity="0.55" />
      <circle className="ma-repo-v3-seal-node" cx={42} cy={-4} r="1.8" fill="#5eead4" opacity="0.55" />
      <circle className="ma-repo-v3-seal-node" cx={0} cy={38} r="1.5" fill="#5eead4" opacity="0.48" />
      <circle className="ma-repo-v3-seal-node" cx={-28} cy={30} r="1.2" fill="#2dd4bf" opacity="0.4" />
      <circle className="ma-repo-v3-seal-node" cx={28} cy={30} r="1.2" fill="#2dd4bf" opacity="0.4" />
      <circle className="ma-repo-v3-seal-node" cx={0} cy={-32} r="1.4" fill="#2dd4bf" opacity="0.42" />
      {!reduced ? (
        <>
          <path className="ma-repo-v3-seal-sweep" d="M 0 -34 A 34 26 0 0 1 34 2" fill="none" stroke="rgba(94,234,212,0.55)" strokeWidth="0.62" strokeLinecap="round" />
          <path className="ma-repo-v3-seal-counter" d="M 34 2 A 34 26 0 0 1 0 38" fill="none" stroke="rgba(94,234,212,0.38)" strokeWidth="0.52" strokeLinecap="round" />
        </>
      ) : null}
    </g>
  );
}

function SecurityLock() {
  const s = LOCK_SCALE;
  return (
    <g className="ma-repo-v3-security-lock" transform={`scale(${s})`}>
      <ellipse className="ma-repo-v3-lock-mount" cx={0} cy={9} rx={22} ry={7} fill="rgba(4,10,14,0.78)" stroke="rgba(45,212,191,0.22)" strokeWidth="0.45" />
      <ellipse className="ma-repo-v3-lock-shadow" cx={0} cy={11} rx={18} ry={5} fill="rgba(2,6,10,0.72)" />
      <ellipse className="ma-repo-v3-lock-outer-ring" cx={0} cy={4} rx={22} ry={20} fill="none" stroke="rgba(94,234,212,0.58)" strokeWidth="0.72" />
      <ellipse className="ma-repo-v3-lock-halo" cx={0} cy={4} rx={20} ry={18} fill="url(#ma-repo-v3-lock-glow)" />
      <g className="ma-repo-v3-lock-shackle-rear">
        <path
          d="M -11 -18 C -11 -28, 11 -28, 11 -18"
          fill="none"
          stroke="rgba(45,212,191,0.32)"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <ellipse cx={0} cy={-26} rx={4} ry={2} fill="rgba(94,234,212,0.14)" />
      </g>
      <g className="ma-repo-v3-lock-shackle">
        <path
          d="M -11 -18 C -11 -28, 11 -28, 11 -18"
          fill="none"
          stroke="#5eead4"
          strokeWidth="1.45"
          strokeLinecap="round"
        />
        <path
          d="M -11 -18 C -11 -28, 11 -28, 11 -18"
          fill="none"
          stroke="rgba(94,234,212,0.35)"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.45"
        />
        <line x1={-11} y1={-18} x2={-11} y2={-9} stroke="#5eead4" strokeWidth="1.15" strokeLinecap="round" />
        <line x1={11} y1={-18} x2={11} y2={-9} stroke="#5eead4" strokeWidth="1.15" strokeLinecap="round" />
        <ellipse cx={0} cy={-27} rx={3.2} ry={1.6} fill="rgba(94,234,212,0.22)" />
      </g>
      <rect
        className="ma-repo-v3-lock-backplate"
        x={-14}
        y={-9}
        width={28}
        height={24}
        rx={3.2}
        fill="rgba(2,8,12,0.88)"
        stroke="rgba(45,212,191,0.18)"
        strokeWidth="0.42"
      />
      <rect
        className="ma-repo-v3-lock-body"
        x={-13}
        y={-10}
        width={26}
        height={22}
        rx={3}
        fill="url(#ma-repo-v3-lock-body-fill)"
        stroke="#5eead4"
        strokeWidth="1.15"
      />
      <rect x={-10} y={-7} width={20} height={16} rx={1.6} fill="rgba(45,212,191,0.2)" />
      <rect x={-9} y={-6} width={4} height={14} rx={0.5} fill="rgba(94,234,212,0.14)" />
      <ellipse className="ma-repo-v3-lock-specular" cx={-5} cy={-5} rx={6} ry={3.5} fill="rgba(94,234,212,0.18)" />
      <circle className="ma-repo-v3-lock-keyhole-top" cx={0} cy={-1} r={3.4} fill="rgba(1,6,10,0.96)" stroke="#5eead4" strokeWidth="0.72" />
      <rect className="ma-repo-v3-lock-keyhole-slot" x={-1.2} y={1.2} width={2.4} height={7.5} rx={0.5} fill="rgba(1,6,10,0.98)" stroke="rgba(94,234,212,0.52)" strokeWidth="0.45" />
    </g>
  );
}

function RecordGlyph({ reduced }) {
  return (
    <g className="ma-repo-v3-archive-glyph">
      <ellipse className="ma-repo-v3-chamber-recess" cx={0} cy={4} rx={44} ry={32} fill="rgba(2,6,10,0.92)" stroke="rgba(45,212,191,0.3)" strokeWidth="0.58" />
      <ellipse className="ma-repo-v3-glyph-nucleus" cx={0} cy={0} rx={52} ry={38} fill="url(#ma-repo-v3-nucleus-glow)" />
      <ellipse cx={0} cy={0} rx={48} ry={34} fill="rgba(2,8,12,0.88)" stroke="rgba(45,212,191,0.32)" strokeWidth="0.68" />
      <g className="ma-repo-v3-chamber-depth" opacity="0.65">
        <rect x={-36} y={-28} width={72} height={56} rx={2} fill="none" stroke="rgba(45,212,191,0.14)" strokeWidth="0.42" />
        {[-24, -12, 0, 12, 24].map((bx) => (
          <line key={bx} x1={bx} y1={16} x2={bx} y2={26} stroke="rgba(94,234,212,0.24)" strokeWidth="0.38" strokeLinecap="round" />
        ))}
        {[-18, -6, 6, 18].map((tx) => (
          <line key={`t${tx}`} x1={tx - 4} y1={28} x2={tx + 4} y2={28} stroke="rgba(45,212,191,0.18)" strokeWidth="0.35" strokeLinecap="round" />
        ))}
      </g>
      <g className="ma-repo-v3-archive-record" opacity="0.72">
        <rect x={-28} y={-42} width={56} height={38} rx={2.2} fill="rgba(45,212,191,0.12)" stroke="rgba(94,234,212,0.42)" strokeWidth="0.72" />
        {[-32, -24, -16, -8, 0].map((y) => (
          <line key={y} x1={-20} y1={y} x2={20} y2={y} stroke="rgba(94,234,212,0.38)" strokeWidth="0.48" strokeLinecap="round" />
        ))}
        {[0, 1, 2].map((i) => (
          <rect key={i} className={`ma-repo-v3-glyph-bar ma-repo-v3-glyph-bar-${i}`} x={-12 + i * 2} y={-46} width={9} height={2.4} rx={0.32} fill="rgba(94,234,212,0.4)" />
        ))}
      </g>
      <SecuritySeal reduced={reduced} />
      <SecurityLock />
    </g>
  );
}

function VaultMicroDetail() {
  const dots = [
    { x: -82, y: -18 }, { x: 82, y: -18 }, { x: -72, y: 22 }, { x: 72, y: 22 },
    { x: -58, y: -38 }, { x: 58, y: -38 }, { x: 0, y: -48 },
  ];
  const ticks = [
    { x1: -68, y1: -52, x2: -62, y2: -48 }, { x1: 68, y1: -52, x2: 62, y2: -48 },
    { x1: -88, y1: 0, x2: -82, y2: 0 }, { x1: 88, y1: 0, x2: 82, y2: 0 },
  ];
  return (
    <g className="ma-repo-v3-vault-micro">
      <path d="M -92,-28 A 92 48 0 0 1 92,-28" stroke="rgba(45,212,191,0.14)" strokeWidth="0.42" fill="none" strokeDasharray="3 6" />
      <path d="M -78,36 A 78 38 0 0 0 78,36" stroke="rgba(45,212,191,0.12)" strokeWidth="0.38" fill="none" strokeDasharray="2 5" />
      {dots.map((d, i) => (
        <circle key={`vd${i}`} className={`ma-repo-v3-vault-dot ma-repo-v3-vault-dot-${i % 3}`} cx={d.x} cy={d.y} r="0.9" fill="#2dd4bf" />
      ))}
      {ticks.map((t, i) => (
        <line key={`vt${i}`} className="ma-repo-v3-vault-micro-tick" x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="rgba(94,234,212,0.28)" strokeWidth="0.42" strokeLinecap="round" />
      ))}
    </g>
  );
}

function VaultCaustics({ reduced }) {
  if (reduced) return null;
  return (
    <g className="ma-repo-v3-caustics">
      <line className="ma-repo-v3-caustic ma-repo-v3-caustic-0" x1={-76} y1={-48} x2={-68} y2={-42} stroke="rgba(94,234,212,0.45)" strokeWidth="0.55" strokeLinecap="round" />
      <line className="ma-repo-v3-caustic ma-repo-v3-caustic-1" x1={74} y1={-46} x2={68} y2={-40} stroke="rgba(94,234,212,0.38)" strokeWidth="0.48" strokeLinecap="round" />
      <line className="ma-repo-v3-caustic ma-repo-v3-caustic-2" x1={-8} y1={-52} x2={4} y2={-48} stroke="rgba(94,234,212,0.42)" strokeWidth="0.5" strokeLinecap="round" />
      <line className="ma-repo-v3-caustic ma-repo-v3-caustic-3" x1={42} y1={38} x2={36} y2={32} stroke="rgba(94,234,212,0.35)" strokeWidth="0.45" strokeLinecap="round" />
    </g>
  );
}

function SnapshotOrbit({ reduced }) {
  if (reduced) return null;
  const orbits = [
    { cls: 'ma-repo-v3-orbit-ghost-0', x: -14, y: -8 },
    { cls: 'ma-repo-v3-orbit-ghost-1', x: 10, y: -12 },
    { cls: 'ma-repo-v3-orbit-ghost-2', x: -4, y: 10 },
  ];
  return (
    <g className="ma-repo-v3-orbit-group" transform={`translate(${VAULT.cx} ${VAULT.cy})`}>
      {orbits.map((o) => (
        <rect key={o.cls} className={`ma-repo-v3-orbit-ghost ${o.cls}`} x={o.x} y={o.y} width={5.5} height={3.8} rx={0.35} fill="rgba(45,212,191,0.22)" stroke="rgba(94,234,212,0.42)" strokeWidth="0.42" />
      ))}
    </g>
  );
}

function VerticalBeam({ reduced }) {
  if (reduced) return null;
  return (
    <g className="ma-repo-v3-vertical-beam">
      <line className="ma-repo-v3-vault-beam" x1={VAULT.cx} y1={VAULT.cy + 54} x2={VAULT.cx} y2={292} stroke="rgba(45,212,191,0.22)" strokeWidth="0.55" strokeDasharray="4 8" />
      <circle className="ma-repo-v3-beam-pulse" cx={VAULT.cx} cy={268} r="2.2" fill="#5eead4" />
    </g>
  );
}

function VaultWings() {
  return (
    <g className="ma-repo-v3-vault-wings">
      <polygon className="ma-repo-v3-wing-left" points="-248,-26 -172,-56 -172,56 -248,26" fill="url(#ma-repo-v3-wing-left)" stroke="rgba(45,212,191,0.22)" strokeWidth="0.62" />
      <polygon className="ma-repo-v3-wing-right" points="248,-26 172,-56 172,56 248,26" fill="url(#ma-repo-v3-wing-right)" stroke="rgba(45,212,191,0.22)" strokeWidth="0.62" />
    </g>
  );
}

function VaultAnchor() {
  return (
    <g className="ma-repo-v3-memory-anchor">
      <ellipse cx={0} cy={72} rx={188} ry={30} fill="rgba(45,212,191,0.05)" stroke="rgba(45,212,191,0.3)" strokeWidth="0.65" />
      <ellipse cx={0} cy={78} rx={142} ry={20} fill="rgba(45,212,191,0.04)" stroke="rgba(45,212,191,0.24)" strokeWidth="0.58" />
      <ellipse cx={0} cy={84} rx={98} ry={12} fill="rgba(45,212,191,0.1)" stroke="rgba(94,234,212,0.35)" strokeWidth="0.52" />
      <line x1={0} y1={46} x2={0} y2={90} stroke="rgba(45,212,191,0.24)" strokeWidth="0.55" strokeDasharray="2 5" />
      <circle className="ma-repo-v3-ref-node" cx={0} cy={86} r={4.2} fill="rgba(94,234,212,0.58)" />
      <circle cx={0} cy={86} r={7.5} fill="none" stroke="rgba(45,212,191,0.2)" strokeWidth="0.45" />
      {[-98, -49, 0, 49, 98].map((ox) => (
        <line key={ox} x1={ox - 32} y1={80} x2={ox + 32} y2={80} stroke="rgba(45,212,191,0.12)" strokeWidth="0.4" />
      ))}
    </g>
  );
}

function Vault({ reduced }) {
  return (
    <g className="ma-repo-v3-vault" transform={`translate(${VAULT.cx} ${VAULT.cy})`}>
      <ellipse className="ma-repo-v3-vault-breathe" cx={0} cy={2} rx={112} ry={70} fill="url(#ma-repo-v3-breathe-glow)" />
      <VaultAnchor />
      <VaultWings />
      <VaultMicroDetail />
      {SHELLS.map((sh) => (
        <polygon
          key={sh.tier}
          className={`ma-repo-v3-vault-shell ma-repo-v3-vault-${sh.tier}${['rear', 'mid', 'front', 'index-frame'].includes(sh.tier) ? ` ma-repo-v3-shell-cascade-${sh.tier}` : ''}`}
          points={octPoints(sh.r, sh.sy, sh.sx, sh.ox, sh.oy)}
          fill={sh.fill}
          stroke={sh.stroke}
          strokeWidth={sh.sw}
        />
      ))}
      <ellipse className="ma-repo-v3-vault-refraction" cx={0} cy={0} rx={54} ry={38} fill="url(#ma-repo-v3-refraction-fill)" />
      <polygon
        className="ma-repo-v3-vault-face-frame"
        points="-76,-52 76,-52 86,0 76,52 -76,52 -86,0"
        fill="rgba(4,10,14,0.62)"
        stroke="rgba(94,234,212,0.48)"
        strokeWidth="0.82"
      />
      <ellipse className="ma-repo-v3-vault-ring-inner" cx={0} cy={2} rx={76} ry={48} fill="rgba(2,8,12,0.92)" stroke="rgba(45,212,191,0.45)" strokeWidth="0.78" />
      <ellipse className="ma-repo-v3-vault-ring-core" cx={0} cy={2} rx={56} ry={36} fill="rgba(4,12,16,0.82)" stroke="rgba(94,234,212,0.58)" strokeWidth="0.72" />
      <g className="ma-repo-v3-inner-chamber">
        <RecordGlyph reduced={reduced} />
      </g>
      <VaultCaustics reduced={reduced} />
      <circle className="ma-repo-v3-vault-intake" cx={0} cy={2} r={22} fill="url(#ma-repo-v3-intake-glow)" />
      <circle className="ma-repo-v3-lock-micro-pulse" cx={0} cy={4} r={30} fill="none" stroke="rgba(94,234,212,0.55)" strokeWidth="0.75" />
      <ellipse className="ma-repo-v3-lock-local-halo" cx={0} cy={4} rx={34} ry={28} fill="url(#ma-repo-v3-lock-glow)" />
      {!reduced ? (
        <ellipse className="ma-repo-v3-vault-activate-halo" cx={0} cy={2} rx={102} ry={64} fill="none" stroke="#5eead4" strokeWidth="0.92" />
      ) : null}
    </g>
  );
}

function RetrievalTracer({ reduced }) {
  if (reduced) return null;
  return (
    <g className="ma-repo-v3-tracer-retrieval ma-repo-v3-tracer-signature">
      <path className="ma-repo-v3-retrieval-prelight" d={RETRIEVAL} stroke="rgba(94,234,212,0.32)" strokeWidth="5.8" strokeLinecap="round" fill="none" />
      <path className="ma-repo-v3-tracer-prelight" d={RETRIEVAL} stroke="rgba(94,234,212,0.28)" strokeWidth="4.6" strokeLinecap="round" fill="none" />
      <path className="ma-repo-v3-tracer-wake" d={RETRIEVAL} stroke="#5eead4" strokeWidth="3.8" strokeLinecap="round" fill="none" />
      <path className="ma-repo-v3-tracer-tail" d={RETRIEVAL} stroke="rgba(94,234,212,0.62)" strokeWidth="1.55" strokeDasharray="24 680" fill="none" />
      <path className="ma-repo-v3-tracer-tail-2" d={RETRIEVAL} stroke="rgba(45,212,191,0.32)" strokeWidth="2.8" strokeDasharray="10 720" fill="none" />
      <path className="ma-repo-v3-tracer-residual" d={RETRIEVAL} stroke="rgba(45,212,191,0.22)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <g className="ma-repo-v3-tracer-head-wrap">
        <g className="ma-repo-v3-tracer-version-ghosts">
          <rect x={-18} y={-2.2} width={4.2} height={2.8} rx={0.28} fill="#2dd4bf" opacity="0.22" />
          <rect x={-12} y={-2} width={3.6} height={2.4} rx={0.24} fill="#2dd4bf" opacity="0.14" />
        </g>
        <rect className="ma-repo-v3-tracer-marker" x={-4.2} y={-4.2} width={8.4} height={8.4} rx={0.55} fill="rgba(4,12,16,0.9)" stroke="#5eead4" strokeWidth="0.72" />
        <circle className="ma-repo-v3-tracer-head" r="6.2" fill="#5eead4" />
        <circle className="ma-repo-v3-tracer-head-core" r="2.8" fill="rgba(4,12,16,0.85)" />
        <animateMotion path={RETRIEVAL} dur={LOOP} begin="2.5s" repeatCount="indefinite" rotate="0" />
      </g>
    </g>
  );
}

function SyncTracer({ reduced }) {
  if (reduced) return null;
  return (
    <g className="ma-repo-v3-tracer-sync">
      <path className="ma-repo-v3-sync-prelight" d={SYNC} stroke="rgba(94,234,212,0.28)" strokeWidth="3.8" strokeLinecap="round" fill="none" />
      <path className="ma-repo-v3-sync-route" d={SYNC} stroke="rgba(94,234,212,0.72)" strokeWidth="2.85" strokeLinecap="round" fill="none" />
      <path className="ma-repo-v3-sync-wake" d={SYNC} stroke="#5eead4" strokeWidth="1.65" strokeLinecap="round" fill="none" />
      <path className="ma-repo-v3-sync-tail" d={SYNC} stroke="rgba(94,234,212,0.45)" strokeWidth="1.05" strokeDasharray="14 520" fill="none" />
      <g className="ma-repo-v3-sync-head-wrap">
        <rect className="ma-repo-v3-sync-marker" x={-2.6} y={-2.6} width={5.2} height={5.2} rx={0.38} fill="#5eead4" />
        <circle className="ma-repo-v3-sync-head" r="3.6" fill="#5eead4" />
        <animateMotion path={SYNC} dur={LOOP} begin="6.4s" repeatCount="indefinite" rotate="0" />
      </g>
    </g>
  );
}

function ArchiveRipple({ reduced }) {
  if (reduced) return null;
  const { cx, cy } = VAULT;
  const tickAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <g className="ma-repo-v3-ripple-group">
      <ellipse className="ma-repo-v3-ripple" cx={cx} cy={cy} rx={168} ry={28} fill="none" stroke="#2dd4bf" strokeWidth="0.78" />
      <path className="ma-repo-v3-ripple-arc" d={`M ${cx - 168} ${cy} A 168 28 0 0 1 ${cx + 168} ${cy}`} fill="none" stroke="#5eead4" strokeWidth="0.65" />
      {tickAngles.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const ix = cx + Math.cos(rad) * 148;
        const iy = cy + Math.sin(rad) * 24;
        const ox = cx + Math.cos(rad) * 162;
        const oy = cy + Math.sin(rad) * 26;
        return (
          <line
            key={deg}
            className={`ma-repo-v3-ripple-tick ma-repo-v3-ripple-tick-${i}`}
            x1={ix}
            y1={iy}
            x2={ox}
            y2={oy}
            stroke="rgba(94,234,212,0.55)"
            strokeWidth="0.52"
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}

function PanelEcho({ reduced }) {
  if (reduced) return null;
  return (
    <g className="ma-repo-v3-panel-echo">
      <ellipse className="ma-repo-v3-panel-reflection" cx={1120} cy={168} rx={88} ry={52} fill="rgba(45,212,191,0.06)" />
      <ellipse cx={1120} cy={168} rx={82} ry={46} fill="rgba(45,212,191,0.05)" />
      <circle className="ma-repo-v3-sync-endpoint" cx={1168} cy={92} r="4" fill="none" stroke="#5eead4" strokeWidth="0.68" />
    </g>
  );
}

function Residual({ reduced }) {
  if (reduced) return null;
  return <path className="ma-repo-v3-residual" d="M 878 142 C 958 122, 1038 102, 1106 92" stroke="rgba(45,212,191,0.3)" strokeWidth="1" fill="none" />;
}

export function RepositoryStreamFieldVisual() {
  const reduced = useReducedMotion();

  return (
    <div className="ma-repo-v3-field ma-repo-archive-field ma-repo-stream-field" aria-hidden="true">
      <svg className="ma-repo-v3-svg ma-repo-archive-svg ma-repo-stream-svg" viewBox="0 0 1200 420" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ma-repo-v3-fade" x1="0" y1="0.5" x2="1" y2="0.5">
            <stop offset="0%" stopColor="white" stopOpacity="0.22" />
            <stop offset="14%" stopColor="white" stopOpacity="0.42" />
            <stop offset="34%" stopColor="white" stopOpacity="0.72" />
            <stop offset="56%" stopColor="white" stopOpacity="1" />
            <stop offset="80%" stopColor="white" stopOpacity="0.88" />
            <stop offset="100%" stopColor="white" stopOpacity="0.14" />
          </linearGradient>
          <mask id="ma-repo-v3-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="420">
            <rect width="1200" height="420" fill="url(#ma-repo-v3-fade)" />
          </mask>
          <linearGradient id="ma-repo-v3-stream-mid" x1="0.04" y1="1" x2="0.96" y2="0">
            <stop offset="0%" stopColor="rgba(45,212,191,0)" />
            <stop offset="16%" stopColor="rgba(45,212,191,0.35)" />
            <stop offset="50%" stopColor="rgba(45,212,191,0.62)" />
            <stop offset="86%" stopColor="rgba(94,234,212,0.52)" />
            <stop offset="100%" stopColor="rgba(45,212,191,0)" />
          </linearGradient>
          <linearGradient id="ma-repo-v3-shell-rear-far" x1="0.22" y1="0" x2="0.78" y2="1">
            <stop offset="0%" stopColor="rgba(45,212,191,0.04)" />
            <stop offset="50%" stopColor="rgba(6,14,20,0.32)" />
            <stop offset="100%" stopColor="rgba(2,8,12,0.42)" />
          </linearGradient>
          <linearGradient id="ma-repo-v3-shell-rear" x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="rgba(45,212,191,0.07)" />
            <stop offset="50%" stopColor="rgba(8,18,24,0.42)" />
            <stop offset="100%" stopColor="rgba(4,10,14,0.52)" />
          </linearGradient>
          <linearGradient id="ma-repo-v3-shell-mid-rear" x1="0.18" y1="0" x2="0.82" y2="1">
            <stop offset="0%" stopColor="rgba(45,212,191,0.11)" />
            <stop offset="50%" stopColor="rgba(10,22,28,0.52)" />
            <stop offset="100%" stopColor="rgba(6,14,20,0.58)" />
          </linearGradient>
          <linearGradient id="ma-repo-v3-shell-mid" x1="0.15" y1="0" x2="0.85" y2="1">
            <stop offset="0%" stopColor="rgba(45,212,191,0.14)" />
            <stop offset="50%" stopColor="rgba(12,26,32,0.58)" />
            <stop offset="100%" stopColor="rgba(8,18,24,0.66)" />
          </linearGradient>
          <linearGradient id="ma-repo-v3-shell-mid-front" x1="0.12" y1="0" x2="0.88" y2="1">
            <stop offset="0%" stopColor="rgba(45,212,191,0.18)" />
            <stop offset="48%" stopColor="rgba(14,32,38,0.62)" />
            <stop offset="100%" stopColor="rgba(8,20,26,0.72)" />
          </linearGradient>
          <linearGradient id="ma-repo-v3-shell-front" x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor="rgba(45,212,191,0.24)" />
            <stop offset="45%" stopColor="rgba(16,38,44,0.68)" />
            <stop offset="100%" stopColor="rgba(6,14,20,0.78)" />
          </linearGradient>
          <linearGradient id="ma-repo-v3-shell-index" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="rgba(45,212,191,0.16)" />
            <stop offset="100%" stopColor="rgba(4,12,16,0.9)" />
          </linearGradient>
          <linearGradient id="ma-repo-v3-shell-record" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="rgba(94,234,212,0.14)" />
            <stop offset="100%" stopColor="rgba(2,6,10,0.94)" />
          </linearGradient>
          <linearGradient id="ma-repo-v3-wing-left" x1="1" y1="0.5" x2="0" y2="0.5">
            <stop offset="0%" stopColor="rgba(45,212,191,0.08)" />
            <stop offset="100%" stopColor="rgba(6,14,18,0.48)" />
          </linearGradient>
          <linearGradient id="ma-repo-v3-wing-right" x1="0" y1="0.5" x2="1" y2="0.5">
            <stop offset="0%" stopColor="rgba(45,212,191,0.08)" />
            <stop offset="100%" stopColor="rgba(6,14,18,0.48)" />
          </linearGradient>
          <radialGradient id="ma-repo-v3-nucleus-glow" cx="0.5" cy="0.42" r="0.58">
            <stop offset="0%" stopColor="rgba(94,234,212,0.65)" />
            <stop offset="55%" stopColor="rgba(45,212,191,0.28)" />
            <stop offset="100%" stopColor="rgba(8,16,22,0)" />
          </radialGradient>
          <radialGradient id="ma-repo-v3-chamber-glow" cx="0.5" cy="0.32" r="0.68">
            <stop offset="0%" stopColor="rgba(94,234,212,0.58)" />
            <stop offset="55%" stopColor="rgba(45,212,191,0.28)" />
            <stop offset="100%" stopColor="rgba(6,14,18,0.82)" />
          </radialGradient>
          <radialGradient id="ma-repo-v3-lock-glow" cx="0.5" cy="0.42" r="0.62">
            <stop offset="0%" stopColor="rgba(94,234,212,0.72)" />
            <stop offset="55%" stopColor="rgba(45,212,191,0.32)" />
            <stop offset="100%" stopColor="rgba(8,16,22,0)" />
          </radialGradient>
          <linearGradient id="ma-repo-v3-lock-body-fill" x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="rgba(45,212,191,0.26)" />
            <stop offset="35%" stopColor="rgba(12,28,32,0.78)" />
            <stop offset="100%" stopColor="rgba(2,8,12,0.94)" />
          </linearGradient>
          <radialGradient id="ma-repo-v3-intake-glow" cx="0.5" cy="0.5" r="0.52">
            <stop offset="0%" stopColor="rgba(94,234,212,0.68)" />
            <stop offset="100%" stopColor="rgba(45,212,191,0)" />
          </radialGradient>
          <radialGradient id="ma-repo-v3-breathe-glow" cx="0.5" cy="0.5" r="0.55">
            <stop offset="0%" stopColor="rgba(45,212,191,0.12)" />
            <stop offset="70%" stopColor="rgba(45,212,191,0.04)" />
            <stop offset="100%" stopColor="rgba(45,212,191,0)" />
          </radialGradient>
          <linearGradient id="ma-repo-v3-refraction-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(94,234,212,0.08)" />
            <stop offset="45%" stopColor="rgba(45,212,191,0.04)" />
            <stop offset="100%" stopColor="rgba(94,234,212,0.1)" />
          </linearGradient>
        </defs>

        <g mask="url(#ma-repo-v3-mask)" className={reduced ? 'ma-repo-v3-static' : 'ma-repo-v3-choreo'}>
          <g className="ma-repo-v3-plane-back">
            <Backdrop />
            {FILAMENTS.map((f, i) => (
              <FilamentStream key={`fil${i}`} filament={f} reduced={reduced} index={i} />
            ))}
            {SECONDARY.map((s, i) => (
              <GhostStream key={s.d} strand={s} reduced={reduced} index={i} />
            ))}
            <path className="ma-repo-v3-upper-faint" d={UPPER.faint} stroke="rgba(45,212,191,0.08)" strokeWidth="0.55" fill="none" />
            {UPPER.fragments.map((d, i) => (
              <path key={`uf${i}`} className="ma-repo-v3-upper-fragment" d={d} stroke="rgba(45,212,191,0.06)" strokeWidth="0.42" fill="none" />
            ))}
            <BackgroundMicro reduced={reduced} />
            <LowerField reduced={reduced} />
          </g>

          <IndexField reduced={reduced} />

          <g className="ma-repo-v3-plane-mid">
            <path className="ma-repo-v3-upper-main" d={UPPER.main} stroke="rgba(45,212,191,0.32)" strokeWidth="1.28" fill="none" />
            <path className="ma-repo-v3-upper-companion" d={UPPER.companion} stroke="rgba(45,212,191,0.12)" strokeWidth="0.62" strokeDasharray="4 10" fill="none" />
            {!reduced ? (
              <>
                <path className="ma-repo-v3-upper-pulse" d={UPPER.main} stroke="rgba(94,234,212,0.32)" strokeWidth="0.72" strokeDasharray="14 820" fill="none" />
                <path className="ma-repo-v3-upper-event" d="M 528 12 C 628 8, 728 18, 848 62" stroke="rgba(94,234,212,0.38)" strokeWidth="0.85" fill="none" />
                {[
                  { x: 528, y: 12 },
                  { x: 688, y: 32 },
                  { x: 848, y: 62 },
                ].map((p, i) => (
                  <circle key={`un${i}`} className={`ma-repo-v3-upper-node ma-repo-v3-upper-node-${i}`} cx={p.x} cy={p.y} r="2" fill="#2dd4bf" />
                ))}
                <g className="ma-repo-v3-upper-marker">
                  <circle cx={UPPER.marker.x} cy={UPPER.marker.y} r="2.4" fill="#2dd4bf" opacity="0.42" />
                  <rect x={UPPER.marker.x - 2.2} y={UPPER.marker.y - 1.6} width={4.4} height={3.2} rx={0.3} fill="rgba(45,212,191,0.12)" stroke="rgba(94,234,212,0.32)" strokeWidth="0.35" />
                </g>
              </>
            ) : null}
            {PRIMARY.filter((s) => s.z !== 'front').map((s) => (
              <PrimaryStream key={s.id} stream={s} reduced={reduced} />
            ))}
          </g>

          <Vault reduced={reduced} />
          <VaultEdgeSweep reduced={reduced} />
          <RadialScan reduced={reduced} />

          <g className="ma-repo-v3-plane-front">
            <g className="ma-repo-v3-ambient-layer">
              <RoutePulseLayer reduced={reduced} />
              {!reduced ? MOVING_PACKETS.map((p) => <MovingPacket key={p.id} packet={p} reduced={reduced} />) : null}
            </g>
            {!reduced ? <ArchiveBatchBurst reduced={reduced} /> : null}
            {PRIMARY.filter((s) => s.z === 'front').map((s) => (
              <PrimaryStream key={s.id} stream={s} reduced={reduced} />
            ))}
          </g>

          <g className="ma-repo-v3-signature ma-repo-v3-system-event">
            <VerticalBeam reduced={reduced} />
            <SnapshotOrbit reduced={reduced} />
            <g className="ma-repo-v3-wake-ring">
              <circle cx={WAKE.x} cy={WAKE.y} r="10" fill="none" stroke="#5eead4" strokeWidth="0.68" />
            </g>
            <SnapNode x={WAKE.x} y={WAKE.y} tier="historical" kind="doc" reduced={reduced} expand={false} />
            <RetrievalTracer reduced={reduced} />
            <PacketAbsorption reduced={reduced} />
            <ArchiveRipple reduced={reduced} />
            <SyncTracer reduced={reduced} />
            <Residual reduced={reduced} />
            <PanelEcho reduced={reduced} />
          </g>
        </g>
      </svg>
    </div>
  );
}
