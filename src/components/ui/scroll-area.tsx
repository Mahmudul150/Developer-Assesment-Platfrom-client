import type * as React from "react";
import { cn } from "@/lib/utils";

export function ScrollArea({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("max-h-96 overflow-y-auto", className)}>{children}</div>
  );
}
