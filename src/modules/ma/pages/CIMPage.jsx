import React from 'react';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Download,
  FileSearch,
  FileText,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import {
  PERMISSIONS,
  useAuth
} from '../../../app/providers/AuthProvider.jsx';
import { useNotifications } from '../../../app/providers/NotificationsProvider.jsx';
import { useMAStore } from '../store/maStore.jsx';
import { useValuationEngine } from '../engine/useValuationEngine.js';
import { ComparablesGrid } from '../components/ComparablesGrid.jsx';
import { maReportsApi } from '../services/maReportsApi.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';

const cimPageCss = `
  .cim-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 38px;
  }

  .cim-hero {
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

  .cim-hero::before {
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

  .cim-hero::after {
    content: "";
    position: absolute;
    inset: auto -190px -210px auto;
    width: 520px;
    height: 520px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.13), transparent 70%);
    pointer-events: none;
  }

  .cim-hero-layout {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.42fr) minmax(380px, 0.58fr);
    gap: 36px;
    align-items: stretch;
  }

  .cim-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 26px;
  }

  .cim-title {
    margin: 0;
    max-width: 950px;
    font-size: clamp(42px, 5vw, 72px);
    line-height: 0.92;
    letter-spacing: -0.075em;
  }

  .cim-title span {
    display: block;
    margin-top: 8px;
    color: rgba(226, 232, 240, 0.7);
  }

  .cim-hero-copy {
    max-width: 860px;
    margin: 26px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .cim-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 34px;
  }

  .cim-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .cim-command-item {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.078);
  }

  .cim-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
  }

  .cim-export-card {
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

  .cim-export-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: radial-gradient(circle at 18% 0%, rgba(96, 165, 250, 0.13), transparent 35%);
    pointer-events: none;
  }

  .cim-export-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .cim-export-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .cim-icon-box,
  .cim-card-icon,
  .cim-panel-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .cim-icon-box {
    width: 50px;
    height: 50px;
  }

  .cim-card-icon,
  .cim-panel-icon {
    width: 46px;
    height: 46px;
  }

  .cim-export-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.16;
    letter-spacing: -0.04em;
  }

  .cim-score-module {
    display: grid;
    grid-template-columns: 122px minmax(0, 1fr);
    gap: 22px;
    align-items: center;
    padding: 20px;
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.047);
    border: 1px solid rgba(255, 255, 255, 0.085);
  }

  .cim-score-ring {
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

  .cim-score-core {
    width: 84px;
    height: 84px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.97);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .cim-score-core strong {
    font-size: 25px;
    letter-spacing: -0.055em;
  }

  .cim-score-copy strong {
    display: block;
    margin-bottom: 8px;
  }

  .cim-score-copy p {
    margin: 0;
    line-height: 1.62;
  }

  .cim-export-table {
    display: grid;
    gap: 0;
  }

  .cim-export-row {
    display: grid;
    grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
    gap: 14px;
    align-items: center;
    padding: 15px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }

  .cim-export-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .cim-section {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .cim-section-header {
    display: flex;
    justify-content: space-between;
    gap: 28px;
    align-items: flex-end;
  }

  .cim-kicker {
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

  .cim-section-header h2,
  .cim-section-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .cim-section-header p {
    max-width: 820px;
    margin: 11px 0 0;
    line-height: 1.68;
  }

  .cim-grid {
    display: grid;
    gap: 26px;
    align-items: stretch;
  }

  .cim-grid-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .cim-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .cim-kpi-card,
  .cim-panel,
  .cim-workflow-card {
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

  .cim-kpi-card {
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

  .cim-kpi-card:hover {
    transform: translateY(-3px);
    border-color: rgba(96, 165, 250, 0.25);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .cim-kpi-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .cim-kpi-value {
    margin-top: 12px;
    font-size: 25px;
    font-weight: 790;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .cim-kpi-card p {
    margin: 0;
    line-height: 1.56;
  }

  .cim-panel {
    padding: 31px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .cim-panel-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .cim-panel-title {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .cim-panel-description {
    margin: 11px 0 0;
    line-height: 1.66;
  }

  .cim-memo-body {
    padding: 25px;
    border-radius: 25px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.066), rgba(255,255,255,0.026));
    border: 1px solid rgba(255,255,255,0.092);
  }

  .cim-memo-body p {
    margin: 0;
    line-height: 1.78;
    color: rgba(226, 232, 240, 0.9);
  }

  .cim-thesis-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .cim-thesis-item {
    display: grid;
    grid-template-columns: 32px minmax(0, 1fr);
    gap: 15px;
    align-items: flex-start;
    padding: 19px;
    border-radius: 21px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.078);
    color: var(--muted);
    line-height: 1.62;
  }

  .cim-thesis-dot {
    width: 32px;
    height: 32px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.22);
    color: #86efac;
  }

  .cim-bridge-panel {
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

  .cim-bridge-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-top: 22px;
  }

  .cim-bridge-step {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.075);
  }

  .cim-bridge-step strong {
    display: block;
    margin-top: 8px;
  }

  .cim-workflow-card {
    padding: 27px;
    display: grid;
    grid-template-columns: 48px minmax(0, 1fr) 42px;
    gap: 21px;
    align-items: center;
  }

  .cim-step-number {
    width: 48px;
    height: 48px;
    border-radius: 19px;
    display: grid;
    place-items: center;
    font-size: 12px;
    font-weight: 850;
    color: #dbeafe;
    background: rgba(37, 99, 235, 0.18);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .cim-workflow-card strong {
    display: block;
    margin-bottom: 8px;
  }

  .cim-workflow-card p {
    margin: 0;
    line-height: 1.62;
  }

  .cim-arrow-icon {
    width: 42px;
    height: 42px;
    border-radius: 17px;
    display: grid;
    place-items: center;
    color: inherit;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .cim-muted-tight {
    margin-bottom: 0;
  }


  /* CIM PAGE · PREMIUM EXECUTIVE POLISH */
  .cim-hero,
  .cim-export-card,
  .cim-kpi-card,
  .cim-panel,
  .cim-bridge-panel,
  .cim-workflow-card {
    position: relative;
    isolation: isolate;
  }

  .cim-hero {
    border-color: rgba(16, 185, 129, 0.20);
    background:
      radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.20), transparent 28%),
      radial-gradient(circle at 96% 6%, rgba(37, 99, 235, 0.26), transparent 30%),
      radial-gradient(circle at 60% 112%, rgba(212, 175, 55, 0.11), transparent 32%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.99), rgba(15, 23, 42, 0.96));
    box-shadow:
      0 42px 130px rgba(0, 0, 0, 0.46),
      0 0 54px rgba(16, 185, 129, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.065);
  }

  .cim-hero::before {
    opacity: 0.72;
  }

  .cim-hero::after {
    background:
      radial-gradient(circle, rgba(16, 185, 129, 0.16), transparent 68%);
  }

  .cim-title {
    text-shadow:
      0 0 32px rgba(255,255,255,0.05),
      0 18px 54px rgba(0,0,0,0.28);
  }

  .cim-title span {
    background:
      linear-gradient(
        90deg,
        rgba(226, 232, 240, 0.78),
        rgba(110, 231, 183, 0.76),
        rgba(191, 219, 254, 0.70)
      );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .cim-badge-row .badge,
  .cim-actions .badge {
    border-color: rgba(16, 185, 129, 0.22) !important;
    background:
      linear-gradient(90deg, rgba(16,185,129,0.13), rgba(37,99,235,0.08)) !important;
    box-shadow:
      0 0 18px rgba(16,185,129,0.09),
      inset 0 1px 0 rgba(255,255,255,0.060) !important;
  }

  .cim-command-item,
  .cim-bridge-step,
  .cim-thesis-item,
  .cim-memo-body {
    background:
      radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.10), transparent 38%),
      radial-gradient(circle at 100% 4%, rgba(37, 99, 235, 0.08), transparent 40%),
      linear-gradient(135deg, rgba(255,255,255,0.060), rgba(255,255,255,0.020)),
      rgba(15, 23, 42, 0.54);
    border-color: rgba(255,255,255,0.080);
    box-shadow:
      0 16px 42px rgba(0,0,0,0.14),
      inset 0 1px 0 rgba(255,255,255,0.045);
  }

  .cim-command-item strong,
  .cim-bridge-step strong,
  .cim-workflow-card strong,
  .cim-thesis-item span:last-child {
    color: rgba(248, 250, 252, 0.94);
  }

  .cim-export-card,
  .cim-kpi-card,
  .cim-panel,
  .cim-bridge-panel,
  .cim-workflow-card {
    overflow: hidden;
    border-color: rgba(16, 185, 129, 0.15);
    background:
      radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.105), transparent 36%),
      radial-gradient(circle at 100% 0%, rgba(37, 99, 235, 0.085), transparent 42%),
      linear-gradient(135deg, rgba(255,255,255,0.064), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.62);
    box-shadow:
      0 26px 78px rgba(0, 0, 0, 0.22),
      0 0 34px rgba(16, 185, 129, 0.055),
      inset 0 1px 0 rgba(255,255,255,0.050);
    backdrop-filter: blur(18px) saturate(125%);
    -webkit-backdrop-filter: blur(18px) saturate(125%);
  }

  .cim-export-card::after,
  .cim-kpi-card::after,
  .cim-panel::after,
  .cim-bridge-panel::after,
  .cim-workflow-card::after {
    content: "";
    position: absolute;
    inset: 1px;
    z-index: -1;
    border-radius: inherit;
    pointer-events: none;
    background:
      linear-gradient(
        135deg,
        rgba(255,255,255,0.050),
        transparent 36%,
        rgba(16,185,129,0.025) 100%
      );
    opacity: 0.8;
  }

  .cim-export-card:hover,
  .cim-kpi-card:hover,
  .cim-panel:hover,
  .cim-workflow-card:hover {
    transform: translateY(-3px);
    border-color: rgba(110, 231, 183, 0.24);
    box-shadow:
      0 34px 96px rgba(0, 0, 0, 0.28),
      0 0 44px rgba(16, 185, 129, 0.085),
      inset 0 1px 0 rgba(255,255,255,0.070);
  }

  .cim-export-card,
  .cim-kpi-card,
  .cim-panel,
  .cim-workflow-card {
    transition:
      transform .18s ease,
      border-color .18s ease,
      box-shadow .18s ease,
      background .18s ease;
  }

  .cim-icon-box,
  .cim-card-icon,
  .cim-panel-icon,
  .cim-step-number,
  .cim-arrow-icon,
  .cim-thesis-dot {
    background:
      linear-gradient(135deg, rgba(16,185,129,0.16), rgba(37,99,235,0.09));
    border-color: rgba(16,185,129,0.24);
    color: #bbf7d0;
    box-shadow:
      0 0 20px rgba(16,185,129,0.13),
      inset 0 1px 0 rgba(255,255,255,0.065);
  }

  .cim-score-module {
    background:
      radial-gradient(circle at 0% 0%, rgba(16,185,129,0.12), transparent 42%),
      linear-gradient(135deg, rgba(255,255,255,0.060), rgba(255,255,255,0.022)),
      rgba(2, 6, 23, 0.34);
    border-color: rgba(16,185,129,0.14);
    box-shadow:
      0 18px 48px rgba(0,0,0,0.18),
      inset 0 1px 0 rgba(255,255,255,0.050);
  }

  .cim-score-ring {
    background:
      conic-gradient(
        rgba(16, 185, 129, 0.98) var(--score-angle),
        rgba(37, 99, 235, 0.22) var(--score-angle),
        rgba(255,255,255,0.08) 360deg
      );
    box-shadow:
      0 18px 44px rgba(0, 0, 0, 0.32),
      0 0 38px rgba(16, 185, 129, 0.18);
  }

  .cim-score-core {
    background:
      radial-gradient(circle at 50% 0%, rgba(16,185,129,0.08), transparent 48%),
      rgba(15, 23, 42, 0.98);
    border-color: rgba(255,255,255,0.10);
  }

  .cim-score-core strong {
    color: #bbf7d0;
    text-shadow: 0 0 18px rgba(16,185,129,0.18);
  }

  .cim-export-row {
    padding: 16px 0;
    border-top-color: rgba(148, 163, 184, 0.11);
  }

  .cim-export-row strong {
    padding: 7px 10px;
    border-radius: 999px;
    background:
      linear-gradient(90deg, rgba(16,185,129,0.10), rgba(37,99,235,0.065));
    border: 1px solid rgba(16,185,129,0.15);
    color: rgba(226, 232, 240, 0.96);
    box-shadow: 0 0 16px rgba(16,185,129,0.055);
  }

  .cim-kpi-value {
    color: rgba(248,250,252,0.96);
  }

  .cim-kpi-value.text-success {
    color: #6ee7b7;
    text-shadow: 0 0 16px rgba(110,231,183,0.16);
  }

  .cim-memo-body {
    position: relative;
    overflow: hidden;
  }

  .cim-memo-body::before {
    content: "";
    position: absolute;
    left: 0;
    top: 18px;
    bottom: 18px;
    width: 3px;
    border-radius: 999px;
    background:
      linear-gradient(180deg, rgba(16,185,129,0.95), rgba(37,99,235,0.70));
    box-shadow: 0 0 16px rgba(16,185,129,0.18);
  }

  .cim-memo-body p {
    padding-left: 10px;
  }

  .cim-thesis-list {
    counter-reset: thesis-counter;
  }

  .cim-thesis-item {
    counter-increment: thesis-counter;
  }

  .cim-thesis-dot::after {
    content: counter(thesis-counter);
    font-size: 11px;
    font-weight: 900;
    color: #bbf7d0;
  }

  .cim-thesis-dot svg {
    display: none;
  }

  .cim-bridge-panel {
    border-color: rgba(212, 175, 55, 0.18);
    background:
      radial-gradient(circle at 0% 0%, rgba(212, 175, 55, 0.12), transparent 32%),
      radial-gradient(circle at 100% 8%, rgba(16, 185, 129, 0.10), transparent 34%),
      linear-gradient(135deg, rgba(255,255,255,0.058), rgba(255,255,255,0.020)),
      rgba(15, 23, 42, 0.64);
  }

  .cim-bridge-step {
    min-height: 156px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .cim-bridge-step .kpi-label {
    width: fit-content;
    padding: 8px 10px;
    border-radius: 999px;
    background: rgba(212,175,55,0.10);
    border: 1px solid rgba(212,175,55,0.18);
    color: rgba(254, 240, 138, 0.94);
  }

  .cim-workflow-card {
    min-height: 158px;
  }

  .cim-workflow-card p {
    color: rgba(203, 213, 225, 0.82);
  }

  .cim-arrow-icon {
    color: rgba(226,232,240,0.84);
  }

  @media (max-width: 1180px) {
    .cim-hero-layout {
      grid-template-columns: 1fr;
    }

    .cim-grid-kpis,
    .cim-bridge-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 920px) {
    .cim-grid-two,
    .cim-command-bar {
      grid-template-columns: 1fr;
    }

    .cim-section-header {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (max-width: 680px) {
    .cim-page {
      gap: 28px;
    }

    .cim-hero {
      padding: 26px;
      border-radius: 28px;
    }

    .cim-grid-kpis,
    .cim-bridge-grid {
      grid-template-columns: 1fr;
    }

    .cim-kpi-card,
    .cim-panel,
    .cim-workflow-card {
      border-radius: 24px;
    }

    .cim-score-module {
      grid-template-columns: 1fr;
    }

    .cim-export-row {
      grid-template-columns: 1fr;
      gap: 7px;
    }

    .cim-export-row strong {
      text-align: left;
    }

    .cim-workflow-card {
      grid-template-columns: 48px minmax(0, 1fr);
    }

    .cim-arrow-icon {
      display: none;
    }
  }
`;

