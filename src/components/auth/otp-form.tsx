"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { verifyEmail } from "@/api/auth.api";
import { verifyCompanyEmail } from "@/api/company.api";
import { fieldError } from "@/components/shared/form-error";
import { FormField } from "@/components/shared/form-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { InputOTP } from "@/components/ui/input-otp";
import { roleFromToken, roleHome } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { otpSchema } from "@/schemas/auth.schema";
import { ApiError } from "@/types/api";

export function OtpForm({
  email,
  type,
}: {
  email: string;
  type: "candidate" | "company";
}) {
  const router = useRouter();
  const [verified, setVerified] = useState(false);

  const form = useForm({
    defaultValues: { otp: "" },
    validators: { onChange: otpSchema },
    onSubmit: async ({ value }) => {
      try {
        if (type === "company") {
          await verifyCompanyEmail({ email, otp: value.otp });
          setVerified(true);
          return;
        }

        const response = await verifyEmail({ email, otp: value.otp });
        const role = roleFromToken(response.data.accessToken);
        if (!role) {
          toast.error("Could not determine your role. Please log in.");
          return;
        }
        toast.success("Email verified");
        router.push(roleHome[role]);
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof ApiError ? error.message : "Verification failed",
        );
      }
    },
  });

  if (verified) {
    return (
      <Alert>
        <AlertTitle>Email verified</AlertTitle>
        <AlertDescription className="space-y-3">
          <p>
            An admin must approve your company before you can post assessments.
          </p>
          <Link href="/login" className={cn(buttonVariants(), "w-full")}>
            Go to log in
          </Link>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <p className="text-xs text-muted-foreground">
        The code expires in {type === "company" ? "60 minutes" : "5 minutes"}.
      </p>
      <form.Field name="otp">
        {(field) => (
          <FormField
            label="6-digit code"
            error={fieldError(field.state.meta.errors)}
          >
            <InputOTP value={field.state.value} onChange={field.handleChange} />
          </FormField>
        )}
      </form.Field>
      <Button type="submit" className="w-full">
        Verify email
      </Button>
    </form>
  );
}
