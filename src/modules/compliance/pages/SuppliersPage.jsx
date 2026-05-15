import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  FileSearch,
  Gauge,
  Globe2,
  Layers3,
  Plus,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Users,
  WalletCards
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { EmptyState } from '../../../shared/components/ui/EmptyState.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Input } from '../../../shared/components/ui/Input.jsx';
import { Select } from '../../../shared/components/ui/Select.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import {
  PERMISSIONS,
  useAuth
} from '../../../app/providers/AuthProvider.jsx';
import { useNotifications } from '../../../app/providers/NotificationsProvider.jsx';
import { useComplianceStore } from '../store/complianceStore.js';
import { useComplianceEngine } from '../engine/useComplianceEngine.js';
import {
  DEMO_COMPLIANCE_ALERT,
  DEMO_COMPLIANCE_EVIDENCE,
  DEMO_COMPLIANCE_REVIEW,
  DEMO_COMPLIANCE_SUPPLIER
} from '../../../shared/config/demoData.js';
import {
  SHOW_DEMO_TOOLS,
  DEMO_BUTTON_LABELS,
  DEMO_RESET_LABELS
} from '../../../shared/config/demoMode.js';

const TIER_OPTIONS = ['Tier 1', 'Tier 2', 'Tier 3'];
const CRITICALITY_OPTIONS = ['Baja', 'Media', 'Alta', 'Crítica'];

const REGION_OPTIONS = [
  'Europa',
  'África Norte',
  'África',
  'Asia',
  'América',
  'Global',
  'Sin región'
];

const STATUS_OPTIONS = ['active', 'watchlist', 'inactive'];

