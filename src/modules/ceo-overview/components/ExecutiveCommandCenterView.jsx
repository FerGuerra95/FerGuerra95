import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import lionMark from '../../../assets/brand/ceos-os-emblem-lion.webp';
import { CorporateHealthRadar } from './CorporateHealthRadar.jsx';
import { ReadinessIndexCard } from './ReadinessIndexCard.jsx';
import {
  formatModuleScoreDisplay,
  formatScoreLabel,
  normalizeScoreOrNull
} from '../utils/ceoOverviewTruthfulness.js';

const commandCenterCss = `
  .ceo-executive-command-page {
    --ceo-gold: #d4af37;
    --ceo-gold-soft: #f3da8a;
    --ceo-gold-deep: #8a6a16;
    --ceo-black: #060608;
    --ceo-charcoal: #0c0c10;
    --ceo-line: rgba(212, 175, 55, 0.22);
    width: min(1480px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 20px;
    color: #e8edf5;
  }

  .ceo-command-section {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .ceo-command-section-shell {
    border-radius: 22px;
    border: 1px solid rgba(212, 175, 55, 0.24);
    background:
      radial-gradient(circle at 0% 0%, rgba(212, 175, 55, 0.06), transparent 42%),
      linear-gradient(180deg, rgba(8, 8, 12, 0.98), rgba(4, 4, 6, 0.99));
    box-shadow:
      0 18px 48px rgba(0, 0, 0, 0.42),
      inset 0 1px 0 rgba(243, 218, 138, 0.06);
    padding: 18px 18px 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .ceo-command-section-header {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding-bottom: 2px;
    border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  }

  .ceo-command-number {
    flex: 0 0 auto;
    width: 42px;
    height: 42px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    font-size: 12px;
    font-weight: 850;
    letter-spacing: 0.04em;
    color: #111827;
    border: 1px solid rgba(243, 218, 138, 0.72);
    background: linear-gradient(145deg, #fcecb8, #d4af37 55%, #9a7518);
    box-shadow:
      0 0 0 1px rgba(212, 175, 55, 0.18),
      0 0 22px rgba(212, 175, 55, 0.28);
  }

  .ceo-command-section-title {
    margin: 0;
    font-size: 20px;
    letter-spacing: -0.03em;
    color: rgba(248, 250, 252, 0.98);
  }

  .ceo-command-section-copy {
    margin: 4px 0 0;
    color: rgba(203, 213, 225, 0.72);
    line-height: 1.5;
    font-size: 13px;
  }

  .ceo-command-section-body {
    min-width: 0;
  }

  .ceo-command-hero {
    position: relative;
    overflow: hidden;
    border-radius: 18px;
    border: 1px solid rgba(212, 175, 55, 0.32);
    background:
      radial-gradient(circle at 78% 18%, rgba(212, 175, 55, 0.22), transparent 46%),
      radial-gradient(circle at 12% 0%, rgba(212, 175, 55, 0.14), transparent 38%),
      linear-gradient(135deg, rgba(4, 4, 6, 0.99), rgba(10, 10, 14, 0.98));
    box-shadow:
      inset 0 1px 0 rgba(243, 218, 138, 0.12),
      0 12px 36px rgba(0, 0, 0, 0.35);
    padding: 20px;
  }

  .ceo-command-hero::before {
    content: '';
    position: absolute;
    right: 6%;
    top: 50%;
    width: min(38vw, 320px);
    height: min(38vw, 320px);
    transform: translateY(-50%);
    border-radius: 999px;
    background: radial-gradient(circle, rgba(212, 175, 55, 0.18) 0%, rgba(212, 175, 55, 0.04) 52%, transparent 72%);
    pointer-events: none;
    z-index: 0;
  }

  .ceo-sovereign-watermark {
    position: absolute;
    right: 2%;
    top: 50%;
    width: min(34vw, 300px);
    opacity: 0.34;
    pointer-events: none;
    transform: translateY(-52%);
    filter: drop-shadow(0 0 36px rgba(212, 175, 55, 0.42));
    z-index: 0;
  }

  .ceo-sovereign-watermark img {
    width: 100%;
    height: auto;
    display: block;
  }

  .ceo-command-status-grid {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.55fr) minmax(210px, 0.72fr) minmax(210px, 0.72fr);
    gap: 12px;
    align-items: stretch;
  }

  .ceo-command-hero-main {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }

  .ceo-command-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .ceo-command-badge {
    display: inline-flex;
    align-items: center;
    min-height: 26px;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid rgba(212, 175, 55, 0.28);
    background: rgba(212, 175, 55, 0.08);
    color: rgba(243, 218, 138, 0.92);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .ceo-command-hero-title {
    margin: 0;
    font-size: clamp(28px, 3.2vw, 40px);
    line-height: 1.04;
    letter-spacing: -0.05em;
    color: rgba(248, 250, 252, 0.98);
  }

  .ceo-command-hero-title span {
    display: block;
    margin-top: 8px;
    font-size: clamp(14px, 1.5vw, 17px);
    color: rgba(226, 232, 240, 0.72);
    letter-spacing: -0.02em;
    line-height: 1.45;
    font-weight: 500;
  }

  .ceo-command-hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }

  .ceo-gold-primary-action.button {
    border: 1px solid rgba(243, 218, 138, 0.62);
    color: #111827;
    background: linear-gradient(135deg, #f8e6a8 0%, #d4af37 46%, #9a7518 100%);
    box-shadow:
      0 12px 28px rgba(212, 175, 55, 0.32),
      inset 0 1px 0 rgba(255, 251, 234, 0.55);
  }

  .ceo-gold-primary-action.button:hover:not(:disabled) {
    filter: brightness(1.04);
    box-shadow:
      0 16px 34px rgba(212, 175, 55, 0.38),
      0 0 22px rgba(212, 175, 55, 0.14),
      inset 0 1px 0 rgba(255, 251, 234, 0.68);
  }

  .ceo-gold-secondary-action.button {
    border: 1px solid rgba(212, 175, 55, 0.42);
    color: rgba(248, 250, 252, 0.96);
    background: rgba(6, 6, 8, 0.88);
    box-shadow: inset 0 1px 0 rgba(212, 175, 55, 0.08);
  }

  .ceo-gold-secondary-action.button:hover:not(:disabled) {
    border-color: rgba(243, 218, 138, 0.58);
    background: rgba(12, 12, 16, 0.96);
  }

  .ceo-command-card {
    border-radius: 16px;
    border: 1px solid rgba(212, 175, 55, 0.18);
    background:
      linear-gradient(180deg, rgba(12, 12, 16, 0.96), rgba(6, 6, 8, 0.98));
    padding: 14px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: inset 0 1px 0 rgba(243, 218, 138, 0.04);
    transition: border-color 160ms ease, box-shadow 160ms ease;
  }

  .ceo-command-card:hover {
    border-color: rgba(212, 175, 55, 0.28);
    box-shadow:
      inset 0 1px 0 rgba(243, 218, 138, 0.06),
      0 8px 22px rgba(0, 0, 0, 0.22);
  }

  .ceo-command-card-kicker {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: rgba(243, 218, 138, 0.86);
    font-weight: 760;
  }

  .ceo-command-card h3 {
    margin: 0;
    font-size: 24px;
    letter-spacing: -0.04em;
    color: rgba(248, 250, 252, 0.98);
  }

  .ceo-command-card p {
    margin: 0;
    color: rgba(203, 213, 225, 0.74);
    line-height: 1.45;
    font-size: 12px;
  }

  .ceo-command-card strong {
    font-size: 15px;
    letter-spacing: -0.02em;
    color: rgba(248, 250, 252, 0.96);
  }

  .ceo-readiness-card {
    align-items: center;
    text-align: center;
    gap: 10px;
  }

  .ceo-readiness-ring-wrap {
    position: relative;
    width: 112px;
    height: 112px;
    margin: 2px auto 0;
  }

  .ceo-readiness-ring {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  .ceo-readiness-ring-track {
    fill: none;
    stroke: rgba(212, 175, 55, 0.14);
    stroke-width: 7;
  }

  .ceo-readiness-ring-progress {
    fill: none;
    stroke: url(#ceoReadinessGold);
    stroke-width: 7;
    stroke-linecap: round;
    transition: stroke-dashoffset 420ms ease;
  }

  .ceo-readiness-ring-center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    pointer-events: none;
  }

  .ceo-readiness-ring-center strong {
    font-size: 22px;
    letter-spacing: -0.04em;
    color: rgba(248, 250, 252, 0.98);
  }

  .ceo-readiness-ring-center span {
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(243, 218, 138, 0.78);
    font-weight: 700;
  }

  .ceo-readiness-meta {
    width: 100%;
    font-size: 11px;
    color: rgba(203, 213, 225, 0.72);
    line-height: 1.45;
  }

  .ceo-decision-queue-grid,
  .ceo-intelligence-grid,
  .ceo-module-readiness-grid,
  .ceo-briefing-grid {
    display: grid;
    gap: 10px;
  }

  .ceo-decision-queue-grid,
  .ceo-intelligence-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .ceo-module-readiness-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .ceo-readiness-radar-row {
    display: grid;
    grid-template-columns: minmax(240px, 0.9fr) minmax(0, 1.1fr);
    gap: 10px;
    margin-top: 10px;
  }

  .ceo-readiness-radar-panel {
    min-width: 0;
  }

  .ceo-executive-command-page .executive-readiness-card {
    border: none;
    background: transparent;
    padding: 0;
    box-shadow: none;
  }

  .ceo-executive-command-page .executive-radar-panel {
    gap: 12px;
  }

  .ceo-briefing-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .ceo-workflow-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 10px;
  }

  .ceo-workflow-step {
    border-radius: 14px;
    border: 1px solid rgba(212, 175, 55, 0.18);
    background: linear-gradient(180deg, rgba(12, 12, 16, 0.96), rgba(6, 6, 8, 0.98));
    padding: 12px;
    min-width: 0;
    box-shadow: inset 0 1px 0 rgba(243, 218, 138, 0.04);
  }

  .ceo-workflow-step strong {
    display: block;
    margin-top: 2px;
    font-size: 13px;
    color: rgba(248, 250, 252, 0.96);
  }

  .ceo-workflow-step p {
    margin: 6px 0 0;
    font-size: 11px;
    color: rgba(203, 213, 225, 0.68);
    line-height: 1.42;
  }

  .ceo-decision-card-priority {
    font-size: 10px;
    font-weight: 780;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(243, 218, 138, 0.9);
  }

  .ceo-decision-card-status {
    margin-top: auto;
    display: inline-flex;
    width: fit-content;
    border-radius: 999px;
    padding: 4px 9px;
    border: 1px solid rgba(212, 175, 55, 0.24);
    background: rgba(212, 175, 55, 0.08);
    color: rgba(243, 218, 138, 0.92);
    font-size: 10px;
    font-weight: 760;
    letter-spacing: 0.04em;
  }

  .ceo-module-score-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .ceo-module-score-row strong {
    font-size: 20px;
    letter-spacing: -0.03em;
    color: rgba(248, 250, 252, 0.98);
  }

  .ceo-module-progress {
    height: 6px;
    border-radius: 999px;
    background: rgba(212, 175, 55, 0.1);
    overflow: hidden;
    margin-top: 2px;
  }

  .ceo-module-progress span {
    display: block;
    height: 100%;
    border-radius: inherit;
  }

  .ceo-truthfulness-banner {
    border-radius: 14px;
    border: 1px solid rgba(212, 175, 55, 0.22);
    background: rgba(6, 6, 8, 0.82);
    padding: 10px 14px;
    font-size: 12px;
    color: rgba(226, 232, 240, 0.82);
  }

  @media (max-width: 1180px) {
    .ceo-command-status-grid {
      grid-template-columns: 1fr;
    }

    .ceo-decision-queue-grid,
    .ceo-intelligence-grid,
    .ceo-module-readiness-grid,
    .ceo-briefing-grid,
    .ceo-workflow-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .ceo-readiness-radar-row {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .ceo-decision-queue-grid,
    .ceo-intelligence-grid,
    .ceo-module-readiness-grid,
    .ceo-briefing-grid,
    .ceo-workflow-grid {
      grid-template-columns: 1fr;
    }
  }
`;

