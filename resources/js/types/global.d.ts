import { Suggestion } from "./common"

export {}

export interface User {
    id: number
    username: string
    profileImagePath: string | null
    is_verified: boolean
}

export interface SharedProps {
    auth: {
        user: User | null
    }
    errors: Record<string, string[]>

    // 🔥 Required for Inertia compatibility
    [key: string]: unknown
}

declare module '@inertiajs/react' {
    interface PageProps extends SharedProps {}
}