// ✅ Allowed colors (strict typing)
export type SnackBarColor = "success" | "error" | "warning" | "info";

export type ThemeMode = "light" | "dark";

export interface PaginatedResponse<T> {
    data: T[];

    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };

    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        path: string;
        per_page: number;
        to: number | null;
        total: number;
    };
}

// Define Suggestion here so it's reusable across components
export interface AuthUser {
    id: number;
    username: string;
    email: string;
    profile_image_url: string | null;
    is_verified: boolean;
}