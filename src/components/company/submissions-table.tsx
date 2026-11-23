"use client";

import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { EvaluateForm } from "@/components/company/evaluate-form";
import { type Column, DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { Submission } from "@/types/submission";

export function SubmissionsTable({
  submissions,
}: {
  submissions: Submission[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Submission | null>(null);

  const attemptGroups = new Map<string, { total: number; evaluated: number }>();
  for (const submission of submissions) {
    const group = attemptGroups.get(submission.attemptId) ?? {
      total: 0,
      evaluated: 0,
    };
    group.total += 1;
    if (submission.status === "EVALUATED") group.evaluated += 1;
    attemptGroups.set(submission.attemptId, group);
  }

  const columns: Column<Submission>[] = [
    {
      key: "problem",
      header: "Problem",
      cell: (submission) => (
        <div>
          <p className="font-medium">
            {submission.problem?.title ?? submission.problemId}
          </p>
          <p className="text-xs text-muted-foreground">
            {submission.problem?.type ?? "â€”"} Â·{" "}
            {submission.problem?.points ?? "â€”"} pts
          </p>
        </div>
      ),
    },
    {
      key: "candidate",
      header: "Candidate",
      cell: (submission) =>
        submission.attempt?.invitation?.candidate?.name ??
        submission.attempt?.invitation?.email ??
        "â€”",
    },
    {
      key: "assessment",
      header: "Assessment",
      cell: (submission) =>
        submission.attempt?.invitation?.assessment?.title ?? "â€”",
    },
    {
      key: "status",
      header: "Status",
      cell: (submission) => <StatusBadge status={submission.status} />,
    },
    {
      key: "score",
      header: "Score",
      cell: (submission) => submission.score ?? "â€”",
    },
    {
      key: "actions",
      header: "Actions",
      cell: (submission) => (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Review submission"
          onClick={() => setSelected(submission)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <>
      {attemptGroups.size > 0 && (
        <div className="mb-4 rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Progress per attempt</p>
          <div className="mt-2 flex flex-wrap gap-3">
            {Array.from(attemptGroups.entries()).map(
              ([attemptId, progress]) => (
                <span key={attemptId}>
                  {attemptId.slice(0, 8)}: {progress.evaluated}/{progress.total}{" "}
                  evaluated
                  {progress.evaluated === progress.total && " Â· complete"}
                </span>
              ),
            )}
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={submissions}
        empty="No submissions match these filters."
      />

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
        title="Review submission"
        className="max-w-2xl"
      >
        {selected && (
          <div className="space-y-5">
            <div>
              <h3 className="font-semibold">
                {selected.problem?.title ?? "Problem"}
              </h3>
              <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                {selected.problem?.description ?? "No description available."}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Maximum points: {selected.problem?.points ?? 0}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium">Candidate answer</p>
              <pre className="max-h-60 overflow-auto whitespace-pre-wrap rounded-md bg-muted p-3 text-xs">
                {typeof selected.answer === "string"
                  ? selected.answer
                  : JSON.stringify(selected.answer ?? "")}
              </pre>
            </div>
            {selected.status === "SUBMITTED" ? (
              <EvaluateForm
                submissionId={selected.id}
                maxPoints={selected.problem?.points ?? 0}
                onSuccess={() => {
                  setSelected(null);
                  router.refresh();
                  toast.success(
                    "Attempt may now be complete if all answers are evaluated.",
                  );
                }}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                This submission has already been evaluated.
              </p>
            )}
          </div>
        )}
      </Dialog>
    </>
  );
}