const suppliersPageCss = `
  .suppliers-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 38px;
  }

  .suppliers-hero {
    position: relative;
    overflow: hidden;
    border-radius: 38px;
    padding: 38px;
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

  .suppliers-hero::before {
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

  .suppliers-hero::after {
    content: "";
    position: absolute;
    inset: auto -190px -210px auto;
    width: 520px;
    height: 520px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.13), transparent 70%);
    pointer-events: none;
  }

  .suppliers-hero-layout {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.42fr) minmax(380px, 0.58fr);
    gap: 36px;
    align-items: stretch;
  }

  .suppliers-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 26px;
  }

  .suppliers-title {
    margin: 0;
    max-width: 950px;
    font-size: clamp(42px, 5vw, 72px);
    line-height: 0.92;
    letter-spacing: -0.075em;
  }

  .suppliers-title span {
    display: block;
    margin-top: 8px;
    color: rgba(226, 232, 240, 0.7);
  }

  .suppliers-copy {
    max-width: 860px;
    margin: 26px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .suppliers-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 34px;
  }

  .suppliers-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .suppliers-command-item {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.078);
    min-width: 0;
  }

  .suppliers-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .suppliers-signal-card {
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

  .suppliers-signal-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: radial-gradient(circle at 18% 0%, rgba(96, 165, 250, 0.13), transparent 35%);
    pointer-events: none;
  }

  .suppliers-signal-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .suppliers-signal-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .suppliers-icon-box,
  .suppliers-card-icon,
  .suppliers-panel-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .suppliers-icon-box {
    width: 50px;
    height: 50px;
  }

  .suppliers-card-icon,
  .suppliers-panel-icon {
    width: 46px;
    height: 46px;
  }

  .suppliers-signal-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.16;
    letter-spacing: -0.04em;
  }

  .suppliers-score-module {
    display: grid;
    grid-template-columns: 122px minmax(0, 1fr);
    gap: 22px;
    align-items: center;
    padding: 20px;
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.047);
    border: 1px solid rgba(255, 255, 255, 0.085);
  }

  .suppliers-score-ring {
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

  .suppliers-score-core {
    width: 84px;
    height: 84px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.97);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .suppliers-score-core strong {
    font-size: 25px;
    letter-spacing: -0.055em;
  }

  .suppliers-score-core strong.is-empty-score {
    font-size: 30px;
    color: rgba(226, 232, 240, 0.72);
  }

  .suppliers-score-copy strong {
    display: block;
    margin-bottom: 8px;
  }

  .suppliers-score-copy p {
    margin: 0;
    line-height: 1.62;
  }

  .suppliers-signal-table {
    display: grid;
    gap: 0;
  }

  .suppliers-signal-row {
    display: grid;
    grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
    gap: 14px;
    align-items: center;
    padding: 15px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }

  .suppliers-signal-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .suppliers-section {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .suppliers-section-header {
    display: flex;
    justify-content: space-between;
    gap: 28px;
    align-items: flex-end;
  }

  .suppliers-kicker {
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

  .suppliers-section-header h2,
  .suppliers-section-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .suppliers-section-header p {
    max-width: 820px;
    margin: 11px 0 0;
    line-height: 1.68;
  }

  .suppliers-grid {
    display: grid;
    gap: 26px;
    align-items: stretch;
  }

  .suppliers-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .suppliers-grid-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .suppliers-panel,
  .suppliers-kpi-card,
  .suppliers-list-card {
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

  .suppliers-panel {
    padding: 31px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .suppliers-panel-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .suppliers-panel-title {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .suppliers-panel-description {
    margin: 11px 0 0;
    line-height: 1.66;
  }

  .suppliers-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .suppliers-form-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 4px;
  }

  .suppliers-kpi-card {
    min-height: 158px;
    padding: 22px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 18px;
  }

  .suppliers-kpi-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .suppliers-kpi-value {
    margin-top: 12px;
    font-size: 25px;
    font-weight: 790;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .suppliers-kpi-card p {
    margin: 0;
    line-height: 1.56;
  }

  .suppliers-search-shell {
    min-width: 280px;
  }

  .suppliers-list-panel {
    padding: 31px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .suppliers-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .suppliers-list-card {
    padding: 26px;
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .suppliers-list-card:hover {
    transform: translateY(-2px);
    border-color: rgba(96, 165, 250, 0.24);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .suppliers-list-card.is-active {
    border-color: rgba(16, 185, 129, 0.32);
    background:
      linear-gradient(135deg, rgba(16,185,129,0.13), rgba(255,255,255,0.028)),
      rgba(15, 23, 42, 0.74);
    box-shadow:
      0 24px 70px rgba(0, 0, 0, 0.21),
      0 0 38px rgba(16, 185, 129, 0.07);
  }

  .suppliers-list-card-head {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .suppliers-list-card-title {
    margin: 0;
    letter-spacing: -0.04em;
  }

  .suppliers-list-meta {
    margin: 9px 0 0;
    line-height: 1.58;
  }

  .suppliers-score-pair {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: flex-end;
  }

  .suppliers-score-box {
    min-width: 108px;
    text-align: right;
  }

  .suppliers-score-box strong {
    display: block;
    font-size: 24px;
    line-height: 1;
    letter-spacing: -0.045em;
  }

  .suppliers-chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 18px;
  }

  .suppliers-card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 20px;
  }

  .suppliers-empty-wrap {
    border-radius: 26px;
    padding: 34px;
    border: 1px dashed rgba(148, 163, 184, 0.24);
    background: rgba(255,255,255,0.025);
  }

  .suppliers-muted-tight {
    margin-bottom: 0;
  }

  @media (max-width: 1180px) {
    .suppliers-hero-layout,
    .suppliers-grid-two {
      grid-template-columns: 1fr;
    }

    .suppliers-grid-kpis {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 920px) {
    .suppliers-command-bar {
      grid-template-columns: 1fr;
    }

    .suppliers-section-header,
    .suppliers-list-card-head {
      align-items: flex-start;
      flex-direction: column;
    }

    .suppliers-search-shell {
      width: 100%;
      min-width: 0;
    }

    .suppliers-score-pair {
      justify-content: flex-start;
    }

    .suppliers-score-box {
      text-align: left;
    }
  }

  @media (max-width: 680px) {
    .suppliers-page {
      gap: 28px;
    }

    .suppliers-hero {
      padding: 26px;
      border-radius: 28px;
    }

    .suppliers-grid-kpis {
      grid-template-columns: 1fr;
    }

    .suppliers-panel,
    .suppliers-kpi-card,
    .suppliers-list-card,
    .suppliers-list-panel {
      border-radius: 24px;
    }

    .suppliers-score-module {
      grid-template-columns: 1fr;
    }

    .suppliers-signal-row {
      grid-template-columns: 1fr;
      gap: 7px;
    }

    .suppliers-signal-row strong {
      text-align: left;
    }
  }

  /* FINAL POLISH — Supplier Portfolio Overview */
  .suppliers-grid-two {
    align-items: start !important;
  }

  .suppliers-portfolio-panel {
    height: auto !important;
    min-height: 0 !important;
  }

  .suppliers-portfolio-panel .suppliers-grid-kpis {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 16px !important;
  }

  .suppliers-portfolio-panel .suppliers-kpi-card {
    min-height: 122px !important;
    padding: 18px !important;
    gap: 14px !important;
    border-radius: 24px !important;
  }

  .suppliers-portfolio-panel .suppliers-kpi-top {
    gap: 14px !important;
  }

  .suppliers-portfolio-panel .suppliers-kpi-value {
    margin-top: 9px !important;
    font-size: 28px !important;
    line-height: 1 !important;
    white-space: nowrap !important;
    overflow-wrap: normal !important;
  }

  .suppliers-portfolio-panel .suppliers-kpi-card p {
    font-size: 14px !important;
    line-height: 1.45 !important;
  }

  .suppliers-portfolio-panel .suppliers-card-icon {
    width: 42px !important;
    height: 42px !important;
    border-radius: 16px !important;
  }

  .suppliers-portfolio-panel > .muted {
    margin-top: 4px !important;
    line-height: 1.6 !important;
  }

  @media (max-width: 680px) {
    .suppliers-portfolio-panel .suppliers-grid-kpis {
      grid-template-columns: 1fr !important;
    }
  }


  /* FINAL FIX - suppliers overflow protection */
  .suppliers-page,
  .suppliers-list-panel,
  .suppliers-list,
  .suppliers-grid,
  .suppliers-grid-kpis {
    overflow: visible !important;
    align-items: start !important;
  }

  .suppliers-list-card,
  .suppliers-kpi-card,
  .suppliers-panel {
    min-height: 0 !important;
    height: auto !important;
    max-height: none !important;
    overflow: hidden !important;
  }

  .suppliers-list-meta,
  .suppliers-score-box strong,
  .suppliers-kpi-value,
  .suppliers-chip-row,
  .suppliers-panel-description {
    overflow-wrap: anywhere !important;
    word-break: break-word !important;
  }

  .suppliers-actions {
    flex-wrap: wrap !important;
  }
`;

