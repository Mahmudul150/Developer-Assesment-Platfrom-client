"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { googleLogin } from "@/api/auth.api";
import { roleFromToken } from "@/lib/auth";
import { resolveNext } from "@/lib/redirect";
import { ApiError } from "@/types/api";

export function GoogleLoginButton({ next }: { next?: string }) {
  const router = useRouter();
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) return null;

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={async (response) => {
          if (!response.credential) {
            toast.error("Google sign-in did not return a token");
            return;
          }
          try {
            const result = await googleLogin({ idToken: response.credential });
            const role = roleFromToken(result.data.accessToken);
            if (!role) {
              toast.error("Could not determine your role. Please try again.");
              return;
            }
            toast.success("Signed in with Google");
            router.push(resolveNext(next, role));
            router.refresh();
          } catch (error) {
            toast.error(
              error instanceof ApiError
                ? error.message
                : "Google sign-in failed",
            );
          }
        }}
        onError={() => toast.error("Google sign-in failed")}
      />
    </div>
  );
}