function progressWidth(score) {
  if (score === null || score === undefined || !Number.isFinite(Number(score))) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(Number(score))));
}

function mapQueueStatus(posture, { actionRequired = false, opportunity = false } = {}) {
  if (posture === 'insufficient_data' || posture === 'not_available') {
    return 'Pending inputs';
  }

  if (actionRequired) {
    return 'Action required';
  }

  if (opportunity) {
    return 'Opportunity';
  }

  return 'Review';
}

function buildDecisionQueueCards({
  complianceOverview,
  riskOverview,
  fundingOverview,
  maOverview,
  commandDecisionQueue
}) {
  const fromApi = (moduleKey) =>
    commandDecisionQueue.find((item) => String(item?.module || '').toLowerCase().includes(moduleKey));

  const complianceApi = fromApi('compliance');
  const riskApi = fromApi('risk');
  const fundingApi = fromApi('funding');
  const maApi = fromApi('ma') || fromApi('m&a');

  return [
    {
      title: 'Compliance Exposure',
      priority: complianceOverview.openAlerts > 0 ? 'High' : 'Medium',
      summary:
        complianceApi?.recommendedAction ||
        (complianceOverview.openAlerts > 0
          ? `${complianceOverview.openAlerts} open alerts require executive review.`
          : complianceOverview.posture === 'insufficient_data'
            ? 'Insufficient persisted compliance inputs.'
            : 'Compliance posture available for review.'),
      status:
        complianceApi?.status ||
        mapQueueStatus(complianceOverview.posture, {
          actionRequired: complianceOverview.openAlerts > 0
        })
    },
    {
      title: 'Risk Radar Alert',
      priority:
        riskOverview.posture === 'executive_attention' || (riskOverview.activeRecordsCount || 0) > 0
          ? 'High'
          : 'Medium',
      summary:
        riskApi?.recommendedAction ||
        riskOverview.latestTitle ||
        (riskOverview.posture === 'insufficient_data'
          ? 'Risk register data pending for executive signal.'
          : 'Risk posture available for human review.'),
      status:
        riskApi?.status ||
        mapQueueStatus(riskOverview.posture, {
          actionRequired: (riskOverview.activeRecordsCount || 0) > 0
        })
    },
    {
      title: 'Funding Window',
      priority: fundingOverview.requiresExecutiveUpdate ? 'High' : 'Medium',
      summary:
        fundingApi?.recommendedAction ||
        (fundingOverview.executiveSignalEligible
          ? `Funding window: ${fundingOverview.fundingWindowStatus}. Runway signal requires review.`
          : 'Funding inputs pending for executive readiness signal.'),
      status:
        fundingApi?.status ||
        mapQueueStatus(fundingOverview.posture, {
          actionRequired: Boolean(fundingOverview.requiresExecutiveUpdate)
        })
    },
    {
      title: 'M&A Opportunity Update',
      priority: maOverview.executiveSignalEligible ? 'Medium' : 'Watch',
      summary:
        maApi?.recommendedAction ||
        maOverview.targetName ||
        (maOverview.posture === 'insufficient_data'
          ? 'No persisted deal or case eligible for executive scoring.'
          : 'M&A posture available for executive review.'),
      status:
        maApi?.status ||
        mapQueueStatus(maOverview.posture, {
          opportunity: maOverview.executiveSignalEligible
        })
    }
  ];
}

