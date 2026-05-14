import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Crown,
  FileText,
  Gem,
  Landmark,
  LockKeyhole,
  Plus,
  ShieldCheck,
  Target,
  Users
} from 'lucide-react';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { useAuth } from '../../../app/providers/AuthProvider.jsx';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import { heritageApi } from '../services/heritageApi.js';

const DEMO_ASSETS = [
  {
    id: 'demo-asset-holdco',
    name: 'Operating HoldCo',
    assetType: 'Operating company',
    jurisdiction: 'Spain',
    estimatedValue: 18000000,
    protectionStatus: 'protected',
    liquidityProfile: 'medium',
    owner: 'Founder Office',
    riskLevel: 'medium'
  },
  {
    id: 'demo-asset-real-estate',
    name: 'Strategic real estate pool',
    assetType: 'Real estate',
    jurisdiction: 'EU',
    estimatedValue: 4200000,
    protectionStatus: 'mapped',
    liquidityProfile: 'low',
    owner: 'Family Office',
    riskLevel: 'medium'
  }
];

const DEMO_SUCCESSIONS = [
  {
    id: 'demo-succession-family',
    title: 'Family governance protocol',
    status: 'active',
    owner: 'Family Office',
    successor: 'NextGen Committee',
    readiness: 78,
    evidenceStatus: 'ready',
    effectiveDate: '2026-09-30'
  },
  {
    id: 'demo-succession-founder',
    title: 'Founder continuity mandate',
    status: 'draft',
    owner: 'Board Secretary',
    successor: 'Executive Committee',
    readiness: 54,
    evidenceStatus: 'pending',
    effectiveDate: '2026-12-31'
  }
];

const DEMO_PROTECTIONS = [
  {
    id: 'demo-protection-legal',
    name: 'Asset holding structure review',
    domain: 'Legal',
    status: 'active',
    owner: 'Legal Counsel',
    coverage: 82,
    reviewCadence: 'quarterly'
  },
  {
    id: 'demo-protection-insurance',
    name: 'Key person and D&O coverage',
    domain: 'Insurance',
    status: 'active',
    owner: 'Risk Lead',
    coverage: 68,
    reviewCadence: 'semiannual'
  }
];

const DEMO_DOCUMENTS = [
  {
    id: 'demo-document-protocol',
    title: 'Family protocol evidence pack',
    documentType: 'protocol',
    classification: 'restricted',
    status: 'registered',
    owner: 'Family Office',
    linkedEntityType: 'succession',
    evidenceStatus: 'ready',
    reviewDueAt: '2026-09-30'
  },
  {
    id: 'demo-document-insurance',
    title: 'Insurance coverage memo',
    documentType: 'protection',
    classification: 'confidential',
    status: 'registered',
    owner: 'Risk Lead',
    linkedEntityType: 'protection',
    evidenceStatus: 'pending',
    reviewDueAt: '2026-08-31'
  }
];

const DEMO_REPORTS = [
  {
    id: 'demo-report-continuity',
    title: 'Heritage Continuity Report',
    status: 'generated',
    reportType: 'continuity',
    createdAt: '2026-05-14T00:00:00.000Z'
  }
];

