import React, { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { routeGroups } from '../router/routeConfig.jsx';
import {
  WORKSPACES,
  getWorkspaceByKey,
  getWorkspaceByPathname
} from '../router/workspaceConfig.jsx';

const workspaceSwitcherCss = `
  .ceos-workspace-switcher {
    --workspace-accent: rgba(16, 185, 129, 0.95);
    --workspace-accent-soft: rgba(16, 185, 129, 0.18);
    --workspace-accent-glow: rgba(16, 185, 129, 0.16);
    position: relative;
    z-index: 8;
    flex: 0 1 320px;
    width: min(320px, 100%);
    min-width: 220px;
  }

  .ceos-workspace-switcher.is-overview {
    --workspace-accent: rgba(212, 175, 55, 0.96);
    --workspace-accent-soft: rgba(212, 175, 55, 0.18);
    --workspace-accent-glow: rgba(212, 175, 55, 0.20);
  }

  .ceos-workspace-switcher.is-ma {
    --workspace-accent: rgba(16, 185, 129, 0.96);
    --workspace-accent-soft: rgba(16, 185, 129, 0.18);
    --workspace-accent-glow: rgba(16, 185, 129, 0.16);
  }

  .ceos-workspace-switcher.is-compliance {
    --workspace-accent: rgba(59, 130, 246, 0.96);
    --workspace-accent-soft: rgba(59, 130, 246, 0.17);
    --workspace-accent-glow: rgba(59, 130, 246, 0.16);
  }

  .ceos-workspace-switcher.is-funding {
    --workspace-accent: rgba(245, 158, 11, 0.96);
    --workspace-accent-soft: rgba(245, 158, 11, 0.18);
    --workspace-accent-glow: rgba(245, 158, 11, 0.18);
  }

  .ceos-workspace-switcher.is-governance {
    --workspace-accent: rgba(14, 165, 233, 0.96);
    --workspace-accent-soft: rgba(14, 165, 233, 0.17);
    --workspace-accent-glow: rgba(14, 165, 233, 0.18);
  }

  .ceos-workspace-switcher.is-pmi {
    --workspace-accent: rgba(168, 85, 247, 0.96);
    --workspace-accent-soft: rgba(168, 85, 247, 0.18);
    --workspace-accent-glow: rgba(168, 85, 247, 0.22);
  }

  .ceos-workspace-switcher.is-bridge {
    --workspace-accent: rgba(34, 197, 94, 0.96);
    --workspace-accent-soft: rgba(34, 197, 94, 0.17);
    --workspace-accent-glow: rgba(34, 197, 94, 0.20);
  }

  .ceos-workspace-switcher.is-risk {
    --workspace-accent: rgba(248, 113, 113, 0.96);
    --workspace-accent-soft: rgba(248, 113, 113, 0.17);
    --workspace-accent-glow: rgba(248, 113, 113, 0.18);
  }

  .ceos-workspace-switcher.is-reporting {
    --workspace-accent: rgba(129, 140, 248, 0.96);
    --workspace-accent-soft: rgba(129, 140, 248, 0.18);
    --workspace-accent-glow: rgba(129, 140, 248, 0.18);
  }

  .ceos-workspace-switcher.is-strategy {
    --workspace-accent: rgba(244, 114, 182, 0.96);
    --workspace-accent-soft: rgba(244, 114, 182, 0.17);
    --workspace-accent-glow: rgba(244, 114, 182, 0.18);
  }

  .ceos-workspace-trigger {
    position: relative;
    overflow: hidden;
    width: 100%;
    min-height: 42px;
    padding: 7px 12px;
    border: 1px solid rgba(255,255,255,0.082);
    border-radius: 999px;
    background:
      radial-gradient(circle at 12% 0%, var(--workspace-accent-soft), transparent 42%),
      linear-gradient(135deg, rgba(255,255,255,0.052), rgba(255,255,255,0.014)),
      rgba(0,0,0,0.86);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    cursor: pointer;
    box-shadow:
      0 18px 42px rgba(0,0,0,0.46),
      0 0 28px var(--workspace-accent-glow),
      inset 0 1px 0 rgba(255,255,255,0.064);
  }

  .ceos-workspace-trigger:hover {
    border-color: rgba(255,255,255,0.13);
    filter: brightness(1.05);
  }

  .ceos-workspace-trigger-label {
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    line-height: 1.1;
  }

  .ceos-workspace-trigger-kicker {
    color: rgba(226,232,240,0.46);
    font-size: 9.5px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .ceos-workspace-trigger-title {
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #ffffff;
    font-size: 13px;
    font-weight: 920;
    letter-spacing: -0.015em;
  }

  .ceos-workspace-trigger svg {
    flex-shrink: 0;
    color: var(--workspace-accent);
    transition: transform .18s ease;
  }

  .ceos-workspace-trigger[aria-expanded="true"] svg {
    transform: rotate(180deg);
  }

  .ceos-workspace-menu {
    position: absolute;
    right: 0;
    top: calc(100% + 10px);
    z-index: 40;
    width: min(360px, calc(100vw - 32px));
    max-height: min(68vh, 520px);
    overflow-y: auto;
    padding: 8px;
    border-radius: 22px;
    background:
      radial-gradient(circle at 0% 0%, var(--workspace-accent-soft), transparent 36%),
      linear-gradient(135deg, rgba(255,255,255,0.054), rgba(255,255,255,0.012)),
      rgba(0,0,0,0.96);
    border: 1px solid rgba(255,255,255,0.088);
    box-shadow:
      0 26px 70px rgba(0,0,0,0.78),
      0 0 36px var(--workspace-accent-glow),
      inset 0 1px 0 rgba(255,255,255,0.058);
    backdrop-filter: blur(20px) saturate(140%);
    -webkit-backdrop-filter: blur(20px) saturate(140%);
  }

  .ceos-workspace-menu-option {
    width: 100%;
    min-height: 44px;
    padding: 10px 11px;
    border: 1px solid transparent;
    border-radius: 15px;
    background: transparent;
    color: rgba(226,232,240,0.70);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    cursor: pointer;
    text-align: left;
  }

  .ceos-workspace-menu-option:hover,
  .ceos-workspace-menu-option.is-active {
    color: #ffffff;
    border-color: rgba(255,255,255,0.088);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.052), rgba(255,255,255,0.014)),
      var(--workspace-accent-soft);
  }

  .ceos-workspace-menu-option-label {
    font-size: 13px;
    font-weight: 880;
  }

  .ceos-workspace-menu-option-path {
    color: rgba(226,232,240,0.40);
    font-size: 10.5px;
    font-weight: 800;
  }

  .ceos-workspace-active-dot {
    width: 8px;
    height: 8px;
    flex-shrink: 0;
    border-radius: 999px;
    background: var(--workspace-accent);
    box-shadow: 0 0 18px var(--workspace-accent-glow);
  }

  @media (max-width: 920px) {
    .ceos-workspace-switcher {
      flex-basis: 100%;
      width: 100%;
      min-width: 0;
    }

    .ceos-workspace-menu {
      left: 0;
      right: auto;
      width: min(100%, calc(100vw - 32px));
    }

    .ceos-workspace-trigger-title {
      max-width: calc(100vw - 120px);
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

export function WorkspaceSwitcher() {
  const menuId = useId();
  const rootRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const workspaceKey = getWorkspaceByPathname(pathname);
  const activeWorkspace = getWorkspaceByKey(workspaceKey);

  useEffect(() => {
    function handleDocumentPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', handleDocumentPointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handleDocumentPointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  function handleSelect(item) {
    scrollSidebarToWorkspace(item.key);
    setIsOpen(false);
    navigate(item.path);
  }

  return (
    <div
      ref={rootRef}
      className={`workspace-switcher ceos-workspace-switcher is-${activeWorkspace.key}`.trim()}
      aria-label="Workspace selector"
    >
      <style>{workspaceSwitcherCss}</style>

      <button
        type="button"
        className="ceos-workspace-trigger"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="ceos-workspace-trigger-label">
          <span className="ceos-workspace-trigger-kicker">Workspace</span>
          <span className="ceos-workspace-trigger-title">{activeWorkspace.label}</span>
        </span>
        <ChevronDown size={18} />
      </button>

      {isOpen ? (
        <div id={menuId} className="ceos-workspace-menu" role="menu">
          {WORKSPACES.map((item) => {
            const isActive = item.key === activeWorkspace.key;

            return (
              <button
                key={item.key}
                type="button"
                role="menuitem"
                className={`ceos-workspace-menu-option ${isActive ? 'is-active' : ''}`.trim()}
                onClick={() => handleSelect(item)}
              >
                <span>
                  <span className="ceos-workspace-menu-option-label">{item.label}</span>
                  <span className="ceos-workspace-menu-option-path">{item.path}</span>
                </span>
                {isActive ? <span className="ceos-workspace-active-dot" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
