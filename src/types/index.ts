// Types for EvalAI application

export type UserRole = 'admin' | 'examiner' | 'moderator' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

export interface Exam {
  id: string;
  code: string;
  subject: string;
  branch: string;
  semester: number;
  examDate: string;
  totalMarks: number;
  duration: string;
  totalCandidates: number;
  uploadedScripts: number;
  evaluatedScripts: number;
  pendingScripts: number;
  status: 'upcoming' | 'ongoing' | 'evaluation_in_progress' | 'moderation' | 'completed' | 'published';
  examiners: string[];
  questions: Question[];
}

export interface Question {
  id: string;
  number: number;
  text: string;
  maxMarks: number;
  subQuestions?: SubQuestion[];
  topic: string;
  difficultyPercent: number;
}

export interface SubQuestion {
  id: string;
  label: string;
  text: string;
  maxMarks: number;
}

export interface Candidate {
  id: string;
  enrollmentNo: string;
  name: string;
  branch: string;
  semester: number;
  rollNo: string;
  examScripts: string[];
}

export interface AnswerScript {
  id: string;
  scriptCode: string;
  candidateId: string;
  examId: string;
  uploadedAt: string;
  totalPages: number;
  status: 'uploaded' | 'processing' | 'ai_evaluated' | 'examiner_verified' | 'moderation' | 'finalized';
  barcodeId: string;
  aiProcessed: boolean;
}

export interface QuestionEvaluation {
  questionId: string;
  questionNumber: number;
  aiSuggestedMarks: number;
  aiConfidence: number;
  aiSummary: string;
  aiCheckpoints: { text: string; passed: boolean }[];
  examinerMarks: number | null;
  examinerFeedback: string;
  status: 'pending' | 'ai_evaluated' | 'examiner_verified' | 'flagged';
  flagReason?: string;
  isChecked: boolean;
}

export interface Evaluation {
  id: string;
  scriptId: string;
  candidateId: string;
  examId: string;
  examinerId: string;
  questionEvaluations: QuestionEvaluation[];
  aiTotalMarks: number;
  examinerTotalMarks: number | null;
  finalMarks: number | null;
  status: 'pending' | 'in_progress' | 'submitted' | 'moderated' | 'finalized';
  submittedAt?: string;
  aiConfidenceAvg: number;
}

export interface ModerationCase {
  id: string;
  scriptId: string;
  candidateId: string;
  examId: string;
  examinerAMarks: number;
  examinerBMarks: number;
  difference: number;
  moderatorId?: string;
  finalMarks?: number;
  reason?: string;
  status: 'pending' | 'under_review' | 'completed';
  createdAt: string;
  resolvedAt?: string;
}

export interface AnomalyAlert {
  id: string;
  type: 'high_variance' | 'rapid_evaluation' | 'pattern_deviation' | 'similarity';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  affectedScripts?: string[];
  examinerId?: string;
  status: 'active' | 'reviewed' | 'dismissed';
  detectedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  scriptId?: string;
  questionId?: string;
  oldValue?: string;
  newValue?: string;
  details: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface RevaluationRequest {
  id: string;
  studentId: string;
  studentName: string;
  examId: string;
  subject: string;
  questionNumber: number;
  originalMarks: number;
  reason: string;
  status: 'requested' | 'under_review' | 'completed';
  submittedAt: string;
  resolvedAt?: string;
  revisedMarks?: number;
}

export interface LearningOutcome {
  topic: string;
  masteryPercent: number;
  candidateCount: number;
}

export interface ExaminerPerformance {
  examinerId: string;
  examinerName: string;
  scriptsEvaluated: number;
  avgScore: number;
  avgTimeMinutes: number;
  aiAcceptanceRate: number;
  scoreDeviation: string;
  flagCount: number;
}
