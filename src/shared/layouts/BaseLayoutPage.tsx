import {
  Icon,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
  Badge,
  Button,
  Divider,
} from '@mui/material'
import { LoadingSpinner } from '../components/loading/LoadingComponent'
import { useDrawer } from '../hooks/drawer'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useNavigate } from 'react-router-dom'
import { useAppTheme } from '../hooks/theme'
import { useAuth } from '../hooks/auth'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import Brightness5Icon from '@mui/icons-material/Brightness5'
import Brightness4Icon from '@mui/icons-material/Brightness4'
interface IBaseLayoutPageProps {
  children: React.ReactNode
  title: string
  subTitle?: string
  toolbar?: React.ReactNode
  button?: React.ReactNode
  SecondaryButton?: React.ReactNode
  isAdmin?: boolean
  loading?: boolean
}
export const BaseLayoutPage: React.FC<IBaseLayoutPageProps> = ({
  children,
  title,
  toolbar,
  button,
  subTitle,
  SecondaryButton,
  loading = false,
}) => {
  const theme = useTheme()
  const { toggleTheme } = useAppTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
  const mdDown = useMediaQuery(theme.breakpoints.down('md'))
  const { toggleDrawerOpen } = useDrawer()
  const navigate = useNavigate()
  const [isSettingsBoxOpen, setIsSettingsBoxOpen] = useState(false)
  const { signOut, user } = useAuth()

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [loading])

  const handleToggleSettingsBox = () => {
    setIsSettingsBoxOpen((prev) => !prev)
  }

  const SettingsBox: React.FC = () => {
    if (!isSettingsBoxOpen) return null

    return (
      <Box
        sx={{
          position: 'absolute',
          top: 50,
          right: 7,
          width: 200,
          padding: 2,
          backgroundColor: theme.palette.background.paper,
          color: 'white',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          boxShadow:
            '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.06)',
          zIndex: 999,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -9,
            right: 17,
            width: 0,
            height: 0,
            borderLeft: '9px solid transparent',
            borderRight: '9px solid transparent',
            borderBottom: `9px solid rgba(0, 0, 0, 0.1)`,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: -8,
            right: 18,
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: `8px solid ${theme.palette.background.paper}`,
            zIndex: 1,
          },
        }}
      >
        <Button
          sx={{
            display: 'flex',
            gap: 1,
          }}
        >
          {theme.palette.mode === 'light' ? (
            <Brightness5Icon />
          ) : (
            <Brightness4Icon />
          )}
          <Typography variant="body2" onClick={toggleTheme}>
            Trocar de tema
          </Typography>
        </Button>
        <Button
          onClick={() => navigate('/profile')}
          sx={{
            display: 'flex',
            gap: 1,
          }}
        >
          <AccountCircleIcon />
          <Typography variant="body2">Peril</Typography>
        </Button>
        <Button
          onClick={signOut}
          sx={{
            display: 'flex',
            gap: 1,
          }}
        >
          <LogoutIcon />
          <Typography variant="body2">Sair</Typography>
        </Button>
      </Box>
    )
  }

  return (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
      gap={1}
      width="100%"
    >
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        padding={1}
        height={theme.spacing(smDown ? 6 : mdDown ? 8 : 12)}
      >
        {smDown && (
          <IconButton onClick={toggleDrawerOpen}>
            <Icon>menu</Icon>
          </IconButton>
        )}
        <Box
          width="100%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDirection="row"
        >
          <Box width="100%">
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography
                variant={smDown ? 'h5' : mdDown ? 'h4' : 'h3'}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
                sx={{
                  fontSize: smDown ? '12px' : '18px',
                  fontWeight: '700',
                  lineHeight: '16px',
                  textAlign: 'left',
                }}
              >
                {title}
              </Typography>
              {subTitle && (
                <Typography
                  variant="subtitle1"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  sx={{
                    fontSize: '14px',
                    fontWeight: '500',
                    lineHeight: '16px',
                    textAlign: 'left',
                    display: smDown ? 'none' : 'block',
                  }}
                >
                  {subTitle}
                </Typography>
              )}
            </Box>
            <Box width={'100%'} marginTop={2}>
              <Divider />
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              position: 'relative',
            }}
          >
            {SecondaryButton}
            {button}

            <IconButton
              onClick={handleToggleSettingsBox}
              sx={{
                marginRight: 1.5,
              }}
            >
              <Icon>settings</Icon>
            </IconButton>
            <SettingsBox />
          </Box>
        </Box>
      </Box>

      {toolbar && <Box>{toolbar}</Box>}

      {loading ? (
        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <LoadingSpinner />
        </Box>
      ) : (
        <Box flex={1} margin={'0px 10px'}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {children}
          </motion.div>
        </Box>
      )}
    </Box>
  )
}
