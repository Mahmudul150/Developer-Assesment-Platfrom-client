import { format, formatDistanceToNow } from "date-fns";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(value: string | Date): string {
  return format(new Date(value), "PP");
}

export function formatDateTime(value: string | Date): string {
  return format(new Date(value), "PPp");
}

export function timeAgo(value: string | Date): string {
  return formatDistanceToNow(new Date(value), { addSuffix: true });
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}m`;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

export function formatPercent(value: number, digits = 0): string {
  return `${value.toFixed(digits)}%`;
}
