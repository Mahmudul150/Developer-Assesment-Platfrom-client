"use client";

import { useState } from "react";
import { CandidateRegisterForm } from "@/components/auth/candidate-register-form";
import { CompanyApplyForm } from "@/components/auth/company-apply-form";
import { Tabs } from "@/components/ui/tabs";

export function RegisterTabs() {
  const [tab, setTab] = useState("candidate");
  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      items={[
        {
          value: "candidate",
          label: "Candidate",
          content: <CandidateRegisterForm />,
        },
        { value: "company", label: "Company", content: <CompanyApplyForm /> },
      ]}
    />
  );
}
