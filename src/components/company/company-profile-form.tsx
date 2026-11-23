"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { updateCompanyProfile } from "@/api/company.api";
import { fieldError } from "@/components/shared/form-error";
import { FormField } from "@/components/shared/form-field";
import { ImageUpload } from "@/components/shared/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { companyProfileUpdateSchema } from "@/schemas/company.schema";
import { ApiError } from "@/types/api";
import type { CompanyProfile } from "@/types/user";

export function CompanyProfileForm({ company }: { company: CompanyProfile }) {
  const form = useForm({
    defaultValues: {
      name: company.name ?? "",
      website: company.website ?? "",
      industry: company.industry ?? "",
      description: company.description ?? "",
      logoUrl: company.logoUrl ?? "",
    },
    validators: { onChange: companyProfileUpdateSchema },
    onSubmit: async ({ value }) => {
      try {
        await updateCompanyProfile({
          name: value.name,
          website: value.website || undefined,
          industry: value.industry || undefined,
          description: value.description,
          logoUrl: value.logoUrl || undefined,
        });
        toast.success("Profile saved");
      } catch (error) {
        toast.error(
          error instanceof ApiError ? error.message : "Could not save profile",
        );
      }
    },
  });

  return (
    <form
      className="max-w-xl space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field name="name">
        {(field) => (
          <FormField
            label="Company name"
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
      <form.Field name="website">
        {(field) => (
          <FormField
            label="Website"
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
            label="Industry"
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
      <form.Field name="logoUrl">
        {(field) => (
          <ImageUpload
            label="Company logo"
            value={field.state.value || null}
            onChange={(url) => field.handleChange(url)}
          />
        )}
      </form.Field>
      <Button type="submit">Save profile</Button>
    </form>
  );
}
