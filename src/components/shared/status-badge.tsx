import { Badge } from "@/components/ui/badge";

type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning";

const statusMap: Record<string, { label: string; variant: BadgeVariant }> = {
  ADMIN: { label: "Admin", variant: "default" },
  COMPANY: { label: "Company", variant: "secondary" },
  CANDIDATE: { label: "Candidate", variant: "outline" },
  ACTIVE: { label: "Active", variant: "success" },
  BLOCKED: { label: "Blocked", variant: "destructive" },
  INACTIVE: { label: "Inactive", variant: "secondary" },
  DRAFT: { label: "Draft", variant: "secondary" },
  PUBLISHED: { label: "Published", variant: "success" },
  CLOSED: { label: "Closed", variant: "outline" },
  PENDING: { label: "Pending", variant: "warning" },
  PAID: { label: "Paid", variant: "success" },
  FAILED: { label: "Failed", variant: "destructive" },
  CANCELLED: { label: "Cancelled", variant: "outline" },
  ACCEPTED: { label: "Accepted", variant: "success" },
  DECLINED: { label: "Declined", variant: "destructive" },
  EXPIRED: { label: "Expired", variant: "outline" },
  IN_PROGRESS: { label: "In progress", variant: "warning" },
  SUBMITTED: { label: "Submitted", variant: "default" },
  EVALUATED: { label: "Evaluated", variant: "success" },
  MCQ: { label: "MCQ", variant: "outline" },
  WRITTEN: { label: "Written", variant: "outline" },
  CODING: { label: "Coding", variant: "outline" },
  EASY: { label: "Easy", variant: "success" },
  MEDIUM: { label: "Medium", variant: "warning" },
  HARD: { label: "Hard", variant: "destructive" },
};

export function StatusBadge({ status }: { status: string }) {
  const entry = statusMap[status] ?? {
    label: status.replaceAll("_", " "),
    variant: "outline" as BadgeVariant,
  };
  return <Badge variant={entry.variant}>{entry.label}</Badge>;
}
