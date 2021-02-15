import React from 'react'

import { Tabs as AntTabs } from 'antd'
import { TabsProps } from 'antd/lib/tabs'

import { StyledTab } from './Tabs.style'

type ComponentProps = {
  action: boolean
  withBorder?: boolean
  children: React.ReactNode
}

export type Props = ComponentProps & TabsProps

export const Tabs = (props: Props) => {
  const { withBorder = true } = props
  return <StyledTab withBorder={withBorder} {...props} />
}

export const { TabPane } = AntTabs
