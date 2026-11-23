import { z } from "zod";

export function createEvaluateSchema(maxPoints: number) {
  return z.object({
    score: z
      .number()
      .min(0, "Score cannot be negative")
      .max(maxPoints, `Score cannot exceed ${maxPoints} points`),
    feedback: z.string().optional(),
  });
}

export type EvaluateInput = z.infer<ReturnType<typeof createEvaluateSchema>>;
