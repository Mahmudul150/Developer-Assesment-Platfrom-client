"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { forgotPassword } from "@/api/auth.api";
import { fieldError } from "@/components/shared/form-error";
import { FormField } from "@/components/shared/form-field";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { forgotPasswordSchema } from "@/schemas/auth.schema";
import { ApiError } from "@/types/api";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [remaining, setRemaining] = useState(60);

  const form = useForm({
    defaultValues: { email: "" },
    validators: { onChange: forgotPasswordSchema },
    onSubmit: async ({ value }) => {
      try {
        await forgotPassword({ email: value.email });
        setEmail(value.email);
        setSent(true);
        setRemaining(60);
        const timer = setInterval(() => {
          setRemaining((current) => {
            if (current <= 1) {
              clearInterval(timer);
              return 0;
            }
            return current - 1;
          });
        }, 1000);
        toast.success("Reset code sent");
      } catch (error) {
        toast.error(
          error instanceof ApiError
            ? error.message
            : "Could not send reset link",
        );
      }
    },
  });

  if (sent) {
    return (
      <div className="space-y-4 text-sm">
        <p className="text-muted-foreground">
          We sent a code to {email}. It expires in {remaining} seconds.
        </p>
        <Link
          href={`/reset-password?email=${encodeURIComponent(email)}`}
          className={cn(buttonVariants(), "w-full")}
        >
          Enter reset code
        </Link>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field name="email">
        {(field) => (
          <FormField label="Email" error={fieldError(field.state.meta.errors)}>
            <Input
              type="email"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
          </FormField>
        )}
      </form.Field>
      <Button type="submit" className="w-full">
        Send reset link
      </Button>
    </form>
  );
}
