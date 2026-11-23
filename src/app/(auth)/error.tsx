"use client";

import { RouteError } from "@/components/shared/route-error";

export default function RouteErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteError
      error={error}
      reset={reset}
      title="Sign-in could not be loaded"
    />
  );
}
