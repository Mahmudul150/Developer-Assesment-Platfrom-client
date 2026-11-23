"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createAttempt } from "@/api/attempt.api";
import { updateInvitation } from "@/api/invitation.api";
import { InvitationCard } from "@/components/candidate/invitation-card";
import { ApiError } from "@/types/api";
import type { Attempt } from "@/types/attempt";
import type { Invitation } from "@/types/invitation";

export function InvitationsList({
  invitations,
  attempts,
}: {
  invitations: Invitation[];
  attempts: Attempt[];
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [busyId, setBusyId] = useState<string | null>(null);

  const updateStatus = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "ACCEPTED" | "DECLINED";
    }) => updateInvitation(id, { status }),
    onSuccess: () => {
      toast.success("Invitation updated");
      void queryClient.invalidateQueries();
      router.refresh();
    },
    onError: (error) =>
      toast.error(
        error instanceof ApiError
          ? error.message
          : "Could not update invitation",
      ),
  });

  const start = useMutation({
    mutationFn: createAttempt,
    onSuccess: (response) => {
      router.push(`/candidate/attempts/${response.data.id}`);
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 409) {
        toast.info("You already have an attempt. Resuming it.");
        router.refresh();
        return;
      }
      toast.error(
        error instanceof ApiError ? error.message : "Could not start attempt",
      );
    },
    onSettled: () => setBusyId(null),
  });

  function attemptFor(invitationId: string) {
    return attempts.find((attempt) => attempt.invitationId === invitationId);
  }

  async function accept(invitation: Invitation) {
    setBusyId(invitation.id);
    updateStatus.mutate({ id: invitation.id, status: "ACCEPTED" });
  }

  async function decline(invitation: Invitation) {
    setBusyId(invitation.id);
    updateStatus.mutate({ id: invitation.id, status: "DECLINED" });
  }

  function startExam(invitation: Invitation) {
    const existing = attemptFor(invitation.id);
    if (existing) {
      router.push(`/candidate/attempts/${existing.id}`);
      return;
    }
    setBusyId(invitation.id);
    start.mutate(invitation.id);
  }

  if (invitations.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
        You have no invitations yet.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {invitations.map((invitation) => (
        <InvitationCard
          key={invitation.id}
          invitation={invitation}
          existingAttemptId={attemptFor(invitation.id)?.id ?? null}
          busy={busyId === invitation.id}
          onAccept={() => void accept(invitation)}
          onDecline={() => void decline(invitation)}
          onStart={() => startExam(invitation)}
        />
      ))}
    </div>
  );
}
