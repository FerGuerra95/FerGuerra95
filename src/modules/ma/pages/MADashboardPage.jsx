import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  FileSearch,
  FileText,
  Layers3,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import {
  PERMISSIONS,
  useAuth
} from '../../../app/providers/AuthProvider.jsx';
import { useMAStore } from '../store/maStore.jsx';
import { useValuationEngine } from '../engine/useValuationEngine.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';

const maDashboardCss = `
  .ma-executive-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 38px;
  }

  .ma-hero {
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

  .ma-hero::before {
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

  .ma-hero::after {
    content: "";
    position: absolute;
    inset: auto -190px -210px auto;
    width: 520px;
    height: 520px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.13), transparent 70%);
    pointer-events: none;
  }

  .ma-hero-layout {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.45fr) minmax(380px, 0.55fr);
    gap: 36px;
    align-items: stretch;
  }

  .ma-eyebrow-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 26px;
  }

  .ma-title {
    margin: 0;
    max-width: 930px;
    font-size: clamp(42px, 5vw, 72px);
    line-height: 0.92;
    letter-spacing: -0.075em;
  }

  .ma-title span {
    display: block;
    margin-top: 8px;
    color: rgba(226, 232, 240, 0.7);
  }

  .ma-hero-copy {
    max-width: 860px;
    margin: 26px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .ma-hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 34px;
  }

  .ma-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .ma-command-item {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.078);
  }

  .ma-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .ma-signal-card {
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

  .ma-signal-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: radial-gradient(circle at 18% 0%, rgba(96, 165, 250, 0.13), transparent 35%);
    pointer-events: none;
  }

  .ma-signal-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .ma-signal-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .ma-icon-box {
    flex: 0 0 auto;
    width: 50px;
    height: 50px;
    border-radius: 19px;
    display: grid;
    place-items: center;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .ma-signal-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.16;
    letter-spacing: -0.04em;
  }

  .ma-score-module {
    display: grid;
    grid-template-columns: 122px minmax(0, 1fr);
    gap: 22px;
    align-items: center;
    padding: 20px;
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.047);
    border: 1px solid rgba(255, 255, 255, 0.085);
  }

  .ma-score-ring {
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

  .ma-score-core {
    width: 84px;
    height: 84px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.97);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .ma-score-core strong {
    font-size: 25px;
    letter-spacing: -0.055em;
  }

  .ma-score-core strong.is-empty-score {
    font-size: 30px;
    color: rgba(226, 232, 240, 0.72);
  }

  .ma-score-copy strong {
    display: block;
    margin-bottom: 8px;
  }

  .ma-score-copy p {
    margin: 0;
    line-height: 1.62;
  }

  .ma-signal-table {
    display: grid;
    gap: 0;
  }

  .ma-signal-row {
    display: grid;
    grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
    gap: 14px;
    align-items: center;
    padding: 15px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }

  .ma-signal-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .ma-section {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .ma-section-header {
    display: flex;
    justify-content: space-between;
    gap: 28px;
    align-items: flex-end;
  }

  .ma-kicker {
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

  .ma-section-header h2,
  .ma-section-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .ma-section-header p {
    max-width: 820px;
    margin: 11px 0 0;
    line-height: 1.68;
  }

  .ma-grid {
    display: grid;
    gap: 26px;
    align-items: stretch;
  }

  .ma-grid-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .ma-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ma-kpi-card,
  .ma-panel,
  .ma-workflow-card,
  .ma-summary-card {
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

  .ma-kpi-card {
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

  .ma-kpi-card:hover {
    transform: translateY(-3px);
    border-color: rgba(96, 165, 250, 0.25);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .ma-kpi-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .ma-card-icon {
    flex: 0 0 auto;
    width: 46px;
    height: 46px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    background: rgba(37, 99, 235, 0.14);
    border: 1px solid rgba(96, 165, 250, 0.22);
  }

  .ma-kpi-value {
    margin-top: 12px;
    font-size: 25px;
    font-weight: 790;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .ma-kpi-card p {
    margin: 0;
    line-height: 1.56;
  }

  .ma-bridge-panel {
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

  .ma-bridge-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-top: 22px;
  }

  .ma-bridge-step {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.075);
  }

  .ma-bridge-step strong {
    display: block;
    margin-top: 8px;
  }

  .ma-pipeline-preview {
    position: relative;
    overflow: hidden;
    border-radius: 34px;
    padding: 32px;
    border: 1px solid rgba(148, 163, 184, 0.17);
    background:
      radial-gradient(circle at 4% 0%, rgba(37, 99, 235, 0.2), transparent 30%),
      radial-gradient(circle at 92% 4%, rgba(16, 185, 129, 0.13), transparent 28%),
      radial-gradient(circle at 50% 120%, rgba(234, 179, 8, 0.07), transparent 34%),
      linear-gradient(135deg, rgba(15, 23, 42, 0.78), rgba(2, 6, 23, 0.82));
    box-shadow:
      0 28px 80px rgba(0, 0, 0, 0.24),
      inset 0 1px 0 rgba(255,255,255,0.04);
  }

  .ma-pipeline-preview::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.82), transparent 90%);
    pointer-events: none;
  }

  .ma-pipeline-preview-inner {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(360px, 0.85fr);
    gap: 28px;
    align-items: stretch;
  }

  .ma-pipeline-preview h2 {
    margin: 0;
    font-size: clamp(28px, 3vw, 42px);
    line-height: 1.02;
    letter-spacing: -0.06em;
  }

  .ma-pipeline-preview p {
    max-width: 820px;
    margin: 15px 0 0;
    line-height: 1.7;
  }

  .ma-pipeline-preview-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 26px;
  }

  .ma-pipeline-preview-metrics {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .ma-pipeline-preview-metric {
    min-height: 132px;
    border-radius: 24px;
    padding: 20px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.066), rgba(255,255,255,0.026)),
      rgba(2, 6, 23, 0.2);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .ma-pipeline-preview-metric strong {
    display: block;
    margin-top: 9px;
    font-size: 24px;
    line-height: 1.08;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .ma-workflow-card {
    padding: 27px;
    display: grid;
    grid-template-columns: 48px minmax(0, 1fr) 42px;
    gap: 21px;
    align-items: center;
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .ma-workflow-card:hover {
    transform: translateY(-3px);
    border-color: rgba(96, 165, 250, 0.27);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.032)),
      rgba(15, 23, 42, 0.79);
  }

  .ma-step-number {
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

  .ma-workflow-card strong {
    display: block;
    margin-bottom: 8px;
  }

  .ma-workflow-card p {
    margin: 0;
    line-height: 1.62;
  }

  .ma-arrow-link {
    width: 42px;
    height: 42px;
    border-radius: 17px;
    display: grid;
    place-items: center;
    color: inherit;
    text-decoration: none;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition:
      transform .16s ease,
      background .16s ease;
  }

  .ma-arrow-link:hover {
    transform: translateX(3px);
    background: rgba(255, 255, 255, 0.075);
  }

  .ma-panel {
    padding: 31px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .ma-panel-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .ma-panel-title {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .ma-panel-description {
    margin: 11px 0 0;
    line-height: 1.66;
  }

  .ma-panel-icon {
    flex: 0 0 auto;
    width: 46px;
    height: 46px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    background: rgba(255, 255, 255, 0.048);
    border: 1px solid rgba(255, 255, 255, 0.085);
  }

  .ma-glass-block {
    border-radius: 25px;
    padding: 25px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.066), rgba(255,255,255,0.026));
    border: 1px solid rgba(255,255,255,0.092);
  }

  .ma-latest-grid,
  .ma-summary-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    margin-top: 20px;
  }

  .ma-mini-metric {
    padding: 18px;
    border-radius: 20px;
    background: rgba(255,255,255,0.038);
    border: 1px solid rgba(255,255,255,0.075);
  }

  .ma-mini-metric strong {
    display: block;
    margin-top: 8px;
    overflow-wrap: anywhere;
  }

  .ma-action-row {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: center;
    margin-top: 22px;
  }

  .ma-summary-card {
    padding: 31px;
  }

  .ma-summary-card h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .ma-summary-card p {
    margin: 11px 0 0;
    line-height: 1.66;
  }

  .ma-muted-tight {
    margin-bottom: 0;
  }


  /* M&A DASHBOARD · PREMIUM DEAL GLASS SYSTEM */
  .ma-executive-page {
    --ma-branch-a: 16, 185, 129;
    --ma-branch-b: 37, 99, 235;
    --ma-branch-c: 167, 243, 208;
    --ma-branch-glow: 16, 185, 129;
  }

  .ma-hero,
  .ma-signal-card,
  .ma-kpi-card,
  .ma-bridge-panel,
  .ma-pipeline-preview,
  .ma-pipeline-preview-metric,
  .ma-workflow-card,
  .ma-panel,
  .ma-summary-card,
  .ma-glass-block,
  .ma-mini-metric,
  .ma-command-item,
  .ma-bridge-step {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    border-color: rgba(255,255,255,0.026) !important;
    background:
      radial-gradient(circle at 0% 0%, rgba(var(--ma-branch-a), 0.150), transparent 36%),
      radial-gradient(circle at 100% 8%, rgba(var(--ma-branch-b), 0.105), transparent 42%),
      linear-gradient(
        115deg,
        rgba(var(--ma-branch-a), 0.090) 0%,
        rgba(255,255,255,0.016) 44%,
        rgba(var(--ma-branch-b), 0.066) 100%
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

  .ma-hero::before,
  .ma-signal-card::before,
  .ma-kpi-card::before,
  .ma-bridge-panel::before,
  .ma-pipeline-preview::before,
  .ma-pipeline-preview-metric::before,
  .ma-workflow-card::before,
  .ma-panel::before,
  .ma-summary-card::before,
  .ma-glass-block::before,
  .ma-mini-metric::before,
  .ma-command-item::before,
  .ma-bridge-step::before {
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
    opacity: 0.70;
    mix-blend-mode: screen;
  }

  .ma-hero::after,
  .ma-signal-card::after,
  .ma-kpi-card::after,
  .ma-bridge-panel::after,
  .ma-pipeline-preview::after,
  .ma-pipeline-preview-metric::after,
  .ma-workflow-card::after,
  .ma-panel::after,
  .ma-summary-card::after,
  .ma-glass-block::after,
  .ma-mini-metric::after,
  .ma-command-item::after,
  .ma-bridge-step::after {
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
    opacity: 0.38;
  }

  .ma-hero > *,
  .ma-signal-card > *,
  .ma-kpi-card > *,
  .ma-bridge-panel > *,
  .ma-pipeline-preview > *,
  .ma-pipeline-preview-metric > *,
  .ma-workflow-card > *,
  .ma-panel > *,
  .ma-summary-card > *,
  .ma-glass-block > *,
  .ma-mini-metric > *,
  .ma-command-item > *,
  .ma-bridge-step > * {
    position: relative;
    z-index: 1;
  }

  .ma-kpi-card:hover,
  .ma-workflow-card:hover,
  .ma-panel:hover,
  .ma-summary-card:hover,
  .ma-pipeline-preview-metric:hover,
  .ma-mini-metric:hover,
  .ma-command-item:hover,
  .ma-bridge-step:hover {
    transform: translateY(-3px);
    border-color: rgba(var(--ma-branch-c), 0.18) !important;
    box-shadow:
      0 34px 96px rgba(0, 0, 0, 0.36),
      0 0 54px rgba(var(--ma-branch-glow), 0.170),
      inset 0 1px 0 rgba(255,255,255,0.080),
      inset 1px 0 0 rgba(var(--ma-branch-a), 0.105),
      inset -1px 0 0 rgba(var(--ma-branch-b), 0.085) !important;
  }

  .ma-grid {
    gap: clamp(28px, 2vw, 36px);
  }

  .ma-section {
    gap: 30px;
  }

  .ma-card-icon,
  .ma-panel-icon,
  .ma-icon-box,
  .ma-step-number,
  .ma-arrow-link {
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

  .ma-link,
  .ma-hero-actions a,
  .ma-action-row a {
    position: relative;
    z-index: 2;
  }

  .ma-score-module {
    background:
      radial-gradient(circle at 0% 0%, rgba(var(--ma-branch-a), 0.120), transparent 34%),
      radial-gradient(circle at 100% 0%, rgba(var(--ma-branch-b), 0.075), transparent 38%),
      rgba(255,255,255,0.030) !important;
    border-color: rgba(255,255,255,0.052) !important;
    backdrop-filter: blur(16px) saturate(132%);
    -webkit-backdrop-filter: blur(16px) saturate(132%);
  }

  .ma-score-ring {
    background:
      conic-gradient(
        rgba(var(--ma-branch-a), 0.98) var(--score-angle),
        rgba(255,255,255,0.09) 0deg
      ) !important;
    box-shadow:
      0 18px 40px rgba(0, 0, 0, 0.28),
      0 0 34px rgba(var(--ma-branch-glow), 0.18) !important;
  }

  .ma-kicker,
  .ma-kpi-value,
  .ma-pipeline-preview-metric strong,
  .ma-mini-metric strong {
    text-shadow:
      0 0 12px rgba(var(--ma-branch-glow), 0.12);
  }

  .ma-signal-row,
  .ma-mini-metric,
  .ma-glass-block,
  .ma-bridge-step {
    border-color: rgba(255,255,255,0.070) !important;
  }

  .ma-signal-row {
    border-top-color: rgba(var(--ma-branch-a), 0.110) !important;
  }

  .ma-mini-metric,
  .ma-bridge-step,
  .ma-pipeline-preview-metric {
    transition:
      transform .18s ease,
      box-shadow .22s ease,
      border-color .22s ease,
      filter .22s ease;
  }

  .ma-mini-metric:hover,
  .ma-bridge-step:hover,
  .ma-pipeline-preview-metric:hover {
    filter: brightness(1.035) saturate(1.04);
  }

  .ma-executive-page :is(
    .ma-hero,
    .ma-command-item,
    .ma-signal-card,
    .ma-kpi-card,
    .ma-module-card,
    .ma-mini-metric,
    .ma-glass-block,
    .ma-bridge-step,
    .ma-pipeline-preview,
    .ma-pipeline-preview-metric,
    .ma-score-module,
    .ma-panel,
    .card,
    .panel
  ) {
    background: rgba(15, 23, 42, 0.72) !important;
    background-image: none !important;
    border-color: rgba(148, 163, 184, 0.14) !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    filter: none !important;
    transform: none !important;
  }

  .ma-executive-page :is(
    .ma-hero,
    .ma-command-item,
    .ma-signal-card,
    .ma-kpi-card,
    .ma-module-card,
    .ma-mini-metric,
    .ma-glass-block,
    .ma-bridge-step,
    .ma-pipeline-preview,
    .ma-pipeline-preview-metric,
    .ma-score-module
  )::before,
  .ma-executive-page :is(
    .ma-hero,
    .ma-command-item,
    .ma-signal-card,
    .ma-kpi-card,
    .ma-module-card,
    .ma-mini-metric,
    .ma-glass-block,
    .ma-bridge-step,
    .ma-pipeline-preview,
    .ma-pipeline-preview-metric,
    .ma-score-module
  )::after {
    content: none !important;
    display: none !important;
  }

  .ma-executive-page :is(
    .ma-hero-layout,
    .ma-grid-kpis,
    .ma-grid-two,
    .ma-bridge-grid,
    .ma-latest-grid,
    .ma-summary-grid,
    .ma-pipeline-preview-inner,
    .ma-pipeline-preview-metrics
  ) {
    background: transparent !important;
    background-image: none !important;
    border-color: transparent !important;
    box-shadow: none !important;
  }

  .ma-executive-page :is(
    .ma-title,
    .ma-kicker,
    .ma-kpi-value,
    .ma-pipeline-preview-metric strong,
    .ma-mini-metric strong,
    .kpi-label
  ) {
    letter-spacing: 0 !important;
    text-shadow: none !important;
  }

  @media (max-width: 1180px) {
    .ma-hero-layout,
    .ma-pipeline-preview-inner {
      grid-template-columns: 1fr;
    }

    .ma-grid-kpis,
    .ma-bridge-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 920px) {
    .ma-grid-two,
    .ma-command-bar {
      grid-template-columns: 1fr;
    }

    .ma-section-header {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (max-width: 680px) {
    .ma-executive-page {
      gap: 28px;
    }

    .ma-hero,
    .ma-pipeline-preview {
      padding: 26px;
      border-radius: 28px;
    }

    .ma-grid-kpis,
    .ma-bridge-grid,
    .ma-latest-grid,
    .ma-summary-grid,
    .ma-pipeline-preview-metrics {
      grid-template-columns: 1fr;
    }

    .ma-kpi-card,
    .ma-panel,
    .ma-workflow-card,
    .ma-summary-card {
      border-radius: 24px;
    }

    .ma-score-module {
      grid-template-columns: 1fr;
    }

    .ma-signal-row {
      grid-template-columns: 1fr;
      gap: 7px;
    }

    .ma-signal-row strong {
      text-align: left;
    }

    .ma-workflow-card {
      grid-template-columns: 48px minmax(0, 1fr);
    }

    .ma-arrow-link {
      display: none;
    }
  }
`;

