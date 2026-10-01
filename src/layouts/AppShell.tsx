import React, { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield, Bell, Search, ChevronDown, LogOut, Menu,
  LayoutDashboard, FileText, Upload, Brain, ShieldCheck,
  BarChart3, Users, ClipboardList, History, Settings, AlertTriangle
} from 'lucide-react';
import type { UserRole } from '../types';

// Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ExaminationsPage from '../pages/admin/ExaminationsPage';
import AnswerSheetUpload from '../pages/admin/AnswerSheetUpload';
import AIEvaluationPage from '../pages/admin/AIEvaluationPage';
import ModerationPage from '../pages/admin/ModerationPage';
import AnalyticsPage from '../pages/admin/AnalyticsPage';
import ExaminersPage from '../pages/admin/ExaminersPage';
import ResultsPage from '../pages/admin/ResultsPage';
import AuditLogsPage from '../pages/admin/AuditLogsPage';
import RevaluationPage from '../pages/admin/RevaluationPage';
import AnomalyPage from '../pages/admin/AnomalyPage';
import PresentationMode from '../pages/PresentationMode';
import ArchitecturePage from '../pages/ArchitecturePage';
import NotificationsDropdown from '../components/NotificationsDropdown';
import GlobalSearch from '../components/GlobalSearch';

// Examiner pages
import ExaminerDashboard from '../pages/examiner/ExaminerDashboard';
import OSMWorkspace from '../pages/examiner/OSMWorkspace';

// Moderator pages
import ModeratorDashboard from '../pages/moderator/ModeratorDashboard';

// Student pages
import StudentPortal from '../pages/student/StudentPortal';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} />, roles: ['admin', 'examiner', 'moderator', 'student'] },
  { id: 'osm', label: 'OSM Workspace', icon: <ClipboardList size={16} />, roles: ['examiner', 'admin'] },
  { id: 'examinations', label: 'Examinations', icon: <FileText size={16} />, roles: ['admin'] },
  { id: 'upload', label: 'Answer Sheets', icon: <Upload size={16} />, roles: ['admin'] },
  { id: 'ai-evaluation', label: 'AI Evaluation', icon: <Brain size={16} />, roles: ['admin'] },
  { id: 'anomalies', label: 'Anomaly Detection', icon: <AlertTriangle size={16} />, roles: ['admin', 'examiner'] },
  { id: 'moderation', label: 'Moderation', icon: <ShieldCheck size={16} />, roles: ['admin', 'moderator'] },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={16} />, roles: ['admin'] },
  { id: 'examiners', label: 'Examiners', icon: <Users size={16} />, roles: ['admin'] },
  { id: 'results', label: 'Results', icon: <ClipboardList size={16} />, roles: ['admin'] },
  { id: 'revaluation', label: 'Revaluation', icon: <FileText size={16} />, roles: ['admin'] },
  { id: 'audit', label: 'Audit Logs', icon: <History size={16} />, roles: ['admin'] },
  { id: 'architecture', label: 'Architecture', icon: <Settings size={16} />, roles: ['admin'] },
];

interface AppShellProps {
  initialPage?: string;
}

