import z from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
    .object({
        username: z
            .string()
            .min(1, "Username is required")
            .min(3, "Username must be at least 3 characters")
            .max(20, "Username must be at most 20 characters"),
        email: z
            .string()
            .min(1, "Email is required")
            .email("Please enter a valid email address"),
        password: z
            .string()
            .min(1, "Password is required")
            .min(6, "Password must be at least 6 characters"),
        password_confirmation: z
            .string()
            .min(1, "Password confirmation is required")
            .min(6, "Password confirmation must be at least 6 characters"),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match",
    });
