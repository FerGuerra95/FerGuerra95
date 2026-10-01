import React, { useEffect, useState } from 'react';

/**
 * Pipeline execution map — presence + motion upgrade (1440 desktop targets).
 * viewBox crop 955×372; nodes scaled in-geometry (~17%), no CSS transform:scale.
 */

const LOOP = '14s';
const VB_W = 1000;
const VB_H = 410;
const PAD_L = 30;
const PAD_R = 30;
const PAD_T = 28;
const PAD_B = 28;
const USABLE_W = VB_W - PAD_L - PAD_R;
const RAIL_Y = PAD_T + (VB_H - PAD_T - PAD_B) / 2;
const RAIL_L = PAD_L + 8;
const RAIL_R = VB_W - PAD_R - 8;
const FAN_V = 112;
const FAN_H = 210;

/* Tighter crop — increases apparent map scale without CSS transform */
const VIEW_X = 22;
const VIEW_Y = 8;
const VIEW_W = 955;
const VIEW_H = 372;

/* ~17% presence uplift vs prior 57/34/68 / IC 100 */
const NODE_RING_R = 67;
const NODE_CORE_R = 40;
const NODE_HALO_R = 80;

/* Hero orchestration core — larger than stage nodes */
const IC_OUTER_R = 118;

const sx = (pct) => Math.round(PAD_L + (USABLE_W * pct) / 100);

const STAGE_X = {
  screening: sx(20),
  nda: sx(34),
  dd: sx(47),
  ic: sx(61),
  negotiation: sx(76),
  closing: sx(89),
};

const STAGES = [
  { id: 'screening', num: '01', label: 'SCREENING', x: STAGE_X.screening, y: RAIL_Y, icon: 'screen' },
  { id: 'nda', num: '02', label: 'NDA', x: STAGE_X.nda, y: RAIL_Y, icon: 'doc' },
  { id: 'dd', num: '03', label: 'DD', x: STAGE_X.dd, y: RAIL_Y, icon: 'shield' },
  { id: 'ic', num: '04', label: 'IC', x: STAGE_X.ic, y: RAIL_Y, icon: 'ic' },
  { id: 'negotiation', num: '05', label: 'NEGOTIATION', x: STAGE_X.negotiation, y: RAIL_Y, icon: 'handshake' },
  { id: 'closing', num: '06', label: 'CLOSING', x: STAGE_X.closing, y: RAIL_Y, icon: 'check' },
];

const ENGINE = { cx: STAGE_X.ic, cy: RAIL_Y };

const STAGE_RAIL = `M ${RAIL_L} ${RAIL_Y} L ${RAIL_R} ${RAIL_Y}`;
const STAGE_RAIL_UPPER = `M ${RAIL_L} ${RAIL_Y - 4} L ${RAIL_R} ${RAIL_Y - 4}`;
const STAGE_RAIL_LOWER = `M ${RAIL_L} ${RAIL_Y + 4} L ${RAIL_R} ${RAIL_Y + 4}`;

const INPUT_PRIMARY = [
  {
    id: 'upper',
    label: 'DEAL SOURCES',
    lx: PAD_L + 6,
    ly: PAD_T + 8,
    sx: PAD_L + 14,
    sy: PAD_T + 26,
    d: `M ${PAD_L + 14} ${PAD_T + 26} C ${PAD_L + 72} ${PAD_T + 58}, ${PAD_L + 132} ${PAD_T + 90}, ${STAGE_X.screening - 38} ${RAIL_Y - FAN_V} C ${STAGE_X.screening - 18} ${RAIL_Y - 36}, ${STAGE_X.screening - 6} ${RAIL_Y - 12}, ${STAGE_X.screening} ${RAIL_Y - 4}`,
    companion: `M ${PAD_L + 8} ${PAD_T + 14} C ${PAD_L + 66} ${PAD_T + 44}, ${PAD_L + 124} ${PAD_T + 74}, ${STAGE_X.screening - 42} ${RAIL_Y - FAN_V - 8}`,
  },
  {
    id: 'mid',
    label: 'INBOUND FLOW',
    lx: PAD_L + 4,
    ly: RAIL_Y - 22,
    sx: PAD_L + 10,
    sy: RAIL_Y + 6,
    d: `M ${PAD_L + 10} ${RAIL_Y + 6} C ${PAD_L + 82} ${RAIL_Y + 2}, ${PAD_L + 148} ${RAIL_Y}, ${STAGE_X.screening} ${RAIL_Y}`,
    companion: `M ${PAD_L + 6} ${RAIL_Y - 4} C ${PAD_L + 78} ${RAIL_Y - 6}, ${PAD_L + 142} ${RAIL_Y - 2}, ${STAGE_X.screening - 6} ${RAIL_Y}`,
  },
  {
    id: 'lower',
    label: 'MARKET SIGNALS',
    lx: PAD_L + 6,
    ly: VB_H - PAD_B - 22,
    sx: PAD_L + 14,
    sy: VB_H - PAD_B - 8,
    d: `M ${PAD_L + 14} ${VB_H - PAD_B - 8} C ${PAD_L + 82} ${VB_H - PAD_B - FAN_V}, ${PAD_L + 148} ${RAIL_Y + FAN_V - 12}, ${STAGE_X.screening - 24} ${RAIL_Y + 22} C ${STAGE_X.screening - 10} ${RAIL_Y + 10}, ${STAGE_X.screening - 3} ${RAIL_Y + 4}, ${STAGE_X.screening} ${RAIL_Y}`,
    companion: `M ${PAD_L + 18} ${VB_H - PAD_B - 2} C ${PAD_L + 86} ${VB_H - PAD_B - FAN_V + 12}, ${PAD_L + 152} ${RAIL_Y + FAN_V - 20}, ${STAGE_X.screening - 28} ${RAIL_Y + 18}`,
  },
];

const INPUT_SECONDARY = [
  `M ${PAD_L + 2} ${PAD_T + 38} C ${PAD_L + 58} ${PAD_T + 68}, ${PAD_L + 118} ${PAD_T + 98}, ${STAGE_X.screening - 28} ${RAIL_Y - 24}`,
  `M ${PAD_L} ${RAIL_Y - 38} C ${PAD_L + 56} ${RAIL_Y - 28}, ${PAD_L + 122} ${RAIL_Y - 14}, ${STAGE_X.screening - 12} ${RAIL_Y - 6}`,
  `M ${PAD_L + 4} ${RAIL_Y + 38} C ${PAD_L + 72} ${RAIL_Y + 30}, ${PAD_L + 136} ${RAIL_Y + 18}, ${STAGE_X.screening - 8} ${RAIL_Y + 6}`,
  `M ${PAD_L + 2} ${PAD_T + 68} C ${PAD_L + 52} ${PAD_T + 98}, ${PAD_L + 108} ${RAIL_Y - 18}, ${STAGE_X.screening - 20} ${RAIL_Y - 12}`,
  `M ${PAD_L + 6} ${RAIL_Y + 26} C ${PAD_L + 74} ${RAIL_Y + 20}, ${PAD_L + 138} ${RAIL_Y + 12}, ${STAGE_X.screening - 6} ${RAIL_Y + 3}`,
  `M ${PAD_L + 24} ${PAD_T + 22} C ${PAD_L + 78} ${PAD_T + 52}, ${PAD_L + 132} ${PAD_T + 82}, ${STAGE_X.screening - 32} ${RAIL_Y - 28}`,
  `M ${PAD_L + 8} ${VB_H - PAD_B - 48} C ${PAD_L + 76} ${RAIL_Y + 42}, ${PAD_L + 140} ${RAIL_Y + 26}, ${STAGE_X.screening - 14} ${RAIL_Y + 8}`,
  `M ${PAD_L + 4} ${PAD_T + 52} C ${PAD_L + 58} ${PAD_T + 78}, ${PAD_L + 114} ${RAIL_Y - 10}, ${STAGE_X.screening - 16} ${RAIL_Y - 8}`,
];

