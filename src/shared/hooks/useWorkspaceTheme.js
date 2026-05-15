import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { getWorkspaceByPathname } from '../../app/router/workspaceConfig.jsx';
import {
  getWorkspaceTheme,
  getWorkspaceThemeCssVars
} from '../config/workspaceTheme.js';

export function useWorkspaceTheme() {
  const { pathname } = useLocation();

  return useMemo(() => {
    const key = getWorkspaceByPathname(pathname);
    const theme = getWorkspaceTheme(key);
    const cssVars = getWorkspaceThemeCssVars(key);

    return {
      key,
      theme,
      cssVars,
      dataWorkspace: key
    };
  }, [pathname]);
}
