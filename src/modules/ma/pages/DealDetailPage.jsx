import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  Download,
  Globe2,
  Layers3,
  LockKeyhole,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users
} from 'lucide-react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { useMAStore } from '../store/maStore.jsx';
import { useValuationEngine } from '../engine/useValuationEngine.js';
import { formatCurrency } from '../../../shared/utils/formatCurrency.js';
import { ENTERPRISE_MA_DEAL_DETAILS } from '../../../shared/config/demoData.js';

const DEMO_DEAL_DETAILS = ENTERPRISE_MA_DEAL_DETAILS;

const dealDetailCss = `
  .ma-deal-detail-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 34px;
  }

  .ma-deal-detail-hero,
  .ma-detail-panel,
  .ma-detail-empty {
    position: relative;
    overflow: hidden;
    border-radius: 34px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      radial-gradient(circle at 8% 2%, rgba(37, 99, 235, 0.30), transparent 30%),
      radial-gradient(circle at 88% 8%, rgba(16, 185, 129, 0.15), transparent 27%),
      radial-gradient(circle at 55% 120%, rgba(234, 179, 8, 0.07), transparent 30%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.98), rgba(15, 23, 42, 0.94));
    box-shadow:
      0 34px 100px rgba(0, 0, 0, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.055);
  }

  .ma-deal-detail-hero {
    padding: 38px;
  }

  .ma-deal-detail-hero::before,
  .ma-detail-panel::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255,255,255,0.032) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.032) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.78), transparent 86%);
    pointer-events: none;
  }

  .ma-deal-detail-hero-inner {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.35fr) minmax(340px, 0.65fr);
    gap: 32px;
    align-items: stretch;
  }

  .ma-deal-detail-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 24px;
  }

  .ma-deal-detail-title {
    margin: 0;
    max-width: 960px;
    font-size: clamp(40px, 4.8vw, 68px);
    line-height: 0.92;
    letter-spacing: -0.075em;
  }

  .ma-deal-detail-title span {
    display: block;
    margin-top: 8px;
    color: rgba(226, 232, 240, 0.7);
  }

  .ma-deal-detail-copy {
    max-width: 860px;
    margin: 26px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .ma-deal-detail-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 34px;
  }

  .ma-deal-detail-command-bar,
  .ma-detail-metric-grid,
  .ma-detail-grid,
  .ma-premium-grid {
    display: grid;
    gap: 18px;
  }

  .ma-deal-detail-command-bar {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .ma-detail-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ma-premium-grid {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  }

  .ma-detail-metric-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ma-detail-panel,
  .ma-detail-empty {
    padding: 31px;
  }

  .ma-detail-empty {
    text-align: center;
  }

  .ma-detail-panel > * {
    position: relative;
    z-index: 1;
  }

  .ma-detail-status-card,
  .ma-detail-command-item,
  .ma-detail-metric,
  .ma-detail-row,
  .ma-detail-note,
  .ma-ic-card,
  .ma-red-flag-card,
  .ma-room-card {
    border-radius: 24px;
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.085);
  }

  .ma-detail-status-card {
    position: relative;
    z-index: 1;
    padding: 26px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .ma-detail-command-item,
  .ma-detail-metric {
    padding: 20px;
  }

  .ma-detail-command-item strong,
  .ma-detail-metric strong {
    display: block;
    margin-top: 9px;
    font-size: 23px;
    line-height: 1.08;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .ma-detail-kicker {
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

  .ma-detail-panel h2,
  .ma-detail-panel h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .ma-detail-panel-description {
    margin: 11px 0 0;
    line-height: 1.66;
  }

  .ma-detail-list {
    display: flex;
    flex-direction: column;
    gap: 13px;
    margin-top: 24px;
  }

  .ma-detail-row {
    display: grid;
    grid-template-columns: 42px minmax(0, 1fr) minmax(140px, auto);
    gap: 15px;
    align-items: center;
    padding: 17px;
  }

  .ma-detail-row-icon {
    width: 42px;
    height: 42px;
    border-radius: 16px;
    display: grid;
    place-items: center;
    background: rgba(37, 99, 235, 0.14);
    border: 1px solid rgba(96, 165, 250, 0.22);
  }

  .ma-detail-row strong {
    display: block;
    line-height: 1.25;
  }

  .ma-detail-row p {
    margin: 6px 0 0;
    line-height: 1.5;
  }

  .ma-detail-row-value {
    text-align: right;
    font-weight: 800;
    overflow-wrap: anywhere;
  }

  .ma-detail-note {
    margin-top: 24px;
    padding: 20px;
    background:
      radial-gradient(circle at 100% 0%, rgba(234, 179, 8, 0.12), transparent 30%),
      rgba(255,255,255,0.045);
    border-color: rgba(234, 179, 8, 0.18);
  }

  .ma-detail-note strong {
    display: block;
    margin-bottom: 8px;
  }

  .ma-ic-card {
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .ma-ic-card h3 {
    margin: 0;
    font-size: 24px;
    letter-spacing: -0.045em;
  }

  .ma-ic-decision {
    display: inline-flex;
    width: fit-content;
    align-items: center;
    gap: 8px;
    padding: 10px 13px;
    border-radius: 999px;
    color: #bbf7d0;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.24);
    font-size: 12px;
    font-weight: 850;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .ma-ic-decision.watch {
    color: #fde68a;
    background: rgba(234, 179, 8, 0.12);
    border-color: rgba(234, 179, 8, 0.24);
  }

  .ma-ic-decision.hold {
    color: #fecaca;
    background: rgba(239, 68, 68, 0.12);
    border-color: rgba(239, 68, 68, 0.24);
  }

  .ma-ic-list,
  .ma-room-list,
  .ma-red-flag-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .ma-ic-item,
  .ma-room-card,
  .ma-red-flag-card {
    padding: 16px;
  }

  .ma-ic-item {
    border-radius: 20px;
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.07);
  }

  .ma-ic-item strong,
  .ma-room-card strong,
  .ma-red-flag-card strong {
    display: block;
    margin-bottom: 6px;
  }

  .ma-ic-item p,
  .ma-room-card p,
  .ma-red-flag-card p,
  .ma-detail-note p {
    margin: 0;
    line-height: 1.58;
  }

  .ma-room-card {
    display: grid;
    grid-template-columns: 36px minmax(0, 1fr) auto;
    gap: 13px;
    align-items: center;
  }

  .ma-room-status {
    padding: 7px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 850;
    background: rgba(37, 99, 235, 0.14);
    border: 1px solid rgba(96, 165, 250, 0.22);
    white-space: nowrap;
  }

  .ma-red-flag-card {
    display: grid;
    grid-template-columns: 36px minmax(0, 1fr);
    gap: 13px;
    align-items: start;
  }

  .ma-red-icon {
    width: 36px;
    height: 36px;
    border-radius: 15px;
    display: grid;
    place-items: center;
    color: #fde68a;
    background: rgba(234, 179, 8, 0.12);
    border: 1px solid rgba(234, 179, 8, 0.22);
  }

  .ma-detail-timeline {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-top: 24px;
  }

  .ma-detail-timeline-item {
    display: grid;
    grid-template-columns: 38px minmax(0, 1fr);
    gap: 14px;
    align-items: flex-start;
  }

  .ma-detail-timeline-dot {
    width: 38px;
    height: 38px;
    border-radius: 15px;
    display: grid;
    place-items: center;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.22);
    color: #86efac;
  }

  .ma-detail-timeline-item strong {
    display: block;
    margin-bottom: 6px;
  }

  .ma-detail-timeline-item p {
    margin: 0;
    line-height: 1.55;
  }


  .ma-export-action-note {
    flex: 0 0 100%;
    width: 100%;
    margin: 6px 0 0;
    padding-left: 2px;
    color: rgba(203, 213, 225, 0.58);
    font-size: 12px;
    line-height: 1.45;
  }
  @media (max-width: 1180px) {
    .ma-deal-detail-hero-inner,
    .ma-detail-grid,
    .ma-premium-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 760px) {
    .ma-deal-detail-hero,
    .ma-detail-panel,
    .ma-detail-empty {
      padding: 24px;
      border-radius: 26px;
    }

    .ma-deal-detail-command-bar,
    .ma-detail-metric-grid {
      grid-template-columns: 1fr;
    }

    .ma-detail-row,
    .ma-room-card {
      grid-template-columns: 1fr;
    }

    .ma-detail-row-value {
      text-align: left;
    }
  }
`;

