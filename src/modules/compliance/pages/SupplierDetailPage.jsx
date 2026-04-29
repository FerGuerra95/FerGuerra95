import React, { useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  CheckCheck,
  CheckCircle2,
  ClipboardCheck,
  FileBadge,
  FileSearch,
  Gauge,
  History,
  Layers3,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  WalletCards
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { EmptyState } from '../../../shared/components/ui/EmptyState.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { useComplianceStore } from '../store/complianceStore.js';
import { useComplianceEngine } from '../engine/useComplianceEngine.js';

const supplierDetailCss = `
  .supplier-detail-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 38px;
  }

  .supplier-detail-hero {
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

  .supplier-detail-hero::before {
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

  .supplier-detail-hero::after {
    content: "";
    position: absolute;
    inset: auto -190px -210px auto;
    width: 520px;
    height: 520px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.13), transparent 70%);
    pointer-events: none;
  }

  .supplier-detail-hero-layout {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.42fr) minmax(380px, 0.58fr);
    gap: 36px;
    align-items: stretch;
  }

  .supplier-detail-back-row {
    margin-bottom: 26px;
  }

  .supplier-detail-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 26px;
  }

  .supplier-detail-title {
    margin: 0;
    max-width: 950px;
    font-size: clamp(42px, 5vw, 72px);
    line-height: 0.92;
    letter-spacing: -0.075em;
  }

  .supplier-detail-title span {
    display: block;
    margin-top: 8px;
    color: rgba(226, 232, 240, 0.7);
  }

  .supplier-detail-copy {
    max-width: 860px;
    margin: 26px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .supplier-detail-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .supplier-detail-command-item {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.078);
    min-width: 0;
  }

  .supplier-detail-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .supplier-detail-signal-card {
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

  .supplier-detail-signal-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: radial-gradient(circle at 18% 0%, rgba(96, 165, 250, 0.13), transparent 35%);
    pointer-events: none;
  }

  .supplier-detail-signal-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .supplier-detail-signal-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .supplier-detail-icon-box,
  .supplier-detail-card-icon,
  .supplier-detail-panel-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .supplier-detail-icon-box {
    width: 50px;
    height: 50px;
  }

  .supplier-detail-card-icon,
  .supplier-detail-panel-icon {
    width: 46px;
    height: 46px;
  }

  .supplier-detail-signal-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.16;
    letter-spacing: -0.04em;
  }

  .supplier-detail-score-module {
    display: grid;
    grid-template-columns: 122px minmax(0, 1fr);
    gap: 22px;
    align-items: center;
    padding: 20px;
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.047);
    border: 1px solid rgba(255, 255, 255, 0.085);
  }

  .supplier-detail-score-ring {
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

  .supplier-detail-score-core {
    width: 84px;
    height: 84px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.97);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .supplier-detail-score-core strong {
    font-size: 25px;
    letter-spacing: -0.055em;
  }

  .supplier-detail-score-copy strong {
    display: block;
    margin-bottom: 8px;
  }

  .supplier-detail-score-copy p {
    margin: 0;
    line-height: 1.62;
  }

  .supplier-detail-signal-table {
    display: grid;
    gap: 0;
  }

  .supplier-detail-signal-row {
    display: grid;
    grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
    gap: 14px;
    align-items: center;
    padding: 15px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }

  .supplier-detail-signal-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .supplier-detail-section {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .supplier-detail-section-header {
    display: flex;
    justify-content: space-between;
    gap: 28px;
    align-items: flex-end;
  }

  .supplier-detail-kicker {
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

  .supplier-detail-section-header h2,
  .supplier-detail-section-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .supplier-detail-section-header p {
    max-width: 820px;
    margin: 11px 0 0;
    line-height: 1.68;
  }

  .supplier-detail-grid {
    display: grid;
    gap: 26px;
    align-items: stretch;
  }

  .supplier-detail-grid-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .supplier-detail-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .supplier-detail-kpi-card,
  .supplier-detail-panel,
  .supplier-detail-list-card,
  .supplier-detail-action-card {
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

  .supplier-detail-kpi-card {
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

  .supplier-detail-kpi-card:hover {
    transform: translateY(-3px);
    border-color: rgba(96, 165, 250, 0.25);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .supplier-detail-kpi-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .supplier-detail-kpi-value {
    margin-top: 12px;
    font-size: 25px;
    font-weight: 790;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .supplier-detail-kpi-card p {
    margin: 0;
    line-height: 1.56;
  }

  .supplier-detail-panel {
    padding: 31px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .supplier-detail-panel-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .supplier-detail-panel-title {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .supplier-detail-panel-description {
    margin: 11px 0 0;
    line-height: 1.66;
  }

  .supplier-detail-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .supplier-detail-list-card {
    padding: 22px;
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .supplier-detail-list-card:hover {
    transform: translateY(-2px);
    border-color: rgba(96, 165, 250, 0.24);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .supplier-detail-list-card-head {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .supplier-detail-list-card-title {
    margin: 0;
    letter-spacing: -0.035em;
  }

  .supplier-detail-list-card p {
    line-height: 1.6;
  }

  .supplier-detail-card-body {
    margin-top: 14px;
    padding-top: 14px;
    border-top: 1px solid rgba(148, 163, 184, 0.12);
  }

  .supplier-detail-risk-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .supplier-detail-risk-item {
    display: grid;
    grid-template-columns: 36px minmax(0, 1fr);
    gap: 15px;
    align-items: flex-start;
    padding: 19px;
    border-radius: 22px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.078);
  }

  .supplier-detail-risk-icon {
    width: 36px;
    height: 36px;
    border-radius: 15px;
    display: grid;
    place-items: center;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.22);
    color: #86efac;
  }

  .supplier-detail-risk-item strong {
    display: block;
    margin-bottom: 7px;
  }

  .supplier-detail-risk-item p {
    margin: 0;
    line-height: 1.6;
  }

  .supplier-detail-action-card {
    padding: 31px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .supplier-detail-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 6px;
  }

  .supplier-detail-empty {
    border-radius: 25px;
    padding: 28px;
    border: 1px dashed rgba(148, 163, 184, 0.24);
    background: rgba(255,255,255,0.025);
    text-align: center;
  }

  .supplier-detail-empty-icon {
    width: 54px;
    height: 54px;
    margin: 0 auto 16px;
    border-radius: 20px;
    display: grid;
    place-items: center;
    background: rgba(37, 99, 235, 0.14);
    border: 1px solid rgba(96, 165, 250, 0.22);
  }

  .supplier-detail-empty h3 {
    margin: 0;
    letter-spacing: -0.04em;
  }

  .supplier-detail-empty p {
    max-width: 520px;
    margin: 10px auto 0;
    line-height: 1.65;
  }

  .supplier-detail-muted-tight {
    margin-bottom: 0;
  }

  @media (max-width: 1180px) {
    .supplier-detail-hero-layout {
      grid-template-columns: 1fr;
    }

    .supplier-detail-grid-kpis {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 920px) {
    .supplier-detail-grid-two,
    .supplier-detail-command-bar {
      grid-template-columns: 1fr;
    }

    .supplier-detail-section-header {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (max-width: 680px) {
    .supplier-detail-page {
      gap: 28px;
    }

    .supplier-detail-hero {
      padding: 26px;
      border-radius: 28px;
    }

    .supplier-detail-grid-kpis {
      grid-template-columns: 1fr;
    }

    .supplier-detail-kpi-card,
    .supplier-detail-panel,
    .supplier-detail-list-card,
    .supplier-detail-action-card {
      border-radius: 24px;
    }

    .supplier-detail-score-module {
      grid-template-columns: 1fr;
    }

    .supplier-detail-signal-row,
    .supplier-detail-list-card-head {
      grid-template-columns: 1fr;
      gap: 7px;
    }

    .supplier-detail-list-card-head {
      flex-direction: column;
    }

    .supplier-detail-signal-row strong {
      text-align: left;
    }
  }
`;

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
  return `${Number(value || 0).toLocaleString('es-ES')} €`;
}

