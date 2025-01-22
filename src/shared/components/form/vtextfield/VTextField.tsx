import { useEffect, useState, FC } from 'react'
import { TextField, TextFieldProps } from '@mui/material'
import { useField } from '@unform/core'

import {
  formatDataBirth,
  formatDocumento,
  formatTelefone,
  formatPlate,
  formatRG,
  formatCEP,
  formatValorReal,
  formatData,
} from '../../../utils/masks'

type VTextFieldProps = TextFieldProps & {
  name: string
  label?: string
}

export const VTextField: FC<VTextFieldProps> = ({ name, label, ...rest }) => {
  const { fieldName, registerField, defaultValue, error, clearError } =
    useField(name)

  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => value,
      setValue: (_, newValue) => setValue(newValue),
    })

    if (fieldName === 'cnpj') {
      setValue(formatDocumento(value))
    }
    if (fieldName === 'cnpjRntrc') {
      setValue(formatDocumento(value))
    }
    if (fieldName === 'cpf') {
      setValue(formatDocumento(value))
    }
    if (fieldName === 'phone' || fieldName === 'phoneRef') {
      setValue(formatTelefone(value))
    }
    if (
      fieldName === 'license' ||
      fieldName === 'maturity' ||
      fieldName === 'birth'
    ) {
      setValue(formatData(value))
    }

    if (fieldName === 'end_date') {
      setValue(formatDataBirth(value))
    }
    if (fieldName === 'plate') {
      setValue(formatPlate(value))
    }
    if (fieldName === 'cep') {
      setValue(formatCEP(value))
    }
    if (fieldName === 'value' || fieldName === 'price') {
      setValue(formatValorReal(value))
    }
  }, [registerField, fieldName, value])

  return (
    <>
      <TextField
        {...rest}
        fullWidth
        name={name}
        label={label}
        error={!!error}
        helperText={error}
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value)
          rest.onChange?.(e)
        }}
        onKeyDown={(e) => {
          error && clearError()
          rest.onKeyDown?.(e)
        }}
      />
    </>
  )
}
