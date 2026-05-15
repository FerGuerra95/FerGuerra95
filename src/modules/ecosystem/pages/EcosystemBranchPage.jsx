import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Crown,
  FileText,
  Gem,
  Globe2,
  Landmark,
  Layers3,
  LockKeyhole,
  Network,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';

const ecosystemCss = `
  .ecosystem-page {
    width: min(1540px, 100%);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 38px;
  }

  .ecosystem-hero {
    position: relative;
    overflow: hidden;
    border-radius: 38px;
    padding: 44px;
    min-height: 520px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background:
      radial-gradient(circle at 8% 2%, var(--branch-glow), transparent 30%),
      radial-gradient(circle at 88% 8%, rgba(16, 185, 129, 0.18), transparent 27%),
      radial-gradient(circle at 60% 110%, rgba(245, 158, 11, 0.10), transparent 30%),
      linear-gradient(135deg, rgba(2, 6, 23, 0.99), rgba(15, 23, 42, 0.97));
    box-shadow:
      0 38px 120px rgba(0, 0, 0, 0.42),
      inset 0 1px 0 rgba(255, 255, 255, 0.055);
  }

  .ecosystem-hero::before {
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

  .ecosystem-hero-layout {
    position: relative;
    z-index: 1;
    min-height: 430px;
    display: grid;
    grid-template-columns: minmax(0, 1.12fr) minmax(360px, 0.88fr);
    gap: 38px;
    align-items: center;
  }

  .ecosystem-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 26px;
  }

  .ecosystem-title {
    margin: 0;
    max-width: 980px;
    font-size: clamp(40px, 4.8vw, 70px);
    line-height: 0.94;
    letter-spacing: -0.075em;
  }

  .ecosystem-title span {
    display: block;
    margin-top: 9px;
    color: rgba(226, 232, 240, 0.68);
  }

  .ecosystem-copy {
    max-width: 860px;
    margin: 28px 0 0;
    font-size: 17px;
    line-height: 1.82;
    color: rgba(203, 213, 225, 0.86);
  }

  .ecosystem-command-bar {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-top: 34px;
    padding-top: 28px;
    border-top: 1px solid rgba(148, 163, 184, 0.16);
  }

  .ecosystem-command-item {
    padding: 18px;
    border-radius: 22px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.078);
  }

  .ecosystem-command-item strong {
    display: block;
    margin-top: 8px;
    line-height: 1.25;
  }

  .ecosystem-signal-card {
    position: relative;
    width: 100%;
    max-width: 470px;
    justify-self: end;
    border-radius: 32px;
    padding: 28px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.086), rgba(255,255,255,0.026)),
      rgba(15, 23, 42, 0.76);
    border: 1px solid rgba(148, 163, 184, 0.2);
    backdrop-filter: blur(22px);
    box-shadow:
      0 26px 70px rgba(0, 0, 0, 0.24),
      inset 0 1px 0 rgba(255,255,255,0.05);
    overflow: hidden;
  }

  .ecosystem-signal-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 32px;
    background: radial-gradient(circle at 18% 0%, var(--branch-glow), transparent 35%);
    pointer-events: none;
  }

  .ecosystem-signal-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }

  .ecosystem-signal-top {
    display: flex;
    justify-content: space-between;
    gap: 18px;
  }

  .ecosystem-icon-box,
  .ecosystem-card-icon {
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: var(--branch-soft);
    border: 1px solid var(--branch-border);
  }

  .ecosystem-icon-box {
    width: 54px;
    height: 54px;
  }

  .ecosystem-card-icon {
    width: 46px;
    height: 46px;
    flex: 0 0 auto;
  }

  .ecosystem-signal-title {
    margin-top: 10px;
    font-size: 24px;
    line-height: 1.16;
    letter-spacing: -0.04em;
  }

  .ecosystem-score-block {
    padding: 22px;
    border-radius: 26px;
    background: rgba(255,255,255,0.047);
    border: 1px solid rgba(255,255,255,0.085);
  }

  .ecosystem-score-block strong {
    display: block;
    font-size: 38px;
    line-height: 1;
    letter-spacing: -0.06em;
    color: #ffffff;
  }

  .ecosystem-score-block p {
    margin: 10px 0 0;
    line-height: 1.58;
  }

  .ecosystem-section {
    display: flex;
    flex-direction: column;
    gap: 26px;
  }

  .ecosystem-section-header {
    display: flex;
    justify-content: space-between;
    gap: 28px;
    align-items: flex-end;
  }

  .ecosystem-kicker {
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

  .ecosystem-section-header h2,
  .ecosystem-panel-title {
    margin: 0;
    letter-spacing: -0.045em;
  }

  .ecosystem-section-header p,
  .ecosystem-panel-copy {
    max-width: 820px;
    margin: 11px 0 0;
    line-height: 1.68;
  }

  .ecosystem-grid {
    display: grid;
    gap: 26px;
  }

  .ecosystem-grid-three {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .ecosystem-grid-two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ecosystem-panel,
  .ecosystem-feature-card {
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

  .ecosystem-panel,
  .ecosystem-feature-card {
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .ecosystem-card-head {
    display: flex;
    justify-content: space-between;
    gap: 18px;
    align-items: flex-start;
  }

  .ecosystem-feature-card h3 {
    margin: 0;
    letter-spacing: -0.04em;
  }

  .ecosystem-feature-card p {
    margin: 10px 0 0;
    line-height: 1.62;
  }

  .ecosystem-mini-row {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 12px 0;
    border-top: 1px solid rgba(148, 163, 184, 0.13);
  }

  .ecosystem-mini-row strong {
    text-align: right;
  }

  .ecosystem-link-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: auto;
  }

  .ecosystem-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    width: fit-content;
    border-radius: 999px;
    padding: 10px 13px;
    color: rgba(226, 232, 240, 0.94);
    background: var(--branch-soft);
    border: 1px solid var(--branch-border);
    text-decoration: none;
    font-size: 13px;
    font-weight: 800;
  }

  @media (max-width: 1180px) {
    .ecosystem-hero-layout,
    .ecosystem-grid-three,
    .ecosystem-grid-two {
      grid-template-columns: 1fr;
    }

    .ecosystem-signal-card {
      max-width: none;
      justify-self: stretch;
    }
  }

  @media (max-width: 780px) {
    .ecosystem-hero {
      padding: 30px;
    }

    .ecosystem-command-bar {
      grid-template-columns: 1fr;
    }

    .ecosystem-title {
      font-size: clamp(36px, 11vw, 54px);
    }
  }
`;

