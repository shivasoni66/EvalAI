import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, UserRole, AuditLog, Notification } from '../types';
import { MOCK_USERS, MOCK_AUDIT_LOGS, MOCK_NOTIFICATIONS } from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  unreadCount: number;
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('evalai_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const stored = localStorage.getItem('evalai_audit_logs');
    return stored ? JSON.parse(stored) : MOCK_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const stored = localStorage.getItem('evalai_notifications');
    return stored ? JSON.parse(stored) : MOCK_NOTIFICATIONS;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    localStorage.setItem('evalai_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('evalai_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const login = (email: string, _password: string, role: UserRole): boolean => {
    const user = MOCK_USERS.find(u => u.email === email && u.role === role);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('evalai_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('evalai_user');
  };

  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      id: `a${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addNotification = (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newN: Notification = {
      ...n,
      id: `n${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newN, ...prev]);
  };

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = `t${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      currentUser, login, logout,
      auditLogs, addAuditLog,
      notifications, markNotificationRead, addNotification,
      unreadCount, toasts, showToast,
    }}>
      {children}
      {/* Toast container */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} className="toast" style={{
            borderLeft: `3px solid ${t.type === 'success' ? '#10b981' : t.type === 'error' ? '#ef4444' : t.type === 'warning' ? '#f59e0b' : '#3b82f6'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: t.type === 'success' ? '#10b981' : t.type === 'error' ? '#ef4444' : t.type === 'warning' ? '#f59e0b' : '#3b82f6',
              }} />
              <span style={{ fontSize: 13.5, color: '#e2e8f0', fontWeight: 500 }}>{t.message}</span>
            </div>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