function buildIntelligenceCards({
  executiveSignal,
  complianceOverview,
  fundingOverview,
  maOverview,
  commandAlerts,
  lastReportPrepared
}) {
  const criticalAlert = commandAlerts[0];
  const highestImpact =
    criticalAlert?.title ||
    (complianceOverview.openAlerts > 0
      ? `Compliance exposure (${complianceOverview.openAlerts} alerts)`
      : executiveSignal.title || 'Pending executive signal');

  const bestOpportunity =
    maOverview.executiveSignalEligible && maOverview.targetName
      ? `${maOverview.targetName} · ${maOverview.posture}`
      : fundingOverview.executiveSignalEligible
        ? `Funding readiness signal · ${fundingOverview.posture}`
        : 'Pending inputs';

  const focusArea =
    complianceOverview.posture === 'insufficient_data'
      ? 'Compliance inputs'
      : riskOverviewPostureLabel(complianceOverview, fundingOverview, maOverview);

  return [
    {
      title: 'Highest Impact',
      summary: highestImpact,
      status: criticalAlert?.severity ? 'Action required' : 'Review'
    },
    {
      title: 'Best Opportunity',
      summary: bestOpportunity,
      status: maOverview.executiveSignalEligible || fundingOverview.executiveSignalEligible
        ? 'Opportunity'
        : 'Pending inputs'
    },
    {
      title: 'Focus Area',
      summary: focusArea,
      status: 'Review'
    },
    {
      title: 'Board Review Draft',
      summary: lastReportPrepared
        ? 'Board review draft prepared for executive review.'
        : 'Draft assembly pending supporting inputs.',
      status: lastReportPrepared ? 'Prepared' : 'Draft'
    }
  ];
}

