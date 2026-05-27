import React, { useMemo, useState } from 'react';
import {
  Activity,
  Archive,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Eye,
  FileSearch,
  FileText,
  Gauge,
  Layers3,
  LockKeyhole,
  Plus,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { EmptyState } from '../../../shared/components/ui/EmptyState.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
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
  complianceReportsApi,
  resolveWeightedRiskScoreForSupplier
} from '../services/complianceReportsApi.js';

const complianceReportCss = `
  .compliance-report-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 38px;
  }

  .report-hero {
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

  .report-hero::before {
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

  .report-hero::after {
    content: "";
    position: absolute;
    inset: auto -190px -210px auto;
    width: 520px;
    height: 520px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.13), transparent 70%);
    pointer-events: none;
  }

  .report-hero-layout {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.42fr) minmax(380px, 0.58fr);
    gap: 36px;
    align-items: stretch;
  }

  .report-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 26px;
  }

  .report-title {
    margin: 0;
    max-width: 950px;
    font-size: clamp(42px, 5vw, 72px);
    line-height: 0.92;
    letter-spacing: -0.075em;
  }

  .report-title span {
    display: block;
    margin-top: 8px;
    color: rgba(226, 232, 240, 0.7);
  }

  .report-copy {
    max-width: 860px;
    margin: 26px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .report-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .report-command-item {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.078);
    min-width: 0;
  }

  .report-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .report-signal-card {
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

  .report-signal-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: radial-gradient(circle at 18% 0%, rgba(96, 165, 250, 0.13), transparent 35%);
    pointer-events: none;
  }

  .report-signal-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .report-signal-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .report-icon-box,
  .report-card-icon,
  .report-panel-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .report-icon-box {
    width: 50px;
    height: 50px;
  }

  .report-card-icon,
  .report-panel-icon {
    width: 46px;
    height: 46px;
  }

  .report-signal-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.16;
    letter-spacing: -0.04em;
  }

  .report-score-module {
    display: grid;
    grid-template-columns: 122px minmax(0, 1fr);
    gap: 22px;
    align-items: center;
    padding: 20px;
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.047);
    border: 1px solid rgba(255, 255, 255, 0.085);
  }

  .report-score-ring {
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

  .report-score-core {
    width: 84px;
    height: 84px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.97);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .report-score-core strong {
    font-size: 25px;
    letter-spacing: -0.055em;
  }

  .report-score-core strong.is-empty-score {
    font-size: 30px;
    color: rgba(226, 232, 240, 0.72);
  }

  .report-score-copy strong {
    display: block;
    margin-bottom: 8px;
  }

  .report-score-copy p {
    margin: 0;
    line-height: 1.62;
  }

  .report-signal-table {
    display: grid;
    gap: 0;
  }

  .report-signal-row {
    display: grid;
    grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
    gap: 14px;
    align-items: center;
    padding: 15px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }

  .report-signal-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .report-section {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .report-section-header {
    display: flex;
    justify-content: space-between;
    gap: 28px;
    align-items: flex-end;
  }

  .report-kicker {
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

  .report-section-header h2,
  .report-section-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .report-section-header p {
    max-width: 820px;
    margin: 11px 0 0;
    line-height: 1.68;
  }

  .report-grid {
    display: grid;
    gap: 26px;
    align-items: stretch;
  }

  .report-grid-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .report-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .report-kpi-card,
  .report-panel,
  .report-list-card {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    width: 100%;
    height: 100%;
    border-radius: 31px;
    border: 1px solid rgba(255, 255, 255, 0.034);
    background:
      radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.112), transparent 36%),
      radial-gradient(circle at 100% 8%, rgba(16, 185, 129, 0.086), transparent 42%),
      linear-gradient(115deg, rgba(59, 130, 246, 0.064), rgba(255,255,255,0.016) 46%, rgba(16, 185, 129, 0.052)),
      rgba(15, 23, 42, 0.58);
    box-shadow:
      0 28px 82px rgba(0, 0, 0, 0.28),
      0 0 42px rgba(59, 130, 246, 0.086),
      inset 0 1px 0 rgba(255,255,255,0.058),
      inset 1px 0 0 rgba(59, 130, 246, 0.064),
      inset -1px 0 0 rgba(16, 185, 129, 0.056);
    backdrop-filter: blur(20px) saturate(134%);
    -webkit-backdrop-filter: blur(20px) saturate(134%);
  }

  .report-kpi-card::before,
  .report-panel::before,
  .report-list-card::before {
    content: "";
    position: absolute;
    inset: -30%;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(circle at 0% 10%, rgba(59, 130, 246, 0.100), transparent 34%),
      radial-gradient(circle at 100% 8%, rgba(16, 185, 129, 0.084), transparent 38%),
      radial-gradient(circle at 54% 120%, rgba(255,255,255,0.032), transparent 42%);
    filter: blur(28px);
    opacity: 0.60;
    mix-blend-mode: screen;
  }

  .report-kpi-card::after,
  .report-panel::after,
  .report-list-card::after {
    content: "";
    position: absolute;
    inset: 1px;
    z-index: 0;
    pointer-events: none;
    border-radius: inherit;
    background: linear-gradient(135deg, rgba(255,255,255,0.066), rgba(255,255,255,0.012) 32%, transparent 58%, rgba(255,255,255,0.020));
    opacity: 0.32;
  }

  .report-kpi-card > *,
  .report-panel > *,
  .report-list-card > * {
    position: relative;
    z-index: 1;
  }

  .report-kpi-card {
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

  .report-kpi-card:hover,
  .report-list-card:hover {
    transform: translateY(-3px);
    border-color: rgba(96, 165, 250, 0.18);
    box-shadow:
      0 34px 96px rgba(0, 0, 0, 0.34),
      0 0 54px rgba(59, 130, 246, 0.132),
      inset 0 1px 0 rgba(255,255,255,0.074);
  }

  .report-kpi-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .report-kpi-value {
    margin-top: 12px;
    font-size: 25px;
    font-weight: 790;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .report-kpi-card p {
    margin: 0;
    line-height: 1.56;
  }

  .report-panel {
    padding: 31px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .report-panel-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .report-panel-title {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .report-panel-description {
    margin: 11px 0 0;
    line-height: 1.66;
  }

  .report-builder-stack,
  .report-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .report-glass-block {
    padding: 20px;
    border-radius: 24px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.075);
  }

  .report-glass-block p {
    line-height: 1.62;
  }

  .report-action-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .report-mini-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .report-mini-metric {
    min-height: 120px;
    padding: 18px;
    border-radius: 22px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.075);
  }

  .report-mini-metric strong {
    display: block;
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .report-list-panel {
    padding: 31px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .report-list-card {
    padding: 26px;
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .report-list-card-head {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .report-list-card-title {
    margin: 0;
    letter-spacing: -0.04em;
  }

  .report-list-meta {
    margin: 9px 0 0;
    line-height: 1.58;
  }

  .report-summary {
    margin-top: 18px;
    padding-top: 18px;
    border-top: 1px solid rgba(148, 163, 184, 0.12);
    line-height: 1.62;
  }

  .report-chip-row,
  .report-card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 18px;
  }

  .report-empty-wrap {
    border-radius: 26px;
    padding: 34px;
    border: 1px dashed rgba(148, 163, 184, 0.24);
    background: rgba(255,255,255,0.025);
  }

  .report-muted-tight {
    margin-bottom: 0;
  }


  /* MULTINATIONAL PREMIUM REPORTING */
  .report-multinational-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
    gap: 18px;
    align-items: stretch;
  }

  .report-premium-panel {
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

  .report-premium-panel::before {
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

  .report-premium-panel > * {
    position: relative;
    z-index: 1;
  }

  .report-premium-header {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-items: flex-start;
    margin-bottom: 22px;
  }

  .report-premium-header h2,
  .report-premium-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .report-premium-header p {
    max-width: 760px;
    margin: 10px 0 0;
    line-height: 1.62;
  }

  .report-premium-icon {
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

  .report-premium-row-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 13px;
  }

  .report-premium-row {
    min-width: 0;
    padding: 16px;
    border-radius: 20px;
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.085);
  }

  .report-premium-row span {
    display: block;
    margin-bottom: 7px;
    color: rgba(148, 163, 184, 0.96);
    font-size: 11px;
    line-height: 1;
    font-weight: 850;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .report-premium-row strong {
    display: block;
    color: rgba(248, 250, 252, 0.96);
    font-size: 20px;
    line-height: 1.15;
    letter-spacing: -0.035em;
    overflow-wrap: anywhere;
  }

  .report-premium-memo {
    padding: 21px;
    border-radius: 24px;
    background:
      radial-gradient(circle at 100% 0%, rgba(16, 185, 129, 0.12), transparent 30%),
      rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.085);
  }

  .report-premium-decision {
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

  .report-premium-decision.watch {
    color: #fde68a;
    background: rgba(234, 179, 8, 0.12);
    border-color: rgba(234, 179, 8, 0.24);
  }

  .report-premium-decision.hold {
    color: #fecaca;
    background: rgba(239, 68, 68, 0.12);
    border-color: rgba(239, 68, 68, 0.24);
  }

  .report-premium-memo h3 {
    margin: 0;
    font-size: 24px;
    letter-spacing: -0.045em;
  }

  .report-premium-memo p {
    margin: 10px 0 0;
    line-height: 1.66;
  }

  .report-premium-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .report-premium-item {
    display: grid;
    grid-template-columns: 38px minmax(0, 1fr);
    gap: 13px;
    padding: 16px;
    border-radius: 20px;
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.085);
  }

  .report-premium-item-icon {
    width: 38px;
    height: 38px;
    border-radius: 15px;
    display: grid;
    place-items: center;
    color: #bfdbfe;
    background: rgba(37, 99, 235, 0.14);
    border: 1px solid rgba(96, 165, 250, 0.22);
  }

  .report-premium-item.is-danger .report-premium-item-icon {
    color: #fecaca;
    background: rgba(239, 68, 68, 0.12);
    border-color: rgba(239, 68, 68, 0.22);
  }

  .report-premium-item.is-watch .report-premium-item-icon {
    color: #fde68a;
    background: rgba(234, 179, 8, 0.12);
    border-color: rgba(234, 179, 8, 0.22);
  }

  .report-premium-item strong {
    display: block;
    margin-bottom: 6px;
    line-height: 1.25;
  }

  .report-premium-item p {
    margin: 0;
    line-height: 1.56;
  }

  @media (max-width: 1180px) {
    .report-multinational-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 760px) {
    .report-premium-panel {
      padding: 24px;
      border-radius: 24px;
    }

    .report-premium-row-grid,
    .report-premium-item {
      grid-template-columns: 1fr;
    }
  }
  @media (max-width: 1180px) {
    .report-hero-layout,
    .report-grid-two {
      grid-template-columns: 1fr;
    }

    .report-grid-kpis {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 920px) {
    .report-command-bar {
      grid-template-columns: 1fr;
    }

    .report-section-header,
    .report-list-card-head {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (max-width: 680px) {
    .compliance-report-page {
      gap: 28px;
    }

    .report-hero {
      padding: 26px;
      border-radius: 28px;
    }

    .report-grid-kpis,
    .report-mini-grid {
      grid-template-columns: 1fr;
    }

    .report-kpi-card,
    .report-panel,
    .report-list-card,
    .report-list-panel {
      border-radius: 24px;
    }

    .report-score-module {
      grid-template-columns: 1fr;
    }

    .report-signal-row {
      grid-template-columns: 1fr;
      gap: 7px;
    }

    .report-signal-row strong {
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

function buildRecommendations({
  supplier,
  riskScore,
  resilienceScore,
  evidenceSummary
}) {
  const recommendations = [];

  if (riskScore >= 75) {
    recommendations.push(
      'Activar revisión prioritaria por riesgo crítico y exigir plan de mitigación documentado.'
    );
  } else if (riskScore >= 55) {
    recommendations.push(
      'Mantener seguimiento reforzado y solicitar evidencia adicional sobre los puntos abiertos.'
    );
  } else {
    recommendations.push(
      'Mantener revisión periódica y actualizar evidencias cuando existan cambios relevantes.'
    );
  }

  if (resilienceScore < 50) {
    recommendations.push(
      'Diseñar proveedor alternativo o plan de continuidad para reducir dependencia operativa.'
    );
  }

  if ((evidenceSummary?.totalEvidence || 0) === 0) {
    recommendations.push(
      'Registrar evidencia mínima del proveedor antes de considerar el expediente como defendible.'
    );
  }

  if ((evidenceSummary?.pendingReviews || 0) > 0) {
    recommendations.push(
      'Cerrar las revisiones humanas pendientes antes de compartir el informe final.'
    );
  }

  if (supplier?.criticality === 'Alta' || supplier?.criticality === 'Crítica') {
    recommendations.push(
      'Revisar la criticidad del proveedor en comité interno o con responsable legal/compliance.'
    );
  }

  return recommendations;
}

function getReportSignal({ supplier, reportItemsCount, evidenceCount, reviewCount, reportsCount }) {
  if (!supplier) {
    return {
      score: null,
      title: 'Report base pending',
      posture: 'Select supplier',
      description:
        'Selecciona un proveedor para construir un informe DSS con riesgo, resiliencia, evidencias y revisión humana.'
    };
  }

  const riskScore = getSafeNumber(supplier.riskScore);
  const resilienceScore = getSafeNumber(supplier.resilienceScore);
  const evidenceBoost = Math.min(18, evidenceCount * 6);
  const reviewBoost = Math.min(14, reviewCount * 7);
  const reportBoost = reportsCount > 0 ? 8 : 0;

  const score = clampScore(
    45 + resilienceScore * 0.22 - riskScore * 0.18 + evidenceBoost + reviewBoost + reportBoost + Math.min(10, reportItemsCount * 2)
  );

  if (riskScore >= 75) {
    return {
      score,
      title: 'Critical report required',
      posture: 'Prioritize report',
      description:
        'El proveedor presenta riesgo crítico. Genera informe con evidencias, revisiones y recomendaciones defendibles.'
    };
  }

  if (evidenceCount === 0) {
    return {
      score,
      title: 'Evidence gap detected',
      posture: 'Add evidence',
      description:
        'El informe puede generarse, pero necesita evidencias para ser defendible ante comité o compliance.'
    };
  }

  if (reviewCount === 0) {
    return {
      score,
      title: 'Human review missing',
      posture: 'Add review trail',
      description:
        'Existe base documental, pero conviene añadir revisión humana para reforzar trazabilidad DSS.'
    };
  }

  return {
    score,
    title: 'Report-ready supplier',
    posture: 'Generate report',
    description:
      'El proveedor cuenta con base suficiente para generar un informe ejecutivo de compliance.'
  };
}

function CommandItem({ label, value }) {
  return (
    <div className="report-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SignalRow({ label, value }) {
  return (
    <div className="report-signal-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SectionHeader({ kicker, icon: Icon, title, description, right }) {
  return (
    <div className="report-section-header">
      <div>
        <div className="report-kicker">
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
    <div className="report-panel-header">
      <div>
        <div className="report-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h3 className="report-panel-title">{title}</h3>

        <p className="muted report-panel-description">{description}</p>
      </div>

      <div className="report-panel-icon">
        <Icon size={18} />
      </div>
    </div>
  );
}

function KpiCard({ label, value, description, icon: Icon, tone = '' }) {
  return (
    <article className="report-kpi-card">
      <div className="report-kpi-top">
        <div>
          <div className="kpi-label">{label}</div>

          <div className={`report-kpi-value ${tone}`.trim()}>
            {value}
          </div>
        </div>

        <div className="report-card-icon">
          <Icon size={18} />
        </div>
      </div>

      <p className="muted">{description}</p>
    </article>
  );
}

function MiniMetric({ label, value, tone = '' }) {
  return (
    <div className="report-mini-metric">
      <div className="kpi-label">{label}</div>
      <strong className={tone}>{value}</strong>
    </div>
  );
}

function ReportCard({ report, canCreateReport, onExport, onOpenSupplier }) {
  return (
    <article className="report-list-card">
      <div className="report-list-card-head">
        <div>
          <h3 className="report-list-card-title">{report.title}</h3>

          <p className="muted report-list-meta">
            {formatDate(report.createdAt)} · {report.scope || 'Scope N/A'} ·{' '}
            {report.status || 'draft'}
          </p>
        </div>

        <div className="report-panel-icon">
          <FileSearch size={18} />
        </div>
      </div>

      <p className="muted report-summary">
        {report.summary || 'Sin resumen registrado.'}
      </p>

      <div className="report-chip-row">
        <Badge>{report.status || 'draft'}</Badge>
        <Badge>{report.items?.length || 0} items</Badge>
        {!canCreateReport ? <Badge>Solo lectura</Badge> : null}
      </div>

      <div className="report-card-actions">
        <Button variant="secondary" onClick={() => onExport(report)}>
          <Download size={16} />
          Exportar / Imprimir
        </Button>

        <Button variant="secondary" onClick={onOpenSupplier}>
          <Eye size={16} />
          Ver proveedor
        </Button>
      </div>
    </article>
  );
}


function ReportPremiumPanel({ kicker, icon: Icon, title, description, children }) {
  return (
    <section className="report-premium-panel">
      <div className="report-premium-header">
        <div>
          <div className="report-kicker">
            <Icon size={14} />
            {kicker}
          </div>

          <h2>{title}</h2>
          <p className="muted">{description}</p>
        </div>

        <div className="report-premium-icon">
          <Icon size={18} />
        </div>
      </div>

      {children}
    </section>
  );
}

function PremiumReportRow({ label, value }) {
  return (
    <div className="report-premium-row">
      <span>{label}</span>
      <strong>{value || 'N/A'}</strong>
    </div>
  );
}

function PremiumReportMemo({ memo }) {
  return (
    <div className="report-premium-memo">
      <span className={`report-premium-decision ${memo.tone}`.trim()}>
        <ShieldCheck size={13} />
        {memo.decision}
      </span>

      <h3>{memo.title}</h3>
      <p className="muted">{memo.summary}</p>
    </div>
  );
}

function PremiumReportItem({ title, description, tone = '' }) {
  return (
    <div className={`report-premium-item ${tone ? `is-${tone}` : ''}`.trim()}>
      <div className="report-premium-item-icon">
        <ClipboardCheck size={15} />
      </div>

      <div>
        <strong>{title}</strong>
        <p className="muted">{description}</p>
      </div>
    </div>
  );
}

function formatPremiumReportSpend(value) {
  const parsed = Number(value || 0);

  if (!Number.isFinite(parsed)) return 'N/A';

  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(parsed);
}

function buildMultinationalCompliancePack({
  activeSupplier,
  suppliers,
  reports,
  reportItems,
  supplierReports,
  reportSignal
}) {
  const safeSuppliers = Array.isArray(suppliers) ? suppliers : [];
  const safeReports = Array.isArray(reports) ? reports : [];
  const safeReportItems = Array.isArray(reportItems) ? reportItems : [];
  const safeSupplierReports = Array.isArray(supplierReports) ? supplierReports : [];

  const highRiskSuppliers = safeSuppliers.filter((supplier) => {
    const score = Number(supplier?.riskScore || 0);
    return score >= 70;
  });

  const crossBorderSuppliers = safeSuppliers.filter((supplier) => {
    return Boolean(supplier?.country && supplier.country !== 'Sin pais');
  });

  const totalSpend = safeSuppliers.reduce((total, supplier) => {
    return total + Number(supplier?.spend || 0);
  }, 0);

  const activeRiskScore = Number(activeSupplier?.riskScore || 0);
  const activeResilienceScore = Number(activeSupplier?.resilienceScore || 0);

  const decisionTone =
    activeRiskScore >= 75 ? 'hold' : activeRiskScore >= 55 ? 'watch' : '';

  const decision =
    activeRiskScore >= 75
      ? 'Hold external circulation'
      : activeRiskScore >= 55
        ? 'Proceed with validation'
        : 'Controlled reporting posture';

  const memoTitle =
    activeRiskScore >= 75
      ? 'High-exposure supplier report'
      : activeRiskScore >= 55
        ? 'Supplier report requires validation'
        : 'Supplier report ready for executive review';

  const memoSummary =
    activeRiskScore >= 75
      ? 'El proveedor activo presenta exposicion elevada. Antes de circular conclusiones, exige revision humana, evidencias suficientes, mitigantes y validacion documental.'
      : activeRiskScore >= 55
        ? 'El proveedor puede incorporarse a un reporte ejecutivo, pero requiere validacion de evidencias, alertas abiertas y trazabilidad de revision antes de elevarlo a comite.'
        : 'El proveedor muestra una postura razonablemente controlada para reporte ejecutivo, manteniendo revision humana y soporte documental antes de decisiones formales.';

  const redFlags = [
    {
      title: highRiskSuppliers.length > 0 ? 'High-risk supplier exposure' : 'Risk concentration monitored',
      description:
        highRiskSuppliers.length > 0
          ? `${highRiskSuppliers.length} proveedor(es) superan el umbral de riesgo alto. Prioriza revision humana y mitigantes.`
          : 'No se detecta una concentracion critica de proveedores de alto riesgo en la cartera actual.',
      tone: highRiskSuppliers.length > 0 ? 'danger' : ''
    },
    {
      title: safeReportItems.length === 0 ? 'Evidence gap' : 'Evidence coverage available',
      description:
        safeReportItems.length === 0
          ? 'El informe necesita alertas, evidencias o revisiones vinculadas para ser defendible.'
          : `${safeReportItems.length} elemento(s) alimentan el informe actual entre alertas, evidencias y revisiones.`,
      tone: safeReportItems.length === 0 ? 'watch' : ''
    },
    {
      title: safeSupplierReports.length === 0 ? 'No stored report history' : 'Report history retained',
      description:
        safeSupplierReports.length === 0
          ? 'Todavia no existe historial de informes generados para el proveedor activo.'
          : `${safeSupplierReports.length} informe(s) generados para el proveedor activo.`,
      tone: safeSupplierReports.length === 0 ? 'watch' : ''
    }
  ];

  return {
    jurisdictionRows: [
      ['Active supplier', activeSupplier?.name || 'Sin proveedor'],
      ['Country', activeSupplier?.country || 'Sin pais'],
      ['Region', activeSupplier?.region || 'Sin region'],
      ['Tier', activeSupplier?.tier || 'Tier N/A'],
      ['Criticality', activeSupplier?.criticality || 'Media'],
      ['Portfolio suppliers', safeSuppliers.length],
      ['Cross-border suppliers', crossBorderSuppliers.length],
      ['Annual spend base', formatPremiumReportSpend(totalSpend)]
    ],
    controlRows: [
      ['Operational risk score', activeSupplier ? `${activeRiskScore}/100` : 'N/A'],
      ['Operational resilience score', activeSupplier ? `${activeResilienceScore}/100` : 'N/A'],
      ['Report posture', reportSignal?.posture || 'N/A'],
      ['Generated reports', safeReports.length],
      ['Supplier reports', safeSupplierReports.length],
      ['Report items', safeReportItems.length]
    ],
    memo: {
      decision,
      tone: decisionTone,
      title: memoTitle,
      summary: memoSummary
    },
    redFlags
  };
}

function buildDynamicSupplierSummary(supplier, riskLevelLabel, resilienceLevelLabel) {
  if (!supplier) return 'Sin resumen ejecutivo.';

  const riskScore = supplier?.riskScore ?? 0;
  const resilienceScore = supplier?.resilienceScore ?? 0;
  const riskLabel = riskLevelLabel || supplier?.riskLevel?.label || 'no clasificado';
  const resilienceLabel =
    resilienceLevelLabel || supplier?.resilienceLevel?.label || 'no clasificada';

  return `${supplier.name} presenta un nivel de riesgo ${String(riskLabel).toLowerCase()} con un score de ${riskScore}/100 y una resiliencia ${String(resilienceLabel).toLowerCase()} de ${resilienceScore}/100.`;
}

function buildFallbackReportItems(supplier) {
  if (!supplier) return [];

  const now = new Date().toISOString();
  const supplierName = supplier?.name || 'Proveedor';
  const country = supplier?.country || supplier?.jurisdiction || 'jurisdicción pendiente';
  const criticality = supplier?.criticality || 'criticidad pendiente';

  return [
    {
      id: `demo_alert_${supplier?.id || 'supplier'}`,
      type: 'Alert',
      status: 'Open',
      title: 'Jurisdiction and documentation review required',
      date: now,
      description: `${supplierName} requiere validación de jurisdicción, documentación mínima y controles asociados antes de circulación externa.`
    },
    {
      id: `demo_evidence_${supplier?.id || 'supplier'}`,
      type: 'Evidence',
      status: 'Required',
      title: 'Supplier compliance evidence pack',
      date: now,
      description: `Solicitar y vincular evidencias de cumplimiento para ${supplierName}: contratos, certificaciones, políticas, sanciones, país (${country}) y controles documentales.`
    },
    {
      id: `demo_review_${supplier?.id || 'supplier'}`,
      type: 'Review',
      status: 'Pending',
      title: 'Human compliance review',
      date: now,
      description: `Revisión humana pendiente para validar riesgo, criticidad (${criticality}), mitigantes y recomendación ejecutiva.`
    }
  ];
}
export function ComplianceReportPage() {
  const navigate = useNavigate();
  const { pushToast } = useNotifications();
  const { can, isViewer } = useAuth();

  const {
    suppliers,
    alerts,
    evidenceItems,
    reviews,
    reports,
    activeSupplierId,
    setActiveSupplierId,
    createReport
  } = useComplianceStore();

  const safeSuppliers = getSafeArray(suppliers);
  const safeAlerts = getSafeArray(alerts);
  const safeEvidenceItems = getSafeArray(evidenceItems);
  const safeReviews = getSafeArray(reviews);
  const safeReports = getSafeArray(reports);

  const canCreateReport = can(PERMISSIONS.CREATE_REPORT);

  const [selectedSupplierId, setSelectedSupplierId] = useState(
    activeSupplierId || safeSuppliers[0]?.id || ''
  );

  const engine = useComplianceEngine({
    suppliers: safeSuppliers,
    alerts: safeAlerts,
    evidenceItems: safeEvidenceItems,
    reviews: safeReviews,
    activeSupplierId: selectedSupplierId
  });

  const supplierOptions = safeSuppliers.map((supplier) => ({
    label: supplier.name,
    value: supplier.id
  }));

  const supplierReports = useMemo(() => {
    if (!selectedSupplierId) return safeReports;

    return safeReports.filter((report) => report.supplierId === selectedSupplierId);
  }, [safeReports, selectedSupplierId]);

  const activeSupplierAlerts = getSafeArray(engine.activeSupplierAlerts);
  const activeSupplierEvidence = getSafeArray(engine.activeSupplierEvidence);
  const activeSupplierReviews = getSafeArray(engine.activeSupplierReviews);
  const reportItems = getSafeArray(engine.reportItems);

  const reportSignal = getReportSignal({
    supplier: engine.activeSupplier,
    reportItemsCount: reportItems.length,
    evidenceCount: activeSupplierEvidence.length,
    reviewCount: activeSupplierReviews.length,
    reportsCount: supplierReports.length
  });

  const scoreAngle = `${(reportSignal.score ?? 0) * 3.6}deg`;

  function handleSelectSupplier(value) {
    setSelectedSupplierId(value);
    setActiveSupplierId(value);
  }

  function handleOpenSupplier() {
    if (!selectedSupplierId) return;

    setActiveSupplierId(selectedSupplierId);
    navigate(`/compliance/suppliers/${selectedSupplierId}`);
  }

  function buildCurrentReport() {
    if (!engine.activeSupplier) return null;

    const fallbackItems = buildFallbackReportItems(engine.activeSupplier);
    const enrichedReportItems =
      Array.isArray(reportItems) && reportItems.length > 0
        ? reportItems
        : fallbackItems;

    const riskLevelLabel =
      engine.activeSupplier?.riskLevel?.label ||
      engine.activeSupplier?.riskLevel ||
      'no clasificado';

    const resilienceLevelLabel =
      engine.activeSupplier?.resilienceLevel?.label ||
      engine.activeSupplier?.resilienceLevel ||
      'no clasificada';

    const recommendations = buildRecommendations({
      supplier: engine.activeSupplier,
      riskScore: engine.activeSupplier.riskScore,
      resilienceScore: engine.activeSupplier.resilienceScore,
      evidenceSummary: engine.evidenceSummary
    });

    const weightedRiskScore = resolveWeightedRiskScoreForSupplier(
      engine.activeSupplier
    );

    return complianceReportsApi.buildSupplierReport({
      supplier: engine.activeSupplier,
      riskScore: engine.activeSupplier.riskScore,
      resilienceScore: engine.activeSupplier.resilienceScore,
      weightedRiskScore,
      riskLevel: engine.activeSupplier.riskLevel,
      resilienceLevel: engine.activeSupplier.resilienceLevel,
      executiveSummary: buildDynamicSupplierSummary(
        engine.activeSupplier,
        riskLevelLabel,
        resilienceLevelLabel
      ),
      evidenceSummary: {
        ...(engine.evidenceSummary || {}),
        totalEvidence:
          engine.evidenceSummary?.totalEvidence ??
          engine.evidenceSummary?.total ??
          activeSupplierEvidence.length,
        pendingReviews:
          engine.evidenceSummary?.pendingReviews ??
          engine.evidenceSummary?.pending ??
          activeSupplierReviews.filter((review) => {
            const status = String(review?.status || '').toLowerCase();
            return !status || status.includes('pending') || status.includes('open');
          }).length,
        coverageLabel:
          engine.evidenceSummary?.coverageLabel ||
          engine.evidenceSummary?.coverage ||
          (enrichedReportItems.length > 0 ? 'Media' : 'Baja')
      },
      reportItems: enrichedReportItems,
      recommendations
    });
  }

  function handleGenerateReport() {
    if (!canCreateReport) {
      pushToast('No tienes permisos para generar informes');
      return;
    }

    const report = buildCurrentReport();

    if (!report) {
      pushToast('Selecciona un proveedor válido para generar el informe');
      return;
    }

    createReport({
      title: report.title,
      supplierId: report.supplierId,
      supplierName: report.supplierName,
      supplierCountry: report.supplierCountry,
      supplierRegion: report.supplierRegion,
      supplierTier: report.supplierTier,
      supplierCriticality: report.supplierCriticality,
      supplierSpend: report.supplierSpend,
      scope: report.scope,
      summary: report.summary,
      items: report.items,
      recommendations: report.recommendations,
      evidenceSummary: report.evidenceSummary,
      riskScore: report.riskScore,
      resilienceScore: report.resilienceScore,
      ...(report.weightedRiskScore !== null &&
      report.weightedRiskScore !== undefined
        ? { weightedRiskScore: report.weightedRiskScore }
        : {}),
      riskLevel: report.riskLevel,
      resilienceLevel: report.resilienceLevel
    });

    pushToast('Informe generado correctamente');
  }

  function handleExportCurrentReport() {
    if (!canCreateReport) {
      pushToast('No tienes permisos para exportar un informe nuevo');
      return;
    }

    const report = buildCurrentReport();

    if (!report) {
      pushToast('Selecciona un proveedor válido para exportar el informe');
      return;
    }

    complianceReportsApi.exportReport(report);
  }

  function handleExportStoredReport(report) {
    const supplier =
      safeSuppliers.find((item) => item.id === report.supplierId) ||
      engine.activeSupplier;

    const riskLevelLabel =
      supplier?.riskLevel?.label ||
      report.riskLevel ||
      'N/A';

    const resilienceLevelLabel =
      supplier?.resilienceLevel?.label ||
      report.resilienceLevel ||
      'N/A';

    const fallbackItems = buildFallbackReportItems(supplier);
    const enrichedItems =
      Array.isArray(report.items) && report.items.length > 0
        ? report.items
        : fallbackItems;

    const supplierEvidence = safeEvidenceItems.filter(
      (item) => item.supplierId === report.supplierId
    );

    const supplierReviews = safeReviews.filter(
      (item) => item.supplierId === report.supplierId
    );

    const pendingReviews = supplierReviews.filter((review) => {
      const status = String(review?.status || '').toLowerCase();
      return !status || status.includes('pending') || status.includes('open');
    }).length;

    const resolvedWeighted =
      resolveWeightedRiskScoreForSupplier(supplier) ??
      (report.weightedRiskScore !== null &&
      report.weightedRiskScore !== undefined &&
      Number.isFinite(Number(report.weightedRiskScore))
        ? Number(report.weightedRiskScore)
        : null);

    const enrichedReport = {
      ...report,
      supplierName: supplier?.name || report.supplierName || 'Sin proveedor',
      supplierCountry:
        supplier?.country ||
        supplier?.jurisdiction ||
        report.supplierCountry ||
        report.country ||
        'Sin país',
      supplierRegion:
        supplier?.region ||
        report.supplierRegion ||
        report.region ||
        'Sin región',
      supplierTier:
        supplier?.tier ||
        report.supplierTier ||
        report.tier ||
        'Tier N/A',
      supplierCriticality:
        supplier?.criticality ||
        report.supplierCriticality ||
        report.criticality ||
        'N/A',
      supplierSpend:
        supplier?.spend ||
        supplier?.annualSpend ||
        report.supplierSpend ||
        report.spend ||
        0,
      riskScore: report.riskScore ?? supplier?.riskScore ?? 'N/A',
      resilienceScore: report.resilienceScore ?? supplier?.resilienceScore ?? 'N/A',
      riskLevel: riskLevelLabel,
      resilienceLevel: resilienceLevelLabel,
      summary: supplier
        ? buildDynamicSupplierSummary(
            supplier,
            riskLevelLabel,
            resilienceLevelLabel
          )
        : report.summary || 'Sin resumen ejecutivo.',
      evidenceSummary: {
        ...(report.evidenceSummary || {}),
        totalEvidence:
          report.evidenceSummary?.totalEvidence ??
          report.evidenceSummary?.total ??
          supplierEvidence.length,
        pendingReviews:
          report.evidenceSummary?.pendingReviews ??
          report.evidenceSummary?.pending ??
          pendingReviews,
        coverageLabel:
          report.evidenceSummary?.coverageLabel ||
          report.evidenceSummary?.coverage ||
          (enrichedItems.length > 0 ? 'Media' : 'Baja')
      },
      items: enrichedItems,
      recommendations: report.recommendations || [
        'Revisar evidencias disponibles y completar documentación pendiente.',
        'Mantener trazabilidad de decisiones humanas y cambios de estado.',
        'Actualizar scoring cuando existan nuevas alertas o evidencias.',
        'Validar conclusiones con responsable interno antes de circulación externa.'
      ],
      ...(resolvedWeighted !== null ? { weightedRiskScore: resolvedWeighted } : {})
    };

    complianceReportsApi.exportReport(enrichedReport);
  }

  const multinationalPack = buildMultinationalCompliancePack({
    activeSupplier: engine.activeSupplier,
    suppliers: safeSuppliers,
    reports: safeReports,
    reportItems,
    supplierReports,
    reportSignal
  });
  return (
    <div className="page">
      <style>{complianceReportCss}</style>

      <div className="compliance-report-page">
        <section className="report-hero ceos-ws-hero">
          <div className="report-hero-layout">
            <div>
              <div className="report-badge-row">
                <Badge>Compliance & Risk</Badge>
                <Badge>Executive Reports</Badge>
                {isViewer ? <Badge>Modo solo lectura</Badge> : null}
                {canCreateReport ? <Badge>Generación permitida</Badge> : null}
                <Badge>{safeReports.length} informes</Badge>
              </div>

              <h1 className="report-title">
                Compliance Reports.
                <span>Turn evidence into executive decisions.</span>
              </h1>

              <p className="report-copy">
                Generación de informes ejecutivos DSS con proveedor, alertas,
                evidencias, revisión humana y recomendaciones defendibles para
                comité, compliance, legal o dirección.
              </p>

              <div className="report-command-bar">
                <CommandItem
                  label="Selected supplier"
                  value={engine.activeSupplier?.name || 'N/A'}
                />

                <CommandItem
                  label="Generated reports"
                  value={supplierReports.length}
                />

                <CommandItem
                  label="Report posture"
                  value={reportSignal.posture}
                />
              </div>
            </div>

            <aside className="report-signal-card">
              <div className="report-signal-inner">
                <div className="report-signal-top">
                  <div>
                    <div className="kpi-label">Report Signal</div>
                    <div className="report-signal-title">
                      {reportSignal.title}
                    </div>
                  </div>

                  <div className="report-icon-box">
                    <FileText size={21} />
                  </div>
                </div>

                <div className="report-score-module">
                  <div
                    className="report-score-ring"
                    style={{ '--score-angle': scoreAngle }}
                  >
                    <div className="report-score-core">
                      <strong className={reportSignal.score === null ? 'is-empty-score' : ''}>
                        {reportSignal.score === null ? '—' : reportSignal.score}
                      </strong>
                    </div>
                  </div>

                  <div className="report-score-copy">
                    <strong>{reportSignal.posture}</strong>

                    <p className="muted">
                      {reportSignal.description}
                    </p>
                  </div>
                </div>

                <div className="report-signal-table">
                  <SignalRow
                    label="Operational risk score"
                    value={`${engine.activeSupplier?.riskScore ?? 0}/100`}
                  />

                  <SignalRow
                    label="Operational resilience score"
                    value={`${engine.activeSupplier?.resilienceScore ?? 0}/100`}
                  />

                  <SignalRow
                    label="Report items"
                    value={reportItems.length}
                  />

                  <SignalRow
                    label="Evidence"
                    value={activeSupplierEvidence.length}
                  />
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="report-section">
          <SectionHeader
            kicker="Executive overview"
            icon={Activity}
            title="Report readiness at a glance"
            description="Resumen rápido del proveedor activo, riesgo, resiliencia e items disponibles para construir informe."
          />

          <div className="report-grid report-grid-kpis">
            <KpiCard
              label="Proveedor activo"
              value={engine.activeSupplier?.name || 'N/A'}
              description="Base del informe"
              icon={LockKeyhole}
            />

            <KpiCard
              label="Operational risk score"
              value={`${engine.activeSupplier?.riskScore ?? 0}/100`}
              description={engine.activeSupplier?.riskLevel?.label || 'Sin riesgo'}
              icon={Gauge}
              tone={engine.activeSupplier?.riskLevel?.color || ''}
            />

            <KpiCard
              label="Operational resilience score"
              value={`${engine.activeSupplier?.resilienceScore ?? 0}/100`}
              description={engine.activeSupplier?.resilienceLevel?.label || 'Sin datos'}
              icon={ShieldCheck}
              tone={engine.activeSupplier?.resilienceLevel?.color || ''}
            />

            <KpiCard
              label="Items informe"
              value={reportItems.length}
              description="Alertas + evidencias + reviews"
              icon={ClipboardCheck}
            />
          </div>
        </section>

        <section className="report-multinational-grid">
          <ReportPremiumPanel
            kicker="Multinational reporting"
            icon={FileText}
            title="Board Compliance Pack"
            description="Vista ejecutiva multinacional para convertir riesgo, evidencias y revisiones humanas en una decision defendible."
          >
            <div className="report-premium-row-grid">
              {multinationalPack.controlRows.map(([label, value]) => (
                <PremiumReportRow key={label} label={label} value={value} />
              ))}
            </div>
          </ReportPremiumPanel>

          <ReportPremiumPanel
            kicker="Committee posture"
            icon={Sparkles}
            title="Executive Decision Memo"
            description="Lectura tipo comite sobre si el informe puede circular, requiere validacion o debe quedar bloqueado."
          >
            <PremiumReportMemo memo={multinationalPack.memo} />
          </ReportPremiumPanel>
        </section>

        <section className="report-multinational-grid">
          <ReportPremiumPanel
            kicker="Jurisdiction exposure"
            icon={Archive}
            title="Jurisdiction & Supplier Exposure"
            description="Resumen del proveedor activo y de la cartera para contexto multinacional."
          >
            <div className="report-premium-row-grid">
              {multinationalPack.jurisdictionRows.map(([label, value]) => (
                <PremiumReportRow key={label} label={label} value={value} />
              ))}
            </div>
          </ReportPremiumPanel>

          <ReportPremiumPanel
            kicker="Red flags"
            icon={ClipboardCheck}
            title="Red Flags & Mitigants"
            description="Riesgos principales del informe y acciones previas antes de circular conclusiones."
          >
            <div className="report-premium-list">
              {multinationalPack.redFlags.map((item, index) => (
                <PremiumReportItem
                  key={`${item.title}-${index}`}
                  title={item.title}
                  description={item.description}
                  tone={item.tone}
                />
              ))}
            </div>
          </ReportPremiumPanel>
        </section>
        <section className="report-grid report-grid-two">
          <Card className="report-panel">
            <PanelHeader
              kicker="Report builder"
              icon={Plus}
              title="Report Builder"
              description="Selecciona proveedor, revisa el resumen ejecutivo y genera o exporta el informe actual."
            />

            <div className="report-builder-stack">
              <Select
                label="Proveedor"
                value={selectedSupplierId}
                onChange={(e) => handleSelectSupplier(e.target.value)}
                options={
                  supplierOptions.length > 0
                    ? supplierOptions
                    : [{ label: 'Sin proveedores', value: '' }]
                }
              />

              <div className="report-glass-block">
                <div className="row">
                  <ShieldCheck size={18} />

                  <div>
                    <strong>Resumen ejecutivo</strong>

                    <p className="muted report-muted-tight" style={{ marginTop: 8 }}>
                      {engine.executiveSummary}
                    </p>
                  </div>
                </div>
              </div>

              {canCreateReport ? (
                <div className="report-action-row">
                  <Button
                    onClick={handleGenerateReport}
                    disabled={!engine.activeSupplier}
                  >
                    <Plus size={16} />
                    Generar informe
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={handleExportCurrentReport}
                    disabled={!engine.activeSupplier}
                  >
                    <Download size={16} />
                    Exportar actual
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={handleOpenSupplier}
                    disabled={!engine.activeSupplier}
                  >
                    <Eye size={16} />
                    Ver proveedor
                  </Button>
                </div>
              ) : (
                <>
                  <div className="report-empty-wrap">
                    <EmptyState
                      title="Sin permisos para generar informes"
                      description="Tu rol actual permite consultar informes, pero no generar nuevos."
                    />
                  </div>

                  <div className="report-action-row">
                    <Button
                      variant="secondary"
                      onClick={handleOpenSupplier}
                      disabled={!engine.activeSupplier}
                    >
                      <Eye size={16} />
                      Ver proveedor
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>

          <Card className="report-panel">
            <PanelHeader
              kicker="Report content"
              icon={Archive}
              title="Report Content"
              description="Elementos que alimentan el informe ejecutivo del proveedor seleccionado."
            />

            <div className="report-mini-grid">
              <MiniMetric
                label="Alertas proveedor"
                value={activeSupplierAlerts.length}
              />

              <MiniMetric
                label="Evidencias"
                value={activeSupplierEvidence.length}
                tone={activeSupplierEvidence.length > 0 ? 'text-success' : ''}
              />

              <MiniMetric
                label="Reviews"
                value={activeSupplierReviews.length}
              />

              <MiniMetric
                label="Cobertura"
                value={engine.evidenceSummary?.coverageLabel || 'Sin datos'}
              />
            </div>

            <div className="report-glass-block">
              <p className="muted report-muted-tight">
                El reporte funciona como soporte a la decisión: organiza
                evidencia, alertas y revisión humana, pero no sustituye el
                criterio legal o de compliance.
              </p>
            </div>
          </Card>
        </section>

        <section className="report-section">
          <SectionHeader
            kicker="Generated reports"
            icon={FileSearch}
            title="Generated Reports"
            description="Historial de reportes creados para el proveedor seleccionado."
            right={<Badge>{supplierReports.length} resultados</Badge>}
          />

          <Card className="report-list-panel">
            {supplierReports.length === 0 ? (
              <div className="report-empty-wrap">
                <EmptyState
                  title="No hay informes generados"
                  description={
                    canCreateReport
                      ? 'Genera el primer informe de compliance para este proveedor.'
                      : 'No hay informes disponibles para este proveedor.'
                  }
                />
              </div>
            ) : (
              <div className="report-list">
                {supplierReports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    canCreateReport={canCreateReport}
                    onExport={handleExportStoredReport}
                    onOpenSupplier={handleOpenSupplier}
                  />
                ))}
              </div>
            )}
          </Card>
        </section>

        <section className="report-section">
          <SectionHeader
            kicker="Operating loop"
            icon={Layers3}
            title="Report operating base"
            description="El informe conecta proveedor, alertas, evidencias, revisiones y recomendaciones para una decisión defendible."
          />

          <div className="report-grid report-grid-kpis">
            <KpiCard
              label="Proveedores"
              value={safeSuppliers.length}
              description="Base monitorizada"
              icon={ShieldCheck}
            />

            <KpiCard
              label="Alertas"
              value={safeAlerts.length}
              description="Señales disponibles"
              icon={FileSearch}
            />

            <KpiCard
              label="Evidencias"
              value={safeEvidenceItems.length}
              description="Soporte documental"
              icon={CheckCircle2}
            />

            <KpiCard
              label="Estado"
              value={reportSignal.posture}
              description="Postura ejecutiva actual"
              icon={Sparkles}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

