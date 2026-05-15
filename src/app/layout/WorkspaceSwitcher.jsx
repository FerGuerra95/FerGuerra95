import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const workspaceSwitcherCss = `
  .ceos-workspace-switcher {
    --visual-index: 0;
    --workspace-count: 10;
    --workspace-accent: rgba(16, 185, 129, 0.95);
    --workspace-accent-soft: rgba(16, 185, 129, 0.22);
    --workspace-accent-glow: rgba(16, 185, 129, 0.16);
    position: relative;
    display: grid;
    grid-template-columns: repeat(var(--workspace-count), minmax(86px, 1fr));
    align-items: center;
    box-sizing: border-box;
    flex: 1 1 760px;
    width: min(960px, 100%);
    max-width: 960px;
    min-width: 0;
    padding: 6px;
    border-radius: 999px;
    overflow-x: auto;
    overflow-y: visible;
    background:
      radial-gradient(circle at 0% 0%, rgba(255,255,255,0.052), transparent 34%),
      linear-gradient(135deg, rgba(255,255,255,0.046), rgba(255,255,255,0.012)),
      rgba(0,0,0,0.84);
    border: 1px solid rgba(255,255,255,0.078);
    box-shadow:
      0 18px 42px rgba(0,0,0,0.48),
      0 0 22px var(--workspace-accent-glow),
      0 0 46px var(--workspace-accent-glow),
      inset 0 1px 0 rgba(255,255,255,0.055),
      inset 0 -1px 0 rgba(255,255,255,0.014);
    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
    user-select: none;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .ceos-workspace-switcher::-webkit-scrollbar {
    display: none;
  }

  .ceos-workspace-switcher.is-overview {
    --workspace-accent: rgba(212, 175, 55, 0.96);
    --workspace-accent-soft: rgba(212, 175, 55, 0.22);
    --workspace-accent-glow: rgba(212, 175, 55, 0.24);
  }

  .ceos-workspace-switcher.is-ma {
    --workspace-accent: rgba(16, 185, 129, 0.96);
    --workspace-accent-soft: rgba(16, 185, 129, 0.22);
    --workspace-accent-glow: rgba(16, 185, 129, 0.18);
  }

  .ceos-workspace-switcher.is-compliance {
    --workspace-accent: rgba(59, 130, 246, 0.96);
    --workspace-accent-soft: rgba(59, 130, 246, 0.20);
    --workspace-accent-glow: rgba(59, 130, 246, 0.18);
  }

  .ceos-workspace-switcher.is-funding {
    --workspace-accent: rgba(245, 158, 11, 0.96);
    --workspace-accent-soft: rgba(245, 158, 11, 0.22);
    --workspace-accent-glow: rgba(245, 158, 11, 0.23);
  }

  .ceos-workspace-switcher.is-pmi {
    --workspace-accent: rgba(168, 85, 247, 0.96);
    --workspace-accent-soft: rgba(168, 85, 247, 0.26);
    --workspace-accent-glow: rgba(168, 85, 247, 0.34);
  }

  .ceos-workspace-switcher.is-bridge {
    --workspace-accent: rgba(34, 197, 94, 0.96);
    --workspace-accent-soft: rgba(34, 197, 94, 0.22);
    --workspace-accent-glow: rgba(34, 197, 94, 0.30);
  }

  .ceos-workspace-switcher.is-governance {
    --workspace-accent: rgba(14, 165, 233, 0.96);
    --workspace-accent-soft: rgba(14, 165, 233, 0.22);
    --workspace-accent-glow: rgba(14, 165, 233, 0.26);
  }

  .ceos-workspace-switcher.is-risk {
    --workspace-accent: rgba(248, 113, 113, 0.96);
    --workspace-accent-soft: rgba(248, 113, 113, 0.22);
    --workspace-accent-glow: rgba(248, 113, 113, 0.26);
  }

  .ceos-workspace-switcher.is-reporting {
    --workspace-accent: rgba(129, 140, 248, 0.96);
    --workspace-accent-soft: rgba(129, 140, 248, 0.22);
    --workspace-accent-glow: rgba(129, 140, 248, 0.24);
  }

  .ceos-workspace-switcher.is-strategy {
    --workspace-accent: rgba(244, 114, 182, 0.96);
    --workspace-accent-soft: rgba(244, 114, 182, 0.22);
    --workspace-accent-glow: rgba(244, 114, 182, 0.24);
  }

  .ceos-workspace-switcher::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      linear-gradient(
        115deg,
        rgba(255,255,255,0.052) 0%,
        rgba(255,255,255,0.014) 22%,
        transparent 48%,
        transparent 100%
      );
    opacity: 0.58;
    pointer-events: none;
  }

  .ceos-workspace-switcher::after {
    content: "";
    position: absolute;
    top: -45%;
    bottom: -45%;
    left: calc((100% / var(--workspace-count)) * var(--visual-index));
    width: calc(100% / var(--workspace-count));
    background: radial-gradient(circle, var(--workspace-accent-glow), transparent 68%);
    opacity: 0.96;
    filter: blur(14px);
    transition:
      left .32s cubic-bezier(.22,.61,.36,1),
      background .24s ease,
      opacity .24s ease;
    pointer-events: none;
  }

  .ceos-workspace-thumb {
    position: absolute;
    left: 6px;
    top: 6px;
    width: calc((100% - 12px) / var(--workspace-count));
    height: calc(100% - 12px);
    border-radius: 999px;
    transform: translateX(calc(var(--visual-index) * 100%));
    background:
      radial-gradient(circle at 18% 50%, var(--workspace-accent-soft), transparent 42%),
      radial-gradient(circle at 88% 50%, rgba(96,165,250,0.14), transparent 48%),
      linear-gradient(135deg, var(--workspace-accent-soft), rgba(8,14,22,0.98) 70%);
    border: 1px solid rgba(255,255,255,0.095);
    box-shadow:
      0 14px 30px rgba(0,0,0,0.42),
      0 0 42px var(--workspace-accent-glow),
      inset 0 1px 0 rgba(255,255,255,0.105),
      inset 0 -1px 0 rgba(255,255,255,0.018);
    transition:
      transform .32s cubic-bezier(.22,.61,.36,1),
      box-shadow .24s ease,
      background .24s ease,
      border-color .24s ease;
    pointer-events: none;
    z-index: 1;
  }

  .ceos-workspace-option {
    position: relative;
    z-index: 2;
    min-height: 42px;
    padding: 0 9px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: rgba(226,232,240,0.62);
    cursor: pointer;
    font-size: 12px;
    font-weight: 880;
    letter-spacing: -0.025em;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      color .22s ease,
      text-shadow .22s ease,
      transform .18s ease,
      filter .18s ease;
  }

  .ceos-workspace-option:hover {
    color: rgba(255,255,255,0.96);
    transform: translateY(-1px);
    text-shadow:
      0 0 14px rgba(255,255,255,0.10),
      0 0 12px var(--workspace-accent-glow);
  }

  .ceos-workspace-option span {
    position: relative;
    z-index: 2;
    pointer-events: none;
    white-space: nowrap;
    color: inherit;
  }

  .ceos-workspace-option.is-active {
    color: #ffffff;
  }

  .ceos-workspace-option.is-active span {
    color: #ffffff;
    text-shadow:
      0 0 16px rgba(255,255,255,0.18),
      0 0 24px var(--workspace-accent-glow);
  }

  .ceos-workspace-option::before {
    content: "";
    position: absolute;
    left: 22%;
    right: 22%;
    bottom: 7px;
    height: 2px;
    border-radius: 999px;
    background: var(--workspace-accent);
    opacity: 0;
    transform: scaleX(0.35);
    transform-origin: center;
    box-shadow:
      0 0 14px var(--workspace-accent-glow),
      0 0 28px var(--workspace-accent-glow);
    transition:
      opacity .22s ease,
      transform .24s cubic-bezier(.22,.61,.36,1);
    pointer-events: none;
  }

  .ceos-workspace-option.is-active::before {
    opacity: 0.95;
    transform: scaleX(1);
  }

  @media (max-width: 1280px) {
    .ceos-workspace-switcher {
      width: min(100%, 100%);
      max-width: 100%;
    }

    .ceos-workspace-option {
      font-size: 11px;
      padding: 0 7px;
    }
  }

  @media (max-width: 980px) {
    .ceos-workspace-switcher {
      grid-template-columns: repeat(var(--workspace-count), minmax(116px, 1fr));
      border-radius: 26px;
    }

    .ceos-workspace-thumb,
    .ceos-workspace-switcher::after {
      display: none;
    }

    .ceos-workspace-option {
      min-height: 38px;
    }

    .ceos-workspace-option.is-active {
      background: var(--workspace-accent-soft);
    }
  }
`;

