import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  ApiError,
  type ApiResponse,
  type Meta,
  type PaginatedResponse,
} from "@/types/api";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:5000";

function isRedirect(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: string }).digest === "string" &&
    (error as { digest: string }).digest.includes("NEXT_REDIRECT")
  );
}

export async function serverApi<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = (await cookies()).get("accessToken")?.value;
  const headersList = await headers();
  const headersObject = new Headers(options.headers);
  headersObject.set("Content-Type", "application/json");
  if (token) headersObject.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${backendUrl}${path}`, {
    ...options,
    headers: headersObject,
    cache: "no-store",
  });

  if (res.status === 401) {
    const nextPath =
      headersList.get("x-invoke-path") ?? headersList.get("referer") ?? "/";
    redirect(`/api/session/refresh?next=${encodeURIComponent(nextPath)}`);
  }

  let payload: ApiResponse<T>;
  try {
    payload = (await res.json()) as ApiResponse<T>;
  } catch {
    throw new ApiError(`Unexpected response (${res.status})`, res.status, []);
  }

  if (!res.ok || !payload.success) {
    throw new ApiError(
      payload.message ?? "Request failed",
      res.status,
      (payload as { errors?: { field?: string; message: string }[] }).errors ??
        [],
    );
  }
  return payload.data;
}

export async function serverList<T>(
  path: string,
): Promise<PaginatedResponse<T>> {
  return serverApi<PaginatedResponse<T>>(path);
}

const emptyMeta: Meta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  totalPage: 0,
};

export async function safeServerList<T>(
  path: string,
): Promise<PaginatedResponse<T>> {
  try {
    return await serverList<T>(path);
  } catch (error) {
    if (isRedirect(error)) throw error;
    return { data: [], meta: emptyMeta };
  }
}
