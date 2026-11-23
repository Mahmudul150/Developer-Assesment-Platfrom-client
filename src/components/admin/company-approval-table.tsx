"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { approveCompany } from "@/api/admin.api";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { type Column, DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { formatDate } from "@/lib/format";
import { ApiError } from "@/types/api";
import type { Company } from "@/types/user";

export function CompanyApprovalTable({ companies }: { companies: Company[] }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pending, setPending] = useState<Company | null>(null);
  const [detail, setDetail] = useState<Company | null>(null);

  const mutation = useMutation({
    mutationFn: approveCompany,
    onSuccess: () => {
      toast.success("Company approved");
      setPending(null);
      void queryClient.invalidateQueries();
      router.refresh();
    },
    onError: (error) =>
      toast.error(
        error instanceof ApiError ? error.message : "Could not approve company",
      ),
  });

  const columns: Column<Company>[] = [
    {
      key: "name",
      header: "Company",
      cell: (company) => (
        <div>
          <p className="font-medium">{company.name}</p>
          <p className="text-xs text-muted-foreground">
            {company.user?.email ?? company.email}
          </p>
        </div>
      ),
    },
    {
      key: "emailVerified",
      header: "Email verified",
      cell: (company) => (
        <Badge variant={company.user?.emailVerified ? "success" : "warning"}>
          {company.user?.emailVerified ? "Verified" : "Not verified"}
        </Badge>
      ),
    },
    {
      key: "industry",
      header: "Industry",
      cell: (company) => company.industry ?? "â€”",
    },
    {
      key: "applied",
      header: "Applied",
      cell: (company) => formatDate(company.createdAt),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (company) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            disabled={
              company.isApproved ||
              !company.user?.emailVerified ||
              mutation.isPending
            }
            title={
              company.isApproved
                ? "Already approved"
                : !company.user?.emailVerified
                  ? "The company must verify its email first"
                  : "Approve this company"
            }
            onClick={() => setPending(company)}
          >
            {company.isApproved ? "Approved" : "Approve"}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="View details"
            onClick={() => setDetail(company)}
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
        data={companies}
        empty="No companies match these filters."
      />

      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
        title="Approve this company?"
        description={`Approve ${pending?.name ?? "this company"} so it can create assessments?`}
        confirmLabel="Approve"
        pending={mutation.isPending}
        onConfirm={() => pending && mutation.mutate(pending.id)}
      />

      <Dialog
        open={detail !== null}
        onOpenChange={(open) => !open && setDetail(null)}
        title="Company details"
      >
        {detail && (
          <div className="space-y-3 text-sm">
            <p>
              <span className="text-muted-foreground">Name: </span>
              {detail.name}
            </p>
            <p>
              <span className="text-muted-foreground">Email: </span>
              {detail.user?.email ?? detail.email}
            </p>
            <p>
              <span className="text-muted-foreground">Website: </span>
              {detail.website ?? "â€”"}
            </p>
            <p>
              <span className="text-muted-foreground">Industry: </span>
              {detail.industry ?? "â€”"}
            </p>
            <p>
              <span className="text-muted-foreground">Description: </span>
              {detail.description ?? "â€”"}
            </p>
            <p>
              <span className="text-muted-foreground">Email verified: </span>
              {detail.user?.emailVerified ? "Yes" : "No"}
            </p>
            <p>
              <span className="text-muted-foreground">Approved: </span>
              {detail.isApproved ? "Yes" : "No"}
            </p>
          </div>
        )}
      </Dialog>
    </>
  );
}
