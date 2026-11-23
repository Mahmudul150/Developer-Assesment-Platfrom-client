import type { AttemptStatus } from "./enums";

export interface Attempt {
  id: string;
  invitationId: string;
  assessmentId: string;
  candidateId: string;
  status: AttemptStatus;
  startedAt: string;
  deadlineAt: string;
  submittedAt: string | null;
  totalScore: number | null;
  tabSwitchCount?: number;
}

export interface Answer {
  id?: string;
  attemptId: string;
  problemId: string;
  answer: string | string[];
}
