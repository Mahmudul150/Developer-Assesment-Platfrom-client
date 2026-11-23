import type { Metadata } from "next";
import { ProblemsTable } from "@/components/company/problems-table";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterSelect } from "@/components/shared/filter-select";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { safeServerList, serverApi } from "@/lib/server-api";
import type { Problem } from "@/types/problem";
import type { CompanyProfile } from "@/types/user";
import { NewProblemButton } from "./new-problem-button";

export const metadata: Metadata = { title: "Problem bank" };
export const dynamic = "force-dynamic";

export default async function ProblemsPage({
  searchParams,
}: {
  searchParams: Promise<{
    searchTerm?: string;
    type?: string;
    difficulty?: string;
    page?: string;
  }>;
}) {
  const {
    searchTerm = "",
    type = "",
    difficulty = "",
    page = "1",
  } = await searchParams;

  const query = new URLSearchParams({ page, limit: "10" });
  if (searchTerm) query.set("searchTerm", searchTerm);
  if (type) query.set("type", type);
  if (difficulty) query.set("difficulty", difficulty);

  const result = await safeServerList<Problem>(
    `/api/v1/problem/my-problems?${query.toString()}`,
  );

  let approved = true;
  try {
    const company = await serverApi<CompanyProfile>("/api/v1/company/me");
    approved = company.isApproved;
  } catch {
    approved = true;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Problem bank"
        description="Create and manage questions for your assessments."
        action={<NewProblemButton approved={approved} />}
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput param="searchTerm" placeholder="Search problems..." />
        <FilterSelect
          param="type"
          placeholder="All types"
          options={[
            { value: "MCQ", label: "MCQ" },
            { value: "WRITTEN", label: "Written" },
            { value: "CODING", label: "Coding" },
          ]}
        />
        <FilterSelect
          param="difficulty"
          placeholder="All difficulties"
          options={[
            { value: "EASY", label: "Easy" },
            { value: "MEDIUM", label: "Medium" },
            { value: "HARD", label: "Hard" },
          ]}
        />
      </div>
      {result.data.length === 0 ? (
        <EmptyState
          title="No problems found"
          description="Try different filters or create a new problem."
        />
      ) : (
        <ProblemsTable problems={result.data} approved={approved} />
      )}
    </div>
  );
}
