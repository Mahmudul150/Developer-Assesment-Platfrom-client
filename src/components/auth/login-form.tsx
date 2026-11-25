"use client";

import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { userLogin } from "@/api/auth.api";
import { fieldError } from "@/components/shared/form-error";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { roleFromToken } from "@/lib/auth";
import { resolveNext } from "@/lib/redirect";
import { loginSchema } from "@/schemas/auth.schema";
import { ApiError } from "@/types/api";
import { DemoLoginButtons } from "./demo-login-buttons";
import { GoogleLoginButton } from "./google-login-button";

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: { onChange: loginSchema },
    onSubmit: async ({ value }) => {
      try {
        const response = await userLogin(value);
        toast.success(response.message || "Welcome back");
        const role = roleFromToken(response.data.accessToken);
        if (!role) {
          toast.error("Could not determine your role. Please try again.");
          return;
        }
        router.push(resolveNext(next, role));
        router.refresh();
      } catch (error) {
        toast.error(errorMessage(error, "Login failed"));
      }
    },
  });

  return (
    <div className="space-y-6">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="email">
          {(field) => (
            <FormField
              label="Email"
              error={fieldError(field.state.meta.errors)}
            >
              <Input
                type="email"
                placeholder="you@example.com"
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
              label="Password"
              error={fieldError(field.state.meta.errors)}
            >
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  className="pr-10"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </FormField>
          )}
        </form.Field>
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              className="w-full"
              disabled={!canSubmit || Boolean(isSubmitting)}
            >
              {isSubmitting ? "Signing in..." : "Log in"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <DemoLoginButtons next={next} />
      <GoogleLoginButton next={next} />
    </div>
  );
}
