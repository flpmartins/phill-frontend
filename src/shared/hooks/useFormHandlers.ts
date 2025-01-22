import { ChangeEvent, useMemo } from 'react'
import { SelectChangeEvent } from '@mui/material'

interface FormData {
  [key: string]: any
}

export const useFormHandlers = (
  setFormData?: React.Dispatch<React.SetStateAction<FormData>>,
) => {
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    if (setFormData) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }))
    }
  }

  const handleSelectChange = (event: SelectChangeEvent<unknown>) => {
    const { name, value } = event.target as { name: string; value: string }
    if (setFormData) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }))
    }
  }

  const calculateValidity = (createdAt: string, type: string) => {
    const createdDate = new Date(createdAt)
    let validityDate

    switch (type.toLowerCase()) {
      case 'terceiro':
        validityDate = new Date(createdDate)
        validityDate.setDate(createdDate.getDate() + 1)
        break
      case 'agregado':
      case 'frota':
        validityDate = new Date(createdDate)
        validityDate.setMonth(createdDate.getMonth() + 6)
        break
      default:
        validityDate = createdDate
    }

    return validityDate.toLocaleDateString('pt-BR')
  }

  return { handleInputChange, handleSelectChange, calculateValidity }
}
