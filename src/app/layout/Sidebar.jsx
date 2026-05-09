import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Calculator,
  Landmark,
  Gem,
  Layers3,
  Network,
  Scale,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { routeGroups } from '../router/routeConfig.jsx';
import { BrandLogo } from '../../shared/components/brand/BrandLogo.jsx';

const GOLD = '#d4af37';
const MUTED_ICON = 'rgba(226,232,240,0.68)';

const SIDEBAR_GROUP_ORDER = [
  'overview',
  'ma',
  'compliance',
  'funding',
  'pmi',
  'governance',
  'heritage',
  'bridge'
];

const workspaceMeta = {
  overview: {
    icon: <Sparkles size={18} />,
    title: 'Executive Command Center',
    description: 'Vista superior de señales ejecutivas, módulos premium y prioridades del MVP.'
  },
  ma: {
    icon: <Calculator size={18} />,
    title: 'M&A Intelligence',
    description: 'Valoración, deal design, buyer matching y reporting ejecutivo.'
  },
  compliance: {
    icon: <ShieldCheck size={18} />,
    title: 'Compliance OS',
    description: 'Proveedores, alertas, evidencias, revisión humana y reportes DSS.'
  },
  funding: {
    icon: <Landmark size={18} />,
    title: 'Funding Studio',
    description: 'Readiness, estructura de capital, escenarios y data room inversor.'
  },
  pmi: {
    icon: <Layers3 size={18} />,
    title: 'PMI & Synergies',
    description: 'Integración post-adquisición, sinergias, workstreams, riesgos y plan 30-60-90.'
  },
  governance: {
    icon: <Scale size={18} />,
    title: 'Governance & ESG Strategy',
    description: 'Gobernanza, sostenibilidad, actas de consejo, decisiones estratégicas y reporting ESG.'
  },
  heritage: {
    icon: <Gem size={18} />,
    title: 'Heritage & Legacy OS',
    description: 'Patrimonio, family office, sucesión, protección de activos y legado familiar.'
  },
  bridge: {
    icon: <Network size={18} />,
    title: 'The Bridge',
    description: 'Red de liquidez, inversores, compradores verificados y oportunidades transaccionales.'
  }
};

