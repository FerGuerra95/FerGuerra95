import React from 'react';

/**
 * Dense holographic M&A intelligence planet — BOCETO 1 wireframe sphere.
 * Scale / viewBox / transform LOCKED (P0 closed). Internal geometry only.
 * C.44 — Platform presence boost (+35% local). Planet / hero layout frozen.
 */

/** Measured pre-transform content bounds — DO NOT CHANGE (size lock) */
const SRC_BBOX = { x: 155, y: 92, w: 835, h: 846.5 };
const SRC_CX = SRC_BBOX.x + SRC_BBOX.w / 2;
const SRC_CY = SRC_BBOX.y + SRC_BBOX.h / 2;

/** Target footprint inside 1000×1000 user space */
const TARGET_CX = 500;
const TARGET_CY = 470;
const TARGET_W = 800;
const TARGET_H = 830;

const PLANET_SCALE = Math.min(TARGET_W / SRC_BBOX.w, TARGET_H / SRC_BBOX.h);
const PLANET_TRANSFORM = `translate(${TARGET_CX} ${TARGET_CY}) scale(${PLANET_SCALE}) translate(${-SRC_CX} ${-SRC_CY})`;

/** Crop viewBox — frames planet + lower platform for hero stage */
const VIEWBOX_X = 188;
const VIEWBOX_Y = 98;
const VIEWBOX_W = 600;
const VIEWBOX_H = 632;
const VIEWBOX = `${VIEWBOX_X} ${VIEWBOX_Y} ${VIEWBOX_W} ${VIEWBOX_H}`;

const CX = 500;
const CY = 440;
const CORE_X = 502;
const CORE_Y = 448;
const SPHERE_R = 278;
const PLATFORM_TOP_Y = 702;
const PLATFORM_BASE_Y = 724;
/** Clip platform surface below globe — prevents horizontal stripes through sphere */
const PLATFORM_CLIP_Y = 686;

/** Latitude ellipses — full wireframe rings (horizontal) */
const LATITUDE_RINGS = [
  { id: 'lat1', ry: 32, sw: 0.7, tier: 'outer' },
  { id: 'lat2', ry: 58, sw: 0.68, tier: 'mid' },
  { id: 'lat3', ry: 88, sw: 0.66, tier: 'mid' },
  { id: 'lat4', ry: 122, sw: 0.64, tier: 'mid' },
  { id: 'lat5', ry: 158, sw: 0.62, tier: 'mid' },
  { id: 'lat6', ry: 196, sw: 0.6, tier: 'mid' },
  { id: 'lat7', ry: 232, sw: 0.58, tier: 'outer' },
  { id: 'lat8', ry: 262, sw: 0.56, tier: 'outer' },
];

/** Longitude ellipses — full wireframe rings (vertical) */
const LONGITUDE_RINGS = [
  { id: 'lon1', rx: 58, sw: 0.68 },
  { id: 'lon2', rx: 112, sw: 0.64 },
  { id: 'lon3', rx: 168, sw: 0.62 },
  { id: 'lon4', rx: 218, sw: 0.6 },
  { id: 'lon5', rx: 252, sw: 0.58 },
];

/** 6 tilted orbital planes — define spherical volume */
const TILTED_ORBITS = [
  { id: 'to1', rx: 292, ry: 68, rot: -18, sw: 0.72, tier: 'structural', foreground: true },
  { id: 'to2', rx: 288, ry: 62, rot: 24, sw: 0.7, tier: 'structural', foreground: true },
  { id: 'to3', rx: 282, ry: 74, rot: 38, sw: 0.68, tier: 'structural' },
  { id: 'to4', rx: 276, ry: 66, rot: -32, sw: 0.66, tier: 'mid' },
  { id: 'to5', rx: 268, ry: 58, rot: 12, sw: 0.64, tier: 'mid' },
  { id: 'to6', rx: 255, ry: 52, rot: -8, sw: 0.62, tier: 'mid' },
];

/** Curved network paths crossing the sphere interior */
const NETWORK_PATHS = [
  { id: 'np1', d: 'M 228 268 C 318 218 418 198 518 208 C 618 218 718 258 778 318', foreground: true },
  { id: 'np2', d: 'M 218 480 C 298 420 378 388 458 378 C 538 368 618 388 698 428 C 748 452 778 468 778 468' },
  { id: 'np3', d: 'M 248 598 C 348 648 448 668 548 662 C 648 656 728 618 778 568', foreground: true },
  { id: 'np4', d: 'M 268 348 C 328 298 388 278 448 282 C 508 286 568 312 628 348' },
  { id: 'np5', d: 'M 372 628 C 432 588 492 568 552 572 C 612 576 672 602 728 638' },
  { id: 'np6', d: 'M 298 398 C 358 368 418 358 478 362 C 538 366 598 388 658 418' },
  { id: 'np7', d: 'M 338 518 C 398 488 458 478 518 482 C 578 486 638 508 698 538' },
  { id: 'np8', d: 'M 388 298 C 428 278 468 268 508 272 C 548 276 588 298 628 328', foreground: true },
  { id: 'np9', d: 'M 358 438 C 398 418 438 408 478 412 C 518 416 558 432 598 458' },
  { id: 'np10', d: 'M 418 548 C 458 528 498 518 538 522 C 578 526 618 542 658 568' },
  { id: 'np11', d: 'M 308 328 C 368 308 428 302 488 308 C 548 314 608 338 668 372', foreground: true },
  { id: 'np12', d: 'M 328 568 C 388 548 448 538 508 542 C 568 546 628 568 688 598' },
  { id: 'np13', d: 'M 348 418 C 398 388 448 378 498 385 C 548 392 598 418 648 448' },
  { id: 'np14', d: 'M 368 468 C 418 448 468 438 518 442 C 568 446 618 468 668 492' },
  { id: 'np15', d: 'M 398 358 C 448 338 498 332 548 338 C 598 344 648 368 688 398' },
  { id: 'np16', d: 'M 378 538 C 428 518 478 508 528 512 C 578 516 628 538 672 562' },
];

/** Inner processing loops around core */
const INNER_LOOPS = [
  { id: 'il1', d: 'M 418 418 C 432 404 452 408 462 422 C 452 436 432 432 418 418' },
  { id: 'il2', d: 'M 558 428 C 572 414 592 418 602 432 C 592 446 572 442 558 428' },
  { id: 'il3', d: 'M 448 508 C 462 498 478 502 484 516 C 478 528 462 524 448 508' },
  { id: 'il4', d: 'M 528 388 C 542 378 558 382 564 396 C 558 408 542 404 528 388' },
  { id: 'il5', d: 'M 468 432 C 478 424 488 426 492 434 C 488 442 478 440 468 432' },
  { id: 'il6', d: 'M 522 468 C 532 460 542 462 546 470 C 542 478 532 476 522 468' },
  { id: 'il7', d: 'M 488 442 C 498 436 508 438 512 446 C 508 452 498 450 488 442' },
];

/** Chamber-scale irregular loops — ~25% planet diameter */
const CHAMBER_LOOPS = [
  { id: 'cl1', d: 'M 388 448 C 398 408 428 388 462 395 C 496 402 524 425 538 455 C 524 485 496 505 462 512 C 428 505 398 485 388 448' },
  /* Closing cubics must supply 6 coords (c1x c1y c2x c2y x y). Incomplete finals caused console path-d errors. */
  { id: 'cl2', d: 'M 418 402 C 438 385 472 380 502 392 C 532 404 552 430 558 458 C 548 486 522 508 492 515 C 462 508 436 486 422 458 C 412 430 415 416 418 402' },
  { id: 'cl3', d: 'M 445 415 C 458 398 482 392 502 402 C 518 412 528 432 524 452 C 518 468 502 478 482 482 C 462 478 448 462 442 442 C 438 428 441 421 445 415' },
  { id: 'cl4', d: 'M 472 478 C 482 468 498 465 512 472 C 526 478 534 492 530 508 C 522 520 506 525 492 522 C 478 518 468 505 465 492 C 464 482 468 480 472 478' },
];

