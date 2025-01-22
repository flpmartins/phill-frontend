import React, { useRef, useState, useEffect } from 'react'
import { useField } from '@unform/core'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import 'dayjs/locale/pt-br'
import dayjs from 'dayjs'
import { FormControl, FormHelperText } from '@mui/material'

interface IProps {
  name: string
  label: string
  disabled?: boolean
}

export const VDatePicker: React.FC<IProps> = ({ name, label, ...rest }) => {
  dayjs.locale('pt-br')

  const datepickerRef = useRef(null)
  const { fieldName, registerField, defaultValue, error } = useField(name)
  const [value, setValue] = useState(defaultValue || null)

  const handleChange = (newDate: any) => {
    setValue(newDate?.$d || null)
  }

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: datepickerRef.current,
      getValue: () => value,
      setValue: (_, newValue) => setValue(newValue),
      clearValue: (ref: any) => {
        ref.clear()
      },
    })
  }, [fieldName, registerField, value, defaultValue])

  return (
    <FormControl fullWidth variant="standard" error={!!error}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <DatePicker
          ref={datepickerRef}
          label={label}
          onChange={handleChange}
          value={value ? dayjs(value) : null}
          {...rest}
          slotProps={{
            textField: { variant: 'standard', fullWidth: true },
          }}
        />
      </LocalizationProvider>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}
