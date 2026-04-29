import React from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Landmark,
  Network,
  ShieldCheck,
  Sparkles,
  Target,
  Users
} from 'lucide-react';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import {
  PERMISSIONS,
  useAuth
} from '../../../app/providers/AuthProvider.jsx';
import { useMAStore } from '../store/maStore.jsx';
import { useValuationEngine } from '../engine/useValuationEngine.js';
import { BuyerMatchGrid } from '../components/BuyerMatchGrid.jsx';

const buyerMatchingCss = `
  .buyer-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 38px;
  }

  .buyer-hero {
    position: relative;
    overflow: hidden;
    border-radius: 38px;
    padding: 38px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      radial-gradient(circle at 8% 2%, rgba(37, 99, 235, 0.38), transparent 30%),
      radial-gradient(circle at 88% 8%, rgba(16, 185, 129, 0.18), transparent 27%),
      radial-gradient(circle at 60% 110%, rgba(234, 179, 8, 0.08), transparent 30%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.99), rgba(15, 23, 42, 0.97));
    box-shadow:
      0 38px 120px rgba(0, 0, 0, 0.42),
      inset 0 1px 0 rgba(255, 255, 255, 0.055);
  }

  .buyer-hero::before {
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

  .buyer-hero::after {
    content: "";
    position: absolute;
    inset: auto -190px -210px auto;
    width: 520px;
    height: 520px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.13), transparent 70%);
    pointer-events: none;
  }

  .buyer-hero-layout {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.42fr) minmax(380px, 0.58fr);
    gap: 36px;
    align-items: stretch;
  }

  .buyer-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 26px;
  }

  .buyer-title {
    margin: 0;
    max-width: 950px;
    font-size: clamp(42px, 5vw, 72px);
    line-height: 0.92;
    letter-spacing: -0.075em;
  }

  .buyer-title span {
    display: block;
    margin-top: 8px;
    color: rgba(226, 232, 240, 0.7);
  }

  .buyer-copy {
    max-width: 860px;
    margin: 26px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .buyer-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .buyer-command-item {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.078);
  }

  .buyer-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
  }

  .buyer-signal-card {
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

  .buyer-signal-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: radial-gradient(circle at 18% 0%, rgba(96, 165, 250, 0.13), transparent 35%);
    pointer-events: none;
  }

  .buyer-signal-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .buyer-signal-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .buyer-icon-box,
  .buyer-card-icon,
  .buyer-panel-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: rgba(37, 99, 235, 0.16);
    border: 1px solid rgba(96, 165, 250, 0.24);
  }

  .buyer-icon-box {
    width: 50px;
    height: 50px;
  }

  .buyer-card-icon,
  .buyer-panel-icon {
    width: 46px;
    height: 46px;
  }

  .buyer-signal-title {
    margin-top: 10px;
    font-size: 23px;
    line-height: 1.16;
    letter-spacing: -0.04em;
  }

  .buyer-score-module {
    display: grid;
    grid-template-columns: 122px minmax(0, 1fr);
    gap: 22px;
    align-items: center;
    padding: 20px;
    border-radius: 26px;
    background: rgba(255, 255, 255, 0.047);
    border: 1px solid rgba(255, 255, 255, 0.085);
  }

  .buyer-score-ring {
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

  .buyer-score-core {
    width: 84px;
    height: 84px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: rgba(15, 23, 42, 0.97);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .buyer-score-core strong {
    font-size: 25px;
    letter-spacing: -0.055em;
  }

  .buyer-score-copy strong {
    display: block;
    margin-bottom: 8px;
  }

  .buyer-score-copy p {
    margin: 0;
    line-height: 1.62;
  }

  .buyer-signal-table {
    display: grid;
    gap: 0;
  }

  .buyer-signal-row {
    display: grid;
    grid-template-columns: minmax(0, 0.86fr) minmax(0, 1.14fr);
    gap: 14px;
    align-items: center;
    padding: 15px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.14);
  }

  .buyer-signal-row strong {
    text-align: right;
    overflow-wrap: anywhere;
  }

  .buyer-section {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .buyer-section-header {
    display: flex;
    justify-content: space-between;
    gap: 28px;
    align-items: flex-end;
  }

  .buyer-kicker {
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

  .buyer-section-header h2,
  .buyer-section-header h3 {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .buyer-section-header p {
    max-width: 820px;
    margin: 11px 0 0;
    line-height: 1.68;
  }

  .buyer-grid {
    display: grid;
    gap: 26px;
    align-items: stretch;
  }

  .buyer-grid-kpis {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .buyer-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .buyer-kpi-card,
  .buyer-panel,
  .buyer-workflow-card {
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

  .buyer-kpi-card {
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

  .buyer-kpi-card:hover {
    transform: translateY(-3px);
    border-color: rgba(96, 165, 250, 0.25);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.078), rgba(255,255,255,0.03)),
      rgba(15, 23, 42, 0.78);
  }

  .buyer-kpi-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .buyer-kpi-value {
    margin-top: 12px;
    font-size: 25px;
    font-weight: 790;
    line-height: 1.12;
    letter-spacing: -0.045em;
    overflow-wrap: anywhere;
  }

  .buyer-kpi-card p {
    margin: 0;
    line-height: 1.56;
  }

  .buyer-panel {
    padding: 31px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .buyer-panel-header {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    align-items: flex-start;
  }

  .buyer-panel-title {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .buyer-panel-description {
    margin: 11px 0 0;
    line-height: 1.66;
  }

  .buyer-glass-block {
    border-radius: 25px;
    padding: 25px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.066), rgba(255,255,255,0.026));
    border: 1px solid rgba(255,255,255,0.092);
  }

  .buyer-rationale-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .buyer-rationale-item {
    display: grid;
    grid-template-columns: 34px minmax(0, 1fr);
    gap: 15px;
    align-items: flex-start;
    padding: 19px;
    border-radius: 22px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.078);
  }

  .buyer-rationale-icon {
    width: 34px;
    height: 34px;
    border-radius: 15px;
    display: grid;
    place-items: center;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.22);
    color: #86efac;
  }

  .buyer-rationale-item strong {
    display: block;
    margin-bottom: 7px;
  }

  .buyer-rationale-item p {
    margin: 0;
    line-height: 1.6;
  }

  .buyer-chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 18px;
  }

  .buyer-bridge-panel {
    position: relative;
    overflow: hidden;
    border-radius: 32px;
    padding: 28px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background:
      radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.16), transparent 32%),
      linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02)),
      rgba(15, 23, 42, 0.64);
  }

  .buyer-bridge-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-top: 22px;
  }

  .buyer-bridge-step {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.075);
  }

  .buyer-bridge-step strong {
    display: block;
    margin-top: 8px;
  }

  .buyer-grid-frame {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .buyer-muted-tight {
    margin-bottom: 0;
  }

  @media (max-width: 1180px) {
    .buyer-hero-layout {
      grid-template-columns: 1fr;
    }

    .buyer-grid-kpis,
    .buyer-bridge-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 920px) {
    .buyer-grid-two,
    .buyer-command-bar {
      grid-template-columns: 1fr;
    }

    .buyer-section-header {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (max-width: 680px) {
    .buyer-page {
      gap: 28px;
    }

    .buyer-hero {
      padding: 26px;
      border-radius: 28px;
    }

    .buyer-grid-kpis,
    .buyer-bridge-grid {
      grid-template-columns: 1fr;
    }

    .buyer-kpi-card,
    .buyer-panel {
      border-radius: 24px;
    }

    .buyer-score-module {
      grid-template-columns: 1fr;
    }

    .buyer-signal-row {
      grid-template-columns: 1fr;
      gap: 7px;
    }

    .buyer-signal-row strong {
      text-align: left;
    }
  }
`;

