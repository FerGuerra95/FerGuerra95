import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
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
import { ValuationScenarioFieldVisual } from '../components/ValuationScenarioFieldVisual.jsx';
import {
  ValuationBodyGrid,
  ValuationContextStrip,
  ValuationHero,
  ValuationInputCockpit,
  ValuationMainWorkspace,
  ValuationPageShell,
  ValuationUpperSuite
} from '../components/valuation/ValuationPageLayout.jsx';
import {
  ValuationDealStructurePanel,
  ValuationEvidenceLedgerPanel
} from '../components/valuation/ValuationWorkspacePanels.jsx';
import {
  DEMO_MA_CASE,
  ENTERPRISE_MA_DEMO_CASES
} from '../../../shared/config/demoData.js';
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

  const safeSavedCases = Array.isArray(savedCases) ? savedCases : [];
  const safeInferences = Array.isArray(derived.inferences)
    ? derived.inferences
    : [];

  const validationErrors = [];

  if (!requiredString(financials.name)) {
    validationErrors.push('Legal name is required.');
  }

  if (derived.normalizedEbitda <= 0) {
    validationErrors.push('Normalized EBITDA must be greater than 0.');
  }

  if (!financials.sector) {
    validationErrors.push('Select a valid sector.');
  }

  const canAnalyze = validationErrors.length === 0 && !analysis.isAnalyzing;
  const hasValidationErrors = validationErrors.length > 0;
  const activeCompanyName = financials.name?.trim() || 'No active target';

  useEffect(() => {
    return () => {
      if (analysisRef.current) {
        clearInterval(analysisRef.current);
      }
    };
  }, []);

  function resetAnalysisState(label = 'Valoración lista') {
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
      pushToast('You do not have permission to edit the M&A case');
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
      pushToast('You do not have permission to edit M&A settings');
      return;
    }

    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  function handleLoadDemoCase() {
    if (!canEditCase) {
      pushToast('You do not have permission to load the M&A case');
      return;
    }

    const primaryCase = ENTERPRISE_MA_DEMO_CASES[0] || DEMO_MA_CASE;
    const demoCaseIds = new Set(
      ENTERPRISE_MA_DEMO_CASES.map((item) => item.id)
    );
    const preparedCases = ENTERPRISE_MA_DEMO_CASES.map((item) => ({
      ...item,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    const remainingCases = safeSavedCases.filter(
      (item) => !demoCaseIds.has(item.id)
    );

    resetAnalysisState('M&A case prepared');

    setFinancials({
      ...primaryCase.financials
    });

    setSettings((prev) => ({
      ...prev,
      ...primaryCase.settings
    }));

    updateSavedCases([...preparedCases, ...remainingCases].slice(0, 20));

    pushToast('3 enterprise M&A cases prepared');
  }

  function handleResetDemoCase() {
    if (!canEditCase) {
      pushToast('You do not have permission to reset the M&A case');
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
      label: 'Valoración lista',
      showResults: false
    });

    pushToast('M&A workspace cleared');
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

        pushToast('M&A analysis complete');
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
      pushToast('You do not have permission to save deals');
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

    pushToast('Deal saved and synced');
  }

  const showOperationalAlerts =
    !canEditCase ||
    Boolean(backendStatus?.error) ||
    Boolean(backendStatus?.lastSyncAt) ||
    (analysis.showResults && validationErrors.length > 0);

  return (
    <div className="page">
      <ValuationPageShell>
        <div className="ma-valuation-nav-crumb">
          <Link to="/ma/dashboard" className="ma-val-ref-cta-ghost">
            Back to dashboard
          </Link>
        </div>

        <ValuationUpperSuite>
        <ValuationHero>
            <div className="ma-val-ref-scene-atmo" aria-hidden="true">
              <div className="ma-val-ref-scene-glow" />
              <div className="ma-val-ref-scene-mesh" />
              <div className="ma-val-ref-scene-stage">
                <ValuationScenarioFieldVisual />
              </div>
            </div>

            <div className="ma-val-ref-scene-layout">
              <div className="ma-val-ref-scene-intro">
                <div className="ma-valuation-badges">
                  {isViewer ? <Badge>Read-only mode</Badge> : null}
                  {canEditCase ? <Badge>Editing enabled</Badge> : null}
                  {canCreateCase ? <Badge>Saving enabled</Badge> : null}
                  {canExportReport ? <Badge>Export enabled</Badge> : null}
                </div>

                <p className="ma-val-ref-kicker">
                  Private M&A Valuation Cockpit{isViewer ? ' · Read-only' : ''}
                </p>

                <h1 id="ma-valuation-title" className="ma-val-ref-title">
                  <span className="ma-val-ref-title-line">Private M&A</span>
                  <span className="ma-val-ref-title-line">Valuation.</span>
                </h1>

                <p className="ma-val-ref-subtitle">
                  Turn financial inputs into executive judgement.
                </p>

                <p className="ma-val-ref-lead muted">
                  Organize target financials, normalize EBITDA, adjust multiples and
                  convert the analysis into a defensible read for committee, investors
                  or internal decision-making.
                </p>

                <p className="ma-val-ref-dss muted">
                  Decision support only · Human review required · Not investment advice · Not a fairness opinion
                </p>

                <div className="ma-valuation-actions">
                  <Button onClick={handleAnalyze} disabled={!canAnalyze}>
                    <Zap size={16} />
                    {analysis.isAnalyzing ? 'Processing...' : 'Update valuation'}
                  </Button>

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
                      Save deal
                    </Button>
                  ) : null}

                  {canExportReport ? (
                    <MAReportExportButton
                      financials={financials}
                      settings={settings}
                      derived={derived}
                      disabled={hasValidationErrors}
                      generatedBy="CEO's OS"
                      organizationName="CEO's OS"
                      reportStatus="Draft"
                      showPrintButton
                      showSecureShareButton
                      onExportComplete={pushToast}
                    />
                  ) : null}
                </div>
              </div>

              <aside className="ma-valuation-status-card ma-valuation-surface" aria-label="Executive readiness">
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
                        ? `${validationErrors.length} pending`
                        : 'Ready'
                    }
                  />

                  <StatusRow
                    label="Backend"
                    value={getBackendStatusLabel(backendStatus)}
                  />

                  <StatusRow
                    label="Analysis"
                    value={formatAnalysisDisplayLabel(analysis.label)}
                  />

                  <StatusRow
                    label="Access"
                    value={canEditCase ? 'Editable' : 'Read-only'}
                  />
                </div>
              </div>
            </aside>
            </div>
          </ValuationHero>

          <ValuationContextStrip>
            <div className="ma-valuation-command-bar ma-valuation-command-strip ma-valuation-surface" aria-label="Active case strip">
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

            {showOperationalAlerts ? (
              <div className="ma-valuation-alerts" aria-label="Operational alerts">
                {!canEditCase ? (
                  <StateCard>
                    Your role allows viewing and running analysis, but not editing
                    inputs or saving changes.
                  </StateCard>
                ) : null}

                {backendStatus?.error ? (
                  <StateCard tone="danger">
                    Backend not synced. The app continues with local persistence.
                  </StateCard>
                ) : null}

                {backendStatus?.lastSyncAt ? (
                  <StateCard tone="success">
                    Backend synced:{' '}
                    {new Date(backendStatus.lastSyncAt).toLocaleTimeString('en-GB')}
                  </StateCard>
                ) : null}

                {analysis.showResults && validationErrors.length > 0 ? (
                  <ErrorState message={validationErrors.join(' ')} />
                ) : null}
              </div>
            ) : null}

            {analysis.showResults && analysis.isAnalyzing ? (
              <div className="ma-valuation-progress" aria-live="polite">
                <StateCard tone="warning">
                  <strong>{formatAnalysisDisplayLabel(analysis.label)}</strong>
                  <div style={{ marginTop: 14 }}>
                    <ProgressBar
                      label="Analysis progress"
                      value={analysis.progress}
                    />
                  </div>
                </StateCard>
              </div>
            ) : null}
        </ValuationContextStrip>
        </ValuationUpperSuite>

        <ValuationBodyGrid>
          <ValuationInputCockpit>
            <FinancialInputPanel
              financials={financials}
              settings={settings}
              onFieldChange={updateField}
              onSettingsChange={updateSetting}
              disabled={!canEditCase}
              readOnly={!canEditCase}
              isReadOnly={!canEditCase}
            />
          </ValuationInputCockpit>

          <ValuationMainWorkspace>
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
                      ? 'Updating valuation...'
                      : 'Valuation ready'}
                  </h2>

                  <p className="muted">
                    {analysis.isAnalyzing
                      ? "The engine is consolidating metrics, risk, adjusted multiple and deal structure."
                      : 'Load sufficient financial information to activate the executive asset read.'}
                  </p>

                  {analysis.isAnalyzing ? (
                    <ProgressBar
                      label={formatAnalysisDisplayLabel(analysis.label)}
                      value={analysis.progress}
                    />
                  ) : null}
                </div>
              </section>
            ) : (
              <>
                <EquityHeroCard derived={derived} settings={settings} />

                <section className="ma-deal-structure-slot">
                  <ValuationDealStructurePanel derived={derived} settings={settings} />
                </section>

                <section className="ma-intelligence-panel ma-valuation-surface">
                  <div className="ma-panel-header">
                    <div>
                      <div className="ma-kicker">
                        <Sparkles size={14} />
                        Deal Intelligence
                      </div>

                      <h3>Signals, risks and executive interpretation</h3>

                      <p className="muted">
                        Automatic read of relevant deal signals: EBITDA quality,
                        operating risks, concentration, owner dependency and adjustment
                        levers.
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

                        <div className="ma-inference-body">
                          <strong>No relevant red flags detected</strong>

                          <p className="muted">
                            The current read shows no critical signals, although
                            documentation, earnings quality and operating dependency
                            should be reviewed before advancing.
                          </p>
                        </div>
                      </div>
                    ) : (
                      safeInferences.map((item, index) => (
                        <div key={index} className="ma-inference-item">
                          <div className="ma-inference-icon">
                            <AlertTriangle size={16} />
                          </div>

                          <div className="ma-inference-body">
                            <strong>{item.type}</strong>

                            <p className="muted">{item.msg}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <ValuationEvidenceLedgerPanel derived={derived} />

                <ComparablesGrid
                  comparables={derived.comparables}
                  selectedMultiple={derived.adjustedMultiple}
                />
              </>
            )}
          </ValuationMainWorkspace>
        </ValuationBodyGrid>
      </ValuationPageShell>
    </div>
  );
}

