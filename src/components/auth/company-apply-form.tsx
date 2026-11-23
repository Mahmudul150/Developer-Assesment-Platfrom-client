"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { applyCompany } from "@/api/company.api";
import { fieldError } from "@/components/shared/form-error";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { companyApplySchema } from "@/schemas/company.schema";
import { ApiError } from "@/types/api";

export function CompanyApplyForm() {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      website: "",
      industry: "",
      description: "",
    },
    validators: { onChange: companyApplySchema },
    onSubmit: async ({ value }) => {
      try {
        const response = await applyCompany({
          name: value.name,
          email: value.email,
          password: value.password,
          company: {
            name: value.name,
            website: value.website || undefined,
            industry: value.industry || undefined,
            description: value.description,
          },
        });
        toast.success(response.message || "Application submitted");
        router.push(
          `/verify-email?email=${encodeURIComponent(value.email)}&type=company`,
        );
      } catch (error) {
        toast.error(
          error instanceof ApiError ? error.message : "Application failed",
        );
      }
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
      <form.Field name="name">
        {(field) => (
          <FormField
            label="Owner name"
            error={fieldError(field.state.meta.errors)}
          >
            <Input
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
          </FormField>
        )}
      </form.Field>
      <form.Field name="email">
        {(field) => (
          <FormField
            label="Work email"
            error={fieldError(field.state.meta.errors)}
          >
            <Input
              type="email"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
          </FormField>
        )}
      </form.Field>
      <form.Field name="password">
        {(field) => (
          <FormField
            label="Password"
            error={fieldError(field.state.meta.errors)}
          >
            <Input
              type="password"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
          </FormField>
        )}
      </form.Field>
      <form.Field name="website">
        {(field) => (
          <FormField
            label="Website (optional)"
            error={fieldError(field.state.meta.errors)}
          >
            <Input
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
          </FormField>
        )}
      </form.Field>
      <form.Field name="industry">
        {(field) => (
          <FormField
            label="Industry (optional)"
            error={fieldError(field.state.meta.errors)}
          >
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
            label="About your company"
            error={fieldError(field.state.meta.errors)}
          >
            <Input
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
          </FormField>
        )}
      </form.Field>
      <Button type="submit" className="w-full">
        Apply as a company
      </Button>
    </form>
  );
}