const INTER_STAGE_UPPER = [
  `M ${STAGE_X.screening} ${RAIL_Y} C ${STAGE_X.screening + 48} ${RAIL_Y - 52}, ${STAGE_X.nda - 48} ${RAIL_Y - 58}, ${STAGE_X.nda} ${RAIL_Y}`,
  `M ${STAGE_X.nda} ${RAIL_Y} C ${STAGE_X.nda + 48} ${RAIL_Y - 48}, ${STAGE_X.dd - 48} ${RAIL_Y - 54}, ${STAGE_X.dd} ${RAIL_Y}`,
  `M ${STAGE_X.dd} ${RAIL_Y} C ${STAGE_X.dd + 48} ${RAIL_Y - 44}, ${STAGE_X.ic - 58} ${RAIL_Y - 50}, ${STAGE_X.ic} ${RAIL_Y}`,
  `M ${STAGE_X.ic} ${RAIL_Y} C ${STAGE_X.ic + 58} ${RAIL_Y - 40}, ${STAGE_X.negotiation - 48} ${RAIL_Y - 46}, ${STAGE_X.negotiation} ${RAIL_Y}`,
  `M ${STAGE_X.negotiation} ${RAIL_Y} C ${STAGE_X.negotiation + 48} ${RAIL_Y - 38}, ${STAGE_X.closing - 48} ${RAIL_Y - 44}, ${STAGE_X.closing} ${RAIL_Y}`,
];

const INTER_STAGE_LOWER = [
  `M ${STAGE_X.screening} ${RAIL_Y} C ${STAGE_X.screening + 48} ${RAIL_Y + 48}, ${STAGE_X.nda - 48} ${RAIL_Y + 54}, ${STAGE_X.nda} ${RAIL_Y}`,
  `M ${STAGE_X.nda} ${RAIL_Y} C ${STAGE_X.nda + 48} ${RAIL_Y + 44}, ${STAGE_X.dd - 48} ${RAIL_Y + 50}, ${STAGE_X.dd} ${RAIL_Y}`,
  `M ${STAGE_X.dd} ${RAIL_Y} C ${STAGE_X.dd + 48} ${RAIL_Y + 40}, ${STAGE_X.ic - 58} ${RAIL_Y + 46}, ${STAGE_X.ic} ${RAIL_Y}`,
  `M ${STAGE_X.ic} ${RAIL_Y} C ${STAGE_X.ic + 58} ${RAIL_Y + 36}, ${STAGE_X.negotiation - 48} ${RAIL_Y + 42}, ${STAGE_X.negotiation} ${RAIL_Y}`,
  `M ${STAGE_X.negotiation} ${RAIL_Y} C ${STAGE_X.negotiation + 48} ${RAIL_Y + 34}, ${STAGE_X.closing - 48} ${RAIL_Y + 40}, ${STAGE_X.closing} ${RAIL_Y}`,
];

const SUPPORT_STREAMS = [
  `M ${STAGE_X.screening + 36} ${RAIL_Y - FAN_V - 8} C ${STAGE_X.nda + 26} ${RAIL_Y - FAN_V - 12}, ${STAGE_X.dd + 14} ${RAIL_Y - FAN_V + 4}, ${STAGE_X.ic - 28} ${RAIL_Y - FAN_V}`,
  `M ${STAGE_X.screening + 40} ${RAIL_Y + FAN_V - 16} C ${STAGE_X.nda + 30} ${RAIL_Y + FAN_V - 12}, ${STAGE_X.dd + 18} ${RAIL_Y + FAN_V - 24}, ${STAGE_X.ic - 22} ${RAIL_Y + FAN_V - 20}`,
  `M ${STAGE_X.dd + 12} ${RAIL_Y - FAN_V + 12} C ${STAGE_X.ic - 38} ${RAIL_Y - FAN_V + 8}, ${STAGE_X.negotiation - 48} ${RAIL_Y - FAN_V + 20}, ${STAGE_X.negotiation - 10} ${RAIL_Y - FAN_V + 16}`,
  `M ${STAGE_X.dd + 16} ${RAIL_Y + FAN_V - 28} C ${STAGE_X.ic - 34} ${RAIL_Y + FAN_V - 24}, ${STAGE_X.negotiation - 44} ${RAIL_Y + FAN_V - 32}, ${STAGE_X.negotiation - 6} ${RAIL_Y + FAN_V - 28}`,
];

const INTER_STAGE_MID = [
  `M ${STAGE_X.screening} ${RAIL_Y} C ${STAGE_X.screening + 44} ${RAIL_Y - 18}, ${STAGE_X.nda - 44} ${RAIL_Y - 20}, ${STAGE_X.nda} ${RAIL_Y}`,
  `M ${STAGE_X.nda} ${RAIL_Y} C ${STAGE_X.nda + 44} ${RAIL_Y + 18}, ${STAGE_X.dd - 44} ${RAIL_Y + 20}, ${STAGE_X.dd} ${RAIL_Y}`,
  `M ${STAGE_X.dd} ${RAIL_Y} C ${STAGE_X.dd + 44} ${RAIL_Y - 16}, ${STAGE_X.ic - 54} ${RAIL_Y - 18}, ${STAGE_X.ic} ${RAIL_Y}`,
  `M ${STAGE_X.ic} ${RAIL_Y} C ${STAGE_X.ic + 54} ${RAIL_Y + 16}, ${STAGE_X.negotiation - 44} ${RAIL_Y + 18}, ${STAGE_X.negotiation} ${RAIL_Y}`,
  `M ${STAGE_X.negotiation} ${RAIL_Y} C ${STAGE_X.negotiation + 44} ${RAIL_Y - 14}, ${STAGE_X.closing - 44} ${RAIL_Y - 16}, ${STAGE_X.closing} ${RAIL_Y}`,
];

const RAIL_SEGMENT_WAKES = [
  `M ${STAGE_X.screening} ${RAIL_Y} L ${STAGE_X.nda} ${RAIL_Y}`,
  `M ${STAGE_X.nda} ${RAIL_Y} L ${STAGE_X.dd} ${RAIL_Y}`,
  `M ${STAGE_X.dd} ${RAIL_Y} L ${STAGE_X.ic} ${RAIL_Y}`,
  `M ${STAGE_X.ic} ${RAIL_Y} L ${STAGE_X.negotiation} ${RAIL_Y}`,
  `M ${STAGE_X.negotiation} ${RAIL_Y} L ${STAGE_X.closing} ${RAIL_Y}`,
];

const IC_ENTRY_PATH = `M ${STAGE_X.ic - 52} ${RAIL_Y} C ${STAGE_X.ic - 28} ${RAIL_Y - 8}, ${STAGE_X.ic - 10} ${RAIL_Y - 4}, ${STAGE_X.ic} ${RAIL_Y}`;

const LOWER_FLOW_ROUTES = [
  `M ${STAGE_X.screening + 28} ${RAIL_Y + 68} C ${STAGE_X.nda + 14} ${RAIL_Y + 62}, ${STAGE_X.dd + 4} ${RAIL_Y + 54}, ${STAGE_X.ic - 52} ${RAIL_Y + 46}`,
  `M ${STAGE_X.ic + 14} ${RAIL_Y + 58} C ${STAGE_X.negotiation - 28} ${RAIL_Y + 50}, ${STAGE_X.closing - 48} ${RAIL_Y + 42}, ${STAGE_X.closing - 14} ${RAIL_Y + 34}`,
];

const UPPER_FLOW_ROUTES = [
  `M ${STAGE_X.screening + 22} ${RAIL_Y - 72} C ${STAGE_X.nda + 12} ${RAIL_Y - 66}, ${STAGE_X.dd - 12} ${RAIL_Y - 58}, ${STAGE_X.ic - 56} ${RAIL_Y - 50}`,
  `M ${STAGE_X.ic + 12} ${RAIL_Y - 58} C ${STAGE_X.negotiation - 24} ${RAIL_Y - 50}, ${STAGE_X.closing - 44} ${RAIL_Y - 42}, ${STAGE_X.closing - 12} ${RAIL_Y - 34}`,
];

const EXEC_BRANCHES = [
  `M ${STAGE_X.ic} ${RAIL_Y} C ${STAGE_X.ic + 58} ${RAIL_Y - 62}, ${STAGE_X.negotiation - 36} ${RAIL_Y - 72}, ${STAGE_X.negotiation} ${RAIL_Y}`,
  `M ${STAGE_X.ic} ${RAIL_Y} C ${STAGE_X.ic + 42} ${RAIL_Y + 56}, ${STAGE_X.negotiation - 28} ${RAIL_Y + 66}, ${STAGE_X.negotiation} ${RAIL_Y}`,
  `M ${STAGE_X.ic} ${RAIL_Y} C ${STAGE_X.ic - 46} ${RAIL_Y - 56}, ${STAGE_X.dd + 28} ${RAIL_Y - 66}, ${STAGE_X.dd} ${RAIL_Y}`,
  `M ${STAGE_X.ic} ${RAIL_Y} C ${STAGE_X.ic + 62} ${RAIL_Y - 24}, ${STAGE_X.negotiation - 16} ${RAIL_Y - 14}, ${STAGE_X.negotiation} ${RAIL_Y}`,
  `M ${STAGE_X.ic} ${RAIL_Y} C ${STAGE_X.ic + 62} ${RAIL_Y + 18}, ${STAGE_X.negotiation - 16} ${RAIL_Y + 28}, ${STAGE_X.negotiation} ${RAIL_Y}`,
];

