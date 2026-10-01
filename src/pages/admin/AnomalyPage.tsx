import React, { useState } from 'react';
import { MOCK_ANOMALIES } from '../../data/mockData';
import type { AnomalyAlert } from '../../types';
import { AlertTriangle, Eye, X, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AnomalyPage() {
  const { showToast } = useApp();
  const [alerts, setAlerts] = useState<AnomalyAlert[]>(() => {
    const stored = localStorage.getItem('evalai_anomalies');
    return stored ? JSON.parse(stored) : MOCK_ANOMALIES;
  });

  const dismiss = (id: string) => {
    const updated = alerts.map(a => a.id === id ? { ...a, status: 'dismissed' as const } : a);
    setAlerts(updated);
    localStorage.setItem('evalai_anomalies', JSON.stringify(updated));
    showToast('Alert dismissed', 'info');
  };

  const review = (id: string) => {
    const updated = alerts.map(a => a.id === id ? { ...a, status: 'reviewed' as const } : a);
    setAlerts(updated);
    localStorage.setItem('evalai_anomalies', JSON.stringify(updated));
    showToast('Alert marked as reviewed', 'success');
  };

  const severityColor: Record<string, string> = {
    high: '#e11d48', medium: '#d97706', low: '#2563eb',
  };
  const severityBg: Record<string, string> = {
    high: '#fff1f2', medium: '#fffbeb', low: '#eff6ff',
  };
  const severityBorder: Record<string, string> = {
    high: '#fecdd3', medium: '#fde68a', low: '#bfdbfe',
  };

  const typeIcons: Record<string, string> = {
    high_variance: '📊',
    rapid_evaluation: '⚡',
    pattern_deviation: '📈',
    similarity: '🔍',
  };

  const active = alerts.filter(a => a.status === 'active');
  const reviewed = alerts.filter(a => a.status === 'reviewed');
  const dismissed = alerts.filter(a => a.status === 'dismissed');

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 className="section-title">Automated AI Anomaly Detection</h1>
        <p className="section-subtitle">
          Real-time statistical checks for marking speed anomalies, grader leniency/strictness bias, and unchecked answers
        </p>
      </div>

      {/* Multi-Color KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Active Alerts', val: active.length, color: '#e11d48', bg: '#fff1f2', border: '#fecdd3' },
          { label: 'High Severity', val: alerts.filter(a => a.severity === 'high').length, color: '#e11d48', bg: '#fff1f2', border: '#fecdd3' },
          { label: 'Under Review', val: reviewed.length, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
          { label: 'Resolved Cases', val: dismissed.length, color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
        ].map(s => (
          <div
            key={s.label}
            className="kpi-card"
            style={{
              '--accent-color': s.color,
              border: `1px solid ${s.border}`,
            } as React.CSSProperties}
          >
            <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{s.val}</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: s.color, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Active alerts */}
      {active.length > 0 && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>
            Active Quality Assurance Alerts ({active.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {active.map(alert => (
              <div
                key={alert.id}
                style={{
                  padding: '20px 22px', borderRadius: 12,
                  background: severityBg[alert.severity],
                  border: `1px solid ${severityBorder[alert.severity]}`,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 16, flex: 1 }}>
                    <div style={{ fontSize: 32 }}>{typeIcons[alert.type]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                        <AlertTriangle size={18} color={severityColor[alert.severity]} />
                        <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{alert.title}</span>
                        <span className={`badge ${alert.severity === 'high' ? 'badge-red' : alert.severity === 'medium' ? 'badge-amber' : 'badge-blue'}`}>
                          {alert.severity.toUpperCase()} SEVERITY
                        </span>
                      </div>
                      <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.6, marginBottom: 12 }}>
                        {alert.description}
                      </p>
                      {alert.affectedScripts && (
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b' }}>AFFECTED SCRIPTS:</span>
                          {alert.affectedScripts.map(s => (
                            <span
                              key={s}
                              style={{
                                fontSize: 11.5, fontFamily: 'monospace', fontWeight: 700,
                                color: '#1d4ed8', background: '#eff6ff', border: '1px solid #bfdbfe',
                                padding: '2px 8px', borderRadius: 6,
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn btn-primary"
                      style={{ fontSize: 12, padding: '7px 14px', background: '#2563eb' }}
                      onClick={() => review(alert.id)}
                    >
                      <Eye size={14} /> Review Flag
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: 12, padding: '7px 12px' }}
                      onClick={() => dismiss(alert.id)}
                    >
                      <X size={14} /> Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviewed Alerts */}
      {reviewed.length > 0 && (
        <div className="card-solid" style={{ padding: 22 }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>
            Under Peer Review ({reviewed.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {reviewed.map(alert => (
              <div
                key={alert.id}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 16px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0',
                }}
              >
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a' }}>{alert.title}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{alert.description}</div>
                </div>
                <button
                  className="btn btn-secondary"
                  style={{ fontSize: 11.5, padding: '5px 12px' }}
                  onClick={() => dismiss(alert.id)}
                >
                  Mark Resolved
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
