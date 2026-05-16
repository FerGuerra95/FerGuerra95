import React from 'react';
import {
  Activity,
  CheckCircle2,
  Download,
  FileCheck2,
  FileText,
  FolderKanban,
  Gauge,
  ShieldCheck,
  Target
} from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { useNotifications } from '../../../app/providers/NotificationsProvider.jsx';
import { useFundingStore } from '../store/fundingStore.jsx';
import { useFundingEngine } from '../engine/useFundingEngine.js';
import { DataRoomChecklist } from '../components/DataRoomChecklist.jsx';
import { fundingExportApi } from '../services/fundingExportApi.js';

const dataRoomCss = `
  .dataroom-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 30px;
    min-width: 0;
  }

  .dataroom-page * {
    box-sizing: border-box;
  }

  .dataroom-hero {
    position: relative;
    overflow: visible;
    border-radius: 36px;
    padding: 40px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      radial-gradient(circle at 8% 2%, rgba(37, 99, 235, 0.34), transparent 30%),
      radial-gradient(circle at 88% 8%, rgba(16, 185, 129, 0.16), transparent 27%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.99), rgba(15, 23, 42, 0.97));
    box-shadow:
      0 34px 100px rgba(0, 0, 0, 0.38),
      inset 0 1px 0 rgba(255, 255, 255, 0.055);
  }

  .dataroom-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 82%);
    pointer-events: none;
  }

  .dataroom-hero-inner {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
    gap: 34px;
    align-items: start;
    min-width: 0;
  }

  .dataroom-main-copy {
    min-width: 0;
  }

  .dataroom-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 24px;
  }

  .dataroom-title {
    margin: 0;
    max-width: 920px;
    font-size: clamp(34px, 4.1vw, 58px);
    line-height: 1.1;
    letter-spacing: -0.052em;
    overflow: visible;
    overflow-wrap: anywhere;
    padding-bottom: 6px;
  }

  .dataroom-title span {
    display: block;
    margin-top: 8px;
    color: rgba(226, 232, 240, 0.72);
    line-height: 1.12;
  }

  .dataroom-copy {
    max-width: 820px;
    margin: 24px 0 0;
    font-size: 16px;
    line-height: 1.78;
    color: rgba(203, 213, 225, 0.86);
  }

  .dataroom-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 30px;
  }

  .dataroom-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 30px;
    padding-top: 24px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .dataroom-command-item {
    padding: 17px;
    border-radius: 21px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.078);
    min-width: 0;
  }

  .dataroom-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.28;
    overflow-wrap: anywhere;
  }

  .dataroom-signal-card {
    position: relative;
    width: 100%;
    border-radius: 30px;
    padding: 24px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025)),
      rgba(15, 23, 42, 0.76);
    border: 1px solid rgba(148, 163, 184, 0.2);
    box-shadow:
      0 26px 70px rgba(0, 0, 0, 0.24),
      inset 0 1px 0 rgba(255,255,255,0.05);
    min-width: 0;
  }

  .dataroom-signal-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
    margin-bottom: 22px;
    min-width: 0;
  }

  .dataroom-icon-box,
  .dataroom-card-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .dataroom-icon-box {
    width: 50px;
    height: 50px;
  }

  .dataroom-card-icon {
    width: 44px;
    height: 44px;
  }

  .dataroom-signal-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.2;
    letter-spacing: -0.035em;
    overflow-wrap: anywhere;
  }

  .dataroom-score-box {
    padding: 20px;
    border-radius: 24px;
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.08);
  }

  .dataroom-score-box strong {
    display: block;
    margin-bottom: 8px;
  }

  .dataroom-score-box p {
    margin: 0;
    line-height: 1.62;
  }

  .dataroom-signal-row {
    display: grid;
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
    gap: 14px;
    align-items: center;
    padding: 14px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }

  .dataroom-signal-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .dataroom-section {
    display: flex;
    flex-direction: column;
    gap: 22px;
    min-width: 0;
  }

  .dataroom-section-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-end;
    min-width: 0;
  }

  .dataroom-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 11px;
    font-size: 11px;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.17em;
    color: rgba(148, 163, 184, 0.96);
  }

  .dataroom-section-header h2,
  .dataroom-section-header h3 {
    margin: 0;
    letter-spacing: -0.035em;
    line-height: 1.16;
  }

  .dataroom-section-header p {
    max-width: 820px;
    margin: 10px 0 0;
    line-height: 1.66;
  }

  .dataroom-grid {
    display: grid;
    gap: 22px;
    align-items: stretch;
    min-width: 0;
  }

  .dataroom-grid > * {
    min-width: 0;
  }

  .dataroom-grid-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .dataroom-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dataroom-grid-three {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .dataroom-kpi-card,
  .dataroom-panel,
  .dataroom-mini-card,
  .dataroom-checklist-panel {
    width: 100%;
    height: 100%;
    border-radius: 29px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.064), rgba(255,255,255,0.022)),
      rgba(15, 23, 42, 0.64);
    box-shadow:
      0 22px 64px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255,255,255,0.035);
    min-width: 0;
  }

  .dataroom-kpi-card {
    min-height: 178px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 18px;
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .dataroom-kpi-card:hover,
  .dataroom-mini-card:hover {
    transform: translateY(-3px);
    border-color: rgba(96, 165, 250, 0.25);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .dataroom-kpi-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .dataroom-kpi-value {
    margin-top: 11px;
    font-size: 24px;
    font-weight: 790;
    line-height: 1.16;
    letter-spacing: -0.035em;
    overflow-wrap: anywhere;
  }

  .dataroom-kpi-card p {
    margin: 0;
    line-height: 1.54;
  }

  .dataroom-panel,
  .dataroom-checklist-panel {
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .dataroom-panel-head {
    display: flex;
    justify-content: space-between;
    gap: 22px;
    align-items: flex-start;
    min-width: 0;
  }

  .dataroom-panel-head h3 {
    margin: 0;
    letter-spacing: -0.035em;
    line-height: 1.18;
  }

  .dataroom-panel-head p {
    margin: 10px 0 0;
    line-height: 1.62;
  }

  .dataroom-stack {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .dataroom-mini-card {
    padding: 20px;
    transition:
      transform .18s ease,
      border-color .18s ease,
      background .18s ease;
  }

  .dataroom-mini-card strong {
    display: block;
    margin-bottom: 8px;
  }

  .dataroom-mini-card p {
    margin: 0;
    line-height: 1.62;
  }

  .dataroom-muted-tight {
    margin-bottom: 0;
  }

  @media (max-width: 1180px) {
    .dataroom-hero-inner,
    .dataroom-grid-two {
      grid-template-columns: 1fr;
    }

    .dataroom-grid-kpis,
    .dataroom-grid-three {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 920px) {
    .dataroom-command-bar {
      grid-template-columns: 1fr;
    }

    .dataroom-section-header {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (max-width: 680px) {
    .dataroom-grid-kpis,
    .dataroom-grid-three {
      grid-template-columns: 1fr;
    }

    .dataroom-hero {
      padding: 24px;
      border-radius: 26px;
    }
  }
`;

