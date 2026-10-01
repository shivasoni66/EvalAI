import type {
  User, Exam, Candidate, AnswerScript, Evaluation,
  ModerationCase, AnomalyAlert, AuditLog, Notification,
  RevaluationRequest, ExaminerPerformance, LearningOutcome
} from '../types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Dr. Rajesh Kumar', email: 'admin@evalai.demo', role: 'admin', department: 'Academic Affairs' },
  { id: 'u2', name: 'Prof. Anita Sharma', email: 'examiner@evalai.demo', role: 'examiner', department: 'Computer Science' },
  { id: 'u3', name: 'Dr. Vikram Singh', email: 'moderator@evalai.demo', role: 'moderator', department: 'Academic Affairs' },
  { id: 'u4', name: 'Shiva Soni', email: 'student@evalai.demo', role: 'student', department: 'B.Tech CSE' },
];

export const MOCK_EXAM: Exam = {
  id: 'exam1',
  code: 'CSE-OS-2026',
  subject: 'Operating Systems',
  branch: 'B.Tech CSE',
  semester: 4,
  examDate: '2026-04-15',
  totalMarks: 100,
  duration: '3 hours',
  totalCandidates: 12480,
  uploadedScripts: 11920,
  evaluatedScripts: 10842,
  pendingScripts: 1078,
  status: 'evaluation_in_progress',
  examiners: ['E101', 'E102', 'E103', 'E104', 'E105'],
  questions: [
    {
      id: 'q1', number: 1,
      text: 'What is an operating system? Explain its major functions with suitable examples.',
      maxMarks: 10, topic: 'OS Fundamentals', difficultyPercent: 82,
    },
    {
      id: 'q2', number: 2,
      text: 'Describe the concept of process scheduling. Compare FCFS, SJF, and Round Robin algorithms with examples.',
      maxMarks: 10, topic: 'CPU Scheduling', difficultyPercent: 74,
    },
    {
      id: 'q3', number: 3,
      text: 'Explain the necessary conditions for deadlock. How can deadlock be prevented?',
      maxMarks: 10, topic: 'Deadlocks', difficultyPercent: 41,
    },
    {
      id: 'q4', number: 4,
      text: 'Explain virtual memory. Describe demand paging and the page replacement algorithms.',
      maxMarks: 10, topic: 'Memory Management', difficultyPercent: 68,
    },
    {
      id: 'q5', number: 5,
      text: 'What is file system? Explain the different file allocation methods with diagrams.',
      maxMarks: 10, topic: 'File Systems', difficultyPercent: 29,
    },
    {
      id: 'q6', number: 6,
      text: 'Explain the Producer-Consumer problem and its solution using semaphores.',
      maxMarks: 10, topic: 'Process Synchronization', difficultyPercent: 56,
    },
    {
      id: 'q7', number: 7,
      text: 'What is Banker\'s Algorithm? Solve the following deadlock avoidance problem.',
      maxMarks: 10, topic: 'Deadlocks', difficultyPercent: 38,
    },
    {
      id: 'q8', number: 8,
      text: 'Explain disk scheduling algorithms: SSTF, SCAN, and C-SCAN with examples.',
      maxMarks: 10, topic: 'I/O Management', difficultyPercent: 63,
    },
    {
      id: 'q9', number: 9,
      text: 'Describe the various states of a process and the transitions between them.',
      maxMarks: 10, topic: 'Process Management', difficultyPercent: 77,
    },
    {
      id: 'q10', number: 10,
      text: 'Write short notes on: (a) Spooling (b) Buffering (c) Thrashing (d) TLB',
      maxMarks: 10, topic: 'OS Concepts', difficultyPercent: 71,
    },
  ],
};

