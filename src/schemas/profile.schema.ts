import { z } from "zod";

export const candidateProfileSchema = z.object({
  name: z.string().min(2),
  skills: z.string(),
  experience: z.string(),
  phone: z.string().min(11).optional(),
  githubUrl: z.url().optional().or(z.literal("")),
  linkedinUrl: z.url().optional().or(z.literal("")),
});
export type CandidateProfileInput = z.infer<typeof candidateProfileSchema>;

export const candidateProfileUpdateSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .refine(
      (value) => value === "" || value.length >= 11,
      "Phone must be at least 11 characters",
    ),
  bio: z.string(),
  location: z.string(),
  skills: z.array(z.string()).min(1, "Add at least one skill"),
  experienceYears: z.number().min(0, "Cannot be negative"),
  githubUrl: z.union([z.url("Enter a valid URL"), z.literal("")]),
  linkedinUrl: z.union([z.url("Enter a valid URL"), z.literal("")]),
  imageUrl: z.string(),
});
export type CandidateProfileUpdateInput = z.infer<
  typeof candidateProfileUpdateSchema
>;
