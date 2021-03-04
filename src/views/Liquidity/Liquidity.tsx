import React, { useMemo } from 'react'

import { useParams } from 'react-router'

import { Row, Col } from 'antd'
import { Helmet } from 'components'
import { Asset, getWalletAddressByChain, Pool } from 'multichain-sdk'

import { useMidgard } from 'redux/midgard/hooks'
import { useWallet } from 'redux/wallet/hooks'

import * as Styled from './Liquidity.style'
import { PoolShare } from './PoolShare'

const LiquidityView = () => {
  const { asset: assetStr } = useParams<{ asset: string }>()
  const { pools } = useMidgard()
  const { wallet } = useWallet()

  const asset = Asset.fromAssetString(assetStr)

  if (asset && wallet) {
    const pool = Pool.byAsset(asset, pools)
    const address = getWalletAddressByChain(wallet, asset.chain)
    if (pool && address) {
      return <LiquidityPage asset={asset} pool={pool} address={address} />
    }
  }

  return null
}

const LiquidityPage = ({
  asset,
  pool,
  address,
}: {
  asset: Asset
  pool: Pool
  address: string
}) => {
  const title = useMemo(() => `Manage ${asset.ticker}`, [asset])

  return (
    <Styled.Container>
      <Helmet title={title} content={title} />
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={16} md={16}>
          Deposit section
        </Col>
        <Col xs={24} sm={8} md={8}>
          <PoolShare asset={asset} pool={pool} address={address} />
        </Col>
      </Row>
    </Styled.Container>
  )
}

export default LiquidityView
