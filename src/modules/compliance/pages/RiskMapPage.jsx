import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Compass,
  Eye,
  Globe2,
  Layers3,
  Map,
  MapPinned,
  Radar,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  WalletCards
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { EmptyState } from '../../../shared/components/ui/EmptyState.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Select } from '../../../shared/components/ui/Select.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { useComplianceStore } from '../store/complianceStore.js';
import { useComplianceEngine } from '../engine/useComplianceEngine.js';

const riskMapCss = `
  .risk-map-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 38px;
  }

  .risk-map-hero {
    position: relative;
    overflow: hidden;
    border-radius: 38px;
    padding: 38px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      radial-gradient(circle at 8% 2%, rgba(37, 99, 235, 0.36), transparent 30%),
      radial-gradient(circle at 88% 8%, rgba(16, 185, 129, 0.18), transparent 27%),
      radial-gradient(circle at 60% 110%, rgba(245, 158, 11, 0.12), transparent 30%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.99), rgba(15, 23, 42, 0.97));
    box-shadow:
      0 38px 120px rgba(0, 0, 0, 0.42),
      inset 0 1px 0 rgba(255, 255, 255, 0.055);
  }

  .risk-map-hero::before {
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

  .risk-map-hero::after {
    content: "";
    position: absolute;
    inset: auto -190px -210px auto;
    width: 520px;
    height: 520px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.13), transparent 70%);
    pointer-events: none;
  }

  .risk-map-hero-layout {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.42fr) minmax(380px, 0.58fr);
    gap: 36px;
    align-items: stretch;
  }

  .risk-map-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 26px;
  }

  .risk-map-title {
    margin: 0;
    max-width: 950px;
    font-size: clamp(42px, 5vw, 72px);
    line-height: 0.92;
    letter-spacing: -0.075em;
  }

  .risk-map-title span {
    display: block;
    margin-top: 8px;
    color: rgba(226, 232, 240, 0.7);
  }

  .risk-map-copy {
    max-width: 860px;
    margin: 26px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .risk-map-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .risk-map-command-item {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.078);
    min-width: 0;
  }

  .risk-map-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .risk-map-signal-card {
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

  .risk-map-signal-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: radial-gradient(circle at 18% 0%, rgba(96, 165, 250, 0.13), transparent 35%);
    pointer-events: none;
  }

  .risk-map-signal-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .risk-map-signal-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .risk-map-icon-box,
  .risk-map-card-icon,
  .risk-map-panel-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .risk-map-icon-box {
    width: 50px;
    height: 50px;
  }

  .risk-map-card-icon,
  .risk-map-panel-icon {
    width: 46px;
    height: 46px;
  }

  .risk-map-signal-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.16;
    letter-spacing: -0.04em;
  }

  .risk-map-score-module {
    display: grid;
    grid-template-columns: 122px minmax(0, 1fr);
    gap: 22px;
    align-items: center;
    padding: 20px;
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.047);
    border: 1px solid rgba(255, 255, 255, 0.085);
  }

  .risk-map-score-ring {
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

  .risk-map-score-core {
    width: 84px;
    height: 84px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.97);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .risk-map-score-core strong {
    font-size: 25px;
    letter-spacing: -0.055em;
  }

  .risk-map-score-core strong.is-empty-score {
    font-size: 30px;
    color: rgba(226, 232, 240, 0.72);
  }

  .risk-map-score-copy strong {
    display: block;
    margin-bottom: 8px;
  }

  .risk-map-score-copy p {
    margin: 0;
    line-height: 1.62;
  }

  .risk-map-signal-table {
    display: grid;
    gap: 0;
  }

  .risk-map-signal-row {
    display: grid;
    grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
    gap: 14px;
    align-items: center;
    padding: 15px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }

  .risk-map-signal-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .risk-map-section {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .risk-map-section-header {
    display: flex;
    justify-content: space-between;
    gap: 28px;
    align-items: flex-end;
  }

  .risk-map-kicker {
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

  .risk-map-section-header h2,
  .risk-map-section-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .risk-map-section-header p {
    max-width: 820px;
    margin: 11px 0 0;
    line-height: 1.68;
  }

  .risk-map-grid {
    display: grid;
    gap: 26px;
    align-items: stretch;
  }

  .risk-map-grid-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .risk-map-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .risk-map-kpi-card,
  .risk-map-panel,
  .risk-map-list-card,
  .risk-map-region-card {
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

  .risk-map-kpi-card {
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

  .risk-map-kpi-card:hover,
  .risk-map-region-card:hover,
  .risk-map-list-card:hover {
    transform: translateY(-3px);
    border-color: rgba(96, 165, 250, 0.25);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .risk-map-kpi-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .risk-map-kpi-value {
    margin-top: 12px;
    font-size: 25px;
    font-weight: 790;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .risk-map-kpi-card p {
    margin: 0;
    line-height: 1.56;
  }

  .risk-map-panel {
    padding: 31px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .risk-map-panel-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .risk-map-panel-title {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .risk-map-panel-description {
    margin: 11px 0 0;
    line-height: 1.66;
  }

  .risk-map-filter-stack,
  .risk-map-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .risk-map-glass-block {
    padding: 20px;
    border-radius: 24px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.075);
  }

  .risk-map-glass-block p {
    line-height: 1.62;
  }

  .risk-map-mini-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .risk-map-mini-metric {
    min-height: 120px;
    padding: 18px;
    border-radius: 22px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.075);
  }

  .risk-map-mini-metric strong {
    display: block;
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .risk-map-region-card {
    padding: 26px;
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .risk-map-region-card.is-selected {
    border-color: rgba(16, 185, 129, 0.32);
    background:
      radial-gradient(circle at 100% 0%, rgba(16,185,129,0.12), transparent 30%),
      linear-gradient(135deg, rgba(255,255,255,0.074), rgba(255,255,255,0.028)),
      rgba(15, 23, 42, 0.76);
  }

  .risk-map-region-head,
  .risk-map-list-card-head {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .risk-map-region-title,
  .risk-map-list-card-title {
    margin: 0;
    letter-spacing: -0.04em;
  }

  .risk-map-region-meta,
  .risk-map-list-meta {
    margin: 9px 0 0;
    line-height: 1.58;
  }

  .risk-map-region-score,
  .risk-map-supplier-score {
    min-width: 124px;
    text-align: right;
  }

  .risk-map-region-score strong,
  .risk-map-supplier-score strong {
    display: block;
    font-size: 25px;
    line-height: 1;
    letter-spacing: -0.045em;
  }

  .risk-map-region-metrics {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-top: 22px;
  }

  .risk-map-region-metric {
    padding: 16px;
    border-radius: 20px;
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.07);
  }

  .risk-map-region-metric strong {
    display: block;
    margin-top: 8px;
    font-size: 20px;
    letter-spacing: -0.04em;
  }

  .risk-map-chip-row,
  .risk-map-card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 18px;
  }

  .risk-map-list-card {
    padding: 24px;
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .risk-map-alert-description {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(148, 163, 184, 0.12);
    line-height: 1.62;
  }

  .risk-map-empty-wrap {
    border-radius: 26px;
    padding: 34px;
    border: 1px dashed rgba(148, 163, 184, 0.24);
    background: rgba(255,255,255,0.025);
  }

  .risk-map-muted-tight {
    margin-bottom: 0;
  }

  @media (max-width: 1180px) {
    .risk-map-hero-layout,
    .risk-map-grid-two {
      grid-template-columns: 1fr;
    }

    .risk-map-grid-kpis,
    .risk-map-region-metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 920px) {
    .risk-map-command-bar {
      grid-template-columns: 1fr;
    }

    .risk-map-section-header,
    .risk-map-region-head,
    .risk-map-list-card-head {
      align-items: flex-start;
      flex-direction: column;
    }

    .risk-map-region-score,
    .risk-map-supplier-score {
      text-align: left;
    }
  }

  @media (max-width: 680px) {
    .risk-map-page {
      gap: 28px;
    }

    .risk-map-hero {
      padding: 26px;
      border-radius: 28px;
    }

    .risk-map-grid-kpis,
    .risk-map-mini-grid,
    .risk-map-region-metrics {
      grid-template-columns: 1fr;
    }

    .risk-map-kpi-card,
    .risk-map-panel,
    .risk-map-list-card,
    .risk-map-region-card {
      border-radius: 24px;
    }

    .risk-map-score-module {
      grid-template-columns: 1fr;
    }

    .risk-map-signal-row {
      grid-template-columns: 1fr;
      gap: 7px;
    }

    .risk-map-signal-row strong {
      text-align: left;
    }
  }
`;

