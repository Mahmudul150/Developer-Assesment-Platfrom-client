"use client";

import { cn } from "@/lib/utils";

export function Checkbox({
  checked,
  onCheckedChange,
  className,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onCheckedChange(event.target.checked)}
      className={cn(
        "h-4 w-4 rounded border-primary accent-[var(--primary)]",
        className,
      )}
    />
  );
}
