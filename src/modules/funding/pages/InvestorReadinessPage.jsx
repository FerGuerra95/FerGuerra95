import React from 'react';
import { CheckCircle2, FileText, Target, TrendingUp, Users } from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { useFundingStore } from '../store/fundingStore.jsx';
import { useFundingEngine } from '../engine/useFundingEngine.js';
import { ReadinessChecklistCard } from '../components/ReadinessChecklistCard.jsx';

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatMoney(value, currency = 'EUR') {
  const safeValue = toNumber(value);

  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(safeValue);
}

function calculateReadinessScore(fundingInputs) {
  const dataRoom = toNumber(fundingInputs.dataRoomCompletion);
  const founderMarketFit = toNumber(fundingInputs.founderMarketFit);
  const investorInterest = toNumber(fundingInputs.investorInterest);

  return Math.round((dataRoom + founderMarketFit + investorInterest) / 3);
}

function getReadinessLevel(score) {
  if (score >= 80) {
    return {
      label: 'Alta',
      color: 'text-success',
      description:
        'La compañía presenta una preparación sólida para iniciar conversaciones con inversores.'
    };
  }

  if (score >= 60) {
    return {
      label: 'Media',
      color: 'text-warning',
      description:
        'La compañía puede iniciar preparación comercial, pero conviene reforzar data room, narrativa y señales de tracción.'
    };
  }

  return {
    label: 'Baja',
    color: 'text-danger',
    description:
      'Conviene completar documentación, narrativa y señales de tracción antes de salir al mercado.'
  };
}

function getReadinessSignal(score) {
  if (score >= 80) {
    return {
      title: 'Investor-ready profile',
      posture: 'Start outreach',
      description:
        'El caso muestra un nivel alto de preparación para abrir conversaciones con inversores.'
    };
  }

  if (score >= 60) {
    return {
      title: 'Qualified but improvable',
      posture: 'Refine materials',
      description:
        'La base es suficiente, pero hay margen para reforzar data room, narrativa y señales de mercado.'
    };
  }

  if (score >= 40) {
    return {
      title: 'Readiness in progress',
      posture: 'Build proof points',
      description:
        'Antes de salir al mercado conviene mejorar documentación, tracción y credibilidad del caso.'
    };
  }

  return {
    title: 'Not ready for market',
    posture: 'Delay outreach',
    description:
      'La compañía necesita preparar mejor la base documental y comercial antes de hablar con inversores.'
  };
}

function KpiCard({ label, value, description, color = '' }) {
  return (
    <Card>
      <div className="kpi-label">{label}</div>

      <div className={`kpi-value ${color}`.trim()} style={{ fontSize: 22 }}>
        {value}
      </div>

      <p className="muted" style={{ marginBottom: 0 }}>
        {description}
      </p>
    </Card>
  );
}

function InfoBlock({ title, text }) {
  return (
    <div
      className="card"
      style={{
        background: 'rgba(255,255,255,0.04)'
      }}
    >
      <strong>{title}</strong>

      <p className="muted" style={{ marginBottom: 0, marginTop: 8 }}>
        {text}
      </p>
    </div>
  );
}

