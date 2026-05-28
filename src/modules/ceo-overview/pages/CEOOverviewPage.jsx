import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Download,
  FileText,
  Gauge,
  Gem,
  Layers3,
  LockKeyhole,
  Network,
  Rocket,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Radar
} from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { useAuth } from '../../../app/providers/AuthProvider.jsx';
import { useMAStore } from '../../ma/store/maStore.jsx';
import { useComplianceStore } from '../../compliance/store/complianceStore.js';
import { useComplianceEngine } from '../../compliance/engine/useComplianceEngine.js';
import { useFundingStore } from '../../funding/store/fundingStore.jsx';
import { useFundingEngine } from '../../funding/engine/useFundingEngine.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import { maCasesApi } from '../../ma/services/maCasesApi.js';
import { complianceAuditApi } from '../../compliance/services/complianceAuditApi.js';
import { fundingEnterpriseApi } from '../../funding/services/fundingEnterpriseApi.js';
import { pmiApi } from '../../pmi/services/pmiApi.js';
import { ecosystemApi } from '../../ecosystem/services/ecosystemApi.js';
import { bridgeApi } from '../../bridge/services/bridgeApi.js';
import { riskApi } from '../../risk/services/riskApi.js';
import { strategyApi } from '../../strategy/services/strategyApi.js';
import { executiveApi } from '../services/executiveApi.js';
import {
  buildInsufficientFallbackModuleCards,
  buildRadarAxis,
  estimateMaFinancialRadar,
  formatExecutiveScoreNumber,
  formatModuleScoreDisplay,
  formatModuleSignalValue,
  formatScoreLabel,
  mapExecutiveCorporateRadarAxis,
  getComplianceOverview,
  getEcosystemBranchOverview,
  getExecutiveSignal,
  getMAOverview,
  getRiskOverview,
  normalizeScoreOrNull,
  resolveLegalHealthRadarScore
} from '../utils/ceoOverviewTruthfulness.js';
import { boardPackApi } from '../services/boardPackApi.js';
import { BoardPackModal } from '../components/BoardPackModal.jsx';
import { CorporateHealthRadar } from '../components/CorporateHealthRadar.jsx';
import { ReadinessIndexCard } from '../components/ReadinessIndexCard.jsx';
import { ExecutiveSignalFeed } from '../components/ExecutiveSignalFeed.jsx';
import { DecisionQueuePanel } from '../components/DecisionQueuePanel.jsx';
import { BoardViewSnapshot } from '../components/BoardViewSnapshot.jsx';
import { ExecutiveModuleCard } from '../components/ExecutiveModuleCard.jsx';
import { ExecutiveAlertsPanel } from '../components/ExecutiveAlertsPanel.jsx';
import { ExecutiveCalendarPanel } from '../components/ExecutiveCalendarPanel.jsx';
import { FundingExecutiveWidget } from '../../funding/components/FundingExecutiveWidget.jsx';
import {
  getDisplayText,
  getOptimalFundingWindowLabel,
  getRunwayStatusLabel
} from '../../funding/utils/fundingExecutiveMetrics.js';