export function BuyerMatchingPage() {
  const { can, isViewer } = useAuth();
  const { financials, settings } = useMAStore();

  const canEditCase = can(PERMISSIONS.UPDATE_MA_CASE);
  const canExportReport = can(PERMISSIONS.CREATE_MA_REPORT);

  const derived = useValuationEngine({
    financials,
    settings
  });

  const buyerMatches = Array.isArray(derived.buyerMatches)
    ? derived.buyerMatches
    : [];
  const topBuyer = buyerMatches[0] || null;
  const topScore = getNumericScore(topBuyer?.fitScore);
  const scoreAngle = `${Math.max(0, Math.min(100, topScore)) * 3.6}deg`;
  const activeCompanyName = financials?.name?.trim() || 'Sin target activo';
  const buyerSignal = getBuyerSignal(topScore, buyerMatches.length);

  const strategicBuyers = buyerMatches.filter((buyer) =>
    String(buyer.type || '').toLowerCase().includes('strategic')
  );

  const financialBuyers = buyerMatches.filter((buyer) =>
    String(buyer.type || '').toLowerCase().includes('financial')
  );

  return (
    <div className="page">
      <style>{buyerMatchingCss}</style>

      <div className="buyer-page">
        <section className="buyer-hero">
          <div className="buyer-hero-layout">
            <div>
              <div className="buyer-badge-row">
                <Badge>M&A Workspace</Badge>
                <Badge>Buyer Intelligence</Badge>
                {isViewer ? <Badge>Modo solo lectura</Badge> : null}
                {canEditCase ? <Badge>Edición M&A permitida</Badge> : null}
                {canExportReport ? <Badge>Exportación permitida</Badge> : null}
              </div>

              <h1 className="buyer-title">
                Buyer Matching.
                <span>Find the right acquirer profile.</span>
              </h1>

              <p className="buyer-copy">
                Traduce la calidad del activo, la recurrencia de ingresos, el
                riesgo operativo y la estructura financiera en perfiles de
                comprador accionables para priorizar conversaciones de M&A.
              </p>

              <div className="buyer-command-bar">
                <CommandItem
                  label="Active target"
                  value={activeCompanyName}
                />

                <CommandItem
                  label="Profiles detected"
                  value={buyerMatches.length}
                />

                <CommandItem
                  label="Matching posture"
                  value={buyerSignal.posture}
                />
              </div>
            </div>

            <aside className="buyer-signal-card">
              <div className="buyer-signal-inner">
                <div className="buyer-signal-top">
                  <div>
                    <div className="kpi-label">Top Buyer Signal</div>
                    <div className="buyer-signal-title">
                      {buyerSignal.title}
                    </div>
                  </div>

                  <div className="buyer-icon-box">
                    <Users size={21} />
                  </div>
                </div>

                <div className="buyer-score-module">
                  <div
                    className="buyer-score-ring"
                    style={{ '--score-angle': scoreAngle }}
                  >
                    <div className="buyer-score-core">
                      <strong>{topBuyer ? topScore : '—'}</strong>
                    </div>
                  </div>

                  <div className="buyer-score-copy">
                    <strong>{buyerSignal.posture}</strong>

                    <p className="muted">
                      {buyerSignal.description}
                    </p>
                  </div>
                </div>

                <div className="buyer-signal-table">
                  <SignalRow
                    label="Top match"
                    value={topBuyer?.name || 'Pendiente'}
                  />

                  <SignalRow
                    label="Buyer type"
                    value={topBuyer?.type || 'N/A'}
                  />

                  <SignalRow
                    label="Fit score"
                    value={topBuyer ? `${topScore}/100` : 'N/A'}
                  />

                  <SignalRow
                    label="Coverage"
                    value={`${buyerMatches.length} perfiles`}
                  />
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="buyer-section">
          <SectionHeader
            kicker="Buyer universe"
            icon={Network}
            title="Buyer landscape at a glance"
            description="Resumen rápido del universo de compradores estimado para entender profundidad de mercado, perfiles estratégicos, financieros y mejor encaje actual."
          />

          <div className="buyer-grid buyer-grid-kpis">
            <KpiCard
              label="Perfiles detectados"
              value={buyerMatches.length}
              description="Compradores potenciales"
              icon={Users}
            />

            <KpiCard
              label="Strategic Buyers"
              value={strategicBuyers.length}
              description="Encaje industrial o sinergias"
              icon={Building2}
            />

            <KpiCard
              label="Financial Buyers"
              value={financialBuyers.length}
              description="Fondos, search funds o inversores"
              icon={Landmark}
            />

            <KpiCard
              label="Top Match"
              value={topBuyer ? `${topScore}/100` : 'N/A'}
              description="Mejor encaje estimado"
              icon={Target}
            />
          </div>
        </section>

        <section className="buyer-bridge-panel">
          <SectionHeader
            kicker="Matching logic"
            icon={Target}
            title="From company profile to buyer prioritization"
            description="El matching no busca una lista larga. Busca identificar qué perfiles pueden pagar, ejecutar y aportar valor después de la adquisición."
          />

          <div className="buyer-bridge-grid">
            <BridgeStep
              number="01"
              title="Strategic fit"
              text="Sinergias, acceso a clientes, tecnología, equipo o expansión geográfica."
            />

            <BridgeStep
              number="02"
              title="Financial fit"
              text="Recurrencia, margen, escalabilidad y claridad del plan de crecimiento."
            />

            <BridgeStep
              number="03"
              title="Execution fit"
              text="Capacidad real de cerrar la operación y absorber el activo."
            />

            <BridgeStep
              number="04"
              title="Priority"
              text="Ordenar conversaciones según encaje, probabilidad y valor esperado."
            />
          </div>
        </section>

        <section className="buyer-grid buyer-grid-two">
          <section className="buyer-panel">
            <PanelHeader
              kicker="Fit model"
              icon={Target}
              title="Buyer Fit Score"
              description="El matching prioriza compradores según tamaño del deal, estabilidad del EBITDA, calidad del activo, riesgo de ejecución y capacidad de aportar valor después de la compra."
            />

            <div className="buyer-rationale-list">
              <RationaleItem
                icon={Building2}
                title="Strategic rationale"
                text="Compradores industriales pueden pagar mejor si existen sinergias, acceso a clientes, tecnología, equipo o expansión geográfica."
              />

              <RationaleItem
                icon={Landmark}
                title="Financial rationale"
                text="Fondos e inversores financieros priorizan recurrencia, margen, escalabilidad, baja dependencia del fundador y claridad del plan de crecimiento."
              />

              <RationaleItem
                icon={ShieldCheck}
                title="Execution discipline"
                text="El perfil prioritario no solo debe tener interés. Debe poder ejecutar, financiar, integrar y defender la adquisición internamente."
              />
            </div>
          </section>

          <section className="buyer-panel">
            <PanelHeader
              kicker="Priority match"
              icon={BriefcaseBusiness}
              title="Match Rationale"
              description="Lectura ejecutiva del tipo de comprador más adecuado para el activo analizado."
            />

            {topBuyer ? (
              <div className="buyer-glass-block">
                <strong>{topBuyer.name || 'Comprador prioritario'}</strong>

                <p className="muted" style={{ marginTop: 10 }}>
                  {topBuyer.rationale ||
                    'Perfil con alto encaje según calidad del activo, tamaño de operación y narrativa del deal.'}
                </p>

                <div className="buyer-chip-row">
                  {topBuyer.type ? <Badge>{topBuyer.type}</Badge> : null}
                  {topBuyer.fitScore ? <Badge>{topScore}/100 fit</Badge> : null}
                  {isViewer ? <Badge>Solo lectura</Badge> : null}
                </div>
              </div>
            ) : (
              <div className="buyer-glass-block">
                <strong>Sin comprador prioritario todavía</strong>

                <p className="muted buyer-muted-tight" style={{ marginTop: 10 }}>
                  Completa la valoración para generar perfiles de comprador
                  accionables y priorizar el universo de potenciales
                  adquirentes.
                </p>
              </div>
            )}
          </section>
        </section>

        <section className="buyer-grid-frame">
          <SectionHeader
            kicker="Buyer pipeline"
            icon={Users}
            title="Prioritized buyer universe"
            description="Lista de compradores potenciales priorizados por encaje estratégico, capacidad financiera y lógica de adquisición."
          />

          <BuyerMatchGrid buyers={buyerMatches} />
        </section>
      </div>
    </div>
  );
}

