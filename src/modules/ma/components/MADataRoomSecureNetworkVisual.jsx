import React, { useEffect, useState } from 'react';

/**
 * Data Room hero — P0 SECURE PROCESSING NETWORK rebuild (decor only).
 * Six-element architecture: ingest / process / upper arc / wide Core / destination / audit field.
 */

const LOOP = '9s';
const CORE = { x: 518, y: 198 };

const SOURCE = { x: 78, y: 352 };

const GATES = {
  classify: { x: 252, y: 312, type: 'classification' },
  encrypt: { x: 362, y: 242, type: 'encryption' },
  verify: { x: 798, y: 128, type: 'verification' },
};

const DESTINATION = { x: 1088, y: 108 };

/** Signature traveler — full secure-processing journey */
const SIGNATURE_PATH =
  'M 78 352 C 138 334, 198 322, 252 312 C 318 298, 392 268, 458 242 C 492 228, 512 212, 518 198' +
  ' C 568 162, 648 132, 728 124 C 820 116, 920 110, 1088 108';

const OUTBOUND_PATH =
  'M 518 198 C 568 162, 648 132, 728 124 C 820 116, 920 110, 1088 108';

/**
 * Three primary multi-layer corridors — deliberately non-parallel geometry.
 * A: lower-left ingestion sweep upward
 * B: mid-left background encryption approach
 * C: upper distribution arc toward metrics
 */
const CORRIDORS = [
  {
    id: 'ingest',
    role: 'ingest',
    main: 'M 78 352 C 148 328, 208 318, 252 312 C 332 294, 412 262, 478 232 C 502 220, 514 208, 518 198',
    companion: 'M 58 362 C 128 338, 188 326, 238 318 C 318 300, 398 270, 464 240 C 488 228, 508 214, 518 198',
    side: 'M 78 352 C 148 328, 208 318, 252 312 C 332 294, 412 262, 478 232',
    volume: 16,
    wMain: 2.6,
    wCompanion: 1.15,
    nodes: [
      { x: 148, y: 328 },
      { x: 252, y: 312 },
      { x: 412, y: 262 },
    ],
    plane: 'back',
  },
  {
    id: 'process',
    role: 'process',
    main: 'M 108 278 C 188 262, 268 248, 362 242 C 428 234, 482 218, 518 198',
    companion: 'M 92 268 C 172 252, 252 238, 346 232',
    side: 'M 108 278 C 188 262, 268 248, 362 242',
    volume: 13,
    wMain: 2.2,
    wCompanion: 0.95,
    nodes: [
      { x: 188, y: 262 },
      { x: 362, y: 242 },
    ],
    plane: 'back',
  },
  {
    id: 'distribute',
    role: 'distribute',
    main: OUTBOUND_PATH,
    companion: 'M 518 198 C 578 158, 668 128, 758 118 C 852 110, 968 106, 1108 102',
    side: 'M 518 198 C 578 158, 668 128, 758 118',
    volume: 14,
    wMain: 2.45,
    wCompanion: 1.05,
    nodes: [
      { x: 648, y: 132 },
      { x: 820, y: 116 },
      { x: 968, y: 106 },
    ],
    plane: 'front',
  },
];

const UPPER_ARC = {
  main: 'M 96 148 C 248 52, 438 38, 518 72 C 648 108, 860 128, 1148 142',
  companion: 'M 72 168 C 224 72, 414 58, 494 92 C 624 128, 836 148, 1124 162',
  faint: 'M 128 128 C 280 48, 468 32, 548 62 C 678 96, 888 116, 1120 128',
};

const AUDIT = {
  cx: 518,
  cy: 318,
  rings: [
    { rx: 380, ry: 46, depth: 'near' },
    { rx: 300, ry: 36, depth: 'mid' },
    { rx: 220, ry: 26, depth: 'mid' },
    { rx: 140, ry: 17, depth: 'far' },
    { rx: 72, ry: 11, depth: 'far' },
  ],
  ticks: [280, 340, 400, 460, 520, 580, 640, 700],
  records: [
    'M 300 302 C 380 298, 460 294, 538 290',
    'M 340 328 C 420 324, 500 320, 580 316',
    'M 380 342 C 460 338, 540 334, 620 330',
  ],
};

const BG_FRAGMENTS = [
  { d: 'M 48 318 C 220 278, 392 248, 580 228', o: 0.09 },
  { d: 'M 680 248 C 860 218, 1040 188, 1160 168', o: 0.08 },
  { d: 'M 160 198 C 320 178, 480 168, 640 178', o: 0.075 },
  { d: 'M 240 388 C 400 368, 560 348, 720 338', o: 0.085 },
  { d: 'M 880 278 C 980 258, 1080 238, 1160 222', o: 0.07 },
  { d: 'M 120 128 C 280 108, 440 98, 600 108', o: 0.065 },
  { d: 'M 420 388 L 580 388 L 580 348', o: 0.06 },
  { d: 'M 760 348 C 880 328, 1000 308, 1120 292', o: 0.072 },
  { d: 'M 280 248 A 180 40 0 0 1 640 228', o: 0.07 },
  { d: 'M 180 368 A 140 28 0 0 1 420 352', o: 0.068 },
];

const STATIC_PACKETS = [
  { x: 78, y: 352, tier: 'source', scale: 1.35 },
  { x: 332, y: 278, tier: 'mid', scale: 1.18 },
  { x: 968, y: 112, tier: 'dest', scale: 1.28 },
];

const TRAVELERS = [
  { signature: true, begin: '0s' },
  { ambient: true, path: CORRIDORS[1].main, dur: '11s', begin: '-4s' },
  { output: true, begin: '0s' },
];

/**
 * Multi-layer secure data ingestion — three depth families + upper network.
 * bg: atmospheric | mid: structural streams | fg: active ingestion routes
 */
const INGEST_BG = [
  { id: 'bg-far-ll', path: 'M -8 408 C 72 378, 168 348, 268 318 C 348 298, 408 278, 448 258', complete: false },
  { id: 'bg-ll-broad', path: 'M 24 398 C 108 362, 208 322, 318 278 C 388 252, 442 232, 478 218', complete: false },
  { id: 'bg-mid-drift', path: 'M 52 328 C 142 302, 242 278, 352 252 C 418 236, 468 222, 498 212' },
  { id: 'bg-low-cross', path: 'M 118 412 C 218 382, 328 348, 428 308 C 468 292, 498 278, 512 268', complete: false },
  { id: 'bg-lc-sweep', path: 'M 228 408 C 298 368, 368 328, 428 288 C 468 268, 498 252, 512 238' },
  { id: 'bg-deep-arc', path: 'M 8 368 C 88 338, 178 308, 278 278 C 358 258, 418 242, 458 228', complete: false },
];

