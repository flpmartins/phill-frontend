import React, { useState, useRef, useCallback, useEffect } from 'react'

import {
  Box,
  Button,
  Card,
  CardContent,
  useTheme,
  Grid,
  Typography,
  Divider,
  InputAdornment,
  IconButton,
  Icon,
  CircularProgress,
  useMediaQuery,
} from '@mui/material'

import { Link } from 'react-router-dom'

import * as Yup from 'yup'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'

import { useAuth } from '../../shared/hooks/auth'
import { useToast } from '../../shared/hooks/Toast'
import logo from '../../assets/logo.png'

import { VTextField } from '../../shared/components'

import getValidationErrors from '../../shared/utils/getValidationErrors'

interface ILoginData {
  email: string
  password: string
}

export const Login: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()

  const { signIn } = useAuth()
  const theme = useTheme()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
  const [animationStyle, setAnimationStyle] = useState({
    transform: 'translateX(100%)',
    transition: 'transform 0.5s ease-in-out',
  })

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimationStyle({
        transform: 'translateX(0)',
        transition: 'transform 0.8s ease-in-out',
      })
    }, 100)

    return () => clearTimeout(timeout)
  }, [])

  const handleSubmit = useCallback(
    async (data: ILoginData) => {
      try {
        formRef.current?.setErrors({})
        setLoading(true)

        const schema = Yup.object().shape({
          email: Yup.string().email().required('Email é obrigatório'),
          password: Yup.string().required('Senha é obrigatória'),
        })

        await schema.validate(data, { abortEarly: false })

        await signIn({ email: data.email, password: data.password })

        addToast({
          type: 'success',
          title: 'Bem Vindo (a)',
        })
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)
        }

        addToast({
          type: 'error',
          title: 'Erro ao logar',
          description: 'Verifique suas credenciais',
        })
      } finally {
        setLoading(false)
      }
    },
    [signIn, addToast],
  )

  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="center"
      position="relative"
      height="100vh"
      overflow="hidden"
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: theme.palette.primary.main,
          zIndex: 1,
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '25%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
          }}
        >
          <img
            src={logo}
            alt="Fastwork"
            width={'400px'}
            height="auto"
            style={{
              borderRadius: '50%',
            }}
          />
        </Box>
      </Box>

      <Box
        width={smDown ? '90%' : '50%'}
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="35px 0 0 35px"
        sx={{
          zIndex: 2,
          background: `${theme.palette.background.default}`,
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
          ...animationStyle,
        }}
      >
        <Grid container margin={2}>
          <Grid
            item
            container
            width="100%"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Card
                style={{
                  boxShadow: 'none',
                  background: 'transparent',
                }}
              >
                <CardContent>
                  <Box
                    height="100%"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={1}
                  >
                    <Box width="100%" marginBottom={2} marginTop={2}>
                      <Typography
                        variant="h5"
                        sx={{
                          color: theme.palette.text.primary,
                          fontFamily: 'Roboto',
                          fontSize: '24px',
                          fontStyle: 'normal',
                          fontWeight: '600',
                          lineHeight: '125%',
                        }}
                      >
                        Entre com sua conta
                      </Typography>
                      <Divider />
                      <br />
                    </Box>
                    <Form ref={formRef} onSubmit={handleSubmit}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <VTextField
                            sx={{ borderRadius: '0px' }}
                            name="email"
                            label="Email"
                            type="email"
                            variant="standard"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Icon>email</Icon>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <VTextField
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            sx={{ borderRadius: '0px' }}
                            variant="standard"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Icon>lock</Icon>
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setShowPassword((prev) => !prev)
                                    }
                                  >
                                    {showPassword ? (
                                      <Icon>visibility</Icon>
                                    ) : (
                                      <Icon>visibility_off</Icon>
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Box
                            width="100%"
                            display="flex"
                            justifyContent="end"
                            marginRight={2}
                            marginBottom={2}
                          >
                            <Link
                              style={{
                                cursor: 'pointer',
                                textDecoration: 'none',
                              }}
                              to="/forgot-password"
                            >
                              <Typography
                                variant="body2"
                                style={{
                                  color: `${theme.palette.text.primary}`,

                                  textAlign: 'right',
                                  fontFamily: 'Roboto',
                                  fontSize: '12px',
                                  fontStyle: 'normal',
                                  fontWeight: '400',
                                }}
                              >
                                Esqueci minha senha
                              </Typography>
                            </Link>
                          </Box>
                        </Grid>

                        <Grid item xs={12}>
                          <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            sx={{
                              borderRadius: '25px',
                            }}
                          >
                            {loading ? (
                              <CircularProgress size={24} />
                            ) : (
                              'Entrar'
                            )}
                          </Button>
                        </Grid>
                      </Grid>
                    </Form>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Box
            width="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginTop={2}
          >
            <Typography
              variant="body2"
              style={{
                color: theme.palette.text.primary,

                textAlign: 'right',
                fontFamily: 'Roboto',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: '400',
                marginRight: '6px',
              }}
            >
              Já é cadastrado?{' '}
            </Typography>
            <Link
              style={{
                color: theme.palette.text.primary,

                textAlign: 'right',
                fontFamily: 'Roboto',
                fontSize: '12px',
                fontStyle: 'normal',
                fontWeight: '400',
                textDecoration: 'none',
              }}
              to="/register"
            >
              <Typography
                variant="body2"
                color={theme.palette.text.primary}
                fontWeight="bold"
              >
                Cadastre-se
              </Typography>
            </Link>
          </Box>
        </Grid>
      </Box>
    </Box>
  )
}
