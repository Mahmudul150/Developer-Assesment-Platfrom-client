import { Role, type Role as RoleType } from "@/types/enums";

export interface JwtPayload {
  userId?: string;
  name?: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export const ROLE_HOME: Record<RoleType, string> = {
  [Role.ADMIN]: "/admin",
  [Role.COMPANY]: "/company",
  [Role.CANDIDATE]: "/candidate",
};

export const roleHome = ROLE_HOME;

function decodeBase64Url(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function decodeToken(token: string | undefined): JwtPayload | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    return JSON.parse(decodeBase64Url(payload)) as JwtPayload;
  } catch {
    return null;
  }
}

export function roleFromToken(token: string | undefined): RoleType | null {
  const role = decodeToken(token)?.role;
  if (role === Role.ADMIN || role === Role.COMPANY || role === Role.CANDIDATE) {
    return role;
  }
  return null;
}

export function isLoggedIn(token: string | undefined): boolean {
  return decodeToken(token) !== null;
}
