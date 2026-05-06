import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
});

export const ActivateAccountSchema = z.object({
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[a-zA-Z]/, "Password must contain at least one letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const ResetPasswordSchema = z.object({
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[a-zA-Z]/, "Password must contain at least one letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const ForgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address")
});

export const OtpSchema = z.object({
    otp: z.string().min(6, "Please enter the full 6-digit code.")
});

export type ActivateAccountFormData = z.infer<typeof ActivateAccountSchema>;
export type LoginFormData = z.infer<typeof LoginSchema>;
export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;
export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;
export type OtpFormData = z.infer<typeof OtpSchema>;