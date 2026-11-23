import type { Metadata } from "next";
import Link from "next/link";
import { FilterSelect } from "@/components/shared/filter-select";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import { safeServerList } from "@/lib/server-api";
import { cn } from "@/lib/utils";
import type { Assessment } from "@/types/assessment";

export const metadata: Metadata = { title: "Assessments" };
export const dynamic = "force-dynamic";

export default async function CompanyAssessmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status = "", page = "1" } = await searchParams;
  const query = new URLSearchParams({ page, limit: "10" });
  if (status) query.set("status", status);

  const result = await safeServerList<Assessment>(
    `/api/v1/assesment/my-assesment?${query.toString()}`,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assessments"
        description="Build, publish and manage your assessments."
        action={
          <Link
            href="/company/assessments/new"
            className={cn(buttonVariants())}
          >
            New assessment
          </Link>
        }
      />
      <FilterSelect
        param="status"
        placeholder="All statuses"
        options={[
          { value: "DRAFT", label: "Draft" },
          { value: "PUBLISHED", label: "Published" },
          { value: "CLOSED", label: "Closed" },
        ]}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Passing score</TableHead>
            <TableHead>Created</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.data.map((assessment) => (
            <TableRow key={assessment.id}>
              <TableCell className="font-medium">{assessment.title}</TableCell>
              <TableCell>
                <StatusBadge status={assessment.status} />
              </TableCell>
              <TableCell>{assessment.passingScore}%</TableCell>
              <TableCell>{formatDate(assessment.createdAt)}</TableCell>
              <TableCell>
                <Link
                  href={`/company/assessments/${assessment.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  Open
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {result.data.length === 0 && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No assessments found.
        </p>
      )}
    </div>
  );
}
