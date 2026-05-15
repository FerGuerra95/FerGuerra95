import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../../shared/components/brand/BrandLogo.jsx';
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Cpu,
  Database,
  FileSearch,
  Fingerprint,
  Gauge,
  KeyRound,
  Landmark,
  LineChart,
  Lock,
  Network,
  Radar,
  Rocket,
  ShieldCheck,
  Target,
  Users,
  Zap
} from 'lucide-react';

const modules = [
  {
    label: 'M&A Intelligence',
    type: 'Ataque',
    metric: 'Deal clarity',
    description:
      'Modela sinergias, analiza targets y convierte complejidad financiera en decisión ejecutiva.',
    icon: Target
  },
  {
    label: 'Funding Workspace',
    type: 'Ataque',
    metric: 'Investor readiness',
    description:
      'Convierte necesidad de capital en narrativa financiera, escenarios, data room y preparación inversora.',
    icon: Rocket
  },
  {
    label: 'Compliance & Risk',
    type: 'Defensa',
    metric: 'Operational shield',
    description:
      'Reduce fricción legal, documental y operativa con controles, evidencias y alertas accionables.',
    icon: ShieldCheck
  },
  {
    label: 'Executive Dashboard',
    type: 'Defensa',
    metric: 'Command visibility',
    description:
      'Unifica crecimiento, riesgo, financiación y ejecución en una sola visión ejecutiva.',
    icon: Radar
  }
];