const CHAMBER_CONNECTORS = [
  { id: 'cc1', d: 'M 462 395 C 472 402 482 408 492 412' },
  { id: 'cc2', d: 'M 538 455 C 528 462 518 468 508 472' },
  { id: 'cc3', d: 'M 422 458 C 432 452 442 448 452 445' },
  { id: 'cc4', d: 'M 552 430 C 542 438 532 445 522 452' },
  { id: 'cc5', d: 'M 488 442 C 495 448 502 452 508 458' },
];

/** Partial arcs — flank segments */
const PARTIAL_ARCS = [
  { id: 'pa1', d: 'M 248 218 Q 380 168 512 178 Q 644 188 752 248' },
  { id: 'pa2', d: 'M 248 662 Q 380 698 512 708 Q 644 698 752 638' },
  { id: 'pa3', d: 'M 218 368 Q 198 440 218 512' },
  { id: 'pa4', d: 'M 782 368 Q 802 440 782 512' },
];

/** Dashed fragmented trajectories */
const DASHED_ARCS = [
  { id: 'da1', d: 'M 285 235 Q 420 195 535 188 Q 650 198 715 248' },
  { id: 'da2', d: 'M 285 645 Q 420 675 535 682 Q 650 672 715 622' },
  { id: 'da3', d: 'M 450 252 Q 520 218 590 252 Q 625 292 602 332' },
];

/** Signal route paths */
const MID_ORBIT_PATH_A = 'M 228 318 C 318 278 418 258 518 268 C 618 278 718 318 778 368';
const CROSS_SPHERE_PATH = 'M 195 480 C 280 420 360 385 440 372 C 520 359 600 375 680 402 C 740 422 778 408 778 408';
const EXEC_OUTPUT_PATH = 'M 778 408 C 815 395 865 382 905 372 C 945 365 975 362 998 360';

/** Static bright segments on key routes — short teal highlights on existing paths */
const STATIC_ROUTE_SEGMENTS = [
  { id: 'ss1', d: MID_ORBIT_PATH_A, dash: '16 704', sw: 3, offset: 0 },
  { id: 'ss2', d: CROSS_SPHERE_PATH, dash: '20 800', sw: 3.1, offset: 0 },
  { id: 'ss3', d: NETWORK_PATHS[0].d, dash: '12 528', sw: 2.6, offset: 180 },
  { id: 'ss4', d: NETWORK_PATHS[2].d, dash: '14 588', sw: 2.5, offset: 240 },
  { id: 'ss5', d: CHAMBER_LOOPS[1].d, dash: '10 470', sw: 2.4, offset: 90 },
  { id: 'ss6', d: NETWORK_PATHS[7].d, dash: '12 384', sw: 2.4, offset: 120 },
  { id: 'ss7', d: NETWORK_PATHS[10].d, dash: '14 444', sw: 2.3, offset: 200 },
  { id: 'ss8', d: NETWORK_PATHS[4].d, dash: '11 402', sw: 2.3, offset: 280 },
];

/** Radial intelligence structure around core */
const CORE_RADIALS = Array.from({ length: 8 }, (_, i) => {
  const angle = (i * 45 * Math.PI) / 180;
  const inner = 14;
  const outer = 42 + (i % 3) * 10;
  return {
    id: `cr${i + 1}`,
    x1: CORE_X + Math.cos(angle) * inner,
    y1: CORE_Y + Math.sin(angle) * inner,
    x2: CORE_X + Math.cos(angle) * outer,
    y2: CORE_Y + Math.sin(angle) * outer,
  };
});

/** 4 active signal routes */
const ACTIVE_ROUTES = [
  { id: 'ar1', d: MID_ORBIT_PATH_A },
  { id: 'ar2', d: CROSS_SPHERE_PATH },
  { id: 'ar3', d: CHAMBER_LOOPS[1].d },
  { id: 'ar4', d: EXEC_OUTPUT_PATH },
];

/** 18 distributed checkpoints — 4 hero nodes get featured presence (light/motion only) */
const CHECKPOINTS = [
  { id: 'cp1', cx: 248, cy: 218, r: 5.5, tier: 'checkpoint', featured: true },
  { id: 'cp2', cx: 500, cy: 178, r: 2.5, tier: 'small' },
  { id: 'cp3', cx: 752, cy: 248, r: 5.5, tier: 'target', featured: true },
  { id: 'cp4', cx: 195, cy: 480, r: 3.5, tier: 'medium' },
  { id: 'cp5', cx: 778, cy: 408, r: 5.5, tier: 'checkpoint', featured: true },
  { id: 'cp6', cx: 268, cy: 598, r: 3.5, tier: 'medium' },
  { id: 'cp7', cx: 500, cy: 708, r: 2.5, tier: 'small' },
  { id: 'cp8', cx: 732, cy: 568, r: 3.5, tier: 'target' },
  { id: 'cp9', cx: 318, cy: 298, r: 2, tier: 'small' },
  { id: 'cp10', cx: 682, cy: 288, r: 2, tier: 'small' },
  { id: 'cp11', cx: 358, cy: 648, r: 2, tier: 'small' },
  { id: 'cp12', cx: 428, cy: 358, r: 2.5, tier: 'small' },
  { id: 'cp13', cx: 592, cy: 352, r: 3.5, tier: 'medium' },
  { id: 'cp14', cx: 455, cy: 528, r: 2, tier: 'small' },
  { id: 'cp15', cx: 562, cy: 508, r: 2, tier: 'small' },
  { id: 'cp16', cx: 385, cy: 618, r: 3, tier: 'medium', featured: true },
  { id: 'cp17', cx: 615, cy: 618, r: 3, tier: 'medium' },
  { id: 'cp18', cx: 492, cy: 382, r: 2.5, tier: 'small' },
];

/** Micro detail field */
const MICRO_DETAILS = [
  { id: 'mx1', kind: 'dot', cx: 418, cy: 352, r: 1.1 },
  { id: 'mx2', kind: 'dot', cx: 442, cy: 368, r: 0.9 },
  { id: 'mx3', kind: 'dot', cx: 468, cy: 358, r: 1 },
  { id: 'mx4', kind: 'dot', cx: 552, cy: 362, r: 1 },
  { id: 'mx5', kind: 'dot', cx: 578, cy: 378, r: 0.9 },
  { id: 'mx6', kind: 'dot', cx: 602, cy: 395, r: 1.1 },
  { id: 'mx7', kind: 'dot', cx: 435, cy: 442, r: 0.85 },
  { id: 'mx8', kind: 'dot', cx: 485, cy: 428, r: 0.9 },
  { id: 'mx9', kind: 'dot', cx: 535, cy: 435, r: 0.85 },
  { id: 'mx10', kind: 'dot', cx: 582, cy: 448, r: 1 },
  { id: 'mx11', kind: 'dot', cx: 448, cy: 492, r: 0.9 },
  { id: 'mx12', kind: 'dot', cx: 572, cy: 488, r: 0.9 },
  { id: 'mx13', kind: 'dash', x1: 452, y1: 382, x2: 468, y2: 388 },
  { id: 'mx14', kind: 'dash', x1: 498, y1: 398, x2: 512, y2: 404 },
  { id: 'mx15', kind: 'dash', x1: 542, y1: 412, x2: 558, y2: 418 },
  { id: 'mx16', kind: 'dash', x1: 462, y1: 448, x2: 476, y2: 454 },
  { id: 'mx17', kind: 'dash', x1: 518, y1: 462, x2: 532, y2: 468 },
  { id: 'mx18', kind: 'dash', x1: 488, y1: 478, x2: 502, y2: 484 },
  { id: 'mx19', kind: 'arc', d: 'M 472 388 Q 488 382 504 388' },
  { id: 'mx20', kind: 'arc', d: 'M 516 402 Q 532 396 548 402' },
  { id: 'mx21', kind: 'arc', d: 'M 458 458 Q 472 452 486 458' },
  { id: 'mx22', kind: 'arc', d: 'M 538 468 Q 552 462 566 468' },
  { id: 'mx23', kind: 'ring', cx: 476, cy: 412, r: 2.2 },
  { id: 'mx24', kind: 'ring', cx: 544, cy: 422, r: 2.5 },
  { id: 'mx25', kind: 'ring', cx: 498, cy: 452, r: 2 },
  { id: 'mx26', kind: 'tick', x1: 492, y1: 418, x2: 498, y2: 422 },
  { id: 'mx27', kind: 'tick', x1: 522, y1: 438, x2: 528, y2: 442 },
  { id: 'mx28', kind: 'tick', x1: 468, y1: 468, x2: 474, y2: 472 },
  { id: 'mx29', kind: 'dot', cx: 405, cy: 405, r: 0.85 },
  { id: 'mx30', kind: 'dot', cx: 615, cy: 415, r: 0.85 },
];

