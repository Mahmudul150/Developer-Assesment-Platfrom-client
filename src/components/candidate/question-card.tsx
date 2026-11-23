"use client";

import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import type { Difficulty, ProblemType } from "@/types/enums";
import type { ProblemOptions } from "@/types/problem";

export interface ExamQuestion {
  id: string;
  title: string;
  description: string;
  type: ProblemType;
  difficulty: Difficulty;
  points: number;
  options: ProblemOptions;
}

export function QuestionCard({
  question,
  index,
  value,
  onChange,
}: {
  question: ExamQuestion;
  index: number;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">Question {index + 1}</Badge>
        <Badge variant="secondary">{question.type}</Badge>
        <Badge variant="outline">{question.difficulty}</Badge>
        <Badge variant="outline">{question.points} pts</Badge>
      </div>
      <h2 className="mt-4 text-lg font-semibold">{question.title}</h2>
      <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
        {question.description}
      </p>

      {question.type === "MCQ" ? (
        <div className="mt-5 space-y-2">
          {question.options.map((option, optionIndex) => {
            const optionValue = typeof option === "string" ? option : option.id;
            const label = typeof option === "string" ? option : option.text;
            return (
              <label
                key={`${optionValue}-${optionIndex}`}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm ${
                  value === optionValue ? "border-primary bg-primary/5" : ""
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  checked={value === optionValue}
                  onChange={() => onChange(optionValue)}
                />
                {label}
              </label>
            );
          })}
        </div>
      ) : (
        <Textarea
          rows={question.type === "CODING" ? 10 : 6}
          className={
            question.type === "CODING" ? "mt-5 font-mono text-sm" : "mt-5"
          }
          placeholder={
            question.type === "CODING"
              ? "Write your solution here..."
              : "Write your answer here..."
          }
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </div>
  );
}
