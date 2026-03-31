import React, { createContext, useContext, useMemo } from 'react'
import { usePage, router } from '@inertiajs/react'
import { route } from 'ziggy-js'
import type { SharedProps } from '../types/global' // adjust path

type AuthContextType = {
    user: SharedProps['auth']['user']
    isLoggedIn: boolean
    isVerified: boolean
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const page = usePage<SharedProps>()

    const user = page.props.auth?.user ?? null
    const isLoggedIn = user !== null
    const isVerified = !!user?.is_verified

    function logout() {
        router.post(route('logout'))
    }

    const value = useMemo(
        () => ({
            user,
            isLoggedIn,
            isVerified,
            logout,
        }),
        [user]
    )

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth must be used inside <AuthProvider>')
    }

    return context
}