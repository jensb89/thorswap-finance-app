import React, { useEffect, useMemo, useState } from 'react'

import { Grid, Row, Col } from 'antd'
import { Amount } from 'multichain-sdk'

import { Label } from 'components/UIElements'

import { useMidgard } from 'redux/midgard/hooks'

import { Chart } from '../Chart'
import { ChartDetail, ChartValues, ChartData } from '../Chart/types'

// display volume and earning time series graph
export const GlobalChart = () => {
  const isDesktopView = Grid.useBreakpoint()?.md ?? true

  const {
    getGlobalHistory,
    isGlobalHistoryLoading,
    earningsHistory,
    swapHistory,
    liquidityHistory,
  } = useMidgard()

  useEffect(() => {
    getGlobalHistory()
  }, [getGlobalHistory])

  const [volumeChartIndex, setVolumeChartIndex] = useState('Total')
  const [earningChartIndex, setEarningChartIndex] = useState('Total')
  const volumeChartIndexes = useMemo(
    () =>
      isDesktopView ? ['Total', 'Swap', 'Add', 'Withdraw'] : ['Total', 'Swap'],
    [isDesktopView],
  )
  const earningChartIndexes = useMemo(
    () =>
      isDesktopView
        ? ['Total', 'Liquidity', 'Fee', 'Bonding']
        : ['Total', 'Liquidity'],
    [isDesktopView],
  )

  const chartValueUnit = 'ᚱ'

  const initialChartData = useMemo(() => {
    const initialData: ChartData = {}
    const defaultChartValues: ChartValues = []

    const chartIndexes = [...volumeChartIndexes, ...earningChartIndexes]

    chartIndexes.forEach((chartIndex) => {
      initialData[chartIndex] = {
        values: defaultChartValues,
        loading: true,
      }
    })

    return initialData
  }, [volumeChartIndexes, earningChartIndexes])

  const volumeChartData: ChartData = useMemo(() => {
    if (isGlobalHistoryLoading || !swapHistory || !liquidityHistory) {
      return initialChartData
    }

    const swapData = swapHistory.intervals || []
    const liquidityData = liquidityHistory.intervals || []

    const totalVolume: ChartDetail[] = []
    const swapVolume: ChartDetail[] = []
    const addVolume: ChartDetail[] = []
    const withdrawVolume: ChartDetail[] = []

    swapData.forEach((data, index) => {
      const liquidityValue = liquidityData[index]
      const time = Number(data?.startTime ?? 0)

      const swapValue = Amount.fromMidgard(data?.totalVolume)
      const addValue = Amount.fromMidgard(liquidityValue?.addLiquidityVolume)
      const withdrawValue = Amount.fromMidgard(liquidityValue?.withdrawVolume)

      const total = swapValue.add(addValue).add(withdrawValue)

      swapVolume.push({
        time,
        value: swapValue.assetAmount.toString(),
      })
      addVolume.push({
        time,
        value: addValue.assetAmount.toString(),
      })
      withdrawVolume.push({
        time,
        value: withdrawValue.assetAmount.toString(),
      })
      totalVolume.push({
        time,
        value: total.assetAmount.toString(),
      })
    })

    return {
      Total: {
        values: totalVolume,
        unit: chartValueUnit,
      },
      Swap: {
        values: swapVolume,
        unit: chartValueUnit,
      },
      Add: {
        values: addVolume,
        unit: chartValueUnit,
      },
      Withdraw: {
        values: withdrawVolume,
        unit: chartValueUnit,
      },
    }
  }, [swapHistory, liquidityHistory, isGlobalHistoryLoading, initialChartData])

  const earningChartData: ChartData = useMemo(() => {
    if (isGlobalHistoryLoading || !earningsHistory) {
      return initialChartData
    }

    const earningsData = earningsHistory.intervals || []

    const totalEarning: ChartDetail[] = []
    const bondingEarning: ChartDetail[] = []
    const liquidityEarning: ChartDetail[] = []
    const liquidityFee: ChartDetail[] = []

    earningsData.forEach((data) => {
      const time = Number(data?.startTime ?? 0)
      totalEarning.push({
        time,
        value: Amount.fromMidgard(data?.earnings).assetAmount.toString(),
      })
      bondingEarning.push({
        time,
        value: Amount.fromMidgard(data?.bondingEarnings).assetAmount.toString(),
      })
      liquidityEarning.push({
        time,
        value: Amount.fromMidgard(
          data?.liquidityEarnings,
        ).assetAmount.toString(),
      })
      liquidityFee.push({
        time,
        value: Amount.fromMidgard(data?.liquidityFees).assetAmount.toString(),
      })
    })

    return {
      Total: {
        values: totalEarning,
        unit: chartValueUnit,
      },
      Liquidity: {
        values: liquidityEarning,
        unit: chartValueUnit,
      },
      Bonding: {
        values: bondingEarning,
        unit: chartValueUnit,
      },
      Fee: {
        values: liquidityFee,
        unit: chartValueUnit,
      },
    }
  }, [earningsHistory, isGlobalHistoryLoading, initialChartData])

  return (
    <Row gutter={[12, 12]}>
      <Col xs={24} md={12}>
        <Label size="big" color="primary">
          Volume
        </Label>
        <Chart
          chartIndexes={volumeChartIndexes}
          chartData={volumeChartData}
          selectedIndex={volumeChartIndex}
          selectChart={setVolumeChartIndex}
        />
      </Col>
      <Col xs={24} md={12}>
        <Label size="big" color="primary">
          Earnings
        </Label>
        <Chart
          chartIndexes={earningChartIndexes}
          chartData={earningChartData}
          selectedIndex={earningChartIndex}
          selectChart={setEarningChartIndex}
        />
      </Col>
    </Row>
  )
}
