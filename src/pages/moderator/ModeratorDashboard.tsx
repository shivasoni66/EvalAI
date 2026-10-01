import React from 'react';
import { MOCK_MODERATION_CASES, MOCK_CANDIDATES, MOCK_SCRIPTS } from '../../data/mockData';
import ModerationPage from '../admin/ModerationPage';
import { Scale, Clock, CheckCircle } from 'lucide-react';

interface Props { onNavigate: (page: string) => void; }

export default function ModeratorDashboard({ onNavigate }: Props) {
  const cases = MOCK_MODERATION_CASES;
  const pending = cases.filter(c => c.status === 'pending').length;
  const underReview = cases.filter(c => c.status === 'under_review').length;
  const completed = cases.filter(c => c.status === 'completed').length;

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 className="section-title">Moderator Dashboard</h1>
        <p className="section-subtitle">Dr. Vikram Singh · Academic Affairs Moderator</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { label: 'Pending Cases', val: pending, color: '#f59e0b', icon: <Clock size={20} /> },
          { label: 'Under Review', val: underReview, color: '#3b82f6', icon: <Scale size={20} /> },
          { label: 'Completed', val: completed, color: '#10b981', icon: <CheckCircle size={20} /> },
        ].map(s => (
          <div key={s.label} className="kpi-card" style={{ '--accent-color': s.color } as React.CSSProperties}>
            <div style={{ color: s.color, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#f0f4ff' }}>{s.val}</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary" style={{ width: 'fit-content', fontSize: 14 }} onClick={() => onNavigate('moderation')}>
        Open Moderation Workspace →
      </button>

      <ModerationPage />
    </div>
  );
}
