export const Role = {
  ADMIN: "ADMIN",
  COMPANY: "COMPANY",
  CANDIDATE: "CANDIDATE",
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const UserStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  INACTIVE: "INACTIVE",
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const ProblemType = {
  MCQ: "MCQ",
  WRITTEN: "WRITTEN",
  CODING: "CODING",
} as const;
export type ProblemType = (typeof ProblemType)[keyof typeof ProblemType];

export const QuestionType = ProblemType;
export type QuestionType = ProblemType;

export const Difficulty = {
  EASY: "EASY",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
} as const;
export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export const AssessmentStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  CLOSED: "CLOSED",
} as const;
export type AssessmentStatus =
  (typeof AssessmentStatus)[keyof typeof AssessmentStatus];

export const InvitationStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  DECLINED: "DECLINED",
  EXPIRED: "EXPIRED",
} as const;
export type InvitationStatus =
  (typeof InvitationStatus)[keyof typeof InvitationStatus];

export const AttemptStatus = {
  IN_PROGRESS: "IN_PROGRESS",
  SUBMITTED: "SUBMITTED",
  EVALUATED: "EVALUATED",
} as const;
export type AttemptStatus = (typeof AttemptStatus)[keyof typeof AttemptStatus];

export const SubmissionStatus = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  EVALUATED: "EVALUATED",
} as const;
export type SubmissionStatus =
  (typeof SubmissionStatus)[keyof typeof SubmissionStatus];

export const PaymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
