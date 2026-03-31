// theme.d.ts
import '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    social: {
      card: string
      cardHover: string
      border: string
      inputBg: string
    }
  }

  interface PaletteOptions {
    social?: {
      card?: string
      cardHover?: string
      border?: string
      inputBg?: string
    }
  }
}