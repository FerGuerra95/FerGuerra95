import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  WORKSPACES,
  getWorkspaceByKey,
  getWorkspaceByPathname
} from '../router/workspaceConfig.jsx';
import { getWorkspaceThemeCssVars } from '../../shared/config/workspaceTheme.js';
import { useWorkspaceTheme } from '../../shared/hooks/useWorkspaceTheme.js';

const switcherCss = `
  .ceos-workspace-switcher {
    position: relative;
    z-index: 12;
  }

  .ceos-workspace-switcher-trigger {
    width: 100%;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 11px 10px 11px 12px;
    border-radius: 15px;
    border: 1px solid rgba(255,255,255,0.065);
    background:
      linear-gradient(180deg, rgba(255,255,255,0.022), rgba(255,255,255,0.004)),
      rgba(0,0,0,0.90);
    color: #f8fafc;
    cursor: pointer;
    text-align: left;
    transition:
      border-color .16s ease,
      background .16s ease,
      box-shadow .16s ease;
  }

  .ceos-workspace-switcher-trigger:hover,
  .ceos-workspace-switcher-trigger[aria-expanded='true'] {
    border-color: rgba(255,255,255,0.10);
    background:
      linear-gradient(180deg, rgba(255,255,255,0.028), rgba(255,255,255,0.006)),
      rgba(0,0,0,0.94);
    box-shadow: 0 8px 22px rgba(0,0,0,0.34);
  }

  .ceos-workspace-switcher-trigger:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ws-accent, rgba(212,175,55,0.72)) 62%, transparent);
    outline-offset: 2px;
  }

  .ceos-workspace-switcher-icon {
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    margin-top: 1px;
    border-radius: 9px;
    background: rgba(255,255,255,0.025);
    color: var(--ws-accent, #d4af37);
    flex-shrink: 0;
  }

  .ceos-workspace-switcher-copy {
    flex: 1 1 auto;
    min-width: 0;
  }

  .ceos-workspace-switcher-label {
    display: block;
    font-size: 13px;
    font-weight: 850;
    line-height: 1.2;
    letter-spacing: -0.01em;
    color: #ffffff;
  }

  .ceos-workspace-switcher-descriptor {
    display: block;
    margin-top: 2px;
    font-size: 10.5px;
    line-height: 1.3;
    font-weight: 500;
    color: rgba(148,163,184,0.58);
  }

  .ceos-workspace-switcher-chevron {
    margin-top: 3px;
    color: rgba(148,163,184,0.62);
    transition: transform .15s ease, color .15s ease;
    flex-shrink: 0;
  }

  .ceos-workspace-switcher-trigger[aria-expanded='true'] .ceos-workspace-switcher-chevron {
    transform: rotate(180deg);
    color: rgba(226,232,240,0.72);
  }

  @keyframes ceos-workspace-panel-in {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .ceos-workspace-switcher-panel {
    position: fixed;
    z-index: var(--shell-z-popover, 2000);
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    padding: 0;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.065);
    background:
      linear-gradient(180deg, rgba(255,255,255,0.018), rgba(255,255,255,0.004)),
      rgba(6, 6, 6, 0.96);
    box-shadow:
      0 14px 36px rgba(0,0,0,0.48),
      0 2px 8px rgba(0,0,0,0.28),
      inset 0 1px 0 rgba(255,255,255,0.03);
    backdrop-filter: blur(16px) saturate(130%);
    -webkit-backdrop-filter: blur(16px) saturate(130%);
    animation: ceos-workspace-panel-in 160ms ease-out;
  }

  .ceos-workspace-switcher-panel-heading {
    flex: 0 0 auto;
    padding: 16px 14px 0;
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(148,163,184,0.46);
  }

  .ceos-workspace-switcher-panel-scroll {
    flex: 1 1 auto;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 10px 8px 10px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    scrollbar-width: thin;
    scrollbar-color: rgba(148,163,184,0.22) transparent;
  }

  .ceos-workspace-switcher-panel-scroll::-webkit-scrollbar {
    width: 5px;
  }

  .ceos-workspace-switcher-panel-scroll::-webkit-scrollbar-track {
    background: transparent;
  }

  .ceos-workspace-switcher-panel-scroll::-webkit-scrollbar-thumb {
    background: rgba(148,163,184,0.18);
    border-radius: 999px;
  }

  .ceos-workspace-switcher-panel-scroll:hover::-webkit-scrollbar-thumb {
    background: rgba(148,163,184,0.28);
  }

  .ceos-workspace-switcher-item {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 58px;
    padding: 8px 10px 8px 12px;
    border: 1px solid transparent;
    border-radius: 10px;
    background: transparent;
    color: rgba(226,232,240,0.88);
    cursor: pointer;
    text-align: left;
    transition:
      background 150ms ease,
      border-color 150ms ease,
      color 150ms ease;
  }

  .ceos-workspace-switcher-item::before {
    content: "";
    position: absolute;
    left: 4px;
    top: 12px;
    bottom: 12px;
    width: 3px;
    border-radius: 999px;
    background: var(--ws-accent);
    opacity: 0;
    transition: opacity 150ms ease, box-shadow 150ms ease;
    pointer-events: none;
  }

  .ceos-workspace-switcher-item:hover:not(.is-active) {
    background: rgba(var(--ws-accent-rgb), 0.05);
    border-color: rgba(var(--ws-accent-rgb), 0.12);
    color: #ffffff;
  }

  .ceos-workspace-switcher-item:hover:not(.is-active)::before {
    opacity: 0.4;
    box-shadow: 0 0 8px var(--ws-accent-glow);
  }

  .ceos-workspace-switcher-item:focus-visible {
    outline: none;
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.06);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ws-accent) 38%, transparent);
    color: #ffffff;
  }

  .ceos-workspace-switcher-item.is-active {
    background:
      linear-gradient(
        135deg,
        rgba(var(--ws-accent-rgb), 0.08),
        rgba(0,0,0,0.94)
      );
    border-color: rgba(var(--ws-accent-rgb), 0.22);
    color: #ffffff;
  }

  .ceos-workspace-switcher-item.is-active::before {
    opacity: 0.88;
    box-shadow: 0 0 10px var(--ws-accent-glow);
  }

  .ceos-workspace-switcher-item.is-active .ceos-workspace-switcher-item-label {
    font-weight: 900;
    color: #ffffff;
  }

  .ceos-workspace-switcher-item-icon {
    display: grid;
    place-items: center;
    width: 20px;
    height: 20px;
    color: color-mix(in srgb, var(--ws-accent) 78%, rgba(148,163,184,0.55));
    flex-shrink: 0;
    opacity: 0.92;
  }

  .ceos-workspace-switcher-item.is-active .ceos-workspace-switcher-item-icon {
    color: var(--ws-accent);
    opacity: 1;
  }

  .ceos-workspace-switcher-item-copy {
    flex: 1 1 auto;
    min-width: 0;
  }

  .ceos-workspace-switcher-item-label {
    display: block;
    font-size: 12.5px;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -0.01em;
    color: rgba(248,250,252,0.94);
  }

  .ceos-workspace-switcher-item-descriptor {
    display: block;
    margin-top: 1px;
    font-size: 10px;
    line-height: 1.28;
    font-weight: 500;
    color: rgba(148,163,184,0.52);
  }

  .ceos-workspace-switcher-item.is-active .ceos-workspace-switcher-item-descriptor {
    color: rgba(148,163,184,0.62);
  }

  .ceos-workspace-switcher-item-check {
    color: var(--ws-accent);
    flex-shrink: 0;
    opacity: 0.92;
  }

  .ceos-workspace-switcher-panel.is-inline {
    position: static;
    width: 100%;
    max-height: min(58dvh, 480px);
    margin-top: 8px;
    animation: ceos-workspace-panel-in 160ms ease-out;
    box-shadow: none;
  }

  .ceos-workspace-switcher.is-inline-open .ceos-nav {
    opacity: 0.42;
    pointer-events: none;
  }

  .ceos-workspace-switcher-panel.is-inline .ceos-workspace-switcher-item {
    min-height: 46px;
  }

  @media (prefers-reduced-motion: reduce) {
    .ceos-workspace-switcher-panel {
      animation: none;
    }

    .ceos-workspace-switcher-trigger,
    .ceos-workspace-switcher-chevron,
    .ceos-workspace-switcher-item {
      transition: none;
    }
  }
`;