const ceoOverviewCss = `
  .ceo-overview-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 38px;
  }

  .ceo-hero {
    position: relative;
    overflow: hidden;
    min-height: 0;
    border-radius: 32px;
    padding: 36px 38px 40px;
    border: 1px solid rgba(148, 163, 184, 0.14);
    background:
      radial-gradient(circle at 8% 2%, rgba(212, 175, 55, 0.1), transparent 32%),
      radial-gradient(circle at 88% 8%, rgba(16, 185, 129, 0.08), transparent 28%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.99), rgba(15, 23, 42, 0.97));
    box-shadow:
      0 24px 72px rgba(0, 0, 0, 0.34),
      inset 0 1px 0 rgba(255, 255, 255, 0.04);
  }

  .ceo-hero::before {
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

  .ceo-hero::after {
    content: "";
    position: absolute;
    inset: auto -120px -140px auto;
    width: 360px;
    height: 360px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.08), transparent 70%);
    pointer-events: none;
    opacity: 0.65;
  }

  .ceo-hero-layout {
    position: relative;
    z-index: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.92fr);
    align-items: start;
    gap: 38px;
    align-items: center;
  }

  .ceo-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 26px;
  }

  .ceo-title {
    margin: 0;
    max-width: 900px;
    font-size: clamp(40px, 4.8vw, 68px);
    line-height: 0.94;
    letter-spacing: -0.075em;
  }

  .ceo-title span {
    display: block;
    margin-top: 9px;
    color: rgba(226, 232, 240, 0.7);
  }

  .ceo-copy {
    max-width: 850px;
    margin: 28px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .ceo-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .ceo-command-item {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.078);
    min-width: 0;
  }

  .ceo-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .ceo-hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: center;
    margin-top: 28px;
  }

  .ceo-report-trace {
    display: inline-flex;
    align-items: center;
    min-height: 40px;
    padding: 9px 12px;
    border-radius: 999px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(226, 232, 240, 0.82);
    font-size: 12px;
    font-weight: 760;
  }

  .ceo-signal-card {
    position: relative;
    width: 100%;
    max-width: 460px;
    justify-self: end;
    border-radius: 24px;
    padding: 22px;
    background: rgba(15, 23, 42, 0.52);
    border: 1px solid rgba(148, 163, 184, 0.14);
    backdrop-filter: none;
    box-shadow: none;
    overflow: hidden;
  }

  .ceo-signal-card::before {
    display: none;
    content: none;
  }

  .ceo-signal-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .ceo-signal-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .ceo-icon-box,
  .ceo-card-icon,
  .ceo-panel-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .ceo-icon-box {
    width: 50px;
    height: 50px;
  }

  .ceo-card-icon,
  .ceo-panel-icon {
    width: 46px;
    height: 46px;
  }

  .ceo-signal-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.16;
    letter-spacing: -0.04em;
  }

  .ceo-score-module {
    display: grid;
    grid-template-columns: 104px minmax(0, 1fr);
    gap: 18px;
    align-items: center;
    padding: 18px;
    border-radius: 26px;
    background: rgba(255,255,255,0.047);
    border: 1px solid rgba(255,255,255,0.085);
  }

  .ceo-score-ring {
    width: 96px;
    height: 96px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background:
      conic-gradient(rgba(16, 185, 129, 0.96) var(--score-angle), rgba(255,255,255,0.09) 0deg);
    box-shadow:
      0 18px 40px rgba(0, 0, 0, 0.28),
      0 0 34px rgba(16, 185, 129, 0.16);
  }

  .ceo-score-core {
    width: 72px;
    height: 72px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.97);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .ceo-score-core strong {
    font-size: 23px;
    letter-spacing: -0.055em;
  }

  .ceo-score-copy strong {
    display: block;
    margin-bottom: 8px;
  }

  .ceo-score-copy p {
    margin: 0;
    line-height: 1.58;
  }

  .ceo-signal-table {
    display: grid;
    border-radius: 18px;
    border: 1px solid rgba(148, 163, 184, 0.1);
    background: rgba(255, 255, 255, 0.02);
    padding: 4px 14px;
  }

  .ceo-signal-row {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: 14px;
    align-items: center;
    padding: 12px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }

  .ceo-signal-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .ceo-section {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .ceo-section-header {
    display: flex;
    justify-content: space-between;
    gap: 28px;
    align-items: flex-end;
  }

  .ceo-kicker {
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

  .ceo-section-header h2,
  .ceo-section-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .ceo-section-header p {
    max-width: 820px;
    margin: 11px 0 0;
    line-height: 1.68;
  }

  .ceo-grid {
    display: grid;
    gap: 26px;
    align-items: stretch;
  }

  .ceo-grid-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .ceo-grid-three {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .ceo-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .executive-command-layer {
    display: grid;
    grid-template-columns: minmax(320px, 0.86fr) minmax(0, 1.14fr);
    gap: 18px;
    align-items: stretch;
  }

  .executive-command-stack {
    display: grid;
    gap: 18px;
  }

  .executive-command-card,
  .executive-module-card {
    border-radius: 20px;
    border: 1px solid rgba(148, 163, 184, 0.12);
    background: rgba(15, 23, 42, 0.48);
    box-shadow: none;
    padding: 20px 22px;
    min-width: 0;
  }

  .executive-command-card h3,
  .executive-module-card h4 {
    margin: 6px 0 0;
    letter-spacing: -0.025em;
  }

  .executive-command-card p,
  .executive-module-card p {
    color: rgba(203, 213, 225, 0.74);
    line-height: 1.55;
    margin: 10px 0 0;
  }

  .executive-eyebrow {
    color: rgba(148, 163, 184, 0.86);
    font-size: 11px;
    font-weight: 780;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  .executive-progress {
    height: 9px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.9);
    overflow: hidden;
    margin: 16px 0 10px;
  }

  .executive-progress span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #22c55e, #38bdf8);
  }

  .executive-radar-panel {
    display: grid;
    grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
    gap: 18px;
    align-items: center;
  }

  .executive-radar-panel svg {
    width: 100%;
    max-width: 280px;
  }

  .executive-radar-grid,
  .executive-radar-axis {
    fill: none;
    stroke: rgba(148, 163, 184, 0.25);
    stroke-width: 1;
  }

  .executive-radar-fill {
    fill: rgba(56, 189, 248, 0.22);
    stroke: rgba(56, 189, 248, 0.92);
    stroke-width: 2;
  }

  .executive-radar-list {
    display: grid;
    gap: 8px;
  }

  .executive-radar-list a,
  .executive-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    padding: 11px 0;
    border-bottom: 1px solid rgba(148, 163, 184, 0.12);
  }

  .executive-radar-list a {
    color: inherit;
    text-decoration: none;
  }

  .executive-list {
    display: grid;
    gap: 2px;
    margin-top: 14px;
  }

  .executive-row p {
    margin: 4px 0 0;
    font-size: 12px;
  }

  .executive-badge {
    flex: 0 0 auto;
    border-radius: 999px;
    padding: 6px 9px;
    border: 1px solid rgba(148, 163, 184, 0.2);
    background: rgba(148, 163, 184, 0.1);
    color: rgba(226, 232, 240, 0.9);
    font-size: 11px;
    font-weight: 760;
  }

  .executive-critical,
  .executive-blocked,
  .executive-risk {
    border-color: rgba(248, 113, 113, 0.36);
    background: rgba(127, 29, 29, 0.22);
    color: #fecaca;
  }

  .executive-normal,
  .executive-available {
    border-color: rgba(34, 197, 94, 0.32);
    background: rgba(20, 83, 45, 0.18);
    color: #bbf7d0;
  }

  .executive-insufficient_data,
  .executive-not_available {
    border-color: rgba(148, 163, 184, 0.24);
    background: rgba(71, 85, 105, 0.16);
  }

  .executive-snapshot-grid,
  .executive-module-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-top: 16px;
  }

  .executive-snapshot-grid div {
    padding: 13px;
    border-radius: 16px;
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.07);
  }

  .executive-snapshot-grid span {
    display: block;
    color: rgba(148, 163, 184, 0.88);
    font-size: 11px;
  }

  .executive-snapshot-grid strong {
    display: block;
    margin-top: 6px;
    overflow-wrap: anywhere;
  }

  .executive-module-card {
    display: grid;
    gap: 10px;
  }

  .executive-module-card > strong {
    font-size: 25px;
  }

  .executive-module-card a {
    color: #93c5fd;
    font-weight: 760;
    text-decoration: none;
  }

  .ceo-kpi-card,
  .ceo-panel,
  .ceo-module-card,
  .ceo-action-card {
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

  .ceo-kpi-card {
    min-height: 188px;
    padding: 27px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 22px;
  }

  .ceo-kpi-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .ceo-kpi-value {
    margin-top: 12px;
    font-size: 25px;
    font-weight: 790;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .ceo-kpi-card p {
    margin: 0;
    line-height: 1.56;
  }

  .ceo-module-card,
  .ceo-action-card,
  .ceo-panel {
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .ceo-module-head,
  .ceo-action-head,
  .ceo-panel-head {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-items: flex-start;
  }

  .ceo-module-title,
  .ceo-action-title,
  .ceo-panel-title {
    margin: 0;
    letter-spacing: -0.04em;
  }

  .ceo-module-copy,
  .ceo-action-copy,
  .ceo-panel-copy {
    margin: 10px 0 0;
    line-height: 1.62;
  }

  .ceo-module-metrics {
    display: grid;
    gap: 10px;
  }

  .ceo-mini-row {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 12px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.13);
  }

  .ceo-mini-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .ceo-link-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: auto;
  }

  .ceo-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    width: fit-content;
    border-radius: 999px;
    padding: 10px 13px;
    color: rgba(226, 232, 240, 0.94);
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
    text-decoration: none;
    font-size: 13px;
    font-weight: 800;
  }

  .ceo-link.secondary {
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.08);
  }

  .ceo-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .ceo-action-card {
    border-radius: 24px;
  }

  .ceo-muted-tight {
    margin-bottom: 0;
  }

  .ceo-command-item-hit {
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100%;
    border-radius: 22px;
  }

  .ceo-deal-readiness-radar-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(290px, 0.82fr);
    gap: 20px;
    margin-top: 28px;
  }

  .ceo-deal-readiness-card {
    border-radius: 24px;
    padding: 22px;
    border: 1px solid rgba(148, 163, 184, 0.12);
    background: rgba(255, 255, 255, 0.03);
    box-shadow: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    display: grid;
    gap: 14px;
  }

  .ceo-hero .ceo-deal-readiness-card::before,
  .ceo-hero .ceo-deal-readiness-card::after {
    display: none !important;
    content: none !important;
  }

  .ceo-hero.ceo-glass-branch {
    background:
      radial-gradient(circle at 8% 2%, rgba(212, 175, 55, 0.14), transparent 32%),
      radial-gradient(circle at 88% 8%, rgba(16, 185, 129, 0.12), transparent 28%),
      radial-gradient(circle at 60% 110%, rgba(245, 158, 11, 0.08), transparent 30%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.99), rgba(15, 23, 42, 0.97)) !important;
    box-shadow:
      0 38px 120px rgba(0, 0, 0, 0.42),
      inset 0 1px 0 rgba(255, 255, 255, 0.055) !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }

  .ceo-hero.ceo-glass-branch::before {
    opacity: 0.42;
  }

  .ceo-hero.ceo-glass-branch::after {
    opacity: 0.22;
  }

  .ceo-deal-score-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    align-items: stretch;
    margin-top: 6px;
  }

  .ceo-deal-pill {
    padding: 12px;
    border-radius: 18px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
  }

  .ceo-drag-bar-shell {
    position: relative;
    height: 12px;
    border-radius: 999px;
    background: rgba(255,255,255,0.09);
    margin-top: 10px;
    overflow: hidden;
  }

  .ceo-drag-fill-valuation {
    position: absolute;
    inset: 0 auto 0 0;
    border-radius: 999px;
    background: rgba(96,165,250,0.82);
    min-width: 6px;
    z-index: 1;
    box-shadow: 0 6px 20px rgba(37,99,235,0.28);
    transition: width 0.4s cubic-bezier(.4,.2,.2,1);
  }

  .ceo-drag-fill-drag {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    border-radius: 999px;
    background: repeating-linear-gradient(-45deg, rgba(245,158,11,0.6), rgba(245,158,11,0.6) 4px, rgba(239,68,68,0.45) 4px, rgba(239,68,68,0.45) 8px);
    min-width: 0;
    opacity: 0.85;
    z-index: 2;
    transition: width 0.4s cubic-bezier(.4,.2,.2,1), opacity 0.25s ease;
    pointer-events: none;
    mix-blend-mode: lighten;
  }

  .ceo-radar-card-inner {
    display: grid;
    grid-template-rows: auto minmax(0, 220px);
    gap: 10px;
  }

  .ceo-radar-legend {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 8px;
  }

  .ceo-radar-legend a {
    display: grid;
    grid-template-columns: 12px minmax(0, 1fr) auto;
    gap: 10px;
    align-items: center;
    padding: 8px 10px;
    border-radius: 14px;
    color: inherit;
    text-decoration: none;
    font-size: 12px;
    font-weight: 750;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.05);
    transition: background 0.2s ease, border-color 0.2s ease;
  }

  .ceo-radar-legend a:hover {
    border-color: rgba(96,165,250,0.28);
    background: rgba(37,99,235,0.12);
  }

  .ceo-radar-swatch {
    width: 10px;
    height: 10px;
    border-radius: 999px;
  }

  @media (max-width: 1100px) {
    .ceo-deal-readiness-radar-grid {
      grid-template-columns: 1fr;
    }

    .ceo-deal-score-row {
      grid-template-columns: 1fr;
    }
  }

  /* CEO OVERVIEW · PER-BRANCH GLASS COLOR SYSTEM */
  .ceo-branch-surface {
    --ceo-branch-a: 212, 175, 55;
    --ceo-branch-b: 16, 185, 129;
    --ceo-branch-c: 255, 245, 203;
    --ceo-branch-glow: 212, 175, 55;
  }

  .ceo-branch-surface.ceo-branch-overview {
    --ceo-branch-a: 212, 175, 55;
    --ceo-branch-b: 16, 185, 129;
    --ceo-branch-c: 255, 245, 203;
    --ceo-branch-glow: 212, 175, 55;
  }

  .ceo-branch-surface.ceo-branch-ma {
    --ceo-branch-a: 16, 185, 129;
    --ceo-branch-b: 37, 99, 235;
    --ceo-branch-c: 167, 243, 208;
    --ceo-branch-glow: 16, 185, 129;
  }

  .ceo-branch-surface.ceo-branch-compliance {
    --ceo-branch-a: 59, 130, 246;
    --ceo-branch-b: 34, 211, 238;
    --ceo-branch-c: 191, 219, 254;
    --ceo-branch-glow: 59, 130, 246;
  }

  .ceo-branch-surface.ceo-branch-funding {
    --ceo-branch-a: 245, 158, 11;
    --ceo-branch-b: 34, 197, 94;
    --ceo-branch-c: 253, 230, 138;
    --ceo-branch-glow: 245, 158, 11;
  }

  .ceo-branch-surface.ceo-branch-pmi {
    --ceo-branch-a: 168, 85, 247;
    --ceo-branch-b: 16, 185, 129;
    --ceo-branch-c: 221, 214, 254;
    --ceo-branch-glow: 168, 85, 247;
  }

  .ceo-branch-surface.ceo-branch-governance {
    --ceo-branch-a: 14, 165, 233;
    --ceo-branch-b: 99, 102, 241;
    --ceo-branch-c: 186, 230, 253;
    --ceo-branch-glow: 14, 165, 233;
  }

  .ceo-branch-surface.ceo-branch-heritage {
    --ceo-branch-a: 212, 175, 55;
    --ceo-branch-b: 190, 88, 117;
    --ceo-branch-c: 254, 240, 138;
    --ceo-branch-glow: 212, 175, 55;
  }

  .ceo-branch-surface.ceo-branch-bridge {
    --ceo-branch-a: 34, 197, 94;
    --ceo-branch-b: 34, 211, 238;
    --ceo-branch-c: 187, 247, 208;
    --ceo-branch-glow: 34, 197, 94;
  }

  .ceo-glass-branch {
    position: relative !important;
    isolation: isolate !important;
    overflow: hidden !important;
    border: 1px solid rgba(255,255,255,0.024) !important;
    background:
      radial-gradient(circle at 0% 0%, rgba(var(--ceo-branch-a), 0.155), transparent 36%),
      radial-gradient(circle at 100% 8%, rgba(var(--ceo-branch-b), 0.105), transparent 42%),
      linear-gradient(
        115deg,
        rgba(var(--ceo-branch-a), 0.090) 0%,
        rgba(255,255,255,0.016) 44%,
        rgba(var(--ceo-branch-b), 0.066) 100%
      ),
      rgba(15, 23, 42, 0.56) !important;
    box-shadow:
      0 28px 82px rgba(0, 0, 0, 0.30),
      0 0 42px rgba(var(--ceo-branch-glow), 0.130),
      inset 0 1px 0 rgba(255,255,255,0.065),
      inset 1px 0 0 rgba(var(--ceo-branch-a), 0.085),
      inset -1px 0 0 rgba(var(--ceo-branch-b), 0.070) !important;
    backdrop-filter: blur(22px) saturate(138%) !important;
    -webkit-backdrop-filter: blur(22px) saturate(138%) !important;
  }

  .ceo-glass-branch::before {
    content: "";
    position: absolute;
    inset: -30%;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(circle at 0% 10%, rgba(var(--ceo-branch-a), 0.145), transparent 34%),
      radial-gradient(circle at 100% 8%, rgba(var(--ceo-branch-b), 0.120), transparent 38%),
      radial-gradient(circle at 54% 120%, rgba(255,255,255,0.040), transparent 42%);
    filter: blur(28px);
    opacity: 0.72;
    mix-blend-mode: screen;
  }

  .ceo-glass-branch::after {
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
    opacity: 0.40;
  }

  .ceo-glass-branch > * {
    position: relative;
    z-index: 1;
  }

  .ceo-glass-branch:hover {
    border-color: rgba(var(--ceo-branch-c), 0.18) !important;
    box-shadow:
      0 34px 96px rgba(0, 0, 0, 0.36),
      0 0 54px rgba(var(--ceo-branch-glow), 0.170),
      inset 0 1px 0 rgba(255,255,255,0.080),
      inset 1px 0 0 rgba(var(--ceo-branch-a), 0.105),
      inset -1px 0 0 rgba(var(--ceo-branch-b), 0.085) !important;
  }

  .ceo-glass-branch .ceo-card-icon,
  .ceo-glass-branch .ceo-panel-icon,
  .ceo-glass-branch .ceo-icon-box {
    background:
      linear-gradient(
        135deg,
        rgba(var(--ceo-branch-a), 0.16),
        rgba(var(--ceo-branch-b), 0.09)
      ) !important;
    border-color: rgba(var(--ceo-branch-a), 0.22) !important;
    box-shadow:
      0 0 18px rgba(var(--ceo-branch-glow), 0.14),
      inset 0 1px 0 rgba(255,255,255,0.070) !important;
  }

  .ceo-glass-branch .ceo-link {
    background:
      linear-gradient(
        90deg,
        rgba(var(--ceo-branch-a), 0.145),
        rgba(var(--ceo-branch-b), 0.080)
      ) !important;
    border-color: rgba(var(--ceo-branch-a), 0.24) !important;
    box-shadow: 0 0 18px rgba(var(--ceo-branch-glow), 0.11) !important;
  }

  @media (max-width: 1180px) {
    .ceo-hero {
      min-height: auto;
      padding: 34px;
    }

    .ceo-hero-layout,
    .ceo-grid-three,
    .ceo-grid-two,
    .executive-command-layer {
      grid-template-columns: 1fr;
    }

    .ceo-signal-card {
      max-width: none;
      justify-self: stretch;
    }

    .ceo-grid-kpis {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 780px) {
    .ceo-command-bar,
    .ceo-grid-kpis,
    .executive-module-grid,
    .executive-radar-panel,
    .executive-snapshot-grid {
      grid-template-columns: 1fr;
    }

    .ceo-title {
      font-size: clamp(36px, 11vw, 54px);
    }

    .ceo-section-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .ceo-score-module {
      grid-template-columns: 1fr;
    }

    .ceo-signal-row {
      grid-template-columns: 1fr;
      gap: 7px;
    }

    .ceo-signal-row strong {
      text-align: left;
    }

  }
`;