export const MOCK_CANDIDATES: Candidate[] = [
  { id: 'c1', enrollmentNo: '24CSE1045', name: 'Shiva Soni', branch: 'B.Tech CSE', semester: 4, rollNo: 'CSE-045', examScripts: ['s1'] },
  { id: 'c2', enrollmentNo: '24CSE1046', name: 'Priya Patel', branch: 'B.Tech CSE', semester: 4, rollNo: 'CSE-046', examScripts: ['s2'] },
  { id: 'c3', enrollmentNo: '24CSE1047', name: 'Arjun Mehta', branch: 'B.Tech CSE', semester: 4, rollNo: 'CSE-047', examScripts: ['s3'] },
  { id: 'c4', enrollmentNo: '24CSE1048', name: 'Neha Gupta', branch: 'B.Tech CSE', semester: 4, rollNo: 'CSE-048', examScripts: ['s4'] },
  { id: 'c5', enrollmentNo: '24CSE1049', name: 'Rahul Verma', branch: 'B.Tech CSE', semester: 4, rollNo: 'CSE-049', examScripts: ['s5'] },
  { id: 'c6', enrollmentNo: '24CSE1050', name: 'Anjali Singh', branch: 'B.Tech CSE', semester: 4, rollNo: 'CSE-050', examScripts: ['s6'] },
  { id: 'c7', enrollmentNo: '24CSE1051', name: 'Karan Sharma', branch: 'B.Tech CSE', semester: 4, rollNo: 'CSE-051', examScripts: ['s7'] },
  { id: 'c8', enrollmentNo: '24CSE1052', name: 'Divya Agarwal', branch: 'B.Tech CSE', semester: 4, rollNo: 'CSE-052', examScripts: ['s8'] },
  { id: 'c9', enrollmentNo: '24CSE1053', name: 'Mohit Yadav', branch: 'B.Tech CSE', semester: 4, rollNo: 'CSE-053', examScripts: ['s9'] },
  { id: 'c10', enrollmentNo: '24CSE1054', name: 'Sneha Joshi', branch: 'B.Tech CSE', semester: 4, rollNo: 'CSE-054', examScripts: ['s10'] },
  { id: 'c11', enrollmentNo: '24CSE1055', name: 'Vikash Kumar', branch: 'B.Tech CSE', semester: 4, rollNo: 'CSE-055', examScripts: ['s11'] },
  { id: 'c12', enrollmentNo: '24CSE1056', name: 'Pooja Mishra', branch: 'B.Tech CSE', semester: 4, rollNo: 'CSE-056', examScripts: ['s12'] },
  { id: 'c13', enrollmentNo: '24CSE1057', name: 'Suresh Nair', branch: 'B.Tech CSE', semester: 4, rollNo: 'CSE-057', examScripts: ['s13'] },
  { id: 'c14', enrollmentNo: '24CSE1058', name: 'Ritu Pandey', branch: 'B.Tech CSE', semester: 4, rollNo: 'CSE-058', examScripts: ['s14'] },
  { id: 'c15', enrollmentNo: '24CSE1059', name: 'Amit Trivedi', branch: 'B.Tech CSE', semester: 4, rollNo: 'CSE-059', examScripts: ['s15'] },
  { id: 'c16', enrollmentNo: '24CSE1060', name: 'Meena Choudhary', branch: 'B.Tech CSE', semester: 4, rollNo: 'CSE-060', examScripts: ['s16'] },
  { id: 'c17', enrollmentNo: '24CSE1061', name: 'Deepak Raj', branch: 'B.Tech CSE', semester: 4, rollNo: 'CSE-061', examScripts: ['s17'] },
  { id: 'c18', enrollmentNo: '24CSE1062', name: 'Kavita Srivastava', branch: 'B.Tech CSE', semester: 4, rollNo: 'CSE-062', examScripts: ['s18'] },
  { id: 'c19', enrollmentNo: '24CSE1063', name: 'Rohit Dubey', branch: 'B.Tech CSE', semester: 4, rollNo: 'CSE-063', examScripts: ['s19'] },
  { id: 'c20', enrollmentNo: '24CSE1064', name: 'Sunita Bhatt', branch: 'B.Tech CSE', semester: 4, rollNo: 'CSE-064', examScripts: ['s20'] },
];

