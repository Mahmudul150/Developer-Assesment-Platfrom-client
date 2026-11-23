"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function RadioGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div role="radiogroup" className={cn("space-y-2", className)}>
      {children}
    </div>
  );
}

export function RadioGroupItem({
  value,
  label,
  groupValue,
  onValueChange,
  name,
}: {
  value: string;
  label: string;
  groupValue: string;
  onValueChange: (value: string) => void;
  name?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm">
      <input
        type="radio"
        name={name}
        value={value}
        checked={groupValue === value}
        onChange={() => onValueChange(value)}
      />
      {label}
    </label>
  );
}