function CommandItem({ label, value }) {
  return (
    <div className="ecosystem-command-item">
      <div className="kpi-label">{label}</div>
      <strong>{value}</strong>
    </div>
  );
}

function SectionHeader({ icon: Icon, kicker, title, description }) {
  return (
    <div className="ecosystem-section-header">
      <div>
        <div className="ecosystem-kicker">
          <Icon size={14} />
          {kicker}
        </div>

        <h2>{title}</h2>
        <p className="muted">{description}</p>
      </div>
    </div>
  );
}

function MiniRow({ label, value }) {
  return (
    <div className="ecosystem-mini-row">
      <span className="muted">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, text, badge }) {
  return (
    <article className="ecosystem-feature-card">
      <div className="ecosystem-card-head">
        <div>
          <h3>{title}</h3>
          <p className="muted">{text}</p>
        </div>

        <div className="ecosystem-card-icon">
          <Icon size={18} />
        </div>
      </div>

      <Badge>{badge}</Badge>
    </article>
  );
}

export function EcosystemBranchPage({ branch }) {
  const Icon = branch.icon;

  return (
    <div className="page">
      <style>{ecosystemCss}</style>

      <div
        className="ecosystem-page"
        style={{
          '--branch-glow': branch.glow,
          '--branch-soft': branch.soft,
          '--branch-border': branch.border
        }}
      >
        <section className="ecosystem-hero">
          <div className="ecosystem-hero-layout">
            <div>
              <div className="ecosystem-badge-row">
                {branch.badges.map((badge) => (
                  <Badge key={badge}>{badge}</Badge>
                ))}
              </div>

              <h1 className="ecosystem-title">
                {branch.title}
                <span>{branch.subtitle}</span>
              </h1>

              <p className="ecosystem-copy">{branch.copy}</p>

              <div className="ecosystem-command-bar">
                <CommandItem label="Status" value={branch.status} />
                <CommandItem label="Strategic role" value={branch.role} />
                <CommandItem label="Scale logic" value={branch.scale} />
              </div>
            </div>

            <aside className="ecosystem-signal-card">
              <div className="ecosystem-signal-inner">
                <div className="ecosystem-signal-top">
                  <div>
                    <div className="kpi-label">Native Branch</div>
                    <div className="ecosystem-signal-title">
                      {branch.signalTitle}
                    </div>
                  </div>

                  <div className="ecosystem-icon-box">
                    <Icon size={24} />
                  </div>
                </div>

                <div className="ecosystem-score-block">
                  <strong>{branch.score}</strong>
                  <p className="muted">{branch.signalCopy}</p>
                </div>

                <div>
                  {branch.snapshot.map((item) => (
                    <MiniRow key={item.label} label={item.label} value={item.value} />
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="ecosystem-section">
          <SectionHeader
            icon={Layers3}
            kicker="Native integration"
            title={branch.integrationTitle}
            description={branch.integrationDescription}
          />

          <div className="ecosystem-grid ecosystem-grid-three">
            {branch.features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        <section className="ecosystem-grid ecosystem-grid-two">
          <Card className="ecosystem-panel">
            <div className="ecosystem-kicker">
              <TrendingUp size={14} />
              Scale thesis
            </div>

            <h3 className="ecosystem-panel-title">{branch.thesisTitle}</h3>

            <p className="muted ecosystem-panel-copy">{branch.thesis}</p>

            <div>
              {branch.scaleRows.map((row) => (
                <MiniRow key={row.label} label={row.label} value={row.value} />
              ))}
            </div>
          </Card>

          <Card className="ecosystem-panel">
            <div className="ecosystem-kicker">
              <ArrowRight size={14} />
              Connected OS
            </div>

            <h3 className="ecosystem-panel-title">Connected to the executive release</h3>

            <p className="muted ecosystem-panel-copy">
              Esta rama mantiene una señal ejecutiva conectada al sistema,
              condicionada a datos validados, evidencias disponibles y revisión humana.
            </p>

            <div className="ecosystem-link-row">
              <Link className="ecosystem-link" to="/dashboard">
                Executive Overview
                <ArrowRight size={14} />
              </Link>

              {branch.primaryLink ? (
                <Link className="ecosystem-link" to={branch.primaryLink.to}>
                  {branch.primaryLink.label}
                  <ArrowRight size={14} />
                </Link>
              ) : null}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

export const branchIcons = {
  governance: Scale,
  heritage: Gem,
  bridge: Network,
  shield: ShieldCheck,
  crown: Crown,
  users: Users,
  file: FileText,
  money: CircleDollarSign,
  lock: LockKeyhole,
  globe: Globe2,
  bank: Landmark,
  check: CheckCircle2
};