const INGEST_MID = [
  {
    id: 'mid-ll-rise',
    path: 'M 38 388 C 118 348, 218 298, 338 252 C 408 228, 462 212, 498 204 C 510 200, 516 198, 518 198',
    companion: 'M 28 378 C 108 338, 208 288, 328 242',
    band: { parallel: 'M 48 398 C 128 358, 228 308, 348 262 C 418 238, 472 218, 508 208', segment: 'M 398 248 L 418 242 L 438 236' },
    pulseDelay: '-0.4s',
  },
  {
    id: 'mid-left-sweep',
    path: 'M 72 318 C 162 288, 262 258, 372 232 C 432 218, 478 208, 512 200 C 516 199, 517 198.5, 518 198',
    companion: 'M 58 308 C 148 278, 248 248, 358 222',
    pulseDelay: '-1.1s',
  },
  {
    id: 'mid-lc-arc',
    path: 'M 248 402 C 308 358, 368 312, 428 268 C 468 246, 498 228, 516 210 C 518 204, 518 201, 518 198',
    pulseDelay: '-1.4s',
  },
  {
    id: 'mid-wide',
    path: 'M 18 358 C 108 318, 218 272, 348 232 C 418 212, 472 202, 508 198 C 514 198, 516 198, 518 198',
    companion: 'M 32 368 C 122 328, 232 282, 362 242',
    microTicks: [{ x: 188, y: 298 }, { x: 298, y: 258 }],
    pulseDelay: '-1.9s',
  },
  {
    id: 'mid-compress',
    path: 'M 148 368 C 248 318, 358 268, 438 232 C 478 214, 504 206, 518 198',
    pulseDelay: '-2.1s',
  },
];

const INGEST_FG = [
  {
    id: 'fg-ll-primary',
    z: 'behind',
    path: 'M 12 378 C 98 338, 208 288, 348 238 C 418 214, 472 204, 508 198 C 514 198, 516 198, 518 198',
    companion: 'M 22 368 C 108 328, 218 278, 358 228',
    band: { parallel: 'M 32 388 C 118 348, 228 298, 368 248', segment: 'M 448 222 L 468 216 L 488 210' },
    burst: true,
    pulseDelay: '0s',
  },
  {
    id: 'fg-mid-active',
    z: 'front',
    path: 'M 108 348 C 208 308, 318 268, 418 232 C 468 214, 502 206, 518 198',
    companion: 'M 98 338 C 198 298, 308 258, 408 222',
    pulseDelay: '-0.5s',
  },
  {
    id: 'fg-lc-rush',
    z: 'front',
    path: 'M 188 408 C 268 358, 348 308, 418 258 C 462 236, 494 218, 516 204 C 518 200, 518 199, 518 198',
    band: { parallel: 'M 198 398 C 278 348, 358 298, 428 248', segment: 'M 478 212 L 496 206' },
    burst: true,
    pulseDelay: '-0.12s',
  },
];

const UPPER_NETWORK = [
  { id: 'up-arc-a', path: 'M 88 118 C 228 48, 418 32, 518 58 C 628 88, 820 108, 1080 122' },
  { id: 'up-arc-b', path: 'M 148 98 C 288 42, 468 28, 558 52 C 668 78, 860 98, 1040 112' },
  { id: 'up-arc-c', path: 'M 198 138 C 338 72, 498 58, 598 82 C 708 108, 880 122, 1120 132', faint: true },
];

const METRIC_LINK_FILAMENTS = [
  'M 518 198 C 648 168, 820 148, 980 132 C 1040 126, 1064 122, 1088 118',
  'M 568 162 C 720 142, 880 128, 1020 118',
];

const INGEST_BURST_PATHS = [
  'M 48 368 C 128 328, 228 278, 358 228 C 428 204, 488 198, 518 198',
  'M 88 348 C 168 308, 268 262, 388 222 C 448 202, 492 196, 518 198',
  'M 128 378 C 208 338, 308 288, 418 242 C 468 222, 502 208, 518 198',
  'M 168 358 C 248 318, 348 272, 438 232 C 478 214, 508 202, 518 198',
  'M 208 388 C 288 348, 378 302, 458 258 C 488 240, 508 218, 518 198',
];

/** Centralized packet choreography — primary / secondary / ghost tiers */
const INGEST_PACKETS = [
  { id: 'pkt-ghost', path: INGEST_BG[2].path, tier: 'ghost', form: 'dot', dur: '7.9s', begin: '0s' },
  { id: 'pkt-primary', path: INGEST_FG[0].path, tier: 'primary', form: 'capsule', dur: '4.8s', begin: '0.8s' },
  { id: 'pkt-sec-a', path: INGEST_MID[0].path, tier: 'secondary', form: 'doc', dur: '5.7s', begin: '1.1s' },
  { id: 'pkt-sec-b', path: INGEST_MID[2].path, tier: 'secondary', form: 'block', dur: '6.6s', begin: '1.4s' },
  { id: 'pkt-sec-c', path: INGEST_FG[1].path, tier: 'secondary', form: 'capsule', dur: '5.7s', begin: '2.1s' },
  { id: 'pkt-ghost-up', path: UPPER_NETWORK[1].path, tier: 'ghost', form: 'dot', dur: '9.1s', begin: '3.2s' },
];

function offsetBegin(delay, offsetSec) {
  const base = parseFloat(delay || '0');
  return `${base + offsetSec}s`;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return reduced;
}

function wideShieldPath(w, h) {
  return [
    `M 0 ${-h}`,
    `L ${w * 0.88} ${-h * 0.52}`,
    `L ${w} ${-h * 0.08}`,
    `L ${w * 0.92} ${h * 0.58}`,
    `L ${w * 0.42} ${h}`,
    `L ${-w * 0.42} ${h}`,
    `L ${-w * 0.92} ${h * 0.58}`,
    `L ${-w} ${-h * 0.08}`,
    `L ${-w * 0.88} ${-h * 0.52}`,
    'Z',
  ].join(' ');
}

function wideHexPath(w, h) {
  return [
    `M 0 ${-h}`,
    `L ${w} ${-h * 0.42}`,
    `L ${w} ${h * 0.42}`,
    `L 0 ${h}`,
    `L ${-w} ${h * 0.42}`,
    `L ${-w} ${-h * 0.42}`,
    'Z',
  ].join(' ');
}

function rhomboidPath(w, h) {
  return [`M 0 ${-h}`, `L ${w} 0`, `L 0 ${h}`, `L ${-w} 0`, 'Z'].join(' ');
}

function BackgroundPlane({ reduced }) {
  return (
    <g className="ma-vdr-net-back" aria-hidden="true">
      <rect x="0" y="0" width="1200" height="420" fill="url(#ma-vdr-net-grid)" opacity="0.45" />
      {BG_FRAGMENTS.map((frag, idx) => (
        <path
          key={`bg-${idx}`}
          className="ma-vdr-net-bg-fragment"
          d={frag.d}
          fill="none"
          stroke={`rgba(45, 212, 191, ${frag.o})`}
          strokeWidth="0.55"
          strokeLinecap="round"
          strokeDasharray="4 22"
        />
      ))}
      {[320, 520, 720].map((x) => (
        <circle key={`bg-node-${x}`} className="ma-vdr-net-bg-node" cx={x} cy={268} r="1.6" />
      ))}
      <path className="ma-vdr-net-upper-arc-faint ma-vdr-net-tablet-hide" d={UPPER_ARC.faint} fill="none" strokeLinecap="round" />
      <path className="ma-vdr-net-upper-arc-companion" d={UPPER_ARC.companion} fill="none" strokeLinecap="round" />
      <path className="ma-vdr-net-upper-arc-main" d={UPPER_ARC.main} fill="none" strokeLinecap="round" />
      {!reduced ? (
        <circle className="ma-vdr-net-upper-signal" r="2" fill="#5eead4" opacity="0">
          <animateMotion path={UPPER_ARC.main} dur="18s" repeatCount="indefinite" calcMode="linear" />
          <animate attributeName="opacity" values="0;0;0.45;0.55;0;0" keyTimes="0;0.42;0.48;0.54;0.62;1" dur="18s" repeatCount="indefinite" />
        </circle>
      ) : null}
      <UpperNetwork reduced={reduced} />
      <g className="ma-vdr-net-core-atmo" transform={`translate(${CORE.x} ${CORE.y})`} aria-hidden="true">
        <ellipse className="ma-vdr-net-atmo-bloom" cx="0" cy="6" rx="188" ry="68" fill="url(#ma-vdr-net-core-bloom)" />
        <ellipse className="ma-vdr-net-atmo-ring ma-vdr-net-atmo-ring-a" cx="0" cy="4" rx="156" ry="52" fill="none" />
        <ellipse className="ma-vdr-net-atmo-ring ma-vdr-net-atmo-ring-b" cx="0" cy="8" rx="128" ry="42" fill="none" strokeDasharray="18 42" />
        <path className="ma-vdr-net-atmo-arc ma-vdr-net-atmo-arc-a" d="M -168 -36 A 168 58 0 0 1 168 -36" fill="none" />
        <path className="ma-vdr-net-atmo-arc ma-vdr-net-atmo-arc-b" d="M -142 48 A 142 48 0 0 0 142 48" fill="none" />
        {[0, 72, 144, 216, 288].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line
              key={`atmo-rad-${deg}`}
              className="ma-vdr-net-atmo-radial"
              x1={Math.cos(rad) * 88}
              y1={Math.sin(rad) * 32}
              x2={Math.cos(rad) * 118}
              y2={Math.sin(rad) * 42}
            />
          );
        })}
      </g>
    </g>
  );
}

