import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Card,
  Grid,
  Button,
  Divider,
  useTheme,
  Typography,
  CardContent,
  useMediaQuery,
} from '@mui/material'
import logo from '../../assets/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import getValidationErrors from '../../shared/utils/getValidationErrors'
import { Form } from '@unform/web'
import { VTextField } from '../../shared/components/form'
import { useToast } from '../../shared/hooks/Toast'
import { createUser, IUserCreate } from '../../api/api'

export const Register: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const theme = useTheme()
  const { addToast } = useToast()
  const navigate = useNavigate()
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

  const handleNext = async () => {
    if (formRef.current) {
      formRef.current.submitForm()
    }
  }

  const handleSubmit = async (data: IUserCreate) => {
    try {
      formRef.current?.setErrors({})

      const schema = Yup.object().shape({
        email: Yup.string().email().required('Email é obrigatório'),
        cpf: Yup.string().required('CPF é obrigatório'),
        phone: Yup.string().required('Telefone é obrigatório'),
        name: Yup.string().required('Razão Social é obrigatório'),
      })

      await schema.validate(data, { abortEarly: false })

      await createUser({
        email: data.email,
        cpf: data.cpf,
        name: data.name,
        phone: data.phone,
      })

      addToast({
        type: 'success',
        title: 'Cadastro concluído com sucesso!',
        description:
          'Confira seu e-mail para mais informações. A Analisa entrará em contato em breve para ativar sua conta.',
      })

      navigate('/')
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err)
        formRef.current?.setErrors(errors)
      }
      addToast({
        type: 'error',
        title: 'erro ao cadastrar!',
        description: 'Confira seus dados para prosseguir.',
      })
    }
  }

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
                  background: theme.palette.background.default,
                }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={1}
                  >
                    <Form
                      ref={formRef}
                      onSubmit={handleSubmit}
                      style={{
                        width: '100%',
                        gap: '15px',
                        flexDirection: 'column',
                        display: 'flex',
                      }}
                    >
                      <Grid container spacing={2}>
                        <Box width="100%">
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
                            Criar conta
                          </Typography>
                          <Divider />
                          <br />
                        </Box>

                        <Grid item xs={12}>
                          <VTextField
                            name="cpf"
                            label="CPF"
                            variant="standard"
                            fullWidth
                            inputProps={{ maxLength: 18 }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <VTextField
                            variant="standard"
                            fullWidth
                            label="Nome"
                            name="name"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <VTextField
                            variant="standard"
                            fullWidth
                            label="Email"
                            name="email"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <VTextField
                            name="phone"
                            type="text"
                            label="Telefone"
                            variant="standard"
                            fullWidth
                            inputProps={{ maxLength: 15 }}
                          />
                        </Grid>
                      </Grid>
                      <Box
                        marginTop={2}
                        display="flex"
                        alignItems="center"
                        flexDirection="column"
                        gap={2}
                        width={'100%'}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          type="submit"
                          sx={{ borderRadius: '25px' }}
                        >
                          Cadastrar
                        </Button>

                        <Box marginTop={2}>
                          <Link
                            to="/"
                            style={{
                              cursor: 'pointer',
                              textDecoration: 'none',
                              width: '100%',
                              textAlign: 'center',
                            }}
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
                      </Box>
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
