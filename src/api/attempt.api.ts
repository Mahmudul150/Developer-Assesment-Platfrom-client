import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  AttemptProblemsResponse,
  AttemptResultResponse,
} from "@/types";
import type { Attempt } from "@/types/attempt";

export function createAttempt(invitationId: string) {
  return apiClient<ApiResponse<Attempt>>(
    `/attempt/create-attempt/${invitationId}`,
    { method: "POST" },
  );
}

export function getMyAttempts() {
  return apiClient<ApiResponse<Attempt[]>>("/attempt/my-attempts");
}

export function getSingleAttempt(id: string) {
  return apiClient<ApiResponse<Attempt>>(`/attempt/single-attempt/${id}`);
}

export function getAttemptProblems(id: string) {
  return apiClient<ApiResponse<AttemptProblemsResponse>>(
    `/attempt/get-attempt-problems/${id}`,
  );
}

export function reportTabSwitch(id: string) {
  return apiClient<ApiResponse<Attempt>>(`/attempt/tab-switch/${id}`, {
    method: "PATCH",
  });
}

export function submitAttempt(id: string) {
  return apiClient<ApiResponse<Attempt>>(`/attempt/attempt-submit/${id}`, {
    method: "POST",
  });
}

export function getAttemptResult(id: string) {
  return apiClient<ApiResponse<AttemptResultResponse>>(
    `/attempt/attempt-result/${id}`,
  );
}

export function getAllAttempts() {
  return apiClient<ApiResponse<Attempt[]>>("/attempt/getAll");
}