function UpperNetwork({ reduced }) {
  return (
    <g className="ma-vdr-net-upper-network" aria-hidden="true">
      {UPPER_NETWORK.map((arc) => (
        <path
          key={arc.id}
          className={`ma-vdr-net-upper-net ma-vdr-net-upper-net-${arc.id}${arc.faint ? ' ma-vdr-net-upper-net-faint' : ''}`}
          d={arc.path}
          fill="none"
          strokeLinecap="round"
        />
      ))}
      {!reduced ? (
        <circle className="ma-vdr-net-upper-net-packet" r="1.6" fill="#5eead4" opacity="0">
          <animateMotion path={UPPER_NETWORK[1].path} dur="9.1s" begin="3.2s" repeatCount="indefinite" calcMode="linear" />
          <animate attributeName="opacity" values="0;0;0.35;0.48;0.28;0" keyTimes="0;0.35;0.48;0.62;0.78;1" dur="9.1s" begin="3.2s" repeatCount="indefinite" />
        </circle>
      ) : null}
    </g>
  );
}

function IngestFilament({ filament, layer }) {
  const { id, path, companion, band, complete, microTicks, burst, pulseDelay } = filament;
  const isComplete = complete !== false;

  return (
    <g className={`ma-vdr-net-ingest ma-vdr-net-ingest-${layer} ma-vdr-net-ingest-${id}${burst ? ' ma-vdr-net-ingest-burst' : ''}`} aria-hidden="true">
      {layer === 'mid' ? (
        <path className="ma-vdr-net-ingest-glow" d={path} fill="none" strokeLinecap="round" />
      ) : null}
      <path className="ma-vdr-net-ingest-route" d={path} fill="none" strokeLinecap="round" />
      {companion ? <path className="ma-vdr-net-ingest-companion" d={companion} fill="none" strokeLinecap="round" /> : null}
      {band ? (
        <>
          <path className="ma-vdr-net-ingest-band-par" d={band.parallel} fill="none" strokeLinecap="round" />
          <path className="ma-vdr-net-ingest-band-seg" d={band.segment} fill="none" strokeLinecap="round" />
        </>
      ) : null}
      {isComplete ? (
        <>
          <path
            className="ma-vdr-net-ingest-pulse"
            d={path}
            fill="none"
            strokeLinecap="round"
            style={pulseDelay ? { animationDelay: pulseDelay } : undefined}
          />
          <path
            className="ma-vdr-net-ingest-pulse-head"
            d={path}
            fill="none"
            strokeLinecap="round"
            style={pulseDelay ? { animationDelay: pulseDelay } : undefined}
          />
        </>
      ) : null}
      {microTicks
        ? microTicks.map((tick, idx) => (
            <g key={`${id}-tick-${idx}`} transform={`translate(${tick.x} ${tick.y})`}>
              <line className="ma-vdr-net-ingest-micro-tick" x1="-3" y1="0" x2="3" y2="0" />
              <rect className="ma-vdr-net-ingest-micro-node" x="-1.8" y="-1.8" width="3.6" height="3.6" rx="0.4" />
            </g>
          ))
        : null}
    </g>
  );
}

function IngestLayer({ layer, items }) {
  if (!items.length) return null;
  return (
    <g className={`ma-vdr-net-ingest-layer ma-vdr-net-ingest-layer-${layer}`} aria-hidden="true">
      {items.map((filament) => (
        <IngestFilament key={filament.id} filament={filament} layer={layer} />
      ))}
    </g>
  );
}

function IngestBurst({ reduced }) {
  if (reduced) return null;
  return (
    <g className="ma-vdr-net-ingest-burst-group" aria-hidden="true">
      {INGEST_BURST_PATHS.map((path, idx) => (
        <path
          key={`burst-${idx}`}
          className={`ma-vdr-net-ingest-burst-flash ma-vdr-net-ingest-burst-flash-${idx}`}
          d={path}
          fill="none"
          stroke="#5eead4"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="12 420"
          opacity="0"
        />
      ))}
    </g>
  );
}

function PacketShape({ form, tier }) {
  if (form === 'dot') {
    return <circle r={tier === 'ghost' ? 1.4 : 1.8} fill="#2dd4bf" />;
  }
  if (form === 'block') {
    return (
      <g>
        <rect x="-3.5" y="-2.5" width="7" height="5" rx="0.5" fill="rgba(2, 8, 10, 0.72)" stroke="#5eead4" strokeWidth="0.5" />
        <line x1="-2.2" y1="0" x2="2.2" y2="0" stroke="#2dd4bf" strokeWidth="0.38" />
      </g>
    );
  }
  if (form === 'doc') {
    return (
      <g>
        <rect x="-3.2" y="-4" width="6.4" height="8" rx="0.5" fill="rgba(2, 8, 10, 0.68)" stroke="#5eead4" strokeWidth="0.48" />
        <line x1="-2" y1="-1.5" x2="2" y2="-1.5" stroke="#2dd4bf" strokeWidth="0.35" />
      </g>
    );
  }
  return (
    <g>
      <rect x="-4" y="-2.2" width="8" height="4.4" rx="1.2" fill="rgba(2, 8, 10, 0.75)" stroke="#5eead4" strokeWidth="0.55" />
      <circle cx="2.8" cy="0" r="0.9" fill="#5eead4" opacity="0.85" />
    </g>
  );
}

