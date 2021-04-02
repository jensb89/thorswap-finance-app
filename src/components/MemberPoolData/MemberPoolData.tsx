import React from 'react'

import { MemberPool } from 'midgard-sdk'
import moment from 'moment'
import { Amount, Asset, Percent } from 'multichain-sdk'

import { ExternalLink } from 'components/Link'

import { getPoolDetailRouteFromAsset } from 'settings/constants'

import { AssetData } from '../Assets'
import { Information, Label } from '../UIElements'
import * as Styled from './MemberPoolData.style'

export type MemberPoolDataProps = {
  data: MemberPool
  share: Percent
}

export const MemberPoolData = ({ data, share }: MemberPoolDataProps) => {
  const { pool, liquidityUnits, runeAdded, assetAdded, dateLastAdded } = data

  const poolAsset = Asset.fromAssetString(pool)

  if (!poolAsset) return null

  return (
    <Styled.Container>
      <Styled.Header>
        <ExternalLink link={getPoolDetailRouteFromAsset(poolAsset)}>
          <AssetData asset={poolAsset} size="normal" />
        </ExternalLink>
        <Styled.HeaderRight>
          <Label>Your Share: {share.toFixed(2)}</Label>
        </Styled.HeaderRight>
      </Styled.Header>
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
          description={moment.unix(Number(dateLastAdded)).format('YYYY-MM-DD')}
        />
      </Styled.Content>
    </Styled.Container>
  )
}
