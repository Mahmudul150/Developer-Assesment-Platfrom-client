import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ForgotPasswordPayload,
  GooglePayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  SessionResponse,
  VerifyEmailPayload,
} from "@/types";
import type { AuthUser } from "@/types/user";

export function userLogin(payload: LoginPayload) {
  return apiClient<ApiResponse<SessionResponse>>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function registerCandidate(payload: RegisterPayload) {
  return apiClient<ApiResponse<SessionResponse>>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function verifyEmail(payload: VerifyEmailPayload) {
  return apiClient<ApiResponse<SessionResponse>>("/auth/email-verify", {
    method: "POST",
    body: payload,
  });
}

export function googleLogin(payload: GooglePayload) {
  return apiClient<ApiResponse<SessionResponse>>("/auth/google", {
    method: "POST",
    body: payload,
  });
}

export function getMe() {
  return apiClient<ApiResponse<AuthUser>>("/auth/me");
}

export function refreshToken() {
  return apiClient<ApiResponse<SessionResponse>>("/auth/refresh-token", {
    method: "POST",
  });
}

export function forgotPassword(payload: ForgotPasswordPayload) {
  return apiClient<ApiResponse<null>>("/auth/forgot-password", {
    method: "POST",
    body: payload,
  });
}

export function resetPassword(payload: ResetPasswordPayload) {
  return apiClient<ApiResponse<null>>("/auth/reset-password", {
    method: "POST",
    body: payload,
  });
}

export function uploadImage(formData: FormData) {
  return apiClient<ApiResponse<{ imageUrl: string }>>("/auth/image-upload", {
    method: "POST",
    body: formData,
  });
}

export function logout() {
  return apiClient<ApiResponse<null>>("/auth/logout", { method: "POST" });
}
