import type { Metadata } from "next";
import { CompanyApprovalTable } from "@/components/admin/company-approval-table";
import { FilterSelect } from "@/components/shared/filter-select";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import { serverApi } from "@/lib/server-api";
import type { PaginatedResponse } from "@/types/api";
import type { Company } from "@/types/user";

export const metadata: Metadata = { title: "Companies" };
export const dynamic = "force-dynamic";

export default async function AdminCompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{
    isApproved?: string;
    searchTerm?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const isApproved = params.isApproved;
  const query = new URLSearchParams({
    page: params.page ?? "1",
    limit: "10",
  });
  if (isApproved) query.set("isApproved", isApproved);
  if (params.searchTerm) query.set("searchTerm", params.searchTerm);

  let result: PaginatedResponse<Company> = {
    data: [],
    meta: { page: 1, limit: 10, total: 0, totalPages: 0, totalPage: 0 },
  };
  try {
    result = await serverApi<PaginatedResponse<Company>>(
      `/api/v1/company/get-allCompnay?${query.toString()}`,
    );
  } catch {
    // keep empty state
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Companies"
        description="Review and approve company applications."
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
          param="searchTerm"
          placeholder="Search by company name..."
        />
        <FilterSelect
          param="isApproved"
          placeholder="Approval status"
          options={[
            { value: "false", label: "Pending approval" },
            { value: "true", label: "Approved" },
          ]}
        />
      </div>
      <CompanyApprovalTable companies={result.data} />
      <Pagination
        page={result.meta.page || 1}
        totalPage={result.meta.totalPages}
      />
    </div>
  );
}