function IngestPacket({ packet, reduced }) {
  if (reduced) return null;
  const { id, path, tier, form, dur, begin } = packet;
  const trailBegin = offsetBegin(begin, -0.45);
  const wakeBegin = offsetBegin(begin, -0.22);
  const absorbOpacity =
    tier === 'primary'
      ? '0;0;0.95;0.92;0.78;0.42;0.12;0'
      : tier === 'secondary'
        ? '0;0;0.72;0.68;0.52;0.28;0'
        : '0;0;0.38;0.42;0.28;0.12;0';
  const absorbKeyTimes = '0;0.08;0.42;0.62;0.78;0.9;0.96;1';

  return (
    <g className={`ma-vdr-net-ingest-packet ma-vdr-net-ingest-packet-${tier} ma-vdr-net-ingest-packet-${id}`} opacity="0" aria-hidden="true">
      <path className="ma-vdr-net-ingest-packet-wake" d={path} fill="none" stroke="#5eead4" strokeWidth="2.8" strokeLinecap="round" strokeDasharray="6 420" opacity="0">
        <animate attributeName="stroke-dashoffset" values="420;0" dur={dur} begin={wakeBegin} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0;0;0.42;0.55;0.28;0" keyTimes="0;0.1;0.35;0.55;0.78;1" dur={dur} begin={wakeBegin} repeatCount="indefinite" />
      </path>
      <g>
        <PacketShape form={form} tier={tier} />
        <animateMotion path={path} dur={dur} begin={begin} repeatCount="indefinite" rotate="auto" calcMode="linear" />
        <animate attributeName="opacity" values={absorbOpacity} keyTimes={absorbKeyTimes} dur={dur} begin={begin} repeatCount="indefinite" />
      </g>
      {tier !== 'ghost' ? (
        <circle className="ma-vdr-net-ingest-packet-trail" r="1.2" fill="#2dd4bf" opacity="0">
          <animateMotion path={path} dur={dur} begin={trailBegin} repeatCount="indefinite" rotate="auto" calcMode="linear" />
          <animate attributeName="opacity" values="0;0;0.48;0.55;0.32;0" keyTimes="0;0.12;0.4;0.58;0.82;1" dur={dur} begin={trailBegin} repeatCount="indefinite" />
        </circle>
      ) : null}
    </g>
  );
}

function IngestPackets({ reduced }) {
  return (
    <g className="ma-vdr-net-ingest-packets" aria-hidden="true">
      {INGEST_PACKETS.map((packet) => (
        <IngestPacket key={packet.id} packet={packet} reduced={reduced} />
      ))}
    </g>
  );
}

function CoreIntakePort({ reduced }) {
  return (
    <g className="ma-vdr-net-intake-port" aria-hidden="true">
      <ellipse className="ma-vdr-net-intake-ring" cx="0" cy="-6" rx="30" ry="13" fill="none" />
      <ellipse className="ma-vdr-net-intake-frame" cx="0" cy="-4" rx="22" ry="9" fill="none" strokeDasharray="4 10" />
      <circle className="ma-vdr-net-intake-glow" cx="0" cy="-4" r="10" fill="url(#ma-vdr-net-intake-glow)" />
      {[-16, -5, 5, 16].map((tx) => (
        <line key={`intake-tick-${tx}`} className="ma-vdr-net-intake-tick" x1={tx} y1="-14" x2={tx} y2="-10" />
      ))}
      {!reduced ? (
        <>
          <circle className="ma-vdr-net-intake-react ma-vdr-net-intake-react-a" cx="0" cy="-4" r="14" fill="none" stroke="#5eead4" strokeWidth="0.55" opacity="0" />
          <circle className="ma-vdr-net-intake-react ma-vdr-net-intake-react-b" cx="0" cy="-4" r="18" fill="none" stroke="#5eead4" strokeWidth="0.48" opacity="0" />
          <circle className="ma-vdr-net-intake-react ma-vdr-net-intake-react-c" cx="0" cy="-4" r="12" fill="none" stroke="#2dd4bf" strokeWidth="0.42" opacity="0" />
          <ellipse className="ma-vdr-net-absorb-pull" cx="0" cy="-2" rx="20" ry="10" fill="url(#ma-vdr-net-absorb-pull)" opacity="0" />
        </>
      ) : null}
    </g>
  );
}

function AuditMemoryField({ reduced }) {
  const { cx, cy, rings, ticks, records } = AUDIT;
  return (
    <g className="ma-vdr-net-audit" aria-hidden="true">
      {rings.map((ring, idx) => (
        <ellipse
          key={`audit-ring-${idx}`}
          className={[
            'ma-vdr-net-audit-ring',
            ring.depth === 'near' ? 'ma-vdr-net-audit-ring-near' : '',
            ring.depth === 'mid' ? 'ma-vdr-net-audit-ring-mid' : '',
            ring.depth === 'far' ? 'ma-vdr-net-audit-ring-far' : '',
            idx === 0 ? 'ma-vdr-net-audit-pulse' : '',
            idx <= 2 ? 'ma-vdr-net-audit-ring-visible' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          cx={cx}
          cy={cy}
          rx={ring.rx}
          ry={ring.ry}
          fill="none"
        />
      ))}
      {ticks.map((x, idx) => (
        <line
          key={`tick-${x}`}
          className={`ma-vdr-net-audit-tick ma-vdr-net-audit-tick-${idx % 4}${idx < 6 ? ' ma-vdr-net-audit-tick-visible' : ''}`}
          x1={x}
          y1={cy - 16}
          x2={x}
          y2={cy + 8}
        />
      ))}
      {records.map((d, idx) => (
        <path key={`rec-${idx}`} className={`ma-vdr-net-audit-record ma-vdr-net-audit-record-${idx}`} d={d} fill="none" />
      ))}
      <g transform={`translate(${cx} ${cy})`}>
        <circle className="ma-vdr-net-audit-hub" r="5.5" fill="rgba(2, 10, 12, 0.72)" stroke="#2dd4bf" strokeWidth="0.72" />
        <circle className="ma-vdr-net-audit-hub-core" r="2.2" fill="#5eead4" opacity="0.55" />
      </g>
      {[360, 640].map((x) => (
        <g key={`audit-end-${x}`} transform={`translate(${x} ${cy - 6})`}>
          <circle className="ma-vdr-net-audit-endpoint" r="2.6" fill="#2dd4bf" opacity="0.42" />
        </g>
      ))}
      {!reduced ? (
        <>
          <path
            className="ma-vdr-net-audit-drop"
            d={`M ${DESTINATION.x} ${DESTINATION.y + 12} C 920 200, 720 260, ${cx} ${cy - 22}`}
            fill="none"
            stroke="#5eead4"
            strokeWidth="0.65"
            strokeDasharray="5 420"
            opacity="0"
          />
          <path className="ma-vdr-net-audit-write" d="M 380 310 L 460 306 L 540 302 L 620 298" fill="none" stroke="#5eead4" strokeWidth="0.55" strokeDasharray="3 6" opacity="0" />
          <path className="ma-vdr-net-audit-residual" d="M 400 318 L 500 314 L 600 310" fill="none" stroke="rgba(45, 212, 191, 0.32)" strokeWidth="0.48" strokeDasharray="2 6" opacity="0" />
        </>
      ) : null}
    </g>
  );
}

function CoreFloor({ x, y }) {
  return (
    <g className="ma-vdr-net-floor" transform={`translate(${x} ${y + 72})`} aria-hidden="true">
      <ellipse className="ma-vdr-net-floor-ring ma-vdr-net-floor-a" cx="0" cy="0" rx="138" ry="34" fill="none" />
      <ellipse className="ma-vdr-net-floor-ring ma-vdr-net-floor-b" cx="0" cy="8" rx="108" ry="26" fill="none" strokeDasharray="8 16" />
      <ellipse className="ma-vdr-net-floor-ring ma-vdr-net-floor-c" cx="0" cy="16" rx="76" ry="18" fill="none" />
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={`floor-mark-${deg}`}
            className="ma-vdr-net-floor-mark"
            x1={Math.cos(rad) * 52}
            y1={Math.sin(rad) * 14}
            x2={Math.cos(rad) * 68}
            y2={Math.sin(rad) * 18}
            stroke="rgba(45, 212, 191, 0.16)"
            strokeWidth="0.4"
          />
        );
      })}
    </g>
  );
}

