import React, { useEffect, useRef } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Database,
  Download,
  FileText,
  LockKeyhole,
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
import { DealStructureCard } from '../components/DealStructureCard.jsx';
import { ComparablesGrid } from '../components/ComparablesGrid.jsx';
import { maReportsApi } from '../services/maReportsApi.js';
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

  .ma-action-panel {
    border-radius: 31px;
    padding: 26px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.13), transparent 32%),
      linear-gradient(135deg, rgba(255,255,255,0.064), rgba(255,255,255,0.024)),
      rgba(15, 23, 42, 0.64);
    box-shadow:
      0 24px 70px rgba(0, 0, 0, 0.21),
      inset 0 1px 0 rgba(255,255,255,0.035);
  }

  .ma-action-panel-head {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-items: flex-start;
    margin-bottom: 22px;
  }

  .ma-action-panel h3 {
    margin: 0;
    letter-spacing: -0.04em;
  }

  .ma-action-panel p {
    margin: 10px 0 0;
    line-height: 1.64;
  }

  .ma-action-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: center;
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

  .ma-state-card p {
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

  .ma-analysis-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(320px, 0.72fr);
    gap: 28px;
    align-items: stretch;
  }

  .ma-intelligence-panel {
    height: 100%;
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

  .ma-muted-tight {
    margin-bottom: 0;
  }

  @media (max-width: 1180px) {
    .ma-valuation-hero-inner,
    .ma-valuation-workspace,
    .ma-analysis-grid {
      grid-template-columns: 1fr;
    }

    .ma-valuation-side {
      position: static;
    }
  }

  @media (max-width: 920px) {
    .ma-valuation-command-bar {
      grid-template-columns: 1fr;
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

    .ma-action-panel,
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

  function handleExport() {
    if (!canExportReport) {
      pushToast('No tienes permisos para exportar reportes M&A');
      return;
    }

    maReportsApi.exportExecutiveReport({
      financials,
      settings,
      derived
    });

    pushToast('Reporte ejecutivo preparado para impresión');
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
                  <Button onClick={handleExport} variant="secondary">
                    <Download size={16} />
                    Exportar report
                  </Button>
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
            <section className="ma-action-panel">
              <div className="ma-action-panel-head">
                <div>
                  <div className="ma-kicker">
                    <Sparkles size={14} />
                    Analysis controls
                  </div>

                  <h3>Run, save and export the active deal</h3>

                  <p className="muted">
                    Usa el panel para ejecutar el análisis, guardar el caso y
                    preparar un reporte ejecutivo imprimible.
                  </p>
                </div>

                <div className="ma-valuation-icon-box">
                  <FileText size={20} />
                </div>
              </div>

              <div className="ma-action-grid">
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
                  <Button onClick={handleExport} variant="secondary">
                    <Download size={16} />
                    Exportar report
                  </Button>
                ) : null}

                <Button onClick={handleAnalyze} disabled={!canAnalyze}>
                  <Zap size={16} />
                  {analysis.isAnalyzing ? 'Procesando...' : 'Ejecutar análisis'}
                </Button>
              </div>
            </section>

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

                <section className="ma-analysis-grid">
                  <DealStructureCard derived={derived} />

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
                              beneficios y dependencia operativa antes de
                              avanzar.
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

                              <p className="muted">
                                {item.msg}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </section>
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
      <p className="muted ma-muted-tight">{children}</p>
    </div>
  );
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