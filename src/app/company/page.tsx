import { ClipboardList, Inbox, Mail, Wallet } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DashboardCharts } from "@/components/company/dashboard-charts";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/format";
import { serverApi } from "@/lib/server-api";
import { cn } from "@/lib/utils";
import type { PaginatedResponse } from "@/types/api";
import type { Payment } from "@/types/payment";
import type { CompanyDashboardStats } from "@/types/requests";
import type { Submission } from "@/types/submission";

export const metadata: Metadata = { title: "Company overview" };
export const dynamic = "force-dynamic";

export default async function CompanyPage() {
  let stats: CompanyDashboardStats | null = null;
  let payments: Payment[] = [];
  let submissions: Submission[] = [];

  try {
    stats = await serverApi<CompanyDashboardStats>(
      "/api/v1/company/dashboard-stats",
    );
  } catch {
    stats = null;
  }
  try {
    payments = await serverApi<Payment[]>(
      "/api/v1/payments/my-payment-history",
    );
  } catch {
    payments = [];
  }
  try {
    const result = await serverApi<PaginatedResponse<Submission>>(
      "/api/v1/submission?limit=5&status=SUBMITTED",
    );
    submissions = result.data;
  } catch {
    submissions = [];
  }

  const statusData = Object.entries(stats?.assessmentsByStatus ?? {}).map(
    ([name, value]) => ({ name, value }),
  );
  const scoreData = (stats?.scoreByAssessment ?? []).map((item) => ({
    name: item.title.slice(0, 14),
    score: item.avgPercent,
  }));
  const assessmentCount = statusData.reduce((sum, item) => sum + item.value, 0);
  const invitationCount = Object.values(
    stats?.invitationsByStatus ?? {},
  ).reduce((sum, value) => sum + value, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description="Your company's hiring activity."
      />

      {assessmentCount === 0 && payments.length === 0 ? (
        <EmptyState
          title="Get started with your first assessment"
          description="Build a problem bank, then create an assessment to invite candidates."
          icon={Inbox}
          action={
            <Link href="/company/problems" className={cn(buttonVariants())}>
              Create first problem
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Assessments"
              value={assessmentCount}
              icon={ClipboardList}
            />
            <StatCard
              title="Pending evaluations"
              value={stats?.pendingEvaluations ?? 0}
              icon={ClipboardList}
            />
            <StatCard title="Invitations" value={invitationCount} icon={Mail} />
            <StatCard
              title="Total spend"
              value={formatCurrency(stats?.totalSpend ?? 0)}
              icon={Wallet}
            />
          </div>

          <DashboardCharts statusData={statusData} scoreData={scoreData} />

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent payments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {payments.length === 0 && (
                  <p className="text-muted-foreground">No payments yet.</p>
                )}
                {payments.slice(0, 5).map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <span>{formatCurrency(payment.amount)}</span>
                    <StatusBadge status={payment.status} />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(payment.createdAt)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Answers awaiting review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {submissions.length === 0 && (
                  <p className="text-muted-foreground">
                    Nothing to review right now.
                  </p>
                )}
                {submissions.slice(0, 5).map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="truncate">
                      {submission.problem?.title ?? submission.problemId}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {submission.problem?.points ?? "â€”"} pts
                    </span>
                  </div>
                ))}
                <Link
                  href="/company/submissions"
                  className="inline-block pt-2 text-sm text-primary hover:underline"
                >
                  Review submissions
                </Link>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
