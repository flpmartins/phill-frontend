import { useState } from 'react'

export const useModal = () => {
  const [openDialogs, setOpenDialogs] = useState<{ [key: string]: boolean }>({})

  const handleOpenModal = (modalName: string) => {
    setOpenDialogs((prev) => ({ ...prev, [modalName]: true }))
  }
  const handleCloseModal = (modalName: string) => {
    setOpenDialogs((prev) => ({ ...prev, [modalName]: false }))
  }

  const isModalOpen = (modalName: string) => !!openDialogs[modalName]

  return {
    handleCloseModal,
    handleOpenModal,
    isModalOpen,
  }
}
