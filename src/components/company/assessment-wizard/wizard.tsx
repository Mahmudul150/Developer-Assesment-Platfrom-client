"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useWizardStore } from "@/store/wizard.store";
import { StepBasicInfo } from "./step-basic-info";
import { StepReview } from "./step-review";
import { StepSelectProblems } from "./step-select-problems";

const steps = ["Basic info", "Select problems", "Review"];

export function AssessmentWizard() {
  const step = useWizardStore((state) => state.step);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an assessment</CardTitle>
        <div className="flex flex-wrap gap-4 pt-2">
          {steps.map((label, index) => (
            <div key={label} className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs",
                  step === index + 1 && "bg-primary text-primary-foreground",
                  step > index + 1 && "bg-emerald-500 text-white",
                )}
              >
                {index + 1}
              </span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {step === 1 && <StepBasicInfo />}
        {step === 2 && <StepSelectProblems />}
        {step === 3 && <StepReview />}
      </CardContent>
    </Card>
  );
}
