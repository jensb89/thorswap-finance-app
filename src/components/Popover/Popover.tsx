import React from 'react'

import { Popover as AntPopover } from 'antd'
import { PopoverProps as Props } from 'antd/lib/popover'

import { getAppContainer } from 'helpers/element'

import { TooltipContent } from './Popover.style'

export interface PopoverProps extends Partial<Props> {
  tooltip: string
  children: React.ReactNode
}

export const Popover = ({
  placement = 'bottom',
  tooltip,
  children,
}: PopoverProps) => {
  return (
    <AntPopover
      content={<TooltipContent>{tooltip}</TooltipContent>}
      getPopupContainer={getAppContainer}
      placement={placement}
      overlayStyle={{
        padding: '6px',
        animationDuration: '0s !important',
        animation: 'none !important',
      }}
    >
      {children}
    </AntPopover>
  )
}
