import React, { useState } from 'react';
import { MOCK_SCRIPTS, MOCK_CANDIDATES, INITIAL_EVALUATION } from '../../data/mockData';
import { Brain, Eye, CheckCircle, AlertTriangle, Clock, ArrowRight } from 'lucide-react';

interface Props { onNavigate: (page: string, data?: { scriptId?: string }) => void; }

export default function AIEvaluationPage({ onNavigate }: Props) {
  const [selectedScript, setSelectedScript] = useState<string | null>(null);
  const processedScripts = MOCK_SCRIPTS.filter(s => s.aiProcessed);

  const getCandidate = (id: string) => MOCK_CANDIDATES.find(c => c.id === id);

  const statusBadge = (s: string) => {
    const map: Record<string, { cls: string; label: string }> = {
      ai_evaluated: { cls: 'badge-blue', label: 'AI Evaluated' },
      examiner_verified: { cls: 'badge-green', label: 'Verified' },
      moderation: { cls: 'badge-purple', label: 'Moderation' },
      finalized: { cls: 'badge-green', label: 'Finalized' },
    };
    const d = map[s] || { cls: 'badge-gray', label: s };
    return <span className={`badge ${d.cls}`}>{d.label}</span>;
  };

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="section-title">AI Evaluation Dashboard</h1>
          <p className="section-subtitle">Review AI-processed scripts, confidence scores, and evaluation summaries</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ padding: '8px 14px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, fontSize: 12, color: '#34d399', fontWeight: 600 }}>
            <Brain size={12} style={{ marginRight: 5, display: 'inline' }} />
            AI Notice: Scores are suggestions only
          </div>
        </div>
      </div>

      {/* AI Transparency notice */}
      <div style={{ padding: '12px 18px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
        <AlertTriangle size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: 13, color: '#fbbf24' }}>
          <strong>AI Transparency:</strong> All scores below are <em>AI Suggested Scores</em>. Authorized examiners must verify each evaluation before finalization. AI confidence levels indicate certainty, not correctness.
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'AI Evaluated', value: processedScripts.length, icon: '🤖', color: '#3b82f6' },
          { label: 'Avg. Confidence', value: '89%', icon: '📊', color: '#10b981' },
          { label: 'Flagged', value: '1', icon: '⚠️', color: '#f59e0b' },
          { label: 'Awaiting Examiner', value: processedScripts.filter(s => s.status === 'ai_evaluated').length, icon: '⏳', color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} className="kpi-card">
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#f0f4ff' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Scripts table */}
      <div className="card-solid" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#f0f4ff' }}>AI-Processed Scripts</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <select className="form-input" style={{ height: 32, padding: '0 10px', fontSize: 12, width: 'auto' }}>
              <option>All Status</option>
              <option>AI Evaluated</option>
              <option>Verified</option>
            </select>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Script ID</th>
              <th>Candidate</th>
              <th>AI Score</th>
              <th>Confidence</th>
              <th>Flags</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {processedScripts.map(script => {
              const candidate = getCandidate(script.candidateId);
              const eval_ = script.id === 's1' ? INITIAL_EVALUATION : null;
              const aiMarks = eval_?.aiTotalMarks || Math.floor(55 + Math.random() * 35);
              const confidence = eval_?.aiConfidenceAvg || Math.floor(78 + Math.random() * 18);
              const hasFlaggedQ = eval_ ? eval_.questionEvaluations.some(q => q.status === 'flagged') : Math.random() > 0.85;

              return (
                <tr key={script.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedScript(script.id)}>
                  <td><span className="mono" style={{ color: '#60a5fa' }}>{script.scriptCode}</span></td>
                  <td>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{candidate?.name}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{candidate?.enrollmentNo}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#f0f4ff' }}>{aiMarks}</span>
                    <span style={{ fontSize: 11, color: '#64748b' }}>/100</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar" style={{ width: 60 }}>
                        <div className="progress-fill" style={{
                          width: `${confidence}%`,
                          background: confidence > 85 ? '#10b981' : confidence > 70 ? '#f59e0b' : '#ef4444',
                        }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: confidence > 85 ? '#34d399' : '#fbbf24' }}>{confidence}%</span>
                    </div>
                  </td>
                  <td>
                    {hasFlaggedQ ? (
                      <span className="badge badge-amber"><AlertTriangle size={10} style={{ marginRight: 3 }} />1 Flag</span>
                    ) : (
                      <span className="badge badge-green">Clean</span>
                    )}
                  </td>
                  <td>{statusBadge(script.status)}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      style={{ fontSize: 11, padding: '5px 10px' }}
                      onClick={(e) => { e.stopPropagation(); onNavigate('osm', { scriptId: script.id }); }}
                    >
                      <Eye size={11} /> Review
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail panel */}
      {selectedScript && selectedScript === 's1' && (
        <div className="card-solid" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#f0f4ff' }}>Candidate Performance Summary</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Script: OS-2026-001045 · Shiva Soni · 24CSE1045</div>
            </div>
            <button className="btn btn-primary" onClick={() => onNavigate('osm', { scriptId: 's1' })}>
              Open OSM Workspace <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#10b981', marginBottom: 8 }}>Strong Areas</div>
              {['CPU Scheduling', 'Process Management', 'Disk Scheduling'].map(a => (
                <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <CheckCircle size={13} color="#10b981" />
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>{a}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#f59e0b', marginBottom: 8 }}>Weak Areas</div>
              {['Memory Management', 'File Systems'].map(a => (
                <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <AlertTriangle size={13} color="#f59e0b" />
                  <span style={{ fontSize: 13, color: '#94a3b8' }}>{a}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="divider" />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#f0f4ff' }}>78</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>AI Suggested Score</div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#34d399' }}>89%</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>AI Confidence</div>
            </div>
            <div style={{ textAlign: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#fbbf24' }}>1</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>Flag(s) Raised</div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>Question-wise AI Scores</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {INITIAL_EVALUATION.questionEvaluations.map(q => (
                <div key={q.questionId} style={{
                  flex: 1, padding: '8px 4px', textAlign: 'center', borderRadius: 6,
                  background: q.status === 'flagged' ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${q.status === 'flagged' ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.06)'}`,
                }}>
                  <div style={{ fontSize: 10, color: '#475569' }}>Q{q.questionNumber}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: q.status === 'flagged' ? '#fbbf24' : '#f0f4ff' }}>
                    {q.aiSuggestedMarks}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
