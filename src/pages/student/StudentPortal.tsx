import React, { useState } from 'react';
import { STUDENT_RESULTS } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChevronDown, ChevronUp, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function StudentPortal() {
  const { showToast } = useApp();
  const studentData = STUDENT_RESULTS['24CSE1045'];
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [showRevalForm, setShowRevalForm] = useState(false);
  const [revalSubject, setRevalSubject] = useState('');
  const [revalQ, setRevalQ] = useState('');
  const [revalReason, setRevalReason] = useState('');

  const gradeColors: Record<string, string> = {
    'O': '#10b981', 'A+': '#10b981', 'A': '#3b82f6', 'B+': '#06b6d4',
    'B': '#f59e0b', 'C': '#f59e0b', 'F': '#ef4444',
  };

  const chartData = studentData.subjects.map(s => ({
    name: s.name.split(' ').slice(0, 2).join(' '),
    marks: s.marks,
    max: s.maxMarks,
  }));

  const submitRevaluation = () => {
    if (!revalSubject || !revalQ || !revalReason) return;
    showToast('Revaluation request submitted successfully!', 'success');
    setShowRevalForm(false);
    setRevalSubject('');
    setRevalQ('');
    setRevalReason('');
  };

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900, margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{
        padding: '24px', borderRadius: 14,
        background: 'linear-gradient(135deg, rgba(41,82,163,0.2) 0%, rgba(6,182,212,0.08) 100%)',
        border: '1px solid rgba(59,130,246,0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg, #2952a3, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 800, color: 'white',
            }}>S</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#f0f4ff', letterSpacing: '-0.02em' }}>Shiva Soni</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>Enrollment: 24CSE1045</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>B.Tech CSE · Semester 4 · 2025-2026</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#f0f4ff', letterSpacing: '-0.03em' }}>{studentData.overall}%</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Overall Percentage</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#34d399' }}>{studentData.grade}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Grade</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#60a5fa' }}>#{studentData.rank}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Rank / {studentData.totalStudents.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card-solid" style={{ padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f4ff', marginBottom: 14 }}>Subject Performance</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="name" stroke="#475569" fontSize={10} />
            <YAxis domain={[0, 100]} stroke="#475569" fontSize={10} />
            <Tooltip
              contentStyle={{ background: '#0d1f3c', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
              formatter={(v) => [`${v}/100`, 'Marks']}
            />
            <Bar dataKey="marks" fill="#3b82f6" radius={[4, 4, 0, 0]} opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Subject breakdown */}
      {studentData.subjects.map(subject => (
        <div key={subject.code} className="card-solid" style={{ overflow: 'hidden' }}>
          <div
            style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
            onClick={() => setExpandedSubject(expandedSubject === subject.code ? null : subject.code)}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#f0f4ff' }}>{subject.name}</span>
                <span className="mono" style={{ fontSize: 11, color: '#475569' }}>{subject.code}</span>
              </div>
              <div className="progress-bar" style={{ width: 200, height: 4 }}>
                <div className="progress-fill" style={{ width: `${subject.marks}%`, background: '#3b82f6' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#f0f4ff' }}>{subject.marks}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>out of {subject.maxMarks}</div>
              </div>
              <span style={{
                fontSize: 16, fontWeight: 800, width: 36, textAlign: 'center',
                color: gradeColors[subject.grade] || '#94a3b8',
              }}>{subject.grade}</span>
              {expandedSubject === subject.code ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
            </div>
          </div>

          {/* Expanded detail */}
          {expandedSubject === subject.code && (
            <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ paddingTop: 16, marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Question-Wise Marks
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {subject.questionwise.map((marks, i) => (
                    <div key={i} style={{
                      flex: 1, padding: '10px 6px', textAlign: 'center', borderRadius: 8,
                      background: marks === 0 ? 'rgba(239,68,68,0.1)' : marks >= 8 ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${marks === 0 ? 'rgba(239,68,68,0.2)' : marks >= 8 ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)'}`,
                    }}>
                      <div style={{ fontSize: 10, color: '#475569' }}>Q{i + 1}</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: marks === 0 ? '#f87171' : marks >= 8 ? '#34d399' : '#f0f4ff' }}>
                        {marks}
                      </div>
                      <div style={{ fontSize: 9, color: '#475569' }}>/10</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-secondary" style={{ fontSize: 12 }}>
                  📄 View Detailed Result
                </button>
                <button
                  className="btn btn-amber"
                  style={{ fontSize: 12 }}
                  onClick={() => { setShowRevalForm(true); setRevalSubject(subject.name); }}
                >
                  Request Revaluation
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Revaluation form */}
      {showRevalForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card-solid" style={{ padding: 28, width: 460, maxWidth: '90vw' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f0f4ff', marginBottom: 20 }}>Request Revaluation</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 5 }}>SUBJECT</label>
                <input className="form-input" value={revalSubject} onChange={e => setRevalSubject(e.target.value)} placeholder="Subject name" />
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 5 }}>QUESTION NUMBER</label>
                <input className="form-input" value={revalQ} onChange={e => setRevalQ(e.target.value)} placeholder="e.g. Q3, Q7" />
              </div>
              <div>
                <label style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 5 }}>REASON FOR REVALUATION</label>
                <textarea
                  className="form-input" rows={4}
                  value={revalReason} onChange={e => setRevalReason(e.target.value)}
                  placeholder="Please explain why you believe your answer deserves more marks..."
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={submitRevaluation}>
                  <Send size={13} /> Submit Request
                </button>
                <button className="btn btn-secondary" onClick={() => setShowRevalForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