export const MOCK_SCRIPTS: AnswerScript[] = [
  { id: 's1', scriptCode: 'OS-2026-001045', candidateId: 'c1', examId: 'exam1', uploadedAt: '2026-04-15T10:30:00', totalPages: 8, status: 'examiner_verified', barcodeId: 'BC240000001', aiProcessed: true },
  { id: 's2', scriptCode: 'OS-2026-001046', candidateId: 'c2', examId: 'exam1', uploadedAt: '2026-04-15T10:32:00', totalPages: 7, status: 'ai_evaluated', barcodeId: 'BC240000002', aiProcessed: true },
  { id: 's3', scriptCode: 'OS-2026-001047', candidateId: 'c3', examId: 'exam1', uploadedAt: '2026-04-15T10:35:00', totalPages: 9, status: 'moderation', barcodeId: 'BC240000003', aiProcessed: true },
  { id: 's4', scriptCode: 'OS-2026-001048', candidateId: 'c4', examId: 'exam1', uploadedAt: '2026-04-15T10:38:00', totalPages: 8, status: 'finalized', barcodeId: 'BC240000004', aiProcessed: true },
  { id: 's5', scriptCode: 'OS-2026-001049', candidateId: 'c5', examId: 'exam1', uploadedAt: '2026-04-15T10:40:00', totalPages: 6, status: 'ai_evaluated', barcodeId: 'BC240000005', aiProcessed: true },
  { id: 's6', scriptCode: 'OS-2026-001050', candidateId: 'c6', examId: 'exam1', uploadedAt: '2026-04-15T10:42:00', totalPages: 8, status: 'ai_evaluated', barcodeId: 'BC240000006', aiProcessed: true },
  { id: 's7', scriptCode: 'OS-2026-001051', candidateId: 'c7', examId: 'exam1', uploadedAt: '2026-04-15T10:45:00', totalPages: 7, status: 'uploaded', barcodeId: 'BC240000007', aiProcessed: false },
  { id: 's8', scriptCode: 'OS-2026-001052', candidateId: 'c8', examId: 'exam1', uploadedAt: '2026-04-15T10:48:00', totalPages: 9, status: 'processing', barcodeId: 'BC240000008', aiProcessed: false },
  { id: 's9', scriptCode: 'OS-2026-001053', candidateId: 'c9', examId: 'exam1', uploadedAt: '2026-04-15T10:50:00', totalPages: 8, status: 'ai_evaluated', barcodeId: 'BC240000009', aiProcessed: true },
  { id: 's10', scriptCode: 'OS-2026-001054', candidateId: 'c10', examId: 'exam1', uploadedAt: '2026-04-15T10:52:00', totalPages: 8, status: 'examiner_verified', barcodeId: 'BC240000010', aiProcessed: true },
  { id: 's11', scriptCode: 'OS-2026-001055', candidateId: 'c11', examId: 'exam1', uploadedAt: '2026-04-15T10:55:00', totalPages: 6, status: 'ai_evaluated', barcodeId: 'BC240000011', aiProcessed: true },
  { id: 's12', scriptCode: 'OS-2026-001056', candidateId: 'c12', examId: 'exam1', uploadedAt: '2026-04-15T10:58:00', totalPages: 8, status: 'finalized', barcodeId: 'BC240000012', aiProcessed: true },
  { id: 's13', scriptCode: 'OS-2026-001057', candidateId: 'c13', examId: 'exam1', uploadedAt: '2026-04-15T11:00:00', totalPages: 7, status: 'moderation', barcodeId: 'BC240000013', aiProcessed: true },
  { id: 's14', scriptCode: 'OS-2026-001058', candidateId: 'c14', examId: 'exam1', uploadedAt: '2026-04-15T11:02:00', totalPages: 9, status: 'ai_evaluated', barcodeId: 'BC240000014', aiProcessed: true },
  { id: 's15', scriptCode: 'OS-2026-001059', candidateId: 'c15', examId: 'exam1', uploadedAt: '2026-04-15T11:05:00', totalPages: 8, status: 'ai_evaluated', barcodeId: 'BC240000015', aiProcessed: true },
  { id: 's16', scriptCode: 'OS-2026-001060', candidateId: 'c16', examId: 'exam1', uploadedAt: '2026-04-15T11:08:00', totalPages: 7, status: 'examiner_verified', barcodeId: 'BC240000016', aiProcessed: true },
  { id: 's17', scriptCode: 'OS-2026-001061', candidateId: 'c17', examId: 'exam1', uploadedAt: '2026-04-15T11:10:00', totalPages: 8, status: 'ai_evaluated', barcodeId: 'BC240000017', aiProcessed: true },
  { id: 's18', scriptCode: 'OS-2026-001062', candidateId: 'c18', examId: 'exam1', uploadedAt: '2026-04-15T11:12:00', totalPages: 9, status: 'finalized', barcodeId: 'BC240000018', aiProcessed: true },
  { id: 's19', scriptCode: 'OS-2026-001063', candidateId: 'c19', examId: 'exam1', uploadedAt: '2026-04-15T11:15:00', totalPages: 7, status: 'ai_evaluated', barcodeId: 'BC240000019', aiProcessed: true },
  { id: 's20', scriptCode: 'OS-2026-001064', candidateId: 'c20', examId: 'exam1', uploadedAt: '2026-04-15T11:18:00', totalPages: 8, status: 'ai_evaluated', barcodeId: 'BC240000020', aiProcessed: true },
];