function getChecklistStats(items = []) {
  const total = items.length;

  const completed = items.filter((item) => {
    const value = item.completed ?? item.done ?? item.status;

    return (
      value === true ||
      value === 'done' ||
      value === 'completed' ||
      value === 'ready'
    );
  }).length;

  const pending = Math.max(0, total - completed);
  const completion = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    pending,
    completion
  };
}

function getDataRoomLevel(completion) {
  if (completion >= 80) {
    return {
      label: 'Alta',
      color: 'text-success',
      description:
        'El data room está suficientemente preparado para conversaciones avanzadas con inversores.'
    };
  }

  if (completion >= 50) {
    return {
      label: 'Media',
      color: 'text-warning',
      description:
        'El data room puede utilizarse como base, pero conviene cerrar documentación pendiente antes de avanzar.'
    };
  }

  return {
    label: 'Baja',
    color: 'text-danger',
    description:
      'El data room necesita completarse antes de enviarse a inversores o partners.'
  };
}

function getDataRoomSignal(stats) {
  if (stats.total === 0) {
    return {
      title: 'Data room pending',
      posture: 'Build checklist',
      description:
        'Completa los inputs de financiación para generar un checklist documental accionable.'
    };
  }

  if (stats.completion >= 80) {
    return {
      title: 'Investor-ready data room',
      posture: 'Ready to share',
      description:
        'La preparación documental es alta y permite avanzar hacia conversaciones más formales.'
    };
  }

  if (stats.completion >= 50) {
    return {
      title: 'Data room in progress',
      posture: 'Close gaps',
      description:
        'Existe una base documental, pero conviene cerrar pendientes antes de compartir materiales.'
    };
  }

  return {
    title: 'Documentation gap detected',
    posture: 'Do not share yet',
    description:
      'El data room necesita más preparación antes de enviarse a inversores, bancos o partners.'
  };
}

