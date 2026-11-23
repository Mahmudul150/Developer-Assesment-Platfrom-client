import { z } from "zod";

export const problemSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    type: z.enum(["MCQ", "WRITTEN", "CODING"]),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    points: z.number().int().positive("Points must be a positive integer"),
    options: z.array(z.object({ id: z.string(), text: z.string() })),
    correctAnswer: z.string(),
    testCases: z.array(
      z.object({
        input: z.string(),
        expectedOutput: z.string(),
        hidden: z.boolean(),
      }),
    ),
  })
  .superRefine((value, ctx) => {
    if (value.type === "MCQ") {
      if (value.options.filter((option) => option.text.trim()).length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["options"],
          message: "MCQ needs at least two options",
        });
      }
      if (!value.correctAnswer) {
        ctx.addIssue({
          code: "custom",
          path: ["correctAnswer"],
          message: "Choose the correct option",
        });
      }
    }
    if (value.type === "CODING" && value.testCases.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["testCases"],
        message: "Add at least one test case",
      });
    }
  });

export type ProblemFormInput = z.infer<typeof problemSchema>;
