import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Banknote,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Download,
  FileText,
  Gauge,
  Layers3,
  PieChart,
  Rocket,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  WalletCards
} from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { useNotifications } from '../../../app/providers/NotificationsProvider.jsx';
import { useFundingStore } from '../store/fundingStore.jsx';
import { useFundingEngine } from '../engine/useFundingEngine.js';
import { FundingInputPanel } from '../components/FundingInputPanel.jsx';
import { FundingHeroCard } from '../components/FundingHeroCard.jsx';
import { UseOfFundsCard } from '../components/UseOfFundsCard.jsx';
import { ReadinessChecklistCard } from '../components/ReadinessChecklistCard.jsx';
import { fundingExportApi } from '../services/fundingExportApi.js';
import { fundingEnterpriseApi } from '../services/fundingEnterpriseApi.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import { FundingExecutiveWidget } from '../components/FundingExecutiveWidget.jsx';
import {
  DEMO_FUNDING_INPUTS,
  DEMO_FUNDING_SETTINGS
} from '../../../shared/config/demoData.js';
import {
  SHOW_DEMO_TOOLS,
  DEMO_BUTTON_LABELS,
  DEMO_RESET_LABELS
} from '../../../shared/config/demoMode.js';
import {
  classifyRunwayStatus,
  getDisplayText,
  getOptimalFundingWindowLabel,
  getRunwayStatusLabel,
  toSafeNumber
} from '../utils/fundingExecutiveMetrics.js';

const EMPTY_FUNDING_INPUTS = {
  companyName: '',
  stage: 'Seed',
  currentRevenue: '',
  monthlyBurn: '',
  currentCash: '',
  targetRaise: '',
  preMoneyValuation: '',
  runwayMonthsTarget: '',
  annualGrowthRate: '',
  grossMargin: '',
  dataRoomCompletion: '0',
  founderMarketFit: '0',
  investorInterest: '0',
  teamSize: '',
  hiringPlan: '',
  debtCapacity: '',
  founderOwnership: '',
  existingInvestorOwnership: '',
  optionPool: ''
};

const EMPTY_FUNDING_SETTINGS = {
  reportCurrency: 'EUR',
  scenarioMode: 'balanced'
};

