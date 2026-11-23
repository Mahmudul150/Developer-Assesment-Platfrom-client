"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { resetPassword } from "@/api/auth.api";
import { fieldError } from "@/components/shared/form-error";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPasswordRequestSchema } from "@/schemas/auth.schema";
import { ApiError } from "@/types/api";

export function ResetPasswordForm({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) {
  const router = useRouter();

  const form = useForm({
    defaultValues: { email, otp, password: "", confirmPassword: "" },
    validators: { onChange: resetPasswordRequestSchema },
    onSubmit: async ({ value }) => {
      try {
        await resetPassword({
          email: value.email,
          otp: value.otp,
          newPassword: value.password,
        });
        toast.success("Password updated");
        router.push("/login");
      } catch (error) {
        toast.error(
          error instanceof ApiError
            ? error.message
            : "Could not reset password",
        );
      }
    },
  });

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
      <form.Field name="otp">
        {(field) => (
          <FormField
            label="6-digit code"
            error={fieldError(field.state.meta.errors)}
          >
            <Input
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
          </FormField>
        )}
      </form.Field>
      <form.Field name="password">
        {(field) => (
          <FormField
            label="New password"
            error={fieldError(field.state.meta.errors)}
          >
            <Input
              type="password"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
          </FormField>
        )}
      </form.Field>
      <form.Field name="confirmPassword">
        {(field) => (
          <FormField
            label="Confirm password"
            error={fieldError(field.state.meta.errors)}
          >
            <Input
              type="password"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
          </FormField>
        )}
      </form.Field>
      <Button type="submit" className="w-full">
        Reset password
      </Button>
    </form>
  );
}
