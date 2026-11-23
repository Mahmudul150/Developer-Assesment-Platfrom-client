"use client";

import { useForm } from "@tanstack/react-form";
import { fieldError } from "@/components/shared/form-error";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { basicInfoSchema } from "@/schemas/assessment.schema";
import { useWizardStore } from "@/store/wizard.store";

export function StepBasicInfo() {
  const setBasicInfo = useWizardStore((state) => state.setBasicInfo);
  const next = useWizardStore((state) => state.next);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      durationMinutes: 60,
      passingScore: 60,
      startsAt: "",
      endsAt: "",
    },
    validators: { onChange: basicInfoSchema },
    onSubmit: async ({ value }) => {
      setBasicInfo({
        title: value.title,
        description: value.description,
        durationMinutes: value.durationMinutes,
        passingScore: value.passingScore,
        startsAt: value.startsAt ? new Date(value.startsAt).toISOString() : "",
        endsAt: value.endsAt ? new Date(value.endsAt).toISOString() : "",
      });
      next();
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
      <form.Field name="title">
        {(field) => (
          <FormField label="Title" error={fieldError(field.state.meta.errors)}>
            <Input
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
          </FormField>
        )}
      </form.Field>
      <form.Field name="description">
        {(field) => (
          <FormField
            label="Description"
            error={fieldError(field.state.meta.errors)}
          >
            <Textarea
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
          </FormField>
        )}
      </form.Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="durationMinutes">
          {(field) => (
            <FormField
              label="Duration (minutes)"
              error={fieldError(field.state.meta.errors)}
            >
              <Input
                type="number"
                value={field.state.value}
                onChange={(event) =>
                  field.handleChange(Number(event.target.value))
                }
                onBlur={field.handleBlur}
              />
            </FormField>
          )}
        </form.Field>
        <form.Field name="passingScore">
          {(field) => (
            <FormField
              label="Passing score (%)"
              error={fieldError(field.state.meta.errors)}
            >
              <Input
                type="number"
                min={0}
                max={100}
                value={field.state.value}
                onChange={(event) =>
                  field.handleChange(Number(event.target.value))
                }
                onBlur={field.handleBlur}
              />
            </FormField>
          )}
        </form.Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="startsAt">
          {(field) => (
            <FormField
              label="Starts at"
              error={fieldError(field.state.meta.errors)}
            >
              <Input
                type="datetime-local"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
              />
            </FormField>
          )}
        </form.Field>
        <form.Field name="endsAt">
          {(field) => (
            <FormField
              label="Ends at"
              error={fieldError(field.state.meta.errors)}
            >
              <Input
                type="datetime-local"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
              />
            </FormField>
          )}
        </form.Field>
      </div>
      <Button type="submit" className="w-full">
        Continue
      </Button>
    </form>
  );
}
