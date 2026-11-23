import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ApplyCompanyPayload,
  CompanyListParams,
  PaginatedResponse,
  UpdateCompanyProfilePayload,
  VerifyCompanyEmailPayload,
} from "@/types";
import type { Company } from "@/types/user";

export interface CandidateProfile {
  id: string;
  userId: string;
  companyId: string | null;
  skills: string[];
  experience: string | null;
  user: Company;
}

export interface CompanyProfile extends Company {
  isApproved: boolean;
  emailVerified: boolean;
  website: string | null;
  industry: string | null;
  description: string | null;
  logoUrl: string | null;
}

export function applyCompany(payload: ApplyCompanyPayload) {
  return apiClient<ApiResponse<Company>>("/company/create", {
    method: "POST",
    body: payload,
  });
}

export function verifyCompanyEmail(payload: VerifyCompanyEmailPayload) {
  return apiClient<ApiResponse<Company>>("/company/email-verified", {
    method: "POST",
    body: payload,
  });
}

export function getCompanies(params?: CompanyListParams) {
  return apiClient<ApiResponse<PaginatedResponse<Company>>>(
    "/company/get-allCompnay",
    { params },
  );
}

export function getMyCompany() {
  return apiClient<ApiResponse<CompanyProfile>>("/company/me");
}

export function updateCompanyProfile(payload: UpdateCompanyProfilePayload) {
  return apiClient<ApiResponse<CompanyProfile>>("/company/update-profile", {
    method: "PATCH",
    body: payload,
  });
}

export function getCandidateProfile() {
  return apiClient<ApiResponse<CandidateProfile>>(
    "/candidate/candidate-profile",
  );
}

export function updateCandidateProfile(payload: {
  name?: string;
  phone?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  experienceYears?: number;
  githubUrl?: string;
  linkedinUrl?: string;
}) {
  return apiClient<ApiResponse<CandidateProfile>>(
    "/candidate/updated-profile",
    {
      method: "PATCH",
      body: payload,
    },
  );
}
