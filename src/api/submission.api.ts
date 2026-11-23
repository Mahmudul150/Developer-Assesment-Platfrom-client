import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CreateSubmissionPayload,
  EvaluateSubmissionPayload,
  PaginatedResponse,
  SubmissionListParams,
  UpdateSubmissionPayload,
} from "@/types";
import type { Submission } from "@/types/submission";

export function createSubmission(payload: CreateSubmissionPayload) {
  return apiClient<ApiResponse<Submission>>("/submission", {
    method: "POST",
    body: payload,
  });
}

export function updateSubmission(id: string, payload: UpdateSubmissionPayload) {
  return apiClient<ApiResponse<Submission>>(`/submission/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function getMySubmissions(attemptId: string) {
  return apiClient<ApiResponse<Submission[]>>(
    `/submission/my-submissions/${attemptId}`,
  );
}

export function getSubmissions(params?: SubmissionListParams) {
  return apiClient<ApiResponse<PaginatedResponse<Submission>>>("/submission", {
    params,
  });
}

export function evaluateSubmission(
  id: string,
  payload: EvaluateSubmissionPayload,
) {
  return apiClient<ApiResponse<Submission>>(`/submission/evaluate/${id}`, {
    method: "POST",
    body: payload,
  });
}
