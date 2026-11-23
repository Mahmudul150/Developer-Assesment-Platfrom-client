import { z } from "zod";

export const companyApplySchema = z.object({
  name: z.string().min(6, "Name must be at least 6 characters"),
  email: z.email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password cannot exceed 16 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
  website: z.string(),
  industry: z.string(),
  description: z.string().min(10, "Tell us about your company"),
});
export type CompanyApplyInput = z.infer<typeof companyApplySchema>;

export const companyProfileUpdateSchema = z.object({
  name: z.string().min(2, "Company name is required"),
  website: z.string(),
  industry: z.string(),
  description: z.string().min(10, "Tell us about your company"),
  logoUrl: z.string(),
});
export type CompanyProfileUpdateInput = z.infer<
  typeof companyProfileUpdateSchema
>;

export const profileSchema = z.object({
  name: z.string().min(2),
  skills: z.string(),
  experience: z.string(),
});
export type ProfileInput = z.infer<typeof profileSchema>;