function readPanelAnchor(triggerEl) {
  if (!triggerEl) {
    return { top: 0, left: 0, width: 340, maxHeight: 480 };
  }

  const rect = triggerEl.getBoundingClientRect();
  const shell = triggerEl.closest('.sidebar, .ceos-shell-drawer');
  const shellRect = shell?.getBoundingClientRect();
  const gap = 10;
  const viewportPad = 16;
  const width = Math.min(360, Math.max(320, 340));

  let top = Math.round(rect.top);
  let left = Math.round((shellRect?.right ?? rect.right) + gap);

  if (left + width > window.innerWidth - viewportPad) {
    left = Math.max(viewportPad, window.innerWidth - width - viewportPad);
  }

  const maxHeight = Math.min(
    500,
    Math.max(220, window.innerHeight - top - viewportPad)
  );

  return { top, left, width, maxHeight };
}

function WorkspaceSwitcherPanel({
  panelId,
  panelRef,
  panelAnchor,
  layout,
  workspaceKey,
  itemRefs,
  onSelect
}) {
  return (
    <div
      id={panelId}
      ref={panelRef}
      className={`ceos-workspace-switcher-panel ${layout === 'inline' ? 'is-inline' : ''}`.trim()}
      role="listbox"
      aria-label="Workspaces"
      data-testid="workspace-switcher-menu"
      style={
        layout === 'inline'
          ? undefined
          : {
              top: panelAnchor.top,
              left: panelAnchor.left,
              width: panelAnchor.width,
              maxHeight: panelAnchor.maxHeight
            }
      }
    >
      <div className="ceos-workspace-switcher-panel-heading">Workspaces</div>

      <div className="ceos-workspace-switcher-panel-scroll">
        {WORKSPACES.map((item, index) => {
          const isActive = item.key === workspaceKey;
          const itemThemeVars = getWorkspaceThemeCssVars(item.key);

          return (
            <button
              key={item.key}
              type="button"
              role="option"
              aria-selected={isActive}
              data-workspace-key={item.key}
              data-testid={`workspace-switcher-item-${item.key}`}
              className={`ceos-workspace-switcher-item ${isActive ? 'is-active' : ''}`.trim()}
              style={itemThemeVars}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              onClick={() => onSelect(item)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(item);
                }
              }}
            >
              <span className="ceos-workspace-switcher-item-icon" aria-hidden>
                {item.icon}
              </span>

              <span className="ceos-workspace-switcher-item-copy">
                <span className="ceos-workspace-switcher-item-label">{item.label}</span>
                <span className="ceos-workspace-switcher-item-descriptor">{item.title}</span>
              </span>

              {isActive ? (
                <Check size={14} className="ceos-workspace-switcher-item-check" aria-hidden />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function WorkspaceSwitcher({ layout = 'popover' }) {
  const panelId = useId();
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const itemRefs = useRef([]);
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const [panelAnchor, setPanelAnchor] = useState({ top: 0, left: 0, width: 340, maxHeight: 480 });

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { cssVars } = useWorkspaceTheme();

  const workspaceKey = getWorkspaceByPathname(pathname);
  const activeWorkspace = getWorkspaceByKey(workspaceKey);

  const syncPanelAnchor = useCallback(() => {
    if (layout === 'popover') {
      setPanelAnchor(readPanelAnchor(triggerRef.current));
    }
  }, [layout]);

  const closeMenu = useCallback(() => {
    setOpen(false);
    setFocusIndex(-1);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (layout !== 'inline' || !open) return undefined;

    const nav = rootRef.current
      ?.closest('.ceos-shell-drawer-body, .sidebar')
      ?.querySelector('.ceos-nav');

    if (!nav) return undefined;

    if (open) {
      nav.style.pointerEvents = 'none';
      nav.style.opacity = '0.42';
    } else {
      nav.style.pointerEvents = '';
      nav.style.opacity = '';
    }

    return () => {
      nav.style.pointerEvents = '';
      nav.style.opacity = '';
    };
  }, [open, layout]);


  useLayoutEffect(() => {
    if (!open || layout !== 'popover') return;
    syncPanelAnchor();
  }, [open, layout, syncPanelAnchor]);

  useEffect(() => {
    if (!open || layout !== 'popover') return undefined;

    window.addEventListener('resize', syncPanelAnchor);
    window.addEventListener('scroll', syncPanelAnchor, true);

    return () => {
      window.removeEventListener('resize', syncPanelAnchor);
      window.removeEventListener('scroll', syncPanelAnchor, true);
    };
  }, [open, layout, syncPanelAnchor]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1024px)');

    function handleChange() {
      setOpen(false);
      setFocusIndex(-1);
    }

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      const target = event.target;
      if (
        rootRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }

      setOpen(false);
      setFocusIndex(-1);
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setFocusIndex((index) => {
          const next = index < WORKSPACES.length - 1 ? index + 1 : 0;
          itemRefs.current[next]?.focus();
          return next;
        });
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setFocusIndex((index) => {
          const next = index > 0 ? index - 1 : WORKSPACES.length - 1;
          itemRefs.current[next]?.focus();
          return next;
        });
        return;
      }

      if (event.key === 'Home') {
        event.preventDefault();
        setFocusIndex(0);
        itemRefs.current[0]?.focus();
        return;
      }

      if (event.key === 'End') {
        event.preventDefault();
        const last = WORKSPACES.length - 1;
        setFocusIndex(last);
        itemRefs.current[last]?.focus();
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, closeMenu]);

  function handleSelect(item) {
    closeMenu();
    if (item.key !== workspaceKey) {
      navigate(item.path);
    }
  }

  itemRefs.current = [];

  const panelNode = open ? (
    <WorkspaceSwitcherPanel
      panelId={panelId}
      panelRef={panelRef}
      panelAnchor={panelAnchor}
      layout={layout}
      workspaceKey={workspaceKey}
      itemRefs={itemRefs}
      onSelect={handleSelect}
    />
  ) : null;

  const panel =
    open && layout === 'popover' ? createPortal(panelNode, document.body) : panelNode;

  return (
    <div
      className={`ceos-workspace-switcher ceos-ws-accent-root ${open && layout === 'inline' ? 'is-inline-open' : ''}`.trim()}
      data-testid="workspace-switcher"
      data-workspace={activeWorkspace.key}
      style={cssVars}
      ref={rootRef}
    >
      <style>{switcherCss}</style>

      <button
        ref={triggerRef}
        type="button"
        className="ceos-workspace-switcher-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={panelId}
        data-testid="workspace-switcher-trigger"
        onClick={() => {
          setOpen((value) => {
            const next = !value;
            if (next) {
              syncPanelAnchor();
            }
            return next;
          });
        }}
      >
        <span className="ceos-workspace-switcher-icon" aria-hidden>
          {activeWorkspace.icon}
        </span>

        <span className="ceos-workspace-switcher-copy">
          <span className="ceos-workspace-switcher-label">{activeWorkspace.label}</span>
          <span className="ceos-workspace-switcher-descriptor">{activeWorkspace.title}</span>
        </span>

        <ChevronDown size={16} className="ceos-workspace-switcher-chevron" aria-hidden />
      </button>

      {panel}
    </div>
  );
}
