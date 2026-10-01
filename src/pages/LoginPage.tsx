import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { UserRole } from '../types';
import { Eye, EyeOff, Shield, ChevronDown, CheckCircle, ArrowRight } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { role: 'admin' as UserRole, email: 'admin@evalai.demo', name: 'Admin', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', desc: 'Oversee exams & AI' },
  { role: 'examiner' as UserRole, email: 'examiner@evalai.demo', name: 'Examiner', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', desc: 'OSM marking workspace' },
  { role: 'moderator' as UserRole, email: 'moderator@evalai.demo', name: 'Moderator', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', desc: 'Review 10% samples' },
  { role: 'student' as UserRole, email: 'student@evalai.demo', name: 'Student', color: '#d97706', bg: '#fffbeb', border: '#fde68a', desc: 'Transparent scores' },
];

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@evalai.demo');
  const [password, setPassword] = useState('demo1234');
  const [role, setRole] = useState<UserRole>('admin');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const ok = login(email, password, role);
    if (ok) {
      const routes: Record<UserRole, string> = {
        admin: '/admin',
        examiner: '/examiner',
        moderator: '/moderator',
        student: '/student',
      };
      navigate(routes[role]);
    } else {
      setError('Invalid credentials. Select one of the quick demo accounts below.');
    }
    setLoading(false);
  };

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setRole(acc.role);
    setPassword('demo1234');
    setRoleOpen(false);
  };

  const roleLabels: Record<UserRole, string> = {
    admin: 'System Administrator',
    examiner: 'Senior Examiner',
    moderator: 'Head Moderator',
    student: 'Student / Candidate',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      display: 'flex',
      position: 'relative',
    }}>
      {/* Left panel - Clean White Hero */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px 80px', maxWidth: '58%',
        background: '#ffffff', borderRight: '1px solid #e2e8f0',
      }} className="hidden-mobile">
        <div style={{ marginBottom: 40 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{
              width: 44, height: 44,
              background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
              borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
            }}>
              <Shield size={22} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 8 }}>
                EvalAI
                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>
                  OSM Ecosystem
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>
                Next-Gen University Examination Evaluation
              </div>
            </div>
          </div>

          <h1 style={{ fontSize: 40, fontWeight: 800, color: '#0f172a', lineHeight: 1.2, letterSpacing: '-0.03em', marginBottom: 16 }}>
            Fair, Transparent & Rapid<br />
            <span style={{ color: '#2563eb' }}>
              On-Screen Marking (OSM)
            </span>
          </h1>

          <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.7, maxWidth: 520 }}>
            Digitize handwritten answer sheets, assist university examiners with step-wise AI rubrics, automatically detect anomalies & unchecked questions, and eliminate result delays.
          </p>
        </div>

        {/* Workflow Pills - Multi-color and interactive */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
          {[
            { name: 'Scan & Digitize', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
            { name: 'Barcode Anonymize', color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc' },
            { name: 'AI Step-Wise Rubric', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
            { name: 'OSM Examiner Workspace', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
            { name: 'Moderation & Anomaly Check', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
            { name: 'Publish Gazette', color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe' },
          ].map((step, i, arr) => (
            <React.Fragment key={step.name}>
              <div style={{
                padding: '6px 14px', borderRadius: 8,
                background: step.bg, border: `1px solid ${step.border}`,
                fontSize: 12.5, fontWeight: 700, color: step.color,
              }}>
                {step.name}
              </div>
              {i < arr.length - 1 && <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 700 }}>→</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Multi-color Metric Boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { val: '12,480', label: 'Enrolled Scripts', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
            { val: '94.2%', label: 'AI Rubric Accuracy', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
            { val: '4m 18s', label: 'Average Marking Speed', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
          ].map(s => (
            <div key={s.label} style={{
              padding: '16px 18px', borderRadius: 12,
              background: s.bg, border: `1px solid ${s.border}`,
            }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color, letterSpacing: '-0.02em' }}>{s.val}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - Clean Modern Login Form */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '50px 60px', maxWidth: 480, margin: 'auto',
      }}>
        <div className="card-solid" style={{ padding: '36px 32px', background: '#ffffff', border: '1px solid #cbd5e1' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Sign in to EvalAI</h2>
          <p style={{ fontSize: 13.5, color: '#64748b', marginBottom: 26 }}>
            University examination evaluation and OSM ecosystem
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Email */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                className="form-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter university email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex',
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Role Selector */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>
                Active System Role
              </label>
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setRoleOpen(!roleOpen)}
                  className="form-input"
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer', textAlign: 'left', fontWeight: 600,
                  }}
                >
                  <span>{roleLabels[role]}</span>
                  <ChevronDown size={15} color="#64748b" />
                </button>

                {roleOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 50,
                    background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: 8,
                    overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                  }}>
                    {(['admin', 'examiner', 'moderator', 'student'] as UserRole[]).map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => { setRole(r); setRoleOpen(false); }}
                        style={{
                          width: '100%', padding: '10px 14px', textAlign: 'left',
                          background: role === r ? '#eff6ff' : 'transparent',
                          border: 'none', color: role === r ? '#2563eb' : '#334155',
                          fontWeight: role === r ? 700 : 500,
                          fontSize: 13.5, cursor: 'pointer', transition: 'background 0.15s',
                        }}
                      >
                        {roleLabels[r]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 8, color: '#be123c', fontSize: 12.5, fontWeight: 600 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ padding: '11px', marginTop: 4, fontSize: 14, fontWeight: 700, background: '#2563eb' }}
            >
              {loading ? 'Authenticating...' : 'Sign In to EvalAI →'}
            </button>
          </form>

          {/* Quick 1-Click Multi-Color Demo Switcher */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>
                1-CLICK DEMO ACCOUNTS
              </span>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => fillDemo(acc)}
                  style={{
                    padding: '8px 10px', borderRadius: 8,
                    background: role === acc.role ? acc.bg : '#ffffff',
                    border: `1.5px solid ${role === acc.role ? acc.color : acc.border}`,
                    cursor: 'pointer', transition: 'all 0.15s ease',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = acc.bg)}
                  onMouseLeave={e => {
                    if (role !== acc.role) e.currentTarget.style.background = '#ffffff';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 800, color: acc.color }}>{acc.name}</span>
                    {role === acc.role && <CheckCircle size={13} color={acc.color} />}
                  </div>
                  <div style={{ fontSize: 10.5, color: '#64748b', marginTop: 2 }}>{acc.desc}</div>
                </button>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: '#64748b' }}>
              Password: <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>demo1234</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
