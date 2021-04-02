import React, { useEffect } from 'react'

import { Link } from 'react-router-dom'

import { PanelView, FancyButton, Label, MemberPoolCard } from 'components'
import { MemberPool } from 'midgard-sdk'
import { Asset } from 'multichain-sdk'

import { useMidgard } from 'redux/midgard/hooks'
import { useWallet } from 'redux/wallet/hooks'

import { getAddLiquidityRoute } from 'settings/constants'

import * as Styled from './Liquidity.style'

const LiquidityView = () => {
  const { memberDetails, getMemberDetails } = useMidgard()
  const { wallet } = useWallet()
  useEffect(() => {
    getMemberDetails()
  }, [getMemberDetails])

  return (
    <PanelView meta="Liquidity" poolAsset={Asset.BTC()} type="liquidity">
      {!wallet && <Label>Please connect wallet.</Label>}
      {wallet && (
        <>
          <Styled.ToolContainer>
            <Link to={getAddLiquidityRoute(Asset.BTC())}>
              <FancyButton>Add Liquidity</FancyButton>
            </Link>
          </Styled.ToolContainer>
          {memberDetails.pools.map((memberPool: MemberPool, index: number) => (
            <MemberPoolCard data={memberPool} key={index} />
          ))}
        </>
      )}
    </PanelView>
  )
}

export default LiquidityView
