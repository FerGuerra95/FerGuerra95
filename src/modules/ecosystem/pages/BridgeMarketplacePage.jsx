import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Banknote,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Globe2,
  Handshake,
  LockKeyhole,
  Network,
  Plus,
  Send,
  ShieldCheck,
  Target,
  Trash2,
  TrendingUp,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { useAuth } from '../../../app/providers/AuthProvider.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import { bridgeApi } from '../services/bridgeApi.js';
import { maDealsApi } from '../../ma/services/maDealsApi.js';
import { fundingEnterpriseApi } from '../../funding/services/fundingEnterpriseApi.js';

export function isBridgeMarketplaceEnabled() {
  return (
    import.meta.env.VITE_ENABLE_BRIDGE_MARKETPLACE === 'true' ||
    import.meta.env.MODE === 'development'
  );
}

const DEMO_BRIDGE_RECORDS = [
  {
    id: 'demo-bridge-industrial',
    title: 'Iberia Industrial Services buyer process',
    status: 'active',
    score: '82',
    payload: {
      recordType: 'opportunity',
      sourceBranch: 'M&A',
      counterpartyType: 'Strategic buyer',
      sector: 'Industrial services',
      geography: 'Iberia',
      stage: 'Introductions',
      qualificationStatus: 'qualified',
      opportunityValue: 18500000,
      weightedPipelineValue: 11100000,
      probability: 60,
      introductionsCount: 4,
      owner: 'Bridge Lead',
      ndaStatus: 'signed',
      redactionLevel: 'teaser',
      dataRoomAccess: 'restricted',
      boardApprovalRequired: false,
      introductionLedger: [
        { id: 'intro-iberia-1', counterparty: 'Northstar Industrials', status: 'accepted', date: '2026-05-02' },
        { id: 'intro-iberia-2', counterparty: 'Atlas Strategic Holdings', status: 'sent', date: '2026-05-07' }
      ],
      nextStep: 'Shortlist two strategic buyers and confirm NDA package.',
      posture: 'Private-network preview active (demo)'
    }
  },
  {
    id: 'demo-bridge-funding',
    title: 'Growth capital investor syndicate',
    status: 'ready',
    score: '74',
    payload: {
      recordType: 'opportunity',
      sourceBranch: 'Funding',
      counterpartyType: 'Growth investor',
      sector: 'B2B software',
      geography: 'Europe',
      stage: 'Mandate',
      qualificationStatus: 'ic_ready',
      opportunityValue: 6000000,
      probability: 45,
      introductionsCount: 3,
      owner: 'CFO Office',
      ndaStatus: 'signed',
      redactionLevel: 'teaser',
      dataRoomAccess: 'restricted',
      boardApprovalRequired: false,
      introductionLedger: [
        { id: 'intro-growth-1', counterparty: 'Aurora Growth Partners', status: 'diligence', date: '2026-05-05' }
      ],
      nextStep: 'Align investor narrative with runway and cap table discipline.'
    }
  },
  {
    id: 'demo-bridge-bank',
    title: 'Acquisition financing bank panel',
    status: 'in_progress',
    score: '68',
    payload: {
      recordType: 'opportunity',
      sourceBranch: 'Funding',
      counterpartyType: 'Bank',
      sector: 'Industrial services',
      geography: 'Spain',
      stage: 'Qualification',
      qualificationStatus: 'verified',
      opportunityValue: 3500000,
      probability: 35,
      introductionsCount: 2,
      owner: 'Treasury',
      ndaStatus: 'required',
      redactionLevel: 'redacted_teaser',
      dataRoomAccess: 'none',
      boardApprovalRequired: true,
      introductionLedger: [],
      nextStep: 'Request indicative debt terms after compliance evidence review.'
    }
  },
  {
    id: 'demo-counterparty-northstar',
    title: 'Northstar Industrials',
    status: 'active',
    score: '86',
    payload: {
      recordType: 'counterparty',
      counterpartyType: 'Strategic buyer',
      sectorFocus: 'Industrial services',
      geography: 'Iberia',
      ticketMin: 8000000,
      ticketMax: 45000000,
      riskAppetite: 'Medium',
      kycStatus: 'verified',
      ndaStatus: 'signed',
      contactOwner: 'Bridge Lead'
    }
  },
  {
    id: 'demo-counterparty-aurora',
    title: 'Aurora Growth Partners',
    status: 'active',
    score: '81',
    payload: {
      recordType: 'counterparty',
      counterpartyType: 'Growth investor',
      sectorFocus: 'B2B software',
      geography: 'Europe',
      ticketMin: 2000000,
      ticketMax: 12000000,
      riskAppetite: 'Medium',
      kycStatus: 'verified',
      ndaStatus: 'signed',
      contactOwner: 'CFO Office'
    }
  }
];

const DEMO_BRIDGE_DOCUMENTS = [
  {
    id: 'demo-bridge-document-teaser',
    title: 'Redacted opportunity teaser',
    documentType: 'teaser',
    classification: 'confidential',
    status: 'registered',
    owner: 'Bridge Lead',
    ndaStatus: 'signed',
    redactionLevel: 'teaser'
  },
  {
    id: 'demo-bridge-document-nda',
    title: 'Counterparty NDA package',
    documentType: 'nda',
    classification: 'restricted',
    status: 'registered',
    owner: 'Legal Counsel',
    ndaStatus: 'required',
    redactionLevel: 'redacted_teaser'
  }
];

const DEMO_BRIDGE_REPORTS = [
  {
    id: 'demo-bridge-report-network',
    title: 'Bridge Network Memo',
    status: 'generated',
    reportType: 'network_memo',
    createdAt: '2026-05-14T00:00:00.000Z'
  }
];