function ThesisList({ items }) {
  if (!items || items.length === 0) {
    return (
      <p className="muted">
        Completa los inputs de financiación para generar una tesis de inversión.
      </p>
    );
  }

  return (
    <ul className="list-compact">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

function InvestorTargetCard({ target }) {
  return (
    <div
      className="card"
      style={{
        padding: 14,
        background: 'rgba(255,255,255,0.04)'
      }}
    >
      <div className="section-title">
        <strong>{target.type}</strong>
        <span className="badge">{target.fit}% fit</span>
      </div>

      <p className="muted" style={{ marginBottom: 0 }}>
        {target.desc}
      </p>
    </div>
  );
}

export function InvestorReadinessPage() {
  const { fundingInputs, fundingSettings } = useFundingStore();

  const derived = useFundingEngine({
    fundingInputs,
    fundingSettings
  });

  const readinessChecklist = Array.isArray(derived.readinessChecklist)
    ? derived.readinessChecklist
    : [];

  const investorTargets = Array.isArray(derived.investorTargets)
    ? derived.investorTargets
    : [];

  const thesisItems = Array.isArray(derived.thesis) ? derived.thesis : [];

  const readinessScore = calculateReadinessScore(fundingInputs);
  const readinessLevel = getReadinessLevel(readinessScore);
  const readinessSignal = getReadinessSignal(readinessScore);

  const dataRoomCompletion = toNumber(fundingInputs.dataRoomCompletion);
  const founderMarketFit = toNumber(fundingInputs.founderMarketFit);
  const investorInterest = toNumber(fundingInputs.investorInterest);
  const targetRaise = toNumber(fundingInputs.targetRaise);

  const companyName = fundingInputs?.companyName?.trim() || 'Sin compañía activa';
  const stage = fundingInputs?.stage || 'Seed';
  const currency = fundingSettings?.reportCurrency || 'EUR';

  return (
    <div className="page">
      <Card light>
        <div className="section-title">
          <div>
            <div className="row wrap">
              <Badge>Funding Workspace</Badge>
              <Badge>Investor Readiness</Badge>
              <Badge>{stage}</Badge>
              <Badge>{readinessLevel.label}</Badge>
            </div>

            <h2 style={{ marginTop: 10 }}>Investor Readiness</h2>

            <p className="muted" style={{ marginBottom: 0 }}>
              Evaluación ejecutiva de preparación para inversores: data room,
              encaje fundador-mercado, interés inversor, narrativa y checklist
              de salida al mercado.
            </p>
          </div>

          <Target size={22} />
        </div>
      </Card>

      <div className="grid-4">
        <KpiCard
          label="Compañía"
          value={companyName}
          description="Caso activo"
        />

        <KpiCard
          label="Capital objetivo"
          value={formatMoney(targetRaise, currency)}
          description="Ronda prevista"
        />

        <KpiCard
          label="Readiness Score"
          value={`${readinessScore}/100`}
          description={`Preparación ${readinessLevel.label}`}
          color={readinessLevel.color}
        />

        <KpiCard
          label="Postura"
          value={readinessSignal.posture}
          description="Siguiente acción"
        />
      </div>

      <div className="grid-4">
        <KpiCard
          label="Data Room"
          value={`${dataRoomCompletion}%`}
          description="Documentación preparada"
        />

        <KpiCard
          label="Founder-Market Fit"
          value={`${founderMarketFit}%`}
          description="Credibilidad del equipo"
        />

        <KpiCard
          label="Investor Interest"
          value={`${investorInterest}%`}
          description="Señales de mercado"
        />

        <KpiCard
          label="Investor Targets"
          value={investorTargets.length}
          description="Perfiles generados"
        />
      </div>

      <div className="grid-2">
        <Card>
          <div className="section-title">
            <div>
              <h3>Readiness Assessment</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Lectura ejecutiva del estado actual antes de iniciar
                conversaciones formales.
              </p>
            </div>

            <CheckCircle2 size={20} />
          </div>

          <p>{readinessLevel.description}</p>

          <div className="stack">
            <InfoBlock
              title="Data room readiness"
              text="El inversor debe poder revisar métricas, documentación societaria, equipo, finanzas, producto, clientes y plan de uso de fondos sin fricción."
            />

            <InfoBlock
              title="Market narrative"
              text="La ronda debe explicarse con una narrativa clara: problema, solución, tracción, equipo, mercado, capital necesario y retorno esperado."
            />

            <InfoBlock
              title="Readiness signal"
              text={readinessSignal.description}
            />
          </div>
        </Card>

        <Card>
          <div className="section-title">
            <div>
              <h3>Market Narrative</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Tesis de financiación basada en los inputs actuales.
              </p>
            </div>

            <TrendingUp size={20} />
          </div>

          <p>{derived.summary}</p>

          <ThesisList items={thesisItems} />
        </Card>
      </div>

      <div className="grid-2">
        <Card>
          <div className="section-title">
            <div>
              <h3>Execution Checklist</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Checklist operativo para preparar la salida al mercado.
              </p>
            </div>

            <FileText size={20} />
          </div>

          <ReadinessChecklistCard readinessChecklist={readinessChecklist} />
        </Card>

        <Card>
          <div className="section-title">
            <div>
              <h3>Target Investor Fit</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Perfiles de inversor más adecuados según fase, tracción,
                capital objetivo y narrativa.
              </p>
            </div>

            <Users size={20} />
          </div>

          {investorTargets.length === 0 ? (
            <p className="muted">
              Completa los inputs de financiación para generar perfiles de
              inversor.
            </p>
          ) : (
            <div className="stack">
              {investorTargets.map((target) => (
                <InvestorTargetCard key={target.type} target={target} />
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <div className="section-title">
          <div>
            <h3>Investor Preparation Notes</h3>
            <p className="muted" style={{ marginBottom: 0 }}>
              Puntos que conviene reforzar antes de enviar materiales o abrir
              conversaciones.
            </p>
          </div>

          <Badge>{stage}</Badge>
        </div>

        <div className="grid-3">
          <InfoBlock
            title="1. Claridad del uso de fondos"
            text="Explicar cómo el capital se transforma en crecimiento, producto, ventas, equipo o runway adicional."
          />

          <InfoBlock
            title="2. Prueba de tracción"
            text="Preparar métricas, clientes, pipeline, crecimiento, margen y señales que justifiquen la valoración."
          />

          <InfoBlock
            title="3. Riesgo y mitigación"
            text="Anticipar objeciones sobre burn, competencia, dependencia de clientes, equipo o ejecución."
          />
        </div>
      </Card>
    </div>
  );
}