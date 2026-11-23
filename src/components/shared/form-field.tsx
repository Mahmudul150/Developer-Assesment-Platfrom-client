"use client";

import { Field, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";

export function FormField({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <Field>
      <Label>{label}</Label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
