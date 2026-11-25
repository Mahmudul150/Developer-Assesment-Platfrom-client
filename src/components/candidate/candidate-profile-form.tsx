"use client";

import { useForm } from "@tanstack/react-form";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { updateCandidateProfile } from "@/api/company.api";
import { fieldError } from "@/components/shared/form-error";
import { FormField } from "@/components/shared/form-field";
import { ImageUpload } from "@/components/shared/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { candidateProfileUpdateSchema } from "@/schemas/profile.schema";
import { ApiError } from "@/types/api";
import type { CandidateProfile } from "@/types/user";

export function CandidateProfileForm({
  profile,
}: {
  profile: CandidateProfile;
}) {
  const [skillInput, setSkillInput] = useState("");

  const form = useForm({
    defaultValues: {
      name: profile.name ?? "",
      phone: profile.phone ?? "",
      bio: profile.bio ?? "",
      location: profile.location ?? "",
      skills: profile.skills ?? [],
      experienceYears: profile.experienceYears ?? 0,
      githubUrl: profile.githubUrl ?? "",
      linkedinUrl: profile.linkedinUrl ?? "",
      imageUrl: "",
    },
    validators: { onChange: candidateProfileUpdateSchema },
    onSubmit: async ({ value }) => {
      try {
        await updateCandidateProfile({
          name: value.name,
          phone: value.phone || undefined,
          bio: value.bio || undefined,
          location: value.location || undefined,
          skills: value.skills,
          experienceYears: value.experienceYears,
          githubUrl: value.githubUrl || undefined,
          linkedinUrl: value.linkedinUrl || undefined,
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
            label="Full name"
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
      <form.Field name="phone">
        {(field) => (
          <FormField label="Phone" error={fieldError(field.state.meta.errors)}>
            <Input
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
          </FormField>
        )}
      </form.Field>
      <form.Field name="location">
        {(field) => (
          <FormField
            label="Location"
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
      <form.Field name="bio">
        {(field) => (
          <FormField label="Bio" error={fieldError(field.state.meta.errors)}>
            <Textarea
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
          </FormField>
        )}
      </form.Field>
      <form.Field name="skills">
        {(field) => (
          <FormField
            label="Skills"
            hint="Type a skill and press Enter"
            error={fieldError(field.state.meta.errors)}
          >
            <div className="flex flex-wrap items-center gap-2 rounded-md border p-2">
              {field.state.value.map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs"
                >
                  {skill}
                  <button
                    type="button"
                    aria-label={`Remove ${skill}`}
                    onClick={() =>
                      field.handleChange(
                        field.state.value.filter((_, i) => i !== index),
                      )
                    }
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === ",") {
                      event.preventDefault();
                      const value = skillInput.trim();
                      if (value && !field.state.value.includes(value)) {
                        field.handleChange([...field.state.value, value]);
                      }
                      setSkillInput("");
                    }
                  }}
                  className="flex-1 bg-background text-sm"
                  placeholder="e.g. React"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    const value = skillInput.trim();
                    if (value && !field.state.value.includes(value)) {
                      field.handleChange([...field.state.value, value]);
                    }
                    setSkillInput("");
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </FormField>
        )}
      </form.Field>
      <form.Field name="experienceYears">
        {(field) => (
          <FormField
            label="Years of experience"
            error={fieldError(field.state.meta.errors)}
          >
            <Input
              type="number"
              min={0}
              value={field.state.value}
              onChange={(event) =>
                field.handleChange(Number(event.target.value))
              }
              onBlur={field.handleBlur}
            />
          </FormField>
        )}
      </form.Field>
      <form.Field name="githubUrl">
        {(field) => (
          <FormField
            label="GitHub URL"
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
      <form.Field name="linkedinUrl">
        {(field) => (
          <FormField
            label="LinkedIn URL"
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
      <form.Field name="imageUrl">
        {(field) => (
          <ImageUpload
            value={field.state.value || null}
            onChange={(url) => field.handleChange(url)}
          />
        )}
      </form.Field>
      <Button type="submit">Save profile</Button>
    </form>
  );
}
