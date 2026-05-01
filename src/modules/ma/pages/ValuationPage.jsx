import React, { useEffect, useRef } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap
} from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { ErrorState } from '../../../shared/components/feedback/ErrorState.jsx';
import { ProgressBar } from '../../../shared/components/ui/ProgressBar.jsx';
import {
  PERMISSIONS,
  useAuth
} from '../../../app/providers/AuthProvider.jsx';
import { useNotifications } from '../../../app/providers/NotificationsProvider.jsx';
import { useMAStore } from '../store/maStore.jsx';
import { useValuationEngine } from '../engine/useValuationEngine.js';
import {
  ANALYSIS_STEPS,
  DEFAULT_FINANCIALS,
  DEFAULT_SETTINGS
} from '../engine/valuationFormulas.js';
import { requiredString } from '../../../shared/utils/validators.js';
import { FinancialInputPanel } from '../components/FinancialInputPanel.jsx';
import { EquityHeroCard } from '../components/EquityHeroCard.jsx';
import { ComparablesGrid } from '../components/ComparablesGrid.jsx';
import { MAReportExportButton } from '../components/MAReportExportButton.jsx';
import { DEMO_MA_CASE } from '../../../shared/config/demoData.js';
import {
  SHOW_DEMO_TOOLS,
  DEMO_BUTTON_LABELS,
  DEMO_RESET_LABELS
} from '../../../shared/config/demoMode.js';

