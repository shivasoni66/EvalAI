import React, { useState } from 'react';
import { MOCK_EXAM } from '../../data/mockData';
import { Plus, Upload, FileText, Eye, Calendar, Users, Hash } from 'lucide-react';

interface Props { onNavigate: (page: string) => void; }

export default function ExaminationsPage({ onNavigate }: Props) {
  const [showCreate, setShowCreate] = useState(false);

  const exams = [
    { ...MOCK_EXAM, status: 'evaluation_in_progress' },
    { id: 'exam2', code: 'CSE-DB-2026', subject: 'Database Management Systems', branch: 'B.Tech CSE', semester: 4, examDate: '2026-04-17', totalCandidates: 12480, totalMarks: 100, uploadedScripts: 11920, evaluatedScripts: 11920, status: 'moderation' },
    { id: 'exam3', code: 'CSE-CN-2026', subject: 'Computer Networks', branch: 'B.Tech CSE', semester: 4, examDate: '2026-04-18', totalCandidates: 12480, totalMarks: 100, uploadedScripts: 11920, evaluatedScripts: 11920, status: 'published' },
    { id: 'exam4', code: 'CSE-DS-2026', subject: 'Data Structures', branch: 'B.Tech CSE', semester: 3, examDate: '2026-04-20', totalCandidates: 11840, totalMarks: 100, uploadedScripts: 0, evaluatedScripts: 0, status: 'upcoming' },
  ];

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      evaluation_in_progress: 'badge-amber',
      moderation: 'badge-purple',
      published: 'badge-green',
      upcoming: 'badge-gray',
      completed: 'badge-blue',
    };
    const label: Record<string, string> = {
      evaluation_in_progress: 'Evaluation in Progress',
      moderation: 'Moderation',
      published: 'Published',
      upcoming: 'Upcoming',
      completed: 'Completed',
    };
    return <span className={`badge ${map[s] || 'badge-gray'}`}>{label[s] || s}</span>;
  };

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="section-title">Examination Management</h1>
          <p className="section-subtitle">Manage examination lifecycle, question papers, marking schemes, and model answers</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <Plus size={14} /> Create Examination
        </button>
      </div>

      {/* Exam cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {exams.map(exam => (
          <div key={exam.id} className="card-solid" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span className="mono" style={{ color: '#3b82f6' }}>{exam.code}</span>
                  {statusBadge(exam.status)}
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#f0f4ff' }}>{exam.subject}</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{exam.branch} · Semester {exam.semester}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary" style={{ fontSize: 12 }}>
                  <Upload size={12} /> Upload Paper
                </button>
                <button className="btn btn-secondary" style={{ fontSize: 12 }}>
                  <Upload size={12} /> Marking Scheme
                </button>
                <button className="btn btn-primary" style={{ fontSize: 12 }} onClick={() => onNavigate('upload')}>
                  <Eye size={12} /> Open
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, marginBottom: 3 }}>EXAM DATE</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Calendar size={12} /> {exam.examDate}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, marginBottom: 3 }}>CANDIDATES</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Users size={12} /> {exam.totalCandidates.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, marginBottom: 3 }}>MAX MARKS</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Hash size={12} /> {exam.totalMarks}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, marginBottom: 3 }}>UPLOADED</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: '#94a3b8' }}>{exam.uploadedScripts.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, marginBottom: 3 }}>EVALUATED</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: exam.evaluatedScripts === exam.uploadedScripts ? '#10b981' : '#f59e0b' }}>
                  {exam.evaluatedScripts.toLocaleString()}
                </div>
              </div>
            </div>

            {exam.uploadedScripts > 0 && (
              <div style={{ marginTop: 14 }}>
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width: `${Math.round((exam.evaluatedScripts / exam.uploadedScripts) * 100)}%`,
                    background: exam.status === 'published' ? 'linear-gradient(90deg, #059669, #10b981)' : 'linear-gradient(90deg, #2952a3, #3b82f6)',
                  }} />
                </div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>
                  {Math.round((exam.evaluatedScripts / exam.uploadedScripts) * 100)}% evaluated
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create modal */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card-solid" style={{ padding: 28, width: 500, maxWidth: '90vw' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f0f4ff', marginBottom: 20 }}>Create New Examination</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Subject Name', placeholder: 'e.g. Operating Systems' },
                { label: 'Exam Code', placeholder: 'e.g. CSE-OS-2027' },
                { label: 'Branch', placeholder: 'e.g. B.Tech CSE' },
                { label: 'Exam Date', placeholder: 'YYYY-MM-DD' },
                { label: 'Total Marks', placeholder: '100' },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 5 }}>{f.label}</label>
                  <input className="form-input" placeholder={f.placeholder} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setShowCreate(false)}>Create Examination</button>
                <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
