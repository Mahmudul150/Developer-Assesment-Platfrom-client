import type { Metadata } from "next";
import Link from "next/link";
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
import { serverApi } from "@/lib/server-api";
import type { Payment } from "@/types/payment";

export const metadata: Metadata = { title: "Payments" };
export const dynamic = "force-dynamic";

export default async function CompanyPaymentsPage() {
  let payments: Payment[] = [];
  try {
    payments = await serverApi<Payment[]>(
      "/api/v1/payments/my-payment-history",
    );
  } catch {
    payments = [];
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments"
        description="Your assessment payment history."
      />
      {payments.length === 0 ? (
        <EmptyState
          title="No payments"
          description="Pay for an assessment to publish it."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>bKash Trx ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{formatCurrency(payment.amount)}</TableCell>
                <TableCell>
                  <StatusBadge status={payment.status} />
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {payment.bkashTrxId ?? "â€”"}
                </TableCell>
                <TableCell>{formatDate(payment.createdAt)}</TableCell>
                <TableCell>
                  <Link
                    href={`/company/assessments/${payment.assessmentId}`}
                    className="text-sm text-primary hover:underline"
                  >
                    Assessment
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
