"use client";

import { useQuery } from "@tanstack/react-query";
import { type AuditLog, getAuditLogs } from "@/api/admin.api";
import { type Column, DataTable } from "@/components/shared/data-table";
import { TableSkeleton } from "@/components/shared/skeletons";
import { formatDateTime } from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";

export function AuditLogTable() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.auditLogs(),
    queryFn: async () => (await getAuditLogs()).data.data,
  });

  const columns: Column<AuditLog>[] = [
    {
      key: "action",
      header: "Action",
      cell: (log) => <span className="font-medium">{log.action}</span>,
    },
    { key: "entity", header: "Entity", cell: (log) => log.entityType },
    { key: "actor", header: "Actor", cell: (log) => log.userId },
    {
      key: "date",
      header: "When",
      cell: (log) => formatDateTime(log.createdAt),
    },
  ];

  if (isLoading) return <TableSkeleton />;
  return (
    <DataTable
      columns={columns}
      data={data ?? []}
      empty="No audit logs found."
    />
  );
}
