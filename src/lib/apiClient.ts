import { type FetchOptions, ofetch } from "ofetch";
import { ApiError, type ApiErrorBody } from "@/types/api";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";
const normalizedBackendUrl = backendUrl.replace(/\/api\/v1$/, "");

const client = ofetch.create({
  baseURL: `${normalizedBackendUrl}/api/v1`,
  credentials: "include",
  retry: 0,
});

let refreshing: Promise<boolean> | null = null;

function refreshToken(): Promise<boolean> {
  if (!refreshing) {
    refreshing = client("/auth/refresh-token", { method: "POST" })
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

function statusOf(error: unknown): number {
  if (typeof error === "object" && error !== null) {
    const candidate = error as {
      status?: number;
      response?: { status?: number };
    };
    return candidate.status ?? candidate.response?.status ?? 0;
  }
  return 0;
}

function bodyOf(error: unknown): ApiErrorBody | null {
  if (typeof error === "object" && error !== null) {
    const candidate = error as {
      data?: unknown;
      response?: { _data?: unknown };
    };
    const body = candidate.data ?? candidate.response?._data;
    if (body && typeof body === "object" && "message" in body) {
      return body as ApiErrorBody;
    }
  }
  return null;
}

function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  const body = bodyOf(error);
  return new ApiError(
    body?.message ?? "Something went wrong. Please try again.",
    statusOf(error),
    body?.errors ?? [],
  );
}

function clearSession() {
  if (typeof window === "undefined") return;
  void import("@/store/auth.store").then(({ useAuthStore }) => {
    useAuthStore.getState().clear();
  });
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
}

async function apiClient<T>(
  path: string,
  options: FetchOptions<"json"> = {},
): Promise<T> {
  try {
    return await client<T>(path, options);
  } catch (error) {
    const normalized = toApiError(error);

    if (
      normalized.status === 401 &&
      !path.startsWith("/auth/") &&
      !path.includes("/auth/refresh-token")
    ) {
      if (await refreshToken()) {
        try {
          return await client<T>(path, options);
        } catch (retryError) {
          throw toApiError(retryError);
        }
      }
      clearSession();
    }

    throw normalized;
  }
}

export default apiClient;