function SecureCore({ reduced }) {
  const { x, y } = CORE;
  const shield = wideShieldPath(92, 52);
  const hex = wideHexPath(58, 38);
  const hexInner = wideHexPath(44, 28);

  const rhomboid = rhomboidPath(68, 78);

  return (
    <g className="ma-vdr-net-core" transform={`translate(${x} ${y})`} aria-hidden="true">
      <CoreFloor x={0} y={0} />
      <ellipse className="ma-vdr-net-core-bloom" cx="0" cy="2" rx="148" ry="54" fill="url(#ma-vdr-net-core-bloom-inner)" />
      <path className="ma-vdr-net-rhomboid-glow" d={rhomboid} fill="none" />
      <path className="ma-vdr-net-rhomboid-edge" d={rhomboid} fill="none" transform="scale(0.92)" />
      <ellipse className="ma-vdr-net-orbit ma-vdr-net-orbit-a" cx="0" cy="4" rx="132" ry="46" fill="none" transform="rotate(-14)" />
      <ellipse className="ma-vdr-net-orbit ma-vdr-net-orbit-b" cx="0" cy="6" rx="112" ry="38" fill="none" transform="rotate(22)" strokeDasharray="14 28" />
      <ellipse className="ma-vdr-net-orbit ma-vdr-net-orbit-c" cx="0" cy="8" rx="92" ry="30" fill="none" transform="rotate(-8)" strokeDasharray="6 18" />
      <path className="ma-vdr-net-scan-arc ma-vdr-net-scan-arc-a" d="M -92 -32 A 92 34 0 0 1 92 -32" fill="none" />
      <path className="ma-vdr-net-scan-arc ma-vdr-net-scan-arc-b" d="M -72 38 A 72 26 0 0 0 72 38" fill="none" />
      {/* Processing halo — broad horizontal field */}
      <ellipse className="ma-vdr-net-halo ma-vdr-net-halo-outer" cx="0" cy="4" rx="128" ry="42" fill="none" />
      <ellipse className="ma-vdr-net-halo ma-vdr-net-halo-mid" cx="0" cy="6" rx="102" ry="32" fill="none" strokeDasharray="12 28" />
      <ellipse className="ma-vdr-net-halo ma-vdr-net-halo-inner" cx="0" cy="8" rx="74" ry="22" fill="none" />
      <path className="ma-vdr-net-halo-angular" d={wideHexPath(118, 48)} fill="none" stroke="rgba(45, 212, 191, 0.14)" strokeWidth="0.48" strokeDasharray="6 18" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <line
            key={`halo-tick-${deg}`}
            className="ma-vdr-net-halo-tick"
            x1={Math.cos(rad) * 96}
            y1={Math.sin(rad) * 36}
            x2={Math.cos(rad) * 108}
            y2={Math.sin(rad) * 42}
            stroke="#2dd4bf"
            strokeWidth="0.38"
            opacity="0.28"
          />
        );
      })}
      {/* Shell stack — wide volumetric object */}
      <path className="ma-vdr-net-shell ma-vdr-net-shell-rear" d={shield} fill="url(#ma-vdr-net-shell-rear)" transform="scale(1.14)" opacity="0.82" />
      <path className="ma-vdr-net-shell ma-vdr-net-shell-mid" d={shield} fill="url(#ma-vdr-net-shell-mid)" transform="scale(1.06)" opacity="0.72" />
      <path className="ma-vdr-net-shell ma-vdr-net-shell-front" d={shield} fill="url(#ma-vdr-net-shell-front)" opacity="0.88" />
      <path className="ma-vdr-net-shell-edge ma-vdr-net-shell-edge-rear" d={shield} fill="none" transform="scale(1.1)" stroke="rgba(45, 212, 191, 0.12)" strokeWidth="0.45" />
      <path className="ma-vdr-net-shell-edge ma-vdr-net-shell-edge-front" d={shield} fill="none" stroke="rgba(94, 234, 212, 0.48)" strokeWidth="0.72" />
      <path className="ma-vdr-net-shell-rim" d={shield} fill="none" stroke="rgba(94, 234, 212, 0.22)" strokeWidth="1.2" transform="scale(1.02)" opacity="0.65" />
      <CoreIntakePort reduced={reduced} />
      {/* Inner chamber */}
      <path className="ma-vdr-net-chamber-outer ma-vdr-net-charge-1" d={hex} fill="url(#ma-vdr-net-chamber)" stroke="rgba(45, 212, 191, 0.22)" strokeWidth="0.48" />
      <path className="ma-vdr-net-chamber-inner ma-vdr-net-charge-2" d={hexInner} fill="url(#ma-vdr-net-chamber-inner)" stroke="rgba(94, 234, 212, 0.28)" strokeWidth="0.42" />
      <ellipse className="ma-vdr-net-chamber-glow ma-vdr-net-charge-2" cx="0" cy="0" rx="48" ry="28" fill="url(#ma-vdr-net-internal-glow)" />
      {/* Document chamber */}
      <g className="ma-vdr-net-doc-chamber">
        <rect x="-22" y="-26" width="44" height="52" rx="2" fill="rgba(1, 8, 10, 0.62)" stroke="rgba(94, 234, 212, 0.32)" strokeWidth="0.55" />
        <rect x="-17" y="-21" width="34" height="42" rx="1.2" fill="rgba(2, 10, 12, 0.55)" stroke="#5eead4" strokeWidth="0.65" />
        <path d="M -14 -21 L 8 -21 L 12 -16 L 12 18 L -17 18 L -17 -16 Z" fill="none" stroke="#2dd4bf" strokeWidth="0.48" opacity="0.58" />
        <line x1="-13" y1="-12" x2="9" y2="-12" stroke="#2dd4bf" strokeWidth="0.42" />
        <line x1="-13" y1="-4" x2="6" y2="-4" stroke="#2dd4bf" strokeWidth="0.38" opacity="0.68" />
        <line x1="-13" y1="4" x2="2" y2="4" stroke="#2dd4bf" strokeWidth="0.34" opacity="0.48" />
        <rect x="8" y="-19" width="3" height="3" rx="0.4" fill="rgba(94, 234, 212, 0.42)" stroke="#5eead4" strokeWidth="0.28" />
      </g>
      {/* Nucleus */}
      <circle className="ma-vdr-net-nucleus-halo ma-vdr-net-charge-3" r="34" fill="url(#ma-vdr-net-nucleus-halo)" />
      <circle className="ma-vdr-net-nucleus ma-vdr-net-charge-3" r="22" fill="url(#ma-vdr-net-nucleus)" stroke="#5eead4" strokeWidth="0.95" />
      <circle className="ma-vdr-net-nucleus-core ma-vdr-net-charge-peak" r="8" fill="url(#ma-vdr-net-nucleus-core)" />
      <circle className="ma-vdr-net-nucleus-dot" r="3.2" fill="#5eead4" />
      {[
        { px: 52, py: -18 },
        { px: -48, py: 22 },
        { px: 38, py: 32 },
        { px: -52, py: -8 },
      ].map((pt, idx) => (
        <circle key={`proc-${idx}`} className="ma-vdr-net-proc-node" cx={pt.px} cy={pt.py} r="1.8" fill="#5eead4" opacity="0.38" />
      ))}
      {!reduced ? (
        <>
          <circle className="ma-vdr-net-verify-ring" r="68" fill="none" stroke="#5eead4" strokeWidth="0.65" opacity="0" />
          <path className="ma-vdr-net-verify-hex" d={wideHexPath(78, 52)} fill="none" stroke="#2dd4bf" strokeWidth="0.58" opacity="0" />
          <circle className="ma-vdr-net-verify-pulse" r="58" fill="none" stroke="#5eead4" strokeWidth="0.62" opacity="0" />
          <circle className="ma-vdr-net-compress" r="48" fill="none" stroke="#5eead4" strokeWidth="0.55" strokeDasharray="10 32" opacity="0" />
          {!reduced ? (
            <line className="ma-vdr-net-core-scan" x1="-18" y1="-14" x2="18" y2="-14" stroke="#5eead4" strokeWidth="0.48" opacity="0" strokeLinecap="round" />
          ) : null}
        </>
      ) : null}
    </g>
  );
}

