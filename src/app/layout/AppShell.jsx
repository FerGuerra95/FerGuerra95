import React, { Suspense } from 'react';
import { LogOut, UserCircle } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppErrorBoundary } from './AppErrorBoundary.jsx';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';
import { ExecutivePremiumStyle } from './ExecutivePremiumStyle.jsx';
import { getShellTopbarMeta } from './shellMeta.js';
import { Button } from '../../shared/components/ui/Button.jsx';
import { useAuth } from '../providers/AuthProvider.jsx';
import { useWorkspaceTheme } from '../../shared/hooks/useWorkspaceTheme.js';

const appShellBaseCss = `
  html,
  body,
  #root {
    background: #000000;
    min-height: 100dvh;
  }

  .app-shell {
    background: #000000;
    min-height: 100vh;
  }

  .main-area.ceos-main-area {
    min-height: 100vh;
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

  .ceos-logout-btn {
    min-height: 30px !important;
    padding: 5px 9px !important;
    border-radius: 999px !important;
    gap: 6px !important;
    font-size: 10.5px !important;
    line-height: 1 !important;
    font-weight: 900 !important;
    background:
      radial-gradient(circle at 18% 50%, rgba(239,68,68,0.09), transparent 34%),
      linear-gradient(135deg, rgba(30,7,12,0.98), rgba(8,2,4,0.98)) !important;
    border: 1px solid rgba(239,68,68,0.22) !important;
    color: #ff9aad !important;
    box-shadow:
      0 10px 22px rgba(0,0,0,0.42),
      0 0 16px rgba(239,68,68,0.06),
      inset 0 1px 0 rgba(255,255,255,0.045),
      inset 0 -1px 0 rgba(255,255,255,0.012) !important;
    transition:
      transform .18s ease,
      box-shadow .22s ease,
      border-color .22s ease,
      filter .22s ease,
      background .22s ease !important;
  }

  .ceos-logout-btn:hover {
    transform: translateY(-1px);
    border-color: rgba(239,68,68,0.34) !important;
    background:
      radial-gradient(circle at 18% 50%, rgba(239,68,68,0.13), transparent 36%),
      linear-gradient(135deg, rgba(42,9,15,1), rgba(10,3,5,1)) !important;
    box-shadow:
      0 14px 28px rgba(0,0,0,0.50),
      0 0 22px rgba(239,68,68,0.10),
      inset 0 1px 0 rgba(255,255,255,0.065),
      inset 0 -1px 0 rgba(255,255,255,0.016) !important;
    filter: brightness(1.03);
  }

  .ceos-logout-btn svg {
    width: 13px !important;
    height: 13px !important;
    color: #ff7f98 !important;
    filter: drop-shadow(0 0 8px rgba(239,68,68,0.16));
  }

  .ceos-logout-btn span,
  .ceos-logout-btn .button-content {
    font-size: 10.5px !important;
    line-height: 1 !important;
  }

  @keyframes ceos-outlet-fade {
    from {
      opacity: 0.58;
    }
    to {
      opacity: 1;
    }
  }

  .ceos-outlet-fallback {
    animation: ceos-outlet-fade 0.32s ease-out;
  }
`;

export function AppShell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const { cssVars, dataWorkspace, theme } = useWorkspaceTheme();
  const shellMeta = getShellTopbarMeta(pathname, dataWorkspace);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div
      className="app-shell ceos-ws-accent-root"
      data-workspace={dataWorkspace}
      style={{ minHeight: '100vh', ...cssVars }}
    >
      <style>{appShellBaseCss}</style>

      <Sidebar />

      <div
        className="main-area ceos-main-area ceos-ws-accent-root"
        data-workspace={dataWorkspace}
        style={{ minHeight: '100vh', ...cssVars }}
      >
        <div className="ceos-content-shell ceos-main-build-strip">
          <div className="ceos-build-strip-copy">
            <div className="ceos-build-strip-tagline">
              M&A, Compliance, Funding y PMI consolidados con Risk, Reporting y
              Strategy en una capa privada de decision ejecutiva
            </div>
          </div>

          <div className="ceos-build-strip-actions row wrap">
            <div className="ceos-ws-badge ceos-build-strip-badge">
              Backend activo
            </div>

            <div className="ceos-build-strip-user">
              <UserCircle size={16} />
              <span>
                {user?.name || 'Usuario'} · {user?.role || 'user'}
              </span>
            </div>

            <Button
              variant="danger"
              onClick={handleLogout}
              className="ceos-logout-btn"
            >
              <LogOut size={13} />
              Cerrar sesión
            </Button>
          </div>
        </div>

        <Topbar
          title={shellMeta.title}
          description={shellMeta.description}
          pageLabel={shellMeta.pageLabel}
        />

        <div className="ceos-content-shell ceos-page-shell-host">
          <AppErrorBoundary resetKey={location.pathname}>
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

        <ExecutivePremiumStyle />
      </div>
    </div>
  );
}


