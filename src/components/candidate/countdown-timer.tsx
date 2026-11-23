"use client";

import { Timer } from "lucide-react";
import { useCountdown } from "@/hooks/use-countdown";
import { cn } from "@/lib/utils";

export function CountdownTimer({
  deadlineAt,
  onComplete,
}: {
  deadlineAt: string;
  onComplete: () => void;
}) {
  const { label, seconds } = useCountdown(deadlineAt, onComplete);
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-sm",
        seconds < 300 && "border-destructive text-destructive",
      )}
    >
      <Timer className="h-4 w-4" /> {label}
    </div>
  );
}
