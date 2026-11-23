"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { userLogin } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { roleFromToken } from "@/lib/auth";
import { demoCredentials } from "@/lib/constants";
import { resolveNext } from "@/lib/redirect";
import { ApiError } from "@/types/api";

const descriptions: Record<string, string> = {
  Admin: "Manage users, approvals and payments.",
  Company: "Build problems, assessments and invitations.",
  Candidate: "Take assessments and view your results.",
};

export function DemoLoginButtons({ next }: { next?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);

  async function login(credential: (typeof demoCredentials)[number]) {
    if (!credential.email || !credential.password) {
      toast.error(
        "Demo credentials are not configured. Set the NEXT_PUBLIC_DEMO_* variables.",
      );
      return;
    }
    setPending(credential.label);
    try {
      const response = await userLogin({
        email: credential.email,
        password: credential.password,
      });
      const role = roleFromToken(response.data.accessToken);
      if (!role) {
        toast.error("Could not determine your role. Please try again.");
        return;
      }
      toast.success(`Logged in as ${credential.label}`);
      router.push(resolveNext(next, role));
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Demo login failed",
      );
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {demoCredentials.map((credential) => (
        <div
          key={credential.label}
          className="flex flex-col rounded-lg border p-3 text-left"
        >
          <p className="text-sm font-semibold">{credential.label}</p>
          <p className="mt-1 flex-1 text-xs text-muted-foreground">
            {descriptions[credential.label]}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3 w-full"
            disabled={pending !== null}
            onClick={() => void login(credential)}
          >
            {pending === credential.label ? "..." : "Demo Login"}
          </Button>
        </div>
      ))}
    </div>
  );
}