export const INITIAL_EVALUATION: Evaluation = {
  id: 'ev1',
  scriptId: 's1',
  candidateId: 'c1',
  examId: 'exam1',
  examinerId: 'u2',
  aiTotalMarks: 78,
  examinerTotalMarks: null,
  finalMarks: null,
  status: 'in_progress',
  aiConfidenceAvg: 89,
  questionEvaluations: [
    {
      questionId: 'q1', questionNumber: 1,
      aiSuggestedMarks: 8, aiConfidence: 92, isChecked: true,
      aiSummary: 'Candidate demonstrates strong understanding of OS fundamentals including resource management, process management, and memory management.',
      aiCheckpoints: [
        { text: 'Definition of OS provided', passed: true },
        { text: 'Resource management function explained', passed: true },
        { text: 'Process management function explained', passed: true },
        { text: 'Memory management function explained', passed: true },
        { text: 'Suitable examples provided', passed: false },
      ],
      examinerMarks: 8, examinerFeedback: '', status: 'examiner_verified',
    },
    {
      questionId: 'q2', questionNumber: 2,
      aiSuggestedMarks: 9, aiConfidence: 87, isChecked: true,
      aiSummary: 'Excellent comparison of scheduling algorithms. FCFS, SJF and Round Robin all well explained with examples.',
      aiCheckpoints: [
        { text: 'Process scheduling concept defined', passed: true },
        { text: 'FCFS algorithm explained correctly', passed: true },
        { text: 'SJF algorithm explained correctly', passed: true },
        { text: 'Round Robin algorithm explained correctly', passed: true },
        { text: 'Comparative analysis provided', passed: true },
      ],
      examinerMarks: 9, examinerFeedback: '', status: 'examiner_verified',
    },
    {
      questionId: 'q3', questionNumber: 3,
      aiSuggestedMarks: 8, aiConfidence: 91, isChecked: true,
      aiSummary: 'Candidate correctly explains most necessary deadlock conditions. Circular wait explanation is partially incomplete.',
      aiCheckpoints: [
        { text: 'Correct definition of deadlock', passed: true },
        { text: 'Mutual exclusion identified', passed: true },
        { text: 'Hold and wait explained', passed: true },
        { text: 'No preemption explained', passed: true },
        { text: 'Circular wait explanation complete', passed: false },
      ],
      examinerMarks: null, examinerFeedback: '', status: 'ai_evaluated',
    },
    {
      questionId: 'q4', questionNumber: 4,
      aiSuggestedMarks: 7, aiConfidence: 85, isChecked: true,
      aiSummary: 'Virtual memory concept explained. Demand paging described. Page replacement algorithms partially covered.',
      aiCheckpoints: [
        { text: 'Virtual memory concept explained', passed: true },
        { text: 'Demand paging described', passed: true },
        { text: 'FIFO page replacement explained', passed: true },
        { text: 'LRU page replacement explained', passed: false },
        { text: 'Optimal algorithm mentioned', passed: false },
      ],
      examinerMarks: null, examinerFeedback: '', status: 'ai_evaluated',
    },
    {
      questionId: 'q5', questionNumber: 5,
      aiSuggestedMarks: 0, aiConfidence: 62, isChecked: false,
      aiSummary: 'Answer detected but response appears very minimal. Possible incomplete or unchecked answer.',
      aiCheckpoints: [
        { text: 'File system definition provided', passed: false },
        { text: 'Contiguous allocation explained', passed: false },
        { text: 'Linked allocation explained', passed: false },
        { text: 'Indexed allocation explained', passed: false },
        { text: 'Diagrams included', passed: false },
      ],
      examinerMarks: null, examinerFeedback: '', status: 'flagged', flagReason: 'Potential unchecked answer',
    },
    {
      questionId: 'q6', questionNumber: 6,
      aiSuggestedMarks: 8, aiConfidence: 88, isChecked: true,
      aiSummary: 'Producer-Consumer problem well described. Semaphore-based solution clearly explained.',
      aiCheckpoints: [
        { text: 'Problem statement explained', passed: true },
        { text: 'Semaphore concept defined', passed: true },
        { text: 'Wait and signal operations described', passed: true },
        { text: 'Solution code/pseudocode provided', passed: true },
        { text: 'Race condition analysis included', passed: false },
      ],
      examinerMarks: null, examinerFeedback: '', status: 'ai_evaluated',
    },
    {
      questionId: 'q7', questionNumber: 7,
      aiSuggestedMarks: 7, aiConfidence: 83, isChecked: true,
      aiSummary: 'Banker\'s Algorithm concept understood. Numerical problem solution partially correct.',
      aiCheckpoints: [
        { text: 'Banker\'s Algorithm concept explained', passed: true },
        { text: 'Safe state defined', passed: true },
        { text: 'Resource allocation matrix setup', passed: true },
        { text: 'Need matrix calculated', passed: true },
        { text: 'Safe sequence identified correctly', passed: false },
      ],
      examinerMarks: null, examinerFeedback: '', status: 'ai_evaluated',
    },
    {
      questionId: 'q8', questionNumber: 8,
      aiSuggestedMarks: 9, aiConfidence: 94, isChecked: true,
      aiSummary: 'Excellent coverage of disk scheduling algorithms. Clear examples and calculations provided.',
      aiCheckpoints: [
        { text: 'SSTF algorithm explained correctly', passed: true },
        { text: 'SCAN algorithm explained correctly', passed: true },
        { text: 'C-SCAN algorithm explained correctly', passed: true },
        { text: 'Examples with calculations', passed: true },
        { text: 'Performance comparison provided', passed: true },
      ],
      examinerMarks: null, examinerFeedback: '', status: 'ai_evaluated',
    },
    {
      questionId: 'q9', questionNumber: 9,
      aiSuggestedMarks: 9, aiConfidence: 96, isChecked: true,
      aiSummary: 'Process states and transitions excellently described. Diagram is clear and accurate.',
      aiCheckpoints: [
        { text: 'All process states identified', passed: true },
        { text: 'New state described', passed: true },
        { text: 'Ready, Running states described', passed: true },
        { text: 'Blocked, Terminated states described', passed: true },
        { text: 'State transitions clearly explained', passed: true },
      ],
      examinerMarks: null, examinerFeedback: '', status: 'ai_evaluated',
    },
    {
      questionId: 'q10', questionNumber: 10,
      aiSuggestedMarks: 8, aiConfidence: 87, isChecked: true,
      aiSummary: 'Short notes are satisfactory. Spooling and Buffering well covered. TLB explanation slightly brief.',
      aiCheckpoints: [
        { text: 'Spooling concept explained', passed: true },
        { text: 'Buffering concept explained', passed: true },
        { text: 'Thrashing explained', passed: true },
        { text: 'TLB explained', passed: false },
        { text: 'Examples or diagrams provided', passed: true },
      ],
      examinerMarks: null, examinerFeedback: '', status: 'ai_evaluated',
    },
  ],
};

