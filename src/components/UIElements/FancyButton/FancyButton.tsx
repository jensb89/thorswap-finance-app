import React from 'react'

import { StyledButton } from './FancyButton.style'
import { FancyButtonProps } from './types'

export const FancyButton = ({
  disabled = false,
  error = false,
  ...others
}: FancyButtonProps) => {
  return <StyledButton error={error} disabled={disabled} {...others} />
}
