import React, { FC, useEffect, useState } from 'react'
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { useField } from '@unform/core'
import { useTheme } from '@mui/material'
import { IOptionProps } from '../../../dtos/IOption'

type VAutoCompleteProps = AutocompleteProps<
  IOptionProps,
  false,
  false,
  false,
  any
> & {
  name: string
  label?: string
  options: IOptionProps[]
  onChange?: (value: string) => void
  defaultValue?: IOptionProps
  state?: string
  colorBoarder?: string
  colorColor?: any
}

export const VAutoComplete: FC<VAutoCompleteProps> = ({
  name,
  label,
  options,
  onChange,
  defaultValue,
  state,
  colorBoarder,
  colorColor,
  ...rest
}) => {
  const { fieldName, registerField, error, clearError } = useField(name)

  const [value, setValue] = useState<IOptionProps>(
    defaultValue || { value: '', label: '' },
  )

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => value,
      setValue: (_, newValue) => setValue(newValue),
    })
  }, [registerField, fieldName, value])

  const theme = useTheme()

  const filledFieldSx = () => ({
    zIndex: 0,
    borderLeft: '3px solid',
    borderColor: state ? theme.palette.primary.main : colorBoarder,
  })
  const filledFieldColor = () => (state ? 'primary' : 'error')

  return (
    <Autocomplete
      {...rest}
      options={options}
      getOptionLabel={(option: IOptionProps) => option.label}
      value={value}
      onChange={(_, newValue: any) => {
        setValue(newValue)
        onChange?.(newValue?.label || '')
        clearError()
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          sx={colorBoarder ? filledFieldSx() : { zIndex: 0 }}
          fullWidth
          color={colorColor ? filledFieldColor() : 'primary'}
          title={label}
          label={label}
          error={!!error}
          helperText={error}
          onKeyDown={(e) => {
            error && clearError()
            rest.onKeyDown?.(e)
          }}
        />
      )}
    />
  )
}
