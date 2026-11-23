"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";
import type { Attempt } from "@/types/attempt";

export function ResultSummary({ attempt }: { attempt: Attempt }) {
  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Assessment result</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          {attempt.totalScore !== null ? (
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
          ) : (
            <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          )}
          <p className="mt-3 text-4xl font-bold">
            {attempt.totalScore ?? "â€”"}
          </p>
          <p className="text-sm text-muted-foreground">Score</p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <StatusBadge status={attempt.status} />
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Started</span>
            <span>{formatDateTime(attempt.startedAt)}</span>
          </div>
          {attempt.submittedAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Submitted</span>
              <span>{formatDateTime(attempt.submittedAt)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
