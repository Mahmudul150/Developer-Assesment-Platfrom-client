"use client";

import { Button } from "@/components/ui/button";
import { useUrlState } from "@/hooks/use-url-state";

export function Pagination({
  page,
  totalPage,
}: {
  page: number;
  totalPage: number;
}) {
  const { setParams } = useUrlState();
  if (totalPage <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => setParams({ page: page - 1 })}
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPage}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPage}
        onClick={() => setParams({ page: page + 1 })}
      >
        Next
      </Button>
    </div>
  );
}
