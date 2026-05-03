import React from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  Gauge,
  Globe2,
  Layers3,
  ShieldAlert,
  ShieldCheck,
  Users
} from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { useComplianceStore } from '../store/complianceStore.js';
import { useComplianceEngine } from '../engine/useComplianceEngine.js';

const complianceDashboardCss = `
  .compliance-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 38px;
  }

  .compliance-hero {
    position: relative;
    overflow: hidden;
    min-height: 520px;
    border-radius: 38px;
    padding: 44px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      radial-gradient(circle at 8% 2%, rgba(37, 99, 235, 0.36), transparent 30%),
      radial-gradient(circle at 88% 8%, rgba(16, 185, 129, 0.18), transparent 27%),
      radial-gradient(circle at 60% 110%, rgba(245, 158, 11, 0.10), transparent 30%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.99), rgba(15, 23, 42, 0.97));
    box-shadow:
      0 38px 120px rgba(0, 0, 0, 0.42),
      inset 0 1px 0 rgba(255, 255, 255, 0.055);
  }

  .compliance-hero::before {
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

  .compliance-hero::after {
    content: "";
    position: absolute;
    inset: auto -190px -210px auto;
    width: 520px;
    height: 520px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.13), transparent 70%);
    pointer-events: none;
  }

  .compliance-hero-layout {
    position: relative;
    z-index: 1;
    min-height: 430px;
    display: grid;
    grid-template-columns: minmax(0, 1.08fr) minmax(390px, 0.92fr);
    gap: 38px;
    align-items: center;
  }

  .compliance-hero-main {
    min-width: 0;
  }

  .compliance-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 26px;
  }

  .compliance-title {
    margin: 0;
    max-width: 980px;
    font-size: clamp(40px, 4.6vw, 66px);
    line-height: 0.94;
    letter-spacing: -0.072em;
  }

  .compliance-title span {
    display: block;
    margin-top: 9px;
    color: rgba(226, 232, 240, 0.7);
  }

  .compliance-copy {
    max-width: 850px;
    margin: 28px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .compliance-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .compliance-command-item {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.078);
    min-width: 0;
  }

  .compliance-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .compliance-signal-card {
    position: relative;
    width: 100%;
    max-width: 460px;
    justify-self: end;
    align-self: center;
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
  }

  .compliance-signal-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: radial-gradient(circle at 18% 0%, rgba(96, 165, 250, 0.13), transparent 35%);
    pointer-events: none;
  }

  .compliance-signal-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-width: 0;
  }

  .compliance-signal-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .compliance-icon-box,
  .compliance-card-icon,
  .compliance-panel-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .compliance-icon-box {
    width: 50px;
    height: 50px;
  }

  .compliance-card-icon,
  .compliance-panel-icon {
    width: 46px;
    height: 46px;
  }

  .compliance-signal-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.16;
    letter-spacing: -0.04em;
  }

  .compliance-score-module {
    display: grid;
    grid-template-columns: 104px minmax(0, 1fr);
    gap: 18px;
    align-items: center;
    padding: 18px;
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.047);
    border: 1px solid rgba(255, 255, 255, 0.085);
  }

  .compliance-score-ring {
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

  .compliance-score-core {
    width: 72px;
    height: 72px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.97);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .compliance-score-core strong {
    font-size: 23px;
    letter-spacing: -0.055em;
  }

  .compliance-score-core strong.is-empty-score {
    font-size: 30px;
    color: rgba(226, 232, 240, 0.72);
  }

  .compliance-score-copy strong {
    display: block;
    margin-bottom: 8px;
  }

  .compliance-score-copy p {
    margin: 0;
    line-height: 1.58;
  }

  .compliance-signal-table {
    display: grid;
    gap: 0;
  }

  .compliance-signal-row {
    display: grid;
    grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
    gap: 14px;
    align-items: center;
    padding: 12px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }

  .compliance-signal-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .compliance-section {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .compliance-section-header {
    display: flex;
    justify-content: space-between;
    gap: 28px;
    align-items: flex-end;
  }

  .compliance-kicker {
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

  .compliance-section-header h2,
  .compliance-section-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .compliance-section-header p {
    max-width: 820px;
    margin: 11px 0 0;
    line-height: 1.68;
  }

  .compliance-grid {
    display: grid;
    gap: 26px;
    align-items: stretch;
  }

  .compliance-grid-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .compliance-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .compliance-kpi-card,
  .compliance-panel,
  .compliance-list-card,
  .compliance-bridge-panel {
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

  .compliance-kpi-card {
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

  .compliance-kpi-card:hover {
    transform: translateY(-3px);
    border-color: rgba(96, 165, 250, 0.25);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .compliance-kpi-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .compliance-kpi-value {
    margin-top: 12px;
    font-size: 25px;
    font-weight: 790;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .compliance-kpi-card p {
    margin: 0;
    line-height: 1.56;
  }

  .compliance-bridge-panel {
    position: relative;
    overflow: hidden;
    padding: 28px;
    background:
      radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.16), transparent 32%),
      linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02)),
      rgba(15, 23, 42, 0.64);
  }

  .compliance-bridge-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-top: 22px;
  }

  .compliance-bridge-step {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.075);
  }

  .compliance-bridge-step strong {
    display: block;
    margin-top: 8px;
  }

  .compliance-panel {
    padding: 31px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .compliance-panel-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .compliance-panel-title {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .compliance-panel-description {
    margin: 11px 0 0;
    line-height: 1.66;
  }

  .compliance-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .compliance-list-card {
    padding: 22px;
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .compliance-list-card:hover {
    transform: translateY(-2px);
    border-color: rgba(96, 165, 250, 0.24);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .compliance-list-card-head {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .compliance-list-card-title {
    margin: 0;
    letter-spacing: -0.035em;
  }

  .compliance-list-card p {
    line-height: 1.6;
  }

  .compliance-risk-score {
    text-align: right;
    min-width: 86px;
  }

  .compliance-risk-score strong {
    display: block;
    font-size: 24px;
    line-height: 1;
    letter-spacing: -0.045em;
  }

  .compliance-alert-body {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid rgba(148, 163, 184, 0.12);
  }

  .compliance-empty {
    border-radius: 25px;
    padding: 28px;
    border: 1px dashed rgba(148, 163, 184, 0.24);
    background: rgba(255,255,255,0.025);
    text-align: center;
  }

  .compliance-empty-icon {
    width: 54px;
    height: 54px;
    margin: 0 auto 16px;
    border-radius: 20px;
    display: grid;
    place-items: center;
    background: rgba(37, 99, 235, 0.14);
    border: 1px solid rgba(96, 165, 250, 0.22);
  }

  .compliance-empty h3 {
    margin: 0;
    letter-spacing: -0.04em;
  }

  .compliance-empty p {
    max-width: 520px;
    margin: 10px auto 0;
    line-height: 1.65;
  }

  .compliance-muted-tight {
    margin-bottom: 0;
  }

  @media (max-width: 1180px) {
    .compliance-hero {
      min-height: auto;
      padding: 34px;
    }

    .compliance-hero-layout {
      min-height: auto;
      grid-template-columns: 1fr;
      align-items: stretch;
    }

    .compliance-signal-card {
      max-width: none;
      justify-self: stretch;
    }

    .compliance-grid-kpis,
    .compliance-bridge-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 920px) {
    .compliance-grid-two,
    .compliance-command-bar {
      grid-template-columns: 1fr;
    }

    .compliance-section-header {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (max-width: 680px) {
    .compliance-page {
      gap: 28px;
    }

    .compliance-hero {
      padding: 26px;
      border-radius: 28px;
    }

    .compliance-title {
      font-size: clamp(36px, 12vw, 48px);
      line-height: 0.96;
    }

    .compliance-grid-kpis,
    .compliance-bridge-grid {
      grid-template-columns: 1fr;
    }

    .compliance-kpi-card,
    .compliance-panel,
    .compliance-list-card,
    .compliance-bridge-panel {
      border-radius: 24px;
    }

    .compliance-score-module {
      grid-template-columns: 1fr;
    }

    .compliance-score-ring {
      width: 104px;
      height: 104px;
    }

    .compliance-score-core {
      width: 78px;
      height: 78px;
    }

    .compliance-signal-row,
    .compliance-list-card-head {
      grid-template-columns: 1fr;
      gap: 7px;
    }

    .compliance-list-card-head {
      flex-direction: column;
    }

    .compliance-signal-row strong,
    .compliance-risk-score {
      text-align: left;
    }
  }
`;

