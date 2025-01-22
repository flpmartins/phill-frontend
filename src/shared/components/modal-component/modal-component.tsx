import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface ModalComponentProps {
  isOpen: boolean
  handleClose: () => void
  title: string
  children: React.ReactNode
}

export const ModalComponent: React.FC<ModalComponentProps> = ({
  isOpen,
  handleClose,
  title,
  children,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{
        backdropFilter: 'blur(4px)',
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: isMobile ? '7.5px 15px' : '1 2',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.text.primary,
          }}
        >
          {title}
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          backgroundColor: theme.palette.background.default,
          p: isMobile ? '7.5px 15px' : '1 2',
          overflow: 'hidden',
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}
