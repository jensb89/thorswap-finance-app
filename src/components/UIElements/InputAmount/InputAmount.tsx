import React, { useCallback, useState } from 'react'

import { Amount } from 'multichain-sdk'

import { Props as InputProps } from '../Input'
import { StyledInput } from './InputAmount.style'
import { getAmountFromString } from './utils'

export type Props = Omit<InputProps, 'value' | 'onChange'> & {
  value?: Amount
  onChange?: (value: Amount) => void
  decimal?: number
  outlined?: boolean
}

const InputAmount = (props: Props) => {
  const {
    value = Amount.fromAssetAmount(0, 8),
    onChange = () => {},
    decimal = 8,
    outlined = true,
    ...others
  } = props

  const [rawValue, setRawValue] = useState(value.toFixed(decimal))

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = getAmountFromString(e.target.value, value.decimal)

      if (newValue) {
        setRawValue(newValue.toFixed(decimal))
        onChange(newValue)
      } else {
        setRawValue(e.target.value)
      }
    },
    [value, onChange, decimal],
  )

  return (
    <StyledInput
      value={rawValue}
      onChange={handleChange}
      outlined={outlined}
      {...others}
    />
  )
}

export default InputAmount
