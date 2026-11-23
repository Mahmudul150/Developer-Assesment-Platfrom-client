import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/format";
import { serverApi } from "@/lib/server-api";
import type { Attempt } from "@/types/attempt";

export const metadata: Metadata = { title: "My attempts" };
export const dynamic = "force-dynamic";

type AttemptWithDetails = Attempt & {
  invitation?: {
    assessment?: { id: string; title: string; passingScore: number } | null;
  } | null;
};

export default async function AttemptsPage() {
  let attempts: AttemptWithDetails[] = [];
  try {
    attempts = await serverApi<AttemptWithDetails[]>(
      "/api/v1/attempt/my-attempts",
    );
  } catch {
    attempts = [];
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My attempts"
        description="Your assessment history and results."
      />
      {attempts.length === 0 ? (
        <EmptyState
          title="No attempts yet"
          description="Accept an invitation and start an assessment to see it here."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Assessment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Started</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {attempts.map((attempt) => (
              <TableRow key={attempt.id}>
                <TableCell className="font-medium">
                  {attempt.invitation?.assessment?.title ?? "Assessment"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={attempt.status} />
                </TableCell>
                <TableCell>{attempt.totalScore ?? "â€”"}</TableCell>
                <TableCell>{formatDateTime(attempt.startedAt)}</TableCell>
                <TableCell>
                  {attempt.status === "IN_PROGRESS" ? (
                    <Link
                      href={`/candidate/attempts/${attempt.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      Resume
                    </Link>
                  ) : (
                    <Link
                      href={`/candidate/results/${attempt.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      Result
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