function getDashboardValue(cards, index, fallback) {
  return cards?.[index]?.value ?? fallback;
}

function parseScore(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.min(100, Math.round(value)));
  }

  const match = String(value ?? '').match(/-?\d+(\.\d+)?/);
  const parsed = match ? Number(match[0]) : NaN;

  if (!Number.isFinite(parsed)) return null;

  return Math.max(0, Math.min(100, Math.round(parsed)));
}

function getComplianceSignal({ suppliers, riskScore, openAlerts, evidenceCoverage }) {
  if (suppliers.length === 0) {
    return {
      score: null,
      title: 'Compliance workspace pending',
      posture: 'Build supplier base',
      description:
        'Añade proveedores, evidencias y revisiones para activar una lectura ejecutiva de riesgo de cadena de suministro.'
    };
  }

  if (openAlerts > 0 && riskScore >= 70) {
    return {
      score: Math.max(20, 100 - riskScore),
      title: 'High-risk compliance exposure',
      posture: 'Prioritize remediation',
      description:
        'Hay señales relevantes de riesgo y alertas abiertas. Conviene priorizar revisión humana, evidencias y plan de mitigación.'
    };
  }

  if (riskScore >= 55 || openAlerts > 0) {
    return {
      score: Math.max(35, 100 - riskScore),
      title: 'Active compliance monitoring',
      posture: 'Review open items',
      description:
        'El sistema detecta riesgos o alertas que requieren seguimiento para mantener control documental y operativo.'
    };
  }

  if (evidenceCoverage >= 75) {
    return {
      score: Math.min(95, 82 + Math.round(evidenceCoverage / 10)),
      title: 'Controlled compliance posture',
      posture: 'Maintain controls',
      description:
        'La base documental y el seguimiento de proveedores ofrecen una lectura razonablemente controlada.'
    };
  }

  return {
    score: Math.max(55, Math.min(78, 100 - riskScore)),
    title: 'Compliance baseline established',
    posture: 'Improve evidence',
    description:
      'Existe una base de proveedores, pero conviene reforzar cobertura documental y revisiones periódicas.'
  };
}

