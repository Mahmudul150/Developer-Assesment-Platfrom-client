"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import type { Role } from "@/types/enums";

export function RoleGuard({
  allow,
  children,
}: {
  allow: Role[];
  children: ReactNode;
}) {
  const { user } = useAuth();
  if (!user || !allow.includes(user.role)) return null;
  return <>{children}</>;
}