const sidebarCss = `
  @keyframes ceosRgbRail {
    0% {
      background-position: 0% 0%;
    }

    50% {
      background-position: 0% 100%;
    }

    100% {
      background-position: 0% 0%;
    }
  }

  @keyframes ceosPremiumSweep {
    0% {
      transform: translateX(-120%) rotate(18deg);
      opacity: 0;
    }

    28% {
      opacity: 0.72;
    }

    100% {
      transform: translateX(310%) rotate(18deg);
      opacity: 0;
    }
  }

  .sidebar.ceos-sidebar {
    position: relative;
    isolation: isolate;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    height: 100vh;
    max-height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    border-right: 1px solid rgba(255,255,255,0.040);
    background:
      radial-gradient(circle at 50% 0%, rgba(255,255,255,0.016), transparent 32%),
      linear-gradient(180deg, #000000 0%, #000000 52%, #000000 100%) !important;
    box-shadow:
      inset -1px 0 0 rgba(255,255,255,0.016),
      34px 0 100px rgba(0,0,0,0.98);
    backdrop-filter: blur(24px) saturate(128%);
    -webkit-backdrop-filter: blur(24px) saturate(128%);
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .sidebar.ceos-sidebar::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }

  .sidebar.ceos-sidebar::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -4;
    background:
      linear-gradient(rgba(255,255,255,0.010) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.010) 1px, transparent 1px);
    background-size: 42px 42px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.68), transparent 92%);
    pointer-events: none;
  }

  .sidebar.ceos-sidebar::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -3;
    background:
      radial-gradient(circle at 0% 12%, rgba(212,175,55,0.025), transparent 26%),
      radial-gradient(circle at 100% 42%, rgba(52,211,153,0.018), transparent 28%),
      linear-gradient(135deg, rgba(255,255,255,0.016), transparent 34%, rgba(255,255,255,0.004));
    pointer-events: none;
  }

  .ceos-glass-layer {
    position: absolute;
    inset: 0;
    z-index: -2;
    background:
      linear-gradient(
        135deg,
        rgba(255,255,255,0.018),
        rgba(255,255,255,0.004) 22%,
        transparent 55%,
        rgba(255,255,255,0.005) 100%
      );
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.026),
      inset 0 -1px 0 rgba(255,255,255,0.010);
    pointer-events: none;
  }

  .ceos-glass-shine {
    position: absolute;
    top: -18%;
    left: -62%;
    z-index: -1;
    width: 84%;
    height: 140%;
    transform: rotate(17deg);
    background:
      linear-gradient(
        90deg,
        transparent,
        rgba(255,255,255,0.006),
        rgba(255,255,255,0.020),
        transparent
      );
    opacity: 0.16;
    filter: blur(1px);
    pointer-events: none;
  }

  .ceos-sidebar-edge-glow {
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 100%;
    background:
      linear-gradient(
        to bottom,
        transparent,
        rgba(255,255,255,0.060),
        rgba(212,175,55,0.13),
        rgba(52,211,153,0.070),
        rgba(96,165,250,0.055),
        transparent
      );
    box-shadow:
      0 0 18px rgba(212,175,55,0.075),
      0 0 18px rgba(52,211,153,0.035),
      0 0 24px rgba(255,255,255,0.018);
    pointer-events: none;
  }

  .ceos-sidebar-brand {
    position: relative;
    padding: 24px 18px 18px;
    border-bottom: 1px solid rgba(255,255,255,0.032);
    background:
      linear-gradient(
        180deg,
        rgba(255,255,255,0.012),
        rgba(255,255,255,0.003),
        transparent
      );
  }

  .ceos-sidebar-brand::after {
    content: "";
    position: absolute;
    left: 18px;
    right: 18px;
    bottom: -1px;
    height: 1px;
    background:
      linear-gradient(
        90deg,
        transparent,
        rgba(255,255,255,0.055),
        rgba(212,175,55,0.10),
        transparent
      );
    pointer-events: none;
  }

  .ceos-brand-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 17px;
  }

  .ceos-brand-mark {
    position: relative;
    overflow: hidden;
    width: 46px;
    height: 46px;
    border-radius: 17px;
    display: grid;
    place-items: center;
    color: ${GOLD};
    background:
      radial-gradient(circle at 35% 18%, rgba(255,255,255,0.075), transparent 25%),
      linear-gradient(135deg, rgba(212,175,55,0.075), rgba(255,255,255,0.010)),
      #000000;
    border: 1px solid rgba(212,175,55,0.15);
    box-shadow:
      0 18px 42px rgba(0,0,0,0.90),
      0 0 22px rgba(212,175,55,0.10),
      inset 0 1px 0 rgba(255,255,255,0.060),
      inset 0 -1px 0 rgba(255,255,255,0.010);
    backdrop-filter: blur(18px) saturate(135%);
    -webkit-backdrop-filter: blur(18px) saturate(135%);
  }

  .ceos-brand-mark::before {
    content: "";
    position: absolute;
    inset: 1px;
    border-radius: 16px;
    background:
      linear-gradient(
        145deg,
        rgba(255,255,255,0.075),
        transparent 36%,
        transparent 70%,
        rgba(255,255,255,0.020)
      );
    pointer-events: none;
  }

  .ceos-brand-mark img {
    position: relative;
    z-index: 1;
    width: 28px;
    height: 28px;
    object-fit: contain;
    display: block;
    filter: drop-shadow(0 0 10px rgba(212,175,55,0.2));
  }

  .ceos-brand-title {
    font-size: 19.5px;
    font-weight: 950;
    line-height: 1;
    letter-spacing: -0.050em;
    color: #ffffff;
    text-shadow:
      0 0 12px rgba(255,255,255,0.050),
      0 0 16px rgba(212,175,55,0.085);
  }

  .ceos-brand-subtitle {
    margin-top: 6px;
    font-size: 10.5px;
    color: rgba(226,232,240,0.42);
    font-weight: 850;
    text-transform: uppercase;
    letter-spacing: 0.112em;
    line-height: 1.35;
  }

  .ceos-workspace-card {
    position: relative;
    overflow: hidden;
    padding: 14px;
    border-radius: 18px;
    background:
      radial-gradient(circle at 12% 0%, rgba(255,255,255,0.020), transparent 30%),
      linear-gradient(135deg, rgba(212,175,55,0.026), rgba(255,255,255,0.007)),
      rgba(0,0,0,0.94);
    border: 1px solid rgba(212,175,55,0.085);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.032),
      inset 0 -1px 0 rgba(255,255,255,0.010),
      0 18px 44px rgba(0,0,0,0.82);
    backdrop-filter: blur(22px) saturate(140%);
    -webkit-backdrop-filter: blur(22px) saturate(140%);
  }

  .ceos-workspace-card::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(
        115deg,
        rgba(255,255,255,0.060),
        transparent 36%,
        transparent 100%
      );
    opacity: 0.48;
    pointer-events: none;
  }

  .ceos-workspace-card::after {
    content: "";
    position: absolute;
    top: -46%;
    left: -64%;
    width: 42%;
    height: 190%;
    background:
      linear-gradient(
        90deg,
        transparent,
        rgba(255,255,255,0.075),
        rgba(212,175,55,0.070),
        transparent
      );
    opacity: 0;
    pointer-events: none;
  }

  .ceos-workspace-card:hover::after {
    animation: ceosPremiumSweep 0.95s cubic-bezier(.22,.61,.36,1);
  }

  .ceos-workspace-title {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 9px;
    color: ${GOLD};
    font-size: 12.7px;
    font-weight: 950;
    margin-bottom: 7px;
    letter-spacing: -0.01em;
  }

  .ceos-workspace-title svg {
    color: ${GOLD} !important;
    stroke: ${GOLD} !important;
    filter: drop-shadow(0 0 10px rgba(212,175,55,0.20));
  }

  .ceos-workspace-copy {
    position: relative;
    z-index: 1;
    margin: 0;
    color: rgba(226,232,240,0.52);
    font-size: 12px;
    line-height: 1.5;
  }

  .ceos-nav {
    padding: 20px 12px 90vh;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .ceos-nav-section-title {
    position: relative;
    padding: 0 10px 13px;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.112em;
    color: rgba(226,232,240,0.31);
    transition:
      color .26s ease,
      text-shadow .26s ease,
      transform .26s ease;
  }

  .ceos-nav-section-title::after {
    content: "";
    position: absolute;
    left: 10px;
    bottom: 0;
    width: 42px;
    height: 5px;
    border-radius: 999px;
    background:
      linear-gradient(
        90deg,
        rgba(255,255,255,0.062),
        rgba(255,255,255,0.018)
      );
    border: 1px solid rgba(255,255,255,0.042);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.075),
      inset 0 -1px 0 rgba(255,255,255,0.012),
      0 8px 22px rgba(0,0,0,0.66);
    transition:
      width .28s cubic-bezier(.22,.61,.36,1),
      background .28s ease,
      border-color .28s ease,
      box-shadow .28s ease;
  }

  .ceos-nav-section-title.is-active {
    color: #f8fafc;
    transform: translateX(1px);
    text-shadow:
      0 0 17px rgba(212,175,55,0.18),
      0 0 12px rgba(255,255,255,0.055);
  }

  .ceos-nav-section-title.is-active::after {
    width: 88px;
    background:
      linear-gradient(
        90deg,
        rgba(255,255,255,0.11),
        rgba(212,175,55,0.64),
        rgba(255,255,255,0.065)
      );
    border-color: rgba(212,175,55,0.18);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.15),
      inset 0 -1px 0 rgba(255,255,255,0.020),
      0 0 21px rgba(212,175,55,0.19),
      0 10px 28px rgba(0,0,0,0.66);
  }

  .ceos-nav-list {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .ceos-nav-link {
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 11px 12px 11px 14px;
    border-radius: 15px;
    text-decoration: none;
    font-size: 13px;
    font-weight: 850;
    transition:
      transform .22s cubic-bezier(.22,.61,.36,1),
      color .18s ease,
      background .18s ease,
      border-color .18s ease,
      box-shadow .18s ease,
      filter .18s ease;
    backdrop-filter: blur(11px) saturate(120%);
    -webkit-backdrop-filter: blur(11px) saturate(120%);
  }

  .ceos-nav-link:hover {
    transform: translateX(5px) scale(1.018);
  }

  .ceos-nav-link-shine {
    position: absolute;
    top: -48%;
    left: -72%;
    width: 42%;
    height: 196%;
    transform: rotate(18deg);
    background:
      linear-gradient(
        90deg,
        transparent,
        rgba(255,255,255,0.070),
        rgba(212,175,55,0.12),
        transparent
      );
    opacity: 0;
    transition:
      left .62s cubic-bezier(.22,.61,.36,1),
      opacity .18s ease;
    pointer-events: none;
    z-index: 1;
  }

  .ceos-nav-link:hover .ceos-nav-link-shine {
    left: 120%;
    opacity: 1;
  }

  .ceos-active-rail {
    position: absolute;
    left: 0;
    top: 10px;
    bottom: 10px;
    width: 4px;
    border-radius: 999px;
    background:
      linear-gradient(
        180deg,
        #d4af37 0%,
        #34d399 45%,
        #60a5fa 78%,
        #d4af37 100%
      );
    background-size: 100% 220%;
    animation: ceosRgbRail 3.8s ease infinite;
    box-shadow:
      0 0 18px rgba(212,175,55,0.48),
      0 0 18px rgba(52,211,153,0.24),
      0 0 16px rgba(96,165,250,0.22);
    pointer-events: none;
    z-index: 3;
  }

  .ceos-nav-icon {
    position: relative;
    z-index: 3;
    display: grid;
    place-items: center;
    width: 25px;
    height: 25px;
    transition:
      color .2s ease,
      transform .22s cubic-bezier(.22,.61,.36,1),
      filter .2s ease;
  }

  .ceos-nav-icon svg,
  .ceos-nav-svg {
    color: currentColor !important;
    stroke: currentColor !important;
  }

  .ceos-nav-label {
    position: relative;
    z-index: 3;
    min-width: 0;
    overflow-wrap: anywhere;
    transition:
      transform .2s ease,
      text-shadow .2s ease;
  }

  .ceos-sidebar-footer {
    margin-top: auto;
    padding: 16px;
    border-top: 1px solid rgba(255,255,255,0.030);
    background:
      linear-gradient(180deg, transparent, rgba(255,255,255,0.005));
  }

  .ceos-build-card {
    position: relative;
    overflow: hidden;
    padding: 13px;
    border-radius: 17px;
    background:
      radial-gradient(circle at 100% 0%, rgba(212,175,55,0.030), transparent 42%),
      linear-gradient(135deg, rgba(255,255,255,0.016), rgba(255,255,255,0.004)),
      rgba(0,0,0,0.94);
    border: 1px solid rgba(212,175,55,0.065);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.028),
      inset 0 -1px 0 rgba(255,255,255,0.010),
      0 16px 36px rgba(0,0,0,0.78);
    backdrop-filter: blur(20px) saturate(134%);
    -webkit-backdrop-filter: blur(20px) saturate(134%);
  }

  .ceos-build-title {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 950;
    color: #ffffff;
    margin-bottom: 5px;
  }

  .ceos-build-title svg {
    color: ${GOLD} !important;
    stroke: ${GOLD} !important;
    filter: drop-shadow(0 0 9px rgba(212,175,55,0.17));
  }

  .ceos-build-copy {
    position: relative;
    z-index: 1;
    margin: 0;
    font-size: 11px;
    line-height: 1.48;
    color: rgba(226,232,240,0.42);
  }

  /* STABLE SIDEBAR BEHAVIOR */
  .sidebar.ceos-sidebar {
    position: sticky !important;
    top: 0 !important;
    align-self: flex-start !important;
    height: 100vh !important;
    min-height: 100vh !important;
    max-height: 100vh !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
  }

  .ceos-nav {
    padding-bottom: 190vh !important;
  }

  @media (prefers-reduced-motion: reduce) {
    .ceos-nav-link,
    .ceos-nav-icon,
    .ceos-nav-label,
    .ceos-nav-link-shine,
    .ceos-nav-section-title,
    .ceos-nav-section-title::after,
    .ceos-active-rail,
    .ceos-workspace-card::after {
      transition: none !important;
      animation: none !important;
    }

    .ceos-nav-link:hover {
      transform: none;
    }
  }
`;

