import React from 'react'

import { LabelWrapper } from './Label.style'
import { Color, Size } from './types'

export type Props = {
  size?: Size
  color?: Color
  weight?: string
  align?: string
  loading?: boolean
  children: React.ReactNode
}

export const Label = (props: Props) => {
  const {
    loading = false,
    size = 'normal',
    color = 'normal',
    weight = 'normal',
    align = 'left',
    children,
    ...others
  } = props

  return (
    <LabelWrapper
      sizeValue={size}
      color={color}
      weight={weight}
      align={align}
      {...others}
    >
      {loading && '...'}
      {!loading && children}
    </LabelWrapper>
  )
}
