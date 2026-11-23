import type { Metadata } from "next";
import { PaymentStatus } from "@/components/payment/payment-status";
import { serverApi } from "@/lib/server-api";
import type { Payment } from "@/types/payment";

export const metadata: Metadata = { title: "Payment cancelled" };
export const dynamic = "force-dynamic";

export default async function PaymentCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ paymentId?: string }>;
}) {
  const { paymentId } = await searchParams;
  let payment: Payment | null = null;
  if (paymentId) {
    try {
      payment = await serverApi<Payment>(`/api/v1/payments/${paymentId}`);
    } catch {
      payment = null;
    }
  }
  return (
    <div className="mx-auto max-w-lg px-4 py-20">
      <PaymentStatus initialPayment={payment} variant="cancel" />
    </div>
  );
}
