import type { Metadata } from "next";
import { UsersTable } from "@/components/admin/users-table";
import { FilterSelect } from "@/components/shared/filter-select";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import type { SortOrder } from "@/hooks/use-url-state";
import { serverApi } from "@/lib/server-api";
import { getSessionFromCookies } from "@/lib/session";
import type { PaginatedResponse } from "@/types/api";
import type { User } from "@/types/user";

export const metadata: Metadata = { title: "Users" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    searchTerm?: string;
    role?: string;
    status?: string;
    page?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams({
    page: params.page ?? "1",
    limit: "10",
  });
  if (params.searchTerm) query.set("searchTerm", params.searchTerm);
  if (params.role) query.set("role", params.role);
  if (params.status) query.set("status", params.status);
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);

  let result: PaginatedResponse<User> = {
    data: [],
    meta: { page: 1, limit: 10, total: 0, totalPages: 0, totalPage: 0 },
  };
  try {
    result = await serverApi<PaginatedResponse<User>>(
      `/api/v1/admin/users?${query.toString()}`,
    );
  } catch {
    // keep empty state
  }

  const session = await getSessionFromCookies();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Search users and manage account status."
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
          param="searchTerm"
          placeholder="Search by name or email..."
        />
        <FilterSelect
          param="role"
          placeholder="All roles"
          options={[
            { value: "ADMIN", label: "Admin" },
            { value: "COMPANY", label: "Company" },
            { value: "CANDIDATE", label: "Candidate" },
          ]}
        />
        <FilterSelect
          param="status"
          placeholder="All statuses"
          options={[
            { value: "ACTIVE", label: "Active" },
            { value: "BLOCKED", label: "Blocked" },
            { value: "INACTIVE", label: "Inactive" },
          ]}
        />
      </div>
      <UsersTable
        users={result.data}
        currentAdminId={session.userId}
        sortBy={params.sortBy}
        sortOrder={params.sortOrder as SortOrder | undefined}
      />
      <Pagination
        page={result.meta.page || 1}
        totalPage={result.meta.totalPages}
      />
    </div>
  );
}
