"use client";

import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

export function Popover({
  trigger,
  children,
  className,
}: {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button type="button" onClick={() => setOpen((value) => !value)}>
        {trigger}
      </button>
      {open && (
        <div
          className={cn(
            "absolute left-0 top-full z-50 mt-2 min-w-48 rounded-md border bg-popover p-3 shadow-md",
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