function CorridorRibbon({ corridor }) {
  return (
    <g className={`ma-vdr-net-corridor ma-vdr-net-corridor-${corridor.role}`} aria-hidden="true">
      <path className="ma-vdr-net-corridor-volume" d={corridor.main} strokeWidth={corridor.volume} fill="none" strokeLinecap="round" />
      <path className="ma-vdr-net-corridor-companion" d={corridor.companion} strokeWidth={corridor.wCompanion} fill="none" strokeLinecap="round" />
      <path className="ma-vdr-net-corridor-side" d={corridor.side} fill="none" strokeLinecap="round" strokeDasharray="2 10" />
      <path className="ma-vdr-net-corridor-main" d={corridor.main} strokeWidth={corridor.wMain} fill="none" strokeLinecap="round" />
      {corridor.nodes.map((node, idx) => (
        <g key={`${corridor.id}-node-${idx}`}>
          <circle className={`ma-vdr-net-node-halo ma-vdr-net-node-${corridor.role}-${idx}`} cx={node.x} cy={node.y} r="5" />
          <circle className="ma-vdr-net-node" cx={node.x} cy={node.y} r="2.4" />
        </g>
      ))}
    </g>
  );
}

function DocumentSource({ reduced }) {
  const { x, y } = SOURCE;
  return (
    <g className="ma-vdr-net-source" transform={`translate(${x} ${y})`} aria-hidden="true">
      <rect className="ma-vdr-net-source-glow" x="-28" y="-28" width="56" height="56" rx="6" fill="url(#ma-vdr-net-source-glow)" />
      <rect x="-22" y="-22" width="44" height="44" rx="4" fill="rgba(2, 8, 10, 0.78)" stroke="#2dd4bf" strokeWidth="0.85" />
      <rect x="-14" y="-16" width="22" height="28" rx="1.5" fill="rgba(3, 12, 14, 0.62)" stroke="#5eead4" strokeWidth="0.68" className="ma-vdr-net-source-doc" />
      <path d="M -11 -16 L 2 -16 L 5 -12 L 5 8 L -14 8 L -14 -12 Z" fill="none" stroke="#2dd4bf" strokeWidth="0.48" opacity="0.55" />
      <line x1="-11" y1="-8" x2="3" y2="-8" stroke="#5eead4" strokeWidth="0.45" opacity="0.62" />
      <line x1="-11" y1="-2" x2="0" y2="-2" stroke="#2dd4bf" strokeWidth="0.4" opacity="0.48" />
      <line x1="-11" y1="4" x2="-3" y2="4" stroke="#2dd4bf" strokeWidth="0.36" opacity="0.38" />
      <line className="ma-vdr-net-source-connector" x1="14" y1="0" x2="42" y2="-18" stroke="rgba(45, 212, 191, 0.28)" strokeWidth="0.55" strokeDasharray="3 8" />
      {!reduced ? <circle className="ma-vdr-net-source-pulse" r="26" fill="none" stroke="#5eead4" strokeWidth="0.62" opacity="0" /> : null}
    </g>
  );
}

function SecurityGate({ gate, reduced }) {
  const { x, y, type } = gate;
  return (
    <g className={`ma-vdr-net-gate ma-vdr-net-gate-${type}`} transform={`translate(${x} ${y})`} aria-hidden="true">
      {type === 'classification' ? (
        <>
          <path className="ma-vdr-net-gate-frame" d="M -22 -16 L -12 -16 L -12 -8 M 22 -16 L 12 -16 L 12 -8 M -22 16 L -12 16 L -12 8 M 22 16 L 12 16 L 12 8" fill="none" stroke="#2dd4bf" strokeWidth="0.72" />
          <rect x="-16" y="-12" width="32" height="24" rx="1.5" fill="rgba(2, 8, 10, 0.72)" stroke="#2dd4bf" strokeWidth="0.78" />
          <line x1="-12" y1="-4" x2="12" y2="-4" stroke="#5eead4" strokeWidth="0.55" />
          <line x1="-12" y1="2" x2="8" y2="2" stroke="#2dd4bf" strokeWidth="0.45" opacity="0.58" />
        </>
      ) : null}
      {type === 'encryption' ? (
        <>
          <circle className="ma-vdr-net-gate-frame" r="20" fill="rgba(2, 8, 10, 0.65)" stroke="#2dd4bf" strokeWidth="0.72" />
          <circle className="ma-vdr-net-gate-ring" r="26" fill="none" stroke="#2dd4bf" strokeWidth="0.52" strokeDasharray="6 14" />
          <circle className="ma-vdr-net-gate-ring-inner" r="30" fill="none" stroke="#2dd4bf" strokeWidth="0.38" strokeDasharray="4 12" opacity="0.35" />
          <rect x="-3.5" y="1" width="7" height="5" rx="0.5" fill="rgba(1, 4, 6, 0.62)" stroke="#5eead4" strokeWidth="0.58" />
          <path d="M -2.8 1 V -3.2 A 2.4 2.4 0 0 1 2.8 -3.2 V 1" fill="none" stroke="#5eead4" strokeWidth="0.58" />
        </>
      ) : null}
      {type === 'verification' ? (
        <>
          <circle className="ma-vdr-net-gate-frame" r="18" fill="rgba(2, 8, 10, 0.62)" stroke="#2dd4bf" strokeWidth="0.72" />
          <circle r="24" fill="none" stroke="#2dd4bf" strokeWidth="0.48" strokeDasharray="5 14" opacity="0.38" />
          <path d="M -5.5 0 L -2 3.5 L 6.5 -4.5" fill="none" stroke="#5eead4" strokeWidth="0.72" strokeLinecap="round" />
          {!reduced ? <circle className="ma-vdr-net-gate-sweep" r="28" fill="none" stroke="#5eead4" strokeWidth="0.58" strokeDasharray="12 56" opacity="0" /> : null}
        </>
      ) : null}
    </g>
  );
}

