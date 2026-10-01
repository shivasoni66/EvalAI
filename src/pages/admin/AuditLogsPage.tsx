import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AuditLogsPage() {
  const { auditLogs } = useApp();
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const filtered = auditLogs.filter(log => {
    const matchSearch = !search || log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      (log.scriptId || '').toLowerCase().includes(search.toLowerCase());
    const matchAction = filterAction === 'all' || log.action.toLowerCase().includes(filterAction.toLowerCase());
    return matchSearch && matchAction;
  });

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 className="section-title">Audit Logs</h1>
        <p className="section-subtitle">Complete audit trail of all examination platform activities for accountability and transparency</p>
      </div>

      <div style={{ padding: '12px 16px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 8 }}>
        <div style={{ fontSize: 12.5, color: '#60a5fa' }}>
          🔒 All actions are immutably recorded. This log is maintained for academic integrity compliance.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <input
          className="form-input"
          placeholder="Search by user, action, script ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, height: 36 }}
        />
        <select className="form-input" style={{ height: 36, width: 180, padding: '0 10px', fontSize: 12 }}
          onChange={e => setFilterAction(e.target.value)}>
          <option value="all">All Actions</option>
          <option value="marks">Marks Changes</option>
          <option value="flag">Flags</option>
          <option value="submit">Submissions</option>
          <option value="publish">Publications</option>
          <option value="moderation">Moderation</option>
        </select>
      </div>

      <div className="card-solid" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: '#f0f4ff' }}>Activity Log ({filtered.length} entries)</span>
          <span style={{ fontSize: 12, color: '#475569' }}>Sorted by most recent</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>User</th>
              <th>Action</th>
              <th>Script</th>
              <th>Question</th>
              <th>Old Value</th>
              <th>New Value</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(log => (
              <tr key={log.id}>
                <td style={{ color: '#475569', fontSize: 11.5 }}>{formatDate(log.timestamp)}</td>
                <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#60a5fa' }}>{formatTime(log.timestamp)}</td>
                <td>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: '#e2e8f0' }}>{log.userName}</div>
                  <div style={{ fontSize: 10.5, color: '#475569' }}>{log.userId}</div>
                </td>
                <td>
                  <span style={{
                    fontSize: 12, fontWeight: 600,
                    color: log.action.includes('Changed') ? '#fbbf24' :
                      log.action.includes('Submitted') || log.action.includes('Accepted') ? '#34d399' :
                      log.action.includes('Flagged') ? '#f87171' : '#94a3b8',
                  }}>
                    {log.action}
                  </span>
                </td>
                <td><span className="mono" style={{ color: '#60a5fa', fontSize: 11 }}>{log.scriptId || '—'}</span></td>
                <td style={{ color: '#94a3b8', fontSize: 12 }}>{log.questionId || '—'}</td>
                <td>
                  {log.oldValue ? (
                    <span style={{ fontWeight: 700, color: '#f87171', background: 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>
                      {log.oldValue}
                    </span>
                  ) : <span style={{ color: '#475569' }}>—</span>}
                </td>
                <td>
                  {log.newValue ? (
                    <span style={{ fontWeight: 700, color: '#34d399', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>
                      {log.newValue}
                    </span>
                  ) : <span style={{ color: '#475569' }}>—</span>}
                </td>
                <td style={{ fontSize: 11.5, color: '#64748b', maxWidth: 200 }}>{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
