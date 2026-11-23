"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { getAdminUserById, updateUserStatus } from "@/api/admin.api";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { type Column, DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { type SortOrder, useUrlState } from "@/hooks/use-url-state";
import { formatDate } from "@/lib/format";
import { ApiError } from "@/types/api";
import type { User } from "@/types/user";

interface AdminUser extends User {
  company?: { id: string; name: string } | null;
  candidate?: { id: string; name: string } | null;
}

export function UsersTable({
  users,
  currentAdminId,
  sortBy,
  sortOrder,
}: {
  users: AdminUser[];
  currentAdminId: string | null;
  sortBy?: string;
  sortOrder?: SortOrder;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setParams } = useUrlState();
  const [pendingUser, setPendingUser] = useState<AdminUser | null>(null);
  const [nextStatus, setNextStatus] = useState<string>("");
  const [detailId, setDetailId] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "ACTIVE" | "BLOCKED" | "INACTIVE";
    }) => updateUserStatus(id, { status }),
    onSuccess: () => {
      toast.success("User status updated");
      setPendingUser(null);
      void queryClient.invalidateQueries();
      router.refresh();
    },
    onError: (error) =>
      toast.error(
        error instanceof ApiError ? error.message : "Could not update status",
      ),
  });

  const { data: detail } = useQuery({
    queryKey: ["admin-user", detailId],
    queryFn: async () =>
      (await getAdminUserById(detailId ?? "")).data as AdminUser,
    enabled: Boolean(detailId),
  });

  function toggleSort(key: string) {
    const nextOrder: SortOrder =
      sortBy === key && sortOrder === "asc" ? "desc" : "asc";
    setParams({ sortBy: key, sortOrder: nextOrder });
  }

  function isProtected(user: AdminUser) {
    return user.role === "ADMIN" || user.id === currentAdminId;
  }

  const columns: Column<AdminUser>[] = [
    {
      key: "name",
      header: "User",
      sortable: true,
      cell: (user) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      cell: (user) => <StatusBadge status={user.role} />,
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      cell: (user) => <StatusBadge status={user.status} />,
    },
    {
      key: "createdAt",
      header: "Joined",
      sortable: true,
      cell: (user) => formatDate(user.createdAt),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (user) => (
        <div className="flex items-center gap-2">
          <Select
            aria-label="Change status"
            className="h-8 w-32 text-xs"
            value=""
            disabled={isProtected(user)}
            onChange={(event) => {
              if (!event.target.value) return;
              setNextStatus(event.target.value);
              setPendingUser(user);
            }}
          >
            <option value="">Change status</option>
            <option value="ACTIVE" disabled={user.status === "ACTIVE"}>
              Active
            </option>
            <option value="BLOCKED" disabled={user.status === "BLOCKED"}>
              Blocked
            </option>
            <option value="INACTIVE" disabled={user.status === "INACTIVE"}>
              Inactive
            </option>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            aria-label="View details"
            onClick={() => setDetailId(user.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={users}
        empty="No users match these filters."
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={toggleSort}
      />

      <ConfirmDialog
        open={pendingUser !== null}
        onOpenChange={(open) => !open && setPendingUser(null)}
        title="Change user status?"
        description={`Set ${pendingUser?.name ?? "this user"} to ${nextStatus}?`}
        confirmLabel="Update"
        pending={mutation.isPending}
        onConfirm={() => {
          if (pendingUser && nextStatus) {
            mutation.mutate({
              id: pendingUser.id,
              status: nextStatus as "ACTIVE" | "BLOCKED" | "INACTIVE",
            });
          }
        }}
      />

      <Dialog
        open={detailId !== null}
        onOpenChange={(open) => !open && setDetailId(null)}
        title="User details"
      >
        {detail ? (
          <div className="space-y-3 text-sm">
            <p>
              <span className="text-muted-foreground">Name: </span>
              {detail.name}
            </p>
            <p>
              <span className="text-muted-foreground">Email: </span>
              {detail.email}
            </p>
            <p>
              <span className="text-muted-foreground">Role: </span>
              <StatusBadge status={detail.role} />
            </p>
            <p>
              <span className="text-muted-foreground">Status: </span>
              <StatusBadge status={detail.status} />
            </p>
            <p>
              <span className="text-muted-foreground">Joined: </span>
              {formatDate(detail.createdAt)}
            </p>
            {"company" in detail && detail.company && (
              <p>
                <span className="text-muted-foreground">Company: </span>
                {detail.company.name}
              </p>
            )}
            {"candidate" in detail && detail.candidate && (
              <p>
                <span className="text-muted-foreground">Candidate: </span>
                {detail.candidate.name}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Loading...</p>
        )}
      </Dialog>
    </>
  );
}
