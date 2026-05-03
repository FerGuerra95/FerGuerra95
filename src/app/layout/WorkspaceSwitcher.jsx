import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { routeGroups } from '../router/routeConfig.jsx';

const workspaceSwitcherCss = `
  .ceos-workspace-switcher {
    --visual-index: 0;
    --workspace-count: 5;
    --workspace-accent: rgba(212, 175, 55, 0.96);
    --workspace-accent-soft: rgba(212, 175, 55, 0.22);
    --workspace-accent-glow: rgba(212, 175, 55, 0.26);
    position: relative;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    align-items: center;
    width: 690px;
    min-width: 690px;
    max-width: 690px;
    flex: 0 0 690px;
    justify-self: center;
    padding: 6px;
    border-radius: 999px;
    overflow: hidden;
    background:
      radial-gradient(circle at 0% 0%, rgba(255,255,255,0.052), transparent 34%),
      linear-gradient(135deg, rgba(255,255,255,0.046), rgba(255,255,255,0.012)),
      rgba(0,0,0,0.84);
    border: 1px solid rgba(255,255,255,0.078);
    box-shadow:
      0 18px 42px rgba(0,0,0,0.48),
      inset 0 1px 0 rgba(255,255,255,0.055),
      inset 0 -1px 0 rgba(255,255,255,0.014);
    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
    user-select: none;
  }

  .ceos-workspace-switcher.is-overview {
    --workspace-accent: rgba(212, 175, 55, 0.96);
    --workspace-accent-soft: rgba(212, 175, 55, 0.22);
    --workspace-accent-glow: rgba(212, 175, 55, 0.28);
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
    --workspace-accent-glow: rgba(245, 158, 11, 0.26);
  }

  .ceos-workspace-switcher.is-pmi {
    --workspace-accent: rgba(168, 85, 247, 0.96);
    --workspace-accent-soft: rgba(168, 85, 247, 0.27);
    --workspace-accent-glow: rgba(168, 85, 247, 0.38);
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
    filter: blur(12px);
    transition:
      left .34s cubic-bezier(.22,.61,.36,1),
      background .22s ease,
      opacity .22s ease;
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
      transform .34s cubic-bezier(.22,.61,.36,1),
      box-shadow .22s ease,
      background .22s ease,
      border-color .22s ease;
    pointer-events: none;
    z-index: 1;
  }

  .ceos-workspace-thumb::before {
    content: "";
    position: absolute;
    inset: 1px;
    border-radius: inherit;
    background:
      linear-gradient(
        180deg,
        rgba(255,255,255,0.095),
        rgba(255,255,255,0.020) 36%,
        transparent 74%,
        rgba(255,255,255,0.022)
      );
    pointer-events: none;
  }

  .ceos-workspace-option {
    position: relative;
    z-index: 2;
    min-width: 0;
    min-height: 42px;
    padding: 0 10px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: rgba(226,232,240,0.62);
    cursor: pointer;
    font-size: 12.6px;
    font-weight: 850;
    letter-spacing: -0.018em;
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
      0 0 12px rgba(212,175,55,0.08);
  }

  .ceos-workspace-option span {
    position: relative;
    z-index: 2;
    white-space: nowrap;
    color: inherit;
    transition:
      color .22s ease,
      text-shadow .22s ease,
      transform .18s ease;
  }

  .ceos-workspace-option.is-active {
    color: #ffffff;
  }

  .ceos-workspace-option.is-active span {
    color: #ffffff;
    text-shadow:
      0 0 16px rgba(255,255,255,0.18),
      0 0 22px var(--workspace-accent-glow);
  }

  .ceos-workspace-option.is-active[data-workspace="overview"] span {
    text-shadow:
      0 0 16px rgba(255,255,255,0.20),
      0 0 28px rgba(212,175,55,0.50);
  }

  .ceos-workspace-option.is-active[data-workspace="funding"] span {
    text-shadow:
      0 0 16px rgba(255,255,255,0.18),
      0 0 28px rgba(245,158,11,0.58);
  }

  .ceos-workspace-option.is-active[data-workspace="pmi"] span {
    text-shadow:
      0 0 16px rgba(255,255,255,0.20),
      0 0 30px rgba(168,85,247,0.70),
      0 0 46px rgba(168,85,247,0.42);
  }
        /* PREMIUM EFFECTS — Workspace Switcher final polish */

  @keyframes ceosSwitcherOuterGlow {
    0%, 100% {
      box-shadow:
        0 18px 42px rgba(0,0,0,0.52),
        0 0 16px color-mix(in srgb, var(--workspace-accent-glow) 68%, transparent),
        0 0 38px color-mix(in srgb, var(--workspace-accent-glow) 54%, transparent),
        0 0 72px color-mix(in srgb, var(--workspace-accent-glow) 26%, transparent),
        inset 0 1px 0 rgba(255,255,255,0.058),
        inset 0 -1px 0 rgba(255,255,255,0.014);
      filter: brightness(1) saturate(130%);
    }

    50% {
      box-shadow:
        0 22px 56px rgba(0,0,0,0.62),
        0 0 24px color-mix(in srgb, var(--workspace-accent-glow) 82%, transparent),
        0 0 58px color-mix(in srgb, var(--workspace-accent-glow) 66%, transparent),
        0 0 104px color-mix(in srgb, var(--workspace-accent-glow) 34%, transparent),
        inset 0 1px 0 rgba(255,255,255,0.082),
        inset 0 -1px 0 rgba(255,255,255,0.018);
      filter: brightness(1.04) saturate(160%);
    }
  }

  @keyframes ceosSwitcherAmbientHalo {
    0%, 100% {
      opacity: 0.76;
      filter: blur(13px) saturate(140%);
    }

    50% {
      opacity: 1;
      filter: blur(18px) saturate(180%);
    }
  }

  @keyframes ceosThumbPremiumBreath {
    0%, 100% {
      box-shadow:
        0 14px 30px rgba(0,0,0,0.42),
        0 0 40px var(--workspace-accent-glow),
        inset 0 1px 0 rgba(255,255,255,0.105),
        inset 0 -1px 0 rgba(255,255,255,0.018);
      filter: brightness(1) saturate(130%);
    }

    50% {
      box-shadow:
        0 18px 40px rgba(0,0,0,0.55),
        0 0 60px var(--workspace-accent-glow),
        0 0 30px var(--workspace-accent-soft),
        inset 0 1px 0 rgba(255,255,255,0.140),
        inset 0 -1px 0 rgba(255,255,255,0.022);
      filter: brightness(1.12) saturate(165%);
    }
  }

  @keyframes ceosActiveTextGlow {
    0%, 100% {
      filter: brightness(1);
    }

    50% {
      filter: brightness(1.13);
    }
  }

  .ceos-workspace-switcher {
    animation: ceosSwitcherOuterGlow 5.2s ease-in-out infinite;
    overflow: visible;
  }

  .ceos-workspace-switcher::before,
  .ceos-workspace-switcher::after,
  .ceos-workspace-thumb {
    pointer-events: none;
  }

  .ceos-workspace-switcher::after {
    animation: ceosSwitcherAmbientHalo 3.4s ease-in-out infinite;
  }

  .ceos-workspace-thumb {
    animation: ceosThumbPremiumBreath 3.3s ease-in-out infinite;
  }

  .ceos-workspace-option {
    overflow: hidden;
  }

  .ceos-workspace-option::before {
    content: "";
    position: absolute;
    left: 21%;
    right: 21%;
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

  .ceos-workspace-option:hover::before {
    opacity: 0.46;
    transform: scaleX(0.72);
  }

  .ceos-workspace-option.is-active::before {
    opacity: 0.95;
    transform: scaleX(1);
  }

  .ceos-workspace-option.is-active span {
    animation: ceosActiveTextGlow 2.8s ease-in-out infinite;
  }

  .ceos-workspace-switcher:hover {
    border-color: rgba(255,255,255,0.14);
    filter: brightness(1.045);
  }

  @media (prefers-reduced-motion: reduce) {
    .ceos-workspace-switcher,
    .ceos-workspace-switcher::after,
    .ceos-workspace-thumb,
    .ceos-workspace-option.is-active span {
      animation: none !important;
    }
  }



  @media (max-width: 1180px) {
    .ceos-workspace-option {
      padding: 0 8px;
      font-size: 11.8px;
    }
  }

  @media (max-width: 860px) {
    .ceos-workspace-switcher {
      width: min(690px, calc(100vw - 28px));
      min-width: 0;
      max-width: 690px;
      flex: 0 1 auto;
    }

    .ceos-workspace-option {
      min-height: 40px;
      padding: 0 6px;
      font-size: 11px;
      letter-spacing: -0.035em;
    }
  }
`;

