import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CreateInvitationPayload,
  InvitationListParams,
  InviteCandidatesPayload,
  PaginatedResponse,
  UpdateInvitationPayload,
} from "@/types";
import type { Invitation } from "@/types/invitation";

export function createInvitation(payload: CreateInvitationPayload) {
  return apiClient<ApiResponse<Invitation>>("/invitation", {
    method: "POST",
    body: payload,
  });
}

export function inviteCandidates(payload: InviteCandidatesPayload) {
  return Promise.all(
    payload.emails.map((email) =>
      createInvitation({ assessmentId: payload.assessmentId, email }),
    ),
  );
}

export function getInvitations(params?: InvitationListParams) {
  return apiClient<ApiResponse<PaginatedResponse<Invitation>>>("/invitation", {
    params,
  });
}

export function getMyInvitations() {
  return apiClient<ApiResponse<Invitation[]>>("/invitation/my");
}

export function getInvitationById(id: string) {
  return apiClient<ApiResponse<Invitation>>(`/invitation/${id}`);
}

export function getInvitationByToken(token: string) {
  return apiClient<ApiResponse<Invitation>>(`/invitation/token/${token}`);
}

export function updateInvitation(id: string, payload: UpdateInvitationPayload) {
  return apiClient<ApiResponse<Invitation>>(`/invitation/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function acceptInvitation(id: string) {
  return updateInvitation(id, { status: "ACCEPTED" });
}

export function declineInvitation(id: string) {
  return updateInvitation(id, { status: "DECLINED" });
}

export function deleteInvitation(id: string) {
  return apiClient<ApiResponse<null>>(`/invitation/${id}`, {
    method: "DELETE",
  });
}
