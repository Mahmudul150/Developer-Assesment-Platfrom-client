import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, formatDuration } from "@/lib/format";
import type { Assessment } from "@/types/assessment";

export function LatestAssessmentsServer({
  assessments,
}: {
  assessments: Assessment[];
}) {
  if (assessments.length === 0) {
    return (
      <EmptyState
        title="No published assessments yet"
        description="Check back soon for new assessments from verified companies."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {assessments.map((assessment) => (
        <Link key={assessment.id} href={`/assessments`}>
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-base">{assessment.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {assessment.description ?? "A timed developer assessment."}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {formatDuration(assessment.durationMinutes)} Â·{" "}
              {assessment.passingScore}% to pass
              {assessment.endsAt &&
                ` Â· Closes ${formatDate(assessment.endsAt)}`}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
