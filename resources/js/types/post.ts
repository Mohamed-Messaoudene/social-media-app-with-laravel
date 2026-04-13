
import React from "react";
import { Public, Lock, People } from "@mui/icons-material";
import { postSchema } from "@/schemas/post";
import z from "zod";
import { SvgIconComponent } from "@mui/icons-material";



export interface PostDate {
    raw: string | null;
    diff: string | null;
}

export interface Post {
    id: number;
    content: string;
    image_url: string | null;

    likes_count: number;
    comments_count: number;
    comments_enabled: boolean;

    published_at: PostDate;

    is_liked_by_auth: boolean;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type Visibility = "public" | "followers" | "private";

export type ShareFormData = z.infer<typeof postSchema>;

// ─── Visibility options config ────────────────────────────────────────────────

export type VisibilityOption = {
    value: Visibility;
    label: string;
    description: string;
    icon: SvgIconComponent;
    color: string;
};

export const VISIBILITY_OPTIONS: VisibilityOption[] = [
    {
        value: "public",
        label: "Everyone",
        description: "Anyone can see this post",
        icon: Public,
        color: "#10b981",
    },
    {
        value: "followers",
        label: "Followers",
        description: "Only your followers can see this",
        icon: People,
        color: "#3b82f6",
    },
    {
        value: "private",
        label: "Only me",
        description: "Only you can see this post",
        icon: Lock,
        color: "#64748b",
    },
];