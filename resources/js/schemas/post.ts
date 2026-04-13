import z from "zod";

export const postSchema = z
    .object({
        post_content: z
            .string()
            .min(1, "Post content is required.")
            .max(500, "Post content cannot exceed 500 characters."),
        image: z
            .instanceof(File)
            .refine(
                (file) => file.type.startsWith("image/"),
                "Please upload a valid image file.",
            )
            .nullable(),

        // ✅ Correct
        visibility: z.enum(["public", "followers", "private"], {
            error: () => ({
                message: "Please select a valid visibility option.",
            }),
        }),
        comments_enabled: z.boolean(),
        published_at: z.string().nullable(),
    })
    .refine(
        (data) => {
            if (data.published_at) {
                const publishedDate = new Date(data.published_at);
                return publishedDate > new Date();
            }
            return true;
        },
        {
            message: "Published date must be in the future.",
            path: ["published_at"],
        },
    );
