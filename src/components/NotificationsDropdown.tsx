import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, X, CheckCheck } from 'lucide-react';

interface Props { onClose: () => void; }

export default function NotificationsDropdown({ onClose }: Props) {
  const { notifications, markNotificationRead } = useApp();

  const typeColor: Record<string, string> = {
    info: '#3b82f6', warning: '#f59e0b', success: '#10b981', error: '#ef4444',
  };

  const typeIcon: Record<string, string> = {
    info: 'ℹ', warning: '⚠', success: '✓', error: '✕',
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000 / 60);
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 39 }} onClick={onClose} />
      <div style={{
        position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 40,
        width: 360, maxHeight: 480, overflowY: 'auto',
        background: '#0d1f3c', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={14} color="#60a5fa" />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#f0f4ff' }}>Notifications</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => notifications.forEach(n => markNotificationRead(n.id))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#60a5fa', fontSize: 11, display: 'flex', alignItems: 'center', gap: 3 }}>
              <CheckCheck size={12} /> Mark all read
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
              <X size={14} />
            </button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#475569' }}>No notifications</div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                background: n.read ? 'transparent' : 'rgba(59,130,246,0.04)',
                cursor: 'pointer',
                transition: 'background 0.15s',
                display: 'flex', gap: 10,
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                background: `${typeColor[n.type]}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: typeColor[n.type],
                marginTop: 2,
              }}>
                {typeIcon[n.type]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: n.read ? '#94a3b8' : '#e2e8f0' }}>{n.title}</span>
                  {!n.read && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', flexShrink: 0, marginTop: 4 }} />}
                </div>
                <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{n.message}</p>
                <div style={{ fontSize: 10.5, color: '#475569', marginTop: 4 }}>{formatTime(n.timestamp)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