function CommandItem({ label, value }) {
  return (
    <div className="dataroom-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SignalRow({ label, value }) {
  return (
    <div className="dataroom-signal-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SectionHeader({ kicker, icon: Icon, title, description, right }) {
  return (
    <div className="dataroom-section-header">
      <div>
        <div className="dataroom-kicker">
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

function KpiCard({ label, value, description, icon: Icon, color = '' }) {
  return (
    <article className="dataroom-kpi-card">
      <div className="dataroom-kpi-top">
        <div>
          <div className="kpi-label">{label}</div>
          <div className={`dataroom-kpi-value ${color}`.trim()}>
            {value}
          </div>
        </div>

        <div className="dataroom-card-icon">
          <Icon size={18} />
        </div>
      </div>

      <p className="muted">{description}</p>
    </article>
  );
}

function MiniCard({ title, text }) {
  return (
    <div className="dataroom-mini-card">
      <strong>{title}</strong>
      <p className="muted">{text}</p>
    </div>
  );
}

export function DataRoomPage() {
  const { fundingInputs, fundingSettings } = useFundingStore();
  const { pushToast } = useNotifications();

  const derived = useFundingEngine({
    fundingInputs,
    fundingSettings
  });

  const checklistItems = Array.isArray(derived.dataRoomChecklist)
    ? derived.dataRoomChecklist
    : [];

  const stats = getChecklistStats(checklistItems);
  const level = getDataRoomLevel(stats.completion);
  const signal = getDataRoomSignal(stats);

  const companyName = fundingInputs?.companyName?.trim() || 'Sin compañía activa';
  const stage = fundingInputs?.stage || 'Seed';

  function handleExport() {
    const ok = fundingExportApi.exportDataRoomMemo({
      fundingInputs,
      fundingSettings,
      derived
    });

    pushToast(
      ok
        ? 'Data room memo preparado para imprimir o guardar como PDF'
        : 'El navegador ha bloqueado la ventana emergente'
    );
  }

  return (
    <div className="page ceos-page-shell">
      <style>{dataRoomCss}</style>

      <div className="dataroom-page">
        <section className="dataroom-hero ceos-ws-hero">
          <div className="dataroom-hero-inner">
            <div className="dataroom-main-copy">
              <div className="dataroom-badges">
                <Badge>Funding Workspace</Badge>
                <Badge>Investor Data Room</Badge>
                <Badge>{stage}</Badge>
                <Badge>{level.label}</Badge>
              </div>

              <h1 className="dataroom-title">
                Investor Data Room.
                <span>Prepare the evidence before the conversation.</span>
              </h1>

              <p className="dataroom-copy">
                Checklist documental y paquete ejecutivo para preparar
                materiales de financiación antes de compartirlos con inversores,
                bancos o partners.
              </p>

              <div className="dataroom-actions">
                <Button onClick={handleExport} variant="secondary">
                  <Download size={16} />
                  Exportar data room
                </Button>
              </div>

              <div className="dataroom-command-bar">
                <CommandItem label="Company" value={companyName} />
                <CommandItem label="Completion" value={`${stats.completion}%`} />
                <CommandItem label="Data room posture" value={signal.posture} />
              </div>
            </div>

            <aside className="dataroom-signal-card">
              <div className="dataroom-signal-top">
                <div>
                  <div className="kpi-label">Data Room Signal</div>
                  <div className="dataroom-signal-title">{signal.title}</div>
                </div>

                <div className="dataroom-icon-box">
                  <FolderKanban size={21} />
                </div>
              </div>

              <div className="dataroom-score-box">
                <strong>{signal.posture}</strong>
                <p className="muted">{signal.description}</p>
              </div>

              <div>
                <SignalRow label="Readiness" value={`${stats.completion}%`} />
                <SignalRow label="Total docs" value={stats.total} />
                <SignalRow label="Completed" value={stats.completed} />
                <SignalRow label="Pending" value={stats.pending} />
              </div>
            </aside>
          </div>
        </section>

        <section className="dataroom-section">
          <SectionHeader
            kicker="Data room overview"
            icon={Activity}
            title="Document readiness at a glance"
            description="Resumen rápido de preparación documental, documentos completados y puntos pendientes antes de compartir materiales."
          />

          <div className="dataroom-grid dataroom-grid-kpis">
            <KpiCard
              label="Data Room Readiness"
              value={`${stats.completion}%`}
              description={`Preparación ${level.label}`}
              icon={Gauge}
              color={level.color}
            />

            <KpiCard
              label="Documentos totales"
              value={stats.total}
              description="Checklist completo"
              icon={FileText}
            />

            <KpiCard
              label="Completados"
              value={stats.completed}
              description="Items preparados"
              icon={CheckCircle2}
              color="text-success"
            />

            <KpiCard
              label="Pendientes"
              value={stats.pending}
              description="Items por cerrar"
              icon={Target}
              color="text-warning"
            />
          </div>
        </section>

        <section className="dataroom-grid dataroom-grid-two">
          <div className="dataroom-panel">
            <div className="dataroom-panel-head">
              <div>
                <h3>Document Readiness</h3>
                <p className="muted dataroom-muted-tight">
                  Lectura ejecutiva de la preparación documental antes de abrir
                  una ronda o iniciar conversaciones de deuda.
                </p>
              </div>

              <div className="dataroom-card-icon">
                <FileCheck2 size={18} />
              </div>
            </div>

            <p>{level.description}</p>

            <div className="dataroom-stack">
              <MiniCard
                title="Financial materials"
                text="Métricas, histórico financiero, burn, runway, proyecciones, margen y uso de fondos deben estar preparados y ser consistentes."
              />

              <MiniCard
                title="Company materials"
                text="Documentación societaria, equipo, producto, clientes, contratos clave y narrativa de mercado deben poder revisarse sin fricción."
              />

              <MiniCard
                title="Investor confidence"
                text="Un data room ordenado reduce fricción, acelera la revisión y mejora la percepción de disciplina operativa."
              />
            </div>
          </div>

          <div className="dataroom-panel">
            <div className="dataroom-panel-head">
              <div>
                <h3>Export Package</h3>
                <p className="muted dataroom-muted-tight">
                  Paquete inicial para presentar el estado de preparación y la
                  narrativa de financiación.
                </p>
              </div>

              <div className="dataroom-card-icon">
                <FileText size={18} />
              </div>
            </div>

            <div className="dataroom-stack">
              <MiniCard
                title="Investor data room memo"
                text="Resume la preparación documental, items completados, pendientes y contexto financiero principal de la ronda."
              />

              <MiniCard
                title="Data room checklist"
                text="Permite detectar qué documentos están listos y qué puntos deben cerrarse antes de enviar materiales."
              />

              <Button onClick={handleExport}>
                <Download size={16} />
                Exportar paquete
              </Button>
            </div>
          </div>
        </section>

        <section className="dataroom-checklist-panel">
          <SectionHeader
            kicker="Checklist"
            icon={FolderKanban}
            title="Data Room Checklist"
            description="Checklist operativo de documentación financiera, societaria, comercial y de producto para inversores."
            right={<Badge>{stats.completion}% completo</Badge>}
          />

          <DataRoomChecklist items={checklistItems} />
        </section>

        <section className="dataroom-section">
          <SectionHeader
            kicker="Gap closing"
            icon={ShieldCheck}
            title="Missing Items"
            description="Puntos que conviene cerrar antes de compartir el data room."
          />

          <div className="dataroom-grid dataroom-grid-three">
            <MiniCard
              title="1. Coherencia financiera"
              text="Revisar que ingresos, burn, caja, runway y capital objetivo cuentan una historia consistente."
            />

            <MiniCard
              title="2. Material legal y societario"
              text="Tener preparada la documentación corporativa, cap table, contratos relevantes y estructura accionarial."
            />

            <MiniCard
              title="3. Narrativa de crecimiento"
              text="Conectar la ronda con hitos concretos: producto, ventas, equipo, mercado y próximos 12-18 meses."
            />
          </div>
        </section>
      </div>
    </div>
  );
}