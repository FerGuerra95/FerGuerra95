import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Download,
  ClipboardCheck,
  FileText,
  Gauge,
  GitBranch,
  Layers3,
  LineChart,
  ListChecks,
  Milestone,
  ShieldAlert,
  Sparkles,
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
import { usePMIStore } from '../store/pmiStore.jsx';
import { usePMIEngine } from '../engine/usePMIEngine.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import { pmiExportApi } from '../services/pmiExportApi.js';
import { maDealsApi } from '../../ma/services/maDealsApi.js';

const pmiDashboardCss = `
  .pmi-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 38px;
  }

  .pmi-hero {
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

  .pmi-hero::before {
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

  .pmi-hero::after {
    content: "";
    position: absolute;
    inset: auto -190px -210px auto;
    width: 520px;
    height: 520px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.13), transparent 70%);
    pointer-events: none;
  }

  .pmi-hero-layout {
    position: relative;
    z-index: 1;
    min-height: 470px;
    display: grid;
    grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.92fr);
    gap: 38px;
    align-items: center;
  }

  .pmi-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 26px;
  }

  .pmi-title {
    margin: 0;
    max-width: 940px;
    font-size: clamp(40px, 4.8vw, 68px);
    line-height: 0.94;
    letter-spacing: 0;
  }

  .pmi-title span {
    display: block;
    margin-top: 9px;
    color: rgba(226, 232, 240, 0.7);
  }

  .pmi-copy {
    max-width: 850px;
    margin: 28px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .pmi-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 30px;
  }

  .pmi-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .pmi-command-item {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.078);
    min-width: 0;
  }

  .pmi-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .pmi-signal-card {
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

  .pmi-signal-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: radial-gradient(circle at 18% 0%, rgba(96, 165, 250, 0.13), transparent 35%);
    pointer-events: none;
  }

  .pmi-signal-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .pmi-signal-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .pmi-icon-box,
  .pmi-card-icon,
  .pmi-panel-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .pmi-icon-box {
    width: 50px;
    height: 50px;
  }

  .pmi-card-icon,
  .pmi-panel-icon {
    width: 46px;
    height: 46px;
  }

  .pmi-signal-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.16;
    letter-spacing: 0;
  }

  .pmi-score-module {
    display: grid;
    grid-template-columns: 104px minmax(0, 1fr);
    gap: 18px;
    align-items: center;
    padding: 18px;
    border-radius: 26px;
    background: rgba(255,255,255,0.047);
    border: 1px solid rgba(255,255,255,0.085);
  }

  .pmi-score-ring {
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

  .pmi-score-core {
    width: 72px;
    height: 72px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.97);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .pmi-score-core strong {
    font-size: 23px;
    letter-spacing: 0;
  }

  .pmi-score-copy strong {
    display: block;
    margin-bottom: 8px;
  }

  .pmi-score-copy p {
    margin: 0;
    line-height: 1.58;
  }

  .pmi-signal-table {
    display: grid;
  }

  .pmi-signal-row {
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    gap: 14px;
    align-items: center;
    padding: 12px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }

  .pmi-signal-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .pmi-section {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .pmi-section-header {
    display: flex;
    justify-content: space-between;
    gap: 28px;
    align-items: flex-end;
  }

  .pmi-kicker {
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

  .pmi-section-header h2,
  .pmi-section-header h3 {
    margin: 0;
    letter-spacing: 0;
  }

  .pmi-section-header p {
    max-width: 820px;
    margin: 11px 0 0;
    line-height: 1.68;
  }

  .pmi-grid {
    display: grid;
    gap: 26px;
    align-items: stretch;
  }

  .pmi-grid-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .pmi-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .pmi-grid-three {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .pmi-kpi-card,
  .pmi-panel,
  .pmi-workstream-card,
  .pmi-risk-card,
  .pmi-milestone-card {
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

  .pmi-kpi-card {
    min-height: 188px;
    padding: 27px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 22px;
  }

  .pmi-kpi-top,
  .pmi-card-head,
  .pmi-panel-head {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .pmi-kpi-value {
    margin-top: 12px;
    font-size: 25px;
    font-weight: 790;
    line-height: 1.12;
    letter-spacing: 0;
    overflow-wrap: anywhere;
  }

  .pmi-kpi-card p {
    margin: 0;
    line-height: 1.56;
  }

  .pmi-panel,
  .pmi-workstream-card,
  .pmi-risk-card,
  .pmi-milestone-card {
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .pmi-card-title,
  .pmi-panel-title {
    margin: 0;
    letter-spacing: 0;
  }

  .pmi-card-copy,
  .pmi-panel-copy {
    margin: 10px 0 0;
    line-height: 1.62;
  }

  .pmi-progress-track {
    overflow: hidden;
    height: 10px;
    border-radius: 999px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .pmi-progress-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(37, 99, 235, 0.95), rgba(16, 185, 129, 0.95));
  }

  .pmi-mini-row {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 12px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.13);
  }

  .pmi-mini-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .pmi-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .pmi-link-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: auto;
  }

  .pmi-link {
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

  .pmi-muted-tight {
    margin-bottom: 0;
  }

  .pmi-enterprise-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    margin-top: 24px;
  }

  .pmi-enterprise-status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 40px;
    padding: 9px 12px;
    border-radius: 999px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(226, 232, 240, 0.82);
    font-size: 12px;
    font-weight: 750;
  }

  .pmi-control-grid {
    display: grid;
    gap: 14px;
  }

  .pmi-control-row {
    display: grid;
    grid-template-columns: minmax(160px, 1fr) minmax(150px, 0.8fr) minmax(120px, 0.6fr) auto;
    gap: 14px;
    align-items: center;
    padding: 14px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.13);
  }

  .pmi-control-row strong,
  .pmi-control-row span {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .pmi-ledger-row,
  .pmi-dependency-row,
  .pmi-playbook-row {
    display: grid;
    gap: 12px;
    padding: 14px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.13);
  }

  .pmi-ledger-row {
    grid-template-columns: minmax(190px, 1.2fr) minmax(110px, 0.7fr) minmax(120px, 0.8fr) minmax(110px, 0.7fr) auto;
    align-items: center;
  }

  .pmi-dependency-row {
    grid-template-columns: minmax(190px, 1fr) minmax(120px, 0.65fr) minmax(120px, 0.65fr) auto;
    align-items: center;
  }

  .pmi-playbook-row {
    grid-template-columns: minmax(150px, 0.7fr) minmax(0, 1fr);
  }

  .pmi-checklist {
    display: grid;
    gap: 8px;
  }

  .pmi-check-row {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 10px;
    align-items: center;
    color: rgba(226, 232, 240, 0.86);
    font-size: 13px;
  }

  .pmi-check-row input {
    accent-color: #10b981;
  }

  .pmi-status-pill {
    display: inline-flex;
    width: fit-content;
    align-items: center;
    border-radius: 999px;
    padding: 6px 10px;
    background: rgba(15, 23, 42, 0.68);
    border: 1px solid rgba(148, 163, 184, 0.16);
    color: rgba(226, 232, 240, 0.82);
    font-size: 12px;
    font-weight: 800;
  }

  .pmi-range {
    width: 100%;
    accent-color: #10b981;
  }

  .pmi-select,
  .pmi-inline-input {
    width: 100%;
    min-height: 40px;
    border-radius: 14px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background: rgba(15, 23, 42, 0.72);
    color: rgba(226, 232, 240, 0.94);
    padding: 9px 11px;
    outline: none;
  }

  .pmi-inline-form {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 12px;
    align-items: center;
  }

  .pmi-inline-form-three {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr) auto;
    gap: 12px;
    align-items: center;
  }

  .pmi-audit-item {
    padding: 13px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.13);
  }

  .pmi-audit-item strong {
    display: block;
    margin-bottom: 4px;
  }

  .pmi-button-lite {
    min-height: 38px;
    border-radius: 14px;
    border: 1px solid rgba(96, 165, 250, 0.24);
    background: rgba(37, 99, 235, 0.16);
    color: rgba(226, 232, 240, 0.94);
    font-weight: 800;
    cursor: pointer;
    padding: 8px 12px;
  }

  .pmi-button-lite:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  @media (max-width: 1180px) {
    .pmi-hero {
      min-height: auto;
      padding: 34px;
    }

    .pmi-hero-layout,
    .pmi-grid-three,
    .pmi-grid-two {
      grid-template-columns: 1fr;
    }

    .pmi-signal-card {
      max-width: none;
      justify-self: stretch;
    }

    .pmi-grid-kpis {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 780px) {
    .pmi-command-bar,
    .pmi-grid-kpis {
      grid-template-columns: 1fr;
    }

    .pmi-title {
      font-size: clamp(36px, 11vw, 54px);
    }

    .pmi-section-header {
      align-items: flex-start;
      flex-direction: column;
    }

    .pmi-score-module {
      grid-template-columns: 1fr;
    }

    .pmi-control-row,
    .pmi-ledger-row,
    .pmi-dependency-row,
    .pmi-playbook-row,
    .pmi-inline-form,
    .pmi-inline-form-three {
      grid-template-columns: 1fr;
    }

    .pmi-signal-row {
      grid-template-columns: 1fr;
      gap: 7px;
    }

    .pmi-signal-row strong {
      text-align: left;
    }
  }
`;