const fundingDashboardCss = `
  .funding-dashboard-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 38px;
  }

  .funding-hero {
    position: relative;
    overflow: hidden;
    border-radius: 38px;
    padding: 38px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      radial-gradient(circle at 8% 2%, rgba(37, 99, 235, 0.38), transparent 30%),
      radial-gradient(circle at 88% 8%, rgba(16, 185, 129, 0.18), transparent 27%),
      radial-gradient(circle at 60% 110%, rgba(245, 158, 11, 0.10), transparent 30%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.99), rgba(15, 23, 42, 0.97));
    box-shadow:
      0 38px 120px rgba(0, 0, 0, 0.42),
      inset 0 1px 0 rgba(255, 255, 255, 0.055);
  }

  .funding-hero::before {
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

  .funding-hero::after {
    content: "";
    position: absolute;
    inset: auto -190px -210px auto;
    width: 520px;
    height: 520px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.13), transparent 70%);
    pointer-events: none;
  }

  .funding-hero-layout {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.42fr) minmax(380px, 0.58fr);
    gap: 36px;
    align-items: stretch;
  }

  .funding-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 26px;
  }

  .funding-title {
    margin: 0;
    max-width: 950px;
    font-size: clamp(42px, 5vw, 72px);
    line-height: 0.92;
    letter-spacing: -0.075em;
  }

  .funding-title span {
    display: block;
    margin-top: 8px;
    color: rgba(226, 232, 240, 0.7);
  }

  .funding-copy {
    max-width: 860px;
    margin: 26px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .funding-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 34px;
  }

  .funding-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .funding-command-item {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.078);
    min-width: 0;
  }

  .funding-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .funding-signal-card {
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

  .funding-signal-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: radial-gradient(circle at 18% 0%, rgba(96, 165, 250, 0.13), transparent 35%);
    pointer-events: none;
  }

  .funding-signal-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .funding-signal-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .funding-icon-box,
  .funding-card-icon,
  .funding-panel-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .funding-icon-box {
    width: 50px;
    height: 50px;
  }

  .funding-card-icon,
  .funding-panel-icon {
    width: 46px;
    height: 46px;
  }

  .funding-signal-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.16;
    letter-spacing: -0.04em;
  }

  .funding-score-module {
    display: grid;
    grid-template-columns: 122px minmax(0, 1fr);
    gap: 22px;
    align-items: center;
    padding: 20px;
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.047);
    border: 1px solid rgba(255, 255, 255, 0.085);
  }

  .funding-score-ring {
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

  .funding-score-core {
    width: 84px;
    height: 84px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.97);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .funding-score-core strong {
    font-size: 25px;
    letter-spacing: -0.055em;
  }

  .funding-score-core strong.is-empty-score {
    font-size: 30px;
    color: rgba(226, 232, 240, 0.72);
  }

  .funding-score-copy strong {
    display: block;
    margin-bottom: 8px;
  }

  .funding-score-copy p {
    margin: 0;
    line-height: 1.62;
  }

  .funding-signal-table {
    display: grid;
    gap: 0;
  }

  .funding-signal-row {
    display: grid;
    grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
    gap: 14px;
    align-items: center;
    padding: 15px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }

  .funding-signal-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .funding-section {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .funding-section-header {
    display: flex;
    justify-content: space-between;
    gap: 28px;
    align-items: flex-end;
  }

  .funding-kicker {
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

  .funding-section-header h2,
  .funding-section-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .funding-section-header p {
    max-width: 820px;
    margin: 11px 0 0;
    line-height: 1.68;
  }

  .funding-grid {
    display: grid;
    gap: 26px;
    align-items: stretch;
  }

  .funding-grid-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .funding-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .funding-kpi-card,
  .funding-panel,
  .funding-flow-card {
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

  .funding-kpi-card {
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

  .funding-kpi-card:hover,
  .funding-flow-card:hover {
    transform: translateY(-3px);
    border-color: rgba(96, 165, 250, 0.25);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .funding-kpi-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .funding-kpi-value {
    margin-top: 12px;
    font-size: 25px;
    font-weight: 790;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .funding-kpi-card p {
    margin: 0;
    line-height: 1.56;
  }

  .funding-panel {
    padding: 31px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .funding-panel-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .funding-panel-title {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .funding-panel-description {
    margin: 11px 0 0;
    line-height: 1.66;
  }

  .funding-glass-block {
    padding: 20px;
    border-radius: 24px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.075);
  }

  .funding-glass-block p {
    line-height: 1.62;
  }

  .funding-thesis-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .funding-thesis-item {
    display: grid;
    grid-template-columns: 34px minmax(0, 1fr);
    gap: 14px;
    align-items: flex-start;
    padding: 18px;
    border-radius: 22px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.078);
    line-height: 1.62;
  }

  .funding-thesis-dot {
    width: 34px;
    height: 34px;
    border-radius: 15px;
    display: grid;
    place-items: center;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.22);
    color: #86efac;
  }

  .funding-mini-stack {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .funding-mini-card {
    padding: 20px;
    border-radius: 24px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.075);
  }

  .funding-mini-card strong {
    display: block;
    margin-bottom: 8px;
  }

  .funding-flow-panel {
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

  .funding-flow-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-top: 22px;
  }

  .funding-flow-card {
    padding: 20px;
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .funding-flow-card strong {
    display: block;
    margin-top: 8px;
  }

  .funding-external-section {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .funding-muted-tight {
    margin-bottom: 0;
  }


  /* MULTINATIONAL PREMIUM FUNDING */
  .funding-multinational-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
    gap: 18px;
    align-items: stretch;
  }

  .funding-premium-panel {
    position: relative;
    overflow: hidden;
    border-radius: 30px;
    padding: 29px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      radial-gradient(circle at 5% 0%, rgba(37, 99, 235, 0.24), transparent 32%),
      radial-gradient(circle at 100% 0%, rgba(16, 185, 129, 0.12), transparent 28%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.96), rgba(15, 23, 42, 0.92));
    box-shadow:
      0 26px 90px rgba(0, 0, 0, 0.28),
      inset 0 1px 0 rgba(255, 255, 255, 0.055);
  }

  .funding-premium-panel::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 46px 46px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.85), transparent 88%);
    pointer-events: none;
  }

  .funding-premium-panel > * {
    position: relative;
    z-index: 1;
  }

  .funding-premium-header {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-items: flex-start;
    margin-bottom: 22px;
  }

  .funding-premium-header h2,
  .funding-premium-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .funding-premium-header p {
    max-width: 760px;
    margin: 10px 0 0;
    line-height: 1.62;
  }

  .funding-premium-icon {
    width: 46px;
    height: 46px;
    flex: 0 0 auto;
    border-radius: 18px;
    display: grid;
    place-items: center;
    color: #bfdbfe;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .funding-premium-row-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 13px;
  }

  .funding-premium-row {
    min-width: 0;
    padding: 16px;
    border-radius: 20px;
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.085);
  }

  .funding-premium-row span {
    display: block;
    margin-bottom: 7px;
    color: rgba(148, 163, 184, 0.96);
    font-size: 11px;
    line-height: 1;
    font-weight: 850;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .funding-premium-row strong {
    display: block;
    color: rgba(248, 250, 252, 0.96);
    font-size: 20px;
    line-height: 1.15;
    letter-spacing: -0.035em;
    overflow-wrap: anywhere;
  }

  .funding-premium-memo {
    padding: 21px;
    border-radius: 24px;
    background:
      radial-gradient(circle at 100% 0%, rgba(16, 185, 129, 0.12), transparent 30%),
      rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.085);
  }

  .funding-premium-decision {
    display: inline-flex;
    width: fit-content;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
    padding: 9px 12px;
    border-radius: 999px;
    color: #bbf7d0;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.24);
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .funding-premium-decision.watch {
    color: #fde68a;
    background: rgba(234, 179, 8, 0.12);
    border-color: rgba(234, 179, 8, 0.24);
  }

  .funding-premium-decision.hold {
    color: #fecaca;
    background: rgba(239, 68, 68, 0.12);
    border-color: rgba(239, 68, 68, 0.24);
  }

  .funding-premium-memo h3 {
    margin: 0;
    font-size: 24px;
    letter-spacing: -0.045em;
  }

  .funding-premium-memo p {
    margin: 10px 0 0;
    line-height: 1.66;
  }

  .funding-premium-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .funding-premium-item {
    display: grid;
    grid-template-columns: 38px minmax(0, 1fr);
    gap: 13px;
    padding: 16px;
    border-radius: 20px;
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.085);
  }

  .funding-premium-item-icon {
    width: 38px;
    height: 38px;
    border-radius: 15px;
    display: grid;
    place-items: center;
    color: #bfdbfe;
    background: rgba(37, 99, 235, 0.14);
    border: 1px solid rgba(96, 165, 250, 0.22);
  }

  .funding-premium-item.is-danger .funding-premium-item-icon {
    color: #fecaca;
    background: rgba(239, 68, 68, 0.12);
    border-color: rgba(239, 68, 68, 0.22);
  }

  .funding-premium-item.is-watch .funding-premium-item-icon {
    color: #fde68a;
    background: rgba(234, 179, 8, 0.12);
    border-color: rgba(234, 179, 8, 0.22);
  }

  .funding-premium-item.is-positive .funding-premium-item-icon {
    color: #bbf7d0;
    background: rgba(16, 185, 129, 0.12);
    border-color: rgba(16, 185, 129, 0.22);
  }

  .funding-premium-item strong {
    display: block;
    margin-bottom: 6px;
    line-height: 1.25;
  }

  .funding-premium-item p {
    margin: 0;
    line-height: 1.56;
  }

  @media (max-width: 1180px) {
    .funding-multinational-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 760px) {
    .funding-premium-panel {
      padding: 24px;
      border-radius: 24px;
    }

    .funding-premium-row-grid,
    .funding-premium-item {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 1180px) {
    .funding-hero-layout {
      grid-template-columns: 1fr;
    }

    .funding-grid-kpis,
    .funding-flow-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 920px) {
    .funding-grid-two,
    .funding-command-bar {
      grid-template-columns: 1fr;
    }

    .funding-section-header {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (max-width: 680px) {
    .funding-dashboard-page {
      gap: 28px;
    }

    .funding-hero {
      padding: 26px;
      border-radius: 28px;
    }

    .funding-grid-kpis,
    .funding-flow-grid {
      grid-template-columns: 1fr;
    }

    .funding-kpi-card,
    .funding-panel,
    .funding-flow-card {
      border-radius: 24px;
    }

    .funding-score-module {
      grid-template-columns: 1fr;
    }

    .funding-signal-row {
      grid-template-columns: 1fr;
      gap: 7px;
    }

    .funding-signal-row strong {
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

function calculateReadinessScore(fundingInputs) {
  const dataRoom = toNumber(fundingInputs.dataRoomCompletion);
  const founderMarketFit = toNumber(fundingInputs.founderMarketFit);
  const investorInterest = toNumber(fundingInputs.investorInterest);

  return Math.round((dataRoom + founderMarketFit + investorInterest) / 3);
}

function getFundingSignal({
  targetRaise,
  runwayAfterRaise,
  impliedDilution,
  readinessScore
}) {
  if (targetRaise <= 0) {
    return {
      score: null,
      title: 'Funding case pending',
      posture: 'Build raise case',
      description:
        'Completa capital objetivo, valoración, burn y readiness para construir una lectura ejecutiva de la ronda.'
    };
  }

  const runwayScore = clampScore((runwayAfterRaise / 24) * 100);
  const dilutionScore = clampScore(100 - Math.max(0, impliedDilution - 10) * 3);
  const score = clampScore(
    readinessScore * 0.45 + runwayScore * 0.32 + dilutionScore * 0.23
  );

  if (score >= 82) {
    return {
      score,
      title: 'Investor-ready raise',
      posture: 'Prepare outreach',
      description:
        'La ronda muestra una combinación sólida de readiness, runway y dilución para preparar narrativa inversora.'
    };
  }

  if (score >= 62) {
    return {
      score,
      title: 'Qualified funding case',
      posture: 'Refine memo',
      description:
        'La ronda tiene base suficiente, aunque conviene reforzar data room, narrativa y sensibilidad de dilución.'
    };
  }

  if (score >= 42) {
    return {
      score,
      title: 'Funding case in progress',
      posture: 'Improve readiness',
      description:
        'El caso requiere mejorar preparación inversora, runway o estructura antes de salir al mercado.'
    };
  }

  return {
    score,
    title: 'Weak funding signal',
    posture: 'Rework case',
    description:
      'La ronda necesita una revisión de inputs, valoración, burn y readiness antes de presentarse a inversores.'
  };
}

function CommandItem({ label, value }) {
  return (
    <div className="funding-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SignalRow({ label, value }) {
  return (
    <div className="funding-signal-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SectionHeader({ kicker, icon: Icon, title, description, right }) {
  return (
    <div className="funding-section-header">
      <div>
        <div className="funding-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h2>{title}</h2>

        <p className="muted">{description}</p>
      </div>

      {right ? <div>{right}</div> : null}
    </div>
  );
}

function PanelHeader({ kicker, icon: Icon, title, description }) {
  return (
    <div className="funding-panel-header">
      <div>
        <div className="funding-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h3 className="funding-panel-title">{title}</h3>

        <p className="muted funding-panel-description">{description}</p>
      </div>

      <div className="funding-panel-icon">
        <Icon size={18} />
      </div>
    </div>
  );
}

function KpiCard({ label, value, description, icon: Icon, tone = '' }) {
  return (
    <article className="funding-kpi-card">
      <div className="funding-kpi-top">
        <div>
          <div className="kpi-label">{label}</div>

          <div className={`funding-kpi-value ${tone}`.trim()}>
            {value}
          </div>
        </div>

        <div className="funding-card-icon">
          <Icon size={18} />
        </div>
      </div>

      <p className="muted">{description}</p>
    </article>
  );
}

function FlowStep({ number, title, text }) {
  return (
    <article className="funding-flow-card">
      <div className="kpi-label">{number}</div>
      <strong>{title}</strong>

      <p className="muted funding-muted-tight" style={{ marginTop: 8 }}>
        {text}
      </p>
    </article>
  );
}

function ThesisList({ items }) {
  if (items.length === 0) {
    return (
      <div className="funding-glass-block">
        <strong>Sin tesis suficiente todavía</strong>

        <p className="muted funding-muted-tight" style={{ marginTop: 8 }}>
          Completa los principales datos de financiación para generar una
          narrativa más sólida para inversores.
        </p>
      </div>
    );
  }

  return (
    <ul className="funding-thesis-list">
      {items.map((item, index) => (
        <li className="funding-thesis-item" key={index}>
          <span className="funding-thesis-dot">
            <CheckCircle2 size={15} />
          </span>

          <span className="muted">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function formatPercentValue(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return 'N/A';

  const normalized = Math.abs(parsed) > 0 && Math.abs(parsed) <= 1
    ? parsed * 100
    : parsed;

  return `${Math.round(normalized)}%`;
}

function formatMonthsValue(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) return 'N/A';

  return `${Math.round(parsed)} meses`;
}

function normalizeSummary(summary = {}) {
  const latest = summary?.latestRound || {};
  const projectedRunwayMonths =
    toSafeNumber(summary.projectedRunwayMonths) ??
    toSafeNumber(latest.projectedRunwayMonths);
  const monthlyBurnRate =
    toSafeNumber(summary.monthlyBurnRate) ?? toSafeNumber(latest.monthlyBurnRate);
  const estimatedDilution =
    toSafeNumber(summary.estimatedDilution) ??
    toSafeNumber(latest.dilutionPercentage) ??
    toSafeNumber(summary.averageDilution);
  const totalAmountRaised =
    toSafeNumber(summary.totalAmountRaised) ?? toSafeNumber(summary.totalRaised) ?? 0;

  return {
    totalAmountRaised,
    latestRoundType: latest.roundType || summary.latestRoundType || '',
    latestInvestorName: latest.investorName || summary.latestInvestorName || '',
    latestClosingDate: latest.closingDate || summary.latestClosingDate || '',
    latestPostMoneyValuation:
      toSafeNumber(summary.latestPostMoneyValuation) ??
      toSafeNumber(latest.valuationPostMoney),
    estimatedDilution,
    monthlyBurnRate,
    projectedRunwayMonths,
    fundingRiskStatus:
      latest.riskStatus || summary.fundingRiskStatus || summary.riskStatus || 'normal',
    complianceStatus: summary.complianceStatus || 'not_available',
    suggestedPreMoneyValuation: toSafeNumber(summary.suggestedPreMoneyValuation),
    suggestedValuationSource: summary.suggestedValuationSource || 'not_available',
    optimalFundingWindowStatus: summary.optimalFundingWindowStatus || 'insufficient_data',
    humanReviewRequired: Boolean(summary.humanReviewRequired),
    executiveSignals: Array.isArray(summary.executiveSignals) ? summary.executiveSignals : [],
    requiresExecutiveUpdate: Boolean(summary.requiresExecutiveUpdate),
    capitalEfficiencyScore: toSafeNumber(summary.capitalEfficiencyScore),
    roundsCount: toSafeNumber(summary.roundsCount) ?? 0
  };
}

function getFundingDecisionMemo({ fundingSignal, readinessScore, runwayAfterRaise, impliedDilution }) {
  const score = fundingSignal?.score;

  if (score === null || score === undefined) {
    return {
      decision: 'Build funding case',
      tone: 'watch',
      title: 'Funding case not ready yet',
      summary:
        'La ronda todavía necesita inputs completos de capital objetivo, valoración, burn, runway y readiness antes de poder presentarse como caso inversor defendible.'
    };
  }

  if (score >= 82) {
    return {
      decision: 'Prepare investor outreach',
      tone: '',
      title: 'Investor-ready funding case',
      summary:
        'La ronda muestra una combinación sólida de readiness, runway y dilución. El siguiente paso es preparar outreach, investor memo, data room y pipeline de inversores cualificados.'
    };
  }

  if (score >= 62) {
    return {
      decision: 'Proceed with validation',
      tone: 'watch',
      title: 'Qualified case with validation points',
      summary:
        'El caso de financiación es presentable como borrador ejecutivo, pero conviene reforzar data room, narrativa, comparables y sensibilidad de dilución antes de circularlo ampliamente.'
    };
  }

  if (readinessScore < 50 || runwayAfterRaise < 12 || impliedDilution > 30) {
    return {
      decision: 'Hold market outreach',
      tone: 'hold',
      title: 'Funding case needs rework',
      summary:
        'La ronda no debería salir todavía al mercado. Hay que revisar readiness, runway, dilución y narrativa para evitar conversaciones débiles con inversores.'
    };
  }

  return {
    decision: 'Improve readiness',
    tone: 'watch',
    title: 'Funding case in progress',
    summary:
      'Existe una base inicial, pero el caso necesita mejorar preparación inversora, claridad de uso de fondos y solidez de la tesis antes de activar outreach.'
  };
}

function buildFundingRiskItems({
  readinessScore,
  runwayAfterRaise,
  impliedDilution,
  dataRoomCompletion,
  investorInterest,
  founderOwnership,
  targetRaise
}) {
  const items = [];

  if (targetRaise <= 0) {
    items.push({
      title: 'Capital target missing',
      description:
        'No hay capital objetivo definido. La ronda necesita una cifra clara antes de construir memo o escenarios.',
      tone: 'watch'
    });
  }

  if (runwayAfterRaise > 0 && runwayAfterRaise < 18) {
    items.push({
      title: 'Runway below investor comfort',
      description:
        'El runway post-ronda queda por debajo de 18 meses. Conviene revisar burn, capital objetivo o plan operativo.',
      tone: 'watch'
    });
  }

  if (impliedDilution > 25) {
    items.push({
      title: 'Dilution pressure',
      description:
        'La dilución estimada supera el 25%. Revisar valoración, tamaño de ronda, tramos o estructura alternativa.',
      tone: impliedDilution > 35 ? 'danger' : 'watch'
    });
  }

  if (dataRoomCompletion < 70) {
    items.push({
      title: 'Data room not ready',
      description:
        'El data room necesita más documentación antes de conversaciones serias con inversores institucionales.',
      tone: 'watch'
    });
  }

  if (investorInterest < 50) {
    items.push({
      title: 'Investor demand not validated',
      description:
        'La señal de interés inversor todavía es débil. Conviene validar narrativa y target list antes de abrir ronda.',
      tone: 'watch'
    });
  }

  if (founderOwnership > 0 && founderOwnership < 50) {
    items.push({
      title: 'Founder ownership sensitivity',
      description:
        'La propiedad fundadora queda en una zona sensible. Revisar cap table, option pool y estructura de la ronda.',
      tone: 'danger'
    });
  }

  if (readinessScore >= 75 && runwayAfterRaise >= 18 && impliedDilution <= 25 && items.length === 0) {
    items.push({
      title: 'Institutional-ready posture',
      description:
        'La ronda presenta una postura razonablemente sólida para preparar memo, data room y pipeline inversor.',
      tone: 'positive'
    });
  }

  if (items.length === 0) {
    items.push({
      title: 'No critical funding red flags',
      description:
        'No se detectan alertas críticas con los inputs actuales. Mantener revisión de escenarios y narrativa.',
      tone: 'positive'
    });
  }

  return items;
}

function buildMultinationalFundingPack({
  fundingInputs,
  fundingSettings,
  reportCurrency,
  companyName,
  stage,
  targetRaise,
  currentCash,
  monthlyBurn,
  preMoneyValuation,
  postMoneyValuation,
  runwayAfterRaise,
  impliedDilution,
  readinessScore,
  fundingSignal
}) {
  const dataRoomCompletion = toNumber(fundingInputs.dataRoomCompletion);
  const founderMarketFit = toNumber(fundingInputs.founderMarketFit);
  const investorInterest = toNumber(fundingInputs.investorInterest);
  const currentRevenue = toNumber(fundingInputs.currentRevenue);
  const annualGrowthRate = toNumber(fundingInputs.annualGrowthRate);
  const grossMargin = toNumber(fundingInputs.grossMargin);
  const debtCapacity = toNumber(fundingInputs.debtCapacity);
  const founderOwnership = toNumber(fundingInputs.founderOwnership);
  const existingInvestorOwnership = toNumber(fundingInputs.existingInvestorOwnership);
  const optionPool = toNumber(fundingInputs.optionPool);
  const teamSize = toNumber(fundingInputs.teamSize);
  const hiringPlan = toNumber(fundingInputs.hiringPlan);

  return {
    capitalRows: [
      ['Company', companyName],
      ['Stage', stage],
      ['Currency', reportCurrency],
      ['Scenario', fundingSettings?.scenarioMode || 'balanced'],
      ['Target raise', formatCurrency(targetRaise, reportCurrency)],
      ['Pre-money valuation', formatCurrency(preMoneyValuation, reportCurrency)],
      ['Post-money valuation', formatCurrency(postMoneyValuation, reportCurrency)],
      ['Current cash', formatCurrency(currentCash, reportCurrency)]
    ],
    readinessRows: [
      ['Investor readiness', `${readinessScore}/100`],
      ['Data room', formatPercentValue(dataRoomCompletion)],
      ['Founder-market fit', `${founderMarketFit}/100`],
      ['Investor interest', `${investorInterest}/100`],
      ['Current revenue', formatCurrency(currentRevenue, reportCurrency)],
      ['Annual growth', formatPercentValue(annualGrowthRate)],
      ['Gross margin', formatPercentValue(grossMargin)],
      ['Debt capacity', formatCurrency(debtCapacity, reportCurrency)]
    ],
    capTableRows: [
      ['Founder ownership', formatPercentValue(founderOwnership)],
      ['Existing investors', formatPercentValue(existingInvestorOwnership)],
      ['Option pool', formatPercentValue(optionPool)],
      ['Implied dilution', `${impliedDilution}%`],
      ['Monthly burn', formatCurrency(monthlyBurn, reportCurrency)],
      ['Runway post-raise', formatMonthsValue(runwayAfterRaise)],
      ['Team size', teamSize > 0 ? teamSize : 'N/A'],
      ['Hiring plan', hiringPlan > 0 ? hiringPlan : 'N/A']
    ],
    memo: getFundingDecisionMemo({
      fundingSignal,
      readinessScore,
      runwayAfterRaise,
      impliedDilution
    }),
    riskItems: buildFundingRiskItems({
      readinessScore,
      runwayAfterRaise,
      impliedDilution,
      dataRoomCompletion,
      investorInterest,
      founderOwnership,
      targetRaise
    })
  };
}

function FundingPremiumPanel({ kicker, icon: Icon, title, description, children }) {
  return (
    <section className="funding-premium-panel">
      <div className="funding-premium-header">
        <div>
          <div className="funding-kicker">
            <Icon size={14} />
            {kicker}
          </div>

          <h2>{title}</h2>
          <p className="muted">{description}</p>
        </div>

        <div className="funding-premium-icon">
          <Icon size={18} />
        </div>
      </div>

      {children}
    </section>
  );
}

function FundingPremiumRow({ label, value }) {
  return (
    <div className="funding-premium-row">
      <span>{label}</span>
      <strong>{value === 0 ? 0 : value || 'N/A'}</strong>
    </div>
  );
}

function FundingPremiumMemo({ memo }) {
  return (
    <div className="funding-premium-memo">
      <span className={`funding-premium-decision ${memo.tone}`.trim()}>
        <ShieldCheck size={13} />
        {memo.decision}
      </span>

      <h3>{memo.title}</h3>
      <p className="muted">{memo.summary}</p>
    </div>
  );
}

function FundingPremiumItem({ title, description, tone = '' }) {
  return (
    <div className={`funding-premium-item ${tone ? `is-${tone}` : ''}`.trim()}>
      <div className="funding-premium-item-icon">
        <ArrowRight size={15} />
      </div>

      <div>
        <strong>{title}</strong>
        <p className="muted">{description}</p>
      </div>
    </div>
  );
}
export function FundingDashboardPage() {
  const {
    fundingInputs,
    setFundingInputs,
    fundingSettings,
    setFundingSettings
  } = useFundingStore();

  const { pushToast } = useNotifications();
  const [rounds, setRounds] = useState([]);
  const [summary, setSummary] = useState(null);
  const [isLoadingFundingData, setIsLoadingFundingData] = useState(true);
  const [fundingDataError, setFundingDataError] = useState('');

  const derived = useFundingEngine({
    fundingInputs,
    fundingSettings
  });

  const reportCurrency = fundingSettings?.reportCurrency || 'EUR';
  const companyName = fundingInputs?.companyName?.trim() || 'Sin compañía activa';
  const stage = fundingInputs?.stage || 'Seed';
  const scenarioMode = fundingSettings?.scenarioMode || 'balanced';

  const currentCash = toNumber(fundingInputs.currentCash);
  const targetRaise = toNumber(fundingInputs.targetRaise);
  const monthlyBurn = toNumber(fundingInputs.monthlyBurn);
  const preMoneyValuation = toNumber(fundingInputs.preMoneyValuation);
  const postMoneyValuation = preMoneyValuation + targetRaise;

  const runwayAfterRaise =
    monthlyBurn > 0 ? Math.round((currentCash + targetRaise) / monthlyBurn) : 0;

  const impliedDilution =
    postMoneyValuation > 0
      ? Math.round((targetRaise / postMoneyValuation) * 100)
      : 0;

  const readinessScore = calculateReadinessScore(fundingInputs);
  const thesisItems = getSafeArray(derived.thesis);
  const readinessChecklist = getSafeArray(derived.readinessChecklist);
  const useOfFunds = getSafeArray(derived.useOfFunds);

  const fundingSignal = getFundingSignal({
    targetRaise,
    runwayAfterRaise,
    impliedDilution,
    readinessScore
  });

  const scoreAngle = `${(fundingSignal.score ?? 0) * 3.6}deg`;
  const normalizedSummary = normalizeSummary(summary || {});
  const runwayStatus = getRunwayStatusLabel(normalizedSummary.projectedRunwayMonths);
  const windowStatus = getOptimalFundingWindowLabel(
    normalizedSummary.optimalFundingWindowStatus
  );
  const runwayRiskTone = classifyRunwayStatus(normalizedSummary.projectedRunwayMonths);

  const fundingMultinationalPack = buildMultinationalFundingPack({
    fundingInputs,
    fundingSettings,
    reportCurrency,
    companyName,
    stage,
    targetRaise,
    currentCash,
    monthlyBurn,
    preMoneyValuation,
    postMoneyValuation,
    runwayAfterRaise,
    impliedDilution,
    readinessScore,
    fundingSignal
  });

  useEffect(() => {
    let cancelled = false;

    async function loadFundingData() {
      setIsLoadingFundingData(true);
      setFundingDataError('');

      try {
        const bridgeSnapshot = await fundingEnterpriseApi.getExecutiveBridgeSnapshot();
        const summaryData = bridgeSnapshot?.summary ?? {};

        if (!cancelled) {
          setRounds(Array.isArray(bridgeSnapshot?.rounds) ? bridgeSnapshot.rounds : []);
          setSummary(summaryData && typeof summaryData === 'object' ? summaryData : {});
          if (bridgeSnapshot?.meta?.summaryFailed || bridgeSnapshot?.meta?.hubFailed) {
            setFundingDataError('Funding bridge in degraded mode. Showing best available data.');
          }
        }
      } catch {
        if (!cancelled) {
          setFundingDataError('Funding intelligence temporarily unavailable.');
          setRounds([]);
          setSummary({});
        }
      } finally {
        if (!cancelled) {
          setIsLoadingFundingData(false);
        }
      }
    }

    loadFundingData();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateField(key, value) {
    setFundingInputs((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  function updateSetting(key, value) {
    setFundingSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  function handleLoadDemoFunding() {
    setFundingInputs((prev) => ({
      ...prev,
      ...DEMO_FUNDING_INPUTS
    }));

    setFundingSettings((prev) => ({
      ...prev,
      ...DEMO_FUNDING_SETTINGS
    }));

    pushToast('Demo Funding preparada: Nova Industrial Growth S.L.');
  }

  function handleResetDemoFunding() {
    setFundingInputs({
      ...EMPTY_FUNDING_INPUTS
    });

    setFundingSettings({
      ...EMPTY_FUNDING_SETTINGS
    });

    pushToast('Funding limpiado');
  }

  function handleExport() {
    const ok = fundingExportApi.exportMemo({
      fundingInputs,
      fundingSettings,
      derived
    });

    pushToast(
      ok
        ? 'Funding memo preparado para impresión'
        : 'El navegador ha bloqueado la ventana emergente'
    );
  }

  return (
    <div className="page">
      <style>{fundingDashboardCss}</style>

      <div className="page-grid">
        <FundingInputPanel
          fundingInputs={fundingInputs}
          fundingSettings={fundingSettings}
          onFieldChange={updateField}
          onSettingsChange={updateSetting}
        />

        <div className="funding-dashboard-page">
          <section className="funding-hero">
            <div className="funding-hero-layout">
              <div>
                <div className="funding-badge-row">
                  <Badge>Funding Workspace</Badge>
                  <Badge>Capital Strategy</Badge>
                  <Badge>{stage}</Badge>
                  <Badge>{scenarioMode}</Badge>
                </div>

                <h1 className="funding-title">
                  Funding Command Center.
                  <span>Raise capital with a sharper story.</span>
                </h1>

                <p className="funding-copy">
                  Vista ejecutiva del proceso de financiación: capital objetivo,
                  runway, dilución estimada, uso de fondos, readiness inversor y
                  memo exportable para preparar una ronda más defendible.
                </p>
                <p className="muted" style={{ marginTop: 10 }}>
                  Funding Intelligence is a decision-support layer. Financial, legal and investor
                  actions require human review.
                </p>

                <div className="funding-actions">
                  {SHOW_DEMO_TOOLS ? (
                    <>
                      <Button onClick={handleLoadDemoFunding} variant="secondary">
                        <Sparkles size={16} />
                        {DEMO_BUTTON_LABELS.funding}
                      </Button>

                      <Button onClick={handleResetDemoFunding} variant="secondary">
                        <RotateCcw size={16} />
                        {DEMO_RESET_LABELS.funding}
                      </Button>
                    </>
                  ) : null}

                  <Button onClick={handleExport} variant="secondary">
                    <Download size={16} />
                    Exportar memo
                  </Button>
                </div>

                <div className="funding-command-bar">
                  <CommandItem
                    label="Latest round"
                    value={normalizedSummary.latestRoundType || 'No funding rounds yet'}
                  />
                  <CommandItem
                    label="Capital raised"
                    value={formatCurrency(
                      normalizedSummary.totalAmountRaised,
                      reportCurrency
                    )}
                  />
                  <CommandItem
                    label="Funding window"
                    value={windowStatus}
                  />
                </div>
              </div>

              <aside className="funding-signal-card">
                <div className="funding-signal-inner">
                  <div className="funding-signal-top">
                    <div>
                      <div className="kpi-label">Funding Signal</div>
                      <div className="funding-signal-title">
                        {fundingSignal.title}
                      </div>
                    </div>

                    <div className="funding-icon-box">
                      <Rocket size={21} />
                    </div>
                  </div>

                  <div className="funding-score-module">
                    <div
                      className="funding-score-ring"
                      style={{ '--score-angle': scoreAngle }}
                    >
                      <div className="funding-score-core">
                        <strong className={fundingSignal.score === null ? 'is-empty-score' : ''}>
                          {fundingSignal.score === null ? '—' : fundingSignal.score}
                        </strong>
                      </div>
                    </div>

                    <div className="funding-score-copy">
                      <strong>{fundingSignal.posture}</strong>

                      <p className="muted">
                        {fundingSignal.description}
                      </p>
                    </div>
                  </div>

                  <div className="funding-signal-table">
                    <SignalRow
                      label="Runway"
                      value={
                        normalizedSummary.projectedRunwayMonths === null
                          ? 'Insufficient data'
                          : `${Math.round(normalizedSummary.projectedRunwayMonths)} meses`
                      }
                    />

                    <SignalRow
                      label="Funding risk"
                      value={normalizedSummary.fundingRiskStatus || 'Not available'}
                    />
                    <SignalRow
                      label="Compliance status"
                      value={getDisplayText(normalizedSummary.complianceStatus, 'Not available')}
                    />

                    <SignalRow
                      label="Latest investor"
                      value={normalizedSummary.latestInvestorName || 'Pending data'}
                    />

                    <SignalRow
                      label="Post-money"
                      value={
                        normalizedSummary.latestPostMoneyValuation === null
                          ? 'Pending data'
                          : formatCurrency(
                              normalizedSummary.latestPostMoneyValuation,
                              reportCurrency
                            )
                      }
                    />
                    <SignalRow
                      label="Executive sync"
                      value={
                        normalizedSummary.requiresExecutiveUpdate
                          ? 'Requires update'
                          : 'Synced'
                      }
                    />
                  </div>
                </div>
              </aside>
            </div>
          </section>

          {normalizedSummary.executiveSignals.length > 0 ? (
            <Card className="funding-panel">
              <PanelHeader
                kicker="Executive signals"
                icon={ShieldCheck}
                title="Bridge Signals"
                description="Funding, Compliance and M&A inputs combined as defensive decision-support signals."
              />
              <div className="funding-mini-stack">
                {normalizedSummary.executiveSignals.slice(0, 4).map((signal, index) => (
                  <div className="funding-mini-card" key={`${signal}-${index}`}>
                    <p className="muted funding-muted-tight">{signal}</p>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          <section className="funding-section">
            <SectionHeader
              kicker="Raise overview"
              icon={Activity}
              title="Funding metrics at a glance"
              description="Una lectura rápida de capital objetivo, runway, dilución y readiness antes de preparar memo o conversación con inversores."
            />

            <div className="funding-grid funding-grid-kpis">
              <KpiCard
                label="Capital raised"
                value={formatCurrency(normalizedSummary.totalAmountRaised, reportCurrency)}
                description="Funding rounds aggregate"
                icon={Banknote}
              />

              <KpiCard
                label="Runway post-raise"
                value={
                  normalizedSummary.projectedRunwayMonths === null
                    ? 'Insufficient data'
                    : `${Math.round(normalizedSummary.projectedRunwayMonths)} meses`
                }
                description="Estimated from latest summary"
                icon={Gauge}
              />

              <KpiCard
                label="Dilución estimada"
                value={
                  normalizedSummary.estimatedDilution === null
                    ? 'Pending data'
                    : `${Math.round(normalizedSummary.estimatedDilution)}%`
                }
                description="Latest / average dilution"
                icon={PieChart}
                tone={
                  normalizedSummary.estimatedDilution !== null &&
                  normalizedSummary.estimatedDilution > 25
                    ? 'text-warning'
                    : ''
                }
              />

              <KpiCard
                label="Investor Readiness"
                value={
                  normalizedSummary.capitalEfficiencyScore === null
                    ? 'Pending data'
                    : `${Math.round(normalizedSummary.capitalEfficiencyScore)}/100`
                }
                description="Capital efficiency"
                icon={Target}
                tone={runwayRiskTone === 'critical' ? 'text-warning' : 'text-success'}
              />
            </div>
          </section>

          <section className="funding-section">
            <SectionHeader
              kicker="Funding rounds"
              icon={BriefcaseBusiness}
              title="Round history"
              description="Round type, amount raised, valuation, dilution, investor and closing date from enterprise backend."
            />
            <Card className="funding-panel">
              {isLoadingFundingData ? (
                <p className="muted">Loading funding rounds...</p>
              ) : fundingDataError ? (
                <p className="muted">{fundingDataError}</p>
              ) : rounds.length === 0 ? (
                <p className="muted">
                  No funding rounds registered yet. Add a round to activate Funding Intelligence.
                </p>
              ) : (
                <div className="funding-mini-stack">
                  {rounds.map((round) => (
                    <div key={round.id} className="funding-mini-card">
                      <strong>{round.roundType || 'Not available'}</strong>
                      <p className="muted funding-muted-tight">
                        Raised:{' '}
                        {formatCurrency(toNumber(round.amountRaised), reportCurrency)} | Investor:{' '}
                        {round.investorName || 'Pending data'} | Post-money:{' '}
                        {round.valuationPostMoney
                          ? formatCurrency(toNumber(round.valuationPostMoney), reportCurrency)
                          : 'Pending data'}
                      </p>
                      <p className="muted funding-muted-tight" style={{ marginTop: 6 }}>
                        Dilution:{' '}
                        {round.dilutionPercentage === null || round.dilutionPercentage === undefined
                          ? 'Pending data'
                          : `${Math.round(toNumber(round.dilutionPercentage))}%`}{' '}
                        | Closing date: {round.closingDate || 'Not available'} | Status:{' '}
                        {round.status || 'Not available'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </section>

          <section className="funding-multinational-grid">
            <FundingPremiumPanel
              kicker="Multinational funding"
              icon={BriefcaseBusiness}
              title="International Capital Stack"
              description="Vista ejecutiva de capital, valoración, moneda, escenario y runway para presentar la ronda como caso de financiación institucional."
            >
              <div className="funding-premium-row-grid">
                {fundingMultinationalPack.capitalRows.map(([label, value]) => (
                  <FundingPremiumRow key={label} label={label} value={value} />
                ))}
              </div>
            </FundingPremiumPanel>

            <FundingPremiumPanel
              kicker="Investor committee"
              icon={Sparkles}
              title="Investor Committee Memo"
              description="Lectura tipo comité sobre si la ronda está lista para outreach, requiere validación o debe rehacerse antes de salir al mercado."
            >
              <FundingPremiumMemo memo={fundingMultinationalPack.memo} />
            </FundingPremiumPanel>
          </section>

          <section className="funding-multinational-grid">
            <FundingPremiumPanel
              kicker="Readiness pack"
              icon={Target}
              title="Investor Readiness Pack"
              description="Resumen de tracción, data room, growth, margen, interés inversor y capacidad de financiación alternativa."
            >
              <div className="funding-premium-row-grid">
                {fundingMultinationalPack.readinessRows.map(([label, value]) => (
                  <FundingPremiumRow key={label} label={label} value={value} />
                ))}
              </div>
            </FundingPremiumPanel>

            <FundingPremiumPanel
              kicker="Red flags"
              icon={ShieldCheck}
              title="Funding Red Flags & Mitigants"
              description="Riesgos principales de la ronda y acciones recomendadas antes de presentar el caso a inversores."
            >
              <div className="funding-premium-list">
                {fundingMultinationalPack.riskItems.map((item, index) => (
                  <FundingPremiumItem
                    key={`${item.title}-${index}`}
                    title={item.title}
                    description={item.description}
                    tone={item.tone}
                  />
                ))}
              </div>
            </FundingPremiumPanel>
          </section>

          <section className="funding-multinational-grid">
            <FundingPremiumPanel
              kicker="Capital structure"
              icon={PieChart}
              title="Cap Table & Dilution View"
              description="Lectura ejecutiva de dilución, propiedad fundadora, option pool, burn, runway y equipo asociado al plan de financiación."
            >
              <div className="funding-premium-row-grid">
                {fundingMultinationalPack.capTableRows.map(([label, value]) => (
                  <FundingPremiumRow key={label} label={label} value={value} />
                ))}
              </div>
            </FundingPremiumPanel>

            <FundingPremiumPanel
              kicker="Board narrative"
              icon={FileText}
              title="Funding Board Narrative"
              description="Resumen para dirección, comité o inversores sobre cómo la ronda se transforma en crecimiento, runway y control de dilución."
            >
              <div className="funding-premium-list">
                <FundingPremiumItem
                  title="Capital objective"
                  description={`La compañía plantea una ronda de ${formatCurrency(targetRaise, reportCurrency)} con una valoración post-money estimada de ${formatCurrency(postMoneyValuation, reportCurrency)}.`}
                  tone="positive"
                />

                <FundingPremiumItem
                  title="Runway impact"
                  description={`La financiación dejaría aproximadamente ${runwayAfterRaise} meses de runway post-ronda con el burn mensual actual.`}
                  tone={runwayAfterRaise >= 18 ? 'positive' : 'watch'}
                />

                <FundingPremiumItem
                  title="Dilution control"
                  description={`La dilución estimada es del ${impliedDilution}%, una señal clave para founders, inversores existentes y comité.`}
                  tone={impliedDilution > 25 ? 'watch' : 'positive'}
                />
              </div>
            </FundingPremiumPanel>
          </section>
          <section className="funding-flow-panel">
            <SectionHeader
              kicker="Operating logic"
              icon={Layers3}
              title="From inputs to investor-ready memo"
              description="CEO’s OS convierte los datos de financiación en una estructura clara: capital, runway, dilución, uso de fondos y narrativa de inversión."
            />

            <div className="funding-flow-grid">
              <FlowStep
                number="01"
                title="Define round"
                text="Capital objetivo, valoración, burn, caja y escenario de ronda."
              />

              <FlowStep
                number="02"
                title="Model runway"
                text="Cuántos meses compra la ronda y qué margen operativo deja."
              />

              <FlowStep
                number="03"
                title="Control dilution"
                text="Impacto sobre post-money, founders, inversores y option pool."
              />

              <FlowStep
                number="04"
                title="Build memo"
                text="Narrativa, use of funds, readiness y argumentos para inversores."
              />
            </div>
          </section>

          <section className="funding-external-section">
            <SectionHeader
              kicker="Capital cockpit"
              icon={BarChart3}
              title="Funding economics and runway posture"
              description="Resumen visual del caso de financiación y de sus principales señales económicas."
            />

            <FundingExecutiveWidget
              summary={{
                ...normalizedSummary,
                totalAmountRaised: normalizedSummary.totalAmountRaised
              }}
              currency={reportCurrency}
              className="funding-panel"
            />

            <FundingHeroCard derived={derived} settings={fundingSettings} />
          </section>

          <section className="funding-grid funding-grid-two">
            <div className="funding-external-section">
              <SectionHeader
                kicker="Use of funds"
                icon={WalletCards}
                title="Capital allocation"
                description="Distribución del capital para explicar cómo la ronda se transforma en crecimiento operativo."
              />

              <UseOfFundsCard
                useOfFunds={useOfFunds}
                currency={reportCurrency}
              />
            </div>

            <Card className="funding-panel">
              <PanelHeader
                kicker="Raise narrative"
                icon={TrendingUp}
                title="Raise Overview"
                description="Resumen ejecutivo de la ronda y principales argumentos para inversores."
              />

              <div className="funding-glass-block">
                <p className="muted funding-muted-tight">
                  {derived.summary}
                </p>
              </div>

              <ThesisList items={thesisItems} />
            </Card>
          </section>

          <section className="funding-grid funding-grid-two">
            <Card className="funding-panel">
              <PanelHeader
                kicker="Funding memo"
                icon={FileText}
                title="Funding Memo"
                description="Lectura preparada para convertir los datos de financiación en una narrativa clara de inversión."
              />

              <div className="funding-mini-stack">
                <div className="funding-mini-card">
                  <strong>Post-money valuation</strong>

                  <p className="muted funding-muted-tight">
                    {formatCurrency(postMoneyValuation, reportCurrency)}{' '}
                    estimados tras la ronda.
                  </p>
                </div>

                <div className="funding-mini-card">
                  <strong>Use of funds</strong>

                  <p className="muted funding-muted-tight">
                    Distribución del capital hacia crecimiento, equipo,
                    producto, ventas y reserva operativa.
                  </p>
                </div>

                <div className="funding-mini-card">
                  <strong>Exportable memo</strong>

                  <p className="muted funding-muted-tight">
                    El memo permite preparar una vista imprimible para revisión
                    interna o conversación con inversores.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="funding-panel">
              <PanelHeader
                kicker="Investor readiness"
                icon={ShieldCheck}
                title="Investor Readiness"
                description="Checklist de preparación para salir al mercado con data room, narrativa y señales de tracción."
              />

              <ReadinessChecklistCard
                readinessChecklist={readinessChecklist.slice(0, 3)}
              />

              <div className="funding-glass-block">
                <strong>Next action</strong>

                <p className="muted funding-muted-tight" style={{ marginTop: 8 }}>
                  {readinessScore >= 75
                    ? 'Preparar outreach, materiales y pipeline de inversores.'
                    : 'Reforzar data room, tesis y señales de tracción antes de iniciar conversaciones.'}
                </p>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
