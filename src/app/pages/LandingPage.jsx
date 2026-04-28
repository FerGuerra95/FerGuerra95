import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Database,
  FileSearch,
  Fingerprint,
  Gauge,
  KeyRound,
  Landmark,
  LineChart,
  Lock,
  Radar,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Users
} from 'lucide-react';

const modules = [
  {
    label: 'M&A Intelligence',
    type: 'Ataque',
    description:
      'Modela sinergias, analiza targets y convierte complejidad en decisión ejecutiva.',
    icon: Target
  },
  {
    label: 'Funding Workspace',
    type: 'Ataque',
    description:
      'Convierte necesidad de capital en investor readiness con escenarios, data room y narrativa financiera.',
    icon: Rocket
  },
  {
    label: 'Compliance & Risk',
    type: 'Defensa',
    description:
      'El escudo automático contra la fricción legal, operativa y documental.',
    icon: ShieldCheck
  },
  {
    label: 'Executive Dashboard',
    type: 'Defensa',
    description:
      'El radar central que unifica crecimiento, riesgo, financiación y ejecución.',
    icon: Radar
  }
];

const agents = [
  {
    name: 'Analyst Agent',
    status: 'online',
    description: 'Modelos, forecasts y señales de oportunidad.',
    progress: 86,
    icon: BrainCircuit
  },
  {
    name: 'Compliance Agent',
    status: 'reviewing',
    description: 'Policy checks, evidencias, riesgos y controles.',
    progress: 72,
    icon: ShieldCheck
  },
  {
    name: 'Funding Agent',
    status: 'running',
    description: 'Investor readiness, narrativa financiera y data room.',
    progress: 68,
    icon: Landmark
  },
  {
    name: 'Reporting Agent',
    status: 'synthesizing',
    description: 'Informes ejecutivos, KPIs y reporting operativo.',
    progress: 81,
    icon: FileSearch
  },
  {
    name: 'Operator Agent',
    status: 'active',
    description: 'Workflows, tareas, seguimiento y automatización.',
    progress: 64,
    icon: Activity
  }
];

const supplierRisk = [
  ['Global Semiconductor', 'Components', 'High', '↑'],
  ['LogiTech Solutions', 'Logistics', 'Medium', '→'],
  ['DataVault Inc.', 'Data Storage', 'Medium', '→'],
  ['CloudNine Services', 'Infra / SaaS', 'Low', '↓']
];