function getOpenAlertsCount(alerts) {
  if (!Array.isArray(alerts)) return 0;

  return alerts.filter((alert) => {
    const status = String(alert?.status || '').toLowerCase();

    return !status || status.includes('open') || status.includes('review');
  }).length;
}

function getEvidenceCoverage(value) {
  const parsed = parseScore(value);

  return parsed ?? 0;
}

function CommandItem({ label, value }) {
  return (
    <div className="compliance-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SignalRow({ label, value }) {
  return (
    <div className="compliance-signal-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SectionHeader({ kicker, icon: Icon, title, description }) {
  return (
    <div className="compliance-section-header">
      <div>
        <div className="compliance-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h2>{title}</h2>

        <p className="muted">{description}</p>
      </div>
    </div>
  );
}

function DashboardMetric({ icon: Icon, label, value, helper }) {
  return (
    <article className="compliance-kpi-card">
      <div className="compliance-kpi-top">
        <div>
          <div className="kpi-label">{label}</div>
          <div className="compliance-kpi-value">{value}</div>
        </div>

        <div className="compliance-card-icon">
          <Icon size={18} />
        </div>
      </div>

      <p className="muted">{helper}</p>
    </article>
  );
}

function BridgeStep({ number, title, text }) {
  return (
    <div className="compliance-bridge-step">
      <div className="kpi-label">{number}</div>

      <strong>{title}</strong>

      <p className="muted compliance-muted-tight" style={{ marginTop: 8 }}>
        {text}
      </p>
    </div>
  );
}

function PanelHeader({ kicker, icon: Icon, title, description }) {
  return (
    <div className="compliance-panel-header">
      <div>
        <div className="compliance-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h3 className="compliance-panel-title">{title}</h3>

        <p className="muted compliance-panel-description">{description}</p>
      </div>

      <div className="compliance-panel-icon">
        <Icon size={18} />
      </div>
    </div>
  );
}

function EmptyBlock({ icon: Icon, title, description }) {
  return (
    <div className="compliance-empty">
      <div className="compliance-empty-icon">
        <Icon size={22} />
      </div>

      <h3>{title}</h3>

      <p className="muted">{description}</p>
    </div>
  );
}

function SupplierRiskCard({ supplier }) {
  const riskColor = supplier?.riskLevel?.color || '';
  const riskLabel = supplier?.riskLevel?.label || 'Sin clasificar';
  const riskScore = supplier?.riskScore ?? 'N/A';

  return (
    <article className="compliance-list-card">
      <div className="compliance-list-card-head">
        <div>
          <h3 className="compliance-list-card-title">{supplier.name}</h3>

          <p className="muted compliance-muted-tight" style={{ marginTop: 8 }}>
            {supplier.country || 'País N/A'} · {supplier.tier || 'Tier N/A'} ·{' '}
            {supplier.criticality || 'Criticality N/A'}
          </p>
        </div>

        <div className="compliance-risk-score">
          <strong className={riskColor}>{riskScore}/100</strong>
          <div className="kpi-label">{riskLabel}</div>
        </div>
      </div>
    </article>
  );
}

function AlertCard({ alert }) {
  return (
    <article className="compliance-list-card">
      <div className="compliance-list-card-head">
        <div>
          <h3 className="compliance-list-card-title">{alert.title}</h3>

          <p className="muted compliance-muted-tight" style={{ marginTop: 8 }}>
            {alert.category || 'Categoría N/A'} · {alert.source || 'Fuente N/A'}
          </p>
        </div>

        <Badge>{alert.severity || 'N/A'}</Badge>
      </div>

      <div className="compliance-alert-body">
        <p className="muted compliance-muted-tight">
          {alert.description || 'Sin descripción registrada.'}
        </p>
      </div>
    </article>
  );
}

export function ComplianceDashboardPage() {
  const {
    suppliers,
    alerts,
    evidenceItems,
    reviews,
    activeSupplierId
  } = useComplianceStore();

  const safeSuppliers = Array.isArray(suppliers) ? suppliers : [];
  const safeAlerts = Array.isArray(alerts) ? alerts : [];
  const safeEvidenceItems = Array.isArray(evidenceItems) ? evidenceItems : [];
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  const engine = useComplianceEngine({
    suppliers: safeSuppliers,
    alerts: safeAlerts,
    evidenceItems: safeEvidenceItems,
    reviews: safeReviews,
    activeSupplierId
  });

  const dashboardCards = Array.isArray(engine.dashboardCards)
    ? engine.dashboardCards
    : [];

  const supplierCount = getDashboardValue(
    dashboardCards,
    0,
    safeSuppliers.length
  );
  const riskValue = getDashboardValue(dashboardCards, 1, '0/100');
  const openAlerts = getOpenAlertsCount(safeAlerts);
  const alertValue = getDashboardValue(dashboardCards, 2, openAlerts);
  const evidenceValue = getDashboardValue(dashboardCards, 3, '0%');

  const riskScore = parseScore(riskValue) ?? 0;
  const evidenceCoverage = getEvidenceCoverage(evidenceValue);

  const complianceSignal = getComplianceSignal({
    suppliers: safeSuppliers,
    riskScore,
    openAlerts,
    evidenceCoverage
  });

  const scoreAngle = `${(complianceSignal.score ?? 0) * 3.6}deg`;

  const topRiskSuppliers = Array.isArray(engine.topRiskSuppliers)
    ? engine.topRiskSuppliers
    : [];
  const latestAlerts = Array.isArray(engine.latestAlerts)
    ? engine.latestAlerts
    : [];

  return (
    <div className="page">
      <style>{complianceDashboardCss}</style>

      <div className="compliance-page">
        <section className="compliance-hero">
          <div className="compliance-hero-layout">
            <div className="compliance-hero-main">
              <div className="compliance-badge-row">
                <Badge>Compliance & Risk</Badge>
                <Badge>Supply Chain Intelligence</Badge>
                <Badge>Private Workspace</Badge>
              </div>

              <h1 className="compliance-title">
                Supply Chain Compliance.
                <span>Control risk before it becomes exposure.</span>
              </h1>

              <p className="compliance-copy">
                Vista ejecutiva de proveedores, alertas, evidencias, revisiones
                humanas y riesgo agregado para mantener control documental y
                operativo sobre la cadena de suministro.
              </p>

              <div className="compliance-command-bar">
                <CommandItem
                  label="Suppliers"
                  value={supplierCount}
                />

                <CommandItem
                  label="Open alerts"
                  value={alertValue}
                />

                <CommandItem
                  label="Compliance posture"
                  value={complianceSignal.posture}
                />
              </div>
            </div>

            <aside className="compliance-signal-card">
              <div className="compliance-signal-inner">
                <div className="compliance-signal-top">
                  <div>
                    <div className="kpi-label">Compliance Signal</div>
                    <div className="compliance-signal-title">
                      {complianceSignal.title}
                    </div>
                  </div>

                  <div className="compliance-icon-box">
                    <ShieldCheck size={21} />
                  </div>
                </div>

                <div className="compliance-score-module">
                  <div
                    className="compliance-score-ring"
                    style={{ '--score-angle': scoreAngle }}
                  >
                    <div className="compliance-score-core">
                      <strong className={complianceSignal.score === null ? 'is-empty-score' : ''}>
                        {complianceSignal.score === null ? '—' : complianceSignal.score}
                      </strong>
                    </div>
                  </div>

                  <div className="compliance-score-copy">
                    <strong>{complianceSignal.posture}</strong>

                    <p className="muted">
                      {complianceSignal.description}
                    </p>
                  </div>
                </div>

                <div className="compliance-signal-table">
                  <SignalRow label="Suppliers" value={supplierCount} />
                  <SignalRow label="Average risk" value={riskValue} />
                  <SignalRow label="Evidence coverage" value={evidenceValue} />
                  <SignalRow label="Human reviews" value={safeReviews.length} />
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="compliance-section">
          <SectionHeader
            kicker="Executive overview"
            icon={Activity}
            title="Compliance dashboard at a glance"
            description="Resumen de proveedores monitorizados, riesgo agregado, alertas abiertas y cobertura documental."
          />

          <div className="compliance-grid compliance-grid-kpis">
            <DashboardMetric
              icon={Users}
              label="Proveedores"
              value={supplierCount}
              helper="Total monitorizado"
            />

            <DashboardMetric
              icon={ShieldCheck}
              label="Riesgo medio"
              value={riskValue}
              helper="Score agregado"
            />

            <DashboardMetric
              icon={AlertTriangle}
              label="Alertas abiertas"
              value={alertValue}
              helper="Open + in review"
            />

            <DashboardMetric
              icon={FileSearch}
              label="Evidencia"
              value={evidenceValue}
              helper="Cobertura documental"
            />
          </div>
        </section>

        <section className="compliance-bridge-panel">
          <SectionHeader
            kicker="Control loop"
            icon={ClipboardCheck}
            title="Monitor, evidence, review and remediate"
            description="CEO’s OS organiza el control de compliance en una secuencia clara para detectar riesgo, documentar evidencias y activar revisión humana."
          />

          <div className="compliance-bridge-grid">
            <BridgeStep
              number="01"
              title="Monitor"
              text="Centraliza proveedores, criticidad, país, tier y señales principales."
            />

            <BridgeStep
              number="02"
              title="Detect"
              text="Convierte alertas y scoring en una lectura ejecutiva accionable."
            />

            <BridgeStep
              number="03"
              title="Evidence"
              text="Ordena documentos, cobertura y pruebas de cumplimiento."
            />

            <BridgeStep
              number="04"
              title="Review"
              text="Activa revisión humana para cerrar riesgos y mantener trazabilidad."
            />
          </div>
        </section>

        <section className="compliance-grid compliance-grid-two">
          <Card className="compliance-panel">
            <PanelHeader
              kicker="Risk ranking"
              icon={Gauge}
              title="Top proveedores por riesgo"
              description="Proveedores priorizados por exposición, criticidad y score agregado."
            />

            <div className="compliance-list">
              {topRiskSuppliers.length === 0 ? (
                <EmptyBlock
                  icon={Globe2}
                  title="No hay proveedores registrados"
                  description="Añade proveedores para generar ranking de riesgo y priorización ejecutiva."
                />
              ) : (
                topRiskSuppliers.map((supplier) => (
                  <SupplierRiskCard key={supplier.id} supplier={supplier} />
                ))
              )}
            </div>
          </Card>

          <Card className="compliance-panel">
            <PanelHeader
              kicker="Alert stream"
              icon={ShieldAlert}
              title="Últimas alertas"
              description="Alertas recientes para revisión, mitigación o seguimiento documental."
            />

            <div className="compliance-list">
              {latestAlerts.length === 0 ? (
                <EmptyBlock
                  icon={CheckCircle2}
                  title="No hay alertas registradas"
                  description="Cuando existan alertas, aparecerán aquí ordenadas para revisión ejecutiva."
                />
              ) : (
                latestAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))
              )}
            </div>
          </Card>
        </section>

        <section className="compliance-section">
          <SectionHeader
            kicker="Operating readiness"
            icon={Layers3}
            title="Compliance operating base"
            description="Base inicial para evolucionar hacia workflows, reporting, agentes IA y trazabilidad avanzada."
          />

          <div className="compliance-grid compliance-grid-kpis">
            <DashboardMetric
              icon={FileSearch}
              label="Evidencias"
              value={safeEvidenceItems.length}
              helper="Documentos y pruebas registradas"
            />

            <DashboardMetric
              icon={ClipboardCheck}
              label="Revisiones"
              value={safeReviews.length}
              helper="Controles humanos registrados"
            />

            <DashboardMetric
              icon={AlertTriangle}
              label="Alertas totales"
              value={safeAlerts.length}
              helper="Histórico de señales"
            />

            <DashboardMetric
              icon={ShieldCheck}
              label="Estado"
              value={complianceSignal.posture}
              helper="Postura ejecutiva actual"
            />
          </div>
        </section>
      </div>
    </div>
  );
}