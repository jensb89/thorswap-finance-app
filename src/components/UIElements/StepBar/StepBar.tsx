import React from 'react'

import { StepBarWrapper } from './StepBar.style'

export type Props = {
  size?: number
}

const StepBar = (props: Props) => {
  const { size = 150 } = props

  return (
    <StepBarWrapper size={size} {...props}>
      <div className="step-start-dot" />
      <div className="step-bar-line" />
      <div className="step-end-dot" />
    </StepBarWrapper>
  )
}

export default StepBar