function riskOverviewPostureLabel(complianceOverview, fundingOverview, maOverview) {
  if (complianceOverview.openAlerts > 0) {
    return 'Compliance exposure and evidence gaps';
  }

  if (fundingOverview.requiresExecutiveUpdate) {
    return 'Funding window and runway review';
  }

  if (maOverview.posture && maOverview.posture !== 'insufficient_data') {
    return `M&A posture · ${maOverview.posture}`;
  }

  return 'Cross-module executive review';
}

function buildModuleReadinessCards({
  maOverview,
  fundingOverview,
  complianceOverview,
  riskOverview,
  pmiOverview,
  governanceOverview,
  strategyOverview
}) {
  return [
    { key: 'ma', label: 'M&A', overview: maOverview, tone: '#10b981', route: '/ma/dashboard' },
    {
      key: 'funding',
      label: 'Funding',
      overview: fundingOverview,
      tone: '#f59e0b',
      route: '/funding/dashboard'
    },
    {
      key: 'compliance',
      label: 'Compliance',
      overview: complianceOverview,
      tone: '#3b82f6',
      route: '/compliance/dashboard'
    },
    { key: 'risk', label: 'Risk', overview: riskOverview, tone: '#ef4444', route: '/risk/dashboard' },
    { key: 'pmi', label: 'PMI / Synergies', overview: pmiOverview, tone: '#a855f7', route: '/pmi/dashboard' },
    {
      key: 'governance',
      label: 'Governance',
      overview: governanceOverview,
      tone: '#0ea5e9',
      route: '/governance/dashboard'
    },
    {
      key: 'strategy',
      label: 'Strategy',
      overview: strategyOverview,
      tone: '#38bdf8',
      route: '/strategy/dashboard'
    }
  ];
}

