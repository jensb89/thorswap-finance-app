import React, { useMemo } from 'react'

import { Link } from 'react-router-dom'

import {
  SwapOutlined,
  LoginOutlined,
  LogoutOutlined,
  BarChartOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { Asset } from 'multichain-sdk'

import {
  getPoolDetailRouteFromAsset,
  getSwapRoute,
  getAddLiquidityRoute,
  getWithdrawRoute,
  LIQUIDITY_ROUTE,
} from 'settings/constants'

import { Helmet } from '../Helmet'
import { ExternalButtonLink } from '../Link'
import { SettingsOverlay } from '../SettingsOverlay'
import { Tooltip, CoreButton, ContentTitle } from '../UIElements'
import * as Styled from './PanelView.style'

export type PanelViewProps = {
  type: 'swap' | 'add' | 'withdraw' | 'liquidity'
  meta: string
  poolAsset: Asset
  children: React.ReactNode
}

const SwapButton = ({ selected }: { selected: boolean }) => (
  <CoreButton>
    <Tooltip tooltip="Swap" placement="top">
      <Styled.MenuIconWrapper selected={selected}>
        <SwapOutlined />
      </Styled.MenuIconWrapper>
    </Tooltip>
  </CoreButton>
)

const LiquidityButton = ({ selected }: { selected: boolean }) => (
  <CoreButton>
    <Tooltip tooltip="View Liquidity" placement="top">
      <Styled.MenuIconWrapper selected={selected}>
        <UnorderedListOutlined />
      </Styled.MenuIconWrapper>
    </Tooltip>
  </CoreButton>
)

const AddLiquidityButton = ({ selected }: { selected: boolean }) => (
  <CoreButton>
    <Tooltip tooltip="Add Liquidity" placement="top">
      <Styled.MenuIconWrapper selected={selected}>
        <LoginOutlined />
      </Styled.MenuIconWrapper>
    </Tooltip>
  </CoreButton>
)

const WithdrawButton = ({ selected }: { selected: boolean }) => (
  <CoreButton>
    <Tooltip tooltip="Withdraw" placement="top">
      <Styled.MenuIconWrapper selected={selected}>
        <LogoutOutlined />
      </Styled.MenuIconWrapper>
    </Tooltip>
  </CoreButton>
)

type MenuButtonProps = {
  selected: boolean
  route: string
  children: React.ReactElement
}

const MenuButton: React.FC<MenuButtonProps> = ({
  selected,
  route,
  children,
}) => {
  if (selected) {
    return children
  }

  return <Link to={route}>{children}</Link>
}

export const PanelView = ({
  type,
  meta,
  poolAsset,
  children,
}: PanelViewProps) => {
  const swapRoute = useMemo(() => {
    return getSwapRoute(poolAsset, Asset.RUNE())
  }, [poolAsset])
  const addLiquidityRoute = useMemo(() => {
    return getAddLiquidityRoute(poolAsset)
  }, [poolAsset])
  const withdrawRoute = useMemo(() => {
    return getWithdrawRoute(poolAsset)
  }, [poolAsset])

  return (
    <Styled.Container>
      <Helmet title={meta} content={meta} />
      <ContentTitle>
        <Styled.HeaderContent>
          <Styled.HeaderMenu>
            <MenuButton selected={type === 'swap'} route={swapRoute}>
              <SwapButton selected={type === 'swap'} />
            </MenuButton>
            <MenuButton selected={type === 'add'} route={addLiquidityRoute}>
              <AddLiquidityButton selected={type === 'add'} />
            </MenuButton>
            <MenuButton selected={type === 'withdraw'} route={withdrawRoute}>
              <WithdrawButton selected={type === 'withdraw'} />
            </MenuButton>
            <MenuButton selected={type === 'liquidity'} route={LIQUIDITY_ROUTE}>
              <LiquidityButton selected={type === 'liquidity'} />
            </MenuButton>
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