const WORKSPACES = [
  {
    key: 'overview',
    label: 'CEO Overview',
    path: '/dashboard',
    sidebarLabel: 'EXECUTIVE OS'
  },
  {
    key: 'ma',
    label: 'M&A',
    path: '/ma/dashboard',
    sidebarLabel: 'M&A'
  },
  {
    key: 'compliance',
    label: 'Compliance',
    path: '/compliance/dashboard',
    sidebarLabel: 'COMPLIANCE'
  },
  {
    key: 'funding',
    label: 'Funding',
    path: '/funding/dashboard',
    sidebarLabel: 'FUNDING'
  },
  {
    key: 'governance',
    label: 'Governance',
    path: '/governance/dashboard',
    sidebarLabel: 'GOVERNANCE & ESG'
  },
  {
    key: 'pmi',
    label: 'PMI & Synergies',
    path: '/pmi/dashboard',
    sidebarLabel: 'PMI'
  },
  {
    key: 'bridge',
    label: 'Bridge',
    path: '/bridge/dashboard',
    sidebarLabel: 'THE BRIDGE'
  },
  {
    key: 'risk',
    label: 'Risk',
    path: '/risk/dashboard',
    sidebarLabel: 'ENTERPRISE RISK'
  },
  {
    key: 'reporting',
    label: 'Reporting',
    path: '/reporting/dashboard',
    sidebarLabel: 'REPORTING'
  },
  {
    key: 'strategy',
    label: 'Strategy',
    path: '/strategy/dashboard',
    sidebarLabel: 'STRATEGY'
  }
];