const OUTPUT_END = VB_W - PAD_R - 4;

const OUTPUT_FAN = [
  `M ${STAGE_X.closing} ${RAIL_Y} C ${STAGE_X.closing + 48} ${RAIL_Y - FAN_V - 12}, ${STAGE_X.closing + 78} ${RAIL_Y - FAN_V - 22}, ${OUTPUT_END} ${RAIL_Y - FAN_V - 28}`,
  `M ${STAGE_X.closing} ${RAIL_Y} C ${STAGE_X.closing + 52} ${RAIL_Y - 42}, ${STAGE_X.closing + 82} ${RAIL_Y - 54}, ${OUTPUT_END} ${RAIL_Y - 62}`,
  `M ${STAGE_X.closing} ${RAIL_Y} C ${STAGE_X.closing + 54} ${RAIL_Y - 14}, ${STAGE_X.closing + 84} ${RAIL_Y - 18}, ${OUTPUT_END} ${RAIL_Y - 22}`,
  `M ${STAGE_X.closing} ${RAIL_Y} C ${STAGE_X.closing + 48} ${RAIL_Y + 18}, ${STAGE_X.closing + 78} ${RAIL_Y + 26}, ${OUTPUT_END} ${RAIL_Y + 32}`,
  `M ${STAGE_X.closing} ${RAIL_Y} C ${STAGE_X.closing + 46} ${RAIL_Y - FAN_V}, ${STAGE_X.closing + 76} ${RAIL_Y - FAN_V - 10}, ${OUTPUT_END - 10} ${RAIL_Y - FAN_V - 18}`,
  `M ${STAGE_X.closing} ${RAIL_Y} C ${STAGE_X.closing + 52} ${RAIL_Y + 38}, ${STAGE_X.closing + 82} ${RAIL_Y + 48}, ${OUTPUT_END} ${RAIL_Y + 54}`,
  `M ${STAGE_X.closing} ${RAIL_Y} C ${STAGE_X.closing + 44} ${RAIL_Y + FAN_V - 32}, ${STAGE_X.closing + 74} ${RAIL_Y + FAN_V - 22}, ${OUTPUT_END - 6} ${RAIL_Y + FAN_V - 16}`,
];

const PRIORITY_ROUTE = `M ${STAGE_X.closing} ${RAIL_Y} C ${STAGE_X.closing + 54} ${RAIL_Y - 48}, ${STAGE_X.closing + 82} ${RAIL_Y - 66}, ${OUTPUT_END} ${RAIL_Y - FAN_V - 18}`;

const FOREGROUND_ROUTES = [
  `M ${PAD_L + 14} ${VB_H - PAD_B - 10} C ${PAD_L + 88} ${RAIL_Y + 42}, ${STAGE_X.screening - 24} ${RAIL_Y + 12}, ${STAGE_X.screening} ${RAIL_Y} C ${STAGE_X.nda} ${RAIL_Y}, ${STAGE_X.dd} ${RAIL_Y}, ${STAGE_X.ic} ${RAIL_Y} C ${STAGE_X.negotiation} ${RAIL_Y}, ${STAGE_X.closing} ${RAIL_Y}, ${STAGE_X.closing} ${RAIL_Y}`,
  `M ${PAD_L + 12} ${VB_H - PAD_B - 28} C ${PAD_L + 82} ${RAIL_Y + 32}, ${STAGE_X.screening - 18} ${RAIL_Y + 8}, ${STAGE_X.screening + 6} ${RAIL_Y + 6} C ${STAGE_X.nda + 6} ${RAIL_Y + 6}, ${STAGE_X.dd + 6} ${RAIL_Y + 6}, ${STAGE_X.ic + 6} ${RAIL_Y + 6}`,
];

const NEGOTIATION_DUAL = [
  `M ${STAGE_X.negotiation} ${RAIL_Y} C ${STAGE_X.negotiation + 24} ${RAIL_Y - 28}, ${STAGE_X.negotiation + 46} ${RAIL_Y - 16}, ${STAGE_X.closing - 24} ${RAIL_Y}`,
  `M ${STAGE_X.negotiation} ${RAIL_Y} C ${STAGE_X.negotiation + 24} ${RAIL_Y + 28}, ${STAGE_X.negotiation + 46} ${RAIL_Y + 16}, ${STAGE_X.closing - 24} ${RAIL_Y}`,
];

const NEGOTIATION_NODES = [
  { x: STAGE_X.negotiation + 28, y: RAIL_Y - 32 },
  { x: STAGE_X.negotiation + 46, y: RAIL_Y + 32 },
];

const DD_BRANCHES = [
  `M ${STAGE_X.dd} ${RAIL_Y} C ${STAGE_X.dd + 8} ${RAIL_Y - 44}, ${STAGE_X.dd + 16} ${RAIL_Y - 52}, ${STAGE_X.dd + 28} ${RAIL_Y - 30}`,
  `M ${STAGE_X.dd} ${RAIL_Y} C ${STAGE_X.dd + 8} ${RAIL_Y + 38}, ${STAGE_X.dd + 16} ${RAIL_Y + 46}, ${STAGE_X.dd + 28} ${RAIL_Y + 24}`,
  `M ${STAGE_X.dd} ${RAIL_Y} C ${STAGE_X.dd + 22} ${RAIL_Y - 18}, ${STAGE_X.dd + 32} ${RAIL_Y - 24}, ${STAGE_X.dd + 42} ${RAIL_Y - 12}`,
];

const DD_NODES = [
  { x: STAGE_X.dd + 14, y: RAIL_Y - 46 },
  { x: STAGE_X.dd + 32, y: RAIL_Y + 40 },
];

const PRIMARY_JOURNEY =
  `M ${PAD_L + 14} ${VB_H - PAD_B - 10} C ${PAD_L + 88} ${RAIL_Y + 42}, ${STAGE_X.screening - 24} ${RAIL_Y + 12}, ${STAGE_X.screening} ${RAIL_Y} C ${STAGE_X.nda} ${RAIL_Y}, ${STAGE_X.dd} ${RAIL_Y}, ${STAGE_X.ic} ${RAIL_Y} C ${STAGE_X.negotiation} ${RAIL_Y}, ${STAGE_X.closing} ${RAIL_Y}, ${STAGE_X.closing} ${RAIL_Y} C ${STAGE_X.closing + 48} ${RAIL_Y - 38}, ${OUTPUT_END - 16} ${RAIL_Y - 62}, ${OUTPUT_END} ${RAIL_Y - FAN_V - 12}`;

const BACKGROUND_ARCS = [
  `M ${PAD_L} ${PAD_T + 32} C ${STAGE_X.dd} ${PAD_T + 18}, ${STAGE_X.ic} ${PAD_T + 22}, ${OUTPUT_END} ${PAD_T + 28}`,
  `M ${PAD_L} ${VB_H - PAD_B - 24} C ${STAGE_X.dd} ${VB_H - PAD_B - 32}, ${STAGE_X.ic} ${VB_H - PAD_B - 28}, ${OUTPUT_END} ${VB_H - PAD_B - 22}`,
];