function toNumber(value) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function getSafeArray(value) {
  return Array.isArray(value) ? value : [];
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function CorporateHealthRadarSVG({ axes }) {
  const cx = 120;
  const cy = 120;
  const rMax = 88;
  const count = axes.length || 5;
  const tau = Math.PI * 2;

  const points = axes.map((axis, index) => {
    const angle = -Math.PI / 2 + (index / count) * tau;
    const rr = Math.max(12, Math.min(100, Number(axis.value) || 0)) / 100;
    const x = cx + rMax * rr * Math.cos(angle);
    const y = cy + rMax * rr * Math.sin(angle);

    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const baseRingPoints = axes.map((_axis, index) => {
    const angle = -Math.PI / 2 + (index / count) * tau;
    const x = cx + rMax * Math.cos(angle);
    const y = cy + rMax * Math.sin(angle);

    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <svg width="100%" height="220" viewBox="0 0 240 240" aria-label="Radar corporativo ejecutivo CEO OS">
      <defs>
        <linearGradient id="radarExecutiveFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(37,99,235,0.55)" />
          <stop offset="100%" stopColor="rgba(16,185,129,0.6)" />
        </linearGradient>
      </defs>

      <polygon
        points={baseRingPoints.join(' ')}
        fill="rgba(148,163,184,0.08)"
        stroke="rgba(148,163,184,0.22)"
      />

      <polygon
        points={points.join(' ')}
        fill="url(#radarExecutiveFill)"
        stroke="rgba(226,232,240,0.55)"
        strokeWidth="2.2"
        strokeLinejoin="round"
        fillOpacity={0.32}
      />

      {axes.map((axis, index) => {
        const angle = -Math.PI / 2 + (index / count) * tau;
        const lx = cx + (rMax + 18) * Math.cos(angle);
        const ly = cy + (rMax + 18) * Math.sin(angle);

        return (
          <text
            key={axis.key}
            x={lx}
            y={ly}
            textAnchor="middle"
            fill="rgba(226,232,240,0.78)"
            fontSize="11"
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
}

function getOpenAlertsCount(alerts = []) {
  return getSafeArray(alerts).filter((alert) => {
    const status = String(alert?.status || '').toLowerCase();

    return !status || status.includes('open') || status.includes('review');
  }).length;
}

function calculateFundingReadiness(fundingInputs = {}) {
  const dataRoom = toNumber(fundingInputs.dataRoomCompletion);
  const founderMarketFit = toNumber(fundingInputs.founderMarketFit);
  const investorInterest = toNumber(fundingInputs.investorInterest);

  return clampScore((dataRoom + founderMarketFit + investorInterest) / 3);
}

function getFundingOverviewWithSummary({
  fundingInputs,
  fundingSettings,
  fundingDerived,
  fundingSummary
}) {
  const targetRaise = toNumber(fundingInputs?.targetRaise);
  const currentCash = toNumber(fundingInputs?.currentCash);
  const monthlyBurn = toNumber(fundingInputs?.monthlyBurn);
  const preMoney = toNumber(fundingInputs?.preMoneyValuation);
  const postMoney = preMoney + targetRaise;
  const readiness = clampScore(
    fundingDerived?.readinessScore ?? calculateFundingReadiness(fundingInputs)
  );
  const latestRound = fundingSummary?.latestRound || {};
  const summaryRunway = Number(fundingSummary?.projectedRunwayMonths);
  const summaryRaised = Number(
    fundingSummary?.totalAmountRaised ?? fundingSummary?.totalRaised
  );
  const summaryDilution = Number(
    fundingSummary?.estimatedDilution ??
      latestRound?.dilutionPercentage ??
      fundingSummary?.averageDilution
  );

  const runway = Math.round(
    Number.isFinite(summaryRunway)
      ? summaryRunway
      : toNumber(
          fundingDerived?.runwayAfterRaiseMonths ??
            (monthlyBurn > 0 ? (currentCash + targetRaise) / monthlyBurn : 0)
        )
  );
  const dilution = Math.round(
    Number.isFinite(summaryDilution)
      ? summaryDilution
      : toNumber(
          fundingDerived?.dilutionPct ??
            (postMoney > 0 ? (targetRaise / postMoney) * 100 : 0)
        )
  );
  const currency = fundingSettings?.reportCurrency || 'EUR';
  const effectiveRaised = Number.isFinite(summaryRaised) ? summaryRaised : targetRaise;
  const runwayStatus = getRunwayStatusLabel(
    Number.isFinite(summaryRunway) ? summaryRunway : null
  );
  const complianceStatus = getDisplayText(fundingSummary?.complianceStatus, 'not_available');
  const fundingWindowStatus = getOptimalFundingWindowLabel(
    fundingSummary?.optimalFundingWindowStatus
  );
  const suggestedValuationSource = getDisplayText(
    fundingSummary?.suggestedValuationSource,
    'not_available'
  );

  const hasFundingData =
    effectiveRaised > 0 ||
    Number(fundingSummary?.totalRounds ?? fundingSummary?.roundsCount ?? 0) > 0 ||
    (Number.isFinite(summaryRunway) && summaryRunway > 0);

  const score = hasFundingData
    ? clampScore(
        readiness * 0.44 +
          clampScore((runway / 24) * 100) * 0.34 +
          clampScore(100 - Math.max(0, dilution - 10) * 3) * 0.22
      )
    : null;

  return {
    score,
    dataSource: hasFundingData ? 'operational_dss' : 'insufficient_data',
    truthfulnessStatus: hasFundingData ? 'operational_dss' : 'insufficient_data',
    executiveSignalEligible: hasFundingData,
    humanReviewRequired: true,
    scoreDisplay: hasFundingData ? null : 'Insufficient persisted funding data — human review required',
    title: hasFundingData ? 'Funding board case prepared' : 'Funding data pending',
    posture: hasFundingData ? 'Validate investor memo' : 'insufficient_data',
    targetRaise: effectiveRaised,
    runway,
    dilution,
    readiness,
    currency,
    latestRoundType: latestRound?.roundType || fundingSummary?.latestRoundType || '',
    latestInvestorName: latestRound?.investorName || fundingSummary?.latestInvestorName || '',
    fundingRiskStatus:
      latestRound?.riskStatus || fundingSummary?.fundingRiskStatus || 'normal',
    requiresExecutiveUpdate: Boolean(fundingSummary?.requiresExecutiveUpdate),
    complianceStatus,
    fundingWindowStatus,
    suggestedValuationSource,
    executiveSignals: Array.isArray(fundingSummary?.executiveSignals)
      ? fundingSummary.executiveSignals
      : [],
    humanReviewRequired: Boolean(fundingSummary?.humanReviewRequired),
    runwayStatus,
    description:
      effectiveRaised > 0
        ? 'Funding ya estructura capital stack, readiness, use of funds, data room y Board Memo.'
        : 'Pending Funding Data. Add funding rounds to activate executive funding intelligence.'
  };
}

function getPmiOverview(pmiBrief = null) {
  const metrics = pmiBrief?.metrics || {};
  const latestCase = pmiBrief?.latestCase || null;
  const truthfulness = pmiBrief?.truthfulness || {};
  const executiveSignalEligible = Boolean(
    pmiBrief?.executiveSignalEligible ?? truthfulness.executiveSignalEligible ?? latestCase?.id
  );
  const score =
    executiveSignalEligible && pmiBrief?.score != null
      ? clampScore(pmiBrief.score)
      : null;
  const synergyCaptureRate = clampScore(metrics.synergyCaptureRate ?? 0);
  const openRiskCount = Number(metrics.openRiskCount ?? 0);
  const blockedWorkstreamsCount = Number(metrics.blockedWorkstreamsCount ?? 0);
  const blockedDependenciesCount = Number(metrics.blockedDependenciesCount ?? 0);
  const synergyGap = Number(metrics.synergyGap ?? 0);
  const budgetRemaining = Number(metrics.budgetRemaining ?? 0);
  const alerts = [];

  if (synergyGap > 0 && synergyCaptureRate < 45) {
    alerts.push('Synergy gap below target');
  }

  if (openRiskCount > 0) {
    alerts.push(`${openRiskCount} open PMI risks`);
  }
  if (blockedWorkstreamsCount > 0) {
    alerts.push(`${blockedWorkstreamsCount} blocked workstreams`);
  }
  if (blockedDependenciesCount > 0) {
    alerts.push(`${blockedDependenciesCount} blocked dependencies`);
  }

  return {
    score,
    scoreDisplay:
      score != null ? `${score}/100` : 'Insufficient persisted PMI data — human review required',
    executiveSignalEligible,
    dataSource: pmiBrief?.dataSource || truthfulness.dataSource || 'empty',
    humanReviewRequired: Boolean(
      pmiBrief?.humanReviewRequired ?? truthfulness.humanReviewRequired ?? !executiveSignalEligible
    ),
    truthfulnessStatus: executiveSignalEligible ? 'operational_dss' : 'insufficient_data',
    title: executiveSignalEligible
      ? pmiBrief?.title || 'PMI integration signal'
      : pmiBrief?.title || 'PMI data pending',
    posture: executiveSignalEligible
      ? pmiBrief?.posture || 'Integration posture'
      : pmiBrief?.posture || 'Insufficient persisted PMI data',
    description:
      pmiBrief?.description ||
      (executiveSignalEligible
        ? 'PMI connects post-close execution, synergies, risks, owners and 30-60-90 milestones into the CEO layer.'
        : 'PMI DSS layer is available, but no persisted integration case is eligible for executive scoring yet.'),
    dealName: latestCase?.dealName || 'PMI integration file',
    casesCount: metrics.casesCount ?? 0,
    workstreamsCount: metrics.workstreamsCount ?? 0,
    highRiskCount: metrics.highRiskCount ?? 0,
    openRiskCount,
    blockedWorkstreamsCount,
    blockedDependenciesCount,
    ledgerCaptureRate: clampScore(metrics.ledgerCaptureRate ?? 0),
    playbookProgress: clampScore(metrics.playbookProgress ?? 0),
    dependencyRiskScore: clampScore(metrics.dependencyRiskScore ?? 100),
    synergyCaptureRate,
    synergyGap,
    budgetRemaining,
    progress: metrics.workstreamProgress ?? score,
    alerts
  };
}

function buildExecutivePriorityRows({ pmiOverview, fundingOverview, complianceOverview }) {
  const rows = [
    { label: 'Decision quality', value: 'Active' },
    { label: 'Visual consistency', value: 'Active' },
    { label: 'Executive narrative', value: 'Active' },
    { label: 'Board outputs', value: 'Draft metadata pending' }
  ];

  if (pmiOverview.alerts.length > 0) {
    rows.unshift({
      label: 'PMI escalation',
      value: pmiOverview.alerts[0]
    });
  }

  if (fundingOverview.requiresExecutiveUpdate) {
    rows.unshift({
      label: 'Funding update',
      value: 'Executive review required'
    });
  }

  if (complianceOverview.openAlerts > 0) {
    rows.unshift({
      label: 'Compliance control',
      value: `${complianceOverview.openAlerts} open alerts`
    });
  }

  return rows.slice(0, 6);
}

function CommandItem({ label, value, branch = 'overview', to = '' }) {
  const content = (
    <>
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </>
  );

  if (to) {
    return (
      <Link
        className={`ceo-command-item ceo-command-item-hit ceo-branch-surface ceo-glass-branch ceo-branch-${branch}`}
        to={to}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={`ceo-command-item ceo-branch-surface ceo-glass-branch ceo-branch-${branch}`}>
      {content}
    </div>
  );
}

function SignalRow({ label, value }) {
  return (
    <div className="ceo-signal-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SectionHeader({ kicker, icon: Icon, title, description }) {
  return (
    <div className="ceo-section-header">
      <div>
        <div className="ceo-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h2>{title}</h2>

        <p className="muted">{description}</p>
      </div>
    </div>
  );
}

function KpiCard({ label, value, description, icon: Icon, tone = '', branch = 'overview' }) {
  return (
    <article className={`ceo-kpi-card ceo-branch-surface ceo-glass-branch ceo-branch-${branch}`}>
      <div className="ceo-kpi-top">
        <div>
          <div className="kpi-label">{label}</div>

          <div className={`ceo-kpi-value ${tone}`.trim()}>
            {value}
          </div>
        </div>

        <div className="ceo-card-icon">
          <Icon size={18} />
        </div>
      </div>

      <p className="muted">{description}</p>
    </article>
  );
}

function MiniRow({ label, value }) {
  return (
    <div className="ceo-mini-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ModuleCard({
  icon: Icon,
  branch = 'overview',
  kicker,
  title,
  description,
  score,
  posture,
  rows,
  primaryLink,
  secondaryLink,
  surfaceNavigateTo = ''
}) {
  const navigate = useNavigate();

  function handleSurface(event) {
    if (!surfaceNavigateTo) return;
    if (event.target.closest('.ceo-module-nav')) return;

    navigate(surfaceNavigateTo);
  }

  const interactive = Boolean(surfaceNavigateTo);

  const shellProps = interactive
    ? {
        role: 'button',
        tabIndex: 0,
        onClick: handleSurface,
        onKeyDown: (event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          handleSurface(event);
        },
        style: { cursor: 'pointer' }
      }
    : {};

  return (
    <div className={interactive ? 'ceo-module-hit' : ''} {...shellProps}>
      <Card className={`ceo-module-card ceo-branch-surface ceo-branch-${branch}`}>
        <div className="ceo-module-head">
          <div>
            <div className="ceo-kicker">
              <Icon size={14} />
              {kicker}
            </div>

            <h3 className="ceo-module-title">{title}</h3>

            <p className="muted ceo-module-copy">{description}</p>
          </div>

          <div className="ceo-panel-icon">
            <Icon size={18} />
          </div>
        </div>

        <div className="ceo-module-metrics">
          <MiniRow label="Signal score" value={formatModuleScoreDisplay(score)} />
          <MiniRow label="Current posture" value={posture} />

          {rows.map((row) => (
            <MiniRow key={row.label} label={row.label} value={row.value} />
          ))}
        </div>

        <div className="ceo-link-row ceo-module-nav" onClick={(event) => event.stopPropagation()}>
          <Link className="ceo-link" to={primaryLink.to}>
            {primaryLink.label}
            <ArrowRight size={14} />
          </Link>

          {secondaryLink ? (
            <Link className="ceo-link secondary" to={secondaryLink.to}>
              {secondaryLink.label}
            </Link>
          ) : null}
        </div>
      </Card>
    </div>
  );
}

function ActionCard({ icon: Icon, branch = 'overview', title, description, to, label }) {
  return (
    <article className={`ceo-action-card ceo-branch-surface ceo-branch-${branch}`}>
      <div className="ceo-action-head">
        <div>
          <h3 className="ceo-action-title">{title}</h3>

          <p className="muted ceo-action-copy">{description}</p>
        </div>

        <div className="ceo-panel-icon">
          <Icon size={18} />
        </div>
      </div>

      <div className="ceo-link-row">
        <Link className="ceo-link" to={to}>
          {label}
          <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}

export function CEOOverviewPage() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const maStore = useMAStore();

  const {
    suppliers,
    alerts,
    evidenceItems,
    reviews,
    activeSupplierId
  } = useComplianceStore();

  const {
    fundingInputs,
    fundingSettings
  } = useFundingStore();

  const safeSuppliers = getSafeArray(suppliers);
  const safeAlerts = getSafeArray(alerts);
  const safeEvidenceItems = getSafeArray(evidenceItems);
  const safeReviews = getSafeArray(reviews);

  const [hubBrief, setHubBrief] = useState(null);
  const [hydratedCases, setHydratedCases] = useState([]);
  const [fundingSummary, setFundingSummary] = useState({});
  const [pmiBrief, setPmiBrief] = useState(null);
  const [ecosystemBrief, setEcosystemBrief] = useState(null);
  const [bridgeSummary, setBridgeSummary] = useState(null);
  const [riskSummary, setRiskSummary] = useState(null);
  const [strategySummary, setStrategySummary] = useState(null);
  const [executiveOverview, setExecutiveOverview] = useState(null);
  const [boardPack, setBoardPack] = useState(null);
  const [boardPackLoading, setBoardPackLoading] = useState(false);
  const [boardPackError, setBoardPackError] = useState(null);
  const [isBoardPackOpen, setIsBoardPackOpen] = useState(false);
  const [lastReportGeneratedAt, setLastReportGeneratedAt] = useState(() => {
    try {
      return localStorage.getItem('ceos:last_board_pack_generated_at') || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    let cancelled = false;

    const applyIfMounted = (setter, value) => {
      if (!cancelled) {
        setter(value);
      }
    };

    maCasesApi
      .hydrateFromBackend()
      .then((items) => applyIfMounted(setHydratedCases, Array.isArray(items) ? items : []))
      .catch(() => applyIfMounted(setHydratedCases, []));

    complianceAuditApi
      .getExecutiveHubBrief()
      .then((envelope) => {
        const data = envelope?.data ?? envelope;
        applyIfMounted(
          setHubBrief,
          data && typeof data === 'object' ? data : null
        );
      })
      .catch(() => applyIfMounted(setHubBrief, null));

    fundingEnterpriseApi
      .getExecutiveBridgeSnapshot()
      .then((snapshot) => {
        const data = snapshot?.summary ?? {};
        applyIfMounted(
          setFundingSummary,
          data && typeof data === 'object' ? data : {}
        );
      })
      .catch(() => applyIfMounted(setFundingSummary, {}));

    pmiApi
      .getExecutiveHubBrief()
      .then((data) =>
        applyIfMounted(setPmiBrief, data && typeof data === 'object' ? data : null)
      )
      .catch(() => applyIfMounted(setPmiBrief, null));

    ecosystemApi
      .getExecutiveHubBrief()
      .then((data) =>
        applyIfMounted(
          setEcosystemBrief,
          data && typeof data === 'object' ? data : null
        )
      )
      .catch(() => applyIfMounted(setEcosystemBrief, null));

    bridgeApi
      .getSummary()
      .then((data) =>
        applyIfMounted(setBridgeSummary, data && typeof data === 'object' ? data : null)
      )
      .catch(() => applyIfMounted(setBridgeSummary, null));

    riskApi
      .getSummary()
      .then((data) =>
        applyIfMounted(setRiskSummary, data && typeof data === 'object' ? data : null)
      )
      .catch(() => applyIfMounted(setRiskSummary, null));

    strategyApi
      .getSummary()
      .then((data) =>
        applyIfMounted(
          setStrategySummary,
          data && typeof data === 'object' ? data : null
        )
      )
      .catch(() => applyIfMounted(setStrategySummary, null));

    executiveApi
      .getOverview()
      .then((data) =>
        applyIfMounted(
          setExecutiveOverview,
          data && typeof data === 'object' ? data : null
        )
      )
      .catch(() => applyIfMounted(setExecutiveOverview, null));

    return () => {
      cancelled = true;
    };
  }, []);

  const canGenerateBoardPack = role === 'admin' || role === 'board_member';

  async function handleGenerateBoardPack() {
    setIsBoardPackOpen(true);
    setBoardPackLoading(true);
    setBoardPackError(null);

    try {
      const data = await boardPackApi.getBoardPack();
      setBoardPack(data);
      setLastReportGeneratedAt(data?.generatedAt || new Date().toISOString());
      try {
        localStorage.setItem(
          'ceos:last_board_pack_generated_at',
          data?.generatedAt || new Date().toISOString()
        );
      } catch {
        // Local trace only; report generation remains valid without storage.
      }
    } catch (error) {
      setBoardPackError(error);
    } finally {
      setBoardPackLoading(false);
    }
  }

  function handleExportBoardPack() {
    if (typeof window === 'undefined') return;
    window.print();
  }

  const complianceEngine = useComplianceEngine({
    suppliers: safeSuppliers,
    alerts: safeAlerts,
    evidenceItems: safeEvidenceItems,
    reviews: safeReviews,
    activeSupplierId
  });

  const fundingDerived = useFundingEngine({
    fundingInputs,
    fundingSettings
  });

  const maOverview = getMAOverview(maStore);
  const complianceOverview = getComplianceOverview({
    suppliers: complianceEngine.suppliers,
    alerts: safeAlerts,
    evidenceItems: safeEvidenceItems,
    reviews: safeReviews
  });
  const fundingOverview = getFundingOverviewWithSummary({
    fundingInputs,
    fundingSettings,
    fundingDerived,
    fundingSummary
  });
  const pmiOverview = getPmiOverview(pmiBrief);
  const governanceOverview = getEcosystemBranchOverview(ecosystemBrief, 'governance', {
    title: 'Governance data pending',
    posture: 'insufficient_data',
    description:
      'Governance & ESG connects board decisions, ESG reporting and enterprise controls with Compliance and Funding. DSS only — human review required.',
    route: '/governance/dashboard',
    latestTitle: 'Insufficient persisted governance data'
  });
  const heritageOverview = getEcosystemBranchOverview(ecosystemBrief, 'heritage', {
    title: 'Heritage preview',
    posture: 'insufficient_data',
    description:
      'Heritage structures patrimony, succession and asset protection. Preview module — insufficient data until persisted records exist.',
    route: '/heritage/dashboard',
    latestTitle: 'Insufficient persisted heritage data'
  });
  const legacyBridgeOverview = getEcosystemBranchOverview(ecosystemBrief, 'bridge', {
    title: 'Bridge opportunity pipeline',
    posture: 'insufficient_data',
    description:
      'Bridge connects cross-module signals and counterparties. Internal/unlisted demo layer — not a live marketplace.',
    route: '/bridge/dashboard',
    latestTitle: 'Insufficient persisted bridge data'
  });
  const bridgeMetrics = bridgeSummary?.metrics || {};
  const bridgeScore = normalizeScoreOrNull(bridgeMetrics.crossModuleReadiness);
  const bridgeOverview = bridgeSummary
    ? {
        ...legacyBridgeOverview,
        score: bridgeScore,
        dataSource: bridgeScore === null ? 'insufficient_data' : 'operational_dss',
        truthfulnessStatus: bridgeScore === null ? 'insufficient_data' : 'operational_dss',
        executiveSignalEligible: bridgeScore !== null,
        humanReviewRequired: true,
        title: bridgeScore === null ? 'Bridge data pending' : 'Cross-module intelligence layer',
        posture: bridgeScore === null ? 'insufficient_data' : bridgeMetrics.bridgeHealthStatus || legacyBridgeOverview.posture,
        description:
          'Bridge consolidates cross-module signals, dependencies, conflicts and executive attention items. Human review required.',
        metrics: {
          ...(legacyBridgeOverview.metrics || {}),
          ...bridgeMetrics
        },
        recordsCount: bridgeSummary.counts?.signals || legacyBridgeOverview.recordsCount,
        activeRecordsCount: bridgeMetrics.criticalCrossModuleSignals || 0,
        latestTitle: bridgeSummary.latestSignal?.title || legacyBridgeOverview.latestTitle
      }
    : legacyBridgeOverview;
  const riskOverview = getRiskOverview(riskSummary);
  const strategyMetrics = strategySummary?.metrics || {};
  const strategyHasPersistedData =
    strategySummary?.executiveSignalEligible === true ||
    strategyMetrics.executiveSignalEligible === true ||
    (strategySummary?.counts?.objectives || 0) > 0 ||
    (strategySummary?.counts?.initiatives || 0) > 0;
  const strategyScoreRaw = strategyMetrics.strategyReadinessScore ?? strategySummary?.strategyReadinessScore;
  const strategyScore =
    strategyHasPersistedData &&
    strategyMetrics.executiveSignalEligible !== false &&
    strategyScoreRaw !== null &&
    strategyScoreRaw !== undefined &&
    Number.isFinite(Number(strategyScoreRaw))
      ? clampScore(strategyScoreRaw)
      : null;
  const strategyOverview = {
    score: strategyScore,
    title: 'Strategy Command',
    posture: !strategyHasPersistedData
      ? 'insufficient_data'
      : strategyMetrics.requiresExecutiveAttention
        ? 'executive_attention'
        : 'aligned',
    description:
      'Strategy connects objectives, initiatives, scenarios, market signals, capital dependencies and board decisions into the executive layer. DSS only — human review required.',
    recordsCount: strategySummary?.counts?.objectives || 0,
    activeRecordsCount: strategyMetrics.blockedStrategicInitiatives || strategySummary?.blockedStrategicInitiatives || 0,
    latestTitle: strategySummary?.latestObjective?.title || 'Insufficient persisted strategy data',
    metrics: strategyMetrics,
    dataSource: strategyHasPersistedData ? 'operational_dss' : 'insufficient_data',
    truthfulnessStatus: strategyHasPersistedData ? 'operational_dss' : 'insufficient_data',
    executiveSignalEligible:
      strategyHasPersistedData && strategyMetrics.executiveSignalEligible !== false && strategyScore !== null,
    humanReviewRequired: true
  };

  const executiveSignal = getExecutiveSignal([
    maOverview,
    complianceOverview,
    fundingOverview,
    pmiOverview,
    governanceOverview,
    heritageOverview,
    bridgeOverview,
    riskOverview,
    strategyOverview
  ]);

  const casesForRadar =
    hydratedCases.length > 0
      ? hydratedCases
      : getSafeArray(
          maStore.cases ||
            maStore.savedCases ||
            maStore.maCases ||
            maStore.deals ||
            maStore.savedDeals
        );

  const legalHealthRadar = resolveLegalHealthRadarScore(hubBrief);

  const maValuationSignal = maOverview.score;
  const dealReadinessCombined =
    maValuationSignal != null && legalHealthRadar != null
      ? clampScore(Math.round(maValuationSignal * 0.52 + legalHealthRadar * 0.48))
      : null;
  const complianceDragPenalty =
    maValuationSignal != null && dealReadinessCombined != null
      ? clampScore(maValuationSignal - dealReadinessCombined)
      : null;
  const maFinancialRadar = estimateMaFinancialRadar(casesForRadar);
  const operationalRadarScore =
    pmiOverview.score != null ? clampScore(pmiOverview.progress ?? pmiOverview.score) : null;
  const fundingRadarScore =
    fundingOverview.executiveSignalEligible && fundingOverview.score != null
      ? normalizeScoreOrNull(fundingOverview.readiness)
      : null;

  const radarAxes = [
    buildRadarAxis({
      key: 'legal',
      label: 'Legal',
      score: legalHealthRadar,
      route: '/compliance/audit-runs',
      tone: '#60a5fa'
    }),
    buildRadarAxis({
      key: 'financial',
      label: 'Financial · M&A',
      score: maFinancialRadar.score,
      route: '/ma/valuation',
      tone: '#34d399'
    }),
    buildRadarAxis({
      key: 'ops',
      label: 'Operational',
      score: operationalRadarScore,
      route: '/compliance/suppliers',
      tone: '#a78bfa'
    }),
    buildRadarAxis({
      key: 'esg',
      label: 'ESG & reputational risk',
      score: governanceOverview.score,
      route: '/compliance/dashboard',
      tone: '#4ade80'
    }),
    buildRadarAxis({
      key: 'funding',
      label: 'Funding',
      score: fundingRadarScore,
      route: '/funding/dashboard',
      tone: '#fbbf24'
    }),
    buildRadarAxis({
      key: 'risk',
      label: 'Enterprise Risk',
      score: riskOverview.score,
      route: '/risk/dashboard',
      tone: '#f87171'
    }),
    buildRadarAxis({
      key: 'strategy',
      label: 'Strategy',
      score: strategyOverview.score,
      route: '/strategy/dashboard',
      tone: '#38bdf8'
    }),
    buildRadarAxis({
      key: 'bridge',
      label: 'Bridge',
      score: bridgeOverview.score,
      route: '/bridge/dashboard',
      tone: '#22d3ee'
    }),
    buildRadarAxis({
      key: 'heritage',
      label: 'Heritage',
      score: heritageOverview.score,
      route: '/heritage/dashboard',
      tone: '#d4af37'
    })
  ];

  const executiveCommand = executiveOverview || {};
  const commandReadiness = executiveCommand.readiness || executiveCommand.executiveReadinessIndex || {
    score: executiveSignal.score,
    trend: 'stable',
    confidence: 0,
    missingData: ['executive_api'],
    humanReviewPosture: 'human_review_required'
  };
  const commandRadarAxes = Array.isArray(executiveCommand.corporateHealthRadar)
    ? executiveCommand.corporateHealthRadar
        .filter((axis) => axis && typeof axis === 'object')
        .map((axis) => mapExecutiveCorporateRadarAxis(axis))
    : radarAxes
        .filter((axis) => axis && typeof axis === 'object' && !['heritage'].includes(axis.key))
        .map((axis) => mapExecutiveCorporateRadarAxis(axis));
  const commandSignals = Array.isArray(executiveCommand.signals) ? executiveCommand.signals : [];
  const commandDecisionQueue = Array.isArray(executiveCommand.decisionQueue) ? executiveCommand.decisionQueue : [];
  const commandBoardView = executiveCommand.boardView || {};
  const commandAlerts = Array.isArray(executiveCommand.alerts) ? executiveCommand.alerts : [];
  const commandCalendar = Array.isArray(executiveCommand.calendar) ? executiveCommand.calendar : [];
  const commandModuleCards = Array.isArray(executiveCommand.moduleCards) ? executiveCommand.moduleCards : [];

  const scoreAngle = `${(executiveSignal.score ?? 0) * 3.6}deg`;
  const availablePacks = [
    'M&A Deal Brief / IC Memo / Data Room',
    'Compliance Board Pack',
    'Funding Board Memo / Data Room',
    'PMI Board Integration Memo',
    'Governance / ESG control brief',
    'Bridge verified network brief',
    'Heritage legacy map'
  ];
  const executivePriorityRows = buildExecutivePriorityRows({
    pmiOverview,
    fundingOverview,
    complianceOverview
  });

  return (
    <div className="page">
      <style>{ceoOverviewCss}</style>

      <div className="ceo-overview-page">
        <section className="ceo-hero ceos-ws-hero ceo-branch-surface ceo-branch-overview">
          <div className="ceo-hero-layout">
            <div>
              <div className="ceo-badge-row">
                <Badge>CEO Overview</Badge>
                <Badge>Executive Command Center</Badge>
                <Badge>Decision-support layer</Badge>
                <Badge>Executive roadmap</Badge>
              </div>

              <h1 className="ceo-title">
                Executive Command Center.
                <span>One view for corporate intelligence.</span>
              </h1>

              <p className="ceo-copy">
                Capa ejecutiva que une las señales principales de M&A,
                Compliance, Funding, PMI, Governance, Heritage y The Bridge
                para presentar CEO’s OS como sistema operativo ejecutivo,
                no como módulos aislados.
              </p>

              <div className="ceo-hero-actions">
                <Button
                  onClick={handleGenerateBoardPack}
                  loading={boardPackLoading}
                  disabled={!canGenerateBoardPack}
                >
                  <FileText size={16} />
                  Generate Board Review Draft
                </Button>
                <span className="ceo-report-trace">
                  Last Report Generated:{' '}
                  {lastReportGeneratedAt
                    ? new Date(lastReportGeneratedAt).toLocaleString('en-GB')
                    : 'Not generated yet'}
                </span>
              </div>

              <div className="ceo-command-bar">
                <CommandItem
                  branch="ma"
                  label="M&A posture"
                  value={maOverview.posture}
                  to="/ma/dashboard"
                />

                <CommandItem
                  branch="compliance"
                  label="Compliance posture"
                  value={complianceOverview.posture}
                  to="/compliance/dashboard"
                />

                <CommandItem
                  branch="funding"
                  label="Funding posture"
                  value={fundingOverview.posture}
                  to="/funding/dashboard"
                />

                <CommandItem
                  branch="pmi"
                  label="PMI posture"
                  value={pmiOverview.posture}
                  to="/pmi/dashboard"
                />

                <CommandItem
                  branch="governance"
                  label="Governance posture"
                  value={governanceOverview.posture}
                  to="/governance/dashboard"
                />

                <CommandItem
                  branch="heritage"
                  label="Heritage posture"
                  value={heritageOverview.posture}
                  to="/heritage/dashboard"
                />

                <CommandItem
                  branch="bridge"
                  label="Bridge posture"
                  value={bridgeOverview.posture}
                  to="/bridge/dashboard"
                />
              </div>

              <div className="ceo-deal-readiness-radar-grid">
                <article className="ceo-deal-readiness-card ceos-ws-card-accent ceo-branch-surface ceo-branch-overview">
                  <div className="ceo-kicker">
                    <Target size={14} />
                    Deal readiness index
                  </div>

                  <h3 style={{ margin: '4px 0 0', letterSpacing: '-0.035em', fontSize: 22 }}>
                    Valuation readiness vs legal drag
                  </h3>

                  <p className="muted muted-tight">
                    Sintetiza el signal financiero ({formatScoreLabel(maValuationSignal)}) con la salud legal
                    ejecutiva más reciente ({formatScoreLabel(legalHealthRadar)}). Compliance bajo muestra cómo{' '}
                    <strong>{complianceDragPenalty != null && complianceDragPenalty > 0 ? 'lastra' : 'neutraliza'}</strong> la
                    preparación comercial combinada ({formatScoreLabel(dealReadinessCombined)}).
                  </p>

                  <div className="ceo-deal-score-row">
                    <div className="ceo-deal-pill">
                      <div className="kpi-label">Valuation signal</div>
                      <strong style={{ fontSize: 26 }}>{formatExecutiveScoreNumber(maValuationSignal)}</strong>
                      <button
                        type="button"
                        className="ceo-link secondary"
                        style={{
                          marginTop: 12,
                          width: '100%',
                          justifyContent: 'center',
                          display: 'inline-flex',
                          border: 'none',
                          cursor: 'pointer',
                          background: 'transparent',
                          color: 'inherit',
                          padding: '8px'
                        }}
                        onClick={() => navigate('/ma/valuation')}
                      >
                        Drill M&A valuation
                      </button>
                    </div>

                    <div className="ceo-deal-pill">
                      <div className="kpi-label">Legal / Compliance health</div>
                      <strong style={{ fontSize: 26 }}>{formatExecutiveScoreNumber(legalHealthRadar)}</strong>
                      <button
                        type="button"
                        className="ceo-link secondary"
                        style={{
                          marginTop: 12,
                          width: '100%',
                          justifyContent: 'center',
                          display: 'inline-flex',
                          border: 'none',
                          cursor: 'pointer',
                          background: 'transparent',
                          color: 'inherit',
                          padding: '8px'
                        }}
                        onClick={() => navigate('/compliance/audit-runs')}
                      >
                        Drill audit ledger
                      </button>
                    </div>

                    <div className="ceo-deal-pill">
                      <div className="kpi-label">Unified readiness</div>
                      <strong style={{ fontSize: 26 }}>{formatExecutiveScoreNumber(dealReadinessCombined)}</strong>
                      <div className="kpi-label" style={{ marginTop: 10 }}>
                        Compliance drag Δ {complianceDragPenalty != null ? `${complianceDragPenalty} pts` : 'N/A'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="kpi-label">
                      Franja visual: combinación ponderada penaliza financieramente el lento avance legal
                    </div>
                    <div className="ceo-drag-bar-shell">
                      <div
                        className="ceo-drag-fill-valuation"
                        style={{ width: `${dealReadinessCombined ?? 0}%` }}
                        title={dealReadinessCombined != null ? `Ready ${dealReadinessCombined}%` : 'Readiness N/A'}
                      />
                      <div
                        className="ceo-drag-fill-drag"
                        style={{
                          width: `${complianceDragPenalty ?? 0}%`,
                          opacity: complianceDragPenalty != null && complianceDragPenalty > 6 ? 0.95 : 0.55
                        }}
                        title={
                          complianceDragPenalty != null
                            ? `Legal drag absorbs ${complianceDragPenalty}% points`
                            : 'Legal drag N/A'
                        }
                      />
                    </div>
                  </div>

                  <p className="muted ceo-muted-tight" style={{ fontSize: 12.5 }}>
                    {hubBrief?.portfolioReportBrief?.headline
                      ? `Memo compliance: ${hubBrief.portfolioReportBrief.headline}`
                      : 'Genera auditorías Compliance Enterprise para alimentar el hub legal en vivo.'}
                  </p>
                </article>

                <article className="ceo-deal-readiness-card ceos-ws-card-accent ceo-branch-surface ceo-branch-overview ceo-radar-card-inner">
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <div className="ceo-kicker">
                        <Radar size={14} />
                        Corporate health radar
                      </div>
                      <strong style={{ display: 'block', marginTop: 6 }}>
                        Radar de salud ejecutiva · multi-rama
                      </strong>
                      <p className="muted" style={{ margin: '10px 0 0', lineHeight: 1.52 }}>
                        Legal, financiero, funding y PMI consumen señales activas; Governance, Heritage y Bridge
                        aportan lectura enterprise para continuidad, red transaccional y gobierno corporativo.
                      </p>
                    </div>
                  </div>

                  <CorporateHealthRadarSVG
                    axes={radarAxes.map(({ key, label, value }) => ({ key, label, value }))}
                  />

                  <div className="ceo-radar-legend">
                    {radarAxes.map((axis) => (
                      <Link key={axis.key} to={axis.route}>
                        <span className="ceo-radar-swatch" style={{ backgroundColor: axis.tone }} />
                        <span>{axis.label}</span>
                        <strong>{axis.displayLabel}</strong>
                      </Link>
                    ))}
                  </div>
                </article>
              </div>
            </div>

            <aside className="ceo-signal-card ceos-ws-card-accent ceo-branch-surface ceo-branch-overview">
              <div className="ceo-signal-inner">
                <div className="ceo-signal-top">
                  <div>
                    <div className="kpi-label">Executive Signal</div>
                    <div className="ceo-signal-title">
                      {executiveSignal.title}
                    </div>
                  </div>

                  <div className="ceo-icon-box">
                    <Sparkles size={21} />
                  </div>
                </div>

                <div className="ceo-score-module">
                  <div
                    className="ceo-score-ring"
                    style={{ '--score-angle': scoreAngle }}
                  >
                    <div className="ceo-score-core">
                      <strong>{executiveSignal.scoreDisplay || formatScoreLabel(executiveSignal.score)}</strong>
                    </div>
                  </div>

                  <div className="ceo-score-copy">
                    <strong>{executiveSignal.posture}</strong>

                    <p className="muted">
                      {executiveSignal.description}
                    </p>
                  </div>
                </div>

                <div className="ceo-signal-table">
                  <SignalRow label="M&A Signal" value={formatModuleSignalValue(maOverview)} />
                  <SignalRow label="Compliance Signal" value={formatModuleSignalValue(complianceOverview)} />
                  <SignalRow label="Funding Signal" value={formatModuleSignalValue(fundingOverview)} />
                  <SignalRow label="PMI Signal" value={pmiOverview.scoreDisplay || formatModuleSignalValue(pmiOverview)} />
                  <SignalRow
                    label="Ecosystem Signal"
                    value={formatScoreLabel(normalizeScoreOrNull(ecosystemBrief?.score))}
                  />
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="ceo-section" data-testid="ceo-command-center-enterprise">
          <SectionHeader
            kicker="CEO Command Center"
            icon={Gauge}
            title="Enterprise executive layer"
            description="Capa consolidada desde /api/executive/overview: readiness, señales, decisiones, board view y calendario. Human review required."
          />

          <div className="executive-command-layer">
            <div className="executive-command-stack">
              <ReadinessIndexCard readiness={commandReadiness} />
              <article className="executive-command-card">
                <span className="executive-eyebrow">Corporate Health Radar</span>
                <h3>Readiness by enterprise branch.</h3>
                <CorporateHealthRadar axes={commandRadarAxes} />
              </article>
            </div>

            <div className="executive-command-stack">
              <ExecutiveSignalFeed signals={commandSignals} />
              <DecisionQueuePanel decisions={commandDecisionQueue} />
            </div>
          </div>

          <div className="executive-command-layer" style={{ marginTop: 18 }}>
            <BoardViewSnapshot boardView={commandBoardView} />
            <div className="executive-command-stack">
              <ExecutiveAlertsPanel alerts={commandAlerts} />
              <ExecutiveCalendarPanel items={commandCalendar} />
            </div>
          </div>

          <div className="executive-module-grid">
            {(commandModuleCards.length
              ? commandModuleCards
              : buildInsufficientFallbackModuleCards()
            ).map((card) => (
              <ExecutiveModuleCard key={card.key || card.title} card={card} />
            ))}
          </div>
        </section>

        <section className="ceo-section">
          <SectionHeader
            kicker="Executive snapshot"
            icon={Activity}
            title="CEO’s OS at a glance"
            description="Lectura rápida del estado del release ejecutivo: módulos, señales, riesgos, funding y entregables para el board."
          />

          <div className="ceo-grid ceo-grid-kpis">
            <KpiCard
              branch="overview"
              label="Release readiness"
              value="Closing"
              description="Producto entrando en cierre vendible."
              icon={CheckCircle2}
              tone="text-success"
            />

            <KpiCard
              branch="ma"
              label="Core workspaces"
              value="7 + Overview"
              description="Core, PMI y ramas enterprise conectadas."
              icon={Layers3}
            />

            <KpiCard
              branch="compliance"
              label="Board packs"
              value={availablePacks.length}
              description="Exportaciones premium imprimibles."
              icon={Download}
            />

            <KpiCard
              branch="funding"
              label="Next milestone"
              value="Enterprise sync"
              description="Señales multi-rama alimentando el CEO Overview."
              icon={Target}
              tone="text-success"
            />
          </div>
        </section>

        <section className="ceo-section">
          <SectionHeader
            kicker="Operating modules"
            icon={Layers3}
            title="Enterprise branches feeding one executive layer"
            description="Esta vista conecta core, post-merger execution y ramas enterprise sin desacoplar los módulos que ya funcionan."
          />

          <div className="ceo-grid ceo-grid-three">
            <ModuleCard
              icon={BriefcaseBusiness}
              branch="ma"
              kicker="M&A Intelligence"
              title="M&A Command"
              description={maOverview.description}
              score={maOverview.score}
              posture={maOverview.posture}
              surfaceNavigateTo="/ma/dashboard"
              rows={[
                { label: 'Active target', value: maOverview.targetName },
                { label: 'Deals / cases', value: maOverview.dealsCount },
                { label: 'Reports', value: maOverview.reportCount }
              ]}
              primaryLink={{ to: '/ma/dashboard', label: 'Open M&A' }}
              secondaryLink={{ to: '/ma/deals', label: 'Repository' }}
            />

            <ModuleCard
              icon={ShieldCheck}
              branch="compliance"
              kicker="Compliance & Risk"
              title="Supply Chain Control"
              description={complianceOverview.description}
              score={complianceOverview.score}
              posture={complianceOverview.posture}
              surfaceNavigateTo="/compliance/dashboard"
              rows={[
                { label: 'Suppliers', value: complianceOverview.supplierCount },
                { label: 'Open alerts', value: complianceOverview.openAlerts },
                { label: 'Evidence items', value: complianceOverview.evidenceCount }
              ]}
              primaryLink={{ to: '/compliance/dashboard', label: 'Open Compliance' }}
              secondaryLink={{ to: '/compliance/reports', label: 'Board Pack' }}
            />

            <ModuleCard
              icon={Rocket}
              branch="funding"
              kicker="Funding Strategy"
              title="Capital Readiness"
              description={fundingOverview.description}
              score={fundingOverview.score}
              posture={fundingOverview.posture}
              surfaceNavigateTo="/funding/dashboard"
              rows={[
                {
                  label: 'Capital raised',
                  value: formatCurrency(fundingOverview.targetRaise, fundingOverview.currency)
                },
                { label: 'Runway', value: `${fundingOverview.runway} meses` },
                { label: 'Window', value: fundingOverview.fundingWindowStatus },
                { label: 'Risk status', value: fundingOverview.fundingRiskStatus || 'normal' }
              ]}
              primaryLink={{ to: '/funding/dashboard', label: 'Open Funding' }}
              secondaryLink={{ to: '/funding/data-room', label: 'Data Room' }}
            />

            <ModuleCard
              icon={Activity}
              branch="pmi"
              kicker="PMI & Synergies"
              title="Post-Merger Execution"
              description={pmiOverview.description}
              score={pmiOverview.score}
              posture={pmiOverview.posture}
              surfaceNavigateTo="/pmi/dashboard"
              rows={[
                { label: 'Integration file', value: pmiOverview.dealName },
                { label: 'Workstreams', value: pmiOverview.workstreamsCount },
                { label: 'High risks', value: pmiOverview.highRiskCount },
                { label: 'Open risks', value: pmiOverview.openRiskCount },
                { label: 'Synergy capture', value: `${pmiOverview.synergyCaptureRate}%` },
                { label: 'Ledger capture', value: `${pmiOverview.ledgerCaptureRate}%` },
                { label: 'Playbooks', value: `${pmiOverview.playbookProgress}%` },
                { label: 'Dependency risk', value: `${pmiOverview.dependencyRiskScore}%` },
                {
                  label: 'Budget remaining',
                  value: formatCurrency(
                    pmiOverview.budgetRemaining,
                    pmiBrief?.latestCase?.currency || 'EUR'
                  )
                }
              ]}
              primaryLink={{ to: '/pmi/dashboard', label: 'Open PMI' }}
              secondaryLink={{ to: '/ma/dashboard', label: 'M&A thesis' }}
            />

            <ModuleCard
              icon={Scale}
              branch="governance"
              kicker="Governance & ESG"
              title="Board Control Layer"
              description={governanceOverview.description}
              score={governanceOverview.score}
              posture={governanceOverview.posture}
              surfaceNavigateTo="/governance/dashboard"
              rows={[
                { label: 'Records', value: governanceOverview.recordsCount },
                { label: 'Active controls', value: governanceOverview.activeRecordsCount },
                {
                  label: 'Decision closure',
                  value: `${governanceOverview.metrics?.decisionClosureRate || 0}%`
                },
                {
                  label: 'Control effectiveness',
                  value: `${governanceOverview.metrics?.controlEffectiveness || 0}%`
                },
                {
                  label: 'ESG readiness',
                  value: `${governanceOverview.metrics?.esgReadiness || 0}%`
                },
                {
                  label: 'Board readiness',
                  value: `${governanceOverview.metrics?.boardReadinessScore || 0}%`
                },
                {
                  label: 'Bottlenecks',
                  value: governanceOverview.metrics?.approvalBottlenecks || 0
                },
                {
                  label: 'Policy risk',
                  value: governanceOverview.metrics?.policyReviewRisk || 0
                },
                { label: 'Latest', value: governanceOverview.latestTitle }
              ]}
              primaryLink={{ to: '/governance/dashboard', label: 'Open Governance' }}
              secondaryLink={{ to: '/governance/security-audit', label: 'Audit Trail' }}
            />

            <ModuleCard
              icon={Gem}
              branch="heritage"
              kicker="Heritage & Legacy"
              title="Owner Continuity"
              description={heritageOverview.description}
              score={heritageOverview.score}
              posture={heritageOverview.posture}
              surfaceNavigateTo="/heritage/dashboard"
              rows={[
                { label: 'Records', value: heritageOverview.recordsCount },
                { label: 'Active maps', value: heritageOverview.activeRecordsCount },
                {
                  label: 'Mapped value',
                  value: formatCurrency(heritageOverview.metrics?.totalAssetValue || 0, 'EUR')
                },
                {
                  label: 'Succession readiness',
                  value: `${heritageOverview.metrics?.successionReadiness || 0}%`
                },
                {
                  label: 'Protection coverage',
                  value: `${heritageOverview.metrics?.protectionCoverage || 0}%`
                },
                {
                  label: 'Evidence docs',
                  value: heritageOverview.metrics?.documentsCount || 0
                },
                {
                  label: 'Reports',
                  value: heritageOverview.metrics?.reportsCount || 0
                },
                { label: 'Latest', value: heritageOverview.latestTitle }
              ]}
              primaryLink={{ to: '/heritage/dashboard', label: 'Open Heritage' }}
              secondaryLink={{ to: '/ma/dashboard', label: 'Company value' }}
            />

            <ModuleCard
              icon={Radar}
              branch="compliance"
              kicker="Enterprise Risk"
              title="Risk Command"
              description={riskOverview.description}
              score={riskOverview.score}
              posture={riskOverview.posture}
              surfaceNavigateTo="/risk/dashboard"
              rows={[
                { label: 'Risk register', value: riskOverview.recordsCount },
                { label: 'Critical risks', value: riskOverview.activeRecordsCount },
                { label: 'Overdue mitigations', value: riskOverview.metrics?.overdueMitigations || 0 },
                { label: 'KRI breaches', value: riskOverview.metrics?.kriBreaches || 0 },
                { label: 'Appetite breaches', value: riskOverview.metrics?.appetiteBreaches || 0 },
                { label: 'Residual risk', value: `${riskOverview.metrics?.residualRisk || 0}/100` },
                { label: 'Latest', value: riskOverview.latestTitle }
              ]}
              primaryLink={{ to: '/risk/dashboard', label: 'Open Risk' }}
              secondaryLink={{ to: '/bridge/dashboard', label: 'Bridge signals' }}
            />

            <ModuleCard
              icon={Target}
              branch="overview"
              kicker="Enterprise Strategy"
              title="Strategic Execution"
              description={strategyOverview.description}
              score={strategyOverview.score}
              posture={strategyOverview.posture}
              surfaceNavigateTo="/strategy/dashboard"
              rows={[
                { label: 'Objectives', value: strategyOverview.recordsCount },
                { label: 'Blocked initiatives', value: strategyOverview.activeRecordsCount },
                { label: 'Capital dependencies', value: strategyOverview.metrics?.capitalDependencyCount || 0 },
                { label: 'Board decisions', value: strategyOverview.metrics?.boardDecisionsRequired || 0 },
                { label: 'Strategic risk', value: strategyOverview.metrics?.strategicRiskLevel || 'not_assessed' },
                { label: 'Latest', value: strategyOverview.latestTitle }
              ]}
              primaryLink={{ to: '/strategy/dashboard', label: 'Open Strategy' }}
              secondaryLink={{ to: '/funding/dashboard', label: 'Capital plan' }}
            />

            <ModuleCard
              icon={Network}
              branch="bridge"
              kicker="The Bridge"
              title={bridgeSummary ? 'Cross-Module Intelligence' : 'Verified Liquidity Network'}
              description={bridgeOverview.description}
              score={bridgeOverview.score}
              posture={bridgeOverview.posture}
              surfaceNavigateTo="/bridge/dashboard"
              rows={[
                { label: bridgeSummary ? 'Signals' : 'Records', value: bridgeOverview.recordsCount },
                { label: bridgeSummary ? 'Critical signals' : 'Active opportunities', value: bridgeOverview.activeRecordsCount },
                {
                  label: bridgeSummary ? 'Blocked deps' : 'Pipeline value',
                  value: bridgeSummary
                    ? bridgeOverview.metrics?.blockedDependencies || 0
                    : formatCurrency(bridgeOverview.metrics?.totalOpportunityValue || 0, 'EUR')
                },
                {
                  label: bridgeSummary ? 'Conflicts' : 'Introductions',
                  value: bridgeSummary
                    ? bridgeOverview.metrics?.unresolvedConflicts || 0
                    : bridgeOverview.metrics?.introductionsCount || 0
                },
                {
                  label: bridgeSummary ? 'Attention queue' : 'Qualified',
                  value: bridgeSummary
                    ? bridgeOverview.metrics?.executiveAttentionCount || 0
                    : bridgeOverview.metrics?.qualifiedOpportunitiesCount || 0
                },
                {
                  label: bridgeSummary ? 'Stale signals' : 'Documents',
                  value: bridgeSummary
                    ? bridgeOverview.metrics?.staleSignalCount || 0
                    : bridgeOverview.metrics?.documentsCount || 0
                },
                {
                  label: 'Reports',
                  value: bridgeOverview.metrics?.reportsCount || 0
                },
                { label: 'Latest', value: bridgeOverview.latestTitle }
              ]}
              primaryLink={{ to: '/bridge/dashboard', label: 'Open Bridge' }}
              secondaryLink={{ to: '/funding/dashboard', label: 'Funding feed' }}
            />
          </div>
        </section>

        <section className="ceo-section">
          <SectionHeader
            kicker="Funding Bridge"
            icon={Rocket}
            title="Liquidity & Runway Widget"
            description="Funding data bridged from enterprise backend summary."
          />
          <FundingExecutiveWidget
            summary={{
              ...fundingSummary,
              totalAmountRaised:
                fundingSummary?.totalAmountRaised ?? fundingSummary?.totalRaised ?? 0
            }}
            currency={fundingOverview.currency}
            className="ceo-panel ceo-branch-surface ceo-glass-branch ceo-branch-funding"
          />
          <Card className="ceo-panel ceo-branch-surface ceo-glass-branch ceo-branch-overview">
            <div className="ceo-panel-head">
              <div>
                <div className="ceo-kicker">
                  <Sparkles size={14} />
                  Executive Synergy Signal
                </div>
                <h3 className="ceo-panel-title">M&A + Compliance + Funding + PMI + Ecosystem bridge</h3>
                <p className="muted ceo-panel-copy">
                  CEO’s OS combines core transaction, risk, capital, integration and enterprise branch signals
                  as decision-support intelligence. Outputs require human review before legal, financial,
                  investor or governance action.
                </p>
              </div>
              <div className="ceo-panel-icon">
                <Sparkles size={18} />
              </div>
            </div>
            <div className="ceo-list">
              <MiniRow label="M&A valuation source" value={fundingOverview.suggestedValuationSource} />
              <MiniRow label="Compliance status" value={fundingOverview.complianceStatus} />
              <MiniRow label="Funding window" value={fundingOverview.fundingWindowStatus} />
              <MiniRow label="PMI posture" value={pmiOverview.posture} />
              <MiniRow label="Ecosystem posture" value={ecosystemBrief?.posture || 'Activate branch records'} />
              <MiniRow
                label="Human review"
                value={fundingOverview.humanReviewRequired ? 'Required' : 'Recommended'}
              />
            </div>
          </Card>
        </section>

        <section className="ceo-grid ceo-grid-two">
          <Card className="ceo-panel ceo-branch-surface ceo-glass-branch ceo-branch-overview">
            <div className="ceo-panel-head">
              <div>
                <div className="ceo-kicker">
                  <FileText size={14} />
                  Board packs
                </div>

                <h3 className="ceo-panel-title">Available executive outputs</h3>

                <p className="muted ceo-panel-copy">
                  Entregables ejecutivos listos para demostrar valor en cierre comercial.
                </p>
              </div>

              <div className="ceo-panel-icon">
                <Download size={18} />
              </div>
            </div>

            <div className="ceo-list">
              {availablePacks.map((pack) => (
                <div className="ceo-mini-row" key={pack}>
                  <span className="muted">{pack}</span>
                  <strong>Ready</strong>
                </div>
              ))}
            </div>
          </Card>

          <Card className="ceo-panel ceo-branch-surface ceo-glass-branch ceo-branch-overview">
            <div className="ceo-panel-head">
              <div>
                <div className="ceo-kicker">
                  <AlertTriangle size={14} />
                  Executive priorities
                </div>

                <h3 className="ceo-panel-title">Executive operating priorities</h3>

                <p className="muted ceo-panel-copy">
                  Prioridades de control para mantener el producto enfocado en decision ejecutiva.
                </p>
              </div>

              <div className="ceo-panel-icon">
                <Gauge size={18} />
              </div>
            </div>

            <div className="ceo-list">
              {executivePriorityRows.map((row) => (
                <MiniRow key={row.label} label={row.label} value={row.value} />
              ))}
            </div>
          </Card>
        </section>

        <section className="ceo-section">
          <SectionHeader
            kicker="Next actions"
            icon={TrendingUp}
            title="Close the executive release without opening new product branches"
            description="Las próximas acciones deben enfocarse en QA, datos demo enterprise y validación comercial de las ramas conectadas."
          />

          <div className="ceo-grid ceo-grid-three">
            <ActionCard
              icon={LockKeyhole}
              title="Run final QA"
              description="Revisar rutas, exportaciones y que no existan cortes visuales o datos incoherentes."
              to="/ma/dashboard"
              label="Start with M&A"
            />

            <ActionCard
              icon={Sparkles}
              title="Integrate logo"
              description="Mantener marca para una fase posterior y priorizar ahora la validación operativa de ramas enterprise."
              to="/governance/dashboard"
              label="Review governance"
            />

            <ActionCard
              icon={FileText}
              title="Prepare executive demo"
              description="Preparar demo enterprise de 20 minutos recorriendo M&A, Compliance, Funding, PMI y ramas ecosystem."
              to="/dashboard"
              label="Use this overview"
            />
          </div>
        </section>
      </div>

      {isBoardPackOpen ? (
        <BoardPackModal
          boardPack={boardPack}
          loading={boardPackLoading}
          error={boardPackError}
          onClose={() => setIsBoardPackOpen(false)}
          onExport={handleExportBoardPack}
        />
      ) : null}
    </div>
  );
}