export const MOCK_MODERATION_CASES: ModerationCase[] = [
  {
    id: 'mod1', scriptId: 's3', candidateId: 'c3', examId: 'exam1',
    examinerAMarks: 54, examinerBMarks: 67, difference: 13,
    status: 'pending', createdAt: '2026-04-16T09:30:00',
  },
  {
    id: 'mod2', scriptId: 's13', candidateId: 'c13', examId: 'exam1',
    examinerAMarks: 71, examinerBMarks: 58, difference: 13,
    status: 'under_review', createdAt: '2026-04-16T10:15:00',
    moderatorId: 'u3',
  },
  {
    id: 'mod3', scriptId: 's5', candidateId: 'c5', examId: 'exam1',
    examinerAMarks: 62, examinerBMarks: 74, difference: 12,
    status: 'completed', createdAt: '2026-04-16T08:00:00', resolvedAt: '2026-04-16T11:30:00',
    moderatorId: 'u3', finalMarks: 68, reason: 'After reviewing both evaluations, final marks awarded as average.',
  },
];

export const MOCK_ANOMALIES: AnomalyAlert[] = [
  {
    id: 'an1', type: 'high_variance', severity: 'high',
    title: 'High Score Variance Detected',
    description: 'Q4 scores for semantically similar answers vary between 4 and 9 marks across different examiners.',
    affectedScripts: ['s3', 's7', 's14'], status: 'active',
    detectedAt: '2026-04-16T08:45:00',
  },
  {
    id: 'an2', type: 'rapid_evaluation', severity: 'medium',
    title: 'Unusually Rapid Evaluation',
    description: '18 scripts were evaluated in under 2 minutes each by Examiner E104. Average evaluation time is 4m 12s.',
    examinerId: 'E104', status: 'active',
    detectedAt: '2026-04-16T09:20:00',
  },
  {
    id: 'an3', type: 'pattern_deviation', severity: 'medium',
    title: 'Unusual Scoring Pattern',
    description: 'Examiner E104 scores show significant deviation from subject average. Mean deviation: +12.4 marks.',
    examinerId: 'E104', status: 'reviewed',
    detectedAt: '2026-04-16T10:00:00',
  },
  {
    id: 'an4', type: 'similarity', severity: 'low',
    title: 'High Similarity Detected',
    description: 'Two candidate responses (OS-001047, OS-001055) have unusually high semantic similarity (87%).',
    affectedScripts: ['s3', 's11'], status: 'active',
    detectedAt: '2026-04-16T10:30:00',
  },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'a1', timestamp: '2026-04-16T14:32:00', userId: 'u2', userName: 'Prof. Anita Sharma', action: 'Changed marks', scriptId: 'OS-001245', questionId: 'Q3', oldValue: '6', newValue: '8', details: 'Examiner reviewed AI suggestion and increased marks' },
  { id: 'a2', timestamp: '2026-04-16T14:15:00', userId: 'u1', userName: 'Dr. Rajesh Kumar', action: 'Flagged script', scriptId: 'OS-001189', details: 'Script flagged for anomaly review' },
  { id: 'a3', timestamp: '2026-04-16T13:58:00', userId: 'u2', userName: 'Prof. Anita Sharma', action: 'Accepted AI score', scriptId: 'OS-001098', questionId: 'Q1', oldValue: '', newValue: '8', details: 'AI suggestion accepted without change' },
  { id: 'a4', timestamp: '2026-04-16T13:45:00', userId: 'u3', userName: 'Dr. Vikram Singh', action: 'Created moderation request', scriptId: 'OS-001047', details: 'Moderation requested due to 13-mark difference between evaluators' },
  { id: 'a5', timestamp: '2026-04-16T13:20:00', userId: 'u2', userName: 'Prof. Anita Sharma', action: 'Submitted evaluation', scriptId: 'OS-001045', details: 'Evaluation submitted. Examiner marks: 79/100' },
  { id: 'a6', timestamp: '2026-04-16T13:05:00', userId: 'u1', userName: 'Dr. Rajesh Kumar', action: 'Uploaded answer sheet', scriptId: 'OS-001055', details: 'New answer sheet uploaded and queued for AI processing' },
  { id: 'a7', timestamp: '2026-04-16T12:48:00', userId: 'u3', userName: 'Dr. Vikram Singh', action: 'Finalized moderation', scriptId: 'OS-001049', details: 'Final marks: 68. Both evaluations reviewed.' },
  { id: 'a8', timestamp: '2026-04-16T12:30:00', userId: 'u1', userName: 'Dr. Rajesh Kumar', action: 'Published result', scriptId: 'OS-001048', details: 'Result published for candidate 24CSE1048' },
  { id: 'a9', timestamp: '2026-04-16T12:10:00', userId: 'u2', userName: 'Prof. Anita Sharma', action: 'Changed marks', scriptId: 'OS-001052', questionId: 'Q7', oldValue: '7', newValue: '6', details: 'Marks revised after re-reading answer script' },
  { id: 'a10', timestamp: '2026-04-16T11:55:00', userId: 'u1', userName: 'Dr. Rajesh Kumar', action: 'AI Processing triggered', scriptId: 'OS-001062', details: 'AI evaluation pipeline initiated' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'warning', title: 'Scripts Require Moderation', message: '12 scripts have evaluation differences exceeding 10 marks and require moderation.', timestamp: '2026-04-16T14:00:00', read: false },
  { id: 'n2', type: 'warning', title: 'Unchecked Answers Detected', message: '3 answer scripts have potentially unchecked answers flagged by AI integrity check.', timestamp: '2026-04-16T13:30:00', read: false },
  { id: 'n3', type: 'info', title: 'Evaluation Progress', message: 'Exam CSE-OS-2026 evaluation is 87% complete. 1,078 scripts still pending.', timestamp: '2026-04-16T12:00:00', read: false },
  { id: 'n4', type: 'info', title: 'Revaluation Request', message: 'Student 24CSE1052 has submitted a revaluation request for Operating Systems Q4.', timestamp: '2026-04-16T11:45:00', read: true },
  { id: 'n5', type: 'success', title: 'AI Processing Complete', message: 'Batch of 250 answer scripts has been processed by AI evaluation engine.', timestamp: '2026-04-16T10:30:00', read: true },
  { id: 'n6', type: 'error', title: 'Anomaly Detected', message: 'Scoring pattern anomaly detected for Examiner E104. Review recommended.', timestamp: '2026-04-16T09:20:00', read: true },
];