export default function AppShell({ initialPage }: AppShellProps) {
  const { currentUser, logout, unreadCount } = useApp();
  const [activePage, setActivePage] = useState(initialPage || 'dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);
  const [osmScriptId, setOsmScriptId] = useState<string>('s1');

  const navigateTo = useCallback((page: string, data?: { scriptId?: string }) => {
    setActivePage(page);
    if (data?.scriptId) setOsmScriptId(data.scriptId);
    setSidebarOpen(false);
  }, []);

  if (!currentUser) return null;

  const role = currentUser.role;
  const navItems = NAV_ITEMS.filter(n => n.roles.includes(role));

  const renderPage = () => {
    if (role === 'student') return <StudentPortal />;
    if (role === 'moderator') {
      if (activePage === 'moderation') return <ModerationPage />;
      return <ModeratorDashboard onNavigate={navigateTo} />;
    }
    if (role === 'examiner') {
      if (activePage === 'osm') return <OSMWorkspace scriptId={osmScriptId} onNavigate={navigateTo} />;
      if (activePage === 'anomalies') return <AnomalyPage />;
      return <ExaminerDashboard onNavigate={navigateTo} />;
    }
    // Admin
    switch (activePage) {
      case 'dashboard': return <AdminDashboard onNavigate={navigateTo} />;
      case 'osm': return <OSMWorkspace scriptId={osmScriptId} onNavigate={navigateTo} />;
      case 'examinations': return <ExaminationsPage onNavigate={navigateTo} />;
      case 'upload': return <AnswerSheetUpload onNavigate={navigateTo} />;
      case 'ai-evaluation': return <AIEvaluationPage onNavigate={navigateTo} />;
      case 'anomalies': return <AnomalyPage />;
      case 'moderation': return <ModerationPage />;
      case 'analytics': return <AnalyticsPage />;
      case 'examiners': return <ExaminersPage />;
      case 'results': return <ResultsPage />;
      case 'revaluation': return <RevaluationPage />;
      case 'audit': return <AuditLogsPage />;
      case 'architecture': return <ArchitecturePage />;
      default: return <AdminDashboard onNavigate={navigateTo} />;
    }
  };

  if (presentationMode) {
    return <PresentationMode onClose={() => setPresentationMode(false)} />;
  }

  const roleColors: Record<UserRole, { bg: string; text: string; border: string }> = {
    admin: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
    examiner: { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' },
    moderator: { bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe' },
    student: { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
  };
  const currentRoleStyle = roleColors[role];

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#f8fafc' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', zIndex: 40, backdropFilter: 'blur(2px)' }}
        />
      )}

      {/* Sidebar - Clean White with crisp typography */}
      <aside style={{
        width: 230, flexShrink: 0,
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        transition: 'transform 0.25s ease',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.03)',
      }}
        className={`sidebar-container${sidebarOpen ? ' open' : ''}`}
      >
        {/* Logo */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
              borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
            }}>
              <Shield size={18} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 6 }}>
                EvalAI
                <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 4, background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>
                  OSM
                </span>
              </div>
              <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginTop: 1 }}>
                Digital Examination Hub
              </div>
            </div>
          </div>

          {/* Current Exam Card */}
          <div style={{ marginTop: 14, padding: '8px 12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10, color: '#64748b', fontWeight: 700, letterSpacing: '0.04em' }}>ACTIVE EXAM</span>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
            </div>
            <div style={{ fontSize: 12.5, color: '#1e293b', fontWeight: 700, marginTop: 2 }}>CSE-OS-2026</div>
            <div style={{ fontSize: 10.5, color: '#64748b', marginTop: 1 }}>Operating Systems · Sem 4</div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '14px 10px' }}>
          {navItems.map(item => (
            <div
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => navigateTo(item.id)}
            >
              <div style={{ color: activePage === item.id ? '#2563eb' : '#64748b', display: 'flex' }}>
                {item.icon}
              </div>
              <span>{item.label}</span>
              {item.id === 'osm' && (
                <span style={{
                  marginLeft: 'auto', fontSize: 10, fontWeight: 700,
                  padding: '1px 6px', borderRadius: 999, background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0',
                }}>
                  Live
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* Presentation Button & User Profile */}
        <div style={{ borderTop: '1px solid #f1f5f9', padding: '14px 12px', background: '#ffffff' }}>
          <button
            onClick={() => setPresentationMode(true)}
            className="btn btn-secondary"
            style={{ width: '100%', marginBottom: 10, fontSize: 12, padding: '7px 10px', justifyContent: 'center' }}
          >
            🎯 Presentation Walkthrough
          </button>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
            background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: currentRoleStyle.bg, border: `1px solid ${currentRoleStyle.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, color: currentRoleStyle.text,
            }}>
              {currentUser.name.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0f172a', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {currentUser.name.split(' ').slice(0, 2).join(' ')}
              </div>
              <div style={{ fontSize: 10.5, color: currentRoleStyle.text, fontWeight: 700, textTransform: 'capitalize' }}>
                {role}
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#64748b', display: 'flex', padding: 5, borderRadius: 6,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
              onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', marginLeft: '230px' }}
        className="main-content-area"
      >
        {/* Header - Clean White */}
        <header style={{
          height: 60, display: 'flex', alignItems: 'center', gap: 14,
          padding: '0 24px',
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          flexShrink: 0, zIndex: 30, position: 'relative',
        }}>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'none' }}
            className="mobile-menu-btn"
          >
            <Menu size={20} />
          </button>

          {/* Quick Search */}
          <div style={{ flex: 1, position: 'relative', maxWidth: 400 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              placeholder="Search students, script IDs, evaluation rubrics..."
              className="form-input"
              style={{ paddingLeft: 34, height: 36, fontSize: 13, background: '#f8fafc', border: '1px solid #e2e8f0' }}
              onFocus={() => setShowSearch(true)}
              readOnly
              onClick={() => setShowSearch(true)}
            />
          </div>

          <div style={{ flex: 1 }} />

          {/* Quick navigation to OSM Workspace */}
          <button
            onClick={() => navigateTo('osm')}
            className="btn btn-primary"
            style={{ fontSize: 12, padding: '6px 14px', background: '#2563eb' }}
          >
            <ClipboardList size={14} /> Open OSM Workspace
          </button>

          {/* Role pill */}
          <div
            className="badge"
            style={{
              background: currentRoleStyle.bg,
              color: currentRoleStyle.text,
              borderColor: currentRoleStyle.border,
              padding: '4px 12px',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)} View
          </div>

          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                position: 'relative', background: '#ffffff', border: '1px solid #cbd5e1',
                borderRadius: 8, padding: '7px', cursor: 'pointer', display: 'flex', color: '#475569',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              }}
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <div style={{
                  position: 'absolute', top: -4, right: -4,
                  background: '#ef4444', borderRadius: '50%', width: 16, height: 16,
                  fontSize: 9, fontWeight: 800, color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {unreadCount}
                </div>
              )}
            </button>
            {showNotifications && (
              <NotificationsDropdown onClose={() => setShowNotifications(false)} />
            )}
          </div>

          {/* User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: currentRoleStyle.bg, border: `1px solid ${currentRoleStyle.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: currentRoleStyle.text,
            }}>
              {currentUser.name.charAt(0)}
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', maxWidth: 120, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {currentUser.name.split(' ')[0]}
            </span>
            <ChevronDown size={14} color="#64748b" />
          </div>
        </header>

        {/* Page Content Canvas */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', background: '#f8fafc' }} className="page-enter">
          {renderPage()}
        </main>
      </div>

      {/* Global Search Modal */}
      {showSearch && <GlobalSearch onClose={() => setShowSearch(false)} onNavigate={navigateTo} />}
    </div>
  );
}
