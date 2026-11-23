"use client";

import { cn } from "@/lib/utils";

export function QuestionNavigator({
  total,
  current,
  answered,
  onSelect,
}: {
  total: number;
  current: number;
  answered: Set<number>;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="mb-3 text-sm font-medium">Questions</p>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: total }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(index)}
            className={cn(
              "h-9 rounded-md border text-sm",
              current === index &&
                "border-primary bg-primary text-primary-foreground",
              current !== index &&
                answered.has(index) &&
                "bg-emerald-500/15 text-emerald-700",
            )}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
