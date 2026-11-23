"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  addAssessmentProblems,
  deleteAssessmentProblem,
} from "@/api/assessment.api";
import { getMyProblems } from "@/api/problem.api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog } from "@/components/ui/dialog";
import { queryKeys } from "@/lib/query-keys";
import { ApiError } from "@/types/api";
import type { AssessmentProblem } from "@/types/assessment";

export function AssessmentProblemsPanel({
  assessmentId,
  problems,
  editable,
}: {
  assessmentId: string;
  problems: AssessmentProblem[];
  editable: boolean;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const { data: available } = useQuery({
    queryKey: [...queryKeys.problems(), "available"],
    queryFn: async () => (await getMyProblems({ limit: 100 })).data.data,
    enabled: open,
  });

  const add = useMutation({
    mutationFn: () => addAssessmentProblems(assessmentId, selected),
    onSuccess: () => {
      toast.success("Problems added");
      setOpen(false);
      void queryClient.invalidateQueries();
      window.location.reload();
    },
    onError: (error) =>
      toast.error(
        error instanceof ApiError ? error.message : "Could not add problems",
      ),
  });

  const remove = useMutation({
    mutationFn: (problemId: string) =>
      deleteAssessmentProblem(assessmentId, problemId),
    onSuccess: () => {
      toast.success("Problem removed");
      void queryClient.invalidateQueries();
      window.location.reload();
    },
    onError: (error) =>
      toast.error(
        error instanceof ApiError ? error.message : "Could not remove problem",
      ),
  });

  const ordered = [...problems].sort((a, b) => a.order - b.order);

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Problems ({ordered.length})</h3>
        {editable && (
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" /> Add problems
          </Button>
        )}
      </div>
      <div className="space-y-1">
        {ordered.map((item) => (
          <div
            key={item.problemId}
            className="flex items-center gap-2 rounded-md bg-muted/40 px-3 py-2 text-sm"
          >
            <span className="w-5 text-xs text-muted-foreground">
              {item.order}
            </span>
            <span className="flex-1">
              {item.problem?.title ?? item.problemId}
            </span>
            <span className="text-xs text-muted-foreground">
              {item.problem?.points ?? "â€”"} pts
            </span>
            {editable && (
              <Button
                variant="ghost"
                size="icon"
                disabled={remove.isPending}
                aria-label="Remove problem"
                onClick={() => remove.mutate(item.problemId)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        {ordered.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No problems added yet.
          </p>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen} title="Add problems">
        <div className="max-h-72 space-y-2 overflow-auto">
          {(available ?? []).map((problem) => (
            <label
              key={problem.id}
              className="flex cursor-pointer items-center gap-3 rounded-md border p-2 text-sm"
            >
              <Checkbox
                checked={selected.includes(problem.id)}
                onCheckedChange={(checked) =>
                  setSelected((current) =>
                    checked
                      ? [...current, problem.id]
                      : current.filter((id) => id !== problem.id),
                  )
                }
              />
              <span className="flex-1">{problem.title}</span>
              <span className="text-xs text-muted-foreground">
                {problem.points} pts
              </span>
            </label>
          ))}
        </div>
        <Button
          className="mt-4 w-full"
          disabled={selected.length === 0 || add.isPending}
          onClick={() => add.mutate()}
        >
          Add selected
        </Button>
      </Dialog>
    </div>
  );
}
