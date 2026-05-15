import React, { Suspense } from 'react';
import { LogOut, UserCircle } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';
import { ExecutivePremiumStyle } from './ExecutivePremiumStyle.jsx';
import { pageMetaMap } from '../router/routeConfig.jsx';
import { Button } from '../../shared/components/ui/Button.jsx';
import { useAuth } from '../providers/AuthProvider.jsx';

const appShellBlackCss = `
  html,
  body,
  #root {
    background: #000000 !important;
  }

  .app-shell {
    background: #000000 !important;
  }

  .main-area {
    background: #000000 !important;
    background-image: none !important;
    min-height: 100vh;
  }

  .main-area::before,
  .main-area::after {
    background: none !important;
    background-image: none !important;
  }

  .main-area .page {
    background: #000000 !important;
    background-image: none !important;
  }

  .topbar {
    background: #000000 !important;
    background-image: none !important;
  }

  .ceos-main-build-strip {
    background:
      linear-gradient(135deg, rgba(255,255,255,0.018), rgba(255,255,255,0.004)),
      #000000 !important;
    background-color: #000000 !important;
    border: 1px solid rgba(255,255,255,0.055) !important;
    box-shadow:
      0 18px 46px rgba(0,0,0,0.88),
      inset 0 1px 0 rgba(255,255,255,0.030) !important;
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

function getPageMeta(pathname) {
  if (pageMetaMap[pathname]) {
    return pageMetaMap[pathname];
  }

  if (pathname.startsWith('/compliance/suppliers/')) {
    return pageMetaMap['/compliance/suppliers/:id'] || {
      title: 'Supplier Intelligence File',
      description:
        'Ficha individual del proveedor con riesgo, resiliencia, alertas asociadas, evidencias y revisiones humanas.'
    };
  }

  if (pathname.startsWith('/compliance/audit-runs')) {
    return pageMetaMap['/compliance/audit-runs'] || {
      title: 'Compliance Audit Ledger',
      description:
        'Historial enterprise de auditorías deterministas, evidencias citadas y exportación JSON firmada para auditores externos.'
    };
  }

  return {
    title: 'CEO’s OS',
    description:
      'Plataforma ejecutiva para valoración M&A, compliance de proveedores y financiación corporativa.'
  };
}

export function AppShell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const meta = getPageMeta(pathname);

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div
      className="app-shell"
      style={{
        background: '#000000',
        backgroundColor: '#000000',
        backgroundImage: 'none',
        minHeight: '100vh'
      }}
    >
      <style>{appShellBlackCss}</style>

      <Sidebar />

      <div
        className="main-area"
        style={{
          background: '#000000',
          backgroundColor: '#000000',
          backgroundImage: 'none',
          minHeight: '100vh'
        }}
      >
        <div
          className="ceos-main-build-strip"
          style={{
            margin: '18px 24px 0',
            padding: '14px 18px',
            borderRadius: 18,
            border: '1px solid rgba(255,255,255,0.055)',
            background: '#000000',
            backgroundColor: '#000000',
            backgroundImage:
              'linear-gradient(135deg, rgba(255,255,255,0.018), rgba(255,255,255,0.004))',
            boxShadow:
              '0 18px 46px rgba(0,0,0,0.88), inset 0 1px 0 rgba(255,255,255,0.030)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap'
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: 0.6,
                textTransform: 'uppercase',
                color: '#34d399',
                marginBottom: 4,
                textShadow:
                  '0 0 14px rgba(52,211,153,0.16), 0 0 10px rgba(212,175,55,0.06)'
              }}
            >
              CEO's OS · Secure Executive Workspace
            </div>

            <div
              style={{
                fontSize: 14,
                color: 'rgba(226,232,240,0.62)',
                fontWeight: 600
              }}
            >
              M&A, Compliance, Funding y PMI consolidados con Risk, Reporting
              y Strategy en una capa privada de decision ejecutiva
            </div>
          </div>

          <div
            className="row wrap"
            style={{
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}
          >
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 999,
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.24)',
                color: '#34d399',
                fontSize: 12,
                fontWeight: 900,
                boxShadow: '0 0 18px rgba(16,185,129,0.07)'
              }}
            >
              Backend activo
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.030)',
                border: '1px solid rgba(255,255,255,0.070)',
                color: 'rgba(255,255,255,0.82)',
                fontSize: 12,
                fontWeight: 800
              }}
            >
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

        <Topbar title={meta.title} description={meta.description} />

        <Suspense
          fallback={
            <div
              className="ceos-outlet-fallback"
              style={{
                minHeight: 'min(560px, calc(100dvh - 240px))',
                display: 'grid',
                placeItems: 'center',
                padding: 32,
                margin: '0 24px 24px',
                borderRadius: 22,
                background:
                  'radial-gradient(circle at 50% 0%, rgba(16,185,129,0.06), transparent 45%), #000000',
                color: 'rgba(232, 237, 247, 0.9)',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.02em',
                textAlign: 'center',
                border: '1px solid rgba(148, 163, 184, 0.08)'
              }}
            >
              <div>
                <div style={{ opacity: 0.7, marginBottom: 10 }}>CEO&apos;s OS</div>
                <div>Loading workspace...</div>
              </div>
            </div>
          }
        >
          <Outlet />
        </Suspense>

        <ExecutivePremiumStyle />
      </div>
    </div>
  );
}
