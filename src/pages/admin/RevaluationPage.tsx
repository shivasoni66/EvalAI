import React, { useState } from 'react';
import { MOCK_REVALUATION_REQUESTS } from '../../data/mockData';
import type { RevaluationRequest } from '../../types';
import { useApp } from '../../context/AppContext';

export default function RevaluationPage() {
  const { showToast } = useApp();
  const [requests, setRequests] = useState<RevaluationRequest[]>(() => {
    const stored = localStorage.getItem('evalai_revaluation');
    return stored ? JSON.parse(stored) : MOCK_REVALUATION_REQUESTS;
  });

  const [selected, setSelected] = useState<RevaluationRequest | null>(null);
  const [revisedMarks, setRevisedMarks] = useState<number | ''>('');
  const [resolution, setResolution] = useState('');

  const statusBadge = (s: string) => {
    const map: Record<string, string> = { requested: 'badge-amber', under_review: 'badge-blue', completed: 'badge-green' };
    const label: Record<string, string> = { requested: 'Requested', under_review: 'Under Review', completed: 'Completed' };
    return <span className={`badge ${map[s]}`}>{label[s]}</span>;
  };

  const resolve = () => {
    if (!selected) return;
    const updated = requests.map(r =>
      r.id === selected.id
        ? { ...r, status: 'completed' as const, revisedMarks: Number(revisedMarks), resolvedAt: new Date().toISOString() }
        : r
    );
    setRequests(updated);
    localStorage.setItem('evalai_revaluation', JSON.stringify(updated));
    showToast('Revaluation request resolved', 'success');
    setSelected(null);
  };

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 className="section-title">Revaluation Requests</h1>
        <p className="section-subtitle">Manage student revaluation requests for examination re-checking</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {requests.map(req => (
            <div
              key={req.id}
              className="card-solid"
              style={{ padding: 18, cursor: 'pointer', border: selected?.id === req.id ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.06)' }}
              onClick={() => { setSelected(req); setRevisedMarks(req.revisedMarks || req.originalMarks); }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#f0f4ff' }}>{req.studentName}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{req.studentId}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {statusBadge(req.status)}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 10, color: '#475569' }}>SUBJECT</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>{req.subject}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#475569' }}>QUESTION</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>Q{req.questionNumber}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#475569' }}>ORIGINAL MARKS</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f4ff' }}>{req.originalMarks}/10</div>
                </div>
                {req.revisedMarks !== undefined && (
                  <div>
                    <div style={{ fontSize: 10, color: '#475569' }}>REVISED MARKS</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#34d399' }}>{req.revisedMarks}/10</div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
                <div style={{ fontSize: 11, color: '#475569', marginBottom: 3 }}>STUDENT REASON</div>
                <div style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.5 }}>{req.reason}</div>
              </div>

              <div style={{ marginTop: 8, fontSize: 11, color: '#475569' }}>
                Submitted: {new Date(req.submittedAt).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>

        {selected && selected.status !== 'completed' && (
          <div className="card-solid" style={{ padding: 20, height: 'fit-content', position: 'sticky', top: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#f0f4ff', marginBottom: 16 }}>Review Request</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Student', val: selected.studentName },
                { label: 'Subject', val: selected.subject },
                { label: 'Question', val: `Q${selected.questionNumber}` },
                { label: 'Original Marks', val: `${selected.originalMarks}/10` },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 6 }}>
                  <span style={{ fontSize: 12.5, color: '#64748b' }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{item.val}</span>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>REVISED MARKS</label>
              <input
                type="number" min={0} max={10}
                value={revisedMarks}
                onChange={e => setRevisedMarks(Number(e.target.value))}
                className="form-input"
                style={{ width: 80, textAlign: 'center', fontSize: 18, fontWeight: 700, height: 42 }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 6 }}>RESOLUTION NOTES</label>
              <textarea
                className="form-input" rows={3}
                value={resolution} onChange={e => setResolution(e.target.value)}
                placeholder="Enter resolution notes..." style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={resolve}>Resolve Request</button>
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