export function LandingPage() {
  return (
    <main className="landing-page">
      <style>{`
        .landing-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 20% 0%, rgba(31, 96, 255, 0.18), transparent 34%),
            radial-gradient(circle at 80% 12%, rgba(16, 185, 129, 0.12), transparent 28%),
            radial-gradient(circle at 50% 52%, rgba(201, 162, 77, 0.07), transparent 30%),
            linear-gradient(180deg, #02040a 0%, #050814 42%, #03050b 100%);
          color: #f8fafc;
          overflow-x: hidden;
        }

        .landing-page * {
          box-sizing: border-box;
        }

        .landing-shell {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .landing-nav {
          position: sticky;
          top: 0;
          z-index: 20;
          backdrop-filter: blur(18px);
          background: rgba(2, 4, 10, 0.78);
          border-bottom: 1px solid rgba(148, 163, 184, 0.14);
        }

        .landing-nav-inner {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 0;
          gap: 18px;
        }

        .landing-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #ffffff;
          text-decoration: none;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        .landing-logo-mark {
          width: 34px;
          height: 34px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.22), rgba(59, 130, 246, 0.18));
          border: 1px solid rgba(201, 162, 77, 0.5);
          box-shadow: 0 0 30px rgba(201, 162, 77, 0.12);
        }

        .landing-nav-links {
          display: flex;
          align-items: center;
          gap: 22px;
          color: #cbd5e1;
          font-size: 14px;
        }

        .landing-nav-links a {
          color: inherit;
          text-decoration: none;
        }

        .landing-nav-links a:hover {
          color: #ffffff;
        }

        .landing-nav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .landing-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 0;
          border-radius: 999px;
          padding: 11px 16px;
          font-weight: 800;
          text-decoration: none;
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
          white-space: nowrap;
        }

        .landing-button:hover {
          transform: translateY(-1px);
        }

        .landing-button-primary {
          background: linear-gradient(135deg, #10b981, #3b82f6);
          color: #ffffff;
          box-shadow: 0 18px 50px rgba(16, 185, 129, 0.2);
        }

        .landing-button-secondary {
          background: rgba(15, 23, 42, 0.72);
          color: #f8fafc;
          border: 1px solid rgba(201, 162, 77, 0.45);
        }

        .landing-hero {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(420px, 1.1fr);
          gap: 34px;
          align-items: center;
          padding: 78px 0 58px;
        }

        .landing-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(148, 163, 184, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.05) 1px, transparent 1px);
          background-size: 46px 46px;
          mask-image: radial-gradient(circle at 30% 30%, black, transparent 68%);
          pointer-events: none;
        }

        .landing-eyebrow {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #7dd3fc;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }

        .landing-eyebrow::before {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #c9a24d;
          box-shadow: 0 0 22px rgba(201, 162, 77, 0.8);
        }

        .landing-hero h1 {
          position: relative;
          margin: 0;
          font-size: clamp(42px, 6vw, 78px);
          line-height: 0.92;
          letter-spacing: -0.07em;
          max-width: 760px;
        }

        .landing-gradient-text {
          background: linear-gradient(135deg, #ffffff, #dbeafe 46%, #93c5fd);
          -webkit-background-clip: text;
          color: transparent;
        }

        .landing-hero-copy {
          position: relative;
          color: #cbd5e1;
          font-size: 18px;
          line-height: 1.7;
          margin: 24px 0 18px;
          max-width: 660px;
        }

        .landing-trust-line {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #d1d5db;
          font-size: 14px;
          margin: 0 0 28px;
        }

        .landing-trust-line svg {
          color: #10b981;
        }

        .landing-hero-actions {
          position: relative;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .landing-dashboard {
          position: relative;
          border-radius: 28px;
          border: 1px solid rgba(148, 163, 184, 0.16);
          background:
            linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(2, 6, 23, 0.98)),
            radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.16), transparent 32%);
          box-shadow:
            0 30px 120px rgba(0, 0, 0, 0.55),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          padding: 18px;
          overflow: hidden;
        }

        .landing-dashboard::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 28px;
          pointer-events: none;
          border: 1px solid rgba(201, 162, 77, 0.18);
        }

        .dashboard-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .dashboard-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 900;
        }

        .dashboard-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #10b981;
          box-shadow: 0 0 18px rgba(16, 185, 129, 0.8);
        }

        .dashboard-time {
          color: #94a3b8;
          font-size: 12px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 0.86fr 1.34fr;
          gap: 14px;
        }

        .dashboard-sidebar,
        .dashboard-main-card,
        .dashboard-card {
          border-radius: 20px;
          background: rgba(15, 23, 42, 0.72);
          border: 1px solid rgba(148, 163, 184, 0.13);
        }

        .dashboard-sidebar {
          padding: 14px;
        }

        .dashboard-menu {
          display: grid;
          gap: 10px;
          margin-top: 10px;
        }

        .dashboard-menu-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #94a3b8;
          font-size: 12px;
          padding: 9px 10px;
          border-radius: 12px;
        }

        .dashboard-menu-item.active {
          color: #ffffff;
          background: rgba(59, 130, 246, 0.16);
          border: 1px solid rgba(59, 130, 246, 0.28);
        }

        .dashboard-main {
          display: grid;
          gap: 14px;
        }

        .dashboard-kpis {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .dashboard-card {
          padding: 13px;
        }

        .dashboard-label {
          color: #94a3b8;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }

        .dashboard-value {
          color: #ffffff;
          font-size: 18px;
          font-weight: 900;
          margin-top: 7px;
        }

        .dashboard-good {
          color: #22c55e;
          font-size: 11px;
          margin-top: 4px;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: 1.4fr 0.9fr;
          gap: 14px;
        }

        .chart-card {
          min-height: 250px;
        }

        .fake-chart {
          height: 150px;
          margin-top: 18px;
          border-radius: 16px;
          background:
            linear-gradient(180deg, rgba(16, 185, 129, 0.16), transparent),
            repeating-linear-gradient(0deg, rgba(148, 163, 184, 0.08), rgba(148, 163, 184, 0.08) 1px, transparent 1px, transparent 30px);
          position: relative;
          overflow: hidden;
        }

        .fake-chart svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .supplier-table {
          display: grid;
          gap: 8px;
          margin-top: 12px;
          font-size: 11px;
        }

        .supplier-row {
          display: grid;
          grid-template-columns: 1.3fr 0.8fr 0.6fr 0.3fr;
          gap: 8px;
          color: #cbd5e1;
          align-items: center;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        }

        .risk-high { color: #f87171; }
        .risk-medium { color: #fbbf24; }
        .risk-low { color: #22c55e; }

        .summary-list {
          margin-top: 14px;
          display: grid;
          gap: 8px;
          color: #cbd5e1;
          font-size: 12px;
          line-height: 1.5;
        }

        .landing-section {
          padding: 54px 0;
        }

        .context-panel,
        .pillars-panel,
        .agents-panel,
        .trust-panel,
        .loop-panel {
          border-radius: 30px;
          background:
            linear-gradient(135deg, rgba(15, 23, 42, 0.82), rgba(2, 6, 23, 0.94));
          border: 1px solid rgba(148, 163, 184, 0.13);
          box-shadow: 0 24px 90px rgba(0, 0, 0, 0.34);
          position: relative;
          overflow: hidden;
        }

        .context-panel {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 28px;
          align-items: center;
          padding: 32px;
        }

        .context-orb {
          height: 220px;
          border-radius: 24px;
          background:
            radial-gradient(circle, rgba(59, 130, 246, 0.18), transparent 58%),
            radial-gradient(circle at 55% 42%, rgba(201, 162, 77, 0.28), transparent 9%);
          border: 1px solid rgba(148, 163, 184, 0.12);
          display: grid;
          place-items: center;
          color: #c9a24d;
        }

        .section-kicker {
          color: #c9a24d;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .section-heading {
          margin: 0;
          color: #ffffff;
          font-size: clamp(30px, 4vw, 52px);
          line-height: 1.04;
          letter-spacing: -0.05em;
        }

        .section-copy {
          color: #cbd5e1;
          font-size: 16px;
          line-height: 1.7;
          margin: 18px 0 0;
        }

        .pillars-panel {
          padding: 34px;
        }

        .pillars-title {
          text-align: center;
          margin-bottom: 28px;
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: 1fr 130px 1fr;
          gap: 18px;
          align-items: center;
        }

        .pillar-group {
          display: grid;
          gap: 14px;
        }

        .pillar-label {
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .pillar-label.attack {
          color: #34d399;
        }

        .pillar-label.defense {
          color: #60a5fa;
        }

        .pillar-card {
          min-height: 160px;
          border-radius: 22px;
          padding: 20px;
          background: rgba(2, 6, 23, 0.58);
          border: 1px solid rgba(148, 163, 184, 0.14);
        }

        .pillar-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }

        .pillar-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: rgba(59, 130, 246, 0.12);
          color: #93c5fd;
          border: 1px solid rgba(201, 162, 77, 0.2);
        }

        .pillar-card h3,
        .agent-card h3 {
          margin: 0;
          color: #ffffff;
          font-size: 18px;
        }

        .pillar-card p,
        .agent-card p {
          color: #cbd5e1;
          line-height: 1.55;
          margin: 0;
          font-size: 14px;
        }

        .central-node {
          min-height: 330px;
          display: grid;
          place-items: center;
          position: relative;
        }

        .central-node-core {
          width: 88px;
          height: 88px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background:
            radial-gradient(circle, rgba(201, 162, 77, 0.3), rgba(59, 130, 246, 0.14));
          border: 1px solid rgba(201, 162, 77, 0.45);
          box-shadow: 0 0 44px rgba(201, 162, 77, 0.16);
          color: #c9a24d;
        }

        .agents-panel {
          padding: 34px;
        }

        .agents-header {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 24px;
        }

        .agents-row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
        }

        .agent-card {
          border-radius: 22px;
          padding: 18px;
          background: rgba(2, 6, 23, 0.58);
          border: 1px solid rgba(148, 163, 184, 0.13);
          min-height: 210px;
        }

        .agent-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .agent-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #93c5fd;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }

        .agent-status::before {
          content: '';
          width: 7px;
          height: 7px;
          border-radius: 999px;
          background: #22c55e;
        }

        .progress-track {
          height: 7px;
          border-radius: 999px;
          background: rgba(148, 163, 184, 0.14);
          overflow: hidden;
          margin-top: 20px;
        }

        .progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #10b981, #3b82f6);
        }

        .trust-panel {
          padding: 34px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 24px;
          align-items: center;
        }

        .trust-list {
          display: grid;
          gap: 12px;
          margin-top: 24px;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #dbeafe;
          font-weight: 700;
        }

        .trust-item svg {
          color: #c9a24d;
        }

        .isolation-card {
          border-radius: 24px;
          padding: 24px;
          background: rgba(2, 6, 23, 0.64);
          border: 1px solid rgba(148, 163, 184, 0.13);
        }

        .org-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 18px;
        }

        .org-card {
          border-radius: 18px;
          padding: 16px;
          border: 1px solid rgba(148, 163, 184, 0.15);
          background: rgba(15, 23, 42, 0.62);
          text-align: center;
        }

        .org-card svg {
          color: #60a5fa;
          margin-bottom: 10px;
        }

        .org-card strong {
          display: block;
          color: #ffffff;
          font-size: 13px;
        }

        .org-card span {
          color: #94a3b8;
          font-size: 11px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }

        .loop-panel {
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: 28px;
          padding: 34px;
        }

        .landing-form {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .landing-form label {
          display: grid;
          gap: 7px;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .landing-form input,
        .landing-form select {
          width: 100%;
          border: 1px solid rgba(148, 163, 184, 0.16);
          border-radius: 14px;
          background: rgba(2, 6, 23, 0.76);
          color: #ffffff;
          padding: 14px 13px;
          outline: none;
        }

        .landing-form .full {
          grid-column: 1 / -1;
        }

        .landing-footer {
          padding: 28px 0 38px;
          color: #94a3b8;
          border-top: 1px solid rgba(148, 163, 184, 0.1);
          margin-top: 48px;
        }

        .landing-footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          font-size: 13px;
        }

        @media (max-width: 980px) {
          .landing-nav-links {
            display: none;
          }

          .landing-hero,
          .context-panel,
          .trust-panel,
          .loop-panel {
            grid-template-columns: 1fr;
          }

          .dashboard-grid,
          .dashboard-content,
          .pillars-grid,
          .agents-row,
          .org-grid {
            grid-template-columns: 1fr;
          }

          .central-node {
            min-height: 140px;
          }

          .dashboard-kpis {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .landing-nav-inner,
          .landing-nav-actions,
          .landing-hero-actions,
          .agents-header,
          .landing-footer-inner {
            flex-direction: column;
            align-items: stretch;
          }

          .landing-form {
            grid-template-columns: 1fr;
          }

          .dashboard-kpis {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <Link to="/" className="landing-logo">
            <span className="landing-logo-mark">
              <Sparkles size={18} />
            </span>
            CEO’s OS
          </Link>

          <div className="landing-nav-links">
            <a href="#modules">Módulos</a>
            <a href="#agents">AI Agents</a>
            <a href="#security">Security</a>
            <a href="#access">Access</a>
          </div>

          <div className="landing-nav-actions">
            <Link to="/login" className="landing-button landing-button-secondary">
              Acceso Directo
            </Link>
            <a href="#access" className="landing-button landing-button-primary">
              Solicitar acceso
              <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </nav>

      <div className="landing-shell">
        <section className="landing-hero">
          <div>
            <div className="landing-eyebrow">
              Private by Design · Sovereign Intelligence
            </div>

            <h1>
              <span className="landing-gradient-text">
                The private executive operating system for company intelligence.
              </span>
            </h1>

            <p className="landing-hero-copy">
              Deje de gestionar datos dispersos. Empiece a dictar la estrategia.
              Analice M&A, Compliance y Financiación desde su infraestructura
              privada asistida por IA.
            </p>

            <div className="landing-trust-line">
              <ShieldCheck size={18} />
              Built for high-stakes decisions. Private by design, secure by architecture.
            </div>

            <div className="landing-hero-actions">
              <a href="#access" className="landing-button landing-button-primary">
                Solicitar acceso a la Beta Ejecutiva
                <ChevronRight size={16} />
              </a>

              <Link to="/login" className="landing-button landing-button-secondary">
                Acceso Directo (Usuarios Registrados)
              </Link>
            </div>
          </div>

          <div className="landing-dashboard" aria-label="CEO's OS dashboard preview">
            <div className="dashboard-top">
              <div className="dashboard-title">
                <span className="dashboard-dot" />
                Executive Command Center
              </div>
              <div className="dashboard-time">09:23 AM · secure session</div>
            </div>

            <div className="dashboard-grid">
              <aside className="dashboard-sidebar">
                <div className="dashboard-label">CEO’s OS</div>
                <div className="dashboard-menu">
                  {[
                    ['Overview', Gauge],
                    ['M&A Intelligence', BriefcaseBusiness],
                    ['Funding Workspace', Landmark],
                    ['Compliance & Risk', ShieldCheck],
                    ['Executive Dashboard', Radar],
                    ['AI Agents', BrainCircuit],
                    ['Data Rooms', Database]
                  ].map(([item, Icon], index) => (
                    <div
                      className={`dashboard-menu-item ${index === 0 ? 'active' : ''}`}
                      key={item}
                    >
                      <Icon size={14} />
                      {item}
                    </div>
                  ))}
                </div>
              </aside>

              <section className="dashboard-main">
                <div className="dashboard-kpis">
                  <div className="dashboard-card">
                    <div className="dashboard-label">Enterprise Value</div>
                    <div className="dashboard-value">$245.3M</div>
                    <div className="dashboard-good">↑ 12.4% vs Q1</div>
                  </div>

                  <div className="dashboard-card">
                    <div className="dashboard-label">Runway</div>
                    <div className="dashboard-value">18.4 mo</div>
                    <div className="dashboard-good">Cash: $3.2M</div>
                  </div>

                  <div className="dashboard-card">
                    <div className="dashboard-label">Risk Score</div>
                    <div className="dashboard-value">Low</div>
                    <div className="dashboard-good">Compliance OK</div>
                  </div>

                  <div className="dashboard-card">
                    <div className="dashboard-label">Active Agents</div>
                    <div className="dashboard-value">12</div>
                    <div className="dashboard-good">3 require review</div>
                  </div>
                </div>

                <div className="dashboard-content">
                  <div className="dashboard-main-card dashboard-card chart-card">
                    <div className="dashboard-label">Valuation DCF</div>
                    <div className="dashboard-value">Projected 12-Mo Enterprise Value</div>

                    <div className="fake-chart">
                      <svg viewBox="0 0 520 160" preserveAspectRatio="none">
                        <path
                          d="M0 126 C80 118 110 90 170 94 C240 100 270 62 330 70 C410 78 450 38 520 28"
                          fill="none"
                          stroke="rgba(16, 185, 129, 0.95)"
                          strokeWidth="4"
                        />
                        <path
                          d="M0 142 C80 128 115 110 178 114 C240 120 280 82 335 92 C415 102 455 68 520 54"
                          fill="none"
                          stroke="rgba(96, 165, 250, 0.65)"
                          strokeWidth="3"
                        />
                        <path
                          d="M0 150 C95 142 135 126 190 130 C250 136 300 106 355 112 C430 120 465 96 520 86"
                          fill="none"
                          stroke="rgba(201, 162, 77, 0.72)"
                          strokeWidth="2"
                          strokeDasharray="8 8"
                        />
                      </svg>
                    </div>

                    <div className="summary-list">
                      <span>• Enterprise value increased 12.4% driven by margin expansion.</span>
                      <span>• Compliance posture strong. 1 high-priority finding open.</span>
                      <span>• Opportunistic M&A signal detected in adjacent markets.</span>
                    </div>
                  </div>

                  <div className="dashboard-main-card dashboard-card">
                    <div className="dashboard-label">Top Supplier Risk</div>

                    <div className="supplier-table">
                      {supplierRisk.map(([supplier, category, risk, trend]) => (
                        <div className="supplier-row" key={supplier}>
                          <span>{supplier}</span>
                          <span>{category}</span>
                          <span
                            className={
                              risk === 'High'
                                ? 'risk-high'
                                : risk === 'Medium'
                                  ? 'risk-medium'
                                  : 'risk-low'
                            }
                          >
                            {risk}
                          </span>
                          <span>{trend}</span>
                        </div>
                      ))}
                    </div>

                    <div className="summary-list">
                      <span>AI Agents Activity</span>
                      <span>• M&A Analyst · Running</span>
                      <span>• Compliance Agent · Reviewing</span>
                      <span>• Funding Agent · Synthesizing</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>

        <section className="landing-section">
          <div className="context-panel">
            <div className="context-orb">
              <Database size={72} />
            </div>

            <div>
              <div className="section-kicker">The Context</div>
              <h2 className="section-heading">
                El 80% de la inteligencia de su empresa vive en emails y hojas
                de cálculo. Cámbielo por una visión soberana.
              </h2>
              <p className="section-copy">
                Compre tiempo, reduzca incertidumbre y transforme información
                dispersa en decisiones ejecutivas defendibles.
              </p>
            </div>
          </div>
        </section>

        <section className="landing-section" id="modules">
          <div className="pillars-panel">
            <div className="pillars-title">
              <div className="section-kicker">Attack / Defense</div>
              <h2 className="section-heading">
                Ataque y Defensa para decisiones de alto impacto.
              </h2>
            </div>

            <div className="pillars-grid">
              <div className="pillar-group">
                <div className="pillar-label attack">Fuerza de Crecimiento / Ataque</div>
                {modules
                  .filter((module) => module.type === 'Ataque')
                  .map((module) => {
                    const Icon = module.icon;

                    return (
                      <article className="pillar-card" key={module.label}>
                        <div className="pillar-card-header">
                          <div className="pillar-icon">
                            <Icon size={20} />
                          </div>
                          <ChevronRight size={18} />
                        </div>
                        <h3>{module.label}</h3>
                        <p>{module.description}</p>
                      </article>
                    );
                  })}
              </div>

              <div className="central-node">
                <div className="central-node-core">
                  <BrainCircuit size={34} />
                </div>
              </div>

              <div className="pillar-group">
                <div className="pillar-label defense">Fuerza de Resiliencia / Defensa</div>
                {modules
                  .filter((module) => module.type === 'Defensa')
                  .map((module) => {
                    const Icon = module.icon;

                    return (
                      <article className="pillar-card" key={module.label}>
                        <div className="pillar-card-header">
                          <div className="pillar-icon">
                            <Icon size={20} />
                          </div>
                          <ChevronRight size={18} />
                        </div>
                        <h3>{module.label}</h3>
                        <p>{module.description}</p>
                      </article>
                    );
                  })}
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section" id="agents">
          <div className="agents-panel">
            <div className="agents-header">
              <div>
                <div className="section-kicker">The AI Layer</div>
                <h2 className="section-heading">AI Operating Agents</h2>
                <p className="section-copy">
                  La musculatura operativa que ejecuta las órdenes del cerebro:
                  el CEO.
                </p>
              </div>
              <BrainCircuit size={42} color="#c9a24d" />
            </div>

            <div className="agents-row">
              {agents.map((agent) => {
                const Icon = agent.icon;

                return (
                  <article className="agent-card" key={agent.name}>
                    <div className="agent-top">
                      <Icon size={24} color="#60a5fa" />
                      <span className="agent-status">{agent.status}</span>
                    </div>
                    <h3>{agent.name}</h3>
                    <p>{agent.description}</p>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${agent.progress}%` }}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="landing-section" id="security">
          <div className="trust-panel">
            <div>
              <div className="section-kicker">Sovereign Intelligence</div>
              <h2 className="section-heading">
                Sus datos no alimentan modelos públicos. Su inteligencia es
                suya.
              </h2>

              <div className="trust-list">
                <div className="trust-item">
                  <Lock size={18} />
                  Private by Design
                </div>
                <div className="trust-item">
                  <Fingerprint size={18} />
                  Organization-level data isolation
                </div>
                <div className="trust-item">
                  <Database size={18} />
                  Multi-tenant architecture with organizationId
                </div>
                <div className="trust-item">
                  <KeyRound size={18} />
                  Secure by architecture
                </div>
              </div>
            </div>

            <div className="isolation-card">
              <div className="dashboard-label">Isolated by Design</div>
              <h3 style={{ margin: '8px 0 0', color: '#ffffff' }}>
                Your data stays in your boundary.
              </h3>

              <div className="org-grid">
                {[
                  ['ACME Holdings', 'org_01'],
                  ['Nexa Partners', 'org_02'],
                  ['Orion Capital', 'org_03']
                ].map(([name, org]) => (
                  <div className="org-card" key={org}>
                    <Database size={34} />
                    <strong>{name}</strong>
                    <span>Organization ID: {org}</span>
                    <p style={{ color: '#cbd5e1', fontSize: 12 }}>
                      Private Data Store
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section" id="access">
          <div className="loop-panel">
            <div>
              <div className="section-kicker">The Loop</div>
              <h2 className="section-heading">Solicite acceso a la Beta Ejecutiva.</h2>
              <p className="section-copy">
                CEO’s OS está actualmente en fase de despliegue controlado para
                fundadores, inversores y operadores seleccionados. No es una
                herramienta pública; es una infraestructura privada.
              </p>

              <div className="landing-trust-line" style={{ marginTop: 24 }}>
                <CheckCircle2 size={18} />
                Acceso limitado. Máxima confidencialidad.
              </div>
            </div>

            <form
              className="landing-form"
              onSubmit={(event) => {
                event.preventDefault();
                window.location.href =
                  'mailto:demo@theceosos.com?subject=Solicitud%20Beta%20Ejecutiva%20CEO%27s%20OS';
              }}
            >
              <label>
                Name
                <input placeholder="Ej. Fernando Guerra" />
              </label>

              <label>
                Work Email
                <input placeholder="name@company.com" type="email" />
              </label>

              <label>
                Company
                <input placeholder="Ej. ACME Holdings" />
              </label>

              <label>
                LinkedIn
                <input placeholder="https://linkedin.com/in/username" />
              </label>

              <label className="full">
                Use Case
                <select defaultValue="">
                  <option value="" disabled>
                    Select your primary use case
                  </option>
                  <option>M&A Intelligence</option>
                  <option>Compliance & Risk</option>
                  <option>Funding Workspace</option>
                  <option>Executive Dashboard</option>
                  <option>AI Operating Agents</option>
                </select>
              </label>

              <button className="landing-button landing-button-primary full" type="submit">
                Request Executive Beta
                <ChevronRight size={16} />
              </button>
            </form>
          </div>
        </section>

        <footer className="landing-footer">
          <div className="landing-footer-inner">
            <div className="landing-logo">
              <span className="landing-logo-mark">
                <Sparkles size={16} />
              </span>
              CEO’s OS
            </div>

            <div>Clarity is the ultimate competitive advantage.</div>

            <div>© 2026 CEO’s OS. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </main>
  );
}