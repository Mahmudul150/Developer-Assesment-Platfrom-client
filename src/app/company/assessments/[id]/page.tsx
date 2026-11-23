import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AssessmentDetailActions } from "@/components/company/assessment-detail-actions";
import { AssessmentProblemsPanel } from "@/components/company/assessment-problems-panel";
import { PaymentPanel } from "@/components/company/payment-panel";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime, formatDuration } from "@/lib/format";
import { serverApi } from "@/lib/server-api";
import type { AssessmentDetail } from "@/types/assessment";

export const metadata: Metadata = { title: "Assessment details" };
export const dynamic = "force-dynamic";

export default async function AssessmentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ warning?: string }>;
}) {
  const { id } = await params;
  const { warning } = await searchParams;

  let assessment: AssessmentDetail | null = null;
  try {
    assessment = await serverApi<AssessmentDetail>(`/api/v1/assesment/${id}`);
  } catch {
    redirect("/company/assessments");
  }

  if (!assessment) redirect("/company/assessments");
  const editable = assessment.status === "DRAFT";

  return (
    <div className="space-y-6">
      <PageHeader
        title={assessment.title}
        description={assessment.description ?? "Manage this assessment."}
        action={<StatusBadge status={assessment.status} />}
      />

      {warning === "problems" && (
        <p className="rounded-md border border-amber-500/50 bg-amber-500/10 p-3 text-sm text-amber-700">
          The assessment was created but problems could not be added. Add them
          below.
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          <p>
            <span className="text-muted-foreground">Duration: </span>
            {formatDuration(assessment.durationMinutes)}
          </p>
          <p>
            <span className="text-muted-foreground">Passing score: </span>
            {assessment.passingScore}%
          </p>
          <p>
            <span className="text-muted-foreground">Invitations: </span>
            {assessment.invitationCount}
          </p>
          <p>
            <span className="text-muted-foreground">Created: </span>
            {formatDateTime(assessment.createdAt)}
          </p>
        </CardContent>
      </Card>

      <AssessmentProblemsPanel
        assessmentId={assessment.id}
        problems={assessment.problems ?? []}
        editable={editable}
      />

      <div id="payment-panel">
        <PaymentPanel
          assessmentId={assessment.id}
          payment={assessment.latestPayment as never}
        />
      </div>

      <AssessmentDetailActions
        assessmentId={assessment.id}
        status={assessment.status}
        problemCount={assessment.problems?.length ?? 0}
        paymentStatus={assessment.latestPayment?.status}
      />
    </div>
  );
}
