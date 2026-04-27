import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { SuccessToast } from '../../shared/components/feedback/SuccessToast.jsx';

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const pushToast = useCallback((message) => {
    const id = `toast_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 2800);
  }, []);

  const value = useMemo(() => ({ pushToast }), [pushToast]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
      <div style={{ position: 'fixed', right: 20, bottom: 20, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 80 }}>
        {toasts.map((toast) => (
          <SuccessToast key={toast.id} message={toast.message} />
        ))}
      </div>
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