function getWorkspace(pathname) {
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/overview') ||
    pathname.startsWith('/ceo/overview')
  ) return 'overview';
  if (pathname.startsWith('/compliance')) return 'compliance';
  if (pathname.startsWith('/funding')) return 'funding';
  if (pathname.startsWith('/pmi')) return 'pmi';
  if (pathname.startsWith('/governance')) return 'governance';
  if (pathname.startsWith('/bridge')) return 'bridge';
  if (pathname.startsWith('/risk')) return 'risk';
  if (pathname.startsWith('/reporting')) return 'reporting';
  if (pathname.startsWith('/strategy')) return 'strategy';

  return 'ma';
}

function getWorkspaceIndex(workspace) {
  const index = WORKSPACES.findIndex((item) => item.key === workspace);

  return index >= 0 ? index : 0;
}

function scrollSidebarToWorkspace(workspaceKey) {
  const sidebar = document.querySelector('.ceos-sidebar');

  if (!sidebar) return;

  const workspace = WORKSPACES.find((item) => item.key === workspaceKey);

  if (!workspace) return;

  if (workspace.key === 'overview') {
    sidebar.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    return;
  }

  const titles = Array.from(
    sidebar.querySelectorAll('.ceos-nav-section-title')
  );

  const targetTitle = titles.find((title) => {
    return title.textContent?.trim().toUpperCase() === workspace.sidebarLabel;
  });

  if (!targetTitle) return;

  const maxScroll = Math.max(sidebar.scrollHeight - sidebar.clientHeight, 0);
  const targetTop = Math.max(targetTitle.offsetTop - 16, 0);

  sidebar.scrollTo({
    top: Math.min(targetTop, maxScroll),
    behavior: 'smooth'
  });
}

export function WorkspaceSwitcher() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const workspace = getWorkspace(pathname);
  const activeIndex = getWorkspaceIndex(workspace);
  const activeWorkspace = WORKSPACES[activeIndex] || WORKSPACES[0];

  function handleSelect(item) {
    scrollSidebarToWorkspace(item.key);
    navigate(item.path);
  }

  return (
    <div
      className={`workspace-switcher ceos-workspace-switcher is-${activeWorkspace.key}`.trim()}
      style={{
        '--visual-index': String(activeIndex),
        '--workspace-count': String(WORKSPACES.length)
      }}
      role="tablist"
      aria-label="Workspace selector"
    >
      <style>{workspaceSwitcherCss}</style>

      <div className="ceos-workspace-thumb" />

      {WORKSPACES.map((item, index) => (
        <button
          key={item.key}
          type="button"
          role="tab"
          aria-selected={workspace === item.key}
          className={`ceos-workspace-option ${activeIndex === index ? 'is-active' : ''}`.trim()}
          onClick={() => handleSelect(item)}
        >
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