function CommandItem({ label, value }) {
  return (
    <div className="ma-valuation-strip-cell">
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

function formatAnalysisDisplayLabel(label) {
  const displayMap = {
    'Valoración lista': 'Results ready',
    'Listo para auditoría': 'Ready for audit',
    'Análisis completado': 'Analysis complete',
    'Caso M&A preparado': 'M&A case prepared',
    'Ingestando metricas financieras y normalizando...': 'Ingesting financial metrics and normalizing...',
    'Ajustando Deuda Neta y Working Capital...': 'Adjusting net debt and working capital...',
    'Auditando riesgo operativo y resiliencia...': 'Auditing operating risk and resilience...',
    'Proyectando Cap Table y Waterfall...': 'Projecting cap table and waterfall...',
    'Construyendo salida ejecutiva del deal...': 'Building executive deal output...',
    'Analisis completado': 'Analysis complete'
  };

  if (!label) return 'Results ready';

  return displayMap[label] || label;
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

  return 'Valuation ready';
}

function getReadinessHeadline({ canAnalyze, isAnalyzing, hasValidationErrors }) {
  if (isAnalyzing) return 'The engine is processing the active deal.';
  if (hasValidationErrors) return 'Complete the missing inputs before analysis.';
  if (canAnalyze) return 'The active case is ready to be analyzed.';

  return 'Prepare the case before running the engine.';
}

function getReadinessDescription({ canAnalyze, isAnalyzing, hasValidationErrors }) {
  if (isAnalyzing) {
    return "CEO's OS is consolidating metrics, risk, adjusted multiple and deal structure.";
  }

  if (hasValidationErrors) {
    return 'Analysis requires legal name, sector and positive normalized EBITDA for a solid executive read.';
  }

  if (canAnalyze) {
    return 'You can run analysis to convert financial inputs into valuation, risk signals and executive read.';
  }

  return 'Load target financial data to activate the valuation engine.';
}
