"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { evaluateSubmission } from "@/api/submission.api";
import { fieldError } from "@/components/shared/form-error";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { queryKeys } from "@/lib/query-keys";
import { createEvaluateSchema } from "@/schemas/submission.schema";
import { ApiError } from "@/types/api";

export function EvaluateForm({
  submissionId,
  maxPoints,
  onSuccess,
}: {
  submissionId: string;
  maxPoints: number;
  onSuccess?: () => void;
}) {
  const queryClient = useQueryClient();
  const schema = createEvaluateSchema(maxPoints);

  const mutation = useMutation({
    mutationFn: (payload: { score: number; feedback?: string }) =>
      evaluateSubmission(submissionId, payload),
    onSuccess: () => {
      toast.success("Evaluation saved");
      void queryClient.invalidateQueries({ queryKey: queryKeys.submissions() });
      onSuccess?.();
    },
    onError: (error) =>
      toast.error(
        error instanceof ApiError ? error.message : "Could not save evaluation",
      ),
  });

  const form = useForm({
    defaultValues: { score: 0, feedback: "" },
    validators: {
      onChange: ({ value }) => schema.safeParse(value).error,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync({
        score: value.score,
        feedback: value.feedback || undefined,
      });
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
      <form.Field name="score">
        {(field) => (
          <FormField
            label={`Score (0 - ${maxPoints})`}
            error={fieldError(field.state.meta.errors)}
          >
            <Input
              type="number"
              min={0}
              max={maxPoints}
              value={field.state.value}
              onChange={(event) =>
                field.handleChange(Number(event.target.value))
              }
              onBlur={field.handleBlur}
            />
          </FormField>
        )}
      </form.Field>
      <form.Field name="feedback">
        {(field) => (
          <FormField
            label="Feedback (optional)"
            error={fieldError(field.state.meta.errors)}
          >
            <Textarea
              rows={3}
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
          </FormField>
        )}
      </form.Field>
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving..." : "Save evaluation"}
      </Button>
    </form>
  );
}
