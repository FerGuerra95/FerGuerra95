import React, { useMemo, useState } from 'react';
import {
  Activity,
  Archive,
  CheckCircle2,
  Eye,
  FileBadge,
  FileSearch,
  Filter,
  Globe2,
  Languages,
  Layers3,
  Link2,
  Plus,
  Search,
  ShieldCheck,
  Sparkles
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

const SOURCE_TYPE_OPTIONS = [
  'manual',
  'internal_note',
  'external_report',
  'news',
  'document',
  'audit',
  'certification',
  'other'
];

const LANGUAGE_OPTIONS = ['es', 'en', 'fr', 'de', 'it', 'pt', 'other'];

const evidencePageCss = `
  .evidence-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 38px;
  }

  .evidence-hero {
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

  .evidence-hero::before {
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

  .evidence-hero::after {
    content: "";
    position: absolute;
    inset: auto -190px -210px auto;
    width: 520px;
    height: 520px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.13), transparent 70%);
    pointer-events: none;
  }

  .evidence-hero-layout {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.42fr) minmax(380px, 0.58fr);
    gap: 36px;
    align-items: stretch;
  }

  .evidence-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 26px;
  }

  .evidence-title {
    margin: 0;
    max-width: 950px;
    font-size: clamp(42px, 5vw, 72px);
    line-height: 0.92;
    letter-spacing: -0.075em;
  }

  .evidence-title span {
    display: block;
    margin-top: 8px;
    color: rgba(226, 232, 240, 0.7);
  }

  .evidence-copy {
    max-width: 860px;
    margin: 26px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .evidence-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .evidence-command-item {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.078);
    min-width: 0;
  }

  .evidence-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .evidence-signal-card {
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

  .evidence-signal-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: radial-gradient(circle at 18% 0%, rgba(96, 165, 250, 0.13), transparent 35%);
    pointer-events: none;
  }

  .evidence-signal-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .evidence-signal-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .evidence-icon-box,
  .evidence-card-icon,
  .evidence-panel-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .evidence-icon-box {
    width: 50px;
    height: 50px;
  }

  .evidence-card-icon,
  .evidence-panel-icon {
    width: 46px;
    height: 46px;
  }

  .evidence-signal-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.16;
    letter-spacing: -0.04em;
  }

  .evidence-score-module {
    display: grid;
    grid-template-columns: 122px minmax(0, 1fr);
    gap: 22px;
    align-items: center;
    padding: 20px;
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.047);
    border: 1px solid rgba(255, 255, 255, 0.085);
  }

  .evidence-score-ring {
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

  .evidence-score-core {
    width: 84px;
    height: 84px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.97);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .evidence-score-core strong {
    font-size: 25px;
    letter-spacing: -0.055em;
  }

  .evidence-score-core strong.is-empty-score {
    font-size: 30px;
    color: rgba(226, 232, 240, 0.72);
  }

  .evidence-score-copy strong {
    display: block;
    margin-bottom: 8px;
  }

  .evidence-score-copy p {
    margin: 0;
    line-height: 1.62;
  }

  .evidence-signal-table {
    display: grid;
    gap: 0;
  }

  .evidence-signal-row {
    display: grid;
    grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
    gap: 14px;
    align-items: center;
    padding: 15px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }

  .evidence-signal-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .evidence-section {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .evidence-section-header {
    display: flex;
    justify-content: space-between;
    gap: 28px;
    align-items: flex-end;
  }

  .evidence-kicker {
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

  .evidence-section-header h2,
  .evidence-section-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .evidence-section-header p {
    max-width: 820px;
    margin: 11px 0 0;
    line-height: 1.68;
  }

  .evidence-grid {
    display: grid;
    gap: 26px;
    align-items: stretch;
  }

  .evidence-grid-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .evidence-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .evidence-kpi-card,
  .evidence-panel,
  .evidence-list-card {
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

  .evidence-kpi-card {
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

  .evidence-kpi-card:hover {
    transform: translateY(-3px);
    border-color: rgba(96, 165, 250, 0.25);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .evidence-kpi-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .evidence-kpi-value {
    margin-top: 12px;
    font-size: 25px;
    font-weight: 790;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .evidence-kpi-card p {
    margin: 0;
    line-height: 1.56;
  }

  .evidence-panel {
    padding: 31px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .evidence-panel-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .evidence-panel-title {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .evidence-panel-description {
    margin: 11px 0 0;
    line-height: 1.66;
  }

  .evidence-form,
  .evidence-filter-stack,
  .evidence-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .evidence-form-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 4px;
  }

  .evidence-filter-note {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.075);
    line-height: 1.62;
  }

  .evidence-list-panel {
    padding: 31px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .evidence-list-card {
    padding: 26px;
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .evidence-list-card:hover {
    transform: translateY(-2px);
    border-color: rgba(96, 165, 250, 0.24);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .evidence-list-card-head {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .evidence-list-card-title {
    margin: 0;
    letter-spacing: -0.04em;
  }

  .evidence-list-meta {
    margin: 9px 0 0;
    line-height: 1.58;
  }

  .evidence-confidence-box {
    min-width: 110px;
    text-align: right;
  }

  .evidence-confidence-box strong {
    display: block;
    font-size: 24px;
    line-height: 1;
    letter-spacing: -0.045em;
  }

  .evidence-excerpt {
    margin-top: 18px;
    padding-top: 18px;
    border-top: 1px solid rgba(148, 163, 184, 0.12);
    line-height: 1.62;
  }

  .evidence-source-line {
    margin-top: 14px;
    padding: 14px 16px;
    border-radius: 18px;
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.07);
    line-height: 1.55;
    overflow-wrap: anywhere;
  }

  .evidence-chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 18px;
  }

  .evidence-card-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 20px;
  }

  .evidence-empty-wrap {
    border-radius: 26px;
    padding: 34px;
    border: 1px dashed rgba(148, 163, 184, 0.24);
    background: rgba(255,255,255,0.025);
  }

  .evidence-muted-tight {
    margin-bottom: 0;
  }

  @media (max-width: 1180px) {
    .evidence-hero-layout,
    .evidence-grid-two {
      grid-template-columns: 1fr;
    }

    .evidence-grid-kpis {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 920px) {
    .evidence-command-bar {
      grid-template-columns: 1fr;
    }

    .evidence-section-header,
    .evidence-list-card-head {
      align-items: flex-start;
      flex-direction: column;
    }

    .evidence-confidence-box {
      text-align: left;
    }
  }

  @media (max-width: 680px) {
    .evidence-page {
      gap: 28px;
    }

    .evidence-hero {
      padding: 26px;
      border-radius: 28px;
    }

    .evidence-grid-kpis {
      grid-template-columns: 1fr;
    }

    .evidence-kpi-card,
    .evidence-panel,
    .evidence-list-card,
    .evidence-list-panel {
      border-radius: 24px;
    }

    .evidence-score-module {
      grid-template-columns: 1fr;
    }

    .evidence-signal-row {
      grid-template-columns: 1fr;
      gap: 7px;
    }

    .evidence-signal-row strong {
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

function getSupplierName(suppliers, supplierId) {
  const supplier = suppliers.find((item) => item.id === supplierId);

  return supplier?.name || 'Proveedor no identificado';
}

function getAlertTitle(alerts, alertId) {
  const alert = alerts.find((item) => item.id === alertId);

  return alert?.title || 'Sin alerta vinculada';
}

function getEmptyEvidenceForm(suppliers = []) {
  return {
    supplierId: suppliers[0]?.id || '',
    alertId: '',
    title: '',
    sourceType: 'manual',
    sourceUrl: '',
    language: 'es',
    excerpt: '',
    translatedExcerpt: '',
    confidence: '0.75'
  };
}

function normalizeText(value) {
  return String(value || '').trim();
}

function parseConfidence(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return null;
  }

  return number;
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getConfidencePercent(value) {
  return clampScore(getSafeNumber(value) * 100);
}

function getEvidenceSignal({ evidenceCount, evidenceCoverage, averageConfidence, linkedEvidenceCount }) {
  if (evidenceCount === 0) {
    return {
      score: null,
      title: 'Evidence library empty',
      posture: 'Build evidence base',
      description:
        'Todavía no hay evidencias registradas. Añade documentos, notas o fuentes para soportar alertas y revisiones.'
    };
  }

  const score = clampScore(
    evidenceCoverage * 0.45 +
      averageConfidence * 0.35 +
      Math.min(20, evidenceCount * 4)
  );

  if (score >= 82) {
    return {
      score,
      title: 'Strong evidence posture',
      posture: 'Maintain evidence quality',
      description:
        'La biblioteca documental tiene buena cobertura y nivel de confianza para soportar decisiones de compliance.'
    };
  }

  if (linkedEvidenceCount > 0 && score >= 60) {
    return {
      score,
      title: 'Evidence base established',
      posture: 'Improve traceability',
      description:
        'Existe una base documental útil, aunque conviene reforzar vínculos con alertas y mejorar cobertura por proveedor.'
    };
  }

  return {
    score,
    title: 'Evidence base in progress',
    posture: 'Increase coverage',
    description:
      'La biblioteca ya contiene evidencias, pero necesita mayor cobertura, confianza y relación con alertas.'
  };
}

function CommandItem({ label, value }) {
  return (
    <div className="evidence-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SignalRow({ label, value }) {
  return (
    <div className="evidence-signal-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SectionHeader({ kicker, icon: Icon, title, description, right }) {
  return (
    <div className="evidence-section-header">
      <div>
        <div className="evidence-kicker">
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
    <div className="evidence-panel-header">
      <div>
        <div className="evidence-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h3 className="evidence-panel-title">{title}</h3>

        <p className="muted evidence-panel-description">{description}</p>
      </div>

      <div className="evidence-panel-icon">
        <Icon size={18} />
      </div>
    </div>
  );
}

function KpiCard({ label, value, description, icon: Icon, tone = '' }) {
  return (
    <article className="evidence-kpi-card">
      <div className="evidence-kpi-top">
        <div>
          <div className="kpi-label">{label}</div>

          <div className={`evidence-kpi-value ${tone}`.trim()}>
            {value}
          </div>
        </div>

        <div className="evidence-card-icon">
          <Icon size={18} />
        </div>
      </div>

      <p className="muted">{description}</p>
    </article>
  );
}

function EvidenceCard({
  evidence,
  supplierName,
  alertTitle,
  canCreateEvidence,
  onOpenSupplier
}) {
  const confidence = getConfidencePercent(evidence.confidence);

  return (
    <article className="evidence-list-card">
      <div className="evidence-list-card-head">
        <div>
          <h3 className="evidence-list-card-title">{evidence.title}</h3>

          <p className="muted evidence-list-meta">
            {supplierName} · {alertTitle} · {formatDate(evidence.createdAt)}
          </p>
        </div>

        <div className="evidence-confidence-box">
          <strong className="text-info">{confidence}%</strong>
          <div className="kpi-label">Confianza</div>
        </div>
      </div>

      <div className="evidence-chip-row">
        <Badge>{evidence.sourceType || 'manual'}</Badge>
        <Badge>{evidence.language || 'N/A'}</Badge>
        <Badge>{confidence}% confianza</Badge>
      </div>

      <p className="muted evidence-excerpt">
        {evidence.translatedExcerpt ||
          evidence.excerpt ||
          'Sin extracto registrado.'}
      </p>

      {evidence.sourceUrl ? (
        <div className="evidence-source-line">
          <span className="muted">Fuente: {evidence.sourceUrl}</span>
        </div>
      ) : null}

      <div className="evidence-card-actions">
        <Button
          variant="secondary"
          onClick={() => onOpenSupplier(evidence.supplierId)}
        >
          <Eye size={16} />
          Ver proveedor
        </Button>

        <Button variant="secondary">
          <FileBadge size={16} />
          Evidencia registrada
        </Button>

        {!canCreateEvidence ? <Badge>Solo lectura</Badge> : null}
      </div>
    </article>
  );
}

export function EvidencePage() {
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
    addEvidence
  } = useComplianceStore();

  const safeSuppliers = getSafeArray(suppliers);
  const safeAlerts = getSafeArray(alerts);
  const safeEvidenceItems = getSafeArray(evidenceItems);
  const safeReviews = getSafeArray(reviews);

  const canCreateEvidence = can(PERMISSIONS.CREATE_EVIDENCE);

  const engine = useComplianceEngine({
    suppliers: safeSuppliers,
    alerts: safeAlerts,
    evidenceItems: safeEvidenceItems,
    reviews: safeReviews,
    activeSupplierId
  });

  const [query, setQuery] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [sourceTypeFilter, setSourceTypeFilter] = useState('all');

  const [newEvidence, setNewEvidence] = useState(() =>
    getEmptyEvidenceForm(safeSuppliers)
  );

  const supplierOptions = safeSuppliers.map((supplier) => ({
    label: supplier.name,
    value: supplier.id
  }));

  const alertOptions = safeAlerts
    .filter((alert) => {
      if (!newEvidence.supplierId) return true;

      return alert.supplierId === newEvidence.supplierId;
    })
    .map((alert) => ({
      label: alert.title,
      value: alert.id
    }));

  const evidenceCoverage = getSafeNumber(engine.portfolioRisk?.evidenceCoverage);
  const averageConfidence = getSafeNumber(
    engine.evidenceSummary?.averageConfidence
  );
  const coverageLabel = engine.evidenceSummary?.coverageLabel || 'Sin datos';
  const linkedEvidenceCount = safeEvidenceItems.filter((item) => item.alertId).length;

  const evidenceSignal = getEvidenceSignal({
    evidenceCount: safeEvidenceItems.length,
    evidenceCoverage,
    averageConfidence,
    linkedEvidenceCount
  });

  const scoreAngle = `${(evidenceSignal.score ?? 0) * 3.6}deg`;

  const filteredEvidence = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return safeEvidenceItems.filter((item) => {
      const supplierName = getSupplierName(safeSuppliers, item.supplierId);
      const alertTitle = getAlertTitle(safeAlerts, item.alertId);

      const matchesQuery = !normalizedQuery
        ? true
        : [
            item.title,
            item.sourceType,
            item.sourceUrl,
            item.language,
            item.excerpt,
            item.translatedExcerpt,
            supplierName,
            alertTitle
          ]
            .join(' ')
            .toLowerCase()
            .includes(normalizedQuery);

      const matchesSupplier =
        supplierFilter === 'all' ? true : item.supplierId === supplierFilter;

      const matchesSourceType =
        sourceTypeFilter === 'all' ? true : item.sourceType === sourceTypeFilter;

      return matchesQuery && matchesSupplier && matchesSourceType;
    });
  }, [
    safeEvidenceItems,
    safeSuppliers,
    safeAlerts,
    query,
    supplierFilter,
    sourceTypeFilter
  ]);

  function updateNewEvidenceField(key, value) {
    setNewEvidence((prev) => {
      if (key === 'supplierId') {
        return {
          ...prev,
          supplierId: value,
          alertId: ''
        };
      }

      return {
        ...prev,
        [key]: value
      };
    });
  }

  async function handleCreateEvidence() {
    if (!canCreateEvidence) {
      pushToast('No tienes permisos para añadir evidencias');
      return;
    }

    const supplierId = normalizeText(newEvidence.supplierId);
    const title = normalizeText(newEvidence.title);
    const sourceUrl = normalizeText(newEvidence.sourceUrl);
    const excerpt = normalizeText(newEvidence.excerpt);
    const translatedExcerpt = normalizeText(newEvidence.translatedExcerpt);
    const confidenceValue = parseConfidence(newEvidence.confidence);

    if (safeSuppliers.length === 0) {
      pushToast('Primero debes crear un proveedor');
      return;
    }

    if (!supplierId) {
      pushToast('Selecciona un proveedor para la evidencia');
      return;
    }

    const supplierExists = safeSuppliers.some(
      (supplier) => supplier.id === supplierId
    );

    if (!supplierExists) {
      pushToast('El proveedor seleccionado no existe');
      return;
    }

    if (!title) {
      pushToast('El título de la evidencia es obligatorio');
      return;
    }

    if (confidenceValue === null) {
      pushToast('La confianza debe ser un número entre 0 y 1');
      return;
    }

    if (confidenceValue < 0 || confidenceValue > 1) {
      pushToast('La confianza debe estar entre 0 y 1');
      return;
    }

    try {
      const created = await Promise.resolve(
        addEvidence({
          ...newEvidence,
          supplierId,
          title,
          sourceType: newEvidence.sourceType || 'manual',
          sourceUrl,
          language: newEvidence.language || 'es',
          excerpt:
            excerpt ||
            'Evidencia registrada manualmente para soporte del expediente.',
          translatedExcerpt,
          confidence: confidenceValue
        })
      );

      if (!created?.id) {
        pushToast('No se pudo añadir la evidencia');
        return;
      }

      setNewEvidence({
        ...getEmptyEvidenceForm(safeSuppliers),
        supplierId
      });

      pushToast('Evidencia añadida correctamente');
    } catch (error) {
      pushToast(error?.message || 'No se pudo añadir la evidencia');
    }
  }

  function handleOpenSupplier(supplierId) {
    setActiveSupplierId(supplierId);
    navigate(`/compliance/suppliers/${supplierId}`);
  }

  return (
    <div className="page">
      <style>{evidencePageCss}</style>

      <div className="evidence-page">
        <section className="evidence-hero">
          <div className="evidence-hero-layout">
            <div>
              <div className="evidence-badge-row">
                <Badge>Compliance & Risk</Badge>
                <Badge>Evidence Hub</Badge>
                {isViewer ? <Badge>Modo solo lectura</Badge> : null}
                {canCreateEvidence ? <Badge>Creación permitida</Badge> : null}
              </div>

              <h1 className="evidence-title">
                Evidence Hub.
                <span>Make every compliance decision defensible.</span>
              </h1>

              <p className="evidence-copy">
                Centro de evidencias con fuente, extracto, idioma, confianza,
                proveedor asociado y trazabilidad documental para soportar
                alertas, revisiones humanas e informes ejecutivos.
              </p>

              <div className="evidence-command-bar">
                <CommandItem
                  label="Evidence items"
                  value={safeEvidenceItems.length}
                />

                <CommandItem
                  label="Coverage"
                  value={`${evidenceCoverage}%`}
                />

                <CommandItem
                  label="Evidence posture"
                  value={evidenceSignal.posture}
                />
              </div>
            </div>

            <aside className="evidence-signal-card">
              <div className="evidence-signal-inner">
                <div className="evidence-signal-top">
                  <div>
                    <div className="kpi-label">Evidence Signal</div>
                    <div className="evidence-signal-title">
                      {evidenceSignal.title}
                    </div>
                  </div>

                  <div className="evidence-icon-box">
                    <FileBadge size={21} />
                  </div>
                </div>

                <div className="evidence-score-module">
                  <div
                    className="evidence-score-ring"
                    style={{ '--score-angle': scoreAngle }}
                  >
                    <div className="evidence-score-core">
                      <strong className={evidenceSignal.score === null ? 'is-empty-score' : ''}>
                        {evidenceSignal.score === null ? '—' : evidenceSignal.score}
                      </strong>
                    </div>
                  </div>

                  <div className="evidence-score-copy">
                    <strong>{evidenceSignal.posture}</strong>

                    <p className="muted">
                      {evidenceSignal.description}
                    </p>
                  </div>
                </div>

                <div className="evidence-signal-table">
                  <SignalRow label="Total evidence" value={safeEvidenceItems.length} />
                  <SignalRow label="Linked to alerts" value={linkedEvidenceCount} />
                  <SignalRow label="Avg confidence" value={`${averageConfidence || 0}%`} />
                  <SignalRow label="Coverage label" value={coverageLabel} />
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="evidence-section">
          <SectionHeader
            kicker="Executive overview"
            icon={Activity}
            title="Evidence base at a glance"
            description="Resumen de evidencias, cobertura documental, confianza media y calidad de soporte del expediente."
          />

          <div className="evidence-grid evidence-grid-kpis">
            <KpiCard
              label="Evidencias totales"
              value={safeEvidenceItems.length}
              description="Documentos, notas y fuentes"
              icon={Archive}
            />

            <KpiCard
              label="Cobertura evidencia"
              value={`${evidenceCoverage}%`}
              description="Proveedores con soporte"
              icon={ShieldCheck}
            />

            <KpiCard
              label="Confianza media"
              value={`${averageConfidence || 0}%`}
              description="Proveedor activo"
              icon={CheckCircle2}
              tone="text-success"
            />

            <KpiCard
              label="Cobertura activa"
              value={coverageLabel}
              description="Calidad documental"
              icon={Sparkles}
            />
          </div>
        </section>

        <section className="evidence-grid evidence-grid-two">
          <Card className="evidence-panel">
            <PanelHeader
              kicker="Evidence intake"
              icon={Plus}
              title="Evidence Intake"
              description="Registra una evidencia y conéctala con proveedor, alerta, fuente, idioma y confianza."
            />

            {canCreateEvidence ? (
              <div className="evidence-form">
                <Select
                  label="Proveedor"
                  value={newEvidence.supplierId}
                  onChange={(e) =>
                    updateNewEvidenceField('supplierId', e.target.value)
                  }
                  options={
                    supplierOptions.length > 0
                      ? supplierOptions
                      : [{ label: 'Sin proveedores', value: '' }]
                  }
                />

                <Select
                  label="Alerta vinculada"
                  value={newEvidence.alertId}
                  onChange={(e) => updateNewEvidenceField('alertId', e.target.value)}
                  options={[
                    { label: 'Sin alerta vinculada', value: '' },
                    ...alertOptions
                  ]}
                />

                <Input
                  label="Título de la evidencia"
                  value={newEvidence.title}
                  onChange={(e) => updateNewEvidenceField('title', e.target.value)}
                />

                <div className="grid-2">
                  <Select
                    label="Tipo de fuente"
                    value={newEvidence.sourceType}
                    onChange={(e) =>
                      updateNewEvidenceField('sourceType', e.target.value)
                    }
                    options={SOURCE_TYPE_OPTIONS}
                  />

                  <Select
                    label="Idioma"
                    value={newEvidence.language}
                    onChange={(e) =>
                      updateNewEvidenceField('language', e.target.value)
                    }
                    options={LANGUAGE_OPTIONS}
                  />
                </div>

                <Input
                  label="URL / referencia de fuente"
                  value={newEvidence.sourceUrl}
                  onChange={(e) =>
                    updateNewEvidenceField('sourceUrl', e.target.value)
                  }
                />

                <Input
                  label="Extracto original"
                  value={newEvidence.excerpt}
                  onChange={(e) => updateNewEvidenceField('excerpt', e.target.value)}
                />

                <Input
                  label="Traducción / resumen interno"
                  value={newEvidence.translatedExcerpt}
                  onChange={(e) =>
                    updateNewEvidenceField('translatedExcerpt', e.target.value)
                  }
                />

                <Input
                  label="Confianza de la evidencia (0 a 1)"
                  inputMode="decimal"
                  value={newEvidence.confidence}
                  onChange={(e) =>
                    updateNewEvidenceField('confidence', e.target.value)
                  }
                />

                <div className="evidence-form-actions">
                  <Button onClick={handleCreateEvidence}>
                    <Plus size={16} />
                    Añadir evidencia
                  </Button>
                </div>
              </div>
            ) : (
              <div className="evidence-empty-wrap">
                <EmptyState
                  title="Sin permisos de creación"
                  description="Tu rol actual solo permite consultar evidencias."
                />
              </div>
            )}
          </Card>

          <Card className="evidence-panel">
            <PanelHeader
              kicker="Library filters"
              icon={Filter}
              title="Evidence Filters"
              description="Filtra evidencias por proveedor, fuente y texto para encontrar soporte documental."
            />

            <div className="evidence-filter-stack">
              <Input
                label="Buscar"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              <Select
                label="Proveedor"
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
                options={[{ label: 'Todos', value: 'all' }, ...supplierOptions]}
              />

              <Select
                label="Tipo de fuente"
                value={sourceTypeFilter}
                onChange={(e) => setSourceTypeFilter(e.target.value)}
                options={['all', ...SOURCE_TYPE_OPTIONS]}
              />

              <div className="evidence-filter-note">
                <p className="muted evidence-muted-tight">
                  Las evidencias son la base defendible del workspace Compliance:
                  deben conservar fuente, extracto, idioma, nivel de confianza y
                  vínculo con proveedor o alerta.
                </p>
              </div>
            </div>
          </Card>
        </section>

        <section className="evidence-section">
          <SectionHeader
            kicker="Evidence library"
            icon={Search}
            title="Evidence Library"
            description="Evidencias registradas para soportar alertas, revisiones humanas e informes."
            right={<Badge>{filteredEvidence.length} resultados</Badge>}
          />

          <Card className="evidence-list-panel">
            {filteredEvidence.length === 0 ? (
              <div className="evidence-empty-wrap">
                <EmptyState
                  title="No hay evidencias"
                  description={
                    canCreateEvidence
                      ? 'Añade una evidencia nueva o cambia los filtros de búsqueda.'
                      : 'No hay evidencias visibles con los filtros actuales.'
                  }
                />
              </div>
            ) : (
              <div className="evidence-list">
                {filteredEvidence.map((evidence) => {
                  const supplierName = getSupplierName(
                    safeSuppliers,
                    evidence.supplierId
                  );
                  const alertTitle = getAlertTitle(safeAlerts, evidence.alertId);

                  return (
                    <EvidenceCard
                      key={evidence.id}
                      evidence={evidence}
                      supplierName={supplierName}
                      alertTitle={alertTitle}
                      canCreateEvidence={canCreateEvidence}
                      onOpenSupplier={handleOpenSupplier}
                    />
                  );
                })}
              </div>
            )}
          </Card>
        </section>

        <section className="evidence-section">
          <SectionHeader
            kicker="Operating loop"
            icon={Layers3}
            title="Evidence operating workflow"
            description="Cada evidencia debe ayudar a conectar proveedor, alerta, revisión y reporte con trazabilidad suficiente."
          />

          <div className="evidence-grid evidence-grid-kpis">
            <KpiCard
              label="Proveedores"
              value={safeSuppliers.length}
              description="Base monitorizada"
              icon={Globe2}
            />

            <KpiCard
              label="Alertas"
              value={safeAlerts.length}
              description="Señales vinculables"
              icon={Link2}
            />

            <KpiCard
              label="Revisiones"
              value={safeReviews.length}
              description="Control humano"
              icon={FileSearch}
            />

            <KpiCard
              label="Idiomas"
              value={new Set(safeEvidenceItems.map((item) => item.language)).size}
              description="Cobertura lingüística"
              icon={Languages}
            />
          </div>
        </section>
      </div>
    </div>
  );
}