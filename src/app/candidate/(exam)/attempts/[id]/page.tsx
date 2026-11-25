import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ExamRunner } from "@/components/candidate/exam-runner";
import type { ExamQuestion } from "@/components/candidate/question-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { AttemptProblemsResponse } from "@/types/requests";

export const metadata: Metadata = { title: "Assessment" };
export const dynamic = "force-dynamic";

export default async function ExamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const token = (await cookies()).get("accessToken")?.value;
  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:5000";
  const normalizedBackendUrl = backendUrl.replace(/\/api\/v1$/, "");

  let payload: AttemptProblemsResponse | null = null;
  let message = "";
  let serverNow = Date.now();
  try {
    const response = await fetch(
      `${normalizedBackendUrl}/api/v1/attempt/get-attempt-problems/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      },
    );
    const dateHeader = response.headers.get("date");
    if (dateHeader) {
      const parsed = Date.parse(dateHeader);
      if (!Number.isNaN(parsed)) serverNow = parsed;
    }
    const body = (await response.json()) as {
      success?: boolean;
      message?: string;
      data?: AttemptProblemsResponse;
    };
    if (!response.ok || !body.success || !body.data) {
      message = body.message ?? "This attempt could not be loaded.";
    } else {
      payload = body.data;
    }
  } catch {
    message = "Could not reach the server. Please try again.";
  }

  if (!payload) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20">
        <Alert variant="warning">
          <AlertTitle>Exam unavailable</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const questions: ExamQuestion[] = payload.invitation.assessment.problems.map(
    (item) => ({
      id: item.problem.id,
      title: item.problem.title,
      description: item.problem.description,
      type: item.problem.type,
      difficulty: item.problem.difficulty,
      points: item.problem.points,
      options: item.problem.options,
    }),
  );

  return (
    <ExamRunner
      attemptId={id}
      deadlineAt={payload.deadlineAt}
      serverNow={serverNow}
      questions={questions}
      savedSubmissions={payload.submissions}
    />
  );
}
