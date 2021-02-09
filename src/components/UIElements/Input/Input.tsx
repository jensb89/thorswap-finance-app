import React from 'react'

import { InputProps } from 'antd/lib/input'

import { InputWrapper } from './Input.style'
import { TypeValue, SizeValue, Color } from './types'

export type Props = {
  typevalue?: TypeValue
  sizevalue?: SizeValue
  color?: Color
} & InputProps

const Input = (props: Props) => {
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

export default Input
