import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  AssessmentListParams,
  AssessmentProblemPayload,
  CreateAssessmentPayload,
  PaginatedResponse,
} from "@/types";
import type {
  Assessment,
  AssessmentDetail,
  AssessmentProblem,
} from "@/types/assessment";

export function createAssessment(payload: CreateAssessmentPayload) {
  return apiClient<ApiResponse<Assessment>>("/assesment/create-assesment", {
    method: "POST",
    body: payload,
  });
}

export function getMyAssessments(params?: AssessmentListParams) {
  return apiClient<ApiResponse<PaginatedResponse<Assessment>>>(
    "/assesment/my-assesment",
    { params },
  );
}

export function getAllAssessments(params?: AssessmentListParams) {
  return apiClient<ApiResponse<PaginatedResponse<Assessment>>>(
    "/assesment/all-assesment",
    { params },
  );
}

export function getPublishedAssessments(params?: AssessmentListParams) {
  return apiClient<ApiResponse<PaginatedResponse<Assessment>>>(
    "/assesment/all-published-assesment",
    { params },
  );
}

export function getAssessmentById(id: string) {
  return apiClient<ApiResponse<AssessmentDetail>>(`/assesment/${id}`);
}

export function updateAssessment(
  id: string,
  payload: Partial<CreateAssessmentPayload>,
) {
  return apiClient<ApiResponse<Assessment>>(`/assesment/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteAssessment(id: string) {
  return apiClient<ApiResponse<null>>(`/assesment/${id}`, {
    method: "DELETE",
  });
}

export function publishAssessment(id: string) {
  return apiClient<ApiResponse<Assessment>>(`/assesment/${id}/publish`, {
    method: "PATCH",
  });
}

export function closeAssessment(id: string) {
  return apiClient<ApiResponse<Assessment>>(`/assesment/${id}/close`, {
    method: "PATCH",
  });
}

export function addAssessmentProblems(id: string, problemIds: string[]) {
  const payload: AssessmentProblemPayload = {
    problems: problemIds.map((problemId, index) => ({
      problemId,
      order: index + 1,
    })),
  };
  return apiClient<ApiResponse<AssessmentProblem[]>>(
    `/assesmentproblem/${id}/problems`,
    { method: "POST", body: payload },
  );
}

export function getAssessmentProblems(id: string) {
  return apiClient<ApiResponse<PaginatedResponse<AssessmentProblem>>>(
    `/assesmentproblem/${id}/problems`,
  );
}

export function deleteAssessmentProblem(id: string, problemId: string) {
  return apiClient<ApiResponse<null>>(
    `/assesmentproblem/${id}/problems/${problemId}`,
    { method: "DELETE" },
  );
}
