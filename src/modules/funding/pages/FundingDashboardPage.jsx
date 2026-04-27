import React from 'react';
import {
  Download,
  FileText,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { useNotifications } from '../../../app/providers/NotificationsProvider.jsx';
import { useFundingStore } from '../store/fundingStore.jsx';
import { useFundingEngine } from '../engine/useFundingEngine.js';
import { FundingInputPanel } from '../components/FundingInputPanel.jsx';
import { FundingHeroCard } from '../components/FundingHeroCard.jsx';
import { UseOfFundsCard } from '../components/UseOfFundsCard.jsx';
import { ReadinessChecklistCard } from '../components/ReadinessChecklistCard.jsx';
import { fundingExportApi } from '../services/fundingExportApi.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import {
  DEMO_FUNDING_INPUTS,
  DEMO_FUNDING_SETTINGS
} from '../../../shared/config/demoData.js';
import {
  SHOW_DEMO_TOOLS,
  DEMO_BUTTON_LABELS,
  DEMO_RESET_LABELS
} from '../../../shared/config/demoMode.js';

const EMPTY_FUNDING_INPUTS = {
  companyName: '',
  stage: 'Seed',
  currentRevenue: '',
  monthlyBurn: '',
  currentCash: '',
  targetRaise: '',
  preMoneyValuation: '',
  runwayMonthsTarget: '',
  annualGrowthRate: '',
  grossMargin: '',
  dataRoomCompletion: '0',
  founderMarketFit: '0',
  investorInterest: '0',
  teamSize: '',
  hiringPlan: '',
  debtCapacity: '',
  founderOwnership: '',
  existingInvestorOwnership: '',
  optionPool: ''
};

const EMPTY_FUNDING_SETTINGS = {
  reportCurrency: 'EUR',
  scenarioMode: 'balanced'
};

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function calculateReadinessScore(fundingInputs) {
  const dataRoom = toNumber(fundingInputs.dataRoomCompletion);
  const founderMarketFit = toNumber(fundingInputs.founderMarketFit);
  const investorInterest = toNumber(fundingInputs.investorInterest);

  return Math.round((dataRoom + founderMarketFit + investorInterest) / 3);
}

