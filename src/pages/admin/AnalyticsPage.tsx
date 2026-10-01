import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  AreaChart, Area, LineChart, Line, Cell
} from 'recharts';
import { LEARNING_OUTCOMES } from '../../data/mockData';
import { TrendingUp, Award, Target } from 'lucide-react';

const scoreDistData = [
  { range: '0-20', count: 124, fill: '#ef4444' },
  { range: '21-40', count: 387, fill: '#f59e0b' },
  { range: '41-50', count: 892, fill: '#f59e0b' },
  { range: '51-60', count: 2140, fill: '#3b82f6' },
  { range: '61-70', count: 3284, fill: '#3b82f6' },
  { range: '71-80', count: 2891, fill: '#10b981' },
  { range: '81-90', count: 1542, fill: '#10b981' },
  { range: '91-100', count: 582, fill: '#10b981' },
];

const subjectPerf = [
  { subject: 'OS', avg: 72, pass: 84 },
  { subject: 'DBMS', avg: 76, pass: 88 },
  { subject: 'CN', avg: 74, pass: 86 },
  { subject: 'DS', avg: 68, pass: 79 },
  { subject: 'TOC', avg: 61, pass: 71 },
];

const questionAvgData = [
  { q: 'Q1', avg: 8.2, max: 10 }, { q: 'Q2', avg: 7.4, max: 10 },
  { q: 'Q3', avg: 4.1, max: 10 }, { q: 'Q4', avg: 6.8, max: 10 },
  { q: 'Q5', avg: 2.9, max: 10 }, { q: 'Q6', avg: 5.6, max: 10 },
  { q: 'Q7', avg: 3.8, max: 10 }, { q: 'Q8', avg: 6.3, max: 10 },
  { q: 'Q9', avg: 7.7, max: 10 }, { q: 'Q10', avg: 7.1, max: 10 },
];

const examinerConsistency = [
  { name: 'E101', score: 92 }, { name: 'E102', score: 87 },
  { name: 'E103', score: 94 }, { name: 'E104', score: 71 },
  { name: 'E105', score: 96 },
];

const tooltipStyle = {
  background: '#0d1f3c', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, fontSize: 12, color: '#94a3b8',
};

export default function AnalyticsPage() {
  const highestScore = 98;
  const lowestScore = 12;
  const avgScore = 72.4;
  const passRate = 84.2;
  const medianScore = 74;

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 className="section-title">Analytics Dashboard</h1>
        <p className="section-subtitle">Examination performance analytics · Operating Systems · CSE-OS-2026</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
        {[
          { label: 'Average Score', val: avgScore.toFixed(1), icon: '📊', color: '#3b82f6' },
          { label: 'Pass Rate', val: `${passRate}%`, icon: '✅', color: '#10b981' },
          { label: 'Median Score', val: medianScore, icon: '📈', color: '#06b6d4' },
          { label: 'Highest Score', val: highestScore, icon: '🏆', color: '#f59e0b' },
          { label: 'Lowest Score', val: lowestScore, icon: '📉', color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="kpi-card">
            <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#f0f4ff' }}>{s.val}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Score distribution + subject performance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card-solid" style={{ padding: 20 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f4ff' }}>Score Distribution</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Number of candidates per score range</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={scoreDistData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="range" stroke="#475569" fontSize={10} />
              <YAxis stroke="#475569" fontSize={10} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                {scoreDistData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} opacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card-solid" style={{ padding: 20 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f4ff' }}>Subject Performance</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Average and pass rate by subject</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={subjectPerf} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="subject" stroke="#475569" fontSize={10} />
              <YAxis stroke="#475569" fontSize={10} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="avg" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Average" opacity={0.85} />
              <Bar dataKey="pass" fill="#10b981" radius={[3, 3, 0, 0]} name="Pass Rate %" opacity={0.7} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Question-wise avg marks */}
      <div className="card-solid" style={{ padding: 20 }}>
        <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f4ff' }}>Question-Wise Average Marks</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Average marks obtained per question (out of 10)</div>
          </div>
          <div style={{ fontSize: 11.5, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Target size={13} />
            Q5 and Q7 are most difficult
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={questionAvgData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="q" stroke="#475569" fontSize={11} />
            <YAxis domain={[0, 10]} stroke="#475569" fontSize={11} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v, 'Avg Marks']} />
            <Bar dataKey="avg" radius={[3, 3, 0, 0]}>
              {questionAvgData.map((entry, i) => (
                <Cell key={i} fill={entry.avg < 4 ? '#ef4444' : entry.avg < 6 ? '#f59e0b' : '#3b82f6'} opacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#ef4444', display: 'inline-block' }} /><span style={{ fontSize: 11, color: '#64748b' }}>Hard (avg &lt; 4)</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#f59e0b', display: 'inline-block' }} /><span style={{ fontSize: 11, color: '#64748b' }}>Medium (4–6)</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: '#3b82f6', display: 'inline-block' }} /><span style={{ fontSize: 11, color: '#64748b' }}>Easy (&gt; 6)</span></div>
        </div>
      </div>

      {/* Examiner consistency + Learning outcomes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card-solid" style={{ padding: 20 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f4ff' }}>Examiner Consistency Score</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>AI-assessed marking consistency (higher is better)</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {examinerConsistency.map(e => (
              <div key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', width: 36 }}>{e.name}</span>
                <div className="progress-bar" style={{ flex: 1 }}>
                  <div className="progress-fill" style={{
                    width: `${e.score}%`,
                    background: e.score >= 90 ? '#10b981' : e.score >= 80 ? '#3b82f6' : '#f59e0b',
                  }} />
                </div>
                <span style={{
                  fontSize: 13, fontWeight: 700,
                  color: e.score >= 90 ? '#34d399' : e.score >= 80 ? '#60a5fa' : '#fbbf24',
                  width: 36, textAlign: 'right',
                }}>
                  {e.score}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Learning outcomes */}
        <div className="card-solid" style={{ padding: 20 }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f4ff' }}>AI-Inferred Learning Outcome Insights</div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>Analytical estimates — not definitive student diagnoses</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {LEARNING_OUTCOMES.map(lo => (
              <div key={lo.topic}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12.5, color: '#94a3b8' }}>{lo.topic}</span>
                  <span style={{
                    fontSize: 12.5, fontWeight: 700,
                    color: lo.masteryPercent >= 80 ? '#34d399' : lo.masteryPercent >= 60 ? '#60a5fa' : '#fbbf24',
                  }}>{lo.masteryPercent}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width: `${lo.masteryPercent}%`,
                    background: lo.masteryPercent >= 80 ? 'linear-gradient(90deg, #059669, #10b981)' :
                      lo.masteryPercent >= 60 ? 'linear-gradient(90deg, #2952a3, #3b82f6)' :
                      'linear-gradient(90deg, #92400e, #f59e0b)',
                  }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: '8px 12px', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 6 }}>
            <div style={{ fontSize: 11, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
              <TrendingUp size={12} color="#3b82f6" />
              Memory Management shows lowest mastery (48%) — may need curriculum review
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
