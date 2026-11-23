import type { Metadata } from "next";
import { CompanyProfileForm } from "@/components/company/company-profile-form";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { serverApi } from "@/lib/server-api";
import type { CompanyProfile } from "@/types/user";

export const metadata: Metadata = { title: "Profile" };
export const dynamic = "force-dynamic";

export default async function CompanyProfilePage() {
  let company: CompanyProfile | null = null;
  try {
    company = await serverApi<CompanyProfile>("/api/v1/company/me");
  } catch {
    company = null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your company profile."
        action={
          company ? (
            <StatusBadge status={company.isApproved ? "ACTIVE" : "PENDING"} />
          ) : undefined
        }
      />
      {company ? (
        <CompanyProfileForm company={company} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Profile could not be loaded.
        </p>
      )}
    </div>
  );
}
