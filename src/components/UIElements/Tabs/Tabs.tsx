import React from 'react'

import { Tabs as AntTabs } from 'antd'
import { TabsProps } from 'antd/lib/tabs'

import { StyledTab } from './Tabs.style'

type ComponentProps = {
  action: boolean
  withBorder: boolean
  children: React.ReactNode
}

export type Props = ComponentProps & TabsProps

export const Tabs = (props: Props) => {
  return <StyledTab {...props} />
}

export const { TabPane } = AntTabs
