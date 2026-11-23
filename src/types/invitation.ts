import type { Assessment } from "./assessment";
import type { InvitationStatus } from "./enums";

export interface Invitation {
  id: string;
  assessmentId: string;
  candidateId: string | null;
  email: string;
  token: string;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
  assessment?: Assessment;
  company?: { name: string };
}