const MICRO_FILAMENTS = [
  `M ${STAGE_X.screening + 28} ${RAIL_Y - 28} C ${STAGE_X.nda - 28} ${RAIL_Y - 32}, ${STAGE_X.nda + 28} ${RAIL_Y - 26}, ${STAGE_X.dd - 28} ${RAIL_Y - 22}`,
  `M ${STAGE_X.screening + 32} ${RAIL_Y + 22} C ${STAGE_X.nda - 22} ${RAIL_Y + 26}, ${STAGE_X.nda + 32} ${RAIL_Y + 20}, ${STAGE_X.dd - 22} ${RAIL_Y + 16}`,
  `M ${STAGE_X.dd + 22} ${RAIL_Y - 24} C ${STAGE_X.ic - 38} ${RAIL_Y - 28}, ${STAGE_X.ic + 28} ${RAIL_Y - 22}, ${STAGE_X.negotiation - 32} ${RAIL_Y - 18}`,
  `M ${STAGE_X.dd + 24} ${RAIL_Y + 18} C ${STAGE_X.ic - 36} ${RAIL_Y + 22}, ${STAGE_X.ic + 30} ${RAIL_Y + 16}, ${STAGE_X.negotiation - 30} ${RAIL_Y + 12}`,
  `M ${STAGE_X.ic + 32} ${RAIL_Y - 22} C ${STAGE_X.negotiation - 24} ${RAIL_Y - 26}, ${STAGE_X.negotiation + 24} ${RAIL_Y - 20}, ${STAGE_X.closing - 24} ${RAIL_Y - 16}`,
  `M ${STAGE_X.ic + 34} ${RAIL_Y + 16} C ${STAGE_X.negotiation - 22} ${RAIL_Y + 20}, ${STAGE_X.negotiation + 28} ${RAIL_Y + 14}, ${STAGE_X.closing - 22} ${RAIL_Y + 10}`,
  `M ${STAGE_X.screening - 14} ${RAIL_Y - 12} C ${STAGE_X.nda - 38} ${RAIL_Y - 14}, ${STAGE_X.nda + 14} ${RAIL_Y - 8}, ${STAGE_X.dd - 38} ${RAIL_Y - 6}`,
  `M ${STAGE_X.negotiation + 12} ${RAIL_Y - 8} C ${STAGE_X.closing - 28} ${RAIL_Y - 10}, ${STAGE_X.closing + 16} ${RAIL_Y - 6}, ${OUTPUT_END - 32} ${RAIL_Y - 4}`,
];

const JUNCTION_NODES = [
  { x: STAGE_X.screening + 52, y: RAIL_Y - 24, cls: 'jn-0' },
  { x: STAGE_X.nda + 52, y: RAIL_Y + 22, cls: 'jn-1' },
  { x: STAGE_X.dd + 48, y: RAIL_Y - 22, cls: 'jn-2' },
  { x: STAGE_X.ic + 64, y: RAIL_Y + 18, cls: 'jn-3' },
  { x: STAGE_X.negotiation + 52, y: RAIL_Y - 16, cls: 'jn-4' },
  { x: STAGE_X.screening - 12, y: RAIL_Y + 28, cls: 'jn-5' },
  { x: STAGE_X.closing + 36, y: RAIL_Y - 28, cls: 'jn-6' },
];

const RAIL_NODES = [
  Math.round((STAGE_X.screening + STAGE_X.nda) / 2),
  Math.round((STAGE_X.nda + STAGE_X.dd) / 2),
  Math.round((STAGE_X.dd + STAGE_X.ic) / 2),
  Math.round((STAGE_X.ic + STAGE_X.negotiation) / 2),
  Math.round((STAGE_X.negotiation + STAGE_X.closing) / 2),
];

const SECONDARY_DEALS = [
  { path: `M ${PAD_L + 10} ${PAD_T + 32} C ${PAD_L + 72} ${PAD_T + 68}, ${PAD_L + 132} ${RAIL_Y - 26}, ${STAGE_X.screening - 8} ${RAIL_Y - 6}`, dur: '10.5s', begin: '0s', tier: 'ghost' },
  { path: `M ${PAD_L + 8} ${RAIL_Y + 22} C ${PAD_L + 84} ${RAIL_Y + 14}, ${STAGE_X.nda - 28} ${RAIL_Y + 4}, ${STAGE_X.nda} ${RAIL_Y}`, dur: '11.5s', begin: '-3.2s', tier: 'mid' },
  { path: `M ${STAGE_X.nda + 28} ${RAIL_Y + 44} C ${STAGE_X.dd - 14} ${RAIL_Y + 36}, ${STAGE_X.dd + 28} ${RAIL_Y + 26}, ${STAGE_X.ic - 38} ${RAIL_Y}`, dur: '9.4s', begin: '-6.1s', tier: 'ghost' },
  { path: `M ${STAGE_X.dd + 22} ${RAIL_Y + 38} C ${STAGE_X.ic - 28} ${RAIL_Y + 30}, ${STAGE_X.negotiation - 48} ${RAIL_Y + 20}, ${STAGE_X.negotiation - 10} ${RAIL_Y}`, dur: '8.4s', begin: '-2.1s', tier: 'mid' },
  { path: `M ${PAD_L + 12} ${RAIL_Y - 12} C ${STAGE_X.screening - 28} ${RAIL_Y - 6}, ${STAGE_X.nda - 38} ${RAIL_Y}, ${STAGE_X.dd} ${RAIL_Y}`, dur: '7.6s', begin: '-4.6s', tier: 'ghost' },
];

const NEGOTIATION_PACKETS = [
  { path: NEGOTIATION_DUAL[0], dur: '8.0s', begin: '-5.8s', tier: 'ghost' },
  { path: NEGOTIATION_DUAL[1], dur: '7.2s', begin: '-4.9s', tier: 'ghost' },
];

const SOURCE_PACKETS = [
  { path: INPUT_PRIMARY[0].d, dur: '8.8s', begin: '-0.8s', tier: 'ghost' },
  { path: INPUT_PRIMARY[1].d, dur: '7.4s', begin: '-2.4s', tier: 'mid' },
  { path: INPUT_PRIMARY[2].d, dur: '9.4s', begin: '-4.2s', tier: 'ghost' },
  { path: INPUT_SECONDARY[0], dur: '11.0s', begin: '-2.8s', tier: 'ghost' },
  { path: INPUT_SECONDARY[3], dur: '10.0s', begin: '-5.4s', tier: 'mid' },
  { path: INPUT_SECONDARY[5], dur: '8.2s', begin: '-1.6s', tier: 'ghost' },
];

const PARKED_DEALS = [
  { x: PAD_L + 32, y: RAIL_Y - 36, w: 14, h: 10, opacity: 0.58 },
  { x: STAGE_X.screening + 58, y: RAIL_Y - 22, w: 14, h: 10, opacity: 0.62 },
  { x: STAGE_X.nda + 52, y: RAIL_Y + 28, w: 14, h: 10, opacity: 0.6 },
  { x: STAGE_X.dd + 48, y: RAIL_Y - 20, w: 13, h: 9, opacity: 0.55 },
  { x: STAGE_X.ic - 72, y: RAIL_Y + 24, w: 14, h: 10, opacity: 0.58 },
  { x: STAGE_X.negotiation + 52, y: RAIL_Y - 18, w: 14, h: 10, opacity: 0.62 },
  { x: STAGE_X.closing - 14, y: RAIL_Y + 24, w: 13, h: 9, opacity: 0.56 },
  { x: OUTPUT_END - 28, y: RAIL_Y - 38, w: 14, h: 10, opacity: 0.52 },
];

const STATIC_SOURCE_MARKERS = [
  { x: PAD_L + 14, y: PAD_T + 26 }, { x: PAD_L + 10, y: RAIL_Y + 6 }, { x: PAD_L + 14, y: VB_H - PAD_B - 8 },
  { x: PAD_L + 28, y: PAD_T + 38 }, { x: PAD_L + 10, y: RAIL_Y + 26 },
];

const STATIC_DEAL_MARKERS = [
  { x: STAGE_X.screening, y: RAIL_Y - 6 }, { x: STAGE_X.nda, y: RAIL_Y - 6 }, { x: STAGE_X.dd, y: RAIL_Y - 6 },
  { x: STAGE_X.ic, y: RAIL_Y - 6 }, { x: STAGE_X.negotiation, y: RAIL_Y - 6 }, { x: STAGE_X.closing, y: RAIL_Y - 6 },
  { x: STAGE_X.dd + 12, y: RAIL_Y + 24 }, { x: STAGE_X.negotiation - 12, y: RAIL_Y + 24 },
];

const ENGINE_ARCS = [
  { r: Math.round(IC_OUTER_R * 0.68), start: 200, end: 320 },
  { r: Math.round(IC_OUTER_R * 0.54), start: 30, end: 150 },
  { r: Math.round(IC_OUTER_R * 0.4), start: 160, end: 280 },
];

