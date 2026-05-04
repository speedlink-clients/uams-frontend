import { z } from "zod";

export const forgotPasswordSchema = z.object({
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
    .object({
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