const maValuationCss = `
  .ma-valuation-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 34px;
  }

  .ma-valuation-hero {
    position: relative;
    overflow: hidden;
    border-radius: 38px;
    padding: 36px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      radial-gradient(circle at 8% 0%, rgba(37, 99, 235, 0.36), transparent 30%),
      radial-gradient(circle at 86% 8%, rgba(16, 185, 129, 0.18), transparent 28%),
      radial-gradient(circle at 60% 110%, rgba(234, 179, 8, 0.08), transparent 30%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.99), rgba(15, 23, 42, 0.97));
    box-shadow:
      0 38px 120px rgba(0, 0, 0, 0.42),
      inset 0 1px 0 rgba(255, 255, 255, 0.055);
  }

  .ma-valuation-hero::before {
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

  .ma-valuation-hero::after {
    content: "";
    position: absolute;
    inset: auto -190px -210px auto;
    width: 520px;
    height: 520px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.13), transparent 70%);
    pointer-events: none;
  }

  .ma-valuation-hero-inner {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(360px, 0.65fr);
    gap: 34px;
    align-items: stretch;
  }

  .ma-valuation-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 24px;
  }

  .ma-valuation-title {
    margin: 0;
    max-width: 900px;
    font-size: clamp(40px, 4.8vw, 68px);
    line-height: 0.92;
    letter-spacing: -0.07em;
  }

  .ma-valuation-title span {
    display: block;
    margin-top: 8px;
    color: rgba(226, 232, 240, 0.7);
  }

  .ma-valuation-copy {
    max-width: 840px;
    margin: 26px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .ma-valuation-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 32px;
  }

  .ma-valuation-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .ma-valuation-command-item {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.078);
  }

  .ma-valuation-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .ma-valuation-status-card {
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

  .ma-valuation-status-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: radial-gradient(circle at 18% 0%, rgba(96, 165, 250, 0.13), transparent 35%);
    pointer-events: none;
  }

  .ma-valuation-status-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .ma-valuation-status-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .ma-valuation-icon-box {
    flex: 0 0 auto;
    width: 50px;
    height: 50px;
    border-radius: 19px;
    display: grid;
    place-items: center;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .ma-valuation-status-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.16;
    letter-spacing: -0.04em;
  }

  .ma-valuation-status-box {
    border-radius: 25px;
    padding: 20px;
    background: rgba(255,255,255,0.047);
    border: 1px solid rgba(255,255,255,0.085);
  }

  .ma-valuation-status-box strong {
    display: block;
    margin-bottom: 8px;
  }

  .ma-valuation-status-box p {
    margin: 0;
    line-height: 1.62;
  }

  .ma-valuation-status-list {
    display: grid;
    gap: 0;
  }

  .ma-valuation-status-row {
    display: grid;
    grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
    gap: 14px;
    align-items: center;
    padding: 15px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }

  .ma-valuation-status-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .ma-valuation-workspace {
    display: grid;
    grid-template-columns: minmax(330px, 410px) minmax(0, 1fr);
    gap: 30px;
    align-items: start;
  }

  .ma-valuation-side {
    position: sticky;
    top: 108px;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .ma-valuation-main {
    display: flex;
    flex-direction: column;
    gap: 28px;
    min-width: 0;
  }

  .ma-state-card {
    border-radius: 24px;
    padding: 20px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.6);
  }

  .ma-state-card.danger {
    border-color: rgba(239, 68, 68, 0.26);
    background:
      linear-gradient(135deg, rgba(239,68,68,0.11), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.64);
  }

  .ma-state-card.success {
    border-color: rgba(16, 185, 129, 0.26);
    background:
      linear-gradient(135deg, rgba(16,185,129,0.11), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.64);
  }

  .ma-state-card.warning {
    border-color: rgba(245, 158, 11, 0.26);
    background:
      linear-gradient(135deg, rgba(245,158,11,0.11), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.64);
  }

  .ma-state-card-content {
    margin: 0;
    line-height: 1.6;
  }

  .ma-empty-engine {
    min-height: 420px;
    border-radius: 34px;
    padding: 36px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.14), transparent 35%),
      linear-gradient(135deg, rgba(255,255,255,0.064), rgba(255,255,255,0.024)),
      rgba(15, 23, 42, 0.64);
    box-shadow:
      0 24px 70px rgba(0, 0, 0, 0.21),
      inset 0 1px 0 rgba(255,255,255,0.035);
    display: grid;
    place-items: center;
  }

  .ma-empty-inner {
    width: 100%;
    max-width: 650px;
    text-align: center;
  }

  .ma-empty-icon {
    width: 76px;
    height: 76px;
    margin: 0 auto 20px;
    border-radius: 28px;
    display: grid;
    place-items: center;
    background: rgba(37, 99, 235, 0.14);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .ma-empty-inner h2 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .ma-empty-inner p {
    margin: 14px 0 0;
    line-height: 1.7;
  }

  .ma-deal-structure-slot {
    width: 100%;
    min-width: 0;
  }

  .ma-premium-deal-card {
    position: relative;
    overflow: hidden;
    width: 100%;
    min-height: 620px;
    border-radius: 36px;
    padding: 34px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      radial-gradient(circle at 8% 4%, rgba(59, 130, 246, 0.2), transparent 30%),
      radial-gradient(circle at 92% 10%, rgba(16, 185, 129, 0.13), transparent 28%),
      radial-gradient(circle at 50% 120%, rgba(234, 179, 8, 0.08), transparent 34%),
      linear-gradient(135deg, rgba(15, 23, 42, 0.94), rgba(2, 6, 23, 0.96));
    box-shadow:
      0 30px 90px rgba(0, 0, 0, 0.26),
      inset 0 1px 0 rgba(255,255,255,0.045);
  }

  .ma-premium-deal-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255,255,255,0.032) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.032) 1px, transparent 1px);
    background-size: 46px 46px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.82), transparent 86%);
    pointer-events: none;
  }

  .ma-premium-deal-card::after {
    content: "";
    position: absolute;
    right: -130px;
    bottom: -150px;
    width: 360px;
    height: 360px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(37, 99, 235, 0.14), transparent 70%);
    pointer-events: none;
  }

  .ma-premium-deal-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .ma-premium-deal-header {
    display: flex;
    justify-content: space-between;
    gap: 26px;
    align-items: flex-start;
  }

  .ma-premium-deal-header h3 {
    margin: 0;
    font-size: clamp(28px, 3vw, 42px);
    line-height: 1.02;
    letter-spacing: -0.06em;
  }

  .ma-premium-deal-header p {
    max-width: 820px;
    margin: 15px 0 0;
    line-height: 1.7;
  }

  .ma-premium-deal-icon {
    flex: 0 0 auto;
    width: 58px;
    height: 58px;
    border-radius: 22px;
    display: grid;
    place-items: center;
    background: rgba(37, 99, 235, 0.14);
    border: 1px solid rgba(96, 165, 250, 0.26);
    color: #bfdbfe;
    box-shadow: 0 16px 42px rgba(37, 99, 235, 0.14);
  }

  .ma-premium-metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }

  .ma-premium-metric {
    min-height: 142px;
    padding: 20px;
    border-radius: 26px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.025)),
      rgba(15, 23, 42, 0.54);
    border: 1px solid rgba(255,255,255,0.085);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 18px;
  }

  .ma-premium-metric span {
    display: block;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: rgba(148, 163, 184, 0.94);
  }

  .ma-premium-metric strong {
    display: block;
    font-size: clamp(21px, 2vw, 30px);
    line-height: 1.05;
    letter-spacing: -0.055em;
    overflow-wrap: anywhere;
  }

  .ma-premium-metric small {
    display: block;
    line-height: 1.45;
    color: rgba(203, 213, 225, 0.72);
  }

  .ma-closing-structure-box {
    border-radius: 32px;
    padding: 28px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.074), rgba(255,255,255,0.027)),
      rgba(2, 6, 23, 0.38);
    border: 1px solid rgba(255,255,255,0.09);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.04),
      0 22px 60px rgba(0,0,0,0.18);
  }

  .ma-closing-structure-title {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .ma-closing-structure-title h4 {
    margin: 0;
    font-size: 24px;
    line-height: 1.12;
    letter-spacing: -0.045em;
  }

  .ma-closing-structure-title p {
    max-width: 700px;
    margin: 9px 0 0;
    line-height: 1.65;
  }

  .ma-closing-badge {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 14px;
    border-radius: 999px;
    background: rgba(16, 185, 129, 0.11);
    border: 1px solid rgba(16, 185, 129, 0.22);
    color: #bbf7d0;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
  }

  .ma-bridge-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .ma-bridge-row {
    display: grid;
    grid-template-columns: 52px minmax(0, 1fr) minmax(170px, auto);
    gap: 18px;
    align-items: center;
    padding: 20px;
    border-radius: 24px;
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.078);
  }

  .ma-bridge-number {
    width: 52px;
    height: 52px;
    border-radius: 19px;
    display: grid;
    place-items: center;
    background: rgba(37, 99, 235, 0.14);
    border: 1px solid rgba(96, 165, 250, 0.22);
    color: #bfdbfe;
    font-weight: 800;
  }

  .ma-bridge-copy strong {
    display: block;
    margin-bottom: 6px;
    font-size: 16px;
  }

  .ma-bridge-copy p {
    margin: 0;
    line-height: 1.55;
  }

  .ma-bridge-value {
    text-align: right;
  }

  .ma-bridge-value strong {
    display: block;
    font-size: clamp(20px, 2vw, 28px);
    line-height: 1.05;
    letter-spacing: -0.055em;
    overflow-wrap: anywhere;
  }

  .ma-bridge-value span {
    display: block;
    margin-top: 7px;
    font-size: 12px;
    color: rgba(148, 163, 184, 0.9);
  }

  .ma-closing-footer {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    gap: 16px;
    align-items: stretch;
    margin-top: 18px;
  }

  .ma-closing-footer-card {
    border-radius: 24px;
    padding: 20px;
    background: rgba(255,255,255,0.042);
    border: 1px solid rgba(255,255,255,0.078);
  }

  .ma-closing-footer-card strong {
    display: block;
    margin-bottom: 8px;
  }

  .ma-closing-footer-card p {
    margin: 0;
    line-height: 1.58;
  }

  .ma-closing-arrow {
    width: 54px;
    border-radius: 24px;
    display: grid;
    place-items: center;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.075);
    color: rgba(226, 232, 240, 0.78);
  }

  .ma-intelligence-panel {
    width: 100%;
    border-radius: 31px;
    padding: 30px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.064), rgba(255,255,255,0.024)),
      rgba(15, 23, 42, 0.64);
    box-shadow:
      0 24px 70px rgba(0, 0, 0, 0.21),
      inset 0 1px 0 rgba(255,255,255,0.035);
  }

  .ma-panel-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
    margin-bottom: 24px;
  }

  .ma-panel-header h3 {
    margin: 0;
    letter-spacing: -0.04em;
  }

  .ma-panel-header p {
    margin: 11px 0 0;
    line-height: 1.64;
  }

  .ma-panel-icon {
    flex: 0 0 auto;
    width: 46px;
    height: 46px;
    border-radius: 18px;
    display: grid;
    place-items: center;
    background: rgba(255, 255, 255, 0.048);
    border: 1px solid rgba(255, 255, 255, 0.085);
  }

  .ma-kicker {
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

  .ma-inference-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .ma-inference-item {
    display: grid;
    grid-template-columns: 34px minmax(0, 1fr);
    gap: 15px;
    align-items: flex-start;
    padding: 19px;
    border-radius: 22px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.078);
  }

  .ma-inference-icon {
    width: 34px;
    height: 34px;
    border-radius: 15px;
    display: grid;
    place-items: center;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.22);
    color: #86efac;
  }

  .ma-inference-item strong {
    display: block;
    margin-bottom: 7px;
  }

  .ma-inference-item p {
    margin: 0;
    line-height: 1.6;
  }

  @media (max-width: 1180px) {
    .ma-valuation-hero-inner,
    .ma-valuation-workspace {
      grid-template-columns: 1fr;
    }

    .ma-valuation-side {
      position: static;
    }

    .ma-premium-metrics-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 920px) {
    .ma-valuation-command-bar {
      grid-template-columns: 1fr;
    }

    .ma-bridge-row {
      grid-template-columns: 52px minmax(0, 1fr);
    }

    .ma-bridge-value {
      grid-column: 1 / -1;
      text-align: left;
      padding-left: 70px;
    }

    .ma-closing-footer {
      grid-template-columns: 1fr;
    }

    .ma-closing-arrow {
      width: 100%;
      min-height: 52px;
    }
  }

  @media (max-width: 680px) {
    .ma-valuation-page {
      gap: 26px;
    }

    .ma-valuation-hero {
      padding: 26px;
      border-radius: 28px;
    }

    .ma-valuation-status-row {
      grid-template-columns: 1fr;
      gap: 7px;
    }

    .ma-valuation-status-row strong {
      text-align: left;
    }

    .ma-premium-deal-card {
      min-height: auto;
      border-radius: 26px;
      padding: 22px;
    }

    .ma-premium-deal-header,
    .ma-closing-structure-title {
      flex-direction: column;
    }

    .ma-premium-metrics-grid {
      grid-template-columns: 1fr;
    }

    .ma-closing-structure-box {
      border-radius: 24px;
      padding: 20px;
    }

    .ma-bridge-row {
      grid-template-columns: 1fr;
    }

    .ma-bridge-number {
      width: 46px;
      height: 46px;
    }

    .ma-bridge-value {
      padding-left: 0;
    }

    .ma-intelligence-panel {
      border-radius: 24px;
      padding: 24px;
    }

    .ma-empty-engine {
      border-radius: 26px;
      padding: 28px;
    }
  }
`;