const ENGINE_ROUTE_NODES = [
  { x: 0, y: -Math.round(IC_OUTER_R * 0.62) },
  { x: Math.round(IC_OUTER_R * 0.62), y: 0 },
  { x: 0, y: Math.round(IC_OUTER_R * 0.62) },
  { x: -Math.round(IC_OUTER_R * 0.62), y: 0 },
  { x: Math.round(IC_OUTER_R * 0.44), y: -Math.round(IC_OUTER_R * 0.44) },
  { x: Math.round(IC_OUTER_R * 0.44), y: Math.round(IC_OUTER_R * 0.44) },
  { x: -Math.round(IC_OUTER_R * 0.44), y: Math.round(IC_OUTER_R * 0.44) },
  { x: -Math.round(IC_OUTER_R * 0.44), y: -Math.round(IC_OUTER_R * 0.44) },
];

function usePrefersReducedMotion() {
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

function arcPath(r, startDeg, endDeg) {
  const s = (startDeg * Math.PI) / 180;
  const e = (endDeg * Math.PI) / 180;
  const x1 = Math.cos(s) * r;
  const y1 = Math.sin(s) * r;
  const x2 = Math.cos(e) * r;
  const y2 = Math.sin(e) * r;
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

function StageIcon({ type }) {
  switch (type) {
    case 'screen':
      return (
        <>
          <circle r="5" fill="none" stroke="rgba(94,234,212,0.78)" strokeWidth="0.75" />
          <line x1="3.2" y1="3.2" x2="6.8" y2="6.8" stroke="rgba(94,234,212,0.78)" strokeWidth="0.65" />
        </>
      );
    case 'doc':
      return (
        <rect x="-3.8" y="-4.8" width="7.6" height="9.6" rx="0.55" fill="none" stroke="rgba(94,234,212,0.78)" strokeWidth="0.65" />
      );
    case 'shield':
      return (
        <path d="M 0 -5 L 4.4 -2.8 L 4.4 2.8 C 4.4 4.8 0 6 0 6 C 0 6 -4.4 4.8 -4.4 2.8 L -4.4 -2.8 Z" fill="none" stroke="rgba(94,234,212,0.78)" strokeWidth="0.65" />
      );
    case 'ic':
      return (
        <>
          <circle cx="-2.8" cy="-1.2" r="2" fill="rgba(94,234,212,0.58)" />
          <circle cx="2.8" cy="-1.2" r="2" fill="rgba(94,234,212,0.58)" />
          <path d="M -4.4 4 C -2.2 2.4 2.2 2.4 4.4 4" fill="none" stroke="rgba(94,234,212,0.78)" strokeWidth="0.65" />
        </>
      );
    case 'handshake':
      return (
        <path d="M -5 0 L -1.2 2.8 L 1.2 -1.2 L 5 2.2" fill="none" stroke="rgba(94,234,212,0.78)" strokeWidth="0.65" strokeLinecap="round" />
      );
    case 'check':
      return (
        <path d="M -4 0 L -0.6 3.2 L 4.4 -3.4" fill="none" stroke="rgba(94,234,212,0.85)" strokeWidth="0.78" strokeLinecap="round" />
      );
    default:
      return null;
  }
}

function StageNode({ stage, reduced }) {
  const isIc = stage.id === 'ic';
  if (isIc) {
    return (
      <g className={`ma-pipe-orch-stage ma-pipe-orch-stage-${stage.id}`} transform={`translate(${stage.x}, ${stage.y})`}>
        <text className="ma-pipe-orch-stage-num" y={-(IC_OUTER_R + 20)} textAnchor="middle" fill="rgba(94,234,212,0.88)" fontSize="13" fontWeight="700" letterSpacing="0.08em">
          {stage.num}
        </text>
        <text className="ma-pipe-orch-stage-label" y={-(IC_OUTER_R + 5)} textAnchor="middle" fill="rgba(226,232,240,0.92)" fontSize="13" fontWeight="700" letterSpacing="0.1em">
          {stage.label}
        </text>
      </g>
    );
  }
  return (
    <g className={`ma-pipe-orch-stage ma-pipe-orch-stage-${stage.id}`} transform={`translate(${stage.x}, ${stage.y})`}>
      <text className="ma-pipe-orch-stage-num" y={-(NODE_RING_R + 30)} textAnchor="middle" fill="rgba(94,234,212,0.86)" fontSize="12.5" fontWeight="700" letterSpacing="0.08em">
        {stage.num}
      </text>
      <text className="ma-pipe-orch-stage-label" y={-(NODE_RING_R + 13)} textAnchor="middle" fill="rgba(226,232,240,0.9)" fontSize="12.5" fontWeight="700" letterSpacing="0.1em">
        {stage.label}
      </text>
      <circle className="ma-pipe-orch-stage-halo" r={NODE_HALO_R} fill="url(#ma-pipe-orch-node-halo)" />
      <circle
        className="ma-pipe-orch-stage-outer"
        r={NODE_RING_R + 7}
        fill="none"
        stroke="rgba(45,212,191,0.22)"
        strokeWidth="0.85"
        strokeDasharray="2.2 5.5"
      />
      <circle className="ma-pipe-orch-stage-ring" r={NODE_RING_R} fill="rgba(2,8,14,0.94)" stroke="rgba(45,212,191,0.72)" strokeWidth="1.75" />
      <circle className="ma-pipe-orch-stage-tech" r={NODE_RING_R - 5.5} fill="none" stroke="rgba(94,234,212,0.28)" strokeWidth="0.7" />
      <circle className="ma-pipe-orch-stage-core" r={NODE_CORE_R} fill="rgba(1,6,12,0.96)" stroke="rgba(94,234,212,0.58)" strokeWidth="1.25" />
      <g className="ma-pipe-orch-stage-icon" transform="scale(1.85)"><StageIcon type={stage.icon} /></g>
      {!reduced ? <circle className="ma-pipe-orch-stage-pulse-ring" r={NODE_RING_R} fill="none" stroke="#5eead4" strokeWidth="1.2" /> : null}
      <line className="ma-pipe-orch-stage-guide" x1={0} y1={NODE_RING_R + 6} x2={0} y2={NODE_RING_R + 28} stroke="rgba(45,212,191,0.38)" strokeWidth="0.9" />
      <circle className="ma-pipe-orch-stage-orbit" cx={NODE_RING_R + 2} cy={-NODE_RING_R * 0.35} r="1.35" fill="rgba(94,234,212,0.55)" />
      <circle className="ma-pipe-orch-stage-orbit" cx={-(NODE_RING_R + 1)} cy={NODE_RING_R * 0.42} r="1.1" fill="rgba(45,212,191,0.42)" />
    </g>
  );
}

function StageGate({ stageId, cx, cy }) {
  return (
    <g className={`ma-pipe-orch-gate ma-pipe-orch-gate-${stageId}`} transform={`translate(${cx}, ${cy})`}>
      <ellipse rx={68} ry={38} fill="none" stroke="rgba(94,234,212,0.36)" strokeWidth="1.15" strokeDasharray="6 8" />
      <line x1={0} y1={-56} x2={0} y2={-78} stroke="rgba(45,212,191,0.32)" strokeWidth="0.9" />
    </g>
  );
}

function StaticPacket({ x, y, w, h, opacity = 1 }) {
  return (
    <g opacity={opacity}>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={0.65} fill="rgba(2,8,12,0.94)" stroke="rgba(94,234,212,0.58)" strokeWidth="0.65" />
      <rect x={x - w / 2 + 1.8} y={y - h / 2 + 1.5} width={w - 3.6} height={h - 3} rx={0.35} fill="rgba(45,212,191,0.26)" />
    </g>
  );
}

function OrchestrationEngine({ reduced }) {
  const icMid = Math.round(IC_OUTER_R * 0.92);
  const icInner = Math.round(IC_OUTER_R * 0.72);
  return (
    <g className="ma-pipe-orch-engine" transform={`translate(${ENGINE.cx}, ${ENGINE.cy})`}>
      <g className="ma-pipe-orch-engine-rear">
        <ellipse rx={IC_OUTER_R} ry={Math.round(IC_OUTER_R * 0.78)} fill="url(#ma-pipe-orch-engine-glow-rear)" />
        <circle r={IC_OUTER_R} fill="none" stroke="rgba(45,212,191,0.16)" strokeWidth="1.05" />
        <circle r={icMid} fill="none" stroke="rgba(45,212,191,0.18)" strokeWidth="0.9" />
      </g>
      <g className="ma-pipe-orch-engine-mid">
        <ellipse className="ma-pipe-orch-engine-glow-bed" rx={icMid} ry={Math.round(icMid * 0.78)} fill="url(#ma-pipe-orch-engine-glow)" />
        <circle className="ma-pipe-orch-engine-ring ma-pipe-orch-engine-r6" r={IC_OUTER_R} fill="none" stroke="rgba(45,212,191,0.2)" strokeWidth="1.05" />
        <circle className="ma-pipe-orch-engine-ring ma-pipe-orch-engine-r5" r={Math.round(IC_OUTER_R * 0.84)} fill="none" stroke="rgba(45,212,191,0.26)" strokeWidth="1.1" />
        <circle className="ma-pipe-orch-engine-ring ma-pipe-orch-engine-r4" r={Math.round(IC_OUTER_R * 0.68)} fill="none" stroke="rgba(45,212,191,0.34)" strokeWidth="1.15" />
        <circle className="ma-pipe-orch-engine-ring ma-pipe-orch-engine-r3" r={Math.round(IC_OUTER_R * 0.54)} fill="none" stroke="rgba(45,212,191,0.42)" strokeWidth="1.22" />
        <circle className="ma-pipe-orch-engine-ring ma-pipe-orch-engine-r2" r={Math.round(IC_OUTER_R * 0.4)} fill="none" stroke="rgba(94,234,212,0.55)" strokeWidth="1.28" />
        <circle className="ma-pipe-orch-engine-ring ma-pipe-orch-engine-r1" r={Math.round(IC_OUTER_R * 0.28)} fill="rgba(4,10,14,0.94)" stroke="rgba(94,234,212,0.72)" strokeWidth="1.35" />
        {ENGINE_ARCS.map((arc, i) => (
          <path
            key={`arc${i}`}
            className={`ma-pipe-orch-engine-arc ma-pipe-orch-engine-arc-${i}`}
            d={arcPath(arc.r, arc.start, arc.end)}
            stroke="rgba(94,234,212,0.48)"
            strokeWidth="1.15"
            fill="none"
            strokeLinecap="round"
          />
        ))}
      </g>
      <circle className="ma-pipe-orch-engine-core" r={Math.round(IC_OUTER_R * 0.26)} fill="rgba(2,8,12,0.96)" stroke="rgba(94,234,212,0.82)" strokeWidth="1.4" />
      {!reduced ? (
        <g className="ma-pipe-orch-engine-front">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <line
                key={deg}
                className="ma-pipe-orch-engine-tick"
                x1={Math.cos(rad) * (IC_OUTER_R * 0.34)}
                y1={Math.sin(rad) * (IC_OUTER_R * 0.34)}
                x2={Math.cos(rad) * (IC_OUTER_R * 0.5)}
                y2={Math.sin(rad) * (IC_OUTER_R * 0.5)}
                stroke="rgba(94,234,212,0.48)"
                strokeWidth="0.8"
              />
            );
          })}
          <circle className="ma-pipe-orch-engine-trace" r={icInner} fill="none" stroke="rgba(94,234,212,0.4)" strokeWidth="1.1" strokeDasharray="18 480" />
          <circle className="ma-pipe-orch-engine-pulse" r={Math.round(IC_OUTER_R * 0.52)} fill="none" stroke="#5eead4" strokeWidth="1.15" />
          <circle className="ma-pipe-orch-engine-breathe" r={Math.round(IC_OUTER_R * 0.78)} fill="none" stroke="rgba(94,234,212,0.28)" strokeWidth="1.05" />
          <circle className="ma-pipe-orch-engine-sweep" r={icMid} fill="none" stroke="rgba(94,234,212,0.3)" strokeWidth="1.25" strokeDasharray="60 480" />
          <circle className="ma-pipe-orch-engine-orch-pulse" r={Math.round(IC_OUTER_R * 0.58)} fill="none" stroke="rgba(94,234,212,0.38)" strokeWidth="1.1" />
          {ENGINE_ROUTE_NODES.map((node, i) => (
            <circle
              key={`ern${i}`}
              className="ma-pipe-orch-engine-node"
              cx={node.x}
              cy={node.y}
              r={5.5}
              fill="rgba(94,234,212,0.52)"
              stroke="rgba(45,212,191,0.68)"
              strokeWidth="0.7"
            />
          ))}
        </g>
      ) : null}
      <g className="ma-pipe-orch-stage-icon" transform="scale(1.8)"><StageIcon type="ic" /></g>
      <text y={IC_OUTER_R + 16} textAnchor="middle" fill="rgba(94,234,212,0.48)" fontSize="8" fontWeight="600" letterSpacing="0.04em">
        ORCHESTRATION
      </text>
    </g>
  );
}

