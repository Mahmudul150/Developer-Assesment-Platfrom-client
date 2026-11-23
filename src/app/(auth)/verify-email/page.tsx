import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { OtpForm } from "@/components/auth/otp-form";

export const metadata: Metadata = { title: "Verify email" };

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; type?: string }>;
}) {
  const { email, type } = await searchParams;
  if (!email) redirect("/register");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the 6-digit code sent to {email}.
        </p>
      </div>
      <OtpForm
        email={email}
        type={type === "company" ? "company" : "candidate"}
      />
    </div>
  );
}
