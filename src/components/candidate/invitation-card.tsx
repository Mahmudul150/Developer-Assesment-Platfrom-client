"use client";

import { CalendarDays, Clock, Target } from "lucide-react";
import { CountdownTimer } from "@/components/candidate/countdown-timer";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, formatDuration } from "@/lib/format";
import type { Invitation } from "@/types/invitation";

export interface InvitationCardProps {
  invitation: Invitation;
  existingAttemptId: string | null;
  busy: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onStart: () => void;
}

export function InvitationCard({
  invitation,
  existingAttemptId,
  busy,
  onAccept,
  onDecline,
  onStart,
}: InvitationCardProps) {
  const assessment = invitation.assessment;
  const now = Date.now();
  const expired =
    new Date(invitation.expiresAt).getTime() <= now ||
    Boolean(assessment?.endsAt && new Date(assessment.endsAt).getTime() <= now);
  const notStarted = Boolean(
    assessment?.startsAt && new Date(assessment.startsAt).getTime() > now,
  );
  const accepted = invitation.status === "ACCEPTED";

  let startDisabledReason = "";
  if (invitation.status === "DECLINED")
    startDisabledReason = "You declined this invitation.";
  else if (expired) startDisabledReason = "This invitation has expired.";
  else if (notStarted)
    startDisabledReason = "The assessment has not started yet.";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">
            {assessment?.title ?? "Assessment invitation"}
          </CardTitle>
          <StatusBadge status={invitation.status} />
        </div>
        <CardDescription className="line-clamp-2">
          {assessment?.description ?? "A timed developer assessment."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>{invitation.company?.name ?? "Company"}</p>
        <div className="flex flex-wrap gap-4">
          {assessment && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />{" "}
              {formatDuration(assessment.durationMinutes)}
            </span>
          )}
          {assessment && (
            <span className="flex items-center gap-1">
              <Target className="h-4 w-4" /> {assessment.passingScore}% to pass
            </span>
          )}
        </div>
        <p className="flex items-center gap-1">
          <CalendarDays className="h-4 w-4" /> Expires{" "}
          {formatDate(invitation.expiresAt)}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2">
        {!accepted && invitation.status === "PENDING" && !expired && (
          <div className="flex gap-2">
            <Button className="flex-1" disabled={busy} onClick={onAccept}>
              Accept
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              disabled={busy}
              onClick={onDecline}
            >
              Decline
            </Button>
          </div>
        )}
        {accepted && !startDisabledReason && (
          <Button disabled={busy} onClick={onStart}>
            {existingAttemptId ? "Resume exam" : "Start exam"}
          </Button>
        )}
        {startDisabledReason && (
          <div className="space-y-2">
            <p className="text-center text-xs text-muted-foreground">
              {startDisabledReason}
            </p>
            <CountdownTimer
              deadlineAt={invitation.expiresAt}
              onComplete={() => undefined}
            />
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
