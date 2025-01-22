import React, { useRef, useState } from 'react'
import { Button, Grid, useTheme } from '@mui/material'
import * as Yup from 'yup'

import { createProduct, updateProduct } from '../../api/api'

import { useToast } from '../../shared/hooks/Toast'
import { VTextField } from '../../shared/components'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import getValidationErrors from '../../shared/utils/getValidationErrors'
import { ModalComponent } from '../../shared/components/modal-component/modal-component'

interface IModalProduct {
  open: boolean
  product: any | null
  onClose: () => void
  setSubmitSucess: () => void
}

export const ModalProduct: React.FC<IModalProduct> = ({
  product,
  open,
  onClose,
  setSubmitSucess,
}) => {
  const theme = useTheme()
  const formRef = useRef<FormHandles>(null)
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()
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
      if (product) {
        await updateProduct(data, product.id)
        addToast({
          type: 'success',
          title: 'produto alterado com sucesso com sucesso!',
        })
      } else {
        await createProduct(data)
        addToast({
          type: 'success',
          title: 'produto adicionado com sucesso!',
        })
      }
      setSubmitSucess()
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
    <ModalComponent
      isOpen={open}
      handleClose={onClose}
      title={product ? 'Alterar produto' : 'Cadastrar produto'}
    >
      <Form ref={formRef} onSubmit={handleFilter} initialData={product}>
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
              {product ? 'Alterar produto' : 'Cadastrar produto'}
            </Button>
          </Grid>
        </Grid>
      </Form>
    </ModalComponent>
  )
}