function getSupplierSignal({ riskScore, resilienceScore, alertCount, evidenceCount, reviewCount }) {
  const controlScore = clampScore(
    (100 - riskScore) * 0.38 +
      resilienceScore * 0.34 +
      Math.min(14, evidenceCount * 4) +
      Math.min(14, reviewCount * 5) -
      Math.min(16, alertCount * 4)
  );

  if (riskScore >= 75 || alertCount >= 3) {
    return {
      score: controlScore,
      title: 'High supplier exposure',
      posture: 'Prioritize review',
      description:
        'El proveedor presenta exposición elevada. Prioriza revisión humana, evidencias y plan de mitigación.'
    };
  }

  if (riskScore >= 55 || alertCount > 0) {
    return {
      score: controlScore,
      title: 'Supplier requires monitoring',
      posture: 'Review open items',
      description:
        'Existen señales que requieren seguimiento antes de considerar al proveedor como controlado.'
    };
  }

  if (resilienceScore >= 70 && evidenceCount > 0) {
    return {
      score: controlScore,
      title: 'Controlled supplier profile',
      posture: 'Maintain controls',
      description:
        'El proveedor muestra una lectura razonablemente controlada, con resiliencia y evidencia disponible.'
    };
  }

  return {
    score: controlScore,
    title: 'Supplier file in progress',
    posture: 'Improve evidence',
    description:
      'La ficha tiene base inicial, pero conviene reforzar evidencias, revisión humana y trazabilidad.'
  };
}