/** Floor particles on platform plane — below globe only */
const FLOOR_PARTICLES = [
  { cx: 348, cy: 718, r: 1.1 },
  { cx: 392, cy: 722, r: 0.85 },
  { cx: 438, cy: 719, r: 1 },
  { cx: 482, cy: 723, r: 0.9 },
  { cx: 522, cy: 720, r: 1.05 },
  { cx: 568, cy: 722, r: 0.88 },
  { cx: 612, cy: 718, r: 1 },
  { cx: 652, cy: 721, r: 0.82 },
  { cx: 368, cy: 726, r: 0.75 },
  { cx: 448, cy: 726, r: 0.8 },
  { cx: 558, cy: 726, r: 0.78 },
  { cx: 632, cy: 725, r: 0.75 },
];

/** C.44 — 10 perspective rings (~14% wider, deeper ry). Planet geometry untouched. */
const PLATFORM_ELLIPSES = [
  { cy: 700, rx: 598, ry: 10, o: 0.16, tier: 'outer' },
  { cy: 702, rx: 560, ry: 11, o: 0.2, tier: 'outer' },
  { cy: 705, rx: 526, ry: 13, o: 0.28, tier: 'outer' },
  { cy: 708, rx: 488, ry: 15, o: 0.4, tier: 'mid' },
  { cy: 711, rx: 442, ry: 16, o: 0.56, tier: 'mid', strong: true },
  { cy: 714, rx: 390, ry: 17, o: 0.74, tier: 'mid', strong: true },
  { cy: 717, rx: 332, ry: 17, o: 0.9, tier: 'inner', strong: true },
  { cy: 719, rx: 272, ry: 16, o: 0.98, tier: 'inner', strong: true },
  { cy: 721, rx: 203, ry: 14, o: 0.84, tier: 'inner' },
  { cy: 723, rx: 146, ry: 12, o: 0.62, tier: 'mid' },
];

const PLATFORM_FRAGMENTS = [
  { cy: 702, rx: 560, ry: 11, dash: '22 620', offset: 120 },
  { cy: 705, rx: 526, ry: 13, dash: '18 580', offset: 280 },
  { cy: 711, rx: 442, ry: 16, dash: '18 520', offset: 240 },
  { cy: 717, rx: 332, ry: 17, dash: '16 440', offset: 70 },
  { cy: 721, rx: 203, ry: 14, dash: '12 360', offset: 190 },
];

/** Moving illuminated sections on selected rings */
const PLATFORM_RING_RUNNERS = [
  { id: 'pr1', cy: 711, rx: 442, ry: 16, dash: '34 560', offset: 50 },
  { id: 'pr2', cy: 717, rx: 332, ry: 17, dash: '28 460', offset: 170 },
  { id: 'pr3', cy: 714, rx: 390, ry: 17, dash: '30 500', offset: 290 },
];

/** Selective bright arc sections */
const PLATFORM_BRIGHT_ARCS = [
  { cy: 711, rx: 442, ry: 16, dash: '48 600', offset: 90 },
  { cy: 717, rx: 332, ry: 17, dash: '40 500', offset: 210 },
  { cy: 719, rx: 272, ry: 16, dash: '32 440', offset: 30 },
];

const PLATFORM_PERIMETER_DOTS = [
  { cx: 268, cy: 708 }, { cx: 328, cy: 705 }, { cx: 388, cy: 703 }, { cx: 448, cy: 701 },
  { cx: 552, cy: 701 }, { cx: 612, cy: 703 }, { cx: 672, cy: 705 }, { cx: 732, cy: 708 },
];

const PLATFORM_RADIALS = [
  { x2: 348, y2: 724 }, { x2: 428, y2: 727 }, { x2: 522, y2: 728 }, { x2: 652, y2: 724 },
];

const PLATFORM_INTERSECTIONS = [
  { cx: 398, cy: 714 }, { cx: 458, cy: 712 }, { cx: 502, cy: 710 },
  { cx: 558, cy: 714 }, { cx: 438, cy: 720 }, { cx: 502, cy: 721 },
];

const PLATFORM_STEMS = [];

const PLATFORM_SPOKES = [
  { x2: 368, y2: 727 }, { x2: 428, y2: 728 }, { x2: 502, y2: 728 },
  { x2: 576, y2: 728 }, { x2: 636, y2: 727 },
];

const PLATFORM_TICKS = [
  { x1: 358, y1: 728, x2: 358, y2: 724 },
  { x1: 438, y1: 727, x2: 438, y2: 723 },
  { x1: 522, y1: 727, x2: 522, y2: 723 },
  { x1: 602, y1: 727, x2: 602, y2: 723 },
  { x1: 338, y1: 729, x2: 336, y2: 725 },
  { x1: 662, y1: 729, x2: 664, y2: 725 },
  { x1: 298, y1: 730, x2: 296, y2: 726 },
  { x1: 702, y1: 730, x2: 704, y2: 726 },
];

/** Subtle vertical projection beams — emitter to lower hemisphere (not a cage) */
const PLATFORM_PROJECTION_BEAMS = [
  { id: 'pb1', x: 488, y1: 722, y2: 636 },
  { id: 'pb2', x: 522, y1: 723, y2: 608 },
  { id: 'pb3', x: 556, y1: 722, y2: 636 },
];

/** 5 vertical feeds — clean lower field, 2–3 connect toward hemisphere */
const DATA_FEEDS = [
  { id: 'df1', x: 352, y1: 719, y2: 658, tier: 'bg', broken: true },
  { id: 'df2', x: 412, y1: 720, y2: 602, tier: 'active', tip: true, connect: true },
  { id: 'df3', x: 472, y1: 721, y2: 586, tier: 'active', tip: true, connect: true },
  { id: 'df4', x: 522, y1: 721, y2: 572, tier: 'active', tip: true, connect: true },
  { id: 'df5', x: 578, y1: 720, y2: 612, tier: 'mid', broken: true, connect: true },
];

/** Curved transfer paths — platform → lower hemisphere */
const FEED_TRANSFER_ARCS = [
  { id: 'ft1', d: 'M 412 602 C 422 582 432 566 442 556' },
  { id: 'ft2', d: 'M 472 586 C 482 566 492 550 502 542' },
  { id: 'ft3', d: 'M 522 572 C 522 552 522 538 522 528' },
];

/** Entry touchpoints at lower sphere */
const FEED_SPHERE_TOUCHES = [
  { id: 'st1', feed: 'df2', y: 556 },
  { id: 'st2', feed: 'df3', y: 542 },
  { id: 'st3', feed: 'df4', y: 528 },
];

