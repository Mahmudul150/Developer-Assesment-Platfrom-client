"use client";

import { useEffect, useState } from "react";

function remaining(deadlineAt: string): number {
  return Math.max(
    0,
    Math.floor((new Date(deadlineAt).getTime() - Date.now()) / 1000),
  );
}

export function useCountdown(deadlineAt: string, onComplete?: () => void) {
  const [seconds, setSeconds] = useState(() => remaining(deadlineAt));

  useEffect(() => {
    setSeconds(remaining(deadlineAt));
    const timer = setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          clearInterval(timer);
          onComplete?.();
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [deadlineAt, onComplete]);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return {
    seconds,
    label: [hours, minutes, secs]
      .map((part) => String(part).padStart(2, "0"))
      .join(":"),
  };
}
