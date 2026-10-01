import React from 'react';
import { Server, Database, Globe, Cpu, Cloud, Code } from 'lucide-react';

export default function ArchitecturePage() {
  const layers = [
    { label: 'Student / University Portal', icon: '🏛', desc: 'React web app · Mobile responsive · Role-based access', color: '#3b82f6', tech: ['React', 'TypeScript', 'Tailwind CSS'] },
    { label: 'Digital Examination Platform', icon: '🖥', desc: 'OSM Engine · Examination management · Role-based workflows', color: '#06b6d4', tech: ['Vite', 'React Router', 'localStorage (prototype)'] },
    { label: 'AI Evaluation Layer', icon: '🤖', desc: 'OCR pipeline · Handwriting recognition · Rubric matching · Confidence scoring', color: '#8b5cf6', tech: ['Python AI-ready', 'Mock AI (prototype)', 'GPT/OCR-ready'] },
    { label: 'Analytics Engine', icon: '📊', desc: 'Score analytics · Learning outcomes · Examiner performance · Anomaly detection', color: '#10b981', tech: ['Recharts', 'Node.js-ready', 'Python analytics-ready'] },
    { label: 'Moderation & Workflow', icon: '⚖️', desc: 'Structured moderation · Decision audit · Approval workflows', color: '#f59e0b', tech: ['Rule engine-ready', 'Event-driven-ready'] },
    { label: 'Data & Result Processing', icon: '🗄', desc: 'Candidate data · Script storage · Result computation · Publishing', color: '#ef4444', tech: ['MongoDB-ready', 'PostgreSQL-ready', 'Cloud Storage-ready'] },
  ];

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 className="section-title">System Architecture</h1>
        <p className="section-subtitle">EvalAI platform architecture — current prototype uses mock data; designed for real AI/OCR integration</p>
      </div>

      {/* Notice */}
      <div style={{ padding: '12px 16px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8 }}>
        <div style={{ fontSize: 13, color: '#60a5fa' }}>
          🔧 <strong>Prototype Mode:</strong> This deployment uses mock AI data and localStorage for persistence. The architecture is designed so real OCR, AI evaluation APIs, and database backends can be integrated without changing the frontend layer.
        </div>
      </div>

      {/* Layer diagram */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {layers.map((layer, i) => (
          <React.Fragment key={layer.label}>
            <div style={{
              padding: '20px', borderRadius: 12,
              background: `${layer.color}0a`, border: `1px solid ${layer.color}22`,
              display: 'flex', gap: 20, alignItems: 'center',
            }}>
              <div style={{ fontSize: 30, flexShrink: 0 }}>{layer.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f0f4ff', marginBottom: 4 }}>{layer.label}</div>
                <div style={{ fontSize: 12.5, color: '#64748b' }}>{layer.desc}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  {layer.tech.map(t => (
                    <span key={t} style={{
                      fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 999,
                      background: `${layer.color}18`, color: layer.color, border: `1px solid ${layer.color}30`,
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {i < layers.length - 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', height: 24, alignItems: 'center' }}>
                <div style={{ width: 2, height: '100%', background: 'rgba(255,255,255,0.06)' }} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Integration points */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card-solid" style={{ padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f4ff', marginBottom: 14 }}>Current Prototype State</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { item: 'React + Vite + TypeScript frontend', done: true },
              { item: 'Tailwind CSS design system', done: true },
              { item: 'Role-based authentication (mock)', done: true },
              { item: 'OSM marking workspace', done: true },
              { item: 'AI simulation pipeline', done: true },
              { item: 'Anomaly detection (rule-based)', done: true },
              { item: 'Moderation workflow', done: true },
              { item: 'Audit log system', done: true },
              { item: 'Analytics & learning outcomes', done: true },
              { item: 'Real OCR / AI API integration', done: false },
              { item: 'Production database', done: false },
              { item: 'Cloud storage for answer sheets', done: false },
            ].map(item => (
              <div key={item.item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, background: item.done ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)', color: item.done ? '#10b981' : '#475569', flexShrink: 0 }}>
                  {item.done ? '✓' : '○'}
                </div>
                <span style={{ fontSize: 12.5, color: item.done ? '#94a3b8' : '#475569' }}>{item.item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-solid" style={{ padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f4ff', marginBottom: 14 }}>Integration Roadmap</div>
          {[
            { phase: 'Phase 1', title: 'OCR Integration', desc: 'Connect Tesseract/Google Vision API for handwriting recognition. Replace mock OCR with real pipeline.', color: '#3b82f6' },
            { phase: 'Phase 2', title: 'AI Evaluation', desc: 'Integrate GPT-4/Gemini with rubric-based prompting for answer assessment and scoring.', color: '#8b5cf6' },
            { phase: 'Phase 3', title: 'Cloud Storage', desc: 'AWS S3 or Google Cloud Storage for answer sheet PDFs. CDN for fast delivery.', color: '#10b981' },
            { phase: 'Phase 4', title: 'Production Backend', desc: 'Node.js/Python API server. MongoDB for scripts. PostgreSQL for results and users.', color: '#f59e0b' },
          ].map(p => (
            <div key={p.phase} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ padding: '2px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700, background: `${p.color}18`, color: p.color, flexShrink: 0, height: 'fit-content' }}>{p.phase}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 3 }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{p.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