export function MADashboardPage() {
  const { can, isViewer } = useAuth();
  const { financials, settings, savedCases } = useMAStore();

  const canEditCases = can(PERMISSIONS.UPDATE_MA_CASE);
  const canExportReports = can(PERMISSIONS.CREATE_MA_REPORT);

  const derived = useValuationEngine({
    financials,
    settings
  });

  const safeSavedCases = Array.isArray(savedCases) ? savedCases : [];
  const latestCase = safeSavedCases[0] || null;
  const reportCurrency = settings?.reportCurrency || financials?.currency || 'EUR';

  const hasDealData = hasSufficientDealData(financials, derived);
  const activeCompanyName = financials?.name?.trim() || 'Sin caso activo';
  const qualityScore = hasDealData ? getSafeQualityScore(derived.qualityScore) : null;
  const scoreAngle = `${(qualityScore ?? 0) * 3.6}deg`;

  const equityBase =
    hasDealData && Number.isFinite(Number(derived.equityBase))
      ? Number(derived.equityBase)
      : 0;

  const adjustedMultiple =
    hasDealData && Number.isFinite(Number(derived.adjustedMultiple))
      ? Number(derived.adjustedMultiple).toFixed(2)
      : 'N/A';

  const netDebt =
    hasDealData && Number.isFinite(Number(derived.netDebt))
      ? Number(derived.netDebt)
      : 0;

  const equityLabel = hasDealData
    ? formatCurrency(equityBase, reportCurrency)
    : 'N/A';

  const netDebtLabel = hasDealData
    ? formatCurrency(netDebt, reportCurrency)
    : 'N/A';

  const latestEquityLabel = latestCase?.snapshot?.equityBase
    ? formatCurrency(latestCase.snapshot.equityBase, reportCurrency)
    : 'N/A';

  const qualitySignal = getQualitySignal(qualityScore);

  const pipelineDealCount = getPipelineDealCount({
    hasDealData,
    savedCases: safeSavedCases
  });

  const pipelineValueLabel = getPipelineValueLabel({
    hasDealData,
    activeEquityValue: equityBase,
    savedCases: safeSavedCases,
    currency: reportCurrency
  });

  const pipelineStatus = pipelineDealCount > 0 ? 'Activo' : 'Pendiente';
  const pipelinePriority =
    qualityScore !== null && qualityScore >= 80
      ? 'High'
      : qualityScore !== null && qualityScore >= 55
        ? 'Review'
        : pipelineDealCount > 0
          ? 'Watchlist'
          : 'N/A';

  return (
    <div className="page">
      <style>{maDashboardCss}</style>

      <div className="ma-executive-page">
        <section className="ma-hero">
          <div className="ma-hero-layout">
            <div>
              <div className="ma-eyebrow-row">
                <Badge>M&A Intelligence</Badge>
                <Badge>Executive Command Center</Badge>
                {isViewer ? <Badge>Modo solo lectura</Badge> : null}
                {canEditCases ? <Badge>Edición permitida</Badge> : null}
                {canExportReports ? <Badge>Exportación permitida</Badge> : null}
              </div>

              <h1 className="ma-title">
                Private M&A Intelligence.
                <span>Built for high-stakes deal decisions.</span>
              </h1>

              <p className="ma-hero-copy">
                Pantalla de mando para revisar el estado del caso activo,
                acceder a los módulos principales y mantener continuidad entre
                valoración, pipeline, waterfall, reporting y repositorio de
                deals.
              </p>

              <div className="ma-hero-actions">
                <Link to="/ma/valuation">
                  <Button>
                    <BarChart3 size={16} />
                    {isViewer
                      ? 'Ver valoración'
                      : 'Abrir valoración'}
                  </Button>
                </Link>

                <Link to="/ma/pipeline">
                  <Button variant="secondary">
                    <Layers3 size={16} />
                    Ver Deal Pipeline
                  </Button>
                </Link>

                <Link to="/ma/waterfall">
                  <Button variant="secondary">
                    <TrendingUp size={16} />
                    Ver Waterfall
                  </Button>
                </Link>

                <Link to="/ma/cim">
                  <Button variant="secondary">
                    <FileText size={16} />
                    Ver CIM / Report
                  </Button>
                </Link>
              </div>

              <div className="ma-command-bar">
                <CommandItem
                  label="Workspace"
                  value="Private M&A Intelligence"
                />

                <CommandItem
                label="Operating model"
                value="Value · Pipeline · Structure · Report"
                />

                <CommandItem
                  label="Data posture"
                  value="Organization-scoped"
                />
              </div>
            </div>

            <aside className="ma-signal-card">
              <div className="ma-signal-inner">
                <div className="ma-signal-top">
                  <div>
                    <div className="kpi-label">Executive Signal</div>
                    <div className="ma-signal-title">
                      {qualitySignal.title}
                    </div>
                  </div>

                  <div className="ma-icon-box">
                    <Sparkles size={21} />
                  </div>
                </div>

                <div className="ma-score-module">
                  <div
                    className="ma-score-ring"
                    style={{ '--score-angle': scoreAngle }}
                  >
                    <div className="ma-score-core">
                      <strong className={qualityScore === null ? 'is-empty-score' : ''}>
                        {qualityScore === null ? '—' : qualityScore}
                      </strong>
                    </div>
                  </div>

                  <div className="ma-score-copy">
                    <strong>{qualitySignal.posture}</strong>

                    <p className="muted">
                      {qualitySignal.description}
                    </p>
                  </div>
                </div>

                <div className="ma-signal-table">
                  <SignalRow label="Active target" value={activeCompanyName} />

                  <SignalRow
                    label="Equity base"
                    value={equityLabel}
                  />

                  <SignalRow
                    label="Quality score"
                    value={qualityScore === null ? 'N/A' : `${qualityScore}/100`}
                  />

                  <SignalRow
                    label="Decision posture"
                    value={qualitySignal.posture}
                  />
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="ma-section">
          <SectionHeader
            kicker="Executive overview"
            icon={Activity}
            title="M&A workspace at a glance"
            description="Vista ejecutiva del caso activo, valoración base, señal de calidad y continuidad del portfolio M&A."
          />

          <div className="ma-grid ma-grid-kpis">
            <KpiCard
              label="Empresa activa"
              value={activeCompanyName}
              description="Caso cargado en el workspace"
              icon={BriefcaseBusiness}
            />

            <KpiCard
              label="Equity Value"
              value={equityLabel}
              description="Resumen del valor base estimado"
              icon={TrendingUp}
            />

            <KpiCard
              label="Quality Score"
              value={qualityScore === null ? 'N/A' : `${qualityScore}/100`}
              description="Calidad financiera y transferibilidad"
              icon={Activity}
            />

            <KpiCard
              label="Deals guardados"
              value={safeSavedCases.length}
              description="Histórico disponible"
              icon={FileSearch}
            />
          </div>
        </section>

        <section className="ma-bridge-panel">
          <SectionHeader
            kicker="Operating system logic"
            icon={Target}
            title="Executive deal operating model"
            description="Un marco compacto para valorar, priorizar, estructurar y documentar decisiones M&A con disciplina de comité."
          />

          <div className="ma-bridge-grid">
            <BridgeStep
              number="01"
              title="Value"
              text="Valoración base, sensibilidad, DCF de control y señales críticas del activo."
            />

            <BridgeStep
              number="02"
              title="Pipeline"
              text="Ordena operaciones por fase, prioridad, valor potencial, riesgo y responsable."
            />

            <BridgeStep
              number="03"
              title="Structure"
              text="Revisa deuda, caja, equity value, net proceeds y waterfall económico."
            />

            <BridgeStep
              number="04"
              title="Report"
              text="Convierte el análisis en narrativa ejecutiva, CIM y material exportable."
            />
          </div>
        </section>

        <section className="ma-pipeline-preview">
          <div className="ma-pipeline-preview-inner">
            <div>
              <div className="ma-kicker">
                <Layers3 size={14} />
                Enterprise Deal Pipeline
              </div>

              <h2>M&A Deal Pipeline</h2>

              <p className="muted">
                Pipeline privado para gobernar fases, owner, prioridad, riesgo,
                valor potencial y foco ejecutivo de cada oportunidad.
              </p>

              <div className="ma-pipeline-preview-actions">
                <Link to="/ma/pipeline">
                  <Button>
                    <Layers3 size={16} />
                    Abrir pipeline completo
                  </Button>
                </Link>

                <Link to="/ma/deals">
                  <Button variant="secondary">
                    <BriefcaseBusiness size={16} />
                    Ver repositorio
                  </Button>
                </Link>
              </div>
            </div>

            <div className="ma-pipeline-preview-metrics">
              <PipelinePreviewMetric
                label="Deals tracked"
                value={pipelineDealCount}
              />

              <PipelinePreviewMetric
                label="Pipeline value"
                value={pipelineValueLabel}
              />

              <PipelinePreviewMetric
                label="Pipeline status"
                value={pipelineStatus}
              />

              <PipelinePreviewMetric
                label="Priority"
                value={pipelinePriority}
              />
            </div>
          </div>
        </section>

        <section className="ma-section">
          <SectionHeader
            kicker="Execution path"
            icon={Target}
            title="Decision workbench"
            description="Accesos directos a las vistas críticas del ciclo M&A."
          />

          <div className="ma-grid ma-grid-two">
            <WorkflowCard
              number="01"
              title="Valuation"
              description="Valor base, rango, sensibilidad, DCF de control y calidad del activo."
              to="/ma/valuation"
            />

            <WorkflowCard
              number="02"
              title="Deal Pipeline"
              description="Gobierna fases, prioridad, valor, riesgo, owner y foco ejecutivo."
              to="/ma/pipeline"
            />

            <WorkflowCard
              number="03"
              title="Deal Waterfall"
              description="Analiza Enterprise Value, deuda neta, Equity Value, proceeds y reparto económico."
              to="/ma/waterfall"
            />

            <WorkflowCard
              number="04"
              title="CIM / Executive Report"
              description="Prepara narrativa ejecutiva, tesis, riesgos y material para inversores o comité."
              to="/ma/cim"
            />

            <WorkflowCard
              number="05"
              title="Buyer Matching"
              description="Revisa encaje de compradores estratégicos, financieros y capital paciente."
              to="/ma/matching"
            />

            <WorkflowCard
              number="06"
              title="Deals Repository"
              description="Recupera casos guardados, consulta snapshots y conserva el histórico M&A."
              to="/ma/deals"
            />
          </div>
        </section>

        <section className="ma-grid ma-grid-two">
          <section className="ma-summary-card">
            <div className="ma-panel-header">
              <div>
                <div className="ma-kicker">
                  <BarChart3 size={14} />
                  Active case summary
                </div>

                <h3>Current deal snapshot</h3>

                <p className="muted">
                  Lectura compacta del caso activo con acceso directo a
                  valoración, pipeline y waterfall.
                </p>
              </div>

              <div className="ma-panel-icon">
                <TrendingUp size={18} />
              </div>
            </div>

            <div className="ma-summary-grid">
              <MiniMetric label="Target" value={activeCompanyName} />
              <MiniMetric label="Equity base" value={equityLabel} />
              <MiniMetric label="Net debt" value={netDebtLabel} />
              <MiniMetric label="Multiple" value={adjustedMultiple === 'N/A' ? 'N/A' : `x${adjustedMultiple}`} />
            </div>

            <div className="ma-action-row">
              <Link to="/ma/valuation">
                <Button variant="secondary">
                  <BarChart3 size={16} />
                  Revisar valoración
                </Button>
              </Link>

              <Link to="/ma/pipeline">
                <Button variant="secondary">
                  <Layers3 size={16} />
                  Revisar pipeline
                </Button>
              </Link>

              <Link to="/ma/waterfall">
                <Button variant="secondary">
                  <TrendingUp size={16} />
                  Revisar waterfall
                </Button>
              </Link>
            </div>
          </section>

          <section className="ma-panel">
            <PanelHeader
              kicker="Decision discipline"
              icon={ShieldCheck}
              title="Recommended Next Step"
              description="Siguiente acción sugerida según el estado actual del caso y del repositorio."
            />

            <div className="ma-glass-block">
              <strong>{getRecommendedAction(qualityScore, latestCase)}</strong>

              <p className="muted" style={{ marginTop: 10 }}>
                Prioriza la siguiente decisión con base en calidad del activo,
                evidencia disponible y estado del repositorio.
              </p>

              <div className="ma-action-row">
                <Link to="/ma/valuation">
                  <Button variant="secondary">
                    <BarChart3 size={16} />
                    Valuation
                  </Button>
                </Link>

                <Link to="/ma/pipeline">
                  <Button variant="secondary">
                    <Layers3 size={16} />
                    Deal Pipeline
                  </Button>
                </Link>

                <Link to="/ma/cim">
                  <Button variant="secondary">
                    <FileText size={16} />
                    Preparar report
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </section>

        <section className="ma-grid ma-grid-two">
          <section className="ma-panel">
            <PanelHeader
              kicker="Private repository"
              icon={LockKeyhole}
              title="Saved Deal Snapshot"
              description="Último caso guardado en el repositorio privado de M&A."
            />

            {latestCase ? (
              <div>
                <div className="ma-glass-block">
                  <div className="ma-panel-header">
                    <div>
                      <strong>{latestCase.name}</strong>

                      <p className="muted ma-muted-tight" style={{ marginTop: 10 }}>
                        Último snapshot disponible para continuidad de análisis.
                      </p>
                    </div>

                    <div className="ma-panel-icon">
                      <CheckCircle2 size={18} />
                    </div>
                  </div>

                  <div className="ma-latest-grid">
                    <MiniMetric label="Equity base" value={latestEquityLabel} />
                    <MiniMetric label="Repository status" value="Disponible" />
                  </div>
                </div>

                <div className="ma-action-row">
                  <Link to="/ma/deals">
                    <Button variant="secondary">
                      <BriefcaseBusiness size={16} />
                      Abrir repositorio
                    </Button>
                  </Link>

                  <Link to="/ma/pipeline">
                    <Button variant="secondary">
                      <Layers3 size={16} />
                      Ver en pipeline
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="ma-glass-block">
                <strong>Repositorio sin casos guardados</strong>

                <p className="muted" style={{ marginTop: 10 }}>
                  Guarda un caso desde valoración para construir histórico,
                  recuperar análisis y preparar una presentación completa de
                  M&A.
                </p>

                <div className="ma-action-row">
                  <Link to="/ma/valuation">
                    <Button variant="secondary">
                      <BarChart3 size={16} />
                      Crear primer caso
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </section>

          <section className="ma-summary-card">
            <div className="ma-panel-header">
              <div>
                <div className="ma-kicker">
                  <Sparkles size={14} />
                  Workspace focus
                </div>

                <h3>Clean dashboard mode</h3>

                <p className="muted">
                  Esta vista queda reservada para mando ejecutivo. La valoración
                  detallada, pipeline completo, deal structure y comparables
                  viven en sus módulos correspondientes.
                </p>
              </div>

              <div className="ma-panel-icon">
                <ShieldCheck size={18} />
              </div>
            </div>

            <div className="ma-summary-grid">
              <MiniMetric label="Valuation detail" value="Valuation" />
              <MiniMetric label="Pipeline detail" value="Deal Pipeline" />
              <MiniMetric label="Waterfall detail" value="Deal Waterfall" />
              <MiniMetric label="Report detail" value="CIM / Report" />
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}

function CommandItem({ label, value }) {
  return (
    <div className="ma-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function BridgeStep({ number, title, text }) {
  return (
    <div className="ma-bridge-step">
      <div className="kpi-label">{number}</div>
      <strong>{title}</strong>

      <p className="muted ma-muted-tight" style={{ marginTop: 8 }}>
        {text}
      </p>
    </div>
  );
}

function KpiCard({ label, value, description, icon: Icon }) {
  return (
    <article className="ma-kpi-card">
      <div className="ma-kpi-top">
        <div>
          <div className="kpi-label">{label}</div>
          <div className="ma-kpi-value">{value}</div>
        </div>

        <div className="ma-card-icon">
          <Icon size={18} />
        </div>
      </div>

      <p className="muted">{description}</p>
    </article>
  );
}

function PipelinePreviewMetric({ label, value }) {
  return (
    <div className="ma-pipeline-preview-metric">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SectionHeader({ kicker, icon: Icon, title, description }) {
  return (
    <div className="ma-section-header">
      <div>
        <div className="ma-kicker">
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
    <div className="ma-panel-header">
      <div>
        <div className="ma-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h3 className="ma-panel-title">{title}</h3>

        <p className="muted ma-panel-description">{description}</p>
      </div>

      <div className="ma-panel-icon">
        <Icon size={18} />
      </div>
    </div>
  );
}

function WorkflowCard({ number, title, description, to }) {
  return (
    <article className="ma-workflow-card">
      <div className="ma-step-number">{number}</div>

      <div>
        <strong>{title}</strong>
        <p className="muted">{description}</p>
      </div>

      <Link to={to} className="ma-arrow-link" aria-label={`Abrir ${title}`}>
        <ArrowRight size={16} />
      </Link>
    </article>
  );
}

function SignalRow({ label, value }) {
  return (
    <div className="ma-signal-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="ma-mini-metric">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function getPipelineDealCount({ hasDealData, savedCases }) {
  const savedCount = Array.isArray(savedCases) ? savedCases.length : 0;

  return savedCount + (hasDealData ? 1 : 0);
}

function getPipelineValueLabel({
  hasDealData,
  activeEquityValue,
  savedCases,
  currency
}) {
  const activeValue =
    hasDealData && Number.isFinite(Number(activeEquityValue))
      ? Number(activeEquityValue)
      : 0;

  const savedValue = Array.isArray(savedCases)
    ? savedCases.reduce((sum, item) => {
        const value = Number(item?.snapshot?.equityBase);

        return Number.isFinite(value) ? sum + value : sum;
      }, 0)
    : 0;

  const total = activeValue + savedValue;
  const hasValue = total !== 0;

  return hasValue ? formatCurrency(total, currency) : 'N/A';
}

function hasSufficientDealData(financials, derived) {
  const hasName = Boolean(financials?.name?.trim());
  const hasSector = Boolean(financials?.sector);
  const normalizedEbitda = Number(derived?.normalizedEbitda);

  return (
    hasName &&
    hasSector &&
    Number.isFinite(normalizedEbitda) &&
    normalizedEbitda > 0
  );
}

function getSafeQualityScore(score) {
  const parsed = Number(score);

  if (!Number.isFinite(parsed)) return null;

  return Math.max(0, Math.min(100, Math.round(parsed)));
}

function getQualitySignal(score) {
  if (score === null) {
    return {
      title: 'Incomplete deal picture',
      posture: 'Build case',
      description:
        'El caso necesita razón social, sector y EBITDA normalizado antes de presentar conclusiones.'
    };
  }

  if (score >= 80) {
    return {
      title: 'High-conviction opportunity',
      posture: 'Advance',
      description:
        'El deal presenta señales sólidas para avanzar a revisión profunda, manteniendo validación financiera, legal y operativa.'
    };
  }

  if (score >= 60) {
    return {
      title: 'Qualified opportunity',
      posture: 'Review',
      description:
        'El deal tiene base suficiente para análisis, aunque conviene revisar riesgos, calidad de beneficios y dependencias clave.'
    };
  }

  if (score >= 40) {
    return {
      title: 'Watchlist opportunity',
      posture: 'Validate',
      description:
        'El deal requiere validación adicional antes de avanzar. Prioriza calidad de información, riesgos y consistencia financiera.'
    };
  }

  return {
    title: 'Incomplete deal picture',
    posture: 'Build case',
    description:
      'El caso necesita información financiera suficiente antes de presentar conclusiones.'
  };
}

function getRecommendedAction(score, latestCase) {
  if (score === null) {
    return 'Cerrar los datos mínimos del caso antes de interpretar el score ejecutivo.';
  }

  if (!latestCase) {
    return 'Crear y guardar un primer caso para construir histórico de análisis.';
  }

  if (score >= 70) {
    return 'Preparar CIM / Executive Report y revisar el caso para presentación.';
  }

  if (score >= 45) {
    return 'Cerrar inputs críticos y validar riesgos antes de exportar conclusiones.';
  }

  return 'Reforzar datos financieros antes de avanzar a valoración o reporte.';
}

export default MADashboardPage;