const FEED_NODES = [
  { feed: 'df2', y: 662, r: 1 },
  { feed: 'df3', y: 646, r: 1.1 },
  { feed: 'df4', y: 632, r: 1 },
];

const FEED_SIGNALS = [
  { id: 'fs1', feed: 'df4', dash: 118 },
  { id: 'fs2', feed: 'df3', dash: 112 },
];

const SIG = {
  a: { d: MID_ORBIT_PATH_A, dash: 720 },
  b: { d: CROSS_SPHERE_PATH, dash: 820 },
  c: { d: CHAMBER_LOOPS[1].d, dash: 480 },
  d: { d: EXEC_OUTPUT_PATH, dash: 260 },
  e: { d: NETWORK_PATHS[6].d, dash: 640 },
  f: { d: NETWORK_PATHS[13].d, dash: 560 },
};

/** Five ambient signal runners + one executive-output runner (cascade only) */
const ORBIT_HIGHLIGHTS = [
  { id: 'oh1', kind: 'ellipse', cx: CX, cy: CY, rx: 292, ry: 68, rot: -18, dash: 920, seg: 18, depth: 'front' },
  { id: 'oh2', kind: 'path', d: CROSS_SPHERE_PATH, dash: 820, seg: 18, depth: 'front' },
  { id: 'oh3', kind: 'path', d: MID_ORBIT_PATH_A, dash: 720, seg: 16, depth: 'front' },
  { id: 'oh4', kind: 'path', d: CHAMBER_LOOPS[1].d, dash: 480, seg: 14, depth: 'back' },
  { id: 'oh5', kind: 'path', d: NETWORK_PATHS[2].d, dash: 680, seg: 16, depth: 'mid' },
  { id: 'oh6', kind: 'path', d: EXEC_OUTPUT_PATH, dash: 260, seg: 12, depth: 'exec' },
];

/** Active route reveal segments — same paths, dash motion during cascade only */
const ROUTE_REVEALS = [
  { id: 'rr1', d: MID_ORBIT_PATH_A, dash: 720 },
  { id: 'rr2', d: CROSS_SPHERE_PATH, dash: 820 },
  { id: 'rr3', d: NETWORK_PATHS[4].d, dash: 620 },
];

/** Tiny spark specks — 16 max */
const SPARKS = [
  { id: 'sp1', cx: 352, cy: 312, r: 0.75 },
  { id: 'sp2', cx: 398, cy: 268, r: 0.65 },
  { id: 'sp3', cx: 612, cy: 285, r: 0.7 },
  { id: 'sp4', cx: 648, cy: 338, r: 0.6 },
  { id: 'sp5', cx: 422, cy: 518, r: 0.7 },
  { id: 'sp6', cx: 578, cy: 498, r: 0.65 },
  { id: 'sp7', cx: 338, cy: 428, r: 0.6 },
  { id: 'sp8', cx: 662, cy: 448, r: 0.75 },
  { id: 'sp9', cx: 468, cy: 318, r: 0.55 },
  { id: 'sp10', cx: 542, cy: 598, r: 0.6 },
  { id: 'sp11', cx: 385, cy: 385, r: 0.55 },
  { id: 'sp12', cx: 628, cy: 395, r: 0.6 },
  { id: 'sp13', cx: 445, cy: 465, r: 0.5 },
  { id: 'sp14', cx: 572, cy: 455, r: 0.55 },
  { id: 'sp15', cx: 358, cy: 538, r: 0.5 },
  { id: 'sp16', cx: 648, cy: 518, r: 0.6 },
];

function MicroDetail({ item }) {
  if (item.kind === 'dot') {
    return <circle className={`ma-intel-micro ma-intel-micro-dot ma-intel-${item.id}`} cx={item.cx} cy={item.cy} r={item.r} />;
  }
  if (item.kind === 'dash') {
    return (
      <line
        className={`ma-intel-micro ma-intel-micro-dash ma-intel-${item.id}`}
        x1={item.x1}
        y1={item.y1}
        x2={item.x2}
        y2={item.y2}
        strokeLinecap="round"
      />
    );
  }
  if (item.kind === 'arc') {
    return <path className={`ma-intel-micro ma-intel-micro-arc ma-intel-${item.id}`} d={item.d} fill="none" strokeLinecap="round" />;
  }
  if (item.kind === 'ring') {
    return (
      <circle
        className={`ma-intel-micro ma-intel-micro-ring ma-intel-${item.id}`}
        cx={item.cx}
        cy={item.cy}
        r={item.r}
        fill="none"
      />
    );
  }
  if (item.kind === 'tick') {
    return (
      <line
        className={`ma-intel-micro ma-intel-micro-tick ma-intel-${item.id}`}
        x1={item.x1}
        y1={item.y1}
        x2={item.x2}
        y2={item.y2}
        strokeLinecap="round"
      />
    );
  }
  return null;
}

function Checkpoint({ cp }) {
  const ringR = cp.tier === 'checkpoint' ? cp.r + 6 : cp.tier === 'target' ? cp.r + 5 : cp.tier === 'medium' ? cp.r + 3.5 : cp.r + 2;

  return (
    <g
      className={`ma-intel-checkpoint ma-intel-checkpoint-${cp.id} ma-intel-checkpoint-${cp.tier}${cp.featured ? ' ma-intel-checkpoint-featured' : ''}`}
      filter={cp.featured ? 'url(#ma-intel-node-glow)' : undefined}
    >
      {cp.featured && (
        <circle
          className="ma-intel-checkpoint-glow"
          cx={cp.cx}
          cy={cp.cy}
          r={cp.r + 8}
          fill="rgba(94,234,212,0.22)"
        />
      )}
      {(cp.tier === 'checkpoint' || cp.tier === 'target' || cp.tier === 'medium' || cp.featured) && (
        <circle
          cx={cp.cx}
          cy={cp.cy}
          r={ringR}
          fill="none"
          stroke={
            cp.featured
              ? 'rgba(167,243,232,0.72)'
              : cp.tier === 'target'
                ? 'rgba(94,234,212,0.48)'
                : cp.tier === 'medium'
                  ? 'rgba(94,234,212,0.32)'
                  : 'rgba(94,234,212,0.42)'
          }
          strokeWidth={cp.featured ? 1.1 : 1}
          strokeDasharray={cp.tier === 'target' ? '2 4' : cp.tier === 'medium' ? '3 5' : undefined}
          className="ma-intel-checkpoint-ring"
        />
      )}
      {cp.tier === 'target' && (
        <>
          <line x1={cp.cx - cp.r - 2} y1={cp.cy} x2={cp.cx + cp.r + 2} y2={cp.cy} stroke="rgba(94,234,212,0.38)" strokeWidth="0.7" className="ma-intel-checkpoint-cross" />
          <line x1={cp.cx} y1={cp.cy - cp.r - 2} x2={cp.cx} y2={cp.cy + cp.r + 2} stroke="rgba(94,234,212,0.38)" strokeWidth="0.7" className="ma-intel-checkpoint-cross" />
        </>
      )}
      <circle cx={cp.cx} cy={cp.cy} r={cp.r} fill={cp.featured ? '#ecfdf5' : '#5eead4'} className="ma-intel-checkpoint-dot" />
    </g>
  );
}