export const MOCK_REVALUATION_REQUESTS: RevaluationRequest[] = [
  {
    id: 'rv1', studentId: 'c8', studentName: 'Divya Agarwal', examId: 'exam1',
    subject: 'Operating Systems', questionNumber: 4, originalMarks: 5,
    reason: 'I believe my answer covered LRU and Optimal page replacement algorithms clearly. Please re-evaluate.',
    status: 'under_review', submittedAt: '2026-04-17T09:15:00',
  },
  {
    id: 'rv2', studentId: 'c9', studentName: 'Mohit Yadav', examId: 'exam1',
    subject: 'Operating Systems', questionNumber: 7, originalMarks: 6,
    reason: 'My Banker\'s Algorithm solution was correct but marks seem lower than expected.',
    status: 'requested', submittedAt: '2026-04-17T10:30:00',
  },
  {
    id: 'rv3', studentId: 'c12', studentName: 'Pooja Mishra', examId: 'exam1',
    subject: 'Operating Systems', questionNumber: 3, originalMarks: 7,
    reason: 'I included detailed explanation of circular wait with diagram but only partial marks awarded.',
    status: 'completed', submittedAt: '2026-04-16T14:00:00', resolvedAt: '2026-04-17T11:00:00',
    revisedMarks: 9,
  },
];