const bridgeCss = `
  .bridge-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 34px;
  }

  .bridge-hero {
    min-height: 520px;
    position: relative;
    overflow: hidden;
    border-radius: 38px;
    padding: 44px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      radial-gradient(circle at 8% 2%, rgba(16, 185, 129, 0.32), transparent 30%),
      radial-gradient(circle at 88% 8%, rgba(59, 130, 246, 0.18), transparent 27%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.99), rgba(15, 23, 42, 0.97));
    box-shadow: 0 38px 120px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255,255,255,0.055);
  }

  .bridge-hero::before {
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

  .bridge-hero-layout {
    position: relative;
    z-index: 1;
    min-height: 430px;
    display: grid;
    grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.92fr);
    gap: 36px;
    align-items: center;
  }

  .bridge-badge-row,
  .bridge-toolbar,
  .bridge-link-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }

  .bridge-title {
    margin: 0;
    max-width: 940px;
    font-size: clamp(40px, 4.8vw, 68px);
    line-height: 0.94;
    letter-spacing: -0.075em;
  }

  .bridge-title span {
    display: block;
    margin-top: 9px;
    color: rgba(226, 232, 240, 0.68);
  }

  .bridge-copy {
    max-width: 850px;
    margin: 28px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .bridge-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .bridge-command-item,
  .bridge-signal-card,
  .bridge-panel,
  .bridge-kpi-card,
  .bridge-opportunity-card {
    border: 1px solid rgba(148, 163, 184, 0.16);
    background: linear-gradient(135deg, rgba(255,255,255,0.064), rgba(255,255,255,0.022)), rgba(15, 23, 42, 0.64);
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.21), inset 0 1px 0 rgba(255,255,255,0.035);
  }

  .bridge-command-item {
    padding: 18px;
    border-radius: 22px;
  }

  .bridge-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
  }

  .bridge-signal-card {
    border-radius: 32px;
    padding: 28px;
    backdrop-filter: blur(22px);
  }

  .bridge-signal-top,
  .bridge-card-head,
  .bridge-panel-head {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .bridge-icon-box,
  .bridge-card-icon {
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(16, 185, 129, 0.14);
    border: 1px solid rgba(110, 231, 183, 0.24);
    flex: 0 0 auto;
  }

  .bridge-icon-box {
    width: 54px;
    height: 54px;
  }

  .bridge-card-icon {
    width: 46px;
    height: 46px;
  }

  .bridge-score {
    margin-top: 22px;
    padding: 22px;
    border-radius: 26px;
    background: rgba(255,255,255,0.047);
    border: 1px solid rgba(255,255,255,0.085);
  }

  .bridge-score strong {
    display: block;
    font-size: 42px;
    line-height: 1;
    letter-spacing: -0.06em;
    color: #ffffff;
  }

  .bridge-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .bridge-kicker {
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

  .bridge-section h2,
  .bridge-panel-title,
  .bridge-card-title {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .bridge-grid {
    display: grid;
    gap: 24px;
  }

  .bridge-grid-four {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .bridge-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .bridge-grid-three {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .bridge-panel,
  .bridge-kpi-card,
  .bridge-opportunity-card {
    border-radius: 28px;
    padding: 24px;
  }

  .bridge-kpi-card {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .bridge-kpi-value {
    font-size: 30px;
    line-height: 1;
    letter-spacing: -0.055em;
    font-weight: 850;
  }

  .bridge-mini-row {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 12px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.13);
  }

  .bridge-mini-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .bridge-progress-track {
    width: 100%;
    height: 9px;
    border-radius: 999px;
    overflow: hidden;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .bridge-progress-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(16, 185, 129, 0.95), rgba(59, 130, 246, 0.95));
  }

  .bridge-input,
  .bridge-select {
    width: 100%;
    min-height: 40px;
    border-radius: 14px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background: rgba(15, 23, 42, 0.72);
    color: rgba(226, 232, 240, 0.94);
    padding: 9px 11px;
    outline: none;
  }

  .bridge-form {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.8fr) minmax(0, 0.7fr) auto;
    gap: 12px;
    align-items: center;
  }

  .bridge-form-three {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr) auto;
    gap: 12px;
    align-items: center;
  }

  .bridge-registry-row,
  .bridge-ledger-row,
  .bridge-match-row,
  .bridge-confidentiality-row {
    display: grid;
    gap: 12px;
    align-items: center;
    padding: 13px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.13);
  }

  .bridge-registry-row {
    grid-template-columns: minmax(160px, 1fr) minmax(120px, 0.7fr) minmax(140px, 0.7fr);
  }

  .bridge-ledger-row {
    grid-template-columns: minmax(150px, 1fr) minmax(110px, 0.6fr) minmax(110px, 0.6fr);
  }

  .bridge-match-row {
    grid-template-columns: minmax(160px, 1fr) minmax(70px, 0.35fr) auto;
  }

  .bridge-confidentiality-row {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .bridge-button-lite {
    min-height: 38px;
    border-radius: 14px;
    border: 1px solid rgba(110, 231, 183, 0.24);
    background: rgba(16, 185, 129, 0.14);
    color: rgba(226, 232, 240, 0.94);
    font-weight: 800;
    cursor: pointer;
    padding: 8px 12px;
  }

  .bridge-button-lite:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  .bridge-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    width: fit-content;
    border-radius: 999px;
    padding: 10px 13px;
    color: rgba(226, 232, 240, 0.94);
    background: rgba(16, 185, 129, 0.14);
    border: 1px solid rgba(110, 231, 183, 0.24);
    text-decoration: none;
    font-size: 13px;
    font-weight: 800;
  }

  @media (max-width: 1180px) {
    .bridge-hero-layout,
    .bridge-grid-four,
    .bridge-grid-three,
    .bridge-grid-two {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 780px) {
    .bridge-hero {
      padding: 30px;
    }

    .bridge-command-bar,
    .bridge-form,
    .bridge-form-three,
    .bridge-registry-row,
    .bridge-ledger-row,
    .bridge-match-row,
    .bridge-confidentiality-row {
      grid-template-columns: 1fr;
    }

    .bridge-title {
      font-size: clamp(36px, 11vw, 54px);
    }
  }
`;

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(toNumber(value))));
}

function getPayload(record) {
  return record?.payload && typeof record.payload === 'object' ? record.payload : {};
}

function toOpportunityRecord(item = {}) {
  return {
    id: item.id,
    title: item.title,
    status: item.status,
    score: String(item.score || item.payload?.score || 62),
    payload: {
      ...item.payload,
      ...item,
      recordType: 'opportunity',
      introductionLedger: item.introductionLedger || item.payload?.introductionLedger || []
    }
  };
}

function toCounterpartyRecord(item = {}) {
  return {
    id: item.id,
    title: item.name || item.title,
    status: item.status,
    score: String(item.score || item.payload?.score || 62),
    payload: {
      ...item.payload,
      ...item,
      recordType: 'counterparty'
    }
  };
}

function getRecordScore(record) {
  return clampScore(record?.score || getPayload(record).score || 62);
}

