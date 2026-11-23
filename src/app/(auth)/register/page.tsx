import type { Metadata } from "next";
import { RegisterTabs } from "./register-tabs";

export const metadata: Metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Join as a candidate or apply as a company.
        </p>
      </div>
      <RegisterTabs />
    </div>
  );
}
