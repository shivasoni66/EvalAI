import React from 'react';
import {
  Users, FileText, CheckCircle, Clock, Brain, AlertTriangle, Timer, TrendingUp,
  Activity, ArrowUpRight, ClipboardList
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line
} from 'recharts';
import { MOCK_EXAM } from '../../data/mockData';

const evalProgressData = [
  { day: 'Apr 12', scripts: 0 }, { day: 'Apr 13', scripts: 1240 },
  { day: 'Apr 14', scripts: 3180 }, { day: 'Apr 15', scripts: 5640 },
  { day: 'Apr 16', scripts: 8420 }, { day: 'Apr 17', scripts: 10842 },
];

const marksDistData = [
  { range: '0-20', count: 124 }, { range: '21-40', count: 387 },
  { range: '41-50', count: 892 }, { range: '51-60', count: 2140 },
  { range: '61-70', count: 3284 }, { range: '71-80', count: 2891 },
  { range: '81-90', count: 1542 }, { range: '91-100', count: 582 },
];

const questionDiffData = [
  { q: 'Q1', pct: 82 }, { q: 'Q2', pct: 74 }, { q: 'Q3', pct: 41 },
  { q: 'Q4', pct: 68 }, { q: 'Q5', pct: 29 }, { q: 'Q6', pct: 56 },
  { q: 'Q7', pct: 38 }, { q: 'Q8', pct: 63 }, { q: 'Q9', pct: 77 }, { q: 'Q10', pct: 71 },
];

const examinerTrendData = [
  { day: 'Mon', E101: 62, E102: 58, E104: 71 },
  { day: 'Tue', E101: 74, E102: 63, E104: 68 },
  { day: 'Wed', E101: 58, E102: 72, E104: 82 },
  { day: 'Thu', E101: 81, E102: 69, E104: 74 },
  { day: 'Fri', E101: 76, E102: 74, E104: 79 },
];

const aiAgreementData = [
  { name: '< 1 mark diff', value: 6240, color: '#10b981' },
  { name: '1-2 marks diff', value: 2480, color: '#2563eb' },
  { name: '3-5 marks diff', value: 1620, color: '#d97706' },
  { name: '> 5 marks diff', value: 502, color: '#e11d48' },
];

