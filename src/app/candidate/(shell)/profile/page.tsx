import type { Metadata } from "next";
import { CandidateProfileForm } from "@/components/candidate/candidate-profile-form";
import { PageHeader } from "@/components/shared/page-header";
import { serverApi } from "@/lib/server-api";
import type { CandidateProfile } from "@/types/user";

export const metadata: Metadata = { title: "Profile" };
export const dynamic = "force-dynamic";

export default async function CandidateProfilePage() {
  let profile: CandidateProfile | null = null;
  try {
    profile = await serverApi<CandidateProfile>(
      "/api/v1/candidate/candidate-profile",
    );
  } catch {
    profile = null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My profile"
        description="Keep your details up to date."
      />
      {profile ? (
        <CandidateProfileForm profile={profile} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Profile could not be loaded.
        </p>
      )}
    </div>
  );
}
