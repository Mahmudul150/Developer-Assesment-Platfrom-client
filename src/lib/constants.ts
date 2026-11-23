import { Role, type Role as RoleType } from "@/types/enums";

export const APP_NAME = "DevAssess";

export interface NavItem {
  href: string;
  label: string;
}

export const navByRole: Record<RoleType, NavItem[]> = {
  [Role.ADMIN]: [
    { href: "/admin", label: "Overview" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/companies", label: "Companies" },
    { href: "/admin/payments", label: "Payments" },
    { href: "/admin/audit-logs", label: "Audit Logs" },
  ],
  [Role.COMPANY]: [
    { href: "/company", label: "Overview" },
    { href: "/company/problems", label: "Problem Bank" },
    { href: "/company/assessments", label: "Assessments" },
    { href: "/company/submissions", label: "Submissions" },
    { href: "/company/payments", label: "Payments" },
    { href: "/company/profile", label: "Profile" },
  ],
  [Role.CANDIDATE]: [
    { href: "/candidate", label: "Invitations" },
    { href: "/candidate/attempts", label: "My Attempts" },
    { href: "/candidate/profile", label: "Profile" },
  ],
};

export const demoCredentials = [
  {
    label: "Admin",
    role: Role.ADMIN,
    email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ?? "",
    password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ?? "",
  },
  {
    label: "Company",
    role: Role.COMPANY,
    email: process.env.NEXT_PUBLIC_DEMO_COMPANY_EMAIL ?? "",
    password: process.env.NEXT_PUBLIC_DEMO_COMPANY_PASSWORD ?? "",
  },
  {
    label: "Candidate",
    role: Role.CANDIDATE,
    email: process.env.NEXT_PUBLIC_DEMO_CANDIDATE_EMAIL ?? "",
    password: process.env.NEXT_PUBLIC_DEMO_CANDIDATE_PASSWORD ?? "",
  },
];
