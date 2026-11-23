import { cookies } from "next/headers";
import { decodeToken, isLoggedIn, roleFromToken } from "@/lib/auth";

export async function getSessionFromCookies() {
  const token = (await cookies()).get("accessToken")?.value;
  const payload = decodeToken(token);
  const role = roleFromToken(token);

  return {
    token: token ?? null,
    payload,
    role,
    userId: payload?.userId ?? null,
    isLoggedIn: isLoggedIn(token) && role !== null,
  };
}