const WORKSPACE_ORDER = ['overview', 'ma', 'compliance', 'funding', 'pmi'];

const WORKSPACE_FALLBACKS = {
  overview: {
    label: 'Executive',
    path: '/overview/dashboard',
    sidebarLabels: ['OVERVIEW', 'EXECUTIVE']
  },
  ma: {
    label: 'M&A',
    path: '/ma/dashboard',
    sidebarLabels: ['M&A']
  },
  compliance: {
    label: 'Compliance',
    path: '/compliance/dashboard',
    sidebarLabels: ['COMPLIANCE']
  },
  funding: {
    label: 'Funding',
    path: '/funding/dashboard',
    sidebarLabels: ['FUNDING']
  },
  pmi: {
    label: 'PMI',
    path: '/pmi/dashboard',
    sidebarLabels: ['PMI']
  }
};

let sidebarAnimationFrame = null;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getWorkspace(pathname) {
  if (
    pathname.startsWith('/overview') ||
    pathname.startsWith('/ceo/overview') ||
    pathname.startsWith('/executive')
  ) {
    return 'overview';
  }

  if (pathname.startsWith('/compliance')) return 'compliance';
  if (pathname.startsWith('/funding')) return 'funding';
  if (pathname.startsWith('/pmi')) return 'pmi';

  return 'ma';
}