function getActiveWorkspace(pathname) {
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/overview') ||
    pathname.startsWith('/ceo/overview')
  ) {
    return 'overview';
  }

  if (pathname.startsWith('/compliance')) return 'compliance';
  if (pathname.startsWith('/funding')) return 'funding';
  if (pathname.startsWith('/pmi')) return 'pmi';
  if (pathname.startsWith('/governance')) return 'governance';
  if (pathname.startsWith('/heritage')) return 'heritage';
  if (pathname.startsWith('/bridge')) return 'bridge';

  return 'ma';
}


const STABLE_SIDEBAR_SECTION_LABELS = {
  overview: 'EXECUTIVE OS',
  ma: 'M&A',
  compliance: 'COMPLIANCE',
  funding: 'FUNDING',
  pmi: 'PMI',
  governance: 'GOVERNANCE & ESG',
  heritage: 'HERITAGE & LEGACY',
  bridge: 'THE BRIDGE'
};

function stableScrollSidebarToWorkspace(workspaceKey) {
  const sidebar = document.querySelector('.ceos-sidebar');

  if (!sidebar) return;

  const targetLabel = STABLE_SIDEBAR_SECTION_LABELS[workspaceKey];

  if (!targetLabel || workspaceKey === 'overview') {
    sidebar.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    return;
  }

  const sectionTitles = Array.from(
    sidebar.querySelectorAll('.ceos-nav-section-title')
  );

  const targetTitle = sectionTitles.find((title) => {
    return title.textContent?.trim().toUpperCase() === targetLabel;
  });

  if (!targetTitle) return;

  const maxScroll = Math.max(sidebar.scrollHeight - sidebar.clientHeight, 0);
  const targetTop = Math.max(targetTitle.offsetTop - 16, 0);

  sidebar.scrollTo({
    top: Math.min(targetTop, maxScroll),
    behavior: 'smooth'
  });
}
// STABLE SIDEBAR SECTION JUMP
function forceIconColor(icon, isHighlighted) {
  if (!React.isValidElement(icon)) return icon;

  const color = isHighlighted ? GOLD : MUTED_ICON;

  return React.cloneElement(icon, {
    className: `${icon.props.className || ''} ceos-nav-svg`.trim(),
    color,
    stroke: color,
    style: {
      ...(icon.props.style || {}),
      color,
      stroke: color
    }
  });
}

