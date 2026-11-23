import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ROLE_HOME } from "@/lib/auth";
import { navByRole } from "@/lib/constants";
import { getSessionFromCookies } from "@/lib/session";
import { Role } from "@/types/enums";

export default async function CandidateShellLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSessionFromCookies();
  if (!session.role) redirect("/login");
  if (session.role !== Role.CANDIDATE) redirect(ROLE_HOME[session.role]);

  return (
    <DashboardShell
      items={navByRole[Role.CANDIDATE]}
      name={
        session.payload?.name ??
        session.payload?.email?.split("@")[0] ??
        "Candidate"
      }
      email={session.payload?.email ?? ""}
      role={Role.CANDIDATE}
    >
      {children}
    </DashboardShell>
  );
}
