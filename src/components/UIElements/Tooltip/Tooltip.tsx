import React from 'react'

import { Popover as AntPopover } from 'antd'
import { PopoverProps as Props } from 'antd/lib/popover'

import { getAppContainer } from 'helpers/element'

import { TooltipContent, InfoIcon } from './Tooltip.style'

export interface TooltipProps extends Partial<Props> {
  tooltip: React.ReactNode
  children: React.ReactElement
}

export const Tooltip = ({
  placement = 'bottom',
  tooltip,
  children,
}: TooltipProps) => {
  return (
    <AntPopover
      content={<TooltipContent>{tooltip}</TooltipContent>}
      getPopupContainer={getAppContainer}
      placement={placement}
      overlayStyle={{
        animationDuration: '0s !important',
        animation: 'none !important',
        background: 'transparent',
      }}
      mouseEnterDelay={0.01}
    >
      {children}
    </AntPopover>
  )
}

export interface QuestionProps extends Partial<TooltipProps> {
  tooltip: React.ReactNode
  color?: string
}

export const Question = ({
  placement = 'bottom',
  tooltip,
  color = 'primary',
}: QuestionProps) => {
  return (
    <Tooltip tooltip={tooltip} placement={placement}>
      <InfoIcon color={color} />
    </Tooltip>
  )
}
