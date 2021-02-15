import React from 'react'

import { StatusBadgeWrapper } from './StatusBadge.style'

export type Props = {
  color?: 'red' | 'yellow' | 'green'
}

export const StatusBadge = (props: Props) => {
  const { color = 'red', ...others } = props

  return <StatusBadgeWrapper color={color} {...others} />
}
