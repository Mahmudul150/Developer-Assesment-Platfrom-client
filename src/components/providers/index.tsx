"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { GoogleProvider } from "./google-provider";
import { QueryProvider } from "./query-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <GoogleProvider>
        {children}
        <Toaster richColors position="top-right" />
      </GoogleProvider>
    </QueryProvider>
  );
}