export function FundingDashboardPage() {
  const {
    fundingInputs,
    setFundingInputs,
    fundingSettings,
    setFundingSettings
  } = useFundingStore();

  const { pushToast } = useNotifications();

  const derived = useFundingEngine({
    fundingInputs,
    fundingSettings
  });

  const currentCash = toNumber(fundingInputs.currentCash);
  const targetRaise = toNumber(fundingInputs.targetRaise);
  const monthlyBurn = toNumber(fundingInputs.monthlyBurn);
  const preMoneyValuation = toNumber(fundingInputs.preMoneyValuation);
  const postMoneyValuation = preMoneyValuation + targetRaise;

  const runwayAfterRaise =
    monthlyBurn > 0 ? Math.round((currentCash + targetRaise) / monthlyBurn) : 0;

  const impliedDilution =
    postMoneyValuation > 0
      ? Math.round((targetRaise / postMoneyValuation) * 100)
      : 0;

  const readinessScore = calculateReadinessScore(fundingInputs);

  function updateField(key, value) {
    setFundingInputs((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  function updateSetting(key, value) {
    setFundingSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  }

  function handleLoadDemoFunding() {
    setFundingInputs((prev) => ({
      ...prev,
      ...DEMO_FUNDING_INPUTS
    }));

    setFundingSettings((prev) => ({
      ...prev,
      ...DEMO_FUNDING_SETTINGS
    }));

    pushToast('Demo Funding preparada: Nova Industrial Growth S.L.');
  }

  function handleResetDemoFunding() {
    setFundingInputs({
      ...EMPTY_FUNDING_INPUTS
    });

    setFundingSettings({
      ...EMPTY_FUNDING_SETTINGS
    });

    pushToast('Funding limpiado');
  }

  function handleExport() {
    const ok = fundingExportApi.exportMemo({
      fundingInputs,
      fundingSettings,
      derived
    });

    pushToast(
      ok
        ? 'Funding memo preparado para impresión'
        : 'El navegador ha bloqueado la ventana emergente'
    );
  }

  return (
    <div className="page">
      <div className="page-grid">
        <FundingInputPanel
          fundingInputs={fundingInputs}
          fundingSettings={fundingSettings}
          onFieldChange={updateField}
          onSettingsChange={updateSetting}
        />

        <div className="stack">
          <Card>
            <div className="section-title">
              <div>
                <Badge>Funding Workspace</Badge>

                <h2 style={{ marginTop: 10 }}>Funding Command Center</h2>

                <p className="muted" style={{ marginBottom: 0 }}>
                  Vista ejecutiva del proceso de financiación: capital objetivo,
                  runway, dilución estimada, uso de fondos, readiness inversor y
                  memo exportable.
                </p>
              </div>

              <div className="row wrap">
                {SHOW_DEMO_TOOLS ? (
                  <>
                    <Button onClick={handleLoadDemoFunding} variant="secondary">
                      <Sparkles size={16} />
                      {DEMO_BUTTON_LABELS.funding}
                    </Button>

                    <Button onClick={handleResetDemoFunding} variant="secondary">
                      <RotateCcw size={16} />
                      {DEMO_RESET_LABELS.funding}
                    </Button>
                  </>
                ) : null}

                <Button onClick={handleExport} variant="secondary">
                  <Download size={16} />
                  Exportar memo
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid-4">
            <Card>
              <div className="kpi-label">Capital objetivo</div>
              <div className="kpi-value" style={{ fontSize: 22 }}>
                {formatCurrency(targetRaise, fundingSettings.reportCurrency)}
              </div>
              <p className="muted" style={{ marginBottom: 0 }}>
                Raise principal
              </p>
            </Card>

            <Card>
              <div className="kpi-label">Runway post-raise</div>
              <div className="kpi-value" style={{ fontSize: 22 }}>
                {runwayAfterRaise} meses
              </div>
              <p className="muted" style={{ marginBottom: 0 }}>
                Caja actual + ronda
              </p>
            </Card>

            <Card>
              <div className="kpi-label">Dilución estimada</div>
              <div className="kpi-value" style={{ fontSize: 22 }}>
                {impliedDilution}%
              </div>
              <p className="muted" style={{ marginBottom: 0 }}>
                Sobre post-money
              </p>
            </Card>

            <Card>
              <div className="kpi-label">Investor Readiness</div>
              <div className="kpi-value text-success" style={{ fontSize: 22 }}>
                {readinessScore}/100
              </div>
              <p className="muted" style={{ marginBottom: 0 }}>
                Preparación comercial
              </p>
            </Card>
          </div>

          <FundingHeroCard derived={derived} settings={fundingSettings} />

          <div className="grid-2">
            <UseOfFundsCard
              useOfFunds={derived.useOfFunds}
              currency={fundingSettings.reportCurrency}
            />

            <Card>
              <div className="section-title">
                <div>
                  <h3>Raise Overview</h3>
                  <p className="muted" style={{ marginBottom: 0 }}>
                    Resumen ejecutivo de la ronda y principales argumentos para
                    inversores.
                  </p>
                </div>

                <TrendingUp size={20} />
              </div>

              <p>{derived.summary}</p>

              <ul className="list-compact">
                {derived.thesis.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="grid-2">
            <Card>
              <div className="section-title">
                <div>
                  <h3>Funding Memo</h3>
                  <p className="muted" style={{ marginBottom: 0 }}>
                    Lectura preparada para convertir los datos de financiación en
                    una narrativa clara de inversión.
                  </p>
                </div>

                <FileText size={20} />
              </div>

              <div className="stack">
                <div
                  className="card"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <strong>Post-money valuation</strong>
                  <p className="muted" style={{ marginBottom: 0 }}>
                    {formatCurrency(
                      postMoneyValuation,
                      fundingSettings.reportCurrency
                    )}{' '}
                    estimados tras la ronda.
                  </p>
                </div>

                <div
                  className="card"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <strong>Use of funds</strong>
                  <p className="muted" style={{ marginBottom: 0 }}>
                    Distribución del capital hacia crecimiento, equipo,
                    producto, ventas y reserva operativa.
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="section-title">
                <div>
                  <h3>Investor Readiness</h3>
                  <p className="muted" style={{ marginBottom: 0 }}>
                    Checklist de preparación para salir al mercado con data room,
                    narrativa y señales de tracción.
                  </p>
                </div>

                <Target size={20} />
              </div>

              <ReadinessChecklistCard
                readinessChecklist={derived.readinessChecklist.slice(0, 3)}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}