import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw,
  CheckCircle, AlertTriangle, Flag, Save, Send, Clock, Brain,
  BookOpen, User, Check, X, Highlighter, Edit3, MessageSquare, Star, RotateCcw, Trash2
} from 'lucide-react';
import { INITIAL_EVALUATION, MOCK_EXAM, MOCK_CANDIDATES } from '../../data/mockData';
import type { QuestionEvaluation } from '../../types';
import { useApp } from '../../context/AppContext';

// Handwritten answer content per question
const HANDWRITTEN_ANSWERS: Record<number, string[]> = {
  1: [
    "An Operating System (OS) is system software that manages computer hardware,",
    "software resources, and provides common services for computer programs.",
    "",
    "Major functions of an Operating System:",
    "",
    "1) Process Management - The OS manages the creation, scheduling,",
    "   and termination of processes. It uses algorithms like FCFS, SJF,",
    "   and Round Robin for efficient CPU utilization.",
    "",
    "2) Memory Management - OS handles allocation and deallocation of",
    "   memory space to programs. It ensures protection between processes.",
    "",
    "3) File System Management - OS provides a file system interface",
    "   for creating, reading, writing, and deleting files.",
    "",
    "4) I/O Device Management - OS manages input/output devices",
    "   through device drivers, providing a uniform interface.",
    "",
    "Example: Linux OS manages multiple processes simultaneously through",
    "the Linux scheduler, using CFS (Completely Fair Scheduler).",
  ],
  2: [
    "Process State Transition Diagram:",
    "",
    "A process passes through several states during its execution lifecycle:",
    "",
    "1. NEW: The process is being created and loaded into memory.",
    "2. READY: The process is in memory waiting to be assigned to CPU.",
    "3. RUNNING: Instructions are being executed by the processor.",
    "4. WAITING/BLOCKED: Process is waiting for an I/O event or signal.",
    "5. TERMINATED: The process has finished execution and is deallocated.",
    "",
    "Context Switching:",
    "When switching CPU from one process to another, the kernel saves the",
    "context of the running process in its PCB (Process Control Block) and",
    "loads the context of the newly scheduled process from its PCB.",
  ],
  3: [
    "Deadlock: A deadlock is a situation where a set of processes are",
    "blocked because each process is holding a resource and waiting",
    "for a resource held by another process.",
    "",
    "Necessary Conditions for Deadlock (Coffman Conditions):",
    "",
    "1. Mutual Exclusion: At least one resource must be held in a",
    "   non-shareable mode. Only one process can use the resource",
    "   at any given time.",
    "",
    "2. Hold and Wait: A process holding at least one resource is",
    "   waiting to acquire additional resources held by other processes.",
    "",
    "3. No Preemption: A resource can be released only voluntarily",
    "   by the process holding it, after that process has completed",
    "   its task.",
    "",
    "4. Circular Wait: There must exist a set {P0, P1, ..., Pn} of",
    "   waiting processes such that P0 is waiting for a resource held",
    "   by P1, P1 is waiting for a resource held by P2...",
    "   [Answer appears incomplete here - student did not elaborate avoidance]",
  ],
  4: [
    "CPU Scheduling Algorithms:",
    "",
    "1. First-Come, First-Served (FCFS): Non-preemptive. Simple FIFO queue.",
    "   Disadvantage: Suffers from Convoy Effect where small processes wait.",
    "",
    "2. Shortest Job First (SJF): Schedules process with minimum CPU burst.",
    "   Optimal average turnaround time, but requires knowing burst time in advance.",
    "",
    "3. Round Robin (RR): Preemptive. Each process gets a fixed time quantum (q).",
    "   Very fair and responsive for time-sharing interactive systems.",
  ],
  5: [
    "File System Structure and Inodes:",
    "",
    "A file system is a method for storing and organizing files on storage media.",
    "",
    "[Remaining answer space appears blank / incomplete in script scan]",
    "",
    "",
  ],
};

interface Annotation {
  id: string;
  type: 'check' | 'cross' | 'highlight' | 'pen' | 'comment' | 'star';
  x: number;
  y: number;
  text?: string;
}