function buildWorkspaces() {
  return WORKSPACE_ORDER.map((key) => {
    const fallback = WORKSPACE_FALLBACKS[key];
    const group = routeGroups?.[key];
    const firstItem = Array.isArray(group?.items) ? group.items[0] : null;

    const labels = [
      ...(fallback.sidebarLabels || []),
      String(group?.label || '').toUpperCase()
    ].filter(Boolean);

    return {
      key,
      label: fallback.label,
      path: firstItem?.to || fallback.path,
      sidebarLabels: Array.from(new Set(labels))
    };
  });
}

function getWorkspaceIndex(workspaces, workspace) {
  const index = workspaces.findIndex((item) => item.key === workspace);

  return index >= 0 ? index : 0;
}

function stopSidebarAnimation() {
  if (sidebarAnimationFrame) {
    window.cancelAnimationFrame(sidebarAnimationFrame);
    sidebarAnimationFrame = null;
  }
}

function getSidebar() {
  return document.querySelector('.ceos-sidebar');
}

function ensureSidebarCanScroll() {
  const sidebar = getSidebar();

  if (!sidebar) return null;

  sidebar.style.height = '100vh';
  sidebar.style.maxHeight = '100vh';
  sidebar.style.overflowY = 'auto';

  const nav = sidebar.querySelector('.ceos-nav');

  if (nav) {
    nav.style.paddingBottom = '90vh';
  }

  return sidebar;
}

function getSidebarTitle(workspace) {
  const sidebar = ensureSidebarCanScroll();

  if (!sidebar || !workspace) return null;

  const byKey = sidebar.querySelector(
    `.ceos-nav-section[data-workspace-key="${workspace.key}"] .ceos-nav-section-title`
  );

  if (byKey) return byKey;

  const titles = Array.from(
    sidebar.querySelectorAll('.ceos-nav-section-title')
  );

  return titles.find((item) => {
    const text = item.textContent?.trim().toUpperCase();

    return workspace.sidebarLabels.some((label) => label === text);
  }) || null;
}