function CommandItem({ label, value }) {
  return (
    <div className="pmi-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SignalRow({ label, value }) {
  return (
    <div className="pmi-signal-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SectionHeader({ kicker, icon: Icon, title, description }) {
  return (
    <div className="pmi-section-header">
      <div>
        <div className="pmi-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h2>{title}</h2>

        <p className="muted">{description}</p>
      </div>
    </div>
  );
}

function KpiCard({ label, value, description, icon: Icon, tone = '' }) {
  return (
    <article className="pmi-kpi-card">
      <div className="pmi-kpi-top">
        <div>
          <div className="kpi-label">{label}</div>

          <div className={`pmi-kpi-value ${tone}`.trim()}>
            {value}
          </div>
        </div>

        <div className="pmi-card-icon">
          <Icon size={18} />
        </div>
      </div>

      <p className="muted">{description}</p>
    </article>
  );
}

function MiniRow({ label, value }) {
  return (
    <div className="pmi-mini-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="pmi-progress-track">
      <div
        className="pmi-progress-fill"
        style={{ width: `${Math.max(0, Math.min(100, Number(value) || 0))}%` }}
      />
    </div>
  );
}

function EnterpriseStatus({ backendStatus }) {
  if (backendStatus?.loading) {
    return <span className="pmi-enterprise-status">Syncing enterprise layer</span>;
  }

  if (backendStatus?.error) {
    return <span className="pmi-enterprise-status">Local fallback active</span>;
  }

  if (backendStatus?.hydrated) {
    return <span className="pmi-enterprise-status">Enterprise backend synced</span>;
  }

  return <span className="pmi-enterprise-status">Enterprise data contract ready</span>;
}

function WorkstreamControl({ item, onUpdate, onRemove, disabled = false }) {
  return (
    <div className="pmi-control-row">
      <div>
        <strong>{item.name}</strong>
        <div className="kpi-label">{item.owner}</div>
      </div>

      <input
        className="pmi-range"
        type="range"
        min="0"
        max="100"
        value={Number(item.progress) || 0}
        onChange={(event) =>
          onUpdate(item.id, {
            progress: Number(event.target.value)
          })
        }
        aria-label={`${item.name} progress`}
        disabled={disabled}
      />

      <select
        className="pmi-select"
        value={item.risk || 'Medium'}
        onChange={(event) =>
          onUpdate(item.id, {
            risk: event.target.value
          })
        }
        aria-label={`${item.name} risk`}
        disabled={disabled}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <button
        type="button"
        className="pmi-button-lite"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.name}`}
        disabled={disabled}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function MilestoneControl({ item, onUpdate, onRemove, disabled = false }) {
  return (
    <div className="pmi-control-row">
      <div>
        <strong>{item.label}</strong>
        <div className="kpi-label">{item.title}</div>
      </div>

      <input
        className="pmi-range"
        type="range"
        min="0"
        max="100"
        value={Number(item.progress) || 0}
        onChange={(event) =>
          onUpdate(item.id, {
            progress: Number(event.target.value),
            status: Number(event.target.value) >= 100 ? 'Completed' : item.status
          })
        }
        aria-label={`${item.label} progress`}
        disabled={disabled}
      />

      <select
        className="pmi-select"
        value={item.status || 'Pending'}
        onChange={(event) =>
          onUpdate(item.id, {
            status: event.target.value
          })
        }
        aria-label={`${item.label} status`}
        disabled={disabled}
      >
        <option value="Pending">Pending</option>
        <option value="In progress">In progress</option>
        <option value="Completed">Completed</option>
        <option value="Blocked">Blocked</option>
      </select>

      <button
        type="button"
        className="pmi-button-lite"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.label}`}
        disabled={disabled}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function RiskControl({ item, onUpdate, onRemove, disabled = false }) {
  return (
    <div className="pmi-control-row">
      <div>
        <strong>{item.title}</strong>
        <div className="kpi-label">{item.owner}</div>
      </div>

      <select
        className="pmi-select"
        value={item.severity || 'Medium'}
        onChange={(event) =>
          onUpdate(item.id, {
            severity: event.target.value
          })
        }
        aria-label={`${item.title} severity`}
        disabled={disabled}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Critical">Critical</option>
      </select>

      <select
        className="pmi-select"
        value={item.status || 'open'}
        onChange={(event) =>
          onUpdate(item.id, {
            status: event.target.value
          })
        }
        aria-label={`${item.title} status`}
        disabled={disabled}
      >
        <option value="open">Open</option>
        <option value="mitigating">Mitigating</option>
        <option value="mitigated">Mitigated</option>
        <option value="closed">Closed</option>
      </select>

      <button
        type="button"
        className="pmi-button-lite"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.title}`}
        disabled={disabled}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function SynergyLedgerRow({ item, currency, onUpdate, onRemove, disabled = false }) {
  return (
    <div className="pmi-ledger-row">
      <div>
        <strong>{item.name}</strong>
        <div className="muted">{item.owner || 'PMI Owner'} · {item.type || 'Cost'}</div>
      </div>

      <input
        className="pmi-inline-input"
        type="number"
        min="0"
        value={item.forecast || 0}
        onChange={(event) => onUpdate(item.id, { forecast: Number(event.target.value) || 0 })}
        aria-label={`${item.name} forecast`}
        disabled={disabled}
      />

      <input
        className="pmi-inline-input"
        type="number"
        min="0"
        value={item.captured || 0}
        onChange={(event) => onUpdate(item.id, { captured: Number(event.target.value) || 0 })}
        aria-label={`${item.name} captured`}
        disabled={disabled}
      />

      <select
        className="pmi-select"
        value={item.status || 'Baseline'}
        onChange={(event) => onUpdate(item.id, { status: event.target.value })}
        aria-label={`${item.name} status`}
        disabled={disabled}
      >
        <option value="Baseline">Baseline</option>
        <option value="Thesis linked">Thesis linked</option>
        <option value="Capturing">Capturing</option>
        <option value="Validated">Validated</option>
        <option value="At risk">At risk</option>
      </select>

      <button
        type="button"
        className="pmi-button-lite"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.name}`}
        disabled={disabled}
      >
        <Trash2 size={14} />
      </button>

      <span className="muted">
        {formatCurrency(item.captured || 0, currency)} captured of {formatCurrency(item.forecast || 0, currency)}
      </span>
    </div>
  );
}

