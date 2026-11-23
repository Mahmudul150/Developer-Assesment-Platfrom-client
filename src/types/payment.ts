import type { PaymentStatus } from "./enums";

export interface Payment {
  id: string;
  companyId: string;
  assessmentId: string;
  amount: number;
  currency: string;
  method: string;
  status: PaymentStatus;
  merchantInvoiceNumber: string;
  bkashPaymentId: string | null;
  bkashTrxId: string | null;
  failureReason: string | null;
  paidAt: string | null;
  createdAt: string;
}
