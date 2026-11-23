"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { inviteCandidates } from "@/api/invitation.api";
import { fieldError } from "@/components/shared/form-error";
import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { invitationSchema } from "@/schemas/invitation.schema";

export function InviteDialog({
  assessmentId,
  open,
  onOpenChange,
}: {
  assessmentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const mutation = useMutation({
    mutationFn: inviteCandidates,
    onSuccess: () => {
      toast.success("Invitations sent");
      onOpenChange(false);
    },
    onError: () => toast.error("Could not send invitations"),
  });

  const form = useForm({
    defaultValues: { emails: "" },
    validators: {
      onChange: ({ value }) =>
        invitationSchema.safeParse({
          assessmentId,
          emails: value.emails.split(/[\n,;\s]+/).filter(Boolean),
        }).error,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync({
        assessmentId,
        emails: value.emails.split(/[\n,;\s]+/).filter(Boolean),
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Invite candidates">
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
      >
        <form.Field name="emails">
          {(field) => (
            <FormField
              label="Email addresses"
              hint="Separate multiple emails with commas or new lines"
              error={fieldError(field.state.meta.errors)}
            >
              <Textarea
                rows={5}
                placeholder="one@example.com, two@example.com"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
              />
            </FormField>
          )}
        </form.Field>
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          Send invitations
        </Button>
      </form>
    </Dialog>
  );
}
