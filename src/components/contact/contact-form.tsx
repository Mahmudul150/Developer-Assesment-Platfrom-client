"use client";

import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { z } from "zod";
import { fieldError } from "@/components/shared/form-error";
import { FormField } from "@/components/shared/form-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.email("Enter a valid email"),
  message: z.string().min(10, "Tell us a little more (at least 10 characters)"),
});

export function ContactForm() {
  const form = useForm({
    defaultValues: { name: "", email: "", message: "" },
    validators: { onChange: contactSchema },
    onSubmit: async ({ value }) => {
      const subject = encodeURIComponent(`Contact from ${value.name}`);
      const body = encodeURIComponent(
        `${value.message}\n\nFrom: ${value.name} <${value.email}>`,
      );
      window.location.href = `mailto:support@devassess.example?subject=${subject}&body=${body}`;
      toast.info("Your email app should open with the message ready to send.");
    },
  });

  return (
    <div className="space-y-6">
      <Alert>
        <AlertDescription>
          Contact messages are not stored by the platform yet. This form open
          your email app with a prepared message.
        </AlertDescription>
      </Alert>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="name">
          {(field) => (
            <FormField label="Name" error={fieldError(field.state.meta.errors)}>
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
              label="Email"
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
        <form.Field name="message">
          {(field) => (
            <FormField
              label="Message"
              error={fieldError(field.state.meta.errors)}
            >
              <Textarea
                rows={5}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
              />
            </FormField>
          )}
        </form.Field>
        <Button type="submit">Open email app</Button>
      </form>
    </div>
  );
}
