import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Download,
  FileText,
  Gauge,
  Layers3,
  LockKeyhole,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { useMAStore } from '../../ma/store/maStore.jsx';
import { useComplianceStore } from '../../compliance/store/complianceStore.js';
import { useComplianceEngine } from '../../compliance/engine/useComplianceEngine.js';
import { useFundingStore } from '../../funding/store/fundingStore.jsx';
import { useFundingEngine } from '../../funding/engine/useFundingEngine.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';

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
    min-height: 560px;
    border-radius: 38px;
    padding: 44px;
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
    inset: auto -190px -210px auto;
    width: 520px;
    height: 520px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.13), transparent 70%);
    pointer-events: none;
  }

  .ceo-hero-layout {
    position: relative;
    z-index: 1;
    min-height: 470px;
    display: grid;
    grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.92fr);
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

  .ceo-signal-card {
    position: relative;
    width: 100%;
    max-width: 460px;
    justify-self: end;
    border-radius: 32px;
    padding: 26px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.086), rgba(255,255,255,0.026)),
      rgba(15, 23, 42, 0.76);
    border: 1px solid rgba(148, 163, 184, 0.2);
    backdrop-filter: blur(22px);
    box-shadow:
      0 26px 70px rgba(0, 0, 0, 0.24),
      inset 0 1px 0 rgba(255,255,255,0.05);
    overflow: hidden;
  }

  .ceo-signal-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: radial-gradient(circle at 18% 0%, rgba(96, 165, 250, 0.13), transparent 35%);
    pointer-events: none;
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
    .ceo-grid-two {
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
    .ceo-grid-kpis {
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

function getMAOverview(maStore = {}) {
  const deals = getSafeArray(
    maStore.deals ||
    maStore.savedDeals ||
    maStore.cases ||
    maStore.savedCases ||
    maStore.maCases
  );

  const activeDeal =
    maStore.activeDeal ||
    maStore.currentDeal ||
    maStore.selectedDeal ||
    deals[0] ||
    null;

  const targetName =
    activeDeal?.targetName ||
    activeDeal?.name ||
    activeDeal?.companyName ||
    maStore.targetName ||
    maStore.companyName ||
    'M&A workspace';

  const reportCount = getSafeArray(
    maStore.reports ||
    maStore.generatedReports ||
    maStore.exportedReports
  ).length;

  const score = deals.length > 0 ? clampScore(72 + Math.min(18, deals.length * 3)) : 64;

  return {
    score,
    title: deals.length > 0 ? 'M&A pipeline active' : 'M&A case ready',
    posture: deals.length > 0 ? 'Review deal signals' : 'Prepare premium case',
    targetName,
    dealsCount: deals.length,
    reportCount,
    description:
      deals.length > 0
        ? 'M&A ya funciona como capa premium para valoración, deal intelligence y reporting ejecutivo.'
        : 'M&A está preparado como primer módulo premium. Carga o revisa una demo para mostrar el flujo end-to-end.'
  };
}

function getComplianceOverview({ suppliers, alerts, evidenceItems, reviews }) {
  const safeSuppliers = getSafeArray(suppliers);
  const safeAlerts = getSafeArray(alerts);
  const safeEvidence = getSafeArray(evidenceItems);
  const safeReviews = getSafeArray(reviews);

  const openAlerts = getOpenAlertsCount(safeAlerts);
  const averageRisk =
    safeSuppliers.length > 0
      ? safeSuppliers.reduce((total, supplier) => total + toNumber(supplier?.riskScore), 0) /
        safeSuppliers.length
      : 0;

  const score = safeSuppliers.length > 0
    ? clampScore(100 - averageRisk + Math.min(14, safeEvidence.length * 2) + Math.min(10, safeReviews.length * 2) - openAlerts * 4)
    : 60;

  return {
    score,
    title: openAlerts > 0 ? 'Compliance exposure monitored' : 'Compliance posture controlled',
    posture: openAlerts > 0 ? 'Review open alerts' : 'Maintain controls',
    supplierCount: safeSuppliers.length,
    openAlerts,
    evidenceCount: safeEvidence.length,
    reviewCount: safeReviews.length,
    description:
      openAlerts > 0
        ? 'Compliance ya centraliza proveedores, alertas, evidencias, revisión humana y reporting defendible.'
        : 'Compliance presenta una base premium para control de proveedores, evidencias y Board Pack.'
  };
}

function getFundingOverview({ fundingInputs, fundingSettings }) {
  const targetRaise = toNumber(fundingInputs?.targetRaise);
  const currentCash = toNumber(fundingInputs?.currentCash);
  const monthlyBurn = toNumber(fundingInputs?.monthlyBurn);
  const preMoney = toNumber(fundingInputs?.preMoneyValuation);
  const postMoney = preMoney + targetRaise;
  const readiness = calculateFundingReadiness(fundingInputs);
  const runway = monthlyBurn > 0 ? Math.round((currentCash + targetRaise) / monthlyBurn) : 0;
  const dilution = postMoney > 0 ? Math.round((targetRaise / postMoney) * 100) : 0;
  const currency = fundingSettings?.reportCurrency || 'EUR';

  const score = targetRaise > 0
    ? clampScore(readiness * 0.44 + clampScore((runway / 24) * 100) * 0.34 + clampScore(100 - Math.max(0, dilution - 10) * 3) * 0.22)
    : 58;

  return {
    score,
    title: targetRaise > 0 ? 'Funding board case prepared' : 'Funding case pending',
    posture: targetRaise > 0 ? 'Validate investor memo' : 'Build funding case',
    targetRaise,
    runway,
    dilution,
    readiness,
    currency,
    description:
      targetRaise > 0
        ? 'Funding ya estructura capital stack, readiness, use of funds, data room y Board Memo.'
        : 'Funding está listo como tercera rama premium. Completa inputs o carga demo para exportar memo.'
  };
}

function getExecutiveSignal({ maScore, complianceScore, fundingScore }) {
  const score = clampScore((maScore + complianceScore + fundingScore) / 3);

  if (score >= 82) {
    return {
      score,
      title: 'Executive OS ready for demo',
      posture: 'Prepare enterprise pitch',
      description:
        'M&A, Compliance y Funding tienen una base premium suficiente para presentar CEO’s OS como MVP ejecutivo vendible.'
    };
  }

  if (score >= 68) {
    return {
      score,
      title: 'Premium MVP in closing stage',
      posture: 'Run final QA',
      description:
        'El producto ya tiene las ramas clave. La prioridad es QA final, logo, demo ejecutiva y materiales comerciales.'
    };
  }

  return {
    score,
    title: 'Executive layer needs polish',
    posture: 'Complete module signals',
    description:
      'La capa ejecutiva ya existe, pero conviene reforzar datos, QA o exportaciones antes de la demo.'
  };
}

function CommandItem({ label, value, branch = 'overview' }) {
  return (
    <div className={`ceo-command-item ceo-branch-surface ceo-glass-branch ceo-branch-${branch}`}>
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
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
  secondaryLink
}) {
  return (
    <Card className={`ceo-module-card ceo-branch-surface ceo-glass-branch ceo-branch-${branch}`}>
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
        <MiniRow label="Signal score" value={`${score}/100`} />
        <MiniRow label="Current posture" value={posture} />

        {rows.map((row) => (
          <MiniRow key={row.label} label={row.label} value={row.value} />
        ))}
      </div>

      <div className="ceo-link-row">
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
  );
}

function ActionCard({ icon: Icon, branch = 'overview', title, description, to, label }) {
  return (
    <article className={`ceo-action-card ceo-branch-surface ceo-glass-branch ceo-branch-${branch}`}>
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

  useComplianceEngine({
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
    suppliers: safeSuppliers,
    alerts: safeAlerts,
    evidenceItems: safeEvidenceItems,
    reviews: safeReviews
  });
  const fundingOverview = getFundingOverview({
    fundingInputs,
    fundingSettings
  });

  const executiveSignal = getExecutiveSignal({
    maScore: maOverview.score,
    complianceScore: complianceOverview.score,
    fundingScore: fundingOverview.score
  });

  const scoreAngle = `${executiveSignal.score * 3.6}deg`;
  const availablePacks = [
    'M&A Deal Brief / IC Memo / Data Room',
    'Compliance Board Pack',
    'Funding Board Memo / Data Room'
  ];

  return (
    <div className="page">
      <style>{ceoOverviewCss}</style>

      <div className="ceo-overview-page">
        <section className="ceo-hero ceo-branch-surface ceo-glass-branch ceo-branch-overview">
          <div className="ceo-hero-layout">
            <div>
              <div className="ceo-badge-row">
                <Badge>CEO Overview</Badge>
                <Badge>Executive Command Center</Badge>
                <Badge>DSS Layer</Badge>
                <Badge>MVP Premium</Badge>
              </div>

              <h1 className="ceo-title">
                Executive Command Center.
                <span>One view for corporate intelligence.</span>
              </h1>

              <p className="ceo-copy">
                Capa ejecutiva que une las señales principales de M&A,
                Compliance y Funding para presentar CEO’s OS como sistema
                operativo ejecutivo, no como módulos aislados.
              </p>

              <div className="ceo-command-bar">
                <CommandItem branch="ma" label="M&A posture" value={maOverview.posture} />
                <CommandItem branch="compliance" label="Compliance posture" value={complianceOverview.posture} />
                <CommandItem branch="funding" label="Funding posture" value={fundingOverview.posture} />
              </div>
            </div>

            <aside className="ceo-signal-card ceo-branch-surface ceo-glass-branch ceo-branch-overview">
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
                      <strong>{executiveSignal.score}</strong>
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
                  <SignalRow label="M&A Signal" value={`${maOverview.score}/100`} />
                  <SignalRow label="Compliance Signal" value={`${complianceOverview.score}/100`} />
                  <SignalRow label="Funding Signal" value={`${fundingOverview.score}/100`} />
                  <SignalRow label="Board Packs" value={availablePacks.length} />
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="ceo-section">
          <SectionHeader
            kicker="Executive snapshot"
            icon={Activity}
            title="CEO’s OS at a glance"
            description="Lectura rápida del estado del MVP premium: módulos, señales, riesgos, funding y entregables ejecutivos."
          />

          <div className="ceo-grid ceo-grid-kpis">
            <KpiCard
              branch="overview"
              label="MVP status"
              value="Closing"
              description="Producto entrando en cierre vendible."
              icon={CheckCircle2}
              tone="text-success"
            />

            <KpiCard
              branch="ma"
              label="Premium modules"
              value="3 + Overview"
              description="M&A, Compliance, Funding y capa ejecutiva."
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
              value="QA + Logo"
              description="Validación final e integración visual."
              icon={Target}
              tone="text-warning"
            />
          </div>
        </section>

        <section className="ceo-section">
          <SectionHeader
            kicker="Operating modules"
            icon={Layers3}
            title="Three premium workspaces feeding one executive layer"
            description="Esta vista conecta las ramas ya trabajadas para que el producto se entienda como un sistema operativo ejecutivo."
          />

          <div className="ceo-grid ceo-grid-three">
            <ModuleCard
              icon={BriefcaseBusiness}
              kicker="M&A Intelligence"
              title="M&A Command"
              description={maOverview.description}
              score={maOverview.score}
              posture={maOverview.posture}
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
              kicker="Compliance & Risk"
              title="Supply Chain Control"
              description={complianceOverview.description}
              score={complianceOverview.score}
              posture={complianceOverview.posture}
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
              kicker="Funding Strategy"
              title="Capital Readiness"
              description={fundingOverview.description}
              score={fundingOverview.score}
              posture={fundingOverview.posture}
              rows={[
                {
                  label: 'Target raise',
                  value: formatCurrency(fundingOverview.targetRaise, fundingOverview.currency)
                },
                { label: 'Runway', value: `${fundingOverview.runway} meses` },
                { label: 'Dilution', value: `${fundingOverview.dilution}%` }
              ]}
              primaryLink={{ to: '/funding/dashboard', label: 'Open Funding' }}
              secondaryLink={{ to: '/funding/data-room', label: 'Data Room' }}
            />
          </div>
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
                  Entregables premium ya disponibles para demostrar el valor del MVP.
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

                <h3 className="ceo-panel-title">What remains before selling</h3>

                <p className="muted ceo-panel-copy">
                  Esta capa ayuda a cerrar el MVP sin abrir ramas nuevas.
                </p>
              </div>

              <div className="ceo-panel-icon">
                <Gauge size={18} />
              </div>
            </div>

            <div className="ceo-list">
              <MiniRow label="QA final" value="Pending" />
              <MiniRow label="Logo integration" value="Pending" />
              <MiniRow label="Demo script" value="Pending" />
              <MiniRow label="Deck / one-pager" value="Pending" />
            </div>
          </Card>
        </section>

        <section className="ceo-section">
          <SectionHeader
            kicker="Next actions"
            icon={TrendingUp}
            title="Close the MVP without opening new product branches"
            description="Las próximas acciones deben enfocarse en cierre, demo, marca y validación comercial."
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
              description="Incorporar el logo ya creado en landing, login y app shell sin rediseñar todo."
              to="/"
              label="Open landing"
            />

            <ActionCard
              icon={FileText}
              title="Prepare executive demo"
              description="Preparar demo corta y demo enterprise de 20 minutos con enfoque DSS y PoC."
              to="/overview"
              label="Use this overview"
            />
          </div>
        </section>
      </div>
    </div>
  );
}