function getBridgeMetrics(records = []) {
  const opportunities = records.filter((record) => getPayload(record).recordType !== 'counterparty');
  const counterparties = records.filter((record) => getPayload(record).recordType === 'counterparty');
  const totalOpportunityValue = opportunities.reduce(
    (sum, record) => sum + toNumber(getPayload(record).opportunityValue),
    0
  );
  const weightedPipelineValue = opportunities.reduce((sum, record) => {
    const payload = getPayload(record);
    return sum + toNumber(payload.opportunityValue) * (clampScore(payload.probability) / 100);
  }, 0);
  const introductionsCount = opportunities.reduce(
    (sum, record) =>
      sum +
      Math.max(
        toNumber(getPayload(record).introductionsCount),
        Array.isArray(getPayload(record).introductionLedger)
          ? getPayload(record).introductionLedger.length
          : 0
      ),
    0
  );
  const qualifiedCount = opportunities.filter((record) =>
    ['qualified', 'verified', 'ic_ready', 'mandated'].includes(
      String(getPayload(record).qualificationStatus || '').toLowerCase()
    )
  ).length;
  const activeMandates = opportunities.filter((record) => {
    const stage = String(getPayload(record).stage || '').toLowerCase();
    return stage.includes('mandate') || stage.includes('closing');
  }).length;
  const confidentialityExceptions = opportunities.filter((record) => {
    const payload = getPayload(record);
    return (
      payload.ndaStatus !== 'signed' ||
      payload.redactionLevel === 'full_data_room' ||
      payload.boardApprovalRequired === true
    );
  }).length;
  const score =
    opportunities.length > 0
      ? clampScore(opportunities.reduce((sum, record) => sum + getRecordScore(record), 0) / opportunities.length)
      : 62;

  return {
    totalOpportunityValue,
    weightedPipelineValue,
    introductionsCount,
    qualifiedCount,
    activeMandates,
    counterpartiesCount: counterparties.length,
    confidentialityExceptions,
    score,
    conversionRate: opportunities.length > 0 ? clampScore((activeMandates / opportunities.length) * 100) : 0
  };
}

function getMatchScore(opportunity, counterparty) {
  const opportunityPayload = getPayload(opportunity);
  const counterpartyPayload = getPayload(counterparty);
  const value = toNumber(opportunityPayload.opportunityValue);
  let score = 20;

  if (opportunityPayload.counterpartyType === counterpartyPayload.counterpartyType) score += 24;
  if (
    String(counterpartyPayload.sectorFocus || '').toLowerCase().includes(
      String(opportunityPayload.sector || '').toLowerCase()
    )
  ) {
    score += 18;
  }
  if (
    String(counterpartyPayload.geography || '').toLowerCase().includes(
      String(opportunityPayload.geography || '').toLowerCase()
    ) ||
    String(opportunityPayload.geography || '').toLowerCase().includes(
      String(counterpartyPayload.geography || '').toLowerCase()
    )
  ) {
    score += 14;
  }
  if (
    value >= toNumber(counterpartyPayload.ticketMin) &&
    value <= toNumber(counterpartyPayload.ticketMax)
  ) {
    score += 18;
  }
  if (counterpartyPayload.kycStatus === 'verified') score += 6;

  return clampScore(score);
}

function buildBridgeReportHtml({ opportunity, matches = [] }) {
  const payload = getPayload(opportunity);
  const rows = matches
    .slice(0, 5)
    .map(
      (item) =>
        `<tr><td>${item.counterparty.title}</td><td>${item.counterparty.payload?.counterpartyType || ''}</td><td>${item.score}/100</td></tr>`
    )
    .join('');

  return `<!doctype html>
    <html>
      <head>
        <title>Bridge Network Memo</title>
        <style>
          body { font-family: Inter, Arial, sans-serif; margin: 40px; color: #111827; }
          h1 { font-size: 28px; margin-bottom: 6px; }
          .muted { color: #64748b; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 24px 0; }
          .box { border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 18px; }
          td, th { border-bottom: 1px solid #e5e7eb; padding: 10px; text-align: left; }
        </style>
      </head>
      <body>
        <p class="muted">CEO's OS · Bridge Network Memo</p>
        <h1>${opportunity.title}</h1>
        <p>${payload.nextStep || 'No next step registered.'}</p>
        <div class="grid">
          <div class="box"><strong>Opportunity value</strong><br>${formatCurrency(payload.opportunityValue || 0, 'EUR')}</div>
          <div class="box"><strong>Stage</strong><br>${payload.stage || 'Qualification'}</div>
          <div class="box"><strong>NDA status</strong><br>${payload.ndaStatus || 'required'}</div>
        </div>
        <h2>Recommended counterparties</h2>
        <table><thead><tr><th>Counterparty</th><th>Type</th><th>Match</th></tr></thead><tbody>${rows}</tbody></table>
        <h2>Confidentiality controls</h2>
        <p>NDA: ${payload.ndaStatus || 'required'} · Redaction: ${payload.redactionLevel || 'teaser'} · Data room: ${payload.dataRoomAccess || 'none'}</p>
      </body>
    </html>`;
}

