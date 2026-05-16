import React from 'react';
import { WorkspaceSwitcher } from './WorkspaceSwitcher.jsx';
import { useAuth } from '../providers/AuthProvider.jsx';

const topbarLayoutCss = `
  .topbar.ceos-topbar-premium {
    position: relative;
    overflow-x: clip;
    overflow-y: visible;
    display: block;
    padding: 0;
    background:
      linear-gradient(180deg, rgba(255,255,255,0.010), rgba(255,255,255,0.000)),
      rgba(0, 0, 0, 0.94);
    border-bottom: 1px solid rgba(255,255,255,0.050);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.012),
      0 20px 54px rgba(0,0,0,0.70);
  }

  .ceos-topbar-shell {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding-block: 22px 16px;
  }

  .ceos-topbar-main {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px 22px;
    min-width: 0;
  }

  .topbar.ceos-topbar-premium .topbar-title {
    flex: 1 1 280px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .topbar.ceos-topbar-premium .ceos-topbar-page-label {
    margin: 0;
    font-size: 11px;
    font-weight: 850;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ws-accent-text, rgba(226, 232, 240, 0.72));
    opacity: 0.92;
  }

  .topbar.ceos-topbar-premium .topbar-title h1 {
    margin: 0;
    font-size: clamp(1.55rem, 2.4vw, 1.95rem);
    line-height: 1.05;
    color: #f8fafc;
    letter-spacing: -0.050em;
  }

  .topbar.ceos-topbar-premium .topbar-title p {
    margin: 0;
    color: rgba(226,232,240,0.58);
    line-height: 1.55;
    font-size: 14px;
  }

  .ceos-topbar-actions {
    display: flex;
    flex: 0 1 auto;
    min-width: 0;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    flex-wrap: wrap;
  }

  .ceos-workspace-rail-row {
    width: 100%;
    min-width: 0;
  }

  .ceos-workspace-rail-row .workspace-switcher.ceos-workspace-rail-shell {
    width: 100%;
    max-width: 100%;
    flex: 1 1 auto;
  }

  .ceos-user-greeting {
    position: relative;
    overflow: hidden;
    padding: 8px 12px;
    border-radius: 999px;
    background:
      linear-gradient(135deg, rgba(255,255,255,0.045), rgba(255,255,255,0.014)),
      rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.070);
    color: rgba(255,255,255,0.82);
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
    .ceos-topbar-shell {
      padding-block: 18px 14px;
      gap: 12px;
    }

    .ceos-topbar-main {
      flex-direction: column;
      align-items: stretch;
    }

    .ceos-topbar-actions {
      justify-content: flex-start;
      width: 100%;
    }
  }
`;

export function Topbar({ title, description, pageLabel = null, actions = null }) {
  const { user } = useAuth();

  return (
    <header className="topbar ceos-topbar-premium">
      <style>{topbarLayoutCss}</style>

      <div className="ceos-topbar-shell ceos-content-shell">
        <div className="ceos-topbar-main">
          <div className="topbar-title">
            {pageLabel ? (
              <p className="ceos-topbar-page-label">{pageLabel}</p>
            ) : null}
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          <div className="row wrap ceos-topbar-actions">
            {actions}

            <div className="badge ceos-user-greeting">
              <span>Hola, {user?.name || 'Usuario'}</span>
            </div>
          </div>
        </div>

        <div className="ceos-workspace-rail-row">
          <WorkspaceSwitcher />
        </div>
      </div>
    </header>
  );
}
