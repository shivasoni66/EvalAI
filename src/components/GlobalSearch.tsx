import React, { useState, useMemo } from 'react';
import { MOCK_CANDIDATES, MOCK_SCRIPTS, MOCK_EXAM, EXAMINER_PERFORMANCE } from '../data/mockData';
import { Search, X, User, FileText, Hash, BookOpen } from 'lucide-react';

interface Props {
  onClose: () => void;
  onNavigate: (page: string, data?: { scriptId?: string }) => void;
}

type SearchResult = {
  type: 'candidate' | 'script' | 'examiner' | 'subject';
  id: string;
  title: string;
  subtitle: string;
  page: string;
  scriptId?: string;
};

export default function GlobalSearch({ onClose, onNavigate }: Props) {
  const [query, setQuery] = useState('');

  const results = useMemo<SearchResult[]>(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    const r: SearchResult[] = [];

    // Candidates
    MOCK_CANDIDATES.filter(c =>
      c.name.toLowerCase().includes(q) || c.enrollmentNo.toLowerCase().includes(q)
    ).slice(0, 3).forEach(c => r.push({
      type: 'candidate', id: c.id,
      title: c.name, subtitle: `${c.enrollmentNo} · ${c.branch}`,
      page: 'ai-evaluation',
    }));

    // Scripts
    MOCK_SCRIPTS.filter(s =>
      s.scriptCode.toLowerCase().includes(q) || s.barcodeId.toLowerCase().includes(q)
    ).slice(0, 3).forEach(s => r.push({
      type: 'script', id: s.id,
      title: s.scriptCode, subtitle: `${s.totalPages} pages · ${s.status}`,
      page: 'osm', scriptId: s.id,
    }));

    // Examiners
    EXAMINER_PERFORMANCE.filter(e =>
      e.examinerName.toLowerCase().includes(q) || e.examinerId.toLowerCase().includes(q)
    ).slice(0, 2).forEach(e => r.push({
      type: 'examiner', id: e.examinerId,
      title: e.examinerName, subtitle: `${e.examinerId} · ${e.scriptsEvaluated} scripts`,
      page: 'examiners',
    }));

    // Subject
    if (MOCK_EXAM.subject.toLowerCase().includes(q)) {
      r.push({
        type: 'subject', id: MOCK_EXAM.id,
        title: MOCK_EXAM.subject, subtitle: `${MOCK_EXAM.code} · Semester ${MOCK_EXAM.semester}`,
        page: 'examinations',
      });
    }

    return r;
  }, [query]);

  const typeIcon: Record<string, React.ReactNode> = {
    candidate: <User size={14} color="#60a5fa" />,
    script: <FileText size={14} color="#34d399" />,
    examiner: <Hash size={14} color="#a78bfa" />,
    subject: <BookOpen size={14} color="#f59e0b" />,
  };

  const typeLabel: Record<string, string> = {
    candidate: 'Candidate', script: 'Script', examiner: 'Examiner', subject: 'Subject',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 80 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} onClick={onClose} />
      <div style={{
        position: 'relative', width: '100%', maxWidth: 560,
        background: '#0d1f3c', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 14, boxShadow: '0 24px 60px rgba(0,0,0,0.5)', overflow: 'hidden',
        zIndex: 1,
      }}>
        {/* Search input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Search size={18} color="#64748b" style={{ flexShrink: 0 }} />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by candidate, script ID, examiner, subject..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: '#f0f4ff', fontSize: 15, fontFamily: 'inherit',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}>
              <X size={14} />
            </button>
          )}
          <div style={{ padding: '3px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: 4, fontSize: 11, color: '#64748b' }}>ESC</div>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
            {results.map(result => (
              <div
                key={`${result.type}-${result.id}`}
                onClick={() => { onNavigate(result.page, result.scriptId ? { scriptId: result.scriptId } : undefined); onClose(); }}
                style={{
                  padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12,
                  cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {typeIcon[result.type]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: '#e2e8f0' }}>{result.title}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{result.subtitle}</div>
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {typeLabel[result.type]}
                </span>
              </div>
            ))}
          </div>
        ) : query.length >= 2 ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#475569' }}>
            <Search size={28} style={{ opacity: 0.3, marginBottom: 10 }} />
            <div style={{ fontSize: 14 }}>No results for "{query}"</div>
          </div>
        ) : (
          <div style={{ padding: '20px 18px' }}>
            <div style={{ fontSize: 11, color: '#475569', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Access</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['24CSE1045', 'OS-2026-001045', 'E104', 'Operating Systems'].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => setQuery(suggestion)}
                  style={{
                    padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.04)', color: '#94a3b8', fontSize: 12.5,
                    cursor: 'pointer', fontFamily: 'monospace',
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
