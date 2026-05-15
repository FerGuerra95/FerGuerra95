import React from 'react';
import { WorkspaceSwitcher } from './WorkspaceSwitcher.jsx';
import { useAuth } from '../providers/AuthProvider.jsx';

const topbarBlackCss = `
  .topbar.ceos-topbar-premium {
    position: relative;
    overflow-x: clip;
    overflow-y: visible;
    flex-wrap: wrap;
    align-items: flex-start;
    background:
      linear-gradient(180deg, rgba(255,255,255,0.010), rgba(255,255,255,0.000)),
      #000000 !important;
    background-color: #000000 !important;
    background-image:
      linear-gradient(180deg, rgba(255,255,255,0.010), rgba(255,255,255,0.000)) !important;
    border-bottom: 1px solid rgba(255,255,255,0.050) !important;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.012),
      0 20px 54px rgba(0,0,0,0.70) !important;
  }

  .topbar.ceos-topbar-premium::before,
  .topbar.ceos-topbar-premium::after {
    content: "";
    position: absolute;
    pointer-events: none;
  }

  .topbar.ceos-topbar-premium::before {
    left: 30px;
    right: 30px;
    bottom: -1px;
    height: 1px;
    background:
      linear-gradient(
        90deg,
        transparent,
        rgba(255,255,255,0.08),
        rgba(52,211,153,0.10),
        rgba(212,175,55,0.055),
        transparent
      );
    opacity: 0.9;
  }

  .topbar.ceos-topbar-premium::after {
    inset: 0;
    background:
      radial-gradient(circle at 12% 0%, rgba(255,255,255,0.018), transparent 28%),
      radial-gradient(circle at 88% 0%, rgba(16,185,129,0.030), transparent 26%);
    opacity: 0.68;
  }

  .topbar.ceos-topbar-premium .topbar-title,
  .topbar.ceos-topbar-premium .ceos-topbar-actions {
    position: relative;
    z-index: 1;
    min-width: 0;
  }

  .topbar.ceos-topbar-premium .topbar-title {
    flex: 1 1 300px;
  }

  .topbar.ceos-topbar-premium .topbar-title h1 {
    margin: 0;
    color: #f8fafc !important;
    letter-spacing: -0.050em;
    text-shadow:
      0 0 16px rgba(255,255,255,0.045),
      0 0 14px rgba(212,175,55,0.035);
  }

  .topbar.ceos-topbar-premium .topbar-title p {
    margin-top: 8px;
    color: rgba(226,232,240,0.58) !important;
    line-height: 1.55;
  }

  .ceos-topbar-actions {
    display: flex;
    flex: 1 1 620px;
    min-width: 0;
    max-width: 100%;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
  }

  .topbar.ceos-topbar-premium .workspace-switcher {
    padding: 6px;
    border-radius: 999px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.050), rgba(255,255,255,0.016)),
      rgba(255,255,255,0.024);
    border: 1px solid rgba(255,255,255,0.075);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.050),
      inset 0 -1px 0 rgba(255,255,255,0.015),
      0 14px 36px rgba(0,0,0,0.34);
    backdrop-filter: blur(18px) saturate(145%);
    -webkit-backdrop-filter: blur(18px) saturate(145%);
  }

  .topbar.ceos-topbar-premium .workspace-switcher button {
    border: 1px solid transparent;
    border-radius: 999px;
    color: rgba(226,232,240,0.62);
    background: transparent;
    font-weight: 850;
    transition:
      transform .18s ease,
      color .18s ease,
      background .18s ease,
      border-color .18s ease,
      box-shadow .18s ease;
  }

  .topbar.ceos-topbar-premium .workspace-switcher button:hover {
    color: #f8fafc;
    transform: translateY(-1px);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.060), rgba(255,255,255,0.018));
    border-color: rgba(255,255,255,0.085);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.060),
      0 10px 24px rgba(0,0,0,0.26);
  }

  .topbar.ceos-topbar-premium .workspace-switcher button.active {
    color: #ffffff;
    background:
      radial-gradient(circle at 20% 0%, rgba(255,255,255,0.105), transparent 34%),
      linear-gradient(135deg, rgba(16,185,129,0.22), rgba(59,130,246,0.060));
    border-color: rgba(16,185,129,0.20);
    box-shadow:
      0 12px 30px rgba(0,0,0,0.36),
      0 0 22px rgba(16,185,129,0.070),
      inset 0 1px 0 rgba(255,255,255,0.085);
  }

  .ceos-user-greeting {
    position: relative;
    overflow: hidden;
    padding: 8px 12px;
    border-radius: 999px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.045), rgba(255,255,255,0.014)),
      rgba(255,255,255,0.025) !important;
    border: 1px solid rgba(255,255,255,0.070) !important;
    color: rgba(255,255,255,0.82) !important;
    font-size: 12px;
    font-weight: 850;
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.040),
      inset 0 -1px 0 rgba(255,255,255,0.014),
      0 12px 28px rgba(0,0,0,0.34);
  }

  .ceos-user-greeting::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(
        115deg,
        rgba(255,255,255,0.045),
        transparent 38%,
        transparent 100%
      );
    opacity: 0.72;
    pointer-events: none;
  }

  .ceos-user-greeting span {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 920px) {
    .ceos-topbar-actions {
      justify-content: flex-start;
      width: 100%;
    }

    .topbar.ceos-topbar-premium .workspace-switcher {
      width: 100%;
      justify-content: space-between;
    }
  }
`;

export function Topbar({ title, description, actions = null }) {
  const { user } = useAuth();

  return (
    <header
      className="topbar ceos-topbar-premium"
      style={{
        background: '#000000',
        backgroundColor: '#000000',
        borderBottom: '1px solid rgba(255,255,255,0.050)'
      }}
    >
      <style>{topbarBlackCss}</style>

      <div className="topbar-title">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="row wrap ceos-topbar-actions">
        <WorkspaceSwitcher />

        {actions}

        <div className="badge ceos-user-greeting">
          <span>Hola, {user?.name || 'Usuario'}</span>
        </div>
      </div>
    </header>
  );
}