const heritageCss = `
  .heritage-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 34px;
  }

  .heritage-hero {
    min-height: 500px;
    position: relative;
    overflow: hidden;
    border-radius: 38px;
    padding: 44px;
    border: 1px solid rgba(212, 175, 55, 0.18);
    background:
      radial-gradient(circle at 8% 2%, rgba(212, 175, 55, 0.24), transparent 30%),
      radial-gradient(circle at 88% 8%, rgba(20, 184, 166, 0.12), transparent 27%),
      linear-gradient(135deg, rgba(10, 10, 12, 0.99), rgba(24, 24, 27, 0.97));
    box-shadow: 0 38px 120px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255,255,255,0.055);
  }

  .heritage-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255,255,255,0.032) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.032) 1px, transparent 1px);
    background-size: 52px 52px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 82%);
    pointer-events: none;
  }

  .heritage-hero-layout {
    position: relative;
    z-index: 1;
    min-height: 420px;
    display: grid;
    grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.92fr);
    gap: 36px;
    align-items: center;
  }

  .heritage-badge-row,
  .heritage-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }

  .heritage-title {
    margin: 0;
    max-width: 940px;
    font-size: clamp(40px, 4.8vw, 68px);
    line-height: 0.94;
    letter-spacing: 0;
  }

  .heritage-title span {
    display: block;
    margin-top: 9px;
    color: rgba(226, 232, 240, 0.68);
  }

  .heritage-copy {
    max-width: 850px;
    margin: 28px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .heritage-grid {
    display: grid;
    gap: 24px;
  }

  .heritage-grid-four {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .heritage-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .heritage-panel,
  .heritage-kpi,
  .heritage-row-card,
  .heritage-signal-card {
    border: 1px solid rgba(212, 175, 55, 0.16);
    border-radius: 28px;
    padding: 24px;
    background: linear-gradient(135deg, rgba(255,255,255,0.064), rgba(255,255,255,0.022)), rgba(15, 23, 42, 0.64);
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.21), inset 0 1px 0 rgba(255,255,255,0.035);
  }

  .heritage-signal-card {
    backdrop-filter: blur(22px);
  }

  .heritage-panel-head,
  .heritage-card-head {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .heritage-icon {
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    border-radius: 18px;
    background: rgba(212, 175, 55, 0.14);
    border: 1px solid rgba(212, 175, 55, 0.24);
    flex: 0 0 auto;
  }

  .heritage-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-size: 11px;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.17em;
    color: rgba(203, 213, 225, 0.9);
  }

  .heritage-panel-title,
  .heritage-card-title {
    margin: 0;
    letter-spacing: 0;
  }

  .heritage-score {
    margin-top: 22px;
    padding: 22px;
    border-radius: 26px;
    background: rgba(255,255,255,0.047);
    border: 1px solid rgba(255,255,255,0.085);
  }

  .heritage-score strong,
  .heritage-kpi-value {
    display: block;
    font-size: 36px;
    line-height: 1;
    letter-spacing: 0;
    color: #fff;
    font-weight: 850;
  }

  .heritage-mini-row,
  .heritage-control-row {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 12px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.13);
  }

  .heritage-mini-row strong,
  .heritage-control-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .heritage-form {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.72fr) minmax(120px, 0.36fr) auto;
    gap: 12px;
    align-items: center;
  }

  .heritage-form-three {
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.72fr) auto;
  }

  .heritage-input,
  .heritage-select {
    width: 100%;
    min-height: 40px;
    border-radius: 14px;
    border: 1px solid rgba(212, 175, 55, 0.2);
    background: rgba(15, 23, 42, 0.72);
    color: rgba(226, 232, 240, 0.94);
    padding: 9px 11px;
    outline: none;
  }

  .heritage-button-lite {
    min-height: 38px;
    border-radius: 14px;
    border: 1px solid rgba(212, 175, 55, 0.3);
    background: rgba(212, 175, 55, 0.14);
    color: rgba(226, 232, 240, 0.94);
    font-weight: 800;
    cursor: pointer;
    padding: 8px 12px;
  }

  .heritage-button-lite:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  @media (max-width: 1180px) {
    .heritage-hero-layout,
    .heritage-grid-four,
    .heritage-grid-two {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 820px) {
    .heritage-hero {
      padding: 30px;
    }

    .heritage-form {
      grid-template-columns: 1fr;
    }

    .heritage-title {
      font-size: clamp(36px, 11vw, 54px);
    }
  }
`;

function toNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(toNumber(value))));
}

function isDemo(item) {
  return String(item?.id || '').startsWith('demo-');
}

