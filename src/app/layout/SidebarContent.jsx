import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  getActiveWorkspaceKey,
  getWorkspaceNavItems
} from '../navigation/workspaceNav.js';
import { useWorkspaceTheme } from '../../shared/hooks/useWorkspaceTheme.js';
import { WorkspaceSwitcher } from './WorkspaceSwitcher.jsx';
import { useShellNav } from './ShellNavContext.jsx';

function NavIcon({ icon }) {
  if (!React.isValidElement(icon)) return icon;

  return React.cloneElement(icon, {
    className: `${icon.props.className || ''} ceos-nav-svg`.trim()
  });
}

function SidebarNavItem({ item, onNavigate }) {
  return (
    <NavLink
      to={item.to}
      className={({ isActive }) =>
        `ceos-nav-link ${isActive ? 'is-active' : ''}`.trim()
      }
      onClick={onNavigate}
    >
      <span className="ceos-nav-rail" aria-hidden />
      <span className="ceos-nav-icon" aria-hidden>
        <NavIcon icon={item.icon} />
      </span>
      <span className="ceos-nav-label">{item.label}</span>
    </NavLink>
  );
}

/**
 * Shared sidebar body: workspace switcher + local workspace navigation.
 * @param {{ switcherLayout?: 'popover' | 'inline' }} props
 */
export function SidebarContent({ switcherLayout = 'popover' }) {
  const { pathname } = useLocation();
  const shellNav = useShellNav();

  const activeWorkspaceKey = getActiveWorkspaceKey(pathname);
  const navItems = getWorkspaceNavItems(activeWorkspaceKey);

  function handleLocalNavigate() {
    if (switcherLayout === 'inline') {
      shellNav.closeDrawer();
    }
  }

  return (
    <>
      <div className="ceos-sidebar-head">
        <WorkspaceSwitcher layout={switcherLayout} />
      </div>

      <div className="ceos-sidebar-divider" aria-hidden />

      <nav className="ceos-nav" aria-label="Local workspace pages">
        <div className="ceos-nav-section-title">Workspace</div>

        <div className="ceos-nav-list">
          {navItems.map((item) => (
            <SidebarNavItem key={item.to} item={item} onNavigate={handleLocalNavigate} />
          ))}
        </div>
      </nav>
    </>
  );
}

export default SidebarContent;
