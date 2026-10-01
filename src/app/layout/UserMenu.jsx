import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../providers/AuthProvider.jsx';

const userMenuCss = `
  .ceos-user-menu {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  .ceos-user-menu-trigger {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 32px;
    padding: 4px 10px 4px 8px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.06);
    background: rgba(0,0,0,0.42);
    color: rgba(248,250,252,0.88);
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
    transition:
      border-color .18s ease,
      background .18s ease,
      box-shadow .18s ease;
  }

  .ceos-user-menu-trigger:hover,
  .ceos-user-menu-trigger[aria-expanded='true'] {
    border-color: rgba(255,255,255,0.10);
    box-shadow: 0 8px 18px rgba(0,0,0,0.28);
  }

  .ceos-user-menu-trigger:focus-visible {
    outline: 2px solid rgba(212,175,55,0.72);
    outline-offset: 2px;
  }

  .ceos-user-menu-trigger-icon {
    display: grid;
    place-items: center;
    color: rgba(226,232,240,0.82);
  }

  .ceos-user-menu-trigger-chevron {
    color: rgba(148,163,184,0.78);
    transition: transform .18s ease;
  }

  .ceos-user-menu-trigger[aria-expanded='true'] .ceos-user-menu-trigger-chevron {
    transform: rotate(180deg);
  }

  .ceos-user-menu-panel {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    z-index: 40;
    min-width: 220px;
    padding: 8px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.08);
    background:
      radial-gradient(circle at 0% 0%, rgba(255,255,255,0.04), transparent 42%),
      linear-gradient(180deg, rgba(8,10,14,0.98), rgba(0,0,0,0.98));
    box-shadow:
      0 18px 44px rgba(0,0,0,0.58),
      inset 0 1px 0 rgba(255,255,255,0.04);
    backdrop-filter: blur(18px) saturate(140%);
    -webkit-backdrop-filter: blur(18px) saturate(140%);
  }

  .ceos-user-menu-meta {
    padding: 10px 12px 8px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 6px;
  }

  .ceos-user-menu-name {
    display: block;
    font-size: 13px;
    font-weight: 900;
    color: #f8fafc;
  }

  .ceos-user-menu-role {
    display: block;
    margin-top: 3px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: rgba(148,163,184,0.72);
  }

  .ceos-user-menu-action {
    width: 100%;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border: 0;
    border-radius: 12px;
    background: transparent;
    color: #ff9aad;
    font-size: 12px;
    font-weight: 850;
    cursor: pointer;
    text-align: left;
    transition: background .16s ease;
  }

  .ceos-user-menu-action:hover,
  .ceos-user-menu-action:focus-visible {
    background: rgba(239,68,68,0.08);
    outline: none;
  }
`;

export function UserMenu({ onLogout }) {
  const menuId = useId();
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const closeMenu = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, closeMenu]);

  function handleLogoutClick() {
    closeMenu();
    onLogout?.();
  }

  const displayName = user?.name || 'Usuario';

  return (
    <div className="ceos-user-menu" ref={rootRef}>
      <style>{userMenuCss}</style>

      <button
        ref={triggerRef}
        type="button"
        className="ceos-user-menu-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        data-testid="user-menu-trigger"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="ceos-user-menu-trigger-icon" aria-hidden>
          <UserCircle size={16} />
        </span>
        <span>{displayName}</span>
        <ChevronDown size={14} className="ceos-user-menu-trigger-chevron" aria-hidden />
      </button>

      {open ? (
        <div
          id={menuId}
          className="ceos-user-menu-panel"
          role="menu"
          data-testid="user-menu-panel"
        >
          <div className="ceos-user-menu-meta">
            <span className="ceos-user-menu-name">{displayName}</span>
            <span className="ceos-user-menu-role">{user?.role || 'user'}</span>
          </div>

          <button
            type="button"
            role="menuitem"
            className="ceos-user-menu-action"
            data-testid="user-menu-logout"
            onClick={handleLogoutClick}
          >
            <LogOut size={14} aria-hidden />
            Cerrar sesión
          </button>
        </div>
      ) : null}
    </div>
  );
}
