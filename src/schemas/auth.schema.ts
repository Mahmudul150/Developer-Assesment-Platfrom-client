import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
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
    confirmPassword: z.string(),
    phone: z
      .string()
      .refine(
        (value) => value === "" || value.length >= 11,
        "Phone must be at least 11 characters",
      ),
    skills: z.array(z.string()).min(1, "At least one skill is required"),
    experienceYears: z.number().min(0, "Cannot be negative"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const otpSchema = z.object({
  otp: z.string().length(6, "Enter the 6-digit code"),
});
export type OtpInput = z.infer<typeof otpSchema>;

export const forgotPasswordSchema = z.object({ email: z.email() });
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    email: z.email().optional(),
    otp: z.string().length(6).optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(16, "Password cannot exceed 16 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const resetPasswordRequestSchema = z
  .object({
    email: z.email(),
    otp: z.string().length(6, "Enter the 6-digit code"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(16, "Password cannot exceed 16 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/[0-9]/, "Password must contain a number")
      .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
export type ResetPasswordRequestInput = z.infer<
  typeof resetPasswordRequestSchema
>;
