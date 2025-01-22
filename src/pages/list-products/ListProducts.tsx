import React, { useEffect, useRef, useState } from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  MenuItem,
  IconButton,
  useTheme,
  Menu,
  Button,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import * as Yup from 'yup'

import { BaseLayoutPage } from '../../shared/layouts/BaseLayoutPage'

import { deleteProduct, getProducts } from '../../api/api'
import TableComponent, {
  IColumn,
} from '../../shared/components/table-component/TableComponent'
import { useToast } from '../../shared/hooks/Toast'
import { VTextField } from '../../shared/components'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import SearchIcon from '@mui/icons-material/Search'
import getValidationErrors from '../../shared/utils/getValidationErrors'
import { ModalProduct } from './ModalProduct'
import { useModal } from '../../shared/hooks/Modal'

export const ListProducts: React.FC = () => {
  const theme = useTheme()
  const formRef = useRef<FormHandles>(null)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalProducts, setTotalProducts] = useState(0)
  const [flag, setFlag] = useState(false)
  const refresh = () => {
    setFlag((prevFlag) => !prevFlag)
    setSelectedRow(null)
  }
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedRow, setSelectedRow] = useState<any | null>(null)
  const { addToast } = useToast()

  const { isModalOpen, handleCloseModal, handleOpenModal } = useModal()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const payload = await getProducts(
          (page + 1).toString(),
          rowsPerPage.toString(),
        )
        setProducts(payload.product.products)
        setTotalProducts(payload.product.totalProducts)
      } catch (error: any) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [flag, page, rowsPerPage])

  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>, row: any) => {
    setAnchorEl(event.currentTarget)
    setSelectedRow(row)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDeleteProduct = async (row: any) => {
    try {
      await deleteProduct(row.id)
      refresh()
      addToast({
        type: 'success',
        title: 'produto excluído com sucesso!',
      })
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Erro ao excluir o produto',
      })
      console.error('Error deleting customer', error)
    }
  }

  const handleFilter = async (data: any) => {
    try {
      const schema = Yup.object().shape({
        q: Yup.string().min(1, 'minimo de digitos necessário para filtrar é 1'),
      })
      setLoading(true)
      await schema.validate(data, { abortEarly: false })

      const payload = await getProducts(
        (page + 1).toString(),
        rowsPerPage.toString(),
        data.q,
      )

      setProducts(payload.product.products)
      setTotalProducts(payload.product.totalProducts)
      addToast({
        type: 'success',
        title: 'Filtro aplicado com sucesso!',
      })
    } catch (error: any) {
      if (error instanceof Yup.ValidationError) {
        const errors = getValidationErrors(error)
        formRef.current?.setErrors(errors)
      }
      addToast({
        type: 'error',
        title: 'Erro ao filtrar',
      })
    } finally {
      setLoading(false)
    }
  }

  const columns: IColumn[] = [
    {
      key: 'action',
      label: 'Ações',
      renderCell: (row: any) => (
        <>
          <IconButton
            aria-controls={open ? 'row-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={(event) => handleClick(event, row)}
          >
            <MoreVertIcon sx={{ color: theme.palette.primary.main }} />
          </IconButton>
          <Menu
            id={row.id}
            anchorEl={anchorEl}
            open={open && selectedRow?.id === row.id}
            onClose={handleClose}
            PaperProps={{
              sx: {
                boxShadow: 'rgba(0, 0, 0, 0.1) !important',
                borderRadius: '8px',
              },
            }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <MenuItem onClick={() => handleDeleteProduct(row)}>
              Excluir
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleOpenModal('modalProduct')
              }}
            >
              Editar
            </MenuItem>
          </Menu>
        </>
      ),
      align: 'center',
    },
    {
      key: 'name',
      label: 'Nome',
      renderCell: (row: any) => row.name,
    },
    {
      key: 'description',
      label: 'Descrição',
      renderCell: (row: any) => row.description,
    },
    {
      key: 'price',
      label: 'Preço',
      renderCell: (row: any) => row.price,
    },
    {
      key: 'stock',
      label: 'estoque',
      renderCell: (row: any) => row.stock,
      align: 'center',
    },
    {
      key: 'category',
      label: 'Categoria',
      renderCell: (row: any) => row.category,
    },
  ]

  return (
    <BaseLayoutPage
      title="Lista de Produtos"
      subTitle="Tenha a possibilidade de excluir um cadastro errado!"
    >
      <Form ref={formRef} onSubmit={handleFilter}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <VTextField name="q" label="Pesquisar..." variant="standard" />
          </Grid>
          <Grid item xs={2}>
            <IconButton
              color="primary"
              type="submit"
              sx={{
                marginTop: '10px',
              }}
            >
              <SearchIcon />
            </IconButton>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              gap: '10px',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenModal('modalProduct')}
            >
              Adicionar Produto
            </Button>
          </Grid>

          <Grid item xs={12}>
            <TableComponent
              columns={columns}
              rows={products}
              page={page}
              maxHeight={'65vh'}
              rowsPerPage={rowsPerPage}
              onRefresh={refresh}
              totalRows={totalProducts}
              onPageChange={(newPage: any) => setPage(newPage)}
              onRowsPerPageChange={(newRowsPerPage: any) => {
                setRowsPerPage(newRowsPerPage)
                setPage(0)
              }}
            />
          </Grid>
        </Grid>
      </Form>
      <ModalProduct
        onClose={() => {
          handleCloseModal('modalProduct')
          setSelectedRow(null)
        }}
        open={isModalOpen('modalProduct')}
        setSubmitSucess={refresh}
        product={selectedRow}
      />
    </BaseLayoutPage>
  )
}
