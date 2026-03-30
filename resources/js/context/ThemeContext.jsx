import React from "react";
import { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import generateTheme from '../assets/generateTheme'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
    const [mode, setMode] = useState(
        () => localStorage.getItem('currentMode') || 'light'
    )

    const toggleTheme = () => {
        setMode(prev => {
            const next = prev === 'light' ? 'dark' : 'light'
            localStorage.setItem('currentMode', next)
            return next
        })
    }

    // Only recalculates when mode changes
    const theme = useMemo(
        () => createTheme(generateTheme(mode)),
        [mode]
    )

    // Sync body class for any global CSS you might have
    useEffect(() => {
        document.body.dataset.theme = mode
    }, [mode])

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <MUIThemeProvider theme={theme}>
                <CssBaseline /> {/* ← resets browser styles & applies MUI background */}
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    )
}

export function useCustomTheme() {
    const context = useContext(ThemeContext)
    if (!context) throw new Error('useCustomTheme must be used inside ThemeProvider')
    return context
}