const MULTINATIONAL_COMPLIANCE_SUPPLIERS = [
  {
    ...DEMO_COMPLIANCE_SUPPLIER,
    id: 'demo-compliance-nordic-cloud',
    name: 'Nordic Cloud Infrastructure',
    country: 'Sweden',
    region: 'Nordics',
    tier: 'Tier 1',
    sector: 'Cloud Infrastructure',
    criticality: 'Critical',
    spend: 1850000,
    status: 'active',
    riskScore: 38,
    resilienceScore: 86,
    lastReviewAt: new Date().toISOString()
  },
  {
    ...DEMO_COMPLIANCE_SUPPLIER,
    id: 'demo-compliance-latam-logistics',
    name: 'LATAM Logistics Partner',
    country: 'Mexico',
    region: 'LATAM',
    tier: 'Tier 1',
    sector: 'Logistics',
    criticality: 'High',
    spend: 1260000,
    status: 'under_review',
    riskScore: 74,
    resilienceScore: 54,
    lastReviewAt: new Date().toISOString()
  },
  {
    ...DEMO_COMPLIANCE_SUPPLIER,
    id: 'demo-compliance-dach-manufacturing',
    name: 'DACH Manufacturing Supplier',
    country: 'Germany',
    region: 'DACH',
    tier: 'Tier 2',
    sector: 'Advanced Manufacturing',
    criticality: 'High',
    spend: 940000,
    status: 'active',
    riskScore: 46,
    resilienceScore: 78,
    lastReviewAt: new Date().toISOString()
  },
  {
    ...DEMO_COMPLIANCE_SUPPLIER,
    id: 'demo-compliance-uk-healthcare',
    name: 'UK Healthcare Vendor',
    country: 'United Kingdom',
    region: 'UK / Ireland',
    tier: 'Tier 1',
    sector: 'Healthcare Services',
    criticality: 'Critical',
    spend: 2200000,
    status: 'active',
    riskScore: 52,
    resilienceScore: 73,
    lastReviewAt: new Date().toISOString()
  },
  {
    ...DEMO_COMPLIANCE_SUPPLIER,
    id: 'demo-compliance-france-energy',
    name: 'France Energy Contractor',
    country: 'France',
    region: 'France / Benelux',
    tier: 'Tier 2',
    sector: 'Energy Services',
    criticality: 'High',
    spend: 1575000,
    status: 'under_review',
    riskScore: 68,
    resilienceScore: 61,
    lastReviewAt: new Date().toISOString()
  },
  {
    ...DEMO_COMPLIANCE_SUPPLIER,
    id: 'demo-compliance-apac-data',
    name: 'APAC Data Processing Partner',
    country: 'Singapore',
    region: 'APAC',
    tier: 'Tier 1',
    sector: 'Data Processing',
    criticality: 'Critical',
    spend: 2450000,
    status: 'critical_review',
    riskScore: 82,
    resilienceScore: 49,
    lastReviewAt: new Date().toISOString()
  }
];

function getDemoAlertTitle(supplier) {
  return `${supplier.region} compliance review required`;
}

function getDemoEvidenceTitle(supplier) {
  return `${supplier.name} evidence pack`;
}