function DestinationHub({ reduced }) {
  const { x, y } = DESTINATION;
  return (
    <g className="ma-vdr-net-destination" transform={`translate(${x} ${y})`} aria-hidden="true">
      <circle className="ma-vdr-net-dest-halo" r="28" fill="url(#ma-vdr-net-dest-halo)" opacity="0.38" />
      <circle className="ma-vdr-net-dest-ring" r="18" fill="none" stroke="rgba(45, 212, 191, 0.32)" strokeWidth="0.62" />
      <rect x="-16" y="-12" width="32" height="24" rx="1.5" fill="rgba(2, 8, 10, 0.62)" stroke="#2dd4bf" strokeWidth="0.65" />
      <rect x="-10" y="-8" width="8" height="11" rx="0.5" fill="rgba(2, 10, 12, 0.55)" stroke="#2dd4bf" strokeWidth="0.42" opacity="0.62" />
      <rect x="-1" y="-8" width="8" height="11" rx="0.5" fill="rgba(2, 10, 12, 0.48)" stroke="#2dd4bf" strokeWidth="0.38" opacity="0.52" />
      <rect x="8" y="-8" width="8" height="11" rx="0.5" fill="rgba(2, 10, 12, 0.42)" stroke="#2dd4bf" strokeWidth="0.35" opacity="0.42" />
      <circle className="ma-vdr-net-dest-dot" r="2.8" fill="#5eead4" opacity="0.45" />
      <path className="ma-vdr-net-metric-link" d="M -24 -8 C -60 -4, -96 0, -132 4" fill="none" stroke="rgba(45, 212, 191, 0.22)" strokeWidth="0.48" strokeDasharray="4 10" />
      {!reduced ? (
        <>
          <circle className="ma-vdr-net-dest-sync" r="14" fill="none" stroke="#5eead4" strokeWidth="0.58" opacity="0" />
          <path className="ma-vdr-net-dest-check" d="M -4 0 L -1.5 2.5 L 5 -3.5" fill="none" stroke="#5eead4" strokeWidth="0.65" strokeLinecap="round" opacity="0" />
        </>
      ) : null}
    </g>
  );
}

function StaticPacket({ packet }) {
  const w = 14 * packet.scale;
  const h = 18 * packet.scale;
  return (
    <g className={`ma-vdr-net-packet ma-vdr-net-packet-${packet.tier}`} transform={`translate(${packet.x} ${packet.y})`} aria-hidden="true">
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="1.4" fill="rgba(3, 10, 12, 0.58)" stroke="#2dd4bf" strokeWidth="0.72" />
      <path
        d={`M ${-w / 2 + 3} ${-h / 2} L ${w / 2 - 5} ${-h / 2} L ${w / 2 - 2} ${-h / 2 + 5} L ${w / 2 - 2} ${h / 2 - 2} L ${-w / 2} ${h / 2 - 2} L ${-w / 2} ${-h / 2 + 4} Z`}
        fill="none"
        stroke="#5eead4"
        strokeWidth="0.52"
        opacity="0.58"
      />
      <line x1={-w / 2 + 3.5} y1={-h / 2 + 7} x2={w / 2 - 3.5} y2={-h / 2 + 7} stroke="#2dd4bf" strokeWidth="0.42" opacity="0.48" />
      <line x1={-w / 2 + 3.5} y1={-h / 2 + 11} x2={w / 2 - 6} y2={-h / 2 + 11} stroke="#2dd4bf" strokeWidth="0.38" opacity="0.38" />
    </g>
  );
}

function OutboundTracer({ reduced }) {
  if (reduced) return null;
  return (
    <g className="ma-vdr-net-tracer" aria-hidden="true">
      <path className="ma-vdr-net-tracer-wake" d={OUTBOUND_PATH} fill="none" stroke="#2dd4bf" strokeWidth="5.5" strokeLinecap="round" strokeDasharray="42 420" opacity="0" />
      <path className="ma-vdr-net-tracer-ghost" d={OUTBOUND_PATH} fill="none" stroke="rgba(45, 212, 191, 0.38)" strokeWidth="3.2" strokeLinecap="round" strokeDasharray="24 420" opacity="0" />
      <path className="ma-vdr-net-tracer-tail" d={OUTBOUND_PATH} fill="none" stroke="#5eead4" strokeWidth="4.8" strokeLinecap="round" strokeDasharray="32 420" opacity="0" />
      <path className="ma-vdr-net-tracer-body" d={OUTBOUND_PATH} fill="none" stroke="#5eead4" strokeWidth="2.8" strokeLinecap="round" strokeDasharray="14 420" opacity="0" />
      <path className="ma-vdr-net-tracer-head" d={OUTBOUND_PATH} fill="none" stroke="#5eead4" strokeWidth="6.2" strokeLinecap="round" strokeDasharray="8 420" opacity="0" />
    </g>
  );
}

