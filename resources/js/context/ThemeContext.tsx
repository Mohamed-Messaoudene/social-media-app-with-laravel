import React, { createContext, useContext, useState, useMemo, useEffect } from 'react'
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import generateTheme from '../utils/generateTheme'
import { ThemeMode } from '../types/common'

type ThemeContextType = {
  mode: ThemeMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(
    () => (localStorage.getItem('mode') as ThemeMode) || 'light'
  )

  const toggleTheme = () => {
    setMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('mode', next)
      return next
    })
  }

  const theme = useMemo(() => createTheme(generateTheme(mode)), [mode])

  useEffect(() => {
    document.body.dataset.theme = mode
  }, [mode])

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
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