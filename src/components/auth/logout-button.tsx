"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function LogoutButton({ label = "Log out" }: { label?: string }) {
  const { logout, isLoggingOut } = useAuth();
  return (
    <Button variant="outline" disabled={isLoggingOut} onClick={() => logout()}>
      {isLoggingOut ? "Logging out..." : label}
    </Button>
  );
}
