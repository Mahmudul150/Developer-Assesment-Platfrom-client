import type { Metadata } from "next";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/format";
import { safeServerList } from "@/lib/server-api";
import type { Payment } from "@/types/payment";

export const metadata: Metadata = { title: "Payments" };
export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const result = await safeServerList<Payment>(
    "/api/v1/payments/allPayments?limit=50",
  );
  return (
    <div className="space-y-6">
      <PageHeader title="Payments" description="All platform payments." />
      {result.data.length === 0 ? (
        <EmptyState title="No payments" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.data.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-mono text-xs">
                  {payment.id}
                </TableCell>
                <TableCell>{formatCurrency(payment.amount)}</TableCell>
                <TableCell>
                  <StatusBadge status={payment.status} />
                </TableCell>
                <TableCell>{formatDate(payment.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
