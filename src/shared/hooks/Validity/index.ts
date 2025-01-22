import { useCallback } from 'react'

export const useCalculateValidity = () => {
  const calculateValidity = useCallback(
    (createdAt: string, type: string): string => {
      const createdDate = new Date(createdAt)
      const validityDate = new Date(createdAt)

      switch (type.toLowerCase()) {
        case 'terceiro':
          validityDate.setDate(createdDate.getDate() + 1)
          break
        case 'agregado':
        case 'frota':
          validityDate.setMonth(createdDate.getMonth() + 6)
          break
      }

      return validityDate.toLocaleDateString('pt-BR')
    },
    [],
  )

  return { calculateValidity }
}
