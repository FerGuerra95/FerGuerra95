import React from 'react';
import {
  Activity,
  ArrowDownUp,
  Calculator,
  CheckCircle2,
  PieChart,
  ShieldCheck,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import {
  PERMISSIONS,
  useAuth
} from '../../../app/providers/AuthProvider.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import { useMAStore } from '../store/maStore.jsx';
import { useValuationEngine } from '../engine/useValuationEngine.js';
import { WaterfallPanel } from '../components/WaterfallPanel.jsx';
import { SensitivityMatrix } from '../components/SensitivityMatrix.jsx';

const waterfallCss = `
  .waterfall-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 38px;
  }

  .waterfall-hero {
    position: relative;
    overflow: hidden;
    border-radius: 38px;
    padding: 38px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      radial-gradient(circle at 8% 2%, rgba(37, 99, 235, 0.38), transparent 30%),
      radial-gradient(circle at 88% 8%, rgba(16, 185, 129, 0.18), transparent 27%),
      radial-gradient(circle at 60% 110%, rgba(234, 179, 8, 0.08), transparent 30%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.99), rgba(15, 23, 42, 0.97));
    box-shadow:
      0 38px 120px rgba(0, 0, 0, 0.42),
      inset 0 1px 0 rgba(255, 255, 255, 0.055);
  }

  .waterfall-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
    background-size: 50px 50px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 82%);
    pointer-events: none;
  }

  .waterfall-hero::after {
    content: "";
    position: absolute;
    inset: auto -190px -210px auto;
    width: 520px;
    height: 520px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.13), transparent 70%);
    pointer-events: none;
  }

  .waterfall-hero-layout {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.42fr) minmax(380px, 0.58fr);
    gap: 36px;
    align-items: stretch;
  }

  .waterfall-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 26px;
  }

  .waterfall-title {
    margin: 0;
    max-width: 950px;
    font-size: clamp(42px, 5vw, 72px);
    line-height: 0.92;
    letter-spacing: -0.075em;
  }

  .waterfall-title span {
    display: block;
    margin-top: 8px;
    color: rgba(226, 232, 240, 0.7);
  }

  .waterfall-copy {
    max-width: 860px;
    margin: 26px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .waterfall-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .waterfall-command-item {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.078);
  }

  .waterfall-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
  }

  .waterfall-signal-card {
    position: relative;
    min-height: 100%;
    border-radius: 32px;
    padding: 28px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.086), rgba(255,255,255,0.026)),
      rgba(15, 23, 42, 0.76);
    border: 1px solid rgba(148, 163, 184, 0.2);
    backdrop-filter: blur(22px);
    display: flex;
    flex-direction: column;
    gap: 24px;
    box-shadow:
      0 26px 70px rgba(0, 0, 0, 0.24),
      inset 0 1px 0 rgba(255,255,255,0.05);
  }

  .waterfall-signal-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: radial-gradient(circle at 18% 0%, rgba(96, 165, 250, 0.13), transparent 35%);
    pointer-events: none;
  }

  .waterfall-signal-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .waterfall-signal-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .waterfall-icon-box,
  .waterfall-card-icon,
  .waterfall-panel-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .waterfall-icon-box {
    width: 50px;
    height: 50px;
  }

  .waterfall-card-icon,
  .waterfall-panel-icon {
    width: 46px;
    height: 46px;
  }

  .waterfall-signal-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.16;
    letter-spacing: -0.04em;
  }

  .waterfall-score-module {
    display: grid;
    grid-template-columns: 122px minmax(0, 1fr);
    gap: 22px;
    align-items: center;
    padding: 20px;
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.047);
    border: 1px solid rgba(255, 255, 255, 0.085);
  }

  .waterfall-score-ring {
    width: 112px;
    height: 112px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background:
      conic-gradient(rgba(16, 185, 129, 0.96) var(--score-angle), rgba(255,255,255,0.09) 0deg);
    box-shadow:
      0 18px 40px rgba(0, 0, 0, 0.28),
      0 0 34px rgba(16, 185, 129, 0.16);
  }

  .waterfall-score-core {
    width: 84px;
    height: 84px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.97);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .waterfall-score-core strong {
    font-size: 25px;
    letter-spacing: -0.055em;
  }

  .waterfall-score-core strong.is-empty-score {
    font-size: 30px;
    color: rgba(226, 232, 240, 0.72);
  }

  .waterfall-score-copy strong {
    display: block;
    margin-bottom: 8px;
  }

  .waterfall-score-copy p {
    margin: 0;
    line-height: 1.62;
  }

  .waterfall-signal-table {
    display: grid;
    gap: 0;
  }

  .waterfall-signal-row {
    display: grid;
    grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
    gap: 14px;
    align-items: center;
    padding: 15px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }

  .waterfall-signal-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .waterfall-section {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .waterfall-section-header {
    display: flex;
    justify-content: space-between;
    gap: 28px;
    align-items: flex-end;
  }

  .waterfall-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 11px;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.17em;
    color: rgba(148, 163, 184, 0.96);
  }

  .waterfall-section-header h2,
  .waterfall-section-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .waterfall-section-header p {
    max-width: 820px;
    margin: 11px 0 0;
    line-height: 1.68;
  }

  .waterfall-grid {
    display: grid;
    gap: 26px;
    align-items: stretch;
  }

  .waterfall-grid-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .waterfall-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .waterfall-kpi-card,
  .waterfall-panel,
  .waterfall-workflow-card {
    width: 100%;
    height: 100%;
    border-radius: 31px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.064), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.64);
    box-shadow:
      0 24px 70px rgba(0, 0, 0, 0.21),
      inset 0 1px 0 rgba(255,255,255,0.035);
  }

  .waterfall-kpi-card {
    min-height: 188px;
    padding: 27px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 22px;
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .waterfall-kpi-card:hover {
    transform: translateY(-3px);
    border-color: rgba(96, 165, 250, 0.25);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .waterfall-kpi-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .waterfall-kpi-value {
    margin-top: 12px;
    font-size: 25px;
    font-weight: 790;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .waterfall-kpi-card p {
    margin: 0;
    line-height: 1.56;
  }

  .waterfall-panel {
    padding: 31px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .waterfall-panel-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .waterfall-panel-title {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .waterfall-panel-description {
    margin: 11px 0 0;
    line-height: 1.66;
  }

  .waterfall-glass-block {
    border-radius: 25px;
    padding: 25px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.066), rgba(255,255,255,0.026));
    border: 1px solid rgba(255,255,255,0.092);
  }

  .waterfall-distribution-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .waterfall-distribution-card {
    padding: 22px;
    border-radius: 24px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.078);
  }

  .waterfall-distribution-card strong {
    display: block;
    margin-top: 12px;
    font-size: 27px;
    line-height: 1.1;
    letter-spacing: -0.045em;
  }

  .waterfall-adjustment-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .waterfall-adjustment-item {
    display: grid;
    grid-template-columns: 34px minmax(0, 1fr);
    gap: 15px;
    align-items: flex-start;
    padding: 19px;
    border-radius: 22px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.078);
  }

  .waterfall-adjustment-icon {
    width: 34px;
    height: 34px;
    border-radius: 15px;
    display: grid;
    place-items: center;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.22);
    color: #86efac;
  }

  .waterfall-adjustment-item strong {
    display: block;
    margin-bottom: 7px;
  }

  .waterfall-adjustment-item p {
    margin: 0;
    line-height: 1.6;
  }

  .waterfall-bridge-panel {
    position: relative;
    overflow: hidden;
    border-radius: 32px;
    padding: 28px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.16), transparent 32%),
      linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02)),
      rgba(15, 23, 42, 0.64);
  }

  .waterfall-bridge-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-top: 22px;
  }

  .waterfall-bridge-step {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.075);
  }

  .waterfall-bridge-step strong {
    display: block;
    margin-top: 8px;
  }

  .waterfall-external-section {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .waterfall-external-section > .card {
    height: 100%;
  }

  .waterfall-sensitivity-panel {
    border-radius: 31px;
    padding: 31px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.064), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.64);
    box-shadow:
      0 24px 70px rgba(0, 0, 0, 0.21),
      inset 0 1px 0 rgba(255,255,255,0.035);
  }

  .waterfall-muted-tight {
    margin-bottom: 0;
  }


  /* M&A WATERFALL · PREMIUM DEAL GLASS SYSTEM */
  .waterfall-page {
    --ma-branch-a: 16, 185, 129;
    --ma-branch-b: 37, 99, 235;
    --ma-branch-c: 167, 243, 208;
    --ma-branch-glow: 16, 185, 129;
  }

  .waterfall-hero,
  .waterfall-signal-card,
  .waterfall-command-item,
  .waterfall-score-module,
  .waterfall-kpi-card,
  .waterfall-panel,
  .waterfall-glass-block,
  .waterfall-distribution-card,
  .waterfall-adjustment-item,
  .waterfall-bridge-panel,
  .waterfall-bridge-step,
  .waterfall-sensitivity-panel,
  .waterfall-external-section :is(
    .card,
    .panel,
    [class*="card"],
    [class*="panel"],
    [class*="waterfall"],
    [class*="matrix"],
    table
  ),
  .waterfall-sensitivity-panel :is(
    .card,
    .panel,
    [class*="card"],
    [class*="panel"],
    [class*="matrix"],
    table
  ) {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    border-color: rgba(255,255,255,0.026) !important;
    background:
      radial-gradient(circle at 0% 0%, rgba(var(--ma-branch-a), 0.148), transparent 36%),
      radial-gradient(circle at 100% 8%, rgba(var(--ma-branch-b), 0.104), transparent 42%),
      linear-gradient(
        115deg,
        rgba(var(--ma-branch-a), 0.088) 0%,
        rgba(255,255,255,0.016) 44%,
        rgba(var(--ma-branch-b), 0.064) 100%
      ),
      rgba(15, 23, 42, 0.58) !important;
    box-shadow:
      0 28px 82px rgba(0, 0, 0, 0.30),
      0 0 42px rgba(var(--ma-branch-glow), 0.120),
      inset 0 1px 0 rgba(255,255,255,0.065),
      inset 1px 0 0 rgba(var(--ma-branch-a), 0.085),
      inset -1px 0 0 rgba(var(--ma-branch-b), 0.070) !important;
    backdrop-filter: blur(22px) saturate(138%);
    -webkit-backdrop-filter: blur(22px) saturate(138%);
  }

  .waterfall-hero::before,
  .waterfall-signal-card::before,
  .waterfall-command-item::before,
  .waterfall-score-module::before,
  .waterfall-kpi-card::before,
  .waterfall-panel::before,
  .waterfall-glass-block::before,
  .waterfall-distribution-card::before,
  .waterfall-adjustment-item::before,
  .waterfall-bridge-panel::before,
  .waterfall-bridge-step::before,
  .waterfall-sensitivity-panel::before {
    content: "";
    position: absolute;
    inset: -30%;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(circle at 0% 10%, rgba(var(--ma-branch-a), 0.145), transparent 34%),
      radial-gradient(circle at 100% 8%, rgba(var(--ma-branch-b), 0.120), transparent 38%),
      radial-gradient(circle at 54% 120%, rgba(255,255,255,0.040), transparent 42%);
    filter: blur(28px);
    opacity: 0.68;
    mix-blend-mode: screen;
  }

  .waterfall-hero::after,
  .waterfall-signal-card::after,
  .waterfall-command-item::after,
  .waterfall-score-module::after,
  .waterfall-kpi-card::after,
  .waterfall-panel::after,
  .waterfall-glass-block::after,
  .waterfall-distribution-card::after,
  .waterfall-adjustment-item::after,
  .waterfall-bridge-panel::after,
  .waterfall-bridge-step::after,
  .waterfall-sensitivity-panel::after {
    content: "";
    position: absolute;
    inset: 1px;
    z-index: 0;
    pointer-events: none;
    border-radius: inherit;
    background:
      linear-gradient(
        135deg,
        rgba(255,255,255,0.080),
        rgba(255,255,255,0.014) 32%,
        transparent 58%,
        rgba(255,255,255,0.024) 100%
      );
    opacity: 0.36;
  }

  .waterfall-hero > *,
  .waterfall-signal-card > *,
  .waterfall-command-item > *,
  .waterfall-score-module > *,
  .waterfall-kpi-card > *,
  .waterfall-panel > *,
  .waterfall-glass-block > *,
  .waterfall-distribution-card > *,
  .waterfall-adjustment-item > *,
  .waterfall-bridge-panel > *,
  .waterfall-bridge-step > *,
  .waterfall-sensitivity-panel > * {
    position: relative;
    z-index: 1;
  }

  .waterfall-command-item:hover,
  .waterfall-kpi-card:hover,
  .waterfall-panel:hover,
  .waterfall-glass-block:hover,
  .waterfall-distribution-card:hover,
  .waterfall-adjustment-item:hover,
  .waterfall-bridge-step:hover,
  .waterfall-sensitivity-panel:hover {
    transform: translateY(-3px);
    border-color: rgba(var(--ma-branch-c), 0.18) !important;
    box-shadow:
      0 34px 96px rgba(0, 0, 0, 0.36),
      0 0 54px rgba(var(--ma-branch-glow), 0.165),
      inset 0 1px 0 rgba(255,255,255,0.080),
      inset 1px 0 0 rgba(var(--ma-branch-a), 0.105),
      inset -1px 0 0 rgba(var(--ma-branch-b), 0.085) !important;
  }

  .waterfall-grid {
    gap: clamp(28px, 2vw, 36px);
  }

  .waterfall-section {
    gap: 30px;
  }

  .waterfall-bridge-grid,
  .waterfall-distribution-grid,
  .waterfall-adjustment-list {
    gap: 18px;
  }

  .waterfall-icon-box,
  .waterfall-card-icon,
  .waterfall-panel-icon,
  .waterfall-adjustment-icon,
  .waterfall-score-core,
  .waterfall-score-ring,
  .waterfall-count,
  .waterfall-bridge-step .kpi-label {
    background:
      linear-gradient(
        135deg,
        rgba(var(--ma-branch-a), 0.16),
        rgba(var(--ma-branch-b), 0.09)
      ) !important;
    border-color: rgba(var(--ma-branch-a), 0.22) !important;
    box-shadow:
      0 0 18px rgba(var(--ma-branch-glow), 0.14),
      inset 0 1px 0 rgba(255,255,255,0.070) !important;
  }

  .waterfall-score-ring {
    background:
      conic-gradient(
        rgba(var(--ma-branch-a), 0.98) var(--score-angle),
        rgba(255,255,255,0.09) 0deg
      ) !important;
    box-shadow:
      0 18px 40px rgba(0, 0, 0, 0.28),
      0 0 34px rgba(var(--ma-branch-glow), 0.18) !important;
  }

  .waterfall-signal-row,
  .waterfall-distribution-card,
  .waterfall-adjustment-item,
  .waterfall-bridge-step,
  .waterfall-glass-block {
    border-color: rgba(255,255,255,0.070) !important;
  }

  .waterfall-signal-row {
    border-top-color: rgba(var(--ma-branch-a), 0.110) !important;
  }

  .waterfall-kicker,
  .waterfall-title,
  .waterfall-signal-title,
  .waterfall-kpi-value,
  .waterfall-distribution-card strong,
  .waterfall-panel-title,
  .waterfall-section-header h2,
  .waterfall-section-header h3 {
    text-shadow:
      0 0 14px rgba(var(--ma-branch-glow), 0.115);
  }

  .waterfall-page table {
    border-color: rgba(var(--ma-branch-a), 0.120) !important;
    background:
      radial-gradient(circle at 0% 0%, rgba(var(--ma-branch-a), 0.095), transparent 34%),
      radial-gradient(circle at 100% 0%, rgba(var(--ma-branch-b), 0.070), transparent 38%),
      rgba(15, 23, 42, 0.46) !important;
    box-shadow:
      0 18px 48px rgba(0,0,0,0.18),
      0 0 28px rgba(var(--ma-branch-glow), 0.080),
      inset 0 1px 0 rgba(255,255,255,0.040) !important;
  }

  .waterfall-page th,
  .waterfall-page td {
    border-color: rgba(var(--ma-branch-a), 0.080) !important;
  }

  .waterfall-page th {
    color: rgba(167, 243, 208, 0.96) !important;
    text-shadow: 0 0 12px rgba(var(--ma-branch-glow), 0.120);
  }

  .waterfall-page tr:hover {
    background:
      linear-gradient(
        90deg,
        rgba(var(--ma-branch-a), 0.080),
        rgba(var(--ma-branch-b), 0.045)
      ) !important;
  }

  .waterfall-page .badge,
  .waterfall-page [class*="badge"] {
    border-color: rgba(var(--ma-branch-a), 0.28) !important;
    background:
      linear-gradient(
        90deg,
        rgba(var(--ma-branch-a), 0.145),
        rgba(var(--ma-branch-b), 0.080)
      ) !important;
    box-shadow:
      0 0 18px rgba(var(--ma-branch-glow), 0.10),
      inset 0 1px 0 rgba(255,255,255,0.060) !important;
  }

  .waterfall-bridge-step,
  .waterfall-distribution-card,
  .waterfall-adjustment-item {
    transition:
      transform .18s ease,
      box-shadow .22s ease,
      border-color .22s ease,
      filter .22s ease;
  }

  .waterfall-bridge-step:hover,
  .waterfall-distribution-card:hover,
  .waterfall-adjustment-item:hover {
    filter: brightness(1.035) saturate(1.04);
  }



  /* WATERFALL SIGNAL · SCORE RING LIKE OTHER PAGES */
  .waterfall-score-module {
    display: grid;
    grid-template-columns: 122px minmax(0, 1fr);
    gap: 22px;
    align-items: center;
    padding: 20px;
    border-radius: 26px;
    background:
      radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.10), transparent 38%),
      linear-gradient(135deg, rgba(255, 255, 255, 0.050), rgba(255, 255, 255, 0.020)),
      rgba(255, 255, 255, 0.030) !important;
    border: 1px solid rgba(255, 255, 255, 0.085) !important;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.040),
      0 18px 40px rgba(0, 0, 0, 0.120) !important;
  }

  .waterfall-score-ring {
    position: relative;
    width: 112px;
    height: 112px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background:
      conic-gradient(
        rgba(16, 185, 129, 0.96) 0deg,
        rgba(16, 185, 129, 0.96) var(--score-angle),
        rgba(51, 65, 85, 0.65) var(--score-angle),
        rgba(51, 65, 85, 0.65) 360deg
      ) !important;
    box-shadow:
      0 18px 40px rgba(0, 0, 0, 0.28),
      0 0 34px rgba(16, 185, 129, 0.16) !important;
  }

  .waterfall-score-ring::before {
    content: "";
    position: absolute;
    inset: 9px;
    border-radius: 999px;
    background:
      radial-gradient(circle at 30% 25%, rgba(255,255,255,0.060), transparent 36%),
      rgba(15, 23, 42, 0.96);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.060),
      inset 0 0 0 1px rgba(255,255,255,0.030);
    pointer-events: none;
  }

  .waterfall-score-core {
    position: relative;
    z-index: 1;
    width: 78px;
    height: 78px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background:
      radial-gradient(circle at 30% 25%, rgba(255,255,255,0.050), transparent 38%),
      rgba(15, 23, 42, 0.98) !important;
    border: 1px solid rgba(255, 255, 255, 0.060) !important;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.040),
      0 8px 18px rgba(0, 0, 0, 0.22) !important;
  }

  .waterfall-score-core strong {
    font-size: 25px;
    font-weight: 800;
    letter-spacing: -0.05em;
    color: #f8fafc !important;
    text-shadow: 0 0 14px rgba(16, 185, 129, 0.18);
  }

  .waterfall-score-core strong.is-empty-score {
    font-size: 30px;
    color: rgba(226, 232, 240, 0.72) !important;
    text-shadow: none;
  }

  @media (max-width: 1180px) {
    .waterfall-hero-layout {
      grid-template-columns: 1fr;
    }

    .waterfall-grid-kpis,
    .waterfall-bridge-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 920px) {
    .waterfall-grid-two {
      grid-template-columns: 1fr;
    }

    .waterfall-section-header {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (max-width: 680px) {
    .waterfall-page {
      gap: 28px;
    }

    .waterfall-hero {
      padding: 26px;
      border-radius: 28px;
    }

    .waterfall-grid-kpis,
    .waterfall-bridge-grid,
    .waterfall-distribution-grid {
      grid-template-columns: 1fr;
    }

    .waterfall-kpi-card,
    .waterfall-panel,
    .waterfall-sensitivity-panel {
      border-radius: 24px;
    }

    .waterfall-score-module {
      grid-template-columns: 1fr;
    }

    .waterfall-signal-row {
      grid-template-columns: 1fr;
      gap: 7px;
    }

    .waterfall-signal-row strong {
      text-align: left;
    }
  }
`;

export function WaterfallPage() {
  const { can, isViewer } = useAuth();
  const { financials, settings } = useMAStore();

  const canEditCase = can(PERMISSIONS.UPDATE_MA_CASE);

  const derived = useValuationEngine({
    financials,
    settings
  });

  const reportCurrency = settings?.reportCurrency || 'EUR';
  const activeCompanyName = financials?.name?.trim() || 'Sin target activo';
  const foundersEquity = Number(financials.foundersEquity) || 0;
  const investorsEquity = 100 - foundersEquity;

  const waterfallSignal = getWaterfallSignal({
    evBase: derived.evBase,
    equityBase: derived.equityBase,
    netDebt: derived.netDebt,
    netProceeds: derived.netProceeds,
    feesVal: derived.feesVal,
    taxesVal: derived.taxesVal,
    wcAdjustment: derived.wcAdjustment
  });

  const hasWaterfallScore = waterfallSignal.score !== null;
  const scoreAngle = `${(waterfallSignal.score ?? 0) * 3.6}deg`;

  return (
    <div className="page">
      <style>{waterfallCss}</style>

      <div className="waterfall-page">
        <section className="waterfall-hero">
          <div className="waterfall-hero-layout">
            <div>
              <div className="waterfall-badge-row">
                <Badge>M&A Workspace</Badge>
                <Badge>Deal Economics</Badge>
                {isViewer ? <Badge>Modo solo lectura</Badge> : null}
                {canEditCase ? <Badge>Edición M&A permitida</Badge> : null}
              </div>

              <h1 className="waterfall-title">
                Deal Waterfall.
                <span>From enterprise value to real proceeds.</span>
              </h1>

              <p className="waterfall-copy">
                Product waterfall: adjusted DSS enterprise value → net debt →
                working capital → adjusted equity → fees/taxes → estimated net
                proceeds. Not the simple Golden seller-cash benchmark.
              </p>

              <p className="muted" style={{ marginTop: 12, maxWidth: 720 }}>
                Indicative DSS bridge for internal review — not a fairness
                opinion.
              </p>

              <div className="waterfall-command-bar">
                <CommandItem
                  label="Active target"
                  value={activeCompanyName}
                />

                <CommandItem
                  label="Adjusted DSS EV (live)"
                  value={formatCurrency(derived.evBase, reportCurrency)}
                />

                <CommandItem
                  label="Economic posture"
                  value={waterfallSignal.posture}
                />
              </div>
            </div>

            <aside className="waterfall-signal-card">
              <div className="waterfall-signal-inner">
                <div className="waterfall-signal-top">
                  <div>
                    <div className="kpi-label">Waterfall Signal</div>
                    <div className="waterfall-signal-title">
                      {waterfallSignal.title}
                    </div>
                  </div>

                  <div className="waterfall-icon-box">
                    <ArrowDownUp size={21} />
                  </div>
                </div>

                <div className="waterfall-score-module">
                  <div
                    className="waterfall-score-ring"
                    style={{ '--score-angle': scoreAngle }}
                  >
                    <div className="waterfall-score-core">
                      <strong className={hasWaterfallScore ? '' : 'is-empty-score'}>
                        {hasWaterfallScore ? waterfallSignal.score : '—'}
                      </strong>
                    </div>
                  </div>

                  <div className="waterfall-score-copy">
                    <strong>{waterfallSignal.posture}</strong>

                    <p className="muted">
                      {waterfallSignal.description}
                    </p>
                  </div>
                </div>

                <div className="waterfall-signal-table">
                  <SignalRow
                    label="Enterprise value"
                    value={formatCurrency(derived.evBase, reportCurrency)}
                  />

                  <SignalRow
                    label="Net debt"
                    value={formatCurrency(derived.netDebt, reportCurrency)}
                  />

                  <SignalRow
                    label="Equity value"
                    value={formatCurrency(derived.equityBase, reportCurrency)}
                  />

                  <SignalRow
                    label="Net proceeds"
                    value={formatCurrency(derived.netProceeds, reportCurrency)}
                  />
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="waterfall-section">
          <SectionHeader
            kicker="Economic bridge"
            icon={TrendingUp}
            title="Deal economics at a glance"
            description="Resumen de las principales métricas que explican cómo se transforma el valor bruto del activo en caja final para las partes."
          />

          <div className="waterfall-grid waterfall-grid-kpis">
            <KpiCard
              label="Enterprise Value"
              value={formatCurrency(derived.evBase, reportCurrency)}
              description="Valor antes de deuda y caja"
              icon={TrendingUp}
            />

            <KpiCard
              label="Net Debt"
              value={formatCurrency(derived.netDebt, reportCurrency)}
              description="Deuda neta estimada"
              icon={Calculator}
            />

            <KpiCard
              label="Equity Value"
              value={formatCurrency(derived.equityBase, reportCurrency)}
              description="Valor atribuible al equity"
              icon={ShieldCheck}
              success
            />

            <KpiCard
              label="Net Proceeds"
              value={formatCurrency(derived.netProceeds, reportCurrency)}
              description="Caja estimada tras ajustes"
              icon={PieChart}
            />
          </div>
        </section>

        <section className="waterfall-bridge-panel">
          <SectionHeader
            kicker="Transaction logic"
            icon={ArrowDownUp}
            title="From headline valuation to distributable cash"
            description="El waterfall ayuda a explicar cómo cada ajuste transforma la valoración inicial en proceeds finales y en reparto económico real."
          />

          <div className="waterfall-bridge-grid">
            <BridgeStep
              number="01"
              title="Enterprise Value"
              text="Valor económico inicial del activo antes de aplicar deuda, caja y ajustes."
            />

            <BridgeStep
              number="02"
              title="Net debt bridge"
              text="Impacto de deuda financiera, caja disponible y posición neta sobre el equity."
            />

            <BridgeStep
              number="03"
              title="Equity Value"
              text="Valor atribuible a los accionistas después de ajustar el valor empresa."
            />

            <BridgeStep
              number="04"
              title="Net Proceeds"
              text="Caja final estimada tras ajustes de operación, estructura y reparto."
            />
          </div>
        </section>

        <section className="waterfall-grid waterfall-grid-two">
          <div className="waterfall-external-section">
            <SectionHeader
              kicker="Waterfall model"
              icon={Activity}
              title="Enterprise value to equity bridge"
              description="Vista operativa del puente de valor y de los principales ajustes económicos de la operación."
            />

            <WaterfallPanel
              derived={derived}
              financials={financials}
              settings={settings}
            />
          </div>

          <section className="waterfall-panel">
            <PanelHeader
              kicker="Cap table"
              icon={PieChart}
              title="Cap Table Distribution"
              description="Reparto estimado de proceeds entre fundadores e inversores según la estructura de equity indicada."
            />

            <div className="waterfall-distribution-grid">
              <DistributionCard
                label={`Fundadores (${foundersEquity}%)`}
                value={formatCurrency(derived.foundersCash, reportCurrency)}
                success
              />

              <DistributionCard
                label={`Inversores (${investorsEquity}%)`}
                value={formatCurrency(derived.investorsCash, reportCurrency)}
              />
            </div>

            <div className="waterfall-adjustment-list">
              <AdjustmentItem
                icon={Calculator}
                title="Transaction Adjustments"
                text="El waterfall explica cómo cada ajuste transforma la valoración bruta en caja final recibida por las partes."
              />

              <AdjustmentItem
                icon={CheckCircle2}
                title="Decision clarity"
                text="El objetivo no es solo calcular proceeds, sino entender qué palancas afectan al resultado y dónde puede negociarse mejor."
              />
            </div>
          </section>
        </section>

        <section className="waterfall-sensitivity-panel">
          <SectionHeader
            kicker="Sensitivity"
            icon={Sparkles}
            title="Sensitivity Analysis"
            description="Lectura de sensibilidad del valor ante cambios de múltiplo y EBITDA normalizado."
          />

          <div style={{ marginBottom: 22 }}>
            <Badge>{derived.adjustedMultiple}x múltiplo ajustado</Badge>
          </div>

          <SensitivityMatrix
            matrix={derived.sensitivityMatrix}
            adjustedMultiple={derived.adjustedMultiple}
          />
        </section>
      </div>
    </div>
  );
}

function CommandItem({ label, value }) {
  return (
    <div className="waterfall-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SignalRow({ label, value }) {
  return (
    <div className="waterfall-signal-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function BridgeStep({ number, title, text }) {
  return (
    <div className="waterfall-bridge-step">
      <div className="kpi-label">{number}</div>
      <strong>{title}</strong>

      <p className="muted waterfall-muted-tight" style={{ marginTop: 8 }}>
        {text}
      </p>
    </div>
  );
}

function KpiCard({ label, value, description, icon: Icon, success = false }) {
  return (
    <article className="waterfall-kpi-card">
      <div className="waterfall-kpi-top">
        <div>
          <div className="kpi-label">{label}</div>

          <div className={`waterfall-kpi-value ${success ? 'text-success' : ''}`}>
            {value}
          </div>
        </div>

        <div className="waterfall-card-icon">
          <Icon size={18} />
        </div>
      </div>

      <p className="muted">{description}</p>
    </article>
  );
}

function DistributionCard({ label, value, success = false }) {
  return (
    <div className="waterfall-distribution-card">
      <div className="kpi-label">{label}</div>

      <strong className={success ? 'text-success' : ''}>
        {value}
      </strong>
    </div>
  );
}

function AdjustmentItem({ icon: Icon, title, text }) {
  return (
    <div className="waterfall-adjustment-item">
      <div className="waterfall-adjustment-icon">
        <Icon size={16} />
      </div>

      <div>
        <strong>{title}</strong>

        <p className="muted">
          {text}
        </p>
      </div>
    </div>
  );
}

function SectionHeader({ kicker, icon: Icon, title, description }) {
  return (
    <div className="waterfall-section-header">
      <div>
        <div className="waterfall-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h2>{title}</h2>

        <p className="muted">{description}</p>
      </div>
    </div>
  );
}

function PanelHeader({ kicker, icon: Icon, title, description }) {
  return (
    <div className="waterfall-panel-header">
      <div>
        <div className="waterfall-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h3 className="waterfall-panel-title">{title}</h3>

        <p className="muted waterfall-panel-description">{description}</p>
      </div>

      <div className="waterfall-panel-icon">
        <Icon size={18} />
      </div>
    </div>
  );
}

function getSafeNumber(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return 0;

  return parsed;
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getWaterfallScore({
  evBase,
  equityBase,
  netDebt,
  netProceeds,
  feesVal,
  taxesVal,
  wcAdjustment
}) {
  const ev = getSafeNumber(evBase);
  const equity = getSafeNumber(equityBase);
  const debt = getSafeNumber(netDebt);
  const proceeds = getSafeNumber(netProceeds);
  const fees = Math.abs(getSafeNumber(feesVal));
  const taxes = Math.abs(getSafeNumber(taxesVal));
  const wc = getSafeNumber(wcAdjustment);

  if (ev <= 0 || equity <= 0) return null;

  const proceedsRatio = proceeds > 0 ? proceeds / equity : 0;
  const debtRatio = equity > 0 ? Math.max(0, debt) / equity : 0;
  const frictionRatio = equity > 0 ? (fees + taxes) / equity : 0;
  const wcPenalty = wc < 0 ? Math.min(10, Math.abs(wc) / equity * 20) : 0;

  let score = 42;

  score += Math.min(32, proceedsRatio * 32);
  score += proceeds > 0 ? 12 : -10;
  score -= Math.min(18, debtRatio * 26);
  score -= Math.min(14, frictionRatio * 42);
  score -= wcPenalty;

  if (proceeds >= equity * 0.85) score += 8;
  if (debt <= equity * 0.25) score += 6;
  if (proceeds <= 0) score = Math.min(score, 38);

  return clampScore(score);
}

function getWaterfallSignal({
  evBase,
  equityBase,
  netDebt,
  netProceeds,
  feesVal,
  taxesVal,
  wcAdjustment
}) {
  const ev = getSafeNumber(evBase);
  const equity = getSafeNumber(equityBase);
  const debt = getSafeNumber(netDebt);
  const proceeds = getSafeNumber(netProceeds);
  const score = getWaterfallScore({
    evBase,
    equityBase,
    netDebt,
    netProceeds,
    feesVal,
    taxesVal,
    wcAdjustment
  });

  if (score === null || ev <= 0 || equity <= 0) {
    return {
      score: null,
      title: 'Incomplete economics',
      posture: 'Build bridge',
      description:
        'Completa la valoración para generar un puente económico defendible desde Enterprise Value hasta proceeds.'
    };
  }

  if (score >= 82) {
    return {
      score,
      title: 'Clean proceeds bridge',
      posture: 'Proceed with structure',
      description:
        'La estructura muestra un puente sólido entre valor empresa, deuda neta, equity y caja final estimada.'
    };
  }

  if (score >= 65) {
    return {
      score,
      title: 'Structured proceeds bridge',
      posture: 'Review adjustments',
      description:
        'El deal genera proceeds positivos, aunque conviene revisar deuda neta, caja y ajustes antes de presentar conclusiones.'
    };
  }

  if (score >= 45 && proceeds > 0) {
    return {
      score,
      title: 'Pressure on proceeds',
      posture: 'Rework structure',
      description:
        'La estructura mantiene proceeds positivos, pero los ajustes reducen la caja final. Revisa deuda, fees, impuestos y working capital.'
    };
  }

  return {
    score,
    title: 'Weak proceeds bridge',
    posture: 'Rebuild economics',
    description:
      'La estructura actual no genera una lectura económica suficientemente sólida. Revisa supuestos antes de avanzar.'
  };
}



