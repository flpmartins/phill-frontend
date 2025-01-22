import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  Avatar,
  IconButton,
  useMediaQuery,
  useTheme,
  Grid,
  Typography,
} from '@mui/material'
import { BaseLayoutPage } from '../../shared/layouts/BaseLayoutPage'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import PersonIcon from '@mui/icons-material/Person'
import getValidationErrors from '../../shared/utils/getValidationErrors'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import { FormHandles } from '@unform/core'
import { useToast } from '../../shared/hooks/Toast'
import { updateUser, getUserById, uploadAvatar } from '../../api/api'
import { VTextField } from '../../shared/components/form'

export const Profile: React.FC = () => {
  const theme = useTheme()
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = URL.createObjectURL(event.target.files[0])
      setUser({ ...user, avatar: file })
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const storedUser = localStorage.getItem('@template')
        const payload = storedUser ? JSON.parse(storedUser) : null
        if (payload?.user) {
          const userPayload = await getUserById(payload.user.id)
          setUser(userPayload.user)
          if (formRef.current && userPayload) {
            formRef.current.setData(userPayload.user)
          }
        }
      } catch (error: any) {
        setLoading(false)
      } finally {
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      }
    }

    fetchUser()
  }, [])

  const handleSave = useCallback(
    async (data: any) => {
      try {
        const schema = Yup.object().shape({
          email: Yup.string().email().optional(),
          name: Yup.string().optional(),
          phone: Yup.string().optional(),
          cpf: Yup.string().optional(),
        })

        await schema.validate(data, { abortEarly: false })

        const updatedUser = { ...data }

        const fileInput = document.querySelector(
          'input[type="file"]',
        ) as HTMLInputElement
        if (fileInput?.files?.length) {
          const file = fileInput.files[0]

          if (file) {
            const key = `${user.id}/${file.name}`
            const avatarUrl = await uploadAvatar(key, file, user.id)

            updatedUser.avatar = avatarUrl
          }
        }

        await updateUser(
          {
            email: updatedUser.email,
            name: updatedUser.name,
            phone: updatedUser.phone,
            cpf: updatedUser.cpf,
          },
          user.id,
        )

        addToast({
          type: 'success',
          title: 'Dados atualizados com sucesso!',
        })
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)
          formRef.current?.setErrors(errors)
        }

        addToast({
          type: 'error',
          title: 'Erro ao atualizar dados',
          description: 'Verifique suas credenciais',
        })
      }
    },
    [addToast, user],
  )

  return (
    <BaseLayoutPage
      title="Perfil"
      subTitle="Altere seu perfil e gerencie suas compras!."
      loading={loading}
    >
      <Form ref={formRef} onSubmit={handleSave} initialData={user}>
        <Grid
          container
          spacing={2}
          sx={{
            padding: 2,
            maxHeight: '85vh',
            overflowY: 'auto',
            overflowX: 'hidden',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.text.secondary,
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          <Grid item xs={12} md={6}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
              sx={{
                padding: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  '&:hover .hover-overlay': {
                    opacity: 0.5,
                  },
                  '&:hover .hover-icon': {
                    opacity: 1,
                  },
                }}
              >
                <Avatar
                  src={user?.avatar || ''}
                  alt="Avatar do usuário"
                  sx={{
                    width: isMobile ? 100 : 150,
                    height: isMobile ? 100 : 150,
                    backgroundColor: !user?.avatar
                      ? theme.palette.grey[300]
                      : 'transparent',
                  }}
                >
                  {!user?.avatar && (
                    <PersonIcon sx={{ fontSize: isMobile ? 50 : 80 }} />
                  )}
                </Avatar>

                <Box
                  className="hover-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'black',
                    borderRadius: '50%',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  }}
                />

                <IconButton
                  className="hover-icon"
                  color="inherit"
                  aria-label="Alterar avatar"
                  component="label"
                  sx={{
                    position: 'absolute',
                    bottom: isMobile ? '26px' : '55px',
                    right: isMobile ? '26px' : '55px',
                    backgroundColor: 'white',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleAvatarChange}
                  />
                  <PhotoCameraIcon sx={{ color: 'black' }} />
                </IconButton>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <VTextField
                    label="Nome"
                    name="name"
                    variant="standard"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <VTextField
                    label="Email"
                    name="email"
                    variant="standard"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <VTextField
                    label="CPF"
                    name="cpf"
                    variant="standard"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <VTextField
                    label="Telefone"
                    name="phone"
                    variant="standard"
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Button
                variant="contained"
                type="submit"
                color="primary"
                sx={{ width: '100%', borderRadius: '35px' }}
              >
                Salvar Alterações
              </Button>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            gap={2}
            display="flex"
            flexDirection="column"
          >
            <Box
              display="flex"
              flexDirection="column"
              gap={2}
              sx={{
                padding: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Typography variant="h6" gutterBottom>
                ultimas compras realizadas!
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  maxHeight: 400,
                  overflowY: 'auto',
                }}
              >
                <Box
                  sx={{
                    padding: 1,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                  }}
                >
                  <Typography gutterBottom>Camiseta - Segunda-feira</Typography>
                </Box>
                <Box
                  sx={{
                    padding: 1,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                  }}
                >
                  <Typography gutterBottom>Tablet - Quarta-feira</Typography>
                </Box>
                <Box
                  sx={{
                    padding: 1,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                  }}
                >
                  <Typography gutterBottom>notebook - Domingo</Typography>
                </Box>
                <Box
                  sx={{
                    padding: 1,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                  }}
                >
                  <Typography gutterBottom>bolsa - Sexta-feira</Typography>
                </Box>
              </Box>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap={2}
              sx={{
                padding: 2,
                border: '2px dashed',
                borderColor: theme.palette.primary.main,
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Typography
                variant="h6"
                color={theme.palette.primary.main}
                gutterBottom
                textAlign="center"
              >
                Assinar plano PRO
              </Typography>
              <Typography variant="body2" textAlign="center">
                Aproveite todos os benefícios do plano PRO e aproveite descontos
                de até 50%!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ borderRadius: '35px', width: '80%' }}
              >
                Assinar Agora
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Form>
    </BaseLayoutPage>
  )
}
