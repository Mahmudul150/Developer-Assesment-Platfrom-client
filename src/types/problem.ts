import type { Difficulty, ProblemType } from "./enums";

export interface ProblemOption {
  id: string;
  text: string;
}

export type ProblemOptions = Array<string | ProblemOption>;

export interface TestCase {
  input: string;
  expectedOutput: string;
  hidden?: boolean;
}

export interface Problem {
  id: string;
  companyId: string;
  title: string;
  description: string;
  type: ProblemType;
  difficulty: Difficulty;
  points: number;
  options: ProblemOptions;
  correctAnswer: string | null;
  testCases?: TestCase[] | null;
  createdAt: string;
  deletedAt?: string | null;
}
