"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { StatusBadge } from "@/components/shared/status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import type { Role } from "@/types/enums";

export function UserMenu({
  name,
  email,
  role,
}: {
  name: string;
  email: string;
  role: Role;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const { logout: logoutUser, isLoggingOut } = useAuth();

  const imageUrl = user?.imageUrl ?? null;
  const initial = name.charAt(0).toUpperCase();

  return (
    <DropdownMenu
      trigger={
        <span className="flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-sm">
          <Avatar className="h-10 w-10">
            {imageUrl ? (
              <AvatarImage src={imageUrl} alt={name} className="object-cover" />
            ) : (
              <AvatarFallback>{initial}</AvatarFallback>
            )}
          </Avatar>
          <span className="hidden sm:inline">{name}</span>
        </span>
      }
    >
      <div className="space-y-1 px-3 py-2 text-sm">
        <p className="font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{email}</p>
        <StatusBadge status={role} />
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start"
        disabled={isLoggingOut}
        onClick={() =>
          logoutUser(undefined, {
            onError: () => toast.error("Could not log out. Please try again."),
            onSuccess: () => router.push("/login"),
          })
        }
      >
        <LogOut className="h-4 w-4" /> Log out
      </Button>
    </DropdownMenu>
  );
}