export const EXAMINER_PERFORMANCE: ExaminerPerformance[] = [
  { examinerId: 'E101', examinerName: 'Prof. Anita Sharma', scriptsEvaluated: 312, avgScore: 72, avgTimeMinutes: 4.2, aiAcceptanceRate: 84, scoreDeviation: 'Low', flagCount: 3 },
  { examinerId: 'E102', examinerName: 'Dr. Pradeep Ghosh', scriptsEvaluated: 298, avgScore: 69, avgTimeMinutes: 5.1, aiAcceptanceRate: 79, scoreDeviation: 'Low', flagCount: 5 },
  { examinerId: 'E103', examinerName: 'Prof. Lalitha Menon', scriptsEvaluated: 321, avgScore: 74, avgTimeMinutes: 4.8, aiAcceptanceRate: 88, scoreDeviation: 'Low', flagCount: 2 },
  { examinerId: 'E104', examinerName: 'Dr. Arun Saxena', scriptsEvaluated: 284, avgScore: 68, avgTimeMinutes: 4.2, aiAcceptanceRate: 74, scoreDeviation: 'Moderate', flagCount: 7 },
  { examinerId: 'E105', examinerName: 'Prof. Meera Iyer', scriptsEvaluated: 267, avgScore: 71, avgTimeMinutes: 6.3, aiAcceptanceRate: 91, scoreDeviation: 'Low', flagCount: 1 },
];

