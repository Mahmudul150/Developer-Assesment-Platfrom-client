import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ROLE_HOME } from "@/lib/auth";
import { navByRole } from "@/lib/constants";
import { getSessionFromCookies } from "@/lib/session";
import { Role } from "@/types/enums";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSessionFromCookies();
  if (!session.role) redirect("/login");
  if (session.role !== Role.ADMIN) redirect(ROLE_HOME[session.role]);

  return (
    <DashboardShell
      items={navByRole[Role.ADMIN]}
      name={
        session.payload?.name ??
        session.payload?.email?.split("@")[0] ??
        "Admin"
      }
      email={session.payload?.email ?? ""}
      role={Role.ADMIN}
    >
      {children}
    </DashboardShell>
  );
}