export function DealDetailPage() {
  const { dealId } = useParams();
  const { financials, settings, savedCases } = useMAStore();

  const derived = useValuationEngine({
    financials,
    settings
  });

  const reportCurrency = settings?.reportCurrency || financials?.currency || 'EUR';
  const safeSavedCases = Array.isArray(savedCases) ? savedCases : [];

  const deal = useMemo(
    () =>
      resolveDealDetail({
        dealId,
        financials,
        derived,
        savedCases: safeSavedCases,
        currency: reportCurrency
      }),
    [dealId, financials, derived, safeSavedCases, reportCurrency]
  );

  if (!deal) {
    return (
      <div className="page">
        <style>{dealDetailCss}</style>

        <div className="ma-deal-detail-page">
          <section className="ma-detail-empty">
            <div className="ma-detail-kicker">
              <AlertTriangle size={14} />
              Deal not found
            </div>

            <h2>No se ha encontrado esta operacion</h2>

            <p className="muted">
              El identificador no existe en casos de referencia, caso activo ni repositorio.
            </p>

            <div className="ma-deal-detail-actions" style={{ justifyContent: 'center' }}>
              <Link to="/ma/pipeline">
                <Button>
                  <Layers3 size={16} />
                  Abrir Deal Pipeline
                </Button>
              </Link>

              <Link to="/ma/deals">
                <Button variant="secondary">
                  <ArrowLeft size={16} />
                  Deal Repository
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <style>{dealDetailCss}</style>

      <div className="ma-deal-detail-page">
        <section className="ma-deal-detail-hero">
          <div className="ma-deal-detail-hero-inner">
            <div>
              <div className="ma-deal-detail-badges">
                <Badge>M&A Deal Detail</Badge>
                <Badge>{deal.sourceLabel}</Badge>
                <Badge>{deal.stageLabel}</Badge>
                <Badge>{deal.priority}</Badge>
              </div>

              <h1 className="ma-deal-detail-title">
                {deal.name}
                <span>Single deal intelligence file.</span>
              </h1>

              <p className="ma-deal-detail-copy">
                Ficha ejecutiva de operacion con valoracion, fase, prioridad,
                riesgo, tesis, documentacion pendiente y siguiente paso.
                Preparada para evolucionar a IC memo, data room, secure sharing
                y audit trail en fase enterprise.
              </p>

              <div className="ma-deal-detail-actions">
                <Link to="/ma/pipeline">
                  <Button>
                    <Layers3 size={16} />
                    Volver al pipeline
                  </Button>
                </Link>

                <Link to="/ma/valuation">
                  <Button variant="secondary">
                    <BarChart3 size={16} />
                    Valuation Engine
                  </Button>
                </Link>

                <Link to="/ma/cim">
                  <Button variant="secondary">
                    <FileText size={16} />
                    Preparar report
                  </Button>
                </Link>

                <ExportDealBriefButton deal={deal} />

                <ExportICMemoButton deal={deal} />

                <ExportDataRoomButton deal={deal} />

                <div className="ma-export-action-note">
                  Abre documentos HTML premium y desde cada documento puedes guardar como PDF.
                </div>
              </div>

              <div className="ma-deal-detail-command-bar">
                <CommandItem label="Stage" value={deal.stageLabel} />
                <CommandItem label="Owner" value={deal.owner} />
                <CommandItem label="Updated" value={deal.updatedLabel} />
              </div>
            </div>

            <aside className="ma-detail-status-card">
              <div className="ma-detail-kicker">
                <Sparkles size={14} />
                Deal Signal
              </div>

              <h3 style={{ margin: 0 }}>{deal.signalTitle}</h3>

              <p className="muted" style={{ margin: 0, lineHeight: 1.62 }}>
                {deal.recommendedAction}
              </p>

              <CommandItem label="Risk" value={deal.riskLabel} />
              <CommandItem label="Quality score" value={deal.qualityScoreLabel} />
            </aside>
          </div>
        </section>

        <section className="ma-detail-grid">
          <section className="ma-detail-panel">
            <PanelHeader
              kicker="Valuation snapshot"
              icon={TrendingUp}
              title="Deal economics"
              description="Resumen economico principal de la operacion."
            />

            <div className="ma-detail-metric-grid">
              <Metric label="Equity Value" value={deal.equityLabel} />
              <Metric label="Enterprise Value" value={deal.enterpriseLabel} />
              <Metric label="EBITDA normalizado" value={deal.ebitdaLabel} />
              <Metric label="Multiplo ajustado" value={deal.multipleLabel} />
            </div>

            <div className="ma-detail-note">
              <strong>Executive interpretation</strong>
              <p className="muted">
                La valoracion debe tratarse como lectura preliminar. La decision
                real depende de calidad de beneficios, deuda, caja, working
                capital, concentracion, contratos y comparables externos.
              </p>
            </div>
          </section>

          <section className="ma-detail-panel">
            <PanelHeader
              kicker="Deal profile"
              icon={BriefcaseBusiness}
              title="Target profile"
              description="Identidad, mercado y contexto de la operacion."
            />

            <div className="ma-detail-list">
              <DetailRow icon={BriefcaseBusiness} title="Company" description="Target o caso guardado." value={deal.name} />
              <DetailRow icon={Globe2} title="Market" description="Geografia o mercado principal." value={deal.market} />
              <DetailRow icon={Target} title="Sector" description="Sector de referencia." value={deal.sector} />
              <DetailRow icon={Users} title="Owner" description="Responsable operativo." value={deal.owner} />
            </div>
          </section>
        </section>

        <section className="ma-premium-grid">
          <section className="ma-detail-panel">
            <PanelHeader
              kicker="Investment committee"
              icon={Scale}
              title="IC Memo Snapshot"
              description="Resumen preparado para decision interna de comite."
            />

            <InvestmentCommitteeMemo memo={deal.icMemo} />
          </section>

          <section className="ma-detail-panel">
            <PanelHeader
              kicker="Red flags"
              icon={AlertTriangle}
              title="Red Flags & Mitigants"
              description="Riesgos principales y mitigantes antes de avanzar."
            />

            <div className="ma-red-flag-list">
              {deal.redFlags.map((item, index) => (
                <div className="ma-red-flag-card" key={`${item.title}-${index}`}>
                  <div className="ma-red-icon">
                    <AlertTriangle size={15} />
                  </div>

                  <div>
                    <strong>{item.title}</strong>
                    <p className="muted">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>

        <section className="ma-detail-grid">
          <section className="ma-detail-panel">
            <PanelHeader
              kicker="Data room readiness"
              icon={LockKeyhole}
              title="Data Room Checklist"
              description="Bloques documentales minimos para elevar el deal a fase enterprise."
            />

            <div className="ma-room-list">
              {deal.dataRoom.map((item, index) => (
                <div className="ma-room-card" key={`${item.title}-${index}`}>
                  <div className="ma-detail-row-icon">
                    <CheckCircle2 size={15} />
                  </div>

                  <div>
                    <strong>{item.title}</strong>
                    <p className="muted">{item.description}</p>
                  </div>

                  <span className="ma-room-status">{item.status}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="ma-detail-panel">
            <PanelHeader
              kicker="Execution discipline"
              icon={CheckCircle2}
              title="Next actions"
              description="Checklist operativo para avanzar con control."
            />

            <div className="ma-detail-list">
              {deal.nextActions.map((item, index) => (
                <DetailRow
                  key={`${item.title}-${index}`}
                  icon={index === 0 ? AlertTriangle : CheckCircle2}
                  title={item.title}
                  description={item.description}
                  value={item.status}
                />
              ))}
            </div>
          </section>
        </section>

        <section className="ma-detail-panel">
          <PanelHeader
            kicker="Activity timeline"
            icon={Clock3}
            title="Deal timeline"
            description="Trazabilidad preliminar del caso."
          />

          <div className="ma-detail-timeline">
            {deal.timeline.map((item, index) => (
              <div className="ma-detail-timeline-item" key={`${item.title}-${index}`}>
                <div className="ma-detail-timeline-dot">
                  <CheckCircle2 size={15} />
                </div>

                <div>
                  <strong>{item.title}</strong>
                  <p className="muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ExportDealBriefButton({ deal }) {
  function handleExportDealBrief() {
    openPremiumHtmlExport({
      html: addHtmlPrintToolbar({
        html: buildDealBriefHtml(deal),
        title: 'M&A Deal Brief'
      }),
      fileName: `${slugifyFileName(deal?.name || 'deal')}-brief.html`
    });
  }

  return (
    <Button variant="secondary" onClick={handleExportDealBrief}>
      <Download size={16} />
      Deal Brief
    </Button>
  );
}

function ExportICMemoButton({ deal }) {
  function handleExportICMemo() {
    openPremiumHtmlExport({
      html: addHtmlPrintToolbar({
        html: buildICMemoHtml(deal),
        title: 'Investment Committee Memo'
      }),
      fileName: `${slugifyFileName(deal?.name || 'deal')}-ic-memo.html`
    });
  }

  return (
    <Button variant="secondary" onClick={handleExportICMemo}>
      <Download size={16} />
      IC Memo
    </Button>
  );
}

function ExportDataRoomButton({ deal }) {
  function handleExportDataRoom() {
    openPremiumHtmlExport({
      html: addHtmlPrintToolbar({
        html: buildDataRoomHtml(deal),
        title: 'Data Room Checklist'
      }),
      fileName: `${slugifyFileName(deal?.name || 'deal')}-data-room.html`
    });
  }

  return (
    <Button variant="secondary" onClick={handleExportDataRoom}>
      <Download size={16} />
      Data Room
    </Button>
  );
}

function openPremiumHtmlExport({ html, fileName }) {
  const blob = new Blob([html], {
    type: 'text/html;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const openedWindow = window.open(url, '_blank', 'noopener,noreferrer');

  if (!openedWindow) {
    downloadHtmlExport({ html, fileName });
  }

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 60000);
}

function downloadHtmlExport({ html, fileName }) {
  const blob = new Blob([html], {
    type: 'text/html;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

function addHtmlPrintToolbar({ html, title }) {
  const safeTitle = escapeHtml(title || 'CEO OS Export');

  const toolbarCss = `
  <style>
    .ceos-export-toolbar {
      position: sticky;
      top: 0;
      z-index: 99999;
      max-width: 1180px;
      margin: 0 auto 18px;
      padding: 12px 14px;
      border-radius: 20px;
      display: flex;
      justify-content: space-between;
      gap: 14px;
      align-items: center;
      color: #0f172a;
      background:
        radial-gradient(circle at 0% 0%, rgba(29,78,216,0.10), transparent 34%),
        rgba(255,255,255,0.96);
      border: 1px solid #d8e0eb;
      box-shadow: 0 18px 48px rgba(15, 23, 42, 0.12);
      backdrop-filter: blur(16px);
    }

    .ceos-export-toolbar strong {
      display: block;
      font-size: 14px;
      letter-spacing: -0.03em;
    }

    .ceos-export-toolbar span {
      display: block;
      margin-top: 3px;
      color: #64748b;
      font-size: 12px;
      line-height: 1.35;
    }

    .ceos-export-toolbar-actions {
      display: flex;
      gap: 10px;
      align-items: center;
      flex: 0 0 auto;
    }

    .ceos-export-toolbar button {
      cursor: pointer;
      min-height: 38px;
      padding: 0 15px;
      border-radius: 999px;
      color: #ffffff;
      background: linear-gradient(135deg, #1d4ed8, #0f172a);
      border: 1px solid rgba(29,78,216,0.24);
      font: inherit;
      font-size: 12px;
      font-weight: 850;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      box-shadow: 0 12px 28px rgba(29, 78, 216, 0.22);
    }

    .ceos-export-toolbar button:hover {
      transform: translateY(-1px);
    }

    @media print {
      .ceos-export-toolbar {
        display: none !important;
      }
    }

    @media (max-width: 760px) {
      .ceos-export-toolbar {
        align-items: flex-start;
        flex-direction: column;
      }

      .ceos-export-toolbar-actions,
      .ceos-export-toolbar button {
        width: 100%;
      }
    }
  </style>`;

  const toolbarHtml = `
  <div class="ceos-export-toolbar">
    <div>
      <strong>CEO's OS · ${safeTitle}</strong>
      <span>Documento HTML premium. Usa el boton para imprimir o guardar como PDF.</span>
    </div>

    <div class="ceos-export-toolbar-actions">
      <button type="button" onclick="window.print()">Guardar como PDF / Imprimir</button>
    </div>
  </div>`;

  let output = String(html || '');

  if (output.includes('</head>')) {
    output = output.replace('</head>', `${toolbarCss}</head>`);
  }

  if (output.includes('<body>')) {
    output = output.replace('<body>', `<body>${toolbarHtml}`);
  }

  return output;
}
function buildDataRoomHtml(deal) {
  const generatedAt = getExportGeneratedAt();

  const dataRoomItems = Array.isArray(deal?.dataRoom) ? deal.dataRoom : [];
  const missingItems = dataRoomItems.filter(
    (item) => String(item?.status || '').toLowerCase() !== 'ready'
  );

  const readyItems = dataRoomItems.length - missingItems.length;

  const readinessSummary =
    missingItems.length === 0
      ? 'Data room ready for controlled sharing.'
      : `${missingItems.length} item(s) require review before controlled sharing.`;

  return buildPremiumExportHtml({
    fileTitle: `${deal?.name || 'Deal'} - Data Room Checklist`,
    reportType: 'Data Room Checklist',
    documentLabel: 'Diligence Control Pack',
    title: deal?.name,
    subtitle:
      'Controlled documentary readiness pack for diligence preparation, secure sharing governance and execution discipline.',
    generatedAt,
    badges: ["CEO's OS", 'Data Room', deal?.stageLabel, deal?.priority],
    heroStats: [
      ['Readiness', readinessSummary],
      ['Ready items', `${readyItems}/${dataRoomItems.length}`],
      ['Risk', deal?.riskLabel],
      ['Owner', deal?.owner]
    ],
    summaryTitle: 'Data Room Readiness',
    summaryCopy: readinessSummary,
    sections: [
      {
        eyebrow: '01 · Deal context',
        title: 'Target control panel',
        layout: 'two',
        body: renderBriefRows([
          ['Target', deal?.name],
          ['Sector', deal?.sector],
          ['Market', deal?.market],
          ['Owner', deal?.owner],
          ['Stage', deal?.stageLabel],
          ['Risk', deal?.riskLabel],
          ['Quality Score', deal?.qualityScoreLabel],
          ['Updated', deal?.updatedLabel]
        ])
      },
      {
        eyebrow: '02 · Document readiness',
        title: 'Checklist',
        body: renderDataRoomChecklistRows(dataRoomItems)
      },
      {
        eyebrow: '03 · Exceptions',
        title: 'Required / Review items',
        body:
          missingItems.length > 0
            ? renderDataRoomChecklistRows(missingItems)
            : '<p class="empty-note">All checklist items are currently marked as Ready.</p>'
      },
      {
        eyebrow: '04 · Governance',
        title: 'Sharing control notes',
        body: `
          <div class="item governance">
            <div class="item-marker">A</div>
            <div>
              <h3>Before external sharing</h3>
              <p>Validate permissions, confidentiality perimeter, human review, document source and latest available financial information.</p>
            </div>
          </div>
          <div class="item governance">
            <div class="item-marker">B</div>
            <div>
              <h3>Enterprise extension</h3>
              <p>Requiere enlaces firmados, expiración, revocación, versionado documental y audit trail por organización antes de circulación externa.</p>
            </div>
          </div>
        `
      }
    ],
    footer:
      "Internal use only. This Data Room Checklist is generated from CEO's OS and does not replace legal, financial, tax or operational due diligence. Human review is required before external circulation."
  });
}

function buildICMemoHtml(deal) {
  const generatedAt = getExportGeneratedAt();

  const approvals = [
    {
      title: 'Financial validation',
      description:
        'Confirm normalized EBITDA, net debt, cash, working capital and non-recurring adjustments.'
    },
    {
      title: 'Legal perimeter',
      description:
        'Validate corporate structure, key contracts, contingencies, permits and closing capacity.'
    },
    {
      title: 'Commercial diligence',
      description:
        'Review customer concentration, commercial pipeline, churn, recurrence and growth assumptions.'
    },
    {
      title: 'Committee decision',
      description:
        'Authorize advance, keep under review or block external circulation based on available evidence.'
    }
  ];

  return buildPremiumExportHtml({
    fileTitle: `${deal?.name || 'Deal'} - IC Memo`,
    reportType: 'Investment Committee Memo',
    documentLabel: 'Board Decision Pack',
    title: deal?.name,
    subtitle:
      'Committee-ready decision memo with recommendation, valuation view, execution posture and required approvals.',
    generatedAt,
    badges: ["CEO's OS", 'IC Memo', deal?.stageLabel, deal?.priority],
    heroStats: [
      ['Recommendation', deal?.icMemo?.decision],
      ['Quality Score', deal?.qualityScoreLabel],
      ['Risk', deal?.riskLabel],
      ['Enterprise Value', deal?.enterpriseLabel]
    ],
    summaryTitle: 'Committee Recommendation',
    summaryCopy: deal?.icMemo?.summary,
    decision: deal?.icMemo?.decision,
    sections: [
      {
        eyebrow: '01 · Investment snapshot',
        title: 'Deal snapshot',
        layout: 'two',
        body: renderBriefRows([
          ['Target', deal?.name],
          ['Sector', deal?.sector],
          ['Market', deal?.market],
          ['Owner', deal?.owner],
          ['Stage', deal?.stageLabel],
          ['Risk', deal?.riskLabel],
          ['Enterprise Value', deal?.enterpriseLabel],
          ['Equity Value', deal?.equityLabel],
          ['EBITDA normalizado', deal?.ebitdaLabel],
          ['Multiplo ajustado', deal?.multipleLabel],
          ['Quality Score', deal?.qualityScoreLabel],
          ['Updated', deal?.updatedLabel]
        ])
      },
      {
        eyebrow: '02 · Committee logic',
        title: 'Strategic rationale, valuation view & committee ask',
        body: renderMemoItems(deal?.icMemo?.items || [])
      },
      {
        eyebrow: '03 · Risk review',
        title: 'Red flags & mitigants',
        body: renderRedFlags(deal?.redFlags || [])
      },
      {
        eyebrow: '04 · Approvals',
        title: 'Required approvals',
        body: renderApprovalItems(approvals)
      }
    ],
    footer:
      "Internal use only. This IC Memo is generated from CEO's OS and does not constitute legal advice, tax advice, valuation opinion, fairness opinion or final investment recommendation. Human review and supporting documentation are required before any investment decision."
  });
}

function buildDealBriefHtml(deal) {
  const generatedAt = getExportGeneratedAt();

  const metrics = [
    ['Equity Value', deal?.equityLabel],
    ['Enterprise Value', deal?.enterpriseLabel],
    ['EBITDA normalizado', deal?.ebitdaLabel],
    ['Multiplo ajustado', deal?.multipleLabel],
    ['Quality Score', deal?.qualityScoreLabel],
    ['Risk', deal?.riskLabel]
  ];

  const profile = [
    ['Target', deal?.name],
    ['Sector', deal?.sector],
    ['Market', deal?.market],
    ['Owner', deal?.owner],
    ['Stage', deal?.stageLabel],
    ['Priority', deal?.priority],
    ['Source', deal?.sourceLabel],
    ['Updated', deal?.updatedLabel]
  ];

  return buildPremiumExportHtml({
    fileTitle: `${deal?.name || 'Deal'} - Deal Brief`,
    reportType: 'M&A Deal Brief',
    documentLabel: 'Executive Deal Dossier',
    title: deal?.name,
    subtitle:
      'Executive deal intelligence package for internal review, investor preparation, IC discussion and controlled decision-making.',
    generatedAt,
    badges: ["CEO's OS", 'M&A Deal Brief', deal?.stageLabel, deal?.priority],
    heroStats: [
      ['Equity Value', deal?.equityLabel],
      ['Enterprise Value', deal?.enterpriseLabel],
      ['Quality Score', deal?.qualityScoreLabel],
      ['Risk', deal?.riskLabel]
    ],
    summaryTitle: 'Executive Summary',
    summaryCopy: deal?.recommendedAction,
    sections: [
      {
        eyebrow: '01 · Target intelligence',
        title: 'Target profile',
        layout: 'two',
        body: renderBriefRows(profile)
      },
      {
        eyebrow: '02 · Valuation',
        title: 'Valuation snapshot',
        layout: 'two',
        body: renderBriefRows(metrics)
      },
      {
        eyebrow: '03 · Investment committee',
        title: 'IC memo snapshot',
        body: `
          <div class="featured-memo">
            <span class="decision">${escapeHtml(deal?.icMemo?.decision)}</span>
            <h3 class="lead-title">${escapeHtml(deal?.icMemo?.title)}</h3>
            <p>${escapeHtml(deal?.icMemo?.summary)}</p>
          </div>
          <div class="stack">${renderMemoItems(deal?.icMemo?.items || [])}</div>
        `
      },
      {
        eyebrow: '04 · Data room',
        title: 'Data room readiness',
        body: renderDataRoomItems(deal?.dataRoom || [])
      },
      {
        eyebrow: '05 · Risks',
        title: 'Red flags & mitigants',
        body: renderRedFlags(deal?.redFlags || [])
      },
      {
        eyebrow: '06 · Execution',
        title: 'Next actions',
        body: renderActionItems(deal?.nextActions || [])
      },
      {
        eyebrow: '07 · Timeline',
        title: 'Deal timeline',
        body: renderTimelineItems(deal?.timeline || [])
      }
    ],
    footer:
      "This document is an internal executive brief generated from CEO's OS. It is not a fairness opinion, legal advice, tax advice or final investment recommendation."
  });
}

function buildPremiumExportHtml({
  fileTitle,
  reportType,
  documentLabel,
  title,
  subtitle,
  generatedAt,
  badges,
  heroStats,
  summaryTitle,
  summaryCopy,
  decision,
  sections,
  footer
}) {
  const safeBadges = Array.isArray(badges) ? badges.filter(Boolean) : [];
  const safeHeroStats = Array.isArray(heroStats) ? heroStats : [];
  const safeSections = Array.isArray(sections) ? sections : [];

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(fileTitle)}</title>
  <style>
    ${getPremiumExportCss()}
  </style>
</head>
<body>
  <main class="page">
    <section class="cover">
      <div class="noise"></div>
      <div class="watermark">CEO</div>

      <div class="cover-top">
        <div class="brand">
          <div class="brand-symbol">OS</div>
          <div>
            <div class="brand-mark">CEO's OS</div>
            <div class="brand-subtitle">Sovereign Executive Intelligence</div>
          </div>
        </div>

        <div class="classification">
          <span>Strictly confidential</span>
          <strong>${escapeHtml(reportType)}</strong>
        </div>
      </div>

      <div class="document-label">${escapeHtml(documentLabel || reportType)}</div>

      <div class="eyebrow">
        ${renderExportBadges(safeBadges)}
      </div>

      <h1>${escapeHtml(title)}</h1>

      <p class="hero-copy">${escapeHtml(subtitle)}</p>

      <div class="hero-stats">
        ${renderHeroStats(safeHeroStats)}
      </div>

      <div class="cover-footer">
        <div>
          <span>Generated</span>
          <strong>${escapeHtml(generatedAt)}</strong>
        </div>

        <div>
          <span>Prepared by</span>
          <strong>CEO's OS</strong>
        </div>

        <div>
          <span>Use</span>
          <strong>Internal decision support</strong>
        </div>
      </div>
    </section>

    <section class="section executive-summary">
      <div class="section-header">
        <div>
          <div class="section-label">Executive summary</div>
          <h2>${escapeHtml(summaryTitle)}</h2>
        </div>
        ${
          decision
            ? `<span class="decision">${escapeHtml(decision)}</span>`
            : ''
        }
      </div>

      <p>${escapeHtml(summaryCopy)}</p>
    </section>

    ${renderExportSections(safeSections)}

    <div class="footer">
      <strong>CEO's OS</strong>
      <span>${escapeHtml(footer)}</span>
    </div>
  </main>
</body>
</html>`;
}

function getPremiumExportCss() {
  return `
    :root {
      color-scheme: light;
      --ink: #0b1220;
      --muted: #526174;
      --muted-2: #64748b;
      --line: #d8e0eb;
      --line-soft: #edf2f7;
      --soft: #f8fafc;
      --blue: #1d4ed8;
      --navy: #020617;
      --green: #047857;
      --gold: #a16207;
      --gold-2: #f59e0b;
      --danger: #b91c1c;
      --shadow: 0 30px 90px rgba(15, 23, 42, 0.14);
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    html,
    body {
      background: #ffffff !important;
    }

    html {
      background: #f8fafc;
    }

    body {
      margin: 0;
      padding: 38px;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--ink);
      background:
        radial-gradient(circle at 0% 0%, rgba(29, 78, 216, 0.10), transparent 26%),
        radial-gradient(circle at 100% 0%, rgba(16, 185, 129, 0.07), transparent 28%),
        linear-gradient(180deg, #ffffff, #f8fafc 64%, #eef4fb);
    }

    .page {
      background: linear-gradient(180deg, #f3f7fb 0%, #ffffff 26%, #ffffff 100%);
      padding: 14px;
      border-radius: 30px;
      box-shadow: 0 22px 70px rgba(15, 23, 42, 0.08);
      max-width: 1160px;
      margin: 0 auto;
    }

    .cover {
      position: relative;
      overflow: hidden;
      min-height: 590px;
      padding: 44px;
      border-radius: 38px;
      color: #ffffff;
      background:
        radial-gradient(circle at 9% 0%, rgba(96, 165, 250, 0.45), transparent 33%),
        radial-gradient(circle at 94% 8%, rgba(16, 185, 129, 0.26), transparent 30%),
        radial-gradient(circle at 58% 118%, rgba(245, 158, 11, 0.16), transparent 32%),
        linear-gradient(135deg, #020617 0%, #0f172a 54%, #111827 100%);
      box-shadow: var(--shadow);
      border: 1px solid rgba(255,255,255,0.13);
    }

    .cover::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px);
      background-size: 46px 46px;
      mask-image: linear-gradient(to bottom, rgba(0,0,0,0.95), transparent 88%);
      pointer-events: none;
    }

    .cover::after {
      content: "";
      position: absolute;
      right: -150px;
      bottom: -190px;
      width: 520px;
      height: 520px;
      border-radius: 999px;
      background:
        radial-gradient(circle, rgba(59, 130, 246, 0.20), transparent 67%);
      pointer-events: none;
    }

    .noise {
      position: absolute;
      inset: 0;
      opacity: 0.12;
      background-image:
        radial-gradient(circle at 1px 1px, rgba(255,255,255,0.75) 1px, transparent 0);
      background-size: 18px 18px;
      mask-image: linear-gradient(to bottom right, rgba(0,0,0,0.9), transparent 70%);
      pointer-events: none;
    }

    .cover > *:not(.watermark):not(.noise) {
      position: relative;
      z-index: 2;
    }

    .watermark {
      position: absolute;
      right: 30px;
      bottom: -8px;
      z-index: 1;
      font-size: 205px;
      line-height: 1;
      font-weight: 950;
      letter-spacing: -0.10em;
      color: rgba(255,255,255,0.035);
      pointer-events: none;
    }

    .cover-top {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      align-items: flex-start;
      margin-bottom: 42px;
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 14px;
    }

    .brand-symbol {
      width: 52px;
      height: 52px;
      border-radius: 18px;
      display: grid;
      place-items: center;
      color: #bfdbfe;
      background:
        radial-gradient(circle at 30% 20%, rgba(147,197,253,0.34), transparent 48%),
        rgba(255,255,255,0.065);
      border: 1px solid rgba(147,197,253,0.20);
      font-size: 16px;
      font-weight: 950;
      letter-spacing: -0.08em;
    }

    .brand-mark {
      font-size: 24px;
      font-weight: 950;
      letter-spacing: -0.065em;
    }

    .brand-subtitle,
    .classification span,
    .section-label,
    .metric span,
    .row span,
    .cover-footer span,
    .document-label {
      font-size: 10px;
      font-weight: 875;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .brand-subtitle {
      margin-top: 7px;
      color: rgba(226, 232, 240, 0.62);
    }

    .classification {
      min-width: 250px;
      padding: 16px 18px;
      border-radius: 22px;
      background: rgba(255,255,255,0.068);
      border: 1px solid rgba(255,255,255,0.14);
      text-align: right;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
    }

    .classification span {
      display: block;
      margin-bottom: 8px;
      color: #fde68a;
    }

    .classification strong {
      display: block;
      font-size: 15px;
      line-height: 1.22;
    }

    .document-label {
      display: inline-flex;
      width: fit-content;
      margin-bottom: 18px;
      padding: 10px 13px;
      border-radius: 999px;
      color: #0f172a;
      background: linear-gradient(135deg, #f8fafc, #bfdbfe);
      border: 1px solid rgba(255,255,255,0.35);
    }

    .eyebrow {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 24px;
    }

    .badge {
      padding: 8px 10px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 875;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: rgba(219, 234, 254, 0.96);
      background: rgba(96, 165, 250, 0.14);
      border: 1px solid rgba(147, 197, 253, 0.22);
    }

    h1 {
      max-width: 930px;
      margin: 0;
      font-size: 64px;
      line-height: 0.89;
      letter-spacing: -0.085em;
    }

    h2 {
      margin: 0;
      font-size: 28px;
      line-height: 1.08;
      letter-spacing: -0.058em;
    }

    h3 {
      margin: 0 0 8px;
      font-size: 15px;
      letter-spacing: -0.018em;
    }

    .lead-title {
      font-size: 20px;
      margin-bottom: 10px;
    }

    p {
      margin: 0;
      line-height: 1.66;
      color: var(--muted);
    }

    .hero-copy {
      max-width: 810px;
      margin-top: 24px;
      color: rgba(226, 232, 240, 0.80);
      font-size: 17px;
      line-height: 1.72;
    }

    .hero-stats {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
      margin-top: 38px;
    }

    .metric {
      min-height: 118px;
      padding: 18px;
      border-radius: 24px;
      background:
        linear-gradient(135deg, rgba(255,255,255,0.09), rgba(255,255,255,0.035));
      border: 1px solid rgba(255,255,255,0.13);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
    }

    .metric span {
      display: block;
      color: rgba(226, 232, 240, 0.58);
    }

    .metric strong {
      display: block;
      color: #ffffff;
      font-size: 22px;
      line-height: 1.08;
      letter-spacing: -0.047em;
      overflow-wrap: anywhere;
    }

    .cover-footer {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin-top: 38px;
      padding-top: 24px;
      border-top: 1px solid rgba(226, 232, 240, 0.15);
    }

    .cover-footer div {
      padding: 12px 0 0;
    }

    .cover-footer span {
      display: block;
      color: rgba(226, 232, 240, 0.50);
      margin-bottom: 7px;
    }

    .cover-footer strong {
      display: block;
      color: #ffffff;
      line-height: 1.25;
      overflow-wrap: anywhere;
    }

    .section {
      position: relative;
      overflow: hidden;
      margin-top: 26px;
      padding: 30px;
      border-radius: 30px;
      border: 1px solid var(--line);
      background:
        radial-gradient(circle at 100% 0%, rgba(29, 78, 216, 0.045), transparent 28%),
        rgba(255,255,255,0.96);
      box-shadow: 0 20px 55px rgba(15, 23, 42, 0.075);
      break-inside: avoid;
    }

    .section::before {
      content: "";
      position: absolute;
      left: 0;
      top: 28px;
      bottom: 28px;
      width: 4px;
      border-radius: 999px;
      background: linear-gradient(180deg, #2563eb, #10b981);
    }

    .executive-summary {
      background:
        radial-gradient(circle at 100% 0%, rgba(29, 78, 216, 0.10), transparent 32%),
        linear-gradient(135deg, #ffffff, #f8fafc);
      border-color: rgba(29, 78, 216, 0.14);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      align-items: flex-start;
      margin-bottom: 18px;
    }

    .section-label {
      margin-bottom: 11px;
      color: var(--blue);
    }

    .grid {
      display: grid;
      gap: 13px;
    }

    .grid.two {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .stack {
      margin-top: 18px;
    }

    .row,
    .item {
      position: relative;
      padding: 17px;
      border-radius: 20px;
      background:
        linear-gradient(135deg, #ffffff, var(--soft));
      border: 1px solid var(--line-soft);
      box-shadow: 0 10px 28px rgba(15, 23, 42, 0.045);
    }

    .row span {
      display: block;
      margin-bottom: 8px;
      color: var(--muted-2);
    }

    .row strong {
      display: block;
      font-size: 19px;
      line-height: 1.17;
      letter-spacing: -0.04em;
      overflow-wrap: anywhere;
    }

    .item + .item {
      margin-top: 13px;
    }

    .item p {
      color: var(--muted);
    }

    .featured-memo {
      padding: 20px;
      border-radius: 24px;
      background:
        radial-gradient(circle at 100% 0%, rgba(4,120,87,0.10), transparent 30%),
        linear-gradient(135deg, #ffffff, #f8fafc);
      border: 1px solid rgba(4,120,87,0.14);
      margin-bottom: 18px;
    }

    .decision {
      display: inline-flex;
      width: fit-content;
      padding: 9px 12px;
      border-radius: 999px;
      color: var(--green);
      background: rgba(4,120,87,0.08);
      border: 1px solid rgba(4,120,87,0.16);
      font-size: 11px;
      font-weight: 950;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .status {
      display: inline-flex;
      margin-top: 11px;
      padding: 7px 9px;
      border-radius: 999px;
      color: var(--blue);
      background: rgba(29,78,216,0.08);
      border: 1px solid rgba(29,78,216,0.16);
      font-size: 11px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .ready {
      color: var(--green);
      background: rgba(4,120,87,0.08);
      border-color: rgba(4,120,87,0.16);
    }

    .required,
    .red-flag {
      color: var(--danger);
      background:
        radial-gradient(circle at 100% 0%, rgba(185,28,28,0.08), transparent 35%),
        rgba(254,242,242,0.82);
      border-color: rgba(185,28,28,0.18);
    }

    .review,
    .watch {
      color: var(--gold);
      background: rgba(254,252,232,0.90);
      border-color: rgba(161,98,7,0.18);
    }

    .red-flag p {
      color: #7f1d1d;
    }

    .governance {
      display: grid;
      grid-template-columns: 42px minmax(0, 1fr);
      gap: 14px;
      align-items: start;
      border-color: rgba(29, 78, 216, 0.14);
      background:
        radial-gradient(circle at 100% 0%, rgba(29,78,216,0.08), transparent 32%),
        linear-gradient(135deg, #ffffff, var(--soft));
    }

    .item-marker {
      width: 42px;
      height: 42px;
      border-radius: 16px;
      display: grid;
      place-items: center;
      color: #1d4ed8;
      background: rgba(29,78,216,0.08);
      border: 1px solid rgba(29,78,216,0.15);
      font-weight: 950;
    }

    .empty-note {
      padding: 17px;
      border-radius: 20px;
      color: var(--green);
      background: rgba(4,120,87,0.08);
      border: 1px solid rgba(4,120,87,0.16);
    }

    .footer {
      margin-top: 30px;
      padding: 22px 0 4px;
      border-top: 1px solid var(--line);
      display: grid;
      gap: 8px;
      color: var(--muted);
      font-size: 12px;
    }

    .footer strong {
      color: var(--ink);
      letter-spacing: -0.025em;
    }

    @media (max-width: 900px) {
      body {
        padding: 18px;
      }

      .cover,
      .section {
        padding: 24px;
        border-radius: 24px;
      }

      .cover-top,
      .section-header,
      .cover-footer,
      .hero-stats,
      .grid.two {
        grid-template-columns: 1fr;
        display: grid;
      }

      .classification {
        text-align: left;
      }

      h1 {
        font-size: 40px;
      }
    }

    @media print {
      @page {
        margin: 12mm;
        size: A4;
      }

      body {
        padding: 0;
        background: #ffffff;
      }

      .page {
        max-width: 100%;
      }

      .cover {
        min-height: 440px;
        box-shadow: none;
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }

      .section {
        box-shadow: none;
        break-inside: avoid;
      }

      .footer {
        break-inside: avoid;
      }
    }
  `;
}

function getExportGeneratedAt() {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date());
}

function renderHeroStats(items) {
  return items
    .map(
      ([label, value]) => `
        <div class="metric">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value || 'N/A')}</strong>
        </div>
      `
    )
    .join('');
}

function renderExportBadges(items) {
  return items
    .map((item) => `<span class="badge">${escapeHtml(item)}</span>`)
    .join('');
}

function renderExportSections(sections) {
  return sections
    .map((section) => {
      const layoutClass = section?.layout === 'two' ? ' grid two' : '';

      return `
        <section class="section">
          <div class="section-header">
            <div>
              <div class="section-label">${escapeHtml(section?.eyebrow || 'Section')}</div>
              <h2>${escapeHtml(section?.title)}</h2>
            </div>
          </div>

          <div class="${layoutClass.trim()}">
            ${section?.body || ''}
          </div>
        </section>
      `;
    })
    .join('');
}

function renderBriefRows(rows) {
  return rows
    .map(
      ([label, value]) => `
        <div class="row">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(value || 'N/A')}</strong>
        </div>
      `
    )
    .join('');
}

function renderMemoItems(items) {
  return items
    .map(
      (item) => `
        <div class="item">
          <h3>${escapeHtml(item?.label)}</h3>
          <p>${escapeHtml(item?.value)}</p>
        </div>
      `
    )
    .join('');
}

function renderDataRoomItems(items) {
  return items
    .map((item) => {
      const status = String(item?.status || 'Review');
      const tone = getStatusTone(status);

      return `
        <div class="item">
          <h3>${escapeHtml(item?.title)}</h3>
          <p>${escapeHtml(item?.description)}</p>
          <span class="status ${escapeHtml(tone)}">${escapeHtml(status)}</span>
        </div>
      `;
    })
    .join('');
}

function renderDataRoomChecklistRows(items) {
  return renderDataRoomItems(items);
}

function renderRedFlags(items) {
  return items
    .map(
      (item) => `
        <div class="item red-flag">
          <h3>${escapeHtml(item?.title)}</h3>
          <p>${escapeHtml(item?.description)}</p>
        </div>
      `
    )
    .join('');
}

function renderActionItems(items) {
  return items
    .map(
      (item) => `
        <div class="item">
          <h3>${escapeHtml(item?.title)} · ${escapeHtml(item?.status)}</h3>
          <p>${escapeHtml(item?.description)}</p>
        </div>
      `
    )
    .join('');
}

function renderTimelineItems(items) {
  return items
    .map(
      (item) => `
        <div class="item">
          <h3>${escapeHtml(item?.title)}</h3>
          <p>${escapeHtml(item?.description)}</p>
        </div>
      `
    )
    .join('');
}

function renderApprovalItems(items) {
  return items
    .map(
      (item) => `
        <div class="item governance">
          <div class="item-marker">✓</div>
          <div>
            <h3>${escapeHtml(item?.title)}</h3>
            <p>${escapeHtml(item?.description)}</p>
          </div>
        </div>
      `
    )
    .join('');
}

function getStatusTone(status) {
  const normalized = String(status || '').toLowerCase();

  if (normalized.includes('ready')) return 'ready';
  if (normalized.includes('required')) return 'required';
  if (normalized.includes('review')) return 'review';
  if (normalized.includes('watch')) return 'watch';

  return '';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function slugifyFileName(value) {
  return String(value || 'deal')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
function CommandItem({ label, value }) {
  return (
    <div className="ma-detail-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function PanelHeader({ kicker, icon: Icon, title, description }) {
  return (
    <div>
      <div className="ma-detail-kicker">
        <Icon size={14} />
        {kicker}
      </div>

      <h2>{title}</h2>
      <p className="muted ma-detail-panel-description">{description}</p>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="ma-detail-metric">
      <div>
        <div className="kpi-label">{label}</div>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, title, description, value }) {
  return (
    <div className="ma-detail-row">
      <div className="ma-detail-row-icon">
        <Icon size={16} />
      </div>

      <div>
        <strong>{title}</strong>
        <p className="muted">{description}</p>
      </div>

      <div className="ma-detail-row-value">{value}</div>
    </div>
  );
}

function InvestmentCommitteeMemo({ memo }) {
  return (
    <div className="ma-ic-card">
      <span className={`ma-ic-decision ${memo.tone}`.trim()}>
        <ShieldCheck size={13} />
        {memo.decision}
      </span>

      <h3>{memo.title}</h3>

      <p className="muted" style={{ margin: 0, lineHeight: 1.66 }}>
        {memo.summary}
      </p>

      <div className="ma-ic-list">
        {memo.items.map((item, index) => (
          <div className="ma-ic-item" key={`${item.label}-${index}`}>
            <strong>{item.label}</strong>
            <p className="muted">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function resolveDealDetail({
  dealId,
  financials,
  derived,
  savedCases,
  currency
}) {
  if (!dealId) return null;

  const normalizedDealId = String(dealId || '').trim();

  const demoDeal = DEMO_DEAL_DETAILS.find(
    (item) => item.id === normalizedDealId
  );

  if (demoDeal) {
    return buildDeal({
      ...demoDeal,
      currency
    });
  }

  if (normalizedDealId === 'active-deal') {
    if (!hasSufficientDealData(financials, derived)) return null;

    const qualityScore = getSafeQualityScore(derived?.qualityScore);
    const equityValue = Number(derived?.equityBase);
    const enterpriseValue = Number(derived?.evBase || derived?.enterpriseValue);
    const ebitda = Number(derived?.normalizedEbitda);
    const multiple = Number(derived?.adjustedMultiple);

    return buildDeal({
      id: 'active-deal',
      name: financials?.name?.trim() || 'Active Target',
      sourceLabel: 'Live workspace',
      sector: financials?.sector || 'Sector not specified',
      market:
        financials?.country ||
        financials?.market ||
        financials?.geography ||
        'Primary market',
      owner: 'CEO workspace',
      stageId: getStageFromScore(qualityScore),
      equityValue,
      enterpriseValue,
      ebitda,
      multiple,
      qualityScore,
      riskLabel:
        derived?.riskLevel?.label ||
        derived?.riskLevel ||
        getRiskLabelFromScore(qualityScore),
      updatedLabel: 'Live case',
      currency
    });
  }

  const safeSavedCases = Array.isArray(savedCases) ? savedCases : [];
  const savedCase = safeSavedCases.find(
    (item) => item?.id === normalizedDealId
  );

  if (!savedCase) return null;

  const snapshot = savedCase?.snapshot || {};
  const qualityScore = getSafeQualityScore(snapshot?.qualityScore);
  const equityValue = Number(snapshot?.equityBase);
  const enterpriseValue = Number(snapshot?.evBase);
  const ebitda = Number(snapshot?.normalizedEbitda);
  const multiple = Number(snapshot?.adjustedMultiple);

  return buildDeal({
    id: savedCase?.id,
    name: savedCase?.name || 'Saved Deal',
    sourceLabel: 'Repository snapshot',
    sector: savedCase?.financials?.sector || 'Saved case',
    market:
      savedCase?.financials?.country ||
      savedCase?.financials?.market ||
      savedCase?.financials?.geography ||
      'Repository',
    owner: 'Repository',
    stageId: getSavedDealStage(0, qualityScore),
    equityValue,
    enterpriseValue,
    ebitda,
    multiple,
    qualityScore,
    riskLabel: snapshot?.riskLevel || getRiskLabelFromScore(qualityScore),
    updatedLabel: formatShortDate(savedCase?.updatedAt || savedCase?.createdAt),
    currency
  });
}

function buildDeal({
  id,
  name,
  sourceLabel,
  sector,
  market,
  owner,
  stageId,
  equityValue,
  enterpriseValue,
  ebitda,
  multiple,
  qualityScore,
  riskLabel,
  updatedLabel,
  currency
}) {
  const stageLabel = getStageLabel(stageId);
  const priority = getPriorityLabel(qualityScore);
  const signalTitle = getSignalTitle(qualityScore);

  const baseDeal = {
    id,
    name,
    sourceLabel,
    sector,
    market,
    owner,
    stageId,
    stageLabel,
    priority,
    riskLabel,
    updatedLabel,
    signalTitle,
    qualityScoreLabel: qualityScore === null ? 'N/A' : `${qualityScore}/100`,
    equityLabel: Number.isFinite(Number(equityValue))
      ? formatCurrency(Number(equityValue), currency)
      : 'N/A',
    enterpriseLabel: Number.isFinite(Number(enterpriseValue))
      ? formatCurrency(Number(enterpriseValue), currency)
      : 'N/A',
    ebitdaLabel: Number.isFinite(Number(ebitda))
      ? formatCurrency(Number(ebitda), currency)
      : 'N/A',
    multipleLabel: Number.isFinite(Number(multiple))
      ? `${Number(multiple).toFixed(1)}x`
      : 'N/A',
    recommendedAction: getRecommendedAction(qualityScore),
    nextActions: getNextActions(qualityScore),
    timeline: [
      {
        title: 'Deal file generated',
        description: 'Ficha ejecutiva creada desde caso activo, caso de referencia o snapshot guardado.'
      },
      {
        title: 'Valuation context attached',
        description: 'Se consolidan equity value, enterprise value, EBITDA y multiple.'
      },
      {
        title: 'Human review required',
        description: 'Antes de circular conclusiones, el caso requiere revision humana y soporte documental.'
      }
    ]
  };

  return {
    ...baseDeal,
    icMemo: getInvestmentMemo(baseDeal, qualityScore),
    dataRoom: getDataRoomChecklist(stageId, qualityScore),
    redFlags: getRedFlagsAndMitigants(qualityScore, riskLabel)
  };
}

function getInvestmentMemo(deal, score) {
  if (score >= 80) {
    return {
      decision: 'Recommend advance',
      tone: '',
      title: 'High-conviction IC snapshot',
      summary:
        'El deal muestra una combinacion solida de tamano, calidad, mercado y perfil de riesgo. La recomendacion es avanzar hacia revision profunda, confirmatory diligence e IC memo completo.',
      items: [
        {
          label: 'Strategic rationale',
          value: `${deal.sector} con presencia en ${deal.market} y potencial de tesis cross-border.`
        },
        {
          label: 'Valuation view',
          value: `${deal.enterpriseLabel} de Enterprise Value con ${deal.multipleLabel} sobre EBITDA normalizado.`
        },
        {
          label: 'Committee ask',
          value: 'Autorizar due diligence avanzada, validacion financiera y preparacion de term sheet.'
        }
      ]
    };
  }

  if (score >= 55) {
    return {
      decision: 'Proceed with validation',
      tone: 'watch',
      title: 'Qualified opportunity with diligence items',
      summary:
        'El deal tiene base suficiente para seguir avanzando, pero requiere validar calidad de beneficios, deuda/caja, concentracion y dependencias antes de elevarlo a comite.',
      items: [
        {
          label: 'Strategic rationale',
          value: `${deal.sector} con encaje potencial, pendiente de confirmar profundidad de mercado.`
        },
        {
          label: 'Valuation view',
          value: `${deal.equityLabel} de Equity Value preliminar sujeto a ajustes de diligence.`
        },
        {
          label: 'Committee ask',
          value: 'Mantener en pipeline y exigir soporte documental antes de decision formal.'
        }
      ]
    };
  }

  return {
    decision: 'Hold / build case',
    tone: 'hold',
    title: 'Incomplete or high-risk IC picture',
    summary:
      'El caso no deberia circular como oportunidad lista para comite. Prioriza calidad de datos, soporte documental y mitigantes antes de avanzar.',
    items: [
      {
        label: 'Strategic rationale',
        value: 'La tesis necesita mayor evidencia operativa, financiera y comercial.'
      },
      {
        label: 'Valuation view',
        value: 'La valoracion no debe considerarse defendible hasta completar informacion critica.'
      },
      {
        label: 'Committee ask',
        value: 'No elevar a IC hasta resolver red flags y completar data room minimo.'
      }
    ]
  };
}

function getDataRoomChecklist(stageId, score) {
  const readiness = score >= 80 ? 'Ready' : score >= 55 ? 'Review' : 'Required';

  return [
    {
      title: 'Financial statements',
      description: 'P&L, balance, cash flow, deuda, caja y ajustes normalizados.',
      status: readiness
    },
    {
      title: 'Commercial information',
      description: 'Clientes principales, concentracion, churn, contratos y pipeline comercial.',
      status: score >= 70 ? 'Ready' : 'Required'
    },
    {
      title: 'Legal perimeter',
      description: 'Estructura societaria, contratos clave, contingencias y permisos.',
      status: stageId === 'closing' || stageId === 'negotiation' ? 'Ready' : 'Review'
    },
    {
      title: 'Operational diligence',
      description: 'Dependencia del owner, equipo directivo, procesos y continuidad operativa.',
      status: score >= 65 ? 'Review' : 'Required'
    }
  ];
}

function getRedFlagsAndMitigants(score, riskLabel) {
  if (score >= 80) {
    return [
      {
        title: 'Confirmatory diligence required',
        description: 'Aunque la senal es positiva, validar deuda, caja, working capital y contratos antes de emitir conclusion.'
      },
      {
        title: 'Multiple discipline',
        description: 'Contrastar el multiplo con comparables externos y sensibilidad de EBITDA.'
      }
    ];
  }

  if (score >= 55) {
    return [
      {
        title: 'Quality of earnings',
        description: 'Revisar ajustes normalizados, ingresos no recurrentes, margen y sostenibilidad del EBITDA.'
      },
      {
        title: 'Risk posture',
        description: `Riesgo actual: ${riskLabel}. Exigir mitigantes antes de avanzar a IC Review.`
      },
      {
        title: 'Documentation gap',
        description: 'No circular conclusiones hasta tener data room minimo y soporte financiero.'
      }
    ];
  }

  return [
    {
      title: 'Incomplete investment case',
      description: 'Faltan datos suficientes para defender valoracion y tesis ante comite.'
    },
    {
      title: 'High execution risk',
      description: `Riesgo actual: ${riskLabel}. Mantener en watchlist hasta completar informacion.`
    },
    {
      title: 'External sharing hold',
      description: 'Evitar compartir el deal fuera del workspace hasta resolver informacion critica.'
    }
  ];
}

function getNextActions(score) {
  if (score === null) {
    return [
      {
        title: 'Completar inputs minimos',
        description: 'Razon social, sector, EBITDA normalizado y deuda/caja.',
        status: 'Required'
      },
      {
        title: 'Ejecutar valoracion',
        description: 'Generar score, multiplo ajustado y lectura ejecutiva.',
        status: 'Pending'
      },
      {
        title: 'Guardar snapshot',
        description: 'Crear continuidad en Deal Repository y Pipeline.',
        status: 'Pending'
      }
    ];
  }

  if (score >= 80) {
    return [
      {
        title: 'Preparar IC memo',
        description: 'Convertir la oportunidad en material de decision interna.',
        status: 'Next'
      },
      {
        title: 'Validar documentacion',
        description: 'Revisar deuda, caja, working capital, concentracion y contratos.',
        status: 'Required'
      },
      {
        title: 'Preparar Board Review draft',
        description: 'Descargar HTML draft y narrativa CIM preliminar para revision humana.',
        status: 'Ready'
      }
    ];
  }

  if (score >= 55) {
    return [
      {
        title: 'Profundizar due diligence',
        description: 'Revisar calidad de beneficios, dependencias y riesgos principales.',
        status: 'Next'
      },
      {
        title: 'Revisar valuation bridge',
        description: 'Validar Enterprise Value, deuda neta y Equity Value.',
        status: 'Required'
      },
      {
        title: 'Actualizar pipeline',
        description: 'Mantener fase, prioridad y owner alineados.',
        status: 'Open'
      }
    ];
  }

  return [
    {
      title: 'Reforzar calidad de datos',
      description: 'Completar documentacion y validar supuestos antes de avanzar.',
      status: 'Required'
    },
    {
      title: 'Revisar riesgos criticos',
      description: 'Analizar concentracion, owner dependency y estabilidad financiera.',
      status: 'Required'
    },
    {
      title: 'Evitar circulacion externa',
      description: 'No compartir conclusiones hasta completar revision humana.',
      status: 'Hold'
    }
  ];
}

function getStageFromScore(score) {
  if (score === null) return 'screening';
  if (score >= 82) return 'ic-review';
  if (score >= 68) return 'due-diligence';
  if (score >= 52) return 'nda';

  return 'screening';
}

function getSavedDealStage(index, score) {
  if (score !== null && score >= 82) return 'ic-review';
  if (score !== null && score >= 68) return 'due-diligence';

  const stages = [
    'screening',
    'nda',
    'due-diligence',
    'ic-review',
    'negotiation',
    'closing'
  ];

  return stages[index % stages.length];
}

function getStageLabel(stageId) {
  const map = {
    screening: 'Screening',
    nda: 'NDA',
    'due-diligence': 'Due Diligence',
    'ic-review': 'IC Review',
    negotiation: 'Negotiation',
    closing: 'Closing'
  };

  return map[stageId] || 'Screening';
}

function getPriorityLabel(score) {
  if (score === null) return 'Build';
  if (score >= 80) return 'High';
  if (score >= 55) return 'Review';

  return 'Watch';
}

function getRiskLabelFromScore(score) {
  if (score === null) return 'To assess';
  if (score >= 80) return 'Controlled';
  if (score >= 60) return 'Moderate';
  if (score >= 40) return 'Elevated';

  return 'High';
}

function getSignalTitle(score) {
  if (score === null) return 'Incomplete deal picture';
  if (score >= 80) return 'High-conviction opportunity';
  if (score >= 60) return 'Qualified opportunity';
  if (score >= 40) return 'Watchlist opportunity';

  return 'Needs validation';
}

function getRecommendedAction(score) {
  if (score === null) {
    return 'Completar los datos minimos antes de interpretar esta operacion.';
  }

  if (score >= 80) {
    return 'Avanzar a revision profunda, IC memo y preparacion de reporte ejecutivo.';
  }

  if (score >= 55) {
    return 'Validar riesgos, calidad de beneficios y documentacion soporte antes de avanzar.';
  }

  return 'Mantener en watchlist hasta reforzar informacion financiera y mitigantes.';
}

function formatShortDate(value) {
  if (!value) return 'N/A';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'N/A';

  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short'
  }).format(date);
}

function hasSufficientDealData(financials, derived) {
  const hasName = Boolean(financials?.name?.trim());
  const hasSector = Boolean(financials?.sector);
  const normalizedEbitda = Number(derived?.normalizedEbitda);

  return (
    hasName &&
    hasSector &&
    Number.isFinite(normalizedEbitda) &&
    normalizedEbitda > 0
  );
}

function getSafeQualityScore(score) {
  const parsed = Number(score);

  if (!Number.isFinite(parsed)) return null;

  return Math.max(0, Math.min(100, Math.round(parsed)));
}

export default DealDetailPage;















