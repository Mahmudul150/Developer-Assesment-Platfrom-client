import { z } from "zod";

export const basicInfoSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters").max(150),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    durationMinutes: z.number().int().positive("Duration must be positive"),
    passingScore: z
      .number()
      .int()
      .min(0, "Passing score cannot be negative")
      .max(100, "Passing score cannot exceed 100"),
    startsAt: z.string(),
    endsAt: z.string(),
  })
  .refine(
    (value) => {
      if (!value.startsAt) return true;
      const date = new Date(value.startsAt);
      return !Number.isNaN(date.getTime()) && date.getTime() > Date.now();
    },
    { path: ["startsAt"], message: "Start date must be in the future" },
  )
  .refine(
    (value) => {
      if (!value.startsAt || !value.endsAt) return true;
      const start = new Date(value.startsAt);
      const end = new Date(value.endsAt);
      return (
        !Number.isNaN(start.getTime()) &&
        !Number.isNaN(end.getTime()) &&
        end.getTime() > start.getTime()
      );
    },
    { path: ["endsAt"], message: "End date must be after start date" },
  );
export type BasicInfoInput = z.infer<typeof basicInfoSchema>;

export const selectProblemsSchema = z.object({
  problemIds: z.array(z.string()).min(1, "Select at least one problem"),
});
export type SelectProblemsInput = z.infer<typeof selectProblemsSchema>;

export const reviewSchema = z.object({
  confirmed: z.literal(true, { message: "Please confirm before creating" }),
});
export type ReviewInput = z.infer<typeof reviewSchema>;
