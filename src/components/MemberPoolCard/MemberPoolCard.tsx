import React from 'react'

import { ChevronUp, ChevronDown } from 'react-feather'
import { Link } from 'react-router-dom'

import { MemberPool } from 'midgard-sdk'
import moment from 'moment'
import { Amount, Asset } from 'multichain-sdk'

import { ExternalLink } from 'components/Link'

import {
  getAddLiquidityRoute,
  getPoolDetailRouteFromAsset,
  getWithdrawRoute,
} from 'settings/constants'

import { AssetData } from '../Assets'
import { CoreButton, FancyButton, Information } from '../UIElements'
import * as Styled from './MemberPoolCard.style'

export type MemberPoolCardProps = {
  data: MemberPool
}

export const MemberPoolCard = ({ data }: MemberPoolCardProps) => {
  const { pool, liquidityUnits, runeAdded, assetAdded, dateLastAdded } = data
  const [collapsed, setCollapsed] = React.useState(true)

  const toggle = React.useCallback(() => {
    setCollapsed(!collapsed)
  }, [collapsed])

  const poolAsset = Asset.fromAssetString(pool)

  if (!poolAsset) return null

  return (
    <Styled.Container>
      <Styled.Header>
        <ExternalLink link={getPoolDetailRouteFromAsset(poolAsset)}>
          <AssetData asset={poolAsset} size="normal" />
        </ExternalLink>
        <Styled.HeaderRight>
          <CoreButton onClick={toggle}>
            {!collapsed ? <ChevronUp /> : <ChevronDown />}
          </CoreButton>
        </Styled.HeaderRight>
      </Styled.Header>
      {!collapsed && (
        <>
          <Styled.Content>
            <Information
              title="Pooled Rune"
              description={`${Amount.fromMidgard(runeAdded).toFixed(2)} RUNE`}
            />
            <Information
              title="Pooled Asset"
              description={`${Amount.fromMidgard(assetAdded).toFixed(2)} ${
                poolAsset.ticker
              }`}
            />
            <Information
              title="Pool Units"
              description={Amount.fromMidgard(liquidityUnits).toFixed(2)}
            />
            <Information
              title="Last Added"
              description={moment
                .unix(Number(dateLastAdded))
                .format('YYYY-MM-DD')}
            />
          </Styled.Content>
          <Styled.Footer>
            <Link to={getAddLiquidityRoute(poolAsset)}>
              <FancyButton size="small">Add</FancyButton>
            </Link>
            <Link to={getWithdrawRoute(poolAsset)}>
              <FancyButton size="small">Withdraw</FancyButton>
            </Link>
          </Styled.Footer>
        </>
      )}
    </Styled.Container>
  )
}
