"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { getPaymentById } from "@/api/payment.api";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Payment } from "@/types/payment";

export function PaymentStatus({
  initialPayment,
  variant,
}: {
  initialPayment: Payment | null;
  variant: "success" | "cancel" | "failed";
}) {
  const { data: payment } = useQuery({
    queryKey: ["payment", initialPayment?.id],
    queryFn: async () => (await getPaymentById(initialPayment?.id ?? "")).data,
    initialData: initialPayment ?? undefined,
    enabled: Boolean(initialPayment),
    refetchInterval: (query) =>
      query.state.data?.status === "PENDING" ? 2000 : false,
  });

  const isPaid = payment?.status === "PAID";

  return (
    <Card className="text-center">
      <CardHeader>
        {variant === "success" && isPaid ? (
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
        ) : variant === "success" ? (
          <Clock className="mx-auto h-12 w-12 text-amber-500" />
        ) : (
          <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        )}
        <CardTitle>
          {variant === "success"
            ? isPaid
              ? "Payment complete"
              : "Payment processing"
            : variant === "cancel"
              ? "Payment cancelled"
              : "Payment failed"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {variant === "success"
            ? "Status is read from the backend, never from the URL."
            : variant === "cancel"
              ? "Nothing was charged. You can retry whenever you are ready."
              : "The payment could not be completed. Please try again."}
        </p>
        {payment && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span>{formatCurrency(payment.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <StatusBadge status={payment.status} />
            </div>
            {payment.bkashTrxId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">bKash Trx ID</span>
                <span className="font-mono text-xs">{payment.bkashTrxId}</span>
              </div>
            )}
            {payment.paidAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paid at</span>
                <span>{formatDateTime(payment.paidAt)}</span>
              </div>
            )}
          </div>
        )}
        {payment ? (
          <Link
            href={`/company/assessments/${payment.assessmentId}`}
            className={cn(buttonVariants(), "w-full")}
          >
            {isPaid ? "Publish assessment" : "Back to assessment"}
          </Link>
        ) : (
          <Link
            href="/company/assessments"
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            Back to assessments
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