interface Props {
  scriptId: string;
  onNavigate: (page: string) => void;
}

export default function OSMWorkspace({ scriptId: _scriptId, onNavigate }: Props) {
  const { showToast, addAuditLog } = useApp();
  const [evaluation, setEvaluation] = useState(() => {
    const stored = localStorage.getItem('evalai_evaluation');
    return stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(INITIAL_EVALUATION));
  });
  const [currentQ, setCurrentQ] = useState(2); // 0-indexed → Q3
  const [zoom, setZoom] = useState(100);
  const [editMode, setEditMode] = useState(false);
  const [tempMarks, setTempMarks] = useState<number | ''>('');
  const [feedback, setFeedback] = useState('');
  const [timer, setTimer] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagReason, setFlagReason] = useState('');

  // Interactive Digital Annotation tools
  const [activeTool, setActiveTool] = useState<'check' | 'cross' | 'highlight' | 'pen' | 'comment' | 'star' | null>('check');
  const [annotations, setAnnotations] = useState<Record<number, Annotation[]>>({
    0: [{ id: 'a1', type: 'check', x: 80, y: 110 }, { id: 'a2', type: 'check', x: 80, y: 220 }, { id: 'a3', type: 'star', x: 85, y: 60 }],
    2: [{ id: 'a4', type: 'check', x: 82, y: 80 }, { id: 'a5', type: 'cross', x: 82, y: 260 }, { id: 'a6', type: 'comment', x: 70, y: 280, text: 'Avoidance missing' }],
  });

  const candidate = MOCK_CANDIDATES[0];
  const question = MOCK_EXAM.questions[currentQ];
  const qEval: QuestionEvaluation = evaluation.questionEvaluations[currentQ];

  useEffect(() => {
    const t = setInterval(() => setTimer(p => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setEditMode(false);
    setTempMarks('');
    setFeedback(qEval?.examinerFeedback || '');
  }, [currentQ]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const saveEvaluation = () => {
    localStorage.setItem('evalai_evaluation', JSON.stringify(evaluation));
    setSaved(true);
    showToast('Evaluation marks and annotations saved', 'success');
    setTimeout(() => setSaved(false), 2000);
  };

  const acceptAIScore = () => {
    const updated = { ...evaluation };
    const q = { ...updated.questionEvaluations[currentQ] };
    const prev = q.examinerMarks;
    q.examinerMarks = q.aiSuggestedMarks;
    q.status = 'examiner_verified';
    updated.questionEvaluations[currentQ] = q;
    setEvaluation(updated);

    addAuditLog({
      userId: 'u2', userName: 'Prof. Anita Sharma',
      action: 'Accepted AI score',
      scriptId: evaluation.scriptId,
      questionId: `Q${currentQ + 1}`,
      oldValue: prev?.toString() || '',
      newValue: q.aiSuggestedMarks.toString(),
      details: `AI recommendation verified & accepted for Q${currentQ + 1}`,
    });
    showToast(`AI mark accepted: ${q.aiSuggestedMarks}/${question.maxMarks}`, 'success');
    setEditMode(false);
  };

  const submitMarks = () => {
    if (tempMarks === '' || tempMarks < 0 || Number(tempMarks) > question.maxMarks) return;
    const updated = { ...evaluation };
    const q = { ...updated.questionEvaluations[currentQ] };
    const oldVal = q.examinerMarks;
    q.examinerMarks = Number(tempMarks);
    q.examinerFeedback = feedback;
    q.status = 'examiner_verified';
    q.isChecked = true;
    updated.questionEvaluations[currentQ] = q;
    setEvaluation(updated);
    setEditMode(false);

    addAuditLog({
      userId: 'u2', userName: 'Prof. Anita Sharma',
      action: 'Changed marks',
      scriptId: evaluation.scriptId,
      questionId: `Q${currentQ + 1}`,
      oldValue: oldVal?.toString() || q.aiSuggestedMarks.toString(),
      newValue: tempMarks.toString(),
      details: `Examiner updated Q${currentQ + 1} marks from ${oldVal ?? q.aiSuggestedMarks} to ${tempMarks}`,
    });
    showToast(`Marks awarded: ${tempMarks}/${question.maxMarks}`, 'success');
  };

  const flagQuestion = () => {
    const updated = { ...evaluation };
    const q = { ...updated.questionEvaluations[currentQ] };
    q.status = 'flagged';
    q.flagReason = flagReason;
    updated.questionEvaluations[currentQ] = q;
    setEvaluation(updated);
    setShowFlagModal(false);
    setFlagReason('');
    showToast('Question flagged for moderation review', 'warning');
    addAuditLog({
      userId: 'u2', userName: 'Prof. Anita Sharma',
      action: 'Flagged question',
      scriptId: evaluation.scriptId,
      questionId: `Q${currentQ + 1}`,
      details: `Q${currentQ + 1} flagged: ${flagReason}`,
    });
  };

  const submitEvaluation = () => {
    const updated = { ...evaluation, status: 'submitted', submittedAt: new Date().toISOString() };
    const totalExaminer = updated.questionEvaluations.reduce(
      (sum: number, q: QuestionEvaluation) => sum + (q.examinerMarks ?? q.aiSuggestedMarks), 0
    );
    updated.examinerTotalMarks = totalExaminer;
    setEvaluation(updated);
    localStorage.setItem('evalai_evaluation', JSON.stringify(updated));

    addAuditLog({
      userId: 'u2', userName: 'Prof. Anita Sharma',
      action: 'Submitted evaluation',
      scriptId: evaluation.scriptId,
      details: `Script evaluation completed. Final score: ${totalExaminer}/100`,
    });
    showToast('Evaluation submitted to Moderation ledger!', 'success');
    setTimeout(() => onNavigate('dashboard'), 1500);
  };

  // Handle clicking on the answer sheet to place interactive annotations
  const handlePaperClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeTool) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    const newAnnotation: Annotation = {
      id: `ann-${Date.now()}`,
      type: activeTool,
      x,
      y,
      text: activeTool === 'comment' ? 'Remark noted' : undefined,
    };

    setAnnotations(prev => ({
      ...prev,
      [currentQ]: [...(prev[currentQ] || []), newAnnotation],
    }));

    showToast(`Placed ${activeTool} annotation`, 'info');
  };

  const handleUndoAnnotation = () => {
    setAnnotations(prev => {
      const list = prev[currentQ] || [];
      if (list.length === 0) return prev;
      return {
        ...prev,
        [currentQ]: list.slice(0, list.length - 1),
      };
    });
  };

  const handleClearAnnotations = () => {
    setAnnotations(prev => ({
      ...prev,
      [currentQ]: [],
    }));
    showToast('Cleared annotations on this page', 'info');
  };

  const handwrittenLines = HANDWRITTEN_ANSWERS[question?.number] || [
    "The candidate has provided an answer addressing the key concepts.",
    "Multiple aspects of the question have been covered including",
    "theoretical foundations and practical applications.",
    "",
    "The response demonstrates understanding of the core topic",
    "with appropriate technical terminology used throughout.",
    "",
    "Some aspects could be elaborated further with examples.",
  ];

  const totalExaminerSoFar = evaluation.questionEvaluations.reduce(
    (sum: number, q: QuestionEvaluation) => sum + (q.examinerMarks !== null ? q.examinerMarks : 0), 0
  );
  const verifiedCount = evaluation.questionEvaluations.filter((q: QuestionEvaluation) => q.examinerMarks !== null).length;
  const currentAnnotations = annotations[currentQ] || [];

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 14 }}>
      {/* Top Header Bar - Clean White with Multi-color status badges */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px',
        background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)', flexWrap: 'wrap',
      }}>
        {/* Candidate Info with mask indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={16} color="#2563eb" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{candidate.name}</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Roll: {candidate.enrollmentNo} (Masked on Paper)</div>
          </div>
        </div>

        <div style={{ width: 1, height: 28, background: '#e2e8f0' }} />

        <div>
          <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>SUBJECT</div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0f172a' }}>{MOCK_EXAM.subject} ({MOCK_EXAM.code})</div>
        </div>

        <div style={{ width: 1, height: 28, background: '#e2e8f0' }} />

        <div>
          <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>DIGITIZED SCRIPT ID</div>
          <div style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: '#2563eb' }}>OS-2026-001045</div>
        </div>

        <div style={{ width: 1, height: 28, background: '#e2e8f0' }} />

        {/* Verification Progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{verifiedCount}/{MOCK_EXAM.questions.length} Questions Verified</span>
          <div className="progress-bar" style={{ width: 80, height: 7 }}>
            <div className="progress-fill" style={{ width: `${(verifiedCount / 10) * 100}%`, background: '#059669' }} />
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
          <Clock size={13} color="#64748b" />
          <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>{formatTime(timer)}</span>
        </div>

        {/* Save button */}
        <button className="btn btn-secondary" style={{ fontSize: 12, padding: '7px 14px' }} onClick={saveEvaluation}>
          {saved ? <CheckCircle size={14} color="#059669" /> : <Save size={14} />}
          {saved ? 'Saved' : 'Save Draft'}
        </button>

        {/* Submit button */}
        <button className="btn btn-primary" style={{ fontSize: 12, padding: '7px 16px', background: '#2563eb' }} onClick={submitEvaluation}>
          <Send size={14} /> Submit Final Marks
        </button>
      </div>

      {/* Multi-Color Question Navigator */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
        background: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)', flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: 4 }}>
          Questions:
        </span>
        {evaluation.questionEvaluations.map((qe: QuestionEvaluation, i: number) => {
          const isActive = i === currentQ;
          const isFlagged = qe.status === 'flagged';
          const isVerified = qe.examinerMarks !== null;

          let btnBg = '#f8fafc';
          let btnBorder = '#e2e8f0';
          let btnColor = '#475569';

          if (isActive) {
            btnBg = '#eff6ff';
            btnBorder = '#2563eb';
            btnColor = '#1d4ed8';
          } else if (isFlagged) {
            btnBg = '#fffbeb';
            btnBorder = '#fde68a';
            btnColor = '#d97706';
          } else if (isVerified) {
            btnBg = '#ecfdf5';
            btnBorder = '#a7f3d0';
            btnColor = '#059669';
          }

          return (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              style={{
                width: 38, height: 38, borderRadius: 8, cursor: 'pointer',
                fontWeight: 700, fontSize: 13,
                background: btnBg,
                color: btnColor,
                border: `2px solid ${btnBorder}`,
                transition: 'all 0.15s ease',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                boxShadow: isActive ? '0 2px 4px rgba(37,99,235,0.2)' : 'none',
              }}
              title={`Q${i + 1}: ${isFlagged ? '⚠ Flagged' : isVerified ? `✓ ${qe.examinerMarks}/${MOCK_EXAM.questions[i].maxMarks}` : 'Pending'}`}
            >
              <span>{i + 1}</span>
            </button>
          );
        })}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14, fontSize: 11.5, fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669' }} /> Verified (Green)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#d97706' }} /> Flagged (Amber)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#94a3b8' }} /> Pending (Gray)
          </div>
        </div>
      </div>

      {/* Main OSM Workspace: Left Answer Sheet + Right AI Scoring & Rubrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 16, flex: 1, minHeight: 0 }}>
        {/* LEFT: Answer Sheet Viewer with Interactive Annotation Canvas */}
        <div className="card-solid" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Digital Annotation Toolbar - Multi-Color Tactile Tools */}
          <div style={{
            padding: '10px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
            display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              MARKING TOOLS:
            </span>

            {/* Tool: Checkmark */}
            <button
              onClick={() => setActiveTool(activeTool === 'check' ? null : 'check')}
              className="btn"
              style={{
                padding: '5px 10px', fontSize: 12,
                background: activeTool === 'check' ? '#ecfdf5' : '#ffffff',
                color: activeTool === 'check' ? '#047857' : '#334155',
                border: `1px solid ${activeTool === 'check' ? '#059669' : '#cbd5e1'}`,
              }}
              title="Award mark / Correct"
            >
              <Check size={14} color="#059669" /> Correct (✓)
            </button>

            {/* Tool: Cross */}
            <button
              onClick={() => setActiveTool(activeTool === 'cross' ? null : 'cross')}
              className="btn"
              style={{
                padding: '5px 10px', fontSize: 12,
                background: activeTool === 'cross' ? '#fff1f2' : '#ffffff',
                color: activeTool === 'cross' ? '#be123c' : '#334155',
                border: `1px solid ${activeTool === 'cross' ? '#e11d48' : '#cbd5e1'}`,
              }}
              title="Incorrect / No credit"
            >
              <X size={14} color="#e11d48" /> Incorrect (✗)
            </button>

            {/* Tool: Star */}
            <button
              onClick={() => setActiveTool(activeTool === 'star' ? null : 'star')}
              className="btn"
              style={{
                padding: '5px 10px', fontSize: 12,
                background: activeTool === 'star' ? '#fffbeb' : '#ffffff',
                color: activeTool === 'star' ? '#b45309' : '#334155',
                border: `1px solid ${activeTool === 'star' ? '#d97706' : '#cbd5e1'}`,
              }}
              title="Exemplary Point"
            >
              <Star size={14} color="#d97706" /> Star (★)
            </button>

            {/* Tool: Highlighter */}
            <button
              onClick={() => setActiveTool(activeTool === 'highlight' ? null : 'highlight')}
              className="btn"
              style={{
                padding: '5px 10px', fontSize: 12,
                background: activeTool === 'highlight' ? '#fef3c7' : '#ffffff',
                color: activeTool === 'highlight' ? '#92400e' : '#334155',
                border: `1px solid ${activeTool === 'highlight' ? '#f59e0b' : '#cbd5e1'}`,
              }}
              title="Highlight keyword"
            >
              <Highlighter size={14} color="#d97706" /> Highlight
            </button>

            {/* Tool: Comment */}
            <button
              onClick={() => setActiveTool(activeTool === 'comment' ? null : 'comment')}
              className="btn"
              style={{
                padding: '5px 10px', fontSize: 12,
                background: activeTool === 'comment' ? '#eff6ff' : '#ffffff',
                color: activeTool === 'comment' ? '#1d4ed8' : '#334155',
                border: `1px solid ${activeTool === 'comment' ? '#2563eb' : '#cbd5e1'}`,
              }}
              title="Add remark"
            >
              <MessageSquare size={14} color="#2563eb" /> Remark
            </button>

            <div style={{ width: 1, height: 20, background: '#cbd5e1', margin: '0 4px' }} />

            {/* Undo & Clear */}
            <button
              onClick={handleUndoAnnotation}
              className="btn btn-secondary"
              style={{ padding: '5px 8px', fontSize: 11 }}
              title="Undo last annotation"
            >
              <RotateCcw size={13} /> Undo
            </button>

            <button
              onClick={handleClearAnnotations}
              className="btn btn-secondary"
              style={{ padding: '5px 8px', fontSize: 11, color: '#e11d48' }}
              title="Clear all stamps"
            >
              <Trash2 size={13} /> Clear
            </button>

            <div style={{ flex: 1 }} />

            {/* Zoom Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button onClick={() => setZoom(z => Math.max(70, z - 10))} className="btn btn-secondary" style={{ padding: '4px 8px' }}>
                <ZoomOut size={13} />
              </button>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', minWidth: 36, textAlign: 'center' }}>{zoom}%</span>
              <button onClick={() => setZoom(z => Math.min(150, z + 10))} className="btn btn-secondary" style={{ padding: '4px 8px' }}>
                <ZoomIn size={13} />
              </button>
            </div>
          </div>

          {/* Interactive Answer Paper Canvas */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: 24, background: '#f1f5f9',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <div
              onClick={handlePaperClick}
              style={{
                width: `${10000 / zoom}%`, maxWidth: 760,
                background: '#ffffff', borderRadius: 8, padding: '24px 30px',
                border: '1px solid #cbd5e1', boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                cursor: activeTool ? 'crosshair' : 'default',
                position: 'relative', minHeight: 640,
                transform: `scale(${zoom / 100})`, transformOrigin: 'top center',
              }}
            >
              {/* Institutional Header & Anonymized Roll */}
              <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: 12, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', fontFamily: 'serif' }}>NATIONAL INSTITUTE OF TECHNOLOGY</div>
                  <div style={{ fontSize: 11.5, color: '#334155', fontFamily: 'serif' }}>B.Tech End-Semester Examination · April 2026</div>
                  <div style={{ fontSize: 11.5, color: '#334155', fontFamily: 'serif' }}>Subject: Operating Systems (CSE-401)</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>Barcode: ||||| | |||| |||</div>
                  <div style={{ fontSize: 11, color: '#059669', fontWeight: 700, fontFamily: 'monospace' }}>Roll: [ANONYMIZED]</div>
                  <div style={{ fontSize: 10.5, color: '#64748b' }}>Date: 15-04-2026</div>
                </div>
              </div>

              {/* Question Heading with Max Marks */}
              <div style={{
                marginBottom: 14, padding: '8px 14px', background: '#eff6ff',
                borderRadius: 6, border: '1px solid #bfdbfe', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#1d4ed8' }}>
                  Question {currentQ + 1}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1e3a8a' }}>
                  [{question?.maxMarks} Marks Maximum]
                </span>
              </div>

              {/* Handwritten Answer Simulation on Authentic Ruled Paper */}
              <div className="handwriting-paper" style={{ minHeight: 450, position: 'relative' }}>
                {handwrittenLines.map((line, i) => (
                  <div key={i} style={{
                    color: line === '' ? 'transparent' : '#1e293b',
                    paddingLeft: line.startsWith('   ') ? 24 : 0,
                    fontFamily: "'Georgia', 'Times New Roman', serif",
                    fontWeight: line.startsWith('1)') || line.startsWith('2)') || line.startsWith('3)') || line.startsWith('4)') ? 600 : 400,
                  }}>
                    {line || '\u00A0'}
                  </div>
                ))}

                {/* Render Interactive Annotations Placed by Examiner */}
                {currentAnnotations.map(ann => {
                  if (ann.type === 'check') {
                    return (
                      <div
                        key={ann.id}
                        style={{
                          position: 'absolute', left: ann.x, top: ann.y,
                          width: 26, height: 26, borderRadius: '50%', background: '#059669',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#ffffff', fontWeight: 800, fontSize: 14,
                          boxShadow: '0 2px 6px rgba(5,150,105,0.3)', pointerEvents: 'none',
                        }}
                      >
                        ✓
                      </div>
                    );
                  }
                  if (ann.type === 'cross') {
                    return (
                      <div
                        key={ann.id}
                        style={{
                          position: 'absolute', left: ann.x, top: ann.y,
                          width: 26, height: 26, borderRadius: '50%', background: '#e11d48',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#ffffff', fontWeight: 800, fontSize: 14,
                          boxShadow: '0 2px 6px rgba(225,29,72,0.3)', pointerEvents: 'none',
                        }}
                      >
                        ✗
                      </div>
                    );
                  }
                  if (ann.type === 'star') {
                    return (
                      <div
                        key={ann.id}
                        style={{
                          position: 'absolute', left: ann.x, top: ann.y,
                          fontSize: 22, color: '#d97706', pointerEvents: 'none',
                          filter: 'drop-shadow(0 2px 4px rgba(217,119,6,0.3))',
                        }}
                      >
                        ★
                      </div>
                    );
                  }
                  if (ann.type === 'highlight') {
                    return (
                      <div
                        key={ann.id}
                        style={{
                          position: 'absolute', left: ann.x, top: ann.y,
                          width: 120, height: 24, background: 'rgba(254, 240, 138, 0.65)',
                          borderRadius: 3, borderBottom: '2px solid #facc15', pointerEvents: 'none',
                        }}
                      />
                    );
                  }
                  if (ann.type === 'comment') {
                    return (
                      <div
                        key={ann.id}
                        style={{
                          position: 'absolute', left: ann.x, top: ann.y,
                          background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6,
                          padding: '3px 8px', fontSize: 11, fontWeight: 700, color: '#1d4ed8',
                          boxShadow: '0 2px 8px rgba(37,99,235,0.15)', pointerEvents: 'none',
                        }}
                      >
                        💬 {ann.text || 'Remark'}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Warning note if question is flagged */}
              {qEval.status === 'flagged' && (
                <div style={{ marginTop: 14, padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#b45309' }}>
                    ⚠ Flagged for Moderation: {qEval.flagReason}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Pagination */}
          <div style={{ padding: '12px 18px', borderTop: '1px solid #e2e8f0', background: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              className="btn btn-secondary"
              disabled={currentQ === 0}
              onClick={() => setCurrentQ(q => q - 1)}
            >
              <ChevronLeft size={14} /> Previous Question
            </button>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#475569' }}>
              Question {currentQ + 1} of {MOCK_EXAM.questions.length}
            </span>
            <button
              className="btn btn-secondary"
              disabled={currentQ === MOCK_EXAM.questions.length - 1}
              onClick={() => setCurrentQ(q => q + 1)}
            >
              Next Question <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* RIGHT: AI Evaluation, Marking Scheme, & Action Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
          {/* Question Text Box */}
          <div className="card-solid" style={{ padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <BookOpen size={16} color="#2563eb" />
              <span style={{ fontSize: 12.5, fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Question {currentQ + 1}
              </span>
              <span className="badge badge-blue" style={{ marginLeft: 'auto', fontWeight: 700 }}>
                Max: {question?.maxMarks} marks
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#1e293b', lineHeight: 1.6, fontWeight: 500 }}>{question?.text}</p>
            {question?.topic && (
              <div style={{ marginTop: 8 }}>
                <span className="badge badge-gray">Topic: {question.topic}</span>
              </div>
            )}
          </div>

          {/* AI Step-Wise Marking Rubric */}
          <div className="card-solid" style={{ padding: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Step-Wise Marking Rubrics
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {qEval.aiCheckpoints.map((cp, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px',
                    borderRadius: 8, background: cp.passed ? '#ecfdf5' : '#fff1f2',
                    border: `1px solid ${cp.passed ? '#a7f3d0' : '#fecdd3'}`,
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: cp.passed ? '#059669' : '#e11d48', color: '#ffffff',
                  }}>
                    {cp.passed ? <Check size={11} /> : <X size={11} />}
                  </div>
                  <span style={{ fontSize: 12, color: '#1e293b', fontWeight: 500, flex: 1 }}>
                    {cp.text}
                  </span>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: cp.passed ? '#047857' : '#be123c' }}>
                    {cp.passed ? `+${Math.floor(question?.maxMarks / qEval.aiCheckpoints.length)} pts` : '0 pts'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Analysis & Score Recommendation */}
          <div className="card-solid" style={{ padding: 18, border: '1px solid #bfdbfe', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Brain size={16} color="#7c3aed" />
              <span style={{ fontSize: 12.5, fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                AI Evaluation Assist
              </span>
              <span className="badge badge-green" style={{ marginLeft: 'auto', fontSize: 11 }}>
                {qEval.aiConfidence}% Confidence
              </span>
            </div>

            {/* AI Summary note */}
            <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 12 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#64748b', marginBottom: 3, textTransform: 'uppercase' }}>AI RATIONALE</div>
              <p style={{ fontSize: 12.5, color: '#334155', lineHeight: 1.55 }}>{qEval.aiSummary}</p>
            </div>

            {/* Score Comparison Display */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '12px', background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe' }}>
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: '#1d4ed8', marginBottom: 2 }}>AI SUGGESTION</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#1e3a8a' }}>
                  {qEval.aiSuggestedMarks} <span style={{ fontSize: 13, color: '#64748b' }}>/ {question?.maxMarks}</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: '#047857', marginBottom: 2 }}>EXAMINER AWARD</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: qEval.examinerMarks !== null ? '#059669' : '#94a3b8' }}>
                  {qEval.examinerMarks !== null ? qEval.examinerMarks : '—'} <span style={{ fontSize: 13, color: '#64748b' }}>/ {question?.maxMarks}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Hub - Multi-Color Interactive Buttons */}
          <div className="card-solid" style={{ padding: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Examiner Decision
            </div>

            {!editMode ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Accept AI Score */}
                <button
                  className="btn btn-success"
                  onClick={acceptAIScore}
                  style={{ justifyContent: 'center', padding: '10px 14px', fontSize: 13 }}
                >
                  <CheckCircle size={15} /> Accept AI Score ({qEval.aiSuggestedMarks}/{question?.maxMarks})
                </button>

                {/* Edit Marks */}
                <button
                  className="btn btn-primary"
                  onClick={() => { setEditMode(true); setTempMarks(qEval.examinerMarks ?? qEval.aiSuggestedMarks); }}
                  style={{ justifyContent: 'center', padding: '10px 14px', fontSize: 13 }}
                >
                  <Edit3 size={15} /> Override / Enter Custom Marks
                </button>

                {/* Flag Question */}
                <button
                  className="btn btn-amber"
                  onClick={() => setShowFlagModal(true)}
                  style={{ justifyContent: 'center', padding: '9px 14px', fontSize: 13 }}
                >
                  <Flag size={15} /> Flag for Moderator Review
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11.5, color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    AWARD MARKS (Max {question?.maxMarks})
                  </label>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <input
                      type="number"
                      min={0}
                      max={question?.maxMarks}
                      value={tempMarks}
                      onChange={e => setTempMarks(e.target.value === '' ? '' : Math.min(Number(e.target.value), question?.maxMarks))}
                      className="form-input"
                      style={{ width: 88, textAlign: 'center', fontSize: 22, fontWeight: 800, height: 46 }}
                      autoFocus
                    />
                    <span style={{ fontSize: 18, color: '#64748b', fontWeight: 700 }}>/ {question?.maxMarks}</span>
                    {tempMarks !== '' && tempMarks !== qEval.aiSuggestedMarks && (
                      <span className="badge badge-amber" style={{ fontSize: 11 }}>
                        Δ {Number(tempMarks) > qEval.aiSuggestedMarks ? '+' : ''}{Number(tempMarks) - qEval.aiSuggestedMarks} vs AI
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11.5, color: '#0f172a', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                    EXAMINER REMARKS / JUSTIFICATION
                  </label>
                  <textarea
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                    className="form-input"
                    rows={2}
                    placeholder="e.g., Partial credit for step 2; diagram clarity missing..."
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" onClick={submitMarks} style={{ flex: 1, fontSize: 13 }}>
                    Save Mark
                  </button>
                  <button className="btn btn-secondary" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Running Total Card */}
          <div style={{
            padding: '14px 18px', background: '#ffffff', border: '1px solid #e2e8f0',
            borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>Running Examiner Total</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>
                {totalExaminerSoFar} <span style={{ fontSize: 14, color: '#64748b' }}>/ 100</span>
              </span>
            </div>
            <div style={{ marginTop: 4, fontSize: 11.5, color: '#64748b' }}>
              Baseline AI Total: {evaluation.questionEvaluations.reduce((s: number, q: QuestionEvaluation) => s + q.aiSuggestedMarks, 0)}/100
            </div>
          </div>
        </div>
      </div>

      {/* Flag Modal */}
      {showFlagModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
          <div className="card-solid" style={{ padding: 26, width: 440, background: '#ffffff' }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>
              Flag Question {currentQ + 1} for Moderation
            </h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: '#475569', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                REASON FOR FLAGGING
              </label>
              <select
                className="form-input"
                value={flagReason}
                onChange={e => setFlagReason(e.target.value)}
                style={{ marginBottom: 12 }}
              >
                <option value="">Select reason...</option>
                <option value="Potential unchecked answer page">Potential unchecked answer page</option>
                <option value="Unclear handwriting / OCR discrepancy">Unclear handwriting / OCR discrepancy</option>
                <option value="Incomplete answer but high score requested">Incomplete answer but high score requested</option>
                <option value="Marks exceed question ceiling">Marks exceed question ceiling</option>
                <option value="Candidate grievance / Out of syllabus claim">Candidate grievance / Out of syllabus claim</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-amber" style={{ flex: 1 }} onClick={flagQuestion} disabled={!flagReason}>
                Confirm Flag
              </button>
              <button className="btn btn-secondary" onClick={() => setShowFlagModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
