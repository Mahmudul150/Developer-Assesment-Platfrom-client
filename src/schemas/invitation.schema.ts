import { z } from "zod";

export const invitationSchema = z.object({
  assessmentId: z.string().min(1),
  emails: z.array(z.email()).min(1, "Add at least one email"),
});
export type InvitationInput = z.infer<typeof invitationSchema>;
