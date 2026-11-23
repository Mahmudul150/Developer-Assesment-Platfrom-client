"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { logout as apiLogout, getMe } from "@/api/auth.api";
import { queryKeys } from "@/lib/query-keys";
import { useAuthStore } from "@/store/auth.store";
import type { Role } from "@/types/enums";
import type { AuthUser } from "@/types/user";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.me(),
    queryFn: async (): Promise<AuthUser | null> => {
      try {
        const response = await getMe();
        return response.data ?? null;
      } catch {
        return null;
      }
    },
    retry: false,
    staleTime: 60 * 1000,
  });

  const logoutMutation = useMutation({
    mutationFn: apiLogout,
    onSettled: () => {
      queryClient.clear();
      useAuthStore.getState().clear();
      router.push("/login");
    },
  });

  return {
    user: query.data ?? null,
    role: (query.data?.role ?? null) as Role | null,
    isLoading: query.isLoading,
    isAuthenticated: Boolean(query.data),
    refetch: query.refetch,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