function getDemoReviewTitle(supplier) {
  return `${supplier.name} quarterly compliance review`;
}

function getDemoSeverity(score) {
  const parsedScore = Number(score);

  if (!Number.isFinite(parsedScore)) return 'medium';
  if (parsedScore >= 80) return 'critical';
  if (parsedScore >= 65) return 'high';
  if (parsedScore >= 45) return 'medium';

  return 'low';
}
function getEmptySupplierForm() {
  return {
    name: '',
    country: '',
    region: 'Europa',
    tier: 'Tier 1',
    sector: '',
    criticality: 'Media',
    spend: '',
    status: 'active'
  };
}

function normalizeText(value) {
  return String(value || '').trim();
}

function normalizeComparableText(value) {
  return normalizeText(value).toLowerCase();
}

function parseSpend(value) {
  if (value === '' || value === null || value === undefined) {
    return 0;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  return number;
}

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

function formatSpend(value) {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }

  if (typeof value === 'function') {
    return 'N/A';
  }

  if (typeof value === 'object') {
    return 'N/A';
  }

  const raw = String(value).trim();

  if (
    raw.length > 60 ||
    raw.includes('function ') ||
    raw.includes('=>') ||
    raw.includes('const ') ||
    raw.includes('return ') ||
    raw.includes('[object Object]')
  ) {
    return 'N/A';
  }

  const normalized = raw
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.')
    .replace(/[^\d.-]/g, '');

  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    return 'N/A';
  }

  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(parsed);
}
function getRegistrySignal({
  supplierCount,
  averageRiskScore,
  averageResilienceScore,
  evidenceCoverage,
  highRiskCount
}) {
  if (supplierCount === 0) {
    return {
      score: null,
      title: 'Supplier registry pending',
      posture: 'Build supplier base',
      description:
        'Crea el primer proveedor para activar scoring de riesgo, resiliencia, evidencia y priorización ejecutiva.'
    };
  }

  const inverseRisk = Math.max(0, 100 - averageRiskScore);
  const baseScore = clampScore(
    inverseRisk * 0.36 +
      averageResilienceScore * 0.34 +
      evidenceCoverage * 0.2 +
      Math.min(10, supplierCount * 2)
  );

  if (highRiskCount > 0) {
    return {
      score: Math.max(35, baseScore - Math.min(18, highRiskCount * 6)),
      title: 'High-risk suppliers detected',
      posture: 'Prioritize review',
      description:
        'Hay proveedores de alto riesgo. Conviene activar revisión, evidencias y seguimiento antes de considerar la base controlada.'
    };
  }

  if (baseScore >= 82) {
    return {
      score: baseScore,
      title: 'Controlled supplier base',
      posture: 'Maintain controls',
      description:
        'La base de proveedores presenta una lectura controlada, con riesgo razonable y buena resiliencia operativa.'
    };
  }

  if (baseScore >= 60) {
    return {
      score: baseScore,
      title: 'Supplier base established',
      posture: 'Improve coverage',
      description:
        'El registro ya permite operar, aunque conviene reforzar evidencias, revisiones y cobertura documental.'
    };
  }

  return {
    score: baseScore,
    title: 'Supplier base needs attention',
    posture: 'Strengthen controls',
    description:
      'La base existe, pero necesita mayor control documental, revisión de criticidad y mejora de resiliencia.'
  };
}