const agents = [
  {
    name: 'Analyst Agent',
    status: 'online',
    description: 'Modelos, forecasts, señales de oportunidad y análisis de valor.',
    progress: 86,
    icon: BrainCircuit
  },
  {
    name: 'Compliance Agent',
    status: 'reviewing',
    description: 'Policy checks, evidencias, riesgos, controles y documentación.',
    progress: 72,
    icon: ShieldCheck
  },
  {
    name: 'Funding Agent',
    status: 'running',
    description: 'Investor readiness, narrativa financiera, escenarios y data room.',
    progress: 68,
    icon: Landmark
  },
  {
    name: 'Reporting Agent',
    status: 'synthesizing',
    description: 'Informes ejecutivos, KPIs, reporting operativo y síntesis para dirección.',
    progress: 81,
    icon: FileSearch
  },
  {
    name: 'Operator Agent',
    status: 'active',
    description: 'Workflows, tareas, seguimiento, automatización y control de ejecución.',
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

const commandStats = [
  {
    label: 'Enterprise Value',
    value: '$245.3M',
    meta: '↑ 12.4% vs Q1',
    icon: LineChart
  },
  {
    label: 'Runway',
    value: '18.4 mo',
    meta: 'Cash: $3.2M',
    icon: Clock3
  },
  {
    label: 'Risk Score',
    value: 'Low',
    meta: 'Compliance OK',
    icon: ShieldCheck
  },
  {
    label: 'Active Agents',
    value: '12',
    meta: '3 require review',
    icon: Cpu
  }
];

const executiveSignals = [
  {
    label: 'M&A signal detected',
    description: 'Adjacent market target shows margin expansion and founder dependency.',
    icon: Target
  },
  {
    label: 'Funding narrative ready',
    description: 'Investor pack can be generated from current workspace data.',
    icon: CircleDollarSign
  },
  {
    label: 'Compliance posture stable',
    description: 'One high-priority evidence request remains open.',
    icon: ShieldCheck
  }
];

const securityItems = [
  {
    label: 'Private by Design',
    icon: Lock
  },
  {
    label: 'Organization-level data isolation',
    icon: Fingerprint
  },
  {
    label: 'Multi-tenant architecture with organizationId',
    icon: Database
  },
  {
    label: 'Secure by architecture',
    icon: KeyRound
  }
];

export function LandingPage() {
  const handleAccessSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const body = encodeURIComponent(
      [
        `Name: ${formData.get('name') || ''}`,
        `Work Email: ${formData.get('email') || ''}`,
        `Company: ${formData.get('company') || ''}`,
        `LinkedIn: ${formData.get('linkedin') || ''}`,
        `Use Case: ${formData.get('useCase') || ''}`
      ].join('\n')
    );

    window.location.href = `mailto:demo@theceosos.com?subject=Solicitud%20Acceso%20Ejecutivo%20CEO%27s%20OS&body=${body}`;
  };

  return (
    <main className="landing-page">
      <a href="#contenido-principal" className="landing-skip-link">
        Saltar al contenido
      </a>
      <style>{`
        .landing-skip-link {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .landing-skip-link:focus {
          position: fixed;
          top: 12px;
          left: 12px;
          z-index: 10000;
          width: auto;
          height: auto;
          margin: 0;
          clip: auto;
          overflow: visible;
          white-space: nowrap;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 800;
          text-decoration: none;
          color: #030712;
          background: #7dd3fc;
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.45);
        }

        .landing-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 18% -4%, rgba(37, 99, 235, 0.18), transparent 34%),
            radial-gradient(circle at 80% 6%, rgba(16, 185, 129, 0.1), transparent 30%),
            radial-gradient(circle at 52% 46%, rgba(201, 162, 77, 0.055), transparent 32%),
            linear-gradient(180deg, #030712 0%, #050814 40%, #070b16 100%);
          color: #f8fafc;
          overflow-x: hidden;
        }

        .landing-page * {
          box-sizing: border-box;
        }

        .landing-page a {
          -webkit-tap-highlight-color: transparent;
        }

        .landing-shell {
          width: min(1200px, calc(100% - 32px));
          margin: 0 auto;
        }

        .landing-nav {
          position: sticky;
          top: 0;
          z-index: 30;
          backdrop-filter: blur(20px);
          background: rgba(3, 7, 18, 0.82);
          border-bottom: 1px solid rgba(148, 163, 184, 0.12);
        }

        .landing-nav::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201, 162, 77, 0.42), transparent);
          pointer-events: none;
        }

        .landing-nav-inner {
          width: min(1200px, calc(100% - 32px));
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 0;
          gap: 18px;
        }

        .landing-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #ffffff;
          text-decoration: none;
          font-weight: 900;
          letter-spacing: -0.035em;
        }

        .landing-nav-home {
          flex: 0 0 auto;
          text-decoration: none;
          color: inherit;
          padding: 4px 0;
          line-height: 0;
          overflow: visible;
          max-width: min(520px, 90vw);
        }

        /* Nav: solo letras (export RGBA recortado) */
        .landing-nav-letters-img {
          line-height: 0;
        }

        .landing-nav-letters-img img {
          display: block;
          height: clamp(24px, 3.4vw, 36px);
          width: auto;
          max-width: min(300px, 70vw);
          object-fit: contain;
          object-position: left center;
          filter: drop-shadow(0 1px 8px rgba(0, 0, 0, 0.45));
        }

        .landing-nav-home:focus-visible {
          outline: 2px solid rgba(125, 211, 252, 0.9);
          outline-offset: 4px;
          border-radius: 10px;
        }

        .landing-nav-links a:focus-visible {
          outline: 2px solid rgba(125, 211, 252, 0.85);
          outline-offset: 4px;
          border-radius: 6px;
        }

        .landing-button:focus-visible {
          outline: 2px solid rgba(125, 211, 252, 0.95);
          outline-offset: 3px;
        }

        @media (prefers-reduced-motion: reduce) {
          .landing-button:hover {
            transform: none;
          }
        }

        .landing-hero-brand-wrap {
          width: 100%;
          max-width: min(720px, 100%);
          margin: 0 0 24px;
          display: flex;
          justify-content: center;
        }

        .landing-hero-lockup {
          max-width: min(680px, 92vw);
          filter: drop-shadow(0 18px 34px rgba(0, 0, 0, 0.42));
        }

        .landing-hero-lockup img {
          image-rendering: auto;
        }

        @media (max-width: 540px) {
          .landing-hero-brand-wrap {
            max-width: min(100%, calc(100vw - 24px));
            margin-bottom: 20px;
          }

          .landing-hero-lockup {
            filter: drop-shadow(0 10px 22px rgba(0, 0, 0, 0.38));
          }
        }

        @media (max-width: 360px) {
          .landing-hero-brand-wrap {
            max-width: min(100%, calc(100vw - 16px));
            margin-bottom: 16px;
          }
        }

        .landing-brand-logo-footer {
          max-width: min(380px, 82vw);
        }

        .landing-footer-brand-img {
          line-height: 0;
        }

        .landing-footer-brand-img img {
          display: block;
          max-height: 40px;
          width: auto;
          max-width: min(320px, 70vw);
          object-fit: contain;
          object-position: left center;
          filter: drop-shadow(0 2px 10px rgba(0, 0, 0, 0.38));
          opacity: 0.96;
        }

        .landing-nav-links {
          display: flex;
          align-items: center;
          gap: 24px;
          color: #cbd5e1;
          font-size: 14px;
        }

        .landing-nav-links a {
          color: inherit;
          text-decoration: none;
          transition: color 0.2s ease;
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
          padding: 11px 17px;
          font-weight: 900;
          text-decoration: none;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease,
            box-shadow 0.2s ease;
          white-space: nowrap;
          font-size: 14px;
        }

        .landing-button:hover {
          transform: translateY(-1px);
        }

        .landing-button-primary {
          background: linear-gradient(135deg, #10b981, #2563eb);
          color: #ffffff;
          box-shadow: 0 18px 50px rgba(16, 185, 129, 0.18);
        }

        .landing-button-primary:hover {
          box-shadow:
            0 20px 60px rgba(16, 185, 129, 0.24),
            0 0 0 1px rgba(255, 255, 255, 0.08);
        }

        .landing-button-secondary {
          background: rgba(15, 23, 42, 0.72);
          color: #f8fafc;
          border: 1px solid rgba(201, 162, 77, 0.38);
        }

        .landing-button-secondary:hover {
          border-color: rgba(201, 162, 77, 0.72);
          background: rgba(15, 23, 42, 0.92);
        }

        .landing-hero {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 0.86fr) minmax(440px, 1.14fr);
          gap: 36px;
          align-items: center;
          padding: 82px 0 62px;
        }

        .landing-hero::before {
          content: '';
          position: absolute;
          inset: -40px -140px 0 -140px;
          background-image:
            linear-gradient(rgba(148, 163, 184, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.05) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(circle at 32% 28%, black, transparent 68%);
          pointer-events: none;
        }

        .landing-hero-content {
          position: relative;
          z-index: 1;
        }

        .landing-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #7dd3fc;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.17em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }

        .landing-eyebrow::before {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #c9a24d;
          box-shadow: 0 0 22px rgba(201, 162, 77, 0.82);
        }

        .landing-hero h1 {
          margin: 0;
          font-size: clamp(42px, 6vw, 78px);
          line-height: 0.92;
          letter-spacing: -0.075em;
          max-width: 780px;
        }

        .landing-gradient-text {
          background: linear-gradient(135deg, #ffffff 0%, #dbeafe 46%, #93c5fd 100%);
          -webkit-background-clip: text;
          color: transparent;
        }

        .landing-hero-copy {
          color: #cbd5e1;
          font-size: 18px;
          line-height: 1.72;
          margin: 25px 0 18px;
          max-width: 660px;
        }

        .landing-highlight {
          color: #ffffff;
          font-weight: 850;
        }

        .landing-trust-line {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #d1d5db;
          font-size: 14px;
          line-height: 1.5;
          margin: 0 0 28px;
        }

        .landing-trust-line svg {
          flex: 0 0 auto;
          color: #10b981;
        }

        .landing-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .hero-proof {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 30px;
          max-width: 620px;
        }

        .hero-proof-card {
          border-radius: 18px;
          padding: 14px;
          background: rgba(15, 23, 42, 0.58);
          border: 1px solid rgba(148, 163, 184, 0.12);
        }

        .hero-proof-card strong {
          display: block;
          color: #ffffff;
          font-size: 18px;
          letter-spacing: -0.03em;
        }

        .hero-proof-card span {
          display: block;
          color: #94a3b8;
          font-size: 12px;
          margin-top: 4px;
          line-height: 1.4;
        }

        .landing-dashboard {
          position: relative;
          z-index: 1;
          border-radius: 30px;
          border: 1px solid rgba(148, 163, 184, 0.16);
          background:
            radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.17), transparent 28%),
            radial-gradient(circle at 0% 100%, rgba(16, 185, 129, 0.1), transparent 28%),
            linear-gradient(135deg, rgba(15, 23, 42, 0.94), rgba(2, 6, 23, 0.98));
          box-shadow:
            0 34px 140px rgba(0, 0, 0, 0.62),
            0 0 90px rgba(37, 99, 235, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          padding: 18px;
          overflow: hidden;
        }

        .landing-dashboard::before {
          content: '';
          position: absolute;
          width: 240px;
          height: 240px;
          top: -120px;
          right: -80px;
          background: radial-gradient(circle, rgba(201, 162, 77, 0.16), transparent 68%);
          pointer-events: none;
        }

        .landing-dashboard::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 30px;
          pointer-events: none;
          border: 1px solid rgba(201, 162, 77, 0.18);
        }

        .dashboard-top {
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 14px;
          z-index: 1;
        }

        .dashboard-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 950;
          letter-spacing: -0.03em;
        }

        .dashboard-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #10b981;
          box-shadow: 0 0 18px rgba(16, 185, 129, 0.85);
        }

        .dashboard-time {
          color: #94a3b8;
          font-size: 12px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }

        .dashboard-grid {
          position: relative;
          display: grid;
          grid-template-columns: 0.84fr 1.36fr;
          gap: 14px;
          z-index: 1;
        }

        .dashboard-sidebar,
        .dashboard-main-card,
        .dashboard-card {
          border-radius: 20px;
          background: rgba(15, 23, 42, 0.72);
          border: 1px solid rgba(148, 163, 184, 0.13);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035);
        }

        .dashboard-sidebar {
          padding: 14px;
        }

        .dashboard-menu {
          display: grid;
          gap: 10px;
          margin-top: 12px;
        }

        .dashboard-menu-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #94a3b8;
          font-size: 12px;
          padding: 9px 10px;
          border-radius: 12px;
          border: 1px solid transparent;
        }

        .dashboard-menu-item.active {
          color: #ffffff;
          background: rgba(59, 130, 246, 0.16);
          border-color: rgba(59, 130, 246, 0.3);
          box-shadow: 0 0 28px rgba(37, 99, 235, 0.08);
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
          letter-spacing: 0.085em;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }

        .dashboard-value {
          color: #ffffff;
          font-size: 18px;
          font-weight: 950;
          margin-top: 7px;
          letter-spacing: -0.035em;
        }

        .dashboard-good {
          color: #22c55e;
          font-size: 11px;
          margin-top: 4px;
        }

        .kpi-icon {
          color: #60a5fa;
          margin-bottom: 8px;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: 1.36fr 0.92fr;
          gap: 14px;
        }

        .chart-card {
          min-height: 264px;
        }

        .fake-chart {
          height: 154px;
          margin-top: 18px;
          border-radius: 16px;
          background:
            linear-gradient(180deg, rgba(16, 185, 129, 0.16), transparent),
            repeating-linear-gradient(
              0deg,
              rgba(148, 163, 184, 0.08),
              rgba(148, 163, 184, 0.08) 1px,
              transparent 1px,
              transparent 30px
            );
          position: relative;
          overflow: hidden;
        }

        .fake-chart::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), transparent);
          transform: translateX(-80%);
          animation: chartSweep 5.6s ease-in-out infinite;
        }

        @keyframes chartSweep {
          0%, 42% {
            transform: translateX(-90%);
          }

          70%, 100% {
            transform: translateX(120%);
          }
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
          grid-template-columns: 1.3fr 0.8fr 0.62fr 0.3fr;
          gap: 8px;
          color: #cbd5e1;
          align-items: center;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        }

        .risk-pill {
          display: inline-flex;
          justify-content: center;
          border-radius: 999px;
          padding: 4px 7px;
          font-size: 10px;
          font-weight: 900;
        }

        .risk-high {
          color: #fecaca;
          background: rgba(248, 113, 113, 0.14);
          border: 1px solid rgba(248, 113, 113, 0.22);
        }

        .risk-medium {
          color: #fde68a;
          background: rgba(251, 191, 36, 0.12);
          border: 1px solid rgba(251, 191, 36, 0.2);
        }

        .risk-low {
          color: #bbf7d0;
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .summary-list {
          margin-top: 14px;
          display: grid;
          gap: 9px;
          color: #cbd5e1;
          font-size: 12px;
          line-height: 1.5;
        }

        .summary-item {
          display: flex;
          gap: 8px;
        }

        .summary-item svg {
          flex: 0 0 auto;
          color: #c9a24d;
          margin-top: 1px;
        }

        .landing-section {
          padding: 56px 0;
        }

        .context-panel,
        .pillars-panel,
        .agents-panel,
        .trust-panel,
        .loop-panel {
          border-radius: 32px;
          background:
            radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.08), transparent 28%),
            linear-gradient(135deg, rgba(15, 23, 42, 0.82), rgba(2, 6, 23, 0.94));
          border: 1px solid rgba(148, 163, 184, 0.13);
          box-shadow:
            0 26px 90px rgba(0, 0, 0, 0.36),
            inset 0 1px 0 rgba(255, 255, 255, 0.035);
          position: relative;
          overflow: hidden;
        }

        .context-panel::after,
        .pillars-panel::after,
        .agents-panel::after,
        .trust-panel::after,
        .loop-panel::after {
          content: '';
          position: absolute;
          left: 32px;
          right: 32px;
          top: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201, 162, 77, 0.42), transparent);
          pointer-events: none;
        }

        .context-panel {
          display: grid;
          grid-template-columns: 330px 1fr;
          gap: 30px;
          align-items: center;
          padding: 34px;
        }

        .context-orb {
          height: 230px;
          border-radius: 26px;
          background:
            radial-gradient(circle, rgba(59, 130, 246, 0.2), transparent 58%),
            radial-gradient(circle at 55% 42%, rgba(201, 162, 77, 0.3), transparent 9%),
            linear-gradient(135deg, rgba(15, 23, 42, 0.66), rgba(2, 6, 23, 0.88));
          border: 1px solid rgba(148, 163, 184, 0.14);
          display: grid;
          place-items: center;
          color: #c9a24d;
          position: relative;
          overflow: hidden;
        }

        .context-orb::before {
          content: '';
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 999px;
          border: 1px solid rgba(201, 162, 77, 0.18);
        }

        .context-orb::after {
          content: '';
          position: absolute;
          width: 210px;
          height: 210px;
          border-radius: 999px;
          border: 1px dashed rgba(96, 165, 250, 0.18);
        }

        .section-kicker {
          color: #c9a24d;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.17em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .section-heading {
          margin: 0;
          color: #ffffff;
          font-size: clamp(30px, 4vw, 52px);
          line-height: 1.04;
          letter-spacing: -0.055em;
        }

        .section-copy {
          color: #cbd5e1;
          font-size: 16px;
          line-height: 1.72;
          margin: 18px 0 0;
        }

        .context-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 24px;
        }

        .context-metric {
          border-radius: 18px;
          padding: 14px;
          background: rgba(2, 6, 23, 0.48);
          border: 1px solid rgba(148, 163, 184, 0.12);
        }

        .context-metric strong {
          display: block;
          color: #ffffff;
          font-size: 18px;
          letter-spacing: -0.03em;
        }

        .context-metric span {
          display: block;
          color: #94a3b8;
          font-size: 12px;
          margin-top: 4px;
        }

        .pillars-panel {
          padding: 36px;
        }

        .pillars-title {
          text-align: center;
          margin-bottom: 30px;
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: 1fr 150px 1fr;
          gap: 18px;
          align-items: center;
        }

        .pillar-group {
          display: grid;
          gap: 14px;
        }

        .pillar-label {
          font-size: 13px;
          font-weight: 950;
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
          min-height: 170px;
          border-radius: 24px;
          padding: 21px;
          background:
            radial-gradient(circle at 100% 0%, rgba(96, 165, 250, 0.08), transparent 32%),
            rgba(2, 6, 23, 0.58);
          border: 1px solid rgba(148, 163, 184, 0.14);
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .pillar-card:hover {
          transform: translateY(-2px);
          border-color: rgba(201, 162, 77, 0.32);
          background:
            radial-gradient(circle at 100% 0%, rgba(96, 165, 250, 0.12), transparent 32%),
            rgba(2, 6, 23, 0.72);
        }

        .pillar-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }

        .pillar-icon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: rgba(59, 130, 246, 0.12);
          color: #93c5fd;
          border: 1px solid rgba(201, 162, 77, 0.22);
        }

        .pillar-metric {
          display: inline-flex;
          width: fit-content;
          margin-bottom: 10px;
          color: #c9a24d;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .pillar-card h3,
        .agent-card h3 {
          margin: 0 0 8px;
          color: #ffffff;
          font-size: 18px;
          letter-spacing: -0.03em;
        }

        .pillar-card p,
        .agent-card p {
          color: #cbd5e1;
          line-height: 1.58;
          margin: 0;
          font-size: 14px;
        }

        .central-node {
          min-height: 360px;
          display: grid;
          place-items: center;
          position: relative;
        }

        .central-node::before,
        .central-node::after {
          content: '';
          position: absolute;
          width: 1px;
          height: 100%;
          background: linear-gradient(180deg, transparent, rgba(201, 162, 77, 0.32), transparent);
        }

        .central-node::after {
          transform: rotate(90deg);
          width: 1px;
          height: 150%;
        }

        .central-node-core {
          width: 96px;
          height: 96px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background:
            radial-gradient(circle, rgba(201, 162, 77, 0.34), rgba(59, 130, 246, 0.14));
          border: 1px solid rgba(201, 162, 77, 0.5);
          box-shadow:
            0 0 50px rgba(201, 162, 77, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          color: #c9a24d;
          position: relative;
          z-index: 1;
        }

        .central-node-badge {
          position: absolute;
          bottom: 88px;
          left: 50%;
          transform: translateX(-50%);
          color: #94a3b8;
          font-size: 11px;
          text-align: center;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          white-space: nowrap;
        }

        .agents-panel {
          padding: 36px;
        }

        .agents-header {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 25px;
        }

        .agents-orbit {
          width: 74px;
          height: 74px;
          border-radius: 24px;
          display: grid;
          place-items: center;
          color: #c9a24d;
          border: 1px solid rgba(201, 162, 77, 0.3);
          background:
            radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.12), transparent 22%),
            linear-gradient(135deg, rgba(201, 162, 77, 0.1), rgba(59, 130, 246, 0.12));
        }

        .agents-row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
        }

        .agent-card {
          border-radius: 24px;
          padding: 19px;
          background:
            radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.1), transparent 32%),
            rgba(2, 6, 23, 0.58);
          border: 1px solid rgba(148, 163, 184, 0.13);
          min-height: 220px;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease;
        }

        .agent-card:hover {
          transform: translateY(-2px);
          border-color: rgba(96, 165, 250, 0.32);
        }

        .agent-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }

        .agent-icon {
          color: #60a5fa;
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
          box-shadow: 0 0 14px rgba(34, 197, 94, 0.55);
        }

        .progress-track {
          height: 7px;
          border-radius: 999px;
          background: rgba(148, 163, 184, 0.14);
          overflow: hidden;
          margin-top: 22px;
        }

        .progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #10b981, #2563eb);
        }

        .signals-panel {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .signal-card {
          border-radius: 22px;
          padding: 18px;
          background: rgba(15, 23, 42, 0.54);
          border: 1px solid rgba(148, 163, 184, 0.12);
        }

        .signal-card svg {
          color: #c9a24d;
          margin-bottom: 10px;
        }

        .signal-card strong {
          display: block;
          color: #ffffff;
          margin-bottom: 6px;
        }

        .signal-card p {
          color: #cbd5e1;
          margin: 0;
          line-height: 1.55;
          font-size: 13px;
        }

        .trust-panel {
          padding: 36px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 26px;
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
          font-weight: 800;
          line-height: 1.4;
        }

        .trust-item svg {
          flex: 0 0 auto;
          color: #c9a24d;
        }

        .isolation-card {
          border-radius: 26px;
          padding: 24px;
          background:
            radial-gradient(circle at 100% 0%, rgba(16, 185, 129, 0.09), transparent 34%),
            rgba(2, 6, 23, 0.64);
          border: 1px solid rgba(148, 163, 184, 0.13);
        }

        .isolation-card h3 {
          margin: 8px 0 0;
          color: #ffffff;
          font-size: 24px;
          letter-spacing: -0.04em;
        }

        .isolation-copy {
          color: #cbd5e1;
          line-height: 1.6;
          margin: 10px 0 0;
        }

        .org-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 20px;
        }

        .org-card {
          border-radius: 20px;
          padding: 17px;
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

        .org-card p {
          color: #cbd5e1;
          font-size: 12px;
          margin: 10px 0 0;
        }

        .loop-panel {
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: 30px;
          padding: 36px;
        }

        .loop-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 24px;
        }

        .loop-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          padding: 9px 12px;
          color: #dbeafe;
          font-size: 13px;
          font-weight: 800;
          background: rgba(15, 23, 42, 0.62);
          border: 1px solid rgba(148, 163, 184, 0.13);
        }

        .loop-badge svg {
          color: #10b981;
        }

        .landing-form {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          align-content: start;
        }

        .landing-form label {
          display: grid;
          gap: 7px;
          color: #94a3b8;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .landing-form input,
        .landing-form select {
          width: 100%;
          border: 1px solid rgba(148, 163, 184, 0.16);
          border-radius: 15px;
          background: rgba(2, 6, 23, 0.78);
          color: #ffffff;
          padding: 14px 13px;
          outline: none;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .landing-form input:focus,
        .landing-form select:focus {
          border-color: rgba(96, 165, 250, 0.58);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
          background: rgba(2, 6, 23, 0.95);
        }

        .landing-form input::placeholder {
          color: #64748b;
        }

        .landing-form .full {
          grid-column: 1 / -1;
        }

        .landing-footer {
          padding: 30px 0 40px;
          color: #94a3b8;
          border-top: 1px solid rgba(148, 163, 184, 0.1);
          margin-top: 50px;
        }

        .landing-footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          font-size: 13px;
        }

        .footer-claim {
          color: #dbeafe;
          font-weight: 800;
        }

        @media (max-width: 1080px) {
          .landing-hero {
            grid-template-columns: 1fr;
          }

          .landing-dashboard {
            max-width: 860px;
            width: 100%;
            margin: 0 auto;
          }

          .agents-row {
            grid-template-columns: repeat(2, 1fr);
          }

          .signals-panel {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 980px) {
          .landing-nav-links {
            display: none;
          }

          .context-panel,
          .trust-panel,
          .loop-panel {
            grid-template-columns: 1fr;
          }

          .dashboard-grid,
          .dashboard-content,
          .pillars-grid,
          .org-grid {
            grid-template-columns: 1fr;
          }

          .central-node {
            min-height: 160px;
          }

          .central-node::before,
          .central-node::after,
          .central-node-badge {
            display: none;
          }

          .dashboard-kpis {
            grid-template-columns: repeat(2, 1fr);
          }

          .context-metrics,
          .hero-proof {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .landing-nav-inner {
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
          }

          .landing-nav-actions {
            display: none;
          }

          .landing-hero {
            padding: 58px 0 38px;
          }

          .landing-hero h1 {
            font-size: clamp(39px, 15vw, 58px);
          }

          .landing-hero-copy {
            font-size: 16px;
          }

          .landing-hero-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .landing-button {
            width: 100%;
          }

          .dashboard-top,
          .agents-header,
          .landing-footer-inner {
            flex-direction: column;
            align-items: stretch;
          }

          .landing-dashboard,
          .context-panel,
          .pillars-panel,
          .agents-panel,
          .trust-panel,
          .loop-panel {
            border-radius: 24px;
            padding: 20px;
          }

          .dashboard-kpis,
          .agents-row,
          .landing-form {
            grid-template-columns: 1fr;
          }

          .supplier-row {
            grid-template-columns: 1fr;
          }

          .dashboard-sidebar {
            display: none;
          }

          .fake-chart {
            height: 130px;
          }

          .section-heading {
            letter-spacing: -0.045em;
          }
        }
      `}</style>

      <nav className="landing-nav" aria-label="Navegación principal">
        <div className="landing-nav-inner">
          <Link to="/" className="landing-nav-home">
            <BrandLogo
              variant="horizontal"
              horizontalAsset="letters"
              size="md"
              surface="transparent"
              className="landing-nav-letters-img"
              alt="CEO's OS"
              loading="eager"
            />
          </Link>

          <div className="landing-nav-links">
            <a href="#modules">Módulos</a>
            <a href="#agents">Agentes IA</a>
            <a href="#security">Seguridad</a>
            <a href="#access">Acceso</a>
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

      <div className="landing-shell" id="contenido-principal">
        <section className="landing-hero" aria-labelledby="landing-hero-heading">
          <div className="landing-hero-content">
            <div className="landing-eyebrow">
              Private by Design · Sovereign Intelligence
            </div>

            <div className="landing-hero-brand-wrap">
              <BrandLogo
                variant="lockup"
                emblemAsset="lion"
                horizontalAsset="letters"
                size="hero"
                surface="transparent"
                className="landing-hero-lockup"
                alt="CEO's OS — Executive Operating System"
                loading="eager"
                fetchpriority="high"
                lockupResponsive
              />
            </div>

            <h1 id="landing-hero-heading">
              <span className="landing-gradient-text">
                The private executive operating system for company intelligence.
              </span>
            </h1>

            <p className="landing-hero-copy">
              Deje de gestionar datos dispersos. Empiece a dictar la estrategia.
              Analice <span className="landing-highlight">M&A</span>,{' '}
              <span className="landing-highlight">Compliance</span> y{' '}
              <span className="landing-highlight">Financiación</span> desde su
              infraestructura privada asistida por IA.
            </p>

            <div className="landing-trust-line">
              <ShieldCheck size={18} />
              Built for high-stakes decisions. Private by design, secure by architecture.
            </div>

            <div className="landing-hero-actions">
              <a href="#access" className="landing-button landing-button-primary">
                Solicitar acceso ejecutivo
                <ChevronRight size={16} />
              </a>

              <Link to="/login" className="landing-button landing-button-secondary">
                Acceso Directo (Usuarios Registrados)
              </Link>
            </div>

            <div className="hero-proof">
              <div className="hero-proof-card">
                <strong>M&A</strong>
                <span>Valoración, targets, sinergias y data rooms.</span>
              </div>
              <div className="hero-proof-card">
                <strong>Risk</strong>
                <span>Controles, evidencias, proveedores y alertas.</span>
              </div>
              <div className="hero-proof-card">
                <strong>Funding</strong>
                <span>Readiness, escenarios y narrativa inversora.</span>
              </div>
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
                  {commandStats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                      <div className="dashboard-card" key={stat.label}>
                        <Icon className="kpi-icon" size={17} />
                        <div className="dashboard-label">{stat.label}</div>
                        <div className="dashboard-value">{stat.value}</div>
                        <div className="dashboard-good">{stat.meta}</div>
                      </div>
                    );
                  })}
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
                      {executiveSignals.map((signal) => {
                        const Icon = signal.icon;

                        return (
                          <div className="summary-item" key={signal.label}>
                            <Icon size={14} />
                            <span>
                              <strong>{signal.label}</strong> · {signal.description}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="dashboard-main-card dashboard-card">
                    <div className="dashboard-label">Top Supplier Risk</div>

                    <div className="supplier-table">
                      {supplierRisk.map(([supplier, category, risk, trend]) => (
                        <div className="supplier-row" key={supplier}>
                          <span>{supplier}</span>
                          <span>{category}</span>
                          <span className={`risk-pill risk-${risk.toLowerCase()}`}>
                            {risk}
                          </span>
                          <span>{trend}</span>
                        </div>
                      ))}
                    </div>

                    <div className="summary-list">
                      <div className="summary-item">
                        <BrainCircuit size={14} />
                        <span>M&A Analyst · Running</span>
                      </div>
                      <div className="summary-item">
                        <ShieldCheck size={14} />
                        <span>Compliance Agent · Reviewing</span>
                      </div>
                      <div className="summary-item">
                        <Landmark size={14} />
                        <span>Funding Agent · Synthesizing</span>
                      </div>
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
              <Network size={76} />
            </div>

            <div>
              <div className="section-kicker">The Context</div>
              <h2 className="section-heading">
                El 80% de la inteligencia de su empresa vive en emails y hojas
                de cálculo. Cámbielo por una visión soberana.
              </h2>
              <p className="section-copy">
                Compre tiempo, reduzca incertidumbre y transforme información
                dispersa en decisiones ejecutivas defendibles. CEO’s OS conecta
                estrategia, riesgo, capital y ejecución en una infraestructura
                privada diseñada para decisiones de alto impacto.
              </p>

              <div className="context-metrics">
                <div className="context-metric">
                  <strong>1 OS</strong>
                  <span>para dirección, riesgo, M&A y financiación.</span>
                </div>
                <div className="context-metric">
                  <strong>Private</strong>
                  <span>datos aislados por organización.</span>
                </div>
                <div className="context-metric">
                  <strong>AI Layer</strong>
                  <span>agentes operativos sobre datos internos.</span>
                </div>
              </div>
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
                          <ArrowUpRight size={18} />
                        </div>
                        <span className="pillar-metric">{module.metric}</span>
                        <h3>{module.label}</h3>
                        <p>{module.description}</p>
                      </article>
                    );
                  })}
              </div>

              <div className="central-node">
                <div className="central-node-core">
                  <BrainCircuit size={36} />
                </div>
                <div className="central-node-badge">AI Operating Layer</div>
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
                          <ArrowUpRight size={18} />
                        </div>
                        <span className="pillar-metric">{module.metric}</span>
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
                  el CEO. Agentes especializados para analizar, revisar,
                  sintetizar y convertir información en acción.
                </p>
              </div>

              <div className="agents-orbit">
                <BrainCircuit size={36} />
              </div>
            </div>

            <div className="agents-row">
              {agents.map((agent) => {
                const Icon = agent.icon;

                return (
                  <article className="agent-card" key={agent.name}>
                    <div className="agent-top">
                      <Icon className="agent-icon" size={24} />
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

            <div className="signals-panel">
              <div className="signal-card">
                <Zap size={22} />
                <strong>From data to action</strong>
                <p>
                  Los agentes no solo resumen: detectan señales, priorizan riesgos
                  y preparan decisiones.
                </p>
              </div>

              <div className="signal-card">
                <Gauge size={22} />
                <strong>Executive velocity</strong>
                <p>
                  Menos tiempo reconstruyendo contexto. Más tiempo decidiendo con
                  información estructurada.
                </p>
              </div>

              <div className="signal-card">
                <BarChart3 size={22} />
                <strong>Operational memory</strong>
                <p>
                  Cada módulo conserva trazabilidad, evidencias y señales
                  relevantes por organización.
                </p>
              </div>
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

              <p className="section-copy">
                CEO’s OS nace con una premisa clara: la inteligencia corporativa
                no debe dispersarse. Cada organización trabaja dentro de su propio
                perímetro lógico, con autenticación real y separación de datos por
                organización.
              </p>

              <div className="trust-list">
                {securityItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div className="trust-item" key={item.label}>
                      <Icon size={18} />
                      {item.label}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="isolation-card">
              <div className="dashboard-label">Isolated by Design</div>
              <h3>Your data stays in your boundary.</h3>
              <p className="isolation-copy">
                Arquitectura multi-tenant basada en organizationId para que cada
                empresa opere en su propio entorno lógico.
              </p>

              <div className="org-grid">
                {[
                  ['ACME Holdings', 'org_01'],
                  ['Nexa Partners', 'org_02'],
                  ['Orion Capital', 'org_03']
                ].map(([name, org]) => (
                  <div className="org-card" key={org}>
                    <Building2 size={34} />
                    <strong>{name}</strong>
                    <span>Organization ID: {org}</span>
                    <p>Private Data Boundary</p>
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
              <h2 className="section-heading">Solicite acceso ejecutivo.</h2>
              <p className="section-copy">
                CEO’s OS está actualmente en fase de despliegue controlado para
                fundadores, inversores y operadores seleccionados. No es una
                herramienta pública; es una infraestructura privada para empresas
                que necesitan claridad, velocidad y control.
              </p>

              <div className="loop-badges">
                <div className="loop-badge">
                  <CheckCircle2 size={16} />
                  Acceso limitado
                </div>
                <div className="loop-badge">
                  <Lock size={16} />
                  Máxima confidencialidad
                </div>
                <div className="loop-badge">
                  <Users size={16} />
                  Acceso ejecutivo
                </div>
              </div>
            </div>

            <form className="landing-form" onSubmit={handleAccessSubmit}>
              <label>
                Name
                <input name="name" placeholder="Ej. Fernando Guerra" />
              </label>

              <label>
                Work Email
                <input name="email" placeholder="name@company.com" type="email" />
              </label>

              <label>
                Company
                <input name="company" placeholder="Ej. ACME Holdings" />
              </label>

              <label>
                LinkedIn
                <input name="linkedin" placeholder="https://linkedin.com/in/username" />
              </label>

              <label className="full">
                Use Case
                <select name="useCase" defaultValue="">
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
                Request executive access
                <ChevronRight size={16} />
              </button>
            </form>
          </div>
        </section>

        <footer className="landing-footer">
          <div className="landing-footer-inner">
            <div className="landing-logo landing-brand-logo-footer">
              <BrandLogo
                variant="horizontal"
                horizontalAsset="letters"
                size="md"
                surface="transparent"
                className="landing-footer-brand-img"
                alt="CEO's OS"
                loading="lazy"
              />
            </div>

            <div className="footer-claim">
              Clarity is the ultimate competitive advantage.
            </div>

            <div>© 2026 CEO’s OS. All rights reserved.</div>
          </div>
        </footer>
      </div>
    </main>
  );
}
