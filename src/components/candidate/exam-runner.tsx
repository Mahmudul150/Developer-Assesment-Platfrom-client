"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { reportTabSwitch, submitAttempt } from "@/api/attempt.api";
import {
  createSubmission,
  getMySubmissions,
  updateSubmission,
} from "@/api/submission.api";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { useAutosave } from "@/hooks/use-autosave";
import { useTabVisibility } from "@/hooks/use-tab-visibility";
import { ApiError } from "@/types/api";
import { CountdownTimer } from "./countdown-timer";
import { type ExamQuestion, QuestionCard } from "./question-card";
import { QuestionNavigator } from "./question-navigator";

interface SavedSubmission {
  id: string;
  problemId: string;
  answer: string | string[] | null;
}

export function ExamRunner({
  attemptId,
  deadlineAt,
  serverNow,
  questions,
  savedSubmissions,
}: {
  attemptId: string;
  deadlineAt: string;
  serverNow: number;
  questions: ExamQuestion[];
  savedSubmissions: SavedSubmission[];
}) {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const submission of savedSubmissions) {
      initial[submission.problemId] =
        typeof submission.answer === "string" ? submission.answer : "";
    }
    return initial;
  });
  const [submissionIds, setSubmissionIds] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        savedSubmissions.map((submission) => [
          submission.problemId,
          submission.id,
        ]),
      ),
  );
  const [current, setCurrent] = useState(0);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "failed"
  >("idle");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const submitted = useRef(false);
  const lastSaved = useRef<Record<string, string>>({ ...answers });

  const clockOffset = serverNow - Date.now();
  const effectiveDeadline = new Date(
    new Date(deadlineAt).getTime() + clockOffset,
  ).toISOString();

  const saveMutation = useMutation({
    mutationFn: async ({
      problemId,
      answer,
    }: {
      problemId: string;
      answer: string;
    }) => {
      const submissionId = submissionIds[problemId];
      if (submissionId) {
        return updateSubmission(submissionId, { answer });
      }
      try {
        return await createSubmission({ attemptId, problemId, answer });
      } catch (error) {
        if (error instanceof ApiError && error.status === 409) {
          const existing = (await getMySubmissions(attemptId)).data;
          const found = existing.find((item) => item.problemId === problemId);
          if (found) {
            setSubmissionIds((ids) => ({ ...ids, [problemId]: found.id }));
            return updateSubmission(found.id, { answer });
          }
        }
        throw error;
      }
    },
    onMutate: () => setSaveStatus("saving"),
    onSuccess: (response) => {
      setSaveStatus("saved");
      const data = response.data as { problemId?: string; id?: string };
      if (data.problemId && data.id) {
        setSubmissionIds((ids) => ({
          ...ids,
          [data.problemId as string]: data.id as string,
        }));
      }
    },
    onError: () => setSaveStatus("failed"),
  });

  useAutosave(
    answers,
    async (value) => {
      for (const [problemId, answer] of Object.entries(value)) {
        if (lastSaved.current[problemId] === answer) continue;
        lastSaved.current[problemId] = answer;
        await saveMutation.mutateAsync({ problemId, answer });
      }
    },
    800,
  );

  const submit = useCallback(() => {
    if (submitted.current) return;
    submitted.current = true;
    submitAttempt(attemptId)
      .then(() => {
        toast.success("Exam submitted");
        router.push(`/candidate/results/${attemptId}`);
      })
      .catch((error: unknown) => {
        submitted.current = false;
        toast.error(
          error instanceof ApiError ? error.message : "Could not submit exam",
        );
      });
  }, [attemptId, router]);

  useTabVisibility(() => {
    reportTabSwitch(attemptId).catch(() => undefined);
    toast.warning("Tab switch detected and reported.");
  });

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  const answered = new Set(
    questions
      .map((question, index) => (answers[question.id] ? index : -1))
      .filter((index) => index >= 0),
  );
  const unansweredCount = questions.length - answered.size;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Assessment in progress</h1>
          <p className="text-sm text-muted-foreground">
            Answers save automatically. Do not close this tab.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {saveStatus === "saving"
              ? "Saving..."
              : saveStatus === "saved"
                ? "Saved"
                : saveStatus === "failed"
                  ? "Failed, retrying"
                  : "All changes saved"}
          </span>
          <CountdownTimer deadlineAt={effectiveDeadline} onComplete={submit} />
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            Submit
          </Button>
        </div>
      </div>

      <div className="mb-4 lg:hidden">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setNavOpen(true)}
        >
          Questions ({answered.size}/{questions.length}) — open navigator
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_220px]">
        <div>
          {questions[current] && (
            <QuestionCard
              question={questions[current]}
              index={current}
              value={answers[questions[current].id] ?? ""}
              onChange={(value) =>
                setAnswers((previous) => ({
                  ...previous,
                  [questions[current].id]: value,
                }))
              }
            />
          )}
          <div className="mt-4 flex justify-between">
            <Button
              variant="outline"
              disabled={current === 0}
              onClick={() => setCurrent((value) => value - 1)}
            >
              Previous
            </Button>
            {current < questions.length - 1 ? (
              <Button onClick={() => setCurrent((value) => value + 1)}>
                Next
              </Button>
            ) : (
              <Button onClick={() => setConfirmOpen(true)}>Finish</Button>
            )}
          </div>
        </div>
        <div className="hidden lg:sticky lg:top-6 lg:block lg:self-start">
          <QuestionNavigator
            total={questions.length}
            current={current}
            answered={answered}
            onSelect={setCurrent}
          />
        </div>
      </div>

      <Sheet
        open={navOpen}
        onOpenChange={setNavOpen}
        title="Question navigator"
      >
        <QuestionNavigator
          total={questions.length}
          current={current}
          answered={answered}
          onSelect={(index) => {
            setCurrent(index);
            setNavOpen(false);
          }}
        />
      </Sheet>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Submit this exam?"
        description={
          unansweredCount > 0
            ? `You have ${unansweredCount} unanswered question${unansweredCount === 1 ? "" : "s"}. You cannot change answers after submitting.`
            : "You have answered every question. You cannot change answers after submitting."
        }
        confirmLabel="Submit exam"
        onConfirm={() => {
          setConfirmOpen(false);
          submit();
        }}
      />
    </div>
  );
}