function TravelPacket({ signature, output, ambient, path, dur, begin, reduced }) {
  if (reduced) return null;
  const motionPath = signature || output ? SIGNATURE_PATH : path;
  if (!motionPath) return null;

  const pw = signature ? 7 : 5;
  const ph = signature ? 9 : 7;
  const className = [
    'ma-vdr-net-traveler',
    signature ? 'ma-vdr-net-traveler-signature' : '',
    output ? 'ma-vdr-net-traveler-output' : '',
    ambient ? 'ma-vdr-net-traveler-ambient' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const opacityValues = signature
    ? '0;0.9;0.92;0.88;0.85;0.8;0.72;0.55;0.32;0.12;0'
    : output
      ? '0;0;0;0;0;0;0.82;0.88;0.65;0.35;0'
      : '0.35;0.48;0.52;0.42;0.32;0.35';

  const keyTimes = signature
    ? '0;0.04;0.12;0.32;0.38;0.42;0.48;0.62;0.78;0.92;1'
    : output
      ? '0;0.44;0.48;0.5;0.52;0.54;0.58;0.64;0.74;0.88;1'
      : '0;0.2;0.4;0.6;0.8;1';

  return (
    <g className={className} opacity="0">
      <rect x={-pw} y={-ph} width={pw * 2} height={ph * 2} rx="1.2" fill="rgba(2, 8, 10, 0.68)" stroke="#5eead4" strokeWidth="0.72" />
      <line x1={-pw + 2} y1={-ph + 5} x2={pw - 2} y2={-ph + 5} stroke="#2dd4bf" strokeWidth="0.4" opacity="0.55" />
      <animateMotion path={motionPath} dur={signature || output ? LOOP : dur} begin={begin} repeatCount="indefinite" rotate="auto" calcMode="linear" />
      <animate attributeName="opacity" values={opacityValues} keyTimes={keyTimes} dur={signature || output ? LOOP : dur} begin={begin} repeatCount="indefinite" />
    </g>
  );
}

function IngestPulse({ reduced }) {
  if (reduced) return null;
  return (
    <path
      className="ma-vdr-net-ingest-pulse"
      d={CORRIDORS[0].main}
      fill="none"
      stroke="#5eead4"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeDasharray="16 520"
      opacity="0"
    />
  );
}

function ForegroundPlane({ reduced }) {
  return (
    <g className="ma-vdr-net-front" aria-hidden="true">
      <IngestLayer layer="fg-front" items={INGEST_FG.filter((f) => f.z === 'front')} />
      {METRIC_LINK_FILAMENTS.map((path, idx) => (
        <path key={`metric-link-${idx}`} className={`ma-vdr-net-metric-filament ma-vdr-net-metric-filament-${idx}`} d={path} fill="none" strokeLinecap="round" />
      ))}
      <CorridorRibbon corridor={CORRIDORS[2]} />
      <path
        className="ma-vdr-net-foreground-cross"
        d="M 478 228 C 498 218, 510 208, 518 202"
        fill="none"
        stroke="#5eead4"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.55"
      />
      <DestinationHub reduced={reduced} />
      <OutboundTracer reduced={reduced} />
      {STATIC_PACKETS.filter((p) => p.tier === 'dest').map((p) => (
        <StaticPacket key={p.tier} packet={p} />
      ))}
      {TRAVELERS.map((t, idx) => (
        <TravelPacket
          key={`traveler-${idx}`}
          signature={t.signature}
          output={t.output}
          ambient={t.ambient}
          path={t.path}
          dur={t.dur}
          begin={t.begin || '0s'}
          reduced={reduced}
        />
      ))}
    </g>
  );
}

export function MADataRoomSecureNetworkVisual() {
  const reduced = usePrefersReducedMotion();
  const backCorridors = CORRIDORS.filter((c) => c.plane === 'back');

  return (
    <div className="ma-data-room-control-field ma-data-room-network-field" aria-hidden="true">
      <svg
        className="ma-data-room-control-svg ma-data-room-network-svg ma-vdr-net-svg"
        viewBox="0 0 1200 420"
        preserveAspectRatio="none"
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="ma-vdr-net-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(45, 212, 191, 0.055)" strokeWidth="0.4" />
          </pattern>
          <linearGradient id="ma-vdr-net-lane" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(45, 212, 191, 0.36)" />
            <stop offset="50%" stopColor="rgba(94, 234, 212, 0.62)" />
            <stop offset="100%" stopColor="rgba(94, 234, 212, 0.72)" />
          </linearGradient>
          <radialGradient id="ma-vdr-net-shell-rear" cx="50%" cy="28%" r="72%">
            <stop offset="0%" stopColor="rgba(45, 212, 191, 0.2)" />
            <stop offset="100%" stopColor="rgba(2, 6, 8, 0.04)" />
          </radialGradient>
          <radialGradient id="ma-vdr-net-shell-mid" cx="50%" cy="32%" r="68%">
            <stop offset="0%" stopColor="rgba(94, 234, 212, 0.3)" />
            <stop offset="100%" stopColor="rgba(2, 8, 10, 0.08)" />
          </radialGradient>
          <radialGradient id="ma-vdr-net-shell-front" cx="50%" cy="34%" r="65%">
            <stop offset="0%" stopColor="rgba(94, 234, 212, 0.5)" />
            <stop offset="42%" stopColor="rgba(45, 212, 191, 0.26)" />
            <stop offset="100%" stopColor="rgba(2, 8, 10, 0.55)" />
          </radialGradient>
          <radialGradient id="ma-vdr-net-chamber" cx="50%" cy="42%" r="58%">
            <stop offset="0%" stopColor="rgba(94, 234, 212, 0.42)" />
            <stop offset="100%" stopColor="rgba(1, 6, 8, 0.66)" />
          </radialGradient>
          <radialGradient id="ma-vdr-net-chamber-inner" cx="50%" cy="44%" r="52%">
            <stop offset="0%" stopColor="rgba(45, 212, 191, 0.32)" />
            <stop offset="100%" stopColor="rgba(1, 4, 6, 0.72)" />
          </radialGradient>
          <radialGradient id="ma-vdr-net-internal-glow" cx="50%" cy="46%" r="55%">
            <stop offset="0%" stopColor="rgba(94, 234, 212, 0.52)" />
            <stop offset="100%" stopColor="rgba(45, 212, 191, 0)" />
          </radialGradient>
          <radialGradient id="ma-vdr-net-nucleus-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(94, 234, 212, 0.58)" />
            <stop offset="100%" stopColor="rgba(94, 234, 212, 0)" />
          </radialGradient>
          <radialGradient id="ma-vdr-net-nucleus" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(236, 253, 245, 0.92)" />
            <stop offset="48%" stopColor="rgba(94, 234, 212, 0.55)" />
            <stop offset="100%" stopColor="rgba(45, 212, 191, 0.14)" />
          </radialGradient>
          <radialGradient id="ma-vdr-net-nucleus-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.98)" />
            <stop offset="40%" stopColor="rgba(94, 234, 212, 0.95)" />
            <stop offset="100%" stopColor="rgba(45, 212, 191, 0.4)" />
          </radialGradient>
          <radialGradient id="ma-vdr-net-source-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(94, 234, 212, 0.32)" />
            <stop offset="100%" stopColor="rgba(94, 234, 212, 0)" />
          </radialGradient>
          <radialGradient id="ma-vdr-net-dest-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(94, 234, 212, 0.22)" />
            <stop offset="100%" stopColor="rgba(45, 212, 191, 0)" />
          </radialGradient>
          <radialGradient id="ma-vdr-net-core-bloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(94, 234, 212, 0.28)" />
            <stop offset="55%" stopColor="rgba(45, 212, 191, 0.12)" />
            <stop offset="100%" stopColor="rgba(45, 212, 191, 0)" />
          </radialGradient>
          <radialGradient id="ma-vdr-net-core-bloom-inner" cx="50%" cy="42%" r="58%">
            <stop offset="0%" stopColor="rgba(94, 234, 212, 0.38)" />
            <stop offset="48%" stopColor="rgba(45, 212, 191, 0.16)" />
            <stop offset="100%" stopColor="rgba(45, 212, 191, 0)" />
          </radialGradient>
          <linearGradient id="ma-vdr-net-filament-lane" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(45, 212, 191, 0.24)" />
            <stop offset="45%" stopColor="rgba(94, 234, 212, 0.58)" />
            <stop offset="100%" stopColor="rgba(94, 234, 212, 0.82)" />
          </linearGradient>
          <radialGradient id="ma-vdr-net-intake-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(94, 234, 212, 0.28)" />
            <stop offset="100%" stopColor="rgba(45, 212, 191, 0)" />
          </radialGradient>
          <radialGradient id="ma-vdr-net-absorb-pull" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(94, 234, 212, 0.42)" />
            <stop offset="55%" stopColor="rgba(45, 212, 191, 0.12)" />
            <stop offset="100%" stopColor="rgba(45, 212, 191, 0)" />
          </radialGradient>
        </defs>

        <BackgroundPlane reduced={reduced} />
        <AuditMemoryField reduced={reduced} />

        <g className="ma-vdr-net-mid" aria-hidden="true">
          <IngestLayer layer="bg" items={INGEST_BG} />
          {backCorridors.map((c) => (
            <CorridorRibbon key={c.id} corridor={c} />
          ))}
          <IngestLayer layer="mid" items={INGEST_MID} />
          <IngestLayer layer="fg-behind" items={INGEST_FG.filter((f) => f.z === 'behind')} />
          <SecureCore reduced={reduced} />
          <DocumentSource reduced={reduced} />
          {Object.values(GATES).map((gate) => (
            <SecurityGate key={gate.type} gate={gate} reduced={reduced} />
          ))}
          {STATIC_PACKETS.filter((p) => p.tier !== 'dest').map((p) => (
            <StaticPacket key={`${p.tier}-${p.x}`} packet={p} />
          ))}
          <IngestPackets reduced={reduced} />
          <IngestBurst reduced={reduced} />
          <IngestPulse reduced={reduced} />
        </g>

        <ForegroundPlane reduced={reduced} />
      </svg>
    </div>
  );
}

export function MADataRoomControlFieldVisual() {
  return <MADataRoomSecureNetworkVisual />;
}
