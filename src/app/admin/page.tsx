import {
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import { AdminCharts } from "@/components/admin/admin-charts";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { formatCurrency } from "@/lib/format";
import { serverApi } from "@/lib/server-api";
import type { AdminDashboardResponse } from "@/types/requests";

export const metadata: Metadata = { title: "Admin overview" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let stats: AdminDashboardResponse | null = null;
  try {
    stats = await serverApi<AdminDashboardResponse>("/api/v1/admin/dashboard");
  } catch {
    stats = null;
  }

  const assessmentStatusData = [
    { name: "Draft", value: stats?.isDarftAssesment ?? 0 },
    { name: "Published", value: stats?.isPublishedAssesment ?? 0 },
    { name: "Closed", value: stats?.isClosedAssesment ?? 0 },
  ].filter((item) => item.value > 0);

  const attemptStatusData = [
    { name: "In progress", score: stats?.progressAttampts ?? 0 },
    { name: "Submitted", score: stats?.submitedAttampts ?? 0 },
    { name: "Evaluated", score: stats?.evaluatedAttampts ?? 0 },
  ].filter((item) => item.score > 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description="Platform activity and revenue at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Users" value={stats?.totalUser ?? 0} icon={Users} />
        <StatCard
          title="Companies"
          value={stats?.totalCompany ?? 0}
          icon={Building2}
        />
        <StatCard
          title="Pending approvals"
          value={stats?.pendingCompany ?? 0}
          icon={Clock3}
        />
        <StatCard
          title="Assessments"
          value={stats?.totalAssesment ?? 0}
          icon={FileText}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total revenue"
          value={formatCurrency(stats?.totalRevenue ?? 0)}
          icon={CreditCard}
        />
        <StatCard
          title="Paid payments"
          value={stats?.TotalPayment ?? 0}
          icon={CheckCircle2}
        />
        <StatCard
          title="Attempts"
          value={stats?.totalAttampts ?? 0}
          icon={BarChart3}
        />
        <StatCard
          title="Submissions"
          value={stats?.totalSubmission ?? 0}
          icon={FileText}
        />
      </div>

      <AdminCharts
        revenueData={stats?.revenueByMonth ?? []}
        assessmentStatusData={assessmentStatusData}
        attemptStatusData={attemptStatusData}
      />
    </div>
  );
}
