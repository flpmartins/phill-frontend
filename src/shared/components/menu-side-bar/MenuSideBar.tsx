import React, { useEffect, useState } from 'react'
import {
  Avatar,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  Icon,
  useMediaQuery,
  Box,
  Typography,
} from '@mui/material'
import { useMatch, useNavigate, useResolvedPath } from 'react-router-dom'
import { useDrawer } from '../../hooks/drawer'
import { useAppTheme } from '../../hooks/theme'
import { useAuth } from '../../hooks/auth'
import logo from '../../../assets/logo.png'

interface IMenuSideBarProps {
  children: React.ReactNode
}

interface IListItemProps {
  label: string
  icon: string
  to: string
  onClick: (() => void) | undefined
}

const ListItemLink: React.FC<IListItemProps> = ({
  to,
  icon,
  label,
  onClick,
}) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const resolvedPath = useResolvedPath(to)
  const match = useMatch({
    path: resolvedPath.pathname,
    end: false,
  })

  const handleClick = () => {
    navigate(to)
    onClick?.()
  }

  return (
    <ListItemButton
      selected={!!match}
      onClick={handleClick}
      sx={{
        ...(!!match && {
          marginLeft: '5%',
          marginRight: '5%',
          borderTopLeftRadius: '60px',
          borderTopRightRadius: '60px',
          borderBottomLeftRadius: '60px',
          borderBottomRightRadius: '60px',
          background: `${theme.palette.background.default} !important`,
        }),
      }}
    >
      <ListItemIcon>
        <Icon
          sx={{
            color: match
              ? theme.palette.text.primary
              : theme.palette.text.secondary,
          }}
        >
          {icon}
        </Icon>
      </ListItemIcon>
      <ListItemText
        primary={label}
        primaryTypographyProps={{
          sx: {
            color: match
              ? theme.palette.text.primary
              : theme.palette.text.secondary,
            fontSize: '14px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
          },
        }}
      />
    </ListItemButton>
  )
}

export const MenuSideBar: React.FC<IMenuSideBarProps> = ({ children }) => {
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
  const { isDrawerOpen, toggleDrawerOpen, drawerOptions } = useDrawer()
  const { signOut, user } = useAuth()
  const { toggleTheme } = useAppTheme()

  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!smDown) {
      if (isHovered && !isDrawerOpen) toggleDrawerOpen()
      else if (!isHovered && isDrawerOpen) toggleDrawerOpen()
    }
  }, [isHovered, isDrawerOpen, toggleDrawerOpen, smDown])

  return (
    <>
      <Drawer
        open={isDrawerOpen}
        variant={smDown ? 'temporary' : 'permanent'}
        onClose={smDown ? toggleDrawerOpen : undefined}
        onMouseEnter={!smDown ? () => setIsHovered(true) : undefined}
        onMouseLeave={!smDown ? () => setIsHovered(false) : undefined}
        PaperProps={{
          sx: {
            width: smDown
              ? theme.spacing(28)
              : isHovered
              ? theme.spacing(28)
              : theme.spacing(8),
            transition: 'width 0.3s ease-in-out',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden',
            background: `${theme.palette.primary.main}`,
          },
        }}
      >
        <Box width="100%" height="100%" display="flex" flexDirection="column">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height={70}
            marginTop={5}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                width: smDown ? 90 : isHovered ? 150 : 63,
                height: 'auto',
                borderRadius: '50%',
                transition: 'width 0.3s ease-in-out',
              }}
            />
          </Box>

          <List component="nav" sx={{ marginTop: '70px' }}>
            <Divider
              sx={{
                margin: '0 20px 20px ',
                background: `${theme.palette.text.secondary}`,
              }}
            />
            {drawerOptions.map((option) => (
              <ListItemLink
                key={option.path}
                to={option.path}
                icon={option.icon}
                label={option.label}
                onClick={smDown ? toggleDrawerOpen : undefined}
              />
            ))}
          </List>
        </Box>
      </Drawer>

      <Box
        height="100vh"
        marginLeft={smDown ? '10px' : theme.spacing(10)}
        sx={{
          transition: 'background 0.3s ease',
        }}
      >
        {children}
      </Box>
    </>
  )
}
