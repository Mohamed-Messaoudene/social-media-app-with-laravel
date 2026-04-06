import { ThemeOptions } from '@mui/material/styles'
import { indigo, grey, teal, red, amber, blue } from '@mui/material/colors'
import { ThemeMode } from '../types/common'


const generateTheme = (mode: ThemeMode): ThemeOptions => {
  const isLight = mode === 'light'

  return {
    palette: {
      mode,

      // 🔵 BRAND COLORS
      primary: {
        main: isLight ? indigo[600] : indigo[300],
      },

      secondary: {
        main: teal[500],
        dark: teal[700],
      },

      // 🧠 TEXT SYSTEM
      text: {
        primary: isLight ? grey[900] : grey[100],
        secondary: isLight ? grey[600] : grey[400],
      },

      // 🧱 BACKGROUND SYSTEM
      background: {
        default: isLight ? grey[100] : '#0f172a',
        paper: isLight ? '#ffffff' : '#1e293b',
      },

      // 🚦 STATUS COLORS
      success: {
        main: '#22c55e',
      },
      error: {
        main: red[500],
      },
      warning: {
        main: amber[500],
      },
      info: {
        main: blue[500],
      },

      // 🧩 CUSTOM SOCIAL TOKENS
      social: {
        card: isLight ? '#ffffff' : '#1e293b',
        cardHover: isLight ? grey[50] : '#334155',
        border: isLight ? grey[200] : '#334155',
        inputBg: isLight ? '#f9fafb' : '#1e293b',
      },

      divider: isLight ? grey[200] : '#334155',
    },

    // 📱 BREAKPOINTS
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },

    // 🔤 TYPOGRAPHY
    typography: {
      fontFamily: `'Inter', 'Roboto', sans-serif`,

      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },

      body1: { fontSize: '0.95rem' },
      body2: { fontSize: '0.85rem' },
    },

    // 🎛️ COMPONENT CUSTOMIZATION
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '10px',
            textTransform: 'none',
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            border: '1px solid',
          },
        },
      },

    //   MuiTextField: {
    //     styleOverrides: {
    //       root: {
    //         borderRadius: '8px',
    //       },
    //     },
    //   },
    },
  }
}

export default generateTheme