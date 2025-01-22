import { createTheme } from '@mui/material'
import { ptBR } from '@mui/material/locale'

export const LightTheme = createTheme(
  {
    palette: {
      mode: 'light',
      primary: {
        main: '#990100',
        contrastText: '#f6f6f6',
      },
      secondary: {
        main: '#b90504',
        contrastText: '#f6f6f6',
      },
      text: {
        primary: '#333333',
        secondary: '#e8e8e8',
      },
      background: {
        default: '#f6f6f6',
        paper: '#e8e8e8',
      },
      error: {
        main: '#990100',
      },
    },
    typography: {
      allVariants: {
        color: '#333333',
      },
    },
  },
  ptBR,
)
