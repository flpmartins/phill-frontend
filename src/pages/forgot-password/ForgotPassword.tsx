import React, { useRef, useCallback, useState, useEffect } from 'react'

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
  CircularProgress,
  useMediaQuery,
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

import * as Yup from 'yup'
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'

import { VTextField } from '../../shared/components'
import getValidationErrors from '../../shared/utils/getValidationErrors'
import { useToast } from '../../shared/hooks/Toast'
import { forgotPassword } from '../../api/api'
import logo from '../../assets/logo.png'

interface IData {
  email: string
}

export const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const navigate = useNavigate()
  const timeToBack = useRef<NodeJS.Timeout>()

  const theme = useTheme()

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
    async (data: IData) => {
      try {
        formRef.current?.setErrors({})
        setLoading(true)

        const schema = Yup.object().shape({
          email: Yup.string().email().required('Email é obrigatório'),
        })

        await schema.validate(data, { abortEarly: false })

        await forgotPassword(data.email)

        addToast({
          type: 'success',
          title: 'Verifique seu email para resetar sua senha !',
        })

        if (timeToBack.current) {
          clearTimeout(timeToBack.current)
        }

        timeToBack.current = setTimeout(() => {
          navigate('/')
        }, 2000)
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)
        }

        addToast({
          type: 'error',
          title: 'Algo deu errado',
          description:
            'Tente novamente, verifique se o email informado está correto !',
        })
      } finally {
        setLoading(false)
      }
    },
    [addToast, navigate],
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
                        Recuperar Senha{' '}
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
                        A recuperação de senha é simples e rápida. Logo você
                        estará acessando sua conta novamente.
                      </p>
                      <br />
                    </Box>
                    <Form
                      ref={formRef}
                      onSubmit={handleSubmit}
                      style={{ width: '100%' }}
                    >
                      <VTextField
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="standard"
                      />

                      <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        style={{ marginTop: '16px', borderRadius: '25px' }}
                      >
                        {loading ? (
                          <CircularProgress
                            color="inherit"
                            style={{ height: '24px', width: '24px' }}
                          />
                        ) : (
                          'Enviar Token'
                        )}
                      </Button>

                      <CardActions>
                        <Box width="100%">
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
                                Voltar
                              </Typography>
                            </Link>
                          </Box>
                        </Box>
                      </CardActions>
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
