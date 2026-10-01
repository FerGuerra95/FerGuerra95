import React from 'react';
import { useWorkspaceTheme } from '../../shared/hooks/useWorkspaceTheme.js';
import { SidebarContent } from './SidebarContent.jsx';

const sidebarCss = `
  .sidebar.ceos-sidebar {
    isolation: isolate;
    display: flex;
    flex-direction: column;
    overflow: visible;
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

  .ceos-sidebar-head {
    position: relative;
    z-index: 20;
    flex: 0 0 auto;
    overflow: visible;
    padding: 16px 12px 0;
  }

  .ceos-sidebar-divider {
    height: 1px;
    margin: 12px 12px 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.06),
      rgba(255,255,255,0.02),
      transparent
    );
  }

  .ceos-nav {
    position: relative;
    z-index: 1;
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 14px 10px 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .ceos-nav-section-title {
    padding: 0 8px 8px;
    font-size: 10px;
    font-weight: 950;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: rgba(226,232,240,0.34);
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
    gap: 10px;
    padding: 10px 10px 10px 12px;
    border-radius: 15px;
    text-decoration: none;
    font-size: 13px;
    font-weight: 850;
    border: 1px solid transparent;
    transition:
      color 150ms ease,
      background 150ms ease,
      border-color 150ms ease,
      box-shadow 150ms ease;
  }

  .ceos-nav-icon {
    position: relative;
    z-index: 3;
    display: grid;
    place-items: center;
    width: 25px;
    height: 25px;
    transition: color 150ms ease, filter 150ms ease;
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
  }

  @media (prefers-reduced-motion: reduce) {
    .ceos-nav-link,
    .ceos-nav-icon,
    .ceos-nav-label,
    .ceos-nav-rail {
      transition: none !important;
    }
  }
`;

export function Sidebar() {
  const { cssVars, dataWorkspace } = useWorkspaceTheme();

  return (
    <aside
      className="sidebar ceos-sidebar ceos-shell-desktop-sidebar ceos-ws-accent-root"
      data-workspace={dataWorkspace}
      style={cssVars}
      aria-label="Workspace navigation"
    >
      <style>{sidebarCss}</style>
      <SidebarContent switcherLayout="popover" />
    </aside>
  );
}

export default Sidebar;
