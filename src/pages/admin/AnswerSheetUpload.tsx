import React, { useState, useCallback } from 'react';
import { Upload, File, CheckCircle, X, QrCode, ArrowRight, ClipboardList } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const STAGES = [
  { id: 'upload', label: 'PDF Digitization & Ingestion', duration: 400 },
  { id: 'detect', label: 'Barcode / QR Roll No Masking', duration: 600 },
  { id: 'enhance', label: 'Contrast & Deskew Optimization', duration: 700 },
  { id: 'ocr', label: 'TrOCR Handwriting Recognition', duration: 900 },
  { id: 'segment', label: 'Question Boundary Segmentation', duration: 800 },
  { id: 'ai', label: 'Step-Wise Rubric AI Evaluation', duration: 1200 },
];

interface Props { onNavigate: (page: string) => void; }

export default function AnswerSheetUpload({ onNavigate }: Props) {
  const { showToast, addAuditLog, addNotification } = useApp();
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<{ name: string; size: string; pages: number; candidateId: string; scriptId: string }[]>([
    { name: 'OS-2026-001045.pdf', size: '4.2 MB', pages: 8, candidateId: '24CSE1045', scriptId: 'OS-2026-001045' },
  ]);
  const [processing, setProcessing] = useState(false);
  const [completedStages, setCompletedStages] = useState<string[]>([]);
  const [currentStage, setCurrentStage] = useState('');
  const [done, setDone] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const newFiles = Array.from(e.dataTransfer.files).map(f => ({
      name: f.name,
      size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      pages: Math.floor(Math.random() * 5) + 6,
      candidateId: `24CSE${Math.floor(1040 + Math.random() * 20)}`,
      scriptId: `OS-2026-00${Math.floor(1046 + Math.random() * 20)}`,
    }));
    setFiles(prev => [...prev, ...newFiles]);
    showToast(`${newFiles.length} file(s) added`, 'success');
  }, [showToast]);

  const processWithAI = async () => {
    setProcessing(true);
    setCompletedStages([]);
    setDone(false);

    for (const stage of STAGES) {
      setCurrentStage(stage.id);
      await new Promise(r => setTimeout(r, stage.duration));
      setCompletedStages(prev => [...prev, stage.id]);
    }

    setCurrentStage('');
    setDone(true);
    setProcessing(false);

    addAuditLog({
      userId: 'u1', userName: 'Dr. Rajesh Kumar',
      action: 'AI Processing triggered',
      scriptId: files[0]?.scriptId,
      details: `OCR and AI evaluation pipeline completed for ${files.length} script(s)`,
    });
    addNotification({
      type: 'success',
      title: 'AI Processing Complete',
      message: `${files.length} answer sheet(s) ingested & parsed into OSM.`,
    });
    showToast('AI ingestion pipeline finished successfully!', 'success');
  };

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 className="section-title">Answer Sheet Scanning & Ingestion Pipeline</h1>
        <p className="section-subtitle">
          Automated batch upload, barcode anonymization, handwriting OCR, and initial AI rubric grading
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
        {/* Left: Upload + File list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Drop zone */}
          <div
            className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              padding: '44px 24px', textAlign: 'center', position: 'relative',
              background: '#ffffff', border: '2px dashed #93c5fd', borderRadius: 12,
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}
          >
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.png,.tiff"
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
              onChange={e => {
                const newFiles = Array.from(e.target.files || []).map(f => ({
                  name: f.name,
                  size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
                  pages: Math.floor(Math.random() * 5) + 6,
                  candidateId: `24CSE${Math.floor(1040 + Math.random() * 20)}`,
                  scriptId: `OS-2026-00${Math.floor(1046 + Math.random() * 20)}`,
                }));
                if (newFiles.length) {
                  setFiles(prev => [...prev, ...newFiles]);
                  showToast(`${newFiles.length} file(s) queued`, 'success');
                }
              }}
            />
            <div style={{ fontSize: 40, marginBottom: 12 }}>📤</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
              Drop Scanned Examination Booklets Here
            </div>
            <div style={{ fontSize: 13, color: '#64748b' }}>
              Multi-page PDF, TIFF, or high-res JPG/PNG supported · Auto barcode detection
            </div>
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 8 }}>
              <span className="btn btn-secondary" style={{ fontSize: 12, padding: '6px 14px' }}>
                Browse Files
              </span>
            </div>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="card-solid" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a' }}>
                  Queued Answer Scripts ({files.length})
                </span>
                <button
                  className="btn btn-secondary"
                  style={{ fontSize: 11, padding: '4px 10px' }}
                  onClick={() => setFiles([])}
                >
                  Clear Queue
                </button>
              </div>

              {files.map((f, i) => (
                <div key={i} style={{
                  padding: '14px 20px',
                  borderBottom: i < files.length - 1 ? '1px solid #f1f5f9' : 'none',
                  display: 'flex', gap: 14, alignItems: 'center',
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <File size={18} color="#2563eb" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a' }}>{f.name}</div>
                    <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 3, display: 'flex', gap: 14 }}>
                      <span>📄 {f.pages} pages</span>
                      <span>💾 {f.size}</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>ID: {f.candidateId}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>OSM SCRIPT ID</div>
                      <div style={{ fontFamily: 'monospace', color: '#2563eb', fontWeight: 700, fontSize: 12 }}>{f.scriptId}</div>
                    </div>
                    {/* Barcode representation */}
                    <div style={{ display: 'flex', gap: 1.5, alignItems: 'flex-end', height: 26, background: '#f8fafc', padding: '2px 4px', borderRadius: 4 }}>
                      {Array.from({ length: 14 }).map((_, j) => (
                        <div key={j} style={{ width: j % 3 === 0 ? 3 : 1.5, height: `${40 + Math.random() * 60}%`, background: '#334155' }} />
                      ))}
                    </div>
                    <button
                      onClick={() => setFiles(prev => prev.filter((_, idx) => idx !== i))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', padding: 5 }}
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Process button */}
          <button
            className="btn btn-primary"
            style={{ padding: '13px', fontSize: 15, fontWeight: 800, background: '#2563eb' }}
            onClick={processWithAI}
            disabled={processing || files.length === 0}
          >
            {processing ? (
              'Running OCR & AI Segmentation Pipeline...'
            ) : done ? (
              <>✓ Batch Ingested — Ready for Marking in OSM</>
            ) : (
              <><Upload size={16} /> Run Automated Digitization & AI Rubric</>
            )}
          </button>
        </div>

        {/* Right: Pipeline progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card-solid" style={{ padding: 22 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 18 }}>
              Ingestion Pipeline Stages
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {STAGES.map((stage, i) => {
                const isComplete = completedStages.includes(stage.id);
                const isCurrent = currentStage === stage.id;

                let iconBg = '#f8fafc';
                let iconBorder = '#e2e8f0';
                let iconColor = '#64748b';

                if (isComplete) {
                  iconBg = '#ecfdf5';
                  iconBorder = '#a7f3d0';
                  iconColor = '#059669';
                } else if (isCurrent) {
                  iconBg = '#eff6ff';
                  iconBorder = '#bfdbfe';
                  iconColor = '#2563eb';
                }

                return (
                  <div key={stage.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0' }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: iconBg, border: `1.5px solid ${iconBorder}`,
                        transition: 'all 0.25s ease',
                      }}>
                        {isComplete ? (
                          <CheckCircle size={15} color="#059669" />
                        ) : isCurrent ? (
                          <span style={{ fontSize: 11, fontWeight: 800, color: '#2563eb' }}>●</span>
                        ) : (
                          <span style={{ fontSize: 11.5, fontWeight: 700, color: iconColor }}>{i + 1}</span>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: isComplete ? '#047857' : isCurrent ? '#1d4ed8' : '#64748b' }}>
                          {stage.label}
                        </div>
                        {isCurrent && (
                          <div className="progress-bar" style={{ marginTop: 5, height: 5, background: '#dbeafe' }}>
                            <div className="progress-fill" style={{ width: '80%', background: '#2563eb' }} />
                          </div>
                        )}
                      </div>
                    </div>
                    {i < STAGES.length - 1 && (
                      <div style={{ marginLeft: 14, width: 1.5, height: 10, background: '#e2e8f0' }} />
                    )}
                  </div>
                );
              })}
            </div>

            {done && (
              <div style={{ marginTop: 22, padding: '16px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <CheckCircle size={18} color="#059669" />
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#047857' }}>Ingestion Complete</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { label: 'Questions Segmented', val: '10' },
                    { label: 'Initial AI Baseline', val: '78 / 100' },
                    { label: 'OCR Confidence', val: '94.2%' },
                    { label: 'Unchecked Pages Alert', val: 'None detected' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: '#475569' }}>{item.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{item.val}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: 14, fontSize: 13, background: '#059669', borderColor: '#047857' }}
                  onClick={() => onNavigate('osm')}
                >
                  <ClipboardList size={14} /> Open in OSM Workspace <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Script preview card */}
          <div className="card-solid" style={{ padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Digitized Script Metadata
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
              <QrCode size={36} color="#2563eb" />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: '#0f172a' }}>OS-2026-001045</div>
                <div style={{ fontSize: 11.5, color: '#64748b' }}>Barcode Anonymized · B.Tech CSE</div>
              </div>
            </div>
            {/* Page thumbnails */}
            <div style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{
                  width: 28, height: 38, borderRadius: 4,
                  background: i === 0 ? '#eff6ff' : '#f8fafc',
                  border: `1px solid ${i === 0 ? '#2563eb' : '#e2e8f0'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, color: i === 0 ? '#2563eb' : '#64748b',
                }}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
