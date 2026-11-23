import type { Metadata } from "next";
import { SubmissionsTable } from "@/components/company/submissions-table";
import { FilterSelect } from "@/components/shared/filter-select";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import { serverApi } from "@/lib/server-api";
import type { PaginatedResponse } from "@/types/api";
import type { Assessment } from "@/types/assessment";
import type { Submission } from "@/types/submission";

export const metadata: Metadata = { title: "Submissions" };
export const dynamic = "force-dynamic";

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    assessmentId?: string;
    attemptId?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const status = params.status || "SUBMITTED";
  const page = params.page || "1";

  const query = new URLSearchParams({ status, page, limit: "10" });
  if (params.assessmentId) query.set("assessmentId", params.assessmentId);
  if (params.attemptId) query.set("attemptId", params.attemptId);

  let result: PaginatedResponse<Submission> = {
    data: [],
    meta: { page: 1, limit: 10, total: 0, totalPages: 0, totalPage: 0 },
  };
  let assessments: PaginatedResponse<Assessment> | null = null;
  try {
    result = await serverApi<PaginatedResponse<Submission>>(
      `/api/v1/submission?${query.toString()}`,
    );
  } catch {
    // keep empty state
  }
  try {
    assessments = await serverApi<PaginatedResponse<Assessment>>(
      "/api/v1/assesment/my-assesment?limit=100",
    );
  } catch {
    assessments = null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Submissions"
        description="Review and score candidate answers."
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput param="attemptId" placeholder="Filter by attempt ID..." />
        <FilterSelect
          param="status"
          placeholder="All statuses"
          options={[
            { value: "SUBMITTED", label: "Pending review" },
            { value: "EVALUATED", label: "Evaluated" },
            { value: "DRAFT", label: "Draft" },
          ]}
        />
        <FilterSelect
          param="assessmentId"
          placeholder="All assessments"
          options={(assessments?.data ?? []).map((assessment) => ({
            value: assessment.id,
            label: assessment.title,
          }))}
        />
      </div>
      <SubmissionsTable submissions={result.data} />
      <Pagination
        page={result.meta.page || 1}
        totalPage={result.meta.totalPages}
      />
    </div>
  );
}
