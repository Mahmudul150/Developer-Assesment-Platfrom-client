import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime, formatPercent } from "@/lib/format";
import { serverApi } from "@/lib/server-api";
import { cn } from "@/lib/utils";
import { ApiError } from "@/types/api";
import type { AttemptResultResponse } from "@/types/requests";

export const metadata: Metadata = { title: "Result" };
export const dynamic = "force-dynamic";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let result: AttemptResultResponse | null = null;
  let pending = false;
  try {
    result = await serverApi<AttemptResultResponse>(
      `/api/v1/attempt/attempt-result/${id}`,
    );
  } catch (error) {
    pending = error instanceof ApiError && error.status === 400;
  }

  if (!result) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20">
        <Alert>
          <AlertTitle>
            {pending ? "Result not published yet" : "Result unavailable"}
          </AlertTitle>
          <AlertDescription className="space-y-3">
            <p>
              {pending
                ? "Your answers are being evaluated. The result will appear here once evaluation is complete."
                : "This result could not be loaded."}
            </p>
            <Link
              href="/candidate/attempts"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Back to attempts
            </Link>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const maxMarks = result.submissions.reduce(
    (sum, submission) => sum + submission.problem.points,
    0,
  );
  const percent =
    maxMarks > 0 ? Math.round(((result.totalScore ?? 0) / maxMarks) * 100) : 0;
  const passed = percent >= result.assessment.passingScore;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{result.assessment.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold">
              {result.totalScore ?? 0} / {maxMarks}
            </span>
            <Badge variant={passed ? "success" : "destructive"}>
              {passed ? "Passed" : "Failed"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {formatPercent(percent)} Â· Passing score{" "}
              {result.assessment.passingScore}%
            </span>
          </div>
          {result.submittedAt && (
            <p className="text-sm text-muted-foreground">
              Submitted {formatDateTime(result.submittedAt)}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Question breakdown</h2>
        {result.submissions.map((submission) => (
          <Card key={submission.id}>
            <CardContent className="flex flex-wrap items-start justify-between gap-3 pt-6 text-sm">
              <div className="flex-1">
                <p className="font-medium">{submission.problem.title}</p>
                <p className="mt-1 text-muted-foreground">
                  Score: {submission.score ?? 0} / {submission.problem.points}
                  {submission.feedback && ` Â· ${submission.feedback}`}
                </p>
              </div>
              <StatusBadge status={submission.status} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
