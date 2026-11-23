import type { AssessmentStatus } from "./enums";
import type { Problem } from "./problem";

export interface Assessment {
  id: string;
  companyId: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  passingScore: number;
  status: AssessmentStatus;
  startsAt: string | null;
  endsAt: string | null;
  totalMarks?: number;
  company?: { id: string; name: string } | null;
  createdAt: string;
}

export interface AssessmentProblem {
  id: string;
  assessmentId: string;
  problemId: string;
  order: number;
  points?: number;
  problem?: Problem;
}

export interface AssessmentDetail extends Assessment {
  problems: AssessmentProblem[];
  latestPayment: {
    id: string;
    status: string;
    amount: number;
    bkashTrxId: string | null;
    createdAt: string;
  } | null;
  invitationCount: number;
  invitationsByStatus: Record<string, number>;
}
