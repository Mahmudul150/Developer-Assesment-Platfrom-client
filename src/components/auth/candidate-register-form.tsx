"use client";

import { useForm } from "@tanstack/react-form";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { registerCandidate } from "@/api/auth.api";
import { fieldError } from "@/components/shared/form-error";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/schemas/auth.schema";
import { ApiError } from "@/types/api";

export function CandidateRegisterForm() {
  const router = useRouter();
  const [skillInput, setSkillInput] = useState("");

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      skills: [] as string[],
      experienceYears: 0,
    },
    validators: { onChange: registerSchema },
    onSubmit: async ({ value }) => {
      try {
        const response = await registerCandidate({
          name: value.name,
          email: value.email,
          password: value.password,
          candidate: {
            phone: value.phone || undefined,
            skills: value.skills,
            experienceYears: value.experienceYears,
          },
        });
        toast.success(response.message || "Check your email for the code");
        router.push(
          `/verify-email?email=${encodeURIComponent(value.email)}&type=candidate`,
        );
      } catch (error) {
        toast.error(
          error instanceof ApiError ? error.message : "Registration failed",
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
      <form.Field name="email">
        {(field) => (
          <FormField label="Email" error={fieldError(field.state.meta.errors)}>
            <Input
              type="email"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
          </FormField>
        )}
      </form.Field>
      <form.Field name="phone">
        {(field) => (
          <FormField
            label="Phone (optional)"
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
                        field.state.value.filter(
                          (_, itemIndex) => itemIndex !== index,
                        ),
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
                  placeholder="e.g. TypeScript"
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
      <form.Field name="confirmPassword">
        {(field) => (
          <FormField
            label="Confirm password"
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
      <Button type="submit" className="w-full">
        Create candidate account
      </Button>
    </form>
  );
}
