import React, { useEffect, useMemo, useState } from 'react'

import { useDispatch } from 'react-redux'

import { Grid } from 'antd'
import { Pool, Amount } from 'multichain-sdk'

import { useMidgard } from 'redux/midgard/hooks'

import { Chart } from '../Chart'
import { ChartDetail, ChartValues, ChartData } from '../Chart/types'

export type PoolChartProps = {
  pool: Pool
}

export const PoolChart = ({ pool, ...otherProps }: PoolChartProps) => {
  const dispatch = useDispatch()
  const isDesktopView = Grid.useBreakpoint()?.md ?? true

  const {
    getPoolHistory,
    swapHistory,
    swapHistoryLoading,
    depthHistory,
    depthHistoryLoading,
    liquidityHistory,
    liquidityHistoryLoading,
  } = useMidgard()

  const isLoading = useMemo(
    () => depthHistoryLoading || liquidityHistoryLoading || swapHistoryLoading,
    [depthHistoryLoading, liquidityHistoryLoading, swapHistoryLoading],
  )

  useEffect(() => {
    getPoolHistory(pool.asset.toString())
  }, [dispatch, getPoolHistory, pool])

  const [chartIndex, setChartIndex] = useState('Volume')
  const chartIndexes = useMemo(
    () =>
      isDesktopView ? ['Volume', 'Liquidity', 'Price'] : ['Volume', 'Price'],
    [isDesktopView],
  )

  const chartValueUnit = 'ᚱ'

  const initialChartData = useMemo(() => {
    const initialData: ChartData = {}
    const defaultChartValues: ChartValues = []

    chartIndexes.forEach((index) => {
      initialData[index] = {
        values: defaultChartValues,
        loading: true,
      }
    })

    return initialData
  }, [chartIndexes])

  const chartData: ChartData = useMemo(() => {
    if (isLoading || !depthHistory || !liquidityHistory || !swapHistory) {
      return initialChartData
    }

    const depthData = depthHistory.intervals || []
    const liquidityData = liquidityHistory.intervals || []
    const swapData = swapHistory.intervals || []

    const volumeChart: ChartDetail[] = []
    const liquidityChart: ChartDetail[] = []
    const priceChart: ChartDetail[] = []

    depthData.forEach((data, index) => {
      const liquidityValue = liquidityData[index]
      const swapValues = swapData[index]
      const time = Number(data?.startTime ?? 0)

      const swapValue = Amount.fromMidgard(swapValues?.totalVolume)
      const addValue = Amount.fromMidgard(liquidityValue?.addLiquidityVolume)
      const withdrawValue = Amount.fromMidgard(liquidityValue?.withdrawVolume)

      const total = swapValue.add(addValue).add(withdrawValue)
      const liquidity = Amount.fromMidgard(data?.runeDepth).mul(2)
      const usdPrice = Amount.fromNormalAmount(data?.assetPriceUSD)

      volumeChart.push({
        time,
        value: total.assetAmount.toString(),
      })
      liquidityChart.push({
        time,
        value: liquidity.assetAmount.toString(),
      })
      priceChart.push({
        time,
        value: usdPrice.assetAmount.toString(),
      })
    })

    return {
      Volume: {
        values: volumeChart,
        unit: chartValueUnit,
      },
      Liquidity: {
        values: liquidityChart,
        unit: chartValueUnit,
      },
      Price: {
        values: priceChart,
        unit: '$',
      },
    }
  }, [depthHistory, liquidityHistory, swapHistory, isLoading, initialChartData])

  return (
    <Chart
      chartIndexes={chartIndexes}
      chartData={chartData}
      selectedIndex={chartIndex}
      selectChart={setChartIndex}
      {...otherProps}
    />
  )
}
