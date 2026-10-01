import React from 'react';
import { Menu } from 'lucide-react';
import { BrandLogo } from '../../shared/components/brand/BrandLogo.jsx';
import { UserMenu } from './UserMenu.jsx';
import { useShellNav } from './ShellNavContext.jsx';

const topbarLayoutCss = `
  .topbar.ceos-topbar-premium {
    overflow: visible;
    display: block;
    padding: 0;
    min-height: var(--shell-topbar-height, 60px);
    background:
      linear-gradient(180deg, rgba(255,255,255,0.008), rgba(255,255,255,0.000)),
      rgba(0, 0, 0, 0.94);
    border-bottom: 1px solid rgba(255,255,255,0.036);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.010),
      0 16px 44px rgba(0,0,0,0.62);
  }

  .ceos-topbar-shell {
    position: relative;
    z-index: 1;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px 20px;
    min-height: var(--shell-topbar-height, 60px);
    height: var(--shell-topbar-height, 60px);
    padding-block: 0;
    padding-inline: clamp(16px, 1.45vw, 22px);
    box-sizing: border-box;
  }

  .ceos-topbar-leading {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1 1 auto;
  }

  .ceos-topbar-menu-trigger {
    display: none;
    place-items: center;
    width: 40px;
    height: 40px;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    background: rgba(255,255,255,0.03);
    color: rgba(226,232,240,0.86);
    cursor: pointer;
    flex: 0 0 auto;
  }

  @media (max-width: 1024px) {
    .ceos-topbar-menu-trigger {
      display: grid;
    }
  }

  .ceos-topbar-menu-trigger:focus-visible {
    outline: 2px solid rgba(212,175,55,0.55);
    outline-offset: 2px;
  }

  .ceos-topbar-brand {
    display: flex;
    align-items: center;
    min-width: 0;
    flex: 1 1 auto;
  }

  .ceos-topbar-brand-mark {
    width: min(212px, 40vw);
    max-width: 236px;
    min-height: 40px;
    display: flex;
    align-items: center;
  }

  .ceos-topbar-brand-mark .ceos-brand-logo-root {
    width: 100%;
    max-width: 236px;
    max-height: 52px;
  }

  .ceos-topbar-brand-mark .ceos-brand-logo-root img {
    width: auto !important;
    height: auto !important;
    max-width: 236px !important;
    max-height: 52px !important;
    object-fit: contain;
    object-position: left center;
  }

  @media (max-width: 1024px) {
    .ceos-topbar-brand-mark {
      width: min(168px, 36vw);
      max-width: 180px;
      min-height: 34px;
    }

    .ceos-topbar-brand-mark .ceos-brand-logo-root,
    .ceos-topbar-brand-mark .ceos-brand-logo-root img {
      max-height: 40px !important;
      max-width: 180px !important;
    }
  }

  .ceos-topbar-global {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-end;
    gap: 16px;
    flex: 0 0 auto;
    width: auto;
    margin-left: auto;
  }

  .ceos-topbar-status {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-height: 32px;
    padding: 4px 10px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.045);
    background: rgba(0,0,0,0.42);
    color: rgba(226,232,240,0.58);
    font-size: 10px;
    font-weight: 750;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  @media (max-width: 560px) {
    .ceos-topbar-status {
      font-size: 10px;
      padding-inline: 8px;
    }

    .ceos-topbar-status-label {
      display: none;
    }
  }

  .ceos-topbar-status-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: #34d399;
    box-shadow: 0 0 8px rgba(52,211,153,0.38);
    flex: 0 0 auto;
  }
`;

export function Topbar({ onLogout }) {
  const { drawerOpen, toggleDrawer } = useShellNav();

  return (
    <header className="topbar ceos-topbar-premium">
      <style>{topbarLayoutCss}</style>

      <div className="ceos-topbar-shell ceos-content-shell">
        <div className="ceos-topbar-leading">
          <button
            type="button"
            className="ceos-topbar-menu-trigger"
            aria-label="Open navigation"
            aria-expanded={drawerOpen}
            aria-controls="ceos-shell-drawer"
            data-testid="shell-nav-trigger"
            onClick={toggleDrawer}
          >
            <Menu size={18} />
          </button>

          <div className="ceos-topbar-brand">
            <div className="ceos-topbar-brand-mark">
              <BrandLogo
                variant="horizontal"
                horizontalAsset="letters"
                size="md"
                surface="transparent"
                loading="eager"
                className="ceos-topbar-brand-logo"
                alt="CEO's OS"
              />
            </div>
          </div>
        </div>

        <div className="ceos-topbar-global">
          <div className="ceos-topbar-status" data-testid="backend-status">
            <span className="ceos-topbar-status-dot" aria-hidden />
            <span className="ceos-topbar-status-label">Backend activo</span>
          </div>

          <UserMenu onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
}
