import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  InitiatePaymentPayload,
  PaginatedResponse,
  PaymentListParams,
} from "@/types";
import type { Payment } from "@/types/payment";

export interface InitiatePaymentResponse {
  payment: Payment;
  paymentUrl: string;
}

export function initiatePayment(assessmentId: string) {
  const payload: InitiatePaymentPayload = { assessmentId };
  return apiClient<ApiResponse<InitiatePaymentResponse>>("/payments/initiate", {
    method: "POST",
    body: payload,
    
  });
 
}

export function getPaymentById(id: string) {
  return apiClient<ApiResponse<Payment>>(`/payments/${id}`);
}

export function getMyPaymentHistory() {
  return apiClient<ApiResponse<Payment[]>>("/payments/my-payment-history");
}

export function getAllPayments(params?: PaymentListParams) {
  return apiClient<ApiResponse<PaginatedResponse<Payment>>>(
    "/payments/allPayments",
    { params },
  );
}
