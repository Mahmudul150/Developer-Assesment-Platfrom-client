"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addAssessmentProblems, createAssessment } from "@/api/assessment.api";
import { fieldError } from "@/components/shared/form-error";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { reviewSchema } from "@/schemas/assessment.schema";
import { useWizardStore } from "@/store/wizard.store";
import { ApiError } from "@/types/api";

export function StepReview() {
  const router = useRouter();
  const basicInfo = useWizardStore((state) => state.basicInfo);
  const problemIds = useWizardStore((state) => state.problemIds);
  const prev = useWizardStore((state) => state.prev);
  const reset = useWizardStore((state) => state.reset);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!basicInfo) throw new Error("Missing assessment details");
      const created = await createAssessment(basicInfo);
      try {
        await addAssessmentProblems(created.data.id, problemIds);
      } catch {
        toast.warning(
          "Assessment created, but problems could not be added. Add them on the detail page.",
        );
        return created.data.id;
      }
      return created.data.id;
    },
    onSuccess: (id) => {
      toast.success("Assessment created");
      reset();
      router.push(`/company/assessments/${id}`);
    },
    onError: (error) =>
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Could not create assessment",
      ),
  });

  const form = useForm({
    defaultValues: { confirmed: false },
    validators: { onChange: reviewSchema },
    onSubmit: async () => {
      await mutation.mutateAsync();
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <div className="rounded-lg border p-4 text-sm">
        <p className="font-semibold">{basicInfo?.title}</p>
        <p className="mt-1 text-muted-foreground">{basicInfo?.description}</p>
        <p className="mt-2">
          Duration: {basicInfo?.durationMinutes} min Â· Passing score:{" "}
          {basicInfo?.passingScore}% Â· Problems: {problemIds.length}
        </p>
      </div>
      <form.Field name="confirmed">
        {(field) => (
          <FormField
            label="Confirm"
            error={fieldError(field.state.meta.errors)}
          >
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(checked)}
              />
              Confirm and create this assessment
            </label>
          </FormField>
        )}
      </form.Field>
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={prev}>
          Back
        </Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating..." : "Create assessment"}
        </Button>
      </div>
    </form>
  );
}