function getMetrics({ assets = [], successions = [], protections = [] }) {
  const protectedAssets = assets.filter((item) =>
    ['protected', 'ring_fenced', 'insured', 'secured'].includes(String(item.protectionStatus || '').toLowerCase())
  );
  const liquidityRiskAssets = assets.filter((item) =>
    ['low', 'illiquid', 'restricted'].includes(String(item.liquidityProfile || '').toLowerCase()) ||
    ['high', 'critical'].includes(String(item.riskLevel || '').toLowerCase())
  );
  const completeSuccessions = successions.filter((item) =>
    ['approved', 'active', 'ready'].includes(String(item.status || '').toLowerCase())
  );
  const evidenceReady = successions.filter((item) =>
    ['ready', 'approved', 'complete'].includes(String(item.evidenceStatus || '').toLowerCase())
  );
  const successionReadiness =
    successions.length > 0 ? clampScore(successions.reduce((sum, item) => sum + toNumber(item.readiness), 0) / successions.length) : 0;
  const assetProtectionCoverage = assets.length > 0 ? clampScore((protectedAssets.length / assets.length) * 100) : 0;
  const controlCoverage =
    protections.length > 0 ? clampScore(protections.reduce((sum, item) => sum + toNumber(item.coverage), 0) / protections.length) : 55;
  const weakProtections = protections.filter((item) => toNumber(item.coverage) < 60).length;
  const evidenceReadiness = successions.length > 0 ? clampScore((evidenceReady.length / successions.length) * 100) : 0;
  const successionClosureRate = successions.length > 0 ? clampScore((completeSuccessions.length / successions.length) * 100) : 0;
  const protectionCoverage = clampScore((assetProtectionCoverage + controlCoverage) / 2);
  const score = clampScore(
    assetProtectionCoverage * 0.28 +
      successionReadiness * 0.3 +
      controlCoverage * 0.24 +
      evidenceReadiness * 0.1 +
      successionClosureRate * 0.08 -
      weakProtections * 4 -
      liquidityRiskAssets.length * 3
  );

  return {
    score,
    totalAssetValue: assets.reduce((sum, item) => sum + toNumber(item.estimatedValue), 0),
    protectionCoverage,
    successionReadiness,
    evidenceReadiness,
    weakProtections,
    liquidityRiskCount: liquidityRiskAssets.length,
    openSuccessionItems: successions.length - completeSuccessions.length
  };
}

