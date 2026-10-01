import React, { useState } from 'react';
import { EXAMINER_PERFORMANCE } from '../../data/mockData';
import { ArrowUpDown, AlertTriangle, Users } from 'lucide-react';

export default function ExaminersPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const selectedExaminer = EXAMINER_PERFORMANCE.find(e => e.examinerId === selected);

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 className="section-title">Examiner Performance & Consistency Index</h1>
        <p className="section-subtitle">
          Monitor grading velocity, variance standard deviation, and human-AI rubric agreement rates
        </p>
      </div>

      {/* Multi-Color KPI Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { label: 'Registered Examiners', val: EXAMINER_PERFORMANCE.length, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
          { label: 'Avg AI Rubric Agreement', val: `${Math.round(EXAMINER_PERFORMANCE.reduce((s, e) => s + e.aiAcceptanceRate, 0) / EXAMINER_PERFORMANCE.length)}%`, color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
          { label: 'Scripts Evaluated', val: EXAMINER_PERFORMANCE.reduce((s, e) => s + e.scriptsEvaluated, 0).toLocaleString(), color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc' },
          { label: 'Flagged Anomalies', val: EXAMINER_PERFORMANCE.reduce((s, e) => s + e.flagCount, 0), color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
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

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: 16 }}>
        {/* Table - Clean White */}
        <div className="card-solid" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Examiner Roster</span>
            <span style={{ fontSize: 12, color: '#64748b' }}>Click any examiner row for detailed rubric analytics</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                {[
                  { key: 'examinerId', label: 'ID' },
                  { key: 'examinerName', label: 'Examiner Name' },
                  { key: 'scriptsEvaluated', label: 'Scripts' },
                  { key: 'avgScore', label: 'Avg Award' },
                  { key: 'avgTimeMinutes', label: 'Speed' },
                  { key: 'aiAcceptanceRate', label: 'AI Agreement' },
                  { key: 'scoreDeviation', label: 'Variance' },
                  { key: 'flagCount', label: 'Flags' },
                ].map(col => (
                  <th key={col.key} onClick={() => handleSort(col.key)} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {col.label}
                      <ArrowUpDown size={11} opacity={0.5} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EXAMINER_PERFORMANCE.map(e => (
                <tr
                  key={e.examinerId}
                  onClick={() => setSelected(selected === e.examinerId ? null : e.examinerId)}
                  style={{
                    cursor: 'pointer',
                    background: selected === e.examinerId ? '#eff6ff' : undefined,
                  }}
                >
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#2563eb' }}>{e.examinerId}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{e.examinerName}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{e.scriptsEvaluated}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar" style={{ width: 50, height: 6 }}>
                        <div className="progress-fill" style={{ width: `${e.avgScore}%`, background: '#2563eb' }} />
                      </div>
                      <span style={{ fontWeight: 700, color: '#334155' }}>{e.avgScore}%</span>
                    </div>
                  </td>
                  <td style={{ color: '#475569' }}>{e.avgTimeMinutes}m / script</td>
                  <td>
                    <span style={{
                      fontWeight: 700,
                      color: e.aiAcceptanceRate >= 85 ? '#047857' : e.aiAcceptanceRate >= 75 ? '#1d4ed8' : '#b45309',
                    }}>
                      {e.aiAcceptanceRate}%
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${e.scoreDeviation === 'Low' ? 'badge-green' : e.scoreDeviation === 'Moderate' ? 'badge-amber' : 'badge-red'}`}>
                      {e.scoreDeviation}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: e.flagCount > 5 ? '#d97706' : '#64748b' }}>
                      {e.flagCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail panel - Clean White */}
        {selectedExaminer && (
          <div className="card-solid" style={{ padding: 22, height: 'fit-content' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: '#eff6ff', border: '1px solid #bfdbfe',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 800, color: '#2563eb',
              }}>
                {selectedExaminer.examinerName.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{selectedExaminer.examinerName}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{selectedExaminer.examinerId} · Authorized Senior Examiner</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Scripts Evaluated', val: selectedExaminer.scriptsEvaluated },
                { label: 'Mean Score Awarded', val: `${selectedExaminer.avgScore}%` },
                { label: 'Mean Velocity / Script', val: `${selectedExaminer.avgTimeMinutes} min` },
                { label: 'AI Acceptance Rate', val: `${selectedExaminer.aiAcceptanceRate}%` },
                { label: 'Rubric Deviation', val: selectedExaminer.scoreDeviation },
                { label: 'Scripts Flagged', val: selectedExaminer.flagCount },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 12px', background: '#f8fafc', borderRadius: 8 }}>
                  <span style={{ fontSize: 12.5, color: '#64748b' }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{item.val}</span>
                </div>
              ))}
            </div>

            {selectedExaminer.examinerId === 'E104' && (
              <div style={{ marginTop: 16, padding: '12px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#b45309', marginBottom: 4 }}>⚠ Performance Alert</div>
                <div style={{ fontSize: 12, color: '#92400e', lineHeight: 1.5 }}>
                  This examiner shows moderate score deviation from subject average and lower AI acceptance rate. Recommended for 10% spot moderation.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
