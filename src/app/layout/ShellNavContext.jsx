import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export const SHELL_DRAWER_BREAKPOINT_PX = 1024;

const ShellNavContext = createContext(null);

export function useShellNav() {
  const context = useContext(ShellNavContext);
  if (!context) {
    throw new Error('useShellNav must be used within ShellNavProvider');
  }
  return context;
}

export function ShellNavProvider({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isDrawerLayout, setIsDrawerLayout] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(`(max-width: ${SHELL_DRAWER_BREAKPOINT_PX}px)`).matches;
  });

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const openDrawer = useCallback(() => {
    setDrawerOpen(true);
  }, []);

  const toggleDrawer = useCallback(() => {
    setDrawerOpen((value) => !value);
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${SHELL_DRAWER_BREAKPOINT_PX}px)`);
    const syncLayout = () => setIsDrawerLayout(media.matches);
    syncLayout();
    media.addEventListener('change', syncLayout);
    return () => media.removeEventListener('change', syncLayout);
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      document.body.dataset.shellDrawerOpen = 'true';
    } else {
      delete document.body.dataset.shellDrawerOpen;
    }

    return () => {
      delete document.body.dataset.shellDrawerOpen;
    };
  }, [drawerOpen]);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${SHELL_DRAWER_BREAKPOINT_PX}px)`);

    function handleChange(event) {
      if (!event.matches) {
        setDrawerOpen(false);
      }
    }

    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  const value = useMemo(
    () => ({
      drawerOpen,
      isDrawerLayout,
      openDrawer,
      closeDrawer,
      toggleDrawer
    }),
    [drawerOpen, isDrawerLayout, openDrawer, closeDrawer, toggleDrawer]
  );

  return <ShellNavContext.Provider value={value}>{children}</ShellNavContext.Provider>;
}
