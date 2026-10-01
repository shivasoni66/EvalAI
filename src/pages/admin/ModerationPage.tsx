import React, { useState } from 'react';
import { MOCK_MODERATION_CASES, MOCK_CANDIDATES, MOCK_SCRIPTS } from '../../data/mockData';
import type { ModerationCase } from '../../types';
import { Scale, CheckCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ModerationPage() {
  const { showToast, addAuditLog } = useApp();
  const [cases, setCases] = useState<ModerationCase[]>(() => {
    const stored = localStorage.getItem('evalai_moderation');
    return stored ? JSON.parse(stored) : MOCK_MODERATION_CASES;
  });
  const [selectedCase, setSelectedCase] = useState<ModerationCase | null>(null);
  const [finalMarks, setFinalMarks] = useState<number | ''>('');
  const [reason, setReason] = useState('');
  const [keepChoice, setKeepChoice] = useState<'A' | 'B' | 'custom' | ''>('');

  const getCandidate = (id: string) => MOCK_CANDIDATES.find(c => c.id === id);
  const getScript = (id: string) => MOCK_SCRIPTS.find(s => s.id === id);

  const submitModeration = () => {
    if (!selectedCase || finalMarks === '' || !reason) return;
    const updated = cases.map(c =>
      c.id === selectedCase.id
        ? { ...c, status: 'completed' as const, finalMarks: Number(finalMarks), reason, resolvedAt: new Date().toISOString() }
        : c
    );
    setCases(updated);
    localStorage.setItem('evalai_moderation', JSON.stringify(updated));

    addAuditLog({
      userId: 'u3', userName: 'Dr. Vikram Singh',
      action: 'Finalized moderation',
      scriptId: getScript(selectedCase.scriptId)?.scriptCode,
      oldValue: `A:${selectedCase.examinerAMarks}, B:${selectedCase.examinerBMarks}`,
      newValue: String(finalMarks),
      details: `Moderation completed. Final marks: ${finalMarks}. Reason: ${reason}`,
    });
    showToast(`Moderation complete. Final score: ${finalMarks}/100`, 'success');
    setSelectedCase(null);
    setFinalMarks('');
    setReason('');
    setKeepChoice('');
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = { pending: 'badge-amber', under_review: 'badge-blue', completed: 'badge-green' };
    const label: Record<string, string> = { pending: 'Pending', under_review: 'Under Review', completed: 'Completed' };
    return <span className={`badge ${map[s]}`}>{label[s]}</span>;
  };

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 className="section-title">Moderation & Dispute Resolution Workflow</h1>
        <p className="section-subtitle">
          Independent peer review to reconcile marking variance between Examiners A & B
        </p>
      </div>

      {/* Multi-color KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { label: 'Pending Moderation', val: cases.filter(c => c.status === 'pending').length, color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
          { label: 'Under Review', val: cases.filter(c => c.status === 'under_review').length, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
          { label: 'Moderation Completed', val: cases.filter(c => c.status === 'completed').length, color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
        ].map(s => (
          <div
            key={s.label}
            className="kpi-card"
            style={{
              '--accent-color': s.color,
              border: `1px solid ${s.border}`,
            } as React.CSSProperties}
          >
            <div style={{ fontSize: 30, fontWeight: 800, color: '#0f172a' }}>{s.val}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: s.color, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Cases list & Decision Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedCase ? '1fr 1fr' : '1fr', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {cases.map(mc => {
            const candidate = getCandidate(mc.candidateId);
            const script = getScript(mc.scriptId);
            const isSelected = selectedCase?.id === mc.id;

            return (
              <div
                key={mc.id}
                className="card-solid"
                style={{
                  padding: 20, cursor: 'pointer',
                  border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                  boxShadow: isSelected ? '0 4px 12px rgba(37,99,235,0.1)' : '0 1px 3px rgba(0,0,0,0.04)',
                }}
                onClick={() => {
                  setSelectedCase(mc);
                  setFinalMarks(Math.round((mc.examinerAMarks + mc.examinerBMarks) / 2));
                  setReason('');
                  setKeepChoice('');
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <span style={{ color: '#2563eb', fontSize: 12, fontWeight: 700, fontFamily: 'monospace' }}>
                      {script?.scriptCode}
                    </span>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginTop: 2 }}>{candidate?.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{candidate?.enrollmentNo}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ textAlign: 'center', background: '#f8fafc', padding: '4px 10px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>DIFFERENCE</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: mc.difference >= 15 ? '#e11d48' : '#d97706' }}>
                        Δ {mc.difference}
                      </div>
                    </div>
                    {statusBadge(mc.status)}
                  </div>
                </div>

                {/* Multi-color Examiner comparison boxes */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ flex: 1, padding: '12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#1d4ed8', fontWeight: 700, marginBottom: 2 }}>EXAMINER A</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#1e3a8a' }}>{mc.examinerAMarks}</div>
                    <div style={{ fontSize: 10.5, color: '#64748b' }}>out of 100</div>
                  </div>

                  <div style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8' }}>VS</div>

                  <div style={{ flex: 1, padding: '12px', background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 8, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#6d28d9', fontWeight: 700, marginBottom: 2 }}>EXAMINER B</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#4c1d95' }}>{mc.examinerBMarks}</div>
                    <div style={{ fontSize: 10.5, color: '#64748b' }}>out of 100</div>
                  </div>

                  {mc.status === 'completed' && mc.finalMarks !== undefined && (
                    <>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#059669' }}>→</div>
                      <div style={{ flex: 1, padding: '12px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, textAlign: 'center' }}>
                        <div style={{ fontSize: 11, color: '#047857', fontWeight: 700, marginBottom: 2 }}>FINAL SCORE</div>
                        <div style={{ fontSize: 24, fontWeight: 800, color: '#064e3b' }}>{mc.finalMarks}</div>
                        <div style={{ fontSize: 10.5, color: '#059669' }}>moderated</div>
                      </div>
                    </>
                  )}
                </div>

                <div style={{ marginTop: 12, fontSize: 12, color: '#64748b', display: 'flex', gap: 6, alignItems: 'center' }}>
                  <AlertTriangle size={13} color={mc.difference >= 15 ? '#e11d48' : '#d97706'} />
                  <span style={{ fontWeight: 600, color: mc.difference >= 15 ? '#be123c' : '#b45309' }}>
                    {mc.difference >= 15 ? 'High Variance (≥15 marks)' : 'Moderate Variance'}
                  </span>
                  <span>· Logged on {new Date(mc.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Moderation Decision Form - Clean White Card */}
        {selectedCase && (
          <div className="card-solid" style={{ padding: 24, position: 'sticky', top: 20, height: 'fit-content' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Scale size={18} color="#2563eb" />
              <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>Moderate Answer Script</span>
            </div>

            {/* Comparison Details */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Discrepancy Breakdown
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { label: 'Examiner A Marks', val: selectedCase.examinerAMarks, color: '#2563eb', bg: '#eff6ff' },
                  { label: 'Examiner B Marks', val: selectedCase.examinerBMarks, color: '#7c3aed', bg: '#f5f3ff' },
                  { label: 'Difference', val: `Δ ${selectedCase.difference}`, color: '#d97706', bg: '#fffbeb' },
                  { label: 'Statistical Mean', val: Math.round((selectedCase.examinerAMarks + selectedCase.examinerBMarks) / 2), color: '#0891b2', bg: '#ecfeff' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 14px', background: item.bg, borderRadius: 8 }}>
                    <span style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>{item.label}</span>
                    <span style={{ fontSize: 13.5, fontWeight: 800, color: item.color }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedCase.status !== 'completed' && (
              <>
                {/* Decision options */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Quick Choice
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      { key: 'A', label: `Keep A (${selectedCase.examinerAMarks})`, val: selectedCase.examinerAMarks },
                      { key: 'B', label: `Keep B (${selectedCase.examinerBMarks})`, val: selectedCase.examinerBMarks },
                      { key: 'custom', label: 'Average / Custom', val: Math.round((selectedCase.examinerAMarks + selectedCase.examinerBMarks) / 2) },
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => {
                          setKeepChoice(opt.key as 'A' | 'B' | 'custom');
                          if (opt.val !== null) setFinalMarks(opt.val);
                        }}
                        style={{
                          flex: 1, padding: '9px 8px', borderRadius: 8, cursor: 'pointer',
                          background: keepChoice === opt.key ? '#eff6ff' : '#ffffff',
                          color: keepChoice === opt.key ? '#1d4ed8' : '#475569',
                          border: `1.5px solid ${keepChoice === opt.key ? '#2563eb' : '#cbd5e1'}`,
                          fontSize: 12, fontWeight: 700, transition: 'all 0.15s ease',
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Final marks input */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 11.5, color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    FINAL MODERATED SCORE
                  </label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="number"
                      min={0} max={100}
                      value={finalMarks}
                      onChange={e => setFinalMarks(Number(e.target.value))}
                      className="form-input"
                      style={{ width: 88, textAlign: 'center', fontSize: 22, fontWeight: 800, height: 46 }}
                    />
                    <span style={{ fontSize: 16, color: '#64748b', fontWeight: 700 }}>/ 100</span>
                  </div>
                </div>

                {/* Reason */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 11.5, color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    JUSTIFICATION / AUDIT REASON (REQUIRED)
                  </label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="Provide academic justification for the moderated marks..."
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%', fontSize: 14, padding: '12px', background: '#2563eb' }}
                  onClick={submitModeration}
                  disabled={finalMarks === '' || !reason}
                >
                  <CheckCircle size={16} /> Finalize Moderated Result
                </button>
              </>
            )}

            {selectedCase.status === 'completed' && (
              <div style={{ padding: '16px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <CheckCircle size={18} color="#059669" />
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#047857' }}>Moderation Resolved</span>
                </div>
                <div style={{ fontSize: 13.5, color: '#334155' }}>
                  Final Score: <strong style={{ color: '#0f172a', fontSize: 16 }}>{selectedCase.finalMarks}/100</strong>
                </div>
                <div style={{ fontSize: 12.5, color: '#64748b', marginTop: 4 }}>
                  Reason: {selectedCase.reason}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