const KPI_CARDS = [
  { label: 'Total Candidates', value: '12,480', icon: <Users size={18} />, color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', change: '+2.4%' },
  { label: 'Scripts Uploaded', value: '11,920', icon: <FileText size={18} />, color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc', change: '95.5%' },
  { label: 'Evaluated', value: '10,842', icon: <CheckCircle size={18} />, color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', change: '91%' },
  { label: 'Pending Evaluation', value: '1,078', icon: <Clock size={18} />, color: '#d97706', bg: '#fffbeb', border: '#fde68a', change: '9% left' },
  { label: 'AI-Assisted Marking', value: '9,640', icon: <Brain size={18} />, color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', change: '88.9%' },
  { label: 'Flagged for Review', value: '284', icon: <AlertTriangle size={18} />, color: '#e11d48', bg: '#fff1f2', border: '#fecdd3', change: '2.6%' },
  { label: 'Avg. Eval Time', value: '4m 18s', icon: <Timer size={18} />, color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe', change: '-12s' },
  { label: 'Marking Velocity', value: '91%', icon: <TrendingUp size={18} />, color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', change: 'On track' },
];

const RECENT_ACTIVITY = [
  { time: '14:32', text: 'Script #OS24-1045 evaluation submitted', type: 'success' },
  { time: '14:18', text: 'Examiner E104 changed Q3 marks: 6 → 8', type: 'info' },
  { time: '13:55', text: '12 scripts flagged for anomaly detection', type: 'warning' },
  { time: '13:40', text: 'Moderation request created: Subject CSE-301', type: 'info' },
  { time: '13:22', text: 'AI evaluation batch: 250 scripts processed', type: 'success' },
  { time: '12:58', text: 'Script OS-001245 result finalized', type: 'success' },
  { time: '12:30', text: 'Revaluation request: 24CSE1052 (Q4)', type: 'warning' },
];

interface Props {
  onNavigate: (page: string) => void;
}

const customTooltipStyle = {
  background: '#ffffff',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  fontSize: 12,
  color: '#0f172a',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
};

export default function AdminDashboard({ onNavigate }: Props) {
  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="section-title">Examination Evaluation Dashboard</h1>
          <p className="section-subtitle">
            Operating Systems · CSE-OS-2026 · B.Tech Semester 4 · April 2026 · On-Screen Marking Ecosystem
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className="badge badge-amber">Evaluation in Progress</span>
          <button className="btn btn-secondary" onClick={() => onNavigate('examinations')}>
            <Activity size={14} /> Exam Info
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate('osm')}>
            <ClipboardList size={14} /> Launch OSM Workspace
          </button>
        </div>
      </div>

      {/* Progress banner - Clean and vibrant */}
      <div style={{
        padding: '16px 20px', borderRadius: 12, border: '1px solid #bfdbfe',
        background: '#eff6ff',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1d4ed8' }}>Overall Evaluation Progress (OSM)</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>91% Completed · 10,842 / 11,920 scripts</span>
          </div>
          <div className="progress-bar" style={{ height: 9, background: '#dbeafe' }}>
            <div className="progress-fill" style={{ width: '91%', background: '#2563eb' }} />
          </div>
        </div>
      </div>

      {/* Multi-color KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        {KPI_CARDS.map(card => (
          <div
            key={card.label}
            className="kpi-card"
            style={{
              '--accent-color': card.color,
              border: `1px solid ${card.border}`,
            } as React.CSSProperties}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, background: card.bg,
                border: `1px solid ${card.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color,
              }}>
                {card.icon}
              </div>
              <span style={{
                fontSize: 11, fontWeight: 700, color: card.color,
                background: card.bg, padding: '2px 8px', borderRadius: 999,
                display: 'flex', alignItems: 'center', gap: 2, border: `1px solid ${card.border}`,
              }}>
                <ArrowUpRight size={12} /> {card.change}
              </span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>{card.value}</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: '#475569', marginTop: 3 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1: Progress Area & AI Agreement Donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Evaluation Progress Area */}
        <div className="card-solid" style={{ padding: 22 }}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Evaluation Progress Velocity</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Cumulative answer scripts evaluated over daily batches</div>
            </div>
            <span className="badge badge-blue">Real-time Sync</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={evalProgressData}>
              <defs>
                <linearGradient id="evalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Area type="monotone" dataKey="scripts" stroke="#2563eb" strokeWidth={2.5} fill="url(#evalGrad)" dot={{ fill: '#2563eb', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Agreement Donut */}
        <div className="card-solid" style={{ padding: 22 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>AI vs Human Consistency</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Examiner mark variation from AI baseline</div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={aiAgreementData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {aiAgreementData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={customTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
            {aiAgreementData.map(d => (
              <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
                  <span style={{ fontSize: 12, color: '#334155', fontWeight: 500 }}>{d.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{d.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2: Score distribution & Question Difficulty */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Marks Distribution */}
        <div className="card-solid" style={{ padding: 22 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Score Distribution</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Number of candidates across score brackets (0–100)</div>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={marksDistData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="range" stroke="#64748b" fontSize={10.5} />
              <YAxis stroke="#64748b" fontSize={10.5} />
              <Tooltip contentStyle={customTooltipStyle} />
              <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Question Difficulty */}
        <div className="card-solid" style={{ padding: 22 }}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Question-Wise Success Rate</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>% of candidates scoring ≥ 60% on each question</div>
            </div>
            <span className="badge badge-amber" style={{ fontSize: 10.5 }}>Q5 Outlier</span>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={questionDiffData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={10.5} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="q" stroke="#64748b" fontSize={10.5} width={28} />
              <Tooltip contentStyle={customTooltipStyle} formatter={(v) => [`${v}%`, 'Success Rate']} />
              <Bar dataKey="pct" radius={[0, 4, 4, 0]}>
                {questionDiffData.map((entry, i) => (
                  <Cell key={i} fill={entry.pct < 40 ? '#e11d48' : entry.pct < 60 ? '#d97706' : '#059669'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Examiner Trend Multi-line Chart */}
      <div className="card-solid" style={{ padding: 22 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Examiner Daily Velocity Comparison</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Number of scripts marked per day across examiners</div>
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: 11, fontWeight: 600 }}>
            <span style={{ color: '#2563eb' }}>● E101 (Prof. Sharma)</span>
            <span style={{ color: '#059669' }}>● E102 (Dr. Ghosh)</span>
            <span style={{ color: '#d97706' }}>● E104 (Prof. Saxena)</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={190}>
          <LineChart data={examinerTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} />
            <Tooltip contentStyle={customTooltipStyle} />
            <Line type="monotone" dataKey="E101" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4, fill: '#2563eb' }} name="E101 - Anita Sharma" />
            <Line type="monotone" dataKey="E102" stroke="#059669" strokeWidth={2.5} dot={{ r: 4, fill: '#059669' }} name="E102 - Pradeep Ghosh" />
            <Line type="monotone" dataKey="E104" stroke="#d97706" strokeWidth={2.5} dot={{ r: 4, fill: '#d97706' }} name="E104 - Arun Saxena" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Row: Recent Activity + Interactive Multi-color Action Hub */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recent Activity */}
        <div className="card-solid" style={{ padding: 22 }}>
          <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Live OSM Audit Feed</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Real-time evaluation events</div>
            </div>
            <button className="btn btn-secondary" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => onNavigate('audit')}>
              Full Logs
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '11px 0', borderBottom: i < RECENT_ACTIVITY.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                  background: item.type === 'success' ? '#059669' : item.type === 'warning' ? '#d97706' : '#2563eb',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: '#1e293b', fontWeight: 500 }}>{item.text}</div>
                  <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{item.time} today · Verified</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Multi-Color Action Hub */}
        <div className="card-solid" style={{ padding: 22 }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>OSM Quick Actions</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Primary operations for examination lifecycle</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {[
              { label: 'OSM Workspace', icon: '📝', page: 'osm', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', desc: 'Grade answer scripts' },
              { label: 'Upload & Scan', icon: '📤', page: 'upload', color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc', desc: 'OCR ingestion' },
              { label: 'AI Evaluation', icon: '🤖', page: 'ai-evaluation', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', desc: 'Batch suggestions' },
              { label: 'Moderation Hub', icon: '⚖️', page: 'moderation', color: '#d97706', bg: '#fffbeb', border: '#fde68a', desc: '10% sample review' },
              { label: 'Anomaly Check', icon: '🔍', page: 'anomalies', color: '#e11d48', bg: '#fff1f2', border: '#fecdd3', desc: 'Flagged variance' },
              { label: 'Publish Results', icon: '🎓', page: 'results', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', desc: 'Generate Gazette' },
            ].map(action => (
              <button
                key={action.label}
                onClick={() => onNavigate(action.page)}
                style={{
                  padding: '12px 14px', borderRadius: 10,
                  background: action.bg, border: `1px solid ${action.border}`,
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease',
                  display: 'flex', flexDirection: 'column', gap: 3,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 16 }}>{action.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: action.color }}>{action.label}</span>
                </div>
                <span style={{ fontSize: 11, color: '#64748b' }}>{action.desc}</span>
              </button>
            ))}
          </div>

          {/* Exam Status Pill */}
          <div style={{ marginTop: 16, padding: '12px 14px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{MOCK_EXAM.subject} ({MOCK_EXAM.code})</div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{MOCK_EXAM.totalCandidates.toLocaleString()} Total Enrolled Candidates</div>
            </div>
            <span className="badge badge-green">91% Evaluated</span>
          </div>
        </div>
      </div>
    </div>
  );
}
