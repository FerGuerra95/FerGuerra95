import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { routeGroups } from '../router/routeConfig.jsx';
import {
  WORKSPACES,
  getWorkspaceByKey,
  getWorkspaceByPathname
} from '../router/workspaceConfig.jsx';

const RAIL_SCROLL_STEP = 240;

const workspaceRailCss = `
  .ceos-workspace-rail-shell {
    --workspace-accent: rgba(16, 185, 129, 0.95);
    --workspace-accent-soft: rgba(16, 185, 129, 0.18);
    --workspace-accent-glow: rgba(16, 185, 129, 0.16);
    position: relative;
    z-index: 8;
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1 1 520px;
    min-width: 0;
    max-width: min(960px, 100%);
    padding: 5px;
    border-radius: 999px;
    background:
      radial-gradient(circle at 0% 0%, rgba(255,255,255,0.05), transparent 38%),
      linear-gradient(135deg, rgba(255,255,255,0.046), rgba(255,255,255,0.012)),
      rgba(0,0,0,0.88);
    border: 1px solid rgba(255,255,255,0.078);
    box-shadow:
      0 16px 38px rgba(0,0,0,0.44),
      0 0 24px var(--workspace-accent-glow),
      inset 0 1px 0 rgba(255,255,255,0.055);
    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
  }

  .ceos-workspace-rail-shell.is-overview {
    --workspace-accent: rgba(212, 175, 55, 0.96);
    --workspace-accent-soft: rgba(212, 175, 55, 0.18);
    --workspace-accent-glow: rgba(212, 175, 55, 0.20);
  }

  .ceos-workspace-rail-shell.is-ma {
    --workspace-accent: rgba(16, 185, 129, 0.96);
    --workspace-accent-soft: rgba(16, 185, 129, 0.18);
    --workspace-accent-glow: rgba(16, 185, 129, 0.16);
  }

  .ceos-workspace-rail-shell.is-compliance {
    --workspace-accent: rgba(59, 130, 246, 0.96);
    --workspace-accent-soft: rgba(59, 130, 246, 0.17);
    --workspace-accent-glow: rgba(59, 130, 246, 0.16);
  }

  .ceos-workspace-rail-shell.is-funding {
    --workspace-accent: rgba(245, 158, 11, 0.96);
    --workspace-accent-soft: rgba(245, 158, 11, 0.18);
    --workspace-accent-glow: rgba(245, 158, 11, 0.18);
  }

  .ceos-workspace-rail-shell.is-governance {
    --workspace-accent: rgba(14, 165, 233, 0.96);
    --workspace-accent-soft: rgba(14, 165, 233, 0.17);
    --workspace-accent-glow: rgba(14, 165, 233, 0.18);
  }

  .ceos-workspace-rail-shell.is-pmi {
    --workspace-accent: rgba(168, 85, 247, 0.96);
    --workspace-accent-soft: rgba(168, 85, 247, 0.18);
    --workspace-accent-glow: rgba(168, 85, 247, 0.22);
  }

  .ceos-workspace-rail-shell.is-bridge {
    --workspace-accent: rgba(34, 197, 94, 0.96);
    --workspace-accent-soft: rgba(34, 197, 94, 0.17);
    --workspace-accent-glow: rgba(34, 197, 94, 0.20);
  }

  .ceos-workspace-rail-shell.is-risk {
    --workspace-accent: rgba(248, 113, 113, 0.96);
    --workspace-accent-soft: rgba(248, 113, 113, 0.17);
    --workspace-accent-glow: rgba(248, 113, 113, 0.18);
  }

  .ceos-workspace-rail-shell.is-reporting {
    --workspace-accent: rgba(129, 140, 248, 0.96);
    --workspace-accent-soft: rgba(129, 140, 248, 0.18);
    --workspace-accent-glow: rgba(129, 140, 248, 0.18);
  }

  .ceos-workspace-rail-shell.is-strategy {
    --workspace-accent: rgba(244, 114, 182, 0.96);
    --workspace-accent-soft: rgba(244, 114, 182, 0.17);
    --workspace-accent-glow: rgba(244, 114, 182, 0.18);
  }

  .ceos-workspace-rail-scroll-btn {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.08);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.012)),
      rgba(0,0,0,0.72);
    color: rgba(226,232,240,0.78);
    cursor: pointer;
    transition:
      transform .18s ease,
      border-color .18s ease,
      color .18s ease,
      box-shadow .18s ease;
  }

  .ceos-workspace-rail-scroll-btn:hover:not(:disabled) {
    color: #ffffff;
    border-color: rgba(255,255,255,0.14);
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.32);
  }

  .ceos-workspace-rail-scroll-btn:disabled {
    opacity: 0.28;
    cursor: not-allowed;
  }

  .ceos-workspace-rail-scroll-btn:focus-visible {
    outline: 2px solid var(--workspace-accent);
    outline-offset: 2px;
  }

  .ceos-workspace-rail-scroll-btn svg {
    color: var(--workspace-accent);
  }

  .ceos-workspace-rail {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 2px 4px;
  }

  .ceos-workspace-rail::-webkit-scrollbar {
    display: none;
  }

  .ceos-workspace-rail-item {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-height: 34px;
    padding: 6px 12px;
    border-radius: 999px;
    border: 1px solid transparent;
    background: transparent;
    color: rgba(226,232,240,0.62);
    font-size: 12px;
    font-weight: 860;
    letter-spacing: -0.01em;
    white-space: nowrap;
    cursor: pointer;
    transition:
      transform .18s ease,
      color .18s ease,
      background .18s ease,
      border-color .18s ease,
      box-shadow .18s ease;
  }

  .ceos-workspace-rail-item:hover {
    color: #f8fafc;
    border-color: rgba(255,255,255,0.09);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.012));
    transform: translateY(-1px);
  }

  .ceos-workspace-rail-item.is-active {
    color: #ffffff;
    border-color: rgba(255,255,255,0.12);
    background:
      radial-gradient(circle at 18% 0%, rgba(255,255,255,0.1), transparent 40%),
      linear-gradient(135deg, var(--workspace-accent-soft), rgba(255,255,255,0.02));
    box-shadow:
      0 10px 26px rgba(0,0,0,0.34),
      0 0 20px var(--workspace-accent-glow),
      inset 0 1px 0 rgba(255,255,255,0.07);
  }

  .ceos-workspace-rail-item:focus-visible {
    outline: 2px solid var(--workspace-accent);
    outline-offset: 2px;
  }

  .ceos-workspace-rail-item-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--workspace-accent);
    opacity: 0.92;
  }

  .ceos-workspace-rail-item.is-active .ceos-workspace-rail-item-icon {
    filter: drop-shadow(0 0 8px var(--workspace-accent-glow));
  }

  @media (max-width: 920px) {
    .ceos-workspace-rail-shell {
      flex-basis: 100%;
      max-width: 100%;
    }

    .ceos-workspace-rail-item {
      font-size: 11px;
      padding: 6px 10px;
    }
  }
`;