function animateSidebarToWorkspace(workspace) {
  const sidebar = ensureSidebarCanScroll();

  if (!sidebar || !workspace) return;

  stopSidebarAnimation();

  const title = getSidebarTitle(workspace);

  if (!title) return;

  const targetTop = Math.max(title.offsetTop - 18, 0);
  const maxScroll = Math.max(sidebar.scrollHeight - sidebar.clientHeight, 0);
  const safeTarget = clamp(targetTop, 0, maxScroll);

  function step() {
    const currentSidebar = ensureSidebarCanScroll();

    if (!currentSidebar) {
      sidebarAnimationFrame = null;
      return;
    }

    const distance = safeTarget - currentSidebar.scrollTop;

    if (Math.abs(distance) < 0.5) {
      currentSidebar.scrollTop = safeTarget;
      sidebarAnimationFrame = null;
      return;
    }

    currentSidebar.scrollTop += distance * 0.26;
    sidebarAnimationFrame = window.requestAnimationFrame(step);
  }

  sidebarAnimationFrame = window.requestAnimationFrame(step);
}


function resetMainContentScroll() {
  const reset = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });

    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
      document.documentElement.scrollLeft = 0;
    }

    if (document.body) {
      document.body.scrollTop = 0;
      document.body.scrollLeft = 0;
    }

    const selectors = [
      '.main-area',
      '.page',
      '.page-grid'
    ];

    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        if (element && !element.classList.contains('ceos-sidebar')) {
          element.scrollTop = 0;
          element.scrollLeft = 0;
        }
      });
    });
  };

  reset();

  window.requestAnimationFrame(() => {
    reset();

    window.requestAnimationFrame(() => {
      reset();
    });
  });

  window.setTimeout(reset, 80);
  window.setTimeout(reset, 180);
  window.setTimeout(reset, 360);
}
export function WorkspaceSwitcher() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const workspaces = useMemo(() => buildWorkspaces(), []);
  const workspace = getWorkspace(pathname);
  const activeIndex = getWorkspaceIndex(workspaces, workspace);

  const [visualIndex, setVisualIndex] = useState(activeIndex);

  const highlightedWorkspace = workspaces[visualIndex] || workspaces[0];

  useEffect(() => {
    setVisualIndex(activeIndex);

    window.setTimeout(() => {
      animateSidebarToWorkspace(workspaces[activeIndex]);
    }, 120);
  }, [activeIndex, workspaces]);

  function handleWorkspaceClick(item) {
    const nextIndex = getWorkspaceIndex(workspaces, item.key);

    setVisualIndex(nextIndex);
    animateSidebarToWorkspace(item);
    resetMainContentScroll();

    window.setTimeout(() => {
      animateSidebarToWorkspace(item);
      resetMainContentScroll();
    }, 120);

    window.setTimeout(() => {
      animateSidebarToWorkspace(item);
      resetMainContentScroll();
    }, 260);

    if (item.key !== workspace) {
      navigate(item.path);
    }
  }

  function handleKeyboardNavigation(event, item) {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    handleWorkspaceClick(item);
  }

  return (
    <div
      className={`workspace-switcher ceos-workspace-switcher is-${highlightedWorkspace.key}`.trim()}
      style={{
        '--visual-index': String(visualIndex),
        '--workspace-count': String(workspaces.length)
      }}
      role="tablist"
      aria-label="Workspace selector"
    >
      <style>{workspaceSwitcherCss}</style>

      <div className="ceos-workspace-thumb" />

      {workspaces.map((item, index) => (
        <button
          key={item.key}
          type="button"
          role="tab"
          aria-selected={workspace === item.key}
          data-workspace={item.key}
          className={`ceos-workspace-option ${visualIndex === index ? 'is-active' : ''}`.trim()}
          onClick={() => handleWorkspaceClick(item)}
          onKeyDown={(event) => handleKeyboardNavigation(event, item)}
        >
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}





