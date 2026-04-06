import { AuthUser } from "./common"

export {}


export interface SharedProps {
    auth: {
        user: AuthUser | null
    }
    errors: Record<string, string[]>

    // 🔥 Required for Inertia compatibility
    [key: string]: unknown
}

declare module '@inertiajs/react' {
    interface PageProps extends SharedProps {}
}