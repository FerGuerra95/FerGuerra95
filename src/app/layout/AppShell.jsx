import React, { Suspense } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppErrorBoundary } from './AppErrorBoundary.jsx';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';
import { MobileNavDrawer } from './MobileNavDrawer.jsx';
import { ShellNavProvider, useShellNav } from './ShellNavContext.jsx';
import { useAuth } from '../providers/AuthProvider.jsx';
import { useWorkspaceTheme } from '../../shared/hooks/useWorkspaceTheme.js';
import '../../modules/ma/styles/maShellCompact.css';

const appShellBaseCss = `
  html,
  body,
  #root {
    background: #000000;
    min-height: 100dvh;
  }

  .app-shell {
    background: #000000;
    min-height: 100dvh;
    width: 100%;
  }

  .ceos-shell-body {
    min-width: 0;
    min-height: 0;
  }

  .main-area.ceos-main-area {
    min-height: 0;
    background: #000000;
    background-image: radial-gradient(
      circle at 50% -18%,
      var(--ws-accent-glow, rgba(212, 175, 55, 0.08)),
      transparent 46%
    );
  }

  .main-area.ceos-main-area::before,
  .main-area.ceos-main-area::after {
    display: none;
  }

  @keyframes ceos-outlet-fade {
    from { opacity: 0.58; }
    to { opacity: 1; }
  }

  .ceos-outlet-fallback {
    animation: ceos-outlet-fade 0.32s ease-out;
  }
`;

export function AppShell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { cssVars, dataWorkspace, theme } = useWorkspaceTheme();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <ShellNavProvider>
      <AppShellFrame
        pathname={pathname}
        dataWorkspace={dataWorkspace}
        cssVars={cssVars}
        theme={theme}
        onLogout={handleLogout}
      />
    </ShellNavProvider>
  );
}

function AppShellFrame({ pathname, dataWorkspace, cssVars, theme, onLogout }) {
  const { isDrawerLayout } = useShellNav();

  return (
      <div
        className="app-shell ceos-ws-accent-root"
        data-workspace={dataWorkspace}
        style={{ minHeight: '100dvh', ...cssVars }}
      >
        <style>{appShellBaseCss}</style>

        <Topbar onLogout={onLogout} />

        <div className="ceos-shell-body">
          {!isDrawerLayout ? <Sidebar /> : null}

          <div
            className="main-area ceos-main-area ceos-ws-accent-root"
            data-workspace={dataWorkspace}
            style={cssVars}
          >
            <div className="ceos-content-shell ceos-page-shell-host">
              <AppErrorBoundary resetKey={pathname}>
                <Suspense
                  fallback={
                    <div className="ceos-outlet-fallback ceos-ws-loading-panel">
                      <div className="ceos-ws-loading-branch">{theme.label}</div>
                      <div>Loading workspace...</div>
                    </div>
                  }
                >
                  <Outlet />
                </Suspense>
              </AppErrorBoundary>
            </div>
          </div>
        </div>

        {isDrawerLayout ? <MobileNavDrawer /> : null}
      </div>
  );
}
