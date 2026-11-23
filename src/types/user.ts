import type { Role, UserStatus } from "./enums";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  emailVerified: boolean;
  imageUrl: string | null;
  createdAt: string;
  isDeleted?: boolean;
}

export interface AuthUser extends User {
  company?: CompanyProfile | null;
  candidate?: CandidateProfile | null;
}

export interface CompanyProfile {
  id: string;
  name: string;
  website: string | null;
  industry: string | null;
  description: string | null;
  logoUrl: string | null;
  isApproved: boolean;
  userId?: string;
}

export interface CandidateProfile {
  id: string;
  name: string;
  phone: string | null;
  bio: string | null;
  location: string | null;
  skills: string[];
  experienceYears: number;
  githubUrl: string | null;
  linkedinUrl: string | null;
  userId?: string;
}

export interface Company extends CompanyProfile {
  email: string;
  status: UserStatus;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
  } | null;
}
