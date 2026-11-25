import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";
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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {assessments.map((assessment) => (
        <Link key={assessment.id} href={`/assessments`}>
          <Card
            className={cn(
              "group relative overflow-hidden border-muted hover:border-primary/50 transition-all duration-300 hover:-translate-y-1",
            )}
          >
            <CardHeader className="flex flex-col space-y-2">
              <Badge variant="outline" className="text-xs">
                {assessment.durationMinutes} min
              </Badge>
              <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
                {assessment.title}
              </CardTitle>
              <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
                {assessment.description ?? "A timed developer assessment."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {formatDuration(assessment.durationMinutes)} ·{" "}
                  {assessment.passingScore}% to pass
                </span>
                {assessment.endsAt && (
                  <span>Closes {formatDate(assessment.endsAt)}</span>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex items-center pt-4">
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
