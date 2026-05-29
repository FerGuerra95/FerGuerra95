import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import lionMark from '../../../assets/brand/ceos-os-emblem-lion.webp';
import {
  formatModuleScoreDisplay,
  formatScoreLabel
} from '../utils/ceoOverviewTruthfulness.js';

const commandCenterCss = `
  .ceo-executive-command-page {
    --ceo-gold: #d4af37;
    --ceo-gold-soft: #f3da8a;
    --ceo-gold-deep: #8a6a16;
    width: min(1480px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 28px;
    color: #e2e8f0;
  }

  .ceo-command-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .ceo-command-section-header {
    display: flex;
    align-items: flex-start;
    gap: 14px;
  }

  .ceo-command-number {
    flex: 0 0 auto;
    width: 40px;
    height: 40px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    font-size: 12px;
    font-weight: 850;
    color: #111827;
    border: 1px solid rgba(243, 218, 138, 0.55);
    background: linear-gradient(135deg, #f8e6a8, #d4af37);
    box-shadow: 0 0 18px rgba(212, 175, 55, 0.22);
  }

  .ceo-command-section-title {
    margin: 0;
    font-size: 22px;
    letter-spacing: -0.03em;
  }

  .ceo-command-section-copy {
    margin: 6px 0 0;
    color: rgba(203, 213, 225, 0.78);
    line-height: 1.55;
    font-size: 14px;
  }

  .ceo-command-hero {
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    border: 1px solid rgba(212, 175, 55, 0.28);
    background:
      radial-gradient(circle at 12% 0%, rgba(212, 175, 55, 0.2), transparent 38%),
      linear-gradient(135deg, rgba(6, 10, 24, 0.99), rgba(17, 24, 39, 0.98));
    box-shadow: 0 28px 72px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(243, 218, 138, 0.1);
    padding: 24px;
  }

  .ceo-sovereign-watermark {
    position: absolute;
    right: 8px;
    top: -8px;
    width: min(32vw, 280px);
    opacity: 0.2;
    pointer-events: none;
    filter: drop-shadow(0 0 28px rgba(212, 175, 55, 0.35));
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
    grid-template-columns: minmax(0, 1.5fr) minmax(220px, 0.75fr) minmax(220px, 0.75fr);
    gap: 14px;
    align-items: stretch;
  }

  .ceo-command-hero-main {
    display: flex;
    flex-direction: column;
    gap: 14px;
    min-width: 0;
  }

  .ceo-command-hero-title {
    margin: 0;
    font-size: clamp(30px, 3.4vw, 44px);
    line-height: 1.02;
    letter-spacing: -0.05em;
  }

  .ceo-command-hero-title span {
    display: block;
    margin-top: 8px;
    font-size: clamp(15px, 1.6vw, 18px);
    color: rgba(226, 232, 240, 0.76);
    letter-spacing: -0.02em;
    line-height: 1.45;
  }

  .ceo-command-hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }

  .ceo-gold-primary-action.button {
    border: 1px solid rgba(243, 218, 138, 0.58);
    color: #111827;
    background: linear-gradient(135deg, #f3da8a 0%, #d4af37 42%, #b2871d 100%);
    box-shadow: 0 10px 24px rgba(212, 175, 55, 0.24);
  }

  .ceo-gold-secondary-action.button {
    border: 1px solid rgba(212, 175, 55, 0.38);
    color: rgba(248, 250, 252, 0.94);
    background: rgba(15, 23, 42, 0.78);
  }

  .ceo-command-card {
    border-radius: 18px;
    border: 1px solid rgba(212, 175, 55, 0.2);
    background: rgba(15, 23, 42, 0.62);
    padding: 16px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ceo-command-card-kicker {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: rgba(243, 218, 138, 0.82);
  }

  .ceo-command-card h3 {
    margin: 0;
    font-size: 28px;
    letter-spacing: -0.04em;
  }

  .ceo-command-card p {
    margin: 0;
    color: rgba(203, 213, 225, 0.78);
    line-height: 1.5;
    font-size: 13px;
  }

  .ceo-decision-queue-grid,
  .ceo-intelligence-grid,
  .ceo-module-readiness-grid,
  .ceo-briefing-grid {
    display: grid;
    gap: 12px;
  }

  .ceo-decision-queue-grid,
  .ceo-intelligence-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .ceo-module-readiness-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
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
    border: 1px solid rgba(212, 175, 55, 0.22);
    background: rgba(15, 23, 42, 0.55);
    padding: 12px;
    min-width: 0;
  }

  .ceo-workflow-step strong {
    display: block;
    margin-top: 4px;
    font-size: 14px;
  }

  .ceo-workflow-step p {
    margin: 6px 0 0;
    font-size: 12px;
    color: rgba(203, 213, 225, 0.72);
    line-height: 1.45;
  }

  .ceo-decision-card-priority {
    font-size: 11px;
    font-weight: 780;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(243, 218, 138, 0.88);
  }

  .ceo-decision-card-status {
    margin-top: auto;
    display: inline-flex;
    width: fit-content;
    border-radius: 999px;
    padding: 5px 9px;
    border: 1px solid rgba(148, 163, 184, 0.28);
    background: rgba(148, 163, 184, 0.12);
    font-size: 11px;
    font-weight: 760;
  }

  .ceo-module-score-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .ceo-module-score-row strong {
    font-size: 22px;
    letter-spacing: -0.03em;
  }

  .ceo-module-progress {
    height: 7px;
    border-radius: 999px;
    background: rgba(15, 23, 42, 0.9);
    overflow: hidden;
    margin-top: 4px;
  }

  .ceo-module-progress span {
    display: block;
    height: 100%;
    border-radius: inherit;
  }

  .ceo-truthfulness-banner {
    border-radius: 14px;
    border: 1px solid rgba(212, 175, 55, 0.24);
    background: rgba(15, 23, 42, 0.5);
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

function SectionBlock({ number, title, description, children }) {
  return (
    <section className="ceo-command-section">
      <div className="ceo-command-section-header">
        <div className="ceo-command-number">{number}</div>
        <div>
          <h2 className="ceo-command-section-title">{title}</h2>
          <p className="ceo-command-section-copy">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export function ExecutiveCommandCenterView({
  executiveSignal,
  commandReadiness,
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
  const readinessScore = Number(commandReadiness?.score ?? executiveSignal?.score);
  const readinessHasScore = Number.isFinite(readinessScore);
  const readinessLabel = readinessHasScore ? `${Math.round(readinessScore)}/100` : 'N/A';

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
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <Badge>Executive Command Center</Badge>
                  <Badge>Decision support</Badge>
                  <Badge>Human review required</Badge>
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
                  <Button onClick={onViewExecutiveBriefing} className="ceo-gold-secondary-action">
                    View Executive Briefing
                  </Button>
                </div>
              </div>

              <article className="ceo-command-card">
                <div className="ceo-command-card-kicker">Decision readiness</div>
                <h3>{readinessLabel}</h3>
                <p>
                  Trend {commandReadiness?.trend || 'stable'} · Confidence{' '}
                  {commandReadiness?.confidence ?? 0}% · Human review required.
                </p>
                <div className="ceo-module-progress">
                  <span
                    style={{
                      width: readinessHasScore ? `${progressWidth(readinessScore)}%` : '0%',
                      background: 'linear-gradient(90deg, #d4af37, #f3da8a)'
                    }}
                  />
                </div>
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
