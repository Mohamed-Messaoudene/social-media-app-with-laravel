// ✅ Allowed colors (strict typing)
export type SnackBarColor = "success" | "error" | "warning" | "info";

export type ThemeMode = "light" | "dark";

// Define Suggestion here so it's reusable across components
export interface User {
    id: number;
    username: string;
    profileImagePath: string | null;
}