function CommandItem({ label, value }) {
  return (
    <div className="buyer-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SignalRow({ label, value }) {
  return (
    <div className="buyer-signal-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function BridgeStep({ number, title, text }) {
  return (
    <div className="buyer-bridge-step">
      <div className="kpi-label">{number}</div>
      <strong>{title}</strong>

      <p className="muted buyer-muted-tight" style={{ marginTop: 8 }}>
        {text}
      </p>
    </div>
  );
}

function KpiCard({ label, value, description, icon: Icon }) {
  return (
    <article className="buyer-kpi-card">
      <div className="buyer-kpi-top">
        <div>
          <div className="kpi-label">{label}</div>
          <div className="buyer-kpi-value">{value}</div>
        </div>

        <div className="buyer-card-icon">
          <Icon size={18} />
        </div>
      </div>

      <p className="muted">{description}</p>
    </article>
  );
}

function SectionHeader({ kicker, icon: Icon, title, description }) {
  return (
    <div className="buyer-section-header">
      <div>
        <div className="buyer-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h2>{title}</h2>

        <p className="muted">{description}</p>
      </div>
    </div>
  );
}

function PanelHeader({ kicker, icon: Icon, title, description }) {
  return (
    <div className="buyer-panel-header">
      <div>
        <div className="buyer-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h3 className="buyer-panel-title">{title}</h3>

        <p className="muted buyer-panel-description">{description}</p>
      </div>

      <div className="buyer-panel-icon">
        <Icon size={18} />
      </div>
    </div>
  );
}

function RationaleItem({ icon: Icon, title, text }) {
  return (
    <div className="buyer-rationale-item">
      <div className="buyer-rationale-icon">
        <Icon size={16} />
      </div>

      <div>
        <strong>{title}</strong>

        <p className="muted">
          {text}
        </p>
      </div>
    </div>
  );
}

function getNumericScore(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return 0;

  return Math.max(0, Math.min(100, Math.round(parsed)));
}

function getBuyerSignal(score, count) {
  if (count === 0) {
    return {
      title: 'Buyer universe pending',
      posture: 'Build pipeline',
      description:
        'Completa la valoración para generar perfiles accionables y priorizar potenciales compradores.'
    };
  }

  if (score >= 80) {
    return {
      title: 'High-fit buyer identified',
      posture: 'Prioritize outreach',
      description:
        'Existe un perfil comprador con encaje fuerte para avanzar en una conversación prioritaria.'
    };
  }

  if (score >= 60) {
    return {
      title: 'Qualified buyer universe',
      posture: 'Review shortlist',
      description:
        'El activo muestra compradores cualificados, aunque conviene validar tesis, capacidad y probabilidad de ejecución.'
    };
  }

  if (score >= 40) {
    return {
      title: 'Moderate buyer fit',
      posture: 'Refine positioning',
      description:
        'Hay perfiles potenciales, pero la narrativa del activo necesita más claridad para mejorar el encaje.'
    };
  }

  return {
    title: 'Weak buyer signal',
    posture: 'Improve case',
    description:
      'El matching sugiere reforzar la calidad del caso antes de priorizar conversaciones de compradores.'
  };
}