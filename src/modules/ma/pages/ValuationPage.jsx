import React, { useEffect, useRef } from 'react';
import {
  Activity,
  Download,
  RotateCcw,
  Save,
  Sparkles,
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

    const next = [payload, ...savedCases].slice(0, 20);

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
      <div className="row wrap" style={{ marginBottom: 16 }}>
        {isViewer ? <Badge>Modo solo lectura</Badge> : null}
        {canEditCase ? <Badge>Edición M&A permitida</Badge> : null}
        {canCreateCase ? <Badge>Guardado permitido</Badge> : null}
        {canExportReport ? <Badge>Exportación permitida</Badge> : null}
      </div>

      <div className="page-grid">
        <FinancialInputPanel
          financials={financials}
          settings={settings}
          onFieldChange={updateField}
          onSettingsChange={updateSetting}
          disabled={!canEditCase}
          readOnly={!canEditCase}
          isReadOnly={!canEditCase}
        />

        <div className="stack">
          <div className="row wrap">
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
                Exportar PDF
              </Button>
            ) : null}

            <Button onClick={handleAnalyze} disabled={!canAnalyze}>
              <Zap size={16} />
              {analysis.isAnalyzing ? 'Procesando...' : 'Ejecutar análisis'}
            </Button>
          </div>

          {!canEditCase ? (
            <div
              className="card"
              style={{
                background: 'rgba(255,255,255,0.04)'
              }}
            >
              <p className="muted" style={{ marginBottom: 0 }}>
                Tu rol actual permite consultar y ejecutar el análisis, pero no
                modificar inputs ni guardar cambios.
              </p>
            </div>
          ) : null}

          {backendStatus?.error ? (
            <div
              className="card"
              style={{
                background: 'rgba(239,68,68,0.08)'
              }}
            >
              <p className="muted" style={{ marginBottom: 0 }}>
                Backend no sincronizado. La app sigue funcionando con guardado local.
              </p>
            </div>
          ) : null}

          {backendStatus?.lastSyncAt ? (
            <div
              className="card"
              style={{
                background: 'rgba(16,185,129,0.08)'
              }}
            >
              <p className="muted" style={{ marginBottom: 0 }}>
                Backend sincronizado:{' '}
                {new Date(backendStatus.lastSyncAt).toLocaleTimeString('es-ES')}
              </p>
            </div>
          ) : null}

          {analysis.showResults && validationErrors.length > 0 ? (
            <ErrorState message={validationErrors.join(' ')} />
          ) : null}

          {!analysis.showResults ? (
            <div
              className="card"
              style={{
                minHeight: 320,
                display: 'grid',
                placeItems: 'center'
              }}
            >
              <div
                style={{
                  width: '100%',
                  maxWidth: 560,
                  textAlign: 'center'
                }}
              >
                <Activity
                  size={56}
                  className={analysis.isAnalyzing ? 'text-success' : 'muted'}
                />

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
                  <ProgressBar label={analysis.label} value={analysis.progress} />
                ) : null}
              </div>
            </div>
          ) : (
            <>
              <EquityHeroCard derived={derived} settings={settings} />

              <div className="grid-2">
                <DealStructureCard derived={derived} />

                <div className="card">
                  <h3>Deal Intelligence</h3>

                  <p className="muted">
                    Lectura automática de señales relevantes del deal: calidad
                    del EBITDA, riesgos operativos, concentración, dependencia
                    del dueño y palancas de ajuste.
                  </p>

                  <div className="stack">
                    {derived.inferences.length === 0 ? (
                      <p className="muted">
                        No se han detectado red flags relevantes.
                      </p>
                    ) : (
                      derived.inferences.map((item, index) => (
                        <div
                          key={index}
                          className="card"
                          style={{
                            padding: 14,
                            background: 'rgba(255,255,255,0.04)'
                          }}
                        >
                          <strong>{item.type}</strong>
                          <p className="muted" style={{ marginBottom: 0 }}>
                            {item.msg}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <ComparablesGrid comparables={derived.comparables} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}