function CommandItem({ label, value }) {
  return (
    <div className="supplier-detail-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SignalRow({ label, value }) {
  return (
    <div className="supplier-detail-signal-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function DetailMetric({ label, value, helper, icon: Icon, color = '' }) {
  return (
    <article className="supplier-detail-kpi-card">
      <div className="supplier-detail-kpi-top">
        <div>
          <div className="kpi-label">{label}</div>

          <div className={`supplier-detail-kpi-value ${color}`.trim()}>
            {value}
          </div>
        </div>

        <div className="supplier-detail-card-icon">
          <Icon size={18} />
        </div>
      </div>

      {helper ? <p className="muted">{helper}</p> : null}
    </article>
  );
}

function SectionHeader({ kicker, icon: Icon, title, description }) {
  return (
    <div className="supplier-detail-section-header">
      <div>
        <div className="supplier-detail-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h2>{title}</h2>

        <p className="muted">{description}</p>
      </div>
    </div>
  );
}

function PanelHeader({ kicker, icon: Icon, title, description, count }) {
  return (
    <div className="supplier-detail-panel-header">
      <div>
        <div className="supplier-detail-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h3 className="supplier-detail-panel-title">{title}</h3>

        <p className="muted supplier-detail-panel-description">{description}</p>
      </div>

      <div className="supplier-detail-panel-icon">
        {typeof count === 'number' ? <strong>{count}</strong> : <Icon size={18} />}
      </div>
    </div>
  );
}

function EmptyBlock({ icon: Icon, title, description }) {
  return (
    <div className="supplier-detail-empty">
      <div className="supplier-detail-empty-icon">
        <Icon size={22} />
      </div>

      <h3>{title}</h3>

      <p className="muted">{description}</p>
    </div>
  );
}

function RiskItem({ icon: Icon, title, text }) {
  return (
    <div className="supplier-detail-risk-item">
      <div className="supplier-detail-risk-icon">
        <Icon size={16} />
      </div>

      <div>
        <strong>{title}</strong>
        <p className="muted">{text}</p>
      </div>
    </div>
  );
}

function AlertCard({ alert }) {
  return (
    <article className="supplier-detail-list-card">
      <div className="supplier-detail-list-card-head">
        <div>
          <h3 className="supplier-detail-list-card-title">{alert.title}</h3>

          <p className="muted supplier-detail-muted-tight" style={{ marginTop: 8 }}>
            {alert.category || 'Categoría N/A'} · {alert.source || 'Fuente N/A'}
          </p>
        </div>

        <div className="row wrap">
          <Badge>{alert.severity || 'N/A'}</Badge>
          <Badge>{alert.status || 'N/A'}</Badge>
        </div>
      </div>

      <div className="supplier-detail-card-body">
        <p className="muted supplier-detail-muted-tight">
          {alert.description || 'Sin descripción registrada.'}
        </p>
      </div>
    </article>
  );
}

function EvidenceCard({ evidence }) {
  const confidence = Math.round(Number(evidence.confidence || 0) * 100);

  return (
    <article className="supplier-detail-list-card">
      <div className="supplier-detail-list-card-head">
        <div>
          <h3 className="supplier-detail-list-card-title">{evidence.title}</h3>

          <p className="muted supplier-detail-muted-tight" style={{ marginTop: 8 }}>
            {evidence.sourceType || 'manual'} · {evidence.language || 'N/A'} ·{' '}
            {confidence}% confianza
          </p>
        </div>

        <FileBadge size={18} />
      </div>

      <div className="supplier-detail-card-body">
        <p className="muted supplier-detail-muted-tight">
          {evidence.translatedExcerpt || evidence.excerpt || 'Sin extracto registrado.'}
        </p>
      </div>
    </article>
  );
}

function ReviewCard({ review }) {
  return (
    <article className="supplier-detail-list-card">
      <div className="supplier-detail-list-card-head">
        <div>
          <h3 className="supplier-detail-list-card-title">
            {review.status === 'decided'
              ? `Decisión: ${review.decision}`
              : 'Revisión pendiente'}
          </h3>

          <p className="muted supplier-detail-muted-tight" style={{ marginTop: 8 }}>
            Revisor: {review.reviewer || 'Sin asignar'} ·{' '}
            {formatDate(review.decidedAt || review.createdAt)}
          </p>
        </div>

        <CheckCheck size={18} />
      </div>

      <div className="supplier-detail-card-body">
        <p className="muted supplier-detail-muted-tight">
          {review.notes || 'Sin notas de revisión.'}
        </p>
      </div>
    </article>
  );
}

function TimelineCard({ event }) {
  return (
    <article className="supplier-detail-list-card">
      <div className="supplier-detail-list-card-head">
        <div>
          <h3 className="supplier-detail-list-card-title">{event.title}</h3>

          <p className="muted supplier-detail-muted-tight" style={{ marginTop: 8 }}>
            {event.type} · {event.status} · {formatDate(event.date)}
          </p>
        </div>

        <Badge>{event.severity || 'N/A'}</Badge>
      </div>

      <div className="supplier-detail-card-body">
        <p className="muted supplier-detail-muted-tight">
          {event.description || 'Sin descripción registrada.'}
        </p>
      </div>
    </article>
  );
}

export function SupplierDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    suppliers,
    alerts,
    evidenceItems,
    reviews,
    activeSupplierId,
    setActiveSupplierId,
    createAlert,
    addEvidence,
    createReview
  } = useComplianceStore();

  useEffect(() => {
    if (id) {
      setActiveSupplierId(id);
    }
  }, [id, setActiveSupplierId]);

  const safeSuppliers = getSafeArray(suppliers);
  const safeAlerts = getSafeArray(alerts);
  const safeEvidenceItems = getSafeArray(evidenceItems);
  const safeReviews = getSafeArray(reviews);

  const engine = useComplianceEngine({
    suppliers: safeSuppliers,
    alerts: safeAlerts,
    evidenceItems: safeEvidenceItems,
    reviews: safeReviews,
    activeSupplierId: id || activeSupplierId
  });

  const supplier = engine.activeSupplier;

  if (!supplier) {
    return (
      <div className="page">
        <style>{supplierDetailCss}</style>

        <div className="supplier-detail-page">
          <Card className="supplier-detail-panel">
            <Button
              variant="secondary"
              onClick={() => navigate('/compliance/suppliers')}
            >
              <ArrowLeft size={16} />
              Volver a proveedores
            </Button>

            <EmptyState
              title="Proveedor no encontrado"
              description="El proveedor seleccionado no existe o ha sido eliminado."
            />
          </Card>
        </div>
      </div>
    );
  }

  const activeSupplierAlerts = getSafeArray(engine.activeSupplierAlerts);
  const activeSupplierEvidence = getSafeArray(engine.activeSupplierEvidence);
  const activeSupplierReviews = getSafeArray(engine.activeSupplierReviews);
  const evidenceTimeline = getSafeArray(engine.evidenceTimeline);

  const riskScore = getSafeNumber(supplier.riskScore);
  const resilienceScore = getSafeNumber(supplier.resilienceScore);

  const supplierSignal = getSupplierSignal({
    riskScore,
    resilienceScore,
    alertCount: activeSupplierAlerts.length,
    evidenceCount: activeSupplierEvidence.length,
    reviewCount: activeSupplierReviews.length
  });

  const scoreAngle = `${supplierSignal.score * 3.6}deg`;

  function handleCreateDemoAlert() {
    const alert = createAlert({
      supplierId: supplier.id,
      title: 'Nueva alerta de revisión manual',
      category: 'Manual Review',
      severity: 'medium',
      status: 'open',
      source: 'Compliance operator',
      description:
        'Alerta creada manualmente para revisar documentación, dependencia operativa o riesgo del proveedor.'
    });

    createReview({
      alertId: alert.id,
      supplierId: supplier.id
    });
  }

  function handleAddDemoEvidence() {
    addEvidence({
      supplierId: supplier.id,
      alertId: activeSupplierAlerts[0]?.id || '',
      title: 'Evidencia documental añadida',
      sourceType: 'manual',
      language: 'es',
      excerpt:
        'Documento o nota interna registrada como soporte de revisión del proveedor.',
      confidence: 0.75
    });
  }

  return (
    <div className="page">
      <style>{supplierDetailCss}</style>

      <div className="supplier-detail-page">
        <section className="supplier-detail-hero">
          <div className="supplier-detail-hero-layout">
            <div>
              <div className="supplier-detail-back-row">
                <Button
                  variant="secondary"
                  onClick={() => navigate('/compliance/suppliers')}
                >
                  <ArrowLeft size={16} />
                  Volver
                </Button>
              </div>

              <div className="supplier-detail-badge-row">
                <Badge>Supplier Intelligence File</Badge>
                <Badge>{supplier.status || 'active'}</Badge>
                <Badge>{supplier.sector || 'General'}</Badge>
              </div>

              <h1 className="supplier-detail-title">
                {supplier.name}
                <span>Supplier risk and evidence profile.</span>
              </h1>

              <p className="supplier-detail-copy">
                Ficha individual del proveedor con riesgo, resiliencia, alertas,
                evidencias, revisiones humanas y timeline de actividad para
                mantener trazabilidad completa del expediente.
              </p>

              <div className="supplier-detail-command-bar">
                <CommandItem
                  label="Country"
                  value={supplier.country || 'Sin país'}
                />

                <CommandItem
                  label="Segment"
                  value={`${supplier.region || 'Sin región'} · ${supplier.tier || 'Tier N/A'}`}
                />

                <CommandItem
                  label="Criticality"
                  value={supplier.criticality || 'Media'}
                />
              </div>
            </div>

            <aside className="supplier-detail-signal-card">
              <div className="supplier-detail-signal-inner">
                <div className="supplier-detail-signal-top">
                  <div>
                    <div className="kpi-label">Supplier Control Signal</div>
                    <div className="supplier-detail-signal-title">
                      {supplierSignal.title}
                    </div>
                  </div>

                  <div className="supplier-detail-icon-box">
                    <ShieldCheck size={21} />
                  </div>
                </div>

                <div className="supplier-detail-score-module">
                  <div
                    className="supplier-detail-score-ring"
                    style={{ '--score-angle': scoreAngle }}
                  >
                    <div className="supplier-detail-score-core">
                      <strong>{supplierSignal.score}</strong>
                    </div>
                  </div>

                  <div className="supplier-detail-score-copy">
                    <strong>{supplierSignal.posture}</strong>

                    <p className="muted">
                      {supplierSignal.description}
                    </p>
                  </div>
                </div>

                <div className="supplier-detail-signal-table">
                  <SignalRow label="Risk score" value={`${riskScore}/100`} />
                  <SignalRow label="Resilience" value={`${resilienceScore}/100`} />
                  <SignalRow label="Linked alerts" value={activeSupplierAlerts.length} />
                  <SignalRow label="Evidence items" value={activeSupplierEvidence.length} />
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="supplier-detail-section">
          <SectionHeader
            kicker="Executive snapshot"
            icon={Activity}
            title="Supplier intelligence at a glance"
            description="Resumen rápido del perfil económico, riesgo, resiliencia y revisión más reciente."
          />

          <div className="supplier-detail-grid supplier-detail-grid-kpis">
            <DetailMetric
              label="Risk Score"
              value={`${riskScore}/100`}
              helper={supplier.riskLevel?.label || 'Sin clasificar'}
              color={supplier.riskLevel?.color || ''}
              icon={ShieldAlert}
            />

            <DetailMetric
              label="Resilience Score"
              value={`${resilienceScore}/100`}
              helper={supplier.resilienceLevel?.label || 'Sin clasificar'}
              color={supplier.resilienceLevel?.color || ''}
              icon={ShieldCheck}
            />

            <DetailMetric
              label="Spend anual"
              value={formatSpend(supplier.spend)}
              helper="Volumen anual estimado"
              icon={WalletCards}
            />

            <DetailMetric
              label="Última revisión"
              value={formatDate(supplier.lastReviewAt)}
              helper="Fecha de actualización"
              icon={ClipboardCheck}
            />
          </div>
        </section>

        <section className="supplier-detail-grid supplier-detail-grid-two">
          <Card className="supplier-detail-panel">
            <PanelHeader
              kicker="Risk snapshot"
              icon={Gauge}
              title="Risk Snapshot"
              description="Lectura ejecutiva del perfil de riesgo y resiliencia del proveedor."
            />

            <p className="muted supplier-detail-muted-tight">
              {engine.executiveSummary}
            </p>

            <div className="supplier-detail-risk-list">
              <RiskItem
                icon={ShieldAlert}
                title="Nivel de riesgo"
                text={supplier.riskLevel?.description || 'Sin descripción de riesgo.'}
              />

              <RiskItem
                icon={ShieldCheck}
                title="Nivel de resiliencia"
                text={
                  supplier.resilienceLevel?.description ||
                  'Sin descripción de resiliencia.'
                }
              />
            </div>
          </Card>

          <section className="supplier-detail-action-card">
            <PanelHeader
              kicker="Operator actions"
              icon={Sparkles}
              title="Quick Actions"
              description="Crea alertas y evidencias para comprobar el flujo Supplier → Alert → Evidence → Review → Report."
            />

            <p className="muted supplier-detail-muted-tight">
              Usa estas acciones para simular el ciclo operativo de compliance y
              dejar trazabilidad sobre el proveedor.
            </p>

            <div className="supplier-detail-actions">
              <Button onClick={handleCreateDemoAlert}>
                <AlertTriangle size={16} />
                Crear alerta
              </Button>

              <Button variant="secondary" onClick={handleAddDemoEvidence}>
                <FileBadge size={16} />
                Añadir evidencia
              </Button>
            </div>
          </section>
        </section>

        <section className="supplier-detail-grid supplier-detail-grid-two">
          <Card className="supplier-detail-panel">
            <PanelHeader
              kicker="Linked alerts"
              icon={AlertTriangle}
              title="Linked Alerts"
              description="Alertas asociadas al proveedor para priorizar revisión y mitigación."
              count={activeSupplierAlerts.length}
            />

            <div className="supplier-detail-list">
              {activeSupplierAlerts.length === 0 ? (
                <EmptyBlock
                  icon={CheckCircle2}
                  title="No hay alertas asociadas"
                  description="Cuando se registren alertas para este proveedor aparecerán aquí."
                />
              ) : (
                activeSupplierAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))
              )}
            </div>
          </Card>

          <Card className="supplier-detail-panel">
            <PanelHeader
              kicker="Evidence timeline"
              icon={FileSearch}
              title="Evidence Timeline"
              description="Evidencias, documentos y extractos vinculados al proveedor."
              count={activeSupplierEvidence.length}
            />

            <div className="supplier-detail-list">
              {activeSupplierEvidence.length === 0 ? (
                <EmptyBlock
                  icon={FileBadge}
                  title="No hay evidencias asociadas"
                  description="Añade evidencias para reforzar la trazabilidad documental del proveedor."
                />
              ) : (
                activeSupplierEvidence.map((evidence) => (
                  <EvidenceCard key={evidence.id} evidence={evidence} />
                ))
              )}
            </div>
          </Card>
        </section>

        <section className="supplier-detail-grid supplier-detail-grid-two">
          <Card className="supplier-detail-panel">
            <PanelHeader
              kicker="Human review"
              icon={CheckCheck}
              title="Review Activity"
              description="Revisiones humanas y decisiones registradas en el expediente."
              count={activeSupplierReviews.length}
            />

            <div className="supplier-detail-list">
              {activeSupplierReviews.length === 0 ? (
                <EmptyBlock
                  icon={ClipboardCheck}
                  title="No hay revisiones humanas"
                  description="Las revisiones pendientes o decididas aparecerán en este bloque."
                />
              ) : (
                activeSupplierReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))
              )}
            </div>
          </Card>

          <Card className="supplier-detail-panel">
            <PanelHeader
              kicker="Activity timeline"
              icon={History}
              title="Activity Timeline"
              description="Timeline combinado de actividad, alertas, evidencias y estados relevantes."
              count={evidenceTimeline.length}
            />

            <div className="supplier-detail-list">
              {evidenceTimeline.length === 0 ? (
                <EmptyBlock
                  icon={Layers3}
                  title="No hay actividad registrada"
                  description="La actividad aparecerá cuando haya alertas, evidencias o revisiones asociadas."
                />
              ) : (
                evidenceTimeline.map((event) => (
                  <TimelineCard key={event.id} event={event} />
                ))
              )}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}