function buildGroupItems(groupKey, items = []) {
  return items;
}

function SidebarNavItem({ item }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <NavLink
      to={item.to}
      className="ceos-nav-link"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={({ isActive }) => {
        const isHighlighted = isActive || isHovered;

        return {
          color: isHighlighted ? '#ffffff' : 'rgba(226,232,240,0.64)',
          border: isActive
            ? '1px solid rgba(212,175,55,0.24)'
            : isHovered
              ? '1px solid rgba(212,175,55,0.16)'
              : '1px solid transparent',
          background: isActive
            ? 'linear-gradient(135deg, rgba(255,255,255,0.034), rgba(255,255,255,0.008)), rgba(0,0,0,0.988)'
            : isHovered
              ? 'linear-gradient(135deg, rgba(212,175,55,0.032), rgba(255,255,255,0.008)), rgba(0,0,0,0.978)'
              : 'rgba(0,0,0,0.80)',
          boxShadow: isActive
            ? '0 18px 50px rgba(0,0,0,0.86), 0 0 30px rgba(212,175,55,0.18), inset 0 1px 0 rgba(255,255,255,0.052), inset 0 -1px 0 rgba(255,255,255,0.014)'
            : isHovered
              ? '0 16px 38px rgba(0,0,0,0.78), 0 0 24px rgba(212,175,55,0.14), inset 0 1px 0 rgba(255,255,255,0.042), inset 0 -1px 0 rgba(255,255,255,0.012)'
              : 'none',
          filter: isHovered ? 'brightness(1.05)' : 'none'
        };
      }}
    >
      {({ isActive }) => {
        const isHighlighted = isActive || isHovered;
        const iconColor = isHighlighted ? GOLD : MUTED_ICON;

        return (
          <>
            {isHighlighted ? <span className="ceos-active-rail" /> : null}

            <span className="ceos-nav-link-shine" />

            <span
              className="ceos-nav-icon"
              style={{
                color: iconColor,
                transform: isHighlighted ? 'scale(1.10)' : 'scale(1)',
                filter: isHighlighted
                  ? 'drop-shadow(0 0 13px rgba(212,175,55,0.42))'
                  : 'none'
              }}
            >
              {forceIconColor(item.icon, isHighlighted)}
            </span>

            <span
              className="ceos-nav-label"
              style={{
                textShadow: isHighlighted
                  ? '0 0 16px rgba(255,255,255,0.08), 0 0 12px rgba(212,175,55,0.14)'
                  : 'none'
              }}
            >
              {item.label}
            </span>
          </>
        );
      }}
    </NavLink>
  );
}