function getSafeArray(value) {
  return Array.isArray(value) ? value : [];
}

function getSafeNumber(value, fallback = 0) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return fallback;

  return parsed;
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function formatCurrency(value) {
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;

  return `${safeValue.toLocaleString('es-ES', {
    maximumFractionDigits: 0
  })} €`;
}

function formatDate(value) {
  if (!value) return 'Sin fecha';

  try {
    return new Date(value).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return 'Sin fecha';
  }
}

function getRegionLevel(avgRisk) {
  if (avgRisk >= 75) {
    return {
      label: 'Crítico',
      color: 'text-danger',
      description: 'Exposición alta. Requiere revisión prioritaria.'
    };
  }

  if (avgRisk >= 55) {
    return {
      label: 'Alto',
      color: 'text-warning',
      description: 'Riesgo relevante. Conviene reforzar seguimiento.'
    };
  }

  if (avgRisk >= 35) {
    return {
      label: 'Medio',
      color: 'text-info',
      description: 'Riesgo controlable con revisión periódica.'
    };
  }

  return {
    label: 'Bajo',
    color: 'text-success',
    description: 'Exposición limitada según señales actuales.'
  };
}

function getRiskMapSignal({ avgRisk, avgResilience, highRiskCount, severeAlerts, regionCount }) {
  if (regionCount === 0) {
    return {
      score: null,
      title: 'Risk map pending',
      posture: 'Build supplier base',
      description:
        'Crea proveedores con región, spend y scoring para construir el mapa de exposición.'
    };
  }

  const controlScore = clampScore(
    100 - avgRisk * 0.55 + avgResilience * 0.35 - Math.min(24, highRiskCount * 4) - Math.min(18, severeAlerts * 6)
  );

  if (avgRisk >= 70 || severeAlerts > 0) {
    return {
      score: controlScore,
      title: 'Geographic exposure detected',
      posture: 'Prioritize regions',
      description:
        'Existen regiones o alertas con exposición relevante. Prioriza proveedores críticos y evidencias por zona.'
    };
  }

  if (avgRisk >= 45 || highRiskCount > 0) {
    return {
      score: controlScore,
      title: 'Regional monitoring required',
      posture: 'Review concentration',
      description:
        'La cartera muestra zonas con riesgo medio. Conviene revisar concentración, spend expuesto y resiliencia.'
    };
  }

  return {
    score: controlScore,
    title: 'Controlled regional exposure',
    posture: 'Maintain monitoring',
    description:
      'La exposición regional parece controlada según el scoring actual, manteniendo seguimiento periódico.'
  };
}

