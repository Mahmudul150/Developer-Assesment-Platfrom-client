"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import { getMyProblems } from "@/api/problem.api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { queryKeys } from "@/lib/query-keys";
import { useWizardStore } from "@/store/wizard.store";

export function StepSelectProblems() {
  const problemIds = useWizardStore((state) => state.problemIds);
  const setProblemIds = useWizardStore((state) => state.setProblemIds);
  const prev = useWizardStore((state) => state.prev);
  const next = useWizardStore((state) => state.next);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.problems({ searchTerm: debouncedSearch }),
    queryFn: async () =>
      (await getMyProblems({ searchTerm: debouncedSearch, limit: 100 })).data
        .data,
  });

  const selected = problemIds.flatMap((id) => {
    const problem = data?.find((item) => item.id === id);
    return problem ? [problem] : [];
  });
  const totalPoints = selected.reduce(
    (sum, problem) => sum + problem.points,
    0,
  );

  function toggle(id: string) {
    setProblemIds(
      problemIds.includes(id)
        ? problemIds.filter((value) => value !== id)
        : [...problemIds, id],
    );
  }

  function move(index: number, direction: -1 | 1) {
    const nextIds = [...problemIds];
    const target = index + direction;
    if (target < 0 || target >= nextIds.length) return;
    [nextIds[index], nextIds[target]] = [nextIds[target], nextIds[index]];
    setProblemIds(nextIds);
  }

  return (
    <div className="space-y-4">
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search problems..."
      />
      {isLoading ? (
        <Skeleton className="h-60 w-full" />
      ) : (
        <div className="max-h-64 space-y-2 overflow-auto">
          {(data ?? []).map((problem) => (
            <label
              key={problem.id}
              className="flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm"
            >
              <Checkbox
                checked={problemIds.includes(problem.id)}
                onCheckedChange={() => toggle(problem.id)}
              />
              <span className="font-medium">{problem.title}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {problem.type} Â· {problem.points} pts
              </span>
            </label>
          ))}
          {(data ?? []).length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No problems found.
            </p>
          )}
        </div>
      )}

      <div className="rounded-lg border p-3">
        <div className="mb-2 flex items-center justify-between text-sm font-medium">
          <span>Selected ({problemIds.length})</span>
          <span>{totalPoints} total points</span>
        </div>
        <div className="space-y-1">
          {selected.map((problem, index) => (
            <div
              key={problem.id}
              className="flex items-center gap-2 rounded-md bg-muted/50 px-2 py-1.5 text-sm"
            >
              <span className="w-5 text-xs text-muted-foreground">
                {index + 1}
              </span>
              <span className="flex-1 truncate">{problem.title}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={index === 0}
                onClick={() => move(index, -1)}
                aria-label="Move up"
              >
                <ArrowUp className="h-3 w-3" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={index === selected.length - 1}
                onClick={() => move(index, 1)}
                aria-label="Move down"
              >
                <ArrowDown className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {selected.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Select at least one problem.
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prev}>
          Back
        </Button>
        <Button disabled={problemIds.length === 0} onClick={next}>
          Continue with {problemIds.length} selected
        </Button>
      </div>
    </div>
  );
}
