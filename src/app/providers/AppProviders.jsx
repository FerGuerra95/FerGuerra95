import React from 'react';
import { AuthProvider } from './AuthProvider.jsx';
import { ThemeProvider } from './ThemeProvider.jsx';
import { NotificationsProvider } from './NotificationsProvider.jsx';
import { QueryProvider } from './QueryProvider.jsx';

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationsProvider>
          <QueryProvider>{children}</QueryProvider>
        </NotificationsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