function DealPacket({ path, begin, dur, tier, primary, reduced }) {
  if (reduced) return null;
  const w = primary ? 22 : tier === 'mid' ? 16 : 13;
  const h = primary ? 15 : tier === 'mid' ? 11 : 9;
  return (
    <g className={`ma-pipe-orch-packet ma-pipe-orch-packet-${tier}${primary ? ' ma-pipe-orch-packet-primary' : ''}`}>
      <rect className="ma-pipe-orch-packet-body" x={-w / 2} y={-h / 2} width={w} height={h} rx={0.7} fill="rgba(2,8,12,0.94)" stroke="rgba(94,234,212,0.68)" strokeWidth={primary ? 0.85 : 0.68} />
      <rect className="ma-pipe-orch-packet-mark" x={-w / 2 + 2} y={-h / 2 + 1.8} width={w - 4} height={h - 3.6} rx={0.35} fill="rgba(45,212,191,0.32)" />
      <animateMotion path={path} dur={dur} begin={begin} repeatCount="indefinite" rotate="auto" calcMode="spline" keyTimes="0;1" keySplines="0.37 0 0.25 1" />
    </g>
  );
}

function PriorityTracer({ reduced }) {
  if (reduced) return null;
  return (
    <g className="ma-pipe-orch-priority-tracer">
      <path className="ma-pipe-orch-priority-prelight" d={PRIORITY_ROUTE} stroke="rgba(94,234,212,0.42)" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path className="ma-pipe-orch-priority-wake" d={PRIORITY_ROUTE} stroke="#5eead4" strokeWidth="5.4" strokeLinecap="round" fill="none" />
      <path className="ma-pipe-orch-priority-tail" d={PRIORITY_ROUTE} stroke="rgba(94,234,212,0.62)" strokeWidth="2.2" strokeDasharray="16 560" fill="none" />
      <g className="ma-pipe-orch-priority-head-wrap">
        <rect x={-6.5} y={-6.5} width={13} height={13} rx={0.8} transform="rotate(45)" fill="#5eead4" />
        <animateMotion path={PRIORITY_ROUTE} dur={LOOP} begin="9s" repeatCount="indefinite" rotate="auto" />
      </g>
    </g>
  );
}