function CommandItem({ label, value }) {
  return (
    <div className="suppliers-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SignalRow({ label, value }) {
  return (
    <div className="suppliers-signal-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SectionHeader({ kicker, icon: Icon, title, description, right }) {
  return (
    <div className="suppliers-section-header">
      <div>
        <div className="suppliers-kicker">
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
    <div className="suppliers-panel-header">
      <div>
        <div className="suppliers-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h3 className="suppliers-panel-title">{title}</h3>

        <p className="muted suppliers-panel-description">{description}</p>
      </div>

      <div className="suppliers-panel-icon">
        <Icon size={18} />
      </div>
    </div>
  );
}

function KpiCard({ label, value, description, icon: Icon, tone = '' }) {
  return (
    <article className="suppliers-kpi-card">
      <div className="suppliers-kpi-top">
        <div>
          <div className="kpi-label">{label}</div>

          <div className={`suppliers-kpi-value ${tone}`.trim()}>
            {value}
          </div>
        </div>

        <div className="suppliers-card-icon">
          <Icon size={18} />
        </div>
      </div>

      <p className="muted">{description}</p>
    </article>
  );
}

function SupplierCard({
  supplier,
  isActive,
  canDeleteSupplier,
  onSetActive,
  onOpenSupplier,
  onDeleteSupplier
}) {
  const riskLevel = supplier.riskLevel || {};
  const resilienceLevel = supplier.resilienceLevel || {};
  const riskColor = riskLevel.color || '';
  const resilienceColor = resilienceLevel.color || '';

  return (
    <article className={`suppliers-list-card ${isActive ? 'is-active' : ''}`.trim()}>
      <div className="suppliers-list-card-head">
        <div>
          <h3 className="suppliers-list-card-title">{supplier.name}</h3>

          <p className="muted suppliers-list-meta">
            {supplier.country || 'Sin país'} · {supplier.region || 'Sin región'} ·{' '}
            {supplier.tier || 'Tier N/A'} · {supplier.criticality || 'Media'}
          </p>
        </div>

        <div className="suppliers-score-pair">
          <div className="suppliers-score-box">
            <strong className={riskColor}>{supplier.riskScore}/100</strong>
            <div className="kpi-label">Riesgo {riskLevel.label || 'N/A'}</div>
          </div>

          <div className="suppliers-score-box">
            <strong className={resilienceColor}>
              {supplier.resilienceScore}/100
            </strong>
            <div className="kpi-label">
              Resiliencia {resilienceLevel.label || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      <div className="suppliers-chip-row">
        {isActive ? <Badge>Proveedor activo</Badge> : null}
        <Badge>{supplier.status || 'active'}</Badge>
        <Badge>{supplier.sector || 'General'}</Badge>
        <Badge>{formatSpend(supplier.spend)}</Badge>
      </div>

      <div className="suppliers-card-actions">
        <Button
          variant="secondary"
          onClick={() => onSetActive(supplier.id)}
        >
          <CheckCircle2 size={16} />
          Activar
        </Button>

        <Button
          variant="secondary"
          onClick={() => onOpenSupplier(supplier.id)}
        >
          <Eye size={16} />
          Ver ficha
        </Button>

        {canDeleteSupplier ? (
          <Button
            variant="danger"
            onClick={() => onDeleteSupplier(supplier.id)}
          >
            <Trash2 size={16} />
            Eliminar
          </Button>
        ) : null}
      </div>
    </article>
  );
}

export function SuppliersPage() {
  const navigate = useNavigate();
  const { pushToast } = useNotifications();
  const { can, isViewer } = useAuth();

  const {
    suppliers,
    alerts,
    evidenceItems,
    reviews,
    activeSupplierId,
    setActiveSupplierId,
    createSupplier,
    deleteSupplier,
    createAlert,
    addEvidence,
    createReview
  } = useComplianceStore();

  const safeSuppliers = getSafeArray(suppliers);
  const safeAlerts = getSafeArray(alerts);
  const safeEvidenceItems = getSafeArray(evidenceItems);
  const safeReviews = getSafeArray(reviews);

  const canCreateSupplier = can(PERMISSIONS.CREATE_SUPPLIER);
  const canDeleteSupplier = can(PERMISSIONS.DELETE_SUPPLIER);

  const canLoadDemo =
    can(PERMISSIONS.CREATE_SUPPLIER) &&
    can(PERMISSIONS.CREATE_ALERT) &&
    can(PERMISSIONS.CREATE_EVIDENCE) &&
    can(PERMISSIONS.CREATE_REVIEW);

  const canResetDemo = can(PERMISSIONS.DELETE_SUPPLIER);

  const engine = useComplianceEngine({
    suppliers: safeSuppliers,
    alerts: safeAlerts,
    evidenceItems: safeEvidenceItems,
    reviews: safeReviews,
    activeSupplierId
  });

  const engineSuppliers = getSafeArray(engine.suppliers);
  const highRiskSuppliers = getSafeArray(engine.highRiskSuppliers);

  const [query, setQuery] = useState('');
  const [newSupplier, setNewSupplier] = useState(getEmptySupplierForm());

  const averageRiskScore = getSafeNumber(
    engine.portfolioRisk?.averageRiskScore
  );
  const averageResilienceScore = getSafeNumber(
    engine.portfolioResilience?.averageResilienceScore
  );
  const evidenceCoverage = getSafeNumber(
    engine.portfolioRisk?.evidenceCoverage
  );

  const registrySignal = getRegistrySignal({
    supplierCount: engineSuppliers.length,
    averageRiskScore,
    averageResilienceScore,
    evidenceCoverage,
    highRiskCount: highRiskSuppliers.length
  });

  const scoreAngle = `${(registrySignal.score ?? 0) * 3.6}deg`;

  const filteredSuppliers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return engineSuppliers;

    return engineSuppliers.filter((supplier) => {
      return [
        supplier.name,
        supplier.country,
        supplier.region,
        supplier.tier,
        supplier.sector,
        supplier.criticality,
        supplier.status
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [engineSuppliers, query]);

  function updateNewSupplierField(key, value) {
    setNewSupplier((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  async function handleCreateSupplier() {
    if (!canCreateSupplier) {
      pushToast('No tienes permisos para crear proveedores');
      return;
    }

    const supplierName = normalizeText(newSupplier.name);

    if (!supplierName) {
      pushToast('El nombre del proveedor es obligatorio');
      return;
    }

    const duplicatedSupplier = safeSuppliers.some((supplier) => {
      return (
        normalizeComparableText(supplier.name) ===
        normalizeComparableText(supplierName)
      );
    });

    if (duplicatedSupplier) {
      pushToast('Ya existe un proveedor con ese nombre');
      return;
    }

    const spendValue = parseSpend(newSupplier.spend);

    if (spendValue === null) {
      pushToast('El spend anual debe ser un número válido');
      return;
    }

    if (spendValue < 0) {
      pushToast('El spend anual no puede ser negativo');
      return;
    }

    try {
      const created = await Promise.resolve(
        createSupplier({
          ...newSupplier,
          name: supplierName,
          country: normalizeText(newSupplier.country) || 'Sin país',
          region: newSupplier.region || 'Sin región',
          tier: newSupplier.tier || 'Tier 1',
          sector: normalizeText(newSupplier.sector) || 'General',
          criticality: newSupplier.criticality || 'Media',
          spend: spendValue,
          status: newSupplier.status || 'active'
        })
      );

      if (!created?.id) {
        pushToast('No se pudo crear el proveedor');
        return;
      }

      setNewSupplier(getEmptySupplierForm());

      pushToast('Proveedor creado correctamente');

      navigate(`/compliance/suppliers/${created.id}`);
    } catch (error) {
      pushToast(error?.message || 'No se pudo crear el proveedor');
    }
  }

  function handleLoadDemoCompliance() {
    if (!canLoadDemo) {
      pushToast('No tienes permisos para cargar la demo Compliance');
      return;
    }

    MULTINATIONAL_COMPLIANCE_SUPPLIERS.forEach((demoSupplier) => {
      const existingSupplier = safeSuppliers.find(
        (supplier) => supplier.id === demoSupplier.id
      );

      if (!existingSupplier) {
        createSupplier(demoSupplier);
      }
    });

    setQuery('');
    setActiveSupplierId(MULTINATIONAL_COMPLIANCE_SUPPLIERS[0]?.id || '');

    pushToast('Demo Compliance multinacional preparada: 6 proveedores globales');

    navigate('/compliance/suppliers');
  }
  function handleResetDemoCompliance() {
    if (!canResetDemo) {
      pushToast('No tienes permisos para resetear la demo Compliance');
      return;
    }

    const demoSupplierIds = MULTINATIONAL_COMPLIANCE_SUPPLIERS.map(
      (supplier) => supplier.id
    );

    demoSupplierIds.forEach((supplierId) => {
      const demoExists = safeSuppliers.some(
        (supplier) => supplier.id === supplierId
      );

      if (demoExists) {
        deleteSupplier(supplierId);
      }
    });

    setNewSupplier(getEmptySupplierForm());

    const nextActiveSupplier = safeSuppliers.find(
      (supplier) => !demoSupplierIds.includes(supplier.id)
    );

    setActiveSupplierId(nextActiveSupplier?.id || '');

    pushToast('Compliance demo multinacional limpiada');

    navigate('/compliance/suppliers');
  }
  function handleOpenSupplier(supplierId) {
    setActiveSupplierId(supplierId);
    navigate(`/compliance/suppliers/${supplierId}`);
  }

  function handleSetActive(supplierId) {
    setActiveSupplierId(supplierId);
    pushToast('Proveedor activado');
  }

  function handleDeleteSupplier(supplierId) {
    if (!canDeleteSupplier) {
      pushToast('No tienes permisos para eliminar proveedores');
      return;
    }

    const result = deleteSupplier(supplierId);

    if (!result?.deleted) {
      pushToast('No se pudo eliminar el proveedor');
      return;
    }

    const removed = result.removed || {};

    pushToast(
      `Proveedor eliminado: ${removed.alerts || 0} alertas, ${
        removed.evidence || 0
      } evidencias y ${removed.reviews || 0} revisiones asociadas`
    );
  }

  return (
    <div className="page">
      <style>{suppliersPageCss}</style>

      <div className="suppliers-page">
        <section className="suppliers-hero ceos-ws-hero">
          <div className="suppliers-hero-layout">
            <div>
              <div className="suppliers-badge-row">
                <Badge>Compliance & Risk</Badge>
                <Badge>Global Third-Party Registry</Badge>
                {isViewer ? <Badge>Modo solo lectura</Badge> : null}
                {canCreateSupplier ? <Badge>Creación permitida</Badge> : null}
                {canDeleteSupplier ? <Badge>Eliminación permitida</Badge> : null}
              </div>

              <h1 className="suppliers-title">
                Global Compliance Control.
                <span>Map cross-border supplier risk.</span>
              </h1>

              <p className="suppliers-copy">
                Registro centralizado de proveedores con segmentación, criticidad,
                spend, scoring de riesgo, resiliencia operativa y continuidad
                hacia alertas, evidencias y revisiones humanas.
              </p>

              <div className="suppliers-actions">
                {SHOW_DEMO_TOOLS && canLoadDemo ? (
                  <Button variant="secondary" onClick={handleLoadDemoCompliance}>
                    <Sparkles size={16} />
                    {DEMO_BUTTON_LABELS.compliance}
                  </Button>
                ) : null}

                {SHOW_DEMO_TOOLS && canResetDemo ? (
                  <Button variant="secondary" onClick={handleResetDemoCompliance}>
                    <RotateCcw size={16} />
                    {DEMO_RESET_LABELS.compliance}
                  </Button>
                ) : null}
              </div>

              <div className="suppliers-command-bar">
                <CommandItem
                  label="Suppliers"
                  value={engineSuppliers.length}
                />

                <CommandItem
                  label="High risk"
                  value={highRiskSuppliers.length}
                />

                <CommandItem
                  label="Registry posture"
                  value={registrySignal.posture}
                />
              </div>
            </div>

            <aside className="suppliers-signal-card">
              <div className="suppliers-signal-inner">
                <div className="suppliers-signal-top">
                  <div>
                    <div className="kpi-label">Registry Signal</div>
                    <div className="suppliers-signal-title">
                      {registrySignal.title}
                    </div>
                  </div>

                  <div className="suppliers-icon-box">
                    <Users size={21} />
                  </div>
                </div>

                <div className="suppliers-score-module">
                  <div
                    className="suppliers-score-ring"
                    style={{ '--score-angle': scoreAngle }}
                  >
                    <div className="suppliers-score-core">
                      <strong className={registrySignal.score === null ? 'is-empty-score' : ''}>
                        {registrySignal.score === null ? '—' : registrySignal.score}
                      </strong>
                    </div>
                  </div>

                  <div className="suppliers-score-copy">
                    <strong>{registrySignal.posture}</strong>

                    <p className="muted">
                      {registrySignal.description}
                    </p>
                  </div>
                </div>

                <div className="suppliers-signal-table">
                  <SignalRow label="Avg risk" value={`${averageRiskScore}/100`} />
                  <SignalRow label="Avg resilience" value={`${averageResilienceScore}/100`} />
                  <SignalRow label="Evidence coverage" value={`${evidenceCoverage}%`} />
                  <SignalRow label="Active supplier" value={activeSupplierId ? 'Selected' : 'Pending'} />
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="suppliers-grid suppliers-grid-two">
          <Card className="suppliers-panel">
            <PanelHeader
              kicker="Create supplier"
              icon={Plus}
              title="Nuevo proveedor"
              description="Añade un proveedor al registro para activar scoring, evidencias, alertas y revisiones."
            />

            {canCreateSupplier ? (
              <div className="suppliers-form">
                <Input
                  label="Nombre del proveedor"
                  value={newSupplier.name}
                  onChange={(e) => updateNewSupplierField('name', e.target.value)}
                />

                <div className="grid-2">
                  <Input
                    label="País"
                    value={newSupplier.country}
                    onChange={(e) =>
                      updateNewSupplierField('country', e.target.value)
                    }
                  />

                  <Select
                    label="Región"
                    value={newSupplier.region}
                    onChange={(e) =>
                      updateNewSupplierField('region', e.target.value)
                    }
                    options={REGION_OPTIONS}
                  />
                </div>

                <div className="grid-2">
                  <Select
                    label="Tier"
                    value={newSupplier.tier}
                    onChange={(e) => updateNewSupplierField('tier', e.target.value)}
                    options={TIER_OPTIONS}
                  />

                  <Select
                    label="Criticidad"
                    value={newSupplier.criticality}
                    onChange={(e) =>
                      updateNewSupplierField('criticality', e.target.value)
                    }
                    options={CRITICALITY_OPTIONS}
                  />
                </div>

                <div className="grid-2">
                  <Input
                    label="Sector"
                    value={newSupplier.sector}
                    onChange={(e) =>
                      updateNewSupplierField('sector', e.target.value)
                    }
                  />

                  <Input
                    label="Spend anual (€)"
                    inputMode="decimal"
                    value={newSupplier.spend}
                    onChange={(e) =>
                      updateNewSupplierField('spend', e.target.value)
                    }
                  />
                </div>

                <Select
                  label="Estado"
                  value={newSupplier.status}
                  onChange={(e) => updateNewSupplierField('status', e.target.value)}
                  options={STATUS_OPTIONS}
                />

                <div className="suppliers-form-actions">
                  <Button onClick={handleCreateSupplier}>
                    <Plus size={16} />
                    Crear proveedor
                  </Button>
                </div>
              </div>
            ) : (
              <div className="suppliers-empty-wrap">
                <EmptyState
                  title="Sin permisos de creación"
                  description="Tu rol actual solo permite consultar proveedores."
                />
              </div>
            )}
          </Card>

          <Card className="suppliers-panel suppliers-portfolio-panel">
            <PanelHeader
              kicker="Portfolio overview"
              icon={Gauge}
              title="Portfolio Overview"
              description="Lectura rápida del riesgo agregado, resiliencia, proveedores críticos y cobertura documental."
            />

            <div className="suppliers-grid suppliers-grid-kpis">
              <KpiCard
                label="Riesgo medio"
                value={`${averageRiskScore}/100`}
                description="Score agregado del portfolio"
                icon={ShieldAlert}
              />

              <KpiCard
                label="Resiliencia media"
                value={`${averageResilienceScore}/100`}
                description="Capacidad operativa estimada"
                icon={ShieldCheck}
                tone="text-success"
              />

              <KpiCard
                label="Alto riesgo"
                value={highRiskSuppliers.length}
                description="Proveedores que requieren revisión"
                icon={AlertTriangle}
                tone={highRiskSuppliers.length > 0 ? 'text-danger' : ''}
              />

              <KpiCard
                label="Evidencia"
                value={`${evidenceCoverage}%`}
                description="Cobertura documental"
                icon={FileSearch}
              />
            </div>

            <p className="muted suppliers-muted-tight">
              Esta vista permite controlar qué proveedores requieren revisión
              prioritaria antes de pasar al módulo de evidencias, alertas y
              reportes.
            </p>
          </Card>
        </section>

        <section className="suppliers-section">
          <SectionHeader
            kicker="Supplier list"
            icon={Layers3}
            title="Global Supplier List"
            description="Selecciona un proveedor global para revisar jurisdicción, riesgo, alertas, evidencias y scoring."
            right={
              <div className="suppliers-search-shell">
                <Input
                  label="Buscar"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            }
          />

          <Card className="suppliers-list-panel">
            {filteredSuppliers.length === 0 ? (
              <div className="suppliers-empty-wrap">
                <EmptyState
                  title="No hay proveedores"
                  description="Crea un proveedor o cambia el filtro de búsqueda."
                />
              </div>
            ) : (
              <div className="suppliers-list">
                {filteredSuppliers.map((supplier) => {
                  const isActive = supplier.id === activeSupplierId;

                  return (
                    <SupplierCard
                      key={supplier.id}
                      supplier={supplier}
                      isActive={isActive}
                      canDeleteSupplier={canDeleteSupplier}
                      onSetActive={handleSetActive}
                      onOpenSupplier={handleOpenSupplier}
                      onDeleteSupplier={handleDeleteSupplier}
                    />
                  );
                })}
              </div>
            )}
          </Card>
        </section>

        <section className="suppliers-section">
          <SectionHeader
            kicker="Operating base"
            icon={ClipboardCheck}
            title="Supplier control workflow"
            description="La base de proveedores alimenta el resto del sistema: alertas, evidencias, revisiones humanas y reporting ejecutivo."
          />

          <div className="suppliers-grid suppliers-grid-kpis">
            <KpiCard
              label="Alertas"
              value={safeAlerts.length}
              description="Señales asociadas al portfolio"
              icon={AlertTriangle}
            />

            <KpiCard
              label="Evidencias"
              value={safeEvidenceItems.length}
              description="Documentos y pruebas registradas"
              icon={FileSearch}
            />

            <KpiCard
              label="Revisiones"
              value={safeReviews.length}
              description="Controles humanos registrados"
              icon={ClipboardCheck}
            />

            <KpiCard
              label="Spend base"
              value={formatSpend(
                engineSuppliers.reduce(
                  (total, supplier) => total + getSafeNumber(supplier.spend),
                  0
                )
              )}
              description="Spend anual registrado"
              icon={WalletCards}
            />
          </div>
        </section>
      </div>
    </div>
  );
}


