import z from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),

    password: z.string().min(1, "Password is required"),

    remember: z.boolean().optional(),
});

export const registerBaseSchema = z.object({
    username: z
        .string()
        .min(1, "Please enter a username.")
        .min(3, "Username must be at least 3 characters.")
        .max(30, "Username must be at most 30 characters.")
        .regex(
            /^[a-zA-Z0-9_]+$/,
            "Username can only contain letters, numbers, and underscores.",
        ),

    email: z
        .string()
        .min(1, "Please enter your email address.")
        .email("Please enter a valid email address."),

    password: z
        .string()
        .min(1, "Please enter a password.")
        .min(8, "Password must be at least 8 characters.")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter."),

    password_confirmation: z
        .string()
        .min(1, "Password confirmation is required"),
});

// ✅ Step 2 — add refinement on top for full form validation
export const registerSchema = registerBaseSchema.refine(
    (data) => data.password === data.password_confirmation,
    {
        message: "Password confirmation does not match.",
        path: ["password_confirmation"],
    },
);