function buildRegionStats({ suppliers = [], alerts = [] }) {
  const regions = {};

  suppliers.forEach((supplier) => {
    const region = supplier.region || 'Sin región';

    if (!regions[region]) {
      regions[region] = {
        region,
        suppliers: [],
        alerts: [],
        totalSpend: 0,
        avgRisk: 0,
        avgResilience: 0,
        highRiskSuppliers: 0,
        criticalSuppliers: 0
      };
    }

    regions[region].suppliers.push(supplier);
    regions[region].totalSpend += Number(supplier.spend || 0);
  });

  alerts.forEach((alert) => {
    const supplier = suppliers.find((item) => item.id === alert.supplierId);
    const region = supplier?.region || 'Sin región';

    if (!regions[region]) {
      regions[region] = {
        region,
        suppliers: [],
        alerts: [],
        totalSpend: 0,
        avgRisk: 0,
        avgResilience: 0,
        highRiskSuppliers: 0,
        criticalSuppliers: 0
      };
    }

    regions[region].alerts.push(alert);
  });

  return Object.values(regions)
    .map((item) => {
      const totalSuppliers = item.suppliers.length;

      const avgRisk =
        totalSuppliers > 0
          ? Math.round(
              item.suppliers.reduce(
                (sum, supplier) => sum + Number(supplier.riskScore || 0),
                0
              ) / totalSuppliers
            )
          : 0;

      const avgResilience =
        totalSuppliers > 0
          ? Math.round(
              item.suppliers.reduce(
                (sum, supplier) => sum + Number(supplier.resilienceScore || 0),
                0
              ) / totalSuppliers
            )
          : 0;

      const highRiskSuppliers = item.suppliers.filter(
        (supplier) => Number(supplier.riskScore || 0) >= 55
      ).length;

      const criticalSuppliers = item.suppliers.filter(
        (supplier) => Number(supplier.riskScore || 0) >= 75
      ).length;

      return {
        ...item,
        avgRisk,
        avgResilience,
        highRiskSuppliers,
        criticalSuppliers,
        level: getRegionLevel(avgRisk)
      };
    })
    .sort((a, b) => b.avgRisk - a.avgRisk);
}

