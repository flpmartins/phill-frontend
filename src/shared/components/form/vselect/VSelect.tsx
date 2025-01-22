import { FC, useEffect, useState } from 'react'
import {
  Select as MuiSelect,
  FormControl,
  SelectProps,
  InputLabel,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
} from '@mui/material'
import { useField } from '@unform/core'

interface IOptionProps {
  value: string
  label: string
}

type VSelectProps = SelectProps & {
  name: string
  label?: string
  options: IOptionProps[]
  onChange?: (event: SelectChangeEvent<unknown>) => void
}

export const VSelect: FC<VSelectProps> = ({
  name,
  label,
  options,
  onChange,
  ...rest
}) => {
  const { fieldName, registerField, defaultValue, error } = useField(name)
  const [value, setValue] = useState(defaultValue || '')

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const newValue = event.target.value as string
    setValue(newValue)
    if (onChange) {
      onChange(event)
    }
  }

  useEffect(() => {
    registerField({
      name: fieldName,
      getValue: () => value,
      setValue: (_, newValue) => setValue(newValue),
    })
  }, [fieldName, registerField, value])

  return (
    <FormControl fullWidth error={!!error}>
      <InputLabel id={`select-label-${name}`}>{label}</InputLabel>
      <MuiSelect
        {...rest}
        labelId={`select-label-${name}`}
        id={`simple-select-${name}`}
        value={value}
        label={label}
        name={name}
        onChange={handleChange}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}