function MiniRow({ label, value }) {
  return (
    <div className="heritage-mini-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function KpiCard({ label, value, description, icon: Icon }) {
  return (
    <article className="heritage-kpi">
      <div className="heritage-card-head">
        <div>
          <div className="kpi-label">{label}</div>
          <strong className="heritage-kpi-value">{value}</strong>
        </div>
        <div className="heritage-icon">
          <Icon size={18} />
        </div>
      </div>
      <p className="muted">{description}</p>
    </article>
  );
}

function AssetCard({ item, onUpdate, disabled }) {
  return (
    <article className="heritage-row-card">
      <div className="heritage-card-head">
        <div>
          <div className="heritage-kicker">
            <Gem size={14} />
            {item.assetType}
          </div>
          <h3 className="heritage-card-title">{item.name}</h3>
          <p className="muted">{item.owner} · {item.jurisdiction || 'jurisdiction pending'}</p>
        </div>
        <Badge>{formatCurrency(item.estimatedValue || 0, 'EUR')}</Badge>
      </div>
      <div className="heritage-toolbar">
        <select
          className="heritage-select"
          value={item.protectionStatus || 'mapped'}
          onChange={(event) => onUpdate(item.id, { protectionStatus: event.target.value })}
          disabled={disabled}
          aria-label={`${item.name} protection status`}
        >
          <option value="mapped">Mapped</option>
          <option value="protected">Protected</option>
          <option value="ring_fenced">Ring fenced</option>
          <option value="review_required">Review required</option>
        </select>
        <select
          className="heritage-select"
          value={item.riskLevel || 'medium'}
          onChange={(event) => onUpdate(item.id, { riskLevel: event.target.value })}
          disabled={disabled}
          aria-label={`${item.name} risk level`}
        >
          <option value="low">Low risk</option>
          <option value="medium">Medium risk</option>
          <option value="high">High risk</option>
          <option value="critical">Critical risk</option>
        </select>
      </div>
    </article>
  );
}

export function HeritageLegacyPage() {
  const { PERMISSIONS, can } = useAuth();
  const canManageHeritage = can(PERMISSIONS.MANAGE_ECOSYSTEM_BRANCH);
  const [assets, setAssets] = useState(DEMO_ASSETS);
  const [successions, setSuccessions] = useState(DEMO_SUCCESSIONS);
  const [protections, setProtections] = useState(DEMO_PROTECTIONS);
  const [documents, setDocuments] = useState(DEMO_DOCUMENTS);
  const [reports, setReports] = useState(DEMO_REPORTS);
  const [backendStatus, setBackendStatus] = useState({ loading: true, error: null });
  const [newAsset, setNewAsset] = useState({ name: '', assetType: '', estimatedValue: '' });
  const [newSuccession, setNewSuccession] = useState({ title: '', owner: '', readiness: '' });
  const [newProtection, setNewProtection] = useState({ name: '', owner: '', coverage: '' });
  const [newDocument, setNewDocument] = useState({ title: '', documentType: '' });

  useEffect(() => {
    let cancelled = false;

    async function loadHeritage() {
      try {
        const [assetItems, successionItems, protectionItems, documentItems, reportItems] = await Promise.all([
          heritageApi.listAssets(),
          heritageApi.listSuccessions(),
          heritageApi.listProtections(),
          heritageApi.listDocuments(),
          heritageApi.listReports()
        ]);
        if (cancelled) return;
        setAssets(assetItems.length > 0 ? assetItems : DEMO_ASSETS);
        setSuccessions(successionItems.length > 0 ? successionItems : DEMO_SUCCESSIONS);
        setProtections(protectionItems.length > 0 ? protectionItems : DEMO_PROTECTIONS);
        setDocuments(documentItems.length > 0 ? documentItems : DEMO_DOCUMENTS);
        setReports(reportItems.length > 0 ? reportItems : DEMO_REPORTS);
        setBackendStatus({ loading: false, error: null });
      } catch (error) {
        if (cancelled) return;
        setBackendStatus({ loading: false, error });
      }
    }

    loadHeritage();

    return () => {
      cancelled = true;
    };
  }, []);

  const metrics = useMemo(() => getMetrics({ assets, successions, protections }), [assets, successions, protections]);
  const isFallback = assets.some(isDemo);

  async function handleCreateAsset(event) {
    event.preventDefault();
    const name = newAsset.name.trim();
    if (!name) return;
    try {
      const created = await heritageApi.createAsset({
        name,
        assetType: newAsset.assetType || 'Operating company',
        estimatedValue: toNumber(newAsset.estimatedValue),
        protectionStatus: 'mapped',
        liquidityProfile: 'medium',
        owner: 'Founder Office',
        riskLevel: 'medium'
      });
      setAssets((items) => [created, ...items.filter((item) => !isDemo(item))]);
      setNewAsset({ name: '', assetType: '', estimatedValue: '' });
    } catch (error) {
      setBackendStatus({ loading: false, error });
    }
  }

  async function handleUpdateAsset(id, patch) {
    if (String(id).startsWith('demo-')) {
      setAssets((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
      return;
    }
    const updated = await heritageApi.updateAsset(id, patch);
    setAssets((items) => items.map((item) => (item.id === updated.id ? updated : item)));
  }

  async function handleCreateSuccession(event) {
    event.preventDefault();
    const title = newSuccession.title.trim();
    if (!title) return;
    const created = await heritageApi.createSuccession({
      title,
      owner: newSuccession.owner || 'Family Office',
      readiness: toNumber(newSuccession.readiness),
      status: 'draft',
      evidenceStatus: 'pending'
    });
    setSuccessions((items) => [created, ...items.filter((item) => !isDemo(item))]);
    setNewSuccession({ title: '', owner: '', readiness: '' });
  }

  async function handleCreateProtection(event) {
    event.preventDefault();
    const name = newProtection.name.trim();
    if (!name) return;
    const created = await heritageApi.createProtection({
      name,
      owner: newProtection.owner || 'Heritage Lead',
      domain: 'Legal',
      coverage: toNumber(newProtection.coverage),
      status: 'active'
    });
    setProtections((items) => [created, ...items.filter((item) => !isDemo(item))]);
    setNewProtection({ name: '', owner: '', coverage: '' });
  }

  async function handleCreateDocument(event) {
    event.preventDefault();
    const title = newDocument.title.trim();
    if (!title) return;
    const created = await heritageApi.createDocument({
      title,
      documentType: newDocument.documentType || 'evidence',
      classification: 'confidential',
      status: 'registered',
      owner: 'Heritage Lead',
      evidenceStatus: 'pending'
    });
    setDocuments((items) => [created, ...items.filter((item) => !isDemo(item))]);
    setNewDocument({ title: '', documentType: '' });
  }

  async function handleGenerateReport() {
    try {
      const created = await heritageApi.generateReport({ title: 'Heritage Continuity Report' });
      setReports((items) => [created, ...items.filter((item) => !isDemo(item))]);
    } catch (error) {
      setBackendStatus({ loading: false, error });
    }
  }

  return (
    <div className="page">
      <style>{heritageCss}</style>
      <div className="heritage-page">
        <section className="heritage-hero">
          <div className="heritage-hero-layout">
            <div>
              <div className="heritage-badge-row">
                <Badge>Heritage</Badge>
                <Badge>Legacy OS</Badge>
                <Badge>Owner Continuity</Badge>
                <Badge>{backendStatus.loading ? 'Syncing' : isFallback ? 'Demo fallback' : 'Enterprise synced'}</Badge>
              </div>
              <h1 className="heritage-title">
                Heritage & Legacy Control.
                <span>Patrimony, protection and succession readiness.</span>
              </h1>
              <p className="heritage-copy">
                Rama enterprise para convertir patrimonio, family protocol,
                sucesión y protección de activos en una capa trazable del CEO
                OS conectada con M&A, Funding, Governance y Board Pack.
              </p>
            </div>

            <aside className="heritage-signal-card">
              <div className="heritage-panel-head">
                <div>
                  <div className="kpi-label">Heritage Signal</div>
                  <h2 className="heritage-panel-title">Owner continuity readiness</h2>
                </div>
                <div className="heritage-icon">
                  <Crown size={20} />
                </div>
              </div>
              <div className="heritage-score">
                <strong>{metrics.score}</strong>
                <p className="muted">
                  {metrics.openSuccessionItems} sucesiones abiertas, {metrics.weakProtections} protecciones débiles y {metrics.liquidityRiskCount} riesgos de liquidez.
                </p>
              </div>
              <MiniRow label="Mapped asset value" value={formatCurrency(metrics.totalAssetValue, 'EUR')} />
              <MiniRow label="Protection coverage" value={`${metrics.protectionCoverage}%`} />
              <MiniRow label="Succession readiness" value={`${metrics.successionReadiness}%`} />
            </aside>
          </div>
        </section>

        <section className="heritage-grid heritage-grid-four">
          <KpiCard label="Asset map" value={assets.length} description="Activos con owner, jurisdicción, liquidez y riesgo." icon={Gem} />
          <KpiCard label="Value mapped" value={formatCurrency(metrics.totalAssetValue, 'EUR')} description="Valor patrimonial conectado al perfil del dueño." icon={BarChart3} />
          <KpiCard label="Successions" value={successions.length} description="Protocolos de continuidad con evidencia y readiness." icon={Users} />
          <KpiCard label="Protection" value={`${metrics.protectionCoverage}%`} description="Cobertura combinada de activos y controles." icon={ShieldCheck} />
        </section>

        <section className="heritage-grid heritage-grid-two">
          <Card className="heritage-panel">
            <div className="heritage-panel-head">
              <div>
                <div className="heritage-kicker">
                  <Plus size={14} />
                  Patrimony map
                </div>
                <h3 className="heritage-panel-title">Register asset</h3>
              </div>
              <div className="heritage-icon">
                <Landmark size={18} />
              </div>
            </div>
            <form className="heritage-form" onSubmit={handleCreateAsset}>
              <input className="heritage-input" value={newAsset.name} onChange={(event) => setNewAsset((current) => ({ ...current, name: event.target.value }))} placeholder="Asset" aria-label="Asset name" />
              <input className="heritage-input" value={newAsset.assetType} onChange={(event) => setNewAsset((current) => ({ ...current, assetType: event.target.value }))} placeholder="Type" aria-label="Asset type" />
              <input className="heritage-input" type="number" min="0" value={newAsset.estimatedValue} onChange={(event) => setNewAsset((current) => ({ ...current, estimatedValue: event.target.value }))} placeholder="Value" aria-label="Estimated value" />
              <button className="heritage-button-lite" type="submit" disabled={!canManageHeritage}>Add</button>
            </form>
          </Card>

          <Card className="heritage-panel">
            <div className="heritage-panel-head">
              <div>
                <div className="heritage-kicker">
                  <LockKeyhole size={14} />
                  Protection framework
                </div>
                <h3 className="heritage-panel-title">Add protection control</h3>
              </div>
              <div className="heritage-icon">
                <ShieldCheck size={18} />
              </div>
            </div>
            <form className="heritage-form" onSubmit={handleCreateProtection}>
              <input className="heritage-input" value={newProtection.name} onChange={(event) => setNewProtection((current) => ({ ...current, name: event.target.value }))} placeholder="Control" aria-label="Protection name" />
              <input className="heritage-input" value={newProtection.owner} onChange={(event) => setNewProtection((current) => ({ ...current, owner: event.target.value }))} placeholder="Owner" aria-label="Protection owner" />
              <input className="heritage-input" type="number" min="0" max="100" value={newProtection.coverage} onChange={(event) => setNewProtection((current) => ({ ...current, coverage: event.target.value }))} placeholder="%" aria-label="Coverage" />
              <button className="heritage-button-lite" type="submit" disabled={!canManageHeritage}>Add</button>
            </form>
          </Card>
        </section>

        <section className="heritage-grid heritage-grid-two">
          <Card className="heritage-panel">
            <div className="heritage-panel-head">
              <div>
                <div className="heritage-kicker">
                  <FileText size={14} />
                  Controlled documents
                </div>
                <h3 className="heritage-panel-title">Evidence register</h3>
              </div>
              <div className="heritage-icon">
                <FileText size={18} />
              </div>
            </div>
            <form className="heritage-form heritage-form-three" onSubmit={handleCreateDocument}>
              <input className="heritage-input" value={newDocument.title} onChange={(event) => setNewDocument((current) => ({ ...current, title: event.target.value }))} placeholder="Document" aria-label="Document title" />
              <input className="heritage-input" value={newDocument.documentType} onChange={(event) => setNewDocument((current) => ({ ...current, documentType: event.target.value }))} placeholder="Type" aria-label="Document type" />
              <button className="heritage-button-lite" type="submit" disabled={!canManageHeritage}>Add</button>
            </form>
            <div>
              {documents.map((item) => (
                <MiniRow key={item.id} label={item.title} value={item.evidenceStatus || item.status} />
              ))}
            </div>
          </Card>

          <Card className="heritage-panel">
            <div className="heritage-panel-head">
              <div>
                <div className="heritage-kicker">
                  <BarChart3 size={14} />
                  Executive reporting
                </div>
                <h3 className="heritage-panel-title">Continuity reports</h3>
              </div>
              <button className="heritage-button-lite" type="button" onClick={handleGenerateReport} disabled={!canManageHeritage}>
                Generate
              </button>
            </div>
            <div>
              {reports.map((item) => (
                <MiniRow key={item.id} label={item.title} value={item.status || item.reportType} />
              ))}
            </div>
          </Card>
        </section>

        <section className="heritage-grid heritage-grid-two">
          <div className="heritage-grid">
            {assets.map((item) => (
              <AssetCard key={item.id} item={item} onUpdate={handleUpdateAsset} disabled={!canManageHeritage} />
            ))}
          </div>

          <Card className="heritage-panel">
            <div className="heritage-kicker">
              <Target size={14} />
              Succession register
            </div>
            <h3 className="heritage-panel-title">Family and ownership continuity</h3>
            <form className="heritage-form" onSubmit={handleCreateSuccession}>
              <input className="heritage-input" value={newSuccession.title} onChange={(event) => setNewSuccession((current) => ({ ...current, title: event.target.value }))} placeholder="Protocol" aria-label="Succession title" />
              <input className="heritage-input" value={newSuccession.owner} onChange={(event) => setNewSuccession((current) => ({ ...current, owner: event.target.value }))} placeholder="Owner" aria-label="Succession owner" />
              <input className="heritage-input" type="number" min="0" max="100" value={newSuccession.readiness} onChange={(event) => setNewSuccession((current) => ({ ...current, readiness: event.target.value }))} placeholder="%" aria-label="Readiness" />
              <button className="heritage-button-lite" type="submit" disabled={!canManageHeritage}>Add</button>
            </form>
            <div>
              {successions.map((item) => (
                <MiniRow key={item.id} label={item.title} value={`${item.readiness}%`} />
              ))}
            </div>
          </Card>
        </section>

        <section className="heritage-grid heritage-grid-two">
          <Card className="heritage-panel">
            <div className="heritage-kicker">
              <ShieldCheck size={14} />
              Protection controls
            </div>
            {protections.map((item) => (
              <div className="heritage-control-row" key={item.id}>
                <span className="muted">{item.name}</span>
                <strong>{item.coverage}%</strong>
              </div>
            ))}
          </Card>

          <Card className="heritage-panel">
            <div className="heritage-kicker">
              <FileText size={14} />
              Connected OS
            </div>
            <h3 className="heritage-panel-title">M&A + Funding + Governance + Board Pack</h3>
            <p className="muted">
              Heritage aporta continuidad patrimonial, sucesión y protección de activos al Executive Overview y al Board Pack.
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
}
