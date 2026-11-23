import type { Metadata } from "next";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = { title: "Reset password" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; otp?: string }>;
}) {
  const { email = "", otp = "" } = await searchParams;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Choose a new password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the code from your email and a new password.
        </p>
      </div>
      <ResetPasswordForm email={email} otp={otp} />
    </div>
  );
}
