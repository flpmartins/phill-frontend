import React from 'react'
import { Box, useTheme } from '@mui/material'
import { RotatingLines } from 'react-loader-spinner'

export const LoadingSpinner: React.FC = () => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <RotatingLines
        strokeColor={theme.palette.primary.main}
        strokeWidth="5"
        animationDuration="0.75"
        width="50"
        visible={true}
      />
    </Box>
  )
}