export function CIMPage() {
  const { financials, settings } = useMAStore();
  const { pushToast } = useNotifications();
  const { can, isViewer } = useAuth();

  const canExportReport = can(PERMISSIONS.CREATE_MA_REPORT);

  const derived = useValuationEngine({
    financials,
    settings
  });

  const reportCurrency = settings?.reportCurrency || 'EUR';
  const activeCompanyName = financials?.name?.trim() || 'Sin caso activo';
  const projectName = financials?.name ? financials.name.split(' ')[0] : 'Deal';
  const qualityScore = Number.isFinite(derived.qualityScore)
    ? derived.qualityScore
    : 0;
  const normalizedScore = Math.max(0, Math.min(100, qualityScore));
  const scoreAngle = `${normalizedScore * 3.6}deg`;
  const thesisItems = Array.isArray(derived.thesis) ? derived.thesis : [];
  const comparables = Array.isArray(derived.comparables)
    ? derived.comparables
    : [];
  const execSummary =
    derived.execSummary ||
    'El memorando ejecutivo se completará cuando existan inputs financieros suficientes para construir una lectura defendible del activo.';

  function handleExport() {
    if (!canExportReport) {
      pushToast('No tienes permisos para exportar el CIM');
      return;
    }

    const result = maReportsApi.exportExecutiveReport({
      financials,
      settings,
      derived
    });

    const ok = result !== false;

    if (ok) {
      pushToast('CIM preparado para imprimir o guardar como PDF');
    } else {
      pushToast('El navegador ha bloqueado la ventana emergente');
    }
  }

  return (
    <div className="page">
      <style>{cimPageCss}</style>

      <div className="cim-page">
        <section className="cim-hero">
          <div className="cim-hero-layout">
            <div>
              <div className="cim-badge-row">
                <Badge>Confidential</Badge>
                <Badge>CIM Executive</Badge>
                {isViewer ? <Badge>Modo solo lectura</Badge> : null}
                {canExportReport ? (
                  <Badge>Exportación permitida</Badge>
                ) : (
                  <Badge>Sin permiso de exportación</Badge>
                )}
              </div>

              <h1 className="cim-title">
                Executive Investment Memo.
                <span>Board-ready narrative for the active deal.</span>
              </h1>

              <p className="cim-hero-copy">
                Convierte la valoración del activo en una narrativa ejecutiva:
                resumen de inversión, tesis, múltiplos, comparables, riesgos y
                señales clave preparadas para comité, inversores o revisión
                interna.
              </p>

              <div className="cim-actions">
                {canExportReport ? (
                  <Button onClick={handleExport}>
                    <Download size={16} />
                    Imprimir / Guardar PDF
                  </Button>
                ) : (
                  <Badge>Exportación bloqueada por permisos</Badge>
                )}
              </div>

              <div className="cim-command-bar">
                <CommandItem label="Project" value={projectName} />
                <CommandItem label="Document type" value="Confidential memo" />
                <CommandItem label="Output" value="Printable / PDF-ready" />
              </div>
            </div>

            <aside className="cim-export-card">
              <div className="cim-export-inner">
                <div className="cim-export-top">
                  <div>
                    <div className="kpi-label">Document Readiness</div>
                    <div className="cim-export-title">
                      {getReadinessTitle(normalizedScore)}
                    </div>
                  </div>

                  <div className="cim-icon-box">
                    <FileText size={21} />
                  </div>
                </div>

                <div className="cim-score-module">
                  <div
                    className="cim-score-ring"
                    style={{ '--score-angle': scoreAngle }}
                  >
                    <div className="cim-score-core">
                      <strong>{normalizedScore}</strong>
                    </div>
                  </div>

                  <div className="cim-score-copy">
                    <strong>{getReadinessPosture(normalizedScore)}</strong>

                    <p className="muted">
                      {getReadinessDescription(normalizedScore)}
                    </p>
                  </div>
                </div>

                <div className="cim-export-table">
                  <ExportRow label="Active company" value={activeCompanyName} />

                  <ExportRow
                    label="Equity value"
                    value={formatCurrency(derived.equityBase, reportCurrency)}
                  />

                  <ExportRow
                    label="Adjusted multiple"
                    value={`${derived.adjustedMultiple}x`}
                  />

                  <ExportRow
                    label="Export status"
                    value={canExportReport ? 'Ready' : 'Read-only'}
                  />
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="cim-section">
          <SectionHeader
            kicker="Memo snapshot"
            icon={BarChart3}
            title="Investment memo at a glance"
            description="Resumen de las principales métricas del activo para entender valoración, calidad del deal y posición del documento antes de exportar."
          />

          <div className="cim-grid cim-grid-kpis">
            <KpiCard
              label="Compañía"
              value={activeCompanyName}
              description="Activo analizado"
              icon={FileSearch}
            />

            <KpiCard
              label="Equity Value"
              value={formatCurrency(derived.equityBase, reportCurrency)}
              description="Valor base estimado"
              icon={TrendingUp}
              success
            />

            <KpiCard
              label="Adjusted Multiple"
              value={`${derived.adjustedMultiple}x`}
              description="Múltiplo ajustado"
              icon={Sparkles}
            />

            <KpiCard
              label="Quality Score"
              value={`${qualityScore}/100`}
              description="Calidad del deal"
              icon={ShieldCheck}
            />
          </div>
        </section>

        <section className="cim-grid cim-grid-two">
          <section className="cim-panel">
            <PanelHeader
              kicker="Executive memo"
              icon={FileSearch}
              title="Executive Memo"
              description="Resumen de alto nivel para explicar el activo, la lógica de valoración y el encaje del deal."
            />

            <div className="cim-memo-body">
              <p>{execSummary}</p>
            </div>
          </section>

          <section className="cim-panel">
            <PanelHeader
              kicker="Investment logic"
              icon={Sparkles}
              title="Investment Highlights"
              description="Puntos principales que sostienen la tesis de inversión."
            />

            {thesisItems.length > 0 ? (
              <ul className="cim-thesis-list">
                {thesisItems.map((item, index) => (
                  <li className="cim-thesis-item" key={index}>
                    <span className="cim-thesis-dot">
                      <CheckCircle2 size={14} />
                    </span>

                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="cim-memo-body">
                <p>
                  Todavía no hay suficientes señales para construir una tesis de
                  inversión completa. Completa el caso desde Valuation Engine.
                </p>
              </div>
            )}
          </section>
        </section>

        <section className="cim-bridge-panel">
          <SectionHeader
            kicker="Deal narrative"
            icon={ShieldCheck}
            title="From valuation to investment narrative"
            description="El CIM no solo muestra números. Convierte el análisis en un argumento defendible para tomar decisiones, presentar el activo y preparar una conversación ejecutiva."
          />

          <div className="cim-bridge-grid">
            <BridgeStep
              number="01"
              title="Defensible valuation"
              text="EBITDA normalizado, múltiplo sectorial, ajustes de calidad, deuda neta y sensibilidad."
            />

            <BridgeStep
              number="02"
              title="Investment thesis"
              text="Lectura de crecimiento, transferibilidad, riesgos y lógica estratégica del deal."
            />

            <BridgeStep
              number="03"
              title="Market context"
              text="Comparables y señales de mercado para reforzar el rango de valoración."
            />

            <BridgeStep
              number="04"
              title="Board-ready output"
              text="Vista imprimible para comité, inversores, socios o revisión interna."
            />
          </div>
        </section>

        <section className="cim-section">
          <SectionHeader
            kicker="Export logic"
            icon={LockKeyhole}
            title="Prepared for controlled distribution"
            description="El documento se genera como una vista imprimible. Desde el navegador puede imprimirse o guardarse como PDF, manteniendo control sobre el flujo de distribución."
          />

          <div className="cim-grid cim-grid-two">
            <WorkflowCard
              number="01"
              title="Review the active case"
              description="Comprueba que los inputs financieros, la tesis y la valoración son coherentes antes de exportar."
            />

            <WorkflowCard
              number="02"
              title="Generate the executive report"
              description="Abre la vista imprimible del CIM para revisión interna o preparación de entrega."
            />

            <WorkflowCard
              number="03"
              title="Print or save as PDF"
              description="Desde el navegador, selecciona imprimir o guardar como PDF según el flujo de trabajo."
            />

            <WorkflowCard
              number="04"
              title="Share under control"
              description="Distribuye el documento solo bajo NDA, revisión interna o permisos definidos por la organización."
            />
          </div>
        </section>

        <section className="cim-section">
          <SectionHeader
            kicker="Market context"
            icon={TrendingUp}
            title="Comparable intelligence"
            description="Una lectura comparativa para entender el rango de mercado y reforzar la narrativa de valoración."
          />

          <ComparablesGrid comparables={comparables} />
        </section>
      </div>
    </div>
  );
}

function CommandItem({ label, value }) {
  return (
    <div className="cim-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function ExportRow({ label, value }) {
  return (
    <div className="cim-export-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function BridgeStep({ number, title, text }) {
  return (
    <div className="cim-bridge-step">
      <div className="kpi-label">{number}</div>
      <strong>{title}</strong>

      <p className="muted cim-muted-tight" style={{ marginTop: 8 }}>
        {text}
      </p>
    </div>
  );
}

function WorkflowCard({ number, title, description }) {
  return (
    <article className="cim-workflow-card">
      <div className="cim-step-number">{number}</div>

      <div>
        <strong>{title}</strong>
        <p className="muted">{description}</p>
      </div>

      <div className="cim-arrow-icon">
        <ArrowRight size={16} />
      </div>
    </article>
  );
}

function KpiCard({ label, value, description, icon: Icon, success = false }) {
  return (
    <article className="cim-kpi-card">
      <div className="cim-kpi-top">
        <div>
          <div className="kpi-label">{label}</div>

          <div className={`cim-kpi-value ${success ? 'text-success' : ''}`}>
            {value}
          </div>
        </div>

        <div className="cim-card-icon">
          <Icon size={18} />
        </div>
      </div>

      <p className="muted">{description}</p>
    </article>
  );
}

function SectionHeader({ kicker, icon: Icon, title, description }) {
  return (
    <div className="cim-section-header">
      <div>
        <div className="cim-kicker">
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
    <div className="cim-panel-header">
      <div>
        <div className="cim-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h3 className="cim-panel-title">{title}</h3>

        <p className="muted cim-panel-description">{description}</p>
      </div>

      <div className="cim-panel-icon">
        <Icon size={18} />
      </div>
    </div>
  );
}

function getReadinessTitle(score) {
  if (score >= 75) return 'Board-ready memo';
  if (score >= 55) return 'Executive draft ready';
  if (score >= 35) return 'Needs review';

  return 'Incomplete memo';
}

function getReadinessPosture(score) {
  if (score >= 75) return 'Ready for controlled distribution';
  if (score >= 55) return 'Ready for internal review';
  if (score >= 35) return 'Validate before sharing';

  return 'Complete valuation inputs first';
}

function getReadinessDescription(score) {
  if (score >= 75) {
    return 'El documento tiene una base sólida para revisión ejecutiva, comité o distribución controlada.';
  }

  if (score >= 55) {
    return 'El memorando puede revisarse internamente, aunque conviene reforzar riesgos, tesis y documentación antes de compartir.';
  }

  if (score >= 35) {
    return 'El documento necesita más validación antes de presentarse como output ejecutivo.';
  }

  return 'Completa los principales datos financieros y ejecuta el análisis antes de generar conclusiones.';
}
