import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CreateProblemPayload,
  PaginatedResponse,
  ProblemListParams,
} from "@/types";
import type { Problem } from "@/types/problem";

export function createProblem(payload: CreateProblemPayload) {
  return apiClient<ApiResponse<Problem>>("/problem/create-problem", {
    method: "POST",
    body: payload,
  });
}

export function getMyProblems(params?: ProblemListParams) {
  return apiClient<ApiResponse<PaginatedResponse<Problem>>>(
    "/problem/my-problems",
    { params },
  );
}

export function getAllProblems(params?: ProblemListParams) {
  return apiClient<ApiResponse<PaginatedResponse<Problem>>>(
    "/problem/all-problems",
    { params },
  );
}

export function getProblemById(id: string) {
  return apiClient<ApiResponse<Problem>>(`/problem/${id}`);
}

export function updateProblem(
  id: string,
  payload: Partial<CreateProblemPayload>,
) {
  return apiClient<ApiResponse<Problem>>(`/problem/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteProblem(id: string) {
  return apiClient<ApiResponse<null>>(`/problem/${id}`, { method: "DELETE" });
}
