import React from 'react'

import { Row, Col } from 'antd'
import { Helmet, StatsCard } from 'components'
import { Percent, Amount } from 'multichain-sdk'

import { useMidgard } from 'redux/midgard/hooks'

const StatisticsView: React.FC = (): JSX.Element => {
  const { stats, networkData } = useMidgard()

  const bondingAPYLabel = new Percent(networkData?.bondingAPY ?? 0).toFixed(2)
  const liquidityAPYLabel = new Percent(networkData?.liquidityAPY ?? 0).toFixed(
    2,
  )

  const statsData = React.useMemo(() => {
    return [
      {
        title: 'Monthly Active Users',
        value: Amount.fromNormalAmount(stats?.monthlyActiveUsers).toFixed(0),
      },
      {
        title: 'Daily Active Users',
        value: Amount.fromNormalAmount(stats?.dailyActiveUsers).toFixed(0),
      },
      {
        title: 'Total Rune Depth',
        value: Amount.fromMidgard(stats?.runeDepth).toFixed(0),
      },
      {
        title: 'Rune Price in USD',
        value: Amount.fromNormalAmount(stats?.runePriceUSD).toFixed(4),
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
        value: Amount.fromMidgard(stats?.swapVolume).toFixed(0),
      },
      {
        title: 'Add Liquidity Count',
        value: Amount.fromNormalAmount(stats?.addLiquidityCount).toFixed(0),
      },
      {
        title: 'Add Liquidity Volume',
        value: Amount.fromMidgard(stats?.addLiquidityVolume).toFixed(0),
      },
      {
        title: 'Withdraw Count',
        value: Amount.fromNormalAmount(stats?.withdrawCount).toFixed(0),
      },
      {
        title: 'Withdraw Volume',
        value: Amount.fromMidgard(stats?.withdrawVolume).toFixed(0),
      },
      {
        title: 'Total Pooled',
        value: Amount.fromMidgard(networkData?.totalPooledRune).toFixed(2),
      },
      {
        title: 'Total Reserve',
        value: Amount.fromMidgard(networkData?.totalReserve).toFixed(2),
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
        value: `${bondingAPYLabel} %`,
      },
      {
        title: 'Liquidity APY',
        value: `${liquidityAPYLabel} %`,
      },
    ]
  }, [stats, networkData, bondingAPYLabel, liquidityAPYLabel])

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
