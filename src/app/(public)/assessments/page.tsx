import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterSelect } from "@/components/shared/filter-select";
import { PageHeader } from "@/components/shared/page-header";
import { Pagination } from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, formatDuration } from "@/lib/format";
import { safeServerList } from "@/lib/server-api";
import type { Assessment } from "@/types/assessment";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Assessments matching "${q}"` : "Assessments",
    description: "Browse published assessments.",
  };
}
export const dynamic = "force-dynamic";

export default async function AssessmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; companyId?: string; page?: string }>;
}) {
  const { q = "", companyId = "", page = "1" } = await searchParams;

  const query = new URLSearchParams({ page, limit: "12" });
  if (q) query.set("searchTerm", q);
  if (companyId) query.set("companyId", companyId);

  const [result, all] = await Promise.all([
    safeServerList<Assessment>(
      `/api/v1/assesment/all-published-assesment?${query.toString()}`,
    ),
    safeServerList<Assessment>(
      "/api/v1/assesment/all-published-assesment?limit=100",
    ),
  ]);

  const companies = Array.from(
    new Map(
      all.data
        .filter((item) => item.company)
        .map((item) => [
          item.companyId,
          {
            id: item.companyId,
            name:
              (item.company as { name?: string } | undefined)?.name ??
              "Unknown company",
          },
        ]),
    ).values(),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <PageHeader
        title="Published assessments"
        description="Find an assessment and start practicing."
      />
      <div className="my-6 flex flex-col gap-3 sm:flex-row">
        <SearchInput placeholder="Search assessments..." />
        <FilterSelect
          param="companyId"
          placeholder="All companies"
          options={companies.map((company) => ({
            value: company.id,
            label: company.name,
          }))}
        />
      </div>
      {result.data.length === 0 ? (
        <EmptyState
          title="No assessments found"
          description="Try a different search or company filter."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.data.map((assessment) => (
            <Link key={assessment.id} href={`/assessments`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">
                    {assessment.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {assessment.description ?? "A timed developer assessment."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {formatDuration(assessment.durationMinutes)} Â·{" "}
                  {assessment.passingScore}% to pass
                  {assessment.endsAt &&
                    ` Â· Closes ${formatDate(assessment.endsAt)}`}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
      <div className="mt-8">
        <Pagination
          page={result.meta.page || 1}
          totalPage={result.meta.totalPages}
        />
      </div>
    </div>
  );
}