function ReadinessRing({ score, label }) {
  const hasScore = Number.isFinite(Number(score));
  const pct = hasScore ? progressWidth(score) : 0;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="ceo-readiness-ring-wrap">
      <svg className="ceo-readiness-ring" viewBox="0 0 96 96" aria-hidden="true">
        <defs>
          <linearGradient id="ceoReadinessGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3da8a" />
            <stop offset="52%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#9a7518" />
          </linearGradient>
        </defs>
        <circle className="ceo-readiness-ring-track" cx="48" cy="48" r={radius} />
        <circle
          className="ceo-readiness-ring-progress"
          cx="48"
          cy="48"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="ceo-readiness-ring-center">
        <strong>{label}</strong>
        <span>Unified readiness</span>
      </div>
    </div>
  );
}

function SectionBlock({ number, title, description, children }) {
  return (
    <section className="ceo-command-section">
      <div className="ceo-command-section-shell">
        <div className="ceo-command-section-header">
          <div className="ceo-command-number">{number}</div>
          <div>
            <h2 className="ceo-command-section-title">{title}</h2>
            <p className="ceo-command-section-copy">{description}</p>
          </div>
        </div>
        <div className="ceo-command-section-body">{children}</div>
      </div>
    </section>
  );
}

export function ExecutiveCommandCenterView({
  executiveSignal,
  commandReadiness,
  commandRadarAxes = [],
  dealReadinessCombined,
  complianceDragPenalty,
  legalHealthRadar,
  maValuationSignal,
  commandDecisionQueue,
  commandAlerts,
  maOverview,
  complianceOverview,
  fundingOverview,
  pmiOverview,
  governanceOverview,
  riskOverview,
  strategyOverview,
  executivePriorityRows,
  lastReportGeneratedAt,
  canGenerateBoardPack,
  boardPackLoading,
  onGenerateBoardPack,
  onViewExecutiveBriefing
}) {
  const unifiedReadinessScore = normalizeScoreOrNull(dealReadinessCombined);
  const unifiedReadinessLabel = formatModuleScoreDisplay(unifiedReadinessScore);

  const decisionQueueCards = buildDecisionQueueCards({
    complianceOverview,
    riskOverview,
    fundingOverview,
    maOverview,
    commandDecisionQueue
  });

  const intelligenceCards = buildIntelligenceCards({
    executiveSignal,
    complianceOverview,
    fundingOverview,
    maOverview,
    commandAlerts,
    lastReportPrepared: Boolean(lastReportGeneratedAt)
  });

  const moduleCards = buildModuleReadinessCards({
    maOverview,
    fundingOverview,
    complianceOverview,
    riskOverview,
    pmiOverview,
    governanceOverview,
    strategyOverview
  });

  const topPriorities = executivePriorityRows.slice(0, 3);

  return (
    <>
      <style>{commandCenterCss}</style>

      <div className="ceo-executive-command-page" data-testid="ceo-command-center-enterprise">
        <div className="ceo-truthfulness-banner">
          Decision-support only · Human review required · Board review draft (not board-approved) · Not
          legal or investment advice.
        </div>

        <SectionBlock
          number="01"
          title="Executive Status"
          description="Operational posture, decision readiness and top executive priorities."
        >
          <div className="ceo-command-hero">
            <div className="ceo-sovereign-watermark" aria-hidden="true">
              <img src={lionMark} alt="" />
            </div>

            <div className="ceo-command-status-grid">
              <div className="ceo-command-hero-main">
                <div className="ceo-command-badge-row">
                  <span className="ceo-command-badge">Executive Command Center</span>
                  <span className="ceo-command-badge">Decision support</span>
                  <span className="ceo-command-badge">Human review required</span>
                </div>

                <h1 className="ceo-command-hero-title">
                  Operational with priority reviews.
                  <span>
                    Critical systems are active. Priority items require executive review.
                  </span>
                </h1>

                <div className="ceo-command-hero-actions">
                  <Button
                    onClick={onGenerateBoardPack}
                    loading={boardPackLoading}
                    disabled={!canGenerateBoardPack}
                    className="ceo-gold-primary-action"
                  >
                    <FileText size={16} />
                    Generate Board Review Draft
                  </Button>
                  <Button
                    onClick={onViewExecutiveBriefing}
                    variant="secondary"
                    className="ceo-gold-secondary-action"
                  >
                    View Executive Briefing
                  </Button>
                </div>
              </div>

              <article className="ceo-command-card ceo-readiness-card">
                <div className="ceo-command-card-kicker">Unified readiness</div>
                <ReadinessRing
                  score={unifiedReadinessScore}
                  label={unifiedReadinessLabel}
                />
                <p className="ceo-readiness-meta">
                  M&A valuation ({formatScoreLabel(maValuationSignal ?? maOverview.score)}) + legal/compliance
                  ({formatScoreLabel(legalHealthRadar)}) blend · Compliance drag{' '}
                  {complianceDragPenalty != null ? `${complianceDragPenalty} pts` : 'N/A'} · Human review
                  required.
                </p>
              </article>

              <article className="ceo-command-card">
                <div className="ceo-command-card-kicker">Top priorities</div>
                {topPriorities.length ? (
                  topPriorities.map((row) => (
                    <p key={row.label}>
                      <strong>{row.label}:</strong> {row.value}
                    </p>
                  ))
                ) : (
                  <p>No priority rows available · Pending inputs.</p>
                )}
              </article>
            </div>
          </div>
        </SectionBlock>

        <SectionBlock
          number="02"
          title="Executive Decision Queue"
          description="Priority decisions across compliance, risk, funding and M&A."
        >
          <div className="ceo-decision-queue-grid">
            {decisionQueueCards.map((card) => (
              <article key={card.title} className="ceo-command-card">
                <div className="ceo-decision-card-priority">{card.priority}</div>
                <strong>{card.title}</strong>
                <p>{card.summary}</p>
                <span className="ceo-decision-card-status">{card.status}</span>
              </article>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock
          number="03"
          title="Cross-Module Intelligence Summary"
          description="Highest-impact signals and review focus across branches."
        >
          <div className="ceo-intelligence-grid">
            {intelligenceCards.map((card) => (
              <article key={card.title} className="ceo-command-card">
                <div className="ceo-command-card-kicker">{card.title}</div>
                <p>{card.summary}</p>
                <span className="ceo-decision-card-status">{card.status}</span>
              </article>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock
          number="04"
          title="Module Readiness Overview"
          description="Branch readiness scores from existing DSS signals. Missing data remains N/A."
        >
          <div className="ceo-module-readiness-grid">
            {moduleCards.map((module) => (
              <Link
                key={module.key}
                to={module.route}
                className="ceo-command-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="ceo-command-card-kicker">{module.label}</div>
                <div className="ceo-module-score-row">
                  <strong>{formatModuleScoreDisplay(module.overview.score)}</strong>
                  <span className="ceo-decision-card-status">
                    {module.overview.posture || 'insufficient_data'}
                  </span>
                </div>
                <div className="ceo-module-progress">
                  <span
                    style={{
                      width: `${progressWidth(module.overview.score)}%`,
                      background: module.tone
                    }}
                  />
                </div>
                <p>{formatScoreLabel(module.overview.score)} · DSS signal</p>
              </Link>
            ))}
          </div>

          <div className="ceo-readiness-radar-row">
            <article className="ceo-command-card ceo-readiness-radar-panel">
              <ReadinessIndexCard readiness={commandReadiness} />
            </article>
            <article className="ceo-command-card ceo-readiness-radar-panel">
              <div className="ceo-command-card-kicker">Corporate health radar</div>
              <strong>Readiness by enterprise branch</strong>
              <CorporateHealthRadar axes={commandRadarAxes} />
            </article>
          </div>
        </SectionBlock>

        <SectionBlock
          number="05"
          title="Board Review Workflow"
          description="Draft-first workflow. Human review required before any distribution."
        >
          <div className="ceo-workflow-grid">
            <article className="ceo-workflow-step">
              <div className="ceo-command-card-kicker">Step 1</div>
              <strong>Create Draft</strong>
              <p>Generate board review draft from current executive signals.</p>
            </article>
            <article className="ceo-workflow-step">
              <div className="ceo-command-card-kicker">Step 2</div>
              <strong>Review Signals</strong>
              <p>Validate compliance, risk, funding and M&A posture.</p>
            </article>
            <article className="ceo-workflow-step">
              <div className="ceo-command-card-kicker">Step 3</div>
              <strong>Executive Data Room</strong>
              <p>Confirm supporting data and unresolved dependencies.</p>
            </article>
            <article className="ceo-workflow-step">
              <div className="ceo-command-card-kicker">Step 4</div>
              <strong>Board Review Draft</strong>
              <p>Prepare review context for executive discussion.</p>
            </article>
            <article className="ceo-workflow-step">
              <div className="ceo-command-card-kicker">Step 5</div>
              <strong>Human Review</strong>
              <p>Share only after explicit user approval and review.</p>
            </article>
          </div>
        </SectionBlock>

        <SectionBlock
          number="06"
          title="Executive Briefing Packs"
          description="Draft review packs prepared for executive review — not certified outputs."
        >
          <div className="ceo-briefing-grid">
            <article className="ceo-command-card">
              <strong>Board review draft</strong>
              <p>Status: {lastReportGeneratedAt ? 'Prepared' : 'Draft'}</p>
            </article>
            <article className="ceo-command-card">
              <strong>Compliance review</strong>
              <p>
                Status:{' '}
                {complianceOverview.openAlerts > 0
                  ? 'In review'
                  : complianceOverview.posture === 'insufficient_data'
                    ? 'Pending inputs'
                    : 'Prepared'}
              </p>
            </article>
            <article className="ceo-command-card">
              <strong>Strategic review</strong>
              <p>
                Status:{' '}
                {strategyOverview.posture === 'insufficient_data' ? 'Pending inputs' : 'In review'}
              </p>
            </article>
            <article className="ceo-command-card">
              <strong>Funding review</strong>
              <p>
                Status:{' '}
                {fundingOverview.executiveSignalEligible ? 'Prepared' : 'Pending inputs'}
              </p>
            </article>
          </div>
        </SectionBlock>
      </div>
    </>
  );
}

export default ExecutiveCommandCenterView;