export function Sidebar() {
  const { pathname } = useLocation();

  const activeWorkspace = getActiveWorkspace(pathname);
  const activeMeta = workspaceMeta[activeWorkspace];

  return (
    <aside className="sidebar ceos-sidebar">
      <style>{sidebarCss}</style>

      <div className="ceos-glass-layer" />
      <div className="ceos-glass-shine" />
      <div className="ceos-sidebar-edge-glow" />

      <div className="ceos-sidebar-brand">
        <div className="ceos-brand-row">
          <div className="ceos-brand-mark">
            <BrandLogo variant="emblem" loading="eager" alt="" />
          </div>

          <div>
            <div className="ceos-brand-title">CEO's OS</div>

            <div className="ceos-brand-subtitle">
              Executive Command Center
            </div>
          </div>
        </div>

        <div className="ceos-workspace-card">
          <div className="ceos-workspace-title">
            {activeMeta.icon}
            {activeMeta.title}
          </div>

          <p className="ceos-workspace-copy">
            {activeMeta.description}
          </p>
        </div>
      </div>

      <nav className="ceos-nav">
        {SIDEBAR_GROUP_ORDER.filter((groupKey) => routeGroups[groupKey]).map((groupKey) => {
          const group = routeGroups[groupKey];
          const isGroupActive = groupKey === activeWorkspace;
          const groupItems = buildGroupItems(groupKey, group.items);

          return (
            <div className="ceos-nav-section" data-workspace-key={groupKey} key={groupKey}>
              <div
                className={`ceos-nav-section-title ${
                  isGroupActive ? 'is-active' : ''
                }`.trim()}
              >
                {group.label}
              </div>

              <div className="ceos-nav-list">
                {groupItems.map((item) => (
                  <SidebarNavItem key={item.to} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="ceos-sidebar-footer">
        <div className="ceos-build-card">
          <div className="ceos-build-title">
            <Sparkles size={14} />
            Executive Workspace
          </div>

          <p className="ceos-build-copy">
            M&A, Compliance, Funding y PMI integrados como sistema ejecutivo privado.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;









