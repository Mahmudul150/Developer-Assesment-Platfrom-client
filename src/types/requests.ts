import type {
  AssessmentStatus,
  Difficulty,
  QuestionType,
  Role,
  UserStatus,
} from "./enums";
import type { AuthUser } from "./user";

export type QueryParams = Record<string, string | number | boolean | undefined>;

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  candidate?: {
    phone?: string;
    bio?: string;
    skills?: string[];
    experienceYears?: number;
  };
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface GooglePayload {
  idToken: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface SessionResponse {
  accessToken: string;
  refreshToken: string;
  user?: AuthUser;
}

export interface ApplyCompanyPayload {
  name: string;
  email: string;
  password: string;
  company: {
    name: string;
    website?: string;
    industry?: string;
    description?: string;
    logoUrl?: string;
  };
}

export interface VerifyCompanyEmailPayload {
  email: string;
  otp: string;
}

export interface UpdateCompanyProfilePayload {
  name?: string;
  website?: string;
  industry?: string;
  description?: string;
  logoUrl?: string;
}

export interface UserListParams extends QueryParams {
  role?: Role;
  status?: UserStatus;
  searchTerm?: string;
}

export interface CompanyListParams extends QueryParams {
  searchTerm?: string;
  industry?: string;
  isApproved?: boolean;
}

export interface UpdateUserStatusPayload {
  status: string;
}

export interface ApproveCompanyPayload {
  companyId: string;
}

export interface CreateProblemPayload {
  title: string;
  description: string;
  type: QuestionType;
  difficulty: Difficulty;
  points?: number;
  options?: Array<string | { id: string; text: string }>;
  correctAnswer?: string;
  testCases?: Array<{
    input: string;
    expectedOutput: string;
    hidden?: boolean;
  }>;
}

export interface ProblemListParams extends QueryParams {
  searchTerm?: string;
  type?: QuestionType;
  difficulty?: Difficulty;
  points?: number;
}

export interface CreateAssessmentPayload {
  title: string;
  description?: string;
  durationMinutes: number;
  passingScore?: number;
  startsAt?: string;
  endsAt?: string;
}

export interface AssessmentListParams extends QueryParams {
  status?: AssessmentStatus;
  searchTerm?: string;
  companyId?: string;
}

export interface AssessmentProblemPayload {
  problems: Array<{ problemId: string; order: number }>;
}

export interface CreateInvitationPayload {
  assessmentId: string;
  email: string;
}

export interface InviteCandidatesPayload {
  assessmentId: string;
  emails: string[];
}

export interface InvitationListParams extends QueryParams {
  searchTerm?: string;
  email?: string;
  status?: string;
}

export interface UpdateInvitationPayload {
  status: "ACCEPTED" | "DECLINED";
}

export interface CreateSubmissionPayload {
  attemptId: string;
  problemId: string;
  answer: string | string[];
}

export interface UpdateSubmissionPayload {
  answer: string | string[];
}

export interface SubmissionListParams extends QueryParams {
  status?: string;
  attemptId?: string;
  problemId?: string;
  assessmentId?: string;
}

export interface EvaluateSubmissionPayload {
  score: number;
  feedback?: string;
}

export interface InitiatePaymentPayload {
  assessmentId: string;
}

export interface PaymentListParams extends QueryParams {
  status?: string;
  companyId?: string;
  assessmentId?: string;
  searchTerm?: string;
}

export interface AuditLogParams extends QueryParams {
  userId?: string;
  entityType?: string;
  action?: string;
  from?: string;
  to?: string;
}

export interface AttemptProblemsResponse {
  id: string;
  status: string;
  deadlineAt: string;
  invitation: {
    assessment: {
      title: string;
      problems: Array<{
        order: number;
        problem: {
          id: string;
          title: string;
          description: string;
          type: QuestionType;
          difficulty: Difficulty;
          points: number;
          options: Array<string | { id: string; text: string }>;
        };
      }>;
    };
  };
  submissions: Array<{
    id: string;
    problemId: string;
    answer: string | string[];
    status: string;
  }>;
}

export interface AttemptResultResponse {
  assessment: {
    id: string;
    title: string;
    passingScore: number;
    durationMinutes: number;
  };
  totalScore: number | null;
  status: string;
  submittedAt: string | null;
  submissions: Array<{
    id: string;
    problemId: string;
    problem: { id: string; title: string; points: number };
    score: number | null;
    feedback: string | null;
    status: string;
    answer: string | string[] | null;
  }>;
}

export interface AdminDashboardResponse {
  totalUser: number;
  totalCompany: number;
  totalCandidates: number;
  approveCompany: number;
  pendingCompany: number;
  totalAssesment: number;
  isPublishedAssesment: number;
  isDarftAssesment: number;
  isClosedAssesment: number;
  TotalPayment: number;
  totalRevenue: number;
  revenueByMonth: Array<{ month: string; amount: number }>;
  totalAttampts: number;
  progressAttampts: number;
  submitedAttampts: number;
  evaluatedAttampts: number;
  totalSubmission: number;
}

export interface CompanyDashboardStats {
  assessmentsByStatus: Record<string, number>;
  invitationsByStatus: Record<string, number>;
  pendingEvaluations: number;
  totalSpend: number;
  scoreByAssessment: Array<{
    assessmentId: string;
    title: string;
    avgPercent: number;
    attempts: number;
  }>;
}
