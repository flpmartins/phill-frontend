import { createTheme } from '@mui/material'
import { ptBR } from '@mui/material/locale'

export const DarkTheme = createTheme(
  {
    palette: {
      mode: 'dark',
      primary: {
        main: '#b90504',
        contrastText: '#f6f6f6',
      },
      secondary: {
        main: '#990100',
        contrastText: '#f6f6f6',
      },
      text: {
        primary: '#f6f6f6',
        secondary: '#e8e8e8',
      },
      background: {
        default: '#333333',
        paper: '#404040',
      },
      error: {
        main: '#ff6659',
      },
    },
    typography: {
      allVariants: {
        color: '#f6f6f6',
      },
    },
  },
  ptBR,
)
