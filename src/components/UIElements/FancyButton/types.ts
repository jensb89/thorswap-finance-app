import React from 'react'

export interface FancyButtonProps {
  error?: boolean
  disabled?: boolean
  onClick?: () => void
  children: React.ReactChild
}
