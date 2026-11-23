"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const RevenueChart = dynamic(
  () =>
    import("@/components/charts/revenue-chart").then((mod) => mod.RevenueChart),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[280px] w-full" />,
  },
);
const StatusPieChart = dynamic(
  () =>
    import("@/components/charts/status-pie-chart").then(
      (mod) => mod.StatusPieChart,
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[280px] w-full" />,
  },
);
const ScoreBarChart = dynamic(
  () =>
    import("@/components/charts/score-bar-chart").then(
      (mod) => mod.ScoreBarChart,
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[280px] w-full" />,
  },
);

export function AdminCharts({
  revenueData,
  assessmentStatusData,
  attemptStatusData,
}: {
  revenueData: Array<{ month: string; amount: number }>;
  assessmentStatusData: Array<{ name: string; value: number }>;
  attemptStatusData: Array<{ name: string; score: number }>;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Revenue by month</CardTitle>
        </CardHeader>
        <CardContent>
          {revenueData.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No payments yet.
            </p>
          ) : (
            <RevenueChart data={revenueData} />
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Assessments by status</CardTitle>
        </CardHeader>
        <CardContent>
          {assessmentStatusData.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No assessments yet.
            </p>
          ) : (
            <StatusPieChart data={assessmentStatusData} />
          )}
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Attempts by status</CardTitle>
        </CardHeader>
        <CardContent>
          {attemptStatusData.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No attempts yet.
            </p>
          ) : (
            <ScoreBarChart data={attemptStatusData} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
