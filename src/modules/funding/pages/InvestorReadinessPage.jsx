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

export function InvestorReadinessPage() {
  const { fundingInputs, fundingSettings } = useFundingStore();

  const derived = useFundingEngine({
    fundingInputs,
    fundingSettings
  });

  const readinessChecklist = derived.readinessChecklist || [];
  const investorTargets = derived.investorTargets || [];

  const readinessScore = calculateReadinessScore(fundingInputs);
  const readinessLevel = getReadinessLevel(readinessScore);

  return (
    <div className="page">
      <Card>
        <div className="section-title">
          <div>
            <Badge>Funding Workspace</Badge>

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
        <Card>
          <div className="kpi-label">Readiness Score</div>
          <div className={`kpi-value ${readinessLevel.color}`} style={{ fontSize: 22 }}>
            {readinessScore}/100
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Preparación {readinessLevel.label}
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Data Room</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {toNumber(fundingInputs.dataRoomCompletion)}%
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Documentación preparada
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Founder-Market Fit</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {toNumber(fundingInputs.founderMarketFit)}%
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Credibilidad del equipo
          </p>
        </Card>

        <Card>
          <div className="kpi-label">Investor Interest</div>
          <div className="kpi-value" style={{ fontSize: 22 }}>
            {toNumber(fundingInputs.investorInterest)}%
          </div>
          <p className="muted" style={{ marginBottom: 0 }}>
            Señales de mercado
          </p>
        </Card>
      </div>

      <div className="grid-2">
        <Card>
          <div className="section-title">
            <div>
              <h3>Readiness Assessment</h3>
              <p className="muted" style={{ marginBottom: 0 }}>
                Lectura ejecutiva del estado actual antes de iniciar conversaciones formales.
              </p>
            </div>

            <CheckCircle2 size={20} />
          </div>

          <p>{readinessLevel.description}</p>

          <div className="stack">
            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <strong>Data room readiness</strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                El inversor debe poder revisar métricas, documentación societaria,
                equipo, finanzas, producto, clientes y plan de uso de fondos sin fricción.
              </p>
            </div>

            <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <strong>Market narrative</strong>
              <p className="muted" style={{ marginBottom: 0 }}>
                La ronda debe explicarse con una narrativa clara: problema,
                solución, tracción, equipo, mercado, capital necesario y retorno esperado.
              </p>
            </div>
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

          <ul className="list-compact">
            {(derived.thesis || []).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
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
                Perfiles de inversor más adecuados según fase, tracción, capital objetivo y narrativa.
              </p>
            </div>

            <Users size={20} />
          </div>

          {investorTargets.length === 0 ? (
            <p className="muted">
              Completa los inputs de financiación para generar perfiles de inversor.
            </p>
          ) : (
            <div className="stack">
              {investorTargets.map((target) => (
                <div
                  key={target.type}
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
              Puntos que conviene reforzar antes de enviar materiales o abrir conversaciones.
            </p>
          </div>

          <Badge>{fundingInputs.stage || 'Seed'}</Badge>
        </div>

        <div className="grid-3">
          <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <strong>1. Claridad del uso de fondos</strong>
            <p className="muted" style={{ marginBottom: 0 }}>
              Explicar cómo el capital se transforma en crecimiento, producto,
              ventas, equipo o runway adicional.
            </p>
          </div>

          <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <strong>2. Prueba de tracción</strong>
            <p className="muted" style={{ marginBottom: 0 }}>
              Preparar métricas, clientes, pipeline, crecimiento, margen y señales
              que justifiquen la valoración.
            </p>
          </div>

          <div className="card" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <strong>3. Riesgo y mitigación</strong>
            <p className="muted" style={{ marginBottom: 0 }}>
              Anticipar objeciones sobre burn, competencia, dependencia de clientes,
              equipo o ejecución.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}