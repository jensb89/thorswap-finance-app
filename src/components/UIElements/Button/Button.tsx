import React from 'react'

import { ButtonProps } from 'antd/lib/button'

import { ButtonWrapper } from './Button.style'
import { ButtonColor, ButtonSize, ButtonWeight, ButtonType } from './types'

type ComponentProps = {
  sizevalue?: ButtonSize
  color?: ButtonColor
  weight?: ButtonWeight
  typevalue?: ButtonType
  focused?: boolean
  round?: boolean
  className?: string
}

export type Props = ComponentProps & ButtonProps

const Button: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    children,
    sizevalue = 'normal',
    color = 'primary',
    typevalue = 'default',
    weight = '500',
    round = false,
    focused = false,
    ...otherProps
  } = props

  return (
    <ButtonWrapper
      type="primary"
      weight={weight}
      color={color}
      sizevalue={sizevalue}
      typevalue={typevalue}
      round={round}
      focused={focused}
      {...otherProps}
    >
      {children}
    </ButtonWrapper>
  )
}
export default Button