function CommandItem({ label, value }) {
  return (
    <div className="bridge-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function KpiCard({ label, value, description, icon: Icon }) {
  return (
    <article className="bridge-kpi-card">
      <div className="bridge-card-head">
        <div>
          <div className="kpi-label">{label}</div>
          <div className="bridge-kpi-value">{value}</div>
        </div>
        <div className="bridge-card-icon">
          <Icon size={18} />
        </div>
      </div>
      <p className="muted">{description}</p>
    </article>
  );
}

function MiniRow({ label, value }) {
  return (
    <div className="bridge-mini-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="bridge-progress-track">
      <div className="bridge-progress-fill" style={{ width: `${clampScore(value)}%` }} />
    </div>
  );
}

function OpportunityCard({ record, onStageChange, onConfidentialityChange, onDelete, disabled }) {
  const payload = getPayload(record);
  const score = getRecordScore(record);

  return (
    <article className="bridge-opportunity-card">
      <div className="bridge-card-head">
        <div>
          <div className="bridge-kicker">
            <Handshake size={14} />
            {payload.sourceBranch || 'M&A / Funding'} · {payload.counterpartyType || 'Counterparty'}
          </div>
          <h3 className="bridge-card-title">{record.title}</h3>
          <p className="muted">{payload.nextStep || 'Define next executive action.'}</p>
        </div>
        <Badge>{record.status}</Badge>
      </div>

      <ProgressBar value={score} />

      <div>
        <MiniRow label="Opportunity value" value={formatCurrency(payload.opportunityValue || 0, 'EUR')} />
        <MiniRow label="Probability" value={`${payload.probability || 0}%`} />
        <MiniRow label="Introductions" value={payload.introductionsCount || 0} />
        <MiniRow label="Owner" value={payload.owner || 'Bridge Lead'} />
      </div>

      <div className="bridge-confidentiality-row">
        <select
          className="bridge-select"
          value={payload.ndaStatus || 'required'}
          onChange={(event) => onConfidentialityChange(record, { ndaStatus: event.target.value })}
          disabled={disabled}
          aria-label={`${record.title} NDA status`}
        >
          <option value="required">NDA required</option>
          <option value="sent">NDA sent</option>
          <option value="signed">NDA signed</option>
        </select>
        <select
          className="bridge-select"
          value={payload.redactionLevel || 'redacted_teaser'}
          onChange={(event) => onConfidentialityChange(record, { redactionLevel: event.target.value })}
          disabled={disabled}
          aria-label={`${record.title} redaction level`}
        >
          <option value="redacted_teaser">Redacted teaser</option>
          <option value="teaser">Teaser</option>
          <option value="full_data_room">Full data room</option>
        </select>
        <select
          className="bridge-select"
          value={payload.dataRoomAccess || 'none'}
          onChange={(event) => onConfidentialityChange(record, { dataRoomAccess: event.target.value })}
          disabled={disabled}
          aria-label={`${record.title} data room access`}
        >
          <option value="none">No access</option>
          <option value="restricted">Restricted</option>
          <option value="granted">Granted</option>
        </select>
      </div>

      <div className="bridge-toolbar">
        <select
          className="bridge-select"
          value={payload.stage || 'Qualification'}
          onChange={(event) => onStageChange(record, event.target.value)}
          disabled={disabled}
          aria-label={`${record.title} stage`}
        >
          <option value="Qualification">Qualification</option>
          <option value="Introductions">Introductions</option>
          <option value="Diligence">Diligence</option>
          <option value="Mandate">Mandate</option>
          <option value="Closing">Closing</option>
        </select>
        <button
          type="button"
          className="bridge-button-lite"
          onClick={() => onDelete(record)}
          disabled={disabled || String(record.id).startsWith('demo-')}
          aria-label={`Delete ${record.title}`}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </article>
  );
}

export function BridgeMarketplacePage() {
  if (!isBridgeMarketplaceEnabled()) {
    return <BridgeMarketplaceQuarantine />;
  }

  return <BridgeMarketplaceEnabledPage />;
}

function BridgeMarketplaceQuarantine() {
  return (
    <div className="page">
      <style>{bridgeCss}</style>
      <div className="bridge-page">
        <section className="bridge-hero">
          <div className="bridge-badge-row">
            <Badge>Internal future private network</Badge>
            <Badge>Quarantined</Badge>
            <Badge>Not a public marketplace</Badge>
          </div>

          <h1 className="bridge-title">
            Bridge Marketplace is quarantined
            <span>Internal future private network preview only.</span>
          </h1>

          <p className="bridge-copy">
            This private-network preview is disabled in this environment. The transaction layer,
            success-fee workflows and marketplace matching are not active. Use Bridge Enterprise
            signals for DSS cross-module review.
          </p>

          <div className="bridge-command-bar">
            <CommandItem label="Status" value="Disabled by default in production" />
            <CommandItem label="Enable" value="VITE_ENABLE_BRIDGE_MARKETPLACE=true" />
            <CommandItem label="Alternative" value="Bridge Enterprise DSS signals" />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 20 }}>
            <Link className="bridge-button-lite" to="/bridge/dashboard">
              Back to Bridge dashboard
            </Link>
            <span className="muted" style={{ alignSelf: 'center' }}>
              Request internal access from your administrator to enable the preview flag.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}

