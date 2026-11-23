import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ROLE_HOME } from "@/lib/auth";
import { navByRole } from "@/lib/constants";
import { serverApi } from "@/lib/server-api";
import { getSessionFromCookies } from "@/lib/session";
import { Role } from "@/types/enums";
import type { CompanyProfile } from "@/types/user";

export default async function CompanyLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSessionFromCookies();
  if (!session.role) redirect("/login");
  if (session.role !== Role.COMPANY) redirect(ROLE_HOME[session.role]);

  let company: CompanyProfile | null = null;
  try {
    company = await serverApi<CompanyProfile>("/api/v1/company/me");
  } catch {
    company = null;
  }

  return (
    <DashboardShell
      items={navByRole[Role.COMPANY]}
      name={
        session.payload?.name ??
        session.payload?.email?.split("@")[0] ??
        "Company"
      }
      email={session.payload?.email ?? ""}
      role={Role.COMPANY}
    >
      {company && !company.isApproved && (
        <Alert variant="warning" className="mb-6">
          <AlertTitle>Awaiting admin approval</AlertTitle>
          <AlertDescription>
            Your company is not approved yet. Problem, assessment, payment and
            invitation actions are disabled until an admin approves your
            account.
          </AlertDescription>
        </Alert>
      )}
      {children}
    </DashboardShell>
  );
}
