import React, { useMemo } from 'react'

import { BarChartOutlined } from '@ant-design/icons'
import { Asset } from 'multichain-sdk'

import { getPoolDetailRouteFromAsset } from 'settings/constants'

import { Helmet } from '../Helmet'
import { ExternalButtonLink } from '../Link'
import { SettingsOverlay } from '../SettingsOverlay'
import { Tooltip, CoreButton, Label, ContentTitle } from '../UIElements'
import * as Styled from './PanelView.style'

export type PanelViewProps = {
  type: 'swap' | 'provide' | 'withdraw'
  meta: string
  poolAsset: Asset
  children: React.ReactNode
}

const selectedItemProps = {
  weight: 'bold',
  color: 'primary',
}

export const PanelView = ({
  type,
  meta,
  poolAsset,
  children,
}: PanelViewProps) => {
  const swapMenuProps = useMemo(
    () => (type === 'swap' ? selectedItemProps : {}),
    [type],
  )
  const provideMenuProps = useMemo(
    () => (type === 'provide' ? selectedItemProps : {}),
    [type],
  )
  const withdrawMenuProps = useMemo(
    () => (type === 'withdraw' ? selectedItemProps : {}),
    [type],
  )

  return (
    <Styled.Container>
      <Helmet title={meta} content={meta} />
      <ContentTitle>
        <Styled.HeaderContent>
          <Styled.HeaderMenu>
            <CoreButton>
              <Label size="big" {...swapMenuProps}>
                SWAP
              </Label>
            </CoreButton>
            <CoreButton>
              <Label size="big" {...provideMenuProps}>
                PROVIDE
              </Label>
            </CoreButton>
            <CoreButton>
              <Label size="big" {...withdrawMenuProps}>
                WITHDRAW
              </Label>
            </CoreButton>
          </Styled.HeaderMenu>
          <Styled.HeaderActions>
            <ExternalButtonLink link={getPoolDetailRouteFromAsset(poolAsset)}>
              <Tooltip tooltip="View Pool Analytics ↗" placement="top">
                <Styled.PoolDetailLink>
                  <BarChartOutlined />
                </Styled.PoolDetailLink>
              </Tooltip>
            </ExternalButtonLink>
            <SettingsOverlay />
          </Styled.HeaderActions>
        </Styled.HeaderContent>
      </ContentTitle>
      <Styled.ContentPanel>{children}</Styled.ContentPanel>
    </Styled.Container>
  )
}
