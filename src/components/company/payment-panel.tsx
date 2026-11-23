"use client";

import { useMutation } from "@tanstack/react-query";
import { CreditCard, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { getPaymentById, initiatePayment } from "@/api/payment.api";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { ApiError } from "@/types/api";

export interface PaymentPanelPayment {
  id: string;
  status: string;
  amount: number;
  currency?: string;
  bkashTrxId?: string | null;
}

export function PaymentPanel({
  assessmentId,
  payment,
  approved = true,
  editable = true,
}: {
  assessmentId: string;
  payment?: PaymentPanelPayment | null;
  approved?: boolean;
  editable?: boolean;
}) {
  const mutation = useMutation({
    mutationFn: initiatePayment,
    onSuccess: (response) => {
      const url = response.data.paymentUrl;
      if (url) window.location.assign(url);
      else toast.error("Payment provider did not return a URL");
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        if (error.status === 403) {
          toast.error("Your company must be approved before paying.");
        } else if (error.status === 400) {
          toast.error("Add at least one problem before paying.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Could not initiate payment");
      }
    },
  });

  const check = useMutation({
    mutationFn: getPaymentById,
    onSuccess: (response) => {
      toast.success(`Payment status: ${response.data.status}`);
      window.location.reload();
    },
    onError: (error) =>
      toast.error(
        error instanceof ApiError ? error.message : "Could not check status",
      ),
  });

  return (
    <Card id="payment-panel">
      <CardHeader>
        <CardTitle>Publishing fee</CardTitle>
        <CardDescription>
          Pay once to publish this assessment to candidates.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {payment && (
          <div className="flex items-center justify-between text-sm">
            <span>{formatCurrency(payment.amount)}</span>
            <StatusBadge status={payment.status} />
          </div>
        )}
        {payment?.status === "PENDING" && (
          <Button
            variant="outline"
            className="w-full"
            disabled={check.isPending}
            onClick={() => payment && check.mutate(payment.id)}
          >
            <RefreshCw className="h-4 w-4" /> Check status
          </Button>
        )}
        <Button
          className="w-full"
          disabled={
            mutation.isPending ||
            !approved ||
            !editable ||
            payment?.status === "PAID"
          }
          onClick={() => mutation.mutate(assessmentId)}
        >
          <CreditCard className="h-4 w-4" />
          {mutation.isPending ? "Redirecting..." : "Pay with bKash"}
        </Button>
        {(!approved || !editable) && (
          <p className="text-xs text-muted-foreground">
            Payment is available after approval and while the assessment is a
            draft.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