function PlaybookControl({ item, onToggle, disabled = false }) {
  const checklist = Array.isArray(item.checklist) ? item.checklist : [];
  const done = checklist.filter((check) => check.done).length;
  const progress =
    checklist.length > 0 ? Math.round((done / checklist.length) * 100) : Number(item.progress) || 0;

  return (
    <div className="pmi-playbook-row">
      <div>
        <div className="pmi-status-pill">{item.label}</div>
        <h3 className="pmi-card-title">{item.title}</h3>
        <p className="muted pmi-card-copy">{item.owner || 'PMI Office'} · {progress}% complete</p>
        <ProgressBar value={progress} />
      </div>

      <div className="pmi-checklist">
        {checklist.map((check) => (
          <label className="pmi-check-row" key={check.id}>
            <input
              type="checkbox"
              checked={Boolean(check.done)}
              onChange={() => onToggle(item.id, check.id)}
              disabled={disabled}
            />
            <span>{check.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function DependencyControl({ item, workstreams, onUpdate, onRemove, disabled = false }) {
  const workstreamName = (id) =>
    workstreams.find((workstream) => workstream.id === id)?.name || id || 'Unassigned';

  return (
    <div className="pmi-dependency-row">
      <div>
        <strong>{item.title}</strong>
        <div className="muted">
          {workstreamName(item.fromWorkstreamId)} → {workstreamName(item.toWorkstreamId)}
        </div>
      </div>

      <select
        className="pmi-select"
        value={item.status || 'Monitoring'}
        onChange={(event) => onUpdate(item.id, { status: event.target.value })}
        aria-label={`${item.title} status`}
        disabled={disabled}
      >
        <option value="Open">Open</option>
        <option value="Monitoring">Monitoring</option>
        <option value="Blocked">Blocked</option>
        <option value="Resolved">Resolved</option>
      </select>

      <select
        className="pmi-select"
        value={item.severity || 'Medium'}
        onChange={(event) => onUpdate(item.id, { severity: event.target.value })}
        aria-label={`${item.title} severity`}
        disabled={disabled}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Critical">Critical</option>
      </select>

      <button
        type="button"
        className="pmi-button-lite"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.title}`}
        disabled={disabled}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function WorkstreamCard({ item }) {
  return (
    <article className="pmi-workstream-card">
      <div className="pmi-card-head">
        <div>
          <h3 className="pmi-card-title">{item.name}</h3>
          <p className="muted pmi-card-copy">{item.summary}</p>
        </div>

        <Badge>{item.risk}</Badge>
      </div>

      <ProgressBar value={item.progress} />

      <div>
        <MiniRow label="Owner" value={item.owner} />
        <MiniRow label="Progress" value={`${item.progress}%`} />
        <MiniRow label="Priority" value={item.priority} />
      </div>
    </article>
  );
}

function RiskCard({ item }) {
  return (
    <article className="pmi-risk-card">
      <div className="pmi-card-head">
        <div>
          <h3 className="pmi-card-title">{item.title}</h3>
          <p className="muted pmi-card-copy">{item.mitigation}</p>
        </div>

        <Badge>{item.severity}</Badge>
      </div>

      <MiniRow label="Owner" value={item.owner} />
    </article>
  );
}

function MilestoneCard({ item }) {
  return (
    <article className="pmi-milestone-card">
      <div className="pmi-card-head">
        <div>
          <div className="pmi-kicker">
            <Milestone size={14} />
            {item.label}
          </div>

          <h3 className="pmi-card-title">{item.title}</h3>
          <p className="muted pmi-card-copy">{item.summary}</p>
        </div>

        <Badge>{item.status}</Badge>
      </div>

      <ProgressBar value={item.progress} />
      <MiniRow label="Progress" value={`${item.progress}%`} />
    </article>
  );
}

export function PMIDashboardPage() {
  const { PERMISSIONS, can } = useAuth();
  const {
    pmiCase,
    pmiCases,
    auditLogs,
    patchPmiCase,
    savePmiCase,
    selectPmiCase,
    createBlankPmiCase,
    duplicatePmiCase,
    removePmiCase,
    createFromMaDeal,
    pmiTemplates,
    refreshAuditLogs,
    updateWorkstream,
    addWorkstream,
    removeWorkstream,
    updateRisk,
    addRisk,
    removeRisk,
    updateMilestone,
    addMilestone,
    removeMilestone,
    updateSynergyInitiative,
    addSynergyInitiative,
    removeSynergyInitiative,
    togglePlaybookCheck,
    updateDependency,
    addDependency,
    removeDependency,
    addBoardAction,
    closeBoardAction,
    backendStatus
  } = usePMIStore();
  const [newBoardAction, setNewBoardAction] = useState('');
  const [maDeals, setMaDeals] = useState([]);
  const [selectedMaDealId, setSelectedMaDealId] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('industrial');
  const [newWorkstream, setNewWorkstream] = useState({ name: '', owner: '' });
  const [newMilestone, setNewMilestone] = useState({ label: '', title: '' });
  const [newRisk, setNewRisk] = useState({ title: '', owner: '', severity: 'Medium' });
  const [newSynergy, setNewSynergy] = useState({ name: '', owner: '', forecast: '' });
  const [newDependency, setNewDependency] = useState({ title: '', owner: '' });
  const engine = usePMIEngine({ pmiCase });
  const canManagePmi = can(PERMISSIONS.MANAGE_PMI_CASE);
  const canUpdatePmi = can(PERMISSIONS.UPDATE_PMI_WORKSTREAM);
  const canCreateFromMa = can(PERMISSIONS.CREATE_PMI_FROM_MA_DEAL);
  const canDuplicatePmi = can(PERMISSIONS.DUPLICATE_PMI_CASE);
  const canReadAudit = can(PERMISSIONS.READ_PMI_AUDIT);

  const scoreAngle = `${engine.integrationScore * 3.6}deg`;

  useEffect(() => {
    let cancelled = false;

    async function loadMaDeals() {
      try {
        const items = await maDealsApi.list();
        if (cancelled) return;
        setMaDeals(items);
        setSelectedMaDealId((current) => current || items[0]?.id || '');
      } catch {
        if (!cancelled) setMaDeals([]);
      }
    }

    loadMaDeals();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (pmiCase?.id && canReadAudit) {
      refreshAuditLogs(pmiCase.id);
    }
  }, [pmiCase?.id, canReadAudit]);

  function handleExportBoardMemo() {
    pmiExportApi.exportBoardMemo({
      pmiCase,
      engine
    });
  }

  function handleAddBoardAction(event) {
    event.preventDefault();
    const action = newBoardAction.trim();
    if (!action) return;
    setNewBoardAction('');
    addBoardAction(action);
  }

  function handleAddWorkstream(event) {
    event.preventDefault();
    addWorkstream(newWorkstream);
    setNewWorkstream({ name: '', owner: '' });
  }

  function handleAddMilestone(event) {
    event.preventDefault();
    addMilestone(newMilestone);
    setNewMilestone({ label: '', title: '' });
  }

  function handleAddRisk(event) {
    event.preventDefault();
    addRisk(newRisk);
    setNewRisk({ title: '', owner: '', severity: 'Medium' });
  }

  function handleAddSynergy(event) {
    event.preventDefault();
    addSynergyInitiative(newSynergy);
    setNewSynergy({ name: '', owner: '', forecast: '' });
  }

  function handleAddDependency(event) {
    event.preventDefault();
    addDependency(newDependency);
    setNewDependency({ title: '', owner: '' });
  }

  return (
    <div className="page">
      <style>{pmiDashboardCss}</style>

      <div className="pmi-page">
        <section className="pmi-hero ceos-ws-hero">
          <div className="pmi-hero-layout">
            <div>
              <div className="pmi-badge-row">
                <Badge>PMI & Synergies</Badge>
                <Badge>Post-Merger Integration</Badge>
                <Badge>Execution Layer</Badge>
                <Badge>{pmiCase.status}</Badge>
              </div>

              <h1 className="pmi-title">
                PMI & Synergies Command Center.
                <span>Turn deal thesis into captured value.</span>
              </h1>

              <p className="pmi-copy">
                Capa post-operación para convertir una adquisición en ejecución:
                plan 30-60-90, workstreams, sinergias, riesgos, owners,
                presupuesto y memo ejecutivo para comité.
              </p>
              <div className="pmi-actions">
                <Button onClick={handleExportBoardMemo} variant="secondary">
                  <Download size={16} />
                  Export Board Memo
                </Button>
                <Button
                  onClick={() =>
                    patchPmiCase({
                      status:
                        pmiCase.status === 'Board review'
                          ? 'Active integration'
                          : 'Board review'
                    })
                  }
                  variant="secondary"
                  loading={backendStatus?.loading}
                  disabled={!canUpdatePmi}
                >
                  <ClipboardCheck size={16} />
                  Toggle Board Review
                </Button>
              </div>

              <div className="pmi-enterprise-toolbar">
                <EnterpriseStatus backendStatus={backendStatus} />
                <button
                  type="button"
                  className="pmi-button-lite"
                  onClick={() => savePmiCase(pmiCase)}
                  disabled={backendStatus?.loading || !canUpdatePmi}
                >
                  Save enterprise state
                </button>
              </div>

              <div className="pmi-command-bar">
                <CommandItem label="Deal" value={pmiCase.dealName} />
                <CommandItem label="Integration day" value={`Day ${pmiCase.integrationDay}`} />
                <CommandItem label="Current posture" value={engine.signalPosture} />
              </div>
            </div>

            <aside className="pmi-signal-card">
              <div className="pmi-signal-inner">
                <div className="pmi-signal-top">
                  <div>
                    <div className="kpi-label">Integration Signal</div>
                    <div className="pmi-signal-title">
                      {engine.signalTitle}
                    </div>
                  </div>

                  <div className="pmi-icon-box">
                    <Sparkles size={21} />
                  </div>
                </div>

                <div className="pmi-score-module">
                  <div
                    className="pmi-score-ring"
                    style={{ '--score-angle': scoreAngle }}
                  >
                    <div className="pmi-score-core">
                      <strong>{engine.integrationScore}</strong>
                    </div>
                  </div>

                  <div className="pmi-score-copy">
                    <strong>{engine.signalPosture}</strong>

                    <p className="muted">
                      {engine.signalDescription}
                    </p>
                  </div>
                </div>

                <div className="pmi-signal-table">
                  <SignalRow label="Synergy capture" value={`${engine.synergyCaptureRate}%`} />
                  <SignalRow label="Ledger capture" value={`${engine.ledgerCaptureRate}%`} />
                  <SignalRow label="Playbook progress" value={`${engine.playbookProgress}%`} />
                  <SignalRow label="Workstream progress" value={`${engine.workstreamProgress}%`} />
                  <SignalRow label="Milestone progress" value={`${engine.milestoneProgress}%`} />
                  <SignalRow label="High risks" value={engine.highRiskCount} />
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="pmi-section">
          <SectionHeader
            kicker="Enterprise case manager"
            icon={BriefcaseBusiness}
            title="PMI case portfolio"
            description="Selecciona, crea, duplica o convierte una oportunidad M&A en caso PMI conectado."
          />

          <div className="pmi-grid pmi-grid-two">
            <Card className="pmi-panel">
              <div className="pmi-panel-head">
                <div>
                  <div className="pmi-kicker">
                    <BriefcaseBusiness size={14} />
                    Multi-case
                  </div>
                  <h3 className="pmi-panel-title">Active PMI case</h3>
                  <p className="muted pmi-panel-copy">
                    Cambia entre integraciones sin perder el contrato enterprise.
                  </p>
                </div>
                <div className="pmi-panel-icon">
                  <Layers3 size={18} />
                </div>
              </div>

              <select
                className="pmi-select"
                value={pmiCase.id || ''}
                onChange={(event) => selectPmiCase(event.target.value)}
                aria-label="Select PMI case"
              >
                <option value="">Demo PMI case</option>
                {pmiCases.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.dealName}
                  </option>
                ))}
              </select>

              <div className="pmi-enterprise-toolbar">
                <select
                  className="pmi-select"
                  value={selectedTemplate}
                  onChange={(event) => setSelectedTemplate(event.target.value)}
                  aria-label="Select PMI template"
                >
                  {Object.entries(pmiTemplates || {}).map(([key, template]) => (
                    <option value={key} key={key}>
                      {template.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="pmi-button-lite"
                  onClick={() => createBlankPmiCase(selectedTemplate)}
                  disabled={!canManagePmi}
                >
                  New from template
                </button>
                <button
                  type="button"
                  className="pmi-button-lite"
                  onClick={() => duplicatePmiCase(pmiCase.id)}
                  disabled={!canDuplicatePmi}
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  className="pmi-button-lite"
                  onClick={() => removePmiCase(pmiCase.id)}
                  disabled={!pmiCase.id || !canManagePmi}
                >
                  Archive
                </button>
              </div>
            </Card>

            <Card className="pmi-panel">
              <div className="pmi-panel-head">
                <div>
                  <div className="pmi-kicker">
                    <ArrowRight size={14} />
                    M&A handoff
                  </div>
                  <h3 className="pmi-panel-title">Convert deal to PMI</h3>
                  <p className="muted pmi-panel-copy">
                    Crea el plan 30-60-90, riesgos y workstreams desde una oportunidad M&A.
                  </p>
                </div>
                <div className="pmi-panel-icon">
                  <FileText size={18} />
                </div>
              </div>

              <select
                className="pmi-select"
                value={selectedMaDealId}
                onChange={(event) => setSelectedMaDealId(event.target.value)}
                aria-label="Select M&A deal"
              >
                <option value="">No M&A deal selected</option>
                {maDeals.map((deal) => (
                  <option value={deal.id} key={deal.id}>
                    {deal.name}
                  </option>
                ))}
              </select>

              <div className="pmi-enterprise-toolbar">
                <button
                  type="button"
                  className="pmi-button-lite"
                  onClick={() => createFromMaDeal(selectedMaDealId)}
                  disabled={!selectedMaDealId || !canCreateFromMa}
                >
                  Convert to PMI
                </button>
                <Link className="pmi-link" to="/ma/dashboard">
                  Open M&A
                  <ArrowRight size={14} />
                </Link>
              </div>
            </Card>
          </div>
        </section>

        <section className="pmi-section">
          <SectionHeader
            kicker="Executive snapshot"
            icon={Activity}
            title="Integration at a glance"
            description="Vista ejecutiva de sinergias, presupuesto, workstreams, riesgos y progreso post-cierre."
          />

          <div className="pmi-grid pmi-grid-kpis">
            <KpiCard
              label="Synergies captured"
              value={formatCurrency(engine.synergyCaptured, pmiCase.currency)}
              description={`Objetivo: ${formatCurrency(engine.synergyTarget, pmiCase.currency)}`}
              icon={TrendingUp}
              tone="text-success"
            />

            <KpiCard
              label="Capture rate"
              value={`${engine.synergyCaptureRate}%`}
              description="Porcentaje de sinergias capturadas frente al objetivo."
              icon={Target}
            />

            <KpiCard
              label="Budget used"
              value={`${engine.budgetUsedRate}%`}
              description={`Usado: ${formatCurrency(engine.integrationCostUsed, pmiCase.currency)}`}
              icon={Gauge}
            />

            <KpiCard
              label="Integration risks"
              value={engine.risks.length}
              description={`${engine.highRiskCount} de alta severidad. ${engine.openRiskCount} abiertos.`}
              icon={ShieldAlert}
              tone={engine.highRiskCount > 0 ? 'text-warning' : 'text-success'}
            />

            <KpiCard
              label="Playbook readiness"
              value={`${engine.playbookProgress}%`}
              description={`${engine.blockedDependencies.length} dependencias bloqueadas.`}
              icon={ListChecks}
              tone={engine.blockedDependencies.length > 0 ? 'text-warning' : 'text-success'}
            />
          </div>
        </section>

        <section className="pmi-section">
          <SectionHeader
            kicker="PMI operating system"
            icon={LineChart}
            title="Synergy ledger, playbooks and dependency heatmap"
            description="Control institucional de valor capturado, disciplina 30-60-90 y bloqueos críticos entre workstreams."
          />

          <div className="pmi-grid pmi-grid-two">
            <Card className="pmi-panel">
              <div className="pmi-panel-head">
                <div>
                  <div className="pmi-kicker">
                    <TrendingUp size={14} />
                    Synergy ledger
                  </div>
                  <h3 className="pmi-panel-title">Value capture register</h3>
                  <p className="muted pmi-panel-copy">
                    Forecast, captura, owner y estado por iniciativa económica.
                  </p>
                </div>
                <div className="pmi-panel-icon">
                  <LineChart size={18} />
                </div>
              </div>

              <div>
                <MiniRow
                  label="Ledger forecast"
                  value={formatCurrency(engine.ledgerForecast, pmiCase.currency)}
                />
                <MiniRow
                  label="Ledger captured"
                  value={formatCurrency(engine.ledgerCaptured, pmiCase.currency)}
                />
                <MiniRow label="Confidence" value={`${engine.ledgerConfidenceScore}%`} />
              </div>

              <div className="pmi-control-grid">
                {engine.synergyLedger.map((item) => (
                  <SynergyLedgerRow
                    key={item.id}
                    item={item}
                    currency={pmiCase.currency}
                    onUpdate={updateSynergyInitiative}
                    onRemove={removeSynergyInitiative}
                    disabled={!canUpdatePmi}
                  />
                ))}
              </div>

              <form className="pmi-inline-form-three" onSubmit={handleAddSynergy}>
                <input
                  className="pmi-inline-input"
                  value={newSynergy.name}
                  onChange={(event) =>
                    setNewSynergy((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="Initiative"
                  aria-label="New synergy initiative"
                />
                <input
                  className="pmi-inline-input"
                  value={newSynergy.owner}
                  onChange={(event) =>
                    setNewSynergy((current) => ({ ...current, owner: event.target.value }))
                  }
                  placeholder="Owner"
                  aria-label="Synergy owner"
                />
                <button className="pmi-button-lite" type="submit" disabled={!canUpdatePmi}>
                  Add
                </button>
              </form>
            </Card>

            <Card className="pmi-panel">
              <div className="pmi-panel-head">
                <div>
                  <div className="pmi-kicker">
                    <ListChecks size={14} />
                    Integration playbooks
                  </div>
                  <h3 className="pmi-panel-title">Board-ready execution checklist</h3>
                  <p className="muted pmi-panel-copy">
                    Day 1, Day 30 y Day 90 con evidencia operativa trazable.
                  </p>
                </div>
                <div className="pmi-panel-icon">
                  <ListChecks size={18} />
                </div>
              </div>

              <div className="pmi-control-grid">
                {engine.playbooks.map((item) => (
                  <PlaybookControl
                    key={item.id}
                    item={item}
                    onToggle={togglePlaybookCheck}
                    disabled={!canUpdatePmi}
                  />
                ))}
              </div>
            </Card>
          </div>

          <Card className="pmi-panel">
            <div className="pmi-panel-head">
              <div>
                <div className="pmi-kicker">
                  <GitBranch size={14} />
                  Dependency heatmap
                </div>
                <h3 className="pmi-panel-title">Critical path control</h3>
                <p className="muted pmi-panel-copy">
                  Bloqueos entre workstreams, severidad, owner y mitigación.
                </p>
              </div>
              <div className="pmi-panel-icon">
                <GitBranch size={18} />
              </div>
            </div>

            <div>
              <MiniRow label="Dependency risk score" value={`${engine.dependencyRiskScore}%`} />
              <MiniRow label="Blocked dependencies" value={engine.blockedDependencies.length} />
            </div>

            <div className="pmi-control-grid">
              {engine.dependencies.map((item) => (
                <DependencyControl
                  key={item.id}
                  item={item}
                  workstreams={engine.workstreams}
                  onUpdate={updateDependency}
                  onRemove={removeDependency}
                  disabled={!canUpdatePmi}
                />
              ))}
            </div>

            <form className="pmi-inline-form-three" onSubmit={handleAddDependency}>
              <input
                className="pmi-inline-input"
                value={newDependency.title}
                onChange={(event) =>
                  setNewDependency((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="Dependency"
                aria-label="New dependency"
              />
              <input
                className="pmi-inline-input"
                value={newDependency.owner}
                onChange={(event) =>
                  setNewDependency((current) => ({ ...current, owner: event.target.value }))
                }
                placeholder="Owner"
                aria-label="Dependency owner"
              />
              <button className="pmi-button-lite" type="submit" disabled={!canUpdatePmi}>
                Add
              </button>
            </form>
          </Card>
        </section>

        <section className="pmi-section">
          <SectionHeader
            kicker="Enterprise control"
            icon={Gauge}
            title="Live integration controls"
            description="Actualiza progreso, riesgo, hitos y acciones de comité con persistencia backend y fallback local."
          />

          <div className="pmi-grid pmi-grid-two">
            <Card className="pmi-panel">
              <div className="pmi-panel-head">
                <div>
                  <div className="pmi-kicker">
                    <Layers3 size={14} />
                    Workstream cockpit
                  </div>
                  <h3 className="pmi-panel-title">Execution sliders</h3>
                  <p className="muted pmi-panel-copy">
                    Ajusta progreso y riesgo por frente de integración.
                  </p>
                </div>
                <div className="pmi-panel-icon">
                  <Layers3 size={18} />
                </div>
              </div>

              <div className="pmi-control-grid">
                {engine.workstreams.map((item) => (
                  <WorkstreamControl
                    key={item.id}
                    item={item}
                    onUpdate={updateWorkstream}
                    onRemove={removeWorkstream}
                    disabled={!canUpdatePmi}
                  />
                ))}
              </div>

              <form className="pmi-inline-form-three" onSubmit={handleAddWorkstream}>
                <input
                  className="pmi-inline-input"
                  value={newWorkstream.name}
                  onChange={(event) =>
                    setNewWorkstream((current) => ({
                      ...current,
                      name: event.target.value
                    }))
                  }
                  placeholder="New workstream"
                  aria-label="New workstream"
                />
                <input
                  className="pmi-inline-input"
                  value={newWorkstream.owner}
                  onChange={(event) =>
                    setNewWorkstream((current) => ({
                      ...current,
                      owner: event.target.value
                    }))
                  }
                  placeholder="Owner"
                  aria-label="Workstream owner"
                />
                <button className="pmi-button-lite" type="submit" disabled={!canUpdatePmi}>
                  Add
                </button>
              </form>
            </Card>

            <Card className="pmi-panel">
              <div className="pmi-panel-head">
                <div>
                  <div className="pmi-kicker">
                    <Milestone size={14} />
                    30-60-90 governance
                  </div>
                  <h3 className="pmi-panel-title">Milestone control</h3>
                  <p className="muted pmi-panel-copy">
                    Gestiona avance y estado de hitos ejecutivos.
                  </p>
                </div>
                <div className="pmi-panel-icon">
                  <Milestone size={18} />
                </div>
              </div>

              <div className="pmi-control-grid">
                {engine.milestones.map((item) => (
                  <MilestoneControl
                    key={item.id}
                    item={item}
                    onUpdate={updateMilestone}
                    onRemove={removeMilestone}
                    disabled={!canUpdatePmi}
                  />
                ))}
              </div>

              <form className="pmi-inline-form-three" onSubmit={handleAddMilestone}>
                <input
                  className="pmi-inline-input"
                  value={newMilestone.label}
                  onChange={(event) =>
                    setNewMilestone((current) => ({
                      ...current,
                      label: event.target.value
                    }))
                  }
                  placeholder="Label"
                  aria-label="Milestone label"
                />
                <input
                  className="pmi-inline-input"
                  value={newMilestone.title}
                  onChange={(event) =>
                    setNewMilestone((current) => ({
                      ...current,
                      title: event.target.value
                    }))
                  }
                  placeholder="Milestone title"
                  aria-label="Milestone title"
                />
                <button className="pmi-button-lite" type="submit" disabled={!canUpdatePmi}>
                  Add
                </button>
              </form>
            </Card>
          </div>

          <div className="pmi-grid pmi-grid-two">
            <Card className="pmi-panel">
              <div className="pmi-panel-head">
                <div>
                  <div className="pmi-kicker">
                    <AlertTriangle size={14} />
                    Risk register
                  </div>
                  <h3 className="pmi-panel-title">Mitigation workflow</h3>
                  <p className="muted pmi-panel-copy">
                    Cambia severidad y estado de mitigación sin salir del dashboard.
                  </p>
                </div>
                <div className="pmi-panel-icon">
                  <ShieldAlert size={18} />
                </div>
              </div>

              <div className="pmi-control-grid">
                {engine.risks.map((item) => (
                  <RiskControl
                    key={item.id}
                    item={item}
                    onUpdate={updateRisk}
                    onRemove={removeRisk}
                    disabled={!canUpdatePmi}
                  />
                ))}
              </div>

              <form className="pmi-inline-form-three" onSubmit={handleAddRisk}>
                <input
                  className="pmi-inline-input"
                  value={newRisk.title}
                  onChange={(event) =>
                    setNewRisk((current) => ({
                      ...current,
                      title: event.target.value
                    }))
                  }
                  placeholder="New risk"
                  aria-label="New risk"
                />
                <input
                  className="pmi-inline-input"
                  value={newRisk.owner}
                  onChange={(event) =>
                    setNewRisk((current) => ({
                      ...current,
                      owner: event.target.value
                    }))
                  }
                  placeholder="Owner"
                  aria-label="Risk owner"
                />
                <button className="pmi-button-lite" type="submit" disabled={!canUpdatePmi}>
                  Add
                </button>
              </form>
            </Card>

            <Card className="pmi-panel">
              <div className="pmi-panel-head">
                <div>
                  <div className="pmi-kicker">
                    <Target size={14} />
                    Value capture
                  </div>
                  <h3 className="pmi-panel-title">Synergy and budget command</h3>
                  <p className="muted pmi-panel-copy">
                    Controla captura de sinergias, gap pendiente y presupuesto restante.
                  </p>
                </div>
                <div className="pmi-panel-icon">
                  <TrendingUp size={18} />
                </div>
              </div>

              <div>
                <MiniRow
                  label="Synergy gap"
                  value={formatCurrency(engine.synergyGap, pmiCase.currency)}
                />
                <MiniRow
                  label="Budget remaining"
                  value={formatCurrency(engine.budgetRemaining, pmiCase.currency)}
                />
                <MiniRow label="Execution velocity" value={`${engine.executionVelocity}%`} />
                <MiniRow
                  label="Blocked workstreams"
                  value={engine.blockedWorkstreams.length}
                />
              </div>

              <div className="pmi-control-grid">
                <label className="kpi-label" htmlFor="pmi-synergy-captured">
                  Synergies captured
                </label>
                <input
                  id="pmi-synergy-captured"
                  className="pmi-inline-input"
                  type="number"
                  min="0"
                  max={pmiCase.synergyTarget || undefined}
                  value={pmiCase.synergyCaptured}
                  disabled={!canUpdatePmi}
                  onChange={(event) =>
                    patchPmiCase({
                      synergyCaptured: Math.min(
                        Number(event.target.value) || 0,
                        Number(pmiCase.synergyTarget) || Number(event.target.value) || 0
                      )
                    })
                  }
                />
                <label className="kpi-label" htmlFor="pmi-cost-used">
                  Integration cost used
                </label>
                <input
                  id="pmi-cost-used"
                  className="pmi-inline-input"
                  type="number"
                  min="0"
                  max={pmiCase.integrationBudget || undefined}
                  value={pmiCase.integrationCostUsed}
                  disabled={!canUpdatePmi}
                  onChange={(event) =>
                    patchPmiCase({
                      integrationCostUsed: Math.min(
                        Number(event.target.value) || 0,
                        Number(pmiCase.integrationBudget) || Number(event.target.value) || 0
                      )
                    })
                  }
                />
              </div>
            </Card>
          </div>
        </section>

        <section className="pmi-grid pmi-grid-two">
          <Card className="pmi-panel">
            <div className="pmi-panel-head">
              <div>
                <div className="pmi-kicker">
                  <BriefcaseBusiness size={14} />
                  Deal context
                </div>

                <h3 className="pmi-panel-title">Post-close integration file</h3>

                <p className="muted pmi-panel-copy">
                  Contexto ejecutivo de la operación y del plan de integración.
                </p>
              </div>

              <div className="pmi-panel-icon">
                <FileText size={18} />
              </div>
            </div>

            <div>
              <MiniRow label="Buyer" value={pmiCase.buyerName} />
              <MiniRow label="Target" value={pmiCase.targetName} />
              <MiniRow label="Closing date" value={pmiCase.closingDate} />
              <MiniRow label="Status" value={pmiCase.status} />
            </div>
          </Card>

          <Card className="pmi-panel">
            <div className="pmi-panel-head">
              <div>
                <div className="pmi-kicker">
                  <ClipboardCheck size={14} />
                  Board actions
                </div>

                <h3 className="pmi-panel-title">Executive priorities</h3>

                <p className="muted pmi-panel-copy">
                  Acciones prioritarias para mantener el plan post-adquisición bajo control.
                </p>
              </div>

              <div className="pmi-panel-icon">
                <CheckCircle2 size={18} />
              </div>
            </div>

            <div className="pmi-list">
              {engine.boardActions.map((action) => (
                <div className="pmi-mini-row" key={action}>
                  <span className="muted">{action}</span>
                  <button
                    type="button"
                    className="pmi-button-lite"
                    onClick={() => closeBoardAction(action)}
                    disabled={!canUpdatePmi}
                  >
                    Close
                  </button>
                </div>
              ))}
            </div>

            <form className="pmi-inline-form" onSubmit={handleAddBoardAction}>
              <input
                className="pmi-inline-input"
                value={newBoardAction}
                onChange={(event) => setNewBoardAction(event.target.value)}
                placeholder="Add board action"
                aria-label="Add board action"
              />
              <button className="pmi-button-lite" type="submit" disabled={!canUpdatePmi}>
                Add
              </button>
            </form>
          </Card>
        </section>

        <section className="pmi-section">
          <SectionHeader
            kicker="Audit trail"
            icon={ShieldAlert}
            title="PMI governance log"
            description="Historial enterprise de cambios sobre el caso PMI activo para control ejecutivo y trazabilidad."
          />

          <Card className="pmi-panel">
            <div className="pmi-panel-head">
              <div>
                <div className="pmi-kicker">
                  <ShieldAlert size={14} />
                  Audit evidence
                </div>
                <h3 className="pmi-panel-title">Recent PMI activity</h3>
                <p className="muted pmi-panel-copy">
                  Cambios de creación, actualización, conversión desde M&A, duplicado y borrado.
                </p>
              </div>
              <button
                type="button"
                className="pmi-button-lite"
                onClick={() => refreshAuditLogs(pmiCase.id)}
                disabled={!pmiCase.id || !canReadAudit}
              >
                Refresh
              </button>
            </div>

            <div className="pmi-list">
              {auditLogs.length === 0 ? (
                <div className="pmi-audit-item">
                  <strong>No audit entries yet</strong>
                  <span className="muted">La auditoría aparecerá cuando el backend registre cambios PMI.</span>
                </div>
              ) : (
                auditLogs.slice(0, 8).map((item) => (
                  <div className="pmi-audit-item" key={item.id}>
                    <strong>{item.action}</strong>
                    <span className="muted">
                      {item.createdAt} · {item.userId}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>

        <section className="pmi-section">
          <SectionHeader
            kicker="30-60-90 plan"
            icon={CalendarDays}
            title="Integration execution plan"
            description="Plan ejecutivo para convertir el cierre de la operación en ejecución, control y captura de valor."
          />

          <div className="pmi-grid pmi-grid-kpis">
            {engine.milestones.map((item) => (
              <MilestoneCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className="pmi-section">
          <SectionHeader
            kicker="Workstreams"
            icon={Layers3}
            title="Integration workstreams"
            description="Frentes de integración con owner, progreso, prioridad y riesgo asociado."
          />

          <div className="pmi-grid pmi-grid-two">
            {engine.workstreams.map((item) => (
              <WorkstreamCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className="pmi-section">
          <SectionHeader
            kicker="Risk control"
            icon={AlertTriangle}
            title="Integration risks & mitigants"
            description="Riesgos principales post-cierre y mitigantes para elevar a comité o responsables de integración."
          />

          <div className="pmi-grid pmi-grid-three">
            {engine.risks.map((item) => (
              <RiskCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className="pmi-grid pmi-grid-two">
          <Card className="pmi-panel">
            <div className="pmi-panel-head">
              <div>
                <div className="pmi-kicker">
                  <FileText size={14} />
                  Board memo
                </div>

                <h3 className="pmi-panel-title">Board Integration Memo</h3>

                <p className="muted pmi-panel-copy">
                  Resumen board-ready para comité con sinergias, riesgos,
                  owners, costes y decisiones que requieren revisión humana.
                </p>
              </div>

              <div className="pmi-panel-icon">
                <FileText size={18} />
              </div>
            </div>

            <div>
              <MiniRow label="Memo status" value="Draft-ready" />
              <MiniRow label="Inputs" value="Workstreams + risks + synergies" />
              <MiniRow label="Executive action" value="Prepare board-ready export" />
            </div>
          </Card>

          <Card className="pmi-panel">
            <div className="pmi-panel-head">
              <div>
                <div className="pmi-kicker">
                  <ArrowRight size={14} />
                  Connected OS
                </div>

                <h3 className="pmi-panel-title">Connected to M&A thesis</h3>

                <p className="muted pmi-panel-copy">
                  PMI cierra el ciclo: M&A analiza la operación; PMI controla
                  si la tesis se convierte en valor real post-cierre.
                </p>
              </div>

              <div className="pmi-panel-icon">
                <Users size={18} />
              </div>
            </div>

            <div className="pmi-link-row">
              <Link className="pmi-link" to="/dashboard">
                Back to Executive Overview
                <ArrowRight size={14} />
              </Link>

              <Link className="pmi-link" to="/ma/dashboard">
                Open M&A
                <ArrowRight size={14} />
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}




