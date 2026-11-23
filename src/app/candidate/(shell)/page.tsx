import type { Metadata } from "next";
import { InvitationsList } from "@/components/candidate/invitations-list";
import { PageHeader } from "@/components/shared/page-header";
import { serverApi } from "@/lib/server-api";
import type { Attempt } from "@/types/attempt";
import type { Invitation } from "@/types/invitation";

export const metadata: Metadata = { title: "My invitations" };
export const dynamic = "force-dynamic";

export default async function CandidatePage() {
  let invitations: Invitation[] = [];
  let attempts: Attempt[] = [];
  try {
    [invitations, attempts] = await Promise.all([
      serverApi<Invitation[]>("/api/v1/invitation/my"),
      serverApi<Attempt[]>("/api/v1/attempt/my-attempts"),
    ]);
  } catch {
    invitations = [];
    attempts = [];
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My invitations"
        description="Accept an invitation to start a timed assessment."
      />
      <InvitationsList invitations={invitations} attempts={attempts} />
    </div>
  );
}
