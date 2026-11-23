import type { Metadata } from "next";
import { AuditLogTable } from "@/components/admin/audit-log-table";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Audit logs" };

export default function AdminAuditLogsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit logs"
        description="A record of important platform actions."
      />
      <AuditLogTable />
    </div>
  );
}
