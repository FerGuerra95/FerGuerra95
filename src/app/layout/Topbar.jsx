import React from 'react';
import { WorkspaceSwitcher } from './WorkspaceSwitcher.jsx';
import { useAuth } from '../providers/AuthProvider.jsx';

const topbarBlackCss = `
  .topbar.ceos-topbar-black {
    background: #000000 !important;
    background-image: none !important;
    border-bottom: 1px solid rgba(255,255,255,0.045) !important;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.012),
      0 18px 50px rgba(0,0,0,0.62) !important;
  }

  .topbar.ceos-topbar-black::before,
  .topbar.ceos-topbar-black::after {
    content: none !important;
    display: none !important;
    background: none !important;
    background-image: none !important;
  }

  .topbar.ceos-topbar-black .topbar-title h1 {
    color: #f8fafc !important;
    text-shadow:
      0 0 14px rgba(255,255,255,0.045),
      0 0 14px rgba(212,175,55,0.045);
  }

  .topbar.ceos-topbar-black .topbar-title p {
    color: rgba(226,232,240,0.62) !important;
  }

  .topbar.ceos-topbar-black .badge {
    background: rgba(255,255,255,0.035) !important;
    border: 1px solid rgba(255,255,255,0.065) !important;
    color: rgba(255,255,255,0.86) !important;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.035),
      0 10px 24px rgba(0,0,0,0.38);
  }
`;

export function Topbar({ title, description, actions = null }) {
  const { user } = useAuth();

  return (
    <header
      className="topbar ceos-topbar-black"
      style={{
        background: '#000000',
        backgroundImage: 'none',
        borderBottom: '1px solid rgba(255,255,255,0.045)'
      }}
    >
      <style>{topbarBlackCss}</style>

      <div className="topbar-title">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div
        className="row wrap"
        style={{
          alignItems: 'center',
          justifyContent: 'flex-end'
        }}
      >
        <WorkspaceSwitcher />

        {actions}

        <div className="badge">Hola, {user?.name || 'Usuario'}</div>
      </div>
    </header>
  );
}