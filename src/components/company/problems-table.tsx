"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteProblem } from "@/api/problem.api";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { type Column, DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/lib/query-keys";
import { ApiError } from "@/types/api";
import type { Problem } from "@/types/problem";
import { ProblemFormDialog } from "./problem-form-dialog";

export function ProblemsTable({
  problems,
  approved,
}: {
  problems: Problem[];
  approved: boolean;
}) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Problem | null>(null);
  const [deleting, setDeleting] = useState<Problem | null>(null);

  const mutation = useMutation({
    mutationFn: deleteProblem,
    onSuccess: () => {
      toast.success("Problem deleted");
      setDeleting(null);
      void queryClient.invalidateQueries({ queryKey: queryKeys.problems() });
      routerRefresh();
    },
    onError: (error) =>
      toast.error(
        error instanceof ApiError ? error.message : "Could not delete problem",
      ),
  });

  function routerRefresh() {
    if (typeof window !== "undefined") window.location.reload();
  }

  const columns: Column<Problem>[] = [
    {
      key: "title",
      header: "Title",
      cell: (problem) => <span className="font-medium">{problem.title}</span>,
    },
    {
      key: "type",
      header: "Type",
      cell: (problem) => <StatusBadge status={problem.type} />,
    },
    {
      key: "difficulty",
      header: "Difficulty",
      cell: (problem) => <StatusBadge status={problem.difficulty} />,
    },
    { key: "points", header: "Points", cell: (problem) => problem.points },
    {
      key: "actions",
      header: "Actions",
      cell: (problem) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            disabled={!approved}
            aria-label="Edit"
            onClick={() => setEditing(problem)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={!approved}
            aria-label="Delete"
            onClick={() => setDeleting(problem)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      {!approved && (
        <p className="mb-3 text-sm text-amber-600">
          Your company is awaiting approval, so problem actions are disabled.
        </p>
      )}
      <DataTable
        columns={columns}
        data={problems}
        empty="No problems yet. Create your first one."
      />
      <ProblemFormDialog
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        problem={editing ?? undefined}
        approved={approved}
      />
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this problem?"
        description="This will remove the problem from your bank."
        confirmLabel="Delete"
        pending={mutation.isPending}
        onConfirm={() => deleting && mutation.mutate(deleting.id)}
      />
    </>
  );
}