export function MAIntelligenceFieldVisual() {
  const feedById = Object.fromEntries(DATA_FEEDS.map((f) => [f.id, f]));
  const feedBaseY = PLATFORM_TOP_Y;

  function feedDasharray(feed) {
    if (feed.broken) return '2 5 1 9';
    if (feed.tier === 'active') return '5 4';
    if (feed.tier === 'mid') return '3 9';
    return '2 14';
  }

  return (
    <div className="ma-intelligence-effect-layer" aria-hidden="true">
      <svg
        className="ma-intelligence-effect-svg"
        viewBox={VIEWBOX}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="ma-intel-platform-clip">
            <rect x={188} y={PLATFORM_CLIP_Y} width={624} height={52} />
          </clipPath>
          <linearGradient id="ma-intel-platform-top-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="16%" stopColor="white" stopOpacity="0.32" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>
          <mask id="ma-intel-platform-top-mask">
            <rect x={188} y={PLATFORM_CLIP_Y} width={624} height={52} fill="url(#ma-intel-platform-top-fade)" />
          </mask>
          <radialGradient id="ma-intel-platform-fill" cx="50%" cy="42%" r="78%">
            <stop offset="0%" stopColor="rgba(45, 212, 191, 0.22)" />
            <stop offset="50%" stopColor="rgba(45, 212, 191, 0.1)" />
            <stop offset="100%" stopColor="rgba(45, 212, 191, 0)" />
          </radialGradient>
          <linearGradient id="ma-intel-emitter-column" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="rgba(94, 234, 212, 0.28)" />
            <stop offset="55%" stopColor="rgba(94, 234, 212, 0.1)" />
            <stop offset="100%" stopColor="rgba(94, 234, 212, 0)" />
          </linearGradient>
          <clipPath id="ma-intel-sphere-clip">
            <circle cx={CX} cy={CY} r={SPHERE_R} />
          </clipPath>
          <radialGradient id="ma-intel-sphere-fill" cx="38%" cy="34%" r="70%">
            <stop offset="0%" stopColor="rgba(167, 243, 232, 0.12)" />
            <stop offset="42%" stopColor="rgba(45, 212, 191, 0.08)" />
            <stop offset="72%" stopColor="rgba(20, 184, 166, 0.04)" />
            <stop offset="100%" stopColor="rgba(13, 148, 136, 0.02)" />
          </radialGradient>
          <radialGradient id="ma-intel-sphere-rim" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(45, 212, 191, 0)" />
            <stop offset="72%" stopColor="rgba(45, 212, 191, 0)" />
            <stop offset="100%" stopColor="rgba(15, 118, 110, 0.14)" />
          </radialGradient>
          <radialGradient id="ma-intel-sphere-specular" cx="30%" cy="26%" r="32%">
            <stop offset="0%" stopColor="rgba(204, 251, 241, 0.12)" />
            <stop offset="100%" stopColor="rgba(204, 251, 241, 0)" />
          </radialGradient>
          <radialGradient id="ma-intel-grid-fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.5" />
            <stop offset="55%" stopColor="white" stopOpacity="0.78" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </radialGradient>
          <mask id="ma-intel-grid-mask">
            <circle cx={CX} cy={CY} r={SPHERE_R} fill="url(#ma-intel-grid-fade)" />
          </mask>
          <filter id="ma-intel-node-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="ma-intel-core-bloom" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="ma-intel-left-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="18%" stopColor="white" stopOpacity="0.35" />
            <stop offset="32%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="ma-intel-right-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="72%" stopColor="white" stopOpacity="1" />
            <stop offset="88%" stopColor="white" stopOpacity="0.25" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="ma-intel-left-mask">
            <rect x={VIEWBOX_X} y={VIEWBOX_Y} width={VIEWBOX_W} height={VIEWBOX_H} fill="url(#ma-intel-left-fade)" />
          </mask>
          <mask id="ma-intel-right-mask">
            <rect x={VIEWBOX_X} y={VIEWBOX_Y} width={VIEWBOX_W} height={VIEWBOX_H} fill="url(#ma-intel-right-fade)" />
          </mask>
        </defs>

        <g className="ma-intel-planet-group ma-intel-cascade-cycle" transform={PLANET_TRANSFORM} aria-hidden="true">
          {/* Sphere atmospheric body */}
          <g className="ma-intel-sphere-body" mask="url(#ma-intel-left-mask)">
            <circle cx={CX} cy={CY} r={SPHERE_R + 4} fill="none" stroke="rgba(94, 234, 212, 0.06)" strokeWidth="4" opacity="0.55" />
            <circle cx={CX} cy={CY} r={SPHERE_R} fill="url(#ma-intel-sphere-fill)" />
            <circle cx={CX} cy={CY} r={SPHERE_R} fill="url(#ma-intel-sphere-rim)" />
            <circle cx={CX} cy={CY} r={SPHERE_R} fill="url(#ma-intel-sphere-specular)" />
            <circle cx={CX} cy={CY} r={SPHERE_R} fill="none" stroke="rgba(94, 234, 212, 0.16)" strokeWidth="0.85" />
            <path
              className="ma-intel-light-sweep"
              d="M 268 368 A 232 232 0 0 1 512 178 A 232 232 0 0 1 732 368"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="80 400"
            />
            <path
              className="ma-intel-cinematic-glint"
              d="M 318 298 A 192 192 0 0 1 512 208 A 192 192 0 0 1 692 298"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="24 480"
            />
          </g>

          <g className="ma-intel-planet" clipPath="url(#ma-intel-sphere-clip)" mask="url(#ma-intel-left-mask)">
            {/* Back depth layer — lat/long wireframe */}
            <g className="ma-intel-layer-back" fill="none" strokeLinecap="round">
              <g className="ma-intel-wireframe-grid" mask="url(#ma-intel-grid-mask)">
                {LATITUDE_RINGS.map((ring) => (
                  <ellipse
                    key={ring.id}
                    className={`ma-intel-lat-ring ma-intel-${ring.id} ma-intel-lat-${ring.tier}`}
                    cx={CX}
                    cy={CY}
                    rx={SPHERE_R}
                    ry={ring.ry}
                    strokeWidth={ring.sw}
                  />
                ))}
                {LONGITUDE_RINGS.map((ring) => (
                  <ellipse
                    key={ring.id}
                    className={`ma-intel-lon-ring ma-intel-${ring.id}`}
                    cx={CX}
                    cy={CY}
                    rx={ring.rx}
                    ry={SPHERE_R}
                    strokeWidth={ring.sw}
                  />
                ))}
              </g>
            </g>

            {/* Mid depth layer — tilted orbits, fragments, inner loops */}
            <g className="ma-intel-layer-mid" fill="none" strokeLinecap="round">
              <g className="ma-intel-tilted-orbits">
                {TILTED_ORBITS.map((orbit) => (
                  <ellipse
                    key={orbit.id}
                    className={`ma-intel-tilt-orbit ma-intel-${orbit.id} ma-intel-orbit-${orbit.tier}${orbit.foreground ? ' ma-intel-route-foreground' : ''}`}
                    cx={CX}
                    cy={CY}
                    rx={orbit.rx}
                    ry={orbit.ry}
                    transform={`rotate(${orbit.rot} ${CX} ${CY})`}
                    strokeWidth={orbit.sw}
                  />
                ))}
              </g>
              <g className="ma-intel-partial-arcs">
                {PARTIAL_ARCS.map((arc) => (
                  <path key={arc.id} className={`ma-intel-partial-arc ma-intel-${arc.id}`} d={arc.d} strokeWidth="0.8" />
                ))}
              </g>
              <g className="ma-intel-dashed-arcs" strokeDasharray="5 12">
                {DASHED_ARCS.map((arc) => (
                  <path key={arc.id} className={`ma-intel-dashed-arc ma-intel-${arc.id}`} d={arc.d} strokeWidth="0.85" />
                ))}
              </g>
              <g className="ma-intel-inner-loops ma-intel-inner-loops-life">
                {INNER_LOOPS.map((loop) => (
                  <path key={loop.id} className={`ma-intel-inner-loop ma-intel-${loop.id}`} d={loop.d} strokeWidth="0.95" />
                ))}
              </g>
              <path
                className="ma-intel-orbital-wave"
                d={PARTIAL_ARCS[0].d}
                fill="none"
                strokeLinecap="round"
                strokeWidth="2.4"
                strokeDasharray="55 320"
              />
            </g>

            {/* Front depth layer — network, chamber, active routes, motion */}
            <g className="ma-intel-layer-front" fill="none" strokeLinecap="round">
              <g className="ma-intel-network-paths">
                {NETWORK_PATHS.map((route) => (
                  <path
                    key={route.id}
                    className={`ma-intel-medium-route ma-intel-${route.id}${route.foreground ? ' ma-intel-route-foreground' : ''}`}
                    d={route.d}
                    strokeWidth="1.05"
                  />
                ))}
              </g>
              <g className="ma-intel-static-route-segments" fill="none" strokeLinecap="round">
                {STATIC_ROUTE_SEGMENTS.map((seg) => (
                  <path
                    key={seg.id}
                    className={`ma-intel-static-segment ma-intel-${seg.id}`}
                    d={seg.d}
                    strokeWidth={seg.sw}
                    strokeDasharray={seg.dash}
                    strokeDashoffset={seg.offset || 0}
                  />
                ))}
              </g>
              <g className="ma-intel-chamber">
                {CHAMBER_LOOPS.map((loop) => (
                  <path key={loop.id} className={`ma-intel-chamber-loop ma-intel-${loop.id}`} d={loop.d} strokeWidth="1" />
                ))}
                {CHAMBER_CONNECTORS.map((conn) => (
                  <path key={conn.id} className={`ma-intel-chamber-connector ma-intel-${conn.id}`} d={conn.d} strokeWidth="0.8" />
                ))}
              </g>
              <g className="ma-intel-micro-details ma-intel-density-layer">
                {MICRO_DETAILS.map((item) => (
                  <MicroDetail key={item.id} item={item} />
                ))}
              </g>
              <g className="ma-intel-active-routes">
                {ACTIVE_ROUTES.map((route) => (
                  <path key={route.id} className={`ma-intel-active-route ma-intel-${route.id}`} d={route.d} strokeWidth="1.5" />
                ))}
              </g>
              <g className="ma-intel-route-reveals" fill="none" strokeLinecap="round">
                {ROUTE_REVEALS.map((route) => (
                  <path
                    key={route.id}
                    className={`ma-intel-route-reveal ma-intel-${route.id}`}
                    d={route.d}
                    strokeWidth="1.4"
                    strokeDasharray={`10 ${route.dash}`}
                  />
                ))}
              </g>
              <g className="ma-intel-orbit-highlights">
                {ORBIT_HIGHLIGHTS.map((item) =>
                  item.kind === 'ellipse' ? (
                    <g key={item.id} className={`ma-intel-runner-${item.depth}`}>
                      <ellipse
                        className={`ma-intel-orbit-highlight-fade ma-intel-${item.id}-fade`}
                        cx={item.cx}
                        cy={item.cy}
                        rx={item.rx}
                        ry={item.ry}
                        transform={`rotate(${item.rot} ${item.cx} ${item.cy})`}
                        strokeWidth="3.2"
                        strokeDasharray={`${item.seg + 22} ${item.dash}`}
                      />
                      <ellipse
                        className={`ma-intel-orbit-highlight-trail ma-intel-${item.id}-trail`}
                        cx={item.cx}
                        cy={item.cy}
                        rx={item.rx}
                        ry={item.ry}
                        transform={`rotate(${item.rot} ${item.cx} ${item.cy})`}
                        strokeWidth="2.4"
                        strokeDasharray={`${item.seg + 12} ${item.dash}`}
                      />
                      <ellipse
                        className={`ma-intel-orbit-highlight-mid ma-intel-${item.id}-mid`}
                        cx={item.cx}
                        cy={item.cy}
                        rx={item.rx}
                        ry={item.ry}
                        transform={`rotate(${item.rot} ${item.cx} ${item.cy})`}
                        strokeWidth="2"
                        strokeDasharray={`${item.seg + 6} ${item.dash}`}
                      />
                      <ellipse
                        className={`ma-intel-orbit-highlight ma-intel-${item.id}`}
                        cx={item.cx}
                        cy={item.cy}
                        rx={item.rx}
                        ry={item.ry}
                        transform={`rotate(${item.rot} ${item.cx} ${item.cy})`}
                        strokeWidth="1.8"
                        strokeDasharray={`${item.seg} ${item.dash}`}
                      />
                    </g>
                  ) : (
                    <g key={item.id} className={`ma-intel-runner-${item.depth}`}>
                      <path
                        className={`ma-intel-orbit-highlight-fade ma-intel-${item.id}-fade`}
                        d={item.d}
                        strokeWidth="3"
                        strokeDasharray={`${item.seg + 20} ${item.dash}`}
                      />
                      <path
                        className={`ma-intel-orbit-highlight-trail ma-intel-${item.id}-trail`}
                        d={item.d}
                        strokeWidth="2.2"
                        strokeDasharray={`${item.seg + 10} ${item.dash}`}
                      />
                      <path
                        className={`ma-intel-orbit-highlight-mid ma-intel-${item.id}-mid`}
                        d={item.d}
                        strokeWidth="1.8"
                        strokeDasharray={`${item.seg + 5} ${item.dash}`}
                      />
                      <path
                        className={`ma-intel-orbit-highlight ma-intel-${item.id}`}
                        d={item.d}
                        strokeWidth="1.6"
                        strokeDasharray={`${item.seg} ${item.dash}`}
                      />
                    </g>
                  )
                )}
              </g>
              <g className="ma-intel-sparks">
                {SPARKS.map((sp) => (
                  <circle
                    key={sp.id}
                    className={`ma-intel-spark ma-intel-${sp.id}`}
                    cx={sp.cx}
                    cy={sp.cy}
                    r={sp.r}
                    fill="#5eead4"
                  />
                ))}
              </g>
              <g className="ma-intel-checkpoints" filter="url(#ma-intel-node-glow)">
                {CHECKPOINTS.map((cp) => (
                  <Checkpoint key={cp.id} cp={cp} />
                ))}
              </g>
              <g className="ma-intel-signals" mask="url(#ma-intel-right-mask)">
                {(['a', 'b', 'c', 'd', 'e', 'f']).map((key) => (
                  <g key={key}>
                    <path
                      className={`ma-intel-signal-fade ma-intel-signal-${key}-fade`}
                      d={SIG[key].d}
                      fill="none"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeDasharray={`36 ${SIG[key].dash}`}
                    />
                    <path
                      className={`ma-intel-signal-trail ma-intel-signal-${key}-trail`}
                      d={SIG[key].d}
                      fill="none"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeDasharray={`22 ${SIG[key].dash}`}
                    />
                    <path
                      className={`ma-intel-signal-mid ma-intel-signal-${key}-mid`}
                      d={SIG[key].d}
                      fill="none"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeDasharray={`12 ${SIG[key].dash}`}
                    />
                    <path
                      className={`ma-intel-signal ma-intel-signal-${key}`}
                      d={SIG[key].d}
                      fill="none"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeDasharray={`5 ${SIG[key].dash}`}
                    />
                  </g>
                ))}
                <circle className="ma-intel-exec-edge-glow" cx="985" cy="372" r="3.5" fill="#5eead4" />
              </g>
            </g>
          </g>

          {/* Central core with bloom */}
          <g className="ma-intel-core" mask="url(#ma-intel-left-mask)" filter="url(#ma-intel-core-bloom)">
            <g className="ma-intel-core-radials" fill="none" strokeLinecap="round">
              {CORE_RADIALS.map((rad) => (
                <line
                  key={rad.id}
                  className={`ma-intel-core-radial ma-intel-${rad.id}`}
                  x1={rad.x1}
                  y1={rad.y1}
                  x2={rad.x2}
                  y2={rad.y2}
                />
              ))}
            </g>
            <circle
              className="ma-intel-chamber-ring ma-intel-chamber-ring-outer"
              cx={CORE_X}
              cy={CORE_Y}
              r="88"
              fill="none"
              stroke="rgba(94,234,212,0.16)"
              strokeWidth="0.85"
              strokeDasharray="8 16"
            />
            <circle
              className="ma-intel-chamber-ring ma-intel-chamber-ring-inner"
              cx={CORE_X}
              cy={CORE_Y}
              r="72"
              fill="none"
              stroke="rgba(94,234,212,0.22)"
              strokeWidth="0.8"
              strokeDasharray="5 14"
            />
            <circle
              className="ma-intel-core-ring-seg"
              cx={CORE_X}
              cy={CORE_Y}
              r="52"
              fill="none"
              stroke="rgba(94,234,212,0.28)"
              strokeWidth="0.9"
              strokeDasharray="5 12"
            />
            <circle
              className="ma-intel-core-ring-outer"
              cx={CORE_X}
              cy={CORE_Y}
              r="48"
              fill="none"
              stroke="rgba(167,243,232,0.62)"
              strokeWidth="1.1"
            />
            <circle
              className="ma-intel-core-ring-inner"
              cx={CORE_X}
              cy={CORE_Y}
              r="24"
              fill="none"
              stroke="rgba(167,243,232,0.78)"
              strokeWidth="1.2"
            />
            <circle className="ma-intel-core-pulse" cx={CORE_X} cy={CORE_Y} r="22" fill="none" stroke="#5eead4" strokeWidth="1.2" opacity="0" />
            <circle className="ma-intel-core-radial-pulse" cx={CORE_X} cy={CORE_Y} r="34" fill="none" stroke="#2dd4bf" strokeWidth="0.8" opacity="0" />
            <circle className="ma-intel-ripple-inner" cx={CORE_X} cy={CORE_Y} r="38" fill="none" stroke="#5eead4" strokeWidth="0.7" opacity="0" />
            <circle className="ma-intel-ripple-mid" cx={CORE_X} cy={CORE_Y} r="62" fill="none" stroke="#2dd4bf" strokeWidth="0.6" opacity="0" />
            <circle className="ma-intel-ripple-outer" cx={CORE_X} cy={CORE_Y} r="96" fill="none" stroke="rgba(45,212,191,0.35)" strokeWidth="0.5" opacity="0" />
            <circle className="ma-intel-core-ring-delay" cx={CORE_X} cy={CORE_Y} r="32" fill="none" stroke="#5eead4" strokeWidth="0.9" opacity="0" />
            <circle className="ma-intel-core-halo" cx={CORE_X} cy={CORE_Y} r="20" fill="rgba(45,212,191,0.42)" />
            <circle className="ma-intel-core-glow" cx={CORE_X} cy={CORE_Y} r="24" fill="rgba(94,234,212,0.48)" />
            <circle className="ma-intel-core-glow-outer" cx={CORE_X} cy={CORE_Y} r="34" fill="rgba(94,234,212,0.18)" />
            <circle className="ma-intel-core-body" cx={CORE_X} cy={CORE_Y} r="10" fill="#14b8a6" />
            <circle className="ma-intel-core-hot" cx={CORE_X} cy={CORE_Y} r="7" fill="#ecfdf5" />
            <circle className="ma-intel-core-spark" cx={CORE_X} cy={CORE_Y} r="2" fill="#ffffff" />
            <circle className="ma-intel-core-center" cx={CORE_X} cy={CORE_Y} r="3.5" fill="#ffffff" />
          </g>

          {/* C.44 — Dedicated holographic platform (planet frozen, independent group) */}
          <g className="ma-intel-holo-platform" mask="url(#ma-intel-left-mask)">
            <g className="ma-intel-platform-feeds">
              {PLATFORM_PROJECTION_BEAMS.map((beam) => (
                <line
                  key={beam.id}
                  className={`ma-intel-platform-projection-beam ma-intel-${beam.id}`}
                  x1={beam.x}
                  y1={beam.y1}
                  x2={beam.x}
                  y2={beam.y2}
                  strokeLinecap="round"
                />
              ))}
              {DATA_FEEDS.map((feed) => (
                <g key={feed.id}>
                  <line
                    className={`ma-intel-feed ma-intel-feed-${feed.tier} ma-intel-${feed.id}`}
                    x1={feed.x}
                    y1={feed.y1 ?? feedBaseY}
                    x2={feed.x}
                    y2={feed.y2}
                    strokeLinecap="round"
                    strokeDasharray={feedDasharray(feed)}
                  />
                  {feed.tip && (
                    <circle
                      className={`ma-intel-platform-tip ma-intel-platform-tip-${feed.id} ma-intel-platform-tip-active`}
                      cx={feed.x}
                      cy={feed.y2}
                      r="2.5"
                      fill="#2dd4bf"
                    />
                  )}
                </g>
              ))}
              {FEED_NODES.map((node, i) => {
                const feed = feedById[node.feed];
                if (!feed) return null;
                return (
                  <circle
                    key={`fn-${i}`}
                    className={`ma-intel-feed-node ma-intel-feed-node-${i + 1}`}
                    cx={feed.x}
                    cy={node.y}
                    r={node.r}
                    fill="#5eead4"
                  />
                );
              })}
              {FEED_SIGNALS.map((sig) => {
                const feed = feedById[sig.feed];
                if (!feed) return null;
                const yStart = feed.y1 ?? feedBaseY;
                return (
                  <g key={sig.id}>
                    <line
                      className={`ma-intel-feed-signal-trail ma-intel-${sig.id}-trail`}
                      x1={feed.x}
                      y1={yStart}
                      x2={feed.x}
                      y2={feed.y2}
                      strokeLinecap="round"
                      strokeWidth="2.4"
                      strokeDasharray={`16 ${sig.dash}`}
                    />
                    <line
                      className={`ma-intel-feed-signal ma-intel-${sig.id}`}
                      x1={feed.x}
                      y1={yStart}
                      x2={feed.x}
                      y2={feed.y2}
                      strokeLinecap="round"
                      strokeWidth="1.4"
                      strokeDasharray={`4 ${sig.dash}`}
                    />
                  </g>
                );
              })}
              {FEED_TRANSFER_ARCS.map((arc) => (
                <path
                  key={arc.id}
                  className={`ma-intel-feed-transfer ma-intel-${arc.id}`}
                  d={arc.d}
                  fill="none"
                  strokeLinecap="round"
                />
              ))}
              {FEED_SPHERE_TOUCHES.map((touch) => {
                const feed = feedById[touch.feed];
                if (!feed) return null;
                return (
                  <circle
                    key={touch.id}
                    className={`ma-intel-feed-sphere-touch ma-intel-${touch.id}`}
                    cx={feed.x}
                    cy={touch.y}
                    r="2.2"
                    fill="#5eead4"
                  />
                );
              })}
            </g>

            <g
              className="ma-intel-platform-surface"
              clipPath="url(#ma-intel-platform-clip)"
              mask="url(#ma-intel-platform-top-mask)"
            >
              <ellipse
                className="ma-intel-platform-plane-fill"
                cx={CX}
                cy={717}
                rx={488}
                ry={30}
                fill="url(#ma-intel-platform-fill)"
              />
              {PLATFORM_ELLIPSES.map((el, i) => (
                <ellipse
                  key={`pe-${i}`}
                  className={`ma-intel-platform-ring ma-intel-platform-ring-${i + 1} ma-intel-platform-ring-${el.tier || 'mid'}${el.strong ? ' ma-intel-platform-ring-strong' : ''}`}
                  cx={CX}
                  cy={el.cy}
                  rx={el.rx}
                  ry={el.ry}
                  fill="none"
                  strokeWidth={el.strong ? 1.15 : el.tier === 'outer' ? 0.55 : el.tier === 'inner' ? 1 : 0.75}
                  opacity={el.o}
                />
              ))}
              <g className="ma-intel-platform-fragments" fill="none" strokeLinecap="round">
                {PLATFORM_FRAGMENTS.map((frag, i) => (
                  <ellipse
                    key={`pf-${i}`}
                    className={`ma-intel-platform-fragment ma-intel-platform-fragment-${i + 1}`}
                    cx={CX}
                    cy={frag.cy}
                    rx={frag.rx}
                    ry={frag.ry}
                    strokeWidth="0.7"
                    strokeDasharray={frag.dash}
                    strokeDashoffset={frag.offset}
                  />
                ))}
              </g>
              <g className="ma-intel-platform-ring-runners" fill="none" strokeLinecap="round">
                {PLATFORM_RING_RUNNERS.map((runner) => (
                  <ellipse
                    key={runner.id}
                    className={`ma-intel-platform-ring-runner ma-intel-${runner.id}`}
                    cx={CX}
                    cy={runner.cy}
                    rx={runner.rx}
                    ry={runner.ry}
                    strokeWidth="1.25"
                    stroke="#5eead4"
                    strokeDasharray={runner.dash}
                    strokeDashoffset={runner.offset}
                  />
                ))}
              </g>
              <g className="ma-intel-platform-bright-arcs" fill="none" strokeLinecap="round">
                {PLATFORM_BRIGHT_ARCS.map((arc, i) => (
                  <ellipse
                    key={`pba-${i}`}
                    className={`ma-intel-platform-bright-arc ma-intel-platform-bright-arc-${i + 1}`}
                    cx={CX}
                    cy={arc.cy}
                    rx={arc.rx}
                    ry={arc.ry}
                    strokeWidth="1.1"
                    strokeDasharray={arc.dash}
                    strokeDashoffset={arc.offset}
                  />
                ))}
              </g>
              <g className="ma-intel-platform-radials" fill="none" strokeLinecap="round">
                {PLATFORM_RADIALS.map((rad, i) => (
                  <line
                    key={`pr-${i}`}
                    className={`ma-intel-platform-radial ma-intel-platform-radial-${i + 1}`}
                    x1={CX}
                    y1={PLATFORM_BASE_Y}
                    x2={rad.x2}
                    y2={rad.y2}
                  />
                ))}
              </g>
              <g className="ma-intel-platform-spokes" fill="none" strokeLinecap="round">
                {PLATFORM_SPOKES.map((spoke, i) => (
                  <line
                    key={`ps-${i}`}
                    className={`ma-intel-platform-spoke ma-intel-platform-spoke-${i + 1}`}
                    x1={CX}
                    y1={PLATFORM_BASE_Y}
                    x2={spoke.x2}
                    y2={spoke.y2}
                  />
                ))}
              </g>
              <ellipse
                className="ma-intel-platform-emitter-column"
                cx={CORE_X}
                cy={668}
                rx="6"
                ry="58"
                fill="url(#ma-intel-emitter-column)"
              />
              <circle className="ma-intel-base-ripple" cx={CX} cy={PLATFORM_BASE_Y} r="7" fill="none" stroke="#5eead4" strokeWidth="0.95" />
              <circle className="ma-intel-base-ripple-2" cx={CX} cy={PLATFORM_BASE_Y} r="7" fill="none" stroke="#2dd4bf" strokeWidth="0.75" />
              <circle className="ma-intel-base-ripple-3" cx={CX} cy={PLATFORM_BASE_Y} r="7" fill="none" stroke="rgba(94,234,212,0.55)" strokeWidth="0.65" />
              <ellipse className="ma-intel-platform-base-disc" cx={CX} cy={PLATFORM_BASE_Y + 1} rx="26" ry="6.5" fill="rgba(45,212,191,0.24)" stroke="rgba(94,234,212,0.62)" strokeWidth="0.85" />
              <circle className="ma-intel-platform-base-glow" cx={CX} cy={PLATFORM_BASE_Y} r="32" fill="rgba(94,234,212,0.2)" />
              <circle className="ma-intel-platform-base-inner-1" cx={CX} cy={PLATFORM_BASE_Y} r="11" fill="none" stroke="rgba(167, 243, 232, 0.96)" strokeWidth="1.2" />
              <circle className="ma-intel-platform-base-inner-2" cx={CX} cy={PLATFORM_BASE_Y} r="17" fill="none" stroke="rgba(94, 234, 212, 0.82)" strokeWidth="1.05" />
              <circle className="ma-intel-platform-base-inner-3" cx={CX} cy={PLATFORM_BASE_Y} r="23" fill="none" stroke="rgba(45, 212, 191, 0.56)" strokeWidth="0.9" strokeDasharray="4 10" />
              <circle className="ma-intel-platform-base" cx={CX} cy={PLATFORM_BASE_Y} r="5.6" fill="#2dd4bf" opacity="0.98" />
              <circle className="ma-intel-platform-base-hot" cx={CX} cy={PLATFORM_BASE_Y} r="3.2" fill="#ecfdf5" />
              <circle className="ma-intel-platform-base-halo" cx={CX} cy={PLATFORM_BASE_Y} r="24" fill="rgba(94,234,212,0.3)" />
              <circle className="ma-intel-platform-base-ring" cx={CX} cy={PLATFORM_BASE_Y} r="32" fill="none" stroke="rgba(94,234,212,0.72)" strokeWidth="1.05" />
              <circle className="ma-intel-platform-base-ring-2" cx={CX} cy={PLATFORM_BASE_Y} r="46" fill="none" stroke="rgba(94,234,212,0.5)" strokeWidth="0.9" strokeDasharray="5 12" />
              <circle className="ma-intel-platform-base-ring-3" cx={CX} cy={PLATFORM_BASE_Y} r="58" fill="none" stroke="rgba(45,212,191,0.34)" strokeWidth="0.78" strokeDasharray="3 16" />
              <circle className="ma-intel-platform-base-ring-4" cx={CX} cy={PLATFORM_BASE_Y} r="70" fill="none" stroke="rgba(45,212,191,0.2)" strokeWidth="0.65" strokeDasharray="2 20" />
              {PLATFORM_TICKS.map((tick, i) => (
                <line
                  key={`pt-${i}`}
                  className={`ma-intel-platform-tick ma-intel-platform-tick-${i + 1}`}
                  x1={tick.x1}
                  y1={tick.y1}
                  x2={tick.x2}
                  y2={tick.y2}
                  strokeLinecap="round"
                />
              ))}
              {FLOOR_PARTICLES.map((p, i) => (
                <circle
                  key={`fp-${i}`}
                  className={`ma-intel-floor-particle ma-intel-floor-particle-${i + 1}`}
                  cx={p.cx}
                  cy={p.cy}
                  r={p.r}
                  fill="#5eead4"
                />
              ))}
              {PLATFORM_PERIMETER_DOTS.map((dot, i) => (
                <circle
                  key={`ppd-${i}`}
                  className={`ma-intel-platform-perimeter-dot ma-intel-platform-perimeter-dot-${i + 1}`}
                  cx={dot.cx}
                  cy={dot.cy}
                  r={i % 2 === 0 ? 1.2 : 0.85}
                  fill="#5eead4"
                />
              ))}
              {PLATFORM_INTERSECTIONS.map((node, i) => (
                <circle
                  key={`pi-${i}`}
                  className={`ma-intel-platform-intersection ma-intel-platform-intersection-${i + 1}`}
                  cx={node.cx}
                  cy={node.cy}
                  r={i < 4 ? 1.1 : 0.8}
                  fill="#5eead4"
                />
              ))}
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
