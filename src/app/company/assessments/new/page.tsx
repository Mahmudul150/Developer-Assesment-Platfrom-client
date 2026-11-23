import type { Metadata } from "next";
import { AssessmentWizard } from "@/components/company/assessment-wizard/wizard";

export const metadata: Metadata = { title: "New assessment" };

export default function NewAssessmentPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <AssessmentWizard />
    </div>
  );
}
