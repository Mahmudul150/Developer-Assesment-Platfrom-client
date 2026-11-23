"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type SortOrder = "asc" | "desc";

export function useUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParams = useCallback(
    (
      updates: Record<string, string | number | null>,
      options?: { resetPage?: boolean },
    ) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, String(value));
      }

      if ((options?.resetPage ?? true) && !("page" in updates)) {
        next.delete("page");
      }

      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const get = useCallback(
    (key: string) => searchParams.get(key),
    [searchParams],
  );

  return { searchParams, get, setParams };
}
