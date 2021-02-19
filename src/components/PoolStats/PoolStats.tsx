import React, { useEffect } from 'react'

import { useDispatch } from 'react-redux'

import { Row, Col } from 'antd'
import { Percent, Amount, Pool } from 'multichain-sdk'

import { useMidgard } from 'redux/midgard/hooks'

import { StatsCard } from '../UIElements/StatsCard'

export type PoolStatsProps = {
  pool: Pool
}

export const PoolStats = ({ pool }: PoolStatsProps): JSX.Element => {
  const dispatch = useDispatch()
  const { poolStatsLoading, poolStats, actions } = useMidgard()

  useEffect(() => {
    dispatch(
      actions.getPoolStats({ asset: pool.asset.toString(), period: '30d' }),
    )
  }, [dispatch, actions, pool])

  const poolAPY = new Percent(pool?.detail?.poolAPY ?? 0).toFixed(2)

  const swapVolume = Amount.fromMidgard(poolStats?.swapVolume)
  const addLiquidityVolume = Amount.fromMidgard(poolStats?.addLiquidityVolume)
  const withdrawVolume = Amount.fromMidgard(poolStats?.withdrawVolume)

  const swapCount = Amount.fromMidgard(poolStats?.swapCount)
  const addLiquidityCount = Amount.fromMidgard(poolStats?.addLiquidityCount)
  const withdrawCount = Amount.fromMidgard(poolStats?.withdrawCount)

  const totalVolume = swapVolume.add(addLiquidityVolume).add(withdrawVolume)
  const totalTx = swapCount.add(addLiquidityCount).add(withdrawCount)

  const statsData = React.useMemo(() => {
    return [
      {
        title: 'Total Volume',
        value: totalVolume.toFixed(0),
      },
      {
        title: 'Liquidity',
        value: Amount.fromMidgard(pool?.detail?.runeDepth).mul(2).toFixed(0),
      },
      {
        title: 'Volume 24H',
        value: Amount.fromMidgard(pool?.detail?.volume24h).toFixed(0),
      },
      {
        title: 'Pool Units',
        value: Amount.fromMidgard(pool?.detail?.units).toFixed(0),
      },
      {
        title: 'Asset USD Price',
        value: Amount.fromNormalAmount(pool?.detail?.assetPriceUSD).toFixed(3),
      },
      {
        title: 'APY',
        value: poolAPY,
      },
      {
        title: 'Total Tx',
        value: totalTx.toFixed(0),
      },
      {
        title: 'Members',
        value: Amount.fromNormalAmount(poolStats?.uniqueMemberCount).toFixed(0),
      },
    ]
  }, [pool, poolAPY, poolStats, totalVolume, totalTx])

  if (poolStatsLoading || !poolStats) return <></>

  return (
    <Row gutter={[16, 16]}>
      {statsData.map((statProps, index) => {
        return (
          <Col
            key={index}
            xs={{ span: 12 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
            xl={{ span: 12 }}
          >
            <StatsCard {...statProps} />
          </Col>
        )
      })}
    </Row>
  )
}