export const LEARNING_OUTCOMES: LearningOutcome[] = [
  { topic: 'CPU Scheduling', masteryPercent: 84, candidateCount: 11920 },
  { topic: 'Deadlocks', masteryPercent: 71, candidateCount: 11920 },
  { topic: 'Memory Management', masteryPercent: 48, candidateCount: 11920 },
  { topic: 'File Systems', masteryPercent: 67, candidateCount: 11920 },
  { topic: 'Process Synchronization', masteryPercent: 73, candidateCount: 11920 },
  { topic: 'OS Fundamentals', masteryPercent: 88, candidateCount: 11920 },
  { topic: 'I/O Management', masteryPercent: 61, candidateCount: 11920 },
];

export const STUDENT_RESULTS = {
  '24CSE1045': {
    name: 'Shiva Soni',
    subjects: [
      { code: 'CSE-OS-2026', name: 'Operating Systems', marks: 78, maxMarks: 100, grade: 'B+', questionwise: [8,9,8,7,0,8,7,9,9,8] },
      { code: 'CSE-DB-2026', name: 'Database Management', marks: 84, maxMarks: 100, grade: 'A', questionwise: [9,8,9,8,9,8,7,9,8,9] },
      { code: 'CSE-CN-2026', name: 'Computer Networks', marks: 81, maxMarks: 100, grade: 'A', questionwise: [8,9,8,8,7,8,9,8,8,8] },
    ],
    overall: 81,
    grade: 'A',
    rank: 42,
    totalStudents: 12480,
  },
};