function CommandItem({ label, value }) {
  return (
    <div className="risk-map-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SignalRow({ label, value }) {
  return (
    <div className="risk-map-signal-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SectionHeader({ kicker, icon: Icon, title, description, right }) {
  return (
    <div className="risk-map-section-header">
      <div>
        <div className="risk-map-kicker">
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
    <div className="risk-map-panel-header">
      <div>
        <div className="risk-map-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h3 className="risk-map-panel-title">{title}</h3>

        <p className="muted risk-map-panel-description">{description}</p>
      </div>

      <div className="risk-map-panel-icon">
        <Icon size={18} />
      </div>
    </div>
  );
}

function KpiCard({ label, value, description, icon: Icon, tone = '' }) {
  return (
    <article className="risk-map-kpi-card">
      <div className="risk-map-kpi-top">
        <div>
          <div className="kpi-label">{label}</div>

          <div className={`risk-map-kpi-value ${tone}`.trim()}>
            {value}
          </div>
        </div>

        <div className="risk-map-card-icon">
          <Icon size={18} />
        </div>
      </div>

      <p className="muted">{description}</p>
    </article>
  );
}

function MiniMetric({ label, value, tone = '' }) {
  return (
    <div className="risk-map-mini-metric">
      <div className="kpi-label">{label}</div>
      <strong className={tone}>{value}</strong>
    </div>
  );
}

function RegionMetric({ label, value, tone = '' }) {
  return (
    <div className="risk-map-region-metric">
      <div className="kpi-label">{label}</div>
      <strong className={tone}>{value}</strong>
    </div>
  );
}

function RegionCard({ region, isSelected, onSelect }) {
  return (
    <article className={`risk-map-region-card ${isSelected ? 'is-selected' : ''}`}>
      <div className="risk-map-region-head">
        <div>
          <h3 className="risk-map-region-title">{region.region}</h3>

          <p className="muted risk-map-region-meta">
            {region.suppliers.length} proveedores · {region.alerts.length}{' '}
            alertas · {formatCurrency(region.totalSpend)} expuesto
          </p>
        </div>

        <div className="risk-map-region-score">
          <strong className={region.level.color}>{region.avgRisk}/100</strong>
          <div className="kpi-label">Riesgo {region.level.label}</div>
        </div>
      </div>

      <div className="risk-map-region-metrics">
        <RegionMetric label="Resiliencia" value={`${region.avgResilience}/100`} />
        <RegionMetric
          label="Alto riesgo"
          value={region.highRiskSuppliers}
          tone={region.highRiskSuppliers > 0 ? 'text-warning' : ''}
        />
        <RegionMetric
          label="Críticos"
          value={region.criticalSuppliers}
          tone={region.criticalSuppliers > 0 ? 'text-danger' : ''}
        />
        <RegionMetric label="Alertas" value={region.alerts.length} />
      </div>

      <div className="risk-map-card-actions">
        <Button variant="secondary" onClick={() => onSelect(region.region)}>
          <Eye size={16} />
          Ver región
        </Button>

        <Badge>{region.level.label}</Badge>
      </div>
    </article>
  );
}

function SupplierCard({ supplier, onOpenSupplier }) {
  return (
    <article className="risk-map-list-card">
      <div className="risk-map-list-card-head">
        <div>
          <h3 className="risk-map-list-card-title">{supplier.name}</h3>

          <p className="muted risk-map-list-meta">
            {supplier.country || 'Sin país'} · {supplier.region || 'Sin región'} ·{' '}
            {supplier.tier || 'Tier N/A'}
          </p>
        </div>

        <div className="risk-map-supplier-score">
          <strong className={supplier.riskLevel?.color || ''}>
            {supplier.riskScore}/100
          </strong>

          <div className="kpi-label">
            {supplier.riskLevel?.label || 'Sin nivel'}
          </div>
        </div>
      </div>

      <div className="risk-map-chip-row">
        <Badge>{supplier.criticality || 'Media'}</Badge>
        <Badge>{supplier.status || 'active'}</Badge>
        <Badge>{formatCurrency(supplier.spend)}</Badge>
      </div>

      <div className="risk-map-card-actions">
        <Button
          variant="secondary"
          onClick={() => onOpenSupplier(supplier.id)}
        >
          <Eye size={16} />
          Ver proveedor
        </Button>
      </div>
    </article>
  );
}

function AlertCard({ alert, supplier }) {
  return (
    <article className="risk-map-list-card">
      <div className="risk-map-list-card-head">
        <div>
          <h3 className="risk-map-list-card-title">{alert.title}</h3>

          <p className="muted risk-map-list-meta">
            {supplier?.name || 'Proveedor no identificado'} ·{' '}
            {supplier?.region || 'Sin región'} · {formatDate(alert.createdAt)}
          </p>
        </div>

        <Badge>{alert.severity}</Badge>
      </div>

      <p className="muted risk-map-alert-description">
        {alert.description || 'Sin descripción registrada.'}
      </p>
    </article>
  );
}

export function RiskMapPage() {
  const navigate = useNavigate();

  const {
    suppliers,
    alerts,
    evidenceItems,
    reviews,
    activeSupplierId,
    setActiveSupplierId
  } = useComplianceStore();

  const safeSuppliers = getSafeArray(suppliers);
  const safeAlerts = getSafeArray(alerts);
  const safeEvidenceItems = getSafeArray(evidenceItems);
  const safeReviews = getSafeArray(reviews);

  const engine = useComplianceEngine({
    suppliers: safeSuppliers,
    alerts: safeAlerts,
    evidenceItems: safeEvidenceItems,
    reviews: safeReviews,
    activeSupplierId
  });

  const engineSuppliers = getSafeArray(engine.suppliers);

  const regionStats = useMemo(() => {
    return buildRegionStats({
      suppliers: engineSuppliers,
      alerts: safeAlerts
    });
  }, [engineSuppliers, safeAlerts]);

  const [selectedRegion, setSelectedRegion] = useState('all');

  const regionOptions = ['all', ...regionStats.map((item) => item.region)];

  const selectedRegionStats =
    selectedRegion === 'all'
      ? null
      : regionStats.find((item) => item.region === selectedRegion) || null;

  const visibleSuppliers = useMemo(() => {
    if (selectedRegion === 'all') {
      return engineSuppliers;
    }

    return engineSuppliers.filter(
      (supplier) => supplier.region === selectedRegion
    );
  }, [engineSuppliers, selectedRegion]);

  const visibleAlerts = useMemo(() => {
    if (selectedRegion === 'all') {
      return safeAlerts;
    }

    const supplierIds = new Set(visibleSuppliers.map((supplier) => supplier.id));

    return safeAlerts.filter((alert) => supplierIds.has(alert.supplierId));
  }, [safeAlerts, selectedRegion, visibleSuppliers]);

  const topRegionSuppliers = [...visibleSuppliers]
    .sort((a, b) => Number(b.riskScore || 0) - Number(a.riskScore || 0))
    .slice(0, 6);

  const highSeverityRegionAlerts = visibleAlerts.filter((alert) =>
    ['high', 'critical'].includes(String(alert.severity).toLowerCase())
  );

  const visibleSpend = visibleSuppliers.reduce(
    (sum, supplier) => sum + Number(supplier.spend || 0),
    0
  );

  const averageRiskScore = getSafeNumber(engine.portfolioRisk?.averageRiskScore);
  const averageResilienceScore = getSafeNumber(
    engine.portfolioResilience?.averageResilienceScore
  );
  const highRiskSuppliers = getSafeArray(engine.highRiskSuppliers);
  const highSeverityAlerts = getSafeArray(engine.highSeverityAlerts);

  const riskMapSignal = getRiskMapSignal({
    avgRisk: selectedRegionStats?.avgRisk ?? averageRiskScore,
    avgResilience: selectedRegionStats?.avgResilience ?? averageResilienceScore,
    highRiskCount: selectedRegionStats?.highRiskSuppliers ?? highRiskSuppliers.length,
    severeAlerts: highSeverityRegionAlerts.length,
    regionCount: regionStats.length
  });

  const scoreAngle = `${(riskMapSignal.score ?? 0) * 3.6}deg`;

  function handleOpenSupplier(supplierId) {
    setActiveSupplierId(supplierId);
    navigate(`/compliance/suppliers/${supplierId}`);
  }

  return (
    <div className="page">
      <style>{riskMapCss}</style>

      <div className="risk-map-page">
        <section className="risk-map-hero">
          <div className="risk-map-hero-layout">
            <div>
              <div className="risk-map-badge-row">
                <Badge>Compliance & Risk</Badge>
                <Badge>Supply Chain Risk Map</Badge>
                <Badge>{regionStats.length} regiones</Badge>
              </div>

              <h1 className="risk-map-title">
                Supply Chain Risk Map.
                <span>See exposure before it becomes disruption.</span>
              </h1>

              <p className="risk-map-copy">
                Mapa ejecutivo de exposición por región, proveedores críticos,
                alertas severas, spend expuesto y resiliencia de cartera para
                priorizar decisiones de compliance y continuidad operativa.
              </p>

              <div className="risk-map-command-bar">
                <CommandItem label="Regions" value={regionStats.length} />
                <CommandItem label="Selected view" value={selectedRegion === 'all' ? 'Global' : selectedRegion} />
                <CommandItem label="Risk posture" value={riskMapSignal.posture} />
              </div>
            </div>

            <aside className="risk-map-signal-card">
              <div className="risk-map-signal-inner">
                <div className="risk-map-signal-top">
                  <div>
                    <div className="kpi-label">Geographic Risk Signal</div>
                    <div className="risk-map-signal-title">
                      {riskMapSignal.title}
                    </div>
                  </div>

                  <div className="risk-map-icon-box">
                    <MapPinned size={21} />
                  </div>
                </div>

                <div className="risk-map-score-module">
                  <div
                    className="risk-map-score-ring"
                    style={{ '--score-angle': scoreAngle }}
                  >
                    <div className="risk-map-score-core">
                      <strong className={riskMapSignal.score === null ? 'is-empty-score' : ''}>
                        {riskMapSignal.score === null ? '—' : riskMapSignal.score}
                      </strong>
                    </div>
                  </div>

                  <div className="risk-map-score-copy">
                    <strong>{riskMapSignal.posture}</strong>

                    <p className="muted">{riskMapSignal.description}</p>
                  </div>
                </div>

                <div className="risk-map-signal-table">
                  <SignalRow label="Avg operational risk score" value={`${selectedRegionStats?.avgRisk ?? averageRiskScore}/100`} />
                  <SignalRow label="Avg resilience" value={`${selectedRegionStats?.avgResilience ?? averageResilienceScore}/100`} />
                  <SignalRow label="Severe alerts" value={highSeverityRegionAlerts.length} />
                  <SignalRow label="Exposed spend" value={formatCurrency(visibleSpend)} />
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="risk-map-section">
          <SectionHeader
            kicker="Portfolio overview"
            icon={Activity}
            title="Regional exposure at a glance"
            description="Resumen ejecutivo de riesgo medio, resiliencia, proveedores críticos y alertas severas."
          />

          <div className="risk-map-grid risk-map-grid-kpis">
            <KpiCard
              label="Riesgo operativo medio"
              value={`${averageRiskScore}/100`}
              description="Operational risk score — portfolio average"
              icon={ShieldAlert}
            />

            <KpiCard
              label="Resiliencia media"
              value={`${averageResilienceScore}/100`}
              description="Capacidad de continuidad"
              icon={ShieldCheck}
            />

            <KpiCard
              label="Proveedores alto riesgo"
              value={highRiskSuppliers.length}
              description="Score superior a 55"
              icon={AlertTriangle}
              tone={highRiskSuppliers.length > 0 ? 'text-danger' : ''}
            />

            <KpiCard
              label="Alertas severas"
              value={highSeverityAlerts.length}
              description="High + critical"
              icon={Radar}
              tone={highSeverityAlerts.length > 0 ? 'text-warning' : ''}
            />
          </div>
        </section>

        <section className="risk-map-grid risk-map-grid-two">
          <Card className="risk-map-panel">
            <PanelHeader
              kicker="Regional exposure"
              icon={Globe2}
              title="Regional Exposure"
              description="Filtra la cartera por región para ver exposición, spend, alertas y proveedores críticos."
            />

            <div className="risk-map-filter-stack">
              <Select
                label="Región"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                options={regionOptions}
              />

              <div className="risk-map-glass-block">
                <div className="row">
                  <Compass size={18} />

                  <div>
                    <strong>
                      {selectedRegion === 'all'
                        ? 'Vista global de cartera'
                        : `Región: ${selectedRegion}`}
                    </strong>

                    <p className="muted risk-map-muted-tight" style={{ marginTop: 8 }}>
                      {selectedRegionStats
                        ? selectedRegionStats.level.description
                        : 'Visión agregada de todas las regiones monitorizadas.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="risk-map-panel">
            <PanelHeader
              kicker="Selected exposure"
              icon={TrendingUp}
              title="Selected Exposure"
              description="Métricas de la vista regional seleccionada."
            />

            <div className="risk-map-mini-grid">
              <MiniMetric label="Proveedores" value={visibleSuppliers.length} />
              <MiniMetric label="Alertas" value={visibleAlerts.length} />
              <MiniMetric
                label="Alertas severas"
                value={highSeverityRegionAlerts.length}
                tone={highSeverityRegionAlerts.length > 0 ? 'text-warning' : ''}
              />
              <MiniMetric label="Spend expuesto" value={formatCurrency(visibleSpend)} />
            </div>
          </Card>
        </section>

        <section className="risk-map-section">
          <SectionHeader
            kicker="Risk distribution"
            icon={Map}
            title="Regional risk distribution"
            description="Ranking regional por exposición, riesgo medio, resiliencia, spend y alertas asociadas."
            right={<Badge>{regionStats.length} regiones</Badge>}
          />

          <Card className="risk-map-panel">
            {regionStats.length === 0 ? (
              <div className="risk-map-empty-wrap">
                <EmptyState
                  title="No hay regiones"
                  description="Crea proveedores para construir el mapa de riesgo."
                />
              </div>
            ) : (
              <div className="risk-map-list">
                {regionStats.map((region) => (
                  <RegionCard
                    key={region.region}
                    region={region}
                    isSelected={selectedRegion === region.region}
                    onSelect={setSelectedRegion}
                  />
                ))}
              </div>
            )}
          </Card>
        </section>

        <section className="risk-map-grid risk-map-grid-two">
          <Card className="risk-map-panel">
            <PanelHeader
              kicker="Critical suppliers"
              icon={ShieldAlert}
              title="Critical Suppliers"
              description="Proveedores de mayor riesgo según la región seleccionada."
            />

            {topRegionSuppliers.length === 0 ? (
              <div className="risk-map-empty-wrap">
                <EmptyState
                  title="No hay proveedores"
                  description="No hay proveedores para la región seleccionada."
                />
              </div>
            ) : (
              <div className="risk-map-list">
                {topRegionSuppliers.map((supplier) => (
                  <SupplierCard
                    key={supplier.id}
                    supplier={supplier}
                    onOpenSupplier={handleOpenSupplier}
                  />
                ))}
              </div>
            )}
          </Card>

          <Card className="risk-map-panel">
            <PanelHeader
              kicker="Geographic alerts"
              icon={AlertTriangle}
              title="Geographic Risk Alerts"
              description="Alertas high / critical de la región seleccionada."
            />

            {highSeverityRegionAlerts.length === 0 ? (
              <div className="risk-map-empty-wrap">
                <EmptyState
                  title="Sin alertas severas"
                  description="No hay alertas high o critical en la región seleccionada."
                />
              </div>
            ) : (
              <div className="risk-map-list">
                {highSeverityRegionAlerts.map((alert) => {
                  const supplier = safeSuppliers.find(
                    (item) => item.id === alert.supplierId
                  );

                  return (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      supplier={supplier}
                    />
                  );
                })}
              </div>
            )}
          </Card>
        </section>

        <section className="risk-map-section">
          <SectionHeader
            kicker="Operating loop"
            icon={Layers3}
            title="Risk map operating base"
            description="El mapa une proveedores, regiones, spend, alertas, evidencias y revisiones para priorizar acciones de compliance."
          />

          <div className="risk-map-grid risk-map-grid-kpis">
            <KpiCard
              label="Proveedores"
              value={safeSuppliers.length}
              description="Base monitorizada"
              icon={Globe2}
            />

            <KpiCard
              label="Alertas"
              value={safeAlerts.length}
              description="Señales de exposición"
              icon={AlertTriangle}
            />

            <KpiCard
              label="Evidencias"
              value={safeEvidenceItems.length}
              description="Soporte documental"
              icon={FileIconFallback}
            />

            <KpiCard
              label="Spend visible"
              value={formatCurrency(
                engineSuppliers.reduce(
                  (sum, supplier) => sum + Number(supplier.spend || 0),
                  0
                )
              )}
              description="Volumen anual agregado"
              icon={WalletCards}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function FileIconFallback({ size = 18 }) {
  return <ShieldCheck size={size} />;
}