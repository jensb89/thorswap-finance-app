import React from 'react'

import { InputProps as AntInputProps } from 'antd/lib/input'

import { InputWrapper } from './Input.style'
import { TypeValue, SizeValue, Color } from './types'

export type InputProps = {
  typevalue?: TypeValue
  sizevalue?: SizeValue
  color?: Color
} & AntInputProps

export const Input = (props: InputProps) => {
  const {
    typevalue = 'normal',
    sizevalue = 'normal',
    color = 'primary',
    ...others
  } = props

  return (
    <InputWrapper
      typevalue={typevalue}
      sizevalue={sizevalue}
      color={color}
      {...others}
    />
  )
}
