"use client";

import { useCallback, useEffect, useRef } from "react";

export function useAutosave<T>(
  value: T,
  save: (value: T) => void | Promise<void>,
  delay = 1000,
) {
  const saveRef = useRef(save);
  saveRef.current = save;

  useEffect(() => {
    const timer = setTimeout(() => {
      void saveRef.current(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return useCallback(() => void saveRef.current(value), [value]);
}
