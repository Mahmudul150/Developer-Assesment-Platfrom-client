import { Role, type Role as RoleType } from "@/types/enums";

const roleHome: Record<RoleType, string> = {
  [Role.ADMIN]: "/admin",
  [Role.COMPANY]: "/company",
  [Role.CANDIDATE]: "/candidate",
};

export function resolveNext(next: string | undefined, role: RoleType): string {
  const home = roleHome[role];
  if (!next || !next.startsWith("/") || next.startsWith("//")) return home;
  if (next.startsWith(home)) return next;
  return home;
}
