import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { PageHeader } from "@/components/shared/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime, formatDuration } from "@/lib/format";
import { serverApi } from "@/lib/server-api";
import { getSessionFromCookies } from "@/lib/session";
import { cn } from "@/lib/utils";
import { ApiError } from "@/types/api";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Assessment invitation",
    description: "Review an assessment invitation.",
  };
}
export const dynamic = "force-dynamic";

interface InvitationTokenResponse {
  id: string;
  email: string;
  status: string;
  expiresAt: string;
  assessment: {
    title: string;
    durationMinutes: number;
    passingScore: number;
  };
  company: { name: string };
}

export default async function OpenInvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const session = await getSessionFromCookies();

  let invitation: InvitationTokenResponse | null = null;
  let expired = false;
  try {
    invitation = await serverApi<InvitationTokenResponse>(
      `/api/v1/invitation/token/${token}`,
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 410) expired = true;
  }

  if (!invitation) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20">
        <Alert variant={expired ? "warning" : "destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {expired ? "Invitation expired" : "Invitation not found"}
          </AlertTitle>
          <AlertDescription>
            {expired
              ? "This invitation link is no longer valid. Ask the company for a new one."
              : "This link may be incorrect. Please check it and try again."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentEmail = session.payload?.email ?? "";
  const isInvited =
    currentEmail.length > 0 &&
    currentEmail.toLowerCase() === invitation.email.toLowerCase();

  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <PageHeader
        title="You are invited"
        description={invitation.company.name}
      />
      <Card className="mt-6">
        <CardHeader>
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          <CardTitle>{invitation.assessment.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 text-sm">
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />{" "}
              {formatDuration(invitation.assessment.durationMinutes)}
            </span>
            <span>{invitation.assessment.passingScore}% to pass</span>
            <span>Expires {formatDateTime(invitation.expiresAt)}</span>
          </div>

          {!session.role ? (
            <div className="flex flex-col gap-2">
              <Link
                href={`/login?next=${encodeURIComponent(`/invitations/${token}`)}&email=${encodeURIComponent(invitation.email)}`}
                className={cn(buttonVariants(), "w-full")}
              >
                Log in with {invitation.email}
              </Link>
              <Link
                href={`/register?email=${encodeURIComponent(invitation.email)}`}
                className={cn(buttonVariants({ variant: "outline" }), "w-full")}
              >
                Create an account
              </Link>
            </div>
          ) : isInvited ? (
            <Link href="/candidate" className={cn(buttonVariants(), "w-full")}>
              Go to my invitations
            </Link>
          ) : (
            <Alert>
              <AlertTitle>Wrong account</AlertTitle>
              <AlertDescription className="space-y-3">
                <p>
                  You are logged in as {currentEmail}. This invitation belongs
                  to {invitation.email}.
                </p>
                <LogoutButton label="Log out and use the invited email" />
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