function BridgeMarketplaceEnabledPage() {
  const { PERMISSIONS, can } = useAuth();
  const canManageBridge = can(PERMISSIONS.MANAGE_ECOSYSTEM_BRANCH);
  const [records, setRecords] = useState(DEMO_BRIDGE_RECORDS);
  const [documents, setDocuments] = useState(DEMO_BRIDGE_DOCUMENTS);
  const [reports, setReports] = useState(DEMO_BRIDGE_REPORTS);
  const [backendStatus, setBackendStatus] = useState({ loading: true, error: null });
  const [maDeals, setMaDeals] = useState([]);
  const [fundingRounds, setFundingRounds] = useState([]);
  const [selectedSource, setSelectedSource] = useState({ type: 'ma', id: '' });
  const [selectedOpportunityId, setSelectedOpportunityId] = useState('');
  const [newOpportunity, setNewOpportunity] = useState({
    title: '',
    counterpartyType: 'Strategic buyer',
    opportunityValue: '',
    sourceBranch: 'M&A'
  });
  const [newCounterparty, setNewCounterparty] = useState({
    title: '',
    counterpartyType: 'Strategic buyer',
    ticketMax: ''
  });
  const [newDocument, setNewDocument] = useState({ title: '', documentType: 'teaser' });

  useEffect(() => {
    let cancelled = false;

    async function loadBridgeRecords() {
      try {
        const [opportunitiesItems, counterpartiesItems, documentItems, reportItems] = await Promise.all([
          bridgeApi.listOpportunities(),
          bridgeApi.listCounterparties(),
          bridgeApi.listDocuments(),
          bridgeApi.listReports()
        ]);
        if (cancelled) return;
        const items = [
          ...opportunitiesItems.map(toOpportunityRecord),
          ...counterpartiesItems.map(toCounterpartyRecord)
        ];
        setRecords(items.length > 0 ? items : DEMO_BRIDGE_RECORDS);
        setDocuments(documentItems.length > 0 ? documentItems : DEMO_BRIDGE_DOCUMENTS);
        setReports(reportItems.length > 0 ? reportItems : DEMO_BRIDGE_REPORTS);
        setBackendStatus({ loading: false, error: null });
      } catch (error) {
        if (cancelled) return;
        setRecords(DEMO_BRIDGE_RECORDS);
        setDocuments(DEMO_BRIDGE_DOCUMENTS);
        setReports(DEMO_BRIDGE_REPORTS);
        setBackendStatus({ loading: false, error });
      }
    }

    loadBridgeRecords();

    return () => {
      cancelled = true;
    };
  }, []);

  const metrics = useMemo(() => getBridgeMetrics(records), [records]);
  const opportunities = useMemo(
    () => records.filter((record) => getPayload(record).recordType !== 'counterparty'),
    [records]
  );
  const counterparties = useMemo(
    () => records.filter((record) => getPayload(record).recordType === 'counterparty'),
    [records]
  );
  const selectedOpportunity = opportunities.find((item) => item.id === selectedOpportunityId) || opportunities[0] || null;
  const matches = useMemo(
    () =>
      selectedOpportunity
        ? counterparties
            .map((counterparty) => ({
              counterparty,
              score: getMatchScore(selectedOpportunity, counterparty)
            }))
            .sort((left, right) => right.score - left.score)
        : [],
    [counterparties, selectedOpportunity]
  );
  const isFallback = records.some((record) => String(record.id).startsWith('demo-'));

  useEffect(() => {
    if (!selectedOpportunityId && opportunities[0]?.id) {
      setSelectedOpportunityId(opportunities[0].id);
    }
  }, [opportunities, selectedOpportunityId]);

  useEffect(() => {
    let cancelled = false;

    async function loadSources() {
      const [dealsResult, roundsResult] = await Promise.allSettled([
        maDealsApi.list(),
        fundingEnterpriseApi.listFundingRounds()
      ]);

      if (cancelled) return;

      const deals = dealsResult.status === 'fulfilled' ? dealsResult.value : [];
      const rounds = roundsResult.status === 'fulfilled' ? roundsResult.value : [];
      setMaDeals(deals);
      setFundingRounds(rounds);
      setSelectedSource((current) => ({
        ...current,
        id: current.id || deals[0]?.id || rounds[0]?.id || ''
      }));
    }

    loadSources();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreateOpportunity(event) {
    event.preventDefault();
    const title = newOpportunity.title.trim();
    if (!title) return;

    const payload = {
      recordType: 'opportunity',
      sourceBranch: newOpportunity.sourceBranch,
      counterpartyType: newOpportunity.counterpartyType,
      sector: 'General',
      geography: 'Europe',
      stage: 'Qualification',
      qualificationStatus: 'verified',
      opportunityValue: toNumber(newOpportunity.opportunityValue),
      probability: 35,
      introductionsCount: 0,
      introductionLedger: [],
      ndaStatus: 'required',
      redactionLevel: 'redacted_teaser',
      dataRoomAccess: 'none',
      boardApprovalRequired: true,
      owner: 'Bridge Lead',
      nextStep: 'Qualify counterparty fit and prepare verified introduction package.',
      posture: 'Bridge opportunity qualified'
    };
    const score = String(clampScore(55 + Math.min(25, payload.opportunityValue / 1000000)));

    try {
      const created = await bridgeApi.createOpportunity({
        title,
        status: 'active',
        score,
        ...payload
      });
      setRecords((items) => [toOpportunityRecord(created), ...items.filter((item) => !String(item.id).startsWith('demo-'))]);
      setNewOpportunity({
        title: '',
        counterpartyType: 'Strategic buyer',
        opportunityValue: '',
        sourceBranch: 'M&A'
      });
      setBackendStatus({ loading: false, error: null });
    } catch (error) {
      setBackendStatus({ loading: false, error });
    }
  }

  async function handleStageChange(record, stage) {
    const payload = {
      ...getPayload(record),
      stage,
      probability:
        stage === 'Closing'
          ? 80
          : stage === 'Mandate'
            ? 65
            : stage === 'Diligence'
              ? 50
              : stage === 'Introductions'
                ? 42
                : 30
    };
    const score = String(clampScore(getRecordScore(record) + (stage === 'Closing' ? 8 : 2)));

    if (String(record.id).startsWith('demo-')) {
      setRecords((items) =>
        items.map((item) => (item.id === record.id ? { ...item, score, payload } : item))
      );
      return;
    }

    try {
      const updated = await bridgeApi.updateOpportunity(record.id, {
        title: record.title,
        status: stage === 'Closing' ? 'ready' : 'active',
        score,
        ...payload
      });
      setRecords((items) => items.map((item) => (item.id === updated.id ? toOpportunityRecord(updated) : item)));
    } catch (error) {
      setBackendStatus({ loading: false, error });
    }
  }

  async function saveOpportunityPatch(record, patch = {}) {
    const payload = {
      ...getPayload(record),
      ...patch
    };

    if (String(record.id).startsWith('demo-')) {
      setRecords((items) =>
        items.map((item) => (item.id === record.id ? { ...item, payload } : item))
      );
      return;
    }

    const updated = await bridgeApi.updateOpportunity(record.id, {
      title: record.title,
      status: record.status,
      score: record.score,
      ...payload
    });
    setRecords((items) => items.map((item) => (item.id === updated.id ? toOpportunityRecord(updated) : item)));
  }

  async function handleCreateCounterparty(event) {
    event.preventDefault();
    const title = newCounterparty.title.trim();
    if (!title) return;

    const payload = {
      recordType: 'counterparty',
      counterpartyType: newCounterparty.counterpartyType,
      sectorFocus: 'General',
      geography: 'Europe',
      ticketMin: 0,
      ticketMax: toNumber(newCounterparty.ticketMax),
      riskAppetite: 'Medium',
      kycStatus: 'verified',
      ndaStatus: 'required',
      contactOwner: 'Bridge Lead'
    };

    try {
      const created = await bridgeApi.createCounterparty({
        name: title,
        status: 'active',
        score: '72',
        ...payload
      });
      setRecords((items) => [toCounterpartyRecord(created), ...items.filter((item) => !String(item.id).startsWith('demo-counterparty'))]);
      setNewCounterparty({ title: '', counterpartyType: 'Strategic buyer', ticketMax: '' });
    } catch (error) {
      setBackendStatus({ loading: false, error });
    }
  }

  async function handleCreateDocument(event) {
    event.preventDefault();
    const title = newDocument.title.trim();
    if (!title) return;

    try {
      const created = await bridgeApi.createDocument({
        title,
        documentType: newDocument.documentType || 'teaser',
        classification: 'confidential',
        status: 'registered',
        owner: 'Bridge Lead',
        opportunityId: selectedOpportunity?.id && !String(selectedOpportunity.id).startsWith('demo-') ? selectedOpportunity.id : '',
        ndaStatus: 'required',
        redactionLevel: 'redacted_teaser'
      });
      setDocuments((items) => [created, ...items.filter((item) => !String(item.id).startsWith('demo-'))]);
      setNewDocument({ title: '', documentType: 'teaser' });
    } catch (error) {
      setBackendStatus({ loading: false, error });
    }
  }

  async function handleGenerateNetworkReport() {
    try {
      const created = await bridgeApi.generateReport({
        title: 'Bridge Network Memo',
        opportunityId: selectedOpportunity?.id && !String(selectedOpportunity.id).startsWith('demo-') ? selectedOpportunity.id : ''
      });
      setReports((items) => [created, ...items.filter((item) => !String(item.id).startsWith('demo-'))]);
    } catch (error) {
      setBackendStatus({ loading: false, error });
    }
  }

  async function handleCreateFromSource() {
    const sourceItems = selectedSource.type === 'ma' ? maDeals : fundingRounds;
    const item = sourceItems.find((entry) => entry.id === selectedSource.id);
    if (!item) return;

    const isMa = selectedSource.type === 'ma';
    const payload = {
      recordType: 'opportunity',
      sourceBranch: isMa ? 'M&A' : 'Funding',
      sourceId: item.id,
      counterpartyType: isMa ? 'Strategic buyer' : 'Growth investor',
      sector: item.sector || item.payload?.sector || 'General',
      geography: item.country || item.payload?.geography || 'Europe',
      stage: 'Qualification',
      qualificationStatus: 'verified',
      opportunityValue: toNumber(
        item.payload?.equityValue ||
          item.payload?.enterpriseValue ||
          item.valuationPostMoney ||
          item.amountRaised ||
          item.targetRaise
      ),
      probability: isMa ? 40 : 35,
      introductionsCount: 0,
      introductionLedger: [],
      ndaStatus: 'required',
      redactionLevel: 'redacted_teaser',
      dataRoomAccess: 'none',
      boardApprovalRequired: true,
      owner: item.ownerName || item.investorName || 'Bridge Lead',
      nextStep: isMa
        ? 'Prepare buyer introduction pack from M&A valuation and diligence signals.'
        : 'Prepare investor introduction pack from Funding readiness and runway signals.',
      posture: 'Bridge opportunity sourced from enterprise branch'
    };

    try {
      const created =
        selectedSource.type === 'ma'
          ? await bridgeApi.createFromMaDeal(item.id)
          : await bridgeApi.createFromFundingRound(item.id);
      setRecords((items) => [toOpportunityRecord(created), ...items.filter((entry) => !String(entry.id).startsWith('demo-'))]);
      setSelectedOpportunityId(created.id);
    } catch (error) {
      setBackendStatus({ loading: false, error });
    }
  }

  async function handleCreateIntroduction(counterparty) {
    if (!selectedOpportunity) return;
    const payload = getPayload(selectedOpportunity);
    const introductionLedger = Array.isArray(payload.introductionLedger)
      ? payload.introductionLedger
      : [];

    if (String(selectedOpportunity.id).startsWith('demo-')) {
      await saveOpportunityPatch(selectedOpportunity, {
        stage: 'Introductions',
        probability: Math.max(toNumber(payload.probability), 42),
        introductionsCount: introductionLedger.length + 1,
        introductionLedger: [
          ...introductionLedger,
          {
            id: `intro-${Date.now().toString(36)}`,
            counterparty: counterparty.title,
            status: 'drafted',
            date: new Date().toISOString().slice(0, 10)
          }
        ]
      });
      return;
    }

    const created = await bridgeApi.createIntroduction({
      opportunityId: selectedOpportunity.id,
      counterpartyId: counterparty.id,
      status: 'drafted',
      ndaStatus: payload.ndaStatus || 'required'
    });
    setRecords((items) =>
      items.map((item) =>
        item.id === selectedOpportunity.id
          ? {
              ...item,
              payload: {
                ...getPayload(item),
                stage: 'Introductions',
                probability: Math.max(toNumber(payload.probability), 42),
                introductionLedger: [...introductionLedger, created],
                introductionsCount: introductionLedger.length + 1
              }
            }
          : item
      )
    );
  }

  function handleExportNetworkMemo() {
    if (!selectedOpportunity) return;
    const html = buildBridgeReportHtml({ opportunity: selectedOpportunity, matches });
    const reportWindow = window.open('', '_blank', 'noopener,noreferrer');
    if (!reportWindow) return;
    reportWindow.document.write(html);
    reportWindow.document.close();
    reportWindow.focus();
    reportWindow.print();
  }

  async function handleDelete(record) {
    if (String(record.id).startsWith('demo-')) return;

    try {
      await bridgeApi.deleteOpportunity(record.id);
      setRecords((items) => items.filter((item) => item.id !== record.id));
    } catch (error) {
      setBackendStatus({ loading: false, error });
    }
  }

  return (
    <div className="page">
      <style>{bridgeCss}</style>

      <div className="bridge-page">
        <section className="bridge-hero">
          <div className="bridge-hero-layout">
            <div>
              <div className="bridge-badge-row">
                <Badge>Internal demo</Badge>
                <Badge>Private network preview</Badge>
                <Badge>Not a public marketplace</Badge>
                <Badge>M&A + Funding modelling</Badge>
                <Badge>{backendStatus.loading ? 'Syncing' : isFallback ? 'Demo fallback data' : 'Tenant data (preview)'}</Badge>
              </div>

              <p className="muted" style={{ marginBottom: 16, maxWidth: 720 }}>
                Internal unlisted preview for a future private network layer. Transaction layer not
                active. Success-fee workflows are a future commercial concept only — not billing or
                intermediation in this product. Heuristic DSS match scores only; no certified buyer,
                seller, investor or funding recommendation. Requires human and legal review before
                any external circulation.
              </p>

              <h1 className="bridge-title">
                Bridge Marketplace Preview.
                <span>Model potential liquidity opportunities for internal review.</span>
              </h1>

              <p className="bridge-copy">
                Internal preview layer to model M&A and Funding opportunities with counterparty
                profiles for private-network planning. Counterparty entries are modelling drafts —
                not live verified marketplace participants. Structured data supports internal
                decision-support review for the CEO and board; not an active transaction platform.
              </p>

              <div className="bridge-command-bar">
                <CommandItem label="Strategic role" value="Private-network modelling (DSS)" />
                <CommandItem label="Native source" value="M&A + Funding inputs" />
                <CommandItem label="Revenue logic" value="Future concept: SaaS + success fee (not active)" />
              </div>
            </div>

            <aside className="bridge-signal-card">
              <div className="bridge-signal-top">
                <div>
                  <div className="kpi-label">Bridge Signal</div>
                  <h2 className="bridge-panel-title">Private-network preview readiness</h2>
                </div>
                <div className="bridge-icon-box">
                  <Network size={24} />
                </div>
              </div>

              <div className="bridge-score">
                <strong>{metrics.score}</strong>
                <p className="muted">
                  Internal modelling pipeline with {metrics.qualifiedCount} qualified draft
                  opportunities and {metrics.introductionsCount} traced introduction drafts.
                  {isFallback ? ' Demo fallback data — not enterprise persisted marketplace.' : ''}
                </p>
              </div>

              <div>
                <MiniRow label="Weighted pipeline" value={formatCurrency(metrics.weightedPipelineValue, 'EUR')} />
                <MiniRow label="Conversion" value={`${metrics.conversionRate}%`} />
                <MiniRow label="Active mandates" value={metrics.activeMandates} />
              </div>
            </aside>
          </div>
        </section>

        <section className="bridge-section">
          <div>
            <div className="bridge-kicker">
              <TrendingUp size={14} />
              Executive snapshot
            </div>
            <h2>Private-network preview snapshot</h2>
          </div>

          <div className="bridge-grid bridge-grid-four">
            <KpiCard
              label="Opportunity value"
              value={formatCurrency(metrics.totalOpportunityValue, 'EUR')}
              description="Gross draft opportunity value for internal modelling — not live deal flow."
              icon={CircleDollarSign}
            />
            <KpiCard
              label="Weighted pipeline"
              value={formatCurrency(metrics.weightedPipelineValue, 'EUR')}
              description="Probability-weighted internal pipeline estimate (DSS heuristic)."
              icon={Target}
            />
            <KpiCard
              label="Introductions"
              value={metrics.introductionsCount}
              description="Introduction drafts for internal tracking — not verified live introductions."
              icon={Handshake}
            />
            <KpiCard
              label="Qualified"
              value={metrics.qualifiedCount}
              description="Draft opportunities ready for internal review — not active mandates."
              icon={ShieldCheck}
            />
            <KpiCard
              label="Counterparties"
              value={metrics.counterpartiesCount}
              description="Counterparty profiles for private-network modelling — not verified live participants."
              icon={Users}
            />
            <KpiCard
              label="NDA exceptions"
              value={metrics.confidentialityExceptions}
              description="Controles de confidencialidad pendientes antes de circular."
              icon={LockKeyhole}
            />
          </div>
        </section>

        <section className="bridge-grid bridge-grid-three">
          <Card className="bridge-panel">
            <div className="bridge-panel-head">
              <div>
                <div className="bridge-kicker">
                  <Plus size={14} />
                  Origination
                </div>
                <h3 className="bridge-panel-title">Create internal opportunity draft</h3>
                <p className="muted">
                  Register draft opportunities from M&A or Funding with value, counterparty type and
                  ownership. Internal preview only — not a live marketplace listing.
                </p>
              </div>
              <div className="bridge-card-icon">
                <BriefcaseBusiness size={18} />
              </div>
            </div>

            <form className="bridge-form" onSubmit={handleCreateOpportunity}>
              <input
                className="bridge-input"
                value={newOpportunity.title}
                onChange={(event) =>
                  setNewOpportunity((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="Opportunity"
                aria-label="Bridge opportunity"
              />
              <select
                className="bridge-select"
                value={newOpportunity.counterpartyType}
                onChange={(event) =>
                  setNewOpportunity((current) => ({
                    ...current,
                    counterpartyType: event.target.value
                  }))
                }
                aria-label="Counterparty type"
              >
                <option value="Strategic buyer">Strategic buyer</option>
                <option value="Growth investor">Growth investor</option>
                <option value="Bank">Bank</option>
                <option value="Advisor">Advisor</option>
              </select>
              <input
                className="bridge-input"
                type="number"
                min="0"
                value={newOpportunity.opportunityValue}
                onChange={(event) =>
                  setNewOpportunity((current) => ({
                    ...current,
                    opportunityValue: event.target.value
                  }))
                }
                placeholder="Value"
                aria-label="Opportunity value"
              />
              <button className="bridge-button-lite" type="submit" disabled={!canManageBridge}>
                Add
              </button>
            </form>
          </Card>

          <Card className="bridge-panel">
            <div className="bridge-panel-head">
              <div>
                <div className="bridge-kicker">
                  <Send size={14} />
                  Send to Bridge
                </div>
                <h3 className="bridge-panel-title">Source from M&A or Funding</h3>
                <p className="muted">
                  Convierte deals y rondas existentes en oportunidades Bridge trazables.
                </p>
              </div>
              <div className="bridge-card-icon">
                <Send size={18} />
              </div>
            </div>

            <div className="bridge-form-three">
              <select
                className="bridge-select"
                value={selectedSource.type}
                onChange={(event) =>
                  setSelectedSource({
                    type: event.target.value,
                    id: event.target.value === 'ma' ? maDeals[0]?.id || '' : fundingRounds[0]?.id || ''
                  })
                }
                aria-label="Bridge source type"
              >
                <option value="ma">M&A deal</option>
                <option value="funding">Funding round</option>
              </select>
              <select
                className="bridge-select"
                value={selectedSource.id}
                onChange={(event) =>
                  setSelectedSource((current) => ({ ...current, id: event.target.value }))
                }
                aria-label="Bridge source"
              >
                {(selectedSource.type === 'ma' ? maDeals : fundingRounds).map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.name || item.roundType || item.investorName || item.id}
                  </option>
                ))}
              </select>
              <button
                className="bridge-button-lite"
                type="button"
                onClick={handleCreateFromSource}
                disabled={!canManageBridge || !selectedSource.id}
              >
                Create
              </button>
            </div>
          </Card>

          <Card className="bridge-panel">
            <div className="bridge-panel-head">
              <div>
                <div className="bridge-kicker">
                  <Globe2 size={14} />
                  Connected OS
                </div>
                <h3 className="bridge-panel-title">Native enterprise links</h3>
                <p className="muted">
                  Bridge se alimenta de valoraciones M&A, readiness de Funding, Compliance
                  y evidencias operativas antes de circular oportunidades.
                </p>
              </div>
              <div className="bridge-card-icon">
                <Users size={18} />
              </div>
            </div>

            <div className="bridge-link-row">
              <Link className="bridge-link" to="/ma/dashboard">
                Open M&A
                <ArrowRight size={14} />
              </Link>
              <Link className="bridge-link" to="/funding/dashboard">
                Open Funding
                <ArrowRight size={14} />
              </Link>
              <Link className="bridge-link" to="/dashboard">
                Executive Overview
                <ArrowRight size={14} />
              </Link>
            </div>
          </Card>
        </section>

        <section className="bridge-grid bridge-grid-two">
          <Card className="bridge-panel">
            <div className="bridge-panel-head">
              <div>
                <div className="bridge-kicker">
                  <Users size={14} />
                  Counterparty registry
                </div>
                <h3 className="bridge-panel-title">Counterparty modelling registry</h3>
                <p className="muted">
                  Draft registry of buyer, investor, bank and advisor profiles for private-network
                  modelling. KYC fields are illustrative — not certified verification.
                </p>
              </div>
              <div className="bridge-card-icon">
                <Users size={18} />
              </div>
            </div>

            <form className="bridge-form-three" onSubmit={handleCreateCounterparty}>
              <input
                className="bridge-input"
                value={newCounterparty.title}
                onChange={(event) =>
                  setNewCounterparty((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="Counterparty"
                aria-label="Counterparty name"
              />
              <select
                className="bridge-select"
                value={newCounterparty.counterpartyType}
                onChange={(event) =>
                  setNewCounterparty((current) => ({
                    ...current,
                    counterpartyType: event.target.value
                  }))
                }
                aria-label="Counterparty type"
              >
                <option value="Strategic buyer">Strategic buyer</option>
                <option value="Growth investor">Growth investor</option>
                <option value="Bank">Bank</option>
                <option value="Advisor">Advisor</option>
              </select>
              <button className="bridge-button-lite" type="submit" disabled={!canManageBridge}>
                Add
              </button>
            </form>

            <div>
              {counterparties.map((item) => {
                const payload = getPayload(item);
                return (
                  <div className="bridge-registry-row" key={item.id}>
                    <strong>{item.title}</strong>
                    <span className="muted">{payload.counterpartyType}</span>
                    <span className="muted">{payload.kycStatus || 'review'}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="bridge-panel">
            <div className="bridge-panel-head">
              <div>
                <div className="bridge-kicker">
                  <Target size={14} />
                  Heuristic DSS matching
                </div>
                <h3 className="bridge-panel-title">Suggested counterparties (heuristic)</h3>
                <p className="muted">
                  Heuristic DSS fit score by type, sector, geography, ticket and KYC field — not
                  certified buyer, investor or funding recommendation. No financing intermediation.
                </p>
              </div>
              <div className="bridge-card-icon">
                <Target size={18} />
              </div>
            </div>

            <select
              className="bridge-select"
              value={selectedOpportunity?.id || ''}
              onChange={(event) => setSelectedOpportunityId(event.target.value)}
              aria-label="Select opportunity for matching"
            >
              {opportunities.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.title}
                </option>
              ))}
            </select>

            <div>
              {matches.slice(0, 5).map((item) => (
                <div className="bridge-match-row" key={item.counterparty.id}>
                  <strong>{item.counterparty.title}</strong>
                  <span className="muted">{item.score}/100</span>
                  <button
                    type="button"
                    className="bridge-button-lite"
                    onClick={() => handleCreateIntroduction(item.counterparty)}
                    disabled={!canManageBridge}
                  >
                    Intro
                  </button>
                </div>
              ))}
            </div>

            <Button variant="secondary" onClick={handleExportNetworkMemo} disabled={!selectedOpportunity}>
              <FileText size={16} />
              Export Network Memo
            </Button>
          </Card>
        </section>

        <section className="bridge-grid bridge-grid-two">
          <Card className="bridge-panel">
            <div className="bridge-panel-head">
              <div>
                <div className="bridge-kicker">
                  <FileText size={14} />
                  Controlled circulation
                </div>
                <h3 className="bridge-panel-title">Document register</h3>
                <p className="muted">
                  Teasers, NDA packs and redacted materials before external distribution.
                </p>
              </div>
              <div className="bridge-card-icon">
                <FileText size={18} />
              </div>
            </div>

            <form className="bridge-form-three" onSubmit={handleCreateDocument}>
              <input
                className="bridge-input"
                value={newDocument.title}
                onChange={(event) =>
                  setNewDocument((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="Document"
                aria-label="Bridge document"
              />
              <select
                className="bridge-select"
                value={newDocument.documentType}
                onChange={(event) =>
                  setNewDocument((current) => ({ ...current, documentType: event.target.value }))
                }
                aria-label="Bridge document type"
              >
                <option value="teaser">Teaser</option>
                <option value="nda">NDA pack</option>
                <option value="ic_memo">IC memo</option>
                <option value="data_room_index">Data room index</option>
              </select>
              <button className="bridge-button-lite" type="submit" disabled={!canManageBridge}>
                Add
              </button>
            </form>

            <div>
              {documents.map((item) => (
                <MiniRow key={item.id} label={item.title} value={item.ndaStatus || item.status} />
              ))}
            </div>
          </Card>

          <Card className="bridge-panel">
            <div className="bridge-panel-head">
              <div>
                <div className="bridge-kicker">
                  <FileText size={14} />
                  Executive reporting
                </div>
                <h3 className="bridge-panel-title">Network memos</h3>
                <p className="muted">
                  Persisted internal memos with heuristic matches, circulation risks and DSS recommendations.
                </p>
              </div>
              <button
                className="bridge-button-lite"
                type="button"
                onClick={handleGenerateNetworkReport}
                disabled={!canManageBridge}
              >
                Generate
              </button>
            </div>

            <div>
              {reports.map((item) => (
                <MiniRow key={item.id} label={item.title} value={item.status || item.reportType} />
              ))}
            </div>
          </Card>
        </section>

        <section className="bridge-grid bridge-grid-two">
          <Card className="bridge-panel">
            <div className="bridge-kicker">
              <Handshake size={14} />
              Introduction ledger
            </div>
            <h3 className="bridge-panel-title">{selectedOpportunity?.title || 'No opportunity selected'}</h3>
            <div>
              {(getPayload(selectedOpportunity).introductionLedger || []).map((item) => (
                <div className="bridge-ledger-row" key={item.id}>
                  <strong>{item.counterparty}</strong>
                  <span className="muted">{item.status}</span>
                  <span className="muted">{item.date}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bridge-panel">
            <div className="bridge-kicker">
              <LockKeyhole size={14} />
              Confidentiality control
            </div>
            <h3 className="bridge-panel-title">NDA, redaction and access posture</h3>
            <div>
              <MiniRow label="Exceptions" value={metrics.confidentialityExceptions} />
              <MiniRow label="Default circulation" value="Redacted teaser" />
              <MiniRow label="Board approval" value="Required for full data room" />
            </div>
          </Card>
        </section>

        <section className="bridge-section">
          <div>
            <div className="bridge-kicker">
              <Banknote size={14} />
              Transaction pipeline (preview)
            </div>
            <h2>Internal opportunity drafts</h2>
          </div>

          <div className="bridge-grid bridge-grid-two">
            {opportunities.map((record) => (
              <OpportunityCard
                key={record.id}
                record={record}
                onStageChange={handleStageChange}
                onConfidentialityChange={saveOpportunityPatch}
                onDelete={handleDelete}
                disabled={!canManageBridge}
              />
            ))}
          </div>
        </section>

        {backendStatus.error ? (
          <Card className="bridge-panel">
            <div className="bridge-kicker">
              <CheckCircle2 size={14} />
              Local fallback
            </div>
            <p className="muted">
              Bridge opera en modo demo local hasta que el backend ecosystem esté disponible.
            </p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
