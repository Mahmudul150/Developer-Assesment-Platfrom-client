"use client";

import { useEffect, useRef } from "react";

export function useTabVisibility(onHidden: () => void) {
  const callback = useRef(onHidden);
  callback.current = onHidden;

  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === "hidden") callback.current();
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);
}
