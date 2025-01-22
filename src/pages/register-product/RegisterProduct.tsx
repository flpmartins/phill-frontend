import React, { useEffect, useRef, useState } from 'react'
import { Button, Grid, IconButton, useTheme } from '@mui/material'
import * as Yup from 'yup'

import { BaseLayoutPage } from '../../shared/layouts/BaseLayoutPage'

import { createProduct, deleteProduct, getProducts } from '../../api/api'

import { useToast } from '../../shared/hooks/Toast'
import { VTextField } from '../../shared/components'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import SearchIcon from '@mui/icons-material/Search'
import getValidationErrors from '../../shared/utils/getValidationErrors'
import { useNavigate } from 'react-router-dom'
export const RegisterProduct: React.FC = () => {
  const theme = useTheme()
  const formRef = useRef<FormHandles>(null)
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()
  const navigate = useNavigate()
  const handleFilter = async (data: any) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('nome é obrigatório'),
        description: Yup.string().required('descrição é obrigatório'),
        category: Yup.string().required('categoria é obrigatório'),
        price: Yup.string().required('preço é obrigatório'),
        stock: Yup.string().required('Estoque é obrigatório'),
      })
      setLoading(true)

      await schema.validate(data, { abortEarly: false })

      await createProduct(data)
      navigate('/home')

      addToast({
        type: 'success',
        title: 'produto adicionado com sucesso!',
      })
    } catch (error: any) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error)
        formRef.current?.setErrors(errors)
      }
      addToast({
        type: 'error',
        title: 'Erro ao cadastrar!',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <BaseLayoutPage
      title="Registre seu produto!"
      subTitle="Assim que finalizar o cadastro do produto você será direcionado para a página de listagem."
    >
      <Form ref={formRef} onSubmit={handleFilter}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <VTextField name="name" label="Nome" variant="standard" />
          </Grid>
          <Grid item xs={4}>
            <VTextField
              name="description"
              label="descrição"
              variant="standard"
            />
          </Grid>
          <Grid item xs={4}>
            <VTextField name="price" label="preço" variant="standard" />
          </Grid>
          <Grid item xs={4}>
            <VTextField name="category" label="categoria" variant="standard" />
          </Grid>
          <Grid item xs={4}>
            <VTextField
              name="stock"
              label="quantidade"
              variant="standard"
              type="number"
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{
                marginTop: '10px',
              }}
            >
              cadastrar produto
            </Button>
          </Grid>
        </Grid>
      </Form>
    </BaseLayoutPage>
  )
}
