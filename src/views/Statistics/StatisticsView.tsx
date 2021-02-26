import React from 'react'

import { Row, Col } from 'antd'
import { Helmet, StatsCard } from 'components'
import { Percent, Amount } from 'multichain-sdk'

import { useGlobalState } from 'redux/hooks'
import { useMidgard } from 'redux/midgard/hooks'

const StatisticsView: React.FC = (): JSX.Element => {
  const { stats, networkData } = useMidgard()
  const { runeToCurrency } = useGlobalState()

  const bondingAPYLabel = new Percent(networkData?.bondingAPY ?? 0).toFixed(2)
  const liquidityAPYLabel = new Percent(networkData?.liquidityAPY ?? 0).toFixed(
    2,
  )

  const swapVolume = Amount.fromMidgard(stats?.swapVolume)
  const addLiquidityVolume = Amount.fromMidgard(stats?.addLiquidityVolume)
  const withdrawVolume = Amount.fromMidgard(stats?.withdrawVolume)

  const swapCount = Amount.fromNormalAmount(stats?.swapCount)
  const addLiquidityCount = Amount.fromNormalAmount(stats?.addLiquidityCount)
  const withdrawCount = Amount.fromNormalAmount(stats?.withdrawCount)

  const totalVolume = swapVolume.add(addLiquidityVolume).add(withdrawVolume)
  const totalTx = swapCount.add(addLiquidityCount).add(withdrawCount)

  const statsData = React.useMemo(() => {
    return [
      {
        title: 'Total Volume',
        value: runeToCurrency(totalVolume).toCurrencyFormat(0),
      },
      {
        title: 'Total Tx',
        value: totalTx.toFixed(),
      },
      {
        title: 'Total Rune Depth',
        value: runeToCurrency(
          Amount.fromMidgard(stats?.runeDepth),
        ).toCurrencyFormat(0),
      },
      {
        title: 'Rune Price in USD',
        value: `$${Amount.fromNormalAmount(stats?.runePriceUSD).toFixed(4)}`,
      },
      {
        title: 'Swap Count',
        value: Amount.fromNormalAmount(stats?.swapCount).toFixed(0),
      },
      {
        title: 'Unique Swapper Count',
        value: Amount.fromMidgard(stats?.uniqueSwapperCount).toFixed(0),
      },
      {
        title: 'Swap Count 24H',
        value: Amount.fromNormalAmount(stats?.swapCount24h).toFixed(0),
      },
      {
        title: 'Swap Count 30D',
        value: Amount.fromNormalAmount(stats?.swapCount30d).toFixed(0),
      },
      {
        title: 'Swap Volume',
        value: runeToCurrency(
          Amount.fromMidgard(stats?.swapVolume),
        ).toCurrencyFormat(0),
      },
      {
        title: 'Add Liquidity Count',
        value: Amount.fromNormalAmount(stats?.addLiquidityCount).toFixed(0),
      },
      {
        title: 'Add Liquidity Volume',
        value: runeToCurrency(
          Amount.fromMidgard(stats?.addLiquidityVolume),
        ).toCurrencyFormat(0),
      },
      {
        title: 'Withdraw Count',
        value: Amount.fromNormalAmount(stats?.withdrawCount).toFixed(0),
      },
      {
        title: 'Withdraw Volume',
        value: runeToCurrency(
          Amount.fromMidgard(stats?.withdrawVolume),
        ).toCurrencyFormat(0),
      },
      {
        title: 'Monthly Active Users',
        value: Amount.fromNormalAmount(stats?.monthlyActiveUsers).toFixed(0),
      },
      {
        title: 'Daily Active Users',
        value: Amount.fromNormalAmount(stats?.dailyActiveUsers).toFixed(0),
      },
      {
        title: 'Total Pooled',
        value: runeToCurrency(
          Amount.fromMidgard(networkData?.totalPooledRune),
        ).toCurrencyFormat(2),
      },
      {
        title: 'Total Reserve',
        value: runeToCurrency(
          Amount.fromMidgard(networkData?.totalReserve),
        ).toCurrencyFormat(2),
      },
      {
        title: 'Active Node Count',
        value: Amount.fromNormalAmount(networkData?.activeNodeCount).toFixed(0),
      },
      {
        title: 'Standby Node Count',
        value: Amount.fromNormalAmount(networkData?.standbyNodeCount).toFixed(
          0,
        ),
      },
      {
        title: 'Next Churn Height',
        value: Amount.fromNormalAmount(networkData?.nextChurnHeight).toFixed(0),
      },
      {
        title: 'Bonding APY',
        value: bondingAPYLabel,
      },
      {
        title: 'Liquidity APY',
        value: liquidityAPYLabel,
      },
    ]
  }, [
    stats,
    networkData,
    bondingAPYLabel,
    liquidityAPYLabel,
    totalVolume,
    totalTx,
    runeToCurrency,
  ])

  return (
    <Row gutter={[16, 16]}>
      <Helmet title="Stats" content="Stats" />
      {statsData.map((statProps, index) => {
        return (
          <Col
            key={index}
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 8 }}
            lg={{ span: 8 }}
            xl={{ span: 4 }}
          >
            <StatsCard {...statProps} />
          </Col>
        )
      })}
    </Row>
  )
}

export default StatisticsView
