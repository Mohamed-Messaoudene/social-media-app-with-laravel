import React from "react";
import { createContext, useContext, useMemo } from 'react'
import { usePage, router } from '@inertiajs/react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    // Always in sync with Inertia — never stale
    const { auth } = usePage().props

    const user       = auth?.user ?? null
    const isLoggedIn = user !== null
    const isVerified = !!user?.email_verified_at

    // logout lives here because it's global behavior
    // login does NOT live here — belongs in the Login page
    function logout() {
        router.post(route('logout'))
    }

    const value = useMemo(() => ({
        user,
        isLoggedIn,
        isVerified,
        logout,
    }), [user])

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