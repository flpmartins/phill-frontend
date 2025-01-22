import { api } from '../shared/services/api'

import { IResetPassword } from '../shared/dtos'

const forgotPassword = async (email: string) => {
  try {
    const result = await api.post('/forgot-password', { email })

    return result.data
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const login = async (email: string, password: string) => {
  try {
    const result = await api.post('/login', {
      email,
      password,
    })

    return result.data
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const getUserById = async (user_id: string) => {
  try {
    const result = await api.get(`/users/${user_id}`)

    return result.data
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const resetPassword = async ({ token, password }: IResetPassword) => {
  try {
    const result = await api.patch(`/reset-password/${token}`, { password })

    return result.data
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export interface IUserCreate {
  email: string
  name: string
  phone: string
  cpf: string
}
const createUser = async ({ cpf, email, name, phone }: IUserCreate) => {
  try {
    const result = await api.post('/users', {
      cpf,
      email,
      name,
      phone,
    })

    return result
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const updateUser = async (data: any, id: string) => {
  try {
    const result = await api.put(`/users/${id}`, data)

    return result.data
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const uploadAvatar = async (key: string, file: File, id: string) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('key', key)
    formData.append('id', id)

    const result = await api.post(
      `/users/update-avatar?id=${id}&key=${key}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    return result.data
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Erro ao fazer upload do avatar',
    )
  }
}

const createProduct = async (data: any) => {
  try {
    const result = await api.post(`/products`, data)

    return result.data
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const getProductById = async (id: string) => {
  try {
    const result = await api.get(`/products/${id}`)

    return result.data
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const getProducts = async (page: string, limit: string, q?: string) => {
  try {
    let queryString = '/products/list'

    const queryParams: string[] = []
    if (limit) {
      queryParams.push(`limit=${limit}`)
    }
    if (page) {
      queryParams.push(`page=${page}`)
    }
    if (q) {
      queryParams.push(`q=${q}`)
    }

    if (queryParams.length > 0) {
      queryString += `?${queryParams.join('&')}`
    }

    const result = await api.get(queryString)
    return result.data
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const updateProduct = async (data: any, id: string) => {
  try {
    const result = await api.put(`/products/${id}`, data)

    return result.data
  } catch (error: any) {
    throw new Error(error.message)
  }
}

const deleteProduct = async (id: string) => {
  try {
    const result = await api.delete(`/products/${id}`)

    return result.data
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export {
  login,
  forgotPassword,
  resetPassword,
  createUser,
  getUserById,
  uploadAvatar,
  updateUser,
  createProduct,
  updateProduct,
  getProductById,
  getProducts,
  deleteProduct,
}
