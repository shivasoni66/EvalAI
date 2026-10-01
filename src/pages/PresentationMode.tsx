import React, { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';

interface Props { onClose: () => void; }

const SLIDES = [
  {
    id: 'problem',
    label: 'Problem',
    title: 'The Challenge with Traditional Examination Evaluation',
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[
          { icon: '⏱', title: 'Slow & Manual', desc: 'Weeks of manual marking with no real-time visibility' },
          { icon: '⚖️', title: 'Inconsistent Marking', desc: 'Same answer scored differently by different examiners' },
          { icon: '🔍', title: 'Unchecked Answers', desc: 'No systematic detection of unanswered questions' },
          { icon: '📊', title: 'Limited Analytics', desc: 'No question-level performance insights or learning outcomes' },
          { icon: '🔒', title: 'No Audit Trail', desc: 'Changes made without traceability or accountability' },
          { icon: '🐌', title: 'Delayed Results', desc: 'Result processing adds weeks to already slow pipeline' },
        ].map(p => (
          <div key={p.title} style={{ padding: '16px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 10 }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{p.icon}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f4ff', marginBottom: 4 }}>{p.title}</div>
            <div style={{ fontSize: 12.5, color: '#94a3b8', lineHeight: 1.5 }}>{p.desc}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'solution',
    label: 'Solution',
    title: 'EvalAI: AI-Powered Examination Ecosystem',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7 }}>
          EvalAI transforms examination evaluation through AI-assisted On-Screen Marking, intelligent anomaly detection, 
          structured moderation workflows, and real-time analytics — all in a single secure platform.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {['Scan', 'OCR/AI', 'Evaluate', 'Verify', 'Moderate', 'Analyze', 'Publish'].map((step, i, arr) => (
            <React.Fragment key={step}>
              <div style={{ padding: '8px 16px', borderRadius: 8, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', fontSize: 13, fontWeight: 700, color: '#60a5fa' }}>
                {step}
              </div>
              {i < arr.length - 1 && <ChevronRight size={14} color="#334155" />}
            </React.Fragment>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { icon: '🤖', title: 'AI-Assisted Marking', desc: 'Confidence-scored evaluation suggestions' },
            { icon: '🖥', title: 'Smart OSM', desc: 'Side-by-side answer & AI analysis workspace' },
            { icon: '🔍', title: 'Anomaly Detection', desc: 'Real-time marking pattern analysis' },
            { icon: '⚖️', title: 'Moderation', desc: 'Structured discrepancy resolution' },
            { icon: '📊', title: 'Deep Analytics', desc: 'Learning outcomes & difficulty mapping' },
            { icon: '🔒', title: 'Audit Trail', desc: 'Immutable log of all changes' },
          ].map(f => (
            <div key={f.title} style={{ padding: '14px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 10 }}>
              <div style={{ fontSize: 22, marginBottom: 5 }}>{f.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f4ff', marginBottom: 3 }}>{f.title}</div>
              <div style={{ fontSize: 11.5, color: '#64748b' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'osm',
    label: 'OSM',
    title: 'On-Screen Marking Workspace',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>
          The OSM Workspace is the heart of EvalAI. Examiners see the handwritten answer on the left while AI-suggested 
          marks, confidence scores, and rubric checkpoints appear on the right — enabling fast, consistent, and transparent marking.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 10 }}>ANSWER VIEWER (LEFT)</div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
              • Scanned answer sheet display<br/>
              • Page navigation (1/8)<br/>
              • Zoom, rotate, fit controls<br/>
              • Question highlighting overlay
            </div>
          </div>
          <div style={{ padding: '16px', background: 'rgba(59,130,246,0.06)', borderRadius: 10, border: '1px solid rgba(59,130,246,0.2)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', marginBottom: 10 }}>AI EVALUATION PANEL (RIGHT)</div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
              • AI Suggested Score with confidence<br/>
              • Rubric checkpoint validation<br/>
              • Accept / Edit / Flag controls<br/>
              • Running total with AI vs Examiner diff
            </div>
          </div>
        </div>
        <div style={{ padding: '14px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8 }}>
          <div style={{ fontSize: 13, color: '#fbbf24' }}>
            🤖 <strong>AI Transparency:</strong> All AI scores are clearly labeled as "AI Suggested Score". Final decisions remain with authorized examiners.
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    title: 'Examination Analytics & Learning Outcomes',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: 'Avg Score', val: '72.4' }, { label: 'Pass Rate', val: '84.2%' },
            { label: 'AI Confidence', val: '89%' }, { label: 'Scripts Processed', val: '11,920' },
            { label: 'Anomalies Detected', val: '4' }, { label: 'Eval. Time Savings', val: '~68%' },
          ].map(s => (
            <div key={s.label} style={{ padding: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#f0f4ff', letterSpacing: '-0.03em' }}>{s.val}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f4ff', marginBottom: 4 }}>AI-Inferred Learning Outcomes</div>
          {[
            { topic: 'CPU Scheduling', val: 84 }, { topic: 'Deadlocks', val: 71 },
            { topic: 'Memory Management', val: 48 }, { topic: 'File Systems', val: 67 },
          ].map(lo => (
            <div key={lo.topic} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12.5, color: '#94a3b8', width: 160 }}>{lo.topic}</span>
              <div className="progress-bar" style={{ flex: 1 }}>
                <div className="progress-fill" style={{ width: `${lo.val}%`, background: lo.val >= 70 ? '#10b981' : '#f59e0b' }} />
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: lo.val >= 70 ? '#34d399' : '#fbbf24', width: 35 }}>{lo.val}%</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'impact',
    label: 'Impact',
    title: 'Potential Impact & Prototype Targets',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ padding: '10px 14px', background: 'rgba(59,130,246,0.08)', borderRadius: 8, fontSize: 12.5, color: '#60a5fa' }}>
          Note: Impact figures below are prototype targets and potential estimates. Real-world validation data collection is planned for pilot deployment.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { icon: '⚡', title: 'Faster Evaluation Workflow', desc: 'Prototype target: significantly reduce average time per script vs fully manual process', metric: 'Prototype Target' },
            { icon: '✅', title: 'Reduced Manual Checking Effort', desc: 'AI pre-evaluation handles initial marking; examiners verify and adjust', metric: 'Potential Impact' },
            { icon: '📐', title: 'Improved Marking Consistency', desc: 'Anomaly detection flags high-variance evaluations for review', metric: 'Potential Impact' },
            { icon: '🔍', title: 'Early Anomaly Detection', desc: 'Real-time pattern analysis catches rapid/unusual evaluation behaviour', metric: 'Feature Demonstrated' },
            { icon: '📋', title: 'Centralized Audit Trail', desc: 'Every mark change logged with timestamp, user, old and new values', metric: 'Implemented' },
            { icon: '🚀', title: 'Faster Result Processing', desc: 'Automated calculation and structured moderation pipeline', metric: 'Implemented' },
          ].map(p => (
            <div key={p.title} style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{p.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f0f4ff', marginBottom: 4 }}>{p.title}</div>
              <div style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.5, marginBottom: 8 }}>{p.desc}</div>
              <span className="badge badge-blue" style={{ fontSize: 10 }}>{p.metric}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function PresentationMode({ onClose }: Props) {
  const [slide, setSlide] = useState(0);
  const current = SLIDES[slide];

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050d1a', zIndex: 200, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px', background: '#0a1628', borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #2952a3, #3b82f6)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: 'white' }}>E</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#f0f4ff' }}>EvalAI</div>
            <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Presentation Mode</div>
          </div>
        </div>

        {/* Slide tabs */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 6 }}>
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSlide(i)}
              style={{
                padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: i === slide ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
                color: i === slide ? '#60a5fa' : '#64748b',
                fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <X size={16} /> Exit
        </button>
      </div>

      {/* Slide content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px', maxWidth: 960, margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            {String(slide + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f0f4ff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {current.title}
          </h1>
          <div className="divider" style={{ marginTop: 16 }} />
        </div>
        {current.content}
      </div>

      {/* Navigation */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-secondary" onClick={() => setSlide(s => Math.max(0, s - 1))} disabled={slide === 0}>
          ← Previous
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          {SLIDES.map((_, i) => (
            <div key={i} style={{
              width: i === slide ? 24 : 8, height: 8, borderRadius: 4,
              background: i === slide ? '#3b82f6' : 'rgba(255,255,255,0.15)',
              transition: 'all 0.3s ease', cursor: 'pointer',
            }} onClick={() => setSlide(i)} />
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => setSlide(s => Math.min(SLIDES.length - 1, s + 1))} disabled={slide === SLIDES.length - 1}>
          Next →
        </button>
      </div>
    </div>
  );
}
