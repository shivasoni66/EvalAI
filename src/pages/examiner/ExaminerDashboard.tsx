import React, { useState } from 'react';
import { MOCK_SCRIPTS, INITIAL_EVALUATION } from '../../data/mockData';
import { ClipboardList, Clock, Brain, CheckCircle, AlertTriangle } from 'lucide-react';

interface Props { onNavigate: (page: string, data?: { scriptId?: string }) => void; }

const PENDING_SCRIPTS = [
  { id: 's2', code: 'OS-00124', candidate: 'Priya Patel', enrollment: '24CSE1046', aiMarks: 82, confidence: 87, pages: 7 },
  { id: 's5', code: 'OS-00125', candidate: 'Rahul Verma', enrollment: '24CSE1049', aiMarks: 71, confidence: 92, pages: 6 },
  { id: 's6', code: 'OS-00126', candidate: 'Anjali Singh', enrollment: '24CSE1050', aiMarks: 66, confidence: 79, pages: 8 },
  { id: 's9', code: 'OS-00127', candidate: 'Mohit Yadav', enrollment: '24CSE1053', aiMarks: 74, confidence: 85, pages: 8 },
  { id: 's11', code: 'OS-00128', candidate: 'Vikash Kumar', enrollment: '24CSE1055', aiMarks: 58, confidence: 82, pages: 6 },
];

export default function ExaminerDashboard({ onNavigate }: Props) {
  const totalAssigned = 84;
  const completed = 61;
  const pending = 23;

  const eval_ = INITIAL_EVALUATION;
  const examinerSoFar = eval_.questionEvaluations.reduce((s, q) => s + (q.examinerMarks !== null ? q.examinerMarks : 0), 0);
  const verifiedCount = eval_.questionEvaluations.filter(q => q.examinerMarks !== null).length;

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 className="section-title">Examiner Dashboard</h1>
        <p className="section-subtitle">Prof. Anita Sharma · Operating Systems Examiner · E101</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Assigned Scripts', val: totalAssigned, color: '#3b82f6', icon: '📋' },
          { label: 'Completed', val: completed, color: '#10b981', icon: '✅' },
          { label: 'Pending', val: pending, color: '#f59e0b', icon: '⏳' },
          { label: 'AI Acceptance Rate', val: '84%', color: '#8b5cf6', icon: '🤖' },
        ].map(s => (
          <div key={s.label} className="kpi-card" style={{ '--accent-color': s.color } as React.CSSProperties}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#f0f4ff' }}>{s.val}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Secondary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { label: 'Avg Time / Script', val: '4m 12s', icon: <Clock size={14} color="#06b6d4" /> },
          { label: 'Manual Corrections', val: '23', icon: <ClipboardList size={14} color="#8b5cf6" /> },
          { label: 'Scripts Flagged', val: '3', icon: <AlertTriangle size={14} color="#f59e0b" /> },
        ].map(s => (
          <div key={s.label} className="card-solid" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#f0f4ff' }}>{s.val}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
            </div>
            {s.icon}
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="card-solid" style={{ padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: '#f0f4ff' }}>Today's Progress</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#60a5fa' }}>{completed}/{totalAssigned}</span>
        </div>
        <div className="progress-bar" style={{ height: 8 }}>
          <div className="progress-fill" style={{ width: `${(completed / totalAssigned) * 100}%`, background: 'linear-gradient(90deg, #2952a3, #10b981)' }} />
        </div>
        <div style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>72.6% complete · Est. completion: ~2h 15m</div>
      </div>

      {/* Current script in progress */}
      <div className="card-solid" style={{ padding: 20, border: '1px solid rgba(59,130,246,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, color: '#475569', fontWeight: 600, marginBottom: 4 }}>CURRENT IN PROGRESS</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#f0f4ff' }}>Script: OS-2026-001045 · Shiva Soni</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>24CSE1045 · {verifiedCount}/10 questions verified</div>
          </div>
          <button className="btn btn-primary" onClick={() => onNavigate('osm', { scriptId: 's1' })}>
            Continue Marking →
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {eval_.questionEvaluations.map((qe, i) => (
            <div key={i} style={{
              flex: 1, padding: '8px 4px', textAlign: 'center', borderRadius: 6,
              background: qe.status === 'flagged' ? 'rgba(245,158,11,0.1)' : qe.examinerMarks !== null ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${qe.status === 'flagged' ? 'rgba(245,158,11,0.3)' : qe.examinerMarks !== null ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)'}`,
            }}>
              <div style={{ fontSize: 10, color: '#475569' }}>Q{i + 1}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: qe.status === 'flagged' ? '#fbbf24' : qe.examinerMarks !== null ? '#34d399' : '#64748b' }}>
                {qe.examinerMarks !== null ? qe.examinerMarks : qe.status === 'flagged' ? '⚠' : '—'}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
          <div style={{ fontSize: 12, color: '#64748b' }}>AI Total: <strong style={{ color: '#60a5fa' }}>{eval_.aiTotalMarks}/100</strong></div>
          <div style={{ fontSize: 12, color: '#64748b' }}>Examiner Running Total: <strong style={{ color: '#34d399' }}>{examinerSoFar}/100</strong></div>
        </div>
      </div>

      {/* Pending work */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f4ff', marginBottom: 12 }}>My Pending Work</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PENDING_SCRIPTS.map(script => (
            <div
              key={script.id}
              className="card-solid"
              style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
              onClick={() => onNavigate('osm', { scriptId: script.id })}
            >
              <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ClipboardList size={18} color="#60a5fa" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span className="mono" style={{ color: '#60a5fa', fontSize: 12 }}>{script.code}</span>
                  <span style={{ fontSize: 12, color: '#64748b' }}>·</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{script.candidate}</span>
                  <span style={{ fontSize: 11.5, color: '#64748b' }}>{script.enrollment}</span>
                </div>
                <div style={{ fontSize: 11.5, color: '#64748b', display: 'flex', gap: 10 }}>
                  <span>📄 {script.pages} pages</span>
                  <span>AI Score: {script.aiMarks}/100</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#475569', textAlign: 'right' }}>CONFIDENCE</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: script.confidence >= 85 ? '#34d399' : '#fbbf24' }}>
                    {script.confidence}%
                  </div>
                </div>
                <button className="btn btn-primary" style={{ fontSize: 12, padding: '7px 14px' }}>
                  Mark →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