export function PipelineOrchestrationNetworkVisual() {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="ma-pipe-orch-flow" aria-hidden="true">
      <svg
        className="ma-pipe-orch-flow-svg"
        viewBox={`${VIEW_X} ${VIEW_Y} ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="ma-pipe-orch-node-halo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(45,212,191,0.42)" />
            <stop offset="100%" stopColor="rgba(45,212,191,0)" />
          </radialGradient>
          <radialGradient id="ma-pipe-orch-engine-glow" cx="0.5" cy="0.5" r="0.55">
            <stop offset="0%" stopColor="rgba(94,234,212,0.42)" />
            <stop offset="55%" stopColor="rgba(45,212,191,0.16)" />
            <stop offset="100%" stopColor="rgba(45,212,191,0)" />
          </radialGradient>
          <radialGradient id="ma-pipe-orch-engine-glow-rear" cx="0.5" cy="0.5" r="0.55">
            <stop offset="0%" stopColor="rgba(45,212,191,0.22)" />
            <stop offset="100%" stopColor="rgba(45,212,191,0)" />
          </radialGradient>
          <radialGradient id="ma-pipe-orch-ic-focus-grad" cx="0.5" cy="0.48" r="0.62">
            <stop offset="0%" stopColor="rgba(45,212,191,0.2)" />
            <stop offset="45%" stopColor="rgba(45,212,191,0.07)" />
            <stop offset="100%" stopColor="rgba(45,212,191,0)" />
          </radialGradient>
        </defs>

        <g className={reduced ? 'ma-pipe-orch-static' : 'ma-pipe-orch-choreo'}>
          <g className="ma-pipe-orch-layer-bg">
            <ellipse
              className="ma-pipe-orch-ic-focus"
              cx={ENGINE.cx}
              cy={ENGINE.cy}
              rx={188}
              ry={136}
              fill="url(#ma-pipe-orch-ic-focus-grad)"
            />
            {BACKGROUND_ARCS.map((d, i) => (
              <path key={`bg${i}`} d={d} stroke="rgba(45,212,191,0.14)" strokeWidth="0.9" fill="none" />
            ))}
          </g>

          <g className="ma-pipe-orch-layer-mid">
            {INPUT_SECONDARY.map((d, i) => (
              <path key={`sec${i}`} className={`ma-pipe-orch-secondary ma-pipe-orch-secondary-${i}`} d={d} stroke="rgba(45,212,191,0.32)" strokeWidth="1.1" strokeLinecap="round" fill="none" />
            ))}

            {INPUT_PRIMARY.map((lane) => (
              <g key={lane.id} className={`ma-pipe-orch-input ma-pipe-orch-input-${lane.id}`}>
                <path className="ma-pipe-orch-input-path" d={lane.d} stroke="rgba(45,212,191,0.62)" strokeWidth="3.85" strokeLinecap="round" fill="none" />
                <path className="ma-pipe-orch-input-companion" d={lane.companion} stroke="rgba(45,212,191,0.34)" strokeWidth="1.85" strokeLinecap="round" fill="none" strokeDasharray="6 16" />
                {!reduced ? (
                  <path className="ma-pipe-orch-input-pulse" d={lane.d} stroke="rgba(94,234,212,0.66)" strokeWidth="2.35" strokeDasharray="14 820" fill="none" />
                ) : null}
                <circle className="ma-pipe-orch-source-node" cx={lane.sx} cy={lane.sy} r="9.5" fill="rgba(94,234,212,0.58)" stroke="rgba(45,212,191,0.74)" strokeWidth="1.05" />
                <text x={lane.lx} y={lane.ly} fill="rgba(94,234,212,0.74)" fontSize="12.5" fontWeight="700" letterSpacing="0.11em">
                  {lane.label}
                </text>
              </g>
            ))}

            {MICRO_FILAMENTS.map((d, i) => (
              <path key={`micro${i}`} className={`ma-pipe-orch-micro ma-pipe-orch-micro-${i}`} d={d} stroke="rgba(45,212,191,0.18)" strokeWidth="0.65" strokeLinecap="round" fill="none" strokeDasharray="4 720" />
            ))}

            {INTER_STAGE_UPPER.map((d, i) => (
              <path key={`isu${i}`} className={`ma-pipe-orch-inter-upper ma-pipe-orch-inter-upper-${i}`} d={d} stroke="rgba(45,212,191,0.22)" strokeWidth="0.95" strokeLinecap="round" fill="none" />
            ))}
            {INTER_STAGE_LOWER.map((d, i) => (
              <path key={`isl${i}`} className={`ma-pipe-orch-inter-lower ma-pipe-orch-inter-lower-${i}`} d={d} stroke="rgba(45,212,191,0.2)" strokeWidth="0.88" strokeLinecap="round" fill="none" />
            ))}
            {INTER_STAGE_MID.map((d, i) => (
              <path key={`ism${i}`} className={`ma-pipe-orch-inter-mid ma-pipe-orch-inter-mid-${i}`} d={d} stroke="rgba(45,212,191,0.18)" strokeWidth="0.78" strokeLinecap="round" fill="none" />
            ))}

            {UPPER_FLOW_ROUTES.map((d, i) => (
              <path key={`up${i}`} className={`ma-pipe-orch-upper-flow ma-pipe-orch-upper-flow-${i}`} d={d} stroke="rgba(45,212,191,0.14)" strokeWidth="0.72" strokeLinecap="round" fill="none" />
            ))}
            {LOWER_FLOW_ROUTES.map((d, i) => (
              <path key={`lo${i}`} className={`ma-pipe-orch-lower-flow ma-pipe-orch-lower-flow-${i}`} d={d} stroke="rgba(45,212,191,0.14)" strokeWidth="0.72" strokeLinecap="round" fill="none" />
            ))}

            {SUPPORT_STREAMS.map((d, i) => (
              <path key={`sup${i}`} className={`ma-pipe-orch-support ma-pipe-orch-support-${i}`} d={d} stroke="rgba(45,212,191,0.24)" strokeWidth="0.82" strokeLinecap="round" fill="none" />
            ))}

            <path className="ma-pipe-orch-rail-lumen" d={STAGE_RAIL} stroke="rgba(94,234,212,0.22)" strokeWidth="13" strokeLinecap="round" fill="none" />
            <path className="ma-pipe-orch-rail-base" d={STAGE_RAIL} stroke="rgba(20,40,48,0.9)" strokeWidth="9.2" strokeLinecap="round" fill="none" />
            <path className="ma-pipe-orch-rail" d={STAGE_RAIL} stroke="rgba(45,212,191,0.74)" strokeWidth="5.85" strokeLinecap="round" fill="none" />
            <path className="ma-pipe-orch-rail-upper" d={STAGE_RAIL_UPPER} stroke="rgba(94,234,212,0.34)" strokeWidth="2.25" strokeLinecap="round" fill="none" />
            <path className="ma-pipe-orch-rail-lower" d={STAGE_RAIL_LOWER} stroke="rgba(45,212,191,0.18)" strokeWidth="1.7" strokeLinecap="round" fill="none" />
            {RAIL_NODES.map((x, i) => (
              <circle key={`rn${i}`} className={`ma-pipe-orch-rail-node ma-pipe-orch-rail-node-${i}`} cx={x} cy={RAIL_Y} r="6.2" fill="rgba(94,234,212,0.42)" stroke="rgba(45,212,191,0.52)" strokeWidth="0.9" />
            ))}
            {!reduced ? RAIL_SEGMENT_WAKES.map((d, i) => (
              <g key={`rsw${i}`}>
                <path className={`ma-pipe-orch-rail-segment-wake ma-pipe-orch-rail-segment-wake-${i}`} d={d} stroke="rgba(94,234,212,0.48)" strokeWidth="1.9" strokeDasharray="22 820" fill="none" />
                <path className={`ma-pipe-orch-rail-segment-tail ma-pipe-orch-rail-segment-tail-${i}`} d={d} stroke="rgba(94,234,212,0.26)" strokeWidth="0.95" strokeDasharray="8 820" fill="none" />
              </g>
            )) : null}
            {JUNCTION_NODES.map((n) => (
              <circle key={n.cls} className={`ma-pipe-orch-junction-node ma-pipe-orch-junction-${n.cls}`} cx={n.x} cy={n.y} r="2.8" fill="rgba(94,234,212,0.36)" stroke="rgba(45,212,191,0.44)" strokeWidth="0.5" />
            ))}
            {!reduced ? (
              <>
                <path className="ma-pipe-orch-rail-pulse" d={STAGE_RAIL} stroke="rgba(94,234,212,0.62)" strokeWidth="1.85" strokeDasharray="16 860" fill="none" />
                <path className="ma-pipe-orch-rail-segment" d={STAGE_RAIL} stroke="#5eead4" strokeWidth="5.2" strokeDasharray="28 860" fill="none" />
              </>
            ) : null}

            {OUTPUT_FAN.map((d, i) => (
              <path key={`fan${i}`} className={`ma-pipe-orch-output-fan ma-pipe-orch-output-fan-${i}`} d={d} stroke="rgba(45,212,191,0.24)" strokeWidth="1.25" fill="none" />
            ))}

            <path className="ma-pipe-orch-priority-route" d={PRIORITY_ROUTE} stroke="rgba(94,234,212,0.78)" strokeWidth="5.6" strokeLinecap="round" fill="none" />
            <text x={STAGE_X.closing + 58} y={RAIL_Y - FAN_V - 22} fill="rgba(94,234,212,0.72)" fontSize="12" fontWeight="700" letterSpacing="0.13em">
              PRIORITY EXECUTION
            </text>
            <g className="ma-pipe-orch-signal-connector-end" transform={`translate(${OUTPUT_END}, ${RAIL_Y - FAN_V - 18})`}>
              <rect x={-7.5} y={-7.5} width={15} height={15} rx={1.2} transform="rotate(45)" fill="rgba(94,234,212,0.42)" stroke="rgba(45,212,191,0.72)" strokeWidth="1.1" />
              <rect x={-3.2} y={-3.2} width={6.4} height={6.4} rx={0.6} transform="rotate(45)" fill="rgba(94,234,212,0.7)" />
            </g>
          </g>

          <OrchestrationEngine reduced={reduced} />

          {!reduced ? (
            <>
              <path className="ma-pipe-orch-ic-entry" d={IC_ENTRY_PATH} stroke="rgba(94,234,212,0.48)" strokeWidth="1.45" strokeLinecap="round" fill="none" />
              <g className="ma-pipe-orch-branches">
                {EXEC_BRANCHES.map((d, i) => (
                  <path key={`br${i}`} className={`ma-pipe-orch-branch ma-pipe-orch-branch-${i}${i === 0 ? ' ma-pipe-orch-branch-selected' : ''}`} d={d} stroke="rgba(94,234,212,0.32)" strokeWidth="1.15" strokeLinecap="round" fill="none" />
                ))}
              </g>
              <g className="ma-pipe-orch-dd-branches">
                {DD_BRANCHES.map((d, i) => (
                  <path key={`ddb${i}`} className={`ma-pipe-orch-dd-branch ma-pipe-orch-dd-branch-${i}`} d={d} stroke="rgba(94,234,212,0.34)" strokeWidth="0.95" strokeLinecap="round" fill="none" />
                ))}
                {DD_NODES.map((n, i) => (
                  <circle key={`ddn${i}`} cx={n.x} cy={n.y} r="3.2" fill="rgba(94,234,212,0.38)" stroke="rgba(45,212,191,0.48)" strokeWidth="0.55" />
                ))}
              </g>
              <g className="ma-pipe-orch-negotiation-dual">
                {NEGOTIATION_DUAL.map((d, i) => (
                  <path key={`neg${i}`} className={`ma-pipe-orch-neg-path ma-pipe-orch-neg-path-${i}`} d={d} stroke="rgba(94,234,212,0.3)" strokeWidth="1.02" strokeLinecap="round" fill="none" />
                ))}
                {NEGOTIATION_NODES.map((n, i) => (
                  <circle key={`negn${i}`} cx={n.x} cy={n.y} r="3.4" fill="rgba(94,234,212,0.35)" stroke="rgba(45,212,191,0.45)" strokeWidth="0.55" />
                ))}
              </g>
              <circle className="ma-pipe-orch-closing-pulse" cx={STAGE_X.closing} cy={RAIL_Y} r={48} fill="none" stroke="rgba(94,234,212,0.22)" strokeWidth="1.15" />
              <g className="ma-pipe-orch-closing-check" transform={`translate(${STAGE_X.closing}, ${RAIL_Y})`}>
                <circle r={20} fill="none" stroke="rgba(94,234,212,0.35)" strokeWidth="0.95" />
                <path d="M -6.5 0 L -0.8 4.8 L 6.8 -4.8" fill="none" stroke="rgba(94,234,212,0.65)" strokeWidth="1.05" strokeLinecap="round" />
              </g>
            </>
          ) : (
            <>
              <g className="ma-pipe-orch-branches">
                {EXEC_BRANCHES.map((d, i) => (
                  <path key={`brs${i}`} className={`ma-pipe-orch-branch ma-pipe-orch-branch-${i}${i === 0 ? ' ma-pipe-orch-branch-selected' : ''}`} d={d} stroke="rgba(94,234,212,0.32)" strokeWidth="1.15" strokeLinecap="round" fill="none" />
                ))}
              </g>
              <g className="ma-pipe-orch-dd-branches">
                {DD_BRANCHES.map((d, i) => (
                  <path key={`ddbs${i}`} className={`ma-pipe-orch-dd-branch ma-pipe-orch-dd-branch-${i}`} d={d} stroke="rgba(94,234,212,0.34)" strokeWidth="0.95" strokeLinecap="round" fill="none" />
                ))}
                {DD_NODES.map((n, i) => (
                  <circle key={`ddns${i}`} cx={n.x} cy={n.y} r="3.2" fill="rgba(94,234,212,0.38)" stroke="rgba(45,212,191,0.48)" strokeWidth="0.55" />
                ))}
              </g>
              <g className="ma-pipe-orch-negotiation-dual">
                {NEGOTIATION_DUAL.map((d, i) => (
                  <path key={`negs${i}`} className={`ma-pipe-orch-neg-path ma-pipe-orch-neg-path-${i}`} d={d} stroke="rgba(94,234,212,0.3)" strokeWidth="1.02" strokeLinecap="round" fill="none" />
                ))}
                {NEGOTIATION_NODES.map((n, i) => (
                  <circle key={`negns${i}`} cx={n.x} cy={n.y} r="3.4" fill="rgba(94,234,212,0.35)" stroke="rgba(45,212,191,0.45)" strokeWidth="0.55" />
                ))}
              </g>
              <g className="ma-pipe-orch-closing-check" transform={`translate(${STAGE_X.closing}, ${RAIL_Y})`}>
                <circle r={20} fill="none" stroke="rgba(94,234,212,0.35)" strokeWidth="0.95" />
                <path d="M -6.5 0 L -0.8 4.8 L 6.8 -4.8" fill="none" stroke="rgba(94,234,212,0.65)" strokeWidth="1.05" strokeLinecap="round" />
              </g>
            </>
          )}

          {STAGES.map((s) => (
            <StageNode key={s.id} stage={s} reduced={reduced} />
          ))}
          <StageGate stageId="nda" cx={STAGE_X.nda} cy={RAIL_Y} />
          <StageGate stageId="dd" cx={STAGE_X.dd} cy={RAIL_Y} />
          <StageGate stageId="negotiation" cx={STAGE_X.negotiation} cy={RAIL_Y} />

          <g className="ma-pipe-orch-layer-fg">
            {FOREGROUND_ROUTES.map((d, i) => (
              <path key={`fg${i}`} className={`ma-pipe-orch-foreground-route ma-pipe-orch-foreground-route-${i}`} d={d} stroke="rgba(94,234,212,0.42)" strokeWidth={i === 0 ? 2.05 : 1.45} strokeLinecap="round" fill="none" />
            ))}
            {PARKED_DEALS.map((m, i) => (
              <StaticPacket key={`pk${i}`} x={m.x} y={m.y} w={m.w} h={m.h} opacity={m.opacity} />
            ))}
            {SOURCE_PACKETS.map((deal, i) => (
              <DealPacket key={`sp${i}`} path={deal.path} begin={deal.begin} dur={deal.dur} tier={deal.tier} reduced={reduced} />
            ))}
            {SECONDARY_DEALS.map((deal, i) => (
              <DealPacket key={`sd${i}`} path={deal.path} begin={deal.begin} dur={deal.dur} tier={deal.tier} reduced={reduced} />
            ))}
            {!reduced ? (
              <>
                <DealPacket path={PRIMARY_JOURNEY} begin="0s" dur={LOOP} tier="active" primary reduced={reduced} />
                {NEGOTIATION_PACKETS.map((deal, i) => (
                  <DealPacket key={`np${i}`} path={deal.path} begin={deal.begin} dur={deal.dur} tier={deal.tier} reduced={reduced} />
                ))}
              </>
            ) : (
              <>
                {STATIC_SOURCE_MARKERS.map((m, i) => (
                  <StaticPacket key={`ssm${i}`} x={m.x} y={m.y} w={14} h={10} opacity={0.65 + (i % 3) * 0.1} />
                ))}
                {STATIC_DEAL_MARKERS.map((m, i) => (
                  <StaticPacket key={`sdm${i}`} x={m.x} y={m.y} w={i === 4 ? 20 : 16} h={i === 4 ? 14 : 11} opacity={i === 4 ? 1 : 0.55 + (i % 4) * 0.1} />
                ))}
              </>
            )}
          </g>

          <PriorityTracer reduced={reduced} />

          {!reduced ? (
            <g className="ma-pipe-orch-panel-echo">
              <g transform={`translate(${OUTPUT_END}, ${RAIL_Y - FAN_V - 18})`}>
                <rect className="ma-pipe-orch-endpoint" x={-5.5} y={-5.5} width={11} height={11} rx={0.8} transform="rotate(45)" fill="#5eead4" />
              </g>
            </g>
          ) : null}
        </g>
      </svg>
      <span className="ma-pipe-orch-signal-bridge" aria-hidden="true" />
    </div>
  );
}
