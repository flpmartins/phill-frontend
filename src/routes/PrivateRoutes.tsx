import React, { useEffect } from 'react'

import { Routes, Route, Navigate } from 'react-router-dom'
import { useDrawer } from '../shared/hooks/drawer'
import { Dashboard, Profile, ListProducts } from '../pages'

import { MenuSideBar } from '../shared/components'
import { useAuth } from '../shared/hooks/auth'
import { RegisterProduct } from '../pages/register-product/RegisterProduct'

interface IDrawerOption {
  label: string
  icon: any
  path: string
}
export const PrivateRoutes: React.FC = () => {
  const { setDrawerOptions } = useDrawer()
  const { user } = useAuth()

  useEffect(() => {
    const drawOpt: IDrawerOption[] = [
      {
        label: 'Dashboard',
        icon: 'dashboard',
        path: '/home',
      },
      {
        label: 'Produtos',
        icon: 'assignment',
        path: '/list-products',
      },
      {
        label: 'Cadastrar',
        icon: 'topic',
        path: '/register-product',
      },
    ]

    setDrawerOptions(drawOpt)
  }, [setDrawerOptions, user.id_profile])

  return (
    <MenuSideBar>
      <Routes>
        <Route path="/register-product" element={<RegisterProduct />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/list-products" element={<ListProducts />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </MenuSideBar>
  )
}
