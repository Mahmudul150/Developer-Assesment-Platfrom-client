"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const StatusPieChart = dynamic(
  () =>
    import("@/components/charts/status-pie-chart").then(
      (mod) => mod.StatusPieChart,
    ),
  { ssr: false, loading: () => <Skeleton className="h-[280px] w-full" /> },
);

const ScoreBarChart = dynamic(
  () =>
    import("@/components/charts/score-bar-chart").then(
      (mod) => mod.ScoreBarChart,
    ),
  { ssr: false, loading: () => <Skeleton className="h-[280px] w-full" /> },
);

export function DashboardCharts({
  statusData,
  scoreData,
}: {
  statusData: Array<{ name: string; value: number }>;
  scoreData: Array<{ name: string; score: number }>;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Assessments by status</CardTitle>
        </CardHeader>
        <CardContent>
          {statusData.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No assessments yet.
            </p>
          ) : (
            <StatusPieChart data={statusData} />
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Average score by assessment</CardTitle>
        </CardHeader>
        <CardContent>
          {scoreData.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">
              No evaluated results yet.
            </p>
          ) : (
            <ScoreBarChart data={scoreData} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
