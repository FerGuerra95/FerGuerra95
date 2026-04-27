import React from 'react';
import { LogOut, UserCircle } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';
import { pageMetaMap } from '../router/routeConfig.jsx';
import { Button } from '../../shared/components/ui/Button.jsx';
import { useAuth } from '../providers/AuthProvider.jsx';

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
    <div className="app-shell">
      <Sidebar />

      <div className="main-area">
        <div
          style={{
            margin: '18px 24px 0',
            padding: '14px 18px',
            borderRadius: 18,
            border: '1px solid rgba(16,185,129,0.24)',
            background:
              'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(59,130,246,0.08))',
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
                marginBottom: 4
              }}
            >
              CEO’s OS · Stable Demo Build
            </div>

            <div
              style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.76)',
                fontWeight: 600
              }}
            >
              M&A + Compliance conectados a backend JSON · Funding integrado como tercera línea estratégica
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
                background: 'rgba(16,185,129,0.14)',
                border: '1px solid rgba(16,185,129,0.32)',
                color: '#34d399',
                fontSize: 12,
                fontWeight: 900
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
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.10)',
                color: 'rgba(255,255,255,0.88)',
                fontSize: 12,
                fontWeight: 800
              }}
            >
              <UserCircle size={16} />

              <span>
                {user?.name || 'Usuario'} · {user?.role || 'user'}
              </span>
            </div>

            <Button variant="danger" onClick={handleLogout}>
              <LogOut size={16} />
              Cerrar sesión
            </Button>
          </div>
        </div>

        <Topbar title={meta.title} description={meta.description} />

        <Outlet />
      </div>
    </div>
  );
}