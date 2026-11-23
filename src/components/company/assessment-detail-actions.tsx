"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { closeAssessment, publishAssessment } from "@/api/assessment.api";
import { deleteInvitation, getMyInvitations } from "@/api/invitation.api";
import { InviteDialog } from "@/components/company/invite-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/lib/query-keys";
import { ApiError } from "@/types/api";
import type { AssessmentStatus } from "@/types/enums";

export function AssessmentDetailActions({
  assessmentId,
  status,
  problemCount,
  paymentStatus,
}: {
  assessmentId: string;
  status: AssessmentStatus;
  problemCount: number;
  paymentStatus: string | undefined;
}) {
  const queryClient = useQueryClient();
  const [inviteOpen, setInviteOpen] = useState(false);

  const publish = useMutation({
    mutationFn: publishAssessment,
    onSuccess: () => {
      toast.success("Assessment published");
      void queryClient.invalidateQueries();
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 402) {
        toast.error(
          "Payment is required before publishing. Complete the payment below.",
        );
        document
          .getElementById("payment-panel")
          ?.scrollIntoView({ behavior: "smooth" });
        return;
      }
      toast.error(
        error instanceof ApiError ? error.message : "Could not publish",
      );
    },
  });

  const close = useMutation({
    mutationFn: closeAssessment,
    onSuccess: () => {
      toast.success("Assessment closed");
      void queryClient.invalidateQueries();
    },
    onError: (error) =>
      toast.error(
        error instanceof ApiError ? error.message : "Could not close",
      ),
  });

  const { data: invitations } = useQuery({
    queryKey: queryKeys.invitations(),
    queryFn: async () => (await getMyInvitations()).data,
  });

  const revoke = useMutation({
    mutationFn: deleteInvitation,
    onSuccess: () => {
      toast.success("Invitation revoked");
      void queryClient.invalidateQueries({ queryKey: queryKeys.invitations() });
    },
    onError: (error) =>
      toast.error(
        error instanceof ApiError ? error.message : "Could not revoke",
      ),
  });

  const canPublish =
    status === "DRAFT" && paymentStatus === "PAID" && problemCount > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {status === "DRAFT" && (
          <Button
            disabled={!canPublish || publish.isPending}
            onClick={() => publish.mutate(assessmentId)}
            title={
              canPublish
                ? "Publish this assessment"
                : "Requires payment and at least one problem"
            }
          >
            {publish.isPending ? "Publishing..." : "Publish"}
          </Button>
        )}
        {status === "PUBLISHED" && (
          <>
            <Button
              variant="outline"
              disabled={close.isPending}
              onClick={() => close.mutate(assessmentId)}
            >
              Close assessment
            </Button>
            <Button variant="outline" onClick={() => setInviteOpen(true)}>
              Invite candidates
            </Button>
          </>
        )}
        {status === "PUBLISHED" && !canPublish && (
          <span className="self-center text-xs text-muted-foreground">
            Publishing is available after payment.
          </span>
        )}
      </div>

      {status === "PUBLISHED" && (
        <div className="rounded-lg border p-4">
          <h3 className="text-sm font-semibold">Invitations</h3>
          <div className="mt-3 space-y-2">
            {(invitations ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">
                No invitations yet.
              </p>
            )}
            {(invitations ?? []).map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center gap-3 rounded-md bg-muted/40 px-3 py-2 text-sm"
              >
                <span className="flex-1">{invitation.email}</span>
                <StatusBadge status={invitation.status} />
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={revoke.isPending}
                  aria-label="Revoke invitation"
                  onClick={() => revoke.mutate(invitation.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <InviteDialog
        assessmentId={assessmentId}
        open={inviteOpen}
        onOpenChange={setInviteOpen}
      />
    </div>
  );
}