function createCaseId() {
  return `case_${Date.now()}_${Math.random().toString(16).slice(2, 9)}`;
}

function buildEmptyFinancials(source) {
  return Object.fromEntries(
    Object.entries(source).map(([key, value]) => {
      if (Array.isArray(value)) return [key, []];
      if (typeof value === 'boolean') return [key, false];
      if (typeof value === 'number') return [key, 0];

      return [key, ''];
    })
  );
}

export function ValuationPage() {
  const { pushToast } = useNotifications();
  const { can, isViewer } = useAuth();
  const analysisRef = useRef(null);

  const {
    financials,
    setFinancials,
    settings,
    setSettings,
    savedCases,
    updateSavedCases,
    backendStatus,
    analysis,
    setAnalysis
  } = useMAStore();

  const canEditCase = can(PERMISSIONS.UPDATE_MA_CASE);
  const canCreateCase = can(PERMISSIONS.CREATE_MA_CASE);
  const canExportReport = can(PERMISSIONS.CREATE_MA_REPORT);

  const derived = useValuationEngine({ financials, settings });

  const safeSavedCases = Array.isArray(savedCases) ? savedCases : [];
  const safeInferences = Array.isArray(derived.inferences)
    ? derived.inferences
    : [];

  const validationErrors = [];

  if (!requiredString(financials.name)) {
    validationErrors.push('La razón social es obligatoria.');
  }

  if (derived.normalizedEbitda <= 0) {
    validationErrors.push('El EBITDA normalizado debe ser mayor que 0.');
  }

  if (!financials.sector) {
    validationErrors.push('Selecciona un sector válido.');
  }

  const canAnalyze = validationErrors.length === 0 && !analysis.isAnalyzing;
  const hasValidationErrors = validationErrors.length > 0;
  const activeCompanyName = financials.name?.trim() || 'Sin target activo';

  useEffect(() => {
    return () => {
      if (analysisRef.current) {
        clearInterval(analysisRef.current);
      }
    };
  }, []);

  function resetAnalysisState(label = 'Valuation Engine listo') {
    if (analysisRef.current) {
      clearInterval(analysisRef.current);
      analysisRef.current = null;
    }

    setAnalysis({
      isAnalyzing: false,
      progress: 100,
      label,
      showResults: true
    });
  }

  function updateField(key, value) {
    if (!canEditCase) {
      pushToast('No tienes permisos para editar el caso M&A');
      return;
    }

    resetAnalysisState();

    setFinancials((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  function updateSetting(key, value) {
    if (!canEditCase) {
      pushToast('No tienes permisos para editar la configuración M&A');
      return;
    }

    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  function handleLoadDemoCase() {
    if (!canEditCase) {
      pushToast('No tienes permisos para cargar la demo M&A');
      return;
    }

    resetAnalysisState('Demo M&A preparada');

    setFinancials({
      ...DEMO_MA_CASE.financials
    });

    setSettings((prev) => ({
      ...prev,
      ...DEMO_MA_CASE.settings
    }));

    pushToast('Demo M&A preparada: NovaTech Industrial Services');
  }

  function handleResetDemoCase() {
    if (!canEditCase) {
      pushToast('No tienes permisos para resetear el caso M&A');
      return;
    }

    if (analysisRef.current) {
      clearInterval(analysisRef.current);
      analysisRef.current = null;
    }

    setFinancials({
      ...buildEmptyFinancials(DEFAULT_FINANCIALS)
    });

    setSettings({
      ...DEFAULT_SETTINGS
    });

    setAnalysis({
      isAnalyzing: false,
      progress: 0,
      label: 'Valuation Engine listo',
      showResults: false
    });

    pushToast('M&A limpiado');
  }

  function handleAnalyze() {
    if (!canAnalyze) return;

    setAnalysis({
      isAnalyzing: true,
      progress: 0,
      label: ANALYSIS_STEPS[0].label,
      showResults: true
    });

    let step = 0;

    if (analysisRef.current) {
      clearInterval(analysisRef.current);
    }

    analysisRef.current = setInterval(() => {
      const current = ANALYSIS_STEPS[step];

      if (!current) {
        clearInterval(analysisRef.current);
        analysisRef.current = null;

        setAnalysis({
          isAnalyzing: false,
          progress: 100,
          label: 'Análisis completado',
          showResults: true
        });

        pushToast('Análisis M&A completado');
        return;
      }

      setAnalysis({
        isAnalyzing: true,
        progress: current.progress,
        label: current.label,
        showResults: true
      });

      step += 1;
    }, 350);
  }

  function handleSaveCase() {
    if (!canCreateCase) {
      pushToast('No tienes permisos para guardar deals');
      return;
    }

    if (validationErrors.length > 0) return;

    const payload = {
      id: createCaseId(),
      name: financials.name.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      financials: { ...financials },
      settings: { ...settings },
      snapshot: {
        equityBase: derived.equityBase,
        evBase: derived.evBase,
        netDebt: derived.netDebt,
        normalizedEbitda: derived.normalizedEbitda,
        qualityScore: derived.qualityScore,
        adjustedMultiple: derived.adjustedMultiple,
        netProceeds: derived.netProceeds,
        riskLevel: derived.riskLevel?.label || ''
      }
    };

    const next = [payload, ...safeSavedCases].slice(0, 20);

    updateSavedCases(next);

    pushToast('Deal guardado y sincronizado');
  }

  return (
    <div className="page">
      <style>{maValuationCss}</style>

      <div className="ma-valuation-page">
        <section className="ma-valuation-hero">
          <div className="ma-valuation-hero-inner">
            <div>
              <div className="ma-valuation-badges">
                <Badge>M&A Valuation</Badge>
                <Badge>Private Workspace</Badge>
                {isViewer ? <Badge>Modo solo lectura</Badge> : null}
                {canEditCase ? <Badge>Edición permitida</Badge> : null}
                {canCreateCase ? <Badge>Guardado permitido</Badge> : null}
                {canExportReport ? <Badge>Exportación permitida</Badge> : null}
              </div>

              <h1 className="ma-valuation-title">
                Valuation Engine.
                <span>Turn financial inputs into executive judgement.</span>
              </h1>

              <p className="ma-valuation-copy">
                Ordena los datos financieros del target, normaliza EBITDA,
                ajusta múltiplos, detecta señales críticas y convierte el
                análisis en una lectura defendible para comité, inversores o
                decisión interna.
              </p>

              <div className="ma-valuation-actions">
                {SHOW_DEMO_TOOLS && canEditCase ? (
                  <>
                    <Button onClick={handleLoadDemoCase} variant="secondary">
                      <Sparkles size={16} />
                      {DEMO_BUTTON_LABELS.ma}
                    </Button>

                    <Button onClick={handleResetDemoCase} variant="secondary">
                      <RotateCcw size={16} />
                      {DEMO_RESET_LABELS.ma}
                    </Button>
                  </>
                ) : null}

                {canCreateCase ? (
                  <Button onClick={handleSaveCase} variant="secondary">
                    <Save size={16} />
                    Guardar deal
                  </Button>
                ) : null}

                {canExportReport ? (
                  <MAReportExportButton
                    financials={financials}
                    settings={settings}
                    derived={derived}
                    disabled={hasValidationErrors}
                    generatedBy="CEO’s OS"
                    organizationName="CEO’s OS"
                    reportStatus="Draft"
                    showPrintButton
                    onExportComplete={pushToast}
                  />
                ) : null}

                <Button onClick={handleAnalyze} disabled={!canAnalyze}>
                  <Zap size={16} />
                  {analysis.isAnalyzing ? 'Procesando...' : 'Ejecutar análisis'}
                </Button>
              </div>

              <div className="ma-valuation-command-bar">
                <CommandItem
                  label="Active target"
                  value={activeCompanyName}
                />

                <CommandItem
                  label="Cases saved"
                  value={safeSavedCases.length}
                />

                <CommandItem
                  label="Engine status"
                  value={getEngineStatusLabel(analysis, hasValidationErrors)}
                />
              </div>
            </div>

            <aside className="ma-valuation-status-card">
              <div className="ma-valuation-status-inner">
                <div className="ma-valuation-status-top">
                  <div>
                    <div className="kpi-label">Executive Readiness</div>
                    <div className="ma-valuation-status-title">
                      {getReadinessTitle({
                        canAnalyze,
                        isAnalyzing: analysis.isAnalyzing,
                        hasValidationErrors
                      })}
                    </div>
                  </div>

                  <div className="ma-valuation-icon-box">
                    <ShieldCheck size={21} />
                  </div>
                </div>

                <div className="ma-valuation-status-box">
                  <strong>
                    {getReadinessHeadline({
                      canAnalyze,
                      isAnalyzing: analysis.isAnalyzing,
                      hasValidationErrors
                    })}
                  </strong>

                  <p className="muted">
                    {getReadinessDescription({
                      canAnalyze,
                      isAnalyzing: analysis.isAnalyzing,
                      hasValidationErrors
                    })}
                  </p>
                </div>

                <div className="ma-valuation-status-list">
                  <StatusRow
                    label="Validation"
                    value={
                      hasValidationErrors
                        ? `${validationErrors.length} pendiente(s)`
                        : 'Ready'
                    }
                  />

                  <StatusRow
                    label="Backend"
                    value={getBackendStatusLabel(backendStatus)}
                  />

                  <StatusRow
                    label="Analysis"
                    value={analysis.label || 'Valuation Engine listo'}
                  />

                  <StatusRow
                    label="Access"
                    value={canEditCase ? 'Editable' : 'Read-only'}
                  />
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="ma-valuation-workspace">
          <aside className="ma-valuation-side">
            <FinancialInputPanel
              financials={financials}
              settings={settings}
              onFieldChange={updateField}
              onSettingsChange={updateSetting}
              disabled={!canEditCase}
              readOnly={!canEditCase}
              isReadOnly={!canEditCase}
            />
          </aside>

          <main className="ma-valuation-main">
            {!canEditCase ? (
              <StateCard>
                Tu rol actual permite consultar y ejecutar el análisis, pero no
                modificar inputs ni guardar cambios.
              </StateCard>
            ) : null}

            {backendStatus?.error ? (
              <StateCard tone="danger">
                Backend no sincronizado. La app sigue funcionando con guardado
                local.
              </StateCard>
            ) : null}

            {backendStatus?.lastSyncAt ? (
              <StateCard tone="success">
                Backend sincronizado:{' '}
                {new Date(backendStatus.lastSyncAt).toLocaleTimeString('es-ES')}
              </StateCard>
            ) : null}

            {analysis.showResults && validationErrors.length > 0 ? (
              <ErrorState message={validationErrors.join(' ')} />
            ) : null}

            {!analysis.showResults ? (
              <section className="ma-empty-engine">
                <div className="ma-empty-inner">
                  <div className="ma-empty-icon">
                    <Activity
                      size={34}
                      className={analysis.isAnalyzing ? 'text-success' : 'muted'}
                    />
                  </div>

                  <h2>
                    {analysis.isAnalyzing
                      ? 'Sincronizando motores...'
                      : 'Valuation Engine listo'}
                  </h2>

                  <p className="muted">
                    {analysis.isAnalyzing
                      ? 'El motor está consolidando métricas, riesgo, múltiplo ajustado y estructura del deal.'
                      : 'Completa los inputs financieros y ejecuta el análisis para generar una lectura ejecutiva del activo.'}
                  </p>

                  {analysis.isAnalyzing ? (
                    <ProgressBar
                      label={analysis.label}
                      value={analysis.progress}
                    />
                  ) : null}
                </div>
              </section>
            ) : (
              <>
                {analysis.isAnalyzing ? (
                  <StateCard tone="warning">
                    <strong>{analysis.label}</strong>
                    <div style={{ marginTop: 14 }}>
                      <ProgressBar
                        label="Progreso del análisis"
                        value={analysis.progress}
                      />
                    </div>
                  </StateCard>
                ) : null}

                <EquityHeroCard derived={derived} settings={settings} />

                <section className="ma-deal-structure-slot">
                  <PremiumDealStructureCard derived={derived} settings={settings} />
                </section>

                <section className="ma-intelligence-panel">
                  <div className="ma-panel-header">
                    <div>
                      <div className="ma-kicker">
                        <Sparkles size={14} />
                        Deal Intelligence
                      </div>

                      <h3>Signals, risks and executive interpretation</h3>

                      <p className="muted">
                        Lectura automática de señales relevantes del deal:
                        calidad del EBITDA, riesgos operativos, concentración,
                        dependencia del dueño y palancas de ajuste.
                      </p>
                    </div>

                    <div className="ma-panel-icon">
                      <TrendingUp size={20} />
                    </div>
                  </div>

                  <div className="ma-inference-list">
                    {safeInferences.length === 0 ? (
                      <div className="ma-inference-item">
                        <div className="ma-inference-icon">
                          <CheckCircle2 size={16} />
                        </div>

                        <div>
                          <strong>No se han detectado red flags relevantes</strong>

                          <p className="muted">
                            La lectura actual no muestra señales críticas,
                            aunque conviene revisar documentación, calidad de
                            beneficios y dependencia operativa antes de avanzar.
                          </p>
                        </div>
                      </div>
                    ) : (
                      safeInferences.map((item, index) => (
                        <div key={index} className="ma-inference-item">
                          <div className="ma-inference-icon">
                            <AlertTriangle size={16} />
                          </div>

                          <div>
                            <strong>{item.type}</strong>

                            <p className="muted">{item.msg}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <ComparablesGrid comparables={derived.comparables} />
              </>
            )}
          </main>
        </section>
      </div>
    </div>
  );
}

function PremiumDealStructureCard({ derived, settings }) {
  const normalizedEbitda = readNumber(derived, ['normalizedEbitda']);
  const adjustedMultiple = readNumber(derived, ['adjustedMultiple']);
  const evBase = readNumber(derived, ['evBase', 'enterpriseValue']);
  const netDebt = readNumber(derived, ['netDebt']);
  const equityBase = readNumber(derived, ['equityBase', 'equityValue']);
  const netProceeds = readNumber(derived, ['netProceeds']);
  const qualityScore = readNumber(derived, ['qualityScore']);
  const riskLabel = derived?.riskLevel?.label || derived?.riskLevel || 'Moderate';

  return (
    <section className="ma-premium-deal-card">
      <div className="ma-premium-deal-inner">
        <div className="ma-premium-deal-header">
          <div>
            <div className="ma-kicker">
              <BarChart3 size={14} />
              Deal Structure
            </div>

            <h3>Estructura de cierre clara, amplia y defendible.</h3>

            <p className="muted">
              Lectura ejecutiva del puente de valor: desde EBITDA normalizado
              hasta Enterprise Value, ajuste por deuda neta, Equity Value y
              caja estimada para el vendedor.
            </p>
          </div>

          <div className="ma-premium-deal-icon">
            <ShieldCheck size={24} />
          </div>
        </div>

        <div className="ma-premium-metrics-grid">
          <MetricBox
            label="EBITDA normalizado"
            value={formatCurrencyValue(normalizedEbitda)}
            hint="Base operativa ajustada"
          />

          <MetricBox
            label="Múltiplo ajustado"
            value={formatMultipleValue(adjustedMultiple)}
            hint="Riesgo, calidad y sector"
          />

          <MetricBox
            label="Quality score"
            value={formatScoreValue(qualityScore)}
            hint="Lectura de calidad del activo"
          />

          <MetricBox
            label="Risk level"
            value={String(riskLabel)}
            hint="Señal ejecutiva de riesgo"
          />
        </div>

        <div className="ma-closing-structure-box">
          <div className="ma-closing-structure-title">
            <div>
              <h4>Estructura de cierre</h4>

              <p className="muted">
                Este cuadro resume el recorrido económico del deal en formato
                comité: valoración de empresa, ajustes de deuda/caja, valor para
                accionistas y proceeds estimados.
              </p>
            </div>

            <div className="ma-closing-badge">
              <CheckCircle2 size={14} />
              Executive view
            </div>
          </div>

          <div className="ma-bridge-list">
            <BridgeRow
              number="01"
              title="Enterprise Value"
              description="Resultado de aplicar el múltiplo ajustado sobre el EBITDA normalizado."
              value={formatCurrencyValue(evBase)}
              meta={`${formatCurrencyValue(normalizedEbitda)} × ${formatMultipleValue(adjustedMultiple)}`}
            />

            <BridgeRow
              number="02"
              title="Ajuste de deuda neta"
              description="Puente entre valor de empresa y valor atribuible al accionista."
              value={formatCurrencyValue(netDebt)}
              meta="Deuda financiera neta / caja"
            />

            <BridgeRow
              number="03"
              title="Equity Value"
              description="Valor estimado de las participaciones después de ajustar deuda y caja."
              value={formatCurrencyValue(equityBase)}
              meta="Base de negociación"
            />

            <BridgeRow
              number="04"
              title="Net proceeds estimados"
              description="Lectura final orientada al vendedor, después de los supuestos económicos del deal."
              value={formatCurrencyValue(netProceeds)}
              meta="Vista cierre"
            />
          </div>

          <div className="ma-closing-footer">
            <div className="ma-closing-footer-card">
              <strong>Uso recomendado</strong>

              <p className="muted">
                Utilizar como resumen principal para explicar la operación a
                comité, comprador, vendedor o inversor.
              </p>
            </div>

            <div className="ma-closing-arrow">
              <ArrowRight size={22} />
            </div>

            <div className="ma-closing-footer-card">
              <strong>Próximo paso</strong>

              <p className="muted">
                Validar deuda, caja, ajustes normalizados, concentración de
                clientes y documentación soporte antes de emitir conclusión.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricBox({ label, value, hint }) {
  return (
    <div className="ma-premium-metric">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <small>{hint}</small>
    </div>
  );
}

function BridgeRow({ number, title, description, value, meta }) {
  return (
    <div className="ma-bridge-row">
      <div className="ma-bridge-number">{number}</div>

      <div className="ma-bridge-copy">
        <strong>{title}</strong>
        <p className="muted">{description}</p>
      </div>

      <div className="ma-bridge-value">
        <strong>{value}</strong>
        <span>{meta}</span>
      </div>
    </div>
  );
}

function CommandItem({ label, value }) {
  return (
    <div className="ma-valuation-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function StatusRow({ label, value }) {
  return (
    <div className="ma-valuation-status-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StateCard({ children, tone = 'neutral' }) {
  const toneClass = tone === 'neutral' ? '' : tone;

  return (
    <div className={`ma-state-card ${toneClass}`.trim()}>
      <div className="muted ma-state-card-content">{children}</div>
    </div>
  );
}

function readNumber(source, keys, fallback = 0) {
  for (const key of keys) {
    const value = source?.[key];
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function formatCurrencyValue(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return '€0';
  }

  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(parsed);
}

function formatMultipleValue(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return '0.0x';
  }

  return `${parsed.toFixed(1)}x`;
}

function formatScoreValue(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return '0%';
  }

  const normalized = parsed <= 1 ? parsed * 100 : parsed;

  return `${Math.round(normalized)}%`;
}

function getBackendStatusLabel(backendStatus) {
  if (backendStatus?.error) return 'Local fallback';
  if (backendStatus?.lastSyncAt) return 'Synced';

  return 'Ready';
}

function getEngineStatusLabel(analysis, hasValidationErrors) {
  if (analysis.isAnalyzing) return 'Processing';
  if (hasValidationErrors) return 'Needs inputs';
  if (analysis.showResults) return 'Results ready';

  return 'Ready';
}

function getReadinessTitle({ canAnalyze, isAnalyzing, hasValidationErrors }) {
  if (isAnalyzing) return 'Analysis in progress';
  if (hasValidationErrors) return 'Inputs required';
  if (canAnalyze) return 'Ready for valuation';

  return 'Valuation Engine ready';
}

function getReadinessHeadline({ canAnalyze, isAnalyzing, hasValidationErrors }) {
  if (isAnalyzing) return 'The engine is processing the active deal.';
  if (hasValidationErrors) return 'Complete the missing inputs before analysis.';
  if (canAnalyze) return 'The active case is ready to be analyzed.';

  return 'Prepare the case before running the engine.';
}

function getReadinessDescription({ canAnalyze, isAnalyzing, hasValidationErrors }) {
  if (isAnalyzing) {
    return 'CEO’s OS está consolidando métricas, riesgo, múltiplo ajustado y estructura del deal.';
  }

  if (hasValidationErrors) {
    return 'El análisis necesita razón social, sector y EBITDA normalizado positivo para generar una lectura ejecutiva sólida.';
  }

  if (canAnalyze) {
    return 'Puedes ejecutar el análisis para convertir los inputs financieros en valoración, señales de riesgo y lectura ejecutiva.';
  }

  return 'Carga los datos financieros del target para activar el motor de valoración.';
}