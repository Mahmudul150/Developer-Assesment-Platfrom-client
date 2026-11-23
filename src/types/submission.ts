import type { SubmissionStatus } from "./enums";
import type { Problem } from "./problem";

export interface Submission {
  id: string;
  attemptId: string;
  problemId: string;
  answer: string | string[] | null;
  status: SubmissionStatus;
  score: number | null;
  feedback: string | null;
  evaluatedAt: string | null;
  problem?: Problem;
  attempt?: {
    id: string;
    status: string;
    totalScore: number | null;
    invitation?: {
      email: string;
      candidate?: { name: string } | null;
      assessment?: { id: string; title: string };
    };
  };
}
