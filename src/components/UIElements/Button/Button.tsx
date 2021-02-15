import React from 'react'

import { ButtonProps as AntBtnProps } from 'antd/lib/button'

import { ButtonWrapper } from './Button.style'
import { ButtonColor, ButtonSize, ButtonWeight, ButtonType } from './types'

type ComponentProps = {
  sizevalue?: ButtonSize
  color?: ButtonColor
  weight?: ButtonWeight
  typevalue?: ButtonType
  focused?: boolean
  round?: boolean
  fixedWidth?: boolean
  className?: string
}

export type ButtonProps = ComponentProps & AntBtnProps

export const Button: React.FC<ButtonProps> = (
  props: ButtonProps,
): JSX.Element => {
  const {
    children,
    sizevalue = 'normal',
    color = 'primary',
    typevalue = 'default',
    weight = '500',
    round = false,
    focused = false,
    fixedWidth = true,
    className = '',
    ...otherProps
  } = props

  return (
    <ButtonWrapper
      type="primary"
      weight={weight}
      color={color}
      sizevalue={sizevalue}
      typevalue={typevalue}
      round={round.toString()}
      fixedWidth={fixedWidth.toString()}
      className={`${className} ${focused ? 'focused' : ''}`}
      {...otherProps}
    >
      {children}
    </ButtonWrapper>
  )
}
