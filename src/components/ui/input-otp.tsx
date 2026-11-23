"use client";

import { OTPInput } from "input-otp";
import { cn } from "@/lib/utils";

export function InputOTP({
  value,
  onChange,
  maxLength = 6,
}: {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}) {
  return (
    <OTPInput
      maxLength={maxLength}
      value={value}
      onChange={onChange}
      containerClassName="flex gap-2"
      render={({ slots }) => (
        <>
          {slots.map((slot, index) => (
            <div
              key={index}
              className={cn(
                "flex h-11 w-10 items-center justify-center rounded-md border border-input text-lg",
                slot.isActive && "ring-2 ring-ring",
              )}
            >
              {slot.char}
            </div>
          ))}
        </>
      )}
    />
  );
}
