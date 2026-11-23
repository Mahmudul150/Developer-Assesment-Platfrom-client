"use client";

import { cn } from "@/lib/utils";

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

export function Tabs({
  value,
  onValueChange,
  items,
  className,
}: {
  value: string;
  onValueChange: (value: string) => void;
  items: TabItem[];
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex gap-1 border-b">
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onValueChange(item.value)}
            className={cn(
              "border-b-2 border-transparent px-4 py-2 text-sm text-muted-foreground transition-colors",
              value === item.value &&
                "border-primary font-medium text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="pt-4">
        {items.find((item) => item.value === value)?.content}
      </div>
    </div>
  );
}
