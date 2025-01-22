import React, { useState, useRef, useCallback, useEffect } from 'react'

import {
  Box,
  Button,
  Card,
  CardActions,
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
import { Link, useNavigate, useParams } from 'react-router-dom'
import logo from '../../assets/logo.png'

import * as Yup from 'yup'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'

import { VTextField } from '../../shared/components'
import getValidationErrors from '../../shared/utils/getValidationErrors'
import { resetPassword } from '../../api/api'
import { useToast } from '../../shared/hooks/Toast'

interface IData {
  password: string
  password_confirmation: string
}

export const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const navigate = useNavigate()
  const { token = '' } = useParams<'token'>()

  if (!token) {
    navigate('/')
  }

  const theme = useTheme()

  const [loading, setLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)

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
    async (data: IData) => {
      try {
        setLoading(true)
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          password: Yup.string().required('Senha Obrigatória'),
          password_confirmation: Yup.string()
            .required('confirmar sua senha é Obrigatório')
            .oneOf([Yup.ref('password')], 'As senhas precisam ser iguais'),
        })

        await schema.validate(data, {
          abortEarly: false,
        })

        await resetPassword({ token, password: data.password })

        addToast({
          type: 'success',
          title: 'Senha alterada com sucesso',
        })
        navigate('/')
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)
        }

        addToast({
          type: 'error',
          title: 'Erro ao alterar a senha, verifique seus dados',
        })
      } finally {
        setLoading(false)
      }
    },
    [addToast, navigate, token],
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
          backgroundPosition: 'center',
          zIndex: 1,
        }}
      >
        {' '}
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
                  background: `${theme.palette.background.default}`,
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
                          lineHeight: ' 125%',
                        }}
                      >
                        Alterar Senha{' '}
                      </Typography>
                      <Divider />
                      <p
                        style={{
                          color: ' #A5A5A5',
                          fontFamily: 'Roboto',
                          fontSize: '12px',
                          fontStyle: 'normal',
                          fontWeight: '400',
                          lineHeight: '150%',
                        }}
                      >
                        Crie uma nova senha segura com pelo menos 8 caracteres,
                        incluindo letras maiúsculas e minúsculas, números e
                        símbolos.
                      </p>
                      <br />
                    </Box>
                    <Form ref={formRef} onSubmit={handleSubmit}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <VTextField
                            name="password"
                            label="Nova senha"
                            variant="standard"
                            sx={{
                              borderRadius: '25px',
                            }}
                            type={showPassword ? 'text' : 'password'}
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
                          <VTextField
                            name="password_confirmation"
                            label="Confirme sua nova senha"
                            type={showPassword ? 'text' : 'password'}
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
                          <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            sx={{
                              borderRadius: '25px',
                            }}
                          >
                            {loading ? (
                              <CircularProgress
                                color="inherit"
                                style={{ height: '24px', width: '24px' }}
                              />
                            ) : (
                              'Alterar Senha'
                            )}
                          </Button>
                        </Grid>
                        <Grid item xs={12}>
                          <Box
                            width="100%"
                            display="flex"
                            justifyContent="center"
                            marginTop={2}
                          >
                            <Link
                              style={{
                                cursor: 'pointer',
                                textDecoration: 'none',
                              }}
                              to="/"
                            >
                              <Typography
                                variant="body2"
                                color={theme.palette.text.primary}
                                fontWeight="bold"
                              >
                                Voltar para login
                              </Typography>
                            </Link>
                          </Box>
                        </Grid>
                      </Grid>
                    </Form>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
