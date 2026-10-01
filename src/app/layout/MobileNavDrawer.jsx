import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useShellNav } from './ShellNavContext.jsx';
import { SidebarContent } from './SidebarContent.jsx';
import { useWorkspaceTheme } from '../../shared/hooks/useWorkspaceTheme.js';

const drawerCss = `
  .ceos-shell-drawer-backdrop {
    position: fixed;
    inset: 0;
    z-index: calc(var(--shell-z-topbar, 110) + 5);
    background: rgba(0, 0, 0, 0.62);
    opacity: 0;
    pointer-events: none;
    transition: opacity .16s ease;
  }

  .ceos-shell-drawer-backdrop.is-open {
    opacity: 1;
    pointer-events: auto;
  }

  .ceos-shell-drawer {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: calc(var(--shell-z-topbar, 110) + 6);
    width: min(320px, 88vw);
    max-width: 100%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid rgba(255,255,255,0.06);
    background:
      linear-gradient(180deg, rgba(255,255,255,0.014), rgba(255,255,255,0.004)),
      #000000;
    box-shadow: 18px 0 48px rgba(0,0,0,0.55);
    transform: translateX(-104%);
    transition: transform .18s ease;
    padding-top: env(safe-area-inset-top, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }

  .ceos-shell-drawer.is-open {
    transform: translateX(0);
  }

  .ceos-shell-drawer-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: var(--shell-topbar-height, 56px);
    padding: 0 14px 0 16px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    flex: 0 0 auto;
  }

  .ceos-shell-drawer-title {
    font-size: 11px;
    font-weight: 850;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(148,163,184,0.56);
  }

  .ceos-shell-drawer-close {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    background: rgba(255,255,255,0.03);
    color: rgba(226,232,240,0.82);
    cursor: pointer;
  }

  .ceos-shell-drawer-close:focus-visible {
    outline: 2px solid rgba(212,175,55,0.55);
    outline-offset: 2px;
  }

  .ceos-shell-drawer-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
  }

  .ceos-shell-drawer-body .ceos-sidebar-head {
    padding-top: 16px;
  }

  .ceos-shell-drawer-body .ceos-nav-link {
    min-height: 46px;
  }

  @media (prefers-reduced-motion: reduce) {
    .ceos-shell-drawer,
    .ceos-shell-drawer-backdrop {
      transition: none;
    }
  }
`;

export function MobileNavDrawer() {
  const { drawerOpen, closeDrawer } = useShellNav();
  const { cssVars, dataWorkspace } = useWorkspaceTheme();
  const closeRef = useRef(null);
  const triggerRef = useRef(
    typeof document !== 'undefined'
      ? document.querySelector('[data-testid="shell-nav-trigger"]')
      : null
  );

  useEffect(() => {
    if (!drawerOpen) return undefined;

    const previousFocus = document.activeElement;
    closeRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeDrawer();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus instanceof HTMLElement && document.contains(previousFocus)) {
        previousFocus.focus();
      } else {
        triggerRef.current?.focus();
      }
    };
  }, [drawerOpen, closeDrawer]);

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <>
      <style>{drawerCss}</style>
      <div
        className={`ceos-shell-drawer-backdrop ${drawerOpen ? 'is-open' : ''}`.trim()}
        onClick={closeDrawer}
        aria-hidden={!drawerOpen}
      />
      <aside
        id="ceos-shell-drawer"
        className={`ceos-shell-drawer ceos-sidebar ceos-ws-accent-root ${drawerOpen ? 'is-open' : ''}`.trim()}
        data-workspace={dataWorkspace}
        style={cssVars}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        aria-hidden={!drawerOpen}
      >
        <div className="ceos-shell-drawer-head">
          <span className="ceos-shell-drawer-title">Navigation</span>
          <button
            ref={closeRef}
            type="button"
            className="ceos-shell-drawer-close"
            aria-label="Close navigation"
            data-testid="shell-nav-close"
            onClick={closeDrawer}
          >
            <X size={18} />
          </button>
        </div>

        <div className="ceos-shell-drawer-body">
          <SidebarContent switcherLayout="inline" />
        </div>
      </aside>
    </>,
    document.body
  );
}