function scrollSidebarToWorkspace(workspaceKey) {
  const sidebar = document.querySelector('.ceos-sidebar');

  if (!sidebar) return;

  const workspace = getWorkspaceByKey(workspaceKey);

  if (workspace.key === 'overview') {
    sidebar.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    return;
  }

  const sectionLabel =
    routeGroups[workspaceKey]?.label?.trim().toUpperCase() ||
    workspace.sidebarLabel;

  const targetTitle = Array.from(
    sidebar.querySelectorAll('.ceos-nav-section-title')
  ).find((title) => title.textContent?.trim().toUpperCase() === sectionLabel);

  if (!targetTitle) return;

  const maxScroll = Math.max(sidebar.scrollHeight - sidebar.clientHeight, 0);
  const targetTop = Math.max(targetTitle.offsetTop - 16, 0);

  sidebar.scrollTo({
    top: Math.min(targetTop, maxScroll),
    behavior: 'smooth'
  });
}

function readRailScrollState(railEl) {
  if (!railEl) {
    return { canScrollLeft: false, canScrollRight: false };
  }

  const maxScrollLeft = Math.max(railEl.scrollWidth - railEl.clientWidth, 0);
  const scrollLeft = railEl.scrollLeft;

  return {
    canScrollLeft: scrollLeft > 4,
    canScrollRight: scrollLeft < maxScrollLeft - 4
  };
}

export function WorkspaceSwitcher() {
  const railRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [scrollState, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: false
  });

  const workspaceKey = getWorkspaceByPathname(pathname);
  const activeWorkspace = getWorkspaceByKey(workspaceKey);

  const syncScrollButtons = useCallback(() => {
    setScrollState(readRailScrollState(railRef.current));
  }, []);

  useEffect(() => {
    const railEl = railRef.current;

    if (!railEl) return undefined;

    syncScrollButtons();

    railEl.addEventListener('scroll', syncScrollButtons, { passive: true });
    window.addEventListener('resize', syncScrollButtons);

    return () => {
      railEl.removeEventListener('scroll', syncScrollButtons);
      window.removeEventListener('resize', syncScrollButtons);
    };
  }, [syncScrollButtons]);

  useEffect(() => {
    const railEl = railRef.current;
    const activeEl = railEl?.querySelector(
      `[data-workspace-key="${workspaceKey}"]`
    );

    if (!activeEl) return;

    activeEl.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });

    const timer = window.setTimeout(syncScrollButtons, 280);

    return () => window.clearTimeout(timer);
  }, [workspaceKey, syncScrollButtons]);

  function scrollRail(direction) {
    const railEl = railRef.current;

    if (!railEl) return;

    railEl.scrollBy({
      left: direction === 'left' ? -RAIL_SCROLL_STEP : RAIL_SCROLL_STEP,
      behavior: 'smooth'
    });
  }

  function handleSelect(item) {
    scrollSidebarToWorkspace(item.key);
    navigate(item.path);
  }

  return (
    <nav
      className={`workspace-switcher ceos-workspace-rail-shell is-${activeWorkspace.key}`.trim()}
      aria-label="Workspace navigation"
      data-testid="workspace-rail"
    >
      <style>{workspaceRailCss}</style>

      <button
        type="button"
        className="ceos-workspace-rail-scroll-btn"
        aria-label="Previous workspaces"
        data-testid="workspace-rail-scroll-prev"
        disabled={!scrollState.canScrollLeft}
        onClick={() => scrollRail('left')}
      >
        <ChevronLeft size={16} aria-hidden />
      </button>

      <div
        ref={railRef}
        className="ceos-workspace-rail"
        data-testid="workspace-rail-track"
        role="list"
      >
        {WORKSPACES.map((item) => {
          const isActive = item.key === activeWorkspace.key;

          return (
            <button
              key={item.key}
              type="button"
              role="listitem"
              data-workspace-key={item.key}
              data-testid={`workspace-rail-item-${item.key}`}
              title={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={`ceos-workspace-rail-item ${isActive ? 'is-active' : ''}`.trim()}
              onClick={() => handleSelect(item)}
            >
              <span className="ceos-workspace-rail-item-icon" aria-hidden>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="ceos-workspace-rail-scroll-btn"
        aria-label="Next workspaces"
        data-testid="workspace-rail-scroll-next"
        disabled={!scrollState.canScrollRight}
        onClick={() => scrollRail('right')}
      >
        <ChevronRight size={16} aria-hidden />
      </button>
    </nav>
  );
}
