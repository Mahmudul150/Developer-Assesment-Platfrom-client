"use client";

import { X } from "lucide-react";
import { type ReactNode, useId, useRef } from "react";
import { useDialogA11y } from "@/hooks/use-dialog-a11y";
import { cn } from "@/lib/utils";

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: ReactNode;
}

export function Sheet({ open, onOpenChange, title, children }: SheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialogA11y(open, () => onOpenChange(false), panelRef);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close menu"
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={cn(
          "fixed right-0 top-0 h-[100dvh] w-3/4 max-w-sm overflow-y-auto border-l bg-background p-6 shadow-lg",
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h2 id={titleId} className="text-lg font-semibold">
              {title}
            </h2>
          )}
          <button
            type="button"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
            className="rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
