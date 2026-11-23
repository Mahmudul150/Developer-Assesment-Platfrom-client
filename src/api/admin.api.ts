import apiClient from "@/lib/apiClient";
import type {
  AdminDashboardResponse,
  ApiResponse,
  AuditLogParams,
  CompanyListParams,
  PaginatedResponse,
  UpdateUserStatusPayload,
  UserListParams,
} from "@/types";
import type { Company, User } from "@/types/user";

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export function getAdminDashboard() {
  return apiClient<ApiResponse<AdminDashboardResponse>>("/admin/dashboard");
}

export function getAdminUsers(params?: UserListParams) {
  return apiClient<ApiResponse<PaginatedResponse<User>>>("/admin/users", {
    params,
  });
}

export function getAdminUserById(id: string) {
  return apiClient<ApiResponse<User>>(`/admin/users/${id}`);
}

export function updateUserStatus(id: string, payload: UpdateUserStatusPayload) {
  return apiClient<ApiResponse<User>>(`/admin/users/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
}

export function getAdminCompanies(params?: CompanyListParams) {
  return apiClient<ApiResponse<PaginatedResponse<Company>>>(
    "/company/get-allCompnay",
    { params },
  );
}

export function approveCompany(
  idOrPayload: string | { id: string; status?: string },
) {
  const companyId =
    typeof idOrPayload === "string" ? idOrPayload : idOrPayload.id;
  return apiClient<ApiResponse<Company>>("/company/approve", {
    method: "PATCH",
    body: { companyId },
  });
}

export function getAuditLogs(params?: AuditLogParams) {
  return apiClient<ApiResponse<PaginatedResponse<AuditLog>>>("/audit-logs", {
    params,
  });
}

export function getAuditLogById(id: string) {
  return apiClient<ApiResponse<AuditLog>>(`/audit-logs/${id}`);
}
