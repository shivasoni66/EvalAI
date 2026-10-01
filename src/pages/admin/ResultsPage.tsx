import React, { useState } from 'react';
import { MOCK_CANDIDATES, MOCK_SCRIPTS } from '../../data/mockData';
import { CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const RESULTS_DATA = MOCK_CANDIDATES.slice(0, 15).map((c, i) => {
  const aiMarks = 55 + Math.floor(Math.random() * 40);
  const examMarks = aiMarks + Math.floor(Math.random() * 7 - 2);
  const moderated = Math.random() > 0.7 ? examMarks - 3 + Math.floor(Math.random() * 6) : null;
  const final = moderated ?? examMarks;
  const statuses = ['evaluated', 'moderated', 'finalized', 'published'];
  const script = MOCK_SCRIPTS[i];
  return {
    candidateId: c.id,
    name: c.name,
    enrollment: c.enrollmentNo,
    scriptCode: script?.scriptCode || `OS-2026-00${1045 + i}`,
    aiMarks,
    examMarks,
    moderated,
    final,
    status: i < 3 ? 'published' : i < 8 ? 'finalized' : i < 12 ? 'moderated' : 'evaluated',
  };
});

export default function ResultsPage() {
  const { showToast, addAuditLog } = useApp();
  const [results, setResults] = useState(RESULTS_DATA);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  const finalizeResult = (enrollment: string) => {
    setResults(prev => prev.map(r =>
      r.enrollment === enrollment ? { ...r, status: 'published' } : r
    ));
    addAuditLog({
      userId: 'u1', userName: 'Dr. Rajesh Kumar',
      action: 'Published result',
      scriptId: enrollment,
      details: `Result finalized and published for ${enrollment}`,
    });
    showToast(`Result published for ${enrollment}`, 'success');
    setShowConfirm(null);
  };

  const filtered = filter === 'all' ? results : results.filter(r => r.status === filter);

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      evaluated: 'badge-blue', moderated: 'badge-purple',
      finalized: 'badge-amber', published: 'badge-green',
    };
    return <span className={`badge ${map[s]}`}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>;
  };

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="section-title">Results Processing</h1>
          <p className="section-subtitle">Finalize and publish examination results · CSE-OS-2026</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="form-input" style={{ height: 34, padding: '0 10px', width: 'auto', fontSize: 12 }} onChange={e => setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="evaluated">Evaluated</option>
            <option value="moderated">Moderated</option>
            <option value="finalized">Finalized</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Published', val: results.filter(r => r.status === 'published').length, color: '#10b981' },
          { label: 'Finalized', val: results.filter(r => r.status === 'finalized').length, color: '#f59e0b' },
          { label: 'Moderated', val: results.filter(r => r.status === 'moderated').length, color: '#8b5cf6' },
          { label: 'Evaluated', val: results.filter(r => r.status === 'evaluated').length, color: '#3b82f6' },
        ].map(s => (
          <div key={s.label} className="kpi-card">
            <div style={{ fontSize: 26, fontWeight: 800, color: '#f0f4ff' }}>{s.val}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card-solid" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Script</th>
              <th>AI Marks</th>
              <th>Examiner Marks</th>
              <th>Moderated</th>
              <th>Final</th>
              <th>Grade</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => {
              const grade = r.final >= 85 ? 'O' : r.final >= 75 ? 'A+' : r.final >= 65 ? 'A' : r.final >= 55 ? 'B+' : r.final >= 45 ? 'B' : 'F';
              return (
                <tr key={r.enrollment}>
                  <td>
                    <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{r.enrollment}</div>
                  </td>
                  <td><span className="mono" style={{ color: '#60a5fa', fontSize: 11 }}>{r.scriptCode}</span></td>
                  <td style={{ color: '#94a3b8' }}>{r.aiMarks}</td>
                  <td style={{ color: '#94a3b8' }}>{r.examMarks}</td>
                  <td style={{ color: r.moderated ? '#a78bfa' : '#475569' }}>{r.moderated || '—'}</td>
                  <td><span style={{ fontSize: 15, fontWeight: 800, color: '#f0f4ff' }}>{r.final}</span></td>
                  <td>
                    <span className={`badge ${grade === 'F' ? 'badge-red' : grade.startsWith('O') || grade.startsWith('A') ? 'badge-green' : 'badge-blue'}`}>
                      {grade}
                    </span>
                  </td>
                  <td>{statusBadge(r.status)}</td>
                  <td>
                    {r.status !== 'published' ? (
                      <button
                        className="btn btn-primary"
                        style={{ fontSize: 11, padding: '5px 10px' }}
                        onClick={() => setShowConfirm(r.enrollment)}
                      >
                        Finalize
                      </button>
                    ) : (
                      <CheckCircle size={16} color="#10b981" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card-solid" style={{ padding: 24, width: 380 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#f0f4ff', marginBottom: 10 }}>Confirm Result Publication</div>
            <p style={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.6, marginBottom: 20 }}>
              This will finalize and publish the result for <strong style={{ color: '#f0f4ff' }}>{showConfirm}</strong>. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => finalizeResult(showConfirm)}>
                Confirm & Publish
              </button>
              <button className="btn btn-secondary" onClick={() => setShowConfirm(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
